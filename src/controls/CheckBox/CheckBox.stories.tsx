import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import { CheckBox } from './CheckBox';

export default {
  component: CheckBox,
  parameters: { controls: { expanded: true } },
  argTypes: {
    label: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },

    required: {
      description: '必須かどうか',
      defaultValue: { summary: 'true' },
    },
    name: {
      description: 'reacthookformで管理する名前',
    },
    CheckBoxOptions: {
      description:
        'チェックボックスの中身。valueがCheckBoxの値、valueLableが表示名、disabledがCheckBoxボタンを選択可能かどうか判定',
    },
    row: {
      description: 'CheckBoxボタンの配置を横並びにするか、縦並びにするか',
      defaultValue: { summary: 'row' },
    },
  },
} as ComponentMeta<typeof CheckBox>;

const CheckBoxSample = [
  { value: 'available', valueLabel: '可', disabled: false },
  { value: 'notAvailable', valueLabel: '不可', disabled: false },
];
// react-hook-formを使う場合は、template内で呼び出してから使う。
interface SampleInput {
  sampleName: string;
}

export const Example = () => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      sampleName: 'available',
    },
    context: isReadOnly,
  });
  const CheckBoxSample = [
    { value: 'available', valueLabel: '可', disabled: false },
    { value: 'notAvailable', valueLabel: '不可', disabled: false },
  ];
  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <CheckBox
          required={false}
          name='sampleName'
          checkOptions={CheckBoxSample}
        />
      </FormProvider>
    </ThemeProvider>
  );
};

