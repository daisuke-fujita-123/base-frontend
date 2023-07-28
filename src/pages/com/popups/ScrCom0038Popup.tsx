import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { MainLayout } from 'layouts/MainLayout';
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { generate } from 'utils/BaseYup';

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
 * ワーニング確認ポップアップ データモデル(ワーニング)
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
  handleErrorPopupCancel: () => void;
}

/**
 * TODO: バリデーションスキーマ
 */
const validationSchama = generate(['applicationComment']);

/**
 * エラー確認ポップアップ
 */
const ScrCom0038Popup = (props: ScrCom0038PopupProps) => {
  // props
  const { isOpen, data } = props;

  // form
  const methods = useForm({
    defaultValues: {
      checkbox: false,
    },
    resolver: yupResolver(validationSchama),
    context: false,
  });
  const { setValue, watch } = methods;

  // state
  // ワーニングチェックボックスを全てチェックしたかどうかを管理するフラグ
  const [isWarningChecked, setIsWarningChecked] = useState<boolean>(false);

  // route
  const navigate = useNavigate();

  // TODO: チェックボックス処理
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // textの変更も監視対象のため、setValueでtextを変更した場合を無視しないと無弁ループする
      if (name !== 'checkbox') return;
      if (value.checkbox === undefined) return;
      // TODO: 全てのワーニングのチェックボックス選択したら確定ボタンが活性化
      value.checkbox;
      setIsWarningChecked(true);
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  /**
   * 確定ボタン押下時のイベントハンドラ
   */
  const handleConfirm = () => {
    // 遷移元画面が入金詳細 => 入金一覧画面へ遷移
    if (props.data.expirationScreenId === SCREEN_ID[0].screenId) {
      navigate('/tra/recepts');
      // 遷移元画面が計算書詳細 => 計算書一覧画面へ遷移
    } else if (props.data.expirationScreenId === SCREEN_ID[1].screenId) {
      navigate('/tra/statements');
      // 遷移元画面が到着一括入力画面 => 到着一括入力画面へ遷移
    } else if (props.data.expirationScreenId === SCREEN_ID[2].screenId) {
      navigate('/doc/arrives');
    }
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Popup open={isOpen}>
              <PopSection name='エラー内容'>
                {/* エラー発生無の場合は非表示 */}
                {data.errorList.length > 0
                  ? data.errorList.map((errorValue: any, errorIndex: any) => {
                      return (
                        <>
                          <Checkbox
                            name='checkbox'
                            label={
                              'エラーメッセージ' +
                              errorIndex +
                              1 +
                              ':' +
                              errorValue.errorMessage
                            }
                            key={errorIndex}
                          />
                        </>
                      );
                    })
                  : ''}
              </PopSection>
              <PopSection name='ワーニング内容'>
                {/* ワーニング発生無の場合は非表示 */}
                {data.warningList.length > 0
                  ? data.warningList.map(
                      (warningValue: any, warningIndex: any) => {
                        return (
                          <>
                            {/* エラー発生有の場合はチェックボックス非活性 */}
                            <Checkbox
                              name='checkbox'
                              label={
                                'ワーニングメッセージ' +
                                warningIndex +
                                1 +
                                ':' +
                                warningValue.warningMessage
                              }
                              key={warningIndex}
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
            </Popup>
            <Popup bottom>
              <CancelButton onClick={props.handleErrorPopupCancel}>
                キャンセル
              </CancelButton>
              <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
            </Popup>
          </FormProvider>
        </MainLayout>
      </MainLayout>
    </>
  );
};
export default ScrCom0038Popup;
