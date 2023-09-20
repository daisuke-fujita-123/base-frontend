import { traApiClient } from 'providers/ApiClient';

// API-TRA-0001-0001：取引管理マスタ一覧情報取得API レスポンス
export interface ScrTra0001GetAccountingDealMasterChangeHistoryInfoResponse {
  /** 変更履歴情報配列 */
  changeHistories: {
    /** 変更管理番号 */
    changeHistoryNumber: number;
    /** マスタID */
    masterId: string;
    /** 申請元画面名 */
    screenName: string;
    /** タブ名称 */
    tabName: string;
    /** 一括登録名称 */
    allRegistrationName: string;
    /** 変更日 */
    changeExpectDate: string;
    /** 申請者ID */
    changeApplicationEmployeeId: string;
    /** 申請者名 */
    changeApplicationEmployeeName: string;
    /** 申請日時 */
    changeApplicationTimestamp: string;
    /** 登録・変更メモ */
    registrationChangeMemo: string;
    /** 最終承認者ID */
    approvalEmployeeId: string;
    /** 最終承認者名 */
    approvalEmployeeName: string;
    /** 最終承認日時 */
    approvalTimestamp: string;
    /** 最終承認者コメント */
    approverComment: string;
  }[];
  /** 未承認変更履歴情報配列 */
  unapprovedChangeHistories: {
    /** 変更管理番号 */
    changeHistoryNumber: number;
    /** マスタID */
    masterId: string;
    /** 申請元画面名 */
    screenName: string;
    /** タブ名称 */
    tabName: string;
    /** 一括登録名称 */
    allRegistrationName: string;
    /** 変更日 */
    changeExpectDate: string;
    /** 申請者ID */
    changeApplicationEmployeeId: string;
    /** 申請者名 */
    changeApplicationEmployeeName: string;
    /** 申請日時 */
    changeApplicationTimestamp: string;
    /** 登録・変更メモ */
    registrationChangeMemo: string;
    /** 承認ステータス */
    approvalStatus: string;
    /** 承認ステータス名称 */
    approvalStatusName: string;
    /** 必要承認ステップ */
    needApprovalStep: number;
  }[];
  /** 未承認承認情報配列 */
  unapprovedApprovalInfos: {
    /** 申請ID */
    changeHistoryNumber: number;
    /** 承認ステップNo */
    approvalStepNo: number;
    /** 承認者ID */
    approvalEmployeeId: string;
    /** 承認者名 */
    approvalEmployeeName: string;
  }[];
}

// API-TRA-0001-0001：取引管理マスタ一覧情報取得API
export const ScrTra0001GetAccountingDealMasterChangeHistoryInfo =
  async (): Promise<ScrTra0001GetAccountingDealMasterChangeHistoryInfoResponse> => {
    const response = await traApiClient.post(
      '/api/tra/scr-tra-0001/get-accounting-deal-master-change-history-info'
    );
    return response.data;
  };

// API-TRA-0001-0002：取引管理マスタ一覧検索API リクエスト
export interface ScrTra0001SearchDealAccountingMasterInfoRequest {
  /** マスタID */
  masterId?: string;
  /** マスタ名 */
  masterName?: string;
  /** キー情報 */
  primaryKeyColumnName?: string;
}

// API-TRA-0001-0002：取引管理マスタ一覧検索API レスポンス
export interface ScrTra0001SearchDealAccountingMasterInfoResponse {
  /** 取引管理マスタ情報配列 */
  dealAccountingMasters: {
    /** No. */
    no: number;
    /** マスタID */
    masterId: string;
    /** マスタ名 */
    masterName: string;
    /** キー情報 */
    primaryKeyColumnName: string;
    /** 件数 */
    masterCount: number;
  }[];
}

// API-TRA-0001-0002：取引管理マスタ一覧検索API
export const ScrTra0001SearchDealAccountingMasterInfo = async (
  request: ScrTra0001SearchDealAccountingMasterInfoRequest
): Promise<ScrTra0001SearchDealAccountingMasterInfoResponse> => {
  const response = await traApiClient.post(
    '/api/tra/scr-tra-0001/search-deal-accounting-master-info',
    request
  );
  return response.data;
};
