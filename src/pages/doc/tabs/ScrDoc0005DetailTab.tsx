import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

import { Checkbox } from 'controls/Checkbox';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { CaptionLabel } from 'controls/Label';
import { Radio } from 'controls/Radio';
import { Select } from 'controls/Select';
import { TextField } from 'controls/TextField';

import {
  ScrDoc0005DocumentDetailsInfo,
  ScrDoc0005DocumentDetailsInfoResponse,
} from 'apis/doc/ScrDoc0005Api';

import { useForm } from 'hooks/useForm';

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

  // 書類・備品情報（書類）リスト
  const [penaltyList, setPenaltyList] = useState<PenaltyListModel[]>([]);

  // 初期表示
  const [prevValues, setPrevValues] =
    useState<ScrDoc0005DocumentDetails>(initialVal);
  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialize = async () => {
    const response = await ScrDoc0005DocumentDetailsInfo({
      documentBasicsNumber: Number(documentBasicsNumber),
    });
    const addObj = {
      omatomeDocumentShippingStop:
        response.omatomeDocumentShippingStopFlag === true ? 'する' : 'しない',
      omatomeEquipmentShippingStop:
        response.omatomeEquipmentShippingStopFlag === true ? 'する' : 'しない',
    };
    setPrevValues(Object.assign(addObj, response));
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
  };

  const methods = useForm<ScrDoc0005DocumentDetails>({
    defaultValues: prevValues,
    context: allReadOnly,
    resolver: yupResolver(yup.object()),
  });

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
                        selectValues={[]}
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
                      readonly
                    />
                  </ColStack>
                  <ColStack spacing={2.4}>
                    <Select
                      label='陸事コード'
                      name='oldLandCode'
                      selectValues={[]}
                      disabled={allReadOnly}
                    />
                    <TextField
                      label='預り自税総額'
                      name='depositCarTaxTotalAmount'
                      readonly
                    />
                  </ColStack>
                  <ColStack spacing={2.4}>
                    <TextField
                      label='登録番号1'
                      name='registrationNumber1'
                      readonly
                    />
                    <TextField
                      label='リサイクル料'
                      name='recyclePriceDeposit'
                      readonly
                    />
                  </ColStack>
                  <ColStack spacing={2.4}>
                    <Select
                      label='四輪車種区分'
                      name='cartypeKind'
                      selectValues={[]}
                      disabled={allReadOnly}
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
                ></Checkbox>
              </ColStack>
              <ColStack spacing={2.4}>
                <Checkbox
                  label='備品先出し'
                  name='equipmentAdvanceFlag'
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
                ></Checkbox>
              </ColStack>
              <ColStack spacing={2.4}>
                <Checkbox
                  label='直送打ち'
                  name='directDeliveryBeatExistenceFlag'
                ></Checkbox>
              </ColStack>
              <ColStack spacing={2.4}>
                <Checkbox
                  label='名変督促FAX停止'
                  name='docChangeDemandFaxStopExistenceFlag'
                ></Checkbox>
              </ColStack>
              <ColStack spacing={2.4}>
                <Checkbox
                  label='詳細情報取得課金'
                  name='detailsInformationAcquisitionChargesExistenceFlag'
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
                  selectValues={[]}
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
            <DataGrid columns={showPenaltyList} rows={penaltyList} />
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
                  column={true}
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
                  column={true}
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
    </MainLayout>
  );
};

export default ScrDoc0005DetailTab;
