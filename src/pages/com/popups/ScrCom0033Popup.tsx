import React, { useRef, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';

import { SelectValue } from 'controls/Select';

import { useForm } from 'hooks/useForm';

import { generate } from 'utils/BaseYup';

/**
 * 登録内容申請ポップアップデータモデル
 */
export interface ScrCom0033PopupModel {
  // 画面ID
  screenId: string;
  // タブID
  tabId: string;
  // 一括登録ID
  allRegistrationId: string;
  // マスタID
  masterId: string;
  // 登録変更メモ
  registChangeMemo: string;
  // 変更予定日
  changeExpectDate: string;
  // 申請金額
  applicationMoney: string;
  // 申請者ID
  applicationId: string;
  // プログラムID
  programId: string;
}


/**
* 登録内容申請ポップアップのProps
*/
interface ScrCom0033PopupProps {
  isOpen: boolean;
  data: ScrCom0033PopupModel;
  // TODO: キャンセルが登録内容ポップアップからか一括登録確認画面からかで処理変更する
  handleCancel: () => void;
  // 確定ボタン押下時に渡すパラメータ
  handlePopupConfirm: (
    selectValues: SelectValuesModel,
    applicationComment: string,
  ) => void;
}


/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 第１承認者
  approvalUser_1: SelectValue[];
  // 第２承認者
  approvalUser_2: SelectValue[];
  // 第３承認者
  approvalUser_3: SelectValue[];
  // 第４承認者
  approvalUser_4: SelectValue[];
}


/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 第１承認者
  approvalUser_1: [],
  // 第２承認者
  approvalUser_2: [],
  // 第３承認者
  approvalUser_3: [],
  // 第４承認者
  approvalUser_4: [],
};


/**
 * バリデーションスキーマ
 */
const validationSchama = generate([
  'applicationComment',
])


/**
 * 登録内容申請ポップアップ
 */
const ScrCom0033Popup = (props: ScrCom0033PopupProps) => {
  // props
  const { isOpen, data } = props;

  // form
  const methods = useForm({
    defaultValues: {
      applicationComment: '',
    }, resolver: yupResolver(validationSchama),
  });
  const {
    getValues,
  } = methods;


  // ポップアップ確定ボタン押下時の処理(ダイアログを呼び出す)
  const handlePopupConfirm = () => {
    // ダイアログを表示
    setTitle('申請内容を確定してよろしいでしょうか');
    setHandleDialog(true);
  }


  // ポップアップキャンセルボタン押下時の処理
  const handleCancel = () => {
    // 画面ID => 登録内容確認ポップアップ空の遷移
    if (data.screenId === 'SCR-COM-0032') {
      // TODO: 取引会計管理かそれ以外かで判定する 判定方法不明
      if (isTra) {
        setTitle('申請データ(未提出)を登録しますがよろしいでしょうか');
      } else {
        setTitle('登録データが破棄されますがよろしいでしょうか');
      }
      // 画面ID => 一括登録確認画面からの遷移
    } else if (data.screenId === '') {
      setTitle('登録データが破棄されますがよろしいでしょうか。');
    }
    // ダイアログを表示
    setHandleDialog(true);
  }


  // ダイアログのOKボタン押下時の処理(呼び出し元画面で登録を行う)
  const handleDialogConfirm = () => {
    // 取引会計管理の処理の場合登録を行う
    if (isTra) {
      props.handlePopupConfirm(
        // 第１～第４承認者
        selectValues,
        // 申請コメント
        getValues('applicationComment'),
      );
    }
    setHandleDialog(false);
  }

  // button
  const popupButtons = [
    { name: 'キャンセル', onClick: handleCancel, },
    { name: '確定', onClick: handlePopupConfirm },
  ];

  const dialogButtons = [
    { name: 'キャンセル', onClick: () => setHandleDialog(false) },
    { name: 'OK', onClick: handleDialogConfirm },
  ]


  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 判定に使用する必要承認ステップ数
  const [needApprovalStep, setNeedApprovalStep] = useState<number>()
  // 判定に使用する取引会計管理かどうかのフラグ
  const [isTra, setIsTra] = useState<boolean>(true);

  // メッセージポップアップ(ダイアログ)
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  // 呼び出し元画面遷移時か登録内容申請ポップアップ起動時か判定するフラグ
  const isFirstRender = useRef(false)

  return (
    <>
    </>
  );
}
export default ScrCom0033Popup;