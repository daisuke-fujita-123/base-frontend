import { TabDef, Tabs } from 'layouts/Tabs';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ScrMem0003BasicTab from './tabs/ScrMem0003BasicTab';
import ScrMem0003CreditTab from './tabs/ScrMem0003CreditTab';
import ScrMem0003CreditLimitTab from './tabs/ScrMem0003CreditLimitTab';
import ScrMem0003ContractTab from './tabs/ScrMem0003ContractTab';
import ScrMem0003BaseTab from './tabs/ScrMem0003BaseTab';
import ScrMem0003DealHistoryTab from './tabs/ScrMem0003DealHistoryTab';
import ScrMem0003ChangeHistoryTab from './tabs/ScrMem0003ChangeHistoryTab';

export interface TabDisabledsModel {
  ScrMem0003BasicTab: boolean;
  ScrMem0003CreditTab: boolean;
  ScrMem0003CreditLimitTab: boolean;
  ScrMem0003ContractTab: boolean;
  ScrMem0003BaseTab: boolean;
  ScrMem0003DealHistoryTab: boolean;
  ScrMem0003ChangeHistoryTab: boolean;
}

/**
 * SCR-MEM-0003 法人情報詳細画面
 */
const ScrMem0003Page = () => {
    // router
    const location = useLocation();

    const ref = document.referrer

    const [tabDisableds, setTabDisableds] = useState<TabDisabledsModel>({
      ScrMem0003BasicTab: false,
      ScrMem0003CreditTab: false,
      ScrMem0003CreditLimitTab: false,
      ScrMem0003ContractTab: false,
      ScrMem0003BaseTab: false,
      ScrMem0003DealHistoryTab: false,
      ScrMem0003ChangeHistoryTab: false,
    })

    const tabValues: TabDef[] = [
      { title: '基本情報', hash: '#basic', disabled: tabDisableds.ScrMem0003BasicTab },
      { title: '与信情報', hash: '#credit', disabled: tabDisableds.ScrMem0003CreditTab  },
      { title: '与信制限', hash: '#credit-limit', disabled: tabDisableds.ScrMem0003CreditLimitTab  },
      { title: '契約情報', hash: '#contract', disabled: tabDisableds.ScrMem0003ContractTab  },
      { title: '拠点情報', hash: '#base', disabled: tabDisableds.ScrMem0003BaseTab  },
      { title: '取引履歴', hash: '#deal-history', disabled: tabDisableds.ScrMem0003DealHistoryTab  },
      { title: '変更履歴', hash: '#change-hisotry', disabled: tabDisableds.ScrMem0003ChangeHistoryTab  },
    ];


    const chengeTabDisableds= (tabDisableds: TabDisabledsModel) => {
      setTabDisableds(tabDisableds);
    }
  
    return (
      <Tabs tabDef={tabValues} defaultValue={location.hash}>
        <ScrMem0003BasicTab chengeTabDisableds={chengeTabDisableds}/>
        <ScrMem0003CreditTab chengeTabDisableds={chengeTabDisableds}/>
        <ScrMem0003CreditLimitTab />
        <ScrMem0003ContractTab />
        <ScrMem0003BaseTab />
        <ScrMem0003DealHistoryTab />
        <ScrMem0003ChangeHistoryTab />
      </Tabs>
    );
};

export default ScrMem0003Page;
