import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { comApiClient } from 'providers/ApiClient';

/** API-COM-0014-0001: 手数料表示API リクエスト */
export interface ScrCom0014GetCommissionCurrentRequest {
  /** 手数料ID */
  commissionId: string;
}

/** API-COM-0014-0001: 手数料表示API レスポンス */
export interface ScrCom0014GetCommissionCurrentResponse {
  /** 手数料名 */
  commissionName: string;
  /** 手数料種類区分 */
  commissionKind: string;
  /** 手数料種類区分名 */
  commissionKindName: string;
  /** 稟議書ID */
  approvalDocumentId: string;
  /** 商品クレームコード */
  goodsClaimCode: string;
  /** 利用フラグ */
  useFlag: boolean;
  /** 計算書種別 */
  statementKind: string;
  /** 利用開始日 */
  useStartDate: string;
  /** 条件設定セクション リスト */
  conditionSettingList: conditionSettingList[];
  /** 価格設定セクション リスト */
  priceSettingList: priceSettingList[];
}

/** API-COM-0014-0001: 手数料表示API 条件設定セクションレスポンス(リスト行) */
export interface conditionSettingList {
  /** 手数料条件種類No */
  commissionConditionKindNo: string | number;
  /** 条件種類コード */
  conditionKindCode: string | number;
  /** 手数料条件種類名 */
  conditionKindName: string | number;
  /** 手数料条件No */
  commissionConditionNo: string | number;
  /** 手数料条件区分 */
  commissionConditionKind: string | number;
  /** 手数料条件区分名 */
  commissionConditionKindName: string | number;
  /** 手数料条件値 */
  commissionConditionValue: string | number;
}

/** API-COM-0014-0001: 手数料表示API 価格設定セクションレスポンス(リスト行) */
export interface priceSettingList {
  /** 手数料条件種類名No1 */
  commissionConditionKindNo1: string | number;
  /** 手数料条件区分名No1 */
  commissionConditionNo1: string | number;
  /** 手数料条件値No1 */
  commissionConditionValueNo1: string | number;
  /** 手数料条件種類名No2 */
  commissionConditionKindNo2: string | number;
  /** 手数料条件区分名No2 */
  commissionConditionNo2: string | number;
  /** 手数料条件値No2 */
  commissionConditionValueNo2: string | number;
  /** 手数料条件種類名No3 */
  commissionConditionKindNo3: string | number;
  /** 手数料条件区分名No3 */
  commissionConditionNo3: string | number;
  /** 手数料条件値No3 */
  commissionConditionValueNo3: string | number;
  /** 手数料条件種類名No4 */
  commissionConditionKindNo4: string | number;
  /** 手数料条件区分名No4 */
  commissionConditionNo4: string | number;
  /** 手数料条件値No4 */
  commissionConditionValueNo4: string | number;
  /** 手数料条件種類名No5 */
  commissionConditionKindNo5: string | number;
  /** 手数料条件区分名No5 */
  commissionConditionNo5: string | number;
  /** 手数料条件値No5 */
  commissionConditionValueNo5: string | number;
  /** 手数料条件種類名No6 */
  commissionConditionKindNo6: string | number;
  /** 手数料条件区分名No6 */
  commissionConditionNo6: string | number;
  /** 手数料条件値No6 */
  commissionConditionValueNo6: string | number;
  /** 手数料条件種類名No7 */
  commissionConditionKindNo7: string | number;
  /** 手数料条件区分名No7 */
  commissionConditionNo7: string | number;
  /** 手数料条件値No7 */
  commissionConditionValueNo7: string | number;
  /** 手数料条件種類名No8 */
  commissionConditionKindNo8: string | number;
  /** 手数料条件区分名No8 */
  commissionConditionNo8: string | number;
  /** 手数料条件値No8 */
  commissionConditionValueNo8: string | number;
  /** 手数料条件種類名No9 */
  commissionConditionKindNo9: string | number;
  /** 手数料条件区分名No9 */
  commissionConditionNo9: string | number;
  /** 手数料条件値No9 */
  commissionConditionValueNo9: string | number;
  /** 手数料条件種類名No10 */
  commissionConditionKindNo10: string | number;
  /** 手数料条件区分名No10 */
  commissionConditionNo10: string | number;
  /** 手数料条件値No10 */
  commissionConditionValueNo10: string | number;
  /** 手数料金額 */
  commissionPrice: string | number;
}

/** API-COM-0014-0003: 手数料テーブル詳細入力チェックAPI リクエスト */
export interface ScrCom0014CommissionCheckRequest {
  /** 手数料ID */
  commissionId: string;
  /** 利用開始日 */
  useStartDate: string;
  /** 条件設定セクション リスト */
  conditionSettingList: checkConditionSettingList[];
  /** 価格設定セクション リスト */
  priceSettingList: priceSettingList[];
  /** 業務日付 */
  businessDate: string;
}

/** API-COM-0014-0003: 手数料テーブル詳細入力チェックAPI レスポンス 条件設定セクション(リスト行) */
export interface checkConditionSettingList {
  /** 手数料条件種類No */
  commissionConditionKindNo: string | number;
  /** 条件種類コード */
  conditionKindCode: string | number;
  /** 手数料条件No */
  commissionConditionNo: string | number;
  /** 手数料条件区分 */
  commissionConditionKind: string | number;
  /** 手数料条件値 */
  commissionConditionValue: string | number;
}

/** API-COM-0014-0007: 手数料テーブル登録申請API リクエスト */
export interface ScrCom0014ApplyRegistrationCommissionInfoRequest {
  /** 変更履歴番号 */
  changeHistoryNumber: string;
  /** 手数料ID */
  commissionId: string;
  /** 手数料名 */
  commissionName: string;
  /** 手数料種類区分 */
  commissionKind: string;
  /** 手数料種類区分名 */
  commissionKindName: string;
  /** 稟議書ID */
  approvalDocumentId: string;
  /** 商品クレームコード */
  goodsClaimCode: string;
  /** 利用フラグ */
  useFlag: boolean;
  /** 計算書種別 */
  statementKind: string;
  /** 利用開始日 */
  useStartDate: string;
  /** 条件設定セクション リスト */
  conditionSettingList: conditionSettingList[];
  /** 価格設定セクション リスト */
  priceSettingList: priceSettingList[];
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
  /** 変更予定日 */
  changeExpectDate: string;
  /** 画面ID */
  screenId: string;
}

/** API-COM-0014-0008: 条件設定ワーク登録API リクエスト */
export interface ScrCom0014RegistrationWorkCommissionInfoRequest {
  /** ワークトランテーブル リスト情報 */
  registrationWorkCommissionList: RegistrationWorkCommissionList[];
}

/** API-COM-0014-0008: 条件設定ワーク登録API リクエスト(リスト行) */
export interface RegistrationWorkCommissionList {
  /** 手数料条件種類名No1 */
  commissionConditionKindNo1: string | number;
  /** 手数料条件区分名No1 */
  commissionConditionNo1: string | number;
  /** 手数料条件値No1 */
  commissionConditionValueNo1: string | number;
  /** 手数料条件種類名No2 */
  commissionConditionKindNo2: string | number;
  /** 手数料条件区分名No2 */
  commissionConditionNo2: string | number;
  /** 手数料条件値No2 */
  commissionConditionValueNo2: string | number;
  /** 手数料条件種類名No3 */
  commissionConditionKindNo3: string | number;
  /** 手数料条件区分名No3 */
  commissionConditionNo3: string | number;
  /** 手数料条件値No3 */
  commissionConditionValueNo3: string | number;
  /** 手数料条件種類名No4 */
  commissionConditionKindNo4: string | number;
  /** 手数料条件区分名No4 */
  commissionConditionNo4: string | number;
  /** 手数料条件値No4 */
  commissionConditionValueNo4: string | number;
  /** 手数料条件種類名No5 */
  commissionConditionKindNo5: string | number;
  /** 手数料条件区分名No5 */
  commissionConditionNo5: string | number;
  /** 手数料条件値No5 */
  commissionConditionValueNo5: string | number;
  /** 手数料条件種類名No6 */
  commissionConditionKindNo6: string | number;
  /** 手数料条件区分名No6 */
  commissionConditionNo6: string | number;
  /** 手数料条件値No6 */
  commissionConditionValueNo6: string | number;
  /** 手数料条件種類名No7 */
  commissionConditionKindNo7: string | number;
  /** 手数料条件区分名No7 */
  commissionConditionNo7: string | number;
  /** 手数料条件値No7 */
  commissionConditionValueNo7: string | number;
  /** 手数料条件種類名No8 */
  commissionConditionKindNo8: string | number;
  /** 手数料条件区分名No8 */
  commissionConditionNo8: string | number;
  /** 手数料条件値No8 */
  commissionConditionValueNo8: string | number;
  /** 手数料条件種類名No9 */
  commissionConditionKindNo9: string | number;
  /** 手数料条件区分名No9 */
  commissionConditionNo9: string | number;
  /** 手数料条件値No9 */
  commissionConditionValueNo9: string | number;
  /** 手数料条件種類名No10 */
  commissionConditionKindNo10: string | number;
  /** 手数料条件区分名No10 */
  commissionConditionNo10: string | number;
  /** 手数料条件値No10 */
  commissionConditionValueNo10: string | number;
}

/** API-COM-0014-0001: 手数料表示API */
export const ScrCom0014GetCommissionDisplay = async (
  request: ScrCom0014GetCommissionCurrentRequest
): Promise<ScrCom0014GetCommissionCurrentResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0014/get-commission-display-current-info',
    request
  );
  return response.data;
};

/** API-COM-0014-0003: 手数料テーブル詳細入力チェックAPI */
export const ScrCom0014CommissionCheck = async (
  request: ScrCom0014CommissionCheckRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0014/commission-check',
    request
  );
  return response.data;
};

/** API-COM-0014-0007: 手数料テーブル登録申請API */
export const ScrCom0014ApplyRegistrationCommissionInfo = async (
  request: ScrCom0014ApplyRegistrationCommissionInfoRequest
): Promise<void> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0014/apply-registration-commission-info',
    request
  );
  return response.data;
};
/** API-COM-0014-0008: 条件設定ワーク登録API */
export const ScrCom0014RegistrationWorkCommissionInfo = async (
  request: ScrCom0014RegistrationWorkCommissionInfoRequest
): Promise<void> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0014/registration-work-commission-info',
    request
  );
  return response.data;
};
