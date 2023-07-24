import React from 'react';
import { useLocation } from 'react-router-dom';

import ScrMem0003BranchNumberTab from 'pages/mem/tabs/ScrMem0003BranchNumberTab';

import { TabDef, Tabs } from 'layouts/Tabs';

/**
 * 法人情報詳細画面
 */
const ScrMem0003Page = () => {
  // router
  const location = useLocation();

  const tabValues: TabDef[] = [
    /*
    { title: '基本情報', hash: '#basic' },
    { title: '与信情報', hash: '#credit' },
    { title: '与信制限', hash: '#credit-limit' },
    { title: '契約情報', hash: '#contract' },
    { title: '拠点情報', hash: '#base' },
    { title: '取引履歴', hash: '#deal-history' },
    { title: '変更履歴', hash: '#change-hisotry' },
    */
    { title: '拠点枝番紐付け', hash: '#branch-number' },
  ];

  return (
    <Tabs tabDef={tabValues} defaultValue={location.hash}>
      {/*
      <ScrMem0003BasicTab />
      <ScrMem0003CreditTab />
      <ScrMem0003CreditLimitTab />
      <ScrMem0003ContractTab />
      <ScrMem0003BaseTab />
      <ScrMem0003DealHistoryTab />
      <ScrMem0003ChangeHistoryTab />
      */}
      <ScrMem0003BranchNumberTab />
      {/* TODO 複数Tabを配置しないとエラーとなるため、同じTab定義を重複して配置 */}
      <ScrMem0003BranchNumberTab />
    </Tabs>
  );
};

export default ScrMem0003Page;
