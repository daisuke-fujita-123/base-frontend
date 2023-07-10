import { yupResolver } from '@hookform/resolvers/yup';
import { ScrMem0003GetCreditLimitInfo, ScrMem0003GetCreditLimitInfoRequest, ScrMem0003GetCreditLimitInfoResponse, ScrMem0003RegistrationCreditLimitInfo, ScrMem0003RegistrationCreditLimitInfoRequest } from 'apis/mem/ScrMem0003Api';
import { CancelButton, ConfirmButton } from 'controls/Button';
import { Radio } from 'controls/Radio';
import { PriceTextField, TextField } from 'controls/TextField';
import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { RowStack, ColStack, ControlsStackItem, Stack } from 'layouts/Stack';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { generate } from 'utils/validation/BaseYup';

import ScrCom0032Popup, {
  ColumnListModel,
  ScrCom0032PopupModel, SectionListModel,
} from 'pages/com/popups/ScrCom0032';
import { AppContext } from 'providers/AppContextProvider';

interface CreditLimitInfoModel {
  // 法人ID
  corporationId: string;
  // 自動制限フラグ
  automaticLimitFlag: string;
  // 制限状況フラグ
  limitStatusKind: string;
  // 制限種別
  limitKind: string;
}

/**
 * バリデーションスキーマ
 */
const validationSchama = generate(
  [
    'automaticLimitFlag',
    'limitStatusKind',
  ]
);

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '与信制限情報',
    fields: [
      'automaticLimitFlag',
      'limitStatusKind'
    ],
    name: [
      '自動制限フラグ',
      '制限状況フラグ'
    ]
  },
];

/**
 * 初期データ
 */
const initialValues: CreditLimitInfoModel = {
  corporationId: '',
  automaticLimitFlag: '0',
  limitStatusKind: '1',
  limitKind: '',
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

const convertToCreditLimitInfoModel = (
  response:ScrMem0003GetCreditLimitInfoResponse,
  corporationId: string
):CreditLimitInfoModel => {
  return {
    corporationId: corporationId,
    automaticLimitFlag: response.automaticLimitFlag?'0':'1',
    limitStatusKind: response.limitStatusKind,
    limitKind: response.limitKind === '1'?'自動':'手動',
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

const convertFromRegistrationCreditLimitInfo = (
  creditLimitInfo: CreditLimitInfoModel,
  user: string,
  changeMemo:string
): ScrMem0003RegistrationCreditLimitInfoRequest => {
  return{
    // 法人ID
    corporationId: creditLimitInfo.corporationId,
    automaticLimitFlag: creditLimitInfo.automaticLimitFlag === '0'?true:false,
    limit_statusKind: creditLimitInfo.limitStatusKind,
    limitKind: creditLimitInfo.limitKind === '自動'?'1':'2',
    applicationEmployeeId: user,
    registrationChangeMemo: changeMemo,
    screenId: 'SCR-MEM-0003',
    tabId: 'B-4',
  }
}


const ScrMem0003CreditLimitTab = () => {
  // router
  const { corporationId } = useParams();
  const navigate = useNavigate();
  const { appContext } = useContext(AppContext);

  // state
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
  useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);
  // form
  const methods = useForm<CreditLimitInfoModel>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchama),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    reset,
    getValues
  } = methods;

  useEffect(() => {
    const initialize = async (corporationId:string) => {
      // 与信情報取得API
      const request: ScrMem0003GetCreditLimitInfoRequest = {
        corporationId: corporationId
      };
      const response = await ScrMem0003GetCreditLimitInfo(request);
      const corporationBasic = convertToCreditLimitInfoModel(response, corporationId);
      reset(corporationBasic);
      
    }

    if(corporationId !== undefined) {
      initialize(corporationId)
      return;
    };

  }, [corporationId]);
  

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = () => {
    
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorMessages: [],
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
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (changeMemo:string) => {
    
    setIsOpenPopup(false);

    // 法人基本情報変更申請
    const request = convertFromRegistrationCreditLimitInfo(getValues(), appContext.user, changeMemo);
    const response = await ScrMem0003RegistrationCreditLimitInfo(request);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations');
  };

  const automaticLimitFlagRadio = [
    { value: '0', displayValue: '可' },
    { value: '1', displayValue: '否' },
  ];
  const limitStatusKindRadio = [
    { value: '1', displayValue: '制限あり' },
    { value: '2', displayValue: '制限なし' },
  ];

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Section name={'与信制限情報'}>
            {/* 与信制限情報セクション */}
              <RowStack spacing={8}>
                <ColStack>
                  <ControlsStackItem>
                    <Radio 
                      label='自動制限可否' 
                      name='automaticLimitFlag' 
                      radioValues={automaticLimitFlagRadio}
                      row={false}
                    />
                  </ControlsStackItem>
                  <ControlsStackItem>
                    <Radio 
                      label='制限状況' 
                      name='limitStatusKind' 
                      radioValues={limitStatusKindRadio}
                      row={false}
                    />
                  </ControlsStackItem>
                  <ControlsStackItem>
                    <TextField
                      label='制限種別'
                      name='limitKind'
                      readonly
                    />
                  </ControlsStackItem>
                </ColStack>
              </RowStack>
            </Section>
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

export default ScrMem0003CreditLimitTab;
