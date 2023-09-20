import React from 'react';
import { useLocation } from 'react-router-dom';

import { TabDef, Tabs } from 'layouts/Tabs';

import ScrTra0001BasicTab from './tabs/ScrTra0001BasicTab';
import ScrTra0001ChangeHistoryTab from './tabs/ScrTra0001ChangeHistoryTab';

/**
 * SCR-TRA-0001 取引管理マスタ一覧画面
 */
const ScrTra0001Page = () => {
  // router
  const location = useLocation();

  const tabValues: TabDef[] = [
    { title: '基本情報', hash: '#basic' },
    { title: '変更履歴', hash: '#change-hisotry' },
  ];

  return (
    <Tabs tabDef={tabValues} defaultValue={location.hash}>
      <ScrTra0001BasicTab />
      <ScrTra0001ChangeHistoryTab />
    </Tabs>
  );
};

export default ScrTra0001Page;
