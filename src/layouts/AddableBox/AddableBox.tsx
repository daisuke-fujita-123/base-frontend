import React, { ReactNode } from 'react';

import {
  CenterBox,
  ContentsBox,
  LeftBox,
  MarginBox,
  RightBox,
} from 'layouts/Box';
import { Stack } from 'layouts/Stack';

import { AddButton, ClearButton } from 'controls/Button';
import { Typography } from 'controls/Typography';

/**
 * 行データモデル
 */
interface ConditionVal {
  displayValue: string;
  value: string | number;
}

export interface TableRowModel {
  id: number;
  displayValue: string;
  value: string;
  condition: {
    conditions: ConditionVal[];
    conditionVal: ConditionVal[] | string;
  }[];
}

/**
 * 検索条件データモデル
 */
export interface SearchConditionProps {
  conditionType: string;
  condition: {
    conditions: number;
    conditionVal: string | number;
  }[];
}

export interface CommissionFormValues {
  rows: {
    commissionType: number;
    productCode: number;
    priceChange: number;
    plusMinus: number;
    price: number;
  }[];
}

/**
 * TableコンポーネントのProps
 */
interface TableProps {
  /**
   * 呼び出し元より渡されるデータ
   */
  children: ReactNode[];
  /**
   * 明細追加
   */
  handleAddClick: () => void;
  /**
   * 明細削除
   */
  handleRemoveClick: (index: number) => void;
}

/**
 * Tableコンポーネント
 * @param props
 * @returns
 */
export const AddableBox = (props: TableProps) => {
  const { children, handleAddClick, handleRemoveClick } = props;

  return (
    <>
      {children.map((child: ReactNode, index: number) => (
        <ContentsBox key={child?.toString()}>
          <RightBox>
            <ClearButton onClick={() => handleRemoveClick(index)} />
          </RightBox>
          <LeftBox>
            <MarginBox ml={2} mr={2} textAlign='start'>
              <Stack>
                <Typography bold variant='h5'>
                  明細{index + 1}
                </Typography>
                {child}
              </Stack>
            </MarginBox>
          </LeftBox>
        </ContentsBox>
      ))}
      <CenterBox>
        <AddButton onClick={handleAddClick}>明細追加</AddButton>
      </CenterBox>
    </>
  );
};

