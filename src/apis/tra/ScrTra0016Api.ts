import { traApiClient } from 'providers/ApiClient';

/** API-TRA-0016-0001 リクエスト */
export interface ScrTra0016SearchReceiptsRequest {
  /** 入金口座種別 */
  receiptAccountKind: string;
  /** 入金グループID/入金ID */
  receiptGroupId: string;
  /** 契約ID */
  contractId: string;
  /** 法人ID */
  corporationId: string;
  /** 請求先ID */
  billingId: string;
  /** 銀行名 */
  bankName: string;
  /** 支店名 */
  branchName: string;
  /** 口座名義 */
  accountName: string;
  /** 返金対象法人ID */
  cashbackTargetedCorporationId: string;
  /** 返金対象請求先ID */
  cashbackTargetedBillingId: string;
  /** 入力日（From） */
  inputDateFrom: Date;
  /** 入力日（To） */
  inputDateTo: Date;
  /** 会計処理日（From） */
  accountingDateFrom: Date;
  /** 会計処理日（To） */
  accountingDateTo: Date;
  /** 承認ステータス */
  approvalStatus: string[];
  /** 変更履歴番号 */
  changeHistoryNumber: number;
}

/** API-TRA-0016-0001 レスポンス */
export interface ScrTra0016SearchReceiptsResponse {
  /** 制限件数 */
  limitCount: number;
  /** 取得件数 */
  acquisitionCount: number;
  /** 返却件数 */
  responseCount: number;
  /** リスト */
  searchResult: SearchResult[];
  /** 入金額合計 */
  receiptAmountTotal: number;
  /** 充当金額合計 */
  appropriationAmountTotal: number;
  /** 未処理金額合計 */
  untreatedAmountTotal: number;
  /** 預かり金額合計 */
  depositAmountTotal: number;
  /** 対象外金額合計 */
  notTargetedAmountTotal: number;
  /** 自税返金額合計 */
  carTaxCashBackAmountTotal: number;
  /** 検索結果件数 */
  searchResultCount: string;
}

/** API-TRA-0016-0001 のリスト */
export interface SearchResult {
  /** 入金口座種別 */
  receiptAccountKind: string;
  /** 入金グループID */
  receiptGroupId: string;
  /** 入金番号 */
  receiptId: string;
  /** 法人ID */
  corporationId: string;
  /** 請求先ID */
  billingId: string;
  /** 入金額 */
  receiptAmount: number;
  /** 充当金額 */
  appropriationAmount: number;
  /** 未処理金額 */
  untreatedAmount: number;
  /** 預かり金額 */
  depositAmount: number;
  /** 対象外金額 */
  notTargetedAmount: number;
  /** 自税返金額 */
  carTaxCashBackAmount: number;
  /** 銀行名 */
  bankName: string;
  /** 支店名 */
  branchName: string;
  /** 入金元口座名義 */
  receiptSourceAccountName: string;
  /** 返金対象法人ID */
  cashBackTargetedCorporationId: string;
  /** 返金対象請求先ID */
  cashBackTargetedBillingId: string;
  /** 入金担当従業員ID */
  receiptStaffEmployeeId: string;
  /** 入力者名 */
  receiptInputName: string;
  /** 入金入力日 */
  receiptInputDate: Date;
  /** 会計処理日 */
  accountingDate: Date;
  /** 承認ステータス */
  approvalStatus: string[];
  /** 変更タイムスタンプ */
  changeTimestamp: string;
}

/** API-TRA-0016-0001 / 入金一覧取得API */
export const ScrTra0016SearchReceipts = async (
  request: ScrTra0016SearchReceiptsRequest
): Promise<ScrTra0016SearchReceiptsResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0016/get-receipt-application',
    request
  );
  return response.data;
};

/** API-TRA-0016-0002 /  レスポンス */
export interface ScrTra0016ReceiptSlipAdditionResponse {
  /** 入金グループID/入金ID */
  receiptGroupId: string;
  /** 入力日 */
  inputDate: string;
  /** 変更タイムスタンプ */
  changeTimestamp: string;
}

/** API-TRA-0016-0002 / 入金伝票追加API */
export const ScrTra0016ReceiptSlipAddition = async (
  // リクエストパラメータなし
  request: undefined
): Promise<ScrTra0016ReceiptSlipAdditionResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0016/create-receipt-application',
    request
  );
  return response.data;
};

/** API-TRA-0016-0003 リクエスト */
export interface ScrTra0016CheckReceiptDetailRequest {
  /** 請求先ID */
  billingId: string;
  /** 処理区分 */
  procKind: string;
}

/** API-TRA-0016-0003 /  レスポンス */
export interface ScrTra0016CheckReceiptDetailResponse {
  /** エラー内容リスト */
  errorList: errorList[];
  /** ワーニング内容リスト */
  warningList: warningList[];
}

/** API-TRA-0016-0003 のリスト(エラー内容リスト) */
/** API-TRA-0016-0005 のリスト(エラー内容リスト) */
/** API-TRA-0016-0007 のリスト(エラー内容リスト) */
export interface errorList {
  /** エラーコード */
  errorCode: string;
  /** エラーメッセージ */
  errorMessage: string;
}

/** API-TRA-0016-0003 のリスト(ワーニング内容リスト) */
/** API-TRA-0016-0005 のリスト(ワーニング内容リスト) */
/** API-TRA-0016-0007 のリスト(ワーニング内容リスト) */
export interface warningList {
  /** ワーニングコード */
  warningCode: string;
  /** ワーニングメッセージ */
  warningMessage: string;
}

/** API-TRA-0016-0003 / 入金情報詳細編集チェックAPI */
export const ScrTra0016CheckReceiptDetail = async (
  request: ScrTra0016CheckReceiptDetailRequest
): Promise<ScrTra0016CheckReceiptDetailResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0016/check-receipt-detail--application',
    request
  );
  return response.data;
};

/** API-TRA-0016-0004 / 自動消込実行API */
/** API-TRA-0016-0004 リクエスト */
export interface ScrTra0016AutoClearingExecuteRequest {
  AutoClearingExecuteRequestResult: AutoClearingExecuteRequestResult[];
}

/** API-TRA-0016-0004 のリクエストリスト */
export interface AutoClearingExecuteRequestResult {
  /** 入金グループID */
  receiptGroupId: string;
  /** 入金番号 */
  receiptId: string;
  /** 法人ID */
  corporationId: string;
  /** 請求先ID */
  billingId: string;
  /** 入金額 */
  receiptAmount: number;
}

/** API-TRA-0016-0004 レスポンス */
export interface ScrTra0016AutoClearingExecuteResponse {
  /** リスト */
  AutoClearingExecuteResult: AutoClearingExecuteResponseResult[];
}

/** API-TRA-0016-0004 のレスポンスリスト */
export interface AutoClearingExecuteResponseResult {
  /** 入金グループID */
  receiptGroupId: string;
  /** 入金番号 */
  receiptId: string;
}

/** API-TRA-0016-0004 / 自動消込実行API */
export const ScrTra0016AutoClearingExecute = async (
  request: ScrTra0016AutoClearingExecuteRequest
): Promise<ScrTra0016AutoClearingExecuteResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0016/execute-auto-clearing-application',
    request
  );
  return response.data;
};

/** API-TRA-0016-0005 / 返金対象チェックAPI */
/** API-TRA-0016-0005 リクエスト */
export interface ScrTra0016CheckCashbackTargetRequest {
  /** 法人ID */
  corporationId: string;
  /** 請求先ID */
  billingId: string;
}

/** API-TRA-0016-0005 レスポンス */
export interface ScrTra0016CheckCashbackTargetResponse {
  /** エラー内容リスト */
  errorList: errorList[];
  /** ワーニング内容リスト */
  warningList: warningList[];
}

/** API-TRA-0016-0005 / 返金対象チェックAPI */
export const ScrTra0016CheckCashbackTarget = async (
  request: ScrTra0016CheckCashbackTargetRequest
): Promise<ScrTra0016CheckCashbackTargetResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0016/check-cashback-target-application',
    request
  );
  return response.data;
};

/** API-TRA-0016-0007 / 入金伝票入力チェックAPI */
/** API-TRA-0016-0007 リクエスト */
export interface ScrTra0016CheckReceiptInputRequest {
  /** 会計処理日 */
  accountingDate: string;
}

/** API-TRA-0016-0007 レスポンス */
export interface ScrTra0016CheckReceiptInputResponse {
  /** エラー内容リスト */
  errorList: errorList[];
  /** ワーニング内容リスト */
  warningList: warningList[];
}

/** API-TRA-0016-0007 / 入金伝票入力チェックAPI */
export const ScrTra0016CheckReceiptInput = async (
  request: ScrTra0016CheckReceiptInputRequest
): Promise<ScrTra0016CheckReceiptInputResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0016/check-receipt-input-application',
    request
  );
  return response.data;
};

/** API-TRA-0016-0010 / 入金明細取込API */
/** API-TRA-0016-0010 リクエスト */
export interface ScrTra0016InputReceiptDetailRequest {
  /** CSVファイル */
  csvfile: string;
  /** 入金グループID */
  receiptGroupId: string;
  /** 入金番号 */
  receiptId: string;
  /** 請求先ID */
  billingId: string;
  /** 入金額 */
  receiptAmount: number;
}

/** API-TRA-0016-0010 / 入金明細取込API */
export const ScrTra0016InputReceiptDetail = async (
  request: ScrTra0016InputReceiptDetailRequest
): Promise<undefined> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0016/input-receipt-detail-application',
    request
  );
  return undefined;
};

/** API-TRA-0016-0009 / 入金伝票登録API */
/** API-TRA-0016-0009 リクエスト */
export interface ScrTra0016RegistrationReceiptRequest {
  /** 入金グループID/入金ID */
  receiptGroupId: string[];
}

/** API-TRA-0016-0009 / 入金伝票登録API */
export const ScrTra0016RegistrationReceipt = async (
  request: ScrTra0016RegistrationReceiptRequest
): Promise<undefined> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0016/registration-receipt-application',
    request
  );
  return undefined;
};

/** API-TRA-0016-0006 / 入金詳細初期化API */
/** API-TRA-0016-0006 リクエスト */
export interface ScrTra0016ReceiptDetailResetRequest {
  /** 入金グループID */
  receiptGroupId: string;
  /** 入金番号 */
  receiptId: string;
}

/** API-TRA-0016-0006 / 入金詳細初期化API */
export const ScrTra0016ReceiptDetailReset = async (
  request: ScrTra0016ReceiptDetailResetRequest
): Promise<undefined> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0016/receipt-detail-reset-application',
    request
  );
  return undefined;
};

