import React from 'react';

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

export interface PricingTableColDef {
  typeName: string;
}

export interface PricingTableModel {
  conditionType: string | number;
  conditionTypeName: string;
  condition: {
    operator: string | number;
    value: string | number;
  }[];
}

/**
 * PricingTableコンポーネントのProps
 */
export interface PricingTableProps {
  dataset: PricingTableModel[];
  operators: SelectValue[];
}

/**
 * PricingTableコンポーネント
 */
export const PricingTable = (props: PricingTableProps) => {
  const { dataset, operators } = props;

  // 条件の組み合わせの数
  const rowCount = dataset.reduce(
    (prev, curr) => prev * curr.condition.length,
    1
  );
  // 条件の組み合わせの数分の配列を確保
  const rows: any[][] = [];
  for (let i = 0; i < rowCount; i++) {
    rows.push([]);
  }
  // 各条件の中の条件の数
  const conditionCounts = dataset.map((x) => x.condition.length);
  // 先頭の条件から順番に配列に格納
  dataset.forEach((x, i) => {
    const tail = conditionCounts.concat();
    const head = tail.splice(0, i);
    tail.splice(0, 1);

    const headCount =
      head.length > 0 ? head.reduce((prev, curr) => prev * curr, 1) : 1;
    const tailCount =
      tail.length > 0 ? tail.reduce((prev, curr) => prev * curr, 1) : 1;

    // 後続の条件の組み合わせ数から、条件が列方向に何回連続するのかを考慮しながら格納
    for (let j = 0; j < headCount; j++) {
      x.condition.forEach((y, k) => {
        for (let l = 0; l < tailCount; l++) {
          const operator = operators.find((e) => e.value === y.operator);
          rows[j * x.condition.length * tailCount + k * tailCount + l].push(
            operator?.displayValue,
            y.value
          );
        }
      });
    }
  });

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

  return (
    <TableContainer component={Box}>
      <Table>
        <TableHead>
          <TableRow>
            {dataset.map((x, i) => (
              <TableCell key={i} colSpan={2} sx={cellSx}>
                条件{i + 1}
              </TableCell>
            ))}
            <TableCell rowSpan={2} sx={cellSx}>
              手数料
            </TableCell>
          </TableRow>
          <TableRow>
            {dataset.map((x, i) => (
              <TableCell key={i} colSpan={2} sx={cellSx}>
                {x.conditionTypeName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((x, i) => (
            <TableRow key={i}>
              {x.map((y, j) => (
                <>
                  {shouldGenerateCell(i, j) && (
                    <TableCell key={j} rowSpan={getRowSpan(i, j)} sx={cellSx}>
                      {y}
                    </TableCell>
                  )}
                </>
              ))}
              <TableCell sx={cellSx}>10,000</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
