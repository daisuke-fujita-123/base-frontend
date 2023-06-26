import React, { ReactNode } from 'react';

import { InputRowStack, InputStack, LabelStack } from 'layouts/Stack';

import { Typography } from 'controls/Typography';

interface FromToProps {
  label: string;
  labelPosition?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode[];
}

export const FromTo = (props: FromToProps) => {
  const { label, labelPosition = 'column', children } = props;
  if (labelPosition === 'column') {
    return (
      <InputStack>
        <LabelStack>
          <Typography bold>{label}</Typography>
        </LabelStack>
        <InputRowStack>
          {children[0]}
          <Typography>~</Typography>
          {children[1]}
        </InputRowStack>
      </InputStack>
    );
  }
  return (
    <InputStack>
      <LabelStack>
        <Typography bold>{label}</Typography>
        <InputRowStack>
          {children[0]}
          <Typography>~</Typography>
          {children[1]}
        </InputRowStack>
      </LabelStack>
    </InputStack>
  );
};

