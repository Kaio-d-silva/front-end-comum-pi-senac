import React, { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  srLabel?: string; // label acessível opcional
}

const IconButton: React.FC<IconButtonProps> = ({
  srLabel,
  className = '',
  children,
  ...buttonProps
}) => {
  return (
    <button
      {...buttonProps}
      type={buttonProps.type || 'button'}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm outline-none ring-slate-200 transition hover:bg-slate-50 focus:ring-2 ${className}`}
      aria-label={srLabel}
    >
      {children}
    </button>
  );
};

export default IconButton;
