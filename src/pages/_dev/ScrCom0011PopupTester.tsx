import React, { useState } from 'react';

import ScrCom0011Popup, {
  ScrCom0011PopupModel,
} from 'pages/com/popups/ScrCom0011Popup';

import { MainLayout } from 'layouts/MainLayout';
import { Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';

/**
 * 帳票選択ポップアップ初期データ
 */
const initialValues: ScrCom0011PopupModel = {
  screenId: '',
};

/**
 * SCR-COM-0011 帳票選択（ポップアップ）
 */
const ScrCom0011PopupTester = () => {
  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0011PopupData, setScrCom0011PopupData] =
    useState<ScrCom0011PopupModel>(initialValues);

  /**
   * 画面側確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = () => {
    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0011PopupData({
      screenId: 'SCR-COM-0023',
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 帳票選択ポップアップの出力ボタンクリック時のイベントハンドラ
   * @param selectValues
   * @param commentRow
   * @param commentLine
   * @param comment

   */
  const handlePopupConfirm = (
    // 帳票ID
    reportId: string,
    // 帳票名
    reportName: string,
    // コメント行数可変を戻り値にしたい
    reportComment: string,
    // 初期値
    defaultValue: string
  ) => {
    setIsOpenPopup(false);
    console.log(
      '出力ボタン押下後 呼び出し元画面にて受け取った帳票ID：' + reportId
    );
    console.log(
      '出力ボタン押下後 呼び出し元画面にて受け取った帳票名：' + reportName
    );
    console.log(
      '出力ボタン押下後 呼び出し元画面にて受け取ったコメント：' + reportComment
    );
    console.log(
      '出力ボタン押下後 呼び出し元画面にて受け取った初期値：' + defaultValue
    );
  };

  /**
   * 帳票選択ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        帳票選択ポップアップ テスト用画面
        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {isOpenPopup && (
        <ScrCom0011Popup
          isOpen={isOpenPopup}
          data={scrCom0011PopupData}
          handleConfirm={handlePopupConfirm}
          handleCancel={handlePopupCancel}
        />
      )}
    </>
  );
};

export default ScrCom0011PopupTester;
