import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Calender } from './Calender';

export default {
  component: Calender,
  parameters: { controls: { expanded: true } },
  argTypes: {
    apiData: {
      description:
        'テーブルに表示する元データ→APIの仕様次第で変更する可能性あり。',
    },
    register: {
      description: 'テーブルで表示するデータをreacthookfrom管理下に置くため。',
    },
    getValues: {
      description: 'テーブル内の値の変更後に使用する。',
    },
    setValue: {
      description: 'テーブル内の値の変更後に使用する。',
    },
    control: {
      description: 'テーブル内の値の変更後に使用する。',
    },
  },
} as ComponentMeta<typeof Calender>;
interface InputData {
  data: CalenderMasterDate[];
}
interface CalenderMasterDate {
  date: Date;
  aucRestFlag: boolean;
  bankRestFlag: boolean;
  fourWheelAuctionHoldingFlag: boolean;
  fourWheelAuctionTimes: number;
  twoWheelAuctionHoldingFlag: boolean;
  twoWheelAuctionTimes: number;
  automaticServiceCompleteFlag: boolean;
}
const createCalenderMasterDate = (
  date: Date,
  aucRestFlag: boolean,
  bankRestFlag: boolean,
  fourWheelAuctionHoldingFlag: boolean,
  fourWheelAuctionTimes: number,
  twoWheelAuctionHoldingFlag: boolean,
  twoWheelAuctionTimes: number,
  automaticServiceCompleteFlag: boolean
) => {
  return {
    date,
    aucRestFlag,
    bankRestFlag,
    fourWheelAuctionHoldingFlag,
    fourWheelAuctionTimes,
    twoWheelAuctionHoldingFlag,
    twoWheelAuctionTimes,
    automaticServiceCompleteFlag,
  };
};

const apiDataMar = [
  createCalenderMasterDate(
    new Date('2023/03/01'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/02'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/03'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/04'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/05'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/06'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/07'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/08'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/09'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/10'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/11'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/12'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/13'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/14'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/15'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/16'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/17'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/18'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/19'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/20'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/21'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/22'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/23'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/24'),
    false,
    false,
    false,
    3,
    false,
    2,
    true
  ),
  createCalenderMasterDate(
    new Date('2023/03/25'),
    false,
    false,
    false,
    3,
    true,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/26'),
    false,
    false,
    false,
    3,
    true,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/27'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/28'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/29'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/30'),
    false,
    false,
    false,
    3,
    false,
    2,
    false
  ),
  createCalenderMasterDate(
    new Date('2023/03/31'),
    false,
    false,
    false,
    3,
    true,
    2,
    true
  ),
];
// react-hook-formを使う場合は、template内で呼び出してから使う。
// const Template: Story<CalenderProps> = (args) => {
//   const methods = useForm<InputData>({
//     mode: 'onBlur',
//     reValidateMode: 'onBlur',
//     defaultValues: { data: apiDataMar },
//   });
//   return (
//     <FormProvider {...methods}>
//       <Calender {...args} />
//     </FormProvider>
//   );
// };
// export const index = Template.bind({});
// index.args = { apiData: apiDataMar };

export const Example = () => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<InputData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: { data: apiDataMar },
    context: isReadOnly,
  });

  return (
    <FormProvider {...methods}>
      <Calender apiData={apiDataMar} />
    </FormProvider>
  );
};

