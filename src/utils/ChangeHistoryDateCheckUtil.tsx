import React, { useEffect, useState } from 'react';

import { Dialog } from 'controls/Dialog';
import { SelectValue } from 'controls/Select';

/**
 * changeHistoryDateCheckProps
 */
interface changeHistoryDateCheckProps {
  // 反映予定日
  changeExpectedDate: string;
  // 変更予約日
  changeHistoryNumber: string;
  // 表示切替フラグ
  isChangeHistoryBtn: boolean;
  // 変更予約日リスト
  changeHistory: SelectValue[];
  // changeHistoryDateCheckフラグ
  isOpen: boolean;
  // 確定イベント
  handleConfirm: (checkFlg: boolean) => void;
}

// 反映予定日整合性チェック
const ChangeHistoryDateCheckUtil = (props: changeHistoryDateCheckProps) => {
  const {
    changeExpectedDate,
    changeHistoryNumber,
    isChangeHistoryBtn,
    changeHistory,
    isOpen,
    handleConfirm,
  } = props;

  const [dialog, setDialog] = useState('');
  const [handleDialog, setHandleDialog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 変更予約ありフラグ
      const isChangeHistory = changeHistory.length <= 0 ? false : true;
      // 変更予定日取得
      let changeHistoryDate = '';
      if (isChangeHistory) {
        changeHistory.find((x) => {
          if (x.value === changeHistoryNumber) {
            changeHistoryDate = x.displayValue;
          }
        });
      }

      if (changeExpectedDate !== '') {
        // 反映予定日≦操作日の場合、エラー
        if (new Date(changeExpectedDate) <= new Date()) {
          setDialog('error');
          setHandleDialog(true);
          return;
        }

        // 反映予定日＝変更予約日の場合、エラー
        if (isChangeHistory) {
          changeHistory.map((x) => {
            if (new Date(x.value) === new Date(changeExpectedDate)) {
              setDialog('error');
              setHandleDialog(true);
              return;
            }
          });
        }
      }

      // 変更予約ありで、かつ表示切替を実施していない場合
      if (!isChangeHistoryBtn && isChangeHistory) {
        setDialog('warning');
        setHandleDialog(true);
        return;
      } else if (isChangeHistoryBtn && isChangeHistory) {
        // 変更予約ありで、かつ表示切替を実施した場合
        // 反映予定日＝ブランクの場合、エラー
        if (changeExpectedDate === '') {
          setDialog('error');
          setHandleDialog(true);
          return;
        } else if (
          new Date(changeExpectedDate) <= new Date(changeHistoryDate)
        ) {
          // 反映予定日≦変更予約情報で選択した日付の場合、エラー
          setDialog('error');
          setHandleDialog(true);
          return;
        } else {
          // 上記以外の場合、アラート
          setDialog('warning');
          setHandleDialog(true);
          return;
        }
      }

      if (changeExpectedDate === '') {
        setDialog('error');
        setHandleDialog(true);
      }

      handleConfirm(true);
    }
  }, [isOpen]);

  return (
    <>
      {dialog === 'error' ? (
        <Dialog
          open={handleDialog}
          title={'反映予定日が誤っています。'}
          buttons={[
            {
              name: 'OK',
              onClick: () => {
                setHandleDialog(false);
                handleConfirm(false);
              },
            },
          ]}
        />
      ) : (
        <Dialog
          open={handleDialog}
          title={'反映予定が既にありますかが、よろしいでしょうか？'}
          buttons={[
            {
              name: 'YES',
              onClick: () => {
                setHandleDialog(false);
                handleConfirm(true);
              },
            },
            {
              name: 'NO',
              onClick: () => {
                setHandleDialog(false);
                handleConfirm(false);
              },
            },
          ]}
        />
      )}
    </>
  );
};

export default ChangeHistoryDateCheckUtil;
