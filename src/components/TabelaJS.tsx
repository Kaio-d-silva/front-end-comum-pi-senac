import React from 'react';
import TBodyJS from './TBodyJS';
import THeadJS from './THeadJS';

interface TabelaJSProps<T> {
  columns: (keyof T | 'Ações')[];
  data: T[];
  actions?: {
    [key: string]: (item: T) => void;
  };
  emptyMessage?: string;
}

const TabelaJS = <T,>({
  columns,
  data,
  actions,
  emptyMessage = 'Nenhum registro encontrado.',
}: TabelaJSProps<T>) => {
  const columnStrings = columns.map((col) => col.toString());

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <THeadJS columns={columnStrings} />
        <TBodyJS data={data} columns={columns} actions={actions} />
      </table>

      {data.length === 0 && (
        <div className="border-t border-slate-100 px-4 py-3 text-center text-xs text-slate-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default TabelaJS;
