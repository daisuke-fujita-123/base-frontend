import React, { ReactNode } from 'react';

import { theme } from 'controls/theme';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, styled } from '@mui/material';
import { default as ButtonMui } from '@mui/material/Button';

interface ButtonProps {
  children?: ReactNode;
  disable?: boolean;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'text' | 'outlined' | 'contained';
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  bgColor?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'small' | 'medium' | 'large';
}
export const Button = (props: ButtonProps) => {
  const {
    children,
    disable = false,
    type = 'button',
    variant = 'outlined',
    color = 'inherit',
    bgColor = '',
    onClick,
  } = props;
  return (
    <ButtonMui
      sx={{
        color: color,
        backgroundColor: bgColor,
        height: 25,
      }}
      color={color}
      variant={variant}
      disabled={disable}
      onClick={onClick}
      type={type}
    >
      {children}
    </ButtonMui>
  );
};

const StyledAddButton = styled(ButtonMui)({
  ...theme.palette.primaryButton,
  '&:hover': {
    ...theme.palette.primaryButton.hover,
  },
  '&:active': {
    ...theme.palette.primaryButton.click,
  },
});

export const PrimaryButton = (props: ButtonProps) => {
  const { children, disable = false, onClick, size } = props;
  return (
    <StyledAddButton disabled={disable} onClick={onClick} size={size}>
      {children}
    </StyledAddButton>
  );
};

export const AddButton = (props: ButtonProps) => {
  const { children, disable = false, onClick } = props;
  return (
    <StyledAddButton
      startIcon={<AddCircleOutlineIcon />}
      disabled={disable}
      onClick={onClick}
      size='medium'
    >
      {children}
    </StyledAddButton>
  );
};

const StyledAddIconButton = styled(IconButton)({
  color: theme.palette.primaryButton.color,
  width: theme.spacing(7),
  height: theme.spacing(7),
  '& .MuiSvgIcon-root': {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
});

export const AddIconButton = (props: ButtonProps) => {
  const { children, onClick } = props;
  return (
    <StyledAddIconButton onClick={onClick}>
      <AddCircleOutlineIcon>{children}</AddCircleOutlineIcon>
    </StyledAddIconButton>
  );
};

const StyledSearchButton = styled(ButtonMui)({
  ...theme.palette.secondaryButton,
  '&:hover': {
    ...theme.palette.secondaryButton.hover,
  },
  '&:active': {
    ...theme.palette.secondaryButton.click,
  },
});

export const SearchButton = (props: ButtonProps) => {
  const { children, disable = false, onClick } = props;
  return (
    <StyledSearchButton
      startIcon={<SearchIcon />}
      disabled={disable}
      onClick={onClick}
      size='medium'
    >
      {children}
    </StyledSearchButton>
  );
};

export const ConfirmButton = (props: ButtonProps) => {
  const { children, disable = false, onClick } = props;
  return (
    <StyledSearchButton disabled={disable} onClick={onClick} size='large'>
      {children}
    </StyledSearchButton>
  );
};

const StyledDeleteButton = styled(ButtonMui)({
  ...theme.palette.deleteButton,
  '&:hover': {
    ...theme.palette.deleteButton.hover,
  },
  '&:active': {
    ...theme.palette.deleteButton.click,
  },
});

export const DeleteButton = (props: ButtonProps) => {
  const { disable = false, onClick } = props;
  return (
    <StyledDeleteButton
      startIcon={<DeleteIcon />}
      disabled={disable}
      onClick={onClick}
      size='medium'
    >
      削除
    </StyledDeleteButton>
  );
};

const StyledCancelButton = styled(ButtonMui)({
  ...theme.palette.cancelButton,
  '&:hover': {
    ...theme.palette.cancelButton.hover,
  },
  '&:active': {
    ...theme.palette.cancelButton.click,
  },
});

export const CancelButton = (props: ButtonProps) => {
  const { children, disable = false, onClick } = props;
  return (
    <StyledCancelButton disabled={disable} onClick={onClick} size='large'>
      {children}
    </StyledCancelButton>
  );
};

const StyledLogoutButton = styled(ButtonMui)({
  ...theme.palette.logoutButton,
  fontWeight: 'bold',
  width: theme.spacing(27),
  height: theme.spacing(7),
  '&:hover': {
    ...theme.palette.logoutButton.hover,
  },
  '&:active': {
    ...theme.palette.logoutButton.click,
  },
});

export const LogoutButton = (props: ButtonProps) => {
  const { disable = false, onClick } = props;
  return (
    <StyledLogoutButton disabled={disable} onClick={onClick}>
      ログアウト
    </StyledLogoutButton>
  );
};

const StyledAccordionButton = styled(ButtonMui)({
  height: theme.spacing(8),
  minWidth: theme.spacing(6),
  width: theme.spacing(6),
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  margin: 0,
  ...theme.palette.accordion,
  '&:hover': {
    ...theme.palette.accordion.hover,
    color: theme.palette.accordion.color,
  },
});

const StyledAccordionCloseIcon = styled(ArrowBackIcon)({
  fontSize: theme.spacing(4),
});
const StyledAccordionOpenIcon = styled(ArrowForwardIcon)({
  fontSize: theme.spacing(4),
});

interface AccordionButtonProps extends ButtonProps {
  visible: boolean;
}

export const AccordionButton = (props: AccordionButtonProps) => {
  const { disable = false, onClick, visible } = props;
  return (
    <StyledAccordionButton disabled={disable} onClick={onClick}>
      {visible ? <StyledAccordionCloseIcon /> : <StyledAccordionOpenIcon />}
    </StyledAccordionButton>
  );
};

