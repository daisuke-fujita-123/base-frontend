import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React, { useState } from 'react';

import yup from 'utils/yup';
import { ObjectSchema } from 'yup';

import { Button, PrimaryButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  InvalidModel,
} from 'controls/Datagrid';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material';
import { GridRowsProp } from '@mui/x-data-grid';
import {
  GridCellParams,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridTreeNode,
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
      field: 'input1',
      cellType: 'input',
      headerName: 'Input 1',
    },
    {
      field: 'input2',
      cellType: 'input',
      headerName: 'Input 2',
      required: true,
    },
    {
      field: 'select',
      cellType: 'select',
      headerName: 'Select',
      selectValues: [
        { value: '1', displayValue: 'one' },
        { value: '2', displayValue: 'two' },
        { value: '3', displayValue: 'three' },
      ],
    },
    {
      field: 'radio',
      cellType: 'radio',
      headerName: 'Radio',
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
      headerName: 'Checkbox',
    },
    {
      field: 'datepicker',
      cellType: 'datepicker',
      headerName: 'DatePicker',
      size: 'l',
    },

    {
      field: 'fromto',
      cellType: 'fromto',
      headerName: 'FromTo',
      width: 500,
    },
  ];

  const rows: GridRowsProp = [
    {
      id: 0,
      corporationId: '0001',
      corporationName: '法人1',
      corporationGroupName: '法人グループ1',
      representativeName: '代表者1',
      input1: 'Input 1',
      input2: 'Input 2',
      select: '1',
      radio: '1',
      checkbox: true,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
    {
      id: 1,
      corporationId: '0002',
      corporationName: '法人2',
      corporationGroupName: '法人グループ2',
      representativeName: '代表者2',
      input1: undefined,
      input2: 'Input 2',
      select: '4',
      radio: '1',
      checkbox: true,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
    {
      id: 2,
      corporationId: '0003',
      corporationName: '法人3',
      corporationGroupName: '法人グループ3',
      representativeName: '代表者3',
      input1: 'Input 1',
      input2: 'Input 2',
      select: undefined,
      radio: '1',
      checkbox: true,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
    {
      id: 3,
      corporationId: '0004',
      corporationName: '法人4',
      corporationGroupName: '法人グループ4',
      representativeName: '代表者4',
      input1: 'Input 1',
      input2: 'Input 2',
      select: '4',
      radio: undefined,
      checkbox: true,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
    {
      id: 4,
      corporationId: '0005',
      corporationName: '法人5',
      corporationGroupName: '法人グループ5',
      representativeName: '代表者5',
      input1: 'Input 1',
      input2: 'Input 2',
      select: '1',
      radio: '1',
      checkbox: undefined,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
  ];

  const validationSchema: ObjectSchema<any> = yup
    .object({
      input1: yup.string().max(10).label('Input 1'),
      input2: yup.string().required().max(10).label('Input 2'),
      fromto: yup
        .array()
        .of(yup.string().required().label('FromTo'))
        .label('Select'),
    })
    .test(
      'input1Reqired',
      'SelectとRadioがそれぞれ1の場合Inpaut 1は必須です',
      (value: any) => {
        if (value.select === '1' && value.radio === '1' && value.input1 === '')
          return false;
        return true;
      }
    );

  const [invalids, setInvalids] = useState<InvalidModel[]>([]);

  const apiRef = useGridApiRef();

  const handleOnInvalidModelChange = (invalids: InvalidModel[]) => {
    console.log(invalids);
    setInvalids([...invalids]);
  };

  const handleGetCellReadonly = (params: any) => {
    if (params.field === 'input2' && params.id % 2 === 0) return true;
    if (params.field === 'select' && params.id % 2 === 1) return true;
    return false;
  };

  const handleGetSelectValues = (params: any) => {
    return params.id % 2 === 0
      ? [
          { value: '1', displayValue: 'one' },
          { value: '2', displayValue: 'two' },
          { value: '3', displayValue: 'three' },
        ]
      : [
          { value: '4', displayValue: 'four' },
          { value: '5', displayValue: 'five' },
          { value: '6', displayValue: 'six' },
        ];
  };

  const handleGetCellClassName = (
    params: GridCellParams<any, any, any, GridTreeNode>
  ) => {
    if (params.field === 'corporationId' && params.value > 2)
      return 'nebiki-nemashi-ari';
    return '';
  };

  const handleLogClick = () => {
    console.log(invalids);
  };

  const handleUpdateClick = () => {
    const isValid = invalids.every((x) => x.ids.length === 0);
    if (isValid) {
      console.log('valid');
    } else {
      console.log('invalid');
    }
  };

  const handleExportCsvClick = () => {
    exportCsv('datagrid.csv', apiRef);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <DataGrid
          columns={columns}
          rows={rows}
          invalids={invalids}
          resolver={validationSchema}
          // width={1200}
          // height={150}
          // columnHeaderHeight={50}
          checkboxSelection
          onInvalidModelChange={handleOnInvalidModelChange}
          getCellReadonly={handleGetCellReadonly}
          getSelectValues={handleGetSelectValues}
          getCellClassName={handleGetCellClassName}
          sx={{
            '& .nebiki-nemashi-ari': {
              backgroundColor: '#b9e7da',
            },
          }}
          apiRef={apiRef}
        />
        <PrimaryButton onClick={handleLogClick}>LOG</PrimaryButton>
        <PrimaryButton onClick={handleUpdateClick}>更新</PrimaryButton>
        <PrimaryButton onClick={handleExportCsvClick}>CSV出力</PrimaryButton>
      </ThemeProvider>
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
      <ThemeProvider theme={theme}>
        <DataGrid
          columns={columns}
          rows={rows}
          showHeaderRow
          headerRow={headerRow}
        />
      </ThemeProvider>
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
      width: 200,
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
      cellType: 'input',
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

  const defaultHeaderRow = {
    soshikiIdOrMeisyo: 0,
    yakushokuIdOrMeisyo: 0,
    teiyoKaishiBi: '',
    teiyoShuryoBi: '',
  };

  const defaultSelectionModel: GridRowSelectionModel = [];

  const [rows, setRows] = useState(defaultRows);
  const [headerRow, setHeaderRow] = useState(defaultHeaderRow);
  const [selection, setSelection] = useState(defaultSelectionModel);

  const handleIkkatsuHaneiClick = () => {
    const headerRow = headerApiRef.current.getRow(-1);
    const newRows = rows.map((x) => {
      if (selection.includes(x.id)) {
        return {
          ...x,
          soshikiIdOrMeisyo: headerRow.soshikiIdOrMeisyo,
          yakushokuIdOrMeisyo: headerRow.yakushokuIdOrMeisyo,
          teiyoKaishiBi: headerRow.teiyoKaishiBi,
          teiyoShuryoBi: headerRow.teiyoShuryoBi,
        };
      } else {
        return x;
      }
    });
    setRows(newRows);
  };

  const handleOnRowValueChange = (row: any) => {
    if (row.id === -1) {
      setHeaderRow(row);
    } else {
      const newRows = rows.map((x) => (x.id === row.id ? row : x));
      setRows(newRows);
    }
  };

  const handleOnRowSelectionModelChange = (
    rowSelectionModel: GridRowSelectionModel
  ) => {
    setSelection(rowSelectionModel);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <DataGrid
          columns={columns}
          rows={rows}
          checkboxSelection
          showHeaderRow
          headerRow={headerRow}
          onRowValueChange={handleOnRowValueChange}
          onRowSelectionModelChange={handleOnRowSelectionModelChange}
          controlled={false}
          apiRef={apiRef}
          headerApiRef={headerApiRef}
        />
      </ThemeProvider>
    </>
  );
};

