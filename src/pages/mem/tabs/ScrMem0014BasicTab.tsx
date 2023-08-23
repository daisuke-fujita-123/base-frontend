import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

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

import { CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { CaptionLabel, WarningLabel } from 'controls/Label';
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
} from 'apis/com/ScrCom9999Api';
import {
  LogisticsBase,
  registrationRequest,
  ScrMem0014ContractBase,
  ScrMem0014ContractBaseRequest,
  ScrMem0014GetContractInfo,
  ScrMem0014GetContractInfoResponse,
  ScrMem0014GetLogisticsBaseInfo,
} from 'apis/mem/ScrMem0014Api';
import {
  BusinessInfo,
  ScrMem9999GetBusinessInfo,
  ScrMem9999GetCodeValue,
  ScrMem9999GetCorpBasicInfo,
} from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

import { TabDisabledsModel } from '../ScrMem0014Page';

/**
 * 基本情報データモデル
 */
interface ContractInfoModel {
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
  // 指定事業拠点郵便番号
  businessBaseZipCode: string;
  // 指定事業拠点都道府県
  businessBasePrefectureName: string;
  // 指定事業拠点市区町村
  businessBaseMunicipalities: string;
  // 指定事業拠点番地・号・建物名など
  businessBaseAddressBuildingName: string;
  // 指定事業拠点TEL
  businessBasePhoneNumber: string;
  // 指定事業拠点担当者
  businessBaseStaffName: string;
  // 指定事業拠点担当者連絡先
  businessBaseStaffContactPhoneNumber: string;
  // 明細送付先物流拠点ID
  detailsDestinationLogisticsBaseId: string;
  // 明細送付先物流拠点/FAX
  detailsDestinationLogisticsBaseFax: string;
  // 明細送付先物流拠点/メールアドレス
  detailsDestinationLogisticsBaseMailAddress: string;
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
  // 成約明細書送付先FAX番号
  purchaseDestinationFaxNumber: string;
  // 成約明細書送付先メールアドレス
  purchaseDestinationMailAddress: string;
  // 落札明細書送付先FAX番号
  bidDestinationDocFaxNumber: string;
  // 落札明細書送付先メールアドレス
  bidDestinationDocMailAddress: string;
  // 特別明細送付先送信区分
  specialDetailsDestinationSendKind: string;
  // 四輪自動輸送フラグ
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
  preemptionMemberFlag: string;
  // 成約明細枝番送信フラグ
  purchaseBranchNumberSendFlag: string;
  // A出品店別FAX番号
  AexhibitshopFaxNumber: string;
  // A出品店別メールアドレス
  AexhibitshopMailAddress: string;
  // A出品店別送信区分
  AexhibitshopSendKind: string;
  // 会員メモ
  memberMemo: string;
  // 法人情報
  corporationInfo: CorporationInfo;

  // 変更予約情報
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectedDate: string;
}

// 法人情報
interface CorporationInfo {
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
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  bidSegmentCodeSelectValues: SelectValue[];
  bidMakerCodeSelectValues: SelectValue[];
  businessBaseSelectValues: SelectValue[];
  logisticsBaseSelectValues: SelectValue[];
  prefectureCodeSelectValues: SelectValue[];
  shippingMethodSlipKindSelectValues: SelectValue[];
  sendKindSelectValues: SelectValue[];
  opehotPhonekindSelectValues: SelectValue[];
  memberInformationSelectValues: SelectValue[];
  negotiationsLimitKindSelectValues: SelectValue[];
  commonMemberKindSelectValues: SelectValue[];
}

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  contractId: yup.string().label('契約ID').max(10).half().required(),
  bidSegmentCode: yup.string().label('落札セグメント'),
  bidMakerCode: yup.string().label('メーカーCD'),
  specifyBusinessBaseId: yup.string().label('指定事業拠点').required(),
  detailsDestinationLogisticsBaseId: yup
    .string()
    .label('明細送付先拠点')
    .required(),
  assignmentDocumentDestinationBusinessBaseSyncroFlag: yup
    .string()
    .label('事業拠点コピー'),
  assignmentDocumentDestinationZipCode: yup
    .string()
    .label('郵便番号')
    .max(8)
    .half(),
  assignmentDocumentDestinationPrefectureCode: yup.string().label('都道府県'),
  assignmentDocumentDestinationMunicipalities: yup
    .string()
    .label('市区町村')
    .max(30),
  assignmentDocumentDestinationAddressBuildingName: yup
    .string()
    .label('番地・号・建物名など')
    .max(30),
  assignmentDocumentDestinationPhoneNumber: yup
    .string()
    .label('TEL')
    .max(15)
    .phone(),
  assignmentDocumentDestinationFaxNumber: yup
    .string()
    .label('FAX')
    .max(15)
    .phone(),
  assignmentDocumentDestinationMailAddress: yup
    .string()
    .label('メールアドレス')
    .max(30)
    .email(),
  assignmentDocumentDestinationShippingMethodSlipKind: yup
    .string()
    .label('伝票種類')
    .required(),
  assignmentDocumentDestinationCorporationName: yup
    .string()
    .label('法人名称')
    .max(30)
    .required(),
  assignmentDocumentDestinationAddressee: yup.string().label('宛名').max(15),
  purchaseDestinationFaxNumber: yup
    .string()
    .label('成約明細書/FAX')
    .max(15)
    .phone(),
  purchaseDestinationMailAddress: yup
    .string()
    .label('成約明細書/メールアドレス')
    .max(30)
    .half()
    .email(),
  bidDestinationDocFaxNumber: yup
    .string()
    .label('落札明細書/FAX')
    .max(15)
    .phone(),
  bidDestinationDocMailAddress: yup
    .string()
    .label('落札明細書/メールアドレス')
    .max(30)
    .half()
    .email(),
  specialDetailsDestinationSendKind: yup.string().label('送信区分'),
  tvaaAutomaticTransportKind: yup.string().label('四輪自動輸送区分'),
  opehotPhonekind: yup.string().label('オペホットTEL―1'),
  opehotPhoneNumber: yup.string().label('オペホットTEL―2').max(13).phone(),
  opehotMessage: yup.string().label('オペホット―MSG').max(8),
  opehotEntryKind: yup.string().label('オペホット―KBN'),
  opehotMemberInformationKind: yup.string().label('会員情報'),
  negotiationsLimitKind: yup.string().label('商談制限'),
  negotiationsStaffName: yup.string().label('商談担当'),
  negotiationsStaffMobileNumber: yup
    .string()
    .label('携帯　TEL')
    .max(15)
    .phone(),
  negotiationsOperationMemo: yup.string().label('運営メモ').max(20),
  collaborationCommonMemberKind: yup.string().label('共通会員'),
  leaseKind: yup.string().label('リース区分'),
  preemptionMemberFlag: yup.string().label('先取り会員フラグ'),
  purchaseBranchNumberSendFlag: yup.string().label('成約明細枝番送信フラグ'),
  AexhibitshopFaxNumber: yup.string().label('A出品店別FAX番号').max(15).phone(),
  AexhibitshopMailAddress: yup
    .string()
    .label('A出品店別メールアドレス')
    .max(254)
    .half()
    .email(),
  AexhibitshopSendKind: yup.string().label('A出品店別送信区分'),
};

/**
 * 検索条件列定義
 */
const logisticsBaseColumns: GridColDef[] = [
  {
    field: 'logisticsBase',
    headerName: '物流事業拠点',
    size: 'l',
  },
  {
    field: 'logisticsBaseZipCode',
    headerName: '郵便番号',
    size: 'm',
  },
  {
    field: 'prefectureName',
    headerName: '都道府県',
    size: 'm',
  },
  {
    field: 'logisticsBaseMunicipalities',
    headerName: '市区町村',
    size: 'm',
  },
  {
    field: 'logisticsBaseAddressBuildingName',
    headerName: '番地・号・建物名など',
    size: 'l',
  },

  {
    field: 'logisticsBasePhoneNumber',
    headerName: 'TEL',
    size: 'm',
  },
  {
    field: 'logisticsBaseFaxNumber',
    headerName: 'FAX',
    size: 'm',
  },
];

/**
 * 物流拠点行データモデル
 */
interface LogisticsBaseRowModel {
  // internalId
  id: string;
  // 物流拠点
  logisticsBase: string;
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

/**
 * リスト初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  bidSegmentCodeSelectValues: [],
  bidMakerCodeSelectValues: [],
  businessBaseSelectValues: [],
  logisticsBaseSelectValues: [],
  prefectureCodeSelectValues: [],
  shippingMethodSlipKindSelectValues: [],
  sendKindSelectValues: [],
  opehotPhonekindSelectValues: [],
  memberInformationSelectValues: [],
  negotiationsLimitKindSelectValues: [],
  commonMemberKindSelectValues: [],
};

/**
 * 基本情報初期データ
 */
const initialValues: ContractInfoModel = {
  corporationId: '',
  corporationName: '',
  contractId: '',
  idIssuanceDate: '',
  bidSegmentCode: '',
  bidMakerCode: '',
  specifyBusinessBaseId: '',
  businessBaseZipCode: '',
  businessBasePrefectureName: '',
  businessBaseMunicipalities: '',
  businessBaseAddressBuildingName: '',
  businessBasePhoneNumber: '',
  businessBaseStaffName: '',
  businessBaseStaffContactPhoneNumber: '',
  detailsDestinationLogisticsBaseId: '',
  detailsDestinationLogisticsBaseFax: '',
  detailsDestinationLogisticsBaseMailAddress: '',
  assignmentDocumentDestinationBusinessBaseSyncroFlag: true,
  assignmentDocumentDestinationZipCode: '',
  assignmentDocumentDestinationPrefectureCode: '',
  assignmentDocumentDestinationMunicipalities: '',
  assignmentDocumentDestinationAddressBuildingName: '',
  assignmentDocumentDestinationPhoneNumber: '',
  assignmentDocumentDestinationFaxNumber: '',
  assignmentDocumentDestinationMailAddress: '',
  assignmentDocumentDestinationShippingMethodSlipKind: '',
  assignmentDocumentDestinationCorporationName: '',
  assignmentDocumentDestinationAddressee: '',
  purchaseDestinationFaxNumber: '',
  purchaseDestinationMailAddress: '',
  bidDestinationDocFaxNumber: '',
  bidDestinationDocMailAddress: '',
  specialDetailsDestinationSendKind: '',
  tvaaAutomaticTransportKind: '',
  opehotPhonekind: '',
  opehotPhoneNumber: '',
  opehotMessage: '',
  opehotEntryKind: '',
  opehotMemberInformationKind: '',
  negotiationsLimitKind: '',
  negotiationsStaffName: '',
  negotiationsStaffMobileNumber: '',
  negotiationsOperationMemo: '',
  collaborationCommonMemberKind: '',
  leaseKind: '',
  preemptionMemberFlag: '',
  purchaseBranchNumberSendFlag: '',
  AexhibitshopFaxNumber: '',
  AexhibitshopMailAddress: '',
  AexhibitshopSendKind: '',
  memberMemo: '',
  corporationInfo: {
    corporationId: '',
    corporationNameKana: '',
    corporationZipCode: '',
    corporationPrefectureCode: '',
    corporationMunicipalities: '',
    corporationAddressBuildingName: '',
    corporationPhoneNumber: '',
  },
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
    section: '基本情報',
    fields: [
      'contractId',
      'bidSegmentCode',
      'bidMakerCode',
      'specifyBusinessBaseId',
      'businessBaseZipCode',
      'businessBasePrefectureName',
      'businessBaseMunicipalities',
      'businessBaseAddressBuildingName',
      'businessBasePhoneNumber',
      'businessBaseStaffName',
      'businessBaseStaffContactPhoneNumber',
      'detailsDestinationLogisticsBaseId',
      'detailsDestinationLogisticsBaseFax',
      'detailsDestinationLogisticsBaseMailAddress',
      'assignmentDocumentDestinationBusinessBaseSyncroFlag',
      'assignmentDocumentDestinationZipCode',
      'assignmentDocumentDestinationPrefectureCode',
      'assignmentDocumentDestinationMunicipalities',
      'assignmentDocumentDestinationAddressBuildingName',
      'assignmentDocumentDestinationPhoneNumber',
      'assignmentDocumentDestinationFaxNumber',
      'assignmentDocumentDestinationMailAddress',
      'assignmentDocumentDestinationShippingMethodSlipKind',
      'assignmentDocumentDestinationCorporationName',
      'assignmentDocumentDestinationAddressee',
      'purchaseDestinationFaxNumber',
      'purchaseDestinationMailAddress',
      'bidDestinationDocFaxNumber',
      'bidDestinationDocMailAddress',
      'specialDetailsDestinationSendKind',
    ],
    name: [
      '契約ID',
      '落札セグメント',
      'メーカーCD',
      '契約情報/指定事業拠点',
      '契約情報/郵便番号',
      '契約情報/都道府県',
      '契約情報/市区町村',
      '契約情報/番地・号・建物名など',
      '契約情報/TEL',
      '契約情報/担当者',
      '契約情報/担当者連絡先',
      '明細送付先拠点',
      '明細送付先拠点/FAX',
      '明細送付先拠点/メールアドレス',
      '譲渡書類送付先/事業拠点コピー',
      '譲渡書類送付先/郵便番号',
      '譲渡書類送付先/都道府県',
      '譲渡書類送付先/市区町村',
      '譲渡書類送付先/番地・号・建物名など',
      '譲渡書類送付先/TEL',
      '譲渡書類送付先/FAX',
      '譲渡書類送付先/メールアドレス',
      '譲渡書類送付先/伝票種類',
      '譲渡書類送付先/法人名称',
      '譲渡書類送付先/宛名',
      '成約明細書/FAX',
      '成約明細書/メールアドレス',
      '落札明細書/FAX',
      '落札明細書/メールアドレス',
      '送信区分',
    ],
  },
  {
    section: '連携用',
    fields: [
      'tvaaAutomaticTransportKind',
      'opehotPhonekind',
      'opehotPhoneNumber',
      'opehotMessage',
      'opehotEntryKind',
      'opehotMemberInformationKind',
      'negotiationsLimitKind',
      'negotiationsStaffName',
      'negotiationsStaffMobileNumber',
      'negotiationsOperationMemo',
      'collaborationCommonMemberKind',
      'leaseKind',
      'preemptionMemberFlag',
      'purchaseBranchNumberSendFlag',
      'AexhibitshopFaxNumber',
      'AexhibitshopMailAddress',
      'AexhibitshopSendKind',
    ],
    name: [
      '四輪自動輸送区分',
      'オペホットTEL―１',
      'オペホットTEL―２',
      'オペホット―MSG',
      'オペホット―KBN',
      '会員情報',
      '商談制限',
      '商談担当',
      '携帯　TEL',
      '運営メモ',
      '共通会員',
      'リース区分',
      '先取り会員フラグ',
      '成約明細枝番送信フラグ',
      'A出品店別FAX番号',
      'A出品店別メールアドレス',
      'A出品店別送信区分',
    ],
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
 * 物流拠点情報取得APIから物流拠点行データモデルへの変換
 */
const convertToLogisticsBaseRow = (
  logisticsBaseList: LogisticsBase[]
): LogisticsBaseRowModel[] => {
  const LogisticsBaseRow: LogisticsBaseRowModel[] = [];
  logisticsBaseList.map((x) => {
    LogisticsBaseRow.push({
      id: x.logisticsBaseId,
      logisticsBase: x.logisticsBaseId + '　' + x.logisticsBaseName,
      logisticsBaseId: x.logisticsBaseId,
      logisticsBaseName: x.logisticsBaseName,
      logisticsBaseZipCode: x.logisticsBaseZipCode,
      prefectureName: x.prefectureName,
      logisticsBaseMunicipalities: x.logisticsBaseMunicipalities,
      logisticsBaseAddressBuildingName: x.logisticsBaseAddressBuildingName,
      logisticsBasePhoneNumber: x.logisticsBasePhoneNumber,
      logisticsBaseFaxNumber: x.logisticsBaseFaxNumber,
      logisticsBaseMailAddress: x.logisticsBaseMailAddress,
    });
  });
  return LogisticsBaseRow;
};

/**
 * 契約基本情報取得APIから基本情報データモデルへの変換
 */
const convertToContractInfoModel = (
  response: ScrMem0014GetContractInfoResponse,
  businessInfo: BusinessInfo[],
  logisticsBaseRow: LogisticsBaseRowModel[],
  corporationInfo: CorporationInfo,
  changeHistoryNumber: string,
  changeExpectedDate: string
): ContractInfoModel => {
  const businessBase = businessInfo.find(
    (x) => x.businessBaseId === response.specifyBusinessBaseId
  );
  const detailsDestinationLogisticsBase = logisticsBaseRow.find(
    (x) => x.id === response.detailsDestinationLogisticsBaseId
  );
  return {
    corporationId: response.corporationId,
    corporationName: response.corporationName,
    contractId: response.contractId,
    idIssuanceDate: new Date(response.idIssuanceDate).toLocaleDateString(),
    bidSegmentCode: response.bidSegmentCode,
    bidMakerCode: response.bidMakerCode,
    specifyBusinessBaseId: response.specifyBusinessBaseId,
    businessBaseZipCode:
      businessBase === undefined ? '' : businessBase.businessBaseZipCode,
    businessBasePrefectureName:
      businessBase === undefined ? '' : businessBase.businessBasePrefectureName,
    businessBaseMunicipalities:
      businessBase === undefined ? '' : businessBase.businessBaseMunicipalities,
    businessBaseAddressBuildingName:
      businessBase === undefined
        ? ''
        : businessBase.businessBaseAddressBuildingName,
    businessBasePhoneNumber:
      businessBase === undefined ? '' : businessBase.businessBasePhoneNumber,
    businessBaseStaffName:
      businessBase === undefined ? '' : businessBase.businessBaseStaffName,
    businessBaseStaffContactPhoneNumber:
      businessBase === undefined
        ? ''
        : businessBase.businessBaseStaffContactPhoneNumber,
    detailsDestinationLogisticsBaseId:
      response.detailsDestinationLogisticsBaseId,
    detailsDestinationLogisticsBaseFax:
      detailsDestinationLogisticsBase === undefined
        ? ''
        : detailsDestinationLogisticsBase.logisticsBaseFaxNumber,
    detailsDestinationLogisticsBaseMailAddress:
      detailsDestinationLogisticsBase === undefined
        ? ''
        : detailsDestinationLogisticsBase.logisticsBaseMailAddress,
    assignmentDocumentDestinationBusinessBaseSyncroFlag:
      response.assignmentDocumentDestinationBusinessBaseSyncroFlag,
    assignmentDocumentDestinationZipCode:
      response.assignmentDocumentDestinationZipCode,
    assignmentDocumentDestinationPrefectureCode:
      response.assignmentDocumentDestinationPrefectureCode,
    assignmentDocumentDestinationMunicipalities:
      response.assignmentDocumentDestinationMunicipalities,
    assignmentDocumentDestinationAddressBuildingName:
      response.assignmentDocumentDestinationAddressBuildingName,
    assignmentDocumentDestinationPhoneNumber:
      response.assignmentDocumentDestinationPhoneNumber,
    assignmentDocumentDestinationFaxNumber:
      response.assignmentDocumentDestinationFaxNumber,
    assignmentDocumentDestinationMailAddress:
      response.assignmentDocumentDestinationMailAddress,
    assignmentDocumentDestinationShippingMethodSlipKind:
      response.assignmentDocumentDestinationShippingMethodSlipKind,
    assignmentDocumentDestinationCorporationName:
      response.assignmentDocumentDestinationCorporationName,
    assignmentDocumentDestinationAddressee:
      response.assignmentDocumentDestinationAddressee,
    purchaseDestinationFaxNumber: response.purchaseDestinationFaxNumber,
    purchaseDestinationMailAddress: response.purchaseDestinationMailAddress,
    bidDestinationDocFaxNumber: response.bidDestinationDocFaxNumber,
    bidDestinationDocMailAddress: response.bidDestinationDocMailAddress,
    specialDetailsDestinationSendKind:
      response.specialDetailsDestinationSendKind,
    tvaaAutomaticTransportKind: response.tvaaAutotransFlag ? '5' : 'N',
    opehotPhonekind: response.opehotPhonekind,
    opehotPhoneNumber: response.opehotPhoneNumber,
    opehotMessage: response.opehotMessage,
    opehotEntryKind: response.opehotEntryKind,
    opehotMemberInformationKind: response.opehotMemberInformationKind,
    negotiationsLimitKind: response.negotiationsLimitKind,
    negotiationsStaffName: response.negotiationsStaffName,
    negotiationsStaffMobileNumber: response.negotiationsStaffMobileNumber,
    negotiationsOperationMemo: response.negotiationsOperationMemo,
    collaborationCommonMemberKind: response.collaborationCommonMemberKind,
    leaseKind: response.leaseKind ? '1' : '0',
    preemptionMemberFlag: response.preemptionMemberFlag ? '1' : '0',
    purchaseBranchNumberSendFlag: response.purchaseBranchNumberSendFlag
      ? '1'
      : '0',
    AexhibitshopFaxNumber: response.AexhibitshopFaxNumber,
    AexhibitshopMailAddress: response.AexhibitshopMailAddress,
    AexhibitshopSendKind: response.AexhibitshopSendKind,
    memberMemo: response.memberMemo,
    corporationInfo: {
      corporationId: corporationInfo.corporationId,
      corporationNameKana: corporationInfo.corporationNameKana,
      corporationZipCode: corporationInfo.corporationZipCode,
      corporationPrefectureCode: corporationInfo.corporationPrefectureCode,
      corporationMunicipalities: corporationInfo.corporationMunicipalities,
      corporationAddressBuildingName:
        corporationInfo.corporationAddressBuildingName,
      corporationPhoneNumber: corporationInfo.corporationPhoneNumber,
    },

    changeHistoryNumber: changeHistoryNumber,
    changeExpectedDate: changeExpectedDate,
  };
};

/**
 * 変更履歴情報取得APIから基本情報データモデルへの変換
 */
const convertToHistoryContractInfoModel = (
  response: registrationRequest,
  changeHistoryNumber: string
): ContractInfoModel => {
  const contractInfo = response.contractInfo[0];
  return {
    corporationId: response.corporationId,
    corporationName: response.liveBaseInfo.corporationName,
    contractId: response.contractId,
    idIssuanceDate: response.idIssuanceDate.toLocaleDateString(),
    bidSegmentCode: response.bidSegmentCode,
    bidMakerCode: response.bidMakerCode,
    specifyBusinessBaseId: contractInfo.specifyBusinessBaseId,
    businessBaseZipCode: contractInfo.specifyBusinessBaseZipCode,
    businessBasePrefectureName: contractInfo.specifyBusinessBasePrefectureCode,
    businessBaseMunicipalities: contractInfo.specifyBusinessBaseMunicipalities,
    businessBaseAddressBuildingName:
      contractInfo.specifyBusinessBaseAddressBuildingName,
    businessBasePhoneNumber: contractInfo.specifyBusinessBasePhoneNumber,
    businessBaseStaffName: contractInfo.specifyBusinessBaseStaffName,
    businessBaseStaffContactPhoneNumber:
      contractInfo.specifyBusinessBaseStaffContactPhoneNumber,
    detailsDestinationLogisticsBaseId:
      contractInfo.detailsDestinationLogisticsBaseId,
    detailsDestinationLogisticsBaseFax:
      contractInfo.detailsDestinationLogisticsBaseFaxNumber,
    detailsDestinationLogisticsBaseMailAddress:
      contractInfo.detailsDestinationLogisticsBaseMailAddress,
    assignmentDocumentDestinationBusinessBaseSyncroFlag:
      response.assignmentDocumentDestinationBusinessBaseSyncroFlag,
    assignmentDocumentDestinationZipCode:
      response.assignmentDocumentDestinationZipCode,
    assignmentDocumentDestinationPrefectureCode:
      response.assignmentDocumentDestinationPrefectureCode,
    assignmentDocumentDestinationMunicipalities:
      response.assignmentDocumentDestinationMunicipalities,
    assignmentDocumentDestinationAddressBuildingName:
      response.assignmentDocumentDestinationAddressBuildingName,
    assignmentDocumentDestinationPhoneNumber:
      response.assignmentDocumentDestinationPhoneNumber,
    assignmentDocumentDestinationFaxNumber:
      response.assignmentDocumentDestinationFaxNumber,
    assignmentDocumentDestinationMailAddress:
      response.liveBaseInfo.corporationMailAddress,
    assignmentDocumentDestinationShippingMethodSlipKind:
      response.assignmentDocumentDestinationShippingMethodSlipKind,
    assignmentDocumentDestinationCorporationName:
      response.assignmentDocumentDestinationCorporationName,
    assignmentDocumentDestinationAddressee:
      response.assignmentDocumentDestinationAddressee,
    purchaseDestinationFaxNumber: response.purchaseDestinationFaxNumber,
    purchaseDestinationMailAddress: response.purchaseDestinationMailAddress,
    bidDestinationDocFaxNumber: response.bidDestinationDocFaxNumber,
    bidDestinationDocMailAddress: response.bidDestinationDocMailAddress,
    specialDetailsDestinationSendKind:
      response.specialDetailsDestinationSendKind,
    tvaaAutomaticTransportKind: response.tvaaAutomaticTransportKind,
    opehotPhonekind: response.opehotPhonekind,
    opehotPhoneNumber: response.opehotPhoneNumber,
    opehotMessage: response.opehotMessage,
    opehotEntryKind: response.opehotEntryKind,
    opehotMemberInformationKind: response.opehotMemberInformationKind,
    negotiationsLimitKind: response.negotiationsLimitKind,
    negotiationsStaffName: response.negotiationsStaffName,
    negotiationsStaffMobileNumber: response.negotiationsStaffMobileNumber,
    negotiationsOperationMemo: response.negotiationsOperationMemo,
    collaborationCommonMemberKind: response.collaborationCommonMemberKind,
    leaseKind: response.leaseKind,
    preemptionMemberFlag: response.preemptionMemberFlag ? '1' : '0',
    purchaseBranchNumberSendFlag: response.purchaseBranchNumberSendFlag
      ? '1'
      : '0',
    AexhibitshopFaxNumber: response.AexhibitshopFaxNumber,
    AexhibitshopMailAddress: response.AexhibitshopMailAddress,
    AexhibitshopSendKind: response.AexhibitshopSendKind,
    memberMemo: response.memberMemo,
    corporationInfo: response.corporationInfo,

    changeHistoryNumber: changeHistoryNumber,
    changeExpectedDate: '',
  };
};

/**
 * 法人情報詳細基本情報への変換
 */
const convertFromContractBase = (
  contractInfo: ContractInfoModel,
  contractBase: registrationRequest,
  selectValues: SelectValuesModel
): registrationRequest => {
  const newLiveInfo: registrationRequest = Object.assign(contractBase);

  newLiveInfo.corporationId = contractInfo.corporationId;
  newLiveInfo.contractId = contractInfo.contractId;
  newLiveInfo.idIssuanceDate = new Date(contractInfo.idIssuanceDate);
  newLiveInfo.bidSegmentCode = contractInfo.bidSegmentCode;
  newLiveInfo.bidMakerCode = contractInfo.bidMakerCode;

  // 指定事業拠点名取得
  const businessBaseSelectValues = selectValues.businessBaseSelectValues.find(
    (x) => x.value === contractInfo.specifyBusinessBaseId
  );
  const specifyBusinessBaseName =
    businessBaseSelectValues === undefined
      ? ''
      : businessBaseSelectValues?.displayValue;

  // 明細送付先物流拠点名
  const logisticsBaseSelectValues = selectValues.logisticsBaseSelectValues.find(
    (x) => x.value === contractInfo.specifyBusinessBaseId
  );
  const detailsDestinationLogisticsBaseName =
    logisticsBaseSelectValues === undefined
      ? ''
      : logisticsBaseSelectValues?.displayValue;

  newLiveInfo.contractInfo = [
    {
      specifyBusinessBaseId: contractInfo.specifyBusinessBaseId,
      specifyBusinessBaseName: specifyBusinessBaseName.replace(
        contractInfo.specifyBusinessBaseId + '　',
        ''
      ),
      specifyBusinessBaseZipCode: contractInfo.businessBaseZipCode,
      specifyBusinessBasePrefectureCode:
        contractInfo.businessBasePrefectureName,
      specifyBusinessBaseMunicipalities:
        contractInfo.businessBaseMunicipalities,
      specifyBusinessBaseAddressBuildingName:
        contractInfo.businessBaseAddressBuildingName,
      specifyBusinessBasePhoneNumber: contractInfo.businessBasePhoneNumber,
      specifyBusinessBaseStaffName: contractInfo.businessBaseStaffName,
      specifyBusinessBaseStaffContactPhoneNumber:
        contractInfo.businessBaseStaffContactPhoneNumber,
      detailsDestinationLogisticsBaseId:
        contractInfo.detailsDestinationLogisticsBaseId,
      detailsDestinationLogisticsBaseName:
        detailsDestinationLogisticsBaseName.replace(
          contractInfo.detailsDestinationLogisticsBaseId + '　',
          ''
        ),
      detailsDestinationLogisticsBaseFaxNumber:
        contractInfo.detailsDestinationLogisticsBaseFax,
      detailsDestinationLogisticsBaseMailAddress:
        contractInfo.detailsDestinationLogisticsBaseMailAddress,
    },
  ];
  newLiveInfo.assignmentDocumentDestinationBusinessBaseSyncroFlag =
    contractInfo.assignmentDocumentDestinationBusinessBaseSyncroFlag;
  newLiveInfo.assignmentDocumentDestinationZipCode =
    contractInfo.assignmentDocumentDestinationZipCode;
  newLiveInfo.assignmentDocumentDestinationPrefectureCode =
    contractInfo.assignmentDocumentDestinationPrefectureCode;
  newLiveInfo.assignmentDocumentDestinationMunicipalities =
    contractInfo.assignmentDocumentDestinationMunicipalities;
  newLiveInfo.assignmentDocumentDestinationAddressBuildingName =
    contractInfo.assignmentDocumentDestinationAddressBuildingName;
  newLiveInfo.assignmentDocumentDestinationPhoneNumber =
    contractInfo.assignmentDocumentDestinationPhoneNumber;
  newLiveInfo.assignmentDocumentDestinationFaxNumber =
    contractInfo.assignmentDocumentDestinationFaxNumber;
  newLiveInfo.assignmentDocumentDestinationShippingMethodSlipKind =
    contractInfo.assignmentDocumentDestinationShippingMethodSlipKind;
  newLiveInfo.assignmentDocumentDestinationCorporationName =
    contractInfo.assignmentDocumentDestinationCorporationName;
  newLiveInfo.assignmentDocumentDestinationAddressee =
    contractInfo.assignmentDocumentDestinationAddressee;
  newLiveInfo.purchaseDestinationFaxNumber =
    contractInfo.purchaseDestinationFaxNumber;
  newLiveInfo.purchaseDestinationMailAddress =
    contractInfo.purchaseDestinationMailAddress;
  newLiveInfo.bidDestinationDocFaxNumber =
    contractInfo.bidDestinationDocFaxNumber;
  newLiveInfo.bidDestinationDocMailAddress =
    contractInfo.bidDestinationDocMailAddress;
  newLiveInfo.specialDetailsDestinationSendKind =
    contractInfo.specialDetailsDestinationSendKind;

  // 都道府県コード取得
  const prefectureCodeSelectValues =
    selectValues.prefectureCodeSelectValues.find(
      (x) => x.displayValue === contractInfo.businessBasePrefectureName
    );
  const businessBasePrefectureCode =
    prefectureCodeSelectValues === undefined
      ? ''
      : prefectureCodeSelectValues.value.toString();
  newLiveInfo.businessInfo = [
    {
      businessBaseId: contractInfo.specifyBusinessBaseId,
      businessBaseName: specifyBusinessBaseName.replace(
        contractInfo.specifyBusinessBaseId + '　',
        ''
      ),
      businessBaseZipCode: contractInfo.businessBaseZipCode,
      businessBasePrefectureCode: businessBasePrefectureCode,
      businessBasePrefectureName: contractInfo.businessBasePrefectureName,
      businessBaseMunicipalities: contractInfo.businessBaseMunicipalities,
      businessBaseAddressBuildingName:
        contractInfo.businessBaseAddressBuildingName,
      businessBasePhoneNumber: contractInfo.businessBasePhoneNumber,
      businessBaseStaffName: contractInfo.businessBaseStaffName,
      businessBaseStaffContactPhoneNumber:
        contractInfo.businessBaseStaffContactPhoneNumber,
    },
  ];
  newLiveInfo.tvaaAutomaticTransportKind =
    contractInfo.tvaaAutomaticTransportKind;
  newLiveInfo.opehotPhonekind = contractInfo.opehotPhonekind;
  newLiveInfo.opehotPhoneNumber = contractInfo.opehotPhoneNumber;
  newLiveInfo.opehotMessage = contractInfo.opehotMessage;
  newLiveInfo.opehotEntryKind = contractInfo.opehotEntryKind;
  newLiveInfo.opehotMemberInformationKind =
    contractInfo.opehotMemberInformationKind;
  newLiveInfo.negotiationsLimitKind = contractInfo.negotiationsLimitKind;
  newLiveInfo.negotiationsStaffName = contractInfo.negotiationsStaffName;
  newLiveInfo.negotiationsStaffMobileNumber =
    contractInfo.negotiationsStaffMobileNumber;
  newLiveInfo.negotiationsOperationMemo =
    contractInfo.negotiationsOperationMemo;
  newLiveInfo.collaborationCommonMemberKind =
    contractInfo.collaborationCommonMemberKind;
  newLiveInfo.leaseKind = contractInfo.leaseKind;
  newLiveInfo.preemptionMemberFlag =
    contractInfo.preemptionMemberFlag === '1' ? true : false;
  newLiveInfo.purchaseBranchNumberSendFlag =
    contractInfo.purchaseBranchNumberSendFlag === '1' ? true : false;
  newLiveInfo.AexhibitshopFaxNumber = contractInfo.AexhibitshopFaxNumber;
  newLiveInfo.AexhibitshopMailAddress = contractInfo.AexhibitshopMailAddress;
  newLiveInfo.AexhibitshopSendKind = contractInfo.collaborationCommonMemberKind;
  newLiveInfo.memberMemo = contractInfo.memberMemo;
  const corporationInfo = {
    corporationId: '',
    corporationNameKana: '',
    corporationZipCode: '',
    corporationPrefectureCode: '',
    corporationMunicipalities: '',
    corporationAddressBuildingName: '',
    corporationPhoneNumber: '',
  };
  newLiveInfo.corporationInfo =
    contractInfo.detailsDestinationLogisticsBaseId === ''
      ? contractInfo.corporationInfo
      : corporationInfo;

  return newLiveInfo;
};

const ScrMem0014BasicTab = (props: {
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

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [logisticsBaseRow, setLogisticsBaseRow] = useState<
    LogisticsBaseRowModel[]
  >([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo[]>([]);
  const [changeHistory, setChangeHistory] = useState<any>([]);
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [scrCom00032PopupIsOpen, setScrCom00032PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [changeHistoryDateCheckIsOpen, setChangeHistoryDateCheckIsOpen] =
    useState<boolean>(false);
  const [historyInfo, setHistoryInfo] =
    useState<ScrMem0014ContractBaseRequest>();

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0014') === -1
  );

  const methods = useForm<ContractInfoModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields, errors, isValidating, isValid },
    setValue,
    getValues,
    reset,
    watch,
  } = methods;

  // 初期表示
  useEffect(() => {
    const initialize = async (
      contractId: string,
      corporationId: string,
      logisticsBaseId: string
    ) => {
      // リスト取得
      const newSelectValues = selectValuesInitialValues;
      // コード管理マスタ情報取得
      const getCodeManagementMasterMultipleRequest = {
        codeIdList: [
          { codeId: 'CDE-COM-0024' },
          { codeId: 'CDE-COM-0031' },
          { codeId: 'CDE-COM-0044' },
          { codeId: 'CDE-COM-0046' },
          { codeId: 'CDE-COM-0030' },
          { codeId: 'CDE-COM-0038' },
        ],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0024') {
          x.codeValueList.map((f) => {
            newSelectValues.shippingMethodSlipKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0031') {
          x.codeValueList.map((f) => {
            newSelectValues.sendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0044') {
          x.codeValueList.map((f) => {
            newSelectValues.opehotPhonekindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0046') {
          x.codeValueList.map((f) => {
            newSelectValues.memberInformationSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0030') {
          x.codeValueList.map((f) => {
            newSelectValues.negotiationsLimitKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0038') {
          x.codeValueList.map((f) => {
            newSelectValues.commonMemberKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // コード値取得（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [
          { entityName: 'segment_master' },
          { entityName: 'maker_code_master' },
        ],
      };
      const getCodeValueResponse = await ScrMem9999GetCodeValue(
        getCodeValueRequest
      );
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'segment_master') {
          x.codeValueList.map((f) => {
            newSelectValues.bidSegmentCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'maker_code_master') {
          x.codeValueList.map((f) => {
            newSelectValues.bidMakerCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 共通管理コード値取得（コード管理マスタ以外）
      const getCodeValueListRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const getCodeValueListResponse = await ScrCom9999GetCodeValue(
        getCodeValueListRequest
      );
      getCodeValueListResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            newSelectValues.prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 事業拠点一覧取得機能
      const getBusinessInfoRequest = {
        corporationId: corporationId,
        businessBaseId: '',
      };
      const getBusinessInfoResponse = await ScrMem9999GetBusinessInfo(
        getBusinessInfoRequest
      );
      getBusinessInfoResponse.businessInfo.map((x) => {
        newSelectValues.businessBaseSelectValues.push({
          value: x.businessBaseId,
          displayValue: x.businessBaseId + '　' + x.businessBaseName,
        });
      });

      //物流拠点情報取得
      const getLogisticsBaseInfoRequest = { corporationId: corporationId };
      const getLogisticsBaseInfoResponse = await ScrMem0014GetLogisticsBaseInfo(
        getLogisticsBaseInfoRequest
      );
      const logisticsBaseRow = convertToLogisticsBaseRow(
        getLogisticsBaseInfoResponse.logisticsBase
      );
      setLogisticsBaseRow(logisticsBaseRow);
      getLogisticsBaseInfoResponse.logisticsBase.map((x) => {
        newSelectValues.logisticsBaseSelectValues.push({
          value: x.logisticsBaseId,
          displayValue: x.logisticsBaseId + '　' + x.logisticsBaseName,
        });
      });

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0014',
        tabId: 'B-24',
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

      // 法人基本情報取得
      const getCorpBasicInfoRequest = { corporationId: corporationId };
      const getCorpBasicInfoResponse = await ScrMem9999GetCorpBasicInfo(
        getCorpBasicInfoRequest
      );
      const corporationInfo = {
        corporationId: getCorpBasicInfoResponse.corporationId,
        corporationNameKana: getCorpBasicInfoResponse.corporationName,
        corporationZipCode: getCorpBasicInfoResponse.corporationZipCode,
        corporationPrefectureCode:
          getCorpBasicInfoResponse.corporationPrefectureCode,
        corporationMunicipalities:
          getCorpBasicInfoResponse.corporationMunicipalities,
        corporationAddressBuildingName:
          getCorpBasicInfoResponse.corporationAddressBuildingName,
        corporationPhoneNumber: getCorpBasicInfoResponse.corporationPhoneNumber,
      };

      // 契約基本情報取得
      const getContractInfoRequest = { contractId: contractId };
      const getContractInfoResponse = await ScrMem0014GetContractInfo(
        getContractInfoRequest
      );
      const contractInfo = convertToContractInfoModel(
        getContractInfoResponse,
        getBusinessInfoResponse.businessInfo,
        logisticsBaseRow,
        corporationInfo,
        '',
        ''
      );
      reset(contractInfo);
      setBusinessInfo(getBusinessInfoResponse.businessInfo);
      setSelectValues({
        bidSegmentCodeSelectValues: newSelectValues.bidSegmentCodeSelectValues,
        bidMakerCodeSelectValues: newSelectValues.bidMakerCodeSelectValues,
        businessBaseSelectValues: newSelectValues.businessBaseSelectValues,
        logisticsBaseSelectValues: newSelectValues.logisticsBaseSelectValues,
        prefectureCodeSelectValues: newSelectValues.prefectureCodeSelectValues,
        shippingMethodSlipKindSelectValues:
          newSelectValues.shippingMethodSlipKindSelectValues,
        sendKindSelectValues: newSelectValues.sendKindSelectValues,
        opehotPhonekindSelectValues:
          newSelectValues.opehotPhonekindSelectValues,
        memberInformationSelectValues:
          newSelectValues.memberInformationSelectValues,
        negotiationsLimitKindSelectValues:
          newSelectValues.negotiationsLimitKindSelectValues,
        commonMemberKindSelectValues:
          newSelectValues.commonMemberKindSelectValues,
      });

      // 法人情報詳細基本情報への変換
      const contractBase = convertFromContractBase(
        contractInfo,
        props.contractBase,
        newSelectValues
      );
      props.setContractBaseValue(contractBase);
    };

    const newInitialize = async (corporationId: string) => {
      // リスト取得
      const newSelectValues = selectValuesInitialValues;
      // コード管理マスタ情報取得
      const getCodeManagementMasterMultipleRequest = {
        codeIdList: [
          { codeId: 'CDE-COM-0024' },
          { codeId: 'CDE-COM-0031' },
          { codeId: 'CDE-COM-0044' },
          { codeId: 'CDE-COM-0046' },
          { codeId: 'CDE-COM-0030' },
          { codeId: 'CDE-COM-0038' },
        ],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0024') {
          x.codeValueList.map((f) => {
            newSelectValues.shippingMethodSlipKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0031') {
          x.codeValueList.map((f) => {
            newSelectValues.sendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0044') {
          x.codeValueList.map((f) => {
            newSelectValues.opehotPhonekindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0046') {
          x.codeValueList.map((f) => {
            newSelectValues.memberInformationSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0030') {
          x.codeValueList.map((f) => {
            newSelectValues.negotiationsLimitKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0038') {
          x.codeValueList.map((f) => {
            newSelectValues.commonMemberKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // コード値取得（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [
          { entityName: 'segment_master' },
          { entityName: 'maker_code_master' },
        ],
      };
      const getCodeValueResponse = await ScrMem9999GetCodeValue(
        getCodeValueRequest
      );
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'segment_master') {
          x.codeValueList.map((f) => {
            newSelectValues.bidSegmentCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'maker_code_master') {
          x.codeValueList.map((f) => {
            newSelectValues.bidMakerCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 共通管理コード値取得（コード管理マスタ以外）
      const getCodeValueListRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const getCodeValueListResponse = await ScrCom9999GetCodeValue(
        getCodeValueListRequest
      );
      getCodeValueListResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            newSelectValues.prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 事業拠点一覧取得機能
      const getBusinessInfoRequest = {
        corporationId: corporationId,
        businessBaseId: '',
      };
      const getBusinessInfoResponse = await ScrMem9999GetBusinessInfo(
        getBusinessInfoRequest
      );
      setBusinessInfo(getBusinessInfoResponse.businessInfo);
      getBusinessInfoResponse.businessInfo.map((x) => {
        newSelectValues.businessBaseSelectValues.push({
          value: x.businessBaseId,
          displayValue: x.businessBaseId + '　' + x.businessBaseName,
        });
      });

      //物流拠点情報取得
      const getLogisticsBaseInfoRequest = { corporationId: corporationId };
      const getLogisticsBaseInfoResponse = await ScrMem0014GetLogisticsBaseInfo(
        getLogisticsBaseInfoRequest
      );
      const logisticsBaseRow = convertToLogisticsBaseRow(
        getLogisticsBaseInfoResponse.logisticsBase
      );
      setLogisticsBaseRow(logisticsBaseRow);
      getLogisticsBaseInfoResponse.logisticsBase.map((x) => {
        newSelectValues.logisticsBaseSelectValues.push({
          value: x.logisticsBaseId,
          displayValue: x.logisticsBaseId + '　' + x.logisticsBaseName,
        });
      });
      setSelectValues({
        bidSegmentCodeSelectValues: newSelectValues.bidSegmentCodeSelectValues,
        bidMakerCodeSelectValues: newSelectValues.bidMakerCodeSelectValues,
        businessBaseSelectValues: newSelectValues.businessBaseSelectValues,
        logisticsBaseSelectValues: newSelectValues.logisticsBaseSelectValues,
        prefectureCodeSelectValues: newSelectValues.prefectureCodeSelectValues,
        shippingMethodSlipKindSelectValues:
          newSelectValues.shippingMethodSlipKindSelectValues,
        sendKindSelectValues: newSelectValues.sendKindSelectValues,
        opehotPhonekindSelectValues:
          newSelectValues.opehotPhonekindSelectValues,
        memberInformationSelectValues:
          newSelectValues.memberInformationSelectValues,
        negotiationsLimitKindSelectValues:
          newSelectValues.negotiationsLimitKindSelectValues,
        commonMemberKindSelectValues:
          newSelectValues.commonMemberKindSelectValues,
      });

      // 法人基本情報取得
      const getCorpBasicInfoRequest = { corporationId: corporationId };
      const getCorpBasicInfoResponse = await ScrMem9999GetCorpBasicInfo(
        getCorpBasicInfoRequest
      );
      const corporationInfo = {
        corporationId: getCorpBasicInfoResponse.corporationId,
        corporationNameKana: getCorpBasicInfoResponse.corporationName,
        corporationZipCode: getCorpBasicInfoResponse.corporationZipCode,
        corporationPrefectureCode:
          getCorpBasicInfoResponse.corporationPrefectureCode,
        corporationMunicipalities:
          getCorpBasicInfoResponse.corporationMunicipalities,
        corporationAddressBuildingName:
          getCorpBasicInfoResponse.corporationAddressBuildingName,
        corporationPhoneNumber: getCorpBasicInfoResponse.corporationPhoneNumber,
      };

      const contractInfo = getValues();
      contractInfo.corporationId = getCorpBasicInfoResponse.corporationId;
      contractInfo.corporationName = getCorpBasicInfoResponse.corporationName;
      contractInfo.corporationInfo = corporationInfo;
      // 画面にデータを設定
      reset(contractInfo);
    };

    const historyInitialize = async (
      applicationId: string,
      corporationId: string
    ) => {
      // リスト取得
      const newSelectValues = selectValuesInitialValues;
      // コード管理マスタ情報取得
      const getCodeManagementMasterMultipleRequest = {
        codeIdList: [
          { codeId: 'CDE-COM-0024' },
          { codeId: 'CDE-COM-0031' },
          { codeId: 'CDE-COM-0044' },
          { codeId: 'CDE-COM-0046' },
          { codeId: 'CDE-COM-0030' },
          { codeId: 'CDE-COM-0038' },
        ],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0024') {
          x.codeValueList.map((f) => {
            newSelectValues.shippingMethodSlipKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0031') {
          x.codeValueList.map((f) => {
            newSelectValues.sendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0044') {
          x.codeValueList.map((f) => {
            newSelectValues.opehotPhonekindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0046') {
          x.codeValueList.map((f) => {
            newSelectValues.memberInformationSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0030') {
          x.codeValueList.map((f) => {
            newSelectValues.negotiationsLimitKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0038') {
          x.codeValueList.map((f) => {
            newSelectValues.commonMemberKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // コード値取得（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [
          { entityName: 'segment_master' },
          { entityName: 'maker_code_master' },
        ],
      };
      const getCodeValueResponse = await ScrMem9999GetCodeValue(
        getCodeValueRequest
      );
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'segment_master') {
          x.codeValueList.map((f) => {
            newSelectValues.bidSegmentCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
        if (x.entityName === 'maker_code_master') {
          x.codeValueList.map((f) => {
            newSelectValues.bidMakerCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 共通管理コード値取得（コード管理マスタ以外）
      const getCodeValueListRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const getCodeValueListResponse = await ScrCom9999GetCodeValue(
        getCodeValueListRequest
      );
      getCodeValueListResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            newSelectValues.prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 事業拠点一覧取得機能
      const getBusinessInfoRequest = {
        corporationId: corporationId,
        businessBaseId: '',
      };
      const getBusinessInfoResponse = await ScrMem9999GetBusinessInfo(
        getBusinessInfoRequest
      );
      setBusinessInfo(getBusinessInfoResponse.businessInfo);
      getBusinessInfoResponse.businessInfo.map((x) => {
        newSelectValues.businessBaseSelectValues.push({
          value: x.businessBaseId,
          displayValue: x.businessBaseId + '　' + x.businessBaseName,
        });
      });

      //物流拠点情報取得
      const getLogisticsBaseInfoRequest = { corporationId: corporationId };
      const getLogisticsBaseInfoResponse = await ScrMem0014GetLogisticsBaseInfo(
        getLogisticsBaseInfoRequest
      );
      const logisticsBaseRow = convertToLogisticsBaseRow(
        getLogisticsBaseInfoResponse.logisticsBase
      );
      setLogisticsBaseRow(logisticsBaseRow);
      getLogisticsBaseInfoResponse.logisticsBase.map((x) => {
        newSelectValues.logisticsBaseSelectValues.push({
          value: x.logisticsBaseId,
          displayValue: x.logisticsBaseId + '　' + x.logisticsBaseName,
        });
      });
      setSelectValues({
        bidSegmentCodeSelectValues: newSelectValues.bidSegmentCodeSelectValues,
        bidMakerCodeSelectValues: newSelectValues.bidMakerCodeSelectValues,
        businessBaseSelectValues: newSelectValues.businessBaseSelectValues,
        logisticsBaseSelectValues: newSelectValues.logisticsBaseSelectValues,
        prefectureCodeSelectValues: newSelectValues.prefectureCodeSelectValues,
        shippingMethodSlipKindSelectValues:
          newSelectValues.shippingMethodSlipKindSelectValues,
        sendKindSelectValues: newSelectValues.sendKindSelectValues,
        opehotPhonekindSelectValues:
          newSelectValues.opehotPhonekindSelectValues,
        memberInformationSelectValues:
          newSelectValues.memberInformationSelectValues,
        negotiationsLimitKindSelectValues:
          newSelectValues.negotiationsLimitKindSelectValues,
        commonMemberKindSelectValues:
          newSelectValues.commonMemberKindSelectValues,
      });

      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response = (
        await memApiClient.post('/scr-mem-9999/get-history-info', request)
      ).data;
      const corporationBasic = convertToHistoryContractInfoModel(
        response,
        applicationId
      );
      // 画面にデータを設定
      reset(corporationBasic);
      props.setContractBaseValue(response);
    };

    if (contractId === undefined) return;
    if (corporationId === undefined) return;
    if (logisticsBaseId === undefined) return;

    if (contractId === 'new' && logisticsBaseId === 'new') {
      newInitialize(corporationId);
      return;
    }

    if (applicationId !== null) {
      historyInitialize(applicationId, corporationId);
      return;
    }

    initialize(contractId, corporationId, logisticsBaseId);
  }, [contractId, corporationId, logisticsBaseId, applicationId, reset]);

  // 項目値変更
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // 指定事業拠点変更
      if (name === 'specifyBusinessBaseId') {
        const businessBase = businessInfo.find(
          (x) => x.businessBaseId === value.specifyBusinessBaseId
        );
        setValue(
          'businessBaseZipCode',
          businessBase === undefined ? '' : businessBase.businessBaseZipCode
        );
        setValue(
          'businessBasePrefectureName',
          businessBase === undefined
            ? ''
            : businessBase.businessBasePrefectureName
        );
        setValue(
          'businessBaseMunicipalities',
          businessBase === undefined
            ? ''
            : businessBase.businessBaseMunicipalities
        );
        setValue(
          'businessBaseAddressBuildingName',
          businessBase === undefined
            ? ''
            : businessBase.businessBaseAddressBuildingName
        );
        setValue(
          'businessBasePhoneNumber',
          businessBase === undefined ? '' : businessBase.businessBasePhoneNumber
        );
        setValue(
          'businessBaseStaffName',
          businessBase === undefined ? '' : businessBase.businessBaseStaffName
        );
        setValue(
          'businessBaseStaffContactPhoneNumber',
          businessBase === undefined
            ? ''
            : businessBase.businessBaseStaffContactPhoneNumber
        );
      }

      // 明細送付先拠点変更
      if (name === 'detailsDestinationLogisticsBaseId') {
        const detailsDestinationLogisticsBase = logisticsBaseRow.find(
          (x) => x.id === value.detailsDestinationLogisticsBaseId
        );
        setValue(
          'detailsDestinationLogisticsBaseFax',
          detailsDestinationLogisticsBase === undefined
            ? ''
            : detailsDestinationLogisticsBase.logisticsBaseFaxNumber
        );
        setValue(
          'detailsDestinationLogisticsBaseMailAddress',
          detailsDestinationLogisticsBase === undefined
            ? ''
            : detailsDestinationLogisticsBase.logisticsBaseMailAddress
        );
      }

      // 事業拠点コピー
      if (name === 'assignmentDocumentDestinationBusinessBaseSyncroFlag') {
        if (!value.assignmentDocumentDestinationBusinessBaseSyncroFlag) return;

        // 都道府県コード取得
        const prefectureCodeSelectValues =
          selectValues.prefectureCodeSelectValues.find(
            (x) => x.displayValue === getValues('businessBasePrefectureName')
          );
        const businessBasePrefectureCode =
          prefectureCodeSelectValues === undefined
            ? ''
            : prefectureCodeSelectValues.value.toString();
        setValue(
          'assignmentDocumentDestinationZipCode',
          getValues('businessBaseZipCode')
        );
        setValue(
          'assignmentDocumentDestinationPrefectureCode',
          businessBasePrefectureCode
        );
        setValue(
          'assignmentDocumentDestinationMunicipalities',
          getValues('businessBaseMunicipalities')
        );
        setValue(
          'assignmentDocumentDestinationAddressBuildingName',
          getValues('businessBaseAddressBuildingName')
        );
        setValue(
          'assignmentDocumentDestinationPhoneNumber',
          getValues('businessBasePhoneNumber')
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  /**
   * 住所自動入力
   */
  const onBlur = async () => {
    // 住所情報取得
    const getAddressInfoRequest = {
      zipCode: getValues('assignmentDocumentDestinationZipCode'),
    };
    const getAddressInfoResponse = await ScrCom9999GetAddressInfo(
      getAddressInfoRequest
    );
    setValue(
      'assignmentDocumentDestinationPrefectureCode',
      getAddressInfoResponse.prefectureCode
    );
    setValue(
      'assignmentDocumentDestinationMunicipalities',
      getAddressInfoResponse.municipalities
    );
    setValue(
      'assignmentDocumentDestinationAddressBuildingName',
      getAddressInfoResponse.townOrStreetName
    );
  };

  /**
   * 会員メモ編集リンククリック時のイベントハンドラ
   */
  const handleLinkClick = () => {
    navigate('/mem/corporations/' + corporationId);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    await methods.trigger();
    if (!methods.formState.isValid) return;
    // 反映予定日整合性チェック
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
          tabId: 24,
          tabName: '基本情報',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      changeExpectDate: getValues('changeExpectedDate'),
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations/' + corporationId);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setScrCom00032PopupIsOpen(false);

    // 法人情報詳細基本情報への変換
    const contractBase = convertFromContractBase(
      getValues(),
      props.contractBase,
      selectValues
    );

    // 基本情報登録
    const request = Object.assign(contractBase, {
      applicationEmployeeId: user.employeeId,
      changeExpectDate: new Date(getValues('changeExpectedDate')),
      registrationChangeMemo: registrationChangeMemo,
      screenId: 'SCR-MEM-0014',
      tabId: 'B-25',
    });
    await ScrMem0014ContractBase(request);

    // 法人情報詳細基本情報へ登録
    props.setContractBaseValue(contractBase);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
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
    const corporationBasic = convertToHistoryContractInfoModel(
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

    // 基本情報タブ以外は非活性
    props.chengeTabDisableds({
      ScrMem0014BasicTab: false,
      ScrMem0014ServiceDiscountTab: true,
      ScrMem0014BillingTab: true,
      ScrMem0014LiveTab: true,
    });
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 基本情報セクション */}
            <Section name='基本情報'>
              {/* 法人・契約情報 */}
              <ContentsBox transparent={true}>
                <MarginBox justifyContent='left' mb={6}>
                  <CaptionLabel text='法人・契約情報' />
                </MarginBox>
                <RowStack mb>
                  <ColStack>
                    <TextField
                      label='法人ID'
                      name='corporationId'
                      size='m'
                      readonly
                    />
                    <TextField
                      label='契約ID'
                      name='contractId'
                      size='m'
                      required
                    />
                    <Select
                      label='落札セグメント'
                      name='bidSegmentCode'
                      selectValues={selectValues.bidSegmentCodeSelectValues}
                      size='m'
                      blankOption
                    />
                  </ColStack>
                  <ColStack>
                    <TextField
                      label='法人名称'
                      name='corporationName'
                      size='m'
                      readonly
                    />
                    <TextField
                      label='ID発行年月日'
                      name='idIssuanceDate'
                      size='m'
                      readonly
                    />
                    <Select
                      label='メーカーCD'
                      name='bidMakerCode'
                      selectValues={selectValues.bidMakerCodeSelectValues}
                      size='m'
                      blankOption
                    />
                  </ColStack>
                </RowStack>
              </ContentsBox>
              {/* 契約情報 */}
              <ContentsBox transparent={true}>
                <MarginBox justifyContent='left' mb={6}>
                  <CaptionLabel text='契約情報' />
                </MarginBox>
                <RowStack mb>
                  <ColStack>
                    <Select
                      label='指定事業拠点'
                      name='specifyBusinessBaseId'
                      selectValues={selectValues.businessBaseSelectValues}
                      size='m'
                      blankOption
                      required
                    />
                    <TextField
                      label='郵便番号'
                      name='businessBaseZipCode'
                      size='m'
                      readonly
                    />
                    <TextField
                      label='都道府県'
                      name='businessBasePrefectureName'
                      size='m'
                      readonly
                    />
                    <TextField
                      label='市区町村'
                      name='businessBaseMunicipalities'
                      size='m'
                      readonly
                    />
                    <TextField
                      label='番地・号・建物名など'
                      name='businessBaseAddressBuildingName'
                      size='m'
                      readonly
                    />
                    <TextField
                      label='TEL'
                      name='businessBasePhoneNumber'
                      size='m'
                      readonly
                    />
                    <TextField
                      label='担当者'
                      name='businessBaseStaffName'
                      size='m'
                      readonly
                    />
                    <TextField
                      label='担当者連絡先'
                      name='businessBaseStaffContactPhoneNumber'
                      size='m'
                      readonly
                    />
                  </ColStack>
                  <ColStack>
                    <Select
                      label='明細送付先拠点'
                      name='detailsDestinationLogisticsBaseId'
                      selectValues={selectValues.logisticsBaseSelectValues}
                      size='m'
                      blankOption
                      required
                    />
                    <TextField
                      label='明細送付先拠点/FAX'
                      name='detailsDestinationLogisticsBaseFax'
                      size='m'
                      readonly
                    />
                    <TextField
                      label='明細送付先拠点/メールアドレス'
                      name='detailsDestinationLogisticsBaseMailAddress'
                      size='m'
                      readonly
                    />
                  </ColStack>
                </RowStack>
              </ContentsBox>
              {/* 譲渡書類送付先/特別明細送付先 */}
              <ContentsBox transparent={true}>
                <RowStack mb>
                  <ColStack>
                    <CaptionLabel text='譲渡書類送付先' />
                    <MarginBox
                      textAlign='left'
                      justifyContent='left'
                      mb={2.3}
                      mt={1.5}
                    >
                      <Checkbox
                        name='assignmentDocumentDestinationBusinessBaseSyncroFlag'
                        label='事業拠点コピー'
                        size='m'
                      />
                    </MarginBox>
                    <PostalTextField
                      label='郵便番号'
                      name='assignmentDocumentDestinationZipCode'
                      size='m'
                      onBlur={onBlur}
                      disabled={getValues(
                        'assignmentDocumentDestinationBusinessBaseSyncroFlag'
                      )}
                    />
                    <Select
                      label='都道府県'
                      name='assignmentDocumentDestinationPrefectureCode'
                      selectValues={selectValues.prefectureCodeSelectValues}
                      size='m'
                      blankOption
                      disabled={getValues(
                        'assignmentDocumentDestinationBusinessBaseSyncroFlag'
                      )}
                    />
                    <TextField
                      label='市区町村'
                      name='assignmentDocumentDestinationMunicipalities'
                      size='m'
                      disabled={getValues(
                        'assignmentDocumentDestinationBusinessBaseSyncroFlag'
                      )}
                    />
                    <TextField
                      label='番地・号・建物名など'
                      name='assignmentDocumentDestinationAddressBuildingName'
                      size='m'
                      disabled={getValues(
                        'assignmentDocumentDestinationBusinessBaseSyncroFlag'
                      )}
                    />
                    <TextField
                      label='TEL'
                      name='assignmentDocumentDestinationPhoneNumber'
                      size='m'
                      disabled={getValues(
                        'assignmentDocumentDestinationBusinessBaseSyncroFlag'
                      )}
                    />
                    <TextField
                      label='FAX'
                      name='assignmentDocumentDestinationFaxNumber'
                      size='m'
                    />
                    <TextField
                      label='メールアドレス'
                      name='assignmentDocumentDestinationMailAddress'
                      size='m'
                    />
                    <Select
                      label='伝票種類'
                      name='assignmentDocumentDestinationShippingMethodSlipKind'
                      selectValues={
                        selectValues.shippingMethodSlipKindSelectValues
                      }
                      size='m'
                      blankOption
                      required
                    />
                    <TextField
                      label='法人名称'
                      name='assignmentDocumentDestinationCorporationName'
                      size='m'
                      required
                    />
                    <TextField
                      label='宛名'
                      name='assignmentDocumentDestinationAddressee'
                      size='m'
                    />
                  </ColStack>
                  <ColStack>
                    <CaptionLabel text='特別明細送付先' />
                    <TextField
                      label='成約明細書/FAX'
                      name='purchaseDestinationFaxNumber'
                      size='m'
                    />
                    <TextField
                      label='成約明細書/メールアドレス'
                      name='purchaseDestinationMailAddress'
                      size='m'
                    />
                    <TextField
                      label='落札明細書/FAX'
                      name='bidDestinationDocFaxNumber'
                      size='m'
                    />
                    <TextField
                      label='落札明細書/メールアドレス'
                      name='bidDestinationDocMailAddress'
                      size='m'
                    />
                    <Select
                      label='送信区分'
                      name='specialDetailsDestinationSendKind'
                      selectValues={selectValues.sendKindSelectValues}
                      size='m'
                      blankOption
                    />
                  </ColStack>
                </RowStack>
              </ContentsBox>
            </Section>
            {/* 物流拠点一覧セクション */}
            <Section name='物流拠点一覧'>
              <DataGrid
                columns={logisticsBaseColumns}
                rows={logisticsBaseRow}
                pagination
              />
            </Section>
            {/* 連携用セクション */}
            <Section name='連携用'>
              <RowStack>
                <ColStack>
                  <Radio
                    label='四輪自動輸送区分'
                    name='tvaaAutomaticTransportKind'
                    radioValues={[
                      { value: '5', displayValue: 'アイオーク' },
                      { value: 'N', displayValue: '任意手配' },
                    ]}
                    disabled={isReadOnly[0]}
                  />
                  <Select
                    label='オペホットTEL―1'
                    name='opehotPhonekind'
                    selectValues={selectValues.opehotPhonekindSelectValues}
                    size='s'
                    blankOption
                  />
                  <TextField
                    label='オペホットTEL―2'
                    name='opehotPhoneNumber'
                    size='s'
                  />
                  <TextField
                    label='オペホット―MSG'
                    name='opehotMessage'
                    size='s'
                  />
                  <Radio
                    label='オペホット―KBN'
                    name='opehotEntryKind'
                    radioValues={[
                      { value: '0', displayValue: '参加' },
                      { value: 'N', displayValue: '不参加' },
                    ]}
                    disabled={isReadOnly[0]}
                  />
                  <Select
                    label='会員情報'
                    name='opehotMemberInformationKind'
                    selectValues={selectValues.memberInformationSelectValues}
                    size='s'
                    blankOption
                  />
                  <Select
                    label='商談制限'
                    name='negotiationsLimitKind'
                    selectValues={
                      selectValues.negotiationsLimitKindSelectValues
                    }
                    size='s'
                    blankOption
                  />
                  <TextField
                    label='商談担当'
                    name='negotiationsStaffName'
                    size='m'
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='携帯　TEL'
                    name='negotiationsStaffMobileNumber'
                    size='s'
                  />
                  <TextField
                    label='運営メモ'
                    name='negotiationsOperationMemo'
                    size='m'
                  />
                  <Select
                    label='共通会員'
                    name='collaborationCommonMemberKind'
                    selectValues={selectValues.commonMemberKindSelectValues}
                    size='s'
                    blankOption
                  />
                  <Radio
                    label='リース区分'
                    name='leaseKind'
                    radioValues={[
                      { value: '1', displayValue: '対象' },
                      { value: '0', displayValue: '対象外' },
                    ]}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='先取り会員フラグ'
                    name='preemptionMemberFlag'
                    radioValues={[
                      { value: '1', displayValue: '対象' },
                      { value: '0', displayValue: '対象外' },
                    ]}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='成約明細枝番送信フラグ'
                    name='purchaseBranchNumberSendFlag'
                    radioValues={[
                      { value: '1', displayValue: '送信する' },
                      { value: '0', displayValue: '送信しない' },
                    ]}
                    disabled={isReadOnly[0]}
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='A出品店別FAX番号'
                    name='AexhibitshopFaxNumber'
                    size='s'
                  />
                  <TextField
                    label='A出品店別メールアドレス'
                    name='AexhibitshopMailAddress'
                    size='s'
                  />
                  <Select
                    label='A出品店別送信区分'
                    name='AexhibitshopSendKind'
                    selectValues={selectValues.sendKindSelectValues}
                    size='s'
                    blankOption
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 会員メモセクション */}
            <Section name='会員メモ'>
              <RowStack>
                <ColStack>
                  <Link href='#' onClick={handleLinkClick}>
                    会員メモ編集
                  </Link>
                </ColStack>
                <ColStack>
                  <Textarea
                    name='memberMemo'
                    maxRows={5}
                    size='l'
                    disabled={true}
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
            <ConfirmButton onClick={handleConfirm} disable={isReadOnly[0]}>
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
    </>
  );
};

export default ScrMem0014BasicTab;

