import React from 'react';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form';

import { InputLayout } from 'layouts/InputLayout';

import { theme } from 'controls/theme';

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
  '& .Mui-disabled': {
    backgroundColor: theme.palette.background.disabled,
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
  } = props;

  const { register, formState, setValue, watch, control } = useFormContext();

  const onClickIconHandler = () => {
    if (!disabled) {
      return setValue(name, value);
    }
  };

  const isReadOnly = control?._options?.context[0];

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
    >
      <StyledTextFiled
        id={name}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={isReadOnly || disabled ? 'standard' : variant}
        error={!!formState.errors[name]}
        helperText={
          formState.errors[name]?.message
            ? String(formState.errors[name]?.message)
            : null
        }
        {...register(name)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {watch(name) && (
                <IconButton onClick={onClickIconHandler}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
          readOnly: isReadOnly,
        }}
      />
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
  } = props;
  const { register, formState, setValue, watch, trigger, control } =
    useFormContext();
  const currentValue = watch(name);

  const onClickIconHandler = () => {
    if (!disabled) {
      return setValue(name, value);
    }
  };

  const onFocusHandle = () => {
    if (currentValue && typeof currentValue === 'string') {
      const noConnmaString = currentValue.replace(/,/g, '');
      setValue(name, noConnmaString);
    }
  };

  const onBlurHandle = () => {
    if (currentValue && typeof currentValue === 'string') {
      const hannkakuString = fullWidth2HalfWidth(currentValue);
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
        setValue(name, currentValue);
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

  const isReadOnly = control?._options?.context[0];

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
    >
      <StyledTextFiled
        id={name}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={variant}
        error={!!formState.errors[name]}
        helperText={
          formState.errors[name]?.message
            ? String(formState.errors[name]?.message)
            : null
        }
        {...register(name)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {watch(name) && (
                <IconButton onClick={onClickIconHandler}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
          readOnly: isReadOnly,
        }}
        onBlur={onBlurHandle}
        onFocus={onFocusHandle}
      />
    </InputLayout>
  );
};

export const DataGridTextField = <T extends FieldValues>(
  props: TextFieldProps<T>
) => {
  const {
    name,
    variant = 'outlined',
    disabled = false,
    fullWidth = true,
    value,
  } = props;
  const { register, formState, control } = useFormContext();
  const isReadOnly = control?._options?.context[0];
  return (
    <StyledTextFiled
      id={name}
      defaultValue={value}
      disabled={disabled}
      fullWidth={fullWidth}
      variant={variant}
      error={!!formState.errors[name]}
      helperText={
        formState.errors[name]?.message
          ? String(formState.errors[name]?.message)
          : null
      }
      {...register(name)}
      InputProps={{
        readOnly: isReadOnly,
      }}
    />
  );
};

interface PostalTextFieldProps extends TextFieldProps<FieldValues> {
  onBlur: () => void;
}

export const PostalTextField = (props: PostalTextFieldProps) => {
  const {
    label,
    labelPosition = 'above',
    required = false,
    name,
    value = '',
    variant = 'outlined',
    disabled = false,
    fullWidth = true,
    onBlur,
  } = props;

  const { register, formState, setValue, watch, trigger, control } =
    useFormContext();
  const currentValue = watch(name);

  const onClickIconHandler = () => {
    if (!disabled) {
      return setValue(name, value);
    }
  };
  const onBlurHandle = () => {
    // 郵便番号形式に変換 ※文字列が7桁以外の場合はハイフンは入れない。
    if (currentValue.length === 7 && currentValue.indexOf('-') === -1) {
      const firstPart = currentValue.substring(0, 3);
      const secondPart = currentValue.substring(3, 7);
      const formattedValue = `${firstPart}-${secondPart}` as FieldPathValue<
        FieldValues,
        FieldPath<FieldValues>
      >;
      setValue(name, formattedValue);
    } else {
      // デフォルト値をセット
      setValue(name, currentValue);
    }
    // バリデーションチェックを行う
    trigger(name);
  };

  const isReadOnly = control?._options?.context[0];

  return (
    <InputLayout
      label={label}
      labelPosition={labelPosition}
      required={required}
    >
      <StyledTextFiled
        id={name}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={variant}
        error={!!formState.errors[name]}
        helperText={
          formState.errors[name]?.message
            ? String(formState.errors[name]?.message)
            : null
        }
        {...register(name)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {watch(name) && (
                <IconButton onClick={onClickIconHandler}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
          readOnly: isReadOnly,
        }}
        onBlur={() => {
          onBlurHandle();
          onBlur();
        }}
      />
    </InputLayout>
  );
};

