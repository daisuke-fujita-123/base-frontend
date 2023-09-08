import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { TabDef, Tabs } from 'layouts/Tabs';

import ScrMem0008BankTab from './tabs/ScrMem0008BankTab';
import ScrMem0008BasicTab from './tabs/ScrMem0008BasicTab';

export interface TabDisabledsModel {
  ScrMem0008BasicTab: boolean;
  ScrMem0008BankTab: boolean;
}

/**
 * SCR-MEM-0008 請求先詳細画面
 */
const ScrMem0008Page = () => {
  // router
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  const [tabDisableds, setTabDisableds] = useState<TabDisabledsModel>({
    ScrMem0008BasicTab: false,
    ScrMem0008BankTab: false,
  });

  // 初期表示処理
  useEffect(() => {
    if (applicationId !== null) {
      if (location.hash === '#basic') {
        setTabDisableds({
          ScrMem0008BasicTab: false,
          ScrMem0008BankTab: true,
        });
      } else {
        setTabDisableds({
          ScrMem0008BasicTab: true,
          ScrMem0008BankTab: false,
        });
      }
    }
  }, [applicationId]);

  const tabValues: TabDef[] = [
    {
      title: '基本情報',
      hash: '#basic',
      disabled: tabDisableds.ScrMem0008BasicTab,
    },
    {
      title: '口座情報',
      hash: '#bank',
      disabled: tabDisableds.ScrMem0008BankTab,
    },
  ];

  const chengeTabDisableds = (tabDisableds: TabDisabledsModel) => {
    setTabDisableds(tabDisableds);
  };

  return (
    <Tabs tabDef={tabValues} defaultValue={location.hash}>
      <ScrMem0008BasicTab chengeTabDisableds={chengeTabDisableds} />
      <ScrMem0008BankTab chengeTabDisableds={chengeTabDisableds} />
    </Tabs>
  );
};

export default ScrMem0008Page;
