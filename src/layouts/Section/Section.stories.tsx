import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Section } from './Section';
import React from 'react';
import { Icon } from 'controls/Icon';
export default {
  component: Section,
  parameters: { controls: { expanded: true } },
  argTypes: {
    name: {
      description: 'Accordionのタイトル名。名前なしで渡すと、アコーディオンなしで背景をグレーにする。',
    },
    children: {
      description: 'Accordion内で表示する要素',
    },
    decoration: {
      description:
        'アコーディオンの右端で要素を表示したい場合に指定する。(例：共通管理>商品管理>コース詳細画面の基本情報タブのサービス一覧のアコーディオン',
    },
  },
} as ComponentMeta<typeof Section>;
const exampleOnClickFunction = (event: React.MouseEvent<HTMLElement>) => {
  console.log(event);
};
const decoration = (
  <>
    <Icon iconName='削除' iconType='delete' onClick={exampleOnClickFunction} />
    <Icon iconName='追加' iconType='add' onClick={exampleOnClickFunction} />
  </>
);
export const Index: ComponentStoryObj<typeof Section> = {
  args: {
    name: '取引会計一覧',
    children: <h1>こんにちは</h1>,
    decoration: decoration,
  },
};
export const Example = () => {
  const decoration = (
    <>
      <Icon iconName='削除' iconType='delete' onClick={exampleOnClickFunction} />
      <Icon iconName='追加' iconType='add' onClick={exampleOnClickFunction} />
    </>
  );
  return (
    <Section name='取引会計一覧' decoration={decoration}>
      <ul>
        <li>マスタ一覧</li>
        <li>ワークリスト</li>
        <li>帳票管理</li>
      </ul>
    </Section>
  );
};
