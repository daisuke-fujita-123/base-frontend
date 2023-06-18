import React, { useContext } from 'react';
import { useLocation } from 'react-router';
import { matchPath } from 'react-router-dom';

import { RowStack, Stack } from 'layouts/Stack';

import { Breadcrumbs } from 'controls/Breadcrumbs';
import { LogoutButton } from 'controls/Button';
import { Link } from 'controls/Link';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import { AppContext } from 'providers/AppContextProvider';

import { routes } from 'routes/routes';

// const routes = [
//   // { index: true, element: 'ScrCom0002' },
//   { path: '/', name: 'TOP', movable: true },
//   { path: '/mem', name: '会員管理', movable: false },
//   { path: '/mem/corporations', name: '法人情報一覧', movable: true },
//   {
//     path: '/mem/corporations/:corporationId',
//     name: '法人情報詳細',
//     movable: true,
//   },
//   {
//     path: '/mem/corporation-detail/:corporationId',
//     name: '法人情報詳細',
//     movable: true,
//   },
//   { path: '/mem/contract-detail', name: 'ScrMem0014', movable: true },
//   { path: '/com', name: '共通管理', movable: false },
//   { path: '/com/goods-management', name: 'ScrCom0016', movable: true },
//   { path: '/com/cource-detail', name: 'ScrCom0016', movable: true },
//   { path: '/com/date-settings', name: 'ScrCom0030', movable: true },
// ];

const subsystems = [
  {
    name: '会員管理',
    path: '/mem',
  },
  {
    name: '書類管理',
    path: '/doc',
  },
  {
    name: '取引・会計管理',
    path: '/tra',
  },
  {
    name: '共通管理',
    path: '/com',
  },
];

/**
 * TopBarコンポーネント
 */
const TopBar = () => {
  // context
  const { appContext } = useContext(AppContext);

  // router
  const location = useLocation();

  // 現在のURIをパスに分解
  const paths = location.pathname.split('/').map((e) => '/' + e);
  paths.shift();

  // パスからURIの履歴を作成（リソースベースのURI設計になっている前提）
  const uris: string[] = [];
  paths.forEach((e) => {
    const last = uris.slice(-1)[0];
    uris.push((last === undefined ? '' : last) + e);
  });

  // URIの履歴からパンくずリストに渡すpropsを作成
  const breadcrumbs = uris.map((uri, index) => {
    // IDを入る部分を考慮してroutesの定義から一致するURIを検索
    const matched = routes[0].children.find((route) => {
      if (route.path === undefined) return false;
      return matchPath(route.path, uri) !== null;
    });

    if (matched === undefined) {
      // 存在しない場合はroutesの定義がおかしい
      console.error('undefined route: ' + uri);
      return { name: 'error', href: 'error', movable: false };
    }
    // 現在のページはリンクにしない
    return { name: matched.name, href: uri, movable: true };
    // const movable = uris.length - 1 === index ? false : matched.movable;
    // return { name: matched.name, href: uri, movable: movable };
  });

  return (
    <Stack justifyContent='space-between' direction='row' alignItems='center'>
      <Breadcrumbs breadCrumbs={breadcrumbs} />
      <RowStack>
        <Typography>
          ログインユーザー | {appContext.user.belong} {appContext.user.name}
        </Typography>
        <RowStack spacing={theme.spacing(1)}>
          <Link href={''}>ヘルプ</Link>
          <Typography>|</Typography>
          <Link href={''}>マニュアル</Link>
        </RowStack>
        <div style={{ marginRight: theme.spacing(6) }}>
          <LogoutButton></LogoutButton>
        </div>
      </RowStack>
    </Stack>
  );
};

export default TopBar;

