/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useIsMounted } from '../hooks/useIsMounted';
import api from '../http/api';
import Prato from '../interface/Prato';
import CardPrato from './CardPrato';
import PageLayout from './layout/PageLayout';

function HomeCliente() {
  const isMounted = useIsMounted();
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchPratos = async () => {
      try {
        setLoading(true);
        setErro(null);

        const response = await api.get<Prato[]>('/pratos');

        setPratos(response.data);
      } catch (error) {
        setErro('Não foi possível carregar os pratos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (isMounted()) {
      fetchPratos();
    }
  }, [isMounted]);

  return (
    <PageLayout
      title="Pratos disponíveis"
      subtitle="Escolha um prato e adicione ao seu carrinho."
    >
      {loading ? (
        <section className="mt-4 space-y-4">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-40 rounded-xl bg-slate-200" />
            ))}
          </div>
        </section>
      ) : erro ? (
        <section className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </section>
      ) : pratos.length === 0 ? (
        <section className="mt-10 flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-slate-700">
            Nenhum prato disponível no momento.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Volte mais tarde para conferir novas opções.
          </p>
        </section>
      ) : (
        <section className="mt-4 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pratos.map((prato) => (
              <CardPrato key={prato.id ?? prato.nome} {...prato} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}

export default HomeCliente;
