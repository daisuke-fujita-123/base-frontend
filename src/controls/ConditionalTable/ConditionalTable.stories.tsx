import { ComponentMeta } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

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

interface ConditionalTableExampleModel {
  conditions: ConditionModel[];
}

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
    { value: 0, displayValue: '' },
    { value: 1, displayValue: '＝' },
    { value: 2, displayValue: '≠' },
    { value: 3, displayValue: '＜' },
    { value: 4, displayValue: '≦' },
    { value: 5, displayValue: '＞' },
    { value: 6, displayValue: '≧' },
  ];

  const conditionKinds: ConditionKind[] = [
    {
      value: '',
      displayValue: '',
    },
    {
      value: 'ITM_PR_001',
      displayValue: '落札金額',
      selectValues: [
        { value: 3000000, displayValue: '3000000' },
        { value: 5000000, displayValue: '5000000' },
        { value: 8000000, displayValue: '8000000' },
        { value: 0, displayValue: '0' },
      ],
    },
    {
      value: 'ITM_PR_002',
      displayValue: '申告コーナー区分',
      selectValues: [
        { value: '998', displayValue: '998' },
        { value: '6', displayValue: 'トラックレンタ・リース' },
        { value: 'Y', displayValue: 'レンタ・リース' },
        { value: 'B', displayValue: '即売り' },
        { value: '999', displayValue: '999' },
        { value: '997', displayValue: '997' },
        { value: 'C', displayValue: 'C' },
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
        { value: 1, displayValue: '大型' },
        { value: 2, displayValue: '中型' },
        { value: 3, displayValue: '小型' },
        { value: 4, displayValue: '対象外' },
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
        { value: 0, displayValue: '有料' },
        { value: 9, displayValue: '無料' },
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

  const defaultValues: ConditionalTableExampleModel = {
    conditions: [
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
    ],
  };

  const validationSchema = yup.object().shape({
    conditions: yup.array().of(
      yup.object().shape({
        conditionKind: yup.string().required().label('条件種類'),
        subConditions: yup.array().of(
          yup.object().shape({
            operator: yup.number().required().label('条件'),
            value: yup.string().required().label('値'),
          })
        ),
      })
    ),
  });

  // state
  const [dataset, setDataset] = useState<PricingTableModel[]>([]);

  // form
  const methods = useForm<ConditionalTableExampleModel>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const { getValues, watch } = methods;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === undefined) return;
      const names = name.split('.');
      // 条件種類の変更検知
      if (names[2] === 'conditionKind') {
        const condition = getValues(`conditions.${Number(names[1])}`);
        console.log(condition);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleOnRefrectClick = () => {
    const conditions = getValues('conditions');
    const dataset = convertFromConditionToPricingTableRows(
      conditions,
      conditionKinds,
      operators
    );
    setDataset(dataset);
  };

  const handleOnCsvExportClick = () => {
    exportCsv('filename.csv', dataset);
  };

  const handleOnCsvImportClick = () => {
    const newDataset = dataset.map((x, i) => {
      return {
        ...x,
        commission: String(10000 + 100 * (i + 1)),
      };
    });
    setDataset(newDataset);
  };

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <ColStack>
          <ConditionalTable
            name='conditions'
            columns={columns}
            conditionKinds={conditionKinds}
            operators={operators}
            reorderable
            adjustableSubConditionCount
          />
          <CenterBox>
            <PrimaryButton onClick={handleOnRefrectClick}>反映</PrimaryButton>
            <PrimaryButton onClick={handleOnCsvExportClick}>
              CSV出力
            </PrimaryButton>
            <PrimaryButton onClick={handleOnCsvImportClick}>
              CSV取込
            </PrimaryButton>
          </CenterBox>
          <PricingTable
            conditions={getValues('conditions')}
            dataset={dataset}
          />
        </ColStack>
      </FormProvider>
    </ThemeProvider>
  );
};

