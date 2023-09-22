import React, { useEffect, useState } from 'react';
import {
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { MarginBox } from 'layouts/Box';

import { AddButton, AddIconButton, RemoveIconButton } from 'controls/Button';
import { RequiredLabel } from 'controls/Label';
import { SelectValue } from 'controls/Select';
import { TableColDef } from 'controls/Table';
import { StyledTextFiled } from 'controls/TextField';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import SortAsc from 'icons/content_sort_ascend.png';
import SortDesc from 'icons/content_sort_descend.png';
import Pulldown from 'icons/pulldown_arrow.png';

import {
  Box,
  IconButton,
  MenuItem,
  Select as SelectMui,
  Stack,
  styled,
  TextField,
} from '@mui/material';
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
 * サブ条件データモデル
 */
export interface SubConditionModel {
  operator: string | number;
  value: string | number;
}

/**
 * 条件データモデル
 */
export interface ConditionModel {
  conditionKind: string | number;
  subConditions: SubConditionModel[];
}

/**
 * ContitionalTableコンポーネントのProps
 */
interface ContitionalTableProps<T extends FieldValues> {
  name: Path<T>;
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
   * 順序変更を有効にする
   */
  reorderable?: boolean;
  /**
   * サブ条件の増減を可能にする
   */
  adjustableSubConditionCount?: boolean;
  /**
   * 読み取り専用にする
   */
  readonly?: boolean;
}

/**
 * ConditionalTableコンポーネント
 * @param props
 * @returns
 */
export const ConditionalTable = <T extends FieldValues>(
  props: ContitionalTableProps<T>
) => {
  const {
    name,
    columns,
    conditionKinds,
    operators,
    reorderable = false,
    adjustableSubConditionCount = false,
    readonly,
  } = props;

  // state
  const [errors, setErrors] = useState<FieldErrors<FieldValues>>({});

  // form
  const { formState, control, register, getValues, setValue } =
    useFormContext();
  const { append, remove } = useFieldArray({ control, name });
  useWatch(name);
  const fields = getValues(name);

  useEffect(() => {
    console.log(formState.errors);
    setErrors(formState.errors);
  }, [formState]);

  if (fields.length === 0) return <></>;

  const handleAddConditionClick = () => {
    const newItem: ConditionModel = {
      conditionKind: '',
      subConditions: [
        {
          operator: '',
          value: '',
        },
      ],
    };
    append(newItem as any, { shouldFocus: false });
  };

  const handleRemoveConditionClick = (index: number) => {
    remove(index);
  };

  const handleAddSubConditionClick = (index: number) => {
    const newItem: SubConditionModel[] = getValues(
      `${name}.${index}.subConditions`
    );
    newItem.push({
      operator: '',
      value: '',
    });
    setValue(`${name}.${index}.subConditions`, newItem as any);
  };

  const handleRemoveSubConditionClick = (index: number, subIndex: number) => {
    const newItem: SubConditionModel[] = getValues(
      `${name}.${index}.subConditions`
    );
    newItem.splice(subIndex, 1);
    setValue(`${name}.${index}.subConditions`, newItem as any);
  };

  const hadnleMoveUpConditionClick = (index: number) => {
    const values: ConditionModel[] = getValues(name);
    const top = values[index - 1];
    const bottom = values[index];
    setValue(`${name}.${index - 1}`, bottom as any);
    setValue(`${name}.${index}`, top as any);
  };

  const hadnleMoveDownConditionClick = (index: number) => {
    const values: ConditionModel[] = getValues(name);
    const top = values[index];
    const bottom = values[index + 1];
    setValue(`${name}.${index}`, bottom as any);
    setValue(`${name}.${index + 1}`, top as any);
  };

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
          {!readonly && (
            <MarginBox ml={2} justifyContent='start'>
              <AddButton
                onClick={handleAddConditionClick}
                disable={fields.length >= 10}
              >
                条件追加
              </AddButton>
            </MarginBox>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {fields.map((row: any, indexRow: number) => {
          return (
            <TableRow key={indexRow}>
              {/* 条件番号 */}
              <TableLeftHeader>
                {reorderable && !readonly ? (
                  <StyledColmun>
                    <div
                      style={{ textAlign: 'center', textOverflow: 'nowrap' }}
                    />
                    条件{indexRow + 1}
                    <SetIconButton>
                      {indexRow !== 0 && (
                        <StyledButton
                          onClick={() => hadnleMoveUpConditionClick(indexRow)}
                        >
                          <SortedAscIcon />
                        </StyledButton>
                      )}
                      {indexRow !== fields.length - 1 && (
                        <StyledButton
                          onClick={() => hadnleMoveDownConditionClick(indexRow)}
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
                <Controller
                  name={`${name}.${indexRow}.conditionKind`}
                  control={control}
                  render={({ field }) => (
                    <>
                      <SelectMui
                        {...field}
                        size='small'
                        fullWidth
                        readOnly={readonly}
                      >
                        {conditionKinds.map((x, i) => (
                          <MenuItem key={i} value={x.value}>
                            {x.displayValue}
                          </MenuItem>
                        ))}
                      </SelectMui>
                      <Typography>
                        {
                          (errors[name] as any)?.[indexRow]?.conditionKind
                            ?.message
                        }
                      </Typography>
                    </>
                  )}
                />
              </TableCell>
              {/* 条件 */}
              <TableCell>
                <Box>
                  {row.subConditions.map(
                    (conditionRow: any, indexCol: number) => {
                      return (
                        <>
                          <Controller
                            name={`${name}.${indexRow}.subConditions.${indexCol}.operator`}
                            control={control}
                            render={({ field }) => (
                              <>
                                <SelectMui
                                  {...field}
                                  size='small'
                                  fullWidth
                                  readOnly={readonly}
                                >
                                  {operators?.map((x, i) => (
                                    <MenuItem key={i} value={x.value}>
                                      {x.displayValue}
                                    </MenuItem>
                                  ))}
                                </SelectMui>
                                <Typography>
                                  {(errors[name] as any)?.[indexRow]
                                    ?.subConditions &&
                                    (errors[name] as any)?.[indexRow]
                                      ?.subConditions[indexCol]?.operator &&
                                    (errors[name] as any)?.[indexRow]
                                      ?.subConditions[indexCol]?.operator
                                      .message}
                                </Typography>
                              </>
                            )}
                          />
                        </>
                      );
                    }
                  )}
                </Box>
              </TableCell>
              {/* 値 */}
              <TableCell>
                <Box>
                  {row.subConditions.map(
                    (conditionRow: any, indexCol: number) => {
                      const kind = conditionKinds.find(
                        (x) => x.value === row.conditionKind
                      );
                      return (
                        <Stack key={indexCol} direction='row'>
                          {kind?.selectValues === undefined ? (
                            <TextField
                              {...register(
                                `${name}.${indexRow}.subConditions.${indexCol}.value`
                              )}
                              size='small'
                              fullWidth
                              inputProps={{
                                readOnly: { readonly },
                              }}
                              helperText={
                                (errors[name] as any)?.[indexRow]
                                  ?.subConditions &&
                                (errors[name] as any)?.[indexRow]
                                  ?.subConditions[indexCol]?.value &&
                                (errors[name] as any)?.[indexRow]
                                  ?.subConditions[indexCol]?.value.message
                              }
                            />
                          ) : (
                            <Controller
                              name={`${name}.${indexRow}.subConditions.${indexCol}.value`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <SelectMui
                                    {...field}
                                    size='small'
                                    fullWidth
                                    readOnly={readonly}
                                  >
                                    {kind.selectValues?.map((x, i) => (
                                      <MenuItem key={i} value={x.value}>
                                        {x.displayValue}
                                      </MenuItem>
                                    ))}
                                  </SelectMui>
                                  <Typography>
                                    {(errors[name] as any)?.[indexRow]
                                      ?.subConditions &&
                                      (errors[name] as any)?.[indexRow]
                                        ?.subConditions[indexCol]?.value &&
                                      (errors[name] as any)?.[indexRow]
                                        ?.subConditions[indexCol]?.value
                                        .message}
                                  </Typography>
                                </>
                              )}
                            />
                          )}
                          {adjustableSubConditionCount &&
                            !readonly &&
                            indexCol > 0 && (
                              <RemoveIconButton
                                onClick={() => {
                                  handleRemoveSubConditionClick(
                                    indexRow,
                                    indexCol
                                  );
                                }}
                              />
                            )}
                          {adjustableSubConditionCount &&
                            !readonly &&
                            indexCol === 0 && (
                              <AddIconButton
                                onClick={() => {
                                  handleAddSubConditionClick(indexRow);
                                }}
                                disable={row.subConditions.length >= 10}
                              />
                            )}
                        </Stack>
                      );
                    }
                  )}
                </Box>
              </TableCell>
              {!readonly && (
                <RemoveIconButton
                  onClick={() => {
                    handleRemoveConditionClick(indexRow);
                  }}
                />
              )}
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

export const exportCsv = (filename: string, data: any[]) => {
  // CSVの文字列を生成
  const fields = [];
  for (let i = 1; i <= 10; i++) {
    if (data[0]['kind' + i] === undefined) continue;
    fields.push('手数料条件種類名No.' + i);
    fields.push('手数料条件区分名No.' + i);
    fields.push('手数料条件値No.' + i);
  }
  fields.push('手数料金額');

  const header =
    fields
      .map((x: string) => {
        return `"${x}"`;
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

