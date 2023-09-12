import React, { useContext, useEffect, useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
} from 'controls/Datagrid';

import {
  ScrCom0026GetScreenPermission,
  ScrCom0026GetScreenPermissionRequest,
  ScrCom0026GetScreenPermissionResponse,
} from 'apis/com/ScrCom0026Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 検索結果行データモデル
 */
interface SearchResultScreenModel {
  // 項目内リンクId(hrefs)
  id: string;
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 利用フラグ
  useFlag: string;
  // 設定役職数
  totalSettingPost: number;
}

/**
 * 検索条件列定義
 */
const screenResultColumns: GridColDef[] = [
  {
    field: 'screenPermissionId',
    headerName: '権限ID',
    headerAlign: 'center',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'screenPermissionName',
    headerName: '権限名',
    headerAlign: 'center',
    width: 400,
  },
  {
    field: 'useFlag',
    headerName: '利用フラグ',
    headerAlign: 'center',
    size: 's',
  },
  {
    field: 'totalSettingPost',
    headerName: '設定役職数',
    headerAlign: 'center',
    size: 's',
  },
];

const convertToScreenModel = (
  screen: ScrCom0026GetScreenPermissionResponse
): SearchResultScreenModel[] => {
  return screen.screenPermissionList.map((x) => {
    return {
      id: x.screenPermissionId,
      screenPermissionId: x.screenPermissionId,
      screenPermissionName: x.screenPermissionName,
      useFlag: x.useFlag,
      totalSettingPost: x.totalSettingPost,
    };
  });
};

/**
 * アクセス権限管理画面 画面権限一覧タブ
 */
const ScrCom0026ScreenPermissionTab = () => {
  // state
  const [screenResult, setScreenResult] = useState<SearchResultScreenModel[]>(
    []
  );
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const apiRef = useGridApiRef();

  // router
  const navigate = useNavigate();

  // user情報
  const { user } = useContext(AuthContext);

  // 初期表示処理
  useEffect(() => {
    const initialize = async (businessDate: string) => {
      // API-COM-0026-0001: 画面権限一覧取得API
      const screenRequest: ScrCom0026GetScreenPermissionRequest = {
        businessDate: businessDate,
      };
      const screenResponse = await ScrCom0026GetScreenPermission(screenRequest);
      const screenResult = convertToScreenModel(screenResponse);

      // link設定
      const href = screenResult.map((x) => {
        return {
          id: x.id,
          href: '/com/permissions/screen/' + x.screenPermissionId,
        };
      });
      const hrefs = [
        {
          field: 'screenPermissionId',
          hrefs: href,
        },
      ];

      // データグリッドにデータを設定
      setScreenResult(screenResult);
      setHrefs(hrefs);
    };
    if (user.taskDate !== null) {
      initialize(user.taskDate);
    }
  }, [user]);

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    // 画面権限詳細画面へ遷移
    navigate(url);
  };

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    navigate('/com/permissions/screen/new');
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const min = d.getMinutes();
    exportCsv(
      '画面権限一覧' +
        user.employeeId +
        '_' +
        year.toString() +
        (month < 10 ? '0' : '') +
        month.toString() +
        (day < 10 ? '0' : '') +
        day.toString() +
        hours.toString() +
        min.toString() +
        '.csv',
      apiRef
    );
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          {/* 画面権限一覧 */}
          <Section
            name='画面権限一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconAddClick}>追加</AddButton>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
            fitInside
          >
            <DataGrid
              columns={screenResultColumns}
              rows={screenResult}
              hrefs={hrefs}
              onLinkClick={handleLinkClick}
              apiRef={apiRef}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrCom0026ScreenPermissionTab;
