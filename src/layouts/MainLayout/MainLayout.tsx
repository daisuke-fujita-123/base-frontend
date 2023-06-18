import React, { ReactNode } from 'react';

import { RightBox } from 'layouts/Box';

import { Box } from '@mui/material';

export interface MainLayoutProps {
  children?: ReactNode[] | ReactNode;
  main?: boolean;
  right?: boolean;
  bottom?: boolean;
}

export const MainLayout = (props: MainLayoutProps) => {
  const { children, main, right, bottom } = props;

  let mainElement = undefined;
  let rightElement = undefined;
  let bottomElement = undefined;

  // propsに応じて適切な場所に配置するロジック。メインアイテムのみの場合は、childrenが配列ではなくなる。
  if (Array.isArray(children)) {
    children.map((value) => {
      if (React.isValidElement(value)) {
        if (value.props.main) {
          mainElement = value.props.children;
        } else if (value.props.bottom) {
          bottomElement = value.props.children;
        } else if (value.props.right) {
          rightElement = value.props.children;
        } else {
          console.warn('props is invalid');
        }
      } else {
        console.warn('children is invalid');
      }
    });
  } else {
    // メインアイテムのみ指定した場合
    if (children && React.isValidElement(children)) {
      if (children.props.main) {
        mainElement = children.props.children;
      } else {
        console.warn('props is invalid');
      }
    } else {
      console.warn('children is invalid');
    }
  }

  const flexColSx = { display: 'flex', flexDirection: 'column' };
  const flexRowSx = { display: 'flex', flexDirection: 'row' };

  return (
    <Box sx={{ ...flexColSx, flexGrow: 1, overflow: 'auto' }}>
      <Box sx={{ ...flexRowSx, flexGrow: 1, overflow: 'auto' }}>
        {/* main */}
        <Box
          sx={{
            ...flexColSx,
            flexGrow: 1,
          }}
        >
          {/* メニュー開閉部があるため、左側にパディングを入れる */}
          <Box
            sx={{
              ...flexColSx,
              width: '1640px',
              minWidth: '1640px',
              flexGrow: 1,
              p: 5,
            }}
          >
            {mainElement}
          </Box>
        </Box>
        {/* right */}
        {rightElement && (
          <Box sx={{ ...flexColSx, width: '128px' }}>{rightElement}</Box>
        )}
      </Box>
      {/* bottom */}
      {bottomElement && (
        <RightBox>
          <Box sx={{ ...flexRowSx, height: '64px' }}>{bottomElement}</Box>
        </RightBox>
      )}
    </Box>
  );
};

