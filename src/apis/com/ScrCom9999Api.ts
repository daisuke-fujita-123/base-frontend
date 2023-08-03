import { comApiClient } from 'providers/ApiClient';

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API リクエスト */
export interface ScrCom9999GetCodeManagementMasterRequest {
  /** 業務日付 */
  businessDate?: string;
  /** コードID */
  codeId: string;
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンス */
export interface ScrCom9999GetCodeManagementMasterResponse {
  // リスト
  searchGetCodeManagementMasterListbox: SearchGetCodeManagementMasterListbox[];
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetCodeManagementMasterListbox {
  // コード値
  codeValue: string;
  // コード名称
  codeName: string;
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API */
export const ScrCom9999GetCodeManagementMaster = async (
  request: ScrCom9999GetCodeManagementMasterRequest
): Promise<ScrCom9999GetCodeManagementMasterResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-9999/get-code-management-master',
    request
  );
  return response.data;
};

/** API-COM-9999-0032: 帳票マスタ取得API レスポンス */
export interface ScrCom9999GetReportmasterResponse {
  // 帳票リスト
  reportMasterInfo: ReportMasterInfo[];
}

export interface ReportMasterInfo {
  // 帳票ID
  reportId: string;
  // 帳票名
  reportName: string;
}

/** API-COM-9999-0032: 帳票マスタ取得API） */
export const ScrCom9999GetReportmaster =
  async (): Promise<ScrCom9999GetReportmasterResponse> => {
    const response = await comApiClient.post(
      '/api/com/scr-com-9999/get-reportmaster'
    );
    return response.data;
  };
