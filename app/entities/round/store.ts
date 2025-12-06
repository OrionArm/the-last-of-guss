import { createStore, createEvent, sample } from 'effector';
import type { MyStats, Round, TopStats, GetRoundResponse } from './model';

export const setMyStats = createEvent<MyStats | null>();
export const setRoundData = createEvent<Round | null>();
export const setTopStats = createEvent<TopStats | null>();
export const setRoundResponse = createEvent<GetRoundResponse>();

export const $roundData = createStore<Round | null>(null);
export const $topStats = createStore<TopStats | null>(null);
export const $myStats = createStore<MyStats | null>(null);

sample({
  clock: setMyStats,
  target: $myStats,
});

sample({
  clock: setRoundData,
  target: $roundData,
});

sample({
  clock: setTopStats,
  target: $topStats,
});

sample({
  clock: setRoundResponse,
  fn: (data) => data?.round || null,
  target: setRoundData,
});

sample({
  clock: setRoundResponse,
  fn: (data) => data?.topStats || null,
  target: setTopStats,
});

sample({
  clock: setRoundResponse,
  fn: (data) => data?.myStats || null,
  target: setMyStats,
});
