import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

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

import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

/**
 * 登録内容申請ポップアップデータモデル
 */
export interface ScrCom0033PopupModel {
  // 画面ID
  screenId: string;
  // タブID
  tabId: number;
  // 申請金額
  applicationMoney: number;
}

/**
 * 登録内容申請ポップアップのProps
 */
interface ScrCom0033PopupProps {
  isOpen: boolean;
  data: ScrCom0033PopupModel;
  // キャンセルボタン押下時に渡すパラメータ => なし
  handleCancel: () => void;
  // 確定ボタン押下時に渡すパラメータ
  handleConfirm: (
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
  ) => void;
}

/**
 * Form データモデル
 */
interface applicationModel {
  needApprovalStep1: string;
  needApprovalStep2: string;
  needApprovalStep3: string;
  needApprovalStep4: string;
  applicationComment: string;
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
  applicationComment: yup.string().label('申請コメント').max(250),
};

/**
 * 画面ID 定数
 */
const SCR_COM_0034 = 'SCR-COM-0034';

/**
 * 登録内容申請ポップアップ
 */
const ScrCom0033Popup = (props: ScrCom0033PopupProps) => {
  // props
  const { isOpen, data, handleCancel } = props;

  // form
  const methods = useForm<applicationModel>({
    defaultValues: {
      needApprovalStep1: '',
      needApprovalStep2: '',
      needApprovalStep3: '',
      needApprovalStep4: '',
      applicationComment: '',
    },
    resolver: yupResolver(yup.object(validationSchema)),
  });
  const { getValues, setValue, watch, reset } = methods;

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );

  // 従業員ID1
  const [employeeId1, setEmployeeId1] = useState<string>('');
  // 従業員名1
  const [employeeName1, setEmployeeName1] = useState<string>('');
  // 従業員メールアドレス1
  const [employeeMailAddress1List, setEmployeeMailAddress1List] = useState<
    approvalUser1[]
  >([]);
  const [employeeMailAddress1, setEmployeeMailAddress1] = useState<string>('');
  // 従業員ID2
  const [employeeId2, setEmployeeId2] = useState<string>('');
  // 従業員名2
  const [employeeName2, setEmployeeName2] = useState<string>('');
  // 従業員ID3
  const [employeeId3, setEmployeeId3] = useState<string>('');
  // 従業員名3
  const [employeeName3, setEmployeeName3] = useState<string>('');
  // 従業員ID4
  const [employeeId4, setEmployeeId4] = useState<string>('');
  // 従業員名4
  const [employeeName4, setEmployeeName4] = useState<string>('');

  // 判定に使用する必要承認ステップ数
  const [needApprovalStep, setNeedApprovalStep] = useState<number>();
  // 判定に使用する取引会計管理かどうかのフラグ
  const [isTra, setIsTra] = useState<boolean>(false);
  // 判定に使用するキャンセル処理のフラグ(true=>ポップアップまで閉じる/false=>ダイアログのみ閉じる)
  const [isCancel, setIsCancel] = useState<boolean>(false);
  // 判定に使用する確定処理のフラグ(true=>確定ボタン押下/false=>キャンセルボタン押下)
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  // メッセージポップアップ(ダイアログ)
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const { getMessage } = useContext(MessageContext);

  // user情報
  const { user } = useContext(AuthContext);

  // 登録申請ポップアップ確定ボタン押下時の処理(ダイアログを呼び出す)
  const handlePopupConfirm = () => {
    const dialogMessege = Format(getMessage('MSG-FR-INF-00009'), [
      'ダイアログ1',
    ]);
    setIsCancel(false);
    setIsConfirm(true);
    setTitle(dialogMessege);
    // ダイアログを表示
    setHandleDialog(true);
  };

  // 登録内容申請ポップアップキャンセルボタン押下時の処理
  const handlePopupCancel = () => {
    // 画面ID => 登録内容確認ポップアップ(各画面)からの遷移
    if (data.screenId !== SCR_COM_0034) {
      // 取引会計管理の場合
      if (isTra) {
        setIsCancel(true);
        const traMessege = Format(getMessage('MSG-FR-INF-00007'), [
          'ダイアログ2',
        ]);
        setTitle(traMessege);
        // 取引会計管理以外の場合
      } else {
        setIsConfirm(false);
        const notTraMessege = Format(getMessage('MSG-FR-INF-00008'), [
          'ダイアログ3',
        ]);
        setTitle(notTraMessege);
      }
      // 画面ID => 一括登録確認画面からの遷移
    } else if (data.screenId === SCR_COM_0034) {
      const bulkRegistrationMessege = Format(getMessage('MSG-FR-INF-00009'), [
        'ダイアログ4',
      ]);
      setTitle(bulkRegistrationMessege);
    }
    // ダイアログを表示
    setHandleDialog(true);
  };

  // ダイアログのキャンセルボタン押下時の処理
  const handleDialogCancel = () => {
    // 取引会計管理の処理の場合のみポップアップまで閉じて処理終了とする
    if (isCancel) {
      // 取引会計管理以外の場合はダイアログのみ閉じる
      handleCancel();
    } else {
      setHandleDialog(false);
    }
  };

  // ダイアログのOKボタン押下時の処理(呼び出し元画面で登録を行う)
  const handleDialogConfirm = () => {
    // 取引会計管理の処理の場合のみ登録を行う
    if (isTra || isConfirm) {
      props.handleConfirm(
        // 従業員ID1
        employeeId1,
        // 従業員名1
        employeeName1,
        // 従業員メールアドレス
        employeeMailAddress1,
        // 従業員ID2
        employeeId2,
        // 従業員名2
        employeeName2,
        // 従業員ID3
        employeeId3,
        // 従業員名3
        employeeName3,
        // 従業員ID4
        employeeId4,
        // 従業員名4
        employeeName4,
        // 申請コメント
        getValues('applicationComment')
      );

      // ローカルストレージに第１～第４承認者を保存
      localStorage.setItem('lastApprover1', String(employeeId1));
      localStorage.setItem('lastApprover2', String(employeeId2));
      localStorage.setItem('lastApprover3', String(employeeId3));
      localStorage.setItem('lastApprover4', String(employeeId4));
    } else {
      handleCancel();
    }
  };

  // button (ダイアログ(メッセージポップアップ)用)
  const dialogButtons = [
    { name: 'OK', onClick: handleDialogConfirm },
    { name: 'キャンセル', onClick: handleDialogCancel },
  ];

  // 初期表示(登録内容申請ポップアップ表示時の処理)
  useEffect(() => {
    const initialize = async () => {
      // ダイアログキャンセル処理用に画面IDがSCR-TRAから始まるなら取引会計管理と判断する
      const regex = /^SCR-TRA.+/;
      if (regex.test(data.screenId)) {
        setIsTra(true);
        setIsCancel(true);
      } else {
        setIsTra(false);
        setIsCancel(false);
      }

      // ローカルストレージから各承認者の値を取得
      const lastApprover1 = localStorage.getItem('lastApprover1');
      const lastApprover2 = localStorage.getItem('lastApprover2');
      const lastApprover3 = localStorage.getItem('lastApprover3');
      const lastApprover4 = localStorage.getItem('lastApprover4');

      console.log(lastApprover1);
      console.log(lastApprover2);
      console.log(lastApprover3);
      console.log(lastApprover4);

      // 初期値は前回承認者が存在しない場合はブランクを設定、存在する場合は初期値を前回承認者に設定
      setValue(
        'needApprovalStep1',
        lastApprover1 === null ? '' : lastApprover1
      );
      setValue(
        'needApprovalStep2',
        lastApprover2 === null ? '' : lastApprover2
      );
      setValue(
        'needApprovalStep3',
        lastApprover3 === null ? '' : lastApprover3
      );
      setValue(
        'needApprovalStep4',
        lastApprover4 === null ? '' : lastApprover4
      );

      // API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ）
      const request: ScrCom0033GetApproverRequest = {
        /** 画面ID */
        screenId: data.screenId,
        /** タブID */
        tabId: data.tabId,
        /** 申請金額 */
        applicationMoney: data.applicationMoney,
        /** 申請者ID */
        appalicationId: user.employeeId,
      };
      const response = await ScrCom0033GetApprover(request);

      // 判定用の承認ステップ数を設定
      setNeedApprovalStep(response.needApprovalStep);

      // 判定用のEmailを設定
      setEmployeeMailAddress1List(response.approvalUser1);

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

    // 初期表示処理
    initialize();
  }, [isOpen]);

  // プルダウン選択時の処理
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // 従業員IDのセット
      if (value.needApprovalStep1 === undefined) return;
      setEmployeeId1(value.needApprovalStep1);

      if (value.needApprovalStep2 === undefined) return;
      setEmployeeId2(value.needApprovalStep2);

      if (value.needApprovalStep3 === undefined) return;
      setEmployeeId3(value.needApprovalStep3);

      if (value.needApprovalStep4 === undefined) return;
      setEmployeeId4(value.needApprovalStep4);

      selectValues.approvalUser1.map((e) => {
        // 従業員IDが5桁の為スペースを空けた7文字目以降で判定し従業員名を取得
        if (
          String(value.needApprovalStep1) ===
          String(e.displayValue).substring(0, 5)
        ) {
          setEmployeeName1(String(e.displayValue).substring(6));
        }
      });

      // 従業員名のセット
      selectValues.approvalUser2.map((e) => {
        // 従業員IDが5桁の為スペースを空けた7文字目以降で判定し従業員名を取得
        if (
          String(value.needApprovalStep2) ===
          String(e.displayValue).substring(0, 5)
        ) {
          setEmployeeName2(String(e.displayValue).substring(6));
        }
      });

      selectValues.approvalUser3.map((e) => {
        // 従業員IDが5桁の為スペースを空けた7文字目以降で判定し従業員名を取得
        if (
          String(value.needApprovalStep3) ===
          String(e.displayValue).substring(0, 5)
        ) {
          setEmployeeName3(String(e.displayValue).substring(6));
        }
      });

      selectValues.approvalUser4.map((e) => {
        // 従業員IDが5桁の為スペースを空けた7文字目以降で判定し従業員名を取得
        if (
          String(value.needApprovalStep4) ===
          String(e.displayValue).substring(0, 5)
        ) {
          setEmployeeName4(String(e.displayValue).substring(6));
        }
      });

      // 1番目の従業員のみメールアドレスを取得して設定
      employeeMailAddress1List.map((e) => {
        if (String(value.needApprovalStep1) === String(e.employeeId)) {
          setEmployeeMailAddress1(e.employeeMail);
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [selectValues, watch]);

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser1SelectValueModel = (
    approvalUser1: approvalUser1[]
  ): SelectValue[] => {
    // 前回の第１承認者をローカルストレージより取得
    return approvalUser1.map((x) => {
      return {
        value: x.employeeId,
        // 表示属性名は従業員ID + 従業員名
        displayValue: String(x.employeeId) + ' ' + x.employeeName,
      };
    });
  };

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser2SelectValueModel = (
    approvalUser2: approvalUser2[]
  ): SelectValue[] => {
    // 前回の第２承認者をローカルストレージより取得
    return approvalUser2.map((x) => {
      return {
        // 初期値は前回承認者が存在しない場合はブランクを設定
        value: x.employeeId,
        // 表示属性名は従業員ID + 従業員名
        displayValue: String(x.employeeId) + ' ' + x.employeeName,
      };
    });
  };

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser3SelectValueModel = (
    approvalUser3: approvalUser3[]
  ): SelectValue[] => {
    // 前回の第３承認者をローカルストレージより取得
    return approvalUser3.map((x) => {
      return {
        // 初期値は前回承認者が存在しない場合はブランクを設定
        value: x.employeeId,
        // 表示属性名は従業員ID + 従業員名
        displayValue: String(x.employeeId) + ' ' + x.employeeName,
      };
    });
  };

  /**
   *  API-COM-0033-0001：承認者情報取得API（登録内容申請ポップアップ） レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeApprovalUser4SelectValueModel = (
    approvalUser4: approvalUser4[]
  ): SelectValue[] => {
    // 前回の第４承認者をローカルストレージより取得
    return approvalUser4.map((x) => {
      return {
        // 初期値は前回承認者が存在しない場合はブランクを設定
        value: x.employeeId,
        // 表示属性名は従業員ID + 従業員名
        displayValue: String(x.employeeId) + ' ' + x.employeeName,
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
                <CancelButton onClick={handlePopupCancel}>
                  キャンセル
                </CancelButton>
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
