import React, { ReactNode } from 'react';

import { Modal } from 'layouts/Modal';
import { StackModalSection } from 'layouts/StackModalSection';

import { Button } from 'controls/Button';
import { theme } from 'controls/theme';

import { Box, DialogContent } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: 600,
  width: 500,
  bgcolor: '#FFFFFF',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
};

interface Buttons {
  name: string;
  onClick: () => void;
}

interface PopupProps {
  open: boolean;
  titles: string[];
  children: ReactNode | ReactNode[];
  buttons: Buttons[];
}

export const Popup = (props: PopupProps) => {
  const { open, titles, buttons, children } = props;

  return (
    <>
      <Modal open={open}>
        <Box
          sx={{
            ...style,
          }}
        >
          <DialogContent
            sx={{
              p: theme.spacing(4),
              overflow: 'auto',
            }}
          >
            <StackModalSection titles={titles}>{children}</StackModalSection>
          </DialogContent>
          <Box
            padding={theme.spacing(4)}
            display='flex'
            gap={theme.spacing(4)}
            justifyContent='flex-end'
            sx={{ background: theme.palette.background.default }}
          >
            {buttons.map((value, index) => (
              <Button key={index} onClick={value.onClick} variant='outlined'>
                {value.name}
              </Button>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
};
