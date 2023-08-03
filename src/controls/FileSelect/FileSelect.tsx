import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

import { InputLayout } from 'layouts/InputLayout';

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material';

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

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
    onDrop: handleFileAccepted,
  });

  return (
    <InputLayout label={label} labelPosition={labelPosition} size={size}>
      <FormControl error={!!formState.errors[name]}>
        <Stack direction='row' spacing={3} alignItems='center' marginBottom={2}>
          <Button variant='outlined' color='inherit' component='label'>
            ファイル選択
            <input {...getInputProps()} />
          </Button>
          <Typography>
            {acceptedFiles.length > 0 ? acceptedFiles[0].name : '未選択'}
          </Typography>
        </Stack>
        <Box
          sx={{
            border: 1,
            padding: 2,
            backgroundColor: '#F5F5F5',
            minHeight: 300,
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p>ファイルをドラッグアンドドロップ</p>
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

