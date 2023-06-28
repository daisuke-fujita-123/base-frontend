import { memApiClient } from 'providers/ApiClient';

/** 法人基本情報取得APIリクエスト */
export interface ScrMem0010GetMemberRequest {
  // 法人ID
  corporationId: string;
  // 業務日付
  businessDate: Date;
}

/** 法人基本情報取得APIレスポンス */
export interface ScrMem0010GetMemberResponse {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 法人郵便番号
  corporationZipCode: string;
  // 法人都道府県コード 
  corporationPrefectureCode: string;
  // 法人市区町村
  corporationMunicipalities: string;
  // 法人番地号建物名
  corporationAddressBuildingName: string;
  // 住所
  corporationAddress: string;
  // 法人電話番号
  corporationPhoneNumber: string;
  // 法人FAX番号
  corporationFaxNumber: string;
  // 会員メモ
  memberMemo: string;
}

/** 法人基本情報取得API */
export const ScrMem0010GetMember = async (
  request: ScrMem0010GetMemberRequest
): Promise<ScrMem0010GetMemberResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0010/get-member',
    request
  );
  return response.data;
};

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

/** 事業拠点契約コース・サービス一覧取得APIリクエスト */
export interface ScrMem0010GetContractRequest {
  // 事業拠点ID
  businessBaseId: string;
  // 業務日付
  businessDate: Date;
  // リミット
  limit: string;
}

/** 事業拠点契約コース・サービス一覧取得APIレスポンス */
export interface ScrMem0010GetContractResponse {
  // リミット（四輪）
  tvaaLimit: number;		
  // オフセット（四輪）
  tvaaOffset: number;
  // 件数（四輪）
  tvaaCount: number;
  // リミット（二輪）
  bikeLimit: number;
  // オフセット（二輪）
  bikeOffset: number;
  // 件数（二輪）
  bikeCount: number;
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
  // 変更予約
  changeReservationFlag: boolean;
  // 請求先ID
  billingId: string;
  // 会費請求方法
  claimMethodKind: string;
  // コース名
  courseName: string;
  // 参加区分
  courseEntryKind: string;
  // コース会費 
  courseFeeTotal: number;
  // 利用開始日
  courseUseStartDate: string;
  // オプションサービス
  serviceName: string;
  // 数量
  contractCount: number;
  // オプションサービス会費合計
  optionFeeTotal: number;
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
  tvaaContractInfo:ContractResult[],
  bikeContractInfo:ContractResult[]
}

// リスト
export interface ContractResult {
  'salesId':string;
  'salesName':string;
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
  // 変更フラグ
  changeFlag: boolean;
}

/** 事業拠点基本情報入力チェックAPIレスポンス */
export interface ScrMem0010InputCheckBusinessBaseResponse {
  errorList:errorResult[],
  warnList:errorResult[]
}

// リスト
export interface errorResult {
  'errorCode':string;
  'errorMessage':string;
  'detail':string;
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
export interface ScrMem0010RegistrationBusinessBaseResponse {
  // 法人ID
  corporationId: string;
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
  // リミット（四輪）
  tvaaLimit: number;		
  // オフセット（四輪）
  tvaaOffset: number;
  // 件数（四輪）
  tvaaCount: number;
  // リミット（二輪）
  bikeLimit: number;
  // オフセット（二輪）
  bikeOffset: number;
  // 件数（二輪）
  bikeCount: number;
  // リスト（四輪）
  list1: ListResult[];
  // リスト（二輪）
  list2: ListResult[];
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

/** 事業拠点登録API */
export const ScrMem0010RegistrationBusinessBase = async (
  request: ScrMem0010RegistrationBusinessBaseResponse
) => {
  const response = await memApiClient.post(
    '/scr-mem-0010/registration-business-base',
    request
  );
  return;
};
