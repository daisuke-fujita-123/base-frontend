import React, { useEffect, useState } from 'react';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { FormProvider } from 'react-hook-form';
import { useForm } from 'hooks/useForm';
import { TextField } from 'controls/TextField';
import { Grid } from 'layouts/Grid';
import { Radio } from 'controls/Radio';
import { DatePicker } from 'controls/DatePicker/DatePicker';
import { Select, SelectValue } from 'controls/Select/Select';
import { useNavigate } from 'hooks/useNavigate';
import { comApiClient } from 'providers/ApiClient';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from 'layouts/Stack';
import { CancelButton, ConfirmButton } from 'controls/Button';
import { TableRowModel } from 'controls/Table';
import { ScrCom0024GetPlaceData, ScrCom0024GetPlaceDataRequest, ScrCom0024GetPlaceDataResponse } from 'apis/com/ScrCom0024Api';
import { ScrCom9999GetBankMasterListbox, ScrCom9999GetBankMasterListboxRequest, ScrCom9999GetBranchMaster, ScrCom9999GetBranchMasterRequest, ScrCom9999GetCodeManagementMasterListbox, ScrCom9999GetCodeManagementMasterListboxRequest, ScrCom9999GetPlaceMasterListbox, ScrCom9999GetPlaceMasterListboxRequest } from 'apis/com/ScrCom9999Api';
import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032';

// import yup from 'utils/validation/ValidationDefinition';


/**
 * 会場基本情報データモデル
 */
interface PlaceBasicModel {
  // 会場コード
  placeCd: string;
  // 会場名
  placeName: string;
  // おまとめ会場
  omatomePlaceFlag: boolean;
  // 計算書表示会場名
  statementDisplayPlaceName: string;
  // 利用フラグ
  useFlag: boolean;
  // 提供開始日
  partnerStartDate: string;
  // 開催曜日
  sessionWeekKind: string;
  // 契約ID
  contractId: string;
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 請求先ID
  billingId: string;
  // TEL
  telephoneNumber: string;
  // 会場グループ
  placeGroupCode: string;
  // 支払先会場名
  paymentDestinationPlaceName: string;
  // POSまとめ会場
  posPutTogetherPlaceCode: string;
  // ホンダグループ
  hondaGroup: string;
  // 保証金
  guaranteeDeposit: string;
  // ライブ会場グループコード
  livePlaceGroupCode: string;
}

/**
 * 会場基本情報初期データ
 */
const initialValues: PlaceBasicModel = {
  placeCd: '',
  placeName: '',
  omatomePlaceFlag: false,
  statementDisplayPlaceName: '',
  useFlag: false,
  partnerStartDate: '',
  sessionWeekKind: '',
  contractId: '',
  corporationId: '',
  corporationName: '',
  billingId: '',
  telephoneNumber: '',
  placeGroupCode: '',
  paymentDestinationPlaceName: '',
  hondaGroup: '',
  posPutTogetherPlaceCode: '',
  guaranteeDeposit: '',
  livePlaceGroupCode: '',
};

/**
 * 会場基本情報スキーマ
 */
// const placeBasicSchama = {
//   corporationName: yup.string().label('法人名').max(10).required(),
//   corporationNameKana: yup.string().label('法人名カナ').max(10).required(),
// };


/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 開催曜日
  sessionWeekKindSelectValues: SelectValue[];
  // 会場グループ
  placeGroupCodeSelectValues: SelectValue[];
  // 支払先会場名
  paymentDestinationPlaceNameSelectValues: SelectValue[];
  //POSまとめ会場
  posPutTogetherPlaceCodeSelectValues: SelectValue[];
  //ライブ会場グループコード
  livePlaceGroupCodeSelectValues: SelectValue[];
  // バーチャル口座付与ルール
  virtualAccountGrantRuleSelectValues: SelectValue[];
  // 銀行名
  bankNameSelectValues: SelectValue[];
  // 支店名
  branchNameSelectValues: SelectValue[];
  // おまとめ会場連絡不可対象
  omatomePlaceContactImpossibleTargetedKindSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 開催曜日
  sessionWeekKindSelectValues: [],
  // 会場グループ
  placeGroupCodeSelectValues: [],
  // 支払先会場名
  paymentDestinationPlaceNameSelectValues: [],
  // POSまとめ会場
  posPutTogetherPlaceCodeSelectValues: [],
  // ライブ会場グループコード
  livePlaceGroupCodeSelectValues: [],
  // バーチャル口座付与ルール
  virtualAccountGrantRuleSelectValues: [],
  // 銀行名
  bankNameSelectValues: [],
  // 支店名
  branchNameSelectValues: [],
  // おまとめ会場連絡不可対象
  omatomePlaceContactImpossibleTargetedKindSelectValues: [],
};


/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  changedSections: [],
  errorMessages: [],
  warningMessages: [],
};

/**
 * SCR-COM-0024 会場詳細画面
 */
const ScrCom0024Page = () => {

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<PlaceBasicModel>({
    defaultValues: initialValues,
    // resolver: yupResolver(yup.object(placeBasicSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    setValue,
    getValues,
    reset,
  } = methods;

  // router
  const navigate = useNavigate();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);


  // 初期表示処理
  useEffect(() => {
    const initialize = async (placeCd: string) => {

      // SCR-COM-0024-0001: ライブ会場データ取得API
      const placeBasicRequest: ScrCom0024GetPlaceDataRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        placeCd: placeCd,
      };
      const placeBasicResponse = await ScrCom0024GetPlaceData(placeBasicRequest);
      const placeBasic = convertToPlaceBasicModel(placeBasicResponse);

      // 画面にデータを設定
      // フォームの中身をリセット
      reset(placeBasic);


      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const sessionWeekKindRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        // 開催曜日区分
        codeId: 'CDE-COM-0138',
      };
      const sessionWeekKindResponse = await ScrCom9999GetCodeManagementMasterListbox(sessionWeekKindRequest);


      // SCR-COM-9999-0016: 会場マスタリストボックス情報取得API
      const placeGroupRequest: ScrCom9999GetPlaceMasterListboxRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
      };
      const placeGroupResponse = await ScrCom9999GetPlaceMasterListbox(placeGroupRequest);


      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const livePlaceGroupCodeRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        // ライブ会場グループコード
        codeId: 'CDE-COM-0218',
      };
      const livePlaceGroupCodeResponse = await ScrCom9999GetCodeManagementMasterListbox(livePlaceGroupCodeRequest);


      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const virtualAccountGrantRuleRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        // バーチャル口座付与ルール
        codeId: 'CDE-COM-0139',
      };
      const virtualAccountGrantRuleResponse = await ScrCom9999GetCodeManagementMasterListbox(virtualAccountGrantRuleRequest);


      // SCR-COM-9999-0017: 銀行名リストボックス情報取得API
      const scrCom9999GetBankMasterListboxRequest: ScrCom9999GetBankMasterListboxRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
      };
      const bankNameResponse = await ScrCom9999GetBankMasterListbox(scrCom9999GetBankMasterListboxRequest);


      // SCR-COM-9999-0018: 支店名リストボックス情報取得API
      const scrCom9999GetBranchMasterRequest: ScrCom9999GetBranchMasterRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        // TODO: 取得方法不明
        bankCode: '',
      };
      const branchNameResponse = await ScrCom9999GetBranchMaster(scrCom9999GetBranchMasterRequest);


      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const omatomePlaceContactImpossibleTargetedKindRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        // おまとめ会場連絡不可対象
        codeId: 'CDE-COM-0140',
      };
      const omatomePlaceContactImpossibleTargetedKindResponse = await ScrCom9999GetCodeManagementMasterListbox(omatomePlaceContactImpossibleTargetedKindRequest);


      // 取得した値を状態管理に設定する
      setSelectValues({
        // 開催曜日
        sessionWeekKindSelectValues: sessionWeekKindResponse.searchGetCodeManagementMasterListbox,
        // 会場グループ
        placeGroupCodeSelectValues: placeGroupResponse.searchGetPlaceMasterListbox,
        // 支払先会場名
        paymentDestinationPlaceNameSelectValues: placeGroupResponse.searchGetPlaceMasterListbox,
        // POSまとめ会場
        posPutTogetherPlaceCodeSelectValues: placeGroupResponse.searchGetPlaceMasterListbox,
        // ライブ会場グループコード
        livePlaceGroupCodeSelectValues: livePlaceGroupCodeResponse.searchGetCodeManagementMasterListbox,
        // バーチャル口座付与ルール
        virtualAccountGrantRuleSelectValues: virtualAccountGrantRuleResponse.searchGetCodeManagementMasterListbox,
        // 銀行名
        bankNameSelectValues: bankNameResponse.searchGetBankMasterListbox,
        // 支店名
        branchNameSelectValues: branchNameResponse.searchGetBranchMaster,
        // おまとめ会場連絡不可対象
        omatomePlaceContactImpossibleTargetedKindSelectValues: omatomePlaceContactImpossibleTargetedKindResponse.searchGetCodeManagementMasterListbox,
      });

      if (placeCd === undefined || placeCd === 'new') {
        return;
      }

    };
    initialize(getValues('placeCd'));
  }, []);


  /**
   * 法人基本情報取得APIレスポンスから会場基本情報データモデルへの変換
   */
  const convertToPlaceBasicModel = (
    response: ScrCom0024GetPlaceDataResponse
  ): PlaceBasicModel => {
    return {
      placeCd: response.placeCd,
      placeName: response.placeName,
      omatomePlaceFlag: response.omatomePlaceFlag,
      statementDisplayPlaceName: response.statementDisplayPlaceName,
      useFlag: response.useFlag,
      partnerStartDate: response.partnerStartDate,
      sessionWeekKind: response.sessionWeekKind,
      contractId: response.contractId,
      corporationId: response.corporationId,
      corporationName: response.corporationName,
      billingId: response.billingId,
      telephoneNumber: response.businessBasePhoneNumber,
      placeGroupCode: response.placeGroupCode,
      paymentDestinationPlaceName: response.paymentDestinationPlaceName,
      posPutTogetherPlaceCode: response.posPutTogetherPlaceCode,
      hondaGroup: response.hondaGroup,
      guaranteeDeposit: response.guaranteeDeposit,
      livePlaceGroupCode: response.livePlaceGroupCode,
    };
  };


  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToChngedSections = (dirtyFields: object): TableRowModel[] => {
    const fields = Object.keys(dirtyFields);
    const changedSections: TableRowModel[] = [];
    sectionDef.forEach((d) => {
      fields.forEach((f) => {
        if (d.fields.includes(f)) {
          changedSections.push({
            変更種類: '基本情報変更',
            セクション名: d.section,
          });
        }
      });
    });
    return changedSections;
  };


  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    // TODO: 直接apiClientを使用しない
    const response = (
      await comApiClient.post('/scr-mem-0003/chack-for-change-corporation')
    ).data;

    setIsOpenPopup(true);
    setScrCom0032PopupData({
      changedSections: convertToChngedSections(dirtyFields),
      errorMessages: response.errorMessages,
      warningMessages: response.warningMessages,
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/places');
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = () => {
    setIsOpenPopup(false);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };


  /**
  * セクション構造定義
  */
  const sectionDef = [
    {
      section: '会場基本情報',
      fields: [
        'placeCd',
        'placeName',
        'omatomePlace',
        'statementDisplayPlaceName',
        'partnerStartDate',
        'sessionWeek',
        'placeGroupCode',
        'paymentDestinationPlaceName',
        'posPutTogetherPlaceCode',
        'hondaGroup',
        'livePlaceGroupCode',
      ],
    },
    {
      section: '書類発送指示',
      fields: [
        'instructionsForSendingDocuments',
        'referent',
        'managerForDocument',
        'mailAddressForDocument',
        'faxForDocument',
      ],
    },
    {
      section: '出金設定',
      fields: [
        'withdrawalDate',
        'withdrawalConfig'
      ],
    },
    {
      section: '振込口座情報',
      fields: [
        'bankAccountInfo',
        'branchName',
        'kinds',
        'accountNumber',
        'accountName',
        'virtualAccountGrantRule',
      ],
    },
    {
      section: '支払通知送付先指定',
      fields: [
        'paymentNotice',
        'managerForPayment',
        'mailAddressForPayment',
        'faxForPayment',
      ],
    },
    {
      section: '入金元口座情報',
      fields: [
        'bankName',
        'branchName',
        'accountName',
      ],
    },
    {
      section: '会場連絡(会員管理)',
      fields: [
        'emailAddressForVenueMemberManagement',
        'omatomePlaceContactImpossibleTargetedKind',
      ],
    },
  ];


  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 会場基本情報セクション */}
            <Section name='会場基本情報'>
              <Grid container width={1590}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <TextField label='会場コード' name='placeCd' required />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='会場名' name='placeName' required />
                    </Grid>
                    <Grid item xs={2}>
                      <Radio
                        label='おまとめ会場'
                        name='omatomePlaceFlag'
                        required
                        radioOptions={[
                          {
                            value: 'target',
                            valueLabel: '対象',
                            disabled: false,
                          },
                          {
                            value: 'unTarget',
                            valueLabel: '対象外',
                            disabled: false,
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='計算書表示会場名' name='statementDisplayPlaceName' required />
                    </Grid>
                    <Grid item xs={2}>
                      <Radio
                        label='利用フラグ'
                        name='useFlag'
                        required
                        radioOptions={[
                          {
                            value: 'yes',
                            valueLabel: '可',
                            disabled: false,
                          },
                          {
                            value: 'no',
                            valueLabel: '不可',
                            disabled: false,
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <DatePicker
                        label='提供開始日'
                        name='partnerStartDate'
                        wareki
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Select
                        label='開催曜日'
                        name='sessionWeekKind'
                        selectValues={selectValues.sessionWeekKindSelectValues}
                        blankOption
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='契約ID' name='contractId' required />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='法人ID' name='corporationId' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='法人名' name='corporationName' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='請求先ID' name='billingId' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='TEL' name='telephoneNumber' />
                    </Grid>
                    <Grid item xs={2}>
                      <Select
                        label='会場グループ'
                        name='placeGroupCode'
                        selectValues={selectValues.placeGroupCodeSelectValues}
                        blankOption
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Select
                        label='支払先会場名'
                        name='paymentDestinationPlaceName'
                        selectValues={selectValues.paymentDestinationPlaceNameSelectValues}
                        blankOption
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Select
                        label='POSまとめ会場'
                        name='posPutTogetherPlaceCode'
                        selectValues={selectValues.posPutTogetherPlaceCodeSelectValues}
                        blankOption
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Radio
                        label='ホンダグループ'
                        name='hondaGroup'
                        required
                        radioOptions={[
                          {
                            value: 'hondaTarget',
                            valueLabel: '対象',
                            disabled: false,
                          },
                          {
                            value: 'hondaUnTarget',
                            valueLabel: '対象外',
                            disabled: false,
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='保証金' name='guaranteeDeposit' />
                    </Grid>
                    <Grid item xs={2}>
                      <Select
                        label='ライブ会場グループコード'
                        name='livePlaceGroupCode'
                        selectValues={selectValues.livePlaceGroupCodeSelectValues}
                        blankOption
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Section>
            {/* 書類発送支持セクション */}
            <Section name='書類発送指示'>
              <Grid container width={1590}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <Radio
                        label='書類発送指示'
                        name='instructionsForSendingDocuments'
                        required
                        radioOptions={[
                          {
                            value: 'sendingDocumentsTarget',
                            valueLabel: '対象',
                            disabled: false,
                          },
                          {
                            value: 'sendingDocumentsUnTarget',
                            valueLabel: '対象外',
                            disabled: false,
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Radio
                        label='指示対象'
                        name='referent'
                        required
                        radioOptions={[
                          {
                            value: 'meberDirectDelivery',
                            valueLabel: '会員直送&AUC宛',
                            disabled: false,
                          },
                          {
                            value: 'onlyAuc',
                            valueLabel: 'AUC宛のみ',
                            disabled: false,
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='担当者' name='managerForDocument' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='メールアドレス' name='mailAddressForDocument' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='FAX' name='faxForDocument' />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Section>
            {/* 出金設定セクション */}
            <Section name='出金設定'>
              <Grid container width={1590}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <TextField label='出金期日' name='withdrawalDate' />日
                    </Grid>
                    <Grid item xs={2}>
                      <Radio
                        label='出金設定'
                        name='withdrawalConfig'
                        required
                        radioOptions={[
                          {
                            value: 'bulk',
                            valueLabel: '一括',
                            disabled: false,
                          },
                          {
                            value: 'eachTime',
                            valueLabel: '都度',
                            disabled: false,
                          },
                        ]}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Section>
            {/* 振込口座情報セクション */}
            <Section name='振込口座情報'>
              <Grid container width={1590}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <TextField label='銀行名' name='bankAccountInfo' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='支店名' name='branchName' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='種別' name='kinds' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='口座番号' name='accountNumber' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='口座名義' name='accountName' />
                    </Grid>
                    <Grid item xs={2}>
                      <Select
                        label='バーチャル口座付与ルール'
                        name='virtualAccountGrantRule'
                        selectValues={selectValues.livePlaceGroupCodeSelectValues}
                        blankOption
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Section>
            {/* 支払通知送付先指定セクション */}
            <Section name='支払通知送付先指定'>
              <Grid container width={1590}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <Radio
                        label='支払通知'
                        name='paymentNotice'
                        required
                        radioOptions={[
                          {
                            value: 'paymentNoticeTarget',
                            valueLabel: '対象',
                            disabled: false,
                          },
                          {
                            value: 'paymentNoticeUnTarget',
                            valueLabel: '対象外',
                            disabled: false,
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='担当者' name='managerForPayment' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='メールアドレス' name='mailAddressForPayment' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='FAX' name='faxForPayment' />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Section>
            {/* 入金元口座情報セクション */}
            <Section name='入金元口座情報'>
              <Grid container width={1590}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <Select
                        label='銀行名'
                        name='bankName'
                        selectValues={selectValues.bankNameSelectValues}
                        blankOption
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Select
                        label='支店名'
                        name='branchName'
                        selectValues={selectValues.branchNameSelectValues}
                        blankOption
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='口座名義' name='accountName' />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Section>
            {/* 会場連絡(会員管理)セクション */}
            <Section name='会場連絡(会員管理)'>
              <Grid container width={1590}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <TextField label='会場会員管理担当メールアドレス' name='emailAddressForVenueMemberManagement' />
                    </Grid>
                    <Grid item xs={2}>
                      <Select
                        label='おまとめ会場連絡不可対象'
                        name='omatomePlaceContactImpossibleTargetedKind'
                        selectValues={selectValues.omatomePlaceContactImpossibleTargetedKindSelectValues}
                        blankOption
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
      </MainLayout >

      {/* 登録内容確認ポップアップ */}
      < ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  )
}
export default ScrCom0024Page;
