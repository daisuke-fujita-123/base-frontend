import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React from 'react';

import { Box, ContentsBox, ErrorBox, WarningBox } from './Box';

export default {
  component: Box,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'box内で表示する要素',
    },
    hidden: {
      description: 'box内の要素を表示するか',
      defaultValue: { summary: 'false' },
    },
    component: {
      description: 'componenのtypeを指定。例)submit',
    },
    onSubmit: {
      description: 'componenのtypeがsubmit時の押下された時の挙動。',
    },
  },
} as ComponentMeta<typeof Box>;
const sampleJsx = <p>こんにちは</p>;
export const Index: ComponentStoryObj<typeof Box> = {
  args: { children: sampleJsx, hidden: false },
};
export const Example = () => {
  return (
    <>
      <Box>
        <h1>こんにちは</h1>
      </Box>
      <ContentsBox title='一覧検索'>Default</ContentsBox>
      <ContentsBox title='一覧検索' transparent={true}>
        Transparent
      </ContentsBox>
      <ContentsBox title='一覧検索' disable={true}>
        Disable
      </ContentsBox>
      <WarningBox title='一覧検索' disable={true}>
        Disable
      </WarningBox>
      <ErrorBox title='一覧検索' disable={true}>
        Disable
      </ErrorBox>
    </>
  );
};

