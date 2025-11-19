import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../http/api';
import { useIsMounted } from '../hooks/useIsMounted';
import Snackbar from '../components/Snackbar';
import PhoneField from '../components/ui/PhoneField';
import CurrencyField from '../components/ui/CurrencyField';

import SectionCard from '../components/ui/SectionCard';
import FormField from '../components/ui/FormField';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';

import Prato from '../interface/Prato';
import ProductSelect from '../components/ui/ProductSelect';
import { AxiosInstance } from 'axios';

interface OrderItemForm {
  produtoId: string;
  quantidade: number | '';
  precoUnitario: number | '';
}

interface OrderPayload {
  userId?: string;
  clienteTelefone?: string;
  itens: {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
  }[];
}

interface OrderDetailsResponse extends OrderPayload {
  id: number;
}

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

interface OrderFormParams extends Record<string, string | undefined> {
  id?: string;
}

interface OrderFormProps {
  isEditing?: boolean;
}

interface FieldErrors {
  userId?: string;
  clienteTelefone?: string;
}

interface ItemErrors {
  produtoId?: string;
  quantidade?: string;
  precoUnitario?: string;
}

const defaultItem: OrderItemForm = {
  produtoId: '',
  quantidade: '',
  precoUnitario: '',
};

const OrderForm: React.FC<OrderFormProps> = ({ isEditing = false }) => {
  const [userId, setUserId] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [itens, setItens] = useState<OrderItemForm[]>([defaultItem]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [itemErrors, setItemErrors] = useState<ItemErrors[]>([]);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });

  const [products, setProducts] = useState<Prato[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const { id } = useParams<OrderFormParams>();
  const navigate = useNavigate();
  const isMounted = useIsMounted();

  // Buscar lista de produtos (pratos)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await api.get<Prato[]>('/pratos');
        setProducts(response.data ?? []);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setSnackbar({
          message: 'Erro ao carregar a lista de produtos.',
          type: 'error',
          duration: 6000,
        });
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Buscar pedido para edição
  useEffect(() => {
    if (!isEditing || !id || !isMounted()) return;

    const fetchOrder = async () => {
      try {
        setLoadingOrder(true);
        const response = await api.get<OrderDetailsResponse>(`/pedidos/${id}`);

        const { userId, clienteTelefone, itens } = response.data;

        setUserId(userId ?? '');
        setClienteTelefone(
          (clienteTelefone ?? '').replace(/\D/g, '').slice(0, 11),
        );

        setItens(
          itens && itens.length
            ? itens.map((item) => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
              }))
            : [defaultItem],
        );
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        setSnackbar({
          message: 'Erro ao carregar os dados do pedido.',
          type: 'error',
          duration: 8000,
        });
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [id, isEditing, isMounted]);

  // Manipulação dos itens
  const handleItemChange = (
    index: number,
    field: keyof OrderItemForm,
    value: string,
  ) => {
    setItens((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === 'quantidade' || field === 'precoUnitario'
                  ? value === ''
                    ? ''
                    : Number(value)
                  : value,
            }
          : item,
      ),
    );
  };

  const handleSelectProduct = (index: number, produtoId: string) => {
    if (isProductDuplicate(produtoId, index)) {
      setSnackbar({
        message: 'Este produto já foi adicionado ao pedido.',
        type: 'warning',
        duration: 5000,
      });

      // marca erro apenas no item selecionado
      setItemErrors((prev) =>
        prev.map((err, i) =>
          i === index ? { ...err, produtoId: 'Produto já selecionado' } : err,
        ),
      );
      return;
    }

    // limpa erro se estava marcado
    setItemErrors((prev) =>
      prev.map((err, i) =>
        i === index ? { ...err, produtoId: undefined } : err,
      ),
    );

    const produto = products.find((p) => String(p.id) === String(produtoId));

    setItens((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              produtoId,
              precoUnitario:
                item.precoUnitario === '' || item.precoUnitario === 0
                  ? (produto?.valor ?? '')
                  : item.precoUnitario,
            }
          : item,
      ),
    );
  };

  const handleAddItem = () => {
    setItens((prev) => [...prev, defaultItem]);
    setItemErrors((prev) => [...prev, {}]);
  };

  const handleRemoveItem = (index: number) => {
    setItens((prev) => prev.filter((_, i) => i !== index));
    setItemErrors((prev) => prev.filter((_, i) => i !== index));
  };

  // Validação
  const validateForm = (): boolean => {
    const newFieldErrors: FieldErrors = {};
    const newItemErrors: ItemErrors[] = [];

    if (!userId && !clienteTelefone) {
      newFieldErrors.userId = 'Informe o usuário ou o telefone do cliente.';
      newFieldErrors.clienteTelefone =
        'Informe o usuário ou o telefone do cliente.';
    }

    if (clienteTelefone && clienteTelefone.length < 10) {
      newFieldErrors.clienteTelefone = 'Informe um telefone válido.';
    }

    // Verifica duplicidade
    const produtoIds = itens.map((i) => i.produtoId).filter(Boolean);
    const hasDuplicates = new Set(produtoIds).size !== produtoIds.length;

    if (hasDuplicates) {
      setSnackbar({
        message: 'Existem produtos duplicados no pedido. Verifique os itens.',
        type: 'error',
        duration: 6000,
      });

      // Marca erro individual nos duplicados
      const newItemErrors = itens.map((item) => {
        const occurrences = itens.filter(
          (i) => i.produtoId === item.produtoId,
        ).length;
        return occurrences > 1 ? { produtoId: 'Produto duplicado' } : {};
      });

      setItemErrors(newItemErrors);
      return false;
    }

    itens.forEach((item, index) => {
      const err: ItemErrors = {};
      if (!item.produtoId) {
        err.produtoId = 'Obrigatório.';
      }
      if (item.quantidade === '' || Number(item.quantidade) <= 0) {
        err.quantidade = 'Informe uma quantidade maior que zero.';
      }
      if (item.precoUnitario === '' || Number(item.precoUnitario) <= 0) {
        err.precoUnitario = 'Informe um preço maior que zero.';
      }
      newItemErrors[index] = err;
    });

    setFieldErrors(newFieldErrors);
    setItemErrors(newItemErrors);

    const hasFieldErrors = Object.keys(newFieldErrors).length > 0;
    const hasItemErrors = newItemErrors.some(
      (e) => e.produtoId || e.quantidade || e.precoUnitario,
    );

    if (hasFieldErrors || hasItemErrors) {
      setSnackbar({
        message: 'Corrija os campos destacados antes de continuar.',
        type: 'warning',
        duration: 6000,
      });
      return false;
    }

    return true;
  };

  // Total do pedido em tempo real
  const orderTotal = useMemo(() => {
    return itens.reduce((total, item) => {
      const q = Number(item.quantidade) || 0;
      const p = Number(item.precoUnitario) || 0;
      return total + q * p;
    }, 0);
  }, [itens]);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: OrderPayload = {
      userId: userId || undefined,
      clienteTelefone: clienteTelefone || undefined, // já é só dígitos
      itens: itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: Number(item.quantidade),
        precoUnitario: Number(item.precoUnitario),
      })),
    };

    try {
      setSubmitting(true);

      const url = isEditing && id ? `/pedidos/${id}` : '/pedidos';
      const method = isEditing && id ? 'put' : 'post';

      const response = await (api as AxiosInstance)[method](url, payload);

      if (response.status >= 200 && response.status < 300) {
        setSnackbar({
          message: isEditing
            ? 'Pedido atualizado com sucesso!'
            : 'Pedido criado com sucesso!',
          type: 'success',
          duration: 6000,
        });
        navigate('/admin/pedidos');
      }
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      setSnackbar({
        message: 'Erro ao salvar o pedido. Tente novamente.',
        type: 'error',
        duration: 8000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isProductDuplicate = (produtoId: string, index: number): boolean => {
    return itens.some((item, i) => i !== index && item.produtoId === produtoId);
  };

  const handleItemPriceChange = (index: number, value: number | null) => {
    setItens((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, precoUnitario: value === null ? '' : value }
          : item,
      ),
    );
  };

  const title = isEditing ? 'Editar pedido' : 'Criar pedido';
  const subtitle = isEditing
    ? 'Atualize os dados do pedido.'
    : 'Preencha os dados para registrar um novo pedido.';

  return (
    <div className="space-y-4">
      <SectionCard title={title} subtitle={subtitle}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identificação do cliente */}
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              label="ID do usuário (opcional)"
              name="userId"
              type="text"
              placeholder="Ex: 123"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              error={fieldErrors.userId}
            />

            <PhoneField
              label="Telefone do cliente (opcional)"
              name="clienteTelefone"
              value={clienteTelefone} // só dígitos
              onChange={setClienteTelefone} // recebe só dígitos
              error={fieldErrors.clienteTelefone}
              helperText="Informe um telefone ou um usuário para identificar o cliente."
            />
          </div>

          {/* Itens do pedido */}
          <div className="mt-2 space-y-3">
            <p className="text-sm font-semibold text-slate-900">
              Itens do pedido
            </p>
            <p className="text-xs text-slate-500">
              Adicione pelo menos um item com produto, quantidade e preço.
            </p>

            {itens.map((item, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[2fr,1fr,1fr,auto]"
              >
                {/* Produto (select com busca) */}
                <div className="flex flex-col">
                  {loadingProducts ? (
                    <div className="h-11 w-full animate-pulse rounded-lg bg-slate-100" />
                  ) : (
                    <ProductSelect
                      label="Produto"
                      products={products}
                      value={item.produtoId}
                      onChange={(produtoId) =>
                        handleSelectProduct(index, produtoId)
                      }
                      error={itemErrors[index]?.produtoId}
                    />
                  )}
                </div>

                {/* Quantidade */}
                <FormField
                  label="Quantidade"
                  name={`quantidade-${index}`}
                  type="number"
                  min={1}
                  placeholder="Qtd"
                  value={item.quantidade?.toString() ?? ''}
                  onChange={(e) =>
                    handleItemChange(index, 'quantidade', e.target.value)
                  }
                  error={itemErrors[index]?.quantidade}
                />

                {/* Preço unitário (pode ser sobrescrito manualmente) */}
                <CurrencyField
                  label="Preço unitário"
                  name={`precoUnitario-${index}`}
                  value={
                    typeof item.precoUnitario === 'number'
                      ? item.precoUnitario
                      : null
                  }
                  onChange={(val) => handleItemPriceChange(index, val)}
                  error={itemErrors[index]?.precoUnitario}
                />

                <div className="flex items-end">
                  {itens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="h-11 w-full rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddItem}
              className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              + Adicionar item
            </button>
          </div>

          {/* Resumo do pedido */}
          <div className="mt-4 flex flex-col items-end">
            <p className="text-sm font-semibold text-slate-700">
              Total do pedido:{' '}
              <span className="text-base text-emerald-700">
                {orderTotal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </p>
          </div>

          {/* Ações */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <SecondaryButton
              type="button"
              onClick={() => navigate('/admin/pedidos')}
              fullWidth
              className="sm:w-auto"
              disabled={submitting}
            >
              Cancelar
            </SecondaryButton>

            <PrimaryButton
              type="submit"
              fullWidth
              className="sm:w-auto"
              disabled={submitting || (loadingOrder && isEditing)}
            >
              {submitting
                ? isEditing
                  ? 'Salvando...'
                  : 'Criando...'
                : isEditing
                  ? 'Salvar alterações'
                  : 'Criar pedido'}
            </PrimaryButton>
          </div>
        </form>
      </SectionCard>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() => setSnackbar({ message: '', type: 'info', duration: 0 })}
      />
    </div>
  );
};

export default OrderForm;
