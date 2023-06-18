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
  sampleName: string;
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
      sampleName: '二輪',
    },
    context: isReadOnly,
  });

  const sampleSelect: SelectValue[] = [
    { displayValue: '二輪', value: '二輪' },
    { displayValue: '三輪', value: '三輪' },
    { displayValue: '四輪', value: '四輪' },
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
      </ThemeProvider>
    </FormProvider>
  );
};

