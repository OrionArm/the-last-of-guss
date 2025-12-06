import { BaseApiClient } from '~/shared/lib/api/base';
import { storage } from '~/shared/lib/storage';
import type { User, LoginResponse } from './model';

type LoginRequest = {
  username: string;
  password: string;
};

export class UserApi extends BaseApiClient {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      storage.setItem('auth_token', response.token);
    }

    return response;
  }

  async getMe(): Promise<User> {
    return this.request<User>('/api/v1/auth/me');
  }

  async logout(): Promise<void> {
    await this.request('/api/v1/auth/logout', {
      method: 'POST',
    });
    storage.removeItem('auth_token');
  }
}

export const userApi = new UserApi();
