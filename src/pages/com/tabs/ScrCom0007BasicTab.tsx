import React, { useEffect, useState } from 'react';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { DataGrid, GridColDef, GridHrefsModel } from 'controls/Datagrid';

import { getReport, ScrCom0007GetReportResponse } from 'apis/com/ScrCom0007Api';

import { useNavigate } from 'hooks/useNavigate';

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'reportId',
    headerName: '帳票ID',
    size: 'l',
    cellType: 'link',
  },
  {
    field: 'reportName',
    headerName: '帳票名',
    size: 'l',
  },
  {
    field: 'reportOutputFormatKind',
    headerName: '出力形式',
    size: 'l',
  },
  {
    field: 'commentEditFlag',
    headerName: 'コメント編集可否',
    size: 'l',
  },
  {
    field: 'changeReservationFlag',
    headerName: '変更予約',
    size: 'l',
  },
  {
    field: 'outputSourceFunctionName',
    headerName: '出力元機能',
    size: 'l',
  },
];

/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // internalId
  id: string;
  // 帳票ID
  reportId: string;
  // 帳票名
  reportName: string;
  // 帳票出力形式区分
  reportOutputFormatKind: string;
  // コメント編集フラグ
  commentEditFlag: boolean;
  // 変更予約フラグ
  changeReservationFlag: boolean;
  // 出力元機能名
  outputSourceFunctionName: string;
}

/**
 * 帳票一覧情報取得APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0007GetReportResponse
): SearchResultRowModel[] => {
  return response.getReportSearchResult.map((x) => {
    return {
      id: x.reportId,
      reportId: x.reportId,
      reportName: x.reportName,
      reportOutputFormatKind: x.reportOutputFormatKind,
      commentEditFlag: x.commentEditFlag,
      changeReservationFlag: x.changeReservationFlag,
      outputSourceFunctionName: x.outputSourceFunctionName,
    };
  });
};

/**
 * SCR-COM-0007 帳票管理画面 基本情報タブ
 * @returns
 */
const ScrCom0007BasicTab = () => {
  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  // router
  const navigate = useNavigate();

  /**
   * 初期表示
   */
  useEffect(() => {
    const initialize = async () => {
      const response = await getReport();
      const searchResult = convertToSearchResultRowModel(response);
      setSearchResult(searchResult);

      // refs設定
      const hrefs = searchResult.map((x) => {
        let href = '';
        switch (x.commentEditFlag) {
          case true:
            href = '/com/reports/' + x.reportId;
            break;
        }
        // コメント編集フラグがtrue以外の場合は帳票IDセルはリンクではなくラベルにする
        // TODO: コメント編集フラグがTrue=> "可"と表示
        // TODO: コメント編集フラグがFalse=> 空白で表示
        return {
          id: href ? x.id : '',
          href: href,
        };
      });

      setHrefs([
        {
          field: 'reportId',
          hrefs: hrefs,
        },
      ]);
    };
    initialize();
  }, []);

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <Section name='帳票一覧'>
            <DataGrid
              columns={searchResultColumns}
              rows={searchResult}
              hrefs={hrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};
export default ScrCom0007BasicTab;
