import { createStore, createEvent, createEffect, sample } from 'effector';
import { type User } from './model';
import { userApi } from './api';
import { storage } from '~/shared/lib/storage';

export const checkAuthRequested = createEvent();
export const setUser = createEvent<User | null>();
export const clearUser = createEvent();
export const redirectToLoginRequested = createEvent();

export const $user = createStore<User | null>(null);
export const $isAuthenticated = $user.map((user) => user !== null);
export const $isAdmin = $user.map((user) => user?.role === 'ADMIN' || false);

export const checkAuthFx = createEffect<void, User, Error>(async () => {
  return userApi.getMe();
});

sample({
  clock: checkAuthRequested,
  target: checkAuthFx,
});

sample({
  clock: checkAuthFx.doneData,
  target: $user,
});

sample({
  clock: checkAuthFx.failData,
  fn: (error) => {
    storage.removeItem('auth_token');
    if (error.message === 'Empty token') {
      redirectToLoginRequested();
    }
    return null;
  },
  target: $user,
});

sample({
  clock: setUser,
  target: $user,
});

sample({
  clock: clearUser,
  fn: () => null,
  target: $user,
});

sample({
  clock: redirectToLoginRequested,
  fn: () => {
    storage.removeItem('auth_token');
    return null;
  },
  target: clearUser,
});
