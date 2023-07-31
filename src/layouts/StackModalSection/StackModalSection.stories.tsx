import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React from 'react';

import { Box } from '@mui/material';
import { StackModalSection } from './StackModalSection';

export default {
  component: StackModalSection,
  description: 'modal内で表示する、タイトルの要素。',
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'title配下に表示されるエレメント',
    },
    titles: {
      description: '表示するtitleを配列化したもの。',
    },
    isError: {
      description: 'エラー表示の際に設定',
    },
    isWarning: {
      description: 'ワーニング表示の際に設定',
    },
  },
} as ComponentMeta<typeof StackModalSection>;
const ChildrenSample = [
  <Box key='1'>Stack1</Box>,
  <Box key='2'>Stack2</Box>,
  <Box key='3'>Stack3</Box>,
];
const titles = ['スタック1', 'スタック2', 'スタック3'];

export const Index: ComponentStoryObj<typeof StackModalSection> = {
  args: { children: ChildrenSample, titles: titles },
};
export const Example = () => {
  const titles = ['スタック1', 'スタック2', 'スタック3'];
  return (
    <StackModalSection titles={titles}>
      <Box>Stack1</Box>
      <Box>Stack2</Box>
      <Box sx={{ height: 256, width: '100%' }}>Stack3</Box>
    </StackModalSection>
  );
};
