import React, { useEffect, useState } from 'react';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { DataGrid, GridColDef, GridHrefsModel } from 'controls/Datagrid';

import { getReport, ScrCom0007GetReportResponse } from 'apis/com/ScrCom0007Api';

import { useNavigate } from 'hooks/useNavigate';

import { useGridApiRef } from '@mui/x-data-grid-pro';

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
 * 検索結果行データモデル
 */
interface SearchResultRowModelForConvert {
  // internalId
  id: string;
  // 帳票ID
  reportId: string;
  // 帳票名
  reportName: string;
  // 帳票出力形式区分
  reportOutputFormatKind: string;
  // コメント編集フラグ
  commentEditFlag: string;
  // 変更予約フラグ
  changeReservationFlag: string;
  // 出力元機能名
  outputSourceFunctionName: string;
}

/**
 * 帳票一覧情報取得APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0007GetReportResponse
): SearchResultRowModelForConvert[] => {
  return response.getReportSearchResult.map((x) => {
    return {
      id: x.reportId,
      reportId: x.reportId,
      reportName: x.reportName,
      reportOutputFormatKind: x.reportOutputFormatKind,
      commentEditFlag: x.commentEditFlag === true ? '可' : '',
      changeReservationFlag: x.changeReservationFlag === true ? 'あり' : '',
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
  const [searchResult, setSearchResult] = useState<
    SearchResultRowModelForConvert[]
  >([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  // section の横幅
  const [maxSectionWidth, setMaxSectionWidth] = useState<number>(0);
  // router
  const navigate = useNavigate();

  const apiRef = useGridApiRef();

  useEffect(() => {
    setMaxSectionWidth(
      Number(
        apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
      ) + 40
    );
  }, [apiRef, apiRef.current.rootElementRef]);

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
          case '可':
            href = '/com/reports/' + x.reportId;
            break;
        }
        // コメント編集フラグがtrue以外の場合は帳票IDセルはリンクではなくラベルにする
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
          <Section name='帳票一覧' width={maxSectionWidth}>
            <DataGrid
              apiRef={apiRef}
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
