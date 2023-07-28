import { comApiClient } from 'providers/ApiClient';

/** API-COM-9999-0002: 親組織ID情報取得API リクエスト */
export interface ScrCom9999GetParentorganizationidListboxRequest {
  /** 業務日付 */
  businessDate: string;
}

/** API-COM-9999-0002: 親組織ID情報取得API レスポンス */
export interface ScrCom9999GetParentorganizationidListboxResponse {
  // リスト
  searchGetParentorganizationidListbox: SearchGetParentorganizationidListbox[];
}

/** API-COM-9999-0002: 親組織ID情報取得API レスポンス(リスト行) */
export interface SearchGetParentorganizationidListbox {
  // 親組織ID
  parentOrganizationId: string;
  // 部署名称
  organizationName: string;
}

/** API-COM-9999-0002: 親組織ID情報取得API */
export const ScrCom9999GetParentorganizationidListbox = async (
  request: ScrCom9999GetParentorganizationidListboxRequest
): Promise<ScrCom9999GetParentorganizationidListboxResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-parentorganizationid',
    request
  );
  return response.data;
};

/** API-COM-9999-0003: 組織ID情報取得API リクエスト */
export interface ScrCom9999GetOrganizationidListboxRequest {
  /** 業務日付 */
  businessDate: string;
}

/** API-COM-9999-0003: 組織ID情報取得API レスポンス */
export interface ScrCom9999GetOrganizationidListboxResponse {
  // リスト
  searchGetOrganizationidListbox: SearchGetOrganizationidListbox[];
}

/** API-COM-9999-0003: 組織ID情報取得API レスポンス(リスト行) */
export interface SearchGetOrganizationidListbox {
  // 組織ID
  organizationId: string;
  // 部署名称
  organizationName: string;
}

/** API-COM-9999-0003: 組織ID情報取得API */
export const ScrCom9999GetOrganizationidListbox = async (
  request: ScrCom9999GetOrganizationidListboxRequest
): Promise<ScrCom9999GetOrganizationidListboxResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-organizationid-listbox',
    request
  );
  return response.data;
};

/** API-COM-9999-0004: 画面権限ID情報取得API レスポンス */
export interface ScrCom9999GetScreenpermissionidListboxResponse {
  // リスト
  searchGetScreenpermissionidListbox: SearchGetScreenpermissionidListbox[];
}

/** API-COM-9999-0004: 画面権限ID情報取得API レスポンス(リスト行) */
export interface SearchGetScreenpermissionidListbox {
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
}

/** API-COM-9999-0004: 画面権限ID情報取得API */
export const ScrCom9999GetScreenpermissionidListbox = async (
  request: null
): Promise<ScrCom9999GetScreenpermissionidListboxResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-screenpermissionid',
    request
  );
  return response.data;
};

/** API-COM-9999-0005: マスタ権限ID情報取得API レスポンス */
export interface ScrCom9999GetMasterpermissionidListboxResponse {
  // リスト
  searchGetMasterpermissionidListbox: SearchGetMasterpermissionidListbox[];
}

/** API-COM-9999-0005: マスタ権限ID情報取得API レスポンス(リスト行) */
export interface SearchGetMasterpermissionidListbox {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
}

/** API-COM-9999-0005: マスタ権限ID情報取得API */
export const ScrCom9999GetMasterpermissionidListbox = async (
  request: null
): Promise<ScrCom9999GetMasterpermissionidListboxResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-masterpermissionid-listbox',
    request
  );
  return response.data;
};

/** API-COM-9999-0006: 承認権限ID情報取得API レスポンス */
export interface ScrCom9999GetApprovalPermissionIdListboxResponse {
  // リスト
  searchGetApprovalPermissionIdListbox: SearchGetApprovalPermissionIdListbox[];
}

/** API-COM-9999-0006: 承認権限ID情報取得API レスポンス(リスト行) */
export interface SearchGetApprovalPermissionIdListbox {
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
}

/** API-COM-9999-0006: 承認権限ID情報取得API */
export const ScrCom9999GetApprovalPermissionIdListbox = async (
  request: null
): Promise<ScrCom9999GetApprovalPermissionIdListboxResponse> => {
  const response = await comApiClient.post(
    ' /scr-com-9999/get-approvalpermissionid',
    request
  );
  return response.data;
};

/** API-COM-9999-0007: 所属組織IDリストボックス情報取得API レスポンス */
export interface ScrCom9999GetBelongOrganizationIdListboxResponse {
  // リスト
  searchGetBelongOrganizationIdListbox: SearchGetBelongOrganizationIdListbox[];
}

/** API-COM-9999-0007: 所属組織IDリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetBelongOrganizationIdListbox {
  // 組織ID
  organizationId: string;
  // 部署名称
  organizationName: string;
}

/** API-COM-9999-0007: 所属組織IDリストボックス情報取得API */
export const ScrCom9999GetBelongOrganizationIdListbox = async (
  request: null
): Promise<ScrCom9999GetBelongOrganizationIdListboxResponse> => {
  const response = await comApiClient.post(
    ' /scr-com-9999/get-organizationid-listbox',
    request
  );
  return response.data;
};

/** API-COM-9999-0008: 所属役職IDリストボックス情報取得API レスポンス */
export interface ScrCom9999GetPostIdListboxResponse {
  // リスト
  searchGetPostIdListbox: SearchGetPostIdListbox[];
}

/** API-COM-9999-0008: 所属役職IDリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetPostIdListbox {
  // 役職ID
  postId: string;
  // 役職名
  postName: string;
}

/** API-COM-9999-0008: 所属役職IDリストボックス情報取得API */
export const ScrCom9999GetPostIdListbox = async (
  request: null
): Promise<ScrCom9999GetPostIdListboxResponse> => {
  const response = await comApiClient.post(
    ' /scr-com-9999/get-postid-listbox',
    request
  );
  return response.data;
};

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API リクエスト */
export interface ScrCom9999GetCodeManagementMasterListboxRequest {
  /** 業務日付 */
  businessDate?: string;
  /** コードID */
  codeId: string;
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンス */
export interface ScrCom9999GetCodeManagementMasterListboxResponse {
  // リスト
  searchGetCodeManagementMasterListbox: SearchGetCodeManagementMasterListbox[];
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetCodeManagementMasterListbox {
  // コード値
  codeValue: string;
  // コード名称
  codeName: string;
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API */
export const ScrCom9999GetCodeManagementMasterListbox = async (
  request: ScrCom9999GetCodeManagementMasterListboxRequest
): Promise<ScrCom9999GetCodeManagementMasterListboxResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-code-management-master-listbox',
    request
  );
  return response.data;
};

/** API-COM-9999-0012: 計算書種別情報取得API リクエスト */
export interface ScrCom9999GetStatementKindRequest {
  /** 手数料ID */
  commissionId: string;
  /** 業務日付 */
  businessDate: string;
}

/** API-COM-9999-0012: 計算書種別情報取得API レスポンス */
export interface ScrCom9999GetStatementKindResponse {
  /** 変更予定日情報 リスト */
  statementKindList: statementKindList[];
}

/** API-COM-9999-0012: 計算書種別情報取得API レスポンス (リスト行) */
export interface statementKindList {
  /** 計算書種別コード */
  codeValue: string;
  /** 計算書種別名称 */
  codeName: string;
}

/** API-COM-9999-0012: 計算書種別情報取得API */
export const ScrCom9999GetStatementKind = async (
  request?: ScrCom9999GetStatementKindRequest
): Promise<ScrCom9999GetStatementKindResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-statement-kind',
    request
  );
  return response.data;
};

/**  API-COM-9999-0013: 手数料条件情報取得API リクエスト */
export interface ScrCom9999GetCommissionConditionRequest {
  /** 手数料ID */
  commissionId: string;
  /** 業務日付 */
  businessDate: string;
}

/**  API-COM-9999-0013: 手数料条件情報取得API レスポンス */
export interface ScrCom9999GetCommissionConditionResponse {
  /** 手数料条件 リスト */
  commissionConditionList: comCommissionConditionList[];
}

/**  API-COM-9999-0013: 手数料条件情報取得API レスポンス (リスト行) */
export interface comCommissionConditionList {
  /** 手数料条件コード */
  codeValue: string;
  /** 手数料条件名称 */
  codeName: string;
}

/** API-COM-9999-0013: 手数料条件情報取得API */
export const ScrCom9999GetCommissionCondition = async (
  request?: ScrCom9999GetCommissionConditionRequest
): Promise<ScrCom9999GetCommissionConditionResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-commission-condition',
    request
  );
  return response.data;
};

/** API-COM-9999-0016: 会場マスタリストボックス情報取得API リクエスト */
export interface ScrCom9999GetPlaceMasterListboxRequest {
  /** 業務日付 */
  businessDate: string;
}

/** API-COM-9999-0016: 会場マスタリストボックス情報取得API レスポンス */
export interface ScrCom9999GetPlaceMasterListboxResponse {
  // リスト
  searchGetPlaceMasterListbox: SearchGetPlaceMasterListbox[];
}

/** API-COM-9999-0016: 会場マスタリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetPlaceMasterListbox {
  // 会場コード
  value: string;
  // 会場名
  displayValue: string;
}

/** API-COM-9999-0016: 会場マスタリストボックス情報取得API */
export const ScrCom9999GetPlaceMasterListbox = async (
  request: ScrCom9999GetPlaceMasterListboxRequest
): Promise<ScrCom9999GetPlaceMasterListboxResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-place-master-listbox',
    request
  );
  return response.data;
};

/** API-COM-9999-0017: 銀行名リストボックス リクエスト */
export interface ScrCom9999GetBankMasterListboxRequest {
  /** 業務日付 */
  businessDate: string;
}

/** API-COM-9999-0017: 銀行名リストボックス レスポンス */
export interface ScrCom9999GetBankMasterListboxResponse {
  // リスト
  searchGetBankMasterListbox: SearchGetBankMasterListbox[];
}

/** API-COM-9999-0017: 銀行名リストボックス レスポンス(リスト行) */
export interface SearchGetBankMasterListbox {
  // 銀行コード
  value: string;
  // 銀行名
  displayValue: string;
}

/** API-COM-9999-0017: 銀行名リストボックス情報取得API */
export const ScrCom9999GetBankMasterListbox = async (
  request: ScrCom9999GetBankMasterListboxRequest
): Promise<ScrCom9999GetBankMasterListboxResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-bank-master-listbox',
    request
  );
  return response.data;
};

/** API-COM-9999-0018: 支店名リストボックス情報取得API リクエスト */
export interface ScrCom9999GetBranchMasterRequest {
  /** 銀行コード */
  bankCode: string;
  /** 業務日付 */
  businessDate: string;
}

/** API-COM-9999-0018: 支店名リストボックス情報取得API レスポンス */
export interface ScrCom9999GetBranchMasterResponse {
  // リスト
  searchGetBranchMaster: searchGetBranchMaster[];
}

/** API-COM-9999-0018: 支店名リストボックス情報取得API レスポンス(リスト行) */
export interface searchGetBranchMaster {
  // 支店コード
  value: string;
  // 支店名
  displayValue: string;
}

/** API-COM-9999-0018: 支店名リストボックス情報取得API */
export const ScrCom9999GetBranchMaster = async (
  request: ScrCom9999GetBranchMasterRequest
): Promise<ScrCom9999GetBranchMasterResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-branch-master',
    request
  );
  return response.data;
};

/** API-COM-9999-0020: 値属性変換API リクエスト */
export interface ScrCom9999ValueAttributeConversionListRequest {
  /** 条件種類コード */
  conditionKindCode: string;
}

/** API-COM-9999-0020: 値属性変換API レスポンス */
export interface ScrCom9999ValueAttributeConversionListResponse {
  // 型区分
  typeKind: string;
  // リスト
  commissionDiscountConditionValueList: CommissionDiscountConditionValueList[];
}

/** API-COM-9999-0020: 値属性変換API レスポンス(リスト行) */
export interface CommissionDiscountConditionValueList {
  // 手数料条件値ID
  commissionConditionID: string;
  // 手数料条件値
  commissionConditionValue: string;
}

/** API-COM-9999-0020: 値属性変換API */
export const ScrCom9999ValueAttributeConversionListbox = async (
  request: ScrCom9999ValueAttributeConversionListRequest
): Promise<ScrCom9999ValueAttributeConversionListResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/value-attribute-conversion',
    request
  );
  return response.data;
};

/** API-COM-9999-0021: コース名情報取得API レスポンス */
export interface ScrCom9999GetCoursenameResponse {
  // コードリスト
  courceList: courceList[];
}

/** API-COM-9999-0021: コース名情報取得API レスポンス リスト行 */
export interface courceList {
  // コード値
  codeValue: string;
  // コード名称
  codeName: string;
}

/** API-COM-9999-0021: コース名情報取得API */
export const ScrCom9999GetCoursename =
  async (): Promise<ScrCom9999GetCoursenameResponse> => {
    const response = await comApiClient.post('/scr-com-9999/get-coursename');
    return response.data;
  };

/** API-COM-9999-0022: サービス名情報取得API レスポンス */
export interface ScrCom9999GetServiceInfoResponse {
  // サービスリスト
  serviceList: serviceList[];
}

/** API-COM-9999-0022: サービス名情報取得API レスポンス リスト行 */
export interface serviceList {
  // コード値
  codeValue: string;
  // コード名称
  codeName: string;
}

/** API-COM-9999-0022: サービス名情報取得API */
export const ScrCom9999GetServiceInfo =
  async (): Promise<ScrCom9999GetServiceInfoResponse> => {
    const response = await comApiClient.post(' /scr-com-9999/get-servicename');
    return response.data;
  };

/** API-COM-9999-0024: 住所情報取得表示API リクエスト */
export interface ScrCom9999GetAddressInfoRequest {
  // 郵便番号
  zipCode: string;
}

/** API-COM-9999-0024: 住所情報取得表示API レスポンス */
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

/** API-COM-9999-0024: 住所情報取得表示API */
export const ScrCom9999GetAddressInfo = async (
  request: ScrCom9999GetAddressInfoRequest
): Promise<ScrCom9999GetAddressInfoResponse> => {
  const response = await comApiClient.post('/scr/get-address-info', request);
  return response.data;
};

/** API-COM-9999-0025: 変更履歴情報取得API リクエスト */
export interface ScrCom9999GetHistoryInfoRequest {
  // 変更履歴番号
  changeHistoryNumber: string;
}

/** API-COM-9999-0025: 変更履歴情報取得API レスポンス */
export interface ScrCom9999GetHistoryInfoResponse {
  // 変更履歴情報
  changeHistoryInfo: Map<string, object>;
}

/** API-COM-9999-0025: 変更履歴情報取得API */
export const ScrCom9999GetHistoryInfo = async (
  request: ScrCom9999GetHistoryInfoRequest
): Promise<ScrCom9999GetHistoryInfoResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-change-date',
    request
  );
  return response.data;
};

/** API-COM-9999-0026: 変更予定日取得API リクエスト */
export interface ScrCom9999GetChangeDateRequest {
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
  // マスタID
  masterId: string;
  // 業務日付
  businessDate: Date;
}

/** API-COM-9999-0026: 変更予定日取得API レスポンス */
export interface ScrCom9999GetChangeDateResponse {
  // リスト
  changeExpectDateInfo: ChangeExpectDateInfo[];
}

/** API-COM-9999-0026: 変更予定日取得API レスポンス(リスト行) */
export interface ChangeExpectDateInfo {
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectDate: Date;
}

/** API-COM-9999-0026: 変更予定日取得API */
export const ScrCom9999GetChangeDatebox = async (
  request: ScrCom9999GetChangeDateRequest
): Promise<ScrCom9999GetChangeDateResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-change-date',
    request
  );
  return response.data;
};

/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） リクエスト */
export interface ScrCom9999GetCodeValueListRequest {
  // リスト
  entityList: EntityList[];
}

export interface EntityList {
  // エンティティ名
  entityName: string;
}

/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） レスポンス */
export interface ScrCom9999GetCodeValueListResponse {
  // リスト
  resultList: ResultList[];
}

/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） レスポンス(リスト行) */
export interface ResultList {
  // エンティティ名
  entityName: string;
  // リスト
  codeValueList: CodeValueList[];
}

/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） レスポンス(リストネスト行) */
export interface CodeValueList {
  // コード値
  codeValue: string;
  // コード値名称
  codeValueName: string;
  // コード値名称カナ
  codeValueNameKana: string;
}

/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） */
export const ScrCom9999GetCodeValueListbox = async (
  request: ScrCom9999GetCodeValueListRequest
): Promise<ScrCom9999GetCodeValueListResponse> => {
  const response = await comApiClient.post(
    '/scr-com-9999/get-code-value',
    request
  );
  return response.data;
};
