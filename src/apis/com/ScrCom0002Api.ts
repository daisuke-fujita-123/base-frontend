import { _expApiClient } from 'providers/ApiClient';

/** 画面ID */
interface ScreenId {
  screenId?: string;
}

// API-COM-0002-0002：お気に入り情報更新API リクエスト
export interface ScrCom0002UpdateFavoriteRequest {
  /** 業務日付 */
  businessDate?: string;
  /** 従業員ID */
  employeeId: string;
  /** リスト */
  list: ScreenId[];
}

// API-COM-0002-0002：お気に入り情報更新API レスポンス
export interface ScrCom0002UpdateFavoriteResponse {
  // リターンコード
  rtnCode: boolean;
}

// API-COM-0002-0002：お気に入り情報更新API
export const ScrCom0002UpdateFavorite = async (
  req: ScrCom0002UpdateFavoriteRequest
): Promise<ScrCom0002UpdateFavoriteResponse> => {
  const response = await _expApiClient.post(
    '/_exp/scr-com-0002/get-update-favorite',
    req
  );
  return response.data;
};

// API-COM-0002-0002：お気に入り情報取得API リクエスト
export interface ScrCom0002GetFavoriteRequest {
  /** 業務日付 */
  businessDate?: string;
  /** 従業員ID */
  userId: string;
}

/** 画面ID */
interface ScreenList {
  screenName: string;
  link: string;
}
// API-COM-0002-0002：お気に入り情報取得API レスポンス
export interface ScrCom0002GetFavoriteResponse {
  // リスト
  list: ScreenList[];
}

// API-COM-0002-0002：お気に入り情報取得API
export const ScrCom0002GetFavorite = async (
  req: ScrCom0002GetFavoriteRequest
): Promise<ScrCom0002GetFavoriteResponse> => {
  const response = await _expApiClient.post(
    '/_exp/scr-com-0002/get-member',
    req
  );
  return response.data;
};
