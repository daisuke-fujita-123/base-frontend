import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton } from '@mui/material';
import { Typography } from 'controls/Typography';
import React from 'react';

interface AddIconProps {
  iconType: 'add' | 'delete' | 'import' | 'export';
  iconName: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Icon = ({ iconType, iconName, disabled = false, onClick }: AddIconProps) => {
  const iconTypeElement = () => {
    switch (iconType) {
      case 'add':
        return <AddCircleOutlineIcon sx={{ width: 50 }} />;
      case 'delete':
        return <DeleteIcon sx={{ width: 50 }} />;
      // インポートとエクスポートのfigmaで定義しているアイコンがmuiに見つからなかった。
      // case 'インポート':
      //   return ;
    }
  };
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <IconButton disabled={disabled} onClick={onClick} name={iconName}>
          {iconTypeElement()}
        </IconButton>
        <Typography variant='subtitle1'>{iconName}</Typography>
      </Box>
    </>
  );
};
