import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';

import {
  ScrCom0026GetChangeHistory,
  ScrCom0026GetChangeHistoryRequest,
  ScrCom0026GetChangeHistoryResponse,
} from 'apis/com/ScrCom0026Api';

import { useNavigate } from 'hooks/useNavigate';

/**
 * 検索結果行データモデル
 */
interface SearchResultChangeHistoryModel {
  // 申請ID
  applicationId: string;
  // 申請元画面
  applicationSourceScreen: string;
  // タブ名
  tabName: string;
  // 一括登録
  allRegistrationName: string;
  // 変更日
  changeDate: string;
  // 申請者ID
  applicationEmployeeId: string;
  // 申請者名
  applicationEmployeeName: string;
  // 申請日時
  applicationDateTime: string;
  // 登録・変更メモ
  registrationChangeMemo: string;
}

/**
 * 検索条件列定義
 */
const approvalResultColumns: GridColDef[] = [
  {
    field: 'applicationId',
    headerName: '申請ID',
    headerAlign: 'center',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'applicationSourceScreen',
    headerName: '申請元画面',
    headerAlign: 'center',
    size: 'm',
  },
  {
    field: 'tabRegistrationName',
    headerName: 'タブ名/一括登録',
    headerAlign: 'center',
    size: 'l',
  },
  {
    field: 'changeDate',
    headerName: '変更日',
    headerAlign: 'center',
    size: 'm',
  },
  {
    field: 'EmployeeIdName',
    headerName: '申請者ID/申請者名',
    headerAlign: 'center',
    size: 'l',
  },
  {
    field: 'applicationDateTime',
    headerName: '申請日時',
    headerAlign: 'center',
    size: 'l',
  },
  {
    field: 'registrationChangeFlag',
    headerName: '登録・変更メモ',
    headerAlign: 'center',
    size: 'm',
    tooltip: true,
  },
];

const convertToScreenModel = (
  change: ScrCom0026GetChangeHistoryResponse
): SearchResultChangeHistoryModel[] => {
  return change.changeHistoryList.map((x) => {
    return {
      id: x.applicationId,
      applicationId: x.applicationId,
      applicationSourceScreen: x.applicationSourceScreen,
      tabName: x.tabName,
      allRegistrationName: x.allRegistrationName,
      tabRegistrationName: x.tabName + x.allRegistrationName,
      changeDate: x.changeDate,
      applicationEmployeeId: x.applicationEmployeeId,
      applicationEmployeeName: x.applicationEmployeeName,
      EmployeeIdName:
        x.applicationEmployeeId + '　' + x.applicationEmployeeName,
      applicationDateTime: x.applicationDateTime,
      registrationChangeMemo: x.registrationChangeMemo,
      registrationChangeFlag: x.registrationChangeMemo !== '' ? 'あり' : '',
    };
  });
};

const ScrCom0026ChangeHistoryTab = () => {
  // state
  const [changeHistoryResult, setChangeHistoryResult] = useState<
    SearchResultChangeHistoryModel[]
  >([]);
  const [hrefs, setHrefs] = useState<any[]>([]);
  const [tooltips, setTooltips] = useState<any[]>([]);

  // router
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const screenId = searchParams.get('screenId');
  const tabId = searchParams.get('tabId');

  // 初期表示処理
  useEffect(() => {
    const initialize = async (screenId: string, tabId: number) => {
      // API-COM-0026-0006: 変更履歴一覧情報取得
      const changeHistoryRequest: ScrCom0026GetChangeHistoryRequest = {
        screenId: screenId,
        tabId: tabId,
      };
      const changeHistoryResponse = await ScrCom0026GetChangeHistory(
        changeHistoryRequest
      );
      const changeHistoryResult = convertToScreenModel(changeHistoryResponse);

      // link設定
      const hrefs = changeHistoryResult.map((x) => {
        return {
          field: 'applicationId',
          id: x.applicationId,
          href:
            x.applicationSourceScreen === '画面権限詳細' &&
            x.tabName + x.allRegistrationName === '権限変更'
              ? '/com/permissions/screen/:' + x.applicationId
              : x.applicationSourceScreen === 'マスタ権限詳細' &&
                x.tabName + x.allRegistrationName === '権限変更'
              ? '/com/permissions/master/:' + x.applicationId
              : x.applicationSourceScreen === 'アクセス権限管理' &&
                x.tabName + x.allRegistrationName === '承認種類変更'
              ? '/com/permissions'
              : x.applicationSourceScreen === '承認権限詳細' &&
                x.tabName + x.allRegistrationName === '権限変更'
              ? '/com/permissions/approval/:' + x.applicationId
              : '',
        };
      });

      // tooltip設定
      const tooltips = changeHistoryResult.map((x) => {
        return {
          field: 'registrationChangeFlag',
          id: x.applicationId,
          text: x.registrationChangeMemo,
        };
      });

      // データグリッドに各データを設定
      setChangeHistoryResult(changeHistoryResult);
      setHrefs(hrefs);
      setTooltips(tooltips);
    };

    if (screenId !== null && tabId !== null) {
      initialize(screenId, parseInt(tabId));
    }
  });

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    // 各申請元の権限詳細画面へ遷移
    if (
      url.indexOf('screen') === -1 &&
      url.indexOf('master') === -1 &&
      url.indexOf('approval') === -1
    ) {
      navigate(url + '#approvalkind', true);
    } else {
      navigate(url, true);
    }
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
          {/* 変更履歴一覧 */}
          <Section
            name='変更履歴一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={approvalResultColumns}
              rows={changeHistoryResult}
              pageSize={10}
              hrefs={hrefs}
              tooltips={tooltips}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrCom0026ChangeHistoryTab;
