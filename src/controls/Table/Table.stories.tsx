import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React from 'react';

import { Table, TableColDef, TableRowModel } from './Table';

export default {
  component: Table,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof Table>;

export const Index: ComponentStoryObj<typeof Table> = {
  args: {
    columns: [
      { field: 'name', headerName: 'name', width: 70 },
      { field: 'calories', headerName: 'calories', width: 130 },
      { field: 'fat', headerName: 'fat', width: 50 },
    ],
    rows: [
      { name: 'Frozen yoghurt', calories: 'カロリー', fat: 300 },
      { name: 'Ice cream sandwich', calories: 'マロリー', fat: 200 },
      { name: 'Eclair', calories: 'パロリー', fat: 100 },
      { name: 'Cupcake', calories: 'セロリー', fat: 10 },
      { name: 'Gingerbread', calories: 'キャロリー', fat: 2 },
    ],
  },
};

export const Example = () => {
  const columns: TableColDef[] = [
    { field: 'name', headerName: 'name', width: 70 },
    { field: 'calories', headerName: 'calories', width: 130 },
    { field: 'fat', headerName: 'fat', width: 50 },
  ];

  const rows: TableRowModel[] = [
    { name: 'Frozen yoghurt', calories: 'カロリー', fat: 300 },
    { name: 'Ice cream sandwich', calories: 'マロリー', fat: 200 },
    { name: 'Eclair', calories: 'パロリー', fat: 100 },
    { name: 'Cupcake', calories: 'セロリー', fat: 10 },
    { name: 'Gingerbread', calories: 'キャロリー', fat: 2 },
  ];

  return (
    <>
      <Table columns={columns} rows={rows} />
    </>
  );
};

