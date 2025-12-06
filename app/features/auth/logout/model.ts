import { createEvent, createEffect, sample } from 'effector';
import { userApi, clearUser } from '~/entities/user';

export const logoutRequested = createEvent();

export const logoutFx = createEffect<void, void, Error>(async () => {
  await userApi.logout();
});

const redirectToHomeFx = createEffect<void, void>(() => {
  if (typeof window !== 'undefined') {
    window.location.replace('/');
  }
});

sample({
  clock: logoutRequested,
  target: logoutFx,
});

sample({
  clock: logoutFx.done,
  target: clearUser,
});

sample({
  clock: logoutFx.done,
  target: redirectToHomeFx,
});
