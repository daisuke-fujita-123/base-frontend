import React, { useState } from 'react';

import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032Popup';

import { MainLayout } from 'layouts/MainLayout';
import { Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';

/**
 * 登録内容確認ポップアップ初期データ
 */
const initialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: '',
};

/**
 * SCR-COM-0032 登録内容確認（ポップアップ）
 */
const ScrCom0032PopupTester = () => {
  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData] = useState<ScrCom0032PopupModel>(initialValues);

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = () => {
    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handleRegistConfirm = (registrationChangeMemo: string) => {
    console.log(
      '確定ボタン押下後 呼び出し元画面にて受け取った登録変更メモ：' +
        registrationChangeMemo
    );
    setIsOpenPopup(false);
  };

  /**
   * 登録内容確認ポップアップの登録承認ボタンクリック時のイベントハンドラ
   * @param registrationChangeMemo 登録変更メモ(登録内容確認ポップアップからの受取)
   */
  const handleApprovalConfirm = (registrationChangeMemo: string) => {
    console.log(
      '登録承認ボタン押下後 呼び出し元画面にて受け取った登録変更メモ：' +
        registrationChangeMemo
    );
    setIsOpenPopup(false);
  };

  return (
    <>
      <MainLayout>
        登録内容確認ポップアップ テスト用画面
        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {isOpenPopup && (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          handleRegistConfirm={handleRegistConfirm}
          handleApprovalConfirm={handleApprovalConfirm}
          handleCancel={handlePopupCancel}
        />
      )}
    </>
  );
};

export default ScrCom0032PopupTester;
