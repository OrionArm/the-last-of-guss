import {
  useRequireAuth,
  useLoginSuccessRedirect,
} from '~/features/auth/guards';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'The Last of Guss' },
    { name: 'description', content: 'Игра про гуся' },
  ];
}

export default function Home() {
  useRequireAuth();
  useLoginSuccessRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Загрузка...</div>
    </div>
  );
}
