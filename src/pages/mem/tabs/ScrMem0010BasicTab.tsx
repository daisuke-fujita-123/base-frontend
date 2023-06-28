import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton, Button, CancelButton, ConfirmButton, PrimaryButton, SearchButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { ContentsDivider } from 'controls/Divider';
import { Select, SelectValue } from 'controls/Select';
import { PostalTextField, PriceTextField, TextField } from 'controls/TextField';
import { SerchLabelText, Typography } from 'controls/Typography';

import { ScrMem0010GetBusinessbase, ScrMem0010GetBusinessbaseRequest, ScrMem0010GetBusinessbaseResponse, ScrMem0010GetContract, ScrMem0010GetContractRequest, ScrMem0010GetContractResponse, ScrMem0010GetEmployee, ScrMem0010GetEmployeeRequest, ScrMem0010GetEmployeeResponse, ScrMem0010GetMember, ScrMem0010GetMemberRequest, ScrMem0010GetMemberResponse, ScrMem0010InputCheckBusinessBase, ScrMem0010InputCheckBusinessBaseRequest, ScrMem0010InputCheckBusinessBaseResponse, ScrMem0010RegistrationBusinessBase, ScrMem0010RegistrationBusinessBaseResponse, errorResult } from 'apis/mem/ScrMem0010Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { memApiClient, comApiClient } from 'providers/ApiClient';

import { generate } from 'utils/validation/BaseYup';
import { Checkbox } from 'controls/CheckBox';
import { Link } from 'controls/Link';
import { RightElementStack, Stack } from 'layouts/Stack';
import { TableRowModel } from 'controls/Table';
import { InputLayout } from 'layouts/InputLayout';
import { Textarea } from 'controls/Textarea';
import { Dialog } from 'controls/Dialog';
import { useParams, useSearchParams } from 'react-router-dom';

import ScrCom0032Popup, {
  ColumnListModel,
  ScrCom0032PopupModel, SectionListModel, errorMessagesModel,
} from 'pages/com/popups/ScrCom0032';
import { WarningLabel } from 'controls/Label';
import { AppContext } from 'providers/AppContextProvider';

/**
 * 登録内容確認ポップアップのProps
 */
interface ScrMem0003PopupProps {
  isOpen: boolean;
  data: ScrCom0032PopupModel;
  handleCancel: () => void;
  handleConfirm: () => void;
}

/**
 * 法人基本情報データモデル
 */
interface CorporationBasicModel {
  // 法人ID
  corporationId: string;
  // 法人名称
  corporationName: string;
  // 法人郵便番号
  corporationZipCode: string;
  // 法人都道府県コード 
  corporationPrefectureCode: string;
  // 法人市区町村
  corporationMunicipalities: string;
  // 法人番地号建物名
  corporationAddressBuildingName: string;
  // 住所
  corporationAddress: string;
  // 法人電話番号
  corporationPhoneNumber: string;
  // 法人FAX番号
  corporationFaxNumber: string;
  // 会員メモ
  memberMemo: string;
  // 事業拠点法人情報同期フラグ
  businessBaseCorporationInformationSynchronizationFlag: boolean;
  // 事業拠点ID
  businessBaseId: string;
  // 事業拠点名称
  businessBaseName: string;
  // 事業拠点名称カナ
  businessBaseNameKana: string;
  // 事業拠点郵便番号
  businessBaseZipCode: string;
  // 事業拠点都道府県コード
  businessBasePrefectureCode: string;
  // 事業拠点市区町村
  businessBaseMunicipalities: string;
  // 事業拠点番地号建物名
  businessBaseAddressBuildingName: string;
  // 事業拠点電話番号
  businessBasePhoneNumber: string;
  // 事業拠点担当者氏名
  businessBaseStaffName: string;
  // 事業拠点担当者連絡先電話番号
  businessBaseStaffContactPhoneNumber: string;
  // 四輪営業担当
  tvaaSalesStaff: string;
  // 二輪営業担当
  bikeSalesStaff: string;

  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeHistoryDate: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  tvaaSalesStaffSelectValues: SelectValue[];
  bikeSalesStaffSelectValues: SelectValue[];
  prefectureCodeSelectValues: SelectValue[];
}

/**
 * APIリクエストから法人基本情報データモデルへの変換
 */
const convertToCorporationBasicModel = (
  scrMem0010GetMemberResponse: ScrMem0010GetMemberResponse,
  scrMem0010GetBusinessbaseResponse: ScrMem0010GetBusinessbaseResponse
): CorporationBasicModel => {
  return{
    // 法人ID
    corporationId: scrMem0010GetMemberResponse.corporationId,
    // 法人名称
    corporationName: scrMem0010GetMemberResponse.corporationName,
    // 法人郵便番号
    corporationZipCode: scrMem0010GetMemberResponse.corporationZipCode,
    // 法人都道府県コード 
    corporationPrefectureCode: scrMem0010GetMemberResponse.corporationPrefectureCode,
    // 法人市区町村
    corporationMunicipalities: scrMem0010GetMemberResponse.corporationMunicipalities,
    // 法人番地号建物名
    corporationAddressBuildingName: scrMem0010GetMemberResponse.corporationAddressBuildingName,
    // 住所
    corporationAddress: scrMem0010GetMemberResponse.corporationAddress,
    // 法人電話番号
    corporationPhoneNumber: scrMem0010GetMemberResponse.corporationPhoneNumber,
    // 法人FAX番号
    corporationFaxNumber: scrMem0010GetMemberResponse.corporationFaxNumber,
    // 会員メモ
    memberMemo: scrMem0010GetMemberResponse.memberMemo,
    // 事業拠点法人情報同期フラグ
    businessBaseCorporationInformationSynchronizationFlag: scrMem0010GetBusinessbaseResponse.businessBaseCorporationInformationSynchronizationFlag,
    // 事業拠点ID
    businessBaseId: scrMem0010GetBusinessbaseResponse.businessBaseId,
    // 事業拠点名称
    businessBaseName: scrMem0010GetBusinessbaseResponse.businessBaseName,
    // 事業拠点名称カナ
    businessBaseNameKana: scrMem0010GetBusinessbaseResponse.businessBaseNameKana,
    // 事業拠点郵便番号
    businessBaseZipCode: scrMem0010GetBusinessbaseResponse.businessBaseZipCode,
    // 事業拠点都道府県コード
    businessBasePrefectureCode: scrMem0010GetBusinessbaseResponse.businessBasePrefectureCode,
    // 事業拠点市区町村
    businessBaseMunicipalities: scrMem0010GetBusinessbaseResponse.businessBaseMunicipalities,
    // 事業拠点番地号建物名
    businessBaseAddressBuildingName: scrMem0010GetBusinessbaseResponse.businessBaseAddressBuildingName,
    // 事業拠点電話番号
    businessBasePhoneNumber: scrMem0010GetBusinessbaseResponse.businessBasePhoneNumber,
    // 事業拠点担当者氏名
    businessBaseStaffName: scrMem0010GetBusinessbaseResponse.businessBaseStaffName,
    // 事業拠点担当者連絡先電話番号
    businessBaseStaffContactPhoneNumber: scrMem0010GetBusinessbaseResponse.businessBaseStaffContactPhoneNumber,
    // 四輪営業担当
    tvaaSalesStaff: scrMem0010GetBusinessbaseResponse.tvaaSalesStaff,
    // 二輪営業担当
    bikeSalesStaff: scrMem0010GetBusinessbaseResponse.bikeSalesStaff,

    // 変更履歴番号
    changeHistoryNumber:  '',
    // 変更予定日
    changeHistoryDate:  '',
  }
}

/**
 * APIリクエストから法人基本情報データモデルへの変換
 */
const convertToBusinessBaseModel = (
  corporationBasic:CorporationBasicModel,
  scrMem0010GetBusinessbaseResponse: ScrMem0010GetBusinessbaseResponse
): CorporationBasicModel => {
  return{
    // 法人ID
    corporationId: corporationBasic.corporationId,
    // 法人名称
    corporationName: corporationBasic.corporationName,
    // 法人郵便番号
    corporationZipCode: corporationBasic.corporationZipCode,
    // 法人都道府県コード 
    corporationPrefectureCode: corporationBasic.corporationPrefectureCode,
    // 法人市区町村
    corporationMunicipalities: corporationBasic.corporationMunicipalities,
    // 法人番地号建物名
    corporationAddressBuildingName: corporationBasic.corporationAddressBuildingName,
    // 住所
    corporationAddress: corporationBasic.corporationAddress,
    // 法人電話番号
    corporationPhoneNumber: corporationBasic.corporationPhoneNumber,
    // 法人FAX番号
    corporationFaxNumber: corporationBasic.corporationFaxNumber,
    // 会員メモ
    memberMemo: corporationBasic.memberMemo,
    // 事業拠点法人情報同期フラグ
    businessBaseCorporationInformationSynchronizationFlag: scrMem0010GetBusinessbaseResponse.businessBaseCorporationInformationSynchronizationFlag,
    // 事業拠点ID
    businessBaseId: scrMem0010GetBusinessbaseResponse.businessBaseId,
    // 事業拠点名称
    businessBaseName: scrMem0010GetBusinessbaseResponse.businessBaseName,
    // 事業拠点名称カナ
    businessBaseNameKana: scrMem0010GetBusinessbaseResponse.businessBaseNameKana,
    // 事業拠点郵便番号
    businessBaseZipCode: scrMem0010GetBusinessbaseResponse.businessBaseZipCode,
    // 事業拠点都道府県コード
    businessBasePrefectureCode: scrMem0010GetBusinessbaseResponse.businessBasePrefectureCode,
    // 事業拠点市区町村
    businessBaseMunicipalities: scrMem0010GetBusinessbaseResponse.businessBaseMunicipalities,
    // 事業拠点番地号建物名
    businessBaseAddressBuildingName: scrMem0010GetBusinessbaseResponse.businessBaseAddressBuildingName,
    // 事業拠点電話番号
    businessBasePhoneNumber: scrMem0010GetBusinessbaseResponse.businessBasePhoneNumber,
    // 事業拠点担当者氏名
    businessBaseStaffName: scrMem0010GetBusinessbaseResponse.businessBaseStaffName,
    // 事業拠点担当者連絡先電話番号
    businessBaseStaffContactPhoneNumber: scrMem0010GetBusinessbaseResponse.businessBaseStaffContactPhoneNumber,
    // 四輪営業担当
    tvaaSalesStaff: scrMem0010GetBusinessbaseResponse.tvaaSalesStaff,
    // 二輪営業担当
    bikeSalesStaff: scrMem0010GetBusinessbaseResponse.bikeSalesStaff,

    // 変更履歴番号
    changeHistoryNumber:  '',
    // 変更予定日
    changeHistoryDate:  '',
  }
}

/**
 * 事業拠点契約コース・サービス一覧取得レスポンスからプルダウンデータモデルへの変換
 */
const salesStaffSelectValuesModel = (
  response: ScrMem0010GetEmployeeResponse
): SelectValuesModel =>{
  return {
    tvaaSalesStaffSelectValues: response.tvaaContractInfo.map((x) => {
      return {
        value: x.salesId,
        displayValue: x.salesId + '　'+ x.salesName
      }
    }),
    bikeSalesStaffSelectValues: response.bikeContractInfo.map((x) =>{
      return {
        value: x.salesId,
        displayValue: x.salesId + '　'+ x.salesName
      }
    }),
    prefectureCodeSelectValues: []
  }
}

/**
 * 法人基本情報初期データ
 */
const initialValues: CorporationBasicModel = {
  // 法人ID
  corporationId: '',
  // 法人名称
  corporationName: '',
  // 法人郵便番号
  corporationZipCode: '',
  // 法人都道府県コード 
  corporationPrefectureCode: '',
  // 法人市区町村
  corporationMunicipalities: '',
  // 法人番地号建物名
  corporationAddressBuildingName: '',
  // 住所
  corporationAddress: '',
  // 法人電話番号
  corporationPhoneNumber: '',
  // 法人FAX番号
  corporationFaxNumber: '',
  // 会員メモ
  memberMemo: '',
  // 事業拠点法人情報同期フラグ
  businessBaseCorporationInformationSynchronizationFlag: false,
  // 事業拠点ID
  businessBaseId: '',
  // 事業拠点名称
  businessBaseName: '',
  // 事業拠点名称カナ
  businessBaseNameKana: '',
  // 事業拠点郵便番号
  businessBaseZipCode: '',
  // 事業拠点都道府県コード
  businessBasePrefectureCode: '',
  // 事業拠点市区町村
  businessBaseMunicipalities: '',
  // 事業拠点番地号建物名
  businessBaseAddressBuildingName: '',
  // 事業拠点電話番号
  businessBasePhoneNumber: '',
  // 事業拠点担当者氏名
  businessBaseStaffName: '',
  // 事業拠点担当者連絡先電話番号
  businessBaseStaffContactPhoneNumber: '',
  // 四輪営業担当
  tvaaSalesStaff: '',
  // 二輪営業担当
  bikeSalesStaff: '',
  
  // 変更履歴番号
  changeHistoryNumber:  '',
  // 変更予定日
  changeHistoryDate:  '',
};

/**
 * 事業拠点基本情報初期データ
 */
const BusinessbaseInitialValues: ScrMem0010GetBusinessbaseResponse = {
  // 事業拠点法人情報同期フラグ
  businessBaseCorporationInformationSynchronizationFlag: false,
  // 事業拠点ID
  businessBaseId: '',
  // 事業拠点名称
  businessBaseName: '',
  // 事業拠点名称カナ
  businessBaseNameKana: '',
  // 事業拠点郵便番号
  businessBaseZipCode: '',
  // 事業拠点都道府県コード
  businessBasePrefectureCode: '',
  // 事業拠点市区町村
  businessBaseMunicipalities: '',
  // 事業拠点番地号建物名
  businessBaseAddressBuildingName: '',
  // 事業拠点電話番号
  businessBasePhoneNumber: '',
  // 事業拠点担当者氏名
  businessBaseStaffName: '',
  // 事業拠点担当者連絡先電話番号
  businessBaseStaffContactPhoneNumber: '',
  // 四輪営業担当
  tvaaSalesStaff: '',
  // 二輪営業担当
  bikeSalesStaff: '',
};

/**
 * 検索条件初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  tvaaSalesStaffSelectValues: [],
  bikeSalesStaffSelectValues: [],
  prefectureCodeSelectValues: [],
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorMessages: [{
    errorCode: '',
    errorMessage: ''
  }],
  warningMessages: [{
    errorCode: '',
    errorMessage: '',
  }],
  contentsList: {
    screenName:  '',
    screenId:  '',
    tabName:  '',
    tabId:  '',
    sectionList: [
      {
        sectionName:  '',
        columnList: [
          {
            columnName: '',
          }
        ]
      }
    ]
  },
  changeExpectDate: new Date()
};

/**
 * 四輪、二輪契約情報初期データ
 */
const scrMem0010GetContractValues: ScrMem0010GetContractResponse = {
  tvaaLimit: 0,
  tvaaOffset: 0,
  tvaaCount: 0,
  bikeLimit: 0,
  bikeOffset: 0,
  bikeCount: 0,
  list1: [],
  list2: []
};

/**
 * バリデーションスキーマ
 */
const validationSchama = generate([
  'businessBaseName',
  'businessBaseNameKana',
  'businessBaseZipCode',
  'businessBasePrefectureCode',
  'businessBaseMunicipalities',
  'businessBaseAddressBuildingName',
  'businessBasePhoneNumber',
  'businessBaseStaffName',
  'businessBaseStaffContactPhoneNumber',
  'tvaaSalesStaff',
  'bikeSalesStaff',
]);

/**
 * セクション構造定義
 */
const sectionDef = [
  {
    section: '事業拠点情報',
    fields: [
      'businessBaseCorporationInformationSynchronizationFlag',
      'businessBaseName',
      'businessBaseNameKana',
      'businessBaseZipCode',
      'businessBasePrefectureCode',
      'businessBaseMunicipalities',
      'businessBaseAddressBuildingName',
      'businessBasePhoneNumber',
      'businessBaseStaffName',
      'businessBaseStaffContactPhoneNumber',
      'tvaaSalesStaff',
      'bikeSalesStaff',
    ],
    name: [
      '事業拠点法人情報同期フラグ',
      '事業拠点名称',
      '事業拠点名称カナ',
      '事業拠点郵便番号',
      '事業拠点都道府県コード',
      '事業拠点市区町村',
      '事業拠点番地号建物名',
      '事業拠点電話番号',
      '事業拠点担当者氏名',
      '事業拠点担当者連絡先電話番号',
      '四輪営業担当',
      '二輪営業担当',
    ]
  }
];

/**
 * 変更した項目から登録・変更内容データへの変換
 */
const convertToSectionList = (dirtyFields: object): SectionListModel[] => {
  const fields = Object.keys(dirtyFields);
  const sectionList: SectionListModel[] = [];
  const columnList: ColumnListModel[] = [];
  sectionDef.forEach((d) => {
    fields.forEach((f) => {
      if(d.fields.includes(f)){
        columnList.push({columnName: d.name[d.fields.indexOf(f)]})
      }
    })
    sectionList.push({
      sectionName: d.section,
      columnList: columnList
    })
  })
  return sectionList;
};

/**
 * 検索条件モデルから法人情報検索APIリクエストへの変換
 */
const convertFromCorporationBasicModel = (
  corporationBasic: CorporationBasicModel,
  contractList: ScrMem0010GetContractResponse,
  user: string
): ScrMem0010RegistrationBusinessBaseResponse => {
  return {
    corporationId: corporationBasic.corporationId,
    businessBaseCorporationInformationSynchronizationFlag: corporationBasic.businessBaseCorporationInformationSynchronizationFlag,
    businessBaseId: corporationBasic.businessBaseId,
    businessBaseName: corporationBasic.businessBaseName,
    businessBaseNameKana: corporationBasic.businessBaseNameKana,
    businessBaseZipCode: corporationBasic.businessBaseZipCode,
    businessBasePrefectureCode: corporationBasic.businessBasePrefectureCode,
    businessBaseMunicipalities: corporationBasic.businessBaseMunicipalities,
    businessBaseAddressBuildingName: corporationBasic.businessBaseAddressBuildingName,
    businessBasePhoneNumber: corporationBasic.businessBasePhoneNumber,
    businessBaseStaffName: corporationBasic.businessBaseStaffName,
    businessBaseStaffContactPhoneNumber: corporationBasic.businessBaseStaffContactPhoneNumber,
    tvaaSalesStaff: corporationBasic.tvaaSalesStaff,
    bikeSalesStaff: corporationBasic.bikeSalesStaff,
    tvaaLimit: contractList.tvaaLimit,
    tvaaOffset: contractList.tvaaOffset,
    tvaaCount: contractList.tvaaCount,
    bikeLimit: contractList.bikeLimit,
    bikeOffset: contractList.bikeLimit,
    bikeCount: contractList.bikeCount,
    list1: contractList.list1,
    list2: contractList.list2,
    applicationEmployeeId: user,
    businessDate: new Date(corporationBasic.changeHistoryDate),
    registrationChangeMemo: "",
    screenId: 'SCR-MEM-0010',
    tabId: 'B-16'
  }
}

const convertToContractList = (response:ScrMem0010GetContractResponse): ScrMem0010GetContractResponse => {
  return {
    tvaaLimit: response.tvaaLimit,
    tvaaOffset: response.tvaaOffset,
    tvaaCount: response.tvaaCount,
    bikeLimit: response.bikeLimit,
    bikeOffset: response.bikeLimit,
    bikeCount: response.bikeCount,
    list1: response.list1,
    list2: response.list2
  }
}

const convertToErrorMessages = (response: errorResult[]): errorMessagesModel[] => {
  const list:errorMessagesModel[] = []; 
  response.map((x) => {
    list.push({
      errorCode: x.errorCode,
      errorMessage: x.errorMessage
    })
  })
  return list;
}

const ScrMem0010BasicTab = () => {

  // router
  const [searchParams] = useSearchParams();
  const corporationId = searchParams.get('corporationId');
  const businessBaseId = searchParams.get('businessBaseId');
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();
  // user情報(businessDateも併せて取得)
  const { appContext } = useContext(AppContext);

	//state
	const [changeHistory, setChangeHistory] = useState<any>([]);
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [linkHref, setLinkHref] = useState<any>();
  const [changeFlag, setChangeFlag] = useState<boolean>(false)
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [ contractList, setContractList] = useState<ScrMem0010GetContractResponse>(scrMem0010GetContractValues);

	// コンポーネントを読み取り専用に変更するフラグ
	const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<CorporationBasicModel>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchama),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields, errors  },
    setValue,
    getValues,
    reset,
    watch
  } = methods;

  useEffect(() => {
    const resistInitialize = async (corporationId: string) => {
      // TODO: 直接apiClientを使用しない
      const codeValues = (await memApiClient.post('/scr/get-code-values')).data;
      // TODO:業務日付取得方法実装待ち、new Date()で登録
      const employeeRequest:ScrMem0010GetEmployeeRequest = { businessDate: new Date()}
      // TODO: 直接apiClientを使用しない
      const scrMem0010GetEmployeeResponse = await ScrMem0010GetEmployee(employeeRequest);
      const salesStaffSelectValue = salesStaffSelectValuesModel(scrMem0010GetEmployeeResponse);
      setSelectValues(
        {...selectValues, 
          tvaaSalesStaffSelectValues:salesStaffSelectValue.tvaaSalesStaffSelectValues, 
          bikeSalesStaffSelectValues:salesStaffSelectValue.bikeSalesStaffSelectValues,
          prefectureCodeSelectValues: codeValues.prefectureCode
        }
      );

      // 法人基本情報申請API
      const scrMem0010GetMemberRequest: ScrMem0010GetMemberRequest = {
        corporationId: corporationId,
        // TODO:業務日付取得方法実装待ち、new Date()で登録
        businessDate: new Date(),
      };
      const scrMem0010GetMemberResponse = await ScrMem0010GetMember(scrMem0010GetMemberRequest);
      const scrMem0010GetBusinessbaseResponse = BusinessbaseInitialValues;
      const corporationBasic = convertToCorporationBasicModel(scrMem0010GetMemberResponse, scrMem0010GetBusinessbaseResponse);

      // 画面にデータを設定
      reset(corporationBasic);
      setLinkHref('/mem/corporations/'+scrMem0010GetMemberResponse.corporationId);

    };

    const initialize = async (corporationId: string, businessBaseId:string) => {
      // TODO: 直接apiClientを使用しない
      const codeValues = (await memApiClient.post('/scr/get-code-values')).data;
      // TODO:業務日付取得方法実装待ち、new Date()で登録
      const employeeRequest:ScrMem0010GetEmployeeRequest = { businessDate: new Date()}
      // TODO: 直接apiClientを使用しない
      const scrMem0010GetEmployeeResponse = await ScrMem0010GetEmployee(employeeRequest);
      const salesStaffSelectValue = salesStaffSelectValuesModel(scrMem0010GetEmployeeResponse);
      setSelectValues(
        {...selectValues, 
          tvaaSalesStaffSelectValues:salesStaffSelectValue.tvaaSalesStaffSelectValues, 
          bikeSalesStaffSelectValues:salesStaffSelectValue.bikeSalesStaffSelectValues,
          prefectureCodeSelectValues: codeValues.prefectureCode
        }
      );

      // 法人基本情報申請API
      const scrMem0010GetMemberRequest: ScrMem0010GetMemberRequest = {
        corporationId: corporationId,
        // TODO:業務日付取得方法実装待ち、new Date()で登録
        businessDate: new Date(),
      };
      const scrMem0010GetMemberResponse = await ScrMem0010GetMember(scrMem0010GetMemberRequest);
      
      // 事業拠点基本情報取得API
      const scrMem0010GetBusinessbaseRequest: ScrMem0010GetBusinessbaseRequest = {
        corporationId: corporationId,
        businessBaseId: businessBaseId,
      };
      const scrMem0010GetBusinessbaseResponse = await ScrMem0010GetBusinessbase(scrMem0010GetBusinessbaseRequest);
      const corporationBasic = convertToCorporationBasicModel(scrMem0010GetMemberResponse, scrMem0010GetBusinessbaseResponse);

      // 画面にデータを設定
      reset(corporationBasic);
      setLinkHref('/mem/corporations/'+scrMem0010GetMemberResponse.corporationId);

      // 変更履歴情報
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0010',
        tabId: 'B-16',
        getKeyValue: '',
        businessDate: new Date() // TODO:業務日付取得方法実装待ち、new Date()で登録
      }
      const getChangeDate = (await comApiClient.post('/com/get-change-date', getChangeDateRequest)).data;

      const chabngeHistory = getChangeDate.changeExpectDateInfo.map((e: { changeHistoryNumber: number; changeExpectDate: Date; }) => {
        return{
          value: e.changeHistoryNumber,
          displayValue: e.changeExpectDate,
        }
      })
      setChangeHistory(chabngeHistory);

      //四輪、二輪契約情報
      const request: ScrMem0010GetContractRequest = {
        businessBaseId: businessBaseId,
        businessDate: new Date(),
        limit:'',
      };
      const response = await ScrMem0010GetContract(request);
      setContractList(response);
    };

    const historyInitialize = async (applicationId: string) => {
      // TODO: 直接apiClientを使用しない
      const codeValues = (await memApiClient.post('/scr/get-code-values')).data;
      // TODO:業務日付取得方法実装待ち、new Date()で登録
      const employeeRequest:ScrMem0010GetEmployeeRequest = { businessDate: new Date()}
      // TODO: 直接apiClientを使用しない
      const scrMem0010GetEmployeeResponse = await ScrMem0010GetEmployee(employeeRequest);
      const salesStaffSelectValue = salesStaffSelectValuesModel(scrMem0010GetEmployeeResponse);
      setSelectValues(
        {...selectValues, 
          tvaaSalesStaffSelectValues:salesStaffSelectValue.tvaaSalesStaffSelectValues, 
          bikeSalesStaffSelectValues:salesStaffSelectValue.bikeSalesStaffSelectValues,
          prefectureCodeSelectValues: codeValues.prefectureCode
        }
      );
      // 法人基本情報取得API
      const request = {
        changeHistoryNumber: applicationId
      };
      const response = (await memApiClient.post('/get-history-info', request)).data;
      const corporationBasic = convertToBusinessBaseModel(response,response);

      // 画面にデータを設定
      reset(corporationBasic);
      setContractList(convertToContractList(response));
    }

    if (corporationId !== null && businessBaseId !== null) {
      initialize(corporationId, businessBaseId);
      return;
    }

    if(corporationId !== null && businessBaseId === null){
      resistInitialize(corporationId)
      return;
    }

    if(applicationId !== null){
      historyInitialize(applicationId)
      return;
    }

  },[corporationId, businessBaseId, applicationId, reset]);
  
  // チェックボックスのオンオフイベント
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const checkbox = 'businessBaseCorporationInformationSynchronizationFlag'
      if (name !== checkbox) return;
      if(value[checkbox] === true){
        console.log(value[checkbox]);
        setValue('businessBaseZipCode', getValues('corporationZipCode'))
        setValue('businessBasePrefectureCode', getValues('corporationPrefectureCode'))
        setValue('businessBaseMunicipalities', getValues('corporationMunicipalities'))
        setValue('businessBaseAddressBuildingName', getValues('corporationAddressBuildingName'))
      }

    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  /**
   * リンククリック時のイベントハンドラ
   */
  const memberMemoLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * 郵便番号onBlur時のイベントハンドラ
   */
  const businessBaseZipCodeOnBlur = async () => {
    const request = {zipCode: getValues('businessBaseZipCode')}
    const codeValues = (await comApiClient.post('/com/scr/get-address-info', request)).data;
    setValue('businessBasePrefectureCode', codeValues.prefectureCode)
    setValue('businessBaseMunicipalities', codeValues.municipalities)
    setValue('businessBaseAddressBuildingName', codeValues.townOrStreetName)
  }

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    if(Object.keys(errors).length) return;
    
    if(dirtyFields.businessBaseZipCode
      ||dirtyFields.businessBasePrefectureCode
      ||dirtyFields.businessBaseMunicipalities
      ||dirtyFields.businessBaseAddressBuildingName
      ||dirtyFields.businessBasePhoneNumber
    ){
      setChangeFlag(true)
    }
    
    // 法人基本情報申請API
    const scrMem0010InputCheckBusinessBaseRequest: ScrMem0010InputCheckBusinessBaseRequest = {
      corporationId: getValues('corporationId'),
      businessBaseId: getValues('businessBaseId'),
      businessBaseZipCode: getValues('businessBaseZipCode'),
      businessBasePrefectureCode: getValues('businessBasePrefectureCode'),
      businessBaseMunicipalities: getValues('businessBaseMunicipalities'),
      businessBaseAddressBuildingName: getValues('businessBaseAddressBuildingName'),
      businessBasePhoneNumber: getValues('businessBasePhoneNumber'),
      changeFlag: changeFlag,
    };
    const scrMem0010GetMemberResponse = await ScrMem0010InputCheckBusinessBase(scrMem0010InputCheckBusinessBaseRequest);
      
    setIsOpenPopup(true);

    setScrCom0032PopupData({
      errorMessages: convertToErrorMessages(scrMem0010GetMemberResponse.errorList),
      warningMessages: convertToErrorMessages(scrMem0010GetMemberResponse.warnList),
      contentsList: {
        screenName: '事業拠点情報',
        screenId: 'SCR-MEM-0010',
        tabName: '基本情報',
        tabId: 'B-16',
        sectionList: convertToSectionList(dirtyFields),
      },
      changeExpectDate: new Date(),// TODO:業務日付取得方法実装待ち、new Date()で登録
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations');
  };
  
  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async () => {
    setIsOpenPopup(false);

    // 法人基本情報変更申請
    const request = convertFromCorporationBasicModel(getValues(), contractList, appContext.user);
    await ScrMem0010RegistrationBusinessBase(request);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    // 法人基本情報取得API
    const request = {
      changeHistoryNumber: getValues('changeHistoryNumber')
    };
    const response = (await memApiClient.post('/get-history-info', request)).data;
    const corporationBasic = convertToBusinessBaseModel(getValues(),response);

    // 画面にデータを設定
    reset(corporationBasic);
  };

  //法人情報コピーチェックボックス
  const CheckBoxBusinessBaseCorporationInformationSynchronizationFlag = [
    {displayValue: '法人情報コピー', disabled: false}
  ]

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            <Section name='法人情報'>
              <>
                <Grid container spacing={5}>
                  <Grid item size='m'>
                    <TextField label='法人ID' name='corporationId' readonly/>
                  </Grid>
                  <Grid item size='m'>
                    <TextField label='法人名称' name='corporationName' readonly/>
                  </Grid>
                  <Grid item size='el'>
                    <TextField label='住所' name='corporationAddress' readonly/>
                  </Grid>
                  <Grid item size='m'>
                    <TextField label='TEL' name='corporationPhoneNumber' readonly/>
                  </Grid>
                  <Grid item size='m'>
                    <TextField label='FAX' name='corporationFaxNumber' readonly/>
                  </Grid>
                </Grid>
              </>
            </Section>
            <Section name='事業拠点情報'>
                <Grid container>
                  <Grid item xs={12}>
                    <Checkbox 
                      name='businessBaseCorporationInformationSynchronizationFlag' 
                      checkOptions={CheckBoxBusinessBaseCorporationInformationSynchronizationFlag} 
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item sm={3}>
                    <TextField label='事業拠点ID' name='businessBaseId' readonly/>
                  </Grid>
                  <Grid item sm={3}>
                    <TextField label='事業拠点名称' name='businessBaseName' required/>
                  </Grid>
                  <Grid item sm={3}>
                    <TextField label='事業拠点名称カナ' name='businessBaseNameKana' required/>
                  </Grid>
                  <Grid item sm={3}>
                    <PostalTextField label='郵便番号' name='businessBaseZipCode' required onBlur={businessBaseZipCodeOnBlur}  disabled={getValues('businessBaseCorporationInformationSynchronizationFlag')}/>
                  </Grid>
                  <Grid item sm={3}>
                    <Select
                      label='都道府県'
                      name='businessBasePrefectureCode'
                      selectValues={selectValues.prefectureCodeSelectValues}
                      blankOption
                      required
                      disabled={getValues('businessBaseCorporationInformationSynchronizationFlag')}
                    />
                  </Grid>
                  <Grid item sm={3}>
                    <TextField label='市区町村' name='businessBaseMunicipalities' required disabled={getValues('businessBaseCorporationInformationSynchronizationFlag')}/>
                  </Grid>
                  <Grid item sm={3}>
                    <TextField label='番地・号・建物名など' name='businessBaseAddressBuildingName' required disabled={getValues('businessBaseCorporationInformationSynchronizationFlag')}/>
                  </Grid>
                  <Grid item sm={3}>
                    <TextField label='TEL' name='businessBasePhoneNumber' required disabled={getValues('businessBaseCorporationInformationSynchronizationFlag')}/>
                  </Grid>
                  <Grid item sm={3}>
                    <TextField label='担当者' name='businessBaseStaffName'/>
                  </Grid>
                  <Grid item sm={3}>
                    <TextField label='担当者連絡先' name='businessBaseStaffContactPhoneNumber'/>
                  </Grid>
                  <Grid item sm={3}>
                    <Select
                      label='四輪営業担当'
                      name='tvaaSalesStaff'
                      selectValues={selectValues.tvaaSalesStaffSelectValues}
                      blankOption
                    />
                  </Grid>
                  <Grid item sm={3}>
                    <Select
                      label='二輪営業担当'
                      name='bikeSalesStaff'
                      selectValues={selectValues.bikeSalesStaffSelectValues}
                      blankOption
                    />
                  </Grid>
                </Grid>
            </Section>
            <Section name='会員メモ'>
              <Grid container>
                <Grid item size='s'>
                  <Link href={linkHref} underline='always' color='#00C2FF' onClick={memberMemoLinkClick}>
                    会員メモ
                  </Link>
                </Grid>
                <Grid item size='l'>
                  <TextField label='' name='memberMemo' readonly/>
                </Grid>
              </Grid>
            </Section>
          </FormProvider>
				</MainLayout>

        {/* right */}
        <MainLayout right>
          <FormProvider {...methods}>
            <Grid container height='100%'>
              <Grid item size='s'>
              {changeHistory.length <= 0?<></>:
                <RightElementStack>
                  <Stack>
                    <Typography bold>変更予約情報</Typography>
                    <WarningLabel text='変更予約あり' />
                    <Select
                      name='changeHistoryNumber'
                      selectValues={changeHistory}
                      blankOption
                    />
                    <PrimaryButton onClick={handleSwichDisplay}>
                      表示切替
                    </PrimaryButton>
                  </Stack>
                  <MarginBox mb={6}>
                    <DatePicker label='変更予定日' name='changeHistoryDate' />
                  </MarginBox>
                </RightElementStack>
              }
              </Grid>
            </Grid>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>
      
      {/* 登録内容確認ポップアップ */}
      <ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  );
};

export default ScrMem0010BasicTab;

