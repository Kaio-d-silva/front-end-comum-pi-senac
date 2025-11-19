import React, { FC, useState, useContext } from 'react';
import { Link } from 'react-router';
import { CartContext, PratoCarrinho } from '../context/cartContext';
import Snackbar from './Snackbar';
import Card from './ui/Card';
import PrimaryButton from './ui/PrimaryButton';
import IconButton from './ui/IconButton';
import Tag from './ui/Tag';

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

interface CardPratoProps {
  id: number;
  nome: string;
  cozinha: string;
  descricao_resumida: string;
  imagem: string;
  prazoValidade?: Date;
  valor: number;
}

const CardPrato: FC<CardPratoProps> = ({
  id,
  nome,
  cozinha,
  descricao_resumida,
  imagem,
  valor,
}) => {
  const cartContext = useContext(CartContext);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!cartContext) {
    throw new Error('CartContext não está disponível');
  }

  const { pratos, adicionarPrato } = cartContext;

  const handleAddDishToCart = () => {
    const pratoExistente = pratos?.find((prato) => prato.id === id);
    const quantidade = pratoExistente ? pratoExistente.quantidade + 1 : 1;

    const pratoToAdd: PratoCarrinho = pratoExistente
      ? { ...pratoExistente, quantidade }
      : {
          id,
          nome,
          valor,
          quantidade,
        };

    adicionarPrato(pratoToAdd);

    setSnackbar({
      message: `Prato adicionado ao carrinho com sucesso! Quantidade: ${quantidade}`,
      type: 'success',
      duration: 5000,
    });

    setIsMenuOpen(false);
  };

  return (
    <Card>
      {/* Imagem */}
      <div className="relative">
        <img
          src={imagem}
          alt={nome}
          className="h-40 w-full object-cover sm:h-44"
          loading="lazy"
        />

        {/* Menu de opções */}
        <div className="absolute right-2 top-2">
          <IconButton
            srLabel="Mais opções"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            &#x22EE;
          </IconButton>

          {isMenuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-slate-100 bg-white text-sm text-slate-700 shadow-lg">
              <Link
                to="/carrinho"
                className="block px-4 py-2 hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Ir para carrinho
              </Link>
              <button
                type="button"
                className="block w-full px-4 py-2 text-left hover:bg-slate-50"
                onClick={handleAddDishToCart}
              >
                Adicionar ao carrinho +
              </button>
              <Link
                to={`/detalhes/${id}`}
                className="block px-4 py-2 hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Ver detalhes
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="space-y-1">
          <h2 className="line-clamp-2 text-base font-semibold text-slate-900">
            {nome}
          </h2>

          <Tag>{cozinha}</Tag>
        </div>

        <p className="mt-2 line-clamp-3 text-xs text-slate-600">
          {descricao_resumida}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          {typeof valor === 'number' && (
            <div>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                a partir de
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {valor.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
          )}

          <PrimaryButton
            onClick={handleAddDishToCart}
            className="sm:flex-none"
          >
            Adicionar
          </PrimaryButton>
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() =>
          setSnackbar({ message: '', type: 'info', duration: 0 })
        }
      />
    </Card>
  );
};

export default CardPrato;
