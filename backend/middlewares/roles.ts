import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin as supabase } from '../supabase';

/**
 * ROLE & SUBSCRIPTION GUARD
 * Strictly enforces access based on Server-Side validation of VIP/Role
 */
export const roleGuard = (requiredRole?: string, requiredPlan?: 'vip' | 'vup') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'AUTH_REQUIRED' });

            // 1. Fetch Profile (Role)
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            // 2. Fetch Active Subscription
            const { data: sub } = await supabase
                .from('vip_subscriptions')
                .select('plan_type, ends_at, active')
                .eq('user_id', user.id)
                .eq('active', true)
                .gt('ends_at', new Date().toISOString()) // Expiration check
                .single();

            // ADMIN LOCK
            if (requiredRole === 'admin' && profile?.role !== 'admin') {
                return res.status(403).json({ error: 'RESTRICTED: Admin clearance required' });
            }

            // VIP TIER LOCK
            if (requiredPlan) {
                if (!sub) {
                    return res.status(403).json({ error: 'RESTRICTED: Active VIP license required' });
                }

                // If specialized for Elite (VIP tier) vs Standard (VUP tier)
                if (requiredPlan === 'vip' && sub.plan_type !== 'vip') {
                    return res.status(403).json({ error: 'RESTRICTED: Elite V6 / V3 license required' });
                }
            }

            // Attach profile/sub to request for further use
            (req as any).profile = profile;
            (req as any).subscription = sub;

            next();
        } catch (error) {
            console.error('ROLE_GUARD_FAULT:', error);
            res.status(500).json({ error: 'SEC_FAULT: Access validation failed' });
        }
    };
};
