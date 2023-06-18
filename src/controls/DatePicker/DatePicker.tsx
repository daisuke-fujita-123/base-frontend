import React, { useState } from 'react';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';

import { InputLayout } from 'layouts/InputLayout';

import { StyledTextFiled } from 'controls/TextField';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import { Stack, styled } from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export interface DatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  labelPosition?: 'above' | 'side';
  required?: boolean;
  disabled?: boolean;
  wareki?: boolean;
}

const TextField = styled(StyledTextFiled)({
  '& .MuiIconButton-root': {
    ...theme.palette.calender,
    borderRadius: 0,
    padding: theme.spacing(1.2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(-2.8),
  },
});

export const DatePicker = <T extends FieldValues>(
  props: DatePickerProps<T>
) => {
  const {
    label,
    labelPosition,
    required = false,
    name,
    disabled,
    wareki,
  } = props;

  const { register, formState, setValue, watch, control } = useFormContext();
  const crrentValue = watch(name);

  // 和暦表示用の文字列を作成
  const [warekiDisplay, setWarekiDisplay] = useState<string>('');
  const warekiExcahnger = (data: PathValue<T, Path<T>> | null) => {
    if (!wareki && data !== null) {
      return;
    } else if (data !== null) {
      const warekiString = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
        era: 'long',
      }).format(data);
      const warekiSplitted = warekiString.split('/');
      const formattedWareki = `${warekiSplitted[0]}年${warekiSplitted[1]}月${warekiSplitted[2]}日`;
      setWarekiDisplay(formattedWareki);
    }
  };

  // 日付を文字列に変換
  const transformFromDateToString = (
    dateString: PathValue<T, Path<T>> | null
  ) => {
    const date = new Date(String(dateString));
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return formattedDate;
  };

  const isReadOnly = control?._options?.context[0];

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
    >
      <Stack spacing={0}>
        <Typography>{warekiDisplay}</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
          <DatePickerMui
            {...register(name)}
            disabled={disabled}
            inputFormat='YYYY/MM/DD'
            onChange={(data) => {
              const parsedDate = transformFromDateToString(data);
              warekiExcahnger(data);
              setValue(
                name,
                parsedDate as FieldPathValue<
                  FieldValues,
                  FieldPath<FieldValues>
                >
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!formState.errors[name]}
                helperText={
                  formState.errors[name]?.message
                    ? String(formState.errors[name]?.message)
                    : null
                }
              />
            )}
            renderDay={(day, selectedDays, pickersDayProps) => {
              const selected =
                selectedDays.length !== 0 &&
                day.$d.getTime() === selectedDays[0].$d.getTime();
              return (
                <PickersDay
                  {...pickersDayProps}
                  style={{
                    border: selected ? '3px solid #f37246' : 'transparent',
                    backgroundColor: selected ? '#fde8d4' : 'transparent',
                    color: '#000000',
                  }}
                />
              );
            }}
            value={crrentValue}
            readOnly={isReadOnly}
          />
        </LocalizationProvider>
      </Stack>
    </InputLayout>
  );
};

