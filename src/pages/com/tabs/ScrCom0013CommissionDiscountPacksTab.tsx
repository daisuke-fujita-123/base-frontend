import React, { useContext, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';

import { MarginBox, RightBox } from 'layouts/Box';
import { InputLayout } from 'layouts/InputLayout';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { RowStack, Stack } from 'layouts/Stack';

import { AddButton, ConfirmButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { SelectValue } from 'controls/Select';

import {
  ScrCom0013chkDiscount, ScrCom0013chkDiscountRequest,
  ScrCom0013DisplayComoditymanagementDiscount, ScrCom0013DisplayComoditymanagementDiscountRequest,
  ScrCom0013DisplayComoditymanagementDiscountResponse, ScrCom0013MergeDiscount,
  ScrCom0013MergeDiscountRequest, warnList
} from 'apis/com/ScrCom0013Api';
import {
  courceList, ScrCom9999GetCodeManagementMasterListbox,
  ScrCom9999GetCodeManagementMasterListboxRequest, ScrCom9999GetCoursename,
  ScrCom9999GetServiceInfo, SearchGetCodeManagementMasterListbox, serviceList
} from 'apis/com/ScrCom9999Api';
import {
  codeList, ScrTra9999GetCodeValue, ScrTra9999GetCodeValueRequest
} from 'apis/tra/ScrTra9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

import { generate } from 'utils/BaseYup';

import { GridColumnGroupingModel } from '@mui/x-data-grid-pro';
import ScrCom0032Popup, {
  ColumnListModel, errorMessagesModel, ScrCom0032PopupModel, SectionListModel,
  warningMessagesModel
} from '../popups/ScrCom00032Popup';
import ScrCom0033Popup, { ScrCom0033PopupModel } from '../popups/ScrCom0033Popup';

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


/**
 * form データモデル
 */
interface formModel {
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
  // サービスID
  serviceId: string;
  // １本目除外フラグ
  firstExclusionFlg: boolean;
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
  utilizationFlg: boolean;
  // 商品クレームコード
  commodityCrameCd: string;
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
  // サービスID
  serviceId: '',
  // １本目除外フラグ
  firstExclusionFlg: false,
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
  utilizationFlg: false,
  // 商品クレームコード
  commodityCrameCd: '',
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
  firstExclusionFlg: boolean;
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
  utilizationFlg: boolean;
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
  campaignCd: string;
  // キャンペーン名
  campaignName: string;
  // 会費種別
  membershipFeeType: string;
  // 値引値増金額区分
  discountDivision: string;
  // 値引値増金額
  discountAmount: number;
  // サービスID
  serviceId: string;
  // １本目除外フラグ
  firstExclusionFlg: boolean;
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
  // 契約日からの月数
  ContractAfterMonth: number;
  // 稟議書ID
  approvalDocumentId: string;
  // 利用フラグ
  utilizationFlg: boolean;
  // 商品クレームコード
  commodityCrameCd: string;
  // FromToの手前のラジオボタン
  fromToRadio: string;
  // 契約日からの月数の手前のラジオボタン
  numberOfMonthsFromContractDateRadio: string;
}


/**
 * 会費セクション-手数料値引値増 検索結果行データモデル
 */
interface searchCommissionResultRowModel {
  // internalId
  id: string;
  // 値引値増パックID
  commissionDiscountPackId: string;
  // パック名
  packName: string;
  // 会員サービス識別区分
  memberServiceType: string;
  // 計算書種別
  calcurationDocType: string;
  // 有効期間開始日
  validityStartDate: string;
  // 有効期間終了日
  validityEndDate: string;
  // 利用フラグ
  utilizationFlg: boolean;
  // 変更予約
  changeReserve: string;
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
  errorMessages: [
    {
      errorCode: '',
      errorMessage: '',
    },
  ],
  warningMessages: [
    {
      warningCode: '',
      warningMessage: '',
    },
  ],
  contentsList: {
    screenName: '',
    screenId: '',
    tabName: '',
    tabId: '',
    sectionList: [
      {
        sectionName: '',
        columnList: [
          {
            columnName: '',
          },
        ],
      },
    ],
  },
  changeExpectDate: new Date(),
};


/**
 * 登録内容申請ポップアップ初期データ
 */
const scrCom0033PopupInitialValues: ScrCom0033PopupModel = {
  // 画面ID
  screenId: '',
  // タブID
  tabId: '',
  // 一括登録ID
  allRegistrationId: '',
  // マスタID
  masterId: '',
  // 登録変更メモ
  registChangeMemo: '',
  // 変更予定日
  changeExpectDate: '',
  // 申請金額
  applicationMoney: '',
  // 申請者ID
  applicationId: '',
  // プログラムID
  programId: '',
};


/**
 * バリデーションスキーマ
 */
const validationSchama = generate([
  // 基本値引値増
  'campaignCd',
  'campaignName',
  'discountAmount',
  'contractQuantityLowLimit',
  'contractQuantityHighLimit',
  'ContractAfterMonth',
  'approvalDocumentId',
  // オプション値引値増
  'optionCampaignCd',
  'optionCampaignName',
  'optionDiscountAmount',
  'optionContractQuantityLowLimit',
  'optionContractQuantityHighLimit',
  'optionContractAfterMonth',
  'optionApprovalDocumentId',
]);


/**
 * 商品管理表示API(値引値増情報表示) レスポンスから 基本値引値増 検索結果モデルへの変換
 */
const convertToSearchBasicResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementDiscountResponse
): searchBasicResultRowModel[] => {
  return response.basicDiscountInfo.map((x) => {
    return {
      id: x.campaignCd,
      campaignCd: x.campaignCd,
      campaignName: x.campaignName,
      membershipFeeType: x.membershipFeeType,
      discountDivision: x.discountDivision,
      discountAmount: 0,
      courseId: x.courseId,
      firstExclusionFlg: x.firstExclusionFlg,
      contractQuantityLowLimit: x.contractQuantityLowLimit,
      contractQuantityHighLimit: x.contractQuantityHighLimit,
      LimitStartDate: x.LimitStartDate,
      dummy: '～',
      LimitEndDate: x.LimitEndDate,
      ContractAfterMonth: x.ContractAfterMonth,
      approvalDocumentId: x.approvalDocumentId,
      utilizationFlg: x.utilizationFlg,
      commodityCrameCd: x.commodityCrameCd,
      numberOfMonthsFromContractDateRadio: '',
      fromToRadio: '',
    };
  });
};


/**
 * 商品管理表示API(値引値増情報表示) レスポンスから オプション値引値増 検索結果モデルへの変換
 */
const convertToSearchOptionResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementDiscountResponse
): searchOptionResultRowModel[] => {
  return response.optionDiscountInfo.map((x) => {
    return {
      id: x.campaignCd,
      campaignCd: x.campaignCd,
      campaignName: x.campaignName,
      membershipFeeType: x.membershipFeeType,
      discountDivision: x.discountDivision,
      discountAmount: 0,
      serviceId: x.serviceId,
      firstExclusionFlg: x.firstExclusionFlg,
      contractQuantityLowLimit: x.contractQuantityLowLimit,
      contractQuantityHighLimit: x.contractQuantityHighLimit,
      LimitStartDate: x.LimitStartDate,
      dummy: '～',
      LimitEndDate: x.LimitEndDate,
      ContractAfterMonth: x.ContractAfterMonth,
      approvalDocumentId: x.approvalDocumentId,
      utilizationFlg: x.utilizationFlg,
      commodityCrameCd: x.commodityCrameCd,
      numberOfMonthsFromContractDateRadio: '',
      fromToRadio: '',
    };
  });
};


/**
 * 商品管理表示API(値引値増情報表示) レスポンスから 手数料値引値増 検索結果モデルへの変換
 */
const convertToSearchCommissionResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementDiscountResponse
): searchCommissionResultRowModel[] => {
  return response.commissionDiscountInfo.map((x) => {
    return {
      id: x.commissionDiscountPackId,
      commissionDiscountPackId: x.commissionDiscountPackId,
      packName: x.packName,
      memberServiceType: x.memberServiceType,
      calcurationDocType: x.calcurationDocType,
      validityStartDate: x.validityStartDate,
      validityEndDate: x.validityEndDate,
      utilizationFlg: x.utilizationFlg,
      changeReserve: x.changeReserve,
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
 * APIレスポンスから表示用ワーニングメッセージへの変換
 */
const convertToWarnMessages = (
  response: warnList[]
): warningMessagesModel[] => {
  const list: warningMessagesModel[] = [];
  if (response === undefined) {
    return list;
  }
  response.map((x) => {
    list.push({
      warningCode: x.warnCode,
      warningMessage: x.warnMessage,
    });
  });
  return list;
};


/**
* 変更した項目から登録・変更内容データへの変換
*/
const convertToSectionList = (dirtyFields: object): SectionListModel[] => {
  const fields = Object.keys(dirtyFields);
  const sectionList: SectionListModel[] = [];
  const columnList: ColumnListModel[] = [];
  sectionDef.forEach((d) => {
    fields.forEach((f) => {
      if (d.fields.includes(f)) {
        columnList.push(
          { columnName: d.section[d.fields.indexOf(f)] }
        );
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
* セクション構造定義
*/
const sectionDef = [
  {
    section: '会費',
    fields: [
      'id',
      'campaignCd:',
      'campaignName',
      'membershipFeeType',
      'discountDivision',
      'discountAmount',
      'courseId',
      'serviceId',
      'firstExclusionFlg',
      'contractQuantityLowLimit',
      'contractQuantityHighLimit',
      'LimitStartDate',
      'dummy',
      'LimitEndDate',
      'ContractAfterMonth',
      'approvalDocumentId',
      'utilizationFlg',
      'commodityCrameCd',
      'numberOfMonthsFromContractDateRadio',
      'fromToRadio',
      'optionCampaignCd:',
      'optionCampaignName',
      'optionMembershipFeeType',
      'optionDiscountDivision',
      'optionDiscountAmount',
      'optionCourseId',
      'optionServiceId',
      'optionFirstExclusionFlg',
      'optionContractQuantityLowLimit',
      'optionContractQuantityHighLimit',
      'optionLimitStartDate',
      'optionDummy',
      'optionLimitEndDate',
      'optionContractAfterMonth',
      'optionApprovalDocumentId',
      'optionUtilizationFlg',
      'optionCommodityCrameCd',
      'optionNumberOfMonthsFromContractDateRadio',
      'optionFromToRadio',
    ],
  },
  {
    section: '手数料',
    fields: [
      'id',
      'commissionDiscountPackId:',
      'packName',
      'memberServiceType',
      'calcurationDocType',
      'validityStartDate',
      'validityEndDate',
      'utilizationFlg',
      'changeReserve',
    ],
  },
]


/**
 * SCR-COM-0013 商品管理画面 値引値増タブ
 * @returns
 */
const ScrCom0013CommissionDiscountPacksTab = (props: { changeHisoryNumber: string }) => {
  /**
   * state
   */
  // リストボックス
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 基本値引値増 検索結果(初期表示時)
  const [basicSearchResult, setBasicSearchResult] = useState<searchBasicResultRowModel[]>([]);
  // オプション値引値増 検索結果(初期表示時)
  const [optionSearchResult, setOptionSearchResult] = useState<searchOptionResultRowModel[]>([]);
  // 手数料値引値増 検索結果(初期表示時)
  const [commissionSearchResult, setCommissionSearchResult] = useState<searchCommissionResultRowModel[]>([]);
  // 基本値引値増 検索結果(追加ボタンレコード挿入後)
  const [addedBasicSearchResult, setAddedBasicSearchResult] = useState<searchBasicResultRowModel[]>([]);
  // オプション値引値増 検索結果(追加ボタンレコード挿入後)
  const [addedOptionSearchResult, setAddedOptionSearchResult] = useState<searchOptionResultRowModel[]>([]);
  // href
  const [hrefs, setHrefs] = useState<any[]>([]);
  // 基本値引値増・オプション値引値増 検索結果(値引値増情報入力チェックAPI用)
  const [commissionCheckSearchResult, setCommissionCheckSearchResult] = useState<discountInfoListModel[]>([]);
  // 追加レコード リスト(キャンペーンコードのみ)
  const [registTargetedList, setRegistTargetedList] = useState<string[]>([]);
  // 変更レコード リスト(キャンペーンコードのみ)
  const [updateTargetedList, setUpdateTargetedList] = useState<string[]>([]);
  // 削除レコード リスト(キャンペーンコードのみ)
  const [deleteTargetedList, setDeleteTargetedList] = useState<string[]>([]);
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

  /**
   * user情報
   */
  const { appContext } = useContext(AppContext);

  /**
   * router
   */
  const navigate = useNavigate();

  /**
   * form
   */
  const methods = useForm<formModel>({
    defaultValues: formModelInitialValues,
    resolver: yupResolver(validationSchama),
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
      size: 'm',
      cellType: 'input',
    },
    {
      field: 'campaignName',
      headerName: 'キャンペーン名',
      size: 'm',
      cellType: 'input',
    },
    {
      field: 'membershipFeeType',
      headerName: '会員種別',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'basicAdmissionFee', displayValue: '入会金' },
        { value: 'basicListPrice', displayValue: '定価' },
      ],
    },
    {
      field: 'discountDivision',
      headerName: '金額区分',
      cellType: 'select',
      selectValues: selectValues.priceSelectValues,
      size: 'm',
    },
    {
      field: 'discountAmount',
      headerName: '金額',
      cellType: [
        { type: 'input', helperText: '円' }
      ],
      size: 'm',
    },
    {
      field: 'courseId',
      headerName: 'セット対象コース',
      size: 'm',
      cellType: 'select',
      selectValues: selectValues.setTargetCourseSelectValues,
    },
    {
      field: 'firstExclusionFlg',
      headerName: '1本目除外',
      size: 'm',
      cellType: 'radio',
      radioValues: [
        { value: 'firstExclusionFlgRadioValue' },
      ],
      // TODO: セット対象コースが選択されている場合、活性。選択されていない場合、非活性とし内容をクリアする(フォーカスアウト)
    },
    {
      field: 'contractQuantityHighLimit',
      headerName: '契約本数(以上)',
      cellType: [
        { type: 'input', helperText: '以上' },
      ],
      size: 'm',
    },
    {
      field: 'contractQuantityLowLimit',
      headerName: '契約本数(以下)',
      cellType: [
        { type: 'input', helperText: '以下' },
      ],
      size: 'm',
    },
    {
      field: 'fromToRadio',
      // ラジオボタンのみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
      cellType: 'radio',
      radioValues: [
        { value: 'fromToRadioValue' },
      ],
    },
    {
      field: 'LimitStartDate',
      headerName: 'FROM',
      size: 'm',
      cellType: 'datepicker'
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
      size: 'm',
      cellType: 'datepicker'
    },
    {
      field: 'numberOfMonthsFromContractDateRadio',
      // ラジオボタンのみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
      cellType: 'radio',
      radioValues: [
        { value: 'numberOfMonthsFromContractDateRadioValue' },
      ],
    },
    {
      field: 'ContractAfterMonth',
      headerName: '契約日からの月数',
      cellType: [
        { type: 'input', helperText: 'ヶ月' },
      ],
      size: 'm',
    },
    {
      field: 'approvalDocumentsId',
      headerName: '稟議書ID',
      size: 'm',
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
      size: 'm',
      cellType: 'select',
      selectValues: selectValues.commodityCrameCdSelectValues,
    },
  ];


  /**
   * 会費セクション-オプション値引値増 検索条件列定義
   */
  const searchOptionResultColumns: GridColDef[] = [
    {
      field: 'campaignCd',
      headerName: 'キャンペーンコード',
      size: 'm',
      cellType: 'input',
    },
    {
      field: 'campaignName',
      headerName: 'キャンペーン名',
      size: 'm',
      cellType: 'input',
    },
    {
      field: 'membershipFeeType',
      headerName: '会員種別',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'basicAdmissionFee', displayValue: '入会金' },
        { value: 'basicListPrice', displayValue: '定価' },
      ],
    },
    {
      field: 'discountDivision',
      headerName: '金額区分',
      cellType: 'select',
      selectValues: selectValues.priceSelectValues,
      size: 'm',
    },
    {
      field: 'discountAmount',
      headerName: '金額',
      cellType: [
        { type: 'input', helperText: '円' }
      ],
      size: 'm',
    },
    {
      field: 'serviceName',
      headerName: 'サービス名',
      size: 'm',
      cellType: 'select',
      selectValues: selectValues.serviceNameSelectValues,
    },
    {
      field: 'firstExclusionFlg',
      headerName: '1本目除外',
      size: 'm',
      cellType: 'radio',
      radioValues: [
        { value: 'firstExclusionFlgRadioValue' },
      ],
      // TODO: セット対象コースが選択されている場合、活性。選択されてない状態でフォーカスアウトした場合、非活性とし内容をクリア
    },
    {
      field: 'contractQuantityHighLimit',
      headerName: '契約本数(以上)',
      cellType: [
        { type: 'input', helperText: '以上' },
      ],
      size: 'm',
    },
    {
      field: 'contractQuantityLowLimit',
      headerName: '契約本数(以下)',
      cellType: [
        { type: 'input', helperText: '以下' },
      ],
      size: 'm',
    },
    {
      field: 'FromToRadio',
      // ラジオボタンのみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
      cellType: 'radio',
      radioValues: [
        { value: 'FromToRadioValue' },
      ],
    },
    {
      field: 'LimitStartDate',
      headerName: 'FROM',
      size: 'm',
      cellType: 'datepicker'
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
      size: 'm',
      cellType: 'datepicker'
    },
    {
      field: 'numberOfMonthsFromContractDateRadio',
      // ラジオボタンのみのセルの為ソート不可とする
      sortable: false,
      headerName: '',
      size: 's',
      cellType: 'radio',
      radioValues: [
        { value: 'numberOfMonthsFromContractDateRadioValue' },
      ],
    },
    {
      field: 'ContractAfterMonth',
      headerName: '契約日からの月数',
      cellType: [
        { type: 'input', helperText: 'ヶ月' },
      ],
      size: 'm',
    },
    {
      field: 'approvalDocumentsId',
      headerName: '稟議書ID',
      size: 'm',
      cellType: 'input',
    },
    {
      field: 'utilizationFlg',
      headerName: '利用フラグ',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'optionUtilizationFlgYes', displayValue: '可' },
        { value: 'optionUtilizationFlgNo', displayValue: '不可' },
      ],
    },
    {
      field: 'commodityCrameCd',
      headerName: '商品コード',
      size: 'm',
      cellType: 'select',
      selectValues: selectValues.commodityCrameCdSelectValues,
    },
  ];


  /**
   * 会費セクション-手数料値引値増 検索条件列定義
   */
  const searchCommissionResultColumns: GridColDef[] = [
    {
      field: 'commissionDiscountPackId',
      headerName: '値引値増パックID',
      size: 'm',
      cellType: 'link',
    },
    {
      field: 'packName',
      headerName: 'パック名',
      size: 'm',
    },
    {
      field: 'memberServiceType',
      headerName: '種別',
      size: 'm',
    },
    {
      field: 'calcurationDocType',
      headerName: '計算書種別',
      size: 'm',
    },
    {
      field: 'validityStartDate' + '  ' + 'validityEndDate',
      headerName: '有効期間',
      size: 'm',
    },
    {
      field: 'utilizationFlg',
      headerName: '利用フラグ',
      size: 'm',
    },
    {
      field: 'changeReserve',
      headerName: '変更予約',
      size: 'm',
    },
  ];


  /**
   * 初期表示
   */
  useEffect(() => {
    const initialize = async () => {
      // API-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const getCodeManagementMasterListboxRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        // コードID
        codeId: 'CDE-COM-0009',
      };
      const response0010 = await ScrCom9999GetCodeManagementMasterListbox(getCodeManagementMasterListboxRequest);

      // API-COM-9999-0021: コース名情報取得API
      const response0021 = await ScrCom9999GetCoursename();

      // API-COM-9999-0022: サービス名情報取得API
      const response0022 = await ScrCom9999GetServiceInfo();

      // API-TRA-9999-0001: コードマスタ（取引会計）情報取得API
      const getTraCodeValueRequest: ScrTra9999GetCodeValueRequest = {
        codes: [{
          // TODO: 業務日付取得方法実装後に変更
          validityStartDate: '',
          codeId: 'CDE-TRA-0001',
        }]
      };
      const response0001 = await ScrTra9999GetCodeValue(getTraCodeValueRequest);

      // リストボックスに設定
      setSelectValues({
        // 金額(種類)
        priceSelectValues: convertToCodeSelectValueModel(response0010.searchGetCodeManagementMasterListbox),
        // セット対象コース
        setTargetCourseSelectValues: convertToCourceSelectValueModel(response0021.courceList),
        // サービス名
        serviceNameSelectValues: convertToServiceNameSelectValueModel(response0022.serviceList),
        // 商品コード
        commodityCrameCdSelectValues: convertToTraCodeValueSelectValueModel(response0001.codes[0].codeList),
      })

      // SCR-COM-0013-0004：商品管理表示API(手数料情報表示）
      const displayComoditymanagementDiscountRequest: ScrCom0013DisplayComoditymanagementDiscountRequest = {
        /** 画面ID */
        screenId: '',
        /** タブID */
        tabId: '',
        /** 業務日付 */
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
      };
      const response0013 = await ScrCom0013DisplayComoditymanagementDiscount(displayComoditymanagementDiscountRequest);

      // 画面にデータを設定
      // 基本値引
      const searchResult0013Basic = convertToSearchBasicResultRowModel(response0013);
      setBasicSearchResult(searchResult0013Basic);
      setAddedBasicSearchResult(searchResult0013Basic);

      // オプション値引
      const searchResult0013Option = convertToSearchOptionResultRowModel(response0013);
      setOptionSearchResult(searchResult0013Option);
      setAddedOptionSearchResult(searchResult0013Option);

      // 手数料値引
      const searchResult0013Commission = convertToSearchCommissionResultRowModel(response0013);
      setCommissionSearchResult(searchResult0013Commission);

      const hrefs = searchResult0013Commission.map((x) => {
        return {
          field: 'commissionDiscountPackId',
          id: x.commissionDiscountPackId,
          href: '/com/commission-discount-packs/' + x.commissionDiscountPackId,
        };
      });
      setHrefs(hrefs);
    };

    initialize();

  }, []);


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
    const copyContractRow: searchBasicResultRowModel[] = Object.assign([], addedBasicSearchResult);
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
      firstExclusionFlg: false,
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
      utilizationFlg: false,
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
    const copyContractRow: searchOptionResultRowModel[] = Object.assign([], addedOptionSearchResult);
    // internalId ユニーク採番変数
    const newOptionCount = optionCount + 1;
    copyContractRow.push({
      id: String(newOptionCount),
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
      // サービスID
      serviceId: '',
      // １本目除外フラグ
      firstExclusionFlg: false,
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
      // 利用フラグラジオボタン
      utilizationFlg: false,
      // 商品クレームコード
      commodityCrameCd: '',
      // FromToのラジオボタン
      fromToRadio: '',
      // 契約日からの月数ラジオボタン
      numberOfMonthsFromContractDateRadio: '',
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
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    // TODO：CSV機能実装後に変更
    alert('TODO:結果結果からCSVを出力する。');
  };


  /**
 * 確定ボタンクリック時のイベントハンドラ
 */
  const onClickConfirm = async () => {

    // エラーメッセージリスト
    const errorMessages: errorMessagesModel[] = [];

    // 基本値引値増-契約本数の範囲チェック
    basicSearchResult.map((e) => {
      // 契約本数(以上) < 契約本数(以下)であることを確認
      // 契約本数(以上) > 1であることを確認
      if (!(e.contractQuantityHighLimit < e.contractQuantityLowLimit)
        || !(e.contractQuantityHighLimit > 1)) {
        errorMessages.push({
          errorCode: 'ERR-0089',
          errorMessage: '契約本数の指定が正しくありません。',
        });
      }
    })

    // オプション値引値増-契約本数の範囲チェック
    optionSearchResult.map((e) => {
      // 契約本数(以上) < 契約本数(以下)であることを確認
      // 契約本数(以上) > 1であることを確認
      if (!(e.contractQuantityHighLimit < e.contractQuantityLowLimit)
        || !(e.contractQuantityHighLimit > 1)) {
        errorMessages.push({
          errorCode: 'ERR-0089',
          errorMessage: '契約本数の指定が正しくありません。',
        });
      }
    })


    // チェックAPI用の値引値増情報リストの作成
    const tempList: discountInfoListModel[] = [];
    // 基本値引値増
    basicSearchResult.map((e) => {
      tempList.push({
        campaignCd: e.campaignCd,
        campaignName: e.campaignName,
        periodFrom: e.LimitStartDate,
        periodTo: e.LimitEndDate,
      })
    })

    // オプション値引値増
    optionSearchResult.map((e) => {
      tempList.push({
        campaignCd: e.campaignCd,
        campaignName: e.campaignName,
        periodFrom: e.LimitStartDate,
        periodTo: e.LimitEndDate,
      })
    })
    // チェックAPI用の検索結果リストに格納
    setCommissionCheckSearchResult(tempList);

    // キャンペーン用のリストに分解(基本-レコード追加前)
    const tempBasicCampaingCdListBefore: string[] = [];
    basicSearchResult.map((e) => {
      tempBasicCampaingCdListBefore.push(e.campaignCd);
    })

    // キャンペーン用のリストに分解(基本-レコード追加後)
    const tempBasicCampaingCdListAfter: string[] = [];
    addedBasicSearchResult.map((e) => {
      tempBasicCampaingCdListAfter.push(e.campaignCd);
    })

    // キャンペーン用のリストに分解(オプション-レコード追加前)
    const tempOptionCampaingCdListBefore: string[] = [];
    basicSearchResult.map((e) => {
      tempOptionCampaingCdListBefore.push(e.campaignCd);
    })

    // キャンペーン用のリストに分解(オプション-レコード追加後)
    const tempOptionCampaingCdListAfter: string[] = [];
    basicSearchResult.map((e) => {
      tempOptionCampaingCdListAfter.push(e.campaignCd);
    })

    // チェックAPI用の各レコードリストの作成
    const addedTempList: string[] = [];
    const updatedTempList: string[] = [];
    const deletedTempList: string[] = [];


    // 基本値引値増
    addedBasicSearchResult.map((value) => {
      // 確定時のレコードのキャンペーンIDの内、初期表示時に存在する場合のレコード(更新レコード)
      if (tempBasicCampaingCdListBefore.includes(value.campaignCd)) {
        basicSearchResult.map((initialValue) => {
          // キャンペーンIDで初期表示時のレコードと比較を行い 一致したレコードのフィールドを1つずつ全て比較
          if (initialValue.campaignCd === value.campaignCd) {
            // キャンペーン名
            if (initialValue.campaignName !== value.campaignName
              // 会費種別
              || initialValue.membershipFeeType !== value.membershipFeeType
              // 値引値増金額区分
              || initialValue.discountDivision !== value.discountDivision
              // 値引値増金額
              || initialValue.discountAmount !== value.discountAmount
              // セット対象コース
              || initialValue.courseId !== value.courseId
              // １本目除外フラグ
              || initialValue.firstExclusionFlg !== value.firstExclusionFlg
              // 契約数量下限
              || initialValue.contractQuantityLowLimit !== value.contractQuantityLowLimit
              // 契約数量上限
              || initialValue.contractQuantityHighLimit !== value.contractQuantityHighLimit
              // 期限開始日
              || initialValue.LimitStartDate !== value.LimitStartDate
              // 期限終了日
              || initialValue.LimitEndDate !== value.LimitEndDate
              // 契約後月数
              || initialValue.ContractAfterMonth !== value.ContractAfterMonth
              // 稟議書ID
              || initialValue.approvalDocumentId !== value.approvalDocumentId
              // 利用フラグ
              || initialValue.utilizationFlg !== value.utilizationFlg
              // 商品クレームコード
              || initialValue.commodityCrameCd !== value.commodityCrameCd
            ) {
              // 相違したフィールドが存在する場合更新レコードへ格納
              updatedTempList.push(value.campaignCd);
            }
          }
        })
        // 確定時のレコードのキャンペーンIDの内、初期表示時に存在しない場合のレコード(追加レコードリスト)
      } else {
        addedTempList.push(value.campaignCd);
      }
    })

    // チェックAPI用の削除レコードリストの作成
    basicSearchResult.map((value) => {
      // 初期表示時のレコードのキャンペーンIDの内、確定時に存在しない場合のレコード(削除レコード)
      if (!(tempBasicCampaingCdListAfter.includes(value.campaignCd))) {
        deletedTempList.push(value.campaignCd);
      }
    })


    // オプション値引値増
    addedOptionSearchResult.map((value) => {
      // 確定時のレコードのキャンペーンIDの内、初期表示時に存在する場合のレコード(更新レコード)
      if (tempOptionCampaingCdListBefore.includes(value.campaignCd)) {
        optionSearchResult.map((initialValue) => {
          // キャンペーンIDで初期表示時のレコードと比較を行い 一致したレコードのフィールドを1つずつ全て比較
          if (initialValue.campaignCd === value.campaignCd) {
            // キャンペーン名
            if (initialValue.campaignName !== value.campaignName
              // 会費種別
              || initialValue.membershipFeeType !== value.membershipFeeType
              // 値引値増金額区分
              || initialValue.discountDivision !== value.discountDivision
              // 値引値増金額
              || initialValue.discountAmount !== value.discountAmount
              // サービスID
              || initialValue.serviceId !== value.serviceId
              // １本目除外フラグ
              || initialValue.firstExclusionFlg !== value.firstExclusionFlg
              // 契約数量下限
              || initialValue.contractQuantityLowLimit !== value.contractQuantityLowLimit
              // 契約数量上限
              || initialValue.contractQuantityHighLimit !== value.contractQuantityHighLimit
              // 期限開始日
              || initialValue.LimitStartDate !== value.LimitStartDate
              // 期限終了日
              || initialValue.LimitEndDate !== value.LimitEndDate
              // 契約後月数
              || initialValue.ContractAfterMonth !== value.ContractAfterMonth
              // 稟議書ID
              || initialValue.approvalDocumentId !== value.approvalDocumentId
              // 利用フラグ
              || initialValue.utilizationFlg !== value.utilizationFlg
              // 商品クレームコード
              || initialValue.commodityCrameCd !== value.commodityCrameCd
            ) {
              // 相違したフィールドが存在する場合更新レコードへ格納
              updatedTempList.push(value.campaignCd);
            }
          }
        })
        // 確定時のレコードのキャンペーンIDの内、初期表示時に存在しない場合のレコード(追加レコードリスト)
      } else {
        addedTempList.push(value.campaignCd);
      }
    })

    // チェックAPI用の削除レコードリストの作成
    optionSearchResult.map((value) => {
      // 初期表示時のレコードのキャンペーンIDの内、確定時に存在しない場合のレコード(削除レコード)
      if (!(tempOptionCampaingCdListAfter.includes(value.campaignCd))) {
        deletedTempList.push(value.campaignCd);
      }
    })

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

    // エラーメッセージを格納する
    checkResult.errorList.map((error) => {
      errorMessages.push(error);
    })

    // 登録内容確認ポップアップの呼び出し
    setScrCom0032PopupData({
      errorMessages: errorMessages,
      warningMessages: convertToWarnMessages(
        checkResult.warnList
      ),
      contentsList: {
        screenName: '商品管理',
        screenId: 'SCR-COM-0013',
        tabName: 'サービス',
        tabId: '',
        sectionList: convertToSectionList(dirtyFields),
      },
      changeExpectDate: new Date(), // TODO:業務日付取得方法実装待ち、new Date()で登録
    });
  }


  /**
  * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
  */
  const handlePopupConfirm = () => {
    setIsOpenPopup(false);
    setIsOpenApplicationPopup(true);
    // SCR-COM-0013-0033: 登録内容申請入力チェックAPI
    setScrCom0033PopupData({
      screenId: '',
      // タブID
      tabId: '',
      // 一括登録ID
      allRegistrationId: '',
      // マスタID
      masterId: '',
      // 登録変更メモ
      registChangeMemo: '',
      // 変更予定日
      changeExpectDate: '',
      // 申請金額
      applicationMoney: '',
      // 申請者ID
      applicationId: '',
      // プログラムID
      programId: '',
    })
  };


  /**
  * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
  */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };


  /**
  * 登録内容申請ポップアップの出力ボタンクリック時のイベントハンドラ
  */
  const handleApplicationPopupConfirm = async (
    selectValues: SelectValuesModel | undefined,
    applicationComment: string | undefined,
  ) => {
    setIsOpenPopup(false);

    // SCR-COM-0013-0010: 値引値増情報登録更新API
    const mergeDiscountRequest: ScrCom0013MergeDiscountRequest = {
      /** 基本値引値増 */
      baseDiscountInfo: basicSearchResult,
      /** オプション値引値増情報 */
      optionDiscountInfo: optionSearchResult,
      /** 登録対象リスト */
      registTargetedList: registTargetedList,
      /** 更新対象リスト */
      updateTargetedList: updateTargetedList,
      /** 削除対象リスト */
      deleteTargetedList: deleteTargetedList,
      /** 申請従業員ID */
      applicationEmployeeId: appContext.user,
      /** 登録変更メモ */
      registrationChangeMemo: '',
      /** 第一承認者ID */
      firstApproverId: '',
      /** 第一承認者メールアドレス */
      firstApproverMailAddress: '',
      /** 第ニ承認者ID */
      secondApproverId: '',
      /** 第三承認者ID */
      thirdApproverId: '',
      /** 第四承認者ID */
      fourthApproverId: '',
      /** 申請コメント */
      applicationComment: '',
    };
    await ScrCom0013MergeDiscount(mergeDiscountRequest);
  };

  /**
   * 登録内容申請ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handleApplicationPopupCancel = () => {
    setIsOpenPopup(false);
  };


  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <Section
            name='会費セクション'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                {/* TODO：エクスポートアイコンに将来的に変更 */}
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                {/* 履歴表示の場合 追加ボタン非活性 */}
                <AddButton
                  onClick={handleBasicIconAddClick}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >追加
                </AddButton>
              </MarginBox>
            }
          >
            <RowStack>
              <InputLayout
                label='基本値引値増'
                size='xl'
              // required
              >
              </InputLayout>
            </RowStack>
            <DataGrid
              pagination={true}
              columns={searchBasicResultColumns}
              rows={addedBasicSearchResult}
              width={1500}
              //
              columnGroupingModel={basicColumnGroups}
            // TODO: 履歴表示/編集権限なしの場合にどのカラムを非活性にするか指定する(campaignCd以外の入力部分全て)
            // getCellDisabled={(params) => {
            //   if (params.field === 'input' && params.id === 0) return true;
            //   if (params.field === 'select' && params.id === 1) return true;
            //   if (params.field === 'radio' && params.id === 2) return true;
            //   if (params.field === 'checkbox' && params.id === 3) return true;
            //   if (params.field === 'datepicker' && params.id === 4) return true;
            //   return false
            // }}
            />
            <br />
            <br />
            <RightBox>
              <MarginBox mt={2} mb={4} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
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
            <RowStack>
              <InputLayout
                label='オプション値引値増'
                size='xl'
              // required
              >
              </InputLayout>
            </RowStack>
            <DataGrid
              pagination={true}
              columns={searchOptionResultColumns}
              rows={addedOptionSearchResult}
              width={1500}
              // 
              columnGroupingModel={optionColumnGroups}
            // TODO: 履歴表示/編集権限なしの場合にどのカラムを非活性にするか指定する(campaignCd以外の入力部分全て)
            // getCellDisabled={(params) => {
            //   if (params.field === 'input' && params.id === 0) return true;
            //   if (params.field === 'select' && params.id === 1) return true;
            //   if (params.field === 'radio' && params.id === 2) return true;
            //   if (params.field === 'checkbox' && params.id === 3) return true;
            //   if (params.field === 'datepicker' && params.id === 4) return true;
            //   return false
            // }}
            />
          </Section>
          <Section
            name='手数料セクション'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                {/* TODO：エクスポートアイコンに将来的に変更 */}
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                {/* 履歴表示 or 編集権限なしの場合 追加ボタン非活性 */}
                <AddButton
                  onClick={handleCommissionIconAddClick}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >追加
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              pagination={true}
              columns={searchCommissionResultColumns}
              rows={commissionSearchResult}
              hrefs={hrefs}
              onLinkClick={handleLinkClick}
              width={1500}
            // TODO: 履歴表示/編集権限なしの場合にどのカラムを非活性にするか指定する(campaignCd以外の入力部分全て)
            // getCellDisabled={(params) => {
            //   if (params.field === 'input' && params.id === 0) return true;
            //   if (params.field === 'select' && params.id === 1) return true;
            //   if (params.field === 'radio' && params.id === 2) return true;
            //   if (params.field === 'checkbox' && params.id === 3) return true;
            //   if (params.field === 'datepicker' && params.id === 4) return true;
            //   return false
            // }}
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
          >確定
          </ConfirmButton>
        </Stack>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      < ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />

      {/* 登録内容申請ポップアップ */}
      <ScrCom0033Popup
        isOpen={isOpenApplicationPopup}
        data={scrCom0033PopupData}
        handlePopupConfirm={() => handleApplicationPopupConfirm}
        handleCancel={handleApplicationPopupCancel}
      />
    </>
  )
}
export default ScrCom0013CommissionDiscountPacksTab;
