import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'success';
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode; // <--- ADDED THIS LINE
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, icon, ...props }, ref) => {
    const baseStyles = "w-full py-3 px-4 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2";
    
    const variants = {
      primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-900/20",
      danger: "bg-red-500 text-white hover:bg-red-600",
      ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      success: "bg-green-600 text-white hover:bg-green-700"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={isLoading}
        {...props}
      >
        {icon && <span>{icon}</span>}
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
