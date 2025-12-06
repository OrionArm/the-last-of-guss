export type User = {
  username: string;
  role: string;
};

export type LoginResponse = {
  token: string;
  username: string;
  role: string;
};
