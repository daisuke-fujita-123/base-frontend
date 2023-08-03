import React, { useEffect, useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import {
  DataGrid,
  GridColDef,
  GridHrefsModel,
  GridTooltipsModel,
} from 'controls/Datagrid';

import {
  getChangeHistory,
  ScrCom0007GetChangeHistoryResponse,
} from 'apis/com/ScrCom0007Api';

import { useNavigate } from 'hooks/useNavigate';

// TODO: ./datasetが存在しない為要確認
// import { CELL_TYPE_DATASET } from './dataset';

/**
 * セルタイプ行データモデル
 */
interface CellTypeRowModel {
  id: number;
  input: string;
  select: string;
  radio: string;
  checkbox: boolean;
  datepicker: string;
}
/**
 * 検索条件列定義
 */
const changeHistoryColumns: GridColDef[] = [
  {
    field: 'applicationId',
    headerName: '申請ID',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'applicationSourceScreen',
    headerName: '申請元画面',
    size: 'm',
  },
  {
    field: 'tabAllRegist',
    headerName: 'タブ名/一括登録',
    size: 'm',
  },
  {
    field: 'changeDate',
    headerName: '変更日',
    size: 'm',
  },
  {
    field: 'applicantIdName',
    headerName: '申請者ID/申請者名',
    size: 'm',
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
  return response.getChangeHistorySearchResult.map((x) => {
    return {
      id: x.applicationId,
      applicationId: x.applicationId,
      applicationSourceScreen: x.applicationSourceScreen,
      tabAllRegist: x.tabAllRegist,
      changeDate: x.changeDate,
      applicantIdName: x.applicantIdName,
      applicantDateTime: x.applicantDateTime,
      registUpdateMemo: x.registUpdateMemo,
      registUpdateMemoExistence: x.registUpdateMemoExistence,
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

  // const [cellTypeRows] = useState<CellTypeRowModel[]>(CELL_TYPE_DATASET);

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
          href: '/com/reports/' + x.applicationId,
        };
      });
      setHrefs([
        {
          field: 'applicationId',
          hrefs: hrefs,
        },
      ]);
    };

    // ツールチップ設定
    setChangeHistoryTooltips([
      {
        field: 'registUpdateMemoExistence',
        tooltips: searchResult.map((x) => {
          return {
            id: x.applicationId,
            value: 'あり',
            text: x.registUpdateMemo,
          };
        }),
      },
    ]);

    initialize();
  }, []);

  /**
   * @param url 申請IDリンク押下時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleExportCsvClick = () => {
    // exportCsv(cellTypeRows, 'filename.csv');
  };

  return (
    <MainLayout>
      <MainLayout main>
        <Section
          name='変更履歴一覧'
          decoration={
            <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
              <AddButton onClick={handleExportCsvClick}>CSV出力</AddButton>
            </MarginBox>
          }
        >
          <DataGrid
            columns={changeHistoryColumns}
            rows={searchResult}
            hrefs={hrefs}
            onLinkClick={handleLinkClick}
            tooltips={changeHistoryTooltips}
          />
        </Section>
      </MainLayout>
    </MainLayout>
  );
};

export default ScrCom0007ChangeHistoryTab;
