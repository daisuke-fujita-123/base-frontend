import { ComponentMeta, Story } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { theme } from 'controls/theme';

import { Button, ThemeProvider } from '@mui/material';
import { Textarea, TextareaProps } from './Textarea';

export default {
  component: Textarea,
  parameters: { controls: { expanded: true } },
  argTypes: {
    name: {
      description: 'reacthookformで管理する名前',
    },
    disabled: {
      description: '使用可否',
      defaultValue: { summary: 'false' },
    },
    maxRows: {
      description: '最大行数',
    },
    minRows: {
      description: '最小行数',
    },
  },
} as ComponentMeta<typeof Textarea>;

// react-hook-formを使う場合は、template内で呼び出してから使う。
interface SampleInput {
  sampleName: string;
}
const schema = yup.object({
  sampleName: yup.string().required('入力してください').max(32).min(6),
});
const Template: Story<TextareaProps<SampleInput>> = (args) => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      sampleName: 'available',
    },
    resolver: yupResolver(schema),
    context: isReadOnly,
  });
  return (
    <FormProvider {...methods}>
      <Textarea {...args} />
    </FormProvider>
  );
};
export const index = Template.bind({});
index.args = {
  name: 'sampleName',
  disabled: false,
  maxRows: 10,
};

interface TextareaInput {
  name: string;
}
export const Example = () => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<TextareaInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: 'こんにちは',
    },
    resolver: yupResolver(schema),
    context: isReadOnly,
  });
  const onSubmit: SubmitHandler<TextareaInput> = (data: TextareaInput) => {
    console.log(`submit: ${data}`);
  };
  return (
    <FormProvider {...methods}>
      <ThemeProvider theme={theme}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Textarea name='name' disabled={false} />
          <Button type='submit' variant='outlined'>
            submit
          </Button>
        </form>
      </ThemeProvider>
    </FormProvider>
  );
};

