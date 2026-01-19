import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

/**
 * LIGHTWEIGHT RATE LIMITER
 * Prevents rapid-fire requests on sensitive endpoints.
 * @param windowMs Time window in milliseconds
 * @param max Max requests per window
 */
export const rateLimitGuard = (windowMs: number = 60000, max: number = 20) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const key = `${ip}:${req.path}`;
        const now = Date.now();

        if (!store[key] || now > store[key].resetTime) {
            store[key] = {
                count: 1,
                resetTime: now + windowMs
            };
            return next();
        }

        store[key].count++;

        if (store[key].count > max) {
            return res.status(429).json({
                error: 'THROTTLED: Too many synchronization attempts. Core cooldown active.',
                retryAfter: Math.ceil((store[key].resetTime - now) / 1000)
            });
        }

        next();
    };
};
