import React from 'react';

interface THeadJSProps {
  columns: string[];
}

const THeadJS: React.FC<THeadJSProps> = ({ columns }) => {
  return (
    <thead className="bg-slate-100">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            scope="col"
            className="border border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-700"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default THeadJS;
