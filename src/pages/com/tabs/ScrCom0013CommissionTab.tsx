import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

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
  registrationRequest,
  ScrCom0013DisplayComoditymanagementCommission,
  ScrCom0013DisplayComoditymanagementCommissionRequest,
  ScrCom0013DisplayComoditymanagementCommissionResponse,
} from 'apis/com/ScrCom0013Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { comApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'commissionId',
    headerName: '手数料ID',
    size: 'l',
    cellType: 'link',
  },
  {
    field: 'commissionName',
    headerName: '手数料名',
    size: 'l',
  },
  {
    field: 'commissionType',
    headerName: '手数料種類',
    size: 'l',
  },
  {
    field: 'calculationDocType',
    headerName: '計算書種別',
    size: 'l',
  },
  {
    field: 'utilizationFlg',
    headerName: '利用フラグ',
    size: 's',
  },
  {
    field: 'changeReserve',
    headerName: '変更予約',
    size: 's',
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
  utilizationFlg: string;
  // 変更予約
  changeReserve: string;
}

/**
 * 画面IDの定数
 */
const SCR_COM_0013 = 'SCR-COM-0013';

/**
 * 商品管理表示API(手数料情報表示) レスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0013DisplayComoditymanagementCommissionResponse
): SearchResultRowModel[] => {
  return response.commissionList.map((x) => {
    return {
      id: x.commissionId,
      commissionId: x.commissionId,
      commissionName: x.commissionName,
      commissionType: x.commissionType,
      calculationDocType: x.calculationDocType,
      utilizationFlg: x.utilizationFlg ? '可' : '不可',
      changeReserve: x.changeReserve ? 'あり' : '',
    };
  });
};

/**
 * SCR-COM-0013 商品管理画面 手数料タブ
 * @returns
 */
const ScrCom0013CommissionTab = (props: {
  changeHisoryNumber: string;
  setGoodsBaseValue: (goodsBase: registrationRequest) => void;
}) => {
  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);

  // router
  const navigate = useNavigate();

  // user情報(businessDateも併せて取得)
  const { user } = useContext(AuthContext);

  // CSV
  const apiRef = useGridApiRef();

  // form
  const methods = useForm<SearchResultRowModel>({});
  const {
    formState: { dirtyFields, errors },
    setValue,
    getValues,
    reset,
    watch,
  } = methods;

  /**
   * 初期表示
   */
  // 現在情報の表示
  useEffect(() => {
    const initialize = async () => {
      // CR-COM-0013-0003：商品管理表示API(手数料情報表示）
      const displayComoditymanagementCommissionRequest: ScrCom0013DisplayComoditymanagementCommissionRequest =
        {
          /** 画面ID */
          screenId: SCR_COM_0013,
          /** タブID */
          tabId: 3,
          /** 業務日付 */
          businessDate: user.taskDate,
        };

      const response = await ScrCom0013DisplayComoditymanagementCommission(
        displayComoditymanagementCommissionRequest
      );
      const searchResult = convertToSearchResultRowModel(response);
      setSearchResult(searchResult);

      // hrefsを設定
      const hrefs: GridHrefsModel[] = [{ field: 'commissionId', hrefs: [] }];
      searchResult.forEach((x) => {
        hrefs[0].hrefs.push({
          id: x.commissionId,
          href: '/com/commissions/' + x.commissionId,
        });
      });
      setHrefs(hrefs);
    };

    // 履歴表示
    const historyInitialize = async (changeHisoryNumber: string) => {
      /** API-COM-9999-0025: 変更履歴情報取得API */
      const request = {
        changeHistoryNumber: changeHisoryNumber,
      };
      const response = (
        await comApiClient.post('/com/scr-com-9999/get-history-info', request)
      ).data;
      const commissionBasic = convertToHistoryInfoModel(response);
      // 画面にデータを設定
      reset(commissionBasic);
      props.setGoodsBaseValue(response);
    };

    // 変更履歴番号を受け取っていたら履歴表示
    if (props.changeHisoryNumber !== null) {
      historyInitialize(props.changeHisoryNumber);
      return;
    }

    initialize();
  }, []);

  /**
   * 変更履歴情報取得APIから基本情報データモデルへの変換
   */
  const convertToHistoryInfoModel = (
    response: registrationRequest
  ): SearchResultRowModel => {
    return {
      id: response.commissionId,
      commissionId: response.commissionId,
      commissionName: response.commissionName,
      commissionType: response.commissionType,
      calculationDocType: response.calculationDocType,
      utilizationFlg: response.commissionUtilizationFlg,
      changeReserve: response.commissionChangeReserve,
    };
  };

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
  const handleExportCsvClick = () => {
    exportCsv(user.employeeId + '_' + user.taskDate, apiRef);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            <Section
              fitInside
              name='手数料テーブル一覧'
              decoration={
                <>
                  <AddButton onClick={handleExportCsvClick}>CSV出力</AddButton>
                  {/* 履歴表示の場合 追加ボタン非活性 */}
                  <AddButton
                    onClick={handleIconAddClick}
                    disable={props.changeHisoryNumber === '' ? true : false}
                  >
                    追加
                  </AddButton>
                </>
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
          </FormProvider>
        </MainLayout>
      </MainLayout>
    </>
  );
};
export default ScrCom0013CommissionTab;
