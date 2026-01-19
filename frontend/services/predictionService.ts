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
            console.error('API_ERR:', error);
            throw error;
        }
    }
};
