import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

interface CheckBoxOptions {
  value: string;
  valueLabel: string;
  defaultChecked?: boolean;
  disabled: boolean;
}
export interface CheckBoxProps<T extends FieldValues> {
  name: Path<T>;
  required?: boolean;
  checkOptions: CheckBoxOptions[];
}

export const CheckBox = <T extends FieldValues>(props: CheckBoxProps<T>) => {
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
              control={<Checkbox defaultChecked={value.defaultChecked} />}
              label={value.valueLabel}
              disabled={isReadOnly}
              {...register(name)}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

