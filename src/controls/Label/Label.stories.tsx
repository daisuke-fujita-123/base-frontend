import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { CaptionLabel, RequiredLabel, WarningLabel } from './Label';

export default {
  component: RequiredLabel,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof RequiredLabel>;

export const Example = () => {
  return (
    <>
      <RequiredLabel />
      <WarningLabel text='変更予約あり' />
      <CaptionLabel text='見出し' />
    </>
  );
};

