import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { SelectValue } from 'controls/Select';

import { comApiClient } from 'providers/ApiClient';

// API-COM-0013-0001：商品管理表示API(コース情報表示） リクエスト
export interface ScrCom0013DisplayComoditymanagementCourseRequest {
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: number;
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0013-0001：商品管理表示API(コース情報表示） レスポンス
export interface ScrCom0013DisplayComoditymanagementCourseResponse {
  /** 件数 */
  count: number;
  /** コース情報 */
  courseList: courceInfo[];
}

// API-COM-0013-0001：商品管理表示API(コース情報表示） レスポンス リスト行
export interface courceInfo {
  /** コースID */
  courceId: string;
  /** コース名 */
  courceName: string;
  /** 連携用対象サービス */
  cooperationTargetService: string;
  /** 利用フラグ */
  utilizationFlg: boolean;
  /** 予約有無 */
  reservationExistence: boolean;
  /** 反映予定日 */
  reflectionSchedule: string;
}

// API-COM-0013-0002：商品管理表示API(サービス情報表示） リクエスト
export interface ScrCom0013DisplayComoditymanagementServiceRequest {
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: number;
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0013-0002：商品管理表示API(サービス情報表示） レスポンス
export interface ScrCom0013DisplayComoditymanagementServiceResponse {
  /** 件数 */
  count: number;
  /** サービス情報 */
  serviceList: ServiceInfo[];
}

// API-COM-0013-0002：商品管理表示API(コース情報表示） レスポンス リスト行
export interface ServiceInfo {
  /** サービスID */
  serviceId: string;
  /** サービス名 */
  serviceName: string;
  /** 担当部門区分 */
  responsibleCategory: string;
  /** 対象サービス区分 */
  targetServiceDivision: string;
  /** 外部連携情報サービスフラグ */
  cooperationInfoServiceFlg: boolean;
  /** 複数契約可フラグ */
  multiContractPossibleFlg: boolean;
  /** 利用フラグ */
  utilizationFlg: boolean;
  /** 変更前タイムスタンプ */
  changeBfrTimestamp: string;
  /** 変更予約 */
  changeReserve: boolean;
}

// API-COM-0013-0003：商品管理表示API(手数料情報表示） リクエスト
export interface ScrCom0013DisplayComoditymanagementCommissionRequest {
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: number;
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0013-0003：商品管理表示API(手数料情報表示） レスポンス
export interface ScrCom0013DisplayComoditymanagementCommissionResponse {
  /** 件数 */
  count: number;
  /** サービス情報 */
  commissionList: CommissionInfo[];
}

// API-COM-0013-0003：商品管理表示API(手数料情報表示） レスポンス(リスト行)
export interface CommissionInfo {
  // 手数料ID
  commissionId: string;
  // 手数料名
  commissionName: string;
  // 手数料種類
  commissionType: string;
  // 計算書種別
  calculationDocType: string;
  // 利用フラグ
  utilizationFlg: boolean;
  // 変更予約
  changeReserve: boolean;
}

// API-COM-0013-0004：商品管理表示API(手数料情報表示） リクエスト
export interface ScrCom0013DisplayComoditymanagementDiscountRequest {
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: number;
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0013-0004：商品管理表示API(手数料情報表示） レスポンス
export interface ScrCom0013DisplayComoditymanagementDiscountResponse {
  /** 件数(基本値引値増) */
  basicCount: number;
  /** 基本値引値増情報 */
  basicDiscountList: BasicDiscountInfo[];
  /** 件数（オプション値引値増） */
  optionCount: number;
  /** オプション値引値増情報 */
  optionDiscountList: OptionDiscountInfo[];
  /** 件数（手数料値引値増） */
  commissionCount: number;
  /** 手数料値引値増情報 */
  commissionDiscountList: CommissionDiscountInfo[];
}

// API-COM-0013-0004：商品管理表示API(手数料情報表示） レスポンス 基本リスト行
export interface BasicDiscountInfo {
  campaignCd: string;
  campaignName: string;
  membershipFeeType: string;
  discountDivision: string;
  discountAmount: number;
  courseId: string;
  firstExclusionFlg: boolean;
  contractQuantityLowLimit: number;
  contractQuantityHighLimit: number;
  LimitStartDate: string;
  LimitEndDate: string;
  ContractAfterMonth: number;
  approvalDocumentId: string;
  utilizationFlg: boolean;
  commodityCrameCd: string;
}

// API-COM-0013-0004：商品管理表示API(手数料情報表示） レスポンス オプションリスト行
export interface OptionDiscountInfo {
  campaignCd: string;
  campaignName: string;
  membershipFeeType: string;
  discountDivision: string;
  discountAmount: number;
  serviceId: string;
  firstExclusionFlg: boolean;
  contractQuantityLowLimit: number;
  contractQuantityHighLimit: number;
  LimitStartDate: string;
  LimitEndDate: string;
  ContractAfterMonth: number;
  approvalDocumentId: string;
  utilizationFlg: boolean;
  commodityCrameCd: string;
}

// API-COM-0013-0004：商品管理表示API(手数料情報表示） レスポンス 手数料リスト行
export interface CommissionDiscountInfo {
  commissionDiscountPackId: string;
  packName: string;
  memberServiceType: string;
  calcurationDocType: string;
  validityStartDate: string;
  validityEndDate: string;
  utilizationFlg: boolean;
  changeReserve: boolean;
}

// API-COM-0013-0005：商品管理表示API(変更履歴情報表示） レスポンス
export interface ScrCom0013DisplayComoditymanagementHistoryResponse {
  /** 件数（変更履歴一覧） */
  approveCount: number;
  /** 変更履歴（承認済）情報 */
  chgHistoryApproveList: chgHistoryApproveInfo[];
  /** 件数（未承認一覧） */
  UnapproveAcquisitionCount: number;
  /** 件数（未承認一覧） */
  chgHistoryNotApproveList: chgHistoryNotApproveInfo[];
}

// API-COM-0013-0005：商品管理表示API(変更履歴情報表示） レスポンス 承認済リスト行
export interface chgHistoryApproveInfo {
  // 申請ID
  applicationId: number;
  // 申請元画面ID
  applicationScreenId: string;
  // 申請元画面
  applicationScreen: string;
  // タブID
  tabId: number;
  // タブ名
  tabName: string;
  // 一括登録
  bulkRegist: string;
  // 変更日
  changeDate: string;
  // 申請者ID
  applicantId: string;
  // 申請者名
  applicantName: string;
  // 申請日時
  applicantDate: string;
  // 登録・変更メモ
  registChangeMemo: string;
  // 最終承認者ID
  lastApproverId: string;
  // 最終承認者名
  lastApproverName: string;
  // 最終承認日時
  lastApproveDate: string;
  // 最終承認コメント
  lastApproveComment: string;
}

// API-COM-0013-0005：商品管理表示API(変更履歴情報表示） レスポンス 未承認リスト行
export interface chgHistoryNotApproveInfo {
  // 申請ID
  applicationId: number;
  // 申請元画面ID
  applicationScreenId: string;
  // 申請元画面
  applicationScreen: string;
  // タブID
  tabId: number;
  // タブ名
  tabName: string;
  // 一括登録
  bulkRegist: string;
  // 変更日
  changeDate: string;
  // 申請者ID
  applicantId: string;
  // 申請者名
  applicantName: string;
  // 申請日時
  applicantDate: string;
  // 登録・変更メモ
  registChangeMemo: string;
  // 承認ステータス
  approveStatus: string;
  // 1次承認者ID
  firstApproverId: string;
  // 1次承認者名
  firstApproverName: string;
  // 2次承認者ID
  secondApproverId: string;
  // 2次承認者名
  secondApproverName: string;
  // 3次承認者ID
  thirdApproverId: string;
  // 3次承認者名
  thirdApproverName: string;
  // 4次承認者ID
  forthApproverId: string;
  // 4次承認者名
  forthApproverName: string;
}

// API-COM-0013-0006：サービス変更予定日取得API リクエスト
export interface ScrCom0013GetServiceChangeDateRequest {
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: number;
  /** 業務日付 */
  businessDate: string;
}

// API-COM-0013-0006：サービス変更予定日取得API レスポンス
export interface ScrCom0013GetServiceChangeDateResponse {
  /** 変更予定日情報 */
  changeExpectDateInfo: changeExpectDateInfo[];
}

// API-COM-0013-0006：サービス変更予定日取得API レスポンス リスト行
export interface changeExpectDateInfo {
  /** 変更予定日 */
  changeExpectDate: string;
}

// API-COM-0013-0007: サービス情報入力チェックAPI リクエスト
export interface ScrCom0013chkServiceRequest {
  /** サービス情報リスト */
  serviceList: serviceInfo[];
}

// API-COM-0013-0007: サービス情報入力チェックAPI リクエスト リスト行
export interface serviceInfo {
  /** サービスID */
  serviceId: string;
  /** サービス名 */
  serviceName: string;
}

// API-COM-0013-0007: サービス情報入力チェックAPI レスポンス
export interface ScrCom0013chkServiceResponse {
  /** エラー内容リスト */
  errorList: errorList[];
  /** ワーニング内容リスト */
  warnList: warnList[];
}

// API-COM-0013-0007: サービス情報入力チェックAPI レスポンス リスト行
export interface errorList {
  /** エラーコード */
  errorCode: string;
  /** エラーメッセージ */
  errorMessage: string;
}

// API-COM-0013-0007: サービス情報入力チェックAPI レスポンス リスト行
export interface warnList {
  /** ワーニングコード */
  warnCode: string;
  /** ワーニングメッセージ */
  warnMessage: string;
}

// API-COM-0013-0008: サービス情報登録API リクエスト
export interface ScrCom0013MergeServiceRequest {
  /** 変更履歴番号 */
  changeHistoryNumber: string;
  /** サービス情報 */
  serviceInfo: serviceInfoList[];
  /** 申請従業員 */
  applicationEmployeeId: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 第一承認者ID */
  firstApproverId: string;
  /** 第一承認者アドレス  */
  firstApproverMailAddress: string;
  /** 第二承認者ID */
  secondApproverId: string;
  /** 第三承認者ID */
  thirdApproverId: string;
  /** 第四承認者ID */
  fourthApproverId: string;
  /** 申請コメント */
  applicationComment: string;
  /** 変更予定日 */
  changeExpectDate: string;
}

// API-COM-0013-0008: サービス情報登録API リクエスト リスト行
export interface serviceInfoList {
  /** サービスID */
  serviceId: string;
  /** サービス名 */
  serviceName: string;
  /** 担当部門区分 */
  responsibleCategory: string;
  /** 対象サービス区分 */
  targetServiceDivision: string;
  /** 外部連携情報サービスフラグ */
  cooperationInfoServiceFlg: boolean;
  /** 複数契約可フラグ */
  multiContractPossibleFlg: boolean;
  /** 利用フラグ */
  utilizationFlg: boolean;
}

// API-COM-0013-0009: 値引値増情報入力チェックAPI リクエスト
export interface ScrCom0013chkDiscountRequest {
  /** 値引値増情報リスト */
  discountInfoList: discountInfoList[];
  /** 登録対象リスト */
  registTargetedList: registTargetedList[];
  /** 更新対象リスト */
  updateTargetedList: updateTargetedList[];
  /** 削除対象リスト */
  deleteTargetedList: deleteTargetedList[];
}

// API-COM-0013-0009: 値引値増情報入力チェックAPI リクエスト リスト行
export interface discountInfoList {
  // キャンペーンコード
  campaignCd: string;
  // キャンペーン名
  campaignName: string;
  // 期間From
  periodFrom: string;
  // 期間To
  periodTo: string;
}

// API-COM-0013-0009: 値引値増情報入力チェックAPI リクエスト リスト行
export interface registTargetedList {
  // キャンペーンコード
  campaignCd: string;
}

// API-COM-0013-0009: 値引値増情報入力チェックAPI リクエスト リスト行
export interface updateTargetedList {
  // キャンペーンコード
  campaignCd: string;
}

// API-COM-0013-0009: 値引値増情報入力チェックAPI リクエスト リスト行
export interface deleteTargetedList {
  // キャンペーンコード
  campaignCd: string;
}

// API-COM-0013-0010: 値引値増情報登録更新API リクエスト
export interface ScrCom0013MergeDiscountRequest {
  /** 基本値引値増情報 */
  baseDiscountList: BasicDiscountInfo[];
  /** オプション値引値増情報 */
  optionDiscountList: OptionDiscountInfo[];
  /** 登録対象リスト */
  registTargetedList: registTargetedList[];
  /** 更新対象リスト */
  updateTargetedList: updateTargetedList[];
  /** 削除対象リスト */
  deleteTargetedList: deleteTargetedList[];
  /** 申請従業員ID */
  applicationEmployeeId: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 第一承認者ID */
  firstApproverId: string;
  /** 第一承認者メールアドレス */
  firstApproverMailAddress: string;
  /** 第ニ承認者ID */
  secondApproverId: string;
  /** 第三承認者ID */
  thirdApproverId: string;
  /** 第四承認者ID */
  fourthApproverId: string;
  /** 申請コメント */
  applicationComment: string;
}

// API-COM-0013-0010: 値引値増情報登録更新API リクエスト リスト行
export interface basicInfo {
  /** キャンペーンコード */
  campaignCd: string;
  /** 基本オプション識別区分 */
  basicsOptionKind: string;
  /** 会費種別 */
  feeKind: string;
  /** サービスID */
  serviceId: string;
  /** キャンペーン名 */
  campaignName: string;
  /** 値引値増金額区分 */
  discountPriceKind: string;
  /** 値引値増金額 */
  discountPrice: number;
  /** 期間開始日 */
  periodStartDate: string;
  /** 期間終了日 */
  periodEndDate: string;
  /** 契約後月数 */
  contractMonths: number;
  /** 商品クレームコード */
  goodsClaimCd: string;
  /** セット対象コードID */
  setTargetedCourseId: string;
  /** １本目除外フラグ */
  oneCountExclusionFlag: boolean;
  /** 契約本数下限 */
  contractCountMin: number;
  /** 契約本数上限 */
  contractCountMax: number;
  /** 稟議書ID */
  approvalDocumentId: string;
  /** 利用フラグ */
  utilizationFlg: boolean;
}

// API-COM-0013-0011: 商品管理表API(サービス変更予約情報表示) リクエスト
export interface displayComodityManagementServiceReserveRequest {
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: number;
  /** 変更予定日 */
  changeReserveDate: string;
}

// API-COM-0013-0011: 商品管理表API(サービス変更予約情報表示) レスポンス
export interface displayComodityManagementServiceReserveResponse {
  /** 件数 */
  count: number;
  /** サービス変更予約情報 */
  serviceInfo: serviceInfo[];
}

// API-COM-0013-0011: 商品管理表API(サービス変更予約情報表示) レスポンス リスト行
export interface serviceInfo {
  /** サービスID */
  serviceId: string;
  /** サービス名 */
  serviceName: string;
  /** 担当部門区分 */
  responsibleCategory: string;
  /** 対象サービス区分 */
  targetServiceDivision: string;
  /** 外部連携情報サービスフラグ */
  cooperationInfoServiceFlg: boolean;
  /** 複数契約可フラグ */
  multiContractPossibleFlg: boolean;
  /** 利用フラグ */
  utilizationFlg: boolean;
  /** 変更前タイムスタンプ */
  changeBfrTimestamp: string;
  /** 変更予約 */
  changeReserve: string;
}

// API-COM-0013-0001：商品管理表示API(コース情報表示）
export const ScrCom0013DisplayComoditymanagementCourse = async (
  request: ScrCom0013DisplayComoditymanagementCourseRequest
): Promise<ScrCom0013DisplayComoditymanagementCourseResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0013/display-comoditymanagement_course',
    request
  );
  return response.data;
};

// API-COM-0013-0002：商品管理表示API(サービス情報表示）
export const ScrCom0013DisplayComoditymanagementService = async (
  request: ScrCom0013DisplayComoditymanagementServiceRequest
): Promise<ScrCom0013DisplayComoditymanagementServiceResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0013/display-comoditymanagement-service',
    request
  );
  return response.data;
};

// API-COM-0013-0003：商品管理表示API(手数料情報表示）
export const ScrCom0013DisplayComoditymanagementCommission = async (
  request: ScrCom0013DisplayComoditymanagementCommissionRequest
): Promise<ScrCom0013DisplayComoditymanagementCommissionResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0013/display-comoditymanagement-commission',
    request
  );
  return response.data;
};

// API-COM-0013-0004：商品管理表示API(手数料情報表示）
export const ScrCom0013DisplayComoditymanagementDiscount = async (
  request: ScrCom0013DisplayComoditymanagementDiscountRequest
): Promise<ScrCom0013DisplayComoditymanagementDiscountResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0013/display-comoditymanagement-discount',
    request
  );
  return response.data;
};

// API-COM-0013-0005：商品管理表示API(変更履歴情報表示）
export const ScrCom0013DisplayComoditymanagementHistory =
  async (): Promise<ScrCom0013DisplayComoditymanagementHistoryResponse> => {
    const response = await comApiClient.post(
      '/api/com/scr-com-0013/display-comoditymanagement-history'
    );
    return response.data;
  };

// API-COM-0013-0006：サービス変更予定日取得API
export const ScrCom0013GetServiceChangeDate = async (
  request: ScrCom0013GetServiceChangeDateRequest
): Promise<ScrCom0013GetServiceChangeDateResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0013/get-service-change-date',
    request
  );
  return response.data;
};

// API-COM-0013-0007: サービス情報入力チェックAPI
export const ScrCom0013chkService = async (
  request: ScrCom0013chkServiceRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0013/chk-service',
    request
  );
  return response.data;
};

// API-COM-0013-0008: サービス情報登録API
export const ScrCom0013MergeService = async (
  request: ScrCom0013MergeServiceRequest
): Promise<void> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0013/merge-service',
    request
  );
  return response.data;
};

// API-COM-0013-0009: 値引値増情報入力チェックAPI
export const ScrCom0013chkDiscount = async (
  request: ScrCom0013chkDiscountRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0013/chk-discount',
    request
  );
  return response.data;
};

// API-COM-0013-0010: 値引値増情報登録更新API
export const ScrCom0013MergeDiscount = async (
  request: ScrCom0013MergeDiscountRequest
): Promise<void> => {
  await comApiClient.post('/api/com/scr-com-0013/merge-discount', request);
};

// API-COM-0013-0011: 商品管理表API(サービス変更予約情報表示)
export const displayComodityManagementServiceReserve = async (
  request: displayComodityManagementServiceReserveRequest
): Promise<displayComodityManagementServiceReserveResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0013/display-comoditymanagement-service-reserve',
    request
  );
  return response.data;
};
// 全タブのリクエスト情報を統括
export interface registrationRequest {
  // コースタブ
  // コースID
  courceId: string;
  // コース名
  courceName: string;
  // 連携用対象サービス
  cooperationTargetService: string;
  // 利用フラグ
  courceUtilizationFlg: string;
  // 予約有無
  reservationExistence: string;
  // 反映予定日
  reflectionSchedule: string;
  // サービスタブ
  // サービスID
  serviceId: string;
  // サービス名
  serviceName: string;
  // 担当部門区分
  responsibleCategory: string;
  // 対象サービス区分
  targetServiceDivision: string;
  // 外部連携情報サービスフラグ
  cooperationInfoServiceFlg: boolean;
  // 複数契約可フラグ
  multiContractPossibleFlg: boolean;
  // 利用フラグ
  serviceUtilizationFlg: boolean;
  // 変更前タイムスタンプ
  changeBfrTimestamp: string;
  // 変更予約
  serviceChangeReserve: string;
  // 手数料タブ
  // 手数料ID
  commissionId: string;
  // 手数料名
  commissionName: string;
  // 手数料種類
  commissionType: string;
  // 計算書種別
  calculationDocType: string;
  // 利用フラグ
  commissionUtilizationFlg: string;
  // 変更予約
  commissionChangeReserve: string;
  // 担当部門
  responsibleCategoryValues: SelectValue[];
  // 連携用対象サービス
  targetServiceDivisionValues: SelectValue[];
  // 変更予約情報
  changeReservationInfoSelectValues: SelectValue[];
  // 手数料値引値増タブ-基本値引値増
  // キャンペーンコード
  basicCampaignCd: string;
  // キャンペーン名
  basicCampaignName: string;
  // 会費種別
  basicMembershipFeeType: string;
  // 値引値増金額区分
  basicDiscountDivision: string;
  // 値引値増金額
  basicDiscountAmount: number;
  // コースID
  basicCourseId: string;
  // １本目除外フラグ
  basicFirstExclusionFlg: boolean;
  // 契約数量下限
  basicContractQuantityLowLimit: number;
  // 契約数量上限
  basicContractQuantityHighLimit: number;
  // 期限開始日
  basicLimitStartDate: string;
  // 期限終了日
  basicLimitEndDate: string;
  // 稟議書ID
  basicApprovalDocumentId: string;
  // 商品クレームコード
  basicCommodityCrameCd: string;
  // 利用フラグ
  basicUtilizationFlg: boolean;
  // 契約日からの月数
  basicContractAfterMonth: number;
  // 契約日からの月数の手前のラジオボタン
  basicNumberOfMonthsFromContractDateRadio: string;
  // 会費セクション-オプション値引値増
  // キャンペーンコード
  optionCampaignCd: string;
  // キャンペーン名
  optionCampaignName: string;
  // 会費種別
  optionMembershipFeeType: string;
  // 値引値増金額区分
  optionDiscountDivision: string;
  // 値引値増金額
  optionDiscountAmount: number;
  // サービスID
  optionServiceId: string;
  // １本目除外フラグ
  optionFirstExclusionFlg: boolean;
  // 契約数量下限
  optionContractQuantityLowLimit: number;
  // 契約数量上限
  optionContractQuantityHighLimit: number;
  // 期限開始日
  optionLimitStartDate: string;
  // 期限終了日
  optionLimitEndDate: string;
  // 契約日からの月数
  optionContractAfterMonth: number;
  // 稟議書ID
  optionApprovalDocumentId: string;
  // 利用フラグ
  optionUtilizationFlg: boolean;
  // 商品クレームコード
  optionCommodityCrameCd: string;
  // 手数料セクション
  // 値引値増パックID
  commissionDiscountPackId: string;
  // パック名
  packName: string;
  // 会員サービス識別区分
  memberServiceType: string;
  // 計算書種別
  calcurationDocType: string;
  // 有効期間開始日
  validityStartDate: string;
  // 有効期間終了日
  validityEndDate: string;
  // 利用フラグ
  commissionDiscountPacksCommissionUtilizationFlg: boolean;
  // 変更予約
  commissionDiscountPacksCommissionChangeReserve: string;
  // 金額(種類)
  priceSelectValues: SelectValue[];
  // セット対象コース
  setTargetCourseSelectValues: SelectValue[];
  // サービス名
  serviceNameSelectValues: SelectValue[];
  // 商品コード
  commodityCrameCdSelectValues: SelectValue[];
}
