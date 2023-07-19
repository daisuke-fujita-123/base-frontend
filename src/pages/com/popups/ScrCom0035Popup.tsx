import React, { useState, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// Controls
import { FileSelect } from 'controls/FileSelect';
import { Select, SelectValue } from 'controls/Select';
// Layouts
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';
import { Stack } from 'layouts/Stack';
// Hooks
import { useForm } from 'hooks/useForm';
// import { useNavigate } from 'hooks/useForm';
// Pages
import { ScrCom0034PageParamModel } from 'pages/com/ScrCom0034Page';

/**
 * 取込対象選択（一括登録定義）モデル
 */
export interface ScrCom0035PopupAllRegistrationDefinitionModel {
  id: string;
  label: string;
}

/**
 * CSV読込（ポップアップ）FORMモデル
 */
interface ScrCom0035PopupFormModel {
  // 一括登録ID
  allRegistrationId: string;
  // 取込ファイル
  importFile: File;
}

// yupローカライズ
yup.addMethod(yup.ArraySchema, 'required', function () {
  return this.test('選択項目', '必須で選択してください。', function (value) {
    if (value === null) {
      return false;
    }
    const values: string[] = Object.values(value);
    return values.length > 0;
  });
});

/**
 * CSV読込（ポップアップ）検査スキーマ
 */
const ScrCom0035PopupValidationSchama = yup.object().shape({
  allRegistrationId: yup.string().required(),
  importFile: yup.string().required(),
});

/**
 * CSV読込（ポップアップ）プロパティ
 */
export interface ScrCom0035PopupProps {
  // 取込対象選択（一括登録定義）
  allRegistrationDefinitions: ScrCom0035PopupAllRegistrationDefinitionModel[];
  // 画面ID
  screanId: string;
  // タブID
  tabId?: number;
  // ポップアップ表示フラグ制御
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * SCR-COM-0035 CSV読込（ポップアップ）
 */
const ScrCom0035Popup = (props: ScrCom0035PopupProps) => {
  const navigate = useNavigate();
  // プロパティ変数アサイン
  const popupParams: ScrCom0035PopupProps = props;
  const { isOpen, setIsOpen, allRegistrationDefinitions } = popupParams;

  // 取込対象選択リスト生成
  const importTargets: SelectValue[] = [];
  allRegistrationDefinitions.forEach((e) => {
    importTargets.push({ value: e.id, displayValue: e.label });
  });
  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm<ScrCom0035PopupFormModel>({
    defaultValues: {
      // 取込対象選択：選択肢が一つの場合はデフォルト選択
      allRegistrationId:
        importTargets.length > 1 ? '' : importTargets[0].value.toString(),
    },
    resolver: yupResolver(ScrCom0035PopupValidationSchama),
    context: isReadOnly,
  });
  const { getValues, setValue } = methods;

  // イベントハンドル：キャンセル
  const handleCancel = () => {
    setIsOpen(false);
  };

  // イベントハンドル：確定
  const handleConfirm = async () => {
    // バリデーション
    await methods.trigger();
    const errCount = Object.keys(methods.formState.errors).length;
    if (errCount > 0) {
      return;
    }
    // ポップアップ非表示
    setIsOpen(false);
    // ページ遷移：一括登録確認画面
    const form: ScrCom0035PopupFormModel = getValues();
    const scrCom0034PageParams: ScrCom0034PageParamModel = {
      screanId: popupParams.screanId,
      tabId: popupParams.tabId,
      ...form,
    };
    navigate('/com/all-registration', { state: { scrCom0034PageParams } });
  };

  // ポップアップボタン定義
  const popupButtons = [
    { name: 'キャンセル', onClick: handleCancel },
    { name: '確定', onClick: handleConfirm },
  ];

  return (
    <>
      <Popup open={isOpen} buttons={popupButtons}>
        <PopSection name='CSV読込'>
          <FormProvider {...methods}>
            <Stack>
              {/* FIXME:エラーがファイルパス（ラベル）にかぶる */}
              <Select
                label='取込対象選択'
                name='allRegistrationId'
                labelPosition='above'
                selectValues={importTargets}
                minWidth={350}
                multiple={false}
                required={true}
              />
              {/* FIXME:ファイル自体のエラーが表示・正常時の更新がされない。 */}
              <FileSelect
                label='ファイルパス'
                name='importFile'
                setValue={setValue}
                size='l'
              />
            </Stack>
          </FormProvider>
        </PopSection>
      </Popup>
    </>
  );
};

export default ScrCom0035Popup;
