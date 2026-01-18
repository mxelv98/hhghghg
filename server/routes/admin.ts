import express from 'express';
import { supabaseAdmin } from '../supabase.js';
import { addDays, addHours, addMinutes } from 'date-fns';

const router = express.Router();

// Middleware to check admin role should verify the token passed in valid and belongs to an admin
// For simplicity in this demo, we assume the frontend sends a valid User ID or Token that we trust (locally)
// In production: Validate JWT via Supabase + Check 'role' in profiles table

router.get('/users', async (req, res) => {
    try {
        // List users from Auth (requires Service Role)
        const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        if (authError) throw authError;

        // Fetch VIP subscriptions
        const { data: vips, error: vipError } = await supabaseAdmin
            .from('vip_subscriptions')
            .select('*')
            .eq('active', true)
            .gt('ends_at', new Date().toISOString());
        if (vipError) throw vipError;

        // Fetch Profiles (Roles) - assuming profiles table exists
        const { data: profiles, error: profileError } = await supabaseAdmin.from('profiles').select('*');
        if (profileError) throw profileError;

        // Merge Data
        const mergedUsers = users.map((u: any) => {
            const profile = profiles.find((p: any) => p.id === u.id);
            const vip = vips.find((v: any) => v.user_id === u.id);

            return {
                id: u.id,
                email: u.email,
                role: profile?.role || 'user',
                created_at: u.created_at,
                isVip: !!vip,
                planType: vip?.plan_type || null,
                vipEndsAt: vip?.ends_at
            };
        });

        res.json(mergedUsers);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/users/:id/vip', async (req, res) => {
    const { id } = req.params;
    const { duration, unit, planType } = req.body; // planType: 'vip' or 'vup'

    if (!duration || !unit || !planType) {
        return res.status(400).json({ error: 'Duration, unit, and planType required' });
    }

    try {
        const now = new Date();
        let endsAt = now;

        if (unit === 'minutes') endsAt = addMinutes(now, duration);
        else if (unit === 'hours') endsAt = addHours(now, duration);
        else if (unit === 'days') endsAt = addDays(now, duration);
        else return res.status(400).json({ error: 'Invalid unit' });

        // Cancel old subs
        await supabaseAdmin
            .from('vip_subscriptions')
            .update({ active: false })
            .eq('user_id', id);

        // Create new sub
        const { error } = await supabaseAdmin
            .from('vip_subscriptions')
            .insert({
                user_id: id,
                starts_at: new Date().toISOString(),
                ends_at: endsAt.toISOString(),
                plan_type: planType,
                active: true
            });

        if (error) throw error;

        res.json({ message: `${planType.toUpperCase()} granted`, endsAt });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
