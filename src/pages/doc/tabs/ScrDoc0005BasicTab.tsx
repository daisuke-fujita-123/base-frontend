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
import { LinkTextField, PriceTextField, TextField } from 'controls/TextField';

import {
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999getCodeManagementMasterMultiple,
} from 'apis/com/ScrCom9999Api';
import {
  ScrDoc0005ChangeHistoryCrossSectionInfo,
  ScrDoc0005DocumentBasicsInfo,
  ScrDoc0005DocumentBasicsInfoResponse,
  ScrDoc0005RegistrationDocumentBasicsInfo,
  ScrDoc0005RegistrationDocumentBasicsInfoRequest,
} from 'apis/doc/ScrDoc0005Api';

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
  paymentExtensionTargetedCar: '',
  paymentExtensionTargeted: '',
  landCode: '',
  registrationNumber: '',
  registrationNumber1: 0,
  registrationNumber2: '',
  registrationNumber3: 0,
  exhibitShopContractId: '',
  exhibitShopCorporationId: '',
  exhibitShopCorporationName: '',
  exhibitShopPaymentExtensionTargeted: '',
  placeDocumentShippingDate: '',
  exhibitShopCourseEntryKind: '',
  exhibitShopAssignmentDocumentDestinationMailAddress: '',
  exhibitShopAssignmentDocumentDestinationPrefectureName: '',
  exhibitShopAssignmentDocumentDestinationPhoneNumber: '',
  exhibitShopAssignmentDocumentDestinationFaxNumber: '',
  exhibitShopClaimStaffName: '',
  exhibitShopMemberMemo: '',
  exhibitShopBikeRegistrationDepoName: '',
  exhibitShopBikeDepoKind: '',
  bidShopContractId: '',
  bidShopCorporationId: '',
  bidShopCorporationName: '',
  bidShopPaymentExtensionTargeted: '',
  bidShopCourseEntryKind: '',
  bidShopAssignmentDocumentDestinationMailAddress: '',
  bidShopAssignmentDocumentDestinationPrefectureName: '',
  bidShopAssignmentDocumentDestinationPhoneNumber: '',
  bidShopAssignmentDocumentDestinationFaxNumber: '',
  bidShopClaimStaffName: '',
  bidShopMemberMemo: '',
  bidShopBikeRegistrationDepoName: '',
  bidShopBikeDepoKind: '',
  auctionResultTranChangeBeforeTimestamp: new Date(),
  documentBasicsTranChangeBeforeTimestamp: new Date(),
  requiredDocumentReceptionInfoList: [],
  optionalDocumentReceptionInfoList: [],
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
  guarantee: '',
  manual: '',
  record: '',
  notebook: '',
  receiptStatus: '',
  receiptCompletionDate: '',
  docChangeDueDate: '',
  docChangeDate: '',
  docChangeExecuteTimestamp: new Date(),
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
    size: 'm',
  },
  {
    field: 'documentShippingDate',
    headerName: '書類発送日',
    size: 'm',
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
    size: 's',
  },
  {
    field: 'equipmentArrivesDate',
    headerName: '備品到着日',
    size: 'm',
  },
  {
    field: 'equipmentShippingDate',
    headerName: '備品発送日',
    size: 'm',
  },
  {
    field: 'lastInputEmployeeId',
    headerName: '最終入力者',
    size: 's',
  },
  {
    field: 'equipmentExistence',
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
  /** 備品有無*/
  equipmentExistence: string;
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
  pageParams: boolean;
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
    pageParams,
  } = props;
  const { user } = useContext(AuthContext);
  /**
   * 変数関連
   */
  // 必須書類受付情報リスト
  const [
    requiredDocumentReceptionInfoList,
    setRequiredDocumentReceptionInfoList,
  ] = useState<
    ScrDoc0005DocumentBasicsInfoResponse['requiredDocumentReceptionInfoList']
  >([]);
  // 任意書類受付情報リスト
  const [
    optionalDocumentReceptionInfoList,
    setOptionalDocumentReceptionInfoList,
  ] = useState<
    ScrDoc0005DocumentBasicsInfoResponse['optionalDocumentReceptionInfoList']
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

  /**
   * バリデーションスキーマ
   */
  const documentBasicSchama = {
    carbodyNumberFrameNo: yup
      .string()
      .label('車台番号・フレームNo')
      .max(20)
      .half(),
    placeDocumentShippingDate: yup
      .string()
      .label('会場書類発送日')
      .max(10)
      .date(),
    validityDueDate: yup.string().label('有効期限日').max(10).date(),
    equipmentReceptionInfoList: yup.array().of(
      yup.object().shape({
        othersEquipmentItemName: yup.string().label('その他備品名称').max(20),
      })
    ),
    incompleteSupportList: yup.array().of(
      yup.object().shape({
        incompleteSupportDate: yup.string().label('日付').max(10).date(),
        incompleteSupportStaffName: yup.string().label('対応担当者').max(30),
      })
    ),
    docChangeDueDate: yup.string().label('名変期限日').max(10).date(),
    documentMemo: yup.string().label('メモ').max(1000),
  };

  const methods = useForm<ScrDoc0005DocumentBasics>({
    defaultValues: initialVal,
    context: allReadOnly,
    resolver: yupResolver(yup.object(documentBasicSchama)),
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
      const response: ScrDoc0005DocumentBasicsInfoResponse = pageParams
        ? (
            await ScrDoc0005ChangeHistoryCrossSectionInfo({
              changeHistoryNumber: documentBasicsNumber,
            })
          ).detailsCross_sectionInfo.basicsInfo
        : await ScrDoc0005DocumentBasicsInfo({
            documentBasicsNumber: documentBasicsNumber,
          });

      // 取得値を変換
      const addObj = {
        documentExistence:
          response.documentExistenceFlag === true ? '有' : '無',
        paymentExtensionTargeted:
          response.paymentExtensionTargetedFlag === true ? '対象' : '対象外',
        exhibitShopPaymentExtensionTargeted:
          response.exhibitShopPaymentExtensionTargeted === 'true'
            ? 'あり'
            : 'なし',
        exhibitShopMemberMemo:
          response.exhibitShopMemberMemo === 'true' ? 'あり' : 'なし',
        bidShopPaymentExtensionTargeted:
          response.bidShopPaymentExtensionTargeted === 'true' ? 'あり' : 'なし',
        bidShopMemberMemo:
          response.bidShopMemberMemo === 'true' ? 'あり' : 'なし',
        guarantee: response.guarantee === 'true' ? '有' : '無',
        manual: response.manual === 'true' ? '対象' : '対象外',
        record: response.record === 'true' ? 'あり' : 'なし',
        notebook: response.notebook === 'true' ? 'あり' : 'なし',
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
        arrivesStatus: response.documentExistenceFlag
          ? response.arrivesStatus
          : '',
        documentArrivesCompletionDate: response.documentExistenceFlag
          ? response.documentArrivesCompletionDate
          : '',
        documentSendingDueDate: response.documentExistenceFlag
          ? response.documentSendingDueDate
          : '',
        documentReportDueDate: response.documentExistenceFlag
          ? response.documentReportDueDate
          : '',
        omatomeDocumentShippingDestinationKind:
          response.documentShippingInstructionFlag ? '1' : '2',
      };
      // 基本情報タブ情報
      reset(Object.assign(addObj, response));

      // 必須書類受付情報リスト作成
      setRequiredDocumentReceptionInfoList(
        response.requiredDocumentReceptionInfoList
      );
      // 任意書類受付情報リスト作成
      setOptionalDocumentReceptionInfoList(
        response.optionalDocumentReceptionInfoList
      );
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
      const omatomeSelectValues: SelectValue[] = omatomeRes.list.map((val) => {
        return {
          value: val.codeValue,
          displayValue: val.codeName,
        };
      });
      setOmatomeSelectValues(omatomeSelectValues);

      // 不備対応ステータス
      const incompleteSupportRes = await ScrCom9999GetCodeManagementMaster({
        codeId: 'CDE-COM-0082',
      });
      const incompleteSupportSelectValues: SelectValue[] =
        incompleteSupportRes.list.map((val) => {
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
        codeId: [selectCode],
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
      showIncompleteSupportList.map((val) => {
        if (val.field === 'incompleteSupportStatus') {
          val.selectValues?.push(incompleteSupportSelectValues);
        } else if (val.field === 'incompleteAttributeKind') {
          val.selectValues?.push(selectSelectValues);
        }
      });

      // 読み取り専用かどうかを設定
      isReadOnly(getValues('cancelFlag'));
      mailAvailable(
        getValues('cancelFlag') || getValues('auctionKindName') === 'おまとめ'
      );
      printAvailable(getValues('cancelFlag'));
      outputAvailable(getValues('cancelFlag'));
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
        equipmentExistence: x.equipmentExistence,
        equipmentShippingSpecifySlipKindEquipmentShippingSlipNumber:
          x.equipmentShippingSpecifySlipKindEquipmentShippingSlipNumber,
      };
    });
  };

  const apiRef = useGridApiRef();

  const handleExportCsvClick = () => {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    exportCsv(
      `書類情報詳細_${user.employeeId}_${
        year + month + day + hours + minutes
      }.csv`,
      apiRef
    );
  };

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
      const newRequiredDocument = requiredDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setRequiredDocumentReceptionInfoList(newRequiredDocument);

      const newOptionalDocument = optionalDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setOptionalDocumentReceptionInfoList(newOptionalDocument);

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
      const newRequiredDocument = requiredDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setRequiredDocumentReceptionInfoList(newRequiredDocument);

      const newOptionalDocument = optionalDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setOptionalDocumentReceptionInfoList(newOptionalDocument);

      // おまとめ車両パターンが普通車検無(2)の場合。
    } else if (getValues('omatomeCarPatternKind') === '2') {
      const documentItemCode = ['101', '104', '107'];
      const newRequiredDocument = requiredDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setRequiredDocumentReceptionInfoList(newRequiredDocument);

      const newOptionalDocument = optionalDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setOptionalDocumentReceptionInfoList(newOptionalDocument);

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
      const newRequiredDocument = requiredDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setRequiredDocumentReceptionInfoList(newRequiredDocument);

      const newOptionalDocument = optionalDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setOptionalDocumentReceptionInfoList(newOptionalDocument);

      // おまとめ車両パターンが軽自動車検無(4)の場合。
    } else if (getValues('omatomeCarPatternKind') === '4') {
      const documentItemCode = ['101', '104', '107'];
      const newRequiredDocument = requiredDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setRequiredDocumentReceptionInfoList(newRequiredDocument);

      const newOptionalDocument = optionalDocumentReceptionInfoList.filter(
        (val) => documentItemCode.includes(val.documentItemCode)
      );
      setOptionalDocumentReceptionInfoList(newOptionalDocument);
    } else {
      setRequiredDocumentReceptionInfoList([]);
      setOptionalDocumentReceptionInfoList([]);
    }
  }, [
    getValues,
    requiredDocumentReceptionInfoList,
    optionalDocumentReceptionInfoList,
  ]);
  const navigate = useNavigate();
  const handlenavigate = (url: string) => {
    navigate(url, true);
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate(-1);
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
      changeExpectDate: user.taskDate,
    });
    // 登録内容確認ポップアップを開く
    setScrCom00032PopupIsOpen(true);
  };

  /**
   * セクション構造定義 TODO fieldsとnameの修正
   */
  const sectionDef = [
    {
      section: '車両情報',
      fields: ['carbodyNumberFrameNo', 'placeDocumentShippingDate'],
      name: ['車台番号・フレームNo', '会場書類発送日'],
    },
    {
      section: '書類受付情報',
      fields: ['validityDueDate'],
      name: ['有効期限日'],
    },
    {
      section: '不備対応情報セクション',
      fields: [
        'incompleteSupportDate',
        'incompleteSupportStatus',
        'incompleteSupportStaffName',
        'incompleteAttributeKind',
      ],
      name: ['日付', '対応ステータス', '対応担当者', '不備属性'],
    },
    {
      section: '名義変更情報',
      fields: ['docChangeDate'],
      name: ['名義変更日'],
    },

    {
      section: 'メモ',
      fields: ['documentMemo'],
      name: ['メモ'],
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

  // 登録時の値
  const basicVal = getValues();
  // fetchBasicInfo(basicVal);

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setScrCom00032PopupIsOpen(false);
    const values = {
      applicationEmployeeId: user.employeeId,
      registrationChangeMemo: registrationChangeMemo,
      screenId: 'SCR-DOC-0005',
      tabId: '1',
    };

    const registerBasicInfo = Object.assign(basicVal, values);
    const req: ScrDoc0005RegistrationDocumentBasicsInfoRequest = {
      basicsInfo: registerBasicInfo,
    };
    const res = await ScrDoc0005RegistrationDocumentBasicsInfo(req);
  };

  return (
    <>
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
                      <TextField
                        label='出品番号'
                        name='exhibitNumber'
                        readonly
                      />
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
                        disabled
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
                  {requiredDocumentReceptionInfoList.map((val, index) => (
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
                  ))}
                </Grid>
              </Stack>
              <TableDivider isBlack />
              <Stack spacing={1}>
                <CaptionLabel text='任意書類' />
                <Grid container spacing={2}>
                  {optionalDocumentReceptionInfoList.map((val, index) => (
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
                  ))}
                </Grid>
              </Stack>
            </Section>
            <Section name='備品受付情報' isDocDetail>
              <Stack spacing={1}>
                <CaptionLabel text='備品' />
                <Grid container spacing={2}>
                  {equipmentReceptionInfoList.map((val, index) => (
                    <Grid item xs={2} key={index}>
                      <Stack>
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
                      </Stack>
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
                        <TextField
                          label='到着ステータス'
                          name='arrivesStatus'
                          readonly
                        />
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
                          name='omatomeDocumentShippingDestinationKind'
                          required
                          radioValues={[
                            { value: '1', displayValue: 'オークネット' },
                            { value: '2', displayValue: '会員' },
                          ]}
                          disabled={
                            allReadOnly ||
                            getValues('documentShippingInstructionFlag') !==
                              false
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
                      apiRef={apiRef}
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
                  <DatePicker
                    label='名義変更日'
                    name='docChangeDate'
                    disabled={allReadOnly}
                  />
                  <TextField
                    label='（新登録）陸事コード'
                    name='newLandCode'
                    readonly
                  />
                  <TextField
                    label='出品店返金額'
                    name='exhibitShopCashBackAmount'
                    readonly
                  />
                </ColStack>
                <ColStack>
                  <TextField
                    label='名変処理日'
                    name='docChangeExecuteTimestamp'
                    readonly={allReadOnly}
                  />
                  <TextField
                    label='（新登録）登録番号'
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
                  <TextField
                    label='年額自動車税'
                    name='annualCarTax'
                    readonly
                  />
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
                  <PriceTextField
                    label='リサイクル料預託金'
                    name='recyclePriceDeposit'
                    readonly
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
    </>
  );
};

export default ScrDoc0005BasicTab;
