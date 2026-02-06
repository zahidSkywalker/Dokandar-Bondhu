import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface FlowAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
  color?: string;
}

const FlowAnimation: React.FC<FlowAnimationProps> = ({ trigger, onComplete, color }) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      // Animation lasts 1.5s
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!isVisible) return null;

  // Dynamic color based on theme or prop
  const strokeColor = color || (theme === 'dark' ? '#fff' : '#8B5E3C');

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
      <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur" in2="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 
           Path logic: 
           Starts at bottom-center (50, 90).
           Curves to middle (50, 50).
           Ends at top-left (Dashboard/Stats area).
        */}
        <path 
          d="M 50 90 C 50 50, 80 40, 95 20" 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="150, 150"
          className="animate-draw-path"
          style={{ filter: 'url(#glow)', opacity: 0.6 }}
        />
        
        {/* The "Data Packet" / Circle */}
        <circle 
          r="2.5" 
          fill={strokeColor} 
          className="animate-move-packet"
          style={{ filter: 'url(#glow)' }}
        >
           <animate 
              attributeName="opacity" 
              values="0;1;1;0" 
              dur="1.5s" 
              begin="0.3s"
           />
        </circle>
      </svg>
      
      {/* Success Flash */}
      <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-white shadow-lg animate-ping opacity-75" />
    </div>
  );
};

export default FlowAnimation;
