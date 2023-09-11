import React, { FormEventHandler, ReactNode } from 'react';

import { theme } from 'controls/theme';
import { ErrorSubTitle, SubTitle, WarningSubTitle } from 'controls/Typography';

import { styled } from '@mui/material';
import { default as BoxMui } from '@mui/material/Box';
import { ResponsiveStyleValue } from '@mui/system';

interface BoxProps {
  children: ReactNode;
  hidden?: boolean;
  component?: React.ElementType;
  onSubmit?: FormEventHandler;
  height?: string | number;
  width?: string | number;
  display?: string;
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
  onClick?: () => void;
  isDocDetail?: boolean;
}

export const ContentsBox = (props: StyledBoxProps) => {
  const { children, transparent, disable, isDocDetail } = props;
  const style = { border: 0, marginBottom: 2 };
  return (
    <>
      {disable && (
        <StyledDisableBox sx={isDocDetail ? style : null}>
          {children}
        </StyledDisableBox>
      )}
      {transparent && (
        <StyledDefaultBox sx={isDocDetail ? style : null}>
          {children}
        </StyledDefaultBox>
      )}
      {!(transparent || disable) && (
        <StyledWhiteBox sx={isDocDetail ? style : null}>
          {children}
        </StyledWhiteBox>
      )}
    </>
  );
};

const StyledWarningBoxOutside = styled(BoxMui)({
  background: theme.palette.warning.light,
  padding: theme.spacing(4),
  color: theme.palette.warning.main,
  marginBottom: theme.spacing(4),
});

export const WarningBox = (props: StyledBoxProps) => {
  const { children, title, onClick } = props;
  return (
    <>
      <StyledWarningBoxOutside>
        <WarningSubTitle onClick={onClick}>{title}</WarningSubTitle>
        <div style={{ marginBottom: 20 }}></div>
        {children}
      </StyledWarningBoxOutside>
    </>
  );
};

const StyledErrorBoxOutside = styled(BoxMui)({
  background: theme.palette.error.light,
  padding: theme.spacing(4),
  color: theme.palette.error.main,
  marginBottom: theme.spacing(4),
});

export const ErrorBox = (props: StyledBoxProps) => {
  const { children, title, onClick } = props;
  return (
    <>
      <StyledErrorBoxOutside>
        <ErrorSubTitle onClick={onClick}>{title}</ErrorSubTitle>
        <div style={{ marginBottom: 20 }}></div>
        {children}
      </StyledErrorBoxOutside>
    </>
  );
};

const StyledContentsOutside = styled(BoxMui)({
  background: `1px solid  transparent`,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
});

export const ContentsOutsideBox = (props: StyledBoxProps) => {
  const { children, title } = props;
  return (
    <>
      <StyledContentsOutside>
        <SubTitle>{title}</SubTitle>
        <div style={{ marginBottom: 20 }}></div>
        {children}
      </StyledContentsOutside>
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

export const TopBox = (props: BoxProps) => {
  const { children, height, width } = props;
  return (
    <BoxMui
      display='flex'
      alignItems='flex-start'
      height={height}
      width={width}
    >
      {children}
    </BoxMui>
  );
};

export const BottomBox = (props: BoxProps) => {
  const { children, height, width } = props;
  return (
    <BoxMui display='flex' alignItems='flex-end' height={height} width={width}>
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
  justifyContent?: string;
  textAlign?: ResponsiveStyleValue<
    'center' | 'end' | 'left' | 'right' | 'start'
  >;
}

export const MarginBox = (props: MarginBoxProps) => {
  const {
    children,
    mt = 0,
    mb = 0,
    ml = 0,
    mr = 0,
    gap = 0,
    justifyContent = 'center',
    textAlign = 'center',
  } = props;
  return (
    <BoxMui
      display='flex'
      justifyContent={justifyContent}
      textAlign={textAlign}
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

