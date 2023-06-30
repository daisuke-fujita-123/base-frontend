import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { theme } from 'controls/theme';

import {
  ScrCom0002GetFavorite,
  ScrCom0002GetFavoriteRequest,
  ScrCom0002GetFavoriteResponse,
  ScrCom0002UpdateFavorite,
  ScrCom0002UpdateFavoriteRequest,
} from 'apis/com/ScrCom0002Api';

import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import StarIcon from '@mui/icons-material/Star';
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
import { getRoute, routes } from 'routes/routes';
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
 * TreeViewコンポーネントのstyle
 */
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

const StyledCloseAccordion = styled(StyledAccordion)({
  padding: 1,
  width: 40,
  height: 45,
});

const StyledCloseAccordionSummary = styled(AccordionSummary)({
  margin: theme.spacing(3),
  marginRight: 0,
  width: 15,
  height: 15,
  minHeight: 15,
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
  position: 'absolute',
  top: theme.spacing(2.8),
  left: theme.spacing(23),
  margin: 0,
  marginLeft: theme.spacing(2),
  padding: 0,
  color: theme.palette.accordion.color,
});

const StyledIcon = styled(Icon)({
  marginRight: theme.spacing(1),
  marginTop: theme.spacing(0.4),
  width: 15,
  height: 15,
  fontSize: 15,
  '& .MuiSvgIcon-root': {
    width: 'inherit',
    height: 'inherit',
    fontSize: 'inherit',
  },
});

/**
 * TreeViewコンポーネント
 */
const TreeView = (props: TreeViewProps) => {
  const { appContext } = useContext(AppContext);
  const { open } = props;

  // お気に入り登録情報検索
  // TODO:お気に入り情報取得APIがないため、別のAPIを利用する必要あり
  // テスト用
  const [bookmarkList, setBookmarkList] =
    useState<ScrCom0002GetFavoriteResponse | null>(null);

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRequest: ScrCom0002GetFavoriteRequest = {
    businessDate: '',
    userId: appContext.user.id,
  };
  const initialize = async () => {
    const response = await ScrCom0002GetFavorite(getRequest);
    setBookmarkList(response);
  };

  // location
  const location = useLocation();
  const thisScreen = routes.map((val) =>
    val.children.find((value) => {
      if (value.path === location.pathname) return value.id;
    })
  );
  // router
  const navigate = useNavigate();

  // 現在ページがお気に入り登録済みかどうかの判定
  const isBookmarked =
    bookmarkList?.list.findIndex(
      (screen) => screen.screenName === thisScreen[0]?.id
    ) !== -1;

  const handleAddIconClick = async (event: { stopPropagation: () => void }) => {
    event.stopPropagation();

    // 更新APIに渡す値を設定
    const updateList: ScrCom0002GetFavoriteResponse = bookmarkList
      ? { ...bookmarkList }
      : { list: [] };
    if (thisScreen[0]) {
      const newList: ScrCom0002GetFavoriteResponse['list'][0] = {
        screenName: thisScreen[0].id,
        link: thisScreen[0].path ?? '',
      };
      updateList.list.push(newList);
    }
    const reqList: ScrCom0002UpdateFavoriteRequest['list'] = updateList.list
      .filter((val) => val.screenName !== thisScreen[0]?.id)
      .map((val) => {
        return { screenId: val.screenName };
      });
    const updateRequest: ScrCom0002UpdateFavoriteRequest = {
      businessDate: '', // 業務日付に変更
      employeeId: appContext.user.id,
      list: reqList,
    };

    const response = await ScrCom0002UpdateFavorite(updateRequest);
    if (response.rtnCode) return initialize();
  };

  const handleMenuItemClick = (href: string) => {
    navigate(href);
  };

  const menuItems: menuItemModel[] = menuDef.map((item) => {
    // お気に入りのリンクを更新
    if (item.title === 'お気に入り' && bookmarkList) {
      item.children = bookmarkList.list.map((obj) => obj.screenName);
      // お気に入り登録済み画面の場合はアイコンを☆→★に変更
      item.icon = isBookmarked ? <StarIcon /> : <StarBorderIcon />;
    }

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
              {index === 0 || index === 1 || index === 4 ? (
                <StyledIcon>{item.icon}</StyledIcon>
              ) : (
                <StyledIcon sx={{ width: 13 }}>{item.icon}</StyledIcon>
              )}
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
          <StyledCloseAccordion
            sx={{ borderBottom: 'transparent' }}
            defaultExpanded={open}
            key={index}
          >
            <StyledCloseAccordionSummary>
              <StyledIcon>{item.icon}</StyledIcon>
            </StyledCloseAccordionSummary>
          </StyledCloseAccordion>
        ))}
      </>
    );
};

export default TreeView;

