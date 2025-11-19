import React, { ReactNode, TextareaHTMLAttributes } from 'react';

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: ReactNode;
  error?: string | null;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  helperText,
  error,
  className = '',
  ...textareaProps
}) => {
  const hasError = Boolean(error);

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-700">
        {label}
      </label>
      <textarea
        {...textareaProps}
        className={`min-h-[96px] w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 ${
          hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
            : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
        } ${className}`}
      />
      {hasError ? (
        <p className="text-[11px] text-red-500">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default TextAreaField;
