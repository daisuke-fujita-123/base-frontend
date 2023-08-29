import { comApiClient } from 'providers/ApiClient';

// ライブ会場一覧取得API リクエスト
export interface ScrCom0023GetPlaceRequest {
  // 業務日付
  businessDate: string;
  // ソートキー
  sortKey: string;
  // ソート方向
  sortDirection: string;
  // リミット
  limit: number;
  // オフセット
  offset: number;
}

// ライブ会場一覧取得API レスポンス
export interface ScrCom0023GetPlaceResponse {
  // リスト
  searchResult: SearchResult[];
}

// ライブ会場一覧取得API レスポンス（リスト行）
export interface SearchResult {
  // 会場コード
  placeCd: string;
  // 会場名
  placeName: string;
  // 開催曜日区分
  sessionWeekKind: string;
  // おまとめ会場フラグ
  omatomePlaceFlag: boolean;
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 契約ID
  contractId: string;
  // 会場グループ
  placeGroup: string;
  // 支払先会場
  destinationPlace: string;
  // 利用フラグ
  useFlag: boolean;
}

// SCR-COM-0023-0001：ライブ会場一覧取得API
export const getPlace = async (
  request: ScrCom0023GetPlaceRequest
): Promise<ScrCom0023GetPlaceResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0023/get-place',
    request
  );
  return response.data;
};
