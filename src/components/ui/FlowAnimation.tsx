import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle } from 'lucide-react';

interface FlowAnimationProps {
  trigger: boolean;
  color?: string;
}

const FlowAnimation: React.FC<FlowAnimationProps> = ({ trigger, color = '#10B981' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1500); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
      />
      
      {/* Success Circle */}
      <div className="relative z-10 flex flex-col items-center animate-bounce-in">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
          style={{ backgroundColor: color }}
        >
          <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
        </div>
        <p className="mt-4 text-white font-bold text-xl tracking-wide drop-shadow-md">
          Success!
        </p>
      </div>

      {/* Confetti Effect (CSS Only) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#1A5319', '#FFF'][i % 5],
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
      </div>
    </div>,
    document.body
  );
};

export default FlowAnimation;
