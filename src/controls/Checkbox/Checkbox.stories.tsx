import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';

export default {
  component: Checkbox,
  parameters: { controls: { expanded: true } },
  argTypes: {
    name: {
      description: 'reacthookformで管理する名前',
    },
    label: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    helperText: {
      description: 'チェックボックスの下部に表示するテキスト。',
    },
    required: {
      description: '必須かどうか',
      defaultValue: { summary: 'false' },
    },
    disabled: {
      description: 'チェックボックスの使用可否',
      defaultValue: { summary: 'false' },
    },
  },
} as ComponentMeta<typeof Checkbox>;

// react-hook-formを使う場合は、template内で呼び出してから使う。
interface SampleInput {
  cancelFlag1: boolean;
  cancelFlag2: boolean;
}

export const Example = () => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      cancelFlag1: false,
      cancelFlag2: true,
    },
    context: isReadOnly,
  });

  const handleClick = () => {
    console.log(methods.getValues());
  };

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <Checkbox
          name='cancelFlag1'
          label='キャンセルフラグ1'
          helperText='キャンセル日:YYYY/MM/DD'
          disabled
        />
        <Checkbox name='cancelFlag2' label='キャンセルフラグ2' />
        <Checkbox
          name='cancelFlag2'
          label='キャンセルフラグ2'
          backgroundColor='red'
        />
        <Button onClick={handleClick}>click</Button>
      </FormProvider>
    </ThemeProvider>
  );
};

