import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React from 'react';

import { TabDef, Tabs } from './Tabs';

export default {
  component: Tabs,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'タブ内のエレメントの配列',
    },
    tabDef: {
      description: 'タブの中身。titleはタブ名、disabledは移動可否',
    },
  },
} as ComponentMeta<typeof Tabs>;

const sampleChildren = [
  <h3 key='1'>料金情報</h3>,
  <h3 key='2'>期日情報</h3>,
  <h3 key='3'>ライブ情報</h3>,
];

const tabDefs: TabDef[] = [
  { title: '料金情報', hash: 'A' },
  { title: '期日情報', hash: 'B' },
  { title: '基本情報', hash: 'C' },
];

const hash = '';

export const Index: ComponentStoryObj<typeof Tabs> = {
  args: {
    tabDef: tabDefs,
    children: sampleChildren,
  },
};

export const Example = () => {
  return (
    <>
      <Tabs tabDef={tabDefs} defaultValue={hash}>
        <h3>料金情報</h3>
        <h3>期日情報</h3>
        <h3>ライブ情報</h3>
      </Tabs>
    </>
  );
};

