import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { Stack } from 'layouts/Stack';

import { CaptionLabel, RequiredLabel, WarningLabel } from './Label';

export default {
  component: RequiredLabel,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof RequiredLabel>;

export const Example = () => {
  return (
    <Stack>
      <RequiredLabel />
      <WarningLabel text='変更予約あり' />
      <WarningLabel text='変更予約あり' header />
      <CaptionLabel text='見出し' />
    </Stack>
  );
};

