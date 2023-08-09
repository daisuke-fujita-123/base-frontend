import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Box } from 'layouts/Box';
import { Popup } from 'layouts/Popup';
import { Stack } from 'layouts/Stack/Stack';
import { StackSection } from 'layouts/StackSection';

import { Button, CancelButton, ConfirmButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material';

export default {
  component: Popup,
  parameters: { controls: { expanded: true } },
  argTypes: {
    open: {
      description: 'ポップアップの表示／非表示',
    },
    titles: {
      description: 'ポップアップ内のtitleを配列形式化したもの。',
    },
    children: {
      description: 'ポップアップ内のtitle配下に表示するエレメントの配列',
    },
    bottom: {
      description: 'Popup内の右下にボタンを配置する場合に指定',
    },
  },
} as ComponentMeta<typeof Popup>;

export const Index: ComponentStoryObj<typeof Popup> = {
  args: {
    open: true,
    children: ['タイトル1中身', 'タイトル2中身'],
  },
};

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  const titles = [{ name: '基本情報' }, { name: 'サービス一覧' }];

  const handleOpenPopupClick = () => {
    setIsOpen(true);
  };

  const handleClosePopupClick = () => {
    setIsOpen(false);
  };

  interface SampleInput {
    cancelFlag1: boolean;
    cancelFlag2: boolean;
  }
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      cancelFlag1: false,
      cancelFlag2: true,
    },
    context: isReadOnly,
  });

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <Button onClick={handleOpenPopupClick}>ポップアップを開く</Button>
        <Popup open={isOpen}>
          <Popup main>
            <StackSection titles={titles} isError>
              <Stack>
                <div>・会計処理日はオープン期間内を設定してください</div>
                <div>・会計処理日はオープン期間内を設定してください</div>
              </Stack>
            </StackSection>
            <StackSection titles={titles} isWarning>
              <Stack>
                <Checkbox
                  name='cancelFlag1'
                  label='ワーニングメッセージ１：１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０'
                  helperText='ワーニングメッセージ'
                />
                <Checkbox
                  name='cancelFlag2'
                  label='ワーニングメッセージ２：ワーニング２'
                />
              </Stack>
            </StackSection>
            <StackSection titles={titles}>
              <Stack>
                <div>・会計処理日はオープン期間内を設定してください</div>
                <div>・会計処理日はオープン期間内を設定してください</div>
              </Stack>
              <Box>Stack2</Box>
            </StackSection>
          </Popup>
          <Popup bottom>
            <CancelButton onClick={handleClosePopupClick}>
              キャンセル
            </CancelButton>
            <ConfirmButton onClick={handleOpenPopupClick}>確定</ConfirmButton>
          </Popup>
        </Popup>
      </FormProvider>
    </ThemeProvider>
  );
};
