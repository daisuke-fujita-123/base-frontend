import React, { ReactNode } from 'react';

import { theme } from 'controls/theme';

import { styled } from '@mui/material';
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
  mb?: boolean;
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

export const ControlsRowStack = (props: StackProps) => {
  const {
    children,
    justifyContent = 'flex-start',
    spacing = theme.spacing(8),
    mb = false,
  } = props;

  return (
    <StackMui
      marginRight={8}
      spacing={spacing}
      direction='row'
      justifyContent={justifyContent}
      marginBottom={mb ? theme.spacing(6) : 0}
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

export const ControlsStack = (props: StackProps) => {
  const {
    children,
    justifyContent = 'flex-end',
    alignItems = 'start',
    spacing = theme.spacing(6),
  } = props;

  return (
    <StackMui
      spacing={spacing}
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

const StyledControlsStackItem = styled('div')({
  minWidth: 225,
});

interface ItemProps {
  children: React.ReactNode;
  size?: 's' | 'm' | 'l' | 'el';
}
export const ControlsStackItem = (props: ItemProps) => {
  const { children, size = 's' } = props;

  const areaWidth = () => {
    if (size === 's') return 225;
    else if (size === 'm') return 490;
    else if (size === 'l') return 755;
    else if (size === 'el') return 1550;
    else return 225;
  };

  return (
    <StyledControlsStackItem style={{ width: areaWidth() }}>
      {children}
    </StyledControlsStackItem>
  );
};

export const InputStack = (props: StackProps) => {
  const { children } = props;

  return (
    <StackMui>
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

export const RightElementStack = (props: StackProps) => {
  const { children } = props;

  return (
    <StackMui justifyContent='space-between' height='100%'>
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

