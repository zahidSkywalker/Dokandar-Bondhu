import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        {label && (
          <label className="block text-sm font-bold text-prussian mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-[52px] px-5 bg-white border border-gray-border rounded-xl text-prussian placeholder:text-prussian/30",
            "focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all duration-200",
            "text-base font-medium", // Increased font size for better readability
            error && "border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
