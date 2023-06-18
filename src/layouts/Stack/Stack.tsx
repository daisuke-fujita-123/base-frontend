import React, { ReactNode } from 'react';

import { theme } from 'controls/theme';

import { default as StackMui } from '@mui/material/Stack';
import { ResponsiveStyleValue } from '@mui/system';

interface StackProps {
  children: ReactNode | ReactNode[];
  spacing?: number | string;
  direction?: ResponsiveStyleValue<
    'row' | 'row-reverse' | 'column' | 'column-reverse'
  >;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  width?: number | string;
  height?: number | string;
}

export const Stack = (props: StackProps) => {
  const {
    children,
    spacing = 2,
    direction = 'column',
    justifyContent = 'center',
    alignItems,
    width = 'inherit',
    height = 'inherit',
  } = props;
  return (
    <StackMui
      width={width}
      height={height}
      spacing={spacing}
      direction={direction}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {Array.isArray(children) ? (
        children.map((child: ReactNode, index: number) => (
          <div key={index}>{child}</div>
        ))
      ) : (
        <div>{children}</div>
      )}
    </StackMui>
  );
};

export const RowStack = (props: StackProps) => {
  const {
    children,
    justifyContent = 'flex-end',
    alignItems = 'center',
    spacing = theme.spacing(10),
  } = props;

  return (
    <StackMui
      spacing={spacing}
      direction='row'
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {Array.isArray(children) ? (
        children.map((child: ReactNode, index: number) => (
          <div key={index}>{child}</div>
        ))
      ) : (
        <div>{children}</div>
      )}
    </StackMui>
  );
};

export const InputStack = (props: StackProps) => {
  const { children } = props;

  return (
    <StackMui margin='20px 20px -10px 20px'>
      {Array.isArray(children) ? (
        children.map((child: ReactNode, index: number) => (
          <div key={index}>{child}</div>
        ))
      ) : (
        <div>{children}</div>
      )}
    </StackMui>
  );
};

export const InputRowStack = (props: StackProps) => {
  const { children } = props;

  return (
    <StackMui alignItems='center' flexDirection='row' gap={3}>
      {children}
    </StackMui>
  );
};

export const LabelStack = (props: StackProps) => {
  const { children } = props;

  return (
    <StackMui alignItems='center' flexDirection='row' marginBottom={1}>
      {children}
    </StackMui>
  );
};

