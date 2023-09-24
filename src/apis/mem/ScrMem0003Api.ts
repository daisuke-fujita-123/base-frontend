import { memApiClient } from 'providers/ApiClient';

/**
 * 基本情報タブ
 */

/** 法人基本情報取得APIリクエスト */
export interface ScrMem0003GetCorporationInfoRequest {
  // 法人ID
  corporationId: string;
  // 制限件数
  limitCount: number;
}

/** 法人基本情報取得APIレスポンス */
export interface ScrMem0003GetCorporationInfoResponse {
  // 制限件数
  limitCount: number;
  // 返却件数
  responseCount: number;
  // 取得件数
  acquisitionCount: number;
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 法人名カナ
  corporationNameKana: string;
  // 法人グループ
  corporationGroup: CorporationGroup[];
  // Gold/Silver会員区分
  goldSilverMemberKind: string;
  // 法人郵便番号
  corporationZipCode: string;
  // 法人都道府県コード
  corporationPrefectureCode: string;
  // 法人市区町村
  corporationMunicipalities: string;
  // 法人番地号建物名
  corporationAddressBuildingName: string;
  // 法人電話番号
  corporationPhoneNumber: string;
  // 法人FAX番号
  corporationFaxNumber: string;
  // 法人メールアドレス
  corporationMailAddress: string;
  // 適格事業者番号
  eligibleBusinessNumber: string;
  // 税事業者区分
  taxBusinessKind: string;
  // 公安委員会
  publicSafetyCommittee: string;
  // 古物商許可番号
  antiqueBusinessLicenseNumber: string;
  // 交付年月日
  issuanceDate: string;
  // 古物名義
  antiqueName: string;
  // 会員メモ
  memberMemo: string;
  // 代表者名
  representativeName: string;
  // 代表者名カナ
  representativeNameKana: string;
  // 代表者性別区分
  representativeGenderKind: string;
  // 代表者生年月日
  representativeBirthDate: string;
  // 所有資産区分
  possessionAssetsKind: string;
  // 代表者郵便番号
  representativeZipCode: string;
  // 代表者都道府県コード
  representativePrefectureCode: string;
  // 代表者市区町村
  representativeMunicipalities: string;
  // 代表者番地号建物名
  representativeAddressBuildingName: string;
  // 代表者電話番号
  representativePhoneNumber: string;
  // 代表者FAX番号
  representativeFaxNumber: string;
  // 代表者携帯電話番号
  representativeMobilePhoneNumber: string;
  // 連帯保証人
  guarantor: Guarantor[];
  /** 変更履歴一覧 */
  changeHistory: ChangeHistory[];
  /** 未承認申請一覧 */
  notPermission: NotPermission[];
}

/** 法人グループ */
export interface CorporationGroup {
  // 法人グループID
  corporationGroupId: string;
  // 法人グループ名
  corporationGroupName: string;
}

/** 連帯保証人 */
export interface Guarantor {
  // 連帯保証人No
  guarantorNo: number;
  // 連帯保証人名
  guarantorName: string;
  // 連帯保証人カナ
  guarantorNameKana: string;
  // 連帯保証人性別区分コード
  guarantorGenderKind: string;
  // 連帯保証人生年月日
  guarantorBirthDate: string;
  // 連帯保証人所有資産区分
  guarantorPossessionAssetsKind: string;
  // 連帯保証人続柄
  guarantorRelationship: string;
  // 連帯保証人郵便番号
  guarantorZipCode: string;
  // 連帯保証人都道府県コード
  guarantorPrefectureCode: string;
  // 連帯保証人市区町村
  guarantorMunicipalities: string;
  // 連帯保証人番地号建物名
  guarantorAddressBuildingName: string;
  // 連帯保証人電話番号
  guarantorPhoneNumber: string;
  // 連帯保証人FAX番号
  guarantorFaxNumber: string;
  // 連帯保証人携帯電話番号
  guarantorMobilePhoneNumber: string;
}

/** 変更履歴一覧 */
export interface ChangeHistory {
  // 変更履歴番号
  changeHistoryNumber: number;
  // 画面名
  screenName: string;
  // タブ名称
  tabName: string;
  // 一括登録名称
  allRegistrationName: string;
  // 変更予定日
  changeExpectDate: string;
  // 変更申請従業員ID
  changeApplicationEmployeeId: string;
  // 変更申請従業員名
  changeApplicationEmployeeName: string;
  // 変更申請タイムスタンプ
  changeApplicationTimestamp: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 承認従業員ID
  approvalEmployeeId: string;
  // 承認従業員名
  approvalEmployeeName: string;
  // 承認タイムスタンプ
  approvalTimestamp: string;
  // 承認者コメント
  approverComment: string;
}

/** 未承認一覧 */
export interface NotPermission {
  // 変更履歴番号
  changeHistoryNumber: number;
  // 画面名
  screenName: string;
  // タブ名称
  tabName: string;
  // 一括登録名称
  allRegistrationName: string;
  // 変更予定日
  changeExpectDate: string;
  // 変更申請従業員ID
  changeApplicationEmployeeId: string;
  // 変更申請従業員名
  changeApplicationEmployeeName: string;
  // 変更申請タイムスタンプ
  changeApplicationTimestamp: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 承認ステータス
  approvalStatus: string;
  // 承認設定従業員ID１
  approvalSettingEmployeeId1: string;
  // 承認設定従業員名１
  approvalSettingEmployeeName1: string;
  // 承認設定従業員ID２
  approvalSettingEmployeeId2: string;
  // 承認設定従業員名２
  approvalSettingEmployeeName2: string;
  // 承認設定従業員ID３
  approvalSettingEmployeeId3: string;
  // 承認設定従業員名３
  approvalSettingEmployeeName3: string;
  // 承認設定従業員ID４
  approvalSettingEmployeeId4: string;
  // 承認設定従業員名４
  approvalSettingEmployeeName4: string;
}

/** API-MEM-0003-0001: 法人基本情報取得API */
export const ScrMem0003GetCorporationInfo = async (
  request: ScrMem0003GetCorporationInfoRequest
): Promise<ScrMem0003GetCorporationInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/get-corporation-info',
    request
  );
  return response.data;
};

/** 法人ID新規採番APIレスポンス */
export interface ScrMem0003GetNewCorporationIdResponse {
  // 法人ID
  corporationId: string;
}

/** API-MEM-0003-0031: 法人ID新規採番API */
export const ScrMem0003GetNewCorporationId =
  async (): Promise<ScrMem0003GetNewCorporationIdResponse> => {
    const response = await memApiClient.post(
      '/api/mem/scr-mem-0003/get-new-corporation-id'
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
  // 公安委員会
  publicSafetyCommittee: string;
  // 古物商許可番号
  antiqueBusinessLicenseNumber: string;
}

/** 法人基本情報入力チェックAPIレスポンス */
export interface ScrMem0003InputCheckCorporationInfoResponse {
  errorList: ErrorResult[];
  warnList: WarnResult[];
}

// リスト
export interface ErrorResult {
  errorCode: string;
  errorMessage: string;
  detail: string;
}

// リスト
export interface WarnResult {
  warnCode: string;
  warnMessage: string;
  detail: string;
}

/** API-MEM-0003-0005: 法人基本情報入力チェックAPI */
export const ScrMem0003InputCheckCorporationInfo = async (
  request: ScrMem0003InputCheckCorporationInfoRequest
): Promise<ScrMem0003InputCheckCorporationInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/input-check-corporation-info',
    request
  );
  return response.data;
};

/** 法人基本情報登録APIリクエスト */
export interface ScrMem0003RegistrationCorporationInfoRequest {
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 法人名カナ
  corporationNameKana: string;
  // 法人グループID
  corporationGroupId: string[];
  // Gold/Silver会員区分
  goldSilverMemberKind: string;
  // 法人郵便番号
  corporationZipCode: string;
  // 法人都道府県コード
  corporationPrefectureCode: string;
  // 法人市区町村
  corporationMunicipalities: string;
  // 法人番地号建物名
  corporationAddressBuildingName: string;
  // 法人電話番号
  corporationPhoneNumber: string;
  // 法人FAX番号
  corporationFaxNumber: string;
  // 法人メールアドレス
  corporationMailAddress: string;
  // 適格事業者番号
  eligibleBusinessNumber: string;
  // 税事業者区分
  taxBusinessKind: string;
  // 公安委員会
  publicSafetyCommittee: string;
  // 古物商許可番号
  antiqueBusinessLicenseNumber: string;
  // 交付年月日
  issuanceDate: Date;
  // 古物名義
  antiqueName: string;
  // 会員メモ
  memberMemo: string;
  // 代表者名
  representativeName: string;
  // 代表者名カナ
  representativeNameKana: string;
  // 性別
  representativeGenderKind: string;
  // 生年月日
  representativeBirthDate: Date;
  // 所有資産
  possessionAssetsKind: string;
  // 郵便番号
  representativeZipCode: string;
  // 都道府県
  representativePrefectureCode: string;
  // 市区町村
  representativeMunicipalities: string;
  // 番地・号・建物名など
  representativeAddressBuildingName: string;
  // TEL
  representativePhoneNumber: string;
  // FAX
  representativeFaxNumber: string;
  // 携帯番号
  representativeMobilePhoneNumber: string;
  // 連帯保証人
  guarantor: RegistGuarantor[];

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

  // 自動制限フラグ
  automaticLimitFlag: boolean;
  // 制限状況フラグ
  limitStatusKind: string;
  // 制限種別
  limitKind: string;

  // 【四輪】取得件数
  tvaaAcquisitionCount: number;
  // 【四輪】契約情報一覧
  tvaaContractInfo: RegistContractInfo[];
  // 【二輪】取得件数
  bikeAcquisitionCount: number;
  // 【二輪】契約情報一覧
  bikeContractInfo: RegistContractInfo[];
  // 請求先一覧取得件数
  billingAcquisitionCount: number;
  // 請求先一覧
  billingInfo: RegistBillingInfo[];
  // 譲渡書類送付先一覧取得件数
  assignmentAcquisitionCount: number;
  // 譲渡書類送付先一覧
  assignmentDocumentDestinationInfo: RegistAssignmentDocumentDestinationInfo[];

  // 申請従業員ID
  applicationEmployeeId: string;
  // 変更予定日
  changeExpectDate: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
}

/** 連帯保証人 */
export interface RegistGuarantor {
  // 連帯保証人No
  guarantorNo: number;
  // 連帯保証人名
  guarantorName: string;
  // 連帯保証人カナ
  guarantorNameKana: string;
  // 連帯保証人性別区分コード
  guarantorGenderKind: string;
  // 連帯保証人生年月日
  guarantorBirthDate: Date;
  // 連帯保証人所有資産区分
  guarantorPossessionAssetsKind: string;
  // 連帯保証人続柄
  guarantorRelationship: string;
  // 連帯保証人郵便番号
  guarantorZipCode: string;
  // 連帯保証人都道府県コード
  guarantorPrefectureCode: string;
  // 連帯保証人市区町村
  guarantorMunicipalities: string;
  // 連帯保証人番地号建物名
  guarantorAddressBuildingName: string;
  // 連帯保証人電話番号
  guarantorPhoneNumber: string;
  // 連帯保証人FAX番号
  guarantorFaxNumber: string;
  // 連帯保証人携帯電話番号
  guarantorMobilePhoneNumber: string;
}

/** 【四輪（二輪）】契約情報一覧 */
interface RegistContractInfo {
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
  // 会費合計
  courselistPrice: number;
  // 値引値増有無
  discountFlag: boolean;
  // サービス情報
  serviceInfo: ServiceInfo[];
}

// サービス情報
export interface ServiceInfo {
  // サービス名
  serviceName: string;
  // サービス会費
  servicePrice: number;
}

/** 請求先一覧 */
export interface RegistBillingInfo {
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
interface RegistAssignmentDocumentDestinationInfo {
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

/** API-MEM-0003-0025: 法人基本情報登録API */
export const ScrMem0003RegistrationCorporationInfo = async (
  request: ScrMem0003RegistrationCorporationInfoRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/registration-corporation-info',
    request
  );
  return null;
};

/**
 * 与信情報タブ
 */

/** 与信情報取得APIリクエスト */
export interface ScrMem0003GetCreditInfoRequest {
  corporationId: string;
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

/** API-MEM-0003-0002: 与信情報取得API */
export const ScrMem0003GetCreditInfo = async (
  request: ScrMem0003GetCreditInfoRequest
): Promise<ScrMem0003GetCreditInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/get-credit-info',
    request
  );
  return response.data;
};

/** API-MEM-0003-0026: 与信情報登録申請API */
export const ScrMem0003RegistrationCreditInfo = async (
  request: ScrMem0003RegistrationCorporationInfoRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/registration-credit-info',
    request
  );
  return null;
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

/** API-MEM-0003-0003: 与信制限取得API */
export const ScrMem0003GetCreditLimitInfo = async (
  request: ScrMem0003GetCreditLimitInfoRequest
): Promise<ScrMem0003GetCreditLimitInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/get-credit-limit-info',
    request
  );
  return response.data;
};

/** API-MEM-0003-0027: 与信制限登録API */
export const ScrMem0003RegistrationCreditLimitInfo = async (
  request: ScrMem0003RegistrationCorporationInfoRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/registration-credit-limit-info',
    request
  );
  return null;
};

/**
 * 契約情報タブ
 */

/** 法人契約コース・サービス一覧取得APIリクエスト */
export interface ScrMem0003GetContractCourseServiceRequest {
  // 法人ID
  corporationId: string;
}

/** 法人契約コース・サービス一覧取得APIレスポンス */
export interface ScrMem0003GetContractCourseServiceResponse {
  // 【四輪】取得件数
  tvaaAcquisitionCount: number;
  // 【二輪】取得件数
  bikeAcquisitionCount: number;
  // 請求先一覧取得件数
  billingAcquisitionCount: number;
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
  // 会費合計
  courselistPrice: number;
  // 値引値増有無
  discountFlag: boolean;
  // サービス情報
  serviceInfo: ServiceInfo[];
}

// サービス情報
export interface ServiceInfo {
  // サービス名
  serviceName: string;
  // サービス会費
  servicePrice: number;
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

/** API-MEM-0003-0004: 法人契約コース・サービス一覧取得API */
export const ScrMem0003GetContractCourseService = async (
  request: ScrMem0003GetContractCourseServiceRequest
): Promise<ScrMem0003GetContractCourseServiceResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/get-contract-course-service',
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
  errorList: [
    {
      // エラーコード
      errorCode: string;
      // エラーメッセージ
      errorMessage: string;
    }
  ];
  // ワーニング内容リスト
  warnList: [
    {
      // エラーコード
      errorCode: string;
      // エラーメッセージ
      errorMessage: string;
    }
  ];
}

/** API-MEM-0003-0007: 契約情報追加チェックAPI */
export const ScrMem0003AddCheckContractInfo = async (
  request: ScrMem0003AddCheckContractInfoRequest
): Promise<ScrMem0003AddCheckContractInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/add-check-contract-info',
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
  errorList: [
    {
      // エラーコード
      errorCode: string;
      // エラーメッセージ
      errorMessage: string;
    }
  ];
  // ワーニング内容リスト
  warnList: [
    {
      // エラーコード
      errorCode: string;
      // エラーメッセージ
      errorMessage: string;
    }
  ];
}

/** API-MEM-0003-0012: 物流拠点追加チェックAPI */
export const ScrMem0003AddCheckLogisticsBase = async (
  request: ScrMem0003AddCheckLogisticsBaseRequest
): Promise<ScrMem0003AddCheckLogisticsBaseResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/add-check-logistics-base',
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

/** API-MEM-0003-0014: 物流拠点一覧取得API */
export const ScrMem0003SearchLogisticsBase = async (
  request: ScrMem0003SearchLogisticsBaseRequest
): Promise<ScrMem0003SearchLogisticsBaseResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/search-logistics-base',
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

/** API-MEM-0003-0016: 事業拠点一覧取得API */
export const ScrMem0003SearchBusinessBase = async (
  request: ScrMem0003SearchBusinessBaseRequest
): Promise<ScrMem0003SearchBusinessBaseResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/search-business-base',
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

/** API-MEM-0003-0018: オークション取引履歴取得API */
export const ScrMem0003SearchAuctionDealHistory = async (
  request: ScrMem0003SearchAuctionDealHistoryRequest
): Promise<ScrMem0003SearchAuctionDealHistoryResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/search-auction-deal-history',
    request
  );
  return response.data;
};

/** 一般請求取引履歴取得APIリクエスト */
export interface ScrMem0003SearchBillingDealHistoryRequest {
  // 法人ID
  corporationId: string;
  // 請求先IDリスト
  billingIdList: string[];
  // 契約IDリスト
  contractIdList: string[];
  // 表示開始期間
  displayStartPeriod: string;
  // 表示終了期間
  displayEndPeriod: string;
  // 制限件数
  limit: number;
}

/** 一般請求取引履歴取得APIレスポンス */
export interface ScrMem0003SearchBillingDealHistoryResponse {
  // 制限件数
  limitCount: number;
  // 返却件数
  responseCount: number;
  // 取得件数
  acquisitionCount: number;
  // 請求件数合計
  claimCountTotal: number;
  // 請求金額合計
  claimAmountTotal: number;
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
  // 一般請求取引履歴
  billingDealHistory: BillingDealHistory[];
}

/** 一般請求取引履歴 */
export interface BillingDealHistory {
  // 取引年月
  dealYm: string;
  // 請求先ID
  billingId: string;
  // 契約ID
  contractId: string;
  // 請求件数
  claimCount: number;
  // 請求金額
  claimAmount: number;
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

/** API-MEM-0003-0020: 一般請求取引履歴取得API */
export const ScrMem0003SearchBillingDealHistory = async (
  request: ScrMem0003SearchBillingDealHistoryRequest
): Promise<ScrMem0003SearchBillingDealHistoryResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/search-billing-deal-history',
    request
  );
  return response.data;
};

/** 代行請求履歴取得APIリクエスト */
export interface ScrMem0003SearchProxyBillingHistoryRequest {
  // 法人ID
  corporationId: string;
  // 請求先IDリスト
  billingIdList: string[];
  // 契約IDリスト
  contractIdList: string[];
  // 表示開始期間
  displayStartPeriod: string;
  // 表示終了期間
  displayEndPeriod: string;
  // 制限件数
  limit: number;
}

/** 代行請求履歴取得APIレスポンス */
export interface ScrMem0003SearchProxyBillingHistoryResponse {
  // 制限件数
  limitCount: number;
  // 返却件数
  responseCount: number;
  // 取得件数
  acquisitionCount: number;
  // 代行請求履歴
  proxyBillingHistory: ProxyBillingHistory[];
}

/** 代行請求履歴 */
export interface ProxyBillingHistory {
  // 取引年月
  dealYm: string;
  // 請求先ID
  billingId: string;
  // 契約ID
  contractId: string;
  // 請求会費内容
  goodsClaim: string;
  // 請求金額
  claimAmount: number;
  // 振替処理結果
  transferProcessResult: string;
}

/** API-MEM-0003-0022: 代行請求履歴取得API */
export const ScrMem0003SearchProxyBillingHistory = async (
  request: ScrMem0003SearchProxyBillingHistoryRequest
): Promise<ScrMem0003SearchProxyBillingHistoryResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/search-proxy-billing-history',
    request
  );
  return response.data;
};

/** 拠点枝番紐付け情報取得リクエスト */
export interface ScrMem0003GetBranchNumberInfoRequest {
  /** 法人ID */
  corporationId: string;
  /** 変更履歴番号 */
  changeHistoryNumber: string | null;
}

/** 拠点枝番紐付け情報取得レスポンス */
export interface ScrMem0003GetBranchNumberInfoResponse {
  /** 法人ID */
  corporationId: string;
  /** 法人名称 */
  corporationName: string;
  /** 契約配列 */
  contracts: {
    /** 契約ID */
    contractId: string;
    /** コース参加区分 */
    courseEntryKind: string;
  }[];
  /** 物流拠点配列 */
  logisticsBases: {
    /** 物流拠点ID */
    logisticsBaseId: string;
    /** 物流拠点名称 */
    logisticsBaseName: string;
    /** 物流拠点代表契約ID */
    logisticsBaseRepresentativeContractId: string;
  }[];
  /** 契約ID別枝番設定配列 */
  contractBranchNumberSummaries: {
    /** 契約ID */
    contractId: string;
    /** コース名 */
    courseName: string;
    /** コース参加区分 */
    courseEntryKind: string;
    /** コース参加区分名称 */
    courseEntryKindName: string;
    /** 枝番設定数 */
    branchNumberCount: number;
  }[];
  /** 枝番配列 */
  branchNumbers: {
    /** 物流拠点ID */
    logisticsBaseId: string;
    /** 契約ID */
    contractId: string;
    /** 枝番 */
    branchNumber: string;
  }[];
  /** 変更タイムスタンプ */
  changeTimestamp: string;
}

/** API-MEM-0003-0029:拠点枝番紐付け情報取得API */
export const ScrMem0003GetBranchNumberInfo = async (
  request: ScrMem0003GetBranchNumberInfoRequest
): Promise<ScrMem0003GetBranchNumberInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/get-branch-number-info',
    request
  );
  return response.data;
};

/** 拠点枝番紐付け情報入力チェックリクエスト */
export interface ScrMem0003InputCheckBranchNumberInfoRequest {
  /** 法人ID */
  corporationId: string;
  /** 枝番配列 */
  branchNumbers: {
    /** 物流拠点ID */
    logisticsBaseId: string;
    /** 契約ID */
    contractId: string;
    /** 枝番 */
    branchNumber: string;
  }[];
}

/** 拠点枝番紐付け情報入力チェックレスポンス */
export interface ScrMem0003InputCheckBranchNumberInfoResponse {
  /** エラーリスト */
  errorList: {
    /** エラーコード */
    errorCode: string;
    /** エラーメッセージ */
    errorMessage: string;
  }[];
}

/** API-MEM-0003-0029:拠点枝番紐付け情報入力チェックAPI */
export const ScrMem0003InputCheckBranchNumberInfo = async (
  request: ScrMem0003InputCheckBranchNumberInfoRequest
): Promise<ScrMem0003InputCheckBranchNumberInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/input-check-branch-number-info',
    request
  );
  return response.data;
};

/** 拠点枝番紐付け情報登録リクエスト */
export interface ScrMem0003RegistrationBranchNumberInfoRequest {
  /** 法人ID */
  corporationId: string;
  /** 枝番配列 */
  branchNumbers: {
    /** 物流拠点ID */
    logisticsBaseId: string;
    /** 契約ID */
    contractId: string;
    /** 枝番 */
    branchNumber: string;
  }[];
  /** 変更タイムスタンプ */
  changeTimestamp: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
}

/** 拠点枝番紐付け情報登録レスポンス */
export interface ScrMem0003RegistrationBranchNumberInfoResponse {
  dummy?: string;
}

/** API-MEM-0003-0030:拠点枝番紐付け情報登録API */
export const ScrMem0003RegistrationBranchNumberInfo = async (
  request: ScrMem0003RegistrationBranchNumberInfoRequest
): Promise<ScrMem0003RegistrationBranchNumberInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/registration-branch-number-info',
    request
  );
  return response.data;
};

