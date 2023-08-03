import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { Button } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { TextField } from 'controls/TextField';

import { useForm } from 'hooks/useForm';

/**
 * WatchForm
 */
const WatchForm = () => {
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const methods = useForm({
    defaultValues: {
      checkbox: false,
      text: '',
      text2: '',
      checkbox2: false,
    },
  });
  const { setValue, watch } = methods;

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // textの変更も監視対象のため、setValueでtextを変更した場合を無視しないと無限ループする
      if (name === 'checkbox') {
        const check = value.checkbox ? 'on' : 'off';
        setValue('text', 'set value by checkbox change: checkbox = ' + check);
        if (value.checkbox === undefined) return;
        setShow(value.checkbox);
      }
      if (name === 'text2') {
        setValue('checkbox2', value.text2 !== '');
        setDisabled(value.text2 === '');
      }
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  return (
    <MainLayout>
      <MainLayout main>
        <FormProvider {...methods}>
          <Section name='Watch Form'>
            <Checkbox name='checkbox' label='checkbox' />
            <TextField label='text' name='text' />
            {show && <Button>button</Button>}
          </Section>
          <Section name='Watch Form 2'>
            <TextField label='text2' name='text2' />
            <Checkbox name='checkbox2' label='checkbox2' disabled={disabled} />
          </Section>
        </FormProvider>
      </MainLayout>
    </MainLayout>
  );
};

export default WatchForm;
