import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '../components/Snackbar';
import FormField from '../components/ui/FormField';
import PrimaryButton from '../components/ui/PrimaryButton';
import useForm from '../hooks/useForm';
import api from '../http/api';

interface SnackbarState {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

export default function Login() {
  const { values, errors, handleChange, validate } = useForm({
    email: '',
    senha: '',
  });

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    const duration = 5000;

    const isValid = validate({
      email: (value) =>
        !value
          ? 'O e-mail é obrigatório.'
          : !/\S+@\S+\.\S+/.test(String(value))
            ? 'Informe um e-mail válido.'
            : null,
      senha: (value) =>
        !value || String(value).length < 4
          ? 'A senha deve ter pelo menos 4 caracteres.'
          : null,
    });

    if (!isValid) {
      setSnackbar({
        message: 'Preencha os campos corretamente antes de continuar.',
        type: 'warning',
        duration: 4000,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<{
        token: string;
        refreshToken: string;
        message: string;
      }>('/login', {
        email: values.email,
        senha: values.senha,
      });

      const { token, refreshToken, message } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      setSnackbar({
        message: message || 'Sucesso ao logar.',
        type: 'success',
        duration,
      });

      setTimeout(() => {
        navigate('/admin/home');
      }, duration);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };

      setSnackbar({
        message:
          axiosError.response?.data?.message ||
          'Erro ao realizar login. Verifique seus dados e tente novamente.',
        type: 'error',
        duration: 8000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm sm:p-7">
        <h2 className="mb-1 text-center text-xl font-semibold text-slate-900 sm:text-2xl">
          Login
        </h2>
        <p className="mb-6 text-center text-xs text-slate-500 sm:text-sm">
          Acesse a área administrativa com seu e-mail e senha.
        </p>

        <form onSubmit={login} className="space-y-4">
          <FormField
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={values.email}
            onChange={handleChange('email')}
            error={errors.email}
          />

          <FormField
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={values.senha}
            onChange={handleChange('senha')}
            error={errors.senha}
          />

          <PrimaryButton type="submit" fullWidth disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </PrimaryButton>
        </form>
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() =>
          setSnackbar({ message: '', type: 'success', duration: 0 })
        }
      />
    </div>
  );
}
