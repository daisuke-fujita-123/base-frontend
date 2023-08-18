import React, { useEffect, useState } from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

import { Stack } from 'layouts/Stack';

import { Typography } from 'controls/Typography';

import {
  Box,
  MenuItem,
  Select,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
} from '@mui/material';
import { getWeeksInMonth } from 'date-fns';

export interface CalenderItemDef {
  name: string;
  field: string;
  type: 'input' | 'select' | any[];
  selectValues?: any[];
}

export interface CalenderItemModel {
  date: Date;
  [key: string]: any;
}

/**
 * バリデーションデータモデル
 */
export interface InvalidModel {
  field: string;
  date: number;
  type: string;
  message: string;
}

export interface CalenderProps<T extends FieldValues> {
  name: Path<T>;
  yearmonth: Date;
  itemDef: CalenderItemDef[];
  getCellBackground?: (
    date: Date,
    field: string,
    value: string | number
  ) => string | undefined;
}

const dayOfWeeks = ['日', '月', '火', '水', '木', '金', '土'];

export const Calender = <T extends FieldValues>(props: CalenderProps<T>) => {
  const { name, yearmonth, itemDef, getCellBackground } = props;

  // state
  const [errors, setErrors] = useState<any>({});

  // form
  const { formState, control, register, getValues } = useFormContext();

  useEffect(() => {
    console.log(formState.errors);
    setErrors(formState.errors);
  }, [formState]);

  const weeksInMonth = getWeeksInMonth(yearmonth);
  const values = getValues();
  const cloned = [...values[name]];

  // 一週間単位のデータに変換する
  const dataPerWeeks = [...Array(weeksInMonth)].map((_, i) => {
    // 何曜日はじまりか
    const headDayOfWeek = cloned[0].date.getDay();
    // 先頭を空データで埋める
    const headEmpty = [...Array(headDayOfWeek)].fill({ input: '', select: '' });
    const dataPerWeek = [...headEmpty];

    // その週のデータを移動
    const elements = cloned.splice(0, 7 - headDayOfWeek);
    dataPerWeek.push(...elements);

    // 何曜日おわりか
    const tailDayOfWeek = dataPerWeek[dataPerWeek.length - 1].date.getDay();
    // 末尾を空データで埋める
    const tailEmpty = [...Array(6 - tailDayOfWeek)].fill({
      input: '',
      select: '',
    });
    dataPerWeek.push(...tailEmpty);

    return dataPerWeek;
  });

  const tableCellSx: SxProps<Theme> = { width: '100px' };

  return (
    <>
      {dataPerWeeks.map((dataPerWeek, i) => (
        <TableContainer key={i} component={Box}>
          <Table>
            <TableHead>
              {/* 曜日 */}
              <TableRow>
                <TableCell></TableCell>
                {dayOfWeeks.map((data, i) => (
                  <TableCell key={i} sx={tableCellSx}>
                    {data}
                  </TableCell>
                ))}
              </TableRow>
              {/* 日付 */}
              <TableRow>
                <TableCell>day</TableCell>
                {dataPerWeek.map((data, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      ...tableCellSx,
                      background:
                        data.date &&
                        getCellBackground &&
                        getCellBackground(
                          data.date,
                          'date',
                          data.date.getDate()
                        ),
                    }}
                  >
                    {data.date && data.date.getDate()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* データ */}
              {itemDef.map((def) => (
                <TableRow key={def.name}>
                  <TableCell sx={tableCellSx}>{def.name}</TableCell>
                  {dataPerWeek.map((data: any, i: number) => (
                    <TableCell
                      key={i}
                      sx={{
                        ...tableCellSx,
                        background:
                          data.date &&
                          getCellBackground &&
                          getCellBackground(
                            data.date,
                            def.field,
                            data.date.getDate()
                          ),
                      }}
                    >
                      {data.date && def.type === 'input' && (
                        <TextField
                          size='small'
                          fullWidth
                          helperText={
                            errors[name]?.[data.date.getDate() - 1]?.[def.field]
                              ?.message
                          }
                          {...register(
                            `${name}.${data.date.getDate() - 1}.${def.field}`
                          )}
                        />
                      )}
                      {data.date && def.type === 'select' && (
                        <Controller
                          name={`${name}.${data.date.getDate() - 1}.${
                            def.field
                          }`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <>
                              <Select {...field} size='small' fullWidth>
                                {def.selectValues?.map((x: any, i: number) => (
                                  <MenuItem key={i} value={x.value}>
                                    {x.displayValue}
                                  </MenuItem>
                                ))}
                              </Select>
                              <Typography>
                                {
                                  errors[name]?.[data.date.getDate() - 1]?.[
                                    def.field
                                  ]?.message
                                }
                              </Typography>
                            </>
                          )}
                        />
                      )}
                      {data.date && Array.isArray(def.type) && (
                        <Stack direction='column'>
                          {def.type.map((x: any, i: number) => (
                            <Controller
                              key={i}
                              name={`${name}.${data.date.getDate() - 1}.${
                                def.field
                              }.${i}`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <>
                                  <Select {...field} size='small' fullWidth>
                                    {x.selectValues?.map(
                                      (x: any, i: number) => (
                                        <MenuItem key={i} value={x.value}>
                                          {x.displayValue}
                                        </MenuItem>
                                      )
                                    )}
                                  </Select>
                                  <Typography>
                                    {
                                      errors[name]?.[data.date.getDate() - 1]?.[
                                        def.field
                                      ]?.[i]?.message
                                    }
                                  </Typography>
                                </>
                              )}
                            />
                          ))}
                        </Stack>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </>
  );
};
