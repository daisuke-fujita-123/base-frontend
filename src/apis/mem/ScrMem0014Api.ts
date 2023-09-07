import { memApiClient } from 'providers/ApiClient';

/** 契約基本情報取得APIリクエスト */
export interface ScrMem0014GetContractInfoRequest {
  // 契約ID
  contractId: string;
}

/** 契約基本情報取得APIレスポンス */
export interface ScrMem0014GetContractInfoResponse {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 契約ID
  contractId: string;
  // ID発行日
  idIssuanceDate: string;
  // 落札セグメントコード
  bidSegmentCode: string;
  // 落札メーカーコード
  bidMakerCode: string;
  // 指定事業拠点ID
  specifyBusinessBaseId: string;
  // 明細送付先物流拠点ID
  detailsDestinationLogisticsBaseId: string;
  // 譲渡書類送付先事業拠点同期フラグ
  assignmentDocumentDestinationBusinessBaseSyncroFlag: boolean;
  // 譲渡書類送付先郵便番号
  assignmentDocumentDestinationZipCode: string;
  // 譲渡書類送付先都道府県コード
  assignmentDocumentDestinationPrefectureCode: string;
  // 譲渡書類送付先市区町村
  assignmentDocumentDestinationMunicipalities: string;
  // 譲渡書類送付先番地号建物名
  assignmentDocumentDestinationAddressBuildingName: string;
  // 譲渡書類送付先電話番号
  assignmentDocumentDestinationPhoneNumber: string;
  // 譲渡書類送付先FAX番号
  assignmentDocumentDestinationFaxNumber: string;
  // 譲渡書類送付先メールアドレス
  assignmentDocumentDestinationMailAddress: string;
  // 譲渡書類送付先配送方法伝票種類区分
  assignmentDocumentDestinationShippingMethodSlipKind: string;
  // 譲渡書類送付先法人名
  assignmentDocumentDestinationCorporationName: string;
  // 譲渡書類送付先宛名
  assignmentDocumentDestinationAddressee: string;
  // 成約明細送付先FAX番号
  purchaseDestinationFaxNumber: string;
  // 成約明細送付先メールアドレス
  purchaseDestinationMailAddress: string;
  // 落札明細書送付先FAX番号
  bidDestinationDocFaxNumber: string;
  // 落札明細書送付先メールアドレス
  bidDestinationDocMailAddress: string;
  // 特別明細送付先送信区分
  specialDetailsDestinationSendKind: string;
  // 四輪自動輸送フラグ
  tvaaAutotransFlag: boolean;
  // オペホット電話区分
  opehotPhonekind: string;
  // オペホット電話番号
  opehotPhoneNumber: string;
  // オペホットメッセージ
  opehotMessage: string;
  // オペホット参加区分
  opehotEntryKind: string;
  // オペホット会員情報区分
  opehotMemberInformationKind: string;
  // 商談制限区分
  negotiationsLimitKind: string;
  // 商談担当者氏名
  negotiationsStaffName: string;
  // 商談担当携帯番号
  negotiationsStaffMobileNumber: string;
  // 商談運営メモ
  negotiationsOperationMemo: string;
  // コラボ共通会員区分
  collaborationCommonMemberKind: string;
  // リース区分
  leaseKind: string;
  // 先取り会員フラグ
  preemptionMemberFlag: boolean;
  // 成約明細枝番送信フラグ
  purchaseBranchNumberSendFlag: boolean;
  // A出品店別FAX番号
  AexhibitshopFaxNumber: string;
  // A出品店別メールアドレス
  AexhibitshopMailAddress: string;
  // A出品店別送信区分
  AexhibitshopSendKind: string;
  // 会員メモ
  memberMemo: string;
}

/** API-MEM-0014-0001:契約基本情報取得API */
export const ScrMem0014GetContractInfo = async (
  request: ScrMem0014GetContractInfoRequest
): Promise<ScrMem0014GetContractInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/get-contract-info',
    request
  );
  return response.data;
};

/** サービス・値引値増情報取得APIリクエスト */
export interface ScrMem0014GetCourseServiceDiscountInfoRequest {
  // コースID
  courseId: string;
  // 契約ID
  contractId: string;
}

/** サービス・値引値増情報取得APIレスポンス */
export interface ScrMem0014GetCourseServiceDiscountInfoResponse {
  // コース情報
  courseInfo: {
    // コースID
    courseId: string;
    // コース名
    courseName: string;
    // 連携会員区分
    linkMemberKind: string;
    // コース参加区分
    courseEntryKind: string;
    // 利用開始日
    useStartDate: string; // date
    // 契約期間開始日
    contractPeriodStartDate: string; // date
    // 契約期間終了日
    contractPeriodEndDate: string; // date
    // 休会期間開始日
    recessPeriodStartDate: string; // date
    // 休会期間終了日
    recessPeriodEndDate: string; // date
    // 脱会日
    leavingDate: string; // date
    // 対象サービス区分
    targetedServiceKind: string;
    // 休脱会理由区分
    recessLeavingReasonKind: string;
  };
  // 基本サービス情報
  baseServiceInfomation: {
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約本数
    contractCount: number;
    // 対象サービス区分
    targetedServiceKind: string;
  }[];
  // オプション情報
  optionInfomation: {
    // オプション参加区分
    optionEntryKind: string;
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約オプション連番
    contractOptionNumber: number;
    // 契約本数
    contractCount: number;
    // 利用開始日
    useStartDate: string; //date
    // 契約期間開始日
    contractPeriodStartDate: string; //date
    // 契約期間終了日
    contractPeriodEndDate: string; //date
    // 休会期間開始日
    recessPeriodStartDate: string; //date
    // 休会期間終了日
    recessPeriodEndDate: string; //date
    // 脱会日
    leavingDate: string; //date
    // 利用前提オプションサービスID
    useOptionServiceId: string;
    // 利用前提オプションサービス名
    useOptionServiceName: string;
    // 対象サービス区分
    targetedServiceKind: string;
    // 休脱会理由区分
    recessLeavingReasonKind: string;
  }[];
  // オートバンクシステム端末契約ID
  autobankSystemTerminalContractId: string;
  // オートバンクシステム認定証発行jpgフラグ
  autobankSystemCertificateIssuanceJpgFlag: boolean;
  // オートバンクシステムNAVI取引区分
  autobankSystemNaviDealKind: string;
  // オートバンクシステムNAVI特選車参加区分
  autobankSystemNaviChoiceEntryKind: string;
  // オートバンクシステム在庫グループ
  autobankSystemStockGroup: string;
  // オートバンクシステムaB提供サービス区分
  autobankSystemAbOfferServiceKind: string;
  // オートバンクシステムサービスメモ
  autobankSystemServiceMemo: string;
  // オートバンクシステム設置完了日
  autobankSystemInstallationCompletionDate: string;
  // コラボ共通区分
  collaborationCommonKind: string;
  // i-moto-auc会員区分
  imotoaucMemberKind: string;
  // i-moto-auc参加区分
  imotoaucEntryKind: string;
  // i-moto-aucメール送信区分
  imotoaucMailSendKind: string;
  // i-moto-aucDM送信区分
  imotoaucDmSendKind: string;
  // i-moto-auc契約数
  imotoaucContractCount: number;
  // アイオーク管理番号
  iaucManagementNumber: string;
  // カーセンサー営業区分
  carsensorSalesKind: string;
  // カーセンサーAUCCS区分
  carsensorAucCsKind: string;
  // 業務支援用管理番号
  supportManagementNumber: string;
  // ランマート取引区分
  runmartDealKind: string;
  // ランマート共有情報
  runmartShareInformation: string;
  // コース別会費値引値増判定フラグ
  courseFeeDiscountJudgeFlag: boolean;
  // コース個別設定
  courseTypeSetting: TypeSetting;
  // 会員個別設定・四輪
  memberTypeSettingTvaa: TypeSetting;
  // 会員個別設定・二輪
  memberTypeSettingBike: TypeSetting;
  // 会員個別設定・おまとめ
  memberTypeSettingOmatome: TypeSetting;
}

// 個別設定
export interface TypeSetting {
  // 手数料値引値増パックID
  commissionDiscountPackId: string;
  // パック名
  packName: string;
  // 有効期間開始日
  validityPeriodStartDate: string; //date
  // 有効期間終了日
  validityPeriodEndDate: string; //date
}

/** API-MEM-0014-0002:サービス・値引値増情報取得API */
export const ScrMem0014GetCourseServiceDiscountInfo = async (
  request: ScrMem0014GetCourseServiceDiscountInfoRequest
): Promise<ScrMem0014GetCourseServiceDiscountInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/get-course-service-discount-info',
    request
  );
  return response.data;
};

/**請求情報取得APIリクエスト */
export interface ScrMem0014GetBillingInfoRequest {
  // 法人ID
  corporationId: string;
  // 契約ID
  contractId: string;
}

/** 請求情報取得APIレスポンス */
export interface ScrMem0014GetBillingInfoResponse {
  // 請求先ID
  billingId: string;
  // 請求方法区分
  claimMethodKind: string;
  // コースID
  courseId: string;
  // コース名
  courseName: string;
  // 利用開始日
  useStartDate: string; //date
  // オプション情報
  optionInfo: {
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約本数
    contractCount: number;
    // 会費請求頻度区分
    feeClaimFrequencyKind: string;
    // 利用開始日
    useStartDate: string; //date
  }[];
}

/** API-MEM-0014-0003:請求情報取得API */
export const ScrMem0014GetBillingInfo = async (
  request: ScrMem0014GetBillingInfoRequest
): Promise<ScrMem0014GetBillingInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/get-billing-info',
    request
  );
  return response.data;
};

/** ライブ情報取得APIリクエスト */
export interface ScrMem0014GetLiveInfoRequest {
  // 法人ID
  corporationId: string;
  // 契約ID
  contractId: string;
}

/** ライブ情報取得APIレスポンス */
export interface ScrMem0014GetLiveInfoResponse {
  // ライブ基本情報
  liveBaseInfo: {
    // 法人ID
    corporationId: string;
    // 法人名称
    corporationName: string;
    // 契約ID
    contractId: string;
    // コース名
    courseName: string;
    // おまとめサービス契約状況
    omatomeServiceContractStatus: boolean;
    // 基本法人与信額
    basicsCorporationCreditAmount: number;
    // 支払延長与信額
    paymentExtensionCreditAmount: number;
    // 法人郵便番号
    corporationZipCode: string;
    // 法人都道府県コード
    corporationPrefectureCode: string;
    // 法人都道府県名称
    corporationPrefectureName: string;
    // 法人市区町村
    corporationMunicipalities: string;
    // 法人番地号建物名
    corporationAddressBuildingName: string;
    // 法人電話番号
    corporationPhoneNumber: string;
    // 法人FAX番号
    corporationFaxNumber: string;
    // 法人メールアドレス
    corporationMailAddress: string;
    // 代表者名
    representativeName: string;
    // 代表者郵便番号
    representativeZipCode: string;
    // 代表者都道府県コード
    representativePrefectureCode: string;
    // 代表者都道府県名称
    representativePrefectureName: string;
    // 代表者市区町村
    representativeMunicipalities: string;
    // 代表者番地号建物名
    representativeAddressBuildingName: string;
    // 代表者電話番号
    representativePhoneNumber: string;
    // 代表者FAX番号
    representativeFaxNumber: string;
    // 代表者携帯電話番号
    representativeMobilePhoneNumber: string;
    // 適格事業者番号
    eligibleBusinessNumber: string;
    // 公安委員会
    publicSafetyCommittee: string;
    // 交付日
    issuanceDate: string;
    // 古物商許可番号
    antiqueBusinessLicenseNumber: string;
    // 古物名義
    antiqueName: string;
  };
  // ライブ登録情報
  liveRegistrationInfo: {
    // 譲渡書類送付先情報
    assignmentdocumentDestinationInfo: {
      // 譲渡書類送付先郵便番号
      assignmentDocumentDestinationbusinessBaseZipCode: string;
      // 譲渡書類送付先都道府県コード
      assignmentdocumentDestinationPrefectureCode: string;
      // 譲渡書類送付先都道府県名称
      assignmentdocumentDestinationPrefectureName: string;
      // 譲渡書類送付先市区町村
      assignmentdocumentDestinationMunicipalities: string;
      // 譲渡書類送付先番地号建物名
      assignmentDocumentDestinationAddressBuildingName: string;
      // 譲渡書類送付先電話番号
      assignmentdocumentDestinationPhoneNumber: string;
      // 譲渡書類送付先FAX番号
      assignmentdocumentDestinationFaxNumber: string;
    };
    // 譲渡書類送付先情報（おまとめ会場用）
    assignmentdocumentDestinationOmatomeInfo: {
      // 譲渡書類送付先住所（おまとめ会場用）
      assignmentDocumentDestinationOmatomeAddress: string;
      // 譲渡書類送付先電話番号（おまとめ会場用）
      assignmentDocumentDestinationOmatomePhoneNumber: string;
      // 譲渡書類送付先FAX番号（おまとめ会場用）
      assignmentDocumentDestinationOmatomeFaxNumber: string;
    };
    // 支払口座
    payAccountInfo: {
      // 銀行コード
      bankCode: string;
      // 銀行名
      bankName: string;
      // 支店コード
      branchCode: string;
      // 支店名
      branchName: string;
      // 口座種別
      accountKind: string;
      // 口座番号
      accountNumber: string;
      // 口座名義カナ
      accuntNameKana: string;
    };
    // 会場向け振込口座（おまとめ用）
    payAccountOmatomeInfo: {
      // 銀行名（おまとめ用）
      bankName: string;
      // 支店名（おまとめ用）
      branchName: string;
      // 口座種別（おまとめ用）
      accountKind: string;
      // 口座番号（おまとめ用）
      accountNumber: string;
      // 口座名義カナ（おまとめ用）
      accuntNameKana: string;
    };
  };
  // 会場情報一覧
  placeInfoList: {
    // 会場コード
    placeCode: string;
    // 会場名
    placeName: string;
    // 開催曜日区分
    sessionWeekKind: string;
    // データ送付日
    dataSendingDate: string; // date
    // データ登録日
    dataRegistrationDate: string; // date
    // 会場参加区分
    placeEntryKind: string;
    // POS番号
    PosNumber: string;
    // 重複POS情報
    PosInfo: {
      // 契約ID
      contractId: string;
    }[];
    // 会場会員区分
    placeMemberKind: string;
    // おまとめ会場フラグ
    omatomePlaceFlag: boolean;
    // 計算書表示会場名
    statementDisplayPlaceName: string;
    // おまとめ区分
    omatomeKind: string;
    // おまとめ口座番号
    omatomeAccountNumber: string;
    // 参加会場メモ
    entryPlaceMemo: string;
  }[];
  // 会場データ送付時備考
  placeDataSendingRemarks: string;
}

/** API-MEM-0014-0004:ライブ情報取得API */
export const ScrMem0014GetLiveInfo = async (
  request: ScrMem0014GetLiveInfoRequest
): Promise<ScrMem0014GetLiveInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/get-live-info',
    request
  );
  return response.data;
};

/** 物流拠点情報取得APIリクエスト */
export interface ScrMem0014GetLogisticsBaseInfoRequest {
  // 法人ID
  corporationId: string;
}

/** 物流拠点情報取得APIレスポンス */
export interface ScrMem0014GetLogisticsBaseInfoResponse {
  // 物流拠点一覧
  logisticsBase: LogisticsBase[];
}

// 物流拠点一覧
export interface LogisticsBase {
  // 物流拠点ID
  logisticsBaseId: string;
  // 物流拠点名称
  logisticsBaseName: string;
  // 物流拠点郵便番号
  logisticsBaseZipCode: string;
  // 都道府県名称
  prefectureName: string;
  // 物流拠点市区町村
  logisticsBaseMunicipalities: string;
  // 物流拠点番地号建物名
  logisticsBaseAddressBuildingName: string;
  // 物流拠点電話番号
  logisticsBasePhoneNumber: string;
  // 物流拠点FAX番号
  logisticsBaseFaxNumber: string;
  // 物流拠点メールアドレス
  logisticsBaseMailAddress: string;
}

/** API-MEM-0014-0005: 物流拠点情報取得API */
export const ScrMem0014GetLogisticsBaseInfo = async (
  request: ScrMem0014GetLogisticsBaseInfoRequest
): Promise<ScrMem0014GetLogisticsBaseInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/get-logistics-base-info',
    request
  );
  return response.data;
};

/** 会費値引値増有効チェックAPIリクエスト */
export interface ScrMem0014InputCheckBillingInfoRequest {
  // 契約ID
  contractId: string;
  // 法人ID
  corporationId: string;
  // 業務日付
  businessDate: Date;
  // コース別会費値引値増判定フラグ
  courseFeeDiscountJudgeFlag: boolean;
  // コース情報
  courseInfo: {
    // コースID
    courseId: string;
    // コース名
    courseName: string;
    // コース参加区分
    courseEntryKind: string;
    // 利用開始日
    useStartDate: Date;
    // 契約期間（FROM）
    contractPeriodStartDate: Date;
    // 契約期間（TO)
    contractPeriodEndDate: Date;
  };
  // オプション情報
  optionInfo: {
    // オプション参加区分
    optionEntryKind: string;
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約本数
    contractCount: number;
    // 利用開始日
    useStartDate: Date;
    // 契約期間（FROM）
    contractPeriodStartDate: Date;
    // 契約期間（TO)
    contractPeriodEndDate: Date;
  }[];
  // コース個別設定
  individualCourseSetting: {
    // 基本値引値増
    basicDiscountPrice: {
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: Date;
      // 期限終了日
      periodEndDate: Date;
      // 契約後月数
      contractMonths: number;
    }[];
    // オプション値引値増
    optionDiscountPrice: {
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // サービスID
      serviceId: string;
      // サービス名
      serviceName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: Date;
      // 期限終了日
      periodEndDate: Date;
      // 契約後月数
      contractMonths: number;
    }[];
  };
  // 契約個別設定
  individualContractSetting: {
    // 基本値引値増
    basicDiscountPrice: {
      // キャンペーンコード
      campaignCode: string;
      // キャンペーン名
      campaignName: string;
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: Date;
      // 期限終了日
      periodEndDate: Date;
      // 契約後月数
      contractMonths: number;
    }[];
    // オプション値引値増
    optionDiscountPrice: {
      // キャンペーンコード
      campaignCode: string;
      // キャンペーン名
      campaignName: string;
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // サービスID
      serviceId: string;
      // サービス名
      serviceName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: Date;
      // 期限終了日
      periodEndDate: Date;
      // 契約後月数
      contractMonths: number;
    }[];
  };
}

/** 会費値引値増有効チェックAPIレスポンス */
export interface ScrMem0014InputCheckBillingInfoResponse {
  // コース個別設定
  individualCourseSetting: {
    // 基本値引値増
    basicDiscountPrice: {
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: string;
      // 期限終了日
      periodEndDate: string;
      // 契約後月数
      contractMonths: string;
      // 有効フラグ
      enableFlag: boolean;
    }[];
    // オプション値引値増
    optionDiscountPrice: {
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // サービスID
      serviceId: string;
      // サービス名
      serviceName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: string;
      // 期限終了日
      periodEndDate: string;
      // 契約後月数
      contractMonths: string;
      // 有効フラグ
      enableFlag: boolean;
    }[];
  };
  // 契約個別設定
  individualContractSetting: {
    //基本値引値増
    basicDiscountPrice: {
      // キャンペーンコード
      campaignCode: string;
      // キャンペーン名
      campaignName: string;
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: string;
      // 期限終了日
      periodEndDate: string;
      // 契約後月数
      contractMonths: string;
      // 有効フラグ
      enableFlag: boolean;
    }[];
    // オプション値引値増
    optionDiscountPrice: {
      // キャンペーンコード
      campaignCode: string;
      // キャンペーン名
      campaignName: string;
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // サービスID
      serviceId: string;
      // サービス名
      serviceName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: string;
      // 期限終了日
      periodEndDate: string;
      // 契約後月数
      contractMonths: string;
      // 有効フラグ
      enableFlag: boolean;
    }[];
  };
}

/** API-MEM-0014-0012: 会費値引値増有効チェックAPI */
export const ScrMem0014InputCheckBillingInfo = async (
  request: ScrMem0014InputCheckBillingInfoRequest
): Promise<ScrMem0014InputCheckBillingInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/input-check-billing-info',
    request
  );
  return response.data;
};

/** サービス・値引値増情報情報入力チェックAPIリクエスト */
export interface ScrMem0014InputCheckServicediscountpriceincreaseInfoRequest {
  // 契約ID
  contractId: string;
  // 法人ID
  corporationId: string;
  // コース参加区分
  courseEntryKind: string;
  // 基本サービス情報
  basicServiceInfo: {
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 対象サービス区分
    targetedServiceKind: string;
  }[];
  // オプション情報
  optionInfo: {
    // オプション参加区分
    optionEntryKind: string;
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 利用開始日
    useStartDate: Date;
    // 対象サービス区分
    targetedServiceKind: string;
    // 利用前提オプションサービスID
    useOptionServiceId: string;
  }[];
  // オートバンクシステム端末契約ID
  autobankSystemTerminalContractId: string;
  // 業務支援用管理番号
  supportManagementNumber: string;
}

/** サービス・値引値増情報情報入力チェックAPIレスポンス */
export interface ScrMem0014InputCheckServicediscountpriceincreaseInfoResponse {
  // エラー内容リスト
  errorList: {
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
    // エラー詳細
    detail: string;
  }[];
  // ワーニング内容リスト
  warnList: {
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
    // エラー詳細
    detail: string;
  }[];
}

/** API-MEM-0014-0015: サービス・値引値増情報情報入力チェックAPI */
export const ScrMem0014InputCheckServicediscountpriceincreaseInfo = async (
  request: ScrMem0014InputCheckServicediscountpriceincreaseInfoRequest
): Promise<ScrMem0014InputCheckServicediscountpriceincreaseInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/input-check-servicediscountpriceincrease-info',
    request
  );
  return response.data;
};

/** 請求情報入力チェックAPIリクエスト */
export interface ScrMem0014CheckMembershipfeediscountincreaseRequest {
  // 契約ID
  contractId: string;
  // 法人ID
  corporationId: string;
  // 請求先ID
  billingId: string;
}

/** 請求情報入力チェックAPIレスポンス */
export interface ScrMem0014CheckMembershipfeediscountincreaseResponse {
  // エラー内容リスト
  errorList: {
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
  }[];
  // ワーニング内容リスト
  warnList: {
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
  }[];
}

/** API-MEM-0014-0016: 請求情報入力チェックAPI */
export const ScrMem0014CheckMembershipfeediscountincrease = async (
  request: ScrMem0014CheckMembershipfeediscountincreaseRequest
): Promise<ScrMem0014CheckMembershipfeediscountincreaseResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/check-membershipfeediscountincrease',
    request
  );
  return response.data;
};

/** 会費値引値増金額算出APIリクエスト */
export interface ScrMem0014CalculateAmountMembershipfeediscountincreaseRequest {
  // コース情報
  courseInfo: {
    // コースID
    courseId: string;
    // コース名
    courseName: string;
    // コース参加区分
    courseEntryKind: string;
    // 利用開始日
    useStartDate: Date;
  };
  // オプション情報
  optionInfo: {
    // オプション参加区分
    optionEntryKind: string;
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約本数
    contractCount: number;
  }[];
  // コース別会費値引値増判定フラグ
  courseFeeDiscountJudgeFlag: boolean;
  // コース個別設定
  individualCourseSetting: {
    // 基本値引値増
    basicDiscountPrice: {
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: Date;
      // 期限終了日
      periodEndDate: Date;
      // 契約後月数
      contractMonths: number;
      // 有効フラグ
      enableFlag: boolean;
    }[];
    // オプション値引値増
    optionDiscountPrice: {
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // サービスID
      serviceId: string;
      // サービス名
      serviceName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: Date;
      // 期限終了日
      periodEndDate: Date;
      // 契約後月数
      contractMonths: number;
      // 有効フラグ
      enableFlag: boolean;
    }[];
  };
  // 契約個別設定
  individualContractSetting: {
    // 基本値引値増
    basicDiscountPrice: {
      // キャンペーンコード
      campaignCode: string;
      // キャンペーン名
      campaignName: string;
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: Date;
      // 期限終了日
      periodEndDate: Date;
      // 契約後月数
      contractMonths: number;
      // 有効フラグ
      enableFlag: boolean;
    }[];
    // オプション値引値増
    optionDiscountPrice: {
      // キャンペーンコード
      campaignCode: string;
      // キャンペーン名
      campaignName: string;
      // 会費種別
      feeKind: string;
      // 値引値増金額区分
      discountPriceKind: string;
      // 値引値増金額
      discountPrice: number;
      // サービスID
      serviceId: string;
      // サービス名
      serviceName: string;
      // 1本目除外フラグ
      oneCountExclusionFlag: boolean;
      // 契約数量上限
      contractCountMin: number;
      // 契約数量下限
      contractCountMax: number;
      // 期限開始日
      periodStartDate: Date;
      // 期限終了日
      periodEndDate: Date;
      // 契約後月数
      contractMonths: number;
      // 有効フラグ
      enableFlag: boolean;
    }[];
  };
}

/** 会費値引値増金額算出APIレスポンス */
export interface ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse {
  // 最終値引値増金額
  finalFeeDiscount: {
    // 基本オプション識別区分
    useOptionServiceId: string;
    // 会費種別
    feeKind: string;
    // コース契約識別区分
    courseContractId: string;
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約本数
    contractCount: number;
    // 値引値増金額
    discountPrice: number;
    // 値引値増合計金額
    discountTotalPrice: number;
  }[];
  // 値引値増適用前
  beforeFeeDiscount: {
    // コース情報
    courseInfo: {
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // コース入会金
      courseMembership: number;
      // コース会費
      courseFee: number;
    };
    // オプション情報
    optionInfo: {
      // オプションサービスID
      optionServiceId: string;
      // オプションサービス名
      optionServiceName: string;
      // オプションサービス入会金
      optionServiceMembership: number;
      // オプションサービス会費
      optionServiceFee: number;
    }[];
  };
  // 値引値増適用後
  afterFeeDiscount: {
    // コース情報
    courseInfo: {
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // コース入会金
      courseMembership: number;
      // コース会費
      courseFee: number;
    };
    // オプション情報
    optionInfo: {
      // オプションサービスID
      optionServiceId: string;
      // オプションサービス名
      optionServiceName: string;
      // オプションサービス入会金
      optionServiceMembership: number;
      // オプションサービス会費
      optionServiceFee: number;
    }[];
  };
}

/** API-MEM-0014-0019: 会費値引値増金額算出API */
export const ScrMem0014CalculateAmountMembershipfeediscountincrease = async (
  request: ScrMem0014CalculateAmountMembershipfeediscountincreaseRequest
): Promise<ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/calculate-amount-membershipfeediscountincrease',
    request
  );
  return response.data;
};

/** 基本情報登録APIリクエスト */
export interface ScrMem0014ContractBaseRequest extends registrationRequest {
  // 申請従業員ID
  applicationEmployeeId: string;
  // 変更予定日
  changeExpectDate: Date;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
}

/** API-MEM-0014-0022: 基本情報登録API */
export const ScrMem0014ContractBase = async (
  request: ScrMem0014ContractBaseRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/contract-base',
    request
  );
  return null;
};

/** サービス・値引値増情報登録APIリクエスト */
export interface ScrMem0014ContractServiceBaseRequest
  extends registrationRequest {
  // 変更履歴番号
  changeHistoryNumber: number;
  // 第一承認者ID
  firstApproverId: string;
  // 第一承認者メールアドレス
  firstApproverMailAddress: string;
  // 第ニ承認者ID
  secondApproverId: string;
  // 第三承認者ID
  thirdApproverId: string;
  // 第四承認者ID
  fourthApproverId: string;
  // 申請従業員ID
  applicationEmployeeId: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
}

/** API-MEM-0014-0023: サービス・値引値増情報登録API */
export const ScrMem0014ContractServiceBase = async (
  request: ScrMem0014ContractServiceBaseRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/contract-service-base',
    request
  );
  return null;
};

/** 請求情報登録APIリクエスト */
export interface ScrMem0014ContractBillinginfoBaseRequest
  extends registrationRequest {
  // 変更履歴番号
  changeHistoryNumber: number;
  // 第一承認者ID
  firstApproverId: string;
  // 第一承認者メールアドレス
  firstApproverMailAddress: string;
  // 第ニ承認者ID
  secondApproverId: string;
  // 第三承認者ID
  thirdApproverId: string;
  // 第四承認者ID
  fourthApproverId: string;
  // 申請従業員ID
  applicationEmployeeId: string;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
}

/** API-MEM-0014-0024:請求情報登録API */
export const ScrMem0014ContractBillinginfoBase = async (
  request: ScrMem0014ContractBillinginfoBaseRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/contract-billinginfo-base',
    request
  );
  return null;
};

/** ライブ情報登録APIリクエスト */
export interface ScrMem0014EnterEnterthevenueBaseRequest
  extends registrationRequest {
  // 申請従業員ID
  applicationEmployeeId: string;
  // 変更予定日
  changeExpectDate: Date;
  // 登録変更メモ
  registrationChangeMemo: string;
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
}

/** API-MEM-0014-0025:ライブ情報登録API */
export const ScrMem0014EnterEnterthevenueBase = async (
  request: ScrMem0014EnterEnterthevenueBaseRequest
): Promise<null> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0014/enter-enterthevenue-base',
    request
  );
  return null;
};

export interface registrationRequest {
  // 法人ID
  corporationId: string;
  // 契約ID
  contractId: string;
  // ID発行日
  idIssuanceDate: Date;
  // 落札セグメントコード
  bidSegmentCode: string;
  // 落札メーカーコード
  bidMakerCode: string;
  // 契約情報
  contractInfo: {
    // 指定事業拠点ID
    specifyBusinessBaseId: string;
    // 指定事業拠点名
    specifyBusinessBaseName: string;
    // 指定事業拠点郵便番号
    specifyBusinessBaseZipCode: string;
    // 指定事業拠点都道府県
    specifyBusinessBasePrefectureCode: string;
    // 指定事業拠点市区町村
    specifyBusinessBaseMunicipalities: string;
    // 指定事業拠点番地号建物名
    specifyBusinessBaseAddressBuildingName: string;
    // 指定事業拠点電話番号
    specifyBusinessBasePhoneNumber: string;
    // 指定事業拠点担当者氏名
    specifyBusinessBaseStaffName: string;
    // 指定事業拠点担当者連絡先電話番号
    specifyBusinessBaseStaffContactPhoneNumber: string;
    // 明細送付先物流拠点ID
    detailsDestinationLogisticsBaseId: string;
    // 明細送付先物流拠点名
    detailsDestinationLogisticsBaseName: string;
    // 明細送付先物流拠点FAX番号
    detailsDestinationLogisticsBaseFaxNumber: string;
    // 明細送付先物流拠点メールアドレス
    detailsDestinationLogisticsBaseMailAddress: string;
  }[];
  // 譲渡書類送付先事業拠点同期フラグ
  assignmentDocumentDestinationBusinessBaseSyncroFlag: boolean;
  // 譲渡書類送付先郵便番号
  assignmentDocumentDestinationZipCode: string;
  // 譲渡書類送付先都道府県コード
  assignmentDocumentDestinationPrefectureCode: string;
  // 譲渡書類送付先市区町村
  assignmentDocumentDestinationMunicipalities: string;
  // 譲渡書類送付先番地号建物名
  assignmentDocumentDestinationAddressBuildingName: string;
  // 譲渡書類送付先電話番号
  assignmentDocumentDestinationPhoneNumber: string;
  // 譲渡書類送付先FAX番号
  assignmentDocumentDestinationFaxNumber: string;
  // 譲渡書類送付先配送方法伝票種類区分
  assignmentDocumentDestinationShippingMethodSlipKind: string;
  // 譲渡書類送付先法人名
  assignmentDocumentDestinationCorporationName: string;
  // 譲渡書類送付先宛名
  assignmentDocumentDestinationAddressee: string;
  // 成約明細送付先FAX番号
  purchaseDestinationFaxNumber: string;
  // 成約明細送付先メールアドレス
  purchaseDestinationMailAddress: string;
  // 落札明細書送付先FAX番号
  bidDestinationDocFaxNumber: string;
  // 落札明細書送付先メールアドレス
  bidDestinationDocMailAddress: string;
  // 特別明細送付先送信区分
  specialDetailsDestinationSendKind: string;
  // 事業拠点
  businessInfo: {
    // 事業拠点ID
    businessBaseId: string;
    // 事業拠点名称
    businessBaseName: string;
    // 事業拠点郵便番号
    businessBaseZipCode: string;
    // 事業拠点都道府県コード
    businessBasePrefectureCode: string;
    // 事業拠点都道府県名称
    businessBasePrefectureName: string;
    // 事業拠点市区町村
    businessBaseMunicipalities: string;
    // 事業拠点番地号建物名
    businessBaseAddressBuildingName: string;
    // 事業拠点電話番号
    businessBasePhoneNumber: string;
    // 事業拠点担当者氏名
    businessBaseStaffName: string;
    // 事業拠点担当者連絡先電話番号
    businessBaseStaffContactPhoneNumber: string;
  }[];
  // 四輪自動輸送区分
  tvaaAutomaticTransportKind: string;
  // オペホット電話区分
  opehotPhonekind: string;
  // オペホット電話番号
  opehotPhoneNumber: string;
  // オペホットメッセージ
  opehotMessage: string;
  // オペホット参加区分
  opehotEntryKind: string;
  // オペホット会員情報区分
  opehotMemberInformationKind: string;
  // 商談制限区分
  negotiationsLimitKind: string;
  // 商談担当者氏名
  negotiationsStaffName: string;
  // 商談担当携帯番号
  negotiationsStaffMobileNumber: string;
  // 商談運営メモ
  negotiationsOperationMemo: string;
  // コラボ共通会員区分
  collaborationCommonMemberKind: string;
  // リース区分
  leaseKind: string;
  // 先取り会員フラグ
  preemptionMemberFlag: boolean;
  // 成約明細枝番送信フラグ
  purchaseBranchNumberSendFlag: boolean;
  // A出品店別FAX番号
  AexhibitshopFaxNumber: string;
  // A出品店別メールアドレス
  AexhibitshopMailAddress: string;
  // A出品店別送信区分
  AexhibitshopSendKind: string;
  // 会員メモ
  memberMemo: string;
  // 法人情報
  corporationInfo: {
    // 法人ID
    corporationId: string;
    // 法人名カナ
    corporationNameKana: string;
    // 法人郵便番号
    corporationZipCode: string;
    // 法人都道府県コード
    corporationPrefectureCode: string;
    // 法人市区町村
    corporationMunicipalities: string;
    // 法人番地号建物名
    corporationAddressBuildingName: string;
    // 法人電話番号
    corporationPhoneNumber: string;
  };
  // コース情報
  courseInfomation: {
    // コースID
    courseId: string;
    // コース名
    courseName: string;
    // 連携会員区分
    linkMemberKind: string;
    // コース参加区分
    courseEntryKind: string;
    // 利用開始日
    useStartDate: Date;
    // 契約期間開始日
    contractPeriodStartDate: Date;
    // 契約期間終了日
    contractPeriodEndDate: Date;
    // 休会期間開始日
    recessPeriodStartDate: Date;
    // 休会期間終了日
    recessPeriodEndDate: Date;
    // 脱会日
    leavingDate: Date;
    // 対象サービス区分
    targetedServiceKind: string;
    // 休脱会理由区分
    recessLeavingReasonKind: string;
  };
  // 基本サービス情報
  baseServiceInfomation: {
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約本数
    contractCount: number;
    // 対象サービス区分
    targetedServiceKind: string;
  }[];
  // オプション情報
  optionInfomation: {
    // オプション参加区分
    optionEntryKind: string;
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約オプション連番
    contractOptionNumber: number;
    // 契約本数
    contractCount: number;
    // 利用開始日
    useStartDate: Date;
    // 契約期間開始日
    contractPeriodStartDate: Date;
    // 契約期間終了日
    contractPeriodEndDate: Date;
    // 休会期間開始日
    recessPeriodStartDate: Date;
    // 休会期間終了日
    recessPeriodEndDate: Date;
    // 脱会日
    leavingDate: Date;
    // 利用前提オプションサービスID
    useOptionServiceId: string;
    // 対象サービス区分
    targetedServiceKind: string;
    // 休脱会理由区分
    recessLeavingReasonKind: string;
  }[];
  // オートバンクシステム端末契約ID
  autobankSystemTerminalContractId: string;
  // オートバンクシステム認定証発行jpgフラグ
  autobankSystemCertificateIssuanceJpgFlag: boolean;
  // オートバンクシステムNAVI取引区分
  autobankSystemNaviDealKind: string;
  // オートバンクシステムNAVI特選車参加区分
  autobankSystemNaviChoiceEntryKind: string;
  // オートバンクシステム在庫グループ
  autobankSystemStockGroup: string;
  // オートバンクシステムaB提供サービス区分
  autobankSystemAbOfferServiceKind: string;
  // オートバンクシステムサービスメモ
  autobankSystemServiceMemo: string;
  // オートバンクシステム設置完了日
  autobankSystemInstallationCompletionDate: Date;
  // コラボ共通区分
  collaborationCommonKind: string;
  // i-moto-auc会員区分
  imotoaucMemberKind: string;
  // i-moto-auc参加区分
  imotoaucEntryKind: string;
  // i-moto-aucメール送信区分
  imotoaucMailSendKind: string;
  // i-moto-aucDM送信区分
  imotoaucDmSendKind: string;
  // i-moto-auc契約数
  imotoaucContractCount: number;
  // アイオーク管理番号
  iaucManagementNumber: string;
  // カーセンサー営業区分
  carsensorSalesKind: string;
  // カーセンサーAUCCS区分
  carsensorAucCsKind: string;
  // 業務支援用管理番号
  supportManagementNumber: string;
  // ランマート取引区分
  runmartDealKind: string;
  // ランマート共有情報
  runmartShareInformation: string;
  // コース別会費値引値増判定フラグ
  courseFeeDiscountJudgeFlag: boolean;
  // コース個別設定・基本値引値増
  individualCourseSettingBasicDiscountPrice: {
    // 有効フラグ
    enableFlag: boolean;
    // 会費種別
    feeKind: string;
    // 値引値増金額区分
    discountPriceKind: string;
    // 値引値増金額
    discountPrice: number;
    // コースID
    courseId: string;
    // コース名
    courseName: string;
    // 1本目除外フラグ
    oneCountExclusionFlag: boolean;
    // 契約数量上限
    contractCountMin: number;
    // 契約数量下限
    contractCountMax: number;
    // 期限開始日
    periodStartDate: Date;
    // 期限終了日
    periodEndDate: Date;
    // 契約後月数
    contractMonths: number;
  }[];
  // コース個別設定・オプション値引値増
  individualCourseSettingOptionDiscountPrice: {
    // 有効フラグ
    enableFlag: boolean;
    // 会費種別
    feeKind: string;
    // 値引値増金額区分
    discountPriceKind: string;
    // 値引値増金額
    discountPrice: number;
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 1本目除外フラグ
    oneCountExclusionFlag: boolean;
    // 契約数量上限
    contractCountMin: number;
    // 契約数量下限
    contractCountMax: number;
    // 期限開始日
    periodStartDate: Date;
    // 期限終了日
    periodEndDate: Date;
    // 契約後月数
    contractMonths: number;
  }[];
  // 契約個別設定・基本値引値増
  individualContractSettingBasicDiscountPrice: {
    // 有効フラグ
    enableFlag: boolean;
    // キャンペーンコード
    campaignCode: string;
    // キャンペーン名
    campaignName: string;
    // 会費種別
    feeKind: string;
    // 値引値増金額区分
    discountPriceKind: string;
    // 値引値増金額
    discountPrice: number;
    // コースID
    courseId: string;
    // コース名
    courseName: string;
    // 1本目除外フラグ
    oneCountExclusionFlag: boolean;
    // 契約数量上限
    contractCountMin: number;
    // 契約数量下限
    contractCountMax: number;
    // 期限開始日
    periodStartDate: Date;
    // 期限終了日
    periodEndDate: Date;
    // 契約後月数
    contractMonths: number;
  }[];
  // 契約個別設定・オプション値引値増
  individualContractSettingOptionDiscountPrice: {
    // 有効フラグ
    enableFlag: boolean;
    // キャンペーンコード
    campaignCode: string;
    // キャンペーン名
    campaignName: string;
    // 会費種別
    feeKind: string;
    // 値引値増金額区分
    discountPriceKind: string;
    // 値引値増金額
    discountPrice: number;
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 1本目除外フラグ
    oneCountExclusionFlag: boolean;
    // 契約数量上限
    contractCountMin: number;
    // 契約数量下限
    contractCountMax: number;
    // 期限開始日
    periodStartDate: Date;
    // 期限終了日
    periodEndDate: Date;
    // 契約後月数
    contractMonths: number;
  }[];
  // 最終値引値増金額
  finalFeeDiscount: {
    // 基本オプション識別区分
    useOptionServiceId: string;
    // 会費種別
    feeKind: string;
    // コース契約識別区分
    courseContractId: string;
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約本数
    contractCount: number;
    // 値引値増金額
    discountPrice: number;
    // 値引値増合計金額
    discountTotalPrice: number;
  }[];
  // 値引値増適用前
  beforeFeeDiscount: {
    // コース情報
    courseInfo: {
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // コース入会金
      courseMembership: number;
      // コース会費
      courseFee: number;
    };
    // オプション情報
    optionInfo: {
      // サービスID
      serviceId: string;
      // サービス名
      serviceName: string;
      // オプションサービス入会金
      optionServiceMembership: number;
      // オプションサービス会費
      optionServiceFee: number;
    }[];
  };
  // 値引値増適用後
  afterFeeDiscount: {
    // コース情報
    courseInfo: {
      // コースID
      courseId: string;
      // コース名
      courseName: string;
      // コース入会金
      courseMembership: number;
      // コース会費
      courseFee: number;
    };
    // オプション情報
    optionInfo: {
      // サービスID
      serviceId: string;
      // サービス名
      serviceName: string;
      // オプションサービス入会金
      optionServiceMembership: number;
      // オプションサービス会費
      optionServiceFee: number;
    }[];
  };
  // コース個別設定
  courseTypeSetting: {
    // 手数料値引値増パックID
    commissionDiscountPackId: string;
    // パック名
    packName: string;
    // 有効期間開始日
    validityPeriodStartDate: Date;
    // 有効期間終了日
    validityPeriodEndDate: Date;
  };
  // 会員個別設定・四輪
  memberTypeSettingTvaa: {
    // 手数料値引値増パックID
    commissionDiscountPackId: string;
    // パック名
    packName: string;
    // 有効期間開始日
    validityPeriodStartDate: Date;
    // 有効期間終了日
    validityPeriodEndDate: Date;
  };
  // 会員個別設定・二輪
  memberTypeSettingBike: {
    // 手数料値引値増パックID
    commissionDiscountPackId: string;
    // パック名
    packName: string;
    // 有効期間開始日
    validityPeriodStartDate: Date;
    // 有効期間終了日
    validityPeriodEndDate: Date;
  };
  // 会員個別設定・おまとめ
  memberTypeSettingOmatome: {
    // 手数料値引値増パックID
    commissionDiscountPackId: string;
    // パック名
    packName: string;
    // 有効期間開始日
    validityPeriodStartDate: Date;
    // 有効期間終了日
    validityPeriodEndDate: Date;
  };
  // 請求先情報
  billingInfo: {
    // 請求先ID
    billingId: string;
    // 請求方法区分
    claimMethodKind: string;
  };
  // 請求先コース情報
  billingCourseInfo: {
    // コースID
    courseId: string;
    // コース名
    courseName: string;
    // 数量
    courseNumber: number;
    // 値引値増金額
    discountPrice: number;
    // 利用開始日
    useStartDate: Date;
  };
  // 請求先オプション情報
  billingOptionInfo: {
    // サービスID
    serviceId: string;
    // サービス名
    serviceName: string;
    // 契約本数
    contractCount: number;
    // 値引値増金額
    discountPrice: number;
    // 会費請求頻度区分
    feeClaimFrequencyKind: string;
    // 利用開始日
    useStartDate: Date;
  }[];
  // 値引値増合計金額
  discountTotalPrice: number;
  // ライブ基本情報
  liveBaseInfo: {
    // 法人ID
    corporationId: string;
    // 法人名称
    corporationName: string;
    // 契約ID
    contractId: string;
    // コース名
    courseName: string;
    // おまとめサービス契約状況
    omatomeServiceContractStatus: boolean;
    // 基本法人与信額
    basicsCorporationCreditAmount: number;
    // 支払延長与信額
    paymentExtensionCreditAmount: number;
    // 法人郵便番号
    corporationZipCode: string;
    // 法人都道府県コード
    corporationPrefectureCode: string;
    // 法人都道府県名称
    corporationPrefectureName: string;
    // 法人市区町村
    corporationMunicipalities: string;
    // 法人番地号建物名
    corporationAddressBuildingName: string;
    // 法人電話番号
    corporationPhoneNumber: string;
    // 法人FAX番号
    corporationFaxNumber: string;
    // 法人メールアドレス
    corporationMailAddress: string;
    // 代表者名
    representativeName: string;
    // 代表者郵便番号
    representativeZipCode: string;
    // 代表者都道府県コード
    representativePrefectureCode: string;
    // 代表者都道府県名称
    representativePrefectureName: string;
    // 代表者市区町村
    representativeMunicipalities: string;
    // 代表者番地号建物名
    representativeAddressBuildingName: string;
    // 代表者電話番号
    representativePhoneNumber: string;
    // 代表者FAX番号
    representativeFaxNumber: string;
    // 代表者携帯電話番号
    representativeMobilePhoneNumber: string;
    // 適格事業者番号
    eligibleBusinessNumber: string;
    // 公安委員会
    publicSafetyCommittee: string;
    // 交付日
    issuanceDate: Date;
    // 古物商許可番号
    antiqueBusinessLicenseNumber: string;
    // 古物名義
    antiqueName: string;
  };
  // ライブ登録情報
  liveRegisterInfo: {
    // 譲渡書類送付先情報
    transferdocumentsInfo: {
      // 譲渡書類送付先郵便番号
      assignmentDocumentDestinationbusinessBaseZipCode: string;
      // 譲渡書類送付先都道府県コード
      assignmentdocumentDestinationPrefectureCode: string;
      // 譲渡書類送付先都道府県名称
      assignmentdocumentDestinationPrefectureName: string;
      // 譲渡書類送付先市区町村
      assignmentdocumentDestinationMunicipalities: string;
      // 譲渡書類送付先番地号建物名
      assignmentDocumentDestinationAddressBuildingName: string;
      // 譲渡書類送付先電話番号
      assignmentdocumentDestinationPhoneNumber: string;
      // 譲渡書類送付先FAX番号
      assignmentdocumentDestinationFaxNumber: string;
    };
    // 譲渡書類送付先情報（おまとめ会場用）
    transferdocumentsconcludeInfo: {
      // 住所
      transferadress: string;
      // TEL
      transfernumber: string;
      // FAX
      transferfax: string;
    };
    // 支払口座
    paymentAccount: {
      // 銀行コード
      bankCode: string;
      // 銀行名
      bankName: string;
      // 支店コード
      branchCode: string;
      // 支店名
      branchName: string;
      // 口座種別区分
      accountTypeKind: string;
      // 口座番号
      accountNumber: string;
      // 口座名義カナ
      accuntNameKana: string;
    };
    // 会場向け振込口座（おまとめ用）
    venuepaymentAccount: {
      // 銀行名
      bankName: string;
      // 支店名
      branchName: string;
      // 口座種別区分
      accountTypeKind: string;
      // 口座番号
      accountNumber: string;
      // 口座名義カナ
      accuntNameKana: string;
    };
  };
  // 会場情報一覧
  placeInfoList: {
    // 会場コード
    placeCode: string;
    // 会場名
    placeName: string;
    // 開催曜日区分
    sessionWeekKind: string;
    // データ送付日
    dataSendingDate: Date;
    // データ登録日
    dataRegistrationDate: Date;
    // 会場参加区分
    placeEntryKind: string;
    // POS番号
    posNumber: string;
    // 重複POS情報
    posInfo: { contractId: string }[];
    // 会場会員区分
    placeMemberKind: string;
    // おまとめ会場フラグ
    omatomePlaceFlag: boolean;
    // 計算書表示会場名
    statementDisplayPlaceName: string;
    // おまとめ区分
    omatomeKind: string;
    // おまとめ口座番号
    omatomeAccountNumber: string;
    // 参加会場メモ
    entryPlaceMemo: string;
  }[];
  // 会場データ送付時備考
  placeDataSendingRemarks: string;
}
