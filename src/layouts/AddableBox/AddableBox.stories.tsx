import { ComponentMeta } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { Section } from 'layouts/Section';
import { RowStack, Stack } from 'layouts/Stack';

import { DeepKey, SetConditionTable } from 'controls/ConditionalTable';
import { Radio } from 'controls/Radio';
import { Select } from 'controls/Select';
import { TableColDef } from 'controls/Table';
import { PriceTextField } from 'controls/TextField';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import {
  AddableBox,
  CommissionFormValues,
  SearchConditionProps,
} from './AddableBox';

export default {
  component: AddableBox,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof AddableBox>;

export const Example = () => {
  const columns: TableColDef[] = [
    { field: 'conditionType', headerName: '条件種類', width: 150 },
    { field: 'conditions', headerName: '条件', width: 100 },
    { field: 'conditionVal', headerName: '値', width: 150 },
  ];

  /**
   * APIから取得した検索データ
   */
  const conditions = [
    { displayValue: '＝', value: 1 },
    { displayValue: '≠', value: 2 },
    { displayValue: '＜', value: 3 },
    { displayValue: '≦', value: 4 },
    { displayValue: '＞', value: 5 },
    { displayValue: '≧', value: 6 },
  ];

  const getItems = [
    {
      displayValue: '落札金額',
      value: 'ITM_PR_001',
      conditions: conditions,
      conditionVal: [
        { displayValue: '3000000', value: 3000000 },
        { displayValue: '5000000', value: 5000000 },
        { displayValue: '8000000', value: 8000000 },
        { displayValue: '0', value: 0 },
      ],
    },
    {
      displayValue: '申告コーナー区分',
      value: 'ITM_PR_002',
      conditions: conditions,
      conditionVal: [
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
      displayValue: '検査台数(1台出品F)',
      value: 'ITM_PR_004',
      conditions: conditions,
      conditionVal: [
        { displayValue: '1台', value: 1 },
        { displayValue: '通常', value: 0 },
      ],
    },
    {
      displayValue: '成約区分',
      value: 'ITM_PR_006',
      conditions: conditions,
      conditionVal: '',
    },
    {
      displayValue: '再出品F',
      value: 'ITM_PR_013',
      conditions: conditions,
      conditionVal: '',
    },
    {
      displayValue: '出品料区分',
      value: 'ITM_PR_014',
      conditions: conditions,
      conditionVal: [
        { displayValue: '有料', value: 0 },
        { displayValue: '無料', value: 9 },
      ],
    },
    {
      displayValue: 'イベント（車種）',
      value: 'ITM_PR_016',
      conditions: conditions,
      conditionVal: '',
    },
    {
      displayValue: 'デポフラグ',
      value: 'ITM_PR_017',
      conditions: conditions,
      conditionVal: '',
    },
    {
      displayValue: '開催イベント区分',
      value: 'ITM_PR_018',
      conditions: conditions,
      conditionVal: '',
    },
  ];

  // 条件種類変更後にAPIより条件、値を取得する
  const handleGetConditionData = (select: string) => {
    return getItems.find((val) => val.value === select) ?? null;
  };

  const initialVal: SearchConditionProps = {
    conditionType: '',
    condition: [
      {
        conditions: 0,
        conditionVal: '',
      },
    ],
  };
  const [rows, setRows] = useState<SearchConditionProps[]>([initialVal]);

  // 値の変更を検知する
  const handleChange = (
    val: string | number,
    changeVal: DeepKey<SearchConditionProps>,
    indexRow: number,
    indexCol?: number
  ) => {
    const newArray: SearchConditionProps[] = rows.map(
      (row: SearchConditionProps, rowIndex: number) => {
        if (changeVal === 'conditionType' && typeof val === 'string') {
          if (rowIndex === indexRow) {
            return { ...row, [changeVal]: val };
          }
          return row;
        } else if (indexCol !== undefined) {
          if (rowIndex === indexRow) {
            const newCondition = row.condition.map(
              (rowCondition, rowConditionIndex) => {
                if (rowConditionIndex === indexCol) {
                  return { ...rowCondition, [changeVal]: val };
                }
                return rowCondition;
              }
            );
            return { ...row, condition: newCondition };
          }
          return row;
        } else {
          return row;
        }
      }
    );

    setRows(newArray);
  };

  const handleSetItem = (sortValues: SearchConditionProps[]) => {
    setRows(sortValues);
  };
  // 明細設定
  const isReadOnly = useState<boolean>(false);

  const fieldInitVal = {
    commissionType: 1,
    productCode: 1,
    priceChange: 0,
    plusMinus: 0,
    price: 0,
  };
  const [datalist, setDatalist] = useState([fieldInitVal]);

  const CommissionMethods = useForm<CommissionFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    context: isReadOnly,
  });

  const control = CommissionMethods.control;

  const { fields, append, remove } = useFieldArray({
    name: 'rows',
    control,
  });

  useEffect(() => {
    CommissionMethods.setValue('rows', datalist);
  }, [CommissionMethods, datalist]);

  // 明細追加
  const handleAddClick = () => {
    try {
      setDatalist((prev) => [...prev, fieldInitVal]);
      append(fieldInitVal);
    } catch (error) {
      console.error(error);
    }
  };

  // 明細削除
  const handleRemoveClick = (index: number) => {
    try {
      setDatalist(datalist.filter((_, i) => index !== i));
      remove(index);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * APIから取得した手数料データ
   */
  const commissionType = [{ displayValue: '出品料', value: 1 }];

  const productCode = [{ displayValue: 'XXXXXXXX', value: 1 }];

  const price = [
    { value: 0, displayValue: '変動金額' },
    { value: 1, displayValue: '変動後の金額' },
  ];

  const plusMinus = [
    { value: 0, displayValue: '+' },
    { value: 1, displayValue: '-' },
  ];
  return (
    <FormProvider {...CommissionMethods}>
      <ThemeProvider theme={theme}>
        <Section name='条件' isTransparent>
          <AddableBox
            handleAddClick={handleAddClick}
            handleRemoveClick={handleRemoveClick}
          >
            {fields.map((val) => (
              <Stack spacing={6} key={val.id}>
                <RowStack>
                  <Select
                    required
                    name='commissionType'
                    label='手数料種類'
                    selectValues={commissionType}
                  ></Select>
                  <Select
                    required
                    name='productCode'
                    label='商品コード'
                    selectValues={productCode}
                  ></Select>
                </RowStack>
                <SetConditionTable
                  columns={columns}
                  getItems={getItems}
                  conditions={conditions}
                  handleChange={handleChange}
                  rows={rows}
                  handleSetItem={handleSetItem}
                  handleGetConditionData={handleGetConditionData}
                  isEditable={false}
                />
                <RowStack spacing={2}>
                  <Radio
                    required
                    name='priceChange'
                    label='値引値増金額'
                    radioValues={price}
                  ></Radio>
                  <Radio name='plusMinus' radioValues={plusMinus} row></Radio>
                  <PriceTextField name='price'></PriceTextField>円
                </RowStack>
              </Stack>
            ))}
          </AddableBox>
        </Section>
      </ThemeProvider>
    </FormProvider>
  );
};

