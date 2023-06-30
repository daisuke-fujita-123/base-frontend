import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import { PostalTextField, PriceTextField, TextField } from './TextField';

export default {
  component: TextField,
  title: 'Controls/TextField',
  parameters: { controls: { expanded: true } },
  argTypes: {
    label: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    labelPosition: {
      description:
        'テキストフィールドから見て左横にラベルを表示したい場合はrow、上にラベルを表示したい場合はcolumn。',
      defaultValue: { summary: 'side' },
    },
    required: {
      description: '必須かどうか',
      defaultValue: { summary: 'false' },
    },
    name: {
      description: 'reacthookformで管理する名前',
    },
    disabled: {
      description: '使用可否',
      defaultValue: { summary: 'false' },
    },
    fullWidth: {
      description: 'TextField要素の横幅をいっぱいにするか。',
      defaultValue: { summary: 'true' },
    },
    onClearTextFieldHandler: {
      description: 'TextFieldの入力値を全削除する関数',
    },
  },
} as ComponentMeta<typeof TextField>;
// react-hook-formを使う場合は、template内で呼び出してから使う。
interface InputSample {
  sampleName: string;
}

const schema = yup.object({
  sampleName: yup.string().required('入力してください'),
});
// TDOO クラッシュ原因の特定
// const Template: Story<TextFieldProps<InputSample>> = (args) => {
//   const methods = useForm<InputSample>({
//     mode: 'onBlur',
//     reValidateMode: 'onBlur',
//     defaultValues: {
//       sampleName: 'デフォルト値',
//     },
//     resolver: yupResolver(schema),
//   });
//   return (
//     <FormProvider {...methods}>
//       <TextField {...args} />
//     </FormProvider>
//   );
// };
// export const index = Template.bind({});
// index.args = {
//   label: 'サンプルラベル',
//   labelPosition: 'side',
//   required: true,
//   name: 'sampleName',
//   disabled: false,
//   fullWidth: true,
//   variant: 'outlined',
//   postalCode: false,
// };

export const Example = () => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<InputSample>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      sampleName: 'デフォルト値',
    },
    resolver: yupResolver(schema),
    context: isReadOnly,
  });

  return (
    <FormProvider {...methods}>
      <ThemeProvider theme={theme}>
        <TextField
          label='サンプルラベル'
          required={true}
          name='sampleName'
          disabled={false}
          fullWidth={true}
          variant='outlined'
        />
        <TextField
          label='サンプルラベル'
          required={true}
          name='sampleName'
          disabled={false}
          fullWidth={true}
          variant='standard'
        />
        <TextField
          label='サンプルラベル'
          required={true}
          name='sampleName'
          disabled={true}
          fullWidth={true}
          variant='outlined'
        />
        <PriceTextField
          label='サンプルラベル。'
          required={true}
          name='sampleName'
          disabled={false}
          fullWidth={true}
          variant='outlined'
        />
        <PostalTextField
          label='サンプルラベル。'
          required={true}
          name='sampleName'
          disabled={false}
          fullWidth={true}
          variant='outlined'
          onBlur={() => {
            console.log('onBlur');
          }}
        />
      </ThemeProvider>
    </FormProvider>
  );
};

