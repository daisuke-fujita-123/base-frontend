import React, { useEffect, useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// layouts
import { Box } from 'layouts/Box';
import { Popup } from 'layouts/Popup';
import { Section } from 'layouts/Section';
import { MainLayout } from 'layouts/MainLayout';

// Controls
import { Textarea } from 'controls/Textarea';
import { Table, TableColDef, TableRowModel } from 'controls/Table';
import { Typography } from 'controls/Typography';
import { Checkbox } from 'controls/Checkbox';

import { ScrCom0032GetApproval, ScrCom0032GetApprovalRequest } from 'apis/com/SrcCom0032Api';
import { generate } from 'utils/BaseYup';


/**
 * 登録内容確認ポップアップデータモデル
 */
export interface ScrCom0032PopupModel {
  // エラー内容リスト
  errorList: errorList[];
  // ワーニング内容リスト
  warningList: warningList[];
  // 登録・変更内容リスト
  registrationChangeList: registrationChangeList[];
  // 変更予定日
  changeExpectDate: string;
}

/**
 * エラー内容リスト
 */
export interface errorList {
  errorCode: string;
  errorMessages: string[];
}

/**
 * ワーニング内容リスト
 */
export interface warningList {
  warningCode: string;
  warningMessages: string[];
}

/**
 * 登録・変更内容リスト
 */
export interface registrationChangeList {
  // 画面ID
  screenId: string;
  // 画面名
  screenName: string;
  // タブID
  tabId: string;
  // タブ名
  tabName: string;
  // セクションリスト
  sectionList: sectionList[];
}

/**
 * セクションリスト
 */
export interface sectionList {
  // セクション名
  sectionName: string;
  // 項目名リスト
  columnList: columnList[];
}

/**
 * 項目名リスト
 */
export interface columnList {
  // 項目名
  columnName: string;
}

/**
 * テーブル表示用リスト
 */
export interface rowList {
  // 画面名
  screenName: string;
  // タブ名
  tabName: string;
  // セクション名
  sectionName: string[];
  // 項目名
  columnName: string[];
}


/**
* 登録内容確認ポップアップのProps
*/
interface ScrCom0032PopupProps {
  isOpen: boolean;
  data: ScrCom0032PopupModel;
  handleCancel: () => void;
  handleConfirm: () => void;
}


/**
 * バリデーションスキーマ
 */
const validationSchama = generate([
  'registrationChangeMemo',
])


/**
 * 登録内容確認ポップアップ
 */
const ScrCom00032Popup = (props: ScrCom0032PopupProps) => {
  // props
  const { isOpen, handleCancel, handleConfirm, data } = props;

  // button
  const registButtons = [
    { name: 'キャンセル', onClick: handleCancel, },
    { name: '確定', onClick: handleConfirm },
  ];
  const approvalButtons = [
    { name: 'キャンセル', onClick: handleCancel },
    { name: '承認申請', onClick: handleConfirm },
  ];

  // column
  const columns: TableColDef[] = [
    { headerName: '画面名', width: 50 },
    { headerName: 'タブ名', width: 50 },
    { headerName: 'セクション名', width: 50 },
    { headerName: '項目名', width: 50 },
  ];

  // state
  // 承認要否フラグ(確定ボタンの活性・非活性を判定)
  const [approvalFlag, setApprovalFlag] = useState(false);
  // 項目名のパラメータが渡されたかどうかを判定するフラグ
  const [hasColumnNameParamFlag, setHasColumnNameParamFlag] = useState(true);
  // 登録・変更内容確認のテーブルモデル リスト
  const [rowValuesList, setRowValuesList] = useState<TableRowModel[]>();

  // form
  const methods = useForm({
    defaultValues: {
      checkbox: false,
    },
    resolver: yupResolver(validationSchama),
    context: false
  });

  const { setValue, watch } = methods;

  // 呼び出し元画面遷移時か登録確認ポップアップ起動時か判定するフラグ
  const isFirstRender = useRef(false)


  /**
   * 登録内容確認ポップアップ 初期データ(呼び出し元画面から受け取ったパラメータを設定)
   */
  const initialValues: ScrCom0032PopupModel = {
    // エラー内容リスト
    errorList: data.errorList,
    // ワーニング内容リスト
    warningList: data.warningList,
    // 登録・変更内容リスト
    registrationChangeList: data.registrationChangeList,
    // 変更予定日
    changeExpectDate: data.changeExpectDate,
  }


  /**
  * TODO: ポップアップモデルをテーブル表示用データに変換
  */
  const convertToSearchResultRowModel = (
    initialValues: ScrCom0032PopupModel
  ): void => {

    // 変換用のセクション名と項目名のリスト
    const rowSectionNameList: string[] = [];
    const rowColumnNameList: string[] = [];

    for (let i = 0; i < data.registrationChangeList.length; i++) {
      for (let j = 0; j < data.registrationChangeList[i].sectionList.length; j++) {
        for (let k = 0; k < data.registrationChangeList[i].sectionList[j].columnList.length; k++) {
          rowSectionNameList.push(data.registrationChangeList[i].sectionList[j].sectionName);
          rowColumnNameList.push(data.registrationChangeList[i].sectionList[j].columnList[k].columnName);
        }
      }
    }

    const tempList: TableRowModel[] = [];
    for (let i = 0; i < rowColumnNameList.length; i++) {
      tempList.push({
        screenName: initialValues.registrationChangeList[0].screenName,
        tabName: initialValues.registrationChangeList[0].tabName,
        sectionName: rowSectionNameList[i],
        columnName: rowColumnNameList[i],
      })
    }
    console.log(tempList);
    setRowValuesList(tempList);
  };


  // 呼び出し元画面遷移時の処理
  useEffect(() => {
    isFirstRender.current = true
  }, [])


  // 登録確認ポップアップ表示時の処理
  useEffect(() => {
    const initialize = async () => {
      // SCR-COM-0032-0001：承認要否取得API
      const approvalRequest: ScrCom0032GetApprovalRequest = {
        /** 画面ID */
        screenId: data.registrationChangeList[0].screenId,
        /** タブID */
        tabId: data.registrationChangeList[0].tabId,
      };
      const approvalResponse = await ScrCom0032GetApproval(approvalRequest);
      // ボタンのラベルを判定するフラグ設定
      setApprovalFlag(approvalResponse.approval);
    }

    // ポップアップ起動時にのみ処理を実行する
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      initialize();

      // 登録・変更内容テーブル表示用のモデルに変換する
      convertToSearchResultRowModel(initialValues);

      // 項目名が呼び出し画面から一つもない場合エラーメッセージを出力するフラグを設定
      for (let i = 0; i < data.registrationChangeList.length; i++) {
        for (let j = 0; j < data.registrationChangeList[i].sectionList.length; j++) {
          for (let k = 0; k < data.registrationChangeList[i].sectionList[j].columnList.length; k++) {
            if (data.registrationChangeList[i].sectionList[j].columnList.length === 0) {
              setHasColumnNameParamFlag(false);
              break;
            }
          }
        }
      }
    }
  }, [isOpen])

  // チェックボックス処理
  useEffect(() => {
    // ポップアップ起動時にのみ処理を実行する
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      const subscription = watch((value, { name, type }) => {
        console.log(value.checkbox);
        // textの変更も監視対象のため、setValueでtextを変更した場合を無視しないと無弁ループする
        if (name !== 'checkbox') return;
        // TODO: 全てのワーニングのチェックボックス選択したら確定ボタンが活性化
        if (value.checkbox === undefined) return;
        setApprovalFlag(value.checkbox);
      });
      return () => subscription.unsubscribe();
    }
  }, [setValue, watch]);


  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 確定ボタンはエラー・ワーニング発生有の場合は非活性・エラー・ワーニング発生無の場合は活性 */}
            <Popup
              open={isOpen}
              titles={[]}
              buttons={approvalFlag ? approvalButtons : registButtons}>
              {/* エラー発生無の場合は非表示 */}
              {
                data.errorList.length > 0 ?
                  // 項目名が一つも渡されていない場合は表示内容を変更する
                  hasColumnNameParamFlag ?
                    <Section name='エラー'>
                      {data.errorList.map((value: any, index: any) => {
                        return (
                          <Typography key={index} variant='h6'>
                            エラーメッセージ{index + 1}：{value.errorMessages}
                          </Typography>
                        );
                      })}
                    </Section>
                    :
                    <Section name='エラー'>
                      <Typography key={'index1'} variant='h6'>
                        エラーメッセージ{1}：{'項目がありません。'}
                      </Typography>
                    </Section>
                  : <br />
              }
              {/* ワーニング発生無の場合かパラメータの内 項目名が一つもない場合は非表示 */}
              {
                data.warningList.length > 0 ?
                  hasColumnNameParamFlag ?
                    <Section name='ワーニング'>
                      {data.warningList.map((value: any, index: any) => {
                        return (
                          <>
                            {/* TODO： エラー発生有の場合は非活性 */}
                            <Checkbox
                              name='checkbox'
                              label={'ワーニングメッセージ' + index + 1 + ":" + value.warningMessages}
                              key={index}
                            />
                          </>
                        );
                      })}
                    </Section>
                    :
                    ""
                  : <br />
              }
              <Section name='登録・変更内容'>
                {rowValuesList !== undefined ?
                  <>
                    <Box>
                      <Table columns={columns} rows={rowValuesList} />
                    </Box><br />
                  </>
                  : ""}
                {/* 変更予約有の場合は表示・無の場合は非表示 */}
                {data.changeExpectDate !== '' ?
                  <Box>
                    <Typography variant='h5'>変更予定日</Typography>
                    <Typography variant='h6'>{data.changeExpectDate}</Typography><br />
                  </Box>
                  : <br />
                }
                {/* エラー発生有の場合は非活性・エラー発生無の場合は活性 */}
                <Box>
                  <Typography variant='h5'>登録変更メモ</Typography>
                  <Textarea
                    name='registrationChangeMemo'
                    minRows={10}
                    maxRows={30}
                    size='l'
                    disabled={data.errorList.length > 0 ? true : false}
                  ></Textarea>
                </Box>
              </Section>
            </Popup >
          </FormProvider>
        </MainLayout >
      </MainLayout >
    </>
  );
};

export default ScrCom00032Popup;