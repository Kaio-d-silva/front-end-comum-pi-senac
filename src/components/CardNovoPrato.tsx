import React from 'react';
import { Link } from 'react-router-dom';
import adicionarPrato from '../assets/imagem_adicionar_prato.jpg';

const CardNovoPrato = () => {
  return (
    <Link to="/cadastro-prato" className="group block">
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-emerald-500 bg-white p-4 text-center shadow-sm transition hover:border-emerald-600 hover:bg-emerald-50 hover:shadow-md active:scale-[0.98]">
        {/* Imagem decorativa */}
        <img
          src={adicionarPrato}
          alt="Adicionar prato"
          className="h-24 w-24 object-cover opacity-80 transition group-hover:opacity-100"
          loading="lazy"
        />

        {/* Título */}
        <h2 className="mt-3 text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
          Clique aqui para adicionar um novo prato
        </h2>
      </div>
    </Link>
  );
};

export default CardNovoPrato;
