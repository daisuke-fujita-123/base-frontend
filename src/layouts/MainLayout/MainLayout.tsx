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
    <Box sx={{ ...flexColSx, flexGrow: 1, marginTop: 8 }}>
      <Box sx={{ ...flexRowSx, flexGrow: 1 }}>
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
              width: rightElement ? '1325px' : '1590px',
              minWidth: rightElement ? '1325px' : '1590px',
              flexGrow: 1,
              m: 2,
              // overflowX: rightElement ? 'auto' : 'hidden',
            }}
          >
            {mainElement}
          </Box>
        </Box>
        {/* right */}
        {rightElement && (
          <Box sx={{ ...flexColSx, width: '255px', marginTop: 5 }}>
            {rightElement}
          </Box>
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

