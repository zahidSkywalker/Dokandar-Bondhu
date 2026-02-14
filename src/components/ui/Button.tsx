import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  // 6. Standardized Buttons
  const base = `
    w-full flex items-center justify-center gap-2 
    h-[50px] rounded-md font-semibold text-base
    transition-all duration-150 ease-out tap-scale
    disabled:opacity-40 disabled:pointer-events-none
  `;

  const styles = {
    primary: 'bg-orange text-white shadow-float hover:bg-orange/90',
    secondary: 'bg-white text-prussian border border-gray-border hover:bg-alabaster',
    danger: 'bg-red-500 text-white shadow-float hover:bg-red-600',
    success: 'bg-green-600 text-white shadow-float hover:bg-green-700'
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
