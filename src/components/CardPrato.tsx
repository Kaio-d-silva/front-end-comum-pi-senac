import React, { FC, useState } from 'react';
import { Link } from 'react-router';
import { CartContext, PratoCarrinho } from '../context/cartContext';
import Snackbar from './Snackbar';

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

interface CardPratoProps {
  id?: number;
  nome: string;
  cozinha: string;
  descricao_resumida: string;
  imagem: string;
  prazoValidade?: Date; // Opcional, caso queira adicionar no futuro
  valor?: number; // Opcional, caso queira adicionar no futuro
}

const CardPrato: FC<CardPratoProps> = (props) => {
  const cartContext = React.useContext(CartContext);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });

  if (!cartContext) {
    throw new Error('CartContext não está disponível');
  }

  const { pratos, adicionarPrato } = cartContext;

  const addDishToCart = () => {
    const pratoExists = pratos?.find((prato) => prato.id === props.id);
    if (!pratoExists) {
      const pratoToAdd: PratoCarrinho = {
        id: props.id,
        nome: props.nome,
        valor: props.valor,
        quantidade: 1,
      } as PratoCarrinho;
      adicionarPrato(pratoToAdd);
    } else {
      pratoExists.quantidade += 1;
      adicionarPrato(pratoExists);
    }
    setSnackbar({
      message: `Prato adicionado ao carrinho com sucesso! Quantidade: ${pratoExists ? pratoExists.quantidade : 1}`,
      type: 'success',
      duration: 5000,
    });
  };
  return (
    <div className="min-h-full relative bg-white shadow-md rounded-lg overflow-hidden">
      {/* Imagem do prato */}
      <img
        src={props.imagem}
        alt={props.nome}
        className="w-full h-48 object-cover"
      />

      {/* Conteúdo do card */}
      <div className="p-4">
        <h2 className="text-lg font-bold">{props.nome}</h2>
        <p className="text-sm text-gray-500">{props.cozinha}</p>
        <p className="text-sm mt-2 text-gray-700">{props.descricao_resumida}</p>
      </div>

      {/* Botão de menu e dropdown */}
      <div className="absolute top-2 right-2 group">
        <button className="menu-button bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 focus:outline-none">
          &#x22EE;
        </button>
        <div className="dropdown-menu absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
          <Link
            to="/carrinho"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Ir para carrinho
          </Link>
          <button
            type="button"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={addDishToCart}
          >
            Adicionar ao carrinho +
          </button>
          <Link
            to={`/detalhes/${props?.id}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() => setSnackbar({ message: '', type: 'info', duration: 0 })}
      />
    </div>
  );
};

export default CardPrato;
