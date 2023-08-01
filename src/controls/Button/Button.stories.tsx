import { ComponentStoryObj } from '@storybook/react';
import React from 'react';

import { RowStack } from 'layouts/Stack';

import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import { action } from '@storybook/addon-actions';
import {
  AddButton,
  AddIconButton,
  Button,
  CancelButton,
  ConfirmButton,
  DeleteButton,
  InfoButton,
  LogoutButton,
  MailButton,
  OutputButton,
  PrimaryButton,
  PrintButton,
  RegisterButton,
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
    variant: {
      description: 'ボタンのCSSの種類',
      defaultValue: { summary: 'outlined' },
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
      SAMPLE
      <RowStack>
        <AddButton disable={false} onClick={onClickFunction}>
          契約情報追加
        </AddButton>
        <OutputButton disable={false} onClick={onClickFunction}>
          CSV出力
        </OutputButton>
        <PrintButton disable={false} onClick={onClickFunction}>
          印刷
        </PrintButton>
        <MailButton disable={false} onClick={onClickFunction}>
          メール
        </MailButton>
        <RegisterButton disable={false} onClick={onClickFunction}>
          一括登録
        </RegisterButton>
        <SearchButton disable={false} onClick={onClickFunction}>
          検索
        </SearchButton>
        <DeleteButton disable={false} onClick={onClickFunction}>
          削除
        </DeleteButton>
        <CancelButton disable={false} onClick={onClickFunction}>
          キャンセル
        </CancelButton>
        <ConfirmButton onClick={onClickFunction}>確定</ConfirmButton>
        <LogoutButton disable={false} onClick={onClickFunction}>
          ログアウト
        </LogoutButton>
        <PrimaryButton onClick={onClickFunction} size='small'>
          small
        </PrimaryButton>
        <AddIconButton></AddIconButton>
        <InfoButton></InfoButton>
      </RowStack>
      DISABLE
      <RowStack>
        <AddButton disable={true} onClick={onClickFunction}>
          契約情報追加
        </AddButton>
        <OutputButton disable={true} onClick={onClickFunction}>
          CSV出力
        </OutputButton>
        <PrintButton disable={true} onClick={onClickFunction}>
          印刷
        </PrintButton>
        <MailButton disable={true} onClick={onClickFunction}>
          メール
        </MailButton>
        <RegisterButton disable={true} onClick={onClickFunction}>
          一括登録
        </RegisterButton>
        <SearchButton disable={true} onClick={onClickFunction}>
          検索
        </SearchButton>
        <DeleteButton disable={true} onClick={onClickFunction}>
          削除
        </DeleteButton>
        <CancelButton disable={true} onClick={onClickFunction}>
          キャンセル
        </CancelButton>
        <ConfirmButton disable={true} onClick={onClickFunction}>
          確定
        </ConfirmButton>
        <LogoutButton disable={true} onClick={onClickFunction}>
          ログアウト
        </LogoutButton>
        <PrimaryButton onClick={onClickFunction} size='small'>
          small
        </PrimaryButton>
      </RowStack>
    </ThemeProvider>
  );
};

