import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import ScrMem0010BasicTab from 'pages/mem/tabs/ScrMem0010BasicTab';
import ScrMem0010ContractListTab from 'pages/mem/tabs/ScrMem0010ContractListTab';


import { TabDef, Tabs } from 'layouts/Tabs';

/**
 * SCR-MEM-0010 事業拠点詳細画面
 */
const ScrMem0010Page = () => {
  // router
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const businessBaseId = searchParams.get('businessBaseId');
  const applicationId = searchParams.get('applicationId');

  // TODO hashを実際のハッシュ値に変更する
  const tabDefs: TabDef[] = [
    { title: '基本情報', hash: '#basic' },
    { title: '契約一覧', hash: '#Contract-list', disabled:businessBaseId!==null||applicationId!==null?false:true}
  ];

  return(
    <Tabs tabDef={tabDefs} defaultValue={location.hash}>
      <ScrMem0010BasicTab />
      <ScrMem0010ContractListTab />
    </Tabs>
  )

};

export default ScrMem0010Page;
