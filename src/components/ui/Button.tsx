import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'success' | 'outline';
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, icon, ...props }, ref) => {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2";
    
    const variants = {
      primary: "bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30",
      danger: "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/30",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700",
      success: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700",
      outline: "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
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
