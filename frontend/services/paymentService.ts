import { supabase } from '@/lib/supabase';

// Use import.meta.env directly for Vite environment variables
const API_URL = (import.meta as any).env.VITE_BACKEND_URL || '';

export const paymentService = {
    validatePromo: async (code: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        try {
            const response = await fetch(`${API_URL}/api/promo/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Invalid promo code');
            }

            return response.json();
        } catch (error: any) {
            console.error('PROMO_ERR:', error);
            throw error;
        }
    },

    initiateCheckout: async (details: { userId: string, planId: string, timeOption: string, promoCode?: string, onexbetId?: string }) => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        console.log(`Initiating checkout @ ${API_URL}/api/checkout/initiate`);

        try {
            const response = await fetch(`${API_URL}/api/checkout/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(details)
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('CHECKOUT_API_ERR:', error);
                throw new Error(error.error || 'Failed to initiate checkout');
            }

            return response.json();
        } catch (error: any) {
            console.error('FETCH_ERR:', error);
            if (error.message === 'Failed to fetch') {
                throw new Error(`Network Error: Backend unreachable at ${API_URL}. Ensure your server is running on port 3001.`);
            }
            throw error;
        }
    }
};
