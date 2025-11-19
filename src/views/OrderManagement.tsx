import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabelaJS from '../components/TabelaJS';
import EmptyState from '../components/ui/EmptyState';
import LinkButton from '../components/ui/LinkButton';
import SectionCard from '../components/ui/SectionCard';
import api from '../http/api';

export interface Order {
  id: number;
  cliente_nome: string;
  status: string;
  total: number;
}

export interface OrderMapped extends Order {
  id: number;
  cliente: string;
  status: string;
  total: number;
}

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderMapped[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErro(null);

        const response = await api.get<Order[]>('/pedidos');

        const ordersMapped = response.data.map((order) => ({
          ...order,
          cliente: order.cliente_nome,
          total: Number(order.total.toFixed(2)),
        }));

        setOrders(ordersMapped ?? []);
      } catch (error) {
        console.error('Erro ao buscar os pedidos:', error);
        setErro('Não foi possível carregar a lista de pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (order: Order) => {
    navigate(`/admin/pedidos/editar/${order.id}`);
  };

  const handleDelete = async (order: Order) => {
    try {
      await api.delete(`/pedidos/${order.id}`);
      setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));
    } catch (error) {
      console.error('Erro ao deletar o pedido:', error);
      setErro('Erro ao deletar o pedido. Tente novamente.');
    }
  };

  const handleView = (order: Order) => {
    navigate(`/admin/pedidos/detalhes/${order.id}`);
  };

  const columns: (keyof OrderMapped | 'Ações')[] = [
    'cliente',
    'status',
    'total',
    'Ações',
  ];

  return (
    <div className="space-y-4">
      <SectionCard
        title="Gestão de pedidos"
        subtitle="Visualize, edite e acompanhe os pedidos realizados."
        actions={
          <LinkButton to="/admin/pedidos/novo" variant="primary">
            Novo pedido
          </LinkButton>
        }
      >
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : erro ? (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="Nenhum pedido encontrado."
            description="Assim que novos pedidos forem realizados, eles aparecerão aqui."
            icon={<span>🧾</span>}
            actions={
              <LinkButton to="/admin/pedidos/novo" variant="primary">
                Criar primeiro pedido
              </LinkButton>
            }
          />
        ) : (
          <TabelaJS
            columns={columns}
            data={orders}
            actions={{
              view: handleView,
              edit: handleEdit,
              delete: handleDelete,
            }}
          />
        )}
      </SectionCard>
    </div>
  );
};

export default OrderManagement;
