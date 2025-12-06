import { createStore, createEvent } from 'effector';
import { type Round } from '~/entities/round';

export const setRounds = createEvent<Round[]>();
export const $rounds = createStore<Round[]>([]);

$rounds.on(setRounds, (_, rounds) => (Array.isArray(rounds) ? rounds : []));
