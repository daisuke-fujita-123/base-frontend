import { comApiClient, memApiClient } from 'providers/ApiClient';

/** 請求先一覧取得機能APIリクエスト */
export interface ScrMem0008GetBillingInfoRequest {
  // 請求先ID
  billingId: string;
  // 法人ID
  corporationId: string;
}

/** 請求先一覧取得機能APIレスポンス */
export interface ScrMem0008GetBillingInfoResponse {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 請求先ID
  billingId: string;
  // 請求先住所連絡先同期事業拠点ID
  billingAddressContactSynchronizationBusinessBaseId: string;
  // 請求先郵便番号
  billingZipCode: string;
  // 請求先都道府県コード
  billingPrefectureCode: string;
  // 請求先市区町村
  billingMunicipalities: string;
  // 請求先番地号建物名
  billingAddressBuildingName: string;
  // 請求先電話番号
  billingPhoneNumber: string;
  // 請求先FAX番号
  billingFaxNumber: string;
  // 請求先メールアドレス
  billingMailAddress: string;
  // 請求先名称
  billingName: string;
  // 契約情報
  contractInfo: ContractInfo[];
  // 四輪即時出金限度金額
  tvaaImmediatePaymentLimitAmount: number;
  // 四輪即時出金対象譲渡書類未到達限度金額
  tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount: number;
  // 四輪即支払可否フラグ
  tvaaImmediatePaymentFlag: boolean;
  // 四輪書類先出しフラグ
  tvaaDocumentAdvanceFlag: boolean;
  // 四輪延滞金自動発生可否フラグ
  tvaaArrearsPriceAutomaticOccurrenceFlag: boolean;
  // 四輪相殺要否フラグ
  tvaaOffsettingFlag: boolean;
  // 四輪オークション参加制限可否フラグ
  tvaaAuctionEntryLimitFlag: boolean;
  // 四輪督促状メール送信フラグ
  tvaaDemandMailSendFlag: boolean;
  // 四輪督促状FAX送信フラグ
  tvaaDemandFaxSendFlag: boolean;
  // 四輪計算書メール送信フラグ
  tvaaStatementMailSendFlag: boolean;
  // 四輪計算書FAX送信フラグ
  tvaaStatementFaxSendFlag: boolean;
  // 二輪即時出金限度金額
  bikeImmediatePaymentLimitAmount: number;
  // 二輪即時出金対象譲渡書類未到達限度金額
  bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount: number;
  // 二輪即支払可否フラグ
  bikeImmediatePaymentFlag: boolean;
  // 二輪書類先出しフラグ
  bikeDocumentAdvanceFlag: boolean;
  // 二輪延滞金自動発生可否フラグ
  bikeArrearsPriceAutomaticOccurrenceFlag: boolean;
  // 二輪相殺要否フラグ
  bikeOffsettingFlag: boolean;
  // 二輪オークション参加制限可否フラグ
  bikeAuctionEntryLimitFlag: boolean;
  // 二輪督促状メール送信フラグ
  bikeDemandMailSendFlag: boolean;
  // 二輪督促状FAX送信フラグ
  bikeDemandFaxSendFlag: boolean;
  // 二輪計算書メール送信フラグ
  bikeStatementMailSendFlag: boolean;
  // 二輪計算書FAX送信フラグ
  bikeStatementFaxSendFlag: boolean;
  // 会員メモ
  memberMemo: string;
  // 会員用引落口座(会費用)
  accountType1: AccountType;
  // 支払口座
  accountType2: AccountType;
  // 会員向け振込口座（計算書記載の入金ﾊﾞｰﾁｬﾙ口座）
  accountType3: AccountType3[];
  // 会場向け振込口座(取引用ﾊﾞｰﾁｬﾙ)
  accountType4: AccountType;
}

// 契約情報
export interface ContractInfo {
  // 契約ID
  contractId: string;
  // 請求方法区分
  claimMethodKind: string;
}

// 会員用引落口座(会費用)/支払口座
export interface AccountType {
  // 銀行コード
  bankCode: string;
  // 銀行名
  bankName: string;
  // 支店コード
  branchCode: string;
  // 支店名
  branchName: string;
  // 口座番号
  accountNumber: string;
  // 口座種別区分
  accountKind: string;
  // 口座名義カナ
  accountNameKana: string;
}

// 会員向け振込口座（計算書記載の入金ﾊﾞｰﾁｬﾙ口座）
export interface AccountType3 {
  // 請求種別
  claimClassification: string;
  // 銀行コード
  bankCode: string;
  // 銀行名
  bankName: string;
  // 支店コード
  branchCode: string;
  // 支店名
  branchName: string;
  // バーチャル口座番号
  accountNumber: string;
  // 口座種別区分
  accountKind: string;
  // 口座名義カナ
  accountNameKana: string;
}

/** 請求先一覧取得機能API */
export const ScrMem0008GetBillingInfo = async (
  request: ScrMem0008GetBillingInfoRequest
): Promise<ScrMem0008GetBillingInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0008/get-billing-info',
    request
  );
  return response.data;
};

/** 変更履歴情報取得APIリクエスト */
export interface ScrMem9999GetHistoryInfoRequest {
  // 変更履歴番号
  changeHistoryNumber: string;
}

/** 変更履歴情報取得APIレスポンス（基本情報） */
export interface ScrMem9999GetHistoryBillingInfoInfoResponse {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 請求先ID
  billingId: string;
  // 請求先住所連絡先同期事業拠点ID
  billingAddressContactSynchronizationBusinessBaseId: string;
  // 請求先郵便番号
  billingZipCode: string;
  // 請求先都道府県コード
  billingPrefectureCode: string;
  // 請求先市区町村
  billingMunicipalities: string;
  // 請求先番地号建物名
  billingAddressBuildingName: string;
  // 請求先電話番号
  billingPhoneNumber: string;
  // 請求先FAX番号
  billingFaxNumber: string;
  // 請求先メールアドレス
  billingMailAddress: string;
  // 請求先名称
  billingName: string;
  // 契約情報
  contractInfo: ContractInfo[];
  // 四輪即時出金限度金額
  tvaaImmediatePaymentLimitAmount: number;
  // 四輪即時出金対象譲渡書類未到達限度金額
  tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount: number;
  // 四輪即支払可否フラグ
  tvaaImmediatePaymentFlag: boolean;
  // 四輪書類先出しフラグ
  tvaaDocumentAdvanceFlag: boolean;
  // 四輪延滞金自動発生可否フラグ
  tvaaArrearsPriceAutomaticOccurrenceFlag: boolean;
  // 四輪相殺要否フラグ
  tvaaOffsettingFlag: boolean;
  // 四輪オークション参加制限可否フラグ
  tvaaAuctionEntryLimitFlag: boolean;
  // 四輪督促状メール送信フラグ
  tvaaDemandMailSendFlag: boolean;
  // 四輪督促状FAX送信フラグ
  tvaaDemandFaxSendFlag: boolean;
  // 四輪計算書メール送信フラグ
  tvaaStatementMailSendFlag: boolean;
  // 四輪計算書FAX送信フラグ
  tvaaStatementFaxSendFlag: boolean;
  // 二輪即時出金限度金額
  bikeImmediatePaymentLimitAmount: number;
  // 二輪即時出金対象譲渡書類未到達限度金額
  bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount: number;
  // 二輪即支払可否フラグ
  bikeImmediatePaymentFlag: boolean;
  // 二輪書類先出しフラグ
  bikeDocumentAdvanceFlag: boolean;
  // 二輪延滞金自動発生可否フラグ
  bikeArrearsPriceAutomaticOccurrenceFlag: boolean;
  // 二輪相殺要否フラグ
  bikeOffsettingFlag: boolean;
  // 二輪オークション参加制限可否フラグ
  bikeAuctionEntryLimitFlag: boolean;
  // 二輪督促状メール送信フラグ
  bikeDemandMailSendFlag: boolean;
  // 二輪督促状FAX送信フラグ
  bikeDemandFaxSendFlag: boolean;
  // 二輪計算書メール送信フラグ
  bikeStatementMailSendFlag: boolean;
  // 二輪計算書FAX送信フラグ
  bikeStatementFaxSendFlag: boolean;
  // 会員メモ
  memberMemo: string;
}

/** 変更履歴情報取得API（基本情報） */
export const ScrMem9999GetHistoryInfo = async (
  request: ScrMem9999GetHistoryInfoRequest
): Promise<ScrMem9999GetHistoryBillingInfoInfoResponse> => {
  const response = await memApiClient.post('/get-history-info', request);
  return response.data;
};

/** 変更履歴情報取得APIレスポンス（口座情報） */
export interface ScrMem9999GetHistorybankInfoInfoResponse {
  // 会員用引落口座(会費用)
  accountType1: AccountType;
  // 支払口座
  accountType2: AccountType;
  // 会員向け振込口座（計算書記載の入金ﾊﾞｰﾁｬﾙ口座）
  accountType3: AccountType3[];
  // 会場向け振込口座(取引用ﾊﾞｰﾁｬﾙ)
  accountType4: AccountType;
}

/** 変更履歴情報取得API（口座情報） */
export const ScrMem9999GetBankHistoryInfo = async (
  request: ScrMem9999GetHistoryInfoRequest
): Promise<ScrMem9999GetHistorybankInfoInfoResponse> => {
  const response = await memApiClient.post('/get-history-info', request);
  return response.data;
};

/** 変更予定日取得APIリクエスト */
export interface ScrCom9999GetChangeDateRequest {
  // 画面ID
  screenId: string;
  // タブID
  tabId: number;
  // マスタID
  masterId: string;
  // 業務日付
  businessDate: Date;
}

/** 変更予定日取得APIレスポンス */
export interface ScrCom9999GetChangeDateResponse {
  // 変更予定日情報
  changeExpectDateInfo: ChangeExpectDateInfo[];
}

// 変更予定日情報
export interface ChangeExpectDateInfo {
  // 変更履歴番号
  changeHistoryNumber: number;
  // 変更予定日
  changeExpectDate: Date;
}

/** 変更予定日取得API */
export const ScrCom9999GetChangeDate = async (
  request: ScrCom9999GetChangeDateRequest
): Promise<ScrCom9999GetChangeDateResponse> => {
  const response = await comApiClient.post('/com/get-change-date', request);
  return response.data;
};

/** コード値取得API（コード管理マスタ以外）リクエスト */
export interface ScrCom9999GetCodeValueRequest {
  // エンティティリスト
  entityList: EntityList[];
}

// エンティティリスト
export interface EntityList {
  // エンティティ名
  entityName: string;
}

/** コード値取得API（コード管理マスタ以外）レスポンス */
export interface ScrCom9999GetCodeValueResponse {
  // 結果リスト
  resultList: ResultList[];
}

// 結果リスト
export interface ResultList {
  // エンティティ名
  entityName: string;
  // コード値リスト
  codeValueList: CodeValueList[];
}

// コード値リスト
export interface CodeValueList {
  // コード値
  codeValue: string;
  // コード値名称
  codeValueName: string;
  // コード値名称カナ
  codeValueNameKana: string;
}

/** コード値取得API（コード管理マスタ以外） */
export const ScrCom9999GetCodeValue = async (
  request: ScrCom9999GetCodeValueRequest
): Promise<ScrCom9999GetCodeValueResponse> => {
  const response = await comApiClient.post('/com/scr/get-code-value', request);
  return response.data;
};

/** 事業拠点一覧取得機能APIリクエスト */
export interface ScrMem9999GetBusinessInfoRequest {
  // 法人ID
  corporationId: string;
  // 事業拠点ID
  businessBaseId: string;
}

/** 事業拠点一覧取得機能APIレスポンス */
export interface ScrMem9999GetBusinessInfoResponse {
  // 事業拠点
  businessInfo: BusinessInfo[];
}

// 事業拠点
export interface BusinessInfo {
  // 事業拠点ID
  businessBaseId: string;
  // 事業拠点名称
  businessBaseName: string;
  // 事業拠点郵便番号
  businessBaseZipCode: string;
  // 事業拠点都道府県コード
  businessBasePrefectureCode: string;
  // 事業拠点都道府県名称
  businessBasePrefectureName: string;
  // 事業拠点市区町村
  businessBaseMunicipalities: string;
  // 事業拠点番地号建物名
  businessBaseAddressBuildingName: string;
  // 事業拠点電話番号
  businessBasePhoneNumber: string;
  // 事業拠点担当者氏名
  businessBaseStaffName: string;
  // 事業拠点担当者連絡先電話番号
  businessBaseStaffContactPhoneNumber: string;
}

/** 事業拠点一覧取得機能API */
export const ScrMem9999GetBusinessInfo = async (
  request: ScrMem9999GetBusinessInfoRequest
): Promise<ScrMem9999GetBusinessInfoResponse> => {
  const response = await memApiClient.post('/scr/get-business-info', request);
  return response.data;
};

/** 請求先基本情報登録APIリクエスト */
export interface ScrMem0008RegistrationBillingInfoRequest {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 請求先ID
  billingId: string;
  // 請求先住所連絡先同期事業拠点ID
  billingAddressContactSynchronizationBusinessBaseId: string;
  // 請求先郵便番号
  billingZipCode: string;
  // 請求先都道府県コード
  billingPrefectureCode: string;
  // 請求先市区町村
  billingMunicipalities: string;
  // 請求先番地号建物名
  billingAddressBuildingName: string;
  // 請求先電話番号
  billingPhoneNumber: string;
  // 請求先FAX番号
  billingFaxNumber: string;
  // 請求先メールアドレス
  billingMailAddress: string;
  // 請求先名称
  billingName: string;
  // 契約情報
  contractInfo: ContractInfo[];
  // 四輪即時出金限度金額
  tvaaImmediatePaymentLimitAmount: number;
  // 四輪即時出金対象譲渡書類未到達限度金額
  tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount: number;
  // 四輪即支払可否フラグ
  tvaaImmediatePaymentFlag: boolean;
  // 四輪書類先出しフラグ
  tvaaDocumentAdvanceFlag: boolean;
  // 四輪延滞金自動発生可否フラグ
  tvaaArrearsPriceAutomaticOccurrenceFlag: boolean;
  // 四輪相殺要否フラグ
  tvaaOffsettingFlag: boolean;
  // 四輪オークション参加制限可否フラグ
  tvaaAuctionEntryLimitFlag: boolean;
  // 四輪督促状メール送信フラグ
  tvaaDemandMailSendFlag: boolean;
  // 四輪督促状FAX送信フラグ
  tvaaDemandFaxSendFlag: boolean;
  // 四輪計算書メール送信フラグ
  tvaaStatementMailSendFlag: boolean;
  // 四輪計算書FAX送信フラグ
  tvaaStatementFaxSendFlag: boolean;
  // 二輪即時出金限度金額
  bikeImmediatePaymentLimitAmount: number;
  // 二輪即時出金対象譲渡書類未到達限度金額
  bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount: number;
  // 二輪即支払可否フラグ
  bikeImmediatePaymentFlag: boolean;
  // 二輪書類先出しフラグ
  bikeDocumentAdvanceFlag: boolean;
  // 二輪延滞金自動発生可否フラグ
  bikeArrearsPriceAutomaticOccurrenceFlag: boolean;
  // 二輪相殺要否フラグ
  bikeOffsettingFlag: boolean;
  // 二輪オークション参加制限可否フラグ
  bikeAuctionEntryLimitFlag: boolean;
  // 二輪督促状メール送信フラグ
  bikeDemandMailSendFlag: boolean;
  // 二輪督促状FAX送信フラグ
  bikeDemandFaxSendFlag: boolean;
  // 二輪計算書メール送信フラグ
  bikeStatementMailSendFlag: boolean;
  // 二輪計算書FAX送信フラグ
  bikeStatementFaxSendFlag: boolean;
  // 画面ID
  screenId: string;
  // タブID
  tabId: number;
  // 申請従業員ID
  applicationEmployeeId: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 変更予定日
  changeExpectDate: Date;
}

/** 請求先基本情報登録API */
export const ScrMem0008RegistrationBillingInfo = async (
  request: ScrMem0008RegistrationBillingInfoRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/scr-mem-0008/registration-billing-info',
    request
  );
  return null;
};

/** 住所情報取得表示APIリクエスト */
export interface ScrCom9999GetAddressInfoRequest {
  // 郵便番号
  zipCode: string;
}

/** 住所情報取得表示APIレスポンス */
export interface ScrCom9999GetAddressInfoResponse {
  // 都道府県コード
  prefectureCode: string;
  // 都道府県名称
  prefectureName: string;
  // 市区群コード
  districtCode: string;
  // 市区町村
  municipalities: string;
  // 町域名
  townOrStreetName: string;
}

/** 住所情報取得表示API */
export const ScrCom9999GetAddressInfo = async (
  request: ScrCom9999GetAddressInfoRequest
): Promise<ScrCom9999GetAddressInfoResponse> => {
  const response = await comApiClient.post('/scr/get-address-info', request);
  return response.data;
};

/** 支店名情報取得APIリクエスト */
export interface ScrMem9999GetBranchMasterRequest {
  // 銀行コード
  bankCode: string;
}

/** 支店名情報取得APIレスポンス */
export interface ScrMem9999GetBranchMasterResponse {
  // リスト
  list: List[];
}

// リスト
export interface List {
  // 支店コード
  branchCode: string;
  // 支店名
  branchName: string;
}

/** 支店名情報取得API */
export const ScrMem9999GetBranchMaster = async (
  request: ScrMem9999GetBranchMasterRequest
): Promise<ScrMem9999GetBranchMasterResponse> => {
  const response = await memApiClient.post('/scr/get-branch-master', request);
  return response.data;
};

/** 口座情報登録申請APIリクエスト */
export interface ScrMem0008ApplyRegistrationBankInfoRequest {
  // 変更履歴番号
  changeHistoryNumber: number;
  // 法人ID
  corporationId: string;
  // 請求先ID
  billingId: string;
  // 会員用引落口座(会費用)
  accountType1: AccountType;
  // 支払口座(会費用)
  accountType2: AccountType;
  // 会員向け振込口座（計算書記載の入金ﾊﾞｰﾁｬﾙ口座）
  accountType3: AccountType3[];
  // 会場向け振込口座(取引用ﾊﾞｰﾁｬﾙ)
  accountType4: AccountType;
  // 申請従業員ID
  applicationEmployeeId: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 第一承認者ID
  firstApproverId: string;
  // 第一承認者メールアドレス
  firstApproverMailAddress: string;
  // 第ニ承認者ID
  secondApproverId: string;
  // 第三承認者ID
  thirdApproverId: string;
  // 第四承認者ID
  fourthApproverId: string;
  // 申請コメント
  applicationComment: string;
  // 変更予定日
  changeExpectDate: string;
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
}

/** 口座情報登録申請API */
export const ScrMem0008ApplyRegistrationBankInfo = async (
  request: ScrMem0008ApplyRegistrationBankInfoRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/scr-mem-0008/apply-registration-bank-info',
    request
  );
  return null;
};

