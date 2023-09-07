import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { DataGrid, GridColDef } from 'controls/Datagrid';

import {
  ScrDoc0005ChangeHistoryInfo,
  ScrDoc0005ChangeHistoryInfoResponse,
} from 'apis/doc/ScrDoc0005Api';

import { useForm } from 'hooks/useForm';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * SCR-DOC-0005 書類情報詳細画面変更履歴情報タブ
 */
const initialVal: ScrDoc0005ChangeHistoryInfoResponse = {
  changeHistoryInfo: [],
  unapprovedList: [],
};

// 変更履歴リスト
const showChangeHistoryList: GridColDef[] = [
  {
    field: 'changeHistoryNumber',
    headerName: '申請ID',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'screenName',
    headerName: '申請元画面',
    size: 'm',
  },
  {
    field: 'tabNameAllRegistrationName',
    headerName: 'タブ名/一括登録',
    size: 'm',
  },
  {
    field: 'changeExpectDate',
    headerName: '変更日',
    size: 'm',
  },
  {
    field: 'changeApplicationEmployeeIdName',
    headerName: '申請者ID/申請者名',
    size: 'm',
  },
  {
    field: 'changeApplicationTimestamp',
    headerName: '申請日時',
    size: 'm',
  },
  {
    field: 'registrationChangeMemo',
    headerName: '登録・変更メモ',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'approvalEmployeeIdName',
    headerName: '最終承認者ID/最終承認者名',
    size: 'l',
  },
  {
    field: 'approverComment',
    headerName: '最終承認者コメント',
    size: 'm',
    cellType: 'link',
  },
];
interface ChangeHistoryListModel {
  /** ID */
  id: string;
  /** 変更履歴番号 */
  changeHistoryNumber: number;
  /** 画面名 */
  screenName: string;
  /** タブ名称/一括登録名称 */
  tabNameAllRegistrationName: string;
  /** 変更予定日 */
  changeExpectDate: string;
  /** 変更申請従業員ID/従業員名 */
  changeApplicationEmployeeIdName: string;
  /** 変更申請タイムスタンプ */
  changeApplicationTimestamp: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 承認従業員ID/従業員名 */
  approvalEmployeeIdName: string;
  /** 承認タイムスタンプ */
  approvalTimestamp: string;
  /** 承認者コメント */
  approverComment: string;
}
// 未承認リスト
const showUnapprovedList: GridColDef[] = [
  {
    field: 'changeHistoryNumber',
    headerName: '申請ID',
    cellType: 'link',
    size: 'm',
  },
  {
    field: 'screenName',
    headerName: '申請元画面',
    size: 'm',
  },
  {
    field: 'tabNameAllRegistrationName',
    headerName: 'タブ名/一括登録',
    size: 'm',
  },
  {
    field: 'changeExpectDate',
    headerName: '変更日',
    size: 'm',
  },
  {
    field: 'changeApplicationEmployeeIdName',
    headerName: '申請者ID/申請者名',
    size: 'm',
  },
  {
    field: 'changeApplicationTimestamp',
    headerName: '申請日時',
    size: 'm',
  },
  {
    field: 'registrationChangeMemo',
    headerName: '登録・変更メモ',
    size: 'm',
    cellType: 'link',
  },
  {
    field: 'approvalStatus',
    headerName: '承認ステータス',
    size: 'm',
  },
  {
    field: 'firstApprovalEmployeeIdName',
    headerName: '1次承認者ID/1次承認者名',
    size: 'l',
  },
  {
    field: 'secondApprovalEmployeeIdName',
    headerName: '2次承認者ID/2次承認者名',
    size: 'l',
  },
  {
    field: 'thirdApprovalEmployeeIdName',
    headerName: '3次承認者ID/3次承認者名',
    size: 'l',
  },
  {
    field: 'fourthApprovalEmployeeIdName',
    headerName: '4次承認者ID/4次承認者名',
    size: 'l',
  },
];
interface UnapprovedListModel {
  /** ID */
  id: string;
  /** 変更履歴番号 */
  changeHistoryNumber: number;
  /** 画面名 */
  screenName: string;
  /** タブ名称/一括登録名称 */
  tabNameAllRegistrationName: string;
  /** 変更予定日 */
  changeExpectDate: string;
  /** 変更申請従業員ID/従業員名 */
  changeApplicationEmployeeIdName: string;
  /** 変更申請タイムスタンプ */
  changeApplicationTimestamp: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 承認ステータス */
  approvalStatus: string;
  /** 1次承認設定従業員ID/従業員名 */
  firstApprovalEmployeeIdName: string;
  /** 2次承認設定従業員ID/従業員名 */
  secondApprovalEmployeeIdName: string;
  /** 3次承認設定従業員ID/従業員名 */
  thirdApprovalEmployeeIdName: string;
  /** 4次承認設定従業員ID/従業員名 */
  fourthApprovalEmployeeIdName: string;
}

interface ScrDoc0005ChangeHistory {
  documentBasicsNumber: number;
  allReadOnly: boolean;
}
const ScrDoc0005ChangeHistoryTab = (props: ScrDoc0005ChangeHistory) => {
  const { documentBasicsNumber, allReadOnly } = props;

  // 変更履歴リスト
  const [changeHistoryList, setChangeHistoryList] = useState<
    ChangeHistoryListModel[]
  >([]);
  // 未承認リスト
  const [unapprovedList, setUnapprovedList] = useState<UnapprovedListModel[]>(
    []
  );

  // 初期表示
  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialize = async () => {
    const response = await ScrDoc0005ChangeHistoryInfo({
      documentBasicsNumber: Number(documentBasicsNumber),
    });
    const changeHistoryInfo = convertToChangeHistoryInfoListModel(response);
    setChangeHistoryList(changeHistoryInfo);
    const unapprovedList = convertToUnapprovedInfoListModel(response);
    setUnapprovedList(unapprovedList);
  };

  /**
   * 変更履歴情報取得APIレスポンスから変更履歴リストモデルへの変換
   */
  const convertToChangeHistoryInfoListModel = (
    response: ScrDoc0005ChangeHistoryInfoResponse
  ): ChangeHistoryListModel[] => {
    return response.changeHistoryInfo.map((x) => {
      return {
        id: String(x.changeHistoryNumber),
        tabNameAllRegistrationName: x.tabName + x.allRegistrationName,
        changeApplicationEmployeeIdName:
          x.changeApplicationEmployeeId + x.changeApplicationEmployeeName,
        approvalEmployeeIdName: x.approvalEmployeeId + x.approvalEmployeeName,

        ...x,
      };
    });
  };

  /**
   * 変更履歴情報取得APIレスポンスから未承認リストモデルへの変換
   */
  const convertToUnapprovedInfoListModel = (
    response: ScrDoc0005ChangeHistoryInfoResponse
  ): UnapprovedListModel[] => {
    return response.unapprovedList.map((x) => {
      return {
        id: String(x.changeHistoryNumber),
        tabNameAllRegistrationName: x.tabName + x.allRegistrationName,
        changeApplicationEmployeeIdName:
          x.changeApplicationEmployeeId + x.changeApplicationEmployeeName,
        firstApprovalEmployeeIdName:
          x.firstApprovalEmployeeId + x.firstApprovalEmployeeName,
        secondApprovalEmployeeIdName:
          x.secondApprovalEmployeeId + x.secondApprovalEmployeeName,
        thirdApprovalEmployeeIdName:
          x.thirdApprovalEmployeeId + x.thirdApprovalEmployeeName,
        fourthApprovalEmployeeIdName:
          x.fourthApprovalEmployeeId + x.fourthApprovalEmployeeName,
        ...x,
      };
    });
  };

  const methods = useForm<ScrDoc0005ChangeHistoryInfoResponse>({
    defaultValues: initialVal,
    context: allReadOnly,
    resolver: yupResolver(yup.object()),
  });

  // ref
  const apiRef = useGridApiRef();
  const [maxSectionWidth, setMaxSectionWidth] = useState<number>(0);

  useEffect(() => {
    setMaxSectionWidth(
      Number(
        apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
      ) + 40
    );
  }, [apiRef, apiRef.current.rootElementRef]);

  return (
    <MainLayout>
      <MainLayout main>
        <FormProvider {...methods}>
          <Section name='変更履歴一覧'>
            <DataGrid
              columns={showChangeHistoryList}
              rows={changeHistoryList}
            />
          </Section>
          <Section name='未承認一覧' width={maxSectionWidth}>
            <DataGrid
              columns={showUnapprovedList}
              rows={unapprovedList}
              apiRef={apiRef}
            />
          </Section>
        </FormProvider>
      </MainLayout>
    </MainLayout>
  );
};

export default ScrDoc0005ChangeHistoryTab;
