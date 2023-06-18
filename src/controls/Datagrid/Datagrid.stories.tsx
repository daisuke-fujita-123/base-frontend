import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React from 'react';

import { DataGrid, GridColDef } from 'controls/Datagrid';

import { GridRowsProp } from '@mui/x-data-grid';

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
      <DataGrid columns={columns} rows={rows} />
    </>
  );
};

