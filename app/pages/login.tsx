import { useState } from 'react';
import { useUnit } from 'effector-react';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/card';
import { $loginError, loginRequested } from '~/features/auth/login';
import { useLoginSuccessRedirect } from '~/features/auth/guards';
import type { Route } from './+types/login';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Войти - The Last of Guss' },
    { name: 'description', content: 'Войдите в игру' },
  ];
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, handleLogin] = useUnit([$loginError, loginRequested]);

  useLoginSuccessRedirect();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">ВОЙТИ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Имя пользователя:
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Пароль:
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            {loginError && (
              <div className="text-sm text-red-500 text-center">
                {loginError}
              </div>
            )}
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
