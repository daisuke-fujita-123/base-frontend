import { yupResolver } from '@hookform/resolvers/yup';
import { ScrMem0003AddCheckLogisticsBase, ScrMem0003AddCheckLogisticsBaseRequest, ScrMem0003SearchBusinessBase, ScrMem0003SearchBusinessBaseRequest, ScrMem0003SearchBusinessBaseResponse, ScrMem0003SearchLogisticsBase, ScrMem0003SearchLogisticsBaseRequest, ScrMem0003SearchLogisticsBaseResponse } from 'apis/mem/ScrMem0003Api';
import { AddButton, AddIconButton, SearchButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { ContentsDivider } from 'controls/Divider';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';
import { SerchLabelText } from 'controls/Typography';
import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';
import { CenterBox, MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack } from 'layouts/Stack';
import { string } from 'prop-types';
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { generate } from 'utils/validation/BaseYup';


/**
 * 検索条件データモデル
 */
interface SearchModel {
  // 法人ID
  corporationId: string;
  // 物流拠点一覧セクション
  // 物流拠点ID
  logisticsBaseId: string;
  // 物流拠点名
  logisticsBaseName: string;
  // 物流拠点名カナ
  logisticsBaseNameKana: string;
  // 利用目的
  usePurpose: string[];
  // 四輪営業担当
  logisticsBaseTvaaSalesStaffId: string;
  // 二輪営業担当
  logisticsBaseBikeSalesStaffId: string;
  // 住所（都道府県）
  logisticsBasePrefectureCode: string;
  // 住所（市区町村以降）
  logisticsBaseMunicipalities: string;
  // 地区コード/地区名
  regionCode: string;
  // 物流拠点代表契約ID
  logisticsBaseRepresentativeContractId: string;

  // 事業拠点一覧セクション
  // 事業拠点ID
  businessBaseId: string;
  // 事業拠点名
  businessBaseName: string;
  // 事業拠点名カナ
  businessBaseNameKana: string;
  // 四輪営業担当
  businessBaseTvaaSalesStaffId: string;
  // 二輪営業担当
  businessBaseBikeSalesStaffId: string;
  // 住所（都道府県）
  businessBasePrefectureCode: string;
  // 住所（市区町村以降）
  businessBaseMunicipalities: string;
  // 契約ID
  contractId: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  usePurposeSelectValues: SelectValue[];
  tvaaSalesStaffIdSelectValues: SelectValue[];
  bikeSalesStaffIdSelectValues: SelectValue[];
  prefectureCodeSelectValues: SelectValue[];
  regionCodeSelectValues: SelectValue[];
  logisticsBaseRepresentativeContractIdSelectValues: SelectValue[];
}

/**
 * 検索条件初期データ
 */
const SearchLogisticsBaseinitialValues: SearchModel = {
  corporationId: '',
  logisticsBaseId: '',
  logisticsBaseName: '',
  logisticsBaseNameKana: '',
  usePurpose: [],
  logisticsBaseTvaaSalesStaffId: '',
  logisticsBaseBikeSalesStaffId: '',
  logisticsBasePrefectureCode: '',
  logisticsBaseMunicipalities: '',
  regionCode: '',
  logisticsBaseRepresentativeContractId: '',
  
  businessBaseId: '',
  businessBaseName: '',
  businessBaseNameKana: '',
  businessBaseTvaaSalesStaffId: '',
  businessBaseBikeSalesStaffId: '',
  businessBasePrefectureCode: '',
  businessBaseMunicipalities: '',
  contractId: '',
}

/**
 * プルダウン初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  usePurposeSelectValues: [],
  tvaaSalesStaffIdSelectValues: [],
  bikeSalesStaffIdSelectValues: [],
  prefectureCodeSelectValues: [],
  regionCodeSelectValues: [],
  logisticsBaseRepresentativeContractIdSelectValues: [],
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
 * 物流拠点一覧列定義
 */
const logisticsBaseColumns: GridColDef[] = [
  {
    field: 'logisticsBaseId',
    headerName: '物流拠点ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'logisticsBaseName',
    headerName: '物流拠点名',
    size: 'l',
  },
  {
    field: 'logisticsBaseNameKana',
    headerName: '物流拠点名カナ',
    size: 'm',
  },
  {
    field: 'usePurpose',
    headerName: '利用目的',
    size: 'l',
  },
  {
    field: 'logisticsBaseStaffName',
    headerName: '拠点担当者名',
    size: 'm',
  },
  {
    field: 'regionCode',
    headerName: '地区コード',
    size: 's',
  },
  {
    field: 'regionName',
    headerName: '地区名',
    size: 's',
  },
  {
    field: 'zipCode',
    headerName: '郵便番号',
    size: 's',
  },
  {
    field: 'address',
    headerName: '住所',
    size: 'l',
  },
  {
    field: 'telNumber',
    headerName: 'TEL',
    size: 'm',
  },
  {
    field: 'faxNumber',
    headerName: 'FAX',
    size: 'm',
  },
  {
    field: 'mailAddress',
    headerName: 'メールアドレス',
    size: 'l',
  },
  {
    field: 'tvaaStaffName',
    headerName: '四輪営業担当者名',
    size: 'm',
  },
  {
    field: 'bikeStaffName',
    headerName: '二輪営業担当者名',
    size: 'm',
  },
  {
    field: 'logisticsBaseRepresentativeContractId',
    headerName: '物流拠点代表契約ID',
    size: 'm',
  },
  {
    field: 'changeReservationfFlag',
    headerName: '変更予約',
    size: 's',
  },
];

/**
 * 物流拠点一覧モデル
 */
interface LogisticsBaseModel {
  id: string;
  logisticsBaseId: string;
  logisticsBaseName: string;
  logisticsBaseNameKana: string;
  usePurpose: string;
  logisticsBaseStaffName: string;
  regionCode: string;
  regionName: string;
  zipCode: string;
  address: string;
  telNumber: string;
  faxNumber: string;
  mailAddress: string;
  tvaaStaffName: string;
  bikeStaffName: string;
  logisticsBaseRepresentativeContractId: string;
  changeReservationfFlag: string;
}


/**
 * 物流拠点一覧モデルデータ
 */
const logisticsBaseRows: LogisticsBaseModel[] = [
  {
    id: '',
    logisticsBaseId: '',
    logisticsBaseName: '',
    logisticsBaseNameKana: '',
    usePurpose: '',
    logisticsBaseStaffName: '',
    regionCode: '',
    regionName: '',
    zipCode: '',
    address: '',
    telNumber: '',
    faxNumber: '',
    mailAddress: '',
    tvaaStaffName: '',
    bikeStaffName: '',
    logisticsBaseRepresentativeContractId: '',
    changeReservationfFlag: '',
  }
];

/**
 * 事業拠点一覧列定義
 */
const businessBaseColumns: GridColDef[] = [
  {
    field: 'businessBaseId',
    headerName: '事業拠点ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'businessBaseName',
    headerName: '事業拠点名',
    size: 'l',
  },
  {
    field: 'businessBaseNameKana',
    headerName: '事業拠点名カナ',
    size: 'm',
  },
  {
    field: 'businessBaseStaffName',
    headerName: '拠点担当者名',
    size: 'm',
  },
  {
    field: 'zipCode',
    headerName: '郵便番号',
    size: 's',
  },
  {
    field: 'address',
    headerName: '住所',
    size: 'l',
  },
  {
    field: 'telNumber',
    headerName: 'TEL',
    size: 'm',
  },
  {
    field: 'tvaaStaffName',
    headerName: '四輪営業担当者名',
    size: 'm',
  },
  {
    field: 'bikeStaffName',
    headerName: '二輪営業担当者名',
    size: 'm',
  },
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 'm',
  },
  {
    field: 'changeReservationfFlag',
    headerName: '変更予約',
    size: 's',
  },
];

/**
 * 事業拠点一覧モデル
 */
interface BusinessBaseModel {
  id: string;
  businessBaseId: string;
  businessBaseName: string;
  businessBaseNameKana: string;
  businessBaseStaffName: string;
  zipCode: string;
  address: string;
  telNumber: string;
  tvaaStaffName: string;
  bikeStaffName: string;
  contractId: string;
  changeReservationfFlag: string;
}

/**
 * エラー確認ポップアップモデル
 */
interface ScrCom0038PopupDataModel {
  // エラー内容リスト
  errorList: [{
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
  }];
  // ワーニング内容リスト
  warnList: [{
    // エラーコード
    errorCode: string;
    // エラーメッセージ
    errorMessage: string;
  }];
}

/**
 * 事業拠点一覧モデルデータ
 */
const businessBaseRows: BusinessBaseModel[] = [
  {
    id: '',
    businessBaseId: '',
    businessBaseName: '',
    businessBaseNameKana: '',
    businessBaseStaffName: '',
    zipCode: '',
    address: '',
    telNumber: '',
    tvaaStaffName: '',
    bikeStaffName: '',
    contractId: '',
    changeReservationfFlag: '',
  }
];

const convertFromlogisticsBase = (
  request: SearchModel
):ScrMem0003SearchLogisticsBaseRequest => {
  return{
    corporationId: request.corporationId,
    logisticsBaseId: request.logisticsBaseId,
    logisticsBaseName: request.logisticsBaseName,
    logisticsBaseNameKana: request.logisticsBaseNameKana,
    usePurpose: request.usePurpose.join(),
    tvaaSalesStaffId: request.logisticsBaseTvaaSalesStaffId,
    bikeSalesStaffId: request.logisticsBaseBikeSalesStaffId,
    prefectureCode: request.logisticsBasePrefectureCode,
    municipalities: request.logisticsBaseMunicipalities,
    regionCode: request.regionCode,
    logisticsBaseRepresentativeContractId:request.logisticsBaseRepresentativeContractId,
    businessDate: new Date(),
    limit: 0,
  }
};

const convertToLogisticsBaseModel = (
  response: ScrMem0003SearchLogisticsBaseResponse
): LogisticsBaseModel[] => {
  return response.logisticsBase.map((x) =>{
    const usePurpose = [];
    x.tvaaInformationFlag?usePurpose.push('四輪情報'):'';
    x.bikeInformationFlag?usePurpose.push('二輪情報'):'';
    x.collectionInformationFlag?usePurpose.push('集荷情報'):'';
    return{
      id: x.logisticsBaseId,
      logisticsBaseId: x.logisticsBaseId,
      logisticsBaseName: x.logisticsBaseName,
      logisticsBaseNameKana: x.logisticsBaseNameKana,
      usePurpose: usePurpose.join('/'),
      logisticsBaseStaffName: x.logisticsBaseStaffName,
      regionCode: x.regionCode,
      regionName: x.regionName,
      zipCode: x.zipCode,
      address: x.zipCode+x.prefectureName+x.municipalities+x.addressBuildingName,
      telNumber: x.telNumber,
      faxNumber: x.faxNumber,
      mailAddress: x.mailAddress,
      tvaaStaffName: x.tvaaStaffName,
      bikeStaffName: x.bikeStaffName,
      logisticsBaseRepresentativeContractId: x.logisticsBaseRepresentativeContractId,
      changeReservationfFlag: x.changeReservationfFlag?'あり':"",
    };
  });
}

const convertFromBusinessBase = (
  request: SearchModel
):ScrMem0003SearchBusinessBaseRequest => {
  return{
    corporationId: request.corporationId,
    businessBaseId: request.businessBaseId,
    businessBaseName: request.businessBaseName,
    businessBaseNameKana: request.businessBaseNameKana,
    tvaaSalesStaffId: request.businessBaseTvaaSalesStaffId,
    bikeSalesStaffId: request.businessBaseBikeSalesStaffId,
    prefectureCode: request.businessBasePrefectureCode,
    municipalities: request.businessBaseMunicipalities,
    contractId:request.contractId,
    businessDate: new Date(),
    limit: 0,
  }
};

const convertToBusinessBaseModel = (
  response: ScrMem0003SearchBusinessBaseResponse
): BusinessBaseModel[] => {
  return response.businessBase.map((x) =>{
    return{
      id: x.businessBaseId,
      businessBaseId: x.businessBaseId,
      businessBaseName: x.businessBaseName,
      businessBaseNameKana: x.businessBaseNameKana,
      businessBaseStaffName: x.businessBaseStaffName,
      zipCode: x.zipCode,
      address: x.zipCode+x.prefectureName+x.municipalities+x.addressBuildingName,
      telNumber: x.telNumber,
      tvaaStaffName: x.tvaaStaffName,
      bikeStaffName: x.bikeStaffName,
      contractId: x.contractId,
      changeReservationfFlag: x.changeReservationfFlag?'あり':"",
    };
  });
}

type key = keyof SearchModel;

const logisticsBaseSerchData: { label: string; name: key }[] = [
  { label: '物流拠点ID', name: 'logisticsBaseId' },
  { label: '物流拠点名', name: 'logisticsBaseName' },
  { label: '物流拠点名カナ', name: 'logisticsBaseNameKana' },
  { label: '利用目的', name: 'usePurpose' },
  { label: '四輪営業担当', name: 'logisticsBaseTvaaSalesStaffId' },
  { label: '二輪営業担当', name: 'logisticsBaseBikeSalesStaffId' },
  { label: '住所（都道府県）', name: 'logisticsBasePrefectureCode' },
  { label: '住所（市区町村以降）', name: 'logisticsBaseMunicipalities' },
  { label: '地区コード/地区名', name: 'regionCode' },
  { label: '物流拠点代表契約ID', name: 'logisticsBaseRepresentativeContractId' },
];

const businessBaseSerchData: { label: string; name: key }[] = [
  { label: '事業拠点ID', name: 'businessBaseId' },
  { label: '事業拠点名', name: 'businessBaseName' },
  { label: '事業拠点名カナ', name: 'businessBaseNameKana' },
  { label: '四輪営業担当', name: 'businessBaseTvaaSalesStaffId' },
  { label: '二輪営業担当', name: 'businessBaseBikeSalesStaffId' },
  { label: '住所（都道府県）', name: 'businessBasePrefectureCode' },
  { label: '住所（市区町村以降）', name: 'businessBaseMunicipalities' },
  { label: '契約ID', name: 'contractId' },
];

const ScrMem0003BaseTab = () => {
  // router
  const navigate = useNavigate();
  const { corporationId } = useParams();
  
  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [logisticsBaseSearchResult ,setLogisticsBaseSearchResult] = useState<LogisticsBaseModel[]>([]);
  const [logisticsBaseHrefs ,setLogisticsBaseHrefs] = useState<any[]>([]);
  const [openLogisticsBaseSection ,setOpenLogisticsBaseSection] = useState<boolean>(true);

  const [businessBaseSearchResult ,setBusinessBaseSearchResult] = useState<BusinessBaseModel[]>([]);
  const [businessBaseHrefs ,setBusinessBaseHrefs] = useState<any[]>([]);
  const [openBusinessBaseSection ,setOpenBusinessBaseSection] = useState<boolean>(true);
  const [isOpenScrCom0038Popup, setIsOpenScrCom0038Popup] = useState(false);
  const [scrCom0038PopupData, setScrCom0038PopupData] = useState<ScrCom0038PopupDataModel>();


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
  
  
  // リンク押下イベント
  const handleLinkClick = (url: string) => {
    navigate(url, true);
  };

  // 物流拠点一覧検索押下イベント
  const logisticsBaseHandleSearchClick = async () => {
    
    // 物流拠点一覧取得
    const request = convertFromlogisticsBase(getValues());
    const response = await ScrMem0003SearchLogisticsBase(request);
    const searchResult = convertToLogisticsBaseModel(response);

    // 制限件数 <  取得件数の場合
    if(response.limitCount < response.acquisitionCount){
      // メッセージ取得機能へ引数を渡しメッセージを取得する
      // TODO：メッセージ取得機能未実装
      // メッセージID: 'MSG-FR-INF-00003'
      // セクション名: '物流拠点一覧'
      // 取得件数: response.acquisitionCount
      // 返却件数: response.responseCount

      // ダイアログを表示
    }

    const hrefs = searchResult.map((x) => {
      return {
        field: 'logisticsBaseId',
        id: x.logisticsBaseId,
        href: '/mem/corporations/:corporationId/logistics-bases/' + x.logisticsBaseId,
      };
    });
    setLogisticsBaseSearchResult(searchResult);
    setLogisticsBaseHrefs(hrefs);
    setOpenLogisticsBaseSection(false);
  }

  // 事業拠点一覧検索押下イベント
  const businessBaseHandleSearchClick = async () => {

    // 事業拠点一覧取得
    const request = convertFromBusinessBase(getValues());
    const response = await ScrMem0003SearchBusinessBase(request);
    const searchResult = convertToBusinessBaseModel(response);
    // 制限件数 <  取得件数の場合
    if(response.limitCount < response.acquisitionCount){
      // メッセージ取得機能へ引数を渡しメッセージを取得する
      // TODO：メッセージ取得機能未実装
      // メッセージID: 'MSG-FR-INF-00003'
      // セクション名: '事業拠点一覧'
      // 取得件数: response.acquisitionCount
      // 返却件数: response.responseCount

      // ダイアログを表示
    }
    const hrefs = searchResult.map((x) => {
      return {
        field: 'businessBaseId',
        id: x.businessBaseId,
        href: '-?businessBaseId=' + x.businessBaseId,
      };
    });
    setBusinessBaseSearchResult(searchResult);
    setBusinessBaseHrefs(hrefs);
    setOpenBusinessBaseSection(false);
  }

  /**
   * Sectionを閉じた際のラベル作成
   */
  const logisticsBaseSerchLabels = logisticsBaseSerchData.map((val, index) => {
    const nameVal = getValues(val.name);
    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });
  
  /**
   * Sectionを閉じた際のラベル作成
   */
  const businessBaseSerchLabels = businessBaseSerchData.map((val, index) => {
    const nameVal = getValues(val.name);
    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });
  
  /**
   * CSV出力リック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    // TODO: アーキのCSV実装待ち
    console.log("CSV出力")
  };
  
  /**
   * 追加（物流拠点一覧）ボタンクリック時のイベントハンドラ
   */
  const handleIconLogisticsBaseAddClick = async () => {
    if(corporationId === undefined) return;
    
    // 契約情報追加チェック
    const request: ScrMem0003AddCheckLogisticsBaseRequest = {
      corporationId: corporationId
    };
    const response = await ScrMem0003AddCheckLogisticsBase(request);
    if(response.errorList.length < 0){
      navigate('/mem/corporations/:corporationId/logistics-bases/'+ corporationId);
    }else{
      // TODO: エラー確認ポップアップを表示
      setScrCom0038PopupData(response);
      setIsOpenScrCom0038Popup(true);
    }
  };
  
  const handleIconBusinessBaseAddClick = () => {
    // 事業拠点詳細遷移
    // TODO:パス確認
    navigate('-?corporationId='+ corporationId);
  }
  
  /**
   * エラー確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = () => {
    setIsOpenScrCom0038Popup(false);
    // 物流拠点詳細遷移
    navigate('/mem/corporations/:corporationId/logistics-bases/'+ corporationId);
  }

  /**
   * エラー確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenScrCom0038Popup(false);
  }

  return (
    <>
    <MainLayout>
      {/* main*/}
      <MainLayout main>
        <FormProvider {...methods}>
          {/* 物流拠点一覧セクション */}
          <Section name='物流拠点一覧'>
            {/* 検索条件セクション */}
            <Section name='検索条件'
              isSearch
              serchLabels={logisticsBaseSerchLabels}
              open={openLogisticsBaseSection}
            >
              <RowStack>
                <ColStack>
                  <TextField
                    label='物流拠点ID'
                    name='logisticsBaseId'
                  />
                  <TextField
                    label='物流拠点名'
                    name='logisticsBaseName'
                  />
                  <TextField
                    label='物流拠点名カナ'
                    name='logisticsBaseNameKana'
                  />
                </ColStack>
                <ColStack>
                  <Select
                    label='利用目的'
                    name='usePurpose'
                    selectValues={selectValues.usePurposeSelectValues}
                    multiple
                  />
                  <Select
                    label='四輪営業担当'
                    name='tvaaSalesStaffId'
                    selectValues={selectValues.tvaaSalesStaffIdSelectValues}
                  />
                  <Select
                    label='二輪営業担当'
                    name='bikeSalesStaffId'
                    selectValues={selectValues.bikeSalesStaffIdSelectValues}
                  />
                </ColStack>
                <ColStack>
                  <Select
                    label='住所（都道府県）'
                    name='prefectureCode'
                    selectValues={selectValues.prefectureCodeSelectValues}
                  />
                  <TextField
                    label='住所（市区町村以降）'
                    name='municipalities'
                  />
                  <Select
                    label='地区コード/地区名'
                    name='regionCode'
                    selectValues={selectValues.regionCodeSelectValues}
                  />
                </ColStack>
                <ColStack>
                  <Select
                    label='物流拠点代表契約ID'
                    name='logisticsBaseRepresentativeContractId'
                    selectValues={selectValues.logisticsBaseRepresentativeContractIdSelectValues}
                  />
                </ColStack>
              </RowStack>
              <ContentsDivider />
              <CenterBox>
                <SearchButton
                  onClick={() => {
                    logisticsBaseHandleSearchClick();
                  }}
                >
                  検索
                </SearchButton>
              </CenterBox>
            </Section>
            {/* 検索結果セクション */}
            <Section name='検索結果'
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  <AddButton onClick={handleIconOutputCsvClick}>
                    CSV出力
                  </AddButton>
                  {/* 追加（事業拠点一覧） */}
                  <AddIconButton onClick={handleIconBusinessBaseAddClick} />
                </MarginBox>
              }>
              <DataGrid 
                columns={logisticsBaseColumns}
                rows={logisticsBaseSearchResult}
                hrefs={logisticsBaseHrefs}
                onLinkClick={handleLinkClick}
              />
            </Section>
          </Section>
          {/* 事業拠点一覧セクション */}
          <Section name='事業拠点一覧'>
            {/* 検索条件セクション */}
            <Section name='検索条件'
              isSearch
              serchLabels={businessBaseSerchLabels}
              open={openLogisticsBaseSection}
            >
              <RowStack>
                <ColStack>
                  <TextField
                    label='事業拠点ID'
                    name='businessBaseId'
                  />
                  <TextField
                    label='事業拠点名'
                    name='businessBaseName'
                  />
                  <TextField
                    label='事業拠点名カナ'
                    name='businessBaseNameKana'
                  />
                </ColStack>
                <ColStack>
                  <Select
                    label='四輪営業担当'
                    name='businessBaseTvaaSalesStaffId'
                    selectValues={selectValues.tvaaSalesStaffIdSelectValues}
                  />
                  <Select
                    label='二輪営業担当'
                    name='businessBaseBikeSalesStaffId'
                    selectValues={selectValues.bikeSalesStaffIdSelectValues}
                  />
                </ColStack>
                <ColStack>
                  <Select
                    label='住所（都道府県）'
                    name='businessBasePrefectureCode'
                    selectValues={selectValues.prefectureCodeSelectValues}
                  />
                  <TextField
                    label='住所（市区町村以降）'
                    name='businessBaseMunicipalities'
                  />
                </ColStack>
                <ColStack>
                  <Select
                    label='契約ID'
                    name='contractId'
                    selectValues={selectValues.logisticsBaseRepresentativeContractIdSelectValues}
                  />
                </ColStack>
              </RowStack>
              <ContentsDivider />
              <CenterBox>
                <SearchButton
                  onClick={() => {
                    businessBaseHandleSearchClick();
                  }}
                >
                  検索
                </SearchButton>
              </CenterBox>
            </Section>
            {/* 検索結果セクション */}
            <Section name='検索結果'>
              <DataGrid 
                columns={businessBaseColumns}
                rows={businessBaseSearchResult}
                hrefs={businessBaseHrefs}
                onLinkClick={handleLinkClick}
              />
            </Section>
          </Section>
        </FormProvider>
      </MainLayout>
    </MainLayout>

    {/* エラー確認ポップアップ */}
    {/*
    <ScrCom0038Popup
      isOpen={isOpenScrCom0038Popup}
      data={scrCom0032PopupData}
      handleConfirm={handlePopupConfirm}
      handleCancel={handlePopupCancel}
    />
    */}
    </>
  );
};

export default ScrMem0003BaseTab;
