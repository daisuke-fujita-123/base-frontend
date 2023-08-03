import { memApiClient } from 'providers/ApiClient';

/** 請求先契約情報取得APIリクエスト */
export interface ScrMem9999GetBillingContractRequest {
  // 法人ID
  corporationId: string;
  // 業務日付
  businessDate: Date;
}

/** 請求先契約情報取得APIレスポンス */
export interface ScrMem9999GetBillingContractResponse {
  // 契約IDリスト
  contractIdList: string[];
}

/** API-MEM-9999-0001:請求先契約情報取得API */
export const ScrMem9999GetBillingContract = async (
  request: ScrMem9999GetBillingContractRequest
): Promise<ScrMem9999GetBillingContractResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-billing-contract',
    request
  );
  return response.data;
};

/** 請求先情報取得APIリクエスト */
export interface ScrMem9999GetBillRequest {
  // 法人ID
  corporationId: string;
}

/** 請求先情報取得APIレスポンス */
export interface ScrMem9999GetBillResponse {
  // 請求先IDリスト
  list: string[];
}

/** API-MEM-9999-0010:請求先情報取得API */
export const ScrMem9999GetBill = async (
  request: ScrMem9999GetBillRequest
): Promise<ScrMem9999GetBillResponse> => {
  const response = await memApiClient.post('/scr-mem-9999/get-bill', request);
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

/** API-MEM-9999-0011:事業拠点一覧取得機能API */
export const ScrMem9999GetBusinessInfo = async (
  request: ScrMem9999GetBusinessInfoRequest
): Promise<ScrMem9999GetBusinessInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-business-info',
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

// エンティティリスト
export interface CodeValueList {
  // コード値
  codeValue: string;
  // コード値名称
  codeValueName: string;
  // コード値名称カナ
  codeValueNameKana: string;
}

/** API-MEM-9999-0014:コード値取得API（コード管理マスタ以外） */
export const ScrMem9999GetCodeValue = async (
  request: ScrMem9999GetCodeValueRequest
): Promise<ScrMem9999GetCodeValueResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-code-value',
    request
  );
  return response.data;
};

/** コード値取得API（コード管理マスタ以外）リクエスト */
export interface ScrMem9999GetEmployeeFromDistrictRequest {
  // 法人ID
  corporationId: string;
}

/** コード値取得API（コード管理マスタ以外）レスポンス */
export interface ScrMem9999GetEmployeeFromDistrictResponse {
  // 四輪営業担当情報
  tvaaSalesInfo: SalesInfo[];
  // 二輪営業担当情報
  bikeSalesInfo: SalesInfo[];
}

// 営業担当情報
export interface SalesInfo {
  // 営業担当ID
  salesId: string;
  // 営業担当名
  salesName: string;
}

/** API-MEM-9999-0017:営業担当情報取得API（物流拠点マスタ） */
export const ScrMem9999GetEmployeeFromDistrict = async (
  request: ScrMem9999GetEmployeeFromDistrictRequest
): Promise<ScrMem9999GetEmployeeFromDistrictResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-employee-from-district',
    request
  );
  return response.data;
};

/** 営業担当情報取得API（事業拠点マスタ）リクエスト */
export interface ScrMem9999GetEmployeeFromBusinessBaseRequest {
  // 法人ID
  corporationId: string;
}

/** 営業担当情報取得API（事業拠点マスタ）レスポンス */
export interface ScrMem9999GetEmployeeFromBusinessBaseResponse {
  // 四輪営業担当情報
  tvaaSalesInfo: SalesInfo[];
  // 二輪営業担当情報
  bikeSalesInfo: SalesInfo[];
}

/** API-MEM-9999-0018:営業担当情報取得API（事業拠点マスタ） */
export const ScrMem9999GetEmployeeFromBusinessBase = async (
  request: ScrMem9999GetEmployeeFromBusinessBaseRequest
): Promise<ScrMem9999GetEmployeeFromBusinessBaseResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-employee-from-business-base',
    request
  );
  return response.data;
};

/** 物流拠点代表契約ID取得APIリクエスト */
export interface ScrMem9999GetLogisticsBaseRepresentativeContractRequest {
  // 法人ID
  corporationId: string;
}

/** 物流拠点代表契約ID取得APIレスポンス */
export interface ScrMem9999GetLogisticsBaseRepresentativeContractResponse {
  // 物流拠点代表契約IDリスト
  logisticsBaseRepresentativeContractIdList: string[];
}

/** API-MEM-9999-0019:物流拠点代表契約ID取得API */
export const ScrMem9999GetLogisticsBaseRepresentativeContract = async (
  request: ScrMem9999GetLogisticsBaseRepresentativeContractRequest
): Promise<ScrMem9999GetLogisticsBaseRepresentativeContractResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-logistics-base-representative-contract',
    request
  );
  return response.data;
};

/** 帳票出力APIリクエスト */
export interface ScrMem9999OutputReportRequest {
  // 画面ID
  screenId: string;
  // 帳票ID
  reportId: string;
  // 帳票名
  reportName: string;
  // 帳票出力従業員ID
  outputReportEmployeeId: string;
  // 帳票出力従業員名
  outputReportEmployeeName: string;
  // コメント
  comment: string;
  // 帳票作成パラメータ情報
  createReportParameterInfo: any;
}

/** 帳票出力APIレスポンス */
export interface ScrMem9999OutputReportResponse {
  // 帳票ファイル名
  reportFileName: string;
}

/** API-MEM-9999-0020:帳票出力API */
export const ScrMem9999OutputReport = async (
  request: ScrMem9999OutputReportRequest
): Promise<ScrMem9999OutputReportResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/output-report',
    request
  );
  return response.data;
};

/** 法人基本情報取得APIリクエスト */
export interface ScrMem9999GetCorpBasicInfoRequest {
  // 法人ID
  corporationId: string;
}

/** 法人基本情報取得APIレスポンス */
export interface ScrMem9999GetCorpBasicInfoResponse {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 住所
  address: string;
  // 法人郵便番号
  corporationZipCode: string;
  // 法人都道府県コード
  corporationPrefectureCode: string;
  // 法人都道府県名称
  corporationPrefectureName: string;
  // 法人市区町村
  corporationMunicipalities: string;
  // 法人番地号建物名
  corporationAddressBuildingName: string;
  // 法人電話番号
  corporationPhoneNumber: string;
  // 法人FAX番号
  corporationFaxNumber: string;
  // 会員メモ
  memberMemo: string;
}

/** API-MEM-9999-0022:法人基本情報取得API */
export const ScrMem9999GetCorpBasicInfo = async (
  request: ScrMem9999GetCorpBasicInfoRequest
): Promise<ScrMem9999GetCorpBasicInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-corp-basic-info',
    request
  );
  return response.data;
};

/** 検索条件絞込APIリクエスト */
export interface ScrMem9999SearchconditionRefineRequest {
  // 契約ID
  contractId: string;
  // 法人ID
  corporationId: string;
  // 請求先ID
  billingId: string;
}

/** 検索条件絞込APIレスポンス */
export interface ScrMem9999SearchconditionRefineResponse {
  // 法人リスト
  corporationList: CorporationList[];
  // 請求先ID
  billingId: string[];
  // 契約ID
  contractId: string[];
}

export interface CorporationList {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
}

/** API-MEM-9999-0023:検索条件絞込API*/
export const ScrMem9999SearchconditionRefine = async (
  request: ScrMem9999SearchconditionRefineRequest
): Promise<ScrMem9999SearchconditionRefineResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/searchcondition-refine',
    request
  );
  return response.data;
};

/** 営業担当情報取得API(市区郡マスタ)レスポンス */
export interface ScrMem9999GetEmployeeResponse {
  // 四輪営業担当リスト
  tvaaSalesInfo: List[];
  // 二輪営業担当リスト
  bikeSalesInfo: List[];
}

export interface List {
  // 営業担当ID
  salesId: string;
  // 営業担当名
  salesName: string;
}

/** API-MEM-9999-0024:営業担当情報取得API(市区郡マスタ)*/
export const ScrMem9999GetEmployee =
  async (): Promise<ScrMem9999GetEmployeeResponse> => {
    const response = await memApiClient.post('/scr-mem-9999/get-employee');
    return response.data;
  };

/** 法人グループ取得APIレスポンス */
export interface ScrMem9999GetCorporationGroupResponse {
  // 法人グループリスト
  corporationGroupList: CorporationGroupList[];
}

// 法人グループリスト
export interface CorporationGroupList {
  // 法人グループID
  corporationGroupId: string;
  // 法人グループ名
  corporationGroupName: string;
}

/** API-MEM-9999-0025:法人グループ取得API*/
export const ScrMem9999GetCorporationGroup =
  async (): Promise<ScrMem9999GetCorporationGroupResponse> => {
    const response = await memApiClient.post(
      '/scr-mem-9999/get-corporation-group'
    );
    return response.data;
  };
