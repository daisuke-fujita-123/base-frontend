import React, { useEffect, useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';

import { getChangeHistory, ScrCom0007GetChangeHistoryResponse } from 'apis/com/ScrCom0007Api';

import { useNavigate } from 'hooks/useNavigate';

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
  const [hrefs, setHrefs] = useState<any[]>([]);

  // router
  const navigate = useNavigate();

  /**
 * 初期表示
 */
  useEffect(() => {
    const initialize = async () => {
      const response = await getChangeHistory();
      const searchResult = convertToSearchResultRowModel(response);
      const hrefs = searchResult.map((x) => {
        return {
          field: 'applicationId',
          id: x.applicationId,
          href: '/com/reports/' + x.applicationId,
        };
      });
      setSearchResult(searchResult);
      setHrefs(hrefs);
    };
    initialize();
  }, []);


  /**
   * 
   * @param url 申請IDリンク押下時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
* CSV出力アイコンクリック時のイベントハンドラ
*/
  const handleIconOutputCsvClick = () => {
    // TODO：CSV機能実装後に変更
    alert('TODO:結果結果からCSVを出力する。');
  };

  return (
    <MainLayout>
      <MainLayout main>
        <Section
          name='変更履歴一覧'
          decoration={
            <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
              {/* TODO：エクスポートアイコンに将来的に変更 */}
              <AddButton onClick={handleIconOutputCsvClick}>
                CSV出力
              </AddButton>
            </MarginBox>
          }
        >
          {/* TODO: ツールチップで登録・変更メモを表示する */}
          <DataGrid
            columns={changeHistoryColumns}
            rows={searchResult}
            hrefs={hrefs}
            onLinkClick={handleLinkClick}
          />
        </Section>
      </MainLayout>
    </MainLayout>
  );
};

export default ScrCom0007ChangeHistoryTab;
