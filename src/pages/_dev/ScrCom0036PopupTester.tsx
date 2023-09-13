import React, { useState } from 'react';

import ScrCom0036Popup, {
  ScrCom0036PopupModel,
} from 'pages/com/popups/ScrCom0036Popup';

import { MainLayout } from 'layouts/MainLayout';
import { Stack } from 'layouts/Stack';

import { PrimaryButton } from 'controls/Button';
import { Typography } from 'controls/Typography';

import { ScrCom0036GetAllRegistrationWorkResult } from 'apis/com/ScrCom0036Api';

/**
 * SCR-COM-0036 一括登録エラー確認（ポップアップ）
 */
const ScrCom0036PopupTester = () => {
  // エラー・ワーニング内容の初期化
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [contents, setContents] = useState<ScrCom0036PopupModel>({
    errors: [
      {
        columnName: '',
        columnValue: '',
        message: '',
      },
    ],
    warnings: [
      {
        columnName: '',
        columnValue: '',
        message: '',
      },
    ],
  });

  // 初期表示
  const a = async () => {
    const response = await ScrCom0036GetAllRegistrationWorkResult({
      // 引数の値は仮のサンプル
      allRegistrationId: 'BRG-COM-0002',
      changeHistoryNumber: 1000,
      number: 1000,
    });
    const errList: {
      columnName: string;
      columnValue: string;
      message: string;
    }[] = [];
    const warnList: {
      columnName: string;
      columnValue: string;
      message: string;
    }[] = [];
    if (response.errorList && response.warnList) {
      // 項目名が画面側とAPIレスポンスで異なるため、詰めなおす。
      response.errorList.forEach((e) => {
        const err = {
          columnName: e.columnName,
          columnValue: e.columnValue,
          message: e.columnMessage,
        };
        errList.push(err);
      });
      response.warnList.forEach((e) => {
        // 項目名が画面側とAPIレスポンスで異なるため、詰めなおす。
        const warn = {
          columnName: e.columnName,
          columnValue: e.columnValue,
          message: e.columnMessage,
        };
        warnList.push(warn);
      });
    }
    // ポップアップに表示するコンテンツを設定
    setContents({
      errors: errList,
      warnings: warnList,
    });
    setIsOpenPopup(true);
  };

  // キャンセル時の処理
  const getAllRegistErrInfo = () => {
    setIsOpenPopup(false);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <h1>SCR-COM-0036 一括登録エラー確認（ポップアップ）動確用ページ</h1>
          <Typography>画面ID：{'SCR-COM-0036'}</Typography>
        </MainLayout>
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <PrimaryButton onClick={a} disable={isOpenPopup}>
              一括登録エラー確認
            </PrimaryButton>
          </Stack>
        </MainLayout>
      </MainLayout>
      <ScrCom0036Popup
        isOpen={isOpenPopup}
        setIsOpen={getAllRegistErrInfo}
        contents={contents}
      />
    </>
  );
};

export default ScrCom0036PopupTester;
