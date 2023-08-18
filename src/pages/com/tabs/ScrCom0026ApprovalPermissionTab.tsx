import React, { useContext, useEffect, useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import { DataGrid, exportCsv, GridColDef, GridHrefsModel } from 'controls/Datagrid';

import {
    ScrCom0026GetApprovalPermission, ScrCom0026GetApprovalPermissionRequest,
    ScrCom0026GetApprovalPermissionResponse
} from 'apis/com/ScrCom0026Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

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
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);

  // router
  const navigate = useNavigate();

  // user情報
  const { user } = useContext(AuthContext);

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
      const href = approvalResult.map((x) => {
        return {
          id: x.id,
          href: '/com/permissions/approval/' + x.approvalPermissionId,
        };
      });
      const hrefs = [
        {
          field: 'approvalPermissionId',
          hrefs: href,
        },
      ];

      // データグリッドにデータを設定
      setApprovalResult(approvalResult);
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
    // 承認権限詳細画面へ遷移
    navigate(url);
  };

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    navigate('/com/permissions/approval/new');
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
      approvalResult,
      '承認権限一覧' +
        user.employeeId +
        '_' +
        year.toString() +
        (month < 10 ? '0' : '') +
        month.toString() +
        (day < 10 ? '0' : '') +
        day.toString() +
        hours.toString() +
        min.toString() +
        '.csv'
    );
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
