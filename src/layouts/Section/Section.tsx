import React, { forwardRef, useImperativeHandle, useState } from 'react';

import {
  Box,
  ContentsBox,
  ContentsOutsideBox,
  ErrorBox,
  MarginBox,
  RightBox,
  SearchTextBox,
  WarningBox,
} from 'layouts/Box';

import { theme } from 'controls/theme';
import { SubTitle } from 'controls/Typography';

import { Stack, styled } from '@mui/material';
import { default as AccordionMui } from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';

const AccordionSummary = styled(MuiAccordionSummary)({
  flexDirection: 'row-reverse',
  background: theme.palette.background.paper,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  justifyContent: 'start',
});

interface SectionProps {
  name?: string;
  children: React.ReactNode;
  decoration?: React.ReactNode | React.ReactNode[];
  open?: boolean;
  isSearch?: boolean;
  isTransparent?: boolean;
  serchLabels?: React.ReactNode | React.ReactNode[];
  isWarning?: boolean;
  isError?: boolean;
  openable?: boolean;
  width?: number;
}
export interface SectionClose {
  closeSection: () => void;
}

const StyledAccordion = styled(AccordionMui)({
  backgroundColor: 'transparent',
  width: 'calc( 100% + 2px )',
  margin: 0,
});
// eslint-disable-next-line react/display-name
export const Section = forwardRef((props: SectionProps, ref) => {
  const {
    name,
    children,
    decoration,
    isSearch = false,
    isTransparent = false,
    serchLabels,
    openable = true,
    width,
  } = props;

  const [expanded, setExpanded] = useState<boolean>(true);

  const onClick = () => {
    setExpanded(!expanded);
  };

  useImperativeHandle(ref, () => ({
    closeSection: () => setExpanded(false),
  }));

  if (!name) {
    return <ContentsBox>{children}</ContentsBox>;
  }
  const flexColSx = { display: 'flex', flexDirection: 'column' };
  return (
    <Box width={width}>
      <SubTitle onClick={onClick} openable={openable}>
        {name}
      </SubTitle>
      <ContentsBox transparent={isTransparent} disable={isSearch}>
        <StyledAccordion expanded={expanded}>
          {!expanded && (
            <AccordionSummary>
              <SearchTextBox>{serchLabels}</SearchTextBox>
            </AccordionSummary>
          )}
          {expanded && (
            <RightBox>
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                {decoration}
              </MarginBox>
            </RightBox>
          )}
          <AccordionDetails sx={{ m: theme.spacing(4) }}>
            <Stack sx={{ ...flexColSx, flexGrow: 1 }}>{children}</Stack>
          </AccordionDetails>
        </StyledAccordion>
      </ContentsBox>
    </Box>
  );
});

export const PopSection = (props: SectionProps) => {
  const { name, children, isWarning, isError } = props;

  const [expanded, setExpanded] = useState<boolean>(true);

  const onClick = () => {
    setExpanded(!expanded);
  };

  if (!name) {
    return <ContentsBox>{children}</ContentsBox>;
  }

  return (
    <>
      {isWarning && (
        <WarningBox onClick={onClick} title={name}>
          {children}
        </WarningBox>
      )}
      {isError && (
        <ErrorBox onClick={onClick} title={name}>
          {children}
        </ErrorBox>
      )}
      {!(isError || isWarning) && (
        <ContentsOutsideBox onClick={onClick} title={name}>
          {children}
        </ContentsOutsideBox>
      )}
    </>
  );
};

