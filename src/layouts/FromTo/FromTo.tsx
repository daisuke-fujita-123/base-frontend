import React, { ReactNode } from 'react';

import { InputRowStack, InputStack, LabelStack } from 'layouts/Stack';

import { RequiredLabel } from 'controls/Label';
import { Typography } from 'controls/Typography';

interface FromToProps {
  label: string;
  labelPosition?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode[];
  size?: 's' | 'm' | 'l' | 'xl';
  required?: boolean;
}

export const FromTo = (props: FromToProps) => {
  const {
    label,
    labelPosition = 'column',
    children,
    size = 's',
    required,
  } = props;
  if (labelPosition === 'column') {
    return (
      <InputStack size={size}>
        <LabelStack>
          <Typography bold>{label}</Typography>
          {required && <RequiredLabel />}
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
    <InputStack size={size}>
      <LabelStack>
        <Typography bold>{label}</Typography>
        {required && <RequiredLabel />}
        <InputRowStack>
          {children[0]}
          <Typography>~</Typography>
          {children[1]}
        </InputRowStack>
      </LabelStack>
    </InputStack>
  );
};

