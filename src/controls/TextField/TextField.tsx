import React from 'react';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Path,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { InputLayout } from 'layouts/InputLayout';

import { Link as TextLink } from 'controls/Link';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import ClearIcon from '@mui/icons-material/Clear';
import {
  IconButton,
  InputAdornment,
  styled,
  TextField as TextFiledMui,
} from '@mui/material';

export interface TextFieldProps<T extends FieldValues> {
  label?: string;
  labelPosition?: 'above' | 'side';
  required?: boolean;
  name: Path<T>;
  value?: FieldPathValue<FieldValues, FieldPath<FieldValues>>;
  variant?: 'standard' | 'filled' | 'outlined';
  disabled?: boolean;
  fullWidth?: boolean;
  readonly?: boolean;
  size?: 's' | 'm' | 'l' | 'xl';
  onBlur?: (name: string) => void;
  onClick?: () => void;
  unit?: string;
  type?: 'text' | 'password';
}

export const StyledTextFiled = styled(TextFiledMui)(({ error }) => ({
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
}));

export const TextField = <T extends FieldValues>(props: TextFieldProps<T>) => {
  const {
    label,
    labelPosition = 'above',
    required = false,
    name,
    value = '',
    variant = 'outlined',
    disabled = false,
    fullWidth = true,
    readonly = false,
    size = 's',
    onBlur,
    unit,
    type = 'text',
  } = props;

  const { register, formState, setValue, control } = useFormContext();
  const watchValue = useWatch({ name, control });
  const registerRet = register(name);
  const isNotNull =
    watchValue !== null && watchValue !== undefined && watchValue !== '';
  const onClickIconHandler = () => {
    if (!disabled) {
      return setValue(name, value);
    }
  };

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <Grid container>
        <Grid item xs={unit ? 10 : 12}>
          <StyledTextFiled
            id={name}
            disabled={disabled}
            fullWidth={fullWidth}
            variant={
              control?._options?.context?.readonly || readonly
                ? 'standard'
                : variant
            }
            error={!!formState.errors[name]}
            helperText={
              formState.errors[name]?.message
                ? String(formState.errors[name]?.message)
                : null
            }
            type={type}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {isNotNull && !readonly && (
                    <IconButton onClick={onClickIconHandler}>
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
              readOnly: control?._options?.context?.readonly || readonly,
            }}
            onChange={registerRet.onChange}
            onBlur={(event) => {
              registerRet.onBlur(event);
              onBlur && onBlur(name);
            }}
            ref={registerRet.ref}
            name={registerRet.name}
          />
        </Grid>
        <Grid item xs={unit ? 2 : false}>
          <MarginBox mt={1} ml={1}>
            <Typography>{unit}</Typography>
          </MarginBox>
        </Grid>
      </Grid>
    </InputLayout>
  );
};

export const PriceTextField = <T extends FieldValues>(
  props: TextFieldProps<T>
) => {
  const {
    label,
    labelPosition = 'above',
    required = false,
    variant = 'outlined',
    name,
    value = '',
    disabled = false,
    fullWidth = true,
    readonly = false,
    size = 's',
    onBlur,
  } = props;

  const { register, formState, setValue, trigger, control } = useFormContext();
  const watchValue = useWatch({ name, control });
  const registerRet = register(name);
  const isNotNull =
    watchValue !== null && watchValue !== undefined && watchValue !== '';
  const onClickIconHandler = () => {
    if (!disabled) {
      return setValue(name, value);
    }
  };

  const onFocusHandle = () => {
    if (watchValue && typeof watchValue === 'string') {
      const noConnmaString = watchValue.replace(/,/g, '');
      setValue(name, noConnmaString);
    }
  };

  const onBlurHandle = () => {
    if (watchValue && typeof watchValue === 'string') {
      const hannkakuString = fullWidth2HalfWidth(watchValue);
      const noConnmaString = hannkakuString.replace(/,/g, '');
      // 数値に変換できない場合はそのままの値を返却する
      if (!isNaN(Number(noConnmaString)) && noConnmaString.trim() !== '') {
        const noConnmaPrice = Number(
          noConnmaString
        ).toLocaleString() as FieldPathValue<
          FieldValues,
          FieldPath<FieldValues>
        >;
        setValue(name, noConnmaPrice);
      } else {
        setValue(name, watchValue);
      }
    }
    // バリデーションチェックを行う
    trigger(name);
  };

  // 全角文字を半角にする処理
  const fullWidth2HalfWidth = (src: string) => {
    return src.replace(/[\uFF01-\uFF5E]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
    });
  };
  console.log(
    'watchValue && !readonly',
    watchValue && !readonly,
    watchValue,
    !readonly
  );
  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <StyledTextFiled
        id={name}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={
          control?._options?.context?.readonly || readonly
            ? 'standard'
            : variant
        }
        error={!!formState.errors[name]}
        helperText={
          formState.errors[name]?.message
            ? String(formState.errors[name]?.message)
            : null
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {isNotNull && !readonly && (
                <IconButton onClick={onClickIconHandler}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
          readOnly: control?._options?.context?.readonly,
        }}
        onChange={registerRet.onChange}
        onBlur={(event) => {
          registerRet.onBlur(event);
          onBlurHandle();
          onBlur && onBlur(name);
        }}
        ref={registerRet.ref}
        name={registerRet.name}
      />
    </InputLayout>
  );
};

export const PostalTextField = <T extends FieldValues>(
  props: TextFieldProps<T>
) => {
  const {
    label,
    labelPosition = 'above',
    required = false,
    name,
    value = '',
    variant = 'outlined',
    disabled = false,
    fullWidth = true,
    readonly = false,
    size = 's',
    onBlur,
  } = props;

  const { register, formState, setValue, trigger, control } = useFormContext();
  const watchValue = useWatch({ name, control });
  const isReadOnly = control?._options?.context?.readonly;
  const registerRet = register(name);
  const isNotNull =
    watchValue !== null && watchValue !== undefined && watchValue !== '';
  const onClickIconHandler = () => {
    if (!disabled) {
      return setValue(name, value);
    }
  };

  const onBlurHandle = () => {
    // 郵便番号形式に変換 ※文字列が7桁以外の場合はハイフンは入れない。
    if (watchValue.length === 7 && watchValue.indexOf('-') === -1) {
      const firstPart = watchValue.substring(0, 3);
      const secondPart = watchValue.substring(3, 7);
      const formattedValue = `${firstPart}-${secondPart}` as FieldPathValue<
        FieldValues,
        FieldPath<FieldValues>
      >;
      setValue(name, formattedValue);
    } else {
      // デフォルト値をセット
      setValue(name, watchValue);
    }
    // バリデーションチェックを行う
    trigger(name);
  };

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <StyledTextFiled
        id={name}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={isReadOnly || readonly ? 'standard' : variant}
        error={!!formState.errors[name]}
        helperText={
          formState.errors[name]?.message
            ? String(formState.errors[name]?.message)
            : null
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {isNotNull && !readonly && (
                <IconButton onClick={onClickIconHandler}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
          readOnly: isReadOnly,
        }}
        onChange={registerRet.onChange}
        onBlur={(event) => {
          registerRet.onBlur(event);
          onBlurHandle();
          onBlur && onBlur(name);
        }}
        ref={registerRet.ref}
        name={registerRet.name}
      />
    </InputLayout>
  );
};

export const LinkTextField = <T extends FieldValues>(
  props: TextFieldProps<T>
) => {
  const {
    label,
    labelPosition = 'above',
    required = false,
    name,
    disabled = false,
    fullWidth = true,
    size = 's',
    onClick,
  } = props;

  const { formState, control } = useFormContext();
  const watchValue = useWatch({ name, control });
  const Link = () => {
    return (
      <TextLink href='#' onClick={onClick}>
        {watchValue}
      </TextLink>
    );
  };

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
      size={size}
    >
      <StyledTextFiled
        id={name}
        disabled={disabled}
        fullWidth={fullWidth}
        variant='standard'
        error={!!formState.errors[name]}
        helperText={
          formState.errors[name]?.message
            ? String(formState.errors[name]?.message)
            : null
        }
        InputProps={{
          startAdornment: <Link />,
          readOnly: true,
        }}
      />
    </InputLayout>
  );
};

