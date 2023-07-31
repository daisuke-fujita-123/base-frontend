import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React from 'react';

import { theme } from 'controls/theme';

import { Divider, TableDivider, TableSpaceDivider } from './Divider';

export default {
  component: Divider,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof Divider>;

export const Index: ComponentStoryObj<typeof Divider> = {};

export const Example = () => {
  return (
    <div style={{ backgroundColor: theme.palette.background.disabled }}>
      <Divider />
      <TableDivider />
      <TableSpaceDivider />
    </div>
  );
};

