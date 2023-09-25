// React、mui
import React, { useEffect, useState } from 'react';

// レイアウト
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { OutputButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
  GridTooltipsModel,
} from 'controls/Datagrid';

import {
  ScrTra0001GetAccountingDealMasterChangeHistoryInfo,
  ScrTra0001GetAccountingDealMasterChangeHistoryInfoResponse,
} from 'apis/tra/ScrTra0001Api';

import { useNavigate } from 'hooks/useNavigate';

import { useGridApiRef } from '@mui/x-data-grid-pro';
import dayjs from 'dayjs';

/** モデル定義 */
/** 変更履歴情報データモデル */
interface ChangeHistoryRowModel {
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
/** 未承認情報データモデル */
interface UnapprovedChangeHistoryRowModel {
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

/**
 * Hrefモデル
 */
interface HrefModel {
  id: string | number;
  href: string;
}

/**
 * Tooltipモデル
 */
interface TooltipModel {
  id: string | number;
  text: string;
}

/** 変数定義 */
/** 変更履歴一覧 カラム定義 */
const changeHistoryColumns: GridColDef[] = [
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
const unapprovedChangeHistoryColumns: GridColDef[] = [
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
/**
 * レスポンスを変更履歴情報データモデルに変換
 * @param response 取引管理マスタ一覧情報取得API レスポンス.変更履歴情報配列
 * @returns 変更履歴情報データモデル
 */
const convertToChangeHistoryRows = (
  response: ScrTra0001GetAccountingDealMasterChangeHistoryInfoResponse['changeHistories']
): ChangeHistoryRowModel[] => {
  const changeHistoryModels: ChangeHistoryRowModel[] = [];
  response.forEach((c, index) => {
    changeHistoryModels.push({
      id: index,
      changeHistoryNumber: c.changeHistoryNumber,
      screenName: c.screenName,
      tabName: c.tabName ? c.tabName : c.allRegistrationName,
      changeExpectDate: c.changeExpectDate,
      changeApplicationEmployee:
        c.changeApplicationEmployeeId + ' ' + c.changeApplicationEmployeeName,
      changeApplicationTimestamp: c.changeApplicationTimestamp,
      registrationChangeMemo: c.registrationChangeMemo ? 'あり' : '',
      approvalEmployee: c.approvalEmployeeId + ' ' + c.approvalEmployeeName,
      approvalTimestamp: c.approvalTimestamp,
      approverComment: c.approverComment ? 'あり' : '',
    });
  });
  return changeHistoryModels;
};

/**
 * レスポンスをhrefリンクデータモデルに変換
 * @param response 取引管理マスタ一覧情報取得API レスポンス.変更履歴情報配列
 * @returns hrefリンクデータモデル
 */
const convertToChangeHistoryHrefs = (
  response: ScrTra0001GetAccountingDealMasterChangeHistoryInfoResponse['changeHistories']
): GridHrefsModel[] => {
  const changeHistoryHrefsModel: GridHrefsModel[] = [];
  const hrefsModel: HrefModel[] = [];
  response.forEach((c, index) => {
    hrefsModel.push({
      id: index,
      href:
        '/tra/masters/' +
        c.masterId +
        '?changeHistoryNumber=' +
        c.changeHistoryNumber.toString(),
    });
  });
  changeHistoryHrefsModel.push({
    field: 'changeHistoryNumber',
    hrefs: hrefsModel,
  });
  return changeHistoryHrefsModel;
};

/**
 * レスポンスをツールチップデータモデルに変換
 * @param response 取引管理マスタ一覧情報取得API レスポンス.変更履歴情報配列
 * @returns ツールチップデータモデル
 */
const convertToChangeHistoryTooltips = (
  response: ScrTra0001GetAccountingDealMasterChangeHistoryInfoResponse['changeHistories']
): GridTooltipsModel[] => {
  const changeHistoryTooltipModel: GridTooltipsModel[] = [];
  const memoTooltips: TooltipModel[] = [];
  const approverTooltips: TooltipModel[] = [];

  for (let i = 0; i < response.length; i++) {
    const changeHistory = response[i];
    if (changeHistory.registrationChangeMemo !== null) {
      memoTooltips.push({
        id: i,
        text: changeHistory.registrationChangeMemo,
      });
    }
    if (changeHistory.approverComment !== null) {
      approverTooltips.push({
        id: i,
        text: changeHistory.approverComment,
      });
    }
  }

  changeHistoryTooltipModel.push({
    field: 'registrationChangeMemo',
    tooltips: memoTooltips,
  });

  changeHistoryTooltipModel.push({
    field: 'approverComment',
    tooltips: approverTooltips,
  });

  return changeHistoryTooltipModel;
};

/**
 * レスポンスを未承認情報データモデルに変換
 * @param response 取引管理マスタ一覧情報取得API レスポンス
 * @returns 未承認情報データモデル
 */
const convertToUnapprovedChangeHistoryRows = (
  response: ScrTra0001GetAccountingDealMasterChangeHistoryInfoResponse
): UnapprovedChangeHistoryRowModel[] => {
  const unapprovedChangeHistoryRowModel: UnapprovedChangeHistoryRowModel[] = [];
  response.unapprovedChangeHistories.forEach((u, index) => {
    const approvalEmployee = ['', '', '', ''];
    response.unapprovedApprovalInfos
      .filter((step) => {
        return (
          step.changeHistoryNumber === u.changeHistoryNumber &&
          step.approvalStepNo <= u.needApprovalStep
        );
      })
      .forEach((step, index) => {
        approvalEmployee[index] =
          step.approvalEmployeeId + ' ' + step.approvalEmployeeName;
      });

    unapprovedChangeHistoryRowModel.push({
      id: index,
      changeHistoryNumber: u.changeHistoryNumber,
      screenName: u.screenName,
      tabName: u.tabName,
      changeExpectDate: u.changeExpectDate,
      changeApplicationEmployee:
        u.changeApplicationEmployeeId + ' ' + u.changeApplicationEmployeeName,
      changeApplicationTimestamp: u.changeApplicationTimestamp,
      registrationChangeMemo: u.registrationChangeMemo ? 'あり' : '',
      approvalEmployee1: approvalEmployee[0],
      approvalEmployee2: approvalEmployee[1],
      approvalEmployee3: approvalEmployee[2],
      approvalEmployee4: approvalEmployee[3],
    });
  });
  return unapprovedChangeHistoryRowModel;
};

/**
 * レスポンスをhrefリンクデータモデルに変換
 * @param response 取引管理マスタ一覧情報取得API レスポンス.未承認変更履歴情報配列
 * @returns hrefリンクデータモデル
 */
const convertToUnapprovedChangeHistoryHrefs = (
  response: ScrTra0001GetAccountingDealMasterChangeHistoryInfoResponse['unapprovedChangeHistories']
): GridHrefsModel[] => {
  const changeHistoryHrefsModel: GridHrefsModel[] = [];
  const hrefsModel: HrefModel[] = [];
  response.forEach((c, index) => {
    hrefsModel.push({
      id: index,
      href:
        '/tra/masters/' +
        c.masterId +
        '?changeHistoryNumber=' +
        c.changeHistoryNumber.toString(),
    });
  });
  changeHistoryHrefsModel.push({
    field: 'changeHistoryNumber',
    hrefs: hrefsModel,
  });
  return changeHistoryHrefsModel;
};

/**
 * レスポンスをツールチップデータモデルに変換
 * @param response 取引管理マスタ一覧情報取得API レスポンス.未承認変更履歴情報配列
 * @returns ツールチップデータモデル
 */
const convertToUnapprovedChangeHistoriesTooltips = (
  response: ScrTra0001GetAccountingDealMasterChangeHistoryInfoResponse['unapprovedChangeHistories']
): GridTooltipsModel[] => {
  const changeHistoryTooltipModel: GridTooltipsModel[] = [];
  const memoTooltips: TooltipModel[] = [];

  for (let i = 0; i < response.length; i++) {
    const changeHistory = response[i];
    if (changeHistory.registrationChangeMemo !== null) {
      memoTooltips.push({
        id: i,
        text: changeHistory.registrationChangeMemo,
      });
    }
  }
  changeHistoryTooltipModel.push({
    field: 'registrationChangeMemo',
    tooltips: memoTooltips,
  });

  return changeHistoryTooltipModel;
};

/** SCR-TRA-0001：取引管理マスタ一覧 変更履歴タブ */
const ScrTra0001ChangeHistoryTab = () => {
  // router
  const navigate = useNavigate();

  const changeApiRef = useGridApiRef();
  const unapprovedApiRef = useGridApiRef();

  // state
  // DataGrid：変更履歴const
  const [changeHistoryRows, setChangeHistoryRows] = useState<
    ChangeHistoryRowModel[]
  >([]);
  // DataGrid：変更履歴 Hrefs
  const [changeHistoryHrefs, setChangeHistoryHrefs] = useState<
    GridHrefsModel[]
  >([]);
  // DataGrid：変更履歴 Tooltips
  const [changeHistoriesTooltips, setChangeHistoryTooltips] = useState<
    GridTooltipsModel[]
  >([]);
  // DataGrid：未承認一覧
  const [unapprovedChangeHistoryRows, setUnapprovedChangeHistoryRows] =
    useState<UnapprovedChangeHistoryRowModel[]>([]);
  // DataGrid：未承認一覧 Hrefs
  const [unapprovedChangeHistoryHrefs, setUnapprovedChangeHistoryHrefs] =
    useState<GridHrefsModel[]>([]);
  // DataGrid：未承認一覧 Tooltips
  const [unapprovedChangeHistoryTooltips, setUnapprovedChangeHistoryTooltips] =
    useState<GridTooltipsModel[]>([]);

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
    if (response.changeHistories.length > 0) {
      setChangeHistoryRows(() => {
        return convertToChangeHistoryRows(response.changeHistories);
      });
      setChangeHistoryHrefs(() => {
        return convertToChangeHistoryHrefs(response.changeHistories);
      });
      setChangeHistoryTooltips(() => {
        return convertToChangeHistoryTooltips(response.changeHistories);
      });
    }

    // 未承認一覧
    if (response.unapprovedChangeHistories.length > 0) {
      setUnapprovedChangeHistoryRows(() => {
        return convertToUnapprovedChangeHistoryRows(response);
      });

      setUnapprovedChangeHistoryHrefs(() => {
        return convertToUnapprovedChangeHistoryHrefs(
          response.unapprovedChangeHistories
        );
      });

      setUnapprovedChangeHistoryTooltips(() => {
        return convertToUnapprovedChangeHistoriesTooltips(
          response.unapprovedChangeHistories
        );
      });
    }
  };

  // 申請IDリンククリック
  const handleLinkClick = (url: string) => {
    // 画面遷移
    navigate(url);
  };

  // 変更履歴一覧CSV出力
  const handlChangeHistorysCsvExport = () => {
    // TODO ファイル名を日時仮設定
    const filename = dayjs().format('YYYYMMDD_HHmmssSSS') + '_変更履歴一覧';
    exportCsv(filename + '.csv', changeApiRef);
  };

  // 未承認一覧CSV出力
  const handleUnapprovedChangeHistoryCsvExport = () => {
    // TODO ファイル名を日時仮設定
    const filename = dayjs().format('YYYYMMDD_HHmmssSSS') + '_未承認一覧';
    exportCsv(filename + '.csv', unapprovedApiRef);
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <Section
            name='変更履歴一覧'
            fitInside
            decoration={
              <OutputButton onClick={handlChangeHistorysCsvExport}>
                CSV出力
              </OutputButton>
            }
          >
            <DataGrid
              apiRef={changeApiRef}
              pagination={true}
              columns={changeHistoryColumns}
              rows={changeHistoryRows}
              hrefs={changeHistoryHrefs}
              tooltips={changeHistoriesTooltips}
              onLinkClick={handleLinkClick}
            />
          </Section>
          <Section
            name='未承認一覧'
            fitInside
            decoration={
              <OutputButton onClick={handleUnapprovedChangeHistoryCsvExport}>
                CSV出力
              </OutputButton>
            }
          >
            <DataGrid
              pagination={false}
              apiRef={unapprovedApiRef}
              columns={unapprovedChangeHistoryColumns}
              rows={unapprovedChangeHistoryRows}
              hrefs={unapprovedChangeHistoryHrefs}
              tooltips={unapprovedChangeHistoryTooltips}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrTra0001ChangeHistoryTab;
