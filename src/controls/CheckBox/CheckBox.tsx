import React, { ReactNode } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

import { MarginBox } from 'layouts/Box';
import { InputLayout } from 'layouts/InputLayout';

import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import {
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  styled,
} from '@mui/material';

export interface CheckBoxProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  required?: boolean;
  children?: ReactNode;
  blank?: boolean;
  size?: 's' | 'm' | 'l' | 'xl';
}

const StyledFormControl = styled(FormControl)({
  flexDirection: 'row',
  alignItems: 'flex-end',
  height: 30,
});

const StyledFormControlLabel = styled(FormControlLabel)({
  margin: 0,
  '& .MuiFormControlLabel-label': {
    fontWeight: 'bold',
  },
});

const StyledCheckbox = styled(MuiCheckbox)({
  margin: 0,
  marginRight: theme.spacing(1),
  marginTop: theme.spacing(-0.4),
  width: 13,
  height: 13,
});

export const Checkbox = <T extends FieldValues>(props: CheckBoxProps<T>) => {
  const { name, label, required, children, blank = false, size = 's' } = props;

  const { register, formState, control } = useFormContext();
  const defaultChecked = formState.defaultValues?.[name];

  const isReadOnly = control?._options?.context[0];

  const isBlank = blank ? '　' : '';
  return (
    <InputLayout label={isBlank} size={size}>
      <StyledFormControl error={!!formState.errors[name]}>
        <StyledFormControlLabel
          label={label}
          id={name}
          required={required}
          control={<StyledCheckbox defaultChecked={defaultChecked} />}
          disabled={isReadOnly}
          {...register(name)}
        />
      </StyledFormControl>
      <MarginBox justifyContent='flex-start' ml={3.6}>
        <Typography>{children}</Typography>
      </MarginBox>
    </InputLayout>
  );
};

