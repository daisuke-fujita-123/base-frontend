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
  checkScreenPermission,
  getScreen,
  getScreenPermission,
  getScreenPermissionOrganization,
  registScreenPermission,
  ScrCom0027GetScreenPermissionOrganizationRequest,
  ScrCom0027GetScreenPermissionOrganizationResponse,
  ScrCom0027GetScreenPermissionRequest,
  ScrCom0027GetScreenPermissionResponse,
  ScrCom0027GetScreenResponse,
  ScrCom0027InputCheckScreenPermissionRequest,
  ScrCom0027RegistScreenPermissionRequest,
  ScrCom9999GetHistoryInfo,
  ScreenPermissionOrgList,
} from 'apis/com/ScrCom0027Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

/**
 * 検索結果行データモデル
 */
interface ScreenResultModel {
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 利用フラグ
  useFlag: string;
  // 設定役職数
  totalSettingPost: number | string;
  // リスト
  screenList: ScreenModel[];
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectDate: string;
}

/**
 * 画面権限データモデル
 */
const initialValues: ScreenResultModel = {
  // 画面権限ID
  screenPermissionId: '',
  // 画面権限名
  screenPermissionName: '',
  // 利用フラグ
  useFlag: '',
  // 設定役職数
  totalSettingPost: 0,
  // リスト
  screenList: [],
  // 変更履歴番号
  changeHistoryNumber: '',
  // 変更予定日
  changeExpectDate: '',
};

interface ScreenPermissionModel {
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
}

interface ScreenModel {
  // 項目ID
  id: string;
  // 画面ID
  screenId: string;
  // 画面名
  screenName: string;
  // 編集権限
  editPermission: number;
}

/**
 * 検索結果行データモデル
 */
interface ScreenOrgResultModel {
  // 画面権限リスト
  screenPermissionList: ScreenPermissionModel[];
  // 画面リスト
  screenList: ScreenModel[];
}

interface ScreenIdList {
  // 画面ID
  screenId: string;
}

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '画面権限詳細',
    fields: [
      'screenPermissionId',
      'screenPermissionName',
      'useFlag',
      'totalSettingPost',
      'screenId',
      'screenName',
      'editPermission',
    ],
    name: [
      '権限ID',
      '権限名',
      '利用フラグ',
      '設定役職数',
      '画面ID',
      '画面名',
      '編集権限',
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
 * 画面権限スキーマ
 */
const screenPermissionSchama = {
  screenPermissionId: yup.string().label('権限ID').max(6).half(),
  screenPermissionName: yup.string().label('権限名').max(30).required(),
  totalSettingPost: yup.number().label('設定役職数').max(3),
  screenId: yup.string().label('画面ID').max(12).half(),
  screenName: yup.string().label('画面名').max(30),
};

// API-COM-0027-0001：画面権限一覧情報取得API データモデルへ変換処理
const convertToScreenModel = (
  screen: ScrCom0027GetScreenPermissionResponse
): ScreenResultModel => {
  return {
    screenPermissionId: screen.screenPermissionId,
    screenPermissionName: screen.screenPermissionName,
    useFlag: screen.useFlag === true ? 'true' : 'false',
    totalSettingPost: screen.totalSettingPost,
    screenList: convertScreenListModel(screen),
    changeHistoryNumber: '',
    changeExpectDate: '',
  };
};

const convertScreenListModel = (
  req: ScrCom0027GetScreenPermissionResponse
): ScreenModel[] => {
  return req.screenList.map((x) => {
    return {
      id: x.screenId,
      screenId: x.screenId,
      screenName: x.screenName,
      editPermission: x.editPermission === true ? 1 : 2,
    };
  });
};

// API-COM-0027-0002：画面一覧情報取得API データモデルへ変換処理
const convertToNewScreenModel = (
  screen: ScrCom0027GetScreenResponse
): ScreenModel[] => {
  return screen.screenList.map((x) => {
    return {
      id: x.screenId,
      screenId: x.screenId,
      screenName: x.screenName,
      editPermission: 1,
    };
  });
};

// API-COM-0027-0006：画面権限一覧情報取得API(組織管理画面から遷移）  データモデルへ変換処理
const convertToScreenOrgModel = (
  screenOrg: ScrCom0027GetScreenPermissionOrganizationResponse
): ScreenOrgResultModel => {
  return {
    screenList: convertScreenList(screenOrg),
    screenPermissionList: convertScreenPermissionList(screenOrg),
  };
};

const convertScreenList = (
  screen: ScrCom0027GetScreenPermissionOrganizationResponse
): ScreenModel[] => {
  return screen.screenList.map((x) => {
    return {
      id: x.screenId,
      screenId: x.screenId,
      screenName: x.screenName,
      editPermission: x.editPermission === true ? 1 : 2,
    };
  });
};

const convertScreenPermissionList = (
  screenPermission: ScrCom0027GetScreenPermissionOrganizationResponse
): ScreenPermissionModel[] => {
  return screenPermission.screenPermissionList.map((x) => {
    return {
      screenPermissionId: x.screenPermissionId,
      screenPermissionName: x.screenPermissionName,
      useFlag: x.useFlag,
      totalSettingPost: x.totalSettingPost,
    };
  });
};

// API-COM-0027-0004: 画面権限登録API データモデルへ変換処理
const convertFromScreenPermissionModel = (
  screenPermission: ScreenResultModel,
  user: string,
  idList: ScreenIdList[],
  registrationChangeMemo: string
): ScrCom0027RegistScreenPermissionRequest => {
  return {
    screenPermissionId: screenPermission.screenPermissionId,
    screenPermissionName: screenPermission.screenPermissionName,
    useFlag: screenPermission.useFlag === 'true' ? true : false,
    screenIdList: idList,
    applicationEmployeeId: user,
    screenId: 'SCR-COM-0027',
    registrationChangeMemo: registrationChangeMemo,
  };
};

const convertToHistoryInfo = (
  screen: ScrCom0027GetScreenPermissionResponse,
  changeHistoryNumber: string
): ScreenResultModel => {
  return {
    screenPermissionId: screen.screenPermissionId,
    screenPermissionName: screen.screenPermissionName,
    useFlag: screen.useFlag === true ? 'true' : 'false',
    totalSettingPost: screen.totalSettingPost,
    screenList: convertScreenListModel(screen),
    changeHistoryNumber: changeHistoryNumber,
    changeExpectDate: '',
  };
};

/**
 * SCR-COM-0027 画面権限詳細画面
 */
const ScrCom0027Page = () => {
  // route
  const { screenPermissionId } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  // user情報
  const { user } = useContext(AuthContext);
  // 編集権限_disable設定
  const setDisableFlg = user.editPossibleScreenIdList.filter((x) => {
    return x.includes('SCR-COM-0027');
  });
  const disableFlg = setDisableFlg[0] === 'SCR-COM-0027' ? false : true;

  // state
  const [screenResult, setScreenResult] = useState<ScreenModel[]>([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<ScreenResultModel>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(screenPermissionSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    getValues,
    setValue,
    reset,
  } = methods;

  // ラジオボタン（利用フラグ）
  const flagRadiovalues = [
    {
      value: 'true',
      displayValue: '可',
    },
    {
      value: 'false',
      displayValue: '不可',
    },
  ];

  const editRadioValues = [
    { value: 1, displayValue: '参照' },
    { value: 2, displayValue: '編集' },
  ];

  /**
   * 検索条件列定義
   */
  const searchResultColumns: GridColDef[] = [
    {
      field: 'screenId',
      headerName: '画面ID',
      size: 'm',
    },
    {
      field: 'screenName',
      headerName: '画面名',
      size: 'l',
    },
    {
      field: 'editPermission',
      headerName: '編集権限',
      size: 'l',
      cellType: 'radio',
      radioValues: editRadioValues,
    },
  ];

  /**
   * 初期画面表示時に処理結果一覧検索処理を実行
   */
  useEffect(() => {
    // 初期表示（アクセス権限管理画面から遷移
    const initialize = async (screenPermissionId: string) => {
      // API-COM-0027-0001：画面権限一覧情報取得API
      const screenRequest: ScrCom0027GetScreenPermissionRequest = {
        // 画面権限ID
        screenPermissionId: screenPermissionId,
        // 業務日付
        businessDate: user.taskDate,
      };
      const screenResponse = await getScreenPermission(screenRequest);
      const screenResult = convertToScreenModel(screenResponse);

      // 画面にデータを設定
      reset(screenResult);
      // データグリッドにデータを設定
      setScreenResult(screenResult.screenList);
    };

    // 初期表示（組織管理画面から遷移）
    const initializeOrg = async (
      screenPermissionId: ScreenPermissionOrgList[]
    ) => {
      // API-COM-0027-0006: 画面権限一覧情報取得API（組織管理画面からの遷移）
      const screenOrgRequest: ScrCom0027GetScreenPermissionOrganizationRequest =
        {
          // 画面権限ID
          screenPermissionList: screenPermissionId,
          // 業務日付
          businessDate: user.taskDate,
        };
      const screenOrgResponse = await getScreenPermissionOrganization(
        screenOrgRequest
      );
      const screenOrgResult = convertToScreenOrgModel(screenOrgResponse);

      let permissionId = undefined;
      let permissionName = undefined;
      let tFlag = undefined;
      let fFlag = undefined;

      for (const val of screenOrgResult.screenPermissionList) {
        permissionId = permissionId + ', ' + val.screenPermissionId;
        permissionName = permissionName + '、 ' + val.screenPermissionName;

        // 利用フラグに可、不可の両方が含まれているかチェック
        if (val.useFlag === true) {
          tFlag = 'true';
        } else if (val.useFlag === false) {
          fFlag = 'true';
        }
      }

      // 画面にデータを設定
      if (permissionId !== undefined) {
        setValue('screenPermissionId', permissionId);
      }
      if (permissionName !== undefined) {
        setValue('screenPermissionName', permissionName);
      }

      setValue(
        'useFlag',
        tFlag === undefined
          ? 'false'
          : fFlag === undefined
          ? 'true'
          : tFlag !== undefined && fFlag !== undefined
          ? ''
          : ''
      );
      setValue(
        'totalSettingPost',
        screenOrgResult.screenPermissionList[0].totalSettingPost
      );

      // データグリッドにデータを設定
      setScreenResult(screenOrgResult.screenList);
    };

    // 初期表示処理(履歴表示)
    const historyInfoInitialize = async (changeHistoryNumber: string) => {
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

      // データグリッドにデータを設定
      setScreenResult(historyInfo.screenList);
    };

    // 初期表示(新規追加)
    const initializeNew = async () => {
      // API-COM-0027-0002：画面一覧情報取得API
      const newScreenResponse = await getScreen(undefined);
      const newScreenResult = convertToNewScreenModel(newScreenResponse);

      // 画面にデータを設定
      setValue('useFlag', 'true');
      setValue('totalSettingPost', '-');
      // データグリッドにデータを設定
      setScreenResult(newScreenResult);
    };

    // 履歴表示の初期化処理
    if (applicationId !== null) {
      historyInfoInitialize(applicationId);
    }

    // 新規追加の初期化処理
    if (screenPermissionId === undefined || screenPermissionId === 'new') {
      initializeNew();
      return;
    }

    // 初期表示処理（アクセス権限管理画面から遷移）
    if (
      screenPermissionId !== null &&
      screenPermissionId !== undefined &&
      typeof screenPermissionId === 'string'
    ) {
      initialize(screenPermissionId);
      return;
    }

    // 初期表示処理（組織管理画面から遷移）
    if (
      screenPermissionId !== null &&
      screenPermissionId !== undefined &&
      typeof screenPermissionId !== 'string'
    ) {
      initializeOrg(screenPermissionId);
      return;
    }
  }, [
    screenPermissionId,
    searchParams,
    setValue,
    reset,
    applicationId,
    disableFlg,
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
      screenResult,
      '画面権限詳細_' +
        user.employeeId +
        '_' +
        year.toString() +
        (month < 10 ? '0' : '') +
        month.toString() +
        (day < 10 ? '0' : '') +
        day.toString() +
        hours.toString() +
        min.toString() +
        '.csv'
    );
  };

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToChngedSections = (dirtyFields: object): sectionList[] => {
    const fields = Object.keys(dirtyFields);
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
    const idList: ScreenIdList[] = [];
    screenResult.forEach((x) => {
      if (x.editPermission === 1) {
        idList.push({
          screenId: x.screenId,
        });
      }
    });

    const screenCheckRequest: ScrCom0027InputCheckScreenPermissionRequest = {
      // 画面権限ID
      screenPermissionId: getValues('screenPermissionId'),
      // 画面権限名
      screenPermissionName: getValues('screenPermissionName'),
      // 業務日付
      businessDate: user.taskDate,
      // 画面ID一覧
      screenIdList: idList,
    };
    const checkResult = await checkScreenPermission(screenCheckRequest);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: checkResult.errorList,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-COM-0027',
          screenName: '画面権限詳細',
          tabId: '',
          tabName: '',
          sectionList: convertToChngedSections(dirtyFields),
        },
      ],
      changeExpectDate: getValues('changeExpectDate'),
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/permissions/screen/:' + screenPermissionId);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setIsOpenPopup(false);

    const idList: ScreenIdList[] = [];
    screenResult.forEach((x) => {
      if (x.editPermission === 1) {
        idList.push({
          screenId: x.screenId,
        });
      }
    });

    // API-COM-0027-0004: 画面権限登録API
    const request = convertFromScreenPermissionModel(
      getValues(),
      user.employeeId,
      idList,
      registrationChangeMemo
    );
    await registScreenPermission(request);
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
            {/* 画面権限詳細画面 */}
            <Section
              name='画面権限詳細'
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
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
                    name='screenPermissionId'
                    readonly
                    size='s'
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='権限名'
                    name='screenPermissionName'
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
                    radioValues={flagRadiovalues}
                    row
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
                rows={screenResult}
                disabled={disableFlg}
              />
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
      {isOpenPopup && (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          handleConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      )}
    </>
  );
};

export default ScrCom0027Page;
