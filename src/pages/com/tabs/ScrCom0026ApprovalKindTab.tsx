import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ScrCom0032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { Stack } from 'layouts/Stack';

import { AddButton, ConfirmButton } from 'controls/Button';
import { DataGrid, exportCsv, GridColDef } from 'controls/Datagrid';

import {
  ScrCom0026GetApprovalKind,
  ScrCom0026GetApprovalKindResponse,
  ScrCom0026RegistApprovalKind,
  ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoResponse,
} from 'apis/com/ScrCom0026Api';

import { AuthContext } from 'providers/AuthProvider';

import {
  GridCellParams,
  GridColumnGroupingModel,
  GridTreeNode,
  useGridApiRef,
} from '@mui/x-data-grid-pro';

/**
 * 検索結果行データモデル
 */
interface SearchResultApprovalModel {
  // 項目内Id(hrefs)
  id: string;
  // No
  number: string;
  // システム種別
  systemKind: string;
  // 画面名
  screenName: string;
  // タブ名/一括登録名称
  tabRegistrationName: string;
  // 承認条件名
  approvalConditionName: string;
  // 第1
  number1: boolean;
  // 第2
  number2: boolean;
  // 第3
  number3: boolean;
  // 第4
  number4: boolean;
}

interface ApprovalList {
  // No
  number: string;
  // 承認要否
  approval: boolean;
  // 承認種類ID
  approvalKindId: string;
  // 有効開始日
  validityStartDate: string;
  // 変更前タイムスタンプ
  beforeTimestamp: string;
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectDate: string;
}

interface ApprovalModel {
  // 項目内Id(hrefs)
  id: string;
  // No
  number: string;
  // システム種別
  systemKind: string;
  // 画面名
  screenName: string;
  // タブ名/一括登録名称
  tabRegistrationName: string;
  // 承認条件名
  approvalConditionName: string;
  // 第1
  number1: boolean;
  // 第2
  number2: boolean;
  // 第3
  number3: boolean;
  // 第4
  number4: boolean;
  // 承認要否
  approval: boolean;
  // 承認種類ID
  approvalKindId: string;
  // 有効開始日
  validityStartDate: string;
  // 変更前タイムスタンプ
  beforeTimestamp: string;
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectDate: string;
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
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
    field: 'screenName',
    headerName: '変更画面',
    headerAlign: 'center',
    width: 400,
  },
  {
    field: 'tabRegistrationName',
    headerName: 'タブ名',
    headerAlign: 'center',
    size: 'm',
  },
  {
    field: 'approvalConditionName',
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
    headerAlign: 'center',
    children: [
      { field: 'number1' },
      { field: 'number2' },
      { field: 'number3' },
      { field: 'number4' },
    ],
  },
];

// API-COM-0026-0003: 承認種類一覧取得API 変換処理
const convertToApprovalKindModel = (
  approval: ScrCom0026GetApprovalKindResponse
): SearchResultApprovalModel[] => {
  return approval.approvalKindList.map((x) => {
    return {
      id: x.approvalKindNumber,
      number: x.approvalKindNumber,
      systemKind: x.systemKind,
      screenName: x.screenName,
      tabRegistrationName:
        x.allRegistrationName === null
          ? x.tabName
          : x.tabName === null
          ? x.allRegistrationName
          : x.allRegistrationName !== null && x.tabName !== null
          ? x.tabName
          : '',
      approvalConditionName: x.approvalConditionName,
      number1: x.authorizerFirst,
      number2: x.authorizerSecond,
      number3: x.authorizerThird,
      number4: x.authorizerFourth,
    };
  });
};

const convertToApprovalList = (
  approval: ScrCom0026GetApprovalKindResponse
): ApprovalList[] => {
  return approval.approvalKindList.map((x) => {
    return {
      number: x.approvalKindNumber,
      approval: x.approvalFlag,
      approvalKindId: x.approvalKindId,
      validityStartDate: x.validityStartDate,
      beforeTimestamp: x.beforeTimestamp,
      changeHistoryNumber: '',
      changeExpectDate: '',
    };
  });
};

const convertToHistoryInfo = (
  approval: ScrCom9999GetHistoryInfoResponse
): SearchResultApprovalModel[] => {
  return approval.approvalKindList.map((x) => {
    return {
      id: x.approvalKindNumber,
      number: x.approvalKindNumber,
      systemKind: x.systemKind,
      screenName: x.screenName,
      tabRegistrationName:
        x.allRegistrationName === null
          ? x.tabName
          : x.tabName === null
          ? x.allRegistrationName
          : x.allRegistrationName !== null && x.tabName !== null
          ? x.tabName
          : '',
      approvalConditionName: x.approvalConditionName,
      number1: x.authorizerFirst,
      number2: x.authorizerSecond,
      number3: x.authorizerThird,
      number4: x.authorizerFourth,
    };
  });
};

const convertToHistoryInfoList = (
  approval: ScrCom0026GetApprovalKindResponse,
  changeHistoryNumber: string
): ApprovalList[] => {
  return approval.approvalKindList.map((x) => {
    return {
      number: x.approvalKindNumber,
      approval: x.approvalFlag,
      approvalKindId: x.approvalKindId,
      validityStartDate: x.validityStartDate,
      beforeTimestamp: x.beforeTimestamp,
      changeHistoryNumber: changeHistoryNumber,
      changeExpectDate: '',
    };
  });
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [
    {
      screenId: '',
      screenName: '',
      tabId: 0,
      tabName: '',
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
  ],
  changeExpectDate: '',
};

/**
 * アクセス権限管理画面 承認種類一覧タブ
 */
const ScrCom0026ApprovalKindTab = () => {
  // state
  const [approvalResult, setApprovalResult] = useState<
    SearchResultApprovalModel[]
  >([]);
  const [approvalList, setApprovalList] = useState<ApprovalList[]>([]);
  const [initApprovalResult, setInitApprovalResult] = useState<
    SearchResultApprovalModel[]
  >([]);
  // 履歴表示によるボタン活性判別フラグ
  const [activeFlag, setActiveFlag] = useState(false);
  const apiRef = useGridApiRef();

  // router
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  // user情報
  const { user } = useContext(AuthContext);

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // 編集権限_disable設定
  const setDisableFlg = user.editPossibleScreenIdList.filter((x) => {
    return x.includes('SCR-COM-0026');
  });
  const disableFlg = setDisableFlg[0] === 'SCR-COM-0026' ? false : true;

  // 初期表示処理
  useEffect(() => {
    const initialize = async (businessDate: string) => {
      // ボタン活性
      setActiveFlag(disableFlg);

      // API-COM-0026-0003: 承認種類一覧取得API
      const approvalResponse = await ScrCom0026GetApprovalKind(null);
      const approvalResult = convertToApprovalKindModel(approvalResponse);
      const approvalList = convertToApprovalList(approvalResponse);

      // データグリッドにデータを設定
      setApprovalResult(approvalResult);

      setApprovalList(approvalList);

      // 初期データを格納
      if (initApprovalResult.length === 0) {
        setInitApprovalResult(approvalResult);
      }
    };

    // 履歴表示処理
    const initializeHistory = async (applicationId: string) => {
      // ボタン非活性
      setActiveFlag(true);

      // 変更履歴情報取得API
      const getHistoryInfoRequest = {
        changeHistoryNumber: applicationId,
      };
      const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(
        getHistoryInfoRequest
      );
      const historyInfo = convertToHistoryInfo(getHistoryInfoResponse);
      const historyInfoList = convertToHistoryInfoList(
        getHistoryInfoResponse,
        applicationId
      );

      // データグリッドにデータを設定
      setApprovalResult(historyInfo);
      setApprovalList(historyInfoList);

      // 初期データを格納
      if (initApprovalResult) {
        setInitApprovalResult(historyInfo);
      }
    };

    // 履歴表示処理
    if (applicationId !== null) {
      initializeHistory(applicationId);
      return;
    }

    // 初期表示処理
    if (user.taskDate !== null) {
      initialize(user.taskDate);
      return;
    }
  }, [applicationId, user]);

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
      '承認種類' +
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
   * セクション構造定義
   */
  const sectionDef = [
    {
      screenName: 'アクセス権限管理',
      screenId: 'SCR-COM-0026',
      section: '承認種類一覧',
      fields: ['number1', 'number2', 'number3', 'number4'],
      name: ['第1', '第2', '第3', '第4'],
    },
  ];

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToChngedSections = (dirtyFields: object): sectionList[] => {
    const fields = Object.keys(dirtyFields);
    const changedSections: sectionList[] = [];
    sectionDef.forEach((d) => {
      const columnList: columnList[] = [];
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
  const handleConfirm = () => {
    // 画面入力チェック
    const errorMessages: ErrorList[] = [];
    const approvalResultRequest: ApprovalModel[] = [];
    approvalResult.map((x, i) => {
      // 承認者.第1~4のいずれかがチェック済みであること
      if (
        x.number1 === false ||
        x.number2 === false ||
        x.number3 === false ||
        x.number4 === false
      ) {
        errorMessages.push({
          errorCode: 'MSG-FR-ERR-00005',
          errorMessage: '承認者を入力してください。',
        });
      }

      // 最大の承認者より前のチェックが全てチェック済みか
      if (
        x.number4 === true &&
        x.number3 !== true &&
        x.number2 !== true &&
        x.number1 !== true
      ) {
        errorMessages.push({
          errorCode: 'MSG-FR-ERR-00006',
          errorMessage: '承認者を正しい組み合わせで入力してください。',
        });
      } else if (
        x.number3 === true &&
        x.number2 !== true &&
        x.number1 !== true
      ) {
        errorMessages.push({
          errorCode: 'MSG-FR-ERR-00006',
          errorMessage: '承認者を正しい組み合わせで入力してください。',
        });
      } else if (x.number2 === true && x.number1 !== true) {
        errorMessages.push({
          errorCode: 'MSG-FR-ERR-00006',
          errorMessage: '承認者を正しい組み合わせで入力してください。',
        });
      }

      // 変更行のデータを取得
      if (
        x.number1 !== initApprovalResult[i].number1 ||
        x.number2 !== initApprovalResult[i].number2 ||
        x.number3 !== initApprovalResult[i].number3 ||
        x.number4 !== initApprovalResult[i].number4
      ) {
        approvalResultRequest.push({
          id: x.number,
          number: x.number,
          systemKind: x.systemKind,
          screenName: x.screenName,
          tabRegistrationName: x.tabRegistrationName,
          approvalConditionName: x.approvalConditionName,
          number1: x.number1,
          number2: x.number2,
          number3: x.number3,
          number4: x.number4,
          approval: approvalList[i].approval,
          approvalKindId: approvalList[i].approvalKindId,
          validityStartDate: approvalList[i].validityStartDate,
          beforeTimestamp: approvalList[i].beforeTimestamp,
          changeHistoryNumber: approvalList[i].changeHistoryNumber,
          changeExpectDate: approvalList[i].changeExpectDate,
        });
      }
    });

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: errorMessages,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-COM-0026',
          screenName: 'アクセス権限管理',
          tabId: 3,
          tabName: '承認種類',
          sectionList: convertToChngedSections(approvalResultRequest),
        },
      ],
      changeExpectDate: '',
    });
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setIsOpenPopup(false);

    // 変更行のデータを取得
    const approvalResultRequest: ApprovalModel[] = [];
    approvalResult.forEach((x, i) => {
      if (
        x.number1 !== initApprovalResult[i].number1 &&
        x.number2 !== initApprovalResult[i].number2 &&
        x.number3 !== initApprovalResult[i].number3 &&
        x.number4 !== initApprovalResult[i].number4
      ) {
        approvalResultRequest.push({
          id: x.number,
          number: x.number,
          systemKind: x.systemKind,
          screenName: x.screenName,
          tabRegistrationName: x.tabRegistrationName,
          approvalConditionName: x.approvalConditionName,
          number1: x.number1,
          number2: x.number2,
          number3: x.number3,
          number4: x.number4,
          approval: approvalList[i].approval,
          approvalKindId: approvalList[i].approvalKindId,
          validityStartDate: approvalList[i].validityStartDate,
          beforeTimestamp: approvalList[i].beforeTimestamp,
          changeHistoryNumber: approvalList[i].changeHistoryNumber,
          changeExpectDate: approvalList[i].changeExpectDate,
        });
      }
    });

    // API-COM-0026-0007: 承認種類登録更新API
    const request = {
      screenId: 'SCR-COM-0026',
      tabId: '3',
      registrationChangeMemo: registrationChangeMemo,
      businessDate: user.taskDate,
      changeApplicationEmployeeId: user.employeeId,
      registApprovalKindList: approvalResultRequest.map((x) => {
        return {
          approvalKindId: x.approvalKindId,
          validityStartDate: x.validityStartDate,
          number1: x.number1,
          number2: x.number2,
          number3: x.number3,
          number4: x.number4,
          beforeTimestamp: x.beforeTimestamp,
        };
      }),
    };

    await ScrCom0026RegistApprovalKind(request);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  const handleGetCellDisabled = (params: any) => {
    if (disableFlg) return true;
    let flg = '';
    approvalList.forEach((x) => {
      if (params.row.number === x.number && x.approval === false) {
        flg = 'true';
      }
    });
    if (flg === 'true') return true;
    return false;
  };

  const handleGetRowClassName = (
    params: GridCellParams<any, any, any, GridTreeNode>
  ) => {
    let flg = '';
    approvalList.forEach((x) => {
      if (params.row.number === x.number && x.approval === false) {
        flg = 'true';
      }
    });
    if (flg === 'true') return 'not-available';
    return '';
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          {/* 承認種類一覧 */}
          <Section
            name='承認種類一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
            fitInside
          >
            <DataGrid
              columns={approvalResultColumns}
              columnGroupingModel={columnGroups}
              rows={approvalResult}
              disabled={activeFlag}
              apiRef={apiRef}
              getCellDisabled={handleGetCellDisabled}
              getCellClassName={handleGetRowClassName}
              sx={{
                '& .not-available': {
                  backgroundColor: '#dddddd',
                },
              }}
            />
          </Section>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <ConfirmButton disable={activeFlag} onClick={handleConfirm}>
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

export default ScrCom0026ApprovalKindTab;
