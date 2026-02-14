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
  const base = `
    w-full flex items-center justify-center gap-2 
    h-[52px] rounded-xl font-bold text-base
    transition-all duration-200 ease-out tap-scale
    disabled:opacity-40 disabled:pointer-events-none
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const styles = {
    primary: 'bg-orange text-prussian hover:bg-orange/90 focus:ring-orange shadow-float',
    secondary: 'bg-alabaster text-prussian border border-gray-border hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
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
