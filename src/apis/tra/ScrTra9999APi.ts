import { traApiClient } from 'providers/ApiClient';


/** API-TRA-COM-9999-0001: コードマスタ(取引会計)情報取得API リクエスト */
export interface ScrTra9999GetCodeValueRequest {
    /** コードIDリスト */
    codes: codesRequest[];
}

/** API-TRA-COM-9999-0001: コードマスタ(取引会計)情報取得API リクエスト(リスト行) */
export interface codesRequest {
    /** コードID */
    codeId: string;
    /** 有効開始日 */
    validityStartDate?: string;
}


/** API-TRA-COM-9999-0001: コードマスタ(取引会計)情報取得API レスポンス */
export interface ScrTra9999GetCodeValueResponse {
    /** 変更予定日情報 リスト */
    codes: codes[];
}


/** API-TRA-COM-9999-0001: コードマスタ(取引会計)情報取得API レスポンス (リスト行) */
export interface codes {
    /** コードID */
    value: string;
    /** コード一覧 */
    codeList: codeList[];
}


/** API-TRA-COM-9999-0001: コードマスタ(取引会計)情報取得API レスポンス (リストネスト行) */
export interface codeList {
    /** コード値 */
    code: string;
    /** 有効開始日 */
    validityStartDate: string;
    /** コード名称 */
    codeName: string;
}


/** API-TRA-COM-9999-0001: コードマスタ(取引会計)情報取得API */
export const ScrTra9999GetCodeValue = async (
    request: ScrTra9999GetCodeValueRequest
): Promise<ScrTra9999GetCodeValueResponse> => {
    const response = await traApiClient.post(
        '/scr-tra-9999/get-code-value',
        request
    );
    return response.data;
};
