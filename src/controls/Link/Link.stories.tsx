import React from 'react';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Link } from './Link';

export default {
  component: Link,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'Link化させたいエレメント',
    },
    href: {
      description: '遷移先のURL',
    },
    underline: {
      description: 'Linkの下に線を引くか',
      defaultValue: { summary: 'always' },
    },
    color: {
      description: 'Link化した文字列の色',
      defaultValue: { summary: '#00C2FF' },
    },
  },
} as ComponentMeta<typeof Link>;

const sampleJst = 'リンク';

export const Index: ComponentStoryObj<typeof Link> = {
  args: {
    children: sampleJst,
    href: '#',
    underline: 'always',
    color: '#00C2FF',
  },
};

export const Example = () => {
  const handleClick = (pathname: string) => {
    console.log('on click: pathname = ' + pathname);
  };

  return (
    <Link href='#' underline='always' color='#00C2FF' onClick={handleClick}>
      リンク
    </Link>
  );
};
