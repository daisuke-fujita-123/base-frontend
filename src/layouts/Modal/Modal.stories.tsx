import React, { useState } from 'react';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Box, Button } from '@mui/material';
import { Modal } from 'layouts/Modal';

export default {
  component: Modal,
  parameters: { controls: { expanded: true } },
  argTypes: {
    open: {
      description: 'モーダルの表示／非表示',
    },
    children: {
      description: 'モーダルで表示する要素',
    },
  },
} as ComponentMeta<typeof Modal>;

export const Index: ComponentStoryObj<typeof Modal> = {
  args: {
    open: true,
  },
};

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShowModalClick = () => {
    setIsOpen(true);
  };

  const handleHideModalClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={handleShowModalClick}>モーダルを表示する</Button>
      <Modal open={isOpen}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#FAFAFA',
        }}>
          <Button onClick={handleHideModalClick}>モーダルを非表示にする</Button>
        </Box>
      </Modal>
    </>
  );
};
