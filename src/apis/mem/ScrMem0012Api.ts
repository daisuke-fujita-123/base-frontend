import { comApiClient, memApiClient } from 'providers/ApiClient';

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
  // 法人電話番号
  corporationPhoneNumber: string;
  // 法人FAX番号
  corporationFaxNumber: string;
  // 会員メモ
  memberMemo: string;
}

/** 法人基本情報取得API */
export const ScrMem9999GetCorpBasicInfo = async (
  request: ScrMem9999GetCorpBasicInfoRequest
): Promise<ScrMem9999GetCorpBasicInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-corp-basic-info',
    request
  );
  return response.data;
};

/** 物流拠点基本情報取得APIリクエスト */
export interface ScrMem0012GetLogisticsBaseBasicInfoRequest {
  // 法人ID
  corporationId: string;
  // 物流拠点ID
  logisticsBaseId: string;
}

/** 物流拠点基本情報取得APIレスポンス */
export interface ScrMem0012GetLogisticsBaseBasicInfoResponse {
  // 四輪情報フラグ
  tvaaInformationFlag: string;
  // 二輪情報フラグ
  bikeInformationFlag: string;
  // 集荷情報フラグ
  collectionInformationFlag: string;
  // 物流拠点代表契約ID
  logisticsBaseRepresentContractId: string;
  // 物流拠点ID
  logisticsBaseId: string;
  // 物流拠点名
  logisticsBaseName: string;
  // 物流拠点名カナ
  logisticsBaseNameKana: string;
  // 顧客表示用名称選択
  logisticsBaseClientDisplayNameFlag: string;
  // 顧客表示用名称
  logisticsBaseClientDisplayName: string;
  // 郵便番号
  logisticsBaseZipCode: string;
  // 都道府県コード
  logisticsBasePrefectureCode: string;
  // 市区町村
  logisticsBaseMunicipalities: string;
  // 番地・号・建物名など
  logisticsBaseAddressBuildingName: string;
  // TEL
  logisticsBasePhoneNumber: string;
  // FAX
  logisticsBaseFaxNumber: string;
  // メールアドレス
  logisticsBaseMailAddress: string;
  // 地区コード
  regionCode: string;
  // 市区郡コード
  districtCode: string;
  // 出品セグメントコード
  exhibitSegmentCode: string;
  // 出品メーカーコード
  exhibitMakerCode: string;
  // 営業エリアID
  salesAreaId: string;
  // 拠点担当者
  logisticsBaseStaffName: string;
  // 定休日
  closedDate: string;
  // 新規営業（四輪）
  tvaaNewSalesId: string;
  // 営業（四輪）１
  tvaaSalesId1: string;
  // 営業（四輪）２
  tvaaSalesId2: string;
  // 営業（四輪）３
  tvaaSalesId3: string;
  // 新規営業（二輪）
  bikeNewSalesId: string;
  // 営業（二輪）1
  bikeSalesId1: string;
  // 営業（二輪）2
  bikeSalesId2: string;
  // 営業（二輪）3
  bikeSalesId3: string;
  // 四輪担当者
  tvaaStaffName: string;
  // 四輪担当者連絡先
  tvaaStaffContactPhoneNumber: string;
  // 四輪連携情報
  tvaaLinkInformation: string;
  // 二輪担当者
  bikeStaffName: string;
  // 二輪担当者連絡先
  bikeStaffContactPhoneNumber: string;
  // 二輪デポ区分
  bikeDepoKind: string;
  // 二輪登録デポ
  bikeRegistrationDepoCode: string;
  // 二輪所属区分
  bikeBelongKind: string;
  // 二輪県No
  bikePrefectureNo: string;
  // 二輪地域No
  bikeRegionNo: string;
  // 二輪連携情報
  bikeLinkInformation: string;
  // 二輪車両引取先物流拠点情報同期フラグ
  bikePickUpLogisticsBaseInformationSynchronizationFlag: boolean;
  // 二輪車両引取先郵便番号
  bikePickUpZipCode: string;
  // 二輪車両引取先都道府県ID
  bikePickUpPrefectureId: string;
  // 二輪車両引取先市区町村
  bikePickUpMunicipalities: string;
  // 二輪車両引取先番地・号・建物名など
  bikePickUpAddressBuildingName: string;
  // 二輪車両引取先TEL
  bikePickUpPhoneNumber: string;
  // 二輪車両引取先FAX
  bikePickUpFaxNumber: string;
  // 集荷担当者
  collectionStaffName: string;
  // 集荷担当者連絡先
  collectionStaffContactPhoneNumber: string;
  // 集荷責任者
  manager: string;
  // 集荷責任者連絡先
  managerPhoneNumber: string;
  // 集荷曜日（四輪）
  tvaaCollectionWeek: string;
  // 検査曜日（四輪）
  tvaaInspectionWeek: string;
  // 検査員（四輪）
  tvaaInspectorCode: string;
  // 担当者FAX
  collectionStaffContactFaxNumber: string;
  // 集荷曜日（二輪）
  bikeCollectionWeek: string;
  // 検査曜日（二輪）
  bikeInspectionWeek: string;
  // 検査員（二輪）
  bikeInspectorCode: string;
  // 連携情報
  collaborationInfo: string;
  // FAX送信区分ID
  faxSendKind: string;
  // 出品ブロックフラグID
  exhibitBlockKind: string;
  // クレーム担当（四輪）ID
  tvaaClaimStaffId: string;
  // クレーム担当（四輪）名
  tvaaClaimStaffName: string;
  // クレーム担当（二輪）ID
  bikeClaimStaffId: string;
  // クレーム担当（二輪）名
  bikeClaimStaffName: string;
  // 四輪出力フラグID
  tvaaListOutputKind: string;
  // 二輪出力フラグID
  bikeListOutputKind: string;
  // 振替営業エリアID
  transferSalesAreaCode: string;
}

/** 物流拠点基本情報取得API */
export const ScrMem0012GetLogisticsBaseBasicInfo = async (
  request: ScrMem0012GetLogisticsBaseBasicInfoRequest
): Promise<ScrMem0012GetLogisticsBaseBasicInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0012/get-logistics-base-basic-info',
    request
  );
  return response.data;
};

/** コード管理マスタ情報取得API（複数取得）リクエスト */
export interface ScrCom9999GetCodeManagementMasterMultipleRequest {
  // コードIDリスト
  codeIdList: CodeIdList[];
}

// コードIDリスト
export interface CodeIdList {
  // コードID
  codeId: string;
}

/** コード管理マスタ情報取得API（複数取得）レスポンス */
export interface ScrCom9999GetCodeManagementMasterMultipleResponse {
  // 結果リスト
  resultList: ResultList[];
}

// 結果リスト
export interface ResultList {
  // コードID
  codeId: string;
  // コード値リスト
  codeValueList: CodeValueList[];
}

// コード値リスト
export interface CodeValueList {
  // コード値
  codeValue: string;
  // コード名称
  codeName: string;
}

/** コード管理マスタ情報取得API（複数取得） */
export const ScrCom9999GetCodeManagementMasterMultiple = async (
  request: ScrCom9999GetCodeManagementMasterMultipleRequest
): Promise<ScrCom9999GetCodeManagementMasterMultipleResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-9999/get-code-management-master-multiple',
    request
  );
  return response.data;
};

/** 会員管理コード値取得API（コード管理マスタ以外）リクエスト */
export interface ScrMem9999GetCodeValueRequest {
  // エンティティリスト
  entityList: EntityList[];
}

// コードIDリスト
export interface EntityList {
  // エンティティ名
  entityName: string;
}

/** 会員管理コード値取得API（コード管理マスタ以外）レスポンス */
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

// コード値リスト
export interface CodeValueList {
  // コード値
  codeValue: string;
  // コード値名称
  codeValueName: string;
  // コード値名称カナ
  codeValueNameKana: string;
}

/** 会員管理コード値取得API（コード管理マスタ以外） */
export const ScrMem9999GetCodeValue = async (
  request: ScrMem9999GetCodeValueRequest
): Promise<ScrMem9999GetCodeValueResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-code-value',
    request
  );
  return response.data;
};

/** 共通管理コード値取得API（コード管理マスタ以外）リクエスト */
export interface ScrCom9999GetCodeValueRequest {
  // エンティティリスト
  entityList: EntityList[];
}

/** 共通管理コード値取得API（コード管理マスタ以外）レスポンス */
export interface ScrCom9999GetCodeValueResponse {
  // 結果リスト
  resultList: ResultList[];
}

/** 共通管理コード値取得API（コード管理マスタ以外）*/
export const ScrCom9999GetCodeValue = async (
  request: ScrCom9999GetCodeValueRequest
): Promise<ScrCom9999GetCodeValueResponse> => {
  const response = await comApiClient.post(
    'com/scr-com-9999/get-code-value',
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

/** 物流拠点代表契約ID取得API */
export const ScrMem9999GetLogisticsBaseRepresentativeContract = async (
  request: ScrMem9999GetLogisticsBaseRepresentativeContractRequest
): Promise<ScrMem9999GetLogisticsBaseRepresentativeContractResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-logistics-base-representative-contract',
    request
  );
  return response.data;
};

/** 従業員情報取得APIリクエスト */
export interface ScrCom9999GetStaffRequest {
  // 従業員ID
  employeeId: string;
  // 業務日付
  businessDate: Date;
  // 営業担当フラグ
  salesStaffFlag: boolean;
  // 検査員フラグ
  inspectorFlag: boolean;
}

/** 従業員情報取得APIレスポンス */
export interface ScrCom9999GetStaffResponse {
  // リスト
  list: List[];
}

// リスト
export interface List {
  // 従業員ID
  employeeId: string;
  // 従業員名
  employeeName: string;
}

/** 従業員情報取得API */
export const ScrCom9999GetStaff = async (
  request: ScrCom9999GetStaffRequest
): Promise<ScrCom9999GetStaffResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-9999/get-staff',
    request
  );
  return response.data;
};

/** 従業員情報取得APIリクエスト */
export interface ScrCom9999GetHistoryInfoRequest {
  // 画面ID
  screenId: string;
  // タブID
  tabId: number;
  // マスタID
  masterId: string;
  // 業務日付
  businessDate: Date;
}

/** 従業員情報取得APIレスポンス */
export interface ScrCom9999GetHistoryInfoResponse {
  // 変更予定日情報
  changeExpectDateInfo: ChangeExpectDateInfo[];
}

// 変更予定日情報
export interface ChangeExpectDateInfo {
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectDate: string;
}

/** 従業員情報取得API */
export const ScrCom9999GetHistoryInfo = async (
  request: ScrCom9999GetHistoryInfoRequest
): Promise<ScrCom9999GetHistoryInfoResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-9999/get-history-info',
    request
  );
  return response.data;
};

/** 変更履歴情報取得APIリクエスト */
export interface ScrMem9999GetHistoryInfoRequest {
  // 申請ID/変更履歴番号
  changeHistoryNumber: string;
}

/** 変更履歴情報取得APIレスポンス */
export interface ScrMem9999GetHistoryInfoResponse {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 住所
  address: string;
  // 法人電話番号
  corporationPhoneNumber: string;
  // 法人FAX番号
  corporationFaxNumber: string;
  // 会員メモ
  memberMemo: string;
  // 四輪情報フラグ
  tvaaInformationFlag: string;
  // 二輪情報フラグ
  bikeInformationFlag: string;
  // 集荷情報フラグ
  collectionInformationFlag: string;
  // 物流拠点代表契約ID
  logisticsBaseRepresentContractId: string;
  // 物流拠点ID
  logisticsBaseId: string;
  // 物流拠点名
  logisticsBaseName: string;
  // 物流拠点名カナ
  logisticsBaseNameKana: string;
  // 顧客表示用名称選択
  logisticsBaseClientDisplayNameFlag: string;
  // 顧客表示用名称
  logisticsBaseClientDisplayName: string;
  // 郵便番号
  logisticsBaseZipCode: string;
  // 都道府県コード
  logisticsBasePrefectureCode: string;
  // 市区町村
  logisticsBaseMunicipalities: string;
  // 番地・号・建物名など
  logisticsBaseAddressBuildingName: string;
  // TEL
  logisticsBasePhoneNumber: string;
  // FAX
  logisticsBaseFaxNumber: string;
  // メールアドレス
  logisticsBaseMailAddress: string;
  // 地区コード
  regionCode: string;
  // 市区郡コード
  districtCode: string;
  // 出品セグメントコード
  exhibitSegmentCode: string;
  // 出品メーカーコード
  exhibitMakerCode: string;
  // 営業エリアID
  salesAreaId: string;
  // 拠点担当者
  logisticsBaseStaffName: string;
  // 定休日
  closedDate: string;
  // 新規営業（四輪）
  tvaaNewSalesId: string;
  // 営業（四輪）１
  tvaaSalesId1: string;
  // 営業（四輪）２
  tvaaSalesId2: string;
  // 営業（四輪）３
  tvaaSalesId3: string;
  // 新規営業（二輪）
  bikeNewSalesId: string;
  // 営業（二輪）1
  bikeSalesId1: string;
  // 営業（二輪）2
  bikeSalesId2: string;
  // 営業（二輪）3
  bikeSalesId3: string;
  // 四輪担当者
  tvaaStaffName: string;
  // 四輪担当者連絡先
  tvaaStaffContactPhoneNumber: string;
  // 四輪連携情報
  tvaaLinkInformation: string;
  // 二輪担当者
  bikeStaffName: string;
  // 二輪担当者連絡先
  bikeStaffContactPhoneNumber: string;
  // 二輪デポ区分
  bikeDepoKind: string;
  // 二輪登録デポ
  bikeRegistrationDepoCode: string;
  // 二輪所属区分
  bikeBelongKind: string;
  // 二輪県No
  bikePrefectureNo: string;
  // 二輪地域No
  bikeRegionNo: string;
  // 二輪連携情報
  bikeLinkInformation: string;
  // 二輪車両引取先物流拠点情報同期フラグ
  bikePickUpLogisticsBaseInformationSynchronizationFlag: boolean;
  // 二輪車両引取先郵便番号
  bikePickUpZipCode: string;
  // 二輪車両引取先都道府県ID
  bikePickUpPrefectureId: string;
  // 二輪車両引取先市区町村
  bikePickUpMunicipalities: string;
  // 二輪車両引取先番地・号・建物名など
  bikePickUpAddressBuildingName: string;
  // 二輪車両引取先TEL
  bikePickUpPhoneNumber: string;
  // 二輪車両引取先FAX
  bikePickUpFaxNumber: string;
  // 集荷担当者
  collectionStaffName: string;
  // 集荷担当者連絡先
  collectionStaffContactPhoneNumber: string;
  // 集荷責任者
  manager: string;
  // 集荷責任者連絡先
  managerPhoneNumber: string;
  // 集荷曜日（四輪）
  tvaaCollectionWeek: string;
  // 検査曜日（四輪）
  tvaaInspectionWeek: string;
  // 検査員（四輪）
  tvaaInspectorCode: string;
  // 担当者FAX
  collectionStaffContactFaxNumber: string;
  // 集荷曜日（二輪）
  bikeCollectionWeek: string;
  // 検査曜日（二輪）
  bikeInspectionWeek: string;
  // 検査員（二輪）
  bikeInspectorCode: string;
  // 連携情報
  collaborationInfo: string;
  // FAX送信区分ID
  faxSendKind: string;
  // 出品ブロックフラグID
  exhibitBlockKind: string;
  // クレーム担当（四輪）ID
  tvaaClaimStaffId: string;
  // クレーム担当（四輪）名
  tvaaClaimStaffName: string;
  // クレーム担当（二輪）ID
  bikeClaimStaffId: string;
  // クレーム担当（二輪）名
  bikeClaimStaffName: string;
  // 四輪出力フラグID
  tvaaListOutputKind: string;
  // 二輪出力フラグID
  bikeListOutputKind: string;
  // 振替営業エリアID
  transferSalesAreaCode: string;
}

/** 変更履歴情報取得API */
export const ScrMem9999GetHistoryInfo = async (
  request: ScrMem9999GetHistoryInfoRequest
): Promise<ScrMem9999GetHistoryInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-9999/get-history-info',
    request
  );
  return response.data;
};

/** 住所情報取得APIリクエスト */
export interface ScrCom9999GetAddressInfoRequest {
  // 郵便番号
  zipCode: string;
}

/** 住所情報取得APIレスポンス */
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

/** 住所情報取得API */
export const ScrCom9999GetAddressInfo = async (
  request: ScrCom9999GetAddressInfoRequest
): Promise<ScrCom9999GetAddressInfoResponse> => {
  const response = await comApiClient.post(
    '/com/scr-com-9999/get-address-info',
    request
  );
  return response.data;
};

/** 市区郡名称取得APIリクエスト */
export interface ScrMem0012GetDistrictStaffNameRequest {
  // 市区郡コード
  districtCode: string;
}

/** 市区郡名称取得APIレスポンス */
export interface ScrMem0012GetDistrictStaffNameResponse {
  // 市区郡コード
  districtCode: string;
  // 四輪新規営業ID
  tvaaNewSalesId: string;
  // 二輪新規営業ID
  bikeNewSalesId: string;
  // 四輪営業ID１
  tvaaSalesId1: string;
  // 四輪営業ID２
  tvaaSalesId2: string;
  // 四輪営業ID３
  tvaaSalesId3: string;
  // 二輪営業ID１
  bikeSalesId1: string;
  // 二輪営業ID２
  bikeSalesId2: string;
  // 二輪営業ID３
  bikeSalesId3: string;
  // 四輪検査員コード
  tvaaInspectorCode: string;
  // 二輪検査員コード
  bikeInspectorCode: string;
}

/** 市区郡名称取得API */
export const ScrMem0012GetDistrictStaffName = async (
  request: ScrMem0012GetDistrictStaffNameRequest
): Promise<ScrMem0012GetDistrictStaffNameResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0012/get-district-staff-name',
    request
  );
  return response.data;
};

/** 物流拠点情報入力チェックAPIリクエスト */
export interface ScrMem0012InputCheckLogisticsBaseInfoRequest {
  // 法人ID
  corporationId: string;
  // 契約ID
  contractId: string;
  // 物流拠点郵便番号
  logisticsBaseZipCode: string;
  // 都道府県
  logisticsBasePrefectureCode: string;
  // 市区町村
  logisticsBaseMunicipalities: string;
  // 番地・号・建物名など
  logisticsBaseAddressBuildingName: string;
  // TEL
  logisticsBasePhoneNumber: string;
  // FAX
  logisticsBaseFaxNumber: string;
  // メールアドレス
  logisticsBaseMailAddress: string;
}

/** 物流拠点情報入力チェックAPIレスポンス */
export interface ScrMem0012InputCheckLogisticsBaseInfoResponse {
  // エラー内容リスト
  errorList: ErrorList[];
}

// エラー内容リスト
export interface ErrorList {
  // エラーコード
  errorCode: string;
  // エラーメッセージ
  errorMessage: string;
}

/** 物流拠点情報入力チェックAPI */
export const ScrMem0012InputCheckLogisticsBaseInfo = async (
  request: ScrMem0012InputCheckLogisticsBaseInfoRequest
): Promise<ScrMem0012InputCheckLogisticsBaseInfoResponse> => {
  const response = await memApiClient.post(
    '/scr-mem-0012/input-check-logistics-base-info',
    request
  );
  return response.data;
};

/** 物流拠点登録APIリクエスト */
export interface ScrMem0012RegistrationLogisticsBaseRequest {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 住所
  address: string;
  // 法人電話番号
  corporationPhoneNumber: string;
  // 法人FAX番号
  corporationFaxNumber: string;
  // 会員メモ
  memberMemo: string;
  // 四輪情報フラグ
  tvaaInformationFlag: string;
  // 二輪情報フラグ
  bikeInformationFlag: string;
  // 集荷情報フラグ
  collectionInformationFlag: string;
  // 物流拠点代表契約ID
  logisticsBaseRepresentContractId: string;
  // 物流拠点ID
  logisticsBaseId: string;
  // 物流拠点名
  logisticsBaseName: string;
  // 物流拠点名カナ
  logisticsBaseNameKana: string;
  // 顧客表示用名称選択
  logisticsBaseClientDisplayNameFlag: string;
  // 顧客表示用名称
  logisticsBaseClientDisplayName: string;
  // 郵便番号
  logisticsBaseZipCode: string;
  // 都道府県コード
  logisticsBasePrefectureCode: string;
  // 市区町村
  logisticsBaseMunicipalities: string;
  // 番地・号・建物名など
  logisticsBaseAddressBuildingName: string;
  // TEL
  logisticsBasePhoneNumber: string;
  // FAX
  logisticsBaseFaxNumber: string;
  // メールアドレス
  logisticsBaseMailAddress: string;
  // 地区コード
  regionCode: string;
  // 市区郡コード
  districtCode: string;
  // 出品セグメントコード
  exhibitSegmentCode: string;
  // 出品メーカーコード
  exhibitMakerCode: string;
  // 営業エリアID
  salesAreaId: string;
  // 拠点担当者
  logisticsBaseStaffName: string;
  // 定休日
  closedDate: string;
  // 新規営業（四輪）
  tvaaNewSalesId: string;
  // 営業（四輪）１
  tvaaSalesId1: string;
  // 営業（四輪）２
  tvaaSalesId2: string;
  // 営業（四輪）３
  tvaaSalesId3: string;
  // 新規営業（二輪）
  bikeNewSalesId: string;
  // 営業（二輪）1
  bikeSalesId1: string;
  // 営業（二輪）2
  bikeSalesId2: string;
  // 営業（二輪）3
  bikeSalesId3: string;
  // 四輪担当者
  tvaaStaffName: string;
  // 四輪担当者連絡先
  tvaaStaffContactPhoneNumber: string;
  // 四輪連携情報
  tvaaLinkInformation: string;
  // 二輪担当者
  bikeStaffName: string;
  // 二輪担当者連絡先
  bikeStaffContactPhoneNumber: string;
  // 二輪デポ区分
  bikeDepoKind: string;
  // 二輪登録デポ
  bikeRegistrationDepoCode: string;
  // 二輪所属区分
  bikeBelongKind: string;
  // 二輪県No
  bikePrefectureNo: string;
  // 二輪地域No
  bikeRegionNo: string;
  // 二輪連携情報
  bikeLinkInformation: string;
  // 二輪車両引取先物流拠点情報同期フラグ
  bikePickUpLogisticsBaseInformationSynchronizationFlag: boolean;
  // 二輪車両引取先郵便番号
  bikePickUpZipCode: string;
  // 二輪車両引取先都道府県ID
  bikePickUpPrefectureId: string;
  // 二輪車両引取先市区町村
  bikePickUpMunicipalities: string;
  // 二輪車両引取先番地・号・建物名など
  bikePickUpAddressBuildingName: string;
  // 二輪車両引取先TEL
  bikePickUpPhoneNumber: string;
  // 二輪車両引取先FAX
  bikePickUpFaxNumber: string;
  // 集荷担当者
  collectionStaffName: string;
  // 集荷担当者連絡先
  collectionStaffContactPhoneNumber: string;
  // 集荷責任者
  manager: string;
  // 集荷責任者連絡先
  managerPhoneNumber: string;
  // 集荷曜日（四輪）
  tvaaCollectionWeek: string;
  // 検査曜日（四輪）
  tvaaInspectionWeek: string;
  // 検査員（四輪）
  tvaaInspectorCode: string;
  // 担当者FAX
  collectionStaffContactFaxNumber: string;
  // 集荷曜日（二輪）
  bikeCollectionWeek: string;
  // 検査曜日（二輪）
  bikeInspectionWeek: string;
  // 検査員（二輪）
  bikeInspectorCode: string;
  // 連携情報
  collaborationInfo: string;
  // FAX送信区分ID
  faxSendKind: string;
  // 出品ブロックフラグID
  exhibitBlockKind: string;
  // クレーム担当（四輪）ID
  tvaaClaimStaffId: string;
  // クレーム担当（四輪）名
  tvaaClaimStaffName: string;
  // クレーム担当（二輪）ID
  bikeClaimStaffId: string;
  // クレーム担当（二輪）名
  bikeClaimStaffName: string;
  // 四輪出力フラグID
  tvaaListOutputKind: string;
  // 二輪出力フラグID
  bikeListOutputKind: string;
  // 振替営業エリアID
  transferSalesAreaCode: string;
  // 申請従業員ID
  applicationEmployeeId: string;
  // 業務日付
  businessDate: Date;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 画面ID
  screenId: string;
  // 変更予定日
  changeExpectDate: Date;
}

/** 物流拠点登録API */
export const ScrMem0012RegistrationLogisticsBase = async (
  request: ScrMem0012RegistrationLogisticsBaseRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/scr-mem-0012/registration-logistics-base',
    request
  );
  return null;
};
