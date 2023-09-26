import { ComponentMeta } from '@storybook/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Stack } from 'layouts/Stack';

import { PrimaryButton } from 'controls/Button';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import { AddbleSelect, Select, SelectValue } from './Select';

export default {
  component: Select,
  title: 'Controls/Select',
  parameters: { controls: { expanded: true } },
  argTypes: {
    name: {
      description: 'reacthookformで管理する名前',
    },
    label: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    labelPosition: {
      description:
        'テキストフィールドから見て左横にラベルを表示したい場合はrow、上にラベルを表示したい場合はcolumn。',
      defaultValue: { summary: 'side' },
    },
    multiple: {
      description:
        '複数選択したい場合は、true。multipleをtrueにする場合は、defaultの値は配列形式を指定。',
      defaultValue: { summary: 'false' },
    },
    selectValues: {
      description:
        'Selectの中身。オプションの数が10以上の場合は、検索可能になる。displayValueは表示名。valueは値。',
    },
    disabled: {
      description: '使用可否',
      defaultValue: { summary: 'false' },
    },
    blankOption: {
      description: '選択肢にブランク行を追加したい場合。',
      defaultValue: { summary: 'false' },
    },
    required: {
      description: '入力項目が必須の場合はtrue。',
    },
    minWidth: {
      description: 'Selectの最低の横幅の長さ',
      defaultValue: { summary: '100' },
    },
  },
} as ComponentMeta<typeof Select>;

// TDOO クラッシュ原因の特定
// const Template: Story<SelectProps<SampleInput>> = (args) => {
//   const methods = useForm<SampleInput>({
//     mode: 'onBlur',
//     reValidateMode: 'onBlur',
//     defaultValues: {
//       sampleName: '二輪',
//     },
//   });
//   return (
//     <FormProvider {...methods}>
//       <Select {...args} />
//     </FormProvider>
//   );
// };
// export const index = Template.bind({});
// index.args = {
//   name: 'sampleName',
//   selectValues: sampleSelect,
//   label: 'サンプルセレクト',
//   labelPosition: 'side',
//   disabled: false,
//   blankOption: false,
//   required: false,
//   multiple: false,
// };

interface SelectExampleModel {
  listbox1: number;
  listbox2: number[];
  listbox3: string;
  listbox4: string[];
  listbox5: string[];
  listbox6: number[];
}

export const Example = () => {
  const methods = useForm<SelectExampleModel>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      listbox1: 1,
      listbox2: [2],
      listbox3: '3',
      listbox4: ['4'],
      listbox5: [],
      listbox6: [0, 1],
    },
  });

  const selectValues1: SelectValue[] = [
    { value: 0, displayValue: '二輪' },
    { value: 1, displayValue: '三輪' },
    { value: 2, displayValue: '四輪' },
  ];

  const selectValues2: SelectValue[] = [
    { value: '2', displayValue: 'ｶｰｵｸ!＆ﾕｰｻﾞｰ代行出品' },
    { value: '3', displayValue: '福祉･ﾊﾞｽﾄﾗ' },
    { value: '4', displayValue: 'ヤナセ' },
    { value: '5', displayValue: 'ﾔﾅｾﾛｰﾌﾟﾗ' },
    { value: '6', displayValue: 'トラックレンタ・リース' },
    { value: '9', displayValue: 'ﾊﾞｽﾄﾗﾌﾚｯｼｭ' },
    { value: 'A', displayValue: 'スズキディーラー' },
    { value: 'B', displayValue: '即売り' },
    { value: 'C', displayValue: 'ヤナセ即売り' },
    { value: 'D', displayValue: 'ﾌﾚｯｼｭ' },
    { value: 'E', displayValue: 'ＶＵＣセレクト' },
    { value: 'G', displayValue: 'ｵｰｸﾈｯﾄｻﾀﾃﾞｰ' },
    { value: 'H', displayValue: 'ブランド売り切り' },
    { value: 'I', displayValue: '月)BMWﾃﾞｨｰﾗ特選' },
    { value: 'J', displayValue: 'お楽しみ売切り' },
    { value: 'K', displayValue: 'Audi/VW' },
    { value: 'M', displayValue: 'ｽﾎﾟｯﾄｲﾍﾞﾝﾄ' },
    { value: 'N', displayValue: 'さきどりﾚﾝﾀﾘｰｽ' },
    { value: 'O', displayValue: '月MAX30' },
    { value: 'Q', displayValue: 'スペシャルメンバーズ' },
    { value: 'R', displayValue: '月)BMWﾃﾞｨｰﾗﾌﾚｯｼｭ' },
    { value: 'S', displayValue: 'シュテルン' },
    { value: 'X', displayValue: '土曜ﾚﾝﾀﾘｰｽ' },
    { value: 'Y', displayValue: 'レンタ・リース' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <Stack spacing={4}>
          <Select
            label='1, リストボックス（単一選択）'
            name='listbox1'
            selectValues={selectValues1}
            blankOption
          />
          <Select
            label='2. リストボックス（複数選択）'
            name='listbox2'
            selectValues={selectValues1}
            blankOption
            multiple
          />
          <Select
            label='3. リストボックス（単一選択＋絞り込み）'
            name='listbox3'
            selectValues={selectValues2}
          />
          <Select
            label='4. リストボックス（複数選択＋絞り込み）'
            name='listbox4'
            selectValues={selectValues2}
            multiple
          />
          <Select
            label='5. リストボックス（複数選択＋絞り込み）'
            name='listbox5'
            selectValues={selectValues2}
            multiple
          />
          <AddbleSelect
            label='6. リストボックス（追加可能）'
            name='listbox6'
            selectValues={selectValues1}
            limit={5}
          />
          <PrimaryButton onClick={() => console.log(methods.getValues())}>
            log
          </PrimaryButton>
        </Stack>
      </FormProvider>
    </ThemeProvider>
  );
};

