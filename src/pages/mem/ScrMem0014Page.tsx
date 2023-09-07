import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { TabDef, Tabs } from 'layouts/Tabs';

import { registrationRequest } from 'apis/mem/ScrMem0014Api';

import ScrMem0014BasicTab from './tabs/ScrMem0014BasicTab';
import ScrMem0014BillingTab from './tabs/ScrMem0014BillingTab';
import ScrMem0014LiveTab from './tabs/ScrMem0014LiveTab';
import ScrMem0014ServiceDiscountTab from './tabs/ScrMem0014ServiceDiscountTab';

const contractBaseInitialValues: registrationRequest = {
  // 法人ID
  corporationId: '',
  // 契約ID
  contractId: '',
  // ID発行日
  idIssuanceDate: new Date(),
  // 落札セグメントコード
  bidSegmentCode: '',
  // 落札メーカーコード
  bidMakerCode: '',
  // 契約情報
  contractInfo: [
    {
      // 指定事業拠点ID
      specifyBusinessBaseId: '',
      // 指定事業拠点名
      specifyBusinessBaseName: '',
      // 指定事業拠点郵便番号
      specifyBusinessBaseZipCode: '',
      // 指定事業拠点都道府県
      specifyBusinessBasePrefectureCode: '',
      // 指定事業拠点市区町村
      specifyBusinessBaseMunicipalities: '',
      // 指定事業拠点番地号建物名
      specifyBusinessBaseAddressBuildingName: '',
      // 指定事業拠点電話番号
      specifyBusinessBasePhoneNumber: '',
      // 指定事業拠点担当者氏名
      specifyBusinessBaseStaffName: '',
      // 指定事業拠点担当者連絡先電話番号
      specifyBusinessBaseStaffContactPhoneNumber: '',
      // 明細送付先物流拠点ID
      detailsDestinationLogisticsBaseId: '',
      // 明細送付先物流拠点名
      detailsDestinationLogisticsBaseName: '',
      // 明細送付先物流拠点FAX番号
      detailsDestinationLogisticsBaseFaxNumber: '',
      // 明細送付先物流拠点メールアドレス
      detailsDestinationLogisticsBaseMailAddress: '',
    },
  ],
  // 譲渡書類送付先事業拠点同期フラグ
  assignmentDocumentDestinationBusinessBaseSyncroFlag: false,
  // 譲渡書類送付先郵便番号
  assignmentDocumentDestinationZipCode: '',
  // 譲渡書類送付先都道府県コード
  assignmentDocumentDestinationPrefectureCode: '',
  // 譲渡書類送付先市区町村
  assignmentDocumentDestinationMunicipalities: '',
  // 譲渡書類送付先番地号建物名
  assignmentDocumentDestinationAddressBuildingName: '',
  // 譲渡書類送付先電話番号
  assignmentDocumentDestinationPhoneNumber: '',
  // 譲渡書類送付先FAX番号
  assignmentDocumentDestinationFaxNumber: '',
  // 譲渡書類送付先配送方法伝票種類区分
  assignmentDocumentDestinationShippingMethodSlipKind: '',
  // 譲渡書類送付先法人名
  assignmentDocumentDestinationCorporationName: '',
  // 譲渡書類送付先宛名
  assignmentDocumentDestinationAddressee: '',
  // 成約明細書送付先FAX番号
  purchaseDestinationFaxNumber: '',
  // 成約明細書送付先メールアドレス
  purchaseDestinationMailAddress: '',
  // 落札明細書送付先FAX番号
  bidDestinationDocFaxNumber: '',
  // 落札明細書送付先メールアドレス
  bidDestinationDocMailAddress: '',
  // 特別明細送付先送信区分
  specialDetailsDestinationSendKind: '',
  // 事業拠点一覧
  businessInfo: [
    {
      // 事業拠点ID
      businessBaseId: '',
      // 事業拠点名称
      businessBaseName: '',
      // 事業拠点郵便番号
      businessBaseZipCode: '',
      // 事業拠点都道府県コード
      businessBasePrefectureCode: '',
      // 事業拠点都道府県名称
      businessBasePrefectureName: '',
      // 事業拠点市区町村
      businessBaseMunicipalities: '',
      // 事業拠点番地号建物名
      businessBaseAddressBuildingName: '',
      // 事業拠点電話番号
      businessBasePhoneNumber: '',
      // 事業拠点担当者氏名
      businessBaseStaffName: '',
      // 事業拠点担当者連絡先電話番号
      businessBaseStaffContactPhoneNumber: '',
    },
  ],
  // 四輪自動輸送区分
  tvaaAutomaticTransportKind: '',
  // オペホット電話区分
  opehotPhonekind: '',
  // オペホット電話番号
  opehotPhoneNumber: '',
  // オペホットメッセージ
  opehotMessage: '',
  // オペホット参加区分
  opehotEntryKind: '',
  // オペホット会員情報区分
  opehotMemberInformationKind: '',
  // 商談制限区分
  negotiationsLimitKind: '',
  // 商談担当者氏名
  negotiationsStaffName: '',
  // 商談担当携帯番号
  negotiationsStaffMobileNumber: '',
  // 商談運営メモ
  negotiationsOperationMemo: '',
  // コラボ共通会員区分
  collaborationCommonMemberKind: '',
  // リース区分
  leaseKind: '',
  // 先取り会員フラグ
  preemptionMemberFlag: false,
  // 成約明細枝番送信フラグ
  purchaseBranchNumberSendFlag: false,
  // A出品店別FAX番号
  AexhibitshopFaxNumber: '',
  // A出品店別メールアドレス
  AexhibitshopMailAddress: '',
  // A出品店別送信区分
  AexhibitshopSendKind: '',
  // 会員メモ
  memberMemo: '',
  // 法人情報
  corporationInfo: {
    // 法人ID
    corporationId: '',
    // 法人名称カナ
    corporationNameKana: '',
    // 法人郵便番号
    corporationZipCode: '',
    // 法人都道府県コード
    corporationPrefectureCode: '',
    // 法人市区町村
    corporationMunicipalities: '',
    // 法人番地号建物名
    corporationAddressBuildingName: '',
    // 法人電話番号
    corporationPhoneNumber: '',
  },
  // コース情報
  courseInfomation: {
    // コースID
    courseId: '',
    // コース名
    courseName: '',
    // 連携会員区分
    linkMemberKind: '',
    // コース参加区分
    courseEntryKind: '',
    // 利用開始日
    useStartDate: new Date(),
    // 契約期間開始日
    contractPeriodStartDate: new Date(),
    // 契約期間終了日
    contractPeriodEndDate: new Date(),
    // 休会期間開始日
    recessPeriodStartDate: new Date(),
    // 休会期間終了日
    recessPeriodEndDate: new Date(),
    // 脱会日
    leavingDate: new Date(),
    // 対象サービス区分
    targetedServiceKind: '',
    // 休脱会理由区分
    recessLeavingReasonKind: '',
  },
  // 基本サービス情報
  baseServiceInfomation: [
    {
      // サービスID
      serviceId: '',
      // サービス名
      serviceName: '',
      // 契約本数
      contractCount: 0,
      // 対象サービス区分
      targetedServiceKind: '',
    },
  ],
  // オプション情報
  optionInfomation: [
    {
      // オプション参加区分
      optionEntryKind: '',
      // 契約オプション連番
      contractOptionNumber: 0,
      // サービスID
      serviceId: '',
      // サービス名
      serviceName: '',
      // 契約本数
      contractCount: 0,
      // 利用開始日
      useStartDate: new Date(),
      // 契約期間開始日
      contractPeriodStartDate: new Date(),
      // 契約期間終了日
      contractPeriodEndDate: new Date(),
      // 休会期間開始日
      recessPeriodStartDate: new Date(),
      // 休会期間終了日
      recessPeriodEndDate: new Date(),
      // 脱会日
      leavingDate: new Date(),
      // 利用前提オプションサービスID
      useOptionServiceId: '',
      // 対象サービス区分
      targetedServiceKind: '',
      // 休脱会理由区分
      recessLeavingReasonKind: '',
    },
  ],
  // オートバンクシステム端末契約ID
  autobankSystemTerminalContractId: '',
  // オートバンクシステム認定証発行jpgフラグ
  autobankSystemCertificateIssuanceJpgFlag: false,
  // オートバンクシステムNAVI取引区分
  autobankSystemNaviDealKind: '',
  // オートバンクシステムNAVI特選車参加区分
  autobankSystemNaviChoiceEntryKind: '',
  // オートバンクシステム在庫グループ
  autobankSystemStockGroup: '',
  // オートバンクシステムaB提供サービス区分
  autobankSystemAbOfferServiceKind: '',
  // オートバンクシステムサービスメモ
  autobankSystemServiceMemo: '',
  // オートバンクシステム設置完了日
  autobankSystemInstallationCompletionDate: new Date(),
  // コラボ共通区分
  collaborationCommonKind: '',
  // i-moto-auc会員区分
  imotoaucMemberKind: '',
  // i-moto-auc参加区分
  imotoaucEntryKind: '',
  // i-moto-aucメール送信区分
  imotoaucMailSendKind: '',
  // i-moto-aucDM送信区分
  imotoaucDmSendKind: '',
  // i-moto-auc契約数
  imotoaucContractCount: 0,
  // アイオーク管理番号
  iaucManagementNumber: '',
  // カーセンサー営業区分
  carsensorSalesKind: '',
  // カーセンサーAUCCS区分
  carsensorAucCsKind: '',
  // 業務支援用管理番号
  supportManagementNumber: '',
  // ランマート取引区分
  runmartDealKind: '',
  // ランマート共有情報
  runmartShareInformation: '',
  // コース別会費値引値増判定フラグ
  courseFeeDiscountJudgeFlag: false,
  // コース個別設定・基本値引値増
  individualCourseSettingBasicDiscountPrice: [
    {
      // 有効フラグ
      enableFlag: false,
      // 会費種別
      feeKind: '',
      // 値引値増金額区分
      discountPriceKind: '',
      // 値引値増金額
      discountPrice: 0,
      // コースID
      courseId: '',
      // コース名
      courseName: '',
      // 1本目除外フラグ
      oneCountExclusionFlag: false,
      // 契約本数下限
      contractCountMin: 0,
      // 契約本数上限
      contractCountMax: 0,
      // 期間開始日
      periodStartDate: new Date(),
      // 期間終了日
      periodEndDate: new Date(),
      // 契約後月数
      contractMonths: 0,
    },
  ],
  // コース個別設定・オプション値引値増
  individualCourseSettingOptionDiscountPrice: [
    {
      // 有効フラグ
      enableFlag: false,
      // 会費種別
      feeKind: '',
      // 値引値増金額区分
      discountPriceKind: '',
      // 値引値増金額
      discountPrice: 0,
      // サービスID
      serviceId: '',
      // サービス名
      serviceName: '',
      // 1本目除外フラグ
      oneCountExclusionFlag: false,
      // 契約本数下限
      contractCountMin: 0,
      // 契約本数上限
      contractCountMax: 0,
      // 期間開始日
      periodStartDate: new Date(),
      // 期間終了日
      periodEndDate: new Date(),
      // 契約後月数
      contractMonths: 0,
    },
  ],
  // 契約個別設定・基本値引値増
  individualContractSettingBasicDiscountPrice: [
    {
      // 有効フラグ
      enableFlag: false,
      // キャンペーンコード
      campaignCode: '',
      // キャンペーン名
      campaignName: '',
      // 会費種別
      feeKind: '',
      // 値引値増金額区分
      discountPriceKind: '',
      // 値引値増金額
      discountPrice: 0,
      // コースID
      courseId: '',
      // コース名
      courseName: '',
      // 1本目除外フラグ
      oneCountExclusionFlag: false,
      // 契約本数下限
      contractCountMin: 0,
      // 契約本数上限
      contractCountMax: 0,
      // 期間開始日
      periodStartDate: new Date(),
      // 期間終了日
      periodEndDate: new Date(),
      // 契約後月数
      contractMonths: 0,
    },
  ],
  // 契約個別設定・オプション値引値増
  individualContractSettingOptionDiscountPrice: [
    {
      // 有効フラグ
      enableFlag: false,
      // キャンペーンコード
      campaignCode: '',
      // キャンペーン名
      campaignName: '',
      // 会費種別
      feeKind: '',
      // 値引値増金額区分
      discountPriceKind: '',
      // 値引値増金額
      discountPrice: 0,
      // サービスID
      serviceId: '',
      // サービス名
      serviceName: '',
      // 1本目除外フラグ
      oneCountExclusionFlag: false,
      // 契約本数下限
      contractCountMin: 0,
      // 契約本数上限
      contractCountMax: 0,
      // 期間開始日
      periodStartDate: new Date(),
      // 期間終了日
      periodEndDate: new Date(),
      // 契約後月数
      contractMonths: 0,
    },
  ],
  // 最終値引値増金額
  finalFeeDiscount: [
    {
      // 基本オプション識別区分
      useOptionServiceId: '',
      // 会費種別
      feeKind: '',
      // コース契約識別区分
      courseContractId: '',
      // サービスID
      serviceId: '',
      // サービス名
      serviceName: '',
      // 契約本数
      contractCount: 0,
      // 値引値増金額
      discountPrice: 0,
      // 値引値増合計金額
      discountTotalPrice: 0,
    },
  ],
  // 値引値増適用前
  beforeFeeDiscount: {
    // コース情報（適用前）
    courseInfo: {
      // コースID
      courseId: '',
      // コース名
      courseName: '',
      // コース入会金
      courseMembership: 0,
      // コース会費
      courseFee: 0,
    },
    // オプション情報（適用前）
    optionInfo: [
      {
        // サービスID
        serviceId: '',
        // サービス名
        serviceName: '',
        // オプションサービス入会金
        optionServiceMembership: 0,
        // オプションサービス会費
        optionServiceFee: 0,
      },
    ],
  },
  // 値引値増適用後
  afterFeeDiscount: {
    // コース情報（適用前）
    courseInfo: {
      // コースID
      courseId: '',
      // コース名
      courseName: '',
      // コース入会金
      courseMembership: 0,
      // コース会費
      courseFee: 0,
    },
    // オプション情報（適用前）
    optionInfo: [
      {
        // サービスID
        serviceId: '',
        // サービス名
        serviceName: '',
        // オプションサービス入会金
        optionServiceMembership: 0,
        // オプションサービス会費
        optionServiceFee: 0,
      },
    ],
  },
  // コース個別設定
  courseTypeSetting: {
    // 手数料値引値増パックID
    commissionDiscountPackId: '',
    // パック名
    packName: '',
    // 有効期間開始日
    validityPeriodStartDate: new Date(),
    // 有効期間終了日
    validityPeriodEndDate: new Date(),
  },
  // 会員個別設定・四輪
  memberTypeSettingTvaa: {
    // 手数料値引値増パックID
    commissionDiscountPackId: '',
    // パック名
    packName: '',
    // 有効期間開始日
    validityPeriodStartDate: new Date(),
    // 有効期間終了日
    validityPeriodEndDate: new Date(),
  },
  // 会員個別設定・二輪
  memberTypeSettingBike: {
    // 手数料値引値増パックID
    commissionDiscountPackId: '',
    // パック名
    packName: '',
    // 有効期間開始日
    validityPeriodStartDate: new Date(),
    // 有効期間終了日
    validityPeriodEndDate: new Date(),
  },
  // 会員個別設定・おまとめ
  memberTypeSettingOmatome: {
    // 手数料値引値増パックID
    commissionDiscountPackId: '',
    // パック名
    packName: '',
    // 有効期間開始日
    validityPeriodStartDate: new Date(),
    // 有効期間終了日
    validityPeriodEndDate: new Date(),
  },
  // 請求先情報
  billingInfo: {
    // 請求先ID
    billingId: '',
    // 請求方法区分
    claimMethodKind: '',
  },
  // 請求先コース情報
  billingCourseInfo: {
    // コースID
    courseId: '',
    // コース名
    courseName: '',
    // 数量
    courseNumber: 0,
    // 値引値増金額
    discountPrice: 0,
    // 利用開始日
    useStartDate: new Date(),
  },
  // 請求先オプション情報
  billingOptionInfo: [
    {
      // サービスID
      serviceId: '',
      // サービス名
      serviceName: '',
      // 契約本数
      contractCount: 0,
      // 値引値増金額
      discountPrice: 0,
      // 会費請求頻度区分
      feeClaimFrequencyKind: '',
      // 利用開始日
      useStartDate: new Date(),
    },
  ],
  // 値引値増合計金額
  discountTotalPrice: 0,
  // ライブ基本情報
  liveBaseInfo: {
    // 法人ID
    corporationId: '',
    // 法人名称
    corporationName: '',
    // 契約ID
    contractId: '',
    // コース名
    courseName: '',
    // おまとめサービス契約状況
    omatomeServiceContractStatus: false,
    // 基本法人与信額
    basicsCorporationCreditAmount: 0,
    // 支払延長与信額
    paymentExtensionCreditAmount: 0,
    // 法人郵便番号
    corporationZipCode: '',
    // 法人都道府県コード
    corporationPrefectureCode: '',
    // 法人都道府県名称
    corporationPrefectureName: '',
    // 法人市区町村
    corporationMunicipalities: '',
    // 法人番地号建物名
    corporationAddressBuildingName: '',
    // 法人電話番号
    corporationPhoneNumber: '',
    // 法人FAX番号
    corporationFaxNumber: '',
    // 法人メールアドレス
    corporationMailAddress: '',
    // 代表者名
    representativeName: '',
    // 代表者郵便番号
    representativeZipCode: '',
    // 代表者都道府県コード
    representativePrefectureCode: '',
    // 代表者都道府県名称
    representativePrefectureName: '',
    // 代表者市区町村
    representativeMunicipalities: '',
    // 代表者番地号建物名
    representativeAddressBuildingName: '',
    // 代表者電話番号
    representativePhoneNumber: '',
    // 代表者FAX番号
    representativeFaxNumber: '',
    // 代表者携帯電話番号
    representativeMobilePhoneNumber: '',
    // 適格事業者番号
    eligibleBusinessNumber: '',
    // 公安委員会
    publicSafetyCommittee: '',
    // 交付日
    issuanceDate: new Date(),
    // 古物商許可番号
    antiqueBusinessLicenseNumber: '',
    // 古物名義
    antiqueName: '',
  },
  // ライブ登録情報
  liveRegisterInfo: {
    // 譲渡書類送付先情報
    transferdocumentsInfo: {
      // 譲渡書類送付先郵便番号
      assignmentDocumentDestinationbusinessBaseZipCode: '',
      // 譲渡書類送付先都道府県コード
      assignmentdocumentDestinationPrefectureCode: '',
      // 譲渡書類送付先都道府県名称
      assignmentdocumentDestinationPrefectureName: '',
      // 譲渡書類送付先市区町村
      assignmentdocumentDestinationMunicipalities: '',
      // 譲渡書類送付先番地号建物名
      assignmentDocumentDestinationAddressBuildingName: '',
      // 譲渡書類送付先電話番号
      assignmentdocumentDestinationPhoneNumber: '',
      // 譲渡書類送付先FAX番号
      assignmentdocumentDestinationFaxNumber: '',
    },
    // 譲渡書類送付先情報（おまとめ会場用）
    transferdocumentsconcludeInfo: {
      // 住所
      transferadress: '',
      // TEL
      transfernumber: '',
      // FAX
      transferfax: '',
    },
    // 支払口座
    paymentAccount: {
      // 銀行コード
      bankCode: '',
      // 銀行名
      bankName: '',
      // 支店コード
      branchCode: '',
      // 支店名
      branchName: '',
      // 口座種別
      accountTypeKind: '',
      // 口座番号
      accountNumber: '',
      // 口座名義カナ
      accuntNameKana: '',
    },
    // 会場向け振込口座（おまとめ用）
    venuepaymentAccount: {
      // 銀行名
      bankName: '',
      // 支店名
      branchName: '',
      // 口座種別
      accountTypeKind: '',
      // 口座番号
      accountNumber: '',
      // 口座名義カナ
      accuntNameKana: '',
    },
  },
  // 会場情報一覧情報
  placeInfoList: [
    {
      // 会場コード
      placeCode: '',
      // 会場名
      placeName: '',
      // 開催曜日区分
      sessionWeekKind: '',
      // データ送付日
      dataSendingDate: new Date(),
      // データ登録日
      dataRegistrationDate: new Date(),
      // 会場参加区分
      placeEntryKind: '',
      // POS番号
      posNumber: '',
      // 重複POS情報
      posInfo: [],
      // 会場会員区分
      placeMemberKind: '',
      // おまとめ会場フラグ
      omatomePlaceFlag: false,
      // 計算書表示会場名
      statementDisplayPlaceName: '',
      // おまとめ区分
      omatomeKind: '',
      // おまとめ口座番号
      omatomeAccountNumber: '',
      // 参加会場メモ
      entryPlaceMemo: '',
    },
  ],
  // 会場データ送付時備考
  placeDataSendingRemarks: '',
};

export interface TabDisabledsModel {
  ScrMem0014BasicTab: boolean;
  ScrMem0014ServiceDiscountTab: boolean;
  ScrMem0014BillingTab: boolean;
  ScrMem0014LiveTab: boolean;
}

/**
 * ScrMem0014Page 法人情報詳細画面
 */
const ScrMem0014Page = () => {
  // router
  const location = useLocation();

  // state
  const [contractBase, setContractBase] = useState<registrationRequest>(
    contractBaseInitialValues
  );

  const [tabDisableds, setTabDisableds] = useState<TabDisabledsModel>({
    ScrMem0014BasicTab: false,
    ScrMem0014ServiceDiscountTab: false,
    ScrMem0014BillingTab: false,
    ScrMem0014LiveTab: false,
  });

  const tabDefs: TabDef[] = [
    {
      title: '基本情報',
      hash: '#basic',
      disabled: tabDisableds.ScrMem0014BasicTab,
    },
    {
      title: 'サービス・値引値増情報',
      hash: '#service-discount',
      disabled: tabDisableds.ScrMem0014ServiceDiscountTab,
    },
    {
      title: '請求情報',
      hash: '#billing',
      disabled: tabDisableds.ScrMem0014BillingTab,
    },
    {
      title: 'ライブ情報',
      hash: '#live',
      disabled: tabDisableds.ScrMem0014LiveTab,
    },
  ];

  const chengeTabDisableds = (tabDisableds: TabDisabledsModel) => {
    setTabDisableds(tabDisableds);
  };

  const setContractBaseValue = (contractBase: registrationRequest) => {
    setContractBase(contractBase);
  };

  return (
    <Tabs tabDef={tabDefs} defaultValue={location.hash}>
      <ScrMem0014BasicTab
        contractBase={contractBase}
        setContractBaseValue={setContractBaseValue}
        chengeTabDisableds={chengeTabDisableds}
      />
      <ScrMem0014ServiceDiscountTab
        contractBase={contractBase}
        setContractBaseValue={setContractBaseValue}
      />
      <ScrMem0014BillingTab
        contractBase={contractBase}
        setContractBaseValue={setContractBaseValue}
      />
      <ScrMem0014LiveTab
        contractBase={contractBase}
        setContractBaseValue={setContractBaseValue}
        chengeTabDisableds={chengeTabDisableds}
      />
    </Tabs>
  );
};

export default ScrMem0014Page;

