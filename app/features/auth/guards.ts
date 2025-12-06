import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useUnit } from 'effector-react';
import { $isAuthenticated, $user, checkAuthRequested } from '~/entities/user';
import { storage } from '~/shared/lib/storage';

/**
 * Хук для инициализации проверки авторизации при старте приложения
 * Проверяет наличие токена и автоматически запрашивает данные пользователя
 */
export function useInitAuth() {
  const checkAuth = useUnit(checkAuthRequested);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasCheckedRef.current) {
      const token = storage.getItem('auth_token');
      if (token) {
        hasCheckedRef.current = true;
        checkAuth();
      }
    }
  }, [checkAuth]);
}

/**
 * Хук для защиты маршрутов, требующих авторизации
 * Редиректит на страницу логина, если пользователь не авторизован
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  const isAuthenticated = useUnit($isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      const hasToken = storage.getItem('auth_token') !== null;

      if (!hasToken) {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);
}

/**
 * Хук для редиректа после успешного входа
 */
export function useLoginSuccessRedirect(redirectTo: string = '/rounds') {
  const navigate = useNavigate();
  const user = useUnit($user);

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);
}
