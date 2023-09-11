import React, { useContext, useEffect, useState } from 'react';

import { RightBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { Stack } from 'layouts/Stack';

import { OutputButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
  GridTooltipsModel,
} from 'controls/Datagrid';

import {
  ScrDoc0005ChangeHistoryInfo,
  ScrDoc0005ChangeHistoryInfoResponse,
} from 'apis/doc/ScrDoc0005Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * SCR-DOC-0005 書類情報詳細画面変更履歴情報タブ
 */

// 変更履歴リスト
const showChangeHistoryList: GridColDef[] = [
  {
    field: 'changeHistoryNumber',
    headerName: '申請ID',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'screenName',
    headerName: '申請元画面',
    size: 'm',
  },
  {
    field: 'tabNameAllRegistrationName',
    headerName: 'タブ名/一括登録',
    size: 'm',
  },
  {
    field: 'changeExpectDate',
    headerName: '変更日',
    size: 'm',
  },
  {
    field: 'changeApplicationEmployeeIdName',
    headerName: '申請者ID/申請者名',
    size: 'm',
  },
  {
    field: 'changeApplicationTimestamp',
    headerName: '申請日時',
    size: 'm',
  },
  {
    field: 'registrationChangeMemo',
    headerName: '登録・変更メモ',
    size: 'm',
    tooltip: true,
  },
  {
    field: 'approvalEmployeeIdName',
    headerName: '最終承認者ID/最終承認者名',
    size: 'l',
  },
  {
    field: 'approverComment',
    headerName: '最終承認者コメント',
    size: 'm',
    tooltip: true,
  },
];
interface ChangeHistoryListModel {
  /** ID */
  id: string;
  /** 変更履歴番号 */
  changeHistoryNumber: string;
  /** 画面名 */
  screenName: string;
  /** タブ名称/一括登録名称 */
  tabNameAllRegistrationName: string;
  /** 変更予定日 */
  changeExpectDate: string;
  /** 変更申請従業員ID/従業員名 */
  changeApplicationEmployeeIdName: string;
  /** 変更申請タイムスタンプ */
  changeApplicationTimestamp: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 承認従業員ID/従業員名 */
  approvalEmployeeIdName: string;
  /** 承認タイムスタンプ */
  approvalTimestamp: string;
  /** 承認者コメント */
  approverComment: string;
}
// 未承認リスト
const showUnapprovedList: GridColDef[] = [
  {
    field: 'changeHistoryNumber',
    headerName: '申請ID',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'screenName',
    headerName: '申請元画面',
    size: 'm',
  },
  {
    field: 'tabNameAllRegistrationName',
    headerName: 'タブ名/一括登録',
    size: 'm',
  },
  {
    field: 'changeExpectDate',
    headerName: '変更日',
    size: 'm',
  },
  {
    field: 'changeApplicationEmployeeIdName',
    headerName: '申請者ID/申請者名',
    size: 'm',
  },
  {
    field: 'changeApplicationTimestamp',
    headerName: '申請日時',
    size: 'm',
  },
  {
    field: 'registrationChangeMemo',
    headerName: '登録・変更メモ',
    size: 'm',
    tooltip: true,
  },
  {
    field: 'approvalStatus',
    headerName: '承認ステータス',
    size: 'm',
  },
  {
    field: 'firstApprovalEmployeeIdName',
    headerName: '1次承認者ID/1次承認者名',
    size: 'l',
  },
  {
    field: 'secondApprovalEmployeeIdName',
    headerName: '2次承認者ID/2次承認者名',
    size: 'l',
  },
  {
    field: 'thirdApprovalEmployeeIdName',
    headerName: '3次承認者ID/3次承認者名',
    size: 'l',
  },
  {
    field: 'fourthApprovalEmployeeIdName',
    headerName: '4次承認者ID/4次承認者名',
    size: 'l',
  },
];
interface UnapprovedListModel {
  /** ID */
  id: string;
  /** 変更履歴番号 */
  changeHistoryNumber: string;
  /** 画面名 */
  screenName: string;
  /** タブ名称/一括登録名称 */
  tabNameAllRegistrationName: string;
  /** 変更予定日 */
  changeExpectDate: string;
  /** 変更申請従業員ID/従業員名 */
  changeApplicationEmployeeIdName: string;
  /** 変更申請タイムスタンプ */
  changeApplicationTimestamp: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 承認ステータス */
  approvalStatus: string;
  /** 1次承認設定従業員ID/従業員名 */
  firstApprovalEmployeeIdName: string;
  /** 2次承認設定従業員ID/従業員名 */
  secondApprovalEmployeeIdName: string;
  /** 3次承認設定従業員ID/従業員名 */
  thirdApprovalEmployeeIdName: string;
  /** 4次承認設定従業員ID/従業員名 */
  fourthApprovalEmployeeIdName: string;
}

interface ScrDoc0005ChangeHistory {
  documentBasicsNumber: number;
  allReadOnly: boolean;
}
const ScrDoc0005ChangeHistoryTab = (props: ScrDoc0005ChangeHistory) => {
  const { documentBasicsNumber, allReadOnly } = props;
  const { user } = useContext(AuthContext);
  // 変更履歴リスト
  const [changeHistoryList, setChangeHistoryList] = useState<
    ChangeHistoryListModel[]
  >([]);
  // 未承認リスト
  const [unapprovedList, setUnapprovedList] = useState<UnapprovedListModel[]>(
    []
  );
  // Link
  const [historyHrefs, setHistoryHrefs] = useState<GridHrefsModel[]>([]);
  const [unapprovedHrefs, setUnapproved] = useState<GridHrefsModel[]>([]);
  // Tooltipn
  const [historyTooltips, setHistoryTooltips] = useState<GridTooltipsModel[]>(
    []
  );
  const [unapprovedTooltips, setUnapprovedTooltips] = useState<
    GridTooltipsModel[]
  >([]);

  // 初期表示
  useEffect(() => {
    const initialize = async () => {
      const response = await ScrDoc0005ChangeHistoryInfo({
        documentBasicsNumber: Number(documentBasicsNumber),
      });
      const changeHistoryInfo = convertToChangeHistoryInfoListModel(response);
      setChangeHistoryList(changeHistoryInfo);
      const unapprovedList = convertToUnapprovedInfoListModel(response);
      setUnapprovedList(unapprovedList);

      // 変更履歴一覧refs設定
      setHistoryHrefs([
        {
          field: 'changeHistoryNumber',
          hrefs: response.changeHistoryList.map((x) => {
            return {
              id: String(x.changeHistoryNumber),
              href:
                '/doc/documents/' +
                String(x.changeHistoryNumber) +
                '#' +
                x.tabName,
            };
          }),
        },
      ]);
      // 変更履歴一覧ツールチップ設定
      setHistoryTooltips([
        {
          field: 'registUpdateMemoExistence',
          tooltips: response.changeHistoryList.map((x) => {
            return {
              id: String(x.changeHistoryNumber),
              text: x.registrationChangeMemo,
            };
          }),
        },
        {
          field: 'registUpdateMemoExistence',
          tooltips: response.changeHistoryList.map((x) => {
            return {
              id: String(x.changeHistoryNumber),
              text: x.approverComment,
            };
          }),
        },
      ]);

      // 未承認一覧refs設定
      setUnapproved([
        {
          field: 'changeHistoryNumber',
          hrefs: response.unapprovedList.map((x) => {
            return {
              id: String(x.changeHistoryNumber),
              href:
                '/doc/documents/' +
                String(x.changeHistoryNumber) +
                '#' +
                x.tabName,
            };
          }),
        },
      ]);
      // 未承認一覧ツールチップ設定
      setUnapprovedTooltips([
        {
          field: 'registrationChangeMemo',
          tooltips: response.unapprovedList.map((x) => {
            return {
              id: String(x.changeHistoryNumber),
              text: x.registrationChangeMemo,
            };
          }),
        },
      ]);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 変更履歴情報取得APIレスポンスから変更履歴リストモデルへの変換
   */
  const convertToChangeHistoryInfoListModel = (
    response: ScrDoc0005ChangeHistoryInfoResponse
  ): ChangeHistoryListModel[] => {
    return response.changeHistoryList.map((x) => {
      return {
        id: String(x.changeHistoryNumber),

        tabNameAllRegistrationName: x.tabName,
        changeApplicationEmployeeIdName:
          x.changeApplicationEmployeeId + ' ' + x.changeApplicationEmployeeName,
        approvalEmployeeIdName:
          x.approvalEmployeeId + ' ' + x.approvalEmployeeName,
        ...x,
        changeHistoryNumber: String(x.changeHistoryNumber),
      };
    });
  };

  /**
   * 変更履歴情報取得APIレスポンスから未承認リストモデルへの変換
   */
  const convertToUnapprovedInfoListModel = (
    response: ScrDoc0005ChangeHistoryInfoResponse
  ): UnapprovedListModel[] => {
    return response.unapprovedList.map((x) => {
      return {
        id: String(x.changeHistoryNumber),
        tabNameAllRegistrationName: x.tabName,
        changeApplicationEmployeeIdName:
          x.changeApplicationEmployeeId + ' ' + x.changeApplicationEmployeeName,
        firstApprovalEmployeeIdName:
          x.firstApprovalEmployeeId + ' ' + x.firstApprovalEmployeeName,
        secondApprovalEmployeeIdName:
          x.secondApprovalEmployeeId + ' ' + x.secondApprovalEmployeeName,
        thirdApprovalEmployeeIdName:
          x.thirdApprovalEmployeeId + ' ' + x.thirdApprovalEmployeeName,
        fourthApprovalEmployeeIdName:
          x.fourthApprovalEmployeeId + ' ' + x.fourthApprovalEmployeeName,
        ...x,
        changeHistoryNumber: String(x.changeHistoryNumber),
      };
    });
  };

  // ref
  const apiRef = useGridApiRef();

  const handleExportCsvClick = () => {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    exportCsv(
      `書類情報詳細_${user.employeeId}_${
        year + month + day + hours + minutes
      }.csv`,
      apiRef
    );
  };
  const [maxSectionWidth, setMaxSectionWidth] = useState<number>(0);

  useEffect(() => {
    setMaxSectionWidth(
      Number(
        apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
      ) + 40
    );
  }, [apiRef, apiRef.current.rootElementRef]);

  /**
   * リンククリック時のイベントハンドラ
   */
  // router
  const navigate = useNavigate();
  const handleLinkClick = (url: string) => {
    navigate(url, true);
  };

  console.log(historyHrefs);
  console.log(unapprovedHrefs);
  console.log(historyTooltips);
  console.log(unapprovedTooltips);
  return (
    <MainLayout>
      <MainLayout main>
        <Section name='変更履歴一覧'>
          <Stack>
            <RightBox>
              <OutputButton
                onClick={handleExportCsvClick}
                disable={allReadOnly}
              >
                CSV出力
              </OutputButton>
            </RightBox>
            <DataGrid
              columns={showChangeHistoryList}
              rows={changeHistoryList}
              getRowId={(row) => row.id + row.tabNameAllRegistrationName}
              tooltips={historyTooltips}
              hrefs={historyHrefs}
              onLinkClick={handleLinkClick}
            />
          </Stack>
        </Section>
        <Section name='未承認一覧' width={maxSectionWidth}>
          <DataGrid
            columns={showUnapprovedList}
            rows={unapprovedList}
            apiRef={apiRef}
            getRowId={(row) => row.id + row.tabNameAllRegistrationName}
            tooltips={unapprovedTooltips}
            hrefs={unapprovedHrefs}
            onLinkClick={handleLinkClick}
          />
        </Section>
      </MainLayout>
    </MainLayout>
  );
};

export default ScrDoc0005ChangeHistoryTab;
