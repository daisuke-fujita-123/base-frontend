// React、mui
import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { BlankLayout } from 'layouts/InputLayout';
// レイアウト
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack } from 'layouts/Stack';

// UI
import { SearchButton } from 'controls/Button';
import { DataGrid, GridColDef, GridHrefsModel } from 'controls/Datagrid';
import { TextField } from 'controls/TextField/TextField';

import {
  ScrTra0001SearchDealAccountingMasterInfo,
  ScrTra0001SearchDealAccountingMasterInfoRequest,
} from 'apis/tra/ScrTra0001Api';

// 共通部品
import { useForm } from 'hooks/useForm';

/** モデル定義 */
/** 取引管理マスタ情報データモデル */
interface SearchCondModel {
  // マスタID
  masterId: string;
  // マスタ名
  masterName: string;
  // キー情報
  primaryKeyColumnName: string;
}
/** 取引管理マスタ一覧データモデル */
interface DealAccountingMastersRowModel {
  // ID
  id: number;
  // No
  no: number;
  // マスタID
  masterId: string;
  // マスタ名
  masterName: string;
  // キー情報
  primaryKeyColumnName: string;
  // 件数
  masterCount: number;
}
/** 取引管理マスタ一覧 カラム定義 */
const dealAccountingMastersColumns: GridColDef[] = [
  {
    field: 'no',
    headerName: 'No.',
    size: 's',
    cellType: 'default',
    editable: false,
    filterable: false,
    sortable: false,
  },
  {
    field: 'masterId',
    headerName: 'マスタID',
    size: 'm',
    cellType: 'link',
    editable: false,
    filterable: false,
  },
  {
    field: 'masterName',
    headerName: 'マスタ名',
    size: 'l',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'primaryKeyColumnName',
    headerName: 'キー情報',
    size: 'l',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'masterCount',
    headerName: '件数',
    size: 'm',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
];

/** SCR-TRA-0001：取引管理マスタ一覧 基本情報タブ */
const ScrTra0001BasicTab = () => {
  // router
  const navigate = useNavigate();

  // state
  // 初期表示値
  const [screenData, setScreenData] = useState<SearchCondModel>({
    masterId: '',
    masterName: '',
    primaryKeyColumnName: '',
  });
  // DataGrid：マスタ一覧
  const [dealAccountingMasters, setDealAccountingMasters] = useState<
    DealAccountingMastersRowModel[]
  >([]);
  // DataGrid：マスタ一覧 Hrefs
  const [dealAccountingMastersHrefs] = useState<GridHrefsModel[]>([
    { field: 'masterId', hrefs: [] },
  ]);

  // マスタ一覧を非表示にするフラグ
  const [isHideDealAccountingMasters, setIsHideDealAccountingMasters] =
    useState<boolean>(true);

  // form
  const methods = useForm<SearchCondModel>({});
  const { reset } = methods;

  // 初期表示処理
  useEffect(() => {
    const initialize = async () => {
      await setInitData();
    };

    initialize();
  }, [reset]);

  /**
   * 物流拠点別枝番設定一覧の値取得
   */
  const setInitData = () => {
    // レスポンスを変換、画面にデータを設定
    reset(screenData);
    // マスタ一覧を非表示にする
    setIsHideDealAccountingMasters(true);
  };
  /**
   * 検索ボタンクリック時のイベントハンドラ
   */
  const handleSearch = async () => {
    // 取引管理マスタ一覧を非表示にする
    setIsHideDealAccountingMasters(true);

    // 取引管理マスタ一覧検索API呼出
    const request: ScrTra0001SearchDealAccountingMasterInfoRequest = {
      masterId: screenData.masterId,
      masterName: screenData.masterName,
      primaryKeyColumnName: screenData.primaryKeyColumnName,
    };
    const response = await ScrTra0001SearchDealAccountingMasterInfo(request);

    // 検索結果件数0件の場合は取引管理マスタ一覧を非表示に設定
    dealAccountingMastersHrefs[0].hrefs.splice(0);
    if (response.dealAccountingMasters.length > 0) {
      for (let i = 0; i < response.dealAccountingMasters.length; i++) {
        dealAccountingMastersHrefs[0].hrefs.push({
          id: i,
          href: '/tra/masters/' + response.dealAccountingMasters[i].masterId,
        });
      }
      setDealAccountingMasters(
        response.dealAccountingMasters.map((o, i) => {
          return {
            id: i,
            no: o.no,
            masterId: o.masterId,
            masterName: o.masterName,
            primaryKeyColumnName: o.primaryKeyColumnName,
            masterCount: o.masterCount,
          };
        })
      );
      setIsHideDealAccountingMasters(false);
    }
  };

  // 申請IDリンククリック
  const handleLinkClick = (url: string) => {
    // 画面遷移
    navigate(url);
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Section name='取引管理マスタ一覧検索'>
              <RowStack>
                <ColStack>
                  <TextField label='マスタID' name='masterId' readonly />
                </ColStack>
                <ColStack>
                  <TextField
                    label='マスタ名'
                    name='masterName'
                    size='m'
                    readonly
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='キー情報'
                    name='primaryKeyColumnName'
                    size='m'
                    readonly
                  />
                </ColStack>
              </RowStack>
              <RowStack>
                <BlankLayout />
              </RowStack>
              <RowStack>
                <SearchButton onClick={handleSearch}>検索</SearchButton>
              </RowStack>
            </Section>
            <Section name='取引管理マスタ一覧'>
              {isHideDealAccountingMasters ? (
                <></>
              ) : (
                <DataGrid
                  // height={200}
                  pagination={true}
                  columns={dealAccountingMastersColumns}
                  rows={dealAccountingMasters}
                  hrefs={dealAccountingMastersHrefs}
                  onLinkClick={handleLinkClick}
                />
              )}
            </Section>
          </FormProvider>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrTra0001BasicTab;
