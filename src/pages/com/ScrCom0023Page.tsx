import React, { useState, useEffect, useContext } from 'react';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { MarginBox } from 'layouts/Box';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { AddButton } from 'controls/Button';
import { useNavigate } from 'hooks/useNavigate';
import { ScrCom0023GetPlaceRequest, ScrCom0023GetPlaceResponse, getPlace } from 'apis/com/ScrCom0023Api';
import { AppContext } from 'providers/AppContextProvider';


/**
* 検索条件データモデル
*/
interface SearchConditionModel {
  // 業務日付
  businessDate: string;
  // ソートキー
  sortKey: string;
  // ソート方向
  sortDirection: string;
  // リミット
  limit: number;
  // オフセット
  offset: number;
}

/**
 * 取得用検索条件初期データ
 */
const initialValues: SearchConditionModel = {
  // TODO:業務日付取得方法実装待ち
  businessDate: '',
  sortKey: 'placeCd',
  sortDirection: 'asc',
  limit: 100,
  offset: 0,
};

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'placeCd',
    headerName: '会場コード',
    width: 128,
    cellType: 'link',
  },
  {
    field: 'placeName',
    headerName: '会場名',
    width: 128,
  },
  {
    field: 'sessionWeekKind',
    headerName: '開催曜日',
    width: 128,
  },
  {
    field: 'omatomePlaceFlag',
    headerName: 'おまとめ会場',
    width: 128,
  },
  {
    field: 'corporationId',
    headerName: '法人ID',
    width: 128,
  },
  {
    field: 'corporationName',
    headerName: '法人名',
    width: 128,
  },
  {
    field: 'contractId',
    headerName: '契約ID',
    width: 128,
  },
  {
    field: 'placeGroup',
    headerName: '会場グループ',
    width: 128,
  },
  {
    field: 'destinationPlace',
    headerName: '支払先会場名',
    width: 128,
  },
  {
    field: 'useFlag',
    headerName: '利用フラグ',
    width: 128,
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
  omatomePlaceFlag: boolean;
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
  useFlag: boolean;
}

/**
 * 検索条件モデルからライブ会場一覧取得APIリクエストへの変換
 */
const convertFromSearchConditionModel = (SearchCondition: SearchConditionModel): ScrCom0023GetPlaceRequest => {
  return {
    businessDate: SearchCondition.businessDate,
    sortKey: SearchCondition.sortKey,
    sortDirection: SearchCondition.sortDirection,
    limit: SearchCondition.limit,
    offset: SearchCondition.offset,
  }
}

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
      sessionWeekKind: x.sessionWeekKind,
      omatomePlaceFlag: x.omatomePlaceFlag,
      corporationId: x.corporationId,
      corporationName: x.corporationName,
      contractId: x.contractId,
      placeGroup: x.placeGroup,
      destinationPlace: x.destinationPlace,
      useFlag: x.useFlag,
    };
  });
};


/**
 * SCR-COM-0023 ライブ会場一覧画面
 */
const ScrCom0023Page = () => {

  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [hrefs, setHrefs] = useState<any[]>([]);

  // router
  const navigate = useNavigate();

  // user情報(businessDateも併せて取得)
  const { appContext } = useContext(AppContext);

  /**
   * 初期画面表示時にライブ会場一覧検索処理を実行
   */
  useEffect(() => {
    const initialize = async () => {
      const request = convertFromSearchConditionModel(initialValues);
      const response = await getPlace(request);
      const searchResult = convertToSearchResultRowModel(response);
      const hrefs = searchResult.map((x) => {
        return {
          field: 'placeCd',
          id: x.placeCd,
          href: '/com/places/' + x.placeCd,
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
    // TODO：新規作成用URI決定後に変更
    navigate('/com/places/');
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
          {/* ライブ会場一覧 */}
          <Section
            name='ライブ会場一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                {/* TODO：エクスポートアイコンに将来的に変更 */}
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                <AddButton onClick={handleIconAddClick}>追加</AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={searchResultColumns}
              rows={searchResult}
              hrefs={hrefs}
              // TODO: ページング処理不要
              pageSize={10}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  )
};

export default ScrCom0023Page;
