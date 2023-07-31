import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { MainLayout } from 'layouts/MainLayout';
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { Typography } from 'controls/Typography';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { SCREEN_ID } from 'definitions/screenId';

/**
 * エラー確認ポップアップ データモデル
 */
export interface ScrCom0038PopupModel {
  // エラーリスト
  errorList: errorList[];
  // ワーニングリスト
  warningList: warningList[];
  // 呼出元画面ID
  expirationScreenId: string;
}

/**
 * エラー確認ポップアップ データモデル(エラー)
 */
export interface errorList {
  // エラーメッセージ
  errorMessage: string;
}

/**
 * エラー確認ポップアップ データモデル(ワーニング)
 */
export interface warningList {
  // エラーメッセージ
  warningMessage: string;
}

/**
 * エラー確認ポップアップ Props
 */
interface ScrCom0038PopupProps {
  isOpen: boolean;
  data: ScrCom0038PopupModel;
  // キャンセルボタン押下時に渡すパラメータ
  handleCancel: () => void;
}

/**
 * エラー確認ポップアップ
 */
const ScrCom0038Popup = (props: ScrCom0038PopupProps) => {
  // props
  const { isOpen, data, handleCancel } = props;

  // form
  const methods = useForm({
    defaultValues: {
      checkbox: false,
    },
    // context: false,
  });
  const { setValue, watch } = methods;

  // state
  // ワーニングチェックボックスを全てチェックしたかどうかを管理するフラグ
  const [isWarningChecked, setIsWarningChecked] = useState<boolean>();

  // route
  const navigate = useNavigate();

  // チェックボックス処理
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // 全てのチェックボックスの値を取得
      Object.entries(value).map((x, key) => {
        // 存在するチェックボックスの頭の一つが余分の為削除
        if (key >= 1) {
          // 値がtrue以外の場合は未選択状態のチェックボックスあり
          if (!x[1]) {
            // 確定ボタンの非活性化
            setIsWarningChecked(false);
          } else {
            // 確定ボタンの活性化
            setIsWarningChecked(true);
          }
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  /**
   * 確定ボタン押下時のイベントハンドラ
   */
  const handleConfirm = () => {
    // 遷移元画面が入金詳細 => 入金一覧画面へ遷移
    if (data.expirationScreenId === SCREEN_ID[0].screenId) {
      navigate('/tra/recepts');
      // 遷移元画面が計算書詳細 => 計算書一覧画面へ遷移
    } else if (data.expirationScreenId === SCREEN_ID[1].screenId) {
      navigate('/tra/statements');
      // 遷移元画面が到着一括入力画面 => 到着一括入力画面へ遷移
    } else if (data.expirationScreenId === SCREEN_ID[2].screenId) {
      navigate('/doc/arrives');
    }
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Popup open={isOpen}>
              <Popup main>
                {/* エラー発生無の場合は非表示 */}
                {data.errorList.length > 0 ? (
                  <PopSection name='エラー内容' isError>
                    {data.errorList.length > 0
                      ? data.errorList.map(
                          (errorList: errorList, errorIndex: number) => {
                            return (
                              <>
                                <Typography
                                  key={
                                    errorList.errorMessage +
                                    String(errorIndex + 1)
                                  }
                                  variant='h6'
                                >
                                  {'エラーメッセージ' +
                                    Number(errorIndex + 1) +
                                    ':' +
                                    errorList.errorMessage}
                                </Typography>
                              </>
                            );
                          }
                        )
                      : ''}
                  </PopSection>
                ) : (
                  ''
                )}
                {/* ワーニング発生無の場合は非表示 */}
                {data.warningList.length > 0 ? (
                  <PopSection name='ワーニング内容' isWarning>
                    {data.warningList.length > 0
                      ? data.warningList.map(
                          (warningList: warningList, warningIndex: number) => {
                            return (
                              <>
                                {/* エラー発生有の場合はチェックボックス非活性 */}
                                <Checkbox
                                  key={
                                    warningList.warningMessage +
                                    String(warningIndex)
                                  }
                                  name={'checkbox' + warningIndex}
                                  label={
                                    'ワーニングメッセージ' +
                                    Number(warningIndex + 1) +
                                    ':' +
                                    warningList.warningMessage
                                  }
                                  disabled={
                                    data.errorList.length > 0 ? true : false
                                  }
                                />
                              </>
                            );
                          }
                        )
                      : ''}
                  </PopSection>
                ) : (
                  ''
                )}
              </Popup>
              <Popup bottom>
                <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
                <ConfirmButton
                  onClick={handleConfirm}
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
    </>
  );
};
export default ScrCom0038Popup;
