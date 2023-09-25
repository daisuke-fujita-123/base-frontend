import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0011Popup from 'pages/com/popups/ScrCom0011Popup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack } from 'layouts/Stack';

import {
  AddButton,
  OutputButton,
  PrintButton,
  SearchButton,
} from 'controls/Button';
import { DataGrid, GridColDef, GridHrefsModel } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { Dialog } from 'controls/Dialog';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';
import { theme } from 'controls/theme';
import { SerchLabelText } from 'controls/Typography';

import {
  ResultList,
  ScrCom9999getCodeManagementMasterMultiple,
  ScrCom9999GetPlaceMaster,
  ScrCom9999GetPlaceMasterRequest,
} from 'apis/com/ScrCom9999Api';
import {
  ScrDoc0001BatchInfoAcquisition,
  ScrDoc0001ContractIdSearch,
  ScrDoc0001ContractIdSearchRequest,
  ScrDoc0001DocArrivesApply,
  ScrDoc0001DocArrivesApplyRequest,
  ScrDoc0001DocListAcquisition,
  ScrDoc0001DocListAcquisitionRequest,
  ScrDoc0001LogisticsBaseNameSearch,
  ScrDoc0001LogisticsBaseNameSearchRequest,
  ScrDoc0001OutputDocReport,
  ScrDoc0001OutputDocReportRequest,
} from 'apis/doc/ScrDoc0001Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';
import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

import { ThemeProvider } from '@mui/material';

// 定数定義
const SCR_DOC_0001 = 'SCR-MEM-0001'; // 自画面
const CDE_COM_0066 = 'CDE-COM-0066'; // オークション種類リスト
const CDE_COM_0080 = 'CDE-COM-0080'; // 通知種類リスト
const CDE_COM_0124 = 'CDE-COM-0124'; // 車種リスト
const CDE_COM_0068 = 'CDE-COM-0068'; // 到着ステータスリスト
const CDE_COM_0072 = 'CDE-COM-0072'; // 発送ステータスリスト
const CDE_COM_0070 = 'CDE-COM-0070'; // 入金ステータスリスト
const CDE_COM_0071 = 'CDE-COM-0071'; // 名変ステータスリスト

// セレクトボックス定数定義
// 先出し対象フラグ
const advanceTargetedFlagValues: string[] = ['1', '2'];
const advanceTargetedFlagDisplayValues: string[] = ['書類先出し', '備品先出し'];
// 支払い延長サービスフラグ
const paymentExtensionServiceFlagValues: string[] = ['1', '2'];
const paymentExtensionServiceFlagDisplayValues: string[] = ['対象', '対象外'];

/**
 * 検索条件データモデル
 */
interface SearchConditionModel {
  auctionKind: string; // オークション種類
  exhibitShopContractId: string; // 出品店契約ID
  bidShopContractId: string; // 落札店契約ID
  advanceTargetedFlag: boolean; // 先出し対象フラグ
  paymentExtensionServiceFlag: boolean; // 支払い延長サービスフラグ
  auctionCountFrom: string; // オークション回数(From)
  auctionCountTo: string; // オークション回数(To)
  exhibitShopName: string; // 出品店名称
  bidShopName: string; // 落札店名称
  noticeKind: string; // 通知種類
  cartype: string; // 車種
  auctionDatePeriodFrom: string; // オークション開催日(期間)(FROM)
  auctionDatePeriodTo: string; // オークション開催日(期間)(TO)
  documentValidityDueDateFrom: string; // 書類有効期限(FROM)
  documentValidityDueDateTo: string; // 書類有効期期限(TO)
  documentArrivesPeriodFrom: string; // 書類到着日(期間)(FROM)
  documentArrivesPeriodTo: string; // 書類到着日(期間)(TO)
  docChangeDueDateFrom: string; // 名変期日(FROM)
  docChangeDueDateTo: string; // 名変期日(TO)
  carbodyNumberFrameNo: string; // 車台番号(フレームNO)
  exhibitNumber01: string; // 出品番号
  exhibitNumber02: string; // 出品番号
  exhibitNumber03: string; // 出品番号
  exhibitNumber04: string; // 出品番号
  exhibitNumber05: string; // 出品番号
  exhibitNumber06: string; // 出品番号
  exhibitNumber07: string; // 出品番号
  exhibitNumber08: string; // 出品番号
  exhibitNumber09: string; // 出品番号
  exhibitNumber10: string; // 出品番号
  arrivalStatus: string; // 到着ステータス
  shippingStatus: string; // 発送ステータス
  depositStatus: string; // 入金ステータス
  docChangeStatus: string; // 名変ステータス
  placeCode: string; // 会場(おまとめ時のみ)
}

/**
 * 検索条件初期データ
 */
const initialValues: SearchConditionModel = {
  auctionKind: '', // オークション種類
  exhibitShopContractId: '', // 出品店契約ID
  bidShopContractId: '', // 落札店契約ID
  advanceTargetedFlag: false, // 先出し対象フラグ
  paymentExtensionServiceFlag: false, // 支払い延長サービスフラグ
  auctionCountFrom: '', // オークション回数(From)
  auctionCountTo: '', // オークション回数(To)
  exhibitShopName: '', // 出品店名称
  bidShopName: '', // 落札店名称
  noticeKind: '', // 通知種類
  cartype: '', // 車種
  auctionDatePeriodFrom: '', // オークション開催日(期間)(FROM)
  auctionDatePeriodTo: '', // オークション開催日(期間)(TO)
  documentValidityDueDateFrom: '', // 書類有効期限(FROM)
  documentValidityDueDateTo: '', // 書類有効期限(TO)
  documentArrivesPeriodFrom: '', // 書類到着日(期間)(FROM)
  documentArrivesPeriodTo: '', // 書類到着日(期間)(TO)
  docChangeDueDateFrom: '', // 名変期日(FROM)
  docChangeDueDateTo: '', // 名変期日(TO)
  carbodyNumberFrameNo: '', // 車台番号(フレームNO)
  exhibitNumber01: '', // 出品番号
  exhibitNumber02: '', // 出品番号
  exhibitNumber03: '', // 出品番号
  exhibitNumber04: '', // 出品番号
  exhibitNumber05: '', // 出品番号
  exhibitNumber06: '', // 出品番号
  exhibitNumber07: '', // 出品番号
  exhibitNumber08: '', // 出品番号
  exhibitNumber09: '', // 出品番号
  exhibitNumber10: '', // 出品番号
  arrivalStatus: '', // 到着ステータス
  shippingStatus: '', // 発送ステータス
  depositStatus: '', // 入金ステータス
  docChangeStatus: '', // 名変ステータス
  placeCode: '', // 会場(おまとめ時のみ)
};

/**
 * 検索条件初期データ(select box)
 */
const selectValuesInitialValues: SelectValuesModel = {
  auctionKindSelectValues: [], // オークション種類
  exhibitShopContractIdSelectValues: [], // 出品店契約ID
  bidShopContractIdSelectValues: [], // 落札店契約ID
  advanceTargetedFlagSelectValues: [], // 先出し対象フラグ
  paymentExtensionServiceFlagSelectValues: [], // 支払い延長サービスフラグ
  exhibitShopNameSelectValues: [], // 出品店名称
  bidShopNameSelectValues: [], // 落札店名称
  noticeKindSelectValues: [], // 通知種類
  cartypeSelectValues: [], // 車種
  arrivalStatusSelectValues: [], // 到着ステータス
  shippingStatusSelectValues: [], // 発送ステータス
  depositStatusSelectValues: [], // 入金ステータス
  docChangeStatusSelectValues: [], // 名変ステータス
  placeCodeSelectValues: [], // 会場(おまとめ時のみ)
};

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  auctionKindSelectValues: SelectValue[]; // オークション種類
  exhibitShopContractIdSelectValues: SelectValue[]; // 出品店契約ID
  bidShopContractIdSelectValues: SelectValue[]; // 落札店契約ID
  advanceTargetedFlagSelectValues: SelectValue[]; // 先出し対象フラグ
  paymentExtensionServiceFlagSelectValues: SelectValue[]; // 支払い延長サービスフラグ
  exhibitShopNameSelectValues: SelectValue[]; // 出品店名称
  bidShopNameSelectValues: SelectValue[]; // 落札店名称
  noticeKindSelectValues: SelectValue[]; // 通知種類
  cartypeSelectValues: SelectValue[]; // 車種
  arrivalStatusSelectValues: SelectValue[]; // 到着ステータス
  shippingStatusSelectValues: SelectValue[]; // 発送ステータス
  depositStatusSelectValues: SelectValue[]; // 入金ステータス
  docChangeStatusSelectValues: SelectValue[]; // 名変ステータス
  placeCodeSelectValues: SelectValue[]; // 会場(おまとめ時のみ)
}

type key = keyof SearchConditionModel;

/**
 * 入力項目
 */
const serchData: { label: string; name: key }[] = [
  { label: 'オークション種類', name: 'auctionKind' },
  { label: '出品店契約ID', name: 'exhibitShopContractId' },
  { label: '落札店契約ID', name: 'bidShopContractId' },
  { label: '先出し対象フラグ', name: 'advanceTargetedFlag' },
  { label: '支払い延長サービスフラグ', name: 'paymentExtensionServiceFlag' },
  { label: 'オークション回数(From)', name: 'auctionCountFrom' },
  { label: 'オークション回数(To)', name: 'auctionCountTo' },
  { label: '出品店名称', name: 'exhibitShopName' },
  { label: '落札店名称', name: 'bidShopName' },
  { label: '通知種類', name: 'noticeKind' },
  { label: '車種', name: 'cartype' },
  { label: 'オークション開催日(期間)(FROM)', name: 'auctionDatePeriodFrom' },
  { label: 'オークション開催日(期間)(TO)', name: 'auctionDatePeriodTo' },
  { label: '書類有効期限(FROM)', name: 'documentValidityDueDateFrom' },
  { label: '書類有効期限(TO)', name: 'documentValidityDueDateTo' },
  { label: '書類到着日(期間)(FROM)', name: 'documentArrivesPeriodFrom' },
  { label: '書類到着日(期間)(TO)', name: 'documentArrivesPeriodTo' },
  { label: '名変期日(FROM)', name: 'docChangeDueDateFrom' },
  { label: '名変期日(TO)', name: 'docChangeDueDateTo' },
  { label: '車台番号(フレームNO)', name: 'carbodyNumberFrameNo' },
  { label: '出品番号', name: 'exhibitNumber01' },
  { label: '出品番号', name: 'exhibitNumber02' },
  { label: '出品番号', name: 'exhibitNumber03' },
  { label: '出品番号', name: 'exhibitNumber04' },
  { label: '出品番号', name: 'exhibitNumber05' },
  { label: '出品番号', name: 'exhibitNumber06' },
  { label: '出品番号', name: 'exhibitNumber07' },
  { label: '出品番号', name: 'exhibitNumber08' },
  { label: '出品番号', name: 'exhibitNumber09' },
  { label: '出品番号', name: 'exhibitNumber10' },
  { label: '到着ステータス', name: 'arrivalStatus' },
  { label: '発送ステータス', name: 'shippingStatus' },
  { label: '入金ステータス', name: 'depositStatus' },
  { label: '名変ステータス', name: 'docChangeStatus' },
  { label: '会場(おまとめ時のみ)', name: 'placeCode' },
];

/** 検索項目のバリデーション */
const searchConditionSchema = {
  auctionKind: yup.string().max(4).label('オークション種類'),
  exhibitShopContractId: yup.string().max(7).label('出品店契約ID'),
  bidShopContractId: yup.string().max(7).label('落札店契約ID'),
  advanceTargetedFlag: yup.string().max(5).label('先出し対象フラグ'),
  paymentExtensionServiceFlag: yup
    .string()
    .max(3)
    .label('支払い延長サービスフラグ'),
  auctionCountFrom: yup
    .string()
    .numberWithComma()
    .max(4)
    .label('オークション回数(From)'),
  auctionCountTo: yup
    .string()
    .numberWithComma()
    .max(4)
    .label('オークション回数(To)'),
  exhibitShopName: yup.string().max(40).label('出品店名称'),
  bidShopName: yup.string().max(40).label('落札店名称'),
  noticeKind: yup.string().max(9).label('通知種類'),
  cartype: yup.string().max(4).label('車種'),
  auctionDatePeriodFrom: yup
    .string()
    .date()
    .max(10)
    .label('オークション開催日(期間)(FROM)'),
  auctionDatePeriodTo: yup
    .string()
    .date()
    .max(10)
    .label('オークション開催日(期間)(TO)'),
  documentValidityDueDateFrom: yup
    .string()
    .date()
    .max(10)
    .label('書類有効期限(FROM)'),
  documentValidityDueDateTo: yup
    .string()
    .date()
    .max(10)
    .label('書類有効期限(TO)'),
  documentArrivesPeriodFrom: yup
    .string()
    .date()
    .max(10)
    .label('書類到着日(FROM)'),
  documentArrivesPeriodTo: yup.string().date().max(10).label('書類到着日(TO)'),
  docChangeDueDateFrom: yup.string().date().max(10).label('名変期日(FROM)'),
  docChangeDueDateTo: yup.string().date().max(10).label('名変期日(TO)'),
  carbodyNumberFrameNo: yup
    .string()
    .half()
    .max(20)
    .label('車台番号(フレームNO)'),
  exhibitNumber01: yup.string().half().max(6).label('出品番号'),
  exhibitNumber02: yup.string().half().max(6).label('出品番号'),
  exhibitNumber03: yup.string().half().max(6).label('出品番号'),
  exhibitNumber04: yup.string().half().max(6).label('出品番号'),
  exhibitNumber05: yup.string().half().max(6).label('出品番号'),
  exhibitNumber06: yup.string().half().max(6).label('出品番号'),
  exhibitNumber07: yup.string().half().max(6).label('出品番号'),
  exhibitNumber08: yup.string().half().max(6).label('出品番号'),
  exhibitNumber09: yup.string().half().max(6).label('出品番号'),
  exhibitNumber10: yup.string().half().max(6).label('出品番号'),
  arrivalStatusSelectValues: yup.string().max(3).label('到着ステータス'),
  shippingStatusSelectValues: yup.string().max(4).label('発送ステータス'),
  depositStatusSelectValues: yup.string().max(4).label('入金ステータス'),
  docChangeStatusSelectValues: yup.string().max(6).label('名変ステータス'),
  placeCodeSelectValues: yup.string().max(190).label('会場(おまとめ時のみ)'),
};

/**
 * 書類情報一覧検索結果(項目)
 */
const documentListSearchResultColumns: GridColDef[] = [
  {
    field: 'auctionPlace',
    headerName: 'ｵｰｸｼｮﾝ会場',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'auctionNumber',
    headerName: 'ｵｰｸｼｮﾝ回数',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'auctionDate',
    headerName: 'ｵｰｸｼｮﾝ開催日',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'exhibitNumber',
    headerName: '出品番号',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'carName',
    headerName: '車名',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'grade',
    headerName: 'グレード',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'carbodyNumber',
    headerName: '車台番号',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'exhibitShopContractId',
    headerName: '出品店契約ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'exhibitShopName',
    headerName: '出品店名',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'bidShopContractId',
    headerName: '落札店契約ID',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'bidShopName',
    headerName: '落札店名',
    cellType: 'default',
    size: 'm',
  },
  {
    field: 'documentArrivesPeriod',
    headerName: '書類到着日',
    cellType: 'default',
    size: 'm',
  },
];

/**
 * 書類情報一覧検索結果データモデル
 */
interface DocumentListSearchResultRowModel {
  // internal ID
  id: string;
  // オークション会場
  auctionPlace: string;
  // オークション回数
  auctionNumber: string;
  // オークション開催日
  auctionDate: string;
  // 出品番号
  exhibitNumber: string;
  // 車名
  carName: string;
  // グレード
  grade: string;
  // 車台番号
  carbodyNumber: string;
  // 出品店契約ID
  exhibitShopContractId: string;
  // 出品店名
  exhibitShopName: string;
  // 落札店契約ID
  bidShopContractId: string;
  // 落札店名
  bidShopName: string;
  // 書類到着日
  documentArrivesPeriod: string;
  // 書類基本番号
  documentBasicsNumber: string;
  // 名変督促FAX停止有無フラグ
  docChangeDemandFaxStopExistenceFlag: boolean;
}

/**
 * TODO:SCR-DOC-0004 一括通知送信プロパティ(リスト)
 */
interface NoticeSendList {
  // 書類基本番号
  auctionKaisaiDay: string;
  // 出品店契約ID
  exbShopContractId: string;
  // 落札店契約ID
  bidContractId: string;
  // 名変督促FAX停止有無フラグ
  dchngDemandFaxStopExstnFlg: string;
}

/**
 * SCR-DOC-0001 書類情報一覧画面
 */
const ScrTra0001Page = () => {
  // router
  const navigate = useNavigate();

  // user
  const { user } = useContext(AuthContext);

  // context
  const { saveState, loadState } = useContext(AppContext);
  const prevValues = loadState();

  // form
  const methods = useForm<SearchConditionModel>({
    defaultValues: prevValues === undefined ? initialValues : prevValues,
    context: false,
    resolver: yupResolver(yup.object(searchConditionSchema)),
  });
  const { getValues } = methods;

  const [openSection, setOpenSection] = useState<boolean>(true);

  // select box
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );

  // メッセージを取得
  const { getMessage } = useContext(MessageContext);

  // コード管理マスタ
  const [codeMaster, setCodeMaster] = useState<ResultList[]>([]);

  // hidden
  // 変更フラグ
  const [executionFlg, setExecutionFlg] = useState<boolean>(false);
  // 変更タイムスタンプ
  const [changeTimestamp, setChangeTimestamp] = useState<string>();

  // 各種ボタンの活性/非活性フラグ
  // 配送伝票一括印刷ボタン TODO:設計書に権限の記載が存在しないため要確認
  const [
    shippingSlipAllPrintButtonDisableFlag,
    setShippingSlipAllPrintButtonDisableFlag,
  ] = useState<boolean>(false);
  // 一括通知送信ボタン
  const [reportPrintButtonDisableFlag, setReportPrintButtonDisableFlag] =
    useState<boolean>(false);
  // 日中バッチ処理ボタン
  const [
    dayBatchProcessButtonDisableFlag,
    setDayBatchProcessButtonDisableFlag,
  ] = useState<boolean>(false);

  // アラート表示関連
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  // 帳票選択関連
  const [scrCom0011PopupIsOpen, setScrCom0011PopupIsOpen] =
    useState<boolean>(false);
  const [documentBasicsNumberList, setDocumentBasicsNumberList] = useState<
    string[]
  >([]);

  // チェックボックス選択行
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  const [rowSelectionModel, setRowSelectionModel] = useState<any[]>([]);

  // 出品番号リンク
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);

  useEffect(() => {
    /** 初期処理 */
    const initialize = async () => {
      // セレクトボックスの初期化処理
      selectValues.auctionKindSelectValues = []; // オークション種類
      selectValues.exhibitShopContractIdSelectValues = []; // 出品店契約ID
      selectValues.bidShopContractIdSelectValues = []; // 落札店契約ID
      selectValues.advanceTargetedFlagSelectValues = []; // 先出し対象フラグ
      selectValues.paymentExtensionServiceFlagSelectValues = []; // 支払い延長サービスフラグ
      selectValues.exhibitShopNameSelectValues = []; // 出品店名称
      selectValues.bidShopNameSelectValues = []; // 落札店名称
      selectValues.noticeKindSelectValues = []; // 通知種類
      selectValues.cartypeSelectValues = []; // 車種
      selectValues.arrivalStatusSelectValues = []; // 到着ステータス
      selectValues.shippingStatusSelectValues = []; // 発送ステータス
      selectValues.depositStatusSelectValues = []; // 入金ステータス
      selectValues.docChangeStatusSelectValues = []; // 名変ステータス
      selectValues.placeCodeSelectValues = []; // 会場(おまとめ時のみ)

      // コード管理マスタから各種値を取得する
      const codeMasterRequest = {
        codeId: [
          CDE_COM_0066, // オークション種類リスト
          CDE_COM_0080, // 通知種類リスト
          CDE_COM_0124, // 車種リスト
          CDE_COM_0068, // 到着ステータスリスト
          CDE_COM_0072, // 発送ステータスリスト
          CDE_COM_0070, // 入金ステータスリスト
          CDE_COM_0071, // 名変ステータスリスト
        ],
      };
      const codeMasterRequestResponse =
        await ScrCom9999getCodeManagementMasterMultiple(codeMasterRequest);

      const dataList: ResultList[] = [];
      codeMasterRequestResponse.resultList.forEach((row) => {
        const data: ResultList = {
          codeId: row.codeId, // コードID
          codeValueList: row.codeValueList, // リスト
          entityName: row.entityName, // エンティティ名
        };
        dataList.push(data);
      });
      setCodeMaster(dataList);

      // 取得したコードマスタから各種セレクトボックスを設定する
      codeMaster.forEach((cm) => {
        // オークション種類選択(リスト)のセレクトボックスを設定する
        if (CDE_COM_0066 === cm.codeId) {
          cm.codeValueList.forEach((row) => {
            selectValues.auctionKindSelectValues.push({
              value: row.codeValue,
              displayValue: row.codeName,
            });
          });
        }
        // 通知種類選択(リスト)のセレクトボックスを設定する
        if (CDE_COM_0080 === cm.codeId) {
          cm.codeValueList.forEach((row) => {
            selectValues.noticeKindSelectValues.push({
              value: row.codeValue,
              displayValue: row.codeName,
            });
          });
        }
        // 車種選択(リスト)のセレクトボックスを設定する
        if (CDE_COM_0124 === cm.codeId) {
          cm.codeValueList.forEach((row) => {
            selectValues.cartypeSelectValues.push({
              value: row.codeValue,
              displayValue: row.codeName,
            });
          });
        }
        // 到着ステータス(リスト)のセレクトボックスを設定する
        if (CDE_COM_0068 === cm.codeId) {
          cm.codeValueList.forEach((row) => {
            selectValues.arrivalStatusSelectValues.push({
              value: row.codeValue,
              displayValue: row.codeName,
            });
          });
        }
        // 発送ステータス(リスト)のセレクトボックスを設定する
        if (CDE_COM_0072 === cm.codeId) {
          cm.codeValueList.forEach((row) => {
            selectValues.shippingStatusSelectValues.push({
              value: row.codeValue,
              displayValue: row.codeName,
            });
          });
        }
        // 入金ステータス(リスト)のセレクトボックスを設定する
        if (CDE_COM_0070 === cm.codeId) {
          cm.codeValueList.forEach((row) => {
            selectValues.depositStatusSelectValues.push({
              value: row.codeValue,
              displayValue: row.codeName,
            });
          });
        }
        // 名変ステータス(リスト)のセレクトボックスを設定する
        if (CDE_COM_0071 === cm.codeId) {
          cm.codeValueList.forEach((row) => {
            selectValues.docChangeStatusSelectValues.push({
              value: row.codeValue,
              displayValue: row.codeName,
            });
          });
        }
      });

      // API-DOC-0001-0006 契約ID取得API
      const contractIdSearchRequest: ScrDoc0001ContractIdSearchRequest = {
        contractId: '', // 契約ID
        corporationId: '', // 法人ID
      };
      const contractIdSearchRequestResponse = await ScrDoc0001ContractIdSearch(
        contractIdSearchRequest
      );
      contractIdSearchRequestResponse.list.forEach((row) => {
        // 出品店契約ID(リスト)のセレクトボックスを設定する
        selectValues.exhibitShopContractIdSelectValues.push({
          value: row.contractId + row.corporationId, // 契約ID + 法人ID
          displayValue: row.contractId, // 契約ID
        });
        // 落札店契約ID(リスト)のセレクトボックスを設定する
        selectValues.bidShopContractIdSelectValues.push({
          value: row.contractId + row.corporationId, // 契約ID + 法人ID
          displayValue: row.contractId, // 契約ID
        });
      });

      // API-DOC-0001-0005 物流拠点名称取得API
      const logisticsBaseNameSearchRequest: ScrDoc0001LogisticsBaseNameSearchRequest =
        {
          corporationId: '', // 法人ID
          logisticsBaseId: '', // 物流拠点ID
          logisticsBaseRepresentativeContractId: '', // 物流拠点代表契約ID
        };
      const logisticsBaseNameSearchResponse =
        await ScrDoc0001LogisticsBaseNameSearch(logisticsBaseNameSearchRequest);
      logisticsBaseNameSearchResponse.list.forEach((row) => {
        // 出品店名称(リスト)のセレクトボックスを設定する
        selectValues.exhibitShopNameSelectValues.push({
          value: row.corporationId + row.logisticsBaseId, // 法人ID + 物流拠点ID
          displayValue: row.logisticsBaseName, // 物流拠点名称
        });
        // 落札店名称(リスト)のセレクトボックスを設定する
        selectValues.bidShopNameSelectValues.push({
          value: row.corporationId + row.logisticsBaseId, // 法人ID + 物流拠点ID
          displayValue: row.logisticsBaseName, // 物流拠点名称
        });
      });

      // API-COM-9999-0016 会場マスタ情報取得API
      const getPlaceMasterRequest: ScrCom9999GetPlaceMasterRequest = {
        businessDate: user.taskDate, // 業務日付
      };
      const getPlaceMasterResponse = await ScrCom9999GetPlaceMaster(
        getPlaceMasterRequest
      );
      // 会場（おまとめ時のみ）(リスト)を設定する
      getPlaceMasterResponse.placeList.forEach((row) => {
        selectValues.placeCodeSelectValues.push({
          value: row.placeCode, // 会場コード
          displayValue: row.placeName, // 会場名
        });
      });

      // 先出し対象フラグのセレクトボックスを設定する
      advanceTargetedFlagValues.forEach((row) => {
        selectValues.advanceTargetedFlagSelectValues.push({
          value: row,
          displayValue: advanceTargetedFlagDisplayValues[Number(row) - 1],
        });
      });
      // 支払い延長サービスフラグのセレクトボックスを設定する
      paymentExtensionServiceFlagValues.forEach((row) => {
        selectValues.paymentExtensionServiceFlagSelectValues.push({
          value: row,
          displayValue:
            paymentExtensionServiceFlagDisplayValues[Number(row) - 1],
        });
      });

      // セレクトボックスを設定する
      const selectValuesParam: SelectValuesModel = {
        auctionKindSelectValues: selectValues.auctionKindSelectValues, // オークション種類
        exhibitShopContractIdSelectValues:
          selectValues.exhibitShopContractIdSelectValues, // 出品店契約ID
        bidShopContractIdSelectValues:
          selectValues.bidShopContractIdSelectValues, // 落札店契約ID
        advanceTargetedFlagSelectValues:
          selectValues.advanceTargetedFlagSelectValues, // 先出し対象フラグ
        paymentExtensionServiceFlagSelectValues:
          selectValues.paymentExtensionServiceFlagSelectValues, // 支払い延長サービスフラグ
        exhibitShopNameSelectValues: selectValues.exhibitShopNameSelectValues, // 出品店名称
        bidShopNameSelectValues: selectValues.bidShopNameSelectValues, // 落札店名称
        noticeKindSelectValues: selectValues.noticeKindSelectValues, // 通知種類
        cartypeSelectValues: selectValues.cartypeSelectValues, // 車種
        arrivalStatusSelectValues: selectValues.arrivalStatusSelectValues, // 到着ステータス
        shippingStatusSelectValues: selectValues.shippingStatusSelectValues, // 発送ステータス
        depositStatusSelectValues: selectValues.depositStatusSelectValues, // 入金ステータス
        docChangeStatusSelectValues: selectValues.docChangeStatusSelectValues, // 名変ステータス
        placeCodeSelectValues: selectValues.placeCodeSelectValues, // 会場(おまとめ時のみ)
      };
      setSelectValues(selectValuesParam);

      // API-DOC-0001-0001 バッチ管理マスタ情報取得API
      const batchInfoAcquisitionResponse = await ScrDoc0001BatchInfoAcquisition(
        undefined
      );
      setExecutionFlg(batchInfoAcquisitionResponse.executionFlg); // 実行フラグ
      setChangeTimestamp(batchInfoAcquisitionResponse.changeTimestamp); // 変更タイムスタンプ

      // 日中バッチ処理ボタンの表示制御を行う "実行フラグ" が true の場合は活性,その他は非活性
      if (true === executionFlg) {
        setDayBatchProcessButtonDisableFlag(false); // 活性
      } else {
        setDayBatchProcessButtonDisableFlag(true); // 非活性
      }
      setOpenSection(false);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * オークション回数(FROM)フォーカスアウト時のイベントハンドラ
   */
  const handleAuctionCountFromOnBlur = () => {
    // オークション回数 TOD 値が存在しない場合は From の値を TO に転写する
    if (0 === getValues('auctionCountTo').length) {
      methods.setValue('auctionCountTo', getValues('auctionCountFrom'));
    }
  };

  /**
   * オークション開催日(FROM)フォーカスアウト時のイベントハンドラ
   */
  // TODO:DatePickerに対してonBlurが使えるか確認中
  const handleAuctionDatePeriodFromOnBlur = () => {
    // オークション開催日 TOD 値が存在しない場合は From の値を TO に転写する
    if (0 === getValues('auctionDatePeriodTo').length) {
      methods.setValue(
        'auctionDatePeriodTo',
        getValues('auctionDatePeriodFrom')
      );
    }
  };

  /**
   * Sectionを閉じた際のラベル作成
   */
  const searchLabels = serchData.map((val, index) => {
    const nameVal = getValues(val.name);
    return (
      nameVal && (
        <SerchLabelText
          key={index}
          label={val.label}
          name={nameVal.toString()}
        />
      )
    );
  });

  // 書類情報一覧検索結果(データ)
  const [
    documentListSearchResultRowsValues,
    setDocumentListSearchResultRowsValues,
  ] = useState<DocumentListSearchResultRowModel[]>([]);

  /**
   * 検索ボタンクリック時のイベントハンドラ
   */
  const handleSearchClick = async () => {
    saveState(getValues());
    // 入力値の整合性チェック
    // オークション回数 FROM, TO 双方が入力されている場合
    if (
      0 !== getValues('auctionCountFrom').length &&
      0 !== getValues('auctionCountTo').length
    ) {
      if (getValues('auctionCountFrom') > getValues('auctionCountTo')) {
        // オークション回数 : FROM > TO の場合
        setTitle(getMessage('MSG-FR-ERR-00128'));
        setHandleDialog(true);
        return;
      }
    }

    // オークション開催日 FROM, TO 双方が入力されている場合
    if (
      0 !== getValues('auctionDatePeriodFrom').length &&
      0 !== getValues('auctionDatePeriodTo').length
    ) {
      if (
        getValues('auctionDatePeriodFrom') > getValues('auctionDatePeriodTo')
      ) {
        // オークション開催日 : FROM > TO の場合
        setTitle(getMessage('MSG-FR-ERR-00129'));
        setHandleDialog(true);
        return;
      }
    }

    // 書類有効期限 FROM, TO が双方入力されている場合
    if (
      0 !== getValues('documentValidityDueDateFrom').length &&
      0 !== getValues('documentValidityDueDateTo').length
    ) {
      if (
        getValues('documentValidityDueDateFrom') >
        getValues('documentValidityDueDateTo')
      ) {
        // 書類有効期限 : FROM > TO の場合
        setTitle(getMessage('MSG-FR-ERR-00129'));
        setHandleDialog(true);
        return;
      }
    }

    // 書類到着日 FROM, TO が双方入力されている場合
    if (
      0 !== getValues('documentArrivesPeriodFrom').length &&
      0 !== getValues('documentArrivesPeriodTo').length
    ) {
      if (
        getValues('documentArrivesPeriodFrom') >
        getValues('documentArrivesPeriodTo')
      ) {
        // 書類有効期限 : FROM > TO の場合
        setTitle(getMessage('MSG-FR-ERR-00129'));
        setHandleDialog(true);
        return;
      }
    }

    // docChangeDueDateFrom, docChangeDueDateTo
    // 名変期日 FROM, TO が双方入力されている場合
    if (
      0 !== getValues('docChangeDueDateFrom').length &&
      0 !== getValues('docChangeDueDateTo').length
    ) {
      if (getValues('docChangeDueDateFrom') > getValues('docChangeDueDateTo')) {
        // 名変期日 : FROM > TO の場合
        setTitle(getMessage('MSG-FR-ERR-00129'));
        setHandleDialog(true);
        return;
      }
    }

    // API-DOC-0001-0002 書類情報一覧取得API
    const docListAcquisitionRequest: ScrDoc0001DocListAcquisitionRequest = {
      auctionKind: [getValues('auctionKind')], // オークション種類
      exhibitShopContractId: getValues('exhibitShopContractId'), // 出品店契約ID
      bidShopContractId: getValues('bidShopContractId'), // 落札店契約ID
      advanceTargetedFlag: getValues('advanceTargetedFlag'), // 先出し対象フラグ
      paymentExtensionServiceFlag: getValues('paymentExtensionServiceFlag'), // 支払い延長サービスフラグ
      auctionCountFrom: getValues('auctionCountFrom'), // オークション回数(FROM)
      auctionCountTo: getValues('auctionCountTo'), // オークション回数(TO)
      exhibitShopName: getValues('exhibitShopName'), // 出品店名称
      bidShopName: getValues('bidShopName'), // 落札店名称
      noticeKind: getValues('noticeKind'), // 通知種類
      cartype: getValues('cartype'), // 車種
      auctionDatePeriodFrom: new Date(
        Date.parse(getValues('auctionDatePeriodFrom'))
      ), // オークション開催日(期間)(FROM)
      auctionDatePeriodTo: new Date(
        Date.parse(getValues('auctionDatePeriodTo'))
      ), // オークション開催日(期間)(TO)
      documentValidityDueDateFrom: new Date(
        Date.parse(getValues('documentValidityDueDateFrom'))
      ), // 書類有効期限(FROM)
      documentValidityDueDateTo: new Date(
        Date.parse(getValues('documentValidityDueDateTo'))
      ), // 書類有効期限(TO)
      documentArrivesPeriodFrom: new Date(
        Date.parse(getValues('documentArrivesPeriodFrom'))
      ), // 書類到着日(期間)(FROM)
      documentArrivesPeriodTo: new Date(
        Date.parse(getValues('documentArrivesPeriodTo'))
      ), // 書類到着日(期間)(TO)
      docChangeDueDateFrom: new Date(
        Date.parse(getValues('docChangeDueDateFrom'))
      ), // 名変期日(FROM)
      docChangeDueDateTo: new Date(Date.parse(getValues('docChangeDueDateTo'))), // 名変期日(TO)
      carbodyNumberFrameNo: getValues('carbodyNumberFrameNo'), // 車台番号(フレームNO)
      /** 出品番号 */
      exhibitNumber: [
        getValues('exhibitNumber01'),
        getValues('exhibitNumber02'),
        getValues('exhibitNumber03'),
        getValues('exhibitNumber04'),
        getValues('exhibitNumber05'),
        getValues('exhibitNumber06'),
        getValues('exhibitNumber07'),
        getValues('exhibitNumber08'),
        getValues('exhibitNumber09'),
        getValues('exhibitNumber10'),
      ],
      arrivalStatus: getValues('arrivalStatus'), // 到着ステータス
      shippingStatus: getValues('shippingStatus'), // 発送ステータス
      depositStatus: getValues('depositStatus'), // 入金ステータス
      docChangeStatus: getValues('docChangeStatus'), // 名変ステータス
      placeCode: [getValues('placeCode')], // 会場コード
    };
    const docListAcquisitionRequestResponse =
      await ScrDoc0001DocListAcquisition(docListAcquisitionRequest);
    // 書類情報一覧検索のリストを設定する
    const dataRows: DocumentListSearchResultRowModel[] = [];
    docListAcquisitionRequestResponse.list.forEach((row, index) => {
      const dataRow: DocumentListSearchResultRowModel = {
        id: index.toString(), // internal ID
        auctionPlace: row.auctionPlace, // オークション会場
        auctionNumber: row.auctionCount, // オークション回数
        auctionDate: row.auctionDate.toString(), // オークション開催日
        exhibitNumber: row.exhibitNumber, // 出品番号
        carName: row.carName, // 車名
        grade: row.grade, // グレード
        carbodyNumber: row.carbodyNumber, // 車台番号
        exhibitShopContractId: row.exhibitShopContractId, // 出品店契約ID
        exhibitShopName: row.exhibitShopName, // 出品店名
        bidShopContractId: row.bidShopContractId, // 落札店契約ID
        bidShopName: row.bidShopName, // 落札店名
        documentArrivesPeriod: row.documentArrivesDate.toString(), // 書類到着日
        documentBasicsNumber: row.documentBasicsNumber, // 書類基本番号
        docChangeDemandFaxStopExistenceFlag:
          row.docChangeDemandFaxStopExistenceFlag, // 名変督促FAX停止有無フラグ
      };
      dataRows.push(dataRow);
    });
    setDocumentListSearchResultRowsValues(dataRows);

    // 件数チェック 制限件数 < 取得件数の場合
    if (
      Number(docListAcquisitionRequestResponse.limitCount) <
      Number(docListAcquisitionRequestResponse.acquisitionCount)
    ) {
      const messege = Format(getMessage('MSG-FR-INF-00004'), [
        docListAcquisitionRequestResponse.acquisitionCount.toString(),
        docListAcquisitionRequestResponse.responseCount.toString(),
      ]);
      // アラートを表示
      setTitle(messege);
      setHandleDialog(true);
      return;
    }

    // 通知種類に値が設定されている場合は 一括通知送信 ボタンを活性, そうでない場合は非活性にする
    if (0 !== getValues('noticeKind').length) {
      setReportPrintButtonDisableFlag(false);
    } else {
      setReportPrintButtonDisableFlag(true);
    }

    // 出品番号にリンクを付与する
    const exhibitNumberHrefs: GridHrefsModel[] = [];
    exhibitNumberHrefs.push({
      field: 'exhibitNumber',
      hrefs: documentListSearchResultRowsValues.map((row) => {
        return {
          id: row.id,
          href:
            '/doc/documents/documentBasicsNumber=' + row.documentBasicsNumber, // 書類情報詳細画面 : パラメータ:書類基本番号
        };
      }),
    });
    setHrefs(exhibitNumberHrefs);
  };

  /**
   * 配送伝票一括印刷ボタンクリック時のイベントハンドラ
   */
  const handleIconShippingSlipAllPrintClick = () => {
    // SCR-DOC-0003 配送伝票一括印刷（ポップアップ）
    // TODO: 該当処理実装の際に再確認
  };

  /**
   * 一括通知送信ボタンクリック時のイベントハンドラ
   */
  const handleIconAllNoticeSendClick = () => {
    // 書類情報一覧検索の対象行をチェックする
    if (0 === rowSelectionModel.length) {
      return; // 対象が無い場合は処理終了
    }
    // SCR-DOC-0004 一括通知送信（ポップアップ）
    // 通知種類区分
    const noticeKind = getValues('noticeKind');
    // 通知種類名称
    // let noticeKindName = '';
    // 通知種類選択(リスト)のセレクトボックスを設定する
    codeMaster.forEach((cm) => {
      if (CDE_COM_0080 === cm.codeId) {
        cm.codeValueList.forEach((row) => {
          if (noticeKind === row.codeValue) {
            // noticeKindName = row.codeName;
          }
        });
      }
    });
    // 通知送信リスト
    const noticeSendList: NoticeSendList[] = [];
    rowSelectionModel.forEach((row) => {
      const noticeSend: NoticeSendList = {
        auctionKaisaiDay: row.documentBasicsNumber, // 書類基本番号
        exbShopContractId: row.exhibitShopContractId, // 出品店契約ID
        bidContractId: row.bidShopContractId, // 落札店契約ID
        dchngDemandFaxStopExstnFlg: row.docChangeDemandFaxStopExistenceFlag, // 名変督促FAX停止有無フラグ
      };
      noticeSendList.push(noticeSend);
    });
    // TODO: 該当処理実装の際に再確認
  };

  /**
   * 帳票出力ボタンクリック時のイベントハンドラ
   */
  const handleIconReportPrintClick = () => {
    if (0 === rowSelectionModel.length) {
      return; // 未選択の時は処理終了
    }
    // 書類基本番号リストを設定する
    const documentBasicsNumberList: string[] = [];
    rowSelectionModel.forEach((row) => {
      documentBasicsNumberList.push(row.documentBasicsNumber);
    });
    setDocumentBasicsNumberList(documentBasicsNumberList);
    setScrCom0011PopupIsOpen(true);
  };

  const handleConfirm = async (reportId: string) => {
    if (0 === rowSelectionModel.length) {
      return; // 未選択の時は処理終了
    }
    // 帳票出力API 呼び出し
    // API-DOC-0001-0004  / 帳票出力API
    const outputDocReportRequest: ScrDoc0001OutputDocReportRequest = {
      reportId: reportId, // 帳票ID
      documentBasicsNumberList: documentBasicsNumberList, // 書類基本番号リスト
      comment: '', // 帳票コメント(設定しない)
    };
    await ScrDoc0001OutputDocReport(outputDocReportRequest);
  };

  /**
   * 書類情報検索一覧の出品番号リンク押下時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    // SCR-DOC-0005 書類情報詳細画面(遷移)
    navigate(url, false);
  };

  /**
   * 出品店契約IDの値が変更されたときのイベントハンドラ
   */
  // TODO: select box で onChange ができないので暫定記載
  const handleChangeExhibitShopContractId = async () => {
    // 法人ID (出品店契約IDリストの末尾8桁)
    const corporationId = getValues('exhibitShopContractId').slice(
      getValues('exhibitShopContractId').length - 8,
      getValues('exhibitShopContractId').length
    );
    // 物流拠点代表契約ID (出品店契約IDリストの末尾7桁)
    const logisticsBaseRepresentativeContractId = getValues(
      'exhibitShopContractId'
    ).slice(
      getValues('exhibitShopContractId').length - 7,
      getValues('exhibitShopContractId').length
    );

    /** API-DOC-0001-0005 物流拠点名称取得API */
    const logisticsBaseNameSearchRequest: ScrDoc0001LogisticsBaseNameSearchRequest =
      {
        corporationId: corporationId, // 法人ID
        logisticsBaseId: '', // 物流拠点ID (絵指定値なし)
        logisticsBaseRepresentativeContractId:
          logisticsBaseRepresentativeContractId, // 物流拠点代表契約ID
      };
    const logisticsBaseNameSearchResponse =
      await ScrDoc0001LogisticsBaseNameSearch(logisticsBaseNameSearchRequest);

    // 出品店名称(リスト)のセレクトボックスを設定する
    logisticsBaseNameSearchResponse.list.forEach((row) => {
      selectValues.exhibitShopNameSelectValues.push({
        value: row.corporationId + row.logisticsBaseId, // 法人ID + 物流拠点ID
        displayValue: row.logisticsBaseName, // 物流拠点名称
      });
    });
  };

  /**
   * 落札店契約IDの値が変更されたときのイベントハンドラ
   */
  // TODO: select box で onChange ができないので暫定記載
  const handleChangeBidShopContractId = async () => {
    // 法人ID (出品店契約IDリストの末尾8桁)
    const corporationId = getValues('exhibitShopContractId').slice(
      getValues('exhibitShopContractId').length - 8,
      getValues('exhibitShopContractId').length
    );
    // 物流拠点代表契約ID (出品店契約IDリストの末尾7桁)
    const logisticsBaseRepresentativeContractId = getValues(
      'exhibitShopContractId'
    ).slice(
      getValues('exhibitShopContractId').length - 7,
      getValues('exhibitShopContractId').length
    );

    /** API-DOC-0001-0005 物流拠点名称取得API */
    const logisticsBaseNameSearchRequest: ScrDoc0001LogisticsBaseNameSearchRequest =
      {
        corporationId: corporationId, // 法人ID
        logisticsBaseId: '', // 物流拠点ID (絵指定値なし)
        logisticsBaseRepresentativeContractId:
          logisticsBaseRepresentativeContractId, // 物流拠点代表契約ID
      };
    const logisticsBaseNameSearchResponse =
      await ScrDoc0001LogisticsBaseNameSearch(logisticsBaseNameSearchRequest);

    // 落札店契約ID(リスト)のセレクトボックスを設定する
    logisticsBaseNameSearchResponse.list.forEach((row) => {
      selectValues.bidShopNameSelectValues.push({
        value: row.corporationId + row.logisticsBaseId, // 法人ID + 物流拠点ID
        displayValue: row.logisticsBaseName, // 物流拠点名称
      });
    });
  };

  /**
   * 出品店名称の値が変更されたときのイベントハンドラ
   */
  // TODO: select box で onChange ができないので暫定記載
  const handleChangeExhibitShopName = async () => {
    // 法人ID (出品店契約IDリストの前方8桁)
    const corporationId = getValues('exhibitShopContractId').slice(0, 8);

    /** API-DOC-0001-0006 契約ID取得API */
    const contractIdSearchRequest: ScrDoc0001ContractIdSearchRequest = {
      contractId: '', // 契約ID(未設定)
      corporationId: corporationId, // 法人ID
    };
    const contractIdSearchRequestResponse = await ScrDoc0001ContractIdSearch(
      contractIdSearchRequest
    );
    contractIdSearchRequestResponse.list.forEach((row) => {
      // 出品店契約ID(リスト)のセレクトボックスを設定する
      selectValues.exhibitShopContractIdSelectValues.push({
        value: row.contractId + row.corporationId, // 契約ID + 法人ID
        displayValue: row.contractId, // 契約ID
      });
    });
  };

  /**
   * 落札店名称の値が変更されたときのイベントハンドラ
   */
  // TODO: select box で onChange ができないので暫定記載
  const handleChangeBidShopName = async () => {
    // 法人ID (出品店契約IDリストの前方8桁)
    const corporationId = getValues('exhibitShopContractId').slice(0, 8);

    /** API-DOC-0001-0006 契約ID取得API */
    const contractIdSearchRequest: ScrDoc0001ContractIdSearchRequest = {
      contractId: '', // 契約ID(未設定)
      corporationId: corporationId, // 法人ID
    };
    const contractIdSearchRequestResponse = await ScrDoc0001ContractIdSearch(
      contractIdSearchRequest
    );
    contractIdSearchRequestResponse.list.forEach((row) => {
      // 落札店契約ID(リスト)のセレクトボックスを設定する
      selectValues.bidShopContractIdSelectValues.push({
        value: row.contractId + row.corporationId, // 契約ID + 法人ID
        displayValue: row.contractId, // 契約ID
      });
    });
  };

  /**
   * 日中バッチ処理ボタンクリック時のイベントハンドラ
   */
  const handleIconDayBatchProcessClick = async () => {
    let stopFlag = false;
    // バッチ実行予約の確認ダイアログを表示する
    const ret1 = window.confirm(getMessage('MSG-FR-INF-00014'));
    // いいえの場合は処理終了させる
    if (!ret1) {
      stopFlag = true;
      return;
    }
    // 最終確認ダイアログを表示する
    const ret2 = window.confirm(getMessage('MSG-FR-INF-00015'));
    // いいえの場合は処理終了させる
    if (!ret2) {
      stopFlag = true;
      return;
    }
    // いいえの場合は処理を継続させない
    if (stopFlag) {
      return;
    }

    // API-DOC-0001-0003 書類到着処理反映API
    const docArrivesApplyRequest: ScrDoc0001DocArrivesApplyRequest = {
      changeTimestamp: new Date(Date.parse('' + changeTimestamp)),
    };
    const docArrivesApplyResponse = await ScrDoc0001DocArrivesApply(
      docArrivesApplyRequest
    );
    // エラーメッセージを表示する(リストの1つ目のみ)
    let errMsg = '';
    if (0 !== docArrivesApplyResponse.errorList.length) {
      const errList = docArrivesApplyResponse.errorList[0];
      errMsg = errList.errorMessage;
    }
    setTitle(errMsg);
    setHandleDialog(true);
    return;
  };

  /**
   * 書類情報一覧画面描画処理
   */
  return (
    <>
      <MainLayout>
        {/* main */}
        <h1>SCR-DOC-0001 書類情報一覧</h1>
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 書類情報検索セクション */}
            <Section
              name='書類情報検索'
              isSearch
              serchLabels={searchLabels}
              openable={openSection}
            >
              <ThemeProvider theme={theme}>
                <Grid container width={1590}>
                  <RowStack>
                    <ColStack>
                      <Select
                        label='オークション種類'
                        name='auctionKind'
                        selectValues={selectValues.auctionKindSelectValues}
                        required={true}
                        multiple={false}
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='出品店契約ID'
                        name='exhibitShopContractId'
                        selectValues={
                          selectValues.exhibitShopContractIdSelectValues
                        }
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='落札店契約ID'
                        name='bidShopContractId'
                        selectValues={
                          selectValues.bidShopContractIdSelectValues
                        }
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='先出し対象フラグ'
                        name='advanceTargetedFlag'
                        selectValues={
                          selectValues.advanceTargetedFlagSelectValues
                        }
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='支払い延長サービスフラグ'
                        name='paymentExtensionServiceFlag'
                        selectValues={
                          selectValues.paymentExtensionServiceFlagSelectValues
                        }
                        blankOption
                      />
                    </ColStack>
                  </RowStack>
                </Grid>
                <Grid>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='オークション回数'
                        name='auctionCountFrom'
                        onBlur={handleAuctionCountFromOnBlur}
                      />
                    </ColStack>
                    <ColStack>
                      <TextField label='　' name='auctionCountTo' />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='出品店名称'
                        name='exhibitShopName'
                        selectValues={selectValues.exhibitShopNameSelectValues}
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='落札店名称'
                        name='bidShopName'
                        selectValues={selectValues.bidShopNameSelectValues}
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='通知種類'
                        name='noticeKind'
                        selectValues={selectValues.noticeKindSelectValues}
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='車種'
                        name='cartype'
                        selectValues={selectValues.cartypeSelectValues}
                        blankOption
                      />
                    </ColStack>
                  </RowStack>
                </Grid>
                <Grid>
                  <RowStack>
                    <ColStack>
                      <RowStack>
                        <TextField
                          label='オークション開催日(期間)'
                          name='auctionDatePeriodFrom'
                          onBlur={handleAuctionDatePeriodFromOnBlur}
                          size={'s'}
                        />
                        <TextField
                          label='　'
                          name='auctionDatePeriodTo'
                          size={'s'}
                        />
                        <DatePicker
                          label='書類有効期限'
                          name='documentValidityDueDateFrom'
                        />
                        <DatePicker
                          label='　'
                          name='documentValidityDueDateTo'
                        />
                        <DatePicker
                          label='書類到着日(期間)'
                          name='documentArrivesPeriodFrom'
                        />
                        <DatePicker label='　' name='documentArrivesPeriodTo' />
                        <DatePicker
                          label='名変期日'
                          name='docChangeDueDateFrom'
                        />
                        <DatePicker label='　' name='docChangeDueDateTo' />
                        <TextField
                          label='車台番号(フレームNO)'
                          name='carbodyNumberFrameNo'
                        />
                      </RowStack>
                    </ColStack>
                  </RowStack>
                </Grid>
                <Grid>
                  <RowStack>
                    <ColStack>
                      <RowStack>
                        <TextField
                          label='出品番号'
                          name='exhibitNumber01'
                          size='s'
                        />
                        <TextField label='　' name='exhibitNumber02' size='s' />
                        <TextField label='　' name='exhibitNumber03' size='s' />
                        <TextField label='　' name='exhibitNumber04' size='s' />
                        <TextField label='　' name='exhibitNumber05' size='s' />
                        <TextField label='　' name='exhibitNumber06' size='s' />
                        <TextField label='　' name='exhibitNumber07' size='s' />
                        <TextField label='　' name='exhibitNumber08' size='s' />
                        <TextField label='　' name='exhibitNumber09' size='s' />
                        <TextField label='　' name='exhibitNumber10' size='s' />
                      </RowStack>
                    </ColStack>
                  </RowStack>
                </Grid>
                <Grid>
                  <RowStack>
                    <ColStack>
                      <Select
                        label='到着ステータス'
                        name='arrivalStatus'
                        selectValues={selectValues.arrivalStatusSelectValues}
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='発送ステータス'
                        name='shippingStatus'
                        selectValues={selectValues.shippingStatusSelectValues}
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='入金ステータス'
                        name='depositStatus'
                        selectValues={selectValues.depositStatusSelectValues}
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <Select
                        label='名変ステータス'
                        name='docChangeStatus'
                        selectValues={selectValues.docChangeStatusSelectValues}
                        blankOption
                      />
                    </ColStack>
                  </RowStack>
                </Grid>
                <Grid>
                  <RowStack>
                    <ColStack>
                      <Select
                        label='会場(おまとめ時のみ)'
                        name='placeCode'
                        selectValues={selectValues.placeCodeSelectValues}
                        multiple={false}
                        size='l'
                      />
                    </ColStack>
                  </RowStack>
                </Grid>
                <Grid>
                  <CenterBox>
                    <SearchButton
                      onClick={() => {
                        handleSearchClick();
                      }}
                    >
                      検索
                    </SearchButton>
                  </CenterBox>
                </Grid>
              </ThemeProvider>
            </Section>

            {/* 書類情報一覧セクション */}
            <Section
              name='書類情報一覧'
              isSearch
              serchLabels={searchLabels}
              openable={openSection}
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  <OutputButton
                    onClick={handleIconShippingSlipAllPrintClick}
                    disable={shippingSlipAllPrintButtonDisableFlag}
                  >
                    配送伝票一括印刷
                  </OutputButton>
                  <OutputButton
                    onClick={handleIconAllNoticeSendClick}
                    disable={reportPrintButtonDisableFlag}
                  >
                    一括通知送信
                  </OutputButton>
                  <PrintButton onClick={handleIconReportPrintClick}>
                    帳票出力
                  </PrintButton>
                </MarginBox>
              }
            >
              <Grid container width={1890}>
                <DataGrid
                  columns={documentListSearchResultColumns}
                  rows={documentListSearchResultRowsValues}
                  pagination={true}
                  checkboxSelection
                  onRowSelectionModelChange={(row) => {
                    setRowSelectionModel(row);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  hrefs={hrefs}
                  onLinkClick={handleLinkClick}
                />
              </Grid>
            </Section>
            <CenterBox>
              <AddButton
                onClick={() => {
                  handleIconDayBatchProcessClick();
                }}
                disable={dayBatchProcessButtonDisableFlag}
              >
                日中バッチ処理
              </AddButton>
            </CenterBox>
          </FormProvider>
        </MainLayout>
      </MainLayout>
      {/* ダイアログ */}
      <Dialog
        open={handleDialog}
        title={title}
        buttons={[{ name: 'OK', onClick: () => setHandleDialog(false) }]}
      />
      {/* 帳票選択(ポップアップ) */}
      {scrCom0011PopupIsOpen ? (
        <ScrCom0011Popup
          isOpen={scrCom0011PopupIsOpen}
          data={{ screenId: SCR_DOC_0001 }}
          handleCancel={() => setScrCom0011PopupIsOpen(false)}
          handleConfirm={handleConfirm}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrTra0001Page;
