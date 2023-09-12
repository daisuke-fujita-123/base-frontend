import { comApiClient } from 'providers/ApiClient';

// ライブ会場一覧取得API レスポンス
export interface ScrCom0023GetPlaceResponse {
  // リスト
  placeList: SearchResult[];
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

// API-COM-0023-0001：ライブ会場一覧取得API
export const getPlace = async (): Promise<ScrCom0023GetPlaceResponse> => {
  const response = await comApiClient.post('/api/com/scr-com-0023/get-place');
  return response.data;
};
