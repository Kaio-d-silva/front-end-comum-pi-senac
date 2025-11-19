import React, { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
}

const Tag: React.FC<TagProps> = ({ children }) => {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-600">
      {children}
    </span>
  );
};

export default Tag;
