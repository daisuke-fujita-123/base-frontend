import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { comApiClient } from 'providers/ApiClient';

// API-COM-0025-0001：組織情報一覧取得API レスポンス
export interface ScrCom0025GetOrganizationListResponse {
  // リスト
  organizationList: SearchResult[];
}

// 組織情報一覧取得API レスポンス（リスト行）
export interface SearchResult {
  // 項目内Id(hrefs)
  id: string;
  // 組織ID
  organizationId: string;
  // 部署名称
  organizationName: string;
  // 親組織ID
  parentOrganizationId: string;
  // 部署階層名称
  organizationClassName: string;
  // 営業担当フラグ
  salesStaffFlag: boolean;
  // 検査員フラグ
  inspectorFlag: boolean;
  // 適用開始日
  applyingStartDate: string;
  // 適用終了日
  applyingEndDate: string;
  // 変更理由
  changeReason: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
}

// COM-0025-0001：組織情報一覧取得API
export const getOrganizationList = async (
  req: null
): Promise<ScrCom0025GetOrganizationListResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/get-organizationlist',
    req
  );
  return response.data;
};

// API-COM-0025-0002：役職情報一覧取得API レスポンス
export interface ScrCom0025GetPositionListResponse {
  // リスト
  positionList: SearchPositionListResult[];
}

// 役職情報一覧取得API レスポンス（リスト行）
export interface SearchPositionListResult {
  // 項目内Id(hrefs)
  id: string;
  // 役職ID
  postId: string;
  // 役職名
  postName: string;
  // 組織ID
  organizationId: string;
  // 部署名称
  organizationname: string;
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 適用開始日
  applyingStartDate: string;
  // 適用終了日
  applyingEndDate: string;
  // 変更理由
  changeReason: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
}

// COM-0025-0002：役職情報一覧取得API
export const getPositionList = async (
  req: null
): Promise<ScrCom0025GetPositionListResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/get-positionlist',
    req
  );
  return response.data;
};

// API-COM-0025-0003：従業員情報一覧取得API レスポンス
export interface ScrCom0025GetEmployeeListResponse {
  // リスト
  employeeList: SearchEmployeeListResult[];
}

// 従業員情報一覧取得API レスポンス（リスト行）
export interface SearchEmployeeListResult {
  // 項目内Id(hrefs)
  id: string;
  // 従業員ID
  employeeId: string;
  // 従業員名
  employeeName: string;
  // 従業員メールアドレス
  employeeMailAddress: string;
  // 所属
  belong: string;
  // SalesForceID
  salesForceId: string;
  // 変更理由
  changeReason: string;
  // 変更タイムスタンプ
  beforeTimestamp: string;
  // 組織ID_1
  organizationId_1: string;
  // 部署名称_1
  organizationName_1: string;
  // 役職ID_1
  postId_1: string;
  // 役職名_1
  postName_1: string;
  // 画面権限ID_1
  screenPermissionId_1: string;
  // 画面権限名_1
  screenPermissionName_1: string;
  // マスタ権限ID_1
  masterPermissionId_1: string;
  // マスタ権限名_1
  masterPermissionName_1: string;
  // 承認権限ID_1
  approvalPermissionId_1: string;
  // 承認権限名_1
  approvalPermissionName_1: string;
  // 適用開始日_1
  applyingStartDate_1: string;
  // 適用終了日_1
  applyingEndDate_1: string;
  // 変更タイムスタンプ_1
  beforeTimestamp_1: string;
  // 組織ID_2
  organizationId_2: string;
  // 部署名称_2
  organizationName_2: string;
  // 役職ID_2
  postId_2: string;
  // 役職名_2
  postName_2: string;
  // 画面権限ID_2
  screenPermissionId_2: string;
  // 画面権限名_2
  screenPermissionName_2: string;
  // マスタ権限ID_2
  masterPermissionId_2: string;
  // マスタ権限名_2
  masterPermissionName_2: string;
  // 承認権限ID_2
  approvalPermissionId_2: string;
  // 承認権限名_2
  approvalPermissionName_2: string;
  // 適用開始日_2
  applyingStartDate_2: string;
  // 適用終了日_2
  applyingEndDate_2: string;
  // 変更タイムスタンプ_2
  beforeTimestamp_2: string;
  // 組織ID_3
  organizationId_3: string;
  // 部署名称_3
  organizationName_3: string;
  // 役職ID_3
  postId_3: string;
  // 役職名_3
  postName_3: string;
  // 画面権限ID_3
  screenPermissionId_3: string;
  // 画面権限名_3
  screenPermissionName_3: string;
  // マスタ権限ID_3
  masterPermissionId_3: string;
  // マスタ権限名_3
  masterPermissionName_3: string;
  // 承認権限ID_3
  approvalPermissionId_3: string;
  // 承認権限名_3
  approvalPermissionName_3: string;
  // 適用開始日_3
  applyingStartDate_3: string;
  // 適用終了日_3
  applyingEndDate_3: string;
  // 変更タイムスタンプ_3
  beforeTimestamp_3: string;
  // 組織ID_4
  organizationId_4: string;
  // 部署名称_4
  organizationName_4: string;
  // 役職ID_4
  postId_4: string;
  // 役職名_4
  postName_4: string;
  // 画面権限ID_4
  screenPermissionId_4: string;
  // 画面権限名_4
  screenPermissionName_4: string;
  // マスタ権限ID_4
  masterPermissionId_4: string;
  // マスタ権限名_4
  masterPermissionName_4: string;
  // 承認権限ID_4
  approvalPermissionId_4: string;
  // 承認権限名_4
  approvalPermissionName_4: string;
  // 適用開始日_4
  applyingStartDate_4: string;
  // 適用終了日_4
  applyingEndDate_4: string;
  // 変更タイムスタンプ_4
  beforeTimestamp_4: string;
}

// COM-0025-0003：従業員情報一覧取得API
export const getEmployeeList = async (
  req: null
): Promise<ScrCom0025GetEmployeeListResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/get-employeelist',
    req
  );
  return response.data;
};

/** SCR-COM-0025-0004: 組織情報入力チェックAPI リクエスト */
export interface ScrCom0025CheckOrganizationRequest {
  // リスト
  organizationMasters: OrganizationList[];
  /** 業務日付 */
  businessDate: string;
}

export interface OrganizationList {
  /** 組織ID */
  organizationId: string;
  /** 部署名称 */
  organizationName: string;
  /** 適用終了日 */
  applyingEndDate: string;
}

/** SCR-COM-0025-0004: 組織情報入力チェックAPI レスポンス */
export interface ScrCom0025CheckOrganizationResponse {
  // リスト
  errorList: ErrorList[];
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

/** SCR-COM-0025-0004: 組織情報入力チェックAPI */
export const ScrCom0025OrganizationInfoCheck = async (
  request: ScrCom0025CheckOrganizationRequest
): Promise<ScrCom0025CheckOrganizationResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/chk-organization',
    request
  );
  return response.data;
};

/** SCR-COM-0025-0005: 組織情報登録更新API リクエスト */
export interface ScrCom0025RegistOrganizationRequest {
  // リスト
  organizationList: RegistUpdateOrganizationList[];
}

interface RegistUpdateOrganizationList {
  /** 組織ID */
  organizationId: string;
  /** 部署名称 */
  organizationName: string;
  /** 親組織ID */
  parentOrganizationId: string;
  /** 営業担当フラグ */
  salesStaffFlag: boolean;
  /** 検査員フラグ */
  inspectorFlag: boolean;
  /** 適用開始日 */
  applyingStartDate: string;
  /** 適用終了日 */
  applyingEndDate: string;
  /** 変更理由 */
  changeReason: string;
  /** ユーザーID */
  userId: string;
  /** 変更後タイムスタンプ */
  afterTimestamp: string;
  /** 変更前タイムスタンプ */
  beforeTimestamp: string;
}

/** SCR-COM-0025-0005: 組織情報登録更新API */
export const ScrCom0025RegistUpdateOrganization = async (
  request: ScrCom0025RegistOrganizationRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/merge-organization',
    request
  );
  return response.data;
};

// API-COM-0025-0006：組織情報取得（部署階層）API リクエスト
export interface ScrCom0025GetOrganizationHierarchyRequest {
  // 組織ID
  organizationId: string;
}

// API-COM-0025-0006：組織情報取得（部署階層）API レスポンス
export interface ScrCom0025GetOrganizationHierarchyResponse {
  // 部署階層名称
  organizationClassName: string;
}

// COM-0025-0006：組織情報取得（部署階層）API
export const getOrganizationHierarchy = async (
  req: ScrCom0025GetOrganizationHierarchyRequest
): Promise<ScrCom0025GetOrganizationHierarchyResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/get-organization-hierarchy',
    req
  );
  return response.data;
};

/** SCR-COM-0025-0007: 役職情報入力チェックAPI リクエスト */
export interface ScrCom0025CheckPostRequest {
  // リスト
  checkPostList: CheckPostList[];
}

/** SCR-COM-0025-0007: 役職情報入力チェックAPI リクエスト(リスト行) */
interface CheckPostList {
  // 役職ID
  postId: string;
  // 役職名
  postName: string;
  // 画面権限ID
  screenPermissionId: string;
  // マスタ権限ID
  masterPermissionId: string;
  // 承認権限ID
  approvalPermissionId: string;
  // 適用開始日
  applyingStartDate: string;
  // 適用終了日
  applyingEndDate: string;
  /** 業務日付 */
  businessDate: string;
}

/** SCR-COM-0025-0007: 役職情報入力チェックAPI レスポンス */
export interface ScrCom0025CheckPostResponse {
  // リスト
  errorList: ErrorList[];
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

/** SCR-COM-0025-0007: 役職情報入力チェックAPI */
export const ScrCom0025PostInfoCheck = async (
  request: ScrCom0025CheckPostRequest
): Promise<ScrCom0025CheckPostResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/chk-post',
    request
  );
  return response.data;
};

/** SCR-COM-0025-0008: 役職情報登録更新API リクエスト */
export interface ScrCom0025RegistPostRequest {
  // リスト
  postList: RegistUpdatePostList[];
}

/** SCR-COM-0025-0008: 役職情報登録更新API リクエスト(リスト行) */
interface RegistUpdatePostList {
  // 役職ID
  postId: string;
  // 役職名
  postName: string;
  // 組織ID
  organizationId: string;
  // 画面権限ID
  screenPermissionId: string;
  // マスタ権限ID
  masterPermissionId: string;
  // 承認権限ID
  approvalPermissionId: string;
  // 適用開始日
  applyingStartDate: string;
  // 適用終了日
  applyingEndDate: string;
  // 変更理由
  changeReason: string;
  // ユーザーID
  userId: string;
  // 変更後タイムスタンプ
  afterTimestamp: string;
  // 変更前タイムスタンプ
  beforeTimestamp: string;
}

/** SCR-COM-0025-0008: 役職情報登録更新API */
export const ScrCom0025RegistUpdatePost = async (
  request: ScrCom0025RegistPostRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/merge-post',
    request
  );
  return response.data;
};

/** SCR-COM-0025-0009: 従業員情報入力チェックAPI リクエスト */
export interface ScrCom0025CheckEmployeeRequest {
  // リスト
  checkEmployeeList: CheckEmployeeList[];
}

interface CheckEmployeeList {
  // 従業員ID
  employeeId: string;
}

/** SCR-COM-0025-0009: 従業員情報入力チェックAPI レスポンス */
export interface ScrCom0025CheckEmployeeResponse {
  // リスト
  errorList: ErrorList[];
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

/** SCR-COM-0025-0009: 従業員情報入力チェックAPI */
export const ScrCom0025EmployeeInfoCheck = async (
  request: ScrCom0025CheckEmployeeRequest
): Promise<ScrCom0025CheckEmployeeResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/chk-employee',
    request
  );
  return response.data;
};

/** SCR-COM-0025-0010: 従業員情報登録更新API リクエスト */
export interface ScrCom0025RegistEmployeeRequest {
  // リスト
  employeeList: RegistUpdateEmployeeList[];
}

interface RegistUpdateEmployeeList {
  // 従業員ID
  employeeId: string;
  // SalesForceID
  salesForceId: string;
  // 変更理由
  changeReason: string;
  // 組織ID_1
  organizationId_1: string;
  // 役職ID_1
  postId_1: string;
  // 適用開始日_1
  applyingStartDate_1: string;
  // 適用終了日_1
  applyingEndDate_1: string;
  // 変更前タイムスタンプ_1
  beforeTimestamp_1: string;
  // 組織ID_2
  organizationId_2: string;
  // 役職ID_2
  postId_2: string;
  // 適用開始日_2
  applyingStartDate_2: string;
  // 適用終了日_2
  applyingEndDate_2: string;
  // 変更前タイムスタンプ_2
  beforeTimestamp_2: string;
  // 組織ID_3
  organizationId_3: string;
  // 役職ID_3
  postId_3: string;
  // 適用開始日_3
  applyingStartDate_3: string;
  // 適用終了日_3
  applyingEndDate_3: string;
  // 変更前タイムスタンプ_3
  beforeTimestamp_3: string;
  // 組織ID_4
  organizationId_4: string;
  // 役職ID_4
  postId_4: string;
  // 適用開始日_4
  applyingStartDate_4: string;
  // 適用終了日_4
  applyingEndDate_4: string;
  // 変更前タイムスタンプ_4
  beforeTimestamp_4: string;
  // ユーザーID
  userId: string;
  // 変更後タイムスタンプ
  afterTimestamp: string;
  // 変更前タイムスタンプ
  beforeTimestamp: string;
}

/** SCR-COM-0025-0010: 従業員情報登録更新API */
export const ScrCom0025RegistUpdateEmployee = async (
  request: ScrCom0025RegistEmployeeRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/merge-employee',
    request
  );
  return response.data;
};

// API-COM-0025-0011：従業員情報取得API リクエスト
export interface ScrCom0025GetEmployeeRequest {
  // 従業員ID
  employeeId: string;
}

// API-COM-0025-0011：従業員情報取得API レスポンス
export interface ScrCom0025GetEmployeeResponse {
  // 従業員ID
  employeeId: string;
  // 従業員名
  employeeName: string;
  // 従業員メールアドレス
  employeeMailAddress: string;
  // 所属
  belong: string;
}

// API-COM-0025-0011：従業員情報取得API
export const getEmployee = async (
  req: ScrCom0025GetEmployeeRequest
): Promise<ScrCom0025GetEmployeeResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0025/get-employee',
    req
  );
  return response.data;
};
