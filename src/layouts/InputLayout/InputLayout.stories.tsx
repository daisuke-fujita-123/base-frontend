import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { InputLayout } from './InputLayout';
import React from 'react';
import { TextField } from '@mui/material';
export default {
  component: InputLayout,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'InputLayout内で表示するエレメント',
    },
    label: {
      description: '表示するラベル名',
    },
    labelPosition: {
      description: '表示するラベル名',
      defaultValue: { summary: 'above' },
    },
    required: {
      description: '必須かどうか',
      defaultValue: { summary: 'false' },
    },
  },
} as ComponentMeta<typeof InputLayout>;
const ChildrenSample = <TextField></TextField>;
export const Index: ComponentStoryObj<typeof InputLayout> = {
  args: { children: ChildrenSample, label: 'ラベルサンプル', labelPosition: 'side', required: true },
};
export const Example = () => {
  return (
    <InputLayout label='サンプルラベル' labelPosition='above' required={true}>
      <TextField></TextField>
    </InputLayout>
  );
};
