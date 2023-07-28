import React, { useEffect, useRef } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { MainLayout } from 'layouts/MainLayout';
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';

import { useForm } from 'hooks/useForm';

import { generate } from 'utils/BaseYup';

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
  // 確定ボタン押下時に渡すパラメータ
  handleErrorPopupConfirm: () => void;
}

/**
 * バリデーションスキーマ
 */
const validationSchama = generate([
  'applicationComment',
])

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
    context: false
  });

  // state
  const isFirstRender = useRef(false)

  // 呼び出し元画面遷移時の処理
  useEffect(() => {
    isFirstRender.current = true
  }, [])

  // 登録内容申請ポップアップ表示時の処理
  useEffect(() => {
    const initialize = async () => {

    }

    // ポップアップ起動時にのみ処理を実行する
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      initialize();
    }
  }, [isOpen])


  // ポップアップ確定ボタン押下時の処理(ダイアログを呼び出す)
  const handlePopupConfirm = () => {
    console.log("");
  }

  // ポップアップキャンセルボタン押下時の処理
  const handlePopupCancel = () => {
    console.log("");
  }

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Popup open={isOpen}>
              <PopSection name='エラー内容'>
                {data.errorList.map((errorValue: any, errorIndex: any) => {
                  return (
                    <>
                      {/* TODO： エラー発生有の場合は非活性 */}
                      <Checkbox
                        name='checkbox'
                        label={'エラーメッセージ' + errorIndex + 1 + ":" + errorValue.errorMessage}
                        key={errorIndex}
                      />
                    </>
                  );
                })}
              </PopSection>
              <PopSection name='ワーニング内容'>
                {data.warningList.map((warningValue: any, warningIndex: any) => {
                  return (
                    <>
                      {/* TODO： エラー発生有の場合は非活性 */}
                      <Checkbox
                        name='checkbox'
                        label={'ワーニングメッセージ' + warningIndex + 1 + ":" + warningValue.warningMessage}
                        key={warningIndex}
                        disabled={data.errorList.length > 0 ? true : false}
                      />
                    </>
                  );
                })}
              </PopSection>
            </Popup>
            <Popup bottom>
              <CancelButton onClick={handlePopupConfirm}>キャンセル</CancelButton>
              <ConfirmButton onClick={handlePopupCancel}>確定</ConfirmButton>
            </Popup>
          </FormProvider>
        </MainLayout >
      </MainLayout >
    </>
  );
}
export default ScrCom0038Popup;