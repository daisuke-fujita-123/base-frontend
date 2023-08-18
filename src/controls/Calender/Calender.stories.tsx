import { ComponentMeta } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { getDaysInMonth } from 'date-fns';
import { Calender, CalenderItemDef } from './Calender';

export default {
  component: Calender,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof Calender>;

interface CalenderExampleModel {
  calender: {
    date: Date;
    input: string;
    select: number;
    doubleSelect: number[];
  }[];
  select: number;
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
  const defaultValue: CalenderExampleModel = {
    calender: [...Array(daysInMonth)].map((_, i) => {
      return {
        date: new Date(year, month - 1, i + 1),
        input: `input ${i + 1}`,
        select: (i % 10) + 1,
        doubleSelect: [(i % 10) + 1, (i % 10) + 1],
      };
    }),
    select: 1,
  };

  const validationSchema = yup.object().shape({
    calender: yup.array().of(
      yup.object().shape({
        input: yup.string().required().max(10).label('Item 1'),
        select: yup.number().required().min(1).label('Item 2'),
        doubleSelect: yup
          .array()
          .of(yup.number().required().min(1).label('Item 3 / Item 4')),
      })
    ),
  });

  // state
  const [dataset, setDataset] = useState<CalenderExampleModel>(defaultValue);

  // form
  const methods = useForm<CalenderExampleModel>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: defaultValue,
    resolver: yupResolver(validationSchema),
  });
  const { getValues, setValue, watch } = methods;

  const handleGetCellBackground = (
    date: Date,
    field: string
  ): string | undefined => {
    if (date.getDate() === 1 && field === 'date') return '#75cfeb';
    return undefined;
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // inputフィールドの変更のみを処理するサンプル
      if (name?.split('.')[2] === 'input') {
        const newValue = String(getValues(name));
        const newCalender = getValues('calender').map((x) => {
          x.input = newValue;
          return x;
        });
        setValue('calender', newCalender);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <FormProvider {...methods}>
        <Calender
          name='calender'
          yearmonth={yearmonth}
          itemDef={itemDef}
          getCellBackground={handleGetCellBackground}
        />
      </FormProvider>
    </>
  );
};
