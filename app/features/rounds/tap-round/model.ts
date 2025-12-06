import { createEvent, createEffect, sample } from 'effector';
import { debounce } from 'patronum';
import { roundApi, setMyStats, type MyStats } from '~/entities/round';
import { redirectToLoginRequested } from '~/entities/user';

export const tapRequested = createEvent<string>();

const TAP_DEBOUNCE_MS = 150;

const tapRequestedDebounced = debounce({
  source: tapRequested,
  timeout: TAP_DEBOUNCE_MS,
});

export const tapFx = createEffect<string, MyStats, Error>(async (id) => {
  return roundApi.tapRound(id);
});

sample({
  clock: tapFx.doneData,
  target: setMyStats,
});

sample({
  clock: tapRequestedDebounced,
  target: tapFx,
});

sample({
  clock: tapFx.failData,
  filter: (error) => error.message === 'Empty token',
  target: redirectToLoginRequested,
});
