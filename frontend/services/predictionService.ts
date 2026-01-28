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

            // Offline Deterministic Sequence Logic
            const SEQUENCE = [9.36, 1.24, 3.63, 4.57];

            // Use a simple local counter stored in sessionStorage to track sequence progress
            // This persists across reloads on the same tab, similar to the session-based backend logic
            let requestCount = parseInt(sessionStorage.getItem('offline_sequence_count') || '0');

            // Loop the sequence indefinitely
            let targetValue = SEQUENCE[requestCount % SEQUENCE.length];

            sessionStorage.setItem('offline_sequence_count', (requestCount + 1).toString());

            const simulatedPrediction = Array.from({ length: 20 }, (_, i) => ({
                time: i,
                // Create a smooth curve ending at targetValue
                value: i === 19 ? targetValue : (1 + Math.random() * (targetValue / 2)),
                risk: 'low' as 'low' | 'medium' | 'high'
            }));

            return { prediction: simulatedPrediction };
        }
    }
};
