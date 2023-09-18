import { comApiClient } from 'providers/ApiClient';

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） リクエスト
export interface ScrCom0033GetApproverRequest {
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId?: number;
  /** 一括登録ID */
  allRegistrationId?: string;
  /** 申請金額 */
  applicationMoney?: number;
  /** 申請者ID */
  appalicationId: string;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス
export interface ScrCom0033GetApproverResponse {
  /** 第１承認者リスト */
  approvalUser1: approvalUser1[];
  /** 第２承認者リスト */
  approvalUser2: approvalUser2[];
  /** 第３承認者リスト */
  approvalUser3: approvalUser3[];
  /** 第４承認者リスト */
  approvalUser4: approvalUser4[];
  /** 必要承認ステップ */
  needApprovalStep: number;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス リスト行１
export interface approvalUser1 {
  /** 従業員ID */
  employeeId: string;
  /** 従業員名 */
  employeeName: string;
  /** 従業員メールアドレス */
  employeeMail: string;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス リスト行２
export interface approvalUser2 {
  /** 従業員ID */
  employeeId: string;
  /** 従業員名 */
  employeeName: string;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス リスト行３
export interface approvalUser3 {
  /** 従業員ID */
  employeeId: string;
  /** 従業員名 */
  employeeName: string;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス リスト行４
export interface approvalUser4 {
  /** 従業員ID */
  employeeId: string;
  /** 従業員名 */
  employeeName: string;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ）
export const ScrCom0033GetApprover = async (
  request: ScrCom0033GetApproverRequest
): Promise<ScrCom0033GetApproverResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0033/get-approver',
    request
  );
  return response.data;
};
