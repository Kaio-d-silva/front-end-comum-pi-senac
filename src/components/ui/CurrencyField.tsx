import React, { useEffect, useState } from 'react';

interface CurrencyFieldProps {
  label: string;
  name?: string;
  value: number | null; // valor em reais (ex.: 19.9)
  onChange: (value: number | null) => void;
  placeholder?: string;
  prefix?: string; // ex.: "R$"
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const formatFromNumber = (value: number | null, prefix = 'R$'): string => {
  if (value === null || Number.isNaN(value)) return '';
  return `${prefix} ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatFromDigits = (digits: string, prefix = 'R$'): string => {
  if (!digits) return '';
  const cents = Number(digits);
  const reais = cents / 100;
  return formatFromNumber(reais, prefix);
};

const CurrencyField: React.FC<CurrencyFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'R$ 0,00',
  prefix = 'R$',
  error,
  helperText,
  required,
  disabled,
  className = '',
}) => {
  const [display, setDisplay] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  // Sincroniza display quando value externo muda (desde que não esteja editando)
  useEffect(() => {
    if (!isFocused) {
      setDisplay(formatFromNumber(value, prefix));
    }
  }, [value, prefix, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '').slice(0, 12); // até 999.999.999,99

    if (!digits) {
      setDisplay('');
      onChange(null);
      return;
    }

    const formatted = formatFromDigits(digits, prefix);
    setDisplay(formatted);

    const cents = Number(digits);
    const reais = cents / 100;
    onChange(Number.isNaN(reais) ? null : reais);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleFocus(_: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(true);

    // ao focar, se não tiver valor ainda, deixa em branco
    if (!display && (value === null || Number.isNaN(value))) {
      setDisplay('');
    }
  }

  const handleBlur = () => {
    setIsFocused(false);
    setDisplay(formatFromNumber(value, prefix));
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={name} className="text-xs font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
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

export default CurrencyField;
