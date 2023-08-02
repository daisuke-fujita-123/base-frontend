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

import { SCREEN_ID } from 'definitions/screenId';

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
  // 確定ボタン・キャンセルボタン押下時に渡すパラメータ
  handleConfirmOrCancel: (
    // 第一～第四承認者のリストボックス
    selectValues: SelectValuesModel,
    // 申請コメント
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
  applicationComment: yup
    .string()
    .label('申請コメント')
    .max(250)
    .fullAndHalfWidth(),
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

  // 登録申請ポップアップ確定ボタン押下時の処理(ダイアログを呼び出す)
  const handlePopupConfirm = () => {
    // ダイアログを表示
    const dialogMessege = Format(getMessage('MSG-FR-INF-00009'), [
      'ダイアログ1',
    ]);
    setTitle(dialogMessege);
    setHandleDialog(true);
  };

  // 登録内容申請ポップアップキャンセルボタン押下時の処理
  const handleCancel = () => {
    // 画面ID => 登録内容確認ポップアップからの遷移
    if (data.screenId === SCREEN_ID[0].screenId) {
      // 取引会計管理かそれ以外かで判定
      if (isTra) {
        const traMessege = Format(getMessage('MSG-FR-INF-00007'), [
          'ダイアログ2',
        ]);
        setTitle(traMessege);
      } else {
        const notTraMessege = Format(getMessage('MSG-FR-INF-00008'), [
          'ダイアログ3',
        ]);
        setTitle(notTraMessege);
      }
      // 画面ID => 一括登録確認画面からの遷移
    } else if (data.screenId === SCREEN_ID[1].screenId) {
      const bulkRegistrationMessege = Format(getMessage('MSG-FR-INF-00009'), [
        'ダイアログ4',
      ]);
      setTitle(bulkRegistrationMessege);
      // 画面ID => それ以外
    } else {
      const notTraMessege = Format(getMessage('MSG-FR-INF-00008'), [
        'ダイアログ3',
      ]);
      setTitle(notTraMessege);
    }
    // ダイアログを表示
    setHandleDialog(true);
  };

  // ダイアログのOKボタン押下時の処理(呼び出し元画面で登録を行う)
  const handleDialogConfirm = () => {
    // 取引会計管理の処理の場合登録を行う
    if (isTra) {
      props.handleConfirmOrCancel(
        // 第１～第４承認者
        selectValues,
        // 申請コメント
        getValues('applicationComment')
      );

      // ローカルストレージに第１～第４承認者を保存
      localStorage.setItem(
        'lastApprover1',
        String(selectValues?.approvalUser1)
      );
      localStorage.setItem(
        'lastApprover2',
        String(selectValues?.approvalUser2)
      );
      localStorage.setItem(
        'lastApprover3',
        String(selectValues?.approvalUser3)
      );
      localStorage.setItem(
        'lastApprover4',
        String(selectValues?.approvalUser4)
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
      // ダイアログキャンセル処理用に画面IDがSCR-TRAなら取引会計管理と判断する
      const regex = /^SCR-TRA.+/;
      if (regex.test(data.screenId)) {
        setIsTra(true);
      } else {
        setIsTra(false);
      }

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

    initialize();
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
                    <Textarea
                      name='applicationComment'
                      maxRows={30}
                      size='l'
                    ></Textarea>
                  </ControlsStackItem>
                </PopSection>
              </Popup>
              <Popup bottom>
                <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
                <ConfirmButton onClick={handlePopupConfirm}>確定</ConfirmButton>
              </Popup>
            </Popup>
          </FormProvider>
        </MainLayout>
      </MainLayout>
      {/* ダイアログ */}
      <Dialog open={handleDialog} title={title} buttons={dialogButtons} />
    </>
  );
};
export default ScrCom0033Popup;
