import React, { useContext, useEffect, useState } from 'react';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { DataGrid, GridColDef, GridHrefsModel } from 'controls/Datagrid';

import {
  getMember,
  getZipFile,
  ScrCom0031GetMemberRequest,
  ScrCom0031GetMemberResponse,
  ScrCom0031ZipFileResponse,
} from 'apis/com/ScrCom0031Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import {
  GridCellParams,
  GridTreeNode,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import saveAs from 'file-saver';

/**
 * ダウンロードリンク(ZIP)データモデル
 */
interface DownlodLinkModel {
  // リスト
  list: LinkList[];
  // 出力ファイルURL
  outputFileUrl: string;
}

interface LinkList {
  fileName: string;
}

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'jobId',
    headerName: 'ジョブID',
    size: 'l',
  },
  {
    field: 'batchName',
    headerName: 'バッチ名',
    size: 'l',
  },
  {
    field: 'statusName',
    headerName: 'ステータス',
    size: 's',
  },
  {
    field: 'businessDate',
    headerName: 'システム日付',
    size: 'm',
  },
  {
    field: 'startTime',
    headerName: '開始時間',
    size: 'l',
  },
  {
    field: 'endTime',
    headerName: '終了時間',
    size: 'l',
  },
  {
    field: 'executeTime',
    headerName: '実行時間',
    size: 's',
  },
  {
    field: 'count',
    headerName: '実行件数',
    size: 's',
  },
  {
    field: 'link',
    headerName: 'リンク',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'trigger',
    headerName: '実行契機',
    width: 400,
  },
  {
    field: 'errErrm',
    headerName: 'エラーメッセージ',
    width: 500,
  },
];

/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // 件数
  count: number;
  // リスト
  searchResultList: SearchResultList[];
}

interface SearchResultList {
  // 項目内リンクId
  id: string;
  // ジョブID
  jobId: string;
  // バッチ名
  batchName: string;
  // ステータス
  statusName: string;
  // システム日付
  businessDate: string;
  // 開始時間
  startTime: string;
  // 終了時間
  endTime: string;
  // 実行時間
  executeTime: string;
  // 実行件数
  count: string;
  // リンク
  link: string;
  // 出力ファイルURL
  outputFileUrl: string;
  // リンク情報リスト
  linkInfoList: LinkInfoList[];
  // 実行契機
  trigger: string;
  // エラーメッセージ
  errErrm: string;
}

interface LinkInfoList {
  // ファイル名
  fileName: string;
}

/**
 * ダウンロードリンク結果行データモデル
 */
interface DownlodLinkResultRowModel {
  // 出力ファイルURL
  outputZipFileUrl: string;
}

/**
 * バッチ実行結果情報取得APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0031GetMemberResponse
): SearchResultRowModel => {
  return {
    count: response.count,
    searchResultList: response.searchResultList.map((x) => {
      return {
        id: x.link,
        jobId: x.jobId,
        batchName: x.batchName,
        statusName: x.statusName,
        businessDate: x.businessDate,
        startTime: x.startTime,
        endTime: x.endTime,
        executeTime: x.executeTime,
        count: x.count,
        link: x.link,
        outputFileUrl: x.outputFileUrl,
        linkInfoList: x.linkInfoList.map((y) => {
          return {
            fileName: y.reportFileName,
          };
        }),
        trigger: x.trigger,
        errErrm: x.errErrm,
      };
    }),
  };
};

/**
 * ダウンロードリンクからzip圧縮処理APIレスポンスへの変換
 */
const convertToDownlodLinkRowModel = (
  DownlodLinkResult: DownlodLinkResultRowModel
): ScrCom0031ZipFileResponse => {
  return {
    outputZipFileUrl: DownlodLinkResult.outputZipFileUrl,
  };
};

/**
 * SCR-COM-0031 処理結果画面
 */
const ScrCom0031Page = () => {
  // state
  const [searchResult, setSearchResult] = useState<SearchResultList[]>([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const apiRef = useGridApiRef();

  // router
  const navigate = useNavigate();

  // user情報
  const { user } = useContext(AuthContext);

  /**
   * 初期画面表示時に処理結果一覧検索処理を実行
   */
  useEffect(() => {
    const initialize = async () => {
      const request: ScrCom0031GetMemberRequest = {
        businessDate: user.taskDate,
      };
      const response = await getMember(request);
      const searchResult = convertToSearchResultRowModel(response);
      // link設定
      const href = searchResult.searchResultList.map((x) => {
        return {
          id: x.link,
          href: x.outputFileUrl,
        };
      });
      const hrefs = [
        {
          field: 'link',
          hrefs: href,
        },
      ];
      setSearchResult(searchResult.searchResultList);
      setHrefs(hrefs);
    };
    initialize();
  }, [user.taskDate]);

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = async (url: string) => {
    // ファイル拡張子により処理を変更
    const urlLength = url.length;
    const result = url.substring(urlLength - 4, urlLength);

    if (result === '.pdf') {
      navigate(url, true);
    } else if (result === '.csv') {
      const blob = new Blob([url], { type: 'text/csv' });
      saveAs(blob, url);
    } else if (result === '.zip') {
      // zipファイル処理API
      const downlodLinkValues: DownlodLinkModel[] = [];
      searchResult.forEach((x) => {
        if (x.outputFileUrl.includes(url)) {
          downlodLinkValues.push({
            // リスト
            list: x.linkInfoList,
            // 出力ファイルURL
            outputFileUrl: url,
          });
        }
      });
      const response = await getZipFile(downlodLinkValues[0]);
      const zipUrl = convertToDownlodLinkRowModel(response);
      //ダウンロードリンクとして表示
      navigate(zipUrl.outputZipFileUrl, true);
    }
  };

  const handleGetCellClassName = (
    params: GridCellParams<any, any, any, GridTreeNode>
  ) => {
    if (params.field === 'statusName' && params.row.statusName === '処理中')
      return 'statusName-syorityu';
    return '';
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          {/* 処理結果レポート */}
          <Section name='処理結果レポート' fitInside>
            <DataGrid
              columns={searchResultColumns}
              rows={searchResult}
              hrefs={hrefs}
              pagination={true}
              onLinkClick={handleLinkClick}
              apiRef={apiRef}
              getCellClassName={handleGetCellClassName}
              sx={{
                '& .statusName-syorityu': {
                  backgroundColor: '#b9e7da',
                },
              }}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrCom0031Page;
