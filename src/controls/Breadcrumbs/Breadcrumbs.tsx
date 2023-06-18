import React, { useContext } from 'react';

import { default as BreadcrumbsMui } from '@mui/material/Breadcrumbs';
import { Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { AppContext } from 'providers/AppContextProvider';

interface breadCrumbsType {
  name: string;
  href: string;
  movable: boolean;
};

interface BreadcrumbsProps {
  breadCrumbs: breadCrumbsType[];
};

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { breadCrumbs } = props;

  // context
  const { navigateTo } = useContext(AppContext);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    navigateTo(event.currentTarget.pathname);
  };

  return (
    <BreadcrumbsMui separator={<NavigateNextIcon />}>
      {breadCrumbs.map((value, index) => {
        if (value.movable) {
          return (
            <Link key={index} href={value.href} onClick={handleClick}>
              {value.name}
            </Link>
          );
        } else {
          return (
            <Typography key={index}>
              {value.name}
            </Typography>
          );
        }
      })};
    </BreadcrumbsMui>
  );
};
