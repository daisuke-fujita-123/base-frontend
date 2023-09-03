import React from 'react';

import { ConditionKind, ConditionModel } from 'controls/ConditionalTable';
import { SelectValue } from 'controls/Select';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export interface PricingTableModel {
  [key: string]: string | number;
  // kind1?: string;
  // operator1?: string;
  // value1?: string;
  // kind2?: string;
  // operator2?: string;
  // value2?: string;
  // kind3?: string;
  // operator3?: string;
  // value3?: string;
  // kind4?: string;
  // operator4?: string;
  // value4?: string;
  // kind5?: string;
  // operator5?: string;
  // value5?: string;
  // kind6?: string;
  // operator6?: string;
  // value6?: string;
  // kind7?: string;
  // operator7?: string;
  // value7?: string;
  // kind8?: string;
  // operator8?: string;
  // value8?: string;
  // kind9?: string;
  // operator9?: string;
  // value9?: string;
  // kind10?: string;
  // operator10?: string;
  // value10?: string;
  commission: string;
}

export const convertFromConditionToPricingTableRows = (
  conditions: ConditionModel[],
  conditionKinds: ConditionKind[],
  operators: SelectValue[]
): PricingTableModel[] => {
  // 条件の組み合わせの数
  const rowCount = conditions.reduce(
    (prev, curr) => prev * curr.subConditions.length,
    1
  );
  // 条件の組み合わせの数分の配列を確保
  const tempRows: any[][] = [];
  for (let i = 0; i < rowCount; i++) {
    tempRows.push([]);
  }
  // 各条件の中の条件の数
  const conditionCounts = conditions.map((x) => x.subConditions.length);
  // 先頭の条件から順番に配列に格納
  conditions.forEach((x, i) => {
    if (
      x.conditionKind === '' ||
      x.subConditions[0].operator === '' ||
      x.subConditions[0].value === ''
    )
      return;

    const tail = conditionCounts.concat();
    const head = tail.splice(0, i);
    tail.splice(0, 1);

    const headCount =
      head.length > 0 ? head.reduce((prev, curr) => prev * curr, 1) : 1;
    const tailCount =
      tail.length > 0 ? tail.reduce((prev, curr) => prev * curr, 1) : 1;

    // 後続の条件の組み合わせ数から、条件が列方向に何回連続するのかを考慮しながら格納
    const kind = conditionKinds.find((e) => e.value === x.conditionKind);
    for (let j = 0; j < headCount; j++) {
      x.subConditions.forEach((y, k) => {
        const operator = operators.find((e) => e.value === y.operator);
        for (let l = 0; l < tailCount; l++) {
          let value = y.value as string;
          if (kind?.selectValues !== undefined) {
            const selectValue = kind.selectValues.find(
              (e) => e.value === Number(y.value)
            );
            value = selectValue?.displayValue ? selectValue.displayValue : '';
          }
          tempRows[
            j * x.subConditions.length * tailCount + k * tailCount + l
          ].push(kind?.displayValue, operator?.displayValue, value);
        }
      });
    }
  });

  const rows: PricingTableModel[] = tempRows.map((x, i) => {
    return {
      kind1: x[0],
      operator1: x[1],
      value1: x[2],
      kind2: x[3],
      operator2: x[4],
      value2: x[5],
      kind3: x[6],
      operator3: x[7],
      value3: x[8],
      kind4: x[9],
      operator4: x[10],
      value4: x[11],
      kind5: x[12],
      operator5: x[13],
      value5: x[14],
      kind6: x[15],
      operator6: x[16],
      value6: x[17],
      kind7: x[18],
      operator7: x[19],
      value7: x[20],
      kind8: x[21],
      operator8: x[22],
      value8: x[23],
      kind9: x[24],
      operator9: x[25],
      value9: x[26],
      kind10: x[27],
      operator10: x[28],
      value10: x[29],
      commission: '10,000',
    };
  });

  return rows;
};

/**
 * PricingTableコンポーネントのProps
 */
export interface PricingTableProps {
  conditions: ConditionModel[];
  dataset: PricingTableModel[];
}

/**
 * PricingTableコンポーネント
 */
export const PricingTable = (props: PricingTableProps) => {
  const { conditions, dataset } = props;

  // 各条件の中の条件の数
  const conditionCounts = conditions.map((x) => x.subConditions.length);

  const getRowSpan = (rowIdx: number, columnIdx: number) => {
    const tail = conditionCounts.concat();
    const idx = columnIdx % 2 !== 0 ? (columnIdx - 1) / 2 : columnIdx / 2;
    const head = tail.splice(0, idx);
    tail.splice(0, 1);

    const tailCount =
      tail.length > 0 ? tail.reduce((prev, curr) => prev * curr, 1) : 1;

    return tailCount;
  };

  const shouldGenerateCell = (rowIdx: number, columnIdx: number) => {
    const tail = conditionCounts.concat();
    const idx = columnIdx % 2 !== 0 ? (columnIdx - 1) / 2 : columnIdx / 2;
    const head = tail.splice(0, idx);
    tail.splice(0, 1);

    const tailCount =
      tail.length > 0 ? tail.reduce((prev, curr) => prev * curr, 1) : 1;

    return rowIdx % tailCount === 0;
  };

  const cellSx = {
    padding: 0,
    border: 'solid',
    borderWidth: 1,
  };

  if (dataset.length === 0) return <></>;

  return (
    <TableContainer component={Box}>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(dataset[0])
              .filter((x) => x.includes('kind'))
              .map((x, i) => {
                return (
                  <>
                    {dataset[0][x] !== undefined && (
                      <TableCell key={i} colSpan={2} sx={cellSx}>
                        条件{i + 1}
                      </TableCell>
                    )}
                  </>
                );
              })}
            <TableCell rowSpan={2} sx={cellSx}>
              手数料
            </TableCell>
          </TableRow>
          <TableRow>
            {Object.keys(dataset[0])
              .filter((x) => x.includes('kind'))
              .map((x, i) => {
                return (
                  <>
                    {dataset[0][x] !== undefined && (
                      <TableCell key={i} colSpan={2} sx={cellSx}>
                        {dataset[0][x]}
                      </TableCell>
                    )}
                  </>
                );
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataset.map((x, i) => (
            <TableRow key={i}>
              <>
                {Object.keys(x)
                  .filter((y) => y.includes('operator') || y.includes('value'))
                  .map((y, j) => {
                    return (
                      <>
                        {x[y] !== undefined && shouldGenerateCell(i, j) && (
                          <TableCell
                            key={j}
                            rowSpan={getRowSpan(i, j)}
                            sx={cellSx}
                          >
                            {x[y]}
                          </TableCell>
                        )}
                      </>
                    );
                  })}
                <TableCell sx={cellSx}>{x.commission}</TableCell>
              </>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
