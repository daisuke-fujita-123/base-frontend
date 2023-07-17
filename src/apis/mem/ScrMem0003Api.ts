import { memApiClient } from 'providers/ApiClient';

/** 法人基本情報取得APIリクエスト */
export interface ScrMem0003GetCorporationRequest {
  /** 法人ID */
  corporationId: string;
  /** 変更履歴番号 */
  changeHistoryNumber: string;
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
  guarantorMasters: GuarantorMasters[];
  /** 変更予定日 */
  changeExpectDate: string;
  /** 変更履歴番号 */
  changeHistoryNumber: string;
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

/** 拠点枝番紐付け情報取得API */

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

export const ScrMem0003GetBranchNumberInfo = async (
  request: ScrMem0003GetBranchNumberInfoRequest
): Promise<ScrMem0003GetBranchNumberInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/get-branch-number-info',
    request
  );
  return response.data;
};

/** 拠点枝番紐付け情報入力チェックAPI */

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
export const ScrMem0003InputCheckBranchNumberInfo = async (
  request: ScrMem0003InputCheckBranchNumberInfoRequest
): Promise<ScrMem0003InputCheckBranchNumberInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/input-check-branch-number-info',
    request
  );
  return response.data;
};

/** 拠点枝番紐付け情報登録API */

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
}
/** 拠点枝番紐付け情報登録レスポンス */
export interface ScrMem0003RegistrationBranchNumberInfoResponse {
  dummy?: string;
}
export const ScrMem0003RegistrationBranchNumberInfo = async (
  request: ScrMem0003RegistrationBranchNumberInfoRequest
): Promise<ScrMem0003RegistrationBranchNumberInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/registration-branch-number-info',
    request
  );
  return response.data;
};
