import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../../context/cartContext';
import { useNavigate } from 'react-router-dom';

interface CartIconButtonProps {
  size?: number;
}

const CartIconButton: React.FC<CartIconButtonProps> = ({ size = 22 }) => {
  const cartContext = React.useContext(CartContext);
  const navigate = useNavigate();

  if (!cartContext) throw new Error('CartContext não está disponível');

  const { pratos } = cartContext;

  const totalQuantidade =
    pratos?.reduce((sum, p) => sum + p.quantidade, 0) || 0;

  return (
    <button
      onClick={() => navigate('/carrinho')}
      className="relative bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition"
    >
      <FiShoppingCart size={size} />

      {totalQuantidade > 0 && (
        <span
          className="
          absolute -top-1.5 -right-1.5 
          bg-red-500 text-white text-[10px]
          h-5 w-5 rounded-full flex items-center justify-center
          font-bold shadow
        "
        >
          {totalQuantidade}
        </span>
      )}
    </button>
  );
};

export default CartIconButton;
