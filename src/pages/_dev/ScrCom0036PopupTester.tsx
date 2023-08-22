import React, { useState } from 'react';

import ScrCom0036Popup, {
  ScrCom0036PopupModel,
} from 'pages/com/popups/ScrCom0036Popup';

import { ScrCom0036GetAllRegistrationWorkResult } from 'apis/com/ScrCom0036Api';

/**
 * SCR-COM-0036 一括登録エラー確認（ポップアップ）
 */
const ScrCom0036PopupTester = () => {
  // エラー・ワーニング内容の初期化
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

  // テスト用: ボタンを一旦エラー内容取得APIの呼出用に見立てて処理実施
  const getAllRegistErrInfo = async () => {
    const response = await ScrCom0036GetAllRegistrationWorkResult({
      // 引数の値は仮のサンプル
      allRegistrationId: 'BRG-COM-0001',
      changeHistoryNumber: 1,
      number: 1,
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
  };

  return (
    <ScrCom0036Popup
      isOpen={true}
      setIsOpen={getAllRegistErrInfo}
      contents={contents}
    />
  );
};

export default ScrCom0036PopupTester;
