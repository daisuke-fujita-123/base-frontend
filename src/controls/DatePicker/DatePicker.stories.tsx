import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
interface SampleInput {
  name: Date;
}

const schema = yup.object({
  name: yup.string().required('入力してください'),
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
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
    context: isReadOnly,
  });
  return (
    <FormProvider {...methods}>
      <ThemeProvider theme={theme}>
        <DatePicker
          label='サンプル日程（和暦あり）'
          required={true}
          name='name'
          disabled={false}
          wareki={true}
        />
        <DatePicker
          label='サンプル日程（和暦なし）'
          required={true}
          name='name'
          disabled={false}
        />
      </ThemeProvider>
    </FormProvider>
  );
};

