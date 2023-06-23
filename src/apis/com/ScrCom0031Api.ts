import { comApiClient } from "providers/ApiClient";

// バッチ実行結果情報取得API リクエスト
export interface ScrCom0031GetMemberRequest {
    // 業務日付
    businessDate: string;
    // ソートキー
    sortKey: string;
    // ソート方向
    sortDirection: string;
    // フィルター項目
    filterColumn: string;
    // フィルター条件符号
    filterOperator: string;
    // フィルター条件値
    filterValue: string;
    // リミット
    limit: number;
    // オフセット
    offset: number;
}

// ダウンロードリンク(ZIP)データモデル
export interface ScrCom0031ZipFileRequest {
    // 出力ファイルURL
    outputFileUrl: string;
  };

// バッチ実行結果情報取得API レスポンス
export interface ScrCom0031GetMemberResponse {
    // リスト
    searchResult: SearchResult[];
}

// バッチ実行結果情報取得API レスポンス（リスト行）
export interface SearchResult {
    // 項目内リンクId(hrefs)
    id: string;
    // ジョブID
    jobId: string;
    // バッチ名
    batchName: string;
    // ステータス
    statusName: string;
    // システム日付
    businessDate: boolean;
    // 開始時間
    startTime: string;
    // 終了時間
    endTime: string;
    // 実行時間
    executeTime: string;
    // 実行件数
    count: string;
    // リンク
    link: string;
    // 出力ファイルURL
    outputFileUrl: string;
    // 帳票履歴番号
    reportHistoryNumber: string;
    // 帳票ファイル名
    reportFileName: string;
    // 帳票格納バケット名
    reportHouseBucketName: string;
    // 帳票格納ファイルプレフィックス
    reportHouseFilePrefix: string;
    // 実行契機
    trigger: string;
    // エラーメッセージ
    errErrm: string;
}

// zipファイル処理API レスポンス
export interface ScrCom0031ZipFileResponse {
    // 出力ファイルURL
    outputFileUrl: string;
}

// SCR-COM-0031-0001：バッチ実行結果情報取得API
export const getMember = async (
    request: ScrCom0031GetMemberRequest
): Promise<ScrCom0031GetMemberResponse> => {
    const response = await comApiClient.post(
        'com/scr-com-0031/get-member',
        request
    );
    return response.data;
};

//SCR-COM-0031-0002：zipファイル処理API
export const getZipFile = async (
    request: ScrCom0031ZipFileRequest
): Promise<ScrCom0031ZipFileResponse> => {
    const response = await comApiClient.post(
        'com/scr-com-0031/file-output',
        request
    );
    return response.data;
};