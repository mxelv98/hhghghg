import { Router } from 'express';
import { supabaseAdmin as supabase } from '../supabase.js';
import { authGuard } from '../middlewares/auth.js';

const router = Router();

router.post('/initiate', authGuard, async (req, res) => {
    const { userId, planId, timeOption, promoCode, onexbetId } = req.body;

    if (!userId || !planId || !timeOption) {
        return res.status(400).json({ error: 'Missing required checkout information' });
    }

    try {
        // ... pricing logic ...
        const pricing: any = {
            'vip_vup': { '30 Minutes': 22, '1 Hour': 40, '2 Hours': 70 },
            'vip_elite': { '30 Minutes': 66, '1 Hour': 120, '2 Hours': 220, '3 Hour': 300, '3 Hours': 300 }
        };

        const basePrice = pricing[planId]?.[timeOption] || 0;
        if (basePrice === 0) {
            return res.status(400).json({ error: 'Invalid plan or duration option' });
        }

        let price = basePrice;

        // 2. Apply promo code if provided
        if (promoCode) {
            const VALID_PROMOS = { 'PLUXO20': 0.2, 'VIP10': 0.1, 'ELITE5': 0.05 };
            const discount = VALID_PROMOS[promoCode.toUpperCase() as keyof typeof VALID_PROMOS] || 0;
            price = price * (1 - discount);
        }

        // 3. Parse duration to minutes
        const [value, unit] = timeOption.split(' ');
        const durationMinutes = unit.toLowerCase().includes('hour')
            ? parseInt(value) * 60
            : parseInt(value);

        // 4. Create a pending payment record in Supabase
        const { data: payment, error: pError } = await supabase
            .from('payments')
            .insert({
                user_id: userId,
                plan_type: planId === 'vip_elite' ? 'vip' : 'vup',
                amount: price,
                currency: 'USD',
                status: 'pending',
                duration_minutes: durationMinutes,
                provider: 'nowpayments',
                onexbet_id: onexbetId // Store 1xbet ID
            })
            .select()
            .single();

        if (pError) throw pError;

        // 5. Initiate NOWPayments transaction
        const nowPaymentsUrl = 'https://api.nowpayments.io/v1/payment';
        const apiKey = process.env.NOWPAYMENTS_API_KEY;

        try {
            const npResponse = await fetch(nowPaymentsUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey || ''
                },
                body: JSON.stringify({
                    price_amount: price,
                    price_currency: 'usd',
                    pay_currency: 'usdttrc20', // Default to USDT (TRC-20) for low fees
                    ipn_callback_url: `${process.env.VITE_BACKEND_URL || 'https://pluxo-backend.vercel.app'}/api/webhooks/nowpayments`,
                    order_id: payment.id,
                    order_description: `${planId === 'vip_elite' ? 'ELITE' : 'VUP'} Access - ${timeOption}`
                })
            });

            if (!npResponse.ok) {
                const npError = await npResponse.json();
                console.error('NOWPayments API Error:', npError);
                throw new Error('Payment gateway synchronization failed');
            }

            const npData = await npResponse.json();

            // 6. Update payment record with external payment ID
            await supabase
                .from('payments')
                .update({ external_id: npData.payment_id })
                .eq('id', payment.id);

            // 7. Return success with real payment details
            return res.json({
                success: true,
                orderId: payment.id,
                amount: price,
                checkoutUrl: npData.invoice_url || `https://nowpayments.io/payment?payment_id=${npData.payment_id}`
            });

        } catch (npErr) {
            console.error('NOWPayments integration failed:', npErr);
            // Fallback to internal simulation link if API fails, but mark as error ideally
            return res.status(502).json({ error: 'Payment gateway offline. Please try again later.' });
        }

    } catch (error: any) {
        console.error('Checkout initialization failed:', error);
        return res.status(500).json({ error: 'Failed to initiate checkout' });
    }
});

export default router;
