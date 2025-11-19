import React, { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-10 text-center ${className}`}
    >
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">
          {icon}
        </div>
      )}

      <p className="text-sm font-medium text-slate-800 sm:text-base">
        {title}
      </p>

      {description && (
        <p className="mt-1 max-w-md text-xs text-slate-500 sm:text-sm">
          {description}
        </p>
      )}

      {actions && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
