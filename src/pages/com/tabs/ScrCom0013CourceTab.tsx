import React, { useEffect, useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';

import {
  ScrCom0013DisplayComoditymanagementCourse, ScrCom0013DisplayComoditymanagementCourseRequest,
  ScrCom0013DisplayComoditymanagementCourseResponse
} from 'apis/com/ScrCom0013Api';

import { useNavigate } from 'hooks/useNavigate';

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'courceId',
    headerName: 'コースID',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'courceName',
    headerName: 'コース名',
    size: 'm',
  },
  {
    field: 'cooperationTargetService',
    headerName: '連携用対象サービス',
    size: 'm',
  },
  {
    field: 'utilizationFlg',
    headerName: '利用フラグ',
    size: 'm',
  },
  {
    field: 'reservationExistence',
    headerName: '予約有無',
    size: 'm',
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
  utilizationFlg: boolean;
  // 予約有無
  reservationExistence: boolean;
  // 反映予定日
  reflectionSchedule: string;
}


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
      utilizationFlg: x.utilizationFlg,
      reservationExistence: x.reservationExistence,
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
  const [hrefs, setHrefs] = useState<any[]>([]);

  // router
  const navigate = useNavigate();

  /**
 * 初期表示
 */
  useEffect(() => {
    const initialize = async () => {
      // SCR-COM-0013-0001: 商品管理表示API(コース情報表示）
      const displayComoditymanagementCourseRequest: ScrCom0013DisplayComoditymanagementCourseRequest = {
        /** 画面ID */
        // TODO: ヘッダーからの取得方法
        screenId: '',
        /** タブID */
        // TODO: ヘッダーからの取得方法
        tabId: '',
        /** 業務日付 */
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
      };

      const response = await ScrCom0013DisplayComoditymanagementCourse(displayComoditymanagementCourseRequest);
      const searchResult = convertToSearchResultRowModel(response);
      const hrefs = searchResult.map((x, index) => {
        return {
          field: 'courceId',
          id: x.courceId,
          href: '/com/course/' + x.courceId,
        };
      });
      setSearchResult(searchResult);
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
  const handleIconOutputCsvClick = () => {
    // TODO：CSV機能実装後に変更
    alert('TODO:結果結果からCSVを出力する。');
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
                {/* TODO：エクスポートアイコンに将来的に変更 */}
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                {/* 履歴表示の場合 追加ボタン非活性 */}
                <AddButton
                  onClick={handleIconAddClick}
                  disable={props.changeHisoryNumber === '' ? true : false}
                >追加
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
  )
}
export default ScrCom0013CourceTab;
