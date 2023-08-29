import { comApiClient } from 'providers/ApiClient';

// バッチ実行結果情報取得API リクエスト
export interface ScrCom0031GetMemberRequest {
  // 業務日付
  businessDate: string;
}

// バッチ実行結果情報取得API レスポンス
export interface ScrCom0031GetMemberResponse {
  // 件数
  count: number;
  // リスト
  searchResultList: SearchResult[];
}

// バッチ実行結果情報取得API レスポンス（リスト行）
export interface SearchResult {
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
  // 帳票ファイル名
  reportFileName: string;
}

// SCR-COM-0031-0001：バッチ実行結果情報取得API
export const getMember = async (
  request: ScrCom0031GetMemberRequest
): Promise<ScrCom0031GetMemberResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0031/get-member',
    request
  );
  return response.data;
};

// ダウンロードリンク(ZIP)データモデル
export interface ScrCom0031ZipFileRequest {
  // リスト
  list: LinkList[];
  // 出力ファイルURL
  outputFileUrl: string;
}

interface LinkList {
  fileName: string;
}

// zipファイル処理API レスポンス
export interface ScrCom0031ZipFileResponse {
  // 出力ファイルURL
  outputZipFileUrl: string;
}

//SCR-COM-0031-0002：zipファイル処理API
export const getZipFile = async (
  request: ScrCom0031ZipFileRequest
): Promise<ScrCom0031ZipFileResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0031/file-output',
    request
  );
  return response.data;
};
