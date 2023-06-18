import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

import TextareaAutosize from '@mui/base/TextareaAutosize';
import { FormHelperText } from '@mui/material';

export interface TextareaProps<T extends FieldValues> {
  name: Path<T>;
  disabled?: boolean;
  maxRows?: number;
  minRows?: number;
}
export const Textarea = <T extends FieldValues>(props: TextareaProps<T>) => {
  const { name, disabled = false, maxRows, minRows } = props;
  const { register, formState, control } = useFormContext();
  const isReadOnly = control?._options?.context[0];
  return (
    <>
      <TextareaAutosize
        {...register(name)}
        disabled={disabled}
        maxRows={maxRows}
        minRows={minRows}
        readOnly={isReadOnly}
      ></TextareaAutosize>
      <FormHelperText sx={{ color: 'red' }}>
        {formState.errors[name]?.message
          ? String(formState.errors[name]?.message)
          : null}
      </FormHelperText>
    </>
  );
};

