import React, { InputHTMLAttributes } from 'react';

interface ValidatedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  ...rest
}) => {
  const hasError = Boolean(error);
  const hasValue = value !== '';

  return (
    <div className="mb-4 w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={hasError}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm shadow-sm outline-none transition focus:ring-2 ${
          hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
            : hasValue
              ? 'border-sky-500 focus:border-sky-500 focus:ring-sky-100'
              : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
        } ${className}`}
        {...rest}
      />
      {hasError && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
};

export default ValidatedInput;
