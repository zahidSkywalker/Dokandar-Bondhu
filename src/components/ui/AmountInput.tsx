import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { toEnglishDigits } from '../../lib/utils';

interface AmountInputProps {
  value: number;
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
  const [displayValue, setDisplayValue] = useState('');

  const getFormatter = () => {
    return new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    if (value === 0 || value === null || value === undefined) {
      setDisplayValue('');
    } else {
      setDisplayValue(getFormatter().format(value));
    }
  }, [value, lang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;

    if (lang === 'bn') {
      rawValue = toEnglishDigits(rawValue);
    }

    let cleanedValue = rawValue.replace(/[^0-9.]/g, '');
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1]?.length > 2) {
      cleanedValue = parts[0] + '.' + parts[1].substring(0, 2);
    }

    const numericValue = cleanedValue === '' ? 0 : parseFloat(cleanedValue);
    onChange(numericValue);

    if (cleanedValue.endsWith('.')) {
      setDisplayValue(cleanedValue);
    } else {
      const num = parseFloat(cleanedValue);
      if (!isNaN(num)) setDisplayValue(getFormatter().format(num));
      else setDisplayValue('');
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-bold text-prussian mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-prussian/50 font-bold pointer-events-none">
          {currency === 'BDT' ? '৳' : currency}
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-[52px] bg-white border border-gray-border rounded-xl pl-10 pr-4 text-right text-xl font-bold text-prussian focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all disabled:bg-gray-50"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        />
      </div>
    </div>
  );
};

export default AmountInput;
