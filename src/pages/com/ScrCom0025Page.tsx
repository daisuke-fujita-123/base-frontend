import React, { useState, createContext, useEffect } from 'react';
import { TabDef, Tabs } from 'layouts/Tabs';
import ScrCom0025OrganizationTab from 'pages/com/tabs/ScrCom0025OrganizationTab';
import ScrCom0025PostTab from 'pages/com/tabs/ScrCom0025PostTab';
import ScrCom0025EmployeeTab from 'pages/com/tabs/ScrCom0025EmployeeTab';
import { useLocation } from 'react-router-dom';

/**
 * SCR-COM-0025 組織管理画面
 */
const ScrCom0025Page = () => {

  // router
  const location = useLocation();

  // tab
  const tabValues: TabDef[] = [
    { title: '組織情報一覧', hash: '#organization' },
    { title: '役職情報一覧', hash: '#post' },
    { title: '従業員情報一覧', hash: '#employee' },
  ];

  return (
    <>
      <Tabs tabDef={tabValues} defaultValue={location.hash}>
        <ScrCom0025OrganizationTab />
        <ScrCom0025PostTab />
        <ScrCom0025EmployeeTab />
      </Tabs>
    </>
  );
};

export default ScrCom0025Page;
