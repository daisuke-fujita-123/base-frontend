import { ComponentMeta } from '@storybook/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Radio } from './Radio';

export default {
  component: Radio,
  parameters: { controls: { expanded: true } },
  argTypes: {
    label: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    labelPosition: {
      description:
        'テキストフィールドから見て左横にラベルを表示したい場合はrow、上にラベルを表示したい場合はcolumn。',
      defaultValue: { summary: 'side' },
    },
    required: {
      description: '必須かどうか',
      defaultValue: { summary: 'true' },
    },
    name: {
      description: 'reacthookformで管理する名前',
    },
    radioOptions: {
      description:
        'ラジオボタンの中身。valueがradioの値、valueLableが表示名、disabledがradioボタンを選択可能かどうか判定',
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
  sampleName: string;
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
      sampleName: 'available',
    },
    context: isReadOnly,
  });
  const radioSample = [
    { value: 'available', valueLabel: '可', disabled: false },
    { value: 'notAvailable', valueLabel: '不可', disabled: false },
  ];
  return (
    <FormProvider {...methods}>
      <Radio
        label='サンプルラジオボタン'
        labelPosition='side'
        required={true}
        radioOptions={radioSample}
        name='sampleName'
      />
    </FormProvider>
  );
};

