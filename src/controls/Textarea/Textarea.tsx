import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

import { FormHelperText, styled, TextareaAutosize } from '@mui/material';

export interface TextareaProps<T extends FieldValues> {
  name: Path<T>;
  disabled?: boolean;
  maxRows?: number;
  minRows?: number;
}

export const StyledTextArea = styled(TextareaAutosize)({
  width: '100%',
  height: '100%',
  padding: '0 0 0 8px',
  border: '1px solid #bbbbbb',
  fontFamily: ['メイリオ', 'Meiryo'].join(','),
  fontSize: 13,
});

export const Textarea = <T extends FieldValues>(props: TextareaProps<T>) => {
  const { name, disabled = false, maxRows, minRows } = props;
  const { register, formState, control } = useFormContext();
  const isReadOnly = control?._options?.context[0];
  return (
    <>
      <StyledTextArea
        {...register(name)}
        disabled={disabled}
        maxRows={maxRows}
        minRows={minRows}
        readOnly={isReadOnly}
      ></StyledTextArea>
      <FormHelperText sx={{ color: 'red' }}>
        {formState.errors[name]?.message
          ? String(formState.errors[name]?.message)
          : null}
      </FormHelperText>
    </>
  );
};

