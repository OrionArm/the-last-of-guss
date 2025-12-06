import { createStore, createEvent, sample } from 'effector';
import {
  type RoundStatus,
  calculateStatus,
  calculateTimeRemaining,
  $roundData,
} from '~/entities/round';

export const startTimeUpdate = createEvent();
export const stopTimeUpdate = createEvent();
const timeTick = createEvent();

export const $timeUpdateInterval = createStore<ReturnType<
  typeof setInterval
> | null>(null);
export const $timeRemaining = createStore<string>('00:00');
export const $roundStatus = createStore<RoundStatus>('pending');

$roundStatus.on($roundData, (_, round) => calculateStatus(round));
$timeRemaining.on($roundData, (_, round) => calculateTimeRemaining(round));

sample({
  clock: timeTick,
  source: $roundData,
  fn: (round) => calculateStatus(round),
  target: $roundStatus,
});

sample({
  clock: timeTick,
  source: $roundData,
  fn: (round) => calculateTimeRemaining(round),
  target: $timeRemaining,
});

sample({
  clock: startTimeUpdate,
  source: $timeUpdateInterval,
  fn: (existingInterval) => {
    // Очищаем предыдущий интервал, если он существует
    if (existingInterval) {
      clearInterval(existingInterval);
    }
    if (typeof window === 'undefined') return null;
    const interval = setInterval(() => {
      timeTick();
    }, 1000);
    return interval;
  },
  target: $timeUpdateInterval,
});

sample({
  clock: stopTimeUpdate,
  source: $timeUpdateInterval,
  fn: (interval) => {
    if (interval) {
      clearInterval(interval);
    }
    return null;
  },
  target: $timeUpdateInterval,
});
