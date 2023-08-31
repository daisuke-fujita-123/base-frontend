import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack } from 'layouts/Stack';

import { TextField } from 'controls/TextField';

import {
  ScrCom0002GetSystemMessageRequest,
  ScrCom0002GetSystemMessageResponse,
  SystemMessage,
} from 'apis/com/ScrCom0002Api';

import { useForm } from 'hooks/useForm';

import { AuthContext } from 'providers/AuthProvider';

// 検索結果データモデル
interface searchResultModel {
  businessDate: string;
  message: string;
}

// 初期値データ
const initSearchResult: searchResultModel = {
  businessDate: '',
  message: '',
};

/**
 * SCR-COM-0002 TOP画面
 */
const ScrCom0002Page = () => {
  const { user } = useContext(AuthContext);
  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);
  // form
  const methods = useForm<searchResultModel>({
    defaultValues: initSearchResult,
    context: isReadOnly,
  });
  const { setValue } = methods;

  // 初期表示処理
  useEffect(() => {
    const initializeCurrent = async (businessDate: string) => {
      // システムメッセージ取得API
      const request: ScrCom0002GetSystemMessageRequest = {
        businessDate: businessDate,
      };

      const response: ScrCom0002GetSystemMessageResponse = await SystemMessage(
        request
      );
      setValue('message', response.message);
      setValue('businessDate', businessDate);
    };

    initializeCurrent(user.taskDate);
  }, [setValue, user.taskDate]);

  return (
    <MainLayout>
      <MainLayout main>
        <FormProvider {...methods}>
          <Section name='システム通知'>
            <RowStack>
              <ColStack>
                <TextField label='業務日付' name='businessDate' readonly />
                <TextField
                  label='システムメッセージ'
                  name='message'
                  size='xl'
                  readonly
                />
              </ColStack>
            </RowStack>
          </Section>
        </FormProvider>
      </MainLayout>
    </MainLayout>
  );
};

export default ScrCom0002Page;
