import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { toEnglishDigits } from '../../lib/utils';

interface AmountInputProps {
  value: number; // Expects a pure number from parent state
  onChange: (value: number) => void;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency = 'BDT',
  placeholder = '0',
  disabled = false,
  className = '',
  label
}) => {
  const { lang } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Local state for display string (formatted)
  const [displayValue, setDisplayValue] = useState('');

  // Formatter for specific locale
  const getFormatter = () => {
    return new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // Sync external value to display
  useEffect(() => {
    if (value === 0 || value === null || value === undefined) {
      setDisplayValue('');
    } else {
      setDisplayValue(getFormatter().format(value));
    }
  }, [value, lang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;

    // 1. If Bengali, convert digits to English first for internal logic
    if (lang === 'bn') {
      rawValue = toEnglishDigits(rawValue);
    }

    // 2. Extract only digits and decimal point
    let cleanedValue = rawValue.replace(/[^0-9.]/g, '');

    // 3. Handle multiple decimals (keep only first one)
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // 4. Limit decimal places to 2
    if (parts[1]?.length > 2) {
      cleanedValue = parts[0] + '.' + parts[1].substring(0, 2);
    }

    // 5. Convert to number for parent
    const numericValue = cleanedValue === '' ? 0 : parseFloat(cleanedValue);
    
    // 6. Update Parent State
    onChange(numericValue);

    // 7. Update Local Display (Visual Formatting)
    // If the user is typing, we want to show formatting immediately
    // But we need to be careful about cursor jumping.
    
    // Simple robust approach: 
    // If ends with '.', assume user is typing decimals (don't format yet fully)
    // Otherwise format.
    
    if (cleanedValue.endsWith('.')) {
      setDisplayValue(cleanedValue); // Let user finish typing decimal
    } else {
      // Format the number
      const num = parseFloat(cleanedValue);
      if (!isNaN(num)) {
         setDisplayValue(getFormatter().format(num));
      } else {
         setDisplayValue('');
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold mb-2 text-prussian">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium pointer-events-none">
          {currency === 'BDT' ? '৳' : currency}
        </span>
        <input
          ref={inputRef}
          type="text" // Use text to allow formatting commas
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-[50px] bg-white border border-gray-border rounded-md px-4 pl-10 text-h2 font-bold text-prussian focus:outline-none focus:ring-2 focus:ring-orange transition-all"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        />
      </div>
    </div>
  );
};

export default AmountInput;
