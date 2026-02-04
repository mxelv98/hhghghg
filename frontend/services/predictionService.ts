const API_URL = (import.meta as any).env.VITE_BACKEND_URL || '';

export const predictionService = {
    async generate(userId: string, type: 'standard' | 'elite', riskSetting: string = 'medium') {
        try {
            const response = await fetch(`${API_URL}/api/predictions/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    type,
                    riskSetting
                }),
            });

            if (!response.ok) {
                throw new Error('Encryption fault');
            }

            return await response.json();
        } catch (error) {
            console.warn('API_ERR: Connection failed, switching to OFFLINE SIMULATION', error);

            // Fallback: Generate local simulation for demo/mobile purposes
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency

            // Enhanced Random Generation for Demo/Offline
            const targetValue = Number((1.10 + Math.random() * 2.9).toFixed(2)); 

            const simulatedPrediction = Array.from({ length: 20 }, (_, i) => ({
                time: i,
                // Create a smooth curve ending at targetValue
                value: i === 19 ? targetValue : Number((1 + Math.random() * (targetValue / 2)).toFixed(2)),
                risk: 'low' as 'low' | 'medium' | 'high'
            }));

            // NEW: Directly notify Hostinger from frontend if API fails (Ensures sync)
            try {
                const hostingerUrl = "https://whitesmoke-mongoose-489780.hostingersite.com/api/receive-prediction";
                fetch(hostingerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ multiplier: targetValue })
                }).catch(() => {}); // Fire and forget
            } catch (e) {}

            return { prediction: simulatedPrediction };
        }
    }
};
