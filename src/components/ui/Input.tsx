import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'dark'; 
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, variant = 'default', ...props }, ref) => {
    const { theme } = useTheme(); 

    const isDark = theme === 'dark';
    
    const baseStyles = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200 border";
    
    const modeStyles = isDark 
      ? "bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50" 
      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50";

    const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1";

    return (
      <div className="w-full mb-5">
        {label && (
          <label className={labelStyles}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(baseStyles, modeStyles, error && "border-red-500 focus:border-red-500 focus:ring-red-500/50", className)}
          {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
