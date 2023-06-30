import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

import { FormHelperText, styled, TextareaAutosize } from '@mui/material';

export interface TextareaProps<T extends FieldValues> {
  name: Path<T>;
  disabled?: boolean;
  maxRows?: number;
  minRows?: number;
  size?: 's' | 'm' | 'l' | 'xl';
}

export const StyledTextArea = styled(TextareaAutosize)({
  width: 'inherit',
  padding: '0 0 0 8px',
  border: '1px solid #bbbbbb',
  fontFamily: ['メイリオ', 'Meiryo'].join(','),
  fontSize: 13,
});

export const Textarea = <T extends FieldValues>(props: TextareaProps<T>) => {
  const { name, disabled = false, maxRows, minRows, size = 's' } = props;
  const { register, formState, control } = useFormContext();
  const isReadOnly = control?._options?.context[0];

  const areaWidth = () => {
    if (size === 's') return 225;
    else if (size === 'm') return 490;
    else if (size === 'l') return 755;
    else if (size === 'xl') return 1550;
    else return 225;
  };

  return (
    <>
      <StyledTextArea
        {...register(name)}
        disabled={disabled}
        maxRows={maxRows}
        minRows={minRows}
        readOnly={isReadOnly}
        style={{ width: areaWidth() }}
      ></StyledTextArea>
      <FormHelperText>
        {formState.errors[name]?.message
          ? String(formState.errors[name]?.message)
          : null}
      </FormHelperText>
    </>
  );
};

