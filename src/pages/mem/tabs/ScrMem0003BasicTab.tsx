import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';

import ScrCom0032Popup, {
  ColumnListModel,
  errorMessagesModel,
  ScrCom0032PopupModel,
  SectionListModel,
} from 'pages/com/popups/ScrCom0032';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import { Button, CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DatePicker } from 'controls/DatePicker';
import { WarningLabel } from 'controls/Label';
import { Radio } from 'controls/Radio';
import { AddbleSelect, Select, SelectValue } from 'controls/Select/Select';
import { TableRowModel } from 'controls/Table';
import { Textarea } from 'controls/Textarea';
import { PostalTextField, TextField } from 'controls/TextField/TextField';
import { Typography } from 'controls/Typography';

import {
  CorporationGroupMasters,
  errorResult,
  GuarantorMasters,
  ScrMem0003ApplyForChangeCorporation,
  ScrMem0003ApplyForChangeCorporationRequest,
  ScrMem0003GetCorporation,
  ScrMem0003GetCorporationRequest,
  ScrMem0003GetCorporationResponse,
  ScrMem0003InputCheckCorporationInfo,
  ScrMem0003InputCheckCorporationInfoRequest,
} from 'apis/mem/ScrMem0003Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { comApiClient, memApiClient } from 'providers/ApiClient';

import yup from 'utils/validation/ValidationDefinition';
import { TabDisabledsModel } from '../ScrMem0003Page';
import { Grid } from 'layouts/Grid';
import { AppContext } from 'providers/AppContextProvider';
import { Dialog } from 'controls/Dialog';
import { Modal } from 'layouts/Modal';
import { Popup } from 'layouts/Popup';
import { default as DialogMui } from '@mui/material/Dialog';
import { Box, DialogActions, DialogTitle } from '@mui/material';
import { theme } from 'controls/theme';
import { StackModalSection } from 'layouts/StackModalSection';

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
  // 変更履歴番号+変更予定日
  memberChangeHistories: any[];
  // 変更予定日
  changeExpectedDate: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  corporationGroupselectValues: SelectValue[];
  goldSilverMemberKindselectValues: SelectValue[];
  prefectureCodeselectValues: SelectValue[];
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
  memberChangeHistories: [],
};

/**
 * 法人基本情報スキーマ
 */
const corporationBasicSchama = {
  corporationName: yup.string().label('法人名').max(10).required(),
  corporationNameKana: yup.string().label('法人名カナ').max(10).required(),
};

/**
 * 検索条件初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  corporationGroupselectValues: [],
  goldSilverMemberKindselectValues: [],
  prefectureCodeselectValues: [],
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorMessages: [{
    errorCode: '',
    errorMessage: ''
  }],
  warningMessages: [{
    errorCode: '',
    errorMessage: '',
  }],
  contentsList: {
    screenName:  '',
    screenId:  '',
    tabName:  '',
    tabId:  '',
    sectionList: [
      {
        sectionName:  '',
        columnList: [
          {
            columnName: '',
          }
        ]
      }
    ]
  },
  changeExpectDate: new Date()
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
      '古物名義'
    ]
  },
  {
    section: '会員メモ情報',
    fields: ['memberMemo'],
    name: ['会員メモ']
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
    ]
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
    ]
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
    ]
  },
];

/**
 * 法人基本情報取得APIリクエストから法人基本情報データモデルへの変換
 */
const convertToCorporationBasicModel = (
  response: ScrMem0003GetCorporationResponse
): CorporationBasicModel => {
  const guarantorMasters = response.guarantorMasters;
  guarantorMasters.sort((a, b) => (a.guarantorNo > b.guarantorNo ? 1 : -1));

  return {
    corporationId: response.corporationId,
    corporationName: response.corporationName,
    corporationNameKana: response.corporationNameKana,
    corporationGroupName: response.corporationGroupMasters.map(
      (x) => x.corporationGroupName
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
    representativeAddressBuildingName: response.representativeAddressBuildingName,
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
    memberChangeHistories: [],
    changeExpectedDate: '',
  };
};

const convertToCreditInfoModel = (
  response:ScrMem0003GetCorporationResponse,
  corporationId: string,
  changeHistoryNumber: string
):CorporationBasicModel => {
  const guarantorMasters = response.guarantorMasters;
  guarantorMasters.sort((a, b) => (a.guarantorNo > b.guarantorNo ? 1 : -1));

  return {
    corporationId: response.corporationId,
    corporationName: response.corporationName,
    corporationNameKana: response.corporationNameKana,
    corporationGroupName: response.corporationGroupMasters.map(
      (x) => x.corporationGroupName
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
    representativeAddressBuildingName: response.representativeAddressBuildingName,
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
    memberChangeHistories: [],
    changeExpectedDate: '',
  }
}

/**
 * 検索条件モデルから法人情報検索APIリクエストへの変換
 */
const convertFromCorporationBasicModel = (
  corporationBasic: CorporationBasicModel,
  user: string,
): ScrMem0003ApplyForChangeCorporationRequest => {
  const corporationgroupmasters: CorporationGroupMasters[] =
    corporationBasic.corporationGroupName.map((x) => {
      const corporationgroupmaster: CorporationGroupMasters = {
        corporationGroupId: '',
        validityStartDate: x,
        corporationGroupName: '',
      };
      return corporationgroupmaster;
    });

  const guarantormaster1: GuarantorMasters = {
    guarantorNo: 1,
    guarantorName: corporationBasic.guarantorName1,
    guarantorNameKana: corporationBasic.guarantorNameKana1,
    guarantorGenderKind: '',
    guarantorBirthDate: '',
    guarantorPossessionAssetsKind: '',
    guarantorRelationship: '',
    guarantorZipCode: '',
    guarantorPrefectureCode: '',
    guarantorMunicipalities: '',
    guarantorAddressBuildingName: '',
    guarantorPhoneNumber: '',
    guarantorFaxNumber: '',
    guarantorMobilePhoneNumber: '',
  };

  const guarantormaster2: GuarantorMasters = {
    guarantorNo: 2,
    guarantorName: corporationBasic.guarantorName2,
    guarantorNameKana: corporationBasic.guarantorNameKana2,
    guarantorGenderKind: '',
    guarantorBirthDate: '',
    guarantorPossessionAssetsKind: '',
    guarantorRelationship: '',
    guarantorZipCode: '',
    guarantorPrefectureCode: '',
    guarantorMunicipalities: '',
    guarantorAddressBuildingName: '',
    guarantorPhoneNumber: '',
    guarantorFaxNumber: '',
    guarantorMobilePhoneNumber: '',
  };

  const request: ScrMem0003ApplyForChangeCorporationRequest = {
    corporationId: corporationBasic.corporationId,
    corporationName: corporationBasic.corporationName,
    corporationNameKana: corporationBasic.corporationNameKana,
    goldSilverMemberKind: corporationBasic.goldSilverMemberKind,
    corporationZipCode: corporationBasic.corporationZipCode,
    corporationPrefectureCode: corporationBasic.corporationPrefectureCode,
    corporationMunicipalities: corporationBasic.corporationMunicipalities,
    corporationAddressBuildingName:
      corporationBasic.corporationAddressBuildingName,
    corporationPhoneNumber: corporationBasic.corporationPhoneNumber,
    corporationFaxNumber: corporationBasic.corporationFaxNumber,
    corporationMailAddress: corporationBasic.corporationMailAddress,
    eligibleBusinessNumber: corporationBasic.eligibleBusinessNumber,
    taxBusinessKind: corporationBasic.taxBusinessKind,
    publicSafetyCommittee: corporationBasic.publicSafetyCommittee,
    antiqueBusinessLicenseNumber: corporationBasic.antiqueBusinessLicenseNumber,
    issuanceDate: corporationBasic.issuanceDate,
    antiqueName: corporationBasic.antiqueName,
    memberMemo: '',
    representativeName: '',
    representativeNameKana: '',
    representativeGenderKind: '',
    representativeBirthDate: '',
    possessionAssetsKind: '',
    representativeZipCode: '',
    representativePrefectureCode: '',
    representativeMunicipalities: '',
    representativeAddressBuildingName: '',
    representativePhoneNumber: '',
    representativeFaxNumber: '',
    representativeMobilePhoneNumber: '',
    corporationGroupMasters: corporationgroupmasters,
    guarantor: [guarantormaster1, guarantormaster2],
      
    applicationEmployeeId: user,
    changeHistoryDate: corporationBasic.changeExpectedDate,
    registrationChangeMemo: '',
    screenId: 'SCR-MEM-0003',
    tabId: 'B-3',
  };

  return request;
};

const convertToErrorMessages = (response: errorResult[]): errorMessagesModel[] => {
  const list:errorMessagesModel[] = []; 
  if(response === undefined){
    return list;
  }
  response.map((x) => {
    list.push({
      errorCode: x.errorCode,
      errorMessage: x.errorMessage
    })
  })
  return list;
}

/**
 * 変更した項目から登録・変更内容データへの変換
 */
const convertToSectionList = (dirtyFields: object): SectionListModel[] => {
  const fields = Object.keys(dirtyFields);
  const sectionList: SectionListModel[] = [];
  const columnList: ColumnListModel[] = [];
  sectionDef.forEach((d) => {
    fields.forEach((f) => {
      if(d.fields.includes(f)){
        columnList.push({columnName: d.name[d.fields.indexOf(f)]})
      }
    })
    sectionList.push({
      sectionName: d.section,
      columnList: columnList
    })
  })
  return sectionList;
};

/**
 * 法人情報詳細画面 基本情報タブ
 * @returns
 */
const ScrMem0003BasicTab = (props: { chengeTabDisableds: (tabDisableds: TabDisabledsModel) => void; }) => {
  // router
  const { corporationId } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  // user情報(businessDateも併せて取得)
  const { appContext } = useContext(AppContext);

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [changeHistory, setChangeHistory] = useState<SelectValue[]>([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [openGuarantorSection1, setOpenGuarantorSection1] = useState<boolean>(true);
  const [openGuarantorSection2, setOpenGuarantorSection2] = useState<boolean>(true);
  const [isChangeHistory, setIsChangeHistory] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messege, setMessege] = useState<string>('');

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);
  // form
  const methods = useForm<CorporationBasicModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(corporationBasicSchama)),
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

    const historyInitialize = async (corporationId: string, applicationId: string) => {
      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId
      };
      const response = (await memApiClient.post('/get-history-info', request)).data;
      const corporationBasic = convertToCreditInfoModel(response, corporationId, applicationId);
      
      // 画面にデータを設定
      reset(corporationBasic);

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0003',
        tabId: 'B-3',
        getKeyValue: corporationId,
        businessDate: new Date() // TODO:業務日付取得方法実装待ち、new Date()で登録
      }
      
      const getChangeDate = (await comApiClient.post('/com/get-change-date', getChangeDateRequest)).data;
      const chabngeHistory = getChangeDate.changeExpectDateInfo.map((e: { changeHistoryNumber: number; changeExpectDate: Date; }) => {
        return{
          value: e.changeHistoryNumber,
          displayValue: new Date(e.changeExpectDate).toLocaleDateString(),
        }
      })
      setChangeHistory(chabngeHistory);
    }

    const initialize = async (corporationId: string) => {
      // TODO: 直接apiClientを使用しない
      const codeValues = (await memApiClient.post('/scr/get-code-values')).data;
      setSelectValues({
        corporationGroupselectValues: codeValues.corporationGroup,
        goldSilverMemberKindselectValues: codeValues.goldSilverMemberKind,
        prefectureCodeselectValues: codeValues.prefectureCode,
      });

      // 法人基本情報申請API
      const request: ScrMem0003GetCorporationRequest = {
        corporationId: corporationId
      };
      const response = await ScrMem0003GetCorporation(request);
      const corporationBasic = convertToCorporationBasicModel(response);

      // 画面にデータを設定
      reset(corporationBasic);

      // 連帯保証人①セクション内の全ての入力項目が未設定の場合、連帯保証人①セクションを折り畳み表示する
      if(corporationBasic.guarantorName1 === null && corporationBasic.guarantorNameKana1 === null &&
        corporationBasic.guarantorGender1 === null && corporationBasic.guarantorBirth1 === null &&
        corporationBasic.guarantorAsset1 === null && corporationBasic.guarantorRelationship1 === null &&
        corporationBasic.guarantorZipCode1 === null && corporationBasic.guarantorPrefecture1 === null &&
        corporationBasic.guarantorMunicipalities1 === null && corporationBasic.guarantorAddressBuildingName1 === null &&
        corporationBasic.guarantorPhoneNumber1 === null && corporationBasic.guarantorFaxNumber1 === null &&
        corporationBasic.guarantorMobilePhoneNumber1 === null
      ){
        setOpenGuarantorSection1(false);
      }
      
      // 連帯保証人⓶セクション内の全ての入力項目が未設定の場合、連帯保証人⓶セクションを折り畳み表示する
      if(corporationBasic.guarantorName2 === null && corporationBasic.guarantorNameKana2 === null &&
        corporationBasic.guarantorGender2 === null && corporationBasic.guarantorBirth2 === null &&
        corporationBasic.guarantorAsset2 === null && corporationBasic.guarantorRelationship2 === null &&
        corporationBasic.guarantorZipCode2 === null && corporationBasic.guarantorPrefecture2 === null &&
        corporationBasic.guarantorMunicipalities2 === null && corporationBasic.guarantorAddressBuildingName2 === null &&
        corporationBasic.guarantorPhoneNumber2 === null && corporationBasic.guarantorFaxNumber2 === null &&
        corporationBasic.guarantorMobilePhoneNumber2 === null
      ){
        setOpenGuarantorSection2(false);
      }

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0003',
        tabId: 'B-3',
        getKeyValue: corporationId,
        businessDate: new Date() // TODO:業務日付取得方法実装待ち、new Date()で登録
      }
      const getChangeDate = (await comApiClient.post('/com/get-change-date', getChangeDateRequest)).data;
      
      const chabngeHistory = getChangeDate.changeExpectDateInfo.map((e: { changeHistoryNumber: number; changeExpectDate: Date; }) => {
        return{
          value: e.changeHistoryNumber,
          displayValue: new Date(e.changeExpectDate).toLocaleDateString(),
        }
      })
      setChangeHistory(chabngeHistory);
    };

    if (corporationId === undefined || corporationId === 'new') {
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
        ScrMem0003ChangeHistoryTab: true,
      });
      return;
    }

    if(corporationId !== undefined && applicationId !== null){
      historyInitialize(corporationId, applicationId)
      return;
    }

    if(corporationId !== undefined) {
      initialize(corporationId)
      return;
    };

  }, [corporationId, applicationId, reset]);

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    if (!corporationId) return;

    // 変更履歴情報取得API
    const request = {
      changeHistoryNumber: getValues('changeHistoryNumber')
    };
    const response = (await memApiClient.post('/get-history-info', request)).data;
    const corporationBasic = convertToCreditInfoModel(response, corporationId, getValues('changeHistoryNumber'));
    
    setIsChangeHistory(true); 
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
      ScrMem0003ChangeHistoryTab: true,
    });
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    if(Object.keys(errors).length) return;
    
    // 法人基本情報入力チェックAPI
    const scrMem0003InputCheckCorporationInfoRequest: ScrMem0003InputCheckCorporationInfoRequest = {
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
    const scrMem0010GetMemberResponse = await ScrMem0003InputCheckCorporationInfo(scrMem0003InputCheckCorporationInfoRequest);

    const errorMessages:errorMessagesModel[] = convertToErrorMessages(scrMem0010GetMemberResponse.errorList);
    if(getValues('corporationFaxNumber') !== '' && getValues('corporationMailAddress') !== ''){
      errorMessages.push({
        errorCode: 'MSG-FR-ERR-00058',
        errorMessage: 'FAX、または、アドレスを入力してください'
      })
    };

    changeHistoryDateCheck();

    //setIsOpenPopup(true);
    
    setScrCom0032PopupData({
      errorMessages: errorMessages,
      warningMessages: convertToErrorMessages(scrMem0010GetMemberResponse.warnList),
      contentsList: {
        screenName: '法人情報詳細',
        screenId: 'SCR-MEM-0003',
        tabName: '基本情報',
        tabId: 'B-3',
        sectionList: convertToSectionList(dirtyFields),
      },
      changeExpectDate: new Date(),// TODO:業務日付取得方法実装待ち、new Date()で登録
    });

  };


  /**
   * 反映予定日整合性チェック
   */
  const changeHistoryDateCheck = () => {
    const errorMessages:errorMessagesModel[] = [];

    // 変更予定日取得
    let changeHistoryDate = '';
    changeHistory.find((x) => {
      if(x.value === getValues('changeHistoryNumber')){
        changeHistoryDate = x.displayValue
      }
    });

    const changeExpectedDate = getValues('changeExpectedDate');
    if(changeExpectedDate !== ''){
      // 反映予定日≦操作日の場合、エラー
      if(new Date(changeExpectedDate) <= new Date()){
        //TODO:エラーメッセージを確認
        errorMessages.push({
          errorCode: 'MSG-FR-ERR-XXXX',
          errorMessage: '反映日が正しくありません。'
        })
      }
      // 反映予定日＝変更予約日の場合、エラー
      if(changeHistoryDate !== '' && new Date(changeExpectedDate) === new Date(changeHistoryDate)){
        //TODO:エラーメッセージを確認
        errorMessages.push({
          errorCode: 'MSG-FR-ERR-XXXX',
          errorMessage: '反映日が正しくありません。'
        })
      }
    }
    if(!isChangeHistory){
      // 上記①、②以外の日付が反映予定日に設定されている、またはブランクの場合、アラート
      if((!(new Date(changeExpectedDate) <= new Date()) && new Date(changeExpectedDate) !== new Date(changeHistoryDate))
        || changeExpectedDate === ''){
          const messege1 = changeHistoryDate === ''? '現時点':changeHistoryDate;
          const messege2 = changeExpectedDate === ''? '即時':new Date(changeExpectedDate).toLocaleDateString();
          // アラート表示
          setMessege('【注意】変更予約が存在しております。\n '+messege1+'断面の情報をもとに変更した情報が\n反映日：'+ messege2 +'となりますが、よろしいですか？')
          setIsOpen(true)
      }
    }else{
      // 反映予定日＝ブランクの場合、エラー
      if( changeExpectedDate === ''){
        //TODO:エラーメッセージを確認
        errorMessages.push({
          errorCode: 'MSG-FR-ERR-XXXX',
          errorMessage: '反映日が正しくありません。'
        })
      }else if(new Date(changeExpectedDate) <= new Date(changeHistoryDate)){
        // 反映予定日≦変更予約情報で選択した日付の場合、エラー
        //TODO:エラーメッセージを確認
        errorMessages.push({
          errorCode: 'MSG-FR-ERR-XXXX',
          errorMessage: '反映日が正しくありません。'
        })
      }else{
        // 上記以外の場合、アラート
        const messege1 = changeHistoryDate === ''? '現時点':changeHistoryDate;
        const messege2 = changeExpectedDate === ''? '即時':new Date(changeExpectedDate).toLocaleDateString();
        // アラート表示
        setMessege('【注意】変更予約が存在しております。\n '+messege1+'断面の情報をもとに変更した情報が\n反映日：'+ messege2 +'となりますが、よろしいですか？')
        setIsOpen(true)
      }
    }

  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations');
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async () => {
    setIsOpenPopup(false);
    setIsChangeHistory(false); 

    // 法人基本情報変更申請
    const request = convertFromCorporationBasicModel(getValues(), appContext.user);
    const response = await ScrMem0003ApplyForChangeCorporation(request);
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
  const onBlur = async (name:string, item:string) => {

    const request = {zipCode: item}
    const codeValues = (await comApiClient.post('/com/scr/get-address-info', request)).data;
    
    switch (name) {
      case 'corporationZipCode':
        setValue('corporationPrefectureCode', codeValues.prefectureCode)
        setValue('corporationMunicipalities', codeValues.municipalities)
        setValue('corporationAddressBuildingName', codeValues.townOrStreetName)
        break;
      case 'representativeZipCode':
        setValue('representativePrefectureCode', codeValues.prefectureCode)
        setValue('representativeMunicipalities', codeValues.municipalities)
        setValue('representativeAddressBuildingName', codeValues.townOrStreetName)
        break;
      case 'guarantorZipCode1':
        setValue('guarantorPrefecture1', codeValues.prefectureCode)
        setValue('guarantorMunicipalities1', codeValues.municipalities)
        setValue('guarantorAddressBuildingName1', codeValues.townOrStreetName)
        break;
      case 'guarantorZipCode2':
        setValue('guarantorPrefecture2', codeValues.prefectureCode)
        setValue('guarantorMunicipalities2', codeValues.municipalities)
        setValue('guarantorAddressBuildingName2', codeValues.townOrStreetName)
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
                    selectValues={selectValues.corporationGroupselectValues}
                    blankOption
                    size='m'
                  />
                  <Select
                    label='Gold/Silver会員'
                    name='goldSilverMemberKind'
                    selectValues={selectValues.goldSilverMemberKindselectValues}
                    blankOption
                  />
                </ColStack>
                <ColStack>
                  <PostalTextField
                    label='郵便番号'
                    name='corporationZipCode'
                    required
                    onBlur={() => onBlur('corporationZipCode', getValues('corporationZipCode'))}
                  />
                  <Select
                    label='都道府県'
                    name='corporationPrefectureCode'
                    selectValues={selectValues.prefectureCodeselectValues}
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
                  <DatePicker label='交付年月日' name='issuanceDate' wareki />
                  <TextField label='古物名義' name='antiqueName' />
                </ColStack>
              </RowStack>
            </Section>
            {/* 会員メモ情報セクション */}
            <Section name='会員メモ情報'>
              <Textarea
                name='memberMemo'
                minRows={10}
                maxRows={30}
                size='l'
              ></Textarea>
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
                      { value: 'male', displayValue: '男' },
                      { value: 'female', displayValue: '女' },
                    ]}
                  />
                  <DatePicker
                    label='生年月日'
                    name='representativeBirth'
                    wareki
                  />
                  <Select
                    label='所有資産'
                    name='representativeAsset'
                    selectValues={changeHistory}
                    blankOption
                  />
                </ColStack>
                <ColStack>
                  <PostalTextField
                    label='郵便番号'
                    name='representativeZipCode'
                    onBlur={() => onBlur('representativeZipCode', getValues('representativeZipCode'))}
                  />
                  <Select
                    label='都道府県'
                    name='representativePrefectureCode'
                    selectValues={selectValues.prefectureCodeselectValues}
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
            <Section name='連帯保証人①'
              open={openGuarantorSection1}
            >
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
                      { value: 'male', displayValue: '男' },
                      { value: 'female', displayValue: '女' },
                    ]}
                  />
                  <DatePicker label='生年月日' name='guarantorBirth1' wareki />
                  <Select
                    label='所有資産'
                    name='guarantorAsset1'
                    selectValues={changeHistory}
                    blankOption
                  />
                  <TextField label='代表者との続柄' name='guarantorRelationship1' />
                </ColStack>
                <ColStack>
                  <PostalTextField
                    label='郵便番号'
                    name='guarantorZipCode1'
                    onBlur={() => onBlur('guarantorZipCode1', getValues('guarantorZipCode1'))}
                  />
                  <Select
                    label='都道府県'
                    name='guarantorPrefecture1'
                    selectValues={selectValues.prefectureCodeselectValues}
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
            <Section name='連帯保証人②'
              open={openGuarantorSection2}
            >
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
                      { value: 'male', displayValue: '男' },
                      { value: 'female', displayValue: '女' },
                    ]}
                  />
                  <DatePicker label='生年月日' name='guarantorBirth2' wareki />
                  <Select
                    label='所有資産'
                    name='guarantorAsset2'
                    selectValues={changeHistory}
                    blankOption
                  />
                  <TextField label='代表者との続柄' name='guarantorRelationship2' />
                </ColStack>
                <ColStack>
                  <PostalTextField
                    label='郵便番号'
                    name='guarantorZipCode2'
                    onBlur={() => onBlur('guarantorZipCode2', getValues('guarantorZipCode2'))}
                  />
                  <Select
                    label='都道府県'
                    name='guarantorPrefecture2'
                    selectValues={selectValues.prefectureCodeselectValues}
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
                {changeHistory.length <= 0?<></>:
                  <RightElementStack>
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
                    <MarginBox mb={6}>
                      <DatePicker label='変更予定日' name='changeExpectedDate' />
                    </MarginBox>
                  </RightElementStack>
                }
              </Grid>
            </Grid>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      <ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />


      <DialogMui open={isOpen}>
        <DialogTitle sx={{whiteSpace: 'pre-wrap'}}>
          {messege}
        </DialogTitle>
        <DialogActions sx={{ flexDirection: 'row-reverse', justifyContent: 'flex-start', padding: 2 }}>
          <Box padding={1}>
            <Button onClick={() => setIsOpen(false)}>{'はい'}</Button>
          </Box>
          <Box padding={1}>
            <Button onClick={() => setIsOpen(false)}>{'いいえ'}</Button>
          </Box>
        </DialogActions>
      </DialogMui>
      
    </>
  );
};

export default ScrMem0003BasicTab;
