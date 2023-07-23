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
  value: string | number;
  displayValue: string;
  disabled?: boolean;
}
export interface RadioProps<T extends FieldValues> {
  name: Path<T>;
  radioValues: RadioValue[];
  label?: string;
  size?: 's' | 'm' | 'l' | 'xl';
  labelPosition?: 'above' | 'side';
  required?: boolean;
  row?: boolean;
}

export const Radio = <T extends FieldValues>(props: RadioProps<T>) => {
  const {
    name,
    label,
    size = 's',
    labelPosition,
    row = false,
    required = false,
    radioValues,
  } = props;

  const { formState, control } = useFormContext();
  const { field } = useController({ name, control });
  const isReadOnly = control?._options?.context[0];

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <FormControl error={!!formState.errors[name]}>
        <RadioGroup row={row} {...field}>
          {radioValues.map((value, index) => (
            <FormControlLabel
              key={index}
              value={value.value}
              label={value.displayValue}
              control={<MuiRadio readOnly={isReadOnly} />}
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

