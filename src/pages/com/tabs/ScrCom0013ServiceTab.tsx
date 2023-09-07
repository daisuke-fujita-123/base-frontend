import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import yup from 'utils/yup';
import { ObjectSchema } from 'yup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { RightElementStack, Stack } from 'layouts/Stack';

import { AddButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DataGrid, exportCsv, GridColDef } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { Select, SelectValue } from 'controls/Select';
import { Typography } from 'controls/Typography';

import {
  changeExpectDateInfo,
  displayComodityManagementServiceReserve,
  displayComodityManagementServiceReserveRequest,
  displayComodityManagementServiceReserveResponse,
  registrationRequest,
  ScrCom0013chkService,
  ScrCom0013chkServiceRequest,
  ScrCom0013DisplayComoditymanagementService,
  ScrCom0013DisplayComoditymanagementServiceRequest,
  ScrCom0013DisplayComoditymanagementServiceResponse,
  ScrCom0013GetServiceChangeDate,
  ScrCom0013GetServiceChangeDateRequest,
  ScrCom0013MergeService,
  ScrCom0013MergeServiceRequest,
} from 'apis/com/ScrCom0013Api';
import {
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetCodeManagementMasterRequest,
  SearchGetCodeManagementMasterListbox,
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';

import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

import { useGridApiRef } from '@mui/x-data-grid-pro';
import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from '../popups/ScrCom0032Popup';
import ScrCom0033Popup, {
  ScrCom0033PopupModel,
} from '../popups/ScrCom0033Popup';

/**
 * 商品管理 画面 データモデル
 */
interface displayComoditymanagement {
  // サービスID
  serviceId: string;
  // サービス名
  serviceName: string;
  // 担当部門区分
  responsibleCategory: string;
  // 対象サービス区分
  targetServiceDivision: string;
  // 外部連携情報サービスフラグ
  cooperationInfoServiceFlg: boolean;
  // 複数契約可フラグ
  multiContractPossibleFlg: boolean;
  // 利用フラグ
  utilizationFlg: boolean;
  // 変更前タイムスタンプ
  changeBfrTimestamp: string;
  // 変更予約
  changeReserve: string;
}

/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // internalId
  id: string;
  // サービスID
  serviceId: string;
  // サービス名
  serviceName: string;
  // 担当部門区分
  responsibleCategory: string;
  // 対象サービス区分
  targetServiceDivision: string;
  // 外部連携情報サービスフラグ
  cooperationInfoServiceFlg: boolean;
  // 複数契約可フラグ
  multiContractPossibleFlg: boolean;
  // 利用フラグ
  utilizationFlg: boolean;
  // 変更前タイムスタンプ
  changeBfrTimestamp: string;
  // 変更予約
  changeReserve: string;
}

/**
 * 検索条件(プルダウン)プルダウン データモデル
 */
interface SelectValuesModel {
  // 担当部門
  responsibleCategoryValues: SelectValue[];
  // 連携用対象サービス
  targetServiceDivisionValues: SelectValue[];
  // 変更予約情報
  changeReservationInfoSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン) 初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 担当部門
  responsibleCategoryValues: [],
  // 連携用対象サービス
  targetServiceDivisionValues: [],
  // 変更予約情報
  changeReservationInfoSelectValues: [],
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: '',
};

/**
 * 登録内容申請ポップアップ初期データ
 */
const scrCom0033PopupInitialValues: ScrCom0033PopupModel = {
  // 画面ID
  screenId: '',
  // タブID
  tabId: 2,
  // 申請金額
  applicationMoney: 0,
};

/**
 * 画面IDの定数定義
 */
const SCR_COM_0013 = 'SCR-COM-0013';

/**
 * コードIDの定数定義
 */
const CDE_COM_0013 = 'CDE-COM-0013';

/**
 * バリデーションスキーマ
 */
const validationSchema: ObjectSchema<any> = yup.object({
  serviceName: yup.string().label('サービス名').max(30).required(),
  targetServiceDivision: yup.string().label('連携対象サービス').required(),
  cooperationInfoServiceFlg: yup
    .string()
    .label('外部連携情報サービス')
    .required(),
  multiContractPossibleFlg: yup.string().label('複数契約可').required(),
  utilizationFlg: yup.string().label('利用フラグ').required(),
});

/**
 * SCR-COM-0013 商品管理画面 サービスタブ
 * @returns
 */
const ScrCom0013ServiceTab = (props: {
  changeHisoryNumber: string;
  setGoodsBaseValue: (goodsBase: registrationRequest) => void;
}) => {
  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 反映予定日チェック用
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckisOpen, setChangeHistoryDateCheckisOpen] =
    useState<boolean>(false);
  // サービス情報入力チェックAPIリクエスト用リスト
  const [serviceInfo, setServiceInfo] = useState<ScrCom0013chkServiceRequest>();
  // DataGrid InternalId採番用変数
  const [count, setCount] = useState(0);
  // 登録内容確認ポップアップ => 登録内容申請ポップアップへと引き渡す変更予約メモ
  const [registrationChangeMemo, setRegistrationChangeMemo] =
    useState<string>('');

  // user情報(businessDateも併せて取得)
  const { user } = useContext(AuthContext);

  // クエリパラメータの変更履歴番号
  const [searchParams] = useSearchParams();
  // 変更履歴番号
  const changeHistoryNumber = searchParams.get('change-history-number');
  // クエリストリングのサービスID
  const { serviceIdParam } = useParams();

  // ユーザーの編集権限
  const readonly: boolean =
    user.editPossibleScreenIdList.includes(SCR_COM_0013);

  // CSV
  const apiRef = useGridApiRef();

  // popup
  // 登録内容確認ポップアップ
  const [isOpenScrCom0032Popup, setIsOpenScrCom0032Popup] =
    useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  // 登録内容申請ポップアップ
  const [isOpenScrCom0033Popup, setIsOpenScrCom0033Popup] =
    useState<boolean>(false);
  const [scrCom0033PopupData, setScrCom0033PopupData] =
    useState<ScrCom0033PopupModel>(scrCom0033PopupInitialValues);

  /**
   * 商品管理 画面 初期データ
   */
  const initialValues: displayComoditymanagement = {
    // サービスID
    serviceId: serviceIdParam === undefined ? '' : serviceIdParam,
    // サービス名
    serviceName: '',
    // 担当部門区分
    responsibleCategory: '',
    // 対象サービス区分
    targetServiceDivision: '',
    // 外部連携情報サービスフラグ
    cooperationInfoServiceFlg: false,
    // 複数契約可フラグ
    multiContractPossibleFlg: false,
    // 利用フラグ
    utilizationFlg: false,
    // 変更前タイムスタンプ
    changeBfrTimestamp: '',
    // 変更予約
    changeReserve: '',
  };

  // form
  const methods = useForm<displayComoditymanagement>({
    defaultValues: initialValues,
    // resolver: yupResolver(yup.object(validationSchema)),
  });
  const {
    formState: { dirtyFields, errors },
    setValue,
    getValues,
    reset,
  } = methods;

  /**
   * 検索条件列定義
   */
  const searchResultColumns: GridColDef[] = [
    {
      field: 'serviceId',
      headerName: 'サービスID',
      size: 'l',
      required: true,
    },
    {
      field: 'serviceName',
      headerName: 'サービス名',
      size: 'l',
      cellType: 'input',
      required: true,
    },
    {
      field: 'responsibleCategory',
      headerName: '担当部門',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.responsibleCategoryValues,
    },
    {
      field: 'targetServiceDivision',
      headerName: '連携対象サービス',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.targetServiceDivisionValues,
      required: true,
    },
    {
      field: 'cooperationInfoServiceFlg',
      headerName: '外部連携情報サービス',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'target', displayValue: '対象' },
        { value: 'unTarget', displayValue: '対象外' },
      ],
      required: true,
    },
    {
      field: 'multiContractPossibleFlg',
      headerName: '複数契約可',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'multiContractPossibleFlgYes', displayValue: '可' },
        { value: 'multiContractPossibleFlgNo', displayValue: '不可' },
      ],
      required: true,
    },
    {
      field: 'utilizationFlg',
      headerName: '利用フラグ',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'utilizationFlgYes', displayValue: '可' },
        { value: 'utilizationFlgNo', displayValue: '不可' },
      ],
      required: true,
    },
    {
      field: 'changeReserve',
      headerName: '変更予約',
      size: 's',
    },
  ];

  /**
   * 商品管理表示API(コース情報表示) レスポンスから検索結果モデルへの変換
   */
  const convertToSearchResultRowModel = (
    response: ScrCom0013DisplayComoditymanagementServiceResponse
  ): SearchResultRowModel[] => {
    return response.serviceList.map((x) => {
      return {
        id: x.serviceId,
        // サービスIDは新規追加の場合ブランクで設定
        serviceId: props.changeHisoryNumber === '' ? '' : x.serviceId,
        serviceName: x.serviceName,
        responsibleCategory: x.responsibleCategory,
        targetServiceDivision: x.targetServiceDivision,
        cooperationInfoServiceFlg: x.cooperationInfoServiceFlg,
        multiContractPossibleFlg: x.multiContractPossibleFlg,
        utilizationFlg: x.multiContractPossibleFlg,
        changeBfrTimestamp: x.changeBfrTimestamp,
        changeReserve: x.changeReserve ? 'あり' : '',
      };
    });
  };

  /**
   * 初期表示
   */
  useEffect(() => {
    // 現在情報の表示
    const initialize = async () => {
      // SCR-COM-0013-0002：商品管理表示API(サービス情報表示）
      const displayComoditymanagementServiceRequest: ScrCom0013DisplayComoditymanagementServiceRequest =
        {
          /** 画面ID */
          screenId: SCR_COM_0013,
          /** タブID */
          tabId: 2,
          /** 業務日付 */
          businessDate: user.taskDate,
        };
      const response = await ScrCom0013DisplayComoditymanagementService(
        displayComoditymanagementServiceRequest
      );
      const searchResult = convertToSearchResultRowModel(response);

      setSearchResult(searchResult);

      // チェックAPI用のリストを作成
      const tempInfoList: any = [];
      searchResult.map((e) => {
        tempInfoList.push({
          serviceId: e.serviceId,
          serviceName: e.serviceName,
        });
      });
      setServiceInfo(tempInfoList);

      // API-COM-9999-0010: コード管理マスタリストボックス情報取得API(担当部門)
      const responsibleCategoryRequest: ScrCom9999GetCodeManagementMasterRequest =
        {
          codeId: CDE_COM_0013,
        };
      const responsibleCategoryResponse =
        await ScrCom9999GetCodeManagementMaster(responsibleCategoryRequest);

      // API-COM-9999-0010: コード管理マスタリストボックス情報取得API(対象サービス)
      const targetServiceDivisionRequest: ScrCom9999GetCodeManagementMasterRequest =
        {
          codeId: CDE_COM_0013,
        };
      const targetServiceDivisionResponse =
        await ScrCom9999GetCodeManagementMaster(targetServiceDivisionRequest);

      // API-COM-0013-0006：サービス変更予定日取得API
      const getServiceChangeDateRequest: ScrCom0013GetServiceChangeDateRequest =
        {
          businessDate: user.taskDate,
          screenId: SCR_COM_0013,
          tabId: 2,
        };
      const getServiceChangeDateResponse = await ScrCom0013GetServiceChangeDate(
        getServiceChangeDateRequest
      );

      // 画面にデータを設定
      setSelectValues({
        // 担当部門
        responsibleCategoryValues: convertToCodeSelectValueModel(
          responsibleCategoryResponse.searchGetCodeManagementMasterListbox
        ),
        // 対象サービス
        targetServiceDivisionValues: convertToCodeSelectValueModel(
          targetServiceDivisionResponse.searchGetCodeManagementMasterListbox
        ),
        // 変更予約
        changeReservationInfoSelectValues:
          convertToChangeExpectDateSelectValueModel(
            getServiceChangeDateResponse.changeExpectDateInfo
          ),
      });
    };

    // 履歴表示
    const historyInitialize = async (changeHisoryNumber: string) => {
      // API-COM-0013-0011: 商品管理表API(サービス変更予約情報表示)
      const displayComodityManagementServiceReserveRequest: displayComodityManagementServiceReserveRequest =
        {
          screenId: SCR_COM_0013,
          tabId: 2,
          changeReserveDate: user.taskDate,
        };
      const displayComodityManagementServiceReserveResponse =
        await displayComodityManagementServiceReserve(
          displayComodityManagementServiceReserveRequest
        );
      const serviceHistoryInfo = convertToHistoryInfoModel(
        displayComodityManagementServiceReserveResponse
      );

      // 画面にデータを設定
      reset(serviceHistoryInfo);
    };

    // 変更履歴番号を受け取っていたら履歴表示
    if (props.changeHisoryNumber !== null) {
      historyInitialize(props.changeHisoryNumber);
      return;
    }

    initialize();
  }, []);

  /**
   * // API-COM-0013-0011: 商品管理表API(サービス変更予約情報表示)から基本情報データモデルへの変換
   */
  const convertToHistoryInfoModel = (
    response: displayComodityManagementServiceReserveResponse
  ): displayComoditymanagement => {
    return {
      serviceId: response.serviceInfo[0].serviceId,
      serviceName: response.serviceInfo[0].serviceName,
      responsibleCategory: response.serviceInfo[0].responsibleCategory,
      targetServiceDivision: response.serviceInfo[0].targetServiceDivision,
      cooperationInfoServiceFlg:
        response.serviceInfo[0].cooperationInfoServiceFlg,
      multiContractPossibleFlg:
        response.serviceInfo[0].multiContractPossibleFlg,
      utilizationFlg: response.serviceInfo[0].utilizationFlg,
      changeBfrTimestamp: response.serviceInfo[0].changeBfrTimestamp,
      changeReserve: response.serviceInfo[0].changeReserve,
    };
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
   *  API-COM-0013-0006：サービス変更予定日取得API レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeExpectDateSelectValueModel = (
    changeExpectDateInfo: changeExpectDateInfo[]
  ): SelectValue[] => {
    return changeExpectDateInfo.map((x) => {
      return {
        value: String(x.changeExpectDate),
        displayValue: x.changeExpectDate,
      };
    });
  };

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    // 現在のデータグリッドの行形式のまま1行追加する
    const copyContractRow: SearchResultRowModel[] = Object.assign(
      [],
      searchResult
    );
    // internalId ユニーク採番変数
    const newCount = count + 1;
    copyContractRow.push({
      // internalId
      id: String(newCount),
      // サービスID
      serviceId: '',
      // サービス名
      serviceName: '',
      // 担当部門区分
      responsibleCategory: '',
      // 対象サービス区分
      targetServiceDivision: '',
      // 外部連携情報サービスフラグ
      cooperationInfoServiceFlg: false,
      // 複数契約可フラグ
      multiContractPossibleFlg: false,
      // 利用フラグ
      utilizationFlg: false,
      // 変更前タイムスタンプ
      changeBfrTimestamp: '',
      // 変更予約
      changeReserve: '',
    });
    setCount(newCount);
    setSearchResult(copyContractRow);
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleExportCsvClick = () => {
    exportCsv(user.employeeId + '_' + user.taskDate, apiRef);
  };

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    // API-COM-0013-0011: 商品管理表API(サービス変更予約情報表示)
    const displayComodityManagementServiceReserveRequest: displayComodityManagementServiceReserveRequest =
      {
        screenId: SCR_COM_0013,
        tabId: 2,
        changeReserveDate: user.taskDate,
      };
    const displayComodityManagementServiceReserveResponse =
      await displayComodityManagementServiceReserve(
        displayComodityManagementServiceReserveRequest
      );
    const serviceHistoryInfo = convertToHistoryInfoModel(
      displayComodityManagementServiceReserveResponse
    );

    setIsChangeHistoryBtn(true);

    // 画面にデータを設定
    reset(serviceHistoryInfo);
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
  const handleConfirm = async (checkFlg: boolean) => {
    setChangeHistoryDateCheckisOpen(false);
    if (!checkFlg) return;

    // SCR-COM-0013-0007: サービス情報入力チェックAPI
    if (serviceInfo !== undefined) {
      const checkResult = await ScrCom0013chkService(serviceInfo);

      // 登録更新の結果を登録確認ポップアップへ渡す
      setIsOpenScrCom0032Popup(true);
      setScrCom0032PopupData({
        errorList: checkResult.errorList,
        warningList: checkResult.warningList,
        registrationChangeList: checkResult.registrationChangeList,
        changeExpectDate: user.taskDate,
      });
    }
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handleApprovalConfirm = (registrationChangeMemo: string) => {
    setIsOpenScrCom0032Popup(false);
  };

  /**
   * 登録内容確認ポップアップの登録承認ボタンクリック時のイベントハンドラ
   * @param registrationChangeMemo 登録変更メモ(登録内容確認ポップアップからの受取)
   */
  const handleRegistConfirm = (registrationChangeMemo: string) => {
    setIsOpenScrCom0032Popup(false);

    setIsOpenScrCom0033Popup(true);
    // 登録内容申請ポップアップへと引き渡す予約変更メモを設定
    setRegistrationChangeMemo(registrationChangeMemo);

    setScrCom0033PopupData({
      screenId: SCR_COM_0013,
      // タブID
      tabId: 2,
      // 申請金額
      applicationMoney: 0,
    });
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenScrCom0032Popup(false);
  };

  /**
   * 登録内容申請ポップアップの確定ボタンクリック→ダイアログOK時のイベントハンドラ
   */
  const handlePopupConfirm = (
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
    setIsOpenScrCom0032Popup(false);
    setIsChangeHistoryBtn(false);

    // API-COM-0013-0008: サービス情報登録更新API
    const mergeServiceRequest: ScrCom0013MergeServiceRequest = {
      /** 変更履歴番号 */
      changeHistoryNumber:
        changeHistoryNumber === null ? '' : changeHistoryNumber,
      /** サービス情報 */
      serviceInfo: searchResult,
      /** 申請従業員 */
      applicationEmployeeId: user.employeeName,
      /** 登録変更メモ */
      registrationChangeMemo: registrationChangeMemo,
      /** 第一承認者ID */
      firstApproverId: employeeId1,
      /** 第一承認者アドレス  */
      firstApproverMailAddress: employeeMailAddress1,
      /** 第二承認者ID */
      secondApproverId: employeeId2,
      /** 第三承認者ID */
      thirdApproverId: employeeId3,
      /** 第四承認者ID */
      fourthApproverId: employeeId4,
      /** 申請コメント */
      applicationComment: applicationComment,
      /** 変更予定日 */
      changeExpectDate: user.taskDate,
    };
    ScrCom0013MergeService(mergeServiceRequest);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <Section
            fitInside
            name='サービステーブル一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleExportCsvClick}>CSV出力</AddButton>
                {/* 履歴表示の際追加ボタンは非活性 */}
                <AddButton
                  onClick={handleIconAddClick}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >
                  追加
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              pagination={true}
              columns={searchResultColumns}
              rows={searchResult}
              resolver={validationSchema}
              // 編集権限がない状態での表示、または履歴表示の場合の入力欄は非活性
              getCellDisabled={(params) => {
                if (
                  (params.field === 'serviceName' && !readonly) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'responsibleCategory' && !readonly) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'targetServiceDivision' && !readonly) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'cooperationInfoServiceFlg' && !readonly) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'multiContractPossibleFlg' && !readonly) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'changeReserve' && !readonly) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                return false;
              }}
            />
          </Section>
        </MainLayout>

        {/* right */}
        <MainLayout right>
          <FormProvider {...methods}>
            <RightElementStack>
              <Stack>
                <Typography bold>変更予約情報</Typography>
                {/* 履歴表示の場合 非活性 */}
                <Select
                  name='changeHistoryNumber'
                  selectValues={selectValues.changeReservationInfoSelectValues}
                  blankOption
                  disabled={props.changeHisoryNumber === '' ? true : false}
                />
                {/* 履歴表示の場合 非活性 */}
                <PrimaryButton
                  onClick={handleSwichDisplay}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >
                  表示切替
                </PrimaryButton>
              </Stack>
              <MarginBox mb={6}>
                {/* 履歴表示の場合 非活性 */}
                <DatePicker
                  label='変更予定日'
                  name='changeExpectedDate'
                  disabled={props.changeHisoryNumber === '' ? true : false}
                />
              </MarginBox>
            </RightElementStack>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            {/* 履歴表示の場合 非活性 */}
            <ConfirmButton
              onClick={onClickConfirm}
              disable={props.changeHisoryNumber === '' ? true : false}
            >
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {isOpenScrCom0032Popup && (
        <ScrCom0032Popup
          isOpen={isOpenScrCom0032Popup}
          data={scrCom0032PopupData}
          // 本機能ではこちらのみを使用
          handleRegistConfirm={handleRegistConfirm}
          handleApprovalConfirm={handleApprovalConfirm}
          handleCancel={handlePopupCancel}
        />
      )}

      {/* 登録内容申請ポップアップ */}
      {isOpenScrCom0033Popup && (
        <ScrCom0033Popup
          isOpen={isOpenScrCom0033Popup}
          data={scrCom0033PopupData}
          handleConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      )}

      {/* 反映予定日整合性チェック */}
      <ChangeHistoryDateCheckUtil
        changeExpectedDate={user.taskDate}
        changeHistoryNumber={changeHistoryNumber}
        isChangeHistoryBtn={isChangeHistoryBtn}
        changeHistory={selectValues.changeReservationInfoSelectValues}
        isOpen={changeHistoryDateCheckisOpen}
        handleConfirm={handleConfirm}
      />
    </>
  );
};
export default ScrCom0013ServiceTab;
