import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import yup from 'utils/yup';
import { ObjectSchema } from 'yup';

import ScrCom00032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';
import ScrCom0033Popup, {
  ScrCom0033PopupModel,
} from 'pages/com/popups/ScrCom0033Popup';

import { MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { InputLayout } from 'layouts/InputLayout';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { WarningLabel } from 'controls/Label';
import { Select, SelectValue } from 'controls/Select';
import { Typography } from 'controls/Typography';

import {
  ScrCom9999GetBranchMaster,
  ScrCom9999GetCodeValue,
} from 'apis/com/ScrCom9999Api';
import {
  AccountType,
  AccountType3,
  ScrMem0008ApplyRegistrationBankInfo,
  ScrMem0008ApplyRegistrationBankInfoRequest,
  ScrMem0008GetBillingInfo,
  ScrMem9999GetBankHistoryInfo,
} from 'apis/mem/ScrMem0008Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { comApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

import { useGridApiRef } from '@mui/x-data-grid-pro';
import { watch } from 'fs';
import { TabDisabledsModel } from '../ScrMem0008Page';

/**
 * 基本情報データモデル
 */
interface BankInfoModel {
  accountType1: AccountType;
  accountType2: AccountType;
  accountType3: AccountType3[];
  accountType4: AccountType;

  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectedDate: string;
}

/**
 * 列定義
 */
const accountType1Columns: GridColDef[] = [
  {
    field: 'bankCode',
    headerName: '銀行名',
    cellType: 'select',
    selectValues: [{ value: '', displayValue: '' }],
    size: 'l',
  },
  {
    field: 'branchCode',
    headerName: '支店名',
    cellType: 'select',
    selectValues: [{ value: '', displayValue: '' }],
    size: 'l',
  },
  {
    field: 'accountNumber',
    headerName: '口座番号',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'accountKind',
    headerName: '種別',
    cellType: 'radio',
    radioValues: [
      { value: '1', displayValue: '普通' },
      { value: '2', displayValue: '当座' },
    ],
    size: 'm',
  },
  {
    field: 'accountNameKana',
    headerName: '口座名義',
    cellType: 'input',
    size: 'l',
  },
];

const accountType2Columns: GridColDef[] = [
  {
    field: 'bankCode',
    headerName: '銀行名',
    cellType: 'select',
    selectValues: [{ value: '', displayValue: '' }],
    size: 'l',
  },
  {
    field: 'branchCode',
    headerName: '支店名',
    cellType: 'select',
    selectValues: [{ value: '', displayValue: '' }],
    size: 'l',
  },
  {
    field: 'accountNumber',
    headerName: '口座番号',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'accountKind',
    headerName: '種別',
    cellType: 'radio',
    radioValues: [
      { value: '1', displayValue: '普通' },
      { value: '2', displayValue: '当座' },
    ],
    size: 'm',
  },
  {
    field: 'accountNameKana',
    headerName: '口座名義',
    cellType: 'input',
    size: 'l',
  },
];

const accountType3Columns: GridColDef[] = [
  {
    field: 'claimClassification',
    headerName: '請求種別',
    size: 'm',
  },
  {
    field: 'bankName',
    headerName: '銀行名',
    size: 'l',
  },
  {
    field: 'branchName',
    headerName: '支店名',
    size: 'l',
  },
  {
    field: 'accountNumber',
    headerName: '口座番号',
    size: 'm',
  },
  {
    field: 'accountKind',
    headerName: '種別',
    cellType: 'radio',
    radioValues: [
      { value: '1', displayValue: '普通' },
      { value: '2', displayValue: '当座' },
    ],
    size: 'm',
  },
  {
    field: 'accountNameKana',
    headerName: '口座名義',
    size: 'l',
  },
];

const accountType4Columns: GridColDef[] = [
  {
    field: 'bankName',
    headerName: '銀行名',
    size: 'l',
  },
  {
    field: 'branchName',
    headerName: '支店名',
    size: 'l',
  },
  {
    field: 'accountNumber',
    headerName: '口座番号',
    size: 'm',
  },
  {
    field: 'accountKind',
    headerName: '種別',
    cellType: 'radio',
    radioValues: [
      { value: '1', displayValue: '普通' },
      { value: '2', displayValue: '当座' },
    ],
    size: 'm',
  },
  {
    field: 'accountNameKana',
    headerName: '口座名義',
    size: 'l',
  },
];

/**
 * 列モデル
 */
// 会員用引落口座（会費用）
interface AccountType1RowModel {
  id: string;
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  accountKind: string;
  accountNameKana: string;
}

// 支払口座
interface AccountType2RowModel {
  id: string;
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  accountKind: string;
  accountNameKana: string;
}

// 会員向け振込口座（計算書記載の入金バーチャル口座）
interface AccountType3RowModel {
  id: string;
  claimClassification: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountKind: string;
  accountNameKana: string;
}

// 会場向け振込口座（取引用バーチャル）
interface AccountType4RowModel {
  id: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountKind: string;
  accountNameKana: string;
}

/**
 * バリデーションスキーマ
 */
const validationSchema: ObjectSchema<any> = yup.object({
  bankCode: yup.string().required().label('銀行名'),
  branchCode: yup.string().required().label('支店名'),
  accountNumber: yup.string().required().max(7).half().label('口座番号'),
  accountKind: yup.string().required().label('種別'),
  accountNameKana: yup.string().required().max(40).half().label('口座名義'),
});

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
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0033PopupInitialValues: ScrCom0033PopupModel = {
  screenId: '',
  tabId: 0,
  applicationMoney: 0,
};

/**
 * 列定義
 */
const accountType1RowInitialValues: BankInfoModel = {
  accountType1: {
    bankCode: '',
    bankName: '',
    branchCode: '',
    branchName: '',
    accountNumber: '',
    accountKind: '',
    accountNameKana: '',
  },
  accountType2: {
    bankCode: '',
    bankName: '',
    branchCode: '',
    branchName: '',
    accountNumber: '',
    accountKind: '',
    accountNameKana: '',
  },
  accountType3: [
    {
      claimClassification: '',
      bankCode: '',
      bankName: '',
      branchCode: '',
      branchName: '',
      accountNumber: '',
      accountKind: '',
      accountNameKana: '',
    },
  ],
  accountType4: {
    bankCode: '',
    bankName: '',
    branchCode: '',
    branchName: '',
    accountNumber: '',
    accountKind: '',
    accountNameKana: '',
  },

  // 変更履歴番号
  changeHistoryNumber: '',
  // 変更予定日
  changeExpectedDate: '',
};

/**
 * 法人基本情報登録APIリクエストへの変換
 */
const convertFromBankInfo = (
  corporationId: string,
  billingId: string,
  bankInfoModel: BankInfoModel,
  user: string,
  applicationComment: string,
  employeeId1: string,
  employeeMailAddress1: string,
  employeeId2: string,
  employeeId3: string,
  employeeId4: string
): ScrMem0008ApplyRegistrationBankInfoRequest => {
  return {
    changeHistoryNumber: Number(bankInfoModel.changeHistoryNumber),
    corporationId: corporationId,
    billingId: billingId,
    accountType1: {
      bankCode: bankInfoModel.accountType1.bankCode,
      bankName: bankInfoModel.accountType1.bankName,
      branchCode: bankInfoModel.accountType1.branchCode,
      branchName: bankInfoModel.accountType1.branchName,
      accountNumber: bankInfoModel.accountType1.accountNumber,
      accountKind: bankInfoModel.accountType1.accountKind,
      accountNameKana: bankInfoModel.accountType1.accountNameKana,
    },
    accountType2: {
      bankCode: bankInfoModel.accountType2.bankCode,
      bankName: bankInfoModel.accountType2.bankName,
      branchCode: bankInfoModel.accountType2.branchCode,
      branchName: bankInfoModel.accountType2.branchName,
      accountNumber: bankInfoModel.accountType2.accountNumber,
      accountKind: bankInfoModel.accountType2.accountKind,
      accountNameKana: bankInfoModel.accountType2.accountNameKana,
    },
    accountType3: bankInfoModel.accountType3.map((x) => {
      let claimClassification = '';
      switch (x.claimClassification) {
        case '1':
          claimClassification = '四輪';
          break;
        case '2':
          claimClassification = '二輪';
          break;
        case '3':
          claimClassification = 'おまとめ';
          break;
        case '4':
          claimClassification = '一般請求';
          break;
      }
      return {
        // 請求種別
        claimClassification: claimClassification,
        bankCode: x.bankCode,
        bankName: x.bankName,
        branchCode: x.branchCode,
        branchName: x.branchName,
        accountNumber: x.accountNumber,
        accountKind: x.accountKind,
        accountNameKana: x.accountNameKana,
      };
    }),
    accountType4: {
      bankCode: bankInfoModel.accountType4.bankCode,
      bankName: bankInfoModel.accountType4.bankName,
      branchCode: bankInfoModel.accountType4.branchCode,
      branchName: bankInfoModel.accountType4.branchName,
      accountNumber: bankInfoModel.accountType4.accountNumber,
      accountKind: bankInfoModel.accountType4.accountKind,
      accountNameKana: bankInfoModel.accountType4.accountNameKana,
    },
    applicationEmployeeId: user,
    registrationChangeMemo: '',
    firstApproverId: employeeId1,
    firstApproverMailAddress: employeeMailAddress1,
    secondApproverId: employeeId2,
    thirdApproverId: employeeId3,
    fourthApproverId: employeeId4,
    applicationComment: applicationComment,
    changeExpectDate: bankInfoModel.changeExpectedDate,
    screenId: 'SCR-MEM-0008',
    tabId: 'B-14',
  };
};

/**
 * 変更した項目から登録・変更内容データへの変換
 */
const convertToSectionList = (
  bankInfoModel: BankInfoModel,
  accountType1: AccountType1RowModel,
  accountType2: AccountType2RowModel,
  accountType3: AccountType3RowModel[],
  accountType4: AccountType4RowModel
): sectionList[] => {
  const sectionList: sectionList[] = [];
  const columnList: columnList[] = [];
  if (bankInfoModel.accountType1.bankCode === accountType1.bankCode) {
    columnList.push({ columnName: '会員用引落口座（会費用） 銀行名' });
  }
  if (bankInfoModel.accountType1.branchCode === accountType1.branchCode) {
    columnList.push({ columnName: '会員用引落口座（会費用） 支店名' });
  }
  if (bankInfoModel.accountType1.accountNumber === accountType1.accountNumber) {
    columnList.push({ columnName: '会員用引落口座（会費用） 口座番号' });
  }
  if (bankInfoModel.accountType1.accountKind === accountType1.accountKind) {
    columnList.push({ columnName: '会員用引落口座（会費用） 種別' });
  }
  if (
    bankInfoModel.accountType1.accountNameKana === accountType1.accountNameKana
  ) {
    columnList.push({ columnName: '会員用引落口座（会費用） 口座名義' });
  }

  if (bankInfoModel.accountType2.bankCode === accountType2.bankCode) {
    columnList.push({ columnName: '支払口座 銀行名' });
  }
  if (bankInfoModel.accountType2.branchCode === accountType2.branchCode) {
    columnList.push({ columnName: '支払口座 支店名' });
  }
  if (bankInfoModel.accountType2.accountNumber === accountType2.accountNumber) {
    columnList.push({ columnName: '支払口座 口座番号' });
  }
  if (bankInfoModel.accountType2.accountKind === accountType2.accountKind) {
    columnList.push({ columnName: '支払口座 種別' });
  }
  if (
    bankInfoModel.accountType2.accountNameKana === accountType2.accountNameKana
  ) {
    columnList.push({ columnName: '支払口座 口座名義' });
  }

  bankInfoModel.accountType3.map((x) => {
    accountType3.map((f) => {
      let claimClassification = '';
      switch (x.claimClassification) {
        case '1':
          claimClassification = '四輪';
          break;
        case '2':
          claimClassification = '二輪';
          break;
        case '3':
          claimClassification = 'おまとめ';
          break;
        case '4':
          claimClassification = '一般請求';
          break;
      }
      if (claimClassification === f.claimClassification) {
        if (x.accountKind !== f.accountKind) {
          columnList.push({
            columnName:
              '会員向け振込口座（計算書記載の入金バーチャル口座）' +
              claimClassification +
              ' 種別',
          });
        }
      }
    });
  });

  if (bankInfoModel.accountType4.accountKind === accountType4.accountKind) {
    columnList.push({
      columnName: '会場向け振込口座（取引用バーチャル） 種別',
    });
  }

  sectionList.push({
    sectionName: '口座情報',
    columnList: columnList,
  });
  return sectionList;
};

const ScrMem0008BankTab = (props: {
  chengeTabDisableds: (tabDisableds: TabDisabledsModel) => void;
}) => {
  // router
  const { corporationId, billingId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const { user } = useContext(AuthContext);
  const apiRef = useGridApiRef();

  // state
  const [getBranchMasterFlag1, setGetBranchMasterFlag1] =
    useState<boolean>(false);
  const [getBranchMasterFlag2, setGetBranchMasterFlag2] =
    useState<boolean>(false);
  const [accountType1BankCode, setAccountType1BankCode] = useState<string>();
  const [accountType2BankCode, setAccountType2BankCode] = useState<string>();
  const [accountType1Row, setAccountType1Row] = useState<
    AccountType1RowModel[]
  >([]);
  const [accountType2Row, setAccountType2Row] = useState<
    AccountType2RowModel[]
  >([]);
  const [accountType3Row, setAccountType3Row] = useState<
    AccountType3RowModel[]
  >([]);
  const [accountType4Row, setAccountType4Row] = useState<
    AccountType4RowModel[]
  >([]);
  const [changeHistory, setChangeHistory] = useState<any>([]);
  const [scrCom00032PopupIsOpen, setScrCom00032PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [scrCom00033PopupIsOpen, setScrCom00033PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0033PopupData, setScrCom0033PopupData] =
    useState<ScrCom0033PopupModel>(scrCom0033PopupInitialValues);
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckIsOpen, setChangeHistoryDateCheckIsOpen] =
    useState<boolean>(false);
  const [maxSectionWidth, setMaxSectionWidth] = useState<number>(0);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0008') === -1
  );
  // form
  const methods = useForm<BankInfoModel>({
    defaultValues: accountType1RowInitialValues,
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields, errors },
    getValues,
    setValue,
    reset,
    watch,
  } = methods;

  // 初期表示処理
  useEffect(() => {
    const initialize = async (corporationId: string, billingId: string) => {
      // 請求先一覧取得
      const getBillingInfoRequest = {
        billingId: billingId,
        corporationId: corporationId,
      };
      const getBillingInfoResponse = await ScrMem0008GetBillingInfo(
        getBillingInfoRequest
      );
      const accountType1 = getBillingInfoResponse.accountType1;
      setAccountType1Row([
        {
          id: '1',
          bankCode: accountType1.bankCode,
          branchCode: accountType1.branchCode,
          accountNumber: accountType1.accountNumber,
          accountKind: accountType1.accountKind,
          accountNameKana: accountType1.accountNameKana,
        },
      ]);
      setAccountType1BankCode(accountType1.bankCode);
      setValue('accountType1', accountType1);
      const accountType2 = getBillingInfoResponse.accountType2;
      setAccountType2Row([
        {
          id: '1',
          bankCode: accountType2.bankCode,
          branchCode: accountType2.branchCode,
          accountNumber: accountType2.accountNumber,
          accountKind: accountType2.accountKind,
          accountNameKana: accountType2.accountNameKana,
        },
      ]);
      setAccountType2BankCode(accountType2.bankCode);
      setValue('accountType2', accountType2);
      const accountType3 = getBillingInfoResponse.accountType3;
      setAccountType3Row(
        accountType3.map((x) => {
          let claimClassification = '';
          switch (x.claimClassification) {
            case '1':
              claimClassification = '四輪';
              break;
            case '2':
              claimClassification = '二輪';
              break;
            case '3':
              claimClassification = 'おまとめ';
              break;
            case '4':
              claimClassification = '一般請求';
              break;
          }

          return {
            id: x.claimClassification,
            claimClassification: claimClassification,
            bankName: x.bankName,
            branchName: x.branchName,
            accountNumber: x.accountNumber,
            accountKind: x.accountKind,
            accountNameKana: x.accountNameKana,
          };
        })
      );
      setValue('accountType3', accountType3);
      const accountType4 = getBillingInfoResponse.accountType4;
      setAccountType4Row([
        {
          id: '1',
          bankName: accountType4.bankName,
          branchName: accountType4.branchName,
          accountNumber: accountType4.accountNumber,
          accountKind: accountType4.accountKind,
          accountNameKana: accountType4.accountNameKana,
        },
      ]);
      setValue('accountType4', accountType4);

      const bankSelectValues: SelectValue[] = [];
      // 共通管理コード値取得API（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [{ entityName: 'bank_master' }],
      };
      const getCodeValueResponse = await ScrCom9999GetCodeValue(
        getCodeValueRequest
      );

      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'bank_master') {
          x.codeValueList.map((f) => {
            bankSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
      });
      accountType1Columns[0].selectValues = bankSelectValues;
      accountType2Columns[0].selectValues = bankSelectValues;

      // 支店名情報取得（会員用引落口座（会費用））
      const accountType1branchSelectValues: SelectValue[] = [];
      const getAccountType1BranchMasterRequest = {
        bankCode: accountType1.bankCode,
        businessDate: user.taskDate,
      };
      const getAccountType1BranchMasterResponse =
        await ScrCom9999GetBranchMaster(getAccountType1BranchMasterRequest);
      getAccountType1BranchMasterResponse.searchGetBranchMaster.map((x) => {
        accountType1branchSelectValues.push({
          value: x.branchCode,
          displayValue: x.branchCode + '　' + x.branchHame,
        });
      });
      accountType1Columns[1].selectValues = accountType1branchSelectValues;

      // 支店名情報取得（会員用引落口座（会費用））
      const accountType2branchSelectValues: SelectValue[] = [];
      const getAccountType2BranchMasterRequest = {
        bankCode: accountType2.bankCode,
        businessDate: user.taskDate,
      };
      const getAccountType2BranchMasterResponse =
        await ScrCom9999GetBranchMaster(getAccountType2BranchMasterRequest);
      getAccountType2BranchMasterResponse.searchGetBranchMaster.map((x) => {
        accountType2branchSelectValues.push({
          value: x.branchCode,
          displayValue: x.branchCode + '　' + x.branchHame,
        });
      });
      accountType2Columns[1].selectValues = accountType2branchSelectValues;

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0008',
        tabId: 'B-14',
        getKeyValue: corporationId,
        businessDate: new Date(), // TODO:業務日付取得方法実装待ち、new Date()で登録
      };
      const getChangeDate = (
        await comApiClient.post(
          '/api/com/scr-com-9999/get-change-date',
          getChangeDateRequest
        )
      ).data;

      const chabngeHistory = getChangeDate.changeExpectDateInfo.map(
        (e: { changeHistoryNumber: number; changeExpectDate: Date }) => {
          return {
            value: e.changeHistoryNumber,
            displayValue: new Date(e.changeExpectDate).toLocaleDateString(),
          };
        }
      );
      setChangeHistory(chabngeHistory);
    };

    const historyInitialize = async (applicationId: string) => {
      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response = await ScrMem9999GetBankHistoryInfo(request);

      const accountType1 = response.accountType1;
      setAccountType1Row([
        {
          id: '1',
          bankCode: accountType1.bankCode,
          branchCode: accountType1.branchCode,
          accountNumber: accountType1.accountNumber,
          accountKind: accountType1.accountKind,
          accountNameKana: accountType1.accountNameKana,
        },
      ]);
      setAccountType1BankCode(accountType1.bankCode);
      setValue('accountType1', accountType1);
      const accountType2 = response.accountType2;
      setAccountType2Row([
        {
          id: '1',
          bankCode: accountType2.bankCode,
          branchCode: accountType2.branchCode,
          accountNumber: accountType2.accountNumber,
          accountKind: accountType2.accountKind,
          accountNameKana: accountType2.accountNameKana,
        },
      ]);
      setAccountType2BankCode(accountType2.bankCode);
      setValue('accountType2', accountType2);
      const accountType3 = response.accountType3;
      setAccountType3Row(
        accountType3.map((x) => {
          let claimClassification = '';
          switch (x.claimClassification) {
            case '1':
              claimClassification = '四輪';
              break;
            case '2':
              claimClassification = '二輪';
              break;
            case '3':
              claimClassification = 'おまとめ';
              break;
            case '4':
              claimClassification = '一般請求';
              break;
          }

          return {
            id: x.claimClassification,
            claimClassification: claimClassification,
            bankName: x.bankName,
            branchName: x.branchName,
            accountNumber: x.accountNumber,
            accountKind: x.accountKind,
            accountNameKana: x.accountNameKana,
          };
        })
      );
      setValue('accountType3', accountType3);
      const accountType4 = response.accountType4;
      setAccountType4Row([
        {
          id: '1',
          bankName: accountType4.bankName,
          branchName: accountType4.branchName,
          accountNumber: accountType4.accountNumber,
          accountKind: accountType4.accountKind,
          accountNameKana: accountType4.accountNameKana,
        },
      ]);
      setValue('accountType4', accountType4);

      const bankSelectValues: SelectValue[] = [];
      // 共通管理コード値取得API（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [{ entityName: 'bank_master' }],
      };
      const getCodeValueResponse = await ScrCom9999GetCodeValue(
        getCodeValueRequest
      );

      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'bank_master') {
          x.codeValueList.map((f) => {
            bankSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
      });
      accountType1Columns[0].selectValues = bankSelectValues;
      accountType2Columns[0].selectValues = bankSelectValues;

      // 支店名情報取得（会員用引落口座（会費用））
      const accountType1branchSelectValues: SelectValue[] = [];
      const getAccountType1BranchMasterRequest = {
        bankCode: accountType1.bankCode,
        businessDate: user.taskDate,
      };
      const getAccountType1BranchMasterResponse =
        await ScrCom9999GetBranchMaster(getAccountType1BranchMasterRequest);
      getAccountType1BranchMasterResponse.searchGetBranchMaster.map((x) => {
        accountType1branchSelectValues.push({
          value: x.branchCode,
          displayValue: x.branchCode + '　' + x.branchHame,
        });
      });
      accountType1Columns[1].selectValues = accountType1branchSelectValues;

      // 支店名情報取得（会員用引落口座（会費用））
      const accountType2branchSelectValues: SelectValue[] = [];
      const getAccountType2BranchMasterRequest = {
        bankCode: accountType2.bankCode,
        businessDate: user.taskDate,
      };
      const getAccountType2BranchMasterResponse =
        await ScrCom9999GetBranchMaster(getAccountType2BranchMasterRequest);
      getAccountType2BranchMasterResponse.searchGetBranchMaster.map((x) => {
        accountType2branchSelectValues.push({
          value: x.branchCode,
          displayValue: x.branchCode + '　' + x.branchHame,
        });
      });
      accountType2Columns[1].selectValues = accountType2branchSelectValues;
    };

    if (corporationId === undefined || corporationId === 'new') {
      return;
    }

    if (billingId === undefined || billingId === 'new') {
      return;
    }

    if (applicationId !== null) {
      historyInitialize(applicationId);
    }

    initialize(corporationId, billingId);
  }, [corporationId, billingId, applicationId]);

  /**
   * セクションの幅変更
   */
  useEffect(() => {
    setMaxSectionWidth(
      Number(
        apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
      ) + 40
    );
  }, [apiRef, apiRef.current.rootElementRef]);

  /**
   * 銀行変更時のイベントハンドラ
   */
  useEffect(() => {
    const getBranchMaster1 = async () => {
      if (accountType1Row[0].bankCode === accountType1BankCode) return;
      if (accountType1Row[0].bankCode.length !== 4) return;
      // 支店名情報取得
      const branchSelectValues: SelectValue[] = [];
      const getBranchMasterRequest = {
        bankCode: accountType1Row[0].bankCode,
        businessDate: user.taskDate,
      };
      const getBranchMasterResponse = await ScrCom9999GetBranchMaster(
        getBranchMasterRequest
      );
      getBranchMasterResponse.searchGetBranchMaster.map((x) => {
        branchSelectValues.push({
          value: x.branchCode,
          displayValue: x.branchCode + '　' + x.branchHame,
        });
      });
      accountType1Columns[1].selectValues = branchSelectValues;
      accountType1Row[0].branchCode = branchSelectValues[0].value.toString();
      setAccountType1BankCode(accountType1Row[0].bankCode);
      setGetBranchMasterFlag1(false);
    };

    const getBranchMaster2 = async () => {
      if (accountType2Row[0].bankCode === accountType2BankCode) return;
      if (accountType2Row[0].bankCode.length !== 4) return;
      // 支店名情報取得
      const branchSelectValues: SelectValue[] = [];
      const getBranchMasterRequest = {
        bankCode: accountType2Row[0].bankCode,
        businessDate: user.taskDate,
      };
      const getBranchMasterResponse = await ScrCom9999GetBranchMaster(
        getBranchMasterRequest
      );
      getBranchMasterResponse.searchGetBranchMaster.map((x) => {
        branchSelectValues.push({
          value: x.branchCode,
          displayValue: x.branchCode + '　' + x.branchHame,
        });
      });
      accountType2Columns[1].selectValues = branchSelectValues;
      accountType2Row[0].branchCode = branchSelectValues[0].value.toString();
      setAccountType2BankCode(accountType2Row[0].bankCode);
      setGetBranchMasterFlag2(false);
    };

    if (getBranchMasterFlag1) {
      getBranchMaster1();
    }
    if (getBranchMasterFlag2) {
      getBranchMaster2();
    }
  }, [getBranchMasterFlag1, getBranchMasterFlag2]);

  const onRowValueChangeAccountType1 = (row: any) => {
    setGetBranchMasterFlag1(true);
  };

  const onRowValueChangeAccountType2 = (row: any) => {
    setGetBranchMasterFlag2(true);
  };

  /**
   * 表示切替クリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    // 変更履歴情報取得API
    const request = {
      changeHistoryNumber: getValues('changeHistoryNumber'),
    };
    const response = await ScrMem9999GetBankHistoryInfo(request);

    const accountType1 = response.accountType1;
    setAccountType1Row([
      {
        id: '1',
        bankCode: accountType1.bankCode,
        branchCode: accountType1.branchCode,
        accountNumber: accountType1.accountNumber,
        accountKind: accountType1.accountKind,
        accountNameKana: accountType1.accountNameKana,
      },
    ]);
    setAccountType1BankCode(accountType1.bankCode);
    setValue('accountType1', accountType1);
    const accountType2 = response.accountType2;
    setAccountType2Row([
      {
        id: '1',
        bankCode: accountType2.bankCode,
        branchCode: accountType2.branchCode,
        accountNumber: accountType2.accountNumber,
        accountKind: accountType2.accountKind,
        accountNameKana: accountType2.accountNameKana,
      },
    ]);
    setAccountType2BankCode(accountType2.bankCode);
    setValue('accountType2', accountType2);
    const accountType3 = response.accountType3;
    setAccountType3Row(
      accountType3.map((x) => {
        let claimClassification = '';
        switch (x.claimClassification) {
          case '1':
            claimClassification = '四輪';
            break;
          case '2':
            claimClassification = '二輪';
            break;
          case '3':
            claimClassification = 'おまとめ';
            break;
          case '4':
            claimClassification = '一般請求';
            break;
        }

        return {
          id: x.claimClassification,
          claimClassification: claimClassification,
          bankName: x.bankName,
          branchName: x.branchName,
          accountNumber: x.accountNumber,
          accountKind: x.accountKind,
          accountNameKana: x.accountNameKana,
        };
      })
    );
    setValue('accountType3', accountType3);
    const accountType4 = response.accountType4;
    setAccountType4Row([
      {
        id: '1',
        bankName: accountType4.bankName,
        branchName: accountType4.branchName,
        accountNumber: accountType4.accountNumber,
        accountKind: accountType4.accountKind,
        accountNameKana: accountType4.accountNameKana,
      },
    ]);
    setValue('accountType4', accountType4);

    // 支店名情報取得（会員用引落口座（会費用））
    const accountType1branchSelectValues: SelectValue[] = [];
    const getAccountType1BranchMasterRequest = {
      bankCode: accountType1.bankCode,
      businessDate: user.taskDate,
    };
    const getAccountType1BranchMasterResponse = await ScrCom9999GetBranchMaster(
      getAccountType1BranchMasterRequest
    );
    getAccountType1BranchMasterResponse.searchGetBranchMaster.map((x) => {
      accountType1branchSelectValues.push({
        value: x.branchCode,
        displayValue: x.branchCode + '　' + x.branchHame,
      });
    });
    accountType1Columns[1].selectValues = accountType1branchSelectValues;

    // 支店名情報取得（会員用引落口座（会費用））
    const accountType2branchSelectValues: SelectValue[] = [];
    const getAccountType2BranchMasterRequest = {
      bankCode: accountType2.bankCode,
      businessDate: user.taskDate,
    };
    const getAccountType2BranchMasterResponse = await ScrCom9999GetBranchMaster(
      getAccountType2BranchMasterRequest
    );
    getAccountType2BranchMasterResponse.searchGetBranchMaster.map((x) => {
      accountType2branchSelectValues.push({
        value: x.branchCode,
        displayValue: x.branchCode + '　' + x.branchHame,
      });
    });
    accountType2Columns[1].selectValues = accountType2branchSelectValues;

    props.chengeTabDisableds({
      ScrMem0008BasicTab: true,
      ScrMem0008BankTab: false,
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations/' + corporationId);
  };
  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const scrCom00032PopupHandleCancel = () => {
    setScrCom00032PopupIsOpen(false);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const scrCom00032PopupHandleConfirm = () => {
    setScrCom0033PopupData({
      screenId: 'SCR-MEM-0008',
      tabId: 14,
      applicationMoney: 0,
    });
    setScrCom00033PopupIsOpen(true);
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const scrCom00033PopupHandleCancel = () => {
    setScrCom00033PopupIsOpen(false);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const scrCom00033PopupHandleConfirm = async (
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
    setScrCom00033PopupIsOpen(false);

    if (corporationId === undefined) return;
    if (billingId === undefined) return;

    // 会員用引落口座（会費用）銀行名取得
    let bankName1 = '';
    accountType1Columns[0].selectValues?.find((x) => {
      if (x.value === accountType1Row[0].bankCode) {
        bankName1 = x.displayValue;
      }
    });
    // 会員用引落口座（会費用）支店名取得
    let branchName1 = '';
    accountType1Columns[1].selectValues?.find((x) => {
      if (x.value === accountType1Row[0].branchCode) {
        branchName1 = x.displayValue;
      }
    });
    setValue('accountType1', {
      bankCode: accountType1Row[0].bankCode,
      bankName: bankName1,
      branchCode: accountType1Row[0].branchCode,
      branchName: branchName1,
      accountNumber: accountType1Row[0].accountNumber,
      accountKind: accountType1Row[0].accountKind,
      accountNameKana: accountType1Row[0].accountNameKana,
    });

    // 支払口座銀行名取得
    let bankName2 = '';
    accountType2Columns[0].selectValues?.find((x) => {
      if (x.value === accountType2Row[0].bankCode) {
        bankName2 = x.displayValue;
      }
    });
    // 支払口座支店名取得
    let branchName2 = '';
    accountType2Columns[1].selectValues?.find((x) => {
      if (x.value === accountType2Row[0].branchCode) {
        branchName2 = x.displayValue;
      }
    });
    setValue('accountType2', {
      bankCode: accountType2Row[0].bankCode,
      bankName: bankName2,
      branchCode: accountType2Row[0].branchCode,
      branchName: branchName2,
      accountNumber: accountType2Row[0].accountNumber,
      accountKind: accountType2Row[0].accountKind,
      accountNameKana: accountType2Row[0].accountNameKana,
    });

    // 請求先基本情報登録
    const applyRegistrationBankInfoRequest = convertFromBankInfo(
      corporationId,
      billingId,
      getValues(),
      user.employeeId,
      applicationComment,
      employeeId1,
      employeeMailAddress1,
      employeeId2,
      employeeId3,
      employeeId4
    );
    await ScrMem0008ApplyRegistrationBankInfo(applyRegistrationBankInfoRequest);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const onClickConfirm = async () => {
    await methods.trigger();
    if (!methods.formState.isValid) return;
    if (
      accountType1Row[0].accountNumber.length > 7 ||
      accountType1Row[0].accountNumber.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/) ===
        null
    )
      return;
    if (
      accountType2Row[0].accountNumber.length > 7 ||
      accountType2Row[0].accountNumber.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/) ===
        null
    )
      return;
    if (
      accountType1Row[0].accountNameKana.length > 40 ||
      accountType1Row[0].accountNameKana.match(/^[!-~ｦ-ﾟ]*$/) === null
    )
      return;
    if (
      accountType2Row[0].accountNameKana.length > 40 ||
      accountType2Row[0].accountNameKana.match(/^[!-~ｦ-ﾟ]*$/) === null
    )
      return;
    // 反映予定日整合性チェック
    setChangeHistoryDateCheckIsOpen(true);
  };

  /**
   * 確定ボタンクリック時（反映予定日整合性チェック後）のイベントハンドラ
   */
  const ChangeHistoryDateCheckUtilHandleConfirm = (checkFlg: boolean) => {
    setChangeHistoryDateCheckIsOpen(false);
    if (!checkFlg) return;
    setScrCom0032PopupData({
      errorList: [],
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0008',
          screenName: '請求先詳細',
          tabId: 14,
          tabName: '口座情報',
          sectionList: convertToSectionList(
            getValues(),
            accountType1Row[0],
            accountType2Row[0],
            accountType3Row,
            accountType4Row[0]
          ),
        },
      ],
      changeExpectDate: getValues('changeExpectedDate'),
    });
    setScrCom00032PopupIsOpen(true);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 口座情報セクション */}
            <Section name='口座情報'>
              <RowStack>
                <ColStack>
                  <InputLayout
                    label='会員用引落口座（会費用）'
                    required
                    size='xl'
                  >
                    <DataGrid
                      columns={accountType1Columns}
                      rows={accountType1Row}
                      resolver={validationSchema}
                      onRowValueChange={onRowValueChangeAccountType1}
                      disabled={isReadOnly[0]}
                    />
                  </InputLayout>
                  <InputLayout label='支払口座' required size='xl'>
                    <DataGrid
                      columns={accountType2Columns}
                      rows={accountType2Row}
                      resolver={validationSchema}
                      onRowValueChange={onRowValueChangeAccountType2}
                      disabled={isReadOnly[0]}
                    />
                  </InputLayout>
                  <InputLayout
                    label='会員向け振込口座（計算書記載の入金バーチャル口座）'
                    size='xl'
                  >
                    <DataGrid
                      columns={accountType3Columns}
                      rows={accountType3Row}
                      disabled={isReadOnly[0]}
                      apiRef={apiRef}
                    />
                  </InputLayout>
                  <InputLayout
                    label='会場向け振込口座（取引用バーチャル）'
                    size='xl'
                  >
                    <DataGrid
                      columns={accountType4Columns}
                      rows={accountType4Row}
                      disabled={isReadOnly[0]}
                    />
                  </InputLayout>
                </ColStack>
              </RowStack>
            </Section>
          </FormProvider>
        </MainLayout>
        {/* right */}
        <MainLayout right>
          <FormProvider {...methods}>
            <Grid container height='100%'>
              <Grid item size='s'>
                <RightElementStack>
                  {changeHistory.length >= 0 ? (
                    <Stack>
                      <Typography bold>変更予約情報</Typography>
                      <WarningLabel text='変更予約あり' />
                      <Select
                        name='changeHistoryNumber'
                        selectValues={changeHistory}
                        blankOption
                      />
                      <PrimaryButton onClick={handleSwichDisplay}>
                        表示切替
                      </PrimaryButton>
                    </Stack>
                  ) : (
                    ''
                  )}
                  <MarginBox mb={6}>
                    <DatePicker
                      label='変更予定日'
                      name='changeExpectedDate'
                      disabled={isReadOnly[0]}
                    />
                  </MarginBox>
                </RightElementStack>
              </Grid>
            </Grid>
          </FormProvider>
        </MainLayout>
        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={onClickConfirm} disable={isReadOnly[0]}>
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {scrCom00032PopupIsOpen ? (
        <ScrCom00032Popup
          isOpen={scrCom00032PopupIsOpen}
          data={scrCom0032PopupData}
          handleCancel={scrCom00032PopupHandleCancel}
          handleRegistConfirm={scrCom00032PopupHandleConfirm}
          handleApprovalConfirm={scrCom00032PopupHandleConfirm}
        />
      ) : (
        ''
      )}

      {/* 登録内容申請ポップアップ */}
      {scrCom00033PopupIsOpen ? (
        <ScrCom0033Popup
          isOpen={scrCom00033PopupIsOpen}
          data={scrCom0033PopupData}
          handleCancel={scrCom00033PopupHandleCancel}
          handleConfirm={scrCom00033PopupHandleConfirm}
        />
      ) : (
        ''
      )}

      {/* 反映予定日整合性チェック */}
      {changeHistoryDateCheckIsOpen ? (
        <ChangeHistoryDateCheckUtil
          changeExpectedDate={getValues('changeExpectedDate')}
          changeHistoryNumber={getValues('changeHistoryNumber')}
          isChangeHistoryBtn={isChangeHistoryBtn}
          changeHistory={changeHistory}
          isOpen={changeHistoryDateCheckIsOpen}
          handleConfirm={ChangeHistoryDateCheckUtilHandleConfirm}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrMem0008BankTab;
