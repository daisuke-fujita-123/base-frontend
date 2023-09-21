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
  getChangeHistory,
  ScrCom0007GetChangeHistoryResponse,
} from 'apis/com/ScrCom0007Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';
import { format } from 'date-fns';

/**
 * 検索条件列定義
 */
const changeHistoryColumns: GridColDef[] = [
  {
    field: 'applicationId',
    headerName: '申請ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'applicationSourceScreen',
    headerName: '申請元画面',
    width: 400,
  },
  {
    field: 'tabAllRegist',
    headerName: 'タブ名/一括登録',
    width: 400,
  },
  {
    field: 'changeDate',
    headerName: '変更日',
    size: 's',
  },
  {
    field: 'applicantIdName',
    headerName: '申請者ID/申請者名',
    width: 600,
  },
  {
    field: 'applicantDateTime',
    headerName: '申請日時',
    size: 'm',
  },
  {
    field: 'registUpdateMemoExistence',
    headerName: '登録・変更メモ',
    size: 'm',
    tooltip: true,
  },
];

/**
 * 検索結果行データモデル
 */
interface changeHistoryRowModel {
  // internalId
  id: string;
  // 申請ID
  applicationId: string;
  // 申請元画面
  applicationSourceScreen: string;
  // タブ名/一括登録
  tabAllRegist: string;
  // 変更日
  changeDate: string;
  // 申請者ID/申請者名
  applicantIdName: string;
  // 申請日時
  applicantDateTime: string;
  // 登録・変更メモ
  registUpdateMemo: string;
  // 登録・変更メモ有無
  registUpdateMemoExistence: string;
  // 帳票ID
  reportId: string;
}

/**
 * 変更履歴一覧情報取得APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0007GetChangeHistoryResponse
): changeHistoryRowModel[] => {
  return response.changeHistoryInfoList.map((x) => {
    return {
      id: x.applicationId,
      applicationId: x.applicationId,
      applicationSourceScreen: x.applicationSourceScreen,
      tabAllRegist: x.tabAllRegistrat,
      changeDate: format(new Date(x.changeDate), 'yyyy/MM/dd'),
      applicantIdName:
        x.applicationEmployeeId + ' ' + x.applicationEmployeeName,
      applicantDateTime: format(
        new Date(x.applicationDateTime),
        'yyyy/MM/dd hh:mm:ss'
      ),
      registUpdateMemo: x.registrationChangeMemo,
      registUpdateMemoExistence: x.registrationChangeMemoExistence,
      reportId: x.reportId,
    };
  });
};

/**
 * SCR-COM-0007 帳票管理画面 変更履歴タブ
 * @returns
 */
const ScrCom0007ChangeHistoryTab = () => {
  // state
  const [searchResult, setSearchResult] = useState<changeHistoryRowModel[]>([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const [changeHistoryTooltips, setChangeHistoryTooltips] = useState<
    GridTooltipsModel[]
  >([]);
  // user情報
  const { user } = useContext(AuthContext);

  const apiRef = useGridApiRef();

  // router
  const navigate = useNavigate();

  /**
   * 初期表示
   */
  useEffect(() => {
    const initialize = async () => {
      const response = await getChangeHistory();
      const searchResult = convertToSearchResultRowModel(response);
      setSearchResult(searchResult);

      // refs設定
      const hrefs = searchResult.map((x) => {
        return {
          id: x.id,
          href:
            '/com/reports/' +
            x.reportId +
            '?change-history-number=' +
            x.applicationId,
        };
      });
      setHrefs([
        {
          field: 'applicationId',
          hrefs: hrefs,
        },
      ]);
      // ツールチップ設定
      setChangeHistoryTooltips([
        {
          field: 'registUpdateMemoExistence',
          tooltips: response.changeHistoryInfoList.map((x) => {
            return {
              id: x.applicationId,
              text: x.registrationChangeMemo,
              value: 'あり',
            };
          }),
        },
      ]);
    };
    initialize();
  }, []);

  /**
   * 申請IDリンク押下時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url, true);
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleExportCsvClick = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const min = d.getMinutes();
    exportCsv(
      '帳票管理_' +
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
    <MainLayout>
      {/* main */}
      <MainLayout main>
        <Section
          name='変更履歴一覧'
          decoration={
            <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
              <AddButton onClick={handleExportCsvClick}>CSV出力</AddButton>
            </MarginBox>
          }
          fitInside
        >
          <DataGrid
            apiRef={apiRef}
            columns={changeHistoryColumns}
            rows={searchResult}
            hrefs={hrefs}
            onLinkClick={handleLinkClick}
            tooltips={changeHistoryTooltips}
            pagination
          />
        </Section>
      </MainLayout>
    </MainLayout>
  );
};

export default ScrCom0007ChangeHistoryTab;
