import React from 'react';
import { useLocation } from 'react-router-dom';

import ScrCom0026ApprovalKindTab from 'pages/com/tabs/ScrCom0026ApprovalKindTab';
import ScrCom0026ApprovalPermissionTab from 'pages/com/tabs/ScrCom0026ApprovalPermissionTab';
import ScrCom0026ChangeHistoryTab from 'pages/com/tabs/ScrCom0026ChangeHistoryTab';
import ScrCom0026MasterPermissionTab from 'pages/com/tabs/ScrCom0026MasterPermissionTab';
import ScrCom0026ScreenPermissionTab from 'pages/com/tabs/ScrCom0026ScreenPermissionTab';

import { TabDef, Tabs } from 'layouts/Tabs';

/**
 * SCR-COM-0026 アクセス権限管理画面
 */
const ScrCom0026Page = () => {
  // router
  const location = useLocation();

  // tab
  const tabValues: TabDef[] = [
    { title: '画面権限', hash: '#screen' },
    { title: 'マスタ権限', hash: '#master' },
    { title: '承認種類', hash: '#approval-kind' },
    { title: '承認権限', hash: '#approvalpermission' },
    { title: '変更履歴', hash: '#changehistory' },
  ];

  return (
    <>
      <Tabs tabDef={tabValues} defaultValue={location.hash}>
        <ScrCom0026ScreenPermissionTab />
        <ScrCom0026MasterPermissionTab />
        <ScrCom0026ApprovalKindTab />
        <ScrCom0026ApprovalPermissionTab />
        <ScrCom0026ChangeHistoryTab />
      </Tabs>
    </>
  );
};

export default ScrCom0026Page;
