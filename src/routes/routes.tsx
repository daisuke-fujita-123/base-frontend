import React from 'react';

import ScrCom0011PopupTester from 'pages/_dev/ScrCom0011PopupTester';
import ScrCom0018PopupTester from 'pages/_dev/ScrCom0018PopupTester';
import ScrCom0032PopupTester from 'pages/_dev/ScrCom0032PopupTester';
import ScrCom0033PopupTester from 'pages/_dev/ScrCom0033PopupTester';
import ScrCom0035PopupTester from 'pages/_dev/ScrCom0035PopupTester';
import ScrCom0036PopupTester from 'pages/_dev/ScrCom0036PopupTester';
import ScrCom0038PopupTester from 'pages/_dev/ScrCom0038PopupTester';
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
import ScrMem0001Page from 'pages/mem/ScrMem0001Page';
import ScrMem0003Page from 'pages/mem/ScrMem0003Page';
import ScrMem0008Page from 'pages/mem/ScrMem0008Page';
import ScrMem0010Page from 'pages/mem/ScrMem0010Page';
import ScrMem0012Page from 'pages/mem/ScrMem0012Page';
import ScrMem0014Page from 'pages/mem/ScrMem0014Page';

import GlobalLayout from 'layouts/GlobalLayout';

/**
 * _routes
 */
const _routes = [
  {
    // SCR-COM-0002 TOP
    id: 'SCR-COM-0002',
    name: 'TOP',
    index: true,
    element: <ScrCom0002Page />,
  },
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
    path: '-',
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
    path: '-',
    element: <ScrMem0014Page />,
  },
  {
    // SCR-DOC-0001 書類情報一覧
    id: 'SCR-DOC-0001',
    name: '書類情報一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-DOC-0005 書類情報詳細
    id: 'SCR-DOC-0005',
    name: '書類情報詳細',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-DOC-0010 到着一括入力
    id: 'SCR-DOC-0010',
    name: '到着一括入力',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0001 取引管理マスタ一覧
    id: 'SCR-TRA-0001',
    name: '取引管理マスタ一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0003 取引管理マスタメンテナンス
    id: 'SCR-TRA-0003',
    name: '取引管理マスタメンテナンス',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0005 会員売上伝票一覧
    id: 'SCR-TRA-0005',
    name: '会員売上伝票一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0007 会員売上伝票詳細
    id: 'SCR-TRA-0007',
    name: '会員売上伝票詳細',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0008 車両伝票一覧
    id: 'SCR-TRA-0008',
    name: '車両伝票一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0010 車両伝票詳細
    id: 'SCR-TRA-0010',
    name: '車両伝票詳細',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0011 債権一覧
    id: 'SCR-TRA-0011',
    name: '債権一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0013 債権詳細
    id: 'SCR-TRA-0013',
    name: '債権詳細',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0014 債権・預かり金処理
    id: 'SCR-TRA-0014',
    name: '債権・預かり金処理',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0016 入金一覧
    id: 'SCR-TRA-0016',
    name: '入金一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0018 入金詳細
    id: 'SCR-TRA-0018',
    name: '入金詳細',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0019 返金一覧
    id: 'SCR-TRA-0019',
    name: '返金一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0020 返金詳細
    id: 'SCR-TRA-0020',
    name: '返金詳細',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0021 集金代行入金
    id: 'SCR-TRA-0021',
    name: '集金代行入金',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0023 出金一覧
    id: 'SCR-TRA-0023',
    name: '出金一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0025 出金詳細
    id: 'SCR-TRA-0025',
    name: '出金詳細',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0026 請求書一覧
    id: 'SCR-TRA-0026',
    name: '請求書一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0028 請求書詳細
    id: 'SCR-TRA-0028',
    name: '請求書詳細',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0029 会費請求一覧
    id: 'SCR-TRA-0029',
    name: '会費請求一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0031 計算書一覧
    id: 'SCR-TRA-0031',
    name: '計算書一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0033 計算書詳細
    id: 'SCR-TRA-0033',
    name: '計算書詳細',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0034 元帳一覧
    id: 'SCR-TRA-0034',
    name: '元帳一覧',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0036 仕訳確認
    id: 'SCR-TRA-0036',
    name: '仕訳確認',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-TRA-0038 残高確認
    id: 'SCR-TRA-0038',
    name: '残高確認',
    path: '-',
    element: <ScrCom0002Page />,
  },
  {
    // SCR-COM-0011 帳票選択（ポップアップ）テスター
    id: 'SCR-COM-0011',
    name: '帳票選択（ポップアップ）テスター',
    path: '/_dev/tester/scr-com-0011',
    element: <ScrCom0011PopupTester />,
  },
  {
    // SCR-COM-0018 サービス一覧（ポップアップ）テスター
    id: 'SCR-COM-0018',
    name: 'サービス一覧（ポップアップ）テスター',
    path: '/_dev/tester/scr-com-0018',
    element: <ScrCom0018PopupTester />,
  },
  {
    // SCR-COM-0032 登録内容確認（ポップアップ）テスター
    id: 'SCR-COM-0032',
    name: '登録内容確認（ポップアップ）テスター',
    path: '/_dev/tester/scr-com-0032',
    element: <ScrCom0032PopupTester />,
  },
  {
    // SCR-COM-0033 登録内容申請（ポップアップ）テスター
    id: 'SCR-COM-0033',
    name: '登録内容申請（ポップアップ）テスター',
    path: '/_dev/tester/scr-com-0033',
    element: <ScrCom0033PopupTester />,
  },
  {
    // SCR-COM-0035 CSV読込（ポップアップ）テスター
    id: 'SCR-COM-0035',
    name: 'CSV読込（ポップアップ）テスター',
    path: '/_dev/tester/scr-com-0035',
    element: <ScrCom0035PopupTester />,
  },
  {
    // SCR-COM-0036 一括登録エラー確認（ポップアップ）テスター
    id: 'SCR-COM-0036',
    name: '一括登録エラー確認（ポップアップ）テスター',
    path: '/_dev/tester/scr-com-0036',
    element: <ScrCom0036PopupTester />,
  },
  {
    // SCR-COM-0038 エラー確認（ポップアップ）テスター
    id: 'SCR-COM-0038',
    name: 'エラー確認（ポップアップ）テスター',
    path: '/_dev/tester/scr-com-0038',
    element: <ScrCom0038PopupTester />,
  },
];

/**
 * routes
 */
export const routes = [
  {
    path: '/',
    element: <GlobalLayout />,
    children: _routes,
  },
];

export type Rootes = NonNullable<ReturnType<typeof getRoute>>;

export const getRoute = (id: string) => {
  return _routes.find((x) => x.id === id);
};
