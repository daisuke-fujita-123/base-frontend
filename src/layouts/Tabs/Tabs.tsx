import React, { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Grid } from 'layouts/Grid';

import { theme } from 'controls/theme';

import { Box, styled } from '@mui/material';
import Tab from '@mui/material/Tab';
import { default as TabsMui } from '@mui/material/Tabs';

interface TabPanelProps {
  children: ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, index, value } = props;
  return (
    <div hidden={value !== index}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </div>
  );
};

export interface TabDef {
  title: string;
  hash: string;
  disabled?: boolean;
}

interface TabLayoutProps {
  children: ReactNode[];
  tabDef: TabDef[];
  defaultValue: string;
  buttons?: ReactNode;
  isDocDetail?: boolean;
}
// フッターは、タブ内の前ページに聞かせる場合は、ハンドリング方法を考える必要あり。

const StyledTab = styled(Tab)({
  ...theme.palette.tab,
  padding: 0,
  fontWeight: 'bold',
  borderRadius: '10px 10px 0 0',
  fontSize: 13,
  height: 25,
  minHeight: 25,
  width: 116,
  minWidth: 116,
  whiteSpace: 'nowrap',
  border: `1px solid  ${theme.palette.tab?.border}`,
  marginRight: theme.spacing(1),
  '&:hover': {
    ...theme.palette.tab.hover,
  },
  '&:active': {
    ...theme.palette.tab.hover,
  },
  '&:not(.Mui-selected)': {
    ...theme.palette.tabNoSelect,
    top: 2,
    height: 23,
    minHeight: 23,
  },
});

const StyledBox = styled(Box)({
  borderBottom: `2px solid  ${theme.palette.tab?.border}`,
  marginLeft: 10,
});

/**
 * Tabsコンポーネント
 */
export const Tabs = (props: TabLayoutProps) => {
  const { children, tabDef: tabValues, buttons, isDocDetail } = props;

  // router
  const location = useLocation();
  const navigate = useNavigate();

  const defaultTab = tabValues.findIndex((val) => val.hash === location.hash);

  // state
  const [value, setValue] = useState<number>(
    defaultTab === -1 ? 0 : defaultTab
  );

  const onChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
    navigate(location.pathname + tabValues[newValue].hash);
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={buttons ? 8.5 : 12}>
          <StyledBox>
            <TabsMui
              value={value}
              onChange={onChange}
              sx={{ minHeight: 23 }}
              TabIndicatorProps={{
                hidden: true,
              }}
            >
              {tabValues.map((value: TabDef, index: number) => (
                <StyledTab
                  disabled={value.disabled}
                  key={index}
                  label={value.title}
                  sx={{ width: isDocDetail ? 106 : 116 }}
                />
              ))}
            </TabsMui>
          </StyledBox>
        </Grid>
        <Grid item xs={buttons ? 3.5 : 'auto'}>
          {buttons}
        </Grid>
      </Grid>
      {children.map((child: ReactNode, index: number) => (
        <div key={index} hidden={value !== index}>
          {child}
        </div>
      ))}
    </>
  );
};

