import React, { ReactNode } from 'react';

import { Box, Typography } from '@mui/material';
import { default as StackMui } from '@mui/material/Stack';

interface StackModalSectionProps {
  children: ReactNode[] | ReactNode;
  titles: string[];
}

export const StackModalSection = (props: StackModalSectionProps) => {
  const { children, titles } = props;
  if (children && Array.isArray(children)) {
    return (
      <StackMui spacing={3}>
        {children &&
          children.map((child: ReactNode, index: number) => (
            <Box key={index}>
              <Typography
                sx={{
                  textDecoration: 'underline',
                  fontSize: 20,
                  textDecorationThickness: 2,
                }}
                variant={'h5'}
              >
                {titles[index]}
              </Typography>
              <Box>{child}</Box>
            </Box>
          ))}
      </StackMui>
    );
  } else {
    return (
      <>
        <Box>
          <Typography
            sx={{
              textDecoration: 'underline',
              fontSize: 20,
              textDecorationThickness: 2,
            }}
            variant={'h5'}
          >
            {titles[0]}
          </Typography>
          <Box sx={{ margin: 2 }}>{children}</Box>
        </Box>
      </>
    );
  }
};
