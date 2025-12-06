import { createStore, createEvent, createEffect, sample } from 'effector';
import {
  userApi,
  type User,
  type LoginResponse,
  setUser,
} from '~/entities/user';

export const loginRequested = createEvent<{
  username: string;
  password: string;
}>();

export const $loginError = createStore<string | null>(null);

export const loginFx = createEffect<
  { username: string; password: string },
  LoginResponse,
  Error
>(async (credentials) => {
  const response = await userApi.login(credentials);
  return response;
});

sample({
  clock: loginRequested,
  fn: () => null,
  target: $loginError,
});

sample({
  clock: loginRequested,
  target: loginFx,
});

sample({
  clock: loginFx.failData,
  fn: (error) => error.message,
  target: $loginError,
});

sample({
  clock: loginFx.doneData,
  filter: (response) => !!response.token,
  fn: (response): User => ({
    username: response.username,
    role: response.role,
  }),
  target: setUser,
});
