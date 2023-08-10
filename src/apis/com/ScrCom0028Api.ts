import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { comApiClient } from 'providers/ApiClient';

// API-COM-0028-0001: マスタ権限一覧取得API リクエスト
export interface ScrCom0028GetMasterPermissionRequest {
  // マスタ権限ID
  masterPermissionId: string;
  // 業務日付
  businessDate: string;
}

// API-COM-0028-0001: マスタ権限一覧取得API レスポンス
export interface ScrCom0028GetMasterPermissionResponse {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
  // リスト
  masterInfoList: MasterInfoList[];
}

export interface MasterInfoList {
  // 項目ID
  id: string;
  // マスタID
  masterId: string;
  // マスタ名
  masterName: string;
  // 編集権限
  masterEditFlag: boolean;
}

//  API-COM-0028-0001: マスタ権限一覧取得API
export const getMasterPermission = async (
  request: ScrCom0028GetMasterPermissionRequest
): Promise<ScrCom0028GetMasterPermissionResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0028/get-master-permission',
    request
  );
  return response.data;
};

// API-COM-0028-0002:マスタ情報一覧取得API レスポンス
export interface ScrCom0028GetMasterResponse {
  // リスト
  masterInfoList: MasterInfoList[];
}

// API-COM-0028-0002:マスタ情報一覧取得API
export const getMaster = async (
  request: undefined
): Promise<ScrCom0028GetMasterResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0028/get-master',
    request
  );
  return response.data;
};

// API-COM-0028-0003: マスタ権限詳細情報入力チェックAPI リクエスト
export interface ScrCom0028InputCheckMasterPermissionRequest {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 業務日付
  businessDate: string;
  // マスタID一覧
  masterIdList: MasterIdList[];
}

interface MasterIdList {
  // マスタID
  masterId: string;
}

// API-COM-0028-0003: マスタ権限詳細情報入力チェックAPI レスポンス
export interface ScrCom0028InputCheckMasterPermissionResponse {
  // リスト
  errorList: ErrorList[];
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

//  API-COM-0028-0003: マスタ権限詳細情報入力チェックAPI
export const checkMasterPermission = async (
  request: ScrCom0028InputCheckMasterPermissionRequest
): Promise<ScrCom0028InputCheckMasterPermissionResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0028/input-check-master-permission',
    request
  );
  return response.data;
};

// API-COM-0028-0004: マスタ権限登録API リクエスト
export interface ScrCom0028RegistMasterPermissionRequest {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // マスタID一覧
  masterIdList?: MasterIdList[];
  // 申請従業員ID
  applicationEmployeeId: string;
  // 画面ID
  screenId: string;
  // 登録変更メモ
  registrationChangeMemo: string;
}

// API-COM-0028-0004: マスタ権限登録API
export const registMasterPermission = async (
  request: ScrCom0028RegistMasterPermissionRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/com/scr-com-0028/regist-master-permission',
    request
  );
  return response.data;
};

// API-COM-0028-0006: マスタ権限一覧取得API（組織管理画面から遷移） リクエスト
export interface ScrCom0028GetMasterPermissionOrganizationRequest {
  // リスト
  masterPermissionList: MasterPermissionOrgList[];
  // 業務日付
  businessDate: string;
}

export interface MasterPermissionOrgList {
  // マスタ権限ID
  masterPermissionId: string;
}

// API-COM-0028-0006: マスタ権限一覧取得API（組織管理画面から遷移） レスポンス
export interface ScrCom0028GetMasterPermissionOrganizationResponse {
  // マスタ権限リスト
  masterPermissionList: MasterPermissionList[];
  // マスタ情報リスト
  masterInfoList: MasterOrgList[];
}

interface MasterPermissionList {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
}
console;

interface MasterOrgList {
  // 項目ID
  id: string;
  // マスタID
  masterId: string;
  // マスタ名
  masterName: string;
  // 編集権限
  masterEditFlag?: boolean;
}

// API-COM-0028-0006: マスタ権限一覧取得API（組織管理画面から遷移）
export const getMasterPermissionOrganization = async (
  request: ScrCom0028GetMasterPermissionOrganizationRequest
): Promise<ScrCom0028GetMasterPermissionOrganizationResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0028/get-master-permission-organization',
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
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
  // リスト
  masterInfoList: MasterInfoList[];
}

/** API-COM-9999-0025: 変更履歴情報取得API */
export const ScrCom9999GetHistoryInfo = async (
  request: ScrCom9999GetHistoryInfoRequest
): Promise<ScrCom9999GetHistoryInfoResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-9999/get-history-info',
    request
  );
  return response.data;
};
