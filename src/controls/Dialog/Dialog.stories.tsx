import React, { useState } from 'react';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Button } from '@mui/material';
import { Dialog } from 'controls/Dialog';

export default {
  component: Dialog,
  parameters: { controls: { expanded: true } },
  argTypes: {
    open: {
      description: 'ダイアログの表示／非表示',
    },
    title: {
      description: 'ダイアログのtitle文',
    },
    buttons: {
      description: '右下に配置するボタンオブジェクト。nameはボタンの表示名、onClickはonClick時のイベント。',
    },
  },
} as ComponentMeta<typeof Dialog>;

const closeDialogHandle = () => {
  console.log('ダイアログを閉じたいです。');
};

const buttons = [
  { name: '同意します。', onClick: closeDialogHandle },
  { name: '同意しません。', onClick: closeDialogHandle },
];

export const Index: ComponentStoryObj<typeof Dialog> = {
  args: {
    open: true,
    title: 'ダイアログのタイトルです。',
    buttons: buttons,
  },
};

export const Example = () => {
  const [handleDialog, setHandleDialog] = useState(false);

  const title = 'ダイアログのタイトルです。';

  // openDialogHandleとcloseDialogHandleを1つの関数にリファクタリングしたい。
  const openDialogHandle = () => {
    setHandleDialog(true);
  };

  const closeDialogHandle = () => {
    setHandleDialog(false);
  };

  const buttons = [
    { name: '同意します。', onClick: closeDialogHandle },
    { name: '同意しません。', onClick: closeDialogHandle },
  ];

  return (
    <>
      <Button onClick={openDialogHandle}>ダイアログを開く</Button>
      <Dialog open={handleDialog} title={title} buttons={buttons} />
    </>
  );
};
