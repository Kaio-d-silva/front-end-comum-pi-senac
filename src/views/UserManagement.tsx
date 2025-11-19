import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabelaJS from '../components/TabelaJS';
import EmptyState from '../components/ui/EmptyState';
import LinkButton from '../components/ui/LinkButton';
import SectionCard from '../components/ui/SectionCard';
import { useIsMounted } from '../hooks/useIsMounted';
import api from '../http/api';

interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const navigate = useNavigate();
  const isMounted = useIsMounted();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErro(null);

        const response = await api.get<User[]>('/users');

        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
        setErro('Não foi possível carregar a lista de usuários.');
      } finally {
        setLoading(false);
      }
    };

    if (isMounted()) {
      fetchData();
    }
  }, [isMounted]);

  const handleEdit = (user: User) => {
    navigate(`/admin/usuarios/editar/${user.id}`);
  };

  const handleDelete = async (user: User) => {
    try {
      await api.delete(`/users/${user.id}`);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
      setErro('Erro ao deletar o usuário. Tente novamente.');
    }
  };

  const handleView = (user: User) => {
    navigate(`/admin/usuarios/editar/${user.id}`);
  };

  const columns: (keyof User | 'Ações')[] = ['nome', 'email', 'role', 'Ações'];

  return (
    <div className="space-y-4">
      <SectionCard
        title="Gestão de usuários"
        subtitle="Visualize, cadastre e gerencie os usuários do sistema."
        actions={
          <LinkButton to="/admin/usuarios/novo" variant="primary">
            Novo usuário
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
        ) : users.length === 0 ? (
          <EmptyState
            title="Nenhum usuário cadastrado."
            description="Cadastre o primeiro usuário para começar a usar o sistema."
            icon={<span>👤</span>}
            actions={
              <LinkButton to="/admin/usuarios/novo" variant="primary">
                Criar usuário
              </LinkButton>
            }
          />
        ) : (
          <TabelaJS
            columns={columns}
            data={users}
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

export default UserManagement;
