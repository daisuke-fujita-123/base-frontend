import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { getDaysInMonth } from 'date-fns';
import { Calender, CalenderItemDef } from './Calender';

export default {
  component: Calender,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof Calender>;

export const Example = () => {
  const itemDef: CalenderItemDef[] = [
    {
      name: 'INPUT',
      field: 'input',
      type: 'input',
    },
    {
      name: 'SELECT',
      field: 'select',
      type: 'select',
      selectValues: [
        { value: 1, displayValue: 'one' },
        { value: 2, displayValue: 'two' },
        { value: 3, displayValue: 'three' },
      ],
    },
  ];

  // const dataset = [
  //   {
  //     date: new Date('2023/07/01'),
  //     input: 'input 1',
  //     select: 'select 1',
  //   },
  //   {
  //     date: new Date('2023/07/02'),
  //     input: 'input 1',
  //     select: 'select 1',
  //   },
  //   {
  //     date: new Date('2023/07/03'),
  //     input: 'input 1',
  //     select: 'select 1',
  //   },
  //   {
  //     date: new Date('2023/07/08'),
  //     input: 'input 1',
  //     select: 'select 1',
  //   },
  //   {
  //     date: new Date('2023/07/15'),
  //     input: 'input 1',
  //     select: 'select 1',
  //   },
  //   {
  //     date: new Date('2023/07/22'),
  //     input: 'input 1',
  //     select: 'select 1',
  //   },
  //   {
  //     date: new Date('2023/07/29'),
  //     input: 'input 1',
  //     select: 'select 1',
  //   },
  // ];

  const year = 2023;
  const month = 7;
  const yearmonth = new Date(year, month - 1, 1);
  const daysInMonth = getDaysInMonth(yearmonth);
  const dataset = [...Array(daysInMonth)].map((_, i) => {
    return {
      date: new Date(year, month - 1, i + 1),
      input: `input ${i + 1}`,
      select: i,
    };
  });

  return (
    <>
      <Calender yearmonth={yearmonth} itemDef={itemDef} dataset={dataset} />
    </>
  );
};
