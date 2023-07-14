import React, { useEffect, useRef, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';

import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';
import { ControlsStackItem } from 'layouts/Stack';

import { Select, SelectValue } from 'controls/Select';
import { Textarea } from 'controls/Textarea';
import { Typography } from 'controls/Typography';

import {
  approvalUser_1, approvalUser_2, approvalUser_3, approvalUser_4, ScrCom0033GetApprover,
  ScrCom0033GetApproverRequest
} from 'apis/com/ScrCom0033Api';

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
  // TODO: メッセージポップアップを表示してOKかキャンセルかで処理変更する
  handleConfirm: () => void;
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
  const { isOpen, handleCancel, handleConfirm, data } = props;

  const buttons = [
    { name: 'キャンセル', onClick: handleCancel, },
    { name: '確定', onClick: handleConfirm },
  ];

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 判定に使用する必要承認ステップ数
  const [needApprovalStep, setNeedApprovalStep] = useState<number>()

  // form
  const methods = useForm({
    defaultValues: {
      // TODO: 動的にバリデーションを変更する（文字数）
      applicationComment: '',
    }, resolver: yupResolver(validationSchama),
  });


  // 呼び出し元画面遷移時か登録内容申請ポップアップ起動時か判定するフラグ
  const isFirstRender = useRef(false)


  // 呼び出し元画面遷移時の処理
  useEffect(() => {
    isFirstRender.current = true
  }, [])


  // 登録内容申請ポップアップ表示時の処理
  useEffect(() => {
    const initialize = async () => {
      // API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ）
      const request: ScrCom0033GetApproverRequest = {
        /** 画面ID */
        screenId: data.screenId,
        /** タブID */
        tabId: data.tabId,
        /** 申請金額 */
        applicationMoney: data.applicationMoney,
        /** 申請者ID */
        appalicationId: data.applicationId,
      };
      const response = await ScrCom0033GetApprover(request);

      // 判定用の承認ステップ数を設定
      setNeedApprovalStep(response.needApprovalStep);

      // 画面にデータを設定
      setSelectValues({
        approvalUser_1: convertToChangeApprovalUser_1SelectValueModel(response.approvalUser_1),
        approvalUser_2: convertToChangeApprovalUser_2SelectValueModel(response.approvalUser_2),
        approvalUser_3: convertToChangeApprovalUser_3SelectValueModel(response.approvalUser_3),
        approvalUser_4: convertToChangeApprovalUser_4SelectValueModel(response.approvalUser_4),
      });
    }

    // ポップアップ起動時にのみ処理を実行する
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      initialize();
    }
  }, [isOpen])


  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser_1SelectValueModel = (
    changeExpectDateInfo: approvalUser_1[]
  ): SelectValue[] => {
    // 前回の第１承認者をローカルストレージより取得
    const lastApprover_1 = localStorage.getItem('lastApprover_1');
    return changeExpectDateInfo.map((x) => {
      return {
        // 表示属性名は従業員ID + 従業員名
        value: String(x.employeeId) + ' ' + x.employeeName,
        // 初期値は前回承認者が存在しない場合はブランクを設定
        displayValue: lastApprover_1 !== null ? lastApprover_1 : '',
      };
    });
  };

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser_2SelectValueModel = (
    changeExpectDateInfo: approvalUser_2[]
  ): SelectValue[] => {
    // 前回の第２承認者をローカルストレージより取得
    const lastApprover_2 = localStorage.getItem('lastApprover_2');
    return changeExpectDateInfo.map((x) => {
      return {
        // 表示属性名は従業員ID + 従業員名
        value: String(x.employeeId) + ' ' + x.employeeName,
        // 初期値は前回承認者が存在しない場合はブランクを設定
        displayValue: lastApprover_2 !== null ? lastApprover_2 : '',
      };
    });
  };

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser_3SelectValueModel = (
    changeExpectDateInfo: approvalUser_3[]
  ): SelectValue[] => {
    // 前回の第３承認者をローカルストレージより取得
    const lastApprover_3 = localStorage.getItem('lastApprover_3');
    return changeExpectDateInfo.map((x) => {
      return {
        // 表示属性名は従業員ID + 従業員名
        value: String(x.employeeId) + ' ' + x.employeeName,
        // 初期値は前回承認者が存在しない場合はブランクを設定
        displayValue: lastApprover_3 !== null ? lastApprover_3 : '',
      };
    });
  };

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser_4SelectValueModel = (
    changeExpectDateInfo: approvalUser_4[]
  ): SelectValue[] => {
    // 前回の第４承認者をローカルストレージより取得
    const lastApprover_4 = localStorage.getItem('lastApprover_4');
    return changeExpectDateInfo.map((x) => {
      return {
        // 表示属性名は従業員ID + 従業員名
        value: String(x.employeeId) + ' ' + x.employeeName,
        // 初期値は前回承認者が存在しない場合はブランクを設定
        displayValue: lastApprover_4 !== null ? lastApprover_4 : '',
      };
    });
  };


  return (
    <>
      <Popup open={isOpen} buttons={buttons}>
        <PopSection name='承認申請'>
          <Select
            label='第１承認者'
            labelPosition='above'
            name='needApprovalStep1'
            selectValues={selectValues.approvalUser_1}
            blankOption
            required
          />
          <br />
          {/* APIから取得した承認ステップ数が２以上の場合のみ表示 */}
          {needApprovalStep && needApprovalStep >= 2 ?
            <>
              <Select
                label='第２承認者'
                labelPosition='above'
                name='needApprovalStep2'
                selectValues={selectValues.approvalUser_2}
                blankOption
                required
              />
              <br />
            </>
            : ''}
          {/* APIから取得した承認ステップ数が３以上の場合のみ表示 */}
          {needApprovalStep && needApprovalStep >= 3 ?
            <>
              <Select
                label='第３承認者'
                labelPosition='above'
                name='needApprovalStep3'
                selectValues={selectValues.approvalUser_3}
                blankOption
                required
              />
              <br />
            </>
            : ''}
          {/* APIから取得した承認ステップ数が４以上の場合のみ表示 */}
          {needApprovalStep && needApprovalStep >= 4 ?
            <>
              <Select
                label='第４承認者'
                labelPosition='above'
                name='needApprovalStep4'
                selectValues={selectValues.approvalUser_4}
                blankOption
                required
              />
              <br />
            </>
            : ''}
          <Typography variant='h6'>申請コメント</Typography>
          <ControlsStackItem size='m'>
            {/* TODO: テキストエリア内に縦スクロールバー表示する必要あり */}
            <Textarea
              name='applicationComment'
              minRows={10}
              maxRows={30}
              size='l'
            ></Textarea>
          </ControlsStackItem>
        </PopSection>
      </Popup>
    </>
  );
}
export default ScrCom0033Popup;
