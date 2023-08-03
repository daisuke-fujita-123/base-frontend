import React from 'react';
import { useLocation } from 'react-router-dom';

import { TabDef, Tabs } from 'layouts/Tabs';

import ScrCom0007BasicTab from './tabs/ScrCom0007BasicTab';
import ScrCom0007ChangeHistoryTab from './tabs/ScrCom0007ChangeHistoryTab';

/**
 * SCR-COM-0007 帳票管理画面
 */
const ScrCom0007Page = () => {
  // router
  const location = useLocation();

  const tabValues: TabDef[] = [
    { title: '基本情報', hash: '#basic' },
    { title: '変更履歴', hash: '#change-hisotry' },
  ];

  return (
    <Tabs tabDef={tabValues} defaultValue={location.hash}>
      <ScrCom0007BasicTab />
      <ScrCom0007ChangeHistoryTab />
    </Tabs>
  );
};
export default ScrCom0007Page;
