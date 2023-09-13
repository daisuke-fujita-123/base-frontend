import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { comApiClient } from 'providers/ApiClient';

// API-COM-0026-0001: 画面権限一覧取得 リクエスト
export interface ScrCom0026GetScreenPermissionRequest {
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0026-0001: 画面権限一覧取得 レスポンス
export interface ScrCom0026GetScreenPermissionResponse {
  // 画面権限一覧リスト
  screenPermissionList: ScreenPermissionList[];
}

interface ScreenPermissionList {
  // 項目内リンクId(hrefs)
  id: string;
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
}

// API-COM-0026-0001: 画面権限一覧取得
export const ScrCom0026GetScreenPermission = async (
  req: ScrCom0026GetScreenPermissionRequest
): Promise<ScrCom0026GetScreenPermissionResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0026/get-screen-permission',
    req
  );
  return response.data;
};

// API-COM-0026-0002: マスタ権限一覧取得 リクエスト
export interface ScrCom0026GetMasterPermissionRequest {
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0026-0002: マスタ権限一覧取得 レスポンス
export interface ScrCom0026GetMasterPermissionResponse {
  // マスタ権限一覧リスト
  masterPermissionList: MasterPermissionList[];
}

interface MasterPermissionList {
  // 項目内リンクId(hrefs)
  id: string;
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
}

// API-COM-0026-0002: マスタ権限一覧取得
export const ScrCom0026GetMasterPermission = async (
  req: ScrCom0026GetMasterPermissionRequest
): Promise<ScrCom0026GetMasterPermissionResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0026/get-master-permission',
    req
  );
  return response.data;
};

// API-COM-0026-0003: 承認種類一覧取得 リクエスト
export interface ScrCom0026GetApprovalKindRequest {
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0026-0003: 承認種類一覧取得 レスポンス
export interface ScrCom0026GetApprovalKindResponse {
  // 承認種類一覧リスト
  approvalKindList: ApprovalKindList[];
}

interface ApprovalKindList {
  // 項目内リンクId(hrefs)
  id: string;
  // No
  approvalKindNumber: string;
  // システム種別
  systemKind: string;
  // 画面名
  screenName: string;
  // タブ名称
  tabName: string;
  // 承認条件名
  approvalConditionName: string;
  // 第1
  authorizerFirst: boolean;
  // 第2
  authorizerSecond: boolean;
  // 第3
  authorizerThird: boolean;
  // 第4
  authorizerFourth: boolean;
  // 承認要否
  approvalFlag: boolean;
  // 承認種類ID
  approvalKindId: string;
  // 有効開始日
  validityStartDate: string;
  // 変更前タイムスタンプ
  beforeTimestamp: string;
}

// API-COM-0026-0003: 承認種類一覧取得
export const ScrCom0026GetApprovalKind = async (
  req: ScrCom0026GetApprovalKindRequest
): Promise<ScrCom0026GetApprovalKindResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0026/get-approval-kind',
    req
  );
  return response.data;
};

// API-COM-0026-0007: 承認種類登録更新API リクエスト
export interface ScrCom0026RegistApprovalKindRequest {
  /** リスト */
  registApprovalKindList: RegistApprovalKindList[];
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 変更申請従業員ID
  changeApplicationEmployeeId: string;
  // 業務日付
  businessDate: string;
}

interface RegistApprovalKindList {
  // 承認種類ID
  approvalKindId: string;
  // 有効開始日
  validityStartDate: string;
  // 第1
  number1: boolean;
  // 第2
  number2: boolean;
  // 第3
  number3: boolean;
  // 第4
  number4: boolean;
  // 変更前タイムスタンプ
  beforeTimestamp: string;
}

// API-COM-0026-0007: 承認種類登録更新API
export const ScrCom0026RegistApprovalKind = async (
  req: ScrCom0026RegistApprovalKindRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0026/get-approval-kind',
    req
  );
  return response.data;
};

// API-COM-0026-0005: 承認権限一覧取得 リクエスト
export interface ScrCom0026GetApprovalPermissionRequest {
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0026-0005: 承認権限一覧取得 レスポンス
export interface ScrCom0026GetApprovalPermissionResponse {
  // 画面権限一覧リスト
  approvalPermissionList: ApprovalPermissionList[];
}

interface ApprovalPermissionList {
  // 項目内リンクId(hrefs)
  id: string;
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
}

// API-COM-0026-0005: 承認権限一覧取得
export const ScrCom0026GetApprovalPermission = async (
  req: ScrCom0026GetApprovalPermissionRequest
): Promise<ScrCom0026GetApprovalPermissionResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0026/get-approval-permission',
    req
  );
  return response.data;
};

// API-COM-0026-0006: 変更履歴一覧情報取得 リクエスト
export interface ScrCom0026GetChangeHistoryRequest {
  // 画面ID
  screenId: string;
  // タブID
  tabId: number;
}

// API-COM-0026-0006: 変更履歴一覧情報取得 レスポンス
export interface ScrCom0026GetChangeHistoryResponse {
  // 変更履歴一覧リスト
  changeHistoryList: ChangeHistoryList[];
}

interface ChangeHistoryList {
  // 申請ID
  applicationId: string;
  // 申請元画面
  applicationSourceScreen: string;
  // タブ名
  tabName: string;
  // 一括登録
  allRegistrationName: string;
  // 変更日
  changeDate: string;
  // 申請者ID
  applicationEmployeeId: string;
  // 申請者名
  applicationEmployeeName: string;
  // 申請日時
  applicationDateTime: string;
  // 登録・変更メモ
  registrationChangeMemo: string;
}

// API-COM-0026-0006: 変更履歴一覧情報取得
export const ScrCom0026GetChangeHistory = async (
  req: ScrCom0026GetChangeHistoryRequest
): Promise<ScrCom0026GetChangeHistoryResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0026/get-change-history',
    req
  );
  return response.data;
};

/** API-COM-9999-0025: 変更履歴情報取得API リクエスト */
export interface ScrCom9999GetHistoryInfoRequest {
  // 変更履歴番号
  changeHistoryNumber: string;
}

/** API-COM-9999-0025: 変更履歴情報取得API レスポンス */
export interface ScrCom9999GetHistoryInfoResponse {
  // 承認種類一覧リスト
  approvalKindList: ApprovalKindList[];
}

/** API-COM-9999-0025: 変更履歴情報取得API */
export const ScrCom9999GetHistoryInfo = async (
  request: ScrCom9999GetHistoryInfoRequest
): Promise<ScrCom9999GetHistoryInfoResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-9999/get-history-info',
    request
  );
  return response.data;
};
