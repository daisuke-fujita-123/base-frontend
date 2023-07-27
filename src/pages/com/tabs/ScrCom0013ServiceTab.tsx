import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import { AddButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { Select, SelectValue } from 'controls/Select';
import { Typography } from 'controls/Typography';

import {
  errorList, ScrCom0013chkService, ScrCom0013DisplayComoditymanagementService,
  ScrCom0013DisplayComoditymanagementServiceRequest,
  ScrCom0013DisplayComoditymanagementServiceResponse, ScrCom0013MergeService,
  ScrCom0013MergeServiceRequest, warnList
} from 'apis/com/ScrCom0013Api';
import {
  changeExpectDateInfo, ScrCom9999GetChangeDate, ScrCom9999GetChangeDateRequest,
  ScrCom9999GetCodeManagementMasterListbox, ScrCom9999GetCodeManagementMasterListboxRequest,
  ScrCom9999GetHistoryInfo, ScrCom9999GetHistoryInfoRequest, SearchGetCodeManagementMasterListbox
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';

import { AppContext } from 'providers/AppContextProvider';

import { generate } from 'utils/BaseYup';
import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

import ScrCom0032Popup, {
  ColumnListModel, errorMessagesModel, ScrCom0032PopupModel, SectionListModel,
  warningMessagesModel
} from '../popups/ScrCom00032Popup';

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
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorMessages: [
    {
      errorCode: '',
      errorMessage: '',
    },
  ],
  warningMessages: [
    {
      warningCode: '',
      warningMessage: '',
    },
  ],
  contentsList: {
    screenName: '',
    screenId: '',
    tabName: '',
    tabId: '',
    sectionList: [
      {
        sectionName: '',
        columnList: [
          {
            columnName: '',
          },
        ],
      },
    ],
  },
  changeExpectDate: new Date(),
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
 * バリデーションスキーマ
 */
const validationSchama = generate([
  'serviceName',
]);


/**
 * SCR-COM-0013 商品管理画面 サービスタブ
 * @returns
 */
const ScrCom0013ServiceTab = (props: { changeHisoryNumber: string }) => {
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

  // user情報
  const { appContext } = useContext(AppContext);

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);


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
  }

  // form
  const methods = useForm<displayComoditymanagement>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchama),
    // context: isReadOnly,
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
      size: 'm',
    },
    {
      field: 'serviceName',
      headerName: 'サービス名',
      size: 'm',
      cellType: 'input',
    },
    {
      field: 'responsibleCategory',
      headerName: '担当部門区分',
      size: 'm',
      cellType: 'select',
      selectValues: selectValues.responsibleCategoryValues,
    },
    {
      field: 'targetServiceDivision',
      headerName: '対象サービス区分',
      size: 'm',
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
      headerName: '複数契約可フラグ',
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
      size: 'm',
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
        changeReserve: x.changeReserve,
      };
    });
  };


  /**
   * APIレスポンスから表示用エラーメッセージへの変換
   */
  const convertToErrorMessages = (
    response: errorList[]
  ): errorMessagesModel[] => {
    const list: errorMessagesModel[] = [];
    if (response === undefined) {
      return list;
    }
    response.map((x) => {
      list.push({
        errorCode: x.errorCode,
        errorMessage: x.errorMessage,
      });
    });
    return list;
  };


  /**
   * APIレスポンスから表示用ワーニングメッセージへの変換
   */
  const convertToWarnMessages = (
    response: warnList[]
  ): warningMessagesModel[] => {
    const list: warningMessagesModel[] = [];
    if (response === undefined) {
      return list;
    }
    response.map((x) => {
      list.push({
        warningCode: x.warnCode,
        warningMessage: x.warnMessage,
      });
    });
    return list;
  };


  /**
 * 変更した項目から登録・変更内容データへの変換
 */
  const convertToSectionList = (dirtyFields: object): SectionListModel[] => {
    const fields = Object.keys(dirtyFields);
    const sectionList: SectionListModel[] = [];
    const columnList: ColumnListModel[] = [];
    sectionDef.forEach((d) => {
      fields.forEach((f) => {
        if (d.fields.includes(f)) {
          columnList.push(
            { columnName: d.section[d.fields.indexOf(f)] }
          );
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
  * セクション構造定義
  */
  const sectionDef = [
    {
      section: 'サービステーブル一覧',
      fields: [
        'serviceId',
        'serviceName',
        'responsibleCategory',
        'targetServiceDivision',
        'cooperationInfoServiceFlg',
        'multiContractPossibleFlg',
        'utilizationFlg',
        'changeBfrTimestamp',
        'changeReserve',
        'changeHistoryNumber',
        'memberChangeHistories',
        'changeExpectedDate',
      ],
    },
  ]


  /**
 * 初期表示
 */
  useEffect(() => {
    const initialize = async () => {
      // SCR-COM-0013-0001: 商品管理表示API(コース情報表示）
      const displayComoditymanagementServiceRequest: ScrCom0013DisplayComoditymanagementServiceRequest = {
        /** 画面ID */
        screenId: '',
        /** タブID */
        tabId: '',
        /** 業務日付 */
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
      };
      const response = await ScrCom0013DisplayComoditymanagementService(displayComoditymanagementServiceRequest);
      const searchResult = convertToSearchResultRowModel(response);

      setSearchResult(searchResult);

      // チェックAPI用のリストを作成
      const tempInfoList: any = [];
      searchResult.map((e) => {
        tempInfoList.push({
          serviceId: e.serviceId,
          serviceName: e.serviceName,
        })
      })
      setServiceInfo(tempInfoList);

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API(担当部門)
      const responsibleCategoryRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        codeId: 'CDE-COM-0013' //未定
      };
      const responsibleCategoryResponse = await ScrCom9999GetCodeManagementMasterListbox(responsibleCategoryRequest);


      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API(対象サービス)
      const targetServiceDivisionRequest: ScrCom9999GetCodeManagementMasterListboxRequest = {
        codeId: 'CDE-COM-0013' //未定
      };
      const targetServiceDivisionResponse = await ScrCom9999GetCodeManagementMasterListbox(targetServiceDivisionRequest);


      // API-COM-9999-0026: 変更予定日取得API
      const getChangeDateRequest: ScrCom9999GetChangeDateRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        screenId: '',
        tabId: 'SCR-COM-0013',
        getKeyValue: '',
      };
      const getChangeDateResponse = await ScrCom9999GetChangeDate(getChangeDateRequest);


      // 画面にデータを設定
      setSelectValues({
        // 担当部門
        responsibleCategoryValues: convertToCodeSelectValueModel(responsibleCategoryResponse.searchGetCodeManagementMasterListbox),
        // 対象サービス
        targetServiceDivisionValues: convertToCodeSelectValueModel(targetServiceDivisionResponse.searchGetCodeManagementMasterListbox),
        // 変更予約
        changeReservationInfoSelectValues: convertToChangeExpectDateSelectValueModel(getChangeDateResponse.changeExpectDateInfo)
      });
    };
    initialize();
  }, []);


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
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    // 現在のデータグリッドの行形式のまま1行追加する
    const copyContractRow: SearchResultRowModel[] = Object.assign([], searchResult);
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
  const handleIconOutputCsvClick = () => {
    // TODO：CSV機能実装後に変更
    alert('TODO:結果結果からCSVを出力する。');
  };


  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    // SCR-COM-9999-0025: 変更履歴情報取得API
    const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
      changeHistoryNumber: props.changeHisoryNumber,
    };
    const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(getHistoryInfoRequest);

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

      const errorMessages: errorMessagesModel[] = convertToErrorMessages(
        checkResult.errorList
      );

      setScrCom0032PopupData({
        errorMessages: errorMessages,
        warningMessages: convertToWarnMessages(
          checkResult.warnList
        ),
        contentsList: {
          screenName: '商品管理',
          screenId: 'SCR-COM-0013',
          tabName: 'サービス',
          tabId: '',
          sectionList: convertToSectionList(dirtyFields),
        },
        changeExpectDate: new Date(), // TODO:業務日付取得方法実装待ち、new Date()で登録
      });
    }
  }


  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = () => {
    setIsOpenPopup(false);
    setIsChangeHistoryBtn(false);

    // SCR-COM-0013-0008: サービス情報登録更新API
    const mergeServiceRequest: ScrCom0013MergeServiceRequest = {
      /** 変更履歴番号 */
      changeHistoryNumber: getValues('changeHistoryNumber'),
      /** サービス情報 */
      serviceInfo: searchResult,
      /** 申請従業員 */
      applicationEmployeeId: appContext.user,
      /**TODO: ↓ 渡し方不明 ↓ */
      /** 登録変更メモ */
      registrationChangeMemo: '',
      /** 第一承認者ID */
      firstApproverId: '',
      /** 第一承認者アドレス  */
      firstApproverMailAddress: '',
      /** 第二承認者ID */
      secondApproverId: '',
      /** 第三承認者ID */
      thirdApproverId: '',
      /** 第四承認者ID */
      fourthApproverId: '',
      /** 申請コメント */
      applicationComment: '',
      /** 変更予定日 */
      changeExpectDate: '',
    }
    ScrCom0013MergeService(mergeServiceRequest);
  };


  /**
  * ポップアップのキャンセルボタンクリック時のイベントハンドラ
  */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
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
                {/* TODO：エクスポートアイコンに将来的に変更 */}
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                {/* 履歴表示の際追加ボタンは非活性 */}
                <AddButton
                  onClick={handleIconAddClick}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >追加
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              pagination={true}
              width={1200}
              columns={searchResultColumns}
              rows={searchResult}
            // TODO: 履歴表示の場合にどのカラムを非活性にするか指定する(入力部分全て)
            // getCellDisabled={(params) => {
            //   if (params.field === 'input' && params.id === 0) return true;
            //   if (params.field === 'select' && params.id === 1) return true;
            //   if (params.field === 'radio' && params.id === 2) return true;
            //   if (params.field === 'checkbox' && params.id === 3) return true;
            //   if (params.field === 'datepicker' && params.id === 4) return true;
            //   return false
            // }}
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
            >確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      < ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />

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
  )
}
export default ScrCom0013ServiceTab;
