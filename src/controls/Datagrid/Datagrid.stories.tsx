import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Button } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';

import { GridRowsProp } from '@mui/x-data-grid';
import {
  GridRenderCellParams,
  GridTreeNodeWithRender,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { LicenseInfo } from '@mui/x-date-pickers-pro';

LicenseInfo.setLicenseKey(
  '9e8f3ae5776c28cc3be840ba1f975c3fTz02MjIyMyxFPTE3MTA2NDA5NzA3NzEsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
);

export default {
  component: DataGrid,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof DataGrid>;

export const Index: ComponentStoryObj<typeof DataGrid> = {
  args: {
    columns: [
      {
        field: 'corporationId',
        headerName: '法人ID',
        width: 96,
        cellType: 'link',
      },
      {
        field: 'corporationName',
        headerName: '法人名',
        width: 384,
      },
      {
        field: 'corporationGroupName',
        headerName: '法人グループ名',
        width: 384,
      },
      {
        field: 'representativeName',
        headerName: '代表者名',
        width: 128,
      },
    ],
    rows: [
      {
        id: '0001',
        corporationId: '0001',
        corporationName: '法人1',
        corporationGroupName: '法人グループ1',
        representativeName: '代表者1',
      },
      {
        id: '0002',
        corporationId: '0002',
        corporationName: '法人2',
        corporationGroupName: '法人グループ2',
        representativeName: '代表者2',
      },
      {
        id: '0003',
        corporationId: '0003',
        corporationName: '法人3',
        corporationGroupName: '法人グループ3',
        representativeName: '代表者3',
      },
      {
        id: '0004',
        corporationId: '0004',
        corporationName: '法人4',
        corporationGroupName: '法人グループ4',
        representativeName: '代表者4',
      },
      {
        id: '0005',
        corporationId: '0005',
        corporationName: '法人5',
        corporationGroupName: '法人グループ5',
        representativeName: '代表者5',
      },
    ],
  },
};

export const Example = () => {
  const columns: GridColDef[] = [
    {
      field: 'corporationId',
      headerName: '法人ID',
    },
    {
      field: 'corporationName',
      headerName: '法人名',
    },
    {
      field: 'corporationGroupName',
      headerName: '法人グループ名',
      size: 'm',
    },
    {
      field: 'representativeName',
      headerName: '代表者名',
      size: 'm',
    },
    {
      field: 'input',
      cellType: 'input',
    },
    {
      field: 'select',
      cellType: 'select',
      selectValues: [
        { value: '1', displayValue: 'one' },
        { value: '2', displayValue: 'two' },
        { value: '3', displayValue: 'three' },
      ],
    },
    {
      field: 'radio',
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
      cellType: 'checkbox',
    },
    {
      field: 'datepicker',
      cellType: 'datepicker',
      size: 'l',
    },
  ];

  const rows: GridRowsProp = [
    {
      id: '0001',
      corporationId: '0001',
      corporationName: '法人1',
      corporationGroupName: '法人グループ1',
      representativeName: '代表者1',
    },
    {
      id: '0002',
      corporationId: '0002',
      corporationName: '法人2',
      corporationGroupName: '法人グループ2',
      representativeName: '代表者2',
    },
    {
      id: '0003',
      corporationId: '0003',
      corporationName: '法人3',
      corporationGroupName: '法人グループ3',
      representativeName: '代表者3',
    },
    {
      id: '0004',
      corporationId: '0004',
      corporationName: '法人4',
      corporationGroupName: '法人グループ4',
      representativeName: '代表者4',
    },
    {
      id: '0005',
      corporationId: '0005',
      corporationName: '法人5',
      corporationGroupName: '法人グループ5',
      representativeName: '代表者5',
    },
  ];

  return (
    <>
      <DataGrid columns={columns} rows={rows} disabled />
    </>
  );
};

export const HeaderRow = () => {
  const columns: GridColDef[] = [
    {
      field: 'shuppinKingaku',
      headerName: '出品台数',
    },
    {
      field: 'seiyakuDaisu',
      headerName: '成約台数',
    },
    {
      field: 'seiyakuKingaku',
      headerName: '成約金額',
    },
  ];

  const rows: GridRowsProp = [
    {
      id: 0,
      shuppinKingaku: '5',
      seiyakuDaisu: '3',
      seiyakuKingaku: '5,000,000',
    },
    {
      id: 1,
      shuppinKingaku: '3',
      seiyakuDaisu: '2',
      seiyakuKingaku: '2,000,000',
    },
    {
      id: 2,
      shuppinKingaku: '10',
      seiyakuDaisu: '5',
      seiyakuKingaku: '10,000,000',
    },
  ];

  const headerRow = {
    shuppinKingaku: '18',
    seiyakuDaisu: '10',
    seiyakuKingaku: '17,000,000',
  };

  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        showHeaderRow
        headerRow={headerRow}
      />
    </>
  );
};

export const UpdatableHeaderRow = () => {
  const apiRef = useGridApiRef();
  const headerApiRef = useGridApiRef();

  const columns: GridColDef[] = [
    {
      field: 'button',
      headerName: '',
      cellType: 'button',
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ) => {
        // ヘッダー行にのみボタンを配置
        if (params.id !== -1) return undefined;
        return <Button onClick={handleIkkatsuHaneiClick}>一括反映</Button>;
      },
    },
    {
      field: 'soshikiIdOrMeisyo',
      headerName: '組織ID／名称',
      cellType: 'select',
      selectValues: [
        { value: 0, displayValue: '' },
        { value: 1, displayValue: 'XXXXX' },
      ],
      size: 'm',
    },
    {
      field: 'yakushokuIdOrMeisyo',
      headerName: '役職ID／名称',
      cellType: 'select',
      selectValues: [
        { value: 0, displayValue: '' },
        { value: 1, displayValue: 'XXXXX' },
      ],
      size: 'm',
    },
    {
      field: 'teiyoKaishiBi',
      headerName: '適用開始日',
      cellType: 'datepicker',
      size: 'l',
    },
    {
      field: 'teiyoShuryoBi',
      headerName: '適用終了日',
      cellType: 'datepicker',
      size: 'l',
    },
  ];

  const defaultRows: GridRowsProp = [
    {
      id: 0,
      soshikiIdOrMeisyo: 0,
      yakushokuIdOrMeisyo: 0,
      teiyoKaishiBi: '',
      teiyoShuryoBi: '',
    },
    {
      id: 1,
      soshikiIdOrMeisyo: 1,
      yakushokuIdOrMeisyo: 1,
      teiyoKaishiBi: '2022/10/10',
      teiyoShuryoBi: '',
    },
    {
      id: 2,
      soshikiIdOrMeisyo: 1,
      yakushokuIdOrMeisyo: 1,
      teiyoKaishiBi: '2022/10/10',
      teiyoShuryoBi: '',
    },
    {
      id: 3,
      soshikiIdOrMeisyo: 0,
      yakushokuIdOrMeisyo: 0,
      teiyoKaishiBi: '',
      teiyoShuryoBi: '',
    },
  ];

  const headerRow = {
    soshikiIdOrMeisyo: 0,
    yakushokuIdOrMeisyo: 0,
    teiyoKaishiBi: '',
    teiyoShuryoBi: '',
  };

  const handleIkkatsuHaneiClick = () => {
    const headerRow = headerApiRef.current.getRow(-1);
    // const rowIds = apiRef.current.getAllRowIds();
    // rowIds.forEach((x) => {
    //   const row = apiRef.current.getRow(x);
    //   console.log(row);
    //   row.soshikiIdOrMeisyo = '1';
    //   row.yakushokuIdOrMeisyo = '1';
    // });
    const newRows = rows.map((x) => {
      return {
        ...x,
        soshikiIdOrMeisyo: headerRow.soshikiIdOrMeisyo,
        yakushokuIdOrMeisyo: headerRow.yakushokuIdOrMeisyo,
        teiyoKaishiBi: headerRow.teiyoKaishiBi,
        teiyoShuryoBi: headerRow.teiyoShuryoBi,
      };
    });
    setRows(newRows);
  };

  const [rows, setRows] = useState(defaultRows);

  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        showHeaderRow
        headerRow={headerRow}
        apiRef={apiRef}
        headerApiRef={headerApiRef}
      />
    </>
  );
};

