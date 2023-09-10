import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';
import ScrCom0033Popup, {
  ScrCom0033PopupModel,
} from 'pages/com/popups/ScrCom0033Popup';

import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { CaptionLabel } from 'controls/Label';
import { Radio } from 'controls/Radio';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';

import { ScrCom9999GetCodeManagementMaster } from 'apis/com/ScrCom9999Api';
import {
  ScrDoc0005CheckDocumentDetailsInfo,
  ScrDoc0005DocumentDetailsInfo,
  ScrDoc0005DocumentDetailsInfoResponse,
  ScrDoc0005RegistrationDocumentDetailsInfo,
  ScrDoc0005RegistrationDocumentDetailsInfoRequest,
} from 'apis/doc/ScrDoc0005Api';
import {
  ScrDoc9999GetLandCodeListbox,
  ScrDoc9999GetLandCodeListboxResponse,
} from 'apis/doc/ScrDoc9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

interface ScrDoc0005DocumentDetails
  extends ScrDoc0005DocumentDetailsInfoResponse {
  omatomeDocumentShippingStop: string;
  omatomeEquipmentShippingStop: string;
}
const initialVal: ScrDoc0005DocumentDetails = {
  omatomeDocumentShippingStop: '',
  omatomeEquipmentShippingStop: '',
  documentBasicsNumber: 0,
  auctionKindName: '',
  auctionKind: '',
  placeName: '',
  auctionCount: '',
  auctionSessionDate: '',
  exhibitNumber: '',
  purchaseDate: '',
  changeBeforeTimestamp: new Date(),
  carInspectionEraNameKind: '',
  carInspectionYear: '',
  oldLandCode: '',
  oldRegistrationNumber1: '',
  oldRegistrationNumber2: '',
  oldRegistrationNumber3: '',
  cartypeKind: '',
  annualCarTax: 0,
  depositCarTaxTotalAmount: 0,
  bikeDeposit: 0,
  recyclePriceDeposit: 0,
  documentAdvanceFlag: false,
  equipmentAdvanceFlag: false,
  receiptBeatExistenceFlag: false,
  directDeliveryBeatExistenceFlag: false,
  docChangeDemandFaxStopExistenceFlag: false,
  detailsInformationAcquisitionChargesExistenceFlag: false,
  defaultSlipKind: '',
  shippingAmount: 0,
  documentPenaltyExclusionFlag: false,
  documentPenaltyKind: '',
  documentPenaltyPrice: 0,
  documentDelayDays: '',
  documentSendingDueDate: '',
  earlyDocChangePenaltyExclusionFlag: false,
  earlyDocChangePenaltyKind: '',
  earlyDocChangePenaltyPrice: 0,
  earlyDocChangeDelayDays: '',
  docChangePenaltyExclusionFlag: false,
  docChangePenaltyKind: '',
  docChangePenaltyPrice: 0,
  docChangeDelayDays: '',
  docChangeDueDate: '',
  exhibitShopContractId: '',
  exhibitShopBusinessBaseName: '',
  exhibitShopBusinessBasePhoneNumber: '',
  exhibitShopAssignmentDocumentDestinationFaxNumber: '',
  exhibitShopBusinessBaseZipCode: '',
  exhibitShopAddress: '',
  exhibitShopSlipKind: '',
  exhibitShopDocumentShippingAddress: '',
  bidShopContractId: '',
  bidShopBusinessBaseName: '',
  bidShopBusinessBasePhoneNumber: '',
  bidShopAssignmentDocumentDestinationFaxNumber: '',
  bidShopBusinessBaseZipCode: '',
  bidShopAddress: '',
  bidShopSlipKind: '',
  bidShopDocumentShippingAddress: '',
  omatomeDocumentShippingStopFlag: false,
  omatomeEquipmentShippingStopFlag: false,
};

// ペナルティリスト
const showPenaltyList: GridColDef[] = [
  {
    field: 'penaltyExclusionFlag',
    headerName: '除外設定',
    cellType: 'checkbox',
    size: 'ss',
  },
  {
    field: 'penaltyKind',
    headerName: 'ペナルティ種別',
    size: 'm',
  },
  {
    field: 'penaltyPrice',
    headerName: 'ペナルティ金額',
    size: 'm',
  },
  {
    field: 'delayDays',
    headerName: '遅延日数',
    size: 'm',
  },
  {
    field: 'dueDate',
    headerName: '変更期限日',
    size: 'm',
  },
];

interface PenaltyListModel {
  /** ID */
  id: string;
  /** 除外設定*/
  penaltyExclusionFlag: boolean;
  /** ペナルティ種別*/
  penaltyKind: string;
  /** ペナルティ金額*/
  penaltyPrice: number;
  /** 遅延日数*/
  delayDays: string;
  /** 変更期限日	*/
  dueDate: string;
}

/**
 * SCR-DOC-0005 書類情報詳細画面詳細情報タブ
 */
interface ScrDoc0005DetailTabProps {
  documentBasicsNumber: number;
  allReadOnly: boolean;
}
const ScrDoc0005DetailTab = (props: ScrDoc0005DetailTabProps) => {
  const { documentBasicsNumber, allReadOnly } = props;
  // 陸事コード
  const [landcodes, setLandCodes] = useState<SelectValue[]>([]);
  // 書類・備品情報（書類）リスト
  const [penaltyList, setPenaltyList] = useState<PenaltyListModel[]>([]);
  // 元号
  const [eraNameSelectValues, setEraNameSelectValues] = useState<SelectValue[]>(
    []
  );
  // 四輪車区分
  const [fourWheelerSelectValues, setFourWheelerSelectValues] = useState<
    SelectValue[]
  >([]);
  // 伝票種類
  const [slipTypeSelectValues, setSlipTypeSelectValues] = useState<
    SelectValue[]
  >([]);

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

  // 登録内容申請ポップアップ
  const [scrCom00033PopupIsOpen, setScrCom00033PopupIsOpen] =
    useState<boolean>(false);
  /**
   * 登録内容申請ポップアップ初期データ
   */
  const scrCom0033PopupInitialValues: ScrCom0033PopupModel = {
    screenId: '',
    tabId: 0,
    applicationMoney: 0,
  };
  const [scrCom0033PopupData, setScrCom0033PopupData] =
    useState<ScrCom0033PopupModel>(scrCom0033PopupInitialValues);

  /**
   * バリデーションスキーマ
   */
  const detailsBasicSchama = {
    carInspectionEraNameKind: yup.string().label('車検日（元号）'),
    carInspectionYear: yup.string().label('車検日（年）'),
    oldRegistrationNumber1: yup.string().label('登録番号1').max(3),
    oldRegistrationNumber2: yup.string().label('登録番号2').max(1),
    oldRegistrationNumber3: yup.string().label('登録番号3').max(4),
    annualCarTax: yup.string().label('年額自動車税').max(7),
    depositCarTaxTotalAmount: yup.string().label('預かり自税総額').max(7),
    recyclePriceDeposit: yup.string().label('リサイクル料').max(7),
    shippingAmount: yup.string().label('配送金額').max(7),
    documentSendingDueDate: yup.string().label('書類送付期限日').max(10).date(),
    omatomeDocumentShippingStopFlag: yup
      .string()
      .label('書類発送止め')
      .required(),
    omatomeEquipmentShippingStopFlag: yup
      .string()
      .label('備品発送止め')
      .required(),
  };
  // 初期表示
  const methods = useForm<ScrDoc0005DocumentDetails>({
    defaultValues: initialVal,
    context: allReadOnly,
    resolver: yupResolver(yup.object(detailsBasicSchama)),
  });
  const {
    getValues,
    reset,
    trigger,
    formState: { dirtyFields },
  } = methods;

  useEffect(() => {
    const initialize = async () => {
      const response = await ScrDoc0005DocumentDetailsInfo({
        documentBasicsNumber: Number(documentBasicsNumber),
      });

      const addObj = {
        omatomeDocumentShippingStop:
          response.omatomeDocumentShippingStopFlag === true ? 'する' : 'しない',
        omatomeEquipmentShippingStop:
          response.omatomeEquipmentShippingStopFlag === true
            ? 'する'
            : 'しない',
      };
      reset(Object.assign(addObj, response));
      setPenaltyList([
        {
          id: response.documentPenaltyKind,
          penaltyExclusionFlag: response.documentPenaltyExclusionFlag,
          penaltyKind: response.documentPenaltyKind,
          penaltyPrice: response.documentPenaltyPrice,
          delayDays: response.documentDelayDays,
          dueDate: response.documentSendingDueDate,
        },
        {
          id: response.earlyDocChangePenaltyKind,
          penaltyExclusionFlag: response.earlyDocChangePenaltyExclusionFlag,
          penaltyKind: response.earlyDocChangePenaltyKind,
          penaltyPrice: response.earlyDocChangePenaltyPrice,
          delayDays: response.earlyDocChangeDelayDays,
          dueDate: '',
        },
        {
          id: response.docChangePenaltyKind,
          penaltyExclusionFlag: response.docChangePenaltyExclusionFlag,
          penaltyKind: response.docChangePenaltyKind,
          penaltyPrice: response.docChangePenaltyPrice,
          delayDays: response.docChangeDelayDays,
          dueDate: response.docChangeDueDate,
        },
      ]);
      // 元号
      const eraNameRes = await ScrCom9999GetCodeManagementMaster({
        codeId: 'CDE-COM-0074',
      });
      const eraNameSelectValues: SelectValue[] =
        eraNameRes.searchGetCodeManagementMasterListbox.map((val) => {
          return {
            value: val.codeValue,
            displayValue: val.codeName,
          };
        });
      setEraNameSelectValues(eraNameSelectValues);

      // 四輪車区分
      const fourWheelerRes = await ScrCom9999GetCodeManagementMaster({
        codeId: 'CDE-COM-0074',
      });
      const fourWheelerSelectValues: SelectValue[] =
        fourWheelerRes.searchGetCodeManagementMasterListbox.map((val) => {
          return {
            value: val.codeValue,
            displayValue: val.codeName,
          };
        });
      setFourWheelerSelectValues(fourWheelerSelectValues);

      // 伝票種類
      const slipTypeRes = await ScrCom9999GetCodeManagementMaster({
        codeId: 'CDE-COM-0024',
      });
      const slipTypeSelectValues: SelectValue[] =
        slipTypeRes.searchGetCodeManagementMasterListbox.map((val) => {
          return {
            value: val.codeValue,
            displayValue: val.codeName,
          };
        });
      setSlipTypeSelectValues(slipTypeSelectValues);

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
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const onClickConfirm = async () => {
    trigger();
    const res = await ScrDoc0005CheckDocumentDetailsInfo({
      documentBasicsNumber: documentBasicsNumber,
    });
    console.log('入力', res);
    // 登録内容確認ポップアップに渡すデータをセット
    setScrCom0032PopupData({
      errorList: res.errorList,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-DOC-0005',
          screenName: '書類情報詳細',
          tabId: 2,
          tabName: '詳細情報',
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
      fields: [
        'carInspectionEraNameKind',
        'carInspectionYear',
        'oldLandCode',
        'oldRegistrationNumber1',
        'oldRegistrationNumber2',
        'oldRegistrationNumber3',
        'cartypeKind',
        'annualCarTax',
        'depositCarTaxTotalAmount',
        'recyclePriceDeposit',
        'documentAdvanceFlag',
        'equipmentAdvanceFlag',
        'receiptBeatExistenceFlag',
        'directDeliveryBeatExistenceFlag',
        'docChangeDemandFaxStopExistenceFlag',
        'detailsInformationAcquisitionChargesExistenceFlag',
        'defaultSlipKind',
        'shippingAmount',
        'documentPenaltyExclusionFlag',
        'documentSendingDueDate',
        'docChangePenaltyExclusionFlag',
        'omatomeDocumentShippingStopFlag',
        'omatomeEquipmentShippingStopFlag',
      ],
      name: [
        '車検日（元号）',
        '車検日（年）',
        '陸事コード',
        '登録番号1',
        '登録番号2',
        '登録番号3',
        '四輪車種区分',
        '年額自動車税',
        '預かり自税総額',
        'リサイクル料',
        '書類先出し',
        '備品先出し',
        '入金のみ打ち',
        '直接打ち',
        '名変督促FAX停止',
        '詳細情報取得課金',
        '伝票種類',
        '配送金額',
        '除外設定',
        '変更期限日',
        '書類発送止め',
        '備品発送止め',
      ],
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
  const [registrationChangeMemo, setRegistrationChangeMemo] =
    useState<string>('');
  const scrCom00032PopupHandleConfirm = (registrationChangeMemo: string) => {
    setScrCom00032PopupIsOpen(false);
    setRegistrationChangeMemo(registrationChangeMemo);

    // 登録内容申請ポップアップを呼出
    setScrCom00033PopupIsOpen(true);
    setScrCom0033PopupData({
      screenId: 'SCR-DOC-0005',
      tabId: 2,
      applicationMoney: 0,
    });
  };

  /**
   * 登録内容申請ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const scrCom00033PopupHandleConfirm = async (
    employeeId1: string,
    employeeMailAddress1: string,
    employeeId2?: string,
    employeeId3?: string,
    employeeId4?: string,
    applicationComment?: string
  ) => {
    setScrCom00033PopupIsOpen(false);
    const values = {
      registrationChangeMemo: registrationChangeMemo,
      firstApproverId: employeeId1,
      firstApproverMailAddress: employeeMailAddress1,
      secondApproverId: employeeId2 ? employeeId2 : '',
      thirdApproverId: employeeId3 ? employeeId3 : '',
      fourthApproverId: employeeId4 ? employeeId4 : '',
      applicationComment: applicationComment ? applicationComment : '',
      applicationEmployeeId: '',
      screenId: 'SCR-DOC-0005',
      tabId: '2',
    };

    const req: ScrDoc0005RegistrationDocumentDetailsInfoRequest = {
      documentDetailsInfo: Object.assign(getValues(), values),
    };
    const res = await ScrDoc0005RegistrationDocumentDetailsInfo(req);
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
                    </ColStack>
                    <ColStack spacing={2.4}>
                      <TextField
                        label='会場（おまとめ）'
                        name='placeName'
                        readonly
                      />
                      <TextField
                        label='オークション開催日'
                        name='auctionSessionDate'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                </Section>
              </Grid>
              <Grid item xs={8}>
                <Section name='基本情報編集' isDocDetail>
                  <RowStack spacing={7}>
                    <ColStack spacing={2.4}>
                      <Stack width={225}>
                        <Select
                          label='車検日（元号）'
                          name='carInspectionEraNameKind'
                          selectValues={eraNameSelectValues}
                          disabled={allReadOnly}
                        />
                        <Select
                          label='車検日（年）'
                          name='carInspectionYear'
                          selectValues={[]}
                          disabled={allReadOnly}
                        />
                      </Stack>
                      <TextField
                        label='年額自動車税'
                        name='annualCarTax'
                        readonly={
                          allReadOnly || getValues('auctionKindName') !== '四輪'
                        }
                      />
                    </ColStack>
                    <ColStack spacing={2.4}>
                      <Select
                        label='陸事コード'
                        name='oldLandCode'
                        selectValues={landcodes}
                        disabled={
                          allReadOnly ||
                          getValues('auctionKindName') === 'おまとめ'
                        }
                      />
                      <TextField
                        label='預り自税総額'
                        name='depositCarTaxTotalAmount'
                        readonly={
                          allReadOnly || getValues('auctionKindName') !== '四輪'
                        }
                      />
                    </ColStack>
                    <ColStack spacing={2.4}>
                      <TextField
                        label='登録番号1'
                        name='oldRegistrationNumber1'
                        readonly={allReadOnly}
                      />
                      <TextField
                        label='登録番号2'
                        name='oldRegistrationNumber2'
                        readonly={allReadOnly}
                      />
                      <TextField
                        label='登録番号3'
                        name='oldRegistrationNumber3'
                        readonly={allReadOnly}
                      />
                      <TextField
                        label='リサイクル料'
                        name='recyclePriceDeposit'
                        readonly={
                          allReadOnly || getValues('auctionKindName') !== '四輪'
                        }
                      />
                    </ColStack>
                    <ColStack spacing={2.4}>
                      <Select
                        label='四輪車種区分'
                        name='cartypeKind'
                        selectValues={fourWheelerSelectValues}
                        disabled={
                          allReadOnly || getValues('auctionKindName') !== '四輪'
                        }
                      />
                      <TextField
                        label='預かり金（二輪）'
                        name='bikeDeposit'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                </Section>
              </Grid>
            </Grid>
            <Section name='先出し情報' isDocDetail>
              <CaptionLabel text='先出し情報' />
              <RowStack spacing={7}>
                <ColStack spacing={2.4}>
                  <Checkbox
                    label='書類先出し'
                    name='documentAdvanceFlag'
                    disabled={
                      allReadOnly || getValues('auctionKindName') !== '四輪'
                    }
                  ></Checkbox>
                </ColStack>
                <ColStack spacing={2.4}>
                  <Checkbox
                    label='備品先出し'
                    name='equipmentAdvanceFlag'
                    disabled={
                      allReadOnly || getValues('auctionKindName') !== '四輪'
                    }
                  ></Checkbox>
                </ColStack>
              </RowStack>
            </Section>
            <Section name='有無フラグ情報' isDocDetail>
              <CaptionLabel text='有無フラグ' />
              <RowStack spacing={7}>
                <ColStack spacing={2.4}>
                  <Checkbox
                    label='入金のみ打ち'
                    name='receiptBeatExistenceFlag'
                    disabled={
                      allReadOnly || !getValues('receiptBeatExistenceFlag')
                    }
                  ></Checkbox>
                </ColStack>
                <ColStack spacing={2.4}>
                  <Checkbox
                    label='直送打ち'
                    name='directDeliveryBeatExistenceFlag'
                    disabled={
                      allReadOnly ||
                      !getValues('directDeliveryBeatExistenceFlag')
                    }
                  ></Checkbox>
                </ColStack>
                <ColStack spacing={2.4}>
                  <Checkbox
                    label='名変督促FAX停止'
                    name='docChangeDemandFaxStopExistenceFlag'
                    disabled={
                      allReadOnly ||
                      !getValues('docChangeDemandFaxStopExistenceFlag')
                    }
                  ></Checkbox>
                </ColStack>
                <ColStack spacing={2.4}>
                  <Checkbox
                    label='詳細情報取得課金'
                    name='detailsInformationAcquisitionChargesExistenceFlag'
                    disabled={
                      allReadOnly ||
                      !getValues(
                        'detailsInformationAcquisitionChargesExistenceFlag'
                      )
                    }
                  ></Checkbox>
                </ColStack>
              </RowStack>
            </Section>
            <Section name='発送伝票情報' isDocDetail>
              <RowStack spacing={7}>
                <ColStack spacing={2.4}>
                  <Select
                    label='伝票種類'
                    name='defaultSlipKind'
                    selectValues={slipTypeSelectValues}
                    disabled={allReadOnly}
                  ></Select>
                </ColStack>
                <ColStack spacing={2.4}>
                  <TextField
                    label='配送金額'
                    name='shippingAmount'
                    readonly={allReadOnly}
                  ></TextField>
                </ColStack>
              </RowStack>
            </Section>
            <Section name='ペナルティ情報' isDocDetail>
              <DataGrid
                columns={showPenaltyList}
                rows={penaltyList}
                getRowId={(row) => row.id + row.penaltyKind}
                disabled={allReadOnly}
              />
            </Section>
            <Section name='出品店・落札店詳細情報' isDocDetail>
              <Stack spacing={2.4}>
                <Stack spacing={1}>
                  <CaptionLabel text='出品店情報' />
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='契約ID'
                        name='exhibitShopContractId'
                        readonly
                      />
                      <TextField
                        label='郵便番号'
                        name='exhibitShopBusinessBaseZipCode'
                        readonly
                      />
                      <TextField
                        label='書類伝票種類'
                        name='exhibitShopSlipKind'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='事業所店名'
                        name='exhibitShopBusinessBaseName'
                        readonly
                      />
                      <TextField
                        label='住所'
                        name='exhibitShopAddress'
                        readonly
                        size='m'
                      />
                      <TextField
                        label='書類発送住所'
                        name='exhibitShopDocumentShippingAddress'
                        readonly
                        size='m'
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='電話番号'
                        name='exhibitShopBusinessBasePhoneNumber'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='FAX番号'
                        name='exhibitShopAssignmentDocumentDestinationFaxNumber'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                </Stack>
                <Stack spacing={1}>
                  <CaptionLabel text='落札店情報' />
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='契約ID'
                        name='bidShopContractId'
                        readonly
                      />
                      <TextField
                        label='郵便番号'
                        name='bidShopBusinessBaseZipCode'
                        readonly
                      />
                      <TextField
                        label='書類伝票種類'
                        name='bidShopSlipKind'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='事業所店名'
                        name='exhibitShopBusinessBaseName'
                        readonly
                      />
                      <TextField
                        label='住所'
                        name='bidShopAddress'
                        readonly
                        size='m'
                      />
                      <TextField
                        label='書類発送住所'
                        name='bidShopDocumentShippingAddress'
                        readonly
                        size='m'
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='電話番号'
                        name='bidShopBusinessBasePhoneNumber'
                        readonly
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='FAX番号'
                        name='bidShopAssignmentDocumentDestinationFaxNumber'
                        readonly
                      />
                    </ColStack>
                  </RowStack>
                </Stack>
              </Stack>
            </Section>
            <Section name='発送止め情報（おまとめ）' isDocDetail>
              <RowStack>
                <ColStack>
                  <Radio
                    label='書類発送止め'
                    name='omatomeDocumentShippingStopFlag'
                    required
                    radioValues={[
                      { value: false, displayValue: 'する' },
                      { value: true, displayValue: 'しない' },
                    ]}
                    disabled={allReadOnly}
                  />
                </ColStack>
                <ColStack>
                  <Radio
                    label='備品発送止め'
                    name='omatomeEquipmentShippingStopFlag'
                    required
                    radioValues={[
                      { value: false, displayValue: 'する' },
                      { value: true, displayValue: 'しない' },
                    ]}
                    disabled={allReadOnly}
                  />
                </ColStack>
              </RowStack>
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
          handleRegistConfirm={scrCom00032PopupHandleConfirm}
          handleApprovalConfirm={scrCom00032PopupHandleConfirm}
        />
      )}

      {/* 登録内容申請ポップアップ */}
      {scrCom00033PopupIsOpen && (
        <ScrCom0033Popup
          isOpen={scrCom00033PopupIsOpen}
          data={scrCom0033PopupData}
          handleCancel={() => {
            setScrCom00033PopupIsOpen(false);
          }}
          handleConfirm={scrCom00033PopupHandleConfirm}
        />
      )}
    </>
  );
};

export default ScrDoc0005DetailTab;
