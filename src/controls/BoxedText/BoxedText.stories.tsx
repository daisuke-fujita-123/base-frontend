import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { ColStack, RowStack } from 'layouts/Stack';

import { BoxedText, BoxedTextLabel } from 'controls/BoxedText';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import { ThemeProvider } from '@mui/material';

export default {
  component: BoxedText,
  parameters: { controls: { expanded: true } },
} as ComponentMeta<typeof BoxedText>;

export const Example = () => {
  const yonrinLabels: BoxedTextLabel[] = [
    {
      label: '通常',
      field: 'tsujo',
    },
    {
      label: '延長',
      field: 'encho',
    },
    {
      label: '総請求残高',
      field: 'soSeikyuZandaka',
    },
    {
      label: undefined,
    },
    {
      label: '書類未到着',
      field: 'shoruiMitouchaku',
    },
  ];

  const omatomeLabels: BoxedTextLabel[] = [
    {
      label: '通常',
      field: 'tsujo',
    },
    {
      label: '延長',
      field: 'encho',
    },
    {
      label: '総請求残高',
      field: 'soSeikyuZandaka',
    },
  ];

  const yonrinValues = {
    tsujo: '1,200,000',
    encho: '0',
    soSeikyuZandaka: '1,200,000',
    shoruiMitouchaku: '1,100,000',
  };

  const omatomeValues = {
    tsujo: '500,000',
    encho: '0',
    soSeikyuZandaka: '500,000',
  };

  const hendleGetValueColor = (field: string, value: string) => {
    if (field === 'shoruiMitouchaku' && value === '1,100,000') return '#FF0000';
    return undefined;
  };

  const handleGetFieldBackgroundColor = (field: string) => {
    if (field === 'encho') return '#CCCCCC';
    return undefined;
  };

  return (
    <ThemeProvider theme={theme}>
      <RowStack>
        <ColStack>
          <Typography>四輪</Typography>
          <BoxedText
            labels={yonrinLabels}
            values={yonrinValues}
            getValueColor={hendleGetValueColor}
            getFieldBackgroundColor={handleGetFieldBackgroundColor}
          />
        </ColStack>
        <ColStack>
          <Typography>おまとめ</Typography>
          <BoxedText
            labels={omatomeLabels}
            values={omatomeValues}
            backgroundColor='#CCCCCC'
          />
        </ColStack>
      </RowStack>
    </ThemeProvider>
  );
};
