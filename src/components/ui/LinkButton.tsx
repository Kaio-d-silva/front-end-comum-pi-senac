import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

type LinkButtonVariant = 'primary' | 'secondary';

interface LinkButtonProps extends LinkProps {
  variant?: LinkButtonVariant;
  fullWidth?: boolean;
  className?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...linkProps
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg px-4 text-sm font-semibold shadow-sm transition active:scale-[0.98] h-11';

  const variantClasses =
    variant === 'primary'
      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <Link
      {...linkProps}
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
