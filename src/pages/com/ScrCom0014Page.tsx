import React, { useState, useEffect, useContext } from 'react';
import { AddButton, CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { TextField } from 'controls/TextField';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';
import { useNavigate } from 'hooks/useNavigate';
import { useParams, useSearchParams } from 'react-router-dom';
import { AppContext } from 'providers/AppContextProvider';
import { yupResolver } from '@hookform/resolvers/yup';
import { Select, SelectValue } from 'controls/Select';
import { Radio } from 'controls/Radio';
import { DatePicker } from 'controls/DatePicker';
import { useForm } from 'hooks/useForm';
import { ScrCom0014CommissionCheck, ScrCom0014CommissionCheckRequest, ScrCom0014GetCommissionDisplay, ScrCom0014GetCommissionDisplayRequest, commissionPriceList, commissionConditionList, ScrCom0014ApplyRegistrationCommissionInfoRequest, ScrCom0014ApplyRegistrationCommissionInfo } from 'apis/com/ScrCom0014Api';
import ScrCom0032Popup, { ScrCom0032PopupModel } from './popups/ScrCom0032';
import { TableRowModel } from 'controls/Table';
import { ScrCom9999GetChangeDate, ScrCom9999GetChangeDateRequest, ScrCom9999GetCodeManagementMasterListbox, ScrCom9999GetCodeManagementMasterListboxRequest, ScrCom9999GetCodeValue, ScrCom9999GetCodeValueRequest, ScrCom9999GetCommissionCondition, ScrCom9999GetCommissionConditionRequest, ScrCom9999GetHistoryInfo, ScrCom9999GetHistoryInfoRequest, ScrCom9999GetStatementKind, ScrCom9999GetStatementKindRequest, ScrCom9999ValueAttributeConversion, ScrCom9999ValueAttributeConversionRequest, codeValueList, commissionConditionValueList, SearchGetCodeManagementMasterListbox, statementKindList, comCommissionConditionList, changeExpectDateInfo } from 'apis/com/ScrCom9999APi';
import { ScrTra9999GetCodeValue, ScrTra9999GetCodeValueRequest, codeList } from 'apis/tra/ScrTra9999APi';
import { generate } from 'utils/validation/BaseYup';
import { FormProvider } from 'react-hook-form';
import { Typography } from 'controls/Typography';
import { WarningLabel } from 'controls/Label';
import { MarginBox } from 'layouts/Box';


/**
 * 手数料情報詳細情報データモデル
 */
interface CommissionTableDetailModel {
  /** 手数料ID */
  commissionId: string;
  /** 手数料種類区分名 */
  commissionKindName: string;
  /** 手数料名 */
  commissionName: string;
  /** 稟議書ID */
  approvalDocumentId: string;
  /** 商品クレームコード */
  goodsClaimCode: string;
  /** 利用フラグ */
  useFlag: boolean;
  /** 計算書種別 */
  statementKind: string;
  /** 利用開始日 */
  useStartDate: string;
  /** 条件設定セクション リスト */
  commissionConditionList: commissionConditionList[];
  /** 価格設定セクション リスト */
  commissionPriceList: commissionPriceList[];
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更履歴番号+変更予定日
  memberChangeHistories: any[];
  // 変更予定日
  changeExpectedDate: string;
}


// /**
//  * 手数料表示API用手数料情報詳細データモデル
//  */
// interface TableDetailModelForCommissionDisplayCurrentInfo {
//   /** 手数料名 */
//   commissionName: string;
//   /** 稟議書ID */
//   approvalDocumentId: string;
//   /** 利用フラグ */
//   useFlag: boolean;
//   /** 利用開始日 */
//   useStartDate: string;
//   /** 条件設定セクション リスト */
//   commissionConditionList: commissionConditionList[];
//   /** 価格設定セクション リスト */
//   commissionPriceList: commissionPriceList[];
// }


/**
 * 手数料情報詳細初期データ
 */
const initialValues: CommissionTableDetailModel = {
  commissionId: '',
  commissionName: '',
  commissionKindName: '',
  approvalDocumentId: '',
  goodsClaimCode: '',
  useFlag: false,
  statementKind: '',
  useStartDate: '',
  commissionConditionList: [],
  commissionPriceList: [],
  // 変更履歴関連
  changeHistoryNumber: '',
  memberChangeHistories: [],
  changeExpectedDate: '',
}


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


/**
 * バリデーションスキーマ
 */
const validationSchama = generate([
  'commissionId',
  'commissionName',
  'commissionKind',
  'approvalDocumentId',
  'goodsClaimCode',
  'statementKind',
  'useStartDate',
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
 * SCR-COM-0014 手数料テーブル詳細画面
 */
const ScrCom0014Page = () => {
  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<CommissionTableDetailModel>({
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
  const { commissionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 削除済み条件を格納するリスト
  const [deletedList, setDeletedList] = useState([]);
  // 変更履歴管理
  const [changeHistory, setChangeHistory] = useState<any>([]);
  // 項目の活性化・非活性化を判定するフラグ
  const [activeFlag, setActiveFlag] = useState(false);
  // 値属性変換APIレスポンス判定用
  const [boxKind, setBoxKind] = useState('');
  // 新規作成時の手数料種類レスポンスをまとめる
  const [commissionKindList, setCommissionKindList] = useState([]);
  // 条件設定セクション-価格設定セクション 値チェック用のフラグ
  const [sectionCheckFlag, setSectionCheckFlag] = useState(true);

  // user情報
  const { appContext } = useContext(AppContext);

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);


  useEffect(() => {
    // 初期表示処理(現在情報の表示)
    const initializeCurrent = async (commissionId: string) => {

      // 計算書種別・手数料種類を非活性化するフラグ
      setActiveFlag(false);

      // SCR-COM-0014-0001: 手数料表示API
      const getCommissionDisplayRequest: ScrCom0014GetCommissionDisplayRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        commissionId: commissionId,
      };
      const getCommissionDisplayResponse = await ScrCom0014GetCommissionDisplay(getCommissionDisplayRequest);

      // API-COM-9999-0026: 変更予定日取得API
      const getChangeDateRequest: ScrCom9999GetChangeDateRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        screenId: '',
        tabId: 'SCR-COM-0014',
        getKeyValue: '',
      };
      const getChangeDateResponse = await ScrCom9999GetChangeDate(getChangeDateRequest);

      // API-TRA-9999-0001: コードマスタ（取引会計）情報取得API
      const getTraCodeValueRequest: ScrTra9999GetCodeValueRequest = {
        codes: [{
          // TODO: 業務日付取得方法実装後に変更
          validityStartDate: '',
          codeId: 'CDE-TRA-0001',
        }]
      };
      const getTraCodeValueResponse = await ScrTra9999GetCodeValue(getTraCodeValueRequest);

      // API-COM-9999-0012: 計算書種別情報取得API
      const getStatementKindRequest: ScrCom9999GetStatementKindRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        commissionId: commissionId,
      };
      const getStatementKindResponse = await ScrCom9999GetStatementKind(getStatementKindRequest);

      // API-COM-9999-0031: コード値取得API（コード管理マスタ以外）
      const getComCodeValueRequest: ScrCom9999GetCodeValueRequest = {
        entityList: [{
          // TODO: 業務日付取得方法実装後に変更
          businessDate: '',
          // 条件種類マスタ
          entityName: 'condition_kind_master',
        }]
      };
      const getComCodeValueResponse = await ScrCom9999GetCodeValue(getComCodeValueRequest);

      // API-COM-9999-0013: 手数料条件情報取得API
      const getCommissionConditionRequest: ScrCom9999GetCommissionConditionRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        commissionId: commissionId,
      };
      const getCommissionConditionResponse = await ScrCom9999GetCommissionCondition(getCommissionConditionRequest);

      // API-COM-9999-0020: 値属性変換API
      const valueAttributeConversionRequest: ScrCom9999ValueAttributeConversionRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        conditionKindCode: 'CDE-COM-0010',
      };
      const valueAttributeConversionResponse = await ScrCom9999ValueAttributeConversion(valueAttributeConversionRequest);

      // 型区分によって手数料条件値をリストボックスかテキストボックスか判定
      if (valueAttributeConversionResponse.typeKind === '1') {
        setBoxKind('listBox');
      } else if (valueAttributeConversionResponse.typeKind === '2' || valueAttributeConversionResponse.typeKind === '3') {
        setBoxKind('textBox');
      }

      // 計算書種別に応じた手数料種類を取得
      const statementKind = getValues('statementKind');
      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const codeRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        // 計算書種別に応じたコードID
        codeId: statementKind === '二輪' ? 'CDE-COM-0006' // 未定
          : statementKind === '四輪' ? 'CDE-COM-0006' // 未定
            : statementKind === 'おまとめ' ? 'CDE-COM-0006' // 未定
              : '',
      };
      const codeResponse = await ScrCom9999GetCodeManagementMasterListbox(codeRequest);

      // 画面にデータを設定
      setValue('commissionId', commissionId);
      setValue('commissionName', getCommissionDisplayResponse.commissionName);
      setValue('approvalDocumentId', getCommissionDisplayResponse.approvalDocumentId);
      setValue('useFlag', getCommissionDisplayResponse.useFlag);
      setValue('useStartDate', getCommissionDisplayResponse.useStartDate);

      setSelectValues({
        // 手数料種類
        commissionKindSelectValues: convertToCodeSelectValueModel(codeResponse.searchGetCodeManagementMasterListbox),
        // 商品コード
        goodsClaimCodeSelectValues: convertToTraCodeValueSelectValueModel(getTraCodeValueResponse.codes[0].codeList),
        // 計算書種別
        statementKindSelectValues: convertToStatementKindSelectValueModel(getStatementKindResponse.statementKindList),
        // 条件種類
        commissionConditionKindSelectValues: convertToCodeValueSelectValueModel(getComCodeValueResponse.resultList[0].codeValueList),
        // 条件区分
        commissionConditionSelectValues: convertToCommissionConditionSelectValueModel(getCommissionConditionResponse.commissionConditionList),
        // 条件値
        commissionValueSelectValues: convertToConversionSelectValueModel(valueAttributeConversionResponse.commissionConditionValueList),
        // 変更予約情報
        changeReservationInfoSelectValues: convertToChangeExpectDateSelectValueModel(getChangeDateResponse.changeExpectDateInfo)
      });
    }


    // 初期表示処理(履歴表示)
    const initializeHistory = async (changeHistoryNumber: string | null) => {
      // SCR-COM-9999-0025: 変更履歴情報取得API
      const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
        changeHistoryNumber: '',
      };
      const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(getHistoryInfoRequest);
    }


    // 初期表示処理(新規追加)
    const initializeNew = async () => {

      // 計算書種別・手数料種類を活性化するフラグ
      setActiveFlag(true);

      // 手数料条件値のインプットはテキストボックスを指定
      setBoxKind('textBox');

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得APIレスポンスをまとめるリスト
      const tempList = [];
      const tempTotalCommissionKindList: any = [];

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API(四輪)
      const commissionKindFourRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        codeId: 'CDE-COM-0006' //未定
      };
      const commissionKindFourResponse = await ScrCom9999GetCodeManagementMasterListbox(commissionKindFourRequest);
      tempList.push(commissionKindFourResponse.searchGetCodeManagementMasterListbox);

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API(二輪)
      const commissionKindTwoRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        codeId: 'CDE-COM-0006' //未定
      };
      const commissionKindTwoResponse = await ScrCom9999GetCodeManagementMasterListbox(commissionKindTwoRequest);
      tempList.push(commissionKindTwoResponse.searchGetCodeManagementMasterListbox);

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API(おまとめ)
      const commissionKindOmatomeRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        codeId: 'CDE-COM-0006' //未定
      };
      const commissionKindOmatomeResponse = await ScrCom9999GetCodeManagementMasterListbox(commissionKindOmatomeRequest);
      tempList.push(commissionKindOmatomeResponse.searchGetCodeManagementMasterListbox);

      // 手数料種類のレスポンスを一つにしてリストとして格納
      for (var i = 0; i < tempList.length; i++) {
        for (var j = 0; j < tempList[i].length; j++) {
          tempTotalCommissionKindList.push(tempList[i][j]);
        }
        setCommissionKindList(tempTotalCommissionKindList);

        // API-TRA-9999-0001: コードマスタ（取引会計）情報取得API
        const getTraCodeValueRequest: ScrTra9999GetCodeValueRequest = {
          codes: [{
            codeId: 'CDE-TRA-0001',
          }]
        };
        const getTraCodeValueResponse = await ScrTra9999GetCodeValue(getTraCodeValueRequest);

        // API-COM-9999-0012: 計算書種別情報取得API
        const getStatementKindResponse = await ScrCom9999GetStatementKind();

        // API-COM-9999-0031: コード値取得API（コード管理マスタ以外）
        const getComCodeValueRequest: ScrCom9999GetCodeValueRequest = {
          entityList: [{
            // 条件種類マスタ
            entityName: 'condition_kind_master',
          }]
        };
        const getComCodeValueResponse = await ScrCom9999GetCodeValue(getComCodeValueRequest);

        // API-COM-9999-0013: 手数料条件情報取得API
        const getCommissionConditionResponse = await ScrCom9999GetCommissionCondition();

        setSelectValues({
          // 手数料種類
          commissionKindSelectValues: commissionKindList,
          // 商品コード
          goodsClaimCodeSelectValues: convertToTraCodeValueSelectValueModel(getTraCodeValueResponse.codes[0].codeList),
          // 計算書種別
          statementKindSelectValues: convertToStatementKindSelectValueModel(getStatementKindResponse.statementKindList),
          // 条件種類
          commissionConditionKindSelectValues: convertToCodeValueSelectValueModel(getComCodeValueResponse.resultList[0].codeValueList),
          // 条件区分
          commissionConditionSelectValues: convertToCommissionConditionSelectValueModel(getCommissionConditionResponse.commissionConditionList),
          // 条件値
          commissionValueSelectValues: [],
          // 変更予約情報
          changeReservationInfoSelectValues: []

        });
      }

      // 新規追加の初期化処理
      if (commissionId === undefined || commissionId === 'new') {
        initializeNew();
      }

      // 現在情報表示の初期化処理
      if (commissionId !== null && commissionId !== undefined) {
        initializeCurrent(commissionId);
      }

      // 履歴表示の初期化処理
      const changeHistoryNumber = searchParams.get('change-history-number');
      if (changeHistoryNumber !== undefined && changeHistoryNumber !== null) {
        initializeHistory(changeHistoryNumber);
      }
    }
  }, []);




  /**
   * PI-TRA-COM-9999-0001: コードマスタ(取引会計)情報取得API レスポンスから SelectValueモデルへの変換
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
   *  API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンスから SelectValueモデルへの変換
   */
  const convertToCodeSelectValueModel = (
    SearchGetCodeManagementMasterListbox: SearchGetCodeManagementMasterListbox[]
  ): SelectValue[] => {
    return SearchGetCodeManagementMasterListbox.map((x) => {
      return {
        value: x.codeValue,
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
   * API-COM-9999-0020: 値属性変換API レスポンスから SelectValueモデルへの変換
   */
  const convertToConversionSelectValueModel = (
    commissionConditionValueList: commissionConditionValueList[]
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
    changeExpectDateInfo: changeExpectDateInfo[]
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
    codeValueList: codeValueList[]
  ): SelectValue[] => {
    return codeValueList.map((x) => {
      return {
        value: String(x.codeValue),
        displayValue: x.codeValueName,
      };
    });
  };


  /**
     * 確定ボタンクリック時のイベントハンドラ
     */
  const handleConfirm = async () => {
    // SCR-COM-0014-0003: 手数料テーブル詳細入力チェックAPI
    const commissionCheckRequest: ScrCom0014CommissionCheckRequest = {
      /** 手数料ID */
      commissionId: getValues('commissionId'),
      /** 手数料名 */
      commissionName: getValues('commissionName'),
      /** 手数料種類区分 */
      commissionKind: getValues('commissionKindName'),
      /** 手数料種類区分名 */
      commissionKindName: getValues('commissionKindName'),
      /** 稟議書ID */
      approvalDocumentId: getValues('approvalDocumentId'),
      /** 商品クレームコード */
      goodsClaimCode: getValues('goodsClaimCode'),
      /** 利用フラグ */
      useFlag: getValues('useFlag'),
      /** 計算書種別 */
      statementKind: getValues('statementKind'),
      /** 利用開始日 */
      useStartDate: getValues('useStartDate'),
      /** TODO: 条件設定セクション リスト 渡し方不明 */
      commissionConditionList: [],
      /** TODO: 価格設定セクション リスト 渡し方不明 */
      commissionPriceList: [],
    };
    const checkResult = await ScrCom0014CommissionCheck(commissionCheckRequest);

    // チェックAPIが一つでもある場合エラーを返却
    if (checkResult) {
      return;
    }

    // SCR-COM-0014-0007: 手数料テーブル登録申請API
    const applyRegistrationCommissionInfoRequest: ScrCom0014ApplyRegistrationCommissionInfoRequest = {
      /** 変更履歴番号 */
      changeHistoryNumber: changeHistory,
      /** 削除済み条件リスト */
      deletedList: deletedList,
      /** 手数料ID */
      commissionId: getValues('commissionId'),
      /** 手数料名 */
      commissionName: getValues('commissionName'),
      /** 手数料種類区分 */
      commissionKind: getValues('commissionKindName'),
      /** 手数料種類区分名 */
      commissionKindName: getValues('commissionKindName'),
      /** 稟議書ID */
      approvalDocumentId: getValues('approvalDocumentId'),
      /** 商品クレームコード */
      goodsClaimCode: getValues('goodsClaimCode'),
      /** 利用フラグ */
      useFlag: getValues('useFlag'),
      /** 計算書種別 */
      statementKind: getValues('statementKind'),
      /** 利用開始日 */
      useStartDate: getValues('useStartDate'),
      /** TODO: 条件設定セクション リスト 渡し方不明 */
      commissionConditionList: [],
      /** TODO: 価格設定セクション リスト 渡し方不明 */
      commissionPriceList: [],
      /** 申請従業員ID */
      applicationEmployeeId: appContext.user,
      /** 登録変更メモ */
      registrationChangeMemo: '',
      /** 第一承認者ID */
      firstApproverId: '',
      /** 第一承認者メールアドレス */
      firstApproverMailAddress: '',
      /** 第ニ承認者ID */
      secondApproverId: '',
      /** 第三承認者ID */
      thirdApproverId: '',
      /** 第四承認者ID */
      fourthApproverId: '',
      /** 申請コメント */
      applicationComment: '',
      /** 変更予定日 */
      changeExpectDate: '',
    };
    const response = await ScrCom0014ApplyRegistrationCommissionInfo(applyRegistrationCommissionInfoRequest);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      changedSections: convertToChngedSections(dirtyFields),
      errorMessages: response.errorMessages,
      warningMessages: response.warningMessages,
    });
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
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    if (!commissionId) return;

    const changeHistoryNumber = searchParams.get('change-history-number');

    // SCR-COM-9999-0025: 変更履歴情報取得API
    const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
      changeHistoryNumber: changeHistoryNumber,
    };
    const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(getHistoryInfoRequest);
  };


  /**
  * 一括登録アイコンクリック時のイベントハンドラ
  */
  const handleIconBulkAddClick = () => {
    alert('TODO：一括登録ポップアップ画面を表示する。');
    // TODO: 条件設定セクションの内容と、価格セクションの表示内容が一致しているか確認する。(初期表示時の変数を保持した項目(★)との比較)
  };


  /**
  * CSV出力アイコンクリック時のイベントハンドラ
  */
  const handleIconOutputCsvClick = () => {
    alert('TODO：結果結果からCSVを出力する。');
  };


  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/commissions/' + commissionId);
  };


  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
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
      section: '基本情報',
      fields: [
        'commissionId',
        'commissionName',
        'commissionKind',
        'approvalDocumentId',
        'goodsClaimCode',
        'useFlag',
        'statementKind',
        'useStartDate',
      ],
    },
    {
      section: '条件設定',
      fields: [
        'commissionId',
        'commissionName',
        'commissionKind',
        'approvalDocumentId',
        'goodsClaimCode',
        'useFlag',
        'statementKind',
        'useStartDate',
      ],
    },
    {
      section: '価格設定',
      fields: [
        'commissionId',
        'commissionName',
        'commissionKind',
        'approvalDocumentId',
        'goodsClaimCode',
        'useFlag',
        'statementKind',
        'useStartDate',
      ],
    },
  ]

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 基本情報セクション */}
            <Section name='基本情報'>
              <ColStack>
                <TextField label='手数料ID' name='commissionId' />
                <TextField label='手数料名' name='commissionName' required />
                <Select
                  label='手数料種類'
                  name='commissionKind'
                  // 新規作成時のみ活性化する
                  disabled={activeFlag ? false : true}
                  selectValues={selectValues.commissionKindSelectValues}
                  blankOption
                  required
                />
                <TextField label='稟議書ID' name='approvalDocumentId' />
                <Select
                  label='商品クレームコード'
                  name='goodsClaimCode'
                  selectValues={selectValues.goodsClaimCodeSelectValues}
                  blankOption
                  required
                />
                <Radio
                  label='利用フラグ'
                  name='useFlag'
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
                <Select
                  label='計算書種別'
                  name='statementKind'
                  // 新規作成時のみ活性化する
                  disabled={activeFlag ? false : true}
                  selectValues={selectValues.statementKindSelectValues}
                  blankOption
                  required
                />
                <DatePicker
                  label='利用開始日'
                  name='useStartDate'
                  wareki
                  required
                />
              </ColStack >
            </Section>

            {/* 条件設定セクション */}
            <Section name='条件設定'>
              <ColStack>

              </ColStack>
            </Section>

            {/* 価格設定セクション */}
            <Section
              name='価格設定'
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  <AddButton onClick={handleIconBulkAddClick}>一括登録</AddButton>
                  <AddButton onClick={handleIconOutputCsvClick}>
                    CSV出力
                  </AddButton>
                </MarginBox>
              }
            >
              <ColStack>

              </ColStack>
            </Section>
          </FormProvider>
        </MainLayout>

        {/* right */}
        <MainLayout right>
          <FormProvider {...methods}>
            <RowStack>
              <ColStack>
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
              </ColStack>
            </RowStack>
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
  );
};

export default ScrCom0014Page;
