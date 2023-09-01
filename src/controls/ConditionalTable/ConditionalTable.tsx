import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { MarginBox, RightBox } from 'layouts/Box';
import { RowStack, Stack } from 'layouts/Stack';

import { AddButton, AddIconButton, RemoveIconButton } from 'controls/Button';
import { TableDivider, TableSpaceDivider } from 'controls/Divider';
import { RequiredLabel } from 'controls/Label';
import {
  SelectValue,
  StyledFormControl,
  StyledMenuItem,
} from 'controls/Select';
import { TableColDef } from 'controls/Table';
import { StyledTextFiled } from 'controls/TextField';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import SortAsc from 'icons/content_sort_ascend.png';
import SortDesc from 'icons/content_sort_descend.png';
import Pulldown from 'icons/pulldown_arrow.png';

import { IconButton, Select as SelectMui, styled } from '@mui/material';
import Icon from '@mui/material/Icon';
import { default as TableMui } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
  default as TableCellMui,
  tableCellClasses,
} from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { default as TableRowMui } from '@mui/material/TableRow';

const TableCell = styled(TableCellMui)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.table.header,
    textAlign: 'center',
    borderRight: '1px solid',
    borderRightColor: '#bbbbbb',
    padding: 16,
  },
  borderRight: '1px solid',
  borderRightColor: 'rgba(224, 224, 224, 1)',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: 3,
  paddingBottom: 0,
});

const TableLeftHeader = styled(TableCellMui)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'transparent',
    borderBottom: '1px solid',
    borderBottomColor: '#bbbbbb',
    padding: 16,
  },
  backgroundColor: theme.palette.table.header,
  borderBottom: '1px solid',
  borderBottomColor: '#bbbbbb',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: 3,
});

const TableRow = styled(TableRowMui)({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.table.main,
  },
  'input[type="checkbok"]:checked': {
    backgroundColor: theme.palette.table.selected,
  },
});

const StyledButton = styled(IconButton)({
  marginRight: 5,
  padding: 0,
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
  alignItems: 'center',
});
const StyledSelect = styled(SelectMui)({
  maxWidth: 225,
  minWidth: 80,
  width: '100%',
  textAlign: 'left',
  marginBottom: 5,
});

const StyledInput = styled(StyledTextFiled)({
  maxWidth: 225,
  minWidth: 80,
  marginBottom: 5,
});

const SortedAscIcon = () => {
  return (
    <div>
      <img src={SortAsc}></img>
    </div>
  );
};
const SortedDescIcon = () => {
  return (
    <div>
      <img src={SortDesc}></img>
    </div>
  );
};

const PulldownIcon = () => {
  return <img style={{ marginRight: 10 }} src={Pulldown}></img>;
};

/**
 * 行データモデル
 */
export interface TableRowModel {
  id: number;
  displayValue: string;
  value: string;
  condition: {
    operators: SelectValue[];
    values: SelectValue[] | string | undefined;
  }[];
}

/**
 * 条件種類データモデル
 */
export interface ConditionType {
  type: string;
  typeName: string;
  selectValues?: SelectValue[];
}

/**
 * 条件データモデル
 */
export interface ConditionModel {
  conditionType: string | number;
  condition: {
    operator: string | number;
    value: string | number;
  }[];
}

/**
 * ContitionalTableコンポーネントのProps
 */
interface ContitionalTableProps {
  /**
   * 列の定義情報
   */
  columns: TableColDef[];
  /**
   * 検索条件データ
   */
  conditionTypes: ConditionType[];
  /**
   * 演算子データ
   */
  operators: SelectValue[];
  /**
   * テーブル表示内容（行）
   */
  rows: ConditionModel[];

  /**
   * 条件追加関数
   */
  onValueChange: (
    value: string | number,
    field: DeepKey<ConditionModel>,
    indexRow: number,
    indexCol?: number
  ) => void;

  /**
   * テーブル行変更
   */
  handleSetItem: (val: ConditionModel[]) => void;

  /**
   * 価格設定テーブル表示
   */
  handleVisibleTable?: () => void;

  /**
   * 検索条件設定
   */
  handleGetConditionData: (select: string) => ConditionType | null;
  /**
   * 明細の詳細設定の可否
   */
  isEditable?: boolean;
  /**
   * 明細を読み取り専用にする
   */
  readOnly?: boolean;
}

/**
 * ConditionalTableコンポーネント
 * @param props
 * @returns
 */
export const ConditionalTable = (props: ContitionalTableProps) => {
  const {
    columns,
    conditionTypes,
    operators,
    onValueChange: handleChange,
    rows,
    handleSetItem,
    handleGetConditionData,
    isEditable = true,
    readOnly,
  } = props;

  const initialValues: TableRowModel[] = rows.map((x, i) => {
    const condition = x.condition.map((y, j) => {
      // const conditions: ConditionVal[] = [];
      const conditionVal = conditionTypes.find(
        (z) => z.type === x.conditionType
      );
      return {
        operators: operators,
        values: conditionVal !== undefined ? conditionVal.selectValues : '',
      };
    });
    return {
      id: i,
      value: '',
      displayValue: '',
      condition: condition,
    };
  });
  const [tableData, setTableData] = useState<TableRowModel[]>(initialValues);

  // テーブル行追加
  const onClickRow = () => {
    tableData.push({
      id: tableData.length,
      displayValue: '',
      value: '',
      condition: [
        {
          operators: operators,
          values: '',
        },
      ],
    });
    setTableData([...tableData]);

    rows.push({
      conditionType: '',
      condition: [
        {
          operator: 0,
          value: '',
        },
      ],
    });
    handleSetItem(rows);
  };

  // テーブル行削除
  const onClickRowRemove = (indexRow: number) => {
    setTableData(tableData.filter((_, index) => index !== indexRow));
    handleSetItem(rows.filter((_, index) => index !== indexRow));
  };

  // 検索条件（セル内）追加
  const onClickCondition = (indexRow: number) => {
    const newArray: TableRowModel[] = tableData.map((val, index) => {
      if (indexRow === index) {
        const newVal = {
          ...val,
          condition: val.condition.concat(val.condition[0]),
        };
        return newVal;
      } else {
        return { ...val };
      }
    });
    setTableData(newArray);

    const newItem = rows.map((val, index) => {
      if (indexRow === index) {
        const addSearchCondition = val.condition.concat({
          operator: 0,
          value: '',
        });
        return { ...val, condition: addSearchCondition };
      } else {
        return val;
      }
    });
    handleSetItem(newItem);
  };

  // 検索条件（セル内）削除
  const onClickConditionRemove = (indexCol: number, indexRow: number) => {
    setTableData(
      tableData.map((val, tableIndex) => {
        if (indexRow !== tableIndex) {
          return { ...val };
        } else {
          return {
            ...val,
            condition: val.condition.filter((_, index) => index !== indexCol),
          };
        }
      })
    );
    handleSetItem(
      rows.map((val, tableIndex) => {
        if (indexRow !== tableIndex) {
          return { ...val };
        } else {
          return {
            ...val,
            condition: val.condition.filter((_, index) => index !== indexCol),
          };
        }
      })
    );
  };

  // 検索条件更新
  const onChangeRow = (select: string, indexRow: number) => {
    const newCondition = handleGetConditionData(select);
    const conditionVal: TableRowModel = {
      id: indexRow,
      displayValue: newCondition?.typeName ?? '',
      value: newCondition?.type ?? '',
      condition: [
        {
          operators: operators,
          values: newCondition?.selectValues ?? '',
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
    const sortItem = [...rows];

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
  const isConditionVal = (val: SelectValue | string): val is SelectValue => {
    if (typeof val !== 'object' || !val) {
      return false;
    }
    const { displayValue, value } = val as Record<keyof SelectValue, unknown>;
    if (
      typeof displayValue !== 'string' ||
      (typeof value !== 'string' && typeof value !== 'number')
    ) {
      return false;
    } else {
      return true;
    }
  };

  // Menuの開閉制御
  const [isOpen, setisOpen] = useState<string>('');
  const handleMenuOpen = (val: string, row: number, col: number) => {
    const cell = val + row + col;
    const openMenu = cell === isOpen ? '' : cell;
    setisOpen(openMenu);
  };

  return (
    <TableMui>
      {/* ヘッダー */}
      <TableHead>
        <TableRow>
          <TableLeftHeader width='70px'></TableLeftHeader>
          {columns.map((column, index) => {
            return (
              <TableCell key={index} width={column.width}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    textOverflow: 'nowrap',
                    alignItems: 'center',
                  }}
                >
                  <Typography bold>{column.headerName}</Typography>
                  {<RequiredLabel />}
                </div>
              </TableCell>
            );
          })}
          {tableData.length + 1 <= 10 && (
            <MarginBox ml={2} justifyContent='start'>
              <AddButton onClick={onClickRow}>条件追加</AddButton>
            </MarginBox>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, indexRow) => {
          return (
            <TableRow key={indexRow}>
              {/* 条件 */}
              <TableLeftHeader>
                {isEditable ? (
                  <StyledColmun>
                    <div
                      style={{ textAlign: 'center', textOverflow: 'nowrap' }}
                    />
                    条件{indexRow + 1}
                    <SetIconButton>
                      {indexRow !== 0 && (
                        <StyledButton
                          onClick={() => handleSortValue('up', indexRow)}
                        >
                          <SortedAscIcon />
                        </StyledButton>
                      )}
                      {indexRow !== tableData.length - 1 && (
                        <StyledButton
                          onClick={() => handleSortValue('down', indexRow)}
                        >
                          <SortedDescIcon />
                        </StyledButton>
                      )}
                    </SetIconButton>
                  </StyledColmun>
                ) : (
                  <>
                    <div style={{ textAlign: 'center' }} />
                    条件{indexRow + 1}
                  </>
                )}
              </TableLeftHeader>
              {/* 条件種類 */}
              <TableCell>
                <StyledFormControl>
                  <StyledSelect
                    open={isOpen === 'conditionType' + indexRow + '0'}
                    onClick={() => handleMenuOpen('conditionType', indexRow, 0)}
                    onChange={(e) => {
                      onChangeRow(e.target.value as string, indexRow);
                      handleChange(
                        e.target.value as string | number,
                        'conditionType',
                        indexRow
                      );
                    }}
                    value={row.conditionType}
                    IconComponent={PulldownIcon}
                    inputProps={{
                      readOnly: readOnly,
                    }}
                  >
                    <StyledMenuItem value=''>{'　'}</StyledMenuItem>
                    {conditionTypes.map((conditionType, index) => {
                      return (
                        <StyledMenuItem
                          key={conditionType.type + index}
                          value={conditionType.type}
                        >
                          {conditionType.typeName}
                        </StyledMenuItem>
                      );
                    })}
                  </StyledSelect>
                </StyledFormControl>
              </TableCell>
              {/* 条件 */}
              <TableCell>
                {tableData[indexRow].condition.map((conditionRow, indexCol) => {
                  return (
                    <StyledFormControl key={indexCol}>
                      <StyledSelect
                        open={isOpen === 'operator' + indexRow + indexCol}
                        onClick={() =>
                          handleMenuOpen('operator', indexRow, indexCol)
                        }
                        IconComponent={PulldownIcon}
                        onChange={(e) =>
                          handleChange(
                            e.target.value as string | number,
                            'operator',
                            indexRow,
                            indexCol
                          )
                        }
                        value={row.condition[indexCol]?.operator}
                        inputProps={{ readOnly: readOnly }}
                      >
                        <StyledMenuItem value=''>{'　'}</StyledMenuItem>
                        {conditionRow.operators.map((rowVal, index) => {
                          return (
                            <StyledMenuItem key={index} value={rowVal.value}>
                              {rowVal.displayValue}
                            </StyledMenuItem>
                          );
                        })}
                      </StyledSelect>
                    </StyledFormControl>
                  );
                })}
              </TableCell>
              {/* 値 */}
              <TableCell>
                <Stack
                  spacing={5}
                  direction='row'
                  justifyContent='space-between'
                >
                  {tableData[indexRow].condition.map(
                    (conditionRow, indexCol) => {
                      if (
                        // isConditionVal(conditionRow.values[indexRow]) &&
                        Array.isArray(conditionRow.values)
                      ) {
                        return (
                          <div key={indexCol} style={{ display: 'flex' }}>
                            <StyledFormControl>
                              <StyledSelect
                                open={isOpen === 'value' + indexRow + indexCol}
                                onClick={() =>
                                  handleMenuOpen('value', indexRow, indexCol)
                                }
                                IconComponent={PulldownIcon}
                                onChange={(e) => {
                                  handleChange(
                                    e.target.value as string | number,
                                    'value',
                                    indexRow,
                                    indexCol
                                  );
                                }}
                                value={row.condition[indexCol]?.value}
                                inputProps={{ readOnly: readOnly }}
                              >
                                <StyledMenuItem value=''>{'　'}</StyledMenuItem>
                                {conditionRow.values.map(
                                  (rowVal: SelectValue, index: number) => {
                                    return (
                                      <StyledMenuItem
                                        key={index}
                                        value={rowVal.value}
                                      >
                                        {rowVal.displayValue}
                                      </StyledMenuItem>
                                    );
                                  }
                                )}
                              </StyledSelect>
                            </StyledFormControl>
                            {indexCol > 0 && (
                              <RemoveIconButton
                                onClick={() => {
                                  onClickConditionRemove(indexCol, indexRow);
                                }}
                              />
                            )}
                          </div>
                        );
                      } else if (conditionRow.values === undefined) {
                        return (
                          <div key={indexCol} style={{ display: 'flex' }}>
                            <StyledInput
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                handleChange(
                                  e.target.value,
                                  'conditionVal',
                                  indexRow,
                                  indexCol
                                );
                              }}
                              value={row.condition[indexCol]?.value}
                              InputProps={{ readOnly: readOnly }}
                            />
                            {indexCol > 0 && isEditable && (
                              <RemoveIconButton
                                onClick={() => {
                                  onClickConditionRemove(indexCol, indexRow);
                                }}
                              />
                            )}
                          </div>
                        );
                      }
                    }
                  )}
                  <RightBox>
                    {tableData[indexRow].condition.length <= 10 &&
                      isEditable && (
                        <AddIconButton
                          onClick={() => {
                            onClickCondition(indexRow);
                          }}
                        />
                      )}
                  </RightBox>
                </Stack>
              </TableCell>
              <RemoveIconButton
                onClick={() => {
                  onClickRowRemove(indexRow);
                }}
              />
            </TableRow>
          );
        })}
      </TableBody>
    </TableMui>
  );
};

interface OutputCsvprops extends ConditionModel {
  commission: string[];
}

interface PriceTableProps {
  setCondition: ConditionModel[];
  changeCodeToValue: (code: string | number) => string;
  handleVisibleTable: () => void;
}

export const PricingTable = (props: PriceTableProps) => {
  const { setCondition, changeCodeToValue, handleVisibleTable } = props;
  const [outputCsvdata, setOutputCsvdata] = useState<OutputCsvprops[] | null>(
    null
  );
  const setNewTableData = useCallback((setCondition: ConditionModel[]) => {
    setOutputCsvdata(null);
    const setArray: ConditionModel[] = JSON.parse(JSON.stringify(setCondition));
    const newTableData: OutputCsvprops[] = setArray.map((val, index) => {
      const condisition = setCondition.find((_, index) => index === 0);
      const condisitionCount: number = condisition
        ? condisition.condition.length
        : 0;
      if (index === 0) {
        return { ...val, commission: [''] };
      } else {
        const newVal: ConditionModel = { ...val };
        if (condisitionCount > 1) {
          for (let i = 0; i <= condisitionCount; i++) {
            const pushItem: ConditionModel['condition'] = val.condition.map(
              (val) => ({
                operator: val.operator,
                value: val.value,
              })
            );
            newVal.condition.push({ ...pushItem[i] });
          }
        }

        return {
          ...val,
          commission: new Array<string>(condisitionCount).fill(''),
        };
      }
    });

    setOutputCsvdata(newTableData);
  }, []);

  useEffect(() => {
    setNewTableData(setCondition);
  }, [setCondition, handleVisibleTable, setNewTableData]);

  if (!outputCsvdata) return null;
  return (
    <TableMui>
      <TableHead>
        <TableRow>
          {outputCsvdata.map((column, index) => {
            return (
              <TableCell key={index}>
                条件{index + 1}
                <TableDivider />
                {changeCodeToValue(column.conditionType)}
              </TableCell>
            );
          })}
          <TableCell>手数料</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {outputCsvdata.map((row, indexRow) => {
          return (
            <>
              <TableCell key={`${row.conditionType}-${indexRow}`}>
                {row.condition.map((column, indexColumn: number) => {
                  return (
                    <>
                      <RowStack key={`${column.value}-${indexColumn}`}>
                        {changeCodeToValue(column.operator)}
                        <TableSpaceDivider isBlack />
                        {changeCodeToValue(column.value)}
                      </RowStack>
                      {indexColumn <= row.condition.length - 2 && (
                        <TableDivider isBlack />
                      )}
                    </>
                  );
                })}
              </TableCell>
              {indexRow === setCondition.length - 1 && (
                <TableCell>
                  {row.commission.map((_, indexColumn) => {
                    return (
                      <>
                        <RowStack key={indexColumn}>手数料</RowStack>
                        {indexColumn <= row.condition.length - 1 && (
                          <TableDivider isBlack />
                        )}
                      </>
                    );
                  })}
                </TableCell>
              )}
            </>
          );
        })}
      </TableBody>
    </TableMui>
  );
};

// importソートの影響で画面上部に記載すると、他import項目が消えるため下部に記載
export type DeepKey<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}` | `${K & string}.${DeepKey<T[K]>}`;
    }[keyof T]
  : '';

