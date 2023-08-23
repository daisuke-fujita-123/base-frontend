import React from 'react';

import { InputStack, LabelStack } from 'layouts/Stack';

import { RequiredLabel } from 'controls/Label';
import { Typography } from 'controls/Typography';

import { FormControl, Grid, styled } from '@mui/material';

interface InputLayoutProps {
  children: React.ReactNode | React.ReactNode[];
  label?: string;
  labelPosition?: 'above' | 'side';
  required?: boolean;
  size: 's' | 'm' | 'l' | 'xl';
}

export const InputLayout = (props: InputLayoutProps) => {
  const {
    label,
    children,
    labelPosition = 'above',
    required,
    size = 's',
  } = props;
  return (
    <>
      {label === undefined ? (
        children
      ) : labelPosition === 'above' ? (
        <InputStack size={size}>
          <LabelStack>
            <Typography bold>{label}</Typography>
            {required && <RequiredLabel />}
          </LabelStack>
          {children}
        </InputStack>
      ) : (
        labelPosition === 'side' && (
          <InputStack size={size}>
            <Grid container justifyContent='space-between'>
              <Grid item xs={2} container flexDirection='row'>
                <Typography bold>{label}</Typography>
                {required && <RequiredLabel />}
              </Grid>
              <Grid item xs={10}>
                {children}
              </Grid>
            </Grid>
          </InputStack>
        )
      )}
    </>
  );
};

interface BlankLayout {
  size?: 's' | 'm' | 'l' | 'xl';
  quantity?: number;
}

const StyledFormControl = styled(FormControl)({
  flexDirection: 'row',
  alignItems: 'flex-end',
  height: 30,
});
export const BlankLayout = (props: BlankLayout) => {
  const { size = 's', quantity = 1 } = props;
  const blank = Array.from({ length: quantity }, (_, index) => {
    return (
      <InputStack size={size} key={index}>
        <LabelStack>
          <Typography>{'　'}</Typography>
        </LabelStack>
        <StyledFormControl>{'　'}</StyledFormControl>
      </InputStack>
    );
  });
  return <>{blank}</>;
};

