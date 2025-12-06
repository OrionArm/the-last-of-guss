import { BaseApiClient } from '~/shared/lib/api/base';
import type {
  Round,
  GetRoundListResponse,
  GetRoundResponse,
  CreateRoundRequest,
  MyStats,
} from './model';

export class RoundApi extends BaseApiClient {
  async getRoundsList(): Promise<GetRoundListResponse> {
    const response = await this.request<GetRoundListResponse>('/api/v1/rounds');
    return response;
  }

  async getRound(id: string): Promise<GetRoundResponse> {
    return this.request<GetRoundResponse>(`/api/v1/rounds/${id}`);
  }

  async createRound(data: CreateRoundRequest): Promise<Round> {
    return this.request<Round>('/api/v1/rounds', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async tapRound(id: string): Promise<MyStats> {
    return this.request<MyStats>(`/api/v1/rounds/${id}/tap`, {
      method: 'POST',
    });
  }
}

export const roundApi = new RoundApi();
