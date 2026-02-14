import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4 rounded-lg shadow-card border border-transparent transition-all duration-200 ${className} ${onClick ? 'active:scale-[0.99] active:border-gray-border cursor-pointer' : ''}`}
    >
      {children}
    </div>
  );
};

export default Card;
