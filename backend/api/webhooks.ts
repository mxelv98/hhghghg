import { Router } from 'express';
import crypto from 'crypto';
import { supabaseAdmin as supabase } from '../supabase.js';

const router = Router();

/**
 * NOWPayments IPN (Instant Payment Notification)
 * This endpoint is called by NOWPayments when payment status changes.
 */
router.post('/nowpayments', async (req, res) => {
    try {
        const hmac = req.headers['x-nowpayments-sig'];
        const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

        // 1. Verify Signature (if secret is configured)
        if (ipnSecret && ipnSecret !== 'place_your_ipn_secret_here') {
            const notificationsPayload = JSON.stringify(req.body, Object.keys(req.body).sort());
            const signature = crypto
                .createHmac('sha512', ipnSecret)
                .update(notificationsPayload)
                .digest('hex');

            if (signature !== hmac) {
                console.error('IPN Signature mismatch!');
                return res.status(400).send('Invalid signature');
            }
        }

        const { payment_status, order_id, payment_id } = req.body;

        console.log(`IPN Received: [${payment_id}] status: ${payment_status} for order: ${order_id}`);

        // 2. Only process if status is 'finished'
        if (payment_status !== 'finished') {
            // Update status to whatever it is (waiting, confirming, etc)
            await supabase
                .from('payments')
                .update({ status: payment_status })
                .eq('id', order_id);

            return res.status(200).send('OK');
        }

        // 3. Activation Logic
        // Fetch the original payment record
        const { data: payment, error: pError } = await supabase
            .from('payments')
            .select('*')
            .eq('id', order_id)
            .single();

        if (pError || !payment) {
            console.error('Original payment record not found:', order_id);
            return res.status(404).send('Order not found');
        }

        // Only activate if not already activated
        if (payment.status === 'finished') {
            return res.status(200).send('Already processed');
        }

        // Update payment status
        await supabase
            .from('payments')
            .update({ status: 'finished' })
            .eq('id', order_id);

        // Calculate expiration
        const startsAt = new Date();
        const endsAt = new Date(startsAt.getTime() + (payment.duration_minutes * 60 * 1000));

        // Create/Update VIP Subscription
        const { error: subError } = await supabase
            .from('vip_subscriptions')
            .upsert({
                user_id: payment.user_id,
                plan_type: payment.plan_type,
                starts_at: startsAt.toISOString(),
                ends_at: endsAt.toISOString(),
                active: true
            }, { onConflict: 'user_id' });

        if (subError) {
            console.error('Failed to update VIP subscription:', subError);
            return res.status(500).send('Failsafe activation failed');
        }

        console.log(`User ${payment.user_id} activated for ${payment.duration_minutes}m until ${endsAt.toISOString()}`);

        return res.status(200).send('OK');

    } catch (error: any) {
        console.error('IPN processing error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

export default router;
