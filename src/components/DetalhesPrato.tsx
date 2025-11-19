import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIsMounted } from '../hooks/useIsMounted';
import api from '../http/api';
import PageLayout from './layout/PageLayout';
import PrimaryButton from './ui/PrimaryButton';
import SecondaryButton from './ui/SecondaryButton';

interface Prato {
  id: number;
  nome: string;
  cozinha: string;
  descricaoDetalhada: string;
  imagem: string;
  valor: number;
}

const DetalhesPrato: React.FC = () => {
  const isMounted = useIsMounted();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [prato, setPrato] = useState<Prato | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function fetchPratoDetails(pratoId: string): Promise<Prato> {
    const response = await api.get<Prato>(`/pratos/${pratoId}`);
    return response.data;
  }

  useEffect(() => {
    const fetchPrato = async () => {
      try {
        if (!id) return;

        setLoading(true);
        setErro(null);

        const response = await fetchPratoDetails(id);

        setPrato(response);
      } catch (error) {
        console.error('Erro ao buscar os detalhes do prato:', error);
        setErro('Não foi possível carregar os detalhes do prato.');
      } finally {
        setLoading(false);
      }
    };

    if (id && isMounted()) {
      fetchPrato();
    }
  }, [id, isMounted]);

  const handleAddToCart = () => {
    if (!prato) return;
    // Aqui ainda está simples com alert; depois podemos plugar no CartContext + Snackbar
    alert(`Prato "${prato.nome}" foi adicionado ao carrinho!`);
  };

  return (
    <PageLayout
      title="Detalhes do prato"
      subtitle="Veja mais informações sobre sua escolha antes de adicioná-la ao carrinho."
    >
      {loading ? (
        <section className="mt-4 flex justify-center">
          <div className="h-64 w-full max-w-3xl animate-pulse rounded-xl bg-slate-200" />
        </section>
      ) : erro ? (
        <section className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </section>
      ) : !prato ? (
        <section className="mt-6 text-center text-sm text-slate-600">
          Não encontramos detalhes para esse prato.
        </section>
      ) : (
        <section className="mt-4 flex justify-center">
          <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            {/* Imagem + infos principais */}
            <div className="flex flex-col md:flex-row">
              <img
                src={prato.imagem}
                alt={`Imagem de ${prato.nome}`}
                className="h-56 w-full object-cover md:h-auto md:w-1/2"
                loading="lazy"
              />

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
                  {prato.nome}
                </h1>

                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Cozinha:{' '}
                  <span className="font-semibold">{prato.cozinha}</span>
                </p>

                <p className="mt-3 text-sm font-semibold text-emerald-700 sm:text-base">
                  {prato.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </div>
            </div>

            {/* Descrição */}
            <div className="border-t border-slate-100 p-4 sm:p-6">
              <p className="text-sm font-semibold text-slate-900 sm:text-base">
                Descrição da experiência gastronômica
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {prato.descricaoDetalhada}
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <SecondaryButton
                type="button"
                onClick={() => navigate(-1)}
                className="sm:w-auto"
              >
                Voltar
              </SecondaryButton>

              <PrimaryButton
                type="button"
                onClick={handleAddToCart}
                fullWidth
                className="sm:w-auto"
              >
                Adicionar ao carrinho
              </PrimaryButton>
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default DetalhesPrato;
