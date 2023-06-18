import React, { FormEventHandler, ReactNode } from 'react';

import { theme } from 'controls/theme';
import { ErrorSubTitle, WarningSubTitle } from 'controls/Typography';

import { styled } from '@mui/material';
import { default as BoxMui } from '@mui/material/Box';

interface BoxProps {
  children: ReactNode;
  hidden?: boolean;
  component?: React.ElementType;
  onSubmit?: FormEventHandler;
  height?: string | number;
  width?: string | number;
}

export const Box = (props: BoxProps) => {
  const {
    children,
    hidden = false,
    component,
    onSubmit,
    height,
    width,
  } = props;
  return (
    <BoxMui
      hidden={hidden}
      component={component}
      onSubmit={onSubmit}
      height={height}
      width={width}
    >
      {children}
    </BoxMui>
  );
};

const StyledDefaultBox = styled(BoxMui)({
  border: `1px solid  transparent`,
  background: 'transparent',
  marginBottom: theme.spacing(4),
});

const StyledWhiteBox = styled(BoxMui)({
  border: `1px solid  ${theme.palette.background.disabled}`,
  background: theme.palette.background.paper,
  boxShadow: '0px 3px 3px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(4),
});

const StyledDisableBox = styled(BoxMui)({
  border: `1px solid  ${theme.palette.background.disabled}`,
  background: theme.palette.background.disabled,
  boxShadow: '0px 3px 3px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(4),
});

interface StyledBoxProps {
  title?: string;
  children: ReactNode;
  transparent?: boolean;
  disable?: boolean;
}

export const ContentsBox = (props: StyledBoxProps) => {
  const { children, transparent, disable } = props;
  return (
    <>
      {disable && <StyledDisableBox>{children}</StyledDisableBox>}
      {transparent && <StyledDefaultBox>{children}</StyledDefaultBox>}
      {!(transparent || disable) && <StyledWhiteBox>{children}</StyledWhiteBox>}
    </>
  );
};

const StyledWarningBoxOutside = styled(BoxMui)({
  background: theme.palette.warning.light,
  padding: theme.spacing(4),
  color: theme.palette.warning.main,
  margin: `${theme.spacing(4)} ${theme.spacing(4)}  0px`,
});

export const WarningBox = (props: StyledBoxProps) => {
  const { children, title } = props;
  return (
    <>
      <StyledWarningBoxOutside>
        <WarningSubTitle>{title}</WarningSubTitle>
        {children}
      </StyledWarningBoxOutside>
    </>
  );
};

const StyledErrorBoxOutside = styled(BoxMui)({
  background: theme.palette.error.light,
  padding: theme.spacing(4),
  color: theme.palette.error.main,
  margin: `${theme.spacing(4)} ${theme.spacing(4)}  0px`,
});

export const ErrorBox = (props: StyledBoxProps) => {
  const { children, title } = props;
  return (
    <>
      <StyledErrorBoxOutside>
        <ErrorSubTitle>{title}</ErrorSubTitle>
        {children}
      </StyledErrorBoxOutside>
    </>
  );
};

export const CenterBox = (props: BoxProps) => {
  const { children, height, width } = props;
  return (
    <BoxMui
      display='flex'
      justifyContent='center'
      textAlign='center'
      height={height}
      width={width}
    >
      {children}
    </BoxMui>
  );
};

export const RightBox = (props: BoxProps) => {
  const { children, height, width } = props;
  return (
    <BoxMui
      display='flex'
      justifyContent='end'
      textAlign='end'
      height={height}
      width={width}
    >
      {children}
    </BoxMui>
  );
};

export const LeftBox = (props: BoxProps) => {
  const { children, height, width } = props;
  return (
    <BoxMui
      display='flex'
      justifyContent='start'
      textAlign='start'
      height={height}
      width={width}
    >
      {children}
    </BoxMui>
  );
};

interface MarginBoxProps extends BoxProps {
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  gap?: number;
}

export const MarginBox = (props: MarginBoxProps) => {
  const { children, mt, mb, ml, mr, gap } = props;
  return (
    <BoxMui
      display='flex'
      justifyContent='center'
      textAlign='center'
      sx={{ mt: mt, mb: mb, ml: ml, mr: mr, gap: gap }}
    >
      {children}
    </BoxMui>
  );
};

export const SearchTextBox = (props: BoxProps) => {
  const { children } = props;
  return (
    <BoxMui display='flex' sx={{ mt: 6, mb: 6, ml: 4, mr: 2 }}>
      {children}
    </BoxMui>
  );
};

