import React, { useState, useContext, useEffect } from 'react';
import { AddButton, CancelButton, ConfirmButton } from 'controls/Button';
import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { GridColumnGroupingModel } from '@mui/x-data-grid-pro'
import { useNavigate } from 'hooks/useNavigate';
import { Select, SelectValue } from 'controls/Select/Select';
import { Stack } from 'layouts/Stack';
import { TableRowModel } from 'controls/Table';
import { ScrCom0025GetEmployeeListResponse, getEmployeeList, ScrCom0025CheckEmployeeRequest, ScrCom0025EmployeeInfoCheck, ScrCom0025RegistUpdateEmployeeRequest, ScrCom0025RegistUpdateEmployee } from 'apis/com/ScrCom0025Api';
import { ScrCom9999GetBelongOrganizationIdListbox, ScrCom9999GetBelongOrganizationIdListboxResponse, ScrCom9999GetPostIdListbox, ScrCom9999GetPostIdListboxResponse } from 'apis/com/ScrCom9999Api';
import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032';
import { AppContext } from 'providers/AppContextProvider';

/**
 * 従業員情報一覧結果行データモデル
 */
interface SearchResultRowModel {
  // 項目内Id(hrefs)
  id: string;
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
  beforeTimestamp: Date;
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
  // 画面権限名_1
  screenPermissionName_1: string;
  // マスタ権限ID_1
  masterPermissionId_1: string;
  // マスタ権限名_1
  masterPermissionName_1: string;
  // 承認権限ID_1
  approvalPermissionId_1: string;
  // 承認権限名_1
  approvalPermissionName_1: string;
  // 適用開始日_1
  applyingStartDate_1: string;
  // 適用終了日_1
  applyingEndDate_1: string;
  // 変更タイムスタンプ_1
  beforeTimestamp_1: Date;
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
  // 画面権限名_2
  screenPermissionName_2: string;
  // マスタ権限ID_2
  masterPermissionId_2: string;
  // マスタ権限名_2
  masterPermissionName_2: string;
  // 承認権限ID_2
  approvalPermissionId_2: string;
  // 承認権限名_2
  approvalPermissionName_2: string;
  // 適用開始日_2
  applyingStartDate_2: string;
  // 適用終了日_2
  applyingEndDate_2: string;
  // 変更タイムスタンプ_2
  beforeTimestamp_2: Date;
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
  // 画面権限名_3
  screenPermissionName_3: string;
  // マスタ権限ID_3
  masterPermissionId_3: string;
  // マスタ権限名_3
  masterPermissionName_3: string;
  // 承認権限ID_3
  approvalPermissionId_3: string;
  // 承認権限名_3
  approvalPermissionName_3: string;
  // 適用開始日_3
  applyingStartDate_3: string;
  // 適用終了日_3
  applyingEndDate_3: string;
  // 変更タイムスタンプ_3
  beforeTimestamp_3: Date;
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
  // 画面権限名_4
  screenPermissionName_4: string;
  // マスタ権限ID_4
  masterPermissionId_4: string;
  // マスタ権限名_4
  masterPermissionName_4: string;
  // 承認権限ID_4
  approvalPermissionId_4: string;
  // 承認権限名_4
  approvalPermissionName_4: string;
  // 適用開始日_4
  applyingStartDate_4: string;
  // 適用終了日_4
  applyingEndDate_4: string;
  // 変更タイムスタンプ_4
  beforeTimestamp_4: Date;
};

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
 * 検索条件列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'employeeId',
    headerName: '従業員ID',
    headerAlign: 'center',
    size: 's',
  },
  {
    field: 'employeeName',
    headerName: '従業員名（漢字）',
    headerAlign: 'center',
    size: 'm',
  },
  {
    field: 'employeeMailAddress',
    headerName: 'メールアドレス',
    headerAlign: 'center',
    size: 'l',
  },
  {
    field: 'belong',
    headerName: '所属',
    headerAlign: 'center',
    size: 'm',
  },
  {
    field: 'salesForceId',
    headerName: 'SFID',
    headerAlign: 'center',
    size: 'm',
    cellType: 'input'
  },
  {
    field: 'organizationId_1',
    headerName: '組織ID/名称',
    headerAlign: 'center',
    size: 'm',
    cellType: 'select',
    // TODO: selectValues設定の実装待ち
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
  },
  {
    field: 'postId_1',
    headerName: '役職ID/名称',
    headerAlign: 'center',
    size: 'm',
    cellType: 'select',
    // TODO: selectValues設定の実装待ち
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
  },
  {
    field: 'applyingStartDate_1',
    headerName: '適用開始日',
    headerAlign: 'center',
    size: 'm',
    cellType: 'datepicker',
  },
  {
    field: 'applyingEndDate_1',
    headerName: '適用終了日',
    headerAlign: 'center',
    size: 'm',
    cellType: 'datepicker',
  },
  {
    field: 'organizationId_2',
    headerName: '組織ID/名称',
    headerAlign: 'center',
    size: 'm',
    cellType: 'select',
    // TODO: selectValues設定の実装待ち
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
  },
  {
    field: 'postId_2',
    headerName: '役職ID/名称',
    headerAlign: 'center',
    size: 'm',
    cellType: 'select',
    // TODO: selectValues設定の実装待ち
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
  },
  {
    field: 'applyingStartDate_2',
    headerName: '適用開始日',
    headerAlign: 'center',
    size: 'm',
    cellType: 'datepicker',
  },
  {
    field: 'applyingEndDate_2',
    headerName: '適用終了日',
    headerAlign: 'center',
    size: 'm',
    cellType: 'datepicker',
  },
  {
    field: 'organizationId_3',
    headerName: '組織ID/名称',
    headerAlign: 'center',
    size: 'm',
    cellType: 'select',
    // TODO: selectValues設定の実装待ち
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
  },
  {
    field: 'postId_3',
    headerName: '役職ID/名称',
    headerAlign: 'center',
    size: 'm',
    cellType: 'select',
    // TODO: selectValues設定の実装待ち
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
  },
  {
    field: 'applyingStartDate_3',
    headerName: '適用開始日',
    headerAlign: 'center',
    size: 'm',
    cellType: 'datepicker',
  },
  {
    field: 'applyingEndDate_3',
    headerName: '適用終了日',
    headerAlign: 'center',
    size: 'm',
    cellType: 'datepicker',
  },
  {
    field: 'organizationId_4',
    headerName: '組織ID/名称',
    headerAlign: 'center',
    size: 'm',
    cellType: 'select',
    // TODO: selectValues設定の実装待ち
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
  },
  {
    field: 'postId_4',
    headerName: '役職ID/名称',
    headerAlign: 'center',
    size: 'm',
    cellType: 'select',
    // TODO: selectValues設定の実装待ち
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
  },
  {
    field: 'applyingStartDate_4',
    headerName: '適用開始日',
    headerAlign: 'center',
    size: 'm',
    cellType: 'datepicker',
  },
  {
    field: 'applyingEndDate_4',
    headerName: '適用終了日',
    headerAlign: 'center',
    size: 'm',
    cellType: 'datepicker',
  },
  {
    field: 'screenPermissionName_1',
    headerName: '画面権限',
    headerAlign: 'center',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'masterPermissionName_1',
    headerName: 'マスタ権限',
    headerAlign: 'center',
    size: 'm',
    //cellType: 'link',
  },
  {
    field: 'approvalPermissionName_1',
    headerName: '承認権限',
    headerAlign: 'center',
    size: 'm',
    //cellType: 'link',
  },
  {
    field: 'changeReason',
    headerName: '変更理由',
    headerAlign: 'center',
    size: 'l',
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
  }, {
    groupId: '組織2',
    headerAlign: 'center',
    children: [
      { field: 'organizationId_2' },
      { field: 'postId_2' },
      { field: 'applyingStartDate_2' },
      { field: 'applyingEndDate_2' },
    ],
  }, {
    groupId: '組織3',
    headerAlign: 'center',
    children: [
      { field: 'organizationId_3' },
      { field: 'postId_3' },
      { field: 'applyingStartDate_3' },
      { field: 'applyingEndDate_3' },
    ],
  }, {
    groupId: '組織4',
    headerAlign: 'center',
    children: [
      { field: 'organizationId_4' },
      { field: 'postId_4' },
      { field: 'applyingStartDate_4' },
      { field: 'applyingEndDate_4' },
    ],
  },
]

/**
 * 従業員情報一覧結果情報取得APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0025GetEmployeeListResponse
): SearchResultRowModel[] => {
  return response.searchEmployeeListResult.map((x) => {
    return {
      id: x.employeeId,
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
      screenPermissionId_1: x.screenPermissionId_1,
      screenPermissionName_1: x.screenPermissionName_1,
      masterPermissionId_1: x.masterPermissionId_1,
      masterPermissionName_1: x.masterPermissionName_1,
      approvalPermissionId_1: x.approvalPermissionId_1,
      approvalPermissionName_1: x.approvalPermissionName_1,
      applyingStartDate_1: x.applyingStartDate_1,
      applyingEndDate_1: x.applyingEndDate_1,
      beforeTimestamp_1: x.beforeTimestamp_1,
      organizationId_2: x.organizationId_2,
      organizationName_2: x.organizationName_2,
      postId_2: x.postId_2,
      postName_2: x.postName_2,
      screenPermissionId_2: x.screenPermissionId_2,
      screenPermissionName_2: x.screenPermissionName_2,
      masterPermissionId_2: x.masterPermissionId_2,
      masterPermissionName_2: x.masterPermissionName_2,
      approvalPermissionId_2: x.approvalPermissionId_2,
      approvalPermissionName_2: x.approvalPermissionName_2,
      applyingStartDate_2: x.applyingStartDate_2,
      applyingEndDate_2: x.applyingEndDate_2,
      beforeTimestamp_2: x.beforeTimestamp_2,
      organizationId_3: x.organizationId_3,
      organizationName_3: x.organizationName_3,
      postId_3: x.postId_3,
      postName_3: x.postName_3,
      screenPermissionId_3: x.screenPermissionId_3,
      screenPermissionName_3: x.screenPermissionName_3,
      masterPermissionId_3: x.masterPermissionId_3,
      masterPermissionName_3: x.masterPermissionName_3,
      approvalPermissionId_3: x.approvalPermissionId_3,
      approvalPermissionName_3: x.approvalPermissionName_3,
      applyingStartDate_3: x.applyingStartDate_3,
      applyingEndDate_3: x.applyingEndDate_3,
      beforeTimestamp_3: x.beforeTimestamp_3,
      organizationId_4: x.organizationId_4,
      organizationName_4: x.organizationName_4,
      postId_4: x.postId_4,
      postName_4: x.postName_4,
      screenPermissionId_4: x.screenPermissionId_4,
      screenPermissionName_4: x.screenPermissionName_4,
      masterPermissionId_4: x.masterPermissionId_4,
      masterPermissionName_4: x.masterPermissionName_4,
      approvalPermissionId_4: x.approvalPermissionId_4,
      approvalPermissionName_4: x.approvalPermissionName_4,
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
  response: ScrCom9999GetBelongOrganizationIdListboxResponse
): SelectValue[] => {
  return response.searchGetBelongOrganizationIdListbox.map((x) => {
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
  response: ScrCom9999GetPostIdListboxResponse
): SelectValue[] => {
  return response.searchGetPostIdListbox.map((x) => {
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
  changedSections: [],
  errorMessages: [],
  warningMessages: [],
};

/**
 * SCR-COM-0025-0003 従業員情報一覧タブ
 */
const ScrCom0025EmployeeTab = () => {

  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [changeBeforeResult, setChangeBeforeResult] = useState<any[]>([]);
  const [hrefs, setHrefs] = useState<any[]>([]);
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );

  // router
  const navigate = useNavigate();

  // user情報(businessDateも併せて取得)
  const { appContext } = useContext(AppContext);

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
      const hrefs = searchResult.map((x) => {
        return {
          field: 'screenPermissionName_1',
          id: x.id,
          href: x.screenPermissionId_1,
        };
      });
      searchResult.map((x) => {
        hrefs.push({
          field: 'masterPermissionName_1',
          id: x.id,
          href: x.masterPermissionId_1,
        });
      });
      searchResult.map((x) => {
        hrefs.push({
          field: 'approvalPermissionName_1',
          id: x.id,
          href: x.approvalPermissionId_1,
        });
      });
      setSearchResult(searchResult);
      setChangeBeforeResult(searchResult);
      setHrefs(hrefs);

      // API-COM-9999-0007: 所属組織IDリストボックス情報取得API
      const belongOrganizationIdResponse = await ScrCom9999GetBelongOrganizationIdListbox(null);

      // API-COM-9999-0008: 所属役職IDリストボックス情報取得API
      const postIdResponse = await ScrCom9999GetPostIdListbox(null);

      setSelectValues({
        // 所属組織ID
        belongOrganizationIdSelectValues: belongOrganizationIdSelectValuesModel(belongOrganizationIdResponse),
        // 所属役職ID
        postIdSelectValues: postIdSelectValuesModel(postIdResponse),
      });
    };
    initialize();
  }, []);

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    // TODO：新規作成用URI決定後に変更
    alert('TODO:行の新規作成用');
  };

  /**
   * 一括登録アイコンクリック時のイベントハンドラ
   */
  const handleIconRegistUpdateClick = () => {
    // TODO：一括登録機能実装後に変更
    alert('TODO:入力結果情報を元に一括登録する。');
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    // TODO：CSV機能実装後に変更
    alert('TODO:結果からCSVを出力する。');
  };

  /**
    * リンククリック時のイベントハンドラ
    */
  const handleLinkClick = (url: string) => {
    // 別タブで表示
    navigate(url, true);
  }

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
        'userId',
        'afterTimestamp',
        'beforeTimestamp',

      ],
    },
  ];

  /**
* 変更した項目から登録・変更内容データへの変換
*/
  const convertToChngedSections = (dirtyFields: object): TableRowModel[] => {
    const fields = Object.keys(dirtyFields);
    const changedSections: TableRowModel[] = [];
    sectionDef.forEach((d) => {
      fields.forEach((f) => {
        if (d.fields.includes(f)) {
          changedSections.push({
            変更種類: '基本情報変更',
            セクション名: d.section,
          });
        }
      });
    });
    return changedSections;
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    // TODO: 従業員情報入力チェック
    searchResult.map((x, y) => {
      // 適用開始日 < 業務日付チェック
      if (x.applyingStartDate_1 < appContext.user || x.applyingStartDate_2 < appContext.user || x.applyingStartDate_3 < appContext.user || x.applyingStartDate_4 < appContext.user) { // TODO:業務日付が実装されるまで暫定
        alert('TODO:MSG-FR-ERR-00024のエラーメッセージを表示予定');
        return;
      }
      // 適用開始日と適用終了日チェック
      if (x.applyingStartDate_1 > x.applyingEndDate_1 || x.applyingStartDate_2 > x.applyingEndDate_2 || x.applyingStartDate_3 > x.applyingEndDate_3 || x.applyingStartDate_4 > x.applyingEndDate_4) {
        alert('TODO:MSG-FR-ERR-00025のエラーメッセージを表示予定');
        return;
      }
      // 従業員ID重複チェック
      if (x.employeeId === changeBeforeResult[y].employeeId) {
        alert('TODO:MSG-FR-ERR-00026のエラーメッセージを表示予定');
        return;
      }
      // SFIDチェック
      if (x.salesForceId != changeBeforeResult[y].salesForceId) {
        if (x.employeeId != changeBeforeResult[y].employeeId && x.salesForceId === changeBeforeResult[y].salesForceId) {
          alert('TODO:MSG-FR-ERR-00028のエラーメッセージを表示予定');
          return;
        }
      }
      // 組織IDチェック
      if (x.organizationId_1 === undefined && x.organizationName_1 === undefined && x.organizationId_2 === undefined && x.organizationName_2 === undefined && x.organizationId_3 === undefined && x.organizationName_3 === undefined && x.organizationId_4 === undefined && x.organizationName_4 === undefined) {
        alert('TODO:MSG-FR-ERR-00029のエラーメッセージを表示予定');
        return;
      }
      // 組織1、役職IDチェック
      if (x.organizationId_1 != undefined && x.organizationName_1 != undefined) {
        if ((x.postId_1 === undefined && x.postName_1 === undefined) || (x.applyingStartDate_1 === undefined)) {
          alert('TODO:MSG-FR-ERR-00030のエラーメッセージを表示予定');
          return;
        }
      }
    });

    //SCR-COM-0025-0009: 従業員情報入力チェックAPI
    const request = {
      checkEmployeeList: searchResult.map((x) => {
        return {
          employeeId: x.employeeId
        }
      })
    };
    const checkResult = await ScrCom0025EmployeeInfoCheck(request);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      changedSections: convertToChngedSections(searchResult),
      errorMessages: checkResult.errorMessages,
      warningMessages: checkResult.warningMessages,
    });
  }

  /**
 * ポップアップの確定ボタンクリック時のイベントハンドラ
 */
  const handlePopupConfirm = async () => {
    setIsOpenPopup(false);

    // SCR-COM-0025-0010: 従業員情報登録更新API
    const request = {
      registUpdateEmployeeList: searchResult.map((x) => {
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
          userId: appContext.user,
          afterTimestamp: new Date(),// TODO:業務日付取得方法実装待ち、new Date()で登録
        }
      })
    };
    await ScrCom0025RegistUpdateEmployee(request);
  };

  /**
  * キャンセルボタンクリック時のイベントハンドラ
  */
  const handleCancel = () => {
    navigate('/com/organization#employee');
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
          {/* 従業員情報一覧 */}
          <Section
            name='従業員情報一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                {/* TODO：エクスポートアイコンに将来的に変更 */}
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
                <AddButton onClick={handleIconRegistUpdateClick}>一括登録</AddButton>
                <AddButton onClick={handleIconAddClick}>追加</AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={searchResultColumns}
              columnGroupingModel={columnGroups}
              rows={searchResult}
              hrefs={hrefs}
              pageSize={10}
              checkboxSelection
              onLinkClick={handleLinkClick}
            />
          </Section>
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
export default ScrCom0025EmployeeTab;