import React, { useEffect, useMemo, useState } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import Prato from '../../interface/Prato';

interface ProductSelectProps {
  label?: string;
  products: Prato[];
  value: string; // aqui você guarda o produtoId
  onChange: (produtoId: string) => void;
  error?: string;
}

const ProductSelect: React.FC<ProductSelectProps> = ({
  label = 'Produto',
  products,
  value,
  onChange,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // debounce do termo de busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300); // 300ms de debounce

    return () => clearTimeout(timer);
  }, [query]);

  const selectedProduct = useMemo(
    () => products.find((p) => String(p.id) === String(value)),
    [products, value],
  );

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return products;
    const lower = debouncedQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.nome.toLowerCase().includes(lower) ||
        p.descricao_resumida.toLowerCase().includes(lower),
    );
  }, [products, debouncedQuery]);

  const handleSelect = (produtoId: number) => {
    onChange(String(produtoId));
    setOpen(false);
    setQuery(''); // opcional: limpar busca após seleção
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-700">{label}</label>

      <div className="relative">
        <button
          type="button"
          className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-sm shadow-sm outline-none transition ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100'
              : 'border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
          }`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="truncate text-slate-800">
            {selectedProduct ? selectedProduct.nome : 'Selecione um produto'}
          </span>
          <FiChevronDown className="ml-2 text-slate-400" />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
            {/* Campo de busca */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-2 py-1.5">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-8 w-full border-none text-xs text-slate-800 outline-none"
                placeholder="Buscar por nome ou descrição..."
              />
            </div>

            {/* Lista de produtos */}
            <div className="max-h-56 overflow-y-auto py-1 text-sm">
              {filteredProducts.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-500">
                  Nenhum produto encontrado.
                </p>
              ) : (
                filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelect(p.id)}
                    className={`flex w-full flex-col items-start px-3 py-2 text-left hover:bg-slate-50 ${
                      String(p.id) === String(value) ? 'bg-slate-50' : ''
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-900">
                      {p.nome}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {p.descricao_resumida}
                    </span>
                    <span className="mt-0.5 text-[11px] text-emerald-700">
                      {p.valor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
};

export default ProductSelect;
