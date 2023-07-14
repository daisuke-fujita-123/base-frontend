import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { Stack } from 'layouts/Stack';

import { AddButton, ConfirmButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { TableRowModel } from 'controls/Table';

import {
  ScrCom0026GetApprovalKind,
  ScrCom0026GetApprovalKindRequest,
  ScrCom0026GetApprovalKindResponse,
  ScrCom0026RegistApprovalKind,
} from 'apis/com/ScrCom0026Api';
import {
  ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoRequest,
} from 'apis/com/ScrCom9999Api';

import { AppContext } from 'providers/AppContextProvider';
import { MessageContext } from 'providers/MessageProvider';

import { GridColumnGroupingModel } from '@mui/x-data-grid-pro';

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
  // タブ名称
  tabName: string;
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
    size: 'm',
  },
  {
    field: 'screenName',
    headerName: '変更画面',
    headerAlign: 'center',
    size: 'l',
  },
  {
    field: 'tabName',
    headerName: 'タブ名',
    headerAlign: 'center',
    size: 'l',
  },
  {
    field: 'approvalConditionName',
    headerName: '条件',
    headerAlign: 'center',
    size: 'm',
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

const convertToApprovalKindModel = (
  approval: ScrCom0026GetApprovalKindResponse
): SearchResultApprovalModel[] => {
  return approval.approvalKindList.map((x) => {
    return {
      id: x.number,
      number: x.number,
      systemKind: x.systemKind,
      screenName: x.screenName,
      tabName: x.tabName,
      approvalConditionName: x.approvalConditionName,
      number1: x.number1,
      number2: x.number2,
      number3: x.number3,
      number4: x.number4,
      approval: x.approval,
      approvalKindId: x.approvalKindId,
    };
  });
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  changedSections: [],
  errorMessages: [],
  warningMessages: [],
};

/**
 * アクセス権限管理画面 承認種類一覧タブ
 */
const ScrCom0026ApprovalKindTab = () => {
  // state
  const [approvalResult, setApprovalResult] = useState<
    SearchResultApprovalModel[]
  >([]);
  // 履歴表示によるボタン活性判別フラグ
  const [activeFlag, setActiveFlag] = useState(false);

  // router
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  // user情報
  const { appContext } = useContext(AppContext);
  const { getMessage } = useContext(MessageContext);
  const businessDate = ''; // TODO: 業務日付実装待ち

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // 初期表示処理
  useEffect(() => {
    const initialize = async (businessDate: string) => {
      // ボタン活性
      setActiveFlag(false);

      // API-COM-0026-0003: 承認種類一覧取得API
      const approvalRequest: ScrCom0026GetApprovalKindRequest = {
        businessDate: businessDate,
      };
      const approvalResponse = await ScrCom0026GetApprovalKind(approvalRequest);
      const approvalResult = convertToApprovalKindModel(approvalResponse);

      // データグリッドにデータを設定
      setApprovalResult(approvalResult);
    };

    // 履歴表示処理
    const initializeHistory = async (applicationId: string) => {
      // ボタン非活性
      setActiveFlag(true);

      // SCR-COM-9999-0025: 変更履歴情報取得API
      const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
        changeHistoryNumber: applicationId,
      };
      const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(
        getHistoryInfoRequest
      );
      const getHistoryInfoResult = convertToApprovalKindModel(
        getHistoryInfoResponse
      );

      // データグリッドにデータを設定
      setApprovalResult(getHistoryInfoResult);
    };

    // 履歴表示処理
    if (applicationId !== null) {
      initializeHistory(applicationId);
      return;
    }

    // 初期表示処理
    if (businessDate !== null) {
      initialize(businessDate);
      return;
    }
  });

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    // TODO：CSV機能実装後に変更
    alert('TODO:結果からCSVを出力する。');
  };

  /**
   * セクション構造定義
   */
  const sectionDef = [
    {
      screenName: 'アクセス権限管理',
      screenId: 'SCR-COM-0026',
      tabName: '承認種類',
      tabId: 'xxx', // TODO
      section: '承認種類一覧',
      columnName: '承認者',
      fields: ['number1', 'number2', 'number3', 'number4'],
    },
  ];

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
  const handleConfirm = () => {
    // 画面入力チェック
    const errorMessages: string[] = [];
    approvalResult.map((x) => {
      // 承認者.第1~4のいずれかがチェック済みであること
      if (
        x.number1 === false ||
        x.number2 === false ||
        x.number3 === false ||
        x.number4 === false
      ) {
        errorMessages.push(getMessage('MSG-FR-ERR-00005'));
      }

      // 最大の承認者より前のチェックが全てチェック済みか
      if (
        x.number4 === true &&
        x.number3 !== true &&
        x.number2 !== true &&
        x.number1 !== true
      ) {
        errorMessages.push(getMessage('MSG-FR-ERR-00006'));
      } else if (
        x.number3 === true &&
        x.number2 !== true &&
        x.number1 !== true
      ) {
        errorMessages.push(getMessage('MSG-FR-ERR-00006'));
      } else if (x.number2 === true && x.number1 !== true) {
        errorMessages.push(getMessage('MSG-FR-ERR-00006'));
      }
    });

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      changedSections: convertToChngedSections(approvalResult),
      errorMessages: errorMessages,
      warningMessages: [],
    });
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async () => {
    setIsOpenPopup(false);

    // API-COM-0026-0007: 承認種類登録更新API
    const request = {
      registApprovalKindList: approvalResult.map((x) => {
        return {
          approvalKindId: x.approvalKindId,
          screenId: 'SCR-COM-0026',
          tabId: 'xxx', // TODO
          registrationChangeMemo: '',
          changeApplicationEmployeeId: '',
          number1: x.number1,
          number2: x.number2,
          number3: x.number3,
          number4: x.number4,
          businessDate: businessDate,
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
                <AddButton
                  disable={activeFlag}
                  onClick={handleIconOutputCsvClick}
                >
                  CSV出力
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={approvalResultColumns}
              columnGroupingModel={columnGroups}
              rows={approvalResult}
              pageSize={10}
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
      <ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  );
};

export default ScrCom0026ApprovalKindTab;
