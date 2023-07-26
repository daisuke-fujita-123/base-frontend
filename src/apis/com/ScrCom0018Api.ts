import { comApiClient } from 'providers/ApiClient';

// API-COM-0018-0001: サービス一覧取得API リクエスト
export interface ScrCom0018GetServiceListRequest {
  // 業務日付
  businessDate: Date;
  // サービスID
  serviceId?: string;
  // サービス名
  serviceName?: string;
  // 担当部門区分
  staffDepartmentKind?: string;
  // 利用フラグ
  useFlag?: boolean;
}

// API-COM-0018-0001: サービス一覧取得API レスポンス
export interface ScrCom0018GetServiceListResponse {
  // サービス一覧リスト
  serviceList: ServiceInfo[];
}

interface ServiceInfo {
  // サービスID
  serviceId: string;
  // サービス名
  serviceName: string;
  // 変更予約
  changeReservation: string;
  // 対象サービス区分
  targetedServiceKindName: string;
}

// API-COM-0018-0001: サービス一覧取得API
export const getServiceList = async (
  req: ScrCom0018GetServiceListRequest
): Promise<ScrCom0018GetServiceListResponse> => {
  const response = await comApiClient.post(
    '/scr-com-0018/get-service-list',
    req
  );
  return response.data;
};
