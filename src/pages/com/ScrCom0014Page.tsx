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
  ConditionModel,
  ConditionType,
  DeepKey,
} from 'controls/ConditionalTable';
import { DatePicker } from 'controls/DatePicker';
import { Icon } from 'controls/Icon/Icon';
import { WarningLabel } from 'controls/Label';
import { PricingTable, PricingTableModel } from 'controls/PricingTable';
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
  ChangeExpectDateInfo,
  CodeValueList,
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
  ScrCom9999ValueAttributeConversionResponse,
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
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 手数料種類
  commissionKindSelectValues: SelectValue[];
  // 商品コード
  goodsClaimCodeSelectValues: SelectValue[];
  // 計算書種別
  statementKindSelectValues: SelectValue[];
  // 条件種類
  commissionConditionKindSelectValues: SelectValue[];
  // 条件
  commissionConditionSelectValues: SelectValue[];
  // 条件値
  commissionValueSelectValues: SelectValue[];
  // 変更予約情報
  changeReservationInfoSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 手数料種類
  commissionKindSelectValues: [],
  // 商品コード
  goodsClaimCodeSelectValues: [],
  // 計算書種別
  statementKindSelectValues: [],
  // 条件種類
  commissionConditionKindSelectValues: [],
  // 条件
  commissionConditionSelectValues: [],
  // 条件値
  commissionValueSelectValues: [],
  // 変更予約情報
  changeReservationInfoSelectValues: [],
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
  commissionName: yup.string().label('手数料名').max(30),
  commissionKind: yup.array().label('手数料種類'),
  approvalDocumentId: yup.string().label('稟議書ID').max(20).half(),
  goodsClaimCode: yup.array().label('商品クレームコード'),
  statementKind: yup.array().label('計算書種別'),
  useStartDate: yup.string().label('利用開始日').date(),
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
const CDE_COM_0010 = 'CDE-COM-0010';

/**
 * 条件セクション
 */
const columns: TableColDef[] = [
  { field: 'conditionKindCode', headerName: '条件種類', width: 150 },
  { field: 'conditions', headerName: '条件', width: 100 },
  { field: 'conditionVal', headerName: '値', width: 150 },
];

/**
 * 条件セクションプルダウンデータモデル
 */
// interface ConditionProps {
//   displayValue: string;
//   value: string;
//   conditions: ConditionVal[];
//   conditionVal: ConditionVal[] | string;
// }

/**
 * 行データモデル
 */
interface ConditionVal {
  displayValue: string;
  value: string | number;
}

/**
 * SCR-COM-0014 手数料テーブル詳細画面
 */
const ScrCom0014Page = () => {
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
  } = methods;

  // router
  const { commissionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );

  // 項目の活性化・非活性化を判定するフラグ
  const [activeFlag, setActiveFlag] = useState(false);
  // 条件セクションの設定値
  const [getItems, setItems] = useState<ConditionType[]>([]);
  const [conditions, setConditions] = useState<SelectValue[]>([]);
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

  // APIから取得した検索データ
  const setterConditions = (conditionParams: any) => {
    const conditions = conditionParams;
    // 条件を設定
    setConditions(conditions);
  };

  // APIから取得した検索データ
  const setterItems = (getItemParams: any) => {
    const getItem: any = getItemParams;
    // 条件種類を設定
    setItems(getItem);
  };

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

  useEffect(() => {
    setMaxSectionWidth(
      Number(
        apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
      ) + 40
    );
  }, [apiRef, apiRef.current.rootElementRef]);

  useEffect(() => {
    // 初期表示処理(現在情報の表示)
    const initializeCurrent = async (commissionId: string) => {
      // 計算書種別・手数料種類を非活性化するフラグ
      setActiveFlag(false);

      // SCR-COM-0014-0001: 手数料表示API
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

      // API-COM-9999-0013: 手数料条件情報取得API
      const getCommissionConditionRequest: ScrCom9999GetCommissionConditionRequest =
        {
          commissionId: commissionId,
        };
      const getCommissionConditionResponse =
        await ScrCom9999GetCommissionCondition(getCommissionConditionRequest);

      // API-COM-9999-0020: 値属性変換API
      const valueAttributeConversionRequest: ScrCom9999ValueAttributeConversionRequest =
        {
          conditionKindCode: CDE_COM_0010,
        };
      const valueAttributeConversionResponse =
        await ScrCom9999ValueAttributeConversion(
          valueAttributeConversionRequest
        );

      // API-COM-9999-0019: 手数料種類導出API
      const getCommissionKindRequest: ScrCom9999GetCommissionKindRequest = {
        statementKind: getValues('statementKind'),
      };
      const getCommissionKindResponse = await ScrCom9999GetCommissionKind(
        getCommissionKindRequest
      );

      // API-COM-0014-0001: 手数料表示API レスポンスデータを 手数料詳細情報に変換
      const commissionResult = convertToCommissionTableDetailModel(
        getCommissionDisplayResponse,
        commissionId
      );

      // TODO: 条件テーブルに取得データを設定
      setRows(
        convertToCommissionConditionRowModel(
          getCommissionConditionResponse.commissionConditionList
        )
      );
      // 条件テーブルの条件の設定
      setterConditions(
        convertToCommissionConditionSelectValueModel(
          getCommissionConditionResponse.commissionConditionList
        )
      );
      // 条件テーブルの条件種類の設定
      setterItems(
        getItemsModel(
          getComCodeValueResponse.resultList,
          convertToCommissionConditionSelectValueModel(
            getCommissionConditionResponse.commissionConditionList
          ),
          valueAttributeConversionResponse
        )
      );

      // 画面にデータを設定
      reset(commissionResult);

      // プルダウンにデータを設定
      setSelectValues({
        // 手数料種類
        commissionKindSelectValues: convertToCommissionKindSelectValuesModel(
          getCommissionKindResponse
        ),
        // 商品コード
        goodsClaimCodeSelectValues: convertToTraCodeValueSelectValueModel(
          getTraCodeValueResponse.codes[0].codeList
        ),
        // 計算書種別
        statementKindSelectValues: convertToStatementKindSelectValueModel(
          getStatementKindResponse.statementKindList
        ),
        // 条件種類
        commissionConditionKindSelectValues: convertToCodeValueSelectValueModel(
          getComCodeValueResponse.resultList[0].codeValueList
        ),
        // 条件
        commissionConditionSelectValues:
          convertToCommissionConditionSelectValueModel(
            getCommissionConditionResponse.commissionConditionList
          ),
        // 値
        commissionValueSelectValues: convertToConversionSelectValueModel(
          valueAttributeConversionResponse.commissionDiscountConditionValueList
        ),
        // 変更予約情報
        changeReservationInfoSelectValues:
          convertToChangeExpectDateSelectValueModel(
            getChangeDateResponse.changeExpectDateInfo
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

      // SCR-COM-9999-0025: 変更履歴情報取得API
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

      // API-COM-9999-0020: 値属性変換API
      const valueAttributeConversionRequest: ScrCom9999ValueAttributeConversionRequest =
        {
          conditionKindCode: CDE_COM_0010,
        };
      const valueAttributeConversionResponse =
        await ScrCom9999ValueAttributeConversion(
          valueAttributeConversionRequest
        );

      // 条件テーブルに取得データを設定
      setterConditions(
        convertToCommissionConditionSelectValueModel(
          getCommissionConditionResponse.commissionConditionList
        )
      );
      setterItems(
        getItemsModel(
          getComCodeValueResponse.resultList,
          convertToCommissionConditionSelectValueModel(
            getCommissionConditionResponse.commissionConditionList
          ),
          valueAttributeConversionResponse
        )
      );

      // プルダウンにデータを設定
      setSelectValues({
        // 手数料種類
        commissionKindSelectValues: convertToCommissionKindSelectValuesModel(
          getCommissionKindResponse
        ),
        // 商品コード
        goodsClaimCodeSelectValues: convertToTraCodeValueSelectValueModel(
          getTraCodeValueResponse.codes[0].codeList
        ),
        // 計算書種別
        statementKindSelectValues: convertToStatementKindSelectValueModel(
          getStatementKindResponse.statementKindList
        ),
        // 条件種類
        commissionConditionKindSelectValues: convertToCodeValueSelectValueModel(
          getComCodeValueResponse.resultList[0].codeValueList
        ),
        // 条件区分
        commissionConditionSelectValues:
          convertToCommissionConditionSelectValueModel(
            getCommissionConditionResponse.commissionConditionList
          ),
        // 条件値
        commissionValueSelectValues: convertToConversionSelectValueModel(
          valueAttributeConversionResponse.commissionDiscountConditionValueList
        ),
        // 変更予約情報
        changeReservationInfoSelectValues:
          convertToChangeExpectDateSelectValueModel(
            getChangeDateResponse.changeExpectDateInfo
          ),
      });
    };

    // 初期表示処理(新規追加)
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

      const valueAttributeConversionRequest: ScrCom9999ValueAttributeConversionRequest =
        {
          conditionKindCode: CDE_COM_0010,
        };
      const valueAttributeConversionResponse =
        await ScrCom9999ValueAttributeConversion(
          valueAttributeConversionRequest
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

      // 画面にデータを設定(空)
      reset(initialValues);

      // 条件テーブルに取得データを設定
      setterConditions(
        convertToCommissionConditionSelectValueModel(
          getCommissionConditionResponse.commissionConditionList
        )
      );
      setterItems(
        getItemsModel(
          getComCodeValueResponse.resultList,
          convertToCommissionConditionSelectValueModel(
            getCommissionConditionResponse.commissionConditionList
          ),
          valueAttributeConversionResponse
        )
      );

      setSelectValues({
        // 手数料種類
        commissionKindSelectValues: convertToCommissionKindSelectValuesModel(
          getCommissionKindResponse
        ),
        // 商品コード
        goodsClaimCodeSelectValues: convertToTraCodeValueSelectValueModel(
          getTraCodeValueResponse.codes[0].codeList
        ),
        // 計算書種別
        statementKindSelectValues: convertToStatementKindSelectValueModel(
          getStatementKindResponse.statementKindList
        ),
        // 条件種類
        commissionConditionKindSelectValues: convertToCodeValueSelectValueModel(
          getComCodeValueResponse.resultList[0].codeValueList
        ),
        // 条件区分
        commissionConditionSelectValues:
          convertToCommissionConditionSelectValueModel(
            getCommissionConditionResponse.commissionConditionList
          ),
        // 条件値
        commissionValueSelectValues: [],
        // 変更予約情報
        changeReservationInfoSelectValues: [],
      });
    };

    if (commissionId === 'new') {
      // 新規追加の初期化処理
      initializeNew();
    } else if (commissionId !== undefined) {
      // 現在情報表示の初期化処理
      initializeCurrent(commissionId);
    }

    // 履歴表示の初期化処理
    const changeHistoryNumber = searchParams.get('change-history-number');
    if (
      changeHistoryNumber !== undefined &&
      changeHistoryNumber !== null &&
      commissionId !== undefined &&
      commissionId !== null
    ) {
      initializeHistory(commissionId);
    }
  }, []);

  // 条件種類変更後にAPIより条件、値を取得する
  const handleGetConditionData = (select: string) => {
    return getItems.find((val) => val.type === select) ?? null;
  };

  // 条件設定テーブルのデータ
  const [rows, setRows] = useState<ConditionModel[]>([
    {
      // 条件種類コード値
      conditionType: '',
      // 条件と値の配列
      condition: [
        {
          // 条件のコード値
          operator: '',
          // プルダウンのコード値orテキストボックスの値
          value: '',
        },
      ],
    },
  ]);

  // 価格設定テーブルのデータ
  const [pricingRows, setPricingRows] = useState<PricingTableModel[]>([]);

  // 値の変更を検知する
  const handleOnValueChange = (
    val: string | number,
    changeVal: DeepKey<ConditionModel>,
    indexRow: number,
    indexCol?: number
  ) => {
    if (changeVal === 'conditionType') {
      rows[indexRow][changeVal] = val;
    }
    if (changeVal === 'operator' && indexCol !== undefined) {
      rows[indexRow].condition[indexCol][changeVal] = val;
      setRows(rows);
    }
    if (changeVal === 'value' && indexCol !== undefined) {
      rows[indexRow].condition[indexCol][changeVal] = val;
    }
    setRows([...rows]);
  };

  // テーブル行変更処理
  const handleSetItem = (sortValues: ConditionModel[]) => {
    setRows(sortValues);
  };

  // 価格テーブル表示・非表示を管理するフラグ
  const [pricingTableVisible, setPricingTableVisible] =
    useState<boolean>(false);

  // 価格設定テーブル表示
  const handleVisibleTable = () => {
    setPricingTableVisible(!pricingTableVisible);
  };

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
    // 手数料テーブル詳細 入力情報
    commissionTableDetail: CommissionTableDetailModel,
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
    return {
      /** 変更履歴番号 */
      changeHistoryNumber: commissionTableDetail.changeHistoryNumber,
      /** 手数料ID */
      commissionId: commissionTableDetail.commissionId,
      /** 手数料名 */
      commissionName: commissionTableDetail.commissionName,
      /** 手数料種類区分 */
      commissionKind: commissionTableDetail.commissionKind,
      /** 手数料種類区分名 */
      commissionKindName: commissionTableDetail.commissionKindName,
      /** 稟議書ID */
      approvalDocumentId: commissionTableDetail.approvalDocumentId,
      /** 商品クレームコード */
      goodsClaimCode: commissionTableDetail.goodsClaimCode,
      /** 利用フラグ */
      useFlag: commissionTableDetail.useFlag === 'yes' ? true : false,
      /** 計算書種別 */
      statementKind: commissionTableDetail.statementKind,
      /** 利用開始日 */
      useStartDate: commissionTableDetail.useStartDate,
      /** 条件設定セクション */
      commissionConditionList:
        commissionTableDetail.commissionConditionList.map((x) => {
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

  // 反映ボタン押下時に価格設定セクションへと渡す条件設定セクションの形式変換
  const convertFromConditionToPriceModel = (
    // 手数料テーブル詳細 入力情報
    rows: ConditionModel[]
  ): PricingTableModel[] => {
    const tempList: PricingTableModel[] = [];
    // 条件設定セクションの値をループして価格設定セクション用にデータを変換する
    rows.map((x) => {
      tempList.push({
        conditionType: x.conditionType,
        conditionTypeName: 'aaaa',
        condition: x.condition,
      });
    });
    return tempList;
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
   * API-COM-9999-0031: コード値取得API レスポンスから SelectValueモデルへの変換
   */
  const convertToCodeValueSelectValueModel = (
    codeValueList: CodeValueList[]
  ): SelectValue[] => {
    return codeValueList.map((x) => {
      return {
        value: String(x.codeValue),
        displayValue: x.codeValueName,
      };
    });
  };

  /**
   * TODO: 初期表示条件設定セクション変換用
   */
  const convertToCommissionConditionRowModel = (
    commissionConditionList: comCommissionConditionList[]
  ): ConditionModel[] => {
    const tempConditions = conditions.map((x) => {
      return {
        operator: x.value,
        value: x.displayValue,
      };
    });

    return commissionConditionList.map((x) => {
      return {
        // 手数料種類
        conditionType: x.codeName,
        condition: tempConditions,
      };
    });
  };

  /**
   * 条件セクション内 手数料条件値 データ変換処理(テキストボックス/リストボックス)
   */
  const getItemsModel = (
    // 条件種類
    conditionKind: ResultList[],
    // 条件
    conditions: ConditionVal[],
    // 値
    value: ScrCom9999ValueAttributeConversionResponse
  ): ConditionType[] => {
    return conditionKind[0].codeValueList.map((x) => {
      return {
        type: x.codeValue,
        typeName: x.codeValueName,
        // operators: conditions,
        selectValues:
          value.typeKind === '2' || value.typeKind === '3'
            ? ''
            : value === undefined
            ? ''
            : value.commissionDiscountConditionValueList.map((y) => {
                return {
                  value: y.commissionConditionID,
                  displayValue: y.commissionConditionValue,
                };
              }),
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
    const formatConditionModel = convertFromConditionToPriceModel(
      // 手数料テーブル詳細 入力情報
      rows
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
    // SCR-COM-0014-0003: 手数料テーブル詳細入力チェックAPI
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

    // SCR-COM-9999-0025: 変更履歴情報取得API
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
  const handleIconBulkAddClick = () => {
    // 反映ボタンが押下されているか(編集中かどうか)を確認=>編集中ならエラーメッセージを表示する
    if (editFlg) {
      // 画面上にエラーメッセージを表示する
      setErrorMessageFlag(true);
      setErrorMessage(Format(getMessage('MSG-FR-INF-00009'), ['']));
      return;
    }

    // CSV読込ポップアップを表示
    setIsOpenCsvPopup(true);

    // TODO: 一括登録の処理を詳細設計の「一括登録からの再表示」を元に記載
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleExportCsvClick = () => {
    // TODO: DataGridを使用していない為apiRefがエラーになる(確認中)
    // exportCsv(user.employeeId + '_' + user.taskDate, apiRef);
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
    // API-COM-0014-0007: 手数料テーブル登録申請API
    const applyRegistrationCommissionInfoRequest =
      convertToCommissionRegistrationAppModel(
        // 手数料テーブル詳細 入力情報
        getValues(),
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
                      searchParams.get('change-history-number') !== null ||
                      !userEditFlag
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
                      searchParams.get('change-history-number') !== null ||
                      !userEditFlag
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
                    selectValues={selectValues.commissionKindSelectValues}
                    blankOption
                    required
                  />
                  <DatePicker
                    label='利用開始日'
                    name='useStartDate'
                    // 履歴表示or編集権限なしの場合は非活性
                    disabled={
                      searchParams.get('change-history-number') !== null ||
                      !userEditFlag
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
                      searchParams.get('change-history-number') !== null ||
                      !userEditFlag
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
                      searchParams.get('change-history-number') !== null ||
                      !userEditFlag
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
                  conditionTypes={getItems}
                  operators={conditions}
                  onValueChange={handleOnValueChange}
                  rows={rows}
                  handleSetItem={handleSetItem}
                  handleVisibleTable={handleVisibleTable}
                  handleGetConditionData={handleGetConditionData}
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
                <PricingTable dataset={pricingRows} operators={conditions} />
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
