import React from 'react';

import { theme } from 'controls/theme';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton, styled } from '@mui/material';
import Paper from '@mui/material/Paper';
import { default as TableMui } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
  default as TableCellMui,
  tableCellClasses,
} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { default as TableRowMui } from '@mui/material/TableRow';

const TableCell = styled(TableCellMui)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.table.header,
  },
  borderRight: '1px solid',
  borderRightColor: 'rgba(224, 224, 224, 1)',
  fontWeight: 'bold',
  textAlign: 'center',
});

const TableRow = styled(TableRowMui)({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.table.main,
  },
  '&:hover': {
    backgroundColor: theme.palette.table.selected,
  },
  'input[type="checkbok"]:checked': {
    backgroundColor: theme.palette.table.selected,
  },
});

const SetIconButton = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: -2,
});

const StyledIconButton = styled(IconButton)({
  margin: -5,
  padding: 0,
  marginLeft: 'auto',
});

const StyledColmun = styled('div')({
  display: 'flex',
  textAlign: 'center',
  justifyContent: 'space-between',
});

// テーブルのヘッダー情報の格納
export interface TableColDef {
  headerName: string;
  width: number;
}

/**
 * 行データモデル
 */
export interface TableRowModel {
  [key: string]: string | number;
}

export interface TableRowsProp {
  rows: TableRowModel[];
}

/**
 * TableコンポーネントのProps
 */
interface TableProps {
  /**
   * 列の定義情報
   */
  columns: TableColDef[];
  /**
   * 行データ
   */
  rows: TableRowModel[];
}

/**
 * Tableコンポーネント
 * @param props
 * @returns
 */
export const Table = (props: TableProps) => {
  const { columns, rows } = props;

  const handlesort = (sortDirection: string) => {
    console.log(sortDirection);
  };

  return (
    <TableContainer component={Paper}>
      <TableMui>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => {
              return (
                <TableCell key={index} width={column.width}>
                  <StyledColmun>
                    <div style={{ textAlign: 'center' }} />
                    {column.headerName}
                    <SetIconButton>
                      <StyledIconButton onClick={() => handlesort('asc')}>
                        <ArrowDropUpIcon />
                      </StyledIconButton>
                      <StyledIconButton onClick={() => handlesort('desc')}>
                        <ArrowDropDownIcon />
                      </StyledIconButton>
                    </SetIconButton>
                  </StyledColmun>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, indexRow) => {
            return (
              <TableRow key={indexRow}>
                {columns.map((column, indexColumn) => {
                  return (
                    <TableCell key={indexColumn}>
                      {row[column.headerName]}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </TableMui>
    </TableContainer>
  );
};

// テーブルのヘッダー情報の格納
interface CalenderTableCol {
  headerName: string;
  width: string;
}

// テーブルの行情報の格納
interface CalenderTableProps {
  calenderTableCol: CalenderTableCol[];
  calenderTableRow: (string | number | JSX.Element)[][][][];
}
export const CalenderTable = (props: CalenderTableProps) => {
  const { calenderTableCol, calenderTableRow } = props;

  const CalenderTableCell = styled(TableCellMui)({
    borderRight: '1px solid',
    borderRightColor: 'rgba(224, 224, 224, 1)',
  });

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: 2, marginTop: 2 }}>
        <TableMui>
          <TableHead>
            <TableRowMui>
              {calenderTableCol.map((column, index) => {
                return (
                  <CalenderTableCell
                    key={index}
                    width={column.width}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {column.headerName}
                  </CalenderTableCell>
                );
              })}
            </TableRowMui>
          </TableHead>
        </TableMui>
      </TableContainer>
      {calenderTableRow.map((rowVal, index) => (
        <TableContainer component={Paper} sx={{ marginBottom: 4 }} key={index}>
          <TableMui>
            <TableBody key={index}>
              {rowVal.map((col, colIndex) => {
                return (
                  <TableRowMui key={colIndex}>
                    {calenderTableCol.map((column, index) => {
                      return (
                        <CalenderTableCell
                          key={index}
                          width={column.width}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {col[index]}
                        </CalenderTableCell>
                      );
                    })}
                  </TableRowMui>
                );
              })}
            </TableBody>
          </TableMui>
        </TableContainer>
      ))}
    </>
  );
};

