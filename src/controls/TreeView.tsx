import React, { ReactNode, useContext, useEffect, useState } from 'react';

import { theme } from 'controls/theme';

import {
  ScrCom0002GetMenuDetail,
  ScrCom0002GetMenuDetailRequest,
  ScrCom0002GetMenuDetailResponse,
  ScrCom0002UpdateFavorite,
  ScrCom0002UpdateFavoriteRequest,
} from 'apis/com/ScrCom0002Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import sidemenu01 from 'icons/sidemenu_01.png';
import sidemenu02 from 'icons/sidemenu_02.png';
import sidemenu03 from 'icons/sidemenu_03.png';
import sidemenu04 from 'icons/sidemenu_04.png';
import sidemenu05 from 'icons/sidemenu_05.png';
import sidemenuAccordionOpen from 'icons/sidemenu_accordion_arrowOpen.png';
import sidemenuAdd from 'icons/sidemenu_add.png';
import secondfavoOff from 'icons/sidemenu_secondfavo_off.png';
import secondfavoOn from 'icons/sidemenu_secondFavo_on.png';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  styled,
} from '@mui/material';
import { getRoute, Rootes } from 'definitions/routes';
import { Wappen } from './Label';
import { AccordionContentText, AccordionSubTitle } from './Typography';

const MenuIcon = (icon: string) => {
  return <img src={icon}></img>;
};

const menuDef = [
  {
    title: 'お気に入り',
    icon: MenuIcon(sidemenu01),
    children: [],
  },
  {
    title: '会員管理',
    icon: MenuIcon(sidemenu02),
    children: ['SCR-MEM-0001'],
  },
  {
    title: '書類管理',
    icon: MenuIcon(sidemenu03),
    children: ['SCR-DOC-0001', 'SCR-DOC-0010'],
  },
  {
    title: '取引・会計管理',
    icon: MenuIcon(sidemenu04),
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
      'SCR-TRA-0029',
      'SCR-TRA-0031',
      'SCR-TRA-0034',
      'SCR-TRA-0036',
      'SCR-TRA-0038',
    ],
  },
  {
    title: '共通管理',
    icon: MenuIcon(sidemenu05),
    children: [
      'SCR-COM-0019',
      'SCR-COM-0003',
      'SCR-COM-0009',
      'SCR-COM-0007',
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
  routes: Rootes[];
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

const StyledExpandMoreIcon = styled('image')({
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

const StarIconButton = styled(IconButton)({
  color: theme.palette.accordion.color,
});

const StyledIcon = styled('image')({
  marginRight: theme.spacing(1),
  marginTop: theme.spacing(0.6),
  height: 16,
});

/**
 * TreeViewコンポーネント
 */
const TreeView = (props: TreeViewProps) => {
  const { user } = useContext(AuthContext);
  const { open } = props;

  // メニュー詳細情報検索
  const [menuDetailList, setMenuDetailList] =
    useState<ScrCom0002GetMenuDetailResponse | null>(null);
  const [bookmarkList, setBookmarkList] = useState<
    ScrCom0002GetMenuDetailResponse['list'] | null
  >(null);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<menuItemModel[] | null>(null);

  // 初期表示
  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialize = async () => {
    const response = await ScrCom0002GetMenuDetail(getRequest);
    setMenuDetailList(response);
  };

  // お気に入りリスト更新
  useEffect(() => {
    if (menuDetailList) setBookmarkList(menuDetailList.list);
  }, [menuDetailList]);

  // メニューリスト更新
  useEffect(() => {
    const newItems = menuDef.map((item) => {
      // お気に入りのリンクを更新
      if (item.title === 'お気に入り' && bookmarkList) {
        item.children = bookmarkList.map((obj) => obj.screenId);
      }

      const routes: Rootes[] = item.children
        .map((id) => getRoute(id))
        .filter(
          (val): val is Exclude<typeof val, undefined> =>
            val !== undefined && typeof val.path === 'string'
        );
      return {
        title: item.title,
        icon: item.icon,
        routes: routes,
      };
    });
    setMenuItems(newItems);
  }, [bookmarkList]);

  const getRequest: ScrCom0002GetMenuDetailRequest = {
    employeeId: user.employeeId,
  };

  // 完了ボタン押下処理
  const handleRegister = async (event: { stopPropagation: () => void }) => {
    event.stopPropagation();

    // 更新APIに渡す値を設定
    if (!bookmarkList) return;
    const updateList: ScrCom0002GetMenuDetailResponse['list'] = bookmarkList;

    // APIに渡すリクエストを作成
    const updateRequest: ScrCom0002UpdateFavoriteRequest = {
      businessDate: user.taskDate,
      employeeId: user.employeeId,
      list: updateList,
    };
    const response = await ScrCom0002UpdateFavorite(updateRequest);
    setIsRegister(!isRegister);
    handleExpand(false);
    if (response.rtnCode) return initialize();
  };

  // アコーディオン開閉処理
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleExpand = (change: boolean) => {
    setIsOpen(change);
  };

  // 閉じているアコーディオンを格納
  const [closed, setClosed] = useState<string[]>(['default']);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      event.stopPropagation();
      const newArray = closed.filter((val) => val !== 'default');

      setClosed(
        isExpanded
          ? newArray.filter((val) => val !== panel)
          : [...newArray, panel]
      );
    };

  // 追加ボタン押下処理
  const handleClickAdd = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    setIsRegister(!isRegister);
    handleExpand(true);
  };

  // アコーディオン開閉判定処理
  const isOpenAccordion = (index: number): boolean => {
    return (
      closed.findIndex((open) => open === `panel${index}`) === -1 ||
      closed[0] === 'default' ||
      isOpen
    );
  };

  // ☆or★アイコン押下処理
  const handleClickFavorite = (
    event: { stopPropagation: () => void },
    id: string,
    path: string
  ) => {
    event.stopPropagation();

    const newArray = (): ScrCom0002GetMenuDetailResponse['list'] => {
      if (bookmarkList) {
        const isExistent =
          bookmarkList.findIndex((i) => i.screenId === id) !== -1;
        if (isExistent) {
          return bookmarkList.filter((val) => val.screenId !== id);
        } else {
          return bookmarkList.concat({ screenId: id, screenName: path });
        }
      } else {
        return [{ screenId: id, screenName: path }];
      }
    };
    setBookmarkList(newArray());
  };

  // router
  const navigate = useNavigate();

  const handleMenuItemClick = (href: string) => {
    if (isRegister) return;
    navigate(href);
  };

  if (!menuItems) return null;
  if (open)
    return (
      <>
        {menuItems.map((item, index: number) => (
          <StyledAccordion
            disableGutters
            defaultExpanded={true}
            key={index}
            expanded={isOpenAccordion(index)}
            onChange={handleChange(`panel${index}`)}
          >
            <StyledAccordionSummary
              expandIcon={
                <StyledExpandMoreIcon>
                  {MenuIcon(sidemenuAccordionOpen)}
                </StyledExpandMoreIcon>
              }
            >
              <StyledIcon>{item.icon}</StyledIcon>
              <AccordionSubTitle>{item.title}</AccordionSubTitle>
              {index === 0 &&
                // 登録時
                (isRegister ? (
                  <StyledIconButton onClick={handleRegister}>
                    {MenuIcon(sidemenuAdd)}
                    完了
                  </StyledIconButton>
                ) : (
                  <StyledIconButton onClick={handleClickAdd}>
                    {MenuIcon(sidemenuAdd)}
                    追加
                  </StyledIconButton>
                ))}
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              {item.routes.map((route, index: number) => (
                <AccordionContentText
                  key={index}
                  onClick={() => {
                    handleMenuItemClick(route.path ?? '');
                  }}
                >
                  {isRegister &&
                    (bookmarkList?.findIndex(
                      (screen) => screen.screenId === route.id
                    ) !== -1 ? (
                      <StarIconButton
                        onClick={(e) =>
                          handleClickFavorite(e, route.id, route.path ?? '-')
                        }
                      >
                        {MenuIcon(secondfavoOn)}
                      </StarIconButton>
                    ) : (
                      <StarIconButton
                        onClick={(e) =>
                          handleClickFavorite(e, route.id, route.path ?? '-')
                        }
                      >
                        {MenuIcon(secondfavoOff)}
                      </StarIconButton>
                    ))}
                  {route.name}
                  {route.name === 'ワークリスト' && (
                    <Wappen text={String(menuDetailList?.taskNumber)} />
                  )}
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

