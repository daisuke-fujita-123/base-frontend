import React, { useState } from 'react';

import ScrCom0038Popup, {
  ScrCom0038PopupModel,
} from 'pages/com/popups/ScrCom0038Popup';

import { MainLayout } from 'layouts/MainLayout';
import { Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';

/**
 * エラー内容確認ポップアップ 初期データ
 */
const initialValues: ScrCom0038PopupModel = {
  // エラー内容リスト
  errorList: [],
  // ワーニング内容リスト
  warningList: [],
  // 遷移元画面ID
  expirationScreenId: '',
};

/**
 * SCR-COM-0038 エラー確認（ポップアップ）
 */
const ScrCom0038PopupTester = () => {
  const [isOpenScrCom0038Popup, setIsOpenScrCom0038Popup] =
    useState<boolean>(false);
  const [scrCom0038PopupData, setScrCom0038PopupData] =
    useState<ScrCom0038PopupModel>(initialValues);

  /**
   * 画面側 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = () => {
    setScrCom0038PopupData({
      errorList: [
        {
          errorMessage: 'エラー１',
        },
        // {
        //   errorMessage: 'エラー２',
        // },
      ],
      warningList: [
        {
          warningMessage: 'ワーニング１',
        },
        // {
        //   warningMessage: 'ワーニング２',
        // },
      ],
      expirationScreenId: 'SCR-TRA-0018',
    });
    setIsOpenScrCom0038Popup(true);
  };

  /**
   * 画面側 キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    setIsOpenScrCom0038Popup(false);
  };

  /**
   * エラー確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handleErrorPopupCancel = () => {
    setIsOpenScrCom0038Popup(false);
  };

  return (
    <>
      <MainLayout>
        エラー内容確認ポップアップ テスト用画面
        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>
      {/* エラー確認ポップアップ */}
      {isOpenScrCom0038Popup && (
        <ScrCom0038Popup
          isOpen={isOpenScrCom0038Popup}
          data={scrCom0038PopupData}
          handleCancel={handleErrorPopupCancel}
        />
      )}
    </>
  );
};
export default ScrCom0038PopupTester;
