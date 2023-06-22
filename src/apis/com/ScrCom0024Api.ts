import { comApiClient } from 'providers/ApiClient';

/** SCR-COM-0024-0001: ライブ会場データ取得APIリクエスト */
export interface ScrCom0024GetPlaceDataRequest {
    /** 業務日付 */
    businessDate: string;
    /** 会場コード */
    placeCd: string;
}

/** SCR-COM-0024-0001: ライブ会場データ取得APIレスポンス */
export interface ScrCom0024GetPlaceDataResponse {
    /** 会場コード　*/
    placeCd: string;
    /** 会場名　*/
    placeName: string;
    /** おまとめ会場フラグ　*/
    omatomePlaceFlag: boolean;
    /** 計算表示会場名　*/
    statementDisplayPlaceName: string;
    /** 利用フラグ　*/
    useFlag: boolean;
    /** 提携開始日　*/
    partnerStartDate: string;
    /** 開催曜日 */
    sessionWeekKind: string;
    /** 契約ID */
    contractId: string;
    /** 法人ID */
    corporationId: string;
    /** 法人名 */
    corporationName: string;
    /** 請求先ID */
    billingId: string;
    /** 事業拠点電話番号 */
    businessBasePhoneNumber: string
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
    /** ホンダグループ */
    hondaGroup: string;
    /** 保証金 */
    guaranteeDeposit: string;
    /** ライブ会場グループコード */
    livePlaceGroupCode: string;
    /** 書類発送指示フラグ */
    documentShippingInstructionFlag: boolean;
    /** 指示対象フラグ */
    documentShippingPlaceDirectDeliveryFlag: boolean;
    /** 担当者 */
    documentShippingStaff: string;
    /** 書類発送メールアドレス */
    documentShippingMailAddress: string;
    /** 書類発送FAX番号 */
    documentShippingFaxNumber: string;
    /** 出金期日 */
    paymentDueDate: string;
    /** 出金設定 */
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
    /** バーチャル口座付与ルール */
    virtualAccountGiveRuleCode: string;
    /** 支払通知フラグ */
    paymentNoticeFlag: boolean;
    /** 支払通知担当者 */
    paymentNoticeStaff: string;
    /** 支払通知メールアドレス */
    paymentNoticeMailAddress: string;
    /** 支払通知FAX番号 */
    paymentNoticeFaxNumber: string;
    /** 入金元銀行名 */
    receiptSourceBankCode: string;
    /** 入金元支店名 */
    receiptSourceBranchCode: string;
    /** 入金元口座名義 */
    receiptSourceAccountNameKana: string;
    /** 会場会員管理担当メールアドレス */
    placeMemberManagementStaffMailAddress: string;
    /** おまとめ会場連絡不可対象 */
    omatomePlaceContactImpossibleTargetedKind: string;
}

/** SCR-COM-0024-0001: ライブ会場データ取得API */
export const ScrCom0024GetPlaceData = async (
    request: ScrCom0024GetPlaceDataRequest
): Promise<ScrCom0024GetPlaceDataResponse> => {
    const response = await comApiClient.post(
        '/scr-com-0024/get-place-data',
        request
    );
    return response.data;
};
