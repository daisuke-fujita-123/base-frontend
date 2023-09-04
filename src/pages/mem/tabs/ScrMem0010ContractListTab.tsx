import React, { useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { Stack } from 'layouts/Stack';

import { AddButton, CancelButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
} from 'controls/Datagrid';

import {
  ScrMem0010GetContract,
  ScrMem0010GetContractRequest,
  ScrMem0010GetContractResponse,
} from 'apis/mem/ScrMem0010Api';

import { useNavigate } from 'hooks/useNavigate';

import { memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import {
  GridCellParams,
  GridColumnGroupingModel,
  GridTreeNode,
  useGridApiRef,
} from '@mui/x-data-grid-pro';

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
    size: 'l',
  },
  {
    field: 'courseEntryKind',
    headerName: '参加区分',
    size: 'm',
  },
  {
    field: 'courseFeeTotal',
    headerName: 'コース会費',
    size: 'm',
  },
  {
    field: 'courseUseStartDate',
    headerName: '利用開始日',
    size: 's',
  },
  {
    field: 'serviceName',
    headerName: 'オプションサービス',
    size: 'l',
  },
  {
    field: 'contractCount',
    headerName: '数量',
  },
  {
    field: 'optionFeeTotal',
    headerName: 'オプションサービス会費合計',
    size: 'l',
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
    children: [{ field: 'billingId' }, { field: 'claimMethodKind' }],
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
  tvaaContractList: ContractModel[];
  bikeContractList: ContractModel[];
}

interface ContractModel {
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
  // コース会費値引値増フラグ
  courseFeeDiscountFlag: boolean;
  // 利用開始日
  courseUseStartDate: string;
  // オプションサービス
  serviceName: string;
  // 数量
  contractCount: string;
  // オプションサービス会費合計
  optionFeeTotal: string;
  // オプション会費合計値引値増フラグ
  optionFeeTotalDiscountFlag: boolean;
  // 利用開始日
  optionUseStartDate: string;
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
 * csvモデル
 */
interface ContractCsvModel {
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
  let tvaaContractCount = 0;
  let tvaaContractId = '';
  let bikeContractCount = 0;
  let bikeContractId = '';
  return {
    tvaaContractList: response.list1.map((x) => {
      tvaaContractCount++;
      const feeTotal =
        tvaaContractId === x.contractId
          ? ''
          : Number(x.feeTotal).toLocaleString();
      tvaaContractId = x.contractId;
      return {
        id: x.contractId + tvaaContractCount,
        // 契約ID
        contractId: x.contractId,
        // 会費合計
        feeTotal: feeTotal,
        // 変更予約
        changeReservationFlag: x.changeReservationFlag ? 'あり' : '',
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
        // コース会費値引値増フラグ
        courseFeeDiscountFlag: x.courseFeeDiscountFlag,
        // 利用開始日
        courseUseStartDate: x.courseUseStartDate,
        // オプションサービス
        serviceName: x.serviceName,
        // 数量
        contractCount: Number(x.contractCount).toLocaleString(),
        // オプションサービス会費合計
        optionFeeTotal: Number(x.optionFeeTotal).toLocaleString(),
        // オプション会費合計値引値増フラグ
        optionFeeTotalDiscountFlag: x.optionFeeTotalDiscountFlag,
        // 利用開始日
        optionUseStartDate: x.optionUseStartDate,
      };
    }),
    bikeContractList: response.list2.map((x) => {
      bikeContractCount++;
      const feeTotal =
        bikeContractId === x.contractId
          ? ''
          : Number(x.feeTotal).toLocaleString();
      bikeContractId = x.contractId;
      return {
        id: x.contractId + bikeContractCount,
        // 契約ID
        contractId: x.contractId,
        // 会費合計
        feeTotal: feeTotal,
        // 変更予約
        changeReservationFlag: x.changeReservationFlag ? 'あり' : '',
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
        // コース会費値引値増フラグ
        courseFeeDiscountFlag: x.courseFeeDiscountFlag,
        // 利用開始日
        courseUseStartDate: x.courseUseStartDate,
        // オプションサービス
        serviceName: x.serviceName,
        // 数量
        contractCount: Number(x.contractCount).toLocaleString(),
        // オプションサービス会費合計
        optionFeeTotal: Number(x.optionFeeTotal).toLocaleString(),
        // オプション会費合計値引値増フラグ
        optionFeeTotalDiscountFlag: x.optionFeeTotalDiscountFlag,
        // 利用開始日
        optionUseStartDate: x.optionUseStartDate,
      };
    }),
  };
};

/**
 * DatagridColumnGroups
 */
const DatagridColumnGroups = () => {
  // router
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { corporationId, bussinessBaseId } = useParams();
  const applicationId = searchParams.get('applicationId');
  const { user } = useContext(AuthContext);
  const apiRefTvaaContract = useGridApiRef();
  const apiRefBikeContract = useGridApiRef();

  // state
  const [tvaaContract, setTvaaContract] = useState<ContractModel[]>([]);
  const [tvaaContractRow, setTvaaContractRow] = useState<ContractRowModel[]>(
    []
  );
  const [bikeContract, setBikeContract] = useState<ContractModel[]>([]);
  const [bikeContractRow, setBikeContractRow] = useState<ContractRowModel[]>(
    []
  );
  const [tvaaHrefs, setTvaaHrefs] = useState<any[]>([]);
  const [bikeHrefs, setBikeHrefs] = useState<any[]>([]);

  // 初期表示処理
  useEffect(() => {
    const initialize = async (
      corporationId: string,
      bussinessBaseId: string
    ) => {
      // 事業拠点契約コース・サービス一覧取得API
      const request: ScrMem0010GetContractRequest = {
        corporationId: corporationId,
        businessBaseId: bussinessBaseId,
        businessDate: new Date(),
        limit: '',
      };
      const response = await ScrMem0010GetContract(request);
      const contract = convertToContractRowModel(response);

      const tvaaHrefs: GridHrefsModel[] = [];
      tvaaHrefs.push({
        field: 'contractId',
        hrefs: contract.tvaaContractList.map((x) => {
          return {
            id: x.id,
            href: '-?contractId=' + x.id + '#basic',
          };
        }),
      });

      const bikeHrefs: GridHrefsModel[] = [];
      bikeHrefs.push({
        field: 'contractId',
        hrefs: contract.bikeContractList.map((x) => {
          return {
            id: x.id,
            href: '-?contractId=' + x.id + '#basic',
          };
        }),
      });
      const hrefs = contract.tvaaContractList.map((x) => {
        return {
          field: 'contractId',
          id: x.id,
          href: '-?contractId=' + x.id + '#basic',
        };
      });
      contract.bikeContractList.forEach((x) => {
        hrefs.push({
          field: 'contractId',
          id: x.id,
          href: '-?contractId=' + x.id + '#basic',
        });
      });

      setTvaaContract(contract.tvaaContractList);
      setBikeContract(contract.bikeContractList);
      setTvaaContractRow(
        contract.tvaaContractList.map((x) => {
          return {
            id: x.id,
            contractId: x.contractId,
            feeTotal: x.feeTotal,
            changeReservationFlag: x.changeReservationFlag,
            billingId: x.billingId,
            claimMethodKind: x.claimMethodKind,
            courseName: x.courseName,
            courseEntryKind: x.courseEntryKind,
            courseFeeTotal: x.courseFeeTotal,
            courseUseStartDate: x.courseUseStartDate,
            serviceName: x.serviceName,
            contractCount: x.contractCount,
            optionFeeTotal: x.optionFeeTotal,
            optionUseStartDate: x.optionUseStartDate,
          };
        })
      );
      setBikeContractRow(
        contract.bikeContractList.map((x) => {
          return {
            id: x.id,
            contractId: x.contractId,
            feeTotal: x.feeTotal,
            changeReservationFlag: x.changeReservationFlag,
            billingId: x.billingId,
            claimMethodKind: x.claimMethodKind,
            courseName: x.courseName,
            courseEntryKind: x.courseEntryKind,
            courseFeeTotal: x.courseFeeTotal,
            courseUseStartDate: x.courseUseStartDate,
            serviceName: x.serviceName,
            contractCount: x.contractCount,
            optionFeeTotal: x.optionFeeTotal,
            optionUseStartDate: x.optionUseStartDate,
          };
        })
      );
      setTvaaHrefs(tvaaHrefs);
      setBikeHrefs(bikeHrefs);
    };

    const historyInitialize = async (applicationId: string) => {
      // 変更履歴取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response = (
        await memApiClient.post('/scr-mem-9999/get-history-info', request)
      ).data;
      const contract = convertToContractRowModel(response);
      const tvaaHrefs: GridHrefsModel[] = [];
      tvaaHrefs.push({
        field: 'contractId',
        hrefs: contract.tvaaContractList.map((x) => {
          return {
            id: x.id,
            href: '-?contractId=' + x.id + '#basic',
          };
        }),
      });

      const bikeHrefs: GridHrefsModel[] = [];
      bikeHrefs.push({
        field: 'contractId',
        hrefs: contract.bikeContractList.map((x) => {
          return {
            id: x.id,
            href: '-?contractId=' + x.id + '#basic',
          };
        }),
      });

      setTvaaContract(contract.tvaaContractList);
      setBikeContract(contract.bikeContractList);
      setTvaaHrefs(tvaaHrefs);
      setBikeHrefs(bikeHrefs);
    };

    if (applicationId !== null) {
      historyInitialize(applicationId);
      return;
    }

    if (corporationId !== undefined && bussinessBaseId !== undefined) {
      initialize(corporationId, bussinessBaseId);
    }
  }, [applicationId, bussinessBaseId]);

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const tvaaHandleIconOutputCsvClick = () => {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const filename =
      'SCR-MEM-0010_' +
      user.employeeId +
      '_' +
      year +
      month +
      day +
      hours +
      minutes +
      '.csv';
    exportCsv(filename, apiRefTvaaContract);
  };

  const bikeHandleIconOutputCsvClick = () => {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const filename =
      'SCR-MEM-0010_' +
      user.employeeId +
      '_' +
      year +
      month +
      day +
      hours +
      minutes +
      '.csv';
    exportCsv(filename, apiRefBikeContract);
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations/' + corporationId);
  };

  /**
   * データグリッドの背景色設定
   */
  const getCellClassNameTvaaContract = (
    params: GridCellParams<any, any, any, GridTreeNode>
  ): string => {
    let CellClassName = '';
    if (params.field === 'courseFeeTotal') {
      tvaaContract.map((x) => {
        if (x.id === params.row.id) {
          CellClassName = x.courseFeeDiscountFlag ? 'cold' : '';
        }
      });
    }
    if (params.field === 'optionFeeTotal') {
      tvaaContract.map((x) => {
        if (x.id === params.row.id) {
          CellClassName = x.optionFeeTotalDiscountFlag ? 'cold' : '';
        }
      });
    }
    return CellClassName;
  };
  const getCellClassNameBikeContract = (
    params: GridCellParams<any, any, any, GridTreeNode>
  ): string => {
    let CellClassName = '';
    if (params.field === 'courseFeeTotal') {
      bikeContract.map((x) => {
        if (x.id === params.id) {
          CellClassName = x.courseFeeDiscountFlag ? 'cold' : '';
        }
      });
    }
    if (params.field === 'optionFeeTotal') {
      bikeContract.map((x) => {
        if (x.id === params.id) {
          CellClassName = x.optionFeeTotalDiscountFlag ? 'cold' : '';
        }
      });
    }
    return CellClassName;
  };

  return (
    <MainLayout>
      <MainLayout main>
        {/* 【四輪】契約情報セクション */}
        <Section
          name='【四輪】契約情報'
          decoration={
            <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
              <AddButton onClick={tvaaHandleIconOutputCsvClick}>
                CSV出力
              </AddButton>
            </MarginBox>
          }
        >
          <DataGrid
            columns={contractColumns}
            columnGroupingModel={columnGroups}
            rows={tvaaContractRow}
            hrefs={tvaaHrefs}
            onLinkClick={handleLinkClick}
            getCellClassName={getCellClassNameTvaaContract}
            apiRef={apiRefTvaaContract}
          />
        </Section>
        <Section
          name='【二輪】契約情報'
          decoration={
            <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
              <AddButton onClick={bikeHandleIconOutputCsvClick}>
                CSV出力
              </AddButton>
            </MarginBox>
          }
        >
          <DataGrid
            columns={contractColumns}
            columnGroupingModel={columnGroups}
            rows={bikeContractRow}
            hrefs={bikeHrefs}
            onLinkClick={handleLinkClick}
            getCellClassName={getCellClassNameBikeContract}
            apiRef={apiRefBikeContract}
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
