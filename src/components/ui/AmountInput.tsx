import React, { useRef, useState, useEffect } from 'react';

interface AmountInputProps {
  value: number; // Expects a pure number from parent state
  onChange: (value: number) => void;
  currency?: string;
  locale?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency = 'BDT', // Default to BDT based on your app context
  locale = 'en-IN', // 'en-IN' for 10,00,000 style, 'en-US' for 1,000,000 style
  placeholder = '0',
  disabled = false,
  className = ''
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState('');
  const [cursorPos, setCursorPos] = useState<number | null>(null);

  // Formatter instances
  const formatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Sync external value to display
  useEffect(() => {
    // If value is 0 or null, show empty or placeholder
    if (!value && value !== 0) {
      setDisplayValue('');
    } else {
      // Format the number for display
      setDisplayValue(formatter.format(value));
    }
  }, [value]);

  // Restore cursor position after render
  useEffect(() => {
    if (inputRef.current && cursorPos !== null) {
      const diff = displayValue.length - value.toString().length; // Approx logic
      // More precise cursor restoration logic:
      const rawLength = value ? value.toString().length : 0;
      const formattedLength = displayValue.length;
      
      // If cursor was at end, keep at end
      if (cursorPos >= rawLength) {
        inputRef.current.setSelectionRange(formattedLength, formattedLength);
      } else {
        // If cursor was in middle, try to adjust for added separators
        // Simple approximation: keep cursor where it was relative to digits
        // Complex exact logic requires counting separators before index
        inputRef.current.setSelectionRange(cursorPos, cursorPos);
      }
    }
  }, [displayValue, cursorPos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // 1. Extract only digits and decimal point
    let cleanedValue = rawValue.replace(/[^0-9.]/g, '');

    // 2. Handle multiple decimals (keep only first one)
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // 3. Limit decimal places to 2
    if (parts[1]?.length > 2) {
      cleanedValue = parts[0] + '.' + parts[1].substring(0, 2);
    }

    // 4. Convert to number for parent
    const numericValue = parseFloat(cleanedValue) || 0;
    
    // 5. Trigger parent state update
    onChange(numericValue);

    // 6. Handle Cursor Position manually
    // Calculate position relative to the end of the string
    // This prevents cursor jumping when formatting adds commas
    if (inputRef.current) {
      const currentCursor = inputRef.current.selectionStart || 0;
      const oldDisplayLength = displayValue.length;
      const newDisplayLength = formatter.format(numericValue).length;
      
      // Heuristic: if user is typing at the end, cursor stays at end.
      // If editing middle, we preserve relative position.
      // For simplicity in this phase, we let React re-render and then useEffect corrects it.
      
      // Save intended cursor position (approximately)
      setCursorPos(currentCursor + (newDisplayLength - oldDisplayLength)); 
    }
  };

  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium">
        {currency === 'BDT' ? '৳' : currency === 'INR' ? '₹' : '$'}
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-[50px] bg-white border border-gray-border rounded-md px-4 pl-10 text-h2 font-bold text-prussian focus:outline-none focus:ring-2 focus:ring-orange transition-all"
        style={{ fontVariantNumeric: 'tabular-nums' }} // Monospace numbers for stability
      />
    </div>
  );
};

export default AmountInput;
