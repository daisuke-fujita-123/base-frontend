import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';

import {
  ScrCom0008GetReportCommentCurrent, ScrCom0008GetReportCommentCurrentRequest
} from 'apis/com/ScrCom0008Api';
import {
  ScrCom9999GetChangeDate, ScrCom9999GetChangeDateRequest, ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoRequest
} from 'apis/com/ScrCom9999Api';

import { useNavigate } from 'hooks/useNavigate';

/**
 * SCR-COM-0008 帳票コメント画面
 */
const ScrCom0008Page = () => {

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // router
  const { reportId } = useParams();
  // パスパラメータから取得する変更履歴番号
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // state

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);


  useEffect(() => {
    // 初期表示処理(現在情報)
    const initializeCurrent = async (reportId: string) => {

      // SCR-COM-0008-0001: 帳票コメント情報取得API
      const getReportCommentCurrentRequest: ScrCom0008GetReportCommentCurrentRequest = {
        reportId: reportId,
      };
      const getCommissionDisplayResponse = await ScrCom0008GetReportCommentCurrent(getReportCommentCurrentRequest);

      // API-COM-9999-0026: 変更予定日取得API
      const getChangeDateRequest: ScrCom9999GetChangeDateRequest = {
        // TODO: 業務日付取得方法実装後に変更
        businessDate: '',
        screenId: '',
        tabId: 'SCR-COM-0008',
        getKeyValue: '',
      };
      const getChangeDateResponse = await ScrCom9999GetChangeDate(getChangeDateRequest);


      // 画面にデータを設定
      // setValue('commissionId', commissionId);
      // setValue('commissionName', getCommissionDisplayResponse.commissionName);
      // setValue('approvalDocumentId', getCommissionDisplayResponse.approvalDocumentId);
      // setValue('useFlag', getCommissionDisplayResponse.useFlag);
      // setValue('useStartDate', getCommissionDisplayResponse.useStartDate);
    }


    // 初期表示処理(履歴表示)
    const initializeHistory = async (applicationId: string) => {
      // SCR-COM-9999-0025: 変更履歴情報取得API
      const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
        changeHistoryNumber: '',
      };
      const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(getHistoryInfoRequest);
    }


    // 現在情報表示の初期化処理
    if (reportId !== null && reportId !== undefined) {
      initializeCurrent(reportId);
    }

    // 履歴表示の初期化処理
    const changeHistoryNumber = searchParams.get('change-history-number');
    if (changeHistoryNumber !== undefined && changeHistoryNumber !== null) {
      initializeHistory(changeHistoryNumber);
    }
  }, []);


  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 基本情報セクション */}
            <Section name='帳票情報'>
              <ColStack>
                <TextField label='手数料ID' name='commissionId' />
                <TextField label='手数料名' name='commissionName' required />
                <TextField label='稟議書ID' name='approvalDocumentId' />
              </ColStack >
            </Section>
          </FormProvider>

          {/* bottom */}
          <MainLayout bottom>
            <Stack direction='row' alignItems='center'>
              <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
              <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
            </Stack>
          </MainLayout>

          {/* 登録内容確認ポップアップ */}
          < ScrCom0032Popup
            isOpen={isOpenPopup}
            data={scrCom0032PopupData}
            handleConfirm={handlePopupConfirm}
            handleCancel={handlePopupCancel}
          />
        </MainLayout>
      </MainLayout>
    </>
  )

};

export default ScrCom0008Page;
