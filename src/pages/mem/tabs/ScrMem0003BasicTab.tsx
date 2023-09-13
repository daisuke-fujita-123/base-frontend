import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';

import ScrCom0032Popup, {
  columnList,
  errorList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

import { MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DatePicker } from 'controls/DatePicker';
import { WarningLabel } from 'controls/Label';
import { Radio } from 'controls/Radio';
import { AddbleSelect, Select, SelectValue } from 'controls/Select/Select';
import { Textarea } from 'controls/Textarea';
import { PostalTextField, TextField } from 'controls/TextField/TextField';
import { Typography } from 'controls/Typography';

import {
  ScrCom9999GetChangeDate,
  ScrCom9999getCodeManagementMasterMultiple,
  ScrCom9999GetCodeValue,
} from 'apis/com/ScrCom9999Api';
import {
  RegistGuarantor,
  ScrMem0003GetCorporationInfo,
  ScrMem0003GetCorporationInfoRequest,
  ScrMem0003GetCorporationInfoResponse,
  ScrMem0003GetNewCorporationId,
  ScrMem0003InputCheckCorporationInfo,
  ScrMem0003InputCheckCorporationInfoRequest,
  ScrMem0003RegistrationCorporationInfo,
  ScrMem0003RegistrationCorporationInfoRequest,
} from 'apis/mem/ScrMem0003Api';
import { ScrMem9999GetCorporationGroup } from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { comApiClient, memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import { ChangeHistoryDateCheckUtil } from 'utils/ChangeHistoryDateCheckUtil';
import yup from 'utils/validation/ValidationDefinition';

import { TabDisabledsModel } from '../ScrMem0003Page';

/*
 * 法人基本情報データモデル
 */
interface CorporationBasicModel {
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 法人名カナ
  corporationNameKana: string;
  // 法人グループ名
  corporationGroupName: string[];
  // Gold/Silver会員区分
  goldSilverMemberKind: string;
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
  // 法人FAX番号
  corporationFaxNumber: string;
  // 法人メールアドレス
  corporationMailAddress: string;
  // 適格事業者番号
  eligibleBusinessNumber: string;
  // 税事業者区分
  taxBusinessKind: string;
  // 公安委員会
  publicSafetyCommittee: string;
  // 古物商許可番号
  antiqueBusinessLicenseNumber: string;
  // 交付年月日
  issuanceDate: string;
  // 古物名義
  antiqueName: string;

  // 会員メモ
  memberMemo: string;

  // 代表者名
  representativeName: string;
  // 代表者名カナ
  representativeNameKana: string;
  // 性別
  representativeGender: string;
  // 生年月日
  representativeBirth: string;
  // 所有資産
  representativeAsset: string;
  // 郵便番号
  representativeZipCode: string;
  // 都道府県
  representativePrefectureCode: string;
  // 市区町村
  representativeMunicipalities: string;
  // 番地・号・建物名など
  representativeAddressBuildingName: string;
  // TEL
  representativePhoneNumber: string;
  // FAX
  representativeFaxNumber: string;
  // 携帯番号
  representativeMobilePhoneNumber: string;

  // 連帯保証人No⓵
  guarantorNo1: number;
  // 連帯保証人名⓵
  guarantorName1: string;
  // 連帯保証人名⓵
  guarantorNameKana1: string;
  // 連帯保証人性別⓵
  guarantorGender1: string;
  // 連帯保証人生年月日⓵
  guarantorBirth1: string;
  // 連帯保証人所有資産⓵
  guarantorAsset1: string;
  // 連帯保証人続柄⓵
  guarantorRelationship1: string;
  // 連帯保証人郵便番号⓵
  guarantorZipCode1: string;
  // 連帯保証人都道府県⓵
  guarantorPrefecture1: string;
  // 連帯保証人市区町村⓵
  guarantorMunicipalities1: string;
  // 連帯保証人番地号建物名⓵
  guarantorAddressBuildingName1: string;
  // 連帯保証人電話番号⓵
  guarantorPhoneNumber1: string;
  // 連帯保証人FAX番号⓵
  guarantorFaxNumber1: string;
  // 連帯保証人携帯番号⓵
  guarantorMobilePhoneNumber1: string;

  // 連帯保証人No⓶
  guarantorNo2: number;
  // 連帯保証人名⓶
  guarantorName2: string;
  // 連帯保証人名⓶
  guarantorNameKana2: string;
  // 連帯保証人性別⓶
  guarantorGender2: string;
  // 連帯保証人生年月日⓶
  guarantorBirth2: string;
  // 連帯保証人所有資産⓶
  guarantorAsset2: string;
  // 連帯保証人続柄⓶
  guarantorRelationship2: string;
  // 連帯保証人郵便番号⓶
  guarantorZipCode2: string;
  // 連帯保証人都道府県⓶
  guarantorPrefecture2: string;
  // 連帯保証人市区町村⓶
  guarantorMunicipalities2: string;
  // 連帯保証人番地号建物名⓶
  guarantorAddressBuildingName2: string;
  // 連帯保証人電話番号⓶
  guarantorPhoneNumber2: string;
  // 連帯保証人FAX番号⓶
  guarantorFaxNumber2: string;
  // 連帯保証人携帯番号⓶
  guarantorMobilePhoneNumber2: string;

  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectedDate: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  corporationGroupSelectValues: SelectValue[];
  goldSilverMemberKindSelectValues: SelectValue[];
  prefectureCodeSelectValues: SelectValue[];
  representativeAssetSelectValues: SelectValue[];
}

/**
 * 法人基本情報初期データ
 */
const initialValues: CorporationBasicModel = {
  corporationId: '',
  corporationName: '',
  corporationNameKana: '',
  corporationGroupName: [],
  goldSilverMemberKind: '',
  corporationZipCode: '',
  corporationPrefectureCode: '',
  corporationMunicipalities: '',
  corporationAddressBuildingName: '',
  corporationPhoneNumber: '',
  corporationFaxNumber: '',
  corporationMailAddress: '',
  eligibleBusinessNumber: '',
  taxBusinessKind: '',
  publicSafetyCommittee: '',
  antiqueBusinessLicenseNumber: '',
  issuanceDate: '',
  antiqueName: '',
  memberMemo: '',

  representativeName: '',
  representativeNameKana: '',
  representativeGender: '',
  representativeBirth: '',
  representativeAsset: '',
  representativeZipCode: '',
  representativePrefectureCode: '',
  representativeMunicipalities: '',
  representativeAddressBuildingName: '',
  representativePhoneNumber: '',
  representativeFaxNumber: '',
  representativeMobilePhoneNumber: '',

  guarantorNo1: 0,
  guarantorName1: '',
  guarantorNameKana1: '',
  guarantorGender1: '',
  guarantorBirth1: '',
  guarantorAsset1: '',
  guarantorRelationship1: '',
  guarantorZipCode1: '',
  guarantorPrefecture1: '',
  guarantorMunicipalities1: '',
  guarantorAddressBuildingName1: '',
  guarantorPhoneNumber1: '',
  guarantorFaxNumber1: '',
  guarantorMobilePhoneNumber1: '',
  guarantorNo2: 0,
  guarantorGender2: '',
  guarantorBirth2: '',
  guarantorAsset2: '',
  guarantorRelationship2: '',
  guarantorZipCode2: '',
  guarantorPrefecture2: '',
  guarantorMunicipalities2: '',
  guarantorAddressBuildingName2: '',
  guarantorPhoneNumber2: '',
  guarantorFaxNumber2: '',
  guarantorMobilePhoneNumber2: '',
  guarantorName2: '',
  guarantorNameKana2: '',
  changeHistoryNumber: '',
  changeExpectedDate: '',
};

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  corporationName: yup
    .string()
    .label('法人名')
    .max(30)
    .fullAndHalfWidth()
    .required(),
  corporationNameKana: yup
    .string()
    .label('法人名カナ')
    .max(40)
    .halfWidthOnly()
    .required(),
  corporationGroupName: yup.string().label('法人グループ名'),
  goldSilverMemberKind: yup.string().label('Gold/Silver会員'),
  corporationZipCode: yup
    .string()
    .label('郵便番号')
    .max(8)
    .halfWidthOnly()
    .required(),
  corporationPrefectureCode: yup.string().label('都道府県').required(),
  corporationMunicipalities: yup
    .string()
    .label('市区町村')
    .max(40)
    .fullAndHalfWidth()
    .required(),
  corporationAddressBuildingName: yup
    .string()
    .label('番地・号・建物名など')
    .max(40)
    .fullAndHalfWidth()
    .required(),
  corporationPhoneNumber: yup
    .string()
    .label('TEL')
    .max(13)
    .formatTel()
    .required(),
  corporationFaxNumber: yup.string().label('FAX').max(13).formatTel(),
  corporationMailAddress: yup.string().label('メールアドレス').max(254).email(),
  publicSafetyCommittee: yup
    .string()
    .label('公安委員会')
    .max(20)
    .fullAndHalfWidth()
    .required(),
  antiqueBusinessLicenseNumber: yup
    .string()
    .label('古物商許可番号')
    .max(30)
    .fullAndHalfWidth()
    .required(),
  issuanceDate: yup.string().label('交付年月日').formatYmd(),
  antiqueName: yup.string().label('古物名義').max(100).fullAndHalfWidth(),
  memberMemo: yup.string().label('会員メモ').max(1050).fullAndHalfWidth(),
  representativeName: yup
    .string()
    .label('代表者名')
    .max(30)
    .fullAndHalfWidth()
    .required(),
  representativeNameKana: yup
    .string()
    .label('代表者名カナ')
    .max(30)
    .halfWidthOnly()
    .required(),
  representativeGender: yup.string().label('性別'),
  representativeBirth: yup.string().label('生年月日').formatYmd(),
  representativeAsset: yup.string().label('所有資産'),
  representativeZipCode: yup.string().label('郵便番号').max(8).halfWidthOnly(),
  representativePrefectureCode: yup.string().label('都道府県'),
  representativeMunicipalities: yup
    .string()
    .label('市区町村')
    .max(40)
    .fullAndHalfWidth(),
  representativeAddressBuildingName: yup
    .string()
    .label('番地・号・建物名など')
    .max(10)
    .required(),
  representativePhoneNumber: yup.string().label('TEL').max(13).formatTel(),
  representativeFaxNumber: yup.string().label('FAX').max(13).formatTel(),
  representativeMobilePhoneNumber: yup
    .string()
    .label('携帯番号')
    .max(13)
    .formatTel(),
  guarantorName1: yup.string().label('連帯保証人名').max(30).fullAndHalfWidth(),
  guarantorNameKana1: yup
    .string()
    .label('連帯保証人名カナ')
    .max(30)
    .halfWidthOnly(),
  guarantorGender1: yup.string().label('性別'),
  guarantorBirth1: yup.string().label('生年月日').formatYmd(),
  guarantorAsset1: yup.string().label('所有資産'),
  guarantorRelationship1: yup
    .string()
    .label('代表者との続柄')
    .max(10)
    .fullAndHalfWidth(),
  guarantorZipCode1: yup.string().label('郵便番号').max(8).halfWidthOnly(),
  guarantorPrefecture1: yup.string().label('都道府県'),
  guarantorMunicipalities1: yup
    .string()
    .label('市区町村')
    .max(30)
    .fullAndHalfWidth(),
  guarantorAddressBuildingName1: yup
    .string()
    .label('番地・号・建物名など')
    .max(30)
    .fullAndHalfWidth(),
  guarantorPhoneNumber1: yup.string().label('TEL').max(13).formatTel(),
  guarantorFaxNumber1: yup.string().label('FAX').max(13).formatTel(),
  guarantorMobilePhoneNumber1: yup
    .string()
    .label('携帯番号')
    .max(13)
    .formatTel(),
  guarantorName2: yup.string().label('連帯保証人名').max(30).fullAndHalfWidth(),
  guarantorNameKana2: yup
    .string()
    .label('連帯保証人名カナ')
    .max(30)
    .halfWidthOnly(),
  guarantorGender2: yup.string().label('性別'),
  guarantorBirth2: yup.string().label('生年月日').formatYmd(),
  guarantorAsset2: yup.string().label('所有資産'),
  guarantorRelationship2: yup
    .string()
    .label('代表者との続柄')
    .max(10)
    .fullAndHalfWidth(),
  guarantorZipCode2: yup.string().label('郵便番号').max(8).halfWidthOnly(),
  guarantorPrefecture2: yup.string().label('都道府県'),
  guarantorMunicipalities2: yup
    .string()
    .label('市区町村')
    .max(30)
    .fullAndHalfWidth(),
  guarantorAddressBuildingName2: yup
    .string()
    .label('番地・号・建物名など')
    .max(30)
    .fullAndHalfWidth(),
  guarantorPhoneNumber2: yup.string().label('TEL').max(13).formatTel(),
  guarantorFaxNumber2: yup.string().label('FAX').max(13).formatTel(),
  guarantorMobilePhoneNumber2: yup
    .string()
    .label('携帯番号')
    .max(13)
    .formatTel(),
};

/**
 * 検索条件初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  corporationGroupSelectValues: [],
  goldSilverMemberKindSelectValues: [],
  prefectureCodeSelectValues: [],
  representativeAssetSelectValues: [],
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: null,
};

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '基本情報',
    fields: [
      'corporationId',
      'corporationName',
      'corporationNameKana',
      'corporationGroupName',
      'goldSilverMemberKind',
      'corporationZipCode',
      'corporationPrefectureCode',
      'corporationMunicipalities',
      'corporationAddressBuildingName',
      'corporationPhoneNumber',
      'corporationFaxNumber',
      'corporationMailAddress',
      'eligibleBusinessNumber',
      'taxBusinessKind',
      'publicSafetyCommittee',
      'antiqueBusinessLicenseNumber',
      'issuanceDate',
      'antiqueName',
    ],
    name: [
      '法人ID',
      '法人名',
      '法人名カナ',
      '法人グループ名',
      'Gold/Silver会員区分',
      '法人郵便番号',
      '法人都道府県コード',
      '法人市区町村',
      '法人番地号建物名',
      '法人電話番号',
      '法人FAX番号',
      '法人メールアドレス',
      '適格事業者番号',
      '税事業者区分',
      '公安委員会',
      '古物商許可番号',
      '交付年月日',
      '古物名義',
    ],
  },
  {
    section: '会員メモ情報',
    fields: ['memberMemo'],
    name: ['会員メモ'],
  },
  {
    section: '代表者情報',
    fields: [
      'representativeName',
      'representativeNameKana',
      'representativeGender',
      'representativeBirth',
      'representativeAsset',
      'representativeZipCode',
      'representativePrefectureCode',
      'representativeMunicipalities',
      'representativeAddressBuildingName',
      'representativePhoneNumber',
      'representativeFaxNumber',
      'representativeMobilePhoneNumber',
    ],
    name: [
      '代表者名',
      '代表者名カナ',
      '性別',
      '生年月日',
      '所有資産',
      '郵便番号',
      '都道府県',
      '市区町村',
      '番地・号・建物名など',
      'TEL',
      'FAX',
      '携帯番号',
    ],
  },
  {
    section: '連帯保証人⓵',
    fields: [
      'guarantorName1',
      'guarantorNameKana1',
      'guarantorGender1',
      'guarantorBirth1',
      'guarantorAsset1',
      'guarantorRelationship1',
      'guarantorZipCode1',
      'guarantorPrefecture1',
      'guarantorMunicipalities1',
      'guarantorAddressBuildingName1',
      'guarantorPhoneNumber1',
      'guarantorFaxNumber1',
      'guarantorMobilePhoneNumber1',
    ],
    name: [
      '連帯保証人名⓵',
      '連帯保証人名⓵',
      '連帯保証人性別⓵',
      '連帯保証人生年月日⓵',
      '連帯保証人所有資産⓵',
      '連帯保証人続柄⓵',
      '連帯保証人郵便番号⓵',
      '連帯保証人都道府県⓵',
      '連帯保証人市区町村⓵',
      '連帯保証人番地号建物名⓵',
      '連帯保証人電話番号⓵',
      '連帯保証人FAX番号⓵',
      '連帯保証人携帯番号⓵',
    ],
  },
  {
    section: '連帯保証人⓶',
    fields: [
      'guarantorName2',
      'guarantorNameKana2',
      'guarantorGender2',
      'guarantorBirth2',
      'guarantorAsset2',
      'guarantorRelationship2',
      'guarantorZipCode2',
      'guarantorPrefecture2',
      'guarantorMunicipalities2',
      'guarantorAddressBuildingName2',
      'guarantorPhoneNumber2',
      'guarantorFaxNumber2',
      'guarantorMobilePhoneNumber2',
    ],
    name: [
      '連帯保証人名⓶',
      '連帯保証人名⓶',
      '連帯保証人性別⓶',
      '連帯保証人生年月日⓶',
      '連帯保証人所有資産⓶',
      '連帯保証人続柄⓶',
      '連帯保証人郵便番号⓶',
      '連帯保証人都道府県⓶',
      '連帯保証人市区町村⓶',
      '連帯保証人番地号建物名⓶',
      '連帯保証人電話番号⓶',
      '連帯保証人FAX番号⓶',
      '連帯保証人携帯番号⓶',
    ],
  },
];

/**
 * 法人基本情報取得APIリクエストから法人基本情報データモデルへの変換
 */
const convertToCorporationBasicModel = (
  response: ScrMem0003GetCorporationInfoResponse
): CorporationBasicModel => {
  const guarantorMasters = response.guarantor;
  guarantorMasters.sort((a, b) => (a.guarantorNo > b.guarantorNo ? 1 : -1));

  return {
    corporationId: response.corporationId,
    corporationName: response.corporationName,
    corporationNameKana: response.corporationNameKana,
    corporationGroupName: response.CorporationGroup.map(
      (x) => x.corporationGroupId
    ),
    goldSilverMemberKind: response.goldSilverMemberKind,
    corporationZipCode: response.corporationZipCode,
    corporationPrefectureCode: response.corporationPrefectureCode,
    corporationMunicipalities: response.corporationMunicipalities,
    corporationAddressBuildingName: response.corporationAddressBuildingName,
    corporationPhoneNumber: response.corporationPhoneNumber,
    corporationFaxNumber: response.corporationFaxNumber,
    corporationMailAddress: response.corporationMailAddress,
    eligibleBusinessNumber: response.eligibleBusinessNumber,
    taxBusinessKind: response.taxBusinessKind,
    publicSafetyCommittee: response.publicSafetyCommittee,
    antiqueBusinessLicenseNumber: response.antiqueBusinessLicenseNumber,
    issuanceDate: response.issuanceDate,
    antiqueName: response.antiqueName,
    memberMemo: response.memberMemo,
    representativeName: response.representativeName,
    representativeNameKana: response.representativeNameKana,
    representativeGender: response.representativeGenderKind,
    representativeBirth: response.representativeBirthDate,
    representativeAsset: response.possessionAssetsKind,
    representativeZipCode: response.representativeZipCode,
    representativePrefectureCode: response.representativePrefectureCode,
    representativeMunicipalities: response.representativeMunicipalities,
    representativeAddressBuildingName:
      response.representativeAddressBuildingName,
    representativePhoneNumber: response.representativePhoneNumber,
    representativeFaxNumber: response.representativeFaxNumber,
    representativeMobilePhoneNumber: response.representativeMobilePhoneNumber,
    guarantorNo1: guarantorMasters[0].guarantorNo,
    guarantorName1: guarantorMasters[0].guarantorName,
    guarantorNameKana1: guarantorMasters[0].guarantorNameKana,
    guarantorGender1: guarantorMasters[0].guarantorGenderKind,
    guarantorBirth1: guarantorMasters[0].guarantorBirthDate,
    guarantorAsset1: guarantorMasters[0].guarantorPossessionAssetsKind,
    guarantorRelationship1: guarantorMasters[0].guarantorRelationship,
    guarantorZipCode1: guarantorMasters[0].guarantorZipCode,
    guarantorPrefecture1: guarantorMasters[0].guarantorPrefectureCode,
    guarantorMunicipalities1: guarantorMasters[0].guarantorMunicipalities,
    guarantorAddressBuildingName1:
      guarantorMasters[0].guarantorAddressBuildingName,
    guarantorPhoneNumber1: guarantorMasters[0].guarantorPhoneNumber,
    guarantorFaxNumber1: guarantorMasters[0].guarantorFaxNumber,
    guarantorMobilePhoneNumber1: guarantorMasters[0].guarantorMobilePhoneNumber,
    guarantorNo2: guarantorMasters[1].guarantorNo,
    guarantorGender2: guarantorMasters[1].guarantorGenderKind,
    guarantorBirth2: guarantorMasters[1].guarantorBirthDate,
    guarantorAsset2: guarantorMasters[1].guarantorPossessionAssetsKind,
    guarantorRelationship2: guarantorMasters[1].guarantorRelationship,
    guarantorZipCode2: guarantorMasters[1].guarantorZipCode,
    guarantorPrefecture2: guarantorMasters[1].guarantorPrefectureCode,
    guarantorMunicipalities2: guarantorMasters[1].guarantorMunicipalities,
    guarantorAddressBuildingName2:
      guarantorMasters[1].guarantorAddressBuildingName,
    guarantorPhoneNumber2: guarantorMasters[1].guarantorPhoneNumber,
    guarantorFaxNumber2: guarantorMasters[1].guarantorFaxNumber,
    guarantorMobilePhoneNumber2: guarantorMasters[1].guarantorMobilePhoneNumber,
    guarantorName2: guarantorMasters[1].guarantorName,
    guarantorNameKana2: guarantorMasters[1].guarantorNameKana,

    changeHistoryNumber: '',
    changeExpectedDate: '',
  };
};

/**
 * 法人基本情報取得APIリクエストから法人情報詳細モデルへの変換
 */
const convertToScrMem0003DataModel = (
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest,
  response: CorporationBasicModel
): ScrMem0003RegistrationCorporationInfoRequest => {
  const guarantorMasters: RegistGuarantor[] = [];
  if (response.guarantorNo1 !== null) {
    guarantorMasters.push({
      guarantorNo: 1,
      guarantorName: response.guarantorName1,
      guarantorNameKana: response.guarantorNameKana1,
      guarantorGenderKind: response.guarantorGender1,
      guarantorBirthDate: new Date(response.guarantorBirth1),
      guarantorPossessionAssetsKind: response.guarantorAsset1,
      guarantorRelationship: response.guarantorRelationship1,
      guarantorZipCode: response.guarantorZipCode1,
      guarantorPrefectureCode: response.guarantorPrefecture1,
      guarantorMunicipalities: response.guarantorMunicipalities1,
      guarantorAddressBuildingName: response.guarantorAddressBuildingName1,
      guarantorPhoneNumber: response.guarantorPhoneNumber1,
      guarantorFaxNumber: response.guarantorFaxNumber1,
      guarantorMobilePhoneNumber: response.guarantorMobilePhoneNumber1,
    });
  }
  if (response.guarantorNo2 !== null) {
    guarantorMasters.push({
      guarantorNo: 2,
      guarantorName: response.guarantorName2,
      guarantorNameKana: response.guarantorNameKana2,
      guarantorGenderKind: response.guarantorGender2,
      guarantorBirthDate: new Date(response.guarantorBirth2),
      guarantorPossessionAssetsKind: response.guarantorAsset2,
      guarantorRelationship: response.guarantorRelationship2,
      guarantorZipCode: response.guarantorZipCode2,
      guarantorPrefectureCode: response.guarantorPrefecture2,
      guarantorMunicipalities: response.guarantorMunicipalities2,
      guarantorAddressBuildingName: response.guarantorAddressBuildingName2,
      guarantorPhoneNumber: response.guarantorPhoneNumber2,
      guarantorFaxNumber: response.guarantorFaxNumber2,
      guarantorMobilePhoneNumber: response.guarantorMobilePhoneNumber2,
    });
  }

  const newScrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest =
    Object.assign(scrMem0003Data);
  newScrMem0003Data.corporationId = response.corporationId;
  newScrMem0003Data.corporationName = response.corporationName;
  newScrMem0003Data.corporationNameKana = response.corporationNameKana;
  newScrMem0003Data.corporationGroupId = response.corporationGroupName;
  newScrMem0003Data.goldSilverMemberKind = response.goldSilverMemberKind;
  newScrMem0003Data.corporationZipCode = response.corporationZipCode;
  newScrMem0003Data.corporationPrefectureCode =
    response.corporationPrefectureCode;
  newScrMem0003Data.corporationMunicipalities =
    response.corporationMunicipalities;
  newScrMem0003Data.corporationAddressBuildingName =
    response.corporationAddressBuildingName;
  newScrMem0003Data.corporationPhoneNumber = response.corporationPhoneNumber;
  newScrMem0003Data.corporationFaxNumber = response.corporationFaxNumber;
  newScrMem0003Data.corporationMailAddress = response.corporationMailAddress;
  newScrMem0003Data.eligibleBusinessNumber = response.eligibleBusinessNumber;
  newScrMem0003Data.taxBusinessKind = response.taxBusinessKind;
  newScrMem0003Data.publicSafetyCommittee = response.publicSafetyCommittee;
  newScrMem0003Data.antiqueBusinessLicenseNumber =
    response.antiqueBusinessLicenseNumber;
  newScrMem0003Data.issuanceDate = new Date(response.issuanceDate);
  newScrMem0003Data.antiqueName = response.antiqueName;
  newScrMem0003Data.memberMemo = response.memberMemo;
  newScrMem0003Data.representativeName = response.representativeName;
  newScrMem0003Data.representativeNameKana = response.representativeNameKana;
  newScrMem0003Data.representativeGenderKind = response.representativeGender;
  newScrMem0003Data.representativeBirthDate = new Date(
    response.representativeBirth
  );
  newScrMem0003Data.possessionAssetsKind = response.representativeAsset;
  newScrMem0003Data.representativeZipCode = response.representativeZipCode;
  newScrMem0003Data.representativePrefectureCode =
    response.representativePrefectureCode;
  newScrMem0003Data.representativeMunicipalities =
    response.representativeMunicipalities;
  newScrMem0003Data.representativeAddressBuildingName =
    response.representativeAddressBuildingName;
  newScrMem0003Data.representativePhoneNumber =
    response.representativePhoneNumber;
  newScrMem0003Data.representativeFaxNumber = response.representativeFaxNumber;
  newScrMem0003Data.representativeMobilePhoneNumber =
    response.representativeMobilePhoneNumber;
  newScrMem0003Data.guarantor = guarantorMasters;

  return scrMem0003Data;
};

const convertToCreditInfoModel = (
  response: ScrMem0003GetCorporationInfoResponse,
  changeHistoryNumber: string
): CorporationBasicModel => {
  const guarantorMasters = response.guarantor;
  guarantorMasters.sort((a, b) => (a.guarantorNo > b.guarantorNo ? 1 : -1));

  return {
    corporationId: response.corporationId,
    corporationName: response.corporationName,
    corporationNameKana: response.corporationNameKana,
    corporationGroupName: response.CorporationGroup.map(
      (x) => x.corporationGroupId
    ),
    goldSilverMemberKind: response.goldSilverMemberKind,
    corporationZipCode: response.corporationZipCode,
    corporationPrefectureCode: response.corporationPrefectureCode,
    corporationMunicipalities: response.corporationMunicipalities,
    corporationAddressBuildingName: response.corporationAddressBuildingName,
    corporationPhoneNumber: response.corporationPhoneNumber,
    corporationFaxNumber: response.corporationFaxNumber,
    corporationMailAddress: response.corporationMailAddress,
    eligibleBusinessNumber: response.eligibleBusinessNumber,
    taxBusinessKind: response.taxBusinessKind,
    publicSafetyCommittee: response.publicSafetyCommittee,
    antiqueBusinessLicenseNumber: response.antiqueBusinessLicenseNumber,
    issuanceDate: response.issuanceDate,
    antiqueName: response.antiqueName,
    memberMemo: response.memberMemo,
    representativeName: response.representativeName,
    representativeNameKana: response.representativeNameKana,
    representativeGender: response.representativeGenderKind,
    representativeBirth: response.representativeBirthDate,
    representativeAsset: response.possessionAssetsKind,
    representativeZipCode: response.representativeZipCode,
    representativePrefectureCode: response.representativePrefectureCode,
    representativeMunicipalities: response.representativeMunicipalities,
    representativeAddressBuildingName:
      response.representativeAddressBuildingName,
    representativePhoneNumber: response.representativePhoneNumber,
    representativeFaxNumber: response.representativeFaxNumber,
    representativeMobilePhoneNumber: response.representativeMobilePhoneNumber,
    guarantorNo1: guarantorMasters[0].guarantorNo,
    guarantorName1: guarantorMasters[0].guarantorName,
    guarantorNameKana1: guarantorMasters[0].guarantorNameKana,
    guarantorGender1: guarantorMasters[0].guarantorGenderKind,
    guarantorBirth1: guarantorMasters[0].guarantorBirthDate,
    guarantorAsset1: guarantorMasters[0].guarantorPossessionAssetsKind,
    guarantorRelationship1: guarantorMasters[0].guarantorRelationship,
    guarantorZipCode1: guarantorMasters[0].guarantorZipCode,
    guarantorPrefecture1: guarantorMasters[0].guarantorPrefectureCode,
    guarantorMunicipalities1: guarantorMasters[0].guarantorMunicipalities,
    guarantorAddressBuildingName1:
      guarantorMasters[0].guarantorAddressBuildingName,
    guarantorPhoneNumber1: guarantorMasters[0].guarantorPhoneNumber,
    guarantorFaxNumber1: guarantorMasters[0].guarantorFaxNumber,
    guarantorMobilePhoneNumber1: guarantorMasters[0].guarantorMobilePhoneNumber,
    guarantorNo2: guarantorMasters[1].guarantorNo,
    guarantorGender2: guarantorMasters[1].guarantorGenderKind,
    guarantorBirth2: guarantorMasters[1].guarantorBirthDate,
    guarantorAsset2: guarantorMasters[1].guarantorPossessionAssetsKind,
    guarantorRelationship2: guarantorMasters[1].guarantorRelationship,
    guarantorZipCode2: guarantorMasters[1].guarantorZipCode,
    guarantorPrefecture2: guarantorMasters[1].guarantorPrefectureCode,
    guarantorMunicipalities2: guarantorMasters[1].guarantorMunicipalities,
    guarantorAddressBuildingName2:
      guarantorMasters[1].guarantorAddressBuildingName,
    guarantorPhoneNumber2: guarantorMasters[1].guarantorPhoneNumber,
    guarantorFaxNumber2: guarantorMasters[1].guarantorFaxNumber,
    guarantorMobilePhoneNumber2: guarantorMasters[1].guarantorMobilePhoneNumber,
    guarantorName2: guarantorMasters[1].guarantorName,
    guarantorNameKana2: guarantorMasters[1].guarantorNameKana,

    changeHistoryNumber: changeHistoryNumber,
    changeExpectedDate: '',
  };
};

/**
 * 法人基本情報登録APIリクエストへの変換
 */
const convertFromCorporationInfoModel = (
  corporationBasic: CorporationBasicModel,
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest,
  user: string,
  registrationChangeMemo: string
): ScrMem0003RegistrationCorporationInfoRequest => {
  const guarantormaster1: RegistGuarantor = {
    guarantorNo: 1,
    guarantorName: corporationBasic.guarantorName1,
    guarantorNameKana: corporationBasic.guarantorNameKana1,
    guarantorGenderKind: corporationBasic.guarantorGender1,
    guarantorBirthDate: new Date(corporationBasic.guarantorBirth1),
    guarantorPossessionAssetsKind: corporationBasic.guarantorAsset1,
    guarantorRelationship: corporationBasic.guarantorRelationship1,
    guarantorZipCode: corporationBasic.guarantorZipCode1,
    guarantorPrefectureCode: corporationBasic.guarantorPrefecture1,
    guarantorMunicipalities: corporationBasic.guarantorMunicipalities1,
    guarantorAddressBuildingName:
      corporationBasic.guarantorAddressBuildingName1,
    guarantorPhoneNumber: corporationBasic.guarantorPhoneNumber1,
    guarantorFaxNumber: corporationBasic.guarantorFaxNumber1,
    guarantorMobilePhoneNumber: corporationBasic.guarantorMobilePhoneNumber1,
  };

  const guarantormaster2: RegistGuarantor = {
    guarantorNo: 2,
    guarantorName: corporationBasic.guarantorName2,
    guarantorNameKana: corporationBasic.guarantorNameKana2,
    guarantorGenderKind: corporationBasic.guarantorGender2,
    guarantorBirthDate: new Date(corporationBasic.guarantorBirth2),
    guarantorPossessionAssetsKind: corporationBasic.guarantorAsset2,
    guarantorRelationship: corporationBasic.guarantorRelationship2,
    guarantorZipCode: corporationBasic.guarantorZipCode2,
    guarantorPrefectureCode: corporationBasic.guarantorPrefecture2,
    guarantorMunicipalities: corporationBasic.guarantorMunicipalities2,
    guarantorAddressBuildingName:
      corporationBasic.guarantorAddressBuildingName2,
    guarantorPhoneNumber: corporationBasic.guarantorPhoneNumber2,
    guarantorFaxNumber: corporationBasic.guarantorFaxNumber2,
    guarantorMobilePhoneNumber: corporationBasic.guarantorMobilePhoneNumber2,
  };

  const newScrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest =
    Object.assign(scrMem0003Data);
  newScrMem0003Data.corporationId = corporationBasic.corporationId;
  newScrMem0003Data.corporationName = corporationBasic.corporationName;
  newScrMem0003Data.corporationNameKana = corporationBasic.corporationNameKana;
  newScrMem0003Data.corporationGroupId = corporationBasic.corporationGroupName;
  newScrMem0003Data.goldSilverMemberKind =
    corporationBasic.goldSilverMemberKind;
  newScrMem0003Data.corporationZipCode = corporationBasic.corporationZipCode;
  newScrMem0003Data.corporationPrefectureCode =
    corporationBasic.corporationPrefectureCode;
  newScrMem0003Data.corporationMunicipalities =
    corporationBasic.corporationMunicipalities;
  newScrMem0003Data.corporationAddressBuildingName =
    corporationBasic.corporationAddressBuildingName;
  newScrMem0003Data.corporationPhoneNumber =
    corporationBasic.corporationPhoneNumber;
  newScrMem0003Data.corporationFaxNumber =
    corporationBasic.corporationFaxNumber;
  newScrMem0003Data.corporationMailAddress =
    corporationBasic.corporationMailAddress;
  newScrMem0003Data.eligibleBusinessNumber =
    corporationBasic.eligibleBusinessNumber;
  newScrMem0003Data.taxBusinessKind = corporationBasic.taxBusinessKind;
  newScrMem0003Data.publicSafetyCommittee =
    corporationBasic.publicSafetyCommittee;
  newScrMem0003Data.antiqueBusinessLicenseNumber =
    corporationBasic.antiqueBusinessLicenseNumber;
  newScrMem0003Data.issuanceDate = new Date(corporationBasic.issuanceDate);
  newScrMem0003Data.antiqueName = corporationBasic.antiqueName;
  newScrMem0003Data.memberMemo = corporationBasic.memberMemo;
  newScrMem0003Data.representativeName = corporationBasic.representativeName;
  newScrMem0003Data.representativeNameKana =
    corporationBasic.representativeNameKana;
  newScrMem0003Data.representativeGenderKind =
    corporationBasic.representativeGender;
  newScrMem0003Data.representativeBirthDate = new Date(
    corporationBasic.representativeBirth
  );
  newScrMem0003Data.possessionAssetsKind = corporationBasic.representativeAsset;
  newScrMem0003Data.representativeZipCode =
    corporationBasic.representativeZipCode;
  newScrMem0003Data.representativePrefectureCode =
    corporationBasic.representativePrefectureCode;
  newScrMem0003Data.representativeMunicipalities =
    corporationBasic.representativeMunicipalities;
  newScrMem0003Data.representativeAddressBuildingName =
    corporationBasic.representativeAddressBuildingName;
  newScrMem0003Data.representativePhoneNumber =
    corporationBasic.representativePhoneNumber;
  newScrMem0003Data.representativeFaxNumber =
    corporationBasic.representativeFaxNumber;
  newScrMem0003Data.representativeMobilePhoneNumber =
    corporationBasic.representativeMobilePhoneNumber;
  newScrMem0003Data.corporationGroupId = corporationBasic.corporationGroupName;
  newScrMem0003Data.guarantor = [guarantormaster1, guarantormaster2];
  newScrMem0003Data.applicationEmployeeId = user;
  newScrMem0003Data.changeExpectDate =
    corporationBasic.changeExpectedDate !== ''
      ? corporationBasic.changeExpectedDate
      : new Date().toLocaleDateString();
  newScrMem0003Data.registrationChangeMemo = registrationChangeMemo;
  newScrMem0003Data.screenId = 'SCR-MEM-0003';
  newScrMem0003Data.tabId = 'B-3';

  return newScrMem0003Data;
};

/**
 * 変更した項目から登録・変更内容データへの変換
 */
const convertToSectionList = (dirtyFields: object): sectionList[] => {
  const fields = Object.keys(dirtyFields);
  const sectionList: sectionList[] = [];
  const columnList: columnList[] = [];
  sectionDef.forEach((d) => {
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
 * 法人情報詳細画面 基本情報タブ
 * @returns
 */
const ScrMem0003BasicTab = (props: {
  chengeTabDisableds: (tabDisableds: TabDisabledsModel) => void;
  chengeScrMem0003Data: (
    scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest
  ) => void;
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest;
}) => {
  // router
  const { corporationId } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [changeHistory, setChangeHistory] = useState<SelectValue[]>([]);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [openGuarantorSection1, setOpenGuarantorSection1] =
    useState<boolean>(true);
  const [openGuarantorSection2, setOpenGuarantorSection2] =
    useState<boolean>(true);
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckisOpen, setChangeHistoryDateCheckisOpen] =
    useState<boolean>(false);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0003') === -1
  );
  // form
  const methods = useForm<CorporationBasicModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields, errors },
    setValue,
    getValues,
    reset,
  } = methods;

  // 初期表示処理
  useEffect(() => {
    const historyInitialize = async (
      corporationId: string,
      applicationId: string
    ) => {
      // リスト取得
      // コード管理マスタ情報取得API（複数取得）
      const getCodeManagementMasterMultipleRequest = {
        codeId: ['CDE-COM-0017', 'CDE-COM-0021'],
      };
      const codeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      const goldSilverMemberKindSelectValues: SelectValue[] = [];
      const representativeAssetSelectValues: SelectValue[] = [];
      codeManagementMasterMultipleResponse.resultList.map((x) => {
        // Gold/Silver会員
        if (x.codeId === 'CDE-COM-0017') {
          x.codeValueList.map((c) => {
            goldSilverMemberKindSelectValues.push({
              value: c.codeValue,
              displayValue: c.codeName,
            });
          });
        }
        // 所有資産
        if (x.codeId === 'CDE-COM-0021') {
          x.codeValueList.map((c) => {
            representativeAssetSelectValues.push({
              value: c.codeValue,
              displayValue: c.codeName,
            });
          });
        }
      });

      // 共通管理コード値取得API（コード管理マスタ以外）
      const getCodeManagementMasterRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const codeManagementMasterResponse = await ScrCom9999GetCodeValue(
        getCodeManagementMasterRequest
      );
      const prefectureCodeSelectValues =
        codeManagementMasterResponse.resultList[0].codeValueList.map((x) => {
          return {
            value: x.codeValue,
            displayValue: x.codeValueName,
          };
        });

      // 法人グループ取得API
      const corporationGroupResponse = await ScrMem9999GetCorporationGroup();
      const corporationGroupSelectValues =
        corporationGroupResponse.corporationGroupList.map((x) => {
          return {
            value: x.corporationGroupId,
            displayValue: x.corporationGroupId + '　' + x.corporationGroupName,
          };
        });

      setSelectValues({
        goldSilverMemberKindSelectValues: goldSilverMemberKindSelectValues,
        representativeAssetSelectValues: representativeAssetSelectValues,
        prefectureCodeSelectValues: prefectureCodeSelectValues,
        corporationGroupSelectValues: corporationGroupSelectValues,
      });

      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response = (
        await memApiClient.post(
          '/api/mem/scr-mem-9999/get-history-info',
          request
        )
      ).data;
      const corporationBasic = convertToCreditInfoModel(
        response,
        applicationId
      );

      // 画面にデータを設定
      reset(corporationBasic);

      // 取得データ保持
      const scrMem0003Data = convertToScrMem0003DataModel(
        props.scrMem0003Data,
        corporationBasic
      );
      props.chengeScrMem0003Data(scrMem0003Data);

      // 拠点情報タブ、取引履歴タブ、変更履歴タブは非活性にする
      props.chengeTabDisableds({
        ScrMem0003BasicTab: false,
        ScrMem0003CreditTab: false,
        ScrMem0003CreditLimitTab: false,
        ScrMem0003ContractTab: false,
        ScrMem0003BaseTab: true,
        ScrMem0003DealHistoryTab: true,
        ScrMem0003BranchNumberTab: true,
        ScrMem0003ChangeHistoryTab: true,
      });
    };

    const initialize = async (corporationId: string) => {
      // リスト取得
      // コード管理マスタ情報取得API（複数取得）
      const getCodeManagementMasterMultipleRequest = {
        codeId: ['CDE-COM-0017', 'CDE-COM-0021'],
      };
      const codeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      const goldSilverMemberKindSelectValues: SelectValue[] = [];
      const representativeAssetSelectValues: SelectValue[] = [];
      codeManagementMasterMultipleResponse.resultList.map((x) => {
        // Gold/Silver会員
        if (x.codeId === 'CDE-COM-0017') {
          x.codeValueList.map((c) => {
            goldSilverMemberKindSelectValues.push({
              value: c.codeValue,
              displayValue: c.codeName,
            });
          });
        }
        // 所有資産
        if (x.codeId === 'CDE-COM-0021') {
          x.codeValueList.map((c) => {
            representativeAssetSelectValues.push({
              value: c.codeValue,
              displayValue: c.codeName,
            });
          });
        }
      });

      // 共通管理コード値取得API（コード管理マスタ以外）
      const getCodeManagementMasterRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const codeManagementMasterResponse = await ScrCom9999GetCodeValue(
        getCodeManagementMasterRequest
      );
      const prefectureCodeSelectValues =
        codeManagementMasterResponse.resultList[0].codeValueList.map((x) => {
          return {
            value: x.codeValue,
            displayValue: x.codeValueName,
          };
        });

      // 法人グループ取得API
      const corporationGroupResponse = await ScrMem9999GetCorporationGroup();
      const corporationGroupSelectValues =
        corporationGroupResponse.corporationGroupList.map((x) => {
          return {
            value: x.corporationGroupId,
            displayValue: x.corporationGroupId + '　' + x.corporationGroupName,
          };
        });

      setSelectValues({
        goldSilverMemberKindSelectValues: goldSilverMemberKindSelectValues,
        representativeAssetSelectValues: representativeAssetSelectValues,
        prefectureCodeSelectValues: prefectureCodeSelectValues,
        corporationGroupSelectValues: corporationGroupSelectValues,
      });

      // 法人基本情報申請API
      const request: ScrMem0003GetCorporationInfoRequest = {
        corporationId: corporationId,
        limitCount: 15000,
      };
      const response = await ScrMem0003GetCorporationInfo(request);
      const corporationBasic = convertToCorporationBasicModel(response);

      // 画面にデータを設定
      reset(corporationBasic);

      // 取得データ保持
      const scrMem0003Data = convertToScrMem0003DataModel(
        props.scrMem0003Data,
        corporationBasic
      );
      props.chengeScrMem0003Data(scrMem0003Data);

      // 連帯保証人①セクション内の全ての入力項目が未設定の場合、連帯保証人①セクションを折り畳み表示する
      if (
        (corporationBasic.guarantorName1 === null ||
          corporationBasic.guarantorName1 === '') &&
        (corporationBasic.guarantorNameKana1 === null ||
          corporationBasic.guarantorNameKana1 === '') &&
        (corporationBasic.guarantorGender1 === null ||
          corporationBasic.guarantorGender1 === '') &&
        (corporationBasic.guarantorBirth1 === null ||
          corporationBasic.guarantorBirth1 === '') &&
        (corporationBasic.guarantorAsset1 === null ||
          corporationBasic.guarantorAsset1 === '') &&
        (corporationBasic.guarantorRelationship1 === null ||
          corporationBasic.guarantorRelationship1 === '') &&
        (corporationBasic.guarantorZipCode1 === null ||
          corporationBasic.guarantorZipCode1 === '') &&
        (corporationBasic.guarantorPrefecture1 === null ||
          corporationBasic.guarantorPrefecture1 === '') &&
        (corporationBasic.guarantorMunicipalities1 === null ||
          corporationBasic.guarantorMunicipalities1 === '') &&
        (corporationBasic.guarantorAddressBuildingName1 === null ||
          corporationBasic.guarantorAddressBuildingName1 === '') &&
        (corporationBasic.guarantorPhoneNumber1 === null ||
          corporationBasic.guarantorPhoneNumber1 === '') &&
        (corporationBasic.guarantorFaxNumber1 === null ||
          corporationBasic.guarantorFaxNumber1 === '') &&
        (corporationBasic.guarantorMobilePhoneNumber1 === null ||
          corporationBasic.guarantorMobilePhoneNumber1 === '')
      ) {
        setOpenGuarantorSection1(false);
      }

      // 連帯保証人⓶セクション内の全ての入力項目が未設定の場合、連帯保証人⓶セクションを折り畳み表示する
      if (
        (corporationBasic.guarantorName2 === null ||
          corporationBasic.guarantorName2 === '') &&
        (corporationBasic.guarantorNameKana2 === null ||
          corporationBasic.guarantorNameKana2 === '') &&
        (corporationBasic.guarantorGender2 === null ||
          corporationBasic.guarantorGender2 === '') &&
        (corporationBasic.guarantorBirth2 === null ||
          corporationBasic.guarantorBirth2 === '') &&
        (corporationBasic.guarantorAsset2 === null ||
          corporationBasic.guarantorAsset2 === '') &&
        (corporationBasic.guarantorRelationship2 === null ||
          corporationBasic.guarantorRelationship2 === '') &&
        (corporationBasic.guarantorZipCode2 === null ||
          corporationBasic.guarantorZipCode2 === '') &&
        (corporationBasic.guarantorPrefecture2 === null ||
          corporationBasic.guarantorPrefecture2 === '') &&
        (corporationBasic.guarantorMunicipalities2 === null ||
          corporationBasic.guarantorMunicipalities2 === '') &&
        (corporationBasic.guarantorAddressBuildingName2 === null ||
          corporationBasic.guarantorAddressBuildingName2 === '') &&
        (corporationBasic.guarantorPhoneNumber2 === null ||
          corporationBasic.guarantorPhoneNumber2 === '') &&
        (corporationBasic.guarantorFaxNumber2 === null ||
          corporationBasic.guarantorFaxNumber2 === '') &&
        (corporationBasic.guarantorMobilePhoneNumber2 === null ||
          corporationBasic.guarantorMobilePhoneNumber2 === '')
      ) {
        setOpenGuarantorSection2(false);
      }

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0003',
        tabId: 3,
        masterId: corporationId,
        businessDate: user.taskDate,
      };
      const getChangeDate = await ScrCom9999GetChangeDate(getChangeDateRequest);

      const chabngeHistory = getChangeDate.changeExpectDateInfo.map((e) => {
        return {
          value: e.changeHistoryNumber,
          displayValue: new Date(e.changeExpectDate).toLocaleDateString(),
        };
      });
      setChangeHistory(chabngeHistory);
    };

    const getNewCorporationId = async () => {
      // 連帯保証人セクションを折り畳み表示する
      setOpenGuarantorSection1(false);
      setOpenGuarantorSection2(false);

      // 基本情報タブ以外は非活性にする
      props.chengeTabDisableds({
        ScrMem0003BasicTab: false,
        ScrMem0003CreditTab: true,
        ScrMem0003CreditLimitTab: true,
        ScrMem0003ContractTab: true,
        ScrMem0003BaseTab: true,
        ScrMem0003DealHistoryTab: true,
        ScrMem0003BranchNumberTab: true,
        ScrMem0003ChangeHistoryTab: true,
      });
      const newCorporationIdResponse = await ScrMem0003GetNewCorporationId();
      setValue('corporationId', newCorporationIdResponse.corporationId);
    };

    if (corporationId === undefined || corporationId === 'new') {
      getNewCorporationId();
      return;
    }

    if (corporationId !== undefined && applicationId !== null) {
      historyInitialize(corporationId, applicationId);

      return;
    }

    if (corporationId !== undefined) {
      initialize(corporationId);
      return;
    }
  }, [corporationId, applicationId, reset]);

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    if (!corporationId) return;

    // 変更履歴情報取得API
    const request = {
      changeHistoryNumber: getValues('changeHistoryNumber'),
    };
    const response = (await memApiClient.post('/get-history-info', request))
      .data;
    const corporationBasic = convertToCreditInfoModel(
      response,
      getValues('changeHistoryNumber')
    );

    setIsChangeHistoryBtn(true);
    // 画面にデータを設定
    reset(corporationBasic);

    // 基本情報タブ以外は非活性にする
    props.chengeTabDisableds({
      ScrMem0003BasicTab: false,
      ScrMem0003CreditTab: true,
      ScrMem0003CreditLimitTab: true,
      ScrMem0003ContractTab: true,
      ScrMem0003BaseTab: true,
      ScrMem0003DealHistoryTab: true,
      ScrMem0003BranchNumberTab: true,
      ScrMem0003ChangeHistoryTab: true,
    });
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const onClickConfirm = () => {
    if (Object.keys(errors).length) return;
    // 反映予定日整合性チェック
    setChangeHistoryDateCheckisOpen(true);
  };

  /**
   * 確定ボタンクリック時（反映予定日整合性チェック後）のイベントハンドラ
   */
  const handleConfirm = async (checkFlg: boolean) => {
    setChangeHistoryDateCheckisOpen(false);
    if (!checkFlg) return;

    // 法人基本情報入力チェックAPI
    const scrMem0003InputCheckCorporationInfoRequest: ScrMem0003InputCheckCorporationInfoRequest =
      {
        corporationId: getValues('corporationId'),
        zipCode: getValues('corporationZipCode'),
        prefectureCode: getValues('corporationPrefectureCode'),
        municipalities: getValues('corporationMunicipalities'),
        addressBuildingName: getValues('corporationAddressBuildingName'),
        phoneNumber: getValues('corporationPhoneNumber'),
        faxNumber: getValues('corporationFaxNumber'),
        mailAddress: getValues('corporationMailAddress'),
        publicSafetyCommittee: getValues('publicSafetyCommittee'),
        antiqueBusinessLicenseNumber: getValues('antiqueBusinessLicenseNumber'),
      };
    const scrMem0010GetMemberResponse =
      await ScrMem0003InputCheckCorporationInfo(
        scrMem0003InputCheckCorporationInfoRequest
      );

    const errorList: errorList[] = [];
    scrMem0010GetMemberResponse.errorList.map((x) => {
      errorList.push({
        errorCode: x.errorCode,
        errorMessage: x.errorMessage,
      });
    });
    if (
      getValues('corporationFaxNumber') !== '' &&
      getValues('corporationMailAddress') !== ''
    ) {
      errorList.push({
        errorCode: 'MSG-FR-ERR-00058',
        errorMessage: 'FAX、または、アドレスを入力してください',
      });
    }

    setScrCom0032PopupData({
      errorList: errorList,
      warningList: scrMem0010GetMemberResponse.warnList.map((x) => {
        return {
          warningCode: x.errorCode,
          warningMessage: x.errorMessage,
        };
      }),
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0003',
          screenName: '法人情報詳細',
          tabId: 3,
          tabName: '基本情報',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      changeExpectDate: user.taskDate,
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate(-1);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setIsOpenPopup(false);
    setIsChangeHistoryBtn(false);

    // 法人基本情報登録API
    const request = convertFromCorporationInfoModel(
      getValues(),
      props.scrMem0003Data,
      user.employeeId,
      registrationChangeMemo
    );
    await ScrMem0003RegistrationCorporationInfo(request);

    // 取得データ保持
    props.chengeScrMem0003Data(request);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 住所自動入力
   */
  const onBlur = async (name: string, item: string) => {
    const request = { zipCode: item };
    const codeValues = (
      await comApiClient.post('/com/scr/get-address-info', request)
    ).data;

    switch (name) {
      case 'corporationZipCode':
        setValue('corporationPrefectureCode', codeValues.prefectureCode);
        setValue('corporationMunicipalities', codeValues.municipalities);
        setValue('corporationAddressBuildingName', codeValues.townOrStreetName);
        break;
      case 'representativeZipCode':
        setValue('representativePrefectureCode', codeValues.prefectureCode);
        setValue('representativeMunicipalities', codeValues.municipalities);
        setValue(
          'representativeAddressBuildingName',
          codeValues.townOrStreetName
        );
        break;
      case 'guarantorZipCode1':
        setValue('guarantorPrefecture1', codeValues.prefectureCode);
        setValue('guarantorMunicipalities1', codeValues.municipalities);
        setValue('guarantorAddressBuildingName1', codeValues.townOrStreetName);
        break;
      case 'guarantorZipCode2':
        setValue('guarantorPrefecture2', codeValues.prefectureCode);
        setValue('guarantorMunicipalities2', codeValues.municipalities);
        setValue('guarantorAddressBuildingName2', codeValues.townOrStreetName);
        break;
    }
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 基本情報セクション */}
            <Section name='基本情報'>
              <RowStack>
                <ColStack>
                  <TextField label='法人ID' name='corporationId' readonly />
                  <TextField
                    label='法人名'
                    name='corporationName'
                    required
                    size='m'
                  />
                  <TextField
                    label='法人名カナ'
                    name='corporationNameKana'
                    required
                    size='m'
                  />
                  <AddbleSelect
                    label='法人グループ名'
                    name='corporationGroupName'
                    selectValues={selectValues.corporationGroupSelectValues}
                    blankOption
                    size='m'
                  />
                  <Select
                    label='Gold/Silver会員'
                    name='goldSilverMemberKind'
                    selectValues={selectValues.goldSilverMemberKindSelectValues}
                    blankOption
                  />
                </ColStack>
                <ColStack>
                  <PostalTextField
                    label='郵便番号'
                    name='corporationZipCode'
                    required
                    onBlur={() =>
                      onBlur(
                        'corporationZipCode',
                        getValues('corporationZipCode')
                      )
                    }
                  />
                  <Select
                    label='都道府県'
                    name='corporationPrefectureCode'
                    selectValues={selectValues.prefectureCodeSelectValues}
                    blankOption
                    required
                  />
                  <TextField
                    label='市区町村'
                    name='corporationMunicipalities'
                    required
                  />
                  <TextField
                    label='番地・号・建物名など'
                    name='corporationAddressBuildingName'
                    required
                    size='m'
                  />
                  <TextField
                    label='TEL'
                    name='corporationPhoneNumber'
                    required
                  />
                  <TextField label='FAX' name='corporationFaxNumber' />
                  <TextField
                    label='メールアドレス'
                    name='corporationMailAddress'
                    size='m'
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='適格事業者番号'
                    name='eligibleBusinessNumber'
                    readonly
                  />
                  <TextField
                    label='税事業者区分'
                    name='taxBusinessKind'
                    readonly
                  />
                  <TextField
                    label='公安委員会'
                    name='publicSafetyCommittee'
                    required
                  />
                  <TextField
                    label='古物商許可番号'
                    name='antiqueBusinessLicenseNumber'
                    required
                  />
                  <DatePicker
                    label='交付年月日'
                    name='issuanceDate'
                    withWareki
                  />
                  <TextField label='古物名義' name='antiqueName' />
                </ColStack>
              </RowStack>
            </Section>
            {/* 会員メモ情報セクション */}
            <Section name='会員メモ情報'>
              <Textarea name='memberMemo' maxRows={15} size='l'></Textarea>
            </Section>
            {/* 代表者セクション */}
            <Section name='代表者情報'>
              <RowStack>
                <ColStack>
                  <TextField
                    label='代表者名'
                    name='representativeName'
                    required
                  />
                  <TextField
                    label='代表者名カナ'
                    name='representativeNameKana'
                    required
                  />
                </ColStack>
                <ColStack>
                  <Radio
                    label='性別'
                    name='representativeGender'
                    radioValues={[
                      { value: '1', displayValue: '男' },
                      { value: '2', displayValue: '女' },
                    ]}
                  />
                  <DatePicker
                    label='生年月日'
                    name='representativeBirth'
                    withWareki
                  />
                  <Select
                    label='所有資産'
                    name='representativeAsset'
                    selectValues={selectValues.representativeAssetSelectValues}
                    blankOption
                  />
                </ColStack>
                <ColStack>
                  <PostalTextField
                    label='郵便番号'
                    name='representativeZipCode'
                    onBlur={() =>
                      onBlur(
                        'representativeZipCode',
                        getValues('representativeZipCode')
                      )
                    }
                  />
                  <Select
                    label='都道府県'
                    name='representativePrefectureCode'
                    selectValues={selectValues.prefectureCodeSelectValues}
                    blankOption
                  />
                  <TextField
                    label='市区町村'
                    name='representativeMunicipalities'
                  />
                  <TextField
                    label='番地・号・建物名など'
                    name='representativeAddressBuildingName'
                    size='m'
                  />
                </ColStack>
                <ColStack>
                  <TextField label='TEL' name='representativePhoneNumber' />
                  <TextField label='FAX' name='representativeFaxNumber' />
                  <TextField
                    label='携帯番号'
                    name='representativeMobilePhoneNumber'
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 連帯保証人①セクション */}
            <Section name='連帯保証人①' openable={openGuarantorSection1}>
              <RowStack>
                <ColStack>
                  <TextField label='連帯保証人名' name='guarantorName1' />
                  <TextField
                    label='連帯保証人名カナ'
                    name='guarantorNameKana1'
                  />
                </ColStack>
                <ColStack>
                  <Radio
                    label='性別'
                    name='guarantorGender1'
                    radioValues={[
                      { value: '1', displayValue: '男' },
                      { value: '2', displayValue: '女' },
                    ]}
                  />
                  <DatePicker
                    label='生年月日'
                    name='guarantorBirth1'
                    withWareki
                  />
                  <Select
                    label='所有資産'
                    name='guarantorAsset1'
                    selectValues={selectValues.representativeAssetSelectValues}
                    blankOption
                  />
                  <TextField
                    label='代表者との続柄'
                    name='guarantorRelationship1'
                  />
                </ColStack>
                <ColStack>
                  <PostalTextField
                    label='郵便番号'
                    name='guarantorZipCode1'
                    onBlur={() =>
                      onBlur(
                        'guarantorZipCode1',
                        getValues('guarantorZipCode1')
                      )
                    }
                  />
                  <Select
                    label='都道府県'
                    name='guarantorPrefecture1'
                    selectValues={selectValues.prefectureCodeSelectValues}
                    blankOption
                  />
                  <TextField label='市区町村' name='guarantorMunicipalities1' />
                  <TextField
                    label='番地・号・建物名など'
                    name='guarantorAddressBuildingName1'
                    size='m'
                  />
                </ColStack>
                <ColStack>
                  <TextField label='TEL' name='guarantorPhoneNumber1' />
                  <TextField label='FAX' name='guarantorFaxNumber1' />
                  <TextField
                    label='携帯番号'
                    name='guarantorMobilePhoneNumber1'
                  />
                </ColStack>
              </RowStack>
            </Section>

            {/* 連帯保証人②セクション */}
            <Section name='連帯保証人②' openable={openGuarantorSection2}>
              <RowStack>
                <ColStack>
                  <TextField label='連帯保証人名' name='guarantorName2' />
                  <TextField
                    label='連帯保証人名カナ'
                    name='guarantorNameKana2'
                  />
                </ColStack>
                <ColStack>
                  <Radio
                    label='性別'
                    name='guarantorGender2'
                    radioValues={[
                      { value: '1', displayValue: '男' },
                      { value: '2', displayValue: '女' },
                    ]}
                  />
                  <DatePicker
                    label='生年月日'
                    name='guarantorBirth2'
                    withWareki
                  />
                  <Select
                    label='所有資産'
                    name='guarantorAsset2'
                    selectValues={selectValues.representativeAssetSelectValues}
                    blankOption
                  />
                  <TextField
                    label='代表者との続柄'
                    name='guarantorRelationship2'
                  />
                </ColStack>
                <ColStack>
                  <PostalTextField
                    label='郵便番号'
                    name='guarantorZipCode2'
                    onBlur={() =>
                      onBlur(
                        'guarantorZipCode2',
                        getValues('guarantorZipCode2')
                      )
                    }
                  />
                  <Select
                    label='都道府県'
                    name='guarantorPrefecture2'
                    selectValues={selectValues.prefectureCodeSelectValues}
                    blankOption
                  />
                  <TextField label='市区町村' name='guarantorMunicipalities2' />
                  <TextField
                    label='番地・号・建物名など'
                    name='guarantorAddressBuildingName2'
                    size='m'
                  />
                </ColStack>
                <ColStack>
                  <TextField label='TEL' name='guarantorPhoneNumber2' />
                  <TextField label='FAX' name='guarantorFaxNumber2' />
                  <TextField
                    label='携帯番号'
                    name='guarantorMobilePhoneNumber2'
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
                  {changeHistory.length <= 0 ? (
                    <></>
                  ) : (
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
                  )}
                  <MarginBox mb={6}>
                    <DatePicker
                      label='変更予定日'
                      name='changeExpectedDate'
                      disabled={isReadOnly[0]}
                    />
                  </MarginBox>
                </RightElementStack>
              </Grid>
            </Grid>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton disable={isReadOnly[0]} onClick={onClickConfirm}>
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {isOpenPopup ? (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          handleRegistConfirm={handlePopupConfirm}
          handleApprovalConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      ) : (
        ''
      )}

      {/* 反映予定日整合性チェック */}
      {changeHistoryDateCheckisOpen ? (
        <ChangeHistoryDateCheckUtil
          changeExpectedDate={getValues('changeExpectedDate')}
          changeHistoryNumber={getValues('changeHistoryNumber')}
          isChangeHistoryBtn={isChangeHistoryBtn}
          changeHistory={changeHistory}
          isOpen={changeHistoryDateCheckisOpen}
          handleConfirm={handleConfirm}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrMem0003BasicTab;

