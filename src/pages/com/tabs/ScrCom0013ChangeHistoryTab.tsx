import React, { useEffect, useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
} from 'controls/Datagrid';

import {
  ScrCom0013DisplayComoditymanagementHistory,
  ScrCom0013DisplayComoditymanagementHistoryResponse,
} from 'apis/com/ScrCom0013Api';

import { useNavigate } from 'hooks/useNavigate';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 検索条件列定義(変更履歴一覧セクション)
 */
const changeHistorySearchResultColumns: GridColDef[] = [
  {
    field: 'applicationId',
    headerName: '申請ID',
    size: 'l',
    cellType: 'link',
  },
  {
    field: 'applicationScreen',
    headerName: '申請元画面',
    size: 'l',
  },
  {
    field: 'tabName',
    headerName: 'タブ名/一括登録',
    size: 'l',
  },
  {
    field: 'changeDate',
    headerName: '変更日',
    size: 'l',
  },
  {
    field: 'applicantId',
    headerName: '申請者ID/申請者名',
    size: 'l',
  },
  {
    field: 'applicantDate',
    headerName: '申請日時',
    size: 'l',
  },
  {
    field: 'registChangeMemo',
    headerName: '登録・変更メモ',
    size: 'l',
    tooltip: true,
  },
  {
    field: 'lastApproverId',
    headerName: '最終承認者ID/最終承認者名',
    size: 'l',
  },
  {
    field: 'lastApproveDate',
    headerName: '最終承認日時',
    size: 'l',
  },
  {
    field: 'lastApproveComment',
    headerName: '最終承認者コメント',
    tooltip: true,
    size: 'l',
  },
];

/**
 * 検索結果行データモデル(変更履歴一覧セクション)
 */
interface ChangeHistorySearchResultRowModel {
  // internalId
  id: number;
  // 申請ID
  applicationId: number;
  // 申請元画面ID
  applicationScreenId: string;
  // 申請元画面
  applicationScreen: string;
  // タブID
  tabId: number;
  // タブ名/一括登録
  tabName: string;
  // 変更日
  changeDate: string;
  // 申請者ID/申請者名
  applicantName: string;
  // 申請日時
  applicantDate: string;
  // 登録・変更メモ
  registChangeMemo: string;
  // 最終承認者ID/最終承認者名
  lastApproverName: string;
  // 最終承認日時
  lastApproveDate: string;
  // 最終承認者コメント
  lastApproveComment: string;
}

/**
 * 検索条件列定義(未承認一覧セクション)
 */
const unApprovedSearchResultColumns: GridColDef[] = [
  {
    field: 'applicationId',
    headerName: '申請ID',
    size: 'l',
    cellType: 'link',
  },
  {
    field: 'applicationScreen',
    headerName: '申請元画面',
    size: 'l',
  },
  {
    field: 'tabName',
    headerName: 'タブ名/一括登録',
    size: 'l',
  },
  {
    field: 'changeDate',
    headerName: '変更日',
    size: 'l',
  },
  {
    field: 'applicantName',
    headerName: '申請者ID/申請者名',
    size: 'l',
  },
  {
    field: 'applicantDate',
    headerName: '申請日時',
    size: 'l',
  },
  {
    field: 'registChangeMemo',
    headerName: '登録・変更メモ',
    size: 'l',
    tooltip: true,
  },
  {
    field: 'approveStatus',
    headerName: '承認ステータス',
    size: 'l',
  },
  {
    field: 'firstApproverId',
    headerName: '1次承認者ID/1次承認者名',
    size: 'l',
  },
  {
    field: 'secondApproverId',
    headerName: '2次承認者ID/2次承認者名',
    size: 'l',
  },
  {
    field: 'thirdApproverId',
    headerName: '3次承認者ID/3次承認者名',
    size: 'l',
  },
  {
    field: 'forthApproverId',
    headerName: '4次承認者ID/4次承認者名',
    size: 'l',
  },
];

/**
 * 検索結果行データモデル(未承認一覧セクション)
 */
interface unApprovedSearchResultRowModel {
  // internalId
  id: number;
  // 申請ID
  applicationId: number;
  // 申請元画面ID
  applicationScreenId: string;
  // 申請元画面
  applicationScreen: string;
  // タブID
  tabId: number;
  // タブ名/一括登録
  tabName: string;
  // 変更日
  changeDate: string;
  // 申請者ID/申請者名
  applicantName: string;
  // 申請日時
  applicantDate: string;
  // 登録・変更メモ
  registChangeMemo: string;
  // 承認ステータス
  approveStatus: string;
  // 1次承認者ID/最終承認者名
  firstApproverName: string;
  // 2次承認者ID/最終承認者名
  secondApproverName: string;
  // 3次承認者ID/最終承認者名
  thirdApproverName: string;
  // 4次承認者ID/最終承認者名
  forthApproverName: string;
}

/**
 * 商品管理表示API(変更履歴情報表示) レスポンスから 変更履歴一覧セクション検索結果モデルへの変換
 */
const convertToChangeHistorySearchResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementHistoryResponse
): ChangeHistorySearchResultRowModel[] => {
  return response.chgHistoryApproveInfo.map((x) => {
    return {
      id: x.applicationId,
      applicationId: x.applicationId,
      applicationScreenId: x.applicationScreenId,
      applicationScreen: x.applicationScreen,
      tabId: x.tabId,
      tabName: x.tabName,
      changeDate: x.changeDate,
      // ID 名前 と接続して表示する
      applicantId: x.applicantId + '  ' + x.applicantName,
      applicantName: '',
      applicantDate: x.applicantDate,
      // 空ではない場合はありと表示する
      registChangeMemo: x.registChangeMemo !== '' ? 'あり' : '',
      // ID 名前 と接続して表示する
      lastApproverId: x.lastApproverId + '  ' + x.lastApproverName,
      lastApproverName: '',
      lastApproveDate: x.lastApproveDate,
      lastApproveComment: x.lastApproveComment !== '' ? 'あり' : '',
    };
  });
};

/**
 * 商品管理表示API(変更履歴情報表示) レスポンスから 未承認一覧セクション検索結果モデルへの変換
 */
const convertToUnApprovedSearchResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementHistoryResponse
): unApprovedSearchResultRowModel[] => {
  return response.chgHistoryNotApproveInfo.map((x) => {
    return {
      id: x.applicationId,
      applicationId: x.applicationId,
      applicationScreenId: x.applicationScreenId,
      applicationScreen: x.applicationScreen,
      tabId: x.tabId,
      tabName: x.tabName,
      changeDate: x.changeDate,
      applicantName: x.applicantName,
      applicantDate: x.applicantDate,
      // 空ではない場合はありと表示する
      registChangeMemo: x.registChangeMemo !== '' ? 'あり' : '',
      approveStatus: x.approveStatus,
      // ID 名前 と接続して表示する
      firstApproverName: x.firstApproverId + '  ' + x.firstApproverName,
      // ID 名前 と接続して表示する
      secondApproverName: x.secondApproverId + '  ' + x.secondApproverName,
      // ID 名前 と接続して表示する
      thirdApproverName: x.thirdApproverId + '  ' + x.thirdApproverName,
      // ID 名前 と接続して表示する
      forthApproverName: x.forthApproverId + '  ' + x.forthApproverName,
    };
  });
};

/**
 * 画面ID 定数定義
 */
const SCR_COM_0013 = 'SCR-COM-0013';
const SCR_COM_0014 = 'SCR-COM-0014';
const SCR_COM_0015 = 'SCR-COM-0015';
const SCR_COM_0016 = 'SCR-COM-0016';

/**
 * SCR-COM-0013 商品管理画面 変更履歴タブ
 */
const ScrCom0013ChangeHistoryTab = (props: { changeHisoryNumber: string }) => {
  // state
  // 変更履歴一覧セクション
  const [changeHistorySearchResult, setChangeHistorySearchResult] = useState<
    ChangeHistorySearchResultRowModel[]
  >([]);
  const [changeHistoryHrefs, setChangeHistoryHrefs] = useState<
    GridHrefsModel[]
  >([]);
  const [changeHistoryTooltips, setChangeHistoryTooltips] = useState<any[]>([]);
  // 未承認一覧セクション
  const [unApprovedSearchResult, setUnApprovedSearchResult] = useState<
    unApprovedSearchResultRowModel[]
  >([]);
  const [unApprovedHrefs, setUnApprovedHrefs] = useState<GridHrefsModel[]>([]);
  const [unApprovedTooltips, setunApprovedTooltips] = useState<any[]>([]);

  // router
  const navigate = useNavigate();

  // CSV
  const apiRef = useGridApiRef();

  /**
   * 初期表示
   */
  useEffect(() => {
    const initialize = async () => {
      // SCR-COM-0013-0005：商品管理表示API(変更履歴情報表示）
      const response = await ScrCom0013DisplayComoditymanagementHistory();

      // 変更履歴一覧セクション
      const changeHistorysearchResult =
        convertToChangeHistorySearchResultRowModel(response);

      // hrefs設定
      const changeHistoryHrefs: GridHrefsModel[] = [
        { field: 'applicationId', hrefs: [] },
      ];
      changeHistorysearchResult.map((x) => {
        // コース詳細画面
        if (x.applicationScreen === SCR_COM_0016) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/course/' + x.applicationId,
          });
          // 商品管理画面（サービスタブ）
        } else if (x.applicationScreenId === SCR_COM_0014 && x.tabId === 2) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/goods#service/' + x.applicationId,
          });
          // 商品管理画面（値引値増タブ）
        } else if (x.applicationScreenId === SCR_COM_0014 && x.tabId === 4) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/goods#discount-price-increase/' + x.applicationId,
          });
          // 手数料テーブル詳細画面
        } else if (x.applicationScreenId === SCR_COM_0013) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/commissions/' + x.applicationId,
          });
          // 手数料値引値増パック画面
        } else if (x.applicationScreenId === SCR_COM_0015) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/commission-discount-packs/' + x.applicationId,
          });
        }
      });
      setChangeHistoryHrefs(changeHistoryHrefs);

      // ツールチップ設定
      const changeHistoryTooltips: any[] = [];
      response.chgHistoryApproveInfo.map((x) => {
        changeHistoryTooltips.push({
          field: 'registrationChangeMemo',
          id: x.applicationId,
          value: 'あり',
          text: x.registChangeMemo,
        });
        changeHistoryTooltips.push({
          field: 'approverComment',
          id: x.applicationId,
          value: 'あり',
          text: x.lastApproveComment,
        });
      });
      setChangeHistoryTooltips(changeHistoryTooltips);

      // 画面に設定
      setChangeHistorySearchResult(changeHistorysearchResult);

      // 未承認一覧セクション
      const unApprovedSearchResult =
        convertToUnApprovedSearchResultRowModel(response);

      // hrefs設定
      const unApprovedHrefs: GridHrefsModel[] = [
        { field: 'applicationId', hrefs: [] },
      ];
      unApprovedSearchResult.map((x) => {
        // コース詳細画面
        if (x.applicationScreen === SCR_COM_0016) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/course/' + x.applicationId,
          });
          // 商品管理画面（サービスタブ）
        } else if (x.applicationScreenId === SCR_COM_0014 && x.tabId === 2) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/goods#service/' + x.applicationId,
          });
          // 商品管理画面（値引値増タブ）
        } else if (x.applicationScreenId === SCR_COM_0014 && x.tabId === 4) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/goods#discount-price-increase/' + x.applicationId,
          });
          // 手数料テーブル詳細画面
        } else if (x.applicationScreenId === SCR_COM_0013) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/commissions/' + x.applicationId,
          });
          // 手数料値引値増パック画面
        } else if (x.applicationScreenId === SCR_COM_0015) {
          changeHistoryHrefs[0].hrefs.push({
            id: x.applicationId,
            href: '/com/commission-discount-packs/' + x.applicationId,
          });
        }
      });
      setUnApprovedHrefs(unApprovedHrefs);

      // ツールチップ設定
      const notPermissionTooltips = response.chgHistoryNotApproveInfo.map(
        (x) => {
          return {
            field: 'registrationChangeMemo',
            id: x.applicationId,
            value: 'あり',
            text: x.registChangeMemo,
          };
        }
      );
      setunApprovedTooltips(notPermissionTooltips);

      // 画面に設定
      setUnApprovedSearchResult(unApprovedSearchResult);
    };

    initialize();
  }, []);

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * 変更履歴一覧セクション CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleExportCsvClick = () => {
    exportCsv('ScrCom0013ChangeHistoryTab.csv', apiRef);
  };
  /**
   * 未承認一覧セクションCSV出力アイコンクリック時のイベントハンドラ
   */
  const unApprovedhandleIconOutputCsvClick = () => {
    exportCsv('ScrCom0013ChangeHistoryTabUnApproved.csv', apiRef);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <Section
            name='変更履歴一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleExportCsvClick}>CSV出力</AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              pagination={true}
              columns={changeHistorySearchResultColumns}
              rows={changeHistorySearchResult}
              tooltips={changeHistoryTooltips}
              hrefs={changeHistoryHrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
          <Section
            name='未承認一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={unApprovedhandleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              pagination={true}
              columns={unApprovedSearchResultColumns}
              rows={unApprovedSearchResult}
              tooltips={unApprovedTooltips}
              hrefs={unApprovedHrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};
export default ScrCom0013ChangeHistoryTab;
