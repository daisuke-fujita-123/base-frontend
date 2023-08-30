import React, { useState } from 'react';

import ScrCom0018Popup, {
  SelectServiceInfoModel,
} from 'pages/com/popups/ScrCom0018Popup';

/**
 * SCR-COM-0018 サービス一覧（ポップアップ）
 */
const ScrCom0018PopupTester = () => {
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(true);
  const [test, setTest] = useState<SelectServiceInfoModel[]>([]);
  return (
    <ScrCom0018Popup
      isOpen={isOpenPopup}
      setIsOpen={setIsOpenPopup}
      selectServiceInfo={setTest}
    />
  );
};

export default ScrCom0018PopupTester;
