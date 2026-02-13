import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, icon, ...props }, ref) => {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex justify-center items-center gap-2 shadow-md hover:shadow-lg";
    
    const variants = {
      primary: "bg-orange text-prussian hover:bg-orange/80", // Orange Button
      danger: "bg-red-500 text-white hover:bg-red-600",
      ghost: "bg-alabaster text-prussian hover:bg-gray-200 border border-gray-200"
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
