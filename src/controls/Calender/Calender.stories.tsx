import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';

import { getDaysInMonth } from 'date-fns';
import { Calender, CalenderItemDef } from './Calender';

export default {
  component: Calender,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof Calender>;

interface CalenderExampleModel {
  date: Date;
  input: string;
  select: number;
  doubleSelect: number[];
}

export const Example = () => {
  const selectValues = [
    { value: 0, displayValue: 'zero' },
    { value: 1, displayValue: 'one' },
    { value: 2, displayValue: 'two' },
    { value: 3, displayValue: 'three' },
    { value: 4, displayValue: 'four' },
    { value: 5, displayValue: 'five' },
    { value: 6, displayValue: 'six' },
    { value: 7, displayValue: 'seven' },
    { value: 8, displayValue: 'eight' },
    { value: 9, displayValue: 'nine' },
    { value: 10, displayValue: 'ten' },
  ];

  const itemDef: CalenderItemDef[] = [
    {
      name: 'Item 1',
      field: 'input',
      type: 'input',
    },
    {
      name: 'Item 2',
      field: 'select',
      type: 'select',
      selectValues: selectValues,
    },
    {
      name: 'Item 3 / Item 4',
      field: 'doubleSelect',
      type: [
        {
          type: 'select',
          selectValues: selectValues,
        },
        {
          type: 'select',
          selectValues: selectValues,
        },
      ],
    },
  ];

  const year = 2023;
  const month = 7;
  const yearmonth = new Date(year, month - 1, 1);
  const daysInMonth = getDaysInMonth(yearmonth);
  const defaultValue: CalenderExampleModel[] = [...Array(daysInMonth)].map(
    (_, i) => {
      return {
        date: new Date(year, month - 1, i + 1),
        input: `input ${i + 1}`,
        select: (i % 10) + 1,
        doubleSelect: [(i % 10) + 1, (i % 10) + 1],
      };
    }
  );

  const [dataset, setDataset] = useState<CalenderExampleModel[]>(defaultValue);

  const handleOnCellChange = (
    value: string | number,
    date: Date,
    field: string,
    index: number | undefined
  ) => {
    // 特定の日付の入力を他の日付にも反映するサンプル
    const newDataset = dataset.map((x, i) => {
      if (field === 'input' && typeof value === 'string') {
        x.input = value;
      }
      if (field === 'select' && typeof value === 'number') {
        x.select = value;
      }
      if (field === 'doubleSelect') {
        if (index !== undefined && typeof value === 'number') {
          x.doubleSelect[index] = value;
        }
      }
      return x;
    });
    setDataset(newDataset);
  };

  return (
    <>
      <Calender
        yearmonth={yearmonth}
        itemDef={itemDef}
        dataset={dataset}
        onItemValueChange={handleOnCellChange}
      />
    </>
  );
};
