import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from 'controls/Button';
import { Checkbox } from 'controls/CheckBox';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';

export default {
  component: Checkbox,
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
} as ComponentMeta<typeof Checkbox>;

// react-hook-formを使う場合は、template内で呼び出してから使う。
interface SampleInput {
  cancelFlag: boolean;
}

export const Example = () => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      cancelFlag: false,
    },
    context: isReadOnly,
  });

  const CheckBoxSample = [
    { value: 'cancelFlag', displayValue: 'キャンセルフラグ' },
  ];

  const handleClick = () => {
    console.log(methods.getValues('cancelFlag'));
  };

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <Checkbox name='cancelFlag' checkOptions={CheckBoxSample} />
        <Button onClick={handleClick}>click</Button>
      </FormProvider>
    </ThemeProvider>
  );
};

