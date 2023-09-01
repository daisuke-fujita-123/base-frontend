import { ThemeProvider } from '@emotion/react';
import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { theme } from 'controls/theme';

import { FileSelect, FileSelectProps } from './FileSelect';

export default {
  component: FileSelect,
  title: 'Controls/FileSelect',
  parameters: { controls: { expanded: true } },
  argTypes: {
    name: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    setValue: {
      description:
        'テキストフィールドから見て左横にラベルを表示したい場合はrow、上にラベルを表示したい場合はcolumn。',
      defaultValue: { summary: 'side' },
    },
    label: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    labelPosition: {
      description:
        'テキストフィールドから見て左横にラベルを表示したい場合はrow、上にラベルを表示したい場合はcolumn。',
      defaultValue: { summary: 'side' },
    },
  },
} as ComponentMeta<typeof FileSelect>;
interface SampleInput {
  sampleFileSelect: File;
}
// react-hook-formを使う場合は、template内で呼び出してから使う。
const Template: Story<FileSelectProps<SampleInput>> = (args) => {
  const { setValue } = useForm<SampleInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      sampleFileSelect: undefined,
    },
  });
  return <FileSelect {...args} />;
};
export const index = Template.bind({});
index.args = {
  name: 'sampleFileSelect',
};
const schema = yup.object({
  sampleFileSelect: yup.mixed().required('選択してください'),
});

export const Example = () => {
  const methods = useForm<{ sampleFileSelect: File | null }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      sampleFileSelect: null,
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: { sampleFileSelect: File | null }) => {
    console.log(data);
  };
  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FileSelect name='sampleFileSelect' />
        </form>
      </FormProvider>
    </ThemeProvider>
  );
};

