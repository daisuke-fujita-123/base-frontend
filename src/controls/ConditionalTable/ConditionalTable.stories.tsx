import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';

import { CenterBox, MarginBox } from 'layouts/Box';
import { ColStack } from 'layouts/Stack';

import { PrimaryButton } from 'controls/Button';
import { Icon } from 'controls/Icon';
import {
  convertFromConditionToPricingTableRows,
  PricingTable,
  PricingTableModel,
} from 'controls/PricingTable';
import { SelectValue } from 'controls/Select';
import { TableColDef } from 'controls/Table';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material';

import {
  ConditionalTable,
  ConditionModel,
  ConditionType,
  DeepKey,
} from './ConditionalTable';

export default {
  component: ConditionalTable,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof ConditionalTable>;

export const Example = () => {
  const columns: TableColDef[] = [
    { field: 'conditionType', headerName: '条件種類', width: 150 },
    { field: 'conditions', headerName: '条件', width: 80 },
    { field: 'conditionVal', headerName: '値', width: 200 },
  ];

  /**
   * APIから取得した検索データ
   */
  const operators: SelectValue[] = [
    { displayValue: '＝', value: 1 },
    { displayValue: '≠', value: 2 },
    { displayValue: '＜', value: 3 },
    { displayValue: '≦', value: 4 },
    { displayValue: '＞', value: 5 },
    { displayValue: '≧', value: 6 },
  ];

  const conditionTypes: ConditionType[] = [
    {
      type: 'ITM_PR_001',
      typeName: '落札金額',
      selectValues: [
        { displayValue: '3000000', value: 3000000 },
        { displayValue: '5000000', value: 5000000 },
        { displayValue: '8000000', value: 8000000 },
        { displayValue: '0', value: 0 },
      ],
    },
    {
      type: 'ITM_PR_002',
      typeName: '申告コーナー区分',
      selectValues: [
        { displayValue: '998', value: '998' },
        { displayValue: 'トラックレンタ・リース', value: '6' },
        { displayValue: 'レンタ・リース', value: 'Y' },
        { displayValue: '即売り', value: 'B' },
        { displayValue: '999', value: '999' },
        { displayValue: '997', value: '997' },
        { displayValue: 'C', value: 'C' },
        { displayValue: 'x', value: 'x' },
        { displayValue: 'A', value: 'A' },
      ],
    },
    {
      type: 'ITM_PR_004',
      typeName: '検査台数(1台出品F)',
    },
    {
      type: 'ITM_PR_005',
      typeName: 'トラック区分',
      selectValues: [
        { displayValue: '大型', value: 1 },
        { displayValue: '中型', value: 2 },
        { displayValue: '小型', value: 3 },
        { displayValue: '対象外', value: 4 },
      ],
    },
    {
      type: 'ITM_PR_006',
      typeName: '成約区分',
    },
    {
      type: 'ITM_PR_013',
      typeName: '再出品F',
    },
    {
      type: 'ITM_PR_014',
      typeName: '出品料区分',
      selectValues: [
        { displayValue: '有料', value: 0 },
        { displayValue: '無料', value: 9 },
      ],
    },
    {
      type: 'ITM_PR_016',
      typeName: 'イベント（車種）',
    },
    {
      type: 'ITM_PR_017',
      typeName: 'デポフラグ',
    },
    {
      type: 'ITM_PR_018',
      typeName: '開催イベント区分',
    },
  ];

  const initialRows: ConditionModel[] = [
    {
      conditionType: 'ITM_PR_004',
      condition: [
        {
          operator: 1,
          value: '1',
        },
        {
          operator: 1,
          value: '2',
        },
      ],
    },
    {
      conditionType: 'ITM_PR_005',
      condition: [
        {
          operator: 1,
          value: '1',
        },
        {
          operator: 2,
          value: '2',
        },
        {
          operator: 3,
          value: '3',
        },
        {
          operator: 4,
          value: '4',
        },
      ],
    },
    {
      conditionType: '',
      condition: [
        {
          operator: 0,
          value: '',
        },
      ],
    },
  ];

  // state
  const [rows, setRows] = useState<ConditionModel[]>(initialRows);
  const [dataset, setDataset] = useState<PricingTableModel[]>([]);
  // const [pricingTableVisible, setPricingTableVisible] =
  //   useState<boolean>(false);

  // 条件種類変更後にAPIより条件、値を取得する
  const handleGetConditionData = (select: string) => {
    return conditionTypes.find((val) => val.type === select) ?? null;
  };

  // 値の変更を検知する
  const handleOnValueChange = (
    val: string | number,
    changeVal: DeepKey<ConditionModel>,
    indexRow: number,
    indexCol?: number
  ) => {
    if (changeVal === 'conditionType') {
      rows[indexRow][changeVal] = val;
    }
    if (changeVal === 'operator' && indexCol !== undefined) {
      rows[indexRow].condition[indexCol][changeVal] = val;
      setRows(rows);
    }
    if (changeVal === 'value' && indexCol !== undefined) {
      rows[indexRow].condition[indexCol][changeVal] = val;
    }
    setRows([...rows]);
  };

  const handleSetItem = (sortValues: ConditionModel[]) => {
    setRows(sortValues);
  };

  // const handleVisibleTable = () => {
  //   setPricingTableVisible(!pricingTableVisible);
  // };

  const onClickExport = () => {
    console.log('exportCSV');
  };

  const handleOnClick = () => {
    console.log(rows);
    const dataset = convertFromConditionToPricingTableRows(rows, operators);
    setDataset(dataset);
  };

  // const changeCodeToValue = (code: string | number): string => {
  //   for (const r of conditionTypes) {
  //     if (r.type === code) {
  //       return r.typeName;
  //     }
  //     if (r.operators) {
  //       for (const c of r.operators) {
  //         if (c.value === Number(code)) {
  //           return c.displayValue;
  //         }
  //       }
  //     }
  //     if (typeof r.selectValues === 'string') {
  //       return String(code);
  //     } else if (r.selectValues) {
  //       for (const v of r.selectValues) {
  //         if (v?.value === code) {
  //           return v.displayValue;
  //         }
  //       }
  //     }
  //   }
  //   return '';
  // };

  const decoration = (
    <MarginBox mr={5} gap={2}>
      <Icon iconName='一括登録' iconType='import' onClick={onClickExport} />
      <Icon iconName='CSV出力' iconType='export' onClick={onClickExport} />
    </MarginBox>
  );

  return (
    <ThemeProvider theme={theme}>
      <ColStack>
        <ConditionalTable
          columns={columns}
          conditionTypes={conditionTypes}
          operators={operators}
          rows={rows}
          onValueChange={handleOnValueChange}
          handleSetItem={handleSetItem}
          // handleVisibleTable={handleVisibleTable}
          handleGetConditionData={handleGetConditionData}
          // readOnly={true}
        />
        <CenterBox>
          <PrimaryButton onClick={handleOnClick}>反映</PrimaryButton>
        </CenterBox>
        <PricingTable
          conditions={rows}
          dataset={dataset}
          conditionTypes={conditionTypes}
          operators={operators}
        />
        <CenterBox>
          <PrimaryButton onClick={handleOnClick}>CSV出力</PrimaryButton>
        </CenterBox>
      </ColStack>
    </ThemeProvider>
  );
};

