import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import ScrCom0032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';
import ScrCom0035Popup, {
  ScrCom0035PopupAllRegistrationDefinitionModel,
} from 'pages/com/popups/ScrCom0035Popup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { Stack } from 'layouts/Stack';

import { AddButton, ConfirmButton } from 'controls/Button';
import { DataGrid, exportCsv, GridColDef } from 'controls/Datagrid';
import { SelectValue } from 'controls/Select/Select';

import {
  getOrganizationList,
  ScrCom0025GetOrganizationListResponse,
  ScrCom0025OrganizationInfoCheck,
  ScrCom0025RegistUpdateOrganization,
} from 'apis/com/ScrCom0025Api';
import {
  ScrCom9999GetParentorganizationidListbox,
  ScrCom9999GetParentorganizationidListboxRequest,
  ScrCom9999GetParentorganizationidListboxResponse,
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 組織情報一覧結果行データモデル
 */
interface SearchResultRowModel {
  // 項目内Id(hrefs)
  id: string;
  // 組織ID
  organizationId: string;
  // 部署名称
  organizationName: string;
  // 親組織ID
  parentOrganizationId: string;
  // 部署階層名称
  organizationClassName: string;
  // 営業担当フラグ
  salesStaffFlag: boolean;
  // 検査員フラグ
  inspectorFlag: boolean;
  // 適用開始日
  applyingStartDate: string;
  // 適用終了日
  applyingEndDate: string;
  // 変更理由
  changeReason: string;
  // 変更タイムスタンプ
  changeTimestamp: string;
}

/**
 * 組織情報一覧結果行データモデル
 */
const initialValues: SearchResultRowModel = {
  // 項目内Id(hrefs)
  id: '',
  // 組織ID
  organizationId: '',
  // 部署名称
  organizationName: '',
  // 親組織ID
  parentOrganizationId: '',
  // 部署階層名称
  organizationClassName: '',
  // 営業担当フラグ
  salesStaffFlag: false,
  // 検査員フラグ
  inspectorFlag: false,
  // 適用開始日
  applyingStartDate: '',
  // 適用終了日
  applyingEndDate: '',
  // 変更理由
  changeReason: '',
  // 変更タイムスタンプ
  changeTimestamp: '',
};

/**
 * 組織情報一覧結果行データモデル
 */
export interface CheckRow {
  // 組織ID
  organizationId: string;
  // 部署名称
  organizationName: string;
  // 適用開始日
  applyingStartDate: string;
  // 適用終了日
  applyingEndDate: string;
  // 業務日付
  businessDate: string;
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

/**
 * 取込対象選択データ
 */
const allRegistrationDefinitions: ScrCom0035PopupAllRegistrationDefinitionModel[] =
  [{ id: 'BRG-COM-0002', label: '組織情報' }];

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 親組織ID
  parentorganizationidSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 親組織ID
  parentorganizationidSelectValues: [],
};

/**
 * 組織情報一覧結果情報取得APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0025GetOrganizationListResponse
): SearchResultRowModel[] => {
  return response.searchResult.map((x) => {
    return {
      id: x.id,
      organizationId: x.organizationId,
      organizationName: x.organizationName,
      parentOrganizationId: x.parentOrganizationId,
      organizationClassName: x.organizationClassName,
      salesStaffFlag: x.salesStaffFlag,
      inspectorFlag: x.inspectorFlag,
      applyingStartDate: x.applyingStartDate,
      applyingEndDate: x.applyingEndDate,
      changeReason: x.changeReason,
      changeTimestamp: x.changeTimestamp,
    };
  });
};

/**
 * 親組織ID情報取得APIレスポンスからへの変換
 */
const parentorganizationidSelectValuesModel = (
  response: ScrCom9999GetParentorganizationidListboxResponse
): SelectValue[] => {
  return response.searchGetParentorganizationidListbox.map((x) => {
    return {
      value: x.parentOrganizationId,
      displayValue: x.organizationName,
    };
  });
};

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  organizationName: yup.string().label('部署名称').max(30).required(),
  changeReason: yup.string().label('変更理由').max(30),
  applyingStartDate: yup.date().label('適用開始日').required(),
  applyingEndDate: yup.date().label('適用終了日').required(),
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  // 登録・変更内容リスト
  registrationChangeList: [],
  errorList: [],
  warningList: [],
  changeExpectDate: '',
};

/**
 * SCR-COM-0025 組織管理画面
 */
const ScrCom0025OrganizationTab = () => {
  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const apiRef = useGridApiRef();
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const maxSectionWidth =
    Number(
      apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
    ) + 40;

  // user情報(
  const { user } = useContext(AuthContext);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<SearchResultRowModel>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchama),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
  } = methods;

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  const [scrCom0035PopupIsOpen, setScrCom0035PopupIsOpen] =
    useState<boolean>(false);

  /**
   * 検索条件列定義
   */
  const searchResultColumns: GridColDef[] = [
    {
      field: 'organizationId',
      headerName: '組織ID',
      headerAlign: 'center',
      size: 'ss',
    },
    {
      field: 'organizationName',
      headerName: '部署名称',
      headerAlign: 'center',
      width: 400,
      cellType: 'input',
    },
    {
      field: 'parentOrganizationId',
      headerName: '親ID',
      headerAlign: 'center',
      size: 'ss',
      cellType: 'select',
      selectValues: selectValues.parentorganizationidSelectValues,
    },
    {
      field: 'organizationClassName',
      headerName: '部署階層名称',
      headerAlign: 'center',
      width: 400,
    },
    {
      field: 'salesStaffFlag',
      headerName: '営業担当フラグ',
      headerAlign: 'center',
      size: 's',
      cellType: 'checkbox',
    },
    {
      field: 'inspectorFlag',
      headerName: '検査員フラグ',
      headerAlign: 'center',
      size: 's',
      cellType: 'checkbox',
    },
    {
      field: 'applyingStartDate',
      headerName: '適用開始日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'applyingEndDate',
      headerName: '適用終了日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'changeReason',
      headerName: '変更理由',
      headerAlign: 'center',
      width: 400,
      cellType: 'input',
    },
  ];

  /**
   * 初期画面表示時に処理結果一覧検索処理を実行
   */
  useEffect(() => {
    const initialize = async () => {
      const response = await getOrganizationList(null);
      const searchResult = convertToSearchResultRowModel(response);
      setSearchResult(searchResult);

      // SCR-COM-9999-0002: 親組織ID情報取得API
      const parentorganizationidRequest: ScrCom9999GetParentorganizationidListboxRequest =
        {
          businessDate: user.taskDate,
        };
      const parentorganizationidResponse =
        await ScrCom9999GetParentorganizationidListbox(
          parentorganizationidRequest
        );

      setSelectValues({
        parentorganizationidSelectValues: parentorganizationidSelectValuesModel(
          parentorganizationidResponse
        ),
      });
    };
    initialize();
  }, [user.taskDate, maxSectionWidth]);

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    const id = searchResult.length;

    const addRows = [
      ...searchResult,
      {
        id: id.toString(),
        organizationId: '',
        organizationName: '',
        parentOrganizationId: '',
        organizationClassName: '',
        salesStaffFlag: false,
        inspectorFlag: false,
        applyingStartDate: '',
        applyingEndDate: '',
        changeReason: '',
        changeTimestamp: '',
      },
    ];
    setSearchResult(addRows);
  };

  /**
   * 一括登録アイコンクリック時のイベントハンドラ
   */
  const handleIconRegistUpdateClick = () => {
    // CSV読込ポップアップを表示
    setScrCom0035PopupIsOpen(true);
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const min = d.getMinutes();
    exportCsv(
      '組織情報_' +
        user.employeeId +
        '_' +
        year.toString() +
        (month < 10 ? '0' : '') +
        month.toString() +
        (day < 10 ? '0' : '') +
        day.toString() +
        hours.toString() +
        min.toString() +
        '.csv',
      apiRef
    );
  };

  /**
   * セクション構造定義
   */
  const sectionDef = [
    {
      section: '組織情報一覧',
      fields: [
        'organizationId',
        'organizationName',
        'parentOrganizationId',
        'organizationClassName',
        'stateStaffFlag',
        'inspectorFlag',
        'applyingStartDate',
        'applyingEndDate',
        'changeReason',
      ],
      name: [
        'ID',
        '部署名称',
        '親ID',
        '部署階層',
        '営業担当',
        '検査員',
        '適用開始日',
        '適用終了日',
        '変更理由',
      ],
    },
  ];

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToChngedSections = (dirtyFields: object): sectionList[] => {
    const fields = Object.keys(dirtyFields);
    const changedSections: sectionList[] = [];
    const columnList: columnList[] = [];
    sectionDef.forEach((d) => {
      fields.forEach((f) => {
        if (d.fields.includes(f)) {
          columnList.push({ columnName: d.name[d.fields.indexOf(f)] });
        }
      });
      changedSections.push({
        sectionName: d.section,
        columnList: columnList,
      });
    });
    return changedSections;
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    const errList: ErrorList[] = [];
    searchResult.map((x) => {
      // 適用開始日 < 業務日付チェック
      if (x.applyingStartDate < user.taskDate) {
        errList.push({
          errorCode: 'MSG-FR-ERR-00016',
          errorMessage:
            '組織ID「' +
            x.organizationId +
            '」の適用開始日が正しくありません。',
        });
      }

      // 適用開始日と適用終了日チェック
      if (x.applyingStartDate > x.applyingEndDate) {
        errList.push({
          errorCode: 'MSG-FR-ERR-00017',
          errorMessage:
            '組織ID「' + x.organizationId + '」の期間に誤りがあります。',
        });
      }
    });

    // SCR-COM-0025-0004: 組織情報入力チェックAPI
    const request = {
      organizationList: searchResult.map((x) => {
        return {
          organizationId: x.organizationId,
          organizationName: x.organizationName,
          applyingStartDate: x.applyingStartDate,
          applyingEndDate: x.applyingEndDate,
          businessDate: user.employeeId,
        };
      }),
    };
    const checkResult = await ScrCom0025OrganizationInfoCheck(request);
    errList.concat(checkResult.errorList);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: errList,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-COM-0025',
          screenName: '組織管理',
          tabId: '1',
          tabName: '組織情報',
          sectionList: convertToChngedSections(dirtyFields),
        },
      ],
      changeExpectDate: '',
    });
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async () => {
    setIsOpenPopup(false);

    // SCR-COM-0025-0005: SCR-COM-0025-0005: 組織情報登録更新API
    const request = {
      registUpdateorganizationList: searchResult.map((x) => {
        return {
          organizationId: x.organizationId,
          organizationName: x.organizationName,
          applyingStartDate: x.applyingStartDate,
          applyingEndDate: x.applyingEndDate,
          parentOrganizationId: x.parentOrganizationId,
          salesStaffFlag: x.salesStaffFlag,
          inspectorFlag: x.inspectorFlag,
          changeReason: x.changeReason,
          userId: user.employeeId,
          afterTimestamp: user.employeeId,
          beforeTimestamp: x.changeTimestamp,
        };
      }),
    };
    await ScrCom0025RegistUpdateOrganization(request);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 組織情報一覧 */}
            <Section
              name='組織情報一覧'
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  <AddButton onClick={handleIconOutputCsvClick}>
                    CSV出力
                  </AddButton>
                  <AddButton onClick={handleIconRegistUpdateClick}>
                    一括登録
                  </AddButton>
                  <AddButton onClick={handleIconAddClick}>追加</AddButton>
                </MarginBox>
              }
              width={maxSectionWidth}
            >
              <DataGrid
                columns={searchResultColumns}
                rows={searchResult}
                apiRef={apiRef}
              />
            </Section>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* CSV読込（ポップアップ） */}
      {scrCom0035PopupIsOpen ? (
        <ScrCom0035Popup
          allRegistrationDefinitions={allRegistrationDefinitions}
          screenId={'SCR-COM-0025'}
          isOpen={scrCom0035PopupIsOpen}
          setIsOpen={() => setScrCom0035PopupIsOpen(false)}
        />
      ) : (
        ''
      )}

      {/* 登録内容確認ポップアップ */}
      {isOpenPopup && (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          handleConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      )}
    </>
  );
};

export default ScrCom0025OrganizationTab;
