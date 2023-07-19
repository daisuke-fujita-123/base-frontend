import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032';

import { comApiClient } from 'providers/ApiClient';

// API-COM-0027-0001：画面権限一覧情報取得API リクエスト
export interface ScrCom0027GetScreenPermissionRequest {
  // 画面権限ID
  screenPermissionId: string;
  // 業務日付
  businessDate: Date;
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
    '/scr-com-0027/get-screen-permission',
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
  const response = await comApiClient.post('/scr-com-0027/get-screen', request);
  return response.data;
};

// API-COM-0027-0003: 画面権限詳細情報入力チェックAPI リクエスト
export interface ScrCom0027InputCheckScreenPermissionRequest {
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 業務日付
  businessDate: Date;
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
  errorMessages: string[];
  warningMessages: string[];
}

//  API-COM-0027-0003: 画面権限詳細情報入力チェックAPI
export const checkScreenPermission = async (
  request: ScrCom0027InputCheckScreenPermissionRequest
): Promise<ScrCom0027InputCheckScreenPermissionResponse> => {
  const response = await comApiClient.post(
    '/scr-com-0027/input-check-screen-permission',
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
    '/scr-com-0027/regist-screen-permission',
    request
  );
  return response.data;
};

// API-COM-0027-0006: 画面権限一覧情報取得API(組織管理画面から遷移） リクエスト
export interface ScrCom0027GetScreenPermissionOrganizationRequest {
  // リスト
  screenPermissionList: ScreenPermissionOrgList[];
  // 業務日付
  businessDate: Date;
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
    '/scr-com-0027/get-screen-permission-organization',
    request
  );
  return response.data;
};
