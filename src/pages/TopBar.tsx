import React, { useContext } from 'react';
import { useLocation } from 'react-router';
import { matchPath, useNavigate } from 'react-router-dom';

import { Stack } from 'layouts/Stack';

import { Breadcrumbs } from 'controls/Breadcrumbs';
import { LogoutButton } from 'controls/Button';
import { Link } from 'controls/Link';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import { ScrCom9999Logout } from 'apis/com/ScrCom0002Api';

import { AuthContext } from 'providers/AuthProvider';

import { ROUTES } from 'definitions/routes';

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
  const { user } = useContext(AuthContext);

  // router
  const location = useLocation();

  // 環境によってヘルプデスクとマニュアルのリンクを変更
  const helpLink = (): string => {
    if (process.env.NODE_ENV === 'development') {
      return process.env.REACT_APP_HELP_LINK_DEVELOP || '';
    } else if (process.env.NODE_ENV === 'production') {
      return process.env.REACT_APP_HELP_LINK_PRODUCTION || '';
    } else {
      return '';
    }
  };

  const manualLink = (): string => {
    if (process.env.NODE_ENV === 'development') {
      return process.env.REACT_APP_MANUAL_LINK_DEVELOP || '';
    } else if (process.env.NODE_ENV === 'production') {
      return process.env.REACT_APP_MANUAL_LINK_PRODUCTION || '';
    } else {
      return '';
    }
  };

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
    const matched = ROUTES[0].children.find((route) => {
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

  // ログアウト
  const navigate = useNavigate();
  const TransitionLogout = async () => {
    const response = await ScrCom9999Logout({
      userId: user.employeeId,
    });
    if (response.rtnCode) return navigate('/_exp/logout');
  };

  return (
    <Stack justifyContent='space-between' direction='row' alignItems='center'>
      <Breadcrumbs breadCrumbs={breadcrumbs} />
      <Stack
        justifyContent='flex-end'
        direction='row'
        alignItems='center'
        spacing={theme.spacing(10)}
      >
        <Typography>
          ログインユーザー | {user.organizationName} {user.employeeName}
        </Typography>
        <Stack
          justifyContent='flex-end'
          direction='row'
          alignItems='center'
          spacing={theme.spacing(1)}
        >
          <Link href={helpLink()}>ヘルプ</Link>
          <Typography>|</Typography>
          <Link href={manualLink()}>マニュアル</Link>
        </Stack>
        <div style={{ marginRight: theme.spacing(6) }}>
          <LogoutButton onClick={() => TransitionLogout()}></LogoutButton>
        </div>
      </Stack>
    </Stack>
  );
};

export default TopBar;

