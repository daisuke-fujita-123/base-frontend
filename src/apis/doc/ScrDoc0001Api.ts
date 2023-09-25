import { docApiClient } from 'providers/ApiClient';

/** API-DOC-0001-0001 レスポンス */
/** バッチ管理マスタ情報取得 / batch-info-acquisition */
export interface ScrDoc0001BatchInfoAcquisitionResponse {
  /** 実行フラグ */
  executionFlg: boolean;
  /** 変更タイムスタンプ */
  changeTimestamp: string;
}

/** API-DOC-0001-0001 / バッチ管理マスタ情報取得API */
export const ScrDoc0001BatchInfoAcquisition = async (
  request: undefined
): Promise<ScrDoc0001BatchInfoAcquisitionResponse> => {
  const response = await docApiClient.post(
    '/api/doc/scr-doc-0001/batch-info-acquisition',
    request
  );
  return response.data;
};

/** API-DOC-0001-0002 リクエスト */
/** 書類情報一覧取得API / doc-list-acquisition */
export interface ScrDoc0001DocListAcquisitionRequest {
  /** オークション種類 */
  auctionKind: string[];
  /** 出品店契約ID */
  exhibitShopContractId: string;
  /** 落札店契約ID */
  bidShopContractId: string;
  /** 先出し対象フラグ */
  advanceTargetedFlag: boolean;
  /** 支払い延長サービスフラグ */
  paymentExtensionServiceFlag: boolean;
  /** オークション回数(FROM) */
  auctionCountFrom: string;
  /** オークション回数(TO) */
  auctionCountTo: string;
  /** 出品店名称 */
  exhibitShopName: string;
  /** 落札店名称 */
  bidShopName: string;
  /** 通知種類 */
  noticeKind: string;
  /** 車種 */
  cartype: string;
  /** オークション開催日(期間)(FROM) */
  auctionDatePeriodFrom: Date;
  /** オークション開催日(期間)(TO) */
  auctionDatePeriodTo: Date;
  /** 書類有効期限(FROM) */
  documentValidityDueDateFrom: Date;
  /** 書類有効期限(TO) */
  documentValidityDueDateTo: Date;
  /** 書類到着日(期間)(FROM) */
  documentArrivesPeriodFrom: Date;
  /** 書類到着日(期間)(TO） */
  documentArrivesPeriodTo: Date;
  /** 名変期日(FROM) */
  docChangeDueDateFrom: Date;
  /** 名変期日(TO) */
  docChangeDueDateTo: Date;
  /** 車台番号(フレームNO) */
  carbodyNumberFrameNo: string;
  /** 出品番号 */
  exhibitNumber: string[];
  /** 到着ステータス */
  arrivalStatus: string;
  /** 発送ステータス */
  shippingStatus: string;
  /** 入金ステータス */
  depositStatus: string;
  /** 名変ステータス */
  docChangeStatus: string;
  /** 会場コード */
  placeCode: string[];
}

/** API-DOC-0001-0002 レスポンス */
/** 書類情報一覧取得API / doc-list-acquisition */
export interface ScrDoc0001DocListAcquisitionResponse {
  /** 制限件数 */
  limitCount: string;
  /** 取得件数 */
  acquisitionCount: string;
  /** 返却件数 */
  responseCount: string;
  /** リスト */
  list: docListAcquisitionList[];
}

/** API-DOC-0001-0002 レスポンス */
/** 書類情報一覧取得API / doc-list-acquisition */
/** リスト / list */
export interface docListAcquisitionList {
  /** オークション会場 */
  auctionPlace: string;
  /** オークション回数 */
  auctionCount: string;
  /** オークション開催日 */
  auctionDate: Date;
  /** 出品番号 */
  exhibitNumber: string;
  /** 車名 */
  carName: string;
  /** グレード */
  grade: string;
  /** 車台番号 */
  carbodyNumber: string;
  /** 出品店契約ID */
  exhibitShopContractId: string;
  /** 出品店名 */
  exhibitShopName: string;
  /** 落札店契約ID */
  bidShopContractId: string;
  /** 落札店名 */
  bidShopName: string;
  /** 書類到着日 */
  documentArrivesDate: Date;
  /** 書類基本番号 */
  documentBasicsNumber: string;
  /** 名変督促FAX停止有無フラグ */
  docChangeDemandFaxStopExistenceFlag: boolean;
}

/** API-DOC-0001-0002 / 書類情報一覧取得API */
export const ScrDoc0001DocListAcquisition = async (
  request: ScrDoc0001DocListAcquisitionRequest
): Promise<ScrDoc0001DocListAcquisitionResponse> => {
  const response = await docApiClient.post(
    '/api/doc/scr-doc-0001/doc-list-acquisition',
    request
  );
  return response.data;
};

/** API-DOC-0001-0003 リクエスト */
/** 書類到着処理反映API / doc-arrives-apply */
export interface ScrDoc0001DocArrivesApplyRequest {
  /** 変更タイムスタンプ */
  changeTimestamp: Date;
}

/** API-DOC-0001-0003 レスポンス */
/** 書類到着処理反映API / doc-arrives-apply */
export interface ScrDoc0001DocArrivesApplyResponse {
  /** エラー内容リスト */
  errorList: errorList[];
}

/** API-DOC-0001-0003 レスポンス */
/** 書類到着処理反映API / doc-arrives-apply */
/** エラー内容リスト */
export interface errorList {
  /** エラーコード */
  errorCode: string;
  /** エラーメッセージ */
  errorMessage: string;
}

/** API-DOC-0001-0003 / 書類到着処理反映API */
export const ScrDoc0001DocArrivesApply = async (
  request: ScrDoc0001DocArrivesApplyRequest
): Promise<ScrDoc0001DocArrivesApplyResponse> => {
  const response = await docApiClient.post(
    '/api/doc/scr-doc-0001/doc-arrives-apply',
    request
  );
  return response.data;
};

/** API-DOC-0001-0004 リクエスト */
/** 帳票出力API / output-doc-report */
export interface ScrDoc0001OutputDocReportRequest {
  /** 帳票ID */
  reportId: string;
  /** 書類基本番号リスト */
  documentBasicsNumberList: string[];
  /** 帳票コメント */
  comment: string;
}

/** API-DOC-0001-0004 / 帳票出力API */
export const ScrDoc0001OutputDocReport = async (
  request: ScrDoc0001OutputDocReportRequest
): Promise<undefined> => {
  const response = await docApiClient.post(
    '/api/doc/scr-doc-0001/output-doc-report',
    request
  );
  return response.data;
};

/** API-DOC-0001-0005 リクエスト */
/** 物流拠点名称取得API / logistics-base-name-search */
export interface ScrDoc0001LogisticsBaseNameSearchRequest {
  /** 法人ID */
  corporationId: string;
  /** 物流拠点ID */
  logisticsBaseId: string;
  /** 物流拠点代表契約ID */
  logisticsBaseRepresentativeContractId: string;
}

/** API-DOC-0001-0005 レスポンス */
/** 物流拠点名称取得API / logistics-base-name-search */
export interface ScrDoc0001LogisticsBaseNameSearchResponse {
  /** リスト */
  list: logisticsBaseNameSearchList[];
}
/** API-DOC-0001-0005 レスポンス */
/** 物流拠点名称取得API / logistics-base-name-search */
/** リスト / list */
export interface logisticsBaseNameSearchList {
  /** 法人ID */
  corporationId: string;
  /** 物流拠点ID */
  logisticsBaseId: string;
  /** 物流拠点名称 */
  logisticsBaseName: string;
}

/** API-DOC-0001-0005 / 物流拠点名称取得API */
export const ScrDoc0001LogisticsBaseNameSearch = async (
  request: ScrDoc0001LogisticsBaseNameSearchRequest
): Promise<ScrDoc0001LogisticsBaseNameSearchResponse> => {
  const response = await docApiClient.post(
    '/api/doc/scr-doc-0001/logistics-base-name-search',
    request
  );
  return response.data;
};

/** API-DOC-0001-0006 リクエスト */
/** 契約ID取得API / contract-id-search */
export interface ScrDoc0001ContractIdSearchRequest {
  /** 法人ID */
  contractId?: string;
  /** 請求先ID */
  corporationId?: string;
}

/** API-DOC-0001-0006 レスポンス */
/** 契約ID取得API / contract-id-search */
export interface ScrDoc0001ContractIdSearchResponse {
  /** リスト */
  list: contractIdSearchList[];
}
/** API-DOC-0001-0006 レスポンス */
/** 契約ID取得API / contract-id-search */
/** リスト / list */
export interface contractIdSearchList {
  /** 契約ID */
  contractId: string;
  /** 法人ID */
  corporationId: string;
}

/** API-DOC-0001-0006 / 契約ID取得API */
export const ScrDoc0001ContractIdSearch = async (
  request: ScrDoc0001ContractIdSearchRequest
): Promise<ScrDoc0001ContractIdSearchResponse> => {
  const response = await docApiClient.post(
    '/api/doc/scr-doc-0001/contract-id-search',
    request
  );
  return response.data;
};

