import { ComponentMeta } from '@storybook/react';
import { Grid } from './Grid';
import React from 'react';
import { Box } from '@mui/material';
export default {
  component: Grid,
  parameters: { controls: { expanded: true } },
  argTypes: {
    children: {
      description: '表示するエレメント',
    },
    container: {
      description: 'trueにした場合は、flex-containerとして機能し、itemをpropsに指定したgridを配下に配置する。',
      defaultValue: { summary: 'false' },
    },
    item: {
      description: 'flex-container内のitem。',
      defaultValue: { summary: 'false' },
    },
    flexDirection: {
      description: 'container内のアイテムの配置方法を指定。',
      defaultValue: { summary: 'row' },
    },
  },
} as ComponentMeta<typeof Grid>;

// gridは入れ子構造になっており、propsを渡すことが難しいのでindex部分は省略。

export const Example = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Box sx={{ border: 1 }}>xs=8</Box>
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ border: 1 }}>xs=4</Box>
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ border: 1 }}>xs=4</Box>
      </Grid>
      <Grid item xs={8}>
        <Box sx={{ border: 1 }}>xs=8</Box>
      </Grid>
    </Grid>
  );
};
