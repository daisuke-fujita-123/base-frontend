import { ComponentMeta } from '@storybook/react';
import { MainLayout } from './MainLayout';
import React from 'react';
export default {
  component: MainLayout,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'メインレイアウト内で表示する要素',
    },
    MainItem: {
      description: 'MainItemとして表示したいエレメントの親コンポーネントのpropsに設定。',
    },
    RightSideItem: {
      description: 'RightSideItemとして表示したいエレメントの親コンポーネントのpropsに設定。',
    },
    rightSpace: {
      description:
        'RightSideItem内で上下にアイテムを分割したい場合にこのpropsを設定してメインレイアウトコンポーネントを呼び出す。',
    },
    FooterItem: {
      description: 'FooterItemとして表示したいエレメントの親コンポーネントのpropsに設定',
    },
    component: {
      description: 'formタグで囲みたい範囲にpropsとして指定',
    },
    onSubmit: {
      description: 'formタグで囲んだ場合にbutton押下時のイベント定義',
    },
  },
} as ComponentMeta<typeof MainLayout>;

// 入れ子構造になっているコンポーネントなのでsampleのみ。
export const Example = () => {
  return (
    <MainLayout>
      <MainLayout main>
        <p>私はメインアイテム内のコンテンツです。</p>
      </MainLayout>
      <MainLayout right>
        <p>私はライトサイドバー内のコンテンツです。</p>
        <p>私はライトサイドバー内のコンテンツです。</p>
      </MainLayout>
      <MainLayout bottom>フッターです。</MainLayout>
    </MainLayout>
  );
};
