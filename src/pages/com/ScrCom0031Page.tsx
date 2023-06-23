import React, { useState, useEffect, useContext } from 'react';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { useNavigate } from 'hooks/useNavigate';
import { ScrCom0031GetMemberRequest, ScrCom0031GetMemberResponse, getMember, ScrCom0031ZipFileRequest, ScrCom0031ZipFileResponse, getZipFile } from 'apis/com/ScrCom0031Api'
import { AppContext } from 'providers/AppContextProvider';



  /**
* 検索条件データモデル
*/
interface SearchConditionModel {
  // 業務日付
  businessDate: string;
  // ソートキー
  sortKey: string;
  // ソート方向
  sortDirection: string;
  // フィルター項目
  filterColumn: string;
  // フィルター条件符号
  filterOperator: string;
  // フィルター条件値
  filterValue: string;
  // リミット
  limit: number;
  // オフセット
  offset: number;
};

/**
* ダウンロードリンク(ZIP)データモデル
*/
interface DownlodLinkModel {
  // 出力ファイルURL
  outputFileUrl: string;
};

/**
 * 取得用検索条件初期データ
 */
const initialValues: SearchConditionModel = {
  // TODO:業務日付取得方法実装待ち
  businessDate: '',
  sortKey: '',
  sortDirection: 'asc',
  filterColumn: '',
  filterOperator: '',
  filterValue: '',
  limit: 100,
  offset: 0,
};

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'jobId',
    headerName: 'ジョブID',
    width: 128,
  },
  {
    field: 'batchName',
    headerName: 'バッチ名',
    width: 128,
  },
  {
    field: 'statusName',
    headerName: 'ステータス',
    width: 128,
  },
  {
    field: 'businessDate',
    headerName: 'システム日付',
    width: 128,
  },
  {
    field: 'startTime',
    headerName: '開始時間',
    width: 128,
  },
  {
    field: 'endTime',
    headerName: '終了時間',
    width: 128,
  },
  {
    field: 'executeTime',
    headerName: '実行時間',
    width: 128,
  },
  {
    field: 'count',
    headerName: '実行件数',
    width: 128,
  },
  {
    field: 'link',
    headerName: 'リンク',
    width: 128,
    cellType: 'link',
  },
  {
    field: 'trigger',
    headerName: '実行契機',
    width: 128,
  },
  {
    field: 'errErrm',
    headerName: 'エラーメッセージ',
    width: 128,
  },
];

/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // 項目内リンクId(hrefs)
  id: string;
  // ジョブID
  jobId: string;
  // バッチ名
  batchName: string;
  // ステータス
  statusName: string;
  // システム日付
  businessDate: boolean;
  // 開始時間
  startTime: string;
  // 終了時間
  endTime: string;
  // 実行時間
  executeTime?: string;
  // 実行件数
  count?: string;
  // リンク
  link: string;
  // 出力ファイルURL
  outputFileUrl: string;
  // 帳票履歴番号
  reportHistoryNumber: string;
  // 帳票ファイル名
  reportFileName: string;
  // 帳票格納バケット名
  reportHouseBucketName: string;
  // 帳票格納ファイルプレフィックス
  reportHouseFilePrefix: string;
  // 実行契機
  trigger: string;
  // エラーメッセージ
  errErrm: string;
};

/**
 * ダウンロードリンク結果行データモデル
 */
interface DownlodLinkResultRowModel {
  // 出力ファイルURL
  outputFileUrl: string;
}

/**
 * 検索条件モデルからバッチ実行結果情報取得APIリクエストへの変換
 */
const convertFromSearchConditionModel = (SearchCondition: SearchConditionModel): ScrCom0031GetMemberRequest => {
  return {
    businessDate: SearchCondition.businessDate,
    sortKey: SearchCondition.sortKey,
    sortDirection: SearchCondition.sortDirection,
    filterColumn: SearchCondition.filterColumn,
    filterOperator: SearchCondition.filterOperator,
    filterValue: SearchCondition.filterValue,
    limit: SearchCondition.limit,
    offset: SearchCondition.offset,
  }
}

/**
 * バッチ実行結果情報取得APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0031GetMemberResponse
): SearchResultRowModel[] => {
  return response.searchResult.map((x) => {
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
      outputFileUrl:x.outputFileUrl,
      reportHistoryNumber:x.reportHistoryNumber,
      reportFileName: x.reportFileName,
      reportHouseBucketName: x.reportHouseBucketName,
      reportHouseFilePrefix: x.reportHouseFilePrefix,
      trigger: x.trigger,
      errErrm: x.errErrm,
    };
  });
};

/**
 * ダウンロードリンクからzip圧縮処理APIリクエストへの変換
 */
const convertFromDownlodLinkModel = (DownlodLink: DownlodLinkModel): ScrCom0031ZipFileRequest => {
  return {
            outputFileUrl: DownlodLink.outputFileUrl,
  }
}

/**
 * ダウンロードリンクからzip圧縮処理APIレスポンスへの変換
 */
const convertToDownlodLinkRowModel = (DownlodLinkResult: DownlodLinkResultRowModel): ScrCom0031ZipFileResponse => {
  return {
            outputFileUrl: DownlodLinkResult.outputFileUrl,
  }
}

/**
 * SCR-COM-0031 処理結果画面
 */
const ScrCom0031Page = () => {

  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [hrefs, setHrefs] = useState<any[]>([]);

  // router
  const navigate = useNavigate();

  // user情報(businessDateも併せて取得)
  const { appContext } = useContext(AppContext);

  /**
 * 初期画面表示時に処理結果一覧検索処理を実行
 */
  useEffect(() => {
    const initialize = async () => {
      const request = convertFromSearchConditionModel(initialValues);
      const response = await getMember(request);
      const searchResult = convertToSearchResultRowModel(response);
      const hrefs = searchResult.map((x) => {
        return {
          field: 'link',
          id: x.link,
          href: x.outputFileUrl,
        };
      });
      setSearchResult(searchResult);
      setHrefs(hrefs);
    };
    initialize();
  }, []);

    /**
    * リンククリック時のイベントハンドラ
    */
    const handleLinkClick =async (url: string) => {
      // ファイル拡張子により処理を変更
      const urlLength = url.length;
      const result = url.substring(urlLength-4, urlLength);

      if(result === '.pdf'){
        // 別タブで表示
        navigate(url,true);
        
      } else if(result === '.csv'){
        // TODO:ローカルフォルダへのダウンロード
        //navigate(url,false);

      } else if(result === '.zip'){
        // zipファイル処理API
        /**
      * ダウンロードリンク結果行データモデル
      */
      const downlodLinkValues: DownlodLinkModel = {
        // 出力ファイルURL
        outputFileUrl: url,
      }
        const request = convertFromDownlodLinkModel(downlodLinkValues);
        const response = await getZipFile(request);
        const searchResult = convertToDownlodLinkRowModel(response);
        // TODO:ダウンロードリンクとして表示
        //navigate(searchResult.outputFileUrl,true);
    }
    };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          {/* 処理結果レポート */}
          <Section 
            name="処理結果レポート"
          >
            <DataGrid 
              columns={searchResultColumns}
              rows={searchResult}
              hrefs={hrefs}
              // TODO: ページング処理不要
              pageSize={10}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  )
};

export default ScrCom0031Page;
