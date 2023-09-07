import React from 'react';

import { theme } from 'controls/theme';

import { Chip, styled, Typography as TypographyMui } from '@mui/material';

const RequiredLabelText = styled(TypographyMui)({
  color: theme.palette.error.main,
  textAlign: 'center',
  fontSize: 11,
  fontWeight: 'bold',
});

export const RequiredLabel = () => {
  return <RequiredLabelText>＊</RequiredLabelText>;
};

const StyledWarningLabel = styled('div')({
  width: 105,
  height: 30,
  background: theme.palette.warning.light,
  border: `2px solid  ${theme.palette.warning.main}`,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
});

const WarningLabelText = styled(TypographyMui)({
  color: theme.palette.warning.main,
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 14,
});

interface LabelProps {
  text?: string;
  header?: boolean;
}

export const WarningLabel = (props: LabelProps) => {
  const { text, header } = props;
  const labelStyle = header ? { width: 84, height: 24 } : {};
  const fontStyle = header ? { fontSize: 13 } : {};
  return (
    <StyledWarningLabel style={{ ...labelStyle }}>
      <WarningLabelText style={{ ...fontStyle }}>{text}</WarningLabelText>
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
  fontSize: 14,
});

export const CaptionLabel = (props: LabelProps) => {
  const { text } = props;
  return (
    <StyledCaptionLabel>
      <CaptionLabelText>{text}</CaptionLabelText>
    </StyledCaptionLabel>
  );
};

const StyledChip = styled(Chip)({
  background: '#f37246',
  color: '#fff',
  marginLeft: 5,
  '.MuiChip-label': {
    fontSize: 11,
  },
});

export const Wappen = (props: LabelProps) => {
  const { text } = props;
  return <StyledChip size='small' label={text} />;
};

