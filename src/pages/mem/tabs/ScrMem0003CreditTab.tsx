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

import { MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout/MainLayout';
import { Section } from 'layouts/Section/Section';
import {
  ColStack,
  InputRowStack,
  RightElementStack,
  RowStack,
  Stack,
} from 'layouts/Stack/Stack';

import { CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DatePicker } from 'controls/DatePicker';
import { WarningLabel } from 'controls/Label';
import { Select } from 'controls/Select/Select';
import { PriceTextField, TextField } from 'controls/TextField/TextField';
import { Typography } from 'controls/Typography';

import { ScrCom9999GetChangeDate } from 'apis/com/ScrCom9999Api';
import {
  ScrMem0003GetCreditInfo,
  ScrMem0003GetCreditInfoRequest,
  ScrMem0003GetCreditInfoResponse,
  ScrMem0003RegistrationCorporationInfoRequest,
  ScrMem0003RegistrationCreditInfo,
} from 'apis/mem/ScrMem0003Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

import { TabDisabledsModel } from '../ScrMem0003Page';

interface CreditInfoModel {
  // 法人ID
  corporationId: string;
  // 基本法人与信額
  basicsCorporationCreditAmount: string;
  // 法人与信取引額
  corporationCreditDealAmount: string;
  // 法人与信残額
  corporationCreditRemainingAmount: string;
  // 加算額
  creditAdditionAmount: string;
  // 臨時法人与信額
  temporaryCorporationCreditAmount: string;
  // 臨時与信開始日
  temporaryCreditStartDate: string;
  // 臨時与信終了日
  temporaryCreditEndDate: string;
  // 設定日
  temporaryCreditSettingDate: string;
  // 更新者
  employeeName: string;
  // 変更理由
  changeEeason: string;
  // 稟議書ID
  approvalDocumentId: string;
  // 支払延長与信額
  paymentExtensionCreditAmount: string;
  // 支払延長取引額
  paymentExtensionDealAmount: string;
  // 支払延長残額
  paymentExtensionRemainingAmount: string;

  changeExpectedDate: string;
  changeHistoryNumber: string;
}

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  basicsCorporationCreditAmount: yup
    .string()
    .label('基本法人与信額')
    .max(11)
    .numberWithComma(),
  corporationCreditRemainingAmount: yup
    .string()
    .label('法人与信残額')
    .max(11)
    .numberWithComma(),
  paymentExtensionCreditAmount: yup
    .string()
    .label('支払延長与信額')
    .max(11)
    .numberWithComma(),
};

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '法人与信情報',
    fields: [
      'basicsCorporationCreditAmount',
      'corporationCreditRemainingAmount',
    ],
    name: ['基本法人与信額', '法人与信残額'],
  },
  {
    section: '支払延長可能与信情報',
    fields: ['paymentExtensionCreditAmount'],
    name: ['支払延長与信額'],
  },
];

/**
 * 初期データ
 */
const initialValues: CreditInfoModel = {
  corporationId: '',
  basicsCorporationCreditAmount: '',
  corporationCreditDealAmount: '',
  corporationCreditRemainingAmount: '',
  creditAdditionAmount: '',
  temporaryCorporationCreditAmount: '',
  temporaryCreditStartDate: '',
  temporaryCreditEndDate: '',
  temporaryCreditSettingDate: '',
  employeeName: '',
  changeEeason: '',
  approvalDocumentId: '',
  paymentExtensionCreditAmount: '',
  paymentExtensionDealAmount: '',
  paymentExtensionRemainingAmount: '',

  changeExpectedDate: '',
  changeHistoryNumber: '',
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: null,
};

/**
 * 与信情報取得APIリクエストから与信情報データモデルへの変換
 */
const convertToCreditInfoModel = (
  response: ScrMem0003GetCreditInfoResponse,
  corporationId: string,
  changeExpectedDate: string,
  applicationId: string
): CreditInfoModel => {
  const temporaryCreditEndDate: Date = new Date(
    response.temporaryCreditEndDate
  );
  temporaryCreditEndDate.setDate(temporaryCreditEndDate.getDate() + 1);
  const temporaryCreditDateFlg =
    temporaryCreditEndDate < new Date() ? true : false;

  //業務日付が臨時与信有効期間内の場合、臨時法人与信額から法人与信取引額を減算、加算額を加算して表示
  const corporationCreditRemainingAmount =
    new Date(response.temporaryCreditStartDate) < new Date() &&
    new Date(response.temporaryCreditEndDate) > new Date()
      ? response.temporaryCorporationCreditAmount -
        response.corporationCreditDealAmount +
        response.creditAdditionAmount
      : response.basicsCorporationCreditAmount -
        response.corporationCreditDealAmount +
        response.creditAdditionAmount;

  return {
    corporationId: corporationId,
    basicsCorporationCreditAmount:
      response.basicsCorporationCreditAmount.toLocaleString(),
    corporationCreditDealAmount:
      response.basicsCorporationCreditAmount.toLocaleString(),
    corporationCreditRemainingAmount:
      corporationCreditRemainingAmount.toLocaleString(),
    creditAdditionAmount: response.creditAdditionAmount.toLocaleString(),
    temporaryCorporationCreditAmount: temporaryCreditDateFlg
      ? response.temporaryCorporationCreditAmount.toLocaleString()
      : '',
    temporaryCreditStartDate: temporaryCreditDateFlg
      ? new Date(response.temporaryCreditStartDate).toLocaleDateString()
      : '',
    temporaryCreditEndDate: temporaryCreditDateFlg
      ? new Date(response.temporaryCreditEndDate).toLocaleDateString()
      : '',
    temporaryCreditSettingDate: temporaryCreditDateFlg
      ? new Date(response.temporaryCreditSettingDate).toLocaleDateString()
      : '',
    employeeName: temporaryCreditDateFlg ? response.employeeName : '',
    changeEeason: temporaryCreditDateFlg ? response.changeEeason : '',
    approvalDocumentId: temporaryCreditDateFlg
      ? response.approvalDocumentId
      : '',
    paymentExtensionCreditAmount:
      response.paymentExtensionCreditAmount.toLocaleString(),
    paymentExtensionDealAmount:
      response.paymentExtensionDealAmount.toLocaleString(),
    paymentExtensionRemainingAmount: (
      response.paymentExtensionCreditAmount -
      response.paymentExtensionDealAmount
    ).toLocaleString(),

    changeExpectedDate: changeExpectedDate,
    changeHistoryNumber: applicationId,
  };
};

/**
 * 与信情報取得APIリクエストから法人情報詳細モデルへの変換
 */
const convertToScrMem0003DataModel = (
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest,
  response: CreditInfoModel
): ScrMem0003RegistrationCorporationInfoRequest => {
  const newScrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest =
    Object.assign(scrMem0003Data);

  newScrMem0003Data.basicsCorporationCreditAmount = Number(
    response.basicsCorporationCreditAmount.replace(/,/g, '')
  );
  newScrMem0003Data.corporationCreditDealAmount = Number(
    response.corporationCreditDealAmount.replace(/,/g, '')
  );
  newScrMem0003Data.creditAdditionAmount = Number(
    response.creditAdditionAmount.replace(/,/g, '')
  );
  newScrMem0003Data.temporaryCorporationCreditAmount = Number(
    response.temporaryCorporationCreditAmount.replace(/,/g, '')
  );
  newScrMem0003Data.temporaryCreditStartDate =
    response.temporaryCreditStartDate;
  newScrMem0003Data.temporaryCreditEndDate = response.temporaryCreditEndDate;
  newScrMem0003Data.temporaryCreditSettingDate =
    response.temporaryCreditSettingDate;
  newScrMem0003Data.employeeName = response.employeeName;
  newScrMem0003Data.changeEeason = response.changeEeason;
  newScrMem0003Data.approvalDocumentId = response.approvalDocumentId;
  newScrMem0003Data.paymentExtensionCreditAmount = Number(
    response.paymentExtensionCreditAmount.replace(/,/g, '')
  );
  newScrMem0003Data.paymentExtensionDealAmount = Number(
    response.paymentExtensionDealAmount.replace(/,/g, '')
  );

  return scrMem0003Data;
};

/**
 * 変更した項目から登録・変更内容データへの変換
 */
const convertToSectionList = (dirtyFields: object): sectionList[] => {
  const fields = Object.keys(dirtyFields);
  const sectionList: sectionList[] = [];
  sectionDef.forEach((d) => {
    const columnList: columnList[] = [];
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
 * 登録APIリクエストへの変換
 */
const convertFromRegistrationCreditInfoModel = (
  creditInfo: CreditInfoModel,
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest,
  user: string,
  registrationChangeMemo: string
): ScrMem0003RegistrationCorporationInfoRequest => {
  const newScrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest =
    Object.assign(scrMem0003Data);

  newScrMem0003Data.basicsCorporationCreditAmount = Number(
    creditInfo.basicsCorporationCreditAmount.replace(/,/g, '')
  );
  newScrMem0003Data.corporationCreditDealAmount = Number(
    creditInfo.corporationCreditDealAmount.replace(/,/g, '')
  );
  newScrMem0003Data.creditAdditionAmount = Number(
    creditInfo.creditAdditionAmount.replace(/,/g, '')
  );
  newScrMem0003Data.temporaryCorporationCreditAmount = Number(
    creditInfo.temporaryCorporationCreditAmount.replace(/,/g, '')
  );
  newScrMem0003Data.temporaryCreditStartDate =
    creditInfo.temporaryCreditStartDate;
  newScrMem0003Data.temporaryCreditEndDate = creditInfo.temporaryCreditEndDate;
  newScrMem0003Data.temporaryCreditSettingDate =
    creditInfo.temporaryCreditSettingDate;
  newScrMem0003Data.employeeName = creditInfo.employeeName;
  newScrMem0003Data.changeEeason = creditInfo.changeEeason;
  newScrMem0003Data.approvalDocumentId = creditInfo.approvalDocumentId;
  newScrMem0003Data.paymentExtensionCreditAmount = Number(
    creditInfo.paymentExtensionCreditAmount.replace(/,/g, '')
  );
  newScrMem0003Data.paymentExtensionDealAmount = Number(
    creditInfo.paymentExtensionDealAmount.replace(/,/g, '')
  );

  newScrMem0003Data.applicationEmployeeId = user;
  newScrMem0003Data.changeExpectDate =
    creditInfo.changeExpectedDate !== ''
      ? creditInfo.changeExpectedDate
      : new Date().toLocaleDateString();
  newScrMem0003Data.registrationChangeMemo = registrationChangeMemo;
  newScrMem0003Data.screenId = 'SCR-MEM-0003';
  newScrMem0003Data.tabId = 'B-4';

  return newScrMem0003Data;
};

// component
const ScrMem0003CreditTab = (props: {
  chengeTabDisableds: (tabDisableds: TabDisabledsModel) => void;
  chengeScrMem0003Data: (
    scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest
  ) => void;
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest;
}) => {
  // router
  const { corporationId } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  //state
  const [changeHistory, setChangeHistory] = useState<any>([]);
  const [
    corporationCreditRemainingAmountState,
    setCorporationCreditRemainingAmountState,
  ] = useState<any>(0);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckisOpen, setChangeHistoryDateCheckisOpen] =
    useState<boolean>(false);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0003') === -1
  );

  // form
  const methods = useForm<CreditInfoModel>({
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

  useEffect(() => {
    const initialize = async (corporationId: string) => {
      // 与信情報取得API
      const request: ScrMem0003GetCreditInfoRequest = {
        corporationId: corporationId,
      };
      const response = await ScrMem0003GetCreditInfo(request);
      const corporationBasic = convertToCreditInfoModel(
        response,
        corporationId,
        '',
        ''
      );
      reset(corporationBasic);
      setCorporationCreditRemainingAmountState(
        Number(
          corporationBasic.corporationCreditRemainingAmount.replace(/,/g, '')
        )
      );

      // 取得データ保持
      const scrMem0003Data = convertToScrMem0003DataModel(
        props.scrMem0003Data,
        corporationBasic
      );
      props.chengeScrMem0003Data(scrMem0003Data);

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0003',
        tabId: 4,
        masterId: corporationId,
        businessDate: user.taskDate,
      };

      const getChangeDate = await ScrCom9999GetChangeDate(getChangeDateRequest);

      const chabngeHistory = getChangeDate.changeExpectDateInfo.map((x) => {
        return {
          value: x.changeHistoryNumber,
          displayValue: new Date(x.changeExpectDate).toLocaleDateString(),
        };
      });
      setChangeHistory(chabngeHistory);
    };

    const historyInitialize = async (
      corporationId: string,
      applicationId: string
    ) => {
      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response = (await memApiClient.post('/get-history-info', request))
        .data;
      const corporationBasic = convertToCreditInfoModel(
        response,
        corporationId,
        '',
        applicationId
      );
      reset(corporationBasic);
      setCorporationCreditRemainingAmountState(
        Number(
          corporationBasic.corporationCreditRemainingAmount.replace(/,/g, '')
        )
      );

      // 取得データ保持
      const scrMem0003Data = convertToScrMem0003DataModel(
        props.scrMem0003Data,
        corporationBasic
      );
      props.chengeScrMem0003Data(scrMem0003Data);

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0003',
        tabId: 4,
        masterId: corporationId,
        businessDate: user.taskDate,
      };
      const getChangeDate = await ScrCom9999GetChangeDate(getChangeDateRequest);

      const chabngeHistory = getChangeDate.changeExpectDateInfo.map((e) => {
        return {
          value: e.changeHistoryNumber,
          displayValue: new Date(e.changeExpectDate).toLocaleDateString(),
        };
      });
      setChangeHistory(chabngeHistory);
    };

    if (corporationId === 'new') return;

    if (corporationId !== undefined && applicationId !== null) {
      historyInitialize(corporationId, applicationId);
      return;
    }

    if (corporationId !== undefined) {
      initialize(corporationId);
      return;
    }
  }, [corporationId, applicationId]);

  // 法人与信残額変更
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name !== 'corporationCreditRemainingAmount') return;
      if (getValues('corporationCreditRemainingAmount').includes(',')) {
        const beforeAmount = corporationCreditRemainingAmountState;
        const afterAmount = Number(
          getValues('corporationCreditRemainingAmount').replace(/,/g, '')
        );
        setValue(
          'creditAdditionAmount',
          (afterAmount - beforeAmount).toLocaleString()
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    if (!corporationId) return;

    // 法人基本情報取得API
    const request = {
      changeHistoryNumber: getValues('changeExpectedDate'),
    };
    const response = (await memApiClient.post('/get-history-info', request))
      .data;
    const CreditInfo = convertToCreditInfoModel(
      response,
      corporationId,
      getValues('changeExpectedDate'),
      ''
    );

    // 画面にデータを設定
    reset(CreditInfo);

    props.chengeTabDisableds({
      ScrMem0003BasicTab: true,
      ScrMem0003CreditTab: false,
      ScrMem0003CreditLimitTab: true,
      ScrMem0003ContractTab: true,
      ScrMem0003BaseTab: true,
      ScrMem0003DealHistoryTab: true,
      ScrMem0003BranchNumberTab: true,
      ScrMem0003ChangeHistoryTab: true,
    });
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const onClickConfirm = () => {
    if (Object.keys(errors).length) return;
    // 反映予定日整合性チェック
    setChangeHistoryDateCheckisOpen(true);
  };

  /**
   * 確定ボタンクリック時（反映予定日整合性チェック後）のイベントハンドラ
   */
  const handleConfirm = (checkFlg: boolean) => {
    setChangeHistoryDateCheckisOpen(false);
    if (!checkFlg) return;

    const paymentExtensionCreditAmount = getValues(
      'paymentExtensionCreditAmount'
    );
    const basicsCorporationCreditAmount = getValues(
      'basicsCorporationCreditAmount'
    );
    const errorList = [];
    if (paymentExtensionCreditAmount > basicsCorporationCreditAmount) {
      errorList.push({
        errorCode: 'MSG-FR-ERR-00059',
        errorMessage:
          '支払延長与信は基本法人与信額を下回る金額で入力してください',
      });
    }

    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: errorList,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0003',
          screenName: '法人情報詳細',
          tabId: 4,
          tabName: '与信情報',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      changeExpectDate: getValues('changeExpectedDate'),
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations');
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (changeMemo: string) => {
    setIsOpenPopup(false);

    // 法人基本情報変更申請
    const request = convertFromRegistrationCreditInfoModel(
      getValues(),
      props.scrMem0003Data,
      user.employeeId,
      changeMemo
    );
    const response = await ScrMem0003RegistrationCreditInfo(request);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Section name={'法人与信情報'}>
              {/* 法人与信情報セクション */}
              <RowStack spacing={50}>
                <ColStack>
                  <PriceTextField
                    label='基本法人与信額'
                    name='basicsCorporationCreditAmount'
                    required
                  />
                  <PriceTextField
                    label='法人与信取引額'
                    name='corporationCreditDealAmount'
                    readonly
                  />
                  <PriceTextField
                    label='法人与信残額'
                    name='corporationCreditRemainingAmount'
                  />
                  <PriceTextField
                    label='加算額'
                    name='creditAdditionAmount'
                    readonly
                  />
                </ColStack>
                <ColStack>
                  <PriceTextField
                    label='臨時法人与信額'
                    name='temporaryCorporationCreditAmount'
                    readonly
                  />
                  <FromTo label='有効期間'>
                    <InputRowStack>
                      <ColStack>
                        <TextField name={'temporaryCreditStartDate'} readonly />
                      </ColStack>
                    </InputRowStack>
                    <InputRowStack>
                      <ColStack>
                        <TextField name={'temporaryCreditEndDate'} readonly />
                      </ColStack>
                    </InputRowStack>
                  </FromTo>
                  <TextField
                    label='設定日'
                    name='temporaryCreditSettingDate'
                    readonly
                  />
                  <TextField
                    label='更新者'
                    name='employeeName'
                    readonly
                    size='m'
                  />
                  <TextField
                    label='変更理由'
                    name='changeEeason'
                    readonly
                    size='m'
                  />
                  <TextField
                    label='稟議書ID'
                    name='approvalDocumentId'
                    readonly
                  />
                </ColStack>
              </RowStack>
            </Section>
            <Section name={'支払延長可能与信情報'}>
              {/* 支払延長可能与信情報セクション */}
              <RowStack spacing={50}>
                <ColStack>
                  <PriceTextField
                    label='支払延長与信額'
                    name='paymentExtensionCreditAmount'
                  />
                  <PriceTextField
                    label='支払延長取引額'
                    name='paymentExtensionDealAmount'
                    readonly
                  />
                  <PriceTextField
                    label='支払延長残額'
                    name='paymentExtensionRemainingAmount'
                    readonly
                  />
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
                  {changeHistory.length <= 0 ? (
                    <></>
                  ) : (
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
      {isOpenPopup ? (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          handleRegistConfirm={handlePopupConfirm}
          handleApprovalConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      ) : (
        ''
      )}

      {/* 反映予定日整合性チェック */}
      {changeHistoryDateCheckisOpen ? (
        <ChangeHistoryDateCheckUtil
          changeExpectedDate={getValues('changeExpectedDate')}
          changeHistoryNumber={getValues('changeHistoryNumber')}
          isChangeHistoryBtn={isChangeHistoryBtn}
          changeHistory={changeHistory}
          isOpen={changeHistoryDateCheckisOpen}
          handleConfirm={handleConfirm}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrMem0003CreditTab;

