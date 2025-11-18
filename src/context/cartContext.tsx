import React, { createContext, ReactNode, useState } from 'react';

export interface PratoCarrinho {
  id: number;
  quantidade: number;
  nome: string;
  valor: number;
}

interface CartContextType {
  pratos: PratoCarrinho[] | null;
  adicionarPrato: (prato: PratoCarrinho) => void;
  removerPrato: (pratoId: number) => void;
  totalCompra: number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [pratos, setPratos] = useState<PratoCarrinho[] | null>(null);

  const adicionarPrato = (prato: PratoCarrinho) => {
    const pratoExistente = pratos?.find((p) => p.id === prato.id);
    if (!pratoExistente) {
      setPratos((prevPratos) =>
        prevPratos ? [...prevPratos, prato] : [prato],
      );
      return;
    }
    if (pratoExistente && pratoExistente.quantidade < prato.quantidade) {
      pratoExistente.quantidade = prato.quantidade;
    } else if (pratoExistente && pratoExistente.quantidade > prato.quantidade) {
      pratoExistente.quantidade = prato.quantidade;
    }
    setPratos((prevPratos) =>
      prevPratos
        ? prevPratos.map((p) =>
            p.id === prato.id
              ? { ...p, quantidade: pratoExistente.quantidade }
              : p,
          )
        : null,
    );
  };
  const removerPrato = (pratoId: number) => {
    setPratos((prevPratos) =>
      prevPratos ? prevPratos.filter((p) => p.id !== pratoId) : null,
    );
  };
  const __countTotal = (sum: number, dish: PratoCarrinho) => {
    const newTotal = sum + dish.valor * dish.quantidade;

    return newTotal;
  };
  const totalCompra = pratos?.reduce(__countTotal, 0) || 0;
  return (
    <CartContext.Provider
      value={{ pratos, adicionarPrato, removerPrato, totalCompra }}
    >
      {children}
    </CartContext.Provider>
  );
};
