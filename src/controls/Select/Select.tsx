import React, { useEffect, useRef, useState } from 'react';
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
import { RowStack } from 'layouts/Stack';

import { AddIconButton } from 'controls/Button';
import { StyledTextFiled } from 'controls/TextField';
import { theme } from 'controls/theme';

import {
  Box,
  FormControl,
  FormHelperText,
  ListSubheader,
  Select as SelectMui,
  styled,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Pulldown from 'icons/pulldown_arrow.png';

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
  multi?: { name: Path<T>; selectValues: SelectValue[] }[];
  limit?: number;
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

  const { register, formState, control } = useFormContext();
  const watchValue = useWatch({ name, control });
  const sectionRef = useRef<HTMLSelectElement>();

  // バイト数取得
  const strLength = (str: string) => {
    let count = 0,
      c = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      c = str.charCodeAt(i);
      if (
        (c >= 0x0 && c < 0x81) ||
        c == 0xf8f0 ||
        (c >= 0xff61 && c < 0xffa0) ||
        (c >= 0xf8f1 && c < 0xf8f4)
      ) {
        count += 1;
      } else {
        count += 2;
      }
    }
    return count;
  };

  // 選択項目表示
  const renderValue = (val: string[] | string) => {
    // 単一選択
    if (!Array.isArray(val)) {
      const selectValue = selectValues.find((f) => val === f.value);
      return selectValue?.displayValue;
    }
    // 複数選択
    const valDesplay: string[] = [];
    let count = 0;
    val.forEach((x) => {
      const selectValue = selectValues.find((f) => x === f.value);
      if (selectValue !== undefined) {
        const valDesplayByte = strLength(
          valDesplay.length === 0
            ? selectValue.displayValue
            : valDesplay.join(', ') + ', ' + selectValue.displayValue
        );
        if (
          (size === 's' && valDesplayByte > 23) ||
          (size === 'm' && valDesplayByte > 65) ||
          (size === 'l' && valDesplayByte > 107) ||
          (size === 'xl' && valDesplayByte > 227)
        ) {
          count++;
        } else {
          valDesplay.push(selectValue.displayValue);
        }
      }
    });
    return count === 0
      ? valDesplay.join(', ')
      : valDesplay.join(', ') + '　' + count.toString();
  };

  // 複数選択された場合、先頭行の空白は削除する
  const omitBlankValue = (val: string[]) => {
    return val.filter((e) => e !== '');
  };

  // 検索可能なSelect用変数
  const [searchVal, setSearchVal] = useState<string>('');
  const [isType, setIsType] = useState<boolean>(false);
  const [filteringVal, setFilteringVal] = useState<SelectValue[]>(selectValues);

  // 検索可能なSelectの選択肢検索変数
  const handleChange = (val: string) => {
    setSearchVal(val);
  };

  // 選択肢のフィルタリング
  useEffect(() => {
    if (isType) return;
    if (!searchVal) {
      setFilteringVal(selectValues);
    } else {
      setFilteringVal(
        selectValues.filter((val) => val.displayValue.includes(searchVal))
      );
    }
  }, [isType, searchVal, selectValues]);

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <Box sx={{ minWidth: minWidth }}>
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
                readOnly: control?._options?.context?.readonly,
              }}
              IconComponent={PulldownIcon}
              renderValue={renderValue}
              ref={sectionRef}
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
          <StyledFormControl fullWidth error={!!formState.errors[name]}>
            <SelectMui
              disabled={disabled}
              value={multiple ? omitBlankValue(watchValue) : watchValue}
              {...register(name)}
              multiple={multiple}
              sx={{ textAlign: 'left' }}
              inputProps={{
                readOnly: control?._options?.context?.readonly,
              }}
              IconComponent={PulldownIcon}
              renderValue={renderValue}
              ref={sectionRef}
            >
              {blankOption && <StyledMenuItem value=''>{'　'}</StyledMenuItem>}
              {
                <ListSubheader value=''>
                  <StyledTextFiled
                    onChange={(e) => handleChange(e.target.value)}
                    onCompositionStart={() => setIsType(true)}
                    onCompositionEnd={() => setIsType(false)}
                  ></StyledTextFiled>
                </ListSubheader>
              }
              {filteringVal.map((option, index) => (
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
    limit,
  } = props;

  const { register, formState, control, setValue } = useFormContext();
  const watchValue = useWatch({ name, control });
  const selectList = [...watchValue];
  const handleClick = () => {
    if (limit !== undefined && selectList.length >= limit) return;
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
                        readOnly: control?._options?.context?.readonly,
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

export const MultiSelect = <T extends FieldValues>(props: SelectProps<T>) => {
  const {
    label,
    labelPosition = 'above',
    selectValues,
    disabled = false,
    blankOption = false,
    required = false,
    minWidth = 100,
    size = 's',
    multi,
  } = props;

  const { register, formState, control } = useFormContext();

  // 複数選択された場合、先頭行の空白は削除する
  const omitBlankValue = (val: string[]) => {
    return val.filter((e) => e !== '');
  };

  // 検索可能なSelect用変数
  const [searchVal, setSearchVal] = useState<string>('');
  const [isType, setIsType] = useState<boolean>(false);
  const [filteringVal, setFilteringVal] = useState<SelectValue[]>(selectValues);

  // 検索可能なSelectの選択肢検索変数
  const handleChange = (val: string) => {
    setSearchVal(val);
  };

  // 選択肢のフィルタリング
  useEffect(() => {
    if (isType) return;
    if (!searchVal) {
      setFilteringVal(selectValues);
    } else {
      setFilteringVal(
        selectValues.filter((val) => val.displayValue.includes(searchVal))
      );
    }
  }, [isType, searchVal, selectValues]);

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <RowStack>
        {multi?.map((val, index) => (
          <Box sx={{ minWidth: minWidth, minHeight: 30 }} key={index}>
            {/* 選択肢が10個未満の場合が上段、選択肢が10個以上の場合が下段。10個以上の場合は、選択肢を検索することができる。 */}
            {val.selectValues.length < 10 ? (
              <StyledFormControl fullWidth error={!!formState.errors[val.name]}>
                <SelectMui
                  disabled={disabled}
                  {...register(val.name)}
                  multiple={false}
                  sx={{ textAlign: 'left' }}
                  inputProps={{
                    readOnly: control?._options?.context?.readonly,
                  }}
                  IconComponent={PulldownIcon}
                >
                  {blankOption && (
                    <StyledMenuItem value=''>{'　'}</StyledMenuItem>
                  )}
                  {val.selectValues.map((option, index) => (
                    <StyledMenuItem key={index} value={option.value}>
                      {option.displayValue}
                    </StyledMenuItem>
                  ))}
                </SelectMui>
                {formState.errors[val.name]?.message && (
                  <FormHelperText>
                    {String(formState.errors[val.name]?.message)}
                  </FormHelperText>
                )}
              </StyledFormControl>
            ) : (
              <StyledFormControl fullWidth error={!!formState.errors[val.name]}>
                <SelectMui
                  disabled={disabled}
                  {...register(val.name)}
                  multiple={false}
                  sx={{ textAlign: 'left' }}
                  inputProps={{
                    readOnly: control?._options?.context?.readonly,
                  }}
                  IconComponent={PulldownIcon}
                >
                  {blankOption && (
                    <StyledMenuItem value=''>{'　'}</StyledMenuItem>
                  )}
                  {
                    <StyledMenuItem value=''>
                      <StyledTextFiled
                        onChange={(e) => handleChange(e.target.value)}
                        onCompositionStart={() => setIsType(true)}
                        onCompositionEnd={() => setIsType(false)}
                      ></StyledTextFiled>
                    </StyledMenuItem>
                  }
                  {filteringVal.map((option, index) => (
                    <StyledMenuItem key={index} value={option.value}>
                      {option.displayValue}
                    </StyledMenuItem>
                  ))}
                </SelectMui>
                {formState.errors[val.name]?.message && (
                  <FormHelperText>
                    {String(formState.errors[val.name]?.message)}
                  </FormHelperText>
                )}
              </StyledFormControl>
            )}
          </Box>
        ))}
      </RowStack>
    </InputLayout>
  );
};

