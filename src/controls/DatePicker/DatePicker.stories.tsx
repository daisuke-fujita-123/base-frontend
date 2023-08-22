import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button } from 'controls/Button';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';
import { DatePicker } from './DatePicker';

export default {
  component: DatePicker,
  title: 'Controls/DatePicker',
  parameters: { controls: { expanded: true } },
  argTypes: {
    label: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    labelPosition: {
      description:
        'DatePickerから見て左横にラベルを表示したい場合はside、上にラベルを表示したい場合はabove。',
      defaultValue: { summary: 'side' },
    },
    required: {
      description: '必須かどうか',
      defaultValue: { summary: 'false' },
    },
    name: {
      description:
        'reacthookformで管理する名前。defaultの日付を設定しない場合は、DatePickerに与えるdefault値は空文字にする。',
    },
    disabled: {
      description: 'DatePickerの使用可否',
      defaultValue: { summary: 'false' },
    },
    wareki: {
      description: '和暦形式で上部に表示したい場合はtrue',
      defaultValue: { summary: 'false' },
    },
  },
};

// react-hook-formを使う場合は、template内で呼び出してから使う。
interface DataPickerExampleModel {
  date1: string;
  date2: string;
}

const schema = yup.object({
  date1: yup.string().date().max(10).label('data1'),
  date2: yup.string().date().max(10).label('data2'),
});

// TDOO クラッシュ原因の特定
// const Template: Story<DatePickerProps<SampleInput>> = (args) => {
//   const methods = useForm<SampleInput>({
//     mode: 'onBlur',
//     reValidateMode: 'onBlur',
//     resolver: yupResolver(schema),
//   });
//   return (
//     <FormProvider {...methods}>
//       <DatePicker {...args} />
//     </FormProvider>
//   );
// };
// export const index = Template.bind({});
// index.args = {
//   name: 'name',
//   required: true,
//   disabled: false,
//   label: 'サンプル日程',
//   labelPosition: 'side',
//   wareki: true,
// };

export const Example = () => {
  const methods = useForm<DataPickerExampleModel>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      date1: '2020/01/01',
      date2: '2021/02/03',
    },
    resolver: yupResolver(schema),
    context: true,
  });

  const handleOnClick = () => {
    console.log(methods.getValues());
    console.log(methods.formState.errors);
  };

  useEffect(() => {
    console.log(methods.formState.errors);
  }, [methods.formState]);

  return (
    <FormProvider {...methods}>
      <Button onClick={handleOnClick}>log</Button>
      <ThemeProvider theme={theme}>
        <DatePicker label='DatePicker' name='date1' />
        <DatePicker
          label='DatePicker（和暦付き）'
          name='date2'
          withWareki
          size='m'
        />
      </ThemeProvider>
    </FormProvider>
  );
};

