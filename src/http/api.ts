import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// Define a interface para a resposta de erro
interface ApiError {
  status: number;
  message: string;
}

// Cria uma instância do axios
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL ?? "http://localhost:3000/api", // Substitua pela URL base da sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de requisição
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Adiciona o token Bearer ao header Authorization
    const token = localStorage.getItem('token'); // Substitua pela lógica de onde o token está armazenado
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    // Lida com erros na configuração da requisição
    return Promise.reject(error);
  },
);

// Interceptador de resposta
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Retorna a resposta original para manter a tipagem correta
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status } = error.response;

      // Caso o status seja 401 e o token tenha sido enviado
      if (status === 401 && originalRequest.headers.Authorization) {
        try {
          // Redireciona para o endpoint de refresh-token
          const refreshResponse = await api.post<{ token: string }>(
            '/refresh-token',
            {
              token: localStorage.getItem('refreshToken'), // Substitua pela lógica do refresh token
            },
          );

          // Atualiza o token e refaz a requisição original
          const newToken = refreshResponse.data.token;
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Caso o refresh falhe, redirecione para login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Caso o status seja 403
      if (status === 403) {
        alert('Você não possui acesso a esta tela.');
        window.history.back(); // Redireciona para a última tela visitada
        const errorAcessoNegado = new Error('Acesso negado.');
        (errorAcessoNegado as unknown as ApiError).status = status;
        return Promise.reject(errorAcessoNegado);
      }

      // Para outros erros acima de 399
      if (status >= 400) {
        return Promise.reject(
          new Error(
            JSON.stringify({
              status,
              message: error.response.data?.message || 'Erro desconhecido.',
            }),
          ),
        );
      }
    }

    // Lida com erros sem resposta (ex.: problemas de rede)
    return Promise.reject(
      new Error(
        JSON.stringify({
          status: 0,
          message: 'Erro de conexão.',
        }),
      ),
    );
  },
);

export default api;
