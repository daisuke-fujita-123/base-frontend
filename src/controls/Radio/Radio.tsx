import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

import { InputLayout } from 'layouts/InputLayout';

import {
  FormControl,
  FormHelperText,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';

interface RadioValue {
  value: string | number;
  displayValue: string;
  disabled?: boolean;
}
export interface RadioProps<T extends FieldValues> {
  name: Path<T>;
  radioValues: RadioValue[];
  label?: string;
  labelPosition?: 'above' | 'side';
  required?: boolean;
  row?: boolean;
}

export const Radio = <T extends FieldValues>(props: RadioProps<T>) => {
  const {
    label,
    labelPosition,
    required = false,
    name,
    radioValues,
    row = true,
  } = props;

  const { register, formState, control } = useFormContext();

  const isReadOnly = control?._options?.context[0];
  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
    >
      <FormControl error={!!formState.errors[name]}>
        <RadioGroup row={row} {...register(name)}>
          {radioValues.map((value, index) => {
            return (
              <Stack
                key={index}
                spacing={3}
                direction='row'
                marginRight={2}
                marginTop={1}
                marginBottom={1}
              >
                <input
                  key={index}
                  type='radio'
                  disabled={isReadOnly}
                  value={value.value}
                  {...register(name)}
                />
                <Typography variant='h6' fontSize={'1rem'}>
                  {value.displayValue}
                </Typography>
              </Stack>
            );
          })}
        </RadioGroup>
        <FormHelperText>
          {formState.errors[name]?.message
            ? String(formState.errors[name]?.message)
            : null}
        </FormHelperText>
      </FormControl>
    </InputLayout>
  );
};

