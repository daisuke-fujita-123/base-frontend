import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, ControlsStackItem, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Radio } from 'controls/Radio';
import { TextField } from 'controls/TextField';

import {
  ScrMem0003GetCreditLimitInfo,
  ScrMem0003GetCreditLimitInfoRequest,
  ScrMem0003GetCreditLimitInfoResponse,
  ScrMem0003RegistrationCorporationInfoRequest,
  ScrMem0003RegistrationCreditLimitInfo,
} from 'apis/mem/ScrMem0003Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

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
const validationSchama = {
  automaticLimitFlag: yup.string().label('自動制限可否'),
  limitStatusKind: yup.string().label('制限状況'),
};

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '与信制限情報',
    fields: ['automaticLimitFlag', 'limitStatusKind'],
    name: ['自動制限フラグ', '制限状況フラグ'],
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
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: null,
};

/**
 * 与信制限取得APIリクエストから与信制限モデルへの変換
 */
const convertToCreditLimitInfoModel = (
  response: ScrMem0003GetCreditLimitInfoResponse,
  corporationId: string
): CreditLimitInfoModel => {
  return {
    corporationId: corporationId,
    automaticLimitFlag: response.automaticLimitFlag ? '0' : '1',
    limitStatusKind: response.limitStatusKind,
    limitKind: response.limitKind === '1' ? '自動' : '手動',
  };
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
 * 与信制限登録APIリクエストへの変換
 */
const convertFromRegistrationCreditLimitInfo = (
  creditLimitInfo: CreditLimitInfoModel,
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest,
  user: string,
  changeMemo: string
): ScrMem0003RegistrationCorporationInfoRequest => {
  const newScrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest =
    Object.assign(scrMem0003Data);

  newScrMem0003Data.automaticLimitFlag =
    creditLimitInfo.automaticLimitFlag === '0' ? true : false;
  newScrMem0003Data.limitStatusKind = creditLimitInfo.limitStatusKind;
  newScrMem0003Data.limitStatusKind =
    creditLimitInfo.limitStatusKind === '1' ? '自動' : '手動';
  newScrMem0003Data.applicationEmployeeId = user;
  newScrMem0003Data.changeExpectDate = '';
  newScrMem0003Data.registrationChangeMemo = changeMemo;
  newScrMem0003Data.screenId = 'SCR-MEM-0003';
  newScrMem0003Data.tabId = 'B-4';

  return scrMem0003Data;
};

/**
 * 与信制限取得APIリクエストから法人情報詳細モデルへの変換
 */
const convertToScrMem0003DataModel = (
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest,
  response: CreditLimitInfoModel
): ScrMem0003RegistrationCorporationInfoRequest => {
  const newScrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest =
    Object.assign(scrMem0003Data);

  newScrMem0003Data.automaticLimitFlag =
    response.automaticLimitFlag === '0' ? true : false;
  newScrMem0003Data.limitStatusKind = response.limitStatusKind;
  newScrMem0003Data.limitStatusKind =
    response.limitStatusKind === '1' ? '自動' : '手動';

  return scrMem0003Data;
};

const ScrMem0003CreditLimitTab = (props: {
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

  // state
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0003') === -1
  );
  // form
  const methods = useForm<CreditLimitInfoModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    reset,
    getValues,
  } = methods;

  useEffect(() => {
    const initialize = async (corporationId: string) => {
      // 与信情報取得API
      const request: ScrMem0003GetCreditLimitInfoRequest = {
        corporationId: corporationId,
      };
      const response = await ScrMem0003GetCreditLimitInfo(request);
      const corporationBasic = convertToCreditLimitInfoModel(
        response,
        corporationId
      );
      reset(corporationBasic);

      // 取得データ保持
      const scrMem0003Data = convertToScrMem0003DataModel(
        props.scrMem0003Data,
        corporationBasic
      );
      props.chengeScrMem0003Data(scrMem0003Data);
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
      const corporationBasic = convertToCreditLimitInfoModel(
        response,
        applicationId
      );

      // 画面にデータを設定
      reset(corporationBasic);

      // 取得データ保持
      const scrMem0003Data = convertToScrMem0003DataModel(
        props.scrMem0003Data,
        corporationBasic
      );
      props.chengeScrMem0003Data(scrMem0003Data);
    };

    if (corporationId === 'new') return;

    if (corporationId !== undefined && applicationId !== null) {
      historyInitialize(corporationId, applicationId);
    }

    if (corporationId !== undefined) {
      initialize(corporationId);
      return;
    }
  }, [corporationId, applicationId]);

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = () => {
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: [],
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0003',
          screenName: '法人情報詳細',
          tabId: 4,
          tabName: '与信制限',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      changeExpectDate: user.taskDate,
    });
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (changeMemo: string) => {
    setIsOpenPopup(false);

    // 法人基本情報変更申請
    const request = convertFromRegistrationCreditLimitInfo(
      getValues(),
      props.scrMem0003Data,
      user.employeeId,
      changeMemo
    );

    await ScrMem0003RegistrationCreditLimitInfo(request);
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
    navigate(-1);
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
                    />
                  </ControlsStackItem>
                  <ControlsStackItem>
                    <Radio
                      label='制限状況'
                      name='limitStatusKind'
                      radioValues={limitStatusKindRadio}
                    />
                  </ControlsStackItem>
                  <ControlsStackItem>
                    <TextField label='制限種別' name='limitKind' readonly />
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
            <ConfirmButton onClick={handleConfirm} disable={isReadOnly[0]}>
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
    </>
  );
};

export default ScrMem0003CreditLimitTab;

