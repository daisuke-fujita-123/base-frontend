import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';
import React from 'react';

export default {
  component: Breadcrumbs,
  parameters: { controls: { expanded: true } },
  argTypes: {
    breadCrumbs: {
      name: 'breadCrumbs',
      description:
        'パンくずリストの中身の値を配列化したもの。"name"はパンくずリストの表示名、"href"は遷移先URL, moveableはtrueの場合は青色表示で遷移可能、falseの場合は黒色表示で遷移不可能。',
    },
    handlerPageTransition: {
      name: 'handlerPageTransition',
      description: 'ページ遷移を行う関数',
    },
  },
} as ComponentMeta<typeof Breadcrumbs>;

const propsBreadcrumbsSample = [
  { name: '共通管理', href: '/', movable: true },
  { name: '商品管理', href: '/', movable: true },
  { name: 'コース詳細', href: '/', movable: false },
];

export const Index: ComponentStoryObj<typeof Breadcrumbs> = {
  args: {
    breadCrumbs: propsBreadcrumbsSample,
  },
};

export const Example = () => {
  const handlerPageTransition = (href: string) => {
    console.log(href);
  };
  const propsBreadcrumbsSample = [
    { name: '共通管理', href: '/', movable: true },
    { name: '商品管理', href: '/', movable: true },
    { name: 'コース詳細', href: '/', movable: false },
  ];
  return <Breadcrumbs breadCrumbs={propsBreadcrumbsSample}></Breadcrumbs>;
};
