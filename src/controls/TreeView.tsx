import React, { ReactNode } from 'react';

import { theme } from 'controls/theme';

import { useNavigate } from 'hooks/useNavigate';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Icon,
  IconButton,
  styled,
} from '@mui/material';
import { getRoute } from 'routes/routes';
import { AccordionContentText, AccordionSubTitle } from './Typography';

// interface menuColumnInfo {
//   name: string;
//   href: string;
// }

const menuDef = [
  {
    title: 'お気に入り',
    icon: <StarBorderIcon />,
    children: [],
  },
  {
    title: '会員管理',
    icon: <PersonOutlineIcon />,
    children: ['SCR-MEM-0001'],
  },
  {
    title: '書類管理',
    icon: <DescriptionOutlinedIcon />,
    children: ['SCR-DOC-0001', 'SCR-DOC-0010'],
  },
  {
    title: '取引・会計管理',
    icon: <TableViewOutlinedIcon />,
    children: [
      'SCR-TRA-0001',
      'SCR-TRA-0005',
      'SCR-TRA-0008',
      'SCR-TRA-0011',
      'SCR-TRA-0014',
      'SCR-TRA-0016',
      'SCR-TRA-0023',
      'SCR-TRA-0021',
      'SCR-TRA-0026',
      'SCR-TRA-0031',
      'SCR-TRA-0034',
      'SCR-TRA-0036',
      'SCR-TRA-0038',
    ],
  },
  {
    title: '共通管理',
    icon: <SettingsOutlinedIcon />,
    children: [
      'SCR-COM-0019',
      'SCR-COM-0003',
      'SCR-COM-0009',
      'SCR-COM-0013',
      'SCR-COM-0030',
      'SCR-COM-0023',
      'SCR-COM-0025',
      'SCR-COM-0026',
      'SCR-COM-0031',
    ],
  },
];

interface menuItemModel {
  title: string;
  icon: ReactNode;
  routes: any[];
}

/**
 * TreeViewコンポーネントのProps
 */
interface TreeViewProps {
  open: boolean;
}

/**
 * TreeViewコンポーネント
 */
const TreeView = (props: TreeViewProps) => {
  const { open } = props;

  // router
  const navigate = useNavigate();

  const StyledAccordion = styled(Accordion)({
    ...theme.palette.accordion,
    position: 'static',
    ':hover': {
      ...theme.palette.accordion.hover,
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.accordion.color,
    },
    '& .MuiAccordionSummary-root': {
      padding: 0,
    },
  });

  const StyledAccordionSummary = styled(AccordionSummary)({
    margin: 0,

    '& .MuiAccordionSummary-content': {
      margin: theme.spacing(3),
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: theme.spacing(3),
      height: 20,
    },
    '& .Mui-expanded': {
      margin: 0,
    },
  });

  const StyledAccordionDetails = styled(AccordionDetails)({
    margin: 0,
    padding: 0,
    marginLeft: theme.spacing(9),
  });

  const StyledExpandMoreIcon = styled(ExpandMoreIcon)({
    margin: theme.spacing(3),
  });

  const StyledIconButton = styled(IconButton)({
    margin: 0,
    marginLeft: theme.spacing(2),
    padding: 0,
    color: theme.palette.accordion.color,
  });

  const handleAddIconClick = () => {
    console.log('追加ボタン押下');
  };

  const handleMenuItemClick = (href: string) => {
    navigate(href);
  };

  const menuItems: menuItemModel[] = menuDef.map((item) => {
    const routes = item.children.map((id) => getRoute(id));
    return {
      title: item.title,
      icon: item.icon,
      routes: routes,
    };
  });

  if (open)
    return (
      <>
        {menuItems.map((item, index: number) => (
          <StyledAccordion disableGutters defaultExpanded={open} key={index}>
            <StyledAccordionSummary expandIcon={<StyledExpandMoreIcon />}>
              <Icon sx={{ mr: 1 }}>{item.icon}</Icon>
              <AccordionSubTitle>{item.title}</AccordionSubTitle>
              {index === 0 && (
                <StyledIconButton onClick={handleAddIconClick}>
                  <AddCircleOutlineIcon />
                  追加
                </StyledIconButton>
              )}
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              {item.routes.map((route, index: number) => (
                <AccordionContentText
                  key={index}
                  onClick={() => handleMenuItemClick(route.path)}
                >
                  {route.name}
                </AccordionContentText>
              ))}
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
      </>
    );
  else
    return (
      <>
        {menuItems.map((item, index: number) => (
          <StyledAccordion
            sx={{ borderBottom: 'transparent' }}
            defaultExpanded={open}
            key={index}
          >
            <StyledAccordionSummary>
              <Icon>{item.icon}</Icon>
            </StyledAccordionSummary>
          </StyledAccordion>
        ))}
      </>
    );
};

export default TreeView;

