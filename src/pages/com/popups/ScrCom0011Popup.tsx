import React, { useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { Box } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';
import { ColStack, RowStack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  reportList,
  ScrCom0011GetReportListInfo,
  ScrCom0011GetReportListInfoRequest,
  ScrCom0011GetReportListInfoResponse,
} from 'apis/com/ScrCom0011Api';

import { useForm } from 'hooks/useForm';

/**
 * 帳票選択ポップアップデータモデル
 */
export interface ScrCom0011PopupModel {
  screenId: string;
}

/**
 * 帳票選択ポップアップProps
 */
interface ScrCom0011PopupProps {
  isOpen: boolean;
  data: ScrCom0011PopupModel;
  // キャンセルボタン押下時に渡すパラメータ（なし）
  handleCancel: () => void;
  // 出力ボタン押下時に呼び出し元へ渡すパラメータ
  handleConfirm: (
    // 帳票ID
    reportId: string,
    // 帳票名
    reportName: string,
    // 帳票コメント
    reportComment: string,
    // 初期値
    defaultValue: string
  ) => void;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 出力帳票選択
  outputReportInfoSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 出力帳票選択
  outputReportInfoSelectValues: [],
};

/*
 * useForm データモデル
 */
interface reportModel {
  reportComment1: string;
  reportComment2: string;
  reportComment3: string;
  reportComment4: string;
  reportComment5: string;
  reportComment6: string;
  reportComment7: string;
  reportComment8: string;
  reportComment9: string;
  reportComment10: string;
  // 出力帳票
  outputReporsSelection: string;
}

/*
 * useForm データモデル 初期値
 */
const initialValues: reportModel = {
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
  // 出力帳票
  outputReporsSelection: '',
};

/**
 * 帳票出力ポップアップ
 */
const ScrCom0011Popup = (props: ScrCom0011PopupProps) => {
  // props
  const { isOpen, handleCancel, data } = props;

  // state
  const [reportsValue, setReportsValue] =
    useState<ScrCom0011GetReportListInfoResponse>();
  const [commentRow, setCommentRow] = useState<number>();
  const [commentLine, setCommentLine] = useState<number>();
  // 出力帳票リスト
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 帳票ID
  const [reportId, setReportId] = useState<string>('');
  // 帳票名
  const [reportName, setReportName] = useState<string>('');

  // 初期値
  const [defaultValue, setDefaultValue] = useState<string>('');
  // trueの場合  => "最大行数"と"1行最大文字数"が共にNull
  const [isNull, setIsNull] = useState<boolean>();
  // 可変させるコメントの行数(バリデーション)
  const [rowCount, setRowCount] = useState<number>(1);
  // 可変させるコメントの文字数(バリデーション)
  const [reportCommentLengthForVal, setReportCommentLengthForVal] =
    useState<number>(250);

  // 初回レンダリング判定フラグ
  const renderFlgRef = useRef(false);

  /**
   * 動的に変更するコメントのバリデーションスキーマ
   */
  const validationSchema = {
    reportComment1: yup
      .string()
      .label('コメント１行目')
      .max(reportCommentLengthForVal),
    reportComment2: yup
      .string()
      .label('コメント２行目')
      .max(reportCommentLengthForVal),
    reportComment3: yup
      .string()
      .label('コメント３行目')
      .max(reportCommentLengthForVal),
    reportComment4: yup
      .string()
      .label('コメント４行目')
      .max(reportCommentLengthForVal),
    reportComment5: yup
      .string()
      .label('コメント５行目')
      .max(reportCommentLengthForVal),
    reportComment6: yup
      .string()
      .label('コメント６行目')
      .max(reportCommentLengthForVal),
    reportComment7: yup
      .string()
      .label('コメント７行目')
      .max(reportCommentLengthForVal),
    reportComment8: yup
      .string()
      .label('コメント８行目')
      .max(reportCommentLengthForVal),
    reportComment9: yup
      .string()
      .label('コメント９行目')
      .max(reportCommentLengthForVal),
    reportComment10: yup
      .string()
      .label('コメント１０行目')
      .max(reportCommentLengthForVal),
  };

  // form
  const methods = useForm<reportModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchema)),
  });

  // プルダウンの値
  const { getValues, watch, reset } = methods;

  // 帳票出力ポップアップ表示時の処理
  useEffect(() => {
    const initialize = async () => {
      // API-COM-0011-0001：帳票一覧情報取得API
      const request: ScrCom0011GetReportListInfoRequest = {
        /** 画面ID */
        screenId: data.screenId,
      };
      const response = await ScrCom0011GetReportListInfo(request);

      // 格納
      setReportsValue(response);

      // 画面にデータを設定
      setSelectValues({
        // 出力帳票選択
        outputReportInfoSelectValues: convertToChangeReportSelectValueModel(
          response.reportList
        ),
      });
    };

    // 初期表示処理
    initialize();
  }, []);

  // プルダウン選択時の処理
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // textの変更も監視対象のため、setValueでtextを変更した場合を無視しないと無弁ループする
      if (name !== 'outputReporsSelection') return;
      if (value.outputReporsSelection === undefined) return;
      // 選択した値とAPIから取得した値の帳票IDで比較しプルダウンで選択した行数と文字数を設定
      reportsValue?.reportList.map((e) => {
        // プルダウンの選択値とAPIの取得値で一致しているものを使用
        if (String(e.reportId) === value.outputReporsSelection) {
          // 値がともにNull | 0以外の場合は不備案内書として扱う
          if (
            e.popupComment1lineMaxCharacterCount > 0 &&
            e.popupCommentMaxRow > 0
          ) {
            setReportId(e.reportId);
            setReportName(e.reportName);
            setIsNull(true);
            setCommentRow(e.popupCommentMaxRow);
            setCommentLine(e.popupComment1lineMaxCharacterCount);
            setDefaultValue(e.default);
            // コメントの可変の行数を制御する処理
            setRowCount(e.popupCommentMaxRow);
            // バリデーションの文字数を設定
            setReportCommentLengthForVal(e.popupComment1lineMaxCharacterCount);
          } else {
            setReportId(e.reportId);
            setReportName(e.reportName);
            setDefaultValue(e.default);
            setIsNull(false);
          }
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [selectValues, watch]);

  /**
   *  API-COM-0011-0001：帳票一覧情報取得API レスポンスから 出力帳票選択モデルへの変換
   */
  const convertToChangeReportSelectValueModel = (
    reportInfo: reportList[]
  ): SelectValue[] => {
    return reportInfo.map((x) => {
      return {
        value: String(x.reportId),
        displayValue: x.reportName,
      };
    });
  };

  /**
   * TODO: 将来的にリファクタリング対象
   * 帳票ポップアップ出力ボタン押下時の処理
   */
  const handleConfirm = () => {
    // 動的に取得したコメント行数文のコメントを取得
    const commentRowList: string[] = [];
    if (rowCount >= 10) {
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
    } else if (rowCount === 9) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
      commentRowList.push(getValues('reportComment9'));
    } else if (rowCount === 8) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
      commentRowList.push(getValues('reportComment8'));
    } else if (rowCount === 7) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
      commentRowList.push(getValues('reportComment7'));
    } else if (rowCount === 6) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
      commentRowList.push(getValues('reportComment6'));
    } else if (rowCount === 5) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
      commentRowList.push(getValues('reportComment5'));
    } else if (rowCount === 4) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
      commentRowList.push(getValues('reportComment4'));
    } else if (rowCount === 3) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
      commentRowList.push(getValues('reportComment3'));
    } else if (rowCount === 2) {
      commentRowList.push(getValues('reportComment1'));
      commentRowList.push(getValues('reportComment2'));
    } else if (rowCount === 1) {
      commentRowList.push(getValues('reportComment1'));
    }

    // 改行コードでつなげた帳票コメントをjoinして一つの文字列にする
    const reportComment = commentRowList.join('\n');

    props.handleConfirm(
      // 帳票ID
      reportId,
      // 帳票名
      reportName,
      // 帳票コメント
      reportComment,
      // 初期値
      defaultValue === undefined ? '' : defaultValue
    );

    // 出力後にフォームをリセット
    reset(initialValues);
  };

  /**
   *  コメント動的可変の処理
   */
  const reportCommentLine = () => {
    const commentBox = [];
    for (let i = 1; i <= rowCount; i++) {
      commentBox.push(
        <TextField
          name={`reportComment${i}`}
          key={`reportComment${i}`}
          size='l'
        />
      );
      // 最大10個のコメント列にするように制御
      if (i == 10) {
        break;
      }
    }
    return commentBox;
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Popup open={isOpen}>
              <Popup main>
                <PopSection name='帳票選択'>
                  <Select
                    label='出力帳票選択'
                    name='outputReporsSelection'
                    selectValues={selectValues.outputReportInfoSelectValues}
                    blankOption
                    required
                  />
                  <br />
                  {
                    // プルダウンにて不備案内書が選択された場合にのみ表示
                    isNull ? (
                      <RowStack>
                        <ColStack>
                          <Box>
                            <Typography variant='body1'>最大桁数</Typography>
                            <Typography variant='body1'>
                              {commentRow}
                            </Typography>
                          </Box>
                        </ColStack>
                        <ColStack>
                          <Box>
                            <Typography variant='body1'>
                              1行最大文字数
                            </Typography>
                            <Typography variant='body1'>
                              {commentLine}
                            </Typography>
                          </Box>
                        </ColStack>
                      </RowStack>
                    ) : (
                      ''
                    )
                  }
                  <br />
                  {
                    // プルダウンにて不備案内書が選択された場合にのみ表示
                    isNull ? (
                      <>
                        <Typography variant='body1'>コメント</Typography>
                        {/* コメント行数をAPIから取得した最大行数分可変させる */}
                        {reportCommentLine()}
                      </>
                    ) : (
                      ''
                    )
                  }
                </PopSection>
              </Popup>
              <Popup bottom>
                <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
                <ConfirmButton onClick={handleConfirm}>出力</ConfirmButton>
              </Popup>
            </Popup>
          </FormProvider>
        </MainLayout>
      </MainLayout>
    </>
  );
};
export default ScrCom0011Popup;
