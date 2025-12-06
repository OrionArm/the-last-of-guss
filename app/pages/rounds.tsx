import { useEffect } from 'react';
import { Link, useLoaderData, useNavigation, useNavigate } from 'react-router';
import { useUnit } from 'effector-react';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/card';
import {
  $rounds,
  setRounds,
  loadRoundsLoader,
} from '~/features/rounds/load-rounds';
import { $user, $isAdmin } from '~/entities/user';
import { logoutRequested } from '~/features/auth/logout';
import {
  roundApi,
  calculateStatus,
  getStatusLabel,
  ROUND_START_DELAY_MS,
  ROUND_DURATION_MS,
} from '~/entities/round';
import { useRequireAuth } from '~/features/auth/guards';
import type { Route } from './+types/rounds';
import { formatDate } from '~/shared/lib/format_date';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Раунды - The Last of Guss' },
    { name: 'description', content: 'Список раундов' },
  ];
}

export async function clientLoader({
  request: _request,
}: Route.ClientLoaderArgs) {
  return loadRoundsLoader();
}

export const clientShouldRevalidate = ({
  currentUrl,
  nextUrl,
}: {
  currentUrl: URL;
  nextUrl: URL;
}) => {
  if (nextUrl.pathname === '/rounds' && currentUrl.pathname !== '/rounds') {
    return true;
  }

  return false;
};

export default function Rounds() {
  useRequireAuth();

  const loaderData = useLoaderData<typeof clientLoader>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const rounds = useUnit($rounds);
  const user = useUnit($user);
  const isAdmin = useUnit($isAdmin);
  const setRoundsData = useUnit(setRounds);
  const logout = useUnit(logoutRequested);
  const isLoading = navigation.state === 'loading';

  useEffect(() => {
    if (loaderData) setRoundsData(loaderData);
  }, [loaderData, setRoundsData]);

  const handleCreateRound = async () => {
    try {
      const now = new Date();
      const startTime = new Date(
        now.getTime() + ROUND_START_DELAY_MS
      ).toISOString();
      const endTime = new Date(now.getTime() + ROUND_DURATION_MS).toISOString();

      const newRound = await roundApi.createRound({
        startTime,
        endTime,
      });

      if (newRound?.id) {
        navigate(`/rounds/${newRound.id}`);
      }
    } catch (error) {
      console.error('Ошибка при создании раунда:', error);
    }
  };

  if (isLoading && (!rounds || rounds.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  const roundsArray = Array.isArray(rounds) ? rounds : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Список РАУНДОВ</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg">{user?.username}</span>
            <Button variant="outline" onClick={logout}>
              Выйти
            </Button>
          </div>
        </div>

        {isAdmin && (
          <div className="mb-6">
            <Button onClick={handleCreateRound}>Создать раунд</Button>
          </div>
        )}

        <div className="space-y-4">
          {roundsArray.map((round) => (
            <Link key={round.id} to={`/rounds/${round.id}`} className="block">
              <Card className="cursor-pointer hover:shadow-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg">
                    ● Round ID: {round.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>Start: {formatDate(round.startTime)}</div>
                    <div>End: {formatDate(round.endTime)}</div>
                    <div className="border-t pt-2 mt-2">
                      Статус: {getStatusLabel(calculateStatus(round))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {roundsArray.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Нет активных раундов
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
