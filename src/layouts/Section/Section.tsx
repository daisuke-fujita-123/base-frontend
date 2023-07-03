import React, { useEffect, useState } from 'react';

import { ContentsBox, MarginBox, RightBox, SearchTextBox } from 'layouts/Box';

import { Button } from 'controls/Button';
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
}

const StyledAccordion = styled(AccordionMui)({
  backgroundColor: 'transparent',
  width: 'calc( 100% + 2px )',
  margin: 0,
});

export const Section = (props: SectionProps) => {
  const {
    name,
    children,
    decoration,
    open = true,
    isSearch = false,
    isTransparent = false,
    serchLabels,
  } = props;

  const [expanded, setExpanded] = useState<boolean>(open);

  const onClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  if (!name) {
    return <ContentsBox>{children}</ContentsBox>;
  }

  const flexColSx = { display: 'flex', flexDirection: 'column' };
  return (
    <>
      {!expanded && isSearch && (
        <RightBox>
          <Button
            onClick={() => {
              onClick();
            }}
          >
            ^
          </Button>
        </RightBox>
      )}
      <SubTitle onClick={onClick}>{name}</SubTitle>
      <ContentsBox transparent={isTransparent} disable={isSearch}>
        <StyledAccordion expanded={expanded}>
          {!expanded && (
            <AccordionSummary>
              <SearchTextBox>{serchLabels}</SearchTextBox>
            </AccordionSummary>
          )}
          {expanded && <RightBox>{decoration}</RightBox>}
          <AccordionDetails sx={{ m: theme.spacing(4) }}>
            <Stack sx={{ ...flexColSx, flexGrow: 1 }}>{children}</Stack>
          </AccordionDetails>
          {isSearch && (
            <RightBox>
              <MarginBox mt={2} mb={2} ml={2} mr={2}>
                <Button
                  onClick={() => {
                    onClick();
                  }}
                >
                  ^
                </Button>
              </MarginBox>
            </RightBox>
          )}
        </StyledAccordion>
      </ContentsBox>
    </>
  );
};

