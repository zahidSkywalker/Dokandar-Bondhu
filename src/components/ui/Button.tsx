import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'success';
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, icon, ...props }, ref) => {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex justify-center items-center gap-2 shadow-md";
    
    const variants = {
      primary: "bg-earth-600 text-white hover:bg-earth-700 shadow-earth-200/50",
      danger: "bg-red-500 text-white hover:bg-red-600",
      ghost: "bg-cream-100 text-earth-700 hover:bg-cream-200 shadow-none border border-cream-200",
      success: "bg-green-600 text-white hover:bg-green-700"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={isLoading}
        {...props}
      >
        {icon && <span className="scale-110">{icon}</span>}
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
