import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FieldValues, Path, PathValue, UseFormSetValue } from 'react-hook-form';

import { InputLayout } from 'layouts/InputLayout';

import { Box, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';

export interface FileSelectProps<T extends FieldValues> {
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  label?: string;
  labelPosition?: 'above' | 'side';
  size?: 's' | 'm' | 'l' | 'xl';
}
export const FileSelect = <T extends FieldValues>(
  props: FileSelectProps<T>
) => {
  const { name, setValue, label, labelPosition, size = 's' } = props;
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const settedValue = acceptedFiles[0] as PathValue<T, Path<T>>;
    setValue(name, settedValue);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
    onDrop,
  });

  return (
    <InputLayout label={label} labelPosition={labelPosition} size={size}>
      <Box>
        <Stack direction='row' spacing={3} alignItems='center' marginBottom={2}>
          <Button variant='outlined' color='inherit' component='label'>
            ファイル選択
            <input type='file' hidden accept='.csv' {...getInputProps()} />
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
          <input accept='.csv' {...getInputProps()} />
          <p>ファイルをドラッグアンドドロップ</p>
        </Box>
      </Box>
    </InputLayout>
  );
};

