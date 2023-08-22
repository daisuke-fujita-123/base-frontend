import { traApiClient } from 'providers/ApiClient';

/** 出金一覧検索APIリクエスト */
export interface ScrTra0023SearchWithdrawsRequest {
  // 会計処理日(From)
  accountingDateFrom: string;
  // 会計処理日(To)
  accountingDateTo: string;
  // 請求種別
  claimClassification: string;
  // 出金種別
  paymentKind: string;
  //承認ステータス
  approvalStatus: string;
  //債務番号
  debtNumber: string;
  //契約ID
  contractId: string;
  //法人ID
  corporationId: string;
  //請求先ID
  billingId: string;
  /** ソートキー */
  sortKey: string;
  /** ソート方向 */
  sortDirection: string;
  /** リミット */
  limit: number;
  /** オフセット */
  offset: number;
}

/** 出金一覧検索APIレスポンス */
export interface ScrTra0023SearchWithdrawsResponse {
  /** リミット */
  limit: number;
  /** オフセット */
  offset: number;
  /** 件数 */
  count: number;
  /** リスト */
  searchResult: SearchResult[];
}

/** リスト */
export interface SearchResult {
  // 債務番号
  debtNumber: string;
  // 請求種別
  claimClassification: string;
  // 会計処理日
  accountingDate: string;
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 請求先ID
  billingId: string;
  // 債務金額
  debtAmount: string;
  // 銀行振込
  bankTransfer: string;
  // 相殺金額
  offsetAmount: string;
  // 出金保留
  withdrawHold: string;
}

/** 出金一覧検索API api/scr-tra-0023/search-Withdraws */
export const ScrTra0023SearchWithdraws = async (
  request: ScrTra0023SearchWithdrawsRequest
): Promise<ScrTra0023SearchWithdrawsResponse> => {
  const response = await traApiClient.post(
    'api/scr-tra-0023/search-Withdraws',
    request
  );
  return response.data;
};

