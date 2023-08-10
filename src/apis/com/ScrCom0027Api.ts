import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { comApiClient } from 'providers/ApiClient';

// API-COM-0027-0001：画面権限一覧情報取得API リクエスト
export interface ScrCom0027GetScreenPermissionRequest {
  // 画面権限ID
  screenPermissionId: string;
  // 業務日付
  businessDate: string;
}

// API-COM-0027-0001：画面権限一覧情報取得API レスポンス
export interface ScrCom0027GetScreenPermissionResponse {
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
  // リスト
  screenList: ScreenList[];
}

export interface ScreenList {
  // 項目ID
  id: string;
  // 画面ID
  screenId: string;
  // 画面名
  screenName: string;
  // 編集権限
  editPermission?: boolean;
}

//  API-COM-0027-0001：画面権限一覧情報取得API
export const getScreenPermission = async (
  request: ScrCom0027GetScreenPermissionRequest
): Promise<ScrCom0027GetScreenPermissionResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0027/get-screen-permission',
    request
  );
  return response.data;
};

// API-COM-0027-0002：画面一覧情報取得API レスポンス
export interface ScrCom0027GetScreenResponse {
  // リスト
  screenList: ScreenList[];
}

//  API-COM-0027-0002：画面一覧情報取得API
export const getScreen = async (
  request: undefined
): Promise<ScrCom0027GetScreenResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0027/get-screen',
    request
  );
  return response.data;
};

// API-COM-0027-0003: 画面権限詳細情報入力チェックAPI リクエスト
export interface ScrCom0027InputCheckScreenPermissionRequest {
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 業務日付
  businessDate: string;
  // 画面ID一覧
  screenIdList: ScreenIdList[];
}

interface ScreenIdList {
  // 画面ID
  screenId: string;
}

// API-COM-0027-0003: 画面権限詳細情報入力チェックAPI レスポンス
export interface ScrCom0027InputCheckScreenPermissionResponse {
  // リスト
  errorList: ErrorList[];
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

//  API-COM-0027-0003: 画面権限詳細情報入力チェックAPI
export const checkScreenPermission = async (
  request: ScrCom0027InputCheckScreenPermissionRequest
): Promise<ScrCom0027InputCheckScreenPermissionResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0027/input-check-screen-permission',
    request
  );
  return response.data;
};

// API-COM-0027-0004: 画面権限登録API リクエスト
export interface ScrCom0027RegistScreenPermissionRequest {
  // 画面権限ID
  screenPermissionId?: string;
  // 画面権限名
  screenPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 画面ID一覧
  screenIdList?: ScreenIdList[];
  // 申請従業員ID
  applicationEmployeeId: string;
  // 画面ID
  screenId: string;
  // 登録変更メモ
  registrationChangeMemo: string;
}

// API-COM-0027-0004: 画面権限登録API
export const registScreenPermission = async (
  request: ScrCom0027RegistScreenPermissionRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/com/scr-com-0027/regist-screen-permission',
    request
  );
  return response.data;
};

// API-COM-0027-0006: 画面権限一覧情報取得API(組織管理画面から遷移） リクエスト
export interface ScrCom0027GetScreenPermissionOrganizationRequest {
  // リスト
  screenPermissionList: ScreenPermissionOrgList[];
  // 業務日付
  businessDate: string;
}

export interface ScreenPermissionOrgList {
  // 画面権限ID
  screenPermissionId: string;
}

// API-COM-0027-0006: 画面権限一覧情報取得API(組織管理画面から遷移） レスポンス
export interface ScrCom0027GetScreenPermissionOrganizationResponse {
  // 画面権限リスト
  screenPermissionList: ScreenPermissionList[];
  // 画面リスト
  screenList: ScreenOrgList[];
}

interface ScreenPermissionList {
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
}

interface ScreenOrgList {
  // 項目ID
  id: string;
  // 画面ID
  screenId: string;
  // 画面名
  screenName: string;
  // 編集権限
  editPermission?: boolean;
}

// API-COM-0027-0006: 画面権限一覧情報取得API(組織管理画面から遷移）
export const getScreenPermissionOrganization = async (
  request: ScrCom0027GetScreenPermissionOrganizationRequest
): Promise<ScrCom0027GetScreenPermissionOrganizationResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0027/get-screen-permission-organization',
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
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
  // リスト
  screenList: ScreenList[];
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
