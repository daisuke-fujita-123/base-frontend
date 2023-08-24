import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom00032Popup, {
  columnList,
  errorList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

import { MarginBox } from 'layouts/Box';
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
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { WarningLabel } from 'controls/Label';
import { Link } from 'controls/Link';
import { Radio } from 'controls/Radio';
import { Select, SelectValue } from 'controls/Select';
import { Textarea } from 'controls/Textarea';
import { PostalTextField, PriceTextField, TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  ScrCom9999GetAddressInfo,
  ScrCom9999GetChangeDate,
  ScrCom9999GetChangeDateRequest,
  ScrCom9999GetCodeValue,
} from 'apis/com/ScrCom9999Api';
import {
  ScrMem0008GetBillingInfo,
  ScrMem0008GetBillingInfoResponse,
  ScrMem0008RegistrationBillingInfo,
  ScrMem0008RegistrationBillingInfoRequest,
  ScrMem9999GetHistoryBillingInfoInfoResponse,
  ScrMem9999GetHistoryInfo,
} from 'apis/mem/ScrMem0008Api';
import {
  ScrMem9999GetBusinessInfo,
  ScrMem9999GetCorpBasicInfo,
} from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

import { TabDisabledsModel } from '../ScrMem0008Page';

/**
 * 基本情報データモデル
 */
interface BillingInfoModel {
  // 法人ID
  corporationId: string;
  // コピー元事業拠点
  corporationName: string;
  // 郵便番号
  billingId: string;
  // 都道府県
  billingAddressContactSynchronizationBusinessBaseId: string;
  // 市区町村
  billingZipCode: string;
  // 番地・号/建物名など
  billingPrefectureCode: string;
  // TEL
  billingMunicipalities: string;
  // 法人名称
  billingAddressBuildingName: string;
  // FAX
  billingPhoneNumber: string;
  // メールアドレス
  billingFaxNumber: string;
  // 請求先名称
  billingMailAddress: string;
  // 請求先ID
  billingName: string;

  // 四輪
  // 即時出金限度額
  tvaaImmediatePaymentLimitAmount: string;
  // 即時出金対象譲渡書類未到着限度額
  tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount: string;
  // 即払可否
  tvaaImmediatePaymentFlag: string;
  // 書類先出し
  tvaaDocumentAdvanceFlag: string;
  // 延滞金の自動発生可否フラグ
  tvaaArrearsPriceAutomaticOccurrenceFlag: string;
  // 相殺要否
  tvaaOffsettingFlag: string;
  // オークション参加制限可否
  tvaaAuctionEntryLimitFlag: string;
  // 督促状発行（FAX）
  tvaaDemandFaxSendFlag: boolean;
  // 督促状発行（メール）
  tvaaDemandMailSendFlag: boolean;
  // 計算書送信フラグ（FAX）
  tvaaStatementFaxSendFlag: boolean;
  // 計算書送信フラグ（メール）
  tvaaStatementMailSendFlag: boolean;

  // 二輪
  // 即時出金限度額
  bikeImmediatePaymentLimitAmount: string;
  // 即時出金対象譲渡書類未到着限度額
  bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount: string;
  // 即払可否
  bikeImmediatePaymentFlag: string;
  // 書類先出し
  bikeDocumentAdvanceFlag: string;
  // 延滞金の自動発生可否フラグ
  bikeArrearsPriceAutomaticOccurrenceFlag: string;
  // 相殺要否
  bikeOffsettingFlag: string;
  // オークション参加制限可否
  bikeAuctionEntryLimitFlag: string;
  // 督促状発行（FAX）
  bikeDemandFaxSendFlag: boolean;
  // 督促状発行（メール）
  bikeDemandMailSendFlag: boolean;
  // 計算書送信フラグ（FAX）
  bikeStatementFaxSendFlag: boolean;
  // 計算書送信フラグ（メール）
  bikeStatementMailSendFlag: boolean;
  // 会員メモ
  memberMemo: string;

  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectedDate: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  originBusinessSelectValues: SelectValue[];
  prefectureCodeSelectValues: SelectValue[];
}

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  billingAddressContactSynchronizationBusinessBaseId: yup
    .string()
    .label('コピー元事業拠点'),
  billingZipCode: yup.string().label('郵便番号').max(8).half(),
  billingPrefectureCode: yup.string().label('都道府県'),
  billingMunicipalities: yup.string().label('市区町村').max(40),
  billingAddressBuildingName: yup.string().label('番地・号/建物名など').max(40),
  billingPhoneNumber: yup.string().label('TEL').max(13).phone(),
  billingFaxNumber: yup.string().label('FAX').max(13).phone(),
  billingMailAddress: yup.string().label('メールアドレス').max(254).email(),
  billingName: yup.string().label('請求先名称').max(30),
  tvaaImmediatePaymentLimitAmount: yup
    .string()
    .label('四輪即時出金限度額')
    .max(11)
    .numberWithComma(),
  tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount: yup
    .string()
    .label('四輪即時出金対象譲渡書類未到着限度額')
    .max(11)
    .numberWithComma(),
  tvaaImmediatePaymentFlag: yup.string().label('四輪即払可否').required(),
  tvaaDocumentAdvanceFlag: yup.string().label('四輪書類先出し').required(),
  tvaaArrearsPriceAutomaticOccurrenceFlag: yup
    .string()
    .label('四輪延滞金の自動発生可否フラグ')
    .required(),
  tvaaOffsettingFlag: yup.string().label('四輪相殺要否').required(),
  tvaaAuctionEntryLimitFlag: yup
    .string()
    .label('四輪オークション参加制限可否')
    .required(),
  tvaaDemandFaxSendFlag: yup.string().label('四輪督促状発行（FAX）'),
  tvaaDemandMailSendFlag: yup.string().label('四輪督促状発行（メール）'),
  tvaaStatementFaxSendFlag: yup.string().label('四輪計算書送信フラグ（FAX）'),
  tvaaStatementMailSendFlag: yup
    .string()
    .label('四輪計算書送信フラグ（メール）'),
  bikeImmediatePaymentLimitAmount: yup
    .string()
    .label('二輪即時出金限度額')
    .max(11)
    .numberWithComma(),
  bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount: yup
    .string()
    .label('二輪即時出金対象譲渡書類未到着限度額')
    .max(11)
    .numberWithComma(),
  bikeImmediatePaymentFlag: yup.string().label('二輪即払可否').required(),
  bikeDocumentAdvanceFlag: yup.string().label('二輪書類先出し').required(),
  bikeArrearsPriceAutomaticOccurrenceFlag: yup
    .string()
    .label('二輪延滞金の自動発生可否フラグ')
    .required(),
  bikeOffsettingFlag: yup.string().label('二輪相殺要否').required(),
  bikeAuctionEntryLimitFlag: yup
    .string()
    .label('二輪オークション参加制限可否')
    .required(),
  bikeDemandFaxSendFlag: yup.string().label('二輪督促状発行（FAX）'),
  bikeDemandMailSendFlag: yup.string().label('二輪督促状発行（メール）'),
  bikeStatementFaxSendFlag: yup.string().label('二輪計算書送信フラグ（FAX）'),
  bikeStatementMailSendFlag: yup
    .string()
    .label('二輪計算書送信フラグ（メール）'),
};

/**
 * 列定義
 */
const contractColumns: GridColDef[] = [
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 's',
  },
  {
    field: 'claimMethodKind',
    headerName: '会費請求方法',
    size: 'm',
  },
];

/**
 * 行データモデル
 */
interface contractRowModel {
  // internalId
  id: string;
  // 契約ID
  contractId: string;
  // 会費請求方法
  claimMethodKind: string;
}

/**
 * ラジオボタンモデル
 */
interface RadioValue {
  value: string | number;
  displayValue: string;
  backgroundColor?: string;
}

/**
 * プルダウン初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  originBusinessSelectValues: [],
  prefectureCodeSelectValues: [],
};

/**
 * 初期データ
 */
const initialValues: BillingInfoModel = {
  corporationId: '',
  corporationName: '',
  billingId: '',
  billingAddressContactSynchronizationBusinessBaseId: '',
  billingZipCode: '',
  billingPrefectureCode: '',
  billingMunicipalities: '',
  billingAddressBuildingName: '',
  billingPhoneNumber: '',
  billingFaxNumber: '',
  billingMailAddress: '',
  billingName: '',
  tvaaImmediatePaymentLimitAmount: '',
  tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount: '',
  tvaaImmediatePaymentFlag: '',
  tvaaDocumentAdvanceFlag: '',
  tvaaArrearsPriceAutomaticOccurrenceFlag: '',
  tvaaOffsettingFlag: '',
  tvaaAuctionEntryLimitFlag: '',
  tvaaDemandFaxSendFlag: false,
  tvaaDemandMailSendFlag: false,
  tvaaStatementFaxSendFlag: false,
  tvaaStatementMailSendFlag: false,
  bikeImmediatePaymentLimitAmount: '',
  bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount: '',
  bikeImmediatePaymentFlag: '',
  bikeDocumentAdvanceFlag: '',
  bikeArrearsPriceAutomaticOccurrenceFlag: '',
  bikeOffsettingFlag: '',
  bikeAuctionEntryLimitFlag: '',
  bikeDemandFaxSendFlag: false,
  bikeDemandMailSendFlag: false,
  bikeStatementFaxSendFlag: false,
  bikeStatementMailSendFlag: false,
  memberMemo: '',
  changeHistoryNumber: '',
  changeExpectedDate: '',
};

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
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '基本情報',
    fields: [
      'billingAddressContactSynchronizationBusinessBaseId',
      'billingZipCode',
      'billingPrefectureCode',
      'billingMunicipalities',
      'billingAddressBuildingName',
      'billingPhoneNumber',
      'billingFaxNumber',
      'billingMailAddress',
      'billingName',
      'tvaaImmediatePaymentLimitAmount',
      'tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount',
      'tvaaImmediatePaymentFlag',
      'tvaaDocumentAdvanceFlag',
      'tvaaArrearsPriceAutomaticOccurrenceFlag',
      'tvaaOffsettingFlag',
      'tvaaAuctionEntryLimitFlag',
      'tvaaDemandFaxSendFlag',
      'tvaaDemandMailSendFlag',
      'tvaaStatementFaxSendFlag',
      'tvaaStatementMailSendFlag',
      'bikeImmediatePaymentLimitAmount',
      'bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount',
      'bikeImmediatePaymentFlag',
      'bikeDocumentAdvanceFlag',
      'bikeArrearsPriceAutomaticOccurrenceFlag',
      'bikeOffsettingFlag',
      'bikeAuctionEntryLimitFlag',
      'bikeDemandFaxSendFlag',
      'bikeDemandMailSendFlag',
      'bikeStatementFaxSendFlag',
      'bikeStatementMailSendFlag',
    ],
    name: [
      'コピー元事業拠点',
      '郵便番号',
      '都道府県',
      '市区町村',
      '番地・号/建物名など',
      'TEL',
      'FAX',
      'メールアドレス',
      '請求先名称',
      '四輪即時出金限度額',
      '四輪即時出金対象譲渡書類未到着限度額',
      '四輪即払可否',
      '四輪書類先出し',
      '四輪延滞金の自動発生可否フラグ',
      '四輪相殺要否',
      '四輪オークション参加制限可否',
      '四輪督促状発行FAX',
      '四輪督促状発行メール',
      '四輪計算書送信フラグFAX',
      '四輪計算書送信フラグメール',
      '二輪即時出金限度額',
      '二輪即時出金対象譲渡書類未到着限度額',
      '二輪即払可否',
      '二輪書類先出し',
      '二輪延滞金の自動発生可否フラグ',
      '二輪相殺要否',
      '二輪オークション参加制限可否',
      '二輪督促状発行FAX',
      '二輪督促状発行メール',
      '二輪計算書送信フラグFAX',
      '二輪計算書送信フラグメール',
    ],
  },
  {
    section: '会員メモ',
    fields: ['memberMemo'],
    name: ['会員メモ'],
  },
];

/**
 * 請求先一覧取得機能APIリクエストから基本情報データモデルへの変換
 */
const convertToBillingInfoModel = (
  response: ScrMem0008GetBillingInfoResponse,
  changeHistoryNumber: string,
  changeExpectedDate: string
): BillingInfoModel => {
  return {
    corporationId: response.corporationId,
    corporationName: response.corporationName,
    billingId: response.billingId,
    billingAddressContactSynchronizationBusinessBaseId:
      response.billingAddressContactSynchronizationBusinessBaseId,
    billingZipCode: response.billingZipCode,
    billingPrefectureCode: response.billingPrefectureCode,
    billingMunicipalities: response.billingMunicipalities,
    billingAddressBuildingName: response.billingAddressBuildingName,
    billingPhoneNumber: response.billingPhoneNumber,
    billingFaxNumber: response.billingFaxNumber,
    billingMailAddress: response.billingMailAddress,
    billingName: response.billingName,
    tvaaImmediatePaymentLimitAmount:
      response.tvaaImmediatePaymentLimitAmount.toLocaleString(),
    tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount:
      response.tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount.toLocaleString(),
    tvaaImmediatePaymentFlag: response.tvaaImmediatePaymentFlag ? '0' : '1',
    tvaaDocumentAdvanceFlag: response.tvaaDocumentAdvanceFlag ? '0' : '1',
    tvaaArrearsPriceAutomaticOccurrenceFlag:
      response.tvaaArrearsPriceAutomaticOccurrenceFlag ? '0' : '1',
    tvaaOffsettingFlag: response.tvaaOffsettingFlag ? '0' : '1',
    tvaaAuctionEntryLimitFlag: response.tvaaAuctionEntryLimitFlag ? '0' : '1',
    tvaaDemandFaxSendFlag: response.tvaaDemandFaxSendFlag,
    tvaaDemandMailSendFlag: response.tvaaDemandMailSendFlag,
    tvaaStatementFaxSendFlag: response.tvaaStatementFaxSendFlag,
    tvaaStatementMailSendFlag: response.tvaaStatementMailSendFlag,
    bikeImmediatePaymentLimitAmount:
      response.bikeImmediatePaymentLimitAmount.toLocaleString(),
    bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount:
      response.bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount.toLocaleString(),
    bikeImmediatePaymentFlag: response.bikeImmediatePaymentFlag ? '0' : '1',
    bikeDocumentAdvanceFlag: response.bikeDocumentAdvanceFlag ? '0' : '1',
    bikeArrearsPriceAutomaticOccurrenceFlag:
      response.bikeArrearsPriceAutomaticOccurrenceFlag ? '0' : '1',
    bikeOffsettingFlag: response.bikeOffsettingFlag ? '0' : '1',
    bikeAuctionEntryLimitFlag: response.bikeAuctionEntryLimitFlag ? '0' : '1',
    bikeDemandFaxSendFlag: response.bikeDemandFaxSendFlag,
    bikeDemandMailSendFlag: response.bikeDemandMailSendFlag,
    bikeStatementFaxSendFlag: response.bikeStatementFaxSendFlag,
    bikeStatementMailSendFlag: response.bikeStatementMailSendFlag,
    memberMemo: response.memberMemo,
    changeHistoryNumber: changeHistoryNumber,
    changeExpectedDate: changeExpectedDate,
  };
};

/**
 * 変更履歴情報取得APIリクエストから基本情報データモデルへの変換
 */
const convertToHistoryBillingInfoModel = (
  response: ScrMem9999GetHistoryBillingInfoInfoResponse,
  changeHistoryNumber: string,
  changeExpectedDate: string
): BillingInfoModel => {
  return {
    corporationId: response.corporationId,
    corporationName: response.corporationName,
    billingId: response.billingId,
    billingAddressContactSynchronizationBusinessBaseId:
      response.billingAddressContactSynchronizationBusinessBaseId,
    billingZipCode: response.billingZipCode,
    billingPrefectureCode: response.billingPrefectureCode,
    billingMunicipalities: response.billingMunicipalities,
    billingAddressBuildingName: response.billingAddressBuildingName,
    billingPhoneNumber: response.billingPhoneNumber,
    billingFaxNumber: response.billingFaxNumber,
    billingMailAddress: response.billingMailAddress,
    billingName: response.billingName,
    tvaaImmediatePaymentLimitAmount:
      response.tvaaImmediatePaymentLimitAmount.toLocaleString(),
    tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount:
      response.tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount.toLocaleString(),
    tvaaImmediatePaymentFlag: response.tvaaImmediatePaymentFlag ? '0' : '1',
    tvaaDocumentAdvanceFlag: response.tvaaDocumentAdvanceFlag ? '0' : '1',
    tvaaArrearsPriceAutomaticOccurrenceFlag:
      response.tvaaArrearsPriceAutomaticOccurrenceFlag ? '0' : '1',
    tvaaOffsettingFlag: response.tvaaOffsettingFlag ? '0' : '1',
    tvaaAuctionEntryLimitFlag: response.tvaaAuctionEntryLimitFlag ? '0' : '1',
    tvaaDemandFaxSendFlag: response.tvaaDemandFaxSendFlag,
    tvaaDemandMailSendFlag: response.tvaaDemandMailSendFlag,
    tvaaStatementFaxSendFlag: response.tvaaStatementFaxSendFlag,
    tvaaStatementMailSendFlag: response.tvaaStatementMailSendFlag,
    bikeImmediatePaymentLimitAmount:
      response.bikeImmediatePaymentLimitAmount.toLocaleString(),
    bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount:
      response.bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount.toLocaleString(),
    bikeImmediatePaymentFlag: response.bikeImmediatePaymentFlag ? '0' : '1',
    bikeDocumentAdvanceFlag: response.bikeDocumentAdvanceFlag ? '0' : '1',
    bikeArrearsPriceAutomaticOccurrenceFlag:
      response.bikeArrearsPriceAutomaticOccurrenceFlag ? '0' : '1',
    bikeOffsettingFlag: response.bikeOffsettingFlag ? '0' : '1',
    bikeAuctionEntryLimitFlag: response.bikeAuctionEntryLimitFlag ? '0' : '1',
    bikeDemandFaxSendFlag: response.bikeDemandFaxSendFlag,
    bikeDemandMailSendFlag: response.bikeDemandMailSendFlag,
    bikeStatementFaxSendFlag: response.bikeStatementFaxSendFlag,
    bikeStatementMailSendFlag: response.bikeStatementMailSendFlag,
    memberMemo: response.memberMemo,
    changeHistoryNumber: changeHistoryNumber,
    changeExpectedDate: changeExpectedDate,
  };
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
 * 法人基本情報登録APIリクエストへの変換
 */
const convertFromCorporationInfoModel = (
  billingInfo: BillingInfoModel,
  contractRow: contractRowModel[],
  user: string,
  registrationChangeMemo: string
): ScrMem0008RegistrationBillingInfoRequest => {
  return {
    corporationId: billingInfo.corporationId,
    corporationName: billingInfo.corporationName,
    billingId: billingInfo.billingId,
    billingAddressContactSynchronizationBusinessBaseId:
      billingInfo.billingAddressContactSynchronizationBusinessBaseId,
    billingZipCode: billingInfo.billingZipCode,
    billingPrefectureCode: billingInfo.billingPrefectureCode,
    billingMunicipalities: billingInfo.billingMunicipalities,
    billingAddressBuildingName: billingInfo.billingAddressBuildingName,
    billingPhoneNumber: billingInfo.billingPhoneNumber,
    billingFaxNumber: billingInfo.billingFaxNumber,
    billingMailAddress: billingInfo.billingMailAddress,
    billingName: billingInfo.billingName,
    contractInfo: contractRow.map((x) => {
      return {
        contractId: x.contractId,
        claimMethodKind: x.claimMethodKind,
      };
    }),
    tvaaImmediatePaymentLimitAmount: Number(
      billingInfo.tvaaImmediatePaymentLimitAmount.replace(/,/g, '')
    ),
    tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount: Number(
      billingInfo.tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount.replace(
        /,/g,
        ''
      )
    ),
    tvaaImmediatePaymentFlag:
      billingInfo.tvaaImmediatePaymentFlag === '0' ? true : false,
    tvaaDocumentAdvanceFlag:
      billingInfo.tvaaDocumentAdvanceFlag === '0' ? true : false,
    tvaaArrearsPriceAutomaticOccurrenceFlag:
      billingInfo.tvaaArrearsPriceAutomaticOccurrenceFlag === '0'
        ? true
        : false,
    tvaaOffsettingFlag: billingInfo.tvaaOffsettingFlag === '0' ? true : false,
    tvaaAuctionEntryLimitFlag:
      billingInfo.tvaaAuctionEntryLimitFlag === '0' ? true : false,
    tvaaDemandMailSendFlag: billingInfo.tvaaDemandMailSendFlag,
    tvaaDemandFaxSendFlag: billingInfo.tvaaDemandFaxSendFlag,
    tvaaStatementMailSendFlag: billingInfo.tvaaStatementMailSendFlag,
    tvaaStatementFaxSendFlag: billingInfo.tvaaStatementFaxSendFlag,
    bikeImmediatePaymentLimitAmount: Number(
      billingInfo.bikeImmediatePaymentLimitAmount.replace(/,/g, '')
    ),
    bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount: Number(
      billingInfo.bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount.replace(
        /,/g,
        ''
      )
    ),
    bikeImmediatePaymentFlag:
      billingInfo.bikeImmediatePaymentFlag === '0' ? true : false,
    bikeDocumentAdvanceFlag:
      billingInfo.bikeDocumentAdvanceFlag === '0' ? true : false,
    bikeArrearsPriceAutomaticOccurrenceFlag:
      billingInfo.bikeArrearsPriceAutomaticOccurrenceFlag === '0'
        ? true
        : false,
    bikeOffsettingFlag: billingInfo.bikeOffsettingFlag === '0' ? true : false,
    bikeAuctionEntryLimitFlag:
      billingInfo.bikeAuctionEntryLimitFlag === '0' ? true : false,
    bikeDemandMailSendFlag: billingInfo.bikeDemandMailSendFlag,
    bikeDemandFaxSendFlag: billingInfo.bikeDemandFaxSendFlag,
    bikeStatementMailSendFlag: billingInfo.bikeStatementMailSendFlag,
    bikeStatementFaxSendFlag: billingInfo.bikeStatementFaxSendFlag,
    screenId: '',
    tabId: 0,
    applicationEmployeeId: user,
    registrationChangeMemo: registrationChangeMemo,
    changeExpectDate: new Date(billingInfo.changeExpectedDate),
  };
};

const ScrMem0008BasicTab = (props: {
  chengeTabDisableds: (tabDisableds: TabDisabledsModel) => void;
}) => {
  // router
  const { corporationId, billingId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const { user } = useContext(AuthContext);

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [changeHistory, setChangeHistory] = useState<any>([]);
  const [contractRow, setContractRow] = useState<contractRowModel[]>([]);
  const [scrCom00032PopupIsOpen, setScrCom00032PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckIsOpen, setChangeHistoryDateCheckIsOpen] =
    useState<boolean>(false);

  const [tvaaImmediatePaymentFlagRadio, setTvaaImmediatePaymentFlagRadio] =
    useState<RadioValue[]>([
      { value: 0, displayValue: '可' },
      { value: 1, displayValue: '不可' },
    ]);
  const [tvaaDocumentAdvanceFlagRadio, setTvaaDocumentAdvanceFlagRadio] =
    useState<RadioValue[]>([
      { value: 0, displayValue: '可' },
      { value: 1, displayValue: '不可' },
    ]);
  const [
    tvaaArrearsPriceAutomaticOccurrenceFlagRadio,
    setTvaaArrearsPriceAutomaticOccurrenceFlagRadio,
  ] = useState<RadioValue[]>([
    { value: 0, displayValue: '可' },
    { value: 1, displayValue: '不可' },
  ]);
  const [tvaaOffsettingFlagRadio, setTvaaOffsettingFlagRadio] = useState<
    RadioValue[]
  >([
    { value: 0, displayValue: '可' },
    { value: 1, displayValue: '不可' },
  ]);
  const [tvaaAuctionEntryLimitFlagRadio, setTvaaAuctionEntryLimitFlagRadio] =
    useState<RadioValue[]>([
      { value: 0, displayValue: '可' },
      { value: 1, displayValue: '不可' },
    ]);
  const [bikeImmediatePaymentFlagRadio, setBikeImmediatePaymentFlagRadio] =
    useState<RadioValue[]>([
      { value: 0, displayValue: '可' },
      { value: 1, displayValue: '不可' },
    ]);
  const [bikeDocumentAdvanceFlagRadio, setBikeDocumentAdvanceFlagRadio] =
    useState<RadioValue[]>([
      { value: 0, displayValue: '可' },
      { value: 1, displayValue: '不可' },
    ]);
  const [
    bikeArrearsPriceAutomaticOccurrenceFlagRadio,
    setBikeArrearsPriceAutomaticOccurrenceFlagRadio,
  ] = useState<RadioValue[]>([
    { value: 0, displayValue: '可' },
    { value: 1, displayValue: '不可' },
  ]);
  const [bikeOffsettingFlagRadio, setBikeOffsettingFlagRadio] = useState<
    RadioValue[]
  >([
    { value: 0, displayValue: '可' },
    { value: 1, displayValue: '不可' },
  ]);
  const [bikeAuctionEntryLimitFlagRadio, setBikeAuctionEntryLimitFlagRadio] =
    useState<RadioValue[]>([
      { value: 0, displayValue: '可' },
      { value: 1, displayValue: '不可' },
    ]);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0008') === -1
  );
  // form
  const methods = useForm<BillingInfoModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    watch,
    getValues,
    setValue,
    reset,
  } = methods;

  // 初期表示処理
  useEffect(() => {
    const initialize = async (corporationId: string, billingId: string) => {
      // 請求先一覧取得
      const getBillingInfoRequest = {
        billingId: billingId,
        corporationId: corporationId,
      };
      const getBillingInfoResponse = await ScrMem0008GetBillingInfo(
        getBillingInfoRequest
      );
      const billingInfo = convertToBillingInfoModel(
        getBillingInfoResponse,
        '',
        ''
      );
      // ラジオボタンのラベル背景色変更
      // 四輪即払可否
      const newTvaaImmediatePaymentFlagRadio = tvaaImmediatePaymentFlagRadio;
      if (billingInfo.tvaaImmediatePaymentFlag === '0') {
        newTvaaImmediatePaymentFlagRadio[0].backgroundColor = '#6fb9ff';
      } else if (billingInfo.tvaaImmediatePaymentFlag === '1') {
        newTvaaImmediatePaymentFlagRadio[1].backgroundColor = '#6fb9ff';
      }
      setTvaaImmediatePaymentFlagRadio(newTvaaImmediatePaymentFlagRadio);

      // 四輪書類先出し
      const newTvaaDocumentAdvanceFlagRadio = tvaaDocumentAdvanceFlagRadio;
      if (billingInfo.tvaaDocumentAdvanceFlag === '0') {
        newTvaaDocumentAdvanceFlagRadio[0].backgroundColor = '#6fb9ff';
      } else if (billingInfo.tvaaDocumentAdvanceFlag === '1') {
        newTvaaDocumentAdvanceFlagRadio[1].backgroundColor = '#6fb9ff';
      }
      setTvaaDocumentAdvanceFlagRadio(newTvaaDocumentAdvanceFlagRadio);

      // 四輪延滞金の自動発生可否フラグ
      const newTvaaArrearsPriceAutomaticOccurrenceFlagRadio =
        tvaaArrearsPriceAutomaticOccurrenceFlagRadio;
      if (billingInfo.tvaaArrearsPriceAutomaticOccurrenceFlag === '0') {
        newTvaaArrearsPriceAutomaticOccurrenceFlagRadio[0].backgroundColor =
          '#6fb9ff';
      } else if (billingInfo.tvaaArrearsPriceAutomaticOccurrenceFlag === '1') {
        newTvaaArrearsPriceAutomaticOccurrenceFlagRadio[1].backgroundColor =
          '#6fb9ff';
      }
      setTvaaArrearsPriceAutomaticOccurrenceFlagRadio(
        newTvaaArrearsPriceAutomaticOccurrenceFlagRadio
      );

      // 四輪相殺要否
      const newTvaaOffsettingFlagRadio = tvaaOffsettingFlagRadio;
      if (billingInfo.tvaaOffsettingFlag === '0') {
        newTvaaOffsettingFlagRadio[0].backgroundColor = '#6fb9ff';
      } else if (billingInfo.tvaaOffsettingFlag === '1') {
        newTvaaOffsettingFlagRadio[1].backgroundColor = '#6fb9ff';
      }
      setTvaaOffsettingFlagRadio(newTvaaOffsettingFlagRadio);

      // 四輪オークション参加制限可否
      const newTvaaAuctionEntryLimitFlagRadio = tvaaAuctionEntryLimitFlagRadio;
      if (billingInfo.tvaaAuctionEntryLimitFlag === '0') {
        newTvaaAuctionEntryLimitFlagRadio[0].backgroundColor = '#6fb9ff';
      } else if (billingInfo.tvaaAuctionEntryLimitFlag === '1') {
        newTvaaAuctionEntryLimitFlagRadio[1].backgroundColor = '#6fb9ff';
      }
      setTvaaAuctionEntryLimitFlagRadio(newTvaaAuctionEntryLimitFlagRadio);

      // 二輪即払可否
      const newBikeImmediatePaymentFlagRadio = bikeImmediatePaymentFlagRadio;
      if (billingInfo.bikeImmediatePaymentFlag === '0') {
        newBikeImmediatePaymentFlagRadio[0].backgroundColor = '#6fb9ff';
      } else if (billingInfo.bikeImmediatePaymentFlag === '1') {
        newBikeImmediatePaymentFlagRadio[1].backgroundColor = '#6fb9ff';
      }
      setBikeImmediatePaymentFlagRadio(newBikeImmediatePaymentFlagRadio);

      // 四輪書類先出し
      const newBikeDocumentAdvanceFlagRadio = bikeDocumentAdvanceFlagRadio;
      if (billingInfo.bikeDocumentAdvanceFlag === '0') {
        newBikeDocumentAdvanceFlagRadio[0].backgroundColor = '#6fb9ff';
      } else if (billingInfo.bikeDocumentAdvanceFlag === '1') {
        newBikeDocumentAdvanceFlagRadio[1].backgroundColor = '#6fb9ff';
      }
      setBikeDocumentAdvanceFlagRadio(newBikeDocumentAdvanceFlagRadio);

      // 四輪延滞金の自動発生可否フラグ
      const newBikeArrearsPriceAutomaticOccurrenceFlagRadio =
        bikeArrearsPriceAutomaticOccurrenceFlagRadio;
      if (billingInfo.bikeArrearsPriceAutomaticOccurrenceFlag === '0') {
        newBikeArrearsPriceAutomaticOccurrenceFlagRadio[0].backgroundColor =
          '#6fb9ff';
      } else if (billingInfo.bikeArrearsPriceAutomaticOccurrenceFlag === '1') {
        newBikeArrearsPriceAutomaticOccurrenceFlagRadio[1].backgroundColor =
          '#6fb9ff';
      }
      setBikeArrearsPriceAutomaticOccurrenceFlagRadio(
        newBikeArrearsPriceAutomaticOccurrenceFlagRadio
      );

      // 四輪相殺要否
      const newBikeOffsettingFlagRadio = bikeOffsettingFlagRadio;
      if (billingInfo.bikeOffsettingFlag === '0') {
        newBikeOffsettingFlagRadio[0].backgroundColor = '#6fb9ff';
      } else if (billingInfo.bikeOffsettingFlag === '1') {
        newBikeOffsettingFlagRadio[1].backgroundColor = '#6fb9ff';
      }
      setBikeOffsettingFlagRadio(newBikeOffsettingFlagRadio);

      // 四輪オークション参加制限可否
      const newBikeAuctionEntryLimitFlagRadio = bikeAuctionEntryLimitFlagRadio;
      if (billingInfo.bikeAuctionEntryLimitFlag === '0') {
        newBikeAuctionEntryLimitFlagRadio[0].backgroundColor = '#6fb9ff';
      } else if (billingInfo.bikeAuctionEntryLimitFlag === '1') {
        newBikeAuctionEntryLimitFlagRadio[1].backgroundColor = '#6fb9ff';
      }
      setBikeAuctionEntryLimitFlagRadio(newBikeAuctionEntryLimitFlagRadio);

      reset(billingInfo);

      const contractRow: contractRowModel[] = [];
      getBillingInfoResponse.contractInfo.map((x) => {
        contractRow.push({
          id: x.contractId,
          contractId: x.contractId,
          claimMethodKind: x.claimMethodKind,
        });
      });
      setContractRow(contractRow);

      // 変更予定日取得API
      const getChangeDateRequest: ScrCom9999GetChangeDateRequest = {
        screenId: 'SCR-MEM-0008',
        tabId: 'B-13',
        masterId: corporationId + ',' + billingId,
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

      const selectValues = selectValuesInitialValues;
      // 共通管理コード値取得API（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const getCodeValueResponse = await ScrCom9999GetCodeValue(
        getCodeValueRequest
      );
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            selectValues.prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 事業拠点一覧取得機能API
      const getBusinessInfoRequest = {
        corporationId: corporationId,
        businessBaseId: '',
      };
      const getBusinessInfoResponse = await ScrMem9999GetBusinessInfo(
        getBusinessInfoRequest
      );
      getBusinessInfoResponse.businessInfo.map((x) => {
        selectValues.originBusinessSelectValues.push({
          value: x.businessBaseId,
          displayValue: x.businessBaseName,
        });
      });

      setSelectValues({
        originBusinessSelectValues: selectValues.originBusinessSelectValues,
        prefectureCodeSelectValues: selectValues.prefectureCodeSelectValues,
      });
    };

    const historyInitialize = async (
      corporationId: string,
      applicationId: string
    ) => {
      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response = await ScrMem9999GetHistoryInfo(request);
      const corporationBasic = convertToHistoryBillingInfoModel(
        response,
        applicationId,
        ''
      );
      reset(corporationBasic);

      const selectValues = selectValuesInitialValues;
      // 共通管理コード値取得API（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const getCodeValueResponse = await ScrCom9999GetCodeValue(
        getCodeValueRequest
      );
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            selectValues.prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 事業拠点一覧取得機能API
      const getBusinessInfoRequest = {
        corporationId: corporationId,
        businessBaseId: '',
      };
      const getBusinessInfoResponse = await ScrMem9999GetBusinessInfo(
        getBusinessInfoRequest
      );
      getBusinessInfoResponse.businessInfo.map((x) => {
        selectValues.originBusinessSelectValues.push({
          value: x.businessBaseId,
          displayValue: x.businessBaseName,
        });
      });

      setSelectValues({
        originBusinessSelectValues: selectValues.originBusinessSelectValues,
        prefectureCodeSelectValues: selectValues.prefectureCodeSelectValues,
      });
    };

    const newInitialize = async (corporationId: string) => {
      // 法人基本情報取得
      const getCorpBasicInfoRequest = {
        corporationId: corporationId,
      };
      const getCorpBasicInfoResponse = await ScrMem9999GetCorpBasicInfo(
        getCorpBasicInfoRequest
      );
      const billingInfo = initialValues;
      billingInfo.corporationId = getCorpBasicInfoResponse.corporationId;
      billingInfo.corporationName = getCorpBasicInfoResponse.corporationName;
      reset(billingInfo);

      const selectValues = selectValuesInitialValues;
      // 共通管理コード値取得API（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const getCodeValueResponse = await ScrCom9999GetCodeValue(
        getCodeValueRequest
      );
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            selectValues.prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 事業拠点一覧取得機能API
      const getBusinessInfoRequest = {
        corporationId: corporationId,
        businessBaseId: '',
      };
      const getBusinessInfoResponse = await ScrMem9999GetBusinessInfo(
        getBusinessInfoRequest
      );
      getBusinessInfoResponse.businessInfo.map((x) => {
        selectValues.originBusinessSelectValues.push({
          value: x.businessBaseId,
          displayValue: x.businessBaseName,
        });
      });

      setSelectValues({
        originBusinessSelectValues: selectValues.originBusinessSelectValues,
        prefectureCodeSelectValues: selectValues.prefectureCodeSelectValues,
      });

      props.chengeTabDisableds({
        ScrMem0008BasicTab: false,
        ScrMem0008BankTab: true,
      });
    };

    if (corporationId === undefined || corporationId === 'new') {
      return;
    }

    if (billingId === undefined || billingId === 'new') {
      newInitialize(corporationId);
      return;
    }

    if (applicationId !== null) {
      historyInitialize(corporationId, applicationId);
    }

    initialize(corporationId, billingId);
  }, [corporationId, billingId, applicationId, reset]);

  /**
   * 項目変更のイベントハンドラ
   */
  useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      // コピー元事業拠点選択時
      if (name === 'corporationName') {
        if (corporationId === undefined || value.corporationName === undefined)
          return;
        // 事業拠点一覧取得機能
        const getBusinessInfoRequest = {
          corporationId: corporationId,
          businessBaseId: value.corporationName,
        };
        const getBusinessInfoResponse = await ScrMem9999GetBusinessInfo(
          getBusinessInfoRequest
        );

        // 事業拠点情報変更
        setValue(
          'billingZipCode',
          getBusinessInfoResponse.businessInfo[0].businessBaseZipCode
        );
        setValue(
          'billingPrefectureCode',
          getBusinessInfoResponse.businessInfo[0].businessBasePrefectureCode
        );
        setValue(
          'billingMunicipalities',
          getBusinessInfoResponse.businessInfo[0].businessBaseMunicipalities
        );
        setValue(
          'billingAddressBuildingName',
          getBusinessInfoResponse.businessInfo[0]
            .businessBaseAddressBuildingName
        );
        setValue(
          'billingPhoneNumber',
          getBusinessInfoResponse.businessInfo[0].businessBasePhoneNumber
        );
        return;
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  /**
   * 会員メモ編集リンククリック時のイベントハンドラ
   */
  const handleClick = () => {
    navigate('/mem/corporations/' + corporationId);
  };

  /**
   * 表示切替クリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    // 変更履歴情報取得API
    const request = {
      changeHistoryNumber: getValues('changeHistoryNumber'),
    };
    const response = await ScrMem9999GetHistoryInfo(request);
    const corporationBasic = convertToHistoryBillingInfoModel(
      response,
      getValues('changeHistoryNumber'),
      ''
    );
    reset(corporationBasic);

    props.chengeTabDisableds({
      ScrMem0008BasicTab: false,
      ScrMem0008BankTab: true,
    });
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
  const onClickConfirm = async () => {
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

    const errorMessages: errorList[] = [];

    // 請求先詳細基本情報の関連チェック
    // 四輪即時出金限度金額＞四輪即時出金対象譲渡書類未到達限度金額のチェック
    const tvaaImmediatePaymentLimitAmount = getValues(
      'tvaaImmediatePaymentLimitAmount'
    );
    const tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount = getValues(
      'tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount'
    );
    if (
      tvaaImmediatePaymentLimitAmount >
      tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount
    ) {
      errorMessages.push({
        errorCode: 'MSG-FR-ERR-00060',
        errorMessage:
          '四輪の即時出金限度金額と即時出金対象譲渡書類未到達限度金額が正しくありません',
      });
    }

    // 二輪即時出金限度金額＞二輪即時出金対象譲渡書類未到達限度金額のチェック
    const bikeImmediatePaymentLimitAmount = getValues(
      'bikeImmediatePaymentLimitAmount'
    );
    const bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount = getValues(
      'bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount'
    );
    if (
      bikeImmediatePaymentLimitAmount >
      bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount
    ) {
      errorMessages.push({
        errorCode: 'MSG-FR-ERR-00061',
        errorMessage:
          '二輪の即時出金限度金額と即時出金対象譲渡書類未到達限度金額が正しくありません',
      });
    }

    setScrCom0032PopupData({
      errorList: errorMessages,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0008',
          screenName: '請求先詳細',
          tabId: 13,
          tabName: '基本情報',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      // TODO:業務日付取得方法実装待ち
      changeExpectDate: '',
    });
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

    // 請求先基本情報登録
    const registrationBillingInfoRequest = convertFromCorporationInfoModel(
      getValues(),
      contractRow,
      user.employeeId,
      registrationChangeMemo
    );
    await ScrMem0008RegistrationBillingInfo(registrationBillingInfoRequest);
  };

  /**
   * 郵便番号フォーカスアウト時のイベントハンドラ
   */
  const onBlur = async () => {
    // 住所情報取得
    const getAddressInfoRequest = {
      zipCode: getValues('billingZipCode'),
    };
    const getBusinessInfoResponse = await ScrCom9999GetAddressInfo(
      getAddressInfoRequest
    );
    setValue('billingPrefectureCode', getBusinessInfoResponse.prefectureCode);
    setValue('billingMunicipalities', getBusinessInfoResponse.municipalities);
    setValue(
      'billingAddressBuildingName',
      getBusinessInfoResponse.townOrStreetName
    );
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
                  <Select
                    label='コピー元事業拠点'
                    name='billingAddressContactSynchronizationBusinessBaseId'
                    selectValues={selectValues.originBusinessSelectValues}
                    blankOption
                  />
                  <PostalTextField
                    label='郵便番号'
                    name='billingZipCode'
                    onBlur={onBlur}
                  />
                  <Select
                    label='都道府県'
                    name='billingPrefectureCode'
                    selectValues={selectValues.prefectureCodeSelectValues}
                    blankOption
                  />
                  <TextField
                    label='市区町村'
                    name='billingMunicipalities'
                    size='m'
                  />
                  <TextField
                    label='番地・号/建物名など'
                    name='billingAddressBuildingName'
                    size='m'
                  />
                  <TextField label='TEL' name='billingPhoneNumber' />
                </ColStack>
                <ColStack>
                  <TextField
                    label='法人名称'
                    name='corporationName'
                    readonly
                    size='m'
                  />
                  <TextField label='FAX' name='billingFaxNumber' />
                  <TextField
                    label='メールアドレス'
                    name='billingMailAddress'
                    size='m'
                  />
                  <TextField label='請求先名称' name='billingName' size='m' />
                </ColStack>
                <ColStack>
                  <TextField label='請求先ID' name='billingId' readonly />
                </ColStack>
              </RowStack>
              <RowStack>
                <MarginBox mt={10} mb={10}>
                  <DataGrid columns={contractColumns} rows={contractRow} />
                </MarginBox>
              </RowStack>
              <RowStack>
                <ColStack>
                  <Typography bold>四輪</Typography>
                  <PriceTextField
                    label='即時出金限度額'
                    name='tvaaImmediatePaymentLimitAmount'
                    size='m'
                  />
                  <PriceTextField
                    label='即時出金対象譲渡書類未到着限度額'
                    name='tvaaImdtPaymentAssignmentDocumentUnreachedLimitAmount'
                    size='m'
                  />
                  <Radio
                    label='即払可否'
                    name='tvaaImmediatePaymentFlag'
                    radioValues={tvaaImmediatePaymentFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='書類先出し'
                    name='tvaaDocumentAdvanceFlag'
                    radioValues={tvaaDocumentAdvanceFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='延滞金の自動発生可否フラグ'
                    name='tvaaArrearsPriceAutomaticOccurrenceFlag'
                    radioValues={tvaaArrearsPriceAutomaticOccurrenceFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='相殺要否'
                    name='tvaaOffsettingFlag'
                    radioValues={tvaaOffsettingFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='オークション参加制限可否'
                    name='tvaaAuctionEntryLimitFlag'
                    radioValues={tvaaAuctionEntryLimitFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <InputLayout label='督促状発行' size='s'>
                    <InputRowStack>
                      <Checkbox name='tvaaDemandFaxSendFlag' label='FAX' />
                      <Checkbox name='tvaaDemandMailSendFlag' label='メール' />
                    </InputRowStack>
                  </InputLayout>
                  <InputLayout label='計算書送信フラグ' size='s'>
                    <InputRowStack>
                      <Checkbox name='tvaaStatementFaxSendFlag' label='FAX' />
                      <Checkbox
                        name='tvaaStatementMailSendFlag'
                        label='メール'
                      />
                    </InputRowStack>
                  </InputLayout>
                </ColStack>
                <ColStack>
                  <Typography bold>二輪</Typography>
                  <PriceTextField
                    label='即時出金限度額'
                    name='bikeImmediatePaymentLimitAmount'
                    size='m'
                  />
                  <PriceTextField
                    label='即時出金対象譲渡書類未到着限度額'
                    name='bikeImdtPaymentAssignmentDocumentUnreachedLimitAmount'
                    size='m'
                  />
                  <Radio
                    label='即払可否'
                    name='bikeImmediatePaymentFlag'
                    radioValues={bikeImmediatePaymentFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='書類先出し'
                    name='bikeDocumentAdvanceFlag'
                    radioValues={bikeDocumentAdvanceFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='延滞金の自動発生可否フラグ'
                    name='bikeArrearsPriceAutomaticOccurrenceFlag'
                    radioValues={bikeArrearsPriceAutomaticOccurrenceFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='相殺要否'
                    name='bikeOffsettingFlag'
                    radioValues={bikeOffsettingFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <Radio
                    label='オークション参加制限可否'
                    name='bikeAuctionEntryLimitFlag'
                    radioValues={bikeAuctionEntryLimitFlagRadio}
                    disabled={isReadOnly[0]}
                  />
                  <InputLayout label='督促状発行' size='s'>
                    <InputRowStack>
                      <Checkbox name='bikeDemandFaxSendFlag' label='FAX' />
                      <Checkbox name='bikeDemandMailSendFlag' label='メール' />
                    </InputRowStack>
                  </InputLayout>
                  <InputLayout label='計算書送信フラグ' size='s'>
                    <InputRowStack>
                      <Checkbox name='bikeStatementFaxSendFlag' label='FAX' />
                      <Checkbox
                        name='bikeStatementMailSendFlag'
                        label='メール'
                      />
                    </InputRowStack>
                  </InputLayout>
                </ColStack>
              </RowStack>
            </Section>
            <Section name='会員メモ'>
              <RowStack>
                <ColStack>
                  <Link href='#' onClick={handleClick}>
                    会員メモ編集
                  </Link>
                </ColStack>
                <ColStack>
                  <Textarea name='memberMemo' disabled={true} size='l' />
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

export default ScrMem0008BasicTab;
