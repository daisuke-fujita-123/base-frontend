import React from 'react';

import DatagridCellJoin from 'pages/_exp/DatagridCellJoin';
import DataGridCellType from 'pages/_exp/DatagridCellType';
import DatagridColumnGroups from 'pages/_exp/DatagridColumnGroups';
import Experiments from 'pages/_exp/Experiments';
import Layouts from 'pages/_exp/Layouts';
import Logout from 'pages/_exp/Logout';
import Scroll from 'pages/_exp/Scroll';
import WatchForm from 'pages/_exp/WatchForm';
import ScrCom0001Page from 'pages/com/ScrCom0001Page';
import ScrCom0002Page from 'pages/com/ScrCom0002Page';
import ScrCom0003Page from 'pages/com/ScrCom0003Page';
import ScrCom0007Page from 'pages/com/ScrCom0007Page';
import ScrCom0008Page from 'pages/com/ScrCom0008Page';
import ScrCom0009Page from 'pages/com/ScrCom0009Page';
import ScrCom0013Page from 'pages/com/ScrCom0013Page';
import ScrCom0014Page from 'pages/com/ScrCom0014Page';
import ScrCom0015Page from 'pages/com/ScrCom0015Page';
import ScrCom0016Page from 'pages/com/ScrCom0016Page';
import ScrCom0019Page from 'pages/com/ScrCom0019Page';
import ScrCom0021Page from 'pages/com/ScrCom0021Page';
import ScrCom0023Page from 'pages/com/ScrCom0023Page';
import ScrCom0024Page from 'pages/com/ScrCom0024Page';
import ScrCom0025Page from 'pages/com/ScrCom0025Page';
import ScrCom0026Page from 'pages/com/ScrCom0026Page';
import ScrCom0027Page from 'pages/com/ScrCom0027Page';
import ScrCom0028Page from 'pages/com/ScrCom0028Page';
import ScrCom0029Page from 'pages/com/ScrCom0029Page';
import ScrCom0030Page from 'pages/com/ScrCom0030Page';
import ScrCom0031Page from 'pages/com/ScrCom0031Page';
import ScrCom0034Page from 'pages/com/ScrCom0034Page';
import ScrDoc0001Page from 'pages/doc/ScrDoc0001Page';
import ScrDoc0005Page from 'pages/doc/ScrDoc0005Page';
import ScrDoc0010Page from 'pages/doc/ScrDoc0010Page';
import ScrMem0001Page from 'pages/mem/ScrMem0001Page';
import ScrMem0003Page from 'pages/mem/ScrMem0003Page';
import ScrMem0008Page from 'pages/mem/ScrMem0008Page';
import ScrMem0010Page from 'pages/mem/ScrMem0010Page';
import ScrMem0012Page from 'pages/mem/ScrMem0012Page';
import ScrMem0014Page from 'pages/mem/ScrMem0014Page';
import ScrTra0001Page from 'pages/tra/ScrTra0001Page';
import ScrTra0003Page from 'pages/tra/ScrTra0003Page';
import ScrTra0005Page from 'pages/tra/ScrTra0005Page';
import ScrTra0007Page from 'pages/tra/ScrTra0007Page';
import ScrTra0008Page from 'pages/tra/ScrTra0008Page';
import ScrTra0010Page from 'pages/tra/ScrTra0010Page';
import ScrTra0011Page from 'pages/tra/ScrTra0011Page';
import ScrTra0013Page from 'pages/tra/ScrTra0013Page';
import ScrTra0014Page from 'pages/tra/ScrTra0014Page';
import ScrTra0016Page from 'pages/tra/ScrTra0016Page';
import ScrTra0018Page from 'pages/tra/ScrTra0018Page';
import ScrTra0019Page from 'pages/tra/ScrTra0019Page';
import ScrTra0020Page from 'pages/tra/ScrTra0020Page';
import ScrTra0021Page from 'pages/tra/ScrTra0021Page';
import ScrTra0023Page from 'pages/tra/ScrTra0023Page';
import ScrTra0025Page from 'pages/tra/ScrTra0025Page';
import ScrTra0026Page from 'pages/tra/ScrTra0026Page';
import ScrTra0028Page from 'pages/tra/ScrTra0028Page';
import ScrTra0029Page from 'pages/tra/ScrTra0029Page';
import ScrTra0031Page from 'pages/tra/ScrTra0031Page';
import ScrTra0033Page from 'pages/tra/ScrTra0033Page';
import ScrTra0034Page from 'pages/tra/ScrTra0034Page';
import ScrTra0036Page from 'pages/tra/ScrTra0036Page';
import ScrTra0038Page from 'pages/tra/ScrTra0038Page';

import GlobalLayout from 'layouts/GlobalLayout';

/**
 * 画面URI定義
 */
const _ROUTES = [
  {
    // SCR-COM-0001 ログイン
    id: 'SCR-COM-0001',
    name: 'ログイン',
    path: '/com/login',
    element: <ScrCom0001Page />,
  },
  {
    // SCR-COM-0002 TOP
    id: 'SCR-COM-0002',
    name: 'TOP',
    path: '/com/top',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-COM-0003 ワークリスト
    id: 'SCR-COM-0003',
    name: 'ワークリスト',
    path: '/com/workllist',
    element: <ScrCom0003Page />,
  },
  {
    // SCR-COM-0007 帳票管理
    id: 'SCR-COM-0007',
    name: '帳票管理',
    path: '/com/reports',
    element: <ScrCom0007Page />,
  },
  {
    // SCR-COM-0008 帳票コメント
    id: 'SCR-COM-0008',
    name: '帳票コメント',
    path: '/com/reports/:reportId',
    element: <ScrCom0008Page />,
  },
  {
    // SCR-COM-0009 帳票再出力
    id: 'SCR-COM-0009',
    name: '帳票再出力',
    path: '/com/report-export',
    element: <ScrCom0009Page />,
  },
  {
    // SCR-COM-0013 商品管理
    id: 'SCR-COM-0013',
    name: '商品管理',
    path: '/com/goods',
    element: <ScrCom0013Page />,
  },
  {
    // SCR-COM-0014 手数料テーブル詳細
    id: 'SCR-COM-0014',
    name: '手数料テーブル詳細',
    path: '/com/commissions/:commissionId',
    element: <ScrCom0014Page />,
  },
  {
    // SCR-COM-0015 手数料値引値増パック
    id: 'SCR-COM-0015',
    name: '手数料値引値増パック',
    path: '/com/commission-discount-packs/:commissionDiscountPackId',
    element: <ScrCom0015Page />,
  },
  {
    // SCR-COM-0016 コース詳細
    id: 'SCR-COM-0016',
    name: 'コース詳細',
    path: '/com/course/:courseId',
    element: <ScrCom0016Page />,
  },
  {
    // SCR-COM-0019 マスタ一覧
    id: 'SCR-COM-0019',
    name: 'マスタ一覧',
    path: '/com/masters',
    element: <ScrCom0019Page />,
  },
  {
    // SCR-COM-0021 マスタメンテナンス
    id: 'SCR-COM-0021',
    name: 'マスタメンテナンス',
    path: '/com/masters/:masterId',
    element: <ScrCom0021Page />,
  },
  {
    // SCR-COM-0023 ライブ会場一覧
    id: 'SCR-COM-0023',
    name: 'ライブ会場一覧',
    path: '/com/places',
    element: <ScrCom0023Page />,
  },
  {
    // SCR-COM-0024 会場詳細
    id: 'SCR-COM-0024',
    name: '会場詳細',
    path: '/com/places/:placeCode',
    element: <ScrCom0024Page />,
  },
  {
    // SCR-COM-0025 組織管理
    id: 'SCR-COM-0025',
    name: '組織管理',
    path: '/com/organization',
    element: <ScrCom0025Page />,
  },
  {
    // SCR-COM-0026 アクセス権限管理
    id: 'SCR-COM-0026',
    name: 'アクセス権限管理',
    path: '/com/permissions',
    element: <ScrCom0026Page />,
  },
  {
    // SCR-COM-0027 画面権限詳細
    id: 'SCR-COM-0027',
    name: '画面権限詳細',
    path: '/com/permissions/screen/:screenPermissionId',
    element: <ScrCom0027Page />,
  },
  {
    // SCR-COM-0028 マスタ権限詳細
    id: 'SCR-COM-0028',
    name: 'マスタ権限詳細',
    path: '/com/permissions/master/:masterPermissionId',
    element: <ScrCom0028Page />,
  },
  {
    // SCR-COM-0029 承認権限詳細
    id: 'SCR-COM-0029',
    name: '承認権限詳細',
    path: '/com/permissions/approval/:approvalPermissionId',
    element: <ScrCom0029Page />,
  },
  {
    // SCR-COM-0030 日付設定
    id: 'SCR-COM-0030',
    name: '日付設定',
    path: '/com/date-setting',
    element: <ScrCom0030Page />,
  },
  {
    // SCR-COM-0031 処理結果
    id: 'SCR-COM-0031',
    name: '処理結果',
    path: '/com/process-result',
    element: <ScrCom0031Page />,
  },
  {
    // SCR-COM-0034 一括登録確認
    id: 'SCR-COM-0034',
    name: '一括登録確認',
    path: '/com/all-registration',
    element: <ScrCom0034Page />,
  },
  {
    // SCR-MEM-0001 法人情報一覧
    id: 'SCR-MEM-0001',
    name: '法人情報一覧',
    path: '/mem/corporations',
    element: <ScrMem0001Page />,
  },
  {
    // SCR-MEM-0003 法人情報詳細
    id: 'SCR-MEM-0003',
    name: '法人情報詳細',
    path: '/mem/corporations/:corporationId',
    element: <ScrMem0003Page />,
  },
  {
    // SCR-MEM-0008 請求先詳細
    id: 'SCR-MEM-0008',
    name: '請求先詳細',
    path: '/mem/corporations/:corporationId/billings/:billingId',
    element: <ScrMem0008Page />,
  },
  {
    // SCR-MEM-0010 事業拠点詳細
    id: 'SCR-MEM-0010',
    name: '事業拠点詳細',
    path: '/mem/corporations/:corporationId/bussiness-bases/:bussinessBaseId',
    element: <ScrMem0010Page />,
  },
  {
    // SCR-MEM-0012 物流拠点詳細
    id: 'SCR-MEM-0012',
    name: '物流拠点詳細',
    path: '/mem/corporations/:corporationId/logistics-bases/:logisticsBaseId',
    element: <ScrMem0012Page />,
  },
  {
    // SCR-MEM-0014 契約情報詳細
    id: 'SCR-MEM-0014',
    name: '契約情報詳細',
    path: '/mem/corporations/:corporationId/bussiness-bases/:logisticsBaseId/contracts/:contractId',
    element: <ScrMem0014Page />,
  },
  {
    // SCR-DOC-0001 書類情報一覧
    id: 'SCR-DOC-0001',
    name: '書類情報一覧',
    path: '/doc/documents',
    element: <ScrDoc0001Page />,
  },
  {
    // SCR-DOC-0005 書類情報詳細
    id: 'SCR-DOC-0005',
    name: '書類情報詳細',
    path: '-',
    element: <ScrDoc0005Page />,
  },
  {
    // SCR-DOC-0010 到着一括入力
    id: 'SCR-DOC-0010',
    name: '到着一括入力',
    path: '/doc/arrives',
    element: <ScrDoc0010Page />,
  },
  {
    // SCR-TRA-0001 取引管理マスタ一覧
    id: 'SCR-TRA-0001',
    name: '取引管理マスタ一覧',
    path: '/tra/masters',
    element: <ScrTra0001Page />,
  },
  {
    // SCR-TRA-0003 取引管理マスタメンテナンス
    id: 'SCR-TRA-0003',
    name: '取引管理マスタメンテナンス',
    path: '/tra/masters/:masterId',
    element: <ScrTra0003Page />,
  },
  {
    // SCR-TRA-0005 会員売上伝票一覧
    id: 'SCR-TRA-0005',
    name: '会員売上伝票一覧',
    path: '/tra/member-salses-slips',
    element: <ScrTra0005Page />,
  },
  {
    // SCR-TRA-0007 会員売上伝票詳細
    id: 'SCR-TRA-0007',
    name: '会員売上伝票詳細',
    path: '-',
    element: <ScrTra0007Page />,
  },
  {
    // SCR-TRA-0008 車両伝票一覧
    id: 'SCR-TRA-0008',
    name: '車両伝票一覧',
    path: '/tra/car-slips',
    element: <ScrTra0008Page />,
  },
  {
    // SCR-TRA-0010 車両伝票詳細
    id: 'SCR-TRA-0010',
    name: '車両伝票詳細',
    path: '-',
    element: <ScrTra0010Page />,
  },
  {
    // SCR-TRA-0011 債権一覧
    id: 'SCR-TRA-0011',
    name: '債権一覧',
    path: '/tra/receivables',
    element: <ScrTra0011Page />,
  },
  {
    // SCR-TRA-0013 債権詳細
    id: 'SCR-TRA-0013',
    name: '債権詳細',
    path: '-',
    element: <ScrTra0013Page />,
  },
  {
    // SCR-TRA-0014 債権・預かり金処理
    id: 'SCR-TRA-0014',
    name: '債権・預かり金処理',
    path: '/tra/receivables-deposit',
    element: <ScrTra0014Page />,
  },
  {
    // SCR-TRA-0016 入金一覧
    id: 'SCR-TRA-0016',
    name: '入金一覧',
    path: '/tra/recepts',
    element: <ScrTra0016Page />,
  },
  {
    // SCR-TRA-0018 入金詳細
    id: 'SCR-TRA-0018',
    name: '入金詳細',
    path: '-',
    element: <ScrTra0018Page />,
  },
  {
    // SCR-TRA-0019 返金一覧
    id: 'SCR-TRA-0019',
    name: '返金一覧',
    path: '/tra/cashbacks',
    element: <ScrTra0019Page />,
  },
  {
    // SCR-TRA-0020 返金詳細
    id: 'SCR-TRA-0020',
    name: '返金詳細',
    path: '-',
    element: <ScrTra0020Page />,
  },
  {
    // SCR-TRA-0021 集金代行入金
    id: 'SCR-TRA-0021',
    name: '集金代行入金',
    path: '/tra/collection-agency-recepts',
    element: <ScrTra0021Page />,
  },
  {
    // SCR-TRA-0023 出金一覧
    id: 'SCR-TRA-0023',
    name: '出金一覧',
    path: '/tra/payments',
    element: <ScrTra0023Page />,
  },
  {
    // SCR-TRA-0025 出金詳細
    id: 'SCR-TRA-0025',
    name: '出金詳細',
    path: '-',
    element: <ScrTra0025Page />,
  },
  {
    // SCR-TRA-0026 請求書一覧
    id: 'SCR-TRA-0026',
    name: '請求書一覧',
    path: '/tra/invoices',
    element: <ScrTra0026Page />,
  },
  {
    // SCR-TRA-0028 請求書詳細
    id: 'SCR-TRA-0028',
    name: '請求書詳細',
    path: '-',
    element: <ScrTra0028Page />,
  },
  {
    // SCR-TRA-0029 会費請求一覧
    id: 'SCR-TRA-0029',
    name: '会費請求一覧',
    path: '/tra/fee-billings',
    element: <ScrTra0029Page />,
  },
  {
    // SCR-TRA-0031 計算書一覧
    id: 'SCR-TRA-0031',
    name: '計算書一覧',
    path: '/tra/statements',
    element: <ScrTra0031Page />,
  },
  {
    // SCR-TRA-0033 計算書詳細
    id: 'SCR-TRA-0033',
    name: '計算書詳細',
    path: '-',
    element: <ScrTra0033Page />,
  },
  {
    // SCR-TRA-0034 元帳一覧
    id: 'SCR-TRA-0034',
    name: '元帳一覧',
    path: '/tra/ledgers',
    element: <ScrTra0034Page />,
  },
  {
    // SCR-TRA-0036 仕訳確認
    id: 'SCR-TRA-0036',
    name: '仕訳確認',
    path: '/tra/journals',
    element: <ScrTra0036Page />,
  },
  {
    // SCR-TRA-0038 残高確認
    id: 'SCR-TRA-0038',
    name: '残高確認',
    path: '/tra/balances',
    element: <ScrTra0038Page />,
  },
  {
    // exp Experiments
    id: 'Experiments',
    name: 'Experiments',
    path: '/_exp/experiments',
    element: <Experiments />,
  },
  {
    // exp DataGridCellJoin
    id: 'DataGridCellJoin',
    name: 'DataGridCellJoin',
    path: '/_exp/datagrid-cell-join',
    element: <DatagridCellJoin />,
  },
  {
    // exp DataGridCellType
    id: 'DataGridCellType',
    name: 'DataGridCellType',
    path: '/_exp/datagrid-cell-type',
    element: <DataGridCellType />,
  },
  {
    // exp DatagridColumnGroups
    id: 'DatagridColumnGroups',
    name: 'DatagridColumnGroups',
    path: '/_exp/datagrid-column-groups',
    element: <DatagridColumnGroups />,
  },
  {
    // exp Layouts
    id: 'Layouts',
    name: 'Layouts',
    path: '/_exp/Layouts',
    element: <Layouts />,
  },
  {
    // exp WatchForm
    id: 'WatchForm',
    name: 'WatchForm',
    path: '/_exp/watch-form',
    element: <WatchForm />,
  },
  {
    // exp Scroll
    id: 'Scroll',
    name: 'Scroll',
    path: '/_exp/Scroll',
    element: <Scroll />,
  },
  {
    // exp Logout
    id: 'Logout',
    name: 'Logout',
    path: '/_exp/logout',
    element: <Logout />,
  },
];

/**
 * 画面URI定義
 */
export const ROUTES = [
  {
    path: '/_exp/logout',
    element: <Logout />,
    children: [],
  },
  {
    path: '/',
    element: <GlobalLayout />,
    children: _ROUTES,
  },
];

export type Rootes = NonNullable<ReturnType<typeof getRoute>>;

export const getRoute = (id: string) => {
  return _ROUTES.find((x) => x.id === id);
};
