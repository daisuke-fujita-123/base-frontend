import { traApiClient } from 'providers/ApiClient';

/** 出金一覧検索APIリクエスト */
export interface ScrTra0025GetPaymentDetailsRequest {
  // 債務番号
  debtNumber: string;
}

/** 出金一覧検索APIレスポンス */
export interface ScrTra0025GetPaymentDetailsResponse {
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 請求先ID
  billingId: string;
  // 即支払可否フラグ
  immediatePaymentFlag: string;
  // 取引区分
  dealKind: string;
  // 会場名
  placeName: string;
  // 開催日
  sessionDate: string;
  // オークション回数
  auctionCount: string;
  // 出品番号
  exhibitNumber: string;
  // 車名
  carName: string;
  // 請求種別
  claimClassification: string;
  // 債務金額
  debtAmount: number;
  // 承認ステータス
  approvalStatus: string;
  // 出金番号
  paymentNumber: string;
  // 債務一覧リスト
  paymentDetailsList: paymentDetailsList[];
  // 出金元口座ID
  paymentSourceAccountId: string;
  // 出金元口座銀行名
  paymentSourcebankName: string;
  // 出金元口座支店名
  paymentSourcebranchName: string;
  // 承認依頼中フラグ
  approvalRequestFlag: string;
  // 自社IDフラグ
  ownCompanyFlag: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
}

/** リスト */
export interface paymentDetailsList {
  // 出金明細番号
  paymentDetailsNumber: string;
  // 会計処理日
  accountingDate: string;
  // 出金種別
  paymentKind: string;
  // 出金元口座
  paymentSourceAccount: string;
  // 出金元口座ID
  paymentSourceAccountId: string;
  // 出金額
  paymentAmount: string;
  // 出金メモ
  paymentMemo: string;
  // 出金FBデータ出力済フラグ
  paymentFbDataOutputFlag: string;
}

/** 出金伝票検索API api/tra/scr-tra-0025/get-payment-details */
export const ScrTra0025GetPaymentDetails = async (
  request: ScrTra0025GetPaymentDetailsRequest
): Promise<ScrTra0025GetPaymentDetailsResponse> => {
  const response = await traApiClient.post(
    'api/tra/scr-tra-0025/get-payment-details',
    request
  );
  return response.data;
};

