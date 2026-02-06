import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'dark'; // NEW: Explicit variant control
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, variant = 'default', ...props }, ref) => {
    const { theme } = useTheme(); // Hook to get theme state

    // Dynamic styling based on theme
    const isDark = theme === 'dark';
    
    // Base styles
    const baseStyles = "w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-200";
    
    // Conditional styling for Dark Mode visibility
    const modeStyles = isDark 
      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-earth-600" 
      : "bg-white border-gray-200 text-earth-900 placeholder-gray-400 focus:ring-2 focus:ring-earth-200";

    return (
      <div className="w-full mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(baseStyles, modeStyles, error && "border-red-500 focus:ring-red-500", className)}
          {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
