import { comApiClient } from 'providers/ApiClient';

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API リクエスト */
export interface ScrCom9999GetCodeManagementMasterListboxRequest {
    /** 業務日付 */
    businessDate?: string;
    /** コードID */
    codeId: string;
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンス */
export interface ScrCom9999GetCodeManagementMasterListboxResponse {
    // リスト
    searchGetCodeManagementMasterListbox: SearchGetCodeManagementMasterListbox[];
}

/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetCodeManagementMasterListbox {
    // コード値
    codeValue: string,
    // コード名称
    codeName: string
}


/** API-COM-9999-0012: 計算書種別情報取得API リクエスト */
export interface ScrCom9999GetStatementKindRequest {
    /** 手数料ID */
    commissionId: string;
    /** 業務日付 */
    businessDate: string;
}


/** API-COM-9999-0012: 計算書種別情報取得API レスポンス */
export interface ScrCom9999GetStatementKindResponse {
    /** 変更予定日情報 リスト */
    statementKindList: statementKindList[];
}


/** API-COM-9999-0012: 計算書種別情報取得API レスポンス (リスト行) */
export interface statementKindList {
    /** 計算書種別コード */
    codeValue: string,
    /** 計算書種別名称 */
    codeName: string,
}


/**  API-COM-9999-0013: 手数料条件情報取得API リクエスト */
export interface ScrCom9999GetCommissionConditionRequest {
    /** 手数料ID */
    commissionId: string;
    /** 業務日付 */
    businessDate: string;
}


/**  API-COM-9999-0013: 手数料条件情報取得API レスポンス */
export interface ScrCom9999GetCommissionConditionResponse {
    /** 手数料条件 リスト */
    commissionConditionList: comCommissionConditionList[];
}


/**  API-COM-9999-0013: 手数料条件情報取得API レスポンス (リスト行) */
export interface comCommissionConditionList {
    /** 手数料条件コード */
    codeValue: string,
    /** 手数料条件名称 */
    codeName: string,
}


/**  API-COM-9999-0020: 値属性変換API リクエスト */
export interface ScrCom9999ValueAttributeConversionRequest {
    /** 条件種類コード */
    conditionKindCode: string;
    /** 業務日付 */
    businessDate: string;
}


/**  API-COM-9999-0020: 値属性変換API レスポンス */
export interface ScrCom9999ValueAttributeConversionResponse {
    /** 型区分 */
    typeKind: string;
    /** 手数料条件 リスト */
    commissionConditionValueList: commissionConditionValueList[];
}


/**  API-COM-9999-0020: 値属性変換API レスポンス (リスト行) */
export interface commissionConditionValueList {
    /** 手数料条件値ID */
    commissionConditionID: string,
    /** 手数料条件値名称 */
    commissionConditionValue: string,
}


/**  API-COM-9999-0025: 変更履歴情報取得API リクエスト */
export interface ScrCom9999GetHistoryInfoRequest {
    /** 変更履歴番号 */
    changeHistoryNumber: string | null;
}


/**  API-COM-9999-0025: 変更履歴情報取得API レスポンス */
export interface ScrCom9999GetHistoryInfoResponse {
    /** 変更履歴情報 */
    changeHistoryInfo: Map<string, object>;
}


/** API-COM-9999-0026: 変更予定日取得API リクエスト */
export interface ScrCom9999GetChangeDateRequest {
    /** 業務日付 */
    businessDate: string;
    /** 画面ID */
    screenId: string;
    /** タブID */
    tabId: string;
    /** 取得キー値 */
    getKeyValue: string;
}


/** API-COM-9999-0026: 変更予定日取得API レスポンス */
export interface ScrCom9999GetChangeDateResponse {
    /** 変更予定日情報 リスト */
    changeExpectDateInfo: changeExpectDateInfo[];
}


/** API-COM-9999-0026: 変更予定日取得API レスポンス (リスト行) */
export interface changeExpectDateInfo {
    /** 変更履歴番号 */
    changeHistoryNumber: number,
    /** 変更予定日 */
    changeExpectDate: string,
}


/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） リクエスト */
export interface ScrCom9999GetCodeValueRequest {
    /** エンティティリスト */
    entityList: entityList[];
}


/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） リクエスト(リスト行) */
export interface entityList {
    /** 業務日付 */
    businessDate?: string;
    /** エンティティ名 */
    entityName: string;
}


/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） レスポンス */
export interface ScrCom9999GetCodeValueResponse {
    /** 変更予定日情報 リスト */
    resultList: resultList[];
}


/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） レスポンス (リスト) */
export interface resultList {
    /** コード値リスト */
    codeValueList: codeValueList[],
    /** エンティティ名 */
    entityName: number,
}


/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） レスポンス (リスト行ネスト行) */
export interface codeValueList {
    /** コード値 */
    codeValue: number,
    /** コード値名称 */
    codeValueName: string,
    /** コード値名称カナ */
    codeValueNameKana: string,
}


/** API-COM-9999-0010: コード管理マスタリストボックス情報取得API */
export const ScrCom9999GetCodeManagementMasterListbox = async (
    request: ScrCom9999GetCodeManagementMasterListboxRequest
): Promise<ScrCom9999GetCodeManagementMasterListboxResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-code-management-master-listbox',
        request
    );
    return response.data;
};


/** API-COM-9999-0012: 計算書種別情報取得API */
export const ScrCom9999GetStatementKind = async (
    request?: ScrCom9999GetStatementKindRequest
): Promise<ScrCom9999GetStatementKindResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-statement-kind',
        request
    );
    return response.data;
};


/** API-COM-9999-0013: 手数料条件情報取得API */
export const ScrCom9999GetCommissionCondition = async (
    request?: ScrCom9999GetCommissionConditionRequest
): Promise<ScrCom9999GetCommissionConditionResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-commission-condition',
        request
    );
    return response.data;
};


/** API-COM-9999-0020: 値属性変換API */
export const ScrCom9999ValueAttributeConversion = async (
    request: ScrCom9999ValueAttributeConversionRequest
): Promise<ScrCom9999ValueAttributeConversionResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/value-attribute-conversion',
        request
    );
    return response.data;
};


/** API-COM-9999-0025: 変更履歴情報取得API */
export const ScrCom9999GetHistoryInfo = async (
    request: ScrCom9999GetHistoryInfoRequest
): Promise<ScrCom9999GetHistoryInfoResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-history-info',
        request
    );
    return response.data;
};


/** API-COM-9999-0026: 変更予定日取得API */
export const ScrCom9999GetChangeDate = async (
    request: ScrCom9999GetChangeDateRequest
): Promise<ScrCom9999GetChangeDateResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-change-date',
        request
    );
    return response.data;
};


/** API-COM-9999-0031: コード値取得API（コード管理マスタ以外） */
export const ScrCom9999GetCodeValue = async (
    request: ScrCom9999GetCodeValueRequest
): Promise<ScrCom9999GetCodeValueResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-code-value',
        request
    );
    return response.data;
};
