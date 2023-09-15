// React、mui
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';

import { BlankLayout } from 'layouts/InputLayout';
// レイアウト
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack } from 'layouts/Stack';

// UI
import { SearchButton } from 'controls/Button';
import { DataGrid, GridColDef, GridHrefsModel } from 'controls/Datagrid';
import { Dialog } from 'controls/Dialog';
import { TextField } from 'controls/TextField/TextField';

import {
  ScrTra0001SearchDealAccountingMasterInfo,
  ScrTra0001SearchDealAccountingMasterInfoRequest,
} from 'apis/tra/ScrTra0001Api';

// 共通部品
import { useForm } from 'hooks/useForm';

import { MessageContext } from 'providers/MessageProvider';

import yup from 'utils/validation/ValidationDefinition';

/** モデル定義 */
/** 検索条件モデル */
interface SearchCondition {
  // マスタID
  masterId: string;
  // マスタ名
  masterName: string;
  // キー情報
  primaryKeyColumnName: string;
}

/**
 * 検索条件の初期値
 */
const initSearchCondition: SearchCondition = {
  masterId: '',
  masterName: '',
  primaryKeyColumnName: '',
};

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

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  masterId: yup.string().label('マスタID'),
  masterName: yup.string().label('マスタ名'),
  primaryKeyColumnName: yup.string().label('キー情報'),
};

/** SCR-TRA-0001：取引管理マスタ一覧 基本情報タブ */
const ScrTra0001BasicTab = () => {
  // router
  const navigate = useNavigate();

  // message
  const { getMessage } = useContext(MessageContext);

  // ダイアログ表示用
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  // state
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
  const methods = useForm<SearchCondition>({
    defaultValues: initSearchCondition,
    resolver: yupResolver(yup.object(validationSchama)),
  });
  const { getValues } = methods;

  // 初期表示処理
  useEffect(() => {
    const initialize = () => {
      // マスタ一覧を非表示にする
      setIsHideDealAccountingMasters(true);
    };
    initialize();
  }, []);

  /**
   * 検索ボタンクリック時のイベントハンドラ
   */
  const handleSearch = async () => {
    // 検索条件の取得
    const searchCondition: SearchCondition = getValues();

    setDealAccountingMasters([]);

    // 取引管理マスタ一覧検索API呼出
    const request: ScrTra0001SearchDealAccountingMasterInfoRequest = {
      masterId: searchCondition.masterId,
      masterName: searchCondition.masterName,
      primaryKeyColumnName: searchCondition.primaryKeyColumnName,
    };
    const response = await ScrTra0001SearchDealAccountingMasterInfo(request);

    // 検索結果件数0件の場合は取引管理マスタ一覧を非表示に設定
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
      // setIsHideDealAccountingMasters(false);
    } else {
      const message = getMessage('MSG-FR-INF-00017');
      // ダイアログを表示
      setTitle(message);
      setHandleDialog(true);
    }
    setIsHideDealAccountingMasters(false);
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
            <Section name='取引管理マスタ一覧検索' isSearch>
              <RowStack>
                <ColStack>
                  <TextField label='マスタID' name='masterId' />
                </ColStack>
                <ColStack>
                  <TextField label='マスタ名' name='masterName' size='m' />
                </ColStack>
                <ColStack>
                  <TextField
                    label='キー情報'
                    name='primaryKeyColumnName'
                    size='m'
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
            <Section name='取引管理マスタ一覧' fitInside>
              {isHideDealAccountingMasters ? (
                <></>
              ) : (
                <DataGrid
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
      {/* ダイアログ */}
      <Dialog
        open={handleDialog}
        title={title}
        buttons={[{ name: 'OK', onClick: () => setHandleDialog(false) }]}
      />
    </>
  );
};

export default ScrTra0001BasicTab;
