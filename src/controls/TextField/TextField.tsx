import React from 'react';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Path,
  useFormContext,
  useWatch,
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
  readonly?: boolean;
  size?: 's' | 'm' | 'l' | 'xl';
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
  } = props;

  const { register, formState, setValue, control } = useFormContext();
  const watchValue = useWatch({ name, control });

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
        {...register(name)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {watchValue && !readonly && (
                <IconButton onClick={onClickIconHandler}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
          readOnly: isReadOnly || readonly,
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
    readonly = false,
    size = 's',
  } = props;
  const { register, formState, setValue, trigger, control } = useFormContext();
  const watchValue = useWatch({ name, control });

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

  const isReadOnly = control?._options?.context[0];

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
        {...register(name)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {watchValue && !readonly && (
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
    readonly = false,
    size = 's',
    onBlur,
  } = props;

  const { register, formState, setValue, trigger, control } = useFormContext();
  const watchValue = useWatch({ name, control });

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

  const isReadOnly = control?._options?.context[0];

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
        {...register(name)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {watchValue && !readonly && (
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

