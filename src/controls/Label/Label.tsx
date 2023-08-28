import React from 'react';

import { theme } from 'controls/theme';

import { Chip, styled, Typography as TypographyMui } from '@mui/material';

const StyledRequiredLabel = styled('div')({
  background: theme.palette.error.main,
  width: 30,
  height: 13,
  marginLeft: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const RequiredLabelText = styled(TypographyMui)({
  color: theme.palette.error.light,
  textAlign: 'center',
  fontSize: 11,
});

export const RequiredLabel = () => {
  return (
    <StyledRequiredLabel>
      <RequiredLabelText>必須</RequiredLabelText>
    </StyledRequiredLabel>
  );
};

const StyledWarningLabel = styled('div')({
  background: theme.palette.warning.light,
  width: theme.spacing(18),
  height: theme.spacing(6),
  border: `2px solid  ${theme.palette.warning.main}`,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
});

const WarningLabelText = styled(TypographyMui)({
  color: theme.palette.warning.main,
  textAlign: 'center',
  fontWeight: 'bold',
});

interface LabelProps {
  text?: string;
}

export const WarningLabel = (props: LabelProps) => {
  const { text } = props;
  return (
    <StyledWarningLabel>
      <WarningLabelText>{text}</WarningLabelText>
    </StyledWarningLabel>
  );
};

const StyledCaptionLabel = styled('div')({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'flex-start',
});

const CaptionLabelText = styled(TypographyMui)({
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '16px',
});

export const CaptionLabel = (props: LabelProps) => {
  const { text } = props;
  return (
    <StyledCaptionLabel>
      <CaptionLabelText>{text}</CaptionLabelText>
    </StyledCaptionLabel>
  );
};

export const Wappen = (props: LabelProps) => {
  const { text } = props;
  return <Chip size='small' color='error' label={text}></Chip>;
};

