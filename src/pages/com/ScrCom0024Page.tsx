import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032Popup';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { DatePicker } from 'controls/DatePicker/DatePicker';
import { Radio } from 'controls/Radio';
import { Select, SelectValue } from 'controls/Select/Select';
import { TextField } from 'controls/TextField';

import {
  ScrCom0024GetPlaceData,
  ScrCom0024GetPlaceDataRequest,
  ScrCom0024GetPlaceDataResponse,
  ScrCom0024PlaceDetailCheck,
  ScrCom0024PlaceDetailCheckRequest,
  ScrCom0024RegistUpdatePlaceDetail,
  ScrCom0024RegistUpdatePlaceDetailRequest,
} from 'apis/com/ScrCom0024Api';
import {
  ResultList,
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetCodeManagementMasterRequest,
  ScrCom9999GetCodeValue,
  ScrCom9999GetCodeValueRequest,
  ScrCom9999GetPlaceMaster,
  SearchGetCodeManagementMasterListbox,
  SearchGetPlaceMasterListbox,
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

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
  // おまとめ会場フラグ-値変換
  omatomePlaceValue: string;
  // 計算書表示会場名
  statementDisplayPlaceName: string;
  // 利用フラグ
  useFlag: boolean;
  // 利用フラグ -値変換
  useValue: string;
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
  // ホンダグループフラグ -値変換
  hondaGroupValue: string;
  // 保証金
  guaranteeDeposit: number | string;
  // ライブ会場グループコード
  livePlaceGroupCode: string;
  // 書類発送指示フラグ
  documentShippingInstructionFlag: boolean;
  // 書類発送指示フラグ -値変換
  documentShippingInstructionValue: string;
  // 指示対象
  referent: boolean;
  // 指示対象
  referentValue: string;
  // 書類発送会場直送フラグ
  documentShippingPlaceDirectDeliveryFlag: boolean;
  // 書類発送担当者
  documentShippingStaff: string;
  // 書類発送メールアドレス
  documentShippingMailAddress: string;
  // 書類発送FAX番号
  documentShippingFaxNumber: string;
  /** 出金期日 */
  paymentDueDate: string;
  /** 出金設定 */
  paymentAllFlag: boolean;
  /** 出金設定 -値変換 */
  paymentAllValue: string;
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
  /** 支払通知フラグ -値変換 */
  paymentNoticeValue: string;
  /** 支払通知担当者 */
  paymentNoticeStaff: string;
  /** 支払通知メールアドレス */
  paymentNoticeMailAddress: string;
  /** 支払通知FAX番号 */
  paymentNoticeFaxNumber: string;
  /** 入金元銀行コード */
  receiptSourceBankName: string;
  /** 入金元支店コード */
  receiptSourceBranchName: string;
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
  omatomePlaceValue: '',
  statementDisplayPlaceName: '',
  useFlag: false,
  useValue: '',
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
  hondaGroupValue: '',
  posPutTogetherPlaceCode: '',
  guaranteeDeposit: '',
  livePlaceGroupCode: '',
  documentShippingInstructionFlag: false,
  documentShippingInstructionValue: '',
  referent: false,
  referentValue: '',
  documentShippingPlaceDirectDeliveryFlag: false,
  documentShippingStaff: '',
  documentShippingMailAddress: '',
  documentShippingFaxNumber: '',
  paymentDueDate: '',
  paymentAllFlag: false,
  paymentAllValue: '',
  bankName: '',
  branchName: '',
  accountKind: '',
  accountNumber: '',
  accountNameKana: '',
  virtualAccountGiveRuleCode: '',
  paymentNoticeFlag: false,
  paymentNoticeValue: '',
  paymentNoticeStaff: '',
  paymentNoticeMailAddress: '',
  paymentNoticeFaxNumber: '',
  receiptSourceBankName: '',
  receiptSourceBranchName: '',
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
  // ライブ会場グループコード
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
const validationSchema = {
  placeCd: yup.string().label('会場コード').max(2).half(),
  placeName: yup.string().label('会場名').max(15),
  statementDisplayPlaceName: yup.string().label('計算書表示会場名').max(8),
  partnerStartDate: yup.string().label('提携開始日（FROM）').date(),
  sessionWeekKind: yup.array().label('開催曜日'),
  contractId: yup.string().label('契約ID').max(7).half(),
  corporationId: yup.string().label('法人ID').max(8).half(),
  corporationName: yup.string().label('法人名').max(30),
  billingId: yup.string().label('請求先ID').max(4).half(),
  telephoneNumber: yup.string().label('TEL').max(13).half().phone(),
  placeGroupCode: yup.array().label('会場グループ'),
  paymentDestinationPlaceName: yup.array().label('支払先会場名'),
  posPutTogetherPlaceCode: yup.array().label('POSまとめ会場'),
  guaranteeDeposit: yup.string().label('保証金').max(6).number(),
  documentShippingStaff: yup.string().label('担当者').max(30),
  documentShippingMailAddress: yup
    .string()
    .label('メールアドレス')
    .max(254)
    .half()
    .address(),
  documentShippingFaxNumber: yup.string().label('FAX').max(13).half().phone(),
  paymentDueDate: yup.string().label('出金期日').max(2).number(),
  bankName: yup.string().label('銀行名').max(30),
  branchName: yup.string().label('支店名').max(30),
  accountKind: yup.string().label('種別').max(2),
  accountNumber: yup.string().label('口座番号').max(7).half(),
  accountNameKana: yup.string().label('口座名義').max(40),
  virtualAccountGiveRuleCode: yup.array().label('バーチャル口座付与ルール'),
  paymentNoticeStaff: yup.string().label('担当者').max(30),
  paymentNoticeMailAddress: yup
    .string()
    .label('メールアドレス')
    .max(254)
    .half()
    .address(),
  paymentNoticeFaxNumber: yup.string().label('FAX').max(13).half().phone(),
  receiptSourceBankName: yup.array().label('銀行名'),
  receiptSourceBranchName: yup.array().label('支店名'),
  receiptSourceAccountNameKana: yup.string().label('口座名義').max(40),
  placeMemberManagementStaffMailAddress: yup
    .string()
    .label('会場会員管理担当メールアドレス')
    .max(254)
    .half()
    .address(),
  omatomePlaceContactImpossibleTargetedKind: yup
    .array()
    .label('おまとめ会場連絡不可対象'),
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  // エラー内容リスト
  errorList: [],
  // ワーニング内容リスト
  warningList: [],
  // 登録・変更内容リスト
  registrationChangeList: [],
  // 変更予定日
  changeExpectDate: '',
};

/**
 * 画面ID 定数定義
 */
const SCR_COM_0024 = 'SCR-COM-0024';

/**
 * CODE_ID 定数定義
 */
// 開催曜日区分
const SCR_TRA_0018 = 'SCR-TRA-0018';
// ライブ会場グループコード
const CDE_COM_0218 = 'CDE-COM-0218';
// バーチャル口座ルール
const CDE_COM_0139 = 'CDE-COM-0139';
// おまとめ会場連絡不可対象
const CDE_COM_0140 = 'CDE-COM-0140';

/**
 * SCR-COM-0024 会場詳細画面
 */
const ScrCom0024Page = () => {
  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);
  // おまとめ会場 対象・対象外
  const [omatomePlaceFlag, setOmatomePlaceFlag] = useState<boolean>();
  // 書類発送指示対象 対象・対象外
  const [documentShippingInstructionFlag, setDocumentShippingInstructionFlag] =
    useState<boolean>();

  // form
  const methods = useForm<PlaceBasicModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchema)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    setValue,
    getValues,
    reset,
    watch,
  } = methods;

  // router
  const { placeCode } = useParams();
  const navigate = useNavigate();

  // user情報
  const { user } = useContext(AuthContext);

  // ユーザーの編集権限
  const userEditFlag =
    user.editPossibleScreenIdList === undefined
      ? ''
      : user.editPossibleScreenIdList.includes(SCR_COM_0024);

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // リストボックスを設定する共通処理(現在情報の表示・新規登録)
  const listboxSetting = async () => {
    // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
    const sessionWeekKindRequest: ScrCom9999GetCodeManagementMasterRequest = {
      businessDate: user.taskDate,
      // 開催曜日区分
      codeId: SCR_TRA_0018,
    };
    const sessionWeekKindResponse = await ScrCom9999GetCodeManagementMaster(
      sessionWeekKindRequest
    );

    // SCR-COM-9999-0016: 会場マスタリストボックス情報取得API
    const placeGroupResponse = await ScrCom9999GetPlaceMaster();

    // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
    const livePlaceGroupCodeRequest: ScrCom9999GetCodeManagementMasterRequest =
      {
        businessDate: user.taskDate,
        // ライブ会場グループコード
        codeId: CDE_COM_0218,
      };
    const livePlaceGroupCodeResponse = await ScrCom9999GetCodeManagementMaster(
      livePlaceGroupCodeRequest
    );

    // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
    const virtualAccountGrantRuleRequest: ScrCom9999GetCodeManagementMasterRequest =
      {
        businessDate: user.taskDate,
        // バーチャル口座付与ルール
        codeId: CDE_COM_0139,
      };
    const virtualAccountGrantRuleResponse =
      await ScrCom9999GetCodeManagementMaster(virtualAccountGrantRuleRequest);

    // SCR-COM-9999-0031: コード値取得API(bank_master)
    const scrCom9999GetCodeValueRequestForBank: ScrCom9999GetCodeValueRequest =
      {
        entityList: [
          {
            entityName: 'bank_master',
          },
        ],
      };
    const bankNameResponse = await ScrCom9999GetCodeValue(
      scrCom9999GetCodeValueRequestForBank
    );

    // SCR-COM-9999-0031: コード値取得API(branch_master)
    const scrCom9999GetCodeValueRequestForBranch: ScrCom9999GetCodeValueRequest =
      {
        entityList: [
          {
            entityName: 'branch_master',
          },
        ],
      };
    const branchNameResponse = await ScrCom9999GetCodeValue(
      scrCom9999GetCodeValueRequestForBranch
    );

    // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
    const omatomePlaceContactImpossibleTargetedKindRequest: ScrCom9999GetCodeManagementMasterRequest =
      {
        businessDate: user.taskDate,
        // おまとめ会場連絡不可対象
        codeId: CDE_COM_0140,
      };
    const omatomePlaceContactImpossibleTargetedKindResponse =
      await ScrCom9999GetCodeManagementMaster(
        omatomePlaceContactImpossibleTargetedKindRequest
      );

    // 画面にデータを設定 リストボックス
    setSelectValues({
      // 開催曜日
      sessionWeekKindSelectValues: convertFrom0010ToSelectValueModel(
        sessionWeekKindResponse.searchGetCodeManagementMasterListbox
      ),
      // 会場グループ
      placeGroupCodeSelectValues: convertFrom0016ToSelectValueModel(
        placeGroupResponse.searchGetPlaceMasterListbox
      ),
      // 支払先会場名
      paymentDestinationPlaceNameSelectValues:
        convertFrom0016ToSelectValueModel(
          placeGroupResponse.searchGetPlaceMasterListbox
        ),
      // POSまとめ会場
      posPutTogetherPlaceCodeSelectValues: convertFrom0016ToSelectValueModel(
        placeGroupResponse.searchGetPlaceMasterListbox
      ),
      // ライブ会場グループコード
      livePlaceGroupCodeSelectValues: convertFrom0010ToSelectValueModel(
        livePlaceGroupCodeResponse.searchGetCodeManagementMasterListbox
      ),
      // バーチャル口座付与ルール
      virtualAccountGrantRuleSelectValues: convertFrom0010ToSelectValueModel(
        virtualAccountGrantRuleResponse.searchGetCodeManagementMasterListbox
      ),
      // 銀行名
      bankNameSelectValues: convertToCodeValueSelectValueModel(
        bankNameResponse.resultList
      ),
      // 支店名
      branchNameSelectValues: convertToCodeValueSelectValueModel(
        branchNameResponse.resultList
      ),
      // おまとめ会場連絡不可対象
      omatomePlaceContactImpossibleTargetedKindSelectValues:
        convertFrom0010ToSelectValueModel(
          omatomePlaceContactImpossibleTargetedKindResponse.searchGetCodeManagementMasterListbox
        ),
    });
  };

  // 初期表示処理
  useEffect(() => {
    // 現在表示 初期表示
    const initialize = async (placeCd: string) => {
      // SCR-COM-0024-0001: ライブ会場データ取得API
      const placeBasicRequest: ScrCom0024GetPlaceDataRequest = {
        businessDate: user.taskDate,
        placeCd: placeCd,
      };
      const placeBasicResponse = await ScrCom0024GetPlaceData(
        placeBasicRequest
      );
      const placeBasic = convertToPlaceBasicModel(placeBasicResponse);

      // 初期表示時のラジオボタン制御用
      // おまとめ会場フラグ
      const convertToOmatomePlaceValue: string =
        placeBasic.omatomePlaceFlag === true ? 'target' : 'unTarget';
      // 利用フラグ
      const convertToUseValue: string =
        placeBasic.useFlag === true ? 'yes' : 'no';
      // ホンダグループ
      const convertToHondaGroupValue: string =
        placeBasic.hondaGroupFlag === true ? 'hondaTarget' : 'hondaUnTarget';
      // 書類発送指示
      const convertToDocumentShippingInstructionValue: string =
        placeBasic.documentShippingInstructionFlag === true
          ? 'sendingDocumentsTarget'
          : 'sendingDocumentsUnTarget';
      // 指示対象
      const convertToReferent: string =
        placeBasic.documentShippingPlaceDirectDeliveryFlag === true
          ? 'meberDirectDelivery'
          : 'onlyAuc';
      // 出金設定
      const convertToPaymentAllValue: string =
        placeBasic.paymentAllFlag === true ? 'bulk' : 'eachTime';
      // 出金設定
      const convertToPaymentNoticeValue: string =
        placeBasic.paymentNoticeFlag === true
          ? 'paymentNoticeTarget'
          : 'paymentNoticeUnTarget';

      // 画面にデータを設定
      // 会場基本情報セクション
      // 会場コード
      setValue('placeCd', placeBasic.placeCd);
      // 会場名
      setValue('placeName', placeBasic.placeName);
      // おまとめ会場(ラジオボタン)
      setValue('omatomePlaceValue', convertToOmatomePlaceValue);
      // 計算表示会場名
      setValue(
        'statementDisplayPlaceName',
        placeBasic.statementDisplayPlaceName
      );
      // 利用フラグ(ラジオボタン)
      setValue('useValue', convertToUseValue);
      // 提供開始日
      setValue('partnerStartDate', placeBasic.partnerStartDate);
      // 開催曜日(リストボックス)
      setValue('sessionWeekKind', placeBasic.placeCd);
      // 契約ID
      setValue('contractId', placeBasic.contractId);
      // 法人ID
      setValue('corporationId', placeBasic.corporationId);
      // 法人名
      setValue('corporationName', placeBasic.corporationName);
      // 事業拠点電話番号
      setValue('telephoneNumber', placeBasic.telephoneNumber);
      // 請求先ID
      setValue('billingId', placeBasic.billingId);
      // 会場グループ(リストボックス)
      setValue('placeGroupCode', placeBasic.placeCd);
      // 支払先会場名(リストボックス)
      setValue('paymentDestinationPlaceName', placeBasic.placeCd);
      // POSまとめ会場名(リストボックス)
      setValue('posPutTogetherPlaceCode', placeBasic.placeCd);
      // ライブ会場グループコード(リストボックス)
      setValue('livePlaceGroupCode', placeBasic.placeCd);
      // ホンダグループフラグ
      setValue('hondaGroupValue', convertToHondaGroupValue);
      // 保証金
      setValue('guaranteeDeposit', placeBasic.guaranteeDeposit);
      // 会場契約ID
      setValue('contractId', placeBasic.contractId);
      // 書類発送指示セクション
      // 書類発送指示(ラジオボタン)
      setValue(
        'documentShippingInstructionValue',
        convertToDocumentShippingInstructionValue
      );
      // 書類発送会場直送フラグ(ラジオボタン)
      setValue('referentValue', convertToReferent);
      // 書類発送担当者
      setValue('documentShippingStaff', placeBasic.documentShippingStaff);
      // 書類発送メールアドレス
      setValue(
        'documentShippingMailAddress',
        placeBasic.documentShippingMailAddress
      );
      // 書類発送FAX番号
      setValue(
        'documentShippingFaxNumber',
        placeBasic.documentShippingFaxNumber
      );
      // 出金設定セクション
      // 出金期日
      setValue('paymentDueDate', placeBasic.paymentDueDate);
      // 出金一括フラグ(ラジオボタン)
      setValue('paymentAllValue', convertToPaymentAllValue);
      // 振込口座情報セクション
      // 銀行名
      setValue('bankName', placeBasic.bankName);
      // 支店名
      setValue('branchName', placeBasic.branchName);
      // 種別
      setValue('accountKind', placeBasic.accountKind);
      // 口座名義
      setValue('accountNumber', placeBasic.accountNumber);
      // 口座名義 カナ
      setValue('accountNameKana', placeBasic.accountNameKana);
      // バーチャル口座付与ルール(リストボックス)
      setValue('virtualAccountGiveRuleCode', placeBasic.placeCd);
      // 支払通知送付先指定セクション
      // 支払通知フラグ(ラジオボタン)
      setValue('paymentNoticeValue', convertToPaymentNoticeValue);
      // 支払通知担当者
      setValue('paymentNoticeStaff', placeBasic.paymentNoticeStaff);
      // 支払通知メールアドレス
      setValue('paymentNoticeMailAddress', placeBasic.paymentNoticeMailAddress);
      // 支払通知FAX番号
      setValue('paymentNoticeFaxNumber', placeBasic.paymentNoticeMailAddress);
      // 入金元口座情報セクション
      // 銀行名(リストボックス)
      setValue('receiptSourceBankName', placeBasic.placeCd);
      // 支店名(リストボックス)
      setValue('receiptSourceBranchName', placeBasic.placeCd);
      // 入金元口座名義カナ
      setValue(
        'receiptSourceAccountNameKana',
        placeBasic.receiptSourceAccountNameKana
      );
      // 会場連絡（会員管理）セクション
      // 会場会員管理担当メールアドレス
      setValue(
        'placeMemberManagementStaffMailAddress',
        placeBasic.placeMemberManagementStaffMailAddress
      );
      // おまとめ会場連絡不可対象(リストボックス)
      setValue('omatomePlaceContactImpossibleTargetedKind', placeBasic.placeCd);

      // 判定用データを設定
      setOmatomePlaceFlag(placeBasic.omatomePlaceFlag);
      setDocumentShippingInstructionFlag(
        placeBasic.documentShippingInstructionFlag
      );

      // 全リストボックスのAPI実行と設定
      listboxSetting();
    };

    // 新規追加 初期表示
    const initializeNew = () => {
      // 全リストボックスのAPI実行と設定
      listboxSetting();
    };

    // 新規作成の画面遷移の場合は初期表示のAPIを呼び出さない
    if (placeCode === undefined || placeCode === 'new') {
      initializeNew();
    } else {
      initialize(placeCode);
    }
  }, []);

  // おまとめ会場のラジオボタン処理
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // textの変更も監視対象のため、setValueでtextを変更した場合を無視しないと無弁ループする
      if (name !== 'omatomePlaceValue') return;
      const omatomePlaceValue = String(value.omatomePlaceValue);
      if (omatomePlaceValue === undefined) return;

      if (omatomePlaceValue === 'target') {
        setOmatomePlaceFlag(true);
        setValue('referentValue', '');
      } else {
        // おまとめ会場が対象外の場合、"AUC宛のみ"固定とする
        setOmatomePlaceFlag(false);
        setValue('referentValue', 'onlyAuc');
      }
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

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
      omatomePlaceValue: response.omatomePlaceFlag === true ? 'yes' : 'no',
      statementDisplayPlaceName: response.statementDisplayPlaceName,
      useFlag: response.useFlag,
      useValue: response.useFlag === true ? 'target' : 'unTarget',
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
      hondaGroupValue:
        response.hondaGroupFlag === true ? 'hondaTarget' : 'hondaUnTarget',
      guaranteeDeposit: response.guaranteeDeposit,
      livePlaceGroupCode: response.livePlaceGroupCode,
      documentShippingInstructionFlag: response.documentShippingInstructionFlag,
      documentShippingInstructionValue:
        response.documentShippingInstructionFlag === true
          ? 'sendingDocumentsTarget'
          : 'sendingDocumentsUnTarget',
      referent: response.documentShippingPlaceDirectDeliveryFlag,
      referentValue:
        response.documentShippingPlaceDirectDeliveryFlag === true ||
        response.omatomePlaceFlag === true
          ? 'meberDirectDelivery'
          : 'onlyAuc',
      documentShippingPlaceDirectDeliveryFlag:
        response.documentShippingPlaceDirectDeliveryFlag,
      documentShippingStaff: response.documentShippingStaff,
      documentShippingMailAddress: response.documentShippingMailAddress,
      documentShippingFaxNumber: response.documentShippingFaxNumber,
      paymentDueDate: response.paymentDueDate,
      paymentAllFlag: response.paymentAllFlag,
      paymentAllValue: response.paymentAllFlag === true ? 'bulk' : 'eachTime',
      bankName: response.bankName,
      branchName: response.branchName,
      accountKind: response.accountKind,
      accountNumber: response.accountNumber,
      accountNameKana: response.accountNameKana,
      virtualAccountGiveRuleCode: response.virtualAccountGiveRuleCode,
      paymentNoticeFlag: response.paymentNoticeFlag,
      paymentNoticeValue:
        response.paymentNoticeFlag === true
          ? 'paymentNoticeTarget'
          : 'paymentNoticeUnTarget',
      paymentNoticeStaff: response.paymentNoticeStaff,
      paymentNoticeMailAddress: response.paymentNoticeMailAddress,
      paymentNoticeFaxNumber: response.paymentNoticeFaxNumber,
      receiptSourceBankName: response.receiptSourceBankCode,
      receiptSourceBranchName: response.receiptSourceBranchCode,
      receiptSourceAccountNameKana: response.receiptSourceAccountNameKana,
      placeMemberManagementStaffMailAddress:
        response.placeMemberManagementStaffMailAddress,
      omatomePlaceContactImpossibleTargetedKind:
        response.omatomePlaceContactImpossibleTargetedKind,
    };
  };

  /**
   *  API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンスから SelectValueモデルへの変換
   */
  const convertFrom0010ToSelectValueModel = (
    searchGetCodeManagementMasterListbox: SearchGetCodeManagementMasterListbox[]
  ): SelectValue[] => {
    return searchGetCodeManagementMasterListbox.map((x) => {
      return {
        value: x.codeValue,
        displayValue: x.codeName,
      };
    });
  };

  /**
   *  API-COM-9999-0016: 会場マスタリストボックス情報取得API レスポンスから SelectValueモデルへの変換
   */
  const convertFrom0016ToSelectValueModel = (
    searchGetPlaceMasterListbox: SearchGetPlaceMasterListbox[]
  ): SelectValue[] => {
    return searchGetPlaceMasterListbox.map((x) => {
      return {
        value: x.placeCode,
        displayValue: x.placeName,
      };
    });
  };

  /**
   *  API-COM-9999-0031: コード値取得API（コード管理マスタ以外）レスポンスから SelectValueモデルへの変換
   */
  const convertToCodeValueSelectValueModel = (
    resultList: ResultList[]
  ): SelectValue[] => {
    return resultList.map((x) => {
      return {
        value: x.codeId,
        displayValue: x.entityName,
      };
    });
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
    const response = await ScrCom0024PlaceDetailCheck(placeDetailCheckRequest);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: response.errorList,
      warningList: response.warningList,
      registrationChangeList: response.registrationChangeList,
      changeExpectDate: user.taskDate,
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/places');
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handleRegistConfirm = async () => {
    setIsOpenPopup(false);
    // SCR-COM-0024-0004: 会場詳細登録更新API
    const registUpdatePlaceDetailRequest: ScrCom0024RegistUpdatePlaceDetailRequest =
      {
        placeCode: getValues('placeCd'),
        placeName: getValues('placeName'),
        omatomePlaceFlag: true,
        statementDisplayPlaceName: getValues('statementDisplayPlaceName'),
        useFlag: getValues('useFlag'),
        partnerStartDate: getValues('partnerStartDate'),
        sessionWeekKind: getValues('sessionWeekKind'),
        contractId: getValues('contractId'),
        placeGroupCode: getValues('placeGroupCode'),
        paymentDestinationPlaceCode: getValues('paymentDestinationPlaceName'),
        posPutTogetherPlaceCode: getValues('posPutTogetherPlaceCode'),
        hondaGroupFlag: getValues('hondaGroupFlag'),
        guaranteeDeposit: Number(getValues('guaranteeDeposit')),
        livePlaceGroupCode: getValues('livePlaceGroupCode'),
        documentShippingInstructionFlag: getValues(
          'documentShippingInstructionFlag'
        ),
        documentShippingPlaceDirectDeliveryFlag: getValues(
          'documentShippingPlaceDirectDeliveryFlag'
        ),
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
        receiptSourceBankCode: getValues('receiptSourceBankName'),
        receiptSourceBranchCode: getValues('receiptSourceBranchName'),
        receiptSourceAccountNameKana: getValues('receiptSourceAccountNameKana'),
        placeMemberManagementStaffMailAddress: getValues(
          'placeMemberManagementStaffMailAddress'
        ),
        omatomePlaceContactImpossibleTargetedKind: getValues(
          'omatomePlaceContactImpossibleTargetedKind'
        ),
        // セッションが保持するログイン従業員ID
        applicationEmployeeId: '',
      };
    // 登録処理
    await ScrCom0024RegistUpdatePlaceDetail(registUpdatePlaceDetailRequest);
  };

  /**
   * 登録内容確認ポップアップの登録承認ボタンクリック時のイベントハンドラ
   * @param registrationChangeMemo 登録変更メモ(登録内容確認ポップアップからの受取)
   */
  const handleApprovalConfirm = (registrationChangeMemo: string) => {
    setIsOpenPopup(false);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 会場基本情報セクション */}
            <Section name='会場基本情報'>
              <RowStack>
                {/* 縦 1列目 */}
                <ColStack>
                  <TextField
                    label='会場コード'
                    name='placeCd'
                    // 新規登録時の場合必須 新規登録時以外は非活性
                    required={
                      placeCode === undefined || placeCode === 'new'
                        ? true
                        : false
                    }
                    disabled={
                      placeCode === undefined || placeCode === 'new'
                        ? false
                        : true
                    }
                  />
                  <TextField
                    label='会場名'
                    name='placeName'
                    size='m'
                    // 新規登録時・または編集権限ありの場合 活性
                    required={
                      placeCode === undefined ||
                      placeCode === 'new' ||
                      !userEditFlag
                        ? true
                        : false
                    }
                    disabled={!userEditFlag ? true : false}
                  />
                  <Radio
                    label='おまとめ会場'
                    name='omatomePlaceValue'
                    disabled={
                      // 編集権限なしの場合 非活性
                      !userEditFlag ? true : false
                    }
                    required
                    radioValues={[
                      {
                        value: 'target',
                        displayValue: '対象',
                      },
                      {
                        value: 'unTarget',
                        displayValue: '対象外',
                      },
                    ]}
                  />
                  <TextField
                    label='計算書表示会場名'
                    name='statementDisplayPlaceName'
                    size='m'
                    // おまとめ会場が対象の場合必須
                    required={omatomePlaceFlag ? true : false}
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <Radio
                    label='利用フラグ'
                    name='useValue'
                    disabled={
                      // 編集権限なしの場合 非活性
                      !userEditFlag ? true : false
                    }
                    required
                    radioValues={[
                      {
                        value: 'yes',
                        displayValue: '可',
                      },
                      {
                        value: 'no',
                        displayValue: '不可',
                      },
                    ]}
                  />
                  <DatePicker
                    label='提供開始日'
                    name='partnerStartDate'
                    required
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <Select
                    label='開催曜日'
                    name='sessionWeekKind'
                    selectValues={selectValues.sessionWeekKindSelectValues}
                    blankOption
                    required
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <TextField
                    label='契約ID'
                    name='contractId'
                    required
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                </ColStack>
                {/* 縦 2列目 */}
                <ColStack>
                  <TextField
                    label='法人ID'
                    name='corporationId'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <TextField
                    label='法人名'
                    name='corporationName'
                    size='l'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <TextField
                    label='請求先ID'
                    name='billingId'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <TextField
                    label='TEL'
                    name='telephoneNumber'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <Select
                    label='会場グループ'
                    name='placeGroupCode'
                    size='m'
                    selectValues={selectValues.placeGroupCodeSelectValues}
                    blankOption
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <Select
                    label='支払先会場名'
                    name='paymentDestinationPlaceName'
                    size='m'
                    selectValues={
                      selectValues.paymentDestinationPlaceNameSelectValues
                    }
                    blankOption
                    // おまとめ会場が対象の場合必須
                    required={omatomePlaceFlag ? true : false}
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <Select
                    label='POSまとめ会場'
                    name='posPutTogetherPlaceCode'
                    size='m'
                    selectValues={
                      selectValues.posPutTogetherPlaceCodeSelectValues
                    }
                    blankOption
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <Select
                    label='ライブ会場グループコード'
                    name='livePlaceGroupCode'
                    size='m'
                    selectValues={selectValues.livePlaceGroupCodeSelectValues}
                    blankOption
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                </ColStack>
                <ColStack>
                  <Radio
                    label='ホンダグループ'
                    name='hondaGroupValue'
                    disabled={
                      // 編集権限なしの場合 非活性
                      !userEditFlag ? true : false
                    }
                    required={omatomePlaceFlag ? true : false}
                    radioValues={[
                      {
                        value: 'hondaTarget',
                        displayValue: '対象',
                      },
                      {
                        value: 'hondaUnTarget',
                        displayValue: '対象外',
                      },
                    ]}
                  />
                  <TextField
                    label='保証金'
                    name='guaranteeDeposit'
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合 非活性
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 書類発送指示セクション */}
            <Section name='書類発送指示'>
              <RowStack>
                {/* 縦 1列目 */}
                <ColStack>
                  <Radio
                    label='書類発送指示'
                    name='documentShippingInstructionValue'
                    disabled={
                      // 編集権限なしの場合 非活性
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                    radioValues={[
                      {
                        value: 'sendingDocumentsTarget',
                        displayValue: '対象',
                      },
                      {
                        value: 'sendingDocumentsUnTarget',
                        displayValue: '対象外',
                        // 編集権限なしの場合 非活性
                      },
                    ]}
                  />
                  <Radio
                    label='指示対象'
                    name='referentValue'
                    // 編集権限なしの場合 非活性
                    // 書類発送指示が対象の場合必須
                    required={
                      documentShippingInstructionFlag === true ? true : false
                    }
                    // 編集権限なしの場合非活性
                    // おまとめ会場が対象外の場合、"AUC宛のみ"選択状態で非活性
                    disabled={!userEditFlag || !omatomePlaceFlag ? true : false}
                    radioValues={[
                      {
                        value: 'meberDirectDelivery',
                        displayValue: '会員直送&AUC宛',
                      },
                      {
                        value: 'onlyAuc',
                        displayValue: 'AUC宛のみ',
                      },
                    ]}
                  />
                  <TextField
                    label='担当者'
                    name='documentShippingStaff'
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                  <TextField
                    label='メールアドレス'
                    name='documentShippingMailAddress'
                    size='l'
                    // 書類発送指示が対象の場合 かつFAXが入力されていない場合必須
                    required={
                      documentShippingInstructionFlag === true &&
                      getValues('documentShippingFaxNumber') === ''
                        ? true
                        : false
                    }
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                  <TextField
                    label='FAX'
                    name='documentShippingFaxNumber'
                    // 書類発送指示が対象の場合 かつメールアドレスが入力されていない場合必須
                    required={
                      documentShippingInstructionFlag === true &&
                      getValues('paymentNoticeMailAddress') === ''
                        ? true
                        : false
                    }
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                </ColStack>
              </RowStack>
            </Section>

            {/* 出金設定セクション */}
            <Section name='出金設定'>
              <RowStack>
                {/* 縦 1列目 */}
                <ColStack>
                  <TextField
                    name='paymentDueDate'
                    label='出金期日'
                    unit={'日'}
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                  <Radio
                    label='出金設定'
                    name='paymentAllValue'
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                    radioValues={[
                      {
                        value: 'bulk',
                        displayValue: '一括',
                      },
                      {
                        value: 'eachTime',
                        displayValue: '都度',
                      },
                    ]}
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 振込口座情報セクション */}
            <Section name='振込口座情報'>
              <RowStack>
                {/* 縦 1列目 */}
                <ColStack>
                  <TextField
                    label='銀行名'
                    name='bankName'
                    size='l'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <TextField
                    label='支店名'
                    name='branchName'
                    size='l'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <TextField
                    label='種別'
                    name='accountKind'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                </ColStack>
                {/* 縦 2列目 */}
                <ColStack>
                  <TextField
                    label='口座番号'
                    name='accountNumber'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <TextField
                    label='口座名義'
                    name='accountNameKana'
                    size='m'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <Select
                    label='バーチャル口座付与ルール'
                    name='virtualAccountGiveRuleCode'
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                    selectValues={selectValues.livePlaceGroupCodeSelectValues}
                    blankOption
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 支払通知送付先指定セクション */}
            <Section name='支払通知送付先指定'>
              <RowStack>
                {/* 縦 1列目 */}
                <ColStack>
                  <Radio
                    label='支払通知'
                    name='paymentNoticeValue'
                    disabled={
                      // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                    radioValues={[
                      {
                        value: 'paymentNoticeTarget',
                        displayValue: '対象',
                      },
                      {
                        value: 'paymentNoticeUnTarget',
                        displayValue: '対象外',
                      },
                    ]}
                  />
                  <TextField
                    label='担当者'
                    name='paymentNoticeStaff'
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                  <TextField
                    label='メールアドレス'
                    name='paymentNoticeMailAddress'
                    size='l'
                    // FAXが入力されていない場合 必須
                    required={
                      getValues('paymentNoticeFaxNumber') === '' ? true : false
                    }
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                  <TextField
                    label='FAX'
                    name='paymentNoticeFaxNumber'
                    // メールアドレスが入力されていない場合 必須
                    required={
                      getValues('paymentNoticeMailAddress') === ''
                        ? true
                        : false
                    }
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 入金元口座情報セクション */}
            <Section name='入金元口座情報'>
              <RowStack>
                {/* 縦 1列目 */}
                <ColStack>
                  <Select
                    label='銀行名'
                    name='receiptSourceBankName'
                    size='l'
                    selectValues={selectValues.bankNameSelectValues}
                    blankOption
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                  <Select
                    label='支店名'
                    name='receiptSourceBranchName'
                    size='l'
                    selectValues={selectValues.branchNameSelectValues}
                    blankOption
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                  <TextField
                    label='口座名義'
                    name='receiptSourceAccountNameKana'
                    size='m'
                    // 編集権限なしの場合、またはおまとめ会場が対象外の場合
                    disabled={
                      !userEditFlag || omatomePlaceFlag === false ? true : false
                    }
                  />
                </ColStack>
              </RowStack>
            </Section>
            {/* 会場連絡(会員管理)セクション */}
            <Section name='会場連絡(会員管理)'>
              {/* 縦 1列目 */}
              <RowStack>
                <ColStack>
                  <TextField
                    label='会場会員管理担当メールアドレス'
                    name='placeMemberManagementStaffMailAddress'
                    size='l'
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
                  />
                  <Select
                    label='おまとめ会場連絡不可対象'
                    name='omatomePlaceContactImpossibleTargetedKind'
                    selectValues={
                      selectValues.omatomePlaceContactImpossibleTargetedKindSelectValues
                    }
                    blankOption
                    // 編集権限なしの場合 非活性
                    disabled={!userEditFlag ? true : false}
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
            <ConfirmButton
              onClick={handleConfirm}
              disable={!userEditFlag ? true : false}
            >
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>
      {/* 登録内容確認ポップアップ */}
      {isOpenPopup && (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          // 本画面で使用するのはRegistConfirmのみ
          handleRegistConfirm={handleRegistConfirm}
          handleApprovalConfirm={handleApprovalConfirm}
          handleCancel={handlePopupCancel}
        />
      )}
    </>
  );
};
export default ScrCom0024Page;
