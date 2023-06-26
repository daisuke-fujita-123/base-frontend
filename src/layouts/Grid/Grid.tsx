import React from 'react';

import { default as GridMui } from '@mui/material/Grid';
import { ResponsiveStyleValue } from '@mui/system/styleFunctionSx';
import { GridRowsProp, GridSortModel } from '@mui/x-data-grid';

interface GridProps {
  children: React.ReactNode;
  container?: boolean;
  item?: boolean;
  flexDirection?: 'column' | 'row';
  xs?: boolean | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  sm?: boolean | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: boolean | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: boolean | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  xl?: boolean | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  columns?: ResponsiveStyleValue<number>;
  width?: number;
  height?: string | number;
  size?: 's' | 'm' | 'l' | 'el';
}

// 型のみエクスポート
export type { GridRowsProp };
export type { GridSortModel };

export const Grid = (props: GridProps) => {
  const {
    children,
    container = false,
    item = false,
    xs,
    sm,
    md,
    lg,
    xl,
    spacing,
    flexDirection = 'row',
    columns,
    width,
    height,
    size,
    ...other
  } = props;

  const areaWidth = () => {
    if (size === 's') return 225 + 40;
    else if (size === 'm') return 490 + 40;
    else if (size === 'l') return 755 + 40;
    else if (size === 'el') return 1550 + 40;
    else return 0;
  };

  return (
    <GridMui
      container={container}
      item={item}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      spacing={spacing}
      flexDirection={flexDirection}
      columns={columns}
      width={item ? areaWidth() : width}
      height={height}
      {...other}
    >
      {children}
    </GridMui>
  );
};

