import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin as supabase } from '../supabase';

/**
 * AUTH MIDDLEWARE
 * Verifies the user's identity via Supabase Auth token
 */
export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'RESTRICTED: No valid token provided' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'RESTRICTED: Identity verification failed' });
        }

        // Attach user to request
        (req as any).user = user;
        next();
    } catch (error) {
        console.error('AUTH_GUARD_FAULT:', error);
        return res.status(401).json({ error: 'RESTRICTED: Auth protocol error' });
    }
};
