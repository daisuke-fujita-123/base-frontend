import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';

import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032Popup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

import { AddButton, CancelButton, ConfirmButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { Radio } from 'controls/Radio';
import { TableRowModel } from 'controls/Table';
import { TextField } from 'controls/TextField';

import {
  checkMasterPermission,
  getMaster,
  getMasterPermission,
  getMasterPermissionOrganization,
  registMasterPermission,
  ScrCom0028GetMasterPermissionOrganizationRequest,
  ScrCom0028GetMasterPermissionOrganizationResponse,
  ScrCom0028GetMasterPermissionRequest,
  ScrCom0028GetMasterPermissionResponse,
  ScrCom0028GetMasterResponse,
  ScrCom0028InputCheckMasterPermissionRequest,
  ScrCom0028RegistMasterPermissionRequest,
} from 'apis/com/ScrCom0028Api';
import {
  ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoRequest,
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

import yup from 'utils/validation/ValidationDefinition';

/**
 * マスタ権限データモデル
 */
interface SearchMasterResultRowModel {
  // マスタ権限ID
  masterPermissionId: string;
  // 業務日付
  businessDate: Date;
}

/**
 * マスタ権限データモデル
 */
const initialValues: SearchMasterResultRowModel = {
  // マスタ権限ID
  masterPermissionId: '',
  // 業務日付
  businessDate: new Date(),
};

/**
 * 検索結果行データモデル
 */
interface MasterResultModel {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // ラジオボタン値
  radioValues: number;
  // 設定役職数
  totalSettingPost: number;
  // リスト
  masterInfoList: MasterInfoList[];
}

interface MasterInfoList {
  // 項目ID
  id: string;
  // マスタID
  masterId: string;
  // マスタ名
  masterName: string;
  // 編集権限
  masterEditFlag?: boolean;
  // ラジオボタン値
  radioValues: number;
}

interface MasterPermissionModel {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // ラジオボタン値
  radioValues: number;
  // 設定役職数
  totalSettingPost: number;
}

interface MasterOrgModel {
  // 項目ID
  id: string;
  // マスタID
  masterId: string;
  // マスタ名
  masterName: string;
  // 編集権限
  masterEditFlag?: boolean;
  // ラジオボタン値
  radioValues: number;
}

/**
 * 検索結果行データモデル
 */
interface MasterOrgResultModel {
  // マスタ権限リスト
  masterPermissionList: MasterPermissionModel[];
  // マスタ情報リスト
  masterInfoList: MasterOrgModel[];
}

interface MasterPermissionOrgList {
  // マスタ権限ID
  masterPermissionId: string;
}

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: 'マスタ権限詳細',
    fields: [
      'screenPermissionId',
      'screenPermissionName',
      'businessDate',
      'masterIdList',
    ],
  },
];

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'masterId',
    headerName: 'マスタID',
    size: 'm',
  },
  {
    field: 'masterName',
    headerName: 'マスタ名称',
    size: 'l',
  },
  {
    field: 'radioValues',
    headerName: '編集有無',
    size: 'l',
    cellType: 'radio',
    radioValues: [
      { value: 0, displayValue: '参照' },
      { value: 1, displayValue: '編集' },
    ],
  },
];

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  changedSections: [],
  errorMessages: [],
  warningMessages: [],
};

/**
 * マスタ権限スキーマ
 */
const masterPermissionSchama = {
  masterPermissionName: yup
    .string()
    .label('権限名')
    .max(30)
    .fullAndHalfWidth()
    .required(),
  masterId: yup.string().label('マスタID').max(12).halfWidthOnly(),
  masterName: yup.string().label('マスタ名称').max(30).fullAndHalfWidth(),
};

// API-COM-0028-0001: マスタ権限一覧取得API データモデルへ変換処理
const convertToMasterModel = (
  master: ScrCom0028GetMasterPermissionResponse
): MasterResultModel => {
  return {
    masterPermissionId: master.masterPermissionId,
    masterPermissionName: master.masterPermissionName,
    useFlag: master.useFlag,
    radioValues: master.useFlag === true ? 0 : master.useFlag === false ? 1 : 0,
    totalSettingPost: master.totalSettingPost,
    masterInfoList: convertMasterListModel(master),
  };
};

const convertMasterListModel = (
  req: ScrCom0028GetMasterPermissionResponse
): MasterInfoList[] => {
  return req.masterInfoList.map((x) => {
    return {
      id: x.masterId,
      masterId: x.masterId,
      masterName: x.masterName,
      masterEditFlag: x.masterEditFlag,
      radioValues:
        x.masterEditFlag === true ? 0 : x.masterEditFlag === false ? 1 : 0,
    };
  });
};

// API-COM-0028-0002: マスタ一覧取得API データモデルへ変換処理
const convertToNewMasterModel = (
  master: ScrCom0028GetMasterResponse
): MasterInfoList[] => {
  return master.masterInfoList.map((x) => {
    return {
      id: x.masterId,
      masterId: x.masterId,
      masterName: x.masterName,
      masterEditFlag: false,
      radioValues:
        x.masterEditFlag === true ? 0 : x.masterEditFlag === false ? 1 : 0,
    };
  });
};

// API-COM-0028-0006: マスタ権限一覧取得API（組織管理画面から遷移）  データモデルへ変換処理
const convertToMasterOrgModel = (
  masterOrg: ScrCom0028GetMasterPermissionOrganizationResponse
): MasterOrgResultModel => {
  return {
    masterInfoList: convertMasterList(masterOrg),
    masterPermissionList: convertMasterPermissionList(masterOrg),
  };
};

const convertMasterList = (
  master: ScrCom0028GetMasterPermissionOrganizationResponse
): MasterOrgModel[] => {
  return master.masterInfoList.map((x) => {
    return {
      id: x.masterId,
      masterId: x.masterId,
      masterName: x.masterName,
      masterEditFlag: x.masterEditFlag,
      radioValues:
        x.masterEditFlag === true ? 0 : x.masterEditFlag === false ? 1 : 0,
    };
  });
};

const convertMasterPermissionList = (
  masterPermission: ScrCom0028GetMasterPermissionOrganizationResponse
): MasterPermissionModel[] => {
  return masterPermission.masterPermissionList.map((x) => {
    return {
      masterPermissionId: x.masterPermissionId,
      masterPermissionName: x.masterPermissionName,
      useFlag: x.useFlag,
      radioValues: x.useFlag === true ? 0 : x.useFlag === false ? 1 : 0,
      totalSettingPost: x.totalSettingPost,
    };
  });
};

// API-COM-0028-0004: マスタ権限登録API データモデルへ変換処理
const convertFromMasterPermissionModel = (
  masterPermission: MasterPermissionModel,
  master: MasterInfoList[],
  user: string
): ScrCom0028RegistMasterPermissionRequest => {
  return {
    masterPermissionId: masterPermission.masterPermissionId,
    masterPermissionName: masterPermission.masterPermissionName,
    useFlag:
      masterPermission.radioValues === 0
        ? true
        : masterPermission.radioValues === 1
        ? false
        : masterPermission.useFlag,
    masterIdList: master.map((x) => {
      return {
        masterId: x.masterId,
      };
    }), // TODO: 編集権限取得方法不明なため、アーキチーム回答後に実装変更予定
    applicationEmployeeId: user,
    screenId: 'SCR-COM-0028',
    registrationChangeMemo: '', // TODO: 登録内容申請ポップアップから取得のため、実装後に対応
  };
};

/**
 * SCR-COM-0028 マスタ権限詳細画面
 */
const ScrCom0028Page = () => {
  // route
  const { masterPermissionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // user情報(businessDateも併せて取得予定)
  const { appContext } = useContext(AppContext);

  // state
  const [masterResult, setMasterResult] = useState<MasterInfoList[]>([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<any>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      useFlag: 1,
    },
    resolver: yupResolver(yup.object(masterPermissionSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    getValues,
    setValue,
    reset,
  } = methods;

  // 項目の活性化・非活性化を判定するフラグ
  const [activeFlag, setActiveFlag] = useState(false);
  // TODO: 編集権限取得方法未実装のため、ログインユーザー編集権限有無による活性化フラグは実装後に対応

  // ラジオボタン設定値
  const radioValues = [
    { value: 0, displayValue: '可' },
    { value: 1, displayValue: '不可' },
  ];

  /**
   * 初期画面表示時に処理結果一覧検索処理を実行
   */
  useEffect(() => {
    // 初期表示（アクセス権限管理画面から遷移
    const initialize = async (masterPermissionId: string) => {
      //  確定ボタン活性
      setActiveFlag(false);

      //  API-COM-0028-0001: マスタ権限一覧取得API
      const masterRequest: ScrCom0028GetMasterPermissionRequest = {
        // マスタ権限ID
        masterPermissionId: masterPermissionId,
        // 業務日付
        businessDate: new Date(), // TODO:業務日付の実装待ち
      };
      const masterResponse = await getMasterPermission(masterRequest);
      const masterResult = convertToMasterModel(masterResponse);

      // 画面にデータを設定
      setValue('masterPermissionId', masterResult.masterPermissionId);
      setValue('masterPermissionName', masterResult.masterPermissionName);
      setValue('totalSettingPost', masterResult.totalSettingPost);
      setValue(
        'useFlag',
        masterResult.useFlag === true
          ? 0
          : masterResult.useFlag === false
          ? 1
          : 0
      );
      // データグリッドにデータを設定
      setMasterResult(masterResult.masterInfoList);
    };

    // 初期表示（組織管理画面から遷移）
    const initializeOrg = async (
      masterPermissionId: MasterPermissionOrgList[]
    ) => {
      //  確定ボタン:非活性
      setActiveFlag(true);

      // API-COM-0028-0006: マスタ権限一覧取得API（組織管理画面から遷移）
      const masterOrgRequest: ScrCom0028GetMasterPermissionOrganizationRequest =
        {
          // マスタ権限ID
          masterPermissionList: masterPermissionId,
          // 業務日付
          businessDate: new Date(), // TODO:業務日付の実装待ち
        };
      const masterOrgResponse = await getMasterPermissionOrganization(
        masterOrgRequest
      );
      const masterOrgResult = convertToMasterOrgModel(masterOrgResponse);

      let permissionId = undefined;
      let permissionName = undefined;
      let tFlag = undefined;
      let fFlag = undefined;

      for (const val of masterOrgResult.masterPermissionList) {
        permissionId = permissionId + ', ' + val.masterPermissionId;
        permissionName = permissionName + '、 ' + val.masterPermissionName;

        // 利用フラグに可、不可の両方が含まれているかチェック
        if (val.useFlag === true) {
          tFlag = 'true';
        } else if (val.useFlag === false) {
          fFlag = 'true';
        }
      }

      // 画面にデータを設定
      setValue('masterPermissionId', permissionId);
      setValue('masterPermissionName', permissionName);
      setValue(
        'useFlag',
        tFlag === undefined
          ? 1
          : fFlag === undefined
          ? 0
          : tFlag !== undefined && fFlag !== undefined
          ? 0
          : 0
      );
      setValue(
        'totalSettingPost',
        masterOrgResult.masterPermissionList[0].totalSettingPost
      );

      // データグリッドにデータを設定
      setMasterResult(masterOrgResult.masterInfoList);
    };

    // 初期表示処理(履歴表示)
    const initializeHistory = async (changeHistoryNumber: string) => {
      //  確定ボタン:非活性
      setActiveFlag(false);

      // SCR-COM-9999-0025: 変更履歴情報取得API
      const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
        changeHistoryNumber: changeHistoryNumber,
      };
      const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(
        getHistoryInfoRequest
      );

      // 画面にデータを設定
      reset(getHistoryInfoResponse);
    };

    // 初期表示(新規追加)
    const initializeNew = async () => {
      //  確定ボタン:非活性
      setActiveFlag(false);

      // API-COM-0028-0002: マスタ一覧取得API
      const newMasterResponse = await getMaster(undefined);
      const newMasterResult = convertToNewMasterModel(newMasterResponse);

      // 画面にデータを設定
      setValue('useFlag', 0);
      setValue('totalSettingPost', undefined);
      // データグリッドにデータを設定
      setMasterResult(newMasterResult);
    };

    // 新規追加の初期化処理
    if (masterPermissionId === undefined || masterPermissionId === 'new') {
      initializeNew();
      return;
    }

    // 初期表示処理（アクセス権限管理画面から遷移）
    if (
      masterPermissionId !== null &&
      masterPermissionId !== undefined &&
      typeof masterPermissionId === 'string'
    ) {
      initialize(masterPermissionId);
      return;
    }

    // 初期表示処理（組織管理画面から遷移）
    if (
      masterPermissionId !== null &&
      masterPermissionId !== undefined &&
      typeof masterPermissionId !== 'string'
    ) {
      initializeOrg(masterPermissionId);
      return;
    }

    // 履歴表示の初期化処理
    const changeHistoryNumber = searchParams.get('change-history-number');
    if (changeHistoryNumber !== undefined && changeHistoryNumber !== null) {
      initializeHistory(changeHistoryNumber);
    }
  }, [masterPermissionId, searchParams, setValue, reset]);

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    // TODO：CSV機能実装後に変更
    alert('TODO:結果からCSVを出力する。');
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
    // API-COM-0028-0003: マスタ権限詳細情報入力チェックAPI
    const masterCheckRequest: ScrCom0028InputCheckMasterPermissionRequest = {
      // マスタ権限ID
      masterPermissionId: getValues('masterPermissionId'),
      // マスタ権限名
      masterPermissionName: getValues('masterPermissionName'),
      // 業務日付
      businessDate: new Date(), // TODO: 業務日付取得機能実装後に変更
      // マスタID一覧
      masterIdList: masterResult.map((x) => {
        return {
          masterId: x.masterId,
        };
      }),
    };
    const checkResult = await checkMasterPermission(masterCheckRequest);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorMessages: checkResult.errorMessages,
      warningMessages: checkResult.warningMessages,
      changedSections: convertToChngedSections(dirtyFields),
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/permissions/master/:' + masterPermissionId);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async () => {
    setIsOpenPopup(false);

    // API-COM-0028-0004: マスタ権限登録API
    const request = convertFromMasterPermissionModel(
      getValues(),
      masterResult,
      appContext.user
    );
    await registMasterPermission(request);
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
          <FormProvider {...methods}>
            {/* マスタ権限詳細画面 */}
            <Section
              name='マスタ権限詳細'
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  {/* TODO：エクスポートアイコンに将来的に変更 */}
                  <AddButton onClick={handleIconOutputCsvClick}>
                    CSV出力
                  </AddButton>
                </MarginBox>
              }
            >
              <RowStack>
                <ColStack>
                  <TextField
                    label='権限ID'
                    name='masterPermissionId'
                    readonly
                    size='s'
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='権限名'
                    name='masterPermissionName'
                    size='m'
                    required
                  />
                </ColStack>
                <ColStack>
                  <Radio
                    label='利用フラグ'
                    name='useFlag'
                    size='s'
                    radioValues={radioValues}
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='設定役職数'
                    name='totalSettingPost'
                    readonly
                    size='s'
                  />
                </ColStack>
              </RowStack>
              <MarginBox mb={6}> </MarginBox>
              <DataGrid
                columns={searchResultColumns}
                rows={masterResult}
                pageSize={100}
              />
            </Section>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={handleConfirm} disable={activeFlag}>
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      <ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  );
};

export default ScrCom0028Page;
