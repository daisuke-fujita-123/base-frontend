import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Icon } from './Icon';
import React from 'react';
import { action } from '@storybook/addon-actions';
export default {
  component: Icon,
  parameters: { controls: { expanded: true } },
  argTypes: {
    iconType: {
      description: '表示するアイコンの種類(インポートとエクスポートアイコンは画像を指定されたら追加する。)',
    },
    iconName: {
      description: 'アイコンの下に表示する名前',
    },
    disabled: {
      description: '使用可否',
      defaultValue: { summary: 'false' },
    },
    onClick: {
      description: '押下時のイベント定義',
    },
  },
} as ComponentMeta<typeof Icon>;

export const Index: ComponentStoryObj<typeof Icon> = {
  args: {
    iconName: '削除',
    iconType: 'delete',
    disabled: false,
    onClick: action('アイコンボタンが押下されました。'),
  },
};

export const Example = () => {
  const exampleOnClickFunction = () => {
    console.log('アイコンを押下しました。');
  };
  return <Icon iconName='追加' iconType='add' onClick={exampleOnClickFunction} disabled={false} />;
};
