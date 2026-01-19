import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface User {
    id: string; // UUID
    email: string;
    role: 'user' | 'admin';
    vip_status?: 'active' | 'expired' | 'none';
    plan_type?: 'vip' | 'vup';
    vipSubscription?: {
        ends_at: string;
        active: boolean;
        plan_type?: 'vip' | 'vup';
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    const fetchFullUserProfile = async (sessionUser: any, _accessToken: string) => {
        try {
            // 1. Fetch Profile (Role)
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', sessionUser.id)
                .single();

            // 2. Fetch VIP Subscription (Status)
            const { data: vipSub } = await supabase
                .from('vip_subscriptions')
                .select('*')
                .eq('user_id', sessionUser.id)
                .eq('active', true)
                .order('ends_at', { ascending: false })
                .limit(1)
                .single();

            let vipStatus: 'active' | 'expired' | 'none' = 'none';
            if (vipSub) {
                const now = new Date();
                const endsAt = new Date(vipSub.ends_at);
                if (endsAt > now) {
                    vipStatus = 'active';
                } else {
                    vipStatus = 'expired';
                }
            }

            console.log("Logged in as:", profile?.role || 'user');

            setUser({
                id: sessionUser.id,
                email: sessionUser.email!,
                role: profile?.role === 'admin' ? 'admin' : 'user',
                vip_status: vipStatus,
                plan_type: vipSub?.plan_type,
                vipSubscription: vipSub ? {
                    ends_at: vipSub.ends_at,
                    active: vipSub.active,
                    plan_type: vipSub.plan_type
                } : undefined
            });

        } catch (e) {
            console.error("Error fetching user profile:", e);
            // Fallback
            setUser({
                id: sessionUser.id,
                email: sessionUser.email!,
                role: 'user',
                vip_status: 'none'
            });
        }
    };

    const refreshUser = async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
            await fetchFullUserProfile(currentSession.user, currentSession.access_token);
        }
    };

    useEffect(() => {
        let mounted = true;

        // Function to handle session state
        const handleSession = async (session: Session | null) => {
            setSession(session);
            if (session?.user) {
                await fetchFullUserProfile(session.user, session.access_token);
            } else {
                setUser(null);
            }
            if (mounted) setLoading(false);
        };

        // Initial fetch
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) handleSession(session);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                // Should we set loading true here? Usually no, as it's a transition.
                // But we might want to if we are switching users.
                // For now, let's just update the user.
                handleSession(session);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
