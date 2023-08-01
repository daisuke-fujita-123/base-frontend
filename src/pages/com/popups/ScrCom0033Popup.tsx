import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { MainLayout } from 'layouts/MainLayout';
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';
import { ControlsStackItem } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Dialog } from 'controls/Dialog';
import { Select, SelectValue } from 'controls/Select';
import { Textarea } from 'controls/Textarea';
import { Typography } from 'controls/Typography';

import {
  approvalUser1,
  approvalUser2,
  approvalUser3,
  approvalUser4,
  ScrCom0033GetApprover,
  ScrCom0033GetApproverRequest,
} from 'apis/com/ScrCom0033Api';

import { useForm } from 'hooks/useForm';

import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';
import yup from 'utils/ValidationDefinition';

/**
 * 登録内容申請ポップアップデータモデル
 */
export interface ScrCom0033PopupModel {
  // 画面ID
  screenId: string;
  // タブID
  tabId: number;
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
    applicationComment: string
  ) => void;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 第１承認者
  approvalUser1: SelectValue[];
  // 第２承認者
  approvalUser2: SelectValue[];
  // 第３承認者
  approvalUser3: SelectValue[];
  // 第４承認者
  approvalUser4: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 第１承認者
  approvalUser1: [],
  // 第２承認者
  approvalUser2: [],
  // 第３承認者
  approvalUser3: [],
  // 第４承認者
  approvalUser4: [],
};

/**
 * バリデーションスキーマ
 */
const validationSchema = {
  applicationComment: yup.string().label('申請コメント'),
  //   .max(250)
  //   .fullAndHalfWidth(),
};

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
    },
    resolver: yupResolver(yup.object(validationSchema)),
  });
  const { getValues } = methods;

  // ポップアップ確定ボタン押下時の処理(ダイアログを呼び出す)
  const handlePopupConfirm = () => {
    // ダイアログを表示
    const dialogMessege = Format(getMessage('MSG-FR-INF-00009'), [
      '代行請求履歴',
      response.acquisitionCount.toString(),
      response.responseCount.toString(),
    ]);
    setTitle(dialogMessege);
    setHandleDialog(true);
  };

  // ポップアップキャンセルボタン押下時の処理
  const handleCancel = () => {
    // 画面ID => 登録内容確認ポップアップ空の遷移
    if (data.screenId === 'SCR-COM-0032') {
      // TODO: 取引会計管理かそれ以外かで判定する 判定方法不明
      if (isTra) {
        const traMessege = Format(getMessage('MSG-FR-INF-00007'), [
          '代行請求履歴',
          response.acquisitionCount.toString(),
          response.responseCount.toString(),
        ]);
        setTitle(traMessege);
      } else {
        const notTraMessege = Format(getMessage('MSG-FR-INF-00008'), [
          '代行請求履歴',
          response.acquisitionCount.toString(),
          response.responseCount.toString(),
        ]);
        setTitle(notTraMessege);
      }
      // 画面ID => 一括登録確認画面からの遷移
    } else if (data.screenId === '') {
      const bulkRegistrationMessege = Format(getMessage('MSG-FR-INF-00009'), [
        '代行請求履歴',
        response.acquisitionCount.toString(),
        response.responseCount.toString(),
      ]);
      setTitle(bulkRegistrationMessege);
    }
    // ダイアログを表示
    setHandleDialog(true);
  };

  // ダイアログのOKボタン押下時の処理(呼び出し元画面で登録を行う)
  const handleDialogConfirm = () => {
    // 取引会計管理の処理の場合登録を行う
    if (isTra) {
      props.handlePopupConfirm(
        // 第１～第４承認者
        selectValues,
        // 申請コメント
        getValues('applicationComment')
      );
    }
    setHandleDialog(false);
  };

  // button
  const dialogButtons = [
    { name: 'キャンセル', onClick: () => setHandleDialog(false) },
    { name: 'OK', onClick: handleDialogConfirm },
  ];

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 判定に使用する必要承認ステップ数
  const [needApprovalStep, setNeedApprovalStep] = useState<number>();
  // 判定に使用する取引会計管理かどうかのフラグ
  const [isTra, setIsTra] = useState<boolean>(true);

  // メッセージポップアップ(ダイアログ)
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const { getMessage } = useContext(MessageContext);

  // 登録内容申請ポップアップ表示時の処理
  useEffect(() => {
    const initialize = async () => {
      // TODO:ダイアログキャンセル処理用にTRAかどうかを判断して設定する
      //  ⇒ 登録内容確認ポップアップのキャンセル時に取引会計かそれ以外かを判定
      setIsTra(false);

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
        approvalUser1: convertToChangeApprovalUser1SelectValueModel(
          response.approvalUser1
        ),
        approvalUser2: convertToChangeApprovalUser2SelectValueModel(
          response.approvalUser2
        ),
        approvalUser3: convertToChangeApprovalUser3SelectValueModel(
          response.approvalUser3
        ),
        approvalUser4: convertToChangeApprovalUser4SelectValueModel(
          response.approvalUser4
        ),
      });
    };

    // ポップアップ起動時にのみ処理を実行する
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    // } else {
    initialize();
    // }
  }, []);

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser1SelectValueModel = (
    changeExpectDateInfo: approvalUser1[]
  ): SelectValue[] => {
    // 前回の第１承認者をローカルストレージより取得
    const lastApprover1 = localStorage.getItem('lastApprover1');
    return changeExpectDateInfo.map((x) => {
      return {
        // 表示属性名は従業員ID + 従業員名
        value: String(x.employeeId) + ' ' + x.employeeName,
        // 初期値は前回承認者が存在しない場合はブランクを設定
        displayValue: lastApprover1 !== null ? lastApprover1 : '',
      };
    });
  };

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser2SelectValueModel = (
    changeExpectDateInfo: approvalUser2[]
  ): SelectValue[] => {
    // 前回の第２承認者をローカルストレージより取得
    const lastApprover2 = localStorage.getItem('lastApprover2');
    return changeExpectDateInfo.map((x) => {
      return {
        // 表示属性名は従業員ID + 従業員名
        value: String(x.employeeId) + ' ' + x.employeeName,
        // 初期値は前回承認者が存在しない場合はブランクを設定
        displayValue: lastApprover2 !== null ? lastApprover2 : '',
      };
    });
  };

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser3SelectValueModel = (
    changeExpectDateInfo: approvalUser3[]
  ): SelectValue[] => {
    // 前回の第３承認者をローカルストレージより取得
    const lastApprover3 = localStorage.getItem('lastApprover3');
    return changeExpectDateInfo.map((x) => {
      return {
        // 表示属性名は従業員ID + 従業員名
        value: String(x.employeeId) + ' ' + x.employeeName,
        // 初期値は前回承認者が存在しない場合はブランクを設定
        displayValue: lastApprover3 !== null ? lastApprover3 : '',
      };
    });
  };

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser4SelectValueModel = (
    changeExpectDateInfo: approvalUser4[]
  ): SelectValue[] => {
    // 前回の第４承認者をローカルストレージより取得
    const lastApprover4 = localStorage.getItem('lastApprover4');
    return changeExpectDateInfo.map((x) => {
      return {
        // 表示属性名は従業員ID + 従業員名
        value: String(x.employeeId) + ' ' + x.employeeName,
        // 初期値は前回承認者が存在しない場合はブランクを設定
        displayValue: lastApprover4 !== null ? lastApprover4 : '',
      };
    });
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Popup open={isOpen}>
              <Popup main>
                <PopSection name='承認申請'>
                  <Select
                    label='第１承認者'
                    labelPosition='above'
                    name='needApprovalStep1'
                    selectValues={selectValues.approvalUser1}
                    blankOption
                    required
                  />
                  <br />
                  {/* APIから取得した承認ステップ数が２以上の場合のみ表示 */}
                  {needApprovalStep && needApprovalStep >= 2 ? (
                    <>
                      <Select
                        label='第２承認者'
                        labelPosition='above'
                        name='needApprovalStep2'
                        selectValues={selectValues.approvalUser2}
                        blankOption
                        required
                      />
                      <br />
                    </>
                  ) : (
                    ''
                  )}
                  {/* APIから取得した承認ステップ数が３以上の場合のみ表示 */}
                  {needApprovalStep && needApprovalStep >= 3 ? (
                    <>
                      <Select
                        label='第３承認者'
                        labelPosition='above'
                        name='needApprovalStep3'
                        selectValues={selectValues.approvalUser3}
                        blankOption
                        required
                      />
                      <br />
                    </>
                  ) : (
                    ''
                  )}
                  {/* APIから取得した承認ステップ数が４以上の場合のみ表示 */}
                  {needApprovalStep && needApprovalStep >= 4 ? (
                    <>
                      <Select
                        label='第４承認者'
                        labelPosition='above'
                        name='needApprovalStep4'
                        selectValues={selectValues.approvalUser4}
                        blankOption
                        required
                      />
                      <br />
                    </>
                  ) : (
                    ''
                  )}
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
              <Popup bottom>
                <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
                <ConfirmButton
                  onClick={handlePopupConfirm}
                  // 条件１：エラーが1件以上存在する場合 -> 非活性
                  // 条件２：ワーニングが0件の場合 -> 活性
                  // 条件３：ワーニングが1件以上存在し、全てのチェックボックスを選択済みの場合 -> 活性
                  disable={
                    data.errorList.length >= 1
                      ? true
                      : isWarningChecked
                      ? false
                      : true
                  }
                >
                  確定
                </ConfirmButton>
              </Popup>
            </Popup>
          </FormProvider>
        </MainLayout>
      </MainLayout>
      {/* ダイアログ */}
      <Dialog open={handleDialog} title={title} buttons={dialogButtons} />
      {/* <Dialog open={handleDialog} title={title} /> */}
    </>
  );
};
export default ScrCom0033Popup;
