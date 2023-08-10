import React from 'react';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Path,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { Grid } from 'layouts/Grid';
import { InputLayout } from 'layouts/InputLayout';

import { AddIconButton } from 'controls/Button';
import { StyledTextFiled } from 'controls/TextField';
import { theme } from 'controls/theme';

import Pulldown from 'icons/pulldown_arrow.png';

import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  Select as SelectMui,
  styled,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';

export interface SelectValue {
  value: string | number;
  displayValue: string;
}

export interface SelectProps<T extends FieldValues> {
  name: Path<T>;
  selectValues: SelectValue[];
  label?: string;
  labelPosition?: 'above' | 'side';
  multiple?: boolean;
  disabled?: boolean;
  blankOption?: boolean;
  required?: boolean;
  minWidth?: number;
  isAddble?: boolean;
  size?: 's' | 'm' | 'l' | 'xl';
}

export const StyledFormControl = styled(FormControl)(({ error }) => ({
  '& .MuiInputBase-root': {
    ...(error && {
      backgroundColor: theme.palette.error.light,
    }),
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#f37246',
    },
  },
  '& .Mui-disabled': {
    backgroundColor: theme.palette.background.disabled,
  },
}));

export const StyledMenuItem = styled(MenuItem)({
  '&.Mui-selected': {
    backgroundColor: '#0075ff',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0075ff',
    },
  },
});

const PulldownIcon = () => {
  return <img style={{ marginRight: 10 }} src={Pulldown}></img>;
};

export const Select = <T extends FieldValues>(props: SelectProps<T>) => {
  const {
    label,
    labelPosition = 'above',
    multiple = false,
    name,
    selectValues,
    disabled = false,
    blankOption = false,
    required = false,
    minWidth = 100,
    size = 's',
  } = props;

  const { register, formState, control, setValue } = useFormContext();
  const watchValue = useWatch({ name, control });

  // 複数選択された場合、先頭行の空白は削除する
  const omitBlankValue = (val: string[]) => {
    return val.filter((e) => e !== '');
  };
  const isReadOnly = control?._options?.context[0];
  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <Box sx={{ minWidth: minWidth, minHeight: 30 }}>
        {/* 選択肢が10個未満の場合が上段、選択肢が10個以上の場合が下段。10個以上の場合は、選択肢を検索することができる。 */}
        {selectValues.length < 10 ? (
          <StyledFormControl fullWidth error={!!formState.errors[name]}>
            <SelectMui
              disabled={disabled}
              value={multiple ? omitBlankValue(watchValue) : watchValue}
              {...register(name)}
              multiple={multiple}
              sx={{ textAlign: 'left' }}
              inputProps={{
                readOnly: isReadOnly,
              }}
              IconComponent={PulldownIcon}
            >
              {blankOption && <StyledMenuItem value=''>{'　'}</StyledMenuItem>}
              {selectValues.map((option, index) => (
                <StyledMenuItem key={index} value={option.value}>
                  {option.displayValue}
                </StyledMenuItem>
              ))}
            </SelectMui>
            {formState.errors[name]?.message && (
              <FormHelperText>
                {String(formState.errors[name]?.message)}
              </FormHelperText>
            )}
          </StyledFormControl>
        ) : (
          <Autocomplete
            multiple={multiple}
            disabled={disabled}
            limitTags={2}
            size='small'
            options={selectValues}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.displayValue
            }
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            {...register(name)}
            onChange={(e, newValue) => {
              setValue(
                name,
                newValue as FieldPathValue<FieldValues, FieldPath<FieldValues>>
              );
            }}
            value={watchValue}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  label={option.displayValue}
                  size='small'
                  key={index}
                  style={{ maxHeight: 30, marginTop: -3, marginRight: 4 }}
                />
              ))
            }
            renderInput={(params) => (
              <StyledTextFiled
                {...params}
                error={!!formState.errors[name]}
                helperText={
                  formState.errors[name]?.message
                    ? String(formState.errors[name]?.message)
                    : null
                }
              />
            )}
          />
        )}
      </Box>
    </InputLayout>
  );
};

export const AddbleSelect = <T extends FieldValues>(props: SelectProps<T>) => {
  const {
    label,
    labelPosition = 'above',
    name,
    selectValues,
    disabled = false,
    blankOption = false,
    required = false,
    minWidth = 100,
    size = 's',
  } = props;

  const { register, formState, control, setValue } = useFormContext();
  const isReadOnly = control?._options?.context[0];
  const watchValue = useWatch({ name, control });
  const selectList = [...watchValue];
  const handleClick = () => {
    setValue(name, [...selectList, ''] as FieldPathValue<
      FieldValues,
      FieldPath<FieldValues>
    >);
  };
  if (!watchValue) return <></>;
  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <Grid container width={490}>
        <Grid item xs={11}>
          {watchValue?.map((val: string, index: number) => {
            return (
              <Box key={index} mb={2}>
                <Box sx={{ minWidth: minWidth, minHeight: 30 }}>
                  <StyledFormControl fullWidth error={!!formState.errors[name]}>
                    <SelectMui
                      disabled={disabled}
                      defaultValue={val}
                      {...register(name, {
                        onChange: (e) =>
                          setValue(
                            name,
                            selectList.map((value: string, rowIndex: number) =>
                              rowIndex === index ? e.target.value : value
                            ) as FieldPathValue<
                              FieldValues,
                              FieldPath<FieldValues>
                            >
                          ),
                      })}
                      sx={{ textAlign: 'left' }}
                      inputProps={{
                        readOnly: isReadOnly,
                      }}
                      IconComponent={PulldownIcon}
                    >
                      {blankOption && <MenuItem value=''>{'　'}</MenuItem>}
                      {selectValues.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.displayValue}
                        </MenuItem>
                      ))}
                    </SelectMui>
                    {formState.errors[name]?.message && (
                      <FormHelperText>
                        {String(formState.errors[name]?.message)}
                      </FormHelperText>
                    )}
                  </StyledFormControl>
                </Box>
              </Box>
            );
          })}
        </Grid>
        <Grid item xs={1}>
          <Box mb={2}>
            <AddIconButton onClick={handleClick} />
          </Box>
        </Grid>
      </Grid>
    </InputLayout>
  );
};

