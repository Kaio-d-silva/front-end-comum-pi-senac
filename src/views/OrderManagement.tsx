import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TabelaJS from '../components/TabelaJS';
import api from '../http/api';

export interface Order {
  id: number;
  cliente_nome: string;
  status: string;
  total: number;
}

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Order[]>('/pedidos');
        if (!response.status.toString().startsWith('2')) {
          throw new Error('Erro ao buscar os pedidos');
        }
        const data: Order[] = response.data;
        console.log(data);
        setOrders(data);
      } catch (error) {
        console.error('Erro ao buscar os pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleEdit = (user: Order) => {
    navigate(`/admin/pedidos/editar/${user.id}`);
  };

  const handleDelete = async (order: Order) => {
    try {
      const response = await api.delete(`/pedidos/${order.id}`);
      console.log('Usuário deletado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
    }
    console.log(`Deletar usuário com ID: ${order.id}`);
    setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));
  };

  const handleView = (order: Order) => {
    navigate(`/admin/pedidos/editar/${order.id}`);
  };
  const columns: (keyof Order | 'Ações')[] = [
    'cliente_nome',
    'status',
    'total',
    'Ações',
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestão de Pedidos</h2>
        <button
          type="button"
          onClick={() => navigate('/admin/pedidos/novo')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Pedido
        </button>
      </div>
      {loading ? (
        <p className="text-center">Carregando usuários...</p>
      ) : (
        <TabelaJS
          columns={columns}
          data={orders}
          actions={{
            edit: handleEdit,
            delete: handleDelete,
            view: handleView,
          }}
        />
      )}
    </div>
  );
};

export default OrderManagement;
