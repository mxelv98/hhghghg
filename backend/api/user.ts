import { Router } from 'express';
import { supabaseAdmin as supabase } from '../supabase.js';
import { authGuard } from '../middlewares/auth';
import { rateLimitGuard } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @route   GET /api/user/me
 * @desc    Get current session profile & VIP status
 * @access  Protected
 */
router.get('/me',
    authGuard,
    rateLimitGuard(60000, 100), // Generous limit for profile polling
    async (req, res) => {
        try {
            const user = (req as any).user;

            // 1. Get Profile for Role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            // 2. Check VIP (Subscribed logic)
            const { data: vip } = await supabase
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
            console.error('USER_API_FAULT:', error);
            res.status(500).json({ error: 'Data synchronization failure' });
        }
    });

export default router;
