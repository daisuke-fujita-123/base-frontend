import React from 'react';

import {
  Input,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { getWeeksInMonth } from 'date-fns';

export interface CalenderItemDef {
  name: string;
  field: string;
  type: 'input' | 'select' | any[];
  selectValues?: any[];
}

export interface CalenderProps {
  yearmonth: Date;
  itemDef: CalenderItemDef[];
  dataset: any[];
  onItemValueChange?: (
    value: string | number,
    date: Date,
    field: string,
    index: number | undefined
  ) => void;
}

const dayofweeks = [' ', '日', '月', '火', '水', '木', '金', '土'];

export const Calender = (props: CalenderProps) => {
  const { yearmonth, itemDef, dataset, onItemValueChange } = props;

  const weeksInMonth = getWeeksInMonth(yearmonth);

  const cloned = [...dataset];

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

  const handleitemValueChange = (
    event: any,
    date: Date,
    field: string,
    index: number | undefined
  ) => {
    onItemValueChange &&
      onItemValueChange(event.target.value, date, field, index);
  };

  return (
    <>
      {dataPerWeeks.map((dataPerWeek, i) => (
        <TableContainer key={i} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>日</TableCell>
                <TableCell>月</TableCell>
                <TableCell>火</TableCell>
                <TableCell>水</TableCell>
                <TableCell>木</TableCell>
                <TableCell>金</TableCell>
                <TableCell>土</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>day</TableCell>
                {dataPerWeek.map((data, i) => (
                  <TableCell key={i}>
                    {'date' in data && data.date.getDate()}
                  </TableCell>
                ))}
              </TableRow>
              {itemDef.map((def) => (
                <TableRow key={def.name}>
                  <TableCell>{def.name}</TableCell>
                  {dataPerWeek.map((data: any, i: number) => (
                    <TableCell key={i}>
                      {'date' in data && def.type === 'input' && (
                        <Input
                          value={data[def.field]}
                          size='small'
                          onChange={(event) =>
                            handleitemValueChange(
                              event,
                              data.date,
                              def.field,
                              undefined
                            )
                          }
                        />
                      )}
                      {'date' in data && def.type === 'select' && (
                        <Select
                          value={data[def.field]}
                          size='small'
                          onChange={(event) =>
                            handleitemValueChange(
                              event,
                              data.date,
                              def.field,
                              undefined
                            )
                          }
                        >
                          {def.selectValues?.map((x: any, i: number) => (
                            <MenuItem key={i} value={x.value}>
                              {x.displayValue}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                      {'date' in data &&
                        Array.isArray(def.type) &&
                        def.type.map((x: any, i: number) => (
                          <Select
                            key={i}
                            value={data[def.field][i]}
                            size='small'
                            onChange={(event) =>
                              handleitemValueChange(
                                event,
                                data.date,
                                def.field,
                                i
                              )
                            }
                          >
                            {x.selectValues?.map((x: any, i: number) => (
                              <MenuItem key={i} value={x.value}>
                                {x.displayValue}
                              </MenuItem>
                            ))}
                          </Select>
                        ))}
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
