import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useForm from '../hooks/useForm';
import api from '../http/api';
import Prato from '../interface/Prato';
import Snackbar from './Snackbar';

export interface PedidoFormProps {
  isEditing?: boolean; // Indica se o formulário está no modo de edição
}

interface PedidoFormParams extends Record<string, string | undefined> {
  id?: string; // ID do usuário, opcional
}

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

const FormularioPedido: React.FC<PedidoFormProps> = ({ isEditing = false }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });
  const defaultPratoValues = {
    usuarioId: ' ',
    clienteTelefone: ' ',
    itens: [{}],
    total: ' ',
    status: 'CRIADO',
  };

  // nome: '',
  // cozinha: '',
  // descricao_resumida: '',
  // descricao_detalhada: '',
  // imagem: '',
  // valor: 0,

  // {
  //   "id": 1,
  //   "usuarioId": 1,
  //   "clienteTelefone": "+5511999999999",
  //   "itens": [
  //     {
  //       "produtoId": 1,
  //       "quantidade": 2,
  //       "precoUnitario": 10.5
  //     }
  //   ],
  //   "total": 21,
  //   "status": "CRIADO",
  //   "createdAt": "2025-09-15T10:00:00Z",
  //   "updatedAt": "2025-09-15T10:00:00Z"
  // }

  const { values, errors, handleChange, validate, updateValues } =
    useForm(defaultPratoValues);

  const { id } = useParams<PedidoFormParams>();

  useEffect(() => {
    if (isEditing && id) {
      // Busca os dados do usuário para edição
      const fetchUser = async () => {
        try {
          const response = await api.get(`/pratos/${id}`);
          const { usuarioId, clienteTelefone, itens, total, status } =
            response.data;
          updateValues({
            usuarioId,
            clienteTelefone,
            itens,
            total,
            status,
          });
        } catch {
          setSnackbar({
            message: 'Erro ao carregar os dados do prato.',
            type: 'error',
            duration: 10000,
          });
        }
      };

      fetchUser();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validate({
      usuarioId: (value) => (!value ? 'Id do usuario é obrigatório' : null),
      clienteTelefone: (value) =>
        !value ? 'O telefone do cliente é obrigatorio.' : null,
      status: (value) => (!value ? 'O status é obrigado' : null),
      total: (value) => (!value ? 'O total dos itens é obritorio.' : null),
      itens: (value) =>
        !value || isNaN(Number(value))
          ? 'O valor deve ser um número válido.'
          : null,
    });

    if (isValid) {
      try {
        await api.post<Prato[]>('/pratos', values);
        setSnackbar({
          message: 'Prato cadastrado com sucesso!',
          type: 'success',
          duration: 10000,
        });
        updateValues(defaultPratoValues);
      } catch (error) {
        console.error('Erro ao cadastrar o prato:', error);
        setSnackbar({
          message: 'Erro ao cadastrar o prato. Tente novamente.',
          type: 'error',
          duration: 10000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Cadastrar Novo Pedido
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID do usuario
          </label>
          <input
            type="text"
            name="usuarioId"
            value={values.usuarioId}
            onChange={handleChange('usuarioId')}
            placeholder="Coloque o id do cliente"
            className={`w-full border rounded p-2 ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.usuarioId && (
            <p className="text-red-500 text-sm">{errors.imagem}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Prato
          </label>
          <input
            type="text"
            name="clienteTelefone"
            value={values.clienteTelefone}
            onChange={handleChange('clienteTelefone')}
            placeholder="Digite o nome do prato"
            className={`w-full border rounded p-2 ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Cadastrar Pedido
        </button>
      </form>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() => setSnackbar({ message: '', type: 'info', duration: 0 })}
      />
    </div>
  );
};

export default FormularioPedido;
