import React, { ReactNode } from 'react';

import { theme } from 'controls/theme';

import ButtonAdd from 'icons/button_add.png';
import ButtonAddDisable from 'icons/button_add_dis.png';
import ButtonDelete from 'icons/button_delete.png';
import Info from 'icons/button_info.png';
import ButtonMailDisable from 'icons/button_mail_dis_shrink.png';
import ButtonMailShrink from 'icons/button_mail_shrink.png';
import ButtonOutput from 'icons/button_output.png';
import ButtonOutputDisable from 'icons/button_output_dis.png';
import ButtonOutputShrink from 'icons/button_output_shrink.png';
import ButtonPrintDisable from 'icons/button_printer_dis_shrink.png';
import ButtonPrintShrink from 'icons/button_printer_shrink.png';
import ButtonRegister from 'icons/button_register.png';
import ButtonRegisterDisable from 'icons/button_register_dis.png';
import ButtonSearch from 'icons/button_search.png';
import ContentAdd from 'icons/content_add.png';
import ContenClose from 'icons/content_areaClose.png';
import ContentDel from 'icons/content_del.png';
import SidemenuArrowClose from 'icons/sidemenu_arrowClose.png';

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
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
}

const ButonIcon = (icon: string) => {
  return <img src={icon}></img>;
};

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
      startIcon={disable ? ButonIcon(ButtonAddDisable) : ButonIcon(ButtonAdd)}
      disabled={disable}
      onClick={onClick}
      size='medium'
    >
      {children}
    </StyledAddButton>
  );
};

export const OutputButton = (props: ButtonProps) => {
  const { children, disable = false, onClick } = props;
  return (
    <StyledAddButton
      startIcon={
        disable ? ButonIcon(ButtonOutputDisable) : ButonIcon(ButtonOutput)
      }
      disabled={disable}
      onClick={onClick}
      size='medium'
    >
      {children}
    </StyledAddButton>
  );
};

export const RegisterButton = (props: ButtonProps) => {
  const { children, disable = false, onClick } = props;
  return (
    <StyledAddButton
      startIcon={
        disable ? ButonIcon(ButtonRegisterDisable) : ButonIcon(ButtonRegister)
      }
      disabled={disable}
      onClick={onClick}
      size='medium'
    >
      {children}
    </StyledAddButton>
  );
};

export const MailButton = (props: ButtonProps) => {
  const { children, disable = false, onClick } = props;
  return (
    <StyledAddButton
      startIcon={
        disable ? ButonIcon(ButtonMailDisable) : ButonIcon(ButtonMailShrink)
      }
      disabled={disable}
      onClick={onClick}
      size='medium'
    >
      {children}
    </StyledAddButton>
  );
};

export const PrintButton = (props: ButtonProps) => {
  const { children, disable = false, onClick } = props;
  return (
    <StyledAddButton
      startIcon={
        disable ? ButonIcon(ButtonPrintDisable) : ButonIcon(ButtonPrintShrink)
      }
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
  fontSize: 35,
});

export const AddIconButton = (props: ButtonProps) => {
  const { onClick, disable = false } = props;
  return (
    <StyledAddIconButton onClick={onClick} disabled={disable}>
      {ButonIcon(ContentAdd)}
    </StyledAddIconButton>
  );
};

export const RemoveIconButton = (props: ButtonProps) => {
  const { onClick, disable = false } = props;
  return (
    <StyledAddIconButton onClick={onClick} disabled={disable}>
      {ButonIcon(ContentDel)}
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
      startIcon={ButonIcon(ButtonSearch)}
      disabled={disable}
      onClick={onClick}
      size='large'
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
  const { disable = false, onClick, size = 'medium' } = props;
  return (
    <StyledDeleteButton
      startIcon={ButonIcon(ButtonDelete)}
      disabled={disable}
      onClick={onClick}
      size={size}
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
  width: 135,
  height: 35,
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

interface AccordionButtonProps extends ButtonProps {
  visible: boolean;
}

export const AccordionButton = (props: AccordionButtonProps) => {
  const { disable = false, onClick, visible } = props;
  return (
    <StyledAccordionButton disabled={disable} onClick={onClick}>
      <img
        style={{
          transform: visible ? 'rotate(0)' : 'rotate(180deg)',
        }}
        src={SidemenuArrowClose}
      ></img>
    </StyledAccordionButton>
  );
};

const StyledIconButton = styled(IconButton)({
  color: '#0075ff',
  width: 35,
  height: 35,
  '& .MuiSvgIcon-root': {
    width: 35,
    height: 35,
  },
});

export const InfoButton = (props: ButtonProps) => {
  const { onClick, onBlur, disable = false } = props;
  return (
    <StyledIconButton onClick={onClick} onBlur={onBlur} disabled={disable}>
      {ButonIcon(Info)}
    </StyledIconButton>
  );
};

export const ClearButton = (props: ButtonProps) => {
  const { onClick, disable = false } = props;
  return (
    <StyledAddIconButton onClick={onClick} disabled={disable}>
      {ButonIcon(ContenClose)}
    </StyledAddIconButton>
  );
};

