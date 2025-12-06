import { roundApi } from '~/entities/round';

export async function loadRoundLoader(id: string) {
  if (!id) {
    throw new Response('Round ID is required', { status: 400 });
  }

  try {
    const data = await roundApi.getRound(id);
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке раунда:', error);
    throw new Response(
      error instanceof Error ? error.message : 'Не удалось загрузить раунд',
      { status: 500 }
    );
  }
}
