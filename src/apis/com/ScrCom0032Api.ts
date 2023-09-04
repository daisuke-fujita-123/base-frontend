import { comApiClient } from 'providers/ApiClient';

//  API-COM-0032-0001：承認要否取得API リクエスト
export interface ScrCom0032GetApprovalRequest {
  /** 画面ID */
  screenId: string;
  /** タブID */
  tabId: number;
}

//  API-COM-0032-0001：承認要否取得API レスポンス
export interface ScrCom0032GetApprovalResponse {
  /** 承認要否 */
  approval: boolean;
}

// API-COM-0032-0001：承認要否取得API
export const ScrCom0032GetApproval = async (
  request: ScrCom0032GetApprovalRequest
): Promise<ScrCom0032GetApprovalResponse> => {
  const response = await comApiClient.post(
    '/api/com/scr-com-0032/get-approval',
    request
  );
  return response.data;
};
