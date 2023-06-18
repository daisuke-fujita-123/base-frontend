import { ComponentStoryObj } from '@storybook/react';
import React from 'react';

import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import { action } from '@storybook/addon-actions';
import {
  AddButton,
  Button,
  CancelButton,
  DeleteButton,
  LogoutButton,
  SearchButton,
} from './Button';

export default {
  component: Button,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'ボタンの表示名',
    },
    disable: {
      description: 'ボタンの使用可否',
      defaultValue: { summary: 'false' },
    },
    type: {
      description: 'ボタンの種類',
      defaultValue: { summary: 'button' },
    },
    variant: {
      description: 'ボタンのCSSの種類',
      defaultValue: { summary: 'outlined' },
    },
    color: {
      description: 'ボタンの表示名と境界線の色',
      defaultValue: { summary: 'inherit' },
    },
    bgColor: {
      description: 'ボタンの背景の色',
      defaultValue: { summary: '' },
    },
    onClick: {
      description: 'ボタン押下時のイベント',
    },
  },
};

const sampleJst = 'ボタン';
export const Index: ComponentStoryObj<typeof Button> = {
  args: {
    children: sampleJst,
    disable: false,
    type: 'button',
    variant: 'outlined',
    color: 'inherit',
    bgColor: '',
    onClick: action('ボタンを押下しました。'),
  },
};

export const Example = () => {
  const onClickFunction = () => {
    console.log('クリックしました');
  };
  return (
    <ThemeProvider theme={theme}>
      <Button
        disable={false}
        type='button'
        variant='outlined'
        onClick={onClickFunction}
      >
        確定
      </Button>
      <AddButton disable={false} onClick={onClickFunction}>
        契約情報追加
      </AddButton>
      <SearchButton disable={false} onClick={onClickFunction}>
        検索
      </SearchButton>
      <DeleteButton disable={false} onClick={onClickFunction}>
        削除
      </DeleteButton>
      <CancelButton disable={false} onClick={onClickFunction}>
        キャンセル
      </CancelButton>
      <LogoutButton disable={false} onClick={onClickFunction}>
        ログアウト
      </LogoutButton>
    </ThemeProvider>
  );
};

