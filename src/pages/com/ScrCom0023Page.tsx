import React, { useContext, useEffect, useState } from 'react';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { FormProvider } from 'react-hook-form';
import { useForm } from 'hooks/useForm';
import { TextField } from 'controls/TextField';
import { Grid } from 'layouts/Grid';
import { Radio } from 'controls/Radio';
import { DatePicker } from 'controls/DatePicker/DatePicker';
import { Select, SelectValue } from 'controls/Select/Select';
import { useNavigate } from 'hooks/useNavigate';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from 'layouts/Stack';
import { CancelButton, ConfirmButton } from 'controls/Button';
import { TableRowModel } from 'controls/Table';
import ScrCom0032Popup, {
  ScrCom0032PopupModel,
} from 'pages/com/popups/ScrCom0032';


/**
 * 登録内容確認ポップアップ初期データ
 */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  // エラー内容リスト
  errorList: [{
    errorCode: '',
    errorMessages: [],
  }],
  // ワーニング内容リスト
  warningList: [{
    warningCode: '',
    warningMessages: [],
  }],
  // 登録・変更内容リスト
  registrationChangeList: [{
    // 画面ID
    screenId: '',
    // 画面名
    screenName: '',
    // タブID
    tabId: '',
    // タブ名
    tabName: '',
    // セクションリスト
    sectionList: [{
      sectionName: '',
      columnList: [{
        columnName: '',
      }]
    }],
  }],
  // 変更予定日
  changeExpectDate: '',
};


/**
 * SCR-COM-0024 会場詳細画面
 */
const ScrCom0023Page = () => {

  // router
  const navigate = useNavigate();

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);


  /**
   * 確定ボタンクリック時のイベントハンドラ
   * 
   */
  const handleConfirm = () => {
    // 登録更新の結果を登録確認ポップアップへ渡す
    setScrCom0032PopupData({
      // エラー内容リスト
      errorList: [
        {
          errorCode: 'ABCError1',
          errorMessages: ['error1', 'error2'],
        },
        {
          errorCode: 'ABCError2',
          errorMessages: ['error3'],
        },
      ],
      // ワーニング内容リスト
      warningList: [
        {
          warningCode: 'CDEWarning1',
          warningMessages: ['warning1'],
        },
        {
          warningCode: 'CDEWarning2',
          warningMessages: ['warning2', 'warning3'],
        },
        {
          warningCode: 'CDEWarning3',
          warningMessages: ['warning4', 'warning5', 'warning6', 'warning7'],
        },
      ],
      // 登録・変更内容リスト
      registrationChangeList: [{
        // 画面ID
        screenId: 'SCR-COM',
        // 画面名
        screenName: '会場詳細',
        // タブID
        tabId: '0023',
        // タブ名
        tabName: '基本情報',
        // セクションリスト
        sectionList: [
          {
            sectionName: '基本情報セクション',
            columnList: [
              {
                columnName: '手数料ID',
              },
              {
                columnName: '手数料名',
              },
              {
                columnName: '稟議書ID',
              },
            ]
          },
          {
            sectionName: '条件設定セクション',
            columnList: [
              {
                columnName: '条件種類',
              },
            ]
          },
          {
            sectionName: '価格設定セクション',
            columnList: [
              {
                columnName: '手数料金額',
              },
            ]
          },
        ],
      }],
      // 変更予定日
      changeExpectDate: '2022/03/18',
    });
    setIsOpenPopup(true);
  };


  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/places');
  };


  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = () => {
    setIsOpenPopup(false);
  };


  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };


  return (
    <>
      <MainLayout>
        aaa
        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout >

      {/* 登録内容確認ポップアップ */}
      < ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  )
}
export default ScrCom0023Page;