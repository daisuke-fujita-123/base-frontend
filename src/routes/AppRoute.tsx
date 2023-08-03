import React, { useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';

import { ROUTES } from 'definitions/routes';

/**
 * AppRouteコンポーネント
 */
const AppRoute = () => {
  // router
  const router = useRoutes(ROUTES);
  const location = useLocation();

  // 画面タイトル設定
  useEffect(() => {
    document.title = getPagetitle(location.pathname);
  }, [location.pathname]);

  const getPagetitle = (pathname: string): string => {
    const route = ROUTES[0].children.find((path) => path.path === pathname);
    return route ? route.name : 'デフォルト';
  };

  return <>{router}</>;
};

export default AppRoute;

