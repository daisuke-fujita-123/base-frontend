import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import yup from 'utils/yup';
import { ObjectSchema } from 'yup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import { AddButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DataGrid, exportCsv, GridColDef } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { Select, SelectValue } from 'controls/Select';
import { Typography } from 'controls/Typography';

import {
  registrationRequest,
  ScrCom0013chkService,
  ScrCom0013DisplayComoditymanagementService,
  ScrCom0013DisplayComoditymanagementServiceRequest,
  ScrCom0013DisplayComoditymanagementServiceResponse,
  ScrCom0013MergeService,
  ScrCom0013MergeServiceRequest,
} from 'apis/com/ScrCom0013Api';
import {
  ChangeExpectDateInfo,
  ScrCom9999GetChangeDate,
  ScrCom9999GetChangeDateRequest,
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetCodeManagementMasterRequest,
  ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoRequest,
  SearchGetCodeManagementMasterListbox,
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';

import { comApiClient } from 'providers/ApiClient';
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
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更履歴番号+変更予定日
  memberChangeHistories: any[];
  // 変更予定日
  changeExpectedDate: string;
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
 * サービス情報入力チェックAPIリクエスト用 リスト データモデル
 */
interface serviceInfoModel {
  serviceInfo: serviceInfo[];
}

/**
 * サービス情報入力チェックAPIリクエスト用 リスト 初期データ
 */
interface serviceInfo {
  serviceId: string;
  serviceName: string;
}

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
  reportComment1: yup.string().label('サービス名').max(30),
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
  // サービス情報取得APIにて取得した サービスID
  const [serviceId, setServiceId] = useState<any>();
  // 反映予定日チェック用
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckisOpen, setChangeHistoryDateCheckisOpen] =
    useState<boolean>(false);
  // サービス情報入力チェックAPIリクエスト用リスト
  const [serviceInfo, setServiceInfo] = useState<serviceInfoModel>();
  // DataGrid InternalId採番用変数
  const [count, setCount] = useState(0);
  // 登録内容確認ポップアップ => 登録内容申請ポップアップへと引き渡す変更予約メモ
  const [registrationChangeMemo, setRegistrationChangeMemo] =
    useState<string>('');

  // user情報(businessDateも併せて取得)
  const { user } = useContext(AuthContext);

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
    serviceId: serviceId,
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
    // 変更履歴番号
    changeHistoryNumber: '',
    // 変更履歴番号+変更予定日
    memberChangeHistories: [],
    // 変更予定日
    changeExpectedDate: '',
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
    },
    {
      field: 'serviceName',
      headerName: 'サービス名',
      size: 'l',
      cellType: 'input',
    },
    {
      field: 'responsibleCategory',
      headerName: '担当部門区分',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.responsibleCategoryValues,
    },
    {
      field: 'targetServiceDivision',
      headerName: '対象サービス区分',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.targetServiceDivisionValues,
    },
    {
      field: 'cooperationInfoServiceFlg',
      headerName: '外部連携情報サービスフラグ',
      size: 'l',
      cellType: 'radio',
      radioValues: [
        { value: 'target', displayValue: '対象' },
        { value: 'unTarget', displayValue: '対象外' },
      ],
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
    return response.serviceInfo.map((x) => {
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
        changeReserve: x.changeReserve === true ? 'あり' : '',
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

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API(担当部門)
      const responsibleCategoryRequest: ScrCom9999GetCodeManagementMasterRequest =
        {
          codeId: CDE_COM_0013,
        };
      const responsibleCategoryResponse =
        await ScrCom9999GetCodeManagementMaster(responsibleCategoryRequest);

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API(対象サービス)
      const targetServiceDivisionRequest: ScrCom9999GetCodeManagementMasterRequest =
        {
          codeId: CDE_COM_0013,
        };
      const targetServiceDivisionResponse =
        await ScrCom9999GetCodeManagementMaster(targetServiceDivisionRequest);

      // API-COM-9999-0026: 変更予定日取得API
      const getChangeDateRequest: ScrCom9999GetChangeDateRequest = {
        businessDate: user.taskDate,
        screenId: SCR_COM_0013,
        tabId: '2',
        masterId: '',
      };
      const getChangeDateResponse = await ScrCom9999GetChangeDate(
        getChangeDateRequest
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
            getChangeDateResponse.changeExpectDateInfo
          ),
      });
    };

    // 履歴表示
    const historyInitialize = async (changeHisoryNumber: string) => {
      /** API-COM-9999-0025: 変更履歴情報取得API */
      const request = {
        changeHistoryNumber: changeHisoryNumber,
      };
      const response = (
        await comApiClient.post(
          '/api/com/scr-com-9999/get-history-info',
          request
        )
      ).data;
      const serviceBasic = convertToHistoryInfoModel(response);
      // 画面にデータを設定
      reset(serviceBasic);
      props.setGoodsBaseValue(response);
    };

    // 変更履歴番号を受け取っていたら履歴表示
    if (props.changeHisoryNumber !== null) {
      historyInitialize(props.changeHisoryNumber);
      return;
    }

    initialize();
  }, []);

  /**
   * 変更履歴情報取得APIから基本情報データモデルへの変換
   */
  const convertToHistoryInfoModel = (
    response: registrationRequest
  ): SearchResultRowModel => {
    return {
      id: response.serviceId,
      serviceId: response.serviceId,
      serviceName: response.serviceName,
      responsibleCategory: response.responsibleCategory,
      targetServiceDivision: response.targetServiceDivision,
      cooperationInfoServiceFlg: response.cooperationInfoServiceFlg,
      multiContractPossibleFlg: response.multiContractPossibleFlg,
      utilizationFlg: response.serviceUtilizationFlg,
      changeBfrTimestamp: response.changeBfrTimestamp,
      changeReserve: response.serviceChangeReserve,
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
    exportCsv('ScrCom0013ServiceTab.csv', apiRef);
  };

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    // SCR-COM-9999-0025: 変更履歴情報取得API
    const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
      changeHistoryNumber: props.changeHisoryNumber,
    };
    const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(
      getHistoryInfoRequest
    );

    setIsChangeHistoryBtn(true);

    // 画面にデータを設定
    setServiceId(getHistoryInfoResponse.changeHistoryInfo.get('serviceId'));
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
  const handleRegistConfirm = (registrationChangeMemo: string) => {
    setIsOpenScrCom0032Popup(false);
  };

  /**
   * 登録内容確認ポップアップの登録承認ボタンクリック時のイベントハンドラ
   * @param registrationChangeMemo 登録変更メモ(登録内容確認ポップアップからの受取)
   */
  const handleApprovalConfirm = (registrationChangeMemo: string) => {
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

    // SCR-COM-0013-0008: サービス情報登録更新API
    const mergeServiceRequest: ScrCom0013MergeServiceRequest = {
      /** 変更履歴番号 */
      changeHistoryNumber: getValues('changeHistoryNumber'),
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
      changeExpectDate: getValues('changeHistoryNumber'),
    };
    ScrCom0013MergeService(mergeServiceRequest);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <Section
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
                  (params.field === 'serviceName' &&
                    user.editPossibleScreenIdList.includes('SCR-COM-0013')) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'responsibleCategory' &&
                    user.editPossibleScreenIdList.includes('SCR-COM-0013')) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'targetServiceDivision' &&
                    user.editPossibleScreenIdList.includes('SCR-COM-0013')) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'cooperationInfoServiceFlg' &&
                    user.editPossibleScreenIdList.includes('SCR-COM-0013')) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'multiContractPossibleFlg' &&
                    user.editPossibleScreenIdList.includes('SCR-COM-0013')) ||
                  props.changeHisoryNumber === ''
                )
                  return true;
                if (
                  (params.field === 'changeReserve' &&
                    user.editPossibleScreenIdList.includes('SCR-COM-0013')) ||
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
            <RowStack>
              <ColStack>
                <RightElementStack>
                  <Stack>
                    <Typography bold>変更予約情報</Typography>
                    {/* 履歴表示の場合 非活性 */}
                    <Select
                      name='changeHistoryNumber'
                      selectValues={
                        selectValues.changeReservationInfoSelectValues
                      }
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
              </ColStack>
            </RowStack>
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
          handleRegistConfirm={handleRegistConfirm}
          // 本機能ではこちらのみを使用
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
export default ScrCom0013ServiceTab;
