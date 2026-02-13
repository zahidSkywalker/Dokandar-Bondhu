import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle } from 'lucide-react';

interface FlowAnimationProps {
  trigger: boolean;
  color?: string;
}

const FlowAnimation: React.FC<FlowAnimationProps> = ({ trigger, color = '#FCA311' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />
      <div className="relative z-10 flex flex-col items-center animate-scale-in">
        <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl bg-white border-4 border-gray-100">
          <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={2} />
        </div>
        <p className="mt-4 text-white font-bold text-xl tracking-wide drop-shadow-md bg-prussian px-6 py-2 rounded-full">
          Success!
        </p>
      </div>
    </div>,
    document.body
  );
};

export default FlowAnimation;
