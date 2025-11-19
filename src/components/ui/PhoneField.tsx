import React from 'react';

interface PhoneFieldProps {
  label: string;
  name?: string;
  value: string; // apenas dígitos
  onChange: (digits: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const formatPhoneNumber = (digits: string) => {
  if (!digits) return '';

  const value = digits.replace(/\D/g, '').slice(0, 11);

  if (value.length <= 2) {
    return value;
  }

  if (value.length <= 6) {
    // (11) 1234
    return `(${value.slice(0, 2)}) ${value.slice(2)}`;
  }

  if (value.length <= 10) {
    // (11) 1234-5678
    return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
  }

  // (11) 91234-5678
  return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
};

const PhoneField: React.FC<PhoneFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '(00) 00000-0000',
  error,
  helperText,
  required,
  disabled,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    onChange(digits);
  };

  const displayValue = formatPhoneNumber(value);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={name} className="text-xs font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition
        ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100'
            : 'border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
        } disabled:cursor-not-allowed disabled:bg-slate-100`}
      />

      {error ? (
        <span className="text-[11px] text-red-500">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
};

export default PhoneField;
