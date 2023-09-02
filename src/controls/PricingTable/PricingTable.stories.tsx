import { ThemeProvider } from '@emotion/react';
import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { ConditionKind, ConditionModel } from 'controls/ConditionalTable';
import { SelectValue } from 'controls/Select';
import { theme } from 'controls/theme';

import {
  convertFromConditionToPricingTableRows,
  PricingTable,
  PricingTableModel,
} from './PricingTable';

export default {
  component: PricingTable,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof PricingTable>;

export const Example = () => {
  const operators: SelectValue[] = [
    { displayValue: '＝', value: 1 },
    { displayValue: '≠', value: 2 },
    { displayValue: '＜', value: 3 },
    { displayValue: '≦', value: 4 },
    { displayValue: '＞', value: 5 },
    { displayValue: '≧', value: 6 },
  ];

  const conditionTypes: ConditionKind[] = [
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

  const conditions: ConditionModel[] = [
    {
      conditionKind: 'ITM_PR_004',
      subConditions: [
        {
          operator: 1,
          value: '1111',
        },
        {
          operator: 2,
          value: '2222',
        },
        {
          operator: 3,
          value: '3333',
        },
      ],
    },
    {
      conditionKind: 'ITM_PR_004',
      subConditions: [
        {
          operator: 1,
          value: '1111',
        },
        {
          operator: 2,
          value: '2222',
        },
        {
          operator: 3,
          value: '3333',
        },
      ],
    },
    {
      conditionKind: 'ITM_PR_005',
      subConditions: [
        {
          operator: 1,
          value: '1111',
        },
        {
          operator: 2,
          value: '2222',
        },
        {
          operator: 3,
          value: '3333',
        },
        {
          operator: 4,
          value: '4444',
        },
      ],
    },
    {
      conditionKind: 'ITM_PR_006',
      subConditions: [
        {
          operator: 1,
          value: '1111',
        },
        {
          operator: 2,
          value: '2222',
        },
      ],
    },
    {
      conditionKind: 'ITM_PR_006',
      subConditions: [
        {
          operator: 1,
          value: '1111',
        },
        {
          operator: 2,
          value: '2222',
        },
      ],
    },
  ];

  const rows: PricingTableModel[] = convertFromConditionToPricingTableRows(
    conditions,
    conditionTypes,
    operators
  );

  return (
    <ThemeProvider theme={theme}>
      <PricingTable
        conditions={conditions}
        dataset={rows}
        conditionTypes={conditionTypes}
        operators={operators}
      />
    </ThemeProvider>
  );
};
