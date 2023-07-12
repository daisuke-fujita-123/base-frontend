import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';

import { Box, MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, ControlsStackItem, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DatePicker } from 'controls/DatePicker';
import { WarningLabel } from 'controls/Label';
import { Select, SelectValue } from 'controls/Select';
import { TableRowModel } from 'controls/Table';
import { TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  ScrCom0008GetReportCommentCurrent, ScrCom0008GetReportCommentCurrentRequest,
  ScrCom0008RegistUpdateReportComment, ScrCom0008RegistUpdateReportCommentRequest
} from 'apis/com/ScrCom0008Api';
import {
  changeExpectDateInfo, ScrCom9999GetChangeDate, ScrCom9999GetChangeDateRequest,
  ScrCom9999GetHistoryInfo, ScrCom9999GetHistoryInfoRequest
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AppContext } from 'providers/AppContextProvider';

import { generate } from 'utils/BaseYup';

import ScrCom0032Popup, { ScrCom0032PopupModel } from './popups/SrcCom0032';

/**
 * バリデーションスキーマ
 */
const validationSchama = generate([
  'reportComment1',
  'reportComment2',
  'reportComment3',
  'reportComment4'
])


/**
 * 登録内容確認ポップアップ初期データ
 */
const initialValues: ScrCom0032PopupModel = {
  changedSections: [],
  errorMessages: [],
  warningMessages: [],
};

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 変更予約情報
  changeReservationInfoSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 変更予約情報
  changeReservationInfoSelectValues: [],
};


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
  // 履歴表示かどうかの判定
  const [historyFlag, setHistoryFlag] = useState(false);
  // 変更予定日リスト
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 帳票コメント情報取得APIにて取得した 帳票ID
  const [getReportId, setGetReportId] = useState<any>();
  // 帳票コメント情報取得APIにて取得した 帳票名
  const [getReportName, setGetReportName] = useState<any>();
  // 帳票コメント情報取得APIにて取得した コメント最大行数
  const [getCommentRow, setGetCommentRow] = useState<any>();
  // 帳票コメント情報取得APIにて取得した コメント1行最大文字数
  const [getCommentLine, setGetCommentLine] = useState<any>();
  // 帳票コメント情報取得APIにて取得した 変更タイムスタンプ
  const [getChangeTimestamp, setGetChangeTimestamp] = useState<string>();
  // 帳票コメント情報取得APIにて取得した システム種別
  const [getSystemKind, setGetSystemKind] = useState<string>();

  // user情報
  const { appContext } = useContext(AppContext);


  // form
  const methods = useForm({
    defaultValues: {
      reportComment1: '',
      reportComment2: '',
      reportComment3: '',
      reportComment4: '',
    }, resolver: yupResolver(validationSchama),
    // context: isReadOnly,
  });
  const {
    formState: { dirtyFields },
    // setValue,
    // getValues,
    // reset,
  } = methods;


  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(initialValues);


  useEffect(() => {
    // 初期表示処理(現在情報)
    const initializeCurrent = async (reportId: string) => {
      // 履歴表示画面ではない為falseを設定
      setHistoryFlag(false);

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
      setGetReportId(getCommissionDisplayResponse.reportId);
      setGetReportName(getCommissionDisplayResponse.reportName);
      setGetCommentRow(getCommissionDisplayResponse.commentRow);
      setGetCommentLine(getCommissionDisplayResponse.commentLine);
      setGetChangeTimestamp(getCommissionDisplayResponse.changeTimestamp);
      setGetSystemKind(getCommissionDisplayResponse.systemKind);
      setSelectValues({
        // 変更予約日付
        changeReservationInfoSelectValues: convertToChangeExpectDateSelectValueModel(getChangeDateResponse.changeExpectDateInfo)
      });
    }


    // 初期表示処理(履歴表示)
    const initializeHistory = async (applicationId: string) => {
      // 履歴表示画面の為trueを設定
      setHistoryFlag(true);

      // SCR-COM-9999-0025: 変更履歴情報取得API
      const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
        changeHistoryNumber: '',
      };
      const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(getHistoryInfoRequest);

      // 画面にデータを設定
      setGetReportId(getHistoryInfoResponse.changeHistoryInfo.get('reportId'));
      setGetReportName(getHistoryInfoResponse.changeHistoryInfo.get('reportName'));
      setGetCommentRow(getHistoryInfoResponse.changeHistoryInfo.get('commentRow'));
      setGetCommentLine(getHistoryInfoResponse.changeHistoryInfo.get('commentLine'));
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


  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    if (!reportId) return;

    const changeHistoryNumber = searchParams.get('change-history-number');

    // SCR-COM-9999-0025: 変更履歴情報取得API
    const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
      changeHistoryNumber: changeHistoryNumber,
    };
    const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(getHistoryInfoRequest);

    // 画面にデータを設定
    setGetReportId(getHistoryInfoResponse.changeHistoryInfo.get('reportId'));
    setGetReportName(getHistoryInfoResponse.changeHistoryInfo.get('reportName'));
    setGetCommentRow(getHistoryInfoResponse.changeHistoryInfo.get('commentRow'));
    setGetCommentLine(getHistoryInfoResponse.changeHistoryInfo.get('commentLine'));
  };


  /**
  * 確定ボタンクリック時のイベントハンドラ
  */
  const handleConfirm = async () => {
    // TODO: 登録更新の結果を登録確認ポップアップへ渡す（形式変更）
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorMessages: [],
      warningMessages: [],
      changedSections: convertToChngedSections(dirtyFields),
    });


    // SCR-COM-0008-0007: 帳票コメント情報登録更新API
    const applyRegistrationCommissionInfoRequest: ScrCom0008RegistUpdateReportCommentRequest = {
      /** 帳票ID */
      reportId: '',
      /** 帳票コメント */
      reportComment: '',
      /** 申請従業員ID */
      applicationEmployeeId: appContext.user,
      /** 登録変更メモ */
      registrationChangeMemo: '',
      /** 変更予定日 */
      changeExpectDate: '',
    };
    await ScrCom0008RegistUpdateReportComment(applyRegistrationCommissionInfoRequest);
  }

  /**
    * セクション構造定義
    */
  const sectionDef = [
    {
      section: '基本情報',
      fields: [
        'commissionId',
        'commissionName',
        'commissionKind',
        'approvalDocumentId',
        'goodsClaimCode',
        'useFlag',
        'statementKind',
        'useStartDate',
      ],
    }
  ]

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToChngedSections = (dirtyFields: object): TableRowModel[] => {
    const fields = Object.keys(dirtyFields);
    const changedSections: TableRowModel[] = [];
    sectionDef.forEach((d) => {
      fields.forEach((f) => {
        if (d.fields.includes(f)) {
          changedSections.push({
            変更種類: '帳票情報',
            セクション名: d.section,
          });
        }
      });
    });
    return changedSections;
  };


  /**
   *  API-COM-9999-0026: 変更予定日取得API レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeExpectDateSelectValueModel = (
    changeExpectDateInfo: changeExpectDateInfo[]
  ): SelectValue[] => {
    return changeExpectDateInfo.map((x) => {
      return {
        value: String(x.changeHistoryNumber),
        displayValue: x.changeExpectDate,
      };
    });
  };


  /**
 * プレビューボタンクリック時のイベントハンドラ
 */
  const handlePreviewConfirm = () => {
    // システム種別で呼び出すAPIのURIをTRAとDOCで聞き替える
    if (getSystemKind === 'TRA') {
      // API-TRA-9999-0002: イメージ帳票作成API（取引会計管理）
      // const formStorageFilePath = await ScrCom9999GetHistoryInfo(getHistoryInfoRequest);
      return;
    } else if (getSystemKind === 'DOC') {
      // API-TRA-9999-0001: イメージ帳票作成API（書類管理）
      // const formStorageFilePath = await ScrCom9999GetHistoryInfo(getHistoryInfoRequest);
      return;
    }
    // TODO: 取得した帳票格納ファイルPATHを別タブで開くことで、イメージ帳票PDFを表示する。
  };


  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/reports/');
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
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            <Section name='帳票情報'>
              <RowStack>
                <ColStack>
                  <Box>
                    <Typography variant='h5'>帳票ID</Typography>
                    {getReportId}
                  </Box>
                </ColStack>
                <ColStack>
                  <Box>
                    <Typography variant='h5'>帳票名</Typography>
                    {getReportName}
                  </Box>
                </ColStack>
                <ColStack>
                  <Box>
                    <Typography variant='h5'>最大桁数</Typography>
                    {getCommentRow}
                  </Box>
                </ColStack>
                <ColStack>
                  <Box>
                    <Typography variant='h5'>最大文字数</Typography>
                    {getCommentLine}
                  </Box>
                </ColStack>
              </RowStack>
              <br />
              <ControlsStackItem size='m'>
                <TextField name='reportComment1' disabled={historyFlag ? true : false} />
                <TextField name='reportComment2' disabled={historyFlag ? true : false} />
                <TextField name='reportComment3' disabled={historyFlag ? true : false} />
                <TextField name='reportComment4' disabled={historyFlag ? true : false} />
              </ControlsStackItem>
              <br />
              {/* TODO: プレビューボタンの配置変更するかも */}
              <Stack>
                <PrimaryButton onClick={handlePreviewConfirm}>
                  プレビュー
                </PrimaryButton>
              </Stack>
            </Section>
          </FormProvider>
        </MainLayout>

        {/* right */}
        <MainLayout right>
          <FormProvider {...methods}>
            <RowStack>
              <ColStack>
                <RightElementStack>
                  <Stack>
                    <Typography bold>変更予約情報</Typography>
                    {/* 変更予定日リストの件数が１件以上の場合「表示・活性」・0件の場合「非表示」 */}
                    {selectValues.changeReservationInfoSelectValues.length >= 1 ?
                      <WarningLabel text='変更予約あり' />
                      : ""}
                    {/* 変更予定日リストの件数が１件以上の場合「表示・活性」・0件の場合「表示・非活性 */}
                    <Select
                      name='changeHistoryNumber'
                      selectValues={selectValues.changeReservationInfoSelectValues}
                      disabled={selectValues.changeReservationInfoSelectValues.length >= 1 ? false : true}
                      blankOption
                    />
                    {/* 変更予定日リストの件数が１件以上の場合「表示・活性」・0件の場合「表示・非活性」 */}
                    <PrimaryButton
                      onClick={handleSwichDisplay}
                      disable={selectValues.changeReservationInfoSelectValues.length >= 1 ? false : true}
                    >
                      表示切替
                    </PrimaryButton>
                  </Stack>
                  <MarginBox mb={6}>
                    <DatePicker label='変更予定日' name='changeHistoryDate' />
                  </MarginBox>
                </RightElementStack>
              </ColStack>
            </RowStack>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      < ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  )

};

export default ScrCom0008Page;
