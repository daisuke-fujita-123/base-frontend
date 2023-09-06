import React, { useContext, useEffect, useState } from 'react';

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
  getPositionList,
  ScrCom0025GetPositionListResponse,
  ScrCom0025PostInfoCheck,
  ScrCom0025RegistUpdatePost,
} from 'apis/com/ScrCom0025Api';
import {
  ScrCom9999GetApprovalPermissionId,
  ScrCom9999GetApprovalPermissionIdResponse,
  ScrCom9999GetMasterpermissionid,
  ScrCom9999GetMasterpermissionidResponse,
  ScrCom9999GetOrganizationidListbox,
  ScrCom9999GetOrganizationidListboxRequest,
  ScrCom9999GetOrganizationidListboxResponse,
  ScrCom9999GetScreenpermissionidListbox,
  ScrCom9999GetScreenpermissionidListboxResponse,
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';

import { AuthContext } from 'providers/AuthProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 役職情報一覧結果行データモデル
 */
interface SearchResultRowModel {
  // 項目内Id(hrefs)
  id: string;
  // 役職ID
  postId: string;
  // 役職名
  postName: string;
  // 組織ID
  organizationId: string;
  // 部署名称
  organizationname: string;
  // 画面権限ID
  screenPermissionId: string;
  // 画面権限名
  screenPermissionName: string;
  // マスタ権限ID
  masterPermissionId: string;
  // マスタ権限名
  masterPermissionName: string;
  // 承認権限ID
  approvalPermissionId: string;
  // 承認権限名
  approvalPermissionName: string;
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
  // 役職ID
  postId: '',
  // 役職名
  postName: '',
  // 組織ID
  organizationId: '',
  // 部署名称
  organizationname: '',
  // 画面権限ID
  screenPermissionId: '',
  // 画面権限名
  screenPermissionName: '',
  // マスタ権限ID
  masterPermissionId: '',
  // マスタ権限名
  masterPermissionName: '',
  // 承認権限ID
  approvalPermissionId: '',
  // 承認権限名
  approvalPermissionName: '',
  // 適用開始日
  applyingStartDate: '',
  // 適用終了日
  applyingEndDate: '',
  // 変更理由
  changeReason: '',
  // 変更タイムスタンプ
  changeTimestamp: '',
};

interface ErrorList {
  errorCode: string;
  errorMessage: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 親組織ID
  organizationidSelectValues: SelectValue[];
  screenpermissionidSelectValues: SelectValue[];
  masterpermissionidSelectValues: SelectValue[];
  approvalPermissionIdSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 親組織ID
  organizationidSelectValues: [],
  screenpermissionidSelectValues: [],
  masterpermissionidSelectValues: [],
  approvalPermissionIdSelectValues: [],
};

/**
 * 取込対象選択データ
 */
const allRegistrationDefinitions: ScrCom0035PopupAllRegistrationDefinitionModel[] =
  [{ id: 'BRG-COM-0003', label: '役職情報' }];

/**
 * 役職情報一覧結果情報取得APIレスポンスから検索結果モデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0025GetPositionListResponse
): SearchResultRowModel[] => {
  return response.searchPositionListResult.map((x) => {
    return {
      id: x.id,
      postId: x.postId,
      postName: x.postName,
      organizationId: x.organizationId,
      organizationname: x.organizationname,
      screenPermissionId: x.screenPermissionId,
      screenPermissionName: x.screenPermissionName,
      masterPermissionId: x.masterPermissionId,
      masterPermissionName: x.masterPermissionName,
      approvalPermissionId: x.approvalPermissionId,
      approvalPermissionName: x.approvalPermissionName,
      applyingStartDate: x.applyingStartDate,
      applyingEndDate: x.applyingEndDate,
      changeReason: x.changeReason,
      changeTimestamp: x.changeTimestamp,
    };
  });
};

/**
 * 組織ID情報取得APIレスポンスからへの変換
 */
const organizationidSelectValuesModel = (
  response: ScrCom9999GetOrganizationidListboxResponse
): SelectValue[] => {
  return response.searchGetOrganizationidListbox.map((x) => {
    return {
      value: x.organizationId,
      displayValue: x.organizationName,
    };
  });
};

/**
 * 画面権限ID情報取得APIレスポンスからへの変換
 */
const screenpermissionidSelectValuesModel = (
  response: ScrCom9999GetScreenpermissionidListboxResponse
): SelectValue[] => {
  return response.searchGetScreenpermissionidListbox.map((x) => {
    return {
      value: x.screenPermissionId,
      displayValue: x.screenPermissionName,
    };
  });
};

/**
 * マスター権限ID情報取得APIレスポンスからへの変換
 */
const masterpermissionidSelectValuesModel = (
  response: ScrCom9999GetMasterpermissionidResponse
): SelectValue[] => {
  return response.searchGetMasterpermissionidListbox.map((x) => {
    return {
      value: x.masterPermissionId,
      displayValue: x.masterPermissionName,
    };
  });
};

/**
 * 承認権限ID情報取得APIレスポンスからへの変換
 */
const approvalPermissionIdSelectValuesModel = (
  response: ScrCom9999GetApprovalPermissionIdResponse
): SelectValue[] => {
  return response.searchGetApprovalPermissionIdListbox.map((x) => {
    return {
      value: x.approvalPermissionId,
      displayValue: x.approvalPermissionName,
    };
  });
};

/**
 * バリデーションスキーマ
 */
const validationSchama = {
  organizationName: yup.string().label('役職名').max(30).required(),
  organizationClassName: yup.string().label('所属組織').max(30).required(),
  applyingStartDate: yup.date().label('適用開始日').required(),
  applyingEndDate: yup.date().label('適用終了日'),
  changeReason: yup.string().label('変更理由').max(10),
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
 * SCR-COM-0025-0002 役職情報一覧タブ
 */
const ScrCom0025PostTab = () => {
  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const apiRef = useGridApiRef();
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [scrCom0035PopupIsOpen, setScrCom0035PopupIsOpen] =
    useState<boolean>(false);

  // user情報(businessDateも併せて取得)
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

  /**
   * 検索条件列定義
   */
  const searchResultColumns: GridColDef[] = [
    {
      field: 'postId',
      headerName: '役職ID',
      headerAlign: 'center',
      size: 'ss',
    },
    {
      field: 'postName',
      headerName: '役職名',
      headerAlign: 'center',
      size: 'l',
      cellType: 'input',
    },
    {
      field: 'organizationname',
      headerName: '所属組織',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.organizationidSelectValues,
    },
    {
      field: 'screenPermissionName',
      headerName: '画面権限',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.screenpermissionidSelectValues,
    },
    {
      field: 'masterPermissionName',
      headerName: 'マスタ権限',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.masterpermissionidSelectValues,
    },
    {
      field: 'approvalPermissionName',
      headerName: '承認権限',
      headerAlign: 'center',
      size: 'l',
      cellType: 'select',
      selectValues: selectValues.approvalPermissionIdSelectValues,
    },
    {
      field: 'applyingStartDate',
      headerName: '適用開始日',
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
      size: 'l',
      cellType: 'input',
    },
  ];

  /**
   * 初期画面表示時に処理結果一覧検索処理を実行
   */
  useEffect(() => {
    const initialize = async () => {
      const response = await getPositionList(null);
      const searchResult = convertToSearchResultRowModel(response);
      setSearchResult(searchResult);

      // API-COM-9999-0003: 組織ID情報取得API
      const organizationidRequest: ScrCom9999GetOrganizationidListboxRequest = {
        // 業務日付
        businessDate: user.taskDate,
      };
      const organizationidResponse = await ScrCom9999GetOrganizationidListbox(
        organizationidRequest
      );

      // API-COM-9999-0004: 画面権限ID情報取得API
      const screenpermissionidResponse =
        await ScrCom9999GetScreenpermissionidListbox(null);

      // API-COM-9999-0005: マスタ権限ID情報取得API
      const masterpermissionidResponse = await ScrCom9999GetMasterpermissionid(
        null
      );

      // API-COM-9999-0006: 承認権限ID情報取得API
      const approvalPermissionIdResponse =
        await ScrCom9999GetApprovalPermissionId(null);

      setSelectValues({
        // 組織ID
        organizationidSelectValues: organizationidSelectValuesModel(
          organizationidResponse
        ),
        // 画面権限ID
        screenpermissionidSelectValues: screenpermissionidSelectValuesModel(
          screenpermissionidResponse
        ),
        // マスタ権限ID
        masterpermissionidSelectValues: masterpermissionidSelectValuesModel(
          masterpermissionidResponse
        ),
        // 承認権限ID
        approvalPermissionIdSelectValues: approvalPermissionIdSelectValuesModel(
          approvalPermissionIdResponse
        ),
      });
    };
    initialize();
  }, [user.taskDate]);

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    const id = searchResult.length;

    const addRows = [
      ...searchResult,
      {
        id: id.toString(),
        postId: '',
        postName: '',
        organizationId: '',
        organizationname: '',
        screenPermissionId: '',
        screenPermissionName: '',
        masterPermissionId: '',
        masterPermissionName: '',
        approvalPermissionId: '',
        approvalPermissionName: '',
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
      '役職情報_' +
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
      section: '役職情報一覧',
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
        '役職ID',
        '役職名',
        '所属組織',
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
    // 役職情報入力チェック
    const errList: ErrorList[] = [];
    searchResult.map((x) => {
      // 適用開始日 < 業務日付チェック
      if (x.applyingStartDate < user.taskDate) {
        errList.push({
          errorCode: 'MSG-FR-ERR-00020',
          errorMessage:
            '役職ID「' + x.postId + '」の適用開始日が正しくありません。',
        });
      }

      // 適用開始日と適用終了日チェック
      if (x.applyingStartDate > x.applyingEndDate) {
        errList.push({
          errorCode: 'MSG-FR-ERR-00021',
          errorMessage: '役職ID「' + x.postId + '」の期間に誤りがあります。',
        });
      }
    });

    //SCR-COM-0025-0007: 役職情報入力チェックAPI
    const request = {
      checkPostList: searchResult.map((x) => {
        return {
          postId: x.postId,
          postName: x.postName,
          screenPermissionId: x.screenPermissionId,
          masterPermissionId: x.masterPermissionId,
          approvalPermissionId: x.approvalPermissionId,
          applyingStartDate: x.applyingStartDate,
          applyingEndDate: x.applyingEndDate,
          businessDate: user.taskDate,
        };
      }),
    };
    const checkResult = await ScrCom0025PostInfoCheck(request);

    errList.concat(checkResult.errorList);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setScrCom0032PopupData({
      errorList: errList,
      warningList: [],
      registrationChangeList: [
        {
          screenId: 'SCR-COM-0025',
          screenName: '組織管理',
          tabId: 2,
          tabName: '役職情報',
          sectionList: convertToChngedSections(dirtyFields),
        },
      ],
      changeExpectDate: '',
    });
    setIsOpenPopup(true);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const scrCom00032PopupHandleConfirm = async () => {
    setIsOpenPopup(false);

    // SCR-COM-0025-0008: 役職情報登録更新API
    const request = {
      registUpdatePostList: searchResult.map((x) => {
        return {
          postId: x.postId,
          postName: x.postName,
          screenPermissionId: x.screenPermissionId,
          masterPermissionId: x.masterPermissionId,
          approvalPermissionId: x.approvalPermissionId,
          applyingStartDate: x.applyingStartDate,
          applyingEndDate: x.applyingEndDate,
          organizationId: x.organizationId,
          changeReason: x.changeReason,
          userId: user.employeeId,
          afterTimestamp: user.taskDate,
          beforeTimestamp: x.changeTimestamp,
        };
      }),
    };
    await ScrCom0025RegistUpdatePost(request);
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
          {/* 役職情報一覧 */}
          <Section
            name='役職情報一覧'
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
            fitInside
          >
            <DataGrid
              columns={searchResultColumns}
              rows={searchResult}
              apiRef={apiRef}
            />
          </Section>
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
export default ScrCom0025PostTab;
