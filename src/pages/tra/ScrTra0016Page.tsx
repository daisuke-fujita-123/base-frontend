import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useLocation, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';
import { ObjectSchema } from 'yup';

import ScrCom0032Popup, {
  registrationChangeList,
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032Popup';
import ScrCom0035Popup, {
  ScrCom0035PopupAllRegistrationDefinitionModel,
} from 'pages/com/popups/ScrCom0035Popup';
import ScrCom0038Popup from 'pages/com/popups/ScrCom0038Popup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { Stack } from 'layouts/Stack';

import {
  AddButton,
  Button,
  ConfirmButton,
  SearchButton,
} from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
} from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { Dialog } from 'controls/Dialog';
import { ContentsDivider } from 'controls/Divider';
import { Select, SelectValue } from 'controls/Select';
import { Table, TableColDef, TableRowModel } from 'controls/Table';
import { TextField } from 'controls/TextField';
import { SerchLabelText } from 'controls/Typography';

import {
  ScrCom9999getCodeManagementMasterMultiple,
  ScrCom9999getCodeManagementMasterMultipleRequest,
  ScrCom9999getCodeManagementMasterMultipleResponse,
} from 'apis/com/ScrCom9999Api';
import {
  ScrMem9999SearchconditionRefine,
  ScrMem9999SearchconditionRefineRequest,
  ScrMem9999SearchconditionRefineResponse,
} from 'apis/mem/ScrMem9999Api';
import {
  AutoClearingExecuteRequestResult,
  ScrTra0016AutoClearingExecute,
  ScrTra0016AutoClearingExecuteRequest,
  ScrTra0016AutoClearingExecuteResponse,
  ScrTra0016CheckCashbackTarget,
  ScrTra0016CheckCashbackTargetRequest,
  ScrTra0016CheckCashbackTargetResponse,
  ScrTra0016CheckReceiptDetail,
  ScrTra0016CheckReceiptDetailRequest,
  ScrTra0016CheckReceiptDetailResponse,
  ScrTra0016CheckReceiptInput,
  ScrTra0016CheckReceiptInputRequest,
  ScrTra0016CheckReceiptInputResponse,
  ScrTra0016ReceiptDetailReset,
  ScrTra0016ReceiptDetailResetRequest,
  ScrTra0016ReceiptSlipAdditionResponse,
  ScrTra0016RegistrationReceipt,
  ScrTra0016RegistrationReceiptRequest,
  ScrTra0016SearchReceipts,
  ScrTra0016SearchReceiptsRequest,
  ScrTra0016SearchReceiptsResponse,
} from 'apis/tra/ScrTra0016Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';
import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

import {
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';
import { useGridApiRef } from '@mui/x-data-grid-pro';

// 画面名定数
const SCR_NAME = '入金一覧';
// セクション名
const SECTION_NAME = '入金一覧セクション';
// 項目名
const COLUMN_NAME = '入金グループID/入金ID';

// 画面ID定数
const SCR_TRA_0016 = 'SCR-TRA-0016'; // 自画面
const SCR_COM_0003 = 'SCR-COM-0003'; // ワークリスト
const SCR_TRA_0019 = 'SCR-TRA-0019'; // 返金一覧
const SCR_TRA_0018 = 'SCR-TRA-0018'; // 入金詳細
const SCR_COM_034 = 'SCR-COM-034'; // FBデータ取込(CSVファイル読み込み)
const SCR_COM_035 = 'SCR-COM-035'; // FBデータ取込(CSVファイル読み込み)

// 定数(入金口座種別)
const CDE_COM_0114 = 'CDE-COM-0114';
// 定数(承認ステータス)
const CDE_TRA_1004 = 'CDE-TRA-1004';

// セッションキー名称
const RECEIPT_ACCOUNTKIND = 'receiptAccountKind'; // 入金口座種別
const RECEIPT_GROUPID = 'receiptGroupId'; // 入金グループID/入金ID
const CONTRACT_ID = 'contractId'; // 契約ID
const CORPORATION_ID = 'corporationId'; // 法人ID/法人名
const BILLING_ID = 'billingId'; // 請求先ID
const BANK_NAME = 'bankName'; // 銀行名
const BRANCH_NAME = 'branchName'; // 支店名
const ACCOUNT_NAME = 'accountName'; // 口座名義
const CASHBACK_TARGETED_CORPORATION_ID = 'cashbackTargetedCorporationId'; // 返金対象法人ID/法人名
const CASHBACK_TARGETED_BILLING_ID = 'cashbackTargetedBillingId'; // 返金対象請求先ID
const INPUT_DATE_FROM = 'inputDateFrom'; // 入力日（From）
const INPUT_DATE_TO = 'inputDateTo'; // 入力日（To）
const ACCOUNTING_DATE_FROM = 'accountingDateFrom'; // 会計処理日（From）
const ACCOUNTING_DATE_TO = 'accountingDateTo'; // 会計処理日（To）
const APPROVAL_STATUS = 'approvalStatus'; //承認ステータス

/**
 * COM-0032 登録内容確認ポップアップ初期データ
 */
const popupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: '',
};

/** API-COM-9999-0010:
 *  コード管理マスタリストボックス情報取得API リクエストデータモデル */
interface ScrCom9999GetCodeManagementMasterRequest {
  /** コードID */
  codeId: string;
}

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

/**
 * 検索条件データモデル
 */
interface SearchConditionModel {
  // 入金口座種別
  receiptAccountKind: string;
  // 入金グループID/入金ID
  receiptGroupId: string;
  // 契約ID
  contractId: string;
  // 法人ID/法人名
  corporationId: string;
  // 請求先ID
  billingId: string;
  // 銀行名
  bankName: string;
  // 支店名
  branchName: string;
  // 口座名義
  accountName: string;
  // 返金対象法人ID/法人名
  cashbackTargetedCorporationId: string;
  // 返金対象請求先ID
  cashbackTargetedBillingId: string;
  // 入力日（From）
  inputDateFrom: string;
  // 入力日（To）
  inputDateTo: string;
  // 会計処理日（From）
  accountingDateFrom: string;
  // 会計処理日（To）
  accountingDateTo: string;
  // 承認ステータス
  approvalStatus: string[];
}

/**
 * 総合計値モデル
 */
interface SearchResultTotal {
  receiptAmountTotal: number;
  appropriationAmountTotal: number;
  untreatedAmountTotal: number;
  depositAmountTotal: number;
  notTargetedAmountTotal: number;
  carTaxCashBackAmountTotal: number;
  searchResultCount: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 入金口座種別
  receiptAccountKindSelectValues: SelectValue[];
  // 契約ID
  contractIdSelectValues: SelectValue[];
  // 法人ID/法人名
  corporationIdSelectValues: SelectValue[];
  // 請求先ID
  billingIdSelectValues: SelectValue[];
  // 返金対象法人ID/法人名
  cashbackTargetedCorporationIdSelectValues: SelectValue[];
  // 返金対象請求先ID
  cashbackTargetedBillingIdSelectValues: SelectValue[];
  // 承認ステータス
  approvalStatusSelectValues: SelectValue[];
}

/**
 * 検索条件初期データ
 */
const initialValues: SearchConditionModel = {
  // 入金口座種別
  receiptAccountKind: '',
  // 入金グループID/入金ID
  receiptGroupId: '',
  // 契約ID
  contractId: '',
  // 法人ID/法人名
  corporationId: '',
  // 請求先ID
  billingId: '',
  // 銀行名
  bankName: '',
  // 支店名
  branchName: '',
  // 口座名義
  accountName: '',
  // 返金対象法人ID/法人名
  cashbackTargetedCorporationId: '',
  // 返金対象請求先ID
  cashbackTargetedBillingId: '',
  // 入力日（From）
  inputDateFrom: '',
  // 入力日（To）
  inputDateTo: '',
  // 会計処理日（From）
  accountingDateFrom: '',
  // 会計処理日（To）
  accountingDateTo: '',
  // 承認ステータス
  approvalStatus: [],
};

/**
 * 検索条件初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  receiptAccountKindSelectValues: [],
  contractIdSelectValues: [],
  corporationIdSelectValues: [],
  billingIdSelectValues: [],
  cashbackTargetedCorporationIdSelectValues: [],
  cashbackTargetedBillingIdSelectValues: [],
  approvalStatusSelectValues: [],
};
/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'delete',
    headerName: '削除',
    cellType: 'button',
    size: 'm',
  },
  {
    // チェックボックスの位置を削除ボタンの後に設定する
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
  },
  {
    field: 'receiptAccountKind',
    headerName: '入金口座種別',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'receiptGroupId',
    headerName: '入金グループID/入金ID',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'corporationId',
    headerName: '法人ID/法人名',
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
    field: 'receiptAmount',
    headerName: '入金額',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'appropriationAmount',
    headerName: '充当金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'untreatedAmount',
    headerName: '未処理金額',
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
    field: 'notTargetedAmount',
    headerName: '対象外金額',
    cellType: 'input',
    size: 'm',
  },

  {
    field: 'carTaxCashBackAmount',
    headerName: '自税返金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'bankName',
    headerName: '銀行名',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'branchName',
    headerName: '支店名',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'receiptSourceAccountName',
    headerName: '口座名義',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'cashBackTargetedCorporationId',
    headerName: '返金対象法人ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'cashBackTargetedCorporationName',
    headerName: '返金対象法人名',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'cashBackTargetedBillingId',
    headerName: '返金対象請求先ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'receiptStaffEmployeeId',
    headerName: '入力者ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'receiptInputName',
    headerName: '入力者名',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'receiptInputDate',
    headerName: '入力日',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'accountingDate',
    headerName: '会計処理日',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'approvalStatus',
    headerName: '承認ステータス',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
];

const handleGetCellReadonly = (params: any) => {
  return params.field === 'delete' && params.id % 2 === 0;
};

/**
 * 入金一覧検索結果行データモデル
 */
interface SearchResultRowModel {
  // internal ID
  id: string;
  // 入金口座種別
  receiptAccountKind: string;
  // 入金グループID/入金ID
  receiptGroupId: string;
  // 法人ID/法人名
  corporationId: string;
  // 請求先ID
  billingId: string;
  // 入金額
  receiptAmount: number;
  // 充当金額
  appropriationAmount: number;
  // 未処理金額
  untreatedAmount: number;
  // 預かり金額
  depositAmount: number;
  // 対象外金額
  notTargetedAmount: number;
  // 自税返金額
  carTaxCashBackAmount: number;
  // 銀行名
  bankName: string;
  // 支店名
  branchName: string;
  // 口座名義
  receiptSourceAccountName: string;
  // 返金対象法人ID
  cashBackTargetedCorporationId: string;
  // 返金対象法人名
  cashBackTargetedCorporationName: string;
  // 返金対象請求先ID
  cashBackTargetedBillingId: string;
  // 入力者ID
  receiptStaffEmployeeId: string;
  // 入力者名
  receiptInputName: string;
  // 入力日
  receiptInputDate: string;
  // 会計処理日
  accountingDate: string;
  // 承認ステータス
  approvalStatus: string[];
  // 新規追加フラグ
  addFlag: boolean;
}

/**
 * 検索条件モデルから入金情報検索APIリクエストへの変換
 */
const convertFromSearchConditionModel = (
  searchCondition: SearchConditionModel
): ScrTra0016SearchReceiptsRequest => {
  return {
    receiptAccountKind: searchCondition.receiptAccountKind,
    receiptGroupId: searchCondition.receiptGroupId,
    contractId: searchCondition.corporationId,
    corporationId: searchCondition.corporationId,
    billingId: searchCondition.billingId,
    bankName: searchCondition.bankName,
    branchName: searchCondition.branchName,
    accountName: searchCondition.accountName,
    cashbackTargetedCorporationId:
      searchCondition.cashbackTargetedCorporationId,
    cashbackTargetedBillingId: searchCondition.cashbackTargetedBillingId,
    inputDateFrom: new Date(searchCondition.inputDateFrom),
    inputDateTo: new Date(searchCondition.inputDateTo),
    accountingDateFrom: new Date(searchCondition.accountingDateFrom),
    accountingDateTo: new Date(searchCondition.accountingDateTo),
    approvalStatus: searchCondition.approvalStatus,
    changeHistoryNumber: 0,
  };
};

/**
 * 入金一覧検索APIレスポンスから検索結果モデルへの変換(総合計)
 */
const convertToSearchResultTotalModel = (
  model: ScrTra0016SearchReceiptsResponse
): SearchResultTotal => {
  return {
    /** 入金額合計 */
    receiptAmountTotal: model.receiptAmountTotal,
    /** 充当金額合計 */
    appropriationAmountTotal: model.appropriationAmountTotal,
    /** 未処理金額合計 */
    untreatedAmountTotal: model.untreatedAmountTotal,
    /** 預かり金額合計 */
    depositAmountTotal: model.depositAmountTotal,
    /** 対象外金額合計 */
    notTargetedAmountTotal: model.notTargetedAmountTotal,
    /** 自税返金額合計 */
    carTaxCashBackAmountTotal: model.carTaxCashBackAmountTotal,
    /** 検索結果件数 */
    searchResultCount: model.searchResultCount,
  };
};

/**
 * 入金一覧検索APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrTra0016SearchReceiptsResponse,
  scrMem9999response: ScrMem9999SearchconditionRefineResponse | undefined
): SearchResultRowModel[] => {
  const corporationMap: corporationModel[] = [];
  scrMem9999response?.corporationList.forEach((row) => {
    corporationMap.push({
      id: row.corporationId,
      name: row.corporationName,
    });
  });

  return response.searchResult.map((row, index) => {
    // 返金対象法人名を法人IDをもとに導出する
    let corporationName = '';
    const corporationParam = row.corporationId.split(' ');
    corporationMap.forEach((row) => {
      if (row.id === corporationParam[0]) {
        corporationName = row.name;
      }
    });

    return {
      id: index.toString(),
      receiptGroupId: row.receiptGroupId + '-' + row.receiptId, // 入金グループID + "-" + 入金番号
      receiptAccountKind: row.receiptAccountKind, // 入金口座種別
      corporationId: row.corporationId, // 法人ID/法人名
      billingId: row.billingId, // 請求先ID
      receiptAmount: row.receiptAmount, // 入金額
      appropriationAmount: row.appropriationAmount, // 充当金額
      untreatedAmount: row.untreatedAmount, // 未処理金額
      depositAmount: row.depositAmount, // 預かり金額
      notTargetedAmount: row.notTargetedAmount, // 対象外金額
      carTaxCashBackAmount: row.carTaxCashBackAmount, // 自税返金額
      bankName: row.bankName, // 銀行名
      branchName: row.branchName, // 支店名
      receiptSourceAccountName: row.receiptSourceAccountName, // 口座名義
      cashBackTargetedCorporationId: row.cashBackTargetedCorporationId, // 返金対象法人ID
      cashBackTargetedCorporationName: corporationName, // 返金対象法人名
      cashBackTargetedBillingId: row.cashBackTargetedBillingId, // 返金対象請求先ID
      receiptStaffEmployeeId: row.receiptStaffEmployeeId, // 入力者ID
      receiptInputName: row.receiptInputName, // 入力者名
      receiptInputDate: row.receiptInputDate.toString(), // 入力日
      accountingDate: row.accountingDate.toString(), // 会計処理日
      approvalStatus: row.approvalStatus, // 承認ステータス
      addFlag: false, // 新規追加フラグ
    };
  });
};

/**
 * 追加結果行データモデル
 */
interface AddResultModel {
  // 入金グループID/入金ID
  receiptGroupId: string;
  // 入力日
  inputDate: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
  // 新規追加フラグ
  addFlag: boolean;
}

/**
 * 入金伝票追加APIレスポンスから検索結果モデルへの変換
 */
const convertToAddResultRowModel = (
  response: ScrTra0016ReceiptSlipAdditionResponse
): AddResultModel => {
  return {
    // 入金グループID/入金ID
    receiptGroupId: response.receiptGroupId,
    // 入力日
    inputDate: response.inputDate,
    // 変更タイムスタンプ
    changeTimestamp: response.changeTimestamp,
    // 新規追加フラグ
    addFlag: true,
  };
};

/** 入金情報詳細編集チェックAPI結果モデル */
interface CheckReceiptDetailModel {
  /** エラー内容リスト */
  errorList: errorList[];
  /** ワーニング内容リスト */
  warningList: warningList[];
}

/** 入金情報詳細編集チェックAPI結果モデル(エラー内容リスト) */
/** 返金対象チェックAPI結果モデル(エラー内容リスト) */
/** 入金伝票入力チェックAPI結果モデル(エラー内容リスト) */
interface errorList {
  /** エラーコード */
  errorCode: string;
  /** エラーメッセージ */
  errorMessage: string;
}

/** 入金情報詳細編集チェックAPI結果モデル(ワーニング内容リスト) */
/** 返金対象チェックAPI結果モデル(ワーニング内容リスト) */
/** 入金伝票入力チェックAPI結果モデル(ワーニング内容リスト) */
interface warningList {
  /** ワーニングコード */
  warningCode: string;
  /** ワーニングメッセージ */
  warningMessage: string;
}

/** 入金情報詳細編集チェックAPIレスポンスから検索結果モデルへの変換 */
const convertToCheckReceiptDetailModel = (
  response: ScrTra0016CheckReceiptDetailResponse
): CheckReceiptDetailModel => {
  return {
    /** エラー内容リスト */
    errorList: response.errorList,
    /** ワーニング内容リスト */
    warningList: response.warningList,
  };
};

/** 入金伝票入力チェックモデル */
interface CheckReceiptInputModel {
  /** エラー内容リスト */
  errorList: errorList[];
  /** ワーニング内容リスト */
  warningList: warningList[];
}

/** 入金伝票入力チェックAPIレスポンスから検索結果モデルへの変換 */
const convertToScrTra0016CheckReceiptInputModel = (
  response: ScrTra0016CheckReceiptInputResponse
): CheckReceiptInputModel => {
  return {
    /** エラー内容リスト */
    errorList: response.errorList,
    /** ワーニング内容リスト */
    warningList: response.warningList,
  };
};

/** 自動消込の検索データモデル */
interface AutoClearingExecuteSearchModel2 {
  AutoClearingExecuteRequestResult: AutoClearingExecuteRequestResult[];
}

/** 自動消込の検索データモデル */
interface AutoClearingExecuteSearchModel {
  /** 入金グループID */
  receiptGroupId: string;
  /** 入金番号 */
  receiptId: string;
  /** 法人ID */
  corporationId: string;
  /** 請求先ID */
  billingId: string;
  /** 入金額 */
  receiptAmount: number;
}

/**
 * 自動消込データモデル
 */
interface AutoClearingResultModel {
  receiptGroupId: string;
  receiptId: string;
}

/**
 * 自動消込APIレスポンスから自動消込モデルへの変換
 */
const convertFromAutoClearingExecuteModel = (
  response: ScrTra0016AutoClearingExecuteResponse
): AutoClearingResultModel[] => {
  return response.AutoClearingExecuteResult.map((x) => {
    return {
      receiptGroupId: x.receiptGroupId,
      receiptId: x.receiptId,
    };
  });
};

/** 返金対象チェックAPI結果モデル */
interface CheckCashbackTargetModel {
  /** エラー内容リスト */
  errorList: errorList[];
  /** ワーニング内容リスト */
  warningList: warningList[];
}

/** 返金対象チェックAPIレスポンスから検索結果モデルへの変換 */
const convertToCheckCashbackTargetModel = (
  response: ScrTra0016CheckCashbackTargetResponse
): CheckCashbackTargetModel => {
  return {
    /** エラー内容リスト */
    errorList: response.errorList,
    /** ワーニング内容リスト */
    warningList: response.warningList,
  };
};

/**
 * 入金伝票追加APIレスポンスから検索結果モデルへの変換
 */
const convertToAutoClearingExecuteRowModel = (
  response: ScrTra0016AutoClearingExecuteResponse
) => {
  return {
    response,
  };
};

type key = keyof SearchConditionModel;

/**
 * 入力項目
 */
const serchData: { label: string; name: key }[] = [
  { label: '入金口座種別', name: 'receiptAccountKind' },
  { label: '入金グループID/入金ID', name: 'receiptGroupId' },
  { label: '契約ID', name: 'contractId' },
  { label: '法人ID/法人名', name: 'corporationId' },
  { label: '請求先ID', name: 'billingId' },
  { label: '銀行名', name: 'bankName' },
  { label: '支店名', name: 'branchName' },
  { label: '口座名義', name: 'accountName' },
  { label: '返金対象法人ID/法人名', name: 'cashbackTargetedCorporationId' },
  { label: '返金対象請求先ID', name: 'cashbackTargetedBillingId' },
  { label: '入力日(From)', name: 'inputDateFrom' },
  { label: '入力日(To)', name: 'inputDateTo' },
  { label: '会計処理日(From)', name: 'accountingDateFrom' },
  { label: '会計処理日(To)', name: 'accountingDateTo' },
  { label: '承認ステータス', name: 'approvalStatus' },
];

/** 検索項目のバリデーション */
const searchConditionSchema = {
  // 入金口座種別
  receiptAccountKind: yup.string().max(4).label('入金口座種別'),
  // 入金グループID/入金ID
  receiptGroupId: yup.string().half().max(25).label('入金グループID/入金ID'),
  // 契約ID
  contractId: yup.string().half().max(7).label('契約ID'),
  // 法人ID/法人名
  corporationId: yup.string().max(39).label('法人ID/法人名'),
  // 請求先ID
  billingId: yup.string().half().max(4).label('請求先ID'),
  // 銀行名
  bankName: yup.string().half().max(30).label('銀行名'),
  // 支店名
  branchName: yup.string().half().max(30).label('支店名'),
  // 口座名義
  accountName: yup.string().half().max(40).label('口座名義'),
  // 返金対象法人ID/法人名
  cashbackTargetedCorporationId: yup
    .string()
    .max(39)
    .label('返金対象法人ID/法人名'),
  // 返金対象請求先ID
  cashbackTargetedBillingId: yup
    .string()
    .half()
    .max(4)
    .label('返金対象請求先ID'),
  // 入力日（From）
  inputDateFrom: yup.date().max(10).label('入力日（From）'),
  // 入力日（To）
  inputDateTo: yup.date().max(10).label('入力日（To）'),
  // 会計処理日（From）
  accountingDateFrom: yup.date().max(10).label('会計処理日（From）'),
  // 会計処理日（To）
  accountingDateTo: yup.date().max(10).label('会計処理日（To）'),
  // 承認ステータス
  approvalStatus: yup.string().max(5).label('承認ステータス'),
};

/**
 * 一覧のバリデーション
 */
const searchResultValidationSchema: ObjectSchema<any> = yup.object({
  // 入金口座種別
  receiptAccountKind: yup.string().max(4).label('入金口座種別'),
  // 入金グループID/入金ID
  receiptGroupId: yup.string().half().max(25).label('入金グループID/入金番号'),
  // 法人ID/法人名
  corporationId: yup.string().max(39).label('法人ID/法人名'),
  // 請求先ID
  billingId: yup.string().half().max(4).label('請求先ID'),
  // 入金額
  receiptAmount: yup.string().numberWithComma().max(11).label('入金額'),
  // 充当金額
  appropriationAmount: yup.string().numberWithComma().max(11).label('充当金額'),
  // 未処理金額
  untreatedAmount: yup.string().numberWithComma().max(11).label('未処理金額'),
  // 預かり金額
  depositAmount: yup.string().numberWithComma().max(11).label('預かり金額'),
  // 対象外金額
  notTargetedAmount: yup.string().numberWithComma().max(11).label('対象外金額'),
  // 自税返金額
  carTaxCashBackAmount: yup
    .string()
    .numberWithComma()
    .max(11)
    .label('自税返金額'),
  // 銀行名
  bankName: yup.string().half().max(30).label('銀行名'),
  // 支店名
  branchName: yup.string().half().max(30).label('支店名'),
  // 口座名義
  receiptSourceAccountName: yup.string().half().max(40).label('口座名義'),
  // 返金対象法人ID
  cashBackTargetedCorporationId: yup
    .string()
    .half()
    .max(8)
    .label('返金対象法人ID'),
  // 返金対象法人名
  cashBackTargetedCorporationName: yup.string().max(30).label('返金対象法人名'),
  // 返金対象請求先ID
  cashBackTargetedBillingId: yup
    .string()
    .half()
    .max(4)
    .label('返金対象請求先ID'),
  // 入力者ID
  receiptStaffEmployeeId: yup.string().half().max(5).label('入力者ID'),
  // 入力者名
  receiptInputName: yup.string().max(42).label('入力者名'),
  // 入力日
  receiptInputDate: yup.date().max(10).label('入力日'),
  // 会計処理日
  accountingDate: yup.date().max(10).label('会計処理日'),
  // 承認ステータス
  approvalStatus: yup.date().max(5).label('承認ステータス'),
});

type addKey = keyof AddResultModel;
/**
 * 入力項目
 */
const addData: { label: string; name: addKey }[] = [
  { label: '入金グループID/入金ID', name: 'receiptGroupId' },
  { label: '入力日', name: 'inputDate' },
  { label: '変更タイムスタンプ', name: 'changeTimestamp' },
];

/**
 * 各種合計金額(項目)
 */
const tableColumns: TableColDef[] = [
  { field: 'receiptAmount', headerName: '入金額', width: 150 },
  { field: 'appropriationAmount', headerName: '充当金額', width: 150 },
  { field: 'untreatedAmount', headerName: '未処理金額', width: 150 },
  { field: 'depositAmount', headerName: '預かり金額', width: 150 },
  { field: 'notTargetedAmount', headerName: '対象外金額', width: 150 },
  { field: 'carTaxCashBackAmount', headerName: '自税返金額', width: 150 },
];

/**
 * セッションストレージ情報のデータモデル
 */
interface SessionStorageModel {
  /** 請求先ID */
  billingId: string | null;
  /** 法人ID/法人名 */
  corporationId: string | null;
  /** 債権番号リスト */
  receivables: string | null;
}

/**
 * 入力パラメータデータモデル
 */
interface searchParams {
  // 呼出元画面ID
  expirationScreenId: string;
  // 入金グループID
  receiptGroupId: string;
  // 変更履歴番号
  changeHistoryNumber: string;
  // 一括登録ID
  allRegistrationId: string;
  // アップロードファイル
  uploadFile: string;
}

/**
 * コードマスター変換モデル
 */
interface codeMaster {
  // 値
  value: string;
  // 表示名
  displayValue: string;
}

/**
 * 法人ID/法人名モデル
 */
interface corporationModel {
  id: string;
  name: string;
}

/**
 * 取込対象選択データ
 */
const allRegistrationDefinitions: ScrCom0035PopupAllRegistrationDefinitionModel[] =
  [
    {
      id: 'BRG-TRA-0003',
      label: 'BRG-TRA-0003',
    },
    {
      id: 'BRG-TRA-0004',
      label: 'BRG-TRA-0004',
    },
  ];

/** エラー確認ポップアップモデル */
interface ScrCom0038PopupModel {
  // エラーリスト
  errorList: errorList[];
  // ワーニング内容リスト
  warningList: warningList[];
  // 呼出元画面ID
  expirationScreenId: string;
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

/** エラー確認ポップアップ初期データ */
const scrCom0038PopupInitialValues: ScrCom0038PopupModel = {
  // エラーリスト
  errorList: [],
  // ワーニングリスト
  warningList: [],
  // 呼出元画面ID
  expirationScreenId: SCR_TRA_0016,
};

/**
 * SCR-TRA-0016 入金一覧画面
 */
const ScrTra0016Page = () => {
  // 入力パラメーター取得
  const [searchParams] = useSearchParams();

  // 入力パラメーター取得
  const query = new URLSearchParams(useLocation().search);

  const queryParam: searchParams = {
    // 遷移元画面ID
    expirationScreenId: '' + query.get('expirationScreenId'),
    // 入金グループID
    receiptGroupId: '' + searchParams.get('receiptGroupId'),
    // 変更履歴番号
    changeHistoryNumber: '' + searchParams.get('changeHistoryNumber'),
    // 一括登録ID
    allRegistrationId: '' + searchParams.get('allRegistrationId'),
    // アップロードファイル
    uploadFile: '' + searchParams.get('uploadFile'),
  };

  // アプリケーションIDを取得
  const applicationId = searchParams.get('applicationId');
  // メッセージを取得
  const { getMessage } = useContext(MessageContext);
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  // CSVダウンロード関連
  const { user } = useContext(AuthContext);
  const apiRef = useGridApiRef();
  const maxSectionWidth =
    Number(
      apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
    ) + 40;

  // context
  const { saveState, loadState } = useContext(AppContext);
  const prevValues = loadState();

  // コード管理マスタ
  const [codeMaster, setCodeMaster] = useState<ResultList[]>([]);

  // form
  const methods = useForm<SearchConditionModel>({
    defaultValues: prevValues === undefined ? initialValues : prevValues,
    context: false,
    resolver: yupResolver(yup.object(searchConditionSchema)),
  });
  const { getValues } = methods;

  const addResulValues = useForm<AddResultModel>({
    defaultValues: prevValues === undefined ? initialValues : prevValues,
    context: false,
  });

  const autoClearingResultValues = useForm<AutoClearingExecuteSearchModel>({
    defaultValues: prevValues === undefined ? initialValues : prevValues,
    context: false,
  });

  // セレクトボックス
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 総合計 totalRows -> ... tableRows
  const [tableRows, setTotalValues] = useState<TableRowModel[]>([]);

  // 検索結果一覧
  const [searchRowsValues, setSearchResult] = useState<SearchResultRowModel[]>(
    []
  );
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const [openSection, setOpenSection] = useState<boolean>(true);
  // チェックボックス選択行
  const [rowSelectionModel, setRowSelectionModel] = useState<any[]>([]);
  const [selectIndex, setSelectIndex] = useState<string>();

  // 新規行追加有無フラグ
  const [addFlag, setAddFlag] = useState<boolean>(false);

  // router
  const navigate = useNavigate();

  // 入金一覧検索活性/非活性フラグ(ワークリストからの遷移の場合のみ非活性にする)
  const [disableFlag, setDisableFlag] = useState<boolean>(false);

  // 各種ボタン有効/無効フラグ
  // 検索ボタン無効化
  const [searchButtonDisableFlag, setSearchButtonDisableFlag] =
    useState<boolean>(false);
  // 追加ボタン無効化
  const [addButtonDisableFlag, setAddButtonDisableFlag] =
    useState<boolean>(false);
  // FBデータ取込ボタン無効化
  const [fbDataImportButtonDisableFlag, setAfbDataImportButtonDisableFlag] =
    useState<boolean>(true);
  // 入金明細取込
  const [
    receiptDetailsImportButtonDisableFlag,
    setAreceiptDetailsImportButtonDisableFlag,
  ] = useState<boolean>(true);
  // 自動消込
  const [
    automaticClearingButtonDisableFlag,
    setAutomaticClearingButtonDisableFlag,
  ] = useState<boolean>(true);
  // 返金処理
  const [
    cashBackProcessButtonDisableFlag,
    setAcashBackProcessButtonDisableFlag,
  ] = useState<boolean>(true);
  // CSV出力
  const [csvOutputButtonDisableFlag, setAcsvOutputButtonDisableFlag] =
    useState<boolean>(true);

  // リンクパラメータ
  // 入金口座種別
  const [receiptAccountKind, setReceiptAccountKind] = useState<string>('');
  // 法人ID/法人名
  const [corporationId, setCorporationId] = useState<string>('');

  // 編集可否フラグ
  const [rowdDisableFlag, setRowdDisableFlag] = useState<boolean>(false);

  // 確定ボタン可否フラグ
  const [confirmDisableflag, setConfirmDisableflag] = useState<boolean>(false);

  // FBデータ取込エラー判定
  const [fbDataImportChkErrFlg, setFbDataImportChkErrFlg] =
    useState<boolean>(false);

  // 遷移元画面
  //const [dispType, setdispFlag] = useState<string>('');

  // CSV表示状態
  const [isOpen35Popup, setIsOpen35Popup] = useState(false);

  // エラーポップアップ表示状態
  const [isOpen38Popup, setIsOpen38Popup] = useState(false);

  // エラー画面 state
  const [ScrCom0038PopupValues, setScrCom0038PopupValues] =
    useState<ScrCom0038PopupModel>(scrCom0038PopupInitialValues);

  // CSV取り込み対象
  const [allRegistrationDefinitions, setAllRegistrationDefinitions] = useState<
    ScrCom0035PopupAllRegistrationDefinitionModel[]
  >([]);
  const [scrCom0035PopupIsOpen, setScrCom0035PopupIsOpen] =
    useState<boolean>(false);

  // 入金グループID/入金ID (既定値)
  const [valueReceiptGroupId, setValueReceiptGroupId] = useState<
    string | null
  >();

  // 銀行名 (既定値)
  const [valueBankName, setValueBankName] = useState<string | null>();

  // 支店名 (既定値)
  const [valueBranchName, setValueBranchName] = useState<string | null>();

  // 口座名義 (既定値)
  const [valueAccountName, setValueAccountName] = useState<string | null>();

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(popupInitialValues);

  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);

  // 入金グループID
  const [receiptGroupIds, setReceiptGroupIds] = useState<string[]>([]);

  useEffect(() => {
    // 遷移元画面により分岐する
    setDisableFlag(false);
    if (SCR_COM_0003 === queryParam.expirationScreenId) {
      // ワークリストからの遷移

      // セッションから値を復元する
      // テキスト系パラメータの設定
      setValueReceiptGroupId(sessionStorage.getItem(RECEIPT_GROUPID)); // 入金グループID/入金ID
      setValueBankName(sessionStorage.getItem(BANK_NAME)); // 銀行名
      setValueBranchName(sessionStorage.getItem(BRANCH_NAME)); // 支店名
      setValueAccountName(sessionStorage.getItem(ACCOUNT_NAME)); // 口座名義

      sessionStorage.getItem(INPUT_DATE_FROM); // 入力日（From）
      sessionStorage.getItem(INPUT_DATE_TO); // 入力日（To）
      sessionStorage.getItem(ACCOUNTING_DATE_FROM); // 会計処理日（From）
      sessionStorage.getItem(ACCOUNTING_DATE_TO); // 会計処理日（To）

      const initialize = async () => {
        setDisableFlag(true);
        setSearchButtonDisableFlag(true); // 検索ボタン無効化
        setAddButtonDisableFlag(true); // 追加ボタン無効化
        setRowdDisableFlag(true); // 検索結果一覧無効化
        setConfirmDisableflag(true); // 確定ボタン無効化

        // コード管理マスタ情報取得API
        const codeMasterRequest: ScrCom9999getCodeManagementMasterMultipleRequest =
          {
            codeId: [
              CDE_COM_0114, // 入金口座種別
              CDE_TRA_1004, // 承認ステータス
            ],
          };
        const codeMasterResponse: ScrCom9999getCodeManagementMasterMultipleResponse =
          await ScrCom9999getCodeManagementMasterMultiple(codeMasterRequest);
        const codeMasterList: ResultList[] = [];
        codeMasterResponse.resultList.map((x) => {
          codeMasterList.push({
            codeId: x.codeId,
            codeValueList: x.codeValueList,
          });
        });
        setCodeMaster(codeMasterList);

        /** API-TRA-0016-0001 - 入金一覧取得API */
        const param: ScrTra0016SearchReceiptsRequest = {
          receiptAccountKind: '',
          receiptGroupId: '',
          contractId: '',
          corporationId: '',
          billingId: '',
          bankName: '',
          branchName: '',
          accountName: '',
          cashbackTargetedCorporationId: '',
          cashbackTargetedBillingId: '',
          inputDateFrom: new Date(''),
          inputDateTo: new Date(''),
          accountingDateFrom: new Date(''),
          accountingDateTo: new Date(''),
          approvalStatus: [],
          changeHistoryNumber: Number(queryParam.expirationScreenId), // 変更履歴番号
        };
        const response = await ScrTra0016SearchReceipts(param);

        // 件数チェック:入金一覧データ取得APIのレスポンス.制限件数 < 取得件数 の場合はアラート表示を行う
        if (Number(response.limitCount) < Number(response.acquisitionCount)) {
          const messege = Format(getMessage('MSG-FR-INF-00004'), [
            response.acquisitionCount.toString(),
            response.responseCount.toString(),
          ]);
          // アラートを表示
          setTitle(messege);
          setHandleDialog(true);
        }

        /**
         * 総合計(値)
         */
        const totalResult = convertToSearchResultTotalModel(response);
        const tableRows: TableRowModel[] = [
          {
            receiptAmount: totalResult.receiptAmountTotal,
            appropriationAmount: totalResult.appropriationAmountTotal,
            untreatedAmount: totalResult.untreatedAmountTotal,
            depositAmount: totalResult.depositAmountTotal,
            notTargetedAmount: totalResult.notTargetedAmountTotal,
            carTaxCashBackAmount: totalResult.carTaxCashBackAmountTotal,
          },
        ];
        setTotalValues(tableRows);
        // ワークリストからの遷移時はボタンを全て無効化する
        setAfbDataImportButtonDisableFlag(true); // FBデータ取込ボタン無効化
        setAreceiptDetailsImportButtonDisableFlag(true); // 入金明細取込
        setAutomaticClearingButtonDisableFlag(true); // 自動消込
        setAcashBackProcessButtonDisableFlag(true); // 返金処理
        setAcsvOutputButtonDisableFlag(true); // CSV出力

        /**
         * 検索結果(一覧行)
         */
        const searchResult = convertToSearchResultRowModel(response, undefined);
        setSearchResult(searchResult);

        codeMaster.forEach((cm) => {
          // 入金口座種別
          if (CDE_COM_0114 === cm.codeId) {
            cm.codeValueList.forEach((cvl) => {
              if (
                sessionStorage.getItem(RECEIPT_ACCOUNTKIND) === cvl.codeValue
              ) {
                selectValues.receiptAccountKindSelectValues.push({
                  value: cvl.codeValue,
                  displayValue: cvl.codeName,
                });
              }
            });
          }
          // 承認ステータス
          if (CDE_TRA_1004 === cm.codeId) {
            cm.codeValueList.forEach((cvl) => {
              if (sessionStorage.getItem(APPROVAL_STATUS) === cvl.codeValue) {
                selectValues.approvalStatusSelectValues.push({
                  value: cvl.codeValue,
                  displayValue: cvl.codeName,
                });
              }
            });
          }
        });

        // API-MEM-9999-0023 : 検索条件絞込API : 契約ID, 法人ID/法人名, 請求先ID
        const codeMasterRequestMem0023: ScrMem9999SearchconditionRefineRequest =
          {
            contractId: '', // 契約ID
            corporationId: '', // 法人ID
            billingId: '', // 請求先ID
          };
        const searchconditionRefine = await ScrMem9999SearchconditionRefine(
          codeMasterRequestMem0023
        );
        // 契約ID, 返金対象法人ID/法人名
        searchconditionRefine.corporationList.map((x) => {
          // 法人名/法人ID
          if (sessionStorage.getItem(CORPORATION_ID) === x.corporationId) {
            selectValues.corporationIdSelectValues.push({
              value: x.corporationId,
              displayValue: x.corporationName,
            });
          }
          // 契約ID
          if (sessionStorage.getItem(CONTRACT_ID) === x.corporationId) {
            selectValues.contractIdSelectValues.push({
              value: x.corporationId,
              displayValue: x.corporationName,
            });
          }
          // 返金対象法人ID/法人名
          if (
            sessionStorage.getItem(CASHBACK_TARGETED_CORPORATION_ID) ===
            x.corporationId
          ) {
            selectValues.cashbackTargetedCorporationIdSelectValues.push({
              value: x.corporationId,
              displayValue: x.corporationName,
            });
          }
        });

        // 請求先ID
        selectValues.billingIdSelectValues.push({
          value: '' + sessionStorage.getItem(BILLING_ID),
          displayValue: '' + sessionStorage.getItem(BILLING_ID),
        });
        // 返金対象請求先ID
        selectValues.cashbackTargetedBillingIdSelectValues.push({
          value: '' + sessionStorage.getItem(CASHBACK_TARGETED_BILLING_ID),
          displayValue:
            '' + sessionStorage.getItem(CASHBACK_TARGETED_BILLING_ID),
        });

        // セレクトボックス設定
        setSelectValues({
          // 入金口座種別
          receiptAccountKindSelectValues:
            selectValues.receiptAccountKindSelectValues,
          // 契約ID
          contractIdSelectValues: selectValues.contractIdSelectValues,
          // 法人ID/法人名
          corporationIdSelectValues: selectValues.corporationIdSelectValues,
          // 請求先ID
          billingIdSelectValues: selectValues.billingIdSelectValues,
          // 返金対象法人ID/法人名
          cashbackTargetedCorporationIdSelectValues:
            selectValues.cashbackTargetedCorporationIdSelectValues,
          // 返金対象請求先ID
          cashbackTargetedBillingIdSelectValues:
            selectValues.cashbackTargetedBillingIdSelectValues,
          // 承認ステータス
          approvalStatusSelectValues: selectValues.approvalStatusSelectValues,
        });

        const href = searchResult.map((x) => {
          return {
            field: 'receiptGroupId',
            id: x.receiptGroupId,
            href:
              '/tra/corporations/' +
              '&receiptAccountKind=' +
              x.receiptAccountKind +
              '&corporationId=' +
              x.corporationId +
              '&billingId=' +
              x.billingId +
              '&receiptAmount=' +
              x.receiptAmount +
              '&accountingDate=' +
              x.accountingDate,
          };
        });
        const hrefs = [
          {
            field: 'receiptGroupId',
            hrefs: href,
          },
        ];
        setHrefs(hrefs);
        setOpenSection(false);
      };
      initialize();
    } else if (SCR_TRA_0019 === queryParam.expirationScreenId) {
      // 返金一覧からの遷移
      // セッションから値を復元する
      // テキスト系パラメータの設定
      setValueReceiptGroupId(sessionStorage.getItem(RECEIPT_GROUPID)); // 入金グループID/入金ID
      setValueBankName(sessionStorage.getItem(BANK_NAME)); // 銀行名
      setValueBranchName(sessionStorage.getItem(BRANCH_NAME)); // 支店名
      setValueAccountName(sessionStorage.getItem(ACCOUNT_NAME)); // 口座名義

      sessionStorage.getItem(INPUT_DATE_FROM); // 入力日（From）
      sessionStorage.getItem(INPUT_DATE_TO); // 入力日（To）
      sessionStorage.getItem(ACCOUNTING_DATE_FROM); // 会計処理日（From）
      sessionStorage.getItem(ACCOUNTING_DATE_TO); // 会計処理日（To）

      const initialize = async () => {
        // コード管理マスタ情報取得API
        const codeMasterRequest: ScrCom9999getCodeManagementMasterMultipleRequest =
          {
            codeId: [
              CDE_COM_0114, // 入金口座種別
              CDE_TRA_1004, // 承認ステータス
            ],
          };
        const codeMasterResponse: ScrCom9999getCodeManagementMasterMultipleResponse =
          await ScrCom9999getCodeManagementMasterMultiple(codeMasterRequest);
        const codeMasterList: ResultList[] = [];
        codeMasterResponse.resultList.map((x) => {
          codeMasterList.push({
            codeId: x.codeId,
            codeValueList: x.codeValueList,
          });
        });
        setCodeMaster(codeMasterList);

        /** API-TRA-0016-0001 - 入金一覧取得API */
        const approvalStatusParam: string[] = [
          '' + sessionStorage.getItem(APPROVAL_STATUS),
        ];
        const param: ScrTra0016SearchReceiptsRequest = {
          receiptAccountKind: '' + sessionStorage.getItem(RECEIPT_ACCOUNTKIND),
          receiptGroupId: '' + sessionStorage.getItem(RECEIPT_GROUPID),
          contractId: '' + sessionStorage.getItem(CONTRACT_ID),
          corporationId: '' + sessionStorage.getItem(CORPORATION_ID),
          billingId: '' + sessionStorage.getItem(BILLING_ID),
          bankName: '' + sessionStorage.getItem(BANK_NAME),
          branchName: '' + sessionStorage.getItem(BRANCH_NAME),
          accountName: '' + sessionStorage.getItem(ACCOUNT_NAME),
          cashbackTargetedCorporationId:
            '' + sessionStorage.getItem(CASHBACK_TARGETED_CORPORATION_ID),
          cashbackTargetedBillingId:
            '' + sessionStorage.getItem(CASHBACK_TARGETED_BILLING_ID),
          inputDateFrom: new Date(
            Date.parse('' + sessionStorage.getItem(INPUT_DATE_FROM))
          ),
          inputDateTo: new Date(
            Date.parse('' + sessionStorage.getItem(INPUT_DATE_TO))
          ),
          accountingDateFrom: new Date(
            Date.parse('' + sessionStorage.getItem(ACCOUNTING_DATE_FROM))
          ),
          accountingDateTo: new Date(
            Date.parse('' + sessionStorage.getItem(ACCOUNTING_DATE_TO))
          ),
          approvalStatus: approvalStatusParam,
          changeHistoryNumber: Number(queryParam.expirationScreenId), // 変更履歴番号
        };
        const response = await ScrTra0016SearchReceipts(param);

        // 件数チェック:入金一覧データ取得APIのレスポンス.制限件数 < 取得件数 の場合はアラート表示を行う
        if (Number(response.limitCount) < Number(response.acquisitionCount)) {
          const messege = Format(getMessage('MSG-FR-INF-00004'), [
            response.acquisitionCount.toString(),
            response.responseCount.toString(),
          ]);
          // アラートを表示
          setTitle(messege);
          setHandleDialog(true);
        }

        /**
         * 総合計(値)
         */
        const totalResult = convertToSearchResultTotalModel(response);
        const tableRows: TableRowModel[] = [
          {
            receiptAmount: totalResult.receiptAmountTotal,
            appropriationAmount: totalResult.appropriationAmountTotal,
            untreatedAmount: totalResult.untreatedAmountTotal,
            depositAmount: totalResult.depositAmountTotal,
            notTargetedAmount: totalResult.notTargetedAmountTotal,
            carTaxCashBackAmount: totalResult.carTaxCashBackAmountTotal,
          },
        ];
        setTotalValues(tableRows);
        // ワークリストからの遷移時はボタンを全て無効化する
        setAfbDataImportButtonDisableFlag(true); // FBデータ取込ボタン無効化
        setAreceiptDetailsImportButtonDisableFlag(true); // 入金明細取込
        setAutomaticClearingButtonDisableFlag(true); // 自動消込
        setAcashBackProcessButtonDisableFlag(true); // 返金処理
        setAcsvOutputButtonDisableFlag(true); // CSV出力

        /**
         * 検索結果(一覧行)
         */
        const searchResult = convertToSearchResultRowModel(response, undefined);
        setSearchResult(searchResult);

        codeMaster.forEach((cm) => {
          // 入金口座種別
          if (CDE_COM_0114 === cm.codeId) {
            cm.codeValueList.forEach((cvl) => {
              if (
                sessionStorage.getItem(RECEIPT_ACCOUNTKIND) === cvl.codeValue
              ) {
                selectValues.receiptAccountKindSelectValues.push({
                  value: cvl.codeValue,
                  displayValue: cvl.codeName,
                });
              }
            });
          }
          // 承認ステータス
          if (CDE_TRA_1004 === cm.codeId) {
            cm.codeValueList.forEach((cvl) => {
              if (sessionStorage.getItem(APPROVAL_STATUS) === cvl.codeValue) {
                selectValues.approvalStatusSelectValues.push({
                  value: cvl.codeValue,
                  displayValue: cvl.codeName,
                });
              }
            });
          }
        });

        // API-MEM-9999-0023 : 検索条件絞込API : 契約ID, 法人ID/法人名, 請求先ID
        const codeMasterRequestMem0023: ScrMem9999SearchconditionRefineRequest =
          {
            contractId: '', // 契約ID
            corporationId: '', // 法人ID
            billingId: '', // 請求先ID
          };
        const searchconditionRefine = await ScrMem9999SearchconditionRefine(
          codeMasterRequestMem0023
        );
        // 契約ID, 返金対象法人ID/法人名
        searchconditionRefine.corporationList.map((x) => {
          // 法人名/法人ID
          if (sessionStorage.getItem(CORPORATION_ID) === x.corporationId) {
            selectValues.corporationIdSelectValues.push({
              value: x.corporationId,
              displayValue: x.corporationName,
            });
          }
          // 契約ID
          if (sessionStorage.getItem(CONTRACT_ID) === x.corporationId) {
            selectValues.contractIdSelectValues.push({
              value: x.corporationId,
              displayValue: x.corporationName,
            });
          }
          // 返金対象法人ID/法人名
          if (
            sessionStorage.getItem(CASHBACK_TARGETED_CORPORATION_ID) ===
            x.corporationId
          ) {
            selectValues.cashbackTargetedCorporationIdSelectValues.push({
              value: x.corporationId,
              displayValue: x.corporationName,
            });
          }
        });

        // 請求先ID
        selectValues.billingIdSelectValues.push({
          value: '' + sessionStorage.getItem(BILLING_ID),
          displayValue: '' + sessionStorage.getItem(BILLING_ID),
        });
        // 返金対象請求先ID
        selectValues.cashbackTargetedBillingIdSelectValues.push({
          value: '' + sessionStorage.getItem(CASHBACK_TARGETED_BILLING_ID),
          displayValue:
            '' + sessionStorage.getItem(CASHBACK_TARGETED_BILLING_ID),
        });

        // セレクトボックス設定
        setSelectValues({
          // 入金口座種別
          receiptAccountKindSelectValues:
            selectValues.receiptAccountKindSelectValues,
          // 契約ID
          contractIdSelectValues: selectValues.contractIdSelectValues,
          // 法人ID/法人名
          corporationIdSelectValues: selectValues.corporationIdSelectValues,
          // 請求先ID
          billingIdSelectValues: selectValues.billingIdSelectValues,
          // 返金対象法人ID/法人名
          cashbackTargetedCorporationIdSelectValues:
            selectValues.cashbackTargetedCorporationIdSelectValues,
          // 返金対象請求先ID
          cashbackTargetedBillingIdSelectValues:
            selectValues.cashbackTargetedBillingIdSelectValues,
          // 承認ステータス
          approvalStatusSelectValues: selectValues.approvalStatusSelectValues,
        });

        // 入金口座種別のセレクトボックスを設定する
        searchResult.forEach((x) => {
          searchResultColumns[2].selectValues?.push({
            value: x.receiptAccountKind,
            displayValue: x.receiptAccountKind,
          });
        });

        // 入金グループID/入金IDにリンクを付与する
        const receiptGroupIdHrefs: GridHrefsModel[] = [];
        receiptGroupIdHrefs.push({
          field: 'receiptGroupId',
          hrefs: searchResult.map((x) => {
            return {
              id: x.id,
              href:
                '/tra/corporations/' +
                '&receiptAccountKind=' +
                x.receiptAccountKind +
                '&corporationId=' +
                x.corporationId +
                '&billingId=' +
                x.billingId +
                '&receiptAmount=' +
                x.receiptAmount +
                '&accountingDate=' +
                x.accountingDate,
            };
          }),
        });
        setHrefs(receiptGroupIdHrefs);

        // 法人ID/法人名のセレクトボックスを設定する
        searchResult.map((x) => {
          searchResultColumns[4].selectValues?.push({
            value: x.corporationId,
            displayValue: x.corporationId + x.corporationId,
          });
        });

        // 請求先IDのセレクトボックスを設定する
        searchResult.map((x) => {
          searchResultColumns[5].selectValues?.push({
            value: x.billingId,
            displayValue: x.billingId,
          });
        });

        // 承認ステータスを設定する
        codeMaster.map((x) => {
          if (CDE_TRA_1004 === x.codeId) {
            x.codeValueList.map((y) => {
              searchResultColumns[22].selectValues?.push({
                value: y.codeValue,
                displayValue: y.codeName,
              });
            });
          }
        });

        const href = searchResult.map((x) => {
          return {
            field: 'receiptGroupId',
            id: x.receiptGroupId,
            href:
              '/tra/corporations/' +
              '&receiptAccountKind=' +
              x.receiptAccountKind +
              '&corporationId=' +
              x.corporationId +
              '&billingId=' +
              x.billingId +
              '&receiptAmount=' +
              x.receiptAmount +
              '&accountingDate=' +
              x.accountingDate,
          };
        });
        const hrefs = [
          {
            field: 'receiptGroupId',
            hrefs: href,
          },
        ];
        setHrefs(hrefs);
        setOpenSection(false);
      };
      initialize();
    } else if (SCR_TRA_0018 === queryParam.expirationScreenId) {
      // 入金詳細からの遷移
      // セッションから値を復元する
      // テキスト系パラメータの設定
      setValueReceiptGroupId(sessionStorage.getItem(RECEIPT_GROUPID)); // 入金グループID/入金ID
      setValueBankName(sessionStorage.getItem(BANK_NAME)); // 銀行名
      setValueBranchName(sessionStorage.getItem(BRANCH_NAME)); // 支店名
      setValueAccountName(sessionStorage.getItem(ACCOUNT_NAME)); // 口座名義

      sessionStorage.getItem(INPUT_DATE_FROM); // 入力日（From）
      sessionStorage.getItem(INPUT_DATE_TO); // 入力日（To）
      sessionStorage.getItem(ACCOUNTING_DATE_FROM); // 会計処理日（From）
      sessionStorage.getItem(ACCOUNTING_DATE_TO); // 会計処理日（To）

      const initialize = async () => {
        // コード管理マスタ情報取得API
        const codeMasterRequest: ScrCom9999getCodeManagementMasterMultipleRequest =
          {
            codeId: [
              CDE_COM_0114, // 入金口座種別
              CDE_TRA_1004, // 承認ステータス
            ],
          };
        const codeMasterResponse: ScrCom9999getCodeManagementMasterMultipleResponse =
          await ScrCom9999getCodeManagementMasterMultiple(codeMasterRequest);
        const codeMasterList: ResultList[] = [];
        codeMasterResponse.resultList.map((x) => {
          codeMasterList.push({
            codeId: x.codeId,
            codeValueList: x.codeValueList,
          });
        });
        setCodeMaster(codeMasterList);

        /** API-TRA-0016-0001 - 入金一覧取得API */

        const approvalStatusParam: string[] = [
          '' + sessionStorage.getItem(APPROVAL_STATUS),
        ];
        const param: ScrTra0016SearchReceiptsRequest = {
          receiptAccountKind: '' + sessionStorage.getItem(RECEIPT_ACCOUNTKIND),
          receiptGroupId: '' + sessionStorage.getItem(RECEIPT_GROUPID),
          contractId: '' + sessionStorage.getItem(CONTRACT_ID),
          corporationId: '' + sessionStorage.getItem(CORPORATION_ID),
          billingId: '' + sessionStorage.getItem(BILLING_ID),
          bankName: '' + sessionStorage.getItem(BANK_NAME),
          branchName: '' + sessionStorage.getItem(BRANCH_NAME),
          accountName: '' + sessionStorage.getItem(ACCOUNT_NAME),
          cashbackTargetedCorporationId:
            '' + sessionStorage.getItem(CASHBACK_TARGETED_CORPORATION_ID),
          cashbackTargetedBillingId:
            '' + sessionStorage.getItem(CASHBACK_TARGETED_BILLING_ID),
          inputDateFrom: new Date(
            Date.parse('' + sessionStorage.getItem(INPUT_DATE_FROM))
          ),
          inputDateTo: new Date(
            Date.parse('' + sessionStorage.getItem(INPUT_DATE_TO))
          ),
          accountingDateFrom: new Date(
            Date.parse('' + sessionStorage.getItem(ACCOUNTING_DATE_FROM))
          ),
          accountingDateTo: new Date(
            Date.parse('' + sessionStorage.getItem(ACCOUNTING_DATE_TO))
          ),
          approvalStatus: approvalStatusParam,
          changeHistoryNumber: Number(queryParam.expirationScreenId), // 変更履歴番号
        };
        const response = await ScrTra0016SearchReceipts(param);

        // 件数チェック:入金一覧データ取得APIのレスポンス.制限件数 < 取得件数 の場合はアラート表示を行う
        if (Number(response.limitCount) < Number(response.acquisitionCount)) {
          const messege = Format(getMessage('MSG-FR-INF-00004'), [
            response.acquisitionCount.toString(),
            response.responseCount.toString(),
          ]);
          // アラートを表示
          setTitle(messege);
          setHandleDialog(true);
        }

        /**
         * 総合計(値)
         */
        const totalResult = convertToSearchResultTotalModel(response);
        const tableRows: TableRowModel[] = [
          {
            receiptAmount: totalResult.receiptAmountTotal,
            appropriationAmount: totalResult.appropriationAmountTotal,
            untreatedAmount: totalResult.untreatedAmountTotal,
            depositAmount: totalResult.depositAmountTotal,
            notTargetedAmount: totalResult.notTargetedAmountTotal,
            carTaxCashBackAmount: totalResult.carTaxCashBackAmountTotal,
          },
        ];
        setTotalValues(tableRows);
        // ワークリストからの遷移時はボタンを全て無効化する
        setAfbDataImportButtonDisableFlag(true); // FBデータ取込ボタン無効化
        setAreceiptDetailsImportButtonDisableFlag(true); // 入金明細取込
        setAutomaticClearingButtonDisableFlag(true); // 自動消込
        setAcashBackProcessButtonDisableFlag(true); // 返金処理
        setAcsvOutputButtonDisableFlag(true); // CSV出力

        /**
         * 検索結果(一覧行)
         */
        const searchResult = convertToSearchResultRowModel(response, undefined);
        setSearchResult(searchResult);

        codeMaster.forEach((cm) => {
          // 入金口座種別
          if (CDE_COM_0114 === cm.codeId) {
            cm.codeValueList.forEach((cvl) => {
              if (
                sessionStorage.getItem(RECEIPT_ACCOUNTKIND) === cvl.codeValue
              ) {
                selectValues.receiptAccountKindSelectValues.push({
                  value: cvl.codeValue,
                  displayValue: cvl.codeName,
                });
              }
            });
          }
          // 承認ステータス
          if (CDE_TRA_1004 === cm.codeId) {
            cm.codeValueList.forEach((cvl) => {
              if (sessionStorage.getItem(APPROVAL_STATUS) === cvl.codeValue) {
                selectValues.approvalStatusSelectValues.push({
                  value: cvl.codeValue,
                  displayValue: cvl.codeName,
                });
              }
            });
          }
        });

        // API-MEM-9999-0023 : 検索条件絞込API : 契約ID, 法人ID/法人名, 請求先ID
        const codeMasterRequestMem0023: ScrMem9999SearchconditionRefineRequest =
          {
            contractId: '', // 契約ID
            corporationId: '', // 法人ID
            billingId: '', // 請求先ID
          };
        const searchconditionRefine = await ScrMem9999SearchconditionRefine(
          codeMasterRequestMem0023
        );
        // 契約ID, 返金対象法人ID/法人名
        searchconditionRefine.corporationList.map((x) => {
          // 法人名/法人ID
          if (sessionStorage.getItem(CORPORATION_ID) === x.corporationId) {
            selectValues.corporationIdSelectValues.push({
              value: x.corporationId,
              displayValue: x.corporationName,
            });
          }
          // 契約ID
          if (sessionStorage.getItem(CONTRACT_ID) === x.corporationId) {
            selectValues.contractIdSelectValues.push({
              value: x.corporationId,
              displayValue: x.corporationName,
            });
          }
          // 返金対象法人ID/法人名
          if (
            sessionStorage.getItem(CASHBACK_TARGETED_CORPORATION_ID) ===
            x.corporationId
          ) {
            selectValues.cashbackTargetedCorporationIdSelectValues.push({
              value: x.corporationId,
              displayValue: x.corporationName,
            });
          }
        });

        // 請求先ID
        selectValues.billingIdSelectValues.push({
          value: '' + sessionStorage.getItem(BILLING_ID),
          displayValue: '' + sessionStorage.getItem(BILLING_ID),
        });
        // 返金対象請求先ID
        selectValues.cashbackTargetedBillingIdSelectValues.push({
          value: '' + sessionStorage.getItem(CASHBACK_TARGETED_BILLING_ID),
          displayValue:
            '' + sessionStorage.getItem(CASHBACK_TARGETED_BILLING_ID),
        });

        // セレクトボックス設定
        setSelectValues({
          // 入金口座種別
          receiptAccountKindSelectValues:
            selectValues.receiptAccountKindSelectValues,
          // 契約ID
          contractIdSelectValues: selectValues.contractIdSelectValues,
          // 法人ID/法人名
          corporationIdSelectValues: selectValues.corporationIdSelectValues,
          // 請求先ID
          billingIdSelectValues: selectValues.billingIdSelectValues,
          // 返金対象法人ID/法人名
          cashbackTargetedCorporationIdSelectValues:
            selectValues.cashbackTargetedCorporationIdSelectValues,
          // 返金対象請求先ID
          cashbackTargetedBillingIdSelectValues:
            selectValues.cashbackTargetedBillingIdSelectValues,
          // 承認ステータス
          approvalStatusSelectValues: selectValues.approvalStatusSelectValues,
        });

        // 入金口座種別のセレクトボックスを設定する
        searchResult.forEach((x) => {
          searchResultColumns[2].selectValues?.push({
            value: x.receiptAccountKind,
            displayValue: x.receiptAccountKind,
          });
        });

        // 入金グループID/入金IDにリンクを付与する
        const receiptGroupIdHrefs: GridHrefsModel[] = [];
        receiptGroupIdHrefs.push({
          field: 'receiptGroupId',
          hrefs: searchResult.map((x) => {
            return {
              id: x.id,
              href:
                '/tra/corporations/' +
                '&receiptAccountKind=' +
                x.receiptAccountKind +
                '&corporationId=' +
                x.corporationId +
                '&billingId=' +
                x.billingId +
                '&receiptAmount=' +
                x.receiptAmount +
                '&accountingDate=' +
                x.accountingDate,
            };
          }),
        });
        setHrefs(receiptGroupIdHrefs);

        // 法人ID/法人名のセレクトボックスを設定する
        searchResult.map((x) => {
          searchResultColumns[4].selectValues?.push({
            value: x.corporationId,
            displayValue: x.corporationId + x.corporationId,
          });
        });

        // 請求先IDのセレクトボックスを設定する
        searchResult.map((x) => {
          searchResultColumns[5].selectValues?.push({
            value: x.billingId,
            displayValue: x.billingId,
          });
        });

        // 承認ステータスを設定する
        codeMaster.map((x) => {
          if (CDE_TRA_1004 === x.codeId) {
            x.codeValueList.map((y) => {
              searchResultColumns[22].selectValues?.push({
                value: y.codeValue,
                displayValue: y.codeName,
              });
            });
          }
        });

        const href = searchResult.map((x) => {
          return {
            field: 'receiptGroupId',
            id: x.receiptGroupId,
            href:
              '/tra/corporations/' +
              '&receiptAccountKind=' +
              x.receiptAccountKind +
              '&corporationId=' +
              x.corporationId +
              '&billingId=' +
              x.billingId +
              '&receiptAmount=' +
              x.receiptAmount +
              '&accountingDate=' +
              x.accountingDate,
          };
        });
        const hrefs = [
          {
            field: 'receiptGroupId',
            hrefs: href,
          },
        ];
        setHrefs(hrefs);
        setOpenSection(false);
      };
      initialize();
    } else if (SCR_COM_035 === queryParam.expirationScreenId) {
      // FBデータ取込からの遷移
      const initialize = async () => {
        /** API-TRA-0016-0001 - 入金一覧取得API */
        const param: ScrTra0016SearchReceiptsRequest = {
          receiptAccountKind: '',
          receiptGroupId: '' + queryParam.receiptGroupId,
          contractId: '',
          corporationId: '',
          billingId: '',
          bankName: '',
          branchName: '',
          accountName: '',
          cashbackTargetedCorporationId: '',
          cashbackTargetedBillingId: '',
          inputDateFrom: new Date(),
          inputDateTo: new Date(),
          accountingDateFrom: new Date(),
          accountingDateTo: new Date(),
          approvalStatus: [],
          changeHistoryNumber: 0,
        };

        const response = await ScrTra0016SearchReceipts(param);
        /**
         * 総合計(値)
         */
        const totalResult = convertToSearchResultTotalModel(response);
        const tableRows: TableRowModel[] = [
          {
            receiptAmount: totalResult.receiptAmountTotal,
            appropriationAmount: totalResult.appropriationAmountTotal,
            untreatedAmount: totalResult.untreatedAmountTotal,
            depositAmount: totalResult.depositAmountTotal,
            notTargetedAmount: totalResult.notTargetedAmountTotal,
            carTaxCashBackAmount: totalResult.carTaxCashBackAmountTotal,
          },
        ];
        setTotalValues(tableRows);
        // 検索結果が1件以上存在する場合は各種ボタンを有効化する
        if (1 <= Number(totalResult.searchResultCount)) {
          setAfbDataImportButtonDisableFlag(false); // FBデータ取込ボタン無効化
          setAreceiptDetailsImportButtonDisableFlag(false); // 入金明細取込
          setAutomaticClearingButtonDisableFlag(false); // 自動消込
          setAcashBackProcessButtonDisableFlag(false); // 返金処理
          setAcsvOutputButtonDisableFlag(false); // CSV出力
        }

        /**
         * 検索結果(一覧行)
         */
        const searchResult = convertToSearchResultRowModel(response, undefined);
        setSearchResult(searchResult);

        const href = searchResult.map((x) => {
          return {
            field: 'receiptGroupId',
            id: x.receiptGroupId,
            href:
              '/tra/corporations/' +
              '&receiptAccountKind=' +
              x.receiptAccountKind +
              '&corporationId=' +
              x.corporationId +
              '&billingId=' +
              x.billingId +
              '&receiptAmount=' +
              x.receiptAmount +
              '&accountingDate=' +
              x.accountingDate,
          };
        });
        const hrefs = [
          {
            field: 'receiptGroupId',
            hrefs: href,
          },
        ];
        setHrefs(hrefs);
        setOpenSection(false);
      };
      initialize();
    } else {
      // 上記以外の場合
      const initialize = async () => {
        // コード管理マスタ情報取得API
        const codeMasterRequest: ScrCom9999getCodeManagementMasterMultipleRequest =
          {
            codeId: [
              CDE_COM_0114, // 入金口座種別
              CDE_TRA_1004, // 承認ステータス
            ],
          };
        const codeMasterResponse: ScrCom9999getCodeManagementMasterMultipleResponse =
          await ScrCom9999getCodeManagementMasterMultiple(codeMasterRequest);
        const codeMasterList: ResultList[] = [];
        codeMasterResponse.resultList.map((x) => {
          codeMasterList.push({
            codeId: x.codeId,
            codeValueList: x.codeValueList,
          });
        });
        setCodeMaster(codeMasterList);

        /** SELECT BOX 値取得 */
        // リスト取得(初期化)
        const newSelectValues = selectValuesInitialValues;
        // 初期化処理が上手くいかないのでここで再設定する
        newSelectValues.receiptAccountKindSelectValues = [];
        newSelectValues.approvalStatusSelectValues = [];
        newSelectValues.corporationIdSelectValues = [];
        newSelectValues.contractIdSelectValues = [];
        newSelectValues.billingIdSelectValues = [];
        newSelectValues.cashbackTargetedCorporationIdSelectValues = [];
        newSelectValues.cashbackTargetedBillingIdSelectValues = [];

        // コード管理マスタリストボックス情報取得API
        // CDE-COM-0114 : 入金口座種別
        codeMaster.forEach((x) => {
          if (CDE_COM_0114 === x.codeId) {
            x.codeValueList.forEach((y) => {
              newSelectValues.receiptAccountKindSelectValues.push({
                value: y.codeValue,
                displayValue: y.codeName,
              });
            });
          }
        });

        // CDE-COM-1004 : 承認ステータス
        codeMaster.forEach((x) => {
          if (CDE_TRA_1004 === x.codeId) {
            x.codeValueList.forEach((y) => {
              newSelectValues.approvalStatusSelectValues.push({
                value: y.codeValue,
                displayValue: y.codeName,
              });
            });
          }
        });

        // API-MEM-9999-0023 : 検索条件絞込API : 契約ID, 法人ID/法人名, 請求先ID
        const codeMasterRequestMem0023: ScrMem9999SearchconditionRefineRequest =
          {
            contractId: '', // 契約ID
            corporationId: '', // 法人ID
            billingId: '', // 請求先ID
          };
        const searchconditionRefine = await ScrMem9999SearchconditionRefine(
          codeMasterRequestMem0023
        );
        // 法人ID/法人名
        searchconditionRefine.corporationList.map((x) => {
          newSelectValues.corporationIdSelectValues.push({
            value: x.corporationId,
            displayValue: x.corporationName,
          });
        });

        // 契約ID, 返金対象法人ID/法人名
        searchconditionRefine.corporationList.map((x) => {
          newSelectValues.contractIdSelectValues.push({
            value: x.corporationId,
            displayValue: x.corporationName,
          });
          newSelectValues.cashbackTargetedCorporationIdSelectValues.push({
            value: x.corporationId,
            displayValue: x.corporationName,
          });
        });

        // 請求先ID, 返金対象請求先ID
        searchconditionRefine.billingId.map((x) => {
          newSelectValues.billingIdSelectValues.push({
            value: x,
            displayValue: x,
          });
          newSelectValues.cashbackTargetedBillingIdSelectValues.push({
            value: x,
            displayValue: x,
          });
        });

        // セレクトボックス設定
        setSelectValues({
          // 入金口座種別
          receiptAccountKindSelectValues:
            newSelectValues.receiptAccountKindSelectValues,
          // 契約ID
          contractIdSelectValues: newSelectValues.contractIdSelectValues,
          // 法人ID/法人名
          corporationIdSelectValues: newSelectValues.corporationIdSelectValues,
          // 請求先ID
          billingIdSelectValues: newSelectValues.billingIdSelectValues,
          // 返金対象法人ID/法人名
          cashbackTargetedCorporationIdSelectValues:
            newSelectValues.cashbackTargetedCorporationIdSelectValues,
          // 返金対象請求先ID
          cashbackTargetedBillingIdSelectValues:
            newSelectValues.cashbackTargetedBillingIdSelectValues,
          // 承認ステータス
          approvalStatusSelectValues:
            newSelectValues.approvalStatusSelectValues,
        });
      };
      initialize();
    }
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
   * 検索ボタンクリック時のイベントハンドラ
   */
  const handleSearchClick = async () => {
    // 検索結果一覧から未提出存在チェックを行う
    let noSubmissionFlag = false;
    searchRowsValues.forEach((row) => {
      // 承認ステータスが未提出の場合
      if (row.approvalStatus.includes('7')) {
        noSubmissionFlag = true;
      }
    });
    // 未提出のデータが存在する場合
    if (noSubmissionFlag) {
      const ret = window.confirm(getMessage('MSG-FR-WRN-00006'));
      if (!ret) {
        // キャンセル押下時は処理終了
        return;
      }
    }

    /** API-TRA-0016-0001 - 入金一覧取得API */
    const request = convertFromSearchConditionModel(getValues());
    const response = await ScrTra0016SearchReceipts(request);

    // セッションストレージに検索パラメータを保存する
    sessionStorage.setItem(RECEIPT_ACCOUNTKIND, getValues(RECEIPT_ACCOUNTKIND)); // 入金口座種別
    sessionStorage.setItem(RECEIPT_GROUPID, getValues(RECEIPT_GROUPID)); // 入金グループID/入金ID
    sessionStorage.setItem(CONTRACT_ID, getValues(CONTRACT_ID)); // 契約ID
    sessionStorage.setItem(CORPORATION_ID, getValues(CORPORATION_ID)); // 法人ID/法人名
    sessionStorage.setItem(BILLING_ID, getValues(BILLING_ID)); // 請求先ID
    sessionStorage.setItem(BANK_NAME, getValues(BANK_NAME)); // 銀行名
    sessionStorage.setItem(BRANCH_NAME, getValues(BRANCH_NAME)); // 支店名
    sessionStorage.setItem(ACCOUNT_NAME, getValues(ACCOUNT_NAME)); // 口座名義
    sessionStorage.setItem(
      CASHBACK_TARGETED_CORPORATION_ID,
      getValues(CASHBACK_TARGETED_CORPORATION_ID)
    ); // 返金対象法人ID/法人名
    sessionStorage.setItem(
      CASHBACK_TARGETED_BILLING_ID,
      getValues(CASHBACK_TARGETED_BILLING_ID)
    ); // 返金対象請求先ID
    sessionStorage.setItem(INPUT_DATE_FROM, getValues(INPUT_DATE_FROM)); // 入力日（From）
    sessionStorage.setItem(INPUT_DATE_TO, getValues(INPUT_DATE_TO)); // 入力日（To）
    sessionStorage.setItem(
      ACCOUNTING_DATE_FROM,
      getValues(ACCOUNTING_DATE_FROM)
    ); // 会計処理日（From）
    sessionStorage.setItem(ACCOUNTING_DATE_TO, getValues(ACCOUNTING_DATE_TO)); // 会計処理日（To）
    let approvalStatus = '0';
    if (1 === getValues(APPROVAL_STATUS).length) {
      approvalStatus = getValues(APPROVAL_STATUS)[0];
    }
    sessionStorage.setItem(APPROVAL_STATUS, approvalStatus); // 承認ステータス

    /**
     * 総合計(値)
     */
    const totalResult = convertToSearchResultTotalModel(response);
    const tableRows: TableRowModel[] = [
      {
        receiptAmount: totalResult.receiptAmountTotal, // 入金額
        appropriationAmount: totalResult.appropriationAmountTotal, // 充当金額
        untreatedAmount: totalResult.untreatedAmountTotal, // 未処理金額
        depositAmount: totalResult.depositAmountTotal, // 預かり金額
        notTargetedAmount: totalResult.notTargetedAmountTotal, // 対象外金額
        carTaxCashBackAmount: totalResult.carTaxCashBackAmountTotal, // 自税返金額面
      },
    ];

    setTotalValues(tableRows);
    // 検索結果が1件以上存在する場合は各種ボタンを有効化する
    if (1 <= Number(totalResult.searchResultCount)) {
      setAfbDataImportButtonDisableFlag(false); // FBデータ取込
      setAreceiptDetailsImportButtonDisableFlag(false); // 入金明細取込
      setAutomaticClearingButtonDisableFlag(false); // 自動消込
      setAcashBackProcessButtonDisableFlag(false); // 返金処理
      setAcsvOutputButtonDisableFlag(false); // CSV出力
    }

    /**
     * 検索結果(一覧行)
     */

    // API-MEM-9999-0023 : 検索条件絞込API : 契約ID, 法人ID/法人名, 請求先ID
    const codeMasterRequestMem0023: ScrMem9999SearchconditionRefineRequest = {
      contractId: '', // 契約ID
      corporationId: '', // 法人ID
      billingId: '', // 請求先ID
    };
    const searchconditionRefine = await ScrMem9999SearchconditionRefine(
      codeMasterRequestMem0023
    );

    const searchResult = convertToSearchResultRowModel(
      response,
      searchconditionRefine
    );
    setSearchResult(searchResult);

    // 入金口座種別のセレクトボックスを設定する
    searchResult.forEach((x) => {
      searchResultColumns[2].selectValues?.push({
        value: x.receiptAccountKind,
        displayValue: x.receiptAccountKind,
      });
    });

    // 入金グループID/入金IDにリンクを付与する
    const receiptGroupIdHrefs: GridHrefsModel[] = [];
    receiptGroupIdHrefs.push({
      field: 'receiptGroupId',
      hrefs: searchResult.map((x) => {
        return {
          id: x.id,
          href:
            '/tra/corporations/' +
            '&receiptAccountKind=' +
            x.receiptAccountKind +
            '&corporationId=' +
            x.corporationId +
            '&billingId=' +
            x.billingId +
            '&receiptAmount=' +
            x.receiptAmount +
            '&accountingDate=' +
            x.accountingDate,
        };
      }),
    });
    setHrefs(receiptGroupIdHrefs);

    // 法人ID/法人名のセレクトボックスを設定する
    searchResult.map((x) => {
      searchResultColumns[4].selectValues?.push({
        value: x.corporationId,
        displayValue: x.corporationId + x.corporationId,
      });
    });

    // 請求先IDのセレクトボックスを設定する
    searchResult.map((x) => {
      searchResultColumns[5].selectValues?.push({
        value: x.billingId,
        displayValue: x.billingId,
      });
    });

    // 承認ステータスを設定する
    codeMaster.map((x) => {
      if (CDE_TRA_1004 === x.codeId) {
        x.codeValueList.map((y) => {
          searchResultColumns[22].selectValues?.push({
            value: y.codeValue,
            displayValue: y.codeName,
          });
        });
      }
    });

    // 件数チェック:入金一覧データ取得APIのレスポンス.制限件数 < 取得件数 の場合はアラート表示を行う
    if (Number(response.limitCount) < Number(response.acquisitionCount)) {
      const messege = Format(getMessage('MSG-FR-INF-00004'), [
        response.acquisitionCount.toString(),
        response.responseCount.toString(),
      ]);
      // アラートを表示
      setTitle(messege);
      setHandleDialog(true);
    }

    // 編集可否フラグ判定(承認ステータス1:承認依頼中の場合true)
    response.searchResult.forEach((row) => {
      if (row.approvalStatus.includes('1')) {
        setRowdDisableFlag(true);
      }
      row.approvalStatus;
    });
  };

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = async (url: string) => {
    let errFlag = false;
    // URLから分割
    const param = url.split('&');
    const href = param[0]; // URL
    const paramReceiptAccountKind = param[1].split('='); // 入金口座種別
    const receiptAccountKind = paramReceiptAccountKind[1];
    const paramCorporationId = param[2].split('='); // 法人ID/法人名
    const corporationIdName = paramCorporationId[1].replaceAll('%', ' ');
    const corporationId = corporationIdName;
    const paramBillingId = param[3].split('='); // 請求先ID
    const billingId = paramBillingId[1];
    const paramReceiptAmount = param[4].split('='); // 入金額
    const receiptAmount = paramReceiptAmount[1];
    const paramAccountingDate = param[5].split('='); // 会計処理日
    const accountingDate = paramAccountingDate[1];
    // 入力チェック 入金口座種別, 法人ID/法人名, 請求先ID, 入金額,会計処理日 のいずれかがブランクの場合はエラー
    if (
      1 > receiptAccountKind.length ||
      '' === receiptAccountKind ||
      1 > corporationId.length ||
      '' === corporationId ||
      1 > billingId.length ||
      '' === billingId ||
      1 > receiptAmount.length ||
      '' === receiptAmount ||
      1 > accountingDate.length ||
      '' === accountingDate
    ) {
      // チェックエラーの場合、エラーメッセージを画面表示する
      setTitle(getMessage('MSG-FR-ERR-00055'));
      setHandleDialog(true);
      errFlag = true;
    }
    if (errFlag) {
      return;
    }
    // API-TRA-0016-0003 - 入金情報詳細編集チェックAPI
    const request: ScrTra0016CheckReceiptDetailRequest = {
      /** 請求先ID */
      billingId: '' + paramBillingId,
      /** 処理区分(2固定値) */
      procKind: '2',
    };
    const response = await ScrTra0016CheckReceiptDetail(request);
    const checkReceiptDetaiResult = convertToCheckReceiptDetailModel(response);
    // エラーまたはワーニングが存在する場合は警告を表示する
    if (
      1 <= checkReceiptDetaiResult.errorList.length ||
      1 <= checkReceiptDetaiResult.warningList.length
    ) {
      let warnMessage = '';
      checkReceiptDetaiResult.warningList.forEach((warn) => {
        warnMessage = warn.warningCode + warn.warningMessage;
        return;
      });
      const ret = window.confirm(warnMessage);
      if (!ret) {
        errFlag = true;
      }
    }
    if (errFlag) {
      return;
    }
    // API-TRA-0016-0006 - 入金詳細初期化API
    const receiptGroupId = receiptAccountKind.split('-');
    const receiptId = receiptGroupId[1]; // 入金番号
    const receiptDetailResetRequest: ScrTra0016ReceiptDetailResetRequest = {
      receiptGroupId: receiptAccountKind,
      receiptId: receiptId,
    };
    ScrTra0016ReceiptDetailReset(receiptDetailResetRequest);

    navigate(href);
  };

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    // 検索結果をベースに空行を追加する
    const addRows = [
      {
        id: searchRowsValues.length.toString(),
        delete: '',
        receiptAccountKind: '',
        receiptGroupId: 'R0000001', // TODO 採番ロジックについて記載が無いので暫定対応
        corporationId: '',
        billingId: '',
        receiptAmount: Number(''),
        appropriationAmount: Number(''),
        untreatedAmount: Number(''),
        depositAmount: Number(''),
        notTargetedAmount: Number(''),
        carTaxCashBackAmount: Number(''),
        bankName: '',
        branchName: '',
        receiptSourceAccountName: '',
        cashBackTargetedCorporationId: '',
        cashBackTargetedCorporationName: '',
        cashBackTargetedBillingId: '',
        receiptStaffEmployeeId: '',
        receiptInputName: '',
        receiptInputDate: '',
        accountingDate: '',
        approvalStatus: [],
        addFlag: true,
      },
      ...searchRowsValues,
    ];
    setSearchResult(addRows);
    // 入金グループID/入金IDにリンクを付与する
    const receiptGroupIdHrefs: GridHrefsModel[] = [];
    receiptGroupIdHrefs.push({
      field: 'receiptGroupId',
      hrefs: addRows.map((x) => {
        return {
          id: x.id,
          href:
            '/tra/corporations/' +
            '&receiptAccountKind=' +
            x.receiptAccountKind +
            '&corporationId=' +
            x.corporationId +
            '&billingId=' +
            x.billingId +
            '&receiptAmount=' +
            x.receiptAmount +
            '&accountingDate=' +
            x.accountingDate,
        };
      }),
    });
    setHrefs(receiptGroupIdHrefs);
    // 削除ボタンを設定する
    searchRowsValues.forEach((row) => {
      // 新規追加行(入金グループIDの先頭がR)の場合
      if ('R' === row.receiptGroupId.slice(0, 1).toString()) {
        searchResultColumns[0].renderCell = (
          params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
        ) => {
          return (
            <Button onClick={() => handleDeleteClick(params, searchRowsValues)}>
              削除
            </Button>
          );
        };
      } else {
        searchResultColumns[0].renderCell = (
          params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
        ) => {
          return '';
        };
      }
    });
  };

  /**
   * FBデータ取込アイコンクリック時のイベントハンドラ
   */
  const handleIconFBDataImportClick = () => {
    // 入力チェック初期化
    setFbDataImportChkErrFlg(false);

    // 選択行を取得する(複数選択可)
    const targetRowId = rowSelectionModel;
    if (1 > targetRowId.length) {
      return; // 対象行が存在しない場合は何も行わない
    }

    // 選択対象行毎に繰り返し
    let errCnt = 0;
    targetRowId.forEach((rowId) => {
      searchRowsValues.forEach((targetRow) => {
        // 対象行判定
        if (rowId === targetRow.id) {
          // 入金口座種別, 法人ID/法人名, 請求先ID, 入金額, 会計処理日 のいずれかが未入力の場合はエラーとする
          if (
            1 > targetRow.receiptAccountKind.length ||
            '' === targetRow.receiptAccountKind ||
            1 > targetRow.corporationId.length ||
            '' === targetRow.corporationId ||
            1 > targetRow.billingId.length ||
            '' === targetRow.billingId ||
            1 > targetRow.receiptAmount.toString().length ||
            '' === targetRow.receiptAmount.toString() ||
            0 === targetRow.receiptAmount ||
            1 > targetRow.accountingDate.length ||
            '' === targetRow.accountingDate
          ) {
            // チェックエラーの場合、エラーメッセージを画面表示する
            setTitle(getMessage('MSG-FR-ERR-00149'));
            setHandleDialog(true);
            setFbDataImportChkErrFlg(true);
          }
          // 新規明細保存有無チェックを行う
          // 対象行が未設定の場合は新規追加行として扱う
          if ('' === targetRow.receiptGroupId) {
            // チェックエラーの場合、エラーメッセージを画面表示する
            setTitle(getMessage('MSG-FR-ERR-00150'));
            setHandleDialog(true);
            setFbDataImportChkErrFlg(true);
          } else {
            // 未提出存在チェック（FB取込）を行う
            // 新規追加行ではない（入金グループIDが設定済の場合）、かつ「承認ステータス」="未提出"の場合、条件に該当する行数をカウントし処理を継続する
            if (targetRow.approvalStatus.includes('7')) {
              errCnt++;
            }
          }
        }
      });
    });
    // 未提出に該当する行数が１件以上の場合、ワーニングダイアログを表示して以下のワーニングメッセージを表示する
    if (1 <= errCnt) {
      // チェックエラーの場合、エラーメッセージを画面表示する
      const ret = window.confirm(getMessage('MSG-FR-WRN-00015'));
      if (!ret) {
        setFbDataImportChkErrFlg(true);
        return; // 処理終了
      }
    }
    if (fbDataImportChkErrFlg) {
      return;
    }
    // CSV読み込みポップアップ画面を表示する
    setScrCom0035PopupIsOpen(true);
  };

  /**
   * 入金明細取込アイコンクリック時のイベントハンドラ
   */
  // パラメータ用 請求先ID
  const handleIconReceiptDetailsImportClick = async () => {
    let errFlag = false;
    let billingId = '';
    // 対象件数チェックを行う 複数件の場合はNGとする
    if (1 !== rowSelectionModel.length) {
      setTitle(getMessage('MSG-FR-ERR-00057'));
      setHandleDialog(true);
      return;
    }
    rowSelectionModel.forEach((rowId) => {
      searchRowsValues.map((targetRow) => {
        // 選択行ID取得
        if (rowId === targetRow.id) {
          // 入金口座種別, 法人ID/法人名, 請求先ID, 入金額, 会計処理日 のいずれかが未入力の場合はエラーとする
          if (
            1 > targetRow.receiptAccountKind.length ||
            '' === targetRow.receiptAccountKind ||
            1 > targetRow.corporationId.length ||
            '' === targetRow.corporationId ||
            1 > targetRow.billingId.length ||
            '' === targetRow.billingId ||
            1 > targetRow.receiptAmount.toString().length ||
            '' === targetRow.receiptAmount.toString() ||
            1 > targetRow.accountingDate.length ||
            '' === targetRow.accountingDate
          ) {
            setTitle(getMessage('MSG-FR-ERR-00149'));
            setHandleDialog(true);
            errFlag = true;
            return;
          }
          billingId = targetRow.billingId;
        }
      });
    });
    // API-TRA-0016-0003 / 入金情報詳細編集チェックAPI を実行する
    const request: ScrTra0016CheckReceiptDetailRequest = {
      /** 請求先ID */
      billingId: billingId,
      /** 処理区分(1固定値) */
      procKind: '1',
    };
    const response = await ScrTra0016CheckReceiptDetail(request);
    const checkReceiptDetaiResult = convertToCheckReceiptDetailModel(response);
    // エラーまたはワーニングが存在する場合は警告を表示する
    if (
      1 <= checkReceiptDetaiResult.errorList.length ||
      1 <= checkReceiptDetaiResult.warningList.length
    ) {
      let warnMessage = '';
      checkReceiptDetaiResult.warningList.forEach((warn) => {
        warnMessage = warn.warningCode + warn.warningMessage;
        return;
      });
      const ret = window.confirm(warnMessage);
      if (!ret) {
        errFlag = true;
      }
    }
    if (!errFlag) {
      // CSV読み込みポップアップ画面を表示する
      setScrCom0035PopupIsOpen(true);
    }
  };

  /**
   * 自動消込アイコンクリック時のイベントハンドラ
   */
  const handleIconAutomaticClearingClick = async () => {
    let errFlag = false;
    const autoClearingExecuteRequestResultList: AutoClearingExecuteRequestResult[] =
      [];
    rowSelectionModel.forEach((row) => {
      searchRowsValues.map((targetRow) => {
        if (row === targetRow.id) {
          // 入金口座種別, 法人ID/法人名, 請求先ID, 入金額, 会計処理日 のいずれかが未入力の場合はエラーとする
          if (
            1 > targetRow.receiptAccountKind.length ||
            '' === targetRow.receiptAccountKind ||
            1 > targetRow.corporationId.length ||
            '' === targetRow.corporationId ||
            1 > targetRow.billingId.length ||
            '' === targetRow.billingId ||
            1 > targetRow.receiptAmount.toString().length ||
            '' === targetRow.receiptAmount.toString() ||
            1 > targetRow.accountingDate.length ||
            '' === targetRow.accountingDate
          ) {
            setTitle(getMessage('MSG-FR-ERR-00149'));
            setHandleDialog(true);
            errFlag = true;
            return;
          } else {
            // 通常処理
            const receiptGroupId = targetRow.receiptGroupId.split('-');
            // API-TRA-0016-0004 / 自動消込実行API を実行する
            const autoClearingExecuteRequestResult: AutoClearingExecuteRequestResult =
              {
                receiptGroupId: receiptGroupId[0], // 入金グループID
                receiptId: receiptGroupId[1], // 入金番号
                corporationId: targetRow.corporationId, // 法人ID
                billingId: targetRow.billingId, // 請求先ID
                receiptAmount: targetRow.receiptAmount, // 入金額
              };
            autoClearingExecuteRequestResultList.push(
              autoClearingExecuteRequestResult
            );
          }
        }
      });
    });
    if (errFlag) {
      return;
    }
    const request: ScrTra0016AutoClearingExecuteRequest = {
      AutoClearingExecuteRequestResult: autoClearingExecuteRequestResultList,
    };
    autoClearingExecuteRequestResultList;
    const response = await ScrTra0016AutoClearingExecute(request);
    const autoClearingExecuteResult =
      convertFromAutoClearingExecuteModel(response);

    // 入金グループIDと入金番号に一致する行を抽出する "入金グループID-入金番号"
    const newSearchRow: SearchResultRowModel[] = [];
    autoClearingExecuteResult.map((x) => {
      const jsonReceiptGroupId = x.receiptGroupId + '-' + x.receiptId;
      searchRowsValues.map((val) => {
        if (jsonReceiptGroupId === val.receiptGroupId) {
          // 抽出された行を対象とし、 充当金額には入金額、未処理金額には0を設定する
          const changeSearchRow: SearchResultRowModel = {
            id: val.id,
            receiptAccountKind: val.receiptAccountKind,
            receiptGroupId: val.receiptGroupId,
            corporationId: val.corporationId,
            billingId: val.billingId,
            receiptAmount: val.receiptAmount,
            appropriationAmount: val.receiptAmount, // 入金額を設定する
            untreatedAmount: 0, // 0 固定で設定する
            depositAmount: val.depositAmount,
            notTargetedAmount: val.notTargetedAmount,
            carTaxCashBackAmount: val.carTaxCashBackAmount,
            bankName: val.bankName,
            branchName: val.branchName,
            receiptSourceAccountName: val.receiptSourceAccountName,
            cashBackTargetedCorporationId: val.cashBackTargetedCorporationId,
            cashBackTargetedCorporationName:
              val.cashBackTargetedCorporationName,
            cashBackTargetedBillingId: val.cashBackTargetedBillingId,
            receiptStaffEmployeeId: val.receiptStaffEmployeeId,
            receiptInputName: val.receiptInputName,
            receiptInputDate: val.receiptInputDate,
            accountingDate: val.accountingDate,
            approvalStatus: val.approvalStatus,
            addFlag: val.addFlag,
          };
          newSearchRow.push(changeSearchRow);
          // 行を非活性にする
          setRowdDisableFlag(true);
        } else {
          // 対象外の行を詰める
          newSearchRow.push(val);
        }
      });
      // 編集した,編集しない行を一括で再設定する
      setSearchResult(newSearchRow);
    });

    // 総合計値テーブルの値を更新する
    let receiptAmountTotal = 0;
    let appropriationAmountTotal = 0;
    let untreatedAmountTotal = 0;
    let depositAmountTotal = 0;
    let notTargetedAmountTotal = 0;
    let carTaxCashBackAmountTotal = 0;
    searchRowsValues.forEach((row) => {
      receiptAmountTotal =
        Number(receiptAmountTotal) + Number(row.receiptAmount);
      appropriationAmountTotal =
        Number(appropriationAmountTotal) + Number(row.appropriationAmount);
      untreatedAmountTotal =
        Number(untreatedAmountTotal) + Number(row.untreatedAmount);
      depositAmountTotal =
        Number(depositAmountTotal) + Number(row.depositAmount);
      notTargetedAmountTotal =
        Number(notTargetedAmountTotal) + Number(row.notTargetedAmount);
      carTaxCashBackAmountTotal =
        Number(carTaxCashBackAmountTotal) + Number(row.carTaxCashBackAmount);
    });
    const tableRows: TableRowModel[] = [
      {
        receiptAmount: receiptAmountTotal.toString(), // 入金額
        appropriationAmount: appropriationAmountTotal.toString(), // 充当金額
        untreatedAmount: untreatedAmountTotal.toString(), // 未処理金額
        depositAmount: depositAmountTotal.toString(), // 預かり金額
        notTargetedAmount: notTargetedAmountTotal.toString(), // 対象外金額
        carTaxCashBackAmount: carTaxCashBackAmountTotal.toString(), // 自税返金額面
      },
    ];
    setTotalValues(tableRows);
  };

  /**
   * 返金処理アイコンクリック時のイベントハンドラ
   */
  const handleIconCashBackProcessClick = async () => {
    let errFlag = false;
    let corporationId = ''; // 法人ID
    let billingId = ''; // 請求先ID
    let receiptGroupId = ''; // 入金グループID
    let receiptId = ''; // 入金番号
    // 選択対象が1件以外の場合はメッセージ表示して処理終了
    if (1 !== rowSelectionModel.length) {
      setTitle(getMessage(''));
      setHandleDialog(true);
      return;
    }
    rowSelectionModel.map((rowId) => {
      searchRowsValues.map((val) => {
        // 選択行ID取得(追加行の場合)
        if (rowId === val.id && val.addFlag) {
          // 入金口座種別, 法人ID/法人名, 請求先ID, 入金額, 会計処理日 のいずれかが未入力の場合はエラーとする
          if (
            1 > val.receiptAccountKind.length ||
            '' === val.receiptAccountKind ||
            1 > val.corporationId.length ||
            '' === val.corporationId ||
            1 > val.billingId.length ||
            '' === val.billingId ||
            1 > val.receiptAmount.toString().length ||
            '' === val.receiptAmount.toString() ||
            1 > val.accountingDate.length ||
            '' === val.accountingDate
          ) {
            setTitle(getMessage('MSG-FR-ERR-00149'));
            setHandleDialog(true);
            errFlag = true;
            return;
          }
          corporationId = val.corporationId;
          billingId = val.billingId;
          const receipt = val.receiptGroupId.split('-');
          receiptGroupId = receipt[0]; // 入金グループID
          receiptId = receipt[1]; // 入金番号
        }
      });
    });
    if (errFlag) {
      return;
    }
    // API-TRA-0016-0005 / 返金対象チェックAPI を実行する
    const request: ScrTra0016CheckCashbackTargetRequest = {
      /** 法人ID */
      corporationId: corporationId,
      /** 請求先ID */
      billingId: billingId,
    };
    const response = await ScrTra0016CheckCashbackTarget(request);
    const checkCashbackTarget = convertToCheckCashbackTargetModel(response);
    if (
      1 <= checkCashbackTarget.errorList.length ||
      1 <= checkCashbackTarget.warningList.length
    ) {
      setIsOpen38Popup(true);
      setScrCom0038PopupValues({
        warningList: checkCashbackTarget.warningList,
        errorList: checkCashbackTarget.errorList,
        expirationScreenId: SCR_TRA_0016,
      });
    } else {
      // エラーが無い場合は返金一覧画面に遷移する
      // SCR-TRA-0019
      query.set('receiptGroupId', 'receiptGroupId'); // 入金グループID
      query.set('receiptId', 'receiptId'); // 入金番号
      navigate('/tra/cashbacks');
    }
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconCsvOutputClick = () => {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const fileName =
      SCR_NAME + '_' + user.employeeId + '_' + day + hours + '.csv';
    exportCsv(fileName, apiRef);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirmClick = async () => {
    let billingId = '';
    let accountingDate = ''; // 会計処理日
    const receiptGroupIds: string[] = [];
    searchRowsValues.map((val) => {
      rowSelectionModel.map((x) => {
        // 選択行ID取得
        if (x === val.id) {
          // 入金口座種別, 法人ID/法人名, 請求先ID, 入金額, 会計処理日 のいずれかが未入力の場合はエラーとする
          if (
            1 > val.receiptAccountKind.length ||
            '' === val.receiptAccountKind ||
            1 > val.corporationId.length ||
            '' == val.corporationId ||
            1 > val.billingId.length ||
            '' === val.billingId ||
            1 > val.receiptAmount.toString().length ||
            '' === val.receiptAmount.toString() ||
            1 > val.accountingDate.length ||
            '' === val.accountingDate
          ) {
            setTitle(getMessage('MSG-FR-ERR-00149'));
            setHandleDialog(true);
            return;
          }
          billingId = val.billingId;
          accountingDate = val.accountingDate;
          receiptGroupIds.push(val.receiptGroupId);
        }
      });
    });
    setReceiptGroupIds(receiptGroupIds);
    // 未処理金額チェックを行う
    searchRowsValues.map((val) => {
      rowSelectionModel.map((x) => {
        // 選択行ID取得
        if (x === val.id) {
          // 未処理金額が 0 の場合はエラーメッセージを表示する
          if (0 === val.untreatedAmount) {
            setTitle(getMessage('MSG-FR-ERR-00059'));
            setHandleDialog(true);
            return;
          }
        }
      });
    });
    /** API-TRA-0016-0007 : 入金伝票入力チェックAPI */
    const request: ScrTra0016CheckReceiptInputRequest = {
      accountingDate: accountingDate, // 会計処理日
    };
    const response = await ScrTra0016CheckReceiptInput(request);
    const checkReceiptInput =
      convertToScrTra0016CheckReceiptInputModel(response);
    if (
      1 <= checkReceiptInput.errorList.length ||
      1 <= checkReceiptInput.warningList.length
    ) {
      setTitle(getMessage('MSG-FR-WRN-00008'));
      setHandleDialog(true);
    }
    // 登録内容確認ポップアップを表示する
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: checkReceiptInput.errorList,
      warningList: checkReceiptInput.warningList,
      registrationChangeList:
        convertToRegistrationChangeList(searchResultColumns),
      changeExpectDate: queryParam.changeHistoryNumber,
    });
  };

  /**
   * 登録・変更内容データへの変換
   */
  const convertToRegistrationChangeList = (
    dirtyFields: object
  ): registrationChangeList[] => {
    // 変更を検知するフィールドのキー名リスト
    const fields = Object.keys(dirtyFields);
    // 返却する変更リスト
    const registrationChangeList: registrationChangeList[] = [];
    // 一時カラムリスト
    const tempColumnList: { columnName: string }[] = [];

    // 変更したキー名をカラムリストに設定
    fields.forEach((f) => {
      tempColumnList.push({
        columnName: COLUMN_NAME,
      });
    });

    // 変更リストとして値を設定して返却
    registrationChangeList.push({
      screenId: SCR_TRA_0016,
      screenName: SCR_NAME,
      tabId: 0,
      tabName: '',
      sectionList: [
        {
          sectionName: SECTION_NAME,
          columnList: tempColumnList,
        },
      ],
    });
    return registrationChangeList;
  };

  /**
   * CSVポップアップキャンセルボタン押下時
   */
  const handlePopup35Cancel = () => {
    setIsOpen35Popup(false);
  };

  /**
   * エラー確認ポップアップキャンセルボタン押下時
   */
  const handlePopup38Cancel = () => {
    setIsOpen38Popup(false);
  };

  /** 削除ボタン押下時の処理 */
  const handleDeleteClick = (
    params: any,
    rowValues: SearchResultRowModel[]
  ) => {
    const selectId = params.id;
    const newRows: SearchResultRowModel[] = [];
    rowValues.forEach((row) => {
      // 削除対象行以外を再構成する
      if (selectId != row.id) {
        newRows.push(row);
      }
    });
    setSearchResult(newRows);
    // 総合計テーブルを再計算する
    let receiptAmountTotal = 0; // 入金額
    let appropriationAmountTotal = 0; // 充当金額
    let untreatedAmountTotal = 0; // 未処理金額
    let depositAmountTotal = 0; // 預かり金額
    let notTargetedAmountTotal = 0; // 対象外金額
    let carTaxCashBackAmountTotal = 0; // 自税返金額面
    newRows.forEach((row) => {
      receiptAmountTotal =
        Number(receiptAmountTotal) + Number(row.receiptAmount); // 入金額
      appropriationAmountTotal =
        Number(appropriationAmountTotal) + Number(row.appropriationAmount); // 充当金額
      untreatedAmountTotal =
        Number(untreatedAmountTotal) + Number(row.untreatedAmount); // 未処理金額
      depositAmountTotal =
        Number(depositAmountTotal) + Number(row.depositAmount); // 預かり金額
      notTargetedAmountTotal =
        Number(notTargetedAmountTotal) + Number(row.notTargetedAmount); // 対象外金額
      carTaxCashBackAmountTotal =
        Number(carTaxCashBackAmountTotal) + Number(row.carTaxCashBackAmount); // 自税返金額
    });
    const tableRows: TableRowModel[] = [
      {
        receiptAmount: receiptAmountTotal,
        appropriationAmount: appropriationAmountTotal,
        untreatedAmount: untreatedAmountTotal,
        depositAmount: depositAmountTotal,
        notTargetedAmount: notTargetedAmountTotal,
        carTaxCashBackAmount: carTaxCashBackAmountTotal,
      },
    ];
    setTotalValues(tableRows);
  };

  /**
   * フォーカスアウト時の処理
   */
  const reCalc = async (params: any, resultValues: SearchResultRowModel[]) => {
    // 総合計テーブルを再計算する
    let receiptAmountTotal = 0; // 入金額
    let appropriationAmountTotal = 0; // 充当金額
    let untreatedAmountTotal = 0; // 未処理金額
    let depositAmountTotal = 0; // 預かり金額
    let notTargetedAmountTotal = 0; // 対象外金額
    let carTaxCashBackAmountTotal = 0; // 自税返金額面
    resultValues.forEach((row) => {
      receiptAmountTotal =
        Number(receiptAmountTotal) + Number(row.receiptAmount); // 入金額
      appropriationAmountTotal =
        Number(appropriationAmountTotal) + Number(row.appropriationAmount); // 充当金額
      untreatedAmountTotal =
        Number(untreatedAmountTotal) + Number(row.untreatedAmount); // 未処理金額
      depositAmountTotal =
        Number(depositAmountTotal) + Number(row.depositAmount); // 預かり金額
      notTargetedAmountTotal =
        Number(notTargetedAmountTotal) + Number(row.notTargetedAmount); // 対象外金額
      carTaxCashBackAmountTotal =
        Number(carTaxCashBackAmountTotal) + Number(row.carTaxCashBackAmount); // 自税返金額
    });
    const tableRows: TableRowModel[] = [
      {
        receiptAmount: receiptAmountTotal,
        appropriationAmount: appropriationAmountTotal,
        untreatedAmount: untreatedAmountTotal,
        depositAmount: depositAmountTotal,
        notTargetedAmount: notTargetedAmountTotal,
        carTaxCashBackAmount: carTaxCashBackAmountTotal,
      },
    ];
    setTotalValues(tableRows);

    // 対象行から法人IDを取得する
    let targetCorporationId = '';
    resultValues.forEach((row) => {
      if (params.id === row.id) {
        const corporationParam = row.corporationId.split(' ');
        targetCorporationId = corporationParam[0];
      }
    });

    // API-MEM-9999-0023 : 検索条件絞込API : 契約ID, 法人ID/法人名, 請求先ID
    const codeMasterRequestMem0023: ScrMem9999SearchconditionRefineRequest = {
      contractId: '', // 契約ID
      corporationId: targetCorporationId, // 法人ID
      billingId: '', // 請求先ID
    };
    const searchconditionRefine = await ScrMem9999SearchconditionRefine(
      codeMasterRequestMem0023
    );

    // 請求先ID
    searchconditionRefine.billingId;
    // 契約ID
    searchconditionRefine.contractId;

    // リスト取得(初期化)
    const newSelectValues = selectValuesInitialValues;
    // 初期化処理
    newSelectValues.contractIdSelectValues = [];
    newSelectValues.billingIdSelectValues = [];
    newSelectValues.cashbackTargetedBillingIdSelectValues = [];

    // 契約ID, 返金対象法人ID/法人名
    searchconditionRefine.contractId.forEach((row) => {
      newSelectValues.contractIdSelectValues.push({
        value: row,
        displayValue: row,
      });
    });

    // 請求先ID, 返金対象請求先ID
    searchconditionRefine.billingId.forEach((x) => {
      newSelectValues.billingIdSelectValues.push({
        value: x,
        displayValue: x,
      });
      newSelectValues.cashbackTargetedBillingIdSelectValues.push({
        value: x,
        displayValue: x,
      });
    });

    // セレクトボックス設定
    setSelectValues({
      // 入金口座種別
      receiptAccountKindSelectValues:
        selectValues.receiptAccountKindSelectValues,
      // 契約ID
      contractIdSelectValues: newSelectValues.contractIdSelectValues,
      // 法人ID/法人名
      corporationIdSelectValues: selectValues.corporationIdSelectValues,
      // 請求先ID
      billingIdSelectValues: newSelectValues.billingIdSelectValues,
      // 返金対象法人ID/法人名
      cashbackTargetedCorporationIdSelectValues:
        selectValues.cashbackTargetedCorporationIdSelectValues,
      // 返金対象請求先ID
      cashbackTargetedBillingIdSelectValues:
        newSelectValues.cashbackTargetedBillingIdSelectValues,
      // 承認ステータス
      approvalStatusSelectValues: selectValues.approvalStatusSelectValues,
    });
  };

  /**
   * 確定ボタン側の押下時の処理
   */
  const handleRegistConfirm = async (registrationChangeMemo: string) => {
    // API-TRA-0016-0009 - 入金伝票登録API
    const request: ScrTra0016RegistrationReceiptRequest = {
      receiptGroupId: receiptGroupIds,
    };
    await ScrTra0016RegistrationReceipt(request);
    setIsOpenPopup(false);
    setIsChangeHistoryBtn(false);
  };

  /**
   * 登録内容確認ポップアップの承認登録ボタンクリック時のイベントハンドラ
   */
  const handleApprovalConfirm = () => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 入金一覧画面描画処理
   */
  return (
    <>
      <MainLayout>
        {/* main */}
        <h1>SCR-TRA-0016 入金一覧</h1>
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 入金一覧検索セクション */}
            <Section
              name='入金一覧検索'
              isSearch
              serchLabels={serchLabels}
              openable={openSection}
            >
              <Grid container width={1590}>
                <Grid item xs={2}>
                  <Select
                    label='入金口座種別'
                    name='receiptAccountKind'
                    selectValues={selectValues.receiptAccountKindSelectValues}
                    blankOption
                    disabled={disableFlag}
                  />
                  <TextField
                    label='入金グループID/入金ID'
                    name='receiptGroupId'
                    value={valueReceiptGroupId}
                    readonly={disableFlag}
                  />
                  <Select
                    label='契約ID'
                    name='contractId'
                    selectValues={selectValues.contractIdSelectValues}
                    blankOption
                    disabled={disableFlag}
                  />
                  <Select
                    label='法人ID/法人名'
                    name='corporationId'
                    selectValues={selectValues.corporationIdSelectValues}
                    blankOption
                    disabled={disableFlag}
                  />
                  <Select
                    label='請求先ID'
                    name='billingId'
                    selectValues={selectValues.billingIdSelectValues}
                    blankOption
                    disabled={disableFlag}
                  />
                  <ContentsDivider />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label='銀行名'
                    name='bankName'
                    value={valueBankName}
                    readonly={disableFlag}
                  />
                  <TextField
                    label='支店名'
                    name='branchName'
                    value={valueBranchName}
                    readonly={disableFlag}
                  />
                  <TextField
                    label='口座名義'
                    name='accountName'
                    value={valueAccountName}
                    readonly={disableFlag}
                  />
                  <Select
                    label='返金対象法人ID/法人名'
                    name='cashbackTargetedCorporationId'
                    selectValues={
                      selectValues.cashbackTargetedCorporationIdSelectValues
                    }
                    blankOption
                    disabled={disableFlag}
                  />
                  <Select
                    label='返金対象請求先ID'
                    name='cashbackTargetedBillingId'
                    selectValues={
                      selectValues.cashbackTargetedBillingIdSelectValues
                    }
                    blankOption
                    disabled={disableFlag}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FromTo label='入力日'>
                    <DatePicker name='inputDateFrom' disabled={disableFlag} />
                    <DatePicker name='inputDateTo' disabled={disableFlag} />
                  </FromTo>
                  <FromTo label='会計処理日'>
                    <DatePicker
                      name='accountingDateFrom'
                      disabled={disableFlag}
                    />
                    <DatePicker
                      name='accountingDateTo'
                      disabled={disableFlag}
                    />
                  </FromTo>
                  <Select
                    label='承認ステータス'
                    name='approvalStatus'
                    selectValues={selectValues.approvalStatusSelectValues}
                    blankOption
                    disabled={disableFlag}
                  />
                </Grid>
              </Grid>
              <CenterBox>
                <SearchButton
                  onClick={() => {
                    handleSearchClick();
                  }}
                  disable={searchButtonDisableFlag}
                >
                  検索
                </SearchButton>
              </CenterBox>
              <ContentsDivider />
            </Section>

            {/* 入金一覧セクション */}

            <Section
              width={1590}
              name='入金一覧'
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  <AddButton
                    onClick={handleIconAddClick}
                    disable={addButtonDisableFlag}
                  >
                    追加
                  </AddButton>
                  <AddButton
                    onClick={handleIconFBDataImportClick}
                    disable={fbDataImportButtonDisableFlag}
                  >
                    FBデータ取込
                  </AddButton>
                  <AddButton
                    onClick={handleIconReceiptDetailsImportClick}
                    disable={receiptDetailsImportButtonDisableFlag}
                  >
                    入金明細取込
                  </AddButton>
                  <AddButton
                    onClick={handleIconAutomaticClearingClick}
                    disable={automaticClearingButtonDisableFlag}
                  >
                    自動消込
                  </AddButton>
                  <AddButton
                    onClick={handleIconCashBackProcessClick}
                    disable={cashBackProcessButtonDisableFlag}
                  >
                    返金処理
                  </AddButton>
                  <AddButton
                    onClick={handleIconCsvOutputClick}
                    disable={csvOutputButtonDisableFlag}
                  >
                    CSV出力
                  </AddButton>
                </MarginBox>
              }
            >
              {/* 各合計金額 */}
              {/* 債務金額テーブル */}
              <Grid container width={900}>
                <FormProvider {...methods}>
                  <Section>
                    <Table columns={tableColumns} rows={tableRows} />
                  </Section>
                </FormProvider>
              </Grid>

              {/* 一覧表 */}
              <Grid>
                <DataGrid
                  columns={searchResultColumns}
                  rows={searchRowsValues}
                  resolver={searchResultValidationSchema}
                  hrefs={hrefs}
                  pagination={true}
                  onLinkClick={handleLinkClick}
                  checkboxSelection={true}
                  width={3340}
                  onRowSelectionModelChange={(x) => {
                    setRowSelectionModel(x);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  apiRef={apiRef}
                  getCellReadonly={handleGetCellReadonly}
                  disabled={rowdDisableFlag}
                  onRowValueChange={(x) => {
                    reCalc(x, searchRowsValues);
                  }}
                />
              </Grid>
            </Section>
          </FormProvider>
        </MainLayout>

        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CenterBox>
              <ConfirmButton
                onClick={() => {
                  handleConfirmClick();
                }}
                disable={confirmDisableflag}
              >
                確定
              </ConfirmButton>
            </CenterBox>
          </Stack>
        </MainLayout>
      </MainLayout>
      {/* ダイアログ */}
      <Dialog
        open={handleDialog}
        title={title}
        buttons={[{ name: 'OK', onClick: () => setHandleDialog(false) }]}
      />
      {/* CSV読込（ポップアップ） */}
      {scrCom0035PopupIsOpen ? (
        <ScrCom0035Popup
          allRegistrationDefinitions={allRegistrationDefinitions}
          screenId={SCR_TRA_0016}
          isOpen={scrCom0035PopupIsOpen}
          setIsOpen={() => setScrCom0035PopupIsOpen(false)}
        />
      ) : (
        ''
      )}
      {/* エラー確認ポップアップ */}
      <ScrCom0038Popup
        isOpen={isOpen38Popup}
        data={ScrCom0038PopupValues}
        handleCancel={handlePopup38Cancel}
      />
      {/* 登録内容確認ポップアップ */}
      <ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleRegistConfirm={handleRegistConfirm}
        handleApprovalConfirm={handleApprovalConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  );
};

export default ScrTra0016Page;
