import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { comApiClient } from 'providers/ApiClient';

/** SCR-COM-0024-0001: ライブ会場データ取得API リクエスト */
export interface ScrCom0024GetPlaceDataRequest {
  /** 業務日付 */
  businessDate: string;
  /** 会場コード */
  placeCd: string;
}

/** SCR-COM-0024-0001: ライブ会場データ取得API レスポンス */
export interface ScrCom0024GetPlaceDataResponse {
  /** 会場コード */
  placeCd: string;
  /** 会場名 */
  placeName: string;
  /** おまとめ会場フラグ */
  omatomePlaceFlag: boolean;
  /** 計算表示会場名 */
  statementDisplayPlaceName: string;
  /** 利用フラグ */
  useFlag: boolean;
  /** 提携開始日 */
  partnerStartDate: string;
  /** 開催曜日区分 */
  sessionWeekKind: string;
  /** 会場契約ID */
  contractId: string;
  /** 法人ID */
  corporationId: string;
  /** 法人名 */
  corporationName: string;
  /** 請求先ID */
  billingId: string;
  /** 事業拠点電話番号 */
  businessBasePhoneNumber: string;
  /** 会場グループコード */
  placeGroupCode: string;
  /** 会場グループ名 */
  placeGroupName: string;
  /** 支払先会場コード */
  paymentDestinationPlaceCode: string;
  /** 支払先会場名 */
  paymentDestinationPlaceName: string;
  /** POSまとめ会場コード */
  posPutTogetherPlaceCode: string;
  /** POSまとめ会場名 */
  posPutTogetherPlaceName: string;
  /** ホンダグループフラグ */
  hondaGroupFlag: boolean;
  /** 保証金 */
  guaranteeDeposit: number;
  /** ライブ会場グループコード */
  livePlaceGroupCode: string;
  /** 書類発送指示フラグ */
  documentShippingInstructionFlag: boolean;
  /** 書類発送会場直送フラグ */
  documentShippingPlaceDirectDeliveryFlag: boolean;
  /** 書類発送担当者 */
  documentShippingStaff: string;
  /** 書類発送メールアドレス */
  documentShippingMailAddress: string;
  /** 書類発送FAX番号 */
  documentShippingFaxNumber: string;
  /** 出金期日 */
  paymentDueDate: string;
  /** 出金一括フラグ */
  paymentAllFlag: boolean;
  /** 振込銀行名 */
  bankName: string;
  /** 振込支店名 */
  branchName: string;
  /** 種別 */
  accountKind: string;
  /** 口座番号 */
  accountNumber: string;
  /** 口座名義 */
  accountNameKana: string;
  /** バーチャル口座付与ルールコード */
  virtualAccountGiveRuleCode: string;
  /** 支払通知フラグ */
  paymentNoticeFlag: boolean;
  /** 支払通知担当者 */
  paymentNoticeStaff: string;
  /** 支払通知メールアドレス */
  paymentNoticeMailAddress: string;
  /** 支払通知FAX番号 */
  paymentNoticeFaxNumber: string;
  /** 入金元銀行コード */
  receiptSourceBankCode: string;
  /** 入金元支店コード */
  receiptSourceBranchCode: string;
  /** 入金元口座名義カナ */
  receiptSourceAccountNameKana: string;
  /** 会場会員管理担当メールアドレス */
  placeMemberManagementStaffMailAddress: string;
  /** おまとめ会場連絡不可対象区分 */
  omatomePlaceContactImpossibleTargetedKind: string;
}

/** SCR-COM-0024-0002: 契約情報リスト取得API リクエスト */
export interface ScrCom0024GetContractDataRequest {
  /** 業務日付 */
  businessDate: string;
  /** 契約ID */
  contractId: string;
}

/** SCR-COM-0024-0002: 契約情報リスト取得API レスポンス */
export interface ScrCom0024GetContractDataResponse {
  /** 法人ID */
  corporationId: string;
  /** 法人名 */
  corporationName: string;
  /** 請求先ID */
  billingId: string;
  /** 事業拠点電話番号 */
  businessBasePhoneNumber: string;
  /** 振込銀行名 */
  bankName: string;
  /** 振込支店名 */
  branchName: string;
  /** 種別 */
  accountKind: string;
  /** 口座番号 */
  accountNumber: string;
  /** 口座名義 */
  accountNameKana: string;
}

/** SCR-COM-0024-0003: 会場詳細入力チェックAPI リクエスト */
export interface ScrCom0024PlaceDetailCheckRequest {
  /** 会場コード */
  placeCd: string;
  /** 会場名 */
  placeName: string;
}

/** SCR-COM-0024-0004: 会場詳細登録更新API リクエスト */
export interface ScrCom0024RegistUpdatePlaceDetailRequest {
  /** 会場コード */
  placeCode: string;
  /** 会場名 */
  placeName: string;
  /** おまとめ会場フラグ */
  omatomePlaceFlag: boolean;
  /** 計算表示会場名 */
  statementDisplayPlaceName: string;
  /** 利用フラグ */
  useFlag: boolean;
  /** 提携開始日 */
  partnerStartDate: string;
  /** 開催曜日区分 */
  sessionWeekKind: string;
  /** 会場契約ID */
  contractId: string;
  /** 会場グループコード */
  placeGroupCode: string;
  /** 支払先会場コード */
  paymentDestinationPlaceCode: string;
  /** POSまとめ会場コード */
  posPutTogetherPlaceCode: string;
  /** ホンダグループフラグ */
  hondaGroupFlag: boolean;
  /** 保証金 */
  guaranteeDeposit: number;
  /** ライブ会場グループコード */
  livePlaceGroupCode: string;
  /** 書類発送指示フラグ */
  documentShippingInstructionFlag: boolean;
  /** 書類発送会場直送フラグ */
  documentShippingPlaceDirectDeliveryFlag: boolean;
  /** 書類発送担当者 */
  documentShippingStaff: string;
  /** 書類発送メールアドレス */
  documentShippingMailAddress: string;
  /** 書類発送FAX番号 */
  documentShippingFaxNumber: string;
  /** 出金期日 */
  paymentDueDate: string;
  /** 出金一括フラグ */
  paymentAllFlag: boolean;
  /** バーチャル口座付与ルールコード */
  virtualAccountGiveRuleCode: string;
  /** 支払通知フラグ */
  paymentNoticeFlag: boolean;
  /** 支払通知担当者 */
  paymentNoticeStaff: string;
  /** 支払通知メールアドレス */
  paymentNoticeMailAddress: string;
  /** 支払通知FAX番号 */
  paymentNoticeFaxNumber: string;
  /** 入金元銀行コード */
  receiptSourceBankCode: string;
  /** 入金元支店コード */
  receiptSourceBranchCode: string;
  /** 入金元口座名義カナ */
  receiptSourceAccountNameKana: string;
  /** 会場会員管理担当メールアドレス */
  placeMemberManagementStaffMailAddress: string;
  /** おまとめ会場連絡不可対象区分 */
  omatomePlaceContactImpossibleTargetedKind: string;
  /** 申請従業員ID */
  applicationEmployeeId: string;
}

/** SCR-COM-0024-0001: ライブ会場データ取得API */
export const ScrCom0024GetPlaceData = async (
  request: ScrCom0024GetPlaceDataRequest
): Promise<ScrCom0024GetPlaceDataResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0024/get-place-data',
    request
  );
  return response.data;
};

/** SCR-COM-0024-0002: 契約情報リスト取得API */
export const ScrCom0024GetContractData = async (
  request: ScrCom0024GetContractDataRequest
): Promise<ScrCom0024GetContractDataResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-0024/get-contract-data',
    request
  );
  return response.data;
};

/** SCR-COM-0024-0003: 会場詳細入力チェックAPI */
export const ScrCom0024PlaceDetailCheck = async (
  request: ScrCom0024PlaceDetailCheckRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/com/scr-com-0024/place-detail-check',
    request
  );
  return response.data;
};

/** SCR-COM-0024-0004: 会場詳細登録更新API */
export const ScrCom0024RegistUpdatePlaceDetail = async (
  request: ScrCom0024RegistUpdatePlaceDetailRequest
): Promise<void> => {
  await comApiClient.post(
    '/com/scr-com-0024/regist-update-place-detail',
    request
  );
};
