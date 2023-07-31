import React from 'react';

import { Divider as DividerMui } from '@mui/material';

interface DividerProps {
  isBlack?: boolean;
}

export const Divider = () => {
  return (
    <DividerMui sx={{ borderBottomWidth: 3, marginBottom: 2, marginTop: 2 }} />
  );
};
export const ContentsDivider = () => {
  return <DividerMui sx={{ margin: '30px 20px 20px' }} />;
};

export const TableDivider = (props: DividerProps) => {
  const { isBlack } = props;
  return (
    <DividerMui
      sx={{
        borderBottomWidth: 1,
        marginBottom: 2,
        marginTop: 2,
        borderColor: isBlack ? '#cccccc' : '#ffffff',
      }}
    />
  );
};

export const TableSpaceDivider = (props: DividerProps) => {
  const { isBlack } = props;
  return (
    <DividerMui
      flexItem
      orientation='vertical'
      sx={{
        borderBottomWidth: 1,
        borderRightWidth: 1,
        marginLeft: 1,
        marginRight: 1,
        borderColor: isBlack ? '#cccccc' : '#ffffff',
      }}
    />
  );
};

