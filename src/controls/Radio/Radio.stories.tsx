import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from 'controls/Button';
import { Radio } from 'controls/Radio';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material/styles';

export default {
  component: Radio,
  parameters: { controls: { expanded: true } },
  argTypes: {
    name: {
      description: 'reacthookformで管理する名前',
    },
    radioValues: {
      description:
        'ラジオボタンの中身。valueがradioの値、displayValueが表示名、disabledがradioボタンを選択可能かどうか判定',
    },
    label: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    labelPosition: {
      description:
        'テキストフィールドから見て左横にラベルを表示したい場合はrow、上にラベルを表示したい場合はcolumn。',
    },
    required: {
      description: '必須かどうか',
      defaultValue: { summary: 'true' },
    },
    row: {
      description: 'radioボタンの配置を横並びにするか、縦並びにするか',
      defaultValue: { summary: 'row' },
    },
  },
} as ComponentMeta<typeof Radio>;

const radioSample = [
  { value: 'available', valueLabel: '可', disabled: false },
  { value: 'notAvailable', valueLabel: '不可', disabled: false },
];

// react-hook-formを使う場合は、template内で呼び出してから使う。
interface SampleInput {
  gender: number;
}

// const Template: Story<RadioProps<SampleInput>> = (args) => {
//   const methods = useForm<SampleInput>({
//     mode: 'onBlur',
//     reValidateMode: 'onBlur',
//     defaultValues: {
//       sampleName: 'available',
//     },
//   });
//   return (
//     <FormProvider {...methods}>
//       <Radio {...args} />
//     </FormProvider>
//   );
// };
// export const index = Template.bind({});
// index.args = {
//   label: 'サンプルラジオボタン',
//   labelPosition: 'side',
//   required: true,
//   name: 'sampleName',
//   radioOptions: radioSample,
//   row: true,
// };

export const Example = () => {
  const isReadOnly = useState<boolean>(false);
  const methods = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      gender: 0,
    },
    context: isReadOnly,
  });

  const radioSample = [
    { value: 0, displayValue: '男' },
    { value: 1, displayValue: '女' },
  ];

  const hendleClick = () => {
    console.log(methods.getValues('gender'));
  };

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <Radio label='性別' name='gender' radioValues={radioSample} />
        <Button onClick={hendleClick}>click</Button>
      </FormProvider>
    </ThemeProvider>
  );
};

