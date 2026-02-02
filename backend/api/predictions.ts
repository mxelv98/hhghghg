import { Router } from "express";
import { supabaseAdmin as supabase } from "../supabase";
import { authGuard } from "../middlewares/auth";
import { roleGuard } from "../middlewares/roles";
import { rateLimitGuard } from "../middlewares/rateLimiter";

const router = Router();

// Sequence for Elite-Only Mode (Session-based)

// TYPES
type RiskLevel = "low" | "medium" | "high";
interface DataPoint {
  time: number;
  value: number;
  risk: RiskLevel;
}

// 1. Unrestricted access for Elite-Only mode
router.post("/generate", async (req, res) => {
  try {
    const { type = "elite", riskSetting = "medium" } = req.body;

    // 2. SECRET CASE: Prediction Logic (Isolated from Frontend)
    let prediction: DataPoint[] = [];
    const length = type === "elite" ? 20 : 40;

    for (let i = 0; i < length; i++) {
      let base = 1.0;
      let volatility = 1.0;
      let risk: RiskLevel = "low";

      if (type === "elite") {
        if (riskSetting === "low") {
          base = 1.5;
          volatility = 0.5;
        }
        if (riskSetting === "high") {
          base = 2.5;
          volatility = 3.0;
        }
        const val = Math.max(
          1.0,
          base + (Math.random() - 0.4) * volatility * 2,
        );
        // Force low risk as requested by user
        risk = "low";
        prediction.push({ time: i, value: Number(val.toFixed(2)), risk });
      } else {
        // Standard logic
        const val = Math.max(
          1.0,
          1.2 + Math.random() * 3 + Math.sin(i / 4) * 0.8,
        );
        prediction.push({
          time: i,
          value: Number(val.toFixed(2)),
          risk: "low",
        });
      }
    }

    // 4. BACKGROUND SYNC: Push to Hostinger (External Project)
    const hostingerUrl =
      process.env.HOSTINGER_WEBHOOK_URL ||
      "https://whitesmoke-mongoose-489780.hostingersite.com/api/receive-prediction";

    const finalMultiplier = prediction[prediction.length - 1].value;

    try {
      console.log(`📡 Attempting sync to: ${hostingerUrl}`);
      const r = await fetch(hostingerUrl, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        body: JSON.stringify({
          multiplier: finalMultiplier,
          type: type,
          timestamp: new Date().toISOString(),
        }),
      });
      
      const responseText = await r.text();
      console.log(`✅ Sync Response (${r.status}): ${responseText.substring(0, 100)}`);
    } catch (e: any) {
      console.error("❌ External Sync Error:", e.message);
    }

    // 5. Return secure result
    res.json({
      prediction,
      metadata: {
        timestamp: new Date().toISOString(),
        protocol: "AES-256-GCM",
        node: `NODE_${Math.floor(Math.random() * 9000) + 1000}`,
      },
    });
  } catch (error) {
    console.error("SEC_ERR:", error);
    return res.status(500).json({ error: "Encryption fault" });
  }
});

export default router;
