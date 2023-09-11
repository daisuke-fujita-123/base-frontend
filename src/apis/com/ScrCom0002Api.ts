import { _expApiClient, comApiClient, comApiPath } from 'providers/ApiClient';

/** 画面ID */
interface ScreenId {
  screenId?: string;
}

// API-COM-0002-0000：お気に入り情報更新API リクエスト
export interface ScrCom0002UpdateFavoriteRequest {
  /** 業務日付 */
  businessDate?: string;
  /** 従業員ID */
  employeeId: string;
  /** リスト */
  list: ScreenId[];
}

// API-COM-0002-0000：お気に入り情報更新API レスポンス
export interface ScrCom0002UpdateFavoriteResponse {
  // リターンコード
  rtnCode: boolean;
}

// API-COM-0002-0000：お気に入り情報更新API
export const ScrCom0002UpdateFavorite = async (
  req: ScrCom0002UpdateFavoriteRequest
): Promise<ScrCom0002UpdateFavoriteResponse> => {
  const response = await _expApiClient.post(
    `${comApiPath}/scr-com-0002/get-update-favorite`,
    req
  );
  return response.data;
};

// API-COM-0002-0000：メニュー詳細情報取得API リクエスト
export interface ScrCom0002GetMenuDetailRequest {
  /** 従業員ID */
  employeeId: string;
}

/** 画面ID、画面名 */
interface ScreenList {
  screenId: string;
  screenName: string;
}
// API-COM-0002-0000：メニュー詳細情報取得API レスポンス
export interface ScrCom0002GetMenuDetailResponse {
  // リスト
  list: ScreenList[];
  taskNumber: number;
}

// API-COM-0002-0000：メニュー詳細情報取得API
export const ScrCom0002GetMenuDetail = async (
  req: ScrCom0002GetMenuDetailRequest
): Promise<ScrCom0002GetMenuDetailResponse> => {
  const response = await _expApiClient.post(
    `${comApiPath}/scr-com-0002/get-menu-detail`,
    req
  );
  return response.data;
};

// API-COM-0002-0001:システムメッセージ取得API リクエスト
export interface ScrCom0002GetSystemMessageRequest {
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0002-0001:システムメッセージ取得API レスポンス
export interface ScrCom0002GetSystemMessageResponse {
  // メッセージ
  message: string;
}

// API-COM-0002-0001:システムメッセージ取得API
export const SystemMessage = async (
  req: ScrCom0002GetSystemMessageRequest
): Promise<ScrCom0002GetSystemMessageResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0002/get-system-message',
    req
  );
  return response.data;
};

// ログアウト リクエスト
export interface LogoutRequest {
  /** 従業員ID */
  userId: string;
}

// ログアウト レスポンス
export interface LogoutResponse {
  // リターンコード
  rtnCode: boolean;
}

// ログアウト
export const ScrCom9999Logout = async (
  req: LogoutRequest
): Promise<LogoutResponse> => {
  const response = await _expApiClient.post(`${comApiPath}/logout`, req);
  return response.data;
};
