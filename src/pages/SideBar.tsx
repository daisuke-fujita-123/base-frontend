import React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function SideBar() {
  return (
    <>
      <Grid container spacing={0} direction='column'>
        <Grid item xs={4}>
          <Item>Logo Icon</Item>
        </Grid>
        <Grid item xs>
          <Item>Menu Item</Item>
        </Grid>
      </Grid>
    </>
  );
}

export default SideBar;
