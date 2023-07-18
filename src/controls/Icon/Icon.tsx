import React from 'react';

import { Typography } from 'controls/Typography';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, IconButton } from '@mui/material';

interface AddIconProps {
  iconType: 'add' | 'delete' | 'import' | 'export';
  iconName: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Icon = ({
  iconType,
  iconName,
  disabled = false,
  onClick,
}: AddIconProps) => {
  const iconTypeElement = () => {
    switch (iconType) {
      case 'add':
        return <AddCircleOutlineIcon sx={{ width: 50 }} />;
      case 'delete':
        return <DeleteIcon sx={{ width: 50 }} />;
      case 'import':
        return <CloudUploadIcon sx={{ width: 50 }} />;
      case 'export':
        return <FileDownloadIcon sx={{ width: 50 }} />;
      default:
        return <AddCircleOutlineIcon sx={{ width: 50 }} />;
      // TODO アイコンを顧客提供のものに変更
    }
  };
  return (
    <>
      <Box
        sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
      >
        <IconButton disabled={disabled} onClick={onClick} name={iconName}>
          {iconTypeElement()}
        </IconButton>
        <Typography>{iconName}</Typography>
      </Box>
    </>
  );
};

