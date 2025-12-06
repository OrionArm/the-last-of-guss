import { useEffect } from 'react';
import { useParams, Link, useLoaderData, useNavigation } from 'react-router';
import { useUnit } from 'effector-react';
import { Button } from '~/shared/ui/button';
import { Card, CardContent } from '~/shared/ui/card';
import { loadRoundLoader } from '~/features/rounds/load-round';
import {
  $timeRemaining,
  $roundStatus,
  startTimeUpdate,
  stopTimeUpdate,
} from '~/features/rounds/time-management';
import { tapRequested } from '~/features/rounds/tap-round';
import {
  $myStats,
  $roundData,
  $topStats,
  setRoundResponse,
} from '~/entities/round';
import { $user } from '~/entities/user';
import { logoutRequested } from '~/features/auth/logout';
import { useRequireAuth } from '~/features/auth/guards';
import { formatDate } from '~/shared/lib/format_date';
import type { Route } from './+types/rounds.$id';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Раунд ${params.id} - The Last of Guss` },
    { name: 'description', content: 'Игровой раунд' },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { id } = params;
  if (!id) {
    throw new Response('Round ID is required', { status: 400 });
  }
  return loadRoundLoader(id);
}

export default function RoundPage() {
  useRequireAuth();

  const { id } = useParams();
  const loaderData = useLoaderData<typeof clientLoader>();
  const navigation = useNavigation();

  const [round, topStats, myStats] = useUnit([$roundData, $topStats, $myStats]);

  const [timeRemaining, roundStatus, user] = useUnit([
    $timeRemaining,
    $roundStatus,
    $user,
  ]);

  const [setRound, tap, startTime, stopTime, logout] = useUnit([
    setRoundResponse,
    tapRequested,
    startTimeUpdate,
    stopTimeUpdate,
    logoutRequested,
  ]);

  const isLoading = navigation.state === 'loading';

  useEffect(() => {
    if (loaderData) setRound(loaderData);
  }, [loaderData, setRound]);

  useEffect(() => {
    if (roundStatus === 'pending' || roundStatus === 'active') {
      startTime();
      return () => {
        stopTime();
      };
    } else {
      stopTime();
    }
  }, [roundStatus, startTime, stopTime]);

  const handleTap = () => {
    if (id && roundStatus === 'active') {
      tap(id);
    }
  };

  if (isLoading && !round) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Раунд не найден</div>
      </div>
    );
  }

  const isPending = roundStatus === 'pending';
  const isActive = roundStatus === 'active';
  const isCompleted = roundStatus === 'completed';
  const myScore = myStats?.score || 0;
  const totalScore = round?.totalScore || 0;
  const winner = topStats?.[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/rounds">
            <Button variant="outline">Раунды</Button>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-lg">{user?.username}</span>
            <Button variant="outline" onClick={logout}>
              Выйти
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              {isActive && (
                <button
                  onClick={handleTap}
                  className="cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
                >
                  <img
                    src="/guss1.svg"
                    alt="Гусь"
                    className="w-full max-w-xs pointer-events-none"
                  />
                </button>
              )}

              {isCompleted && (
                <img src="/guss2.svg" alt="Гусь" className="w-full max-w-xs" />
              )}

              {isCompleted && (
                <>
                  <div className="text-2xl font-bold">Раунд завершен</div>
                  <div className="w-full space-y-2 pt-4 border-t">
                    {totalScore > 0 && (
                      <div className="flex justify-between">
                        <span>Всего</span>
                        <span className="font-bold">{totalScore}</span>
                      </div>
                    )}

                    {winner && (
                      <div className="flex justify-between">
                        <span>Победитель - {winner.user.username}</span>
                        <span className="font-bold">{winner.score}</span>
                      </div>
                    )}

                    {myScore > 0 && (
                      <div className="flex justify-between">
                        <span>Мои очки</span>
                        <span className="font-bold">{myScore}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {isPending && round && (
                <>
                  <div className="text-2xl font-bold">Раунд еще не начат</div>
                  <div className="text-lg">
                    Начало: {formatDate(round.startTime)}
                  </div>
                  <div className="text-lg">До начала: {timeRemaining}</div>
                </>
              )}

              {isActive && (
                <>
                  <div className="text-2xl font-bold">Раунд активен!</div>
                  <div className="text-lg">
                    До конца осталось: {timeRemaining}
                  </div>
                  <div className="text-lg">Мои очки - {myScore}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
