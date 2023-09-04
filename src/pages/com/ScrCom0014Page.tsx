import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import {
  ConditionalTable,
  ConditionKind,
  ConditionModel,
  exportCsv,
} from 'controls/ConditionalTable';
import { DatePicker } from 'controls/DatePicker';
import { Icon } from 'controls/Icon/Icon';
import { WarningLabel } from 'controls/Label';
import {
  convertFromConditionToPricingTableRows,
  PricingTable,
  PricingTableModel,
} from 'controls/PricingTable';
import { Radio } from 'controls/Radio';
import { Select, SelectValue } from 'controls/Select';
import { TableColDef } from 'controls/Table';
import { TextField } from 'controls/TextField';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import {
  commissionConditionList,
  commissionPriceList,
  ScrCom0014ApplyRegistrationCommissionInfo,
  ScrCom0014ApplyRegistrationCommissionInfoRequest,
  ScrCom0014CommissionCheck,
  ScrCom0014CommissionCheckRequest,
  ScrCom0014GetCommissionDisplay,
  ScrCom0014GetCommissionDisplayRequest,
  ScrCom0014GetCommissionDisplayResponse,
} from 'apis/com/ScrCom0014Api';
import {
  ScrCom0034DeleteAllRegistrationWork,
  ScrCom0034DeleteAllRegistrationWorkRequest,
  ScrCom0034GetAllRegistrationWork,
  ScrCom0034GetAllRegistrationWorkRequest,
} from 'apis/com/ScrCom0034Api';
import {
  ChangeExpectDateInfo,
  comCommissionConditionList,
  CommissionDiscountConditionValueList,
  ResultList,
  ScrCom9999GetChangeDate,
  ScrCom9999GetChangeDateRequest,
  ScrCom9999GetCodeValue,
  ScrCom9999GetCodeValueRequest,
  ScrCom9999GetCommissionCondition,
  ScrCom9999GetCommissionConditionRequest,
  ScrCom9999GetCommissionKind,
  ScrCom9999GetCommissionKindRequest,
  ScrCom9999GetCommissionKindResponse,
  ScrCom9999GetHistoryInfoRequest,
  ScrCom9999GetStatementKind,
  ScrCom9999GetStatementKindRequest,
  ScrCom9999ValueAttributeConversion,
  ScrCom9999ValueAttributeConversionRequest,
  statementKindList,
} from 'apis/com/ScrCom9999Api';
import {
  codeList,
  ScrTra9999GetCodeValue,
  ScrTra9999GetCodeValueRequest,
} from 'apis/tra/ScrTra9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { comApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';
import { Format } from 'utils/FormatUtil';

import { ThemeProvider } from '@mui/material/styles';
import { useGridApiRef } from '@mui/x-data-grid';
import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from './popups/ScrCom0032Popup';
import ScrCom0033Popup, {
  ScrCom0033PopupModel,
} from './popups/ScrCom0033Popup';
import ScrCom0035Popup, {
  ScrCom0035PopupAllRegistrationDefinitionModel,
} from './popups/ScrCom0035Popup';

/**
 * 手数料情報詳細 データモデル
 */
interface CommissionTableDetailModel {
  /** 手数料ID */
  commissionId: string;
  /** 手数料種類区分 */
  commissionKind: string;
  /** 手数料種類区分名 */
  commissionKindName: string;
  /** 手数料名 */
  commissionName: string;
  /** 稟議書ID */
  approvalDocumentId: string;
  /** 商品クレームコード */
  goodsClaimCode: string;
  /** 利用フラグ */
  useFlag: string;
  /** 計算書種別 */
  statementKind: string;
  /** 利用開始日 */
  useStartDate: string;
  /** 条件設定セクション */
  commissionConditionList: commissionConditionList[];
  /** 価格設定セクション */
  commissionPriceList: commissionPriceList[];
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectedDate: string;
}

/**
 * 手数料情報詳細 初期データ
 */
const initialValues: CommissionTableDetailModel = {
  commissionId: '',
  commissionName: '',
  commissionKind: '',
  commissionKindName: '',
  approvalDocumentId: '',
  goodsClaimCode: '',
  useFlag: '',
  statementKind: '',
  useStartDate: '',
  commissionConditionList: [],
  commissionPriceList: [],
  // 変更履歴関連
  changeHistoryNumber: '',
  changeExpectedDate: '',
};

/**
 * 手数料種類以外 プルダウンデータモデル
 */
interface SelectValuesModel {
  // 商品コード
  goodsClaimCodeSelectValues: SelectValue[];
  // 計算書種別
  statementKindSelectValues: SelectValue[];
  // 変更予約情報
  changeReservationInfoSelectValues: SelectValue[];
}

/**
 * 手数料種類 プルダウン データモデル
 */
interface commissionKindSelectValuesModel {
  // 手数料種類
  commissionKindSelectValues: SelectValue[];
}

/**
 * 手数料種類以外 プルダウン 初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 商品コード
  goodsClaimCodeSelectValues: [],
  // 計算書種別
  statementKindSelectValues: [],
  // 変更予約情報
  changeReservationInfoSelectValues: [],
};

/**
 * 手数料種類 プルダウン 初期データ
 */
const commissionKindSelectValuesInitialValue: commissionKindSelectValuesModel =
  {
    // 手数料種類
    commissionKindSelectValues: [],
  };

// 取込対象選択（一括登録定義）
const allRegistrationDefinitions = [
  { id: 'BRG-COM-0001', label: '手数料テーブル詳細' },
];

/**
 * バリデーションスキーマ
 */
const validationSchema = {
  commissionId: yup.string().label('手数料ID').max(6).half(),
  commissionName: yup.string().label('手数料名').max(30).required(),
  commissionKind: yup.array().label('手数料種類').required(),
  approvalDocumentId: yup.string().label('稟議書ID').max(20).half(),
  goodsClaimCode: yup.array().label('商品クレームコード').required(),
  statementKind: yup.array().label('計算書種別').required(),
  useStartDate: yup.string().label('利用開始日').date().required(),
  useFlag: yup.boolean().label('利用フラグ').required(),
  // 条件設定セクション
  conditionType: yup.array().label('条件種類'),
  conditions: yup.array().label('条件'),
  conditionVal: yup.array().label('値'),
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
 * 登録内容申請ポップアップ初期データ
 */
const scrCom0033PopupInitialValues: ScrCom0033PopupModel = {
  // 画面ID
  screenId: '',
  // タブID
  tabId: 0,
  // 申請金額
  applicationMoney: 0,
};

/**
 * CSV読込（ポップアップ）プロパティ
 */
export interface ScrCom0035PopupProps {
  // 取込対象選択（一括登録定義）
  allRegistrationDefinitions: ScrCom0035PopupAllRegistrationDefinitionModel[];
  // 画面ID
  screenId: string;
  // タブID
  tabId?: number;
  // ポップアップ表示フラグ制御
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * 画面ID 定数定義
 */
const SCR_COM_0014 = 'SCR-COM-0014';

/**
 * コードID 定数定義
 */
const CDE_TRA_0001 = 'CDE-TRA-0001';

/**
 * 条件セクション
 */
const columns: TableColDef[] = [
  { field: 'conditionKindCode', headerName: '条件種類', width: 150 },
  { field: 'conditions', headerName: '条件', width: 100 },
  { field: 'conditionVal', headerName: '値', width: 150 },
];

/**
 * API-COM-0014 手数料テーブル詳細画面
 */
const ScrCom0014Page = () => {
  /**
   * クエリパラメータ
   */
  const [searchParams] = useSearchParams();
  // 変更履歴番号
  const changeHistoryNumber = searchParams.get('change-history-number');
  // 一括登録ID
  const allRegistrationId = searchParams.get('all-registration-id');

  // form
  const methods = useForm<CommissionTableDetailModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchema)),
    // context: isReadOnly,
  });

  const {
    formState: { dirtyFields, errors },
    setValue,
    getValues,
    reset,
    watch,
  } = methods;

  // router
  const { commissionId } = useParams();
  const navigate = useNavigate();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );

  const [commissionKindSelectValues, setCommissionKindSelectValues] =
    useState<commissionKindSelectValuesModel>(
      commissionKindSelectValuesInitialValue
    );

  // 項目の活性化・非活性化を判定するフラグ
  const [activeFlag, setActiveFlag] = useState(false);
  // 条件セクションの設定値
  // 条件種類
  const [conditionKinds, setConditionKinds] = useState<ConditionKind[]>([]);
  // 条件
  const [operators, setOperators] = useState<SelectValue[]>([]);
  // 反映予定日チェック用
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckisOpen, setChangeHistoryDateCheckisOpen] =
    useState<boolean>(false);
  // 条件設定セクションの編集中を管理するフラグ
  const [editFlg, setEditFlg] = useState<boolean>(false);
  // 反映ボタン押下時のエラーメッセージ表示⇔非表示を管理するフラグ
  const [errorMessageFlag, setErrorMessageFlag] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // user情報
  const { user } = useContext(AuthContext);
  const userEditFlag =
    user.editPossibleScreenIdList === undefined
      ? ''
      : user.editPossibleScreenIdList.includes(SCR_COM_0014);

  const apiRef = useGridApiRef();

  // 登録内容確認ポップアップ
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  // 登録内容確認ポップアップ=> 登録内容申請ポップアップへ渡す変更・予約メモ
  const [registrationChangeMemo, setRegistrationChangeMemo] =
    useState<string>('');

  // 登録内容申請ポップアップ
  const [isOpenApplicationPopup, setIsOpenApplicationPopup] = useState(false);
  const [scrCom0033PopupData, setScrCom0033PopupData] =
    useState<ScrCom0033PopupModel>(scrCom0033PopupInitialValues);

  // CSV読込ポップアップ
  const [isOpenCsvPopup, setIsOpenCsvPopup] = useState(false);

  const [maxSectionWidth, setMaxSectionWidth] = useState<number>(0);

  // メッセージの取得
  const { getMessage } = useContext(MessageContext);

  // セクションの横幅調整
  useEffect(() => {
    setMaxSectionWidth(
      Number(
        apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
      ) + 40
    );
  }, [apiRef, apiRef.current.rootElementRef]);

  // 初期表示時の処理
  useEffect(() => {
    // 初期表示処理(現在情報の表示)
    const initializeCurrent = async (commissionId: string) => {
      // 計算書種別・手数料種類を非活性化するフラグ
      setActiveFlag(false);

      // API-COM-0014-0001: 手数料表示API
      const getCommissionDisplayRequest: ScrCom0014GetCommissionDisplayRequest =
        {
          businessDate: user.taskDate,
          commissionId: commissionId,
        };
      const getCommissionDisplayResponse = await ScrCom0014GetCommissionDisplay(
        getCommissionDisplayRequest
      );

      // API-COM-9999-0026: 変更予定日取得API
      const getChangeDateRequest: ScrCom9999GetChangeDateRequest = {
        // 画面ID
        screenId: SCR_COM_0014,
        // タブID
        tabId: 0,
        // マスタID
        masterId: commissionId,
        // 業務日付
        businessDate: user.taskDate,
      };
      const getChangeDateResponse = await ScrCom9999GetChangeDate(
        getChangeDateRequest
      );

      // API-TRA-9999-0001: コードマスタ（取引会計）情報取得API
      const getTraCodeValueRequest: ScrTra9999GetCodeValueRequest = {
        codes: [
          {
            codeId: CDE_TRA_0001,
          },
        ],
      };
      const getTraCodeValueResponse = await ScrTra9999GetCodeValue(
        getTraCodeValueRequest
      );

      // API-COM-9999-0012: 計算書種別情報取得API
      const getStatementKindRequest: ScrCom9999GetStatementKindRequest = {
        commissionId: commissionId,
      };
      const getStatementKindResponse = await ScrCom9999GetStatementKind(
        getStatementKindRequest
      );

      // API-COM-9999-0031: コード値取得API（コード管理マスタ以外）
      const getComCodeValueRequest: ScrCom9999GetCodeValueRequest = {
        entityList: [
          {
            // 条件種類マスタ
            entityName: 'condition_kind_master',
          },
        ],
      };
      const getComCodeValueResponse = await ScrCom9999GetCodeValue(
        getComCodeValueRequest
      );

      // API-COM-9999-0019: 手数料種類導出API
      const getCommissionKindRequest: ScrCom9999GetCommissionKindRequest = {
        statementKind: getValues('statementKind'),
      };
      const getCommissionKindResponse = await ScrCom9999GetCommissionKind(
        getCommissionKindRequest
      );

      // API-COM-9999-0013: 手数料条件取得API
      const getCommissionConditionRequest: ScrCom9999GetCommissionConditionRequest =
        {
          commissionId: commissionId,
        };
      const getCommissionConditionResponse =
        await ScrCom9999GetCommissionCondition(getCommissionConditionRequest);

      // 条件設定セクションの条件をセレクトモデルに変換する
      const operators = convertToCommissionConditionSelectValueModel(
        getCommissionConditionResponse.commissionConditionList
      );
      // 条件を設定
      setOperators(operators);

      // 条件テーブルの条件種類・条件・値の初期表示時の値設定
      const conditions = convertToCommissionConditionRowModel(
        getCommissionDisplayResponse
      );
      setConditions(conditions);

      // 条件種類と条件を設定し値を[]で設定
      const conditionTypes = changeCommissionsNothingValueModel(
        // 条件種類
        getComCodeValueResponse.resultList
      );

      for (let i = 0; i < conditionTypes.length; i++) {
        // API-COM-9999-0020: 値属性変換API
        const valueAttributeConversionRequest: ScrCom9999ValueAttributeConversionRequest =
          {
            // 条件種類コード
            // conditionKindCode: x.value,
            conditionKindCode: conditionTypes[i].value,
          };
        const valueAttributeConversionResponse =
          await ScrCom9999ValueAttributeConversion(
            valueAttributeConversionRequest
          );

        // 型区分が1の場合のみリストボックスで項目を表示
        if (valueAttributeConversionResponse.typeKind === '1') {
          conditionTypes[i].selectValues = convertToConversionSelectValueModel(
            valueAttributeConversionResponse.commissionDiscountConditionValueList
          );
        }
      }

      // 条件種類を設定
      setConditionKinds(conditionTypes);

      // API-COM-0014-0001: 手数料表示API レスポンスデータを 手数料詳細情報に変換
      const commissionResult = convertToCommissionTableDetailModel(
        getCommissionDisplayResponse,
        commissionId
      );

      // 画面にデータを設定
      reset(commissionResult);

      // プルダウンにデータを設定（手数料種類以外）
      setSelectValues({
        // 商品コード
        goodsClaimCodeSelectValues: convertToTraCodeValueSelectValueModel(
          getTraCodeValueResponse.codes[0].codeList
        ),
        // 計算書種別
        statementKindSelectValues: convertToStatementKindSelectValueModel(
          getStatementKindResponse.statementKindList
        ),
        // 変更予約情報
        changeReservationInfoSelectValues:
          convertToChangeExpectDateSelectValueModel(
            getChangeDateResponse.changeExpectDateInfo
          ),
      });

      // プルダウンにデータを設定（手数料種類）
      setCommissionKindSelectValues({
        // 手数料種類
        commissionKindSelectValues: convertToCommissionKindSelectValuesModel(
          getCommissionKindResponse
        ),
      });
    };

    // 初期表示処理(履歴表示)
    const initializeHistory = async (commissionId: string) => {
      // 計算書種別・手数料種類を非活性にする
      setActiveFlag(false);

      // API-COM-9999-0019: 手数料種類導出API
      const getCommissionKindRequest: ScrCom9999GetCommissionKindRequest = {
        statementKind: '',
      };
      const getCommissionKindResponse = await ScrCom9999GetCommissionKind(
        getCommissionKindRequest
      );

      // API-COM-9999-0025: 変更履歴情報取得API
      const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
        changeHistoryNumber: getValues('changeHistoryNumber'),
      };
      const getHistoryInfoResponse = (
        await comApiClient.post(
          '/api/com/scr-com-9999/get-history-info',
          getHistoryInfoRequest
        )
      ).data;

      const historyInfo = convertToHistoryInfo(
        getHistoryInfoResponse,
        getValues('changeHistoryNumber')
      );

      // 画面にデータを設定
      reset(historyInfo);

      // API-COM-9999-0026: 変更予定日取得API
      const getChangeDateRequest: ScrCom9999GetChangeDateRequest = {
        // 画面ID
        screenId: SCR_COM_0014,
        // タブID
        tabId: 0,
        // マスタID
        masterId: commissionId,
        // 業務日付
        businessDate: user.taskDate,
      };
      const getChangeDateResponse = await ScrCom9999GetChangeDate(
        getChangeDateRequest
      );

      // API-TRA-9999-0001: コードマスタ（取引会計）情報取得API
      const getTraCodeValueRequest: ScrTra9999GetCodeValueRequest = {
        codes: [
          {
            codeId: CDE_TRA_0001,
          },
        ],
      };
      const getTraCodeValueResponse = await ScrTra9999GetCodeValue(
        getTraCodeValueRequest
      );

      // API-COM-9999-0012: 計算書種別情報取得API
      const getStatementKindRequest: ScrCom9999GetStatementKindRequest = {
        commissionId: commissionId,
      };
      const getStatementKindResponse = await ScrCom9999GetStatementKind(
        getStatementKindRequest
      );

      // API-COM-9999-0031: コード値取得API（コード管理マスタ以外）
      const getComCodeValueRequest: ScrCom9999GetCodeValueRequest = {
        entityList: [
          {
            // 条件種類マスタ
            entityName: 'condition_kind_master',
          },
        ],
      };
      const getComCodeValueResponse = await ScrCom9999GetCodeValue(
        getComCodeValueRequest
      );

      // API-COM-9999-0013: 手数料条件情報取得API
      const getCommissionConditionRequest: ScrCom9999GetCommissionConditionRequest =
        {
          commissionId: commissionId,
        };
      const getCommissionConditionResponse =
        await ScrCom9999GetCommissionCondition(getCommissionConditionRequest);

      // 条件設定セクションの条件をセレクトモデルに変換する
      const operators = convertToCommissionConditionSelectValueModel(
        getCommissionConditionResponse.commissionConditionList
      );
      // 条件を設定
      setOperators(operators);

      // 条件種類と条件を設定し値を[]で設定
      const conditionTypes = changeCommissionsNothingValueModel(
        // 条件種類
        getComCodeValueResponse.resultList
      );

      conditionTypes.forEach(async (x) => {
        // API-COM-9999-0020: 値属性変換API
        const valueAttributeConversionRequest: ScrCom9999ValueAttributeConversionRequest =
          {
            // 条件種類コード
            conditionKindCode: x.value,
          };
        const valueAttributeConversionResponse =
          await ScrCom9999ValueAttributeConversion(
            valueAttributeConversionRequest
          );

        // 型区分が1の場合のみリストボックスで項目を表示
        if (valueAttributeConversionResponse.typeKind === '1') {
          x.selectValues = convertToConversionSelectValueModel(
            valueAttributeConversionResponse.commissionDiscountConditionValueList
          );
        }
      });

      // 条件種類を設定
      setConditionKinds(conditionTypes);

      // プルダウンにデータを設定(手数料種類以外)
      setSelectValues({
        // 商品コード
        goodsClaimCodeSelectValues: convertToTraCodeValueSelectValueModel(
          getTraCodeValueResponse.codes[0].codeList
        ),
        // 計算書種別
        statementKindSelectValues: convertToStatementKindSelectValueModel(
          getStatementKindResponse.statementKindList
        ),
        // 変更予約情報
        changeReservationInfoSelectValues:
          convertToChangeExpectDateSelectValueModel(
            getChangeDateResponse.changeExpectDateInfo
          ),
      });

      // プルダウンにデータを設定（手数料種類）
      setCommissionKindSelectValues({
        // 手数料種類
        commissionKindSelectValues: convertToCommissionKindSelectValuesModel(
          getCommissionKindResponse
        ),
      });
    };

    // 初期表示処理(新規登録)
    const initializeNew = async () => {
      // 計算書種別・手数料種類を活性化するフラグ
      setActiveFlag(true);

      // API-COM-9999-0019: 手数料種類導出API
      const getCommissionKindRequest: ScrCom9999GetCommissionKindRequest = {
        statementKind: '',
      };
      const getCommissionKindResponse = await ScrCom9999GetCommissionKind(
        getCommissionKindRequest
      );

      // API-TRA-9999-0001: コードマスタ（取引会計）情報取得API
      const getTraCodeValueRequest: ScrTra9999GetCodeValueRequest = {
        codes: [
          {
            codeId: CDE_TRA_0001,
          },
        ],
      };
      const getTraCodeValueResponse = await ScrTra9999GetCodeValue(
        getTraCodeValueRequest
      );

      // API-COM-9999-0012: 計算書種別情報取得API
      const getStatementKindResponse = await ScrCom9999GetStatementKind();

      // API-COM-9999-0031: コード値取得API（コード管理マスタ以外）
      const getComCodeValueRequest: ScrCom9999GetCodeValueRequest = {
        entityList: [
          {
            // 条件種類マスタ
            entityName: 'condition_kind_master',
          },
        ],
      };
      const getComCodeValueResponse = await ScrCom9999GetCodeValue(
        getComCodeValueRequest
      );

      // API-COM-9999-0013: 手数料条件情報取得API
      const getCommissionConditionResponse =
        await ScrCom9999GetCommissionCondition();

      // 条件設定セクションの条件をセレクトモデルに変換する
      const operators = convertToCommissionConditionSelectValueModel(
        getCommissionConditionResponse.commissionConditionList
      );
      // 条件を設定
      setOperators(operators);

      // 条件種類と条件を設定し値を[]で設定
      const conditionTypes = changeCommissionsNothingValueModel(
        // 条件種類
        getComCodeValueResponse.resultList
      );

      // 条件種類を設定
      setConditionKinds(conditionTypes);

      // 画面にデータを設定(空)
      reset(initialValues);

      // プルダウンにデータを設定(手数料種類以外)
      setSelectValues({
        // 商品コード
        goodsClaimCodeSelectValues: convertToTraCodeValueSelectValueModel(
          getTraCodeValueResponse.codes[0].codeList
        ),
        // 計算書種別
        statementKindSelectValues: convertToStatementKindSelectValueModel(
          getStatementKindResponse.statementKindList
        ),
        // 変更予約情報
        changeReservationInfoSelectValues: [],
      });

      // プルダウンにデータを設定（手数料種類）
      setCommissionKindSelectValues({
        // 手数料種類
        commissionKindSelectValues: convertToCommissionKindSelectValuesModel(
          getCommissionKindResponse
        ),
      });
    };

    if (commissionId === 'new') {
      // 新規追加の初期化処理
      initializeNew();
    } else if (commissionId !== undefined) {
      // 現在情報表示の初期化処理
      initializeCurrent(commissionId);
    }

    if (
      changeHistoryNumber !== undefined &&
      changeHistoryNumber !== null &&
      commissionId !== undefined &&
      commissionId !== null
    ) {
      initializeHistory(commissionId);
    }
  }, []);

  // 計算書種別のリストボックス変更時の処理
  useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      // textの変更も監視対象のため、setValueでtextを変更した場合を無視しないと無弁ループする
      if (name !== 'statementKind') return;
      const omatomePlaceValue = String(value.statementKind);
      if (omatomePlaceValue === undefined) return;

      // API-COM-9999-0019: 手数料種類導出API
      const getCommissionKindRequest: ScrCom9999GetCommissionKindRequest = {
        statementKind: getValues('statementKind'),
      };
      const getCommissionKindResponse = await ScrCom9999GetCommissionKind(
        getCommissionKindRequest
      );

      // プルダウンにデータを設定（手数料種類）
      setCommissionKindSelectValues({
        // 手数料種類
        commissionKindSelectValues: convertToCommissionKindSelectValuesModel(
          getCommissionKindResponse
        ),
      });
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  // 条件設定テーブルのデータ
  const [conditions, setConditions] = useState<ConditionModel[]>([
    {
      conditionKind: '',
      subConditions: [
        {
          operator: '',
          value: '',
        },
      ],
    },
  ]);

  // 価格設定テーブルのデータ
  const [pricingRows, setPricingRows] = useState<PricingTableModel[]>([]);

  // 価格テーブル表示・非表示を管理するフラグ
  const [pricingTableVisible, setPricingTableVisible] =
    useState<boolean>(false);

  // API-COM-0014-0003: 手数料テーブル詳細入力チェックAPI用 リクエストデータ作成
  const commissionCheckRequest = (
    commissionTableDetail: CommissionTableDetailModel
  ): ScrCom0014CommissionCheckRequest => {
    return {
      /** 手数料ID */
      commissionId: commissionTableDetail.commissionId,
      /** 利用開始日 */
      useStartDate: commissionTableDetail.useStartDate,
      /** 条件設定セクション */
      commissionConditionList:
        commissionTableDetail.commissionConditionList.map((x) => {
          return {
            commissionConditionKindNo: x.commissionConditionKindNo,
            conditionKindCode: x.conditionKindCode,
            commissionConditionNo: x.commissionConditionNo,
            commissionConditionKind: x.commissionConditionKind,
            commissionConditionValue: x.commissionConditionValue,
          };
        }),
      /** 価格設定セクション */
      commissionPriceList: commissionTableDetail.commissionPriceList.map(
        (x) => {
          return {
            commissionConditionKindNo1: x.commissionConditionKindNo1,
            commissionConditionNo1: x.commissionConditionNo1,
            commissionConditionValueNo1: x.commissionConditionValueNo1,
            commissionConditionKindNo2: x.commissionConditionKindNo2,
            commissionConditionNo2: x.commissionConditionNo2,
            commissionConditionValueNo2: x.commissionConditionValueNo2,
            commissionConditionKindNo3: x.commissionConditionKindNo3,
            commissionConditionNo3: x.commissionConditionNo3,
            commissionConditionValueNo3: x.commissionConditionValueNo3,
            commissionConditionKindNo4: x.commissionConditionKindNo4,
            commissionConditionNo4: x.commissionConditionNo4,
            commissionConditionValueNo4: x.commissionConditionValueNo4,
            commissionConditionKindNo5: x.commissionConditionKindNo5,
            commissionConditionNo5: x.commissionConditionNo5,
            commissionConditionValueNo5: x.commissionConditionValueNo5,
            commissionConditionKindNo6: x.commissionConditionKindNo6,
            commissionConditionNo6: x.commissionConditionNo6,
            commissionConditionValueNo6: x.commissionConditionValueNo6,
            commissionConditionKindNo7: x.commissionConditionKindNo7,
            commissionConditionNo7: x.commissionConditionNo7,
            commissionConditionValueNo7: x.commissionConditionValueNo7,
            commissionConditionKindNo8: x.commissionConditionKindNo8,
            commissionConditionNo8: x.commissionConditionNo8,
            commissionConditionValueNo8: x.commissionConditionValueNo8,
            commissionConditionKindNo9: x.commissionConditionKindNo9,
            commissionConditionNo9: x.commissionConditionNo9,
            commissionConditionValueNo9: x.commissionConditionValueNo9,
            commissionConditionKindNo10: x.commissionConditionKindNo10,
            commissionConditionNo10: x.commissionConditionNo10,
            commissionConditionValueNo10: x.commissionConditionValueNo10,
            commissionPrice: x.commissionPrice,
          };
        }
      ),
      businessDate: user.taskDate,
    };
  };

  // API-COM-0014-0007: 手数料テーブル登録申請API 用リクエストデータ作成
  const convertToCommissionRegistrationAppModel = (
    // 手数料テーブル 基本情報 入力情報
    getValues: CommissionTableDetailModel,
    // 手数料テーブル詳細 条件設定セクションの値
    conditions: ConditionModel[],
    // 手数料テーブル詳細 価格設定セクションの値
    pricingRows: PricingTableModel[],
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
  ): ScrCom0014ApplyRegistrationCommissionInfoRequest => {
    const tempList: commissionConditionList[] = [];
    conditions.forEach((condition, i) => {
      condition.subConditions.forEach((y, j) => {
        const temp = {
          /** 手数料条件種類No */
          commissionConditionKindNo: i,
          /** 条件種類コード */
          conditionKindCode: condition.conditionKind,
          /** 手数料条件種類名 */
          conditionKindName: '',
          /** 手数料条件No */
          commissionConditionNo: j,
          /** 手数料条件区分 */
          commissionConditionKind: condition.subConditions[j].operator,
          /** 手数料条件区分名 */
          commissionConditionKindName: '',
          /** 手数料条件値 */
          commissionConditionValue: condition.subConditions[j].value,
        };
        tempList.push(temp);
      });
    });

    return {
      /** 変更履歴番号 */
      changeHistoryNumber: getValues.changeHistoryNumber,
      /** 手数料ID */
      commissionId: getValues.commissionId,
      /** 手数料名 */
      commissionName: getValues.commissionName,
      /** 手数料種類区分 */
      commissionKind: getValues.commissionKind,
      /** 手数料種類区分名 */
      commissionKindName: getValues.commissionKindName,
      /** 稟議書ID */
      approvalDocumentId: getValues.approvalDocumentId,
      /** 商品クレームコード */
      goodsClaimCode: getValues.goodsClaimCode,
      /** 利用フラグ */
      useFlag: getValues.useFlag === 'yes' ? true : false,
      /** 計算書種別 */
      statementKind: getValues.statementKind,
      /** 利用開始日 */
      useStartDate: getValues.useStartDate,
      /** 条件設定セクション */
      commissionConditionList: tempList,
      /** 価格設定セクション */
      commissionPriceList: pricingRows.map((pricingRow, j) => {
        return {
          // 条件種類
          commissionConditionKindNo1: pricingRow['type1'],
          // 条件
          commissionConditionNo1: pricingRow['operator1'],
          // 値
          commissionConditionValueNo1: pricingRow['value1'],
          commissionConditionKindNo2: pricingRow['type2'],
          commissionConditionNo2: pricingRow['operator2'],
          commissionConditionValueNo2: pricingRow['value2'],
          commissionConditionKindNo3: pricingRow['type3'],
          commissionConditionNo3: pricingRow['operator3'],
          commissionConditionValueNo3: pricingRow['value3'],
          commissionConditionKindNo4: pricingRow['type4'],
          commissionConditionNo4: pricingRow['operator4'],
          commissionConditionValueNo4: pricingRow['value4'],
          commissionConditionKindNo5: pricingRow['type5'],
          commissionConditionNo5: pricingRow['operator5'],
          commissionConditionValueNo5: pricingRow['value5'],
          commissionConditionKindNo6: pricingRow['type6'],
          commissionConditionNo6: pricingRow['operator6'],
          commissionConditionValueNo6: pricingRow['value6'],
          commissionConditionKindNo7: pricingRow['type7'],
          commissionConditionNo7: pricingRow['operator7'],
          commissionConditionValueNo7: pricingRow['value7'],
          commissionConditionKindNo8: pricingRow['type8'],
          commissionConditionNo8: pricingRow['operator8'],
          commissionConditionValueNo8: pricingRow['value8'],
          commissionConditionKindNo9: pricingRow['type9'],
          commissionConditionNo9: pricingRow['operator9'],
          commissionConditionValueNo9: pricingRow['value9'],
          commissionConditionKindNo10: pricingRow['type10'],
          commissionConditionNo10: pricingRow['operator10'],
          commissionConditionValueNo10: pricingRow['value10'],
          commissionPrice: pricingRow['commission'],
        };
      }),
      /** 申請従業員ID */
      applicationEmployeeId: user.employeeId,
      /** 登録変更メモ */
      registrationChangeMemo: registrationChangeMemo,
      /** 第一承認者ID */
      firstApproverId: employeeId1,
      /** 第一承認者メールアドレス */
      firstApproverMailAddress: employeeMailAddress1,
      /** 第ニ承認者ID */
      secondApproverId: employeeId2,
      /** 第三承認者ID */
      thirdApproverId: employeeId3,
      /** 第四承認者ID */
      fourthApproverId: employeeId4,
      /** 申請コメント */
      applicationComment: applicationComment,
      /** 変更予定日 */
      changeExpectDate: user.taskDate,
      /** 画面ID */
      screenId: SCR_COM_0014,
    };
  };

  /**
   * 変更履歴情報からデータモデルへの変換
   */
  const convertToHistoryInfo = (
    getHistoryInfoResponse: CommissionTableDetailModel,
    changeHistoryNumber: string
  ): CommissionTableDetailModel => {
    return {
      commissionId: getHistoryInfoResponse.commissionId,
      commissionKind: getHistoryInfoResponse.commissionKind,
      commissionKindName: getHistoryInfoResponse.commissionKindName,
      commissionName: getHistoryInfoResponse.commissionName,
      approvalDocumentId: getHistoryInfoResponse.approvalDocumentId,
      goodsClaimCode: getHistoryInfoResponse.goodsClaimCode,
      useFlag: getHistoryInfoResponse.useFlag,
      statementKind: getHistoryInfoResponse.statementKind,
      useStartDate: getHistoryInfoResponse.useStartDate,
      commissionConditionList:
        getHistoryInfoResponse.commissionConditionList.map((x) => {
          return {
            commissionConditionKindNo: x.commissionConditionKindNo,
            conditionKindCode: x.conditionKindCode,
            conditionKindName: x.conditionKindName,
            commissionConditionNo: x.commissionConditionNo,
            commissionConditionKind: x.commissionConditionKind,
            commissionConditionKindName: x.commissionConditionKindName,
            commissionConditionValue: x.commissionConditionValue,
          };
        }),
      commissionPriceList: getHistoryInfoResponse.commissionPriceList.map(
        (x) => {
          return {
            commissionConditionKindNo1: x.commissionConditionKindNo1,
            commissionConditionNo1: x.commissionConditionNo1,
            commissionConditionValueNo1: x.commissionConditionValueNo1,
            commissionConditionKindNo2: x.commissionConditionKindNo2,
            commissionConditionNo2: x.commissionConditionNo2,
            commissionConditionValueNo2: x.commissionConditionValueNo2,
            commissionConditionKindNo3: x.commissionConditionKindNo3,
            commissionConditionNo3: x.commissionConditionNo3,
            commissionConditionValueNo3: x.commissionConditionValueNo3,
            commissionConditionKindNo4: x.commissionConditionKindNo4,
            commissionConditionNo4: x.commissionConditionNo4,
            commissionConditionValueNo4: x.commissionConditionValueNo4,
            commissionConditionKindNo5: x.commissionConditionKindNo5,
            commissionConditionNo5: x.commissionConditionNo5,
            commissionConditionValueNo5: x.commissionConditionValueNo5,
            commissionConditionKindNo6: x.commissionConditionKindNo6,
            commissionConditionNo6: x.commissionConditionNo6,
            commissionConditionValueNo6: x.commissionConditionValueNo6,
            commissionConditionKindNo7: x.commissionConditionKindNo7,
            commissionConditionNo7: x.commissionConditionNo7,
            commissionConditionValueNo7: x.commissionConditionValueNo7,
            commissionConditionKindNo8: x.commissionConditionKindNo8,
            commissionConditionNo8: x.commissionConditionNo8,
            commissionConditionValueNo8: x.commissionConditionValueNo8,
            commissionConditionKindNo9: x.commissionConditionKindNo9,
            commissionConditionNo9: x.commissionConditionNo9,
            commissionConditionValueNo9: x.commissionConditionValueNo9,
            commissionConditionKindNo10: x.commissionConditionKindNo10,
            commissionConditionNo10: x.commissionConditionNo10,
            commissionConditionValueNo10: x.commissionConditionValueNo10,
            commissionPrice: x.commissionPrice,
          };
        }
      ),
      changeHistoryNumber: changeHistoryNumber,
      changeExpectedDate: '',
    };
  };

  /**
   * API-COM-0014-0001: 手数料表示API レスポンスから 手数料情報詳細 データモデルへの変換
   */
  const convertToCommissionTableDetailModel = (
    getCommissionDisplayResponse: ScrCom0014GetCommissionDisplayResponse,
    commissionId: string
  ): CommissionTableDetailModel => {
    return {
      commissionId: commissionId,
      // リストボックスへの値設定
      commissionKind: commissionId,
      commissionKindName: getCommissionDisplayResponse.commissionKindName,
      commissionName: getCommissionDisplayResponse.commissionName,
      approvalDocumentId: getCommissionDisplayResponse.approvalDocumentId,
      // リストボックスへの値設定
      goodsClaimCode: commissionId,
      // ラジオボタンへの値設定
      useFlag: getCommissionDisplayResponse.useFlag === true ? 'yes' : 'no',
      // リストボックスへの値設定
      statementKind: commissionId,
      useStartDate: getCommissionDisplayResponse.useStartDate,
      commissionConditionList:
        getCommissionDisplayResponse.commissionConditionList.map((x) => {
          return {
            commissionConditionKindNo: x.commissionConditionKindNo,
            conditionKindCode: x.conditionKindCode,
            conditionKindName: x.conditionKindName,
            commissionConditionNo: x.commissionConditionNo,
            commissionConditionKind: x.commissionConditionKind,
            commissionConditionKindName: x.commissionConditionKindName,
            commissionConditionValue: x.commissionConditionValue,
          };
        }),
      commissionPriceList: getCommissionDisplayResponse.commissionPriceList.map(
        (x) => {
          return {
            commissionConditionKindNo1: x.commissionConditionKindNo1,
            commissionConditionNo1: x.commissionConditionNo1,
            commissionConditionValueNo1: x.commissionConditionValueNo1,
            commissionConditionKindNo2: x.commissionConditionKindNo2,
            commissionConditionNo2: x.commissionConditionNo2,
            commissionConditionValueNo2: x.commissionConditionValueNo2,
            commissionConditionKindNo3: x.commissionConditionKindNo3,
            commissionConditionNo3: x.commissionConditionNo3,
            commissionConditionValueNo3: x.commissionConditionValueNo3,
            commissionConditionKindNo4: x.commissionConditionKindNo4,
            commissionConditionNo4: x.commissionConditionNo4,
            commissionConditionValueNo4: x.commissionConditionValueNo4,
            commissionConditionKindNo5: x.commissionConditionKindNo5,
            commissionConditionNo5: x.commissionConditionNo5,
            commissionConditionValueNo5: x.commissionConditionValueNo5,
            commissionConditionKindNo6: x.commissionConditionKindNo6,
            commissionConditionNo6: x.commissionConditionNo6,
            commissionConditionValueNo6: x.commissionConditionValueNo6,
            commissionConditionKindNo7: x.commissionConditionKindNo7,
            commissionConditionNo7: x.commissionConditionNo7,
            commissionConditionValueNo7: x.commissionConditionValueNo7,
            commissionConditionKindNo8: x.commissionConditionKindNo8,
            commissionConditionNo8: x.commissionConditionNo8,
            commissionConditionValueNo8: x.commissionConditionValueNo8,
            commissionConditionKindNo9: x.commissionConditionKindNo9,
            commissionConditionNo9: x.commissionConditionNo9,
            commissionConditionValueNo9: x.commissionConditionValueNo9,
            commissionConditionKindNo10: x.commissionConditionKindNo10,
            commissionConditionNo10: x.commissionConditionNo10,
            commissionConditionValueNo10: x.commissionConditionValueNo10,
            commissionPrice: x.commissionPrice,
          };
        }
      ),
      // APIのレスポンスには存在しないので空文字で設定
      changeHistoryNumber: '',
      changeExpectedDate: '',
    };
  };

  /**
   * API-TRA-COM-9999-0001: コードマスタ(取引会計)情報取得API レスポンスから SelectValueモデルへの変換
   */
  const convertToTraCodeValueSelectValueModel = (
    codeList: codeList[]
  ): SelectValue[] => {
    return codeList.map((x) => {
      return {
        value: x.code,
        displayValue: x.codeName,
      };
    });
  };

  /**
   *  API-COM-9999-0012: 計算書種別情報取得API レスポンスから SelectValueモデルへの変換
   */
  const convertToStatementKindSelectValueModel = (
    statementKindList: statementKindList[]
  ): SelectValue[] => {
    return statementKindList.map((x) => {
      return {
        value: x.codeValue,
        displayValue: x.codeName,
      };
    });
  };

  /**
   * API-COM-9999-0013: 手数料条件情報取得API レスポンスから SelectValueモデルへの変換
   */
  const convertToCommissionConditionSelectValueModel = (
    commissionConditionList: comCommissionConditionList[]
  ): SelectValue[] => {
    return commissionConditionList.map((x) => {
      return {
        value: x.codeValue,
        displayValue: x.codeName,
      };
    });
  };

  /**
   * API-COM-9999-0019: 手数料種類導出API レスポンスから SelectValueモデルへの変換
   */
  const convertToCommissionKindSelectValuesModel = (
    response: ScrCom9999GetCommissionKindResponse
  ): SelectValue[] => {
    return response.commissionList.map((x) => {
      return {
        value: x.commissionKind,
        displayValue: x.commissionKindName,
      };
    });
  };

  /**
   * API-COM-9999-0020: 値属性変換API レスポンスから SelectValueモデルへの変換
   */
  const convertToConversionSelectValueModel = (
    commissionConditionValueList: CommissionDiscountConditionValueList[]
  ): SelectValue[] => {
    return commissionConditionValueList.map((x) => {
      return {
        value: String(x.commissionConditionID),
        displayValue: x.commissionConditionValue,
      };
    });
  };

  /**
   *  API-COM-9999-0026: 変更予定日取得API レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeExpectDateSelectValueModel = (
    changeExpectDateInfo: ChangeExpectDateInfo[]
  ): SelectValue[] => {
    return changeExpectDateInfo.map((x) => {
      return {
        value: String(x.changeHistoryNumber),
        displayValue: x.changeExpectDate,
      };
    });
  };

  /**
   * 初期表示条件設定セクション変換用
   */
  const convertToCommissionConditionRowModel = (
    request: ScrCom0014GetCommissionDisplayResponse
  ): ConditionModel[] => {
    const temp: ConditionModel[] = [];
    request.commissionConditionList.forEach((obj) => {
      const hasConditionKindCode = temp.find(
        (x) => x.conditionKind === obj.conditionKindCode
      );
      if (hasConditionKindCode) {
        hasConditionKindCode.subConditions.push({
          // 条件
          operator: obj.commissionConditionKindName,
          // 値
          value: obj.commissionConditionValue,
        });
      } else {
        const conditionModel = {
          // 条件種類
          conditionKind: obj.conditionKindCode,
          // 条件・値(複数)
          subConditions: [
            {
              // 条件
              operator: obj.commissionConditionKindName,
              // 値
              value: obj.commissionConditionValue,
            },
          ],
        };
        temp.push(conditionModel);
      }
    });

    return temp;
  };

  /**
   * 条件セクション データ変換処理(手数料条件値以外)
   */
  const changeCommissionsNothingValueModel = (
    // 条件種類
    conditionKind: ResultList[]
  ): ConditionKind[] => {
    return conditionKind[0].codeValueList.map((x) => {
      return {
        value: x.codeValue,
        displayValue: x.codeValueName,
        // 空[]で設定
        selectValues: undefined,
      };
    });
  };

  /**
   * 反映ボタンクリック時のイベントハンドラ
   */
  const onClickReflect = () => {
    // 編集中のフラグを編集完了に設定
    setEditFlg(false);

    // 価格設定テーブル表示
    setPricingTableVisible(true);

    // 価格設定に渡す為、条件設定セクションの形式を変換する
    const formatConditionModel = convertFromConditionToPricingTableRows(
      // 手数料テーブル詳細 入力情報
      conditions,
      // 手数料種類
      conditionKinds,
      // 条件設定セクション 条件
      operators
    );

    // 価格設定セクションに条件設定セクションの設定値を反映する
    setPricingRows(formatConditionModel);
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
  const handleConfirm = async () => {
    // API-COM-0014-0003: 手数料テーブル詳細入力チェックAPI
    const checkResult = await ScrCom0014CommissionCheck(
      commissionCheckRequest(getValues())
    );

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: checkResult.errorList,
      warningList: checkResult.warningList,
      registrationChangeList: checkResult.registrationChangeList,
      changeExpectDate: user.taskDate,
    });
  };

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    if (!commissionId) return;

    // API-COM-9999-0025: 変更履歴情報取得API
    const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
      changeHistoryNumber: getValues('changeHistoryNumber'),
    };

    const getHistoryInfoResponse = (
      await comApiClient.post(
        '/api/com/scr-com-9999/get-history-info',
        getHistoryInfoRequest
      )
    ).data;

    const historyInfo = convertToHistoryInfo(
      getHistoryInfoResponse,
      getValues('changeHistoryNumber')
    );

    setIsChangeHistoryBtn(true);

    // 画面にデータを設定
    reset(historyInfo);
  };

  /**
   * 一括登録アイコンクリック時のイベントハンドラ
   */
  const handleIconBulkAddClick = async () => {
    // 反映ボタンが押下されているか(編集中かどうか)を確認=>編集中ならエラーメッセージを表示する
    if (editFlg) {
      // 画面上にエラーメッセージを表示する
      setErrorMessageFlag(true);
      setErrorMessage(Format(getMessage('MSG-FR-INF-00009'), ['']));
      return;
    } else {
      // CSV読込ポップアップを表示
      setIsOpenCsvPopup(true);
    }

    // API-COM-0034-0004: 一括登録参照API
    const getCommissionKindRequest: ScrCom0034GetAllRegistrationWorkRequest = {
      screenId: SCR_COM_0014,
      allRegistrationId: String(allRegistrationId),
      changeHistoryNumber: Number(getValues('changeHistoryNumber')),
    };
    const getAllRegistrationWorkResponse =
      await ScrCom0034GetAllRegistrationWork(getCommissionKindRequest);

    // 価格設定セクションの手数料欄に一括登録参照した値を設定する
    pricingRows.forEach((pricingRow, i) => {
      // 条件行10 + 条件内条件行10 + 手数料1 = 21
      pricingRow['commission'] = String(
        getAllRegistrationWorkResponse.allRegistrationWorkTrans[i]
          .allImportColumnValue21
      );
    });

    // API-COM-0034-0002：一括登録ワークトランクリアAPI
    const deleteAllRegistrationWorkRequest: ScrCom0034DeleteAllRegistrationWorkRequest =
      {
        allRegistrationId: String(allRegistrationId),
      };
    const deleteAllRegistrationWorkResponse =
      await ScrCom0034DeleteAllRegistrationWork(
        deleteAllRegistrationWorkRequest
      );
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleExportCsvClick = () => {
    exportCsv(user.employeeId + '_' + user.taskDate, pricingRows, []);
  };

  // 価格セクションに設定する一括登録・CSVアイコン
  const decoration = (
    <MarginBox mr={5} gap={2}>
      <Icon
        iconName='一括登録'
        iconType='import'
        onClick={handleIconBulkAddClick}
      />
      <Icon
        iconName='CSV出力'
        iconType='export'
        onClick={handleExportCsvClick}
      />
    </MarginBox>
  );

  /**
   * 画面側キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/commissions/' + commissionId);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handleRegistConfirm = (registrationChangeMemo: string) => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容確認ポップアップの登録承認ボタンクリック時のイベントハンドラ
   */
  const handleApprovalConfirm = (registrationChangeMemo: string) => {
    setIsOpenPopup(false);
    // 登録申請に使用する変更メモの設定
    setRegistrationChangeMemo(registrationChangeMemo);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenApplicationPopup(true);
    setScrCom0033PopupData({
      // 画面ID
      screenId: SCR_COM_0014,
      // タブID
      tabId: 0,
      // 申請金額
      applicationMoney: 0,
    });
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容申請ポップアップの確定ボタンクリック→ダイアログOK時のイベントハンドラ
   */
  const handleApplicationPopupConfirm = async (
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
    setIsOpenPopup(false);

    const applyRegistrationCommissionInfoRequest =
      convertToCommissionRegistrationAppModel(
        // 手数料テーブル 基本情報 入力情報
        getValues(),
        // 手数料テーブル詳細 条件設定セクション 入力情報
        conditions,
        // 手数料テーブル詳細 価格設定セクション 入力情報
        pricingRows,
        // 従業員ID1
        employeeId1,
        // 従業員名1
        emploeeName1,
        // 従業員メールアドレス1
        employeeMailAddress1,
        // 従業員ID2
        employeeId2,
        // 従業員名2
        emploeeName2,
        // 従業員ID3
        employeeId3,
        // 従業員名3
        emploeeName3,
        // 従業員ID4
        employeeId4,
        // 従業員名4
        emploeeName4,
        // 申請コメント
        applicationComment
      );
    // API-COM-0014-0007: 手数料テーブル登録申請API
    await ScrCom0014ApplyRegistrationCommissionInfo(
      applyRegistrationCommissionInfoRequest
    );

    setIsChangeHistoryBtn(false);
  };

  /**
   * 登録内容申請ポップアップ キャンセルボタンクリック時のイベントハンドラ
   */
  const handleApplicationPopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 条件種類を変更した際のイベントハンドラ
   */
  const handleOnConditionTypeChange = async (
    type: string | number,
    index: number
  ) => {
    // 条件種類を変更した場合の処理
    // API-COM-9999-0020: 値属性変換API
    const valueAttributeConversionRequest: ScrCom9999ValueAttributeConversionRequest =
      {
        // 条件種類コード
        conditionKindCode: String(type),
      };
    const valueAttributeConversionResponse =
      await ScrCom9999ValueAttributeConversion(valueAttributeConversionRequest);

    conditionKinds.forEach((x) => {
      // 選択されたプルダウンの選択肢のIDと一致するIDのみ処理
      if (x.value === type) {
        // 型区分が1の場合のみリストボックスで項目を表示
        if (valueAttributeConversionResponse.typeKind === '1') {
          x.selectValues = convertToConversionSelectValueModel(
            valueAttributeConversionResponse.commissionDiscountConditionValueList
          );
        }
      }
    });

    // 編集中のフラグを編集中に設定
    setEditFlg(false);

    setConditions([...conditions]);
  };

  /**
   * 条件・値を変更した際のイベントハンドラ
   */
  const handleOnSubConditionChange = (
    value: string | number,
    index: number,
    subIndex: number,
    field: string
  ) => {
    if (field === 'operator') {
      conditions[index].subConditions[subIndex].operator = value;
    }
    if (field === 'value') {
      conditions[index].subConditions[subIndex].value = value;
    }

    // 編集中のフラグを編集中に設定
    setEditFlg(false);

    setConditions([...conditions]);
  };

  /**
   * 条件行を上下移動した際のイベントハンドラ
   */
  const handleOnDrderChangeClick = (index: number, direction: string) => {
    if (direction === 'up') {
      [conditions[index - 1], conditions[index]] = [
        conditions[index],
        conditions[index - 1],
      ];
    }
    if (direction === 'down') {
      [conditions[index + 1], conditions[index]] = [
        conditions[index],
        conditions[index + 1],
      ];
    }
    // 編集中のフラグを編集中に設定
    setEditFlg(false);

    setConditions([...conditions]);
  };

  /**
   * 条件行を増減した際のイベントハンドラ
   */
  const handleOnConditionCountChangeClick = (
    operation: string,
    index?: number
  ) => {
    if (operation === 'add') {
      conditions.push({
        conditionKind: '',
        subConditions: [
          {
            operator: '',
            value: '',
          },
        ],
      });
    }
    if (operation === 'remove' && index !== undefined) {
      conditions.splice(index, 1);
    }

    // 編集中のフラグを編集中に設定
    setEditFlg(false);

    setConditions([...conditions]);
  };

  /**
   * 条件内(条件・値)行を増減した際のイベントハンドラ
   */
  const handleOnSubConditionCoountChangeClick = (
    index: number,
    operation: string,
    subIndex?: number
  ) => {
    if (operation === 'add') {
      conditions[index].subConditions.push({
        operator: '',
        value: '',
      });
    }
    if (operation === 'remove' && subIndex !== undefined) {
      conditions[index].subConditions.splice(subIndex, 1);
    }

    // 編集中のフラグを編集中に設定
    setEditFlg(false);

    setConditions([...conditions]);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 基本情報セクション */}
            <Section name='基本情報' width={maxSectionWidth}>
              <RowStack>
                {/* 縦 1列目 */}
                <ColStack>
                  <TextField label='手数料ID' name='commissionId' />
                  <Radio
                    label='利用フラグ'
                    name='useFlag'
                    required
                    // 履歴表示or編集権限なしの場合は非活性
                    disabled={
                      changeHistoryNumber !== null || !userEditFlag
                        ? true
                        : false
                    }
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
                </ColStack>
                {/* 縦 2列目 */}
                <ColStack>
                  <TextField
                    label='手数料名'
                    name='commissionName'
                    // 履歴表示or編集権限なしの場合は非活性
                    disabled={
                      changeHistoryNumber !== null || !userEditFlag
                        ? true
                        : false
                    }
                    required
                  />
                  <Select
                    label='計算書種別'
                    name='statementKind'
                    // 新規作成時のみ活性化する
                    disabled={activeFlag ? false : true}
                    selectValues={selectValues.statementKindSelectValues}
                    blankOption
                    required
                  />
                </ColStack>
                {/* 縦 3列目 */}
                <ColStack>
                  <Select
                    label='手数料種類'
                    name='commissionKind'
                    // 新規作成時のみ活性化する
                    disabled={activeFlag ? false : true}
                    selectValues={
                      commissionKindSelectValues.commissionKindSelectValues
                    }
                    blankOption
                    required
                  />
                  <DatePicker
                    label='利用開始日'
                    name='useStartDate'
                    // 履歴表示or編集権限なしの場合は非活性
                    disabled={
                      changeHistoryNumber !== null || !userEditFlag
                        ? true
                        : false
                    }
                    required
                  />
                </ColStack>
                {/* 縦 4列目 */}
                <ColStack>
                  <TextField
                    label='稟議書ID'
                    name='approvalDocumentId'
                    // 履歴表示or編集権限なしの場合は非活性
                    disabled={
                      changeHistoryNumber !== null || !userEditFlag
                        ? true
                        : false
                    }
                  />
                </ColStack>
                {/* 縦 5列目 */}
                <ColStack>
                  <Select
                    label='商品クレームコード'
                    name='goodsClaimCode'
                    selectValues={selectValues.goodsClaimCodeSelectValues}
                    // 履歴表示or編集権限なしの場合は非活性
                    disabled={
                      changeHistoryNumber !== null || !userEditFlag
                        ? true
                        : false
                    }
                    blankOption
                    required
                  />
                </ColStack>
              </RowStack>
            </Section>

            {/* 条件設定セクション */}
            <Section name='条件設定' width={maxSectionWidth}>
              <ThemeProvider theme={theme}>
                <ConditionalTable
                  columns={columns}
                  // 条件種類 & 値 選択肢
                  conditionKinds={conditionKinds}
                  // 条件 選択肢
                  operators={operators}
                  // 条件種類,条件,値の初期値
                  rows={conditions}
                  onConditionKindChange={handleOnConditionTypeChange}
                  onSubConditionChange={handleOnSubConditionChange}
                  onOrderChangeClick={handleOnDrderChangeClick}
                  onConditionCountChangeClick={
                    handleOnConditionCountChangeClick
                  }
                  onSubConditionCoountChangeClick={
                    handleOnSubConditionCoountChangeClick
                  }
                />
              </ThemeProvider>
              <CenterBox>
                <PrimaryButton onClick={onClickReflect}>反映</PrimaryButton>
              </CenterBox>
            </Section>

            {/* 価格設定セクション */}
            {pricingTableVisible && (
              <Section
                name='価格設定'
                decoration={decoration}
                width={maxSectionWidth}
              >
                {/* 反映ボタン押下時のエラーメッセージ */}
                {errorMessageFlag && (
                  <Typography variant='h6'>{errorMessage}</Typography>
                )}
                <PricingTable
                  conditions={conditions}
                  dataset={pricingRows}
                  conditionkinds={conditionKinds}
                  operators={operators}
                />
              </Section>
            )}
          </FormProvider>
        </MainLayout>

        {/* right */}
        <MainLayout right>
          <FormProvider {...methods}>
            <RightElementStack>
              <Stack>
                <Typography bold>変更予約情報</Typography>
                {/* 新規登録時は非表示 */}
                {!activeFlag && <WarningLabel text='変更予約あり' />}
                <Select
                  name='changeHistoryNumber'
                  selectValues={selectValues.changeReservationInfoSelectValues}
                  blankOption
                />
                <PrimaryButton
                  onClick={handleSwichDisplay}
                  // 新規作成時のみ非活性化する
                  disable={activeFlag ? true : false}
                >
                  表示切替
                </PrimaryButton>
              </Stack>
              <MarginBox mb={6}>
                <DatePicker label='変更予定日' name='changeHistoryDate' />
              </MarginBox>
            </RightElementStack>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={onClickConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {isOpenPopup && (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          handleRegistConfirm={handleRegistConfirm}
          // 本機能ではこちらを使用する
          handleApprovalConfirm={handleApprovalConfirm}
          handleCancel={handlePopupCancel}
        />
      )}

      {/* 登録内容申請ポップアップ */}
      {isOpenApplicationPopup && (
        <ScrCom0033Popup
          isOpen={isOpenApplicationPopup}
          data={scrCom0033PopupData}
          handleConfirm={handleApplicationPopupConfirm}
          handleCancel={handleApplicationPopupCancel}
        />
      )}

      {/* CSV読込ポップアップ */}
      {isOpenCsvPopup && (
        <ScrCom0035Popup
          allRegistrationDefinitions={allRegistrationDefinitions}
          screenId={SCR_COM_0014}
          tabId={undefined}
          isOpen={isOpenCsvPopup}
          setIsOpen={setIsOpenPopup}
        />
      )}

      {/* 反映予定日整合性チェック */}
      <ChangeHistoryDateCheckUtil
        changeExpectedDate={getValues('changeExpectedDate')}
        changeHistoryNumber={getValues('changeHistoryNumber')}
        isChangeHistoryBtn={isChangeHistoryBtn}
        changeHistory={selectValues.changeReservationInfoSelectValues}
        isOpen={changeHistoryDateCheckisOpen}
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default ScrCom0014Page;
