import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Divider } from './Divider';
import React from 'react';
export default {
  component: Divider,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof Divider>;

export const Index: ComponentStoryObj<typeof Divider> = {};

export const Example = () => {
  return <Divider />;
};
