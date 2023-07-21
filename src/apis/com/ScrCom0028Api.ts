import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { comApiClient } from 'providers/ApiClient';

// API-COM-0028-0001: マスタ権限一覧取得API リクエスト
export interface ScrCom0028GetMasterPermissionRequest {
  // マスタ権限ID
  masterPermissionId: string;
  // 業務日付
  businessDate: Date;
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
  masterEditFlag?: boolean;
}

//  API-COM-0028-0001: マスタ権限一覧取得API
export const getMasterPermission = async (
  request: ScrCom0028GetMasterPermissionRequest
): Promise<ScrCom0028GetMasterPermissionResponse> => {
  const response = await comApiClient.post(
    '/scr-com-0028/get-master-permission',
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
  const response = await comApiClient.post('/scr-com-0028/get-master', request);
  return response.data;
};

// API-COM-0028-0003: マスタ権限詳細情報入力チェックAPI リクエスト
export interface ScrCom0028InputCheckMasterPermissionRequest {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 業務日付
  businessDate: Date;
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
  errorMessages: string[];
  warningMessages: string[];
}

//  API-COM-0028-0003: マスタ権限詳細情報入力チェックAPI
export const checkMasterPermission = async (
  request: ScrCom0028InputCheckMasterPermissionRequest
): Promise<ScrCom0028InputCheckMasterPermissionResponse> => {
  const response = await comApiClient.post(
    '/scr-com-0028/input-check-master-permission',
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
    '/scr-com-0028/regist-master-permission',
    request
  );
  return response.data;
};

// API-COM-0028-0006: マスタ権限一覧取得API（組織管理画面から遷移） リクエスト
export interface ScrCom0028GetMasterPermissionOrganizationRequest {
  // リスト
  masterPermissionList: MasterPermissionOrgList[];
  // 業務日付
  businessDate: Date;
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
    '/scr-com-0028/get-master-permission-organization',
    request
  );
  return response.data;
};
