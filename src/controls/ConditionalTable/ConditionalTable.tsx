import React, { ChangeEvent, useState } from 'react';

import { MarginBox, RightBox } from 'layouts/Box';
import { Stack } from 'layouts/Stack';

import { AddButton, AddIconButton, RemoveIconButton } from 'controls/Button';
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

import Encoding from 'encoding-japanese';
import saveAs from 'file-saver';
import Papa from 'papaparse';

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
 * 条件種類データモデル
 */
export interface ConditionKind {
  value: string;
  displayValue: string;
  selectValues?: SelectValue[];
}

/**
 * 条件データモデル
 */
export interface ConditionModel {
  conditionKind: string | number;
  subConditions: {
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
  conditionKinds: ConditionKind[];
  /**
   * 演算子データ
   */
  operators: SelectValue[];
  /**
   * テーブル表示内容（行）
   */
  rows: ConditionModel[];
  /**
   * 条件種別変更イベント
   */
  onConditionKindChange: (kind: string | number, index: number) => void;
  /**
   * サブ条件変更イベント
   */
  onSubConditionChange: (
    value: string | number,
    index: number,
    subIndex: number,
    field: string
  ) => void;
  /**
   * 順序変更クリックイベント
   */
  onOrderChangeClick: (index: number, direction: string) => void;
  /**
   * 条件数変更クリックイベント
   */
  onConditionCountChangeClick: (operation: string, index?: number) => void;
  /**
   * サブ条件数変更クリックイベント
   */
  onSubConditionCoountChangeClick: (
    index: number,
    operation: string,
    subIndex?: number
  ) => void;
  /**
   * 明細の詳細設定の可否
   */
  isEditable?: boolean;
  /**
   * 明細を読み取り専用にする
   */
  readonly?: boolean;
}

/**
 * ConditionalTableコンポーネント
 * @param props
 * @returns
 */
export const ConditionalTable = (props: ContitionalTableProps) => {
  const {
    columns,
    conditionKinds,
    operators,
    rows,
    onConditionKindChange,
    onSubConditionChange,
    onOrderChangeClick,
    onConditionCountChangeClick,
    onSubConditionCoountChangeClick,
    isEditable = true,
    readonly,
  } = props;

  // Menuの開閉制御
  const [isOpen, setisOpen] = useState<string>('');
  const handleMenuOpen = (val: string, row: number, col: number) => {
    const cell = val + row + col;
    const openMenu = cell === isOpen ? '' : cell;
    setisOpen(openMenu);
  };

  if (rows.length === 0) return <></>;

  return (
    <TableMui>
      {/* ヘッダー */}
      <TableHead>
        <TableRow>
          <TableLeftHeader width='70px'></TableLeftHeader>
          {columns.map((column, index) => (
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
          ))}
          {rows.length + 1 <= 10 && (
            <MarginBox ml={2} justifyContent='start'>
              <AddButton onClick={() => onConditionCountChangeClick('add')}>
                条件追加
              </AddButton>
            </MarginBox>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, indexRow) => {
          return (
            <TableRow key={indexRow}>
              {/* 条件番号 */}
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
                          onClick={() => onOrderChangeClick(indexRow, 'up')}
                        >
                          <SortedAscIcon />
                        </StyledButton>
                      )}
                      {indexRow !== rows.length - 1 && (
                        <StyledButton
                          onClick={() => onOrderChangeClick(indexRow, 'down')}
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
                    open={isOpen === 'conditionKind' + indexRow + '0'}
                    onClick={() => handleMenuOpen('conditionKind', indexRow, 0)}
                    onChange={(e) => {
                      onConditionKindChange(
                        e.target.value as string | number,
                        indexRow
                      );
                    }}
                    value={row.conditionKind}
                    IconComponent={PulldownIcon}
                    inputProps={{
                      readOnly: readonly,
                    }}
                  >
                    <StyledMenuItem value=''>{'　'}</StyledMenuItem>
                    {conditionKinds.map((conditionKind, index) => (
                      <StyledMenuItem
                        key={conditionKind.value + index}
                        value={conditionKind.value}
                      >
                        {conditionKind.displayValue}
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </StyledFormControl>
              </TableCell>
              {/* 条件 */}
              <TableCell>
                {row.subConditions.map((conditionRow, indexCol) => {
                  const kind = conditionKinds.find(
                    (x) => x.value === row.conditionKind
                  );
                  return (
                    <StyledFormControl key={indexCol}>
                      <StyledSelect
                        open={isOpen === 'operator' + indexRow + indexCol}
                        onClick={() =>
                          handleMenuOpen('operator', indexRow, indexCol)
                        }
                        IconComponent={PulldownIcon}
                        onChange={(e) =>
                          onSubConditionChange(
                            e.target.value as string | number,
                            indexRow,
                            indexCol,
                            'operator'
                          )
                        }
                        value={row.subConditions[indexCol]?.operator}
                        inputProps={{ readOnly: readonly }}
                      >
                        <StyledMenuItem value=''>{'　'}</StyledMenuItem>
                        {operators.map((rowVal, index) => (
                          <StyledMenuItem key={index} value={rowVal.value}>
                            {rowVal.displayValue}
                          </StyledMenuItem>
                        ))}
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
                  {row.subConditions.map((conditionRow, indexCol) => {
                    const kind = conditionKinds.find(
                      (x) => x.value === row.conditionKind
                    );
                    if (kind?.selectValues !== undefined) {
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
                                onSubConditionChange(
                                  e.target.value as string | number,
                                  indexRow,
                                  indexCol,
                                  'value'
                                );
                              }}
                              value={row.subConditions[indexCol]?.value}
                              inputProps={{ readOnly: readonly }}
                            >
                              <StyledMenuItem value=''>{'　'}</StyledMenuItem>
                              {kind.selectValues.map(
                                (rowVal: SelectValue, index: number) => (
                                  <StyledMenuItem
                                    key={index}
                                    value={rowVal.value}
                                  >
                                    {rowVal.displayValue}
                                  </StyledMenuItem>
                                )
                              )}
                            </StyledSelect>
                          </StyledFormControl>
                          {indexCol > 0 && (
                            <RemoveIconButton
                              onClick={() => {
                                onSubConditionCoountChangeClick(
                                  indexRow,
                                  'remove',
                                  indexCol
                                );
                              }}
                            />
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div key={indexCol} style={{ display: 'flex' }}>
                          <StyledInput
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              onSubConditionChange(
                                e.target.value as string | number,
                                indexRow,
                                indexCol,
                                'value'
                              );
                            }}
                            value={row.subConditions[indexCol]?.value}
                            InputProps={{ readOnly: readonly }}
                          />
                          {indexCol > 0 && isEditable && (
                            <RemoveIconButton
                              onClick={() => {
                                onSubConditionCoountChangeClick(
                                  indexRow,
                                  'remove',
                                  indexCol
                                );
                              }}
                            />
                          )}
                        </div>
                      );
                    }
                  })}
                  <RightBox>
                    {row.subConditions.length <= 10 && isEditable && (
                      <AddIconButton
                        onClick={() => {
                          onSubConditionCoountChangeClick(indexRow, 'add');
                        }}
                      />
                    )}
                  </RightBox>
                </Stack>
              </TableCell>
              <RemoveIconButton
                onClick={() => {
                  onConditionCountChangeClick('remove', indexRow);
                }}
              />
            </TableRow>
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

export const exportCsv = (filename: string, data: any[], colDef: any[]) => {
  // const colDef = apiRef.current.getAllColumns();
  // const rowIds = apiRef.current.getAllRowIds();

  // DataGridのid列の除外、囲み文字の追加
  // const data = rowIds.map((x) => {
  //   const row = apiRef.current.getRow(x);
  //   delete row.id;
  //   Object.keys(row).forEach((key) => {
  //     const value = row[key];
  //     row[key] = `"${value}"`;
  //   });
  //   return row;
  // });

  // CSVの文字列を生成
  const header =
    colDef
      .map((x: any) => {
        return `"${x.headerName}"`;
      })
      .join(',') + '\r\n';
  const rows = Papa.unparse(data, {
    delimiter: ',',
    newline: '\r\n',
    quoteChar: '',
    escapeChar: '',
    header: false,
  });

  // 文字コードをUnicodeからShift-JISに変換
  const unicode = Encoding.stringToCode(header + rows);
  const sjis = Encoding.convert(unicode, { from: 'UNICODE', to: 'SJIS' });

  // ダウンロード処理
  const u8a = new Uint8Array(sjis);
  const blob = new Blob([u8a]);
  saveAs(blob, filename);
};

