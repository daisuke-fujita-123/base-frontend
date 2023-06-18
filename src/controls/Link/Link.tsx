import * as React from 'react';

import { default as LinkMui } from '@mui/material/Link';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  underline?: 'none' | 'always' | 'hover' | undefined;
  color?: string;
  onClick?: (href: string) => void;
}

export const Link = (props: LinkProps) => {
  const {
    children,
    href,
    underline = 'always',
    color = '#00C2FF',
    onClick,
  } = props;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (onClick === undefined) return;
    onClick(event.currentTarget.href);
  };

  return (
    <LinkMui
      href={href}
      underline={underline}
      color={color}
      onClick={handleClick}
    >
      {children}
    </LinkMui>
  );
};

