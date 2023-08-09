import React from 'react';
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';

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
  helperText?: string;
  size?: 's' | 'm' | 'l' | 'xl';
  required?: boolean;
  disabled?: boolean;
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
  const {
    name,
    label,
    helperText,
    size = 's',
    required = false,
    disabled = false,
  } = props;

  // form
  const { formState, control } = useFormContext();
  const { field } = useController({ name, control });
  const isReadOnly = control?._options?.context[0];

  return (
    <InputLayout label={''} size={size}>
      <StyledFormControl error={!!formState.errors[name]}>
        <StyledFormControlLabel
          control={<StyledCheckbox checked={field.value} />}
          label={label}
          required={required}
          disabled={disabled || isReadOnly}
          {...field}
          style={{ whiteSpace: 'nowrap' }}
        />
      </StyledFormControl>
      {helperText && (
        <MarginBox justifyContent='flex-start' ml={3.6}>
          <Typography color='inherit'>{helperText}</Typography>
        </MarginBox>
      )}
    </InputLayout>
  );
};

