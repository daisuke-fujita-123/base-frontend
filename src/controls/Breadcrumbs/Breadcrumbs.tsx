import React from 'react';

import { useNavigate } from 'hooks/useNavigate';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, Typography } from '@mui/material';
import { default as BreadcrumbsMui } from '@mui/material/Breadcrumbs';

interface breadCrumbsType {
  name: string;
  href: string;
  movable: boolean;
}

interface BreadcrumbsProps {
  breadCrumbs: breadCrumbsType[];
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { breadCrumbs } = props;

  // router
  const navigate = useNavigate();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    navigate(event.currentTarget.pathname);
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
          return <Typography key={index}>{value.name}</Typography>;
        }
      })}
      ;
    </BreadcrumbsMui>
  );
};

