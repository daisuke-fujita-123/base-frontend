import React from 'react';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { DataGrid, GridColDef } from 'controls/Datagrid';

import { GridColumnGroupingModel } from '@mui/x-data-grid-pro';

/**
 * 四輪契約情報列定義
 */
const columns: GridColDef[] = [
  // 契約情報
  {
    field: 'keiyakuId',
    headerName: '契約ID',
    size: 's',
  },
  {
    field: 'kaihiGokei',
    headerName: '会費合計',
  },
  {
    field: 'henkoYoyaku',
    headerName: '変更予約',
  },
  // 請求先情報
  {
    field: 'seikyuSakiId',
    headerName: '請求先ID',
    size: 's',
  },
  {
    field: 'kaihiSeikyuHoho',
    headerName: '会費請求方法',
    size: 's',
  },
  // コース情報
  {
    field: 'courseMei',
    headerName: 'コース名',
    size: 'm',
  },
  {
    field: 'sankaKubun',
    headerName: '参加区分',
  },
  {
    field: 'courseKaihi',
    headerName: 'コース会費',
  },
  {
    field: 'courseRiyoKaishiBi',
    headerName: '利用開始日',
    size: 's',
  },
  // オプションサービス情報
  {
    field: 'optionService',
    headerName: 'オプションサービス',
    size: 'm',
  },
  {
    field: 'suryo',
    headerName: '数量',
  },
  {
    field: 'optionKaihiGokei',
    headerName: 'オプション会費合計',
    size: 'm',
  },
  {
    field: 'optionServiceRiyoKaishiBi',
    headerName: '利用開始日',
    size: 's',
  },
];

/**
 * 四輪契約情報列グループ定義
 */
const columnGroups: GridColumnGroupingModel = [
  {
    groupId: '契約情報',
    children: [
      { field: 'keiyakuId' },
      { field: 'kaihiGokei' },
      { field: 'henkoYoyaku' },
    ],
  },
  {
    groupId: '請求先情報',
    children: [{ field: 'seikyuSakiId' }, { field: 'kaihiSeikyuHoho' }],
  },
  {
    groupId: 'コース情報',
    children: [
      { field: 'courseMei' },
      { field: 'sankaKubun' },
      { field: 'courseKaihi' },
      { field: 'courseRiyoKaishiBi' },
    ],
  },
  {
    groupId: 'オプションサービス情報',
    children: [
      { field: 'optionService' },
      { field: 'suryo' },
      { field: 'optionKaihiGokei' },
      { field: 'optionServiceRiyoKaishiBi' },
    ],
  },
];

/**
 * 四輪契約情報モデル
 */
interface YonrinKeiyakuModel {
  id: number;
  keiyakuId: string;
  kaihiGokei: string;
  henkoYoyaku: string;
  seikyuSakiId: string;
  kaihiSeikyuHoho: string;
  courseMei: string;
  sankaKubun: string;
  courseKaihi: string;
  courseRiyoKaishiBi: string;
  optionService: string;
  suryo: string;
  optionKaihiGokei: string;
  optionServiceRiyoKaishiBi: string;
}

/**
 * 四輪契約情報モデルデータ
 */
const rows: YonrinKeiyakuModel[] = [
  {
    id: 0,
    keiyakuId: 'XXXXX001',
    kaihiGokei: '75,000',
    henkoYoyaku: 'あり',
    seikyuSakiId: 'XXXXXXXX',
    kaihiSeikyuHoho: '集金代行',
    courseMei: '四輪プレミアム',
    sankaKubun: '参加',
    courseKaihi: '35,000',
    courseRiyoKaishiBi: 'YYYY/MM/DD',
    optionService: '',
    suryo: '',
    optionKaihiGokei: '',
    optionServiceRiyoKaishiBi: '',
  },
  {
    id: 1,
    keiyakuId: 'XXXXX001',
    kaihiGokei: '',
    henkoYoyaku: 'あり',
    seikyuSakiId: 'XXXXXXXX',
    kaihiSeikyuHoho: '集金代行',
    courseMei: '',
    sankaKubun: '',
    courseKaihi: '',
    courseRiyoKaishiBi: '',
    optionService: 'サテロク',
    suryo: '15',
    optionKaihiGokei: '20,000',
    optionServiceRiyoKaishiBi: 'YYYY/MM/DD',
  },
  {
    id: 2,
    keiyakuId: 'XXXXX001',
    kaihiGokei: '',
    henkoYoyaku: 'あり',
    seikyuSakiId: 'XXXXXXXX',
    kaihiSeikyuHoho: '集金代行',
    courseMei: '',
    sankaKubun: '',
    courseKaihi: '',
    courseRiyoKaishiBi: '',
    optionService: 'おまとめ',
    suryo: '3',
    optionKaihiGokei: '10,000',
    optionServiceRiyoKaishiBi: 'YYYY/MM/DD',
  },
  {
    id: 3,
    keiyakuId: 'XXXXX001',
    kaihiGokei: '',
    henkoYoyaku: 'あり',
    seikyuSakiId: 'XXXXXXXX',
    kaihiSeikyuHoho: '集金代行',
    courseMei: '',
    sankaKubun: '',
    courseKaihi: '',
    courseRiyoKaishiBi: '',
    optionService: 'JP',
    suryo: '3',
    optionKaihiGokei: '10,000',
    optionServiceRiyoKaishiBi: 'YYYY/MM/DD',
  },
  {
    id: 4,
    keiyakuId: 'XXXXX002',
    kaihiGokei: '30,000',
    henkoYoyaku: '',
    seikyuSakiId: 'XXXXXXXX',
    kaihiSeikyuHoho: '集金代行',
    courseMei: 'XXXXXXXX',
    sankaKubun: '参加',
    courseKaihi: '20,000',
    courseRiyoKaishiBi: 'YYYY/MM/DD',
    optionService: '',
    suryo: '',
    optionKaihiGokei: '',
    optionServiceRiyoKaishiBi: '',
  },
  {
    id: 5,
    keiyakuId: 'XXXXX002',
    kaihiGokei: '',
    henkoYoyaku: '',
    seikyuSakiId: 'XXXXXXXX',
    kaihiSeikyuHoho: '集金代行',
    courseMei: '',
    sankaKubun: '',
    courseKaihi: '',
    courseRiyoKaishiBi: '',
    optionService: 'サテロク',
    suryo: '10',
    optionKaihiGokei: '10,000',
    optionServiceRiyoKaishiBi: 'YYYY/MM/DD',
  },
];

/**
 * DatagridColumnGroups
 */
const DatagridColumnGroups = () => {
  return (
    <MainLayout>
      <MainLayout main>
        <Section name='【四輪】契約情報'>
          <DataGrid
            columns={columns}
            columnGroupingModel={columnGroups}
            rows={rows}
          />
        </Section>
      </MainLayout>
    </MainLayout>
  );
};

export default DatagridColumnGroups;
