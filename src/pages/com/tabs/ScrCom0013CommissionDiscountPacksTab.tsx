import React, { useContext, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { MarginBox, RightBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { Stack } from 'layouts/Stack';

import { AddButton, ConfirmButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
} from 'controls/Datagrid';
import { SelectValue } from 'controls/Select';
import { Typography } from 'controls/Typography';

import {
  BasicDiscountInfo,
  deleteTargetedList,
  OptionDiscountInfo,
  registrationRequest,
  registTargetedList,
  ScrCom0013chkDiscount,
  ScrCom0013chkDiscountRequest,
  ScrCom0013DisplayComoditymanagementDiscount,
  ScrCom0013DisplayComoditymanagementDiscountRequest,
  ScrCom0013DisplayComoditymanagementDiscountResponse,
  ScrCom0013MergeDiscount,
  ScrCom0013MergeDiscountRequest,
  updateTargetedList,
} from 'apis/com/ScrCom0013Api';
import {
  courceList,
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetCodeManagementMasterRequest,
  ScrCom9999GetCoursename,
  ScrCom9999GetServiceInfo,
  SearchGetCodeManagementMasterListbox,
  serviceList,
} from 'apis/com/ScrCom9999Api';
import {
  codeList,
  ScrTra9999GetCodeValue,
  ScrTra9999GetCodeValueRequest,
} from 'apis/tra/ScrTra9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { comApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

import { GridColumnGroupingModel, useGridApiRef } from '@mui/x-data-grid-pro';
import ScrCom0032Popup, {
  errorList,
  ScrCom0032PopupModel,
} from '../popups/ScrCom0032Popup';
import ScrCom0033Popup, {
  ScrCom0033PopupModel,
} from '../popups/ScrCom0033Popup';

/**
 * データグリッドヘッダー2列目（[期間]）設定
 */
const basicColumnGroups: GridColumnGroupingModel = [
  {
    groupId: '期間',
    children: [
      { field: 'fromToRadio' },
      { field: 'LimitStartDate' },
      { field: 'dummy' },
      { field: 'LimitEndDate' },
      { field: 'numberOfMonthsFromContractDateRadio' },
      { field: 'ContractAfterMonth' },
    ],
    headerName: '期間',
    description: '',
    headerAlign: 'center',
  },
];
const optionColumnGroups: GridColumnGroupingModel = [
  {
    groupId: '期間',
    children: [
      { field: 'optionFromToRadio' },
      { field: 'optionLimitStartDate' },
      { field: 'dummy' },
      { field: 'optionLimitEndDate' },
      { field: 'optionNumberOfMonthsFromContractDateRadio' },
      { field: 'optionContractAfterMonth' },
    ],
    headerName: '期間',
    description: '',
    headerAlign: 'center',
  },
];

/**
 * form データモデル
 */
interface formModel {
  /** 基本値引値増 */
  // キャンペーンコード
  campaignCd: string;
  // キャンペーン名
  campaignName: string;
  // 会費種別
  membershipFeeType: string;
  // 値引値増金額区分
  discountDivision: string;
  // 値引値増金額
  discountAmount: number;
  // コースID
  courseId: string;
  // １本目除外フラグ
  firstExclusionFlg: string;
  // 契約数量下限
  contractQuantityLowLimit: number;
  // 契約数量上限
  contractQuantityHighLimit: number;
  // 期限開始日
  LimitStartDate: string;
  // 期限終了日
  LimitEndDate: string;
  // 契約後月数
  ContractAfterMonth: number;
  // 稟議書ID
  approvalDocumentId: string;
  // 利用フラグ
  utilizationFlg: string;
  // 商品クレームコード
  commodityCrameCd: string;
  /** オプション値引値増 */
  // キャンペーンコード
  optionCampaignCd: string;
  // キャンペーン名
  optionCampaignName: string;
  // 会費種別
  optionMembershipFeeType: string;
  // 値引値増金額区分
  optionDiscountDivision: string;
  // 値引値増金額
  optionDiscountAmount: number;
  // サービスID
  serviceId: string;
  // １本目除外フラグ
  optionFirstExclusionFlg: string;
  // 契約数量下限
  optionContractQuantityLowLimit: number;
  // 契約数量上限
  optionContractQuantityHighLimit: number;
  // 期限開始日
  optionLimitStartDate: string;
  // 期限終了日
  optionLimitEndDate: string;
  // 契約後月数
  optionContractAfterMonth: number;
  // 稟議書ID
  optionApprovalDocumentId: string;
  // 利用フラグ
  optionUtilizationFlg: string;
  // 商品クレームコード
  optionCommodityCrameCd: string;
  /** 手数料値引値増 */
  // 値引値増パックID
  commissionDiscountPackId: string;
  // パック名
  commissionPackName: string;
  // 種別
  commissionMemberServiceType: string;
  // 計算書種別
  commissionCalcurationDocType: string;
  // 有効期間
  commissionValidityStartDate: string;
  // 利用フラグ
  commissionUtilizationFlg: string;
  // 変更予約
  commissionChangeReserve: string;
}

/**
 * form 初期データ
 */
const formModelInitialValues: formModel = {
  campaignCd: '',
  // キャンペーン名
  campaignName: '',
  // 会費種別
  membershipFeeType: '',
  // 値引値増金額区分
  discountDivision: '',
  // 値引値増金額
  discountAmount: 0,
  // コースID
  courseId: '',
  // １本目除外フラグ
  firstExclusionFlg: '',
  // 契約数量下限
  contractQuantityLowLimit: 0,
  // 契約数量上限
  contractQuantityHighLimit: 0,
  // 期限開始日
  LimitStartDate: '',
  // 期限終了日
  LimitEndDate: '',
  // 契約後月数
  ContractAfterMonth: 0,
  // 稟議書ID
  approvalDocumentId: '',
  // 利用フラグ
  utilizationFlg: '',
  // 商品クレームコード
  commodityCrameCd: '',
  // キャンペーンコード
  optionCampaignCd: '',
  // キャンペーン名
  optionCampaignName: '',
  // 会費種別
  optionMembershipFeeType: '',
  // 値引値増金額区分
  optionDiscountDivision: '',
  // 値引値増金額
  optionDiscountAmount: 0,
  // サービスID
  serviceId: '',
  // １本目除外フラグ
  optionFirstExclusionFlg: '',
  // 契約数量下限
  optionContractQuantityLowLimit: 0,
  // 契約数量上限
  optionContractQuantityHighLimit: 0,
  // 期限開始日
  optionLimitStartDate: '',
  // 期限終了日
  optionLimitEndDate: '',
  // 契約後月数
  optionContractAfterMonth: 0,
  // 稟議書ID
  optionApprovalDocumentId: '',
  // 利用フラグ
  optionUtilizationFlg: '',
  // 商品クレームコード
  optionCommodityCrameCd: '',
  /** 手数料値引値増 */
  // 値引値増パックID
  commissionDiscountPackId: '',
  // パック名
  commissionPackName: '',
  // 種別
  commissionMemberServiceType: '',
  // 計算書種別
  commissionCalcurationDocType: '',
  // 有効期間
  commissionValidityStartDate: '',
  // 利用フラグ
  commissionUtilizationFlg: '',
  // 変更予約
  commissionChangeReserve: '',
};

/**
 * 会費セクション-基本値引値増 検索結果行データモデル
 */
interface searchBasicResultRowModel {
  // internalId
  id: string;
  // キャンペーンコード
  campaignCd: string;
  // キャンペーン名
  campaignName: string;
  // 会費種別
  membershipFeeType: string;
  // 値引値増金額区分
  discountDivision: string;
  // 値引値増金額
  discountAmount: number;
  // コースID
  courseId: string;
  // １本目除外フラグ
  firstExclusionFlg: string;
  // 契約数量下限
  contractQuantityLowLimit: number;
  // 契約数量上限
  contractQuantityHighLimit: number;
  // 期限開始日
  LimitStartDate: string;
  // FROMとTOの間の「～」
  dummy: string;
  // 期限終了日
  LimitEndDate: string;
  // 稟議書ID
  approvalDocumentId: string;
  // 利用フラグラジオボタン
  utilizationFlg: string;
  // 商品クレームコード
  commodityCrameCd: string;
  // FromToの手前のラジオボタン
  fromToRadio: string;
  // 契約日からの月数
  ContractAfterMonth: number;
  // 契約日からの月数の手前のラジオボタン
  numberOfMonthsFromContractDateRadio: string;
}

/**
 * 会費セクション-オプション値引値増 検索結果行データモデル
 */
interface searchOptionResultRowModel {
  // internalId
  id: string;
  // キャンペーンコード
  optionCampaignCd: string;
  // キャンペーン名
  optionCampaignName: string;
  // 会費種別
  optionMembershipFeeType: string;
  // 値引値増金額区分
  optionDiscountDivision: string;
  // 値引値増金額
  optionDiscountAmount: number;
  // サービスID
  serviceId: string;
  // １本目除外フラグ
  optionFirstExclusionFlg: string;
  // 契約数量下限
  optionContractQuantityHighLimit: number;
  // 契約数量上限
  optionContractQuantityLowLimit: number;
  // FromToの手前のラジオボタン
  optionFromToRadio: string;
  // 期限開始日
  optionLimitStartDate: string;
  // FROMとTOの間の「～」
  dummy: string;
  // 期限終了日
  optionLimitEndDate: string;
  // 契約日からの月数の手前のラジオボタン
  optionNumberOfMonthsFromContractDateRadio: string;
  // 契約日からの月数
  optionContractAfterMonth: number;
  // 稟議書ID
  optionApprovalDocumentId: string;
  // 利用フラグ
  optionUtilizationFlg: string;
  // 商品クレームコード
  optionCommodityCrameCd: string;
}

/**
 * 手数料セクション-手数料値引値増 検索結果行データモデル
 */
interface searchCommissionResultRowModel {
  // internalId
  id: string;
  // 値引値増パックID
  commissionDiscountPackId: string;
  // パック名
  commissionPackName: string;
  // 会員サービス識別区分
  commissionMemberServiceType: string;
  // 計算書種別
  commissionCalcurationDocType: string;
  // 有効期間開始日
  commissionValidityStartDate: string;
  // 有効期間終了日
  commissionValidityEndDate: string;
  // 利用フラグ
  commissionUtilizationFlg: string;
  // 変更予約
  commissionChangeReserve: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 金額(種類)
  priceSelectValues: SelectValue[];
  // セット対象コース
  setTargetCourseSelectValues: SelectValue[];
  // サービス名
  serviceNameSelectValues: SelectValue[];
  // 商品コード
  commodityCrameCdSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 金額(種類)
  priceSelectValues: [],
  // セット対象コース
  setTargetCourseSelectValues: [],
  // サービス名
  serviceNameSelectValues: [],
  // 商品コード
  commodityCrameCdSelectValues: [],
};

/**
 * 値引値増情報入力チェックAPIリクエスト用 値引値増情報リスト モデル
 */
interface discountInfoListModel {
  // キャンペーンコード
  campaignCd: string;
  // キャンペーン名
  campaignName: string;
  // 期間From
  periodFrom: string;
  // 期間To
  periodTo: string;
}

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
 * 登録内容申請ポップアップ初期データ
 */
const scrCom0033PopupInitialValues: ScrCom0033PopupModel = {
  // 画面ID
  screenId: '',
  // タブID
  tabId: 4,
  // 申請金額
  applicationMoney: 0,
};

/**
 * 画面IDの定数定義
 */
const SCR_COM_0013 = 'SCR-COM-0013';

/**
 * コードIDの定数定義
 */
const CDE_COM_0009 = 'CDE-COM-0009';
const CDE_TRA_0001 = 'CDE-TRA-0001';

/**
 * バリデーションスキーマ
 */
const validationSchema = {
  // 基本値引値増
  campaignCd: yup
    .string()
    .label('キャンペーンコード')
    .max(15)
    .half()
    .required(),
  campaignName: yup.string().label('キャンペーン名').max(30).required(),
  discountAmount: yup.string().label('金額').max(6).number().required(),
  contractQuantityLowLimit: yup
    .string()
    .label('契約本数(以下)')
    .max(4)
    .number(),
  contractQuantityHighLimit: yup
    .string()
    .label('契約本数(以上)')
    .max(4)
    .number(),
  ContractAfterMonth: yup.string().label('契約日からの月数').max(4).number(),
  approvalDocumentId: yup.string().label('稟議書ID').max(20).half(),
  // オプション値引値増
  optionCampaignCd: yup.string().label('キャンペーンコード').max(15).half(),
  optionCampaignName: yup.string().label('キャンペーン名').max(30),
  optionDiscountAmount: yup.string().label('金額').max(6).number(),
  optionContractQuantityLowLimit: yup
    .string()
    .label('契約本数(以下)')
    .max(4)
    .number(),
  optionContractQuantityHighLimit: yup
    .string()
    .label('契約本数(以上)')
    .max(4)
    .number(),
  optionContractAfterMonth: yup
    .string()
    .label('契約日からの月数')
    .max(4)
    .number(),
  optionApprovalDocumentId: yup.string().label('稟議書ID').max(20).half(),
};

/**
 * 商品管理表示API(値引値増情報表示) レスポンスから 会費セクション-基本値引値増 検索結果モデルへの変換
 */
const convertToSearchBasicResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementDiscountResponse
): searchBasicResultRowModel[] => {
  return response.basicDiscountList.map((x) => {
    return {
      id: x.campaignCd,
      campaignCd: x.campaignCd,
      campaignName: x.campaignName,
      membershipFeeType: x.membershipFeeType,
      discountDivision: x.discountDivision,
      discountAmount: x.discountAmount,
      courseId: x.courseId,
      firstExclusionFlg:
        x.firstExclusionFlg === true ? 'firstExclusionFlgRadioValue' : '',
      contractQuantityLowLimit: x.contractQuantityLowLimit,
      contractQuantityHighLimit: x.contractQuantityHighLimit,
      LimitStartDate: x.LimitStartDate,
      dummy: '～',
      LimitEndDate: x.LimitEndDate,
      ContractAfterMonth: x.ContractAfterMonth,
      approvalDocumentId: x.approvalDocumentId,
      utilizationFlg:
        x.utilizationFlg === true
          ? 'basicUtilizationFlgFlagYes'
          : x.utilizationFlg === false
          ? 'basicUtilizationFlgFlagNo'
          : '',
      commodityCrameCd: x.commodityCrameCd,
      numberOfMonthsFromContractDateRadio: '',
      fromToRadio: '',
    };
  });
};

/**
 * 会費セクション-基本値引値増 検索結果モデル から 商品管理表示API(値引値増情報表示) レスポンスへの変換
 */
const convertToBasicResponseModel = (
  response: searchBasicResultRowModel[]
): BasicDiscountInfo[] => {
  return response.map((x) => {
    return {
      campaignCd: x.campaignCd,
      campaignName: x.campaignName,
      membershipFeeType: x.membershipFeeType,
      discountDivision: x.discountDivision,
      discountAmount: x.discountAmount,
      courseId: x.courseId,
      firstExclusionFlg:
        x.firstExclusionFlg === 'firstExclusionFlgRadioValue' ? true : false,
      contractQuantityLowLimit: x.contractQuantityLowLimit,
      contractQuantityHighLimit: x.contractQuantityHighLimit,
      LimitStartDate: x.LimitStartDate,
      LimitEndDate: x.LimitEndDate,
      ContractAfterMonth: x.ContractAfterMonth,
      approvalDocumentId: x.approvalDocumentId,
      utilizationFlg:
        x.utilizationFlg === 'basicUtilizationFlgFlagYes' ? true : false,
      commodityCrameCd: x.commodityCrameCd,
    };
  });
};

/**
 * 商品管理表示API(値引値増情報表示) レスポンスから 会費セクション-オプション値引値増 検索結果モデルへの変換
 */
const convertToSearchOptionResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementDiscountResponse
): searchOptionResultRowModel[] => {
  return response.optionDiscountList.map((x) => {
    return {
      id: x.campaignCd,
      optionCampaignCd: x.campaignCd,
      optionCampaignName: x.campaignName,
      optionMembershipFeeType: x.membershipFeeType,
      optionDiscountDivision: x.discountDivision,
      optionDiscountAmount: x.discountAmount,
      serviceId: x.serviceId,
      optionFirstExclusionFlg:
        x.firstExclusionFlg === true ? 'optionFirstExclusionFlgRadioValue' : '',
      optionContractQuantityLowLimit: x.contractQuantityLowLimit,
      optionContractQuantityHighLimit: x.contractQuantityHighLimit,
      optionFromToRadio: '',
      optionLimitStartDate: x.LimitStartDate,
      dummy: '～',
      optionLimitEndDate: x.LimitEndDate,
      optionNumberOfMonthsFromContractDateRadio: '',
      optionContractAfterMonth: x.ContractAfterMonth,
      optionApprovalDocumentId: x.approvalDocumentId,
      optionUtilizationFlg:
        x.utilizationFlg === true
          ? 'optionUtilizationFlgYes'
          : x.utilizationFlg === false
          ? 'optionUtilizationFlgNo'
          : '',
      optionCommodityCrameCd: x.commodityCrameCd,
    };
  });
};

/**
 * 会費セクション-オプション値引値増 から 商品管理表示API(値引値増情報表示) レスポンスの検索結果モデルへの変換
 */
const convertToOptionResponseModel = (
  response: searchOptionResultRowModel[]
): OptionDiscountInfo[] => {
  return response.map((x) => {
    return {
      campaignCd: x.optionCampaignCd,
      campaignName: x.optionCampaignName,
      membershipFeeType: x.optionMembershipFeeType,
      discountDivision: x.optionDiscountDivision,
      discountAmount: x.optionDiscountAmount,
      serviceId: x.serviceId,
      firstExclusionFlg:
        x.optionFirstExclusionFlg === 'optionFirstExclusionFlgRadioValue'
          ? true
          : false,
      contractQuantityLowLimit: x.optionContractQuantityLowLimit,
      contractQuantityHighLimit: x.optionContractQuantityHighLimit,
      LimitStartDate: x.optionLimitStartDate,
      dummy: '～',
      LimitEndDate: x.optionLimitEndDate,
      ContractAfterMonth: x.optionContractAfterMonth,
      approvalDocumentId: x.optionApprovalDocumentId,
      utilizationFlg:
        x.optionUtilizationFlg === 'optionUtilizationFlgYes' ? true : false,
      commodityCrameCd: x.optionCommodityCrameCd,
      numberOfMonthsFromContractDateRadio: '',
      fromToRadio: '',
    };
  });
};

/**
 * 商品管理表示API(値引値増情報表示) レスポンスから 手数料セクション 検索結果モデルへの変換
 */
const convertToSearchCommissionResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementDiscountResponse
): searchCommissionResultRowModel[] => {
  return response.commissionDiscountList.map((x) => {
    return {
      id: x.commissionDiscountPackId,
      commissionDiscountPackId: x.commissionDiscountPackId,
      commissionPackName: x.packName,
      commissionMemberServiceType: x.memberServiceType,
      commissionCalcurationDocType: x.calcurationDocType,
      // 有効期間はFrom To を ~ で接続して表示
      commissionValidityStartDate:
        x.validityStartDate + ' ～ ' + x.validityEndDate,
      commissionValidityEndDate: '',
      commissionUtilizationFlg: x.utilizationFlg === true ? '可' : '不可',
      commissionChangeReserve: x.changeReserve === true ? 'あり' : '',
    };
  });
};

/**
 *  API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンスから SelectValueモデルへの変換
 */
const convertToCodeSelectValueModel = (
  SearchGetCodeManagementMasterListbox: SearchGetCodeManagementMasterListbox[]
): SelectValue[] => {
  return SearchGetCodeManagementMasterListbox.map((x) => {
    return {
      value: x.codeValue,
      displayValue: x.codeName,
    };
  });
};

/**
 *  API-COM-9999-0021: コース名情報取得API レスポンスから SelectValueモデルへの変換
 */
const convertToCourceSelectValueModel = (
  courceList: courceList[]
): SelectValue[] => {
  return courceList.map((x) => {
    return {
      value: x.codeValue,
      displayValue: x.codeName,
    };
  });
};

/**
 *  API-COM-9999-0022: サービス名情報取得API レスポンスから SelectValueモデルへの変換
 */
const convertToServiceNameSelectValueModel = (
  serviceList: serviceList[]
): SelectValue[] => {
  return serviceList.map((x) => {
    return {
      value: x.codeValue,
      displayValue: x.codeName,
    };
  });
};

/**
 * API-TRA-COM-9999-0001: コードマスタ(取引会計)情報取得API レスポンスから SelectValueモデルへの変換
 */
const convertToTraCodeValueSelectValueModel = (
  codeList: codeList[]
): SelectValue[] => {
  return codeList.map((x) => {
    return {
      value: x.code,
      displayValue: x.codeName,
    };
  });
};

/**
 * SCR-COM-0013 商品管理画面 値引値増タブ
 * @returns
 */
const ScrCom0013CommissionDiscountPacksTab = (props: {
  changeHisoryNumber: string;
  setGoodsBaseValue: (goodsBase: registrationRequest) => void;
}) => {
  /**
   * state
   */
  // リストボックス
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 基本値引値増 検索結果(初期表示時)
  const [basicSearchResult, setBasicSearchResult] = useState<
    searchBasicResultRowModel[]
  >([]);
  // オプション値引値増 検索結果(初期表示時)
  const [optionSearchResult, setOptionSearchResult] = useState<
    searchOptionResultRowModel[]
  >([]);
  // 手数料値引値増 検索結果(初期表示時)
  const [commissionSearchResult, setCommissionSearchResult] = useState<
    searchCommissionResultRowModel[]
  >([]);
  // 基本値引値増 検索結果(追加ボタンレコード挿入後)
  const [addedBasicSearchResult, setAddedBasicSearchResult] = useState<
    searchBasicResultRowModel[]
  >([]);
  // オプション値引値増 検索結果(追加ボタンレコード挿入後)
  const [addedOptionSearchResult, setAddedOptionSearchResult] = useState<
    searchOptionResultRowModel[]
  >([]);
  // href
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  // 基本値引値増・オプション値引値増 検索結果(値引値増情報入力チェックAPI用)
  const [commissionCheckSearchResult, setCommissionCheckSearchResult] =
    useState<discountInfoListModel[]>([]);
  // 追加レコード リスト(キャンペーンコードのみ)
  const [registTargetedList, setRegistTargetedList] = useState<
    registTargetedList[]
  >([]);
  // 変更レコード リスト(キャンペーンコードのみ)
  const [updateTargetedList, setUpdateTargetedList] = useState<
    updateTargetedList[]
  >([]);
  // 削除レコード リスト(キャンペーンコードのみ)
  const [deleteTargetedList, setDeleteTargetedList] = useState<
    deleteTargetedList[]
  >([]);
  // DataGrid InternalId採番用変数(基本値引値増)
  const [basicCount, setBasicCount] = useState(0);
  // DataGrid InternalId採番用変数(オプション)
  const [optionCount, setOptionCount] = useState(0);
  // 登録内容確認ポップアップ
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  // 登録内容申請ポップアップ
  const [isOpenApplicationPopup, setIsOpenApplicationPopup] = useState(false);
  const [scrCom0033PopupData, setScrCom0033PopupData] =
    useState<ScrCom0033PopupModel>(scrCom0033PopupInitialValues);
  // 登録確認ポップアップから渡される登録メモ
  const [registrationChangeMemo, setRegistrationChangeMemo] =
    useState<string>('');

  const [maxSectionWidth, setMaxSectionWidth] = useState<number>(0);

  // メッセージの取得
  const { getMessage } = useContext(MessageContext);

  // user情報(businessDateも併せて取得)
  const { user } = useContext(AuthContext);

  // ユーザーの編集権限
  const userEditFlag =
    user.editPossibleScreenIdList === undefined
      ? ''
      : user.editPossibleScreenIdList.includes(SCR_COM_0013);

  // CSV
  const apiRef = useGridApiRef();

  /**
   * router
   */
  const navigate = useNavigate();

  /**
   * form
   */
  const methods = useForm<formModel>({
    defaultValues: formModelInitialValues,
    resolver: yupResolver(yup.object(validationSchema)),
  });
  const {
    formState: { dirtyFields },
    setValue,
    getValues,
    reset,
  } = methods;

  /**
   * 会費セクション-基本値引値増 検索条件列定義
   */
  const searchBasicResultColumns: GridColDef[] = [
    {
      field: 'campaignCd',
      headerName: 'キャンペーンコード',
      size: 'l',
      cellType: 'input',
      required: true,
    },
    {
      field: 'campaignName',
      headerName: 'キャンペーン名',
      size: 'l',
      cellType: 'input',
      required: true,
    },
    {
      field: 'membershipFeeType',
      headerName: '会費種別',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'basicAdmissionFee', displayValue: '入会金' },
        { value: 'basicListPrice', displayValue: '定価' },
      ],
      required: true,
    },
    {
      field: 'discountDivision',
      headerName: '金額区分',
      cellType: 'select',
      selectValues: selectValues.priceSelectValues,
      size: 'l',
      required: true,
    },
    {
      field: 'discountAmount',
      headerName: '金額',
      cellType: [{ type: 'input', helperText: '円' }],
      size: 'l',
      required: true,
    },
    {
      field: 'courseId',
      headerName: 'セット対象コース',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.setTargetCourseSelectValues,
    },
    {
      field: 'firstExclusionFlg',
      headerName: '1本目除外',
      size: 'l',
      cellType: 'radio',
      radioValues: [{ value: 'firstExclusionFlgRadioValue' }],
    },
    {
      field: 'contractQuantityHighLimit',
      headerName: '契約本数(以上)',
      cellType: [{ type: 'input', helperText: '以上' }],
      size: 'l',
    },
    {
      field: 'contractQuantityLowLimit',
      headerName: '契約本数(以下)',
      cellType: [{ type: 'input', helperText: '以下' }],
      size: 'l',
    },
    {
      field: 'fromToRadio',
      // ラジオボタンのみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
      cellType: 'radio',
      radioValues: [{ value: 'fromToRadioValue' }],
    },
    {
      field: 'LimitStartDate',
      headerName: 'FROM',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'dummy',
      // [～]のみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
    },
    {
      field: 'LimitEndDate',
      headerName: 'TO',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'numberOfMonthsFromContractDateRadio',
      // ラジオボタンのみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
      cellType: 'radio',
      radioValues: [{ value: 'numberOfMonthsFromContractDateRadioValue' }],
    },
    {
      field: 'ContractAfterMonth',
      headerName: '契約日からの月数',
      cellType: [{ type: 'input', helperText: 'ヶ月' }],
      size: 'l',
    },
    {
      field: 'approvalDocumentId',
      headerName: '稟議書ID',
      size: 'l',
      cellType: 'input',
    },
    {
      field: 'utilizationFlg',
      headerName: '利用フラグ',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'basicUtilizationFlgFlagYes', displayValue: '可' },
        { value: 'basicUtilizationFlgFlagNo', displayValue: '不可' },
      ],
    },
    {
      field: 'commodityCrameCd',
      headerName: '商品コード',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.commodityCrameCdSelectValues,
    },
  ];

  /**
   * 会費セクション-オプション値引値増 検索条件列定義
   */
  const searchOptionResultColumns: GridColDef[] = [
    {
      field: 'optionCampaignCd',
      headerName: 'キャンペーンコード',
      size: 'l',
      cellType: 'input',
      required: true,
    },
    {
      field: 'optionCampaignName',
      headerName: 'キャンペーン名',
      size: 'l',
      cellType: 'input',
      required: true,
    },
    {
      field: 'optionMembershipFeeType',
      headerName: '会費種別',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'basicAdmissionFee', displayValue: '入会金' },
        { value: 'basicListPrice', displayValue: '定価' },
      ],
      required: true,
    },
    {
      field: 'optionDiscountDivision',
      headerName: '金額区分',
      cellType: 'select',
      selectValues: selectValues.priceSelectValues,
      size: 'l',
      required: true,
    },
    {
      field: 'optionDiscountAmount',
      headerName: '金額',
      cellType: [{ type: 'input', helperText: '円' }],
      size: 'l',
      required: true,
    },
    {
      field: 'serviceId',
      headerName: 'サービス名',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.serviceNameSelectValues,
      required: true,
    },
    {
      field: 'optionFirstExclusionFlg',
      headerName: '1本目除外',
      size: 'l',
      cellType: 'radio',
      radioValues: [{ value: 'optionFirstExclusionFlgRadioValue' }],
    },
    {
      field: 'optionContractQuantityHighLimit',
      headerName: '契約本数(以上)',
      cellType: [{ type: 'input', helperText: '以上' }],
      size: 'l',
    },
    {
      field: 'optionContractQuantityLowLimit',
      headerName: '契約本数(以下)',
      cellType: [{ type: 'input', helperText: '以下' }],
      size: 'l',
    },
    {
      field: 'optionFromToRadio',
      // ラジオボタンのみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
      cellType: 'radio',
      radioValues: [{ value: 'FromToRadioValue' }],
    },
    {
      field: 'optionLimitStartDate',
      headerName: 'FROM',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'dummy',
      // [～]のみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
    },
    {
      field: 'optionLimitEndDate',
      headerName: 'TO',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'optionNumberOfMonthsFromContractDateRadio',
      // ラジオボタンのみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
      cellType: 'radio',
      radioValues: [{ value: 'numberOfMonthsFromContractDateRadioValue' }],
    },
    {
      field: 'optionContractAfterMonth',
      headerName: '契約日からの月数',
      cellType: [{ type: 'input', helperText: 'ヶ月' }],
      size: 'l',
    },
    {
      field: 'optionApprovalDocumentId',
      headerName: '稟議書ID',
      size: 'l',
      cellType: 'input',
    },
    {
      field: 'optionUtilizationFlg',
      headerName: '利用フラグ',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'optionUtilizationFlgYes', displayValue: '可' },
        { value: 'optionUtilizationFlgNo', displayValue: '不可' },
      ],
    },
    {
      field: 'optionCommodityCrameCd',
      headerName: '商品コード',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.commodityCrameCdSelectValues,
    },
  ];

  /**
   * 手数料セクション 検索条件列定義
   */
  const searchCommissionResultColumns: GridColDef[] = [
    {
      field: 'commissionDiscountPackId',
      headerName: '値引値増パックID',
      size: 'l',
      cellType: 'link',
    },
    {
      field: 'commissionPackName',
      headerName: 'パック名',
      size: 'l',
    },
    {
      field: 'commissionMemberServiceType',
      headerName: '種別',
      size: 'l',
    },
    {
      field: 'commissionCalcurationDocType',
      headerName: '計算書種別',
      size: 'l',
    },
    {
      field: 'commissionValidityStartDate',
      headerName: '有効期間',
      size: 'l',
    },
    {
      field: 'commissionUtilizationFlg',
      headerName: '利用フラグ',
      size: 'l',
    },
    {
      field: 'commissionChangeReserve',
      headerName: '変更予約',
      size: 'l',
    },
  ];

  useEffect(() => {
    setMaxSectionWidth(
      Number(
        apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
      ) + 40
    );
  }, [apiRef, apiRef.current.rootElementRef]);

  /**
   * 初期表示
   */
  useEffect(() => {
    // 現在情報の表示
    const initialize = async () => {
      // API-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const getCodeManagementMasterListboxRequest: ScrCom9999GetCodeManagementMasterRequest =
        {
          // コードID
          codeId: CDE_COM_0009,
        };
      const response0010 = await ScrCom9999GetCodeManagementMaster(
        getCodeManagementMasterListboxRequest
      );

      // API-COM-9999-0021: コース名情報取得API
      const response0021 = await ScrCom9999GetCoursename();

      // API-COM-9999-0022: サービス名情報取得API
      const response0022 = await ScrCom9999GetServiceInfo();

      // API-TRA-9999-0001: コードマスタ（取引会計）情報取得API
      const getTraCodeValueRequest: ScrTra9999GetCodeValueRequest = {
        codes: [
          {
            // 業務日付
            validityStartDate: user.taskDate,
            codeId: CDE_TRA_0001,
          },
        ],
      };
      const response0001 = await ScrTra9999GetCodeValue(getTraCodeValueRequest);

      // リストボックスに設定
      setSelectValues({
        // 金額(種類)
        priceSelectValues: convertToCodeSelectValueModel(
          response0010.searchGetCodeManagementMasterListbox
        ),
        // セット対象コース
        setTargetCourseSelectValues: convertToCourceSelectValueModel(
          response0021.courceList
        ),
        // サービス名
        serviceNameSelectValues: convertToServiceNameSelectValueModel(
          response0022.serviceList
        ),
        // 商品コード
        commodityCrameCdSelectValues: convertToTraCodeValueSelectValueModel(
          response0001.codes[0].codeList
        ),
      });

      // SCR-COM-0013-0004：商品管理表示API(手数料情報表示）
      const displayComoditymanagementDiscountRequest: ScrCom0013DisplayComoditymanagementDiscountRequest =
        {
          /** 画面ID */
          screenId: SCR_COM_0013,
          /** タブID */
          tabId: 4,
          /** 業務日付 */
          businessDate: user.taskDate,
        };
      const response0013 = await ScrCom0013DisplayComoditymanagementDiscount(
        displayComoditymanagementDiscountRequest
      );

      // 画面にデータを設定
      // 基本値引
      const searchResult0013Basic =
        convertToSearchBasicResultRowModel(response0013);

      setBasicSearchResult(searchResult0013Basic);
      setAddedBasicSearchResult(searchResult0013Basic);

      // オプション値引
      const searchResult0013Option =
        convertToSearchOptionResultRowModel(response0013);

      setOptionSearchResult(searchResult0013Option);
      setAddedOptionSearchResult(searchResult0013Option);

      // 手数料値引
      const searchResult0013Commission =
        convertToSearchCommissionResultRowModel(response0013);
      setCommissionSearchResult(searchResult0013Commission);

      // hrefsを設定
      const hrefs: GridHrefsModel[] = [
        { field: 'commissionDiscountPackId', hrefs: [] },
      ];
      searchResult0013Commission.map((x) => {
        hrefs[0].hrefs.push({
          id: x.commissionDiscountPackId,
          href: '/com/commission-discount-packs/' + x.commissionDiscountPackId,
        });
      });
      setHrefs(hrefs);
    };

    // 履歴表示
    const historyInitialize = async (changeHisoryNumber: string) => {
      /** API-COM-9999-0025: 変更履歴情報取得API */
      const request = {
        changeHistoryNumber: changeHisoryNumber,
      };
      const response = (
        await comApiClient.post(
          '/api/com/scr-com-9999/get-history-info',
          request
        )
      ).data;
      const commissionHistoryInfo = convertToHistoryInfoModel(response);
      // 画面にデータを設定
      reset(commissionHistoryInfo);
      props.setGoodsBaseValue(response);
    };

    // 変更履歴番号を受け取っていたら履歴表示
    if (props.changeHisoryNumber !== '') {
      historyInitialize(props.changeHisoryNumber);
      return;
    }

    initialize();
  }, []);

  /**
   * 変更履歴情報取得APIから基本値引値増データモデルへの変換
   */
  const convertToHistoryInfoModel = (
    response: registrationRequest
  ): searchBasicResultRowModel => {
    return {
      id: response.basicCampaignCd,
      campaignCd: response.basicCampaignCd,
      campaignName: response.basicCampaignName,
      membershipFeeType: response.basicMembershipFeeType,
      discountDivision: response.basicDiscountDivision,
      discountAmount: response.basicDiscountAmount,
      courseId: response.basicCourseId,
      firstExclusionFlg:
        response.basicFirstExclusionFlg === true
          ? 'firstExclusionFlgRadioValue'
          : '',
      contractQuantityLowLimit: response.basicContractQuantityLowLimit,
      contractQuantityHighLimit: response.basicContractQuantityHighLimit,
      LimitStartDate: response.basicLimitStartDate,
      dummy: '～',
      LimitEndDate: response.basicLimitEndDate,
      approvalDocumentId: response.basicApprovalDocumentId,
      utilizationFlg:
        response.basicUtilizationFlg === true
          ? 'basicUtilizationFlgFlagYes'
          : response.basicUtilizationFlg === false
          ? 'basicUtilizationFlgFlagNo'
          : '',
      commodityCrameCd: response.basicCommodityCrameCd,
      fromToRadio: '',
      ContractAfterMonth: response.basicContractAfterMonth,
      numberOfMonthsFromContractDateRadio:
        response.basicNumberOfMonthsFromContractDateRadio,
    };
  };

  // /**
  //  * 変更履歴情報取得APIからオプション値引値増データモデルへの変換
  //  */
  // const convertToHistoryOptionInfoModel = (
  //   response: registrationRequest
  // ): searchOptionResultRowModel => {
  //   return {
  //     id: response.optionCampaignCd,
  //     optionCampaignCd: response.optionCampaignCd,
  //     optionCampaignName: response.optionCampaignName,
  //     optionMembershipFeeType: response.optionMembershipFeeType,
  //     optionDiscountDivision: response.optionDiscountDivision,
  //     optionDiscountAmount: response.optionDiscountAmount,
  //     serviceId: response.optionServiceId,
  //     optionFirstExclusionFlg:
  //       response.optionFirstExclusionFlg === true
  //         ? 'optionFirstExclusionFlgRadioValue'
  //         : '',
  //     optionContractQuantityHighLimit: response.optionContractQuantityHighLimit,
  //     optionContractQuantityLowLimit: response.optionContractQuantityLowLimit,
  //     optionFromToRadio: '',
  //     optionLimitStartDate: response.optionLimitStartDate,
  //     dummy: '～',
  //     optionLimitEndDate: response.optionLimitEndDate,
  //     optionNumberOfMonthsFromContractDateRadio: '',
  //     optionContractAfterMonth: response.optionContractAfterMonth,
  //     optionApprovalDocumentId: response.optionApprovalDocumentId,
  //     optionUtilizationFlg:
  //       response.optionUtilizationFlg === true
  //         ? 'optionUtilizationFlgYes'
  //         : response.optionUtilizationFlg === false
  //         ? 'optionUtilizationFlgNo'
  //         : '',
  //     optionCommodityCrameCd: response.optionCommodityCrameCd,
  //   };
  // };

  // /**
  //  * 変更履歴情報取得APIから手数料データモデルへの変換
  //  */
  // const convertToHistoryInfoModel = (
  //   response: registrationRequest
  // ): searchCommissionResultRowModel => {
  //   return {
  //     id: response.commissionDiscountPackId,
  //     commissionDiscountPackId: response.commissionDiscountPackId,
  //     commissionPackName: response.packName,
  //     commissionMemberServiceType: response.memberServiceType,
  //     commissionCalcurationDocType: response.calcurationDocType,
  //     commissionValidityStartDate: response.validityStartDate,
  //     commissionValidityEndDate: response.validityEndDate,
  //     commissionUtilizationFlg:
  //       response.optionUtilizationFlg === true ? '可' : '',
  //     commissionChangeReserve:
  //       response.commissionDiscountPacksCommissionChangeReserve,
  //   };
  // };

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * 会費セクション-基本値引値増上の追加アイコンクリック時のイベントハンドラ
   */
  const handleBasicIconAddClick = () => {
    // 現在のデータグリッドの行形式のまま1行追加する
    const copyContractRow: searchBasicResultRowModel[] = Object.assign(
      [],
      addedBasicSearchResult
    );
    // internalId ユニーク採番変数
    const newBasicCount = basicCount + 1;
    copyContractRow.push({
      // internalId
      id: String(newBasicCount),
      // キャンペーンコード
      campaignCd: '',
      // キャンペーン名
      campaignName: '',
      // 会費種別
      membershipFeeType: '',
      // 値引値増金額区分
      discountDivision: '',
      // 値引値増金額
      discountAmount: 0,
      // コースID
      courseId: '',
      // １本目除外フラグ
      firstExclusionFlg: '',
      // 契約数量下限
      contractQuantityLowLimit: 0,
      // 契約数量上限
      contractQuantityHighLimit: 0,
      // 期限開始日
      LimitStartDate: '',
      // 「～」
      dummy: '～',
      // 期限終了日
      LimitEndDate: '',
      // 契約日からの月数
      ContractAfterMonth: 0,
      // 稟議書ID
      approvalDocumentId: '',
      // 利用フラグ ラジオボタン
      utilizationFlg: '',
      // 商品クレームコード
      commodityCrameCd: '',
      // FromToのラジオボタン
      fromToRadio: '',
      // 契約日からの月数ラジオボタン
      numberOfMonthsFromContractDateRadio: '',
    });
    setBasicCount(newBasicCount);
    setAddedBasicSearchResult(copyContractRow);
  };

  /**
   * 会費セクション-オプション値引値増上の追加アイコンクリック時のイベントハンドラ
   */
  const handleOptionIconAddClick = () => {
    // 現在のデータグリッドの行形式のまま1行追加する
    const copyContractRow: searchOptionResultRowModel[] = Object.assign(
      [],
      addedOptionSearchResult
    );
    // internalId ユニーク採番変数
    const newOptionCount = optionCount + 1;
    copyContractRow.push({
      id: String(newOptionCount),
      // キャンペーンコード
      optionCampaignCd: '',
      // キャンペーン名
      optionCampaignName: '',
      // 会費種別
      optionMembershipFeeType: '',
      // 値引値増金額区分
      optionDiscountDivision: '',
      // 値引値増金額
      optionDiscountAmount: 0,
      // サービスID
      serviceId: '',
      // １本目除外フラグ
      optionFirstExclusionFlg: '',
      // 契約数量下限
      optionContractQuantityLowLimit: 0,
      // 契約数量上限
      optionContractQuantityHighLimit: 0,
      // 期限開始日
      optionLimitStartDate: '',
      // 「～」
      dummy: '～',
      // 期限終了日
      optionLimitEndDate: '',
      // 契約日からの月数
      optionContractAfterMonth: 0,
      // 稟議書ID
      optionApprovalDocumentId: '',
      // 利用フラグラジオボタン
      optionUtilizationFlg: '',
      // 商品クレームコード
      optionCommodityCrameCd: '',
      // FromToのラジオボタン
      optionFromToRadio: '',
      // 契約日からの月数ラジオボタン
      optionNumberOfMonthsFromContractDateRadio: '',
    });
    setOptionCount(newOptionCount);
    setAddedOptionSearchResult(copyContractRow);
  };

  /**
   * 手数料セクション上の追加アイコンクリック時のイベントハンドラ
   */
  const handleCommissionIconAddClick = () => {
    // 手数料値引値増パック 新規追加画面に遷移
    navigate('/com/commission-discount-packs/new');
  };

  /**
   * 会費セクション-基本値引値増 CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleBasicIconOutputCsvClick = () => {
    exportCsv(user.employeeId + '_' + user.taskDate, apiRef);
  };

  /**
   * 会費セクション-オプション値引値増 CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleOptionIconOutputCsvClick = () => {
    exportCsv(user.employeeId + '_' + user.taskDate, apiRef);
  };
  /**
   * 手数料セクション CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconCommissionOutputCsvClick = () => {
    exportCsv(user.employeeId + '_' + user.taskDate, apiRef);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const onClickConfirm = async () => {
    // エラーメッセージリスト
    const errorList: errorList[] = [];

    // 基本値引値増-契約本数の範囲チェック
    basicSearchResult.forEach((e) => {
      // 契約本数(以上) < 契約本数(以下)であることを確認
      // 契約本数(以上) > 1であることを確認
      if (
        !(e.contractQuantityHighLimit < e.contractQuantityLowLimit) ||
        !(e.contractQuantityHighLimit > 1)
      ) {
        errorList.push({
          errorCode: 'ERR-0089',
          errorMessage: Format(getMessage('MSG-FR-INF-00009'), ['']),
        });
      }
    });

    // オプション値引値増-契約本数の範囲チェック
    optionSearchResult.forEach((e) => {
      // 契約本数(以上) < 契約本数(以下)であることを確認
      // 契約本数(以上) > 1であることを確認
      if (
        !(
          e.optionContractQuantityHighLimit < e.optionContractQuantityLowLimit
        ) ||
        !(e.optionContractQuantityHighLimit > 1)
      ) {
        errorList.push({
          errorCode: 'ERR-0089',
          errorMessage: Format(getMessage('MSG-FR-INF-00009'), ['']),
        });
      }
    });

    // チェックAPI用の値引値増情報リストの作成
    const tempList: discountInfoListModel[] = [];
    // 基本値引値増
    basicSearchResult.forEach((e) => {
      tempList.push({
        campaignCd: e.campaignCd,
        campaignName: e.campaignName,
        periodFrom: e.LimitStartDate,
        periodTo: e.LimitEndDate,
      });
    });

    // オプション値引値増
    optionSearchResult.forEach((e) => {
      tempList.push({
        campaignCd: e.optionCampaignCd,
        campaignName: e.optionCampaignName,
        periodFrom: e.optionLimitStartDate,
        periodTo: e.optionLimitEndDate,
      });
    });
    // チェックAPI用の検索結果リストに格納
    setCommissionCheckSearchResult(tempList);

    // キャンペーン用のリストに分解(基本-レコード追加前)
    const tempBasicCampaingCdListBefore: string[] = [];
    basicSearchResult.forEach((e) => {
      tempBasicCampaingCdListBefore.push(e.campaignCd);
    });

    // キャンペーン用のリストに分解(基本-レコード追加後)
    const tempBasicCampaingCdListAfter: string[] = [];
    addedBasicSearchResult.forEach((e) => {
      tempBasicCampaingCdListAfter.push(e.campaignCd);
    });

    // キャンペーン用のリストに分解(オプション-レコード追加前)
    const tempOptionCampaingCdListBefore: string[] = [];
    basicSearchResult.forEach((e) => {
      tempOptionCampaingCdListBefore.push(e.campaignCd);
    });

    // キャンペーン用のリストに分解(オプション-レコード追加後)
    const tempOptionCampaingCdListAfter: string[] = [];
    basicSearchResult.forEach((e) => {
      tempOptionCampaingCdListAfter.push(e.campaignCd);
    });

    // チェックAPI用の各レコードリストの作成
    const addedTempList: any = [];
    const updatedTempList: any = [];
    const deletedTempList: any = [];

    // 基本値引値増
    addedBasicSearchResult.forEach((value) => {
      // 確定時のレコードのキャンペーンIDの内、初期表示時に存在する場合のレコード(更新レコード)
      if (tempBasicCampaingCdListBefore.includes(value.campaignCd)) {
        basicSearchResult.forEach((initialValue) => {
          // キャンペーンIDで初期表示時のレコードと比較を行い 一致したレコードのフィールドを1つずつ全て比較
          if (initialValue.campaignCd === value.campaignCd) {
            // キャンペーン名
            if (
              initialValue.campaignName !== value.campaignName ||
              // 会費種別
              initialValue.membershipFeeType !== value.membershipFeeType ||
              // 値引値増金額区分
              initialValue.discountDivision !== value.discountDivision ||
              // 値引値増金額
              initialValue.discountAmount !== value.discountAmount ||
              // セット対象コース
              initialValue.courseId !== value.courseId ||
              // １本目除外フラグ
              initialValue.firstExclusionFlg !== value.firstExclusionFlg ||
              // 契約数量下限
              initialValue.contractQuantityLowLimit !==
                value.contractQuantityLowLimit ||
              // 契約数量上限
              initialValue.contractQuantityHighLimit !==
                value.contractQuantityHighLimit ||
              // 期限開始日
              initialValue.LimitStartDate !== value.LimitStartDate ||
              // 期限終了日
              initialValue.LimitEndDate !== value.LimitEndDate ||
              // 契約後月数
              initialValue.ContractAfterMonth !== value.ContractAfterMonth ||
              // 稟議書ID
              initialValue.approvalDocumentId !== value.approvalDocumentId ||
              // 利用フラグ
              initialValue.utilizationFlg !== value.utilizationFlg ||
              // 商品クレームコード
              initialValue.commodityCrameCd !== value.commodityCrameCd
            ) {
              // 相違したフィールドが存在する場合更新レコードへ格納
              updatedTempList.push({ campaignCd: value.campaignCd });
            }
          }
        });
        // 確定時のレコードのキャンペーンIDの内、初期表示時に存在しない場合のレコード(追加レコードリスト)
      } else {
        addedTempList.push({ campaignCd: value.campaignCd });
      }
    });

    // チェックAPI用の削除レコードリストの作成
    basicSearchResult.forEach((value) => {
      // 初期表示時のレコードのキャンペーンIDの内、確定時に存在しない場合のレコード(削除レコード)
      if (!tempBasicCampaingCdListAfter.includes(value.campaignCd)) {
        deletedTempList.push({ campaignCd: value.campaignCd });
      }
    });

    // オプション値引値増
    addedOptionSearchResult.forEach((value) => {
      // 確定時のレコードのキャンペーンIDの内、初期表示時に存在する場合のレコード(更新レコード)
      if (tempOptionCampaingCdListBefore.includes(value.optionCampaignCd)) {
        optionSearchResult.forEach((initialValue) => {
          // キャンペーンIDで初期表示時のレコードと比較を行い 一致したレコードのフィールドを1つずつ全て比較
          if (initialValue.optionCampaignCd === value.optionCampaignCd) {
            // キャンペーン名
            if (
              initialValue.optionCampaignName !== value.optionCampaignName ||
              // 会費種別
              initialValue.optionMembershipFeeType !==
                value.optionMembershipFeeType ||
              // 値引値増金額区分
              initialValue.optionDiscountDivision !==
                value.optionDiscountDivision ||
              // 値引値増金額
              initialValue.optionDiscountAmount !==
                value.optionDiscountAmount ||
              // サービスID
              initialValue.serviceId !== value.serviceId ||
              // １本目除外フラグ
              initialValue.optionFirstExclusionFlg !==
                value.optionFirstExclusionFlg ||
              // 契約数量下限
              initialValue.optionContractQuantityLowLimit !==
                value.optionContractQuantityLowLimit ||
              // 契約数量上限
              initialValue.optionContractQuantityHighLimit !==
                value.optionContractQuantityHighLimit ||
              // 期限開始日
              initialValue.optionLimitStartDate !==
                value.optionLimitStartDate ||
              // 期限終了日
              initialValue.optionLimitEndDate !== value.optionLimitEndDate ||
              // 契約後月数
              initialValue.optionContractAfterMonth !==
                value.optionContractAfterMonth ||
              // 稟議書ID
              initialValue.optionApprovalDocumentId !==
                value.optionApprovalDocumentId ||
              // 利用フラグ
              initialValue.optionUtilizationFlg !==
                value.optionUtilizationFlg ||
              // 商品クレームコード
              initialValue.optionCommodityCrameCd !==
                value.optionCommodityCrameCd
            ) {
              // 相違したフィールドが存在する場合更新レコードへ格納
              updatedTempList.push({ campaignCd: value.optionCampaignCd });
            }
          }
        });
        // 確定時のレコードのキャンペーンIDの内、初期表示時に存在しない場合のレコード(追加レコードリスト)
      } else {
        addedTempList.push({ campaignCd: value.optionCampaignCd });
      }
    });

    // チェックAPI用の削除レコードリストの作成
    optionSearchResult.forEach((value) => {
      // 初期表示時のレコードのキャンペーンIDの内、確定時に存在しない場合のレコード(削除レコード)
      if (!tempOptionCampaingCdListAfter.includes(value.optionCampaignCd)) {
        deletedTempList.push({ campaignCd: value.optionCampaignCd });
      }
    });

    // 各リストにキャンペーンIDリストを格納
    setRegistTargetedList(addedTempList);
    setUpdateTargetedList(updatedTempList);
    setDeleteTargetedList(deletedTempList);

    // API-COM-0013-0009: 値引値増情報入力チェックAPI
    const chkDiscountRequest: ScrCom0013chkDiscountRequest = {
      /** 値引値増情報リスト */
      discountInfoList: commissionCheckSearchResult,
      /** 登録対象リスト */
      registTargetedList: registTargetedList,
      /** 更新対象リスト */
      updateTargetedList: updateTargetedList,
      /** 削除対象リスト */
      deleteTargetedList: deleteTargetedList,
    };
    const checkResult = await ScrCom0013chkDiscount(chkDiscountRequest);

    // 先にチェックした契約本数でのエラーメッセージを追加格納する
    errorList.forEach((error) => {
      checkResult.errorList.push(error);
    });

    // 登録内容確認ポップアップの呼び出し
    setIsOpenPopup(true);

    setScrCom0032PopupData({
      errorList: checkResult.errorList,
      warningList: checkResult.warningList,
      registrationChangeList: checkResult.registrationChangeList,
      changeExpectDate: user.taskDate,
    });
  };

  /**
   * 登録内容確認ポップアップの登録承認ボタンクリック時のイベントハンドラ
   */
  const handleApprovalConfirm = (registrationChangeMemo: string) => {
    setIsOpenPopup(false);

    // 登録内容確認ポップアップから渡された登録変更メモを設定
    setRegistrationChangeMemo(registrationChangeMemo);

    setIsOpenApplicationPopup(true);
    // SCR-COM-0013-0033: 登録内容申請入力チェックAPI
    setScrCom0033PopupData({
      screenId: SCR_COM_0013,
      // タブID
      tabId: 4,
      // 申請金額
      applicationMoney: 0,
    });
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handleRegistConfirm = (registrationChangeMemo: string) => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容申請ポップアップの確定ボタンクリック→ダイアログOK時のイベントハンドラ
   */
  const handleApplicationPopupConfirm = (
    // 従業員ID1
    employeeId1: string,
    // 従業員名1
    emploeeName1: string,
    // 従業員メールアドレス1
    employeeMailAddress1: string,
    // 従業員ID2
    employeeId2: string,
    // 従業員名2
    emploeeName2: string,
    // 従業員ID3
    employeeId3: string,
    // 従業員名3
    emploeeName3: string,
    // 従業員ID4
    employeeId4: string,
    // 従業員名4
    emploeeName4: string,
    // 申請コメント
    applicationComment: string
  ) => {
    setIsOpenPopup(false);

    // SCR-COM-0013-0010: 値引値増情報登録更新API
    const mergeDiscountRequest: ScrCom0013MergeDiscountRequest = {
      /** 基本値引値増 */
      baseDiscountList: convertToBasicResponseModel(basicSearchResult),
      /** オプション値引値増情報 */
      optionDiscountList: convertToOptionResponseModel(optionSearchResult),
      /** 登録対象リスト */
      registTargetedList: registTargetedList,
      /** 更新対象リスト */
      updateTargetedList: updateTargetedList,
      /** 削除対象リスト */
      deleteTargetedList: deleteTargetedList,
      /** 申請従業員ID */
      applicationEmployeeId: user.employeeId,
      /** 登録変更メモ */
      registrationChangeMemo: registrationChangeMemo,
      /** 第一承認者ID */
      firstApproverId: employeeId1,
      /** 第一承認者メールアドレス */
      firstApproverMailAddress: employeeMailAddress1,
      /** 第ニ承認者ID */
      secondApproverId: employeeId2,
      /** 第三承認者ID */
      thirdApproverId: employeeId3,
      /** 第四承認者ID */
      fourthApproverId: employeeId4,
      /** 申請コメント */
      applicationComment: applicationComment,
    };
    ScrCom0013MergeDiscount(mergeDiscountRequest);
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリックのイベントハンドラ
   */
  const handleApplicationPopupCancel = () => {
    setIsOpenApplicationPopup(false);
  };

  // データグリッド(基本値引値増)のフォーカスアウトのイベントハンドラ
  const basicHandleOnCellBlur = (params: any) => {
    // フォーカスアウト時にセット対象コースプルダウンが空の際は一本目除外フラグを空に設定
    if (params.field === 'courseId') {
      setValue('firstExclusionFlg', '');
    }
  };

  // データグリッド(オプション値引値増)のフォーカスアウトのイベントハンドラ
  const optionHandleOnCellBlur = (params: any) => {
    // フォーカスアウト時にセット対象コースプルダウンが空の際は一本目除外フラグを空に設定
    if (params.field === 'serviceId') {
      setValue('optionFirstExclusionFlg', '');
    }
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <Section
            name='会費セクション'
            width={maxSectionWidth}
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleBasicIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                {/* 履歴表示の場合 追加ボタン非活性 */}
                <AddButton
                  onClick={handleBasicIconAddClick}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >
                  追加
                </AddButton>
              </MarginBox>
            }
          >
            <Typography variant='h6'>基本値引値増</Typography>
            <DataGrid
              apiRef={apiRef}
              pagination={true}
              columns={searchBasicResultColumns}
              rows={addedBasicSearchResult}
              onCellBlur={basicHandleOnCellBlur}
              // DataGridのヘッダーを2列定義する設定
              columnGroupingModel={basicColumnGroups}
              // 編集権限なし/履歴表示の場合にcampaignCd以外の入力部分全てのカラムを非活性にする
              getCellDisabled={(params) => {
                if (
                  params.field === 'campaignName' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'membershipFeeType' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'discountDivision' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'discountAmount' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'courseId' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'firstExclusionFlg' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'contractQuantityHighLimit' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'contractQuantityLowLimit' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'fromToRadio' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'LimitStartDate' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'LimitEndDate' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'numberOfMonthsFromContractDateRadio' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'ContractAfterMonth' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'approvalDocumentsId' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'utilizationFlg' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'commodityCrameCd' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                return false;
              }}
            />
            <br />
            <br />
            <RightBox>
              <MarginBox mt={2} mb={4} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleOptionIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                <AddButton
                  onClick={handleOptionIconAddClick}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >
                  追加
                </AddButton>
              </MarginBox>
            </RightBox>
            <Typography variant='h6'>オプション値引値増</Typography>
            <DataGrid
              apiRef={apiRef}
              pagination={true}
              columns={searchOptionResultColumns}
              rows={addedOptionSearchResult}
              // DataGridのヘッダーを2列定義する設定
              onCellBlur={optionHandleOnCellBlur}
              columnGroupingModel={optionColumnGroups}
              // 編集権限なし/履歴表示の場合にcampaignCd以外の入力部分全てのカラムを非活性にする
              getCellDisabled={(params) => {
                if (
                  params.field === 'campaignName' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'membershipFeeType' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'discountDivision' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'discountAmount' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'courseId' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'firstExclusionFlg' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'contractQuantityHighLimit' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'contractQuantityLowLimit' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'fromToRadio' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'LimitStartDate' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'LimitEndDate' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'numberOfMonthsFromContractDateRadio' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'ContractAfterMonth' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'approvalDocumentsId' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'utilizationFlg' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                if (
                  params.field === 'commodityCrameCd' &&
                  (!userEditFlag || props.changeHisoryNumber !== '')
                )
                  return true;
                return false;
              }}
            />
          </Section>
          <Section
            name='手数料セクション'
            width={maxSectionWidth}
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconCommissionOutputCsvClick}>
                  CSV出力
                </AddButton>
                {/* 履歴表示 or 編集権限なしの場合 追加ボタン非活性 */}
                <AddButton
                  onClick={handleCommissionIconAddClick}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >
                  追加
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              apiRef={apiRef}
              pagination={true}
              columns={searchCommissionResultColumns}
              rows={commissionSearchResult}
              hrefs={hrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>

      {/* bottom */}
      <MainLayout bottom>
        <Stack direction='row' alignItems='center'>
          {/* 履歴表示 or 編集権限なしの場合 非活性 */}
          <ConfirmButton
            onClick={onClickConfirm}
            disable={props.changeHisoryNumber === '' ? true : false}
          >
            確定
          </ConfirmButton>
        </Stack>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {isOpenPopup && (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          handleRegistConfirm={handleRegistConfirm}
          // 本機能ではこちらのみ使用する
          handleApprovalConfirm={handleApprovalConfirm}
          handleCancel={handlePopupCancel}
        />
      )}

      {/* 登録内容申請ポップアップ */}
      {isOpenApplicationPopup && (
        <ScrCom0033Popup
          isOpen={isOpenApplicationPopup}
          data={scrCom0033PopupData}
          handleConfirm={handleApplicationPopupConfirm}
          handleCancel={handleApplicationPopupCancel}
        />
      )}
    </>
  );
};
export default ScrCom0013CommissionDiscountPacksTab;
