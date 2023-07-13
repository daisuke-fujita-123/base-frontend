import { comApiClient } from 'providers/ApiClient';

// API-COM-0011-0001：帳票一覧情報取得API リクエスト
export interface ScrCom0011GetReportListInfoRequest {
  /** 画面ID */
  screenId: string;
}

// API-COM-0011-0001：帳票一覧情報取得API レスポンス
export interface ScrCom0011GetReportListInfoResponse {
  /** リスト */
  reportList: reportList[];
}

// API-COM-0011-0001：帳票一覧情報取得API レスポンス リスト行
export interface reportList {
  /** 帳票ID */
  reportId: string;
  /** 帳票名 */
  reportName: string;
  /** ポップアップコメント最大行数 */
  popupCommentMaxRow: string;
  /** ポップアップコメント1行最大文字数 */
  popupComment1lineMaxCharacterCount: string;
  /** 初期値 */
  default: string;
}

// API-COM-0011-0001：帳票一覧情報取得API
export const ScrCom0011GetReportListInfo = async (
  request: ScrCom0011GetReportListInfoRequest
): Promise<ScrCom0011GetReportListInfoResponse> => {
  const response = await comApiClient.post(
    '/scr-com-0011/get-report-list-info',
    request
  );
  return response.data;
};