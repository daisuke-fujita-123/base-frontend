import React, { useContext, useEffect } from 'react';
import {
  FieldValues,
  useForm as useFormReact,
  UseFormProps as useFormPropsReact,
} from 'react-hook-form';

import { AppContext } from 'providers/AppContextProvider';

/**
 * useForm
 */
export const useForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: useFormPropsReact<TFieldValues, TContext>
) => {
  const { defaultValues, resolver, context = false } = props;

  // context
  const { setNeedsConfirmNavigate } = useContext(AppContext);

  // form
  const methods = useFormReact<TFieldValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: resolver,
    defaultValues: defaultValues,
    context: context,
  });

  const {
    formState: { isDirty },
  } = methods;

  // 初回値変更時処理
  useEffect(() => {
    if (isDirty) {
      setNeedsConfirmNavigate(true);
    }
  }, [isDirty]);

  return methods;
};
