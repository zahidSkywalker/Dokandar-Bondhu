import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  variant: 'critical' | 'warning' | 'normal' | 'unknown';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  const styles = {
    critical: 'bg-red-500 text-white',
    warning: 'bg-orange-500 text-white',
    normal: 'bg-green-500 text-white',
    unknown: 'bg-gray-400 text-white'
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", styles[variant])}>
      {children}
    </span>
  );
};

export default Badge;
