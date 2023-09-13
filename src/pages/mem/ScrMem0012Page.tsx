import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom00032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

import { BottomBox, MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { InputLayout } from 'layouts/InputLayout';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import {
  ColStack,
  InputRowStack,
  RightElementStack,
  RowStack,
  Stack,
} from 'layouts/Stack';

import { CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { DatePicker } from 'controls/DatePicker';
import { WarningLabel } from 'controls/Label';
import { Link } from 'controls/Link';
import { Radio } from 'controls/Radio';
import { Select, SelectValue } from 'controls/Select';
import { Textarea } from 'controls/Textarea';
import { PostalTextField, TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  ScrCom9999GetAddressInfo,
  ScrCom9999GetChangeDate,
  ScrCom9999getCodeManagementMasterMultiple,
  ScrCom9999GetCodeValue,
  ScrCom9999GetStaff,
} from 'apis/com/ScrCom9999Api';
import {
  ScrMem0012GetDistrictStaffName,
  ScrMem0012GetLogisticsBaseBasicInfo,
  ScrMem0012GetLogisticsBaseBasicInfoResponse,
  ScrMem0012InputCheckLogisticsBaseInfo,
  ScrMem0012RegistrationLogisticsBase,
  ScrMem0012RegistrationLogisticsBaseRequest,
  ScrMem9999GetHistoryInfo,
  ScrMem9999GetHistoryInfoResponse,
} from 'apis/mem/ScrMem0012Api';
import {
  ScrMem9999GetCodeValue,
  ScrMem9999GetCorpBasicInfo,
  ScrMem9999GetCorpBasicInfoResponse,
  ScrMem9999GetLogisticsBaseRepresentativeContract,
} from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

/**
 * 基本情報データモデル
 */
interface BasicInfoModel {
  corporationId: string;
  corporationName: string;
  address: string;
  corporationPhoneNumber: string;
  corporationFaxNumber: string;

  tvaaInformationFlag: boolean;
  bikeInformationFlag: boolean;
  collectionInformationFlag: boolean;
  logisticsBaseRepresentContractId: string;
  logisticsBaseId: string;
  logisticsBaseName: string;
  logisticsBaseNameKana: string;
  logisticsBaseClientDisplayNameFlag: string;
  logisticsBaseClientDisplayName: string;
  logisticsBaseZipCode: string;
  logisticsBasePrefectureCode: string;
  logisticsBaseMunicipalities: string;
  logisticsBaseAddressBuildingName: string;
  logisticsBasePhoneNumber: string;
  logisticsBaseFaxNumber: string;
  logisticsBaseMailAddress: string;
  regionCode: string;
  districtCode: string;
  exhibitSegmentCode: string;
  exhibitMakerCode: string;
  salesAreaId: string;
  logisticsBaseStaffName: string;
  closedDate: string;
  tvaaNewSalesId: string;
  tvaaSalesId1: string;
  tvaaSalesId2: string;
  tvaaSalesId3: string;
  bikeNewSalesId: string;
  bikeSalesId1: string;
  bikeSalesId2: string;
  bikeSalesId3: string;

  tvaaStaffName: string;
  tvaaStaffContactPhoneNumber: string;
  tvaaLinkInformation: string;

  bikeStaffName: string;
  bikeStaffContactPhoneNumber: string;
  bikeDepoKind: string;
  bikeRegistrationDepoCode: string;
  bikeBelongKind: string;
  bikePrefectureNo: string;
  bikeRegionNo: string;
  bikeLinkInformation: string;

  bikePickUpLogisticsBaseInformationSynchronizationFlag: boolean;
  bikePickUpZipCode: string;
  bikePickUpPrefectureId: string;
  bikePickUpMunicipalities: string;
  bikePickUpAddressBuildingName: string;
  bikePickUpPhoneNumber: string;
  bikePickUpFaxNumber: string;

  collectionStaffName: string;
  collectionStaffContactPhoneNumber: string;
  manager: string;
  managerPhoneNumber: string;
  tvaaCollectionWeek: string;
  tvaaInspectionWeek: string;
  tvaaInspectorCode: string;
  collectionStaffContactFaxNumber: string;
  bikeCollectionWeek: string;
  bikeInspectionWeek: string;
  bikeInspectorCode: string;
  collaborationInfo: string;
  memberMemo: string;

  faxSendKind: string;
  exhibitBlockKind: string;
  tvaaClaimStaff: string;
  bikeClaimStaff: string;
  tvaaListOutputKind: string;
  bikeListOutputKind: string;
  transferSalesAreaCode: string;

  changeHistoryNumber: string;
  changeExpectedDate: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  contractIdSelectValues: SelectValue[];
  prefectureCodeselectValues: SelectValue[];
  regionSelectValues: SelectValue[];
  districtSelectValues: SelectValue[];
  segmentSelectValues: SelectValue[];
  makerCodeSelectValues: SelectValue[];
  salesAreaSelectValues: SelectValue[];
  salesIdSelectValues: SelectValue[];
  bikeDepoKindSelectValues: SelectValue[];
  registrationDepoSelectValues: SelectValue[];
  bikeBelongKindSelectValues: SelectValue[];
  inspectorSelectValues: SelectValue[];
  faxSendKindSelectValues: SelectValue[];
  exhibitBlockKindSelectValues: SelectValue[];
  outputKindSelectValues: SelectValue[];
  transferSalesAreaSelectValues: SelectValue[];
}

/**
 * 初期データ
 */
const initialValues: BasicInfoModel = {
  corporationId: '',
  corporationName: '',
  address: '',
  corporationPhoneNumber: '',
  corporationFaxNumber: '',
  tvaaInformationFlag: true,
  bikeInformationFlag: true,
  collectionInformationFlag: true,
  logisticsBaseRepresentContractId: '',
  logisticsBaseId: '',
  logisticsBaseName: '',
  logisticsBaseNameKana: '',
  logisticsBaseClientDisplayNameFlag: '',
  logisticsBaseClientDisplayName: '',
  logisticsBaseZipCode: '',
  logisticsBasePrefectureCode: '',
  logisticsBaseMunicipalities: '',
  logisticsBaseAddressBuildingName: '',
  logisticsBasePhoneNumber: '',
  logisticsBaseFaxNumber: '',
  logisticsBaseMailAddress: '',
  regionCode: '',
  districtCode: '',
  exhibitSegmentCode: '',
  exhibitMakerCode: '',
  salesAreaId: '',
  logisticsBaseStaffName: '',
  closedDate: '',
  tvaaNewSalesId: '',
  tvaaSalesId1: '',
  tvaaSalesId2: '',
  tvaaSalesId3: '',
  bikeNewSalesId: '',
  bikeSalesId1: '',
  bikeSalesId2: '',
  bikeSalesId3: '',

  tvaaStaffName: '',
  tvaaStaffContactPhoneNumber: '',
  tvaaLinkInformation: '',

  bikeStaffName: '',
  bikeStaffContactPhoneNumber: '',
  bikeDepoKind: '',
  bikeRegistrationDepoCode: '',
  bikeBelongKind: '',
  bikePrefectureNo: '',
  bikeRegionNo: '',
  bikeLinkInformation: '',

  bikePickUpLogisticsBaseInformationSynchronizationFlag: false,
  bikePickUpZipCode: '',
  bikePickUpPrefectureId: '',
  bikePickUpMunicipalities: '',
  bikePickUpAddressBuildingName: '',
  bikePickUpPhoneNumber: '',
  bikePickUpFaxNumber: '',

  collectionStaffName: '',
  collectionStaffContactPhoneNumber: '',
  manager: '',
  managerPhoneNumber: '',
  tvaaCollectionWeek: '',
  tvaaInspectionWeek: '',
  tvaaInspectorCode: '',
  collectionStaffContactFaxNumber: '',
  bikeCollectionWeek: '',
  bikeInspectionWeek: '',
  bikeInspectorCode: '',
  collaborationInfo: '',
  memberMemo: '',

  faxSendKind: '',
  exhibitBlockKind: '',
  tvaaClaimStaff: '',
  bikeClaimStaff: '',
  tvaaListOutputKind: '',
  bikeListOutputKind: '',
  transferSalesAreaCode: '',

  changeHistoryNumber: '',
  changeExpectedDate: '',
};

/**
 * 初期データ
 */
const getLogisticsBaseBasicInfoResponseInitialValues: ScrMem0012GetLogisticsBaseBasicInfoResponse =
  {
    tvaaInformationFlag: '0',
    bikeInformationFlag: '0',
    collectionInformationFlag: '0',
    logisticsBaseRepresentContractId: '',
    logisticsBaseId: '',
    logisticsBaseName: '',
    logisticsBaseNameKana: '',
    logisticsBaseClientDisplayNameFlag: '',
    logisticsBaseClientDisplayName: '',
    logisticsBaseZipCode: '',
    logisticsBasePrefectureCode: '',
    logisticsBaseMunicipalities: '',
    logisticsBaseAddressBuildingName: '',
    logisticsBasePhoneNumber: '',
    logisticsBaseFaxNumber: '',
    logisticsBaseMailAddress: '',
    regionCode: '',
    districtCode: '',
    exhibitSegmentCode: '',
    exhibitMakerCode: '',
    salesAreaId: '',
    logisticsBaseStaffName: '',
    closedDate: '',
    tvaaNewSalesId: '',
    tvaaSalesId1: '',
    tvaaSalesId2: '',
    tvaaSalesId3: '',
    bikeNewSalesId: '',
    bikeSalesId1: '',
    bikeSalesId2: '',
    bikeSalesId3: '',
    tvaaStaffName: '',
    tvaaStaffContactPhoneNumber: '',
    tvaaLinkInformation: '',
    bikeStaffName: '',
    bikeStaffContactPhoneNumber: '',
    bikeDepoKind: '',
    bikeRegistrationDepoCode: '',
    bikeBelongKind: '',
    bikePrefectureNo: '',
    bikeRegionNo: '',
    bikeLinkInformation: '',
    bikePickUpLogisticsBaseInformationSynchronizationFlag: false,
    bikePickUpZipCode: '',
    bikePickUpPrefectureId: '',
    bikePickUpMunicipalities: '',
    bikePickUpAddressBuildingName: '',
    bikePickUpPhoneNumber: '',
    bikePickUpFaxNumber: '',
    collectionStaffName: '',
    collectionStaffContactPhoneNumber: '',
    manager: '',
    managerPhoneNumber: '',
    tvaaCollectionWeek: '',
    tvaaInspectionWeek: '',
    tvaaInspectorCode: '',
    collectionStaffContactFaxNumber: '',
    bikeCollectionWeek: '',
    bikeInspectionWeek: '',
    bikeInspectorCode: '',
    collaborationInfo: '',
    faxSendKind: '',
    exhibitBlockKind: '',
    tvaaClaimStaffId: '',
    tvaaClaimStaffName: '',
    bikeClaimStaffId: '',
    bikeClaimStaffName: '',
    tvaaListOutputKind: '',
    bikeListOutputKind: '',
    transferSalesAreaCode: '',
  };

/**
 * 検索条件初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  contractIdSelectValues: [],
  prefectureCodeselectValues: [],
  regionSelectValues: [],
  districtSelectValues: [],
  segmentSelectValues: [],
  makerCodeSelectValues: [],
  salesAreaSelectValues: [],
  salesIdSelectValues: [],
  bikeDepoKindSelectValues: [],
  registrationDepoSelectValues: [],
  bikeBelongKindSelectValues: [],
  inspectorSelectValues: [],
  faxSendKindSelectValues: [],
  exhibitBlockKindSelectValues: [],
  outputKindSelectValues: [],
  transferSalesAreaSelectValues: [],
};

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  tvaaInformationFlag: yup.string().label('四輪情報'),
  bikeInformationFlag: yup.string().label('二輪情報'),
  collectionInformationFlag: yup.string().label('集荷情報'),
  logisticsBaseRepresentContractId: yup
    .string()
    .label('物流拠点代表契約ID')
    .required(),
  logisticsBaseName: yup.string().label('物流拠点名').max(40).required(),
  logisticsBaseNameKana: yup
    .string()
    .label('物流拠点カナ')
    .max(10)
    .half()
    .required(),
  logisticsBaseClientDisplayNameFlag: yup
    .string()
    .label('顧客表示用名称')
    .required(),
  logisticsBaseClientDisplayName: yup.string().label('顧客表示用名称').max(40),
  logisticsBaseZipCode: yup.string().label('郵便番号').max(8).half().required(),
  logisticsBasePrefectureCode: yup.string().label('都道府県').required(),
  logisticsBaseMunicipalities: yup
    .string()
    .label('市区町村')
    .max(40)
    .required(),
  logisticsBaseAddressBuildingName: yup
    .string()
    .label('番地・号・建物名など')
    .max(40)
    .required(),
  logisticsBasePhoneNumber: yup
    .string()
    .label('TEL')
    .max(13)
    .phone()
    .required(),
  logisticsBaseFaxNumber: yup.string().label('FAX').max(13).phone(),
  logisticsBaseMailAddress: yup
    .string()
    .label('メールアドレス')
    .max(254)
    .half()
    .email(),
  regionCode: yup.string().label('地区コード/地区名').required(),
  districtCode: yup.string().label('市区郡コード/市区郡名').required(),
  exhibitSegmentCode: yup.string().label('出品セグメント'),
  exhibitMakerCode: yup.string().label('出品メーカーコード'),
  salesAreaId: yup.string().label('営業エリア'),
  logisticsBaseStaffName: yup.string().label('拠点担当者').max(30),
  closedDate: yup.string().label('定休日').max(6).required(),
  tvaaNewSalesId: yup.string().label('新規営業（四輪）'),
  tvaaSalesId1: yup.string().label('営業（四輪）１'),
  tvaaSalesId2: yup.string().label('営業（四輪）２'),
  tvaaSalesId3: yup.string().label('営業（四輪）３'),
  bikeNewSalesId: yup.string().label('新規営業（二輪）'),
  bikeSalesId1: yup.string().label('営業（二輪）１'),
  bikeSalesId2: yup.string().label('営業（二輪）２'),
  bikeSalesId3: yup.string().label('営業（二輪）３'),
  tvaaStaffName: yup.string().label('担当者').max(30),
  tvaaStaffContactPhoneNumber: yup
    .string()
    .label('担当者連絡先')
    .max(13)
    .phone(),
  tvaaLinkInformation: yup.string().label('連携情報').max(30),
  bikeStaffName: yup.string().label('担当者').max(30),
  bikeStaffContactPhoneNumber: yup
    .string()
    .label('担当者連絡先')
    .max(13)
    .phone(),
  bikeDepoKind: yup.string().label('デポ区分'),
  bikeRegistrationDepoCode: yup.string().label('登録デポ'),
  bikeBelongKind: yup.string().label('所属区分'),
  bikePrefectureNo: yup.string().label('県No').max(2).half(),
  bikeRegionNo: yup.string().label('地域No').max(3).half(),
  bikeLinkInformation: yup.string().label('連携情報').max(30),
  bikePickUpZipCode: yup.string().label('二輪車両引取先郵便番号').max(8).half(),
  bikePickUpPrefectureId: yup.string().label('二輪車両引取先都道府県'),
  bikePickUpMunicipalities: yup
    .string()
    .label('二輪車両引取先市区町村')
    .max(40),
  bikePickUpAddressBuildingName: yup
    .string()
    .label('二輪車両引取先番地・号・建物名など')
    .max(40),
  bikePickUpPhoneNumber: yup
    .string()
    .label('二輪車両引取先TEL')
    .max(13)
    .phone(),
  bikePickUpFaxNumber: yup.string().label('二輪車両引取先FAX').max(13).phone(),
  collectionStaffName: yup.string().label('担当者').max(30),
  collectionStaffContactPhoneNumber: yup
    .string()
    .label('担当者連絡先')
    .max(13)
    .phone(),
  manager: yup.string().label('責任者').max(30),
  managerPhoneNumber: yup.string().label('責任者連絡先').max(13).phone(),
  tvaaCollectionWeek: yup.string().label('集荷曜日（四輪）').max(4),
  tvaaInspectionWeek: yup.string().label('検査曜日（四輪）').max(4),
  tvaaInspectorCode: yup.string().label('検査員（四輪）').max(48),
  collectionStaffContactFaxNumber: yup
    .string()
    .label('担当者FAX')
    .max(13)
    .phone(),
  bikeCollectionWeek: yup.string().label('集荷曜日（二輪）').max(4),
  bikeInspectionWeek: yup.string().label('検査曜日（二輪）').max(4),
  bikeInspectorCode: yup.string().label('検査員（二輪）').max(48),
  collaborationInfo: yup.string().label('連携情報').max(20),
  faxSendKind: yup.string().label('FAX送信区分'),
  exhibitBlockKind: yup.string().label('出品ブロックフラグ'),
  tvaaClaimStaff: yup.string().label('クレーム担当（四輪）').max(48),
  bikeClaimStaff: yup.string().label('クレーム担当（二輪）').max(48),
  tvaaListOutputKind: yup.string().label('四輪リスト出力フラグ'),
  bikeListOutputKind: yup.string().label('二輪リスト出力フラグ'),
  transferSalesAreaCode: yup.string().label('振替営業エリア'),
};

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '物流拠点情報',
    fields: [
      'tvaaInformationFlag',
      'bikeInformationFlag',
      'collectionInformationFlag',
      'logisticsBaseRepresentContractId',
      'logisticsBaseName',
      'logisticsBaseNameKana',
      'logisticsBaseClientDisplayNameFlag',
      'logisticsBaseClientDisplayName',
      'logisticsBaseZipCode',
      'logisticsBasePrefectureCode',
      'logisticsBaseMunicipalities',
      'logisticsBaseAddressBuildingName',
      'logisticsBasePhoneNumber',
      'logisticsBaseFaxNumber',
      'logisticsBaseMailAddress',
      'regionCode',
      'districtCode',
      'exhibitSegmentCode',
      'exhibitMakerCode',
      'salesAreaId',
      'logisticsBaseStaffName',
      'closedDate',
      'tvaaNewSalesId',
      'tvaaSalesId1',
      'tvaaSalesId2',
      'tvaaSalesId3',
      'bikeNewSalesId',
      'bikeSalesId1',
      'bikeSalesId2',
      'bikeSalesId3',
    ],
    name: [
      '利用目的（四輪情報）',
      '利用目的（二輪情報）',
      '利用目的（集荷情報）',
      '物流拠点代表契約ID',
      '物流拠点名',
      '物流拠点カナ',
      '顧客表示用名称選択',
      '顧客表示用名称',
      '郵便番号',
      '都道府県',
      '市区町村',
      '番地・号・建物名など',
      'TEL',
      'FAX',
      'メールアドレス',
      '地区コード/地区名',
      '市区郡コード/市区郡名',
      '出品セグメント',
      '出品メーカーコード',
      '営業エリア',
      '拠点担当者',
      '定休日',
      '新規営業（四輪）',
      '営業（四輪）１',
      '営業（四輪）２',
      '営業（四輪）３',
      '新規営業（二輪）',
      '営業（二輪）１',
      '営業（二輪）２',
      '営業（二輪）３',
    ],
  },
  {
    section: '四輪情報',
    fields: [
      'tvaaStaffName',
      'tvaaStaffContactPhoneNumber',
      'tvaaLinkInformation',
    ],
    name: ['担当者', '担当者連絡先', '連携情報'],
  },
  {
    section: '二輪情報',
    fields: [
      'bikeStaffName',
      'bikeStaffContactPhoneNumber',
      'bikeDepoKind',
      'bikeRegistrationDepoCode',
      'bikeBelongKind',
      'bikePrefectureNo',
      'bikeRegionNo',
      'bikeLinkInformation',
    ],
    name: [
      '担当者',
      '担当者連絡先',
      'デポ区分',
      '登録デポ',
      '所属区分',
      '県No',
      '地域No',
      '連携情報',
    ],
  },
  {
    section: '二輪連携用',
    fields: [
      'bikePickUpLogisticsBaseInformationSynchronizationFlag',
      'bikePickUpZipCode',
      'bikePickUpPrefectureId',
      'bikePickUpMunicipalities',
      'bikePickUpAddressBuildingName',
      'bikePickUpPhoneNumber',
      'bikePickUpFaxNumber',
    ],
    name: [
      '物流拠点コピー',
      '二輪車両引取先郵便番号',
      '二輪車両引取先都道府県',
      '二輪車両引取先市区町村',
      '二輪車両引取先番地・号・建物名など',
      '二輪車両引取先TEL',
      '二輪車両引取先FAX',
    ],
  },
  {
    section: '集荷情報',
    fields: [
      'collectionStaffName',
      'collectionStaffContactPhoneNumber',
      'manager',
      'managerPhoneNumber',
      'tvaaCollectionWeek',
      'tvaaInspectionWeek',
      'tvaaInspectorCode',
      'collectionStaffContactFaxNumber',
      'bikeCollectionWeek',
      'bikeInspectionWeek',
      'bikeInspectorCode',
      'collaborationInfo',
    ],
    name: [
      '担当者',
      '担当者連絡先',
      '責任者',
      '責任者連絡先',
      '集荷曜日（四輪）',
      '検査曜日（四輪）',
      '検査員（四輪）',
      '担当者FAX',
      '集荷曜日（二輪）',
      '検査曜日（二輪）',
      '検査員（二輪）',
      '連携情報',
    ],
  },
  {
    section: '会員メモ',
    fields: ['memberMemo'],
    name: ['会員メモ'],
  },
  {
    section: '連携用',
    fields: [
      'faxSendKind',
      'exhibitBlockKind',
      'tvaaClaimStaff',
      'bikeClaimStaff',
      'tvaaListOutputKind',
      'bikeListOutputKind',
      'transferSalesAreaCode',
    ],
    name: [
      'FAX送信区分',
      '出品ブロックフラグ',
      'クレーム担当（四輪）',
      'クレーム担当（四輪）',
      '四輪リスト出力フラグ',
      '二輪リスト出力フラグ',
      '振替営業エリア',
    ],
  },
];

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: '',
};

/**
 * 法人基本情報取得API,物流拠点基本情報取得APIリクエストから法人基本情報データモデルへの変換
 */
const convertToBasicInfo = (
  getCorpBasicInfoResponse: ScrMem9999GetCorpBasicInfoResponse,
  getLogisticsBaseBasicInfoResponse: ScrMem0012GetLogisticsBaseBasicInfoResponse,
  changeHistoryNumber: string,
  changeExpectedDate: string
): BasicInfoModel => {
  return {
    corporationId: getCorpBasicInfoResponse.corporationId,
    corporationName: getCorpBasicInfoResponse.corporationName,
    address: getCorpBasicInfoResponse.address,
    corporationPhoneNumber: getCorpBasicInfoResponse.corporationPhoneNumber,
    corporationFaxNumber: getCorpBasicInfoResponse.corporationFaxNumber,
    tvaaInformationFlag:
      getLogisticsBaseBasicInfoResponse.tvaaInformationFlag === '0'
        ? false
        : true,
    bikeInformationFlag:
      getLogisticsBaseBasicInfoResponse.bikeInformationFlag === '0'
        ? false
        : true,
    collectionInformationFlag:
      getLogisticsBaseBasicInfoResponse.collectionInformationFlag === '0'
        ? false
        : true,
    logisticsBaseRepresentContractId:
      getLogisticsBaseBasicInfoResponse.logisticsBaseRepresentContractId,
    logisticsBaseId: getLogisticsBaseBasicInfoResponse.logisticsBaseId,
    logisticsBaseName: getLogisticsBaseBasicInfoResponse.logisticsBaseName,
    logisticsBaseNameKana:
      getLogisticsBaseBasicInfoResponse.logisticsBaseNameKana,
    logisticsBaseClientDisplayNameFlag:
      getLogisticsBaseBasicInfoResponse.logisticsBaseClientDisplayNameFlag,
    logisticsBaseClientDisplayName:
      getLogisticsBaseBasicInfoResponse.logisticsBaseClientDisplayName,
    logisticsBaseZipCode:
      getLogisticsBaseBasicInfoResponse.logisticsBaseZipCode,
    logisticsBasePrefectureCode:
      getLogisticsBaseBasicInfoResponse.logisticsBasePrefectureCode,
    logisticsBaseMunicipalities:
      getLogisticsBaseBasicInfoResponse.logisticsBaseMunicipalities,
    logisticsBaseAddressBuildingName:
      getLogisticsBaseBasicInfoResponse.logisticsBaseAddressBuildingName,
    logisticsBasePhoneNumber:
      getLogisticsBaseBasicInfoResponse.logisticsBasePhoneNumber,
    logisticsBaseFaxNumber:
      getLogisticsBaseBasicInfoResponse.logisticsBaseFaxNumber,
    logisticsBaseMailAddress:
      getLogisticsBaseBasicInfoResponse.logisticsBaseMailAddress,
    regionCode: getLogisticsBaseBasicInfoResponse.regionCode,
    districtCode: getLogisticsBaseBasicInfoResponse.districtCode,
    exhibitSegmentCode: getLogisticsBaseBasicInfoResponse.exhibitSegmentCode,
    exhibitMakerCode: getLogisticsBaseBasicInfoResponse.exhibitMakerCode,
    salesAreaId: getLogisticsBaseBasicInfoResponse.salesAreaId,
    logisticsBaseStaffName:
      getLogisticsBaseBasicInfoResponse.logisticsBaseStaffName,
    closedDate: getLogisticsBaseBasicInfoResponse.closedDate,
    tvaaNewSalesId: getLogisticsBaseBasicInfoResponse.tvaaNewSalesId,
    tvaaSalesId1: getLogisticsBaseBasicInfoResponse.tvaaSalesId1,
    tvaaSalesId2: getLogisticsBaseBasicInfoResponse.tvaaSalesId2,
    tvaaSalesId3: getLogisticsBaseBasicInfoResponse.tvaaSalesId3,
    bikeNewSalesId: getLogisticsBaseBasicInfoResponse.bikeNewSalesId,
    bikeSalesId1: getLogisticsBaseBasicInfoResponse.bikeSalesId1,
    bikeSalesId2: getLogisticsBaseBasicInfoResponse.bikeSalesId2,
    bikeSalesId3: getLogisticsBaseBasicInfoResponse.bikeSalesId3,

    tvaaStaffName: getLogisticsBaseBasicInfoResponse.tvaaStaffName,
    tvaaStaffContactPhoneNumber:
      getLogisticsBaseBasicInfoResponse.tvaaStaffContactPhoneNumber,
    tvaaLinkInformation: getLogisticsBaseBasicInfoResponse.tvaaLinkInformation,

    bikeStaffName: getLogisticsBaseBasicInfoResponse.bikeStaffName,
    bikeStaffContactPhoneNumber:
      getLogisticsBaseBasicInfoResponse.bikeStaffContactPhoneNumber,
    bikeDepoKind: getLogisticsBaseBasicInfoResponse.bikeDepoKind,
    bikeRegistrationDepoCode:
      getLogisticsBaseBasicInfoResponse.bikeRegistrationDepoCode,
    bikeBelongKind: getLogisticsBaseBasicInfoResponse.bikeBelongKind,
    bikePrefectureNo: getLogisticsBaseBasicInfoResponse.bikePrefectureNo,
    bikeRegionNo: getLogisticsBaseBasicInfoResponse.bikeRegionNo,
    bikeLinkInformation: getLogisticsBaseBasicInfoResponse.bikeLinkInformation,

    bikePickUpLogisticsBaseInformationSynchronizationFlag:
      getLogisticsBaseBasicInfoResponse.bikePickUpLogisticsBaseInformationSynchronizationFlag,
    bikePickUpZipCode: getLogisticsBaseBasicInfoResponse.bikePickUpZipCode,
    bikePickUpPrefectureId:
      getLogisticsBaseBasicInfoResponse.bikePickUpPrefectureId,
    bikePickUpMunicipalities:
      getLogisticsBaseBasicInfoResponse.bikePickUpMunicipalities,
    bikePickUpAddressBuildingName:
      getLogisticsBaseBasicInfoResponse.bikePickUpAddressBuildingName,
    bikePickUpPhoneNumber:
      getLogisticsBaseBasicInfoResponse.bikePickUpPhoneNumber,
    bikePickUpFaxNumber: getLogisticsBaseBasicInfoResponse.bikePickUpFaxNumber,

    collectionStaffName: getLogisticsBaseBasicInfoResponse.collectionStaffName,
    collectionStaffContactPhoneNumber:
      getLogisticsBaseBasicInfoResponse.collectionStaffContactPhoneNumber,
    manager: getLogisticsBaseBasicInfoResponse.manager,
    managerPhoneNumber: getLogisticsBaseBasicInfoResponse.managerPhoneNumber,
    tvaaCollectionWeek: getLogisticsBaseBasicInfoResponse.tvaaCollectionWeek,
    tvaaInspectionWeek: getLogisticsBaseBasicInfoResponse.tvaaInspectionWeek,
    tvaaInspectorCode: getLogisticsBaseBasicInfoResponse.tvaaInspectorCode,
    collectionStaffContactFaxNumber:
      getLogisticsBaseBasicInfoResponse.collectionStaffContactFaxNumber,
    bikeCollectionWeek: getLogisticsBaseBasicInfoResponse.bikeCollectionWeek,
    bikeInspectionWeek: getLogisticsBaseBasicInfoResponse.bikeInspectionWeek,
    bikeInspectorCode: getLogisticsBaseBasicInfoResponse.bikeInspectorCode,
    collaborationInfo: getLogisticsBaseBasicInfoResponse.collaborationInfo,
    memberMemo: getCorpBasicInfoResponse.memberMemo,

    faxSendKind: getLogisticsBaseBasicInfoResponse.faxSendKind,
    exhibitBlockKind: getLogisticsBaseBasicInfoResponse.exhibitBlockKind,
    tvaaClaimStaff:
      getLogisticsBaseBasicInfoResponse.tvaaClaimStaffId +
      '　' +
      getLogisticsBaseBasicInfoResponse.tvaaClaimStaffName,
    bikeClaimStaff:
      getLogisticsBaseBasicInfoResponse.bikeClaimStaffId +
      '　' +
      getLogisticsBaseBasicInfoResponse.bikeClaimStaffName,
    tvaaListOutputKind: getLogisticsBaseBasicInfoResponse.tvaaListOutputKind,
    bikeListOutputKind: getLogisticsBaseBasicInfoResponse.bikeListOutputKind,
    transferSalesAreaCode:
      getLogisticsBaseBasicInfoResponse.transferSalesAreaCode,

    changeHistoryNumber: changeHistoryNumber,
    changeExpectedDate: changeExpectedDate,
  };
};

/**
 * 変更履歴情報取得APIリクエストから法人基本情報データモデルへの変換
 */
const convertToHistoryInfo = (
  getHistoryInfoResponse: ScrMem9999GetHistoryInfoResponse,
  changeHistoryNumber: string
): BasicInfoModel => {
  return {
    corporationId: getHistoryInfoResponse.corporationId,
    corporationName: getHistoryInfoResponse.corporationName,
    address: getHistoryInfoResponse.address,
    corporationPhoneNumber: getHistoryInfoResponse.corporationPhoneNumber,
    corporationFaxNumber: getHistoryInfoResponse.corporationFaxNumber,
    tvaaInformationFlag:
      getHistoryInfoResponse.tvaaInformationFlag === '0' ? false : true,
    bikeInformationFlag:
      getHistoryInfoResponse.bikeInformationFlag === '0' ? false : true,
    collectionInformationFlag:
      getHistoryInfoResponse.collectionInformationFlag === '0' ? false : true,
    logisticsBaseRepresentContractId:
      getHistoryInfoResponse.logisticsBaseRepresentContractId,
    logisticsBaseId: getHistoryInfoResponse.logisticsBaseId,
    logisticsBaseName: getHistoryInfoResponse.logisticsBaseName,
    logisticsBaseNameKana: getHistoryInfoResponse.logisticsBaseNameKana,
    logisticsBaseClientDisplayNameFlag:
      getHistoryInfoResponse.logisticsBaseClientDisplayNameFlag,
    logisticsBaseClientDisplayName:
      getHistoryInfoResponse.logisticsBaseClientDisplayName,
    logisticsBaseZipCode: getHistoryInfoResponse.logisticsBaseZipCode,
    logisticsBasePrefectureCode:
      getHistoryInfoResponse.logisticsBasePrefectureCode,
    logisticsBaseMunicipalities:
      getHistoryInfoResponse.logisticsBaseMunicipalities,
    logisticsBaseAddressBuildingName:
      getHistoryInfoResponse.logisticsBaseAddressBuildingName,
    logisticsBasePhoneNumber: getHistoryInfoResponse.logisticsBasePhoneNumber,
    logisticsBaseFaxNumber: getHistoryInfoResponse.logisticsBaseFaxNumber,
    logisticsBaseMailAddress: getHistoryInfoResponse.logisticsBaseMailAddress,
    regionCode: getHistoryInfoResponse.regionCode,
    districtCode: getHistoryInfoResponse.districtCode,
    exhibitSegmentCode: getHistoryInfoResponse.exhibitSegmentCode,
    exhibitMakerCode: getHistoryInfoResponse.exhibitMakerCode,
    salesAreaId: getHistoryInfoResponse.salesAreaId,
    logisticsBaseStaffName: getHistoryInfoResponse.logisticsBaseStaffName,
    closedDate: getHistoryInfoResponse.closedDate,
    tvaaNewSalesId: getHistoryInfoResponse.tvaaNewSalesId,
    tvaaSalesId1: getHistoryInfoResponse.tvaaSalesId1,
    tvaaSalesId2: getHistoryInfoResponse.tvaaSalesId2,
    tvaaSalesId3: getHistoryInfoResponse.tvaaSalesId3,
    bikeNewSalesId: getHistoryInfoResponse.bikeNewSalesId,
    bikeSalesId1: getHistoryInfoResponse.bikeSalesId1,
    bikeSalesId2: getHistoryInfoResponse.bikeSalesId2,
    bikeSalesId3: getHistoryInfoResponse.bikeSalesId3,

    tvaaStaffName: getHistoryInfoResponse.tvaaStaffName,
    tvaaStaffContactPhoneNumber:
      getHistoryInfoResponse.tvaaStaffContactPhoneNumber,
    tvaaLinkInformation: getHistoryInfoResponse.tvaaLinkInformation,

    bikeStaffName: getHistoryInfoResponse.bikeStaffName,
    bikeStaffContactPhoneNumber:
      getHistoryInfoResponse.bikeStaffContactPhoneNumber,
    bikeDepoKind: getHistoryInfoResponse.bikeDepoKind,
    bikeRegistrationDepoCode: getHistoryInfoResponse.bikeRegistrationDepoCode,
    bikeBelongKind: getHistoryInfoResponse.bikeBelongKind,
    bikePrefectureNo: getHistoryInfoResponse.bikePrefectureNo,
    bikeRegionNo: getHistoryInfoResponse.bikeRegionNo,
    bikeLinkInformation: getHistoryInfoResponse.bikeLinkInformation,

    bikePickUpLogisticsBaseInformationSynchronizationFlag:
      getHistoryInfoResponse.bikePickUpLogisticsBaseInformationSynchronizationFlag,
    bikePickUpZipCode: getHistoryInfoResponse.bikePickUpZipCode,
    bikePickUpPrefectureId: getHistoryInfoResponse.bikePickUpPrefectureId,
    bikePickUpMunicipalities: getHistoryInfoResponse.bikePickUpMunicipalities,
    bikePickUpAddressBuildingName:
      getHistoryInfoResponse.bikePickUpAddressBuildingName,
    bikePickUpPhoneNumber: getHistoryInfoResponse.bikePickUpPhoneNumber,
    bikePickUpFaxNumber: getHistoryInfoResponse.bikePickUpFaxNumber,

    collectionStaffName: getHistoryInfoResponse.collectionStaffName,
    collectionStaffContactPhoneNumber:
      getHistoryInfoResponse.collectionStaffContactPhoneNumber,
    manager: getHistoryInfoResponse.manager,
    managerPhoneNumber: getHistoryInfoResponse.managerPhoneNumber,
    tvaaCollectionWeek: getHistoryInfoResponse.tvaaCollectionWeek,
    tvaaInspectionWeek: getHistoryInfoResponse.tvaaInspectionWeek,
    tvaaInspectorCode: getHistoryInfoResponse.tvaaInspectorCode,
    collectionStaffContactFaxNumber:
      getHistoryInfoResponse.collectionStaffContactFaxNumber,
    bikeCollectionWeek: getHistoryInfoResponse.bikeCollectionWeek,
    bikeInspectionWeek: getHistoryInfoResponse.bikeInspectionWeek,
    bikeInspectorCode: getHistoryInfoResponse.bikeInspectorCode,
    collaborationInfo: getHistoryInfoResponse.collaborationInfo,
    memberMemo: getHistoryInfoResponse.memberMemo,

    faxSendKind: getHistoryInfoResponse.faxSendKind,
    exhibitBlockKind: getHistoryInfoResponse.exhibitBlockKind,
    tvaaClaimStaff:
      getHistoryInfoResponse.tvaaClaimStaffId +
      '　' +
      getHistoryInfoResponse.tvaaClaimStaffName,
    bikeClaimStaff:
      getHistoryInfoResponse.bikeClaimStaffId +
      '　' +
      getHistoryInfoResponse.bikeClaimStaffName,
    tvaaListOutputKind: getHistoryInfoResponse.tvaaListOutputKind,
    bikeListOutputKind: getHistoryInfoResponse.bikeListOutputKind,
    transferSalesAreaCode: getHistoryInfoResponse.transferSalesAreaCode,

    changeHistoryNumber: changeHistoryNumber,
    changeExpectedDate: '',
  };
};

/**
 * 変更した項目から登録・変更内容データへの変換
 */
const convertToSectionList = (dirtyFields: object): sectionList[] => {
  const fields = Object.keys(dirtyFields);
  const sectionList: sectionList[] = [];
  sectionDef.forEach((d) => {
    const columnList: columnList[] = [];
    fields.forEach((f) => {
      if (d.fields.includes(f)) {
        columnList.push({ columnName: d.name[d.fields.indexOf(f)] });
      }
    });
    sectionList.push({
      sectionName: d.section,
      columnList: columnList,
    });
  });
  return sectionList;
};

/**
 * 物流拠点登録APIリクエストへの変換
 */
const convertFromRegistrationLogisticsBase = (
  basicInfoModel: BasicInfoModel,
  user: string,
  businessDate: string,
  registrationChangeMemo: string
): ScrMem0012RegistrationLogisticsBaseRequest => {
  return {
    corporationId: basicInfoModel.corporationId,
    corporationName: basicInfoModel.corporationName,
    address: basicInfoModel.address,
    corporationPhoneNumber: basicInfoModel.corporationPhoneNumber,
    corporationFaxNumber: basicInfoModel.corporationFaxNumber,
    tvaaInformationFlag: basicInfoModel.tvaaInformationFlag ? '1' : '0',
    bikeInformationFlag: basicInfoModel.bikeInformationFlag ? '1' : '0',
    collectionInformationFlag: basicInfoModel.collectionInformationFlag
      ? '1'
      : '0',
    logisticsBaseRepresentContractId:
      basicInfoModel.logisticsBaseRepresentContractId,
    logisticsBaseId: basicInfoModel.logisticsBaseId,
    logisticsBaseName: basicInfoModel.logisticsBaseName,
    logisticsBaseNameKana: basicInfoModel.logisticsBaseNameKana,
    logisticsBaseClientDisplayNameFlag:
      basicInfoModel.logisticsBaseClientDisplayNameFlag,
    logisticsBaseClientDisplayName:
      basicInfoModel.logisticsBaseClientDisplayName,
    logisticsBaseZipCode: basicInfoModel.logisticsBaseZipCode,
    logisticsBasePrefectureCode: basicInfoModel.logisticsBasePrefectureCode,
    logisticsBaseMunicipalities: basicInfoModel.logisticsBaseMunicipalities,
    logisticsBaseAddressBuildingName:
      basicInfoModel.logisticsBaseAddressBuildingName,
    logisticsBasePhoneNumber: basicInfoModel.logisticsBasePhoneNumber,
    logisticsBaseFaxNumber: basicInfoModel.logisticsBaseFaxNumber,
    logisticsBaseMailAddress: basicInfoModel.logisticsBaseMailAddress,
    regionCode: basicInfoModel.regionCode,
    districtCode: basicInfoModel.districtCode,
    exhibitSegmentCode: basicInfoModel.exhibitSegmentCode,
    exhibitMakerCode: basicInfoModel.exhibitMakerCode,
    salesAreaId: basicInfoModel.salesAreaId,
    logisticsBaseStaffName: basicInfoModel.logisticsBaseStaffName,
    closedDate: basicInfoModel.closedDate,
    tvaaNewSalesId: basicInfoModel.tvaaNewSalesId,
    tvaaSalesId1: basicInfoModel.tvaaSalesId1,
    tvaaSalesId2: basicInfoModel.tvaaSalesId2,
    tvaaSalesId3: basicInfoModel.tvaaSalesId3,
    bikeNewSalesId: basicInfoModel.bikeNewSalesId,
    bikeSalesId1: basicInfoModel.bikeSalesId1,
    bikeSalesId2: basicInfoModel.bikeSalesId2,
    bikeSalesId3: basicInfoModel.bikeSalesId3,
    tvaaStaffName: basicInfoModel.tvaaStaffName,
    tvaaStaffContactPhoneNumber: basicInfoModel.tvaaStaffContactPhoneNumber,
    tvaaLinkInformation: basicInfoModel.tvaaLinkInformation,
    bikeStaffName: basicInfoModel.bikeStaffName,
    bikeStaffContactPhoneNumber: basicInfoModel.bikeStaffContactPhoneNumber,
    bikeDepoKind: basicInfoModel.bikeDepoKind,
    bikeRegistrationDepoCode: basicInfoModel.bikeRegistrationDepoCode,
    bikeBelongKind: basicInfoModel.bikeBelongKind,
    bikePrefectureNo: basicInfoModel.bikePrefectureNo,
    bikeRegionNo: basicInfoModel.bikeRegionNo,
    bikeLinkInformation: basicInfoModel.bikeLinkInformation,
    bikePickUpLogisticsBaseInformationSynchronizationFlag:
      basicInfoModel.bikePickUpLogisticsBaseInformationSynchronizationFlag,
    bikePickUpZipCode: basicInfoModel.bikePickUpZipCode,
    bikePickUpPrefectureId: basicInfoModel.bikePickUpPrefectureId,
    bikePickUpMunicipalities: basicInfoModel.bikePickUpMunicipalities,
    bikePickUpAddressBuildingName: basicInfoModel.bikePickUpAddressBuildingName,
    bikePickUpPhoneNumber: basicInfoModel.bikePickUpPhoneNumber,
    bikePickUpFaxNumber: basicInfoModel.bikePickUpFaxNumber,
    collectionStaffName: basicInfoModel.collectionStaffName,
    collectionStaffContactPhoneNumber:
      basicInfoModel.collectionStaffContactPhoneNumber,
    manager: basicInfoModel.manager,
    managerPhoneNumber: basicInfoModel.managerPhoneNumber,
    tvaaCollectionWeek: basicInfoModel.tvaaCollectionWeek,
    tvaaInspectionWeek: basicInfoModel.tvaaInspectionWeek,
    tvaaInspectorCode: basicInfoModel.tvaaInspectorCode,
    collectionStaffContactFaxNumber:
      basicInfoModel.collectionStaffContactFaxNumber,
    bikeCollectionWeek: basicInfoModel.bikeCollectionWeek,
    bikeInspectionWeek: basicInfoModel.bikeInspectionWeek,
    bikeInspectorCode: basicInfoModel.bikeInspectorCode,
    collaborationInfo: basicInfoModel.collaborationInfo,
    memberMemo: basicInfoModel.memberMemo,
    faxSendKind: basicInfoModel.faxSendKind,
    exhibitBlockKind: basicInfoModel.exhibitBlockKind,
    tvaaClaimStaffId: basicInfoModel.tvaaClaimStaff.substring(0, 5),
    tvaaClaimStaffName: basicInfoModel.tvaaClaimStaff.substring(6),
    bikeClaimStaffId: basicInfoModel.bikeClaimStaff.substring(0, 5),
    bikeClaimStaffName: basicInfoModel.bikeClaimStaff.substring(6),
    tvaaListOutputKind: basicInfoModel.tvaaListOutputKind,
    bikeListOutputKind: basicInfoModel.bikeListOutputKind,
    transferSalesAreaCode: basicInfoModel.transferSalesAreaCode,
    applicationEmployeeId: user,
    businessDate: new Date(businessDate),
    registrationChangeMemo: registrationChangeMemo,
    screenId: 'SCR-MEM-0012',
    changeExpectDate: new Date(basicInfoModel.changeExpectedDate),
  };
};

/**
 * SCR-MEM-0012 物流拠点詳細画面
 */
const ScrMem0012Page = () => {
  // router
  const { corporationId, logisticsBaseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const readOnly = searchParams.get('readOnly');
  const { user } = useContext(AuthContext);

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [changeHistory, setChangeHistory] = useState<any>([]);
  const [scrCom00032PopupIsOpen, setScrCom00032PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckIsOpen, setChangeHistoryDateCheckIsOpen] =
    useState<boolean>(false);

  // コンポーネントを読み取り専用に変更するフラグ
  const readOnlyFlag: boolean =
    readOnly === null ? false : readOnly === 'true' ? true : false;
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0012') === -1
      ? true
      : readOnlyFlag
  );
  // form
  const methods = useForm<BasicInfoModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    setValue,
    getValues,
    reset,
    watch,
  } = methods;

  // 初期表示処理
  useEffect(() => {
    const initialize = async (
      corporationId: string,
      logisticsBaseId: string
    ) => {
      // 法人基本情報取得API
      const getCorpBasicInfoRequest = { corporationId: corporationId };
      const getCorpBasicInfoResponse = await ScrMem9999GetCorpBasicInfo(
        getCorpBasicInfoRequest
      );

      // 物流拠点基本情報取得API
      const getLogisticsBaseBasicInfoRequest = {
        corporationId: corporationId,
        logisticsBaseId: logisticsBaseId,
      };
      const getLogisticsBaseBasicInfoResponse =
        await ScrMem0012GetLogisticsBaseBasicInfo(
          getLogisticsBaseBasicInfoRequest
        );

      const basicInfo = convertToBasicInfo(
        getCorpBasicInfoResponse,
        getLogisticsBaseBasicInfoResponse,
        '',
        ''
      );
      reset(basicInfo);

      // リスト取得
      const newSelectValues = selectValuesInitialValues;
      // コード管理マスタ情報取得API
      const getCodeManagementMasterMultipleRequest = {
        codeId: [
          'CDE-COM-0050',
          'CDE-COM-0051',
          'CDE-COM-0052',
          'CDE-COM-0053',
          'CDE-COM-0054',
        ],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0050') {
          x.codeValueList.map((f) => {
            newSelectValues.bikeDepoKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0051') {
          x.codeValueList.map((f) => {
            newSelectValues.bikeBelongKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0052') {
          x.codeValueList.map((f) => {
            newSelectValues.faxSendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0053') {
          x.codeValueList.map((f) => {
            newSelectValues.exhibitBlockKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0054') {
          x.codeValueList.map((f) => {
            newSelectValues.outputKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 会員管理コード値取得API（コード管理マスタ以外）
      const scrMem9999GetCodeValueRequest = {
        entityList: [
          { entityName: 'region_code_master' },
          { entityName: 'district_name_master' },
          { entityName: 'segment_master' },
          { entityName: 'maker_code_master' },
          { entityName: 'sales_area_master' },
          { entityName: 'registration_depo_master' },
        ],
      };
      const ScrMem9999GetCodeValueResponse = await ScrMem9999GetCodeValue(
        scrMem9999GetCodeValueRequest
      );
      ScrMem9999GetCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'region_code_master') {
          x.codeValueList.map((f) => {
            newSelectValues.regionSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
        if (x.entityName === 'district_name_master') {
          x.codeValueList.map((f) => {
            newSelectValues.districtSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
        if (x.entityName === 'segment_master') {
          x.codeValueList.map((f) => {
            newSelectValues.segmentSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'maker_code_master') {
          x.codeValueList.map((f) => {
            newSelectValues.makerCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'sales_area_master') {
          x.codeValueList.map((f) => {
            newSelectValues.salesAreaSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
            newSelectValues.transferSalesAreaSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'registration_depo_master') {
          x.codeValueList.map((f) => {
            newSelectValues.registrationDepoSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 共通管理コード値取得API（コード管理マスタ以外）
      const scrCom9999GetCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const ScrCom9999GetCodeValueResponse = await ScrCom9999GetCodeValue(
        scrCom9999GetCodeValueRequest
      );
      ScrCom9999GetCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            newSelectValues.prefectureCodeselectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 物流拠点代表契約ID取得API
      const getLogisticsBaseRepresentativeContractRequest = {
        corporationId: corporationId,
      };
      const getLogisticsBaseRepresentativeContractResponse =
        await ScrMem9999GetLogisticsBaseRepresentativeContract(
          getLogisticsBaseRepresentativeContractRequest
        );
      getLogisticsBaseRepresentativeContractResponse.logisticsBaseRepresentativeContractIdList.map(
        (x) => {
          newSelectValues.contractIdSelectValues.push({
            value: x,
            displayValue: x,
          });
        }
      );

      // 従業員情報取得API（営業担当）
      const getSalesStaffRequest = {
        employeeId: '',
        businessDate: new Date(user.taskDate),
        salesStaffFlag: true,
        inspectorFlag: false,
      };
      const getSalesStaffResponse = await ScrCom9999GetStaff(
        getSalesStaffRequest
      );
      getSalesStaffResponse.list.map((x) => {
        newSelectValues.salesIdSelectValues.push({
          value: x.employeeId,
          displayValue: x.employeeId + '　' + x.employeeName,
        });
      });

      // 従業員情報取得API（検査員）
      const getInspectorStaffRequest = {
        employeeId: '',
        businessDate: new Date(user.taskDate),
        salesStaffFlag: false,
        inspectorFlag: true,
      };
      const getInspectorStaffResponse = await ScrCom9999GetStaff(
        getInspectorStaffRequest
      );
      getInspectorStaffResponse.list.map((x) => {
        newSelectValues.inspectorSelectValues.push({
          value: x.employeeId,
          displayValue: x.employeeId + '　' + x.employeeName,
        });
      });

      setSelectValues({
        contractIdSelectValues: newSelectValues.contractIdSelectValues,
        prefectureCodeselectValues: newSelectValues.prefectureCodeselectValues,
        regionSelectValues: newSelectValues.regionSelectValues,
        districtSelectValues: newSelectValues.districtSelectValues,
        segmentSelectValues: newSelectValues.segmentSelectValues,
        makerCodeSelectValues: newSelectValues.makerCodeSelectValues,
        salesAreaSelectValues: newSelectValues.salesAreaSelectValues,
        salesIdSelectValues: newSelectValues.salesIdSelectValues,
        bikeDepoKindSelectValues: newSelectValues.bikeDepoKindSelectValues,
        registrationDepoSelectValues:
          newSelectValues.registrationDepoSelectValues,
        bikeBelongKindSelectValues: newSelectValues.bikeBelongKindSelectValues,
        inspectorSelectValues: newSelectValues.inspectorSelectValues,
        faxSendKindSelectValues: newSelectValues.faxSendKindSelectValues,
        exhibitBlockKindSelectValues:
          newSelectValues.exhibitBlockKindSelectValues,
        outputKindSelectValues: newSelectValues.outputKindSelectValues,
        transferSalesAreaSelectValues:
          newSelectValues.transferSalesAreaSelectValues,
      });

      // 変更予定日取得API
      const getHistoryInfoRequest = {
        screenId: 'SCR-MEM-0012',
        tabId: 20,
        masterId: corporationId,
        businessDate: user.taskDate,
      };
      const getHistoryInfoResponse = await ScrCom9999GetChangeDate(
        getHistoryInfoRequest
      );
      setChangeHistory(
        getHistoryInfoResponse.changeExpectDateInfo.map((x) => {
          return {
            value: x.changeHistoryNumber,
            displayValue: x.changeExpectDate,
          };
        })
      );
    };

    const newInitialize = async (corporationId: string) => {
      // 法人基本情報取得API
      const getCorpBasicInfoRequest = { corporationId: corporationId };
      const getCorpBasicInfoResponse = await ScrMem9999GetCorpBasicInfo(
        getCorpBasicInfoRequest
      );

      const basicInfo = convertToBasicInfo(
        getCorpBasicInfoResponse,
        getLogisticsBaseBasicInfoResponseInitialValues,
        '',
        ''
      );
      reset(basicInfo);

      // リスト取得
      const newSelectValues = selectValuesInitialValues;
      // コード管理マスタ情報取得API
      const getCodeManagementMasterMultipleRequest = {
        codeId: [
          'CDE-COM-0050',
          'CDE-COM-0051',
          'CDE-COM-0052',
          'CDE-COM-0053',
          'CDE-COM-0054',
        ],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0050') {
          x.codeValueList.map((f) => {
            newSelectValues.bikeDepoKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0051') {
          x.codeValueList.map((f) => {
            newSelectValues.bikeBelongKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0052') {
          x.codeValueList.map((f) => {
            newSelectValues.faxSendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0053') {
          x.codeValueList.map((f) => {
            newSelectValues.exhibitBlockKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0054') {
          x.codeValueList.map((f) => {
            newSelectValues.outputKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 会員管理コード値取得API（コード管理マスタ以外）
      const scrMem9999GetCodeValueRequest = {
        entityList: [
          { entityName: 'region_code_master' },
          { entityName: 'district_name_master' },
          { entityName: 'segment_master' },
          { entityName: 'maker_code_master' },
          { entityName: 'sales_area_master' },
          { entityName: 'registration_depo_master' },
        ],
      };
      const ScrMem9999GetCodeValueResponse = await ScrMem9999GetCodeValue(
        scrMem9999GetCodeValueRequest
      );
      ScrMem9999GetCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'region_code_master') {
          x.codeValueList.map((f) => {
            newSelectValues.regionSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
        if (x.entityName === 'district_name_master') {
          x.codeValueList.map((f) => {
            newSelectValues.districtSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
        if (x.entityName === 'segment_master') {
          x.codeValueList.map((f) => {
            newSelectValues.segmentSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'maker_code_master') {
          x.codeValueList.map((f) => {
            newSelectValues.makerCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'sales_area_master') {
          x.codeValueList.map((f) => {
            newSelectValues.salesAreaSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
            newSelectValues.transferSalesAreaSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'registration_depo_master') {
          x.codeValueList.map((f) => {
            newSelectValues.registrationDepoSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 共通管理コード値取得API（コード管理マスタ以外）
      const scrCom9999GetCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const ScrCom9999GetCodeValueResponse = await ScrCom9999GetCodeValue(
        scrCom9999GetCodeValueRequest
      );
      ScrCom9999GetCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            newSelectValues.prefectureCodeselectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 物流拠点代表契約ID取得API
      const getLogisticsBaseRepresentativeContractRequest = {
        corporationId: corporationId,
      };
      const getLogisticsBaseRepresentativeContractResponse =
        await ScrMem9999GetLogisticsBaseRepresentativeContract(
          getLogisticsBaseRepresentativeContractRequest
        );
      getLogisticsBaseRepresentativeContractResponse.logisticsBaseRepresentativeContractIdList.map(
        (x) => {
          newSelectValues.contractIdSelectValues.push({
            value: x,
            displayValue: x,
          });
        }
      );

      // 従業員情報取得API（営業担当）
      const getSalesStaffRequest = {
        employeeId: '',
        businessDate: new Date(user.taskDate),
        salesStaffFlag: true,
        inspectorFlag: false,
      };
      const getSalesStaffResponse = await ScrCom9999GetStaff(
        getSalesStaffRequest
      );
      getSalesStaffResponse.list.map((x) => {
        newSelectValues.salesIdSelectValues.push({
          value: x.employeeId,
          displayValue: x.employeeId + '　' + x.employeeName,
        });
      });

      // 従業員情報取得API（検査員）
      const getInspectorStaffRequest = {
        employeeId: '',
        businessDate: new Date(user.taskDate),
        salesStaffFlag: false,
        inspectorFlag: true,
      };
      const getInspectorStaffResponse = await ScrCom9999GetStaff(
        getInspectorStaffRequest
      );
      getInspectorStaffResponse.list.map((x) => {
        newSelectValues.inspectorSelectValues.push({
          value: x.employeeId,
          displayValue: x.employeeId + '　' + x.employeeName,
        });
      });

      setSelectValues({
        contractIdSelectValues: newSelectValues.contractIdSelectValues,
        prefectureCodeselectValues: newSelectValues.prefectureCodeselectValues,
        regionSelectValues: newSelectValues.regionSelectValues,
        districtSelectValues: newSelectValues.districtSelectValues,
        segmentSelectValues: newSelectValues.segmentSelectValues,
        makerCodeSelectValues: newSelectValues.makerCodeSelectValues,
        salesAreaSelectValues: newSelectValues.salesAreaSelectValues,
        salesIdSelectValues: newSelectValues.salesIdSelectValues,
        bikeDepoKindSelectValues: newSelectValues.bikeDepoKindSelectValues,
        registrationDepoSelectValues:
          newSelectValues.registrationDepoSelectValues,
        bikeBelongKindSelectValues: newSelectValues.bikeBelongKindSelectValues,
        inspectorSelectValues: newSelectValues.inspectorSelectValues,
        faxSendKindSelectValues: newSelectValues.faxSendKindSelectValues,
        exhibitBlockKindSelectValues:
          newSelectValues.exhibitBlockKindSelectValues,
        outputKindSelectValues: newSelectValues.outputKindSelectValues,
        transferSalesAreaSelectValues:
          newSelectValues.transferSalesAreaSelectValues,
      });
    };

    const historyInfoInitialize = async (applicationId: string) => {
      // 変更履歴情報取得API
      const getHistoryInfoRequest = {
        changeHistoryNumber: applicationId,
      };
      const getHistoryInfoResponse = await ScrMem9999GetHistoryInfo(
        getHistoryInfoRequest
      );
      const historyInfo = convertToHistoryInfo(
        getHistoryInfoResponse,
        applicationId
      );
      reset(historyInfo);

      // リスト取得
      const newSelectValues = selectValuesInitialValues;
      // コード管理マスタ情報取得API
      const getCodeManagementMasterMultipleRequest = {
        codeId: [
          'CDE-COM-0050',
          'CDE-COM-0051',
          'CDE-COM-0052',
          'CDE-COM-0053',
          'CDE-COM-0054',
        ],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0050') {
          x.codeValueList.map((f) => {
            newSelectValues.bikeDepoKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0051') {
          x.codeValueList.map((f) => {
            newSelectValues.bikeBelongKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0052') {
          x.codeValueList.map((f) => {
            newSelectValues.faxSendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0053') {
          x.codeValueList.map((f) => {
            newSelectValues.exhibitBlockKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0054') {
          x.codeValueList.map((f) => {
            newSelectValues.outputKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 会員管理コード値取得API（コード管理マスタ以外）
      const scrMem9999GetCodeValueRequest = {
        entityList: [
          { entityName: 'region_code_master' },
          { entityName: 'district_name_master' },
          { entityName: 'segment_master' },
          { entityName: 'maker_code_master' },
          { entityName: 'sales_area_master' },
          { entityName: 'registration_depo_master' },
        ],
      };
      const ScrMem9999GetCodeValueResponse = await ScrMem9999GetCodeValue(
        scrMem9999GetCodeValueRequest
      );
      ScrMem9999GetCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'region_code_master') {
          x.codeValueList.map((f) => {
            newSelectValues.regionSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
        if (x.entityName === 'district_name_master') {
          x.codeValueList.map((f) => {
            newSelectValues.districtSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
        if (x.entityName === 'segment_master') {
          x.codeValueList.map((f) => {
            newSelectValues.segmentSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'maker_code_master') {
          x.codeValueList.map((f) => {
            newSelectValues.makerCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'sales_area_master') {
          x.codeValueList.map((f) => {
            newSelectValues.salesAreaSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
            newSelectValues.transferSalesAreaSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'registration_depo_master') {
          x.codeValueList.map((f) => {
            newSelectValues.registrationDepoSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 共通管理コード値取得API（コード管理マスタ以外）
      const scrCom9999GetCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const ScrCom9999GetCodeValueResponse = await ScrCom9999GetCodeValue(
        scrCom9999GetCodeValueRequest
      );
      ScrCom9999GetCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            newSelectValues.prefectureCodeselectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 物流拠点代表契約ID取得API
      const getLogisticsBaseRepresentativeContractRequest = {
        corporationId: historyInfo.corporationId,
      };
      const getLogisticsBaseRepresentativeContractResponse =
        await ScrMem9999GetLogisticsBaseRepresentativeContract(
          getLogisticsBaseRepresentativeContractRequest
        );
      getLogisticsBaseRepresentativeContractResponse.logisticsBaseRepresentativeContractIdList.map(
        (x) => {
          newSelectValues.contractIdSelectValues.push({
            value: x,
            displayValue: x,
          });
        }
      );

      // 従業員情報取得API（営業担当）
      const getSalesStaffRequest = {
        employeeId: '',
        businessDate: new Date(user.taskDate),
        salesStaffFlag: true,
        inspectorFlag: false,
      };
      const getSalesStaffResponse = await ScrCom9999GetStaff(
        getSalesStaffRequest
      );
      getSalesStaffResponse.list.map((x) => {
        newSelectValues.salesIdSelectValues.push({
          value: x.employeeId,
          displayValue: x.employeeId + '　' + x.employeeName,
        });
      });

      // 従業員情報取得API（検査員）
      const getInspectorStaffRequest = {
        employeeId: '',
        businessDate: new Date(user.taskDate),
        salesStaffFlag: false,
        inspectorFlag: true,
      };
      const getInspectorStaffResponse = await ScrCom9999GetStaff(
        getInspectorStaffRequest
      );
      getInspectorStaffResponse.list.map((x) => {
        newSelectValues.inspectorSelectValues.push({
          value: x.employeeId,
          displayValue: x.employeeId + '　' + x.employeeName,
        });
      });

      setSelectValues({
        contractIdSelectValues: newSelectValues.contractIdSelectValues,
        prefectureCodeselectValues: newSelectValues.prefectureCodeselectValues,
        regionSelectValues: newSelectValues.regionSelectValues,
        districtSelectValues: newSelectValues.districtSelectValues,
        segmentSelectValues: newSelectValues.segmentSelectValues,
        makerCodeSelectValues: newSelectValues.makerCodeSelectValues,
        salesAreaSelectValues: newSelectValues.salesAreaSelectValues,
        salesIdSelectValues: newSelectValues.salesIdSelectValues,
        bikeDepoKindSelectValues: newSelectValues.bikeDepoKindSelectValues,
        registrationDepoSelectValues:
          newSelectValues.registrationDepoSelectValues,
        bikeBelongKindSelectValues: newSelectValues.bikeBelongKindSelectValues,
        inspectorSelectValues: newSelectValues.inspectorSelectValues,
        faxSendKindSelectValues: newSelectValues.faxSendKindSelectValues,
        exhibitBlockKindSelectValues:
          newSelectValues.exhibitBlockKindSelectValues,
        outputKindSelectValues: newSelectValues.outputKindSelectValues,
        transferSalesAreaSelectValues:
          newSelectValues.transferSalesAreaSelectValues,
      });
    };

    if (applicationId !== null) {
      historyInfoInitialize(applicationId);
    }
    if (corporationId === undefined) return;
    if (logisticsBaseId === undefined) {
      newInitialize(corporationId);
    } else {
      initialize(corporationId, logisticsBaseId);
    }
  }, [corporationId, logisticsBaseId, applicationId, reset]);

  // 項目変更イベント
  useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      if (name === 'bikePickUpLogisticsBaseInformationSynchronizationFlag') {
        if (value.bikePickUpLogisticsBaseInformationSynchronizationFlag) {
          setValue('bikePickUpZipCode', getValues('logisticsBaseZipCode'));
          setValue(
            'bikePickUpPrefectureId',
            getValues('logisticsBasePrefectureCode')
          );
          setValue(
            'bikePickUpMunicipalities',
            getValues('logisticsBaseMunicipalities')
          );
          setValue(
            'bikePickUpAddressBuildingName',
            getValues('logisticsBaseAddressBuildingName')
          );
          setValue(
            'bikePickUpPhoneNumber',
            getValues('logisticsBasePhoneNumber')
          );
          setValue('bikePickUpFaxNumber', getValues('logisticsBaseFaxNumber'));
        } else {
          setValue('bikePickUpZipCode', '');
          setValue('bikePickUpPrefectureId', '');
          setValue('bikePickUpMunicipalities', '');
          setValue('bikePickUpAddressBuildingName', '');
          setValue('bikePickUpPhoneNumber', '');
          setValue('bikePickUpFaxNumber', '');
        }
      }

      if (name === 'districtCode') {
        value.districtCode;
        // 市区郡名称取得
        const getDistrictStaffNameRequest = {
          districtCode: getValues('districtCode'),
        };
        const getDistrictStaffNameResponse =
          await ScrMem0012GetDistrictStaffName(getDistrictStaffNameRequest);
        setValue('districtCode', getDistrictStaffNameResponse.districtCode);
        setValue('tvaaNewSalesId', getDistrictStaffNameResponse.tvaaNewSalesId);
        setValue('bikeNewSalesId', getDistrictStaffNameResponse.bikeNewSalesId);
        setValue('tvaaSalesId1', getDistrictStaffNameResponse.tvaaSalesId1);
        setValue('tvaaSalesId2', getDistrictStaffNameResponse.tvaaSalesId2);
        setValue('tvaaSalesId3', getDistrictStaffNameResponse.tvaaSalesId3);
        setValue('bikeSalesId1', getDistrictStaffNameResponse.bikeSalesId1);
        setValue('bikeSalesId2', getDistrictStaffNameResponse.bikeSalesId2);
        setValue('bikeSalesId3', getDistrictStaffNameResponse.bikeSalesId3);
        setValue(
          'tvaaInspectorCode',
          getDistrictStaffNameResponse.tvaaInspectorCode
        );
        setValue(
          'bikeInspectorCode',
          getDistrictStaffNameResponse.bikeInspectorCode
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  /**
   * 郵便番号フォーカスアウトイベント
   */
  const logisticsBaseZipCodeOnBlur = async () => {
    // 住所情報取得
    const getAddressInfoRequest = {
      zipCode: getValues('logisticsBaseZipCode'),
    };
    const getAddressInfoResponse = await ScrCom9999GetAddressInfo(
      getAddressInfoRequest
    );
    setValue(
      'logisticsBasePrefectureCode',
      getAddressInfoResponse.prefectureCode
    );
    setValue(
      'logisticsBaseMunicipalities',
      getAddressInfoResponse.municipalities
    );
    setValue(
      'logisticsBaseAddressBuildingName',
      getAddressInfoResponse.townOrStreetName
    );
    setValue('districtCode', getAddressInfoResponse.districtCode);

    // 市区郡名称取得
    const getDistrictStaffNameRequest = {
      districtCode: getValues('districtCode'),
    };
    const getDistrictStaffNameResponse = await ScrMem0012GetDistrictStaffName(
      getDistrictStaffNameRequest
    );
    setValue('districtCode', getDistrictStaffNameResponse.districtCode);
    setValue('tvaaNewSalesId', getDistrictStaffNameResponse.tvaaNewSalesId);
    setValue('bikeNewSalesId', getDistrictStaffNameResponse.bikeNewSalesId);
    setValue('tvaaSalesId1', getDistrictStaffNameResponse.tvaaSalesId1);
    setValue('tvaaSalesId2', getDistrictStaffNameResponse.tvaaSalesId2);
    setValue('tvaaSalesId3', getDistrictStaffNameResponse.tvaaSalesId3);
    setValue('bikeSalesId1', getDistrictStaffNameResponse.bikeSalesId1);
    setValue('bikeSalesId2', getDistrictStaffNameResponse.bikeSalesId2);
    setValue('bikeSalesId3', getDistrictStaffNameResponse.bikeSalesId3);
    setValue(
      'tvaaInspectorCode',
      getDistrictStaffNameResponse.tvaaInspectorCode
    );
    setValue(
      'bikeInspectorCode',
      getDistrictStaffNameResponse.bikeInspectorCode
    );
  };

  /**
   * 郵便番号（二輪連携用）フォーカスアウトイベント
   */
  const bikePickUpZipCodeOnBlur = async () => {
    // 住所情報取得
    const getAddressInfoRequest = {
      zipCode: getValues('bikePickUpZipCode'),
    };
    const getAddressInfoResponse = await ScrCom9999GetAddressInfo(
      getAddressInfoRequest
    );
    setValue('bikePickUpPrefectureId', getAddressInfoResponse.prefectureCode);
    setValue('bikePickUpMunicipalities', getAddressInfoResponse.municipalities);
    setValue(
      'bikePickUpAddressBuildingName',
      getAddressInfoResponse.townOrStreetName
    );
  };

  /**
   * 会員メモ編集リンククリック時のイベントハンドラ
   */
  const linkOnClick = () => {
    const uri =
      '/mem/corporations/' +
        corporationId +
        getValues('changeHistoryNumber') !==
      ''
        ? '?applicationId=' + getValues('changeHistoryNumber')
        : '';
    navigate(uri);
  };

  /**
   * 表示切替クリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    // 変更履歴情報取得API
    const getHistoryInfoRequest = {
      changeHistoryNumber: getValues('changeHistoryNumber'),
    };
    const getHistoryInfoResponse = await ScrMem9999GetHistoryInfo(
      getHistoryInfoRequest
    );
    const historyInfo = convertToHistoryInfo(
      getHistoryInfoResponse,
      getValues('changeHistoryNumber')
    );
    reset(historyInfo);
    setIsChangeHistoryBtn(true);
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations/');
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const onClickConfirm = () => {
    // 反映予定日整合性チェック
    setChangeHistoryDateCheckIsOpen(true);
  };

  /**
   * 確定ボタンクリック時（反映予定日整合性チェック後）のイベントハンドラ
   */
  const ChangeHistoryDateCheckUtilHandleConfirm = async (checkFlg: boolean) => {
    setChangeHistoryDateCheckIsOpen(false);
    if (!checkFlg) return;
    const values = getValues();
    const errorList = [];

    // 物流拠点情報セクション．FAXと物流拠点情報セクション．メールアドレスがともに空の場合
    if (
      values.logisticsBaseFaxNumber === '' &&
      values.logisticsBaseMailAddress === ''
    ) {
      errorList.push({
        errorCode: 'MSG-FR-ERR-00058',
        errorMessage: 'FAX、または、アドレスを入力してください',
      });
    }

    // 物流拠点情報セクション．営業（四輪）１、営業（四輪）２、営業（四輪）３の入力順が正しいかチェックする。
    if (
      values.tvaaSalesId1 === '' &&
      (values.tvaaSalesId2 !== '' || values.tvaaSalesId3 !== '')
    ) {
      errorList.push({
        errorCode: 'MSG-FR-ERR-00055',
        errorMessage: '営業（四輪）は上から順に入力してください',
      });
    } else if (values.tvaaSalesId2 === '' && values.tvaaSalesId3 !== '') {
      errorList.push({
        errorCode: 'MSG-FR-ERR-00055',
        errorMessage: '営業（四輪）は上から順に入力してください',
      });
    }

    // 物流拠点情報セクション．営業（二輪）１、営業（二輪）２、営業（二輪）３の入力順が正しいかチェックする。
    if (
      values.bikeSalesId1 === '' &&
      (values.bikeSalesId2 !== '' || values.bikeSalesId3 !== '')
    ) {
      errorList.push({
        errorCode: 'MSG-FR-ERR-00056',
        errorMessage: '営業（二輪）は上から順に入力してください',
      });
    } else if (values.bikeSalesId2 === '' && values.bikeSalesId3 !== '') {
      errorList.push({
        errorCode: 'MSG-FR-ERR-00056',
        errorMessage: '営業（二輪）は上から順に入力してください',
      });
    }

    // 二輪連携用セクション．物流拠点コピーがtrueの場合、それぞれ値が一致しているかチェックする。
    if (values.bikePickUpLogisticsBaseInformationSynchronizationFlag === true) {
      if (
        values.bikePickUpZipCode !== values.logisticsBaseZipCode ||
        values.bikePickUpPrefectureId !== values.logisticsBasePrefectureCode ||
        values.bikePickUpMunicipalities !==
          values.logisticsBaseMunicipalities ||
        values.bikePickUpAddressBuildingName !==
          values.logisticsBaseAddressBuildingName ||
        values.bikePickUpPhoneNumber !== values.logisticsBasePhoneNumber ||
        values.bikePickUpFaxNumber !== values.logisticsBaseFaxNumber
      ) {
        errorList.push({
          errorCode: 'MSG-FR-ERR-00057',
          errorMessage:
            '二輪連携用情報がコピー元と一致しませんので物流拠点コピーを解除してください',
        });
      }
    }

    // 物流拠点情報入力チェックAPI
    const inputCheckLogisticsBaseInfoRequest = {
      corporationId: values.corporationId,
      contractId: values.logisticsBaseRepresentContractId,
      logisticsBaseZipCode: values.logisticsBaseZipCode,
      logisticsBasePrefectureCode: values.logisticsBasePrefectureCode,
      logisticsBaseMunicipalities: values.logisticsBaseMunicipalities,
      logisticsBaseAddressBuildingName: values.logisticsBaseAddressBuildingName,
      logisticsBasePhoneNumber: values.logisticsBasePhoneNumber,
      logisticsBaseFaxNumber: values.logisticsBaseFaxNumber,
      logisticsBaseMailAddress: values.logisticsBaseMailAddress,
    };
    const inputCheckLogisticsBaseInfoResponse =
      await ScrMem0012InputCheckLogisticsBaseInfo(
        inputCheckLogisticsBaseInfoRequest
      );
    inputCheckLogisticsBaseInfoResponse.errorList.map((x) => {
      errorList.push(x);
    });

    setScrCom0032PopupData({
      errorList: errorList,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0012',
          screenName: '物流拠点詳細',
          tabId: 20,
          tabName: '',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      changeExpectDate: getValues('changeExpectedDate'),
    });
    setScrCom00032PopupIsOpen(true);
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const scrCom00032PopupHandleCancel = () => {
    setScrCom00032PopupIsOpen(false);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const scrCom00032PopupHandleConfirm = async (
    registrationChangeMemo: string
  ) => {
    setScrCom00032PopupIsOpen(false);
    // 物流拠点登録API
    const registrationLogisticsBaseRequest =
      convertFromRegistrationLogisticsBase(
        getValues(),
        user.employeeId,
        user.taskDate,
        registrationChangeMemo
      );
    await ScrMem0012RegistrationLogisticsBase(registrationLogisticsBaseRequest);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 法人情報セクション */}
            <Section name='法人情報'>
              <RowStack>
                <ColStack>
                  <RowStack>
                    <ColStack>
                      <TextField label='法人ID' name='corporationId' readonly />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='法人名'
                        name='corporationName'
                        readonly
                        size='m'
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='住所'
                        name='address'
                        readonly
                        size='l'
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='TEL'
                        name='corporationPhoneNumber'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='FAX'
                        name='corporationFaxNumber'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                </ColStack>
              </RowStack>
            </Section>
            {/* 物流拠点情報セクション */}
            <Section name='物流拠点情報'>
              <RowStack>
                <ColStack>
                  <InputLayout label='利用目的' size='s' required>
                    <InputRowStack>
                      <Checkbox name='tvaaInformationFlag' label='四輪情報' />
                      <Checkbox name='bikeInformationFlag' label='二輪情報' />
                      <Checkbox
                        name='collectionInformationFlag'
                        label='集荷情報'
                      />
                    </InputRowStack>
                  </InputLayout>
                  <Select
                    label='物流拠点代表契約ID'
                    name='logisticsBaseRepresentContractId'
                    selectValues={selectValues.contractIdSelectValues}
                    blankOption
                    required
                  />
                  <MarginBox mt={17}>
                    <TextField
                      label='物流拠点ID'
                      name='logisticsBaseId'
                      readonly
                    />
                  </MarginBox>
                  <TextField
                    label='物流拠点名'
                    name='logisticsBaseName'
                    required
                  />
                  <TextField
                    label='物流拠点カナ'
                    name='logisticsBaseNameKana'
                    required
                  />
                  <InputLayout label='顧客表示用名称' size='s'>
                    <Radio
                      name='logisticsBaseClientDisplayNameFlag'
                      radioValues={[
                        { value: 0, displayValue: '表示無' },
                        { value: 1, displayValue: '表示有' },
                      ]}
                      disabled={isReadOnly[0]}
                    ></Radio>
                    <TextField
                      name='logisticsBaseClientDisplayName'
                      disabled={
                        getValues('logisticsBaseClientDisplayNameFlag') === '0'
                          ? true
                          : false
                      }
                    />
                  </InputLayout>
                </ColStack>
                <ColStack>
                  <MarginBox mt={17.5}>
                    <PostalTextField
                      label='郵便番号'
                      name='logisticsBaseZipCode'
                      required
                      onBlur={logisticsBaseZipCodeOnBlur}
                    />
                  </MarginBox>
                  <Select
                    label='都道府県'
                    name='logisticsBasePrefectureCode'
                    selectValues={selectValues.prefectureCodeselectValues}
                    blankOption
                    required
                  />
                  <TextField
                    label='市区町村'
                    name='logisticsBaseMunicipalities'
                    required
                    size='s'
                  />
                  <TextField
                    label='番地・号・建物名など'
                    name='logisticsBaseAddressBuildingName'
                    required
                    size='s'
                  />
                  <TextField
                    label='TEL'
                    name='logisticsBasePhoneNumber'
                    required
                  />
                  <TextField label='FAX' name='logisticsBaseFaxNumber' />
                  <TextField
                    label='メールアドレス'
                    name='logisticsBaseMailAddress'
                    size='s'
                  />
                </ColStack>
                <ColStack>
                  <MarginBox mt={17.5}>
                    <Select
                      label='地区コード/地区名'
                      name='regionCode'
                      selectValues={selectValues.regionSelectValues}
                      blankOption
                      required
                    />
                  </MarginBox>
                  <Select
                    label='市区郡コード/市区郡名'
                    name='districtCode'
                    selectValues={selectValues.districtSelectValues}
                    blankOption
                    required
                  />
                  <Select
                    label='出品セグメント'
                    name='exhibitSegmentCode'
                    selectValues={selectValues.segmentSelectValues}
                    blankOption
                  />
                  <Select
                    label='出品メーカーコード'
                    name='exhibitMakerCode'
                    selectValues={selectValues.makerCodeSelectValues}
                    blankOption
                  />
                  <Select
                    label='営業エリア'
                    name='salesAreaId'
                    selectValues={selectValues.salesAreaSelectValues}
                    blankOption
                  />
                  <TextField label='拠点担当者' name='logisticsBaseStaffName' />
                  <TextField label='定休日' name='closedDate' required />
                </ColStack>
                <ColStack>
                  <MarginBox mt={17.5}>
                    <Select
                      label='新規営業（四輪）'
                      name='tvaaNewSalesId'
                      selectValues={selectValues.salesIdSelectValues}
                      blankOption
                    />
                  </MarginBox>
                  <InputLayout label='営業（四輪）' size='s'>
                    <Stack spacing={2.5}>
                      <Select
                        name='tvaaSalesId1'
                        selectValues={selectValues.salesIdSelectValues}
                        blankOption
                      />
                      <Select
                        name='tvaaSalesId2'
                        selectValues={selectValues.salesIdSelectValues}
                        blankOption
                      />
                      <Select
                        name='tvaaSalesId3'
                        selectValues={selectValues.salesIdSelectValues}
                        blankOption
                      />
                    </Stack>
                  </InputLayout>
                  <Select
                    label='新規営業（二輪）'
                    name='bikeNewSalesId'
                    selectValues={selectValues.salesIdSelectValues}
                    blankOption
                  />
                  <InputLayout label='営業（二輪）' size='s'>
                    <Stack spacing={2.5}>
                      <Select
                        name='bikeSalesId1'
                        selectValues={selectValues.salesIdSelectValues}
                        blankOption
                      />
                      <Select
                        name='bikeSalesId2'
                        selectValues={selectValues.salesIdSelectValues}
                        blankOption
                      />
                      <Select
                        name='bikeSalesId3'
                        selectValues={selectValues.salesIdSelectValues}
                        blankOption
                      />
                    </Stack>
                  </InputLayout>
                </ColStack>
              </RowStack>
            </Section>
            {/* 四輪情報セクション */}
            <Section name='四輪情報'>
              <RowStack>
                <ColStack>
                  <TextField label='担当者' name='tvaaStaffName' size='m' />
                  <TextField
                    label='担当者連絡先'
                    name='tvaaStaffContactPhoneNumber'
                    size='m'
                  />
                  <TextField
                    label='連携情報'
                    name='tvaaLinkInformation'
                    size='l'
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 二輪情報セクション */}
            <Section name='二輪情報'>
              <RowStack>
                <ColStack>
                  <TextField label='担当者' name='bikeStaffName' size='m' />
                  <TextField
                    label='担当者連絡先'
                    name='bikeStaffContactPhoneNumber'
                    size='m'
                  />
                  <Select
                    label='デポ区分'
                    name='bikeDepoKind'
                    selectValues={selectValues.bikeDepoKindSelectValues}
                    blankOption
                    size='m'
                  />
                  <Select
                    label='登録デポ'
                    name='bikeRegistrationDepoCode'
                    selectValues={selectValues.registrationDepoSelectValues}
                    blankOption
                    size='m'
                  />
                  <Select
                    label='所属区分'
                    name='bikeBelongKind'
                    selectValues={selectValues.bikeBelongKindSelectValues}
                    blankOption
                    size='m'
                  />
                  <TextField label='県No' name='bikePrefectureNo' size='m' />
                  <TextField label='地域No' name='bikeRegionNo' size='m' />
                  <TextField
                    label='連携情報'
                    name='bikeLinkInformation'
                    size='l'
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 二輪連携用セクション */}
            <Section name='二輪連携用'>
              <RowStack>
                <ColStack>
                  <Checkbox
                    name='bikePickUpLogisticsBaseInformationSynchronizationFlag'
                    label='物流拠点コピー'
                  />
                  <PostalTextField
                    label='二輪車両引取先郵便番号'
                    name='bikePickUpZipCode'
                    disabled={getValues(
                      'bikePickUpLogisticsBaseInformationSynchronizationFlag'
                    )}
                    onBlur={bikePickUpZipCodeOnBlur}
                  />
                  <Select
                    label='二輪車両引取先都道府県'
                    name='bikePickUpPrefectureId'
                    selectValues={selectValues.prefectureCodeselectValues}
                    blankOption
                    disabled={getValues(
                      'bikePickUpLogisticsBaseInformationSynchronizationFlag'
                    )}
                  />
                  <TextField
                    label='二輪車両引取先市区町村'
                    name='bikePickUpMunicipalities'
                    size='l'
                    disabled={getValues(
                      'bikePickUpLogisticsBaseInformationSynchronizationFlag'
                    )}
                  />
                  <TextField
                    label='二輪車両引取先番地・号・建物名など'
                    name='bikePickUpAddressBuildingName'
                    size='l'
                    disabled={getValues(
                      'bikePickUpLogisticsBaseInformationSynchronizationFlag'
                    )}
                  />
                </ColStack>
                <ColStack>
                  <MarginBox mt={13}>
                    <TextField
                      label='二輪車両引取先TEL'
                      name='bikePickUpPhoneNumber'
                      disabled={getValues(
                        'bikePickUpLogisticsBaseInformationSynchronizationFlag'
                      )}
                    />
                  </MarginBox>
                  <TextField
                    label='二輪車両引取先FAX'
                    name='bikePickUpFaxNumber'
                    disabled={getValues(
                      'bikePickUpLogisticsBaseInformationSynchronizationFlag'
                    )}
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 集荷情報セクション */}
            <Section name='集荷情報'>
              <RowStack>
                <ColStack>
                  <TextField label='担当者' name='collectionStaffName' />
                  <TextField
                    label='担当者連絡先'
                    name='collectionStaffContactPhoneNumber'
                  />
                  <TextField label='責任者' name='manager' />
                  <TextField label='責任者連絡先' name='managerPhoneNumber' />
                </ColStack>
                <ColStack>
                  <TextField
                    label='集荷曜日（四輪）'
                    name='tvaaCollectionWeek'
                  />
                  <TextField
                    label='検査曜日（四輪）'
                    name='tvaaInspectionWeek'
                  />
                  <Select
                    label='検査員（四輪）'
                    name='tvaaInspectorCode'
                    selectValues={selectValues.inspectorSelectValues}
                    blankOption
                  />
                  <TextField
                    label='担当者FAX'
                    name='collectionStaffContactFaxNumber'
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='集荷曜日（二輪）'
                    name='bikeCollectionWeek'
                  />
                  <TextField
                    label='検査曜日（二輪）'
                    name='bikeInspectionWeek'
                  />
                  <Select
                    label='検査員（二輪）'
                    name='bikeInspectorCode'
                    selectValues={selectValues.inspectorSelectValues}
                    blankOption
                  />
                  <TextField label='連携情報' name='collaborationInfo' />
                </ColStack>
              </RowStack>
            </Section>
            {/* 会員メモセクション */}
            <Section name='会員メモ'>
              <RowStack>
                <ColStack>
                  <Link href='#' onClick={linkOnClick}>
                    会員メモ編集
                  </Link>
                </ColStack>
                <ColStack>
                  <Textarea name='memberMemo' disabled size='l' />
                </ColStack>
              </RowStack>
            </Section>
            {/* 連携用セクション */}
            <Section name='連携用'>
              <RowStack>
                <ColStack>
                  <Select
                    label='FAX送信区分'
                    name='faxSendKind'
                    selectValues={selectValues.faxSendKindSelectValues}
                    blankOption
                    size='m'
                  />
                  <Select
                    label='出品ブロックフラグ'
                    name='exhibitBlockKind'
                    selectValues={selectValues.exhibitBlockKindSelectValues}
                    blankOption
                    size='m'
                  />
                  <TextField
                    label='クレーム担当（四輪）'
                    name='tvaaClaimStaff'
                    size='l'
                    readonly
                  />
                  <TextField
                    label='クレーム担当（二輪）'
                    name='bikeClaimStaff'
                    size='l'
                    readonly
                  />
                </ColStack>
                <ColStack>
                  <Select
                    label='四輪リスト出力フラグ'
                    name='tvaaListOutputKind'
                    selectValues={selectValues.outputKindSelectValues}
                    blankOption
                    size='m'
                  />
                  <Select
                    label='二輪リスト出力フラグ'
                    name='bikeListOutputKind'
                    selectValues={selectValues.outputKindSelectValues}
                    blankOption
                    size='m'
                  />
                  <Select
                    label='振替営業エリア'
                    name='transferSalesAreaCode'
                    selectValues={selectValues.transferSalesAreaSelectValues}
                    blankOption
                    size='m'
                  />
                </ColStack>
              </RowStack>
            </Section>
          </FormProvider>
        </MainLayout>

        {/* right */}
        <MainLayout right>
          <FormProvider {...methods}>
            <Grid container height='100%'>
              <Grid item size='s'>
                <RightElementStack>
                  {changeHistory.length >= 0 ? (
                    <Stack>
                      <Typography bold>変更予約情報</Typography>
                      <WarningLabel text='変更予約あり' />
                      <Select
                        name='changeHistoryNumber'
                        selectValues={changeHistory}
                        blankOption
                      />
                      <PrimaryButton onClick={handleSwichDisplay}>
                        表示切替
                      </PrimaryButton>
                    </Stack>
                  ) : (
                    ''
                  )}
                  <BottomBox>
                    <DatePicker
                      label='変更予定日'
                      name='changeExpectedDate'
                      disabled={isReadOnly[0]}
                    />
                  </BottomBox>
                </RightElementStack>
              </Grid>
            </Grid>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel} disable={readOnly !== null}>
              キャンセル
            </CancelButton>
            <ConfirmButton onClick={onClickConfirm} disable={isReadOnly[0]}>
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {scrCom00032PopupIsOpen ? (
        <ScrCom00032Popup
          isOpen={scrCom00032PopupIsOpen}
          data={scrCom0032PopupData}
          handleCancel={scrCom00032PopupHandleCancel}
          handleRegistConfirm={scrCom00032PopupHandleConfirm}
          handleApprovalConfirm={scrCom00032PopupHandleConfirm}
        />
      ) : (
        ''
      )}

      {/* 反映予定日整合性チェック */}
      {changeHistoryDateCheckIsOpen ? (
        <ChangeHistoryDateCheckUtil
          changeExpectedDate={getValues('changeExpectedDate')}
          changeHistoryNumber={getValues('changeHistoryNumber')}
          isChangeHistoryBtn={isChangeHistoryBtn}
          changeHistory={changeHistory}
          isOpen={changeHistoryDateCheckIsOpen}
          handleConfirm={ChangeHistoryDateCheckUtilHandleConfirm}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrMem0012Page;
