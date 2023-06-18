import { ComponentMeta, Story } from '@storybook/react';
import { FileSelect, FileSelectProps } from './FileSelect';
import React from 'react';
import { useForm } from 'react-hook-form';
export default {
  component: FileSelect,
  title: 'Controls/FileSelect',
  parameters: { controls: { expanded: true } },
  argTypes: {
    name: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    setValue: {
      description: 'テキストフィールドから見て左横にラベルを表示したい場合はrow、上にラベルを表示したい場合はcolumn。',
      defaultValue: { summary: 'side' },
    },
    label: {
      description: 'ラベルの表示名。ラベルが不要な場合は空文字。',
    },
    labelPosition: {
      description: 'テキストフィールドから見て左横にラベルを表示したい場合はrow、上にラベルを表示したい場合はcolumn。',
      defaultValue: { summary: 'side' },
    },
  },
} as ComponentMeta<typeof FileSelect>;
interface SampleInput {
  sampleFileSelect:File
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
  return <FileSelect {...args} setValue={setValue} />;
};
export const index = Template.bind({});
index.args = {
  name: 'sampleFileSelect',
};

export const Example = () => {
  const { setValue } = useForm<{ sampleFileSelect: File }>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      sampleFileSelect: undefined,
    },
  });
  return <FileSelect name='sampleFileSelect' setValue={setValue} />;
};
