import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CartContext } from '../context/cartContext';

const formatPhoneNumber = (value: string) => {
  // Se o valor não for um dígito, remove-o
  if (!value) return "";
  
  // Mantém apenas dígitos
  value = value.replace(/\D/g, "");
  
  // Limita o comprimento a 11 dígitos (incluindo DDD e o 9 extra)
  value = value.substring(0, 11);

  // Aplica a máscara: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
  if (value.length <= 10) {
    // Formato para 8 ou 9 dígitos (ex: (DD) 1234-5678)
    return value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    // Formato para 9 dígitos (ex: (DD) 91234-5678)
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};

const ShoppingCart: React.FC = () => {
  const cartContext = React.useContext(CartContext);

  if (!cartContext) {
    throw new Error('CartContext não está disponível');
  }

  const { pratos, totalCompra, removerPrato, adicionarPrato } = cartContext;

  const navigate = useNavigate();
  const [address, setAddress] = useState<string>('');
  const [paymentInfo, setPaymentInfo] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const handleQuantityChange = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity > 0) {
      const pratoExists = pratos?.find((prato) => prato.id === id);
      if (!pratoExists) return;
      pratoExists.quantidade = quantity;
      adicionarPrato(pratoExists);
      return;
    }
    removerPrato(id);
  };

  const changeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedPhoneNumber);
  }

  const handleConfirmOrder = () => {
    alert('Pedido confirmado!');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Dados do cliente e pagamento */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold mb-4">Dados do Cliente</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Voltar
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone Celular
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Digite seu telefone celular"
            value={phone}
            onChange={changeNumber}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço de Entrega
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows={3}
            placeholder="Digite o endereço de entrega"
          />
        </div>

        <h2 className="text-xl font-bold mb-4">Pagamento</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Informações de Pagamento
          </label>
          <input
            type="text"
            value={paymentInfo}
            onChange={(e) => setPaymentInfo(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Digite os dados do pagamento"
          />
        </div>

        <div className="flex items-center justify-between font-bold text-lg">
          <span>Total:</span>
          <span>R$ {totalCompra.toFixed(2)}</span>
        </div>

        <button
          onClick={handleConfirmOrder}
          className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600"
        >
          Confirmar Pedido
        </button>
      </div>
      {/* Lista de pratos selecionados */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Carrinho de Compras</h2>
        <div className="h-96 overflow-y-auto">
          {pratos?.map((prato) => (
            <div
              key={prato.id}
              className="flex items-center justify-between border-b border-gray-200 py-2"
            >
              <div>
                <h3 className="text-lg font-semibold">{prato.nome}</h3>
                <p className="text-sm text-gray-500">
                  R$ {prato.valor.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleQuantityChange(prato.id, prato.quantidade - 1)
                  }
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  value={prato.quantidade}
                  onChange={(e) =>
                    handleQuantityChange(prato.id, parseInt(e.target.value, 10))
                  }
                  className="w-12 text-center border border-gray-300 rounded"
                  min={0}
                />
                <button
                  onClick={() =>
                    handleQuantityChange(prato.id, prato.quantidade + 1)
                  }
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
