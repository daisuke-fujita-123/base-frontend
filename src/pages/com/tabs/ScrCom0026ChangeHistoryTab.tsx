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
  GridTooltipsModel,
} from 'controls/Datagrid';

import {
  ScrCom0026GetChangeHistory,
  ScrCom0026GetChangeHistoryResponse,
} from 'apis/com/ScrCom0026Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 検索結果行データモデル
 */
interface SearchResultChangeHistoryModel {
  // 申請ID
  applicationId: string;
  // 申請元画面
  applicationSourceScreen: string;
  // タブ名/一括登録
  tabRegistrationName: string;
  // 変更日
  changeDate: string;
  // 申請者ID+名
  EmployeeIdName: string;
  // 申請日時
  applicationDateTime: string;
  // 登録・変更メモ
  registrationChangeFlag: string;
}

interface ChangeHistoryList {
  // 申請ID
  applicationId: string;
  // タブ名
  tabName: string;
  // 申請元画面
  applicationSourceScreen: string;
  // 一括登録
  allRegistrationName: string;
  // // 申請者ID
  applicationEmployeeId: string;
  // // 申請者名
  applicationEmployeeName: string;
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
    width: 400,
  },
  {
    field: 'tabRegistrationName',
    headerName: 'タブ名/一括登録',
    headerAlign: 'center',
    width: 400,
  },
  {
    field: 'changeDate',
    headerName: '変更日',
    headerAlign: 'center',
    size: 's',
  },
  {
    field: 'EmployeeIdName',
    headerName: '申請者ID/申請者名',
    headerAlign: 'center',
    width: 575,
  },
  {
    field: 'applicationDateTime',
    headerName: '申請日時',
    headerAlign: 'center',
    size: 'm',
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
      tabRegistrationName:
        x.allRegistrationName === null
          ? x.tabName
          : x.tabName === null
          ? x.allRegistrationName
          : x.allRegistrationName !== null && x.tabName !== null
          ? x.tabName
          : '',
      changeDate: x.changeDate,
      EmployeeIdName:
        x.applicationEmployeeId + '　' + x.applicationEmployeeName,
      applicationDateTime: x.applicationDateTime,
      registrationChangeFlag: x.registrationChangeMemo !== '' ? 'あり' : '',
    };
  });
};

const convertToChangeHistory = (
  data: ScrCom0026GetChangeHistoryResponse
): ChangeHistoryList[] => {
  return data.changeHistoryList.map((x) => {
    return {
      applicationId: x.applicationId,
      tabName: x.tabName,
      applicationSourceScreen: x.applicationSourceScreen,
      allRegistrationName: x.allRegistrationName,
      applicationEmployeeId: x.applicationEmployeeId,
      applicationEmployeeName: x.applicationEmployeeName,
      registrationChangeMemo: x.registrationChangeMemo,
    };
  });
};

const ScrCom0026ChangeHistoryTab = () => {
  // state
  const [changeHistoryResult, setChangeHistoryResult] = useState<
    SearchResultChangeHistoryModel[]
  >([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const [tooltips, setTooltips] = useState<GridTooltipsModel[]>([]);
  const apiRef = useGridApiRef();

  // router
  const navigate = useNavigate();
  const screenId = 'SCR-COM-0026';
  const tabId = 5;
  // user情報
  const { user } = useContext(AuthContext);

  // 初期表示処理
  useEffect(() => {
    const initialize = async (screenId: string, tabId: number) => {
      // API-COM-0026-0006: 変更履歴一覧情報取得
      const changeHistoryResponse = await ScrCom0026GetChangeHistory(null);
      const changeHistoryResult = convertToScreenModel(changeHistoryResponse);
      const changeHistoryList = convertToChangeHistory(changeHistoryResponse);

      // link設定
      const href = changeHistoryList.map((x) => {
        return {
          id: x.applicationId,
          href:
            x.applicationSourceScreen === '画面権限詳細' &&
            x.tabName + x.allRegistrationName === '権限変更'
              ? '/com/permissions/screen?change-history-number=' +
                x.applicationId
              : x.applicationSourceScreen === 'マスタ権限詳細' &&
                x.tabName + x.allRegistrationName === '権限変更'
              ? '/com/permissions/master?change-history-number=' +
                x.applicationId
              : x.applicationSourceScreen === 'アクセス権限管理' &&
                x.tabName + x.allRegistrationName === '承認種類変更'
              ? '/com/permissions#approval-kind?change-history-number=' +
                x.applicationId
              : x.applicationSourceScreen === '承認権限詳細' &&
                x.tabName + x.allRegistrationName === '権限変更'
              ? '/com/permissions/approval?change-history-number=' +
                x.applicationId
              : '',
        };
      });
      const hrefs = [
        {
          field: 'applicationId',
          hrefs: href,
        },
      ];

      // tooltip設定
      const tooltip = changeHistoryList.map((x) => {
        return {
          id: x.applicationId,
          text: x.registrationChangeMemo,
        };
      });
      const tooltips = [
        {
          field: 'registrationChangeFlag',
          tooltips: tooltip,
        },
      ];

      // データグリッドに各データを設定
      setChangeHistoryResult(changeHistoryResult);
      setHrefs(hrefs);
      setTooltips(tooltips);
    };

    if (screenId !== null && tabId !== null) {
      initialize(screenId, tabId);
    }
  }, [screenId, tabId]);

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
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const min = d.getMinutes();
    exportCsv(
      '変更履歴一覧' +
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
            fitInside
          >
            <DataGrid
              columns={approvalResultColumns}
              rows={changeHistoryResult}
              hrefs={hrefs}
              tooltips={tooltips}
              onLinkClick={handleLinkClick}
              pagination={true}
              apiRef={apiRef}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrCom0026ChangeHistoryTab;
