import React, { useContext, useEffect, useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';

import {
  ScrCom0026GetApprovalPermission,
  ScrCom0026GetApprovalPermissionRequest,
  ScrCom0026GetApprovalPermissionResponse,
} from 'apis/com/ScrCom0026Api';

import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

/**
 * 検索結果行データモデル
 */
interface SearchResultApprovalModel {
  // 項目内リンクId(hrefs)
  id: string;
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 利用フラグ
  useFlag: string;
  // 設定役職数
  totalSettingPost: number;
}

/**
 * 検索条件列定義
 */
const approvalResultColumns: GridColDef[] = [
  {
    field: 'approvalPermissionId',
    headerName: '権限ID',
    headerAlign: 'center',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'approvalPermissionName',
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

const convertToScreenModel = (
  approval: ScrCom0026GetApprovalPermissionResponse
): SearchResultApprovalModel[] => {
  return approval.approvalPermissionList.map((x) => {
    return {
      id: x.approvalPermissionId,
      approvalPermissionId: x.approvalPermissionId,
      approvalPermissionName: x.approvalPermissionName,
      useFlag: x.useFlag,
      totalSettingPost: x.totalSettingPost,
    };
  });
};

/**
 * アクセス権限管理画面 承認権限一覧タブ
 */
const ScrCom0026ApprovalPermissionTab = () => {
  // state
  const [approvalResult, setApprovalResult] = useState<
    SearchResultApprovalModel[]
  >([]);
  const [hrefs, setHrefs] = useState<any[]>([]);

  // router
  const navigate = useNavigate();

  // user情報
  const { appContext } = useContext(AppContext);
  const businessDate = ''; // TODO: 業務日付実装待ち

  // 初期表示処理
  useEffect(() => {
    const initialize = async (businessDate: string) => {
      // API-COM-0026-0005: 承認権限一覧取得API
      const approvalRequest: ScrCom0026GetApprovalPermissionRequest = {
        businessDate: businessDate,
      };
      const approvalResponse = await ScrCom0026GetApprovalPermission(
        approvalRequest
      );
      const approvalResult = convertToScreenModel(approvalResponse);

      // link設定
      const hrefs = approvalResult.map((x) => {
        return {
          field: 'approvalPermissionId',
          id: x.id,
          href: '/com/permissions/approval/:' + x.approvalPermissionId,
        };
      });

      // データグリッドにデータを設定
      setApprovalResult(approvalResult);
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
    // 承認権限詳細画面へ遷移
    navigate(url);
  };

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    // TODO：新規作成用URI決定後に変更
    navigate('/com/permissions#approvalpermission');
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
          {/* 承認権限一覧 */}
          <Section
            name='承認権限一覧'
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
              columns={approvalResultColumns}
              rows={approvalResult}
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

export default ScrCom0026ApprovalPermissionTab;
