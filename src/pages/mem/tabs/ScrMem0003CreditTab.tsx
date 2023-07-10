import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout/MainLayout';
import { Popup } from 'layouts/Popup';
import { Section } from 'layouts/Section/Section';
import { ColStack, ControlsStackItem, RightElementStack, RowStack, Stack } from 'layouts/Stack/Stack';

import { Button, CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DatePicker } from 'controls/DatePicker';
import { Select } from 'controls/Select/Select';
import { PriceTextField, TextField } from 'controls/TextField/TextField';
import { Typography } from 'controls/Typography';

import { useForm } from 'hooks/useForm';

import { AppContext } from 'providers/AppContextProvider';

import { generate } from 'utils/validation/BaseYup';
import { comApiClient, memApiClient } from 'providers/ApiClient';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { ScrMem0003GetCreditInfo, ScrMem0003GetCreditInfoRequest, ScrMem0003GetCreditInfoResponse, ScrMem0003RegistrationCreditInfo, ScrMem0003RegistrationCreditInfoRequest } from 'apis/mem/ScrMem0003Api';
import { WarningLabel } from 'controls/Label';
import { MarginBox } from 'layouts/Box';
import { useNavigate } from 'hooks/useNavigate';
import { TabDisabledsModel } from '../ScrMem0003Page';

import ScrCom0032Popup, {
  ColumnListModel,
  ScrCom0032PopupModel, SectionListModel,
} from 'pages/com/popups/ScrCom0032';
import { error } from 'console';


interface CreditInfoModel {
  corporationId: string;
  basicsCorporationCreditAmount: string;
  corporationCreditDealAmount: string;
  corporationCreditRemainingAmount: string;
  creditAdditionAmount: string;
  temporaryCorporationCreditAmount: string;
  temporaryCreditDate: string;
  temporaryCreditSettingDate: string;
  employeeName: string;
  changeEeason: string;
  approvalDocumentId: string;
  paymentExtensionCreditAmount: string;
  paymentExtensionDealAmount: string;
  paymentExtensionRemainingAmount: string;

  changeHistoryNumber: string,
}

/**
 * バリデーションスキーマ
 */
const validationSchama = generate(
  [
    'basicsCorporationCreditAmount',
    'corporationCreditRemainingAmount',
    'paymentExtensionCreditAmount'
  ]
);

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '法人与信情報',
    fields: [
      'basicsCorporationCreditAmount',
      'corporationCreditRemainingAmount'
    ],
    name: [
      '基本法人与信額',
      '法人与信残額'
    ]
  },
  {
    section: '支払延長可能与信情報',
    fields: [
      'paymentExtensionCreditAmount'
    ],
    name: [
      '支払延長与信額'
    ]
  }
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
  temporaryCreditDate: '',
  temporaryCreditSettingDate: '',
  employeeName: '',
  changeEeason: '',
  approvalDocumentId: '',
  paymentExtensionCreditAmount: '',
  paymentExtensionDealAmount: '',
  paymentExtensionRemainingAmount: '',

  changeHistoryNumber: '',
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorMessages: [{
    errorCode: '',
    errorMessage: ''
  }],
  warningMessages: [{
    errorCode: '',
    errorMessage: '',
  }],
  contentsList: {
    screenName:  '',
    screenId:  '',
    tabName:  '',
    tabId:  '',
    sectionList: [
      {
        sectionName:  '',
        columnList: [
          {
            columnName: '',
          }
        ]
      }
    ]
  },
  changeExpectDate: new Date()
};

const convertToCreditInfoModel = (
  response:ScrMem0003GetCreditInfoResponse,
  corporationId: string,
  changeHistoryNumber: string
):CreditInfoModel => {

  const temporaryCreditEndDate:Date = new Date(response.temporaryCreditEndDate);
  temporaryCreditEndDate.setDate(temporaryCreditEndDate.getDate() + 1);
  const temporaryCreditDateFlg = temporaryCreditEndDate < new Date() ? true : false;

  //業務日付が臨時与信有効期間内の場合、臨時法人与信額から法人与信取引額を減算、加算額を加算して表示
  const corporationCreditRemainingAmount = new Date(response.temporaryCreditStartDate) < new Date() && new Date(response.temporaryCreditEndDate) > new Date()?
   (response.temporaryCorporationCreditAmount - response.corporationCreditDealAmount)+response.creditAdditionAmount:
   (response.basicsCorporationCreditAmount - response.corporationCreditDealAmount)+response.creditAdditionAmount;

  const temporaryCreditDate =  new Date(response.temporaryCreditStartDate).toLocaleDateString() + ' ~ ' + new Date(response.temporaryCreditEndDate).toLocaleDateString();
   
  return{
    corporationId: corporationId,
    basicsCorporationCreditAmount: response.basicsCorporationCreditAmount.toLocaleString(),
    corporationCreditDealAmount: response.basicsCorporationCreditAmount.toLocaleString(),
    corporationCreditRemainingAmount: corporationCreditRemainingAmount.toLocaleString(),
    creditAdditionAmount: response.creditAdditionAmount.toLocaleString(),
    temporaryCorporationCreditAmount: temporaryCreditDateFlg?response.temporaryCorporationCreditAmount.toLocaleString():'',
    temporaryCreditDate: temporaryCreditDateFlg?temporaryCreditDate:'',
    temporaryCreditSettingDate: temporaryCreditDateFlg?new Date(response.temporaryCreditSettingDate).toLocaleDateString():'',
    employeeName: temporaryCreditDateFlg?response.employeeName:'',
    changeEeason: temporaryCreditDateFlg?response.changeEeason:'',
    approvalDocumentId: temporaryCreditDateFlg?response.approvalDocumentId:'',
    paymentExtensionCreditAmount: response.paymentExtensionCreditAmount.toLocaleString(),
    paymentExtensionDealAmount: response.paymentExtensionDealAmount.toLocaleString(),
    paymentExtensionRemainingAmount: (response.paymentExtensionCreditAmount-response.paymentExtensionDealAmount).toLocaleString(),

    changeHistoryNumber: changeHistoryNumber,
  }
}

/**
 * 変更した項目から登録・変更内容データへの変換
 */
const convertToSectionList = (dirtyFields: object): SectionListModel[] => {
  const fields = Object.keys(dirtyFields);
  const sectionList: SectionListModel[] = [];
  sectionDef.forEach((d) => {
    const columnList: ColumnListModel[] = [];
    fields.forEach((f) => {
      if(d.fields.includes(f)){
        columnList.push({columnName: d.name[d.fields.indexOf(f)]})
      }
    })
    sectionList.push({
      sectionName: d.section,
      columnList: columnList
    })
  })
  return sectionList;
};

const convertFromRegistrationCreditInfoModel= (
  creditInfo: CreditInfoModel,
  user: string,
  changeMemo:string
):ScrMem0003RegistrationCreditInfoRequest => {
  return{
    // 法人ID
    corporationId: creditInfo.corporationId,
    // 基本法人与信額
    basicsCorporationCreditAmount: Number(creditInfo.basicsCorporationCreditAmount.replace(/,/g, '')),
    // 法人与信取引額
    corporationCreditDealAmount: Number(creditInfo.corporationCreditDealAmount.replace(/,/g, '')),
    // 与信加算額
    creditAdditionAmount: Number(creditInfo.creditAdditionAmount.replace(/,/g, '')),
    // 支払延長与信額
    paymentExtensionCreditAmount: Number(creditInfo.paymentExtensionCreditAmount.replace(/,/g, '')),
    // 支払延長取引額
    paymentExtensionDealAmount: Number(creditInfo.paymentExtensionDealAmount.replace(/,/g, '')),
    // 申請従業員ID
    applicationEmployeeId: user,
    // 業務日付
    businessDate: new Date(),
    // 登録変更メモ
    registrationChangeMemo: changeMemo,
    // 画面ID
    screenId: 'SCR-MEM-0003',
    // タブID	
    tabId	: 'B-4'
  }
}

// component
const ScrMem0003CreditTab = (props: { chengeTabDisableds: (tabDisableds: TabDisabledsModel) => void; }) => {
  // router
  const { corporationId } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  const { appContext } = useContext(AppContext);
  
	//state
	const [changeHistory, setChangeHistory] = useState<any>([]);
	const [corporationCreditRemainingAmountState, setCorporationCreditRemainingAmountState] = useState<any>(0);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);
  // form
  const methods = useForm<CreditInfoModel>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchama),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    setValue,
    getValues,
    reset,
    watch,
  } = methods;

  useEffect(() => {
    const initialize = async (corporationId:string) => {
      // 与信情報取得API
      const request: ScrMem0003GetCreditInfoRequest = {
        corporationId: corporationId
      };
      const response = await ScrMem0003GetCreditInfo(request);
      const corporationBasic = convertToCreditInfoModel(response, corporationId, '');
      reset(corporationBasic);
      setCorporationCreditRemainingAmountState(Number(corporationBasic.corporationCreditRemainingAmount.replace(/,/g, '')));

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0003',
        tabId: 'B-4',
        getKeyValue: corporationId,
        businessDate: new Date() // TODO:業務日付取得方法実装待ち、new Date()で登録
      }

      const getChangeDate = (await comApiClient.post('/com/get-change-date', getChangeDateRequest)).data;

      const chabngeHistory = getChangeDate.changeExpectDateInfo.map((e: { changeHistoryNumber: number; changeExpectDate: Date; }) => {
        return{
          value: e.changeHistoryNumber,
          displayValue: new Date(e.changeExpectDate).toLocaleDateString(),
        }
      })
      setChangeHistory(chabngeHistory);
    };

    const historyInitialize  = async (corporationId:string, applicationId:string) => {
      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId
      };
      const response = (await memApiClient.post('/get-history-info', request)).data;
      const corporationBasic = convertToCreditInfoModel(response, corporationId, applicationId);
      reset(corporationBasic);
      setCorporationCreditRemainingAmountState(Number(corporationBasic.corporationCreditRemainingAmount.replace(/,/g, '')));

      // 変更予定日取得
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0003',
        tabId: 'B-4',
        getKeyValue: corporationId,
        businessDate: new Date() // TODO:業務日付取得方法実装待ち、new Date()で登録
      }
      
      const getChangeDate = (await comApiClient.post('/com/get-change-date', getChangeDateRequest)).data;

      const chabngeHistory = getChangeDate.changeExpectDateInfo.map((e: { changeHistoryNumber: number; changeExpectDate: Date; }) => {
        return{
          value: e.changeHistoryNumber,
          displayValue: new Date(e.changeExpectDate).toLocaleDateString(),
        }
      })
      setChangeHistory(chabngeHistory);
    }

    if(corporationId !== undefined && applicationId !== null){
      historyInitialize(corporationId, applicationId)
      return;
    }

    if(corporationId !== undefined) {
      initialize(corporationId)
      return;
    };

  }, [corporationId, applicationId]);

  // 法人与信残額変更
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name !== 'corporationCreditRemainingAmount') return;
      if(getValues('corporationCreditRemainingAmount').includes(',')){
        const beforeAmount = corporationCreditRemainingAmountState;
        const afterAmount = Number(getValues('corporationCreditRemainingAmount').replace(/,/g, ''));
        setValue("creditAdditionAmount", (afterAmount  - beforeAmount).toLocaleString()); 
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
      changeHistoryNumber: getValues('changeHistoryNumber'),
    };
    const response = (await memApiClient.post('/get-history-info', request)).data;
    const CreditInfo = convertToCreditInfoModel(response, corporationId, getValues('changeHistoryNumber'));

    // 画面にデータを設定
    reset(CreditInfo);

    props.chengeTabDisableds({
      ScrMem0003BasicTab: true,
      ScrMem0003CreditTab: false,
      ScrMem0003CreditLimitTab: true,
      ScrMem0003ContractTab: true,
      ScrMem0003BaseTab: true,
      ScrMem0003DealHistoryTab: true,
      ScrMem0003ChangeHistoryTab: true,
    });
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = () => {
    
    const paymentExtensionCreditAmount = getValues('paymentExtensionCreditAmount');
    const basicsCorporationCreditAmount = getValues('basicsCorporationCreditAmount');
    const errorList = []
    if(paymentExtensionCreditAmount > basicsCorporationCreditAmount){
      errorList.push({
        errorCode: 'MSG-FR-ERR-00059',
        errorMessage: '支払延長与信は基本法人与信額を下回る金額で入力してください'
      })
    }

    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorMessages: errorList,
      warningMessages: [],
      contentsList: {
        screenName:  '',
        screenId:  '',
        tabName:  '',
        tabId:  '',
        sectionList: convertToSectionList(dirtyFields)
      },
      changeExpectDate: new Date()
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
  const handlePopupConfirm = async (changeMemo:string) => {
    
    props.chengeTabDisableds({
      ScrMem0003BasicTab: false,
      ScrMem0003CreditTab: false,
      ScrMem0003CreditLimitTab: false,
      ScrMem0003ContractTab: false,
      ScrMem0003BaseTab: false,
      ScrMem0003DealHistoryTab: false,
      ScrMem0003ChangeHistoryTab: false,
    });
    
    setIsOpenPopup(false);

    // 法人基本情報変更申請
    const request = convertFromRegistrationCreditInfoModel(getValues(), appContext.user, changeMemo);
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
                    <TextField
                      label='有効期間'
                      name='temporaryCreditDate'
                      readonly
                    />
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
                {changeHistory.length <= 0?<></>:
                  <RightElementStack>
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
                    <MarginBox mb={6}>
                      <DatePicker label='変更予定日' name='changeHistoryDate' />
                    </MarginBox>
                  </RightElementStack>
                }
              </Grid>
            </Grid>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
        
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      <ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  );
};

export default ScrMem0003CreditTab;
