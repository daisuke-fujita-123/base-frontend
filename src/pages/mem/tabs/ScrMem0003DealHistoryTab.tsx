import { yupResolver } from '@hookform/resolvers/yup';
import { GridColumnGroupingModel } from '@mui/x-data-grid-pro';
import { ScrCom9999GetCodeManagementMaster, ScrCom9999GetCodeManagementMasterRequest, ScrCom9999GetCodeManagementMasterResponse, ScrMem0003GetCodeValue, ScrMem0003GetCodeValueRequest, ScrMem0003GetCodeValueResponse, ScrMem0003SearchAuctionDealHistory, ScrMem0003SearchAuctionDealHistoryRequest, ScrMem0003SearchAuctionDealHistoryResponse } from 'apis/mem/ScrMem0003Api';
import { AddButton, SearchButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { ContentsDivider } from 'controls/Divider';
import { Select, SelectValue } from 'controls/Select';
import { Typography } from 'controls/Typography';
import { useNavigate } from 'hooks/useNavigate';
import { CenterBox, MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { Grid } from 'layouts/Grid';
import { InputLayout } from 'layouts/InputLayout';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, InputRowStack, RowStack } from 'layouts/Stack';
import { comApiClient, memApiClient } from 'providers/ApiClient';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { generate } from 'utils/validation/BaseYup';


/**
 * 検索条件データモデル
 */
interface SearchModel {
  // 法人ID
  corporationId: string;
  
  // オークション取引履歴セクション
  // 請求先IDリスト
  auctionDealHistoryBillingIdList: string[];
  // 契約IDリスト
  auctionDealHistoryContractIdList: string[];
  // オークション種類リスト
  auctionKindList: string[];
  // 表示開始期間（年）
  auctionDealHistoryDisplayStartPeriodYear: string;
  // 表示開始期間（月）
  auctionDealHistoryDisplayStartPeriodMonth: string;
  // 表示終了期間（年）
  auctionDealHistoryDisplayEndPeriodYear: string;
  // 表示終了期間（月）
  auctionDealHistoryDisplayEndPeriodMonth: string;

  // 一般請求取引履歴セクション
  // 請求先IDリスト
  billingDealHistoryBillingIdList: string[];
  // 契約IDリスト
  billingDealHistoryContractIdList: string[];
  // 表示開始期間（年）
  billingDealHistoryDisplayStartPeriodYear: string;
  // 表示開始期間（月）
  billingDealHistoryDisplayStartPeriodMonth: string;
  // 表示終了期間（年）
  billingDealHistoryDisplayEndPeriodYear: string;
  // 表示終了期間（月）
  billingDealHistoryDisplayEndPeriodMonth: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  useBillingIdSelectValues: SelectValue[];
  useContractIdSelectValues: SelectValue[];
  useAuctionKindSelectValues: SelectValue[];
  useYearSelectValues: SelectValue[];
  useMonthSelectValues: SelectValue[];
}

/**
 * 検索条件初期データ
 */
const SearchLogisticsBaseinitialValues: SearchModel = {
  corporationId: '',
  auctionDealHistoryBillingIdList: [],
  auctionDealHistoryContractIdList: [],
  auctionKindList: [],
  auctionDealHistoryDisplayStartPeriodYear: '',
  auctionDealHistoryDisplayStartPeriodMonth: '',
  auctionDealHistoryDisplayEndPeriodYear: '',
  auctionDealHistoryDisplayEndPeriodMonth: '',

  billingDealHistoryBillingIdList: [],
  billingDealHistoryContractIdList: [],
  billingDealHistoryDisplayStartPeriodYear: '',
  billingDealHistoryDisplayStartPeriodMonth: '',
  billingDealHistoryDisplayEndPeriodYear: '',
  billingDealHistoryDisplayEndPeriodMonth: '',
}

/**
 * プルダウン初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  useBillingIdSelectValues: [],
  useContractIdSelectValues: [],
  useAuctionKindSelectValues: [],
  useYearSelectValues: [],
  useMonthSelectValues: [],
};

/**
 * バリデーションスキーマ
 */
const validationSchama = generate([
  'logisticsBaseId',
  'logisticsBaseName',
  'logisticsBaseNameKana',
  'usePurpose',
  'logisticsBaseTvaaSalesStaffId',
  'logisticsBaseBikeSalesStaffId',
  'logisticsBasePrefectureCode',
  'logisticsBaseMunicipalities',
  'regionCode',
  'logisticsBaseRepresentativeContractId',
  'businessBaseId',
  'businessBaseName',
  'businessBaseNameKana',
  'businessBaseTvaaSalesStaffId',
  'businessBaseBikeSalesStaffId',
  'businessBasePrefectureCode',
  'businessBaseMunicipalities',
  'contractId',
]);

/**
 * オークション取引履歴列定義
 */
const auctionDealHistoryColumns: GridColDef[] = [
  {
    field: 'dealYm',
    headerName: '取引年月',
    size: 's',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    size: 's',
  },
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 's',
  },
  {
    field: 'exhibitCount',
    headerName: '出品台数',
    size: 's',
  },
  {
    field: 'purchaseCount',
    headerName: '成約台数',
    size: 's',
  },
  {
    field: 'purchaseAmount',
    headerName: '成約金額',
    size: 's',
  },
  {
    field: 'purchaseClaimCount',
    headerName: '成約クレーム数',
    size: 's',
  },
  {
    field: 'documentDelayCount',
    headerName: '書類遅延台数',
    size: 's',
  },
  {
    field: 'bidCount',
    headerName: '落札台数',
    size: 's',
  },
  {
    field: 'bidAmount',
    headerName: '落札金額',
    size: 's',
  },
  {
    field: 'arrearsCount',
    headerName: '延滞回数',
    size: 's',
  },
  {
    field: 'day1ArrearsCount',
    headerName: '遅延状況件数（1日）',
    size: 's',
  },
  {
    field: 'day3ArrearsCount',
    headerName: '遅延状況件数（2-3日）',
    size: 's',
  },
  {
    field: 'day7ArrearsCount',
    headerName: '遅延状況件数（4-7日）',
    size: 's',
  },
  {
    field: 'day14ArrearsCount',
    headerName: '遅延状況件数（8-14日）',
    size: 's',
  },
  {
    field: 'day15ArrearsCount',
    headerName: '遅延状況件数（15日-）',
    size: 's',
  }
];

/**
 * オークション取引履歴列グループ定義
 */
const auctionDealHistoryColumnGroups: GridColumnGroupingModel = [
  {
    groupId: ' ',
    children: [
      { field: 'dealYm' },
      { field: 'billingId' },
      { field: 'contractId' },
      { field: 'exhibitCount' },
      { field: 'purchaseCount' },
      { field: 'purchaseAmount' },
      { field: 'purchaseClaimCount' },
      { field: 'documentDelayCount' },
      { field: 'bidCount' },
      { field: 'bidAmount' },
      { field: 'arrearsCount' },
    ],
  },
  {
    groupId: '延滞状況',
    children: [
      { field: 'day1ArrearsCount' },
      { field: 'day3ArrearsCount' },
      { field: 'day7ArrearsCount' },
      { field: 'day14ArrearsCount' },
      { field: 'day15ArrearsCount' },
    ],
  },
];

/**
 *一般請求取引履歴列定義
 */
const billingDealHistoryColumns: GridColDef[] = [
  {
    field: 'dealYm',
    headerName: '取引年月',
    size: 's',
  },
  {
    field: 'billingId',
    headerName: '請求先ID',
    size: 's',
  },
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 's',
  },
  {
    field: 'claimCount',
    headerName: '請求件数',
    size: 's',
  },
  {
    field: 'claimAmount',
    headerName: '請求金額',
    size: 's',
  },
  {
    field: 'arrearsCount',
    headerName: '延滞回数',
    size: 's',
  },
  {
    field: 'day1ArrearsCount',
    headerName: '遅延状況件数（1日）',
    size: 's',
  },
  {
    field: 'day3ArrearsCount',
    headerName: '遅延状況件数（2-3日）',
    size: 's',
  },
  {
    field: 'day7ArrearsCount',
    headerName: '遅延状況件数（4-7日）',
    size: 's',
  },
  {
    field: 'day14ArrearsCount',
    headerName: '遅延状況件数（8-14日）',
    size: 's',
  },
  {
    field: 'day15ArrearsCount',
    headerName: '遅延状況件数（15日-）',
    size: 's',
  }
];

/**
 * 一般請求取引履歴列グループ定義
 */
const billingDealHistoryColumnGroups: GridColumnGroupingModel = [
  {
    groupId: ' ',
    children: [
      { field: 'dealYm' },
      { field: 'billingId' },
      { field: 'contractId' },
      { field: 'claimCount' },
      { field: 'claimAmount' },
      { field: 'arrearsCount' },
    ],
  },
  {
    groupId: '延滞状況',
    children: [
      { field: 'day1ArrearsCount' },
      { field: 'day3ArrearsCount' },
      { field: 'day7ArrearsCount' },
      { field: 'day14ArrearsCount' },
      { field: 'day15ArrearsCount' },
    ],
  },
];


/**
 * オークション取引履歴一覧モデル
 */
interface auctionDealHistoryModel {
  id: string;
  dealYm: string;
  billingId: string;
  contractId: string;
  exhibitCount: number;
  purchaseCount: number;
  purchaseAmount: number;
  purchaseClaimCount: number;
  documentDelayCount: number;
  bidCount: number;
  bidAmount: number;
  arrearsCount: number;
  day1ArrearsCount: number;
  day3ArrearsCount: number;
  day7ArrearsCount: number;
  day14ArrearsCount: number;
  day15ArrearsCount: number;
}

/**
 * 一般請求取引履歴一覧モデル
 */
interface billingDealHistoryModel {
  id: string;
  dealYm: string;
  billingId: string;
  contractId: string;
  claimCount: number;
  claimAmount: number;
  arrearsCount: number;
  day1ArrearsCount: number;
  day3ArrearsCount: number;
  day7ArrearsCount: number;
  day14ArrearsCount: number;
  day15ArrearsCount: number;
}

/**
 * 取得したコード値情報からプルダウンデータモデルへの変換
 */
const convertToSelectValuesModel = (
  codeValueResponse: ScrMem0003GetCodeValueResponse,
  codeManagementMasterResponse: ScrCom9999GetCodeManagementMasterResponse
): SelectValuesModel => {
  const useBillingIdSelectValues: SelectValue[] = [];
  const useContractIdSelectValues: SelectValue[] = [];
  codeValueResponse.resultList.map((x) => {
    if(x.entityName === 'billing_master'){
      x.codeValueList.map((y) => {
        useBillingIdSelectValues.push({
          value: y.codeValue,
          displayValue: y.codeValueName,
        })
      })
    }
    if(x.entityName === 'contract_master'){
      x.codeValueList.map((y) => {
        useContractIdSelectValues.push({
          value: y.codeValue,
          displayValue: y.codeValueName,
        })
      })
    }
  });
  
  const years: SelectValue[] = [];
  const year = new Date().getFullYear();
  for(let i = 0; i < 4; i++){
    years.push({
      value: (year+i).toString(),
      displayValue: (year+i).toString(),
    });
  }

  const months: SelectValue[] = [];
  for(let i = 1; i < 13; i++){
    months.push({
      value: i.toString(),
      displayValue: i.toString(),
    });
  }

  return{
    useBillingIdSelectValues: useBillingIdSelectValues,
    useContractIdSelectValues: useContractIdSelectValues,
    useAuctionKindSelectValues: codeManagementMasterResponse.list.map((x) => {
      return{
        value: x.codeValue,
        displayValue: x.codeName,
      }
    }),
    useYearSelectValues: years,
    useMonthSelectValues: months,
  }
};

/**
 * 検索条件モデルからオークション取引履歴取得APIリクエストへの変換
 */
const convertFromSearchAuctionDealHistory = (
  search: SearchModel
):ScrMem0003SearchAuctionDealHistoryRequest => {
  return{
    // 法人ID
    corporationId: search.corporationId,
    // 請求先IDリスト
    billingIdList: search.auctionDealHistoryBillingIdList,
    // 契約IDリスト
    contractIdList: search.auctionDealHistoryContractIdList,
    // オークション種類リスト
    auctionKindList: search.auctionKindList,
    // 表示開始期間
    displayStartPeriod: search.auctionDealHistoryDisplayStartPeriodYear + search.auctionDealHistoryDisplayStartPeriodMonth,
    // 表示終了期間
    displayEndPeriod: search.auctionDealHistoryDisplayEndPeriodYear + search.auctionDealHistoryDisplayEndPeriodMonth,
    // 制限件数
    limit: 0,

  }
}

/**
 * オークション取引履歴取得APIリクエストから物流拠点一覧モデルへの変換
 */
const convertToauctionDealHistoryModel = (
  response: ScrMem0003SearchAuctionDealHistoryResponse
): auctionDealHistoryModel[] => {
  return response.auctionDealHistory.map((x) =>{
    return {
      id: x.dealYm + x.billingId + x.contractId,
      dealYm: x.dealYm,
      billingId: x.billingId,
      contractId: x.contractId,
      exhibitCount: x.exhibitCount,
      purchaseCount: x.purchaseCount,
      purchaseAmount: x.purchaseAmount,
      purchaseClaimCount: x.purchaseClaimCount,
      documentDelayCount: x.documentDelayCount,
      bidCount: x.bidCount,
      bidAmount: x.bidAmount,
      arrearsCount: x.arrearsCount,
      day1ArrearsCount: x.day1ArrearsCount,
      day3ArrearsCount: x.day3ArrearsCount,
      day7ArrearsCount: x.day7ArrearsCount,
      day14ArrearsCount: x.day14ArrearsCount,
      day15ArrearsCount: x.day15ArrearsCount,
    };
  });
};

const ScrMem0003DealHistoryTab = () => {
  // router
  const { corporationId } = useParams();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [auctionDealHistoryRows, setAuctionDealHistoryRows] = useState<auctionDealHistoryModel[]>([]);
  const [billingDealHistoryRows, setBillingDealHistoryRows] = useState<billingDealHistoryModel[]>([]);
  
  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<SearchModel>({
    defaultValues: SearchLogisticsBaseinitialValues,
    resolver: yupResolver(validationSchama),
    context: isReadOnly,
  });
  const {
    getValues,
  } = methods;
    
  // 初期表示処理
  useEffect(() => { 
    const initialize = async () => {
      const scrMem0003GetCodeValueRequest: ScrMem0003GetCodeValueRequest  = {
        entityList:[
          {entityName:'billing_master'},
          {entityName:'contract_master'}
        ]
      }
      const codeValueResponse = await ScrMem0003GetCodeValue(scrMem0003GetCodeValueRequest);
      const scrCom9999GetCodeManagementMasterRequest: ScrCom9999GetCodeManagementMasterRequest = {
        codeId:'CDE-COM-0066'
      }
      const codeManagementMasterResponse = await ScrCom9999GetCodeManagementMaster(scrCom9999GetCodeManagementMasterRequest);
      const selectValues =  convertToSelectValuesModel(codeValueResponse, codeManagementMasterResponse);
      setSelectValues({
        useBillingIdSelectValues: selectValues.useBillingIdSelectValues,
        useContractIdSelectValues: selectValues.useContractIdSelectValues,
        useAuctionKindSelectValues: selectValues.useAuctionKindSelectValues,
        useYearSelectValues: selectValues.useYearSelectValues,
        useMonthSelectValues: selectValues.useMonthSelectValues,
      });

    };
    initialize();
    
  }, []);

  /**
   * オークション取引履歴検索押下イベント
   */
  const searchClick = async () => {
    console.log('オークション取引履歴検索')
    // オークション取引履歴取得
    const request = convertFromSearchAuctionDealHistory(getValues());
    const response = await ScrMem0003SearchAuctionDealHistory(request);
    const auctionDealHistory = convertToauctionDealHistoryModel(response);
    setAuctionDealHistoryRows(auctionDealHistory);


  }
  
  /**
   * CSV出力リック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    // TODO: アーキのCSV実装待ち
    console.log("CSV出力")
  };
  
  return (
    <>
      <MainLayout>
        {/* main*/}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* オークション取引履歴セクション */}
            <Section name='オークション取引履歴'
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  <AddButton onClick={handleIconOutputCsvClick}>
                    CSV出力
                  </AddButton>
                </MarginBox>
              }>
              {/* 検索条件セクション */}
              <Section name='検索条件'
                isSearch
              >
                <RowStack>
                  <ColStack>
                    <Select
                      label='請求先ID'
                      name='auctionDealHistoryBillingIdList'
                      selectValues={selectValues.useBillingIdSelectValues}
                      multiple
                    />
                    <Select
                      label='契約ID'
                      name='auctionDealHistoryContractIdList'
                      selectValues={selectValues.useContractIdSelectValues}
                      multiple
                    />
                    <Select
                      label='オークション種類'
                      name='auctionKindList'
                      selectValues={selectValues.useAuctionKindSelectValues}
                      multiple
                    />
                    <FromTo label='表示期間'>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='auctionDealHistoryDisplayStartPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{paddingRight:"5px"}}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='auctionDealHistoryDisplayStartPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{paddingRight:"5px"}}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='auctionDealHistoryDisplayEndPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{paddingRight:"5px"}}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='auctionDealHistoryDisplayEndPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{paddingRight:"5px"}}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                    </FromTo>
                  </ColStack>
                </RowStack>
                <ContentsDivider />
                <CenterBox>
                  <SearchButton
                    onClick={() => {
                      searchClick();
                    }}
                  >
                    検索
                  </SearchButton>
                </CenterBox>
              </Section>
              {/* 検索結果セクション */}
              <Section name='検索結果'>
                <DataGrid 
                  columns={auctionDealHistoryColumns}
                  columnGroupingModel={auctionDealHistoryColumnGroups}
                  rows={auctionDealHistoryRows}
                />
              </Section>
            </Section>
            {/* 一般請求取引履歴セクション */}
            <Section name='一般請求取引履歴'
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  <AddButton onClick={handleIconOutputCsvClick}>
                    CSV出力
                  </AddButton>
                </MarginBox>
              }>
              {/* 検索条件セクション */}
              <Section name='検索条件'
                isSearch
              >
                <RowStack>
                  <ColStack>
                    <Select
                      label='請求先ID'
                      name='billingDealHistoryBillingIdList'
                      selectValues={selectValues.useBillingIdSelectValues}
                      multiple
                    />
                    <Select
                      label='契約ID'
                      name='billingDealHistoryContractIdList'
                      selectValues={selectValues.useContractIdSelectValues}
                      multiple
                    />
                    <FromTo label='表示期間'>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='billingDealHistoryDisplayStartPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{paddingRight:"5px"}}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='billingDealHistoryDisplayStartPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{paddingRight:"5px"}}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                      <InputRowStack>
                        <ColStack>
                          <Select
                            name='billingDealHistoryDisplayEndPeriodYear'
                            selectValues={selectValues.useYearSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{paddingRight:"5px"}}>{'年'}</div>
                        </ColStack>
                        <ColStack>
                          <Select
                            name='billingDealHistoryDisplayEndPeriodMonth'
                            selectValues={selectValues.useMonthSelectValues}
                          />
                        </ColStack>
                        <ColStack>
                          <div style={{paddingRight:"5px"}}>{'月'}</div>
                        </ColStack>
                      </InputRowStack>
                    </FromTo>
                  </ColStack>
                </RowStack>
                <ContentsDivider />
                <CenterBox>
                  <SearchButton
                    onClick={() => {
                      searchClick();
                    }}
                  >
                    検索
                  </SearchButton>
                </CenterBox>
              </Section>
              {/* 検索結果セクション */}
              <Section name='検索結果'>
                <DataGrid 
                  columns={billingDealHistoryColumns}
                  columnGroupingModel={billingDealHistoryColumnGroups}
                  rows={billingDealHistoryRows}
                />
              </Section>
            </Section>
          </FormProvider>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrMem0003DealHistoryTab;

