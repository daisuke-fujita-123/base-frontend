import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import ScrCom0038Popup, {
  ScrCom0038PopupModel,
} from 'pages/com/popups/ScrCom0038Popup';

import { MarginBox, RightBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { Stack } from 'layouts/Stack';

import { AddButton, CancelButton, OutputButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
  GridTooltipsModel,
} from 'controls/Datagrid';

import {
  ScrMem0003AddCheckContractInfo,
  ScrMem0003AddCheckContractInfoRequest,
  ScrMem0003GetContractCourseService,
  ScrMem0003GetContractCourseServiceRequest,
  ScrMem0003GetContractCourseServiceResponse,
  ScrMem0003RegistrationCorporationInfoRequest,
} from 'apis/mem/ScrMem0003Api';

import { useNavigate } from 'hooks/useNavigate';

import { memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import {
  GridCellParams,
  GridColumnGroupingModel,
  GridTreeNode,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';

/**
 * 契約情報列定義
 */
const contractInfoColumns: GridColDef[] = [
  // 契約情報
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'contractChangeReservationfFlag',
    headerName: '変更予約',
    size: 's',
  },
  // 事業拠点情報
  {
    field: 'businessBaseId',
    headerName: '事業拠点ID',
    size: 's',
  },
  {
    field: 'businessBaseName',
    headerName: '事業拠点名',
    size: 'l',
  },
  // 請求先情報
  {
    field: 'billingId',
    headerName: '請求ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'claimMethodKind',
    headerName: '会費請求方法',
    size: 'm',
  },
  // コース・オプション契約情報
  {
    field: 'courseName',
    headerName: 'コース名',
    size: 'l',
  },
  {
    field: 'optionEntryKind',
    headerName: '参加区分',
    size: 's',
  },
  {
    field: 'optionContractFlag',
    headerName: 'オプション契約',
    size: 'm',
  },
  {
    field: 'priceTotal',
    headerName: '会費合計',
    size: 'm',
    tooltip: true,
  },
];

/**
 * 請求先一覧列定義
 */
const billingInfoColumns: GridColDef[] = [
  {
    field: 'billingId',
    headerName: '請求先ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 's',
  },
  {
    field: 'courseName',
    headerName: 'コース名',
    size: 'l',
  },
  {
    field: 'claimMethodKind',
    headerName: '会費請求方法',
    size: 's',
  },
  {
    field: 'debitBankName',
    headerName: '銀行（引落）',
    size: 'l',
  },
  {
    field: 'debitBranchName',
    headerName: '支店（引落）',
    size: 'l',
  },
  {
    field: 'debitAccountNumber',
    headerName: '口座番号（引落）',
    size: 'm',
  },
  {
    field: 'payingBankName',
    headerName: '銀行（支払）',
    size: 'l',
  },
  {
    field: 'payingBranchName',
    headerName: '支店（支払）',
    size: 'l',
  },
  {
    field: 'payingAccountNumber',
    headerName: '口座番号（支払）',
    size: 'm',
  },
  {
    field: 'changeReservationfFlag',
    headerName: '変更予約',
    size: 's',
  },
];

/**
 * 譲渡書類送付先一覧列定義
 */
const assignmentDocumentDestinationInfoColumns: GridColDef[] = [
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'assignmentDocumentDestinationZipCode',
    headerName: '郵便番号',
    size: 's',
  },
  {
    field: 'assignmentDocumentDestinationPrefectureName',
    headerName: '都道府県',
    size: 's',
  },
  {
    field: 'assignmentDocumentDestinationMunicipalities',
    headerName: '市区町村',
    size: 'l',
  },
  {
    field: 'assignmentDocumentDestinationAddressBuildingName',
    headerName: '番地・号・建物名など',
    size: 'l',
  },
  {
    field: 'assignmentDocumentDestinationPhoneNumber',
    headerName: 'TEL',
    size: 'm',
  },
  {
    field: 'assignmentDocumentDestinationFaxNumber',
    headerName: 'FAX',
    size: 'm',
  },
  {
    field: 'assignmentDocumentDestinationMailAddress',
    headerName: 'メールアドレス',
    size: 'l',
  },
  {
    field: 'assignmentDocumentDestinationShippingMethodSlipKind',
    headerName: '配送方法',
    size: 's',
  },
  {
    field: 'changeReservationfFlag',
    headerName: '変更予約',
    size: 's',
  },
];

/**
 * 契約情報列グループ定義
 */
const contractInfoColumnGroups: GridColumnGroupingModel = [
  {
    groupId: '契約情報',
    children: [
      { field: 'contractId' },
      { field: 'contractChangeReservationfFlag' },
    ],
  },
  {
    groupId: '事業拠点情報',
    children: [{ field: 'businessBaseId' }, { field: 'businessBaseName' }],
  },
  {
    groupId: '請求先情報',
    children: [{ field: 'billingId' }, { field: 'claimMethodKind' }],
  },
  {
    groupId: 'コース・オプション契約情報',
    children: [
      { field: 'courseName' },
      { field: 'optionEntryKind' },
      { field: 'optionContractFlag' },
      { field: 'priceTotal' },
    ],
  },
];

/**
 * 列モデル
 */
interface ContractCourseServiceModel {
  tvaaContractInfo: ContractInfoModel[];
  bikeContractInfo: ContractInfoModel[];
  billingInfo: BillingInfoModel[];
  assignmentDocumentDestination: AssignmentDocumentDestinationModel[];
}

/**
 * 契約情報モデル
 */
interface ContractInfoModel {
  id: string;
  contractId: string;
  contractChangeReservationfFlag: string;
  businessBaseId: string;
  businessBaseName: string;
  billingId: string;
  claimMethodKind: string;
  courseName: string;
  optionEntryKind: string;
  optionContractFlag: string;
  discountFlag: boolean;
  priceTotal: number;
}

interface ContractInfoRowModel {
  id: string;
  contractId: string;
  contractChangeReservationfFlag: string;
  businessBaseId: string;
  businessBaseName: string;
  billingId: string;
  claimMethodKind: string;
  courseName: string;
  optionEntryKind: string;
  optionContractFlag: string;
  priceTotal: number;
}

/**
 * 請求先一覧モデル
 */
interface BillingInfoModel {
  id: string;
  billingId: string;
  contractId: string;
  courseName: string;
  claimMethodKind: string;
  debitBankName: string;
  debitBranchName: string;
  debitAccountNumber: string;
  payingBankName: string;
  payingBranchName: string;
  payingAccountNumber: string;
  changeReservationfFlag: string;
}

/**
 * 譲渡書類送付先一覧モデル
 */
interface AssignmentDocumentDestinationModel {
  id: string;
  contractId: string;
  assignmentDocumentDestinationZipCode: string;
  assignmentDocumentDestinationPrefectureName: string;
  assignmentDocumentDestinationMunicipalities: string;
  assignmentDocumentDestinationAddressBuildingName: string;
  assignmentDocumentDestinationPhoneNumber: string;
  assignmentDocumentDestinationFaxNumber: string;
  assignmentDocumentDestinationMailAddress: string;
  assignmentDocumentDestinationShippingMethodSlipKind: string;
  changeReservationfFlag: string;
}

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0038PopupInitialValues: ScrCom0038PopupModel = {
  errorList: [],
  warningList: [],
  expirationScreenId: '',
};

/**
 * 法人契約コース・サービス一覧取得APIリクエストから【四輪】契約情報セクションモデルへの変換
 */
const convertToContractCourseServiceModel = (
  response: ScrMem0003GetContractCourseServiceResponse
): ContractCourseServiceModel => {
  return {
    tvaaContractInfo: response.tvaaContractInfo.map((x) => {
      return {
        id: x.contractId,
        contractId: x.contractId,
        contractChangeReservationfFlag: x.contractChangeReservationfFlag
          ? 'あり'
          : '',
        businessBaseId: x.businessBaseId,
        businessBaseName: x.businessBaseName,
        billingId: x.billingId,
        claimMethodKind: x.claimMethodKind,
        courseName: x.courseName,
        optionEntryKind: x.optionEntryKind,
        optionContractFlag: x.optionContractFlag ? 'あり' : '',
        priceTotal: x.courselistPrice,
        discountFlag: x.discountFlag,
      };
    }),
    bikeContractInfo: response.bikeContractInfo.map((x) => {
      return {
        id: x.contractId,
        contractId: x.contractId,
        contractChangeReservationfFlag: x.contractChangeReservationfFlag
          ? 'あり'
          : '',
        businessBaseId: x.businessBaseId,
        businessBaseName: x.businessBaseName,
        billingId: x.billingId,
        claimMethodKind: x.claimMethodKind,
        courseName: x.courseName,
        optionEntryKind: x.optionEntryKind,
        optionContractFlag: x.optionContractFlag ? 'あり' : '',
        priceTotal: x.courselistPrice,
        discountFlag: x.discountFlag,
      };
    }),
    billingInfo: response.billingInfo.map((x) => {
      return {
        id: x.billingId,
        billingId: x.billingId,
        contractId: x.contractId,
        courseName: x.courseName,
        claimMethodKind: x.claimMethodKind,
        debitBankName: x.debitBankName,
        debitBranchName: x.debitBranchName,
        debitAccountNumber: x.debitAccountNumber,
        payingBankName: x.payingBankName,
        payingBranchName: x.payingBranchName,
        payingAccountNumber: x.payingAccountNumber,
        changeReservationfFlag: x.changeReservationfFlag ? 'あり' : '',
      };
    }),
    assignmentDocumentDestination:
      response.assignmentDocumentDestinationInfo.map((x) => {
        return {
          id: x.contractId,
          contractId: x.contractId,
          assignmentDocumentDestinationZipCode:
            x.assignmentDocumentDestinationZipCode,
          assignmentDocumentDestinationPrefectureName:
            x.assignmentDocumentDestinationPrefectureName,
          assignmentDocumentDestinationMunicipalities:
            x.assignmentDocumentDestinationMunicipalities,
          assignmentDocumentDestinationAddressBuildingName:
            x.assignmentDocumentDestinationAddressBuildingName,
          assignmentDocumentDestinationPhoneNumber:
            x.assignmentDocumentDestinationPhoneNumber,
          assignmentDocumentDestinationFaxNumber:
            x.assignmentDocumentDestinationFaxNumber,
          assignmentDocumentDestinationMailAddress:
            x.assignmentDocumentDestinationMailAddress,
          assignmentDocumentDestinationShippingMethodSlipKind:
            x.assignmentDocumentDestinationShippingMethodSlipKind,
          changeReservationfFlag: x.changeReservationfFlag ? 'あり' : '',
        };
      }),
  };
};

/**
 * 法人契約コース・サービス一覧取得APIリクエストから法人情報詳細モデルへの変換
 */
const convertToScrMem0003DataModel = (
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest,
  response: ScrMem0003GetContractCourseServiceResponse
): ScrMem0003RegistrationCorporationInfoRequest => {
  const newScrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest =
    Object.assign(scrMem0003Data);
  newScrMem0003Data.tvaaAcquisitionCount = response.tvaaAcquisitionCount;
  newScrMem0003Data.tvaaContractInfo = response.tvaaContractInfo;
  newScrMem0003Data.bikeAcquisitionCount = response.bikeAcquisitionCount;
  newScrMem0003Data.bikeContractInfo = response.bikeContractInfo;
  newScrMem0003Data.billingAcquisitionCount = response.billingAcquisitionCount;
  newScrMem0003Data.billingInfo = response.billingInfo;
  newScrMem0003Data.assignmentAcquisitionCount =
    response.assignmentAcquisitionCount;
  newScrMem0003Data.assignmentDocumentDestinationInfo =
    response.assignmentDocumentDestinationInfo;

  return newScrMem0003Data;
};

const ScrMem0003ContractTab = (props: {
  chengeScrMem0003Data: (
    scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest
  ) => void;
  scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest;
}) => {
  // router
  const { corporationId } = useParams();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const apiRefTvaaContractInfo = useGridApiRef();
  const apiRefBikeCountInfo = useGridApiRef();
  const apiRefBillingInfo = useGridApiRef();
  const apiRefAssignmentDocumentDestination = useGridApiRef();

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0003') === -1
  );

  // state
  const [tvaaContractInfo, setTvaaContractInfo] = useState<ContractInfoModel[]>(
    []
  );
  const [tvaaContractInfoRows, setTvaaContractInfoRows] = useState<
    ContractInfoRowModel[]
  >([]);
  const [bikeCountInfo, setBikeCountInfo] = useState<ContractInfoModel[]>([]);
  const [bikeCountInfoRows, setBikeCountInfoRows] = useState<
    ContractInfoRowModel[]
  >([]);
  const [billingInfoRows, setBillingInfoRows] = useState<BillingInfoModel[]>(
    []
  );
  const [
    assignmentDocumentDestinationRows,
    setAssignmentDocumentDestinationRows,
  ] = useState<AssignmentDocumentDestinationModel[]>([]);
  const [tvaaContractInfoTooltips, setTvaaContractInfoTooltips] = useState<
    GridTooltipsModel[]
  >([]);
  const [bikeContractInfoTooltips, setBikeContractInfoTooltips] = useState<
    GridTooltipsModel[]
  >([]);
  const [tvaaContractInfoHrefs, setTvaaContractInfoHrefs] = useState<
    GridHrefsModel[]
  >([]);
  const [bikeCountInfoHrefs, setBikeCountInfoHrefs] = useState<
    GridHrefsModel[]
  >([]);
  const [billingInfoHrefs, setBillingInfoHrefs] = useState<GridHrefsModel[]>(
    []
  );
  const [
    assignmentDocumentDestinationHrefs,
    setAssignmentDocumentDestinationHrefs,
  ] = useState<GridHrefsModel[]>([]);
  const [isOpenScrCom0038Popup, setIsOpenScrCom0038Popup] = useState(false);
  const [scrCom0038PopupData, setScrCom0038PopupData] =
    useState<ScrCom0038PopupModel>(scrCom0038PopupInitialValues);

  useEffect(() => {
    const initialize = async (corporationId: string) => {
      // 与信情報取得API
      const request: ScrMem0003GetContractCourseServiceRequest = {
        corporationId: corporationId,
      };
      const response = await ScrMem0003GetContractCourseService(request);
      const contractCourseService =
        convertToContractCourseServiceModel(response);
      setTvaaContractInfo(contractCourseService.tvaaContractInfo);
      setTvaaContractInfoRows(
        contractCourseService.tvaaContractInfo.map((x) => {
          return {
            id: x.id,
            contractId: x.contractId,
            contractChangeReservationfFlag: x.contractChangeReservationfFlag,
            businessBaseId: x.businessBaseId,
            businessBaseName: x.businessBaseName,
            billingId: x.billingId,
            claimMethodKind: x.claimMethodKind,
            courseName: x.courseName,
            optionEntryKind: x.optionEntryKind,
            optionContractFlag: x.optionContractFlag,
            priceTotal: x.priceTotal,
          };
        })
      );
      setBikeCountInfo(contractCourseService.bikeContractInfo);
      setBikeCountInfoRows(
        contractCourseService.bikeContractInfo.map((x) => {
          return {
            id: x.id,
            contractId: x.contractId,
            contractChangeReservationfFlag: x.contractChangeReservationfFlag,
            businessBaseId: x.businessBaseId,
            businessBaseName: x.businessBaseName,
            billingId: x.billingId,
            claimMethodKind: x.claimMethodKind,
            courseName: x.courseName,
            optionEntryKind: x.optionEntryKind,
            optionContractFlag: x.optionContractFlag,
            priceTotal: x.priceTotal,
          };
        })
      );
      setBillingInfoRows(contractCourseService.billingInfo);
      setAssignmentDocumentDestinationRows(
        contractCourseService.assignmentDocumentDestination
      );

      // 取得データ保持
      const scrMem0003Data = convertToScrMem0003DataModel(
        props.scrMem0003Data,
        response
      );
      props.chengeScrMem0003Data(scrMem0003Data);

      // ツールチップ設定
      setTvaaContractInfoTooltips([
        {
          field: 'priceTotal',
          tooltips: response.tvaaContractInfo.map((x) => {
            const textList: string[] = [];
            x.serviceInfo.map((f) => {
              textList.push(f.serviceName + '　' + f.servicePrice);
            });
            return {
              id: x.contractId,
              text: textList.join('\r'),
            };
          }),
        },
      ]);

      setBikeContractInfoTooltips([
        {
          field: 'priceTotal',
          tooltips: response.bikeContractInfo.map((x) => {
            const textList: string[] = [];
            x.serviceInfo.map((f) => {
              textList.push(f.serviceName + '　' + f.servicePrice);
            });
            return {
              id: x.contractId,
              text: textList.join('\r'),
            };
          }),
        },
      ]);

      // refs設定
      setTvaaContractInfoHrefs([
        {
          field: 'contractId',
          hrefs: contractCourseService.tvaaContractInfo.map((x) => {
            return {
              id: x.contractId,
              href:
                '/mem/corporations/' +
                corporationId +
                '/bussiness-bases/' +
                x.businessBaseId +
                '/contracts/' +
                x.contractId,
            };
          }),
        },
        {
          field: 'billingId',
          hrefs: contractCourseService.tvaaContractInfo.map((x) => {
            return {
              id: x.contractId,
              href:
                '/mem/corporations/' +
                corporationId +
                '/billings/' +
                x.billingId,
            };
          }),
        },
      ]);

      setBikeCountInfoHrefs([
        {
          field: 'contractId',
          hrefs: contractCourseService.bikeContractInfo.map((x) => {
            return {
              id: x.contractId,
              href:
                '/mem/corporations/' +
                corporationId +
                '/bussiness-bases/' +
                x.businessBaseId +
                '/contracts/' +
                x.contractId,
            };
          }),
        },
        {
          field: 'billingId',
          hrefs: contractCourseService.bikeContractInfo.map((x) => {
            return {
              id: x.contractId,
              href:
                '/mem/corporations/' +
                corporationId +
                '/billings/' +
                x.billingId,
            };
          }),
        },
      ]);

      setBillingInfoHrefs([
        {
          field: 'billingId',
          hrefs: contractCourseService.billingInfo.map((x) => {
            return {
              field: 'billingId',
              id: x.billingId,
              href: '/mem/corporations/' + x.billingId + '/billings/',
            };
          }),
        },
      ]);

      setAssignmentDocumentDestinationHrefs([
        {
          field: 'contractId',
          hrefs: contractCourseService.assignmentDocumentDestination.map(
            (x) => {
              return {
                id: x.contractId,
                href:
                  '/mem/corporations/' +
                  corporationId +
                  '/bussiness-bases/logisticsBaseId/contracts/' +
                  x.contractId,
              };
            }
          ),
        },
      ]);
    };

    const historyInitialize = async (
      corporationId: string,
      applicationId: string
    ) => {
      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response: ScrMem0003RegistrationCorporationInfoRequest = (
        await memApiClient.post('/get-history-info', request)
      ).data;
      const contractCourseService =
        convertToContractCourseServiceModel(response);
      setTvaaContractInfoRows(contractCourseService.tvaaContractInfo);
      setBikeCountInfoRows(contractCourseService.bikeContractInfo);
      setBillingInfoRows(contractCourseService.billingInfo);
      setAssignmentDocumentDestinationRows(
        contractCourseService.assignmentDocumentDestination
      );

      // 取得データ保持
      const scrMem0003Data = convertToScrMem0003DataModel(
        props.scrMem0003Data,
        response
      );
      props.chengeScrMem0003Data(scrMem0003Data);

      // ツールチップ設定
      setTvaaContractInfoTooltips([
        {
          field: 'priceTotal',
          tooltips: response.tvaaContractInfo.map((x) => {
            const textList: string[] = [];
            x.serviceInfo.map((f) => {
              textList.push(f.serviceName + '　' + f.servicePrice);
            });
            return {
              id: x.contractId,
              text: textList.join('\r'),
            };
          }),
        },
      ]);

      setBikeContractInfoTooltips([
        {
          field: 'priceTotal',
          tooltips: response.bikeContractInfo.map((x) => {
            const textList: string[] = [];
            x.serviceInfo.map((f) => {
              textList.push(f.serviceName + '　' + f.servicePrice);
            });
            return {
              id: x.contractId,
              text: textList.join('\r'),
            };
          }),
        },
      ]);

      // refs設定
      setTvaaContractInfoHrefs([
        {
          field: 'contractId',
          hrefs: contractCourseService.tvaaContractInfo.map((x) => {
            return {
              id: x.contractId,
              href:
                '/mem/corporations/' +
                corporationId +
                '/bussiness-bases/' +
                x.businessBaseId +
                '/contracts/' +
                x.contractId,
            };
          }),
        },
        {
          field: 'billingId',
          hrefs: contractCourseService.tvaaContractInfo.map((x) => {
            return {
              id: x.contractId,
              href:
                '/mem/corporations/' +
                corporationId +
                '/billings/' +
                x.billingId,
            };
          }),
        },
      ]);

      setBikeCountInfoHrefs([
        {
          field: 'contractId',
          hrefs: contractCourseService.bikeContractInfo.map((x) => {
            return {
              id: x.contractId,
              href:
                '/mem/corporations/' +
                corporationId +
                '/bussiness-bases/' +
                x.businessBaseId +
                '/contracts/' +
                x.contractId,
            };
          }),
        },
        {
          field: 'billingId',
          hrefs: contractCourseService.bikeContractInfo.map((x) => {
            return {
              id: x.contractId,
              href:
                '/mem/corporations/' +
                corporationId +
                '/billings/' +
                x.billingId,
            };
          }),
        },
      ]);

      setBillingInfoHrefs([
        {
          field: 'billingId',
          hrefs: contractCourseService.billingInfo.map((x) => {
            return {
              field: 'billingId',
              id: x.billingId,
              href: '/mem/corporations/' + x.billingId + '/billings/',
            };
          }),
        },
      ]);

      setAssignmentDocumentDestinationHrefs([
        {
          field: 'contractId',
          hrefs: contractCourseService.assignmentDocumentDestination.map(
            (x) => {
              return {
                id: x.contractId,
                href:
                  '/mem/corporations/' +
                  corporationId +
                  '/bussiness-bases/logisticsBaseId/contracts/' +
                  x.contractId,
              };
            }
          ),
        },
      ]);
    };

    if (corporationId === 'new') return;

    if (corporationId !== undefined && applicationId !== null) {
      historyInitialize(corporationId, applicationId);
    }

    if (corporationId !== undefined) {
      initialize(corporationId);
      return;
    }
  }, [corporationId, applicationId]);

  const handleIconContractAddClick = async () => {
    if (corporationId === undefined) return;

    // 契約情報追加チェック
    const request: ScrMem0003AddCheckContractInfoRequest = {
      corporationId: corporationId,
    };
    const response = await ScrMem0003AddCheckContractInfo(request);
    if (response.errorList.length < 0) {
      // 契約情報詳細遷移
      navigate(
        '/mem/corporations/' +
          corporationId +
          '/bussiness-bases/logisticsBaseId/contracts/contractId'
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

  const handleIconBillingAddClick = () => {
    // 請求先詳細遷移
    navigate('/mem/corporations/' + corporationId + '/billings/');
  };

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
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * エラー確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenScrCom0038Popup(false);
  };

  /**
   * データグリッドの背景色設定
   */
  const getTvaaContractInfoCellClassName = (
    params: GridCellParams<any, any, any, GridTreeNode>
  ): string => {
    let CellClassName = '';
    if (params.field === 'priceTotal') {
      tvaaContractInfo.map((x) => {
        if (x.id === params.id) {
          if (x.discountFlag) CellClassName = 'discount-flag';
        }
      });
    }
    return CellClassName;
  };
  const getBikeCountInfoRowsCellClassName = (
    params: GridCellParams<any, any, any, GridTreeNode>
  ): string => {
    let CellClassName = '';
    if (params.field === 'priceTotal') {
      bikeCountInfo.map((x) => {
        if (x.id === params.id) {
          if (x.discountFlag) CellClassName = 'discount-flag';
        }
      });
    }
    return CellClassName;
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
        <MainLayout main>
          <RightBox>
            <MarginBox mt={2} mb={4} ml={2} mr={2} gap={2}>
              <AddButton
                onClick={handleIconContractAddClick}
                disable={isReadOnly[0]}
              >
                契約情報追加
              </AddButton>
              <AddButton
                onClick={handleIconBillingAddClick}
                disable={isReadOnly[0]}
              >
                請求先追加
              </AddButton>
            </MarginBox>
          </RightBox>
          {/* 【四輪】契約情報セクション */}
          <Section
            name='【四輪】契約情報'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <OutputButton
                  onClick={() =>
                    handleIconOutputCsvClick(apiRefTvaaContractInfo)
                  }
                  disable={tvaaContractInfoRows.length <= 0}
                >
                  CSV出力
                </OutputButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={contractInfoColumns}
              columnGroupingModel={contractInfoColumnGroups}
              rows={tvaaContractInfoRows}
              tooltips={tvaaContractInfoTooltips}
              hrefs={tvaaContractInfoHrefs}
              pagination
              onLinkClick={handleLinkClick}
              getCellClassName={getTvaaContractInfoCellClassName}
              sx={{
                '& .discount-flag': {
                  backgroundColor: '#b9e7da',
                },
              }}
              apiRef={apiRefTvaaContractInfo}
            />
          </Section>
          {/* 【二輪】契約情報セクション */}
          <Section
            name='【二輪】契約情報'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <OutputButton
                  onClick={() => handleIconOutputCsvClick(apiRefBikeCountInfo)}
                  disable={bikeCountInfoRows.length <= 0}
                >
                  CSV出力
                </OutputButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={contractInfoColumns}
              columnGroupingModel={contractInfoColumnGroups}
              rows={bikeCountInfoRows}
              tooltips={bikeContractInfoTooltips}
              hrefs={bikeCountInfoHrefs}
              pagination
              onLinkClick={handleLinkClick}
              getCellClassName={getBikeCountInfoRowsCellClassName}
              sx={{
                '& .discount-flag': {
                  backgroundColor: '#b9e7da',
                },
              }}
              apiRef={apiRefBikeCountInfo}
            />
          </Section>
          {/* 請求先一覧セクション */}
          <Section
            name='請求先一覧'
            fitInside={true}
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <OutputButton
                  onClick={() => handleIconOutputCsvClick(apiRefBillingInfo)}
                  disable={billingInfoRows.length <= 0}
                >
                  CSV出力
                </OutputButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={billingInfoColumns}
              rows={billingInfoRows}
              hrefs={billingInfoHrefs}
              pagination
              onLinkClick={handleLinkClick}
              apiRef={apiRefBillingInfo}
            />
          </Section>
          {/* 譲渡書類送付先一覧セクション */}
          <Section
            name='譲渡書類送付先一覧'
            fitInside={true}
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <OutputButton
                  onClick={() =>
                    handleIconOutputCsvClick(
                      apiRefAssignmentDocumentDestination
                    )
                  }
                  disable={assignmentDocumentDestinationRows.length <= 0}
                >
                  CSV出力
                </OutputButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={assignmentDocumentDestinationInfoColumns}
              rows={assignmentDocumentDestinationRows}
              hrefs={assignmentDocumentDestinationHrefs}
              pagination
              onLinkClick={handleLinkClick}
              apiRef={apiRefAssignmentDocumentDestination}
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
    </>
  );
};

export default ScrMem0003ContractTab;

