import { memApiClient } from 'providers/ApiClient';

/** 拠点枝番紐付け情報取得API */

/** 拠点枝番紐付け情報取得リクエスト */
export interface ScrMem0003GetBranchNumberInfoRequest {
  /** 法人ID */
  corporationId: string;
  /** 変更履歴番号 */
  changeHistoryNumber: string | null;
}
/** 拠点枝番紐付け情報取得レスポンス */
export interface ScrMem0003GetBranchNumberInfoResponse {
  /** 法人ID */
  corporationId: string;
  /** 法人名称 */
  corporationName: string;
  /** 契約配列 */
  contracts: {
    /** 契約ID */
    contractId: string;
    /** コース参加区分 */
    courseEntryKind: string;
  }[];
  /** 物流拠点配列 */
  logisticsBases: {
    /** 物流拠点ID */
    logisticsBaseId: string;
    /** 物流拠点名称 */
    logisticsBaseName: string;
    /** 物流拠点代表契約ID */
    logisticsBaseRepresentativeContractId: string;
  }[];
  /** 契約ID別枝番設定配列 */
  contractBranchNumberSummaries: {
    /** 契約ID */
    contractId: string;
    /** コース名 */
    courseName: string;
    /** コース参加区分 */
    courseEntryKind: string;
    /** コース参加区分名称 */
    courseEntryKindName: string;
    /** 枝番設定数 */
    branchNumberCount: number;
  }[];
  /** 枝番配列 */
  branchNumbers: {
    /** 物流拠点ID */
    logisticsBaseId: string;
    /** 契約ID */
    contractId: string;
    /** 枝番 */
    branchNumber: string;
  }[];
  /** 変更タイムスタンプ */
  changeTimestamp: string;
}

export const ScrMem0003GetBranchNumberInfo = async (
  request: ScrMem0003GetBranchNumberInfoRequest
): Promise<ScrMem0003GetBranchNumberInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/get-branch-number-info',
    request
  );
  return response.data;
};

/** 拠点枝番紐付け情報入力チェックAPI */

/** 拠点枝番紐付け情報入力チェックリクエスト */
export interface ScrMem0003InputCheckBranchNumberInfoRequest {
  /** 法人ID */
  corporationId: string;
  /** 枝番配列 */
  branchNumbers: {
    /** 物流拠点ID */
    logisticsBaseId: string;
    /** 契約ID */
    contractId: string;
    /** 枝番 */
    branchNumber: string;
  }[];
}
/** 拠点枝番紐付け情報入力チェックレスポンス */
export interface ScrMem0003InputCheckBranchNumberInfoResponse {
  /** エラーリスト */
  errorList: {
    /** エラーコード */
    errorCode: string;
    /** エラーメッセージ */
    errorMessage: string;
  }[];
}
export const ScrMem0003InputCheckBranchNumberInfo = async (
  request: ScrMem0003InputCheckBranchNumberInfoRequest
): Promise<ScrMem0003InputCheckBranchNumberInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/input-check-branch-number-info',
    request
  );
  return response.data;
};

/** 拠点枝番紐付け情報登録API */

/** 拠点枝番紐付け情報登録リクエスト */
export interface ScrMem0003RegistrationBranchNumberInfoRequest {
  /** 法人ID */
  corporationId: string;
  /** 枝番配列 */
  branchNumbers: {
    /** 物流拠点ID */
    logisticsBaseId: string;
    /** 契約ID */
    contractId: string;
    /** 枝番 */
    branchNumber: string;
  }[];
  /** 変更タイムスタンプ */
  changeTimestamp: string;
}
/** 拠点枝番紐付け情報登録レスポンス */
export interface ScrMem0003RegistrationBranchNumberInfoResponse {
  dummy?: string;
}
export const ScrMem0003RegistrationBranchNumberInfo = async (
  request: ScrMem0003RegistrationBranchNumberInfoRequest
): Promise<ScrMem0003RegistrationBranchNumberInfoResponse> => {
  const response = await memApiClient.post(
    '/api/mem/scr-mem-0003/registration-branch-number-info',
    request
  );
  return response.data;
};
