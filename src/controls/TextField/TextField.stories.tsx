import { ComponentMeta } from '@storybook/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Stack } from 'layouts/Stack';

import { PrimaryButton } from 'controls/Button';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import { PriceTextField, TextField } from './TextField';

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

interface TextFieldExampleModel {
  textbox1: string;
  textbox2: string;
  textbox3: string;
  textbox4: string;
  textbox5: number;
  textbox6: string;
}

export const Example = () => {
  const schema = yup.object({
    textbox1: yup.string().label('テキストボックス'),
    textbox2: yup.string().required().label('テキストボックス（必須）'),
    textbox3: yup.string().label('テキストボックス（読み取り専用）'),
    textbox4: yup.string().label('テキストボックス（非活性）'),
    textbox5: yup.number().label('テキストボックス（単位付き）'),
    textbox6: yup.string().label('テキストボックス（金額）'),
  });

  const methods = useForm<TextFieldExampleModel>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      textbox1: 'テキストボックス1',
      textbox2: 'テキストボックス2',
      textbox3: 'テキストボックス3',
      textbox4: 'テキストボックス4',
      textbox5: 1234,
      textbox6: '1,000',
    },
    resolver: yupResolver(schema),
  });

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <Stack spacing={4}>
          <TextField label='1. テキストボックス' name='textbox1' fullWidth />
          <TextField
            label='2. テキストボックス（必須）'
            name='textbox2'
            required
          />
          <TextField
            label='3. テキストボックス（読み取り専用）'
            name='textbox3'
            readonly
          />
          <TextField
            label='4. テキストボックス（非活性）'
            name='textbox4'
            disabled
          />
          <TextField
            label='5. テキストボックス（単位付き）'
            required
            name='textbox5'
            unit='単位'
          />
          <PriceTextField label='6. テキストボックス（金額）' name='textbox6' />
          <PrimaryButton onClick={() => console.log(methods.getValues())}>
            log
          </PrimaryButton>
        </Stack>
      </FormProvider>
    </ThemeProvider>
  );
};

