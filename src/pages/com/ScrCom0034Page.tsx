import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SCR-COM-0034 一括登録確認画面パラメータモデル
 */
export interface ScrCom0034PageParamModel {
  // 画面ID
  screanId?: string | null;
  // タブID
  tabId?: number | null;
  // 一括登録ID
  allRegistrationId?: string | null;
  // 取込ファイル
  importFile?: File | null;
  // 変更履歴番号
  changeHistoryNumber?: number | null;
}

/**
 * SCR-COM-0034 一括登録確認画面
 */
const ScrCom0034Page = () => {
  const location = useLocation();
  // 画面パラメータ取得
  const pageParams = useState<ScrCom0034PageParamModel>(
    location.state as ScrCom0034PageParamModel
  );
  console.log(pageParams);
  return <h1>SCR-COM-0034 一括登録確認画面</h1>;
};

export default ScrCom0034Page;
