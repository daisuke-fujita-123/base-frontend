import React, { useEffect, useRef, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from 'layouts/Box';
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';
import { ColStack, ControlsStackItem, RowStack } from 'layouts/Stack';

import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import {
  reportList, ScrCom0011GetReportListInfo, ScrCom0011GetReportListInfoRequest,
  ScrCom0011GetReportListInfoResponse
} from 'apis/com/ScrCom0011';

import { useForm } from 'hooks/useForm';

import { generate } from 'utils/Base.Yup';

/**
 * 帳票選択ポップアップデータモデル
 */
export interface ScrCom0011PopupModel {
  screenId: string;
}


/**
* 帳票選択ポップアップのProps
*/
interface ScrCom0011PopupProps {
  isOpen: boolean;
  data: ScrCom0011PopupModel;
  handleCancel: () => void;
  handleConfirm: () => returnValue;
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


/**
 * 呼び出し元画面への返却値
 */
interface returnValue {
  // 出力帳票選択
  reportId: string,
  reportName: string,
  reportComment: string,
  default: string,
};


/**
 * バリデーションスキーマ
 */
const validationSchama = generate([
  // TODO: 動的にバリデーションを変更する（文字数）
  'registrationChangeMemo',
])


/**
 * 帳票出力ポップアップ
 */
const ScrCom0011Popup = (props: ScrCom0011PopupProps) => {
  // props
  const { isOpen, handleCancel, handleConfirm, data } = props;

  const buttons = [
    { name: 'キャンセル', onClick: handleCancel, },
    { name: '出力', onClick: handleConfirm },
  ];

  // state
  const [reportsValue, setReportsValue] = useState<ScrCom0011GetReportListInfoResponse>();
  const [commentRow, setCommentRow] = useState<string>();
  const [commentLine, setCommentLine] = useState<string>();
  // 出力帳票リスト
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 可変させるコメントの行数のリスト
  const [rowCountList, setRowCountList] = useState<number[]>([]);
  // trueの場合  => "最大行数"と"1行最大文字数"が共にNull
  const [isNull, setIsNull] = useState<boolean>(false);

  // form
  const methods = useForm({
    defaultValues: {
      // TODO: 動的にバリデーションを変更する（文字数）
      reportComment1: '',
      outputReporsSelection: '',
    }, resolver: yupResolver(validationSchama),
  });

  // プルダウンの値
  const { watch } = methods;


  // 呼び出し元画面遷移時か登録確認ポップアップ起動時か判定するフラグ
  const isFirstRender = useRef(false)


  // 呼び出し元画面遷移時の処理
  useEffect(() => {
    isFirstRender.current = true
  }, [])


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
        outputReportInfoSelectValues: convertToChangeReportSelectValueModel(response.reportList)
      });
    }

    // ポップアップ起動時にのみ処理を実行する
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      initialize();
    }
  }, [isOpen])


  // プルダウン選択時の処理
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // textの変更も監視対象のため、setValueでtextを変更した場合を無視しないと無弁ループする
      if (name !== 'outputReporsSelection') return;
      if (value.outputReporsSelection === undefined) return;
      // 選択した値とAPIから取得した値の帳票IDで比較しプルダウンで選択した行数と文字数を設定
      reportsValue?.reportList.map((e) => {
        if (e.reportId === value.outputReporsSelection) {
          // 値がともにNullの場合は不備案内書として扱う
          if (e.popupComment1lineMaxCharacterCount === null && e.popupCommentMaxRow === null) {
            setIsNull(true);
          } else {
            setIsNull(false);
            setCommentRow(e.popupCommentMaxRow);
            setCommentLine(e.popupComment1lineMaxCharacterCount);
            // コメントの可変の行数を制御する処理
            const tempList = [];
            for (let i = 0; i < Number(e.popupCommentMaxRow); i++) {
              tempList.push(i);
            }
            setRowCountList(tempList);
          }
        }
      })
    });
    return () => subscription.unsubscribe();
  }, [selectValues, watch])


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


  return (
    <>
      <Popup open={isOpen} buttons={buttons}>
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
            isNull ?
              <RowStack>
                <ColStack>
                  <Box>
                    <Typography variant='h5'>最大桁数</Typography>
                    {commentRow}
                  </Box>
                </ColStack>
                <ColStack>
                  <Box>
                    <Typography variant='h5'>1行最大文字数</Typography>
                    {commentLine}
                  </Box>
                </ColStack>
              </RowStack>
              : ""}
          <br />
          {
            // プルダウンにて不備案内書が選択された場合にのみ表示
            isNull ?
              <>
                <Typography variant='h6'>コメント</Typography>
                <ControlsStackItem size='m'>
                  {/* コメント行数を可変させる */}
                  {rowCountList.map((i) => {
                    return (
                      <TextField key={i} name={'reportComment' + i} />
                    );
                  })}
                </ControlsStackItem>
              </>
              : ""}
        </PopSection>
      </Popup>
    </>
  );
}
export default ScrCom0011Popup;
