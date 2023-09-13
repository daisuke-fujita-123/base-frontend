import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';
import { ObjectSchema } from 'yup';

import ScrCom0038Popup from 'pages/com/popups/ScrCom0038Popup';

import { CenterBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

import { BoxedText, BoxedTextLabel } from 'controls/BoxedText';
import { CancelButton, ConfirmButton, PrintButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { CaptionLabel } from 'controls/Label';
import { Select, SelectValue } from 'controls/Select';
import { theme } from 'controls/theme';
import { SerchLabelText } from 'controls/Typography';

import { ScrCom9999getCodeManagementMasterMultiple } from 'apis/com/ScrCom9999Api';
import {
  ScrMem9999SearchconditionRefine,
  ScrMem9999SearchconditionRefineRequest,
} from 'apis/mem/ScrMem9999Api';
import {
  ScrTra0018CheckReceiptDetail,
  ScrTra0018CheckReceiptDetailRequest,
  ScrTra0018CheckReceiptDetailResponse,
  ScrTra0018GetReceiptDetail,
  ScrTra0018GetReceiptDetailRequest,
  ScrTra0018GetReceiptDetailResponse,
  ScrTra0018RegistrationReceiptDetail,
  ScrTra0018RegistrationReceiptDetailRequest,
} from 'apis/tra/ScrTra0018Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';
import { MessageContext } from 'providers/MessageProvider';

import { ThemeProvider } from '@mui/material';

// 画面ID定数
const SCR_TRA_0016 = 'SCR-TRA-0016'; // 入金一覧
const SCR_TRA_0018 = 'SCR-TRA-0018'; // 入金詳細(自画面)
const SCR_TRA_0034 = 'SCR-TRA-0034'; // 元帳一覧

// 判断区分定数
const TVAA = '1'; // CDE-COM-0062:1:四輪
const OMATOME = '2'; // CDE-COM-0062:2:おまとめ
const BAA = '3'; // CDE-COM-0062:3:二輪
const NORMAL_BILLING = '4'; // CDE-COM-0062:4:一般請求
const NORMAL = '2'; // CDE-COM-0095:2:通常
const EXTENSION = '3'; // CDE-COM-0095:3:延長

const NOT_ARRIVES = '1'; // CDE-COM-0096:1:未着
const INCOMPLETE = '2'; // CDE-COM-0096:2:不備
const ARRIVES = '3'; // CDE-COM-0096:3:到着
const NOT_DOCUMENT = '4'; // CDE-COM-0096:4:書無
const SHIPPINGED = '5'; // CDE-COM-0096:5:発送済

const GUARANTEE_DEPOSIT = '2'; // CDE-COM-0115:2:保証金

// コード管理マスタ定数(検索引数用)
const CDE_COM_0062 = 'CDE-COM-0062'; // 請求種別
const CDE_COM_0094 = 'CDE-COM-0094'; // 取引区分
const CDE_COM_0095 = 'CDE-COM-0095'; // 請求区分
const CDE_COM_0096 = 'CDE-COM-0096'; // 書類状況区分
const CDE_COM_0104 = 'CDE-COM-0104'; // 請求種別 TODO:存在しない
const CDE_COM_0114 = 'CDE-COM-0114'; // 入金口座種別
const CDE_COM_0115 = 'CDE-COM-0115'; // 預かり金区分
const CDE_COM_0116 = 'CDE-COM-0116'; // 預かり金処理区分

// 背景色
const GRAY_COLOR = '#CCCCCC'; // 灰色

/**
 * プルダウンデータモデル(法人ID/法人名)
 */
interface corporationGroupIdSelectValuesModel {
  corporationGroupIdSelectValues: SelectValue[];
}

/**
 * プルダウンデータモデル(請求先ID)
 */
interface billingIdSelectValuesModel {
  billingIdSelectValues: SelectValue[];
}

/**
 * 検索条件データモデル
 */
interface SearchConditionModel {
  corporationGroupId: string; // 法人ID/法人名
  billingId: string; // 請求先ID
}

/**
 * 検索条件初期データ
 */
const initialValues: SearchConditionModel = {
  corporationGroupId: '', // 法人ID/法人名
  billingId: '', // 請求先ID
};

/**
 * 検索条件初期データ
 */
const corporationIdInitialValues: corporationGroupIdSelectValuesModel = {
  corporationGroupIdSelectValues: [], // 法人ID/法人名
};

/**
 * 検索条件初期データ
 */
const billingIdInitialValues: billingIdSelectValuesModel = {
  billingIdSelectValues: [], // 請求先ID
};

/** 債権・預かり金表示範囲セクションの表 */
/** 債権・預かり金表示範囲 : 四輪(項目) */
const tvaaLabels: BoxedTextLabel[] = [
  {
    label: '通常',
    field: 'normal',
  },
  {
    label: '延長',
    field: 'extension',
  },
  {
    label: '総請求残高',
    field: 'totalBillingBalance',
  },
  {
    label: undefined,
  },
  {
    label: '書類未到着',
    field: 'documentUnArrives',
  },
];

/** 債権・預かり金表示範囲 : おまとめ(項目) */
const omatomeLabels: BoxedTextLabel[] = [
  {
    label: '通常',
    field: 'normal',
  },
  {
    label: '延長',
    field: 'extension',
  },
  {
    label: '総請求残高',
    field: 'totalBillingBalance',
  },
];

/** 債権・預かり金表示範囲 : 二輪(項目) */
const baaLabels: BoxedTextLabel[] = [
  {
    label: '通常',
    field: 'normal',
  },
  {
    label: '延長',
    field: 'extension',
  },
  {
    label: '総請求残高',
    field: 'totalBillingBalance',
  },
  {
    label: undefined,
  },
  {
    label: '書類未到着',
    field: 'documentUnArrives',
  },
];

/** 債権・預かり金表示範囲 : 一般請求(項目) */
const generalPaymentLabels: BoxedTextLabel[] = [
  {
    label: '総請求残高',
    field: 'totalBillingBalance',
  },
];

/** 債権・預かり金表示範囲 : 出金保留明細(項目) */
const paymentPendingdetailsLabels: BoxedTextLabel[] = [
  {
    label: '四輪',
    field: 'tvaa',
  },
  {
    label: 'おまとめ',
    field: 'omatome',
  },
  {
    label: '二輪',
    field: 'baa',
  },
  {
    label: '一般請求',
    field: 'general',
  },
];

/** 債権・預かり金表示範囲 : 四輪(値) */
const tvaaValues = {
  normal: '0',
  extension: '0',
  totalBillingBalance: '0',
  documentUnArrives: '0',
};

/** 債権・預かり金表示範囲 : おまとめ(値) */
const omatomeValues = {
  normal: '0',
  extension: '0',
  totalBillingBalance: '0',
};

/** 債権・預かり金表示範囲 : 二輪(値) */
const baaValues = {
  normal: '0',
  extension: '0',
  totalBillingBalance: '0',
  documentUnArrives: '0',
};

/** 債権・預かり金表示範囲 : 一般請求(値) */
const generalPaymentValues = {
  normal: '0',
  extension: '0',
  totalBillingBalance: '0',
  documentUnArrives: '0',
};

/** 債権・預かり金表示範囲 : 出金保留明細(値) */
const paymentPendingdetailsValues = {
  tvaa: '0',
  omatome: '0',
  baa: '0',
  general: '0',
};

/** 処理額合計セクションの表 */
/** 処理額合計 : 表1(項目) */
const processTotal1Labels: BoxedTextLabel[] = [
  {
    label: '入金額',
    field: 'receiptAmount',
  },
  {
    label: '預かり金処理金額',
    field: 'depositProcessAmount',
  },
  {
    label: '合計金額',
    field: 'totalAmount',
  },
  {
    label: undefined,
  },
  {
    label: '未処理金額',
    field: 'notProcessAmount',
  },
];

/** 処理額合計 : 表2(項目) */
const processTotal2Labels: BoxedTextLabel[] = [
  {
    label: '充当金額',
    field: 'appropriationAmount',
  },
  {
    label: '預かり金登録金額',
    field: 'depositPreliminaryAmount',
  },
  {
    label: '対象外金額',
    field: 'notTargetedAmount',
  },
  {
    label: '自税返金額',
    field: 'carTaxCashBackAmount',
  },
  {
    label: '合計金額',
    field: 'totalAmount',
  },
];

/** 処理額合計 : 表1(値) */
const processTotal1Values = {
  receiptAmount: '0',
  depositProcessAmount: '0',
  totalAmount: '0',
  notProcessAmount: '0',
};

/** 処理額合計 : 表2(値) */
const processTotal2Values = {
  appropriationAmount: '0',
  depositPreliminaryAmount: '0',
  notTargetedAmount: '0',
  carTaxCashBackAmount: '0',
  totalAmount: '0',
};

// 背景色
const handleGetFieldBackgroundColor = (value: string) => {
  if (value === '0') return GRAY_COLOR;
  return undefined;
};

/**
 * API-MEM-9999-0023 / 検索条件絞込API
 * 検索条件モデルから検索条件絞込APIリクエストへの変換
 */
const convertToSearchconditionRefine = (
  contractId: string,
  corporationId: string,
  billingId: string
): ScrMem9999SearchconditionRefineRequest => {
  return {
    contractId: contractId,
    corporationId: corporationId,
    billingId: billingId,
  };
};

/**
 * 検索条件モデルから入金情詳細APIリクエストへの変換
 */
const convertGetReceiptDetailModel = (
  searchParam: ScrTra0018GetReceiptDetailRequest
): ScrTra0018GetReceiptDetailRequest => {
  return {
    /** 入金グループID */
    receiptGroupId: searchParam.receiptGroupId,
    /** 入金番号 */
    receiptId: searchParam.receiptId,
    /** 法人ID */
    corporationId: searchParam.corporationId,
    /** 請求先IDリスト */
    billingIdList: searchParam.billingIdList,
  };
};

/**
 * 入金一覧検索APIレスポンスから預かり金一覧モデルへの変換
 */
const convertToDepositRowsValuesRowModel = (
  response: ScrTra0018GetReceiptDetailResponse
): DepositRowsValuesRowModel[] => {
  return response.depositList.map((x, index) => {
    return {
      id: index.toString(),
      depositId: x.depositId,
      receiptAccountKind: response.receiptAccountKind,
      billingId: x.billingId,
      accountingDate: response.accountingDate,
      depositAmountKind: x.depositAmountKind,
      depositAmount: x.depositAmount,
      depositProcess: x.depositProcess,
      balance: x.balance,
      provisionalOPocessDetail: x.provisionalOPocessDetail,
      memo: x.memo,
      inputId: x.inputId,
      inputName: x.inputName,
    };
  });
};

/**
 * 入金一覧検索APIレスポンスから四輪債権一覧モデルへの変換
 */
const convertToReceivablesRowsValues = (
  response: ScrTra0018GetReceiptDetailResponse
): ReceivablesRowsValuesRowModel[] => {
  return response.receivablesList.map((x, index) => {
    return {
      id: index.toString(),
      dealKind: x.dealKind,
      claimKind: x.claimKind,
      placeName: x.placeName,
      sessionDate: x.sessionDate,
      auctionCount: x.auctionCount,
      exhibitNumber: x.exhibitNumber,
      carName: x.carName,
      carNumber: x.carNumber,
      receiptDueDate: x.receiptDueDate,
      claimAmount: x.claimAmount,
      appropriationedAmount: x.appropriationedAmount,
      appropriationAmount: x.appropriationAmount,
      claimBalance: x.claimBalance,
      documentStatusKind: x.documentStatusKind,
      documentArrivesCalculateExpectAmount:
        x.documentArrivesCalculateExpectAmount,
      billingId: x.billingId,
      claimDate: x.claimDate,
      accountingDate: x.accountingDate,
      claimClassification: x.claimClassification,
    };
  });
};

/**
 * 入金一覧検索APIレスポンスから一般債権一覧モデルへの変換
 */
const convertToGeneralReceivablesRowsValues = (
  response: ScrTra0018GetReceiptDetailResponse
): GeneralRowsValuesRowModel[] => {
  return response.receivablesList.map((x, index) => {
    return {
      id: index.toString(),
      dealKind: x.dealKind,
      receiptDueDate: x.receiptDueDate,
      claimAmount: x.claimAmount,
      appropriationedAmount: x.appropriationedAmount,
      appropriationAmount: x.appropriationAmount,
      claimBalance: x.claimBalance,
      billingId: x.billingId,
      claimDate: x.claimDate,
      accountingDate: x.accountingDate,
    };
  });
};

/**
 * 入金一覧検索APIレスポンスから預かり金登録モデルへの変換
 */
const convertToDepositRegistrationReceivablesRowsValues = (
  response: ScrTra0018GetReceiptDetailResponse
): DepositRegistrationRowsValuesRowModel[] => {
  return response.depositList.map((x, index) => {
    return {
      id: index.toString(),
      receiptAccountKind: x.depositId,
      billingId: x.billingId,
      depositAmountKind: x.depositAmountKind,
      depositAmount: x.depositProcess,
      provisionalOPocessDetail: x.provisionalOPocessDetail,
      memo: x.memo,
      inputId: x.inputId,
      inputName: x.inputName,
    };
  });
};

/**
 * 入金伝票詳細チェックAPIレスポンスからモデルへ変更
 */
const convertApiToCheckReceiptDetailModel = (
  response: ScrTra0018CheckReceiptDetailResponse
): CheckReceiptDetailResponse => {
  return {
    warningList: response.warningList,
    errorList: response.errorList,
  };
};

type key = keyof SearchConditionModel;

const serchData: { label: string; name: key }[] = [
  { label: '法人ID/法人名', name: 'corporationGroupId' },
  { label: '請求先ID', name: 'billingId' },
];

/**
 * 預かり金一覧の項目名
 */
const depositColumns: GridColDef[] = [
  {
    field: 'depositId',
    headerName: '預かり金ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'receiptAccountKind',
    headerName: '入金口座種別',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'accountingDate',
    headerName: '会計処理日',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'depositAmountKind',
    headerName: '預かり金区分',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'depositAmount',
    headerName: '預かり金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'depositProcess',
    headerName: '処理金額',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'balance',
    headerName: '残額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'provisionalOPocessDetail',
    headerName: '仮処理内容',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'memo',
    headerName: 'メモ',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'inputId',
    headerName: '入力者ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'inputName',
    headerName: '入力者名',
    cellType: 'default',
    size: 'm',
  },
];
/**
 * 預かり金一覧行データモデル
 */
interface DepositRowsValuesRowModel {
  // internal ID
  id: string;
  // 預かり金ID
  depositId: string;
  // 入金口座種別
  receiptAccountKind: string;
  // 請求先ID
  billingId: string;
  // 会計処理日
  accountingDate: string;
  // 預かり金区分
  depositAmountKind: string;
  // 預かり金額
  depositAmount: number;
  // 処理金額
  depositProcess: number;
  // 残額
  balance: number;
  // 仮処理内容
  provisionalOPocessDetail: string;
  // メモ
  memo: string;
  // 入力者ID
  inputId: string;
  // 入力者名
  inputName: string;
}

/**
 * 四輪,おまとめ,二輪債権一覧の項目名
 */
const receivablesColumns: GridColDef[] = [
  {
    field: 'dealKind',
    headerName: '取引区分',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'claimKind',
    headerName: '請求区分',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'placeName',
    headerName: '会場名',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'sessionDate',
    headerName: '開催日',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'auctionCount',
    headerName: '開催回数',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'exhibitNumber',
    headerName: '出品番号',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'carName',
    headerName: '車名',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'carNumber',
    headerName: '車台番号',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'receiptDueDate',
    headerName: '入金期日',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'claimAmount',
    headerName: '請求金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'appropriationedAmount',
    headerName: '充当済金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'appropriationAmount',
    headerName: '充当金額',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'claimBalance',
    headerName: '請求残額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'documentStatusKind',
    headerName: '書類発送状況',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'documentArrivesCalculateExpectAmount',
    headerName: '書類到着精算予定金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'claimDate',
    headerName: '請求日',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'accountingDate',
    headerName: '会計処理日',
    cellType: 'default',
    size: 'm',
  },
];

/**
 * 四輪,おまとめ,二輪債権一覧データモデル
 */
interface ReceivablesRowsValuesRowModel {
  // internal ID
  id: string;
  // 取引区分
  dealKind: string;
  // 請求区分
  claimKind: string;
  // 会場名
  placeName: string;
  // 開催日
  sessionDate: string;
  // 開催回数
  auctionCount: string;
  // 出品番号
  exhibitNumber: string;
  // 車名
  carName: string;
  // 車台番号
  carNumber: string;
  // 入金期日
  receiptDueDate: string;
  // 請求金額
  claimAmount: number;
  // 充当済金額
  appropriationedAmount: number;
  // 充当金額
  appropriationAmount: number;
  // 請求残額
  claimBalance: number;
  // 書類発送状況
  documentStatusKind: string;
  // 書類到着精算予定金額
  documentArrivesCalculateExpectAmount: number;
  // 請求先ID
  billingId: string;
  // 請求日
  claimDate: string;
  // 会計処理日
  accountingDate: string;
  // 請求種別
  claimClassification: string;
}

/**
 * 一般債権一覧の項目名
 */
const generalColumns: GridColDef[] = [
  {
    field: 'dealKind',
    headerName: '取引区分',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'summary',
    headerName: '摘要',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'receiptDueDate',
    headerName: '入金期日',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'claimAmount',
    headerName: '請求金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'appropriationedAmount',
    headerName: '充当済金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'appropriationAmount',
    headerName: '充当金額',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'claimBalance',
    headerName: '請求残額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'XXXX',
    headerName: '伝票番号',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'claimDate',
    headerName: '請求日',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'accountingDate',
    headerName: '会計処理日',
    cellType: 'default',
    size: 'm',
  },
];

/**
 * 一般債権一覧データモデル
 */
interface GeneralRowsValuesRowModel {
  // internal ID
  id: string;
  // 取引区分
  dealKind: string;
  // 摘要
  // TODO:設計書不備のため紐づけ未定
  // 入金期日
  receiptDueDate: string;
  // 請求金額
  claimAmount: number;
  // 充当済金額
  appropriationedAmount: number;
  // 充当金額
  appropriationAmount: number;
  // 請求残額
  claimBalance: number;
  // 伝票番号
  // TODO:設計書不備のため紐づけ元未定
  // 請求先ID
  billingId: string;
  // 請求日
  claimDate: string;
  // 会計処理日
  accountingDate: string;
}

/**
 * 預かり金登録の項目名
 */
const depositRegistrationColumns: GridColDef[] = [
  {
    field: 'receiptAccountKind',
    headerName: '入金口座種別',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'depositAmountKind',
    headerName: '預かり金区分',
    cellType: 'radio',
    radioValues: [],
    size: 'm',
  },
  {
    field: 'depositAmount',
    headerName: '金額',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'provisionalOPocessDetail',
    headerName: '仮処理内容',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'memo',
    headerName: 'メモ',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'inputId',
    headerName: '入力者ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'inputName',
    headerName: '入力者名',
    cellType: 'default',
    size: 'm',
  },
];

/**
 *  預かり金登録の入金口座種別のセレクトボックスのデータモデル
 */
interface receiptAccountKindSelectBoxModel {
  value: string;
  displayValue: string;
}

/**
 * 預かり金登録の預かり金区分のラジオボタンのデータモデル
 */
interface depositAmountKindRadiobuttonModel {
  value: string;
  displayValue: string;
}
/**
 * 預かり金登録の預かり金区分のラジオボタンの初期データ
 */
const depositAmountKindRadiobuttonInitialValues: depositAmountKindRadiobuttonModel[] =
  [
    { value: '1', displayValue: '一時預かり金' },
    { value: '2', displayValue: '保証金' },
  ];

/**
 * 預かり金登録の仮処理内容のセレクトボックスのデータモデル
 */
// provisionalOPocessDetail
interface provisionalOPocessDetailModel {
  value: string;
  displayValue: string;
}

const provisionalOPocessDetailInitialValues: provisionalOPocessDetailModel[] = [
  { value: '1', displayValue: '返金' },
  { value: '2', displayValue: '充当' },
  { value: '3', displayValue: '償却' },
];

/**
 * 預かり金登録データモデル
 */
interface DepositRegistrationRowsValuesRowModel {
  // internal ID
  id: string;
  // 入金口座種別
  receiptAccountKind: string;
  // 請求先ID
  billingId: string;
  // 預かり金区分
  depositAmountKind: string;
  // 金額
  depositAmount: number;
  // 仮処理内容
  provisionalOPocessDetail: string;
  // メモ
  memo: string;
  // 入力者ID
  inputId: string;
  // 入力者名
  inputName: string;
}

/** ワーニング・エラーモデル */
interface CheckReceiptDetailResponse {
  /** エラー内容リスト */
  errorList: errorList[];
  /** ワーニング内容リスト */
  warningList: warningList[];
}

/** エラー内容リスト errorLists */
interface errorList {
  /** エラーコード */
  errorCode: string;
  /** エラーメッセージ*/
  errorMessage: string;
}

/** ワーニング内容リスト warningList */
interface warningList {
  /** エラーコード */
  warningCode: string;
  /** エラーメッセージ*/
  warningMessage: string;
}

/** エラー確認ポップアップモデル */
interface ScrCom0038PopupModel {
  // エラー内容リスト
  errorList: errorList[];
  // ワーニング内容リスト
  warningList: warningList[];
}

/**
 * 画面パラメータデータモデル
 */
interface searchParams {
  // 入金グループID
  receiptGroupId: string;
  // 入金番号
  receiptId: string;
  // 呼出元画面ID
  expirationScreenId: string;
}

/** エラー確認ポップアップモデル */
interface ScrCom0038PopupModel {
  // エラーリスト
  errorList: errorList[];
  // ワーニング内容リスト
  warningList: warningList[];
  // 呼出元画面ID
  expirationScreenId: string;
}

/** エラー確認ポップアップ初期データ */
const scrCom0038PopupInitialValues: ScrCom0038PopupModel = {
  // エラーリスト
  errorList: [],
  // ワーニングリスト
  warningList: [],
  // 呼出元画面ID
  expirationScreenId: SCR_TRA_0018,
};

/** コード管理マスタ情報のデータリスト */
interface ResultList {
  /** コードID */
  codeId: string;
  /** コードIDリスト */
  codeValueList: CodeValueList[];
}

/** API-COM-9999-0011: コード管理マスタ情報取得API レスポンス */
interface CodeValueList {
  /** コード値 */
  codeValue: string;
  /** コード名称 */
  codeName: string;
}

/** 検索項目のバリデーション */
const searchSelectConditionSchema = {
  // 法人ID/法人名は必須
  corporationGroupId: yup.string().required().label('法人ID/法人名'),
  // 請求先IDは必須
  billingId: yup.string().required().label('請求先ID'),
};

/** 入力項目のバリデーション(一覧) */
const commonInputConditionSchema: ObjectSchema<any> = yup.object({
  // 処理金額 0以下はNG
  depositProcess: yup.number().min(1).label('処理金額'),
  // 充当金額 0以下はNG
  appropriationAmount: yup.number().min(1).label('充当金額'),
});

/** 預かり金項目のバリデーション(一覧) */
const depositPreliminaryInputConditionSchema: ObjectSchema<any> = yup.object({
  // 金額 0以下はNG
  depositAmount: yup.number().min(1).label('金額'),
});

/**
 * SCR-TRA-0018 入金詳細画面
 */
const ScrTra0018Page = () => {
  // router
  const location = useLocation();
  // 入力パラメーター取得
  const query = new URLSearchParams(useLocation().search);

  // TODO:動確用パラメータ設定 ここから
  // query.set('receiptGroupId', '1234');
  // query.set('receiptId', '5678');
  // query.set('expirationScreenId', SCR_TRA_0034);
  // TODO:動確用パラメータ設定 ここまで

  const queryParam: searchParams = {
    // 入金グループID
    receiptGroupId: '' + query.get('receiptGroupId'),
    // 入金番号
    receiptId: '' + query.get('receiptId'),
    // 遷移元画面ID
    expirationScreenId: '' + query.get('expirationScreenId'),
  };

  // context
  const { saveState, loadState } = useContext(AppContext);
  const prevValues = loadState();

  // form
  const methods = useForm<SearchConditionModel>({
    defaultValues: prevValues === undefined ? initialValues : prevValues,
    context: false,
    resolver: yupResolver(yup.object(searchSelectConditionSchema)),
  });

  // state
  // 法人ID/法人名検索のプルダウン
  const [corporationIdSelectValues, setCorporationIdSelectValues] =
    useState<corporationGroupIdSelectValuesModel>(corporationIdInitialValues);

  // 請求先ID
  const [billingIdSelectValues, setBillingIdSelectValues] =
    useState<billingIdSelectValuesModel>(billingIdInitialValues);

  const [openSection, setOpenSection] = useState<boolean>(true);
  const { getValues } = methods;

  // 入金伝票情報セクションの各種値
  /** 会計処理日 */
  const [accountingDate, setAccountingDate] = useState<string>();
  /** 入金口座種別 */
  const [receiptAccountKind, setReceiptAccountKind] = useState<string>();
  /** 法人ID */
  const [corporationId, setCorporationId] = useState<string>();
  /** 請求先IDリスト */
  const [billingId, setBillingId] = useState<string[]>([]);
  /** 返金対象法人ID */
  const [cashbackTargetedCorporationId, setCashbackTargetedCorporationId] =
    useState<string>();
  /** 返金対象請求先ID */
  const [cashbackTargetedBillingId, setCashbackTargetedBillingId] =
    useState<string>();

  // 預かり金一覧セクションの各種値
  const [depositRowsValues, setDepositRowsValues] = useState<
    DepositRowsValuesRowModel[]
  >([]);
  // 預かり金一覧セクションの各種値(既定値)
  const [depositRowsDefaultValues, setDepositRowsDefaultValues] = useState<
    DepositRowsValuesRowModel[]
  >([]);

  // 四輪債権一覧セクションの各種値
  const [tvaaReceivablesRowsValues, setTvaaReceivablesRowsValues] = useState<
    ReceivablesRowsValuesRowModel[]
  >([]);
  // 四輪債権一覧セクションの各種値(既定値)
  const [
    tvaaReceivablesRowsDefaultValues,
    setTvaaReceivablesRowsDefaultValues,
  ] = useState<ReceivablesRowsValuesRowModel[]>([]);
  // おまとめ債権一覧セクションの各種値
  const [omatomeReceivablesRowsValues, setOmatomeReceivablesRowsValues] =
    useState<ReceivablesRowsValuesRowModel[]>([]);
  // おまとめ債権一覧セクションの各種値(既定値)
  const [
    omatomeReceivablesRowsDefaultValues,
    setOmatomeReceivablesRowsDefaultValues,
  ] = useState<ReceivablesRowsValuesRowModel[]>([]);
  // 二輪債権一覧セクションの各種値
  const [baaReceivablesRowsValues, setBaaReceivablesRowsValues] = useState<
    ReceivablesRowsValuesRowModel[]
  >([]);
  // 二輪債権一覧セクションの各種値(既定値)
  const [baaReceivablesRowsDefaultValues, setBaaReceivablesRowsDefaultValues] =
    useState<ReceivablesRowsValuesRowModel[]>([]);
  // 一般債権一覧セクションの各種値
  const [generalReceivablesRowsValues, setGeneralReceivablesRowsValues] =
    useState<GeneralRowsValuesRowModel[]>([]);
  // 一般債権一覧セクションの各種値(既定値)
  const [
    generalReceivablesRowsDefaultValues,
    setGeneralReceivablesRowsDefaultValues,
  ] = useState<GeneralRowsValuesRowModel[]>([]);
  // 預かり金登録セクションの各種値
  const [
    depositRegistrationRowsValues,
    setdepositRegistrationReceivablesRowsValues,
  ] = useState<DepositRegistrationRowsValuesRowModel[]>([]);

  // チェックボックス選択行
  const [rowSelectionModel, setRowSelectionModel] = useState<any[]>([]);

  // エラー画面 state
  const [ScrCom0038PopupValues, setScrCom0038PopupValues] =
    useState<ScrCom0038PopupModel>(scrCom0038PopupInitialValues);

  // エラーポップアップ表示状態
  const [isOpen38Popup, setIsOpen38Popup] = useState(false);

  // router
  const navigate = useNavigate();

  // メッセージを取得
  const { getMessage } = useContext(MessageContext);

  // コード管理マスタ
  const [codeMaster, setCodeMaster] = useState<ResultList[]>([]);

  // 非活性フラグ (既定値false, 編集権限が無い場合はtrue)
  const [disableFlag, setDisableFlag] = useState<boolean>(false);

  // 預かり金一覧の処理金額を読み込み専用/編集可能に変更する
  const [checkTargetFlag, setChecktargetFlag] = useState<boolean>(true);
  const [checkTargetId, setChecktargetId] = useState<string>();
  const handleGetCellReadonly = (params: any) => {
    if (
      !checkTargetFlag &&
      params.id.toString() === checkTargetId?.toString()
    ) {
      return false;
    }
    return true;
  };
  // 四輪の充当金を読み込み専用/編集可能に変更する
  const [checkTargetFlagTvaa, setChecktargetFlagTvaa] = useState<boolean>(true);
  const [checkTargetIdTvaa, setChecktargetIdTvaa] = useState<string>();
  const handleGetCellReadonlyTvaa = (params: any) => {
    if (
      !checkTargetFlagTvaa &&
      params.id.toString() === checkTargetIdTvaa?.toString()
    ) {
      return false;
    }
    return true;
  };
  // おまとめの充当金を読み込み専用/編集可能に変更する
  const [checkTargetFlagOmatome, setChecktargetFlagOmatome] =
    useState<boolean>(true);
  const [checkTargetIdOmatome, setChecktargetIdOmatome] = useState<string>();
  const handleGetCellReadonlyOmatome = (params: any) => {
    if (
      !checkTargetFlagOmatome &&
      params.id.toString() === checkTargetIdOmatome?.toString()
    ) {
      return false;
    }
    return true;
  };
  // 二輪の充当金を読み込み専用/編集可能に変更する
  const [checkTargetFlagBaa, setChecktargetFlagBaa] = useState<boolean>(true);
  const [checkTargetIdBaa, setChecktargetIdBaa] = useState<string>();
  const handleGetCellReadonlyBaa = (params: any) => {
    if (
      !checkTargetFlagBaa &&
      params.id.toString() === checkTargetIdBaa?.toString()
    ) {
      return false;
    }
    return true;
  };
  // 一般の充当金を読み込み専用/編集可能に変更する
  const [checkTargetFlagGeneral, setChecktargetFlagGeneral] =
    useState<boolean>(true);
  const [checkTargetIdGeneral, setChecktargetIdGeneral] = useState<string>();
  const handleGetCellReadonlyGeneral = (params: any) => {
    if (
      !checkTargetFlagGeneral &&
      params.id.toString() === checkTargetIdGeneral?.toString()
    ) {
      return false;
    }
    return true;
  };

  // 預かり金一覧の値が変更された時に再計算を行う
  const handleOnRowValueChange = () => {
    // 充当金額再計算
    let appropriationAmount = 0;
    let totalAmount = 0;
    tvaaReceivablesRowsValues.forEach((row) => {
      appropriationAmount =
        Number(appropriationAmount) + Number(row.appropriationAmount);
      totalAmount =
        Number(totalAmount) + (Number(row.appropriationAmount) + 0 + 0);
    });
    omatomeReceivablesRowsValues.forEach((row) => {
      appropriationAmount =
        Number(appropriationAmount) + Number(row.appropriationAmount);
      totalAmount =
        Number(totalAmount) + (Number(row.appropriationAmount) + 0 + 0);
    });
    baaReceivablesRowsValues.forEach((row) => {
      appropriationAmount =
        Number(appropriationAmount) + Number(row.appropriationAmount);
      totalAmount =
        Number(totalAmount) + (Number(row.appropriationAmount) + 0 + 0);
    });
    generalReceivablesRowsValues.forEach((row) => {
      appropriationAmount =
        Number(appropriationAmount) + Number(row.appropriationAmount);
      totalAmount =
        Number(totalAmount) + (Number(row.appropriationAmount) + 0 + 0);
    });
    processTotal2Values.appropriationAmount = appropriationAmount.toString();
    processTotal2Values.totalAmount = totalAmount.toString();
  };

  // 初期表示
  useEffect(() => {
    const initialize = async () => {
      // コード管理マスタ情報取得API
      const codeMasterRequest = {
        codeId: [
          CDE_COM_0062, // 請求種別
          CDE_COM_0094, // 取引区分
          CDE_COM_0095, // 請求区分
          CDE_COM_0096, // 書類状況区分
          // CDE_COM_0104 , // 請求種別 TODO:コード管理マスタに存在しない
          CDE_COM_0114, // 入金口座種別
          CDE_COM_0115, // 預かり金区分
          CDE_COM_0116, // 預かり金処理区分
        ],
      };
      const codeMasterRequestResponse =
        await ScrCom9999getCodeManagementMasterMultiple(codeMasterRequest);
      const dataList: ResultList[] = [];
      codeMasterRequestResponse.resultList.forEach((x) => {
        const data: ResultList = {
          codeId: x.codeId,
          codeValueList: x.codeValueList,
        };
        dataList.push(data);
      });
      setCodeMaster(dataList);

      // 遷移元画面から活性/非活性を切り替える
      if (SCR_TRA_0034 === query.get('expirationScreenId')) {
        setDisableFlag(true);
      } else {
        setDisableFlag(false);
      }

      // 入金詳細データ取得API / API-TRA-0018-0001
      const request = convertGetReceiptDetailModel({
        receiptGroupId: queryParam.receiptGroupId,
        receiptId: queryParam.receiptId,
        corporationId: '',
        billingIdList: [],
      });
      const response = await ScrTra0018GetReceiptDetail(request);

      /** 入金伝票情報セクション */
      // 会計処理日
      setAccountingDate(response.accountingDate);
      // 入金口座種別
      setReceiptAccountKind(response.receiptAccountKind);
      // 法人ID/法人名
      setCorporationId(response.corporationId);
      // 請求先ID
      setBillingId(response.billingId);
      // 返金対象法人ID/法人名
      setCashbackTargetedCorporationId(response.cashbackTargetedCorporationId);
      // 返金対象請求先ID
      setCashbackTargetedBillingId(response.cashbackTargetedBillingId);

      /** 債権・預かり金表示範囲セクション */
      // 法人ID/法人名, 請求先IDセレクトボックス
      const srcMem9999Request = convertToSearchconditionRefine('', '', '');
      const srcMem9999Response = await ScrMem9999SearchconditionRefine(
        srcMem9999Request
      );
      // 法人ID/法人名プルダウンを設定する
      corporationIdSelectValues.corporationGroupIdSelectValues = [];
      srcMem9999Response.corporationList.forEach((x) => {
        corporationIdSelectValues.corporationGroupIdSelectValues.push({
          value: x.corporationId,
          displayValue: x.corporationId + '-' + x.corporationName,
        });
      });
      setCorporationIdSelectValues(corporationIdSelectValues);
      // 請求先IDプルダウンを設定する
      billingIdSelectValues.billingIdSelectValues = [];
      srcMem9999Response.billingId.forEach((x) => {
        billingIdSelectValues.billingIdSelectValues.push({
          value: x,
          displayValue: x,
        });
      });
      setBillingIdSelectValues(billingIdSelectValues);

      /** 債権・預かり金表示範囲セクション */
      let tvaaNormalValues = 0;
      let tvaaExtensionValues = 0;
      let tvaaNotArrives = 0;
      let omatomeNormalValues = 0;
      let omatomeExtensionValues = 0;
      let baaNormalValues = 0;
      let baaExtensionValues = 0;
      let baaNotArrives = 0;
      let normalValues = 0;
      response.receivablesList.forEach((x) => {
        if (TVAA === x.claimClassification) {
          if (NORMAL === x.claimKind) {
            // 四輪:2:通常
            tvaaNormalValues =
              Number(tvaaNormalValues) + Number(x.claimBalance);
          }
          if (EXTENSION === x.claimKind) {
            // 四輪:3:延長
            tvaaExtensionValues =
              Number(tvaaExtensionValues) + Number(x.claimBalance);
          }
          if (NOT_ARRIVES === x.documentStatusKind) {
            // 四輪:書類状況区分=1:未着
            tvaaNotArrives = Number(tvaaNotArrives) + Number(tvaaNotArrives);
          }
        }
        if (OMATOME === x.claimClassification) {
          if (NORMAL === x.claimKind) {
            // おまとめ:2:通常
            omatomeNormalValues =
              Number(omatomeNormalValues) + Number(x.claimBalance);
          }
          if (EXTENSION === x.claimKind) {
            // おまとめ:3:延長
            omatomeExtensionValues =
              Number(omatomeExtensionValues) + Number(x.claimBalance);
          }
        }
        if (BAA === x.claimClassification) {
          if (NORMAL === x.claimKind) {
            // 二輪:2:通常
            baaNormalValues = Number(baaNormalValues) + Number(x.claimBalance);
          }
          if (EXTENSION === x.claimKind) {
            // 二輪:3:延長
            baaExtensionValues =
              Number(baaExtensionValues) + Number(x.claimBalance);
          }
          if (NOT_ARRIVES === x.documentStatusKind) {
            // 二輪:書類状況区分=1:未着
            baaNotArrives = Number(baaNotArrives) + Number(baaNotArrives);
          }
        }
        if (NORMAL_BILLING === x.claimKind) {
          normalValues = Number(normalValues) + Number(x.claimBalance);
        }
      });
      // 四輪:通常
      tvaaValues.normal = tvaaNormalValues.toString();
      // 四輪:延長
      tvaaValues.extension = tvaaExtensionValues.toString();
      // 四輪:総請求残高
      tvaaValues.totalBillingBalance = (
        tvaaNormalValues + tvaaExtensionValues
      ).toString();
      // 四輪:書類未到着
      tvaaValues.documentUnArrives = tvaaNotArrives.toString();
      // おまとめ:通常
      omatomeValues.normal = omatomeNormalValues.toString();
      // おまとめ:延長
      omatomeValues.extension = omatomeExtensionValues.toString();
      // おまとめ:総請求残高
      omatomeValues.totalBillingBalance = (
        omatomeNormalValues + omatomeExtensionValues
      ).toString();
      // 二輪:通常
      baaValues.normal = baaNormalValues.toString();
      // 二輪:延長
      baaValues.extension = baaExtensionValues.toString();
      // 二輪:総請求残高
      baaValues.totalBillingBalance = (
        baaNormalValues + baaExtensionValues
      ).toString();
      // 二輪:書類未到着
      baaValues.documentUnArrives = baaNotArrives.toString();
      // 一般請求:総請求残高
      generalPaymentValues.totalBillingBalance = normalValues.toString();
      // 出金保留明細:四輪
      paymentPendingdetailsValues.tvaa = response.tvaaPaymentPending.toString();
      // 出金保留明細:おまとめ
      paymentPendingdetailsValues.omatome =
        response.omatomePaymentPending.toString();
      // 出金保留明細:二輪
      paymentPendingdetailsValues.baa = response.bikePaymentPending.toString();
      // 出金保留明細:一般請求
      paymentPendingdetailsValues.general =
        response.generalclaimPaymentPending.toString();

      /** 処理額合計セクション */
      // 入金額
      processTotal1Values.receiptAmount = response.receiptAmount.toString();
      // 預かり金処理金額
      processTotal1Values.depositProcessAmount =
        response.depositAmount.toString();
      // 合計金額
      processTotal1Values.totalAmount = (
        Number(response.receiptAmount) + Number(response.depositAmount)
      ).toString();
      // 未処理金額
      processTotal1Values.notProcessAmount = (
        Number(paymentPendingdetailsValues.baa) -
        Number(processTotal1Values.totalAmount)
      ).toString();
      // 充当金額
      processTotal2Values.appropriationAmount =
        response.appropriationAmount.toString();
      // 預かり金登録金額 TODO:設計書不備のため預かり金登録金額の源泉が不明
      processTotal2Values.depositPreliminaryAmount = '0';
      // 対象外金額
      processTotal2Values.notTargetedAmount =
        response.notTargetedAmount.toString();
      // 自税返金額 TODO:設計書不備のため自税返金額の源泉が不明
      processTotal2Values.carTaxCashBackAmount = '0';
      // 合計金額 TODO:設計書不備のため預かり金登録金額の源泉が不明
      processTotal2Values.totalAmount = (
        Number(response.receiptAmount) +
        0 -
        (Number(response.appropriationAmount) +
          0 +
          Number(response.notTargetedAmount))
      ).toString();

      /** 預かり金一覧セクション */
      setDepositRowsValues(convertToDepositRowsValuesRowModel(response));
      setDepositRowsDefaultValues(convertToDepositRowsValuesRowModel(response));
      /** 四輪, おまとめ, 二輪 債権一覧セクション */
      const receivablesRowsValues = convertToReceivablesRowsValues(response);
      const tvaaRows: ReceivablesRowsValuesRowModel[] = [];
      const omatomeRows: ReceivablesRowsValuesRowModel[] = [];
      const baaRows: ReceivablesRowsValuesRowModel[] = [];
      receivablesRowsValues.forEach((x) => {
        if (TVAA === x.claimClassification) {
          tvaaRows.push(x);
        }
        if (OMATOME === x.claimClassification) {
          omatomeRows.push(x);
        }
        if (BAA === x.claimClassification) {
          baaRows.push(x);
        }
      });
      setTvaaReceivablesRowsValues(tvaaRows);
      setTvaaReceivablesRowsDefaultValues(tvaaRows);
      setOmatomeReceivablesRowsValues(omatomeRows);
      setOmatomeReceivablesRowsDefaultValues(omatomeRows);
      setBaaReceivablesRowsValues(baaRows);
      setBaaReceivablesRowsDefaultValues(baaRows);

      /** 一般債権一覧セクション */
      const generalReceivablesRowsValues =
        convertToGeneralReceivablesRowsValues(response);
      setGeneralReceivablesRowsValues(generalReceivablesRowsValues);
      setGeneralReceivablesRowsDefaultValues(generalReceivablesRowsValues);
      /** 預かり金登録セクション */
      const depositRegistrationReceivablesRowsValues =
        convertToDepositRegistrationReceivablesRowsValues(response);
      setdepositRegistrationReceivablesRowsValues(
        depositRegistrationReceivablesRowsValues
      );
      //

      // 入金口座種別のセレクトボックスを設定する
      codeMaster.forEach((x) => {
        if (CDE_COM_0114 === x.codeId) {
          x.codeValueList.forEach((y) => {
            depositRegistrationColumns[0].selectValues?.push({
              value: y.codeValue,
              displayValue: y.codeName,
            });
          });
        }
      });

      // 請求先IDのセレクトボックスを設定する
      srcMem9999Response.billingId.forEach((x) => {
        depositRegistrationColumns[1].selectValues?.push({
          value: x,
          displayValue: x,
        });
      });

      // 預かり金区分のラジオボタンを設定する
      codeMaster.forEach((x) => {
        if (CDE_COM_0115 === x.codeId) {
          x.codeValueList.forEach((y) => {
            depositRegistrationColumns[2].radioValues?.push({
              value: y.codeValue,
              displayValue: y.codeName,
            });
          });
        }
      });

      //
      // 仮処理内容のセレクトボックスを設定する
      codeMaster.forEach((x) => {
        if (CDE_COM_0116 === x.codeId) {
          x.codeValueList.forEach((y) => {
            depositRegistrationColumns[4].selectValues?.push({
              value: y.codeValue,
              displayValue: y.codeName,
            });
          });
        }
      });
    };
    initialize();
  }, []);

  /**
   * Sectionを閉じた際のラベル作成
   */
  const serchLabels = serchData.map((val, index) => {
    const nameVal = getValues(val.name);
    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });

  /**
   * 表示切替ボタン押下時の処理
   */
  const changeDisplayClick = async () => {
    let corporationGroupId = '';
    const billingIdList: string[] = [];
    // 法人情報相違チェック
    // 入金伝票情報セクションと債権・預かり金表示範囲セクションで指定した法人ID/法人名が異なる場合ワーニング
    let stopFlag = false;
    serchData.forEach((val) => {
      if ('corporationGroupId' === val.name) {
        corporationGroupId = getValues(val.name);
        if (corporationId !== getValues(val.name)) {
          const ret = window.confirm(getMessage('MSG-FR-WRN-00004'));
          // いいえの場合は処理終了させる
          if (!ret) {
            stopFlag = true;
            return;
          }
        }
      }
      if ('billingId' === val.name) {
        billingIdList.push(getValues(val.name));
      }
    });
    // いいえの場合は処理終了させる
    if (stopFlag) {
      return;
    }

    // 入金詳細データ取得API / API-TRA-0018-0001
    const request = convertGetReceiptDetailModel({
      // TODO:法人ID/法人名と請求先IDが正だが、設計書誤りのため設計書通り記載しておく
      receiptGroupId: queryParam.receiptGroupId,
      receiptId: queryParam.receiptId,
      corporationId: corporationGroupId,
      billingIdList: billingIdList,
    });
    const response = await ScrTra0018GetReceiptDetail(request);
    /** 入金伝票情報セクション */
    // 会計処理日
    setAccountingDate(response.accountingDate);
    // 入金口座種別
    setReceiptAccountKind(response.receiptAccountKind);
    // 法人ID/法人名
    setCorporationId(response.corporationId);
    // 請求先ID
    setBillingId(response.billingId);
    // 返金対象法人ID/法人名
    setCashbackTargetedCorporationId(response.cashbackTargetedCorporationId);
    // 返金対象請求先ID
    setCashbackTargetedBillingId(response.cashbackTargetedBillingId);

    /** 債権・預かり金表示範囲セクション */
    // 法人ID/法人名, 請求先IDセレクトボックス
    const srcMem9999Request = convertToSearchconditionRefine('', '', '');
    const srcMem9999Response = await ScrMem9999SearchconditionRefine(
      srcMem9999Request
    );
    // 法人ID/法人名プルダウンを設定する
    corporationIdSelectValues.corporationGroupIdSelectValues = [];
    srcMem9999Response.corporationList.forEach((x) => {
      corporationIdSelectValues.corporationGroupIdSelectValues.push({
        value: x.corporationId,
        displayValue: x.corporationId + '-' + x.corporationName,
      });
    });
    setCorporationIdSelectValues(corporationIdSelectValues);
    // 請求先IDプルダウンを設定する
    billingIdSelectValues.billingIdSelectValues = [];
    srcMem9999Response.billingId.forEach((x) => {
      billingIdSelectValues.billingIdSelectValues.push({
        value: x,
        displayValue: x,
      });
    });
    setBillingIdSelectValues(billingIdSelectValues);

    /** 預かり金一覧セクション */
    const depositRowsValues = convertToDepositRowsValuesRowModel(response);
    setDepositRowsValues(depositRowsValues);
    setDepositRowsDefaultValues(depositRowsValues);

    /** 四輪, おまとめ, 二輪 債権一覧セクション */
    const receivablesRowsValues = convertToReceivablesRowsValues(response);
    const tvaaRows: ReceivablesRowsValuesRowModel[] = [];
    const omatomeRows: ReceivablesRowsValuesRowModel[] = [];
    const baaRows: ReceivablesRowsValuesRowModel[] = [];
    receivablesRowsValues.forEach((x) => {
      if (TVAA === x.claimClassification) {
        tvaaRows.push(x);
      }
      if (OMATOME === x.claimClassification) {
        omatomeRows.push(x);
      }
      if (BAA === x.claimClassification) {
        baaRows.push(x);
      }
    });
    setTvaaReceivablesRowsValues(tvaaRows);
    setTvaaReceivablesRowsDefaultValues(tvaaRows);
    setOmatomeReceivablesRowsValues(omatomeRows);
    setOmatomeReceivablesRowsDefaultValues(omatomeRows);
    setBaaReceivablesRowsValues(baaRows);
    setBaaReceivablesRowsDefaultValues(baaRows);

    /** 一般債権一覧セクション */
    const generalReceivablesRowsValues =
      convertToGeneralReceivablesRowsValues(response);
    setGeneralReceivablesRowsValues(generalReceivablesRowsValues);
    setGeneralReceivablesRowsDefaultValues(generalReceivablesRowsValues);
    /** 預かり金登録セクション */
    const depositRegistrationReceivablesRowsValues =
      convertToDepositRegistrationReceivablesRowsValues(response);
    setdepositRegistrationReceivablesRowsValues(
      depositRegistrationReceivablesRowsValues
    );
  };

  /**
   * 預かり金一覧のチェックボックス押下時の処理
   */
  const checkBoxClickHandler = (selectId: any) => {
    let stopFlag = false;
    // コード管理マスタ(預かり金区分)
    let guaranteeDepositValue = '';
    codeMaster.forEach((x) => {
      if (CDE_COM_0115 === x.codeId) {
        x.codeValueList.forEach((x) => {
          if (GUARANTEE_DEPOSIT === x.codeValue.toString()) {
            guaranteeDepositValue = x.codeName;
          }
        });
      }
    });
    if (2 <= selectId.length) return;
    const newRows: DepositRowsValuesRowModel[] = [];
    // 初期状態の値を設定する
    if (0 === selectId.length) {
      setChecktargetFlag(!checkTargetFlag);
      setDepositRowsValues(depositRowsDefaultValues);
      return;
    }
    depositRowsValues.forEach((row) => {
      if (selectId.toString() === row.id.toString()) {
        // 選択行の場合
        setChecktargetFlag(!checkTargetFlag);
        setChecktargetId(selectId);
        newRows.push({
          id: row.id,
          depositId: row.depositId,
          receiptAccountKind: row.receiptAccountKind,
          billingId: row.billingId,
          accountingDate: row.accountingDate,
          depositAmountKind: row.depositAmountKind,
          depositAmount: row.depositAmount,
          depositProcess: row.depositAmount, // 処理金額に預かり金額を設定する
          balance: 0, // 残額を0にする
          provisionalOPocessDetail: row.provisionalOPocessDetail,
          memo: row.memo,
          inputId: row.inputId,
          inputName: row.inputName,
        });
        // 保証金明細選択チェックを行う アラートがある場合はアラートメッセージを表示する
        // 預かり金区分が「保証金」の場合はワーニングとする
        if (guaranteeDepositValue === row.depositAmountKind) {
          const ret = window.confirm(getMessage('MSG-FR-WRN-00005'));
          // いいえの場合は処理終了させる
          if (!ret) {
            stopFlag = true;
            return;
          }
        }
      } else {
        // 選択行ではない場合 値変化なし
        newRows.push(row);
      }
    });
    if (stopFlag) {
      return;
    }
    // 対象外の場合は読み込み専用に変更する
    setChecktargetFlag(!checkTargetFlag);
    setDepositRowsValues(newRows);
  };

  /**
   * 四輪のチェックボックス押下時の処理
   */
  const checkBoxClickHandlerTvaa = (selectId: any) => {
    if (2 <= selectId.length) return;
    const newRows: ReceivablesRowsValuesRowModel[] = [];
    // 初期状態の値を設定する
    if (0 === selectId.length) {
      setChecktargetFlagTvaa(!checkTargetFlagTvaa);
      setTvaaReceivablesRowsValues(tvaaReceivablesRowsDefaultValues);
      return;
    }
    tvaaReceivablesRowsValues.forEach((row) => {
      if (selectId.toString() === row.id.toString()) {
        setChecktargetFlagTvaa(!checkTargetFlagTvaa);
        setChecktargetIdTvaa(selectId);
        newRows.push({
          id: row.id,
          dealKind: row.dealKind,
          claimKind: row.claimKind,
          placeName: row.placeName,
          sessionDate: row.sessionDate,
          auctionCount: row.auctionCount,
          exhibitNumber: row.exhibitNumber,
          carName: row.carName,
          carNumber: row.carNumber,
          receiptDueDate: row.receiptDueDate,
          claimAmount: row.claimAmount,
          appropriationedAmount: row.appropriationedAmount,
          appropriationAmount: row.claimBalance, // 請求金額を充当金額に設定する
          claimBalance: row.claimBalance,
          documentStatusKind: row.documentStatusKind,
          documentArrivesCalculateExpectAmount:
            row.documentArrivesCalculateExpectAmount,
          billingId: row.billingId,
          claimDate: row.claimDate,
          accountingDate: row.accountingDate,
          claimClassification: row.claimClassification,
        });
      } else {
        // 値変化なし
        newRows.push(row);
      }
    });
    // 対象外の場合は読み込み専用に変更する
    setChecktargetFlagTvaa(!checkTargetFlagTvaa);
    setTvaaReceivablesRowsValues(newRows);
  };

  /**
   * おまとめのチェックボックス押下時の処理
   */
  const checkBoxClickHandlerOmatome = (selectId: any) => {
    if (2 <= selectId.length) return;
    const newRows: ReceivablesRowsValuesRowModel[] = [];
    // 初期状態の値を設定する
    if (0 === selectId.length) {
      setChecktargetFlagOmatome(!checkTargetFlagOmatome);
      setOmatomeReceivablesRowsValues(omatomeReceivablesRowsDefaultValues);
      return;
    }
    omatomeReceivablesRowsValues.forEach((row) => {
      if (selectId.toString() === row.id.toString()) {
        setChecktargetFlagOmatome(!checkTargetFlagOmatome);
        setChecktargetIdOmatome(selectId);
        newRows.push({
          id: row.id,
          dealKind: row.dealKind,
          claimKind: row.claimKind,
          placeName: row.placeName,
          sessionDate: row.sessionDate,
          auctionCount: row.auctionCount,
          exhibitNumber: row.exhibitNumber,
          carName: row.carName,
          carNumber: row.carNumber,
          receiptDueDate: row.receiptDueDate,
          claimAmount: row.claimAmount,
          appropriationedAmount: row.appropriationedAmount,
          appropriationAmount: row.claimBalance, // 請求金額を充当金額に設定する
          claimBalance: row.claimBalance,
          documentStatusKind: row.documentStatusKind,
          documentArrivesCalculateExpectAmount:
            row.documentArrivesCalculateExpectAmount,
          billingId: row.billingId,
          claimDate: row.claimDate,
          accountingDate: row.accountingDate,
          claimClassification: row.claimClassification,
        });
      } else {
        // 値変化なし
        newRows.push(row);
      }
    });
    // 対象外の場合は読み込み専用に変更する
    setChecktargetFlagOmatome(!checkTargetFlagOmatome);
    setOmatomeReceivablesRowsValues(newRows);
  };

  /**
   * 二輪のチェックボックス押下時の処理
   */
  const checkBoxClickHandlerBaa = (selectId: any) => {
    if (2 <= selectId.length) return;
    const newRows: ReceivablesRowsValuesRowModel[] = [];
    // 初期状態の値を設定する
    if (0 === selectId.length) {
      setChecktargetFlagBaa(!checkTargetFlagBaa);
      setBaaReceivablesRowsValues(baaReceivablesRowsDefaultValues);
      return;
    }
    baaReceivablesRowsValues.forEach((row) => {
      if (selectId.toString() === row.id.toString()) {
        setChecktargetFlagBaa(!checkTargetFlagBaa);
        setChecktargetIdBaa(selectId);
        newRows.push({
          id: row.id,
          dealKind: row.dealKind,
          claimKind: row.claimKind,
          placeName: row.placeName,
          sessionDate: row.sessionDate,
          auctionCount: row.auctionCount,
          exhibitNumber: row.exhibitNumber,
          carName: row.carName,
          carNumber: row.carNumber,
          receiptDueDate: row.receiptDueDate,
          claimAmount: row.claimAmount,
          appropriationedAmount: row.appropriationedAmount,
          appropriationAmount: row.claimBalance, // 請求金額を充当金額に設定する
          claimBalance: row.claimBalance,
          documentStatusKind: row.documentStatusKind,
          documentArrivesCalculateExpectAmount:
            row.documentArrivesCalculateExpectAmount,
          billingId: row.billingId,
          claimDate: row.claimDate,
          accountingDate: row.accountingDate,
          claimClassification: row.claimClassification,
        });
      } else {
        // 値変化なし
        newRows.push(row);
      }
    });
    // 対象外の場合は読み込み専用に変更する
    setChecktargetFlagBaa(!checkTargetFlagBaa);
    setBaaReceivablesRowsValues(newRows);
  };

  /**
   * 一般のチェックボックス押下時の処理
   */
  const checkBoxClickHandlerGeneral = (selectId: any) => {
    if (2 <= selectId.length) return;
    const newRows: GeneralRowsValuesRowModel[] = [];
    // 初期状態の値を設定する
    if (0 === selectId.length) {
      setChecktargetFlagGeneral(!checkTargetFlagGeneral);
      setGeneralReceivablesRowsValues(generalReceivablesRowsDefaultValues);
      return;
    }
    generalReceivablesRowsValues.forEach((row) => {
      if (selectId.toString() === row.id.toString()) {
        setChecktargetFlagGeneral(!checkTargetFlagGeneral);
        setChecktargetIdGeneral(selectId);
        newRows.push({
          id: row.id,
          dealKind: row.dealKind,
          receiptDueDate: row.receiptDueDate,
          claimAmount: row.claimAmount,
          appropriationedAmount: row.appropriationedAmount,
          appropriationAmount: row.claimAmount, // 請求金額を充当金額に設定する
          claimBalance: row.claimBalance,
          billingId: row.billingId,
          claimDate: row.claimDate,
          accountingDate: row.accountingDate,
        });
      } else {
        // 値変化なし
        newRows.push(row);
      }
    });
    // 対象外の場合は読み込み専用に変更する
    setChecktargetFlagGeneral(!checkTargetFlagGeneral);
    setGeneralReceivablesRowsValues(newRows);
  };

  /**
   * キャンセルボタン押下時の処理
   */
  //const cancelClick = async () => {
  const cancelClick = () => {
    navigate('/tra/recepts');
  };

  /**
   * 確定ボタン押下時の処理
   */
  const confirmClick = async () => {
    let stopFlag = false;
    // 未処理金額が0未満の場合はエラー
    if (0 > Number(processTotal1Values.notProcessAmount)) {
      alert(getMessage('MSG-FR-ERR-00051'));
      stopFlag = true;
    }
    if (stopFlag) {
      // エラーの場合は後続処理を行わない
      return;
    }
    // 入金伝票詳細チェックAPI - API-0018-002
    let corporationGroupId = '';
    let billingId = '';
    serchData.forEach((val) => {
      if ('corporationGroupId' === val.name) {
        corporationGroupId = getValues(val.name);
      }
      if ('billingId' === val.name) {
        billingId = getValues(val.name);
      }
    });
    const requestScrTra0018: ScrTra0018CheckReceiptDetailRequest = {
      // 入金グループID
      receiptGroupId: corporationGroupId,
      // 入金番号
      receiptId: billingId,
      // 債権番号リスト TODO:設計書不備(四輪債権一覧の債権番号とあるが、債権番号が無いので導出元が不明)
      receivablesIdList: [],
    };
    const ScrTra0018CheckReceiptDetailResponse =
      await ScrTra0018CheckReceiptDetail(requestScrTra0018);

    const checkReceiptDetail = convertApiToCheckReceiptDetailModel(
      ScrTra0018CheckReceiptDetailResponse
    );
    // エラーが存在する場合
    if (checkReceiptDetail.errorList) {
      alert(getMessage('MSG-BK-ERR-00047'));
    } else {
      // エラーが存在しない場合
      // API-TRA-0018-0003_入金伝票詳細登録API
      const request: ScrTra0018RegistrationReceiptDetailRequest = {
        /** 入金グループID */
        receiptGroupId: '' + query.get('receiptGroupId'),
        /** 入金番号 */
        receiptId: '' + query.get('receiptId'),
        // TODO:設計書不備のため引数に指定するべき値の源泉が不明
        /** 変更タイムスタンプ */
        changeTimeStamp: '',
        /** リスト(預かり金一覧) */
        depositList: [],
        /** リスト(四輪債権伝票) */
        tvaaList: [],
        /** リスト(おまとめ債権伝票) */
        omatomeList: [],
        /** リスト(二輪債権伝票) */
        bikeList: [],
        /** リスト(一般請求債権伝票) */
        generalClaimList: [],
      };
      ScrTra0018RegistrationReceiptDetail(request);
      setIsOpen38Popup(true);
      setScrCom0038PopupValues({
        warningList: checkReceiptDetail.warningList,
        errorList: checkReceiptDetail.errorList,
        expirationScreenId: SCR_TRA_0018,
      });
    }
  };

  /**
   * エラー確認ポップアップキャンセルボタン押下時
   */
  const handlePopup38Cancel = () => {
    setIsOpen38Popup(false);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <h1>入金伝票情報</h1>
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 入金伝票情報セクション */}
            <Section
              name='入金伝票情報'
              isSearch
              serchLabels={serchLabels}
              openable={openSection}
            >
              <Grid container width={1590}>
                <ThemeProvider theme={theme}>
                  <RowStack>
                    <ColStack>
                      <label>{'会計処理日'}</label>
                      <label data-name={'receiptAccountingDate'}>
                        {accountingDate}
                      </label>
                    </ColStack>
                    <ColStack>
                      <label>{'入金口座種別'}</label>
                      <label data-name={'receiptReceiptAccountKind'}>
                        {receiptAccountKind}
                      </label>
                    </ColStack>
                    <ColStack>
                      <label>{'法人ID/法人名'}</label>
                      <label data-name={'receiptCorporationId'}>
                        {corporationId}
                      </label>
                    </ColStack>
                    <ColStack>
                      <label>{'請求先ID'}</label>
                      <label data-name={'receiptBillingId'}>{billingId}</label>
                    </ColStack>
                    <ColStack>
                      <label>{'返金対象法人ID/法人名'}</label>
                      <label data-name={'receiptCashbackTargetedCorporationId'}>
                        {cashbackTargetedCorporationId}
                      </label>
                    </ColStack>
                    <ColStack>
                      <label>{'返金対象請求先ID'}</label>
                      <label data-name={'receiptCashbackTargetedBillingId'}>
                        {cashbackTargetedBillingId}
                      </label>
                    </ColStack>
                  </RowStack>
                </ThemeProvider>
              </Grid>
            </Section>

            {/* 債権・預かり金表示範囲セクション */}
            <Section name='債権・預かり金表示範囲'>
              <Grid container width={1590}>
                <ThemeProvider theme={theme}>
                  <RowStack>
                    <ColStack>
                      <Select
                        label='法人ID/法人名'
                        name='corporationGroupId'
                        selectValues={
                          corporationIdSelectValues.corporationGroupIdSelectValues
                        }
                        disabled={disableFlag}
                        required={true}
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='請求先ID'
                        name='billingId'
                        selectValues={
                          billingIdSelectValues.billingIdSelectValues
                        }
                        disabled={disableFlag}
                        required={true}
                      />
                    </ColStack>
                    <ColStack>
                      <PrintButton
                        onClick={() => {
                          changeDisplayClick();
                        }}
                      >
                        表示切替
                      </PrintButton>
                    </ColStack>
                  </RowStack>
                </ThemeProvider>

                <ThemeProvider theme={theme}>
                  <RowStack>
                    <ColStack>
                      <CaptionLabel text='四輪' />
                      <BoxedText
                        labels={tvaaLabels}
                        values={tvaaValues}
                        getFieldBackgroundColor={handleGetFieldBackgroundColor}
                      />
                    </ColStack>
                    <ColStack>
                      <CaptionLabel text='おまとめ' />
                      <BoxedText
                        labels={omatomeLabels}
                        values={omatomeValues}
                        getFieldBackgroundColor={handleGetFieldBackgroundColor}
                      />
                    </ColStack>
                    <ColStack>
                      <CaptionLabel text='二輪' />
                      <BoxedText
                        labels={baaLabels}
                        values={baaValues}
                        getFieldBackgroundColor={handleGetFieldBackgroundColor}
                      />
                    </ColStack>
                    <ColStack>
                      <CaptionLabel text='一般請求' />
                      <BoxedText
                        labels={generalPaymentLabels}
                        values={generalPaymentValues}
                        getFieldBackgroundColor={handleGetFieldBackgroundColor}
                      />
                    </ColStack>
                    <ColStack>
                      <CaptionLabel text='出金保留明細' />
                      <BoxedText
                        labels={paymentPendingdetailsLabels}
                        values={paymentPendingdetailsValues}
                        getFieldBackgroundColor={handleGetFieldBackgroundColor}
                      />
                    </ColStack>
                  </RowStack>
                </ThemeProvider>
              </Grid>
            </Section>

            {/* 処理額合計セクション */}
            <Section name='処理額合計'>
              <Grid container width={1590}>
                <ThemeProvider theme={theme}>
                  <RowStack>
                    <ColStack>
                      <BoxedText
                        labels={processTotal1Labels}
                        values={processTotal1Values}
                        getFieldBackgroundColor={handleGetFieldBackgroundColor}
                      />
                    </ColStack>
                    <ColStack>
                      <BoxedText
                        labels={processTotal2Labels}
                        values={processTotal2Values}
                        getFieldBackgroundColor={handleGetFieldBackgroundColor}
                      />
                    </ColStack>
                  </RowStack>
                </ThemeProvider>
              </Grid>
            </Section>

            {/* 預かり金一覧セクション */}
            <Section name='預かり金一覧'>
              <Grid container width={2590}>
                <DataGrid
                  columns={depositColumns}
                  rows={depositRowsValues}
                  pagination
                  checkboxSelection
                  width={1850}
                  isRowSelectable={() => !disableFlag}
                  rowSelectionModel={rowSelectionModel}
                  onRowSelectionModelChange={(x) => {
                    setRowSelectionModel(x);
                    checkBoxClickHandler(x);
                  }}
                  getCellReadonly={handleGetCellReadonly}
                  onRowValueChange={handleOnRowValueChange}
                  resolver={commonInputConditionSchema}
                />
              </Grid>
            </Section>

            {/* 四輪債権一覧セクション */}
            <Section name='【四輪】債権一覧'>
              <Grid container width={4590}>
                <DataGrid
                  columns={receivablesColumns}
                  rows={tvaaReceivablesRowsValues}
                  pagination
                  checkboxSelection
                  width={2750}
                  isRowSelectable={() => !disableFlag}
                  rowSelectionModel={rowSelectionModel}
                  onRowSelectionModelChange={(x) => {
                    setRowSelectionModel(x);
                    checkBoxClickHandlerTvaa(x);
                  }}
                  getCellReadonly={handleGetCellReadonlyTvaa}
                  onRowValueChange={handleOnRowValueChange}
                  resolver={commonInputConditionSchema}
                />
              </Grid>
            </Section>

            {/* おまとめ債権一覧セクション */}
            <Section name='【おまとめ】債権一覧'>
              <Grid container width={4590}>
                <DataGrid
                  columns={receivablesColumns}
                  rows={omatomeReceivablesRowsValues}
                  pagination
                  checkboxSelection
                  width={2750}
                  isRowSelectable={() => !disableFlag}
                  rowSelectionModel={rowSelectionModel}
                  onRowSelectionModelChange={(x) => {
                    setRowSelectionModel(x);
                    checkBoxClickHandlerOmatome(x);
                  }}
                  getCellReadonly={handleGetCellReadonlyOmatome}
                  onRowValueChange={handleOnRowValueChange}
                  resolver={commonInputConditionSchema}
                />
              </Grid>
            </Section>

            {/* 二輪債権一覧セクション */}
            <Section name='【二輪】債権一覧'>
              <Grid container width={4590}>
                <DataGrid
                  columns={receivablesColumns}
                  rows={baaReceivablesRowsValues}
                  pagination
                  checkboxSelection
                  width={2750}
                  isRowSelectable={() => !disableFlag}
                  rowSelectionModel={rowSelectionModel}
                  onRowSelectionModelChange={(x) => {
                    setRowSelectionModel(x);
                    checkBoxClickHandlerBaa(x);
                  }}
                  getCellReadonly={handleGetCellReadonlyBaa}
                  onRowValueChange={handleOnRowValueChange}
                  resolver={commonInputConditionSchema}
                />
              </Grid>
            </Section>

            {/* 一般請求債権一覧セクション */}
            <Section name='【一般請求】債権一覧'>
              <Grid container width={4590}>
                <DataGrid
                  columns={generalColumns}
                  rows={generalReceivablesRowsValues}
                  pagination
                  checkboxSelection
                  width={1700}
                  isRowSelectable={() => !disableFlag}
                  rowSelectionModel={rowSelectionModel}
                  onRowSelectionModelChange={(x) => {
                    setRowSelectionModel(x);
                    checkBoxClickHandlerGeneral(x);
                  }}
                  getCellReadonly={handleGetCellReadonlyGeneral}
                  onRowValueChange={handleOnRowValueChange}
                  resolver={commonInputConditionSchema}
                />
              </Grid>
            </Section>

            {/* 預かり金登録セクション */}
            <Section name='預かり金登録'>
              <Grid container width={1490}>
                <DataGrid
                  columns={depositRegistrationColumns}
                  rows={depositRegistrationRowsValues}
                  pagination
                  width={1200}
                  isRowSelectable={() => !disableFlag}
                  resolver={depositPreliminaryInputConditionSchema}
                  disabled={disableFlag}
                />
              </Grid>
            </Section>
          </FormProvider>
        </MainLayout>

        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CenterBox>
              {/** キャンセルボタン */}
              <CancelButton
                size={'small'}
                onClick={() => {
                  cancelClick();
                }}
              >
                キャンセル
              </CancelButton>
              {/** 確定ボタン */}
              <ConfirmButton
                size={'small'}
                onClick={() => {
                  confirmClick();
                }}
                disable={disableFlag}
              >
                確定
              </ConfirmButton>
            </CenterBox>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* エラー確認ポップアップ */}
      <ScrCom0038Popup
        isOpen={isOpen38Popup}
        data={ScrCom0038PopupValues}
        handleCancel={handlePopup38Cancel}
      />
    </>
  );
};
export default ScrTra0018Page;
