import React, { ReactNode } from 'react';

import { Modal } from 'layouts/Modal';
import { StackModalSection } from 'layouts/StackModalSection';

import { theme } from 'controls/theme';

import { Box, DialogContent, Stack } from '@mui/material';

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

interface PopupProps {
  titles?: string[];
  open?: boolean;
  children: ReactNode | ReactNode[];
  isWarning?: boolean;
  isError?: boolean;
  bottom?: boolean;
  main?: boolean;
}

export const Popup = (props: PopupProps) => {
  const { open = false, children, titles } = props;
  let mainElement = undefined;
  let bottomElement = undefined;

  if (Array.isArray(children)) {
    children.map((value) => {
      if (React.isValidElement(value)) {
        if (value.props.main) {
          mainElement = value.props.children;
        } else if (value.props.bottom) {
          bottomElement = value.props.children;
        }
      }
    });
  }
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
              overflowY: 'auto',
            }}
          >
            {titles ? (
              <StackModalSection titles={titles}>
                {mainElement}
              </StackModalSection>
            ) : (
              mainElement
            )}
          </DialogContent>
          {bottomElement && (
            <Box
              padding={theme.spacing(2)}
              display='flex'
              justifyContent='flex-end'
              height='40px'
              sx={{ background: theme.palette.background.default }}
            >
              <Stack
                direction='row'
                alignItems='center'
                marginRight={1}
                gap={3}
              >
                {bottomElement}
              </Stack>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};
