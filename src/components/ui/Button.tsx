import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pluxo-blue/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                    {
                        // Variants
                        'bg-gradient-to-r from-pluxo-pink to-pluxo-blue text-white shadow-lg hover:shadow-pluxo-blue/20': variant === 'default',
                        'border border-white/20 hover:bg-white/10 text-white': variant === 'outline',
                        'hover:bg-white/5 text-gray-300 hover:text-white': variant === 'ghost',
                        'bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20': variant === 'glass',

                        // Sizes
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
