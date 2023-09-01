import React, { ChangeEventHandler, FocusEventHandler } from 'react';
import { FieldValues, Path, useController, useFormContext, useWatch } from 'react-hook-form';

import { InputLayout } from 'layouts/InputLayout';

import { StyledTextFiled } from 'controls/TextField';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import Calendar from 'icons/button_calendar.png';

import { Box, IconButton, styled } from '@mui/material';
import {
    BaseSingleInputFieldProps, DatePicker as DatePickerMui, DateValidationError, FieldSection,
    LocalizationProvider, UseDateFieldProps
} from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';

import { ja } from 'date-fns/locale';
import { convertFromDateToDisplay, isInvalidDate, transformWareki } from './DatePickerHelper';

/**
 * DatePickerFieldPropsコンポーネントのProps
 */
interface DatePickerFieldProps
  extends UseDateFieldProps<Date>,
    BaseSingleInputFieldProps<
      Date | null,
      Date,
      FieldSection,
      DateValidationError
    > {
  name?: string;
}

/**
 * DatePickerFieldPropsコンポーネント
 */
const DatePickerField = (props: DatePickerFieldProps) => {
  const {
    name = '',
    disabled,
    readOnly,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
  } = props;

  // form
  const { formState, control } = useFormContext();
  const { field } = useController({ name, control });
  useWatch({ name });

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value;
    // formで値の状態を行うため、DatePickerには値の変更通知を行わない。
    field.onChange(newValue);
  };

  const handleOnBlur: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = () => {
    field.onBlur();
  };

  return (
    <Box ref={containerRef}>
      {startAdornment}
      <StyledTextFiled
        value={field.value}
        disabled={disabled}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        error={!!formState.errors[name]}
        helperText={
          formState.errors[name]?.message
            ? String(formState.errors[name]?.message)
            : null
        }
        InputProps={{
          endAdornment: endAdornment,
          readOnly: readOnly,
        }}
        fullWidth
      />
    </Box>
  );
};

const StyledButton = styled(IconButton)({
  ...theme.palette.calender,
  borderRadius: 0,
  width: 30,
  height: 30,
  marginRight: theme.spacing(-2),
  '&:hover': {
    ...theme.palette.calender,
  },
});

const CalenderIcon = () => {
  return (
    <StyledButton>
      <img src={Calendar}></img>
    </StyledButton>
  );
};

/**
 * DatePickerコンポーネント
 */
export interface DatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  labelPosition?: 'above' | 'side';
  required?: boolean;
  disabled?: boolean;
  withWareki?: boolean;
  size?: 's' | 'm' | 'l' | 'xl';
}

/**
 * DatePickerコンポーネント
 */
export const DatePicker = <T extends FieldValues>(
  props: DatePickerProps<T>
) => {
  const {
    label,
    labelPosition,
    required = false,
    name,
    disabled,
    withWareki,
    size = 's',
  } = props;

  // form
  const { control, getValues } = useFormContext();
  const { field } = useController({ name, control });

  const handleOnAccept = (value: Date | null) => {
    if (value === null) return;
    if (isInvalidDate(value)) return;
    const newValue = convertFromDateToDisplay(value);
    field.onChange(newValue);
    field.onBlur();
  };

  const wareki = transformWareki(new Date(getValues(name)));

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      {withWareki && <Typography>{wareki}</Typography>}
      <LocalizationProvider
        // dateAdapter={AdapterDayjs}
        dateAdapter={AdapterDateFns}
        adapterLocale={ja}
      >
        <DatePickerMui
          {...field}
          value={new Date(field.value)}
          // onChangeでハンドリングするとテキストの変更も検知対象になり、かつ、値が補正されてしまう。
          // ここでは、onAcceptでカレンダーの変更のみを検知し、テキストの変更検知はDatePickerFieldで行う。
          onAccept={handleOnAccept}
          slots={{
            field: DatePickerField,
            openPickerIcon: CalenderIcon,
          }}
          slotProps={{
            field: {
              name,
            } as any,
            layout: {
              sx: {
                '& .MuiPickersCalendarHeader-labelContainer': {
                  fontWeight: 'bold',
                },
                '& .MuiButtonBase-root.MuiPickersDay-root': {
                  '&.Mui-selected': {
                    border: '3px solid #f37246',
                    backgroundColor: '#fde8d4',
                    color: '#000000',
                  },
                },
              },
            },
          }}
          format='yyyy/mm/dd'
          readOnly={control?._options?.context[0]}
          disabled={disabled}
        />
      </LocalizationProvider>
    </InputLayout>
  );
};

