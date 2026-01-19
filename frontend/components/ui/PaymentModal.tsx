import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Ticket, Timer, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/services/paymentService';

interface PaymentModalProps {
    tier: 'VUP' | 'ELITE';
    option: {
        label: string;
        duration: string;
        price: string;
        isBestValue?: boolean;
    };
    onClose: () => void;
}

type Step = 'preview' | 'processing' | 'success';

export default function PaymentModal({ tier, option, onClose }: PaymentModalProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState<Step>('preview');
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const basePrice = parseFloat(option.price);
    const finalPrice = basePrice * (1 - discount / 100);

    const handleApplyPromo = async () => {
        setIsValidating(true);
        setError(null);

        try {
            const data = await paymentService.validatePromo(promoCode);
            setDiscount(data.discount);
        } catch (err: any) {
            setError(err.message || 'Invalid or expired promo code');
            setDiscount(0);
        } finally {
            setIsValidating(false);
        }
    };

    const handleProceed = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setStep('processing');
        setError(null);

        try {
            const { checkoutUrl } = await paymentService.initiateCheckout({
                userId: user.id,
                planId: tier === 'ELITE' ? 'vip_elite' : 'vip_vup',
                timeOption: option.duration,
                promoCode: discount > 0 ? promoCode : undefined
            });

            console.log('Payment initialized:', checkoutUrl);

            // Redirect to real NOWPayments checkout
            window.location.href = checkoutUrl;

        } catch (err: any) {
            setError(err.message || 'Failed to initiate checkout');
            setStep('preview');
        }
    };

    const getExpirationPreview = () => {
        const now = new Date();
        const [value, unit] = option.duration.split(' ');
        const durationMs = unit.toLowerCase().includes('hour')
            ? parseInt(value) * 60 * 60 * 1000
            : parseInt(value) * 60 * 1000;

        const expireDate = new Date(now.getTime() + durationMs);
        return expireDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-[#0a101f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-lg",
                            tier === 'ELITE' ? "bg-pluxo-pink/10 text-pluxo-pink" : "bg-pluxo-blue/10 text-pluxo-blue"
                        )}>
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Secure Checkout</h3>
                            <p className="text-[10px] text-gray-500 font-mono tracking-tighter">TRANS_ID: PX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                    </div>
                    {step === 'preview' && (
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="p-8">
                    {step === 'preview' && (
                        <div className="space-y-6">
                            {/* Selected Plan Summary */}
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 block">Selected Plan</span>
                                        <h4 className="text-xl font-black italic uppercase text-white">{tier} - {option.duration}</h4>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 block">Base Price</span>
                                        <span className="text-xl font-black text-white italic">${option.price}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                    <Timer size={14} className="text-pluxo-pink" />
                                    Access expires at {getExpirationPreview()} today
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Promo Code</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="ENTER CODE"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold focus:border-pluxo-pink/50 outline-none transition-all placeholder:text-gray-700 uppercase"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleApplyPromo}
                                        disabled={!promoCode || isValidating}
                                        className="h-[58px] px-6"
                                        variant="outline"
                                    >
                                        {isValidating ? <Loader2 className="animate-spin" size={20} /> : "APPLY"}
                                    </Button>
                                </div>
                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-1">
                                            {error}
                                        </motion.p>
                                    )}
                                    {discount > 0 && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-green-500 text-[10px] font-bold uppercase tracking-wider px-1">
                                            Code applied successfully! (20% OFF)
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Pricing Breakdown */}
                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-white font-bold italic">${basePrice.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-500 font-medium uppercase tracking-widest text-[10px]">Promo Discount</span>
                                        <span className="text-green-500 font-bold italic">-${(basePrice * (discount / 100)).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center py-4 px-5 bg-pluxo-pink/5 border border-pluxo-pink/10 rounded-2xl">
                                    <span className="text-white font-black uppercase tracking-[0.2em] text-xs">Total Amount</span>
                                    <span className="text-3xl font-black italic text-gradient">${finalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleProceed}
                                variant="premium"
                                className="w-full py-6 text-sm font-black uppercase tracking-widest italic group h-[64px]"
                            >
                                <span className="flex items-center gap-2">
                                    Proceed to Payment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>

                            <p className="text-center text-gray-600 text-[9px] font-medium uppercase tracking-widest">
                                Secure encrypted transaction powered by Pluxo
                            </p>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="relative mb-8">
                                <div className="w-20 h-20 border-4 border-pluxo-pink/10 border-t-pluxo-pink rounded-full animate-spin" />
                                <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pluxo-pink/50 anim-pulse" size={24} />
                            </div>
                            <h4 className="text-xl font-black italic uppercase text-white mb-2">Processing Transaction</h4>
                            <p className="text-gray-500 text-sm max-w-[280px]">Securing your node connection and activating priority high-clearance access...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8 border border-green-500/20"
                            >
                                <CheckCircle size={40} />
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h4 className="text-2xl font-black italic uppercase text-white mb-2">Activation Successful</h4>
                                <p className="text-gray-500 text-sm mb-8 max-w-[320px]">
                                    Your {tier} access is now fully authorized. Your high-clearance node is online and ready for processing.
                                </p>
                                <Button
                                    onClick={() => navigate(tier === 'ELITE' ? '/elite' : '/standard')}
                                    variant="premium"
                                    className="w-full py-6 text-sm font-black uppercase tracking-widest italic"
                                >
                                    Enter Dashboard
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
