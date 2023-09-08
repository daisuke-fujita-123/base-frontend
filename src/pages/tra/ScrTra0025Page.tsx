import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { GridHrefsModel } from 'controls/Datagrid';
import { Table, TableColDef, TableRowModel } from 'controls/Table';
import { TextField } from 'controls/TextField';

import {
  ScrTra0025GetPaymentDetails,
  ScrTra0025GetPaymentDetailsRequest,
  ScrTra0025GetPaymentDetailsResponse,
} from 'apis/tra/ScrTra0025Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

//数字のカンマ区切り書式
const numberFormat = (num: number): string => {
  return num.toLocaleString();
};
const accountingDate: string[] = [
  '2023/08/01',
  '2023/08/02',
  '2023/08/03',
  '2023/08/04',
  '2023/08/05',
  '2023/08/06',
  '2023/08/07',
  '2023/08/08',
  '2023/08/09',
  '2023/08/10',
];
const paymentKind: string[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '1',
];
const paymentSourceAccountName: string[] = [
  '三菱UFJ銀行新宿支店1',
  '三菱UFJ銀行新宿支店2',
  '三菱UFJ銀行新宿支店3',
  '三菱UFJ銀行新宿支店4',
  '三菱UFJ銀行新宿支店5',
  '三菱UFJ銀行新宿支店6',
  '三菱UFJ銀行新宿支店7',
  '三菱UFJ銀行新宿支店8',
  '三菱UFJ銀行新宿支店9',
  '三菱UFJ銀行新宿支店10',
];
const paymentAmount: string[] = [
  '100,000',
  '200,000',
  '300,000',
  '400,000',
  '500,000',
  '500,000',
  '500,000',
  '500,000',
  '500,000',
  '500,000',
];
const paymentMemo: string[] = [
  'メモです1',
  'メモです2',
  'メモです3',
  'メモです4',
  'メモです5',
  'メモです6',
  'メモです7',
  'メモです8',
  'メモです9',
  'メモです10',
];

//テーブル定義
const debtLists_columns: TableColDef[] = [
  { field: 'accountingDate', headerName: '会計処理日', width: 150 },
  { field: 'paymentKind', headerName: '出金種別', width: 150 },
  { field: 'paymentSourceAccountName', headerName: '出金元口座', width: 300 },
  { field: 'paymentAmount', headerName: '金額', width: 150 },
  { field: 'paymentMemo', headerName: 'メモ', width: 600 },
];
const debtLists_rows: TableRowModel[] = [
  {
    accountingDate: accountingDate[0],
    paymentKind: paymentKind[0],
    paymentSourceAccountName: paymentSourceAccountName[0],
    paymentAmount: paymentAmount[0],
    paymentMemo: paymentMemo[0],
  },
  {
    accountingDate: accountingDate[1],
    paymentKind: paymentKind[1],
    paymentSourceAccountName: paymentSourceAccountName[1],
    paymentAmount: paymentAmount[1],
    paymentMemo: paymentMemo[1],
  },
  {
    accountingDate: accountingDate[2],
    paymentKind: paymentKind[2],
    paymentSourceAccountName: paymentSourceAccountName[2],
    paymentAmount: paymentAmount[2],
    paymentMemo: paymentMemo[2],
  },
  {
    accountingDate: accountingDate[3],
    paymentKind: paymentKind[3],
    paymentSourceAccountName: paymentSourceAccountName[3],
    paymentAmount: paymentAmount[3],
    paymentMemo: paymentMemo[3],
  },
  {
    accountingDate: accountingDate[4],
    paymentKind: paymentKind[4],
    paymentSourceAccountName: paymentSourceAccountName[4],
    paymentAmount: paymentAmount[4],
    paymentMemo: paymentMemo[4],
  },
  {
    accountingDate: accountingDate[5],
    paymentKind: paymentKind[5],
    paymentSourceAccountName: paymentSourceAccountName[5],
    paymentAmount: paymentAmount[5],
    paymentMemo: paymentMemo[5],
  },
  {
    accountingDate: accountingDate[6],
    paymentKind: paymentKind[6],
    paymentSourceAccountName: paymentSourceAccountName[6],
    paymentAmount: paymentAmount[6],
    paymentMemo: paymentMemo[6],
  },
  {
    accountingDate: accountingDate[7],
    paymentKind: paymentKind[7],
    paymentSourceAccountName: paymentSourceAccountName[7],
    paymentAmount: paymentAmount[7],
    paymentMemo: paymentMemo[7],
  },
  {
    accountingDate: accountingDate[8],
    paymentKind: paymentKind[8],
    paymentSourceAccountName: paymentSourceAccountName[8],
    paymentAmount: paymentAmount[8],
    paymentMemo: paymentMemo[8],
  },
  {
    accountingDate: accountingDate[9],
    paymentKind: paymentKind[9],
    paymentSourceAccountName: paymentSourceAccountName[9],
    paymentAmount: paymentAmount[9],
    paymentMemo: paymentMemo[9],
  },
];

/**
 * キャンセルボタンクリック時のイベントハンドラ
 */
const handleIconOutputCancelClick = () => {
  alert('TODO：キャンセルボタンが押されました。');
};
/**
 * 確定ボタンクリック時のイベントハンドラ
 */
const handleIconOutputConfirmClick = () => {
  alert('TODO：確定ボタンが押されました。');
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
}

/** 債務一覧リストのデータモデル */
interface PaymentDetailsListModel {
  // 出金明細番号
  paymentDetailsNumber: number;
  // 会計処理日
  accountingDate: string;
  // 出金種別
  paymentKind: string;
  // 出金元口座
  paymentSourceAccount: string;
  // 出金元口座ID
  paymentSourceAccountId: string;
  // 出金額
  paymentAmount: string;
  // 出金メモ
  paymentMemo: string;
  // 出金FBデータ出力済フラグ
  paymentFbDataOutputFlag: string;
}

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

/**
 * 出金一覧検索APIレスポンスから出金伝票表示モデルへの変換
 */
const convertToPaymentDetailsDispModel = (
  model: ScrTra0025GetPaymentDetailsResponse
): PaymentDetailsDispModel => {
  return {
    corporationId: model.corporationId,
    corporationName: model.corporationName,
    billingId: model.billingId,
    immediatePaymentFlag: model.immediatePaymentFlag,
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
  };
};

/**
 * 出金伝票検索APIレスポンスから出金明細一覧モデルへの変換
 */
const convertToPaymentDetailsListModel = (
  response: ScrTra0025GetPaymentDetailsResponse
): PaymentDetailsListModel[] => {
  return response.paymentDetailsList.map((x) => {
    return {
      // 出金明細番号
      paymentDetailsNumber: x.paymentDetailsNumber,
      // 会計処理日
      accountingDate: x.accountingDate,
      // 出金種別
      paymentKind: x.paymentKind,
      // 出金元口座
      paymentSourceAccount: x.paymentSourceAccount,
      // 出金元口座ID
      paymentSourceAccountId: x.paymentSourceAccountId,
      // 出金額
      paymentAmount: numberFormat(x.paymentAmount),
      // 出金メモ
      paymentMemo: x.paymentMemo,
      // 出金FBデータ出力済フラグ
      paymentFbDataOutputFlag: x.paymentFbDataOutputFlag,
    };
  });
};

//TODO:編集権限なしの場合
//確定ボタン非活性
//テーブル内非活性

/**
 * SCR-TRA-0025 出金詳細画面
 */
const ScrTra0025Page = () => {
  <h1>SCR-TRA-0025 出金一覧</h1>;
  //const { getValues, setValue, reset, trigger } = methods;
  // router
  const navigate = useNavigate();
  const location = useLocation();

  // 初期表示時
  // 出金詳細データ取得API / API-TRA-0025-0001
  const param: ScrTra0025GetPaymentDetailsRequest = {
    /** 債務番号 */
    debtNumber: '1234',
  };

  // 出金伝票情報セクションの各種値
  const [paymentDetailsDispValues, setPaymentDetailsDispValues] =
    useState<PaymentDetailsDispModel>({
      corporationId: '1111',
      corporationName: 'yamada',
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
    });

  // 出金明細一覧セクション
  const [detailsListRowsValues, setpaymentDetailsListRowsValues] = useState<
    PaymentDetailsListModel[]
  >([]);

  // 法人ID
  useEffect(() => {
    const initialize = async () => {
      const request = convertGetPaymentDetailsModel(param);
      const response = await ScrTra0025GetPaymentDetails(request);

      //出金伝票表示クション
      const paymentDetailsDispValues =
        convertToPaymentDetailsDispModel(response);
      setPaymentDetailsDispValues(paymentDetailsDispValues);

      // 出金明細一覧セクション
      const paymentDetailsListRowsValues =
        convertToPaymentDetailsListModel(response);
      setpaymentDetailsListRowsValues(paymentDetailsListRowsValues);

      //setValue('corporationId', '111');
    };
    initialize();
  }, []);

  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const [openSection, setOpenSection] = useState<boolean>(true);
  // context
  const { saveState, loadState } = useContext(AppContext);

  const prevValues = loadState();

  /**
   * 検索条件データモデル
   */
  interface WithdrawDetailReceipt {
    debtNumber: string;
  }
  /**
   * 検索条件初期データ
   */
  const initialValues: WithdrawDetailReceipt = {
    debtNumber: '',
    //changeHistoryNumber: '',
  };
  /**
   * 検索条件初期データ
   */
  const debtNumber = '111111111';
  // form
  const methods = useForm<WithdrawDetailReceipt>({
    defaultValues: prevValues === undefined ? initialValues : prevValues,
    // resolver: yupResolver(validationSchama),
    context: false,
  });
  const { getValues } = methods;
  // TODO 暫定処理
  saveState(methods.getValues());
  return (
    <MainLayout>
      {/* main */}
      <MainLayout main>
        {/* 出金詳細セクション */}
        <Section name='出金伝票情報'>
          <Grid container width={1690}>
            <FormProvider {...methods}>
              <Grid item xs={2}>
                <TextField
                  label='法人ID'
                  name='corporationId'
                  value={paymentDetailsDispValues.corporationId}
                  readonly
                />
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
                <TextField label='開催回数' name='sessionCount' readonly />
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
        {/* 合計金額セクション */}
        <Section name='合計金額'>
          <Grid container width={1690}>
            <FormProvider {...methods}>
              <Grid item xs={2}>
                <TextField
                  size='s'
                  label='銀行振込'
                  name='corporationId'
                  readonly
                />

                <TextField label='自社取引' name='ownTransactions' readonly />
              </Grid>
              <Grid item xs={2}>
                <TextField label='相殺金額' name='OffsetAmount' readonly />
                <TextField
                  label='出金止相殺'
                  name='withdrawStopOffset'
                  readonly
                />
              </Grid>
              <Grid item xs={2}>
                <TextField label='出金保留' name='withdrawPending' readonly />
                <TextField label='償却' name='OffsetAmount' readonly />
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
        <Section name='債務一覧'>
          <Grid container width={1690}>
            {/* 銀行振込～テーブル */}
            <Grid container width={1200}>
              <FormProvider {...methods}>
                <Section>
                  <Table columns={debtLists_columns} rows={debtLists_rows} />
                </Section>
              </FormProvider>
            </Grid>
          </Grid>
        </Section>
      </MainLayout>
      {/* bottom */}

      <MainLayout bottom>
        <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
          <CancelButton
            onClick={handleIconOutputCancelClick}
            //disable={cancelButtonDisableFlg}
          >
            キャンセル
          </CancelButton>
          <ConfirmButton
            onClick={handleIconOutputConfirmClick}
            //disable={confirmButtonDisableFlg}
          >
            確定
          </ConfirmButton>
        </MarginBox>
      </MainLayout>
    </MainLayout>
  );
};

export default ScrTra0025Page;
