import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React from 'react';

import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import { action } from '@storybook/addon-actions';
import { ErrorSubTitle, SubTitle, Typography, WarningSubTitle } from './Typography';

export default {
  component: Typography,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'Typography化する中身',
    },
    variant: {
      description: '文字タイプ',
      defaultValue: { summary: 'body1' },
    },
    color: {
      description: '文字色',
      defaultValue: { summary: '#000000' },
    },
    price: {
      description: '3桁でカンマ区切りが必要な数字の場合はtrueを設定。',
      defaultValue: { summary: 'false' },
    },
    onClick: {
      description: '文字を押下時のイベント',
    },
  },
} as ComponentMeta<typeof Typography>;

const sampleJst = 'Typography';
export const Index: ComponentStoryObj<typeof Typography> = {
  args: {
    children: sampleJst,
    variant: 'h4',
    color: '#000000',
    onClick: action('タイポグラフィが押下されました。'),
    price: false,
  },
};

export const Example = () => {
  const onClikSample = () => {
    console.log('クリックしましたよ。');
  };
  return (
    <ThemeProvider theme={theme}>
      <Typography
        variant='h3'
        color='#000000'
        onClick={onClikSample}
        price={false}
      >
        タイポグラフィ
      </Typography>
      <SubTitle>SubTitle</SubTitle>
      <WarningSubTitle>WarningSubTitle</WarningSubTitle>
      <ErrorSubTitle>ErrorSubTitle</ErrorSubTitle>
    </ThemeProvider>
  );
};

