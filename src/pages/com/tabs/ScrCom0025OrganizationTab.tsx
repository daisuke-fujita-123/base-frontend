import React, { useState, useContext, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { AddButton, CancelButton, ConfirmButton } from 'controls/Button';
import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { yupResolver } from '@hookform/resolvers/yup';
import { generate } from 'utils/validation/BaseYup';
import { SelectValue } from 'controls/Select/Select';
import { useForm } from 'hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { Stack } from 'layouts/Stack';
import { TableRowModel } from 'controls/Table';
import { ScrCom0025GetOrganizationListResponse, getOrganizationList, ScrCom0025OrganizationInfoCheck, ScrCom0025RegistUpdateOrganization } from 'apis/com/ScrCom0025Api';
import { ScrCom9999GetParentorganizationidListboxRequest, ScrCom9999GetParentorganizationidListbox, ScrCom9999GetParentorganizationidListboxResponse } from 'apis/com/ScrCom9999Api';
import ScrCom0032Popup, {
  ScrCom0032PopupModel
} from 'pages/com/popups/ScrCom0032';
import { AppContext } from 'providers/AppContextProvider';

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
  changeTimestamp: Date;
};

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
  changeTimestamp: new Date(),
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
  businessDate: Date;
};

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
    size: 'l',
    cellType: 'input',
  },
  {
    field: 'parentOrganizationId',
    headerName: '親ID',
    headerAlign: 'center',
    size: 'ss',
    cellType: 'select',
    // TODO: selectValues設定の実装待ち
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
  },
  {
    field: 'organizationClassName',
    headerName: '部署階層名称',
    headerAlign: 'center',
    size: 'l',
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
 * SCR-COM-0025 組織管理画面
 */
const ScrCom0025OrganizationTab = () => {

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
      const response = await getOrganizationList(null);
      const searchResult = convertToSearchResultRowModel(response);
      setSearchResult(searchResult);

      // SCR-COM-9999-0002: 親組織ID情報取得API
      const parentorganizationidRequest: ScrCom9999GetParentorganizationidListboxRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
      };
      const parentorganizationidResponse = await ScrCom9999GetParentorganizationidListbox(parentorganizationidRequest);

      setSelectValues({
        parentorganizationidSelectValues: parentorganizationidSelectValuesModel(parentorganizationidResponse),
      });
    };
    initialize();
  }, []);

  /**
   * 追加アイコンクリック時のイベントハンドラ
   */
  const handleIconAddClick = () => {
    // TODO：新規作成用URI決定後に変更
    navigate('/com/organization/');
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
      section: '組織情報一覧',
      fields: [
        'organizationId',
        'organizationName',
        'parentOrganizationId',
        'stateStaffFlag',
        'inspectorFlag',
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
    searchResult.map((x) => {
      // TODO：適用開始日 < 業務日付チェック
      if (x.applyingStartDate < appContext.user) { // TODO:業務日付が実装されるまで暫定
        alert('TODO:MSG-FR-ERR-00016のエラーメッセージを表示予定')
        return;
      }

      // TODO：適用開始日と適用終了日チェック
      if (x.applyingStartDate > x.applyingEndDate) {
        alert('TODO:MSG-FR-ERR-00017のエラーメッセージを表示予定')
        return;
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
          businessDate: new Date(),// TODO:業務日付取得方法実装待ち、new Date()で登録
        }
      })
    };
    const checkResult = await ScrCom0025OrganizationInfoCheck(request);

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
          userId: appContext.user,
          afterTimestamp: new Date(),// TODO:業務日付取得方法実装待ち、new Date()で登録
          beforeTimestamp: x.changeTimestamp,// TODO:業務日付取得方法実装待ち、new Date()で登録
        }
      })
    };
    await ScrCom0025RegistUpdateOrganization(request);
  };

  /**
  * キャンセルボタンクリック時のイベントハンドラ
  */
  const handleCancel = () => {
    navigate('/com/organization');
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

export default ScrCom0025OrganizationTab;