import { docApiClient } from 'providers/ApiClient';

/** API-DOC-9999-0002: イメージ帳票作成API（書類管理） リクエスト */
export interface ScrDoc9999CreateReportImageDocRequest {
  /** 呼出元機能ID */
  functionId: string;
  /** 帳票ID */
  reportId: string;
  /** 帳票タイトル	 */
  reportTitle: string;
  /** オペレータID */
  operatorId: string;
  /** オペレータ名 */
  operatorName: string;
  /** コメント */
  comment: string;
}

/** API-DOC-9999-0002: イメージ帳票作成API（書類管理） レスポンス */
export interface ScrDoc9999CreateReportImageDocResponse {
  /** レスポンス */
  responseEntity: string;
}

/** API-DOC-9999-0002: イメージ帳票作成API（書類管理） */
export const ScrDoc9999CreateReportImageDoc = async (
  request: ScrDoc9999CreateReportImageDocRequest
): Promise<ScrDoc9999CreateReportImageDocResponse> => {
  const response = await docApiClient.post(
    '/api/doc/scr-doc-9999/create-report-image-doc',
    request,
    {
      responseType: 'blob',
    }
  );
  return response.data;
};
