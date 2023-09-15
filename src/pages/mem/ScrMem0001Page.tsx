import React, { useContext, useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0011Popup from 'pages/com/popups/ScrCom0011Popup';
import ScrCom0035Popup, {
  ScrCom0035PopupAllRegistrationDefinitionModel,
} from 'pages/com/popups/ScrCom0035Popup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { MainLayout } from 'layouts/MainLayout';
import { Section, SectionClose } from 'layouts/Section';
import { ColStack, RowStack } from 'layouts/Stack';

import {
  AddButton,
  OutputButton,
  RegisterButton,
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
import { PriceTextField, TextField } from 'controls/TextField';
import { SerchLabelText } from 'controls/Typography';

import {
  ScrCom9999getCodeManagementMasterMultiple,
  ScrCom9999GetPlaceMaster,
} from 'apis/com/ScrCom9999Api';
import {
  ScrMem0001SearchCorporations,
  ScrMem0001SearchCorporationsRequest,
  ScrMem0001SearchCorporationsResponse,
} from 'apis/mem/ScrMem0001Api';
import {
  ScrMem9999GetCorporationGroup,
  ScrMem9999OutputReport,
  ScrMem9999OutputReportRequest,
} from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

import { GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 検索条件データモデル
 */
interface SearchConditionModel {
  corporationId: string;
  corporationName: string;
  corporationGroupName: string;
  corporationEntryKinds: string[];
  representativeName: string;
  guarantorName1: string;
  guarantorName2: string;
  eligibleBusinessNumber: string;
  antiqueBusinessLicenseNumber: string;
  logisticsBaseAddressAfterMunicipalities: string;
  logisticsBaseDistrictCode: string;
  logisticsBasePhoneNumber: string;
  limitStatusKinds: string;
  courseEntryKinds: string[];
  basicsCorporationCreditAmountFrom: string;
  basicsCorporationCreditAmountTo: string;
  temporaryCreditSettingDateFrom: string;
  temporaryCreditSettingDateTo: string;
  contractId: string;
  billingId: string;
  staffDepartmentKinds: string;
  liveOptionEntryKinds: string[];
  posPutTogetherPlaceCode: string;
  posNumber: string;
  iaucManagementNumber: string;
  autobankSystemTerminalContractId: string;
  useStartDateFrom: string;
  useStartDateTo: string;
  idIssuanceDateFrom: string;
  idIssuanceDateTo: string;
  courseChangeDateFrom: string;
  courseChangeDateTo: string;
  recessPeriodStartDateFrom: string;
  recessPeriodStartDateTo: string;
  recessPeriodEndDateFrom: string;
  recessPeriodEndDateTo: string;
  leavingDateFrom: string;
  leavingDateTo: string;
  changeExpectDateFrom: string;
  changeExpectDateTo: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  corporationGroupNameSelectValues: SelectValue[];
  corporationEntryKindsSelectValues: SelectValue[];
  logisticsBaseDistrictCodeSelectValues: SelectValue[];
  limitStatusKindsSelectValues: SelectValue[];
  courseEntryKindsSelectValues: SelectValue[];
  staffDepartmentKindsSelectValues: SelectValue[];
  liveOptionEntryKindsSelectValues: SelectValue[];
  posPutTogetherPlaceCodeSelectValues: SelectValue[];
}

/**
 * 検索条件初期データ
 */
const initialValues: SearchConditionModel = {
  corporationId: '',
  corporationName: '',
  corporationGroupName: '',
  corporationEntryKinds: [],
  representativeName: '',
  guarantorName1: '',
  guarantorName2: '',
  eligibleBusinessNumber: '',
  antiqueBusinessLicenseNumber: '',
  logisticsBaseAddressAfterMunicipalities: '',
  logisticsBaseDistrictCode: '',
  logisticsBasePhoneNumber: '',
  limitStatusKinds: '',
  courseEntryKinds: [],
  basicsCorporationCreditAmountFrom: '',
  basicsCorporationCreditAmountTo: '',
  temporaryCreditSettingDateFrom: '',
  temporaryCreditSettingDateTo: '',
  contractId: '',
  billingId: '',
  staffDepartmentKinds: '',
  liveOptionEntryKinds: [],
  posPutTogetherPlaceCode: '',
  posNumber: '',
  iaucManagementNumber: '',
  autobankSystemTerminalContractId: '',
  useStartDateFrom: '',
  useStartDateTo: '',
  idIssuanceDateFrom: '',
  idIssuanceDateTo: '',
  courseChangeDateFrom: '',
  courseChangeDateTo: '',
  recessPeriodStartDateFrom: '',
  recessPeriodStartDateTo: '',
  recessPeriodEndDateFrom: '',
  recessPeriodEndDateTo: '',
  leavingDateFrom: '',
  leavingDateTo: '',
  changeExpectDateFrom: '',
  changeExpectDateTo: '',
};

/**
 * 帳票選択ポップアップの返却値
 */
interface returnValue {
  // 出力帳票選択
  reportId: string;
  reportName: string;
  reportComment: string;
  default: string;
}

/**
 * バリデーションスキーマ
 */
const corporationBasicSchama = {
  corporationId: yup.string().label('法人ID').max(8).half(),
  corporationName: yup.string().label('法人名').max(30),
  corporationGroupName: yup.string().label('法人グループ名'),
  corporationEntryKinds: yup.array().label('法人参加区分'),
  representativeName: yup.string().label('代表者名').max(30),
  guarantorName1: yup.string().label('連帯保証人名⓵').max(30),
  guarantorName2: yup.string().label('連帯保証人名⓶').max(30),
  eligibleBusinessNumber: yup.string().label('適格事業者番号').max(14).half(),
  antiqueBusinessLicenseNumber: yup.string().label('古物商許可番号').max(30),
  logisticsBaseAddressAfterMunicipalities: yup
    .string()
    .label('物流拠点住所（市区町村以降）')
    .max(80),
  logisticsBaseDistrictCode: yup.string().label('市区郡コード/市区郡名'),
  logisticsBasePhoneNumber: yup
    .string()
    .label('物流拠点TEL')
    .max(13)
    .half()
    .phone(),
  limitStatusKinds: yup.string().label('制限状況'),
  courseEntryKinds: yup.array().label('コース参加区分'),
  basicsCorporationCreditAmountFrom: yup
    .string()
    .label('基本法人与信額（FROM）')
    .max(11)
    .half()
    .numberWithComma(),
  basicsCorporationCreditAmountTo: yup
    .string()
    .label('基本法人与信額（TO）')
    .max(11)
    .half()
    .numberWithComma(),
  temporaryCreditSettingDateFrom: yup
    .string()
    .label('臨時与信設定日（FROM）')
    .max(10)
    .half()
    .date(),
  temporaryCreditSettingDateTo: yup
    .string()
    .label('臨時与信設定日（TO）')
    .max(10)
    .half()
    .date(),
  contractId: yup.string().label('契約ID').max(7).half(),
  billingId: yup.string().label('請求先ID').max(4).half(),
  staffDepartmentKinds: yup.string().label('契約種別'),
  liveOptionEntryKinds: yup.array().label('ライブ会場フラグ'),
  posPutTogetherPlaceCode: yup.string().label('会場名'),
  posNumber: yup.string().label('POS番号').max(10).half(),
  iaucManagementNumber: yup.string().label('アイオーク番号').max(7).half(),
  autobankSystemTerminalContractId: yup
    .string()
    .label('端末契約ID')
    .max(7)
    .half(),
  useStartDateFrom: yup
    .string()
    .label('利用開始日（FROM）')
    .max(10)
    .half()
    .date(),
  useStartDateTo: yup.string().label('利用開始日（TO）').max(10).half().date(),
  idIssuanceDateFrom: yup
    .string()
    .label('ID発行年月日（FROM）')
    .max(10)
    .half()
    .date(),
  idIssuanceDateTo: yup
    .string()
    .label('ID発行年月日（TO）')
    .max(10)
    .half()
    .date(),
  courseChangeDateFrom: yup
    .string()
    .label('コース変更日（FROM）')
    .max(10)
    .half()
    .date(),
  courseChangeDateTo: yup
    .string()
    .label('コース変更日（TO）')
    .max(10)
    .half()
    .date(),
  recessPeriodStartDateFrom: yup
    .string()
    .label('休会期間FROM（FROM）')
    .max(10)
    .half()
    .date(),
  recessPeriodStartDateTo: yup
    .string()
    .label('休会期間FROM（TO）')
    .max(10)
    .half()
    .date(),
  recessPeriodEndDateFrom: yup
    .string()
    .label('休会期間TO（FROM）')
    .max(10)
    .half()
    .date(),
  recessPeriodEndDateTo: yup
    .string()
    .label('休会期間TO（TO）')
    .max(10)
    .half()
    .date(),
  leavingDateFrom: yup.string().label('脱会日（FROM）').max(10).half().date(),
  leavingDateTo: yup.string().label('脱会日（TO）').max(10).half().date(),
  changeExpectDateFrom: yup
    .string()
    .label('変更日（FROM）')
    .max(10)
    .half()
    .date(),
  changeExpectDateTo: yup.string().label('変更日（TO）').max(10).half().date(),
};

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'corporationId',
    headerName: '法人ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'corporationName',
    headerName: '法人名',
    size: 'l',
  },
  {
    field: 'corporationGroupName',
    headerName: '法人グループ名',
    size: 'l',
  },
  {
    field: 'representativeName',
    headerName: '代表者名',
    size: 'l',
  },
  {
    field: 'guarantorName1',
    headerName: '連帯保証人名⓵',
    size: 'l',
  },
  {
    field: 'guarantorName2',
    headerName: '連帯保証人名⓶',
    size: 'l',
  },
  {
    field: 'corporationEntryKinds',
    headerName: '法人参加区分',
    size: 'm',
  },
  {
    field: 'changeExpectFlagName',
    headerName: '変更予約',
    size: 's',
  },
];

/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // internalId
  id: string;
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 法人グループ名
  corporationGroupName: string;
  // 代表者名
  representativeName: string;
  // 連帯保証人名⓵
  guarantorName1: string;
  // 連帯保証人名⓶
  guarantorName2: string;
  // 法人参加区分
  corporationEntryKinds: string;
  // 変更予約
  changeExpectFlagName: string;
}

/**
 * 検索条件初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  corporationGroupNameSelectValues: [],
  corporationEntryKindsSelectValues: [],
  logisticsBaseDistrictCodeSelectValues: [],
  limitStatusKindsSelectValues: [],
  courseEntryKindsSelectValues: [],
  staffDepartmentKindsSelectValues: [],
  liveOptionEntryKindsSelectValues: [],
  posPutTogetherPlaceCodeSelectValues: [],
};

/**
 * 取込対象選択データ
 */
const allRegistrationDefinitions: ScrCom0035PopupAllRegistrationDefinitionModel[] =
  [
    {
      id: 'BRG-MEM-0001',
      label: '休脱会一括登録',
    },
    {
      id: 'BRG-MEM-0002',
      label: '与信情報一括変更',
    },
    {
      id: 'BRG-MEM-0003',
      label: '会員情報一括登録（会員リスト（基本情報））',
    },
    {
      id: 'BRG-MEM-0004',
      label: '会員情報一括登録（会員リスト（契約情報））',
    },
    {
      id: 'BRG-MEM-0005',
      label: '会員情報一括登録（物流拠点情報）',
    },
    {
      id: 'BRG-MEM-0006',
      label: 'POS番号データアップロード（新規）',
    },
    {
      id: 'BRG-MEM-0007',
      label: 'POS番号データアップロード（おまとめ）',
    },
    {
      id: 'BRG-MEM-0008',
      label: '再開一括登録',
    },
    {
      id: 'BRG-MEM-0009',
      label: '営業・検査員一括登録',
    },
  ];

/**
 * 検索条件モデルから法人情報検索APIリクエストへの変換
 */
const convertFromSearchConditionModel = (
  searchCondition: SearchConditionModel
): ScrMem0001SearchCorporationsRequest => {
  return {
    corporationId:
      searchCondition.corporationId === ''
        ? undefined
        : searchCondition.corporationId,
    corporationName:
      searchCondition.corporationName === ''
        ? undefined
        : searchCondition.corporationName,
    corporationGroupId:
      searchCondition.corporationGroupName === ''
        ? undefined
        : searchCondition.corporationGroupName,
    corporationEntryKinds:
      searchCondition.corporationEntryKinds.length === 0
        ? undefined
        : searchCondition.corporationEntryKinds,
    representativeName:
      searchCondition.representativeName === ''
        ? undefined
        : searchCondition.representativeName,
    guarantorName1:
      searchCondition.guarantorName1 === ''
        ? undefined
        : searchCondition.guarantorName1,
    guarantorName2:
      searchCondition.guarantorName2 === ''
        ? undefined
        : searchCondition.guarantorName2,
    eligibleBusinessNumber:
      searchCondition.eligibleBusinessNumber === ''
        ? undefined
        : searchCondition.eligibleBusinessNumber,
    antiqueBusinessLicenseNumber:
      searchCondition.antiqueBusinessLicenseNumber === ''
        ? undefined
        : searchCondition.antiqueBusinessLicenseNumber,
    logisticsBaseAddressAfterMunicipalities:
      searchCondition.logisticsBaseAddressAfterMunicipalities === ''
        ? undefined
        : searchCondition.logisticsBaseAddressAfterMunicipalities,
    logisticsBaseDistrictCode:
      searchCondition.logisticsBaseDistrictCode === ''
        ? undefined
        : searchCondition.logisticsBaseDistrictCode,
    logisticsBasePhoneNumber:
      searchCondition.logisticsBasePhoneNumber === ''
        ? undefined
        : searchCondition.logisticsBasePhoneNumber,
    limitStatusKinds:
      searchCondition.limitStatusKinds === ''
        ? undefined
        : searchCondition.limitStatusKinds,
    courseEntryKinds:
      searchCondition.courseEntryKinds.length === 0
        ? undefined
        : searchCondition.courseEntryKinds,
    basicsCorporationCreditAmountFrom:
      searchCondition.basicsCorporationCreditAmountFrom === ''
        ? undefined
        : searchCondition.basicsCorporationCreditAmountFrom,
    basicsCorporationCreditAmountTo:
      searchCondition.basicsCorporationCreditAmountTo === ''
        ? undefined
        : searchCondition.basicsCorporationCreditAmountTo,
    temporaryCreditSettingDateFrom:
      searchCondition.temporaryCreditSettingDateFrom === ''
        ? undefined
        : searchCondition.temporaryCreditSettingDateFrom,
    temporaryCreditSettingDateTo:
      searchCondition.temporaryCreditSettingDateTo === ''
        ? undefined
        : searchCondition.temporaryCreditSettingDateTo,
    contractId:
      searchCondition.contractId === ''
        ? undefined
        : searchCondition.contractId,
    billingId:
      searchCondition.billingId === '' ? undefined : searchCondition.billingId,
    staffDepartmentKinds:
      searchCondition.staffDepartmentKinds === ''
        ? undefined
        : searchCondition.staffDepartmentKinds,
    liveOptionEntryKinds:
      searchCondition.liveOptionEntryKinds.length === 0
        ? undefined
        : searchCondition.liveOptionEntryKinds,
    posPutTogetherPlaceCode:
      searchCondition.posPutTogetherPlaceCode === ''
        ? undefined
        : searchCondition.posPutTogetherPlaceCode,
    posNumber:
      searchCondition.posNumber === '' ? undefined : searchCondition.posNumber,
    iaucManagementNumber:
      searchCondition.iaucManagementNumber === ''
        ? undefined
        : searchCondition.iaucManagementNumber,
    autobankSystemTerminalContractId:
      searchCondition.autobankSystemTerminalContractId === ''
        ? undefined
        : searchCondition.autobankSystemTerminalContractId,
    useStartDateFrom:
      searchCondition.useStartDateFrom === ''
        ? undefined
        : searchCondition.useStartDateFrom,
    useStartDateTo:
      searchCondition.useStartDateTo === ''
        ? undefined
        : searchCondition.useStartDateTo,
    idIssuanceDateFrom:
      searchCondition.idIssuanceDateFrom === ''
        ? undefined
        : searchCondition.idIssuanceDateFrom,
    idIssuanceDateTo:
      searchCondition.idIssuanceDateTo === ''
        ? undefined
        : searchCondition.idIssuanceDateTo,
    courseChangeDateFrom:
      searchCondition.courseChangeDateFrom === ''
        ? undefined
        : searchCondition.courseChangeDateFrom,
    courseChangeDateTo:
      searchCondition.courseChangeDateTo === ''
        ? undefined
        : searchCondition.courseChangeDateTo,
    recessPeriodStartDateFrom:
      searchCondition.recessPeriodStartDateFrom === ''
        ? undefined
        : searchCondition.recessPeriodStartDateFrom,
    recessPeriodStartDateTo:
      searchCondition.recessPeriodStartDateTo === ''
        ? undefined
        : searchCondition.recessPeriodStartDateTo,
    recessPeriodEndDateFrom:
      searchCondition.recessPeriodEndDateFrom === ''
        ? undefined
        : searchCondition.recessPeriodEndDateFrom,
    recessPeriodEndDateTo:
      searchCondition.recessPeriodEndDateTo === ''
        ? undefined
        : searchCondition.recessPeriodEndDateTo,
    leavingDateFrom:
      searchCondition.leavingDateFrom === ''
        ? undefined
        : searchCondition.leavingDateFrom,
    leavingDateTo:
      searchCondition.leavingDateTo === ''
        ? undefined
        : searchCondition.leavingDateTo,
    changeExpectDateFrom:
      searchCondition.changeExpectDateFrom === ''
        ? undefined
        : searchCondition.changeExpectDateFrom,
    changeExpectDateTo:
      searchCondition.changeExpectDateTo === ''
        ? undefined
        : searchCondition.changeExpectDateTo,
    limitCount: 15000,
  };
};

/**
 * 法人情報検索APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrMem0001SearchCorporationsResponse
): SearchResultRowModel[] => {
  return response.corpInfo.map((x) => {
    return {
      id: x.corporationId,
      corporationId: x.corporationId,
      corporationName: x.corporationName,
      corporationGroupName: x.corporationGroupName,
      representativeName: x.representativeName,
      guarantorName1: x.guarantorName1,
      guarantorName2: x.guarantorName2,
      corporationEntryKinds:
        x.corporationEntryKindName === '1'
          ? '参加'
          : x.corporationEntryKindName === '2'
          ? '休会'
          : '脱会',
      changeExpectFlagName: x.changeExpectFlagName === '0' ? '' : 'あり',
    };
  });
};

/**
 * 検索条件モデルから帳票出力APIリクエストへの変換
 */
const convertFromCreateReportParameterInfo = (
  reportId: string,
  searchCondition: SearchConditionModel,
  rowSelectionModel: GridRowSelectionModel
) => {
  switch (reportId) {
    case 'REP-MEM-0001':
    case 'REP-MEM-0010':
      // 会員リスト（基本情報）
      // 与信情報リスト
      return {
        corporationIdList: rowSelectionModel.map((x) => x.toString()),
      };
    case 'REP-MEM-0002':
    case 'REP-MEM-0012':
    case 'REP-MEM-0014':
      // 会員リスト（契約情報）
      // POS情報
      // 延滞履歴一覧
      return {
        corporationIdList: rowSelectionModel.map((x) => x.toString()),
        contractId: searchCondition.contractId,
        courseEntryKindList: searchCondition.courseEntryKinds,
        billingId: searchCondition.billingId,
        staffDepartmentKind: searchCondition.staffDepartmentKinds,
        liveOptionEntryKindList: searchCondition.liveOptionEntryKinds,
        posPutTogetherPlaceCode: searchCondition.posPutTogetherPlaceCode,
        posNumber: searchCondition.posNumber,
        iaucManagementNumber: searchCondition.iaucManagementNumber,
        autobankSystemTerminalContractId:
          searchCondition.autobankSystemTerminalContractId,
        useStartDateFrom: searchCondition.useStartDateFrom,
        useStartDateTo: searchCondition.useStartDateTo,
        idIssuanceDateFrom: searchCondition.idIssuanceDateFrom,
        idIssuanceDateTo: searchCondition.idIssuanceDateTo,
        courseChangeDateFrom: searchCondition.courseChangeDateFrom,
        courseChangeDateTo: searchCondition.courseChangeDateTo,
        recessPeriodStartDateFrom: searchCondition.recessPeriodStartDateFrom,
        recessPeriodStartDateTo: searchCondition.recessPeriodStartDateTo,
        recessPeriodEndDateFrom: searchCondition.recessPeriodEndDateFrom,
        recessPeriodEndDateTo: searchCondition.recessPeriodEndDateTo,
        leavingDateFrom: searchCondition.leavingDateFrom,
        leavingDateTo: searchCondition.leavingDateTo,
      };
    case 'REP-MEM-0003':
      // 利用サービス一覧
      return {
        corporationIdList: rowSelectionModel.map((x) => x.toString()),
        contractId: searchCondition.contractId,
        logisticsBaseAddressAfterMunicipalities:
          searchCondition.logisticsBaseAddressAfterMunicipalities,
        logisticsBaseDistrictCode: searchCondition.logisticsBaseDistrictCode,
        logisticsBasePhoneNumber: searchCondition.logisticsBasePhoneNumber,
        courseEntryKindList: searchCondition.courseEntryKinds,
        billingId: searchCondition.billingId,
        staffDepartmentKind: searchCondition.staffDepartmentKinds,
        liveOptionEntryKindList: searchCondition.liveOptionEntryKinds,
        posPutTogetherPlaceCode: searchCondition.posPutTogetherPlaceCode,
        posNumber: searchCondition.posNumber,
        iaucManagementNumber: searchCondition.iaucManagementNumber,
        autobankSystemTerminalContractId:
          searchCondition.autobankSystemTerminalContractId,
        useStartDateFrom: searchCondition.useStartDateFrom,
        useStartDateTo: searchCondition.useStartDateTo,
        idIssuanceDateFrom: searchCondition.idIssuanceDateFrom,
        idIssuanceDateTo: searchCondition.idIssuanceDateTo,
        courseChangeDateFrom: searchCondition.courseChangeDateFrom,
        courseChangeDateTo: searchCondition.courseChangeDateTo,
        recessPeriodStartDateFrom: searchCondition.recessPeriodStartDateFrom,
        recessPeriodStartDateTo: searchCondition.recessPeriodStartDateTo,
        recessPeriodEndDateFrom: searchCondition.recessPeriodEndDateFrom,
        recessPeriodEndDateTo: searchCondition.recessPeriodEndDateTo,
        leavingDateFrom: searchCondition.leavingDateFrom,
        leavingDateTo: searchCondition.leavingDateTo,
      };
    case 'REP-MEM-0004':
    case 'REP-MEM-0005':
      // POS番号データ（おまとめ）
      // POS番号データ（新規）
      return {
        corporationIdList: rowSelectionModel.map((x) => x.toString()),
        contractId: searchCondition.contractId,
        billingId: searchCondition.billingId,
        staffDepartmentKind: searchCondition.staffDepartmentKinds,
        liveOptionEntryKindList: searchCondition.liveOptionEntryKinds,
        posPutTogetherPlaceCode: searchCondition.posPutTogetherPlaceCode,
        posNumber: searchCondition.posNumber,
        iaucManagementNumber: searchCondition.iaucManagementNumber,
        autobankSystemTerminalContractId:
          searchCondition.autobankSystemTerminalContractId,
        useStartDateFrom: searchCondition.useStartDateFrom,
        useStartDateTo: searchCondition.useStartDateTo,
        idIssuanceDateFrom: searchCondition.idIssuanceDateFrom,
        idIssuanceDateTo: searchCondition.idIssuanceDateTo,
        courseChangeDateFrom: searchCondition.courseChangeDateFrom,
        courseChangeDateTo: searchCondition.courseChangeDateTo,
        recessPeriodStartDateFrom: searchCondition.recessPeriodStartDateFrom,
        recessPeriodStartDateTo: searchCondition.recessPeriodStartDateTo,
        recessPeriodEndDateFrom: searchCondition.recessPeriodEndDateFrom,
        recessPeriodEndDateTo: searchCondition.recessPeriodEndDateTo,
        leavingDateFrom: searchCondition.leavingDateFrom,
        leavingDateTo: searchCondition.leavingDateTo,
      };
    case 'REP-MEM-0006':
    case 'REP-MEM-0007':
    case 'REP-MEM-0008':
      // コース変更会員リスト
      // 休脱会リスト
      // 再開リスト
      return {
        corporationIdList: rowSelectionModel.map((x) => x.toString()),
        contractId: searchCondition.contractId,
        logisticsBaseAddressAfterMunicipalities:
          searchCondition.logisticsBaseAddressAfterMunicipalities,
        logisticsBaseDistrictCode: searchCondition.logisticsBaseDistrictCode,
        logisticsBasePhoneNumber: searchCondition.logisticsBasePhoneNumber,
        courseEntryKindList: searchCondition.courseEntryKinds,
        billingId: searchCondition.billingId,
        staffDepartmentKind: searchCondition.staffDepartmentKinds,
        liveOptionEntryKindList: searchCondition.liveOptionEntryKinds,
        posPutTogetherPlaceCode: searchCondition.posPutTogetherPlaceCode,
        posNumber: searchCondition.posNumber,
        iaucManagementNumber: searchCondition.iaucManagementNumber,
        autobankSystemTerminalContractId:
          searchCondition.autobankSystemTerminalContractId,
        useStartDateFrom: searchCondition.useStartDateFrom,
        useStartDateTo: searchCondition.useStartDateTo,
        idIssuanceDateFrom: searchCondition.idIssuanceDateFrom,
        idIssuanceDateTo: searchCondition.idIssuanceDateTo,
        courseChangeDateFrom: searchCondition.courseChangeDateFrom,
        courseChangeDateTo: searchCondition.courseChangeDateTo,
        recessPeriodStartDateFrom: searchCondition.recessPeriodStartDateFrom,
        recessPeriodStartDateTo: searchCondition.recessPeriodStartDateTo,
        recessPeriodEndDateFrom: searchCondition.recessPeriodEndDateFrom,
        recessPeriodEndDateTo: searchCondition.recessPeriodEndDateTo,
        leavingDateFrom: searchCondition.leavingDateFrom,
        leavingDateTo: searchCondition.leavingDateTo,
      };
    case 'REP-MEM-0009':
      // 会員登録変更連絡
      return {
        corporationIdList: rowSelectionModel.map((x) => x.toString()),
        contractId: searchCondition.contractId,
        courseEntryKindList: searchCondition.courseEntryKinds,
        billingId: searchCondition.billingId,
        staffDepartmentKind: searchCondition.staffDepartmentKinds,
        liveOptionEntryKindList: searchCondition.liveOptionEntryKinds,
        posPutTogetherPlaceCode: searchCondition.posPutTogetherPlaceCode,
        posNumber: searchCondition.posNumber,
        iaucManagementNumber: searchCondition.iaucManagementNumber,
        autobankSystemTerminalContractId:
          searchCondition.autobankSystemTerminalContractId,
        useStartDateFrom: searchCondition.useStartDateFrom,
        useStartDateTo: searchCondition.useStartDateTo,
        idIssuanceDateFrom: searchCondition.idIssuanceDateFrom,
        idIssuanceDateTo: searchCondition.idIssuanceDateTo,
        courseChangeDateFrom: searchCondition.courseChangeDateFrom,
        courseChangeDateTo: searchCondition.courseChangeDateTo,
        recessPeriodStartDateFrom: searchCondition.recessPeriodStartDateFrom,
        recessPeriodStartDateTo: searchCondition.recessPeriodStartDateTo,
        recessPeriodEndDateFrom: searchCondition.recessPeriodEndDateFrom,
        recessPeriodEndDateTo: searchCondition.recessPeriodEndDateTo,
        leavingDateFrom: searchCondition.leavingDateFrom,
        leavingDateTo: searchCondition.leavingDateTo,
      };
    case 'REP-MEM-0011':
      // 参加制限リスト
      return {
        corporationIdList: rowSelectionModel.map((x) => x.toString()),
        contractId: searchCondition.contractId,
        logisticsBaseAddressAfterMunicipalities:
          searchCondition.logisticsBaseAddressAfterMunicipalities,
        logisticsBaseDistrictCode: searchCondition.logisticsBaseDistrictCode,
        logisticsBasePhoneNumber: searchCondition.logisticsBasePhoneNumber,
        courseEntryKindList: searchCondition.courseEntryKinds,
        billingId: searchCondition.billingId,
        staffDepartmentKind: searchCondition.staffDepartmentKinds,
        liveOptionEntryKindList: searchCondition.liveOptionEntryKinds,
        posPutTogetherPlaceCode: searchCondition.posPutTogetherPlaceCode,
        posNumber: searchCondition.posNumber,
        iaucManagementNumber: searchCondition.iaucManagementNumber,
        autobankSystemTerminalContractId:
          searchCondition.autobankSystemTerminalContractId,
        useStartDateFrom: searchCondition.useStartDateFrom,
        useStartDateTo: searchCondition.useStartDateTo,
        idIssuanceDateFrom: searchCondition.idIssuanceDateFrom,
        idIssuanceDateTo: searchCondition.idIssuanceDateTo,
        courseChangeDateFrom: searchCondition.courseChangeDateFrom,
        courseChangeDateTo: searchCondition.courseChangeDateTo,
        recessPeriodStartDateFrom: searchCondition.recessPeriodStartDateFrom,
        recessPeriodStartDateTo: searchCondition.recessPeriodStartDateTo,
        recessPeriodEndDateFrom: searchCondition.recessPeriodEndDateFrom,
        recessPeriodEndDateTo: searchCondition.recessPeriodEndDateTo,
        leavingDateFrom: searchCondition.leavingDateFrom,
        leavingDateTo: searchCondition.leavingDateTo,
      };
    case 'REP-MEM-0013':
      // 物流拠点情報
      return {
        corporationIdList: rowSelectionModel.map((x) => x.toString()),
        logisticsBaseAddressAfterMunicipalities:
          searchCondition.logisticsBaseAddressAfterMunicipalities,
        logisticsBaseDistrictCode: searchCondition.logisticsBaseDistrictCode,
        logisticsBasePhoneNumber: searchCondition.logisticsBasePhoneNumber,
      };
  }
};

type key = keyof SearchConditionModel;

const serchData: { label: string; name: key }[] = [
  { label: '法人ID', name: 'corporationId' },
  { label: '法人名', name: 'corporationName' },
  { label: '法人グループ名', name: 'corporationGroupName' },
  { label: '法人参加区分', name: 'corporationEntryKinds' },
  { label: '代表者名', name: 'representativeName' },
  { label: '連帯保証人名⓵', name: 'guarantorName1' },
  { label: '連帯保証人名⓶', name: 'guarantorName2' },
  { label: '適格事業者番号', name: 'eligibleBusinessNumber' },
  { label: '古物商許可番号', name: 'antiqueBusinessLicenseNumber' },
  {
    label: '物流拠点住所（市区町村以降）',
    name: 'logisticsBaseAddressAfterMunicipalities',
  },
  { label: '市区郡コード/市区郡名', name: 'logisticsBaseDistrictCode' },
  { label: '物流拠点TEL', name: 'logisticsBasePhoneNumber' },
  { label: '制限状況', name: 'limitStatusKinds' },
  { label: 'コース参加区分', name: 'courseEntryKinds' },
  {
    label: '基本法人与信額（FROM）',
    name: 'basicsCorporationCreditAmountFrom',
  },
  { label: '基本法人与信額（TO）', name: 'basicsCorporationCreditAmountTo' },
  { label: '臨時与信設定日（FROM）', name: 'temporaryCreditSettingDateFrom' },
  { label: '臨時与信設定日（TO）', name: 'temporaryCreditSettingDateTo' },
  { label: '契約ID', name: 'contractId' },
  { label: '請求先ID', name: 'billingId' },
  { label: '契約種別', name: 'staffDepartmentKinds' },
  { label: 'ライブ参加フラグ', name: 'liveOptionEntryKinds' },
  { label: '会場名', name: 'posPutTogetherPlaceCode' },
  { label: 'POS番号', name: 'posNumber' },
  { label: 'アイオーク番号', name: 'iaucManagementNumber' },
  { label: '端末契約ID', name: 'autobankSystemTerminalContractId' },
  { label: '利用開始日（FROM）', name: 'useStartDateFrom' },
  { label: '利用開始日（TO）', name: 'useStartDateTo' },
  { label: 'ID発行年月日（FROM）', name: 'idIssuanceDateFrom' },
  { label: 'ID発行年月日（TO）', name: 'idIssuanceDateTo' },
  { label: 'コース変更日（FROM）', name: 'courseChangeDateFrom' },
  { label: 'コース変更日（TO）', name: 'courseChangeDateTo' },
  { label: '休会期間FROM（FROM）', name: 'recessPeriodStartDateFrom' },
  { label: '休会期間FROM（TO）', name: 'recessPeriodStartDateTo' },
  { label: '休会期間TO（FROM）', name: 'recessPeriodEndDateFrom' },
  { label: '休会期間TO（TO）', name: 'recessPeriodEndDateTo' },
  { label: '脱会日（FROM）', name: 'leavingDateFrom' },
  { label: '脱会日（TO）', name: 'leavingDateTo' },
  { label: '変更日（FROM）', name: 'changeExpectDateFrom' },
  { label: '変更日（TO）', name: 'changeExpectDateTo' },
];

/**
 * SCR-MEM-0001 法人情報一覧画面
 */
const ScrMem0001Page = () => {
  // router
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { getMessage } = useContext(MessageContext);
  const sectionRef = useRef<SectionClose>();
  const apiRef = useGridApiRef();
  const maxSectionWidth =
    Number(
      apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
    ) + 40;

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const [scrCom0035PopupIsOpen, setScrCom0035PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0011PopupIsOpen, setScrCom0011PopupIsOpen] =
    useState<boolean>(false);
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [csvButtonDisable, setCsvButtonDisable] = useState<boolean>(true);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);
  // form
  const methods = useForm<SearchConditionModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(corporationBasicSchama)),
    context: isReadOnly,
  });
  const { getValues } = methods;

  // 初期表示
  useEffect(() => {
    const initialize = async () => {
      const selectValues: SelectValuesModel = selectValuesInitialValues;

      // コード管理マスタ情報取得API（複数取得）
      const getCodeManagementMasterMultipleRequest = {
        codeId: [
          'CDE-MEM-1025',
          'CDE-MEM-0004',
          'CDE-COM-0209',
          'CDE-COM-0025',
          'CDE-COM-0001',
          'CDE-COM-0033',
        ],
      };

      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );

      getCodeManagementMasterMultipleResponse.resultList.forEach((x) => {
        if (x.codeId === 'CDE-MEM-1025') {
          x.codeValueList.forEach((f) => {
            selectValues.corporationEntryKindsSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-MEM-0004') {
          x.codeValueList.forEach((f) => {
            selectValues.logisticsBaseDistrictCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0209') {
          x.codeValueList.forEach((f) => {
            selectValues.limitStatusKindsSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0025') {
          x.codeValueList.forEach((f) => {
            selectValues.courseEntryKindsSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0001') {
          x.codeValueList.forEach((f) => {
            selectValues.staffDepartmentKindsSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
        if (x.codeId === 'CDE-COM-0033') {
          x.codeValueList.forEach((f) => {
            selectValues.liveOptionEntryKindsSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 会場マスタリストボックス情報取得API
      const getPlaceMasterRequest = {
        businessDate: user.taskDate,
      };
      const getPlaceMasterResponse = await ScrCom9999GetPlaceMaster(
        getPlaceMasterRequest
      );
      getPlaceMasterResponse.placeList.forEach((x) => {
        selectValues.posPutTogetherPlaceCodeSelectValues.push({
          value: x.placeCode,
          displayValue: x.placeName,
        });
      });

      // 法人グループ取得API
      const getCorporationGroupResponse = await ScrMem9999GetCorporationGroup();
      getCorporationGroupResponse.corporationGroupList.forEach((x) => {
        selectValues.corporationGroupNameSelectValues.push({
          value: x.corporationGroupId,
          displayValue: x.corporationGroupName,
        });
      });

      setSelectValues({
        corporationEntryKindsSelectValues:
          selectValues.corporationEntryKindsSelectValues,
        logisticsBaseDistrictCodeSelectValues:
          selectValues.logisticsBaseDistrictCodeSelectValues,
        limitStatusKindsSelectValues: selectValues.limitStatusKindsSelectValues,
        courseEntryKindsSelectValues: selectValues.courseEntryKindsSelectValues,
        staffDepartmentKindsSelectValues:
          selectValues.staffDepartmentKindsSelectValues,
        liveOptionEntryKindsSelectValues:
          selectValues.liveOptionEntryKindsSelectValues,
        posPutTogetherPlaceCodeSelectValues:
          selectValues.posPutTogetherPlaceCodeSelectValues,
        corporationGroupNameSelectValues:
          selectValues.corporationGroupNameSelectValues,
      });
    };
    initialize();
  }, []);

  /**
   * 検索クリック時のイベントハンドラ
   */
  const handleSearchClick = async () => {
    if (sectionRef.current && sectionRef.current.closeSection)
      sectionRef.current.closeSection();
    // 法人情報検索API
    const request = convertFromSearchConditionModel(getValues());
    const response = await ScrMem0001SearchCorporations(request);
    const searchResult = convertToSearchResultRowModel(response);

    const hrefs: GridHrefsModel[] = [{ field: 'corporationId', hrefs: [] }];
    searchResult.forEach((x) => {
      hrefs[0].hrefs.push({
        id: x.corporationId,
        href: '/mem/corporations/' + x.corporationId,
      });
    });

    // 制限件数 <  取得件数の場合
    if (response.limitCount < response.acquisitionCount) {
      // メッセージ取得機能へ引数を渡しメッセージを取得する
      const messege = Format(getMessage('MSG-FR-INF-00004'), [
        response.acquisitionCount.toString(),
        response.responseCount.toString(),
      ]);
      // ダイアログを表示
      setTitle(messege);
      setHandleDialog(true);
    }

    // CSV出力ボタン活性非活性
    if (response.acquisitionCount !== 0) {
      setCsvButtonDisable(false);
    } else {
      setCsvButtonDisable(true);
    }

    setSearchResult(searchResult);
    setHrefs(hrefs);
  };

  /**
   * チェックボックスチェック時のイベントハンドラ
   */
  const onRowSelectionModelChange = (
    rowSelectionModel: GridRowSelectionModel
  ) => {
    setRowSelectionModel(rowSelectionModel);
  };

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    navigate('/mem/corporations/new');
  };

  /**
   * 一括登録アイコンクリック時のイベントハンドラ
   */
  const handleIconBulkAddClick = () => {
    // CSV読込ポップアップを表示
    setScrCom0035PopupIsOpen(true);
  };

  /**
   * 帳票出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputReportClick = () => {
    // 帳票選択ポップアップを表示
    setScrCom0011PopupIsOpen(true);
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const fileName =
      'SCR-MEM-0001_' +
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
   * 帳票選択ポップアップ出力クリック時のイベントハンドラ
   */
  const handleConfirm = async (
    reportId: string,
    reportName: string,
    reportComment: string,
    defaultValue: string
  ) => {
    // 帳票作成パラメーター情報作成
    const outputReportRequest: ScrMem9999OutputReportRequest = {
      screenId: 'SCR-MEM-0001',
      reportId: reportId,
      reportName: reportName,
      outputReportEmployeeId: user.employeeId,
      outputReportEmployeeName: user.employeeName,
      comment: reportComment,
      createReportParameterInfo: convertFromCreateReportParameterInfo(
        reportId,
        getValues(),
        rowSelectionModel
      ),
    };
    // 帳票出力API 呼び出し
    await ScrMem9999OutputReport(outputReportRequest);
  };

  /**
   * Sectionを閉じた際のラベル作成
   */
  const serchLabels = serchData.map((val, index) => {
    let nameVal = getValues(val.name);
    if (val.name === 'corporationGroupName') {
      const filter = selectValues.corporationGroupNameSelectValues.filter(
        (x) => {
          return nameVal === x.value;
        }
      );
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }
    if (val.name === 'corporationEntryKinds') {
      const nameValues: string[] = [];
      selectValues.corporationEntryKindsSelectValues.filter((x) => {
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

    if (val.name === 'logisticsBaseDistrictCode') {
      const filter = selectValues.logisticsBaseDistrictCodeSelectValues.filter(
        (x) => {
          return nameVal === x.value;
        }
      );
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }
    if (val.name === 'limitStatusKinds') {
      const filter = selectValues.limitStatusKindsSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }
    if (val.name === 'courseEntryKinds') {
      const nameValues: string[] = [];
      selectValues.courseEntryKindsSelectValues.filter((x) => {
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
    if (val.name === 'staffDepartmentKinds') {
      const filter = selectValues.staffDepartmentKindsSelectValues.filter(
        (x) => {
          return nameVal === x.value;
        }
      );
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }
    if (val.name === 'liveOptionEntryKinds') {
      const nameValues: string[] = [];
      selectValues.liveOptionEntryKindsSelectValues.filter((x) => {
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
    if (val.name === 'posPutTogetherPlaceCode') {
      const filter = selectValues.posPutTogetherPlaceCodeSelectValues.filter(
        (x) => {
          return nameVal === x.value;
        }
      );
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 法人情報一覧検索セクション */}
            <Section
              name='法人情報一覧検索'
              isSearch
              serchLabels={serchLabels}
              ref={sectionRef}
            >
              <RowStack>
                <ColStack>
                  <TextField label='法人ID' name='corporationId' size='s' />
                  <TextField label='法人名' name='corporationName' size='s' />
                  <Select
                    label='法人グループ名'
                    name='corporationGroupName'
                    selectValues={selectValues.corporationGroupNameSelectValues}
                    blankOption
                  />
                  <Select
                    label='法人参加区分'
                    name='corporationEntryKinds'
                    selectValues={
                      selectValues.corporationEntryKindsSelectValues
                    }
                    multiple
                  />
                  <TextField
                    label='代表者名'
                    name='representativeName'
                    size='s'
                  />
                  <TextField
                    label='連帯保証人名⓵'
                    name='guarantorName1'
                    size='s'
                  />
                  <TextField
                    label='連帯保証人名⓶'
                    name='guarantorName2'
                    size='s'
                  />
                  <TextField
                    label='適格事業者番号'
                    name='eligibleBusinessNumber'
                    size='s'
                  />
                  <TextField
                    label='古物商許可番号'
                    name='antiqueBusinessLicenseNumber'
                    size='s'
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='物流拠点住所（市区町村以降）'
                    name='logisticsBaseAddressAfterMunicipalities'
                    size='s'
                  />
                  <Select
                    label='市区郡コード/市区郡名'
                    name='logisticsBaseDistrictCode'
                    selectValues={
                      selectValues.logisticsBaseDistrictCodeSelectValues
                    }
                    blankOption
                  />
                  <TextField
                    label='物流拠点TEL'
                    name='logisticsBasePhoneNumber'
                    size='s'
                  />
                  <Select
                    label='制限状況'
                    name='limitStatusKinds'
                    selectValues={selectValues.limitStatusKindsSelectValues}
                    blankOption
                  />
                  <Select
                    label='コース参加区分'
                    name='courseEntryKinds'
                    selectValues={selectValues.courseEntryKindsSelectValues}
                    multiple
                  />
                  <FromTo label='基本法人与信額' size='m'>
                    <PriceTextField name='basicsCorporationCreditAmountFrom' />
                    <PriceTextField name='basicsCorporationCreditAmountTo' />
                  </FromTo>
                  <FromTo label='臨時与信設定日'>
                    <DatePicker name='temporaryCreditSettingDateFrom' />
                    <DatePicker name='temporaryCreditSettingDateTo' />
                  </FromTo>
                </ColStack>
                <ColStack>
                  <TextField label='契約ID' name='contractId' size='s' />
                  <TextField label='請求先ID' name='billingId' size='s' />
                  <Select
                    label='契約種別'
                    name='staffDepartmentKinds'
                    selectValues={selectValues.staffDepartmentKindsSelectValues}
                    blankOption
                  />
                  <Select
                    label='ライブ会場フラグ'
                    name='liveOptionEntryKinds'
                    selectValues={selectValues.liveOptionEntryKindsSelectValues}
                    multiple
                  />
                  <Select
                    label='会場名'
                    name='posPutTogetherPlaceCode'
                    selectValues={
                      selectValues.posPutTogetherPlaceCodeSelectValues
                    }
                    blankOption
                  />
                  <TextField label='POS番号' name='posNumber' size='s' />
                  <TextField
                    label='アイオーク番号'
                    name='iaucManagementNumber'
                    size='s'
                  />
                  <TextField
                    label='端末契約ID'
                    name='autobankSystemTerminalContractId'
                    size='s'
                  />
                </ColStack>
                <ColStack>
                  <FromTo label='利用開始日'>
                    <DatePicker name='useStartDateFrom' />
                    <DatePicker name='useStartDateTo' />
                  </FromTo>
                  <FromTo label='ID発行年月日'>
                    <DatePicker name='idIssuanceDateFrom' />
                    <DatePicker name='idIssuanceDateTo' />
                  </FromTo>
                  <FromTo label='コース変更日'>
                    <DatePicker name='courseChangeDateFrom' />
                    <DatePicker name='courseChangeDateTo' />
                  </FromTo>
                  <FromTo label='休会期間FROM'>
                    <DatePicker name='recessPeriodStartDateFrom' />
                    <DatePicker name='recessPeriodStartDateTo' />
                  </FromTo>
                  <FromTo label='休会期間TO'>
                    <DatePicker name='recessPeriodEndDateFrom' />
                    <DatePicker name='recessPeriodEndDateTo' />
                  </FromTo>
                  <FromTo label='脱会日'>
                    <DatePicker name='leavingDateFrom' />
                    <DatePicker name='leavingDateTo' />
                  </FromTo>
                  <FromTo label='変更日'>
                    <DatePicker name='changeExpectDateFrom' />
                    <DatePicker name='changeExpectDateTo' />
                  </FromTo>
                </ColStack>
              </RowStack>
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
            {/* 法人情報一覧セクション */}
            <Section
              name='法人情報一覧'
              width={maxSectionWidth}
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  <AddButton onClick={handleIconAddClick}>追加</AddButton>
                  <RegisterButton onClick={handleIconBulkAddClick}>
                    一括登録
                  </RegisterButton>
                  <OutputButton onClick={handleIconOutputReportClick}>
                    帳票出力
                  </OutputButton>
                  <OutputButton
                    disable={csvButtonDisable}
                    onClick={handleIconOutputCsvClick}
                  >
                    CSV出力
                  </OutputButton>
                </MarginBox>
              }
            >
              <DataGrid
                columns={searchResultColumns}
                rows={searchResult}
                hrefs={hrefs}
                apiRef={apiRef}
                pagination
                onLinkClick={handleLinkClick}
                checkboxSelection
                onRowSelectionModelChange={onRowSelectionModelChange}
              />
            </Section>
          </FormProvider>
        </MainLayout>
      </MainLayout>

      {/* CSV読込（ポップアップ） */}
      {scrCom0035PopupIsOpen ? (
        <ScrCom0035Popup
          allRegistrationDefinitions={allRegistrationDefinitions}
          screenId={'SCR-MEM-0001'}
          isOpen={scrCom0035PopupIsOpen}
          setIsOpen={() => setScrCom0035PopupIsOpen(false)}
        />
      ) : (
        ''
      )}

      {/* 帳票選択（ポップアップ） */}
      {scrCom0011PopupIsOpen ? (
        <ScrCom0011Popup
          isOpen={scrCom0011PopupIsOpen}
          data={{ screenId: 'SCR-MEM-0001' }}
          handleCancel={() => setScrCom0011PopupIsOpen(false)}
          handleConfirm={handleConfirm}
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

export default ScrMem0001Page;

