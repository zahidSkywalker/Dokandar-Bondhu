import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
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
  const baseStyles = `
    w-full flex items-center justify-center gap-2 
    h-[50px] rounded-md font-semibold text-base
    transition-all duration-150 ease-out 
    active:scale-[0.98] tap-effect
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: 'bg-orange text-white shadow-float hover:bg-orange/90',
    secondary: 'bg-white text-prussian border-2 border-gray-200 hover:bg-alabaster'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon && <span className="opacity-90">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
