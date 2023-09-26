import { docApiClient } from 'providers/ApiClient';

/** API-DOC-0003-0002: 伝票印刷API,API-DOC-0003-0001: 伝票印刷件数検索API  リクエスト */
export interface ScrDoc0003SlipPrintedRequest {
  /** 会場種別 */
  placeKind: string;
  /** 伝票種類（佐川-通常）*/
  slipTypeSagawaNomal: boolean;
  /** 伝票種類（佐川-航空）*/
  slipTypeSagawaAir: boolean;
  /** 伝票種類（ヤマト-通常） */
  slipTypeYamatoNomal: boolean;
  /** 伝票種類（ヤマト-タイム）*/
  slipTypeYamatoTime: boolean;
  /** 伝票種類強制変更 */
  slipTypeForceChange: string;
}

/** API-DOC-0003-0001: 伝票印刷件数検索API レスポンス */
export interface ScrDoc0003SlipPrintedCntSearchResponse {
  /** 出力日*/
  outputDate: string;
  /** 出力時間*/
  outputTime: string;
  /** 出力結果：佐川（通常）*/
  outputResultSagawaNomal: number;
  /** 出力結果：佐川（航空）*/
  outputResultSagawaAir: number;
  /** 出力結果：ヤマト（通常）*/
  outputResultYamatoNomal: number;
  /** 出力結果：ヤマト（タイム）*/
  outputResultYamatoTime: number;
  /** リスト*/
  list: List[];
}
interface List {
  /** 会場名*/
  placeName: string;
  /** 開催回数*/
  auctionCount: number;
  /** 出品番号*/
  exhibitNumber: string;
}

/** API-DOC-0003-0001: 伝票印刷件数検索API */
export const ScrDoc0003SlipPrintedCntSearch = async (
  request: ScrDoc0003SlipPrintedRequest
): Promise<ScrDoc0003SlipPrintedCntSearchResponse> => {
  const response = await docApiClient.post(
    '/api/doc/scr-doc-0003/slip-printed-cnt-search',
    request
  );
  return response.data;
};

/** API-DOC-0003-0002: 伝票印刷API */
export const ScrDoc0003SlipPrinted = async (
  request: ScrDoc0003SlipPrintedRequest
): Promise<null> => {
  const response = await docApiClient.post(
    '/api/doc/scr-doc-0003/slip-printed',
    request
  );
  return null;
};
