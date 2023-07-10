
import { Checkbox } from 'controls/Checkbox';
import { useForm } from 'hooks/useForm';
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';

interface SampleInput {
  cancelFlag1: boolean;
}
const ScrMem0003ChangeHistoryTab = () => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      cancelFlag1: false
    },
    context: isReadOnly,
  });
  
  return (
    <>
    <FormProvider {...methods}>
      <Checkbox name='cancelFlag1'></Checkbox>
    </FormProvider>
    </>
  );
};

export default ScrMem0003ChangeHistoryTab;

