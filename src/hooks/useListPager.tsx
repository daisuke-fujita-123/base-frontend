import React, { useState } from "react";
// Mui
import Pagination from '@mui/material/Pagination';
// Layouts
import { Stack } from 'layouts/Stack';
// Controls
import { Typography } from 'controls/Typography';

// Interface
interface ListPager {
    // 現在ページ番号
    currentPage: number,
    // 総ページ数
    totalPageCount: number,
    // 総件数
    totalCount: number,
    // 件数FROM
    fromCount: number,
    // 件数TO
    toCount: number,
}

// 一覧形式ページャ
export const useListPager = () => {
  const [listPager, setListPager] = useState<ListPager>({
    currentPage: 0,
    totalPageCount: 0,
    totalCount: 0,
    fromCount: 0,
    toCount: 0,
  });

  /**
   * 引数を元にListPagerを設定
   * @param limit 1ページ上限数
   * @param offset オフセット
   * @param page 現在ページ番号
   * @param totalCount 総件数
   * @param rowCount 1ページ行数
   */
  const regenerateListPager = (
    limit: number,
    offset: number,
    page: number,
    totalCount: number,
    rowCount: number
 ): void => {
    setListPager({
        currentPage: page,
        // currentPage: Math.floor(res.offset / res.limit) + 1,
        totalPageCount: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        fromCount: offset + 1,
        toCount: offset + rowCount,
    });
  }

  /**
   * 一覧形式のページャーレイアウトを返却
   * @param callbackFunc コールバック関数（リクエストパラメタ, ページ番号）
   * @param params パラメタ（コールバック関数）
   * @returns 
   */
  const renderListPager = (
    callbackFunc: (params: any, page: number)=>void,
    params: any
  ) => {
    if (listPager.totalCount == 0) {
      return (<></>);
    }
    return(
      <>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Typography variant="h6" color="#000000">検索結果：{listPager.totalCount.toLocaleString()} 件（ {listPager.fromCount.toLocaleString()} 件 ～ {listPager.toCount.toLocaleString()} 件）</Typography>
          <Pagination size="small" shape="rounded" count={listPager.totalPageCount} page={listPager.currentPage} onChange={(e, page)=>callbackFunc(params, page)} />
        </Stack>
      </>
    );
  }

  return [listPager, {setListPager, regenerateListPager, renderListPager}] as const;
}
