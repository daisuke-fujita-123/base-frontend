import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, InputRowStack, RowStack } from 'layouts/Stack';

import { OutputButton, SearchButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
} from 'controls/Datagrid';
import { Dialog } from 'controls/Dialog';
import { ContentsDivider } from 'controls/Divider';
import { Select, SelectValue } from 'controls/Select';
import { SerchLabelText } from 'controls/Typography';

import {
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetCodeManagementMasterRequest,
} from 'apis/com/ScrCom9999Api';
import {
  ScrMem0003SearchAuctionDealHistory,
  ScrMem0003SearchAuctionDealHistoryRequest,
  ScrMem0003SearchAuctionDealHistoryResponse,
  ScrMem0003SearchBillingDealHistory,
  ScrMem0003SearchBillingDealHistoryRequest,
  ScrMem0003SearchBillingDealHistoryResponse,
  ScrMem0003SearchProxyBillingHistory,
  ScrMem0003SearchProxyBillingHistoryRequest,
  ScrMem0003SearchProxyBillingHistoryResponse,
} from 'apis/mem/ScrMem0003Api';
import {
  ScrMem9999GetBill,
  ScrMem9999GetBillingContract,
} from 'apis/mem/ScrMem9999Api';

import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

import { GridColumnGroupingModel, useGridApiRef } from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';

/**
 * 検索条件データモデル
 */
interface SearchModel {
  // 法人ID
  corporationId: string;

  // オークション取引履歴セクション
  // 請求先IDリスト
  auctionDealHistoryBillingIdList: string[];
  // 契約IDリスト
  auctionDealHistoryContractIdList: string[];
  // オークション種類リスト
  auctionKindList: string[];
  // 表示開始期間（年）
  auctionDealHistoryDisplayStartPeriodYear: string;
  // 表示開始期間（月）
  auctionDealHistoryDisplayStartPeriodMonth: string;
  // 表示終了期間（年）
  auctionDealHistoryDisplayEndPeriodYear: string;
  // 表示終了期間（月）
  auctionDealHistoryDisplayEndPeriodMonth: string;

  // 一般請求取引履歴セクション
  // 請求先IDリスト
  billingDealHistoryBillingIdList: string[];
  // 契約IDリスト
  billingDealHistoryContractIdList: string[];
  // 表示開始期間（年）
  billingDealHistoryDisplayStartPeriodYear: string;
  // 表示開始期間（月）
  billingDealHistoryDisplayStartPeriodMonth: string;
  // 表示終了期間（年）
  billingDealHistoryDisplayEndPeriodYear: string;
  // 表示終了期間（月）
  billingDealHistoryDisplayEndPeriodMonth: string;

  // 代行請求履歴セクション
  // 請求先IDリスト
  proxyBillingHistoryBillingIdList: string[];
  // 契約IDリスト
  proxyBillingHistoryContractIdList: string[];
  // 表示開始期間（年）
  proxyBillingHistoryDisplayStartPeriodYear: string;
  // 表示開始期間（月）
  proxyBillingHistoryDisplayStartPeriodMonth: string;
  // 表示終了期間（年）
  proxyBillingHistoryDisplayEndPeriodYear: string;
  // 表示終了期間（月）
  proxyBillingHistoryDisplayEndPeriodMonth: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  useBillingIdSelectValues: SelectValue[];
  useContractIdSelectValues: SelectValue[];
  useAuctionKindSelectValues: SelectValue[];
  useYearSelectValues: SelectValue[];
  useMonthSelectValues: SelectValue[];
}

/**
 * 検索条件初期データ
 */
const SearchLogisticsBaseinitialValues: SearchModel = {
  corporationId: '',
  auctionDealHistoryBillingIdList: [],
  auctionDealHistoryContractIdList: [],
  auctionKindList: [],
  auctionDealHistoryDisplayStartPeriodYear: '',
  auctionDealHistoryDisplayStartPeriodMonth: '',
  auctionDealHistoryDisplayEndPeriodYear: '',
  auctionDealHistoryDisplayEndPeriodMonth: '',

  billingDealHistoryBillingIdList: [],
  billingDealHistoryContractIdList: [],
  billingDealHistoryDisplayStartPeriodYear: '',
  billingDealHistoryDisplayStartPeriodMonth: '',
  billingDealHistoryDisplayEndPeriodYear: '',
  billingDealHistoryDisplayEndPeriodMonth: '',

  proxyBillingHistoryBillingIdList: [],
  proxyBillingHistoryContractIdList: [],
  proxyBillingHistoryDisplayStartPeriodYear: '',
  proxyBillingHistoryDisplayStartPeriodMonth: '',
  proxyBillingHistoryDisplayEndPeriodYear: '',
  proxyBillingHistoryDisplayEndPeriodMonth: '',
};

/**
 * プルダウン初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  useBillingIdSelectValues: [],
  useContractIdSelectValues: [],
  useAuctionKindSelectValues: [],
  useYearSelectValues: [],
  useMonthSelectValues: [],
};

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  auctionDealHistoryBillingIdList: yup.array().label('請求先ID'),
  auctionDealHistoryContractIdList: yup.array().label('契約ID'),
  auctionKindList: yup.array().label('オークション種類'),
  auctionDealHistoryDisplayStartPeriodYear: yup
    .string()
    .label('表示開始期間（年）'),
  auctionDealHistoryDisplayStartPeriodMonth: yup
    .string()
    .label('表示開始期間（月）'),
  auctionDealHistoryDisplayEndPeriodYear: yup
    .string()
    .label('表示終了期間（年）'),
  auctionDealHistoryDisplayEndPeriodMonth: yup
    .string()
    .label('表示終了期間（月）'),
  billingDealHistoryBillingIdList: yup.array().label('請求先ID'),
  billingDealHistoryContractIdList: yup.array().label('契約ID'),
  billingDealHistoryDisplayStartPeriodYear: yup
    .string()
    .label('表示開始期間（年）'),
  billingDealHistoryDisplayStartPeriodMonth: yup
    .string()
    .label('表示開始期間（月）'),
  billingDealHistoryDisplayEndPeriodYear: yup
    .string()
    .label('表示終了期間（年）'),
  billingDealHistoryDisplayEndPeriodMonth: yup
    .string()
    .label('表示終了期間（月）'),
  proxyBillingHistoryBillingIdList: yup.array().label('請求先ID'),
  proxyBillingHistoryContractIdList: yup.array().label('契約ID'),
  proxyBillingHistoryDisplayStartPeriodYear: yup
    .string()
    .label('表示開始期間（年）'),
  proxyBillingHistoryDisplayStartPeriodMonth: yup
    .string()
    .label('表示開始期間（月）'),
  proxyBillingHistoryDisplayEndPeriodYear: yup
    .string()
    .label('表示終了期間（年）'),
  proxyBillingHistoryDisplayEndPeriodMonth: yup
    .string()
    .label('表示終了期間（月）'),
};

/**
 * オークション取引履歴列定義
 */
const auctionDealHistoryColumns: GridColDef[] = [
  {
    field: 'dealYm',
    headerName: '取引年月',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    size: 's',
  },
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 's',
  },
  {
    field: 'exhibitCount',
    headerName: '出品台数',
    size: 's',
  },
  {
    field: 'purchaseCount',
    headerName: '成約台数',
    size: 's',
  },
  {
    field: 'purchaseAmount',
    headerName: '成約金額',
    size: 's',
  },
  {
    field: 'purchaseClaimCount',
    headerName: '成約クレーム数',
    size: 'm',
  },
  {
    field: 'documentDelayCount',
    headerName: '書類遅延台数',
    size: 'm',
  },
  {
    field: 'bidCount',
    headerName: '落札台数',
    size: 's',
  },
  {
    field: 'bidAmount',
    headerName: '落札金額',
    size: 's',
  },
  {
    field: 'arrearsCount',
    headerName: '延滞回数',
    size: 's',
  },
  {
    field: 'day1ArrearsCount',
    headerName: '遅延状況件数（1日）',
    size: 'm',
  },
  {
    field: 'day3ArrearsCount',
    headerName: '遅延状況件数（2-3日）',
    size: 'm',
  },
  {
    field: 'day7ArrearsCount',
    headerName: '遅延状況件数（4-7日）',
    size: 'm',
  },
  {
    field: 'day14ArrearsCount',
    headerName: '遅延状況件数（8-14日）',
    size: 'm',
  },
  {
    field: 'day15ArrearsCount',
    headerName: '遅延状況件数（15日-）',
    size: 'm',
  },
];

/**
 * オークション取引履歴列グループ定義
 */
const auctionDealHistoryColumnGroups: GridColumnGroupingModel = [
  {
    groupId: ' ',
    children: [
      { field: 'dealYm' },
      { field: 'billingId' },
      { field: 'contractId' },
      { field: 'exhibitCount' },
      { field: 'purchaseCount' },
      { field: 'purchaseAmount' },
      { field: 'purchaseClaimCount' },
      { field: 'documentDelayCount' },
      { field: 'bidCount' },
      { field: 'bidAmount' },
      { field: 'arrearsCount' },
    ],
  },
  {
    groupId: '延滞状況',
    children: [
      { field: 'day1ArrearsCount' },
      { field: 'day3ArrearsCount' },
      { field: 'day7ArrearsCount' },
      { field: 'day14ArrearsCount' },
      { field: 'day15ArrearsCount' },
    ],
  },
];

/**
 *一般請求取引履歴列定義
 */
const billingDealHistoryColumns: GridColDef[] = [
  {
    field: 'dealYm',
    headerName: '取引年月',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    size: 's',
  },
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 's',
  },
  {
    field: 'claimCount',
    headerName: '請求件数',
    size: 's',
  },
  {
    field: 'claimAmount',
    headerName: '請求金額',
    size: 's',
  },
  {
    field: 'arrearsCount',
    headerName: '延滞回数',
    size: 's',
  },
  {
    field: 'day1ArrearsCount',
    headerName: '遅延状況件数（1日）',
    size: 'm',
  },
  {
    field: 'day3ArrearsCount',
    headerName: '遅延状況件数（2-3日）',
    size: 'm',
  },
  {
    field: 'day7ArrearsCount',
    headerName: '遅延状況件数（4-7日）',
    size: 'm',
  },
  {
    field: 'day14ArrearsCount',
    headerName: '遅延状況件数（8-14日）',
    size: 'm',
  },
  {
    field: 'day15ArrearsCount',
    headerName: '遅延状況件数（15日-）',
    size: 'm',
  },
];

/**
 * 一般請求取引履歴列グループ定義
 */
const billingDealHistoryColumnGroups: GridColumnGroupingModel = [
  {
    groupId: ' ',
    children: [
      { field: 'dealYm' },
      { field: 'billingId' },
      { field: 'contractId' },
      { field: 'claimCount' },
      { field: 'claimAmount' },
      { field: 'arrearsCount' },
    ],
  },
  {
    groupId: '延滞状況',
    children: [
      { field: 'day1ArrearsCount' },
      { field: 'day3ArrearsCount' },
      { field: 'day7ArrearsCount' },
      { field: 'day14ArrearsCount' },
      { field: 'day15ArrearsCount' },
    ],
  },
];

/**
 * 代行請求履歴列定義
 */
const proxyBillingHistoryColumns: GridColDef[] = [
  {
    field: 'dealYm',
    headerName: '取引年月',
    size: 's',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    size: 's',
  },
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 'm',
  },
  {
    field: 'goodsClaim',
    headerName: '請求会費内容',
    size: 'm',
  },
  {
    field: 'claimAmount',
    headerName: '請求金額',
    size: 's',
  },
  {
    field: 'transferProcessResult',
    headerName: '振替処理結果',
    size: 'm',
  },
];

/**
 * オークション取引履歴一覧モデル
 */
interface auctionDealHistoryModel {
  id: string;
  dealYm: string;
  billingId: string;
  contractId: string;
  exhibitCount: number | string;
  purchaseCount: number | string;
  purchaseAmount: string;
  purchaseClaimCount: number | string;
  documentDelayCount: number | string;
  bidCount: number | string;
  bidAmount: string;
  arrearsCount: number | string;
  day1ArrearsCount: number | string;
  day3ArrearsCount: number | string;
  day7ArrearsCount: number | string;
  day14ArrearsCount: number | string;
  day15ArrearsCount: number | string;
}

/**
 * 一般請求取引履歴一覧モデル
 */
interface billingDealHistoryModel {
  id: string;
  dealYm: string;
  billingId: string;
  contractId: string;
  claimCount: number | string;
  claimAmount: string;
  arrearsCount: number | string;
  day1ArrearsCount: number | string;
  day3ArrearsCount: number | string;
  day7ArrearsCount: number | string;
  day14ArrearsCount: number | string;
  day15ArrearsCount: number | string;
}

/**
 * 代行請求履歴一覧モデル
 */
interface proxyBillingHistoryModel {
  id: string;
  dealYm: string;
  billingId: string;
  contractId: string;
  goodsClaim: string;
  claimAmount: string;
  transferProcessResult: string;
}

/**
 * オークション取引履歴一覧ヘッダー初期データ
 */
const auctionDealHistoryHeaderRowInitialValues: auctionDealHistoryModel = {
  id: '',
  dealYm: '',
  billingId: '',
  contractId: '',
  exhibitCount: '',
  purchaseCount: '',
  purchaseAmount: '',
  purchaseClaimCount: '',
  documentDelayCount: '',
  bidCount: '',
  bidAmount: '',
  arrearsCount: '',
  day1ArrearsCount: '',
  day3ArrearsCount: '',
  day7ArrearsCount: '',
  day14ArrearsCount: '',
  day15ArrearsCount: '',
};

/**
 * 一般請求取引履歴一覧ヘッダー初期データ
 */
const billingDealHistoryHeaderRowInitialValues: billingDealHistoryModel = {
  id: '',
  dealYm: '',
  billingId: '',
  contractId: '',
  claimCount: '',
  claimAmount: '',
  arrearsCount: '',
  day1ArrearsCount: '',
  day3ArrearsCount: '',
  day7ArrearsCount: '',
  day14ArrearsCount: '',
  day15ArrearsCount: '',
};

/**
 * 検索条件モデルからオークション取引履歴取得APIリクエストへの変換
 */
const convertFromSearchAuctionDealHistory = (
  search: SearchModel
): ScrMem0003SearchAuctionDealHistoryRequest => {
  return {
    // 法人ID
    corporationId: search.corporationId,
    // 請求先IDリスト
    billingIdList: search.auctionDealHistoryBillingIdList,
    // 契約IDリスト
    contractIdList: search.auctionDealHistoryContractIdList,
    // オークション種類リスト
    auctionKindList: search.auctionKindList,
    // 表示開始期間
    displayStartPeriod:
      search.auctionDealHistoryDisplayStartPeriodYear +
      search.auctionDealHistoryDisplayStartPeriodMonth,
    // 表示終了期間
    displayEndPeriod:
      search.auctionDealHistoryDisplayEndPeriodYear +
      search.auctionDealHistoryDisplayEndPeriodMonth,
    // 制限件数
    limit: 0,
  };
};

/**
 * 検索条件モデルから一般請求取引履歴取得APIリクエストへの変換
 */
const convertFromSearchBillingDealHistory = (
  search: SearchModel
): ScrMem0003SearchBillingDealHistoryRequest => {
  return {
    corporationId: search.corporationId,
    billingIdList: search.billingDealHistoryBillingIdList,
    contractIdList: search.billingDealHistoryContractIdList,
    displayStartPeriod:
      search.billingDealHistoryDisplayStartPeriodYear +
      search.billingDealHistoryDisplayStartPeriodMonth,
    displayEndPeriod:
      search.billingDealHistoryDisplayEndPeriodYear +
      search.billingDealHistoryDisplayEndPeriodMonth,
    limit: 0,
  };
};

/**
 * 検索条件モデルから代行請求履歴取得APIリクエストへの変換
 */
const convertFromSearchProxyBillingHistory = (
  search: SearchModel
): ScrMem0003SearchProxyBillingHistoryRequest => {
  return {
    corporationId: search.corporationId,
    billingIdList: search.billingDealHistoryBillingIdList,
    contractIdList: search.billingDealHistoryContractIdList,
    displayStartPeriod:
      search.billingDealHistoryDisplayStartPeriodYear +
      search.billingDealHistoryDisplayStartPeriodMonth,
    displayEndPeriod:
      search.billingDealHistoryDisplayEndPeriodYear +
      search.billingDealHistoryDisplayEndPeriodMonth,
    limit: 0,
  };
};

/**
 * オークション取引履歴取得APIリクエストからオークション取引履歴一覧への変換
 */
const convertToAuctionDealHistoryModel = (
  response: ScrMem0003SearchAuctionDealHistoryResponse
): auctionDealHistoryModel[] => {
  return response.auctionDealHistory.map((x) => {
    return {
      id: x.dealYm + x.billingId + x.contractId,
      dealYm:
        x.dealYm.substring(0, 4) +
        '年' +
        x.dealYm.substring(4).replace(/^0+/, '') +
        '月',
      billingId: x.billingId,
      contractId: x.contractId,
      exhibitCount: x.exhibitCount,
      purchaseCount: x.purchaseCount,
      purchaseAmount: x.purchaseAmount.toLocaleString(),
      purchaseClaimCount: x.purchaseClaimCount,
      documentDelayCount: x.documentDelayCount,
      bidCount: x.bidCount,
      bidAmount: x.bidAmount.toLocaleString(),
      arrearsCount: x.arrearsCount,
      day1ArrearsCount: x.day1ArrearsCount,
      day3ArrearsCount: x.day3ArrearsCount,
      day7ArrearsCount: x.day7ArrearsCount,
      day14ArrearsCount: x.day14ArrearsCount,
      day15ArrearsCount: x.day15ArrearsCount,
    };
  });
};

/**
 * 一般請求取引履歴取得APIリクエストから一般請求取引履歴一覧モデルへの変換
 */
const convertToBillingDealHistoryModel = (
  response: ScrMem0003SearchBillingDealHistoryResponse
): billingDealHistoryModel[] => {
  return response.billingDealHistory.map((x) => {
    return {
      id: x.dealYm + x.billingId + x.contractId,
      dealYm:
        x.dealYm.substring(0, 4) +
        '年' +
        x.dealYm.substring(4).replace(/^0+/, '') +
        '月',
      billingId: x.billingId,
      contractId: x.contractId,
      claimCount: x.claimCount,
      claimAmount: x.claimAmount.toLocaleString(),
      arrearsCount: x.arrearsCount,
      day1ArrearsCount: x.day1ArrearsCount,
      day3ArrearsCount: x.day3ArrearsCount,
      day7ArrearsCount: x.day7ArrearsCount,
      day14ArrearsCount: x.day14ArrearsCount,
      day15ArrearsCount: x.day15ArrearsCount,
    };
  });
};

/**
 * 代行請求履歴取得APIリクエストから代行請求履歴一覧モデルへの変換
 */
const convertToProxyBillingHistoryModel = (
  response: ScrMem0003SearchProxyBillingHistoryResponse
): proxyBillingHistoryModel[] => {
  return response.proxyBillingHistory.map((x) => {
    return {
      id: x.dealYm + x.billingId + x.contractId,
      dealYm:
        x.dealYm.substring(0, 4) +
        '年' +
        x.dealYm.substring(4).replace(/^0+/, '') +
        '月',
      billingId: x.billingId,
      contractId: x.contractId,
      goodsClaim: x.goodsClaim,
      claimAmount: x.claimAmount.toLocaleString(),
      transferProcessResult: x.transferProcessResult,
    };
  });
};

type key = keyof SearchModel;

const auctionDealHistorySerchData: { label: string; name: key }[] = [
  { label: '請求先ID', name: 'auctionDealHistoryBillingIdList' },
  { label: '契約ID', name: 'auctionDealHistoryContractIdList' },
  { label: 'オークション種類', name: 'auctionKindList' },
  {
    label: '表示開始期間（年）',
    name: 'auctionDealHistoryDisplayStartPeriodYear',
  },
  {
    label: '表示開始期間（月）',
    name: 'auctionDealHistoryDisplayStartPeriodMonth',
  },
  {
    label: '表示終了期間（年）',
    name: 'auctionDealHistoryDisplayEndPeriodYear',
  },
  {
    label: '表示終了期間（月））',
    name: 'auctionDealHistoryDisplayEndPeriodMonth',
  },
];

const billingDealHistorySerchData: { label: string; name: key }[] = [
  { label: '請求先ID', name: 'billingDealHistoryBillingIdList' },
  { label: '契約ID', name: 'billingDealHistoryContractIdList' },
  {
    label: '表示開始期間（年）',
    name: 'billingDealHistoryDisplayStartPeriodYear',
  },
  {
    label: '表示開始期間（月）',
    name: 'billingDealHistoryDisplayStartPeriodMonth',
  },
  {
    label: '表示終了期間（年）',
    name: 'billingDealHistoryDisplayEndPeriodYear',
  },
  {
    label: '表示終了期間（月））',
    name: 'billingDealHistoryDisplayEndPeriodMonth',
  },
];

const proxyBillingHistorySerchData: { label: string; name: key }[] = [
  { label: '請求先ID', name: 'proxyBillingHistoryBillingIdList' },
  { label: '契約ID', name: 'proxyBillingHistoryContractIdList' },
  {
    label: '表示開始期間（年）',
    name: 'proxyBillingHistoryDisplayStartPeriodYear',
  },
  {
    label: '表示開始期間（月）',
    name: 'proxyBillingHistoryDisplayStartPeriodMonth',
  },
  {
    label: '表示終了期間（年）',
    name: 'proxyBillingHistoryDisplayEndPeriodYear',
  },
  {
    label: '表示終了期間（月））',
    name: 'proxyBillingHistoryDisplayEndPeriodMonth',
  },
];

const ScrMem0003DealHistoryTab = () => {
  // router
  const { corporationId } = useParams();
  const { getMessage } = useContext(MessageContext);
  const { user } = useContext(AuthContext);
  const apiRefAuctionDealHistory = useGridApiRef();
  const apiRefBillingDealHistory = useGridApiRef();
  const apiRefProxyBillingHistory = useGridApiRef();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [auctionDealHistoryRows, setAuctionDealHistoryRows] = useState<
    auctionDealHistoryModel[]
  >([]);
  const [auctionDealHistoryHrefs, setAuctionDealHistoryHrefs] = useState<
    GridHrefsModel[]
  >([]);
  const [auctionDealHistoryHeaderRow, setAuctionDealHistoryHeaderRow] =
    useState<auctionDealHistoryModel>(auctionDealHistoryHeaderRowInitialValues);
  const [billingDealHistoryRows, setBillingDealHistoryRows] = useState<
    billingDealHistoryModel[]
  >([]);
  const [billingDealHistoryHrefs, setBillingDealHistoryHrefs] = useState<
    GridHrefsModel[]
  >([]);
  const [billingDealHistoryHeaderRow, setBillingDealHistoryHeaderRow] =
    useState<billingDealHistoryModel>(billingDealHistoryHeaderRowInitialValues);
  const [proxyBillingHistoryRows, setProxyBillingHistoryRows] = useState<
    proxyBillingHistoryModel[]
  >([]);
  const [openAuctionDealHistorySection, setOpenAuctionDealHistorySection] =
    useState<boolean>(true);
  const [openBillingDealHistorySection, setOpenBillingDealHistorySection] =
    useState<boolean>(true);
  const [openProxyBillingHistorySection, setOpenProxyBillingHistorySection] =
    useState<boolean>(true);
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<SearchModel>({
    defaultValues: SearchLogisticsBaseinitialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const { getValues, setValue } = methods;

  // 初期表示処理
  useEffect(() => {
    const initialize = async (corporationId: string) => {
      const getBillRequest = {
        corporationId: corporationId,
        sortKey: '',
        sortDirection: '',
      };
      const getBillResponse = await ScrMem9999GetBill(getBillRequest);
      const useBillingIdSelectValues = getBillResponse.list.map((x) => {
        return {
          value: x,
          displayValue: x,
        };
      });

      const getLogisticsBaseRepresentativeContractRequest = {
        corporationId: corporationId,
        businessDate: new Date(user.taskDate),
      };
      const getLogisticsBaseRepresentativeContractResponse =
        await ScrMem9999GetBillingContract(
          getLogisticsBaseRepresentativeContractRequest
        );
      const useContractIdSelectValues =
        getLogisticsBaseRepresentativeContractResponse.contractIdList.map(
          (x) => {
            return {
              value: x,
              displayValue: x,
            };
          }
        );

      const scrCom9999GetCodeManagementMasterRequest: ScrCom9999GetCodeManagementMasterRequest =
        {
          codeId: 'CDE-COM-0066',
        };
      const codeManagementMasterResponse =
        await ScrCom9999GetCodeManagementMaster(
          scrCom9999GetCodeManagementMasterRequest
        );

      const years: SelectValue[] = [];
      const year = new Date().getFullYear();
      for (let i = 0; i < 4; i++) {
        years.push({
          value: (year + i).toString(),
          displayValue: (year + i).toString(),
        });
      }

      const months: SelectValue[] = [];
      for (let i = 1; i < 13; i++) {
        months.push({
          value: i.toString(),
          displayValue: i.toString(),
        });
      }
      setSelectValues({
        useBillingIdSelectValues: useBillingIdSelectValues,
        useContractIdSelectValues: useContractIdSelectValues,
        useAuctionKindSelectValues:
          codeManagementMasterResponse.searchGetCodeManagementMasterListbox.map(
            (x) => {
              return {
                value: x.codeValue,
                displayValue: x.codeName,
              };
            }
          ),
        useYearSelectValues: years,
        useMonthSelectValues: months,
      });

      setValue('corporationId', corporationId);
    };
    if (corporationId === 'new') return;

    if (corporationId !== undefined) {
      initialize(corporationId);
    }
  }, [corporationId]);

  /**
   * オークション取引履歴検索押下イベント
   */
  const auctionDealHistorySearchClick = async () => {
    // オークション取引履歴取得
    const request = convertFromSearchAuctionDealHistory(getValues());
    const response = await ScrMem0003SearchAuctionDealHistory(request);
    const auctionDealHistory = convertToAuctionDealHistoryModel(response);
    setAuctionDealHistoryRows(auctionDealHistory);
    setAuctionDealHistoryHeaderRow({
      id: '',
      dealYm: '',
      billingId: '',
      contractId: '',
      exhibitCount: response.exhibitCountTotal,
      purchaseCount: response.purchaseCountTotal,
      purchaseAmount: response.purchaseAmountTotalTotal.toString(),
      purchaseClaimCount: response.purchaseClaimCountTotal,
      documentDelayCount: response.documentDelayCountTotal,
      bidCount: response.bidCountTotal,
      bidAmount: response.bidAmountTotal.toString(),
      arrearsCount: response.arrearsCountTotal,
      day1ArrearsCount: response.day1ArrearsCountTotal,
      day3ArrearsCount: response.day3ArrearsCountTotal,
      day7ArrearsCount: response.day7ArrearsCountTotal,
      day14ArrearsCount: response.day14ArrearsCountTotal,
      day15ArrearsCount: response.day15ArrearsCountTotal,
    });

    const hrefs = auctionDealHistory.map((x) => {
      return {
        id: x.id,
        href: '/tra/ledgers',
      };
    });
    setAuctionDealHistoryHrefs([
      {
        field: 'dealYm',
        hrefs: hrefs,
      },
    ]);

    // 制限件数 <  取得件数の場合
    if (response.limitCount < response.acquisitionCount) {
      // メッセージ取得機能へ引数を渡しメッセージを取得する
      const messege = Format(getMessage('MSG-FR-INF-00003'), [
        '一般請求取引履歴',
        response.acquisitionCount.toString(),
        response.responseCount.toString(),
      ]);
      // ダイアログを表示
      setTitle(messege);
      setHandleDialog(true);
    }

    setOpenAuctionDealHistorySection(false);
  };

  /**
   * 一般請求取引履歴検索押下イベント
   */
  const billingDealHistorySearchClick = async () => {
    // 一般請求取引履歴取得
    const request = convertFromSearchBillingDealHistory(getValues());
    const response = await ScrMem0003SearchBillingDealHistory(request);
    const billingDealHistory = convertToBillingDealHistoryModel(response);
    setBillingDealHistoryRows(billingDealHistory);
    setBillingDealHistoryHeaderRow({
      id: '',
      dealYm: '',
      billingId: '',
      contractId: '',
      claimCount: response.claimCountTotal,
      claimAmount: response.claimAmountTotal.toString(),
      arrearsCount: response.arrearsCountTotal,
      day1ArrearsCount: response.day1ArrearsCountTotal,
      day3ArrearsCount: response.day3ArrearsCountTotal,
      day7ArrearsCount: response.day7ArrearsCountTotal,
      day14ArrearsCount: response.day14ArrearsCountTotal,
      day15ArrearsCount: response.day15ArrearsCountTotal,
    });

    const hrefs = billingDealHistory.map((x) => {
      return {
        id: x.id,
        href: '/tra/invoices',
      };
    });
    setBillingDealHistoryHrefs([
      {
        field: 'dealYm',
        hrefs: hrefs,
      },
    ]);

    // 制限件数 <  取得件数の場合
    if (response.limitCount < response.acquisitionCount) {
      // メッセージ取得機能へ引数を渡しメッセージを取得する
      const messege = Format(getMessage('MSG-FR-INF-00003'), [
        '一般請求取引履歴',
        response.acquisitionCount.toString(),
        response.responseCount.toString(),
      ]);
      // ダイアログを表示
      setTitle(messege);
      setHandleDialog(true);
    }

    setOpenBillingDealHistorySection(false);
  };

  /**
   * 代行請求履歴検索押下イベント
   */
  const proxyBillingHistorySearchClick = async () => {
    // 代行請求履歴取得
    const request = convertFromSearchProxyBillingHistory(getValues());
    const response = await ScrMem0003SearchProxyBillingHistory(request);
    const proxyBillingHistory = convertToProxyBillingHistoryModel(response);
    setProxyBillingHistoryRows(proxyBillingHistory);

    // 制限件数 <  取得件数の場合
    if (response.limitCount < response.acquisitionCount) {
      // メッセージ取得機能へ引数を渡しメッセージを取得する
      const messege = Format(getMessage('MSG-FR-INF-00003'), [
        '代行請求履歴',
        response.acquisitionCount.toString(),
        response.responseCount.toString(),
      ]);
      // ダイアログを表示
      setTitle(messege);
      setHandleDialog(true);
    }

    setOpenProxyBillingHistorySection(false);
  };

  /**
   * CSV出力リック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = (
    apiRef: React.MutableRefObject<GridApiPro>
  ) => {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const fileName =
      'SCR-MEM-0003_' +
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
   * Sectionを閉じた際のラベル作成
   */
  const auctionDealHistorySerchLabels = auctionDealHistorySerchData.map(
    (val, index) => {
      let nameVal = getValues(val.name);

      if (val.name === 'auctionDealHistoryBillingIdList') {
        const nameValues: string[] = [];
        selectValues.useBillingIdSelectValues.filter((x) => {
          if (typeof nameVal !== 'string') {
            nameVal.map((f) => {
              if (x.value === f) {
                nameValues.push(x.displayValue);
              }
            });
          }
        });
        nameVal = nameValues.join(',');
      }

      if (val.name === 'auctionDealHistoryContractIdList') {
        const nameValues: string[] = [];
        selectValues.useContractIdSelectValues.filter((x) => {
          if (typeof nameVal !== 'string') {
            nameVal.map((f) => {
              if (x.value === f) {
                nameValues.push(x.displayValue);
              }
            });
          }
        });
        nameVal = nameValues.join(',');
      }

      if (val.name === 'auctionKindList') {
        const nameValues: string[] = [];
        selectValues.useAuctionKindSelectValues.filter((x) => {
          if (typeof nameVal !== 'string') {
            nameVal.map((f) => {
              if (x.value === f) {
                nameValues.push(x.displayValue);
              }
            });
          }
        });
        nameVal = nameValues.join(',');
      }

      if (val.name === 'auctionDealHistoryDisplayStartPeriodYear') {
        const filter = selectValues.useYearSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      if (val.name === 'auctionDealHistoryDisplayStartPeriodMonth') {
        const filter = selectValues.useMonthSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      if (val.name === 'auctionDealHistoryDisplayEndPeriodYear') {
        const filter = selectValues.useYearSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      if (val.name === 'auctionDealHistoryDisplayEndPeriodMonth') {
        const filter = selectValues.useMonthSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      return (
        nameVal && (
          <SerchLabelText key={index} label={val.label} name={nameVal} />
        )
      );
    }
  );

  const billingDealHistorySerchLabels = billingDealHistorySerchData.map(
    (val, index) => {
      let nameVal = getValues(val.name);

      if (val.name === 'billingDealHistoryBillingIdList') {
        const nameValues: string[] = [];
        selectValues.useBillingIdSelectValues.filter((x) => {
          if (typeof nameVal !== 'string') {
            nameVal.map((f) => {
              if (x.value === f) {
                nameValues.push(x.displayValue);
              }
            });
          }
        });
        nameVal = nameValues.join(',');
      }

      if (val.name === 'billingDealHistoryContractIdList') {
        const nameValues: string[] = [];
        selectValues.useContractIdSelectValues.filter((x) => {
          if (typeof nameVal !== 'string') {
            nameVal.map((f) => {
              if (x.value === f) {
                nameValues.push(x.displayValue);
              }
            });
          }
        });
        nameVal = nameValues.join(',');
      }

      if (val.name === 'billingDealHistoryDisplayStartPeriodYear') {
        const filter = selectValues.useYearSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      if (val.name === 'billingDealHistoryDisplayStartPeriodMonth') {
        const filter = selectValues.useMonthSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      if (val.name === 'billingDealHistoryDisplayEndPeriodYear') {
        const filter = selectValues.useYearSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      if (val.name === 'billingDealHistoryDisplayEndPeriodMonth') {
        const filter = selectValues.useMonthSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      return (
        nameVal && (
          <SerchLabelText key={index} label={val.label} name={nameVal} />
        )
      );
    }
  );

  const proxyBillingHistorySerchLabels = proxyBillingHistorySerchData.map(
    (val, index) => {
      let nameVal = getValues(val.name);

      if (val.name === 'proxyBillingHistoryBillingIdList') {
        const nameValues: string[] = [];
        selectValues.useBillingIdSelectValues.filter((x) => {
          if (typeof nameVal !== 'string') {
            nameVal.map((f) => {
              if (x.value === f) {
                nameValues.push(x.displayValue);
              }
            });
          }
        });
        nameVal = nameValues.join(',');
      }

      if (val.name === 'proxyBillingHistoryContractIdList') {
        const nameValues: string[] = [];
        selectValues.useContractIdSelectValues.filter((x) => {
          if (typeof nameVal !== 'string') {
            nameVal.map((f) => {
              if (x.value === f) {
                nameValues.push(x.displayValue);
              }
            });
          }
        });
        nameVal = nameValues.join(',');
      }

      if (val.name === 'proxyBillingHistoryDisplayStartPeriodYear') {
        const filter = selectValues.useYearSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      if (val.name === 'proxyBillingHistoryDisplayStartPeriodMonth') {
        const filter = selectValues.useMonthSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      if (val.name === 'proxyBillingHistoryDisplayEndPeriodYear') {
        const filter = selectValues.useYearSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      if (val.name === 'proxyBillingHistoryDisplayEndPeriodMonth') {
        const filter = selectValues.useMonthSelectValues.filter((x) => {
          return nameVal === x.value;
        });
        filter.map((x) => {
          nameVal = x.displayValue;
        });
      }

      return (
        nameVal && (
          <SerchLabelText key={index} label={val.label} name={nameVal} />
        )
      );
    }
  );

  return (
    <>
      <MainLayout>
        {/* main*/}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* オークション取引履歴セクション */}
            <Section name='オークション取引履歴' fitInside={true}>
              {/* 検索条件セクション */}
              <Section
                name='検索条件'
                isSearch
                serchLabels={auctionDealHistorySerchLabels}
                openable={openAuctionDealHistorySection}
              >
                <RowStack>
                  <ColStack>
                    <Select
                      label='請求先ID'
                      name='auctionDealHistoryBillingIdList'
                      selectValues={selectValues.useBillingIdSelectValues}
                      multiple
                    />
                    <Select
                      label='契約ID'
                      name='auctionDealHistoryContractIdList'
                      selectValues={selectValues.useContractIdSelectValues}
                      multiple
                    />
                    <Select
                      label='オークション種類'
                      name='auctionKindList'
                      selectValues={selectValues.useAuctionKindSelectValues}
                      multiple
                    />
                    <FromTo label='表示期間'>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='auctionDealHistoryDisplayStartPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                            blankOption
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='auctionDealHistoryDisplayStartPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                            blankOption
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='auctionDealHistoryDisplayEndPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                            blankOption
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='auctionDealHistoryDisplayEndPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                            blankOption
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                    </FromTo>
                  </ColStack>
                </RowStack>
                <ContentsDivider />
                <CenterBox>
                  <SearchButton
                    onClick={() => {
                      auctionDealHistorySearchClick();
                    }}
                  >
                    検索
                  </SearchButton>
                </CenterBox>
              </Section>
              {/* 検索結果セクション */}
              <Section
                name='検索結果'
                decoration={
                  <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                    <OutputButton
                      onClick={() =>
                        handleIconOutputCsvClick(apiRefAuctionDealHistory)
                      }
                      disable={auctionDealHistoryRows.length <= 0}
                    >
                      CSV出力
                    </OutputButton>
                  </MarginBox>
                }
              >
                <DataGrid
                  columns={auctionDealHistoryColumns}
                  columnGroupingModel={auctionDealHistoryColumnGroups}
                  rows={auctionDealHistoryRows}
                  hrefs={auctionDealHistoryHrefs}
                  pagination
                  showHeaderRow
                  headerRow={auctionDealHistoryHeaderRow}
                  apiRef={apiRefAuctionDealHistory}
                />
              </Section>
            </Section>
            {/* 一般請求取引履歴セクション */}
            <Section name='一般請求取引履歴'>
              {/* 検索条件セクション */}
              <Section
                name='検索条件'
                isSearch
                serchLabels={billingDealHistorySerchLabels}
                openable={openBillingDealHistorySection}
              >
                <RowStack>
                  <ColStack>
                    <Select
                      label='請求先ID'
                      name='billingDealHistoryBillingIdList'
                      selectValues={selectValues.useBillingIdSelectValues}
                      multiple
                    />
                    <Select
                      label='契約ID'
                      name='billingDealHistoryContractIdList'
                      selectValues={selectValues.useContractIdSelectValues}
                      multiple
                    />
                    <FromTo label='表示期間'>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='billingDealHistoryDisplayStartPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='billingDealHistoryDisplayStartPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='billingDealHistoryDisplayEndPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='billingDealHistoryDisplayEndPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                    </FromTo>
                  </ColStack>
                </RowStack>
                <ContentsDivider />
                <CenterBox>
                  <SearchButton
                    onClick={() => {
                      billingDealHistorySearchClick();
                    }}
                  >
                    検索
                  </SearchButton>
                </CenterBox>
              </Section>
              {/* 検索結果セクション */}
              <Section
                name='検索結果'
                decoration={
                  <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                    <OutputButton
                      onClick={() =>
                        handleIconOutputCsvClick(apiRefBillingDealHistory)
                      }
                      disable={billingDealHistoryRows.length <= 0}
                    >
                      CSV出力
                    </OutputButton>
                  </MarginBox>
                }
              >
                <DataGrid
                  columns={billingDealHistoryColumns}
                  columnGroupingModel={billingDealHistoryColumnGroups}
                  rows={billingDealHistoryRows}
                  hrefs={billingDealHistoryHrefs}
                  pagination
                  showHeaderRow
                  headerRow={billingDealHistoryHeaderRow}
                  apiRef={apiRefBillingDealHistory}
                />
              </Section>
            </Section>
            {/* 代行請求履歴セクション */}
            <Section name='代行請求履歴'>
              {/* 検索条件セクション */}
              <Section
                name='検索条件'
                isSearch
                serchLabels={proxyBillingHistorySerchLabels}
                openable={openProxyBillingHistorySection}
              >
                <RowStack>
                  <ColStack>
                    <Select
                      label='請求先ID'
                      name='proxyBillingHistoryBillingIdList'
                      selectValues={selectValues.useBillingIdSelectValues}
                      multiple
                    />
                    <Select
                      label='契約ID'
                      name='proxyBillingHistoryContractIdList'
                      selectValues={selectValues.useContractIdSelectValues}
                      multiple
                    />
                    <FromTo label='表示期間'>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='proxyBillingHistoryDisplayStartPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='proxyBillingHistoryDisplayStartPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='proxyBillingHistoryDisplayEndPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='proxyBillingHistoryDisplayEndPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{ paddingRight: '5px' }}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                    </FromTo>
                  </ColStack>
                </RowStack>
                <ContentsDivider />
                <CenterBox>
                  <SearchButton
                    onClick={() => {
                      proxyBillingHistorySearchClick();
                    }}
                  >
                    検索
                  </SearchButton>
                </CenterBox>
              </Section>
              {/* 検索結果セクション */}
              <Section
                name='検索結果'
                decoration={
                  <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                    <OutputButton
                      onClick={() =>
                        handleIconOutputCsvClick(apiRefProxyBillingHistory)
                      }
                      disable={proxyBillingHistoryRows.length <= 0}
                    >
                      CSV出力
                    </OutputButton>
                  </MarginBox>
                }
              >
                <DataGrid
                  columns={proxyBillingHistoryColumns}
                  rows={proxyBillingHistoryRows}
                  pagination
                  apiRef={apiRefProxyBillingHistory}
                />
              </Section>
            </Section>
          </FormProvider>
        </MainLayout>
      </MainLayout>

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

export default ScrMem0003DealHistoryTab;

