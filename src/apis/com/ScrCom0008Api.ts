import { comApiClient } from 'providers/ApiClient';

/** SCR-COM-0008-0001: 帳票コメント情報取得API リクエスト */
export interface ScrCom0008GetReportCommentCurrentRequest {
  /** 帳票ID */
  reportId: string;
}

/** SCR-COM-0008-0001: 帳票コメント情報取得API レスポンス */
export interface ScrCom0008GetReportCommentCurrentResponse {
  /** 帳票ID */
  reportId: string;
  /** システム種別 */
  systemKind: string;
  /** 帳票名 */
  reportName: string;
  /** コメント最大行数 */
  commentRow: number;
  /** ポップアップコメント最大行数 */
  popupCommentRow: number;
  /** コメント１行最大文字数 */
  commentLine: number;
  /** 帳票コメント */
  reportComment: string;
  /** 変更タイムスタンプ */
  changeTimestamp: string;
}

/** SCR-COM-0008-0001: 帳票コメント情報取得API */
export const ScrCom0008GetReportCommentCurrent = async (
  request: ScrCom0008GetReportCommentCurrentRequest
): Promise<ScrCom0008GetReportCommentCurrentResponse> => {
  const response = await comApiClient.post(
    '/scr-com-0008/get-reportcomment-current',
    request
  );
  return response.data;
};
