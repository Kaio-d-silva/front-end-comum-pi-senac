import React from 'react';

interface TBodyJSProps<T> {
  data: T[];
  columns: (keyof T | 'Ações')[];
  actions?: {
    [key: string]: (item: T) => void;
  };
}

const TBodyJS = <T,>({ data, columns, actions }: TBodyJSProps<T>) => {
  const getCellValue = (row: T, column: keyof T) => {
    const value = row[column];
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') {
      return value.toString();
    }
    // fallback bem simples para objetos / datas
    return String(value);
  };

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-t border-slate-100 hover:bg-slate-50"
        >
          {columns.map((column, colIndex) => (
            <td
              key={colIndex}
              className="border border-slate-100 px-3 py-2 align-middle text-xs text-slate-700"
            >
              {column === 'Ações' && actions ? (
                <div className="flex flex-wrap gap-2">
                  {Object.keys(actions).map((actionKey) => {
                    const actionHandler = actions[actionKey];
                    const baseClasses =
                      'px-2 py-1 rounded-md text-xs font-medium transition';

                    const variantClasses =
                      actionKey === 'edit'
                        ? 'bg-sky-500 text-white hover:bg-sky-600'
                        : actionKey === 'delete'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-slate-500 text-white hover:bg-slate-600';

                    return (
                      <button
                        key={actionKey}
                        type="button"
                        onClick={() => actionHandler(row)}
                        className={`${baseClasses} ${variantClasses}`}
                      >
                        {actionKey.charAt(0).toUpperCase() + actionKey.slice(1)}
                      </button>
                    );
                  })}
                </div>
              ) : (
                getCellValue(row, column as keyof T)
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TBodyJS;
