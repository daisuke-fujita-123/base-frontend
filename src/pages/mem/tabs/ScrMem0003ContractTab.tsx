import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import { MarginBox, RightBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import {
  DataGrid,
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

import { GridColumnGroupingModel } from '@mui/x-data-grid-pro';

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
    size: 'm',
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
    size: 'm',
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
    size: 's',
  },
  {
    field: 'claimMethodKind',
    headerName: '会費請求方法',
    size: 's',
  },
  {
    field: 'debitBankName',
    headerName: '銀行（引落）',
    size: 's',
  },
  {
    field: 'debitBranchName',
    headerName: '支店（引落）',
    size: 's',
  },
  {
    field: 'debitAccountNumber',
    headerName: '口座番号（引落）',
    size: 's',
  },
  {
    field: 'payingBankName',
    headerName: '銀行（支払）',
    size: 's',
  },
  {
    field: 'payingBranchName',
    headerName: '支店（支払）',
    size: 's',
  },
  {
    field: 'payingAccountNumber',
    headerName: '口座番号（支払）',
    size: 's',
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
    size: 's',
  },
  {
    field: 'assignmentDocumentDestinationAddressBuildingName',
    headerName: '番地・号・建物名など',
    size: 's',
  },
  {
    field: 'assignmentDocumentDestinationPhoneNumber',
    headerName: 'TEL',
    size: 's',
  },
  {
    field: 'assignmentDocumentDestinationFaxNumber',
    headerName: 'FAX',
    size: 's',
  },
  {
    field: 'assignmentDocumentDestinationMailAddress',
    headerName: 'メールアドレス',
    size: 's',
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
  priceTotal: string;
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
 * エラー確認ポップアップモデル
 */
interface ScrCom0038PopupDataModel {
  // エラー内容リスト
  errorList: [
    {
      // エラーコード
      errorCode: string;
      // エラーメッセージ
      errorMessage: string;
    }
  ];
  // ワーニング内容リスト
  warnList: [
    {
      // エラーコード
      errorCode: string;
      // エラーメッセージ
      errorMessage: string;
    }
  ];
}

const tooltips = [
  {
    field: 'priceTotal',
    id: 0,
    value: '',
    text: 'サテロク 6,000円',
  },
];

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

        // TODO:詳細設計「イベント詳細定義（画面共通）」に構造変更の主記載のため、サンプル実装
        priceTotal: (100000).toLocaleString(),
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
        // TODO:詳細設計「イベント詳細定義（画面共通）」に構造変更の主記載のため、サンプル実装
        priceTotal: (100000).toLocaleString(),
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
  newScrMem0003Data.tvaaLimitCount = response.tvaaLimitCount;
  newScrMem0003Data.tvaaResponseCount = response.tvaaResponseCount;
  newScrMem0003Data.tvaaAcquisitionCount = response.tvaaAcquisitionCount;
  newScrMem0003Data.tvaaContractInfo = response.tvaaContractInfo;

  newScrMem0003Data.bikeLimitCount = response.bikeLimitCount;
  newScrMem0003Data.bikeResponseCount = response.bikeResponseCount;
  newScrMem0003Data.bikeAcquisitionCount = response.bikeAcquisitionCount;
  newScrMem0003Data.bikeContractInfo = response.bikeContractInfo;

  newScrMem0003Data.billingLimitCount = response.billingLimitCount;
  newScrMem0003Data.billingResponseCount = response.billingResponseCount;
  newScrMem0003Data.billingAcquisitionCount = response.billingAcquisitionCount;
  newScrMem0003Data.billingInfo = response.billingInfo;

  newScrMem0003Data.assignmentLimitCount = response.assignmentLimitCount;
  newScrMem0003Data.assignmentResponseCount = response.assignmentResponseCount;
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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  // state
  const [tvaaContractInfoRows, setTvaaContractInfoRows] = useState<
    ContractInfoModel[]
  >([]);
  const [bikeCountInfoRows, setBikeCountInfoRows] = useState<
    ContractInfoModel[]
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
    useState<ScrCom0038PopupDataModel>();

  useEffect(() => {
    const initialize = async (corporationId: string) => {
      // 与信情報取得API
      const request: ScrMem0003GetContractCourseServiceRequest = {
        corporationId: corporationId,
        limit: 0,
      };
      const response = await ScrMem0003GetContractCourseService(request);
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
      // TODO:詳細設計「イベント詳細定義（画面共通）」に構造変更の主記載のため、サンプル実装
      setTvaaContractInfoTooltips([
        {
          field: 'priceTotal',
          tooltips: contractCourseService.tvaaContractInfo.map((x) => {
            return {
              id: x.contractId,
              text: 'サテロク 6,000円',
            };
          }),
        },
      ]);

      setBikeContractInfoTooltips([
        {
          field: 'priceTotal',
          tooltips: contractCourseService.bikeContractInfo.map((x) => {
            return {
              id: x.contractId,
              text: 'サテロク 6,000円',
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
              href: '-?contractId=' + x.contractId,
            };
          }),
        },
        {
          field: 'billingId',
          hrefs: contractCourseService.tvaaContractInfo.map((x) => {
            return {
              id: x.contractId,
              href: '-?billingId=' + x.billingId,
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
              href: '-?contractId=' + x.contractId,
            };
          }),
        },
        {
          field: 'billingId',
          hrefs: contractCourseService.bikeContractInfo.map((x) => {
            return {
              id: x.contractId,
              href: '-?billingId=' + x.billingId,
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
                href: '-?contractId=' + x.contractId,
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
      const response = (await memApiClient.post('/get-history-info', request))
        .data;
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
      // TODO:詳細設計「イベント詳細定義（画面共通）」に構造変更の主記載のため、サンプル実装
      setTvaaContractInfoTooltips([
        {
          field: 'priceTotal',
          tooltips: contractCourseService.tvaaContractInfo.map((x) => {
            return {
              id: x.contractId,
              text: 'サテロク 6,000円',
            };
          }),
        },
      ]);

      setBikeContractInfoTooltips([
        {
          field: 'priceTotal',
          tooltips: contractCourseService.bikeContractInfo.map((x) => {
            return {
              id: x.contractId,
              text: 'サテロク 6,000円',
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
              href: '-?contractId=' + x.contractId,
            };
          }),
        },
        {
          field: 'billingId',
          hrefs: contractCourseService.tvaaContractInfo.map((x) => {
            return {
              id: x.contractId,
              href: '-?billingId=' + x.billingId,
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
              href: '-?contractId=' + x.contractId,
            };
          }),
        },
        {
          field: 'billingId',
          hrefs: contractCourseService.bikeContractInfo.map((x) => {
            return {
              id: x.contractId,
              href: '-?billingId=' + x.billingId,
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
                href: '-?contractId=' + x.contractId,
              };
            }
          ),
        },
      ]);
    };

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
      // 請求先詳細遷移
      navigate('/mem/corporations/' + corporationId + '/billings/');
    } else {
      // TODO: エラー確認ポップアップを表示
      setScrCom0038PopupData(response);
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
  const handleIconOutputCsvClick = () => {
    console.log('CSV出力');
  };

  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * エラー確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = () => {
    setIsOpenScrCom0038Popup(false);
    // 契約情報詳細遷移
    // TODO:パス確認
    navigate('-?corporationId=' + corporationId);
  };

  /**
   * エラー確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenScrCom0038Popup(false);
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <RightBox>
            <MarginBox mt={2} mb={4} ml={2} mr={2} gap={2}>
              <AddButton onClick={handleIconContractAddClick}>
                契約情報追加
              </AddButton>
              <AddButton onClick={handleIconBillingAddClick}>
                請求先追加
              </AddButton>
            </MarginBox>
          </RightBox>
          {/* 【四輪】契約情報セクション */}
          <Section
            name='【四輪】契約情報'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={contractInfoColumns}
              columnGroupingModel={contractInfoColumnGroups}
              rows={tvaaContractInfoRows}
              tooltips={tvaaContractInfoTooltips}
              hrefs={tvaaContractInfoHrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
          {/* 【二輪】契約情報セクション */}
          <Section
            name='【二輪】契約情報'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={contractInfoColumns}
              columnGroupingModel={contractInfoColumnGroups}
              rows={bikeCountInfoRows}
              tooltips={bikeContractInfoTooltips}
              hrefs={bikeCountInfoHrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
          {/* 請求先一覧セクション */}
          <Section
            name='請求先一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={billingInfoColumns}
              rows={billingInfoRows}
              hrefs={billingInfoHrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
          {/* 譲渡書類送付先一覧セクション */}
          <Section
            name='譲渡書類送付先一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={assignmentDocumentDestinationInfoColumns}
              rows={assignmentDocumentDestinationRows}
              hrefs={assignmentDocumentDestinationHrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
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

export default ScrMem0003ContractTab;

