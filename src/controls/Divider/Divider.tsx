import React from 'react';

import { Divider as DividerMui } from '@mui/material';

export const Divider = () => {
  return (
    <DividerMui sx={{ borderBottomWidth: 3, marginBottom: 2, marginTop: 2 }} />
  );
};
export const ContentsDivider = () => {
  return <DividerMui sx={{ margin: '30px 20px 20px' }} />;
};

