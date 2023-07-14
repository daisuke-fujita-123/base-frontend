import { comApiClient } from 'providers/ApiClient';

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） リクエスト
export interface ScrCom0033GetApproverRequest {
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: string;
  /** 申請金額 */
  applicationMoney: string;
  /** 申請者ID */
  appalicationId: string;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス
export interface ScrCom0033GetApproverResponse {
  /** 第１承認者リスト */
  approvalUser_1: approvalUser_1[];
  /** 第２承認者リスト */
  approvalUser_2: approvalUser_2[];
  /** 第３承認者リスト */
  approvalUser_3: approvalUser_3[];
  /** 第４承認者リスト */
  approvalUser_4: approvalUser_4[];
  /** 必要承認ステップ */
  needApprovalStep: number;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス リスト行１
export interface approvalUser_1 {
  /** 従業員ID */
  employeeId: string;
  /** 従業員名 */
  employeeName: string;
  /** 従業員メールアドレス */
  employeeMail: string;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス リスト行２
export interface approvalUser_2 {
  /** 従業員ID */
  employeeId: string;
  /** 従業員名 */
  employeeName: string;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス リスト行３
export interface approvalUser_3 {
  /** 従業員ID */
  employeeId: string;
  /** 従業員名 */
  employeeName: string;
}

// API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンス リスト行４
export interface approvalUser_4 {
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
    '/scr-com-0033/get-approver',
    request
  );
  return response.data;
};
