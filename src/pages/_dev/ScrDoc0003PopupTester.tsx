import React, { useState } from 'react';

import ScrDoc0003Popup from 'pages/doc/popups/ScrDoc0003Popup';

import { RightBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';

import { PrintButton } from 'controls/Button';

/**
 * SCR-DOC-0003 配送伝票一括印刷（ポップアップ）
 */
const ScrDoc0003PopupTester = () => {
  const [isOpenScrDoc0003Popup, setIsOpenScrDoc0003Popup] =
    useState<boolean>(false);

  /**
   * 画面側 一括印刷ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = () => {
    setIsOpenScrDoc0003Popup(true);
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <RightBox>
            <PrintButton onClick={handleConfirm}>一括印刷</PrintButton>
          </RightBox>
        </MainLayout>
      </MainLayout>
      {/* 配送伝票一括印刷ポップアップ */}
      {isOpenScrDoc0003Popup && (
        <ScrDoc0003Popup isOpen={isOpenScrDoc0003Popup} />
      )}
    </>
  );
};
export default ScrDoc0003PopupTester;
