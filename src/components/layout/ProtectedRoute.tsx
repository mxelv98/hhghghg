import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    requiredRole?: 'admin' | 'user';
    requiredPlan?: 'vip' | 'vup';
}

export default function ProtectedRoute({ requiredRole, requiredPlan }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050b14]">
                <div className="w-8 h-8 border-4 border-pluxo-pink/30 border-t-pluxo-pink rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role Check
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    // Plan Check
    if (requiredPlan) {
        const isVip = user.vip_status === 'active' && user.plan_type === 'vip';
        const isVup = user.vip_status === 'active' && user.plan_type === 'vup';

        // VIP Access: Requests VIP -> Must be VIP
        if (requiredPlan === 'vip' && !isVip) {
            return <Navigate to="/dashboard" replace />;
        }

        // VUP Access: Requests VUP -> Must be VUP OR VIP (VIPs usually get all access)
        if (requiredPlan === 'vup' && !isVup && !isVip) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
}
