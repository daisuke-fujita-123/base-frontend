import { memApiClient } from 'providers/ApiClient';

/** 事業拠点基本情報取得APIリクエスト */
export interface ScrMem0010GetBusinessbaseRequest {
  // 法人ID
  corporationId: string;
  // 事業拠点ID
  businessBaseId: string;
}

/** 事業拠点基本情報取得APIレスポンス */
export interface ScrMem0010GetBusinessbaseResponse {
  // 事業拠点法人情報同期フラグ
  businessBaseCorporationInformationSynchronizationFlag: boolean;
  // 事業拠点ID
  businessBaseId: string;
  // 事業拠点名称
  businessBaseName: string;
  // 事業拠点名称カナ
  businessBaseNameKana: string;
  // 事業拠点郵便番号
  businessBaseZipCode: string;
  // 事業拠点都道府県コード
  businessBasePrefectureCode: string;
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
  // 四輪営業担当
  tvaaSalesStaff: string;
  // 二輪営業担当
  bikeSalesStaff: string;
}

/** 事業拠点基本情報取得API */
export const ScrMem0010GetBusinessbase = async (
  request: ScrMem0010GetBusinessbaseRequest
): Promise<ScrMem0010GetBusinessbaseResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0010/get-businessbase',
    request
  );
  return response.data;
};

/** コード値取得API（コード管理マスタ以外）リクエスト */
export interface ScrMem9999GetCodeValueRequest {
  // エンティティリスト
  entityList: EntityList[];
}

// エンティティリスト
export interface EntityList {
  // エンティティ名
  entityName: string;
}

/** コード値取得API（コード管理マスタ以外）レスポンス */
export interface ScrMem9999GetCodeValueResponse {
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

/** 事業拠点契約コース・サービス一覧取得APIリクエスト */
export interface ScrMem0010GetContractRequest {
  // 法人ID
  corporationId: string;
  // 事業拠点ID
  businessBaseId: string;
  // 業務日付
  businessDate: Date;
  // リミット
  limit: string;
}

/** 事業拠点契約コース・サービス一覧取得APIレスポンス */
export interface ScrMem0010GetContractResponse {
  // 【四輪】制限件数
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
  // リスト（四輪）
  list1: ListResult[];
  // リスト（二輪）
  list2: ListResult[];
}

// リスト
export interface ListResult {
  // 契約ID
  contractId: string;
  // 会費合計
  feeTotal: number;
  // 変更予約フラグ
  changeReservationFlag: boolean;
  // 請求先ID
  billingId: string;
  // 請求方法区分
  claimMethodKind: string;
  // コース名
  courseName: string;
  // コース参加区分
  courseEntryKind: string;
  // コース会費
  courseFeeTotal: number;
  // コース会費値引値増フラグ
  courseFeeDiscountFlag: boolean;
  // 利用開始日（コース）
  courseUseStartDate: string;
  // サービス名
  serviceName: string;
  // 契約本数
  contractCount: number;
  // オプション会費合計
  optionFeeTotal: number;
  // オプション会費合計値引値増フラグ
  optionFeeTotalDiscountFlag: boolean;
  // 利用開始日
  optionUseStartDate: string;
}

/** 事業拠点契約コース・サービス一覧取得API */
export const ScrMem0010GetContract = async (
  request: ScrMem0010GetContractRequest
): Promise<ScrMem0010GetContractResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0010/get-contract',
    request
  );
  return response.data;
};

/** 営業担当情報取得APIリクエスト */
export interface ScrMem0010GetEmployeeRequest {
  // 業務日付
  businessDate: Date;
}

/** 営業担当情報取得APIレスポンス */
export interface ScrMem0010GetEmployeeResponse {
  tvaaContractInfo: ContractResult[];
  bikeContractInfo: ContractResult[];
}

// リスト
export interface ContractResult {
  salesId: string;
  salesName: string;
}

/** 営業担当情報取得API */
export const ScrMem0010GetEmployee = async (
  request: ScrMem0010GetEmployeeRequest
): Promise<ScrMem0010GetEmployeeResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0010/get-employee',
    request
  );
  return response.data;
};

/** 事業拠点基本情報入力チェックAPIリクエスト */
export interface ScrMem0010InputCheckBusinessBaseRequest {
  // 法人ID
  corporationId: string;
  // 事業拠点ID
  businessBaseId: string;
  // 事業拠点法人情報同期フラグ
  businessBaseCorporationInformationSynchronizationFlag: boolean;
  // 事業拠点郵便番号
  businessBaseZipCode: string;
  // 事業拠点都道府県コード
  businessBasePrefectureCode: string;
  // 事業拠点市区町村
  businessBaseMunicipalities: string;
  // 事業拠点番地号建物名
  businessBaseAddressBuildingName: string;
  // 事業拠点電話番号
  businessBasePhoneNumber: string;
}

/** 事業拠点基本情報入力チェックAPIレスポンス */
export interface ScrMem0010InputCheckBusinessBaseResponse {
  errorList: errorResult[];
  warnList: errorResult[];
}

// リスト
export interface errorResult {
  errorCode: string;
  errorMessage: string;
  detail: string;
}

/** 事業拠点基本情報入力チェックAPI */
export const ScrMem0010InputCheckBusinessBase = async (
  request: ScrMem0010InputCheckBusinessBaseRequest
): Promise<ScrMem0010InputCheckBusinessBaseResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0010/input-check-business-base',
    request
  );
  return response.data;
};

/** 事業拠点登録APIレスポンス */
export interface ScrMem0010RegistrationBusinessBaseRequest {
  // 法人ID
  corporationId: string;
  // 事業拠点ID
  businessBaseId: string;
  // 事業拠点法人情報同期フラグ
  businessBaseCorporationInformationSynchronizationFlag: boolean;
  // 事業拠点名称
  businessBaseName: string;
  // 事業拠点名称カナ
  businessBaseNameKana: string;
  // 事業拠点郵便番号
  businessBaseZipCode: string;
  // 事業拠点都道府県コード
  businessBasePrefectureCode: string;
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
  // 四輪営業担当ID
  tvaaSalesStaff: string;
  // 二輪営業担当ID
  bikeSalesStaff: string;
  // 【四輪】返却件数
  tvaaResponseCount: number;
  // 【二輪】返却件数
  bikeResponseCount: number;
  // リスト
  tvaaList: ListResult[];
  // リスト
  bikeList: ListResult[];
  // 申請従業員ID
  applicationEmployeeId: string;
  // 変更予定日
  changeExpectDate: Date;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
}

/** 事業拠点登録API */
export const ScrMem0010RegistrationBusinessBase = async (
  request: ScrMem0010RegistrationBusinessBaseRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/scr-mem-0010/registration-business-base',
    request
  );
  return null;
};

