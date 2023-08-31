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
  ScrCom0026GetMasterPermission,
  ScrCom0026GetMasterPermissionRequest,
  ScrCom0026GetMasterPermissionResponse,
} from 'apis/com/ScrCom0026Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 検索結果行データモデル
 */
interface SearchResultMasterModel {
  // 項目内リンクId(hrefs)
  id: string;
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: string;
  // 設定役職数
  totalSettingPost: number;
}

/**
 * 検索条件列定義
 */
const masterResultColumns: GridColDef[] = [
  {
    field: 'masterPermissionId',
    headerName: '権限ID',
    headerAlign: 'center',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'masterPermissionName',
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

const convertToMasterModel = (
  master: ScrCom0026GetMasterPermissionResponse
): SearchResultMasterModel[] => {
  return master.masterPermissionList.map((x) => {
    return {
      id: x.masterPermissionId,
      masterPermissionId: x.masterPermissionId,
      masterPermissionName: x.masterPermissionName,
      useFlag: x.useFlag,
      totalSettingPost: x.totalSettingPost,
    };
  });
};

/**
 * アクセス権限管理画面 マスタ権限一覧タブ
 */
const ScrCom0026MasterPermissionTab = () => {
  // state
  const [masterResult, setMasterResult] = useState<SearchResultMasterModel[]>(
    []
  );
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const apiRef = useGridApiRef();
  const maxSectionWidth =
    Number(
      apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
    ) + 40;

  // router
  const navigate = useNavigate();

  // user情報
  const { user } = useContext(AuthContext);

  // 初期表示処理
  useEffect(() => {
    const initialize = async (businessDate: string) => {
      // API-COM-0026-0002: マスタ権限一覧取得API
      const masterRequest: ScrCom0026GetMasterPermissionRequest = {
        businessDate: businessDate,
      };
      const masterResponse = await ScrCom0026GetMasterPermission(masterRequest);
      const masterResult = convertToMasterModel(masterResponse);

      // link設定
      const href = masterResult.map((x) => {
        return {
          id: x.id,
          href: '/com/permissions/master/' + x.masterPermissionId,
        };
      });
      const hrefs = [
        {
          field: 'masterPermissionId',
          hrefs: href,
        },
      ];

      // データグリッドにデータを設定
      setMasterResult(masterResult);
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
    // マスタ権限詳細画面へ遷移
    navigate(url);
  };

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    navigate('/com/permissions/master/new');
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
      'マスタ権限一覧' +
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
          {/* マスタ権限一覧 */}
          <Section
            name='マスタ権限一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconAddClick}>追加</AddButton>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
            width={maxSectionWidth}
          >
            <DataGrid
              columns={masterResultColumns}
              rows={masterResult}
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

export default ScrCom0026MasterPermissionTab;
