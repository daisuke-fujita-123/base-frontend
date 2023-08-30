import { ThemeProvider } from '@emotion/react';
import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { SelectValue } from 'controls/Select';
import { theme } from 'controls/theme';

import { PricingTable, PricingTableModel } from './PricingTable';

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

  const dataset: PricingTableModel[] = [
    {
      conditionType: 'ITM_PR_004',
      conditionTypeName: '検査台数(1台出品F)',
      condition: [
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
      conditionType: 'ITM_PR_004',
      conditionTypeName: '検査台数(1台出品F)',
      condition: [
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
      conditionType: 'ITM_PR_005',
      conditionTypeName: 'トラック区分',
      condition: [
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
      conditionType: 'ITM_PR_006',
      conditionTypeName: 'トラック区分2',
      condition: [
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
      conditionType: 'ITM_PR_006',
      conditionTypeName: 'トラック区分2',
      condition: [
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

  return (
    <ThemeProvider theme={theme}>
      <PricingTable dataset={dataset} operators={operators} />
    </ThemeProvider>
  );
};
