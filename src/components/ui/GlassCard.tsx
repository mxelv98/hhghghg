import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    gradient?: boolean;
    hoverGlow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className,
    gradient = false,
    hoverGlow = true,
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hoverGlow ? { y: -5, transition: { duration: 0.2 } } : {}}
            className={cn(
                "relative group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 transition-colors hover:bg-white/[0.05]",
                gradient && "bg-gradient-to-br from-white/[0.08] to-transparent",
                className
            )}
            {...props}
        >
            {/* Background Glow */}
            {hoverGlow && (
                <div className="absolute -inset-px bg-gradient-to-r from-pluxo-pink/20 to-pluxo-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
            )}

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};
