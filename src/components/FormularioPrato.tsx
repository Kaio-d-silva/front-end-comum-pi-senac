import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useForm from '../hooks/useForm';
import api from '../http/api';
import Prato from '../interface/Prato';
import Snackbar from './Snackbar';
import PageLayout from './layout/PageLayout';
import FormField from './ui/FormField';
import PrimaryButton from './ui/PrimaryButton';
import TextAreaField from './ui/TextAreaField';

export interface PratoFormProps {
  isEditing?: boolean; // Indica se o formulário está no modo de edição
}

interface PratoFormParams extends Record<string, string | undefined> {
  id?: string;
}

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

const FormularioPrato: React.FC<PratoFormProps> = ({ isEditing = false }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });

  const [loadingPrato, setLoadingPrato] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultPratoValues = {
    nome: '',
    cozinha: '',
    descricao_resumida: '',
    descricao_detalhada: '',
    imagem: '',
    valor: 0,
  };

  const { values, errors, handleChange, validate, updateValues } =
    useForm(defaultPratoValues);

  const { id } = useParams<PratoFormParams>();

  useEffect(() => {
    if (isEditing && id) {
      const fetchPrato = async () => {
        try {
          setLoadingPrato(true);

          const response = await api.get<Prato>(`/pratos/${id}`);

          const {
            nome,
            cozinha,
            descricao_detalhada,
            descricao_resumida,
            imagem,
            valor,
          } = response.data;

          updateValues({
            nome,
            cozinha,
            descricao_detalhada,
            descricao_resumida,
            imagem,
            valor,
          });
        } catch {
          setSnackbar({
            message: 'Erro ao carregar os dados do prato.',
            type: 'error',
            duration: 10000,
          });
        } finally {
          setLoadingPrato(false);
        }
      };

      fetchPrato();
    }
  }, [id, isEditing, updateValues]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validate({
      nome: (value) => (!value ? 'O nome é obrigatório.' : null),
      cozinha: (value) => (!value ? 'A cozinha é obrigatória.' : null),
      descricao_resumida: (value) =>
        !value ? 'A descrição resumida é obrigatória.' : null,
      descricao_detalhada: (value) =>
        !value ? 'A descrição detalhada é obrigatória.' : null,
      valor: (value) =>
        !value || isNaN(Number(value))
          ? 'O valor deve ser um número válido.'
          : null,
      imagem: () => null,
    });

    if (!isValid) return;

    try {
      setSubmitting(true);

      if (isEditing && id) {
        await api.put<Prato>(`/pratos/${id}`, values);
        setSnackbar({
          message: 'Prato atualizado com sucesso!',
          type: 'success',
          duration: 10000,
        });
      } else {
        await api.post<Prato[]>('/pratos', values);
        setSnackbar({
          message: 'Prato cadastrado com sucesso!',
          type: 'success',
          duration: 10000,
        });
        updateValues(defaultPratoValues);
      }
    } catch (error) {
      console.error('Erro ao salvar o prato:', error);
      setSnackbar({
        message: 'Erro ao salvar o prato. Tente novamente.',
        type: 'error',
        duration: 10000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pageTitle = isEditing ? 'Editar prato' : 'Cadastrar novo prato';
  const pageSubtitle = isEditing
    ? 'Atualize as informações do prato cadastrado.'
    : 'Preencha as informações para cadastrar um novo prato no cardápio.';

  return (
    <PageLayout title={pageTitle} subtitle={pageSubtitle}>
      <section className="mt-4 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-sm"
        >
          {loadingPrato && isEditing && (
            <div className="mb-2 h-8 w-full animate-pulse rounded bg-slate-100" />
          )}

          <FormField
            label="Imagem do prato"
            name="imagem"
            type="text"
            placeholder="Cole a URL da imagem do prato"
            value={values.imagem}
            onChange={handleChange('imagem')}
            error={errors.imagem}
          />

          <FormField
            label="Nome do prato"
            name="nome"
            type="text"
            placeholder="Digite o nome do prato"
            value={values.nome}
            onChange={handleChange('nome')}
            error={errors.nome}
          />

          <FormField
            label="Cozinha"
            name="cozinha"
            type="text"
            placeholder="Digite o tipo de cozinha"
            value={values.cozinha}
            onChange={handleChange('cozinha')}
            error={errors.cozinha}
          />

          <FormField
            label="Descrição resumida"
            name="descricao_resumida"
            type="text"
            placeholder="Digite a descrição resumida do prato"
            value={values.descricao_resumida}
            onChange={handleChange('descricao_resumida')}
            error={errors.descricao_resumida}
          />

          <TextAreaField
            label="Descrição detalhada"
            name="descricao_detalhada"
            placeholder="Digite a descrição detalhada do prato"
            value={values.descricao_detalhada}
            onChange={handleChange('descricao_detalhada')}
            error={errors.descricao_detalhada}
            rows={4}
          />

          <FormField
            label="Valor do prato"
            name="valor"
            type="text"
            placeholder="Digite o valor do prato"
            value={values.valor}
            onChange={handleChange('valor')}
            error={errors.valor}
          />

          <PrimaryButton
            type="submit"
            fullWidth
            disabled={submitting || (loadingPrato && isEditing)}
          >
            {submitting
              ? isEditing
                ? 'Salvando alterações...'
                : 'Cadastrando prato...'
              : isEditing
                ? 'Salvar alterações'
                : 'Cadastrar prato'}
          </PrimaryButton>
        </form>
      </section>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() => setSnackbar({ message: '', type: 'info', duration: 0 })}
      />
    </PageLayout>
  );
};

export default FormularioPrato;
