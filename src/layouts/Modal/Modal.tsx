import React, { ReactNode } from 'react';

import { Box } from '@mui/material';
import { default as ModalMui } from '@mui/material/Modal';

interface ModalProps {
  open: boolean;
  children: ReactNode;
}

export const Modal = (props: ModalProps) => {
  const { open, children } = props;

  return (
    <div>
      <ModalMui open={open}>
        <Box>{children}</Box>
      </ModalMui>
    </div>
  );
};

