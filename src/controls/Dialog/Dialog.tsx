import React from 'react';

import { default as DialogMui } from '@mui/material/Dialog';
import { Box, DialogActions, DialogTitle } from '@mui/material';

import { Button } from 'controls/Button';

interface Buttons {
  name: string;
  onClick: () => void;
};

interface DialogProps {
  open: boolean;
  title: string;
  buttons: Buttons[];
};

export const Dialog = (props: DialogProps) => {
  const { open, title, buttons } = props;

  return (
    <>
      <DialogMui open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogActions sx={{ flexDirection: 'row-reverse', justifyContent: 'flex-start', padding: 2 }}>
          {buttons.map((value, index) => (
            <Box key={index} padding={1}>
              <Button onClick={value.onClick}>{value.name}</Button>
            </Box>
          ))}
        </DialogActions>
      </DialogMui>
    </>
  );
};
