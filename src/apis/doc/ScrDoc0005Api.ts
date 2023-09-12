import { docApiClient } from 'providers/ApiClient';

/** 書類基本情報取得APIリクエスト */
export interface ScrDoc0005DocumentBasicsInfoRequest {
  /** 書類基本番号 */
  documentBasicsNumber: number;
}

/** 書類基本情報取得APIレスポンス */
export interface ScrDoc0005DocumentBasicsInfoResponse {
  /** 書類基本番号 */
  documentBasicsNumber: number;
  /** オークション種類 */
  auctionKindName: string;
  /** オークション種類区分 */
  auctionKind: string;
  /** 会場名 */
  placeName: string;
  /** ホンダグループフラグ */
  hondaGroupFlag: boolean;
  /** 書類発送指示フラグ */
  documentShippingInstructionFlag: boolean;
  /** オークション回数 */
  auctionCount: number;
  /** オークション開催日 */
  auctionSessionDate: string;
  /** 出品番号 */
  exhibitNumber: string;
  /** キャンセルフラグ */
  cancelFlag: boolean;
  /** 車名 */
  carName: string;
  /** 車色 */
  carColor: string;
  /** 年式 */
  modelYear: string;
  /** 車台番号・フレームNo */
  carbodyNumberFrameNo: string;
  /** 車歴 */
  carHistoryKind: string;
  /** 8No区分 */
  no8Kind: string;
  /** 車検日 */
  carInspectionDate: string;
  /** 検付区分 */
  carInspectionKind: string;
  /** 排気量 */
  exhaust: string;
  /** 書類有無フラグ */
  documentExistenceFlag: boolean;
  /** 書類有無 */
  documentExistence: string;
  /** 先取種別 */
  preemptionKind: string;
  /** 引取予定日 */
  pickUpExpectDate: string;
  /** おまとめ車両パターン区分 */
  omatomeCarPatternKind: string;
  /** 支払延長対象区分 */
  paymentExtensionTargetedFlag: boolean;
  /** 支払延長対象車両 */
  paymentExtensionTargetedCar: string;
  /** 陸事コード */
  landCode: string;
  /** 登録番号1 */
  registrationNumber1: number;
  /** 登録番号2 */
  registrationNumber2: string;
  /** 登録番号3 */
  registrationNumber3: number;
  /** 出品店契約ID */
  exhibitShopContractId: string;
  /** 出品店法人ID */
  exhibitShopCorporationId: string;
  /** 出品店法人名称 */
  exhibitShopCorporationName: string;
  /** 出品店支払延長対象 */
  exhibitShopPaymentExtensionTargeted: string;
  /** 出品店会場書類発送日 */
  placeDocumentShippingDate: string;
  /** 出品店コース参加区分 */
  exhibitShopCourseEntryKind: string;
  /** 出品店譲渡書類送付先メールアドレス */
  exhibitShopAssignmentDocumentDestinationMailAddress: string;
  /** 出品店譲渡書類送付先都道府県名称 */
  exhibitShopAssignmentDocumentDestinationPrefectureName: string;
  /** 出品店譲渡書類送付先電話番号 */
  exhibitShopAssignmentDocumentDestinationPhoneNumber: string;
  /** 出品店譲渡書類送付先FAX番号 */
  exhibitShopAssignmentDocumentDestinationFaxNumber: string;
  /** 出品店クレーム担当従業員名 */
  exhibitShopClaimStaffName: string;
  /** 出品店会員メモ有無 */
  exhibitShopMemberMemo: string;
  /** 出品店二輪登録デポ */
  exhibitShopBikeRegistrationDepoName: string;
  /** 出品店二輪デポ区分 */
  exhibitShopBikeDepoKind: string;
  /** 落札店契約ID */
  bidShopContractId: string;
  /** 落札店法人ID */
  bidShopCorporationId: string;
  /** 落札店法人名称 */
  bidShopCorporationName: string;
  /** 落札店支払延長対象 */
  bidShopPaymentExtensionTargeted: string;
  /** 落札店コース参加区分 */
  bidShopCourseEntryKind: string;
  /** 落札店譲渡書類送付先メールアドレス */
  bidShopAssignmentDocumentDestinationMailAddress: string;
  /** 落札店譲渡書類送付先都道府県コード */
  bidShopAssignmentDocumentDestinationPrefectureName: string;
  /** 落札店譲渡書類送付先電話番号 */
  bidShopAssignmentDocumentDestinationPhoneNumber: string;
  /** 落札店譲渡書類送付先FAX番号 */
  bidShopAssignmentDocumentDestinationFaxNumber: string;
  /** 落札店クレーム担当従業員名 */
  bidShopClaimStaffName: string;
  /** 落札店会員メモ有無 */
  bidShopMemberMemo: string;
  /** 落札店二輪登録デポ */
  bidShopBikeRegistrationDepoName: string;
  /** 落札店二輪デポ区分 */
  bidShopBikeDepoKind: string;
  /** オークション結果トラン変更前タイムスタンプ */
  auctionResultTranChangeBeforeTimestamp: Date;
  /** 書類基本トラン変更前タイムスタンプ */
  documentBasicsTranChangeBeforeTimestamp: Date;
  /** 必須書類受付情報リスト */
  requiredDocumentReceptionInfoList: RequiredDocumentReceptionInfoList[];
  /** 任意書類受付情報リスト */
  optionalDocumentReceptionInfoList: OptionalDocumentReceptionInfoList[];
  /** 備品受付情報リスト */
  equipmentReceptionInfoList: EquipmentReceptionInfoList[];
  /** 到着ステータス */
  arrivesStatus: string;
  /** 書類到着完了日 */
  documentArrivesCompletionDate: string;
  /** 書類送付期限日 */
  documentSendingDueDate: string;
  /** 書類申告期限日 */
  documentReportDueDate: string;
  /** 書類実質期限日 */
  documentSubstanceDueDate: string;
  /** おまとめ書類発送先区分 */
  omatomeDocumentShippingDestinationKind: string;
  /** 書類・備品情報（書類）リスト */
  documentInfoList: DocumentInfoList[];
  /** 不備対応情報リスト */
  incompleteSupportList: IncompleteSupportList[];
  /** 書類・備品情報（備品）リスト */
  equipmentInfoList: EquipmentInfoList[];
  /** 保証 */
  guarantee: string;
  /** 取説 */
  manual: string;
  /** 記録 */
  record: string;
  /** 手帳 */
  notebook: string;
  /** 入金ステータス */
  receiptStatus: string;
  /** 入金完了日 */
  receiptCompletionDate: string;
  /** 名変期限日 */
  docChangeDueDate: string;
  /** 名義変更日 */
  docChangeDate: string;
  /** 名変実施タイムスタンプ */
  docChangeExecuteTimestamp: Date;
  /** 自税返金日 */
  carTaxCashBackDate: string;
  /** 二輪預かり金返金日 */
  bikeDepositCashBackDate: string;
  /** 詳細情報取得課金承認日 */
  detailsInformationAcquisitionChargesApprovalDate: string;
  /** 旧登録 */
  oldRegistration: string;
  /** 新陸事コード */
  newLandCode: string;
  /** 新登録番号1 */
  newRegistrationNumber1: string;
  /** 新登録番号2 */
  newRegistrationNumber2: string;
  /** 新登録番号3 */
  newRegistrationNumber3: string;
  /** 年額自動車税 */
  annualCarTax: number;
  /** 預かり自税総額 */
  depositCarTaxTotalAmount: number;
  /** リサイクル料預託金 */
  recyclePriceDeposit: number;
  /** 預かり金（二輪） */
  bikeDeposit: number;
  /** 出品店返金額 */
  exhibitShopCashBackAmount: number;
  /** 落札店返金額 */
  bidShopCashBackAmount: number;
  /** 書類メモ */
  documentMemo: string;
}

/** 書類基本情報登録APIリクエスト */
export interface ScrDoc0005RegistrationDocumentBasicsInfoRequest {
  /** 基本情報 */
  basicsInfo: ScrDoc0005DocumentBasicsInfoResponse &
    RegistrationDocumentBasicsAdditionalInfoRequest;
  /** 詳細情報 */
  documentDetailsInfo?: ScrDoc0005DocumentDetailsInfoResponse;
}
interface RegistrationDocumentBasicsAdditionalInfoRequest {
  /** 申請従業員ID */
  applicationEmployeeId: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: string;
}

/** 書類基本情報登録APIリクエスト */
// export interface ScrDoc0005RegistrationDocumentBasicsInfoRequest {
//   /** 書類基本番号 */
//   documentBasicsNumber: number;
//   /** オークション結果トラン変更前タイムスタンプ */
//   auctionResultTranChangeBeforeTimestamp: Date;
//   /** 書類基本トラン変更前タイムスタンプ */
//   documentBasicsTranChangeBeforeTimestamp: Date;
//   /** 落札店契約ID */
//   bidShopContractId: string;
//   /** 車台番号・フレームNo */
//   carbodyNumberFrameNo: string;
//   /** おまとめ車両パターン区分 */
//   omatomeCarPatternKind: string;
//   /** 会場書類発送日 */
//   placeDocumentShippingDate: string;
//   /** 書類受付情報リスト */
//   documentReceptionList: DocumentReceptionList;
//   /** 備品受付情報リスト */
//   equipmentReceptionList: EquipmentReceptionList;
//   /** おまとめ書類発送先区分 */
//   omatomeDocumentShippingDestinationKind: string;
//   /** 不備対応情報リスト */
//   incompleteSupportList: IncompleteSupportList;
//   /** 書類メモ */
//   documentMemo: string;
// }

/** 書類受付情報リスト */
interface DocumentReceptionList {
  /** 書類品目コード */
  documentItemCode: string;
  /** 書類連番 */
  documentNumber: number;
  /** 書類到着フラグ */
  documentArrivesFlag: boolean;
  /** 有効期限 */
  validityDueDate: string;
  /** 変更前タイムスタンプ */
  changeBeforeTimestamp: Date;
}

/** 備品受付情報リスト */
interface EquipmentReceptionList {
  /** 備品品目コード */
  equipmentItemCode: string;
  /** 備品連番 */
  equipmentNumber: number;
  /** 備品到着フラグ */
  equipmentArrivesFlag: boolean;
  /** その他備品品目名称 */
  othersEquipmentItemName: string;
  /** 変更前タイムスタンプ */
  changeBeforeTimestamp: Date;
}

/** 不備対応情報リスト */
interface IncompleteSupportList {
  /** 不備対応No */
  incompleteSupportNo: number;
  /** 不備対応日 */
  incompleteSupportDate: string;
  /** 不備対応ステータス */
  incompleteSupportStatus: string;
  /** 不備対応担当者名 */
  incompleteSupportStaffName: string;
  /** 不備属性区分 */
  incompleteAttributeKind: string;
  /** 変更前タイムスタンプ */
  changeBeforeTimestamp: Date;
}

/** 必須書類受付情報リスト */
interface RequiredDocumentReceptionInfoList {
  /** 書類品目コード */
  documentItemCode: string;
  /** 書類連番 */
  documentNumber: number;
  /** 書類品目名称 */
  documentItemName: string;
  /** 書類到着日 */
  documentArrivesDate: string;
  /** 有効期限フラグ */
  validityDueDateFlag: boolean;
  /** 有効期限日 */
  validityDueDate: string;
  /** 書類有無フラグ */
  documentExistenceFlag: boolean;
  /** おまとめ車両パターン区分 */
  omatomeCarPatternKind: string;
  /** 表示順 */
  displaySortOrder: number;
  /** 変更前タイムスタンプ */
  changeBeforeTimestamp: Date;
}

/** 任意書類受付情報リスト */
interface OptionalDocumentReceptionInfoList {
  /** 書類品目コード */
  documentItemCode: string;
  /** 書類連番 */
  documentNumber: number;
  /** 書類品目名称 */
  documentItemName: string;
  /** 書類到着日 */
  documentArrivesDate: string;
  /** 有効期限フラグ */
  validityDueDateFlag: boolean;
  /** 有効期限日 */
  validityDueDate: string;
  /** 書類有無フラグ */
  documentExistenceFlag: boolean;
  /** おまとめ車両パターン区分 */
  omatomeCarPatternKind: string;
  /** 表示順 */
  displaySortOrder: number;
  /** 変更前タイムスタンプ */
  changeBeforeTimestamp: Date;
}

/** 備品受付情報リスト */
interface EquipmentReceptionInfoList {
  /** 備品品目コード*/
  equipmentItemCode: string;
  /** 備品連番*/
  equipmentNumber: number;
  /** 備品品目名称*/
  equipmentItemName: string;
  /** 備品有無フラグ*/
  equipmentExistenceFlag: boolean;
  /** その他備品品目名称フラグ*/
  othersEquipmentItemNameFlag: boolean;
  /** その他備品品目名称*/
  othersEquipmentItemName: string;
  /** 備品到着日*/
  equipmentArrivesDate: string;
  /** 表示順*/
  displaySortOrder: number;
  /** 変更前タイムスタンプ*/
  changeBeforeTimestamp: Date;
}

/** 書類・備品情報（書類）リスト */
interface DocumentInfoList {
  /** 書類追加回数*/
  documentAdditionCount: string;
  /** 書類到着日*/
  documentArrivesDate: string;
  /** 書類発送日*/
  documentShippingDate: string;
  /** 最終入力従業員ID*/
  lastInputEmployeeId: string;
  /** 書類発送伝票種類区分/書類発送伝票番号	*/
  documentShippingSpecifySlipKindDocumentShippingSlipNumber: string;
}

/** 不備対応情報リスト */
interface IncompleteSupportList {
  /** 不備対応No*/
  incompleteSupportNo: number;
  /** 不備対応日*/
  incompleteSupportDate: string;
  /** 不備対応ステータス*/
  incompleteSupportStatus: string;
  /** 不備対応担当者名*/
  incompleteSupportStaffName: string;
  /** 不備属性区分*/
  incompleteAttributeKind: string;
  /** 変更前タイムスタンプ*/
  changeBeforeTimestamp: Date;
}

/** 書類・備品情報（備品）リスト */
interface EquipmentInfoList {
  /** 備品追加回数*/
  equipmentAdditionCount: string;
  /** 備品到着日*/
  equipmentArrivesDate: string;
  /** 備品発送日*/
  equipmentShippingDate: string;
  /** 備品最終入力従業員ID*/
  lastInputEmployeeId: string;
  /** 備品有無*/
  equipmentExistence: string;
  /** 備品発送伝票種類区分/備品発送伝票番号*/
  equipmentShippingSpecifySlipKindEquipmentShippingSlipNumber: string;
}

/** 書類詳細情報取得APIリクエスト */
export interface ScrDoc0005DocumentDetailsInfoRequest {
  /** 書類基本番号 */
  documentBasicsNumber: number;
}

/** 書類詳細情報取得APIレスポンス */
export interface ScrDoc0005DocumentDetailsInfoResponse {
  /** 書類基本番号 */
  documentBasicsNumber: number;
  /** オークション種類 */
  auctionKindName: string;
  /** オークション種類区分 */
  auctionKind: string;
  /** 会場名 */
  placeName: string;
  /** オークション回数 */
  auctionCount: string;
  /** オークション開催日 */
  auctionSessionDate: string;
  /** 出品番号 */
  exhibitNumber: string;
  /** 成約日 */
  purchaseDate: string;
  /** 変更前タイムスタンプ */
  changeBeforeTimestamp: Date;
  /** 車検元号区分 */
  carInspectionEraNameKind: string;
  /** 車検年 */
  carInspectionYear: string;
  /** 旧陸事コード */
  oldLandCode: string;
  /** 旧登録番号1 */
  oldRegistrationNumber1: string;
  /** 旧登録番号2 */
  oldRegistrationNumber2: string;
  /** 旧登録番号3 */
  oldRegistrationNumber3: string;
  /** 車種区分 */
  cartypeKind: string;
  /** 年額自動車税 */
  annualCarTax: number;
  /** 預り自税総額 */
  depositCarTaxTotalAmount: number;
  /** 二輪預り金 */
  bikeDeposit: number;
  /** リサイクル料預託金 */
  recyclePriceDeposit: number;
  /** 書類先出フラグ */
  documentAdvanceFlag: boolean;
  /** 備品先出フラグ */
  equipmentAdvanceFlag: boolean;
  /** 入金のみ打ち有無フラグ */
  receiptBeatExistenceFlag: boolean;
  /** 直送打ち有無フラグ */
  directDeliveryBeatExistenceFlag: boolean;
  /** 名変督促FAX停止有無フラグ */
  docChangeDemandFaxStopExistenceFlag: boolean;
  /** 詳細情報取得課金有無フラグ */
  detailsInformationAcquisitionChargesExistenceFlag: boolean;
  /** デフォルト伝票種類区分 */
  defaultSlipKind: string;
  /** 配送金額 */
  shippingAmount: number;
  /** 書類遅延ペナルティ除外フラグ */
  documentPenaltyExclusionFlag: boolean;
  /** 書類遅延ペナルティ種別 */
  documentPenaltyKind: string;
  /** 書類遅延ペナルティ金額 */
  documentPenaltyPrice: number;
  /** 書類遅延日数 */
  documentDelayDays: string;
  /** 書類送付期限日 */
  documentSendingDueDate: string;
  /** 早期名変ペナルティ除外フラグ */
  earlyDocChangePenaltyExclusionFlag: boolean;
  /** 早期名変ペナルティ種別 */
  earlyDocChangePenaltyKind: string;
  /** 早期名変ペナルティ金額 */
  earlyDocChangePenaltyPrice: number;
  /** 早期名変遅延日数 */
  earlyDocChangeDelayDays: string;
  /** 名変遅延ペナルティ除外フラグ */
  docChangePenaltyExclusionFlag: boolean;
  /** 名変遅延ペナルティ種別 */
  docChangePenaltyKind: string;
  /** 名変遅延ペナルティ金額 */
  docChangePenaltyPrice: number;
  /** 名変遅延日数 */
  docChangeDelayDays: string;
  /** 名変期限日 */
  docChangeDueDate: string;
  /** 出品店契約ID */
  exhibitShopContractId: string;
  /** 出品店事業拠点名称 */
  exhibitShopBusinessBaseName: string;
  /** 出品店事業拠点電話番号 */
  exhibitShopBusinessBasePhoneNumber: string;
  /** 出品店譲渡書類送付先FAX番号 */
  exhibitShopAssignmentDocumentDestinationFaxNumber: string;
  /** 出品店事業拠点郵便番号 */
  exhibitShopBusinessBaseZipCode: string;
  /** 出品店住所 */
  exhibitShopAddress: string;
  /** 出品店伝票種類区分 */
  exhibitShopSlipKind: string;
  /** 出品店書類発送住所 */
  exhibitShopDocumentShippingAddress: string;
  /** 落札店契約ID */
  bidShopContractId: string;
  /** 落札店事業拠点名称 */
  bidShopBusinessBaseName: string;
  /** 落札店事業拠点電話番号 */
  bidShopBusinessBasePhoneNumber: string;
  /** 落札店譲渡書類送付先FAX番号 */
  bidShopAssignmentDocumentDestinationFaxNumber: string;
  /** 落札店事業拠点郵便番号 */
  bidShopBusinessBaseZipCode: string;
  /** 落札店住所 */
  bidShopAddress: string;
  /** 落札店伝票種類区分 */
  bidShopSlipKind: string;
  /** 落札店書類発送住所 */
  bidShopDocumentShippingAddress: string;
  /** おまとめ書類発送止めフラグ */
  omatomeDocumentShippingStopFlag: boolean;
  /** おまとめ備品発送止めフラグ */
  omatomeEquipmentShippingStopFlag: boolean;
}

/** 変更履歴情報取得APIリクエスト */
export interface ScrDoc0005ChangeHistoryInfoRequest {
  /** 書類基本番号 */
  documentBasicsNumber: number;
}

/** 変更履歴情報取得APIレスポンス */
export interface ScrDoc0005ChangeHistoryInfoResponse {
  /** 変更履歴リスト */
  changeHistoryList: ChangeHistoryInfo[];
  /** 未承認リスト */
  unapprovedList: UnapprovedList[];
}

/** 変更履歴リスト */
interface ChangeHistoryInfo {
  /** 変更履歴番号 */
  changeHistoryNumber: number;
  /** 画面名 */
  screenName: string;
  /** タブ名称 */
  tabName: string;
  /** 一括登録 */
  allRegistrationName: string;
  /** 変更予定日 */
  changeExpectDate: string;
  /** 変更申請従業員ＩＤ */
  changeApplicationEmployeeId: string;
  /** 変更申請従業員名 */
  changeApplicationEmployeeName: string;
  /** 変更申請タイムスタンプ */
  changeApplicationTimestamp: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 承認従業員ID */
  approvalEmployeeId: string;
  /** 承認従業員名 */
  approvalEmployeeName: string;
  /** 承認タイムスタンプ */
  approvalTimestamp: string;
  /** 承認者コメント */
  approverComment: string;
}

/** 未承認リスト */
interface UnapprovedList {
  /** 変更履歴番号 */
  changeHistoryNumber: number;
  /** 画面名 */
  screenName: string;
  /** タブ名称 */
  tabName: string;
  /** 一括登録名称 */
  allRegistrationName: string;
  /** 変更予定日 */
  changeExpectDate: string;
  /** 変更申請従業員ＩＤ */
  changeApplicationEmployeeId: string;
  /** 変更申請従業員名 */
  changeApplicationEmployeeName: string;
  /** 変更申請タイムスタンプ */
  changeApplicationTimestamp: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 承認ステータス */
  approvalStatus: string;
  /** 1次承認設定従業員ID */
  firstApprovalEmployeeId: string;
  /** 1次承認従業員名 */
  firstApprovalEmployeeName: string;
  /** 2次承認設定従業員ID */
  secondApprovalEmployeeId: string;
  /** 2次承認従業員名 */
  secondApprovalEmployeeName: string;
  /** 3次承認設定従業員ID */
  thirdApprovalEmployeeId: string;
  /** 3次承認従業員名 */
  thirdApprovalEmployeeName: string;
  /** 4次承認設定従業員ID */
  fourthApprovalEmployeeId: string;
  /** 4次承認従業員名 */
  fourthApprovalEmployeeName: string;
}

/** 変更履歴断面情報取得APIリクエスト */
export interface ScrDoc0005ChangeHistoryCrossSectionInfoRequest {
  /** 書類基本番号 */
  changeHistoryNumber: number;
}

/** 変更履歴断面情報取得APIレスポンス */
export interface ScrDoc0005ChangeHistoryCrossSectionInfoResponse {
  /** 変更履歴番号 */
  changeHistoryNumber: number;
  /** 明細断面情報 */
  detailsCross_sectionInfo: DetailsCrossSectionInfo;
}

/** 明細断面情報 */
interface DetailsCrossSectionInfo {
  /** 基本情報 */
  basicsInfo: ScrDoc0005DocumentBasicsInfoResponse;
  /** 詳細情報 */
  documentDetailsInfo: ScrDoc0005DocumentDetailsInfoResponse;
}

/** 変更履歴断面情報登録APIリクエスト */
export interface ScrDoc0005RegistrationChangeHistoryCrossSectionInfoRequest {
  /** 明細断面情報 */
  detailsCross_sectionInfo: {
    /** 基本情報 */
    basicsInfo: ScrDoc0005DocumentBasicsInfoResponse;
    /** 詳細情報 */
    documentDetailsInfo: ScrDoc0005DocumentDetailsInfoResponse;
  };
}

/** 書類詳細情報入力チェックリクエスト */
export interface ScrDoc0005CheckDocumentDetailsInfoRequest {
  /** 書類基本番号 */
  documentBasicsNumber: number;
}

/** 書類詳細情報入力チェックレスポンス */
export interface ScrDoc0005CheckDocumentDetailsInfoResponse {
  /** エラー内容リスト */
  errorList: ErrorList[];
}

/** エラー内容リスト */
interface ErrorList {
  /** エラーコード */
  errorCode: string;
  /** エラーメッセージ */
  errorMessage: string;
}

/** ワーニング内容リスト */
interface WarnList {
  /** ワーニングコード */
  warnCode: string;
  /** ワーニングメッセージ */
  warnMessage: string;
}

/** 書類詳細情報登録リクエスト */
export interface ScrDoc0005RegistrationDocumentDetailsInfoRequest {
  /** 基本情報 */
  basicsInfo?: ScrDoc0005DocumentBasicsInfoResponse;
  /** 詳細情報 */
  documentDetailsInfo: ScrDoc0005DocumentDetailsInfoResponse &
    RegistrationDocumentDetailsAdditionalInfoRequest;
}

// export interface ScrDoc0005RegistrationDocumentDetailsInfoRequest {
//   /** 変更履歴番号 */
//   changeHistoryNumber: number;
//   /** 書類基本番号 */
//   documentBasicsNumber: number;
//   /** 変更前タイムスタンプ */
//   changeBfrTimestamp: Date;
//   /** 車種区分 */
//   cartypeKind: string;
//   /** 車検有無フラグ */
//   carInspectionExistenceFlag: boolean;
//   /** 車検元号区分 */
//   carInspectionEraNameKind: string;
//   /** 車検年 */
//   carInspectionYear: number;
//   /** 旧陸事コード */
//   oldLandCode: string;
//   /** 旧登録番号1 */
//   oldRegistrationNumber1: string;
//   /** 旧登録番号2 */
//   oldRegistrationNumber2: string;
//   /** 旧登録番号3 */
//   oldRegistrationNumber3: string;
//   /** 年額自動車税 */
//   annualCarTax: number;
//   /** 預かり自税総額 */
//   depositCarTaxTotalAmount: number;
//   /** リサイクル料 */
//   recyclePriceDeposit: number;
//   /** 二輪預り金 */
//   bikeDeposit: number;
//   /** 書類先出しフラグ */
//   documentAdvanceFlag: boolean;
//   /** 備品先出フラグ */
//   equipmentAdvanceFlag: boolean;
//   /** 入金のみ打ちフラグ */
//   receiptBeatExistenceFlag: boolean;
//   /** 直送打ちフラグ */
//   directDeliveryBeatExistenceFlag: boolean;
//   /** 名変督促FAX停止フラグ */
//   docChangeDemandFaxStopExistenceFlag: boolean;
//   /** 詳細情報取得課金フラグ */
//   detailsInformationAcquisitionChargesExistenceFlag: boolean;
//   /** デフォルト伝票種類区分 */
//   defaultSlipKind: string;
//   /** 配送金額 */
//   shippingAmount: number;
//   /** ペナルティ情報リスト */
//   penaltyInfoList: PenaltyInfoList;
//   /** 書類送付期限日 */
//   documentSendingDueDate: string;
//   /** 名変期限日 */
//   docChangeDueDate: string;
//   /** おまとめ書類発送止めフラグ */
//   omatomeDocumentShippingStopFlag: boolean;
//   /** おまとめ備品発送止めフラグ */
//   omatomeEquipmentShippingStopFlag: boolean;
//   /** 変更後タイムスタンプ */
//   changeAftTimestamp: Date;
//   /** 変更履歴管理トラン情報リスト */
//   changeHistoryManagementTranInfoList: ChangeHistoryManagementTranInfoList;
//   /** 書類基本更新項目情報トラン情報リスト */
//   documentBasicsUpdateColumnInformationTranInfoList: DocumentBasicsUpdateColumnInformationTranInfoList;
//   /** 申請トラン情報リスト */
//   applicationTranInfoList: ApplicationTranInfoList;
//   /** 承認設定者トラン情報リスト */
//   settingApproverTranInfoList: SettingApproverTranInfoList;
// }
interface RegistrationDocumentDetailsAdditionalInfoRequest {
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
  /** 申請従業員ID */
  applicationEmployeeId: string;
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: string;
}

/** ペナルティ情報リスト */
interface PenaltyInfoList {
  /** ペナルティ種別 */
  penaltyKind: string;
  /** ペナルティ除外フラグ */
  penaltyExclusionFlag: boolean;
  /** ペナルティ金額 */
  penaltyPrice: number;
  /** 遅延日数 */
  delayDays: number;
  /** 遅延ペナルティ更新項目リスト */
  penaltyChangecolumnList: PenaltyChangecolumnList;
}

/** 遅延ペナルティ更新項目リスト */
interface PenaltyChangecolumnList {
  /** 変更項目名 */
  changeColumnName: string;
}

/** 変更履歴管理トラン情報リスト */
interface ChangeHistoryManagementTranInfoList {
  /** マスタID */
  masterId: number;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 変更予定日 */
  changeExpectDate: string;
  /** 従業員ID */
  changeApplicationEmployeeId: string;
  /** 変更後タイムスタンプ */
  changeApplicationTimestamp: Date;
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: number;
  /** 一括登録ID */
  allRegistrationId: string;
  /** プログラムID */
  programId: string;
}

/** 書類基本更新項目情報トラン情報リスト */
interface DocumentBasicsUpdateColumnInformationTranInfoList {
  /** 変更項目No */
  changeColumnNo: number;
  /** 変更テーブル物理名 */
  changeTablePhysicsName: string;
  /** 変更項目物理名 */
  changeColumnPhysicsName: string;
  /** プライマリキー値 */
  primaryKeyValue: string;
  /** 従業員ID */
  changeApplicationEmployeeId: string;
  /** プログラムID */
  programId: string;
}

/** 申請トラン情報リスト */
interface ApplicationTranInfoList {
  /** 承認種類ID */
  approvalKindId: string;
  /** 申請コメント */
  applicationComment: string;
  /** 承認ステータス */
  approvalStatus: string;
  /** 従業員ID */
  changeApplicationEmployeeId: string;
  /** プログラムID */
  programId: string;
}
/** 承認設定者トラン情報リスト */
interface SettingApproverTranInfoList {
  /** 承認設定ステップNo */
  approvalSettingStepNo: number;
  /** 承認従業員ID */
  approvalSettingEmployeeId: string;
  /** 従業員ID */
  changeApplicationEmployeeId: string;
  /** プログラムID */
  programId: string;
}

/** 書類情報詳細承認後処理リクエスト */
export interface ScrDoc0005Request {
  /** 変更履歴番号 */
  changeHistoryNumber: number;
}

/** 書類基本情報取得API */
export const ScrDoc0005DocumentBasicsInfo = async (
  request: ScrDoc0005DocumentBasicsInfoRequest
): Promise<ScrDoc0005DocumentBasicsInfoResponse> => {
  const response = await docApiClient.post(
    '/doc/scr-doc-0005/document-basics-info',
    request
  );
  return response.data;
};

/** 書類基本情報登録API */
export const ScrDoc0005RegistrationDocumentBasicsInfo = async (
  request: ScrDoc0005RegistrationDocumentBasicsInfoRequest
): Promise<null> => {
  const response = await docApiClient.post(
    '/doc/scr-doc-0005/registration-document-basics-info',
    request
  );
  return response.data;
};

/** 書類詳細情報取得API */
export const ScrDoc0005DocumentDetailsInfo = async (
  request: ScrDoc0005DocumentDetailsInfoRequest
): Promise<ScrDoc0005DocumentDetailsInfoResponse> => {
  const response = await docApiClient.post(
    '/doc/scr-doc-0005/document-details-info',
    request
  );
  return response.data;
};

/** 書類詳細情報登録API */
export const ScrDoc0005RegistrationDocumentDetailsInfo = async (
  request: ScrDoc0005RegistrationDocumentDetailsInfoRequest
): Promise<null> => {
  const response = await docApiClient.post(
    '/doc/scr-doc-0005/registration-document-details-info',
    request
  );
  return response.data;
};

/** 変更履歴取得API */
export const ScrDoc0005ChangeHistoryInfo = async (
  request: ScrDoc0005ChangeHistoryInfoRequest
): Promise<ScrDoc0005ChangeHistoryInfoResponse> => {
  const response = await docApiClient.post(
    '/doc/scr-doc-0005/change-history-info',
    request
  );
  return response.data;
};

/** 変更履歴断面情報取得API */
export const ScrDoc0005ChangeHistoryCrossSectionInfo = async (
  request: ScrDoc0005ChangeHistoryCrossSectionInfoRequest
): Promise<ScrDoc0005ChangeHistoryCrossSectionInfoResponse> => {
  const response = await docApiClient.post(
    '/doc/scr-doc-0005/change-history-cross_section-info',
    request
  );
  return response.data;
};

/** 変更履歴断面情報登録API */
export const ScrDoc0005RegistrationChangeHistoryCrossSectionInfo = async (
  request: ScrDoc0005RegistrationChangeHistoryCrossSectionInfoRequest
): Promise<null> => {
  const response = await docApiClient.post(
    '/doc/scr-doc-0005/registration-change-history-cross_section-info',
    request
  );
  return response.data;
};

/** 書類詳細情報入力チェックAPI */
export const ScrDoc0005CheckDocumentDetailsInfo = async (
  request: ScrDoc0005CheckDocumentDetailsInfoRequest
): Promise<ScrDoc0005CheckDocumentDetailsInfoResponse> => {
  const response = await docApiClient.post(
    '/doc/scr-doc-0005/check-document-details-info',
    request
  );
  return response.data;
};

/** 書類情報詳細承認後処理API */
export const ScrDoc0005Request = async (
  request: ScrDoc0005Request
): Promise<null> => {
  const response = await docApiClient.post('/doc/scr-doc-0005/', request);
  return response.data;
};

