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
        {label && <label className="block text-sm font-bold text-prussian mb-1">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-prussian placeholder:text-prussian/30 focus:ring-2 focus:ring-orange focus:border-orange transition-all",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
