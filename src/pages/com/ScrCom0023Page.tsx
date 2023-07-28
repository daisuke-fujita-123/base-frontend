import React, { useEffect, useState } from 'react';

import ScrCom0038Popup, {
  ScrCom0038PopupModel,
} from './popups/ScrCom0038Popup';

/**
 * SCR-COM-0023 ライブ会場一覧画面
 */
const ScrCom0023Page = () => {
  const [isOpenScrCom0038Popup, setIsOpenScrCom0038Popup] =
    useState<boolean>(false);
  const [scrCom0038PopupData, setScrCom0038PopupData] =
    useState<ScrCom0038PopupModel>();

  // 初期表示
  useEffect(() => {
    setScrCom0038PopupData({
      errorList: [
        {
          errorMessage: 'エラー１',
        },
        {
          errorMessage: 'エラー２',
        },
      ],
      warningList: [
        {
          warningMessage: 'ワーニング１',
        },
        {
          warningMessage: 'ワーニング２',
        },
      ],
      expirationScreenId: '',
    });
    setIsOpenScrCom0038Popup(true);
  }, []);

  // /**
  //  * エラー確認ポップアップの確定ボタンクリック時のイベントハンドラ
  //  */
  // const handleErrorPopupConfirm = () => {
  //   setIsOpenScrCom0038Popup(false);
  // };

  /**
   * エラー確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handleErrorPopupCancel = () => {
    setIsOpenScrCom0038Popup(false);
  };

  return (
    // エラー確認ポップアップ
    <ScrCom0038Popup
      isOpen={isOpenScrCom0038Popup}
      data={scrCom0038PopupData}
      // handleConfirm={handleErrorPopupConfirm}
      handleCancel={handleErrorPopupCancel}
    />
  );
};

export default ScrCom0023Page;
