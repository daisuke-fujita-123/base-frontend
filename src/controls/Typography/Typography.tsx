import React, { ReactNode, useState } from 'react';

import { theme } from 'controls/theme';

import Error from 'icons/error_headline.png';
import Pulldown from 'icons/pulldown_arrow.png';
import Warning from 'icons/warning_headline.png';

import {
  Divider as DividerMui,
  IconButton,
  styled,
  Typography as TypographyMui,
} from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

interface TypographyProps {
  children: ReactNode;
  price?: boolean;
  variant?: Variant;
  color?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  textDecoration?: string;
  fontSize?: number;
  textDecorationThickness?: number;
  bold?: boolean;
  openable?: boolean;
  isDocDetail?: boolean;
}
export const Typography = (props: TypographyProps) => {
  const {
    children,
    price,
    variant = 'body1',
    color = '#000000',
    onClick,
    textDecoration,
    fontSize,
    textDecorationThickness,
    bold,
  } = props;
  let pricedTypography = children;
  if (price && typeof children === 'string') {
    pricedTypography = Number(children).toLocaleString();
  }
  return (
    <TypographyMui
      variant={variant}
      onClick={onClick}
      color={color}
      fontSize={fontSize}
      fontWeight={bold ? 'bold' : 'normal'}
      sx={{
        textDecoration: textDecoration,
        textDecorationThickness: textDecorationThickness,
      }}
    >
      {price ? pricedTypography : children}
    </TypographyMui>
  );
};

const StyledSubTitle = styled(TypographyMui)({
  color: theme.palette.contentsBox.main,
  fontWeight: 'bold',
  fontSize: 24,
  marginBottom: theme.spacing(2),
  display: 'inline-block',
  lineHeight: 1,
});

const StyledDivider = styled(DividerMui)({
  borderColor: theme.palette.contentsBox.main,
  borderBottomWidth: theme.spacing(1),
});

export const SubTitle = (props: TypographyProps) => {
  const { children, onClick, openable = false, isDocDetail } = props;
  const [flip, setFlip] = useState<boolean>(false);
  const style = { fontSize: 15, fontWeight: 'bold', marginBottom: '3px' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledSubTitle sx={isDocDetail ? style : null}>
          {children}
        </StyledSubTitle>
        {openable && (
          <IconButton
            onClick={(e) => {
              onClick && onClick(e);
              setFlip(!flip);
            }}
            style={{
              transform: flip ? 'rotate(0)' : 'rotate(180deg)',
              padding: 0,
              paddingTop: isDocDetail ? 7 : 10,
              paddingBottom: isDocDetail ? 7 : 10,
            }}
          >
            <img src={Pulldown}></img>
          </IconButton>
        )}
      </div>
      <StyledDivider />
    </div>
  );
};

const StyledWarningSubTitle = styled(TypographyMui)({
  color: theme.palette.warning.main,
  fontWeight: 'bold',
  fontSize: 24,
  marginBottom: theme.spacing(2),
  display: 'inline-block',
  lineHeight: 1,
  gap: theme.spacing(1),
});

const StyledWarningDivider = styled(DividerMui)({
  borderColor: theme.palette.warning.main,
  borderBottomWidth: theme.spacing(1),
});

export const WarningSubTitle = (props: TypographyProps) => {
  const { children, onClick } = props;
  return (
    <>
      <StyledWarningSubTitle onClick={onClick}>
        <img src={Warning}></img>
        {children}
      </StyledWarningSubTitle>
      <StyledWarningDivider />
    </>
  );
};

const StyledErrorSubTitle = styled(TypographyMui)({
  color: theme.palette.error.main,
  fontWeight: 'bold',
  fontSize: 24,
  marginBottom: theme.spacing(2),
  display: 'inline-block',
  lineHeight: 1,
  gap: theme.spacing(1),
});

const StyledErrorDivider = styled(DividerMui)({
  borderColor: theme.palette.error.main,
  borderBottomWidth: theme.spacing(1),
});

export const ErrorSubTitle = (props: TypographyProps) => {
  const { children, onClick } = props;
  return (
    <>
      <StyledErrorSubTitle onClick={onClick}>
        <img src={Error}></img>
        {children}
      </StyledErrorSubTitle>
      <StyledErrorDivider />
    </>
  );
};

const StyledAccordionSubTitle = styled(TypographyMui)({
  color: theme.palette.accordion.color,
  fontSize: 16,
});

export const AccordionSubTitle = (props: TypographyProps) => {
  const { children } = props;
  return <StyledAccordionSubTitle>{children}</StyledAccordionSubTitle>;
};

const StyledAccordionContentText = styled(TypographyMui)({
  margin: 0,
  marginBottom: theme.spacing(1),
  paddingTop: 7,
  paddingBottom: 7,
  display: 'flex',
  alignItems: 'center',
  fontSize: 13,
  '&:hover': {
    cursor: 'pointer',
    background: theme.palette.accordion.selected,
    color: theme.palette.text.primary,
    fontWeight: 'bold',
  },
});

export const AccordionContentText = (props: TypographyProps) => {
  const { children, onClick } = props;
  return (
    <StyledAccordionContentText onClick={onClick}>
      {children}
    </StyledAccordionContentText>
  );
};

interface SerchLabelProps {
  label: string;
  name: string | string[];
}
const StyledSerchLabelText = styled(TypographyMui)({
  fontSize: 15,
});

export const SerchLabelText = (props: SerchLabelProps) => {
  const { label, name } = props;
  return (
    <TypographyMui noWrap marginRight={4} display='flex'>
      <StyledSerchLabelText fontWeight='bold'>{label} : </StyledSerchLabelText>
      <StyledSerchLabelText>
        {typeof name === 'string' ? name : name.join(',')}
      </StyledSerchLabelText>
    </TypographyMui>
  );
};

