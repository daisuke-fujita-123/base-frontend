import { _expApiClient } from 'providers/ApiClient';

// パスワードログイン リクエスト
export interface PasswordLoginRequest {
  /** 従業員ID */
  employeeId: string;
  /** パスワード */
  password: string;
}

// パスワードログイン レスポンス
export interface PasswordLoginResponse {
  // リターンコード
  rtnCode: boolean;
}

// パスワードログイン
export const ScrCom0001PasswordLogin = async (
  req: PasswordLoginRequest
): Promise<PasswordLoginResponse> => {
  const response = await _expApiClient.post('/_exp/api/com/passwordlogin', req);
  return response.data;
};
