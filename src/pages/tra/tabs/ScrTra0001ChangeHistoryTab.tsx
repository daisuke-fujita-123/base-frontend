// React、mui
import React, { useEffect, useState } from 'react';

// レイアウト
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { RowStack } from 'layouts/Stack';

import { OutputButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
  GridTooltipsModel,
} from 'controls/Datagrid';

import { ScrTra0001GetAccountingDealMasterChangeHistoryInfo } from 'apis/tra/ScrTra0001Api';

import { useNavigate } from 'hooks/useNavigate';

import { useGridApiRef } from '@mui/x-data-grid-pro';
import dayjs from 'dayjs';

/** モデル定義 */
/** 変更履歴情報データモデル */
interface ChangeHistoriesRowModel {
  // ID
  id: number;
  /** 変更管理番号 */
  changeHistoryNumber: number;
  /** 申請元画面名 */
  screenName: string;
  /** タブ名/一括登録 */
  tabName: string;
  /** 変更日 */
  changeExpectDate: string;
  /** 申請者ID/申請者名 */
  changeApplicationEmployee: string;
  /** 申請日時 */
  changeApplicationTimestamp: string;
  /** 登録・変更メモ */
  registrationChangeMemo: string;
  /** 最終承認者ID/最終承認者名 */
  approvalEmployee: string;
  /** 最終承認日時 */
  approvalTimestamp: string;
  /** 最終承認者コメント */
  approverComment: string;
}
/** 契約情報データモデル */
interface UnapprovedChangeHistoriesRowModel {
  // ID
  id: number;
  /** 変更管理番号 */
  changeHistoryNumber: number;
  /** 申請元画面名 */
  screenName: string;
  /** タブ名/一括登録 */
  tabName: string;
  /** 変更日 */
  changeExpectDate: string;
  /** 申請者ID/申請者名 */
  changeApplicationEmployee: string;
  /** 申請日時 */
  changeApplicationTimestamp: string;
  /** 登録・変更メモ */
  registrationChangeMemo: string;
  /** 1次承認者ID/1次承認者名 */
  approvalEmployee1: string;
  /** 2次承認者ID/2次承認者名 */
  approvalEmployee2: string;
  /** 3次承認者ID/3次承認者名 */
  approvalEmployee3: string;
  /** 4次承認者ID/4次承認者名 */
  approvalEmployee4: string;
}

/** 変数定義 */
/** 変更履歴一覧 カラム定義 */
const changeHistoriesColumns: GridColDef[] = [
  {
    field: 'changeHistoryNumber',
    headerName: '申請ID',
    size: 's',
    cellType: 'link',
    editable: false,
  },
  {
    field: 'screenName',
    headerName: '申請元画面',
    size: 'l',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'tabName',
    headerName: 'タブ名/一括登録',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'changeExpectDate',
    headerName: '変更日',
    size: 's',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'changeApplicationEmployee',
    headerName: '申請者ID/申請者名',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'changeApplicationTimestamp',
    headerName: '申請日時',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'registrationChangeMemo',
    headerName: '登録・変更メモ',
    size: 'm',
    cellType: 'default',
    editable: false,
    tooltip: true,
  },
  {
    field: 'approvalEmployee',
    headerName: '最終承認者ID/最終承認者名',
    size: 'l',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'approvalTimestamp',
    headerName: '最終承認日時',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'approverComment',
    headerName: '最終承認者コメント',
    size: 'm',
    cellType: 'default',
    editable: false,
    tooltip: true,
  },
];
/** 未承認一覧 カラム定義 */
const unapprovedChangeHistoriesColumns: GridColDef[] = [
  {
    field: 'changeHistoryNumber',
    headerName: '申請ID',
    size: 's',
    cellType: 'link',
    editable: false,
  },
  {
    field: 'screenName',
    headerName: '申請元画面',
    size: 'l',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'tabName',
    headerName: 'タブ名/一括登録',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'changeExpectDate',
    headerName: '変更日',
    size: 's',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'changeApplicationEmployee',
    headerName: '申請者ID/申請者名',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'changeApplicationTimestamp',
    headerName: '申請日時',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'registrationChangeMemo',
    headerName: '登録・変更メモ',
    size: 'm',
    cellType: 'default',
    editable: false,
    tooltip: true,
  },
  {
    field: 'approvalEmployee1',
    headerName: '1次承認者ID/1次承認者名',
    size: 'l',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'approvalEmployee2',
    headerName: '2次承認者ID/2次承認者名',
    size: 'l',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'approvalEmployee3',
    headerName: '3次承認者ID/3次承認者名',
    size: 'l',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'approvalEmployee4',
    headerName: '4次承認者ID/4次承認者名',
    size: 'l',
    cellType: 'default',
    editable: false,
  },
];

/** SCR-TRA-0001：取引管理マスタ一覧 変更履歴タブ */
const ScrTra0001ChangeHistoryTab = () => {
  // router
  const navigate = useNavigate();

  const apiRef = useGridApiRef();

  // state
  // DataGrid：変更履歴
  const [changeHistories, setChangeHistories] = useState<
    ChangeHistoriesRowModel[]
  >([]);
  // DataGrid：変更履歴 Hrefs
  const [changeHistoriesHrefs] = useState<GridHrefsModel[]>([
    { field: 'changeHistoryNumber', hrefs: [] },
  ]);
  // DataGrid：変更履歴 Tooltips
  const [changeHistoriesTooltips] = useState<GridTooltipsModel[]>([
    { field: 'registrationChangeMemo', tooltips: [] },
    { field: 'approverComment', tooltips: [] },
  ]);
  // DataGrid：未承認一覧
  const [unapprovedChangeHistories, setUnapprovedChangeHistories] = useState<
    UnapprovedChangeHistoriesRowModel[]
  >([]);
  // DataGrid：未承認一覧 Hrefs
  const [unapprovedChangeHistoriesHrefs] = useState<GridHrefsModel[]>([
    { field: 'changeHistoryNumber', hrefs: [] },
  ]);
  // DataGrid：未承認一覧 Tooltips
  const [unapprovedChangeHistoriesTooltips] = useState<GridTooltipsModel[]>([
    { field: 'registrationChangeMemo', tooltips: [] },
  ]);

  // 初期表示処理
  useEffect(() => {
    const initialize = async () => {
      await setInitData();
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 変更履歴タブの値取得
   */
  const setInitData = async () => {
    // 変更履歴取得API呼出
    const response = await ScrTra0001GetAccountingDealMasterChangeHistoryInfo();

    // 変更履歴一覧
    changeHistoriesHrefs[0].hrefs.splice(0);
    changeHistoriesTooltips[0].tooltips.splice(0);
    changeHistoriesTooltips[1].tooltips.splice(0);
    if (response.changeHistories.length > 0) {
      // Datagrid用データのセット
      setChangeHistories(
        response.changeHistories.map((o, i) => {
          return {
            id: i,
            changeHistoryNumber: o.changeHistoryNumber,
            screenName: o.screenName,
            tabName: o.tabName ? o.tabName : o.allRegistrationName,
            changeExpectDate: o.changeExpectDate,
            changeApplicationEmployee:
              o.changeApplicationEmployeeId +
              ' ' +
              o.changeApplicationEmployeeName,
            changeApplicationTimestamp: o.changeApplicationTimestamp,
            registrationChangeMemo: o.registrationChangeMemo ? 'あり' : '',
            approvalEmployee:
              o.approvalEmployeeId + ' ' + o.approvalEmployeeName,
            approvalTimestamp: o.approvalTimestamp,
            approverComment: o.approverComment ? 'あり' : '',
          };
        })
      );
      for (let i = 0; i < response.changeHistories.length; i++) {
        const o = response.changeHistories[i];
        // 申請ID href
        changeHistoriesHrefs[0].hrefs.push({
          id: i,
          href:
            '/tra/masters/' +
            o.masterId +
            '?changeHistoryNumber=' +
            o.changeHistoryNumber.toString(),
        });
        // 登録変更メモ tooltip
        if (o.registrationChangeMemo) {
          changeHistoriesTooltips[0].tooltips.push({
            id: i,
            text: o.registrationChangeMemo,
          });
        }
        // 承認者コメント tooltip
        if (o.approverComment) {
          changeHistoriesTooltips[1].tooltips.push({
            id: i,
            text: o.approverComment,
          });
        }
      }
    }

    // 未承認一覧
    unapprovedChangeHistoriesHrefs[0].hrefs.splice(0);
    unapprovedChangeHistoriesTooltips[0].tooltips.splice(0);
    const unapprovedChangeHistories: UnapprovedChangeHistoriesRowModel[] = [];

    for (let i = 0; i < response.unapprovedChangeHistories.length; i++) {
      const o = response.unapprovedChangeHistories[i];
      const tmp: { [key: string]: string | number } = {};
      tmp['id'] = i;
      tmp['changeHistoryNumber'] = o.changeHistoryNumber;
      tmp['screenName'] = o.screenName;
      tmp['tabName'] = o.tabName ? o.tabName : o.allRegistrationName;
      tmp['changeExpectDate'] = o.changeExpectDate;
      tmp['changeApplicationEmployee'] =
        o.changeApplicationEmployeeId + ' ' + o.changeApplicationEmployeeName;
      tmp['changeApplicationTimestamp'] = o.changeApplicationTimestamp;
      tmp['registrationChangeMemo'] = o.registrationChangeMemo ? 'あり' : '';
      tmp['approvalEmployee1'] = '';
      tmp['approvalEmployee2'] = '';
      tmp['approvalEmployee3'] = '';
      tmp['approvalEmployee4'] = '';
      // 1次承認者
      if (o.needApprovalStep >= 1) {
        response.unapprovedApprovalInfos
          .filter((step) => {
            return (
              step.changeHistoryNumber === o.changeHistoryNumber &&
              +step.approvalStepNo === 1
            );
          })
          .forEach((step) => {
            tmp['approvalEmployee1'] =
              step.approvalEmployeeId + ' ' + step.approvalEmployeeName;
          });
      }
      // 2次承認者
      if (o.needApprovalStep >= 2) {
        response.unapprovedApprovalInfos
          .filter((step) => {
            return (
              step.changeHistoryNumber === o.changeHistoryNumber &&
              +step.approvalStepNo === 2
            );
          })
          .forEach((step) => {
            tmp['approvalEmployee2'] =
              step.approvalEmployeeId + ' ' + step.approvalEmployeeName;
          });
      }
      // 3次承認者
      if (o.needApprovalStep >= 3) {
        response.unapprovedApprovalInfos
          .filter((step) => {
            return (
              step.changeHistoryNumber === o.changeHistoryNumber &&
              +step.approvalStepNo === 3
            );
          })
          .forEach((step) => {
            tmp['approvalEmployee3'] =
              step.approvalEmployeeId + ' ' + step.approvalEmployeeName;
          });
      }
      // 4次承認者
      if (o.needApprovalStep >= 4) {
        response.unapprovedApprovalInfos
          .filter((step) => {
            return (
              step.changeHistoryNumber === o.changeHistoryNumber &&
              +step.approvalStepNo === 4
            );
          })
          .forEach((step) => {
            tmp['approvalEmployee4'] =
              step.approvalEmployeeId + ' ' + step.approvalEmployeeName;
          });
      }

      // DataGrid用データのセット
      const rowData: UnapprovedChangeHistoriesRowModel = {
        id: tmp['id'],
        changeHistoryNumber: tmp['changeHistoryNumber'],
        screenName: tmp['screenName'],
        tabName: tmp['tabName'],
        changeExpectDate: tmp['changeExpectDate'],
        changeApplicationEmployee: tmp['changeApplicationEmployee'],
        changeApplicationTimestamp: tmp['changeApplicationTimestamp'],
        registrationChangeMemo: tmp['registrationChangeMemo'],
        approvalEmployee1: tmp['approvalEmployee1'].toString(),
        approvalEmployee2: tmp['approvalEmployee2'].toString(),
        approvalEmployee3: tmp['approvalEmployee3'].toString(),
        approvalEmployee4: tmp['approvalEmployee4'].toString(),
      };
      unapprovedChangeHistories.push(rowData);

      // 申請ID href
      unapprovedChangeHistoriesHrefs[0].hrefs.push({
        id: i,
        href:
          '/tra/deal-masters/' +
          o.masterId +
          '?changeHistoryNumber=' +
          o.changeHistoryNumber.toString(),
      });
      // 登録変更メモ tooltip
      if (o.registrationChangeMemo) {
        unapprovedChangeHistoriesTooltips[0].tooltips.push({
          id: i,
          text: o.registrationChangeMemo,
        });
      }
    }
    setUnapprovedChangeHistories(unapprovedChangeHistories);
  };

  // 申請IDリンククリック
  const handleLinkClick = (url: string) => {
    // 画面遷移
    navigate(url);
  };

  // 変更履歴一覧CSV出力
  const handlChangeHistoriesCsvExport = () => {
    // TODO ファイル名を日時仮設定
    const today = dayjs().format('YYYYMMDD_HHmmssSSS_');
    exportCsv(today + '.csv', apiRef);
  };

  // 未承認一覧CSV出力
  const handleUnapprovedChangeHistoriesCsvExport = () => {
    // TODO ファイル名を日時仮設定
    const today = dayjs().format('YYYYMMDD_HHmmssSSS_');
    exportCsv(today + '.csv', apiRef);
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <Section name='変更履歴一覧'>
            <RowStack justifyContent='flex-end'>
              <OutputButton
                onClick={handlChangeHistoriesCsvExport}
                disable={changeHistories.length === 0}
              >
                CSV出力
              </OutputButton>
            </RowStack>
            <DataGrid
              height={200}
              pagination={true}
              columns={changeHistoriesColumns}
              rows={changeHistories}
              hrefs={changeHistoriesHrefs}
              tooltips={changeHistoriesTooltips}
              onLinkClick={handleLinkClick}
            />
          </Section>
          <Section name='未承認一覧'>
            <RowStack justifyContent='flex-end'>
              <OutputButton
                onClick={handleUnapprovedChangeHistoriesCsvExport}
                disable={unapprovedChangeHistories.length === 0}
              >
                CSV出力
              </OutputButton>
            </RowStack>
            <DataGrid
              height={200}
              pagination={true}
              apiRef={apiRef}
              columns={unapprovedChangeHistoriesColumns}
              rows={unapprovedChangeHistories}
              hrefs={unapprovedChangeHistoriesHrefs}
              tooltips={unapprovedChangeHistoriesTooltips}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrTra0001ChangeHistoryTab;
