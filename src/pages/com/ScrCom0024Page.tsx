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
import { ColStack, ControlsStackItem, RowStack, Stack } from 'layouts/Stack';

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
  ScrCom9999GetCodeManagementMasterListbox,
  ScrCom9999GetCodeManagementMasterListboxRequest,
  ScrCom9999GetCodeValue,
  ScrCom9999GetCodeValueRequest,
  ScrCom9999GetPlaceMasterListbox,
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

import { CODE_ID } from 'definitions/codeId';

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
  guaranteeDeposit: number | string;
  // ライブ会場グループコード
  livePlaceGroupCode: string;
  // 書類発送指示フラグ
  documentShippingInstructionFlag: boolean;
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
  guaranteeDeposit: '',
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
 * TODO: エラーになる バリデーションスキーマ
 */
const validationSchema = {
  // placeCd: yup.string().label('会場コード').max(2).halfWidthOnly(),
  placeName: yup.string().label('会場名').max(15).fullAndHalfWidth(),
  statementDisplayPlaceName: yup
    .string()
    .label('計算書表示会場名')
    .max(8)
    .fullAndHalfWidth(),
  partnerStartDate: yup.string().label('提携開始日（FROM）').formatYmd(),
  sessionWeekKind: yup.array().label('開催曜日'),
  contractId: yup.string().label('契約ID').max(7).halfWidthOnly(),
  corporationId: yup.string().label('法人ID').max(8).halfWidthOnly(),
  corporationName: yup.string().label('法人名').max(30).fullAndHalfWidth(),
  billingId: yup.string().label('請求先ID').max(4).halfWidthOnly(),
  telephoneNumber: yup
    .string()
    .label('TEL')
    .max(13)
    .halfWidthOnly()
    .formatTel(),
  placeGroupCode: yup.array().label('会場グループ'),
  paymentDestinationPlaceName: yup.array().label('支払先会場名'),
  posPutTogetherPlaceCode: yup.array().label('POSまとめ会場'),
  guaranteeDeposit: yup.string().label('保証金').max(6).numberOnly(),
  documentShippingStaff: yup
    .string()
    .label('担当者')
    .max(30)
    .fullAndHalfWidth(),
  documentShippingMailAddress: yup
    .string()
    .label('メールアドレス')
    .max(254)
    .halfWidthOnly()
    .formatAddress(),
  documentShippingFaxNumber: yup.string().label('FAX').max(13).halfWidthOnly(),
  paymentDueDate: yup.string().label('出金期日').max(2).numberOnly(),
  bankName: yup.string().label('銀行名').max(30).fullAndHalfWidth(),
  branchName: yup.string().label('支店名').max(30).fullAndHalfWidth(),
  accountKind: yup.string().label('種別').max(2).fullAndHalfWidth(),
  accountNumber: yup.string().label('口座番号').max(7).halfWidthOnly(),
  accountNameKana: yup.string().label('口座名義').max(40).fullAndHalfWidth(),
  virtualAccountGiveRuleCode: yup.array().label('バーチャル口座付与ルール'),
  paymentNoticeStaff: yup.string().label('担当者').max(30).fullAndHalfWidth(),
  paymentNoticeMailAddress: yup
    .string()
    .label('メールアドレス')
    .max(254)
    .halfWidthOnly()
    .formatAddress(),
  paymentNoticeFaxNumber: yup
    .string()
    .label('FAX')
    .max(13)
    .halfWidthOnly()
    .formatTel(),
  receiptSourceBankName: yup.array().label('銀行名'),
  receiptSourceBranchName: yup.array().label('支店名'),
  receiptSourceAccountNameKana: yup
    .string()
    .label('口座名義')
    .max(40)
    .fullAndHalfWidth(),
  placeMemberManagementStaffMailAddress: yup
    .string()
    .label('会場会員管理担当メールアドレス')
    .max(254)
    .halfWidthOnly()
    .formatAddress(),
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
 * SCR-COM-0024 会場詳細画面
 */
const ScrCom0024Page = () => {
  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

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
    // 現在表示 初期表示
    const initialize = async (placeCd: string) => {
      // SCR-COM-0024-0001: ライブ会場データ取得API
      const placeBasicRequest: ScrCom0024GetPlaceDataRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        placeCd: placeCd,
      };
      const placeBasicResponse = await ScrCom0024GetPlaceData(
        placeBasicRequest
      );
      const placeBasic = convertToPlaceBasicModel(placeBasicResponse);

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const sessionWeekKindRequest: ScrCom9999GetCodeManagementMasterListboxRequest =
        {
          // TODO: 業務日付取得方法実装後に変更
          businessDate: '',
          // 開催曜日区分
          codeId: CODE_ID[0].codeId,
        };
      const sessionWeekKindResponse =
        await ScrCom9999GetCodeManagementMasterListbox(sessionWeekKindRequest);

      // SCR-COM-9999-0016: 会場マスタリストボックス情報取得API
      const placeGroupResponse = await ScrCom9999GetPlaceMasterListbox();

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const livePlaceGroupCodeRequest: ScrCom9999GetCodeManagementMasterListboxRequest =
        {
          // TODO: 業務日付取得方法実装後に変更
          businessDate: '',
          // ライブ会場グループコード
          codeId: CODE_ID[1].codeId,
        };
      const livePlaceGroupCodeResponse =
        await ScrCom9999GetCodeManagementMasterListbox(
          livePlaceGroupCodeRequest
        );

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const virtualAccountGrantRuleRequest: ScrCom9999GetCodeManagementMasterListboxRequest =
        {
          // TODO: 業務日付取得方法実装後に変更
          businessDate: '',
          // バーチャル口座付与ルール
          codeId: CODE_ID[2].codeId,
        };
      const virtualAccountGrantRuleResponse =
        await ScrCom9999GetCodeManagementMasterListbox(
          virtualAccountGrantRuleRequest
        );

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
      const brannchNameResponse = await ScrCom9999GetCodeValue(
        scrCom9999GetCodeValueRequestForBranch
      );

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const omatomePlaceContactImpossibleTargetedKindRequest: ScrCom9999GetCodeManagementMasterListboxRequest =
        {
          // TODO: 業務日付取得方法実装後に変更
          businessDate: '',
          // おまとめ会場連絡不可対象
          codeId: '',
        };
      const omatomePlaceContactImpossibleTargetedKindResponse =
        await ScrCom9999GetCodeManagementMasterListbox(
          omatomePlaceContactImpossibleTargetedKindRequest
        );

      // 画面にデータを設定
      // 会場基本情報セクション
      setValue('placeCd', placeBasic.placeCd);
      setValue('placeName', placeBasic.placeName);
      setValue('omatomePlaceFlag', placeBasic.omatomePlaceFlag);
      setValue(
        'statementDisplayPlaceName',
        placeBasic.statementDisplayPlaceName
      );
      setValue('useFlag', placeBasic.useFlag);
      setValue('partnerStartDate', placeBasic.partnerStartDate);
      setValue('contractId', placeBasic.contractId);
      setValue('corporationId', placeBasic.corporationId);
      setValue('corporationName', placeBasic.corporationName);
      setValue('telephoneNumber', placeBasic.telephoneNumber);
      setValue(
        'paymentDestinationPlaceName',
        placeBasic.paymentDestinationPlaceName
      );
      setValue('hondaGroupFlag', placeBasic.hondaGroupFlag);
      setValue('guaranteeDeposit', placeBasic.guaranteeDeposit);
      // 書類発送指示セクション
      setValue(
        'documentShippingInstructionFlag',
        placeBasic.documentShippingInstructionFlag
      );
      setValue(
        'documentShippingPlaceDirectDeliveryFlag',
        placeBasic.documentShippingPlaceDirectDeliveryFlag
      );
      setValue('documentShippingStaff', placeBasic.documentShippingStaff);
      setValue(
        'documentShippingMailAddress',
        placeBasic.documentShippingMailAddress
      );
      setValue(
        'documentShippingFaxNumber',
        placeBasic.documentShippingFaxNumber
      );
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
      setValue(
        'receiptSourceAccountNameKana',
        placeBasic.receiptSourceAccountNameKana
      );
      // 会場連絡（会員管理）セクション
      setValue(
        'placeMemberManagementStaffMailAddress',
        placeBasic.placeMemberManagementStaffMailAddress
      );

      setSelectValues({
        // 開催曜日
        sessionWeekKindSelectValues:
          sessionWeekKindResponse.searchGetCodeManagementMasterListbox,
        // 会場グループ
        placeGroupCodeSelectValues:
          placeGroupResponse.searchGetPlaceMasterListbox,
        // 支払先会場名
        paymentDestinationPlaceNameSelectValues:
          placeGroupResponse.searchGetPlaceMasterListbox,
        // POSまとめ会場
        posPutTogetherPlaceCodeSelectValues:
          placeGroupResponse.searchGetPlaceMasterListbox,
        // ライブ会場グループコード
        livePlaceGroupCodeSelectValues:
          livePlaceGroupCodeResponse.searchGetCodeManagementMasterListbox,
        // バーチャル口座付与ルール
        virtualAccountGrantRuleSelectValues:
          virtualAccountGrantRuleResponse.searchGetCodeManagementMasterListbox,
        // 銀行名
        bankNameSelectValues: convertToCodeValueSelectValueModel(
          bankNameResponse.resultList
        ),
        // 支店名
        branchNameSelectValues: convertToCodeValueSelectValueModel(
          brannchNameResponse.resultList
        ),
        // おまとめ会場連絡不可対象
        omatomePlaceContactImpossibleTargetedKindSelectValues:
          omatomePlaceContactImpossibleTargetedKindResponse.searchGetCodeManagementMasterListbox,
      });
    };

    // 新規追加 初期表示
    const initializeNew = async () => {
      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const sessionWeekKindRequest: ScrCom9999GetCodeManagementMasterListboxRequest =
        {
          // TODO: 業務日付取得方法実装後に変更
          businessDate: '',
          // 開催曜日区分
          codeId: CODE_ID[0].codeId,
        };
      const sessionWeekKindResponse =
        await ScrCom9999GetCodeManagementMasterListbox(sessionWeekKindRequest);

      // SCR-COM-9999-0016: 会場マスタリストボックス情報取得API
      const placeGroupResponse = await ScrCom9999GetPlaceMasterListbox();

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const livePlaceGroupCodeRequest: ScrCom9999GetCodeManagementMasterListboxRequest =
        {
          // TODO: 業務日付取得方法実装後に変更
          businessDate: '',
          // ライブ会場グループコード
          codeId: CODE_ID[1].codeId,
        };
      const livePlaceGroupCodeResponse =
        await ScrCom9999GetCodeManagementMasterListbox(
          livePlaceGroupCodeRequest
        );

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const virtualAccountGrantRuleRequest: ScrCom9999GetCodeManagementMasterListboxRequest =
        {
          // TODO: 業務日付取得方法実装後に変更
          businessDate: '',
          // バーチャル口座付与ルール
          codeId: CODE_ID[2].codeId,
        };
      const virtualAccountGrantRuleResponse =
        await ScrCom9999GetCodeManagementMasterListbox(
          virtualAccountGrantRuleRequest
        );

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
      const brannchNameResponse = await ScrCom9999GetCodeValue(
        scrCom9999GetCodeValueRequestForBranch
      );

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const omatomePlaceContactImpossibleTargetedKindRequest: ScrCom9999GetCodeManagementMasterListboxRequest =
        {
          // TODO: 業務日付取得方法実装後に変更
          businessDate: '',
          // おまとめ会場連絡不可対象
          codeId: '',
        };
      const omatomePlaceContactImpossibleTargetedKindResponse =
        await ScrCom9999GetCodeManagementMasterListbox(
          omatomePlaceContactImpossibleTargetedKindRequest
        );

      // 画面にデータを設定
      setSelectValues({
        // 開催曜日
        sessionWeekKindSelectValues:
          sessionWeekKindResponse.searchGetCodeManagementMasterListbox,
        // 会場グループ
        placeGroupCodeSelectValues:
          placeGroupResponse.searchGetPlaceMasterListbox,
        // 支払先会場名
        paymentDestinationPlaceNameSelectValues:
          placeGroupResponse.searchGetPlaceMasterListbox,
        // POSまとめ会場
        posPutTogetherPlaceCodeSelectValues:
          placeGroupResponse.searchGetPlaceMasterListbox,
        // ライブ会場グループコード
        livePlaceGroupCodeSelectValues:
          livePlaceGroupCodeResponse.searchGetCodeManagementMasterListbox,
        // バーチャル口座付与ルール
        virtualAccountGrantRuleSelectValues:
          virtualAccountGrantRuleResponse.searchGetCodeManagementMasterListbox,
        // 銀行名
        bankNameSelectValues: convertToCodeValueSelectValueModel(
          bankNameResponse.resultList
        ),
        // 支店名
        branchNameSelectValues: convertToCodeValueSelectValueModel(
          brannchNameResponse.resultList
        ),
        // おまとめ会場連絡不可対象
        omatomePlaceContactImpossibleTargetedKindSelectValues:
          omatomePlaceContactImpossibleTargetedKindResponse.searchGetCodeManagementMasterListbox,
      });
    };

    // 新規作成の画面遷移の場合は初期表示のAPIを呼び出さない
    if (placeCode === undefined || placeCode === 'new') {
      initializeNew();
    } else {
      initialize(placeCode);
    }
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
      documentShippingPlaceDirectDeliveryFlag:
        response.documentShippingPlaceDirectDeliveryFlag,
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
      placeMemberManagementStaffMailAddress:
        response.placeMemberManagementStaffMailAddress,
      omatomePlaceContactImpossibleTargetedKind:
        response.omatomePlaceContactImpossibleTargetedKind,
    };
  };

  /**
   *  API-COM-9999-0031: コード値取得API（コード管理マスタ以外）レスポンスから SelectValueモデルへの変換
   */
  const convertToCodeValueSelectValueModel = (
    resultList: ResultList[]
  ): SelectValue[] => {
    return resultList.map((x) => {
      return {
        value: '',
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
      changeExpectDate: '2022/03/18',
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
        receiptSourceBankCode: getValues('receiptSourceBankCode'),
        receiptSourceBranchCode: getValues('receiptSourceBranchCode'),
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
    console.log(
      '登録承認ボタン押下後 呼び出し元画面にて受け取った登録変更メモ：' +
        registrationChangeMemo
    );
    setIsOpenPopup(false);
  };

  /**
   * セクション構造定義
   */
  // const sectionDef = [
  //   {
  //     section: '会場基本情報',
  //     fields: [
  //       'placeCd',
  //       'placeName',
  //       'omatomePlaceFlag',
  //       'statementDisplayPlaceName',
  //       'partnerStartDate',
  //       'sessionWeekKind',
  //       'placeGroupCode',
  //       'paymentDestinationPlaceName',
  //       'posPutTogetherPlaceCode',
  //       'hondaGroupFlag',
  //       'livePlaceGroupCode',
  //     ],
  //   },
  //   {
  //     section: '書類発送指示',
  //     fields: [
  //       'instructionsForSendingDocuments',
  //       'referent',
  //       'documentShippingStaff',
  //       'documentShippingMailAddress',
  //       'documentShippingFaxNumber',
  //     ],
  //   },
  //   {
  //     section: '出金設定',
  //     fields: ['paymentDueDate', 'paymentConfig'],
  //   },
  //   {
  //     section: '振込口座情報',
  //     fields: [
  //       'bankName',
  //       'branchName',
  //       'accountKind',
  //       'accountNumber',
  //       'accountNameKana',
  //       'virtualAccountGiveRuleCode',
  //     ],
  //   },
  //   {
  //     section: '支払通知送付先指定',
  //     fields: [
  //       'paymentNotice',
  //       'paymentNoticeStaff',
  //       'paymentNoticeMailAddress',
  //       'paymentNoticeFaxNumber',
  //     ],
  //   },
  //   {
  //     section: '入金元口座情報',
  //     fields: [
  //       'receiptSourceBankName',
  //       'receiptSourceBranchName',
  //       'receiptSourceAccountNameKana',
  //     ],
  //   },
  //   {
  //     section: '会場連絡(会員管理)',
  //     fields: [
  //       'placeMemberManagementStaffMailAddress',
  //       'omatomePlaceContactImpossibleTargetedKind',
  //     ],
  //   },
  // ];

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 会場基本情報セクション */}
            <Section name='会場基本情報'>
              {/* 1列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField label='会場コード' name='placeCd' required />
                </ControlsStackItem>
                <ControlsStackItem>
                  <TextField label='法人ID' name='corporationId' />
                </ControlsStackItem>
                <ControlsStackItem>
                  <Radio
                    label='ホンダグループ'
                    name='hondaGroupFlag'
                    required
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
                </ControlsStackItem>
              </RowStack>
              {/* 2列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField label='会場名' name='placeName' required />
                </ControlsStackItem>
                <ControlsStackItem>
                  <TextField label='法人名' name='corporationName' />
                </ControlsStackItem>
                <ControlsStackItem>
                  <TextField label='保証金' name='guaranteeDeposit' />
                </ControlsStackItem>
              </RowStack>
              {/* 3列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Radio
                    label='おまとめ会場'
                    name='omatomePlaceFlag'
                    required
                    radioValues={[
                      {
                        value: 'target',
                        displayValue: '対象',
                        disabled: false,
                      },
                      {
                        value: 'unTarget',
                        displayValue: '対象外',
                        disabled: false,
                      },
                    ]}
                  />
                </ControlsStackItem>
                <ControlsStackItem>
                  <TextField label='請求先ID' name='billingId' />
                </ControlsStackItem>
              </RowStack>
              {/* 4列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField
                    label='計算書表示会場名'
                    name='statementDisplayPlaceName'
                    required
                  />
                </ControlsStackItem>
                <ControlsStackItem>
                  <TextField label='TEL' name='telephoneNumber' />
                </ControlsStackItem>
              </RowStack>
              {/* 5列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Radio
                    label='利用フラグ'
                    name='useFlag'
                    required
                    radioValues={[
                      {
                        value: 'yes',
                        displayValue: '可',
                        disabled: false,
                      },
                      {
                        value: 'no',
                        displayValue: '不可',
                        disabled: false,
                      },
                    ]}
                  />
                </ControlsStackItem>
                <ControlsStackItem>
                  <Select
                    label='会場グループ'
                    name='placeGroupCode'
                    selectValues={selectValues.placeGroupCodeSelectValues}
                    blankOption
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 6列目 */}
              <RowStack>
                <ControlsStackItem>
                  <DatePicker
                    label='提供開始日'
                    name='partnerStartDate'
                    // wareki
                    required
                  />
                </ControlsStackItem>
                <ControlsStackItem>
                  <Select
                    label='支払先会場名'
                    name='paymentDestinationPlaceName'
                    selectValues={
                      selectValues.paymentDestinationPlaceNameSelectValues
                    }
                    blankOption
                    required
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 7列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Select
                    label='開催曜日'
                    name='sessionWeekKind'
                    selectValues={selectValues.sessionWeekKindSelectValues}
                    blankOption
                    required
                  />
                </ControlsStackItem>
                <ControlsStackItem>
                  <Select
                    label='POSまとめ会場'
                    name='posPutTogetherPlaceCode'
                    selectValues={
                      selectValues.posPutTogetherPlaceCodeSelectValues
                    }
                    blankOption
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 8列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Select
                    label='ライブ会場グループコード'
                    name='livePlaceGroupCode'
                    selectValues={selectValues.livePlaceGroupCodeSelectValues}
                    blankOption
                  />
                </ControlsStackItem>
              </RowStack>
            </Section>

            {/* 書類発送指示セクション */}
            <Section name='書類発送指示'>
              {/* 1列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Radio
                    label='書類発送指示'
                    name='instructionsForSendingDocuments'
                    radioValues={[
                      {
                        value: 'sendingDocumentsTarget',
                        displayValue: '対象',
                        disabled: false,
                      },
                      {
                        value: 'sendingDocumentsUnTarget',
                        displayValue: '対象外',
                        disabled: false,
                      },
                    ]}
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 2列目 */}

              <RowStack>
                <ControlsStackItem>
                  <Radio
                    label='指示対象'
                    name='referent'
                    radioValues={[
                      {
                        value: 'meberDirectDelivery',
                        displayValue: '会員直送&AUC宛',
                        disabled: false,
                      },
                      {
                        value: 'onlyAuc',
                        displayValue: 'AUC宛のみ',
                        disabled: false,
                      },
                    ]}
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 3列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField label='担当者' name='documentShippingStaff' />
                </ControlsStackItem>
              </RowStack>
              {/* 4列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField
                    label='メールアドレス'
                    name='documentShippingMailAddress'
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 5列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField label='FAX' name='documentShippingFaxNumber' />
                </ControlsStackItem>
              </RowStack>
            </Section>

            {/* 出金設定セクション */}
            <Section name='出金設定'>
              {/* 1列目 */}
              <RowStack>
                <ColStack>
                  <ControlsStackItem>
                    <TextField name='paymentDueDate' label='出金期日' />
                    {/* TODO: テキストボックスの後ろに[日]の文字列を配置する */}
                    {/* <Typography variant='body2'>{'日'}</Typography> */}
                  </ControlsStackItem>
                </ColStack>
              </RowStack>
              {/* 2列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Radio
                    label='出金設定'
                    name='paymentConfig'
                    radioValues={[
                      {
                        value: 'bulk',
                        displayValue: '一括',
                        disabled: false,
                      },
                      {
                        value: 'eachTime',
                        displayValue: '都度',
                        disabled: false,
                      },
                    ]}
                  />
                </ControlsStackItem>
              </RowStack>
            </Section>

            {/* 振込口座情報セクション */}
            <Section name='振込口座情報'>
              {/* 1列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField label='銀行名' name='bankName' />
                </ControlsStackItem>
                <ControlsStackItem>
                  <TextField label='口座番号' name='accountNumber' />
                </ControlsStackItem>
              </RowStack>
              {/* 2列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField label='支店名' name='branchName' />
                </ControlsStackItem>
                <ControlsStackItem>
                  <TextField label='口座名義' name='accountNameKana' />
                </ControlsStackItem>
              </RowStack>
              {/* 3列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField label='種別' name='accountKind' />
                </ControlsStackItem>
                <ControlsStackItem>
                  <Select
                    label='バーチャル口座付与ルール'
                    name='virtualAccountGiveRuleCode'
                    selectValues={selectValues.livePlaceGroupCodeSelectValues}
                    blankOption
                  />
                </ControlsStackItem>
              </RowStack>
            </Section>

            {/* 支払通知送付先指定セクション */}
            <Section name='支払通知送付先指定'>
              {/* 1列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Radio
                    label='支払通知'
                    name='paymentNotice'
                    radioValues={[
                      {
                        value: 'paymentNoticeTarget',
                        displayValue: '対象',
                        disabled: false,
                      },
                      {
                        value: 'paymentNoticeUnTarget',
                        displayValue: '対象外',
                        disabled: false,
                      },
                    ]}
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 2列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField label='担当者' name='paymentNoticeStaff' />
                </ControlsStackItem>
              </RowStack>
              {/* 3列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField
                    label='メールアドレス'
                    name='paymentNoticeMailAddress'
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 4列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField label='FAX' name='paymentNoticeFaxNumber' />
                </ControlsStackItem>
              </RowStack>
            </Section>

            {/* 入金元口座情報セクション */}
            <Section name='入金元口座情報'>
              {/* 1列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Select
                    label='銀行名'
                    name='receiptSourceBankName'
                    selectValues={selectValues.bankNameSelectValues}
                    blankOption
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 2列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Select
                    label='支店名'
                    name='receiptSourceBranchName'
                    selectValues={selectValues.branchNameSelectValues}
                    blankOption
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 3列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField
                    label='口座名義'
                    name='receiptSourceAccountNameKana'
                  />
                </ControlsStackItem>
              </RowStack>
            </Section>

            {/* 会場連絡(会員管理)セクション */}
            <Section name='会場連絡(会員管理)'>
              {/* 1列目 */}
              <RowStack>
                <ControlsStackItem>
                  <TextField
                    label='会場会員管理担当メールアドレス'
                    name='placeMemberManagementStaffMailAddress'
                  />
                </ControlsStackItem>
              </RowStack>
              {/* 2列目 */}
              <RowStack>
                <ControlsStackItem>
                  <Select
                    label='おまとめ会場連絡不可対象'
                    name='omatomePlaceContactImpossibleTargetedKind'
                    selectValues={
                      selectValues.omatomePlaceContactImpossibleTargetedKindSelectValues
                    }
                    blankOption
                  />
                </ControlsStackItem>
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
        // 本画面で使用するのはRegistConfirmのみ
        handleRegistConfirm={handleRegistConfirm}
        handleApprovalConfirm={handleApprovalConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  );
};
export default ScrCom0024Page;
