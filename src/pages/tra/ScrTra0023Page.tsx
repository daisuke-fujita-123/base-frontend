import React, { useContext, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton, SearchButton } from 'controls/Button';
import { DataGrid, GridColDef, GridHrefsModel } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { ContentsDivider } from 'controls/Divider';
import { Select, SelectValue } from 'controls/Select';
import { Table, TableColDef, TableRowModel } from 'controls/Table';
import { TextField } from 'controls/TextField';
import { SerchLabelText } from 'controls/Typography';

import {
  ScrTra0023SearchWithdraws,
  ScrTra0023SearchWithdrawsRequest,
  ScrTra0023SearchWithdrawsResponse,
} from 'apis/tra/ScrTra0023Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

/** 検索項目のバリデーション */
const searchConditionSchema = {
  // 入力日（From）
  accountingDateFrom: yup.date().max(10).label('利用開始日（From）'),
  // 入力日（To）
  accountingDateTo: yup.date().max(10).label('利用開始日（To）'),
  // 入金口座種別
  debtNumber: yup.string().max(12).label('債務番号'),
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
  //承認ステータス
  approvalStatus: string;
  //債務番号
  debtNumber: string;
  //契約ID
  contractId: string;
  //法人ID
  corporationId: string;
  //請求先ID
  billingId: string;
}

/**
 * 検索条件初期データ
 */
const initialValues: SearchConditionModel = {
  accountingDateFrom: '',
  accountingDateTo: '',
  claimClassification: '',
  paymentKind: '',
  approvalStatus: '',
  debtNumber: '',
  contractId: '',
  corporationId: '',
  billingId: '',
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
  withdrawHold: string;
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
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'accountingDate',
    headerName: '会計処理日',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'corporationId',
    headerName: '法人ID',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'corporationName',
    headerName: '法人名',
    cellType: 'link',
    size: 'l',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    cellType: 'link',
    size: 's',
  },
  {
    field: 'debtAmount',
    headerName: '債務金額',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'bankTransfer',
    headerName: '銀行振込',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'offsetAmount',
    headerName: '相殺金額',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'withdrawHold',
    headerName: '出金保留',
    cellType: 'link',
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

// private function
const fnAttachSearchCondtionLabels = (
  attach: (label: string, value: string) => void,
  dto: SearchConditionModel
): void => {
  attach('会計処理日(From)', dto.accountingDateFrom);
  attach('会計処理日(To)', dto.accountingDateTo);
  attach('請求種別', dto.claimClassification);
  attach('出金種別', dto.paymentKind);
  attach('承認ステータス', dto.approvalStatus);
  attach('債務番号', dto.debtNumber);
  attach('契約ID', dto.contractId);
  attach('法人ID', dto.corporationId);
  attach('請求先ID', dto.billingId);
};

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  claimClassificationSelectValues: SelectValue[];
  paymentKindSelectValues: SelectValue[];
  approvalStatusSelectValues: SelectValue[];
  contractIdSelectValues: SelectValue[];
  corporationIdSelectValues: SelectValue[];
  billingIdSelectValues: SelectValue[];
  changeHistoryNumberSelectValues: SelectValue[];
}

/**
 * 検索条件選択値初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  claimClassificationSelectValues: [],
  paymentKindSelectValues: [],
  approvalStatusSelectValues: [],
  contractIdSelectValues: [],
  corporationIdSelectValues: [],
  billingIdSelectValues: [],
  changeHistoryNumberSelectValues: [],
};

/**
 * 出金一覧検索APIレスポンスから検索結果モデルへの変換
 */

const convertToSearchResultRowModel = (
  response: ScrTra0023SearchWithdrawsResponse
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
      debtAmount: x.debtAmount,
      bankTransfer: x.bankTransfer,
      offsetAmount: x.offsetAmount,
      withdrawHold: x.withdrawHold,
    };
  });
};

/**
 * 検索条件モデルから出金一覧検索APIリクエストへの変換
 */

const convertFromSearchConditionModel = (
  searchCondition: SearchConditionModel
): ScrTra0023SearchWithdrawsRequest => {
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

    sortKey: '', // TODO 設定処理
    sortDirection: '', // TODO 設定処理
    limit: 100, // TODO 設定処理
    offset: 0, // TODO 設定処理
  };
};

/**
 * SCR-TRA-0023 出金一覧画面
 *
 */
const ScrTra0023Page = () => {
  <h1>SCR-TRA-0023 出金一覧</h1>;

  // context
  const { saveState, loadState } = useContext(AppContext);

  const prevValues = loadState();

  // form
  const methods = useForm<SearchConditionModel>({
    defaultValues: prevValues === undefined ? initialValues : prevValues,
    resolver: yupResolver(yup.object(searchConditionSchema)),
    context: false,
  });
  const { getValues } = methods;

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const [openSection, setOpenSection] = useState<boolean>(true);

  // router
  const navigate = useNavigate();

  //selectフォーム表示値の取得
  // useEffect(() => {
  //   const initialize = async () => {
  //     // TODO: 直接apiClientを使用しない
  //     const codeValues = (await traApiClient.post('/scr/get-code-values')).data;
  //     setSelectValues({
  //       claimClassificationSelectValues: codeValues.claimClassification,
  //     });
  //   };
  //   initialize();
  // }, []);

  /**
   * 検索ボタンクリック時のイベントハンドラ
   */
  const handleSearchClick = async () => {
    const request = convertFromSearchConditionModel(getValues());
    const response = await ScrTra0023SearchWithdraws(request);
    const searchResult = convertToSearchResultRowModel(response);

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

    setSearchResult(searchResult);
    setHrefs(hrefs);
    setOpenSection(false);
  };

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };
  /**
   * 帳票出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputReportClick = () => {
    alert('TODO：帳票選択ポップアップ画面を表示する。');
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    alert('TODO：検索結果からCSVを出力する。');
  };

  /**
   * 債務トラン、出金明細トランからの取得値、画面作成時ダミーデータ
   */
  const debtAmountTotal = '111,111,111';
  const bankTransfer = '222,222,222';
  const OffsetAmount = '333,333,333';
  const withdrawPending = '444,444,444';
  const billwithdraw = '555,555,555';
  const cashdelivery = '666,666,666';
  const withdrawStopOffset = '777,777,777';
  const ownTransactions = '888,888,888';
  const amortization = '999,999,999';

  //テーブル定義1
  const table1_columns: TableColDef[] = [
    { field: 'debtAmountTotal', headerName: '債務金額', width: 150 },
  ];
  const table1_rows: TableRowModel[] = [{ debtAmountTotal }];

  //テーブル定義2
  const table2_columns: TableColDef[] = [
    { field: 'bankTransfer', headerName: '銀行振込', width: 150 },
    { field: 'OffsetAmount', headerName: '相殺金額', width: 150 },
    { field: 'withdrawPending', headerName: '出金保留', width: 150 },
    { field: 'billwithdraw', headerName: '手振出金', width: 150 },
    { field: 'cashdelivery', headerName: '現金手渡', width: 150 },
    { field: 'withdrawStopOffset', headerName: '出金止相殺', width: 150 },
    { field: 'ownTransactions', headerName: '自社取引', width: 150 },
    { field: 'amortization', headerName: '償却', width: 150 },
  ];
  const table2_rows: TableRowModel[] = [
    {
      bankTransfer: bankTransfer,
      OffsetAmount: OffsetAmount,
      withdrawPending: withdrawPending,
      billwithdraw: billwithdraw,
      cashdelivery: cashdelivery,
      withdrawStopOffset: withdrawStopOffset,
      ownTransactions: ownTransactions,
      amortization: amortization,
    },
  ];

  /**
   * Sectionを閉じた際のラベル作成
   */
  const serchLabels = serchData.map((val, index) => {
    const nameVal = getValues(val.name);
    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });
  // TODO 暫定処理
  saveState(methods.getValues());
  // setOpenSection(false);

  //実装未完成メモ
  //遷移元による入力項目の活性、非活性制御
  //元帳一覧からの遷移の場合：活性

  //ワークリストからの遷移の場合：非活性
  //検索条件を折り畳み時、検索条件を項目表示
  //日付のバリデーションがまだ不安定
  //API呼び出しからの応答部分でエラーが出ている

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
              //open={openSection}
            >
              <Grid container width={1690}>
                <Grid item xs={4}>
                  <FromTo label='利用開始日'>
                    <DatePicker name='accountingDateFrom' />
                    <DatePicker name='accountingDateTo' />
                  </FromTo>
                  <Grid item xs={2}>
                    <TextField label='債務番号' name='debtNumber' />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    label='請求種別'
                    name='claimClassification'
                    selectValues={selectValues.claimClassificationSelectValues}
                    blankOption
                  />

                  <Grid item xs={2}>
                    <Select
                      label='契約ID'
                      name='approvalStatus'
                      selectValues={selectValues.contractIdSelectValues}
                      blankOption
                    />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    label='出金種別'
                    name='paymentKind'
                    selectValues={selectValues.paymentKindSelectValues}
                    blankOption
                  />
                  <Grid item xs={2}>
                    <Select
                      label='法人ID/法人名'
                      name='corporationId'
                      selectValues={selectValues.corporationIdSelectValues}
                      blankOption
                    />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    label='承認ステータス'
                    name='approvalStatus'
                    selectValues={selectValues.corporationIdSelectValues}
                    blankOption
                  />
                  <Grid item xs={2}>
                    <Select
                      label='請求先ID'
                      name='billingId'
                      selectValues={selectValues.billingIdSelectValues}
                      blankOption
                    />
                  </Grid>
                </Grid>
              </Grid>

              <ContentsDivider />
              <CenterBox>
                <SearchButton
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
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                <AddButton onClick={handleIconOutputReportClick}>
                  帳票出力
                </AddButton>
              </MarginBox>
            }
          >
            {/* 債務金額テーブル */}
            <Grid container width={240}>
              <FormProvider {...methods}>
                <Section>
                  <Table columns={table1_columns} rows={table1_rows} />
                </Section>
              </FormProvider>
            </Grid>
            {/* 銀行振込～テーブル */}
            <Grid container width={1200}>
              <FormProvider {...methods}>
                <Section>
                  <Table columns={table2_columns} rows={table2_rows} />
                </Section>
              </FormProvider>
            </Grid>
            <DataGrid
              columns={searchResultColumns}
              rows={searchResult}
              hrefs={hrefs}
              pagination
              onLinkClick={handleLinkClick}
              checkboxSelection
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrTra0023Page;
