import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';

import { CenterBox } from 'layouts/Box';
import { ColStack } from 'layouts/Stack';

import { PrimaryButton } from 'controls/Button';
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
  ConditionKind,
  ConditionModel,
  exportCsv,
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

  const conditionKinds: ConditionKind[] = [
    {
      value: 'ITM_PR_001',
      displayValue: '落札金額',
      selectValues: [
        { displayValue: '3000000', value: 3000000 },
        { displayValue: '5000000', value: 5000000 },
        { displayValue: '8000000', value: 8000000 },
        { displayValue: '0', value: 0 },
      ],
    },
    {
      value: 'ITM_PR_002',
      displayValue: '申告コーナー区分',
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
      value: 'ITM_PR_004',
      displayValue: '検査台数(1台出品F)',
    },
    {
      value: 'ITM_PR_005',
      displayValue: 'トラック区分',
      selectValues: [
        { displayValue: '大型', value: 1 },
        { displayValue: '中型', value: 2 },
        { displayValue: '小型', value: 3 },
        { displayValue: '対象外', value: 4 },
      ],
    },
    {
      value: 'ITM_PR_006',
      displayValue: '成約区分',
    },
    {
      value: 'ITM_PR_013',
      displayValue: '再出品F',
    },
    {
      value: 'ITM_PR_014',
      displayValue: '出品料区分',
      selectValues: [
        { displayValue: '有料', value: 0 },
        { displayValue: '無料', value: 9 },
      ],
    },
    {
      value: 'ITM_PR_016',
      displayValue: 'イベント（車種）',
    },
    {
      value: 'ITM_PR_017',
      displayValue: 'デポフラグ',
    },
    {
      value: 'ITM_PR_018',
      displayValue: '開催イベント区分',
    },
  ];

  const initialConditions: ConditionModel[] = [
    {
      conditionKind: 'ITM_PR_004',
      subConditions: [
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
      conditionKind: 'ITM_PR_005',
      subConditions: [
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
      conditionKind: '',
      subConditions: [
        {
          operator: 0,
          value: '',
        },
      ],
    },
  ];

  // state
  const [conditions, setConditions] =
    useState<ConditionModel[]>(initialConditions);
  const [dataset, setDataset] = useState<PricingTableModel[]>([]);

  const handleOnConditionTypeChange = (
    type: string | number,
    index: number
  ) => {
    conditions[index] = {
      conditionKind: type,
      subConditions: [
        {
          operator: '',
          value: '',
        },
      ],
    };
    setConditions([...conditions]);
  };

  const handleOnSubConditionChange = (
    value: string | number,
    index: number,
    subIndex: number,
    field: string
  ) => {
    if (field === 'operator') {
      conditions[index].subConditions[subIndex].operator = value;
    }
    if (field === 'value') {
      conditions[index].subConditions[subIndex].value = value;
    }
    setConditions([...conditions]);
  };

  const handleOnConditionCountChangeClick = (
    operation: string,
    index?: number
  ) => {
    if (operation === 'add') {
      conditions.push({
        conditionKind: '',
        subConditions: [
          {
            operator: '',
            value: '',
          },
        ],
      });
    }
    if (operation === 'remove' && index !== undefined) {
      conditions.splice(index, 1);
    }
    setConditions([...conditions]);
  };

  const handleOnSubConditionCoountChangeClick = (
    index: number,
    operation: string,
    subIndex?: number
  ) => {
    if (operation === 'add') {
      conditions[index].subConditions.push({
        operator: '',
        value: '',
      });
    }
    if (operation === 'remove' && subIndex !== undefined) {
      conditions[index].subConditions.splice(subIndex, 1);
    }
    setConditions([...conditions]);
  };

  const handleOnDrderChangeClick = (index: number, direction: string) => {
    if (direction === 'up') {
      [conditions[index - 1], conditions[index]] = [
        conditions[index],
        conditions[index - 1],
      ];
    }
    if (direction === 'down') {
      [conditions[index + 1], conditions[index]] = [
        conditions[index],
        conditions[index + 1],
      ];
    }
    setConditions([...conditions]);
  };

  const onClickExport = () => {
    exportCsv('filename.csv', dataset, []);
    console.log('exportCSV');
  };

  const handleOnClick = () => {
    console.log(conditions);
    const dataset = convertFromConditionToPricingTableRows(
      conditions,
      conditionKinds,
      operators
    );
    setDataset(dataset);
  };

  return (
    <ThemeProvider theme={theme}>
      <ColStack>
        <ConditionalTable
          columns={columns}
          conditionKinds={conditionKinds}
          operators={operators}
          rows={conditions}
          onConditionKindChange={handleOnConditionTypeChange}
          onSubConditionChange={handleOnSubConditionChange}
          onConditionCountChangeClick={handleOnConditionCountChangeClick}
          onSubConditionCoountChangeClick={
            handleOnSubConditionCoountChangeClick
          }
          onOrderChangeClick={handleOnDrderChangeClick}
          reorderable
          adjustableSubConditionCount
        />
        <CenterBox>
          <PrimaryButton onClick={handleOnClick}>反映</PrimaryButton>
        </CenterBox>
        <PricingTable conditions={initialConditions} dataset={dataset} />
        <CenterBox>
          <PrimaryButton onClick={onClickExport}>CSV出力</PrimaryButton>
        </CenterBox>
      </ColStack>
    </ThemeProvider>
  );
};

