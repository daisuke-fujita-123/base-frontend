import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { Button } from 'controls/Button';
import { DataGrid, exportCsv, GridColDef } from 'controls/Datagrid';

import { useGridApiRef } from '@mui/x-data-grid-pro';
import {
  CELL_TYPE_DATASET,
  CHOHYO_DATASEAT,
  CHOHYO_HREFS,
  KIHON_NEBIKI_NEMASHI_DATASET,
  YAKUSHOKU_DATASET,
} from './dataset';

/**
 * セルタイプ行データモデル
 */
interface CellTypeRowModel {
  id: number;
  input: string;
  select: string;
  radio: string;
  checkbox: boolean;
  datepicker: string;
}

/**
 * セルタイプ列定義
 */
const cellTypeColumns: GridColDef[] = [
  {
    field: 'input',
    headerName: 'インプット',
    cellType: 'input',
    width: 200,
  },
  {
    field: 'select',
    headerName: 'セレクト',
    cellType: 'select',
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
    width: 200,
  },
  {
    field: 'radio',
    headerName: 'ラジオ',
    cellType: 'radio',
    radioValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
    size: 'l',
  },
  {
    field: 'checkbox',
    headerName: 'チェックボックス',
    cellType: 'checkbox',
  },
  {
    field: 'datepicker',
    headerName: 'デートピッカー',
    cellType: 'datepicker',
    size: 'l',
  },
];

// const columns: GridColDef[] = [
//   {
//     field: 'input',
//     headerName: '申請ID',
//     size: 's',
//   },
//   {
//     field: 'select',
//     headerName: 'システム識別',
//     size: 's',
//   },
//   {
//     field: 'radio',
//     headerName: '申請元画面',
//     size: 's',
//   },
//   {
//     field: 'checkbox',
//     headerName: 'タブ名/一括登録',
//     size: 'm',
//   },
//   {
//     field: 'datepicker',
//     headerName: '変更理由',
//     size: 's',
//   },
//   {
//     field: '1',
//     headerName: '変更日',
//     size: 's',
//   },
//   {
//     field: '2',
//     headerName: '申請日時',
//     size: 's',
//   },
//   {
//     field: '3',
//     headerName: '申請者コメント',
//     size: 'm',
//   },
//   {
//     field: '4',
//     headerName: '承認ステータス',
//     size: 'm',
//   },
//   {
//     field: '5',
//     headerName: '12345678901234567890123456789012345678901234567890',
//   },
// ];

/**
 * 帳票一覧行データモデル
 */
interface ChohyoRowModel {
  id: number;
  chohyoId: string;
  chohyoMei: string;
  shutsuryokuKeishiki: string;
  commentHenshuKahi: string;
  henkoYoyaku: string;
  shutsuryokuMotoKino: string;
}

/**
 * 帳票一覧列定義
 */
const chohyoColumns: GridColDef[] = [
  {
    field: 'chohyoId',
    headerName: '帳票ID',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'chohyoMei',
    headerName: '帳票名',
    size: 'm',
  },
  {
    field: 'shutsuryokuKeishiki',
    headerName: '出力形式',
  },
  {
    field: 'commentHenshuKahi',
    headerName: 'コメント出力可否',
    size: 'm',
  },
  {
    field: 'henkoYoyaku',
    headerName: '変更予約',
  },
  {
    field: 'shutsuryokuMotoKino',
    headerName: '出力元機能',
    size: 'l',
  },
];

/**
 * 基本値引値増行データモデル
 */
interface KihonNebikiNemashiRowModel {
  id: number;
  campaignCode: string;
  campaignName: string;
  kaiinShubetsu: number;
  kingaku: any[];
  serviceName: string;
  ipponmeJogai: boolean;
  keiyakuHonsu: any[];
  kikanFromToKeiyakuBiKaranoGessu: {
    selection: number;
    values: any[];
  };
}

/**
 * 基本値引値増列定義
 */
const kihonNebikiNemashiColumns: GridColDef[] = [
  {
    field: 'campaignCode',
    headerName: 'キャンペーンコード',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'campaignName',
    headerName: 'キャンペーン名',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'kaiinShubetsu',
    headerName: '会費種別',
    cellType: 'radio',
    radioValues: [
      { value: 0, displayValue: '入会金' },
      { value: 1, displayValue: '定価' },
    ],
    size: 'l',
  },
  {
    field: 'kingaku',
    headerName: '金額',
    cellType: [
      {
        type: 'select',
        selectValues: [
          { value: 0, displayValue: '変動後の金額' },
          { value: 1, displayValue: '変動金額' },
        ],
      },
      { type: 'input', helperText: '円' },
    ],
    size: 'l',
  },
  {
    field: 'serviceName',
    headerName: 'サービス名',
    cellType: 'select',
    selectValues: [{ value: 0, displayValue: 'サテロクプレミアム' }],
    size: 'm',
  },
  {
    field: 'ipponmeJogai',
    headerName: '1本目除外',
    cellType: 'checkbox',
  },
  {
    field: 'keiyakuHonsu',
    headerName: '契約本数',
    cellType: [
      { type: 'input', helperText: '以上' },
      { type: 'input', helperText: '以下' },
    ],
    size: 'l',
  },
  {
    field: 'kikanFromToKeiyakuBiKaranoGessu',
    headerName: '期間 FROM TO 契約日からの月数',
    cellType: 'radio',
    radioInputTypes: ['fromto', 'input'],
    cellHelperText: 'カ月',
    width: 700,
  },
];

/**
 * 役職情報一覧行データモデル
 */
interface yakushokuRowModel {
  id: number;
  yakushokuId: string;
  yakushokuMei: string;
  shozokuSoshiki: string;
  gamenKengen: number;
  masterKengen: number;
  shoninKengen: number;
  tekiyoKaishiBi: string;
  tekiyoShuryoBi: string;
}

/**
 * 役職情報一覧列定義
 */
const yakushokuColumns: GridColDef[] = [
  {
    field: 'yakushokuId',
    headerName: '役職ID',
  },
  {
    field: 'yakushokuMei',
    headerName: '役職名',
    cellType: 'input',
  },
  {
    field: 'shozokuSoshiki',
    headerName: '所属組織',
    cellType: 'select',
    selectValues: [
      { value: 'eighoJigyoBu', displayValue: '営業事業部' },
      { value: 'eighoXxxxBu', displayValue: '営業XXXX部' },
      { value: 'eighoYyyyyoKa', displayValue: '営業YYYYY課' },
    ],
    size: 'm',
  },
  {
    field: 'gamenKengen',
    headerName: '画面権限',
    cellType: 'select',
    selectValues: [
      { value: 1, displayValue: '管理者権限 1' },
      { value: 2, displayValue: '管理者権限 2' },
      { value: 3, displayValue: '管理者権限 3' },
    ],
    cellHelperButton: 'info',
    size: 'm',
  },
  {
    field: 'masterKengen',
    headerName: 'マスタ権限',
    cellType: 'select',
    selectValues: [
      { value: 1, displayValue: '管理者権限 1' },
      { value: 2, displayValue: '管理者権限 2' },
      { value: 3, displayValue: '管理者権限 3' },
    ],
    cellHelperButton: 'info',
    size: 'm',
  },
  {
    field: 'shoninKengen',
    headerName: '承認権限',
    cellType: 'select',
    selectValues: [
      { value: 1, displayValue: '管理者権限 1' },
      { value: 2, displayValue: '管理者権限 2' },
      { value: 3, displayValue: '管理者権限 3' },
    ],
    cellHelperButton: 'info',
    size: 'm',
  },
  {
    field: 'tekiyoKaishiBi',
    headerName: '適用開始日',
    cellType: 'datepicker',
    size: 'l',
  },
  {
    field: 'tekiyoShuryoBi',
    headerName: '適用終了日',
    cellType: 'datepicker',
    size: 'l',
  },
];

/**
 * DataGridCellType
 */
const DataGridCellType = () => {
  const apiRef = useGridApiRef();

  const navigate = useNavigate();

  const [cellTypeRows] = useState<CellTypeRowModel[]>(CELL_TYPE_DATASET);
  const [chohyoRows] = useState<ChohyoRowModel[]>(CHOHYO_DATASEAT);
  const [chohyoHrefs] = useState<any[]>(CHOHYO_HREFS);
  const [kihonNebikiNemashiRows] = useState<KihonNebikiNemashiRowModel[]>(
    KIHON_NEBIKI_NEMASHI_DATASET
  );
  const [yakushokuRows] = useState<yakushokuRowModel[]>(YAKUSHOKU_DATASET);

  const [rows] = useState(cellTypeRows);

  const handleClick = () => {
    console.log(kihonNebikiNemashiRows);
  };

  const handleExportCsvClick = () => {
    exportCsv('filename.csv', apiRef);
  };

  const handleInfoButtonClick = (field: string, id: number) => {
    console.log('info button clicked. field:' + field + ', id: ' + id);
  };

  return (
    <MainLayout>
      <MainLayout main>
        <Section name='DataGrid Cell Type'>
          <DataGrid columns={cellTypeColumns} rows={rows} apiRef={apiRef} />
          <Button onClick={handleExportCsvClick}>export csv</Button>
          <Button onClick={handleClick}>console.log</Button>
        </Section>

        <Section name='SCR-COM-0007 帳票管理 > 基本情報タブ > 帳票一覧'>
          <DataGrid
            columns={chohyoColumns}
            rows={chohyoRows}
            hrefs={chohyoHrefs}
          />
          <Button onClick={handleClick}>console.log</Button>
        </Section>

        <Section name='SCR-COM-0013 商品管理 > 手数料値引・値増テーブル一覧 > 会費セクション > 基本値引値増'>
          <DataGrid
            columns={kihonNebikiNemashiColumns}
            rows={kihonNebikiNemashiRows}
          />
          <Button onClick={handleClick}>console.log</Button>
        </Section>

        <Section name='SCR-COM-00125 組織管理 > 役職情報 > 役職情報一覧'>
          <DataGrid
            columns={yakushokuColumns}
            rows={yakushokuRows}
            onCellHelperButtonClick={handleInfoButtonClick}
          />
          <Button onClick={handleClick}>console.log</Button>
        </Section>
      </MainLayout>
    </MainLayout>
  );
};

export default DataGridCellType;
