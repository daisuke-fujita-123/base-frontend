import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';

import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032';

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
  ScreenList,
  ScreenPermissionOrgList,
} from 'apis/com/ScrCom0027Api';
import {
  ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoRequest,
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

import yup from 'utils/validation/ValidationDefinition';

/**
 * 画面権限データモデル
 */
interface SearchScreenResultRowModel {
  // 画面権限ID
  screenPermissionId: string;
  // 業務日付
  businessDate: Date;
}

/**
 * 画面権限データモデル
 */
const initialValues: SearchScreenResultRowModel = {
  // 画面権限ID
  screenPermissionId: '',
  // 業務日付
  businessDate: new Date(),
};

/**
 * 検索結果行データモデル
 */
interface ScreenResultModel {
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: number;
  // リスト
  screenList: ScreenList[];
}

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

interface ScreenOrgModel {
  // 項目ID
  id: string;
  // 画面ID
  screenId: string;
  // 画面名
  screenName: string;
  // 編集権限
  editPermission?: boolean;
}

/**
 * 検索結果行データモデル
 */
interface ScreenOrgResultModel {
  // 画面権限リスト
  screenPermissionList: ScreenPermissionModel[];
  // 画面リスト
  screenList: ScreenOrgModel[];
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
      'businessDate',
      'screenId',
    ],
  },
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
    radioValues: [
      { value: 1, displayValue: '参照' },
      { value: 2, displayValue: '編集' },
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
 * 画面権限スキーマ
 */
const screenPermissionSchama = {
  screenPermissionId: yup.string().label('権限ID').max(6).halfWidthOnly(),
  screenPermissionName: yup
    .string()
    .label('権限名')
    .max(30)
    .fullAndHalfWidth()
    .required(),
  totalSettingPost: yup.number().label('設定役職数').max(3),
  screenId: yup.string().label('画面ID').max(12).halfWidthOnly(),
  screenName: yup.string().label('画面名').max(30).fullAndHalfWidth(),
};

// API-COM-0027-0001：画面権限一覧情報取得API データモデルへ変換処理
const convertToScreenModel = (
  screen: ScrCom0027GetScreenPermissionResponse
): ScreenResultModel => {
  return {
    screenPermissionId: screen.screenPermissionId,
    screenPermissionName: screen.screenPermissionName,
    useFlag: screen.useFlag,
    totalSettingPost: screen.totalSettingPost,
    screenList: convertScreenListModel(screen),
  };
};

const convertScreenListModel = (
  req: ScrCom0027GetScreenPermissionResponse
): ScreenList[] => {
  return req.screenList.map((x) => {
    return {
      id: x.screenId,
      screenId: x.screenId,
      screenName: x.screenName,
      editPermission: x.editPermission,
    };
  });
};

// API-COM-0027-0002：画面一覧情報取得API データモデルへ変換処理
const convertToNewScreenModel = (
  screen: ScrCom0027GetScreenResponse
): ScreenList[] => {
  return screen.screenList.map((x) => {
    return {
      id: x.screenId,
      screenId: x.screenId,
      screenName: x.screenName,
      editPermission: false,
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
): ScreenOrgModel[] => {
  return screen.screenList.map((x) => {
    return {
      id: x.screenId,
      screenId: x.screenId,
      screenName: x.screenName,
      editPermission: x.editPermission,
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
  screenPermission: ScreenPermissionModel,
  screen: ScreenList[],
  user: string
): ScrCom0027RegistScreenPermissionRequest => {
  return {
    screenPermissionId: screenPermission.screenPermissionId,
    screenPermissionName: screenPermission.screenPermissionName,
    useFlag: screenPermission.useFlag,
    screenIdList: screen.map((x) => {
      return {
        screenId: x.screenId,
      };
    }), // TODO: 編集権限取得方法不明なため、アーキチーム回答後に実装変更予定
    applicationEmployeeId: user,
    screenId: 'SCR-COM-0027',
    registrationChangeMemo: '', // TODO: 登録内容申請ポップアップから取得のため、実装後に対応
  };
};

/**
 * SCR-COM-0027 画面権限詳細画面
 */
const ScrCom0027Page = () => {
  // route
  const { screenPermissionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // user情報(businessDateも併せて取得予定)
  const { appContext } = useContext(AppContext);

  // state
  const [screenResult, setScreenResult] = useState<ScreenList[]>([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<any>({
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
        businessDate: new Date(), // TODO:業務日付の実装待ち
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
          businessDate: new Date(), // TODO:業務日付の実装待ち
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
      setValue('screenPermissionId', permissionId);
      setValue('screenPermissionName', permissionName);
      setValue(
        'useFlag',
        tFlag === undefined
          ? false
          : fFlag === undefined
          ? true
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
    const initializeHistory = async (changeHistoryNumber: string) => {
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
      // API-COM-0027-0002：画面一覧情報取得API
      const newScreenResponse = await getScreen(undefined);
      const newScreenResult = convertToNewScreenModel(newScreenResponse);

      // 画面にデータを設定
      setValue('useFlag', true);
      setValue('totalSettingPost', '-');
      // データグリッドにデータを設定
      setScreenResult(newScreenResult);
    };

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

    // 履歴表示の初期化処理
    const changeHistoryNumber = searchParams.get('change-history-number');
    if (changeHistoryNumber !== undefined && changeHistoryNumber !== null) {
      initializeHistory(changeHistoryNumber);
    }
  }, [screenPermissionId, searchParams, setValue, reset]);

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
    const screenCheckRequest: ScrCom0027InputCheckScreenPermissionRequest = {
      // 画面権限ID
      screenPermissionId: getValues('screenPermissionId'),
      // 画面権限名
      screenPermissionName: getValues('screenPermissionName'),
      // 業務日付
      businessDate: new Date(), // TODO: 業務日付取得機能実装後に変更
      // 画面ID一覧
      screenIdList: screenResult.map((x) => {
        return {
          screenId: x.screenId,
        };
      }),
    };
    const checkResult = await checkScreenPermission(screenCheckRequest);

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
    navigate('/com/permissions/screen/:' + screenPermissionId);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async () => {
    setIsOpenPopup(false);

    // API-COM-0027-0004: 画面権限登録API
    const request = convertFromScreenPermissionModel(
      getValues(),
      screenResult,
      appContext.user
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
                    required
                  />
                </ColStack>
                <ColStack>
                  <Radio
                    label='利用フラグ'
                    name='useFlag'
                    size='s'
                    radioValues={[
                      {
                        value: 'true',
                        displayValue: '可',
                        disabled: false,
                      },
                      {
                        value: 'false',
                        displayValue: '不可',
                        disabled: false,
                      },
                    ]}
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
                pageSize={10}
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
      <ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  );
};

export default ScrCom0027Page;
