import React, { ReactNode } from 'react';

interface CheckoutLayoutProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({
  title,
  subtitle,
  onBack,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-4 pb-6 pt-4">
        {(title || subtitle || onBack) && (
          <header className="mb-2 flex items-center justify-between gap-3">
            <div>
              {title && (
                <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {subtitle}
                </p>
              )}
            </div>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                Voltar
              </button>
            )}
          </header>
        )}

        {children}
      </main>
    </div>
  );
};

export default CheckoutLayout;
