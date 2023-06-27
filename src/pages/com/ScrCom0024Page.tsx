import React, { useContext, useEffect, useState } from 'react';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from 'layouts/Stack';
import { CancelButton, ConfirmButton } from 'controls/Button';
import { TableRowModel } from 'controls/Table';
import { ScrCom0024GetPlaceData, ScrCom0024GetPlaceDataRequest, ScrCom0024GetPlaceDataResponse, ScrCom0024PlaceDetailCheck, ScrCom0024PlaceDetailCheckRequest, ScrCom0024RegistUpdatePlaceDetail, ScrCom0024RegistUpdatePlaceDetailRequest } from 'apis/com/ScrCom0024Api';
import { ScrCom9999GetBankMasterListbox, ScrCom9999GetBankMasterListboxRequest, ScrCom9999GetBranchMaster, ScrCom9999GetBranchMasterRequest, ScrCom9999GetCodeManagementMasterListbox, ScrCom9999GetCodeManagementMasterListboxRequest, ScrCom9999GetPlaceMasterListbox, ScrCom9999GetPlaceMasterListboxRequest } from 'apis/com/ScrCom9999Api';
import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032';
import { Typography } from 'controls/Typography';
import { InputLayout } from 'layouts/InputLayout';
import { useParams } from 'react-router-dom';
import { generate } from 'utils/validation/BaseYup';
import { AppContext } from 'providers/AppContextProvider';


/**
 * 会場基本情報データモデル
 */
interface PlaceBasicModel {
  // 会場コード
  placeCd: string;
  // 会場名
  placeName: string;
  // おまとめ会場フラグ
  omatomePlaceFlag: boolean;
  // 計算書表示会場名
  statementDisplayPlaceName: string;
  // 利用フラグ
  useFlag: boolean;
  // 提供開始日
  partnerStartDate: string;
  // 開催曜日区分
  sessionWeekKind: string;
  // 会場契約ID
  contractId: string;
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 請求先ID
  billingId: string;
  // TEL
  telephoneNumber: string;
  // 会場グループコード
  placeGroupCode: string;
  // 支払先会場名
  paymentDestinationPlaceName: string;
  // POSまとめ会場
  posPutTogetherPlaceCode: string;
  // ホンダグループフラグ
  hondaGroupFlag: boolean;
  // 保証金
  guaranteeDeposit: number;
  // ライブ会場グループコード
  livePlaceGroupCode: string;
  // 書類発送指示フラグ
  documentShippingInstructionFlag: boolean,
  // 書類発送会場直送フラグ
  documentShippingPlaceDirectDeliveryFlag: boolean,
  // 書類発送担当者
  documentShippingStaff: string,
  // 書類発送メールアドレス
  documentShippingMailAddress: string,
  // 書類発送FAX番号
  documentShippingFaxNumber: string;
  /** 出金期日 */
  paymentDueDate: string;
  /** 出金設定 */
  paymentAllFlag: boolean;
  /** 振込銀行名 */
  bankName: string;
  /** 振込支店名 */
  branchName: string;
  /** 種別 */
  accountKind: string;
  /** 口座番号 */
  accountNumber: string;
  /** 口座名義 */
  accountNameKana: string;
  /** バーチャル口座付与ルールコード */
  virtualAccountGiveRuleCode: string;
  /** 支払通知フラグ */
  paymentNoticeFlag: boolean;
  /** 支払通知担当者 */
  paymentNoticeStaff: string;
  /** 支払通知メールアドレス */
  paymentNoticeMailAddress: string;
  /** 支払通知FAX番号 */
  paymentNoticeFaxNumber: string;
  /** 入金元銀行コード */
  receiptSourceBankCode: string;
  /** 入金元支店コード */
  receiptSourceBranchCode: string;
  /** 入金元口座名義カナ */
  receiptSourceAccountNameKana: string;
  /** 会場会員管理担当メールアドレス */
  placeMemberManagementStaffMailAddress: string;
  /** おまとめ会場連絡不可対象区分 */
  omatomePlaceContactImpossibleTargetedKind: string;
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
  hondaGroupFlag: false,
  posPutTogetherPlaceCode: '',
  guaranteeDeposit: 0,
  livePlaceGroupCode: '',
  documentShippingInstructionFlag: false,
  documentShippingPlaceDirectDeliveryFlag: false,
  documentShippingStaff: '',
  documentShippingMailAddress: '',
  documentShippingFaxNumber: '',
  paymentDueDate: '',
  paymentAllFlag: false,
  bankName: '',
  branchName: '',
  accountKind: '',
  accountNumber: '',
  accountNameKana: '',
  virtualAccountGiveRuleCode: '',
  paymentNoticeFlag: false,
  paymentNoticeStaff: '',
  paymentNoticeMailAddress: '',
  paymentNoticeFaxNumber: '',
  receiptSourceBankCode: '',
  receiptSourceBranchCode: '',
  receiptSourceAccountNameKana: '',
  placeMemberManagementStaffMailAddress: '',
  omatomePlaceContactImpossibleTargetedKind: '',
};


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
 * バリデーションスキーマ
 */
const validationSchama = generate([
  'placeCd',
  'placeName',
  'statementDisplayPlaceName',
  'partnerStartDate',
  'sessionWeekKind',
  'contractId',
  'corporationId',
  'corporationName',
  'billingId',
  'telephoneNumber',
  'placeGroupCode',
  'paymentDestinationPlaceName',
  'posPutTogetherPlaceCode',
  'guaranteeDeposit',
  'documentShippingStaff',
  'documentShippingMailAddress',
  'documentShippingFaxNumber',
  'paymentDueDate',
  'bankName',
  'branchName',
  'accountKind',
  'accountNumber',
  'accountNameKana',
  'virtualAccountGiveRuleCode',
  'paymentNoticeStaff',
  'paymentNoticeMailAddress',
  'paymentNoticeFaxNumber',
  'receiptSourceBankName',
  'receiptSourceBranchName',
  'receiptSourceAccountNameKana',
  'placeMemberManagementStaffMailAddress',
  'omatomePlaceContactImpossibleTargetedKind',
]);


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
    resolver: yupResolver(validationSchama),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    setValue,
    getValues,
    reset,
  } = methods;

  // router
  const { placeCode } = useParams();
  const navigate = useNavigate();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );

  // user情報
  const { appContext } = useContext(AppContext);

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


      // 画面にデータを設定
      // 会場基本情報セクション
      setValue('placeCd', placeBasic.placeCd);
      setValue('placeName', placeBasic.placeName);
      setValue('omatomePlaceFlag', placeBasic.omatomePlaceFlag);
      setValue('statementDisplayPlaceName', placeBasic.statementDisplayPlaceName);
      setValue('useFlag', placeBasic.useFlag);
      setValue('partnerStartDate', placeBasic.partnerStartDate);
      setValue('contractId', placeBasic.contractId);
      setValue('corporationId', placeBasic.corporationId);
      setValue('corporationName', placeBasic.corporationName);
      setValue('telephoneNumber', placeBasic.telephoneNumber);
      setValue('paymentDestinationPlaceName', placeBasic.paymentDestinationPlaceName);
      setValue('hondaGroupFlag', placeBasic.hondaGroupFlag);
      setValue('guaranteeDeposit', placeBasic.guaranteeDeposit);
      // 書類発送指示セクション
      setValue('documentShippingInstructionFlag', placeBasic.documentShippingInstructionFlag);
      setValue('documentShippingPlaceDirectDeliveryFlag', placeBasic.documentShippingPlaceDirectDeliveryFlag);
      setValue('documentShippingStaff', placeBasic.documentShippingStaff);
      setValue('documentShippingMailAddress', placeBasic.documentShippingMailAddress);
      setValue('documentShippingFaxNumber', placeBasic.documentShippingFaxNumber);
      // 出金設定セクション
      setValue('paymentDueDate', placeBasic.paymentDueDate);
      setValue('paymentAllFlag', placeBasic.paymentAllFlag);
      // 振込口座情報セクション
      setValue('bankName', placeBasic.bankName);
      setValue('branchName', placeBasic.branchName);
      setValue('accountKind', placeBasic.accountKind);
      setValue('accountNumber', placeBasic.accountNumber);
      setValue('accountNameKana', placeBasic.accountNameKana);
      // 支払通知送付先指定セクション
      setValue('paymentNoticeFlag', placeBasic.paymentNoticeFlag);
      setValue('paymentNoticeStaff', placeBasic.paymentNoticeStaff);
      setValue('paymentNoticeMailAddress', placeBasic.paymentNoticeMailAddress);
      setValue('paymentNoticeFaxNumber', placeBasic.paymentNoticeMailAddress);
      // 入金元口座情報セクション
      setValue('receiptSourceAccountNameKana', placeBasic.receiptSourceAccountNameKana);
      // 会場連絡（会員管理）セクション
      setValue('placeMemberManagementStaffMailAddress', placeBasic.placeMemberManagementStaffMailAddress);


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
    };


    // 新規作成の画面遷移の場合は初期表示のAPIを呼び出さない
    if (placeCode === undefined || placeCode === 'new') {
      return;
    }

    initialize(placeCode);
  }, []);


  /**
   * ライブ会場データ報取得APIレスポンスから会場基本情報データモデルへの変換
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
      hondaGroupFlag: response.hondaGroupFlag,
      guaranteeDeposit: response.guaranteeDeposit,
      livePlaceGroupCode: response.livePlaceGroupCode,
      documentShippingInstructionFlag: response.documentShippingInstructionFlag,
      documentShippingPlaceDirectDeliveryFlag: response.documentShippingPlaceDirectDeliveryFlag,
      documentShippingStaff: response.documentShippingStaff,
      documentShippingMailAddress: response.documentShippingMailAddress,
      documentShippingFaxNumber: response.documentShippingFaxNumber,
      paymentDueDate: response.paymentDueDate,
      paymentAllFlag: response.paymentAllFlag,
      bankName: response.bankName,
      branchName: response.branchName,
      accountKind: response.accountKind,
      accountNumber: response.accountNumber,
      accountNameKana: response.accountNameKana,
      virtualAccountGiveRuleCode: response.virtualAccountGiveRuleCode,
      paymentNoticeFlag: response.paymentNoticeFlag,
      paymentNoticeStaff: response.paymentNoticeStaff,
      paymentNoticeMailAddress: response.paymentNoticeMailAddress,
      paymentNoticeFaxNumber: response.paymentNoticeFaxNumber,
      receiptSourceBankCode: response.receiptSourceBankCode,
      receiptSourceBranchCode: response.receiptSourceBranchCode,
      receiptSourceAccountNameKana: response.receiptSourceAccountNameKana,
      placeMemberManagementStaffMailAddress: response.placeMemberManagementStaffMailAddress,
      omatomePlaceContactImpossibleTargetedKind: response.omatomePlaceContactImpossibleTargetedKind,
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
    // SCR-COM-0024-0003: 会場詳細入力チェックAPI
    const placeDetailCheckRequest: ScrCom0024PlaceDetailCheckRequest = {
      placeCd: getValues('placeCd'),
      placeName: getValues('placeName'),
    };
    const checkResult = await ScrCom0024PlaceDetailCheck(placeDetailCheckRequest);

    // チェックAPIが一つでもある場合エラーを返却
    if (checkResult) {
      return;
    }

    // SCR-COM-0024-0004: 会場詳細登録更新API
    const registUpdatePlaceDetailRequest: ScrCom0024RegistUpdatePlaceDetailRequest = {
      placeCode: getValues('placeCd'),
      placeName: getValues('placeName'),
      omatomePlaceFlag: getValues('omatomePlaceFlag'),
      statementDisplayPlaceName: getValues('statementDisplayPlaceName'),
      useFlag: getValues('useFlag'),
      partnerStartDate: getValues('partnerStartDate'),
      sessionWeekKind: getValues('sessionWeekKind'),
      contractId: getValues('contractId'),
      placeGroupCode: getValues('placeGroupCode'),
      paymentDestinationPlaceCode: getValues('paymentDestinationPlaceName'),
      posPutTogetherPlaceCode: getValues('posPutTogetherPlaceCode'),
      hondaGroupFlag: getValues('hondaGroupFlag'),
      guaranteeDeposit: getValues('guaranteeDeposit'),
      livePlaceGroupCode: getValues('livePlaceGroupCode'),
      documentShippingInstructionFlag: getValues('documentShippingInstructionFlag'),
      documentShippingPlaceDirectDeliveryFlag: getValues('documentShippingPlaceDirectDeliveryFlag'),
      documentShippingStaff: getValues('documentShippingStaff'),
      documentShippingMailAddress: getValues('documentShippingMailAddress'),
      documentShippingFaxNumber: getValues('documentShippingFaxNumber'),
      paymentDueDate: getValues('paymentDueDate'),
      paymentAllFlag: getValues('paymentAllFlag'),
      virtualAccountGiveRuleCode: getValues('virtualAccountGiveRuleCode'),
      paymentNoticeFlag: getValues('paymentNoticeFlag'),
      paymentNoticeStaff: getValues('paymentNoticeStaff'),
      paymentNoticeMailAddress: getValues('paymentNoticeMailAddress'),
      paymentNoticeFaxNumber: getValues('paymentNoticeFaxNumber'),
      receiptSourceBankCode: getValues('receiptSourceBankCode'),
      receiptSourceBranchCode: getValues('receiptSourceBranchCode'),
      receiptSourceAccountNameKana: getValues('receiptSourceAccountNameKana'),
      placeMemberManagementStaffMailAddress: getValues('placeMemberManagementStaffMailAddress'),
      omatomePlaceContactImpossibleTargetedKind: getValues('omatomePlaceContactImpossibleTargetedKind'),
      // セッションが保持するログイン従業員ID
      applicationEmployeeId: appContext.user,
    };
    const response = await ScrCom0024RegistUpdatePlaceDetail(registUpdatePlaceDetailRequest);

    // 登録更新の結果を登録確認ポップアップへ渡す
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
        'omatomePlaceFlag',
        'statementDisplayPlaceName',
        'partnerStartDate',
        'sessionWeekKind',
        'placeGroupCode',
        'paymentDestinationPlaceName',
        'posPutTogetherPlaceCode',
        'hondaGroupFlag',
        'livePlaceGroupCode',
      ],
    },
    {
      section: '書類発送指示',
      fields: [
        'instructionsForSendingDocuments',
        'referent',
        'documentShippingStaff',
        'documentShippingMailAddress',
        'documentShippingFaxNumber',
      ],
    },
    {
      section: '出金設定',
      fields: [
        'paymentDueDate',
        'paymentConfig'
      ],
    },
    {
      section: '振込口座情報',
      fields: [
        'bankName',
        'branchName',
        'accountKind',
        'accountNumber',
        'accountNameKana',
        'virtualAccountGiveRuleCode',
      ],
    },
    {
      section: '支払通知送付先指定',
      fields: [
        'paymentNotice',
        'paymentNoticeStaff',
        'paymentNoticeMailAddress',
        'paymentNoticeFaxNumber',
      ],
    },
    {
      section: '入金元口座情報',
      fields: [
        'receiptSourceBankName',
        'receiptSourceBranchName',
        'receiptSourceAccountNameKana',
      ],
    },
    {
      section: '会場連絡(会員管理)',
      fields: [
        'placeMemberManagementStaffMailAddress',
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
                {/* 1列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <TextField label='会場コード' name='placeCd' required />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='法人ID' name='corporationId' />
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={2}>
                      <Radio
                        label='ホンダグループ'
                        name='hondaGroupFlag'
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
                  </Grid>
                </Grid>
                {/* 2列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={4}>
                      <TextField label='会場名' name='placeName' required />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label='法人名' name='corporationName' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='保証金' name='guaranteeDeposit' />
                    </Grid>
                  </Grid>
                </Grid>
                {/* 3列目 */}
                <Grid item xs={12}>
                  <Grid container>
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
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='請求先ID' name='billingId' />
                    </Grid>
                  </Grid>
                </Grid>
                {/* 4列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <TextField label='計算書表示会場名' name='statementDisplayPlaceName' required />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='TEL' name='telephoneNumber' />
                    </Grid>
                  </Grid>
                </Grid>
                {/* 5列目 */}
                <Grid item xs={12}>
                  <Grid container>
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
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        label='会場グループ'
                        name='placeGroupCode'
                        selectValues={selectValues.placeGroupCodeSelectValues}
                        blankOption
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* 6列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <DatePicker
                        label='提供開始日'
                        name='partnerStartDate'
                        wareki
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
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
                  </Grid>
                </Grid>
                {/* 7列目 */}
                <Grid item xs={12}>
                  <Grid container>
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
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        label='POSまとめ会場'
                        name='posPutTogetherPlaceCode'
                        selectValues={selectValues.posPutTogetherPlaceCodeSelectValues}
                        blankOption
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* 8列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <TextField label='契約ID' name='contractId' required />
                    </Grid>
                    <Grid item xs={2}>
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
            {/* 書類発送指示セクション */}
            <Section name='書類発送指示'>
              <Grid container width={1590}>
                {/* 1列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <Radio
                        label='書類発送指示'
                        name='instructionsForSendingDocuments'
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
                  </Grid>
                </Grid>
                {/* 2列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={4}>
                      <Radio
                        label='指示対象'
                        name='referent'
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
                  </Grid>
                </Grid>
                {/* 3列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={6}>
                      <TextField label='担当者' name='documentShippingStaff' />
                    </Grid>
                  </Grid>
                </Grid>
                {/* 4列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12}>
                      <TextField label='メールアドレス' name='documentShippingMailAddress' />
                    </Grid>
                  </Grid>
                </Grid>
                {/* 5列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <TextField label='FAX' name='documentShippingFaxNumber' />
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
                      <InputLayout label="出金期日">
                        <Grid container>
                          <Grid item xs={11}>
                            <TextField name='paymentDueDate' />
                          </Grid>
                          <Grid item xs={1}>
                            <div style={{ paddingTop: '5px', marginLeft: '25px' }}>
                              <Typography variant='h6'>{'日'}</Typography>
                            </div>
                          </Grid>
                        </Grid>
                      </InputLayout>
                    </Grid>
                    <Grid item xs={2}>
                      <Radio
                        label='出金設定'
                        name='paymentConfig'
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
                {/* 1列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={6}>
                      <TextField label='銀行名' name='bankName' />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField label='口座番号' name='accountNumber' />
                    </Grid>
                  </Grid>
                </Grid>
                {/* 2列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={6}>
                      <TextField label='支店名' name='branchName' />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField label='口座名義' name='accountNameKana' />
                    </Grid>
                  </Grid>
                </Grid>
                {/* 3列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <TextField label='種別' name='accountKind' />
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={2}>
                      <Select
                        label='バーチャル口座付与ルール'
                        name='virtualAccountGiveRuleCode'
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
                {/* 1列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <Radio
                        label='支払通知'
                        name='paymentNotice'
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
                  </Grid>
                  {/* 2列目 */}
                  <Grid item xs={12}>
                    <Grid item xs={6}>
                      <TextField label='担当者' name='paymentNoticeStaff' />
                    </Grid>
                  </Grid>
                  {/* 3列目 */}
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <TextField label='メールアドレス' name='paymentNoticeMailAddress' />
                    </Grid>
                  </Grid>
                  {/* 4列目 */}
                  <Grid item xs={12}>
                    <Grid item xs={2}>
                      <TextField label='FAX' name='paymentNoticeFaxNumber' />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Section>
            {/* 入金元口座情報セクション */}
            <Section name='入金元口座情報'>
              <Grid container width={1590}>
                {/* 1列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Select
                        label='銀行名'
                        name='receiptSourceBankName'
                        selectValues={selectValues.bankNameSelectValues}
                        blankOption
                      />
                    </Grid>
                  </Grid>
                  {/* 2列目 */}
                  <Grid item xs={12}>
                    <Grid item xs={6}>
                      <Select
                        label='支店名'
                        name='receiptSourceBranchName'
                        selectValues={selectValues.branchNameSelectValues}
                        blankOption
                      />
                    </Grid>
                  </Grid>
                  {/* 3列目 */}
                  <Grid item xs={12}>
                    <Grid item xs={4}>
                      <TextField label='口座名義' name='receiptSourceAccountNameKana' />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Section>
            {/* 会場連絡(会員管理)セクション */}
            <Section name='会場連絡(会員管理)'>
              <Grid container width={1590}>
                {/* 1列目 */}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12}>
                      <TextField label='会場会員管理担当メールアドレス' name='placeMemberManagementStaffMailAddress' />
                    </Grid>
                  </Grid>
                  {/* 2列目 */}
                  <Grid item xs={12}>
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
