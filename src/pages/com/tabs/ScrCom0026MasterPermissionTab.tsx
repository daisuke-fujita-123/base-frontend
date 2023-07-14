import React, { useContext, useEffect, useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';

import {
  ScrCom0026GetMasterPermission,
  ScrCom0026GetMasterPermissionRequest,
  ScrCom0026GetMasterPermissionResponse,
} from 'apis/com/ScrCom0026Api';

import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

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
    size: 'l',
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
  const [hrefs, setHrefs] = useState<any[]>([]);

  // router
  const navigate = useNavigate();

  // user情報
  const { appContext } = useContext(AppContext);
  const businessDate = ''; // TODO: 業務日付実装待ち

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
      const hrefs = masterResult.map((x) => {
        return {
          field: 'masterPermissionId',
          id: x.id,
          href: '/com/permissions/master/:' + x.masterPermissionId,
        };
      });

      // データグリッドにデータを設定
      setMasterResult(masterResult);
      setHrefs(hrefs);
    };
    if (businessDate !== null) {
      initialize(businessDate);
    }
  });

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
    // TODO：新規作成用URI決定後に変更
    navigate('/com/permissions#master');
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    // TODO：CSV機能実装後に変更
    alert('TODO:結果からCSVを出力する。');
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
          >
            <DataGrid
              columns={masterResultColumns}
              rows={masterResult}
              pageSize={10}
              hrefs={hrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrCom0026MasterPermissionTab;
