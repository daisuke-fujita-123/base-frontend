import React, { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
}
// フッターは、タブ内の前ページに聞かせる場合は、ハンドリング方法を考える必要あり。

const StyledTab = styled(Tab)({
  ...theme.palette.tab.tabSelected,
  fontWeight: 'bold',
  borderTopLeftRadius: '25%',
  borderTopRightRadius: '25%',
  fontSize: theme.spacing(4),
  height: theme.spacing(6),
  width: theme.spacing(30),
  marginRight: theme.spacing(1),
  '&:not(.Mui-selected)': { ...theme.palette.tab.tabNotSelected },
});

const StyledBox = styled(Box)({
  borderBottom: `1px solid  ${theme.palette.tab.tabSelected?.color}`,
  marginLeft: theme.spacing(3),
});

/**
 * Tabsコンポーネント
 */
export const Tabs = (props: TabLayoutProps) => {
  const { children, tabDef: tabValues, defaultValue } = props;

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
      <StyledBox>
        <TabsMui
          value={value}
          onChange={onChange}
          TabIndicatorProps={{
            hidden: true,
          }}
        >
          {tabValues.map((value: TabDef, index: number) => (
            <StyledTab
              disabled={value.disabled}
              key={index}
              label={value.title}
            />
          ))}
        </TabsMui>
      </StyledBox>
      {children.map((child: ReactNode, index: number) => (
        <TabPanel key={index} value={value} index={index}>
          {child}
        </TabPanel>
      ))}
    </>
  );
};

