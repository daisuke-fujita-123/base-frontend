import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { comApiClient } from 'providers/ApiClient';

// API-COM-0029-0001: 承認権限一覧取得API リクエスト
export interface ScrCom0029GetApprovalPermissionRequest {
  // 承認権限ID
  approvalPermissionId: string;
  // 業務日付
  businessDate: string;
}

// API-COM-0029-0001: 承認権限一覧取得API レスポンス
export interface ScrCom0029GetApprovalPermissionResponse {
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
  // 承認権限リスト
  approvalPermissionDetailList: ApprovalPermissionList[];
}

interface ApprovalPermissionList {
  // No
  number: string;
  // システム種別
  systemKind: string;
  // 変更画面
  changeScreen: string;
  // タブID
  tabId: number;
  // タブ名称
  tabName: string;
  // 承認条件名
  condition: string;
  // 第1
  number1: boolean;
  // 第2
  number2: boolean;
  // 第3
  number3: boolean;
  // 第4
  number4: boolean;
  // 承認種類ID
  approvalKindId: string;
}

// API-COM-0029-0001: 承認権限一覧取得API
export const getApprovalPermissionList = async (
  request: ScrCom0029GetApprovalPermissionRequest
): Promise<ScrCom0029GetApprovalPermissionResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0029/get-approval-permission',
    request
  );
  return response.data;
};

// API-COM-0029-0002: 承認権限一覧取得API レスポンス
export interface ScrCom0029GetApprovalPermissionCreateResponse {
  // 承認権限詳細リスト(新規作成用)
  approvalPermissionCreateList: ApprovalPermissionCreateInfo[];
}

interface ApprovalPermissionCreateInfo {
  // No
  number: string;
  // システム種別
  systemKind: string;
  // 変更画面
  changeScreen: string;
  // タブID
  tabId: number;
  // タブ名称
  tabName: string;
  // 条件
  condition: string;
  // 承認種類ID
  approvalKindId: string;
}

// API-COM-0029-0002: 承認権限一覧取得API
export const getApprovalPermissionCreateList = async (
  request: undefined
): Promise<ScrCom0029GetApprovalPermissionCreateResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0029/get-approval',
    request
  );
  return response.data;
};

// API-COM-0029-0003: 承認権限詳細情報入力チェックAPI リクエスト
export interface ScrCom0029CheckApprovalPermissionRequest {
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 業務日付
  businessDate: string;
  // 利用不可設定フラグ
  changeUnavailableFlag: boolean;
  // 承認権限チェックリスト
  checkApprovalPermissionList: CheckApprovalPermissionInfo[];
}

interface CheckApprovalPermissionInfo {
  // NO
  number: string;
  // 承認種類ID
  approvalKindId: string;
  // 第1
  number1?: boolean;
  // 第2
  number2?: boolean;
  // 第3
  number3?: boolean;
  // 第4
  number4?: boolean;
}

// API-COM-0029-0003: 承認権限詳細情報入力チェックAPI レスポンス
export interface ScrCom0029CheckApprovalPermissionResponse {
  // リスト
  errorList: ErrorList[];
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

// API-COM-0029-0003: 承認権限詳細情報入力チェックAPI
export const checkApprovalPermission = async (
  request: ScrCom0029CheckApprovalPermissionRequest
): Promise<ScrCom0029CheckApprovalPermissionResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0029/input-check-approval-permission',
    request
  );
  return response.data;
};

// API-COM-0029-0004: 承認権限登録API リクエスト
export interface ScrCom0029RegistApprovalPermissionRequest {
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 承認リスト
  apprvlList: ApprvlList[];
  // 申請従業員ID
  applicationEmployeeId: string;
  // 画面ID
  screenId: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
  // 業務日付
  businessDate: string;
}

interface ApprvlList {
  // システム種別
  systemKind: string;
  // 変更画面
  changeScreen: string;
  // タブID
  tabId: number;
  // タブ名称
  tabName: string;
  // 承認条件名
  condition: string;
  // 第1
  number1?: boolean;
  // 第2
  number2?: boolean;
  // 第3
  number3?: boolean;
  // 第4
  number4?: boolean;
  // 承認種類ID
  approvalKindId: string;
}

// API-COM-0029-0004: 承認権限登録API
export const registApprovalPermission = async (
  request: ScrCom0029RegistApprovalPermissionRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0029/registration-approval-prmssn',
    request
  );
  return response.data;
};

// API-COM-0029-0006: 承認権限一覧取得API(組織管理画面から遷移） リクエスト
export interface ScrCom0029GetApprovalPermissionMultiRequest {
  // 承認権限ID
  approvalPermissionId: string[];
  // 業務日付
  businessDate: string;
}

// API-COM-0029-0006: 承認権限一覧取得API(組織管理画面から遷移） レスポンス
export interface ScrCom0029GetApprovalPermissionMultiResponse {
  // 承認権限リスト
  approvalpermissionInfoList: ApprovalPermissionInfo[];
  // 承認権限詳細リスト
  approvalPermissionDetailList: ApprovalPermissionDetailInfo[];
}

// 承認権限リスト
interface ApprovalPermissionInfo {
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
}

// 承認権限詳細リスト
interface ApprovalPermissionDetailInfo {
  // No
  number: string;
  // システム種別
  systemKind: string;
  // 変更画面
  changeScreen: string;
  // タブID
  tabId: number;
  // タブ名称
  tabName: string;
  // 承認条件名
  condition: string;
  // 第1
  number1: boolean;
  // 第2
  number2: boolean;
  // 第3
  number3: boolean;
  // 第4
  number4: boolean;
  // 承認種類ID
  approvalKindId: string;
}

// API-COM-0029-0006: 承認権限一覧取得API(組織管理画面から遷移）
export const getApprovalPermissionMultiList = async (
  request: ScrCom0029GetApprovalPermissionMultiRequest
): Promise<ScrCom0029GetApprovalPermissionMultiResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0029/get-approval-permission-organization',
    request
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
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
  // 承認権限リスト
  approvalPermissionDetailList: ApprovalPermissionList[];
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
