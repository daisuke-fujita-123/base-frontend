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
  type: 'input' | 'select';
  selectValues?: any[];
}

export interface CalenderModel {
  date: Date;
}
[];

export interface CalenderProps {
  yearmonth: Date;
  itemDef: CalenderItemDef[];
  dataset: any[];
}

const dayofweeks = [' ', '日', '月', '火', '水', '木', '金', '土'];

export const Calender = (props: CalenderProps) => {
  const { itemDef, dataset } = props;

  const weeksInMonth = getWeeksInMonth(new Date(2023, 7 - 1, 1));

  // 一週間単位のデータに変換する
  const dataPerWeeks = [...Array(weeksInMonth)].map((_, i) => {
    // 何曜日はじまりか
    const headDayOfWeek = dataset[0].date.getDay();
    // 先頭を空データで埋める
    const headEmpty = [...Array(headDayOfWeek)].fill({ input: '', select: '' });
    const dataPerWeek = [...headEmpty];

    // その週のデータを移動
    const elements = dataset.splice(0, 7 - headDayOfWeek);
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
                  {dataPerWeek.map((data, i) => (
                    <TableCell key={i}>
                      {'date' in data && def.type === 'input' && (
                        <Input defaultValue={data[def.field]} />
                      )}
                      {'date' in data && def.type === 'select' && (
                        <Select defaultValue={data[def.field]}>
                          {def.selectValues?.map((x, i) => (
                            <MenuItem key={i} value={x.value}>
                              {x.displayValue}
                            </MenuItem>
                          ))}
                        </Select>
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
