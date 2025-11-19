import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabelaJS from '../components/TabelaJS';
import EmptyState from '../components/ui/EmptyState';
import LinkButton from '../components/ui/LinkButton';
import SectionCard from '../components/ui/SectionCard';
import api from '../http/api';
import PratoApi from '../interface/Prato';

interface PratoRow {
  id: number;
  nome: string;
  cozinha: string;
  descricaoCurta: string;
  valor: number;
}

export default function Home() {
  const [pratos, setPratos] = useState<PratoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPratos = async () => {
      try {
        setLoading(true);
        setErro(null);

        const response = await api.get<PratoApi[]>('/pratos');

        // Mapeia da interface oficial (descricao_resumida) para a usada na tabela (descricaoCurta)
        const mapped: PratoRow[] = response.data.map((prato) => ({
          id: prato.id,
          nome: prato.nome,
          cozinha: prato.cozinha,
          descricaoCurta: prato.descricao_resumida,
          valor: prato.valor,
        }));

        setPratos(mapped);
      } catch (error) {
        console.error('Erro ao buscar pratos:', error);
        setErro('Não foi possível carregar a lista de pratos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPratos();
  }, []);

  const handleEdit = (prato: PratoRow) => {
    navigate(`/admin/detalhes-prato/${prato.id}`);
  };

  const handleDelete = async (prato: PratoRow) => {
    try {
      await api.delete(`/pratos/${prato.id}`);
      setPratos((prevPratos) => prevPratos.filter((p) => p.id !== prato.id));
    } catch (error) {
      console.error('Erro ao deletar o prato:', error);
      setErro('Erro ao deletar o prato. Tente novamente.');
    }
  };

  const handleView = (prato: PratoRow) => {
    navigate(`/admin/detalhes-prato/${prato.id}`);
  };

  const columns: (keyof PratoRow | 'Ações')[] = [
    'nome',
    'cozinha',
    'descricaoCurta',
    'valor',
    'Ações',
  ];

  return (
    <div className="space-y-4">
      <SectionCard
        title="Lista de pratos"
        subtitle="Gerencie os pratos disponíveis no cardápio."
        actions={
          <LinkButton to="/admin/novo-prato" variant="primary">
            Novo prato
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
        ) : pratos.length === 0 ? (
          <EmptyState
            title="Nenhum prato disponível no momento."
            description="Volte mais tarde ou entre em contato com o restaurante."
            icon={<span>🍽️</span>}
          />
        ) : (
          <TabelaJS
            columns={columns}
            data={pratos}
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
}
