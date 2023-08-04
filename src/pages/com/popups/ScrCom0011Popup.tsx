import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { Box } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';
import { ColStack, ControlsStackItem, RowStack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  reportList,
  ScrCom0011GetReportListInfo,
  ScrCom0011GetReportListInfoRequest,
  ScrCom0011GetReportListInfoResponse,
} from 'apis/com/ScrCom0011';

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
    // 帳票ID 帳票名
    selectValues: SelectValuesModel,
    // TODO: 帳票コメント行数可変を戻り値にしたい
    comment: string,
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
  // TODO:コメント(動的)
  reportComment1: '';
  // 出力帳票
  outputReporsSelection: '';
}

/*
 * useForm データモデル 初期値
 */
const initialValues: reportModel = {
  // TODO:コメント(動的)
  reportComment1: '',
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
  const [commentRow, setCommentRow] = useState<string>('');
  const [commentLine, setCommentLine] = useState<string>('');
  // 出力帳票リスト
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 初期値
  const [defaultValue, setDefaultValue] = useState<string>('');
  // 可変させるコメントの行数
  const [rowCount, setRowCount] = useState<string>('');
  // trueの場合  => "最大行数"と"1行最大文字数"が共にNull
  const [isNull, setIsNull] = useState<boolean>();

  const validationSchema = {
    // TODO: 行数も文字数も動的にバリデーションをかける
    // => 行数の可変の制御方法不明
    // reportComment: yup.string().label('コメント').max(250).fullAndHalfWidth(),
  };

  // form
  const methods = useForm<reportModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(validationSchema)),
  });

  // プルダウンの値
  const { watch } = methods;

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
        if (e.reportId === value.outputReporsSelection) {
          // 値がともにNull | ''の場合は不備案内書として扱う
          if (
            (e.popupComment1lineMaxCharacterCount === null ||
              e.popupComment1lineMaxCharacterCount === '') &&
            (e.popupCommentMaxRow === null || e.popupCommentMaxRow === '')
          ) {
            setIsNull(true);
          } else {
            setIsNull(false);
            setCommentRow(e.popupCommentMaxRow);
            setCommentLine(e.popupComment1lineMaxCharacterCount);
            setDefaultValue(e.default);
            // コメントの可変の行数を制御する処理
            setRowCount(e.popupCommentMaxRow);

            // TODO:バリデーションを動的にする為 validationSchemaに追加
            // validationSchema[`reportComment${2}`] = '';
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

  // 帳票ポップアップ出力ボタン押下時の処理
  const handleConfirm = () => {
    props.handleConfirm(
      // 帳票ID 帳票名
      selectValues,
      // TODO: 帳票コメント行数可変を戻り値にしたい
      '',
      // 初期値
      defaultValue
    );
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
                        <ControlsStackItem size='m'>
                          {/* コメント行数をAPIから取得した最大行数分可変させる */}
                          {Array(rowCount)
                            .fill('test')
                            .map((val, i) => {
                              return (
                                <TextField
                                  key={val + i}
                                  name={'reportComment' + i}
                                />
                              );
                            })}
                        </ControlsStackItem>
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
