import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { Box, CenterBox, MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

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
  ScrCom9999GetHistoryInfo,
  ScrCom9999GetHistoryInfoRequest,
  ScrCom9999GetHistoryInfoResponse,
} from 'apis/com/ScrCom0008Api';
import {
  ChangeExpectDateInfo,
  ScrCom9999GetChangeDate,
  ScrCom9999GetChangeDateRequest,
} from 'apis/com/ScrCom9999Api';
import {
  ScrTra9999CreateReportImageTra,
  ScrTra9999CreateReportImageTraRequest,
} from 'apis/tra/ScrTra9999Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';

import ChangeHistoryDateCheckUtil from 'utils/ChangeHistoryDateCheckUtil';

import { format } from 'date-fns';
import ScrCom0032Popup, {
  columnList,
  ScrCom0032PopupModel,
  sectionList,
} from './popups/ScrCom0032Popup';

/*
 * useForm データモデル
 */
interface reportBasicModel {
  // 帳票コメント1
  reportComment1: string;
  // 帳票コメント2
  reportComment2: string;
  // 帳票コメント3
  reportComment3: string;
  // 帳票コメント4
  reportComment4: string;
  // 帳票コメント5
  reportComment5: string;
  // 帳票コメント6
  reportComment6: string;
  // 帳票コメント7
  reportComment7: string;
  // 帳票コメント8
  reportComment8: string;
  // 帳票コメント9
  reportComment9: string;
  // 帳票コメント10
  reportComment10: string;
  // 帳票コメント11
  reportComment11: string;
  // 帳票コメント12
  reportComment12: string;
  // 帳票コメント13
  reportComment13: string;
  // 帳票コメント14
  reportComment14: string;
  // 帳票コメント15
  reportComment15: string;
  // 変更履歴番号
  changeHistoryNumber: string;
  // 変更予定日
  changeExpectedDate: string;
}

/*
 * useForm データモデル 初期値
 */
const initialValues: reportBasicModel = {
  reportComment1: '',
  reportComment2: '',
  reportComment3: '',
  reportComment4: '',
  reportComment5: '',
  reportComment6: '',
  reportComment7: '',
  reportComment8: '',
  reportComment9: '',
  reportComment10: '',
  reportComment11: '',
  reportComment12: '',
  reportComment13: '',
  reportComment14: '',
  reportComment15: '',
  changeHistoryNumber: '',
  changeExpectedDate: '',
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
  // router
  const { reportId } = useParams();

  // パスパラメータから取得する変更履歴番号
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // state
  // 初期表示時の値の配列
  const [initReportResult, setInitReportResult] = useState<string[]>([]);

  // 履歴表示かどうかの判定
  const [historyFlag, setHistoryFlag] = useState(false);
  // 表示切替時かどうかの判定
  const [switchFlag, setSwitchFlag] = useState(false);

  // 変更予定日リスト
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 帳票コメント情報取得APIにて取得した 帳票ID
  const [getReportId, setGetReportId] = useState<string>('');
  // 帳票コメント情報取得APIにて取得した 帳票名
  const [getReportName, setGetReportName] = useState<string>('');
  // 帳票コメント情報取得APIにて取得した コメント最大行数
  const [getCommentRow, setGetCommentRow] = useState<number>(0);
  // 帳票コメント情報取得APIにて取得した ポップアップコメント最大行数
  const [getPopupCommentRow, setGetPopupCommentRow] = useState<number>(0);
  // 帳票コメント情報取得APIにて取得した コメント1行最大文字数
  const [getCommentLine, setGetCommentLine] = useState<number>(0);
  // 帳票コメント情報取得APIにて取得した システム種別
  const [getSystemKind, setGetSystemKind] = useState<string>('');
  // 可変バリデーション用の帳票コメント
  const [reportCommentLengthForVal, setReportCommentLengthForVal] =
    useState<number>(70);

  // 日付の相関チェック用
  const [isChangeHistoryBtn, setIsChangeHistoryBtn] = useState<boolean>(false);
  const [changeHistoryDateCheckisOpen, setChangeHistoryDateCheckisOpen] =
    useState<boolean>(false);

  // user情報
  const { user } = useContext(AuthContext);
  // 権限フラグ true => 編集権限
  const readonly = user.editPossibleScreenIdList.includes(SCR_COM_0008);

  /**
   * バリデーションスキーマをAPIにて取得した"コメント1行最大文字数"に応じて動的に設定
   */
  const validationSchema = {
    reportComment1: yup
      .string()
      .label('帳票コメント1行目')
      .max(reportCommentLengthForVal),
    reportComment2: yup
      .string()
      .label('帳票コメント2行目')
      .max(reportCommentLengthForVal),
    reportComment3: yup
      .string()
      .label('帳票コメント3行目')
      .max(reportCommentLengthForVal),
    reportComment4: yup
      .string()
      .label('帳票コメント4行目')
      .max(reportCommentLengthForVal),
    reportComment5: yup
      .string()
      .label('帳票コメント5行目')
      .max(reportCommentLengthForVal),
    reportComment6: yup
      .string()
      .label('帳票コメント6行目')
      .max(reportCommentLengthForVal),
    reportComment7: yup
      .string()
      .label('帳票コメン7行目')
      .max(reportCommentLengthForVal),
    reportComment8: yup
      .string()
      .label('帳票コメント8行目')
      .max(reportCommentLengthForVal),
    reportComment9: yup
      .string()
      .label('帳票コメント9行目')
      .max(reportCommentLengthForVal),
    reportComment10: yup
      .string()
      .label('帳票コメント10行目')
      .max(reportCommentLengthForVal),
    reportComment111: yup
      .string()
      .label('帳票コメント11行目')
      .max(reportCommentLengthForVal),
    reportComment12: yup
      .string()
      .label('帳票コメント12行目')
      .max(reportCommentLengthForVal),
    reportComment13: yup
      .string()
      .label('帳票コメント13行目')
      .max(reportCommentLengthForVal),
    reportComment14: yup
      .string()
      .label('帳票コメント14行目')
      .max(reportCommentLengthForVal),
    reportComment15: yup
      .string()
      .label('帳票コメント15行目')
      .max(reportCommentLengthForVal),
    // 変更予定日(表示切替ボタン押下時のみ必須入力とする)
    changeExpectedDate: switchFlag
      ? yup.string().label('変更予定日').date().required()
      : yup.string().label('変更予定日').date(),
  };

  // form
  const methods = useForm<reportBasicModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchema)),
  });
  const {
    formState: { errors },
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
      // 表示切替ではない為falseを設定
      setSwitchFlag(false);

      // SCR-COM-0008-0001: 帳票コメント情報取得API
      const getReportCommentCurrentRequest: ScrCom0008GetReportCommentCurrentRequest =
        {
          reportId: reportId,
        };
      const getCommissionDisplayResponse =
        await ScrCom0008GetReportCommentCurrent(getReportCommentCurrentRequest);

      // 画面にデータを設定
      setGetReportId(getCommissionDisplayResponse.reportId);
      setGetReportName(getCommissionDisplayResponse.reportName);
      setGetCommentRow(getCommissionDisplayResponse.commentRow);
      setGetPopupCommentRow(getCommissionDisplayResponse.popupCommentRow);
      setGetCommentLine(getCommissionDisplayResponse.commentLine);
      setGetSystemKind(getCommissionDisplayResponse.systemKind);

      // 変更項目を検知する為の一時配列を用意
      const tempColumnNameList: string[] = [];

      // 改行コードでつながっている帳票コメントを改行コード毎に行単位に分割してコメント行に初期設定する
      const comments: string[] =
        getCommissionDisplayResponse.reportComment.split(/\n/);
      comments.forEach((comment, i) => {
        if (i === 0) {
          setValue(`reportComment1`, comment);
        } else if (i === 1) {
          setValue(`reportComment2`, comment);
        } else if (i === 2) {
          setValue(`reportComment3`, comment);
        } else if (i === 3) {
          setValue(`reportComment4`, comment);
        } else if (i === 4) {
          setValue(`reportComment5`, comment);
        } else if (i === 5) {
          setValue(`reportComment6`, comment);
        } else if (i === 6) {
          setValue(`reportComment7`, comment);
        } else if (i === 7) {
          setValue(`reportComment8`, comment);
        } else if (i === 8) {
          setValue(`reportComment9`, comment);
        } else if (i === 9) {
          setValue(`reportComment10`, comment);
        } else if (i === 10) {
          setValue(`reportComment11`, comment);
        } else if (i === 11) {
          setValue(`reportComment12`, comment);
        } else if (i === 12) {
          setValue(`reportComment13`, comment);
        } else if (i === 13) {
          setValue(`reportComment14`, comment);
        } else if (i === 14) {
          setValue(`reportComment15`, comment);
        }
        tempColumnNameList.push(comment);
      });

      // 初期表示時の値として変更項目比較用に保持
      setInitReportResult(tempColumnNameList);

      // バリデーションの文字数を設定
      setReportCommentLengthForVal(getCommissionDisplayResponse.commentLine);

      // API-COM-9999-0026: 変更予定日取得API
      const getChangeDateRequest: ScrCom9999GetChangeDateRequest = {
        screenId: SCR_COM_0008,
        masterId: reportId,
        businessDate: user.taskDate,
      };
      const getChangeDateResponse = await ScrCom9999GetChangeDate(
        getChangeDateRequest
      );

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
      // 表示切替ではない為falseを設定
      setSwitchFlag(false);
      const isSwitch = false;

      // SCR-COM-9999-0025: 変更履歴情報取得API
      const getHistoryInfoRequest: ScrCom9999GetHistoryInfoRequest = {
        changeHistoryNumber: applicationId,
      };
      const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(
        getHistoryInfoRequest
      );

      // 変更履歴から受け取った帳票コメント、変更予定日を変換
      const historyInfo = convertToHistoryInfo(
        getHistoryInfoResponse,
        applicationId,
        getHistoryInfoResponse.changeHistoryInfo.changeExpectDate,
        isSwitch
      );

      // 帳票コメント、変更予定日に値を設定
      reset(historyInfo);

      // 帳票コメント、変更予定日以外のデータを設定
      setGetReportId(getHistoryInfoResponse.changeHistoryInfo.reportId);
      setGetReportName(getHistoryInfoResponse.changeHistoryInfo.reportName);
      setGetCommentRow(getHistoryInfoResponse.changeHistoryInfo.commentRow);
      setGetPopupCommentRow(
        getHistoryInfoResponse.changeHistoryInfo.popupCommentRow
      );
      setGetCommentLine(getHistoryInfoResponse.changeHistoryInfo.commentLine);
      setGetSystemKind(getHistoryInfoResponse.changeHistoryInfo.systemKind);
    };

    // 履歴表示の初期化処理
    const changeHistoryNumber = searchParams.get('change-history-number');
    if (changeHistoryNumber !== undefined && changeHistoryNumber !== null) {
      initializeHistory(changeHistoryNumber);
    } else if (reportId !== null && reportId !== undefined) {
      // 現在情報表示の初期化処理
      initializeCurrent(reportId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 表示切替ボタンクリック時のイベントハンドラ
   */
  const handleSwichDisplay = async () => {
    if (!reportId) return;

    // 表示切替の為trueを設定
    setSwitchFlag(true);
    const isSwitch = true;

    // API-COM-0008-0025: 変更履歴情報取得API
    const getHistoryInfoRequest = {
      changeHistoryNumber: getValues('changeHistoryNumber'),
    };
    const getHistoryInfoResponse = await ScrCom9999GetHistoryInfo(
      getHistoryInfoRequest
    );

    // 変更履歴から受け取った帳票コメント、変更予定日を変換
    const historyInfo = convertToHistoryInfo(
      getHistoryInfoResponse,
      getValues('changeHistoryNumber'),
      getHistoryInfoResponse.changeHistoryInfo.changeExpectDate,
      isSwitch
    );

    setIsChangeHistoryBtn(true);

    // 画面の帳票コメント、変更予定日に値を設定
    reset(historyInfo);

    // 画面の帳票コメント、変更予定日以外のデータを設定
    // 帳票コメント以外のデータを設定
    setGetReportId(getHistoryInfoResponse.changeHistoryInfo.reportId);
    setGetReportName(getHistoryInfoResponse.changeHistoryInfo.reportName);
    setGetCommentRow(getHistoryInfoResponse.changeHistoryInfo.commentRow);
    setGetPopupCommentRow(
      getHistoryInfoResponse.changeHistoryInfo.popupCommentRow
    );
    setGetCommentLine(getHistoryInfoResponse.changeHistoryInfo.commentLine);
    setGetSystemKind(getHistoryInfoResponse.changeHistoryInfo.systemKind);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const onClickConfirm = () => {
    // 単項目チェックでerrorsが1つでもある場合は後続の処理を行わない
    if (Object.keys(errors).length) return;
    // 反映予定日整合性チェック
    setChangeHistoryDateCheckisOpen(true);
  };

  /**
   * 確定ボタンクリック時（反映予定日整合性チェック後）のイベントハンドラ
   */
  const handleConfirm = (checkFlg: boolean) => {
    setChangeHistoryDateCheckisOpen(false);
    // メッセージダイアログにて[No]を選択時は以降の処理を行わない
    if (!checkFlg) return;

    // 変更された値を格納する一時配列を用意
    const fields: string[] = [];

    for (let i = 0; i < getCommentRow; i++) {
      if (i === 0) {
        if (
          (initReportResult[0] === undefined &&
            getValues('reportComment1') !== '') ||
          (initReportResult[0] !== undefined &&
            initReportResult[0] !== getValues('reportComment1'))
        ) {
          fields.push('reportComment1');
        }
      }
      if (i === 1) {
        if (
          (initReportResult[1] === undefined &&
            getValues('reportComment2') !== '') ||
          (initReportResult[1] !== undefined &&
            initReportResult[1] !== getValues('reportComment2'))
        ) {
          fields.push('reportComment2');
        }
      }
      if (i === 2) {
        if (
          (initReportResult[2] === undefined &&
            getValues('reportComment3') !== '') ||
          (initReportResult[2] !== undefined &&
            initReportResult[2] !== getValues('reportComment3'))
        ) {
          fields.push('reportComment3');
        }
      }
      if (i === 3) {
        if (
          (initReportResult[3] === undefined &&
            getValues('reportComment4') !== '') ||
          (initReportResult[3] !== undefined &&
            initReportResult[3] !== getValues('reportComment4'))
        ) {
          fields.push('reportComment4');
        }
      }
      if (i === 4) {
        if (
          (initReportResult[4] === undefined &&
            getValues('reportComment5') !== '') ||
          (initReportResult[4] !== undefined &&
            initReportResult[4] !== getValues('reportComment5'))
        ) {
          fields.push('reportComment5');
        }
      }
      if (i === 5) {
        if (
          (initReportResult[5] === undefined &&
            getValues('reportComment6') !== '') ||
          (initReportResult[5] !== undefined &&
            initReportResult[5] !== getValues('reportComment6'))
        ) {
          fields.push('reportComment6');
        }
      }
      if (i === 6) {
        if (
          (initReportResult[6] === undefined &&
            getValues('reportComment7') !== '') ||
          (initReportResult[6] !== undefined &&
            initReportResult[6] !== getValues('reportComment7'))
        ) {
          fields.push('reportComment7');
        }
      }
      if (i === 7) {
        if (
          (initReportResult[7] === undefined &&
            getValues('reportComment8') !== '') ||
          (initReportResult[7] !== undefined &&
            initReportResult[7] !== getValues('reportComment8'))
        ) {
          fields.push('reportComment8');
        }
      }
      if (i === 8) {
        if (
          (initReportResult[8] === undefined &&
            getValues('reportComment9') !== '') ||
          (initReportResult[8] !== undefined &&
            initReportResult[8] !== getValues('reportComment9'))
        ) {
          fields.push('reportComment9');
        }
      }
      if (i === 9) {
        if (
          (initReportResult[9] === undefined &&
            getValues('reportComment10') !== '') ||
          (initReportResult[9] !== undefined &&
            initReportResult[9] !== getValues('reportComment10'))
        ) {
          fields.push('reportComment10');
        }
      }
      if (i === 10) {
        if (
          (initReportResult[10] === undefined &&
            getValues('reportComment11') !== '') ||
          (initReportResult[10] !== undefined &&
            initReportResult[10] !== getValues('reportComment11'))
        ) {
          fields.push('reportComment11');
        }
      }
      if (i === 11) {
        if (
          (initReportResult[11] === undefined &&
            getValues('reportComment12') !== '') ||
          (initReportResult[11] !== undefined &&
            initReportResult[11] !== getValues('reportComment12'))
        ) {
          fields.push('reportComment12');
        }
      }
      if (i === 12) {
        if (
          (initReportResult[12] === undefined &&
            getValues('reportComment13') !== '') ||
          (initReportResult[12] !== undefined &&
            initReportResult[12] !== getValues('reportComment13'))
        ) {
          fields.push('reportComment13');
        }
      }
      if (i === 13) {
        if (
          (initReportResult[13] === undefined &&
            getValues('reportComment14') !== '') ||
          (initReportResult[13] !== undefined &&
            initReportResult[13] !== getValues('reportComment14'))
        ) {
          fields.push('reportComment14');
        }
      }
      if (i === 14) {
        if (
          (initReportResult[14] === undefined &&
            getValues('reportComment15') !== '') ||
          (initReportResult[14] !== undefined &&
            initReportResult[14] !== getValues('reportComment15'))
        ) {
          fields.push('reportComment15');
        }
      }
    }

    // 登録更新の結果を登録確認ポップアップへ渡す
    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: [],
      warningList: [],
      registrationChangeList: [
        {
          screenId: SCR_COM_0008,
          screenName: '帳票コメント',
          tabId: 0,
          tabName: '',
          sectionList: convertToSectionList(fields),
        },
      ],
      changeExpectDate: getValues('changeExpectedDate'),
    });
  };

  /**
   * セクション構造定義
   */
  const sectionDef = [
    {
      section: '帳票情報',
      fields: [
        'reportComment1',
        'reportComment2',
        'reportComment3',
        'reportComment4',
        'reportComment5',
        'reportComment6',
        'reportComment7',
        'reportComment8',
        'reportComment9',
        'reportComment10',
        'reportComment11',
        'reportComment12',
        'reportComment13',
        'reportComment14',
        'reportComment15',
      ],
      name: [
        '帳票コメント1行目',
        '帳票コメント2行目',
        '帳票コメント3行目',
        '帳票コメント4行目',
        '帳票コメント5行目',
        '帳票コメント6行目',
        '帳票コメント7行目',
        '帳票コメント8行目',
        '帳票コメント9行目',
        '帳票コメント10行目',
        '帳票コメント11行目',
        '帳票コメント12行目',
        '帳票コメント13行目',
        '帳票コメント14行目',
        '帳票コメント15行目',
      ],
    },
  ];

  /**
   * 変更した項目から登録・変更内容データへの変換
   */
  const convertToSectionList = (fields: string[]): sectionList[] => {
    const sectionList: sectionList[] = [];
    sectionDef.forEach((d) => {
      const columnList: columnList[] = [];
      fields.forEach((f) => {
        if (d.fields.includes(f)) {
          columnList.push({ columnName: d.name[d.fields.indexOf(f)] });
        }
      });
      sectionList.push({
        sectionName: d.section,
        columnList: columnList,
      });
    });
    return sectionList;
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
        displayValue: format(new Date(x.changeExpectDate), 'yyyy/MM/dd'),
      };
    });
  };

  /**
   * 変更履歴情報取得APIリクエストからデータモデルへの変換
   */
  const convertToHistoryInfo = (
    getHistoryInfoResponse: ScrCom9999GetHistoryInfoResponse,
    changeHistoryNumber: string,
    changeExpectedDate: string,
    isSwitch: boolean
  ): reportBasicModel => {
    // 改行コードでつながっている帳票コメントを改行コード毎に行単位に分割してコメント行に初期設定する
    const comments: string[] =
      getHistoryInfoResponse.changeHistoryInfo.reportComment.split(/\n/);

    // 帳票コメントに値を設定
    return {
      reportComment1: comments[0] !== null ? comments[0] : '',
      reportComment2: comments[1] !== null ? comments[1] : '',
      reportComment3: comments[2] !== null ? comments[2] : '',
      reportComment4: comments[3] !== null ? comments[3] : '',
      reportComment5: comments[4] !== null ? comments[4] : '',
      reportComment6: comments[5] !== null ? comments[5] : '',
      reportComment7: comments[6] !== null ? comments[6] : '',
      reportComment8: comments[7] !== null ? comments[7] : '',
      reportComment9: comments[8] !== null ? comments[8] : '',
      reportComment10: comments[9] !== null ? comments[9] : '',
      reportComment11: comments[10] !== null ? comments[10] : '',
      reportComment12: comments[11] !== null ? comments[11] : '',
      reportComment13: comments[12] !== null ? comments[12] : '',
      reportComment14: comments[13] !== null ? comments[13] : '',
      reportComment15: comments[14] !== null ? comments[14] : '',
      changeHistoryNumber: changeHistoryNumber,
      changeExpectedDate:
        changeExpectedDate === null || isSwitch
          ? ''
          : format(new Date(changeExpectedDate), 'yyyy/MM/dd'),
    };
  };

  /**
   * プレビューボタンクリック時のイベントハンドラ
   */
  const handlePreviewConfirm = async () => {
    /* eslint @typescript-eslint/no-explicit-any: 0 */
    // 動的に取得したコメント行数文のコメントを取得
    let commentRowList: string[] = [];
    commentRowList = commentDetail();
    let formStorageFile: any;
    if (getSystemKind === 'TRA') {
      // API-TRA-9999-0002: イメージ帳票作成API（取引会計管理）
      const createReportImageTraRequest: ScrTra9999CreateReportImageTraRequest =
        {
          functionId: SCR_COM_0008,
          reportId: reportId !== undefined ? reportId : '',
          reportTitle: '',
          operatorId: user.employeeId,
          operatorName: user.organizationName,
          comment: commentRowList.join('\n'),
        };
      formStorageFile = await ScrTra9999CreateReportImageTra(
        createReportImageTraRequest
      );

      // 取得した帳票格納ファイルを別タブで開くことで、イメージ帳票PDFを表示する。
      const downloadUrl = window.URL.createObjectURL(formStorageFile);
      window.open(downloadUrl, '__blank');
      window.URL.revokeObjectURL(downloadUrl);
    }
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

    // 動的に取得したコメント行数文のコメントを取得
    let commentRowList: string[] = [];
    commentRowList = commentDetail();

    // SCR-COM-0008-0007: 帳票コメント情報登録更新API
    const applyRegistrationCommissionInfoRequest: ScrCom0008RegistUpdateReportCommentRequest =
      {
        /** 帳票ID */
        reportId: reportId !== undefined ? reportId : '',
        /** システム種別 */
        systemKind: getSystemKind,
        /** 帳票名 */
        reportName: getReportName,
        /** コメント最大行数 */
        commentRow: getCommentRow,
        /** ポップアップコメント最大行数 */
        popupCommentRow: getPopupCommentRow,
        /** コメント１行最大文字数 */
        commentLine: getCommentLine,
        /** 帳票コメント */
        // 改行コードでつなげた一つの文字列として帳票コメントを送る
        reportComment: commentRowList.join('\n'),
        /** 申請従業員ID */
        applicationEmployeeId: user.employeeId,
        /** 登録変更メモ */
        registrationChangeMemo: registrationChangeMemo,
        /** 変更予定日 */
        changeExpectDate:
          getValues('changeExpectedDate') !== ''
            ? format(new Date(getValues('changeExpectedDate')), 'yyyy-MM-dd')
            : undefined,
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

  /**
   *  コメント動的可変の処理
   */
  const reportCommentLine = () => {
    const commentBox = [];
    for (let i = 1; i <= getCommentRow; i++) {
      commentBox.push(
        <TextField
          name={`reportComment${i}`}
          key={`reportComment${i}`}
          size='l'
          disabled={historyFlag || !readonly ? true : false}
        />
      );
      // 最大15個のコメント列にするように制御
      if (i === 15) {
        break;
      }
    }
    return commentBox;
  };

  /**
   * 動的に取得したコメント行数文のコメントを取得
   */
  const commentDetail = () => {
    const commentRowList: string[] = [];
    if (getCommentRow >= 15) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
      commentRowList.push(getValues('reportComment9'));
      commentRowList.push(getValues('reportComment10'));
      commentRowList.push(getValues('reportComment11'));
      commentRowList.push(getValues('reportComment12'));
      commentRowList.push(getValues('reportComment13'));
      commentRowList.push(getValues('reportComment14'));
      commentRowList.push(getValues('reportComment15'));
    } else if (getCommentRow === 14) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
      commentRowList.push(getValues('reportComment9'));
      commentRowList.push(getValues('reportComment10'));
      commentRowList.push(getValues('reportComment11'));
      commentRowList.push(getValues('reportComment12'));
      commentRowList.push(getValues('reportComment13'));
      commentRowList.push(getValues('reportComment14'));
    } else if (getCommentRow === 13) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
      commentRowList.push(getValues('reportComment9'));
      commentRowList.push(getValues('reportComment10'));
      commentRowList.push(getValues('reportComment11'));
      commentRowList.push(getValues('reportComment12'));
      commentRowList.push(getValues('reportComment13'));
    } else if (getCommentRow === 12) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
      commentRowList.push(getValues('reportComment9'));
      commentRowList.push(getValues('reportComment10'));
      commentRowList.push(getValues('reportComment11'));
      commentRowList.push(getValues('reportComment12'));
    } else if (getCommentRow === 11) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
      commentRowList.push(getValues('reportComment9'));
      commentRowList.push(getValues('reportComment10'));
      commentRowList.push(getValues('reportComment11'));
    } else if (getCommentRow === 10) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
      commentRowList.push(getValues('reportComment9'));
      commentRowList.push(getValues('reportComment10'));
    } else if (getCommentRow === 9) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
      commentRowList.push(getValues('reportComment9'));
    } else if (getCommentRow === 8) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
    } else if (getCommentRow === 7) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
    } else if (getCommentRow === 6) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
    } else if (getCommentRow === 5) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
    } else if (getCommentRow === 4) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
    } else if (getCommentRow === 3) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
    } else if (getCommentRow === 2) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
    } else if (getCommentRow === 1) {
      commentRowList.push(getValues('reportComment1'));
    }
    return commentRowList;
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            <Section name='帳票情報' fitInside>
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
                    <Typography variant='body1'>
                      {getCommentRow}/{getCommentRow + getPopupCommentRow}
                    </Typography>
                  </Box>
                </ColStack>
                <ColStack>
                  <Box>
                    <Typography variant='body1'>1行最大文字数</Typography>
                    <Typography variant='body1'>{getCommentLine}</Typography>
                  </Box>
                </ColStack>
              </RowStack>
              <br />
              {/* コメント行数をAPIから取得した最大行数分可変させる */}
              {reportCommentLine()}
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
            <RightElementStack>
              <Stack>
                <Typography bold>変更予約情報</Typography>
                {/* 変更予定日リストの件数が１件以上の場合「表示・活性」・0件の場合「非表示」 */}
                {selectValues.changeReservationInfoSelectValues.length >= 1 && (
                  <WarningLabel text='変更予約あり' />
                )}
                {/* 変更予定日リストの件数が１件以上の場合「表示・活性」・0件の場合「非表示」 */}
                {selectValues.changeReservationInfoSelectValues.length >= 1 && (
                  <Select
                    name='changeHistoryNumber'
                    selectValues={
                      selectValues.changeReservationInfoSelectValues
                    }
                    disabled={!readonly}
                    blankOption
                  />
                )}
                {/* 変更予定日リストの件数が１件以上の場合「表示・活性」・0件の場合「非表示」 */}
                {selectValues.changeReservationInfoSelectValues.length >= 1 && (
                  <PrimaryButton
                    onClick={handleSwichDisplay}
                    disable={!readonly}
                  >
                    表示切替
                  </PrimaryButton>
                )}
              </Stack>
              <MarginBox mb={6}>
                <DatePicker
                  label='変更予定日'
                  name='changeExpectedDate'
                  disabled={historyFlag || !readonly ? true : false}
                  required={switchFlag}
                />
              </MarginBox>
            </RightElementStack>
          </FormProvider>
        </MainLayout>

        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel} disable={historyFlag}>
              キャンセル
            </CancelButton>
            {/* 参照権限か履歴表示の場合非活性 */}
            <ConfirmButton
              onClick={onClickConfirm}
              disable={historyFlag || !readonly}
            >
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>

      {/* 登録内容確認ポップアップ */}
      {isOpenPopup && (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          // 本機能ではこちらを使用
          handleRegistConfirm={handleRegistConfirm}
          handleApprovalConfirm={handleApprovalConfirm}
          handleCancel={handlePopupCancel}
        />
      )}

      {/* 反映予定日整合性チェック */}
      {changeHistoryDateCheckisOpen ? (
        <ChangeHistoryDateCheckUtil
          changeExpectedDate={getValues('changeExpectedDate')}
          changeHistoryNumber={getValues('changeHistoryNumber')}
          isChangeHistoryBtn={isChangeHistoryBtn}
          changeHistory={selectValues.changeReservationInfoSelectValues}
          isOpen={changeHistoryDateCheckisOpen}
          handleConfirm={handleConfirm}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrCom0008Page;
