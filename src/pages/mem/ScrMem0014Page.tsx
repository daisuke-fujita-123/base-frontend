import React from 'react';
import { useLocation } from 'react-router-dom';

import { TabDef, Tabs } from 'layouts/Tabs';

/**
 * ScrMem0014Page 法人情報詳細画面
 */
const ScrMem0014Page = () => {
  // router
  const location = useLocation();

  // TODO hashを実際のハッシュ値に変更する
  const tabDefs: TabDef[] = [
    { title: '基本情報', hash: 'A' },
    { title: 'サービス情報', hash: 'B' },
    { title: '値引割増/請求情報', hash: 'C' },
    { title: 'ライブ情報', hash: 'D' },
  ];

  return (
    <Tabs tabDef={tabDefs} defaultValue={location.hash}>
      <h1>基本情報</h1>
      <h1>サービス情報</h1>
      <h1>値引割増/請求情報</h1>
      <h1>ライブ情報</h1>
    </Tabs>
  );
};

export default ScrMem0014Page;

