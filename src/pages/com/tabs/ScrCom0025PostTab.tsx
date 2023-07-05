import React, { useState, useContext, useEffect } from 'react';
import { AddButton, CancelButton, ConfirmButton } from 'controls/Button';
import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { SelectValue } from 'controls/Select/Select';
import { useForm } from 'hooks/useForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { generate } from 'utils/validation/BaseYup';
import { useNavigate } from 'react-router-dom';
import { Stack } from 'layouts/Stack';
import { TableRowModel } from 'controls/Table';
import { ScrCom0025GetPositionListResponse, getPositionList, ScrCom0025CheckPostRequest, ScrCom0025PostInfoCheck, ScrCom0025RegistUpdatePostRequest, ScrCom0025RegistUpdatePost } from 'apis/com/ScrCom0025Api';
import { ScrCom9999GetOrganizationidListboxRequest, ScrCom9999GetOrganizationidListbox, ScrCom9999GetOrganizationidListboxResponse, ScrCom9999GetScreenpermissionidListboxResponse, ScrCom9999GetScreenpermissionidListbox, ScrCom9999GetMasterpermissionidListbox, ScrCom9999GetMasterpermissionidListboxResponse, ScrCom9999GetApprovalPermissionIdListbox, ScrCom9999GetApprovalPermissionIdListboxResponse } from 'apis/com/ScrCom9999Api';
import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032';
import { AppContext } from 'providers/AppContextProvider';

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
  changeTimestamp: Date;
};

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
  changeTimestamp: new Date(),
};

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
    field: 'screenPermissionName',
    headerName: '画面権限',
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
    field: 'masterPermissionName',
    headerName: 'マスタ権限',
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
    field: 'approvalPermissionName',
    headerName: '承認権限',
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
    field: 'applyingStartDate',
    headerName: '適用開始日',
    size: 'm',
    cellType: 'datepicker',
  },
  {
    field: 'applyingEndDate',
    headerName: '適用終了日',
    headerAlign: 'center',
    size: 'm',
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
  response: ScrCom9999GetMasterpermissionidListboxResponse
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
  response: ScrCom9999GetApprovalPermissionIdListboxResponse
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
const validationSchama = generate([
  'organizationId',
  'organizationName',
  'parentOrganizationId',
  'organizationClassName',
  'applyingStartDate',
  'applyingEndDate',
  'changeReason',
]);

/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  changedSections: [],
  errorMessages: [],
  warningMessages: [],
};

/**
 * SCR-COM-0025-0002 役職情報一覧タブ
 */
const ScrCom0025PostTab = () => {

  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);

  // router
  const navigate = useNavigate();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );

  // user情報(businessDateも併せて取得)
  const { appContext } = useContext(AppContext);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<SearchResultRowModel>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchama),
    context: isReadOnly,
  });
  const {
    formState: { dirtyFields, errors },
  } = methods;

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);

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
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
      };
      const organizationidResponse = await ScrCom9999GetOrganizationidListbox(organizationidRequest);

      // API-COM-9999-0004: 画面権限ID情報取得API
      const screenpermissionidResponse = await ScrCom9999GetScreenpermissionidListbox(null);

      // API-COM-9999-0005: マスタ権限ID情報取得API
      const masterpermissionidResponse = await ScrCom9999GetMasterpermissionidListbox(null);

      // API-COM-9999-0006: 承認権限ID情報取得API
      const approvalPermissionIdResponse = await ScrCom9999GetApprovalPermissionIdListbox(null);

      setSelectValues({
        // 組織ID
        organizationidSelectValues: organizationidSelectValuesModel(organizationidResponse),
        // 画面権限ID
        screenpermissionidSelectValues: screenpermissionidSelectValuesModel(screenpermissionidResponse),
        // マスタ権限ID
        masterpermissionidSelectValues: masterpermissionidSelectValuesModel(masterpermissionidResponse),
        // 承認権限ID
        approvalPermissionIdSelectValues: approvalPermissionIdSelectValuesModel(approvalPermissionIdResponse),
      });
    };
    initialize();
  }, []);

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    // TODO：新規作成用URI決定後に変更
    navigate('/com/organization#post/');
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
    // 役職情報入力チェック
    searchResult.map((x) => {
      // TODO：適用開始日 < 業務日付チェック
      if (x.applyingStartDate < appContext.user) { // TODO:業務日付が実装されるまで暫定
        alert('TODO:MSG-FR-ERR-00020のエラーメッセージを表示予定')
        return;
      }

      // TODO：適用開始日と適用終了日チェック
      if (x.applyingStartDate > x.applyingEndDate) {
        alert('TODO:MSG-FR-ERR-00021のエラーメッセージを表示予定')
        return;
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
          businessDate: new Date(),// TODO:業務日付取得方法実装待ち、new Date()で登録
        }
      })
    };
    const checkResult = await ScrCom0025PostInfoCheck(request);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      changedSections: convertToChngedSections(dirtyFields),
      errorMessages: checkResult.errorMessages,
      warningMessages: checkResult.warningMessages,
    });
  }

  /**
 * ポップアップの確定ボタンクリック時のイベントハンドラ
 */
  const handlePopupConfirm = async () => {
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
          userId: appContext.user,
          afterTimestamp: new Date(),// TODO:業務日付取得方法実装待ち、new Date()で登録
          beforeTimestamp: x.changeTimestamp,// TODO:業務日付取得方法実装待ち、new Date()で登録
        }
      })
    };
    await ScrCom0025RegistUpdatePost(request);
  };

  /**
  * キャンセルボタンクリック時のイベントハンドラ
  */
  const handleCancel = () => {
    navigate('/com/organization#post');
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
              rows={searchResult}
              pageSize={10}
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
export default ScrCom0025PostTab;