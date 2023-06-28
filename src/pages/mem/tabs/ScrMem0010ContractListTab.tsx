import React, { createContext, useEffect, useState } from 'react';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { DataGrid, GridColDef } from 'controls/Datagrid';

import { GridColumnGroupingModel } from '@mui/x-data-grid-pro';
import { useNavigate } from 'hooks/useNavigate';
import { useLocation, useNavigation, useSearchParams } from 'react-router-dom';
import { ScrMem0010GetContract, ScrMem0010GetContractRequest, ScrMem0010GetContractResponse } from 'apis/mem/ScrMem0010Api';
import { MarginBox } from 'layouts/Box';
import { AddButton, CancelButton } from 'controls/Button';
import { Stack } from 'layouts/Stack';
import { memApiClient } from 'providers/ApiClient';

/**
 * 列定義
 */
const contractColumns: GridColDef[] = [
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'feeTotal',
    headerName: '会費合計',
    size: 'm',
  },
  {
    field: 'changeReservationFlag',
    headerName: '変更予約',
  },
  {
    field: 'billingId',
    headerName: '請求ID',
    size: 's',
  },
  {
    field: 'claimMethodKind',
    headerName: '会費請求方法',
    size: 's',
  },
  {
    field: 'courseName',
    headerName: 'コース名',
    size: 'm',
  },
  {
    field: 'courseEntryKind',
    headerName: '参加区分',
    size: 'm',
  },
  {
    field: 'courseFeeTotal',
    headerName: 'コース会費',
    size: 's',
  },
  {
    field: 'courseUseStartDate',
    headerName: '利用開始日',
    size: 's',
  },
  {
    field: 'serviceName',
    headerName: 'オプションサービス',
    size: 'm',
  },
  {
    field: 'contractCount',
    headerName: '数量',
  },
  {
    field: 'optionFeeTotal',
    headerName: 'オプションサービス会費合計',
    size: 'm',
  },
  {
    field: 'optionUseStartDate',
    headerName: '利用開始日',
    size: 's',
  },
];

/**
 * 列グループ定義
 */
const columnGroups: GridColumnGroupingModel = [
  {
    groupId: '契約情報',
    children: [
      { field: 'contractId' },
      { field: 'feeTotal' },
      { field: 'changeReservationFlag' },
    ],
  },
  {
    groupId: '請求先情報',
    children: [
      { field: 'billingId' }, 
      { field: 'claimMethodKind' }
    ],
  },
  {
    groupId: 'コース情報',
    children: [
      { field: 'courseName' },
      { field: 'courseEntryKind' },
      { field: 'courseFeeTotal' },
      { field: 'courseUseStartDate' },
    ],
  },
  {
    groupId: 'オプションサービス情報',
    children: [
      { field: 'serviceName' },
      { field: 'contractCount' },
      { field: 'optionFeeTotal' },
      { field: 'optionUseStartDate' },
    ],
  },
];

/**
 * 契約情報モデル
 */
interface ContractValuesModel {
  tvaaContractList: ContractRowModel[];
  bikeContractList: ContractRowModel[];
}

interface ContractRowModel {
  // internalId
  id: string;
  // 契約ID
  contractId: string;
  // 会費合計
  feeTotal: string;
  // 変更予約
  changeReservationFlag: string;
  // 請求先ID
  billingId: string;
  // 会費請求方法
  claimMethodKind: string;
  // コース名
  courseName: string;
  // 参加区分
  courseEntryKind: string;
  // コース会費
  courseFeeTotal: string;
  // 利用開始日
  courseUseStartDate: string;
  // オプションサービス
  serviceName: string;
  // 数量
  contractCount: string;
  // オプションサービス会費合計
  optionFeeTotal: string;
  // 利用開始日
  optionUseStartDate: string;
}

/**
 * 事業拠点契約コース・サービス一覧取得APIレスポンスから検索結果モデルへの変換
 */
const convertToContractRowModel = (
  response: ScrMem0010GetContractResponse
): ContractValuesModel => {
  return {
    tvaaContractList: response.list1.map((x) => {
      return {
        id: x.contractId,
        // 契約ID
        contractId: x.contractId,
        // 会費合計
        feeTotal: Number(x.feeTotal).toLocaleString(),
        // 変更予約
        changeReservationFlag: x.changeReservationFlag?"あり": "",
        // 請求先ID
        billingId: x.billingId,
        // 会費請求方法
        claimMethodKind: x.claimMethodKind,
        // コース名
        courseName: x.courseName,
        // 参加区分
        courseEntryKind: x.courseEntryKind,
        // コース会費
        courseFeeTotal: Number(x.courseFeeTotal).toLocaleString(),
        // 利用開始日
        courseUseStartDate: x.courseUseStartDate,
        // オプションサービス
        serviceName: x.serviceName,
        // 数量
        contractCount: Number(x.contractCount).toLocaleString(),
        // オプションサービス会費合計
        optionFeeTotal: Number(x.optionFeeTotal).toLocaleString(),
        // 利用開始日
        optionUseStartDate: x.optionUseStartDate,
      };
    }),
    bikeContractList:response.list2.map((x) => {
      return {
        id: x.contractId,
        // 契約ID
        contractId: x.contractId,
        // 会費合計
        feeTotal: Number(x.feeTotal).toLocaleString(),
        // 変更予約
        changeReservationFlag: x.changeReservationFlag?"あり": "",
        // 請求先ID
        billingId: x.billingId,
        // 会費請求方法
        claimMethodKind: x.claimMethodKind,
        // コース名
        courseName: x.courseName,
        // 参加区分
        courseEntryKind: x.courseEntryKind,
        // コース会費
        courseFeeTotal: Number(x.courseFeeTotal).toLocaleString(),
        // 利用開始日
        courseUseStartDate: x.courseUseStartDate,
        // オプションサービス
        serviceName: x.serviceName,
        // 数量
        contractCount: Number(x.contractCount).toLocaleString(),
        // オプションサービス会費合計
        optionFeeTotal: Number(x.optionFeeTotal).toLocaleString(),
        // 利用開始日
        optionUseStartDate: x.optionUseStartDate,
      };
    })
  }
};

/**
 * DatagridColumnGroups
 */
const DatagridColumnGroups = () => {
  // router
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const corporationId = searchParams.get('corporationId');
  const applicationId = searchParams.get('applicationId');
  const businessBaseId = searchParams.get('businessBaseId');
  
  // state
  const [tvaaContract, setTvaaContract] = useState<ContractRowModel[]>([]);
  const [bikeContract, setBikeContract] = useState<ContractRowModel[]>([]);
  const [hrefs, setHrefs] = useState<any[]>([]);

  // 初期表示処理
  useEffect(() => {
    const initialize = async (businessBaseId: string) => {
      // 事業拠点契約コース・サービス一覧取得API
      const request: ScrMem0010GetContractRequest = {
        businessBaseId: businessBaseId,
        businessDate: new Date(),
        limit:'',
      };
      const response = await ScrMem0010GetContract(request);
      const contract = convertToContractRowModel(response);
      const hrefs = contract.tvaaContractList.map((x) => {
        return {
          field: 'contractId',
          id: x.id,
          href: '-?contractId=' + x.id + '#basic'
        };
      });
      contract.bikeContractList.map((x) => {
        hrefs.push( {
          field: 'contractId',
          id: x.id,
          href: '-?contractId=' + x.id + '#basic'
        });
      });
      setTvaaContract(contract.tvaaContractList);
      setBikeContract(contract.bikeContractList);
      setHrefs(hrefs);
    };

    const historyInitialize = async (applicationId: string) => {
      // 変更履歴取得API
      const request = {
        changeHistoryNumber: applicationId
      };
      const response = (await memApiClient.post('/get-history-info', request)).data;
      const contract = convertToContractRowModel(response);
      const hrefs = contract.tvaaContractList.map((x) => {
        return {
          field: 'contractId',
          id: x.id,
          href: '-?contractId=' + x.id + '#basic'
        };
      });
      contract.bikeContractList.map((x) => {
        hrefs.push( {
          field: 'contractId',
          id: x.id,
          href: '-?contractId=' + x.id + '#basic'
        });
      });
      setTvaaContract(contract.tvaaContractList);
      setBikeContract(contract.bikeContractList);
      setHrefs(hrefs);
    }

    if(applicationId !== null){
      historyInitialize(applicationId);
      return
    }

    if(businessBaseId !== null){
      initialize(businessBaseId);
    }

  }, [applicationId, businessBaseId]);

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    alert('TODO：結果結果からCSVを出力する。');
  };
  
  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations/'+ corporationId);
  };

  return (
    <MainLayout>
      <MainLayout main>
        {/* 【四輪】契約情報セクション */}
        <Section 
          name='【四輪】契約情報'
          decoration={
            <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
              <AddButton onClick={handleIconOutputCsvClick}>
                CSV出力
              </AddButton>
            </MarginBox>
          }>
          <DataGrid 
            columns={contractColumns}
            columnGroupingModel={columnGroups}
            rows={tvaaContract}
            hrefs={hrefs}
            onLinkClick={handleLinkClick}
          />
        </Section>
        <Section 
          name='【二輪】契約情報'
          decoration={
            <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
              <AddButton onClick={handleIconOutputCsvClick}>
                CSV出力
              </AddButton>
            </MarginBox>
          }>
          <DataGrid 
            columns={contractColumns}
            columnGroupingModel={columnGroups}
            rows={bikeContract}
            hrefs={hrefs}
            onLinkClick={handleLinkClick}
          />
        </Section>
      </MainLayout>

      {/* bottom */}
      <MainLayout bottom>
        <Stack direction='row' alignItems='center'>
          <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
        </Stack>
      </MainLayout>
    </MainLayout>
  );
};

export default DatagridColumnGroups;
