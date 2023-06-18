import React, { ReactNode } from 'react';

import { Divider } from 'controls/Divider';

import { Box } from '@mui/material';

export interface FooterProps {
  children: ReactNode | ReactNode[];
}
// 確認点 footerの要素はどういうパターンがあるのか。現状は、右下にフッターの要素が来ると仮定している。
export const Footer = (props: FooterProps) => {
  const { children } = props;
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

