import React, { ReactNode } from 'react';

import { Modal } from 'layouts/Modal';
import { StackModalSection } from 'layouts/StackModalSection';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { theme } from 'controls/theme';

import { Box, DialogContent } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: 750,
  width: 960,
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
  titles?: string[];
  open: boolean;
  children: ReactNode | ReactNode[];
  buttons: Buttons[];
  isWarning?: boolean;
  isError?: boolean;
}

export const Popup = (props: PopupProps) => {
  const { open, buttons, children, titles } = props;

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
            {titles ? (
              <StackModalSection titles={titles}>{children}</StackModalSection>
            ) : (
              children
            )}
          </DialogContent>
          <Box
            padding={theme.spacing(4)}
            display='flex'
            gap={theme.spacing(4)}
            justifyContent='flex-end'
            sx={{ background: theme.palette.background.default }}
          >
            {buttons.map((value, index) => (
              <>
                {index === 0 && (
                  <CancelButton onClick={value.onClick} variant='outlined'>
                    {value.name}
                  </CancelButton>
                )}
                {index !== 0 && (
                  <ConfirmButton onClick={value.onClick} variant='outlined'>
                    {value.name}
                  </ConfirmButton>
                )}
              </>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
};
