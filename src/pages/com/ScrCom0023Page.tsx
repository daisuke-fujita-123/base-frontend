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

import { getPlace, ScrCom0023GetPlaceResponse } from 'apis/com/ScrCom0023Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'placeCd',
    headerName: '会場コード',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'placeName',
    headerName: '会場名',
    size: 'l',
  },
  {
    field: 'sessionWeekKind',
    headerName: '開催曜日',
    size: 's',
  },
  {
    field: 'omatomePlaceFlag',
    headerName: 'おまとめ会場',
    size: 's',
  },
  {
    field: 'corporationId',
    headerName: '法人ID',
    size: 'm',
  },
  {
    field: 'corporationName',
    headerName: '法人名',
    size: 'l',
  },
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 'm',
  },
  {
    field: 'placeGroup',
    headerName: '会場グループ',
    size: 'm',
  },
  {
    field: 'destinationPlace',
    headerName: '支払先会場名',
    size: 'l',
  },
  {
    field: 'useFlag',
    headerName: '利用フラグ',
    size: 's',
  },
];

/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // internalId
  id: string;
  // 会場コード
  placeCd: string;
  // 会場名
  placeName: string;
  // 開催曜日区分
  sessionWeekKind: string;
  // おまとめ会場フラグ
  omatomePlaceFlag: string;
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 契約ID
  contractId: string;
  // 会場グループ
  placeGroup: string;
  // 支払先会場
  destinationPlace: string;
  // 利用フラグ
  useFlag: string;
}

/**
 * SCR-COM-0023 ライブ会場一覧画面
 */
const ScrCom0023Page = () => {
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
   * ライブ会場一覧取得APIレスポンスから検索結果モデルへの変換
   */
  const convertToSearchResultRowModel = (
    response: ScrCom0023GetPlaceResponse
  ): SearchResultRowModel[] => {
    return response.searchResult.map((x) => {
      return {
        id: x.placeCd,
        placeCd: x.placeCd,
        placeName: x.placeName,
        // 1：日、2：月、3：火、4：水、5：木、6：金、7：土"
        sessionWeekKind:
          x.sessionWeekKind === '1'
            ? '日'
            : x.sessionWeekKind === '2'
            ? '月'
            : x.sessionWeekKind === '3'
            ? '火'
            : x.sessionWeekKind === '4'
            ? '水'
            : x.sessionWeekKind === '5'
            ? '木'
            : x.sessionWeekKind === '6'
            ? '金'
            : x.sessionWeekKind === '7'
            ? '土'
            : '',
        // true => "対象" false => "対象外"
        omatomePlaceFlag: x.omatomePlaceFlag === true ? '対象' : '対象外',
        corporationId: x.corporationId,
        corporationName: x.corporationName,
        contractId: x.contractId,
        placeGroup: x.placeGroup,
        destinationPlace: x.destinationPlace,
        // true => "可" false => "不可"
        useFlag: x.useFlag === true ? '可' : '不可',
      };
    });
  };

  /**
   * 初期画面表示時にライブ会場一覧検索処理を実行
   */
  useEffect(() => {
    const initialize = async () => {
      const request = {
        businessDate: user.taskDate,
        sortKey: 'placeCd',
        sortDirection: 'asc',
        limit: 100,
        offset: 0,
      };
      const response = await getPlace(request);
      const searchResult = convertToSearchResultRowModel(response);

      // 画面にデータを設定
      setSearchResult(searchResult);

      // hrefsを設定
      const hrefs: GridHrefsModel[] = [{ field: 'placeCd', hrefs: [] }];
      searchResult.map((x) => {
        hrefs[0].hrefs.push({
          id: x.placeCd,
          href: '/com/places/' + x.placeCd,
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
    navigate('/com/places/new');
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleExportCsvClick = () => {
    exportCsv('ScrCom0023.csv');
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          {/* ライブ会場一覧 */}
          <Section
            name='ライブ会場一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleExportCsvClick}>CSV出力</AddButton>
                {/* 編集権限なしの場合 非活性 */}
                <AddButton
                  onClick={handleIconAddClick}
                  disable={
                    !user.editPossibleScreenIdList.includes('SCR-COM-0023')
                      ? true
                      : false
                  }
                >
                  追加
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={searchResultColumns}
              rows={searchResult}
              hrefs={hrefs}
              onLinkClick={handleLinkClick}
              // TODO: 利用フラグがfalseの場合は該当レコードグレーアウト
              // => グレーアウトする色のデザインが出来次第修正
              getRowClassName={(params) => {
                if (params.row.useFlag === '不可') return 'hot';
                return '';
              }}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrCom0023Page;
