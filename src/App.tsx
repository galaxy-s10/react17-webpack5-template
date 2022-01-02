import React, { memo, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Loading from '@/components/Loading';
import Home from '@/pages/home';
import NotFound from '@/pages/notFound';
import { store } from '@/stores';

const Login = React.lazy(() => import('@/pages/login'));

const App = () => {
  // 生命周期
  useEffect(() => {}, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <React.Suspense fallback={<Loading />}>
                <Login />
              </React.Suspense>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default memo(App);
