import React from 'react';
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';

import { InputLayout } from 'layouts/InputLayout';

import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import Calendar from 'icons/button_calendar.png';

import { IconButton, Stack, styled } from '@mui/material';
import {
  DatePicker as DatePickerMui,
  LocalizationProvider,
} from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { ja } from 'date-fns/locale';
import dayjs from 'dayjs';

export interface DatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  labelPosition?: 'above' | 'side';
  required?: boolean;
  disabled?: boolean;
  withWareki?: boolean;
  size?: 's' | 'm' | 'l' | 'xl';
}

const StyledButton = styled(IconButton)({
  ...theme.palette.calender,
  borderRadius: 0,
  width: 30,
  height: 30,
  marginRight: theme.spacing(-2),
});

const CalenderIcon = () => {
  return (
    <StyledButton>
      <img src={Calendar}></img>
    </StyledButton>
  );
};

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
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { field } = useController({ name, control });
  const isReadOnly = control?._options?.context[0];

  const isInvalidDate = (date: Date) => Number.isNaN(date.getTime());

  const transformWareki = (date: Date): string => {
    if (isInvalidDate(date)) return '';
    const formatted = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
      era: 'long',
    }).format(date);
    const splitted = formatted.split('/');
    const transformed = `${splitted[0]}年${splitted[1]}月${splitted[2]}日`;
    return transformed;
  };

  const transformYyyymmdd = (date: Date): string => {
    if (isInvalidDate(date)) return '';
    const yyyymmdd = [
      String(date.getFullYear()),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ];
    const transformed = yyyymmdd.join('/');
    return transformed;
  };

  const handleValueChange = (value: Date | null) => {
    if (value === null) return;
    if (isInvalidDate(value)) return;
    field.onChange(transformYyyymmdd(value));
    field.onBlur();
  };

  const wareki = transformWareki(new Date(getValues(name)));
  const helperText = errors[name]?.message
    ? String(errors[name]?.message)
    : null;
  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <Stack spacing={0}>
        {withWareki && <Typography>{wareki}</Typography>}
        <LocalizationProvider
          // dateAdapter={AdapterDayjs}
          dateAdapter={AdapterDateFns}
          adapterLocale={ja}
        >
          <DatePickerMui
            {...field}
            value={new Date(field.value)}
            onChange={handleValueChange}
            // slots={{ textField: TextField }}
            slots={{
              openPickerIcon: CalenderIcon,
            }}
            slotProps={{
              layout: {
                sx: {
                  '& .MuiPickersCalendarHeader-labelContainer': {
                    fontWeight: 'bold',
                  },
                  '& .MuiPickersDay-root': {
                    '&.Mui-selected': {
                      border: '3px solid #f37246',
                      backgroundColor: '#fde8d4',
                      color: '#000000',
                    },
                  },
                },
              },
              textField: {
                helperText: helperText,
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#f37246',
                    },
                  },
                },
              },
            }}
            // format='yyyy/mm/dd'
            readOnly={isReadOnly}
            disabled={disabled}
          />
        </LocalizationProvider>
      </Stack>
    </InputLayout>
  );
};

