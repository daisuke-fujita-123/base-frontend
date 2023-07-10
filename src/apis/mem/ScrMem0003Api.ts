import { comApiClient, memApiClient } from 'providers/ApiClient';


/**
 * 基本情報タブ
 */

/** 法人基本情報取得APIリクエスト */
export interface ScrMem0003GetCorporationRequest {
  /** 法人ID */
  corporationId: string;
}

/** 法人基本情報取得APIレスポンス */
export interface ScrMem0003GetCorporationResponse {
  /** 法人ID */
  corporationId: string;
  /** 法人名称 */
  corporationName: string;
  /** 法人名カナ */
  corporationNameKana: string;
  /** 法人グループマスタ */
  corporationGroupMasters: CorporationGroupMasters[];
  /** Gold/Silver会員区分 */
  goldSilverMemberKind: string;
  /** 法人郵便番号 */
  corporationZipCode: string;
  /** 法人都道府県コード */
  corporationPrefectureCode: string;
  /** 法人市区町村 */
  corporationMunicipalities: string;
  /** 法人番地号建物名 */
  corporationAddressBuildingName: string;
  /** 法人電話番号 */
  corporationPhoneNumber: string;
  /** 法人FAX番号 */
  corporationFaxNumber: string;
  /** 法人メールアドレス */
  corporationMailAddress: string;
  /** 適格事業者番号 */
  eligibleBusinessNumber: string;
  /** 税事業者区分 */
  taxBusinessKind: string;
  /** 公安委員会 */
  publicSafetyCommittee: string;
  /** 古物商許可番号 */
  antiqueBusinessLicenseNumber: string;
  /** 交付年月日 */
  issuanceDate: string;
  /** 古物名義 */
  antiqueName: string;
  /** 会員メモ */
  memberMemo: string;
  /** 代表者名 */
  representativeName: string;
  /** 代表者名カナ */
  representativeNameKana: string;
  /** 代表者性別区分 */
  representativeGenderKind: string;
  /** 代表者生年月日 */
  representativeBirthDate: string;
  /** 所有資産区分 */
  possessionAssetsKind: string;
  /** 代表者郵便番号 */
  representativeZipCode: string;
  /** 代表者都道府県コード */
  representativePrefectureCode: string;
  /** 代表者市区町村 */
  representativeMunicipalities: string;
  /** 代表者番地号建物名 */
  representativeAddressBuildingName: string;
  /** 代表者電話番号 */
  representativePhoneNumber: string;
  /** 代表者FAX番号 */
  representativeFaxNumber: string;
  /** 代表者携帯電話番号 */
  representativeMobilePhoneNumber: string;
  /** 連帯保証人マスタ */
  guarantorMasters: GuarantorMasters[];
  /** 会員変更履歴 */
  memberChangeHistories: Memberchangehistories[];
  /** 未承認申請一覧 */
  unapprovalApplicationTrans: Unapprovalapplicationtrans[];
}

/** 法人グループマスタ */
export interface CorporationGroupMasters {
  /** 法人グループID */
  corporationGroupId: string;
  /** 有効開始日 */
  validityStartDate: string;
  /** 法人グループ名 */
  corporationGroupName: string;
}

/** 連帯保証人マスタ */
export interface GuarantorMasters {
  /** 連帯保証人No */
  guarantorNo: number;
  /** 連帯保証人名 */
  guarantorName: string;
  /** 連帯保証人名カナ */
  guarantorNameKana: string;
  /** 連帯保証人性別区分 */
  guarantorGenderKind: string;
  /** 連帯保証人生年月日 */
  guarantorBirthDate: string;
  /** 連帯保証人所有資産区分 */
  guarantorPossessionAssetsKind: string;
  /** 連帯保証人続柄 */
  guarantorRelationship: string;
  /** 連帯保証人郵便番号 */
  guarantorZipCode: string;
  /** 連帯保証人都道府県コード */
  guarantorPrefectureCode: string;
  /** 連帯保証人市区町村 */
  guarantorMunicipalities: string;
  /** 連帯保証人番地号建物名 */
  guarantorAddressBuildingName: string;
  /** 連帯保証人電話番号 */
  guarantorPhoneNumber: string;
  /** 連帯保証人FAX番号 */
  guarantorFaxNumber: string;
  /** 連帯保証人携帯電話番号 */
  guarantorMobilePhoneNumber: string;
}

/** 会員変更履歴 */
export interface Memberchangehistories {
  /** 変更履歴番号 */
  changeHistoryNumber: number;
  /** 画面ID */
  screenId: string;
  /** 画面名 */
  screenName: string;
  /** 画面システム種別 */
  screenSystemKind: string;
  /** 画面システム種別名称 */
  screenSystemKindName: string;
  /** タブID */
  tabId: string;
  /** タブ名称 */
  tabName: string;
  /** 一括登録ID */
  allRegistrationId: string;
  /** 一括登録名称 */
  allRegistrationName: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 変更申請反映タイムスタンプ */
  changeApplicationApplyingTimestamp: string;
  /** 変更申請従業員ID */
  changeApplicationEmployeeId: string;
  /** 変更申請従業員名 */
  changeApplicationEmployeeName: string;
  /** 変更申請タイムスタンプ */
  changeApplicationTimestamp: string;
  /** 申請コメント */
  applicationComment: string;
  /** 最終承認従業員ID */
  lastApprovalEmployeeId: string;
  /** 最終承認従業員名 */
  lastApprovalEmployeeName: string;
  /** 最終承認タイムスタンプ */
  lastApprovalTimestamp: string;
  /** 最終承認者コメント */
  lastApproverComment: string;
}

/** 未承認申請一覧 */
export interface Unapprovalapplicationtrans {
  /** 変更履歴番号 */
  changeHistoryNumber: number;
  /** 画面ID */
  screenId: string;
  /** 画面名 */
  screenName: string;
  /** 画面システム種別 */
  screenSystemKind: string;
  /** 画面システム種別名称 */
  screenSystemKindName: string;
  /** タブID */
  tabId: string;
  /** タブ名称 */
  tabName: string;
  /** 一括登録ID */
  allRegistrationId: string;
  /** 一括登録名称 */
  allRegistrationName: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 変更申請反映タイムスタンプ */
  changeApplicationApplyingTimestamp: string;
  /** 変更申請従業員ID */
  changeApplicationEmployeeId: string;
  /** 変更申請従業員名 */
  changeApplicationEmployeeName: string;
  /** 変更申請タイムスタンプ */
  changeApplicationTimestamp: string;
  /** 申請コメント */
  applicationComment: string;
  /** 承認ステータス */
  approvalStatus: string;
  /** 承認ステータス名称 */
  approvalStatusName: string;
  /** 承認タイムスタンプ */
  approvalTimestamp: string;
  /** 1次承認従業員ID */
  primaryApprovalEmployeeId: string;
  /** 1次承認従業員名 */
  primaryApprovalEmployeeName: string;
  /** 2次承認従業員ID */
  secondaryApprovalEmployeeId: string;
  /** 2次承認従業員名 */
  secondaryApprovalEmployeeName: string;
  /** 3次承認従業員ID */
  tertiaryApprovalEmployeeId: string;
  /** 3次承認従業員名 */
  tertiaryApprovalEmployeeName: string;
  /** 4次承認従業員ID */
  quaternaryApprovalEmployeeId: string;
  /** 4次承認従業員名 */
  quaternaryApprovalEmployeeName: string;
}

/** 法人基本情報取得API */
export const ScrMem0003GetCorporation = async (
  request: ScrMem0003GetCorporationRequest
): Promise<ScrMem0003GetCorporationResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/get-corporation',
    request
  );
  return response.data;
};

/** 法人基本情報入力チェックAPIリクエスト */
export interface ScrMem0003InputCheckCorporationInfoRequest {
  // 法人ID
  corporationId: string;
  // 郵便番号
  zipCode: string;
  // 都道府県
  prefectureCode: string;
  // 市区町村
  municipalities: string;
  // 番地・号・建物名など
  addressBuildingName: string;
  // TEL
  phoneNumber: string;
  // FAX
  faxNumber: string;
  // メールアドレス
  mailAddress: string;
  // 公安委員会
  publicSafetyCommittee: string;
  // 古物商許可番号
  antiqueBusinessLicenseNumber: string;
}

/** 法人基本情報入力チェックAPIレスポンス */
export interface ScrMem0003InputCheckCorporationInfoResponse {
  errorList:errorResult[],
  warnList:errorResult[]
}

// リスト
export interface errorResult {
  'errorCode':string;
  'errorMessage':string;
  'detail':string;
}

/** 法人基本情報入力チェックAPI */
export const ScrMem0003InputCheckCorporationInfo = async (
  request: ScrMem0003InputCheckCorporationInfoRequest
): Promise<ScrMem0003InputCheckCorporationInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/input-check-corporation-info',
    request
  );
  return response.data;
}

/** 法人基本情報申請APIリクエスト */
export interface ScrMem0003ApplyForChangeCorporationRequest {
  /** 法人ID */
  corporationId: string;
  /** 法人名称 */
  corporationName: string;
  /** 法人名称カナ */
  corporationNameKana: string;
  /** Gold/Silver会員区分 */
  goldSilverMemberKind: string;
  /** 法人郵便番号 */
  corporationZipCode: string;
  /** 法人都道府県コード */
  corporationPrefectureCode: string;
  /** 法人市区町村 */
  corporationMunicipalities: string;
  /** 法人番地号建物名 */
  corporationAddressBuildingName: string;
  /** 法人電話番号 */
  corporationPhoneNumber: string;
  /** 法人FAX番号 */
  corporationFaxNumber: string;
  /** 法人メールアドレス */
  corporationMailAddress: string;
  /** 適格事業者番号 */
  eligibleBusinessNumber: string;
  /** 税事業者区分 */
  taxBusinessKind: string;
  /** 公安委員会 */
  publicSafetyCommittee: string;
  /** 古物商許可番号 */
  antiqueBusinessLicenseNumber: string;
  /** 交付年月日 */
  issuanceDate: string;
  /** 古物名義 */
  antiqueName: string;
  /** 会員メモ */
  memberMemo: string;
  /** 代表者名 */
  representativeName: string;
  /** 代表者名カナ */
  representativeNameKana: string;
  /** 代表者性別区分 */
  representativeGenderKind: string;
  /** 代表者生年月日 */
  representativeBirthDate: string;
  /** 所有資産区分 */
  possessionAssetsKind: string;
  /** 代表者郵便番号 */
  representativeZipCode: string;
  /** 代表者都道府県コード */
  representativePrefectureCode: string;
  /** 代表者市区町村 */
  representativeMunicipalities: string;
  /** 代表者番地号建物名 */
  representativeAddressBuildingName: string;
  /** 代表者電話番号 */
  representativePhoneNumber: string;
  /** 代表者FAX番号 */
  representativeFaxNumber: string;
  /** 代表者携帯電話番号 */
  representativeMobilePhoneNumber: string;
  /** 法人グループマスタ */
  corporationGroupMasters: CorporationGroupMasters[];
  /** 連帯保証人マスタ */
  guarantor: GuarantorMasters[];
  /** 申請従業員ID */
  applicationEmployeeId: string;
  /** 変更予定日 */
  changeHistoryDate: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: string;
}

/** 法人グループマスタ */
export interface CorporationGroupMasters {
  /** 法人グループID */
  corporationGroupId: string;
}

/** 連帯保証人マスタ */
export interface GuarantorMasters {
  /** 連帯保証人No */
  guarantorNo: number;
  /** 連帯保証人名 */
  guarantorName: string;
  /** 連帯保証人名カナ */
  guarantorNameKana: string;
  /** 連帯保証人性別区分 */
  guarantorGenderKind: string;
  /** 連帯保証人生年月日 */
  guarantorBirthDate: string;
  /** 連帯保証人所有資産区分 */
  guarantorPossessionAssetsKind: string;
  /** 連帯保証人続柄 */
  guarantorRelationship: string;
  /** 連帯保証人郵便番号 */
  guarantorZipCode: string;
  /** 連帯保証人都道府県コード */
  guarantorPrefectureCode: string;
  /** 連帯保証人市区町村 */
  guarantorMunicipalities: string;
  /** 連帯保証人番地号建物名 */
  guarantorAddressBuildingName: string;
  /** 連帯保証人電話番号 */
  guarantorPhoneNumber: string;
  /** 連帯保証人FAX番号 */
  guarantorFaxNumber: string;
  /** 連帯保証人携帯電話番号 */
  guarantorMobilePhoneNumber: string;
}

/** 法人基本情報申請APIレスポンス */
export interface ScrMem0003ApplyForChangeCorporationResponse {
  /** 変更履歴番号 */
  changeHistoryNumber: string;
}

/** 法人基本情報申請API */
export const ScrMem0003ApplyForChangeCorporation = async (
  request: ScrMem0003ApplyForChangeCorporationRequest
): Promise<ScrMem0003ApplyForChangeCorporationResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/apply-for-change-corporation',
    request
  );
  return response.data;
};


/**
 * 与信情報タブ
 */

/** 与信情報取得APIリクエスト */
export interface ScrMem0003GetCreditInfoRequest {
  corporationId: string
}

/** 与信情報取得APIレスポンス */
export interface ScrMem0003GetCreditInfoResponse {
  // 基本法人与信額
  basicsCorporationCreditAmount: number;
  // 法人与信取引額
  corporationCreditDealAmount: number;
  // 与信加算額
  creditAdditionAmount: number;
  // 臨時法人与信額
  temporaryCorporationCreditAmount: number;
  // 臨時与信開始日
  temporaryCreditStartDate: string;
  // 臨時与信終了日
  temporaryCreditEndDate: string;
  // 臨時与信設定日
  temporaryCreditSettingDate: string;
  // 従業員名
  employeeName: string;
  // 変更理由
  changeEeason: string;
  // 稟議書ID
  approvalDocumentId: string;
  // 支払延長与信額
  paymentExtensionCreditAmount: number;
  // 支払延長取引額
  paymentExtensionDealAmount: number;
}

/** 与信情報取得API */
export const ScrMem0003GetCreditInfo = async (
  request: ScrMem0003GetCreditInfoRequest
): Promise<ScrMem0003GetCreditInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/get-credit-info',
    request
  );
  return response.data;
};

/** 与信情報登録APIリクエスト */
export interface ScrMem0003RegistrationCreditInfoRequest {
  // 法人ID
  corporationId: string;
  // 基本法人与信額
  basicsCorporationCreditAmount: number;
  // 法人与信取引額
  corporationCreditDealAmount: number;
  // 与信加算額
  creditAdditionAmount: number;
  // 支払延長与信額
  paymentExtensionCreditAmount: number;
  // 支払延長取引額
  paymentExtensionDealAmount: number;
  // 申請従業員ID
  applicationEmployeeId: string;
  // 業務日付
  businessDate: Date;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 画面ID
  screenId: string;
  // タブID	
  tabId	: string;

}

/** 与信情報登録API */
export const ScrMem0003RegistrationCreditInfo = async (
  request: ScrMem0003RegistrationCreditInfoRequest
) => {
  const response = await memApiClient.post(
    '/scr-mem-0003/registration-credit-info',
    request
  );
  return;
};


/**
 * 与信制限タブ
 */

/** 与信制限取得APIリクエスト */
export interface ScrMem0003GetCreditLimitInfoRequest {
  // 法人ID
  corporationId: string;
}

/** 与信制限取得APIレスポンス */
export interface ScrMem0003GetCreditLimitInfoResponse {
  // 自動制限フラグ
  automaticLimitFlag: boolean;
  // 制限状況フラグ
  limitStatusKind: string;
  // 制限種別
  limitKind: string;
}

/** 与信制限取得API */
export const ScrMem0003GetCreditLimitInfo = async (
  request: ScrMem0003GetCreditLimitInfoRequest
): Promise<ScrMem0003GetCreditLimitInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/get-credit-limit-info',
    request
  );
  return response.data;
};

/** 与信制限登録APIリクエスト */
export interface ScrMem0003RegistrationCreditLimitInfoRequest {
  // 法人ID
  corporationId: string;
  // 自動制限フラグ
  automaticLimitFlag: boolean;
  // 制限状況区分
  limit_statusKind: string;
  // 制限種別
  limitKind: string;
  // 申請従業員ID
  applicationEmployeeId: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 画面ID
  screenId: string;
  // タブID	
  tabId	: string;

}

/** 与信制限登録API */
export const ScrMem0003RegistrationCreditLimitInfo = async (
  request: ScrMem0003RegistrationCreditLimitInfoRequest
) => {
  const response = await memApiClient.post(
    '/scr-mem-0003/registration-credit-limit-info',
    request
  );
};


/**
 * 契約情報タブ
 */

/** 法人契約コース・サービス一覧取得APIリクエスト */
export interface ScrMem0003GetContractCourseServiceRequest {
  // 法人ID
  corporationId: string;
  // 制限件数
  limit: number;
}

/** 法人契約コース・サービス一覧取得APIレスポンス */
export interface ScrMem0003GetContractCourseServiceResponse {
  //  四輪】制限件数
  tvaaLimitCount: number;
  // 【四輪】返却件数
  tvaaResponseCount: number;
  // 【四輪】取得件数
  tvaaAcquisitionCount: number;
  // 【二輪】制限件数
  bikeLimitCount: number;
  // 【二輪】返却件数
  bikeResponseCount: number;
  // 【二輪】取得件数
  bikeAcquisitionCount: number;
  // 請求先一覧制限件数
  billingLimitCount: number;
  // 請求先一覧返却件数
  billingResponseCount: number;
  // 請求先一覧取得件数
  billingAcquisitionCount: number;
  // 譲渡書類送付先一覧制限件数
  assignmentLimitCount: number;
  // 譲渡書類送付先一覧返却件数
  assignmentResponseCount: number;
  // 譲渡書類送付先一覧取得件数
  assignmentAcquisitionCount: number;
  // 【四輪】契約情報一覧
  tvaaContractInfo: ContractInfo[];
  // 【二輪】契約情報一覧
  bikeContractInfo: ContractInfo[];
  // 請求先一覧
  billingInfo: BillingInfo[];
  // 譲渡書類送付先一覧
  assignmentDocumentDestinationInfo: AssignmentDocumentDestinationInfo[];
}

/** 【四輪（二輪）】契約情報一覧 */
export interface ContractInfo {
  // 契約ID
  contractId: string;
  // 契約情報変更予約
  contractChangeReservationfFlag: boolean;
  // 事業拠点ID
  businessBaseId: string;
  // 事業拠点名称
  businessBaseName: string;
  // 請求先ID
  billingId: string;
  // 請求方法区分
  claimMethodKind: string;
  // コース名
  courseName: string;
  // 参加区分
  optionEntryKind: string;
  // オプション契約
  optionContractFlag: boolean;
  // 入会金
  admissionPrice: number;
  // コース定価
  courselistPrice: number;
  // 会員別会費_値引値増金額区分
  memberDistinctionDiscountPriceKind: string;
  // 会員別会費_値引値増金額
  memberDistinctionDiscountPrice: number;
  // コース別サービス定価
  courseDistinctionListPrice: number;
  // 契約本数
  contractCount: number;
  // コース別オプション会費_値引値増金額区分
  courseDistinctionDiscountPriceKind: string;
  // コース別オプション会費_値引値増金額
  courseDistinctionDiscountPrice: number;
}

/** 請求先一覧 */
export interface BillingInfo {
  // 請求先ID
  billingId: string;
  // 契約ID
  contractId: string;
  // コース名
  courseName: string;
  // 請求方法区分
  claimMethodKind: string;
  // 銀行名 （引落）
  debitBankName: string;
  // 支店名 （引落）
  debitBranchName: string;
  // 口座番号（引落）
  debitAccountNumber: string;
  // 銀行名 （支払）
  payingBankName: string;
  // 支店名 （支払）
  payingBranchName: string;
  // 口座番号（支払）
  payingAccountNumber: string;
  // 変更予約
  changeReservationfFlag: boolean;
}

/** 譲渡書類送付先一覧 */
export interface AssignmentDocumentDestinationInfo {
  // 契約ID
  contractId: string;
  // 譲渡書類送付先郵便番号
  assignmentDocumentDestinationZipCode: string;
  // 譲渡書類送付先都道府県名称
  assignmentDocumentDestinationPrefectureName: string;
  // 譲渡書類送付先市区町村
  assignmentDocumentDestinationMunicipalities: string;
  // 譲渡書類送付先番地号建物名
  assignmentDocumentDestinationAddressBuildingName: string;
  // 譲渡書類送付先電話番号
  assignmentDocumentDestinationPhoneNumber: string;
  // 譲渡書類送付先FAX番号
  assignmentDocumentDestinationFaxNumber: string;
  // 譲渡書類送付先メールアドレス
  assignmentDocumentDestinationMailAddress: string;
  // 譲渡書類送付先配送方法伝票種類区分
  assignmentDocumentDestinationShippingMethodSlipKind: string;
  // 変更予約
  changeReservationfFlag: boolean;
}

/** 法人契約コース・サービス一覧取得API */
export const ScrMem0003GetContractCourseService = async (
  request: ScrMem0003GetContractCourseServiceRequest
): Promise<ScrMem0003GetContractCourseServiceResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/get-contract-course-service',
    request
  );
  return response.data;
};

/** 契約情報追加チェックAPIリクエスト */
export interface ScrMem0003AddCheckContractInfoRequest {
  // 法人ID
  corporationId: string;
}

/** 契約情報追加チェックAPIレスポンス */
export interface ScrMem0003AddCheckContractInfoResponse {
  // エラー内容リスト
  errorList: [{
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
  }];
  // ワーニング内容リスト
  warnList: [{
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
  }];
}

/** 契約情報追加チェックAPI */
export const ScrMem0003AddCheckContractInfo = async (
  request: ScrMem0003AddCheckContractInfoRequest
): Promise<ScrMem0003AddCheckContractInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/add-check-contract-info',
    request
  );
  return response.data;
};


/**
 * 拠点情報タブ
 */

/** 物流拠点追加チェックAPIリクエスト */
export interface ScrMem0003AddCheckLogisticsBaseRequest {
  // 法人ID
  corporationId: string;
}

/** 物流拠点追加チェックAPIレスポンス */
export interface ScrMem0003AddCheckLogisticsBaseResponse {
  // エラー内容リスト
  errorList: [{
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
  }];
  // ワーニング内容リスト
  warnList: [{
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
  }];
}

/** 物流拠点追加チェックAPI */
export const ScrMem0003AddCheckLogisticsBase = async (
  request: ScrMem0003AddCheckLogisticsBaseRequest
): Promise<ScrMem0003AddCheckLogisticsBaseResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/add-check-logistics-Base',
    request
  );
  return response.data;
};

/** 物流拠点一覧取得APIリクエスト */
export interface ScrMem0003SearchLogisticsBaseRequest {
  // 法人ID
  corporationId: string;
  // 物流拠点ID
  logisticsBaseId: string;
  // 物流拠点名
  logisticsBaseName: string;
  // 物流拠点名カナ
  logisticsBaseNameKana: string;
  // 利用目的
  usePurpose: string;
  // 四輪営業担当
  tvaaSalesStaffId: string;
  // 二輪営業担当
  bikeSalesStaffId: string;
  // 都道府県コード
  prefectureCode: string;
  // 市区町村以降
  municipalities: string;
  // 地区コード
  regionCode: string;
  // 物流拠点代表契約ID
  logisticsBaseRepresentativeContractId: string;
  // 業務日時
  businessDate: Date;
  // 制限件数
  limit: number;
}

/** 物流拠点一覧取得APIレスポンス */
export interface ScrMem0003SearchLogisticsBaseResponse {
  // 制限件数
  limitCount: number;
  // 返却件数
  responseCount: number;
  // 取得件数
  acquisitionCount: number;
  // 物流拠点
  logisticsBase: LogisticsBase[];
}

/** 物流拠点 */
export interface LogisticsBase {
  // 物流拠点ID
  logisticsBaseId: string;
  // 物流拠点名
  logisticsBaseName: string;
  // 物流拠点名カナ
  logisticsBaseNameKana: string;
  // 四輪情報フラグ
  tvaaInformationFlag: boolean;
  // 二輪情報フラグ
  bikeInformationFlag: boolean;
  // 集荷情報フラグ
  collectionInformationFlag: boolean;
  // 拠点担当者名
  logisticsBaseStaffName: string;
  // 地区コード
  regionCode: string;
  // 地区名
  regionName: string;
  // 郵便番号
  zipCode: string;
  // 都道府県名称
  prefectureName: string;
  // 市区町村
  municipalities: string;
  // 番地号建物名
  addressBuildingName: string;
  // TEL
  telNumber: string;
  // FAX
  faxNumber: string;
  // メールアドレス
  mailAddress: string;
  // 四輪営業担当者名
  tvaaStaffName: string;
  // 二輪営業担当者名
  bikeStaffName: string;
  // 物流拠点代表契約ID
  logisticsBaseRepresentativeContractId: string;
  // 変更予約
  changeReservationfFlag: boolean;

}

/** 物流拠点一覧取得API */
export const ScrMem0003SearchLogisticsBase = async (
  request: ScrMem0003SearchLogisticsBaseRequest
): Promise<ScrMem0003SearchLogisticsBaseResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/search-logistics-base',
    request
  );
  return response.data;
};

/** 事業拠点一覧取得APIリクエスト */
export interface ScrMem0003SearchBusinessBaseRequest {
  // 法人ID
  corporationId: string;
  // 事業拠点ID
  businessBaseId: string;
  // 事業拠点名
  businessBaseName: string;
  // 事業拠点名カナ
  businessBaseNameKana: string;
  // 四輪営業担当
  tvaaSalesStaffId: string;
  // 二輪営業担当
  bikeSalesStaffId: string;
  // 都道府県コード
  prefectureCode: string;
  // 市区町村以降
  municipalities: string;
  // 契約ID
  contractId: string;
  // 業務日時
  businessDate: Date;
  // 制限件数
  limit: number;
}

/** 事業拠点一覧取得APIレスポンス */
export interface ScrMem0003SearchBusinessBaseResponse {
  // 制限件数
  limitCount: number;
  // 返却件数
  responseCount: number;
  // 取得件数
  acquisitionCount: number;
  // 物流拠点
  businessBase: BusinessBase[];
}

/** 物流拠点 */
export interface BusinessBase {
  // 事業拠点ID
  businessBaseId: string;
  // 事業拠点名
  businessBaseName: string;
  // 事業拠点名カナ
  businessBaseNameKana: string;
  // 拠点担当者名
  businessBaseStaffName: string;
  // 郵便番号
  zipCode: string;
  // 都道府県名称
  prefectureName: string;
  // 市区町村
  municipalities: string;
  // 番地号建物名
  addressBuildingName: string;
  // TEL
  telNumber: string;
  // 四輪営業担当者名
  tvaaStaffName: string;
  // 二輪営業担当者名
  bikeStaffName: string;
  // 契約ID
  contractId: string;
  // 変更予約
  changeReservationfFlag: boolean;

}

/** 事業拠点一覧取得API */
export const ScrMem0003SearchBusinessBase = async (
  request: ScrMem0003SearchBusinessBaseRequest
): Promise<ScrMem0003SearchBusinessBaseResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/search-business-base',
    request
  );
  return response.data;
};


/**
 * 取引履歴タブ
 */

/** オークション取引履歴取得APIリクエスト */
export interface ScrMem0003SearchAuctionDealHistoryRequest {
  // 法人ID
  corporationId: string;
  // 請求先IDリスト
  billingIdList: string[];
  // 契約IDリスト
  contractIdList: string[];
  // オークション種類リスト
  auctionKindList: string[];
  // 表示開始期間
  displayStartPeriod: string;
  // 表示終了期間
  displayEndPeriod: string;
  // 制限件数
  limit: number;
}

/** オークション取引履歴取得APIレスポンス */
export interface ScrMem0003SearchAuctionDealHistoryResponse {
  // 制限件数
  limitCount: number;
  // 返却件数
  responseCount: number;
  // 取得件数
  acquisitionCount: number;
  // 出品台数合計
  exhibitCountTotal: number;
  // 成約台数合計
  purchaseCountTotal: number;
  // 成約金額合計
  purchaseAmountTotalTotal: number;
  // 成約クレーム数合計
  purchaseClaimCountTotal: number;
  // 書類遅延台数合計
  documentDelayCountTotal: number;
  // 落札台数合計
  bidCountTotal: number;
  // 落札金額合計
  bidAmountTotal: number;
  // 延滞回数合計
  arrearsCountTotal: number;
  // 遅延状況件数（1日）合計
  day1ArrearsCountTotal: number;
  // 遅延状況件数（2-3日）合計
  day3ArrearsCountTotal: number;
  // 遅延状況件数（4-7日）合計
  day7ArrearsCountTotal: number;
  // 遅延状況件数（8-14日）合計
  day14ArrearsCountTotal: number;
  // 遅延状況件数（15日-）合計
  day15ArrearsCountTotal: number;
  // オークション取引履歴
  auctionDealHistory: AuctionDealHistory[];
}

/** オークション取引履歴 */
export interface AuctionDealHistory {
  // 取引年月
  dealYm: string;
  // 請求先ID
  billingId: string;
  // 契約ID
  contractId: string;
  // 出品台数
  exhibitCount: number;
  // 成約台数
  purchaseCount: number;
  // 成約金額
  purchaseAmount: number;
  // 成約クレーム数
  purchaseClaimCount: number;
  // 書類遅延台数
  documentDelayCount: number;
  // 落札台数
  bidCount: number;
  // 落札金額
  bidAmount: number;
  // 延滞回数
  arrearsCount: number;
  // 遅延状況件数（1日）
  day1ArrearsCount: number;
  // 遅延状況件数（2-3日）
  day3ArrearsCount: number;
  // 遅延状況件数（4-7日）
  day7ArrearsCount: number;
  // 遅延状況件数（8-14日）
  day14ArrearsCount: number;
  // 遅延状況件数（15日-）
  day15ArrearsCount: number;
}

/** オークション取引履歴取得API */
export const ScrMem0003SearchAuctionDealHistory = async (
  request: ScrMem0003SearchAuctionDealHistoryRequest
): Promise<ScrMem0003SearchAuctionDealHistoryResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0003/search-auction-deal-history',
    request
  );
  return response.data;
};

/**
 * 変更履歴タブ
 */


/**
 * 共通
 */


/** コード値取得API（コード管理マスタ以外）リクエスト */
export interface ScrMem0003GetCodeValueRequest {
  // エンティティリスト
  entityList: EntityList[];
}

export interface EntityList{
  // エンティティ名
  entityName: string;
}

/** コード値取得API（コード管理マスタ以外）レスポンス */
export interface ScrMem0003GetCodeValueResponse {
  // 結果リスト
  resultList: ResultList[];
}

export interface ResultList {
  // エンティティ名
  entityName:string;
  // コード値リスト
  codeValueList: CodeValueList[];
}

export interface CodeValueList {
  // コード値
  codeValue: string;
  // コード値名称
  codeValueName: string;
  // コード値名称カナ
  codeValueNameKana: string;
}

/** コード値取得API（コード管理マスタ以外） */
export const ScrMem0003GetCodeValue = async (
  request: ScrMem0003GetCodeValueRequest
): Promise<ScrMem0003GetCodeValueResponse> => {
  const response = await memApiClient.post(
    '/scr/get-code-value',
    request
  );
  return response.data;
};

/** コード管理マスタ情報取得APIリクエスト */
export interface ScrCom9999GetCodeManagementMasterRequest {
  // コードID
  codeId: string;
}

/** コード管理マスタ情報取得APIレスポンス */
export interface ScrCom9999GetCodeManagementMasterResponse {
  // リスト
  list: List[];
}

export interface List {
  // コード値
  codeValue: string;
  // コード名
  codeName: string;
}

/** コード管理マスタ情報取得API */
export const ScrCom9999GetCodeManagementMaster = async (
  request: ScrCom9999GetCodeManagementMasterRequest
): Promise<ScrCom9999GetCodeManagementMasterResponse> => {
  const response = await comApiClient.post(
    'com/scr-com-9999/get-code-management-master',
    request
  );
  return response.data;
};
