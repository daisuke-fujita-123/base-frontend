import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { CenterBox } from 'layouts/Box';
import { RowStack, Stack } from 'layouts/Stack';

import { PrimaryButton } from 'controls/Button';
import {
  ConditionalTable,
  ConditionKind,
  ConditionModel,
} from 'controls/ConditionalTable';
import { Radio } from 'controls/Radio';
import { Select, SelectValue } from 'controls/Select';
import { TableColDef } from 'controls/Table';
import { PriceTextField } from 'controls/TextField';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';

import { AddableBox } from './AddableBox';

export default {
  component: AddableBox,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof AddableBox>;

interface FormModel {
  conditions: {
    commissionType: number;
    productCode: number;
    priceChange: number;
    plusMinus: number;
    price: number;
  }[];
}

export const Example = () => {
  const columns: TableColDef[] = [
    { field: 'conditionType', headerName: '条件種類', width: 150 },
    { field: 'conditions', headerName: '条件', width: 100 },
    { field: 'conditionVal', headerName: '値', width: 150 },
  ];

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
      selectValues: [
        { displayValue: '1台', value: 1 },
        { displayValue: '通常', value: 0 },
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

  /**
   * APIから取得した手数料データ
   */
  const commissionType = [
    { displayValue: '出品料', value: 1 },
    { displayValue: '????', value: 2 },
  ];
  const productCode = [
    { displayValue: 'XXXXXXXX', value: 1 },
    { displayValue: '????', value: 2 },
  ];
  const price = [
    { value: 0, displayValue: '変動金額' },
    { value: 1, displayValue: '変動後の金額' },
  ];
  const plusMinus = [
    { value: 0, displayValue: '+' },
    { value: 1, displayValue: '-' },
  ];

  const formInitialValues: FormModel = {
    conditions: [
      {
        commissionType: 1,
        productCode: 1,
        priceChange: 0,
        plusMinus: 0,
        price: 0,
      },
    ],
  };
  const conditionInitialValues: ConditionModel[][] = [
    [
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
  ];

  // state
  const [datalist, setDatalist] = useState<FormModel>(formInitialValues);
  const [rows, setRows] = useState<ConditionModel[][]>(conditionInitialValues);

  // form
  const methods = useForm<FormModel>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: formInitialValues,
    context: false,
  });
  const arrayMethods = useFieldArray({
    name: 'conditions',
    control: methods.control,
  });

  // 明細追加
  const handleAddClick = () => {
    rows.push([
      {
        conditionKind: '',
        subConditions: [
          {
            operator: 0,
            value: '',
          },
        ],
      },
    ]);
    setRows([...rows]);
    arrayMethods.append({
      commissionType: 1,
      productCode: 1,
      priceChange: 0,
      plusMinus: 0,
      price: 0,
    });
  };

  // 明細削除
  const handleRemoveClick = (index: number) => {
    arrayMethods.remove(index);
    rows.splice(index, 1);
    setRows([...rows]);
  };

  const handleOnConditionTypeChange = (
    boxIndex: number,
    kind: string | number,
    index: number
  ) => {
    rows[boxIndex][index] = {
      conditionKind: kind,
      subConditions: [
        {
          operator: '',
          value: '',
        },
      ],
    };
    setRows([...rows]);
  };

  const handleOnSubConditionChange = (
    boxIndex: number,
    value: string | number,
    index: number,
    subIndex: number,
    field: string
  ) => {
    if (field === 'operator') {
      rows[boxIndex][index].subConditions[subIndex].operator = value;
    }
    if (field === 'value') {
      rows[boxIndex][index].subConditions[subIndex].value = value;
    }
    setRows([...rows]);
  };

  const handleOnConditionCountChangeClick = (
    boxIndex: number,
    operation: string,
    index?: number
  ) => {
    if (operation === 'add') {
      rows[boxIndex].push({
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
      rows[boxIndex].splice(index, 1);
    }
    setRows([...rows]);
  };

  const handleOnSubConditionCoountChangeClick = (
    boxIndex: number,
    index: number,
    operation: string,
    subIndex?: number
  ) => {
    if (operation === 'add') {
      rows[boxIndex][index].subConditions.push({
        operator: '',
        value: '',
      });
    }
    if (operation === 'remove' && subIndex !== undefined) {
      rows[boxIndex][index].subConditions.splice(subIndex, 1);
    }
    setRows([...rows]);
  };

  const handleOnClick = () => {
    console.log(methods.getValues());
    console.log(rows);
  };

  return (
    <FormProvider {...methods}>
      <ThemeProvider theme={theme}>
        <AddableBox
          handleAddClick={handleAddClick}
          handleRemoveClick={handleRemoveClick}
        >
          {arrayMethods.fields.map((val, i) => (
            <Stack spacing={6} key={i}>
              <RowStack>
                <Select
                  required
                  name={`conditions.${i}.commissionType`}
                  label='手数料種類'
                  selectValues={commissionType}
                />
                <Select
                  required
                  name={`conditions.${i}.productCode`}
                  label='商品コード'
                  selectValues={productCode}
                />
              </RowStack>
              <ConditionalTable
                columns={columns}
                conditionKinds={conditionKinds}
                operators={operators}
                rows={rows[i]}
                onConditionKindChange={(kind, index) =>
                  handleOnConditionTypeChange(i, kind, index)
                }
                onSubConditionChange={(value, index, subIndex, field) =>
                  handleOnSubConditionChange(i, value, index, subIndex, field)
                }
                onConditionCountChangeClick={(operation, index) =>
                  handleOnConditionCountChangeClick(i, operation, index)
                }
                onSubConditionCoountChangeClick={(index, operation, subIndex) =>
                  handleOnSubConditionCoountChangeClick(
                    i,
                    index,
                    operation,
                    subIndex
                  )
                }
              />
              <RowStack spacing={2}>
                <Radio
                  required
                  name={`conditions.${i}.priceChange`}
                  label='値引値増金額'
                  radioValues={price}
                />
                <Radio
                  name={`conditions.${i}.plusMinus`}
                  radioValues={plusMinus}
                />
                <PriceTextField name={`conditions.${i}.price`} />円
              </RowStack>
            </Stack>
          ))}
        </AddableBox>
        <CenterBox>
          <PrimaryButton onClick={handleOnClick}>log</PrimaryButton>
        </CenterBox>
      </ThemeProvider>
    </FormProvider>
  );
};

