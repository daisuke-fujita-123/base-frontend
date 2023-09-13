//import { errorList, warningList } from 'pages/com/popups/ScrCom0038Popup';

import { traApiClient } from 'providers/ApiClient';

/** API-TRA-0018-0001 リクエスト */
/** 入金詳細データ取得API / get-receipt-detail */
export interface ScrTra0018GetReceiptDetailRequest {
  /** 入金グループID */
  receiptGroupId: string;
  /** 入金番号 */
  receiptId: string;
  /** 法人ID */
  corporationId?: string | null;
  /** 請求先IDリスト */
  billingIdList?: string[] | null;
}

/** API-TRA-0018-0001 レスポンス */
/** 入金詳細データ取得API / get-receipt-detail */
export interface ScrTra0018GetReceiptDetailResponse {
  /** 会計処理日 */
  accountingDate: string;
  /** 入金口座種別 */
  receiptAccountKind: string;
  /** 法人ID */
  corporationId: string;
  /** 請求先IDリスト */
  billingId: string[];
  /** 返金対象法人ID */
  cashbackTargetedCorporationId: string;
  /** 返金対象請求先ID */
  cashbackTargetedBillingId: string;
  /** 入金額 */
  receiptAmount: number;
  /** 充当金額 */
  appropriationAmount: number;
  /** 預かり金額 */
  depositAmount: number;
  /** 対象外金額 */
  notTargetedAmount: number;
  /** 預かり金保証金登録データリスト */
  depositList: depositList[];
  /** 債権伝票データリスト */
  receivablesList: receivablesList[];
  /** 四輪出金保留 */
  tvaaPaymentPending: number;
  /** おまとめ出金保留 */
  omatomePaymentPending: number;
  /** 二輪出金保留 */
  bikePaymentPending: number;
  /** 一般請求出金保留 */
  generalclaimPaymentPending: number;
}

/** API-TRA-0018-0001 のリスト */
/** 入金詳細データ取得API / get-receipt-detail */
/** 預かり金保証金登録データリスト / depositList */
export interface depositList {
  /** 預かり金番号 */
  depositId: string;
  /** 請求先ID */
  billingId: string;
  /** 預かり金区分 */
  depositAmountKind: string;
  /** 預かり金額 */
  depositAmount: number;
  /** 処理金額 */
  depositProcess: number;
  /** 残額 */
  balance: number;
  /** 仮処理内容 */
  provisionalOPocessDetail: string;
  /** メモ */
  memo: string;
  /** 入力者ID */
  inputId: string;
  /** 入力者名 */
  inputName: string;
}

/** API-TRA-0018-0001 のリスト */
/** 入金詳細データ取得API / get-receipt-detail */
/** 債権伝票データリスト / receivablesList */
export interface receivablesList {
  /** 取引区分 */
  dealKind: string;
  /** 請求区分 */
  claimKind: string;
  /** 会場名 */
  placeName: string;
  /** 開催日 */
  sessionDate: string;
  /** 開催回数 */
  auctionCount: string;
  /** 出品番号 */
  exhibitNumber: string;
  /** 車名 */
  carName: string;
  /** 車台番号 */
  carNumber: string;
  /** 入金期日 */
  receiptDueDate: string;
  /** 請求金額 */
  claimAmount: number;
  /** 充当済金額 */
  appropriationedAmount: number;
  /** 充当金額 */
  appropriationAmount: number;
  /** 請求残額 */
  claimBalance: number;
  /** 書類発送状況 */
  documentStatusKind: string;
  /** 書類到着精算予定金額 */
  documentArrivesCalculateExpectAmount: number;
  /** 請求先ID */
  billingId: string;
  /** 請求日 */
  claimDate: string;
  /** 会計処理日 */
  accountingDate: string;
  /** 請求種別 */
  claimClassification: string;
}

/** API-TRA-0018-0001 / 入金詳細データ取得API */
export const ScrTra0018GetReceiptDetail = async (
  request: ScrTra0018GetReceiptDetailRequest
): Promise<ScrTra0018GetReceiptDetailResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0018/get-receipt-detail',
    request
  );
  return response.data;
};

/** API-TRA-0018-0002 リクエスト */
/** 入金伝票詳細チェックAPI / check-receipt-detail */
export interface ScrTra0018CheckReceiptDetailRequest {
  /** 入金グループID */
  receiptGroupId: string;
  /** 入金番号 */
  receiptId: string;
  /** 債権番号リスト */
  receivablesIdList?: string[] | null;
}

/** API-TRA-0018-0002 レスポンス */
/** 入金伝票詳細チェックAPI / check-receipt-detail */
export interface ScrTra0018CheckReceiptDetailResponse {
  /** エラー内容リスト */
  errorList: errorList[];
  /** ワーニング内容リスト */
  warningList: warningList[];
}

/** API-TRA-0018-0002 レスポンス */
/** 入金伝票詳細チェックAPI / check-receipt-detail */
/** エラー内容リスト errorList */
export interface errorList {
  /** エラーコード */
  errorCode: string;
  /** エラーメッセージ*/
  errorMessage: string;
}

/** API-TRA-0018-0002 レスポンス */
/** 入金伝票詳細チェックAPI / check-receipt-detail */
/** エラー内容リスト warnList */
export interface warningList {
  /** エラーコード */
  warningCode: string;
  /** エラーメッセージ*/
  warningMessage: string;
}

/** API-TRA-0018-0002 / 入金伝票詳細チェックAPI */
export const ScrTra0018CheckReceiptDetail = async (
  request: ScrTra0018CheckReceiptDetailRequest
): Promise<ScrTra0018CheckReceiptDetailResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0018/check-receipt-detail',
    request
  );
  return response.data;
};

/** API-TRA-0018-0003 リクエスト */
/** 入金伝票詳細登録API / registration-receipt-detail */
export interface ScrTra0018RegistrationReceiptDetailRequest {
  /** 入金グループID */
  receiptGroupId: string;
  /** 入金番号 */
  receiptId: string;
  /** 変更タイムスタンプ */
  changeTimeStamp: string;
  /** リスト(預かり金一覧) */
  depositList: depositLists[];
  /** リスト(四輪債権伝票) */
  tvaaList: receivablesList[];
  /** リスト(おまとめ債権伝票) */
  omatomeList: receivablesList[];
  /** リスト(二輪債権伝票) */
  bikeList: receivablesList[];
  /** リスト(一般請求債権伝票) */
  generalClaimList: receivablesList[];
}

/** API-TRA-0018-0003 リクエスト */
/** 入金伝票詳細登録API / registration-receipt-detail */
/** リスト(預かり金一覧) 名称重複のため末尾にs付与*/
export interface depositLists {
  /** 預かり金額 */
  depositAmount: number;
  /** 預かり金区分 */
  depositAmountKind: string;
  /** 入金口座種別 */
  receiptAccountKind: string;
  /** 請求先ID */
  billingId: string;
  /** 預かり金仮処理区分 */
  provisionalOPocessDetail: string;
  /** 預かり金メモ */
  depositAmountMemo: string;
}

/** API-TRA-0018-0003 リクエスト */
/** 入金伝票詳細登録API / registration-receipt-detail */
/** リスト(四輪債権伝票) */
/** リスト(おまとめ債権伝票) */
/** リスト(二輪債権伝票) */
/** リスト(一般請求債権伝票) */
export interface receivablesList {
  /** 債権番号 */
  receivablesNo: string;
  /** 充当金額 */
  appropriationAmount: number;
}

/** API-TRA-0018-0003 / 入金伝票詳細登録API */
export const ScrTra0018RegistrationReceiptDetail = async (
  request: ScrTra0018RegistrationReceiptDetailRequest
): Promise<undefined> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0018/registration-receipt-detail',
    request
  );
  return response.data;
};

