import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0038Popup, {
  ScrCom0038PopupModel,
} from 'pages/com/popups/ScrCom0038Popup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

import {
  AddButton,
  CancelButton,
  OutputButton,
  SearchButton,
} from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
} from 'controls/Datagrid';
import { Dialog } from 'controls/Dialog';
import { ContentsDivider } from 'controls/Divider';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';
import { SerchLabelText } from 'controls/Typography';

import {
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetCodeValue,
} from 'apis/com/ScrCom9999Api';
import {
  ScrMem0003AddCheckLogisticsBase,
  ScrMem0003AddCheckLogisticsBaseRequest,
  ScrMem0003SearchBusinessBase,
  ScrMem0003SearchBusinessBaseRequest,
  ScrMem0003SearchBusinessBaseResponse,
  ScrMem0003SearchLogisticsBase,
  ScrMem0003SearchLogisticsBaseRequest,
  ScrMem0003SearchLogisticsBaseResponse,
} from 'apis/mem/ScrMem0003Api';
import {
  ScrMem9999GetBill,
  ScrMem9999GetCodeValue,
  ScrMem9999GetEmployeeFromDistrict,
  ScrMem9999GetLogisticsBaseRepresentativeContract,
} from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

import { useGridApiRef } from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';

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
  contractIdSelectValues: SelectValue[];
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
};

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
  contractIdSelectValues: [],
};

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  logisticsBaseId: yup.string().label('物流拠点ID').max(4).half(),
  logisticsBaseName: yup.string().label('物流拠点名').max(40),
  logisticsBaseNameKana: yup.string().label('物流拠点名カナ').max(10).half(),
  usePurpose: yup.array().label('利用目的'),
  logisticsBaseTvaaSalesStaffId: yup.string().label('四輪営業担当'),
  logisticsBaseBikeSalesStaffId: yup.string().label('二輪営業担当'),
  logisticsBasePrefectureCode: yup.string().label('住所（都道府県）'),
  logisticsBaseMunicipalities: yup
    .string()
    .label('住所（市区町村以降）')
    .max(80),
  regionCode: yup.string().label('地区コード/地区名'),
  logisticsBaseRepresentativeContractId: yup
    .string()
    .label('物流拠点代表契約ID'),

  businessBaseId: yup.string().label('物流拠点ID').max(4).half(),
  businessBaseName: yup.string().label('物流拠点名').max(40),
  businessBaseNameKana: yup.string().label('物流拠点名カナ').max(40).half(),
  businessBaseTvaaSalesStaffId: yup.string().label('四輪営業担当'),
  businessBaseBikeSalesStaffId: yup.string().label('二輪営業担当'),
  businessBasePrefectureCode: yup.string().label('住所（都道府県）'),
  businessBaseMunicipalities: yup
    .string()
    .label('住所（市区町村以降）')
    .max(80),
  contractId: yup.string().label('契約ID'),
};

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
  },
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
  },
];

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0038PopupInitialValues: ScrCom0038PopupModel = {
  errorList: [],
  warningList: [],
  expirationScreenId: '',
};

const convertFromlogisticsBase = (
  request: SearchModel
): ScrMem0003SearchLogisticsBaseRequest => {
  return {
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
    logisticsBaseRepresentativeContractId:
      request.logisticsBaseRepresentativeContractId,
    businessDate: new Date(),
    limit: 0,
  };
};

const convertToLogisticsBaseModel = (
  response: ScrMem0003SearchLogisticsBaseResponse
): LogisticsBaseModel[] => {
  return response.logisticsBase.map((x) => {
    const usePurpose = [];
    x.tvaaInformationFlag ? usePurpose.push('四輪情報') : '';
    x.bikeInformationFlag ? usePurpose.push('二輪情報') : '';
    x.collectionInformationFlag ? usePurpose.push('集荷情報') : '';
    return {
      id: x.logisticsBaseId,
      logisticsBaseId: x.logisticsBaseId,
      logisticsBaseName: x.logisticsBaseName,
      logisticsBaseNameKana: x.logisticsBaseNameKana,
      usePurpose: usePurpose.join('/'),
      logisticsBaseStaffName: x.logisticsBaseStaffName,
      regionCode: x.regionCode,
      regionName: x.regionName,
      zipCode: x.zipCode,
      address:
        x.zipCode + x.prefectureName + x.municipalities + x.addressBuildingName,
      telNumber: x.telNumber,
      faxNumber: x.faxNumber,
      mailAddress: x.mailAddress,
      tvaaStaffName: x.tvaaStaffName,
      bikeStaffName: x.bikeStaffName,
      logisticsBaseRepresentativeContractId:
        x.logisticsBaseRepresentativeContractId,
      changeReservationfFlag: x.changeReservationfFlag ? 'あり' : '',
    };
  });
};

const convertFromBusinessBase = (
  request: SearchModel
): ScrMem0003SearchBusinessBaseRequest => {
  return {
    corporationId: request.corporationId,
    businessBaseId: request.businessBaseId,
    businessBaseName: request.businessBaseName,
    businessBaseNameKana: request.businessBaseNameKana,
    tvaaSalesStaffId: request.businessBaseTvaaSalesStaffId,
    bikeSalesStaffId: request.businessBaseBikeSalesStaffId,
    prefectureCode: request.businessBasePrefectureCode,
    municipalities: request.businessBaseMunicipalities,
    contractId: request.contractId,
    businessDate: new Date(),
    limit: 0,
  };
};

const convertToBusinessBaseModel = (
  response: ScrMem0003SearchBusinessBaseResponse
): BusinessBaseModel[] => {
  return response.businessBase.map((x) => {
    return {
      id: x.businessBaseId,
      businessBaseId: x.businessBaseId,
      businessBaseName: x.businessBaseName,
      businessBaseNameKana: x.businessBaseNameKana,
      businessBaseStaffName: x.businessBaseStaffName,
      zipCode: x.zipCode,
      address:
        x.zipCode + x.prefectureName + x.municipalities + x.addressBuildingName,
      telNumber: x.telNumber,
      tvaaStaffName: x.tvaaStaffName,
      bikeStaffName: x.bikeStaffName,
      contractId: x.contractId,
      changeReservationfFlag: x.changeReservationfFlag ? 'あり' : '',
    };
  });
};

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
  {
    label: '物流拠点代表契約ID',
    name: 'logisticsBaseRepresentativeContractId',
  },
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
  const { getMessage } = useContext(MessageContext);
  const { user } = useContext(AuthContext);
  const apiRefLogisticsBase = useGridApiRef();
  const apiRefBusinessBase = useGridApiRef();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [logisticsBaseSearchResult, setLogisticsBaseSearchResult] = useState<
    LogisticsBaseModel[]
  >([]);
  const [logisticsBaseHrefs, setLogisticsBaseHrefs] = useState<
    GridHrefsModel[]
  >([]);
  const [openLogisticsBaseSection, setOpenLogisticsBaseSection] =
    useState<boolean>(true);
  const [businessBaseSearchResult, setBusinessBaseSearchResult] = useState<
    BusinessBaseModel[]
  >([]);
  const [businessBaseHrefs, setBusinessBaseHrefs] = useState<GridHrefsModel[]>(
    []
  );
  const [openBusinessBaseSection, setOpenBusinessBaseSection] =
    useState<boolean>(true);
  const [isOpenScrCom0038Popup, setIsOpenScrCom0038Popup] =
    useState<boolean>(false);
  const [scrCom0038PopupData, setScrCom0038PopupData] =
    useState<ScrCom0038PopupModel>(scrCom0038PopupInitialValues);
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0003') === -1
  );

  // form
  const methods = useForm<SearchModel>({
    defaultValues: SearchLogisticsBaseinitialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: true,
  });
  const { getValues } = methods;

  // 初期表示処理
  useEffect(() => {
    const initialize = async (corporationId: string) => {
      // リスト取得
      const getCodeManagementMasterRequest = { codeId: 'CDE-MEM-1026' };
      const getCodeManagementMasterResponse =
        await ScrCom9999GetCodeManagementMaster(getCodeManagementMasterRequest);
      const usePurposeSelectValues =
        getCodeManagementMasterResponse.searchGetCodeManagementMasterListbox.map(
          (x) => {
            return {
              value: x.codeValue,
              displayValue: x.codeName,
            };
          }
        );

      const getEmployeeFromDistrictRequest = { corporationId: corporationId };
      const getEmployeeFromDistrictResponse =
        await ScrMem9999GetEmployeeFromDistrict(getEmployeeFromDistrictRequest);
      const tvaaSalesStaffIdSelectValues =
        getEmployeeFromDistrictResponse.tvaaSalesInfo.map((x) => {
          return {
            value: x.salesId,
            displayValue: x.salesId + '　' + x.salesName,
          };
        });
      const bikeSalesStaffIdSelectValues =
        getEmployeeFromDistrictResponse.bikeSalesInfo.map((x) => {
          return {
            value: x.salesId,
            displayValue: x.salesId + '　' + x.salesName,
          };
        });
      const getCodeValueRequest = {
        entityList: [{ entityName: 'region_code_master' }],
      };
      const getCodeValueResponse = await ScrMem9999GetCodeValue(
        getCodeValueRequest
      );
      const regionCodeSelectValues: SelectValue[] = [];
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'region_code_master') {
          x.codeValueList.map((f) => {
            regionCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
      });
      const comGetCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const comGetCodeValueResponse = await ScrCom9999GetCodeValue(
        comGetCodeValueRequest
      );
      const prefectureCodeSelectValues: SelectValue[] = [];
      comGetCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValue + '　' + f.codeValueName,
            });
          });
        }
      });

      const getLogisticsBaseRepresentativeContractRequest = {
        corporationId: corporationId,
      };
      const getLogisticsBaseRepresentativeContractResponse =
        await ScrMem9999GetLogisticsBaseRepresentativeContract(
          getLogisticsBaseRepresentativeContractRequest
        );
      const logisticsBaseRepresentativeContractIdSelectValues =
        getLogisticsBaseRepresentativeContractResponse.logisticsBaseRepresentativeContractIdList.map(
          (x) => {
            return {
              value: x,
              displayValue: x,
            };
          }
        );

      const getBillRequest = {
        corporationId: corporationId,
        sortKey: '',
        sortDirection: '',
      };
      const getBillResponse = await ScrMem9999GetBill(getBillRequest);
      const contractIdSelectValues = getBillResponse.list.map((x) => {
        return {
          value: x,
          displayValue: x,
        };
      });

      setSelectValues({
        usePurposeSelectValues: usePurposeSelectValues,
        tvaaSalesStaffIdSelectValues: tvaaSalesStaffIdSelectValues,
        bikeSalesStaffIdSelectValues: bikeSalesStaffIdSelectValues,
        regionCodeSelectValues: regionCodeSelectValues,
        prefectureCodeSelectValues: prefectureCodeSelectValues,
        logisticsBaseRepresentativeContractIdSelectValues:
          logisticsBaseRepresentativeContractIdSelectValues,
        contractIdSelectValues: contractIdSelectValues,
      });
    };

    if (corporationId === 'new') return;

    if (corporationId !== undefined) {
      initialize(corporationId);
    }
  }, [corporationId]);

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
    if (response.limitCount < response.acquisitionCount) {
      // メッセージ取得機能へ引数を渡しメッセージを取得する
      const messege = Format(getMessage('MSG-FR-INF-00003'), [
        '物流拠点一覧',
        response.acquisitionCount.toString(),
        response.responseCount.toString(),
      ]);
      // ダイアログを表示
      setTitle(messege);
      setHandleDialog(true);
    }

    setLogisticsBaseSearchResult(searchResult);
    setLogisticsBaseHrefs([
      {
        field: 'logisticsBaseId',
        hrefs: searchResult.map((x) => {
          return {
            id: x.logisticsBaseId,
            href:
              '/mem/corporations/:corporationId/logistics-bases/' +
              x.logisticsBaseId,
          };
        }),
      },
    ]);
    setOpenLogisticsBaseSection(false);
  };

  // 事業拠点一覧検索押下イベント
  const businessBaseHandleSearchClick = async () => {
    // 事業拠点一覧取得
    const request = convertFromBusinessBase(getValues());
    const response = await ScrMem0003SearchBusinessBase(request);
    const searchResult = convertToBusinessBaseModel(response);
    // 制限件数 <  取得件数の場合
    if (response.limitCount < response.acquisitionCount) {
      // メッセージ取得機能へ引数を渡しメッセージを取得する
      const messege = Format(getMessage('MSG-FR-INF-00003'), [
        '事業拠点一覧',
        response.acquisitionCount.toString(),
        response.responseCount.toString(),
      ]);
      // ダイアログを表示
      setTitle(messege);
      setHandleDialog(true);
    }
    setBusinessBaseSearchResult(searchResult);
    setBusinessBaseHrefs([
      {
        field: 'businessBaseId',
        hrefs: searchResult.map((x) => {
          return {
            id: x.businessBaseId,
            href: '-?businessBaseId=' + x.businessBaseId,
          };
        }),
      },
    ]);
    setOpenBusinessBaseSection(false);
  };

  /**
   * Sectionを閉じた際のラベル作成
   */
  const logisticsBaseSerchLabels = logisticsBaseSerchData.map((val, index) => {
    let nameVal = getValues(val.name);

    if (val.name === 'usePurpose') {
      const nameValues: string[] = [];
      selectValues.usePurposeSelectValues.filter((x) => {
        if (typeof nameVal !== 'string') {
          nameVal.map((f) => {
            if (x.value === f) {
              nameValues.push(x.displayValue);
            }
          });
        }
      });
      nameVal = nameValues.join(',');
    }

    if (val.name === 'logisticsBaseTvaaSalesStaffId') {
      const filter = selectValues.tvaaSalesStaffIdSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    if (val.name === 'logisticsBaseBikeSalesStaffId') {
      const filter = selectValues.bikeSalesStaffIdSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    if (val.name === 'logisticsBasePrefectureCode') {
      const filter = selectValues.prefectureCodeSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    if (val.name === 'regionCode') {
      const filter = selectValues.regionCodeSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    if (val.name === 'logisticsBaseRepresentativeContractId') {
      const filter =
        selectValues.logisticsBaseRepresentativeContractIdSelectValues.filter(
          (x) => {
            return nameVal === x.value;
          }
        );
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });

  /**
   * Sectionを閉じた際のラベル作成
   */
  const businessBaseSerchLabels = businessBaseSerchData.map((val, index) => {
    let nameVal = getValues(val.name);

    if (val.name === 'businessBaseTvaaSalesStaffId') {
      const filter = selectValues.tvaaSalesStaffIdSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    if (val.name === 'businessBaseBikeSalesStaffId') {
      const filter = selectValues.bikeSalesStaffIdSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    if (val.name === 'businessBasePrefectureCode') {
      const filter = selectValues.prefectureCodeSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    if (val.name === 'contractId') {
      const filter = selectValues.contractIdSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }

    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });

  /**
   * CSV出力リック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = (
    apiRef: React.MutableRefObject<GridApiPro>
  ) => {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const fileName =
      'SCR-MEM-0003_' +
      user.employeeId +
      '_' +
      year +
      month +
      day +
      hours +
      minutes +
      '.csv';
    exportCsv(fileName, apiRef);
  };

  /**
   * 追加（物流拠点一覧）ボタンクリック時のイベントハンドラ
   */
  const handleIconLogisticsBaseAddClick = async () => {
    if (corporationId === undefined) return;

    // 契約情報追加チェック
    const request: ScrMem0003AddCheckLogisticsBaseRequest = {
      corporationId: corporationId,
    };
    const response = await ScrMem0003AddCheckLogisticsBase(request);
    if (response.errorList.length < 0 || response.warnList.length < 0) {
      navigate(
        '/mem/corporations/:corporationId/logistics-bases/' + corporationId
      );
    } else {
      // エラー確認ポップアップを表示
      setScrCom0038PopupData({
        errorList: response.errorList.map((x) => {
          return {
            errorMessage: x.errorMessage,
          };
        }),
        warningList: response.warnList.map((x) => {
          return {
            warningMessage: x.errorMessage,
          };
        }),
        expirationScreenId: 'SCR-MEM-0003',
      });
      setIsOpenScrCom0038Popup(true);
    }
  };

  /**
   * 追加（事業拠点一覧）ボタンクリック時のイベントハンドラ
   */
  const handleIconBusinessBaseAddClick = () => {
    // 事業拠点詳細遷移
    navigate('/mem/corporations/' + corporationId + '/bussiness-bases/new');
  };

  /**
   * エラー確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenScrCom0038Popup(false);
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <MainLayout>
        {/* main*/}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 物流拠点一覧セクション */}
            <Section name='物流拠点一覧' fitInside={true}>
              {/* 検索条件セクション */}
              <Section
                name='検索条件'
                isSearch
                serchLabels={logisticsBaseSerchLabels}
                openable={openLogisticsBaseSection}
              >
                <RowStack>
                  <ColStack>
                    <TextField label='物流拠点ID' name='logisticsBaseId' />
                    <TextField label='物流拠点名' name='logisticsBaseName' />
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
                      blankOption
                    />
                    <Select
                      label='四輪営業担当'
                      name='logisticsBaseTvaaSalesStaffId'
                      selectValues={selectValues.tvaaSalesStaffIdSelectValues}
                      blankOption
                    />
                    <Select
                      label='二輪営業担当'
                      name='logisticsBaseBikeSalesStaffId'
                      selectValues={selectValues.bikeSalesStaffIdSelectValues}
                      blankOption
                    />
                  </ColStack>
                  <ColStack>
                    <Select
                      label='住所（都道府県）'
                      name='logisticsBasePrefectureCode'
                      selectValues={selectValues.prefectureCodeSelectValues}
                      blankOption
                    />
                    <TextField
                      label='住所（市区町村以降）'
                      name='logisticsBaseMunicipalities'
                    />
                    <Select
                      label='地区コード/地区名'
                      name='regionCode'
                      selectValues={selectValues.regionCodeSelectValues}
                      blankOption
                    />
                  </ColStack>
                  <ColStack>
                    <Select
                      label='物流拠点代表契約ID'
                      name='logisticsBaseRepresentativeContractId'
                      selectValues={
                        selectValues.logisticsBaseRepresentativeContractIdSelectValues
                      }
                      blankOption
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
              <Section
                name='検索結果'
                decoration={
                  <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                    <OutputButton
                      onClick={() =>
                        handleIconOutputCsvClick(apiRefLogisticsBase)
                      }
                      disable={logisticsBaseSearchResult.length <= 0}
                    >
                      CSV出力
                    </OutputButton>
                    {/* 追加（物流拠点一覧） */}
                    <AddButton
                      onClick={handleIconLogisticsBaseAddClick}
                      disable={isReadOnly[0]}
                    >
                      追加
                    </AddButton>
                  </MarginBox>
                }
              >
                <DataGrid
                  columns={logisticsBaseColumns}
                  rows={logisticsBaseSearchResult}
                  hrefs={logisticsBaseHrefs}
                  pagination
                  onLinkClick={handleLinkClick}
                  apiRef={apiRefLogisticsBase}
                />
              </Section>
            </Section>
            {/* 事業拠点一覧セクション */}
            <Section name='事業拠点一覧' fitInside={true}>
              {/* 検索条件セクション */}
              <Section
                name='検索条件'
                isSearch
                serchLabels={businessBaseSerchLabels}
                openable={openLogisticsBaseSection}
              >
                <RowStack>
                  <ColStack>
                    <TextField label='事業拠点ID' name='businessBaseId' />
                    <TextField label='事業拠点名' name='businessBaseName' />
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
                      blankOption
                    />
                    <Select
                      label='二輪営業担当'
                      name='businessBaseBikeSalesStaffId'
                      selectValues={selectValues.bikeSalesStaffIdSelectValues}
                      blankOption
                    />
                  </ColStack>
                  <ColStack>
                    <Select
                      label='住所（都道府県）'
                      name='businessBasePrefectureCode'
                      selectValues={selectValues.prefectureCodeSelectValues}
                      blankOption
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
                      selectValues={selectValues.contractIdSelectValues}
                      blankOption
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
              <Section
                name='検索結果'
                decoration={
                  <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                    <OutputButton
                      onClick={() =>
                        handleIconOutputCsvClick(apiRefBusinessBase)
                      }
                      disable={businessBaseSearchResult.length <= 0}
                    >
                      CSV出力
                    </OutputButton>
                    {/* 追加（事業拠点一覧） */}
                    <AddButton
                      onClick={handleIconBusinessBaseAddClick}
                      disable={isReadOnly[0]}
                    >
                      追加
                    </AddButton>
                  </MarginBox>
                }
              >
                <DataGrid
                  columns={businessBaseColumns}
                  rows={businessBaseSearchResult}
                  hrefs={businessBaseHrefs}
                  pagination
                  onLinkClick={handleLinkClick}
                  apiRef={apiRefBusinessBase}
                />
              </Section>
            </Section>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* エラー確認ポップアップ */}
      {isOpenScrCom0038Popup ? (
        <ScrCom0038Popup
          isOpen={isOpenScrCom0038Popup}
          data={scrCom0038PopupData}
          handleCancel={handlePopupCancel}
        />
      ) : (
        ''
      )}

      {/* ダイアログ */}
      {handleDialog ? (
        <Dialog
          open={handleDialog}
          title={title}
          buttons={[{ name: 'OK', onClick: () => setHandleDialog(false) }]}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrMem0003BaseTab;

