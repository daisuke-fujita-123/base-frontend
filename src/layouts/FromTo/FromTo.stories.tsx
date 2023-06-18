import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { FromTo } from './FromTo';
import React from 'react';
import { TextField } from '@mui/material';
export default {
  component: FromTo,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'FromTo内で表示するエレメント',
    },
    label: {
      description: '表示するラベル名',
    },
    labelPosition: {
      description: '表示するラベル名',
      defaultValue: { summary: 'row' },
    },
    variant: {
      description: '~の文字タイプの指定',
      defaultValue: { summary: 'h3' },
    },
  },
} as ComponentMeta<typeof FromTo>;
const ChildrenSample = [<TextField key={1}></TextField>, <TextField key={2}></TextField>];
export const Index: ComponentStoryObj<typeof FromTo> = {
  args: { children: ChildrenSample, label: 'ラベルサンプル', labelPosition: 'column', variant: 'h3' },
};
export const Example = () => {
  return (
    <FromTo label='サンプルラベル' labelPosition='row' variant='h3'>
      <TextField></TextField>
      <TextField></TextField>
    </FromTo>
  );
};
