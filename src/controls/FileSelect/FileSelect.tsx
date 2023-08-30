import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

import { InputLayout } from 'layouts/InputLayout';

import { PrimaryButton } from 'controls/Button';
import { CaptionLabel } from 'controls/Label';
import { Typography } from 'controls/Typography';

import { Box, FormControl, FormHelperText, Stack } from '@mui/material';

export interface FileSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  labelPosition?: 'above' | 'side';
  size?: 's' | 'm' | 'l' | 'xl';
}

export const FileSelect = <T extends FieldValues>(
  props: FileSelectProps<T>
) => {
  const { name, label, labelPosition, size = 's' } = props;

  // form
  const { formState, setValue, trigger } = useFormContext();

  const handleFileAccepted = (acceptedFiles: File[]) => {
    setValue(name, acceptedFiles[0] as any);
    trigger(name);
  };

  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
    onDrop: handleFileAccepted,
  });

  return (
    <InputLayout label={label} labelPosition={labelPosition} size={size}>
      <FormControl error={!!formState.errors[name]}>
        <CaptionLabel text='ファイルパス'></CaptionLabel>
        <Stack
          direction='row'
          alignItems='center'
          marginBottom={4}
          marginTop={2}
          spacing={2}
        >
          <PrimaryButton onClick={open}>ファイルを選択</PrimaryButton>
          <Typography>
            {acceptedFiles.length > 0 ? acceptedFiles[0].name : '未選択'}
          </Typography>
        </Stack>
        <Box
          sx={{
            border: '1px dashed #bbbbbb',
            backgroundColor: '#F5F5F5',
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Typography>ファイルをドラッグアンドドロップしてください</Typography>
        </Box>
        {formState.errors[name]?.message && (
          <FormHelperText>
            {String(formState.errors[name]?.message)}
          </FormHelperText>
        )}
      </FormControl>
    </InputLayout>
  );
};

