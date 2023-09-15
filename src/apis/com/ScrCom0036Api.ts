import { comApiClient } from 'providers/ApiClient';

// API-COM-0036-0001：エラー内容取得API リクエスト
export interface ScrCom0036GetAllRegistrationWorkResultRequest {
  /** 一括登録ID */
  allRegistrationId?: string;
  /** 変更履歴番号 */
  changeHistoryNumber?: number;
  /** 連番 */
  number: number;
}

// API-COM-0036-0001：エラー内容取得API レスポンス
export interface ScrCom0036GetAllRegistrationWorkResultResponse {
  /** エラー内容リスト */
  errorList?: {
    /** 項目名 */
    columnName: string;
    /** 項目値 */
    columnValue: string;
    /** 項目メッセージ */
    columnMessage: string;
  }[];
  /** ワーニング内容リスト */
  warnList?: {
    /** 項目名 */
    columnName: string;
    /** 項目値 */
    columnValue: string;
    /** 項目メッセージ */
    columnMessage: string;
  }[];
}

// API-COM-0036-0001：エラー内容取得API
export const ScrCom0036GetAllRegistrationWorkResult = async (
  request: ScrCom0036GetAllRegistrationWorkResultRequest
): Promise<ScrCom0036GetAllRegistrationWorkResultResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0036/get-all-registration-work-result',
    request
  );
  return response.data;
};
