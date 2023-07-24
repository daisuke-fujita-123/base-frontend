import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { Section } from 'layouts/Section';

import { Icon } from 'controls/Icon';

import {
  ConditionalTable,
  DeepKey,
  PricingTable,
  SearchConditionProps,
  TableColDef,
} from './ConditionalTable';

export default {
  component: ConditionalTable,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof ConditionalTable>;

export const Example = () => {
  const columns: TableColDef[] = [
    { headerName: '条件種類', width: 150 },
    { headerName: '条件', width: 100 },
    { headerName: '値', width: 150 },
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

  const rows = [
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
    return rows.find((val) => val.value === select) ?? null;
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
  const [searchCondition, setSearchCondition] = useState<
    SearchConditionProps[]
  >([initialVal]);

  // 値の変更を検知する
  const handleChange = (
    val: string | number,
    changeVal: DeepKey<SearchConditionProps>,
    indexRow: number,
    indexCol?: number
  ) => {
    const newArray: SearchConditionProps[] = searchCondition.map(
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

    setSearchCondition(newArray);
  };

  const handleSetItem = (sortValues: SearchConditionProps[]) => {
    setSearchCondition(sortValues);
  };

  const [pricingTableVisible, setPricingTableVisible] =
    useState<boolean>(false);

  const handleVisibleTable = () => {
    setPricingTableVisible(!pricingTableVisible);
  };
  const onClickExport = () => {
    console.log('exportCSV');
  };

  const changeCodeToValue = (code: string | number): string => {
    for (const r of rows) {
      if (r.value === code) {
        return r.displayValue;
      }
      if (r.conditions) {
        for (const c of r.conditions) {
          if (c.value === Number(code)) {
            return c.displayValue;
          }
        }
      }
      if (typeof r.conditionVal === 'string') {
        return String(code);
      } else if (r.conditionVal) {
        for (const v of r.conditionVal) {
          if (v?.value === code) {
            return v.displayValue;
          }
        }
      }
    }
    return '';
  };
  const decoration = (
    <MarginBox mr={5} gap={2}>
      <Icon iconName='一括登録' iconType='import' onClick={onClickExport} />
      <Icon iconName='CSV出力' iconType='export' onClick={onClickExport} />
    </MarginBox>
  );
  return (
    <>
      <Section name='条件設定'>
        <ConditionalTable
          columns={columns}
          rows={rows}
          conditions={conditions}
          handleChange={handleChange}
          searchCondition={searchCondition}
          handleSetItem={handleSetItem}
          handleVisibleTable={handleVisibleTable}
          handleGetConditionData={handleGetConditionData}
        />
      </Section>
      {pricingTableVisible && (
        <Section name='価格設定' decoration={decoration}>
          <PricingTable
            setCondition={searchCondition}
            changeCodeToValue={changeCodeToValue}
            handleVisibleTable={handleVisibleTable}
          />
        </Section>
      )}
    </>
  );
};

