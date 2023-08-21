import React, { useContext, useEffect, useState } from 'react';

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
  ScrCom0013DisplayComoditymanagementCourse,
  ScrCom0013DisplayComoditymanagementCourseRequest,
  ScrCom0013DisplayComoditymanagementCourseResponse,
} from 'apis/com/ScrCom0013Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'courceId',
    headerName: 'コースID',
    size: 'l',
    cellType: 'link',
  },
  {
    field: 'courceName',
    headerName: 'コース名',
    size: 'l',
  },
  {
    field: 'cooperationTargetService',
    headerName: '連携用対象サービス',
    size: 'l',
  },
  {
    field: 'utilizationFlg',
    headerName: '利用フラグ',
    size: 's',
  },
  {
    field: 'reservationExistence',
    headerName: '変更予約',
    size: 's',
  },
  {
    field: 'reflectionSchedule',
    headerName: '反映予定日',
    size: 'm',
  },
];

/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // internalId
  id: string;
  // コースID
  courceId: string;
  // コース名
  courceName: string;
  // 連携用対象サービス
  cooperationTargetService: string;
  // 利用フラグ
  utilizationFlg: string;
  // 予約有無
  reservationExistence: string;
  // 反映予定日
  reflectionSchedule: string;
}

/**
 * 画面IDの定数
 */
const SCR_COM_0013 = 'SCR-COM-0013';

/**
 * 商品管理表示API(コース情報表示) レスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementCourseResponse
): SearchResultRowModel[] => {
  return response.courceInfo.map((x) => {
    return {
      id: x.courceId,
      courceId: x.courceId,
      courceName: x.courceName,
      cooperationTargetService: x.cooperationTargetService,
      utilizationFlg: x.utilizationFlg === true ? '可' : '不可',
      reservationExistence: x.reservationExistence === true ? 'あり' : '',
      reflectionSchedule: x.reflectionSchedule,
    };
  });
};

/**
 * SCR-COM-0013 商品管理画面 コースタブ
 * @returns
 */
const ScrCom0013CourceTab = (props: { changeHisoryNumber: string }) => {
  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);

  // router
  const navigate = useNavigate();

  // user情報(businessDateも併せて取得)
  const { user } = useContext(AuthContext);

  // CSV
  const apiRef = useGridApiRef();

  /**
   * 初期表示
   */
  useEffect(() => {
    const initialize = async () => {
      // SCR-COM-0013-0001: 商品管理表示API(コース情報表示）
      const displayComoditymanagementCourseRequest: ScrCom0013DisplayComoditymanagementCourseRequest =
        {
          /** 画面ID(商品管理画面) */
          screenId: SCR_COM_0013,
          /** タブID */
          tabId: 1,
          /** 業務日付 */
          businessDate: user.taskDate,
        };

      const response = await ScrCom0013DisplayComoditymanagementCourse(
        displayComoditymanagementCourseRequest
      );
      const searchResult = convertToSearchResultRowModel(response);
      setSearchResult(searchResult);

      // hrefsを設定
      const hrefs: GridHrefsModel[] = [{ field: 'courceId', hrefs: [] }];
      searchResult.map((x) => {
        hrefs[0].hrefs.push({
          id: x.courceId,
          href: '/com/course/' + x.courceId,
        });
      });
      setHrefs(hrefs);
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
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    navigate('/com/cources/new');
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleExportCsvClick = () => {
    exportCsv('ScrCom0013CourceTab.csv', apiRef);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <Section
            name='コース一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleExportCsvClick}>CSV出力</AddButton>
                {/* 履歴表示の場合 追加ボタン非活性 */}
                <AddButton
                  onClick={handleIconAddClick}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >
                  追加
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              pagination={true}
              columns={searchResultColumns}
              rows={searchResult}
              hrefs={hrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};
export default ScrCom0013CourceTab;
