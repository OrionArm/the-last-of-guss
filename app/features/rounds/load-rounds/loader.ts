import { roundApi } from '~/entities/round';

export async function loadRoundsLoader() {
  try {
    const response = await roundApi.getRoundsList();
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Ошибка при загрузке списка раундов:', error);
    return [];
  }
}
