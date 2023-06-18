import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { StackSection } from './StackSection';
import React from 'react';
import { Box } from '@mui/material';
import { Icon } from 'controls/Icon';
export default {
  component: StackSection,
  description: 'メインレイアウト内で表示される、アコーディオン形式のスタック',
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'accordion配下に表示されるエレメント',
    },
    titles: {
      description: 'スタックのタイトル名',
    },
  },
} as ComponentMeta<typeof StackSection>;

const exampleOnClickFunction = (event: React.MouseEvent<HTMLElement>) => {
  console.log(event);
};
const decoration = (
  <>
    <Icon iconName='削除' iconType='delete' onClick={exampleOnClickFunction} />
    <Icon iconName='追加' iconType='add' onClick={exampleOnClickFunction} />
  </>
);
const titles = [{ name: '基本情報' }, { name: 'サービス一覧', decoration: decoration }];
const ChildrenSample = [<Box key='1'>Stack1</Box>, <Box key='2'>Stack2</Box>];

export const Index: ComponentStoryObj<typeof StackSection> = {
  args: { titles: titles, children: ChildrenSample },
};
export const Example = () => {
  const decoration = (
    <>
      <Icon iconName='削除' iconType='delete' onClick={exampleOnClickFunction} />
      <Icon iconName='追加' iconType='add' onClick={exampleOnClickFunction} />
    </>
  );
  const titles = [{ name: '基本情報' }, { name: 'サービス一覧', decoration: decoration }];
  return (
    <StackSection titles={titles}>
      <Box>Stack1</Box>
      <Box>Stack2</Box>
    </StackSection>
  );
};
