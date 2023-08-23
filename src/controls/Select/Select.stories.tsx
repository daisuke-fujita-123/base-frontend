import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import { Select, SelectValue } from './Select';

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

// react-hook-formを使う場合は、template内で呼び出してから使う。
interface SampleInput {
  sampleName: string | number;
  sampleName1: string[] | number[];
  sampleName2: string[] | number[];
}
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

export const Example = () => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      sampleName: 0,
      sampleName1: [0],
      sampleName2: ['2'],
    },
    context: isReadOnly,
  });

  const sampleSelect: SelectValue[] = [
    { displayValue: '二輪', value: 0 },
    { displayValue: '三輪', value: 1 },
    { displayValue: '四輪', value: 2 },
  ];

  const sampleAutoComplete: SelectValue[] = [
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
    <FormProvider {...methods}>
      <ThemeProvider theme={theme}>
        <Select
          label='サンプルセレクト'
          selectValues={sampleSelect}
          name='sampleName'
          disabled={false}
          blankOption={true}
          required={false}
        />
        <Select
          label='サンプルセレクト(Multiple)'
          selectValues={sampleSelect}
          name='sampleName1'
          disabled={false}
          blankOption={true}
          required={false}
          multiple={true}
        />
        <Select
          label='Autocomplete'
          selectValues={sampleAutoComplete}
          name='sampleName2'
          multiple={true}
        />
      </ThemeProvider>
    </FormProvider>
  );
};

