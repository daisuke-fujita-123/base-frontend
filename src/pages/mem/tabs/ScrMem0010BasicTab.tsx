import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0032Popup, {
  columnList,
  errorList,
  ScrCom0032PopupModel,
  sectionList,
  warningList,
} from 'pages/com/popups/ScrCom0032Popup';

import { MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { DatePicker } from 'controls/DatePicker';
import { WarningLabel } from 'controls/Label';
import { Link } from 'controls/Link';
import { Select, SelectValue } from 'controls/Select';
import { Textarea } from 'controls/Textarea';
import { PostalTextField, TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  ScrCom9999GetAddressInfo,
  ScrCom9999GetChangeDate,
} from 'apis/com/ScrCom9999Api';
import {
  errorResult,
  ScrMem0010GetBusinessbase,
  ScrMem0010GetBusinessbaseRequest,
  ScrMem0010GetBusinessbaseResponse,
  ScrMem0010GetContract,
  ScrMem0010GetContractRequest,
  ScrMem0010GetContractResponse,
  ScrMem0010InputCheckBusinessBase,
  ScrMem0010InputCheckBusinessBaseRequest,
  ScrMem0010RegistrationBusinessBase,
  ScrMem0010RegistrationBusinessBaseRequest,
} from 'apis/mem/ScrMem0010Api';
import {
  ScrMem9999GetCodeValue,
  ScrMem9999GetCorpBasicInfo,
  ScrMem9999GetCorpBasicInfoRequest,
  ScrMem9999GetCorpBasicInfoResponse,
  ScrMem9999GetEmployee,
  ScrMem9999GetEmployeeFromBusinessBaseResponse,
} from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { memApiClient } from 'providers/ApiClient';
import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

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
  changeExpectedDate: string;
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
  scrMem0010GetMemberResponse: ScrMem9999GetCorpBasicInfoResponse,
  scrMem0010GetBusinessbaseResponse: ScrMem0010GetBusinessbaseResponse
): CorporationBasicModel => {
  return {
    // 法人ID
    corporationId: scrMem0010GetMemberResponse.corporationId,
    // 法人名称
    corporationName: scrMem0010GetMemberResponse.corporationName,
    // 法人郵便番号
    corporationZipCode: scrMem0010GetMemberResponse.corporationZipCode,
    // 法人都道府県コード
    corporationPrefectureCode:
      scrMem0010GetMemberResponse.corporationPrefectureCode,
    // 法人市区町村
    corporationMunicipalities:
      scrMem0010GetMemberResponse.corporationMunicipalities,
    // 法人番地号建物名
    corporationAddressBuildingName:
      scrMem0010GetMemberResponse.corporationAddressBuildingName,
    // 住所
    corporationAddress: scrMem0010GetMemberResponse.address,
    // 法人電話番号
    corporationPhoneNumber: scrMem0010GetMemberResponse.corporationPhoneNumber,
    // 法人FAX番号
    corporationFaxNumber: scrMem0010GetMemberResponse.corporationFaxNumber,
    // 会員メモ
    memberMemo: scrMem0010GetMemberResponse.memberMemo,
    // 事業拠点法人情報同期フラグ
    businessBaseCorporationInformationSynchronizationFlag:
      scrMem0010GetBusinessbaseResponse.businessBaseCorporationInformationSynchronizationFlag,
    // 事業拠点ID
    businessBaseId: scrMem0010GetBusinessbaseResponse.businessBaseId,
    // 事業拠点名称
    businessBaseName: scrMem0010GetBusinessbaseResponse.businessBaseName,
    // 事業拠点名称カナ
    businessBaseNameKana:
      scrMem0010GetBusinessbaseResponse.businessBaseNameKana,
    // 事業拠点郵便番号
    businessBaseZipCode: scrMem0010GetBusinessbaseResponse.businessBaseZipCode,
    // 事業拠点都道府県コード
    businessBasePrefectureCode:
      scrMem0010GetBusinessbaseResponse.businessBasePrefectureCode,
    // 事業拠点市区町村
    businessBaseMunicipalities:
      scrMem0010GetBusinessbaseResponse.businessBaseMunicipalities,
    // 事業拠点番地号建物名
    businessBaseAddressBuildingName:
      scrMem0010GetBusinessbaseResponse.businessBaseAddressBuildingName,
    // 事業拠点電話番号
    businessBasePhoneNumber:
      scrMem0010GetBusinessbaseResponse.businessBasePhoneNumber,
    // 事業拠点担当者氏名
    businessBaseStaffName:
      scrMem0010GetBusinessbaseResponse.businessBaseStaffName,
    // 事業拠点担当者連絡先電話番号
    businessBaseStaffContactPhoneNumber:
      scrMem0010GetBusinessbaseResponse.businessBaseStaffContactPhoneNumber,
    // 四輪営業担当
    tvaaSalesStaff: scrMem0010GetBusinessbaseResponse.tvaaSalesStaff,
    // 二輪営業担当
    bikeSalesStaff: scrMem0010GetBusinessbaseResponse.bikeSalesStaff,

    // 変更履歴番号
    changeHistoryNumber: '',
    // 変更予定日
    changeExpectedDate: '',
  };
};

/**
 * APIリクエストから法人基本情報データモデルへの変換
 */
const convertToBusinessBaseModel = (
  corporationBasic: CorporationBasicModel,
  scrMem0010GetBusinessbaseResponse: ScrMem0010GetBusinessbaseResponse
): CorporationBasicModel => {
  return {
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
    corporationAddressBuildingName:
      corporationBasic.corporationAddressBuildingName,
    // 住所
    corporationAddress: corporationBasic.corporationAddress,
    // 法人電話番号
    corporationPhoneNumber: corporationBasic.corporationPhoneNumber,
    // 法人FAX番号
    corporationFaxNumber: corporationBasic.corporationFaxNumber,
    // 会員メモ
    memberMemo: corporationBasic.memberMemo,
    // 事業拠点法人情報同期フラグ
    businessBaseCorporationInformationSynchronizationFlag:
      scrMem0010GetBusinessbaseResponse.businessBaseCorporationInformationSynchronizationFlag,
    // 事業拠点ID
    businessBaseId: scrMem0010GetBusinessbaseResponse.businessBaseId,
    // 事業拠点名称
    businessBaseName: scrMem0010GetBusinessbaseResponse.businessBaseName,
    // 事業拠点名称カナ
    businessBaseNameKana:
      scrMem0010GetBusinessbaseResponse.businessBaseNameKana,
    // 事業拠点郵便番号
    businessBaseZipCode: scrMem0010GetBusinessbaseResponse.businessBaseZipCode,
    // 事業拠点都道府県コード
    businessBasePrefectureCode:
      scrMem0010GetBusinessbaseResponse.businessBasePrefectureCode,
    // 事業拠点市区町村
    businessBaseMunicipalities:
      scrMem0010GetBusinessbaseResponse.businessBaseMunicipalities,
    // 事業拠点番地号建物名
    businessBaseAddressBuildingName:
      scrMem0010GetBusinessbaseResponse.businessBaseAddressBuildingName,
    // 事業拠点電話番号
    businessBasePhoneNumber:
      scrMem0010GetBusinessbaseResponse.businessBasePhoneNumber,
    // 事業拠点担当者氏名
    businessBaseStaffName:
      scrMem0010GetBusinessbaseResponse.businessBaseStaffName,
    // 事業拠点担当者連絡先電話番号
    businessBaseStaffContactPhoneNumber:
      scrMem0010GetBusinessbaseResponse.businessBaseStaffContactPhoneNumber,
    // 四輪営業担当
    tvaaSalesStaff: scrMem0010GetBusinessbaseResponse.tvaaSalesStaff,
    // 二輪営業担当
    bikeSalesStaff: scrMem0010GetBusinessbaseResponse.bikeSalesStaff,

    // 変更履歴番号
    changeHistoryNumber: '',
    // 変更予定日
    changeExpectedDate: '',
  };
};

/**
 * 事業拠点契約コース・サービス一覧取得レスポンスからプルダウンデータモデルへの変換
 */
const salesStaffSelectValuesModel = (
  response: ScrMem9999GetEmployeeFromBusinessBaseResponse
): SelectValuesModel => {
  return {
    tvaaSalesStaffSelectValues: response.tvaaSalesInfo.map((x) => {
      return {
        value: x.salesId,
        displayValue: x.salesId + '　' + x.salesName,
      };
    }),
    bikeSalesStaffSelectValues: response.bikeSalesInfo.map((x) => {
      return {
        value: x.salesId,
        displayValue: x.salesId + '　' + x.salesName,
      };
    }),
    prefectureCodeSelectValues: [],
  };
};

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
  changeHistoryNumber: '',
  // 変更予定日
  changeExpectedDate: '',
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
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: '',
};

/**
 * 事業拠点契約コース・サービス一覧初期データ
 */
const contractListInitialValues = {
  tvaaLimitCount: 0,
  tvaaResponseCount: 0,
  tvaaAcquisitionCount: 0,
  bikeLimitCount: 0,
  bikeResponseCount: 0,
  bikeAcquisitionCount: 0,
  list1: [],
  list2: [],
};

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  businessBaseName: yup.string().label('事業拠点名称').max(40).required(),
  businessBaseNameKana: yup
    .string()
    .label('事業拠点名称カナ')
    .max(40)
    .half()
    .required(),
  businessBaseZipCode: yup.string().label('郵便番号').max(8).half().required(),
  businessBasePrefectureCode: yup.string().label('都道府県').max(4).required(),
  businessBaseMunicipalities: yup.string().label('市区町村').max(40).required(),
  businessBaseAddressBuildingName: yup
    .string()
    .label('番地・号・建物名など')
    .max(40)
    .required(),
  businessBasePhoneNumber: yup.string().label('TEL').max(13).phone().required(),
  businessBaseStaffName: yup.string().label('担当者').max(30),
  businessBaseStaffContactPhoneNumber: yup
    .string()
    .label('担当者連絡先')
    .max(13)
    .phone(),
  tvaaSalesStaff: yup.string().label('四輪営業担当').max(48),
  bikeSalesStaff: yup.string().label('二輪営業担当').max(48),
};

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
 * 事業拠点登録APIリクエストへの変換
 */
const convertFromCorporationBasicModel = (
  corporationBasic: CorporationBasicModel,
  contractList: ScrMem0010GetContractResponse,
  user: string,
  registrationChangeMemo: string
): ScrMem0010RegistrationBusinessBaseRequest => {
  return {
    corporationId: corporationBasic.corporationId,
    businessBaseCorporationInformationSynchronizationFlag:
      corporationBasic.businessBaseCorporationInformationSynchronizationFlag,
    businessBaseId: corporationBasic.businessBaseId,
    businessBaseName: corporationBasic.businessBaseName,
    businessBaseNameKana: corporationBasic.businessBaseNameKana,
    businessBaseZipCode: corporationBasic.businessBaseZipCode,
    businessBasePrefectureCode: corporationBasic.businessBasePrefectureCode,
    businessBaseMunicipalities: corporationBasic.businessBaseMunicipalities,
    businessBaseAddressBuildingName:
      corporationBasic.businessBaseAddressBuildingName,
    businessBasePhoneNumber: corporationBasic.businessBasePhoneNumber,
    businessBaseStaffName: corporationBasic.businessBaseStaffName,
    businessBaseStaffContactPhoneNumber:
      corporationBasic.businessBaseStaffContactPhoneNumber,
    tvaaSalesStaff: corporationBasic.tvaaSalesStaff,
    bikeSalesStaff: corporationBasic.bikeSalesStaff,
    tvaaResponseCount: contractList.tvaaResponseCount,
    bikeResponseCount: contractList.bikeResponseCount,
    tvaaList: contractList.list1,
    bikeList: contractList.list2,
    applicationEmployeeId: user,
    changeExpectDate: new Date(corporationBasic.changeExpectedDate),
    registrationChangeMemo: registrationChangeMemo,
    screenId: 'SCR-MEM-0010',
    tabId: 'B-16',
  };
};

const convertToErrorMessages = (response: errorResult[]): errorList[] => {
  const list: errorList[] = [];
  response.map((x) => {
    list.push({
      errorCode: x.errorCode,
      errorMessage: x.errorMessage,
    });
  });
  return list;
};

const convertTowarningMessages = (response: errorResult[]): warningList[] => {
  const list: warningList[] = [];
  response.map((x) => {
    list.push({
      warningCode: x.errorCode,
      warningMessage: x.errorMessage,
    });
  });
  return list;
};

const ScrMem0010BasicTab = () => {
  // router
  const [searchParams] = useSearchParams();
  const { corporationId, bussinessBaseId } = useParams();
  const applicationId = searchParams.get('applicationId');
  const readOnly = searchParams.get('readOnly');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  //state
  const [changeHistory, setChangeHistory] = useState<any>([]);
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [linkHref, setLinkHref] = useState<any>();
  const [contractList, setContractList] =
    useState<ScrMem0010GetContractResponse>(contractListInitialValues);
  const [scrCom00032PopupIsOpen, setScrCom00032PopupIsOpen] =
    useState<boolean>(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckIsOpen, setChangeHistoryDateCheckIsOpen] =
    useState<boolean>(false);

  // コンポーネントを読み取り専用に変更するフラグ
  const readOnlyFlag: boolean =
    readOnly === null ? false : readOnly === 'true' ? true : false;
  const isReadOnly = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0010') === -1
      ? true
      : readOnlyFlag
  );

  // form
  const methods = useForm<CorporationBasicModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchama)),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields, errors },
    setValue,
    getValues,
    reset,
    watch,
  } = methods;

  useEffect(() => {
    const resistInitialize = async (corporationId: string) => {
      // 法人基本情報申請API
      const getCorpBasicInfoRequest: ScrMem9999GetCorpBasicInfoRequest = {
        corporationId: corporationId,
      };
      const getCorpBasicInfoResponse = await ScrMem9999GetCorpBasicInfo(
        getCorpBasicInfoRequest
      );

      // 事業拠点基本情報取得
      const scrMem0010GetBusinessbaseResponse = BusinessbaseInitialValues;
      const corporationBasic: ScrMem0010GetBusinessbaseResponse =
        convertToCorporationBasicModel(
          getCorpBasicInfoResponse,
          scrMem0010GetBusinessbaseResponse
        );

      // 画面にデータを設定
      reset(corporationBasic);
      setLinkHref('/mem/corporations/' + corporationId);

      // リスト取得
      const selectValues = selectValuesInitialValues;
      // 共通管理コード値取得（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const getCodeValueResponse = await ScrMem9999GetCodeValue(
        getCodeValueRequest
      );
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            selectValues.prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 営業担当情報取得(市区郡マスタ)
      const getEmployeeResponse = await ScrMem9999GetEmployee();
      getEmployeeResponse.tvaaSalesInfo.map((x) => {
        selectValues.tvaaSalesStaffSelectValues.push({
          value: x.salesId,
          displayValue: x.salesId + '　' + x.salesName,
        });
      });
      getEmployeeResponse.bikeSalesInfo.map((x) => {
        selectValues.bikeSalesStaffSelectValues.push({
          value: x.salesId,
          displayValue: x.salesId + '　' + x.salesName,
        });
      });

      setSelectValues({
        tvaaSalesStaffSelectValues: selectValues.tvaaSalesStaffSelectValues,
        bikeSalesStaffSelectValues: selectValues.bikeSalesStaffSelectValues,
        prefectureCodeSelectValues: selectValues.prefectureCodeSelectValues,
      });
    };

    const initialize = async (
      corporationId: string,
      businessBaseId: string
    ) => {
      // 法人基本情報申請API
      const getCorpBasicInfoRequest: ScrMem9999GetCorpBasicInfoRequest = {
        corporationId: corporationId,
      };
      const getCorpBasicInfoResponse = await ScrMem9999GetCorpBasicInfo(
        getCorpBasicInfoRequest
      );

      // 事業拠点基本情報取得API
      const scrMem0010GetBusinessbaseRequest: ScrMem0010GetBusinessbaseRequest =
        {
          corporationId: corporationId,
          businessBaseId: businessBaseId,
        };
      const scrMem0010GetBusinessbaseResponse = await ScrMem0010GetBusinessbase(
        scrMem0010GetBusinessbaseRequest
      );

      const corporationBasic = convertToCorporationBasicModel(
        getCorpBasicInfoResponse,
        scrMem0010GetBusinessbaseResponse
      );

      // 画面にデータを設定
      reset(corporationBasic);
      setLinkHref('/mem/corporations/' + corporationId);

      // リスト取得
      const selectValues = selectValuesInitialValues;
      // 共通管理コード値取得（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const getCodeValueResponse = await ScrMem9999GetCodeValue(
        getCodeValueRequest
      );
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            selectValues.prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 営業担当情報取得(市区郡マスタ)
      const getEmployeeResponse = await ScrMem9999GetEmployee();
      getEmployeeResponse.tvaaSalesInfo.map((x) => {
        selectValues.tvaaSalesStaffSelectValues.push({
          value: x.salesId,
          displayValue: x.salesId + '　' + x.salesName,
        });
      });
      getEmployeeResponse.bikeSalesInfo.map((x) => {
        selectValues.bikeSalesStaffSelectValues.push({
          value: x.salesId,
          displayValue: x.salesId + '　' + x.salesName,
        });
      });

      setSelectValues({
        tvaaSalesStaffSelectValues: selectValues.tvaaSalesStaffSelectValues,
        bikeSalesStaffSelectValues: selectValues.bikeSalesStaffSelectValues,
        prefectureCodeSelectValues: selectValues.prefectureCodeSelectValues,
      });

      // 変更履歴情報
      const getChangeDateRequest = {
        screenId: 'SCR-MEM-0010',
        tabId: 16,
        masterId: '',
        businessDate: user.taskDate,
      };
      const getChangeDate = await ScrCom9999GetChangeDate(getChangeDateRequest);

      const chabngeHistory = getChangeDate.changeExpectDateInfo.map((x) => {
        return {
          value: x.changeHistoryNumber,
          displayValue: new Date(x.changeExpectDate).toLocaleDateString(),
        };
      });
      setChangeHistory(chabngeHistory);

      //四輪、二輪契約情報
      const request: ScrMem0010GetContractRequest = {
        corporationId: corporationId,
        businessBaseId: businessBaseId,
        businessDate: new Date(),
        limit: '',
      };
      const response = await ScrMem0010GetContract(request);
      setContractList(response);
    };

    const historyInitialize = async (applicationId: string) => {
      // 変更履歴情報取得API
      const request = {
        changeHistoryNumber: applicationId,
      };
      const response = (
        await memApiClient.post('/scr-mem-9999/get-history-info', request)
      ).data;
      const corporationBasic = convertToBusinessBaseModel(response, response);

      // 画面にデータを設定
      reset(corporationBasic);
      setContractList(response);

      // リスト取得
      const selectValues = selectValuesInitialValues;
      // 共通管理コード値取得（コード管理マスタ以外）
      const getCodeValueRequest = {
        entityList: [{ entityName: 'prefecture_master' }],
      };
      const getCodeValueResponse = await ScrMem9999GetCodeValue(
        getCodeValueRequest
      );
      getCodeValueResponse.resultList.map((x) => {
        if (x.entityName === 'prefecture_master') {
          x.codeValueList.map((f) => {
            selectValues.prefectureCodeSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeValueName,
            });
          });
        }
      });

      // 営業担当情報取得(市区郡マスタ)
      const getEmployeeResponse = await ScrMem9999GetEmployee();
      getEmployeeResponse.tvaaSalesInfo.map((x) => {
        selectValues.tvaaSalesStaffSelectValues.push({
          value: x.salesId,
          displayValue: x.salesId + '　' + x.salesName,
        });
      });
      getEmployeeResponse.bikeSalesInfo.map((x) => {
        selectValues.bikeSalesStaffSelectValues.push({
          value: x.salesId,
          displayValue: x.salesId + '　' + x.salesName,
        });
      });

      setSelectValues({
        tvaaSalesStaffSelectValues: selectValues.tvaaSalesStaffSelectValues,
        bikeSalesStaffSelectValues: selectValues.bikeSalesStaffSelectValues,
        prefectureCodeSelectValues: selectValues.prefectureCodeSelectValues,
      });
    };

    if (applicationId !== null) {
      historyInitialize(applicationId);
      return;
    }

    if (
      corporationId !== undefined &&
      bussinessBaseId !== undefined &&
      bussinessBaseId !== 'new'
    ) {
      initialize(corporationId, bussinessBaseId);
      return;
    }

    if (corporationId !== undefined && bussinessBaseId === 'new') {
      resistInitialize(corporationId);
      return;
    }
  }, [corporationId, bussinessBaseId, applicationId, reset]);

  // チェックボックスのオンオフイベント
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const checkbox = 'businessBaseCorporationInformationSynchronizationFlag';
      if (name !== checkbox) return;
      if (value[checkbox] === true) {
        setValue('businessBaseZipCode', getValues('corporationZipCode'));
        setValue(
          'businessBasePrefectureCode',
          getValues('corporationPrefectureCode')
        );
        setValue(
          'businessBaseMunicipalities',
          getValues('corporationMunicipalities')
        );
        setValue(
          'businessBaseAddressBuildingName',
          getValues('corporationAddressBuildingName')
        );
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
    const getAddressInfoRequest = { zipCode: getValues('businessBaseZipCode') };
    const getAddressInfoResponse = await ScrCom9999GetAddressInfo(
      getAddressInfoRequest
    );
    setValue(
      'businessBasePrefectureCode',
      getAddressInfoResponse.prefectureCode
    );
    setValue(
      'businessBaseMunicipalities',
      getAddressInfoResponse.municipalities
    );
    setValue(
      'businessBaseAddressBuildingName',
      getAddressInfoResponse.townOrStreetName
    );
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = () => {
    if (Object.keys(errors).length) return;
    // 反映予定日整合性チェック
    setChangeHistoryDateCheckIsOpen(true);
  };

  /**
   * 確定ボタンクリック時（反映予定日整合性チェック後）のイベントハンドラ
   */
  const ChangeHistoryDateCheckUtilHandleConfirm = async (checkFlg: boolean) => {
    setChangeHistoryDateCheckIsOpen(false);
    if (!checkFlg) return;

    // 法人基本情報申請API
    const scrMem0010InputCheckBusinessBaseRequest: ScrMem0010InputCheckBusinessBaseRequest =
      {
        corporationId: getValues('corporationId'),
        businessBaseId: getValues('businessBaseId'),
        businessBaseCorporationInformationSynchronizationFlag: getValues(
          'businessBaseCorporationInformationSynchronizationFlag'
        ),
        businessBaseZipCode: getValues('businessBaseZipCode'),
        businessBasePrefectureCode: getValues('businessBasePrefectureCode'),
        businessBaseMunicipalities: getValues('businessBaseMunicipalities'),
        businessBaseAddressBuildingName: getValues(
          'businessBaseAddressBuildingName'
        ),
        businessBasePhoneNumber: getValues('businessBasePhoneNumber'),
      };
    const scrMem0010GetMemberResponse = await ScrMem0010InputCheckBusinessBase(
      scrMem0010InputCheckBusinessBaseRequest
    );

    setScrCom00032PopupIsOpen(true);

    setScrCom0032PopupData({
      errorList: convertToErrorMessages(scrMem0010GetMemberResponse.errorList),
      warningList: convertTowarningMessages(
        scrMem0010GetMemberResponse.warnList
      ),
      registrationChangeList: [
        {
          screenId: 'SCR-MEM-0010',
          screenName: '事業拠点情報',
          tabId: 16,
          tabName: '基本情報',
          sectionList: convertToSectionList(dirtyFields),
        },
      ],
      changeExpectDate: user.taskDate,
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations/' + corporationId);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setScrCom00032PopupIsOpen(false);

    // 法人基本情報変更申請
    const request = convertFromCorporationBasicModel(
      getValues(),
      contractList,
      user.employeeId,
      registrationChangeMemo
    );
    await ScrMem0010RegistrationBusinessBase(request);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setScrCom00032PopupIsOpen(false);
  };

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    // 変更履歴情報取得API
    const request = {
      changeHistoryNumber: getValues('changeHistoryNumber'),
    };
    const response = (
      await memApiClient.post('/scr-mem-9999/get-history-info', request)
    ).data;
    const corporationBasic = convertToBusinessBaseModel(getValues(), response);

    setIsChangeHistoryBtn(true);
    // 画面にデータを設定
    reset(corporationBasic);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 法人情報セクション */}
            <Section name='法人情報'>
              <RowStack>
                <ColStack>
                  <TextField label='法人ID' name='corporationId' readonly />
                  <TextField
                    label='住所'
                    name='corporationAddress'
                    readonly
                    size='l'
                  />
                  <TextField
                    label='TEL'
                    name='corporationPhoneNumber'
                    readonly
                  />
                </ColStack>
                <ColStack>
                  <TextField label='法人名称' name='corporationName' readonly />
                  <MarginBox mt={17}>
                    <TextField
                      label='FAX'
                      name='corporationFaxNumber'
                      readonly
                    />
                  </MarginBox>
                </ColStack>
              </RowStack>
            </Section>

            {/* 事業拠点情報セクション */}
            <Section name='事業拠点情報'>
              <RowStack>
                <ColStack>
                  <RowStack>
                    <ColStack>
                      <Checkbox
                        name='businessBaseCorporationInformationSynchronizationFlag'
                        label='法人情報コピー'
                      />
                    </ColStack>
                  </RowStack>
                  <RowStack>
                    <ColStack>
                      <TextField
                        label='事業拠点ID'
                        name='businessBaseId'
                        readonly
                      />
                      <Select
                        label='都道府県'
                        name='businessBasePrefectureCode'
                        selectValues={selectValues.prefectureCodeSelectValues}
                        blankOption
                        required
                        disabled={getValues(
                          'businessBaseCorporationInformationSynchronizationFlag'
                        )}
                      />
                      <TextField label='担当者' name='businessBaseStaffName' />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='事業拠点名称'
                        name='businessBaseName'
                        required
                      />
                      <TextField
                        label='市区町村'
                        name='businessBaseMunicipalities'
                        required
                        disabled={getValues(
                          'businessBaseCorporationInformationSynchronizationFlag'
                        )}
                      />
                      <TextField
                        label='担当者連絡先'
                        name='businessBaseStaffContactPhoneNumber'
                      />
                    </ColStack>
                    <ColStack>
                      <TextField
                        label='事業拠点名称カナ'
                        name='businessBaseNameKana'
                        required
                      />
                      <TextField
                        label='番地・号・建物名など'
                        name='businessBaseAddressBuildingName'
                        required
                        disabled={getValues(
                          'businessBaseCorporationInformationSynchronizationFlag'
                        )}
                      />
                      <Select
                        label='四輪営業担当'
                        name='tvaaSalesStaff'
                        selectValues={selectValues.tvaaSalesStaffSelectValues}
                        blankOption
                      />
                    </ColStack>
                    <ColStack>
                      <PostalTextField
                        label='郵便番号'
                        name='businessBaseZipCode'
                        required
                        onBlur={businessBaseZipCodeOnBlur}
                        disabled={getValues(
                          'businessBaseCorporationInformationSynchronizationFlag'
                        )}
                      />
                      <TextField
                        label='TEL'
                        name='businessBasePhoneNumber'
                        required
                        disabled={getValues(
                          'businessBaseCorporationInformationSynchronizationFlag'
                        )}
                      />
                      <Select
                        label='二輪営業担当'
                        name='bikeSalesStaff'
                        selectValues={selectValues.bikeSalesStaffSelectValues}
                        blankOption
                      />
                    </ColStack>
                  </RowStack>
                </ColStack>
              </RowStack>
            </Section>

            {/* 会員メモセクション */}
            <Section name='会員メモ'>
              <RowStack>
                <ColStack>
                  <Link href={linkHref} onClick={memberMemoLinkClick}>
                    会員メモ
                  </Link>
                </ColStack>
                <ColStack>
                  <Textarea name='memberMemo' disabled={true} size='l' />
                </ColStack>
              </RowStack>
            </Section>
          </FormProvider>
        </MainLayout>

        {/* right */}
        <MainLayout right>
          <FormProvider {...methods}>
            <Grid container height='100%'>
              <Grid item size='s'>
                <RightElementStack>
                  {changeHistory.length <= 0 || isReadOnly[0] ? (
                    <></>
                  ) : (
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
                  )}
                  <MarginBox mb={6}>
                    <DatePicker
                      label='変更予定日'
                      name='changeExpectedDate'
                      disabled={isReadOnly[0]}
                    />
                  </MarginBox>
                </RightElementStack>
              </Grid>
            </Grid>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel} disable={readOnlyFlag}>
              キャンセル
            </CancelButton>
            <ConfirmButton onClick={handleConfirm} disable={isReadOnly[0]}>
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {scrCom00032PopupIsOpen ? (
        <ScrCom0032Popup
          isOpen={scrCom00032PopupIsOpen}
          data={scrCom0032PopupData}
          handleRegistConfirm={handlePopupConfirm}
          handleApprovalConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      ) : (
        ''
      )}

      {/* 反映予定日整合性チェック */}
      {changeHistoryDateCheckIsOpen ? (
        <ChangeHistoryDateCheckUtil
          changeExpectedDate={getValues('changeExpectedDate')}
          changeHistoryNumber={getValues('changeHistoryNumber')}
          isChangeHistoryBtn={isChangeHistoryBtn}
          changeHistory={changeHistory}
          isOpen={changeHistoryDateCheckIsOpen}
          handleConfirm={ChangeHistoryDateCheckUtilHandleConfirm}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrMem0010BasicTab;
