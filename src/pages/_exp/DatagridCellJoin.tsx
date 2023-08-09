import React from 'react';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { DataGrid, GridColDef } from 'controls/Datagrid';

import { GridComparatorFn } from '@mui/x-data-grid-pro';

interface JiZeiHenkinMeisaiModel {
  id: number;
  tusika: string;
  hakkoBi: string;
  yomitoriBi: string;
  kaijoMei: string;
  kaisaiBi: string;
  kaisaiKaisu: number;
  shuppinBango: string;
  shaMei: string;
  shadaiBango: string;
  jidoshaZei: string;
  hoshoKin: string;
  sonota: string;
  sonotaShohiZei: string;
  sonotaBiko: string;
}

const rows: JiZeiHenkinMeisaiModel[] = [
  {
    id: 0,
    tusika: '追加',
    hakkoBi: '2022/5/23_1',
    yomitoriBi: '2022/5/23',
    kaijoMei: '',
    kaisaiBi: '',
    kaisaiKaisu: 0,
    shuppinBango: '',
    shaMei: '',
    shadaiBango: 'UUUUU',
    jidoshaZei: '-10,000',
    hoshoKin: '',
    sonota: '1,300',
    sonotaShohiZei: '1,300',
    sonotaBiko: '輸送料',
  },
  {
    id: 1,
    tusika: '追加',
    hakkoBi: '2022/5/23_2',
    yomitoriBi: '2022/5/23',
    kaijoMei: '',
    kaisaiBi: '',
    kaisaiKaisu: 0,
    shuppinBango: '',
    shaMei: '',
    shadaiBango: 'SSSSS',
    jidoshaZei: '',
    hoshoKin: '-15,000',
    sonota: '',
    sonotaShohiZei: '',
    sonotaBiko: '',
  },
  {
    // 合計
    id: 2,
    tusika: '合計',
    hakkoBi: '2022/5/23_3',
    yomitoriBi: '',
    kaijoMei: '',
    kaisaiBi: '',
    kaisaiKaisu: 0,
    shuppinBango: '',
    shaMei: '',
    shadaiBango: '',
    jidoshaZei: '-23,570',
    hoshoKin: '',
    sonota: '',
    sonotaShohiZei: '',
    sonotaBiko: '',
  },
  {
    id: 3,
    tusika: '追加',
    hakkoBi: '2022/5/30_1',
    yomitoriBi: '2022/5/23',
    kaijoMei: '',
    kaisaiBi: '',
    kaisaiKaisu: 0,
    shuppinBango: '',
    shaMei: '',
    shadaiBango: 'ZZZZZ',
    jidoshaZei: '-10,000',
    hoshoKin: '',
    sonota: '',
    sonotaShohiZei: '',
    sonotaBiko: '',
  },
  {
    // 合計
    id: 4,
    tusika: '合計',
    hakkoBi: '2022/5/30_2',
    yomitoriBi: '',
    kaijoMei: '',
    kaisaiBi: '',
    kaisaiKaisu: 0,
    shuppinBango: '',
    shaMei: '',
    shadaiBango: '',
    jidoshaZei: '-10,000',
    hoshoKin: '',
    sonota: '',
    sonotaShohiZei: '',
    sonotaBiko: '',
  },
  {
    id: 5,
    tusika: '追加',
    hakkoBi: '2022/6/1_1',
    yomitoriBi: '2022/6/1',
    kaijoMei: '',
    kaisaiBi: '',
    kaisaiKaisu: 0,
    shuppinBango: '',
    shaMei: '',
    shadaiBango: 'UUUUU',
    jidoshaZei: '-10,601',
    hoshoKin: '',
    sonota: '1,601',
    sonotaShohiZei: '1,601',
    sonotaBiko: '輸送料',
  },
  {
    id: 6,
    tusika: '追加',
    hakkoBi: '2022/6/1_2',
    yomitoriBi: '2022/6/1',
    kaijoMei: '',
    kaisaiBi: '',
    kaisaiKaisu: 0,
    shuppinBango: '',
    shaMei: '',
    shadaiBango: 'SSSSS',
    jidoshaZei: '',
    hoshoKin: '-10,601',
    sonota: '',
    sonotaShohiZei: '',
    sonotaBiko: '',
  },
  {
    // 合計
    id: 7,
    tusika: '合計',
    hakkoBi: '2022/6/1_3',
    yomitoriBi: '',
    kaijoMei: '',
    kaisaiBi: '',
    kaisaiKaisu: 0,
    shuppinBango: '',
    shaMei: '',
    shadaiBango: '',
    jidoshaZei: '-20,601',
    hoshoKin: '',
    sonota: '',
    sonotaShohiZei: '',
    sonotaBiko: '',
  },
];

/**
 * DatagridCellJoin
 */
const DatagridCellJoin = () => {
  const comparator: GridComparatorFn<string> = (v1, v2) => {
    const [ymd1, order1] = v1.split('_');
    const [ymd2, order2] = v2.split('_');
    const [y1, m1, d1] = ymd1.split('/');
    const [y2, m2, d2] = ymd2.split('/');
    const date1 = new Date(Number(y1), Number(m1), Number(d1));
    const date2 = new Date(Number(y2), Number(m2), Number(d2));
    const diff = date1.getTime() - date2.getTime();
    return diff;
  };

  const subtotalCols = [2, 4, 7];

  const columns: GridColDef[] = [
    {
      field: 'tusika',
      headerName: '追加',
      align: 'center',
      colSpan: (row) =>
        subtotalCols.includes(row.id as number) ? 5 : undefined,
    },
    {
      field: 'hakkoBi',
      headerName: '発行日',
      align: 'center',
      valueGetter: (params) => params.value.split('_')[0],
      sortComparator: comparator,
    },
    {
      field: 'yomitoriBi',
      headerName: '読取日',
      align: 'center',
    },
    {
      field: 'kaijoMei',
      headerName: '会場名',
      align: 'center',
    },
    {
      field: 'kaisaiBi',
      headerName: '開催日',
      align: 'center',
    },
    {
      field: 'kaisaiKaisu',
      headerName: '開催回数',
      align: 'center',
    },
    {
      field: 'shuppinBango',
      headerName: '出品番号',
      align: 'center',
    },
    {
      field: 'shaMei',
      headerName: '車名',
      align: 'center',
    },
    {
      field: 'shadaiBango',
      headerName: '車台番号',
      align: 'center',
    },
    {
      field: 'jidoshaZei',
      headerName: '自動車税',
      align: 'center',
      colSpan: (row) =>
        subtotalCols.includes(row.id as number) ? 5 : undefined,
    },
    {
      field: 'hoshoKin',
      headerName: '保証金',
      align: 'center',
    },
    {
      field: 'sonota',
      headerName: 'その他',
      align: 'center',
    },
    {
      field: 'sonotaShohiZei',
      headerName: 'その他消費税',
      align: 'center',
    },
    {
      field: 'sonotaBiko',
      headerName: 'その他備考',
      align: 'center',
    },
  ];

  return (
    <MainLayout>
      <MainLayout main>
        <Section name='自税返金明細書情報'>
          <DataGrid columns={columns} rows={rows} />
        </Section>
      </MainLayout>
    </MainLayout>
  );
};

export default DatagridCellJoin;
