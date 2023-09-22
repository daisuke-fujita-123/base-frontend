import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

import { AddButton, CancelButton, ConfirmButton } from 'controls/Button';
import { DataGrid, exportCsv, GridColDef } from 'controls/Datagrid';
import { Radio } from 'controls/Radio';
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
  ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoResponse,
} from 'apis/com/ScrCom0028Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 検索結果行データモデル
 */
interface MasterResultModel {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: string;
  // 設定役職数
  totalSettingPost: number | string;
  // リスト
  masterInfoList: MasterInfoList[];
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectDate: string;
}

interface MasterInfoList {
  // 項目ID
  id: string;
  // マスタID
  masterId: string;
  // マスタ名
  masterName: string;
  // 編集権限
  masterEditFlag: string;
}

/**
 * マスタ権限データモデル
 */
const initialValues: MasterResultModel = {
  // マスタ権限ID
  masterPermissionId: '',
  // マスタ権限名
  masterPermissionName: '',
  // 利用フラグ
  useFlag: '',
  // 設定役職数
  totalSettingPost: 0,
  // リスト
  masterInfoList: [],
  // 変更履歴番号
  changeHistoryNumber: '',
  // 変更予定日
  changeExpectDate: '',
};

interface MasterPermissionModel {
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 利用フラグ
  useFlag: string;
  // 設定役職数
  totalSettingPost: string | number;
}

interface MasterOrgModel {
  // 項目ID
  id: string;
  // マスタID
  masterId: string;
  // マスタ名
  masterName: string;
  // 編集権限
  masterEditFlag: string;
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

interface MasterIdList {
  // マスタID
  masterId: string;
}

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: 'マスタ権限詳細',
    fields: [
      'masterPermissionId',
      'masterPermissionName',
      'useFlag',
      'totalSettingPost',
      'masterId',
      'masterName',
      'masterEditFlag',
    ],
    name: [
      '権限ID',
      '権限名',
      '利用フラグ',
      '設定役職数',
      'マスタID',
      'マスタ名称',
      '編集有無',
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
    width: 400,
  },
  {
    field: 'masterEditFlag',
    headerName: '編集有無',
    size: 'm',
    cellType: 'radio',
    radioValues: [
      { value: 'true', displayValue: '可' },
      { value: 'false', displayValue: '不可' },
    ],
  },
];

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  // 登録・変更内容リスト
  registrationChangeList: [],
  errorList: [],
  warningList: [],
  changeExpectDate: '',
};

/**
 * マスタ権限スキーマ
 */
const masterPermissionSchama = {
  masterPermissionName: yup.string().label('権限名').max(30).required(),
};

// API-COM-0028-0001: マスタ権限一覧取得API データモデルへ変換処理
const convertToMasterModel = (
  master: ScrCom0028GetMasterPermissionResponse
): MasterResultModel => {
  return {
    masterPermissionId: master.masterPermissionId,
    masterPermissionName: master.masterPermissionName,
    useFlag: master.useFlag === true ? 'true' : 'false',
    totalSettingPost: master.totalSettingPost,
    masterInfoList: convertMasterListModel(master),
    changeHistoryNumber: '',
    changeExpectDate: '',
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
      masterEditFlag: x.masterEditFlag === true ? 'true' : 'false',
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
      masterEditFlag: 'false',
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
      masterEditFlag: x.masterEditFlag === true ? 'true' : 'false',
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
      useFlag: x.useFlag === true ? 'true' : 'false',
      totalSettingPost: x.totalSettingPost,
    };
  });
};

// API-COM-0028-0004: マスタ権限登録API データモデルへ変換処理
const convertFromMasterPermissionModel = (
  masterPermission: MasterResultModel,
  user: string,
  IdList: MasterIdList[],
  registrationChangeMemo: string,
  businessDate: string
): ScrCom0028RegistMasterPermissionRequest => {
  return {
    masterPermissionId: masterPermission.masterPermissionId,
    masterPermissionName: masterPermission.masterPermissionName,
    useFlag: masterPermission.useFlag === 'true' ? true : false,
    masterIdList: IdList,
    applicationEmployeeId: user,
    screenId: 'SCR-COM-0028',
    registrationChangeMemo: registrationChangeMemo,
    businessDate: businessDate,
  };
};

// 履歴表示データ変換処理
const convertToHistoryInfo = (
  master: ScrCom9999GetHistoryInfoResponse,
  changeHistoryNumber: string
): MasterResultModel => {
  return {
    masterPermissionId: master.masterPermissionId,
    masterPermissionName: master.masterPermissionName,
    useFlag: master.useFlag === true ? 'true' : 'false',
    totalSettingPost: master.totalSettingPost,
    masterInfoList: convertMasterListModel(master),
    changeHistoryNumber: changeHistoryNumber,
    changeExpectDate: '',
  };
};

/**
 * SCR-COM-0028 マスタ権限詳細画面
 */
const ScrCom0028Page = () => {
  // route
  const { masterPermissionId } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  // user情報
  const { user } = useContext(AuthContext);

  // state
  const [masterResult, setMasterResult] = useState<MasterInfoList[]>([]);
  const [initMasterResult, setInitMasterResult] = useState<MasterInfoList[]>(
    []
  );
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const apiRef = useGridApiRef();

  // キャンセルボタンの活性化・非活性化を判定するフラグ
  const [canelFlag, setCanelFlag] = useState(false);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<MasterResultModel>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(masterPermissionSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields, errors },
    getValues,
    setValue,
    reset,
  } = methods;

  // 編集権限_disable設定
  const setDisableFlg = user.editPossibleScreenIdList.filter((x) => {
    return x.includes('SCR-COM-0028');
  });
  const disableFlg = setDisableFlg[0] === 'SCR-COM-0028' ? false : true;

  // ラジオボタン設定値
  const radioValues = [
    { value: 'true', displayValue: '可' },
    { value: 'false', displayValue: '不可' },
  ];

  /**
   * 初期画面表示時に処理結果一覧検索処理を実行
   */
  useEffect(() => {
    // 初期表示（アクセス権限管理画面から遷移
    const initialize = async (masterPermissionId: string) => {
      //  API-COM-0028-0001: マスタ権限一覧取得API
      const masterRequest: ScrCom0028GetMasterPermissionRequest = {
        // マスタ権限ID
        masterPermissionId: masterPermissionId,
        // 業務日付
        businessDate: user.taskDate,
      };
      const masterResponse = await getMasterPermission(masterRequest);
      const masterResult = convertToMasterModel(masterResponse);

      // 初期値情報格納
      if (initMasterResult.length === 0) {
        setInitMasterResult(masterResult.masterInfoList);
      }

      // 画面にデータを設定
      setValue('masterPermissionId', masterResult.masterPermissionId);
      setValue('masterPermissionName', masterResult.masterPermissionName);
      setValue('totalSettingPost', masterResult.totalSettingPost);
      setValue('useFlag', masterResult.useFlag);
      // データグリッドにデータを設定
      setMasterResult(masterResult.masterInfoList);
    };

    // 初期表示（組織管理画面から遷移）
    const initializeOrg = async (
      masterPermissionId: MasterPermissionOrgList[]
    ) => {
      // キャンセルボタン非活性
      setCanelFlag(true);

      // API-COM-0028-0006: マスタ権限一覧取得API（組織管理画面から遷移）
      const masterOrgRequest: ScrCom0028GetMasterPermissionOrganizationRequest =
        {
          // マスタ権限ID
          masterPermissionList: masterPermissionId,
          // 業務日付
          businessDate: user.taskDate,
        };
      const masterOrgResponse = await getMasterPermissionOrganization(
        masterOrgRequest
      );
      const masterOrgResult = convertToMasterOrgModel(masterOrgResponse);

      let permissionId = '';
      let permissionName = '';
      let tFlag = undefined;
      let fFlag = undefined;

      for (const val of masterOrgResult.masterPermissionList) {
        permissionId = permissionId + ', ' + val.masterPermissionId;
        permissionName = permissionName + '、 ' + val.masterPermissionName;

        // 利用フラグに可、不可の両方が含まれているかチェック
        if (val.useFlag === 'true') {
          tFlag = 'true';
        } else if (val.useFlag === 'false') {
          fFlag = 'true';
        }
      }

      // 画面にデータを設定
      setValue('masterPermissionId', permissionId);
      setValue('masterPermissionName', permissionName);
      setValue(
        'useFlag',
        tFlag === undefined
          ? 'false'
          : fFlag === undefined
          ? 'true'
          : tFlag !== undefined && fFlag !== undefined
          ? 'true'
          : 'true'
      );
      setValue(
        'totalSettingPost',
        masterOrgResult.masterPermissionList[0].totalSettingPost
      );

      // 初期値情報格納
      if (initMasterResult.length === 0) {
        setInitMasterResult(masterOrgResult.masterInfoList);
      }

      // データグリッドにデータを設定
      setMasterResult(masterOrgResult.masterInfoList);
    };

    // 初期表示処理(履歴表示)
    const historyInfoInitialize = async (changeHistoryNumber: string) => {
      // キャンセルボタン非活性
      setCanelFlag(true);

      // 変更履歴情報取得API
      const getHistoryInfoRequest = {
        changeHistoryNumber: changeHistoryNumber,
      };
      const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(
        getHistoryInfoRequest
      );
      const historyInfo = convertToHistoryInfo(
        getHistoryInfoResponse,
        changeHistoryNumber
      );

      // 画面にデータを設定
      reset(historyInfo);

      // 初期値情報格納
      if (initMasterResult.length === 0) {
        setInitMasterResult(historyInfo.masterInfoList);
      }

      // データグリッドにデータを設定
      setMasterResult(historyInfo.masterInfoList);
    };

    // 初期表示(新規追加)
    const initializeNew = async () => {
      // API-COM-0028-0002: マスタ一覧取得API
      const newMasterResponse = await getMaster(undefined);
      const newMasterResult = convertToNewMasterModel(newMasterResponse);

      // 画面にデータを設定
      setValue('useFlag', 'true');
      setValue('totalSettingPost', '-');
      // データグリッドにデータを設定
      setMasterResult(newMasterResult);
    };

    // 履歴表示の初期化処理
    if (applicationId !== null) {
      historyInfoInitialize(applicationId);
    }

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
  }, [
    masterPermissionId,
    searchParams,
    applicationId,
    user.taskDate,
    setValue,
    reset,
    setCanelFlag,
    initMasterResult.length,
  ]);

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const min = d.getMinutes();
    exportCsv(
      'マスタ権限詳細_' +
        user.employeeId +
        '_' +
        year.toString() +
        (month < 10 ? '0' : '') +
        month.toString() +
        (day < 10 ? '0' : '') +
        day.toString() +
        hours.toString() +
        min.toString() +
        '.csv',
      apiRef
    );
  };

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToChngedSections = (
    dirtyFields: object,
    masterResult: MasterInfoList[],
    initMasterResult: MasterInfoList[]
  ): sectionList[] => {
    const fields = Object.keys(dirtyFields);

    masterResult.map((x, i) => {
      if (
        x.masterEditFlag !== initMasterResult[i].masterEditFlag &&
        !fields.includes('masterEditFlag')
      ) {
        fields.push('masterEditFlag');
      }
    });

    const changedSections: sectionList[] = [];
    const columnList: columnList[] = [];
    sectionDef.forEach((d) => {
      fields.forEach((f) => {
        if (d.fields.includes(f)) {
          columnList.push({ columnName: d.name[d.fields.indexOf(f)] });
        }
      });
      changedSections.push({
        sectionName: d.section,
        columnList: columnList,
      });
    });
    return changedSections;
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    if (Object.keys(errors).length) return;
    // 編集権限が編集のマスタIDのみのリスト作成
    const idList: MasterIdList[] = [];
    masterResult.forEach((x, i) => {
      if (x.masterEditFlag !== initMasterResult[i].masterEditFlag) {
        if (x.masterEditFlag === 'true') {
          idList.push({
            masterId: x.masterId,
          });
        }
      }
    });
    // API-COM-0028-0003: マスタ権限詳細情報入力チェックAPI
    const masterCheckRequest: ScrCom0028InputCheckMasterPermissionRequest = {
      // マスタ権限ID
      masterPermissionId: getValues('masterPermissionId'),
      // マスタ権限名
      masterPermissionName: getValues('masterPermissionName'),
      // 業務日付
      businessDate: user.taskDate,
      // マスタID一覧
      masterIdList: idList,
    };
    const checkResult = await checkMasterPermission(masterCheckRequest);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: checkResult.errorList,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-COM-0028',
          screenName: 'マスタ権限詳細',
          tabId: 0,
          tabName: '',
          sectionList: convertToChngedSections(
            dirtyFields,
            masterResult,
            initMasterResult
          ),
        },
      ],
      changeExpectDate: getValues('changeExpectDate'),
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/permissions/master/' + masterPermissionId);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setIsOpenPopup(false);

    // 編集権限が編集のマスタIDのみのリスト作成
    const idList: MasterIdList[] = [];
    masterResult.forEach((x, i) => {
      if (x.masterEditFlag !== initMasterResult[i].masterEditFlag) {
        if (x.masterEditFlag === 'true') {
          idList.push({
            masterId: x.masterId,
          });
        }
      }
    });

    // API-COM-0028-0004: マスタ権限登録API
    const request = convertFromMasterPermissionModel(
      getValues(),
      user.employeeId,
      idList,
      registrationChangeMemo,
      user.taskDate
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
                  <AddButton onClick={handleIconOutputCsvClick}>
                    CSV出力
                  </AddButton>
                </MarginBox>
              }
              fitInside
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
                    disabled={disableFlg}
                    required
                  />
                </ColStack>
                <ColStack>
                  <Radio
                    label='利用フラグ'
                    name='useFlag'
                    size='s'
                    disabled={disableFlg}
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
                disabled={disableFlg}
                apiRef={apiRef}
              />
            </Section>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel} disable={canelFlag}>
              キャンセル
            </CancelButton>
            <ConfirmButton onClick={handleConfirm} disable={disableFlg}>
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
          handleRegistConfirm={handlePopupConfirm}
          handleApprovalConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      )}
    </>
  );
};

export default ScrCom0028Page;
