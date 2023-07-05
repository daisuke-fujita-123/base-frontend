import { comApiClient } from 'providers/ApiClient';

/** API-COM-9999-0002: 親組織ID情報取得API リクエスト */
export interface ScrCom9999GetParentorganizationidListboxRequest {
    /** 業務日付 */
    businessDate: string;
};

/** API-COM-9999-0002: 親組織ID情報取得API レスポンス */
export interface ScrCom9999GetParentorganizationidListboxResponse {
    // リスト
    searchGetParentorganizationidListbox: SearchGetParentorganizationidListbox[];
};

/** API-COM-9999-0002: 親組織ID情報取得API レスポンス(リスト行) */
export interface SearchGetParentorganizationidListbox {
    // 親組織ID
    parentOrganizationId: string,
    // 部署名称
    organizationName: string
};

/** API-COM-9999-0002: 親組織ID情報取得API */
export const ScrCom9999GetParentorganizationidListbox = async (
    request: ScrCom9999GetParentorganizationidListboxRequest
): Promise<ScrCom9999GetParentorganizationidListboxResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-parentorganizationid',
        request
    );
    return response.data;
};


/** API-COM-9999-0003: 組織ID情報取得API リクエスト */
export interface ScrCom9999GetOrganizationidListboxRequest {
    /** 業務日付 */
    businessDate: string;
};

/** API-COM-9999-0003: 組織ID情報取得API レスポンス */
export interface ScrCom9999GetOrganizationidListboxResponse {
    // リスト
    searchGetOrganizationidListbox: SearchGetOrganizationidListbox[];
};

/** API-COM-9999-0003: 組織ID情報取得API レスポンス(リスト行) */
export interface SearchGetOrganizationidListbox {
    // 組織ID
    organizationId: string,
    // 部署名称
    organizationName: string
};

/** API-COM-9999-0003: 組織ID情報取得API */
export const ScrCom9999GetOrganizationidListbox = async (
    request: ScrCom9999GetOrganizationidListboxRequest
): Promise<ScrCom9999GetOrganizationidListboxResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-organizationid-listbox',
        request
    );
    return response.data;
};


/** API-COM-9999-0004: 画面権限ID情報取得API レスポンス */
export interface ScrCom9999GetScreenpermissionidListboxResponse {
    // リスト
    searchGetScreenpermissionidListbox: SearchGetScreenpermissionidListbox[];
};

/** API-COM-9999-0004: 画面権限ID情報取得API レスポンス(リスト行) */
export interface SearchGetScreenpermissionidListbox {
    // 画面権限ID
    screenPermissionId: string,
    // 画面権限名
    screenPermissionName: string
};

/** API-COM-9999-0004: 画面権限ID情報取得API */
export const ScrCom9999GetScreenpermissionidListbox = async (
    request: null
): Promise<ScrCom9999GetScreenpermissionidListboxResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-screenpermissionid',
        request
    );
    return response.data;
};


/** API-COM-9999-0005: マスタ権限ID情報取得API レスポンス */
export interface ScrCom9999GetMasterpermissionidListboxResponse {
    // リスト
    searchGetMasterpermissionidListbox: SearchGetMasterpermissionidListbox[];
};

/** API-COM-9999-0005: マスタ権限ID情報取得API レスポンス(リスト行) */
export interface SearchGetMasterpermissionidListbox {
    // マスタ権限ID
    masterPermissionId: string,
    // マスタ権限名
    masterPermissionName: string
};

/** API-COM-9999-0005: マスタ権限ID情報取得API */
export const ScrCom9999GetMasterpermissionidListbox = async (
    request: null
): Promise<ScrCom9999GetMasterpermissionidListboxResponse> => {
    const response = await comApiClient.post(
        '/scr-com-9999/get-masterpermissionid-listbox',
        request
    );
    return response.data;
};


/** API-COM-9999-0006: 承認権限ID情報取得API レスポンス */
export interface ScrCom9999GetApprovalPermissionIdListboxResponse {
    // リスト
    searchGetApprovalPermissionIdListbox: SearchGetApprovalPermissionIdListbox[];
};

/** API-COM-9999-0006: 承認権限ID情報取得API レスポンス(リスト行) */
export interface SearchGetApprovalPermissionIdListbox {
    // 承認権限ID
    approvalPermissionId: string,
    // 承認権限名
    approvalPermissionName: string
};

/** API-COM-9999-0006: 承認権限ID情報取得API */
export const ScrCom9999GetApprovalPermissionIdListbox = async (
    request: null
): Promise<ScrCom9999GetApprovalPermissionIdListboxResponse> => {
    const response = await comApiClient.post(
        ' /scr-com-9999/get-approvalpermissionid',
        request
    );
    return response.data;
};


/** API-COM-9999-0007: 所属組織IDリストボックス情報取得API レスポンス */
export interface ScrCom9999GetBelongOrganizationIdListboxResponse {
    // リスト
    searchGetBelongOrganizationIdListbox: SearchGetBelongOrganizationIdListbox[];
};

/** API-COM-9999-0007: 所属組織IDリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetBelongOrganizationIdListbox {
    // 組織ID
    organizationId: string,
    // 部署名称
    organizationName: string
};

/** API-COM-9999-0007: 所属組織IDリストボックス情報取得API */
export const ScrCom9999GetBelongOrganizationIdListbox = async (
    request: null
): Promise<ScrCom9999GetBelongOrganizationIdListboxResponse> => {
    const response = await comApiClient.post(
        ' /scr-com-9999/get-organizationid-listbox',
        request
    );
    return response.data;
};


/** API-COM-9999-0008: 所属役職IDリストボックス情報取得API レスポンス */
export interface ScrCom9999GetPostIdListboxResponse {
    // リスト
    searchGetPostIdListbox: SearchGetPostIdListbox[];
};

/** API-COM-9999-0008: 所属役職IDリストボックス情報取得API レスポンス(リスト行) */
export interface SearchGetPostIdListbox {
    // 役職ID
    postId: string,
    // 役職名
    postName: string
};

/** API-COM-9999-0008: 所属役職IDリストボックス情報取得API */
export const ScrCom9999GetPostIdListbox = async (
    request: null
): Promise<ScrCom9999GetPostIdListboxResponse> => {
    const response = await comApiClient.post(
        ' /scr-com-9999/get-postid-listbox',
        request
    );
    return response.data;
};