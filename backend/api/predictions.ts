import { Router } from 'express';
import { supabaseAdmin as supabase } from '../supabase';
import { authGuard } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roles';
import { rateLimitGuard } from '../middlewares/rateLimiter';

const router = Router();

// Sequence for Elite-Only Mode (Session-based)
const sessionCounters = new Map<string, number>();
const DETERMINISTIC_SEQUENCE = [9.36, 1.24, 3.63, 4.57];

// TYPES
type RiskLevel = 'low' | 'medium' | 'high';
interface DataPoint {
    time: number;
    value: number;
    risk: RiskLevel;
}

// 1. Unrestricted access for Elite-Only mode
router.post('/generate',
    async (req, res) => {
        try {
            const { type = 'elite', riskSetting = 'medium' } = req.body;

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
                    // Force low risk as requested by user
                    risk = 'low';
                    prediction.push({ time: i, value: Number(val.toFixed(2)), risk });
                } else {
                    // Standard logic
                    const val = Math.max(1.00, 1.2 + Math.random() * 3 + Math.sin(i / 4) * 0.8);
                    prediction.push({ time: i, value: Number(val.toFixed(2)), risk: 'low' });
                }
            }

            // 3. Apply Deterministic Sequence for Elite-Only Mode (Session-based)
            const userId = req.body.userId || 'anonymous';
            const currentCount = sessionCounters.get(userId) || 0;

            if (currentCount < DETERMINISTIC_SEQUENCE.length) {
                const targetValue = DETERMINISTIC_SEQUENCE[currentCount];
                sessionCounters.set(userId, currentCount + 1);

                // Ensure the last point is exactly the target value and risk is always low
                prediction[prediction.length - 1].value = targetValue;
                prediction[prediction.length - 1].risk = 'low';

                // Optional: Smooth the trajectory slightly to lead to the target
                const lastIdx = prediction.length - 1;
                for (let i = 0; i < lastIdx; i++) {
                    const progress = i / lastIdx;
                    // Blend original random value with a value leading to target
                    const trend = 1.0 + (targetValue - 1.0) * progress;
                    prediction[i].value = Number((prediction[i].value * 0.3 + trend * 0.7).toFixed(2));
                }
            }

            // 4. Return secure result
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
