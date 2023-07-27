import { comApiClient } from 'providers/ApiClient';

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API リクエスト */
export interface ScrCom9999GetCodeManagementMasterListboxRequest {
  /** 業務日付 */
  businessDate?: string;
  /** コードID */
  codeId: string;
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンス */
export interface ScrCom9999GetCodeManagementMasterListboxResponse {
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

/** API-COM-9999-0021: コース名情報取得API レスポンス */
export interface ScrCom9999GetCoursenameResponse {
  // コードリスト
  courceList: courceList[];
}

/** API-COM-9999-0021: コース名情報取得API レスポンス リスト行 */
export interface courceList {
  // コード値
  codeValue: string;
  // コード名称
  codeName: string;
}

/** API-COM-9999-0022: サービス名情報取得API レスポンス */
export interface ScrCom9999GetServiceInfoResponse {
  // サービスリスト
  serviceList: serviceList[];
}

/** API-COM-9999-0022: サービス名情報取得API レスポンス リスト行 */
export interface serviceList {
  // コード値
  codeValue: string;
  // コード名称
  codeName: string;
}

/**  API-COM-9999-0025: 変更履歴情報取得API リクエスト */
export interface ScrCom9999GetHistoryInfoRequest {
  /** 変更履歴番号 */
  changeHistoryNumber: string | null;
}

/**  API-COM-9999-0025: 変更履歴情報取得API レスポンス */
export interface ScrCom9999GetHistoryInfoResponse {
  /** 変更履歴情報 */
  changeHistoryInfo: Map<string, object>;
}

/** API-COM-9999-0026: 変更予定日取得API リクエスト */
export interface ScrCom9999GetChangeDateRequest {
  /** 業務日付 */
  businessDate: string;
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: string;
  /** 取得キー値 */
  getKeyValue: string;
}

/** API-COM-9999-0026: 変更予定日取得API レスポンス */
export interface ScrCom9999GetChangeDateResponse {
  /** 変更予定日情報 リスト */
  changeExpectDateInfo: changeExpectDateInfo[];
}

/** API-COM-9999-0026: 変更予定日取得API レスポンス (リスト行) */
export interface changeExpectDateInfo {
  /** 変更履歴番号 */
  changeHistoryNumber: number;
  /** 変更予定日 */
  changeExpectDate: string;
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API */
export const ScrCom9999GetCodeManagementMasterListbox = async (
  request: ScrCom9999GetCodeManagementMasterListboxRequest
): Promise<ScrCom9999GetCodeManagementMasterListboxResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-code-management-master-listbox',
    request
  );
  return response.data;
};

/** API-COM-9999-0021: コース名情報取得API */
export const ScrCom9999GetCoursename =
  async (): Promise<ScrCom9999GetCoursenameResponse> => {
    const response = await comApiClient.post('/scr-com-9999/get-coursename');
    return response.data;
  };

/** API-COM-9999-0022: サービス名情報取得API */
export const ScrCom9999GetServiceInfo =
  async (): Promise<ScrCom9999GetServiceInfoResponse> => {
    const response = await comApiClient.post(' /scr-com-9999/get-servicename');
    return response.data;
  };

/** API-COM-9999-0025: 変更履歴情報取得API */
export const ScrCom9999GetHistoryInfo = async (
  request: ScrCom9999GetHistoryInfoRequest
): Promise<ScrCom9999GetHistoryInfoResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-history-info',
    request
  );
  return response.data;
};

/** API-COM-9999-0026: 変更予定日取得API */
export const ScrCom9999GetChangeDate = async (
  request: ScrCom9999GetChangeDateRequest
): Promise<ScrCom9999GetChangeDateResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-change-date',
    request
  );
  return response.data;
};
