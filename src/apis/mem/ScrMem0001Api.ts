import { memApiClient } from 'providers/ApiClient';

/** 法人情報検索APIリクエスト */
export interface ScrMem0001SearchCorporationsRequest {
  // 法人ID
  corporationId?: string;
  // 法人名
  corporationName?: string;
  // 法人グループID
  corporationGroupId?: string;
  // 法人参加区分
  corporationEntryKinds?: string[];
  // 代表者名
  representativeName?: string;
  // 連帯保証人名①
  guarantorName1?: string;
  // 連帯保証人名②
  guarantorName2?: string;
  // 適格事業者番号
  eligibleBusinessNumber?: string;
  // 古物商許可番号
  antiqueBusinessLicenseNumber?: string;
  // 物流拠点住所（市区町村以降）
  logisticsBaseAddressAfterMunicipalities?: string;
  // 物流拠点市区郡コード
  logisticsBaseDistrictCode?: string;
  // 物流拠点電話番号
  logisticsBasePhoneNumber?: string;
  // 制限状況区分
  limitStatusKinds?: string;
  // コース参加区分
  courseEntryKinds?: string[];
  // 基本法人与信額（FROM）
  basicsCorporationCreditAmountFrom?: number;
  // 基本法人与信額（TO）
  basicsCorporationCreditAmountTo?: number;
  // 臨時与信設定日（FROM）
  temporaryCreditSettingDateFrom?: string;
  // 臨時与信設定日（TO）
  temporaryCreditSettingDateTo?: string;
  // 契約ID
  contractId?: string;
  // 請求先ID
  billingId?: string;
  // 担当部門区分
  staffDepartmentKinds?: string;
  // ライブオプション参加区分
  liveOptionEntryKinds?: string[];
  // POSまとめ会場コード
  posPutTogetherPlaceCode?: string;
  // POS番号
  posNumber?: string;
  // アイオーク管理番号
  iaucManagementNumber?: string;
  // オートバンクシステム端末契約ID
  autobankSystemTerminalContractId?: string;
  // 利用開始日（FROM）
  useStartDateFrom?: string;
  // 利用開始日（TO）
  useStartDateTo?: string;
  // ID発行日（FROM）
  idIssuanceDateFrom?: string;
  // ID発行日（TO）
  idIssuanceDateTo?: string;
  // コース変更日（FROM）
  courseChangeDateFrom?: string;
  // コース変更日（TO）
  courseChangeDateTo?: string;
  // 休会期間開始日（FROM）
  recessPeriodStartDateFrom?: string;
  // 休会期間開始日（TO）
  recessPeriodStartDateTo?: string;
  // 休会期間終了日（FROM）
  recessPeriodEndDateFrom?: string;
  // 休会期間終了日（TO）
  recessPeriodEndDateTo?: string;
  // 脱会日（FROM）
  leavingDateFrom?: string;
  // 脱会日（TO）
  leavingDateTo?: string;
  // 変更予定日（FROM）
  changeExpectDateFrom?: string;
  // 変更予定日（TO）
  changeExpectDateTo?: string;
  // 制限件数
  limitCount: number;
}

/** 法人情報検索APIレスポンス */
export interface ScrMem0001SearchCorporationsResponse {
  // 制限件数
  limitCount: number;
  // 取得件数
  acquisitionCount: number;
  // 返却件数
  responseCount: number;
  // リスト
  corpInfo: List[];
}

// リスト
export interface List {
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 法人グループ名
  corporationGroupName: string;
  // 代表者名
  representativeName: string;
  // 連帯保証人名①
  guarantorName1: string;
  // 連帯保証人名②
  guarantorName2: string;
  // 法人参加区分名称
  corporationEntryKindName: string;
  // 変更予約フラグ名称
  changeExpectFlagName: string;
}

/** 法人情報検索API */
export const ScrMem0001SearchCorporations = async (
  request: ScrMem0001SearchCorporationsRequest
): Promise<ScrMem0001SearchCorporationsResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0001/search-corporations',
    request
  );
  return response.data;
};

