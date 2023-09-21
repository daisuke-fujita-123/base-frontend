import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';
import { ObjectSchema } from 'yup';

import ScrCom0032Popup, {
  columnList,
  errorList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';
import ScrCom0033Popup, {
  ScrCom0033PopupModel,
} from 'pages/com/popups/ScrCom0033Popup';

import { ContentsBox, MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, LabelStack, RowStack, Stack } from 'layouts/Stack';

import {
  AddIconButton,
  CancelButton,
  ConfirmButton,
  PrimaryButton,
} from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { Dialog } from 'controls/Dialog';
import { CaptionLabel } from 'controls/Label';
import { Radio } from 'controls/Radio';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  ScrCom9999getCodeManagementMasterMultiple,
  ScrCom9999GetCoursename,
  ScrCom9999GetCourseServiceDiscountInfo,
  ScrCom9999GetCourseServiceDiscountInfoResponse,
  ScrCom9999GetMembershipfeediscountincreaseInfo,
  ScrCom9999GetMembershipfeediscountincreaseInfoResponse,
  ScrCom9999SearchCampaignInfo,
  ScrCom9999SearchCampaignInfoResponse,
} from 'apis/com/ScrCom9999Api';
import {
  registrationRequest,
  ScrMem0014CalculateAmountMembershipfeediscountincrease,
  ScrMem0014CalculateAmountMembershipfeediscountincreaseRequest,
  ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse,
  ScrMem0014ContractBillinginfoBase,
  ScrMem0014GetCourseServiceDiscountInfo,
  ScrMem0014GetCourseServiceDiscountInfoResponse,
  ScrMem0014InputCheckBillingInfo,
  ScrMem0014InputCheckBillingInfoRequest,
  ScrMem0014InputCheckBillingInfoResponse,
  ScrMem0014InputCheckServicediscountpriceincreaseInfo,
  ScrMem0014InputCheckServicediscountpriceincreaseInfoRequest,
} from 'apis/mem/ScrMem0014Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import {
  GridRenderCellParams,
  GridTreeNodeWithRender,
  useGridApiRef,
} from '@mui/x-data-grid-pro';

/**
 * 基本情報データモデル
 */
interface CourseServiceDiscountInfoModel {
  // オートバンクシステム端末契約ID
  autobankSystemTerminalContractId: string;
  // オートバンクシステム認定証発行jpgフラグ
  autobankSystemCertificateIssuanceJpgFlag: string;
  // オートバンクシステムNAVI取引区分
  autobankSystemNaviDealKind: string;
  // オートバンクシステムNAVI特選車参加区分
  autobankSystemNaviChoiceEntryKind: string;
  // オートバンクシステム在庫グループ
  autobankSystemStockGroup: string;
  // オートバンクシステムaB提供サービス区分
  autobankSystemAbOfferServiceKind: string;
  // オートバンクシステムサービスメモ
  autobankSystemServiceMemo: string;
  // オートバンクシステム設置完了日
  autobankSystemInstallationCompletionDate: string;
  // コラボ共通区分
  collaborationCommonKind: string;
  // i-moto-auc会員区分
  imotoaucMemberKind: string;
  // i-moto-auc参加区分
  imotoaucEntryKind: string;
  // i-moto-aucメール送信区分
  imotoaucMailSendKind: string;
  // i-moto-aucDM送信区分
  imotoaucDmSendKind: string;
  // i-moto-auc契約数
  imotoaucContractCount: number;
  // アイオーク管理番号
  iaucManagementNumber: string;
  // カーセンサー営業区分
  carsensorSalesKind: string;
  // カーセンサーAUCCS区分
  carsensorAucCsKind: string;
  // 業務支援用管理番号
  supportManagementNumber: string;
  // ランマート取引区分
  runmartDealKind: string;
  // ランマート共有情報
  runmartShareInformation: string;

  // コース個別設定
  courseTypeSetting: boolean;

  // 手数料値引値増パックID
  commissionDiscountPackId: string;
  // 個別設定 パック名
  packName: string;
  // 個別設定 有効期間開始日
  validityPeriodStartDate: string;
  // 個別設定 有効期間終了日
  validityPeriodEndDate: string;
}

/**
 * コース情報列定義
 */
const courseInfomationColumns: GridColDef[] = [
  {
    field: 'courseId',
    headerName: 'コース',
    cellType: 'select',
    selectValues: [],
    size: 'l',
  },
  {
    field: 'linkMemberKind',
    headerName: '連携会員区分',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'courseEntryKind',
    headerName: 'コース参加区分',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'useStartDate',
    headerName: '利用開始日',
    cellType: 'datepicker',
    size: 'l',
  },
  {
    field: 'contractPeriodDate',
    headerName: '契約期間',
    size: 'l',
  },
  {
    field: 'recessPeriodDate',
    headerName: '休会期間',
    cellType: 'fromto',
    size: 'l',
  },
  {
    field: 'leavingDate',
    headerName: '脱会日',
    cellType: 'datepicker',
    size: 'l',
  },
  {
    field: 'targetedServiceKind',
    headerName: '連携用対象サービス',
    size: 'l',
  },
  {
    field: 'recessLeavingReasonKind',
    headerName: '休脱会理由',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
];

const courseInfomationValidationSchema: ObjectSchema<any> = yup.object({
  useStartDate: yup.string().max(10).date().label('利用開始日'),
  leavingDate: yup.string().max(10).date().label('脱会日'),
});

/**
 * 基本サービス情報列定義
 */
const baseServiceInfomationColumns: GridColDef[] = [
  {
    field: 'service',
    headerName: '基本サービス',
    size: 'l',
  },
  {
    field: 'contractCount',
    headerName: '契約本数',
    cellType: 'input',
    size: 's',
  },
  {
    field: 'targetedServiceKind',
    headerName: '連携用対象サービス',
    size: 'l',
  },
];

const baseServiceInfomationValidationSchema: ObjectSchema<any> = yup.object({
  contractCount: yup.string().max(4).number().label('契約本数'),
});

/**
 * オプション情報列定義
 */
const optionInfomationColumns: GridColDef[] = [
  {
    field: 'optionEntryKind',
    headerName: 'オプション参加区分',
    size: 'm',
  },
  {
    field: 'serviceName',
    headerName: 'オプション',
    size: 'l',
  },
  {
    field: 'contractCount',
    headerName: '契約本数',
    cellType: 'input',
    size: 's',
  },
  {
    field: 'useStartDate',
    headerName: '利用開始日',
    cellType: 'datepicker',
    size: 'l',
  },
  {
    field: 'contractPeriodDate',
    headerName: '契約期間',
    size: 'l',
  },
  {
    field: 'recessPeriodDate',
    headerName: '休会期間',
    cellType: 'fromto',
    size: 'l',
  },
  {
    field: 'leavingDate',
    headerName: '脱会日',
    cellType: 'datepicker',
    size: 'l',
  },
  {
    field: 'useOptionService',
    headerName: '利用前提サービス',
    cellType: 'input',
    size: 'l',
  },
  {
    field: 'targetedServiceKind',
    headerName: '連携用対象サービス',
    size: 'l',
  },
  {
    field: 'recessLeavingReasonKind',
    headerName: '休脱会理由',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'button',
    headerName: '',
    //cellType: 'button',
  },
];

const optionInfomationValidationSchema: ObjectSchema<any> = yup.object({
  contractCount: yup.string().max(4).number().label('契約本数'),
});

/**
 * コース個別設定・基本値引値増列定義
 */
const individualCourseSettingBasicDiscountPriceColumns: GridColDef[] = [
  {
    field: 'enableFlag',
    headerName: '有効',
    size: 's',
  },
  {
    field: 'feeKind',
    headerName: '会費種別',
    size: 's',
  },
  {
    field: 'Price',
    headerName: '金額',
    size: 'l',
  },
  {
    field: 'courseName',
    headerName: 'セット対象コース',
    size: 'l',
  },
  {
    field: 'oneCountExclusionFlag',
    headerName: '1本目除外',
    cellType: 'checkbox',
    size: 's',
  },
  {
    field: 'contractCount',
    headerName: '契約本数',
    size: 'm',
  },
  {
    field: 'periodDate',
    headerName: '期間',
    size: 'l',
  },
];

/**
 * コース個別設定・オプション値引値増列定義
 */
const individualCourseSettingOptionDiscountPriceColumns: GridColDef[] = [
  {
    field: 'enableFlag',
    headerName: '有効',
    size: 's',
  },
  {
    field: 'feeKind',
    headerName: '会費種別',
    size: 's',
  },
  {
    field: 'Price',
    headerName: '金額',
    size: 'l',
  },
  {
    field: 'serviceName',
    headerName: 'サービス名',
    size: 'l',
  },
  {
    field: 'oneCountExclusionFlag',
    headerName: '1本目除外',
    cellType: 'checkbox',
    size: 's',
  },
  {
    field: 'contractCount',
    headerName: '契約本数',
    size: 'm',
  },
  {
    field: 'periodStart',
    headerName: '期間',
    size: 'l',
  },
];

/**
 * 契約個別設定・基本値引値増列定義
 */
const individualContractSettingBasicDiscountPriceColumns: GridColDef[] = [
  {
    field: 'enableFlag',
    headerName: '有効',
    size: 's',
  },
  {
    field: 'campaignCode',
    headerName: 'キャンペーンコード',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'campaignName',
    headerName: 'キャンペーン名',
    size: 'l',
  },
  {
    field: 'feeKind',
    headerName: '会費種別',
    size: 's',
  },
  {
    field: 'Price',
    headerName: '金額',
    size: 'l',
  },
  {
    field: 'courseName',
    headerName: 'セット対象コース',
    size: 'l',
  },
  {
    field: 'oneCountExclusionFlag',
    headerName: '1本目除外',
    cellType: 'checkbox',
    size: 's',
  },
  {
    field: 'contractCount',
    headerName: '契約本数',
    size: 'm',
  },
  {
    field: 'periodDate',
    headerName: '期間',
    size: 'l',
  },
];

/**
 * 契約個別設定・オプション値引値増列定義
 */
const individualContractSettingOptionDiscountPriceColumns: GridColDef[] = [
  {
    field: 'enableFlag',
    headerName: '有効',
    size: 's',
  },
  {
    field: 'campaignCode',
    headerName: 'キャンペーンコード',
    cellType: 'select',
    selectValues: [],
    size: 'm',
  },
  {
    field: 'campaignName',
    headerName: 'キャンペーン名',
    size: 'l',
  },
  {
    field: 'feeKind',
    headerName: '会費種別',
    size: 's',
  },
  {
    field: 'Price',
    headerName: '金額',
    size: 'l',
  },
  {
    field: 'serviceName',
    headerName: 'サービス名',
    size: 'l',
  },
  {
    field: 'oneCountExclusionFlag',
    headerName: '1本目除外',
    cellType: 'checkbox',
    size: 's',
  },
  {
    field: 'contractCount',
    headerName: '契約本数',
    size: 'm',
  },
  {
    field: 'periodDate',
    headerName: '期間',
    size: 'l',
  },
];

/**
 * 最終値引値増金額列定義
 */
const finalFeeDiscountColumns: GridColDef[] = [
  {
    field: 'useOptionServiceId',
    headerName: '基本/オプション',
    size: 'm',
  },
  {
    field: 'feeKind',
    headerName: '会費種別',
    size: 's',
  },
  {
    field: 'courseContractId',
    headerName: 'コース個別/契約個別',
    size: 'm',
  },
  {
    field: 'serviceName',
    headerName: 'サービス名',
    size: 'l',
  },
  {
    field: 'contractCount',
    headerName: '契約本数',
    size: 's',
  },
  {
    field: 'discountPrice',
    headerName: '値引値増額（1本あたり）',
    size: 'l',
  },
  {
    field: 'discountTotalPrice',
    headerName: '合計値引値増額',
    size: 'm',
  },
];

/**
 * 値引値増適用前後料金表列定義
 */
const feeDiscountColumns: GridColDef[] = [
  {
    field: 'courseName',
    headerName: 'コース名',
    size: 'l',
  },
  {
    field: 'courseMembership',
    headerName: 'コース入会金',
    size: 'm',
  },
  {
    field: 'courseFee',
    headerName: 'コース会費',
    size: 'm',
  },
];

/**
 * 値引値増適用前後オプション列定義
 */
const optionInfoColumns: GridColDef[] = [
  {
    field: 'serviceName',
    headerName: 'オプションサービス名',
    size: 'l',
  },
  {
    field: 'optionServiceMembership',
    headerName: 'オプションサービス入会金',
    size: 'm',
  },
  {
    field: 'optionServiceFee',
    headerName: '会費',
    size: 'm',
  },
];

/**
 * 会員個別設定列定義
 */
const memberTypeSettingTvaaColumns: GridColDef[] = [
  {
    field: 'commissionDiscountPackId',
    headerName: '値引値増',
    cellType: 'select',
    selectValues: [],
    size: 'l',
  },
  {
    field: 'validityPeriodDate',
    headerName: '期間',
    size: 'l',
  },
];

/**
 * 会員個別設定列定義
 */
const memberTypeSettingBikeColumns: GridColDef[] = [
  {
    field: 'commissionDiscountPackId',
    headerName: '値引値増',
    cellType: 'select',
    selectValues: [],
    size: 'l',
  },
  {
    field: 'validityPeriodDate',
    headerName: '期間',
    size: 'l',
  },
];

/**
 * 会員個別設定列定義
 */
const memberTypeSettingOmatomeColumns: GridColDef[] = [
  {
    field: 'commissionDiscountPackId',
    headerName: '値引値増',
    cellType: 'select',
    selectValues: [],
    size: 'l',
  },
  {
    field: 'validityPeriodDate',
    headerName: '期間',
    size: 'l',
  },
];

/**
 * コース情報行データモデル
 */
interface courseInfomationRowModel {
  id: string;
  courseId: string;
  linkMemberKind: string;
  courseEntryKind: string;
  useStartDate: string;
  contractPeriodStartDate: string;
  contractPeriodEndDate: string;
  contractPeriodDate: string;
  recessPeriodDate: string[];
  leavingDate: string;
  targetedServiceKind: string;
  recessLeavingReasonKind: string;
}

/**
 * 基本サービス行データモデル
 */
interface baseServiceInfomationRowModel {
  id: string;
  service: string;
  serviceId: string;
  serviceName: string;
  contractCount: number;
  targetedServiceKind: string;
}

/**
 * オプション情報行データモデル
 */
interface optionInfomationRowModel {
  id: string;
  optionEntryKind: string;
  serviceId: string;
  serviceName: string;
  contractOptionNumber: number;
  contractCount: number;
  useStartDate: string;
  contractPeriodDate: string;
  contractPeriodStartDate: string;
  contractPeriodEndDate: string;
  recessPeriodDate: string[];
  leavingDate: string;
  useOptionServiceId: string;
  useOptionService: string;
  targetedServiceKind: string;
  recessLeavingReasonKind: string;
}

/**
 * コース個別設定・基本値引値増行データモデル
 */
interface individualCourseSettingBasicDiscountPriceRowModel {
  id: string;
  enableFlag: string;
  feeKind: string;
  Price: string;
  discountPriceKind: string;
  discountPrice: number;
  courseId: string;
  courseName: string;
  oneCountExclusionFlag?: boolean;
  contractCount: string;
  contractCountMin: number;
  contractCountMax: number;
  periodDate: string;
  periodStartDate: string;
  periodEndDate: string;
  contractMonths: number;
}

/**
 * コース個別設定・オプション値引値増行データモデル
 */
interface individualCourseSettingOptionDiscountPriceRowModel {
  id: string;
  enableFlag: string;
  feeKind: string;
  Price: string;
  discountPriceKind: string;
  discountPrice: number;
  serviceId: string;
  serviceName: string;
  oneCountExclusionFlag?: boolean;
  contractCount: string;
  contractCountMin: number;
  contractCountMax: number;
  periodDate: string;
  periodStartDate: string;
  periodEndDate: string;
  contractMonths: number;
}

/**
 * 契約個別設定・基本値引値増行データモデル
 */
interface individualContractSettingBasicDiscountPriceRowModel {
  id: string;
  enableFlag: string;
  campaignCode: string;
  campaignName: string;
  feeKind: string;
  Price: string;
  discountPriceKind: string;
  discountPrice: number;
  courseId: string;
  courseName: string;
  oneCountExclusionFlag?: boolean;
  contractCount: string;
  contractCountMin: number;
  contractCountMax: number;
  periodDate: string;
  periodStartDate: string;
  periodEndDate: string;
  contractMonths: number;
}

/**
 * 契約個別設定・オプション値引値増行データモデル
 */
interface individualContractSettingOptionDiscountPriceRowModel {
  id: string;
  enableFlag: string;
  campaignCode: string;
  campaignName: string;
  feeKind: string;
  Price: string;
  discountPriceKind: string;
  discountPrice: number;
  serviceId: string;
  serviceName: string;
  oneCountExclusionFlag?: boolean;
  contractCount: string;
  contractCountMin: number;
  contractCountMax: number;
  periodDate: string;
  periodStartDate: string;
  periodEndDate: string;
  contractMonths: number;
}

/**
 * 最終値引値増金額行データモデル
 */
interface finalFeeDiscountRowModel {
  id: string;
  useOptionServiceId: string;
  feeKind: string;
  courseContractId: string;
  serviceId: string;
  serviceName: string;
  contractCount: number;
  discountPrice: number;
  discountTotalPrice: number;
}

/**
 * 値引値増適用前後料金表行データモデル
 */
interface feeDiscountRowModel {
  id: string;
  courseId: string;
  courseName: string;
  courseMembership: number;
  courseFee: number;
}

/**
 * 値引値増適用前後オプション行データモデル
 */
interface optionInfoRowModel {
  id: string;
  serviceId: string;
  serviceName: string;
  optionServiceMembership: number;
  optionServiceFee: number;
}

/**
 * 値引値増適用前後オプション行データモデル
 */
interface typeSettingRowModel {
  id: string;
  commissionDiscountPackId: string;
  packName: string;
  validityPeriodDate: string;
  validityPeriodStartDate: string;
  validityPeriodEndDate: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  terminalContractIdSelectValues: SelectValue[];
  serviceKindSelectValues: SelectValue[];
  memberKindSelectValues: SelectValue[];
  entryKindSelectValues: SelectValue[];
  mailSendKindSelectValues: SelectValue[];
  dmSendKindSelectValues: SelectValue[];
  aucCsKindSelectValues: SelectValue[];
  dealKindSelectValues: SelectValue[];
  carsensorKindSelectValues: SelectValue[];
}

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  autobankSystemTerminalContractId: yup.string().label('端末契約ID'),
  autobankSystemCertificateIssuanceJpgFlag: yup.string().label('認定証発行jpg'),
  autobankSystemNaviDealKind: yup.string().label('NAVI取引区分'),
  autobankSystemNaviChoiceEntryKind: yup.string().label('NAVI特選車参加区分'),
  autobankSystemStockGroup: yup.string().label('在庫グループ').max(3),
  autobankSystemAbOfferServiceKind: yup
    .string()
    .label('aB提供サービス')
    .max(10),
  autobankSystemServiceMemo: yup.string().label('サービスIDメモ').max(254),
  autobankSystemInstallationCompletionDate: yup
    .string()
    .label('設置完了日')
    .max(10),
  collaborationCommonKind: yup.string().label('コラボ共通区分'),
  imotoaucMemberKind: yup.string().label('会員区分'),
  imotoaucEntryKind: yup.string().label('参加区分'),
  imotoaucMailSendKind: yup.string().label('メール送信F'),
  imotoaucDmSendKind: yup.string().label('DM送信F'),
  imotoaucContractCount: yup.string().label('契約数').max(1).number(),
  iaucManagementNumber: yup.string().label('アイオーク管理番号').max(7).half(),
  carsensorSalesKind: yup.string().label('カーセンサー営業区分').max(10),
  carsensorAucCsKind: yup.string().label('AUCCS区分').max(10),
  supportManagementNumber: yup
    .string()
    .label('業務支援用管理番号')
    .max(7)
    .half(),
  runmartDealKind: yup.string().label('ランマート取引区分'),
  runmartShareInformation: yup.string().label('ランマート共有情報').max(60),
};

/**
 * リスト初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  terminalContractIdSelectValues: [],
  serviceKindSelectValues: [],
  memberKindSelectValues: [],
  entryKindSelectValues: [],
  mailSendKindSelectValues: [],
  dmSendKindSelectValues: [],
  aucCsKindSelectValues: [],
  dealKindSelectValues: [],
  carsensorKindSelectValues: [],
};

/**
 * 基本情報初期データ
 */
const initialValues: CourseServiceDiscountInfoModel = {
  autobankSystemTerminalContractId: '',
  autobankSystemCertificateIssuanceJpgFlag: '',
  autobankSystemNaviDealKind: '',
  autobankSystemNaviChoiceEntryKind: '',
  autobankSystemStockGroup: '',
  autobankSystemAbOfferServiceKind: '',
  autobankSystemServiceMemo: '',
  autobankSystemInstallationCompletionDate: '',
  collaborationCommonKind: '',
  imotoaucMemberKind: '',
  imotoaucEntryKind: '',
  imotoaucMailSendKind: '',
  imotoaucDmSendKind: '',
  imotoaucContractCount: 0,
  iaucManagementNumber: '',
  carsensorSalesKind: '',
  carsensorAucCsKind: '',
  supportManagementNumber: '',
  runmartDealKind: '',
  runmartShareInformation: '',

  courseTypeSetting: true,

  commissionDiscountPackId: '',
  packName: '',
  validityPeriodStartDate: '',
  validityPeriodEndDate: '',
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [
    {
      screenId: '',
      screenName: '',
      tabId: 0,
      tabName: '',
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
  ],
  changeExpectDate: '',
};

/**
 * 登録内容申請ポップアップ初期データ
 */
const scrCom0033PopupInitialValues: ScrCom0033PopupModel = {
  screenId: '',
  tabId: 0,
  applicationMoney: 0,
};

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: 'サービス固有情報',
    fields: [
      'autobankSystemTerminalContractId',
      'autobankSystemServiceMemo',
      'autobankSystemCertificateIssuanceJpgFlag',
      'autobankSystemInstallationCompletionDate',
      'autobankSystemNaviDealKind',
      'autobankSystemNaviChoiceEntryKind',
      'autobankSystemStockGroup',
      'autobankSystemAbOfferServiceKind',
      'collaborationCommonKind',
      'imotoaucMemberKind',
      'imotoaucEntryKind',
      'imotoaucMailSendKind',
      'imotoaucDmSendKind',
      'imotoaucContractCount',
      'iaucManagementNumber',
      'carsensorSalesKind',
      'carsensorAucCsKind',
      'supportManagementNumber',
      'runmartDealKind',
      'runmartShareInformation',
    ],
    name: [
      '端末契約ID',
      'サービスIDメモ',
      '認定証発行jpg',
      '設置完了日',
      'NAVI取引区分',
      'NAVI特選車参加区分',
      '在庫グループ',
      'aB提供サービス',
      'コラボ共通区分',
      '会員区分',
      '参加区分',
      'メール送信F',
      'DM送信F',
      '契約数',
      'アイオーク管理番号',
      'カーセンサー営業区分',
      'AUCCS区分',
      '業務支援用管理番号',
      'ランマート取引区分',
      'ランマート共有情報',
    ],
  },
];

/**
 * 変更した項目から登録・変更内容データへの変換
 */
const convertToSectionList = (dirtyFields: object): sectionList[] => {
  const fields = Object.keys(dirtyFields);
  const sectionList: sectionList[] = [];
  const columnList: columnList[] = [];
  sectionDef.forEach((d) => {
    fields.forEach((f) => {
      if (d.fields.includes(f)) {
        columnList.push({ columnName: d.name[d.fields.indexOf(f)] });
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
 * 法人基本情報取得APIから法人基本情報データモデルへの変換
 */
const convertToCourseServiceDiscountInfoModel = (
  response: ScrMem0014GetCourseServiceDiscountInfoResponse
): CourseServiceDiscountInfoModel => {
  return {
    autobankSystemTerminalContractId: response.autobankSystemTerminalContractId,
    autobankSystemCertificateIssuanceJpgFlag:
      response.autobankSystemCertificateIssuanceJpgFlag ? '1' : '2',
    autobankSystemNaviDealKind: response.autobankSystemNaviDealKind,
    autobankSystemNaviChoiceEntryKind:
      response.autobankSystemNaviChoiceEntryKind,
    autobankSystemStockGroup: response.autobankSystemStockGroup,
    autobankSystemAbOfferServiceKind: response.autobankSystemAbOfferServiceKind,
    autobankSystemServiceMemo: response.autobankSystemServiceMemo,
    autobankSystemInstallationCompletionDate:
      response.autobankSystemInstallationCompletionDate,
    collaborationCommonKind: response.collaborationCommonKind,
    imotoaucMemberKind: response.imotoaucMemberKind,
    imotoaucEntryKind: response.imotoaucEntryKind,
    imotoaucMailSendKind: response.imotoaucMailSendKind,
    imotoaucDmSendKind: response.imotoaucDmSendKind,
    imotoaucContractCount: response.imotoaucContractCount,
    iaucManagementNumber: response.iaucManagementNumber,
    carsensorSalesKind: response.carsensorSalesKind,
    carsensorAucCsKind: response.carsensorAucCsKind,
    supportManagementNumber: response.supportManagementNumber,
    runmartDealKind: response.runmartDealKind,
    runmartShareInformation: response.runmartShareInformation,

    courseTypeSetting: response.courseFeeDiscountJudgeFlag,

    commissionDiscountPackId:
      response.courseTypeSetting.commissionDiscountPackId,
    packName: response.courseTypeSetting.packName,
    validityPeriodStartDate: new Date(
      response.courseTypeSetting.validityPeriodStartDate
    ).toLocaleDateString(),
    validityPeriodEndDate: new Date(
      response.courseTypeSetting.validityPeriodEndDate
    ).toLocaleDateString(),
  };
};

/**
 * 変更履歴情報取得APIから法人基本情報データモデルへの変換
 */
const convertToHistoryCourseServiceDiscountInfoModel = (
  response: registrationRequest
): CourseServiceDiscountInfoModel => {
  return {
    autobankSystemTerminalContractId: response.autobankSystemTerminalContractId,
    autobankSystemCertificateIssuanceJpgFlag:
      response.autobankSystemCertificateIssuanceJpgFlag ? '1' : '2',
    autobankSystemNaviDealKind: response.autobankSystemNaviDealKind,
    autobankSystemNaviChoiceEntryKind:
      response.autobankSystemNaviChoiceEntryKind,
    autobankSystemStockGroup: response.autobankSystemStockGroup,
    autobankSystemAbOfferServiceKind: response.autobankSystemAbOfferServiceKind,
    autobankSystemServiceMemo: response.autobankSystemServiceMemo,
    autobankSystemInstallationCompletionDate: new Date(
      response.autobankSystemInstallationCompletionDate
    ).toLocaleDateString(),
    collaborationCommonKind: response.collaborationCommonKind,
    imotoaucMemberKind: response.imotoaucMemberKind,
    imotoaucEntryKind: response.imotoaucEntryKind,
    imotoaucMailSendKind: response.imotoaucMailSendKind,
    imotoaucDmSendKind: response.imotoaucDmSendKind,
    imotoaucContractCount: response.imotoaucContractCount,
    iaucManagementNumber: response.iaucManagementNumber,
    carsensorSalesKind: response.carsensorSalesKind,
    carsensorAucCsKind: response.carsensorAucCsKind,
    supportManagementNumber: response.supportManagementNumber,
    runmartDealKind: response.runmartDealKind,
    runmartShareInformation: response.runmartShareInformation,

    courseTypeSetting: response.courseFeeDiscountJudgeFlag,

    commissionDiscountPackId:
      response.courseTypeSetting.commissionDiscountPackId,
    packName: response.courseTypeSetting.packName,
    validityPeriodStartDate: new Date(
      response.courseTypeSetting.validityPeriodStartDate
    ).toLocaleDateString(),
    validityPeriodEndDate: new Date(
      response.courseTypeSetting.validityPeriodEndDate
    ).toLocaleDateString(),
  };
};

/**
 * 会費値引値増金額算出APIリクエストへの変換
 */
const convertFromCalculateAmountMembershipfeediscountincreaseRequest = (
  getCourseServiceDiscountInfoResponse: ScrMem0014GetCourseServiceDiscountInfoResponse,
  getMembershipfeediscountincreaseInfoResponse: ScrCom9999GetMembershipfeediscountincreaseInfoResponse
): ScrMem0014CalculateAmountMembershipfeediscountincreaseRequest => {
  return {
    courseInfo: {
      courseId: getCourseServiceDiscountInfoResponse.courseInfo.courseId,
      courseName: getCourseServiceDiscountInfoResponse.courseInfo.courseName,
      courseEntryKind:
        getCourseServiceDiscountInfoResponse.courseInfo.courseEntryKind,
      useStartDate: new Date(
        getCourseServiceDiscountInfoResponse.courseInfo.useStartDate
      ),
    },
    optionInfo: getCourseServiceDiscountInfoResponse.optionInfomation.map(
      (x) => {
        return {
          optionEntryKind: x.optionEntryKind,
          serviceId: x.serviceId,
          serviceName: x.serviceName,
          contractCount: x.contractCount,
        };
      }
    ),
    courseFeeDiscountJudgeFlag:
      getCourseServiceDiscountInfoResponse.courseFeeDiscountJudgeFlag,
    individualCourseSetting: {
      basicDiscountPrice:
        getMembershipfeediscountincreaseInfoResponse.courseBasseicDiscountPrice.map(
          (x) => {
            return {
              feeKind: x.feeKind,
              discountPriceKind: x.discountPriceKind,
              discountPrice: x.discountPrice,
              courseId: x.courseId,
              courseName: x.courseName,
              oneCountExclusionFlag: x.oneCountExclusionFlag,
              contractCountMin: x.contractCountMin,
              contractCountMax: x.contractCountMax,
              periodStartDate: new Date(x.periodStartDate),
              periodEndDate: new Date(x.periodEndDate),
              contractMonths: Number(x.contractMonths),
              enableFlag: x.enableFlag,
            };
          }
        ),
      optionDiscountPrice:
        getMembershipfeediscountincreaseInfoResponse.courseOptionDiscountPrice.map(
          (x) => {
            return {
              feeKind: x.feeKind,
              discountPriceKind: x.discountPriceKind,
              discountPrice: x.discountPrice,
              serviceId: x.serviceID,
              serviceName: x.serviceName,
              oneCountExclusionFlag: x.oneCountExclusionFlag,
              contractCountMin: x.contractCountMin,
              contractCountMax: x.contractCountMax,
              periodStartDate: new Date(x.periodStartDate),
              periodEndDate: new Date(x.periodEndDate),
              contractMonths: Number(x.contractMonths),
              enableFlag: x.enableFlag,
            };
          }
        ),
    },
    individualContractSetting: {
      basicDiscountPrice:
        getMembershipfeediscountincreaseInfoResponse.contractBasicDiscountPrice.map(
          (x) => {
            return {
              campaignCode: x.campaignCode,
              campaignName: x.campaignName,
              feeKind: x.feeKind,
              discountPriceKind: x.discountPriceKind,
              discountPrice: x.discountPrice,
              courseId: x.courseId,
              courseName: x.courseName,
              oneCountExclusionFlag: x.oneCountExclusionFlag,
              contractCountMin: x.contractCountMin,
              contractCountMax: x.contractCountMax,
              periodStartDate: new Date(x.periodStartDate),
              periodEndDate: new Date(x.periodEndDate),
              contractMonths: Number(x.contractMonths),
              enableFlag: x.enableFlag,
            };
          }
        ),
      // オプション値引値増
      optionDiscountPrice:
        getMembershipfeediscountincreaseInfoResponse.contractOptionDiscountPrice.map(
          (x) => {
            return {
              campaignCode: x.campaignCode,
              campaignName: x.campaignName,
              feeKind: x.feeKind,
              discountPriceKind: x.discountPriceKind,
              discountPrice: x.discountPrice,
              serviceId: x.serviceID,
              serviceName: x.serviceName,
              oneCountExclusionFlag: x.oneCountExclusionFlag,
              contractCountMin: x.contractCountMin,
              contractCountMax: x.contractCountMax,
              periodStartDate: new Date(x.periodStartDate),
              periodEndDate: new Date(x.periodEndDate),
              contractMonths: Number(x.contractMonths),
              enableFlag: x.enableFlag,
            };
          }
        ),
    },
  };
};

/**
 * 会費値引値増金額算出APIリクエストへの変換
 */
const convertFromUpdateCalculateAmountMembershipfeediscountincreaseRequest = (
  courseServiceDiscountInfo: CourseServiceDiscountInfoModel,
  courseInfomationRow: courseInfomationRowModel[],
  optionInfomationRow: optionInfomationRowModel[],
  individualCourseSettingBasicDiscountPriceRow: individualCourseSettingBasicDiscountPriceRowModel[],
  individualCourseSettingOptionDiscountPriceRow: individualCourseSettingOptionDiscountPriceRowModel[],
  individualContractSettingBasicDiscountPriceRow: individualContractSettingBasicDiscountPriceRowModel[],
  individualContractSettingOptionDiscountPriceRow: individualContractSettingOptionDiscountPriceRowModel[]
): ScrMem0014CalculateAmountMembershipfeediscountincreaseRequest => {
  // コース名取得
  const courseSelectValue = courseInfomationColumns[0].selectValues?.find(
    (x) => x.value === courseInfomationRow[0].courseId
  );
  const courseName =
    courseSelectValue === undefined ? '' : courseSelectValue.displayValue;

  return {
    courseInfo: {
      courseId: courseInfomationRow[0].courseId,
      courseName: courseName,
      courseEntryKind: courseInfomationRow[0].courseEntryKind,
      useStartDate: new Date(courseInfomationRow[0].useStartDate),
    },
    optionInfo: optionInfomationRow.map((x) => {
      return {
        optionEntryKind: x.optionEntryKind,
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        contractCount: x.contractCount,
      };
    }),
    courseFeeDiscountJudgeFlag: courseServiceDiscountInfo.courseTypeSetting,
    individualCourseSetting: {
      basicDiscountPrice: individualCourseSettingBasicDiscountPriceRow.map(
        (x) => {
          return {
            feeKind: x.feeKind,
            discountPriceKind: x.discountPriceKind,
            discountPrice: x.discountPrice,
            courseId: x.courseId,
            courseName: x.courseName,
            oneCountExclusionFlag:
              x.oneCountExclusionFlag === undefined
                ? false
                : x.oneCountExclusionFlag,
            contractCountMin: x.contractCountMin,
            contractCountMax: x.contractCountMax,
            periodStartDate: new Date(x.periodStartDate),
            periodEndDate: new Date(x.periodEndDate),
            contractMonths: Number(x.contractMonths),
            enableFlag: x.enableFlag === '●' ? true : false,
          };
        }
      ),
      optionDiscountPrice: individualCourseSettingOptionDiscountPriceRow.map(
        (x) => {
          return {
            feeKind: x.feeKind,
            discountPriceKind: x.discountPriceKind,
            discountPrice: x.discountPrice,
            serviceId: x.serviceId,
            serviceName: x.serviceName,
            oneCountExclusionFlag:
              x.oneCountExclusionFlag === undefined
                ? false
                : x.oneCountExclusionFlag,
            contractCountMin: x.contractCountMin,
            contractCountMax: x.contractCountMax,
            periodStartDate: new Date(x.periodStartDate),
            periodEndDate: new Date(x.periodEndDate),
            contractMonths: Number(x.contractMonths),
            enableFlag: x.enableFlag === '●' ? true : false,
          };
        }
      ),
    },
    individualContractSetting: {
      basicDiscountPrice: individualContractSettingBasicDiscountPriceRow.map(
        (x) => {
          return {
            campaignCode: x.campaignCode,
            campaignName: x.campaignName,
            feeKind: x.feeKind,
            discountPriceKind: x.discountPriceKind,
            discountPrice: x.discountPrice,
            courseId: x.courseId,
            courseName: x.courseName,
            oneCountExclusionFlag:
              x.oneCountExclusionFlag === undefined
                ? false
                : x.oneCountExclusionFlag,
            contractCountMin: x.contractCountMin,
            contractCountMax: x.contractCountMax,
            periodStartDate: new Date(x.periodStartDate),
            periodEndDate: new Date(x.periodEndDate),
            contractMonths: Number(x.contractMonths),
            enableFlag: x.enableFlag === '●' ? true : false,
          };
        }
      ),
      // オプション値引値増
      optionDiscountPrice: individualContractSettingOptionDiscountPriceRow.map(
        (x) => {
          return {
            campaignCode: x.campaignCode,
            campaignName: x.campaignName,
            feeKind: x.feeKind,
            discountPriceKind: x.discountPriceKind,
            discountPrice: x.discountPrice,
            serviceId: x.serviceId,
            serviceName: x.serviceName,
            oneCountExclusionFlag:
              x.oneCountExclusionFlag === undefined
                ? false
                : x.oneCountExclusionFlag,
            contractCountMin: x.contractCountMin,
            contractCountMax: x.contractCountMax,
            periodStartDate: new Date(x.periodStartDate),
            periodEndDate: new Date(x.periodEndDate),
            contractMonths: Number(x.contractMonths),
            enableFlag: x.enableFlag === '●' ? true : false,
          };
        }
      ),
    },
  };
};

/**
 * コース情報行への変換
 */
const convertToCourseInfomationRow = (
  getCourseServiceDiscountInfoResponse: ScrMem0014GetCourseServiceDiscountInfoResponse,
  courseInfomationRow: courseInfomationRowModel[]
): courseInfomationRowModel[] => {
  if (courseInfomationRow.length === 0) {
    return [
      {
        id: getCourseServiceDiscountInfoResponse.courseInfo.courseId,
        courseId: getCourseServiceDiscountInfoResponse.courseInfo.courseId,
        linkMemberKind:
          getCourseServiceDiscountInfoResponse.courseInfo.linkMemberKind,
        courseEntryKind:
          getCourseServiceDiscountInfoResponse.courseInfo.courseEntryKind,
        useStartDate:
          getCourseServiceDiscountInfoResponse.courseInfo.useStartDate,
        contractPeriodStartDate: new Date(
          getCourseServiceDiscountInfoResponse.courseInfo.contractPeriodStartDate
        ).toLocaleDateString(),
        contractPeriodEndDate: new Date(
          getCourseServiceDiscountInfoResponse.courseInfo.contractPeriodEndDate
        ).toLocaleDateString(),
        contractPeriodDate:
          new Date(
            getCourseServiceDiscountInfoResponse.courseInfo.contractPeriodStartDate
          ).toLocaleDateString() +
          '　~　' +
          new Date(
            getCourseServiceDiscountInfoResponse.courseInfo.contractPeriodEndDate
          ).toLocaleDateString(),
        recessPeriodDate: [
          new Date(
            getCourseServiceDiscountInfoResponse.courseInfo.recessPeriodStartDate
          ).toLocaleDateString(),
          new Date(
            getCourseServiceDiscountInfoResponse.courseInfo.recessPeriodEndDate
          ).toLocaleDateString(),
        ],
        leavingDate: new Date(
          getCourseServiceDiscountInfoResponse.courseInfo.leavingDate
        ).toLocaleDateString(),
        targetedServiceKind:
          getCourseServiceDiscountInfoResponse.courseInfo.targetedServiceKind,
        recessLeavingReasonKind:
          getCourseServiceDiscountInfoResponse.courseInfo
            .recessLeavingReasonKind,
      },
    ];
  } else {
    return [
      {
        id: getCourseServiceDiscountInfoResponse.courseInfo.courseId,
        courseId: getCourseServiceDiscountInfoResponse.courseInfo.courseId,
        linkMemberKind:
          getCourseServiceDiscountInfoResponse.courseInfo.linkMemberKind,
        courseEntryKind: courseInfomationRow[0].courseEntryKind,
        useStartDate: courseInfomationRow[0].useStartDate,
        contractPeriodStartDate: courseInfomationRow[0].contractPeriodStartDate,
        contractPeriodEndDate: courseInfomationRow[0].contractPeriodEndDate,
        contractPeriodDate: courseInfomationRow[0].contractPeriodDate,
        recessPeriodDate: courseInfomationRow[0].recessPeriodDate,
        leavingDate: courseInfomationRow[0].leavingDate,
        targetedServiceKind:
          getCourseServiceDiscountInfoResponse.courseInfo.targetedServiceKind,
        recessLeavingReasonKind: courseInfomationRow[0].recessLeavingReasonKind,
      },
    ];
  }
};

/**
 * 基本サービス行への変換
 */
const convertToBaseServiceInfomationRow = (
  getCourseServiceDiscountInfoResponse: ScrMem0014GetCourseServiceDiscountInfoResponse,
  baseServiceInfomationRow: baseServiceInfomationRowModel[]
): baseServiceInfomationRowModel[] => {
  if (baseServiceInfomationRow.length === 0) {
    return getCourseServiceDiscountInfoResponse.baseServiceInfomation.map(
      (x) => {
        return {
          id: x.serviceId,
          service: x.serviceId + '　' + x.serviceName,
          serviceId: x.serviceId,
          serviceName: x.serviceName,
          contractCount: x.contractCount,
          targetedServiceKind: x.targetedServiceKind,
        };
      }
    );
  } else {
    const newBaseServiceInfomationRow: baseServiceInfomationRowModel[] = [];
    getCourseServiceDiscountInfoResponse.baseServiceInfomation.map((x) => {
      const baseServiceInfomationRowFilter = baseServiceInfomationRow.filter(
        (f) => f.serviceId === x.serviceId
      );
      if (baseServiceInfomationRowFilter.length === 0) {
        newBaseServiceInfomationRow.push({
          id: x.serviceId,
          service: x.serviceId + '　' + x.serviceName,
          serviceId: x.serviceId,
          serviceName: x.serviceName,
          contractCount: 0,
          targetedServiceKind: x.targetedServiceKind,
        });
      } else {
        newBaseServiceInfomationRow.push({
          id: x.serviceId,
          service: x.serviceId + '　' + x.serviceName,
          serviceId: x.serviceId,
          serviceName: x.serviceName,
          contractCount: baseServiceInfomationRowFilter[0].contractCount,
          targetedServiceKind: x.targetedServiceKind,
        });
      }
    });
    return newBaseServiceInfomationRow;
  }
};

/**
 * オプション情報行への変換
 */
const convertToOptionInfomationRow = (
  getCourseServiceDiscountInfoResponse: ScrMem0014GetCourseServiceDiscountInfoResponse,
  optionInfomationRow: optionInfomationRowModel[]
): optionInfomationRowModel[] => {
  if (optionInfomationRow.length === 0) {
    return getCourseServiceDiscountInfoResponse.optionInfomation.map(
      (val, idx) => {
        return {
          id: idx.toString(),
          optionEntryKind: val.optionEntryKind,
          serviceId: val.serviceId,
          serviceName: val.serviceName,
          contractOptionNumber: val.contractOptionNumber,
          contractCount: val.contractCount,
          useStartDate: val.useStartDate,
          contractPeriodDate:
            new Date(val.contractPeriodStartDate).toLocaleDateString() +
            '　~　' +
            new Date(val.contractPeriodEndDate).toLocaleDateString(),
          contractPeriodStartDate: new Date(
            val.contractPeriodStartDate
          ).toLocaleDateString(),
          contractPeriodEndDate: new Date(
            val.contractPeriodEndDate
          ).toLocaleDateString(),
          recessPeriodDate: [
            new Date(val.recessPeriodStartDate).toLocaleDateString(),
            new Date(val.recessPeriodEndDate).toLocaleDateString(),
          ],
          leavingDate: val.leavingDate,
          useOptionServiceId: val.useOptionServiceId,
          useOptionService: val.useOptionServiceName,
          targetedServiceKind: val.targetedServiceKind,
          recessLeavingReasonKind: val.recessLeavingReasonKind,
        };
      }
    );
  } else {
    const newOptionInfomationRow: optionInfomationRowModel[] = [];
    let idx = 0;
    getCourseServiceDiscountInfoResponse.optionInfomation.map((x) => {
      const optionInfomationRowFilter = optionInfomationRow.filter(
        (f) => f.serviceId === x.serviceId
      );
      if (optionInfomationRowFilter.length === 0) {
        newOptionInfomationRow.push({
          id: idx.toString(),
          optionEntryKind: x.optionEntryKind,
          serviceId: x.serviceId,
          serviceName: x.serviceName,
          contractOptionNumber: x.contractOptionNumber,
          contractCount: x.contractCount,
          useStartDate: x.useStartDate,
          contractPeriodDate:
            new Date(x.contractPeriodStartDate).toLocaleDateString() +
            '　~　' +
            new Date(x.contractPeriodEndDate).toLocaleDateString(),
          contractPeriodStartDate: new Date(
            x.contractPeriodStartDate
          ).toLocaleDateString(),
          contractPeriodEndDate: new Date(
            x.contractPeriodEndDate
          ).toLocaleDateString(),
          recessPeriodDate: [
            new Date(x.recessPeriodStartDate).toLocaleDateString(),
            new Date(x.recessPeriodEndDate).toLocaleDateString(),
          ],
          leavingDate: x.leavingDate,
          useOptionServiceId: x.useOptionServiceId,
          useOptionService: x.useOptionServiceName,
          targetedServiceKind: x.targetedServiceKind,
          recessLeavingReasonKind: x.recessLeavingReasonKind,
        });
        idx++;
      } else {
        optionInfomationRowFilter.map((f) => {
          newOptionInfomationRow.push({
            id: idx.toString(),
            optionEntryKind: f.optionEntryKind,
            serviceId: f.serviceId,
            serviceName: f.serviceName,
            contractOptionNumber: f.contractOptionNumber,
            contractCount: f.contractCount,
            useStartDate: f.useStartDate,
            contractPeriodDate: f.contractPeriodDate,
            contractPeriodStartDate: f.contractPeriodStartDate,
            contractPeriodEndDate: f.contractPeriodEndDate,
            recessPeriodDate: f.recessPeriodDate,
            leavingDate: f.leavingDate,
            useOptionServiceId: f.useOptionServiceId,
            useOptionService: f.useOptionService,
            targetedServiceKind: f.targetedServiceKind,
            recessLeavingReasonKind: f.recessLeavingReasonKind,
          });
          idx++;
        });
      }
    });
    return newOptionInfomationRow;
  }
};

/**
 * コース個別設定・基本値引値増行への変換
 */
const convertToIndividualCourseSettingBasicDiscountPriceRow = (
  membershipfeediscountincreaseInfo: ScrCom9999GetMembershipfeediscountincreaseInfoResponse
): individualCourseSettingBasicDiscountPriceRowModel[] => {
  const newIndividualCourseSettingBasicDiscountPriceRow: individualCourseSettingBasicDiscountPriceRowModel[] =
    [];
  membershipfeediscountincreaseInfo.courseBasseicDiscountPrice.map(
    (val, idx) => {
      const periodStartDate = new Date(
        val.periodStartDate
      ).toLocaleDateString();
      const periodEndDate = new Date(val.periodEndDate).toLocaleDateString();
      const periodDate =
        val.periodStartDate !== ''
          ? periodStartDate + '　~　' + periodEndDate
          : val.contractMonths !== null
          ? '契約から' + val.contractMonths + 'ヶ月'
          : '';
      newIndividualCourseSettingBasicDiscountPriceRow.push({
        id: idx.toString(),
        enableFlag: val.enableFlag ? '●' : '',
        feeKind: val.feeKind,
        Price: val.discountPriceKind + '　' + val.discountPrice,
        discountPriceKind: val.discountPriceKind,
        discountPrice: val.discountPrice,
        courseId: val.courseId,
        courseName: val.courseName,
        oneCountExclusionFlag: val.oneCountExclusionFlag ? true : undefined,
        contractCount:
          val.contractCountMin + '以上　' + val.contractCountMax + '未満',
        contractCountMin: val.contractCountMin,
        contractCountMax: val.contractCountMax,
        periodDate: periodDate,
        periodStartDate: periodStartDate,
        periodEndDate: periodEndDate,
        contractMonths: Number(val.contractMonths),
      });
    }
  );
  return newIndividualCourseSettingBasicDiscountPriceRow;
};

/**
 * 会費値引値増有効チェックAPIからコース個別設定・基本値引値増行への変換
 */
const convertToInputCheckBillingInfoIndividualCourseSettingBasicDiscountPriceRow =
  (
    inputCheckBillingInfoResponse: ScrMem0014InputCheckBillingInfoResponse
  ): individualCourseSettingBasicDiscountPriceRowModel[] => {
    const newIndividualCourseSettingBasicDiscountPriceRow: individualCourseSettingBasicDiscountPriceRowModel[] =
      [];
    inputCheckBillingInfoResponse.individualCourseSetting.basicDiscountPrice.map(
      (val, idx) => {
        const periodStartDate = new Date(
          val.periodStartDate
        ).toLocaleDateString();
        const periodEndDate = new Date(val.periodEndDate).toLocaleDateString();
        const periodDate =
          val.periodStartDate !== ''
            ? periodStartDate + '　~　' + periodEndDate
            : val.contractMonths !== null
            ? '契約から' + val.contractMonths + 'ヶ月'
            : '';
        newIndividualCourseSettingBasicDiscountPriceRow.push({
          id: idx.toString(),
          enableFlag: val.enableFlag ? '●' : '',
          feeKind: val.feeKind,
          Price: val.discountPriceKind + '　' + val.discountPrice,
          discountPriceKind: val.discountPriceKind,
          discountPrice: val.discountPrice,
          courseId: val.courseId,
          courseName: val.courseName,
          oneCountExclusionFlag: val.oneCountExclusionFlag ? true : undefined,
          contractCount:
            val.contractCountMin + '以上　' + val.contractCountMax + '未満',
          contractCountMin: val.contractCountMin,
          contractCountMax: val.contractCountMax,
          periodDate: periodDate,
          periodStartDate: periodStartDate,
          periodEndDate: periodEndDate,
          contractMonths: Number(val.contractMonths),
        });
      }
    );
    return newIndividualCourseSettingBasicDiscountPriceRow;
  };

/**
 * コース個別設定・オプション値引値増行への変換
 */
const convertToIndividualCourseSettingOptionDiscountPriceRow = (
  membershipfeediscountincreaseInfo: ScrCom9999GetMembershipfeediscountincreaseInfoResponse
): individualCourseSettingOptionDiscountPriceRowModel[] => {
  const newIndividualCourseSettingOptionDiscountPriceRow: individualCourseSettingOptionDiscountPriceRowModel[] =
    [];
  membershipfeediscountincreaseInfo.courseOptionDiscountPrice.map(
    (val, idx) => {
      const periodStartDate = new Date(
        val.periodStartDate
      ).toLocaleDateString();
      const periodEndDate = new Date(val.periodEndDate).toLocaleDateString();
      const periodDate =
        val.periodStartDate !== ''
          ? periodStartDate + '　~　' + periodEndDate
          : val.contractMonths !== null
          ? '契約から' + val.contractMonths + 'ヶ月'
          : '';
      newIndividualCourseSettingOptionDiscountPriceRow.push({
        id: idx.toString(),
        enableFlag: val.enableFlag ? '●' : '',
        feeKind: val.feeKind,
        Price: val.discountPriceKind + '　' + val.discountPrice,
        discountPriceKind: val.discountPriceKind,
        discountPrice: val.discountPrice,
        serviceId: val.serviceID,
        serviceName: val.serviceName,
        oneCountExclusionFlag: val.oneCountExclusionFlag ? true : undefined,
        contractCount:
          val.contractCountMin + '以上　' + val.contractCountMax + '未満',
        contractCountMin: val.contractCountMin,
        contractCountMax: val.contractCountMax,
        periodDate: periodDate,
        periodStartDate: periodStartDate,
        periodEndDate: periodEndDate,
        contractMonths: Number(val.contractMonths),
      });
    }
  );
  return newIndividualCourseSettingOptionDiscountPriceRow;
};

/**
 * 会費値引値増有効チェックAPIからコース個別設定・オプション値引値増行への変換
 */
const convertToInputCheckBillingInfoIndividualCourseSettingOptionDiscountPriceRow =
  (
    inputCheckBillingInfoResponse: ScrMem0014InputCheckBillingInfoResponse
  ): individualCourseSettingOptionDiscountPriceRowModel[] => {
    const newIndividualCourseSettingOptionDiscountPriceRow: individualCourseSettingOptionDiscountPriceRowModel[] =
      [];
    inputCheckBillingInfoResponse.individualCourseSetting.optionDiscountPrice.map(
      (val, idx) => {
        const periodStartDate = new Date(
          val.periodStartDate
        ).toLocaleDateString();
        const periodEndDate = new Date(val.periodEndDate).toLocaleDateString();
        const periodDate =
          val.periodStartDate !== ''
            ? periodStartDate + '　~　' + periodEndDate
            : val.contractMonths !== null
            ? '契約から' + val.contractMonths + 'ヶ月'
            : '';
        newIndividualCourseSettingOptionDiscountPriceRow.push({
          id: idx.toString(),
          enableFlag: val.enableFlag ? '●' : '',
          feeKind: val.feeKind,
          Price: val.discountPriceKind + '　' + val.discountPrice,
          discountPriceKind: val.discountPriceKind,
          discountPrice: val.discountPrice,
          serviceId: val.serviceId,
          serviceName: val.serviceName,
          oneCountExclusionFlag: val.oneCountExclusionFlag ? true : undefined,
          contractCount:
            val.contractCountMin + '以上　' + val.contractCountMax + '未満',
          contractCountMin: val.contractCountMin,
          contractCountMax: val.contractCountMax,
          periodDate: periodDate,
          periodStartDate: periodStartDate,
          periodEndDate: periodEndDate,
          contractMonths: Number(val.contractMonths),
        });
      }
    );
    return newIndividualCourseSettingOptionDiscountPriceRow;
  };

/**
 * 契約個別設定・基本値引値増値増行への変換
 */
const convertToIndividualContractSettingBasicDiscountPriceRow = (
  membershipfeediscountincreaseInfo: ScrCom9999GetMembershipfeediscountincreaseInfoResponse
): individualContractSettingBasicDiscountPriceRowModel[] => {
  const newIndividualContractSettingBasicDiscountPriceRow: individualContractSettingBasicDiscountPriceRowModel[] =
    [];
  membershipfeediscountincreaseInfo.contractBasicDiscountPrice.map(
    (val, idx) => {
      const periodStartDate = new Date(
        val.periodStartDate
      ).toLocaleDateString();
      const periodEndDate = new Date(val.periodEndDate).toLocaleDateString();
      const periodDate =
        val.periodStartDate !== ''
          ? periodStartDate + '　~　' + periodEndDate
          : val.contractMonths !== null
          ? '契約から' + val.contractMonths + 'ヶ月'
          : '';
      newIndividualContractSettingBasicDiscountPriceRow.push({
        id: idx.toString(),
        enableFlag: val.enableFlag ? '●' : '',
        campaignCode: val.campaignCode,
        campaignName: val.campaignName,
        feeKind: val.feeKind,
        Price: val.discountPriceKind + '　' + val.discountPrice,
        discountPriceKind: val.discountPriceKind,
        discountPrice: val.discountPrice,
        courseId: val.courseId,
        courseName: val.courseName,
        oneCountExclusionFlag: val.oneCountExclusionFlag ? true : undefined,
        contractCount:
          val.contractCountMin + '以上　' + val.contractCountMax + '未満',
        contractCountMin: val.contractCountMin,
        contractCountMax: val.contractCountMax,
        periodDate: periodDate,
        periodStartDate: periodStartDate,
        periodEndDate: periodEndDate,
        contractMonths: Number(val.contractMonths),
      });
    }
  );
  return newIndividualContractSettingBasicDiscountPriceRow;
};

/**
 * 会費値引値増有効チェックAPIから契約個別設定・基本値引値増値増行への変換
 */
const convertToInputCheckBillingInfoIndividualContractSettingBasicDiscountPriceRow =
  (
    inputCheckBillingInfoResponse: ScrMem0014InputCheckBillingInfoResponse
  ): individualContractSettingBasicDiscountPriceRowModel[] => {
    const newIndividualContractSettingBasicDiscountPriceRow: individualContractSettingBasicDiscountPriceRowModel[] =
      [];
    inputCheckBillingInfoResponse.individualContractSetting.basicDiscountPrice.map(
      (val, idx) => {
        const periodStartDate = new Date(
          val.periodStartDate
        ).toLocaleDateString();
        const periodEndDate = new Date(val.periodEndDate).toLocaleDateString();
        const periodDate =
          val.periodStartDate !== ''
            ? periodStartDate + '　~　' + periodEndDate
            : val.contractMonths !== null
            ? '契約から' + val.contractMonths + 'ヶ月'
            : '';
        newIndividualContractSettingBasicDiscountPriceRow.push({
          id: idx.toString(),
          enableFlag: val.enableFlag ? '●' : '',
          campaignCode: val.campaignCode,
          campaignName: val.campaignName,
          feeKind: val.feeKind,
          Price: val.discountPriceKind + '　' + val.discountPrice,
          discountPriceKind: val.discountPriceKind,
          discountPrice: val.discountPrice,
          courseId: val.courseId,
          courseName: val.courseName,
          oneCountExclusionFlag: val.oneCountExclusionFlag ? true : undefined,
          contractCount:
            val.contractCountMin + '以上　' + val.contractCountMax + '未満',
          contractCountMin: val.contractCountMin,
          contractCountMax: val.contractCountMax,
          periodDate: periodDate,
          periodStartDate: periodStartDate,
          periodEndDate: periodEndDate,
          contractMonths: Number(val.contractMonths),
        });
      }
    );
    return newIndividualContractSettingBasicDiscountPriceRow;
  };

/**
 * 契約個別設定・オプション値引値増行への変換
 */
const convertToIndividualContractSettingOptionDiscountPriceRow = (
  membershipfeediscountincreaseInfo: ScrCom9999GetMembershipfeediscountincreaseInfoResponse
): individualContractSettingOptionDiscountPriceRowModel[] => {
  const newIndividualContractSettingOptionDiscountPriceRow: individualContractSettingOptionDiscountPriceRowModel[] =
    [];
  membershipfeediscountincreaseInfo.contractOptionDiscountPrice.map(
    (val, idx) => {
      const periodStartDate = new Date(
        val.periodStartDate
      ).toLocaleDateString();
      const periodEndDate = new Date(val.periodEndDate).toLocaleDateString();
      const periodDate =
        val.periodStartDate !== ''
          ? periodStartDate + '　~　' + periodEndDate
          : val.contractMonths !== null
          ? '契約から' + val.contractMonths + 'ヶ月'
          : '';
      newIndividualContractSettingOptionDiscountPriceRow.push({
        id: idx.toString(),
        enableFlag: val.enableFlag ? '●' : '',
        campaignCode: val.campaignCode,
        campaignName: val.campaignName,
        feeKind: val.feeKind,
        Price: val.discountPriceKind + '　' + val.discountPrice,
        discountPriceKind: val.discountPriceKind,
        discountPrice: val.discountPrice,
        serviceId: val.serviceID,
        serviceName: val.serviceName,
        oneCountExclusionFlag: val.oneCountExclusionFlag ? true : undefined,
        contractCount:
          val.contractCountMin + '以上　' + val.contractCountMax + '未満',
        contractCountMin: val.contractCountMin,
        contractCountMax: val.contractCountMax,
        periodDate: periodDate,
        periodStartDate: periodStartDate,
        periodEndDate: periodEndDate,
        contractMonths: Number(val.contractMonths),
      });
    }
  );
  return newIndividualContractSettingOptionDiscountPriceRow;
};

/**
 * 会費値引値増有効チェックAPIから契約個別設定・オプション値引値増行への変換
 */
const convertToInputCheckBillingInfoIndividualContractSettingOptionDiscountPriceRow =
  (
    inputCheckBillingInfoResponse: ScrMem0014InputCheckBillingInfoResponse
  ): individualContractSettingOptionDiscountPriceRowModel[] => {
    const newIndividualContractSettingOptionDiscountPriceRow: individualContractSettingOptionDiscountPriceRowModel[] =
      [];
    inputCheckBillingInfoResponse.individualContractSetting.optionDiscountPrice.map(
      (val, idx) => {
        const periodStartDate = new Date(
          val.periodStartDate
        ).toLocaleDateString();
        const periodEndDate = new Date(val.periodEndDate).toLocaleDateString();
        const periodDate =
          val.periodStartDate !== ''
            ? periodStartDate + '　~　' + periodEndDate
            : val.contractMonths !== null
            ? '契約から' + val.contractMonths + 'ヶ月'
            : '';
        newIndividualContractSettingOptionDiscountPriceRow.push({
          id: idx.toString(),
          enableFlag: val.enableFlag ? '●' : '',
          campaignCode: val.campaignCode,
          campaignName: val.campaignName,
          feeKind: val.feeKind,
          Price: val.discountPriceKind + '　' + val.discountPrice,
          discountPriceKind: val.discountPriceKind,
          discountPrice: val.discountPrice,
          serviceId: val.serviceId,
          serviceName: val.serviceName,
          oneCountExclusionFlag: val.oneCountExclusionFlag ? true : undefined,
          contractCount:
            val.contractCountMin + '以上　' + val.contractCountMax + '未満',
          contractCountMin: val.contractCountMin,
          contractCountMax: val.contractCountMax,
          periodDate: periodDate,
          periodStartDate: periodStartDate,
          periodEndDate: periodEndDate,
          contractMonths: Number(val.contractMonths),
        });
      }
    );
    return newIndividualContractSettingOptionDiscountPriceRow;
  };

/**
 * 最終値引値増金額行への変換
 */
const convertToFinalFeeDiscountRow = (
  calculateAmountMembershipfeediscountincreaseResponse: ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse
): finalFeeDiscountRowModel[] => {
  const newFinalFeeDiscountRow: finalFeeDiscountRowModel[] = [];
  calculateAmountMembershipfeediscountincreaseResponse.finalFeeDiscount.map(
    (val, idx) => {
      newFinalFeeDiscountRow.push({
        id: idx.toString(),
        useOptionServiceId: val.useOptionServiceId,
        feeKind: val.feeKind,
        courseContractId: val.courseContractId,
        serviceId: val.serviceId,
        serviceName: val.serviceName,
        contractCount: val.contractCount,
        discountPrice: val.discountPrice,
        discountTotalPrice: val.discountTotalPrice,
      });
    }
  );
  return newFinalFeeDiscountRow;
};

/**
 * 値引値増適用前 料金表コース行への変換
 */
const convertToBeforeFeeDiscountRow = (
  calculateAmountMembershipfeediscountincreaseResponse: ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse
): feeDiscountRowModel[] => {
  return [
    {
      id: '1',
      courseId:
        calculateAmountMembershipfeediscountincreaseResponse.beforeFeeDiscount
          .courseInfo.courseId,
      courseName:
        calculateAmountMembershipfeediscountincreaseResponse.beforeFeeDiscount
          .courseInfo.courseName,
      courseMembership:
        calculateAmountMembershipfeediscountincreaseResponse.beforeFeeDiscount
          .courseInfo.courseMembership,
      courseFee:
        calculateAmountMembershipfeediscountincreaseResponse.beforeFeeDiscount
          .courseInfo.courseFee,
    },
  ];
};

/**
 * 値引値増適用前 料金表オプション行への変換
 */
const convertToBeforeOptionInfoRow = (
  calculateAmountMembershipfeediscountincreaseResponse: ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse
): optionInfoRowModel[] => {
  const newBeforeOptionInfoRow: optionInfoRowModel[] = [];
  calculateAmountMembershipfeediscountincreaseResponse.beforeFeeDiscount.optionInfo.map(
    (val, idx) => {
      newBeforeOptionInfoRow.push({
        id: idx.toString(),
        serviceId: val.optionServiceId,
        serviceName: val.optionServiceName,
        optionServiceMembership: val.optionServiceMembership,
        optionServiceFee: val.optionServiceFee,
      });
    }
  );
  return newBeforeOptionInfoRow;
};

/**
 * 値引値増適用後 料金表コース行への変換
 */
const convertToAfterFeeDiscountRow = (
  calculateAmountMembershipfeediscountincreaseResponse: ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse
): feeDiscountRowModel[] => {
  return [
    {
      id: '1',
      courseId:
        calculateAmountMembershipfeediscountincreaseResponse.afterFeeDiscount
          .courseInfo.courseId,
      courseName:
        calculateAmountMembershipfeediscountincreaseResponse.afterFeeDiscount
          .courseInfo.courseName,
      courseMembership:
        calculateAmountMembershipfeediscountincreaseResponse.afterFeeDiscount
          .courseInfo.courseMembership,
      courseFee:
        calculateAmountMembershipfeediscountincreaseResponse.afterFeeDiscount
          .courseInfo.courseFee,
    },
  ];
};

/**
 * 値引値増適用後 料金表オプション行への変換
 */
const convertToAfterOptionInfoRow = (
  calculateAmountMembershipfeediscountincreaseResponse: ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse
): optionInfoRowModel[] => {
  const newAfterOptionInfoRow: optionInfoRowModel[] = [];
  calculateAmountMembershipfeediscountincreaseResponse.afterFeeDiscount.optionInfo.map(
    (val, idx) => {
      newAfterOptionInfoRow.push({
        id: idx.toString(),
        serviceId: val.optionServiceId,
        serviceName: val.optionServiceName,
        optionServiceMembership: val.optionServiceMembership,
        optionServiceFee: val.optionServiceFee,
      });
    }
  );
  return newAfterOptionInfoRow;
};

/**
 * 会員個別設定・四輪行への変換
 */
const convertToMemberTypeSettingTvaaRow = (
  response: ScrMem0014GetCourseServiceDiscountInfoResponse
): typeSettingRowModel[] => {
  return [
    {
      id: '1',
      commissionDiscountPackId:
        response.memberTypeSettingTvaa.commissionDiscountPackId,
      packName: response.memberTypeSettingTvaa.packName,
      validityPeriodDate:
        response.memberTypeSettingTvaa.validityPeriodStartDate +
        '　~　' +
        response.memberTypeSettingTvaa.validityPeriodEndDate,
      validityPeriodStartDate:
        response.memberTypeSettingTvaa.validityPeriodStartDate,
      validityPeriodEndDate:
        response.memberTypeSettingTvaa.validityPeriodEndDate,
    },
  ];
};

/**
 * 会員個別設定・二輪行への変換
 */
const convertToMemberTypeSettingBikeRow = (
  response: ScrMem0014GetCourseServiceDiscountInfoResponse
): typeSettingRowModel[] => {
  return [
    {
      id: '1',
      commissionDiscountPackId:
        response.memberTypeSettingBike.commissionDiscountPackId,
      packName: response.memberTypeSettingBike.packName,
      validityPeriodDate:
        response.memberTypeSettingBike.validityPeriodStartDate +
        '　~　' +
        response.memberTypeSettingBike.validityPeriodEndDate,
      validityPeriodStartDate:
        response.memberTypeSettingBike.validityPeriodStartDate,
      validityPeriodEndDate:
        response.memberTypeSettingBike.validityPeriodEndDate,
    },
  ];
};

/**
 * 会員個別設定・おまとめ行への変換
 */
const convertToMemberTypeSettingOmatomeRow = (
  response: ScrMem0014GetCourseServiceDiscountInfoResponse
): typeSettingRowModel[] => {
  return [
    {
      id: '1',
      commissionDiscountPackId:
        response.memberTypeSettingOmatome.commissionDiscountPackId,
      packName: response.memberTypeSettingOmatome.packName,
      validityPeriodDate:
        response.memberTypeSettingOmatome.validityPeriodStartDate +
        '　~　' +
        response.memberTypeSettingOmatome.validityPeriodEndDate,
      validityPeriodStartDate:
        response.memberTypeSettingOmatome.validityPeriodStartDate,
      validityPeriodEndDate:
        response.memberTypeSettingOmatome.validityPeriodEndDate,
    },
  ];
};

/**
 * 会員個別設定・おまとめ行への変換
 */
const convertFromInputCheckBillingInfoRequest = (
  courseServiceDiscountInfo: CourseServiceDiscountInfoModel,
  contractId: string,
  corporationId: string,
  businessDate: string,
  courseInfomationRow: courseInfomationRowModel[],
  optionInfomationRow: optionInfomationRowModel[],
  individualCourseSettingBasicDiscountPriceRow: individualCourseSettingBasicDiscountPriceRowModel[],
  individualCourseSettingOptionDiscountPriceRow: individualCourseSettingOptionDiscountPriceRowModel[],
  individualContractSettingBasicDiscountPriceRow: individualContractSettingBasicDiscountPriceRowModel[],
  individualContractSettingOptionDiscountPriceRow: individualContractSettingOptionDiscountPriceRowModel[]
): ScrMem0014InputCheckBillingInfoRequest => {
  // コース名取得
  const courseSelectValue = courseInfomationColumns[0].selectValues?.find(
    (x) => x.value === courseInfomationRow[0].courseId
  );
  const courseName =
    courseSelectValue === undefined ? '' : courseSelectValue.displayValue;

  return {
    contractId: contractId,
    corporationId: corporationId,
    businessDate: new Date(businessDate),
    courseFeeDiscountJudgeFlag: courseServiceDiscountInfo.courseTypeSetting,
    courseInfo: {
      courseId: courseInfomationRow[0].courseId,
      courseName: courseName,
      courseEntryKind: courseInfomationRow[0].courseEntryKind,
      useStartDate: new Date(courseInfomationRow[0].useStartDate),
      contractPeriodStartDate: new Date(
        courseInfomationRow[0].contractPeriodStartDate
      ),
      contractPeriodEndDate: new Date(
        courseInfomationRow[0].contractPeriodEndDate
      ),
    },
    optionInfo: optionInfomationRow.map((x) => {
      return {
        optionEntryKind: x.optionEntryKind,
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        contractCount: x.contractCount,
        useStartDate: new Date(x.useStartDate),
        contractPeriodStartDate: new Date(x.contractPeriodStartDate),
        contractPeriodEndDate: new Date(x.contractPeriodEndDate),
      };
    }),
    individualCourseSetting: {
      basicDiscountPrice: individualCourseSettingBasicDiscountPriceRow.map(
        (x) => {
          return {
            feeKind: x.feeKind,
            discountPriceKind: x.discountPriceKind,
            discountPrice: x.discountPrice,
            courseId: x.courseId,
            courseName: x.courseName,
            oneCountExclusionFlag:
              x.oneCountExclusionFlag === undefined
                ? false
                : x.oneCountExclusionFlag,
            contractCountMin: x.contractCountMin,
            contractCountMax: x.contractCountMax,
            periodStartDate: new Date(x.periodStartDate),
            periodEndDate: new Date(x.periodEndDate),
            contractMonths: x.contractMonths,
          };
        }
      ),
      optionDiscountPrice: individualCourseSettingOptionDiscountPriceRow.map(
        (x) => {
          return {
            feeKind: x.feeKind,
            discountPriceKind: x.discountPriceKind,
            discountPrice: x.discountPrice,
            serviceId: x.serviceId,
            serviceName: x.serviceName,
            oneCountExclusionFlag:
              x.oneCountExclusionFlag === undefined
                ? false
                : x.oneCountExclusionFlag,
            contractCountMin: x.contractCountMin,
            contractCountMax: x.contractCountMax,
            periodStartDate: new Date(x.periodStartDate),
            periodEndDate: new Date(x.periodEndDate),
            contractMonths: x.contractMonths,
          };
        }
      ),
    },
    individualContractSetting: {
      basicDiscountPrice: individualContractSettingBasicDiscountPriceRow.map(
        (x) => {
          return {
            campaignCode: x.campaignCode,
            campaignName: x.campaignName,
            feeKind: x.feeKind,
            discountPriceKind: x.discountPriceKind,
            discountPrice: x.discountPrice,
            courseId: x.courseId,
            courseName: x.courseName,
            oneCountExclusionFlag:
              x.oneCountExclusionFlag === undefined
                ? false
                : x.oneCountExclusionFlag,
            contractCountMin: x.contractCountMin,
            contractCountMax: x.contractCountMax,
            periodStartDate: new Date(x.periodStartDate),
            periodEndDate: new Date(x.periodEndDate),
            contractMonths: x.contractMonths,
          };
        }
      ),
      optionDiscountPrice: individualContractSettingOptionDiscountPriceRow.map(
        (x) => {
          return {
            campaignCode: x.campaignCode,
            campaignName: x.campaignName,
            feeKind: x.feeKind,
            discountPriceKind: x.discountPriceKind,
            discountPrice: x.discountPrice,
            serviceId: x.serviceId,
            serviceName: x.serviceName,
            oneCountExclusionFlag:
              x.oneCountExclusionFlag === undefined
                ? false
                : x.oneCountExclusionFlag,
            contractCountMin: x.contractCountMin,
            contractCountMax: x.contractCountMax,
            periodStartDate: new Date(x.periodStartDate),
            periodEndDate: new Date(x.periodEndDate),
            contractMonths: x.contractMonths,
          };
        }
      ),
    },
  };
};

/**
 * サービス・値引値増情報情報入力チェックAPIリクエストへの変換
 */
const convertFromInputCheckServicediscountpriceincreaseInfoRequest = (
  contractId: string,
  corporationId: string,
  courseInfomationRow: courseInfomationRowModel[],
  baseServiceInfomationRow: baseServiceInfomationRowModel[],
  optionInfomationRow: optionInfomationRowModel[],
  courseServiceDiscountInfo: CourseServiceDiscountInfoModel
): ScrMem0014InputCheckServicediscountpriceincreaseInfoRequest => {
  return {
    contractId: contractId,
    corporationId: corporationId,
    courseEntryKind: courseInfomationRow[0].courseEntryKind,
    basicServiceInfo: baseServiceInfomationRow.map((x) => {
      return {
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        targetedServiceKind: x.targetedServiceKind,
      };
    }),
    optionInfo: optionInfomationRow.map((x) => {
      return {
        optionEntryKind: x.optionEntryKind,
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        useStartDate: new Date(x.useStartDate),
        targetedServiceKind: x.targetedServiceKind,
        useOptionServiceId: x.useOptionServiceId,
      };
    }),
    autobankSystemTerminalContractId:
      courseServiceDiscountInfo.autobankSystemTerminalContractId,
    supportManagementNumber: courseServiceDiscountInfo.supportManagementNumber,
  };
};

/**
 * 法人情報詳細基本情報への変換
 */
const convertFromBillingInfo = (
  courseServiceDiscountInfo: CourseServiceDiscountInfoModel,
  courseInfomationRow: courseInfomationRowModel[],
  baseServiceInfomationRow: baseServiceInfomationRowModel[],
  optionInfomationRow: optionInfomationRowModel[],
  individualCourseSettingBasicDiscountPriceRow: individualCourseSettingBasicDiscountPriceRowModel[],
  individualCourseSettingOptionDiscountPriceRow: individualCourseSettingOptionDiscountPriceRowModel[],
  individualContractSettingBasicDiscountPriceRow: individualContractSettingBasicDiscountPriceRowModel[],
  individualContractSettingOptionDiscountPriceRow: individualContractSettingOptionDiscountPriceRowModel[],
  finalFeeDiscountRow: finalFeeDiscountRowModel[],
  beforeFeeDiscountRow: feeDiscountRowModel[],
  beforeOptionInfoRow: optionInfoRowModel[],
  afterFeeDiscountRow: feeDiscountRowModel[],
  afterOptionInfoRow: optionInfoRowModel[],
  memberTypeSettingTvaaRow: typeSettingRowModel[],
  memberTypeSettingBikeRow: typeSettingRowModel[],
  memberTypeSettingOmatomeRow: typeSettingRowModel[],
  contractBase: registrationRequest
): registrationRequest => {
  const newCourseServiceDiscountInfo: registrationRequest =
    Object.assign(contractBase);
  // コース名取得
  const courseSelectValue = courseInfomationColumns[0].selectValues?.find(
    (x) => x.value === courseInfomationRow[0].courseId
  );
  const courseName =
    courseSelectValue === undefined ? '' : courseSelectValue.displayValue;

  newCourseServiceDiscountInfo.courseInfomation = {
    courseId: courseInfomationRow[0].courseId,
    courseName: courseName,
    linkMemberKind: courseInfomationRow[0].linkMemberKind,
    courseEntryKind: courseInfomationRow[0].courseEntryKind,
    useStartDate: new Date(courseInfomationRow[0].useStartDate),
    contractPeriodStartDate: new Date(
      courseInfomationRow[0].contractPeriodStartDate
    ),
    contractPeriodEndDate: new Date(
      courseInfomationRow[0].contractPeriodEndDate
    ),
    recessPeriodStartDate: new Date(courseInfomationRow[0].recessPeriodDate[0]),
    recessPeriodEndDate: new Date(courseInfomationRow[0].recessPeriodDate[1]),
    leavingDate: new Date(courseInfomationRow[0].leavingDate),
    targetedServiceKind: courseInfomationRow[0].targetedServiceKind,
    recessLeavingReasonKind: courseInfomationRow[0].recessLeavingReasonKind,
  };
  newCourseServiceDiscountInfo.baseServiceInfomation =
    baseServiceInfomationRow.map((x) => {
      return {
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        contractCount: x.contractCount,
        targetedServiceKind: x.targetedServiceKind,
      };
    });
  newCourseServiceDiscountInfo.optionInfomation = optionInfomationRow.map(
    (x) => {
      return {
        optionEntryKind: x.optionEntryKind,
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        contractOptionNumber: x.contractOptionNumber,
        contractCount: x.contractCount,
        useStartDate: new Date(x.useStartDate),
        contractPeriodStartDate: new Date(x.contractPeriodStartDate),
        contractPeriodEndDate: new Date(x.contractPeriodEndDate),
        recessPeriodStartDate: new Date(x.recessPeriodDate[0]),
        recessPeriodEndDate: new Date(x.recessPeriodDate[1]),
        leavingDate: new Date(x.leavingDate),
        useOptionServiceId: x.contractCount.toString(),
        targetedServiceKind: x.targetedServiceKind,
        recessLeavingReasonKind: x.recessLeavingReasonKind,
      };
    }
  );
  newCourseServiceDiscountInfo.autobankSystemTerminalContractId =
    courseServiceDiscountInfo.autobankSystemTerminalContractId;
  newCourseServiceDiscountInfo.autobankSystemCertificateIssuanceJpgFlag =
    courseServiceDiscountInfo.autobankSystemCertificateIssuanceJpgFlag === '1'
      ? true
      : false;
  newCourseServiceDiscountInfo.autobankSystemNaviDealKind =
    courseServiceDiscountInfo.autobankSystemNaviDealKind;
  newCourseServiceDiscountInfo.autobankSystemNaviChoiceEntryKind =
    courseServiceDiscountInfo.autobankSystemNaviChoiceEntryKind;
  newCourseServiceDiscountInfo.autobankSystemStockGroup =
    courseServiceDiscountInfo.autobankSystemStockGroup;
  newCourseServiceDiscountInfo.autobankSystemAbOfferServiceKind =
    courseServiceDiscountInfo.autobankSystemAbOfferServiceKind;
  newCourseServiceDiscountInfo.autobankSystemServiceMemo =
    courseServiceDiscountInfo.autobankSystemServiceMemo;
  newCourseServiceDiscountInfo.autobankSystemInstallationCompletionDate =
    new Date(
      courseServiceDiscountInfo.autobankSystemInstallationCompletionDate
    );
  newCourseServiceDiscountInfo.collaborationCommonKind =
    courseServiceDiscountInfo.collaborationCommonKind;
  newCourseServiceDiscountInfo.imotoaucMemberKind =
    courseServiceDiscountInfo.imotoaucMemberKind;
  newCourseServiceDiscountInfo.imotoaucEntryKind =
    courseServiceDiscountInfo.imotoaucEntryKind;
  newCourseServiceDiscountInfo.imotoaucMailSendKind =
    courseServiceDiscountInfo.imotoaucMailSendKind;
  newCourseServiceDiscountInfo.imotoaucDmSendKind =
    courseServiceDiscountInfo.imotoaucDmSendKind;
  newCourseServiceDiscountInfo.imotoaucContractCount =
    courseServiceDiscountInfo.imotoaucContractCount;
  newCourseServiceDiscountInfo.iaucManagementNumber =
    courseServiceDiscountInfo.iaucManagementNumber;
  newCourseServiceDiscountInfo.carsensorSalesKind =
    courseServiceDiscountInfo.carsensorSalesKind;
  newCourseServiceDiscountInfo.carsensorAucCsKind =
    courseServiceDiscountInfo.carsensorAucCsKind;
  newCourseServiceDiscountInfo.supportManagementNumber =
    courseServiceDiscountInfo.supportManagementNumber;
  newCourseServiceDiscountInfo.runmartDealKind =
    courseServiceDiscountInfo.runmartDealKind;
  newCourseServiceDiscountInfo.runmartShareInformation =
    courseServiceDiscountInfo.runmartShareInformation;
  newCourseServiceDiscountInfo.courseFeeDiscountJudgeFlag =
    courseServiceDiscountInfo.courseTypeSetting;

  newCourseServiceDiscountInfo.individualCourseSettingBasicDiscountPrice =
    individualCourseSettingBasicDiscountPriceRow.map((x) => {
      return {
        enableFlag: x.enableFlag === '●' ? true : false,
        feeKind: x.feeKind,
        discountPriceKind: x.discountPriceKind,
        discountPrice: x.discountPrice,
        courseId: x.courseId,
        courseName: x.courseName,
        oneCountExclusionFlag:
          x.oneCountExclusionFlag === undefined
            ? false
            : x.oneCountExclusionFlag,
        contractCountMin: x.contractCountMin,
        contractCountMax: x.contractCountMax,
        periodStartDate: new Date(x.periodStartDate),
        periodEndDate: new Date(x.periodEndDate),
        contractMonths: x.contractMonths,
      };
    });
  newCourseServiceDiscountInfo.individualCourseSettingOptionDiscountPrice =
    individualCourseSettingOptionDiscountPriceRow.map((x) => {
      return {
        enableFlag: x.enableFlag === '●' ? true : false,
        feeKind: x.feeKind,
        discountPriceKind: x.discountPriceKind,
        discountPrice: x.discountPrice,
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        oneCountExclusionFlag:
          x.oneCountExclusionFlag === undefined
            ? false
            : x.oneCountExclusionFlag,
        contractCountMin: x.contractCountMin,
        contractCountMax: x.contractCountMax,
        periodStartDate: new Date(x.periodStartDate),
        periodEndDate: new Date(x.periodEndDate),
        contractMonths: x.contractMonths,
      };
    });
  newCourseServiceDiscountInfo.individualContractSettingBasicDiscountPrice =
    individualContractSettingBasicDiscountPriceRow.map((x) => {
      return {
        enableFlag: x.enableFlag === '●' ? true : false,
        campaignCode: x.campaignCode,
        campaignName: x.campaignName,
        feeKind: x.feeKind,
        discountPriceKind: x.discountPriceKind,
        discountPrice: x.discountPrice,
        courseId: x.courseId,
        courseName: x.courseName,
        oneCountExclusionFlag:
          x.oneCountExclusionFlag === undefined
            ? false
            : x.oneCountExclusionFlag,
        contractCountMin: x.contractCountMin,
        contractCountMax: x.contractCountMax,
        periodStartDate: new Date(x.periodStartDate),
        periodEndDate: new Date(x.periodEndDate),
        contractMonths: x.contractMonths,
      };
    });
  newCourseServiceDiscountInfo.individualContractSettingOptionDiscountPrice =
    individualContractSettingOptionDiscountPriceRow.map((x) => {
      return {
        enableFlag: x.enableFlag === '●' ? true : false,
        campaignCode: x.campaignCode,
        campaignName: x.campaignName,
        feeKind: x.feeKind,
        discountPriceKind: x.discountPriceKind,
        discountPrice: x.discountPrice,
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        oneCountExclusionFlag:
          x.oneCountExclusionFlag === undefined
            ? false
            : x.oneCountExclusionFlag,
        contractCountMin: x.contractCountMin,
        contractCountMax: x.contractCountMax,
        periodStartDate: new Date(x.periodStartDate),
        periodEndDate: new Date(x.periodEndDate),
        contractMonths: x.contractMonths,
      };
    });
  newCourseServiceDiscountInfo.finalFeeDiscount = finalFeeDiscountRow.map(
    (x) => {
      return {
        useOptionServiceId: x.useOptionServiceId,
        feeKind: x.feeKind,
        courseContractId: x.courseContractId,
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        contractCount: x.contractCount,
        discountPrice: x.discountPrice,
        discountTotalPrice: x.discountTotalPrice,
      };
    }
  );
  newCourseServiceDiscountInfo.beforeFeeDiscount = {
    courseInfo: {
      courseId: beforeFeeDiscountRow[0].courseId,
      courseName: beforeFeeDiscountRow[0].courseName,
      courseMembership: beforeFeeDiscountRow[0].courseMembership,
      courseFee: beforeFeeDiscountRow[0].courseFee,
    },
    optionInfo: beforeOptionInfoRow.map((x) => {
      return {
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        optionServiceMembership: x.optionServiceMembership,
        optionServiceFee: x.optionServiceFee,
      };
    }),
  };
  newCourseServiceDiscountInfo.afterFeeDiscount = {
    courseInfo: {
      courseId: afterFeeDiscountRow[0].courseId,
      courseName: afterFeeDiscountRow[0].courseName,
      courseMembership: afterFeeDiscountRow[0].courseMembership,
      courseFee: afterFeeDiscountRow[0].courseFee,
    },
    optionInfo: afterOptionInfoRow.map((x) => {
      return {
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        optionServiceMembership: x.optionServiceMembership,
        optionServiceFee: x.optionServiceFee,
      };
    }),
  };
  newCourseServiceDiscountInfo.courseTypeSetting = {
    commissionDiscountPackId:
      courseServiceDiscountInfo.commissionDiscountPackId,
    packName: courseServiceDiscountInfo.packName,
    validityPeriodStartDate: new Date(
      courseServiceDiscountInfo.validityPeriodStartDate
    ),
    validityPeriodEndDate: new Date(
      courseServiceDiscountInfo.validityPeriodEndDate
    ),
  };
  newCourseServiceDiscountInfo.memberTypeSettingTvaa = {
    commissionDiscountPackId:
      memberTypeSettingTvaaRow[0].commissionDiscountPackId,
    packName: memberTypeSettingTvaaRow[0].packName,
    validityPeriodStartDate: new Date(
      memberTypeSettingTvaaRow[0].validityPeriodStartDate
    ),
    validityPeriodEndDate: new Date(
      memberTypeSettingTvaaRow[0].validityPeriodEndDate
    ),
  };
  newCourseServiceDiscountInfo.memberTypeSettingBike = {
    commissionDiscountPackId:
      memberTypeSettingBikeRow[0].commissionDiscountPackId,
    packName: memberTypeSettingBikeRow[0].packName,
    validityPeriodStartDate: new Date(
      memberTypeSettingBikeRow[0].validityPeriodStartDate
    ),
    validityPeriodEndDate: new Date(
      memberTypeSettingBikeRow[0].validityPeriodEndDate
    ),
  };
  newCourseServiceDiscountInfo.memberTypeSettingOmatome = {
    commissionDiscountPackId:
      memberTypeSettingOmatomeRow[0].commissionDiscountPackId,
    packName: memberTypeSettingOmatomeRow[0].packName,
    validityPeriodStartDate: new Date(
      memberTypeSettingOmatomeRow[0].validityPeriodStartDate
    ),
    validityPeriodEndDate: new Date(
      memberTypeSettingOmatomeRow[0].validityPeriodEndDate
    ),
  };

  return newCourseServiceDiscountInfo;
};

const ScrMem0014ServiceDiscountTab = (props: {
  contractBase: registrationRequest;
  setContractBaseValue: (contractBase: registrationRequest) => void;
}) => {
  // router
  const { contractId, corporationId, logisticsBaseId } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const apiRef = useGridApiRef();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [courseServiceDiscountInfo, setCourseServiceDiscountInfo] =
    useState<ScrCom9999GetCourseServiceDiscountInfoResponse>({
      memberTypeSettingTvaa: [],
      memberTypeSettingBike: [],
      memberTypeSettingOmatome: [],
    });
  const [campaignInfo, setCampaignInfo] =
    useState<ScrCom9999SearchCampaignInfoResponse>({
      basicDiscountIncreaseList: [],
      optionDiscountIncreaseList: [],
    });
  useState<boolean>(false);
  const [beforeCourseInfomation, setBeforeCourseInfomation] =
    useState<courseInfomationRowModel>({
      id: '',
      courseId: '',
      linkMemberKind: '',
      courseEntryKind: '',
      useStartDate: '',
      contractPeriodStartDate: '',
      contractPeriodEndDate: '',
      contractPeriodDate: '',
      recessPeriodDate: [],
      leavingDate: '',
      targetedServiceKind: '',
      recessLeavingReasonKind: '',
    });
  const [courseInfomation, setCourseInfomation] =
    useState<courseInfomationRowModel>({
      id: '',
      courseId: '',
      linkMemberKind: '',
      courseEntryKind: '',
      useStartDate: '',
      contractPeriodStartDate: '',
      contractPeriodEndDate: '',
      contractPeriodDate: '',
      recessPeriodDate: [],
      leavingDate: '',
      targetedServiceKind: '',
      recessLeavingReasonKind: '',
    });
  const [courseInfomationRow, setCourseInfomationRow] = useState<
    courseInfomationRowModel[]
  >([]);
  const [baseServiceInfomationRow, setBaseServiceInfomationRow] = useState<
    baseServiceInfomationRowModel[]
  >([]);
  const [optionInfomation, setOptionInfomation] = useState<
    optionInfomationRowModel[]
  >([]);
  const [optionInfomationRow, setOptionInfomationRow] = useState<
    optionInfomationRowModel[]
  >([]);
  const [
    individualCourseSettingBasicDiscountPriceRow,
    setIndividualCourseSettingBasicDiscountPriceRow,
  ] = useState<individualCourseSettingBasicDiscountPriceRowModel[]>([]);
  const [
    individualCourseSettingOptionDiscountPriceRow,
    setIndividualCourseSettingOptionDiscountPriceRow,
  ] = useState<individualCourseSettingOptionDiscountPriceRowModel[]>([]);
  const [
    individualContractSettingBasicDiscountPriceRow,
    setIndividualContractSettingBasicDiscountPriceRow,
  ] = useState<individualContractSettingBasicDiscountPriceRowModel[]>([]);
  const [
    individualContractSettingOptionDiscountPriceRow,
    setIndividualContractSettingOptionDiscountPriceRow,
  ] = useState<individualContractSettingOptionDiscountPriceRowModel[]>([]);
  const [finalFeeDiscountRow, setFinalFeeDiscountRow] = useState<
    finalFeeDiscountRowModel[]
  >([]);
  const [beforeFeeDiscountRow, setBeforeFeeDiscountRow] = useState<
    feeDiscountRowModel[]
  >([]);
  const [beforeOptionInfoRow, setBeforeOptionInfoRow] = useState<
    optionInfoRowModel[]
  >([]);
  const [afterFeeDiscountRow, setAfterFeeDiscountRow] = useState<
    feeDiscountRowModel[]
  >([]);
  const [afterOptionInfoRow, setAfterOptionInfoRow] = useState<
    optionInfoRowModel[]
  >([]);
  const [memberTypeSettingTvaaRow, setMemberTypeSettingTvaaRow] = useState<
    typeSettingRowModel[]
  >([]);
  const [memberTypeSettingBikeRow, setMemberTypeSettingBikeRow] = useState<
    typeSettingRowModel[]
  >([]);
  const [memberTypeSettingOmatomeRow, setMemberTypeSettingOmatomeRow] =
    useState<typeSettingRowModel[]>([]);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [
    isRecessLeavingReasonKindDisabled,
    setIsRecessLeavingReasonKindDisabled,
  ] = useState<boolean>(false);
  const [isServiceInfoDisabled, setIsServiceInfoDisabled] =
    useState<boolean>(true);
  const [confirmButtonDisable, setConfirmButtonDisable] =
    useState<boolean>(true);
  const [scrCom00032PopupIsOpen, setScrCom00032PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [scrCom00033PopupIsOpen, setScrCom00033PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0033PopupData, setScrCom0033PopupData] =
    useState<ScrCom0033PopupModel>(scrCom0033PopupInitialValues);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0014') === -1
  );

  const methods = useForm<CourseServiceDiscountInfoModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    setValue,
    getValues,
    reset,
  } = methods;

  // 初期表示
  useEffect(() => {
    const initialize = async (
      contractId: string,
      corporationId: string,
      logisticsBaseId: string
    ) => {
      // リスト取得
      const newSelectValues = selectValuesInitialValues;

      // コード管理マスタ情報取得
      const getCodeManagementMasterMultipleRequest = {
        codeId: [
          'CDE-COM-0147',
          'CDE-COM-0025',
          'CDE-COM-0026',
          'CDE-COM-0041',
          'CDE-COM-0042',
          'CDE-COM-0043',
          'CDE-COM-0211',
          'CDE-COM-0212',
          'CDE-COM-0049',
          'CDE-COM-0047',
          'CDE-COM-0048',
        ],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0147') {
          x.codeValueList.map((f) => {
            courseInfomationColumns[1].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0025') {
          x.codeValueList.map((f) => {
            courseInfomationColumns[2].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0026') {
          x.codeValueList.map((f) => {
            courseInfomationColumns[8].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
            optionInfomationColumns[9].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0041') {
          x.codeValueList.map((f) => {
            newSelectValues.serviceKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0042') {
          x.codeValueList.map((f) => {
            newSelectValues.memberKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0043') {
          x.codeValueList.map((f) => {
            newSelectValues.entryKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0211') {
          x.codeValueList.map((f) => {
            newSelectValues.mailSendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0212') {
          x.codeValueList.map((f) => {
            newSelectValues.dmSendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0049') {
          x.codeValueList.map((f) => {
            newSelectValues.aucCsKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0047') {
          x.codeValueList.map((f) => {
            newSelectValues.dealKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0048') {
          x.codeValueList.map((f) => {
            newSelectValues.carsensorKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // コース名情報取得
      const getCoursenameResponse = await ScrCom9999GetCoursename();
      getCoursenameResponse.courceList.map((x) => {
        courseInfomationColumns[0].selectValues?.push({
          value: x.codeValue,
          displayValue: x.codeName,
        });
      });

      // 手数料値引値増情報取得
      const scrCom9999GetCourseServiceDiscountInfoResponse =
        await ScrCom9999GetCourseServiceDiscountInfo();
      setCourseServiceDiscountInfo(
        scrCom9999GetCourseServiceDiscountInfoResponse
      );
      scrCom9999GetCourseServiceDiscountInfoResponse.memberTypeSettingTvaa.map(
        (x) => {
          memberTypeSettingTvaaColumns[0].selectValues?.push({
            value: x.commissionDiscountPackId,
            displayValue: x.packName,
          });
        }
      );
      scrCom9999GetCourseServiceDiscountInfoResponse.memberTypeSettingBike.map(
        (x) => {
          memberTypeSettingBikeColumns[0].selectValues?.push({
            value: x.commissionDiscountPackId,
            displayValue: x.packName,
          });
        }
      );
      scrCom9999GetCourseServiceDiscountInfoResponse.memberTypeSettingOmatome.map(
        (x) => {
          memberTypeSettingOmatomeColumns[0].selectValues?.push({
            value: x.commissionDiscountPackId,
            displayValue: x.packName,
          });
        }
      );

      // キャンペーン情報取得
      const searchCampaignInfoResponse = await ScrCom9999SearchCampaignInfo();
      setCampaignInfo(searchCampaignInfoResponse);
      searchCampaignInfoResponse.basicDiscountIncreaseList.map((x) => {
        individualContractSettingBasicDiscountPriceColumns[1].selectValues?.push(
          {
            value: x.campaignCode,
            displayValue: x.campaignCode,
          }
        );
      });
      searchCampaignInfoResponse.optionDiscountIncreaseList.map((x) => {
        individualContractSettingOptionDiscountPriceColumns[1].selectValues?.push(
          {
            value: x.campaignCode,
            displayValue: x.campaignCode,
          }
        );
      });

      setSelectValues({
        terminalContractIdSelectValues:
          newSelectValues.terminalContractIdSelectValues,
        serviceKindSelectValues: newSelectValues.serviceKindSelectValues,
        memberKindSelectValues: newSelectValues.memberKindSelectValues,
        entryKindSelectValues: newSelectValues.entryKindSelectValues,
        mailSendKindSelectValues: newSelectValues.mailSendKindSelectValues,
        dmSendKindSelectValues: newSelectValues.dmSendKindSelectValues,
        aucCsKindSelectValues: newSelectValues.aucCsKindSelectValues,
        dealKindSelectValues: newSelectValues.dealKindSelectValues,
        carsensorKindSelectValues: newSelectValues.carsensorKindSelectValues,
      });

      // サービス・値引値増情報取得
      const getCourseServiceDiscountInfoRequest = {
        courseId: '',
        contractId: contractId,
      };
      const getCourseServiceDiscountInfoResponse =
        await ScrMem0014GetCourseServiceDiscountInfo(
          getCourseServiceDiscountInfoRequest
        );

      // 会費値引値増情報取得
      const getMembershipfeediscountincreaseInfoRequest = {
        contractId: contractId,
        courseId: getCourseServiceDiscountInfoResponse.courseInfo.courseId,
      };
      const getMembershipfeediscountincreaseInfoResponse =
        await ScrCom9999GetMembershipfeediscountincreaseInfo(
          getMembershipfeediscountincreaseInfoRequest
        );

      // 会費値引値増金額算出
      const calculateAmountMembershipfeediscountincreaseRequest =
        convertFromCalculateAmountMembershipfeediscountincreaseRequest(
          getCourseServiceDiscountInfoResponse,
          getMembershipfeediscountincreaseInfoResponse
        );
      const calculateAmountMembershipfeediscountincreaseResponse =
        await ScrMem0014CalculateAmountMembershipfeediscountincrease(
          calculateAmountMembershipfeediscountincreaseRequest
        );

      // 画面にデータを設定
      const courseServiceDiscountInfo = convertToCourseServiceDiscountInfoModel(
        getCourseServiceDiscountInfoResponse
      );
      reset(courseServiceDiscountInfo);

      // コース情報行への変換
      const courseInfomationRow = convertToCourseInfomationRow(
        getCourseServiceDiscountInfoResponse,
        []
      );
      setCourseInfomationRow(courseInfomationRow);
      setCourseInfomation(Object.assign({}, courseInfomationRow[0]));
      setBeforeCourseInfomation(Object.assign({}, courseInfomationRow[0]));
      // 基本サービス行変換
      setBaseServiceInfomationRow(
        convertToBaseServiceInfomationRow(
          getCourseServiceDiscountInfoResponse,
          []
        )
      );
      // オプション情報行への変換
      const optionInfomationRow = convertToOptionInfomationRow(
        getCourseServiceDiscountInfoResponse,
        []
      );
      setOptionInfomationRow(optionInfomationRow);
      setOptionInfomation(optionInfomationRow);
      // オプション情報＋ボタン設定
      optionInfomationColumns[10].renderCell = (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ) => {
        if (
          params.row.optionEntryKind === '参加' ||
          params.row.optionEntryKind === '脱会'
        )
          return (
            <AddIconButton
              onClick={() => onClickAddIcon(optionInfomationRow, params.row.id)}
            />
          );
        return;
      };

      // サービス固有情報表示
      if (optionInfomationRow.length === 0) {
        setIsServiceInfoDisabled(false);
      }
      optionInfomationRow.map((x) => {
        if (
          x.optionEntryKind == '参加' ||
          x.optionEntryKind == '売り込み' ||
          x.optionEntryKind == '休会' ||
          x.optionEntryKind == '締結待ち'
        ) {
          if (x.useStartDate !== '') {
            setIsServiceInfoDisabled(false);
          }
        }
      });
      // コース個別設定・基本値引値増行への変換
      setIndividualCourseSettingBasicDiscountPriceRow(
        convertToIndividualCourseSettingBasicDiscountPriceRow(
          getMembershipfeediscountincreaseInfoResponse
        )
      );
      // コース個別設定・オプション値引値増行への変換
      setIndividualCourseSettingOptionDiscountPriceRow(
        convertToIndividualCourseSettingOptionDiscountPriceRow(
          getMembershipfeediscountincreaseInfoResponse
        )
      );
      // 契約個別設定・基本値引値増行への変換
      setIndividualContractSettingBasicDiscountPriceRow(
        convertToIndividualContractSettingBasicDiscountPriceRow(
          getMembershipfeediscountincreaseInfoResponse
        )
      );
      // 契約個別設定・オプション値引値増行への変換
      setIndividualContractSettingOptionDiscountPriceRow(
        convertToIndividualContractSettingOptionDiscountPriceRow(
          getMembershipfeediscountincreaseInfoResponse
        )
      );
      // 最終値引値増金額行への変換
      setFinalFeeDiscountRow(
        convertToFinalFeeDiscountRow(
          calculateAmountMembershipfeediscountincreaseResponse
        )
      );
      // 値引値増適用前 料金表コース行への変換
      setBeforeFeeDiscountRow(
        convertToBeforeFeeDiscountRow(
          calculateAmountMembershipfeediscountincreaseResponse
        )
      );
      // 値引値増適用前 料金表オプション行への変換
      setBeforeOptionInfoRow(
        convertToBeforeOptionInfoRow(
          calculateAmountMembershipfeediscountincreaseResponse
        )
      );
      // 値引値増適用後 料金表コース行への変換
      setAfterFeeDiscountRow(
        convertToAfterFeeDiscountRow(
          calculateAmountMembershipfeediscountincreaseResponse
        )
      );
      // 値引値増適用後 料金表オプション行への変換
      setAfterOptionInfoRow(
        convertToAfterOptionInfoRow(
          calculateAmountMembershipfeediscountincreaseResponse
        )
      );
      //会員個別設定・四輪行への変換
      setMemberTypeSettingTvaaRow(
        convertToMemberTypeSettingTvaaRow(getCourseServiceDiscountInfoResponse)
      );
      //会員個別設定・二輪行への変換
      setMemberTypeSettingBikeRow(
        convertToMemberTypeSettingBikeRow(getCourseServiceDiscountInfoResponse)
      );
      //会員個別設定・おまとめ行への変換
      setMemberTypeSettingOmatomeRow(
        convertToMemberTypeSettingOmatomeRow(
          getCourseServiceDiscountInfoResponse
        )
      );
    };

    const historyInitialize = async (applicationId: string) => {
      // リスト取得
      const newSelectValues = selectValuesInitialValues;

      // コード管理マスタ情報取得
      const getCodeManagementMasterMultipleRequest = {
        codeId: [
          'CDE-COM-0147',
          'CDE-COM-0025',
          'CDE-COM-0026',
          'CDE-COM-0041',
          'CDE-COM-0042',
          'CDE-COM-0043',
          'CDE-COM-0211',
          'CDE-COM-0212',
          'CDE-COM-0049',
          'CDE-COM-0047',
          'CDE-COM-0048',
        ],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0147') {
          x.codeValueList.map((f) => {
            courseInfomationColumns[1].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0025') {
          x.codeValueList.map((f) => {
            courseInfomationColumns[2].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0026') {
          x.codeValueList.map((f) => {
            courseInfomationColumns[8].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
            optionInfomationColumns[9].selectValues?.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0041') {
          x.codeValueList.map((f) => {
            newSelectValues.serviceKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0042') {
          x.codeValueList.map((f) => {
            newSelectValues.memberKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0043') {
          x.codeValueList.map((f) => {
            newSelectValues.entryKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0211') {
          x.codeValueList.map((f) => {
            newSelectValues.mailSendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0212') {
          x.codeValueList.map((f) => {
            newSelectValues.dmSendKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0049') {
          x.codeValueList.map((f) => {
            newSelectValues.aucCsKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0047') {
          x.codeValueList.map((f) => {
            newSelectValues.dealKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0048') {
          x.codeValueList.map((f) => {
            newSelectValues.carsensorKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // コース名情報取得
      const getCoursenameResponse = await ScrCom9999GetCoursename();
      getCoursenameResponse.courceList.map((x) => {
        courseInfomationColumns[0].selectValues?.push({
          value: x.codeValue,
          displayValue: x.codeName,
        });
      });

      // 手数料値引値増情報取得
      const scrCom9999GetCourseServiceDiscountInfoResponse =
        await ScrCom9999GetCourseServiceDiscountInfo();
      setCourseServiceDiscountInfo(
        scrCom9999GetCourseServiceDiscountInfoResponse
      );
      scrCom9999GetCourseServiceDiscountInfoResponse.memberTypeSettingTvaa.map(
        (x) => {
          memberTypeSettingTvaaColumns[0].selectValues?.push({
            value: x.commissionDiscountPackId,
            displayValue: x.packName,
          });
        }
      );
      scrCom9999GetCourseServiceDiscountInfoResponse.memberTypeSettingBike.map(
        (x) => {
          memberTypeSettingBikeColumns[0].selectValues?.push({
            value: x.commissionDiscountPackId,
            displayValue: x.packName,
          });
        }
      );
      scrCom9999GetCourseServiceDiscountInfoResponse.memberTypeSettingOmatome.map(
        (x) => {
          memberTypeSettingOmatomeColumns[0].selectValues?.push({
            value: x.commissionDiscountPackId,
            displayValue: x.packName,
          });
        }
      );

      // キャンペーン情報取得
      const searchCampaignInfoResponse = await ScrCom9999SearchCampaignInfo();
      setCampaignInfo(searchCampaignInfoResponse);
      searchCampaignInfoResponse.basicDiscountIncreaseList.map((x) => {
        individualContractSettingBasicDiscountPriceColumns[1].selectValues?.push(
          {
            value: x.campaignCode,
            displayValue: x.campaignName,
          }
        );
      });
      searchCampaignInfoResponse.optionDiscountIncreaseList.map((x) => {
        individualContractSettingOptionDiscountPriceColumns[1].selectValues?.push(
          {
            value: x.campaignCode,
            displayValue: x.campaignName,
          }
        );
      });

      setSelectValues({
        terminalContractIdSelectValues:
          newSelectValues.terminalContractIdSelectValues,
        serviceKindSelectValues: newSelectValues.serviceKindSelectValues,
        memberKindSelectValues: newSelectValues.memberKindSelectValues,
        entryKindSelectValues: newSelectValues.entryKindSelectValues,
        mailSendKindSelectValues: newSelectValues.mailSendKindSelectValues,
        dmSendKindSelectValues: newSelectValues.dmSendKindSelectValues,
        aucCsKindSelectValues: newSelectValues.aucCsKindSelectValues,
        dealKindSelectValues: newSelectValues.dealKindSelectValues,
        carsensorKindSelectValues: newSelectValues.carsensorKindSelectValues,
      });

      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response: registrationRequest = (
        await memApiClient.post('/scr-mem-9999/get-history-info', request)
      ).data;
      const corporationBasic =
        convertToHistoryCourseServiceDiscountInfoModel(response);
      setCourseInfomationRow([
        {
          id: response.courseInfomation.courseId,
          courseId: response.courseInfomation.courseId,
          linkMemberKind: response.courseInfomation.linkMemberKind,
          courseEntryKind: response.courseInfomation.courseEntryKind,
          useStartDate: new Date(
            response.courseInfomation.useStartDate
          ).toLocaleDateString(),
          contractPeriodStartDate: new Date(
            response.courseInfomation.contractPeriodStartDate
          ).toLocaleDateString(),
          contractPeriodEndDate: new Date(
            response.courseInfomation.contractPeriodEndDate
          ).toLocaleDateString(),
          contractPeriodDate:
            new Date(
              response.courseInfomation.contractPeriodStartDate
            ).toLocaleDateString() +
            '　~　' +
            new Date(
              response.courseInfomation.contractPeriodEndDate
            ).toLocaleDateString(),
          recessPeriodDate: [
            new Date(
              response.courseInfomation.recessPeriodStartDate
            ).toLocaleDateString(),
            new Date(
              response.courseInfomation.recessPeriodEndDate
            ).toLocaleDateString(),
          ],
          leavingDate: new Date(
            response.courseInfomation.leavingDate
          ).toLocaleDateString(),
          targetedServiceKind: response.courseInfomation.targetedServiceKind,
          recessLeavingReasonKind:
            response.courseInfomation.recessLeavingReasonKind,
        },
      ]);
      setBaseServiceInfomationRow(
        response.baseServiceInfomation.map((x) => {
          return {
            id: x.serviceId,
            service: x.serviceId + '　' + x.serviceName,
            serviceId: x.serviceId,
            serviceName: x.serviceName,
            contractCount: x.contractCount,
            targetedServiceKind: x.targetedServiceKind,
          };
        })
      );
      const optionInfomation: optionInfomationRowModel[] =
        response.optionInfomation.map((x, idx) => {
          return {
            id: idx.toString(),
            optionEntryKind: x.optionEntryKind,
            serviceId: x.serviceId,
            serviceName: x.serviceName,
            contractOptionNumber: x.contractOptionNumber,
            contractCount: x.contractCount,
            useStartDate: new Date(x.useStartDate).toLocaleDateString(),
            contractPeriodDate:
              new Date(x.contractPeriodStartDate).toLocaleDateString() +
              '　~　' +
              new Date(x.contractPeriodEndDate).toLocaleDateString(),
            contractPeriodStartDate: new Date(
              x.contractPeriodStartDate
            ).toLocaleDateString(),
            contractPeriodEndDate: new Date(
              x.contractPeriodEndDate
            ).toLocaleDateString(),
            recessPeriodDate: [
              new Date(x.recessPeriodStartDate).toLocaleDateString(),
              new Date(x.recessPeriodEndDate).toLocaleDateString(),
            ],
            leavingDate: new Date(x.leavingDate).toLocaleDateString(),
            useOptionServiceId: x.useOptionServiceId,
            useOptionService: x.useOptionServiceId,
            targetedServiceKind: x.targetedServiceKind,
            recessLeavingReasonKind: x.recessLeavingReasonKind,
          };
        });
      setOptionInfomationRow(optionInfomationRow);
      setOptionInfomation(optionInfomationRow);
      // オプション情報＋ボタン設定
      optionInfomationColumns[10].renderCell = (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ) => {
        if (
          params.row.optionEntryKind === '参加' ||
          params.row.optionEntryKind === '脱会'
        ) {
          if (isReadOnly) {
            return;
          }
          return (
            <AddIconButton
              onClick={() => onClickAddIcon(optionInfomationRow, params.row.id)}
            />
          );
        }
        return;
      };
      setIndividualCourseSettingBasicDiscountPriceRow(
        response.individualCourseSettingBasicDiscountPrice.map((val, idx) => {
          const periodStartDate = new Date(
            val.periodStartDate
          ).toLocaleDateString();
          const periodEndDate = new Date(
            val.periodEndDate
          ).toLocaleDateString();
          const periodDate =
            val.contractMonths === 0
              ? periodStartDate + '　~　' + periodEndDate
              : val.contractMonths !== null
              ? '契約から' + val.contractMonths + 'ヶ月'
              : '';
          return {
            id: idx.toString(),
            enableFlag: val.enableFlag ? '●' : '',
            feeKind: val.feeKind,
            Price: val.discountPriceKind + '　' + val.discountPrice,
            discountPriceKind: val.discountPriceKind,
            discountPrice: val.discountPrice,
            courseId: val.courseId,
            courseName: val.courseName,
            oneCountExclusionFlag: val.oneCountExclusionFlag,
            contractCount:
              val.contractCountMin + '以上　' + val.contractCountMax + '未満',
            contractCountMin: val.contractCountMin,
            contractCountMax: val.contractCountMax,
            periodDate: periodDate,
            periodStartDate: periodStartDate,
            periodEndDate: periodEndDate,
            contractMonths: Number(val.contractMonths),
          };
        })
      );
      setIndividualCourseSettingOptionDiscountPriceRow(
        response.individualCourseSettingOptionDiscountPrice.map((val, idx) => {
          const periodStartDate = new Date(
            val.periodStartDate
          ).toLocaleDateString();
          const periodEndDate = new Date(
            val.periodEndDate
          ).toLocaleDateString();
          const periodDate =
            val.contractMonths === 0
              ? periodStartDate + '　~　' + periodEndDate
              : val.contractMonths !== null
              ? '契約から' + val.contractMonths + 'ヶ月'
              : '';
          return {
            id: idx.toString(),
            enableFlag: val.enableFlag ? '●' : '',
            feeKind: val.feeKind,
            Price: val.discountPriceKind + '　' + val.discountPrice,
            discountPriceKind: val.discountPriceKind,
            discountPrice: val.discountPrice,
            serviceId: val.serviceId,
            serviceName: val.serviceName,
            oneCountExclusionFlag: val.oneCountExclusionFlag,
            contractCount:
              val.contractCountMin + '以上　' + val.contractCountMax + '未満',
            contractCountMin: val.contractCountMin,
            contractCountMax: val.contractCountMax,
            periodDate: periodDate,
            periodStartDate: periodStartDate,
            periodEndDate: periodEndDate,
            contractMonths: val.contractMonths,
          };
        })
      );
      setIndividualContractSettingBasicDiscountPriceRow(
        response.individualContractSettingBasicDiscountPrice.map((val, idx) => {
          const periodStartDate = new Date(
            val.periodStartDate
          ).toLocaleDateString();
          const periodEndDate = new Date(
            val.periodEndDate
          ).toLocaleDateString();
          const periodDate =
            val.contractMonths === 0
              ? periodStartDate + '　~　' + periodEndDate
              : val.contractMonths !== null
              ? '契約から' + val.contractMonths + 'ヶ月'
              : '';
          return {
            id: idx.toString(),
            enableFlag: val.enableFlag ? '●' : '',
            campaignCode: val.campaignCode,
            campaignName: val.campaignName,
            feeKind: val.feeKind,
            Price: val.discountPriceKind + '　' + val.discountPrice,
            discountPriceKind: val.discountPriceKind,
            discountPrice: val.discountPrice,
            courseId: val.courseId,
            courseName: val.courseName,
            oneCountExclusionFlag: val.oneCountExclusionFlag,
            contractCount:
              val.contractCountMin + '以上　' + val.contractCountMax + '未満',
            contractCountMin: val.contractCountMin,
            contractCountMax: val.contractCountMax,
            periodDate: periodDate,
            periodStartDate: periodStartDate,
            periodEndDate: periodEndDate,
            contractMonths: val.contractMonths,
          };
        })
      );
      setIndividualContractSettingOptionDiscountPriceRow(
        response.individualContractSettingOptionDiscountPrice.map(
          (val, idx) => {
            const periodStartDate = new Date(
              val.periodStartDate
            ).toLocaleDateString();
            const periodEndDate = new Date(
              val.periodEndDate
            ).toLocaleDateString();
            const periodDate =
              val.contractMonths === 0
                ? periodStartDate + '　~　' + periodEndDate
                : val.contractMonths !== null
                ? '契約から' + val.contractMonths + 'ヶ月'
                : '';
            return {
              id: idx.toString(),
              enableFlag: val.enableFlag ? '●' : '',
              campaignCode: val.campaignCode,
              campaignName: val.campaignName,
              feeKind: val.feeKind,
              Price: val.discountPriceKind + '　' + val.discountPrice,
              discountPriceKind: val.discountPriceKind,
              discountPrice: val.discountPrice,
              serviceId: val.serviceId,
              serviceName: val.serviceName,
              oneCountExclusionFlag: val.oneCountExclusionFlag,
              contractCount:
                val.contractCountMin + '以上　' + val.contractCountMax + '未満',
              contractCountMin: val.contractCountMin,
              contractCountMax: val.contractCountMax,
              periodDate: periodDate,
              periodStartDate: periodStartDate,
              periodEndDate: periodEndDate,
              contractMonths: val.contractMonths,
            };
          }
        )
      );
      setFinalFeeDiscountRow(
        response.finalFeeDiscount.map((val, idx) => {
          return {
            id: idx.toString(),
            useOptionServiceId: val.useOptionServiceId,
            feeKind: val.feeKind,
            courseContractId: val.courseContractId,
            serviceId: val.serviceId,
            serviceName: val.serviceName,
            contractCount: val.contractCount,
            discountPrice: val.discountPrice,
            discountTotalPrice: val.discountTotalPrice,
          };
        })
      );
      setBeforeFeeDiscountRow([
        {
          id: '1',
          courseId: response.beforeFeeDiscount.courseInfo.courseId,
          courseName: response.beforeFeeDiscount.courseInfo.courseName,
          courseMembership:
            response.beforeFeeDiscount.courseInfo.courseMembership,
          courseFee: response.beforeFeeDiscount.courseInfo.courseFee,
        },
      ]);
      setBeforeOptionInfoRow(
        response.beforeFeeDiscount.optionInfo.map((val, idx) => {
          return {
            id: idx.toString(),
            serviceId: val.serviceId,
            serviceName: val.serviceName,
            optionServiceMembership: val.optionServiceMembership,
            optionServiceFee: val.optionServiceFee,
          };
        })
      );
      setAfterFeeDiscountRow([
        {
          id: '1',
          courseId: response.afterFeeDiscount.courseInfo.courseId,
          courseName: response.afterFeeDiscount.courseInfo.courseName,
          courseMembership:
            response.afterFeeDiscount.courseInfo.courseMembership,
          courseFee: response.afterFeeDiscount.courseInfo.courseFee,
        },
      ]);
      setAfterOptionInfoRow(
        response.afterFeeDiscount.optionInfo.map((val, idx) => {
          return {
            id: idx.toString(),
            serviceId: val.serviceId,
            serviceName: val.serviceName,
            optionServiceMembership: val.optionServiceMembership,
            optionServiceFee: val.optionServiceFee,
          };
        })
      );
      setMemberTypeSettingTvaaRow([
        {
          id: '1',
          commissionDiscountPackId:
            response.memberTypeSettingTvaa.commissionDiscountPackId,
          packName: response.memberTypeSettingTvaa.packName,
          validityPeriodDate:
            new Date(
              response.memberTypeSettingTvaa.validityPeriodStartDate
            ).toLocaleDateString() +
            '　~　' +
            new Date(
              response.memberTypeSettingTvaa.validityPeriodEndDate
            ).toLocaleDateString(),
          validityPeriodStartDate: new Date(
            response.memberTypeSettingTvaa.validityPeriodStartDate
          ).toLocaleDateString(),
          validityPeriodEndDate: new Date(
            response.memberTypeSettingTvaa.validityPeriodEndDate
          ).toLocaleDateString(),
        },
      ]);
      setMemberTypeSettingBikeRow([
        {
          id: '1',
          commissionDiscountPackId:
            response.memberTypeSettingBike.commissionDiscountPackId,
          packName: response.memberTypeSettingBike.packName,
          validityPeriodDate:
            new Date(
              response.memberTypeSettingBike.validityPeriodStartDate
            ).toLocaleDateString() +
            '　~　' +
            new Date(
              response.memberTypeSettingBike.validityPeriodEndDate
            ).toLocaleDateString(),
          validityPeriodStartDate: new Date(
            response.memberTypeSettingBike.validityPeriodStartDate
          ).toLocaleDateString(),
          validityPeriodEndDate: new Date(
            response.memberTypeSettingBike.validityPeriodEndDate
          ).toLocaleDateString(),
        },
      ]);
      setMemberTypeSettingOmatomeRow([
        {
          id: '1',
          commissionDiscountPackId:
            response.memberTypeSettingOmatome.commissionDiscountPackId,
          packName: response.memberTypeSettingOmatome.packName,
          validityPeriodDate:
            new Date(
              response.memberTypeSettingOmatome.validityPeriodStartDate
            ).toLocaleDateString() +
            '　~　' +
            new Date(
              response.memberTypeSettingOmatome.validityPeriodEndDate
            ).toLocaleDateString(),
          validityPeriodStartDate: new Date(
            response.memberTypeSettingOmatome.validityPeriodStartDate
          ).toLocaleDateString(),
          validityPeriodEndDate: new Date(
            response.memberTypeSettingOmatome.validityPeriodEndDate
          ).toLocaleDateString(),
        },
      ]);

      // 画面にデータを設定
      reset(corporationBasic);
      props.setContractBaseValue(response);
    };

    if (contractId === undefined) return;
    if (corporationId === undefined) return;
    if (logisticsBaseId === undefined) return;

    if (applicationId !== null) {
      historyInitialize(applicationId);
      return;
    }

    initialize(contractId, corporationId, logisticsBaseId);
  }, [contractId, corporationId, logisticsBaseId, applicationId, reset]);

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    methods.trigger();
    if (!methods.formState.isValid) return;
    let isValid = false;
    baseServiceInfomationRow.map((x) => {
      if (x.contractCount.toString().length > 4) isValid = true;
      if (x.contractCount.toString().match(/^[0-9]*$/) === null) isValid = true;
    });
    optionInfomationRow.map((x) => {
      if (x.contractCount.toString().length > 4) isValid = true;
      if (x.contractCount.toString().match(/^[0-9]*$/) === null) isValid = true;
    });
    if (isValid) return;
    const errorList: errorList[] = [];
    // コース情報利用開始日・脱会日・休会期間のチェック
    const contractPeriodDate = new Date(
      beforeCourseInfomation.contractPeriodDate
    );
    const contractPeriodDateYYYYMM =
      contractPeriodDate.getFullYear() + contractPeriodDate.getMonth();
    const taskDate = new Date(user.taskDate);
    const taskDateYYYYMM = taskDate.getFullYear() + taskDate.getMonth();
    if (contractPeriodDateYYYYMM !== taskDateYYYYMM) {
      if (new Date(courseInfomationRow[0].contractPeriodDate) < taskDate) {
        errorList.push({
          errorCode: 'MSG-FR-ERR-00083',
          errorMessage:
            'サービス基本情報セクションのコース情報の利用開始日は過去日です',
        });
      }
    }
    if (new Date(courseInfomationRow[0].leavingDate) < taskDate) {
      errorList.push({
        errorCode: 'MSG-FR-ERR-00083',
        errorMessage:
          'サービス基本情報セクションのコース情報の脱会日は過去日です',
      });
    }
    if (
      new Date(courseInfomationRow[0].recessPeriodDate[0]) <
      new Date(courseInfomationRow[0].recessPeriodDate[1])
    ) {
      errorList.push({
        errorCode: 'MSG-FR-ERR-00085',
        errorMessage:
          'サービス基本情報セクションのコース情報の休会終了日はFromより以降の日付です',
      });
    }

    // オプション情報利用開始日・脱会日・休会期間のチェック
    optionInfomation.map((x) => {
      const optionInfo = optionInfomationRow.find(
        (f) => f.serviceName === x.serviceName
      );
      if (optionInfo !== undefined) {
        const optionInfoContractPeriodDate = new Date(
          optionInfo.contractPeriodDate
        );
        const optionInfoContractPeriodDateYYYYMM =
          optionInfoContractPeriodDate.getFullYear() +
          optionInfoContractPeriodDate.getMonth();
        if (optionInfoContractPeriodDateYYYYMM !== taskDateYYYYMM) {
          if (new Date(optionInfo.contractPeriodDate) < taskDate) {
            errorList.push({
              errorCode: 'MSG-FR-ERR-00083',
              errorMessage:
                'サービス基本情報セクションのオプション情報の' +
                x.serviceName +
                'のコース情報の利用開始日は過去日です',
            });
          }
        }
        if (new Date(optionInfo.leavingDate) < taskDate) {
          errorList.push({
            errorCode: 'MSG-FR-ERR-00083',
            errorMessage:
              'サービス基本情報セクションのオプション情報の' +
              x.serviceName +
              'のコース情報の脱会日は過去日です',
          });
        }
        if (
          new Date(optionInfo.recessPeriodDate[0]) <
          new Date(courseInfomationRow[0].recessPeriodDate[1])
        ) {
          errorList.push({
            errorCode: 'MSG-FR-ERR-00085',
            errorMessage:
              'サービス基本情報セクションのオプション情報の' +
              x.serviceName +
              'の休会終了日はFromより以降の日付です',
          });
        }
      }
    });

    // キャンペーンコード重複チェック
    const campaignCodeList: string[] = [];
    for (const x of individualContractSettingOptionDiscountPriceRow) {
      if (campaignCodeList.indexOf(x.campaignCode) !== -1) {
        errorList.push({
          errorCode: 'MSG-FR-ERR-00087',
          errorMessage: 'キャンペーンコードが重複しています',
        });
        break;
      }
      campaignCodeList.push(x.campaignCode);
    }

    // 連携用対象サービス重複チェック
    const serviceIdList: string[] = [];
    for (const x of baseServiceInfomationRow) {
      if (serviceIdList.indexOf(x.serviceId) !== -1) {
        errorList.push({
          errorCode: 'MSG-FR-ERR-00088',
          errorMessage:
            'サービス基本情報セクションの基本サービス情報の連携対象サービスが重複しています',
        });
        break;
      }
      serviceIdList.push(x.serviceId);
    }

    const targetedServiceKindList: string[] = [];
    for (const x of optionInfomationRow) {
      if (serviceIdList.indexOf(x.targetedServiceKind) !== -1) {
        errorList.push({
          errorCode: 'MSG-FR-ERR-00088',
          errorMessage:
            'サービス基本情報セクションのオプション情報の連携対象サービスが重複しています',
        });
        break;
      }
      targetedServiceKindList.push(x.targetedServiceKind);
    }

    // 利用前提サービスチェック
    optionInfomationRow.map((x) => {
      if (x.useOptionService !== '参加') {
        if (x.useOptionService !== '売りのみ') {
          errorList.push({
            errorCode: 'MSG-BK-ERR-00071',
            errorMessage: '利用前提サービスが選択されていません',
          });
        }
      }
    });

    // サービス・値引値増情報情報入力チェック
    const inputCheckServicediscountpriceincreaseInfoRequest =
      convertFromInputCheckServicediscountpriceincreaseInfoRequest(
        contractId === undefined ? '' : contractId,
        corporationId === undefined ? '' : corporationId,
        courseInfomationRow,
        baseServiceInfomationRow,
        optionInfomationRow,
        getValues()
      );
    const inputCheckServicediscountpriceincreaseInfoResponse =
      await ScrMem0014InputCheckServicediscountpriceincreaseInfo(
        inputCheckServicediscountpriceincreaseInfoRequest
      );
    inputCheckServicediscountpriceincreaseInfoResponse.errorList.map((x) => {
      errorList.push({
        errorCode: x.errorCode,
        errorMessage: x.errorMessage,
      });
    });

    // 登録内容確認ポップアップ表示
    setScrCom00032PopupIsOpen(true);

    setScrCom0032PopupData({
      errorList: errorList,
      warningList:
        inputCheckServicediscountpriceincreaseInfoResponse.warnList.map((x) => {
          return {
            warningCode: x.errorCode,
            warningMessage: x.errorMessage,
          };
        }),
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0014',
          screenName: '契約情報詳細',
          tabId: 27,
          tabName: 'サービス・値引値増情報',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      changeExpectDate: '',
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations/' + corporationId);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = (registrationChangeMemo: string) => {
    setScrCom00032PopupIsOpen(false);

    // 登録内容申請ポップアップを呼出
    setScrCom00033PopupIsOpen(true);
    setScrCom0033PopupData({
      screenId: 'SCR-MEM-0014',
      tabId: 27,
      applicationMoney: 0,
    });
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setScrCom00032PopupIsOpen(false);
  };

  /**
   * 登録内容申請ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const scrCom0033PopupHandlePopupConfirm = async (
    employeeId1: string,
    emploeeName1: string,
    employeeMailAddress1: string,
    employeeId2?: string,
    emploeeName2?: string,
    employeeId3?: string,
    emploeeName3?: string,
    employeeId4?: string,
    emploeeName4?: string,
    applicationComment?: string
  ) => {
    setScrCom00033PopupIsOpen(false);

    // 法人情報詳細基本情報への変換
    const courseServiceDiscountInfo = convertFromBillingInfo(
      getValues(),
      courseInfomationRow,
      baseServiceInfomationRow,
      optionInfomationRow,
      individualCourseSettingBasicDiscountPriceRow,
      individualCourseSettingOptionDiscountPriceRow,
      individualContractSettingBasicDiscountPriceRow,
      individualContractSettingOptionDiscountPriceRow,
      finalFeeDiscountRow,
      beforeFeeDiscountRow,
      beforeOptionInfoRow,
      afterFeeDiscountRow,
      afterOptionInfoRow,
      memberTypeSettingTvaaRow,
      memberTypeSettingBikeRow,
      memberTypeSettingOmatomeRow,
      props.contractBase
    );

    // 請求情報登録
    const request = Object.assign(courseServiceDiscountInfo, {
      changeHistoryNumber: 0,
      firstApproverId: employeeId1,
      firstApproverMailAddress: employeeMailAddress1,
      secondApproverId: employeeId2 === undefined ? '' : employeeId2,
      thirdApproverId: employeeId3 === undefined ? '' : employeeId3,
      fourthApproverId: employeeId4 === undefined ? '' : employeeId4,
      applicationEmployeeId: user.employeeId,
      registrationChangeMemo:
        applicationComment === undefined ? '' : applicationComment,
      screenId: 'SCR-MEM-0014',
      tabId: 'B-27',
    });
    await ScrMem0014ContractBillinginfoBase(request);

    props.setContractBaseValue(courseServiceDiscountInfo);
  };

  /**
   * 登録内容申請ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const scrCom0033PopupHandlePopupCancel = () => {
    setScrCom00033PopupIsOpen(false);
  };

  /**
   * コース情報変更時のイベントハンドラ
   */
  const onCourseInfomationRowValueChange = async (row: any) => {
    // コース変更
    if (courseInfomation === undefined) return;
    if (courseInfomation.courseId !== row.courseId) {
      // 基本サービス情報とオプション情報を保持する
      const beforeBaseServiceInfomationRow = baseServiceInfomationRow;
      const beforeOptionInfomationRow = optionInfomationRow;
      // サービス・値引値増情報取得
      const getCourseServiceDiscountInfoRequest = {
        courseId: row.courseId,
        contractId: '',
      };
      const getCourseServiceDiscountInfoResponse =
        await ScrMem0014GetCourseServiceDiscountInfo(
          getCourseServiceDiscountInfoRequest
        );
      // コース情報行への変換
      setCourseInfomationRow(
        convertToCourseInfomationRow(
          getCourseServiceDiscountInfoResponse,
          courseInfomationRow
        )
      );
      // 基本サービス行変換
      const afterBaseServiceInfomationRow = convertToBaseServiceInfomationRow(
        getCourseServiceDiscountInfoResponse,
        baseServiceInfomationRow
      );
      setBaseServiceInfomationRow(afterBaseServiceInfomationRow);

      // オプション情報行への変換
      const afterOptionInfomationRow = convertToOptionInfomationRow(
        getCourseServiceDiscountInfoResponse,
        optionInfomationRow
      );
      setOptionInfomationRow(afterOptionInfomationRow);
      // オプション情報＋ボタン設定
      optionInfomationColumns[10].renderCell = (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ) => {
        if (
          params.row.optionEntryKind === '参加' ||
          params.row.optionEntryKind === '脱会'
        ) {
          if (isReadOnly) {
            return;
          }
          return (
            <AddIconButton
              onClick={() =>
                onClickAddIcon(afterOptionInfomationRow, params.row.id)
              }
            />
          );
        }
        return;
      };

      // コース個別設定
      const courseTypeSetting =
        getCourseServiceDiscountInfoResponse.courseTypeSetting;
      setValue('packName', courseTypeSetting.packName);
      setValue(
        'validityPeriodStartDate',
        new Date(courseTypeSetting.validityPeriodStartDate).toLocaleDateString()
      );
      setValue(
        'validityPeriodEndDate',
        new Date(courseTypeSetting.validityPeriodEndDate).toLocaleDateString()
      );

      // 会費値引値増情報取得
      if (contractId !== undefined) {
        const getMembershipfeediscountincreaseInfoRequest = {
          contractId: contractId,
          courseId: row.courseId,
        };
        const getMembershipfeediscountincreaseInfoResponse =
          await ScrCom9999GetMembershipfeediscountincreaseInfo(
            getMembershipfeediscountincreaseInfoRequest
          );

        // コース個別設定・基本値引値増行への変換
        setIndividualCourseSettingBasicDiscountPriceRow(
          convertToIndividualCourseSettingBasicDiscountPriceRow(
            getMembershipfeediscountincreaseInfoResponse
          )
        );
        // コース個別設定・オプション値引値増行への変換
        setIndividualCourseSettingOptionDiscountPriceRow(
          convertToIndividualCourseSettingOptionDiscountPriceRow(
            getMembershipfeediscountincreaseInfoResponse
          )
        );
        // 契約個別設定・基本値引値増行への変換
        setIndividualContractSettingBasicDiscountPriceRow(
          convertToIndividualContractSettingBasicDiscountPriceRow(
            getMembershipfeediscountincreaseInfoResponse
          )
        );
        // 契約個別設定・オプション値引値増行への変換
        setIndividualContractSettingOptionDiscountPriceRow(
          convertToIndividualContractSettingOptionDiscountPriceRow(
            getMembershipfeediscountincreaseInfoResponse
          )
        );
      }

      // サービス固有情報表示
      if (afterOptionInfomationRow.length === 0) {
        setIsServiceInfoDisabled(false);
      }
      afterOptionInfomationRow.map((x) => {
        if (
          x.optionEntryKind == '参加' ||
          x.optionEntryKind == '売り込み' ||
          x.optionEntryKind == '休会' ||
          x.optionEntryKind == '締結待ち'
        ) {
          if (x.useStartDate !== '') {
            setIsServiceInfoDisabled(false);
          }
        }
      });

      // 基本サービス情報、オプション情報の差分確認
      let messageFlag = false;
      beforeBaseServiceInfomationRow.map((x) => {
        const baseServiceInfomationRowFilter =
          afterBaseServiceInfomationRow.filter(
            (f) => x.serviceId === f.serviceId
          );
        if (baseServiceInfomationRowFilter.length === 0) messageFlag = true;
      });
      beforeOptionInfomationRow.map((x) => {
        const optionInfomationRowFilter = afterOptionInfomationRow.filter(
          (f) => x.serviceId === f.serviceId
        );
        if (optionInfomationRowFilter.length === 0) messageFlag = true;
      });
      if (messageFlag) setDialogIsOpen(true);
    }
    // コース参加区分
    if (courseInfomation.recessPeriodDate[0] !== row.recessPeriodDate[0]) {
      setIsRecessLeavingReasonKindDisabled(true);
    }
    if (courseInfomation.leavingDate !== row.leavingDate) {
      setIsRecessLeavingReasonKindDisabled(true);
    }

    // コース情報の契約期間
    if (courseInfomation.useStartDate !== row.useStartDate) {
      const useStartDate = new Date(row.useStartDate);
      const useStartDateYYYYMM =
        useStartDate.getFullYear() + useStartDate.getMonth();
      const taskDate = new Date(user.taskDate);
      const taskDateYYYYMM = taskDate.getFullYear() + taskDate.getMonth();
      if (contractId === 'new' || useStartDateYYYYMM === taskDateYYYYMM) {
        if (Number(useStartDate.getDay()) <= 24) {
          const contractPeriodStartDate = useStartDate;
          contractPeriodStartDate.setMonth(
            contractPeriodStartDate.getMonth() + 1
          );
          contractPeriodStartDate.setDate(1);
          row.contractPeriodStartDate =
            contractPeriodStartDate.toLocaleDateString();

          const contractPeriodEndDate = useStartDate;
          contractPeriodEndDate.setFullYear(
            contractPeriodEndDate.getFullYear() + 1
          );
          contractPeriodEndDate.setMonth(contractPeriodEndDate.getMonth() + 1);
          contractPeriodEndDate.setDate(0);
          row.contractPeriodEndDate =
            contractPeriodEndDate.toLocaleDateString();
          row.contractPeriodDate =
            contractPeriodStartDate.toLocaleDateString() +
            '　~　' +
            contractPeriodEndDate.toLocaleDateString();
        }
        if (Number(useStartDate.getDay()) >= 25) {
          const contractPeriodStartDate = useStartDate;
          contractPeriodStartDate.setMonth(
            contractPeriodStartDate.getMonth() + 2
          );
          contractPeriodStartDate.setDate(1);
          row.contractPeriodStartDate =
            contractPeriodStartDate.toLocaleDateString();

          const contractPeriodEndDate = useStartDate;
          contractPeriodEndDate.setFullYear(
            contractPeriodEndDate.getFullYear() + 2
          );
          contractPeriodEndDate.setMonth(contractPeriodEndDate.getMonth() + 1);
          contractPeriodEndDate.setDate(0);
          row.contractPeriodEndDate =
            contractPeriodEndDate.toLocaleDateString();
          row.contractPeriodDate =
            contractPeriodStartDate.toLocaleDateString() +
            '　~　' +
            contractPeriodEndDate.toLocaleDateString();
        }
      }
    }

    setCourseInfomation(row);

    courseInfomationRowGetCellDisabled(row, isRecessLeavingReasonKindDisabled);
  };

  /**
   * オプション情報変更時のイベントハンドラ
   */
  const onOptionInfomationRowValueChange = (row: any) => {
    // サービス固有情報表示
    if (
      row.useStartDate !== '' &&
      (row.optionEntryKind == '参加' ||
        row.optionEntryKind == '売り込み' ||
        row.optionEntryKind == '休会' ||
        row.optionEntryKind == '締結待ち')
    ) {
      setIsServiceInfoDisabled(false);
    }
    // オプション情報の契約期間
    const useStartDate = new Date(row.useStartDate);
    const useStartDateYYYYMM =
      useStartDate.getFullYear() + useStartDate.getMonth();
    const taskDate = new Date(user.taskDate);
    const taskDateYYYYMM = taskDate.getFullYear() + taskDate.getMonth();
    if (contractId === 'new' || useStartDateYYYYMM === taskDateYYYYMM) {
      if (Number(useStartDate.getDay()) <= 24) {
        const contractPeriodStartDate = useStartDate;
        contractPeriodStartDate.setMonth(
          contractPeriodStartDate.getMonth() + 1
        );
        contractPeriodStartDate.setDate(1);
        row.contractPeriodStartDate =
          contractPeriodStartDate.toLocaleDateString();

        const contractPeriodEndDate = useStartDate;
        contractPeriodEndDate.setFullYear(
          contractPeriodEndDate.getFullYear() + 1
        );
        contractPeriodEndDate.setMonth(contractPeriodEndDate.getMonth() + 1);
        contractPeriodEndDate.setDate(0);
        row.contractPeriodEndDate = contractPeriodEndDate.toLocaleDateString();
        row.contractPeriodDate =
          contractPeriodStartDate.toLocaleDateString() +
          '　~　' +
          contractPeriodEndDate.toLocaleDateString();
      }
      if (Number(useStartDate.getDay()) >= 25) {
        const contractPeriodStartDate = useStartDate;
        contractPeriodStartDate.setMonth(
          contractPeriodStartDate.getMonth() + 2
        );
        contractPeriodStartDate.setDate(1);
        row.contractPeriodStartDate =
          contractPeriodStartDate.toLocaleDateString();

        const contractPeriodEndDate = useStartDate;
        contractPeriodEndDate.setFullYear(
          contractPeriodEndDate.getFullYear() + 2
        );
        contractPeriodEndDate.setMonth(contractPeriodEndDate.getMonth() + 1);
        contractPeriodEndDate.setDate(0);
        row.contractPeriodEndDate = contractPeriodEndDate.toLocaleDateString();
        row.contractPeriodDate =
          contractPeriodStartDate.toLocaleDateString() +
          '　~　' +
          contractPeriodEndDate.toLocaleDateString();
      }
    }
  };

  /**
   * 基本値引値増変更時のイベントハンドラ
   */
  const onIndividualContractSettingBasicDiscountPriceRowValueChange = (
    row: any
  ) => {
    const newIndividualContractSettingBasicDiscountPriceRow: individualContractSettingBasicDiscountPriceRowModel[] =
      [];
    individualContractSettingBasicDiscountPriceRow.map((x, idx) => {
      if (x.id !== row.id)
        newIndividualContractSettingBasicDiscountPriceRow.push(x);
      if (x.id === row.id) {
        const basicDiscountInfo = campaignInfo.basicDiscountIncreaseList.find(
          (f) => f.campaignCode === row.campaignCode
        );
        if (basicDiscountInfo === undefined) return;
        const periodStartDate = new Date(
          basicDiscountInfo.periodStartDate
        ).toLocaleDateString();
        const periodEndDate = new Date(
          basicDiscountInfo.periodEndDate
        ).toLocaleDateString();
        const periodDate =
          basicDiscountInfo.periodStartDate !== ''
            ? periodStartDate + '　~　' + periodEndDate
            : basicDiscountInfo.contractMonths !== null
            ? '契約から' + basicDiscountInfo.contractMonths + 'ヶ月'
            : '';
        newIndividualContractSettingBasicDiscountPriceRow.push({
          id: idx.toString(),
          enableFlag: '',
          campaignCode: basicDiscountInfo.campaignCode,
          campaignName: basicDiscountInfo.campaignName,
          feeKind: basicDiscountInfo.feeKind,
          Price:
            basicDiscountInfo.discountPriceKind +
            '　' +
            basicDiscountInfo.discountPrice,
          discountPriceKind: basicDiscountInfo.discountPriceKind,
          discountPrice: Number(basicDiscountInfo.discountPrice),
          courseId: basicDiscountInfo.setTargetCourseId,
          courseName: basicDiscountInfo.courseName,
          oneCountExclusionFlag:
            basicDiscountInfo.oneCountExclusionFlag === undefined
              ? false
              : basicDiscountInfo.oneCountExclusionFlag
              ? true
              : undefined,
          contractCount:
            basicDiscountInfo.contractCountMin +
            '以上　' +
            basicDiscountInfo.contractCountMax +
            '未満',
          contractCountMin: basicDiscountInfo.contractCountMin,
          contractCountMax: basicDiscountInfo.contractCountMax,
          periodDate: periodDate,
          periodStartDate: basicDiscountInfo.periodStartDate,
          periodEndDate: basicDiscountInfo.periodEndDate,
          contractMonths: Number(basicDiscountInfo.contractMonths),
        });
      }
    });
    setIndividualContractSettingBasicDiscountPriceRow(
      newIndividualContractSettingBasicDiscountPriceRow
    );
  };

  /**
   * オプション値引値増変更時のイベントハンドラ
   */
  const onIndividualContractSettingOptionDiscountPriceRowValueChange = (
    row: any
  ) => {
    const newIndividualContractSettingOptionDiscountPriceRow: individualContractSettingOptionDiscountPriceRowModel[] =
      [];
    individualContractSettingOptionDiscountPriceRow.map((x, idx) => {
      if (x.id !== row.id)
        newIndividualContractSettingOptionDiscountPriceRow.push(x);
      if (x.id === row.id) {
        const optionDiscountInfo = campaignInfo.optionDiscountIncreaseList.find(
          (f) => f.campaignCode === row.campaignCode
        );
        if (optionDiscountInfo === undefined) return;
        const periodStartDate = new Date(
          optionDiscountInfo.periodStartDate
        ).toLocaleDateString();
        const periodEndDate = new Date(
          optionDiscountInfo.periodEndDate
        ).toLocaleDateString();
        const periodDate =
          optionDiscountInfo.periodStartDate !== ''
            ? periodStartDate + '　~　' + periodEndDate
            : optionDiscountInfo.contractMonths !== null
            ? '契約から' + optionDiscountInfo.contractMonths + 'ヶ月'
            : '';
        newIndividualContractSettingOptionDiscountPriceRow.push({
          id: idx.toString(),
          enableFlag: '',
          campaignCode: optionDiscountInfo.campaignCode,
          campaignName: optionDiscountInfo.campaignName,
          feeKind: optionDiscountInfo.feeKind,
          Price:
            optionDiscountInfo.discountPriceKind +
            '　' +
            optionDiscountInfo.discountPrice,
          discountPriceKind: optionDiscountInfo.discountPriceKind,
          discountPrice: Number(optionDiscountInfo.discountPrice),
          serviceId: optionDiscountInfo.serviceId,
          serviceName: optionDiscountInfo.serviceName,
          oneCountExclusionFlag:
            optionDiscountInfo.oneCountExclusionFlag === undefined
              ? false
              : optionDiscountInfo.oneCountExclusionFlag
              ? true
              : undefined,
          contractCount:
            optionDiscountInfo.contractCountMin +
            '以上　' +
            optionDiscountInfo.contractCountMax +
            '未満',
          contractCountMin: optionDiscountInfo.contractCountMin,
          contractCountMax: optionDiscountInfo.contractCountMax,
          periodDate: periodDate,
          periodStartDate: optionDiscountInfo.periodStartDate,
          periodEndDate: optionDiscountInfo.periodEndDate,
          contractMonths: Number(optionDiscountInfo.contractMonths),
        });
      }
    });
    setIndividualContractSettingOptionDiscountPriceRow(
      newIndividualContractSettingOptionDiscountPriceRow
    );
  };

  /**
   * ＋ボタンクリック時のイベントハンドラ
   */
  const onClickAddIcon = (
    optionInfomationRow: optionInfomationRowModel[],
    id: string
  ) => {
    const newOptionInfomationRow: optionInfomationRowModel[] = [];
    let idx = 0;
    let val: optionInfomationRowModel = {
      id: '',
      optionEntryKind: '',
      serviceId: '',
      serviceName: '',
      contractOptionNumber: 0,
      contractCount: 0,
      useStartDate: '',
      contractPeriodDate: '',
      contractPeriodStartDate: '',
      contractPeriodEndDate: '',
      recessPeriodDate: [],
      leavingDate: '',
      useOptionServiceId: '',
      useOptionService: '',
      targetedServiceKind: '',
      recessLeavingReasonKind: '',
    };
    let newVal: optionInfomationRowModel = {
      id: '',
      optionEntryKind: '',
      serviceId: '',
      serviceName: '',
      contractOptionNumber: 0,
      contractCount: 0,
      useStartDate: '',
      contractPeriodDate: '',
      contractPeriodStartDate: '',
      contractPeriodEndDate: '',
      recessPeriodDate: [],
      leavingDate: '',
      useOptionServiceId: '',
      useOptionService: '',
      targetedServiceKind: '',
      recessLeavingReasonKind: '',
    };
    optionInfomationRow.map((x) => {
      val = Object.assign({}, x);
      val.id = idx.toString();
      newOptionInfomationRow.push(val);
      idx++;
      if (val.id === id) {
        newVal = Object.assign({}, x);
        newVal.id = idx.toString();
        newOptionInfomationRow.push(newVal);
        idx++;
      }
    });
    setOptionInfomationRow(newOptionInfomationRow);

    // オプション情報＋ボタン設定
    optionInfomationColumns[10].renderCell = (
      params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
    ) => {
      if (
        params.row.optionEntryKind === '参加' ||
        params.row.optionEntryKind === '脱会'
      ) {
        if (isReadOnly[0]) {
          return;
        }
        return (
          <AddIconButton
            onClick={() =>
              onClickAddIcon(newOptionInfomationRow, params.row.id)
            }
          />
        );
      }
      return;
    };
  };

  /**
   * コース情報の活性非活性
   */
  const courseInfomationRowGetCellDisabled = (
    params: any,
    flag?: boolean
  ): boolean => {
    if (params.row.courseEntryKind === '3') {
      if (params.field === 'leavingDate') return true;
    }
    if (
      params.row.courseEntryKind === '1' ||
      params.row.courseEntryKind === '7'
    ) {
      if (params.field === 'recessPeriodDate') return true;
      if (params.field === 'leavingDate') return true;
    }
    if (
      params.row.courseEntryKind === '2' ||
      params.row.courseEntryKind === '4' ||
      params.row.courseEntryKind === '5' ||
      params.row.courseEntryKind === '6'
    ) {
      if (params.field === 'recessPeriodDate') return true;
    }
    if (!flag) {
      if (params.field === 'recessLeavingReasonKind') return true;
    }
    return false;
  };

  /**
   * 基本値引値増の＋ボタンクリック時のイベントハンドラ
   */
  const onClickIndividualContractSettingBasicDiscountPriceRowAddIcon = () => {
    const newIndividualContractSettingBasicDiscountPriceRow: individualContractSettingBasicDiscountPriceRowModel[] =
      Object.assign([], individualContractSettingBasicDiscountPriceRow);
    if (newIndividualContractSettingBasicDiscountPriceRow.length === 10) return;
    const basicDiscountInfo = campaignInfo.basicDiscountIncreaseList[0];
    const periodStartDate = new Date(
      basicDiscountInfo.periodStartDate
    ).toLocaleDateString();
    const periodEndDate = new Date(
      basicDiscountInfo.periodEndDate
    ).toLocaleDateString();
    const periodDate =
      basicDiscountInfo.periodStartDate !== ''
        ? periodStartDate + '　~　' + periodEndDate
        : basicDiscountInfo.contractMonths !== null
        ? '契約から' + basicDiscountInfo.contractMonths + 'ヶ月'
        : '';
    newIndividualContractSettingBasicDiscountPriceRow.push({
      id: newIndividualContractSettingBasicDiscountPriceRow.length.toString(),
      enableFlag: '',
      campaignCode: basicDiscountInfo.campaignCode,
      campaignName: basicDiscountInfo.campaignName,
      feeKind: basicDiscountInfo.feeKind,
      Price:
        basicDiscountInfo.discountPriceKind +
        '　' +
        basicDiscountInfo.discountPrice,
      discountPriceKind: basicDiscountInfo.discountPriceKind,
      discountPrice: Number(basicDiscountInfo.discountPrice),
      courseId: basicDiscountInfo.setTargetCourseId,
      courseName: basicDiscountInfo.courseName,
      oneCountExclusionFlag: basicDiscountInfo.oneCountExclusionFlag
        ? true
        : undefined,
      contractCount:
        basicDiscountInfo.contractCountMin +
        '以上　' +
        basicDiscountInfo.contractCountMax +
        '未満',
      contractCountMin: basicDiscountInfo.contractCountMin,
      contractCountMax: basicDiscountInfo.contractCountMax,
      periodDate: periodDate,
      periodStartDate: basicDiscountInfo.periodStartDate,
      periodEndDate: basicDiscountInfo.periodEndDate,
      contractMonths: Number(basicDiscountInfo.contractMonths),
    });
    setIndividualContractSettingBasicDiscountPriceRow(
      newIndividualContractSettingBasicDiscountPriceRow
    );
  };

  /**
   * オプション値引値増の＋ボタンクリック時のイベントハンドラ
   */
  const onClickIndividualContractSettingOptionDiscountPriceRowAddIcon = () => {
    const newIndividualContractSettingOptionDiscountPriceRow: individualContractSettingOptionDiscountPriceRowModel[] =
      Object.assign([], individualContractSettingOptionDiscountPriceRow);
    if (newIndividualContractSettingOptionDiscountPriceRow.length === 10)
      return;
    const optionDiscountInfo = campaignInfo.optionDiscountIncreaseList[0];
    const periodStartDate = new Date(
      optionDiscountInfo.periodStartDate
    ).toLocaleDateString();
    const periodEndDate = new Date(
      optionDiscountInfo.periodEndDate
    ).toLocaleDateString();
    const periodDate =
      optionDiscountInfo.periodStartDate !== ''
        ? periodStartDate + '　~　' + periodEndDate
        : optionDiscountInfo.contractMonths !== null
        ? '契約から' + optionDiscountInfo.contractMonths + 'ヶ月'
        : '';
    newIndividualContractSettingOptionDiscountPriceRow.push({
      id: newIndividualContractSettingOptionDiscountPriceRow.length.toString(),
      enableFlag: '',
      campaignCode: optionDiscountInfo.campaignCode,
      campaignName: optionDiscountInfo.campaignName,
      feeKind: optionDiscountInfo.feeKind,
      Price:
        optionDiscountInfo.discountPriceKind +
        '　' +
        optionDiscountInfo.discountPrice,
      discountPriceKind: optionDiscountInfo.discountPriceKind,
      discountPrice: Number(optionDiscountInfo.discountPrice),
      serviceId: optionDiscountInfo.serviceId,
      serviceName: optionDiscountInfo.serviceName,
      oneCountExclusionFlag: optionDiscountInfo.oneCountExclusionFlag
        ? true
        : undefined,
      contractCount:
        optionDiscountInfo.contractCountMin +
        '以上　' +
        optionDiscountInfo.contractCountMax +
        '未満',
      contractCountMin: optionDiscountInfo.contractCountMin,
      contractCountMax: optionDiscountInfo.contractCountMax,
      periodDate: periodDate,
      periodStartDate: optionDiscountInfo.periodStartDate,
      periodEndDate: optionDiscountInfo.periodEndDate,
      contractMonths: Number(optionDiscountInfo.contractMonths),
    });
    setIndividualContractSettingOptionDiscountPriceRow(
      newIndividualContractSettingOptionDiscountPriceRow
    );
  };

  /**
   * オプション情報の活性非活性
   */
  const optionInfomationRowGetCellDisabled = (
    params: any,
    flag?: boolean
  ): boolean => {
    if (params.row.recessPeriodDate[0] === '') {
      if (params.field === 'recessLeavingReasonKind') return true;
    }
    if (params.row.leavingDate === '') {
      if (params.field === 'recessLeavingReasonKind') return true;
    }
    return false;
  };

  /**
   * 更新ボタンクリック時のイベントハンドラ
   */
  const handleUpdateClick = async () => {
    // 会費値引値増金額の算出
    const error = [];
    // キャンペーンコード重複チェック
    const campaignCodeList: string[] = [];
    for (const x of individualContractSettingBasicDiscountPriceRow) {
      if (campaignCodeList.indexOf(x.campaignCode) !== -1) {
        error.push('MSG-FR-ERR-00087' + 'キャンペーンコードが重複しています');
        break;
      }
      campaignCodeList.push(x.campaignCode);
    }
    if (error.length === 0) {
      for (const x of individualContractSettingOptionDiscountPriceRow) {
        if (campaignCodeList.indexOf(x.campaignCode) !== -1) {
          error.push('MSG-FR-ERR-00087' + 'キャンペーンコードが重複しています');
          break;
        }
        campaignCodeList.push(x.campaignCode);
      }
    }

    // 会費値引値増有効チェック
    const inputCheckBillingInfoRequest =
      convertFromInputCheckBillingInfoRequest(
        getValues(),
        contractId === undefined ? '' : contractId,
        corporationId === undefined ? '' : corporationId,
        user.taskDate,
        courseInfomationRow,
        optionInfomationRow,
        individualCourseSettingBasicDiscountPriceRow,
        individualCourseSettingOptionDiscountPriceRow,
        individualContractSettingBasicDiscountPriceRow,
        individualContractSettingOptionDiscountPriceRow
      );
    const inputCheckBillingInfoResponse = await ScrMem0014InputCheckBillingInfo(
      inputCheckBillingInfoRequest
    );

    // コース個別設定・基本値引値増行への変換
    const inputCheckBillingInfoIndividualCourseSettingBasicDiscountPriceRow =
      convertToInputCheckBillingInfoIndividualCourseSettingBasicDiscountPriceRow(
        inputCheckBillingInfoResponse
      );
    setIndividualCourseSettingBasicDiscountPriceRow(
      inputCheckBillingInfoIndividualCourseSettingBasicDiscountPriceRow
    );

    // コース個別設定・オプション値引値増行への変換
    const inputCheckBillingInfoIndividualCourseSettingOptionDiscountPriceRow =
      convertToInputCheckBillingInfoIndividualCourseSettingOptionDiscountPriceRow(
        inputCheckBillingInfoResponse
      );
    setIndividualCourseSettingOptionDiscountPriceRow(
      inputCheckBillingInfoIndividualCourseSettingOptionDiscountPriceRow
    );

    // 契約個別設定・基本値引値増値増行への変換
    const inputCheckBillingInfoIndividualContractSettingBasicDiscountPriceRow =
      convertToInputCheckBillingInfoIndividualContractSettingBasicDiscountPriceRow(
        inputCheckBillingInfoResponse
      );
    setIndividualContractSettingBasicDiscountPriceRow(
      inputCheckBillingInfoIndividualContractSettingBasicDiscountPriceRow
    );

    // 契約個別設定・オプション値引値増行への変換
    const inputCheckBillingInfoIndividualContractSettingOptionDiscountPriceRow =
      convertToInputCheckBillingInfoIndividualContractSettingOptionDiscountPriceRow(
        inputCheckBillingInfoResponse
      );
    setIndividualContractSettingOptionDiscountPriceRow(
      inputCheckBillingInfoIndividualContractSettingOptionDiscountPriceRow
    );

    // 会費値引値増金額算出
    const calculateAmountMembershipfeediscountincreaseRequest =
      convertFromUpdateCalculateAmountMembershipfeediscountincreaseRequest(
        getValues(),
        courseInfomationRow,
        optionInfomationRow,
        inputCheckBillingInfoIndividualCourseSettingBasicDiscountPriceRow,
        inputCheckBillingInfoIndividualCourseSettingOptionDiscountPriceRow,
        inputCheckBillingInfoIndividualContractSettingBasicDiscountPriceRow,
        inputCheckBillingInfoIndividualContractSettingOptionDiscountPriceRow
      );
    const calculateAmountMembershipfeediscountincreaseResponse =
      await ScrMem0014CalculateAmountMembershipfeediscountincrease(
        calculateAmountMembershipfeediscountincreaseRequest
      );

    // 最終値引値増金額行への変換
    setFinalFeeDiscountRow(
      convertToFinalFeeDiscountRow(
        calculateAmountMembershipfeediscountincreaseResponse
      )
    );
    // 値引値増適用前 料金表コース行への変換
    setBeforeFeeDiscountRow(
      convertToBeforeFeeDiscountRow(
        calculateAmountMembershipfeediscountincreaseResponse
      )
    );
    // 値引値増適用前 料金表オプション行への変換
    setBeforeOptionInfoRow(
      convertToBeforeOptionInfoRow(
        calculateAmountMembershipfeediscountincreaseResponse
      )
    );
    // 値引値増適用後 料金表コース行への変換
    setAfterFeeDiscountRow(
      convertToAfterFeeDiscountRow(
        calculateAmountMembershipfeediscountincreaseResponse
      )
    );
    // 値引値増適用後 料金表オプション行への変換
    setAfterOptionInfoRow(
      convertToAfterOptionInfoRow(
        calculateAmountMembershipfeediscountincreaseResponse
      )
    );
    setConfirmButtonDisable(true);
  };

  const handleGetCellReadonly = (params: any) => {
    if (params.field === 'useOptionService') {
      if (
        params.row.useStartDate !== '' &&
        (params.row.optionEntryKind === '参加' ||
          params.row.optionEntryKind === '売りのみ' ||
          params.row.optionEntryKind === '休会' ||
          params.row.optionEntryKind === '締結待ち')
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          {/* サービス基本情報セクション */}
          <Section name='サービス基本情報' fitInside={true}>
            <RowStack>
              <ColStack>
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'コース情報'}</Typography>
                  </LabelStack>
                  <DataGrid
                    columns={courseInfomationColumns}
                    rows={courseInfomationRow}
                    resolver={courseInfomationValidationSchema}
                    onRowValueChange={(row) =>
                      onCourseInfomationRowValueChange(row)
                    }
                    getCellDisabled={courseInfomationRowGetCellDisabled}
                    disabled={isReadOnly[0]}
                  />
                </ContentsBox>
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'基本サービス情報'}</Typography>
                  </LabelStack>
                  <DataGrid
                    columns={baseServiceInfomationColumns}
                    rows={baseServiceInfomationRow}
                    resolver={baseServiceInfomationValidationSchema}
                    disabled={isReadOnly[0]}
                  />
                </ContentsBox>
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'オプション情報'}</Typography>
                  </LabelStack>
                  <DataGrid
                    columns={optionInfomationColumns}
                    rows={optionInfomationRow}
                    resolver={optionInfomationValidationSchema}
                    onRowValueChange={(row) =>
                      onOptionInfomationRowValueChange(row)
                    }
                    getCellDisabled={optionInfomationRowGetCellDisabled}
                    getCellReadonly={handleGetCellReadonly}
                    disabled={isReadOnly[0]}
                    apiRef={apiRef}
                  />
                </ContentsBox>
              </ColStack>
            </RowStack>
          </Section>
          {/* サービス固有情報セクション */}
          {isServiceInfoDisabled ? (
            ''
          ) : (
            <Section name='サービス固有情報'>
              <FormProvider {...methods}>
                <RowStack>
                  <ColStack>
                    {/* 《オートバンクシステム》 */}
                    <MarginBox justifyContent='left' mt={3}>
                      <CaptionLabel text='《オートバンクシステム》' />
                    </MarginBox>
                    <RowStack mb>
                      <ColStack>
                        <RowStack>
                          <ColStack>
                            <Select
                              label='端末契約ID'
                              name='autobankSystemTerminalContractId'
                              selectValues={
                                selectValues.terminalContractIdSelectValues
                              }
                              size='s'
                              blankOption
                            />
                          </ColStack>
                          <ColStack>
                            <Radio
                              label='認定証発行jpg'
                              name='autobankSystemCertificateIssuanceJpgFlag'
                              radioValues={[
                                { value: '1', displayValue: '参加' },
                                { value: '0', displayValue: '非参加' },
                              ]}
                            />
                          </ColStack>
                          <ColStack>
                            <Radio
                              label='NAVI取引区分'
                              name='autobankSystemNaviDealKind'
                              radioValues={[
                                { value: '1', displayValue: '参加' },
                                { value: '0', displayValue: '不参加' },
                              ]}
                            />
                          </ColStack>
                          <ColStack>
                            <Radio
                              label='NAVI特選車参加区分'
                              name='autobankSystemNaviChoiceEntryKind'
                              radioValues={[
                                { value: '1', displayValue: '参加' },
                                { value: '0', displayValue: '不参加' },
                              ]}
                            />
                          </ColStack>
                          <ColStack>
                            <TextField
                              label='在庫グループ'
                              name='autobankSystemStockGroup'
                              size='s'
                            />
                          </ColStack>
                          <ColStack>
                            <Select
                              label='aB提供サービス'
                              name='autobankSystemAbOfferServiceKind'
                              selectValues={
                                selectValues.serviceKindSelectValues
                              }
                              size='s'
                              blankOption
                            />
                          </ColStack>
                        </RowStack>
                        <RowStack>
                          <ColStack>
                            <TextField
                              label='サービスIDメモ'
                              name='autobankSystemServiceMemo'
                              size='l'
                            />
                          </ColStack>
                          <ColStack>
                            <TextField
                              label='設置完了日'
                              name='autobankSystemInstallationCompletionDate'
                              size='s'
                            />
                          </ColStack>
                        </RowStack>
                      </ColStack>
                    </RowStack>
                    {/* 《コラボ》 */}
                    <MarginBox justifyContent='left' mt={3}>
                      <CaptionLabel text='《コラボ》' />
                    </MarginBox>
                    <RowStack>
                      <ColStack>
                        <Radio
                          label='コラボ共通区分'
                          name='collaborationCommonKind'
                          radioValues={[
                            { value: '1', displayValue: 'コラボ会員' },
                            { value: '0', displayValue: '共通会員' },
                          ]}
                        />
                      </ColStack>
                    </RowStack>
                    {/* 《i-moto-auc》 */}
                    <MarginBox justifyContent='left' mt={3}>
                      <CaptionLabel text='《i-moto-auc》' />
                    </MarginBox>
                    <RowStack>
                      <ColStack>
                        <Select
                          label='会員区分'
                          name='imotoaucMemberKind'
                          selectValues={selectValues.memberKindSelectValues}
                          size='s'
                          blankOption
                        />
                      </ColStack>
                      <ColStack>
                        <Select
                          label='参加区分'
                          name='imotoaucEntryKind'
                          selectValues={selectValues.entryKindSelectValues}
                          size='s'
                          blankOption
                        />
                      </ColStack>
                      <ColStack>
                        <Select
                          label='メール送信F'
                          name='imotoaucMailSendKind'
                          selectValues={selectValues.mailSendKindSelectValues}
                          size='s'
                          blankOption
                        />
                      </ColStack>
                      <ColStack>
                        <Select
                          label='DM送信F'
                          name='imotoaucDmSendKind'
                          selectValues={selectValues.dmSendKindSelectValues}
                          size='s'
                          blankOption
                        />
                      </ColStack>
                      <ColStack>
                        <TextField
                          label='契約数'
                          name='imotoaucContractCount'
                          size='s'
                        />
                      </ColStack>
                    </RowStack>
                    {/* 《i-auc》 */}
                    <MarginBox justifyContent='left' mt={3}>
                      <CaptionLabel text='《i-auc》' />
                    </MarginBox>
                    <RowStack>
                      <ColStack>
                        <TextField
                          label='アイオーク管理番号'
                          name='iaucManagementNumber'
                          size='s'
                        />
                      </ColStack>
                    </RowStack>
                    {/* 《CS》 */}
                    <MarginBox justifyContent='left' mt={3}>
                      <CaptionLabel text='《CS》' />
                    </MarginBox>
                    <RowStack>
                      <ColStack>
                        <Select
                          label='カーセンサー営業区分'
                          name='carsensorSalesKind'
                          selectValues={selectValues.carsensorKindSelectValues}
                          size='s'
                          blankOption
                        />
                      </ColStack>
                      <ColStack>
                        <Select
                          label='AUCCS区分'
                          name='carsensorAucCsKind'
                          selectValues={selectValues.aucCsKindSelectValues}
                          size='s'
                          blankOption
                        />
                      </ColStack>
                    </RowStack>
                    {/* 《業務支援用ID/登録用業務支援用ID》 */}
                    <MarginBox justifyContent='left' mt={3}>
                      <CaptionLabel text='《業務支援用ID/登録用業務支援用ID》' />
                    </MarginBox>
                    <RowStack>
                      <ColStack>
                        <TextField
                          label='業務支援用管理番号'
                          name='supportManagementNumber'
                          size='s'
                        />
                      </ColStack>
                    </RowStack>
                    {/* 《ランマート》 */}
                    <MarginBox justifyContent='left' mt={3} mb={5}>
                      <CaptionLabel text='《ランマート》' />
                    </MarginBox>
                    <RowStack>
                      <ColStack>
                        <Select
                          label='ランマート取引区分'
                          name='runmartDealKind'
                          selectValues={selectValues.dealKindSelectValues}
                          size='s'
                          blankOption
                        />
                      </ColStack>
                      <ColStack>
                        <TextField
                          label='ランマート共有情報'
                          name='runmartShareInformation'
                          size='l'
                        />
                      </ColStack>
                    </RowStack>
                  </ColStack>
                </RowStack>
              </FormProvider>
            </Section>
          )}
          {/* 会費値引値増セクション */}
          <Section name='会費値引値増' fitInside={true}>
            <RowStack>
              <ColStack>
                <PrimaryButton
                  disable={isReadOnly[0]}
                  onClick={handleUpdateClick}
                >
                  更新
                </PrimaryButton>
                <FormProvider {...methods}>
                  <Checkbox name='courseTypeSetting' label='コース個別設定' />
                </FormProvider>
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'基本値引値増'}</Typography>
                  </LabelStack>
                  <DataGrid
                    columns={individualCourseSettingBasicDiscountPriceColumns}
                    rows={individualCourseSettingBasicDiscountPriceRow}
                    disabled={isReadOnly[0]}
                  />
                </ContentsBox>
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'オプション値引値増'}</Typography>
                  </LabelStack>
                  <DataGrid
                    columns={individualCourseSettingOptionDiscountPriceColumns}
                    rows={individualCourseSettingOptionDiscountPriceRow}
                    disabled={isReadOnly[0]}
                  />
                </ContentsBox>
                <CaptionLabel text='契約個別設定' />
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'基本値引値増'}</Typography>
                  </LabelStack>
                  <RowStack>
                    <ColStack>
                      <DataGrid
                        columns={
                          individualContractSettingBasicDiscountPriceColumns
                        }
                        rows={individualContractSettingBasicDiscountPriceRow}
                        disabled={isReadOnly[0]}
                        onRowValueChange={(row) =>
                          onIndividualContractSettingBasicDiscountPriceRowValueChange(
                            row
                          )
                        }
                      />
                    </ColStack>
                    <ColStack>
                      {isReadOnly[0] ? (
                        ''
                      ) : (
                        <AddIconButton
                          onClick={
                            onClickIndividualContractSettingBasicDiscountPriceRowAddIcon
                          }
                        />
                      )}
                    </ColStack>
                  </RowStack>
                </ContentsBox>
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'オプション値引値増'}</Typography>
                  </LabelStack>
                  <RowStack>
                    <ColStack>
                      <DataGrid
                        columns={
                          individualContractSettingOptionDiscountPriceColumns
                        }
                        rows={individualContractSettingOptionDiscountPriceRow}
                        disabled={isReadOnly[0]}
                        onRowValueChange={(row) =>
                          onIndividualContractSettingOptionDiscountPriceRowValueChange(
                            row
                          )
                        }
                      />
                    </ColStack>
                    <ColStack>
                      {isReadOnly[0] ? (
                        ''
                      ) : (
                        <AddIconButton
                          onClick={
                            onClickIndividualContractSettingOptionDiscountPriceRowAddIcon
                          }
                        />
                      )}
                    </ColStack>
                  </RowStack>
                </ContentsBox>
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'《最終値引値増金額》'}</Typography>
                  </LabelStack>
                  <DataGrid
                    columns={finalFeeDiscountColumns}
                    rows={finalFeeDiscountRow}
                  />
                </ContentsBox>
                <RowStack>
                  <ColStack>
                    <ContentsBox transparent={true}>
                      <LabelStack>
                        <Typography bold>{'値引値増適用前　料金表'}</Typography>
                      </LabelStack>
                      <DataGrid
                        columns={feeDiscountColumns}
                        rows={beforeFeeDiscountRow}
                      />
                    </ContentsBox>
                    <DataGrid
                      columns={optionInfoColumns}
                      rows={beforeOptionInfoRow}
                    />
                  </ColStack>
                  <ColStack>
                    <ContentsBox transparent={true}>
                      <LabelStack>
                        <Typography bold>{'値引値増適用後　料金表'}</Typography>
                      </LabelStack>
                      <DataGrid
                        columns={feeDiscountColumns}
                        rows={afterFeeDiscountRow}
                      />
                    </ContentsBox>
                    <DataGrid
                      columns={optionInfoColumns}
                      rows={afterOptionInfoRow}
                    />
                  </ColStack>
                </RowStack>
              </ColStack>
            </RowStack>
          </Section>
          {/* 手数料値引値増セクション */}
          <Section name='手数料値引値増'>
            <RowStack>
              <FormProvider {...methods}>
                <ColStack>
                  <CaptionLabel text='コース個別設定' />
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='値引値増'
                        name='packName'
                        readonly
                        size='s'
                      />
                    </ColStack>
                    <ColStack>
                      <FromTo label='期間' size='m'>
                        <TextField
                          name='validityPeriodStartDate'
                          labelPosition='side'
                          readonly
                          size='s'
                        />
                        <TextField
                          name='validityPeriodEndDate'
                          labelPosition='side'
                          readonly
                          size='s'
                        />
                      </FromTo>
                    </ColStack>
                  </RowStack>
                </ColStack>
              </FormProvider>
              <ColStack>
                <CaptionLabel text='会員個別設定' />
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'四輪'}</Typography>
                  </LabelStack>
                  <DataGrid
                    columns={memberTypeSettingTvaaColumns}
                    rows={memberTypeSettingTvaaRow}
                    disabled={isReadOnly[0]}
                  />
                </ContentsBox>
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'二輪'}</Typography>
                  </LabelStack>
                  <DataGrid
                    columns={memberTypeSettingBikeColumns}
                    rows={memberTypeSettingBikeRow}
                    disabled={isReadOnly[0]}
                  />
                </ContentsBox>
                <ContentsBox transparent={true}>
                  <LabelStack>
                    <Typography bold>{'おまとめ'}</Typography>
                  </LabelStack>
                  <DataGrid
                    columns={memberTypeSettingOmatomeColumns}
                    rows={memberTypeSettingOmatomeRow}
                    disabled={isReadOnly[0]}
                  />
                </ContentsBox>
              </ColStack>
            </RowStack>
          </Section>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton
              disable={confirmButtonDisable ? isReadOnly[0] : false}
              onClick={handleConfirm}
            >
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {scrCom00032PopupIsOpen ? (
        <ScrCom0032Popup
          isOpen={scrCom00032PopupIsOpen}
          data={scrCom0032PopupData}
          handleRegistConfirm={handlePopupConfirm}
          handleApprovalConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      ) : (
        ''
      )}

      {/* 登録内容申請ポップアップ */}
      {scrCom00033PopupIsOpen ? (
        <ScrCom0033Popup
          isOpen={scrCom00033PopupIsOpen}
          data={scrCom0033PopupData}
          handleCancel={scrCom0033PopupHandlePopupCancel}
          handleConfirm={scrCom0033PopupHandlePopupConfirm}
        />
      ) : (
        ''
      )}

      <Dialog
        open={dialogIsOpen}
        title={'変更前コースに紐づく一部サービスが選択できなくなっています'}
        buttons={[{ name: '閉じる', onClick: () => setDialogIsOpen(false) }]}
      />
    </>
  );
};

export default ScrMem0014ServiceDiscountTab;
