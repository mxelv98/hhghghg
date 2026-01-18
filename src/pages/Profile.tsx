import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                <Card>
                    <div className="flex items-start gap-6">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-pluxo-pink to-pluxo-blue flex items-center justify-center text-3xl font-bold text-white">
                            {user.email[0].toUpperCase()}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-xl font-bold">{user.email.split('@')[0]}</h2>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-gray-300 mt-1">
                                    {user.role.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid gap-4 py-4 border-t border-white/5 border-b">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Shield className="h-5 w-5 text-gray-500" />
                                    Status: <span className={user.vip_status === 'active' ? "text-pluxo-pink font-bold" : "text-gray-400"}>
                                        {user.vip_status === 'active' ? `${user.plan_type?.toUpperCase() || 'VIP'} Active` : "Free Plan"}
                                    </span>
                                </div>
                                {user.vip_status === 'active' && user.vipSubscription?.ends_at && (
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        Expires: {format(new Date(user.vipSubscription.ends_at), 'PP p')}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <Button variant="outline" onClick={logout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20">
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
