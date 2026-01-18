import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Search, MessageSquare, Ban } from 'lucide-react';

interface UserData {
    id: string; // UUID
    email: string;
    role: string;
    created_at: string;
    isVip: boolean;
    planType: 'vip' | 'vup' | null;
    vipEndsAt?: string;
}

export default function AdminPanel() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [showGrantModal, setShowGrantModal] = useState(false);

    // Grant Modal State
    const [duration, setDuration] = useState('30');
    const [unit, setUnit] = useState<'minutes' | 'hours' | 'days'>('days');
    const [planType, setPlanType] = useState<'vip' | 'vup'>('vip');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGrantVip = async () => {
        if (!selectedUser) return;
        setProcessing(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/admin/users/${selectedUser.id}/vip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    duration: parseInt(duration),
                    unit,
                    planType
                }),
            });

            if (res.ok) {
                setShowGrantModal(false);
                fetchUsers();
            } else {
                alert('Failed to grant access');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toString().includes(search)
    );

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="text-pluxo-pink" />
                        Admin Command Center
                    </h1>
                    <p className="text-gray-400 mt-2">Manage users and access levels</p>
                </div>
                <div className="bg-pluxo-dark/50 p-4 rounded-lg border border-white/5">
                    <div className="text-sm text-gray-500 mb-1">Total Users</div>
                    <div className="text-2xl font-bold">{users.length}</div>
                </div>
            </div>

            <Card className="mb-8">
                <div className="p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users by email or ID..."
                            className="pl-10 bg-black/20"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-500 text-sm border-b border-white/5">
                                    <th className="p-4">User</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Expires</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading neural records...</td></tr>
                                ) : filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{user.email}</div>
                                            <div className="text-xs text-gray-500 font-mono truncate w-24" title={user.id.toString()}>ID: {user.id.toString().slice(0, 8)}...</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-gray-800 text-gray-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {user.isVip ? (
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.planType === 'vip'
                                                    ? 'bg-pluxo-pink/10 text-pluxo-pink border border-pluxo-pink/20'
                                                    : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                    }`}>
                                                    {user.planType || 'VIP'} Active
                                                </span>
                                            ) : (
                                                <span className="text-gray-600 text-sm">Inactive</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">
                                            {user.vipEndsAt ? new Date(user.vipEndsAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowGrantModal(true);
                                                    }}
                                                >
                                                    Manage
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-gray-400 hover:text-white"
                                                    onClick={() => alert(`Message feature coming soon for ${user.email}`)}
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                                    onClick={() => alert(`Ban logic for ${user.email}`)}
                                                >
                                                    <Ban className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            {/* Grant Access Modal */}
            {showGrantModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-6 relative">
                        <button
                            onClick={() => setShowGrantModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            ✕
                        </button>

                        <h3 className="text-xl font-bold mb-1">Grant Access</h3>
                        <p className="text-gray-400 text-sm mb-6">User: {selectedUser.email}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Access Tier</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPlanType('vup')}
                                        className={`p-3 rounded-lg border text-sm font-bold transition-all ${planType === 'vup'
                                            ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                                            : 'bg-black/20 border-white/10 text-gray-500 hover:border-white/20'
                                            }`}
                                    >
                                        VUP<br /><span className="text-[10px] font-normal opacity-70">Standard Access</span>
                                    </button>
                                    <button
                                        onClick={() => setPlanType('vip')}
                                        className={`p-3 rounded-lg border text-sm font-bold transition-all ${planType === 'vip'
                                            ? 'bg-pluxo-pink/20 border-pluxo-pink text-pluxo-pink'
                                            : 'bg-black/20 border-white/10 text-gray-500 hover:border-white/20'
                                            }`}
                                    >
                                        VIP<br /><span className="text-[10px] font-normal opacity-70">Elite Access</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Duration</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="flex-1"
                                    />
                                    <select
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value as any)}
                                        className="bg-black/20 border border-white/10 rounded-md px-3 text-white focus:outline-none focus:border-pluxo-pink"
                                    >
                                        <option value="minutes">Minutes</option>
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                className="w-full mt-4"
                                onClick={handleGrantVip}
                                disabled={processing}
                            >
                                {processing ? 'Granting...' : `Confirm Grant ${planType.toUpperCase()}`}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
