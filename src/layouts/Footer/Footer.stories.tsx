import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Footer } from './Footer';
import React from 'react';
export default {
  component: Footer,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: 'footer内で表示するエレメント',
    },
  },
} as ComponentMeta<typeof Footer>;
const ChildrenSample = [<h1 key={1}>footerElement1</h1>, <h1 key={2}>footerElement2</h1>];
export const Index: ComponentStoryObj<typeof Footer> = {
  args: { children: ChildrenSample },
};
export const Example = () => {
  return (
    <Footer>
      <h1>footerElement1</h1>
      <h1>footerElement2</h1>
    </Footer>
  );
};
