import { comApiClient } from 'providers/ApiClient';

/** SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API リクエスト */
export interface ScrCom9999GetCodeManagementMasterListboxRequest {
    /** 業務日付 */
    businessDate: string;
    /** コードID */
    codeId: string;
}

/** SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンス */
export interface ScrCom9999GetCodeManagementMasterListboxResponse {
    // リスト
    searchGetCodeManagementMasterListbox: SearchGetCodeManagementMasterListbox[];
}

/** SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetCodeManagementMasterListbox {
    // コード値
    value: string,
    // コード名称
    displayValue: string
}


/** SCR-COM-9999-0016: 会場マスタリストボックス情報取得API リクエスト */
export interface ScrCom9999GetPlaceMasterListboxRequest {
    /** 業務日付 */
    businessDate: string;
}

/** SCR-COM-9999-0016: 会場マスタリストボックス情報取得API レスポンス */
export interface ScrCom9999GetPlaceMasterListboxResponse {
    // リスト
    searchGetPlaceMasterListbox: SearchGetPlaceMasterListbox[];
}

/** SCR-COM-9999-0016: 会場マスタリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetPlaceMasterListbox {
    // 会場コード
    value: string,
    // 会場名
    displayValue: string
}


/** SCR-COM-9999-0017: 銀行名リストボックス リクエスト */
export interface ScrCom9999GetBankMasterListboxRequest {
    /** 業務日付 */
    businessDate: string;
}

/** SCR-COM-9999-0017: 銀行名リストボックス レスポンス */
export interface ScrCom9999GetBankMasterListboxResponse {
    // リスト
    searchGetBankMasterListbox: SearchGetBankMasterListbox[];
}

/** SCR-COM-9999-0017: 銀行名リストボックス レスポンス(リスト行) */
export interface SearchGetBankMasterListbox {
    // 銀行コード
    value: string,
    // 銀行名
    displayValue: string
}


/** SCR-COM-9999-0018: 支店名リストボックス情報取得API リクエスト */
export interface ScrCom9999GetBranchMasterRequest {
    /** 銀行コード */
    bankCode: string;
    /** 業務日付 */
    businessDate: string;
}

/** SCR-COM-9999-0018: 支店名リストボックス情報取得API レスポンス */
export interface ScrCom9999GetBranchMasterResponse {
    // リスト
    searchGetBranchMaster: searchGetBranchMaster[];
}

/** SCR-COM-9999-0018: 支店名リストボックス情報取得API レスポンス(リスト行) */
export interface searchGetBranchMaster {
    // 支店コード
    value: string,
    // 支店名
    displayValue: string
}


/** SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API */
export const ScrCom9999GetCodeManagementMasterListbox = async (
    request: ScrCom9999GetCodeManagementMasterListboxRequest
): Promise<ScrCom9999GetCodeManagementMasterListboxResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-code-management-master-listbox',
        request
    );
    return response.data;
};


/** SCR-COM-9999-0016: 会場マスタリストボックス情報取得API */
export const ScrCom9999GetPlaceMasterListbox = async (
    request: ScrCom9999GetPlaceMasterListboxRequest
): Promise<ScrCom9999GetPlaceMasterListboxResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-place-master-listbox',
        request
    );
    return response.data;
};


/** SCR-COM-9999-0017: 銀行名リストボックス情報取得API */
export const ScrCom9999GetBankMasterListbox = async (
    request: ScrCom9999GetBankMasterListboxRequest
): Promise<ScrCom9999GetBankMasterListboxResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-bank-master-listbox',
        request
    );
    return response.data;
};


/** SCR-COM-9999-0018: 支店名リストボックス情報取得API */
export const ScrCom9999GetBranchMaster = async (
    request: ScrCom9999GetBranchMasterRequest
): Promise<ScrCom9999GetBranchMasterResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-branch-master',
        request
    );
    return response.data;
};
