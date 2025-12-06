import type { Round } from '../model';

export type RoundStatus = 'pending' | 'active' | 'completed';

/**
 * Вычисляет статус раунда на основе текущего времени
 */
export function calculateStatus(round: Round | null): RoundStatus {
  if (!round) return 'pending';

  const now = new Date().getTime();
  const start = new Date(round.startTime).getTime();
  const end = new Date(round.endTime).getTime();

  if (now < start) return 'pending';
  if (now >= start && now < end) return 'active';
  return 'completed';
}

/**
 * Вычисляет оставшееся время до начала или конца раунда
 * @returns Строка в формате "MM:SS"
 */
export function calculateTimeRemaining(round: Round | null): string {
  if (!round) return '00:00';

  const now = new Date().getTime();
  const start = new Date(round.startTime).getTime();
  const end = new Date(round.endTime).getTime();

  if (now < start) {
    // Время до начала
    const diff = Math.max(0, start - now);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

  if (now >= start && now < end) {
    // Время до конца
    const diff = Math.max(0, end - now);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

  return '00:00';
}

/**
 * Возвращает локализованную метку статуса раунда
 */
export function getStatusLabel(status: RoundStatus): string {
  switch (status) {
    case 'pending':
      return 'Ожидание';
    case 'active':
      return 'Активен';
    case 'completed':
      return 'Завершен';
    default:
      return 'Неизвестно';
  }
}
