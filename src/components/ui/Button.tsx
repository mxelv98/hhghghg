import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'glass' | 'premium' | 'glow';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pluxo-blue/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none",
                    {
                        // Variants
                        'bg-gradient-to-r from-pluxo-pink to-pluxo-blue text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.02]': variant === 'default',
                        'border border-white/10 hover:border-white/20 hover:bg-white/5 text-white backdrop-blur-sm': variant === 'outline',
                        'hover:bg-white/5 text-gray-400 hover:text-white': variant === 'ghost',
                        'bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 shadow-xl': variant === 'glass',
                        'bg-white text-black hover:bg-gray-100 shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] hover:scale-[1.02]': variant === 'premium',
                        'glow-border bg-pluxo-dark text-white hover:scale-[1.02]': variant === 'glow',

                        // Sizes
                        'h-9 px-4 text-sm rounded-lg': size === 'sm',
                        'h-11 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                        'h-16 px-10 text-xl font-bold': size === 'xl',
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && children}
            </button>
        );
    }
);
Button.displayName = "Button";

