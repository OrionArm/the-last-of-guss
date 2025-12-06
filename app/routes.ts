import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('pages/home.tsx'),
  route('login', 'pages/login.tsx'),
  route('rounds', 'pages/rounds.tsx'),
  route('rounds/:id', 'pages/rounds.$id.tsx'),
] satisfies RouteConfig;
