import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// Controls
import { FileSelect } from 'controls/FileSelect';
import { Select, SelectValue } from 'controls/Select';
import { CancelButton, ConfirmButton } from 'controls/Button';
// Layouts
import { Box } from 'layouts/Box';
import { Popup } from 'layouts/Popup';
import { Stack } from 'layouts/Stack';
import { StackSection } from 'layouts/StackSection';
// Hooks
import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';
// Utils
import yup from 'utils/yup';
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

/**
 * CSV読込（ポップアップ）検査スキーマ
 */
const ScrCom0035PopupValidationSchama = yup.object().shape({
  allRegistrationId: yup.string().label('取込対象選択').required(),
  importFile: yup.string().label('ファイルパス').required(),
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
    // ページ遷移：一括登録確認画面
    const form: ScrCom0035PopupFormModel = getValues();
    const scrCom0034PageParams: ScrCom0034PageParamModel = {
      screanId: popupParams.screanId,
      tabId: popupParams.tabId,
      ...form,
    };
    navigate('/com/all-registration', false, {
      state: { scrCom0034PageParams },
    });
  };

  return (
    <>
      <Popup open={isOpen}>
        <Popup main>
          <StackSection titles={[{ name: 'CSV読込' }]}>
            <Box>
              <FormProvider {...methods}>
                <Stack>
                  <Select
                    label='取込対象選択'
                    name='allRegistrationId'
                    labelPosition='above'
                    selectValues={importTargets}
                    minWidth={350}
                    multiple={false}
                    required={true}
                  />
                  <FileSelect
                    label='ファイルパス'
                    name='importFile'
                    labelPosition='above'
                    size='l'
                  />
                </Stack>
              </FormProvider>
            </Box>
          </StackSection>
        </Popup>
        <Popup bottom>
          <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
          <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
        </Popup>
      </Popup>
    </>
  );
};

export default ScrCom0035Popup;
