import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import {
  ScrDoc9999CreateReportImageDoc,
  ScrDoc9999CreateReportImageDocRequest,
} from 'pages/doc/ScrDoc9999Api';

import { Box, CenterBox, MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import {
  ColStack,
  ControlsStackItem,
  RightElementStack,
  RowStack,
  Stack,
} from 'layouts/Stack';

import { CancelButton, ConfirmButton, PrimaryButton } from 'controls/Button';
import { DatePicker } from 'controls/DatePicker';
import { WarningLabel } from 'controls/Label';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  ScrCom0008GetReportCommentCurrent,
  ScrCom0008GetReportCommentCurrentRequest,
  ScrCom0008RegistUpdateReportComment,
  ScrCom0008RegistUpdateReportCommentRequest,
} from 'apis/com/ScrCom0008Api';
import {
  ChangeExpectDateInfo,
  ScrCom9999GetChangeDate,
  ScrCom9999GetChangeDateRequest,
  ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoRequest,
} from 'apis/com/ScrCom9999Api';
import {
  ScrTra9999CreateReportImageTra,
  ScrTra9999CreateReportImageTraRequest,
} from 'apis/tra/ScrTra9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

import ScrCom0032Popup, {
  registrationChangeList,
  ScrCom0032PopupModel,
} from './popups/ScrCom0032Popup';

/*
 * useForm データモデル
 */
interface CorporationBasicModel {
  // 帳票コメント1
  reportComment1: string;
  // 帳票コメント2
  reportComment2: string;
  // 帳票コメント3
  reportComment3: string;
  // 帳票コメント4
  reportComment4: string;
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更履歴番号+変更予定日
  memberChangeHistories: any[];
  // 変更予定日
  changeExpectedDate: string;
}

/*
 * useForm データモデル 初期値
 */
const initialValues: CorporationBasicModel = {
  reportComment1: '',
  reportComment2: '',
  reportComment3: '',
  reportComment4: '',
  changeHistoryNumber: '',
  changeExpectedDate: '',
  memberChangeHistories: [],
};

/**
 * 登録内容確認ポップアップ初期データ
 */
const popupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: '',
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
 * 画面ID 定数
 */
const SCR_COM_0008 = 'SCR-COM-0008';

/**
 * SCR-COM-0008 帳票コメント画面
 */
const ScrCom0008Page = () => {
  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // router
  const { reportIdFromUseParam } = useParams();
  const reportId: string =
    reportIdFromUseParam !== undefined ? reportIdFromUseParam : '';

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
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckisOpen, setChangeHistoryDateCheckisOpen] =
    useState<boolean>(false);
  // 可変バリデーション用の帳票コメント
  const [reportCommentLengthForVal, setReportCommentLengthForVal] =
    useState<number>(70);

  // user情報
  const { user } = useContext(AuthContext);

  /**
   * バリデーションスキーマをAPIにて取得した"コメント1行最大文字数"に応じて動的に設定
   */
  const validationSchema = {
    reportComment1: yup
      .string()
      .label('帳票コメント1')
      .max(reportCommentLengthForVal),
    reportComment2: yup
      .string()
      .label('帳票コメント2')
      .max(reportCommentLengthForVal),
    reportComment3: yup
      .string()
      .label('帳票コメント3')
      .max(reportCommentLengthForVal),
    reportComment4: yup
      .string()
      .label('帳票コメント4')
      .max(reportCommentLengthForVal),
  };

  // form
  const methods = useForm<CorporationBasicModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchema)),
  });
  const {
    formState: { dirtyFields, errors },
    setValue,
    getValues,
    reset,
  } = methods;

  // popup
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(popupInitialValues);

  useEffect(() => {
    // 初期表示処理(現在情報)
    const initializeCurrent = async (reportId: string) => {
      // 履歴表示画面ではない為falseを設定
      setHistoryFlag(false);

      // SCR-COM-0008-0001: 帳票コメント情報取得API
      const getReportCommentCurrentRequest: ScrCom0008GetReportCommentCurrentRequest =
        {
          reportId: reportId,
        };
      const getCommissionDisplayResponse =
        await ScrCom0008GetReportCommentCurrent(getReportCommentCurrentRequest);

      // API-COM-9999-0026: 変更予定日取得API
      const getChangeDateRequest: ScrCom9999GetChangeDateRequest = {
        screenId: SCR_COM_0008,
        tabId: '',
        masterId: reportId,
        businessDate: user.taskDate,
      };
      const getChangeDateResponse = await ScrCom9999GetChangeDate(
        getChangeDateRequest
      );

      // バリデーションの文字数を設定
      setReportCommentLengthForVal(getCommissionDisplayResponse.commentLine);

      // 画面にデータを設定
      setGetReportId(getCommissionDisplayResponse.reportId);
      setGetReportName(getCommissionDisplayResponse.reportName);
      setGetCommentRow(getCommissionDisplayResponse.commentRow);
      setGetCommentLine(getCommissionDisplayResponse.commentLine);
      setGetChangeTimestamp(getCommissionDisplayResponse.changeTimestamp);
      setGetSystemKind(getCommissionDisplayResponse.systemKind);
      setSelectValues({
        // 変更予約日付
        changeReservationInfoSelectValues:
          convertToChangeExpectDateSelectValueModel(
            getChangeDateResponse.changeExpectDateInfo
          ),
      });
    };

    // 初期表示処理(履歴表示)
    const initializeHistory = async (applicationId: string) => {
      // 履歴表示画面の為trueを設定
      setHistoryFlag(true);

      // SCR-COM-9999-0025: 変更履歴情報取得API
      const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
        changeHistoryNumber: '',
      };
      const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(
        getHistoryInfoRequest
      );

      // 画面にデータを設定
      setGetReportId(getHistoryInfoResponse.changeHistoryInfo.get('reportId'));
      setGetReportName(
        getHistoryInfoResponse.changeHistoryInfo.get('reportName')
      );
      setGetCommentRow(
        getHistoryInfoResponse.changeHistoryInfo.get('commentRow')
      );
      setGetCommentLine(
        getHistoryInfoResponse.changeHistoryInfo.get('commentLine')
      );
    };

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

    const changeHistoryNumber: any = searchParams.get('change-history-number');

    // SCR-COM-9999-0025: 変更履歴情報取得API
    const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
      changeHistoryNumber: changeHistoryNumber,
    };
    const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(
      getHistoryInfoRequest
    );

    setIsChangeHistoryBtn(true);

    // 画面にデータを設定
    setGetReportId(getHistoryInfoResponse.changeHistoryInfo.get('reportId'));
    setGetReportName(
      getHistoryInfoResponse.changeHistoryInfo.get('reportName')
    );
    setGetCommentRow(
      getHistoryInfoResponse.changeHistoryInfo.get('commentRow')
    );
    setGetCommentLine(
      getHistoryInfoResponse.changeHistoryInfo.get('commentLine')
    );

    setIsChangeHistoryBtn(true);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const onClickConfirm = () => {
    if (Object.keys(errors).length) return;
    // 反映予定日整合性チェック
    setChangeHistoryDateCheckisOpen(true);
  };

  /**
   *  確定ボタンクリック時（反映予定日整合性チェック後）のイベントハンドラ
   */
  const handleConfirm = () => {
    setChangeHistoryDateCheckisOpen(false);

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: [],
      warningList: [],
      // 階層が違うため変換のメソッドにて形式を変換して設定
      registrationChangeList: convertToRegistrationChangeList(dirtyFields),
      changeExpectDate: getValues('changeHistoryNumber'),
    });
  };

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToRegistrationChangeList = (
    dirtyFields: object
  ): registrationChangeList[] => {
    // 変更を検知するフィールドのキー名リスト
    const fields = Object.keys(dirtyFields);
    // 返却する変更リスト
    const registrationChangeList: registrationChangeList[] = [];
    // 一時カラムリスト
    const tempColumnList: { columnName: string }[] = [];

    // 変更したキー名をカラムリストに設定
    fields.forEach((f) => {
      tempColumnList.push({
        columnName: f,
      });
    });

    // 変更リストとして値を設定して返却
    registrationChangeList.push({
      screenId: SCR_COM_0008,
      screenName: '帳票コメント',
      tabId: 0,
      tabName: '',
      sectionList: [
        {
          sectionName: '',
          columnList: tempColumnList,
        },
      ],
    });
    return registrationChangeList;
  };

  /**
   *  API-COM-9999-0026: 変更予定日取得API レスポンスから SelectValueモデルへの変換
   */
  const convertToChangeExpectDateSelectValueModel = (
    changeExpectDateInfo: ChangeExpectDateInfo[]
  ): SelectValue[] => {
    return changeExpectDateInfo.map((x) => {
      return {
        value: String(x.changeHistoryNumber),
        displayValue: x.changeExpectDate,
      };
    });
  };

  /**
   * TODO: プレビューボタンクリック時のイベントハンドラ
   */
  const handlePreviewConfirm = async () => {
    // システム種別で呼び出すAPIのURIをTRAとDOCで分岐
    if (getSystemKind === 'TRA') {
      // API-TRA-9999-0002: イメージ帳票作成API（取引会計管理）
      const createReportImageTraRequest: ScrTra9999CreateReportImageTraRequest =
        {
          functionId: SCR_COM_0008,
          reportId: reportId,
          reportTitle: '',
          operatorId: user.employeeId,
          operatorName: user.organizationName,
          comment: '',
        };
      const formStorageFilePath = await ScrTra9999CreateReportImageTra(
        createReportImageTraRequest
      );
    } else if (getSystemKind === 'DOC') {
      // API-TRA-9999-0001: イメージ帳票作成API（書類管理）
      const createReportImageDocRequest: ScrDoc9999CreateReportImageDocRequest =
        {
          functionId: SCR_COM_0008,
          reportId: reportId,
          reportTitle: '',
          operatorId: user.employeeId,
          operatorName: user.organizationName,
          comment: '',
        };
      const formStorageFilePath = await ScrDoc9999CreateReportImageDoc(
        createReportImageDocRequest
      );
    }
    // TODO: 取得した帳票格納ファイルPATHを別タブで開くことで、イメージ帳票PDFを表示する。
    // (formStorageFilePath)
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/com/reports/');
  };

  /**
   * 登録内容確認ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handleRegistConfirm = (registrationChangeMemo: string) => {
    setIsOpenPopup(false);
    setIsChangeHistoryBtn(false);
    // SCR-COM-0008-0007: 帳票コメント情報登録更新API
    const applyRegistrationCommissionInfoRequest: ScrCom0008RegistUpdateReportCommentRequest =
      {
        /** 帳票ID */
        reportId: reportId,
        /** 帳票コメント */
        reportComment: 'TODO: つなげて1行にする',
        /** 申請従業員ID */
        applicationEmployeeId: user.employeeId,
        /** 登録変更メモ */
        registrationChangeMemo: registrationChangeMemo,
        /** 変更予定日 */
        changeExpectDate: getValues('changeHistoryNumber'),
        /** 画面ID */
        screenId: SCR_COM_0008,
      };
    ScrCom0008RegistUpdateReportComment(applyRegistrationCommissionInfoRequest);
  };

  /**
   * 登録内容確認ポップアップの承認登録ボタンクリック時のイベントハンドラ
   */
  const handleApprovalConfirm = () => {
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
                    <Typography variant='body1'>帳票ID</Typography>
                    <Typography variant='body1'>{getReportId}</Typography>
                  </Box>
                </ColStack>
                <ColStack>
                  <Box>
                    <Typography variant='body1'>帳票名</Typography>
                    <Typography variant='body1'>{getReportName}</Typography>
                  </Box>
                </ColStack>
                <ColStack>
                  <Box>
                    <Typography variant='body1'>最大桁数</Typography>
                    <Typography variant='body1'>{getCommentRow}</Typography>
                  </Box>
                </ColStack>
                <ColStack>
                  <Box>
                    <Typography variant='body1'>最大文字数</Typography>
                    <Typography variant='body1'>{getCommentLine}</Typography>
                  </Box>
                </ColStack>
              </RowStack>
              <br />
              <ControlsStackItem size='m'>
                <TextField
                  name='reportComment1'
                  disabled={historyFlag ? true : false}
                />
                <TextField
                  name='reportComment2'
                  disabled={historyFlag ? true : false}
                />
                <TextField
                  name='reportComment3'
                  disabled={historyFlag ? true : false}
                />
                <TextField
                  name='reportComment4'
                  disabled={historyFlag ? true : false}
                />
              </ControlsStackItem>
              <br />
              <Stack>
                <CenterBox>
                  <PrimaryButton onClick={handlePreviewConfirm}>
                    プレビュー
                  </PrimaryButton>
                </CenterBox>
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
                    {selectValues.changeReservationInfoSelectValues.length >=
                    1 ? (
                      <WarningLabel text='変更予約あり' />
                    ) : (
                      ''
                    )}
                    {/* 変更予定日リストの件数が１件以上の場合「表示・活性」・0件の場合「表示・非活性 */}
                    <Select
                      name='changeHistoryNumber'
                      selectValues={
                        selectValues.changeReservationInfoSelectValues
                      }
                      disabled={
                        selectValues.changeReservationInfoSelectValues.length >=
                        1
                          ? false
                          : true
                      }
                      blankOption
                    />
                    {/* 変更予定日リストの件数が１件以上の場合「表示・活性」・0件の場合「表示・非活性」 */}
                    <PrimaryButton
                      onClick={handleSwichDisplay}
                      disable={
                        selectValues.changeReservationInfoSelectValues.length >=
                        1
                          ? false
                          : true
                      }
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
            <ConfirmButton onClick={onClickConfirm}>確定</ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      <ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        // 本機能ではこちらを使用
        handleRegistConfirm={handleRegistConfirm}
        handleApprovalConfirm={handleApprovalConfirm}
        handleCancel={handlePopupCancel}
      />

      {/* 反映予定日整合性チェック */}
      <ChangeHistoryDateCheckUtil
        changeExpectedDate={getValues('changeExpectedDate')}
        changeHistoryNumber={getValues('changeHistoryNumber')}
        isChangeHistoryBtn={isChangeHistoryBtn}
        changeHistory={selectValues.changeReservationInfoSelectValues}
        isOpen={changeHistoryDateCheckisOpen}
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default ScrCom0008Page;
