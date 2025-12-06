import { storage } from '~/shared/lib/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

if (!API_BASE_URL) {
  console.warn('VITE_API_BASE_URL не настроен в переменных окружения');
}

type ErrorResponse = {
  message: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class BaseApiClient {
  protected getToken(): string | null {
    return storage.getItem('auth_token');
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!API_BASE_URL) {
      throw new ApiError('VITE_API_BASE_URL не настроен');
    }

    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;
    const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, '');
    const url = `${normalizedBaseUrl}${normalizedEndpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000); // 30 секунд таймаут

      const response = await fetch(url, {
        ...options,
        headers,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorResponse: ErrorResponse;
        try {
          errorResponse = await response.json();
        } catch {
          errorResponse = {
            message: `HTTP error! status: ${response.status}`,
          };
        }

        throw new ApiError(
          errorResponse.message,
          response.status,
          errorResponse
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Нет подключения к серверу');
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Превышено время ожидания запроса');
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Неизвестная ошибка',
        undefined,
        error
      );
    }
  }
}
