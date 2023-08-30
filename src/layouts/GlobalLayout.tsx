import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import TopBar from 'pages/TopBar';

import { AccordionButton } from 'controls/Button';
import TreeView from 'controls/TreeView';

import { useNavigate } from 'hooks/useNavigate';

import logo from 'icons/logo.png';

import { Box } from '@mui/material';

/**
 * GlobalLayoutコンポーネント
 */
const GlobalLayout = () => {
  const flexColSx = { display: 'flex', flexDirection: 'column' };
  const flexRowSx = { display: 'flex', flexDirection: 'row' };
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // TOP画面に遷移
  const navigate = useNavigate();
  const toTop = () => {
    navigate('/com/top');
  };

  const topWidth = `calc(100vw - 301px)`;
  return (
    <Box
      sx={{
        ...flexColSx,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Top */}
      <Box sx={{ ...flexRowSx, minHeight: 58, height: 58 }}>
        {/* Logo */}
        <Box
          sx={{
            ...flexColSx,
            width: 236,
            mr: 10,
            ml: 3,
            justifyContent: 'center',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
          onClick={toTop}
        >
          <img src={logo}></img>
        </Box>
        <Box
          sx={{
            ...flexRowSx,
            width: topWidth,
            overflow: 'auto',
          }}
        >
          <TopBar />
        </Box>
      </Box>
      {/* Main */}
      <Box sx={{ ...flexRowSx, flexGrow: '1', overflow: 'auto' }}>
        {/* Menu */}
        <Box
          sx={{
            width: isOpen ? 250 : 40,
            minWidth: isOpen ? 250 : 40,
            backgroundColor: 'accordion.backgroundColor',
            transition: '0.5s ease',
            overflowY: 'auto',
            display: 'inline-block',
            '::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <TreeView open={isOpen} />
        </Box>
        <AccordionButton
          onClick={() => setIsOpen(!isOpen)}
          visible={isOpen}
        ></AccordionButton>
        {/* Content */}
        <Box sx={{ ...flexColSx, flexGrow: '1', overflow: 'auto' }}>
          {/* OutletにPageコンポーネントが入る */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default GlobalLayout;

