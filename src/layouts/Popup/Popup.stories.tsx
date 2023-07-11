import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Box } from 'layouts/Box';
import { Popup } from 'layouts/Popup';
import { StackSection } from 'layouts/StackSection';

import { Button, Stack } from '@mui/material';

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
    buttons: {
      description:
        'ポップアップのフッター部分に表示するボタン。nameはボタンの表示名、onClickはボタン押下時のイベント',
    },
  },
} as ComponentMeta<typeof Popup>;

const closeModalHandle = () => {
  console.log('ダイアログを閉じたいです。');
};

const modalButtons = [
  { name: '同意します。', onClick: closeModalHandle },
  { name: '同意しません。', onClick: closeModalHandle },
];

export const Index: ComponentStoryObj<typeof Popup> = {
  args: {
    open: true,
    children: ['タイトル1中身', 'タイトル2中身'],
    buttons: modalButtons,
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

  const buttons = [
    { name: '同意します。', onClick: handleClosePopupClick },
    { name: '同意しません。', onClick: handleClosePopupClick },
  ];

  return (
    <>
      <Button onClick={handleOpenPopupClick}>ポップアップを開く</Button>
      <Popup open={isOpen} buttons={buttons}>
        <StackSection titles={titles} isError>
          <Stack>
            <div>・会計処理日はオープン期間内を設定してください</div>
            <div>・会計処理日はオープン期間内を設定してください</div>
          </Stack>
        </StackSection>
        <StackSection titles={titles} isWarning>
          <Box>Stack1</Box>
        </StackSection>
        <StackSection titles={titles}>
          <Box>Stack1</Box>
          <Box>Stack2</Box>
        </StackSection>
      </Popup>
    </>
  );
};
