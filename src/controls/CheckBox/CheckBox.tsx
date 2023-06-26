import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

import {
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from '@mui/material';

interface CheckBoxOptions {
  value?: string;
  displayValue: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}
export interface CheckBoxProps<T extends FieldValues> {
  name: Path<T>;
  required?: boolean;
  checkOptions: CheckBoxOptions[];
}

export const Checkbox = <T extends FieldValues>(props: CheckBoxProps<T>) => {
  const { name, required, checkOptions } = props;

  const { register, formState, control } = useFormContext();

  const isReadOnly = control?._options?.context[0];
  return (
    <FormControl error={!!formState.errors[name]}>
      <FormGroup>
        {checkOptions.map((value, index) => {
          return (
            <FormControlLabel
              key={index}
              id={name}
              value={value.value}
              required={required}
              control={<MuiCheckbox defaultChecked={value.defaultChecked} />}
              label={value.displayValue}
              disabled={isReadOnly}
              {...register(name)}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

