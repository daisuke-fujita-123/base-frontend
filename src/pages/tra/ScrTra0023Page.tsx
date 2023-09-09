import React, { useContext, useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0011Popup from 'pages/com/popups/ScrCom0011Popup';
import ScrCom0032Popup, {
  ScrCom0032PopupModel,
  warningList,
} from 'pages/com/popups/ScrCom0032Popup';
import ScrCom0033Popup from 'pages/com/popups/ScrCom0033Popup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section, SectionClose } from 'layouts/Section';

import { AddButton, ConfirmButton, SearchButton } from 'controls/Button';
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

import { ScrCom9999getCodeManagementMasterMultiple } from 'apis/com/ScrCom9999Api';
import {
  ScrMem9999SearchconditionRefine,
  ScrMem9999SearchconditionRefineRequest,
} from 'apis/mem/ScrMem9999Api';
import {
  ErrorList,
  ScrTra0023CheckPayment,
  ScrTra0023CheckPaymentRequest,
  ScrTra0023GetPayment,
  ScrTra0023GetPaymentRequest,
  ScrTra0023GetPaymentResponse,
  ScrTra0023OutputJournalReport,
  ScrTra0023registrationpayment,
  ScrTra0023registrationPaymentRequest,
  WarnList,
} from 'apis/tra/ScrTra0023Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';
import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

import { GridRowParams } from '@mui/x-data-grid';
import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 登録内容確認ポップアップ初期データ
 */
const ScrCom0032PopupModelInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: '',
};

//数字のカンマ区切り書式
const numberFormat = (num: number): string => {
  return num.toLocaleString();
};
// 現在時刻でDateの作成
const now = new Date();
const today = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(
  2,
  '0'
)}/${String(now.getDate()).padStart(2, '0')}`;
/**
 * 登録内容確認用情報のデータモデル
 */
interface ConfirmDetailsErrorListModel {
  // エラーコード
  errorCode: string;
  // エラーメッセージ
  errorMessage: string;
}
interface ConfirmDetailsWarningListModel {
  // ワーニングコード
  warnCode: string;
  // ワーニングメッセージ
  warnMessage: string;
}
interface ConfirmDetailsRegistrationChangeListModel {
  // 画面名
  screenName: string;
  // 画面ID
  screenId: string;
  // タブ名
  tabName: string;
  // タブID
  tabId: string;
  // セクションリスト
  sectionList: string;
  // セクション名
  sectionName: string;
  // 項目名リスト
  columNameList: string;
  // 項目名リスト
  columName: string;
}

/** API-COM-9999-0010:
 *  コード管理マスタリストボックス情報取得API リクエストデータモデル */
interface ScrCom9999GetCodeManagementMasterRequest {
  /** コードID */
  codeId: string;
}

/** 検索項目のバリデーション */
const searchConditionSchema = {
  // 入力日（From）
  accountingDateFrom: yup.string().date().max(10).label('利用開始日（From）'),
  // 入力日（To）
  accountingDateTo: yup.string().date().max(10).label('利用開始日（To）'),
  // 入金口座種別
  debtNumber: yup.string().number().max(12).label('債務番号'),
};

/**
 * 検索条件データモデル
 */
interface SearchConditionModel {
  // 会計処理日(From)
  accountingDateFrom: string;
  // 会計処理日(To)
  accountingDateTo: string;
  // 請求種別
  claimClassification: string;
  // 出金種別
  paymentKind: string;
  // 承認ステータス
  approvalStatus: string[]; //selectvalue[]型だと他がエラーになる。

  // 債務番号
  debtNumber: string;
  // 契約ID
  contractId: string;
  // 法人ID
  corporationId: string;
  // 請求先ID
  billingId: string;
  // 変更履歴番号
  changeHistoryNumber: string;
}

/**
 * 検索条件初期データ
 */
const initialValues: SearchConditionModel = {
  accountingDateFrom: '',
  accountingDateTo: '',
  claimClassification: '',
  paymentKind: '',
  approvalStatus: [],
  debtNumber: '',
  contractId: '',
  corporationId: '',
  billingId: '',
  changeHistoryNumber: '',
};

/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // internal ID
  id: string;
  // 債務番号
  debtNumber: string;
  // 請求種別
  claimClassification: string;
  // 会計処理日
  accountingDate: string;
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 請求先ID
  billingId: string;
  // 債務金額
  debtAmount: string;
  // 銀行振込
  bankTransfer: string;
  // 相殺金額
  offsetAmount: string;
  // 出金保留
  paymentPending: string;
  // 手振出金
  drawerPayment: string;
  // 現金手渡
  cachToPass: string;
  // 出金止め相殺
  paymentStopOffsetting: string;
  // 自社取引
  ownCompanyDeal: string;
  // 償却
  amortization: string;
  // 取引区分
  dealKind: string;
  // 会場名
  placeName: string;
  // 開催日
  sessionDate: string;
  // 開催回数
  sessionCount: string;
  // 出品番号
  exhibitNumber: string;
  // 車名
  carName: string;
  // 承認ステータス
  approvalStatus: string;
  // 詳細承認ステータス
  detailsApprovalStatus: string;
  // 出金番号
  paymentNumber: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
}

/**
 * 検索結果行Warnデータモデル
 */
interface SearchResultWarnModel {
  // ワーニングコード
  warnCode: string;
  // ワーニングメッセージ
  warnMessage: string;
}

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'debtNumber',
    headerName: '債務番号',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'claimClassification',
    headerName: '請求種別',
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
    field: 'corporationId',
    headerName: '法人ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'corporationName',
    headerName: '法人名',
    cellType: 'default',
    size: 'l',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'debtAmount',
    headerName: '債務金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'bankTransfer',
    headerName: '銀行振込',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'offsetAmount',
    headerName: '相殺金額',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'paymentPending',
    headerName: '出金保留',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'drawerPayment',
    headerName: '手振出金',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'cachToPass',
    headerName: '現金手渡',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'paymentStopOffsetting',
    headerName: '出金止め相殺',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'ownCompanyDeal',
    headerName: '自社取引',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'amortization',
    headerName: '償却',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'dealKind',
    headerName: '取引区分',
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
    field: 'sessionCount',
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
    field: 'approvalStatus',
    headerName: '承認ステータス',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'detailsApprovalStatus',
    headerName: '詳細承認ステータス',
    cellType: 'default',
    size: 'm',
  },
];

type key = keyof SearchConditionModel;

const serchData: { label: string; name: key }[] = [
  { label: '会計処理日(From)', name: 'accountingDateFrom' },
  { label: '会計処理日(To)', name: 'accountingDateTo' },
  { label: '請求種別', name: 'claimClassification' },
  { label: '出金種別', name: 'paymentKind' },
  { label: '承認ステータス', name: 'approvalStatus' },
  { label: '債務番号', name: 'debtNumber' },
  { label: '契約ID', name: 'contractId' },
  { label: '法人ID', name: 'corporationId' },
  { label: '請求先ID', name: 'billingId' },
];

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 請求種別
  claimClassificationSelectValues: SelectValue[];
  // 出金種別
  paymentKindSelectValues: SelectValue[];
  // 承認ステータス
  approvalStatusSelectValues: SelectValue[];
  // 契約ID
  contractIdSelectValues: SelectValue[];
  // 法人ID
  corporationIdSelectValues: SelectValue[];
  // 請求先ID
  billingIdSelectValues: SelectValue[];
}

/**
 * 検索条件選択値初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 請求種別
  claimClassificationSelectValues: [],
  // 出金種別
  paymentKindSelectValues: [],
  // 承認ステータス
  approvalStatusSelectValues: [],
  // 契約ID
  contractIdSelectValues: [],
  // 法人ID
  corporationIdSelectValues: [],
  // 請求先ID
  billingIdSelectValues: [],
};

/**
 * 出金一覧検索APIレスポンスから検索結果モデルへの変換
 */

const convertToSearchResultRowModel = (
  response: ScrTra0023GetPaymentResponse
): SearchResultRowModel[] => {
  return response.searchResult.map((x) => {
    return {
      id: x.debtNumber,
      debtNumber: x.debtNumber,
      claimClassification: x.claimClassification,
      accountingDate: x.accountingDate,
      corporationId: x.corporationId,
      corporationName: x.corporationName,
      billingId: x.billingId,
      debtAmount: numberFormat(x.debtAmount),
      bankTransfer: numberFormat(x.bankTransfer),
      offsetAmount: numberFormat(x.offsetAmount),
      paymentPending: numberFormat(x.paymentPending),
      drawerPayment: numberFormat(x.drawerPayment),
      cachToPass: numberFormat(x.cachToPass),
      paymentStopOffsetting: numberFormat(x.paymentStopOffsetting),
      ownCompanyDeal: numberFormat(x.ownCompanyDeal),
      amortization: numberFormat(x.amortization),
      dealKind: x.dealKind,
      placeName: x.placeName,
      sessionDate: x.sessionDate,
      sessionCount: x.sessionCount,
      exhibitNumber: x.exhibitNumber,
      carName: x.carName,
      approvalStatus: x.approvalStatus,
      detailsApprovalStatus: x.detailsApprovalStatus,
      paymentNumber: x.paymentNumber,
      changeTimestamp: x.changeTimestamp,
    };
  });
};

/**
 * テーブル表示モデル
 */
interface SearchResultTable {
  count: number;
  limit: number;
  debtAmount: number;
  bankTransfer: number;
  offsettingAmount: number;
  paymentPending: number;
  drawerPayment: number;
  cachToPass: number;
  paymentStopOffsetting: number;
  ownCompanyDeal: number;
  amortization: number;
}
/**
 * 出金一覧検索APIレスポンスからテーブル表示モデルへの変換
 */
const convertToSearchResultTableModel = (
  model: ScrTra0023GetPaymentResponse
): SearchResultTable => {
  return {
    count: model.count,
    limit: model.limit,
    // 債務金額
    debtAmount: model.debtAmount,
    bankTransfer: model.bankTransfer,
    offsettingAmount: model.offsettingAmount,
    paymentPending: model.paymentPending,
    drawerPayment: model.drawerPayment,
    cachToPass: model.cachToPass,
    paymentStopOffsetting: model.paymentStopOffsetting,
    ownCompanyDeal: model.ownCompanyDeal,
    amortization: model.amortization,
  };
};

/**
 * 出金一覧検索APIレスポンスからワーニングモデルへの変換
 */
const convertToSearchResultWarnModel = (
  response: ScrTra0023GetPaymentResponse
): SearchResultWarnModel[] => {
  return response.warnList.map((x) => {
    return {
      warnCode: x.warnCode,
      warnMessage: x.warnMessage,
    };
  });
};

/**
 * 検索条件モデルから出金一覧検索APIリクエストへの変換
 */

const convertFromSearchConditionModel = (
  searchCondition: SearchConditionModel
): ScrTra0023GetPaymentRequest => {
  return {
    accountingDateFrom: searchCondition.accountingDateFrom,
    accountingDateTo: searchCondition.accountingDateTo,
    claimClassification: searchCondition.claimClassification,
    paymentKind: searchCondition.paymentKind,
    approvalStatus: searchCondition.approvalStatus,
    debtNumber: searchCondition.debtNumber,
    contractId: searchCondition.contractId,
    corporationId: searchCondition.corporationId,
    billingId: searchCondition.billingId,
    changeHistoryNumber: searchCondition.changeHistoryNumber,
  };
};

/**
 * コード管理マスタデータモデル
 */
interface CodemanagementmastermultipleModel {
  //コードIDリスト
  codeIdList: CodeList[];
}
interface CodeList {
  // コードID
  codeId: string;
}
/** コード管理マスタリストのデータモデル */
interface CodemanagementmastermultipleListModel {
  /** リスト */
  resultList: resultList[];
}
/** リスト */
interface resultList {
  // コード値
  codeId: string;
  // コード名称
  codeValueList: codeValueList[];
}
/** リスト */
interface codeValueList {
  // コード値
  codeValue: string;
  // コード名称
  codeName: string;
}

/**
 * SCR-TRA-0023 出金一覧画面
 *
 */
const ScrTra0023Page = () => {
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(ScrCom0032PopupModelInitialValues);

  const [registrationChangeMemo, setRegistrationChangeMemo] =
    useState<string>('');
  //Gridcsv出力用
  const apiRef = useGridApiRef();
  const { getMessage } = useContext(MessageContext);
  //ユーザー情報
  const { user } = useContext(AuthContext);
  // TODO:遷移元画面の判定のところだけ仕様書に記載無しなので単体試験時に調整
  const [dispType, setdispFlg] = useState<string>('');
  //元帳一覧
  const LedgerList = 'SCR-TRA-0034';
  //ワークリスト
  const workList = 'SCR-COM-0003';
  //出金一覧
  const details = 'details';
  //検索アコーディオン制御用
  const sectionRef = useRef<SectionClose>();
  let userEditPermission = false;
  //ユーザーの画面編集権限確認
  if (-1 !== user.editPossibleScreenIdList.indexOf('SCR-TRA-0023')) {
    userEditPermission = true;
  }

  // context
  const { saveState, loadState } = useContext(AppContext);

  // form
  const methods = useForm<SearchConditionModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(searchConditionSchema)),
    context: false,
  });

  const { getValues, setValue, reset, trigger, formState } = methods;

  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);

  const [warningResult, setWarningResult] = useState<warningList[]>([]);
  const [errorResult, setErrorResult] = useState<ErrorList[]>([]);

  //帳票出力ポップアップオープン用
  const [scrCom0011PopupIsOpen, setScrCom0011PopupIsOpen] =
    useState<boolean>(false);
  //登録内容確認ポップアップオープン用
  const [scrCom0032PopupIsOpen, setScrCom0032PopupIsOpen] =
    useState<boolean>(false);

  //登録内容確認ポップアップオープン用
  const [scrCom0033PopupIsOpen, setScrCom0033PopupIsOpen] =
    useState<boolean>(false);

  //ハンドルダイアログ用
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  // セレクトボックス
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 検索ボタン非活性設定
  const [searchButtonDisableFlg, setSearchButtonDisableFlg] =
    useState<boolean>(true);
  // CSV出力ボタン非活性設定
  const [csvOutputButtonDisableFlg, setCsvOutputButtonDisableFlg] =
    useState<boolean>(true);
  // Report出力ボタン非活性設定
  const [reportOutputButtonDisableFlg, setReportOutputButtonDisableFlg] =
    useState<boolean>(true);
  // 確定ボタン非活性設定
  const [confirmButtonDisableFlg, setConfirmButtonDisableFlg] =
    useState<boolean>(true);
  //チェックボックス非活性設定
  const [gridCheckboxDisableFlg, setGridCheckboxDisableflg] =
    useState<boolean>(true);

  //検索条件項目:会計処理日（FROM）非活性設定
  const [accountingDateFromDisableFlg, setAccountingDateFromDisableFlg] =
    useState<boolean>(false);
  //検索条件項目:会計処理日（FROM）非活性設定
  const [accountingDateToDisableFlg, setAccountingDateToDisableFlg] =
    useState<boolean>(false);
  //債務番号
  const [debtNumberDisableFlg, setdebtNumberDisableFlg] =
    useState<boolean>(false);
  //請求種別
  const [claimClassificationDisableFlg, setclaimClassificationDisableFlg] =
    useState<boolean>(false);
  //契約ID
  const [
    contractIdSelectValuesDisableFlg,
    setcontractIdSelectValuesDisableFlg,
  ] = useState<boolean>(false);
  //出金種別
  const [
    paymentKindSelectValuesDisableFlg,
    setpaymentKindSelectValuesDisableFlg,
  ] = useState<boolean>(false);
  //法人ID/法人名
  const [
    corporationIdSelectValuesDisableFlg,
    setcorporationIdSelectValuesDisableFlg,
  ] = useState<boolean>(false);
  //承認ステータス
  const [
    approvalStatusSelectValuesDisableFlg,
    setapprovalStatusSelectValuesDisableFlg,
  ] = useState<boolean>(false);
  //請求先ID
  const [billingIdSelectValuesDisableFlg, setbillingIdSelectValuesDisableFlg] =
    useState<boolean>(false);

  // チェックボックス選択行
  const [rowSelectionModel, setRowSelectionModel] = useState<
    SearchResultRowModel[]
  >([]);

  // router
  const navigate = useNavigate();

  // 債務金額
  const [tableRows, setTableValues] = useState<TableRowModel[]>([]);

  //selectフォーム表示値の取得
  useEffect(() => {
    const initialize = async () => {
      /** SELECT BOX 値取得 */
      // リスト取得(初期化)
      const selectValues: SelectValuesModel = selectValuesInitialValues;

      // コード管理マスタ情報取得API（複数取得）
      const getCodeManagementMasterMultipleRequest = {
        codeIdList: [
          { codeId: 'CDE-COM-0062' },
          { codeId: 'CDE-COM-0118' },
          { codeId: 'CDE-COM-0133' },
        ],
      };

      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );

      // 請求種別

      getCodeManagementMasterMultipleResponse.resultList.forEach((x) => {
        if (x.codeId === 'CDE-COM-0062') {
          x.codeValueList.forEach((f) => {
            selectValues.claimClassificationSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 出金種別
      getCodeManagementMasterMultipleResponse.resultList.forEach((x) => {
        if (x.codeId === 'CDE-COM-0118') {
          x.codeValueList.forEach((f) => {
            selectValues.paymentKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 承認ステータス
      getCodeManagementMasterMultipleResponse.resultList.forEach((x) => {
        if (x.codeId === 'CDE-COM-0133') {
          x.codeValueList.forEach((f) => {
            selectValues.approvalStatusSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // API-MEM-9999-0023 : 検索条件絞込API : 契約ID, 法人ID/法人名, 請求先ID
      const codeMasterRequestMem0023: ScrMem9999SearchconditionRefineRequest = {
        // 契約ID
        contractId: '',
        // 法人ID
        corporationId: '',
        // 請求先ID
        billingId: '',
      };
      const searchconditionRefine = await ScrMem9999SearchconditionRefine(
        codeMasterRequestMem0023
      );

      // 契約ID
      searchconditionRefine.contractId.forEach((x) => {
        selectValues.contractIdSelectValues.push({
          value: x,
          displayValue: x,
        });
      });

      //法人リスト
      searchconditionRefine.corporationList.forEach((x) => {
        selectValues.corporationIdSelectValues.push({
          value: x.corporationId,
          displayValue: x.corporationName,
        });
      });

      //請求先ID
      await searchconditionRefine.billingId.forEach((x) => {
        selectValues.billingIdSelectValues.push({
          value: x,
          displayValue: x,
        });
      });

      // セレクトボックス設定
      setSelectValues({
        // 請求種別
        claimClassificationSelectValues:
          selectValues.claimClassificationSelectValues,
        // 出金種別
        paymentKindSelectValues: selectValues.paymentKindSelectValues,
        // 承認ステータス
        approvalStatusSelectValues: selectValues.approvalStatusSelectValues,
        // 契約ID
        contractIdSelectValues: selectValues.contractIdSelectValues,
        // 法人ID
        corporationIdSelectValues: selectValues.corporationIdSelectValues,
        // 請求先ID
        billingIdSelectValues: selectValues.billingIdSelectValues,
      });

      if (LedgerList === dispType) {
        // 元帳一覧からの遷移
        //実行パラメータ取得
        // 会計処理日(From)
        const sessionStorageAccountingDateFrom =
          sessionStorage.getItem('accountingDateFrom');
        // 会計処理日(To)
        const sessionStorageAccountingDateTo =
          sessionStorage.getItem('accountingDateTo');
        // 法人ID
        const sessionStorageCorporationId =
          sessionStorage.getItem('corporationId');
        // 請求先ID
        const sessionStorageBillingId = sessionStorage.getItem('billingId');
        // 請求種別
        const sessionStorageclaimClassifications = sessionStorage.getItem(
          'claimClassification'
        );

        //元帳一覧画面で設定されたパラメータを検索セクションに設定
        setValue('corporationId', sessionStorageCorporationId || '');
        setValue('billingId', sessionStorageBillingId || '');
        setValue(
          'claimClassification',
          sessionStorageclaimClassifications || ''
        );
        setValue('accountingDateFrom', sessionStorageAccountingDateFrom || '');
        setValue('accountingDateTo', sessionStorageAccountingDateTo || '');

        //検索アコーディオンクローズ
        if (sectionRef.current) sectionRef.current.closeSection();

        //チェックボックス非活性
        setGridCheckboxDisableflg(true);
        //確定ボタン非活性
        setConfirmButtonDisableFlg(true);

        //検索イベント発生
        handleSearchClick();
      } else if (workList === dispType) {
        // ワークリストからの遷移
        //実行パラメータ取得
        const sessionStorageChangeHistoryNumber = sessionStorage.getItem(
          'changeHistoryNumber'
        );
        //ワークリスト画面で設定されたパラメータを検索セクションに設定
        // 変更履歴番号
        setValue(
          'changeHistoryNumber',
          sessionStorageChangeHistoryNumber || ''
        );
        //検索アコーディオンクローズ
        if (sectionRef.current) sectionRef.current.closeSection();
        //チェックボックス非活性
        setGridCheckboxDisableflg(true);
        //確定ボタン非活性
        setConfirmButtonDisableFlg(true);
        //検索イベント発生
        handleSearchClick();
        //検索条件項目,CSVボタン,帳票出力ボタン非活性,検索ボタン
        setAccountingDateFromDisableFlg(true);
        setAccountingDateToDisableFlg(true);
        setdebtNumberDisableFlg(true);
        setclaimClassificationDisableFlg(true);
        setcontractIdSelectValuesDisableFlg(true);
        setpaymentKindSelectValuesDisableFlg(true);
        setcorporationIdSelectValuesDisableFlg(true);
        setapprovalStatusSelectValuesDisableFlg(true);
        setbillingIdSelectValuesDisableFlg(true);
        setCsvOutputButtonDisableFlg(true);
        setReportOutputButtonDisableFlg(true);
        setSearchButtonDisableFlg(true);
      } else if (details === dispType) {
        // 出金詳細からの遷移
        // 検索条件復元
        //reset(loadState());TODO:フォームに反映されないので保留

        setValue(
          'accountingDateFrom',
          sessionStorage.getItem('history_accountingDateFrom') || ''
        );
        setValue(
          'accountingDateTo',
          sessionStorage.getItem('history_accountingDateTo') || ''
        );
        setValue(
          'paymentKind',
          sessionStorage.getItem('history_paymentKind') || ''
        );
        setValue(
          'claimClassification',
          sessionStorage.getItem('history_claimClassification') || ''
        );
        //承認ステータスはJson型で保存していた値を配列に変換
        setValue(
          'approvalStatus',
          JSON.parse(sessionStorage.getItem('history_approvalStatus') || '')
        );
        setValue(
          'debtNumber',
          sessionStorage.getItem('history_debtNumber') || ''
        );
        setValue(
          'contractId',
          sessionStorage.getItem('history_contractId') || ''
        );
        setValue(
          'corporationId',
          sessionStorage.getItem('history_corporationId') || ''
        );
        setValue(
          'billingId',
          sessionStorage.getItem('history_billingId') || ''
        );

        // チェックボックス活性
        setGridCheckboxDisableflg(false);
        // 検索ボタン活性化
        setSearchButtonDisableFlg(false);
      } else {
        // それ以外からの遷移(メニューからの遷移)
        // 会計処理日（FROM）、会計処理日（TO）項目に業務日付をセット
        // 現在時刻でDateの作成
        const now = new Date();
        const today = `${now.getFullYear()}/${String(
          now.getMonth() + 1
        ).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
        setValue('accountingDateFrom', today);
        setValue('accountingDateTo', today);
        // チェックボックス活性
        setGridCheckboxDisableflg(false);
        // 検索ボタン活性化
        setSearchButtonDisableFlg(false);

        formState;
      }
    };
    initialize();
  }, []);

  /**
   * 検索ボタンクリック時のイベントハンドラ
   */
  const handleSearchClick = async () => {
    //TODO:saveStateフォームに反映されないので保留

    //単項目チェック日付FROM～TO
    //saveState(getValues());
    if (
      getValues('accountingDateFrom') !== '' &&
      getValues('accountingDateTo') !== ''
    ) {
      if (getValues('accountingDateFrom') > getValues('accountingDateTo')) {
        //TODO:日付のFROM～TOバリデーション暫定処理
        setTitle('期間が正しくありません。');
        setHandleDialog(true);
        return;
      }
    }
    //単項目入力チェックでOKまたワークリスト、元帳からの遷移の場合はOK
    await trigger();
    if (
      methods.formState.isValid ||
      LedgerList === dispType ||
      workList === dispType
    ) {
      const request = convertFromSearchConditionModel(getValues());
      const response = await ScrTra0023GetPayment(request);
      const searchResult = convertToSearchResultRowModel(response);
      setSearchResult(searchResult);

      const href = searchResult.map((x) => {
        return {
          field: 'debtNumber',
          id: x.debtNumber,
          href: '/tra/payments/' + x.debtNumber,
        };
      });
      const hrefs = [
        {
          field: 'debtNumber',
          hrefs: href,
        },
      ];

      //テーブルに値設定
      const tableResult = convertToSearchResultTableModel(response);
      const tableRows: TableRowModel[] = [
        {
          count: numberFormat(tableResult.count),
          limit: tableResult.limit,
          debtAmount: numberFormat(tableResult.debtAmount),
          bankTransfer: numberFormat(tableResult.bankTransfer),
          offsettingAmount: numberFormat(tableResult.offsettingAmount),
          paymentPending: numberFormat(tableResult.paymentPending),
          drawerPayment: numberFormat(tableResult.drawerPayment),
          cachToPass: numberFormat(tableResult.cachToPass),
          paymentStopOffsetting: numberFormat(
            tableResult.paymentStopOffsetting
          ),
          ownCompanyDeal: numberFormat(tableResult.ownCompanyDeal),
          amortization: numberFormat(tableResult.amortization),
        },
      ];
      setTableValues(tableRows);

      //ワークフローの時は債務番号のリンクを無効にする。
      if (workList !== dispType) {
        setHrefs(hrefs);
      }

      // 検索結果が1件以上存在する場合は各種ボタンを有効化する
      if (1 <= Number(tableResult.count)) {
        if (LedgerList !== dispType && workList !== dispType) {
          // CSV出力ボタン活性化
          setCsvOutputButtonDisableFlg(false);
          // 帳票出力ボタン活性化
          setReportOutputButtonDisableFlg(false);
          // チェックボックス活性
          setGridCheckboxDisableflg(false);
          // 確定ボタン活性
          if (userEditPermission === true) {
            setConfirmButtonDisableFlg(false);
          }
        } else {
          // チェックボックス非活性
          setGridCheckboxDisableflg(true);
        }
      }
      //検索アコーディオンクローズ
      if (sectionRef.current && sectionRef.current.closeSection)
        sectionRef.current.closeSection();

      //検索条件をセッションストレージに保存
      //会計処理日（FROM）
      sessionStorage.setItem(
        'history_accountingDateFrom',
        getValues('accountingDateFrom')
      );
      //会計処理日（TO）
      sessionStorage.setItem(
        'history_accountingDateTo',
        getValues('accountingDateTo')
      );
      //請求種別(選択値)
      sessionStorage.setItem(
        'history_claimClassification',
        getValues('claimClassification')
      );
      //出金種別(選択値)
      sessionStorage.setItem('history_paymentKind', getValues('paymentKind'));
      //承認ステータス(選択値)
      // JSON形式で保存
      sessionStorage.setItem(
        'history_approvalStatus',
        JSON.stringify(getValues('approvalStatus'))
      );
      //債務番号
      sessionStorage.setItem('history_debtNumber', getValues('debtNumber'));
      //契約ID(選択値)
      sessionStorage.setItem('history_contractId', getValues('contractId'));
      //法人ID/法人名(選択値)
      sessionStorage.setItem(
        'history_corporationId',
        getValues('corporationId')
      );
      //請求先ID(選択値)
      sessionStorage.setItem('history_billingId', getValues('billingId'));

      //ワーニングメッセージが指定されている場合ワーニングメッセージを表示させる。
      //ワーニングに値設定
      const WarnResult = convertToSearchResultWarnModel(response);
      const warnCount = Object.keys(WarnResult).length;
      if (0 < warnCount) {
        const messege = Format(getMessage('MSG-BK-WRN-00011'), [
          tableResult.limit.toString(),
          tableResult.count.toString(),
        ]);
        // ダイアログを表示
        setTitle(messege);
        setHandleDialog(true);
      }
    } else {
      //バリデーションエラーありの場合は検索ボタンの動作は無効とする
      return;
    }
  };

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    saveState(getValues());
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const fileName =
      '出金一覧_' +
      user.employeeId +
      '_' +
      year +
      String(Number(month) + 1) +
      day +
      hours +
      minutes +
      '.csv';
    exportCsv(fileName, apiRef);
  };

  //テーブル定義1
  const tableColumns: TableColDef[] = [
    { field: 'debtAmount', headerName: '債務金額', width: 150 },
  ];

  //テーブル定義2
  const table2_columns: TableColDef[] = [
    { field: 'bankTransfer', headerName: '銀行振込', width: 150 },
    { field: 'offsettingAmount', headerName: '相殺金額', width: 150 },
    { field: 'paymentPending', headerName: '出金保留', width: 150 },
    { field: 'drawerPayment', headerName: '手振出金', width: 150 },
    { field: 'cachToPass', headerName: '現金手渡', width: 150 },
    { field: 'paymentStopOffsetting', headerName: '出金止相殺', width: 150 },
    { field: 'ownCompanyDeal', headerName: '自社取引', width: 150 },
    { field: 'amortization', headerName: '償却', width: 150 },
  ];

  /**
   * 帳票出力アイコンクリック時のイベントハンドラ（ダイアログオープン）
   */
  const handleIconOutputReportClick = () => {
    setScrCom0011PopupIsOpen(true);
  };

  /**
   * 帳票選択ポップアップ、出力ボタンクリック時のイベントハンドラ
   */
  const handleReportConfirm = async () => {
    //Response用配列定義
    const request: string[] = [];
    //明細入力件数チェック
    const detailsCount = Object.keys(rowSelectionModel).length;
    //選択行が0件の場合は、検索行すべてが出力対象
    //検索結果行の債務番号のリストをrequestパラメータにセット
    if (detailsCount === 0) {
      searchResult.forEach((selectedRows) =>
        request.push(selectedRows.debtNumber)
      );
    } else {
      //チェックボックス選択行の債務番号のリストをrequestパラメータにセット
      rowSelectionModel.forEach((selectedRows) =>
        request.push(selectedRows.debtNumber)
      );
    }
    //帳票選択ポップアップクローズ
    setScrCom0011PopupIsOpen(false);
    await ScrTra0023OutputJournalReport({ debtNumber: request });
  };

  /**
   * Sectionを閉じた際のラベル作成
   */
  const serchLabels = serchData.map((val, index) => {
    let nameVal = getValues(val.name);

    // 請求種別
    if (val.name === 'claimClassification') {
      const filter = selectValues.claimClassificationSelectValues.filter(
        (x) => {
          return nameVal === x.value;
        }
      );
      filter.forEach((x) => {
        nameVal = x.displayValue;
      });
    }

    // 出金種別
    if (val.name === 'paymentKind') {
      const filter = selectValues.paymentKindSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.forEach((x) => {
        nameVal = x.displayValue;
      });
    }

    // 承認ステータス
    if (val.name === 'approvalStatus') {
      const nameValues: string[] = [];
      selectValues.approvalStatusSelectValues.filter((x) => {
        if (typeof nameVal !== 'string') {
          nameVal.forEach((f) => {
            if (x.value === f) {
              nameValues.push(x.displayValue);
            }
          });
        }
      });
      nameVal = nameValues.join(',\n');
    }
    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });

  /**
   * 登録内容確認（ポップアップ）承認申請ボタン押下時のイベントハンドラ
   */
  const handleApprovalConfirm = (registrationChangeMemo: string) => {
    setRegistrationChangeMemo(registrationChangeMemo);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handleRegistConfirm = (registrationChangeMemo: string) => {
    setRegistrationChangeMemo(registrationChangeMemo);
    setScrCom0032PopupIsOpen(false);
    setScrCom0033PopupIsOpen(true);
  };

  /**
   * 登録内容確認ポップアップ確定クリック時のイベントハンドラ
   */
  const scrCom0033handleConfirm = async (
    employeeId1: string,
    employeeId2: string,
    employeeId3: string,
    employeeId4: string,
    applicationComment: string
  ) => {
    // request項目設定
    //セッションストレージから出金番号リスト取得
    //出金番号リストはJson型で保存していた値を配列に変換
    const request: ScrTra0023registrationPaymentRequest = {
      // 出金番号リスト配列
      paymentList: JSON.parse(
        sessionStorage.getItem('history_approvalStatus') || ''
      ),
      // 従業員ID1
      employeeId1: employeeId1,
      // 従業員ID2
      employeeId2: employeeId2,
      // 従業員ID3
      employeeId3: employeeId3,
      // 従業員ID4
      employeeId4: employeeId4,
      // 申請コメント
      applicationComment: applicationComment,
      // マスタID
      masterId: null,
      // 変更予定日
      changeExpectDate: today,
      // 画面ID
      screenId: 'SCR-TRA-0023',
      // タブID
      tabId: null,
      // 変更履歴番号
      changeHistoryNumber: sessionStorage.getItem('changeHistoryNumber'),
      // 登録変更メモ
      registrationChangeMemo: registrationChangeMemo,
    };
    //登録内容申請ポップアップクローズ
    setScrCom0033PopupIsOpen(false);
    //出金申請登録API呼び出し
    await ScrTra0023registrationpayment(request);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirmClick = async () => {
    //明細入力件数チェック
    const detailsCount = Object.keys(rowSelectionModel).length;
    const request: ScrTra0023CheckPaymentRequest[] = rowSelectionModel.map(
      (selectedRows) => ({
        paymentNumber: selectedRows.paymentNumber,
        changeTimestamp: selectedRows.changeTimestamp,
      })
    );
    //チェックボックス0件の場合は、ダイアログでエラーメッセージを表示
    if (0 === detailsCount) {
      const messege = Format(getMessage('MSG-FR-ERR-00046'), []);
      // ダイアログを表示
      setTitle(messege);
      setHandleDialog(true);
    } else {
      //セッションストレージにrequest内容保存（出金番号リスト配列）
      // JSON形式で保存
      sessionStorage.setItem(
        'history_CheckPaymentRequest',
        JSON.stringify(request)
      );

      //出金伝票詳細入力チェック
      const response = await ScrTra0023CheckPayment(request);
      //出金一覧検索APIレスポンスからワーニングリストモデルへの変換
      const convertToWarningResult = (response: WarnList[]): warningList[] => {
        return response.map((x) => {
          return {
            warningCode: x.warnCode,
            warningMessage: x.warnMessage,
          };
        });
      };

      //登録内容確認ポップアップ呼び出し前の準備
      const convertWarn = convertToWarningResult(response.warnList);
      setWarningResult(convertWarn);
      setErrorResult(response.errorList);

      setScrCom0032PopupData({
        errorList: errorResult,
        warningList: warningResult,
        changeExpectDate: today,
        registrationChangeList: [
          {
            screenId: 'SCR-TRA-0023',
            // 画面名
            screenName: '出金一覧',
            // タブID
            tabId: 0,
            // タブ名
            tabName: '',
            // セクションリスト
            sectionList: [
              {
                // セクション名
                sectionName: '',
                // 項目名リスト
                columnList: [
                  {
                    columnName: '',
                  },
                ],
              },
            ],
          },
        ],
      });

      // 登録内容確認ポップアップ起動
      setScrCom0032PopupIsOpen(true);
    }
  };

  /**
   * 出金一覧画面描画処理
   */
  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 出金一覧検索セクション */}
            <Section
              name='出金一覧検索'
              isSearch
              serchLabels={serchLabels}
              ref={sectionRef}
            >
              <Grid container width={1690}>
                <Grid item xs={4}>
                  <FromTo label='利用開始日'>
                    <DatePicker
                      disabled={accountingDateFromDisableFlg}
                      name='accountingDateFrom'
                    />
                    <DatePicker
                      disabled={accountingDateToDisableFlg}
                      name='accountingDateTo'
                    />
                  </FromTo>
                  <Grid item xs={2}>
                    <TextField
                      label='債務番号'
                      name='debtNumber'
                      disabled={debtNumberDisableFlg}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    label='請求種別'
                    name='claimClassification'
                    selectValues={selectValues.claimClassificationSelectValues}
                    disabled={claimClassificationDisableFlg}
                    blankOption
                  />

                  <Grid item xs={2}>
                    <Select
                      label='契約ID'
                      name='contractId'
                      selectValues={selectValues.contractIdSelectValues}
                      disabled={contractIdSelectValuesDisableFlg}
                      blankOption
                    />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    label='出金種別'
                    name='paymentKind'
                    selectValues={selectValues.paymentKindSelectValues}
                    disabled={paymentKindSelectValuesDisableFlg}
                    blankOption
                  />
                  <Grid item xs={2}>
                    <Select
                      label='法人ID/法人名'
                      name='corporationId'
                      selectValues={selectValues.corporationIdSelectValues}
                      disabled={corporationIdSelectValuesDisableFlg}
                      blankOption
                    />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    label='承認ステータス'
                    name='approvalStatus'
                    selectValues={selectValues.approvalStatusSelectValues}
                    disabled={approvalStatusSelectValuesDisableFlg}
                    blankOption
                    multiple
                  />
                  <Grid item xs={2}>
                    <Select
                      label='請求先ID'
                      name='billingId'
                      selectValues={selectValues.billingIdSelectValues}
                      disabled={billingIdSelectValuesDisableFlg}
                      blankOption
                    />
                  </Grid>
                </Grid>
              </Grid>

              <ContentsDivider />
              <CenterBox>
                <SearchButton
                  disable={searchButtonDisableFlg}
                  onClick={() => {
                    handleSearchClick();
                  }}
                >
                  検索
                </SearchButton>
              </CenterBox>
            </Section>
          </FormProvider>

          {/* 出金一覧セクション */}
          <Section
            name='出金一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton
                  onClick={handleIconOutputCsvClick}
                  disable={csvOutputButtonDisableFlg}
                >
                  CSV出力
                </AddButton>
                <AddButton
                  onClick={handleIconOutputReportClick}
                  disable={reportOutputButtonDisableFlg}
                >
                  帳票出力
                </AddButton>
              </MarginBox>
            }
          >
            {/* 債務金額テーブル */}
            <Grid container width={240}>
              <FormProvider {...methods}>
                <Section>
                  <Table columns={tableColumns} rows={tableRows} />
                </Section>
              </FormProvider>
            </Grid>
            {/* 銀行振込～テーブル */}
            <Grid container width={1200}>
              <FormProvider {...methods}>
                <Section>
                  <Table columns={table2_columns} rows={tableRows} />
                </Section>
              </FormProvider>
            </Grid>
            {/* 債務一覧テーブル */}
            <Grid>
              <DataGrid
                columns={searchResultColumns}
                rows={searchResult}
                hrefs={hrefs}
                apiRef={apiRef}
                pagination
                onLinkClick={handleLinkClick}
                checkboxSelection={true}
                isRowSelectable={(params: GridRowParams) =>
                  Number(params.row.bankTransfer.replace(/,/g, '')) !== 0 &&
                  params.row.approvalStatus !== '承認依頼中' &&
                  params.row.approvalStatus !== '承認済'
                }
                // チェックボックス選択済みリスト取得
                onRowSelectionModelChange={(RowId) => {
                  // 選択された行を特定するための処理
                  const selectedRowId = new Set(RowId);
                  const selectedRows = searchResult.filter((dataGridRow) =>
                    selectedRowId.has(dataGridRow.id)
                  );
                  setRowSelectionModel(selectedRows);
                }}
              />
            </Grid>
          </Section>
        </MainLayout>
        {/* bottom */}
        <MainLayout bottom>
          <ConfirmButton
            onClick={handleConfirmClick}
            disable={confirmButtonDisableFlg}
          >
            確定
          </ConfirmButton>
        </MainLayout>
      </MainLayout>
      {/* 帳票選択（ポップアップ） */}
      {scrCom0011PopupIsOpen ? (
        <ScrCom0011Popup
          isOpen={scrCom0011PopupIsOpen}
          data={{ screenId: 'SCR-TRA-0023' }}
          handleCancel={() => setScrCom0011PopupIsOpen(false)}
          handleConfirm={handleReportConfirm}
        />
      ) : (
        ''
      )}
      {/* 登録内容確認（ポップアップ） */}
      {scrCom0032PopupIsOpen ? (
        <ScrCom0032Popup
          isOpen={scrCom0032PopupIsOpen}
          data={scrCom0032PopupData}
          handleCancel={() => setScrCom0032PopupIsOpen(false)}
          handleRegistConfirm={handleRegistConfirm}
          handleApprovalConfirm={handleApprovalConfirm}
        />
      ) : (
        ''
      )}
      {/* 【登録内容確認ポップアップ】確定ボタンの処理 */}
      {scrCom0033PopupIsOpen ? (
        <ScrCom0033Popup
          isOpen={scrCom0033PopupIsOpen}
          data={{ screenId: 'SCR-TRA-0023', tabId: 0, applicationMoney: 0 }}
          handleCancel={() => setScrCom0033PopupIsOpen(false)}
          handleConfirm={scrCom0033handleConfirm}
        />
      ) : (
        ''
      )}
      {/* ダイアログ */}
      {handleDialog ? (
        <Dialog
          open={handleDialog}
          title={title}
          buttons={[{ name: 'OK', onClick: () => setHandleDialog(false) }]}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrTra0023Page;
