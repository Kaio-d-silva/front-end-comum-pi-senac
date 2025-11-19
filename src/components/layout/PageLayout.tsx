import React, { ReactNode } from 'react';

interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-6 pt-4">
        {(title || subtitle) && (
          <header className="mb-4">
            {title && (
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            )}
          </header>
        )}

        {children}
      </main>
    </div>
  );
};

export default PageLayout;
