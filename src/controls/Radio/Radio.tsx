import React from 'react';
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';

import { InputLayout } from 'layouts/InputLayout';

import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio as MuiRadio,
  RadioGroup,
} from '@mui/material';

interface RadioValue {
  value: string | number | boolean;
  displayValue: string;
  backgroundColor?: string;
}
export interface RadioProps<T extends FieldValues> {
  name: Path<T>;
  radioValues: RadioValue[];
  label?: string;
  size?: 's' | 'm' | 'l' | 'xl';
  labelPosition?: 'above' | 'side';
  required?: boolean;
  disabled?: boolean;
  column?: boolean;
}

export const Radio = <T extends FieldValues>(props: RadioProps<T>) => {
  const {
    name,
    label,
    size = 's',
    labelPosition,
    column = false,
    required = false,
    disabled = false,
    radioValues,
  } = props;

  const { formState, control } = useFormContext();
  const { field } = useController({ name, control });

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <FormControl error={!!formState.errors[name]}>
        <RadioGroup row={!column} {...field}>
          {radioValues.map((value, index) => (
            <FormControlLabel
              sx={{
                '&.MuiFormControlLabel-root .MuiFormControlLabel-label': {
                  backgroundColor: value.backgroundColor
                    ? value.backgroundColor
                    : 'transparent',
                },
              }}
              key={index}
              value={value.value}
              label={value.displayValue}
              control={
                <MuiRadio
                  readOnly={control?._options?.context?.readonly}
                  disabled={disabled}
                />
              }
            />
          ))}
        </RadioGroup>
        {formState.errors[name]?.message && (
          <FormHelperText>
            {String(formState.errors[name]?.message)}
          </FormHelperText>
        )}
      </FormControl>
    </InputLayout>
  );
};

