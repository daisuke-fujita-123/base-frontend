import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Popup } from 'layouts/Popup';

import { Button } from '@mui/material';

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
    titles: ['タイトル1', 'タイトル2'],
    children: ['タイトル1中身', 'タイトル2中身'],
    buttons: modalButtons,
  },
};

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  const titles = ['タイトル1', 'タイトル2'];

  const handleOpenPopupClick = () => {
    setIsOpen(true);
  };

  const handleClosePopupClick = () => {
    setIsOpen(false);
  };

  const Buttons = [
    { name: '同意します。', onClick: handleClosePopupClick },
    { name: '同意しません。', onClick: handleClosePopupClick },
  ];

  return (
    <>
      <Button onClick={handleOpenPopupClick}>ポップアップを開く</Button>
      <Popup open={isOpen} titles={titles} buttons={Buttons}>
        <div>タイトル1中身</div>
        <div>タイトル2中身</div>
      </Popup>
    </>
  );
};
