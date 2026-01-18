import express from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = express.Router();

router.get('/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !user) return res.status(401).json({ error: 'Invalid token' });

        // Get Profile for Role
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        // Check VIP
        const { data: vip } = await supabaseAdmin
            .from('vip_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('active', true)
            .gt('ends_at', new Date().toISOString())
            .single();

        const userData = {
            id: user.id,
            email: user.email,
            role: profile?.role || 'user',
            created_at: user.created_at,
            isVip: !!vip,
            planType: vip?.plan_type || null,
            vipSubscription: vip
        };

        res.json({ user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
