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
  checkApprovalPermission,
  getApprovalPermissionCreateList,
  getApprovalPermissionList,
  getApprovalPermissionMultiList,
  registApprovalPermission,
  ScrCom0029CheckApprovalPermissionRequest,
  ScrCom0029GetApprovalPermissionCreateResponse,
  ScrCom0029GetApprovalPermissionMultiRequest,
  ScrCom0029GetApprovalPermissionMultiResponse,
  ScrCom0029GetApprovalPermissionRequest,
  ScrCom0029GetApprovalPermissionResponse,
  ScrCom0029RegistApprovalPermissionRequest,
  ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoResponse,
} from 'apis/com/ScrCom0029Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { GridColumnGroupingModel } from '@mui/x-data-grid-pro';

/**
 * 検索結果行データモデル
 */
interface SearchResultApprovalModel {
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 利用フラグ
  useFlag: string;
  // 設定役職数
  totalSettingPost: string;
  // 承認権限リスト
  approvalPermissionDetailList: ApprovalPermissionListModel[];
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectDate: string;
}

interface ApprovalPermissionListModel {
  // 項目内リンクId(hrefs)
  id: string;
  // No
  number: string;
  // システム種別
  systemKind: string;
  // 変更画面
  changeScreen: string;
  // タブID
  tabId: number;
  // タブ名称
  tabName: string;
  // 条件
  condition: string;
  // 第1
  number1?: boolean;
  // 第2
  number2?: boolean;
  // 第3
  number3?: boolean;
  // 第4
  number4?: boolean;
  // 承認種類ID
  approvalKindId: string;
}

// 初期値
const initialValues: SearchResultApprovalModel = {
  // 承認権限ID
  approvalPermissionId: '',
  // 承認権限名
  approvalPermissionName: '',
  // 利用フラグ
  useFlag: '',
  // 設定役職数
  totalSettingPost: '',
  // 承認権限リスト
  approvalPermissionDetailList: [],
  // 変更履歴番号
  changeHistoryNumber: '',
  // 変更予定日
  changeExpectDate: '',
};

interface ApprovalPermissionMultiModel {
  // 承認権限リスト
  approvalpermissionInfoList: SearchResultApprovalInfoModel[];
  // 承認権限詳細リスト
  approvalPermissionDetailList: ApprovalPermissionListModel[];
}

interface SearchResultApprovalInfoModel {
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
  // 利用フラグ
  useFlag: boolean;
  // 設定役職数
  totalSettingPost: string;
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

interface NumList {
  number: string;
  approvalKindId: string;
  number1?: boolean;
  number2?: boolean;
  number3?: boolean;
  number4?: boolean;
}

/**
 * 検索条件列定義
 */
const approvalResultColumns: GridColDef[] = [
  {
    field: 'number',
    headerName: 'NO',
    headerAlign: 'center',
    size: 's',
  },
  {
    field: 'systemKind',
    headerName: 'システム種別',
    headerAlign: 'center',
    size: 's',
  },
  {
    field: 'changeScreen',
    headerName: '変更画面',
    headerAlign: 'center',
    size: 'l',
    width: 400,
  },
  {
    field: 'tabName',
    headerName: 'タブ名',
    headerAlign: 'center',
    size: 'm',
  },
  {
    field: 'condition',
    headerName: '条件',
    headerAlign: 'center',
    width: 400,
  },
  {
    field: 'number1',
    headerName: '第1',
    headerAlign: 'center',
    size: 's',
    cellType: 'checkbox',
    disableColumnMenu: true,
  },
  {
    field: 'number2',
    headerName: '第2',
    headerAlign: 'center',
    size: 's',
    cellType: 'checkbox',
  },
  {
    field: 'number3',
    headerName: '第3',
    headerAlign: 'center',
    size: 's',
    cellType: 'checkbox',
  },
  {
    field: 'number4',
    headerName: '第4',
    headerAlign: 'center',
    size: 's',
    cellType: 'checkbox',
  },
];

/**
 * 列グループ定義
 */
const columnGroups: GridColumnGroupingModel = [
  {
    groupId: '承認者',
    children: [
      { field: 'number1' },
      { field: 'number2' },
      { field: 'number3' },
      { field: 'number4' },
    ],
  },
];

// API-COM-0029-0001: 承認権限一覧取得API データ変換処理
const convertToApprovalPermissionModel = (
  approval: ScrCom0029GetApprovalPermissionResponse
): SearchResultApprovalModel => {
  return {
    approvalPermissionId: approval.approvalPermissionId,
    approvalPermissionName: approval.approvalPermissionName,
    useFlag: approval.useFlag === true ? 'true' : 'false',
    totalSettingPost: approval.totalSettingPost.toString(),
    approvalPermissionDetailList: convertToApprovalDetailModel(approval),
    changeHistoryNumber: '',
    changeExpectDate: '',
  };
};

const convertToApprovalDetailModel = (
  approval: ScrCom0029GetApprovalPermissionResponse
): ApprovalPermissionListModel[] => {
  return approval.approvalPermissionDetailList.map((x) => {
    return {
      id: x.number,
      number: x.number,
      systemKind: x.systemKind,
      changeScreen: x.changeScreen,
      tabId: x.tabId,
      tabName: x.tabName,
      condition: x.condition,
      number1: x.number1,
      number2: x.number2,
      number3: x.number3,
      number4: x.number4,
      approvalKindId: x.approvalKindId,
    };
  });
};

// API-COM-0029-0002: 承認権限一覧取得API データ変換処理
const convertToApprovalPermissionCreateModel = (
  approval: ScrCom0029GetApprovalPermissionCreateResponse
): ApprovalPermissionListModel[] => {
  return approval.approvalPermissionCreateList.map((x) => {
    return {
      id: x.number,
      number: x.number,
      systemKind: x.systemKind,
      changeScreen: x.changeScreen,
      tabId: x.tabId,
      tabName: x.tabName,
      condition: x.condition,
      approvalKindId: x.approvalKindId,
    };
  });
};

// API-COM-0029-0006: 承認権限一覧取得API(組織管理画面から遷移） データ変換処理
const convertToApprovalOrgModel = (
  approval: ScrCom0029GetApprovalPermissionMultiResponse
): ApprovalPermissionMultiModel => {
  return {
    approvalpermissionInfoList: convertApprovalInfoList(approval),
    approvalPermissionDetailList: convertApprovalDetailList(approval),
  };
};

// 承認権限リスト
const convertApprovalInfoList = (
  approval: ScrCom0029GetApprovalPermissionMultiResponse
): SearchResultApprovalInfoModel[] => {
  return approval.approvalpermissionInfoList.map((x) => {
    return {
      approvalPermissionId: x.approvalPermissionId,
      approvalPermissionName: x.approvalPermissionName,
      useFlag: x.useFlag,
      totalSettingPost: x.totalSettingPost.toString(),
    };
  });
};

// 承認権限詳細リスト
const convertApprovalDetailList = (
  approval: ScrCom0029GetApprovalPermissionMultiResponse
): ApprovalPermissionListModel[] => {
  return approval.approvalPermissionDetailList.map((x) => {
    return {
      id: x.number,
      number: x.number,
      systemKind: x.systemKind,
      changeScreen: x.changeScreen,
      tabId: x.tabId,
      tabName: x.tabName,
      condition: x.condition,
      number1: x.number1,
      number2: x.number2,
      number3: x.number3,
      number4: x.number4,
      approvalKindId: x.approvalKindId,
    };
  });
};

// API-COM-0029-0004: 承認権限登録API データ変換処理
const convertFromApprovalPermissionModel = (
  approval: SearchResultApprovalModel,
  approvalData: ApprovalPermissionListModel[],
  user: string,
  tastDate: string,
  registrationChangeMemo: string
): ScrCom0029RegistApprovalPermissionRequest => {
  return {
    approvalPermissionId: approval.approvalPermissionId,
    approvalPermissionName: approval.approvalPermissionName,
    useFlag: approval.useFlag === 'true' ? true : false,
    apprvlList: approvalData.map((x) => {
      return {
        systemKind: x.systemKind,
        changeScreen: x.changeScreen,
        tabId: x.tabId,
        tabName: x.tabName,
        condition: x.condition,
        number1: x.number1,
        number2: x.number2,
        number3: x.number3,
        number4: x.number4,
        approvalKindId: x.approvalKindId,
      };
    }),
    registrationChangeMemo: registrationChangeMemo,
    applicationEmployeeId: user,
    screenId: 'SCR-COM-0029',
    changeTimestamp: tastDate,
  };
};

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
 * 承認権限スキーマ
 */
const approvalPermissionSchama = {
  approvalPermissionName: yup.string().label('権限名').max(30).required(),
};

// 履歴表示データ変換処理
const convertToHistoryInfo = (
  approval: ScrCom9999GetHistoryInfoResponse,
  changeHistoryNumber: string
): SearchResultApprovalModel => {
  return {
    approvalPermissionId: approval.approvalPermissionId,
    approvalPermissionName: approval.approvalPermissionName,
    useFlag: approval.useFlag === true ? 'true' : 'false',
    totalSettingPost: approval.totalSettingPost.toString(),
    approvalPermissionDetailList: convertToApprovalDetailModel(approval),
    changeHistoryNumber: changeHistoryNumber,
    changeExpectDate: '',
  };
};

/**
 * SCR-COM-0029 承認権限詳細画面
 */
const ScrCom0029Page = () => {
  // state
  const [approvalResult, setApprovalResult] = useState<
    ApprovalPermissionListModel[]
  >([]);
  // 利用フラグの初期情報保持用
  const [initUseFlag, setInitUseFlag] = useState('');
  const [initApprovalResult, setInitApprovalResult] = useState<NumList[]>([]);
  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // router
  const [searchParams] = useSearchParams();
  const { approvalPermissionId } = useParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();

  // user情報
  const { user } = useContext(AuthContext);

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // form
  const methods = useForm<SearchResultApprovalModel>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(approvalPermissionSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    getValues,
    setValue,
    reset,
  } = methods;

  // ラジオボタン設定値
  const radioValues = [
    { value: 'true', displayValue: '可' },
    { value: 'false', displayValue: '不可' },
  ];

  // キャンセルボタンの活性化・非活性化を判定するフラグ
  const canelFlag = typeof approvalPermissionId !== 'string' ? true : false;

  // 編集権限_disable設定
  const setDisableFlg = user.editPossibleScreenIdList.filter((x) => {
    return x.includes('SCR-COM-0029');
  });
  const disableFlg = setDisableFlg[0] === 'SCR-COM-0029' ? false : true;

  // 初期表示処理
  useEffect(() => {
    // 初期表示
    const initialize = async (
      approvalPermissionId: string,
      businessDate: string
    ) => {
      // API-COM-0029-0001: 承認権限一覧取得API
      const approvalRequest: ScrCom0029GetApprovalPermissionRequest = {
        approvalPermissionId: approvalPermissionId,
        businessDate: businessDate,
      };
      const approvalResponse = await getApprovalPermissionList(approvalRequest);
      const approvalResult = convertToApprovalPermissionModel(approvalResponse);
      // 承認者初期値情報格納
      const initNumberList = approvalResult.approvalPermissionDetailList.map(
        (x) => {
          return {
            number: x.number,
            approvalKindId: x.approvalKindId,
            number1: x.number1,
            number2: x.number2,
            number3: x.number3,
            number4: x.number4,
          };
        }
      );

      // 画面にデータを設定
      setValue('approvalPermissionId', approvalResult.approvalPermissionId);
      setValue('approvalPermissionName', approvalResult.approvalPermissionName);
      setValue('useFlag', approvalResult.useFlag);
      setValue('totalSettingPost', approvalResult.totalSettingPost);

      // 初期値データを設定
      setInitUseFlag(approvalResult.useFlag);
      setInitApprovalResult(initNumberList);

      // データグリッドにデータを設定
      setApprovalResult(approvalResult.approvalPermissionDetailList);
    };

    // 履歴表示処理
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

      // 承認者初期値情報格納
      const initNumberList = historyInfo.approvalPermissionDetailList.map(
        (x) => {
          return {
            number: x.number,
            approvalKindId: x.approvalKindId,
            number1: x.number1,
            number2: x.number2,
            number3: x.number3,
            number4: x.number4,
          };
        }
      );

      // 画面にデータを設定
      reset(historyInfo);

      // 初期値データを設定
      setInitUseFlag(historyInfo.useFlag);
      setInitApprovalResult(initNumberList);

      // データグリッドにデータを設定
      setApprovalResult(historyInfo.approvalPermissionDetailList);
    };

    // 初期表示（組織管理画面から遷移）
    const initializeOrg = async (approvalPermissionId: string[]) => {
      // API-COM-0029-0006: 承認権限一覧取得API(組織管理画面から遷移）
      const approvalOrgRequest: ScrCom0029GetApprovalPermissionMultiRequest = {
        // 承認権限ID
        approvalPermissionId: approvalPermissionId,
        // 業務日付
        businessDate: user.taskDate,
      };
      const approvalOrgResponse = await getApprovalPermissionMultiList(
        approvalOrgRequest
      );
      const approvalOrgResult = convertToApprovalOrgModel(approvalOrgResponse);

      let permissionId = '';
      let permissionName = '';
      let tFlag = undefined;
      let fFlag = undefined;

      for (const val of approvalOrgResult.approvalpermissionInfoList) {
        permissionId = permissionId + '、 ' + val.approvalPermissionId;
        permissionName = permissionName + '、 ' + val.approvalPermissionName;

        // 利用フラグに可、不可の両方が含まれているかチェック
        if (val.useFlag === true) {
          tFlag = 'true';
        } else if (val.useFlag === false) {
          fFlag = 'true';
        }
      }

      // 承認者初期値情報格納
      const initNumberList = approvalOrgResult.approvalPermissionDetailList.map(
        (x) => {
          return {
            number: x.number,
            approvalKindId: x.approvalKindId,
            number1: x.number1,
            number2: x.number2,
            number3: x.number3,
            number4: x.number4,
          };
        }
      );

      // 画面にデータを設定
      setValue('approvalPermissionId', permissionId);
      setValue('approvalPermissionName', permissionName);
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
        approvalOrgResult.approvalpermissionInfoList[0].totalSettingPost
      );

      // 初期値データを設定
      if (getValues('useFlag') === 'true') {
        setInitUseFlag('true');
      } else if (getValues('useFlag') === 'false') {
        setInitUseFlag('false');
      }
      setInitApprovalResult(initNumberList);

      // データグリッドにデータを設定
      setApprovalResult(approvalOrgResult.approvalPermissionDetailList);
    };

    // 初期表示(新規追加)
    const initializeNew = async () => {
      const approvalResponse = await getApprovalPermissionCreateList(undefined);
      const approvalResult =
        convertToApprovalPermissionCreateModel(approvalResponse);

      // 承認者初期値情報格納
      const initNumberList = approvalResult.map((x) => {
        return {
          number: x.number,
          approvalKindId: x.approvalKindId,
          number1: x.number1,
          number2: x.number2,
          number3: x.number3,
          number4: x.number4,
        };
      });

      // 画面にデータを設定
      setValue('useFlag', 'true');
      setValue('totalSettingPost', '');

      // 初期値データを設定
      setInitUseFlag('true');
      setInitApprovalResult(initNumberList);

      // データグリッドにデータを設定
      setApprovalResult(approvalResult);
    };

    // 履歴表示の初期化処理
    if (applicationId !== null) {
      historyInfoInitialize(applicationId);
    }

    // 新規追加の初期化処理
    if (approvalPermissionId === undefined || approvalPermissionId === 'new') {
      initializeNew();
      return;
    }

    // 初期表示処理
    if (
      approvalPermissionId !== undefined &&
      approvalPermissionId !== null &&
      typeof approvalPermissionId === 'string'
    ) {
      initialize(approvalPermissionId, user.taskDate);
      return;
    }

    // 初期表示処理（組織管理画面から遷移）
    if (
      approvalPermissionId !== null &&
      approvalPermissionId !== undefined &&
      typeof approvalPermissionId !== 'string'
    ) {
      initializeOrg(approvalPermissionId);
      return;
    }
  }, [
    approvalPermissionId,
    searchParams,
    applicationId,
    getValues,
    reset,
    setValue,
    user.taskDate,
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
      approvalResult,
      '承認権限詳細_' +
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
   * セクション構造定義
   */
  const sectionDef = [
    {
      screenName: '承認権限詳細',
      screenId: 'SCR-COM-0029',
      section: '承認権限詳細',
      fields: [
        'approvalPermissionName',
        'useFlag',
        'number1',
        'number2',
        'number3',
        'number4',
      ],
      name: ['承認権限名', '利用フラグ', '第1', '第2', '第3', '第4'],
    },
  ];

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToChngedSections = (
    dirtyFields: object,
    apprResult: ApprovalPermissionListModel[],
    initApprResult: NumList[]
  ): sectionList[] => {
    const fields = Object.keys(dirtyFields);
    apprResult.map((x, i) => {
      if (
        x.number1 !== initApprResult[i].number1 &&
        !fields.includes('number1')
      ) {
        fields.push('number1');
      }
      if (
        x.number2 !== initApprResult[i].number2 &&
        !fields.includes('number2')
      ) {
        fields.push('number2');
      }
      if (
        x.number3 !== initApprResult[i].number3 &&
        !fields.includes('number3')
      ) {
        fields.push('number3');
      }
      if (
        x.number4 !== initApprResult[i].number4 &&
        !fields.includes('number4')
      ) {
        fields.push('number4');
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
    // 画面入力チェック
    const errList: ErrorList[] = [];
    let flg = '';
    approvalResult.map((x) => {
      // 承認者.第1~4のいずれの行もチェックしていない場合
      if (
        x.number1 === false &&
        x.number2 === false &&
        x.number3 === false &&
        x.number4 === false
      ) {
        flg = 'err';
      }
    });

    if (flg === 'err') {
      errList.push({
        errorCode: 'MSG-FR-ERR-00007',
        errorMessage: '承認者が何も設定されていません。',
      });
    }

    // API-COM-0029-0003: 承認権限詳細情報入力チェックAPI
    const approvalCheckRequest: ScrCom0029CheckApprovalPermissionRequest = {
      // 承認権限ID
      approvalPermissionId: getValues('approvalPermissionId'),
      // 承認権限名
      approvalPermissionName: getValues('approvalPermissionName'),
      // 業務日付
      businessDate: user.taskDate,
      // 利用不可設定フラグ
      changeUnavailableFlag:
        initUseFlag === 'true' && getValues('useFlag') === 'false'
          ? true
          : false,
      // 承認リスト
      checkApprovalPermissionList: approvalResult.map((x) => {
        return {
          number: x.number,
          approvalKindId: x.approvalKindId,
          number1: x.number1,
          number2: x.number2,
          number3: x.number3,
          number4: x.number4,
        };
      }),
    };
    const checkResult = await checkApprovalPermission(approvalCheckRequest);

    errList.concat(checkResult.errorList);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: errList,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-COM-0029',
          screenName: '承認権限詳細',
          tabId: '',
          tabName: '',
          sectionList: convertToChngedSections(
            dirtyFields,
            approvalResult,
            initApprovalResult
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
    navigate('/com/permissions');
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setIsOpenPopup(false);

    // API-COM-0029-0004: 承認権限登録API
    const request = convertFromApprovalPermissionModel(
      getValues(),
      approvalResult,
      user.employeeId,
      user.taskDate,
      registrationChangeMemo
    );
    await registApprovalPermission(request);
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
            {/* 承認権限詳細 */}
            <Section
              name='承認権限詳細'
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
                    name='approvalPermissionId'
                    readonly
                    size='s'
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='権限名'
                    name='approvalPermissionName'
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
                    row
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
                columns={approvalResultColumns}
                columnGroupingModel={columnGroups}
                rows={approvalResult}
                disabled={disableFlg}
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
          handleConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      )}
    </>
  );
};

export default ScrCom0029Page;
