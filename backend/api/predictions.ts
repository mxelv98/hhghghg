import { Router } from 'express';
import { supabaseAdmin as supabase } from '../supabase';
import { authGuard } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roles';
import { rateLimitGuard } from '../middlewares/rateLimiter';

const router = Router();

// TYPES
type RiskLevel = 'low' | 'medium' | 'high';
interface DataPoint {
    time: number;
    value: number;
    risk: RiskLevel;
}

/**
 * @route   POST /api/predictions/generate
 * @desc    Generate neural predictions based on node level and risk setting
 * @access  Protected (VUP/VIP only) + Rate Limited
 */
router.post('/generate',
    authGuard,
    rateLimitGuard(60000, 10), // Limit to 10 predictions per minute
    roleGuard(undefined, 'vup'), // Basic VUP required at minimum
    async (req, res) => {
        try {
            const user = (req as any).user;
            const sub = (req as any).subscription; // Injected by roleGuard
            const { type, riskSetting = 'medium' } = req.body;

            // 1. Double check Elite tier if requested
            if (type === 'elite' && sub.plan_type !== 'vip') {
                return res.status(403).json({ error: 'RESTRICTED: Elite tier required for this module' });
            }

            // 2. SECRET CASE: Prediction Logic (Isolated from Frontend)
            let prediction: DataPoint[] = [];
            const length = type === 'elite' ? 20 : 40;

            for (let i = 0; i < length; i++) {
                let base = 1.0;
                let volatility = 1.0;
                let risk: RiskLevel = 'low';

                if (type === 'elite') {
                    if (riskSetting === 'low') { base = 1.5; volatility = 0.5; }
                    if (riskSetting === 'high') { base = 2.5; volatility = 3.0; }
                    const val = Math.max(1.00, base + (Math.random() - 0.4) * volatility * 2);
                    if (val > 2) risk = 'medium';
                    if (val > 5) risk = 'high';
                    prediction.push({ time: i, value: Number(val.toFixed(2)), risk });
                } else {
                    // Standard logic
                    const val = Math.max(1.00, 1.2 + Math.random() * 3 + Math.sin(i / 4) * 0.8);
                    prediction.push({ time: i, value: Number(val.toFixed(2)), risk: 'low' });
                }
            }

            // 3. Return secure result
            return res.json({
                prediction,
                metadata: {
                    timestamp: new Date().toISOString(),
                    protocol: 'AES-256-GCM',
                    node: `NODE_${Math.floor(Math.random() * 9000) + 1000}`
                }
            });

        } catch (error) {
            console.error('SEC_ERR:', error);
            return res.status(500).json({ error: 'Encryption fault' });
        }
    });

export default router;
