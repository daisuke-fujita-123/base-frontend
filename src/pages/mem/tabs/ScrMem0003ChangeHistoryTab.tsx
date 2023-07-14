import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';

import { AddButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';

import {
  ScrMem0003GetCorporation,
  ScrMem0003GetCorporationRequest,
  ScrMem0003GetCorporationResponse,
} from 'apis/mem/ScrMem0003Api';

/**
 * 請求先一覧列定義
 */
const changeHistoryColumns: GridColDef[] = [
  {
    field: 'changeHistoryNumber',
    headerName: '申請ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'screenName',
    headerName: '申請元画面',
    size: 's',
  },
  {
    field: 'tabAllRegistrationName',
    headerName: 'タブ名/一括登録',
    size: 'm',
  },
  {
    field: 'changeExpectDate',
    headerName: '変更日',
    size: 's',
  },
  {
    field: 'changeApplicationEmployee',
    headerName: '申請者ID/申請者名',
    size: 'l',
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
    tooltip: true,
  },
  {
    field: 'approvalEmployee',
    headerName: '最終承認者ID/最終承認者名',
    size: 'l',
  },
  {
    field: 'approvalTimestamp',
    headerName: '最終承認日時',
    size: 'm',
  },
  {
    field: 'approverComment',
    headerName: '最終承認者コメント',
    size: 'm',
    tooltip: true,
  },
];

/**
 * 未承認一覧列定義
 */
const notPermissionColumns: GridColDef[] = [
  {
    field: 'changeHistoryNumber',
    headerName: '申請ID',
    size: 's',
    cellType: 'link',
  },
  {
    field: 'screenName',
    headerName: '申請元画面',
    size: 's',
  },
  {
    field: 'tabAllRegistrationName',
    headerName: 'タブ名/一括登録',
    size: 'm',
  },
  {
    field: 'changeExpectDate',
    headerName: '変更日',
    size: 's',
  },
  {
    field: 'changeApplicationEmployee',
    headerName: '申請者ID/申請者名',
    size: 'l',
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
    tooltip: true,
  },
  {
    field: 'approvalStatus',
    headerName: '承認ステータス',
    size: 'm',
  },
  {
    field: 'approvalSettingEmployee1',
    headerName: '1次承認者ID/1次承認者名',
    size: 'l',
  },
  {
    field: 'approvalSettingEmployee2',
    headerName: '2次承認者ID/2次承認者名',
    size: 'l',
  },
  {
    field: 'approvalSettingEmployee3',
    headerName: '3次承認者ID/3次承認者名',
    size: 'l',
  },
  {
    field: 'approvalSettingEmployee4',
    headerName: '4次承認者ID/4次承認者名',
    size: 'l',
  },
];

/**
 * 変更履歴一覧モデル
 */
interface ChangeHistoryModel {
  id: number;
  changeHistoryNumber: number;
  screenName: string;
  tabAllRegistrationName: string;
  changeExpectDate: string;
  changeApplicationEmployee: string;
  changeApplicationTimestamp: string;
  registrationChangeMemo: string;
  approvalEmployee: string;
  approvalTimestamp: string;
  approverComment: string;
}

/**
 * 未承認一覧モデル
 */
interface notPermissionModel {
  id: number;
  changeHistoryNumber: number;
  screenName: string;
  tabAllRegistrationName: string;
  changeExpectDate: string;
  changeApplicationEmployee: string;
  changeApplicationTimestamp: string;
  registrationChangeMemo: string;
  approvalStatus: string;
  approvalSettingEmployee1: string;
  approvalSettingEmployee2: string;
  approvalSettingEmployee3: string;
  approvalSettingEmployee4: string;
}

/**
 * 列モデル
 */
interface DateRowsModel {
  changeHistory: ChangeHistoryModel[];
  notPermission: notPermissionModel[];
}

/**
 * 法人契約コース・サービス一覧取得APIリクエストから【四輪】契約情報セクションモデルへの変換
 */
const convertToDateRows = (
  response: ScrMem0003GetCorporationResponse
): DateRowsModel => {
  return {
    changeHistory: response.changeHistory.map((x) => {
      return {
        id: x.changeHistoryNumber,
        changeHistoryNumber: x.changeHistoryNumber,
        screenName: x.screenName,
        tabAllRegistrationName:
          x.allRegistrationName !== '' ? x.allRegistrationName : x.tabName,
        changeExpectDate: new Date(x.changeExpectDate).toLocaleDateString(),
        changeApplicationEmployee:
          x.changeApplicationEmployeeId +
          '　' +
          x.changeApplicationEmployeeName,
        changeApplicationTimestamp: new Date(
          x.changeApplicationTimestamp
        ).toLocaleString(),
        registrationChangeMemo: x.registrationChangeMemo !== '' ? 'あり' : '',
        approvalEmployee: x.approvalEmployeeId + '　' + x.approvalEmployeeName,
        approvalTimestamp: new Date(x.approvalTimestamp).toLocaleString(),
        approverComment: x.approverComment !== '' ? 'あり' : '',
      };
    }),
    notPermission: response.notPermission.map((x) => {
      return {
        id: x.changeHistoryNumber,
        changeHistoryNumber: x.changeHistoryNumber,
        screenName: x.screenName,
        tabAllRegistrationName:
          x.allRegistrationName !== '' ? x.allRegistrationName : x.tabName,
        changeExpectDate: new Date(x.changeExpectDate).toLocaleDateString(),
        changeApplicationEmployee:
          x.changeApplicationEmployeeId +
          '　' +
          x.changeApplicationEmployeeName,
        changeApplicationTimestamp: new Date(
          x.changeApplicationTimestamp
        ).toLocaleString(),
        registrationChangeMemo: x.registrationChangeMemo !== '' ? 'あり' : '',
        approvalStatus: x.approvalStatus,
        approvalSettingEmployee1:
          x.approvalSettingEmployeeId1 + '　' + x.approvalSettingEmployeeName1,
        approvalSettingEmployee2:
          x.approvalSettingEmployeeId2 + '　' + x.approvalSettingEmployeeName2,
        approvalSettingEmployee3:
          x.approvalSettingEmployeeId3 + '　' + x.approvalSettingEmployeeName3,
        approvalSettingEmployee4:
          x.approvalSettingEmployeeId4 + '　' + x.approvalSettingEmployeeName4,
      };
    }),
  };
};

const ScrMem0003ChangeHistoryTab = () => {
  // router
  const { corporationId } = useParams();
  const navigate = useNavigate();

  // state
  const [changeHistoryRows, setChangeHistoryRows] = useState<
    ChangeHistoryModel[]
  >([]);
  const [notPermissionRows, setNotPermissionRows] = useState<
    notPermissionModel[]
  >([]);
  const [changeHistoryHrefs, setChangeHistoryHrefs] = useState<any[]>([]);
  const [notPermissionHrefs, setNotPermissionHrefs] = useState<any[]>([]);
  const [changeHistoryTooltips, setChangeHistoryTooltips] = useState<any[]>([]);
  const [notPermissionTooltips, setNotPermissionTooltips] = useState<any[]>([]);

  // 初期表示処理
  useEffect(() => {
    const initialize = async (corporationId: string) => {
      // 法人基本情報申請API
      const request: ScrMem0003GetCorporationRequest = {
        corporationId: corporationId,
        limitCount: 15000,
      };
      const response = await ScrMem0003GetCorporation(request);
      const dateRows = convertToDateRows(response);
      setChangeHistoryRows(dateRows.changeHistory);
      setNotPermissionRows(dateRows.notPermission);

      // refs設定
      const changeHistoryHrefs = dateRows.changeHistory.map((x) => {
        let href = '';
        switch (x.screenName) {
          case '法人情報詳細':
            switch (x.tabAllRegistrationName) {
              case '法人情報変更':
                href = '/mem/corporations/' + corporationId + '#basic';
                break;
              case '与信情報変更':
                href = '/mem/corporations/' + corporationId + '#credit';
                break;
              case '与信制限変更':
                href = '/mem/corporations/' + corporationId + '#credit-limit';
                break;
            }
            break;
          case '請求先詳細':
            switch (x.tabAllRegistrationName) {
              case '基本情報変更':
                href =
                  '/mem/corporations/' + corporationId + '/billings//#basic';
                break;
              case '口座情報変更':
                // TODO: タブ名未定
                href = '/mem/corporations/' + corporationId + '/billings//#';
                break;
            }
            break;
          case '事業拠点詳細':
            // TODO: URI未定アーキに確認
            href = '-/#basic';
            break;
          case '物流拠点詳細':
            href = '/mem/corporations/' + corporationId + '/logistics-bases/';
            break;
          case '契約情報詳細':
            switch (x.tabAllRegistrationName) {
              case '契約情報変更':
                // TODO: URI未定アーキに確認
                href = '-/#basic';
                break;
              case 'サービス情報変更':
                // TODO: タブ名未定 & URI未定アーキに確認
                href = '-/#';
                break;
              case '請求・値引値増情報変更':
                // TODO: タブ名未定 & URI未定アーキに確認
                href = '-/#';
                break;
              case 'ライブ情報変更':
                // TODO: タブ名未定 & URI未定アーキに確認
                href = '-/#';
                break;
            }
            break;
        }
        return {
          field: 'changeHistoryNumber',
          id: x.id,
          href: href,
        };
      });
      setChangeHistoryHrefs(changeHistoryHrefs);

      const notPermissionHrefs = dateRows.notPermission.map((x) => {
        let href = '';
        switch (x.screenName) {
          case '法人情報詳細':
            switch (x.tabAllRegistrationName) {
              case '与信情報変更':
                href = '/mem/corporations/' + corporationId + '#credit';
                break;
            }
            break;
          case '請求先詳細':
            switch (x.tabAllRegistrationName) {
              case '口座情報変更':
                // TODO: タブ名未定
                href = '/mem/corporations/' + corporationId + '/billings//#';
                break;
            }
            break;
          case '契約情報詳細':
            switch (x.tabAllRegistrationName) {
              case 'サービス情報変更':
                // TODO: タブ名未定 & URI未定アーキに確認
                href = '-/#';
                break;
              case '請求・値引値増情報変更':
                // TODO: タブ名未定 & URI未定アーキに確認
                href = '-/#';
                break;
            }
            break;
        }
        return {
          field: 'changeHistoryNumber',
          id: x.id,
          href: href,
        };
      });
      setNotPermissionHrefs(notPermissionHrefs);

      // ツールチップ設定
      const changeHistoryTooltips: any[] = [];
      response.changeHistory.map((x) => {
        changeHistoryTooltips.push({
          field: 'registrationChangeMemo',
          id: x.changeHistoryNumber,
          value: 'あり',
          text: x.registrationChangeMemo,
        });
        changeHistoryTooltips.push({
          field: 'approverComment',
          id: x.changeHistoryNumber,
          value: 'あり',
          text: x.approverComment,
        });
      });
      setChangeHistoryTooltips(changeHistoryTooltips);

      const notPermissionTooltips = response.notPermission.map((x) => {
        return {
          field: 'registrationChangeMemo',
          id: x.changeHistoryNumber,
          value: 'あり',
          text: x.registrationChangeMemo,
        };
      });
      setNotPermissionTooltips(notPermissionTooltips);
    };

    if (corporationId !== undefined) {
      initialize(corporationId);
      return;
    }
  }, [corporationId]);

  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * CSV出力リック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    console.log('CSV出力');
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          {/* 変更履歴一覧セクション */}
          <Section
            name='変更履歴一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={changeHistoryColumns}
              rows={changeHistoryRows}
              tooltips={changeHistoryTooltips}
              hrefs={changeHistoryHrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
          {/* 未承認一覧セクション */}
          <Section
            name='未承認一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton onClick={handleIconOutputCsvClick}>
                  CSV出力
                </AddButton>
              </MarginBox>
            }
          >
            <DataGrid
              columns={notPermissionColumns}
              rows={notPermissionRows}
              tooltips={notPermissionTooltips}
              hrefs={notPermissionHrefs}
              onLinkClick={handleLinkClick}
            />
          </Section>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrMem0003ChangeHistoryTab;

