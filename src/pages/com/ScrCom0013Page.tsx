import React, { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { TabDef, Tabs } from 'layouts/Tabs';

import ScrCom0013ChangeHistoryTab from './tabs/ScrCom0013ChangeHistoryTab';
import ScrCom0013CommissionDiscountPacksTab from './tabs/ScrCom0013CommissionDiscountPacksTab';
import ScrCom0013CommissionTab from './tabs/ScrCom0013CommissionTab';
import ScrCom0013CourceTab from './tabs/ScrCom0013CourceTab';
import ScrCom0013ServiceTab from './tabs/ScrCom0013ServiceTab';

/**
 * SCR-COM-0013 商品管理画面
 */
const ScrCom0013Page = () => {


  // router
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // state
  // 変更履歴管理番号
  const [changeHistoryNumber, setChangeHistoryNumber] = useState<string>('');


  const tabValues: TabDef[] = [
    { title: 'コース', hash: '#basic' },
    { title: 'サービス', hash: '#service' },
    { title: '手数料', hash: '#commission' },
    { title: '値引値増', hash: '#commission-discount-packs' },
    // 履歴表示の場合は変更履歴タブは非活性
    { title: '変更履歴', hash: '#change-history', disabled: changeHistoryNumber === '' ? true : false },
  ];

  // 履歴表示の初期化処理
  const params = searchParams.get('change-history-number');
  if (params !== undefined && params !== null) {
    setChangeHistoryNumber(params);
  }

  return (
    <Tabs tabDef={tabValues} defaultValue={location.hash}>
      <ScrCom0013CourceTab changeHisoryNumber={changeHistoryNumber} />
      <ScrCom0013ServiceTab changeHisoryNumber={changeHistoryNumber} />
      <ScrCom0013CommissionTab changeHisoryNumber={changeHistoryNumber} />
      <ScrCom0013CommissionDiscountPacksTab changeHisoryNumber={changeHistoryNumber} />
      <ScrCom0013ChangeHistoryTab changeHisoryNumber={changeHistoryNumber} />
    </Tabs>
  );
};


export default ScrCom0013Page;
