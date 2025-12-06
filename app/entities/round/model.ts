export type Round = {
  id: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  createdAt: string;
};

export type Pagination = {
  limit: number;
  nextCursor: string;
  hasMore: boolean;
};

export type TopStats = Array<{
  taps: number;
  score: number;
  user: {
    username: string;
  };
}>;

export type MyStats = {
  taps: number;
  score: number;
};

export type CreateRoundRequest = {
  startTime: string;
  endTime: string;
};

export type GetRoundListResponse = {
  data: Round[];
  pagination: Pagination;
};

export type GetRoundResponse = {
  round: Round;
  topStats: TopStats;
  myStats: MyStats;
};
