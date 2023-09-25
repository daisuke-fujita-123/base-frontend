import { ScrCom0032PopupModel } from 'pages/com/popups/ScrCom0032Popup';

import { comApiClient } from 'providers/ApiClient';

/** SCR-COM-0008-0001: 帳票コメント情報取得API リクエスト */
export interface ScrCom0008GetReportCommentCurrentRequest {
  /** 帳票ID */
  reportId: string;
}

/** SCR-COM-0008-0001: 帳票コメント情報取得API レスポンス */
export interface ScrCom0008GetReportCommentCurrentResponse {
  /** 帳票ID */
  reportId: string;
  /** システム種別 */
  systemKind: string;
  /** 帳票名 */
  reportName: string;
  /** コメント最大行数 */
  commentRow: number;
  /** ポップアップコメント最大行数 */
  popupCommentRow: number;
  /** コメント１行最大文字数 */
  commentLine: number;
  /** 帳票コメント */
  reportComment: string;
  /** 変更タイムスタンプ */
  changeTimestamp: string;
}

/** SCR-COM-0008-0007: 帳票コメント情報登録更新API リクエスト */
export interface ScrCom0008RegistUpdateReportCommentRequest {
  /** 帳票ID */
  reportId: string;
  /** システム種別 */
  systemKind: string;
  /** 帳票名 */
  reportName: string;
  /** コメント最大行数 */
  commentRow: number;
  /** ポップアップコメント最大行数 */
  popupCommentRow: number;
  /** コメント１行最大文字数 */
  commentLine: number;
  /** 帳票コメント */
  reportComment: string;
  /** 申請従業員ID */
  applicationEmployeeId: string;
  /** 登録変更メモ */
  registrationChangeMemo: string;
  /** 変更予定日 */
  changeExpectDate?: Date;
  /** 画面ID */
  screenId: string;
}

/** API-COM-9999-0025: 変更履歴情報取得API リクエスト */
export interface ScrCom9999GetHistoryInfoRequest {
  // 申請ID/変更履歴番号
  changeHistoryNumber: string;
}

/** API-COM-9999-0025: 変更履歴情報取得API レスポンス */
export interface ScrCom9999GetHistoryInfoResponse {
  changeHistoryInfo: {
    /** 帳票ID */
    reportId: string;
    /** システム種別 */
    systemKind: string;
    /** 帳票名 */
    reportName: string;
    /** コメント最大行数 */
    commentRow: number;
    /** ポップアップコメント最大行数 */
    popupCommentRow: number;
    /** コメント１行最大文字数 */
    commentLine: number;
    /** 帳票コメント */
    reportComment: string;
    /** 申請従業員ID */
    applicationEmployeeId: string;
    /** 登録変更メモ */
    registrationChangeMemo: string;
    /** 変更予定日 */
    changeExpectDate: string;
    /** 画面ID */
    screenId: string;
  };
}

/** 変更履歴情報取得API */
export const ScrCom9999GetHistoryInfo = async (
  request: ScrCom9999GetHistoryInfoRequest
): Promise<ScrCom9999GetHistoryInfoResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-9999/get-history-info',
    request
  );
  return response.data;
};

/** SCR-COM-0008-0001: 帳票コメント情報取得API */
export const ScrCom0008GetReportCommentCurrent = async (
  request: ScrCom0008GetReportCommentCurrentRequest
): Promise<ScrCom0008GetReportCommentCurrentResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0008/get-reportcomment-current',
    request
  );
  return response.data;
};

/** SCR-COM-0008-0007: 帳票コメント情報登録更新API */
export const ScrCom0008RegistUpdateReportComment = async (
  request: ScrCom0008RegistUpdateReportCommentRequest
): Promise<ScrCom0032PopupModel> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0008/regist-update-reportcomment',
    request
  );
  return response.data;
};
