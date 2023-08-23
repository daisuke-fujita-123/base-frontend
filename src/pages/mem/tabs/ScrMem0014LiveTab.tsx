import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0011Popup, {
  ScrCom0011PopupModel,
} from 'pages/com/popups/ScrCom0011Popup';
import ScrCom0032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

import { ContentsBox, MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import {
  AddButton,
  CancelButton,
  ConfirmButton,
  PrimaryButton,
} from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridTooltipsModel,
} from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { CaptionLabel, WarningLabel } from 'controls/Label';
import { Select } from 'controls/Select';
import { Textarea } from 'controls/Textarea';
import { TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  ScrCom9999GetChangeDate,
  ScrCom9999getCodeManagementMasterMultiple,
} from 'apis/com/ScrCom9999Api';
import {
  registrationRequest,
  ScrMem0014EnterEnterthevenueBase,
  ScrMem0014GetLiveInfo,
  ScrMem0014GetLiveInfoResponse,
} from 'apis/mem/ScrMem0014Api';
import { ScrMem9999OutputReport } from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

import { useGridApiRef } from '@mui/x-data-grid-pro';
import { TabDisabledsModel } from '../ScrMem0014Page';

/**
 * 基本情報データモデル
 */
interface LiveInfoModel {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 契約ID
  contractId: string;
  // コース
  courseName: string;
  // おまとめサービス契約状況
  omatomeServiceContractStatus: string;
  // 基本法人与信額
  basicsCorporationCreditAmount: string;
  // 支払延長与信額
  paymentExtensionCreditAmount: string;
  // 住所
  corporationAddress: string;
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
  // TEL
  corporationPhoneNumber: string;
  // FAX
  corporationFaxNumber: string;
  // メールアドレス
  corporationMailAddress: string;
  // 代表者名
  representativeName: string;
  // 住所
  representativeAddress: string;
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
  // TEL
  representativePhoneNumber: string;
  // FAX
  representativeFaxNumber: string;
  // 携帯電話
  representativeMobilePhoneNumber: string;
  // 適格事業者番号
  eligibleBusinessNumber: string;
  // 公安委員会
  publicSafetyCommittee: string;
  // 古物商許可番号
  antiqueBusinessLicenseNumber: string;
  // 交付年月日
  issuanceDate: string;
  // 交付年月日(和暦)
  issuanceDateWareki: string;
  // 古物名義
  antiqueName: string;
  // 譲渡書類送付先情報 住所
  assignmentdocumentDestinationAddress: string;
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
  // 譲渡書類送付先情報 TEL
  assignmentdocumentDestinationPhoneNumber: string;
  // 譲渡書類送付先情報 FAX
  assignmentdocumentDestinationFaxNumber: string;
  // 譲渡書類送付先情報（おまとめ会場用） 住所
  assignmentDocumentDestinationOmatomeAddress: string;
  // 譲渡書類送付先情報（おまとめ会場用） TEL
  assignmentDocumentDestinationOmatomePhoneNumber: string;
  // 譲渡書類送付先情報（おまとめ会場用） FAX
  assignmentDocumentDestinationOmatomeFaxNumber: string;
  // 支払口座 銀行コード
  payAccountInfoBank: string;
  // 支払口座 銀行コード
  payAccountInfoBankCode: string;
  // 支払口座 銀行名
  payAccountInfoBankName: string;
  // 支払口座 支店コード
  payAccountInfoBranch: string;
  // 支払口座 支店コード
  payAccountInfoBranchCode: string;
  // 支払口座 支店名
  payAccountInfoBranchName: string;
  // 支払口座 種別
  payAccountInfoAccountKind: string;
  // 支払口座 口座番号
  payAccountInfoAccountNumber: string;
  // 支払口座 口座名義
  payAccountInfoAccuntNameKana: string;
  // 会場向け振込口座（おまとめ用） 銀行
  payAccountOmatomeInfoBank: string;
  // 会場向け振込口座（おまとめ用） 支店
  payAccountOmatomeInfoBranch: string;
  // 会場向け振込口座（おまとめ用） 種別
  payAccountOmatomeInfoAccountKind: string;
  // 会場向け振込口座（おまとめ用） 口座番号
  payAccountOmatomeInfoAccountNumber: string;
  // 会場向け振込口座（おまとめ用） 口座名義
  payAccountOmatomeInfoAccuntNameKana: string;
  // 会場データ送付時備考
  placeDataSendingRemarks: string;

  // 会場情報
  placeInfoListRow: placeInfoListRowModel[];

  changeHistoryNumber: string;
  changeExpectedDate: string;
}

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  claimMethodKind: yup.string().label('会費請求方法'),
};

/**
 * 会場情報列定義
 */
const placeInfoListColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: '',
    size: 's',
  },
  {
    field: 'placeCode',
    headerName: '会場コード',
    size: 's',
  },
  {
    field: 'placeName',
    headerName: '会場名',
    size: 'm',
  },
  {
    field: 'sessionWeekKind',
    headerName: '開催曜日',
    size: 's',
  },
  {
    field: 'dataSendingDate',
    headerName: 'データ送付日',
    cellType: 'datepicker',
    size: 'l',
  },
  {
    field: 'dataRegistrationDate',
    headerName: 'データ登録日',
    cellType: 'datepicker',
    size: 'l',
  },
  {
    field: 'placeEntryKind',
    headerName: '参加区分',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'PosNumber',
    headerName: 'POS番号',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'PosInfoNumber',
    headerName: '重複POS',
    tooltip: true,
    size: 's',
  },
  {
    field: 'placeMemberKind',
    headerName: '会員区分',
    cellType: 'select',
    selectValues: [],
    size: 's',
  },
  {
    field: 'omatomePlaceFlag',
    headerName: 'おまとめ対象会場',
    size: 'm',
  },
  {
    field: 'omatomeKind',
    headerName: 'おまとめ区分',
    cellType: 'select',
    selectValues: [
      { value: 1, displayValue: ' ' },
      { value: 2, displayValue: '○' },
      { value: 3, displayValue: '×' },
    ],
    size: 's',
  },
  {
    field: 'omatomeAccountNumber',
    headerName: 'おまとめ口座番号',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'entryPlaceMemo',
    headerName: 'メモ',
    cellType: 'input',
    size: 'l',
  },
];

/**
 * コース情報行データモデル
 */
interface placeInfoListRowModel {
  id: string;
  placeCode: string;
  placeName: string;
  sessionWeekKind: string;
  dataSendingDate: string;
  dataRegistrationDate: string;
  placeEntryKind: string;
  PosNumber: string;
  PosInfoNumber: string;
  PosInfo: { contractId: string }[];
  placeMemberKind: string;
  omatomePlaceFlag: string;
  statementDisplayPlaceName: string;
  omatomeKind: string;
  omatomeAccountNumber: string;
  entryPlaceMemo: string;
}

/**
 * 基本情報初期データ
 */
const initialValues: LiveInfoModel = {
  corporationId: '',
  corporationName: '',
  contractId: '',
  courseName: '',
  omatomeServiceContractStatus: '',
  basicsCorporationCreditAmount: '',
  paymentExtensionCreditAmount: '',
  corporationAddress: '',
  corporationZipCode: '',
  corporationPrefectureCode: '',
  corporationPrefectureName: '',
  corporationMunicipalities: '',
  corporationAddressBuildingName: '',
  corporationPhoneNumber: '',
  corporationFaxNumber: '',
  corporationMailAddress: '',
  representativeName: '',
  representativeAddress: '',
  representativeZipCode: '',
  representativePrefectureCode: '',
  representativePrefectureName: '',
  representativeMunicipalities: '',
  representativeAddressBuildingName: '',
  representativePhoneNumber: '',
  representativeFaxNumber: '',
  representativeMobilePhoneNumber: '',
  eligibleBusinessNumber: '',
  publicSafetyCommittee: '',
  antiqueBusinessLicenseNumber: '',
  issuanceDate: '',
  issuanceDateWareki: '',
  antiqueName: '',
  assignmentdocumentDestinationAddress: '',
  assignmentDocumentDestinationbusinessBaseZipCode: '',
  assignmentdocumentDestinationPrefectureCode: '',
  assignmentdocumentDestinationPrefectureName: '',
  assignmentdocumentDestinationMunicipalities: '',
  assignmentDocumentDestinationAddressBuildingName: '',
  assignmentdocumentDestinationPhoneNumber: '',
  assignmentdocumentDestinationFaxNumber: '',
  assignmentDocumentDestinationOmatomeAddress: '',
  assignmentDocumentDestinationOmatomePhoneNumber: '',
  assignmentDocumentDestinationOmatomeFaxNumber: '',
  payAccountInfoBank: '',
  payAccountInfoBankCode: '',
  payAccountInfoBankName: '',
  payAccountInfoBranch: '',
  payAccountInfoBranchCode: '',
  payAccountInfoBranchName: '',
  payAccountInfoAccountKind: '',
  payAccountInfoAccountNumber: '',
  payAccountInfoAccuntNameKana: '',
  payAccountOmatomeInfoBank: '',
  payAccountOmatomeInfoBranch: '',
  payAccountOmatomeInfoAccountKind: '',
  payAccountOmatomeInfoAccountNumber: '',
  payAccountOmatomeInfoAccuntNameKana: '',
  placeDataSendingRemarks: '',

  placeInfoListRow: [],
  changeHistoryNumber: '',
  changeExpectedDate: '',
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [
    {
      screenId: '',
      screenName: '',
      tabId: 0,
      tabName: '',
      sectionList: [
        {
          sectionName: '',
          columnList: [
            {
              columnName: '',
            },
          ],
        },
      ],
    },
  ],
  changeExpectDate: '',
};

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '会場情報',
    fields: [
      'dataSendingDate',
      'dataRegistrationDate',
      'placeEntryKind',
      'PosNumber',
      'placeMemberKind',
      'omatomeKind',
      'omatomeAccountNumber',
      'entryPlaceMemo',
    ],
    name: [
      'データ送付日',
      'データ登録日',
      '参加区分',
      'POS番号',
      '会員区分',
      'おまとめ区分',
      'おまとめ口座番号',
      'メモ',
    ],
  },
  {
    section: '会場データ送付時備考',
    fields: ['placeDataSendingRemarks'],
    name: ['会場データ送付時備考'],
  },
];

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
 * ライブ情報取得APIレスポンスから基本情報データモデルへの変換
 */
const convertToLiveInfoModel = (
  response: ScrMem0014GetLiveInfoResponse
): LiveInfoModel => {
  const liveBaseInfo = response.liveBaseInfo;
  const liveRegistrationInfo = response.liveRegistrationInfo;
  // TODO: 都道府県コードを変更
  const corporationAddress =
    liveBaseInfo.corporationZipCode +
    '　' +
    liveBaseInfo.corporationPrefectureName +
    liveBaseInfo.corporationMunicipalities +
    liveBaseInfo.corporationAddressBuildingName;
  // 代表者 住所
  const representativeAddress =
    liveBaseInfo.representativeZipCode +
    '　' +
    liveBaseInfo.representativePrefectureName +
    liveBaseInfo.representativeMunicipalities +
    liveBaseInfo.representativeAddressBuildingName;
  // 譲渡書類送付先情報 住所
  const assignmentdocumentDestinationAddress =
    liveRegistrationInfo.assignmentdocumentDestinationInfo
      .assignmentDocumentDestinationbusinessBaseZipCode +
    '　' +
    liveRegistrationInfo.assignmentdocumentDestinationInfo
      .assignmentdocumentDestinationPrefectureName +
    liveRegistrationInfo.assignmentdocumentDestinationInfo
      .assignmentdocumentDestinationMunicipalities +
    liveRegistrationInfo.assignmentdocumentDestinationInfo
      .assignmentDocumentDestinationAddressBuildingName;
  // 交付日
  const issuanceDate = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'long',
  }).format(new Date(liveBaseInfo.issuanceDate));
  return {
    corporationId: liveBaseInfo.contractId,
    corporationName: liveBaseInfo.corporationName,
    contractId: liveBaseInfo.contractId,
    courseName: liveBaseInfo.courseName,
    omatomeServiceContractStatus: liveBaseInfo.omatomeServiceContractStatus
      ? '有'
      : '',
    basicsCorporationCreditAmount:
      liveBaseInfo.basicsCorporationCreditAmount.toLocaleString(),
    paymentExtensionCreditAmount:
      liveBaseInfo.paymentExtensionCreditAmount.toLocaleString(),
    corporationAddress: corporationAddress,
    corporationZipCode: liveBaseInfo.corporationZipCode,
    corporationPrefectureName: liveBaseInfo.corporationPrefectureName,
    corporationPrefectureCode: liveBaseInfo.corporationPrefectureCode,
    corporationMunicipalities: liveBaseInfo.corporationMunicipalities,
    corporationAddressBuildingName: liveBaseInfo.corporationAddressBuildingName,
    corporationPhoneNumber: liveBaseInfo.corporationPhoneNumber,
    corporationFaxNumber: liveBaseInfo.corporationFaxNumber,
    corporationMailAddress: liveBaseInfo.corporationMailAddress,
    representativeName: liveBaseInfo.representativeName,
    representativeAddress: representativeAddress,
    representativeZipCode: liveBaseInfo.representativeZipCode,
    representativePrefectureCode: liveBaseInfo.representativePrefectureCode,
    representativePrefectureName: liveBaseInfo.representativePrefectureName,
    representativeMunicipalities: liveBaseInfo.representativeMunicipalities,
    representativeAddressBuildingName:
      liveBaseInfo.representativeAddressBuildingName,
    representativePhoneNumber: liveBaseInfo.representativePhoneNumber,
    representativeFaxNumber: liveBaseInfo.representativeFaxNumber,
    representativeMobilePhoneNumber:
      liveBaseInfo.representativeMobilePhoneNumber,
    eligibleBusinessNumber: liveBaseInfo.eligibleBusinessNumber,
    publicSafetyCommittee: liveBaseInfo.publicSafetyCommittee,
    antiqueBusinessLicenseNumber: liveBaseInfo.antiqueBusinessLicenseNumber,
    issuanceDate: liveBaseInfo.issuanceDate,
    issuanceDateWareki: issuanceDate,
    antiqueName: liveBaseInfo.antiqueName,
    assignmentdocumentDestinationAddress: assignmentdocumentDestinationAddress,
    assignmentDocumentDestinationbusinessBaseZipCode:
      liveRegistrationInfo.assignmentdocumentDestinationInfo
        .assignmentDocumentDestinationbusinessBaseZipCode,
    assignmentdocumentDestinationPrefectureCode:
      liveRegistrationInfo.assignmentdocumentDestinationInfo
        .assignmentdocumentDestinationPrefectureCode,
    assignmentdocumentDestinationPrefectureName:
      liveRegistrationInfo.assignmentdocumentDestinationInfo
        .assignmentdocumentDestinationPrefectureName,
    assignmentdocumentDestinationMunicipalities:
      liveRegistrationInfo.assignmentdocumentDestinationInfo
        .assignmentdocumentDestinationMunicipalities,
    assignmentDocumentDestinationAddressBuildingName:
      liveRegistrationInfo.assignmentdocumentDestinationInfo
        .assignmentDocumentDestinationAddressBuildingName,
    assignmentdocumentDestinationPhoneNumber:
      liveRegistrationInfo.assignmentdocumentDestinationInfo
        .assignmentdocumentDestinationPhoneNumber,
    assignmentdocumentDestinationFaxNumber:
      liveRegistrationInfo.assignmentdocumentDestinationInfo
        .assignmentdocumentDestinationFaxNumber,
    assignmentDocumentDestinationOmatomeAddress:
      liveRegistrationInfo.assignmentdocumentDestinationOmatomeInfo
        .assignmentDocumentDestinationOmatomeAddress,
    assignmentDocumentDestinationOmatomePhoneNumber:
      liveRegistrationInfo.assignmentdocumentDestinationOmatomeInfo
        .assignmentDocumentDestinationOmatomePhoneNumber,
    assignmentDocumentDestinationOmatomeFaxNumber:
      liveRegistrationInfo.assignmentdocumentDestinationOmatomeInfo
        .assignmentDocumentDestinationOmatomeFaxNumber,
    payAccountInfoBank:
      liveRegistrationInfo.payAccountInfo.bankCode +
      '　' +
      liveRegistrationInfo.payAccountInfo.bankName,
    payAccountInfoBankCode: liveRegistrationInfo.payAccountInfo.bankCode,
    payAccountInfoBankName: liveRegistrationInfo.payAccountInfo.bankName,
    payAccountInfoBranch:
      liveRegistrationInfo.payAccountInfo.branchCode +
      '　' +
      liveRegistrationInfo.payAccountInfo.branchName,
    payAccountInfoBranchCode: liveRegistrationInfo.payAccountInfo.branchCode,
    payAccountInfoBranchName: liveRegistrationInfo.payAccountInfo.branchName,
    payAccountInfoAccountKind: liveRegistrationInfo.payAccountInfo.accountKind,
    payAccountInfoAccountNumber:
      liveRegistrationInfo.payAccountInfo.accountNumber,
    payAccountInfoAccuntNameKana:
      liveRegistrationInfo.payAccountInfo.accuntNameKana,
    payAccountOmatomeInfoBank: liveRegistrationInfo.payAccountInfo.bankName,
    payAccountOmatomeInfoBranch: liveRegistrationInfo.payAccountInfo.branchName,
    payAccountOmatomeInfoAccountKind:
      liveRegistrationInfo.payAccountInfo.accountKind,
    payAccountOmatomeInfoAccountNumber:
      liveRegistrationInfo.payAccountInfo.accountNumber,
    payAccountOmatomeInfoAccuntNameKana:
      liveRegistrationInfo.payAccountInfo.accuntNameKana,
    placeDataSendingRemarks: response.placeDataSendingRemarks,

    placeInfoListRow: response.placeInfoList.map((val, idx) => {
      const PosInfo = val.PosInfo.length.toString();
      return {
        id: (idx + 1).toString(),
        placeCode: val.placeCode,
        placeName: val.placeName,
        sessionWeekKind: val.sessionWeekKind,
        dataSendingDate: new Date(val.dataSendingDate).toLocaleDateString(),
        dataRegistrationDate: new Date(
          val.dataRegistrationDate
        ).toLocaleDateString(),
        placeEntryKind: val.placeEntryKind,
        PosNumber: val.PosNumber,
        PosInfoNumber: PosInfo,
        PosInfo: val.PosInfo,
        placeMemberKind: val.placeMemberKind,
        statementDisplayPlaceName: val.statementDisplayPlaceName,
        omatomePlaceFlag: val.omatomePlaceFlag
          ? val.statementDisplayPlaceName === 'TAA'
            ? '※'
            : val.statementDisplayPlaceName === 'CAA'
            ? '※'
            : '●'
          : '',
        omatomeKind: val.omatomeKind,
        omatomeAccountNumber: val.omatomeAccountNumber,
        entryPlaceMemo: val.entryPlaceMemo,
      };
    }),

    changeHistoryNumber: '',
    changeExpectedDate: '',
  };
};

/**
 * 変更履歴情報取得APIから基本情報データモデルへの変換
 */
const convertToHistoryLiveInfoModel = (
  response: registrationRequest,
  changeHistoryNumber: string
): LiveInfoModel => {
  const liveBaseInfo = response.liveBaseInfo;
  const liveRegistrationInfo = response.liveRegisterInfo;
  const corporationAddress =
    liveBaseInfo.corporationZipCode +
    '　' +
    liveBaseInfo.corporationPrefectureName +
    liveBaseInfo.corporationMunicipalities +
    liveBaseInfo.corporationAddressBuildingName;
  const representativeAddress =
    liveBaseInfo.representativeZipCode +
    '　' +
    liveBaseInfo.representativePrefectureName +
    liveBaseInfo.representativeMunicipalities +
    liveBaseInfo.representativeAddressBuildingName;
  const assignmentdocumentDestinationAddress =
    liveRegistrationInfo.transferdocumentsInfo
      .assignmentDocumentDestinationbusinessBaseZipCode +
    '　' +
    liveRegistrationInfo.transferdocumentsInfo
      .assignmentdocumentDestinationPrefectureName +
    liveRegistrationInfo.transferdocumentsInfo
      .assignmentdocumentDestinationMunicipalities +
    liveRegistrationInfo.transferdocumentsInfo
      .assignmentDocumentDestinationAddressBuildingName;
  const issuanceDate = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'long',
  }).format(new Date(liveBaseInfo.issuanceDate));
  return {
    corporationId: liveBaseInfo.contractId,
    corporationName: liveBaseInfo.corporationName,
    contractId: liveBaseInfo.contractId,
    courseName: liveBaseInfo.courseName,
    omatomeServiceContractStatus: liveBaseInfo.omatomeServiceContractStatus
      ? '有'
      : '',
    basicsCorporationCreditAmount:
      liveBaseInfo.basicsCorporationCreditAmount.toLocaleString(),
    paymentExtensionCreditAmount:
      liveBaseInfo.paymentExtensionCreditAmount.toLocaleString(),
    corporationAddress: corporationAddress,
    corporationZipCode: liveBaseInfo.corporationZipCode,
    corporationPrefectureName: liveBaseInfo.corporationPrefectureName,
    corporationPrefectureCode: liveBaseInfo.corporationPrefectureCode,
    corporationMunicipalities: liveBaseInfo.corporationMunicipalities,
    corporationAddressBuildingName: liveBaseInfo.corporationAddressBuildingName,
    corporationPhoneNumber: liveBaseInfo.corporationPhoneNumber,
    corporationFaxNumber: liveBaseInfo.corporationFaxNumber,
    corporationMailAddress: liveBaseInfo.corporationMailAddress,
    representativeName: liveBaseInfo.representativeName,
    representativeAddress: representativeAddress,
    representativeZipCode: liveBaseInfo.representativeZipCode,
    representativePrefectureCode: liveBaseInfo.representativePrefectureCode,
    representativePrefectureName: liveBaseInfo.representativePrefectureName,
    representativeMunicipalities: liveBaseInfo.representativeMunicipalities,
    representativeAddressBuildingName:
      liveBaseInfo.representativeAddressBuildingName,
    representativePhoneNumber: liveBaseInfo.representativePhoneNumber,
    representativeFaxNumber: liveBaseInfo.representativeFaxNumber,
    representativeMobilePhoneNumber:
      liveBaseInfo.representativeMobilePhoneNumber,
    eligibleBusinessNumber: liveBaseInfo.eligibleBusinessNumber,
    publicSafetyCommittee: liveBaseInfo.publicSafetyCommittee,
    antiqueBusinessLicenseNumber: liveBaseInfo.antiqueBusinessLicenseNumber,
    issuanceDate: new Date(liveBaseInfo.issuanceDate).toLocaleDateString(),
    issuanceDateWareki: issuanceDate,
    antiqueName: liveBaseInfo.antiqueName,
    assignmentdocumentDestinationAddress: assignmentdocumentDestinationAddress,
    assignmentDocumentDestinationbusinessBaseZipCode:
      liveRegistrationInfo.transferdocumentsInfo
        .assignmentDocumentDestinationbusinessBaseZipCode,
    assignmentdocumentDestinationPrefectureCode:
      liveRegistrationInfo.transferdocumentsInfo
        .assignmentdocumentDestinationPrefectureCode,
    assignmentdocumentDestinationPrefectureName:
      liveRegistrationInfo.transferdocumentsInfo
        .assignmentdocumentDestinationPrefectureName,
    assignmentdocumentDestinationMunicipalities:
      liveRegistrationInfo.transferdocumentsInfo
        .assignmentdocumentDestinationMunicipalities,
    assignmentDocumentDestinationAddressBuildingName:
      liveRegistrationInfo.transferdocumentsInfo
        .assignmentDocumentDestinationAddressBuildingName,
    assignmentdocumentDestinationPhoneNumber:
      liveRegistrationInfo.transferdocumentsInfo
        .assignmentdocumentDestinationPhoneNumber,
    assignmentdocumentDestinationFaxNumber:
      liveRegistrationInfo.transferdocumentsInfo
        .assignmentdocumentDestinationFaxNumber,
    assignmentDocumentDestinationOmatomeAddress:
      liveRegistrationInfo.transferdocumentsconcludeInfo.transferadress,
    assignmentDocumentDestinationOmatomePhoneNumber:
      liveRegistrationInfo.transferdocumentsconcludeInfo.transfernumber,
    assignmentDocumentDestinationOmatomeFaxNumber:
      liveRegistrationInfo.transferdocumentsconcludeInfo.transferfax,
    payAccountInfoBank:
      liveRegistrationInfo.paymentAccount.bankCode +
      '　' +
      liveRegistrationInfo.paymentAccount.bankName,
    payAccountInfoBankCode: liveRegistrationInfo.paymentAccount.bankCode,
    payAccountInfoBankName: liveRegistrationInfo.paymentAccount.bankName,
    payAccountInfoBranch:
      liveRegistrationInfo.paymentAccount.branchCode +
      '　' +
      liveRegistrationInfo.paymentAccount.branchName,
    payAccountInfoBranchCode: liveRegistrationInfo.paymentAccount.branchCode,
    payAccountInfoBranchName: liveRegistrationInfo.paymentAccount.branchName,
    payAccountInfoAccountKind:
      liveRegistrationInfo.paymentAccount.accountTypeKind,
    payAccountInfoAccountNumber:
      liveRegistrationInfo.paymentAccount.accountNumber,
    payAccountInfoAccuntNameKana:
      liveRegistrationInfo.paymentAccount.accuntNameKana,
    payAccountOmatomeInfoBank:
      liveRegistrationInfo.venuepaymentAccount.bankName,
    payAccountOmatomeInfoBranch:
      liveRegistrationInfo.venuepaymentAccount.branchName,
    payAccountOmatomeInfoAccountKind:
      liveRegistrationInfo.venuepaymentAccount.accountTypeKind,
    payAccountOmatomeInfoAccountNumber:
      liveRegistrationInfo.venuepaymentAccount.accountNumber,
    payAccountOmatomeInfoAccuntNameKana:
      liveRegistrationInfo.venuepaymentAccount.accuntNameKana,
    placeDataSendingRemarks: response.placeDataSendingRemarks,

    placeInfoListRow: response.placeInfoList.map((val, idx) => {
      const posInfo = val.posInfo.length.toString();
      return {
        id: idx.toString(),
        placeCode: val.placeCode,
        placeName: val.placeName,
        sessionWeekKind: val.sessionWeekKind,
        dataSendingDate: new Date(val.dataSendingDate).toLocaleDateString(),
        dataRegistrationDate: new Date(
          val.dataRegistrationDate
        ).toLocaleDateString(),
        placeEntryKind: val.placeEntryKind,
        PosNumber: val.posNumber,
        PosInfoNumber: posInfo,
        PosInfo: val.posInfo,
        placeMemberKind: val.placeMemberKind,
        statementDisplayPlaceName: val.statementDisplayPlaceName,
        omatomePlaceFlag: val.omatomePlaceFlag
          ? val.statementDisplayPlaceName === 'TAA'
            ? '※'
            : val.statementDisplayPlaceName === 'CAA'
            ? '※'
            : '●'
          : '',
        omatomeKind: val.omatomeKind,
        omatomeAccountNumber: val.omatomeAccountNumber,
        entryPlaceMemo: val.entryPlaceMemo,
      };
    }),

    changeHistoryNumber: changeHistoryNumber,
    changeExpectedDate: '',
  };
};

/**
 * 基本情報からライブ情報登録APIリクエストへの変換
 */
const convertFromLiveInfo = (
  liveInfo: LiveInfoModel,
  contractBase: registrationRequest
): registrationRequest => {
  const newLiveInfo: registrationRequest = Object.assign(contractBase);

  newLiveInfo.liveBaseInfo = {
    corporationId: liveInfo.corporationId,
    corporationName: liveInfo.corporationName,
    contractId: liveInfo.contractId,
    courseName: liveInfo.courseName,
    omatomeServiceContractStatus: liveInfo.omatomeServiceContractStatus !== '',
    basicsCorporationCreditAmount: Number(
      liveInfo.basicsCorporationCreditAmount.replace(/,/g, '')
    ),
    paymentExtensionCreditAmount: Number(
      liveInfo.paymentExtensionCreditAmount.replace(/,/g, '')
    ),
    corporationZipCode: liveInfo.corporationZipCode,
    corporationPrefectureCode: liveInfo.corporationPrefectureCode,
    corporationPrefectureName: liveInfo.corporationPrefectureName,
    corporationMunicipalities: liveInfo.corporationMunicipalities,
    corporationAddressBuildingName: liveInfo.corporationAddressBuildingName,
    corporationPhoneNumber: liveInfo.corporationPhoneNumber,
    corporationFaxNumber: liveInfo.corporationFaxNumber,
    corporationMailAddress: liveInfo.corporationMailAddress,
    representativeName: liveInfo.representativeName,
    representativeZipCode: liveInfo.representativeZipCode,
    representativePrefectureCode: liveInfo.representativePrefectureCode,
    representativePrefectureName: liveInfo.representativePrefectureName,
    representativeMunicipalities: liveInfo.representativeMunicipalities,
    representativeAddressBuildingName:
      liveInfo.representativeAddressBuildingName,
    representativePhoneNumber: liveInfo.representativePhoneNumber,
    representativeFaxNumber: liveInfo.representativeFaxNumber,
    representativeMobilePhoneNumber: liveInfo.representativeMobilePhoneNumber,
    eligibleBusinessNumber: liveInfo.eligibleBusinessNumber,
    publicSafetyCommittee: liveInfo.publicSafetyCommittee,
    issuanceDate: new Date(liveInfo.issuanceDate),
    antiqueBusinessLicenseNumber: liveInfo.antiqueBusinessLicenseNumber,
    antiqueName: liveInfo.antiqueName,
  };

  newLiveInfo.liveRegisterInfo = {
    transferdocumentsInfo: {
      assignmentDocumentDestinationbusinessBaseZipCode:
        liveInfo.assignmentDocumentDestinationbusinessBaseZipCode,
      assignmentdocumentDestinationPrefectureCode:
        liveInfo.assignmentdocumentDestinationPrefectureCode,
      assignmentdocumentDestinationPrefectureName:
        liveInfo.assignmentdocumentDestinationPrefectureName,
      assignmentdocumentDestinationMunicipalities:
        liveInfo.assignmentdocumentDestinationMunicipalities,
      assignmentDocumentDestinationAddressBuildingName:
        liveInfo.assignmentDocumentDestinationAddressBuildingName,
      assignmentdocumentDestinationPhoneNumber:
        liveInfo.assignmentdocumentDestinationPhoneNumber,
      assignmentdocumentDestinationFaxNumber:
        liveInfo.assignmentdocumentDestinationFaxNumber,
    },
    transferdocumentsconcludeInfo: {
      transferadress: liveInfo.assignmentDocumentDestinationOmatomeAddress,
      transfernumber: liveInfo.assignmentDocumentDestinationOmatomePhoneNumber,
      transferfax: liveInfo.assignmentDocumentDestinationOmatomeFaxNumber,
    },
    paymentAccount: {
      bankCode: liveInfo.payAccountInfoBankCode,
      bankName: liveInfo.payAccountInfoBankName,
      branchCode: liveInfo.payAccountInfoBranchCode,
      branchName: liveInfo.payAccountInfoBranchName,
      accountTypeKind: liveInfo.payAccountInfoAccountKind,
      accountNumber: liveInfo.payAccountInfoAccountNumber,
      accuntNameKana: liveInfo.payAccountInfoAccuntNameKana,
    },
    venuepaymentAccount: {
      bankName: liveInfo.payAccountOmatomeInfoBank,
      branchName: liveInfo.payAccountOmatomeInfoBranch,
      accountTypeKind: liveInfo.payAccountOmatomeInfoAccountKind,
      accountNumber: liveInfo.payAccountOmatomeInfoAccountNumber,
      accuntNameKana: liveInfo.payAccountOmatomeInfoAccuntNameKana,
    },
  };

  newLiveInfo.placeInfoList = liveInfo.placeInfoListRow.map((x) => {
    return {
      placeCode: x.placeCode,
      placeName: x.placeName,
      sessionWeekKind: x.sessionWeekKind,
      dataSendingDate: new Date(x.dataSendingDate),
      dataRegistrationDate: new Date(x.dataRegistrationDate),
      placeEntryKind: x.placeEntryKind,
      posNumber: x.PosNumber,
      posInfo: x.PosInfo,
      placeMemberKind: x.placeMemberKind,
      omatomePlaceFlag: x.omatomePlaceFlag !== '',
      statementDisplayPlaceName: x.statementDisplayPlaceName,
      omatomeKind: x.omatomeKind,
      omatomeAccountNumber: x.omatomeAccountNumber,
      entryPlaceMemo: x.entryPlaceMemo,
    };
  });
  newLiveInfo.placeDataSendingRemarks = liveInfo.placeDataSendingRemarks;

  return newLiveInfo;
};

const ScrMem0014LiveTab = (props: {
  contractBase: registrationRequest;
  setContractBaseValue: (contractBase: registrationRequest) => void;
  chengeTabDisableds: (tabDisableds: TabDisabledsModel) => void;
}) => {
  // router
  const { contractId, corporationId, logisticsBaseId } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const apiRef = useGridApiRef();

  // state
  const [changeHistory, setChangeHistory] = useState<any>([]);
  const [tooltips, setTooltips] = useState<GridTooltipsModel[]>([]);
  const [scrCom0011PopupIsOpen, setScrCom0011PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0011PopupData] = useState<ScrCom0011PopupModel>({
    screenId: 'SCR-MEM-0014',
  });
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckIsOpen, setChangeHistoryDateCheckIsOpen] =
    useState<boolean>(false);
  const [scrCom00032PopupIsOpen, setScrCom00032PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0014') === -1
  );

  const methods = useForm<LiveInfoModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    getValues,
    reset,
  } = methods;

  // 初期表示
  useEffect(() => {
    const initialize = async (
      contractId: string,
      corporationId: string,
      logisticsBaseId: string
    ) => {
      // リスト取得
      // コード管理マスタ情報取得
      const getCodeManagementMasterMultipleRequest = {
        codeIdList: [{ codeId: 'CDE-COM-0034' }, { codeId: 'CDE-COM-0035' }],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0034') {
          x.codeValueList.map((f) => {
            placeInfoListColumns[6].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0035') {
          x.codeValueList.map((f) => {
            placeInfoListColumns[9].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // ライブ情報取得
      const getLiveInfoRequest = {
        corporationId: corporationId,
        contractId: contractId,
      };
      const getLiveInfoResponse = await ScrMem0014GetLiveInfo(
        getLiveInfoRequest
      );

      // 画面にデータを設定
      const liveInfo = convertToLiveInfoModel(getLiveInfoResponse);
      reset(liveInfo);

      // ツールチップ設定
      const tooltips: GridTooltipsModel[] = [];
      tooltips.push({
        field: 'PosInfoNumber',
        tooltips: liveInfo.placeInfoListRow.map((x) => {
          const text: string[] = [];
          x.PosInfo.map((f) => {
            text.push('契約ID : ' + f.contractId);
          });
          return {
            id: x.id,
            text: text.join('\r'),
          };
        }),
      });
      setTooltips(tooltips);

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0014',
        tabId: 'B-25',
        masterId: corporationId,
        businessDate: user.taskDate,
      };
      const getChangeDateResponse = await ScrCom9999GetChangeDate(
        getChangeDateRequest
      );
      const chabngeHistory = getChangeDateResponse.changeExpectDateInfo.map(
        (x) => {
          return {
            value: x.changeHistoryNumber,
            displayValue: new Date(x.changeExpectDate).toLocaleDateString(),
          };
        }
      );
      setChangeHistory(chabngeHistory);

      // 参加制御
      props.contractBase.optionInfomation.map((x) => {
        if (x.serviceName === liveInfo.courseName) {
          // 基本情報タブ以外は非活性
          props.chengeTabDisableds({
            ScrMem0014BasicTab: false,
            ScrMem0014ServiceDiscountTab: false,
            ScrMem0014BillingTab: false,
            ScrMem0014LiveTab: true,
          });
        }
      });
    };

    const historyInitialize = async (
      applicationId: string,
      corporationId: string
    ) => {
      // リスト取得
      // コード管理マスタ情報取得
      const getCodeManagementMasterMultipleRequest = {
        codeIdList: [{ codeId: 'CDE-COM-0034' }, { codeId: 'CDE-COM-0035' }],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0034') {
          x.codeValueList.map((f) => {
            placeInfoListColumns[6].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0035') {
          x.codeValueList.map((f) => {
            placeInfoListColumns[9].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: getValues('changeHistoryNumber'),
      };
      const response = (
        await memApiClient.post('/scr-mem-9999/get-history-info', request)
      ).data;
      const liveInfo = convertToHistoryLiveInfoModel(
        response,
        getValues('changeHistoryNumber')
      );

      // 画面にデータを設定
      reset(liveInfo);

      // ツールチップ設定
      const tooltips: GridTooltipsModel[] = [];
      tooltips.push({
        field: 'PosInfoNumber',
        tooltips: liveInfo.placeInfoListRow.map((x) => {
          const text: string[] = [];
          x.PosInfo.map((f) => {
            text.push('契約ID : ' + f.contractId);
          });
          return {
            id: x.id,
            text: text.join('\r'),
          };
        }),
      });
      setTooltips(tooltips);
    };

    if (contractId === undefined) return;
    if (corporationId === undefined) return;
    if (logisticsBaseId === undefined) return;

    if (applicationId !== null) {
      historyInitialize(applicationId, corporationId);
      return;
    }

    initialize(contractId, corporationId, logisticsBaseId);
  }, [contractId, corporationId, logisticsBaseId, applicationId, reset]);

  /**
   * 一括参加ボタンクリック時のイベントハンドラ
   */
  const handleAllEntryClick = () => {
    const placeInfoListRow = getValues('placeInfoListRow');
    const newPlaceInfoListRow: placeInfoListRowModel[] = [];
    placeInfoListRow.map((x) => {
      const newPlaceInfo = x;
      // 参加区分が「参加制限中（3）」の場合、「参加（1）」に変更
      if (newPlaceInfo.placeEntryKind === '3') {
        newPlaceInfo.placeEntryKind = '1';
      }
      newPlaceInfoListRow.push(newPlaceInfo);
    });
  };

  /**
   * 一括参加制限ボタンクリック時のイベントハンドラ
   */
  const handleAllEntryLimitClick = () => {
    const placeInfoListRow = getValues('placeInfoListRow');
    const newPlaceInfoListRow: placeInfoListRowModel[] = [];
    placeInfoListRow.map((x) => {
      const newPlaceInfo = x;
      // 参加区分が参加（1）」の場合、「「参加制限中（3）」に変更
      if (newPlaceInfo.placeEntryKind === '1') {
        newPlaceInfo.placeEntryKind = '3';
      }
      newPlaceInfoListRow.push(newPlaceInfo);
    });
  };

  /**
   * 帳票出力ボタンクリック時のイベントハンドラ
   */
  const handleIconOutputReportClick = () => {
    setScrCom0011PopupIsOpen(true);
  };

  /**
   * CSV出力ボタンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    // CSV出力
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const fileName =
      'SCR-MEM-0014_' +
      user.employeeId +
      '_' +
      year +
      month +
      day +
      hours +
      minutes +
      '.csv';
    exportCsv(fileName, apiRef);
  };

  /**
   * 帳票選択ポップアップキャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancelScrCom0011Popup = () => {
    setScrCom0011PopupIsOpen(false);
  };

  /**
   * 帳票選択ポップアップ出力ボタンクリック時のイベントハンドラ
   */
  const handleConfirmScrCom0011Popup = (
    reportId: string,
    reportName: string,
    reportComment: string,
    defaultValue: string
  ) => {
    setScrCom0011PopupIsOpen(false);

    // 帳票出力
    const outputReportRequest = {
      screenId: 'SCR-MEM-0014',
      reportId: reportId,
      reportName: reportName,
      outputReportEmployeeId: user.employeeId,
      outputReportEmployeeName: user.employeeName,
      comment: reportComment,
      createReportParameterInfo: {
        corporationIdList: [corporationId],
        contractId: contractId,
      },
    };
    ScrMem9999OutputReport(outputReportRequest);
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations/' + corporationId);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = () => {
    methods.trigger();
    if (!methods.formState.isValid) return;
    setChangeHistoryDateCheckIsOpen(true);
  };

  /**
   * 確定ボタンクリック時（反映予定日整合性チェック後）のイベントハンドラ
   */
  const ChangeHistoryDateCheckUtilHandleConfirm = (checkFlg: boolean) => {
    setChangeHistoryDateCheckIsOpen(false);
    if (!checkFlg) return;
    // 登録内容確認ポップアップ表示
    setScrCom00032PopupIsOpen(true);

    setScrCom0032PopupData({
      errorList: [],
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0014',
          screenName: '契約情報詳細',
          tabId: 25,
          tabName: 'ライブ情報',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      changeExpectDate: getValues('changeExpectedDate'),
    });
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setScrCom00032PopupIsOpen(false);

    // ライブ情報登録
    const liveInfo = convertFromLiveInfo(getValues(), props.contractBase);

    // ライブ情報登録
    const request = Object.assign(liveInfo, {
      applicationEmployeeId: user.employeeId,
      changeExpectDate: new Date(getValues('changeExpectedDate')),
      registrationChangeMemo: registrationChangeMemo,
      screenId: 'SCR-MEM-0014',
      tabId: 'B-25',
    });
    await ScrMem0014EnterEnterthevenueBase(request);

    // 法人情報詳細基本情報へ登録
    props.setContractBaseValue(liveInfo);
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setScrCom00032PopupIsOpen(false);
  };

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    // 変更履歴情報取得API
    const request = {
      changeHistoryNumber: getValues('changeHistoryNumber'),
    };
    const response = (
      await memApiClient.post('/scr-mem-9999/get-history-info', request)
    ).data;
    const corporationBasic = convertToHistoryLiveInfoModel(
      response,
      getValues('changeHistoryNumber')
    );

    setIsChangeHistoryBtn(true);
    // 画面にデータを設定
    reset(corporationBasic);

    // 法人情報詳細基本情報へ登録
    const contractBase: any = response;
    delete contractBase.applicationEmployeeId;
    delete contractBase.changeExpectDate;
    delete contractBase.registrationChangeMemo;
    delete contractBase.screenId;
    delete contractBase.tabId;
    props.setContractBaseValue(contractBase);

    // ライブ情報タブ以外は非活性
    props.chengeTabDisableds({
      ScrMem0014BasicTab: true,
      ScrMem0014ServiceDiscountTab: true,
      ScrMem0014BillingTab: true,
      ScrMem0014LiveTab: false,
    });
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* ライブ基本情報セクション */}
            <Section name='ライブ基本情報'>
              <RowStack>
                <ColStack>
                  <RowStack>
                    <ColStack>
                      <RowStack>
                        <ColStack>
                          <TextField
                            label='法人ID'
                            name='corporationId'
                            size='s'
                            readonly
                          />
                        </ColStack>
                        <ColStack>
                          <TextField
                            label='法人名称'
                            name='corporationName'
                            size='m'
                            readonly
                          />
                        </ColStack>
                      </RowStack>
                      <RowStack>
                        <ColStack>
                          <TextField
                            label='契約ID'
                            name='contractId'
                            size='s'
                            readonly
                          />
                        </ColStack>
                        <ColStack>
                          <TextField
                            label='コース'
                            name='courseName'
                            size='m'
                            readonly
                          />
                        </ColStack>
                        <ColStack>
                          <TextField
                            label='おまとめサービス契約状況'
                            name='omatomeServiceContractStatus'
                            size='s'
                            readonly
                          />
                        </ColStack>
                      </RowStack>
                      <RowStack>
                        <ColStack>
                          <TextField
                            label='基本法人与信額'
                            name='basicsCorporationCreditAmount'
                            size='s'
                            readonly
                          />
                        </ColStack>
                        <ColStack>
                          <TextField
                            label='支払延長与信額'
                            name='paymentExtensionCreditAmount'
                            size='s'
                            readonly
                          />
                        </ColStack>
                      </RowStack>
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='住所'
                        name='corporationAddress'
                        size='l'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='TEL'
                        name='corporationPhoneNumber'
                        size='s'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='FAX'
                        name='corporationFaxNumber'
                        size='s'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='メールアドレス'
                        name='corporationMailAddress'
                        size='l'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='代表者名'
                        name='representativeName'
                        size='m'
                        readonly
                      />
                      <TextField
                        label='住所'
                        name='representativeAddress'
                        size='l'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='TEL'
                        name='representativePhoneNumber'
                        size='s'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='FAX'
                        name='representativeFaxNumber'
                        size='s'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='携帯電話'
                        name='representativeMobilePhoneNumber'
                        size='m'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <ContentsBox>
                        <MarginBox mt={1} mb={1}>
                          <TextField
                            label='適格事業者番号'
                            name='eligibleBusinessNumber'
                            size='s'
                            readonly
                          />
                        </MarginBox>
                      </ContentsBox>
                    </ColStack>
                    <ColStack>
                      <ContentsBox>
                        <MarginBox mt={1} mb={1}>
                          <RowStack>
                            <ColStack>
                              <TextField
                                label='公安委員会'
                                name='publicSafetyCommittee'
                                size='s'
                                readonly
                              />
                              <TextField
                                label='古物商許可番号'
                                name='antiqueBusinessLicenseNumber'
                                size='s'
                                readonly
                              />
                            </ColStack>
                            <ColStack>
                              <TextField
                                label='交付年月日'
                                name='issuanceDate'
                                size='m'
                                readonly
                              />
                              <TextField
                                label='古物名義'
                                name='antiqueName'
                                size='m'
                                readonly
                              />
                            </ColStack>
                          </RowStack>
                        </MarginBox>
                      </ContentsBox>
                    </ColStack>
                  </RowStack>
                </ColStack>
              </RowStack>
            </Section>
            {/* ライブ登録情報セクション */}
            <Section name='ライブ登録情報'>
              <RowStack>
                <ColStack>
                  {/* 《譲渡書類送付先情報》 */}
                  <CaptionLabel text='《譲渡書類送付先情報》' />
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='住所'
                        name='assignmentdocumentDestinationAddress'
                        size='l'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='TEL'
                        name='assignmentdocumentDestinationPhoneNumber'
                        size='m'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='FAX'
                        name='assignmentdocumentDestinationFaxNumber'
                        size='m'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  {/* 《譲渡書類送付先情報（おまとめ会場用）》 */}
                  <MarginBox justifyContent='left' mt={3}>
                    <CaptionLabel text='《譲渡書類送付先情報（おまとめ会場用）》' />
                  </MarginBox>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='住所'
                        name='assignmentDocumentDestinationOmatomeAddress'
                        size='l'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='TEL'
                        name='assignmentDocumentDestinationOmatomePhoneNumber'
                        size='m'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='FAX'
                        name='assignmentDocumentDestinationOmatomeFaxNumber'
                        size='m'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  {/* 《支払口座》 */}
                  <MarginBox justifyContent='left' mt={3}>
                    <CaptionLabel text='《支払口座》' />
                  </MarginBox>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='銀行コード'
                        name='payAccountInfoBank'
                        size='m'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='支店コード'
                        name='payAccountInfoBranch'
                        size='m'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='種別'
                        name='payAccountInfoAccountKind'
                        size='s'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='口座番号'
                        name='payAccountInfoAccountNumber'
                        size='s'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='口座名義'
                        name='payAccountInfoAccuntNameKana'
                        size='m'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  {/* 《会場向け振込口座（おまとめ用）》 */}
                  <MarginBox justifyContent='left' mt={3}>
                    <CaptionLabel text='《会場向け振込口座（おまとめ用）》' />
                  </MarginBox>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='銀行コード'
                        name='payAccountOmatomeInfoBank'
                        size='m'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='支店コード'
                        name='payAccountOmatomeInfoBranch'
                        size='m'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='種別'
                        name='payAccountOmatomeInfoAccountKind'
                        size='s'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='口座番号'
                        name='payAccountOmatomeInfoAccountNumber'
                        size='s'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='口座名義'
                        name='payAccountOmatomeInfoAccuntNameKana'
                        size='m'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                </ColStack>
              </RowStack>
            </Section>
            {/* 会場情報セクション */}
            <Section
              name='会場情報'
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  <MarginBox mr={10} gap={2}>
                    <PrimaryButton onClick={handleAllEntryClick}>
                      一括参加
                    </PrimaryButton>
                    <PrimaryButton onClick={handleAllEntryLimitClick}>
                      一括参加制限
                    </PrimaryButton>
                  </MarginBox>
                  <AddButton onClick={handleIconOutputReportClick}>
                    帳票出力
                  </AddButton>
                  <AddButton onClick={handleIconOutputCsvClick}>
                    CSV出力
                  </AddButton>
                </MarginBox>
              }
            >
              <DataGrid
                columns={placeInfoListColumns}
                rows={getValues('placeInfoListRow')}
                tooltips={tooltips}
                apiRef={apiRef}
                disabled={isReadOnly[0]}
              />
            </Section>
            {/* 会場データ送付時備考セクション */}
            <Section name='会場データ送付時備考'>
              <RowStack>
                <ColStack>
                  <Textarea
                    name='placeDataSendingRemarks'
                    size='l'
                    maxRows={3}
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
                  {changeHistory.length <= 0 || isReadOnly[0] ? (
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
            <ConfirmButton disable={isReadOnly[0]} onClick={handleConfirm}>
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {scrCom00032PopupIsOpen ? (
        <ScrCom0032Popup
          isOpen={scrCom00032PopupIsOpen}
          data={scrCom0032PopupData}
          handleRegistConfirm={handlePopupConfirm}
          handleApprovalConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
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

      {/* 帳票選択ポップアップ */}
      {scrCom0011PopupIsOpen ? (
        <ScrCom0011Popup
          isOpen={scrCom0011PopupIsOpen}
          data={scrCom0011PopupData}
          handleCancel={handleCancelScrCom0011Popup}
          handleConfirm={handleConfirmScrCom0011Popup}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrMem0014LiveTab;
