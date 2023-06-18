import React from 'react';

import { InputStack, LabelStack } from 'layouts/Stack';

import { RequiredLabel } from 'controls/Label';
import { Typography } from 'controls/Typography';

import { Grid } from '@mui/material';

interface InputLayoutProps {
  children: React.ReactNode | React.ReactNode[];
  label?: string;
  labelPosition?: 'above' | 'side';
  required?: boolean;
}

export const InputLayout = (props: InputLayoutProps) => {
  const { label, children, labelPosition = 'above', required } = props;
  return (
    <>
      {label === undefined ? (
        children
      ) : labelPosition === 'above' ? (
        <InputStack>
          <LabelStack>
            <Typography>{label}</Typography>
            {required && <RequiredLabel />}
          </LabelStack>
          {children}
        </InputStack>
      ) : (
        labelPosition === 'side' && (
          <InputStack>
            <Grid container justifyContent='space-between'>
              <Grid item xs={2} container flexDirection='row'>
                <Typography>{label}</Typography>
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

