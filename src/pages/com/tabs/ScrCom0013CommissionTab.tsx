import React, { useEffect, useState } from 'react';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';

import {
  ScrCom0013DisplayComoditymanagementCommission,
  ScrCom0013DisplayComoditymanagementCommissionRequest,
  ScrCom0013DisplayComoditymanagementCommissionResponse
} from 'apis/com/ScrCom0013Api';

import { useNavigate } from 'hooks/useNavigate';

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'commissionId',
    headerName: '手数料ID',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'commissionName',
    headerName: '手数料名',
    size: 'm',
  },
  {
    field: 'commissionType',
    headerName: '手数料種類',
    size: 'm',
  },
  {
    field: 'calculationDocType',
    headerName: '計算書種別',
    size: 'm',
  },
  {
    field: 'utilizationFlg',
    headerName: '利用フラグ',
    size: 'm',
  },
  {
    field: 'changeReserve',
    headerName: '変更予約',
    size: 'm',
  },
];


/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // internalId
  id: string;
  // 手数料ID
  commissionId: string;
  // 手数料名
  commissionName: string;
  // 手数料種類
  commissionType: string;
  // 計算書種別
  calculationDocType: string;
  // 利用フラグ
  utilizationFlg: boolean;
  // 変更予約
  changeReserve: string;
}


/**
 * 商品管理表示API(手数料情報表示) レスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementCommissionResponse
): SearchResultRowModel[] => {
  return response.commissionInfo.map((x) => {
    return {
      id: x.commissionId,
      commissionId: x.commissionId,
      commissionName: x.commissionName,
      commissionType: x.commissionType,
      calculationDocType: x.calculationDocType,
      utilizationFlg: x.utilizationFlg,
      changeReserve: x.changeReserve,
    };
  });
};


/**
 * SCR-COM-0013 商品管理画面 手数料タブ
 * @returns
 */
const ScrCom0013CommissionTab = (props: { changeHisoryNumber: string }) => {
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
      // CR-COM-0013-0003：商品管理表示API(手数料情報表示）
      const displayComoditymanagementCommissionRequest: ScrCom0013DisplayComoditymanagementCommissionRequest = {
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

      const response = await ScrCom0013DisplayComoditymanagementCommission(displayComoditymanagementCommissionRequest);
      const searchResult = convertToSearchResultRowModel(response);
      const hrefs = searchResult.map((x) => {
        return {
          field: 'commissionId',
          id: x.commissionId,
          href: '/com/commissions/' + x.commissionId,
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
    navigate('/com/commissions/new');
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
            name='手数料テーブル一覧'
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
export default ScrCom0013CommissionTab;
