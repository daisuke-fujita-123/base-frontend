import React, { useState } from 'react';

import { CenterBox, RightBox } from 'layouts/Box';

import { AddButton, AddIconButton, RemoveIconButton } from 'controls/Button';
import { RequiredLabel } from 'controls/Label';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton, styled } from '@mui/material';
import { default as TableMui } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
  default as TableCellMui,
  tableCellClasses,
} from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { default as TableRowMui } from '@mui/material/TableRow';
import { DeepKey, SearchConditionProps } from './ConditionalTable.stories';

const TableCell = styled(TableCellMui)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.table.header,
    textAlign: 'center',
  },
  borderRight: '1px solid',
  borderRightColor: 'rgba(224, 224, 224, 1)',
  fontWeight: 'bold',
  textAlign: 'center',
});

const TableLeftHeader = styled(TableCellMui)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'transparent',
  },
  backgroundColor: theme.palette.table.header,
  borderRight: '1px solid',
  borderRightColor: 'rgba(224, 224, 224, 1)',
  fontWeight: 'bold',
  textAlign: 'center',
});

const TableRow = styled(TableRowMui)({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.table.main,
  },
  'input[type="checkbok"]:checked': {
    backgroundColor: theme.palette.table.selected,
  },
});

const StyledIconButton = styled(IconButton)({
  margin: -5,
  padding: 0,
  marginLeft: 'auto',
});

const SetIconButton = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: -2,
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
interface ConditionProps {
  displayValue: string;
  value: string;
  conditions: ConditionVal[];
  conditionVal: ConditionVal[] | string;
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
  rows: ConditionProps[];
  /**
   * 条件式データ
   */
  conditions: ConditionVal[];

  /**
   * 条件追加関数
   */
  handleChange: (
    val: string | number,
    changeVal: DeepKey<SearchConditionProps>,
    indexRow: number,
    indexCol?: number
  ) => void;

  /**
   * テーブル表示内容
   */
  searchCondition: SearchConditionProps[];

  /**
   * テーブル行変更
   */
  handleSetItem: (val: SearchConditionProps[]) => void;

  /**
   * 価格設定テーブル表示
   */
  handleVisibleTable: () => void;
}

/**
 * Tableコンポーネント
 * @param props
 * @returns
 */
export const ConditionalTable = (props: TableProps) => {
  const {
    columns,
    rows,
    conditions,
    handleChange,
    searchCondition,
    handleSetItem,
    handleVisibleTable,
  } = props;

  // 検索条件格納
  const initialValCondition = {
    conditions: conditions,
    conditionVal: '',
  };
  const initialVal = {
    id: 0,
    displayValue: '',
    value: '',
    condition: [initialValCondition],
  };
  const [tableData, setTableData] = useState<TableRowModel[]>([initialVal]);

  // 検索条件・テーブル行追加
  const onClickRow = () => {
    const addId = tableData.length;
    const newArray = tableData.concat(initialVal).map((row, index) => {
      if (addId === index) {
        return { ...row, id: addId };
      }
      return row;
    });
    setTableData(newArray);
    const newItem = searchCondition.concat({
      conditionType: '',
      condition: [
        {
          conditions: 0,
          conditionVal: '',
        },
      ],
    });
    handleSetItem(newItem);
  };

  // 検索条件（セル内）追加
  const onClickCondition = (indexRow: number) => {
    const newArray: TableRowModel[] = tableData.map((val, index) => {
      if (indexRow === index) {
        const newVal = {
          ...val,
          condition: val.condition.concat(val.condition),
        };
        return newVal;
      } else {
        return { ...val };
      }
    });
    setTableData(newArray);
    const newItem = searchCondition.map((val, index) => {
      if (indexRow === index) {
        const addSearchCondition = val.condition.concat({
          conditions: 0,
          conditionVal: '',
        });
        return { ...val, condition: addSearchCondition };
      } else {
        return val;
      }
    });
    handleSetItem(newItem);
  };

  // 検索条件（セル内）削除
  const onClickConditionRemove = (indexCol: number) => {
    setTableData(
      tableData.map((val) => {
        return {
          ...val,
          condition: val.condition.filter((_, index) => index !== indexCol),
        };
      })
    );
    handleSetItem(
      searchCondition.map((val) => {
        return {
          ...val,
          condition: val.condition.filter((_, index) => index !== indexCol),
        };
      })
    );
  };

  // テーブル行削除
  const onClickRowRemove = (indexRow: number) => {
    setTableData(tableData.filter((_, index) => index !== indexRow));
    handleSetItem(searchCondition.filter((_, index) => index !== indexRow));
  };

  // 検索条件更新
  const onChangeRow = (select: string, indexRow: number) => {
    const newCondition = rows.find((val) => val.value === select);
    const conditionVal: TableRowModel = {
      id: indexRow,
      displayValue: newCondition?.displayValue ?? '',
      value: newCondition?.value ?? '',
      condition: [
        {
          conditions: newCondition?.conditions ?? conditions,
          conditionVal: newCondition?.conditionVal ?? '',
        },
      ],
    };
    const setCondition = tableData.map((row) => {
      if (row.id === indexRow) {
        return { ...row, ...conditionVal };
      }
      return row;
    });
    setTableData(setCondition);
  };

  // 検索条件・テーブルソート
  const handleSortValue = (sortDirection: string, row: number) => {
    const sortTable = [...tableData];
    const sortItem = [...searchCondition];

    if (sortDirection === 'up') {
      [sortTable[row], sortTable[row - 1]] = [
        sortTable[row - 1],
        sortTable[row],
      ];
      [sortItem[row], sortItem[row - 1]] = [sortItem[row - 1], sortItem[row]];
    } else if (sortDirection === 'down') {
      [sortTable[row], sortTable[row + 1]] = [
        sortTable[row + 1],
        sortTable[row],
      ];
      [sortItem[row], sortItem[row + 1]] = [sortItem[row + 1], sortItem[row]];
    } else {
      return;
    }

    setTableData(sortTable);
    handleSetItem(sortItem);
  };

  // ConditionVal型かどうかの判定式
  const isConditionVal = (val: ConditionVal | string): val is ConditionVal => {
    if (typeof val !== 'object' || !val) {
      return false;
    }
    const { displayValue, value } = val as Record<keyof ConditionVal, unknown>;
    if (
      typeof displayValue !== 'string' ||
      (typeof value !== 'string' && typeof value !== 'number')
    ) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <TableMui>
      <TableHead>
        <TableRow>
          <TableLeftHeader width={70}></TableLeftHeader>
          {columns.map((column, index) => {
            return (
              <TableCell key={index} width={column.width}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography bold>{column.headerName}</Typography>
                  {<RequiredLabel />}
                </div>
              </TableCell>
            );
          })}
          {tableData.length + 1 <= 10 && <AddIconButton onClick={onClickRow} />}
        </TableRow>
      </TableHead>
      <TableBody>
        {searchCondition.map((row, indexRow) => {
          return (
            <TableRow key={indexRow}>
              <TableLeftHeader>
                <StyledColmun>
                  <div style={{ textAlign: 'center' }} />
                  条件{indexRow + 1}
                  <SetIconButton>
                    {indexRow !== 0 && (
                      <StyledIconButton
                        onClick={() => handleSortValue('up', indexRow)}
                      >
                        <ArrowDropUpIcon />
                      </StyledIconButton>
                    )}
                    {indexRow !== tableData.length - 1 && (
                      <StyledIconButton
                        onClick={() => handleSortValue('down', indexRow)}
                      >
                        <ArrowDropDownIcon />
                      </StyledIconButton>
                    )}
                  </SetIconButton>
                </StyledColmun>
              </TableLeftHeader>
              <TableCell>
                <select
                  size={1}
                  onChange={(e) => {
                    onChangeRow(e.target.value, indexRow);
                    handleChange(e.target.value, 'conditionType', indexRow);
                  }}
                  value={row.conditionType}
                >
                  <option hidden></option>
                  {rows.map((conditionType, index) => {
                    return (
                      <option
                        key={conditionType.value + index}
                        value={conditionType.value}
                      >
                        {conditionType.displayValue}
                      </option>
                    );
                  })}
                </select>
              </TableCell>
              <TableCell>
                {tableData[indexRow].condition.map((conditionRow, indexCol) => {
                  return (
                    <div key={indexCol} style={{ display: 'flex' }}>
                      <select
                        size={1}
                        onChange={(e) =>
                          handleChange(
                            e.target.value,
                            `conditions`,
                            indexRow,
                            indexCol
                          )
                        }
                        value={row.condition[indexCol]?.conditions}
                      >
                        <option hidden></option>
                        {conditionRow.conditions.map((rowVal, index) => {
                          return (
                            <option key={index} value={rowVal.value}>
                              {rowVal.displayValue}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                })}
              </TableCell>
              <TableCell>
                {tableData[indexRow].condition.map((conditionRow, indexCol) => {
                  if (
                    isConditionVal(conditionRow.conditionVal[indexRow]) &&
                    Array.isArray(conditionRow.conditionVal)
                  ) {
                    return (
                      <div key={indexCol} style={{ display: 'flex' }}>
                        <select
                          size={1}
                          onChange={(e) => {
                            handleChange(
                              e.target.value,
                              'conditionVal',
                              indexRow,
                              indexCol
                            );
                          }}
                          value={row.condition[indexCol]?.conditionVal}
                        >
                          <option hidden></option>
                          {conditionRow.conditionVal.map(
                            (rowVal: ConditionVal, index: number) => {
                              return (
                                <option key={index} value={rowVal.value}>
                                  {rowVal.displayValue}
                                </option>
                              );
                            }
                          )}
                        </select>
                        {indexCol > 0 && (
                          <RemoveIconButton
                            onClick={() => {
                              onClickConditionRemove(indexCol);
                            }}
                          />
                        )}
                      </div>
                    );
                  } else if (typeof conditionRow.conditionVal === 'string') {
                    return (
                      <div key={indexCol} style={{ display: 'flex' }}>
                        <input
                          type='text'
                          onChange={(e) => {
                            handleChange(
                              e.target.value,
                              'conditionVal',
                              indexRow,
                              indexCol
                            );
                          }}
                          value={row.condition[indexCol]?.conditionVal}
                        />
                        {indexCol > 0 && (
                          <RemoveIconButton
                            onClick={() => {
                              onClickConditionRemove(indexCol);
                            }}
                          />
                        )}
                      </div>
                    );
                  }
                })}
                <RightBox>
                  <AddIconButton
                    onClick={() => {
                      onClickCondition(indexRow);
                    }}
                  />
                </RightBox>
              </TableCell>
              <RemoveIconButton
                onClick={() => {
                  onClickRowRemove(indexRow);
                }}
              />
            </TableRow>
          );
        })}
        <CenterBox>
          <AddButton disable={false} onClick={handleVisibleTable}>
            反映
          </AddButton>
        </CenterBox>
      </TableBody>
    </TableMui>
  );
};

interface PriceTableProps {
  onClickExport: () => void;
  setCondition: SearchConditionProps[];
}

export const PricingTable = (props: PriceTableProps) => {
  const { setCondition, onClickExport } = props;

  return (
    <TableMui>
      <TableHead>
        {setCondition.map((column, index) => {
          return (
            <TableRow key={index}>
              <TableCell>条件{index + 1}</TableCell>
              <TableCell>{column.conditionType}</TableCell>
            </TableRow>
          );
        })}
      </TableHead>
      <TableBody>
        {setCondition.map((row, indexRow) => {
          return (
            <TableRow key={indexRow}>
              {row.condition.map((column, indexColumn) => {
                return (
                  <>
                    <TableCell key={indexColumn}>{column.conditions}</TableCell>
                    <TableCell key={indexColumn}>
                      {column.conditionVal}
                    </TableCell>
                  </>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </TableMui>
  );
};

