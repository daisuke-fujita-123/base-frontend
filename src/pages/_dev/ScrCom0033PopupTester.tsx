import React, { useState } from 'react';

import ScrCom0033Popup, {
  ScrCom0033PopupModel,
} from 'pages/com/popups/ScrCom0033Popup';

import { MainLayout } from 'layouts/MainLayout';
import { Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';

/**
 * 登録内容申請ポップアップ初期データ
 */
const initialValues: ScrCom0033PopupModel = {
  // 画面ID
  screenId: '',
  // タブID
  tabId: 2,
  // 申請金額
  applicationMoney: 0,
};

/**
 * SCR-COM-0033 登録内容申請（ポップアップ）
 */
const ScrCom0033PopupTester = () => {
  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0033PopupData, setScrCom0033PopupData] =
    useState<ScrCom0033PopupModel>(initialValues);

  /**
   * 画面側 確定ボタンクリック時のイベントハンドラ
   */
  const testHandleConfirm = () => {
    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0033PopupData({
      screenId: 'SCR-TRA-0023',
      // screenId: 'SCR-COM-0023',
      // タブID
      tabId: 1,
      // 申請金額
      applicationMoney: 0,
    });
  };

  /**
   * 画面側 キャンセルボタンクリック時のイベントハンドラ
   */
  const testHandleCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容申請ポップアップの確定ボタンクリック→ダイアログOK時のイベントハンドラ
   */
  const handleConfirm = (
    // 従業員ID1
    employeeId1: string,
    // 従業員名1
    emploeeName1: string,
    // 従業員メールアドレス1
    employeeMailAddress1: string,
    // 従業員ID2
    employeeId2: string,
    // 従業員名2
    emploeeName2: string,
    // 従業員ID3
    employeeId3: string,
    // 従業員名3
    emploeeName3: string,
    // 従業員ID4
    employeeId4: string,
    // 従業員名4
    emploeeName4: string,
    // 申請コメント
    applicationComment: string
  ) => {
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った従業員ID1：' + employeeId1
    );
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った従業員名1：' + emploeeName1
    );
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った従業員メールアドレス1：' +
        employeeMailAddress1
    );
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った従業員ID2：' + employeeId2
    );
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った従業員名2：' + emploeeName2
    );
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った従業員ID3：' + employeeId3
    );
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った従業員名3：' + emploeeName3
    );
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った従業員ID4：' + employeeId4
    );
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った従業員名4：' + emploeeName4
    );
    console.log(
      '登録ボタン押下後 呼び出し元画面にて受け取った申請コメント：' +
        applicationComment
    );
    setIsOpenPopup(false);
  };

  /**
   * 登録内容申請ポップアップ キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    setIsOpenPopup(false);
  };

  return (
    <>
      <MainLayout>
        登録内容申請ポップアップ テスト用画面
        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={testHandleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={testHandleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容申請ポップアップ */}
      {isOpenPopup && (
        <ScrCom0033Popup
          isOpen={isOpenPopup}
          data={scrCom0033PopupData}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default ScrCom0033PopupTester;
