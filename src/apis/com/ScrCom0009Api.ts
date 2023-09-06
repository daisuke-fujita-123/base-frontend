import { comApiClient } from 'providers/ApiClient';

/** API-COM-0009-0001: 帳票一覧取得API リクエスト */
export interface ScrCom0009GetReportListRequest {
  // 契約ID
  contractId: string;
  // 法人ID
  corporationId: string;
  // 請求先ID
  billingId: string;
  // システム種別
  systemKind: string;
  // 帳票作成日（FROM）
  reportCreateDateFrom: string;
  // 帳票作成日（TO）
  reportCreateDateTo: string;
  // 帳票ID
  reportId: string;
  // 制限件数
  limitCount: number;
}

/** API-COM-0009-0001: 帳票一覧取得API レスポンス */
export interface ScrCom0009GetReportListResponse {
  // 取得件数
  acquisitionCount: number;
  // 返却件数
  responseCount: number;
  // 件数
  count: number;
  // リスト
  reportList: GetReportList[];
}

/** API-COM-0009-0001: 帳票一覧取得API レスポンス（リスト行） */
export interface GetReportList {
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // システム種別
  systemKind: string;
  // 帳票名
  reportName: string;
  // 帳票作成タイムスタンプ
  reportCreateTime: string;
  // 帳票ファイル名
  reportFileName: string;
  // 帳票格納バケット名
  reportHouseBucketName: string;
  // 帳票格納ファイルプレフィックス
  reportHouseFilePrefix: string;
  // 帳票履歴番号
  reportHistoryNumber: string;
}

/** API-COM-0009-0001: 帳票一覧取得API */
export const ScrCom0009GetReportList = async (
  request: ScrCom0009GetReportListRequest
): Promise<ScrCom0009GetReportListResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0009/get-reportlist',
    request
  );
  return response.data;
};

/** API-COM-0009-0002: ファイル出力API リクエスト */
export interface ScrCom0009GetReportOutputRequest {
  // 帳票リスト
  fileOutputList: GetReportOutput[];
}

/** API-COM-0009-0002: ファイル出力API リクエスト（リスト行） */
export interface GetReportOutput {
  // 帳票履歴番号
  reportHistoryNumber: string;
  // ファイル名
  fileName: string;
  // 帳票格納バケット名
  reportHouseBucketName: string;
  // 帳票格納ファイルプレフィックス
  reportHouseFilePrefix: string;
}

/** API-COM-0009-0002: ファイル出力API */
export const ScrCom0009GetReportOutput = async (
  request: ScrCom0009GetReportOutputRequest
): Promise<null> => {
  await comApiClient.post('/api/com/scr-com-0009/file-output', request);
  return null;
};
