import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import CheckoutLayout from '../components/layout/CheckoutLayout';
import FormField from '../components/ui/FormField';
import QuantityInput from '../components/ui/QuantityInput';
import SectionCard from '../components/ui/SectionCard';
import TextAreaField from '../components/ui/TextAreaField';
import { CartContext } from '../context/cartContext';
import PhoneField from '../components/ui/PhoneField';

const ShoppingCart: React.FC = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('CartContext não está disponível');
  }

  const { pratos, totalCompra, removerPrato, adicionarPrato } = cartContext;

  const navigate = useNavigate();
  const [address, setAddress] = useState<string>('');
  const [paymentInfo, setPaymentInfo] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity > 0) {
      const pratoExistente = pratos?.find((prato) => prato.id === id);
      if (!pratoExistente) return;

      const pratoAtualizado = {
        ...pratoExistente,
        quantidade: quantity,
      };

      adicionarPrato(pratoAtualizado);
      return;
    }

    removerPrato(id);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (Number.isNaN(quantity)) return;
    updateQuantity(id, quantity);
  };

  const handleConfirmOrder = () => {
    if (!pratos?.length) {
      alert('Seu carrinho está vazio.');
      return;
    }

    if (!phone || !address) {
      alert('Por favor, preencha telefone e endereço de entrega.');
      return;
    }

    alert('Pedido confirmado!');
  };

  return (
    <CheckoutLayout
      title="Finalizar pedido"
      subtitle="Revise seu carrinho e informe os dados para entrega."
      onBack={() => navigate(-1)}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Coluna esquerda: dados do cliente + pagamento */}
        <SectionCard
          title="Dados do cliente"
          subtitle="Informe seus dados para entrega e contato."
          className="flex-1"
        >
          <div className="space-y-4">
            <PhoneField
              label="Telefone Celular"
              name="clienteTelefone"
              value={phone}
              onChange={setPhone}
              helperText="Usaremos este número para contato sobre o pedido."
            />

            <TextAreaField
              label="Endereço de entrega"
              placeholder="Rua, número, bairro, complemento..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <SectionCard
              title="Pagamento"
              className="border border-slate-100 bg-slate-50/60"
            >
              <FormField
                label="Informações de pagamento"
                placeholder="Ex.: pagamento na entrega, PIX, cartão..."
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
              />
            </SectionCard>

            <div className="mt-2 flex items-center justify-between text-sm font-semibold text-slate-900">
              <span>Total</span>
              <span>
                {totalCompra.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirmOrder}
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              Confirmar pedido
            </button>
          </div>
        </SectionCard>

        {/* Coluna direita: carrinho */}
        <SectionCard title="Carrinho de compras" className="flex-1">
          {!pratos || pratos.length === 0 ? (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                Seu carrinho está vazio.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Adicione alguns pratos para visualizar aqui.
              </p>
            </div>
          ) : (
            <div className="mt-3 max-h-[24rem] space-y-3 overflow-y-auto pr-1">
              {pratos.map((prato) => (
                <div
                  key={prato.id}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {prato.nome}
                    </h3>
                    {typeof prato.valor === 'number' && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {prato.valor.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    )}
                  </div>

                  <QuantityInput
                    value={prato.quantidade}
                    min={0}
                    onChange={(value) => handleQuantityChange(prato.id, value)}
                  />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </CheckoutLayout>
  );
};

export default ShoppingCart;
