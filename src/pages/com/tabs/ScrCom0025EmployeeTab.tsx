import React, { useContext, useEffect, useState } from 'react';

import ScrCom0032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { Stack } from 'layouts/Stack';

import { AddButton, Button, ConfirmButton } from 'controls/Button';
import {
  DataGrid,
  exportCsv,
  GridColDef,
  GridHrefsModel,
} from 'controls/Datagrid';
import { SelectValue } from 'controls/Select/Select';
import { theme } from 'controls/theme';

import {
  getEmployeeList,
  ScrCom0025EmployeeInfoCheck,
  ScrCom0025GetEmployeeListResponse,
  ScrCom0025RegistUpdateEmployee,
} from 'apis/com/ScrCom0025Api';
import {
  ScrCom9999GetBelongOrganizationId,
  ScrCom9999GetBelongOrganizationIdRequest,
  ScrCom9999GetBelongOrganizationIdResponse,
  ScrCom9999GetPostIdListbox,
  ScrCom9999GetPostIdResponse,
} from 'apis/com/ScrCom9999Api';

import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import { ThemeProvider } from '@mui/material';
import {
  GridColumnGroupingModel,
  GridRenderCellParams,
  GridRowId,
  GridTreeNodeWithRender,
  useGridApiRef,
} from '@mui/x-data-grid-pro';

/**
 * 従業員情報一覧結果行データモデル
 */
interface SearchResultRowModel {
  // 項目内Id(hrefs)
  id: number;
  // 従業員ID
  employeeId: string;
  // 従業員名
  employeeName: string;
  // 従業員メールアドレス
  employeeMailAddress: string;
  // 所属
  belong: string;
  // SalesForceID
  salesForceId: string;
  // 変更理由
  changeReason: string;
  // 変更タイムスタンプ
  beforeTimestamp: string;
  // 組織ID_1
  organizationId_1: string;
  // 部署名称_1
  organizationName_1: string;
  // 役職ID_1
  postId_1: string;
  // 役職名_1
  postName_1: string;
  // 画面権限ID_1
  screenPermissionId_1: string;
  // 画面権限名
  screenPermissionName: string;
  // マスタ権限ID_1
  masterPermissionId_1: string;
  // マスタ権限名
  masterPermissionName: string;
  // 承認権限ID_1
  approvalPermissionId_1: string;
  // 承認権限名
  approvalPermissionName: string;
  // 適用開始日_1
  applyingStartDate_1: string;
  // 適用終了日_1
  applyingEndDate_1: string;
  // 変更タイムスタンプ_1
  beforeTimestamp_1: string;
  // 組織ID_2
  organizationId_2: string;
  // 部署名称_2
  organizationName_2: string;
  // 役職ID_2
  postId_2: string;
  // 役職名_2
  postName_2: string;
  // 画面権限ID_2
  screenPermissionId_2: string;
  // マスタ権限ID_2
  masterPermissionId_2: string;
  // 承認権限ID_2
  approvalPermissionId_2: string;
  // 適用開始日_2
  applyingStartDate_2: string;
  // 適用終了日_2
  applyingEndDate_2: string;
  // 変更タイムスタンプ_2
  beforeTimestamp_2: string;
  // 組織ID_3
  organizationId_3: string;
  // 部署名称_3
  organizationName_3: string;
  // 役職ID_3
  postId_3: string;
  // 役職名_3
  postName_3: string;
  // 画面権限ID_3
  screenPermissionId_3: string;
  // マスタ権限ID_3
  masterPermissionId_3: string;
  // 承認権限ID_3
  approvalPermissionId_3: string;
  // 適用開始日_3
  applyingStartDate_3: string;
  // 適用終了日_3
  applyingEndDate_3: string;
  // 変更タイムスタンプ_3
  beforeTimestamp_3: string;
  // 組織ID_4
  organizationId_4: string;
  // 部署名称_4
  organizationName_4: string;
  // 役職ID_4
  postId_4: string;
  // 役職名_4
  postName_4: string;
  // 画面権限ID_4
  screenPermissionId_4: string;
  // マスタ権限ID_4
  masterPermissionId_4: string;
  // 承認権限ID_4
  approvalPermissionId_4: string;
  // 適用開始日_4
  applyingStartDate_4: string;
  // 適用終了日_4
  applyingEndDate_4: string;
  // 変更タイムスタンプ_4
  beforeTimestamp_4: string;
}

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 所属組織ID
  belongOrganizationIdSelectValues: SelectValue[];
  // 所属役職ID
  postIdSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  belongOrganizationIdSelectValues: [],
  postIdSelectValues: [],
};

/**
 * 従業員情報一覧結果情報取得APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0025GetEmployeeListResponse
): SearchResultRowModel[] => {
  return response.employeeList.map((x, i) => {
    return {
      id: i,
      employeeId: x.employeeId,
      employeeName: x.employeeName,
      employeeMailAddress: x.employeeMailAddress,
      belong: x.belong,
      salesForceId: x.salesForceId,
      changeReason: x.changeReason,
      beforeTimestamp: x.beforeTimestamp,
      organizationId_1: x.organizationId_1,
      organizationName_1: x.organizationName_1,
      postId_1: x.postId_1,
      postName_1: x.postName_1,
      screenPermissionId_1:
        x.screenPermissionId_1 + x.screenPermissionId_2 !== ''
          ? ',' + x.screenPermissionId_2
          : '',
      screenPermissionName:
        x.screenPermissionName_1 +
        (x.screenPermissionName_2 !== '' ? ',' : '') +
        x.screenPermissionName_2 +
        (x.screenPermissionName_3 !== '' ? ',' : '') +
        x.screenPermissionName_3 +
        (x.screenPermissionName_4 !== '' ? ',' : '') +
        x.screenPermissionName_4,
      masterPermissionId_1: x.masterPermissionId_1,
      masterPermissionName:
        x.masterPermissionName_1 +
        (x.masterPermissionName_2 !== '' ? ',' : '') +
        x.masterPermissionName_2 +
        (x.masterPermissionName_3 !== '' ? ',' : '') +
        x.masterPermissionName_3 +
        (x.masterPermissionName_4 !== '' ? ',' : '') +
        x.masterPermissionName_4,
      approvalPermissionId_1: x.approvalPermissionId_1,
      approvalPermissionName:
        x.approvalPermissionName_1 +
        (x.approvalPermissionName_2 !== '' ? ',' : '') +
        x.approvalPermissionName_2 +
        (x.approvalPermissionName_3 !== '' ? ',' : '') +
        x.approvalPermissionName_3 +
        (x.approvalPermissionName_4 !== '' ? ',' : '') +
        x.approvalPermissionName_4,
      applyingStartDate_1: x.applyingStartDate_1,
      applyingEndDate_1: x.applyingEndDate_1,
      beforeTimestamp_1: x.beforeTimestamp_1,
      organizationId_2: x.organizationId_2,
      organizationName_2: x.organizationName_2,
      postId_2: x.postId_2,
      postName_2: x.postName_2,
      screenPermissionId_2: x.screenPermissionId_2,
      masterPermissionId_2: x.masterPermissionId_2,
      approvalPermissionId_2: x.approvalPermissionId_2,
      applyingStartDate_2: x.applyingStartDate_2,
      applyingEndDate_2: x.applyingEndDate_2,
      beforeTimestamp_2: x.beforeTimestamp_2,
      organizationId_3: x.organizationId_3,
      organizationName_3: x.organizationName_3,
      postId_3: x.postId_3,
      postName_3: x.postName_3,
      screenPermissionId_3: x.screenPermissionId_3,
      masterPermissionId_3: x.masterPermissionId_3,
      approvalPermissionId_3: x.approvalPermissionId_3,
      applyingStartDate_3: x.applyingStartDate_3,
      applyingEndDate_3: x.applyingEndDate_3,
      beforeTimestamp_3: x.beforeTimestamp_3,
      organizationId_4: x.organizationId_4,
      organizationName_4: x.organizationName_4,
      postId_4: x.postId_4,
      postName_4: x.postName_4,
      screenPermissionId_4: x.screenPermissionId_4,
      masterPermissionId_4: x.masterPermissionId_4,
      approvalPermissionId_4: x.approvalPermissionId_4,
      applyingStartDate_4: x.applyingStartDate_4,
      applyingEndDate_4: x.applyingEndDate_4,
      beforeTimestamp_4: x.beforeTimestamp_4,
    };
  });
};

/**
 * 承認権限ID情報取得APIレスポンスからへの変換
 */
const belongOrganizationIdSelectValuesModel = (
  response: ScrCom9999GetBelongOrganizationIdResponse
): SelectValue[] => {
  return response.organizationList.map((x) => {
    return {
      value: x.organizationId,
      displayValue: x.organizationName,
    };
  });
};

/**
 * 承認権限ID情報取得APIレスポンスからへの変換
 */
const postIdSelectValuesModel = (
  response: ScrCom9999GetPostIdResponse
): SelectValue[] => {
  return response.postList.map((x) => {
    return {
      value: x.postId,
      displayValue: x.postName,
    };
  });
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

const defaultHeaderRow = {
  employeeId: '',
  employeeName: '',
  employeeMailAddress: '',
  belong: '',
  salesForceId: '',
  organizationId_1: '',
  postId_1: '',
  applyingStartDate_1: '',
  applyingEndDate_1: '',
  organizationId_2: '',
  postId_2: '',
  applyingStartDate_2: '',
  applyingEndDate_2: '',
  organizationId_3: '',
  postId_3: '',
  applyingStartDate_3: '',
  applyingEndDate_3: '',
  organizationId_4: '',
  postId_4: '',
  applyingStartDate_4: '',
  applyingEndDate_4: '',
  screenPermissionName: '',
  masterPermissionName: '',
  approvalPermissionName: '',
  changeReason: '',
};

/**
 * SCR-COM-0025-0003 従業員情報一覧タブ
 */
const ScrCom0025EmployeeTab = () => {
  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [initSearchResult, setInitSearchResult] = useState<
    SearchResultRowModel[]
  >([]);
  const [changeBeforeResult, setChangeBeforeResult] = useState<
    SearchResultRowModel[]
  >([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const apiRef = useGridApiRef();
  const headerApiRef = useGridApiRef();
  const [headerRow, setHeaderRow] = useState(defaultHeaderRow);

  // チェックボックス選択行
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowId[]>([]);

  // router
  const navigate = useNavigate();

  // user情報
  const { user } = useContext(AuthContext);

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

  /**
   * 初期画面表示時に処理結果一覧検索処理を実行
   */
  useEffect(() => {
    const initialize = async () => {
      const response = await getEmployeeList(null);
      const searchResult = convertToSearchResultRowModel(response);
      const screenHref = searchResult.map((x) => {
        return {
          id: x.id,
          href: x.screenPermissionId_1,
        };
      });

      const hrefs = [
        {
          field: 'screenPermissionName',
          hrefs: screenHref,
        },
      ];

      const masterHref = searchResult.map((x) => {
        return {
          id: x.id,
          href: x.masterPermissionId_1,
        };
      });

      hrefs.push({
        field: 'masterPermissionName',
        hrefs: masterHref,
      });

      const approvalHref = searchResult.map((x) => {
        return {
          id: x.id,
          href: x.approvalPermissionId_1,
        };
      });

      hrefs.push({
        field: 'approvalPermissionName',
        hrefs: approvalHref,
      });
      setSearchResult(searchResult);
      // 初期値格納
      if (initSearchResult.length === 0) {
        setInitSearchResult(searchResult);
      }
      setChangeBeforeResult(searchResult);
      setHrefs(hrefs);

      // API-COM-9999-0007: 所属組織IDリストボックス情報取得API
      const belongOrganizationIdRequest: ScrCom9999GetBelongOrganizationIdRequest =
      {
        businessDate: user.taskDate,
      };
      const belongOrganizationIdResponse =
        await ScrCom9999GetBelongOrganizationId(belongOrganizationIdRequest);

      // API-COM-9999-0008: 所属役職IDリストボックス情報取得API
      const postIdResponse = await ScrCom9999GetPostIdListbox(null);

      setSelectValues({
        // 所属組織ID
        belongOrganizationIdSelectValues: belongOrganizationIdSelectValuesModel(
          belongOrganizationIdResponse
        ),
        // 所属役職ID
        postIdSelectValues: postIdSelectValuesModel(postIdResponse),
      });
    };
    initialize();
  }, [user.taskDate]);

  /**
   * 検索条件列定義
   */
  const searchResultColumns: GridColDef[] = [
    {
      field: 'button',
      headerName: '',
      cellType: 'button',
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ) => {
        if (params.id !== -1) return undefined;
        return <Button onClick={handleIkkatsuHaneiClick}>一括反映</Button>;
      },
    },
    {
      field: 'employeeId',
      headerName: '従業員ID',
      headerAlign: 'center',
      size: 'ss',
    },
    {
      field: 'employeeName',
      headerName: '従業員名（漢字）',
      headerAlign: 'center',
      width: 400,
    },
    {
      field: 'employeeMailAddress',
      headerName: 'メールアドレス',
      headerAlign: 'center',
      width: 400,
    },
    {
      field: 'belong',
      headerName: '所属',
      headerAlign: 'center',
      width: 400,
    },
    {
      field: 'salesForceId',
      headerName: 'SFID',
      headerAlign: 'center',
      size: 'l',
      cellType: 'input',
    },
    {
      field: 'organizationId_1',
      headerName: '組織ID/名称',
      headerAlign: 'center',
      size: 'm',
      cellType: 'select',
      selectValues: selectValues.belongOrganizationIdSelectValues,
    },
    {
      field: 'postId_1',
      headerName: '役職ID/名称',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.postIdSelectValues,
    },
    {
      field: 'applyingStartDate_1',
      headerName: '適用開始日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'applyingEndDate_1',
      headerName: '適用終了日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'organizationId_2',
      headerName: '組織ID/名称',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.belongOrganizationIdSelectValues,
    },
    {
      field: 'postId_2',
      headerName: '役職ID/名称',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.postIdSelectValues,
    },
    {
      field: 'applyingStartDate_2',
      headerName: '適用開始日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'applyingEndDate_2',
      headerName: '適用終了日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'organizationId_3',
      headerName: '組織ID/名称',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.belongOrganizationIdSelectValues,
    },
    {
      field: 'postId_3',
      headerName: '役職ID/名称',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.postIdSelectValues,
    },
    {
      field: 'applyingStartDate_3',
      headerName: '適用開始日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'applyingEndDate_3',
      headerName: '適用終了日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'organizationId_4',
      headerName: '組織ID/名称',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.belongOrganizationIdSelectValues,
    },
    {
      field: 'postId_4',
      headerName: '役職ID/名称',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.postIdSelectValues,
    },
    {
      field: 'applyingStartDate_4',
      headerName: '適用開始日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'applyingEndDate_4',
      headerName: '適用終了日',
      headerAlign: 'center',
      size: 'l',
      cellType: 'datepicker',
    },
    {
      field: 'screenPermissionName',
      headerName: '画面権限',
      headerAlign: 'center',
      size: 'l',
      cellType: 'link',
    },
    {
      field: 'masterPermissionName',
      headerName: 'マスタ権限',
      headerAlign: 'center',
      size: 'l',
      cellType: 'link',
    },
    {
      field: 'approvalPermissionName',
      headerName: '承認権限',
      headerAlign: 'center',
      size: 'l',
      cellType: 'link',
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
   * 列グループ定義
   */
  const columnGroups: GridColumnGroupingModel = [
    {
      groupId: '組織1',
      headerAlign: 'center',
      children: [
        { field: 'organizationId_1' },
        { field: 'postId_1' },
        { field: 'applyingStartDate_1' },
        { field: 'applyingEndDate_1' },
      ],
    },
    {
      groupId: '組織2',
      headerAlign: 'center',
      children: [
        { field: 'organizationId_2' },
        { field: 'postId_2' },
        { field: 'applyingStartDate_2' },
        { field: 'applyingEndDate_2' },
      ],
    },
    {
      groupId: '組織3',
      headerAlign: 'center',
      children: [
        { field: 'organizationId_3' },
        { field: 'postId_3' },
        { field: 'applyingStartDate_3' },
        { field: 'applyingEndDate_3' },
      ],
    },
    {
      groupId: '組織4',
      headerAlign: 'center',
      children: [
        { field: 'organizationId_4' },
        { field: 'postId_4' },
        { field: 'applyingStartDate_4' },
        { field: 'applyingEndDate_4' },
      ],
    },
  ];

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    const id = searchResult.length;

    const addRows = [
      ...searchResult,
      {
        id: id,
        employeeId: '',
        employeeName: '',
        employeeMailAddress: '',
        belong: '',
        salesForceId: '',
        changeReason: '',
        beforeTimestamp: '',
        organizationId_1: '',
        organizationName_1: '',
        postId_1: '',
        postName_1: '',
        screenPermissionId_1: '',
        screenPermissionName: '',
        masterPermissionId_1: '',
        masterPermissionName: '',
        approvalPermissionId_1: '',
        approvalPermissionName: '',
        applyingStartDate_1: '',
        applyingEndDate_1: '',
        beforeTimestamp_1: '',
        organizationId_2: '',
        organizationName_2: '',
        postId_2: '',
        postName_2: '',
        screenPermissionId_2: '',
        masterPermissionId_2: '',
        approvalPermissionId_2: '',
        applyingStartDate_2: '',
        applyingEndDate_2: '',
        beforeTimestamp_2: '',
        organizationId_3: '',
        organizationName_3: '',
        postId_3: '',
        postName_3: '',
        screenPermissionId_3: '',
        masterPermissionId_3: '',
        approvalPermissionId_3: '',
        applyingStartDate_3: '',
        applyingEndDate_3: '',
        beforeTimestamp_3: '',
        organizationId_4: '',
        organizationName_4: '',
        postId_4: '',
        postName_4: '',
        screenPermissionId_4: '',
        masterPermissionId_4: '',
        approvalPermissionId_4: '',
        applyingStartDate_4: '',
        applyingEndDate_4: '',
        beforeTimestamp_4: '',
      },
    ];
    setSearchResult(addRows);
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
      '従業員情報_' +
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
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    // 別タブで表示
    navigate(url, true);
  };

  /**
   * セクション構造定義
   */
  const sectionDef = [
    {
      section: '従業員情報一覧',
      fields: [
        'postId',
        'postName',
        'organizationId',
        'screenPermissionId',
        'masterPermissionId',
        'approvalPermissionId',
        'applyingStartDate',
        'applyingEndDate',
        'changeReason',
      ],
      name: [
        '従業員ID',
        '従業員名(漢字)',
        '組織ID',
        '画面権限',
        'マスタ権限',
        '承認権限',
        '適用開始日',
        '適用終了日',
        '変更理由',
      ],
    },
  ];

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToChngedSections = (fields: string[]): sectionList[] => {
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
    // 従業員情報入力チェック
    const errList: ErrorList[] = [];
    const searchResultChange: SearchResultRowModel[] = [];
    const fieldList: string[] = [];

    searchResult.map((x, i) => {
      if (initSearchResult.length > i) {
        if (
          x.salesForceId !== initSearchResult[i].salesForceId &&
          !fieldList.includes('salesForceId')
        ) {
          fieldList.push('salesForceId');
        }
        if (
          x.organizationId_1 !== initSearchResult[i].organizationId_1 &&
          !fieldList.includes('organizationId_1')
        ) {
          fieldList.push('organizationId_1');
        }
        if (
          x.postId_1 !== initSearchResult[i].postId_1 &&
          !fieldList.includes('postId_1')
        ) {
          fieldList.push('postId_1');
        }
        if (
          x.applyingStartDate_1 !== initSearchResult[i].applyingStartDate_1 &&
          !fieldList.includes('applyingStartDate_1')
        ) {
          fieldList.push('applyingStartDate_1');
        }
        if (
          x.applyingEndDate_1 !== initSearchResult[i].applyingEndDate_1 &&
          !fieldList.includes('applyingEndDate_1')
        ) {
          fieldList.push('applyingEndDate_1');
        }
        if (
          x.organizationId_2 !== initSearchResult[i].organizationId_2 &&
          !fieldList.includes('organizationId_2')
        ) {
          fieldList.push('organizationId_2');
        }
        if (
          x.postId_2 !== initSearchResult[i].postId_2 &&
          !fieldList.includes('postId_2')
        ) {
          fieldList.push('postId_2');
        }
        if (
          x.applyingStartDate_2 !== initSearchResult[i].applyingStartDate_2 &&
          !fieldList.includes('applyingStartDate_2')
        ) {
          fieldList.push('applyingStartDate_2');
        }
        if (
          x.applyingEndDate_2 !== initSearchResult[i].applyingEndDate_2 &&
          !fieldList.includes('applyingEndDate_2')
        ) {
          fieldList.push('applyingEndDate_2');
        }
        if (
          x.organizationId_3 !== initSearchResult[i].organizationId_3 &&
          !fieldList.includes('organizationId_3')
        ) {
          fieldList.push('organizationId_3');
        }
        if (
          x.postId_3 !== initSearchResult[i].postId_3 &&
          !fieldList.includes('postId_3')
        ) {
          fieldList.push('postId_3');
        }
        if (
          x.applyingStartDate_3 !== initSearchResult[i].applyingStartDate_3 &&
          !fieldList.includes('applyingStartDate_3')
        ) {
          fieldList.push('applyingStartDate_3');
        }
        if (
          x.applyingEndDate_3 !== initSearchResult[i].applyingEndDate_3 &&
          !fieldList.includes('applyingEndDate_3')
        ) {
          fieldList.push('applyingEndDate_3');
        }
        if (
          x.organizationId_4 !== initSearchResult[i].organizationId_4 &&
          !fieldList.includes('organizationId_4')
        ) {
          fieldList.push('organizationId_4');
        }
        if (
          x.postId_4 !== initSearchResult[i].postId_4 &&
          !fieldList.includes('postId_4')
        ) {
          fieldList.push('postId_4');
        }
        if (
          x.applyingStartDate_4 !== initSearchResult[i].applyingStartDate_4 &&
          !fieldList.includes('applyingStartDate_4')
        ) {
          fieldList.push('applyingStartDate_4');
        }
        if (
          x.applyingEndDate_4 !== initSearchResult[i].applyingEndDate_4 &&
          !fieldList.includes('applyingEndDate_4')
        ) {
          fieldList.push('applyingEndDate_4');
        }
        if (
          x.changeReason !== initSearchResult[i].changeReason &&
          !fieldList.includes('changeReason')
        ) {
          fieldList.push('changeReason');
        }

        // 変更行を格納
        if (
          x.salesForceId !== initSearchResult[i].salesForceId ||
          x.organizationId_1 !== initSearchResult[i].organizationId_1 ||
          x.postId_1 !== initSearchResult[i].postId_1 ||
          x.applyingStartDate_1 !== initSearchResult[i].applyingStartDate_1 ||
          x.applyingEndDate_1 !== initSearchResult[i].applyingEndDate_1 ||
          x.organizationId_2 !== initSearchResult[i].organizationId_2 ||
          x.postId_2 !== initSearchResult[i].postId_2 ||
          x.applyingStartDate_2 !== initSearchResult[i].applyingStartDate_2 ||
          x.applyingEndDate_2 !== initSearchResult[i].applyingEndDate_2 ||
          x.organizationId_3 !== initSearchResult[i].organizationId_3 ||
          x.postId_3 !== initSearchResult[i].postId_3 ||
          x.applyingStartDate_3 !== initSearchResult[i].applyingStartDate_3 ||
          x.applyingEndDate_3 !== initSearchResult[i].applyingEndDate_3 ||
          x.organizationId_4 !== initSearchResult[i].organizationId_4 ||
          x.postId_4 !== initSearchResult[i].postId_4 ||
          x.applyingStartDate_4 !== initSearchResult[i].applyingStartDate_4 ||
          x.applyingEndDate_4 !== initSearchResult[i].applyingEndDate_4 ||
          x.changeReason !== initSearchResult[i].changeReason
        ) {
          searchResultChange.push({
            id: i,
            employeeId: x.employeeId,
            employeeName: x.employeeName,
            employeeMailAddress: x.employeeMailAddress,
            belong: x.belong,
            salesForceId: x.salesForceId,
            changeReason: x.changeReason,
            beforeTimestamp: x.beforeTimestamp,
            organizationId_1: x.organizationId_1,
            organizationName_1: x.organizationName_1,
            postId_1: x.postId_1,
            postName_1: x.postName_1,
            screenPermissionId_1:
              x.screenPermissionId_1 + x.screenPermissionId_2 !== ''
                ? ',' + x.screenPermissionId_2
                : '',
            screenPermissionName: x.screenPermissionName,
            masterPermissionId_1: x.masterPermissionId_1,
            masterPermissionName: x.masterPermissionName,
            approvalPermissionId_1: x.approvalPermissionId_1,
            approvalPermissionName: x.approvalPermissionName,
            applyingStartDate_1: x.applyingStartDate_1,
            applyingEndDate_1: x.applyingEndDate_1,
            beforeTimestamp_1: x.beforeTimestamp_1,
            organizationId_2: x.organizationId_2,
            organizationName_2: x.organizationName_2,
            postId_2: x.postId_2,
            postName_2: x.postName_2,
            screenPermissionId_2: x.screenPermissionId_2,
            masterPermissionId_2: x.masterPermissionId_2,
            approvalPermissionId_2: x.approvalPermissionId_2,
            applyingStartDate_2: x.applyingStartDate_2,
            applyingEndDate_2: x.applyingEndDate_2,
            beforeTimestamp_2: x.beforeTimestamp_2,
            organizationId_3: x.organizationId_3,
            organizationName_3: x.organizationName_3,
            postId_3: x.postId_3,
            postName_3: x.postName_3,
            screenPermissionId_3: x.screenPermissionId_3,
            masterPermissionId_3: x.masterPermissionId_3,
            approvalPermissionId_3: x.approvalPermissionId_3,
            applyingStartDate_3: x.applyingStartDate_3,
            applyingEndDate_3: x.applyingEndDate_3,
            beforeTimestamp_3: x.beforeTimestamp_3,
            organizationId_4: x.organizationId_4,
            organizationName_4: x.organizationName_4,
            postId_4: x.postId_4,
            postName_4: x.postName_4,
            screenPermissionId_4: x.screenPermissionId_4,
            masterPermissionId_4: x.masterPermissionId_4,
            approvalPermissionId_4: x.approvalPermissionId_4,
            applyingStartDate_4: x.applyingStartDate_4,
            applyingEndDate_4: x.applyingEndDate_4,
            beforeTimestamp_4: x.beforeTimestamp_4,
          });
        }

        if (
          x.applyingStartDate_1 !== initSearchResult[i].applyingStartDate_1 ||
          x.applyingEndDate_1 !== initSearchResult[i].applyingEndDate_1 ||
          x.applyingStartDate_2 !== initSearchResult[i].applyingStartDate_2 ||
          x.applyingEndDate_2 !== initSearchResult[i].applyingEndDate_2 ||
          x.applyingStartDate_3 !== initSearchResult[i].applyingStartDate_3 ||
          x.applyingEndDate_3 !== initSearchResult[i].applyingEndDate_3 ||
          x.applyingStartDate_4 !== initSearchResult[i].applyingStartDate_4 ||
          x.applyingEndDate_4 !== initSearchResult[i].applyingEndDate_4
        ) {
          // 適用開始日と適用終了日チェック
          if (
            x.applyingStartDate_1 > x.applyingEndDate_1 ||
            x.applyingStartDate_2 > x.applyingEndDate_2 ||
            x.applyingStartDate_3 > x.applyingEndDate_3 ||
            x.applyingStartDate_4 > x.applyingEndDate_4
          ) {
            errList.push({
              errorCode: 'MSG-FR-ERR-00025',
              errorMessage:
                '従業員ID「' + x.employeeId + '」の期間に誤りがあります。',
            });
          }
        }
      } else {
        // 変更行を格納
        searchResultChange.push({
          id: i,
          employeeId: x.employeeId,
          employeeName: x.employeeName,
          employeeMailAddress: x.employeeMailAddress,
          belong: x.belong,
          salesForceId: x.salesForceId,
          changeReason: x.changeReason,
          beforeTimestamp: x.beforeTimestamp,
          organizationId_1: x.organizationId_1,
          organizationName_1: x.organizationName_1,
          postId_1: x.postId_1,
          postName_1: x.postName_1,
          screenPermissionId_1:
            x.screenPermissionId_1 + x.screenPermissionId_2 !== ''
              ? ',' + x.screenPermissionId_2
              : '',
          screenPermissionName: x.screenPermissionName,
          masterPermissionId_1: x.masterPermissionId_1,
          masterPermissionName: x.masterPermissionName,
          approvalPermissionId_1: x.approvalPermissionId_1,
          approvalPermissionName: x.approvalPermissionName,
          applyingStartDate_1: x.applyingStartDate_1,
          applyingEndDate_1: x.applyingEndDate_1,
          beforeTimestamp_1: x.beforeTimestamp_1,
          organizationId_2: x.organizationId_2,
          organizationName_2: x.organizationName_2,
          postId_2: x.postId_2,
          postName_2: x.postName_2,
          screenPermissionId_2: x.screenPermissionId_2,
          masterPermissionId_2: x.masterPermissionId_2,
          approvalPermissionId_2: x.approvalPermissionId_2,
          applyingStartDate_2: x.applyingStartDate_2,
          applyingEndDate_2: x.applyingEndDate_2,
          beforeTimestamp_2: x.beforeTimestamp_2,
          organizationId_3: x.organizationId_3,
          organizationName_3: x.organizationName_3,
          postId_3: x.postId_3,
          postName_3: x.postName_3,
          screenPermissionId_3: x.screenPermissionId_3,
          masterPermissionId_3: x.masterPermissionId_3,
          approvalPermissionId_3: x.approvalPermissionId_3,
          applyingStartDate_3: x.applyingStartDate_3,
          applyingEndDate_3: x.applyingEndDate_3,
          beforeTimestamp_3: x.beforeTimestamp_3,
          organizationId_4: x.organizationId_4,
          organizationName_4: x.organizationName_4,
          postId_4: x.postId_4,
          postName_4: x.postName_4,
          screenPermissionId_4: x.screenPermissionId_4,
          masterPermissionId_4: x.masterPermissionId_4,
          approvalPermissionId_4: x.approvalPermissionId_4,
          applyingStartDate_4: x.applyingStartDate_4,
          applyingEndDate_4: x.applyingEndDate_4,
          beforeTimestamp_4: x.beforeTimestamp_4,
        });
      }

      // 適用開始日と適用終了日チェック
      if (
        x.applyingStartDate_1 > x.applyingEndDate_1 ||
        x.applyingStartDate_2 > x.applyingEndDate_2 ||
        x.applyingStartDate_3 > x.applyingEndDate_3 ||
        x.applyingStartDate_4 > x.applyingEndDate_4
      ) {
        errList.push({
          errorCode: 'MSG-FR-ERR-00025',
          errorMessage:
            '従業員ID「' + x.employeeId + '」の期間に誤りがあります。',
        });
      }
    });

    searchResultChange.map((x, y) => {
      // 適用開始日 < 業務日付チェック
      if (
        x.applyingStartDate_1 < user.taskDate ||
        x.applyingStartDate_2 < user.taskDate ||
        x.applyingStartDate_3 < user.taskDate ||
        x.applyingStartDate_4 < user.taskDate
      ) {
        errList.push({
          errorCode: 'MSG-FR-ERR-00024',
          errorMessage:
            '従業員ID「' + x.employeeId + '」の適用開始日が正しくありません。',
        });
      }

      // 従業員ID重複チェック
      if (x.employeeId === changeBeforeResult[y].employeeId) {
        errList.push({
          errorCode: 'MSG-FR-ERR-00026',
          errorMessage: '従業員ID「' + x.employeeId + '」が重複しています。',
        });
      }
      // SFIDチェック
      if (x.salesForceId !== changeBeforeResult[y].salesForceId) {
        if (
          x.employeeId !== changeBeforeResult[y].employeeId &&
          x.salesForceId === changeBeforeResult[y].salesForceId
        ) {
          errList.push({
            errorCode: 'MSG-FR-ERR-00028',
            errorMessage:
              '従業員ID「' + x.employeeId + '」SFIDが重複しています。',
          });
        }
      }
      // 組織IDチェック
      if (
        x.organizationId_1 === undefined &&
        x.organizationName_1 === undefined &&
        x.organizationId_2 === undefined &&
        x.organizationName_2 === undefined &&
        x.organizationId_3 === undefined &&
        x.organizationName_3 === undefined &&
        x.organizationId_4 === undefined &&
        x.organizationName_4 === undefined
      ) {
        errList.push({
          errorCode: 'MSG-FR-ERR-00029',
          errorMessage:
            '従業員ID「' +
            x.employeeId +
            '」組織１～組織４のいずれかを入力してください。',
        });
      }
      // 組織1、役職IDチェック
      if (
        x.organizationId_1 !== undefined &&
        x.organizationName_1 !== undefined
      ) {
        if (
          (x.postId_1 === undefined && x.postName_1 === undefined) ||
          x.applyingStartDate_1 === undefined
        ) {
          errList.push({
            errorCode: 'MSG-FR-ERR-00030',
            errorMessage:
              '従業員ID「' +
              x.employeeId +
              '」組織ID/名称、役職ID/名称、適用開始日を入力してください。',
          });
        }
      }
    });

    //SCR-COM-0025-0009: 従業員情報入力チェックAPI
    const request = {
      checkEmployeeList: searchResult.map((x) => {
        return {
          employeeId: x.employeeId,
        };
      }),
    };
    const checkResult = await ScrCom0025EmployeeInfoCheck(request);
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
          tabId: 3,
          tabName: '従業員情報',
          sectionList: convertToChngedSections(fieldList),
        },
      ],
      changeExpectDate: '',
    });
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const scrCom00032PopupHandleConfirm = async () => {
    setIsOpenPopup(false);

    // SCR-COM-0025-0010: 従業員情報登録更新API
    const request = {
      employeeList: searchResult.map((x) => {
        return {
          employeeId: x.employeeId,
          salesForceId: x.salesForceId,
          changeReason: x.changeReason,
          beforeTimestamp: x.beforeTimestamp,
          organizationId_1: x.organizationId_1,
          postId_1: x.postId_1,
          applyingStartDate_1: x.applyingStartDate_1,
          applyingEndDate_1: x.applyingEndDate_1,
          beforeTimestamp_1: x.beforeTimestamp_1,
          organizationId_2: x.organizationId_2,
          postId_2: x.postId_2,
          applyingStartDate_2: x.applyingStartDate_2,
          applyingEndDate_2: x.applyingEndDate_2,
          beforeTimestamp_2: x.beforeTimestamp_2,
          organizationId_3: x.organizationId_3,
          postId_3: x.postId_3,
          applyingStartDate_3: x.applyingStartDate_3,
          applyingEndDate_3: x.applyingEndDate_3,
          beforeTimestamp_3: x.beforeTimestamp_3,
          organizationId_4: x.organizationId_4,
          postId_4: x.postId_4,
          applyingStartDate_4: x.applyingStartDate_4,
          applyingEndDate_4: x.applyingEndDate_4,
          beforeTimestamp_4: x.beforeTimestamp_4,
          userId: user.employeeId,
          afterTimestamp: user.taskDate,
        };
      }),
    };
    await ScrCom0025RegistUpdateEmployee(request);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 一括反映ボタンのイベントハンドラ
   */
  const handleIkkatsuHaneiClick = () => {
    const headerRow = headerApiRef.current.getRow(-1);
    const newRows = searchResult.map((x) => {
      if (rowSelectionModel.includes(x.id)) {
        return {
          ...x,
          salesForceId: headerRow.salesForceId,
          organizationId_1: headerRow.organizationId_1,
          postId_1: headerRow.postId_1,
          applyingStartDate_1: headerRow.applyingStartDate_1,
          applyingEndDate_1: headerRow.applyingEndDate_1,
          organizationId_2: headerRow.organizationId_2,
          postId_2: headerRow.postId_2,
          applyingStartDate_2: headerRow.applyingStartDate_2,
          applyingEndDate_2: headerRow.applyingEndDate_2,
          organizationId_3: headerRow.organizationId_3,
          postId_3: headerRow.postId_3,
          applyingStartDate_3: headerRow.applyingStartDate_3,
          applyingEndDate_3: headerRow.applyingEndDate_3,
          organizationId_4: headerRow.organizationId_4,
          postId_4: headerRow.postId_4,
          applyingStartDate_4: headerRow.applyingStartDate_4,
          applyingEndDate_4: headerRow.applyingEndDate_4,
          changeReason: headerRow.changeReason,
        };
      } else {
        return x;
      }
    });
    setSearchResult(newRows);
    setHeaderRow(headerRow);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          {/* 従業員情報一覧 */}
          <Section
            name='従業員情報一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                <AddButton onClick={handleIconAddClick}>追加</AddButton>
              </MarginBox>
            }
            fitInside
          >
            <ThemeProvider theme={theme}>
              <DataGrid
                columns={searchResultColumns}
                columnGroupingModel={columnGroups}
                rows={searchResult}
                controlled={false}
                showHeaderRow
                headerRow={headerRow}
                hrefs={hrefs}
                apiRef={apiRef}
                checkboxSelection
                onLinkClick={handleLinkClick}
                headerApiRef={headerApiRef}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
              />
            </ThemeProvider>
          </Section>
        </MainLayout>
        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {isOpenPopup ? (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          handleRegistConfirm={scrCom00032PopupHandleConfirm}
          handleApprovalConfirm={scrCom00032PopupHandleConfirm}
          handleCancel={handlePopupCancel}
        />
      ) : (
        ''
      )}
    </>
  );
};
export default ScrCom0025EmployeeTab;
