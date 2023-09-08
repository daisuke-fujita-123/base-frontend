import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

import { RightBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { BlankLayout } from 'layouts/InputLayout';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton, OutputButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { DataGrid, exportCsv, GridColDef } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { TableDivider } from 'controls/Divider';
import { CaptionLabel } from 'controls/Label';
import { Radio } from 'controls/Radio';
import { Select, SelectValue } from 'controls/Select';
import { Textarea } from 'controls/Textarea';
import { LinkTextField, TextField } from 'controls/TextField';

import {
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999getCodeManagementMasterMultiple,
} from 'apis/com/ScrCom9999Api';
import {
  ScrDoc0005DocumentBasicsInfo,
  ScrDoc0005DocumentBasicsInfoResponse,
  ScrDoc0005RegistrationDocumentBasicsInfo,
  ScrDoc0005RegistrationDocumentBasicsInfoRequest,
} from 'apis/doc/ScrDoc0005Api';
import {
  ScrDoc9999GetLandCodeListbox,
  ScrDoc9999GetLandCodeListboxResponse,
} from 'apis/doc/ScrDoc9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * SCR-DOC-0005 書類情報詳細画面基本情報タブ
 */
interface ScrDoc0005DocumentBasics
  extends ScrDoc0005DocumentBasicsInfoResponse {
  // 書類有無
  documentExistence: string;
  // 支払延長車両
  paymentExtensionTargeted: string;
  // 支払延長利用有無(出品店)
  exhibitShopPaymentExtensionTargeted: string;
  // 出品店会員メモ有無
  exhibitShopMemberMemo: string;
  // 支払延長利用有無(落札店)
  bidShopPaymentExtensionTargeted: string;
  // 落札店会員メモ有無
  bidShopMemberMemo: string;
  // 保証
  guarantee: string;
  // 取説
  manual: string;
  // 記録
  record: string;
  // 手帳
  notebook: string;
  // 登録番号
  registrationNumber: string;
  // 新登録番号
  newRegistrationNumber: string;
}
const initialVal: ScrDoc0005DocumentBasics = {
  documentBasicsNumber: 0,
  auctionKindName: '',
  auctionKind: '',
  placeName: '',
  hondaGroupFlag: false,
  documentShippingInstructionFlag: false,
  auctionCount: 0,
  auctionSessionDate: '',
  exhibitNumber: '',
  cancelFlag: false,
  carName: '',
  carColor: '',
  modelYear: '',
  carbodyNumberFrameNo: '',
  carHistoryKind: '',
  no8Kind: '',
  carInspectionDate: '',
  carInspectionKind: '',
  exhaust: '',
  documentExistenceFlag: false,
  documentExistence: '',
  preemptionKind: '',
  pickUpExpectDate: '',
  omatomeCarPatternKind: '',
  paymentExtensionTargetedFlag: false,
  paymentExtensionTargeted: '',
  landCode: '',
  registrationNumber: '',
  registrationNumber1: 0,
  registrationNumber2: '',
  registrationNumber3: 0,
  exhibitShopContractId: '',
  exhibitShopCorporationId: '',
  exhibitShopCorporationName: '',
  exhibitShopPaymentExtensionTargetedFlag: false,
  exhibitShopPaymentExtensionTargeted: '',
  placeDocumentShippingDate: '',
  exhibitShopCourseEntryKind: '',
  exhibitShopAssignmentDocumentDestinationMailAddress: '',
  exhibitShopAssignmentDocumentDestinationPrefectureName: '',
  exhibitShopAssignmentDocumentDestinationPhoneNumber: '',
  exhibitShopAssignmentDocumentDestinationFaxNumber: '',
  exhibitShopClaimStaffName: '',
  exhibitShopMemberMemoFlag: false,
  exhibitShopMemberMemo: '',
  exhibitShopBikeRegistrationDepoName: '',
  exhibitShopBikeDepoKind: '',
  bidShopContractId: '',
  bidShopCorporationId: '',
  bidShopCorporationName: '',
  bidShopPaymentExtensionTargetedFlag: false,
  bidShopPaymentExtensionTargeted: '',
  bidShopCourseEntryKind: '',
  bidShopAssignmentDocumentDestinationMailAddress: '',
  bidShopAssignmentDocumentDestinationPrefectureName: '',
  bidShopAssignmentDocumentDestinationPhoneNumber: '',
  bidShopAssignmentDocumentDestinationFaxNumber: '',
  bidShopClaimStaffName: '',
  bidShopMemberMemoFlag: false,
  bidShopMemberMemo: '',
  bidShopBikeRegistrationDepoName: '',
  bidShopBikeDepoKind: '',
  auctionResultTranChangeBeforeTimestamp: new Date(),
  documentBasicsTranChangeBeforeTimestamp: new Date(),
  documentReceptionInfoList: [],
  equipmentReceptionInfoList: [],
  arrivesStatus: '',
  documentArrivesCompletionDate: '',
  documentSendingDueDate: '',
  documentReportDueDate: '',
  documentSubstanceDueDate: '',
  omatomeDocumentShippingDestinationKind: '',
  documentInfoList: [],
  incompleteSupportList: [],
  equipmentInfoList: [],
  guaranteeFlag: false,
  guarantee: '',
  manualFlag: false,
  manual: '',
  recordFlag: false,
  record: '',
  notebookFlag: false,
  notebook: '',
  receiptStatus: '',
  receiptCompletionDate: '',
  docChangeDueDate: '',
  docChangeDate: '',
  docChangeExecuteTimestamp: '',
  carTaxCashBackDate: '',
  bikeDepositCashBackDate: '',
  detailsInformationAcquisitionChargesApprovalDate: '',
  oldRegistration: '',
  newLandCode: '',
  newRegistrationNumber: '',
  newRegistrationNumber1: '',
  newRegistrationNumber2: '',
  newRegistrationNumber3: '',
  annualCarTax: 0,
  depositCarTaxTotalAmount: 0,
  recyclePriceDeposit: 0,
  bikeDeposit: 0,
  exhibitShopCashBackAmount: 0,
  bidShopCashBackAmount: 0,
  documentMemo: '',
};

/**
 * DataGrid列定義
 */
// 書類・備品情報（書類）リスト
const showDocumentInfoList: GridColDef[] = [
  {
    field: 'documentAdditionCount',
    headerName: '書類追加回数',
    size: 'm',
  },
  {
    field: 'documentArrivesDate',
    headerName: '書類到着日',
  },
  {
    field: 'documentShippingDate',
    headerName: '書類発送日',
  },
  {
    field: 'lastInputEmployeeId',
    headerName: '最終入力者',
    size: 'm',
  },
  {
    field: 'documentShippingSpecifySlipKindDocumentShippingSlipNumber',
    headerName: '書類発送伝票番号	',
    size: 'm',
  },
];
interface DocumentInfoListModel {
  /** ID */
  id: string;
  /** 書類追加回数*/
  documentAdditionCount: string;
  /** 書類到着日*/
  documentArrivesDate: string;
  /** 書類発送日*/
  documentShippingDate: string;
  /** 最終入力従業員ID*/
  lastInputEmployeeId: string;
  /** 書類発送伝票種類区分/書類発送伝票番号	*/
  documentShippingSpecifySlipKindDocumentShippingSlipNumber: string;
}
// 不備対応情報リスト
const showIncompleteSupportList: GridColDef[] = [
  {
    field: 'incompleteSupportDate',
    headerName: '日付',
    cellType: 'datepicker',
    size: 'm',
  },
  {
    field: 'incompleteSupportStatus',
    headerName: '対応ステータス',
    cellType: 'select',
    selectValues: [{ value: 0, displayValue: '' }],
    size: 'm',
  },
  {
    field: 'incompleteSupportStaffName',
    headerName: '対応担当者',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'incompleteAttributeKind',
    headerName: '不備属性',
    cellType: 'select',
    selectValues: [{ value: 0, displayValue: '' }],
    size: 'm',
  },
];
interface IncompleteSupportListModel {
  /** ID */
  id: string;
  /** 不備対応No */
  incompleteSupportNo: number;
  /** 不備対応日 */
  incompleteSupportDate: string;
  /** 不備対応ステータス */
  incompleteSupportStatus: string;
  /** 不備対応担当者名 */
  incompleteSupportStaffName: string;
  /** 不備属性区分 */
  incompleteAttributeKind: string;
  /** 変更前タイムスタンプ */
  changeBeforeTimestamp: Date;
}

// 書類・備品情報（備品）リスト
const showEquipmentInfoList: GridColDef[] = [
  {
    field: 'equipmentAdditionCount',
    headerName: '備品追加回数',
    size: 'm',
  },
  {
    field: 'equipmentArrivesDate',
    headerName: '備品到着日',
  },
  {
    field: 'equipmentShippingDate',
    headerName: '備品発送日',
  },
  {
    field: 'lastInputEmployeeId',
    headerName: '最終入力者',
    size: 'm',
  },
  {
    field: 'equipmentExistenceFlag',
    headerName: '備品有無',
  },
  {
    field: 'equipmentShippingSpecifySlipKindEquipmentShippingSlipNumber',
    headerName: '備品伝票番号',
    size: 'm',
  },
];
interface EquipmentInfoListModel {
  /** ID */
  id: string;
  /** 備品追加回数*/
  equipmentAdditionCount: string;
  /** 備品到着日*/
  equipmentArrivesDate: string;
  /** 備品発送日*/
  equipmentShippingDate: string;
  /** 備品最終入力従業員ID*/
  lastInputEmployeeId: string;
  /** 備品有無フラグ*/
  equipmentExistenceFlag: boolean;
  /** 備品発送伝票種類区分/備品発送伝票番号*/
  equipmentShippingSpecifySlipKindEquipmentShippingSlipNumber: string;
}

interface ScrDoc0005BasicTabProps {
  mailAvailable: (available: boolean) => void;
  printAvailable: (available: boolean) => void;
  outputAvailable: (available: boolean) => void;
  documentBasicsNumber: number;
  allReadOnly: boolean;
  isReadOnly: (readOnly: boolean) => void;
  isNotEditable: boolean;
}

const ScrDoc0005BasicTab = (props: ScrDoc0005BasicTabProps) => {
  const {
    mailAvailable,
    printAvailable,
    outputAvailable,
    documentBasicsNumber,
    allReadOnly,
    isReadOnly,
    isNotEditable,
  } = props;

  /**
   * 変数関連
   */
  // 書類受付情報リスト
  const [documentReceptionInfoList, setDocumentReceptionInfoList] = useState<
    ScrDoc0005DocumentBasicsInfoResponse['documentReceptionInfoList']
  >([]);
  // 備品受付情報リスト
  const [equipmentReceptionInfoList, setEquipmentReceptionInfoList] = useState<
    ScrDoc0005DocumentBasicsInfoResponse['equipmentReceptionInfoList']
  >([]);
  // 書類・備品情報（書類）リスト
  const [documentInfoList, setDocumentInfoList] = useState<
    DocumentInfoListModel[]
  >([]);
  // 不備対応情報リスト
  const [incompleteSupportList, setIncompleteSupportList] = useState<
    IncompleteSupportListModel[]
  >([]);
  // 書類・備品情報（備品）リスト
  const [equipmentInfoList, setEquipmentInfoList] = useState<
    EquipmentInfoListModel[]
  >([]);
  // 陸事コード
  const [landcodes, setLandCodes] = useState<SelectValue[]>([]);
  // おまとめ車両パターン
  const [omatomeSelectValues, setOmatomeSelectValues] = useState<SelectValue[]>(
    []
  );
  // 登録内容確認ポップアップ
  const [scrCom00032PopupIsOpen, setScrCom00032PopupIsOpen] =
    useState<boolean>(false);

  const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
    errorList: [],
    warningList: [],
    registrationChangeList: [
      {
        screenId: '',
        screenName: '',
        tabId: 0,
        tabName: '',
        sectionList: [
          {
            sectionName: '',
            columnList: [
              {
                columnName: '',
              },
            ],
          },
        ],
      },
    ],
    changeExpectDate: '',
  };
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  // コンポーネントを読み取り専用に変更するフラグ
  const methods = useForm<ScrDoc0005DocumentBasics>({
    defaultValues: initialVal,
    context: allReadOnly,
    resolver: yupResolver(yup.object()),
  });
  const {
    getValues,
    reset,
    trigger,
    formState: { dirtyFields },
  } = methods;

  // 初期表示
  useEffect(() => {
    const initialize = async () => {
      const response: ScrDoc0005DocumentBasicsInfoResponse =
        await ScrDoc0005DocumentBasicsInfo({
          documentBasicsNumber: documentBasicsNumber,
        });
      // 取得値を変換
      const addObj = {
        documentExistence:
          response.documentExistenceFlag === true ? '有' : '無',
        paymentExtensionTargeted:
          response.paymentExtensionTargetedFlag === true ? '対象' : '対象外',
        exhibitShopPaymentExtensionTargeted:
          response.exhibitShopPaymentExtensionTargetedFlag === true
            ? 'あり'
            : 'なし',
        exhibitShopMemberMemo:
          response.exhibitShopMemberMemoFlag === true ? 'あり' : 'なし',
        bidShopPaymentExtensionTargeted:
          response.bidShopPaymentExtensionTargetedFlag === true
            ? 'あり'
            : 'なし',
        bidShopMemberMemo:
          response.bidShopMemberMemoFlag === true ? 'あり' : 'なし',
        guarantee: response.guaranteeFlag === true ? '有' : '無',
        manual: response.manualFlag === true ? '対象' : '対象外',
        record: response.recordFlag === true ? 'あり' : 'なし',
        notebook: response.notebookFlag === true ? 'あり' : 'なし',
        newRegistrationNumber:
          response.newRegistrationNumber1 +
          ' ' +
          response.newRegistrationNumber2 +
          ' ' +
          response.newRegistrationNumber3,
        registrationNumber:
          response.registrationNumber1 +
          ' ' +
          response.registrationNumber2 +
          ' ' +
          response.registrationNumber3,
      };
      // 基本情報タブ情報
      reset(Object.assign(addObj, response));

      // 書類受付情報リスト作成
      setDocumentReceptionInfoList(response.documentReceptionInfoList);
      // 備品受付情報リスト作成
      setEquipmentReceptionInfoList(response.equipmentReceptionInfoList);
      // 書類・備品情報（書類）リスト作成
      const documentInfoList = convertToDocumentInfoListModel(response);
      setDocumentInfoList(documentInfoList);
      // 不備対応情報リスト作成
      const incompleteSupportList =
        convertToIncompleteSupportListModel(response);
      setIncompleteSupportList(incompleteSupportList);
      // 書類・備品情報（備品）リスト作成
      const equipmentInfoList = convertToEquipmentInfoListModel(response);
      setEquipmentInfoList(equipmentInfoList);

      // おまとめ車両パターン
      const omatomeRes = await ScrCom9999GetCodeManagementMaster({
        codeId: 'CDE-COM-0073',
      });
      const omatomeSelectValues: SelectValue[] =
        omatomeRes.searchGetCodeManagementMasterListbox.map((val) => {
          return {
            value: val.codeValue,
            displayValue: val.codeName,
          };
        });
      setOmatomeSelectValues(omatomeSelectValues);

      // 陸事コード取得
      const landSelect: ScrDoc9999GetLandCodeListboxResponse =
        await ScrDoc9999GetLandCodeListbox();
      const landSelectValues: SelectValue[] = landSelect.landCodeList.map(
        (val) => {
          return {
            value: val.landCode,
            displayValue: val.landCodeName,
          };
        }
      );
      setLandCodes(landSelectValues);

      // 不備対応ステータス
      const incompleteSupportRes = await ScrCom9999GetCodeManagementMaster({
        codeId: 'CDE-COM-0082',
      });
      const incompleteSupportSelectValues: SelectValue[] =
        incompleteSupportRes.searchGetCodeManagementMasterListbox.map((val) => {
          return {
            value: val.codeValue,
            displayValue: val.codeName,
          };
        });

      // 選択肢の作成 TODO要修正
      const selectCode =
        getValues('auctionKindName') === '1'
          ? 'CDE-COM-0083'
          : getValues('auctionKindName') === '2'
          ? 'CDE-COM-0084'
          : 'CDE-COM-0085';
      const selectRes = await ScrCom9999getCodeManagementMasterMultiple({
        codeIdList: [{ codeId: selectCode }],
      });

      const selectSelectValues: SelectValue[] = selectRes.resultList
        .filter((val) => val.codeId === selectCode)
        .map((codeVal) =>
          codeVal.codeValueList.map((v) => ({
            value: v.codeValue,
            displayValue: v.codeValue,
          }))
        )
        .flat();
      console.log('557', incompleteSupportSelectValues);
      console.log(selectSelectValues);
      showIncompleteSupportList.map((val) => {
        if (val.field === 'incompleteSupportStatus') {
          val.selectValues?.push(incompleteSupportSelectValues);
        } else if (val.field === 'incompleteAttributeKind') {
          val.selectValues?.push(selectSelectValues);
        }
      });
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 書類基本情報取得APIレスポンスから書類・備品情報（書類）リストモデルへの変換
   */
  const convertToDocumentInfoListModel = (
    response: ScrDoc0005DocumentBasicsInfoResponse
  ): DocumentInfoListModel[] => {
    return response.documentInfoList.map((x, index) => {
      return {
        id: String(index),
        documentAdditionCount: x.documentAdditionCount,
        documentArrivesDate: x.documentArrivesDate,
        documentShippingDate: x.documentShippingDate,
        lastInputEmployeeId: x.lastInputEmployeeId,
        documentShippingSpecifySlipKindDocumentShippingSlipNumber:
          x.documentShippingSpecifySlipKindDocumentShippingSlipNumber,
      };
    });
  };
  /**
   * 書類基本情報取得APIレスポンスから不備対応情報リストモデルへの変換
   */
  const convertToIncompleteSupportListModel = (
    response: ScrDoc0005DocumentBasicsInfoResponse
  ): IncompleteSupportListModel[] => {
    return response.incompleteSupportList.map((x, index) => {
      return {
        id: String(index),
        incompleteSupportNo: x.incompleteSupportNo,
        incompleteSupportDate: x.incompleteSupportDate,
        incompleteSupportStatus: x.incompleteSupportStatus,
        incompleteSupportStaffName: x.incompleteSupportStaffName,
        incompleteAttributeKind: x.incompleteAttributeKind,
        changeBeforeTimestamp: x.changeBeforeTimestamp,
      };
    });
  };
  /**
   * 書類基本情報取得APIレスポンスから書類・備品情報（備品）リストモデルへの変換
   */
  const convertToEquipmentInfoListModel = (
    response: ScrDoc0005DocumentBasicsInfoResponse
  ): EquipmentInfoListModel[] => {
    return response.equipmentInfoList.map((x, index) => {
      return {
        id: String(index),
        equipmentAdditionCount: x.equipmentAdditionCount,
        equipmentArrivesDate: x.equipmentArrivesDate,
        equipmentShippingDate: x.equipmentShippingDate,
        lastInputEmployeeId: x.lastInputEmployeeId,
        equipmentExistenceFlag: x.equipmentExistenceFlag,
        equipmentShippingSpecifySlipKindEquipmentShippingSlipNumber:
          x.equipmentShippingSpecifySlipKindEquipmentShippingSlipNumber,
      };
    });
  };

  const apiRef = useGridApiRef();

  const handleExportCsvClick = () => {
    exportCsv('filename.csv', apiRef);
  };

  useEffect(() => {
    isReadOnly(getValues('cancelFlag'));
  }, [getValues, isReadOnly]);

  useEffect(() => {
    mailAvailable(
      getValues('cancelFlag') || getValues('auctionKindName') === 'おまとめ'
    );
  }, [getValues, mailAvailable]);

  useEffect(() => {
    printAvailable(getValues('cancelFlag'));
  }, [getValues, printAvailable]);

  useEffect(() => {
    outputAvailable(getValues('cancelFlag'));
  }, [getValues, outputAvailable]);

  // 書類受付情報セクションの表示切替
  useEffect(() => {
    // おまとめ車両パターンが全項目(0)の場合。
    if (getValues('omatomeCarPatternKind') === '0') {
      const documentItemCode = [
        '101',
        '102',
        '103',
        '104',
        '105',
        '106',
        '107',
        '108',
        '109',
        '110',
        '112',
        '113',
        '114',
      ];
      const newVal = documentReceptionInfoList.filter((val) =>
        documentItemCode.includes(val.documentItemCode)
      );
      setDocumentReceptionInfoList(newVal);

      // おまとめ車両パターンが普通車検有(1)の場合。
    } else if (getValues('omatomeCarPatternKind') === '1') {
      const documentItemCode = [
        '101',
        '102',
        '103',
        '104',
        '105',
        '106',
        '107',
        '108',
        '109',
        '110',
        '112',
        '113',
      ];
      const newVal = documentReceptionInfoList.filter((val) =>
        documentItemCode.includes(val.documentItemCode)
      );
      setDocumentReceptionInfoList(newVal);

      // おまとめ車両パターンが普通車検無(2)の場合。
    } else if (getValues('omatomeCarPatternKind') === '2') {
      const documentItemCode = ['101', '104', '107'];
      const newVal = documentReceptionInfoList.filter((val) =>
        documentItemCode.includes(val.documentItemCode)
      );
      setDocumentReceptionInfoList(newVal);

      // おまとめ車両パターンが軽自動車検有(3)の場合。
    } else if (getValues('omatomeCarPatternKind') === '3') {
      const documentItemCode = [
        '101',
        '102',
        '103',
        '104',
        '107',
        '108',
        '109',
        '110',
        '112',
        '113',
      ];
      const newVal = documentReceptionInfoList.filter((val) =>
        documentItemCode.includes(val.documentItemCode)
      );
      setDocumentReceptionInfoList(newVal);

      // おまとめ車両パターンが軽自動車検無(4)の場合。
    } else if (getValues('omatomeCarPatternKind') === '4') {
      const documentItemCode = ['101', '104', '107'];
      const newVal = documentReceptionInfoList.filter((val) =>
        documentItemCode.includes(val.documentItemCode)
      );
      setDocumentReceptionInfoList(newVal);
    } else {
      setDocumentReceptionInfoList([]);
    }
  }, [getValues, documentReceptionInfoList]);
  const navigate = useNavigate();
  const handlenavigate = (url: string) => {
    navigate(url, true);
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/doc/documents/');
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const onClickConfirm = () => {
    trigger();

    // TODO 書類受付情報入力チェック処理

    // 登録内容確認ポップアップに渡すデータをセット
    setScrCom0032PopupData({
      errorList: [],
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-DOC-0005',
          screenName: '書類情報詳細',
          tabId: 1,
          tabName: '基本情報',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      // 日付の確認
      changeExpectDate: null,
    });

    // 登録内容確認ポップアップを開く
    setScrCom00032PopupIsOpen(true);
  };

  /**
   * セクション構造定義 TODO fieldsとnameの修正
   */
  const sectionDef = [
    {
      section: '書類情報詳細',
      fields: [''],
      name: [''],
    },
  ];

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToSectionList = (dirtyFields: object): sectionList[] => {
    const fields = Object.keys(dirtyFields);
    const sectionList: sectionList[] = [];
    const columnList: columnList[] = [];
    sectionDef.forEach((d) => {
      fields.forEach((f) => {
        if (d.fields.includes(f)) {
          columnList.push({ columnName: d.name[d.fields.indexOf(f)] });
        }
      });
      sectionList.push({
        sectionName: d.section,
        columnList: columnList,
      });
    });
    return sectionList;
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const { user } = useContext(AuthContext);
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setScrCom00032PopupIsOpen(false);

    const values = {
      applicationEmployeeId: user.employeeId,
      registrationChangeMemo: registrationChangeMemo,
      screenId: 'SCR-DOC-0005',
      tabId: '1',
    };

    const req: ScrDoc0005RegistrationDocumentBasicsInfoRequest = {
      basicsInfo: Object.assign(getValues(), values),
    };
    const res = await ScrDoc0005RegistrationDocumentBasicsInfo(req);
  };

  return (
    <MainLayout>
      <MainLayout main>
        <FormProvider {...methods}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Section name='オークション基本情報' isDocDetail>
                <RowStack spacing={7}>
                  <ColStack spacing={2.4}>
                    <TextField
                      label='オークション種類'
                      name='auctionKindName'
                      readonly
                    />
                    <TextField
                      label='オークション回数'
                      name='auctionCount'
                      readonly
                    />
                    <TextField label='出品番号' name='exhibitNumber' readonly />
                    <TextField
                      label='会場（おまとめ）'
                      name='placeName'
                      readonly
                    />
                  </ColStack>
                  <ColStack spacing={2.4}>
                    <TextField
                      label='オークション開催日'
                      name='auctionSessionDate'
                      readonly
                    />
                    <BlankLayout quantity={2} />
                    <Checkbox
                      label='キャンセルフラグ'
                      name='cancelFlag'
                    ></Checkbox>
                  </ColStack>
                </RowStack>
              </Section>
            </Grid>
            <Grid item xs={8}>
              <Section name='車両情報' isDocDetail>
                <RowStack spacing={7}>
                  <ColStack spacing={2.4}>
                    <TextField label='車名' name='carName' readonly />
                    <TextField
                      label='車検日'
                      name='carInspectionDate'
                      readonly
                    />
                    <Select
                      label='おまとめ車両パターン'
                      name='omatomeCarPatternKind'
                      selectValues={omatomeSelectValues}
                      disabled={
                        allReadOnly ||
                        getValues('auctionKindName') === 'おまとめ以外'
                      }
                    />
                    <TextField label='色' name='carColor' readonly />
                  </ColStack>
                  <ColStack spacing={2.4}>
                    <TextField
                      label='検付区分'
                      name='carInspectionKind'
                      readonly
                    />
                    <TextField
                      label='支払延長対象区分'
                      name='paymentExtensionTargeted'
                      readonly
                    />
                    <TextField label='年式' name='modelYear' readonly />
                    <TextField label='排気量' name='exhaust' readonly />
                  </ColStack>
                  <ColStack spacing={2.4}>
                    <TextField label='陸事コード' name='landCode' readonly />
                    <TextField
                      label='車台番号・フレームNo'
                      name='carbodyNumberFrameNo'
                      readonly={
                        allReadOnly ||
                        getValues('auctionKindName') === 'おまとめ以外'
                      }
                    />
                    <TextField
                      label='書類有無フラグ'
                      name='documentExistence'
                      readonly
                    />
                    <TextField
                      label='登録番号'
                      name='registrationNumber'
                      readonly
                    />
                  </ColStack>
                  <ColStack spacing={2.4}>
                    <TextField label='車歴' name='carHistoryKind' readonly />
                    <TextField
                      label='先取種別'
                      name='preemptionKind'
                      readonly
                    />
                    <TextField label='8No区分' name='no8Kind' readonly />
                    <TextField
                      label='引取予定日'
                      name='pickUpExpectDate'
                      readonly
                    />
                  </ColStack>
                </RowStack>
              </Section>
            </Grid>
          </Grid>
          <Section name='出品店・落札店情報' isDocDetail>
            <Stack spacing={2.4}>
              <Stack spacing={1}>
                <CaptionLabel text='出品店' />
                <RowStack>
                  <ColStack>
                    <LinkTextField
                      label='出品店契約ID'
                      name='exhibitShopContractId'
                      onClick={() =>
                        handlenavigate(
                          `/mem/corporations/${getValues(
                            'exhibitShopCorporationId'
                          )}/bussiness-bases/:logisticsBaseId/contracts/${getValues(
                            'exhibitShopContractId'
                          )}`
                        )
                      }
                    />
                    <TextField
                      label='出品店地区'
                      name='exhibitShopAssignmentDocumentDestinationPrefectureName'
                      readonly
                    />
                    {getValues('auctionKindName') === '二輪' && (
                      <TextField
                        label='出品店登録デポ'
                        name='exhibitShopBikeRegistrationDepoName'
                        readonly
                      />
                    )}
                  </ColStack>
                  <ColStack>
                    <TextField
                      label='出品店名'
                      name='exhibitShopCorporationName'
                      readonly
                      size='m'
                    />
                    <TextField
                      label='出品店電話番号'
                      name='exhibitShopAssignmentDocumentDestinationPhoneNumber'
                      readonly
                    />
                    {getValues('auctionKindName') === '二輪' && (
                      <TextField
                        label='出品店デポ区分'
                        name='exhibitShopBikeDepoKind'
                        readonly
                      />
                    )}
                  </ColStack>
                  <ColStack>
                    <TextField
                      label='支払延長利用有無'
                      name='exhibitShopPaymentExtensionTargeted'
                      readonly
                    />
                    <TextField
                      label='出品店FAX番号'
                      name='exhibitShopAssignmentDocumentDestinationFaxNumber'
                      readonly
                    />
                  </ColStack>
                  <ColStack>
                    <TextField
                      label='参加区分'
                      name='exhibitShopCourseEntryKind'
                      readonly
                    />
                    <TextField
                      label='出品店クレーム担当'
                      name='exhibitShopClaimStaffName'
                      readonly
                    />
                  </ColStack>
                  <ColStack>
                    <DatePicker
                      label='会場書類発送日'
                      name='placeDocumentShippingDate'
                      disabled={
                        allReadOnly ||
                        getValues('auctionKindName') !== 'おまとめ' ||
                        getValues('hondaGroupFlag') !== false
                      }
                    />
                    <LinkTextField
                      label='出品店会員メモ有無'
                      name='exhibitShopMemberMemo'
                      onClick={() =>
                        handlenavigate(
                          `/mem/corporations/${getValues(
                            'exhibitShopCorporationId'
                          )}`
                        )
                      }
                    />
                  </ColStack>
                </RowStack>
              </Stack>
              <Stack spacing={1}>
                <CaptionLabel text='落札店' />
                <RowStack>
                  <ColStack>
                    <LinkTextField
                      label='落札店契約ID'
                      name='bidShopContractId'
                      onClick={() =>
                        handlenavigate(
                          `/mem/corporations/${getValues(
                            'bidShopCorporationId'
                          )}/bussiness-bases/:logisticsBaseId/contracts/${getValues(
                            'bidShopContractId'
                          )}`
                        )
                      }
                    />
                    <TextField
                      label='落札店地区'
                      name='bidShopAssignmentDocumentDestinationPrefectureName'
                      readonly
                    />
                    {getValues('auctionKindName') === '二輪' && (
                      <TextField
                        label='落札店登録デポ'
                        name='bidShopBikeRegistrationDepoName'
                        readonly
                      />
                    )}
                  </ColStack>
                  <ColStack>
                    <TextField
                      label='落札店名'
                      name='bidShopCorporationName'
                      readonly
                      size='m'
                    />
                    <TextField
                      label='落札店電話番号'
                      name='bidShopAssignmentDocumentDestinationPhoneNumber'
                      readonly
                    />
                    {getValues('auctionKindName') === '二輪' && (
                      <TextField
                        label='落札店デポ区分'
                        name='bidShopBikeDepoKind'
                        readonly
                      />
                    )}
                  </ColStack>
                  <ColStack>
                    <TextField
                      label='支払延長利用有無'
                      name='bidShopPaymentExtensionTargeted'
                      readonly
                    />
                    <TextField
                      label='落札店FAX番号'
                      name='bidShopAssignmentDocumentDestinationFaxNumber'
                      readonly
                    />
                  </ColStack>
                  <ColStack>
                    <TextField
                      label='参加区分'
                      name='bidShopCourseEntryKind'
                      readonly
                    />
                    <TextField
                      label='落札店クレーム担当'
                      name='bidShopClaimStaffName'
                      readonly
                    />
                  </ColStack>
                  <ColStack>
                    <BlankLayout quantity={1} />
                    <LinkTextField
                      label='落札店会員メモ有無'
                      name='bidShopMemberMemo'
                      onClick={() =>
                        handlenavigate(
                          `/mem/corporations/${getValues(
                            'bidShopCorporationId'
                          )}`
                        )
                      }
                    />
                  </ColStack>
                </RowStack>
              </Stack>
            </Stack>
          </Section>
          <Section name='書類受付情報' isDocDetail>
            <Stack spacing={1}>
              <CaptionLabel text='必須書類' />
              <Grid container spacing={2}>
                {documentReceptionInfoList.map(
                  (val, index) =>
                    val.requiredDocumentFlag && (
                      <Grid item xs={2} key={index}>
                        <Checkbox
                          name={val.documentItemCode}
                          label={val.documentItemName}
                          helperText={`書類到着日:${val.documentArrivesDate}`}
                          disabled={allReadOnly || val.documentExistenceFlag}
                        />
                        {val.validityDueDateFlag && (
                          <DatePicker
                            name={val.validityDueDate}
                            label='有効期限'
                            disabled={allReadOnly || val.documentExistenceFlag}
                          />
                        )}
                      </Grid>
                    )
                )}
              </Grid>
            </Stack>
            <TableDivider isBlack />
            <Stack spacing={1}>
              <CaptionLabel text='任意書類' />
              <Grid container spacing={2}>
                {documentReceptionInfoList.map(
                  (val, index) =>
                    !val.requiredDocumentFlag && (
                      <Grid item xs={2} key={index}>
                        <Checkbox
                          name={val.documentItemCode}
                          label={val.documentItemName}
                          helperText={`書類到着日:${val.documentArrivesDate}`}
                          disabled={allReadOnly || val.documentExistenceFlag}
                        />
                        {val.validityDueDateFlag && (
                          <DatePicker
                            name={val.validityDueDate}
                            label='有効期限'
                            disabled={allReadOnly || val.documentExistenceFlag}
                          />
                        )}
                      </Grid>
                    )
                )}
              </Grid>
            </Stack>
          </Section>
          <Section name='備品受付情報' isDocDetail>
            <Stack spacing={1}>
              <CaptionLabel text='備品' />
              <Grid container spacing={2}>
                {equipmentReceptionInfoList.map((val, index) => (
                  <Grid item xs={2} key={index}>
                    <Checkbox
                      name={val.equipmentItemCode}
                      label={val.equipmentItemName}
                      helperText={`書類到着日:${val.equipmentArrivesDate}`}
                      disabled={allReadOnly || val.equipmentExistenceFlag}
                    />
                    {val.othersEquipmentItemNameFlag && (
                      <TextField
                        name={val.othersEquipmentItemName}
                        label='その他'
                        readonly={allReadOnly || val.equipmentExistenceFlag}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Section>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Section name='書類・備品情報（書類）' isDocDetail>
                <Stack>
                  <RowStack>
                    <ColStack>
                      <TextField label='到着ステータス' name='arrivesStatus' />
                      <TextField
                        label='到着完了日'
                        name='documentArrivesCompletionDate'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='書類送付期限日'
                        name='documentSendingDueDate'
                        readonly
                      />
                      <TextField
                        label='書類申告期限日'
                        name='documentReportDueDate'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <Radio
                        label='発送先（おまとめ）'
                        name='documentShippingInstructionFlag'
                        required
                        radioValues={[
                          { value: false, displayValue: 'オークネット' },
                          { value: true, displayValue: '会員' },
                        ]}
                        disabled={
                          allReadOnly ||
                          getValues('documentShippingInstructionFlag') !== false
                        }
                      />
                      <TextField
                        label='書類実質期限日'
                        name='documentSubstanceDueDate'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                  <DataGrid
                    columns={showDocumentInfoList}
                    rows={documentInfoList}
                    getRowId={(row) => row.id + row.documentAdditionCount}
                  />
                </Stack>
              </Section>
            </Grid>
            <Grid item xs={6}>
              <Section name='不備対応情報' isDocDetail>
                <Stack>
                  <RightBox>
                    <OutputButton
                      onClick={handleExportCsvClick}
                      disable={allReadOnly}
                    >
                      CSV出力
                    </OutputButton>
                  </RightBox>
                  <DataGrid
                    columns={showIncompleteSupportList}
                    rows={incompleteSupportList}
                    getRowId={(row) => row.id + row.incompleteSupportNo}
                  />
                </Stack>
              </Section>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Section name='書類・備品情報（備品）' isDocDetail>
                <DataGrid
                  columns={showEquipmentInfoList}
                  rows={equipmentInfoList}
                  disabled={allReadOnly}
                  getRowId={(row) => row.id + row.equipmentAdditionCount}
                />
              </Section>
            </Grid>
            <Grid item xs={4}>
              <Section name='出品書類情報' isDocDetail>
                <RowStack>
                  <ColStack>
                    <TextField label='保証' name='guarantee' readonly />
                    <TextField label='記録' name='record' readonly />
                  </ColStack>
                  <ColStack>
                    <TextField label='取説' name='manual' readonly />
                    <TextField label='手帳' name='notebook' readonly />
                  </ColStack>
                </RowStack>
              </Section>
            </Grid>
            <Grid item xs={2}>
              <Section name='入金情報' isDocDetail>
                <RowStack>
                  <ColStack>
                    <TextField
                      label='入金ステータス'
                      name='receiptStatus'
                      readonly
                    />
                    <TextField
                      label='入金完了日'
                      name='receiptCompletionDate'
                      readonly
                    />
                  </ColStack>
                </RowStack>
              </Section>
            </Grid>
          </Grid>
          <Section name='名義変更情報' isDocDetail>
            <RowStack>
              <ColStack>
                <TextField
                  label='名変期限日'
                  name='docChangeDueDate'
                  readonly
                />
                <TextField label='旧登録' name='oldRegistration' readonly />
                <TextField
                  label='預かり金（二輪）'
                  name='bikeDeposit'
                  readonly
                />
              </ColStack>
              <ColStack>
                <DatePicker label='名変期限日' name='docChangeDueDate' />
                <Select
                  label='（新登録）陸事コード'
                  name='newLandCode'
                  selectValues={landcodes}
                />
                <TextField
                  label='出品店返金額'
                  name='exhibitShopCashBackAmount'
                  readonly
                />
              </ColStack>
              <ColStack>
                <TextField
                  label='名義変更日'
                  name='docChangeDate'
                  readonly={allReadOnly}
                />
                <TextField
                  label='新登録番号1'
                  name='newRegistrationNumber'
                  readonly
                />
                <TextField
                  label='落札店返金額'
                  name='bidShopCashBackAmount'
                  readonly
                />
              </ColStack>
              <ColStack>
                <TextField
                  label='自税返金日'
                  name='carTaxCashBackDate'
                  readonly
                />
                <TextField label='年額自動車税' name='annualCarTax' readonly />
              </ColStack>
              <ColStack>
                <TextField
                  label='二輪預かり金返金日'
                  name='bikeDepositCashBackDate'
                  readonly
                />
                <TextField
                  label='預かり自税総額'
                  name='depositCarTaxTotalAmount'
                  readonly
                />
              </ColStack>
              <ColStack>
                <TextField
                  label='詳細情報取得課金承認日'
                  name='detailsInformationAcquisitionChargesApprovalDate'
                  readonly
                />
                <TextField
                  label='リサイクル料預託金'
                  name='recyclePriceDeposit'
                />
              </ColStack>
            </RowStack>
          </Section>
          <Section name='メモ' isDocDetail>
            <Textarea
              name='documentMemo'
              size='m'
              disabled={isNotEditable}
            ></Textarea>
          </Section>
        </FormProvider>
      </MainLayout>
      {/* bottom */}
      <MainLayout bottom>
        <Stack direction='row' alignItems='center'>
          <CancelButton onClick={handleCancel} disable={allReadOnly}>
            キャンセル
          </CancelButton>
          <ConfirmButton onClick={onClickConfirm} disable={allReadOnly}>
            確定
          </ConfirmButton>
        </Stack>
      </MainLayout>
      {/* 登録内容確認ポップアップ */}
      {scrCom00032PopupIsOpen && (
        <ScrCom0032Popup
          isOpen={scrCom00032PopupIsOpen}
          data={scrCom0032PopupData}
          handleCancel={() => {
            setScrCom00032PopupIsOpen(false);
          }}
          handleRegistConfirm={handlePopupConfirm}
          handleApprovalConfirm={handlePopupConfirm}
        />
      )}
    </MainLayout>
  );
};

export default ScrDoc0005BasicTab;
