import { comApiClient } from 'providers/ApiClient';

// API-COM-0007-0001：帳票一覧情報取得API レスポンス
export interface ScrCom0007GetReportResponse {
  // リスト
  getReportSearchResult: GetReportSearchResult[];
}

// API-COM-0007-0001：帳票一覧情報取得API レスポンス（リスト行）
export interface GetReportSearchResult {
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

// API-COM-0007-0002：変更履歴一覧情報取得API レスポンス
export interface ScrCom0007GetChangeHistoryResponse {
  // リスト
  getChangeHistorySearchResult: GetChangeHistorySearchResult[];
}

// API-COM-0007-0002：変更履歴一覧情報取得API レスポンス（リスト行）
export interface GetChangeHistorySearchResult {
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

// API-COM-0007-0001：帳票一覧情報取得API
export const getReport = async (): Promise<ScrCom0007GetReportResponse> => {
  const response = await comApiClient.post('/api/com/scr-com-0007/get-report');
  return response.data;
};

// API-COM-0007-0002：変更履歴一覧情報取得API
export const getChangeHistory =
  async (): Promise<ScrCom0007GetChangeHistoryResponse> => {
    const response = await comApiClient.post(
      '/api/com/scr-com-0007/get-change-history'
    );
    return response.data;
  };
