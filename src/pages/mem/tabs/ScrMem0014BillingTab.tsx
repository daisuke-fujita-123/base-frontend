import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0032Popup, {
  columnList,
  errorList,
  ScrCom0032PopupModel,
  sectionList,
  warningList,
} from 'pages/com/popups/ScrCom0032Popup';
import ScrCom0033Popup, {
  ScrCom0033PopupModel,
} from 'pages/com/popups/ScrCom0033Popup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { CaptionLabel } from 'controls/Label';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';

import {
  ScrCom9999getCodeManagementMasterMultiple,
  ScrCom9999GetMembershipfeediscountincreaseInfo,
  ScrCom9999GetMembershipfeediscountincreaseInfoResponse,
} from 'apis/com/ScrCom9999Api';
import {
  registrationRequest,
  ScrMem0014CalculateAmountMembershipfeediscountincrease,
  ScrMem0014CalculateAmountMembershipfeediscountincreaseRequest,
  ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse,
  ScrMem0014CheckMembershipfeediscountincrease,
  ScrMem0014ContractBillinginfoBase,
  ScrMem0014GetBillingInfo,
  ScrMem0014GetBillingInfoResponse,
  ScrMem0014GetCourseServiceDiscountInfo,
  ScrMem0014GetCourseServiceDiscountInfoResponse,
} from 'apis/mem/ScrMem0014Api';
import { ScrMem9999GetBill } from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

/**
 * 基本情報データモデル
 */
interface BillingInfoModel {
  // 請求ID
  billingId: string;
  // 会費請求方法
  claimMethodKind: string;
  // コース情報
  courseInfoRow: courseInfoRowModel[];
  // オプション情報
  optionInfoRow: optionInfoRowModel[];
  // 合計金額
  totalPrice: number;
}

/**
 * コース情報列定義
 */
const courseInfoColumns: GridColDef[] = [
  {
    field: 'courseName',
    headerName: 'コース名',
    size: 'l',
  },
  {
    field: 'contractCount',
    headerName: '数量',
    size: 's',
  },
  {
    field: 'feeKind',
    headerName: '会費（値引値増適用後）',
    size: 'm',
  },
  {
    field: 'useStartDate',
    headerName: '利用開始日',
    size: 'm',
  },
];

/**
 * オプション情報列定義
 */
const optionInfoColumns: GridColDef[] = [
  {
    field: 'serviceName',
    headerName: 'オプション',
    size: 'l',
  },
  {
    field: 'contractCount',
    headerName: '数量',
    size: 's',
  },
  {
    field: 'feeKind',
    headerName: '会費（値引値増適用後）',
    size: 'm',
  },
  {
    field: 'feeClaimFrequencyKind',
    headerName: '会費請求頻度',
    size: 'm',
  },
  {
    field: 'useStartDate',
    headerName: '利用開始日',
    size: 'm',
  },
];

/**
 * コース情報行データモデル
 */
interface courseInfoRowModel {
  id: string;
  courseId: string;
  courseName: string;
  contractCount: number;
  feeKind: number;
  useStartDate: string;
}

/**
 * オプション情報行データモデル
 */
interface optionInfoRowModel {
  id: string;
  serviceId: string;
  serviceName: string;
  contractCount: number;
  feeKind: number;
  feeClaimFrequencyKind: string;
  useStartDate: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValueModel {
  billingIdSelectValues: SelectValue[];
  claimMethodKindSelectValues: SelectValue[];
}

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  claimMethodKind: yup.string().label('会費請求方法'),
};

/**
 * リスト初期データ
 */
const selectValuesInitialValues: SelectValueModel = {
  billingIdSelectValues: [],
  claimMethodKindSelectValues: [],
};

/**
 * 基本情報初期データ
 */
const initialValues: BillingInfoModel = {
  billingId: '',
  claimMethodKind: '',
  courseInfoRow: [],
  optionInfoRow: [],
  totalPrice: 0,
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
    section: '請求情報',
    fields: ['billingId', 'claimMethodKind'],
    name: ['請求ID', '会費請求方法'],
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
 * 請求情報取得APIレスポンスから基本情報データモデルへの変換
 */
const convertToBillingInfoModel = (
  response: ScrMem0014GetBillingInfoResponse,
  contractBase: ScrMem0014CalculateAmountMembershipfeediscountincreaseResponse
): BillingInfoModel => {
  let totalPrice = contractBase.afterFeeDiscount.courseInfo.courseFee;
  return {
    billingId: response.billingId,
    claimMethodKind: response.claimMethodKind,
    courseInfoRow: [
      {
        id: response.courseId,
        courseId: response.courseId,
        courseName: response.courseName,
        contractCount: 1,
        feeKind: contractBase.afterFeeDiscount.courseInfo.courseFee,
        useStartDate: new Date(response.useStartDate).toLocaleDateString(),
      },
    ],
    optionInfoRow: response.optionInfo.map((x) => {
      const optionInfo = contractBase.afterFeeDiscount.optionInfo.filter(
        (f) => f.optionServiceId === x.serviceId
      );
      totalPrice = totalPrice + optionInfo[0].optionServiceFee;
      return {
        id: x.serviceId,
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        contractCount: x.contractCount,
        feeKind: optionInfo[0].optionServiceFee,
        feeClaimFrequencyKind: x.feeClaimFrequencyKind,
        useStartDate: new Date(x.useStartDate).toLocaleDateString(),
      };
    }),
    totalPrice: totalPrice,
  };
};

/**
 * 請求情報取得APIレスポンスから基本情報データモデルへの変換
 */
const convertToHistoryBillingInfoModel = (
  response: registrationRequest
): BillingInfoModel => {
  return {
    billingId: response.billingInfo.billingId,
    // 会費請求方法
    claimMethodKind: response.billingInfo.claimMethodKind,
    // コース情報
    courseInfoRow: [
      {
        id: response.billingCourseInfo.courseId,
        courseId: response.billingCourseInfo.courseId,
        courseName: response.billingCourseInfo.courseName,
        contractCount: response.billingCourseInfo.courseNumber,
        feeKind: response.billingCourseInfo.discountPrice,
        useStartDate: new Date(
          response.billingCourseInfo.useStartDate
        ).toLocaleDateString(),
      },
    ],
    // オプション情報
    optionInfoRow: response.billingOptionInfo.map((x) => {
      return {
        id: x.serviceId,
        serviceId: x.serviceId,
        serviceName: x.serviceName,
        contractCount: x.contractCount,
        feeKind: x.discountPrice,
        feeClaimFrequencyKind: x.feeClaimFrequencyKind,
        useStartDate: new Date(x.useStartDate).toLocaleDateString(),
      };
    }),
    // 合計金額
    totalPrice: response.discountTotalPrice,
  };
};

/**
 * 法人情報詳細基本情報への変換
 */
const convertFromBillingInfo = (
  billingInfo: BillingInfoModel,
  contractBase: registrationRequest
): registrationRequest => {
  const newBillingInfo: registrationRequest = Object.assign(contractBase);
  newBillingInfo.billingInfo.billingId = billingInfo.billingId;
  newBillingInfo.billingInfo.claimMethodKind = billingInfo.claimMethodKind;
  newBillingInfo.billingCourseInfo.courseId =
    billingInfo.courseInfoRow[0].courseId;
  newBillingInfo.billingCourseInfo.courseName =
    billingInfo.courseInfoRow[0].courseName;
  newBillingInfo.billingCourseInfo.courseNumber =
    billingInfo.courseInfoRow[0].contractCount;
  newBillingInfo.billingCourseInfo.discountPrice =
    billingInfo.courseInfoRow[0].feeKind;
  newBillingInfo.billingCourseInfo.useStartDate = new Date(
    billingInfo.courseInfoRow[0].useStartDate
  );
  newBillingInfo.billingOptionInfo = billingInfo.optionInfoRow.map((x) => {
    return {
      serviceId: x.serviceId,
      serviceName: x.serviceName,
      contractCount: x.contractCount,
      discountPrice: x.feeKind,
      feeClaimFrequencyKind: x.feeClaimFrequencyKind,
      useStartDate: new Date(x.useStartDate),
    };
  });
  newBillingInfo.discountTotalPrice = billingInfo.totalPrice;

  return newBillingInfo;
};

/**
 * 法人情報詳細基本情報への変換
 */
const convertToContractBaseValue = (
  billingInfo: BillingInfoModel,
  contractBase: registrationRequest
): registrationRequest => {
  const newContractBase = Object.assign({}, contractBase);
  newContractBase.billingInfo.billingId = billingInfo.billingId;
  newContractBase.billingInfo.claimMethodKind = billingInfo.claimMethodKind;
  newContractBase.billingCourseInfo.courseId =
    billingInfo.courseInfoRow[0].courseId;
  newContractBase.billingCourseInfo.courseName =
    billingInfo.courseInfoRow[0].courseName;
  newContractBase.billingCourseInfo.courseNumber =
    billingInfo.courseInfoRow[0].contractCount;
  newContractBase.billingCourseInfo.discountPrice =
    billingInfo.courseInfoRow[0].feeKind;
  newContractBase.billingCourseInfo.useStartDate = new Date(
    billingInfo.courseInfoRow[0].useStartDate
  );
  newContractBase.billingOptionInfo = billingInfo.optionInfoRow.map((x) => {
    return {
      serviceId: x.serviceId,
      serviceName: x.serviceName,
      contractCount: x.contractCount,
      discountPrice: x.feeKind,
      feeClaimFrequencyKind: x.feeClaimFrequencyKind,
      useStartDate: new Date(x.useStartDate),
    };
  });
  newContractBase.discountTotalPrice = billingInfo.totalPrice;

  return newContractBase;
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

const ScrMem0014BillingTab = (props: {
  contractBase: registrationRequest;
  setContractBaseValue: (contractBase: registrationRequest) => void;
}) => {
  // router
  const { contractId, corporationId, logisticsBaseId } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // state
  const [selectValues, setSelectValues] = useState<SelectValueModel>(
    selectValuesInitialValues
  );
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

  const methods = useForm<BillingInfoModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields, errors },
    setValue,
    getValues,
    reset,
    watch,
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
        codeId: ['CDE-COM-0029'],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0029') {
          x.codeValueList.map((f) => {
            newSelectValues.claimMethodKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 請求先情報取得
      const getBillRequest = { corporationId: corporationId };
      const getBillResponse = await ScrMem9999GetBill(getBillRequest);
      getBillResponse.list.map((x) => {
        newSelectValues.billingIdSelectValues.push({
          value: x,
          displayValue: x,
        });
      });

      setSelectValues({
        claimMethodKindSelectValues:
          newSelectValues.claimMethodKindSelectValues,
        billingIdSelectValues: newSelectValues.billingIdSelectValues,
      });

      // 請求情報取得
      const getBillingInfoRequest = {
        corporationId: corporationId,
        contractId: contractId,
      };
      const getBillingInfoResponse = await ScrMem0014GetBillingInfo(
        getBillingInfoRequest
      );
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
      const billingInfo = convertToBillingInfoModel(
        getBillingInfoResponse,
        calculateAmountMembershipfeediscountincreaseResponse
      );

      reset(billingInfo);

      props.setContractBaseValue(
        convertToContractBaseValue(getValues(), props.contractBase)
      );
    };

    const historyInitialize = async (
      applicationId: string,
      corporationId: string
    ) => {
      // リスト取得
      const newSelectValues = selectValuesInitialValues;

      // コード管理マスタ情報取得
      const getCodeManagementMasterMultipleRequest = {
        codeId: ['CDE-COM-0029'],
      };
      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );
      getCodeManagementMasterMultipleResponse.resultList.map((x) => {
        if (x.codeId === 'CDE-COM-0029') {
          x.codeValueList.map((f) => {
            newSelectValues.claimMethodKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 請求先情報取得
      const getBillRequest = { corporationId: corporationId };
      const getBillResponse = await ScrMem9999GetBill(getBillRequest);
      getBillResponse.list.map((x) => {
        newSelectValues.billingIdSelectValues.push({
          value: x,
          displayValue: x,
        });
      });

      setSelectValues({
        claimMethodKindSelectValues:
          newSelectValues.claimMethodKindSelectValues,
        billingIdSelectValues: newSelectValues.billingIdSelectValues,
      });

      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response: registrationRequest = (
        await memApiClient.post('/scr-mem-9999/get-history-info', request)
      ).data;
      const billingInfo = convertToHistoryBillingInfoModel(response);
      // 画面にデータを設定
      reset(billingInfo);
      props.setContractBaseValue(response);
    };

    if (contractId === undefined) return;
    if (corporationId === undefined) return;
    if (logisticsBaseId === undefined) return;

    if (applicationId !== null) {
      historyInitialize(applicationId, corporationId);
      return;
    }

    initialize(contractId, corporationId, logisticsBaseId);
  }, [contractId, corporationId, logisticsBaseId, applicationId, reset]);

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations/' + corporationId);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    methods.trigger();
    if (!methods.formState.isValid) return;
    if (contractId === undefined) return;
    if (corporationId === undefined) return;

    const errorList: errorList[] = [];
    const warningList: warningList[] = [];

    // 請求先IDの存在チェック
    if (getValues('billingId') === '') {
      warningList.push({
        warningCode: 'MSG-FR-WRN-00006',
        warningMessage: '請求先IDが選択されていません',
      });
    }

    // 請求情報入力チェック
    const checkMembershipfeediscountincreaseRequest = {
      contractId: contractId,
      corporationId: corporationId,
      billingId: getValues('billingId'),
    };
    const checkMembershipfeediscountincreaseResponse =
      await ScrMem0014CheckMembershipfeediscountincrease(
        checkMembershipfeediscountincreaseRequest
      );
    checkMembershipfeediscountincreaseResponse.errorList.map((x) => {
      errorList.push({
        errorCode: x.errorCode,
        errorMessage: x.errorMessage,
      });
    });
    checkMembershipfeediscountincreaseResponse.warnList.map((x) => {
      warningList.push({
        warningCode: x.errorCode,
        warningMessage: x.errorMessage,
      });
    });

    setScrCom00032PopupIsOpen(true);

    setScrCom0032PopupData({
      errorList: errorList,
      warningList: warningList,
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0014',
          screenName: '契約情報詳細',
          tabId: 26,
          tabName: '請求情報',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      changeExpectDate: '',
    });
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = (registrationChangeMemo: string) => {
    setScrCom00032PopupIsOpen(false);

    // 登録内容申請ポップアップを呼出
    setScrCom00033PopupIsOpen(true);
    setScrCom0033PopupData({
      screenId: 'SCR-MEM-0014',
      tabId: 26,
      applicationMoney: 0,
    });
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
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
    const billingInfo = convertFromBillingInfo(getValues(), props.contractBase);

    // 請求情報登録
    const request = Object.assign(billingInfo, {
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
      tabId: 'B-26',
    });
    await ScrMem0014ContractBillinginfoBase(request);

    props.setContractBaseValue(billingInfo);
  };

  /**
   * 登録内容申請ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const scrCom0033PopupHandlePopupCancel = () => {
    setScrCom00033PopupIsOpen(false);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 請求情報セクション */}
            <Section name='請求情報'>
              <RowStack>
                <ColStack>
                  {/* 《請求先》 */}
                  <CaptionLabel text='《請求先》' />
                  <Select
                    label='請求ID'
                    name='billingId'
                    selectValues={selectValues.billingIdSelectValues}
                    size='s'
                    blankOption
                  />
                  <Select
                    label='会費請求方法'
                    name='claimMethodKind'
                    selectValues={selectValues.claimMethodKindSelectValues}
                    size='s'
                    blankOption
                  />
                  {/* 《コース情報》 */}
                  <MarginBox justifyContent='left' mt={3}>
                    <CaptionLabel text='《コース情報》' />
                  </MarginBox>
                  <DataGrid
                    columns={courseInfoColumns}
                    rows={getValues('courseInfoRow')}
                  />
                  {/* 《オプション情報》 */}
                  <MarginBox justifyContent='left' mt={3}>
                    <CaptionLabel text='《オプション情報》' />
                  </MarginBox>
                  <DataGrid
                    columns={optionInfoColumns}
                    rows={getValues('optionInfoRow')}
                  />
                  {/* 《会費合計》 */}
                  <MarginBox justifyContent='left' mt={3}>
                    <CaptionLabel text='《会費合計》' />
                  </MarginBox>
                  <TextField
                    label='合計金額'
                    name='totalPrice'
                    size='s'
                    readonly
                  />
                </ColStack>
              </RowStack>
            </Section>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton disable={isReadOnly[0]} onClick={handleConfirm}>
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
    </>
  );
};

export default ScrMem0014BillingTab;
