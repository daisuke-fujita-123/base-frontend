import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Params, useLocation, useParams } from 'react-router-dom';

import yup from 'utils/yup';
import { ObjectSchema } from 'yup';

import ScrCom0032Popup, {
  ScrCom0032PopupModel,
  warningList,
} from 'pages/com/popups/ScrCom0032Popup';
import ScrCom0033Popup from 'pages/com/popups/ScrCom0033Popup';

import { MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { Dialog } from 'controls/Dialog';
import { SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';

import {
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetCodeManagementMasterRequest,
  ScrCom9999GetCodeManagementMasterResponse,
} from 'apis/com/ScrCom9999Api';
import {
  ErrorList,
  PaymentDetailsListreq,
  ScrTra0025CheckPayment,
  ScrTra0025CheckPaymentRequest,
  ScrTra0025GetPaymentDetails,
  ScrTra0025GetPaymentDetailsRequest,
  ScrTra0025GetPaymentDetailsResponse,
  ScrTra0025registrationpayment,
  ScrTra0025registrationPaymentRequest,
  WarnList,
} from 'apis/tra/ScrTra0025Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

/**
 * 登録内容確認ポップアップ初期データ
 */
const ScrCom0032PopupModelInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: '',
};

/** 入力項目のバリデーション */
const debtListSchema: ObjectSchema<any> = yup.object({
  // 会計処理日
  accountingDate: yup.string().date().max(10).label('会計処理日'),
  // 金額
  paymentAmount: yup.string().notZero().numberWithComma().max(14).label('金額'),
  // メモ
  paymentMemo: yup.string().max(1000).label('メモ'),
});

// 現在時刻でDateの作成
const now = new Date();
const today = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(
  2,
  '0'
)}/${String(now.getDate()).padStart(2, '0')}`;
/**
 * プルダウンデータ
 */
interface SelectValuesModel {
  // 請求種別
  claimClassificatioSelectValues: SelectValue[];
}
//プルダウン初期データ
const selectValuesInitialValues: SelectValuesModel = {
  // 出金種別
  claimClassificatioSelectValues: [],
};

//数字のカンマ区切り書式
const numberFormat = (num: number): string => {
  return num.toLocaleString();
};

/**
 * 出金伝票表示のデータモデル
 */
interface PaymentDetailsDispModel {
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 請求先ID
  billingId: string;
  // 即支払可否フラグ
  immediatePaymentFlag: string;
  // 即時出金限度額
  immediatePaymentLimitAmount: string;
  // 取引区分
  dealKind: string;
  // 会場名
  placeName: string;
  // 開催日
  sessionDate: string;
  // オークション回数
  auctionCount: string;
  // 出品番号
  exhibitNumber: string;
  // 車名
  carName: string;
  // 請求種別
  claimClassification: string;
  // 債務金額
  debtAmount: string;
  // 承認ステータス
  approvalStatus: string;
  // 出金番号
  paymentNumber: string;
  // 出金元口座ID
  paymentSourceAccountId: string;
  // 出金元口座銀行名
  paymentSourcebankName: string;
  // 出金元口座支店名
  paymentSourcebranchName: string;
  // 承認依頼中フラグ
  approvalRequestFlag: boolean | null;
  // 自社IDフラグ
  ownCompanyFlag: boolean | null;
  // 変更タイムスタンプ
  changeTimestamp: string;

  // 債務金額
  debtNumber: string;
  bankTransfer: string;
  ownTransactions: string;
  withdrawStopOffset: string;
  offsetAmount: string;
  withdrawPending: string;
  amortization: string;
  billwithdraw: string;
  cashdelivery: string;
}

/** 債務一覧リストのデータモデル */
interface debtListRowModel {
  // internal ID
  id: number;
  // 出金明細番号
  paymentDetailsNumber: number;
  // 会計処理日
  accountingDate: string;
  // 出金種別
  paymentKind: string;
  // 出金元口座
  paymentSourceAccountName: string;
  // 出金元口座ID
  paymentSourceAccountId: string;
  // 出金額
  paymentAmount: string;
  // 出金メモ
  paymentMemo: string;
  // 出金FBデータ出力済フラグ
  paymentFbDataOutputFlag: boolean;
  // 出金元口座銀行名
  paymentSourcebankName: string;
  // 出金元口座支店名
  paymentSourcebranchName: string;
}

/** 債務一覧リストのデータモデル */
const debtListRowInitialValues: debtListRowModel = {
  // internal ID
  id: 0,
  // 出金明細番号
  paymentDetailsNumber: 0,
  // 会計処理日
  accountingDate: '',
  // 出金種別
  paymentKind: '',
  // 出金元口座
  paymentSourceAccountName: '',
  // 出金元口座ID
  paymentSourceAccountId: '',
  // 出金額
  paymentAmount: '',
  // 出金メモ
  paymentMemo: '',
  // 出金FBデータ出力済フラグ
  paymentFbDataOutputFlag: false,
  // 出金元口座銀行名
  paymentSourcebankName: '',
  // 出金元口座支店名
  paymentSourcebranchName: '',
};

/**
 * 出金伝票データ取得APIリクエストへの変換
 */
const convertGetPaymentDetailsModel = (
  Param: ScrTra0025GetPaymentDetailsRequest
): ScrTra0025GetPaymentDetailsRequest => {
  return {
    // 債務番号
    debtNumber: Param.debtNumber,
  };
};

/** トータル金額表示データモデル */
interface totalAmountModel {
  // 銀行振込
  bankTransfer: string;
  // 相殺金額
  offsetAmount: string;
  // 出金保留
  withdrawPending: string;
  // 出金保留
  billwithdraw: string;
  // 現金手渡
  cashdelivery: string;
  // 出金止相殺
  withdrawStopOffset: string;
  // 自社取引
  ownTransactions: string;
  // 償却
  amortization: string;
}
/**
 * トータル金額表示初期データ
 */
const totalAmountInitialValues: totalAmountModel = {
  bankTransfer: '',
  offsetAmount: '',
  withdrawStopOffset: '',
  withdrawPending: '',
  billwithdraw: '',
  cashdelivery: '',
  ownTransactions: '',
  amortization: '',
};

/**
 * 出金伝票情報表示モデル初期データ
 */
const PaymentDetailsDispInitialValues: PaymentDetailsDispModel = {
  corporationId: '',
  corporationName: '',
  billingId: '',
  immediatePaymentFlag: '',
  immediatePaymentLimitAmount: '',
  dealKind: '',
  placeName: '',
  sessionDate: '',
  auctionCount: '',
  exhibitNumber: '',
  carName: '',
  claimClassification: '',
  debtAmount: '',
  approvalStatus: '',
  paymentNumber: '',
  paymentSourceAccountId: '',
  paymentSourcebankName: '',
  paymentSourcebranchName: '',
  approvalRequestFlag: null,
  ownCompanyFlag: null,
  changeTimestamp: '',
  debtNumber: '',
  bankTransfer: '',
  offsetAmount: '',
  withdrawPending: '',
  billwithdraw: '',
  cashdelivery: '',
  withdrawStopOffset: '',
  ownTransactions: '',
  amortization: '',
};
const testValues = [
  { value: '1', displayValue: '銀行振込' },
  { value: '2', displayValue: '相殺金額' },
  { value: '3', displayValue: '出金保留' },
];

// 出金種別
const CodeManagementSelectValuesModel = (
  paymentKindResponse: ScrCom9999GetCodeManagementMasterResponse
): SelectValue[] => {
  return paymentKindResponse.searchGetCodeManagementMasterListbox.map((x) => {
    return {
      value: x.codeValue,
      displayValue: x.codeName,
    };
  });
};

//グリッドの非活性制御用変数
let initialDisplayFlg = 1;
const accountingDateDisableFlg: number[] = [];
const paymentKindDisableFlg: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const paymentAmountDisableFlg: number[] = [];
const paymentMemoDisableFlg: number[] = [];

/**
 * SCR-TRA-0025 出金詳細画面
 */
const ScrTra0025Page = () => {
  // 債務番号取得
  // 出金一覧からURIパラメータの債務番号を取得
  const { debtNum } = useParams<Params>();
  const debtNumber = String(debtNum);
  //const debtNumber = String(queryParams.get('debtNumber'));

  //登録時メモ
  const [registrationChangeMemo, setRegistrationChangeMemo] =
    useState<string>('');
  // 登録内容確認ポップアップオープン用
  const [scrCom0032PopupIsOpen, setScrCom0032PopupIsOpen] =
    useState<boolean>(false);
  // 登録内容確認ポップアップオープン用
  const [scrCom0033PopupIsOpen, setScrCom0033PopupIsOpen] =
    useState<boolean>(false);

  const [warningResult, setWarningResult] = useState<warningList[]>([]);
  const [errorResult, setErrorResult] = useState<ErrorList[]>([]);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(ScrCom0032PopupModelInitialValues);
  // 編集行データ
  const [rowModel, setRowModel] = useState<debtListRowModel[]>([]);
  let editFlg = 0;
  let editCount = 0;
  // ハンドルダイアログ用
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [handleDialogError, setHandleDialogError] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const { getMessage } = useContext(MessageContext);
  // ユーザー情報
  const { user } = useContext(AuthContext);
  // 業務日付取得
  const taskDate = user.taskDate;

  // 債務一覧非活性設定
  const [debtListDisableFlg, setdebtlistDisableFlg] = useState<boolean>(true);
  // 確定ボタン非活性設定
  const [confirmButtonDisableFlg, setConfirmButtonDisableFlg] =
    useState<boolean>(true);

  // context
  //const { saveState, loadState } = useContext(AppContext);

  // router
  const navigate = useNavigate();
  const location = useLocation();

  // state
  // 初期化、値設定（リストボックス）
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );

  // テーブル定義
  const debtLists_columns: GridColDef[] = [
    {
      field: 'accountingDate',
      cellType: 'datepicker',
      headerName: '会計処理日',
      size: 'm',
    },
    {
      field: 'paymentKind',
      cellType: 'select',
      headerName: '出金種別',
      selectValues: selectValues.claimClassificatioSelectValues,
      size: 'm',
    },
    {
      field: 'paymentSourceAccountName',
      headerName: '出金元口座',
      size: 'l',
    },
    {
      field: 'paymentAmount',
      cellType: 'input',
      headerName: '金額',
      size: 'm',
    },
    {
      field: 'paymentMemo',
      cellType: 'input',
      headerName: 'メモ',
      size: 'l',
    },
  ];

  const handleGetSelectValues = (params: any) => {
    return selectValues.claimClassificatioSelectValues;
  };

  // 初期化と値設定（出金伝票情報セクション）
  const [paymentDetailsDispValues, setPaymentDetailsDispValues] =
    useState<PaymentDetailsDispModel>(PaymentDetailsDispInitialValues);

  // 初期化と値設定（合計金額セクション）
  const [totalValues, setTotalValues] = useState<totalAmountModel>(
    totalAmountInitialValues
  );

  // 初期化と値設定（債務一覧セクション）
  const [debtList_rows, setdebtListRowValues] = useState<debtListRowModel[]>(
    []
  );

  // 初期化と値設定（合計金額表示セクション）
  // 合計金額初期値
  let bankTransferTotal = 0;
  let offsetAmountTotal = 0;
  let withdrawPendingTotal = 0;
  let billwithdrawTotal = 0;
  let cashdeliveryTotal = 0;
  let withdrawStopOffsetTotal = 0;
  let ownTransactionsTotal = 0;
  let amortizationTotal = 0;

  /**
   * 出金伝票データ取得APIレスポンスから出金伝票表示モデルへの変換
   */
  const convertToPaymentDetailsDispModel = (
    model: ScrTra0025GetPaymentDetailsResponse
  ): PaymentDetailsDispModel => {
    return {
      corporationId: model.corporationId,
      corporationName: model.corporationName,
      billingId: model.billingId,
      immediatePaymentFlag: model.immediatePaymentFlag ? '可' : '否',
      immediatePaymentLimitAmount: numberFormat(
        model.immediatePaymentLimitAmount
      ),
      dealKind: model.dealKind,
      placeName: model.placeName,
      sessionDate: model.sessionDate,
      auctionCount: model.auctionCount,
      exhibitNumber: model.exhibitNumber,
      carName: model.carName,
      claimClassification: model.claimClassification,
      debtAmount: numberFormat(model.debtAmount),
      approvalStatus: model.approvalStatus,
      paymentNumber: model.paymentNumber,
      paymentSourceAccountId: model.paymentSourceAccountId,
      paymentSourcebankName: model.paymentSourcebankName,
      paymentSourcebranchName: model.paymentSourcebranchName,
      approvalRequestFlag: model.approvalRequestFlag,
      ownCompanyFlag: model.ownCompanyFlag,
      changeTimestamp: model.changeTimestamp,

      //トータル金額
      debtNumber: debtNumber,
      bankTransfer: totalValues.bankTransfer,
      ownTransactions: totalValues.ownTransactions,
      withdrawStopOffset: totalValues.withdrawStopOffset,
      offsetAmount: totalValues.offsetAmount,
      withdrawPending: totalValues.withdrawPending,
      amortization: totalValues.amortization,
      billwithdraw: totalValues.billwithdraw,
      cashdelivery: totalValues.cashdelivery,
    };
  };

  // form
  const methods = useForm<PaymentDetailsDispModel>({
    defaultValues: PaymentDetailsDispInitialValues,
    //context: { readonly: true },
  });

  // TODO:アーキ対応後修正
  // const debtListRowMethods = useForm<debtListRowModel>({
  //   defaultValues: debtListRowInitialValues,
  //   //resolver: yupResolver(yup.object(debtListSchema)),
  //   //context: { readonly: true },
  // });

  const { getValues, setValue, reset, trigger } = methods;

  // 初期表示時
  // 出金伝票データ取得APIリクエスト
  const param: ScrTra0025GetPaymentDetailsRequest = {
    // 債務番号
    debtNumber: debtNumber,
  };

  let userEditPermission = false;
  //ユーザーの画面編集権限確認
  if (-1 !== user.editPossibleScreenIdList.indexOf('SCR-TRA-0025')) {
    userEditPermission = true;
  }
  // レンダリング後に動作するロジック
  useEffect(() => {
    const initialize = async () => {
      // 出金伝票データ取得APIリクエスト項目設定
      const request = convertGetPaymentDetailsModel(param);
      // 出金伝票データ取得API呼び出し
      const response = await ScrTra0025GetPaymentDetails(request);

      // 出金伝票情報表示セクション
      // 表示データ設定
      const paymentDetailsDispValues =
        convertToPaymentDetailsDispModel(response);
      setPaymentDetailsDispValues(paymentDetailsDispValues);

      // 各表示項目への値設定
      setValue('corporationId', paymentDetailsDispValues.corporationId);
      setValue('corporationName', paymentDetailsDispValues.corporationName);
      setValue('billingId', paymentDetailsDispValues.billingId);
      //即払可否:請求種別が'四輪'、または'二輪'の場合に'即払可否'、'即時出金限度額'を表示
      if (
        paymentDetailsDispValues.claimClassification === '四輪' ||
        paymentDetailsDispValues.claimClassification === '二輪'
      ) {
        setValue(
          'immediatePaymentFlag',
          paymentDetailsDispValues.immediatePaymentFlag
        );
        setValue(
          'immediatePaymentLimitAmount',
          paymentDetailsDispValues.immediatePaymentLimitAmount
        );
      }
      setValue('dealKind', paymentDetailsDispValues.dealKind);
      setValue('placeName', paymentDetailsDispValues.placeName);
      setValue('sessionDate', paymentDetailsDispValues.sessionDate);
      setValue('auctionCount', paymentDetailsDispValues.auctionCount);
      setValue('exhibitNumber', paymentDetailsDispValues.exhibitNumber);

      setValue('carName', paymentDetailsDispValues.carName);
      setValue(
        'claimClassification',
        paymentDetailsDispValues.claimClassification
      );
      setValue('debtAmount', paymentDetailsDispValues.debtAmount);
      setValue('approvalStatus', paymentDetailsDispValues.approvalStatus);
      setValue('paymentNumber', paymentDetailsDispValues.paymentNumber);
      setValue('debtNumber', debtNumber);

      // 合計金額表示セクション
      // 表示項目毎に合計金額を計算
      response.paymentDetailsList.forEach((x) => {
        if (x.paymentKind === '1') {
          bankTransferTotal += x.paymentAmount;
        }
        if (x.paymentKind === '2') {
          offsetAmountTotal += x.paymentAmount;
        }
        if (x.paymentKind === '3') {
          withdrawPendingTotal += x.paymentAmount;
        }
        if (x.paymentKind === '4') {
          billwithdrawTotal += x.paymentAmount;
        }
        if (x.paymentKind === '5') {
          cashdeliveryTotal += x.paymentAmount;
        }
        if (x.paymentKind === '6') {
          withdrawStopOffsetTotal += x.paymentAmount;
        }
        if (x.paymentKind === '7') {
          ownTransactionsTotal += x.paymentAmount;
        }
        if (x.paymentKind === '8') {
          amortizationTotal += x.paymentAmount;
        }
      });

      // 各表示項目への値設定(数値型から文字型桁区切り処理)
      setValue('bankTransfer', numberFormat(bankTransferTotal));
      setValue('offsetAmount', numberFormat(offsetAmountTotal));
      setValue('cashdelivery', numberFormat(cashdeliveryTotal));
      setValue('withdrawPending', numberFormat(withdrawPendingTotal));
      setValue('amortization', numberFormat(amortizationTotal));
      setValue('withdrawStopOffset', numberFormat(withdrawStopOffsetTotal));
      setValue('ownTransactions', numberFormat(ownTransactionsTotal));
      setValue('billwithdraw', numberFormat(billwithdrawTotal));

      // 債務一覧表示セクション
      /**
       * 出金伝票データ取得APIレスポンスから出金明細一覧モデルへの変換
       */

      const convertToPaymentDetailsRowModel = (
        response: ScrTra0025GetPaymentDetailsResponse
      ): debtListRowModel[] => {
        return response.paymentDetailsList.map((x) => {
          return {
            // 番号
            id: x.paymentDetailsNumber,
            // 出金明細番号
            paymentDetailsNumber: x.paymentDetailsNumber,
            // 会計処理日
            accountingDate: x.accountingDate,
            // 出金種別
            paymentKind: x.paymentKind,
            // 出金元口座
            paymentSourceAccountName: x.paymentSourceAccountName,
            // 出金元口座ID
            paymentSourceAccountId: x.paymentSourceAccountId,
            // 出金額
            paymentAmount: numberFormat(x.paymentAmount),
            // 出金メモ
            paymentMemo: x.paymentMemo,
            // 出金FBデータ出力済フラグ
            paymentFbDataOutputFlag: x.paymentFbDataOutputFlag,
            // 出金元口座銀行名
            paymentSourcebankName:
              paymentDetailsDispValues.paymentSourcebankName,
            // 出金元口座支店名
            paymentSourcebranchName:
              paymentDetailsDispValues.paymentSourcebranchName,
          };
        });
      };

      // 債務一覧行データセット準備
      const debtistRowsValues = convertToPaymentDetailsRowModel(response);

      const detailsCount = Object.keys(debtistRowsValues).length;

      //１０行まで登録可能を条件とし、登録済の行を計算し、空き行があれば行を追加
      let index = detailsCount;
      while (10 > index++) {
        const str = {
          id: index,
          paymentDetailsNumber: 1,
          accountingDate: '',
          paymentKind: '0',
          paymentSourceAccountName: '',
          paymentSourceAccountId: '',
          paymentAmount: '',
          paymentMemo: '',
          paymentFbDataOutputFlag: false,
          paymentSourcebankName: paymentDetailsDispValues.paymentSourcebankName,
          paymentSourcebranchName:
            paymentDetailsDispValues.paymentSourcebranchName,
        };
        debtistRowsValues.push(str);
      }

      // 債務一覧行データセット
      setdebtListRowValues(debtistRowsValues);

      // 確定ボタン制御用、出金保留フラグセット
      let withdrawPendingFlg = '0';
      debtistRowsValues.forEach((x) => {
        if (x.paymentKind === '3') {
          withdrawPendingFlg = '1';
        }
      });
      sessionStorage.setItem('history_withdrawPendingFlg', withdrawPendingFlg);

      // リストボックス情報取得
      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const paymentKindRequest: ScrCom9999GetCodeManagementMasterRequest = {
        // 出金種別
        codeId: 'CDE-COM-0118',
      };
      // コード管理マスタ情報取得API呼び出し
      const paymentKindResponse = await ScrCom9999GetCodeManagementMaster(
        paymentKindRequest
      );
      // プルダウンからおまとめ以外の場合、出金止相殺を削除
      if (response.claimClassification !== 'おまとめ') {
        let index = 0;
        paymentKindResponse.searchGetCodeManagementMasterListbox.forEach(
          (x) => {
            // 出金止相殺
            if (x.codeName === '出金止相殺') {
              paymentKindResponse.searchGetCodeManagementMasterListbox.splice(
                index,
                1
              );
            }
            index++;
          }
        );
      }
      // プルダウンから自社IDフラグがfalseかつ出金種別が自社取引を削除
      if (response.ownCompanyFlag === false) {
        let index = 0;
        paymentKindResponse.searchGetCodeManagementMasterListbox.forEach(
          (x) => {
            // 自社取引
            if (x.codeName === '自社取引') {
              paymentKindResponse.searchGetCodeManagementMasterListbox.splice(
                index,
                1
              );
            }
            index++;
          }
        );
      }
      // 空白をセット
      const listStr = {
        // コード値
        codeValue: '0',
        // コード名称
        codeName: '',
      };

      paymentKindResponse.searchGetCodeManagementMasterListbox.unshift(listStr);
      // プルダウンにデータを設定
      setSelectValues({
        claimClassificatioSelectValues:
          CodeManagementSelectValuesModel(paymentKindResponse),
      });
    };
    initialize();
  }, []);
  // レンダリング後に動作するロジック2
  useEffect(() => {
    const initialize = () => {
      //リスト活性、非活性設定
      if (userEditPermission === true) {
        // 債務一覧リスト活性
        setdebtlistDisableFlg(false);
        // 出金保留確認
        if (
          (paymentDetailsDispValues.approvalStatus === '承認済' ||
            paymentDetailsDispValues.approvalStatus === '一部承認済') &&
          '0' === sessionStorage.getItem('history_withdrawPendingFlg')
        ) {
          //確定ボタン非活性
          setConfirmButtonDisableFlg(true);
        } else {
          //確定ボタン活性
          setConfirmButtonDisableFlg(false);
        }
      } else {
        // 債務一覧リスト非活性
        setdebtlistDisableFlg(true);
        //確定ボタン非活性
        setConfirmButtonDisableFlg(true);
      }
    };
    initialize();
  }, [userEditPermission]);

  // 行表示更新用
  const [count, setCount] = useState<number>(0);

  /**
   * 行が編集された時のイベントハンドラ
   */
  //  const HandlePaymentKindchange = async (row: any) => {
  const HandlePaymentKindchange = (row: any) => {
    initialDisplayFlg = 0;
    editFlg = 1;

    // 出金種別が銀行振込の場合、出金元口座銀行名 ＋出金元口座支店名を表示する。
    // 出金種別が銀行振込以外の場合、ブランクを表示する。
    if (row.paymentKind == '1') {
      row.paymentSourceAccountName =
        row.paymentSourcebankName + row.paymentSourcebranchName;
    } else {
      row.paymentSourceAccountName = '';
      row.paymentSourceAccountId = '';
    }

    row.paymentAmount = numberFormat(Number(removeComma(row.paymentAmount)));

    // 合計金額更新
    let bankTransferTotal = 0;
    let offsetAmountTotal = 0;
    let withdrawPendingTotal = 0;
    let billwithdrawTotal = 0;
    let cashdeliveryTotal = 0;
    let withdrawStopOffsetTotal = 0;
    let ownTransactionsTotal = 0;
    let amortizationTotal = 0;

    debtList_rows.forEach((x) => {
      if (x.paymentKind === '1') {
        bankTransferTotal += Number(removeComma(x.paymentAmount));
      }
      if (x.paymentKind === '2') {
        offsetAmountTotal += Number(removeComma(x.paymentAmount));
      }
      if (x.paymentKind === '3') {
        withdrawPendingTotal += Number(removeComma(x.paymentAmount));
      }
      if (x.paymentKind === '4') {
        billwithdrawTotal += Number(removeComma(x.paymentAmount));
      }
      if (x.paymentKind === '5') {
        cashdeliveryTotal += Number(removeComma(x.paymentAmount));
      }
      if (x.paymentKind === '6') {
        withdrawStopOffsetTotal += Number(removeComma(x.paymentAmount));
      }
      if (x.paymentKind === '7') {
        ownTransactionsTotal += Number(removeComma(x.paymentAmount));
      }
      if (x.paymentKind === '8') {
        amortizationTotal += Number(removeComma(x.paymentAmount));
      }
    });
    if (Number.isNaN(bankTransferTotal) === false) {
      setValue('bankTransfer', numberFormat(bankTransferTotal));
    }
    if (Number.isNaN(offsetAmountTotal) === false) {
      setValue('offsetAmount', numberFormat(offsetAmountTotal));
    }
    if (Number.isNaN(withdrawPendingTotal) === false) {
      setValue('withdrawPending', numberFormat(withdrawPendingTotal));
    }
    if (Number.isNaN(billwithdrawTotal) === false) {
      setValue('billwithdraw', numberFormat(billwithdrawTotal));
    }
    if (Number.isNaN(cashdeliveryTotal) === false) {
      setValue('cashdelivery', numberFormat(cashdeliveryTotal));
    }
    if (Number.isNaN(withdrawStopOffsetTotal) === false) {
      setValue('withdrawStopOffset', numberFormat(withdrawStopOffsetTotal));
    }
    if (Number.isNaN(ownTransactionsTotal) === false) {
      setValue('ownTransactions', numberFormat(ownTransactionsTotal));
    }
    if (Number.isNaN(amortizationTotal) === false) {
      setValue('amortization', numberFormat(amortizationTotal));
    }

    editCount++;
    setCount(editCount);
  };
  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleIconOutputCancelClick = () => {
    //編集中の場合はダイアログ表示
    if (1 === editFlg) {
      const messege = Format(getMessage('MSG-FR-INF-00005'), []);
      // ダイアログを表示
      setTitle(messege);
      setHandleDialog(true);
    } else {
      //編集項目無しの場合は出金一覧画面へ戻る
      navigate('/tra/payments');
    }
  };
  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleIconOutputConfirmClick = async () => {
    // TODO:grid行のバリデーション最終確認処理は、アーキで未実装のためgrid部品に実装後に再度調整
    // await trigger();
    // if (false === methods.formState.isValid) {
    //   return;
    // }

    // 1.明細入力件数チェック
    // 全明細の会計処理日が未入力の場合、エラー
    let detailCount = 0;
    //行数分ループ
    for (let index = 0; index < 10; index++) {
      if (debtList_rows[index].accountingDate !== '') {
        detailCount++;
      }
    }
    // ダイアログを表示して、確認ボタン後、画面へ戻る
    if (detailCount === 0) {
      const messege = Format(getMessage('MSG-FR-ERR-00040'), []);
      setTitleError(messege);
      setHandleDialogError(true);
      return;
    }

    // 2.会計処理日入力チェック
    // 会計処理日が入力されている場合、同一明細の出金種別・金額のいずれかが未入力の場合、エラー
    let errFlg = 0;
    // 行数分ループ
    for (let index = 0; index < 10; index++) {
      if (
        debtList_rows[index].accountingDate !== '' &&
        (debtList_rows[index].paymentKind === '0' ||
          Number.isNaN(
            Number(removeComma(debtList_rows[index].paymentAmount))
          ) === true)
      ) {
        errFlg = 1;
      }
      if (
        debtList_rows[index].accountingDate === '' &&
        (debtList_rows[index].paymentKind !== '0' ||
          Number.isNaN(
            Number(removeComma(debtList_rows[index].paymentAmount))
          ) === false)
      ) {
        errFlg = 1;
      }
    }
    // ダイアログを表示して、確認ボタン後、画面へ戻る
    if (errFlg === 1) {
      const messege = Format(getMessage('MSG-FR-ERR-00041'), []);
      setTitleError(messege);
      setHandleDialogError(true);
      return;
    }

    // 3.単項目チェック
    // 債務一覧セクションの項目に対して、単項目チェックを実施する。
    // バリデーションチェックにて対応済み

    // 4.債務金額差異チェック
    // 表示項目毎に合計金額を計算
    let debtAmountTotal = 0;
    debtAmountTotal += Number(removeComma(getValues('bankTransfer')));
    debtAmountTotal += Number(removeComma(getValues('offsetAmount')));
    debtAmountTotal += Number(removeComma(getValues('withdrawPending')));
    debtAmountTotal += Number(removeComma(getValues('billwithdraw')));
    debtAmountTotal += Number(removeComma(getValues('cashdelivery')));
    debtAmountTotal += Number(removeComma(getValues('withdrawStopOffset')));
    debtAmountTotal += Number(removeComma(getValues('ownTransactions')));
    debtAmountTotal += Number(removeComma(getValues('amortization')));

    //明細一覧の合計金額を計算
    let listAmountTotal = 0;
    debtList_rows.forEach((x) => {
      if (Number.isNaN(Number(removeComma(x.paymentAmount))) === false) {
        listAmountTotal += Number(removeComma(x.paymentAmount));
      }
    });

    // 出金伝票セクションの債務金額と債務一覧の合計金額に差異があった場合エラー
    if (debtAmountTotal !== listAmountTotal) {
      // ダイアログを表示して、確認ボタン後、画面へ戻る
      const messege = Format(getMessage('MSG-FR-ERR-00042'), []);
      setTitleError(messege);
      setHandleDialogError(true);
      return;
    }

    // 5.出金種別チェック
    // 活性
    // 同一の出金種別が入力されている場合エラー
    errFlg = 0;
    let zeroCount = 0;
    let inputCheckFlg = 0;
    const removeDuplicates = new Set();

    //行数分ループ
    for (let index = 0; index < 10; index++) {
      // 入力行が活性、かつ出金種別が選択済の出金種別の重複をチェック
      if (
        paymentKindDisableFlg[index + 1] === 0 &&
        debtList_rows[index].paymentKind !== '0'
      ) {
        removeDuplicates.add(debtList_rows[index].paymentKind);
      } else {
        zeroCount++;
      }
      // 6：出金止相殺、または、7：自社取引の明細がある場合、出金種別チェック対象とする。
      if (
        debtList_rows[index].paymentKind === '6' ||
        debtList_rows[index].paymentKind === '7'
      ) {
        inputCheckFlg = 1;
      }
    }
    // 重複件数があった場合エラー
    if (10 > zeroCount + removeDuplicates.size) {
      errFlg = 1;
    }
    //6：出金止相殺、または、7：自社取引が入力されていて、全明細数が１以外の場合エラー
    if (1 === inputCheckFlg && 1 !== removeDuplicates.size) {
      errFlg = 1;
    }

    // ダイアログを表示して、確認ボタン後、画面へ戻る
    if (errFlg === 1) {
      const messege = Format(getMessage('MSG-FR-ERR-00043'), []);
      setTitleError(messege);
      setHandleDialogError(true);
      return;
    }

    // 6.会計処理日チェック
    errFlg = 0;
    // 行数分ループ
    for (let index = 0; index < 10; index++) {
      // 会計処理日が入力されている場合、
      // 出金種別が1：銀行振込、会計処理日が過去日の場合エラー
      if (
        debtList_rows[index].accountingDate !== '' &&
        debtList_rows[index].paymentKind === '1' &&
        debtList_rows[index].accountingDate < taskDate
      ) {
        errFlg = 1;
      }
    }
    // ダイアログを表示して、確認ボタン後、画面へ戻る
    if (errFlg === 1) {
      const messege = Format(getMessage('MSG-FR-ERR-00045'), []);
      setTitleError(messege);
      setHandleDialogError(true);
      return;
    }

    // 出金伝票詳細入力チェックAPIリクエスト項目作成
    // 行データ整理
    const paymentDetailsListreq: PaymentDetailsListreq[] = debtList_rows.map(
      (x) => ({
        paymentDetailsNumber: x.paymentDetailsNumber,
        accountingDate: x.accountingDate,
        paymentKind: x.paymentKind,
        paymentSourceAccountName: x.paymentSourceAccountName,
        paymentSourceAccountId: x.paymentSourceAccountName,
        paymentAmount: Number(removeComma(x.paymentAmount)),
        paymentMemo: x.paymentMemo,
      })
    );

    // 行データから"日付が未入力の行を除外する
    // 行数分ループ
    for (let index = 9; index > 0; index--) {
      if (paymentDetailsListreq[index].accountingDate === '') {
        paymentDetailsListreq.splice(index, 1);
      }
    }

    // 明細番号振り直し

    for (
      let index = 0;
      index < Object.keys(paymentDetailsListreq).length;
      index++
    ) {
      paymentDetailsListreq[index].paymentDetailsNumber = index + 1;
    }

    // request項目セット
    const request: ScrTra0025CheckPaymentRequest = {
      debtNumber: debtNumber,
      paymentNumber: paymentDetailsDispValues.paymentNumber,
      paymentDetailsList: paymentDetailsListreq,
      changeTimestamp: paymentDetailsDispValues.changeTimestamp,
    };

    // 登録処理用にセッションストレージにリクエスト情報保存
    sessionStorage.setItem(
      'history_paymentDetailsListreq',
      JSON.stringify(paymentDetailsListreq)
    );
    sessionStorage.setItem(
      'history_changeTimestamp',
      paymentDetailsDispValues.changeTimestamp
    );

    // 出金伝票詳細入力チェックAPI呼び出し
    const response = await ScrTra0025CheckPayment(request);

    // 出金伝票詳細入力チェックAPIレスポンスからワーニングリストモデルへの変換
    const convertToWarningResult = (response: WarnList[]): warningList[] => {
      return response.map((x) => {
        return {
          warningCode: x.warnCode,
          warningMessage: x.warnMessage,
        };
      });
    };
    // 登録内容確認ポップアップ呼び出し前の準備
    const convertWarn = convertToWarningResult(response.warnList);
    setWarningResult(convertWarn);
    setErrorResult(response.errorList);

    setScrCom0032PopupData({
      errorList: errorResult,
      warningList: warningResult,
      changeExpectDate: today,
      registrationChangeList: [
        {
          screenId: 'SCR-TRA-0025',
          // 画面名
          screenName: '出金詳細',
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
  };

  /**
   * 登録内容確認ポップアップ確定クリック時のイベントハンドラ
   */
  const scrCom0033handleConfirm = async () => {
    // request項目設定
    // セッションストレージから出金番号、変更タイムスタンプリスト取得
    // 出金番号リストはJson型で保存していた値を配列に変換
    const request: ScrTra0025registrationPaymentRequest = {
      debtNumber: debtNumber,
      paymentNumber: paymentDetailsDispValues.paymentNumber,
      // 出金明細一覧
      paymentDetailsList: JSON.parse(
        sessionStorage.getItem('history_paymentDetailsListreq') || ''
      ),
      changeTimestamp: sessionStorage.getItem('history_changeTimestamp'),
    };

    // 登録内容申請ポップアップクローズ
    setScrCom0033PopupIsOpen(false);
    // 出金伝票明細登録API呼び出し
    await ScrTra0025registrationpayment(request);
  };

  /**
   * 登録内容確認（ポップアップ）承認申請ボタン押下時のイベントハンドラ
   */
  const handleApprovalConfirm = (registrationChangeMemo: string) => {
    setRegistrationChangeMemo(registrationChangeMemo);
    setScrCom0032PopupIsOpen(false);
    setScrCom0033PopupIsOpen(true);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handleRegistConfirm = (registrationChangeMemo: string) => {
    setRegistrationChangeMemo(registrationChangeMemo);
    setScrCom0032PopupIsOpen(false);
    setScrCom0033PopupIsOpen(true);
  };

  // カンマ除去関数
  const removeComma = (number: string) => {
    const removed = number.replace(/,/g, '');
    return parseInt(removed, 10);
  };

  // 確定ボタン後のダイアログ処理エラーメッセージ後
  const handleDialogConfirmError = () => {
    // ダイアログを閉じる
    setHandleDialogError(false);
  };

  //編集項目破棄確認OKの場合
  const handleDialogConfirm = () => {
    // 出金一覧画面へ戻る
    navigate('/tra/payments');
  };

  //編集項目破棄確認キャンセルの場合
  const handleDialogCancel = () => {
    // ダイアログを閉じる
    setHandleDialog(false);
  };

  // button (ダイアログ(メッセージポップアップ)用)
  const dialogButtons = [
    { name: 'OK', onClick: handleDialogConfirm },
    { name: 'キャンセル', onClick: handleDialogCancel },
  ];

  // button (ダイアログ(メッセージポップアップ)用)
  const dialogButtonsError = [
    { name: 'OK', onClick: handleDialogConfirmError },
  ];

  // 初期表示時の債務一覧セクションのカラム毎の活性、非活性設定
  const handleGetCellDisabled = (params: any) => {
    // 編集時の非活性フラグを設定
    if (initialDisplayFlg === 0) {
      if (
        params.field === 'accountingDate' &&
        accountingDateDisableFlg[params.id] === 1
      ) {
        return true;
      }
      if (
        params.field === 'paymentKind' &&
        paymentKindDisableFlg[params.id] === 1
      ) {
        return true;
      }
      if (
        params.field === 'paymentAmount' &&
        paymentAmountDisableFlg[params.id] === 1
      ) {
        return true;
      }
      if (
        params.field === 'paymentMemo' &&
        paymentMemoDisableFlg[params.id] === 1
      ) {
        return true;
      }
    }

    // 初期表示時の非活性状態保存
    if (initialDisplayFlg === 1) {
      // 会計処理日の活性、非活性設定
      // 出金種別が相殺金額または最初から自社取引で設定済の場合
      if (params.field === 'accountingDate' && params.row.paymentKind === '2') {
        accountingDateDisableFlg[params.id] = 1;
        return true;
      }
      if (params.field === 'accountingDate' && params.row.paymentKind === '7') {
        accountingDateDisableFlg[params.id] = 1;
        return true;
      }
      if (
        (params.field === 'accountingDate' &&
          paymentDetailsDispValues.approvalStatus === '承認依頼中') ||
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        accountingDateDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'accountingDate' &&
        params.row.paymentKind === '4' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        accountingDateDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'accountingDate' &&
        params.row.paymentKind === '5' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        accountingDateDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'accountingDate' &&
        params.row.paymentKind === '6' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        accountingDateDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'accountingDate' &&
        params.row.paymentKind === '7' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        accountingDateDisableFlg[params.id] = 1;
        return true;
      }

      // 出金種別の活性、非活性設定
      // 出金種別が相殺金額、償却または最初から自社取引で設定済の場合
      if (params.field === 'paymentKind' && params.row.paymentKind === '2') {
        paymentKindDisableFlg[params.id] = 1;
        return true;
      }
      if (params.field === 'paymentKind' && params.row.paymentKind === '7') {
        paymentKindDisableFlg[params.id] = 1;
        return true;
      }
      if (params.field === 'paymentKind' && params.row.paymentKind === '8') {
        paymentKindDisableFlg[params.id] = 1;
        return true;
      }
      if (
        (params.field === 'paymentKind' &&
          paymentDetailsDispValues.approvalStatus === '承認依頼中') ||
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentKindDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentKind' &&
        params.row.paymentKind === '4' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentKindDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentKind' &&
        params.row.paymentKind === '5' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentKindDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentKind' &&
        params.row.paymentKind === '6' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentKindDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentKind' &&
        params.row.paymentKind === '7' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentKindDisableFlg[params.id] = 1;
        return true;
      }

      // 金額の活性、非活性設定
      // 出金種別が相殺金額、償却または最初から自社取引で設定済の場合
      if (params.field === 'paymentAmount' && params.row.paymentKind === '2') {
        paymentAmountDisableFlg[params.id] = 1;
        return true;
      }
      if (params.field === 'paymentAmount' && params.row.paymentKind === '7') {
        paymentAmountDisableFlg[params.id] = 1;
        return true;
      }
      if (
        (params.field === 'paymentAmount' &&
          paymentDetailsDispValues.approvalStatus === '承認依頼中') ||
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentAmountDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentAmount' &&
        params.row.paymentKind === '4' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentAmountDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentAmount' &&
        params.row.paymentKind === '5' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentAmountDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentAmount' &&
        params.row.paymentKind === '6' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentAmountDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentAmount' &&
        params.row.paymentKind === '7' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentAmountDisableFlg[params.id] = 1;
        return true;
      }

      // メモの活性、非活性設定
      // 出金種別が相殺金額、償却または最初から自社取引で設定済の場合
      if (params.field === 'paymentMemo' && params.row.paymentKind === '2') {
        paymentMemoDisableFlg[params.id] = 1;
        return true;
      }
      if (params.field === 'paymentMemo' && params.row.paymentKind === '7') {
        paymentMemoDisableFlg[params.id] = 1;
        return true;
      }
      if (
        (params.field === 'paymentMemo' &&
          paymentDetailsDispValues.approvalStatus === '承認依頼中') ||
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentMemoDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentMemo' &&
        params.row.paymentKind === '4' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentMemoDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentMemo' &&
        params.row.paymentKind === '5' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentMemoDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentMemo' &&
        params.row.paymentKind === '6' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentMemoDisableFlg[params.id] = 1;
        return true;
      }
      if (
        params.field === 'paymentMemo' &&
        params.row.paymentKind === '7' &&
        paymentDetailsDispValues.approvalStatus === '承認済'
      ) {
        paymentMemoDisableFlg[params.id] = 1;
        return true;
      }
    }

    return false;
  };
  /**
   * 出金明細画面描画処理
   */
  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          {/* 出金伝票情報表示セクション*/}
          <Section name='出金伝票情報'>
            <Grid container width={1690}>
              <FormProvider {...methods}>
                <Grid item xs={2}>
                  <TextField label='法人ID' name='corporationId' readonly />
                  <TextField label='取引区分' name='dealKind' readonly />
                  <TextField size='s' label='車名' name='carName' readonly />
                </Grid>
                <Grid item xs={2}>
                  <TextField label='法人名' name='corporationName' readonly />
                  <TextField label='会場名' name='placeName' readonly />
                  <TextField
                    label='請求種別'
                    name='claimClassification'
                    readonly
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField label='請求先ID' name='billingId' readonly />
                  <TextField label='開催日' name='sessionDate' readonly />
                  <TextField label='債務番号' name='debtNumber' readonly />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label='即支払可否'
                    name='immediatePaymentFlag'
                    readonly
                  />
                  <TextField label='開催回数' name='auctionCount' readonly />
                  <TextField label='債務金額' name='debtAmount' readonly />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label='即時出金限度額'
                    name='immediatePaymentLimitAmount'
                    readonly
                  />
                  <TextField label='出品番号' name='exhibitNumber' readonly />
                  <TextField
                    label='承認ステータス'
                    name='approvalStatus'
                    readonly
                  />
                </Grid>
              </FormProvider>
            </Grid>
          </Section>
          {/* 合計金額表示セクション */}
          <Section name='合計金額'>
            <Grid container width={1690}>
              <FormProvider {...methods}>
                <Grid item xs={2}>
                  <TextField
                    size='s'
                    label='銀行振込'
                    name='bankTransfer'
                    readonly
                  />
                  <TextField
                    label='出金止相殺'
                    name='withdrawStopOffset'
                    readonly
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField label='相殺金額' name='offsetAmount' readonly />
                  <TextField label='自社取引' name='ownTransactions' readonly />
                </Grid>
                <Grid item xs={2}>
                  <TextField label='出金保留' name='withdrawPending' readonly />
                  <TextField label='償却' name='amortization' readonly />
                </Grid>
                <Grid item xs={2}>
                  <TextField label='手振出金' name='billwithdraw' readonly />
                </Grid>
                <Grid item xs={2}>
                  <TextField label='現金手渡' name='cashdelivery' readonly />
                </Grid>
              </FormProvider>
            </Grid>
          </Section>
          {/* 債務一覧表示セクション */}
          <Section name='債務一覧'>
            <Grid>
              <DataGrid
                disabled={debtListDisableFlg}
                columns={debtLists_columns}
                rows={debtList_rows}
                getSelectValues={handleGetSelectValues}
                onRowValueChange={(row) => HandlePaymentKindchange(row)}
                resolver={debtListSchema}
                getCellDisabled={handleGetCellDisabled}
                //onCellBlur={handleOnCellBlur}
              />
            </Grid>
          </Section>
        </MainLayout>
        {/* bottom */}

        <MainLayout bottom>
          <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
            <CancelButton onClick={handleIconOutputCancelClick}>
              キャンセル
            </CancelButton>
            <ConfirmButton
              onClick={handleIconOutputConfirmClick}
              disable={confirmButtonDisableFlg}
            >
              確定
            </ConfirmButton>
          </MarginBox>
        </MainLayout>
      </MainLayout>
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
          data={{ screenId: 'SCR-TRA-0025', tabId: 0, applicationMoney: 0 }}
          handleCancel={() => setScrCom0033PopupIsOpen(false)}
          handleConfirm={scrCom0033handleConfirm}
        />
      ) : (
        ''
      )}
      {/* ダイアログ */}
      {handleDialog ? (
        <Dialog open={handleDialog} title={title} buttons={dialogButtons} />
      ) : (
        ''
      )}
      {/* エラーダイアログ */}
      {handleDialogError ? (
        <Dialog
          open={handleDialogError}
          title={titleError}
          buttons={dialogButtonsError}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrTra0025Page;
