import { docApiClient } from 'providers/ApiClient';

/** API-TRA-9999-0002: イメージ帳票作成API（書類管理） リクエスト */
export interface ScrTra9999CreateReportImageDocRequest {
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

/** API-TRA-9999-0002: イメージ帳票作成API（書類管理） */
export const ScrTra9999CreateReportImageDoc = async (
  request: ScrTra9999CreateReportImageDocRequest
): Promise<void> => {
  await docApiClient.post('/scr-doc-9999/create-report-image-doc', request);
};
