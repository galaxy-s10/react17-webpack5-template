import React from 'react';
import { useRoutes } from 'react-router-dom';

const Home = React.lazy(() => import('@/pages/home'));

const routes = useRoutes([
  {
    path: '/',
    element: () => <Home />,
  },
]);
export default routes;
