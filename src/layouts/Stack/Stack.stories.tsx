import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Stack } from './Stack';
import React from 'react';
import { Box } from '@mui/material';
export default {
  component: Stack,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'stack内で表示するエレメントの配列',
    },
    spacing: {
      description: 'stack内で表示するエレメント間のスペースの大きさ',
      defaultValue: { summary: '2' },
    },
    direction: {
      description: 'stack内のエレメント配置方法',
      defaultValue: { summary: 'column' },
    },
    justifyContent: {
      description: 'stack内のエレメント配置方法',
      defaultValue: { summary: 'center' },
    },
  },
} as ComponentMeta<typeof Stack>;
const ChildrenSample = [<Box key='1'>Stack1</Box>, <Box key='2'>Stack2</Box>, <Box key='3'>Stack3</Box>];
export const Index: ComponentStoryObj<typeof Stack> = {
  args: { children: ChildrenSample, spacing: 2, direction: 'row' },
};
export const Example = () => {
  return (
    <Stack spacing={2} direction='row'>
      <Box>Stack1</Box>
      <Box>Stack2</Box>
      <Box sx={{ height: 256, width: '100%' }}>Stack3</Box>
    </Stack>
  );
};
