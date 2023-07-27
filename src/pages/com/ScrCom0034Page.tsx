import React from 'react';
import { useLocation } from 'react-router-dom';
// controls
import { Typography } from 'controls/Typography';
// layouts
import { MainLayout } from 'layouts/MainLayout/MainLayout';

/**
 * SCR-COM-0034 一括登録確認画面パラメータモデル
 */
export interface ScrCom0034PageParamModel {
  // 画面ID
  screanId?: string;
  // タブID
  tabId?: number;
  // 一括登録ID
  allRegistrationId?: string;
  // 取込ファイル
  importFile?: File;
  // 変更履歴番号
  changeHistoryNumber?: number;
}

/**
 * SCR-COM-0034 一括登録確認画面
 */
const ScrCom0034Page = () => {
  const location = useLocation();
  // 画面パラメータ取得
  const pageParams = location.state.scrCom0034PageParams;

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <h1>SCR-COM-0034 一括登録確認画面（</h1>
          <Typography>一括登録ID：{pageParams.allRegistrationId}</Typography>
          <Typography>画面ID：{pageParams.screanId}</Typography>
          <Typography>タブID：{pageParams.tabId}</Typography>
          <Typography>ファイル(size)：{pageParams.importFile?.size}</Typography>
          <Typography>
            変更履歴番号：{pageParams.changeHistoryNumber}
          </Typography>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrCom0034Page;

