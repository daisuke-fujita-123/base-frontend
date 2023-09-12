import { traApiClient } from 'providers/ApiClient';

/** 出金一覧検索APIリクエスト */
export interface ScrTra0023GetPaymentRequest {
  // 会計処理日(From)
  accountingDateFrom: string;
  // 会計処理日(To)
  accountingDateTo: string;
  // 請求種別
  claimClassification: string;
  // 出金種別
  paymentKind: string;
  // 承認ステータス
  approvalStatus: string[];
  // 債務番号
  debtNumber: string;
  // 契約ID
  contractId: string;
  // 法人ID
  corporationId: string;
  // 請求先ID
  billingId: string;
  // 変更履歴番号
  changeHistoryNumber: string | null;
}

/** 出金一覧検索APIレスポンス */
export interface ScrTra0023GetPaymentResponse {
  // 取得件数
  acquisitionCount: number;
  // 制限件数
  limitCount: number;
  // 返却件数
  responseCount: number;
  // 債務金額
  debtAmount: number;
  // 銀行振込
  bankTransfer: number;
  // 相殺金額
  offsettingAmount: number;
  // 出金保留
  paymentPending: number;
  // 手振出金
  drawerPayment: number;
  // 現金手渡
  cachToPass: number;
  // 出金止め相殺
  paymentStopOffsetting: number;
  // 自社取引
  ownCompanyDeal: number;
  // 償却
  amortization: number;
  // リスト
  searchResult: SearchResult[];
  //ワーニング内容リスト
  warnList: WarnList[];
}
/** 出力一覧リスト */
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
  debtAmount: number;
  // 銀行振込
  bankTransfer: number;
  // 相殺金額
  offsetAmount: number;
  // 出金保留
  paymentPending: number;
  // 手振出金
  drawerPayment: number;
  // 現金手渡
  cachToPass: number;
  // 出金止め相殺
  paymentStopOffsetting: number;
  // 自社取引
  ownCompanyDeal: number;
  // 償却
  amortization: number;
  // 取引区分
  dealKind: string;
  // 会場名
  placeName: string;
  // 開催日
  sessionDate: string;
  // 開催回数
  sessionCount: string;
  // 出品番号
  exhibitNumber: string;
  // 車名
  carName: string;
  // 承認ステータス
  approvalStatus: string;
  // 詳細承認ステータス
  detailsApprovalStatus: string;
  // 出金番号
  paymentNumber: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
}
/** ワーニング内容リスト */
export interface WarnList {
  // ワーニングコード
  warnCode: string;
  // ワーニングメッセージ
  warnMessage: string;
}

/** 出金一覧検索API api/scr-tra-0023/get-payment */
export const ScrTra0023GetPayment = async (
  request: ScrTra0023GetPaymentRequest
): Promise<ScrTra0023GetPaymentResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0023/get-payment',
    request
  );
  return response.data;
};

/** 出金番号リスト */
export interface ScrTra0023CheckPaymentRequest {
  // 出金番号
  paymentNumber: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
}

/** 出金申請入力チェックAPIレスポンス */
export interface ScrTra0023CheckPaymentResponse {
  // エラー内容リスト
  errorList: ErrorList[];
  // ワーニング内容リスト
  warnList: WarnList[];
}

/** 出金申請入力チェックAPIエラーリスト */
export interface ErrorList {
  // エラーコード
  errorCode: string;
  // エラーメッセージ
  errorMessage: string;
}

/** 出金申請入力チェックAPIワーニング内容リスト */
export interface WarnList {
  // ワーニングコード
  warnCode: string;
  // ワーニングメッセージ
  warnMessage: string;
}

/** 出金申請入力チェックAPI /api/tra/scr-tra-0023/check-payment */
export const ScrTra0023CheckPayment = async (
  request: ScrTra0023CheckPaymentRequest[]
): Promise<ScrTra0023CheckPaymentResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0023/check-payment',
    request
  );
  return response.data;
};

/** 出金申請登録APIリクエスト */
export interface ScrTra0023registrationPaymentRequest {
  // 出金番号リスト配列
  list: List[];
  // 従業員ID1
  employeeId1: string;
  // 従業員ID2
  employeeId2: string;
  // 従業員ID3
  employeeId3: string;
  // 従業員ID4
  employeeId4: string;
  // 申請コメント
  applicationComment: string;
  // マスタID
  masterId: string | null;
  // 変更予定日
  changeExpectDate: string;
  // 画面ID
  screenId: string;
  // タブID
  tabId: number | null;
  // 変更履歴番号
  changeHistoryNumber: string | null;
  // 登録変更メモ
  registrationChangeMemo: string;
}
/** 出金番号リスト */
export interface List {
  // 出金番号
  paymentNumber: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
}

/** 出金申請入力チェックAPI /api/tra/scr-tra-0023/check-payment */
export const ScrTra0023registrationpayment = async (
  request: ScrTra0023registrationPaymentRequest
) => {
  await traApiClient.post(
    '/api/tra/scr-tra-0023/registration-payment',
    request
  );
};

/** 債務番号リスト */
export interface ScrTra0023OutputJournalReportRequest {
  // 債務番号
  debtNumber: string[];
}

/** 帳票出力用API /api/tra/scr-tra-0023/check-payment */
export const ScrTra0023OutputJournalReport = async (
  request: ScrTra0023OutputJournalReportRequest
) => {
  await traApiClient.post(
    '/api/tra/scr-tra-0023/output-journal-report',
    request
  );
};

