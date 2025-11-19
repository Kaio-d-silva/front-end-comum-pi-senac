import React, { JSX, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '../components/Snackbar';
import { useIsMounted } from '../hooks/useIsMounted';
import api from '../http/api';
import FormField from '../components/ui/FormField';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

interface UserFormParams extends Record<string, string | undefined> {
  id?: string;
}

interface UserFormProps {
  isEditing?: boolean;
}

function UserForm({ isEditing = false }: UserFormProps): JSX.Element {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });
  const [loadingUser, setLoadingUser] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const isMounted = useIsMounted();
  const { id } = useParams<UserFormParams>();

  useEffect(() => {
    if (isEditing && id && isMounted()) {
      const fetchUser = async () => {
        try {
          setLoadingUser(true);
          const response = await api.get<{ nome: string; email: string }>(
            `/users/${id}`,
          );
          const { nome, email: fetchedEmail } = response.data;
          setName(nome);
          setEmail(fetchedEmail);
        } catch {
          setSnackbar({
            message: 'Erro ao carregar os dados do usuário',
            type: 'error',
            duration: 10000,
          });
        } finally {
          setLoadingUser(false);
        }
      };

      fetchUser();
    }
  }, [id, isEditing, isMounted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validações bem simples (se quiser podemos plugar useForm depois)
    if (!name.trim() || !email.trim() || (!isEditing && !password.trim())) {
      setSnackbar({
        message: 'Preencha todos os campos obrigatórios.',
        type: 'warning',
        duration: 5000,
      });
      return;
    }

    try {
      setSubmitting(true);

      const url = isEditing ? `/users/${id}` : '/users';
      const method = isEditing ? 'put' : 'post';

      const response = await api[method](url, {
        nome: name,
        email,
        senha: password || undefined,
      });

      if (response.status >= 200 && response.status < 300) {
        setSnackbar({
          message: isEditing
            ? 'Usuário atualizado com sucesso'
            : 'Usuário criado com sucesso',
          type: 'success',
          duration: 6000,
        });

        navigate('/admin/usuarios');
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setSnackbar({
        message: axiosError.response?.data?.message || 'Erro na requisição',
        type: 'error',
        duration: 10000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:p-6"
      >
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
          {isEditing ? 'Editar usuário' : 'Criar usuário'}
        </h2>

        {loadingUser && isEditing && (
          <p className="text-xs text-slate-500">Carregando dados do usuário...</p>
        )}

        <FormField
          label="Nome"
          type="text"
          placeholder="Digite o nome do usuário"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormField
          label="E-mail"
          type="email"
          placeholder="Digite o e-mail do usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!isEditing && (
          <FormField
            label="Senha"
            type="password"
            placeholder="Crie uma senha para o usuário"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton
            type="button"
            onClick={() => navigate('/admin/usuarios')}
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
            disabled={submitting || (loadingUser && isEditing)}
          >
            {submitting
              ? isEditing
                ? 'Salvando...'
                : 'Criando...'
              : isEditing
              ? 'Salvar alterações'
              : 'Criar usuário'}
          </PrimaryButton>
        </div>
      </form>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() =>
          setSnackbar({ message: '', type: 'info', duration: 0 })
        }
      />
    </div>
  );
}

export default UserForm;
