import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

// layouts
import { Box } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Popup } from 'layouts/Popup';
import { PopSection, Section } from 'layouts/Section';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { TableRowModel } from 'controls/Table';
// Controls
import { Textarea } from 'controls/Textarea';
import { Typography } from 'controls/Typography';

import {
  ScrCom0032GetApproval,
  ScrCom0032GetApprovalRequest,
} from 'apis/com/ScrCom0032Api';

import { useGridApiRef } from '@mui/x-data-grid-pro';

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
  changeExpectDate: string | null;
}

/**
 * 登録内容確認ポップアップデータモデル(エラー)
 */
export interface errorList {
  errorCode: string;
  errorMessage: string;
}

/**
 * 登録内容確認ポップアップデータモデル(ワーニング)
 */
export interface warningList {
  warningCode: string;
  warningMessage: string;
}

/**
 * 登録内容確認ポップアップデータモデル(登録・変更内容リスト)
 */
export interface registrationChangeList {
  // 画面ID
  screenId: string;
  // 画面名
  screenName: string;
  // タブID
  tabId: number;
  // タブ名
  tabName: string;
  // セクションリスト
  sectionList: sectionList[];
}

/**
 * 登録内容確認ポップアップデータモデル(セクションリスト)
 */
export interface sectionList {
  // セクション名
  sectionName: string;
  // 項目名リスト
  columnList: columnList[];
}

/**
 * 登録内容確認ポップアップデータモデル(項目名リスト)
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
 * 登録内容確認ポップアップデータモデル(useForm)
 */
interface formModel {
  // ワーニング内容 チェックボックス
  checkbox: boolean;
  // 登録変更メモ
  registrationChangeMemo: string;
}

/**
 * 登録内容確認ポップアップ Props
 */
interface ScrCom0032PopupProps {
  isOpen: boolean;
  data: ScrCom0032PopupModel;
  // キャンセルボタン押下時に渡すパラメータ（なし）
  handleCancel: () => void;
  // 確定ボタン押下時に渡すパラメータ（なし）
  handleRegistConfirm: (registrationChangeMemo: string) => void;
  // 承認申請ボタン押下時に呼び出し元へ渡すパラメータ（登録内容メモ）
  handleApprovalConfirm: (registrationChangeMemo: string) => void;
}

/**
 * バリデーションスキーマ
 */
const validationSchema = {
  registrationChangeMemo: yup.string().label('登録変更メモ').max(250),
};

/**
 * 登録内容確認ポップアップ
 */
const ScrCom0032Popup = (props: ScrCom0032PopupProps) => {
  // props
  const { isOpen, handleCancel, data } = props;

  // column
  const columns: GridColDef[] = [
    {
      field: 'screenName',
      headerName: '画面名',
      size: 'l',
    },
    {
      field: 'tabName',
      headerName: 'タブ名',
      size: 'l',
    },
    {
      field: 'sectionName',
      headerName: 'セクション名',
      size: 'l',
    },
    {
      field: 'columnName',
      headerName: '項目名',
      size: 'l',
    },
  ];

  // state
  // 承認要否フラグ(確定ボタンの活性・非活性を判定)
  const [approvalFlag, setApprovalFlag] = useState(false);
  // 登録・変更内容確認のテーブルモデル リスト
  const [rowValuesList, setRowValuesList] = useState<TableRowModel[]>([]);
  // 判定用 ワーニングチェックボックスを全てチェックしたかどうかを管理するフラグ
  const [isWarningChecked, setIsWarningChecked] = useState<boolean>();
  // 判定用 セクション名が存在する => true
  const [isSectionName, setIsSectionName] = useState(false);
  // 判定用 カラム名が存在する => true
  const [isColumnName, setIsColumnName] = useState(false);
  // 判定用 画面名・タブ名・セクション名・項目名の内いずれかが存在する => true
  const [isExistColumns, setisExistColumns] = useState<boolean>();

  // セクションサイズ
  const [maxSectionWidth, setMaxSectionWidth] = useState<number>(0);

  const apiRef = useGridApiRef();

  // form
  const methods = useForm<formModel>({
    defaultValues: {
      registrationChangeMemo: '',
      checkbox: false,
    },
    resolver: yupResolver(yup.object(validationSchema)),
    context: false,
  });

  const { getValues, setValue, watch, reset } = methods;

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
  };

  /**
   * 登録内容確認ポップアップモデルをテーブル表示用データに変換
   */
  const convertToSearchResultRowModel = (
    initialValues: ScrCom0032PopupModel
  ): TableRowModel[] => {
    // 変換用のセクション名と項目名のリスト
    const rowSectionNameList: string[] = [];
    const rowColumnNameList: string[] = [];

    // セクション名と項目名のみ取得する階層が違うので、一時リスト変数に設定する
    for (let i = 0; i < data.registrationChangeList.length; i++) {
      for (
        let j = 0;
        j < data.registrationChangeList[i].sectionList.length;
        j++
      ) {
        for (
          let k = 0;
          k < data.registrationChangeList[i].sectionList[j].columnList.length;
          k++
        ) {
          rowSectionNameList.push(
            data.registrationChangeList[i].sectionList[j].sectionName
          );
          rowColumnNameList.push(
            data.registrationChangeList[i].sectionList[j].columnList[k]
              .columnName
          );
        }
      }
    }

    // 判定用のリストに格納
    if (rowSectionNameList.length === 0) {
      setIsSectionName(false);
    } else {
      setIsSectionName(true);
    }

    if (rowColumnNameList.length === 0) {
      setIsColumnName(false);
    } else {
      setIsColumnName(true);
    }

    // 変換後のRowを格納する一時リスト
    const tempList: TableRowModel[] = rowColumnNameList.map((x, i) => {
      return {
        id: i,
        screenName: initialValues.registrationChangeList[0].screenName,
        tabName: initialValues.registrationChangeList[0].tabName,
        sectionName: rowSectionNameList[i],
        columnName: rowColumnNameList[i],
      };
    });

    return tempList;
  };

  // セクション幅調整
  useEffect(() => {
    setMaxSectionWidth(
      Number(
        apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
      ) + 40
    );
  }, [apiRef, apiRef.current.rootElementRef]);

  // 登録内容確認ポップアップ表示時の処理
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

      // 登録・変更内容テーブル表示用のモデルに変換し、セクション名カラム名が存在するか判定
      const convertList = convertToSearchResultRowModel(initialValues);
      setRowValuesList(convertList);

      // 画面名、タブ名、セクション名、項目名のいずれも設定されていないかどうかを判定する処理
      if (
        data.registrationChangeList[0].screenName === '' &&
        data.registrationChangeList[0].tabName === '' &&
        isSectionName === false &&
        isColumnName === false
      ) {
        setisExistColumns(false);
      } else {
        setisExistColumns(true);
      }

      // ワーニングのチェックボックスの初期化
      if (data.warningList.length === 0) {
        setIsWarningChecked(true);
      } else {
        setIsWarningChecked(false);
      }
    };

    initialize();
  }, []);

  // ワーニングチェックボックス処理
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // 全てのチェックボックスの数を取得
      const checkboxCount = document.querySelectorAll(
        "input[name^='checkbox']"
      ).length;

      // 全てのチェックボックスのチェックされている値のみを取得
      const checkboxList = document.querySelectorAll(
        "input[name^='checkbox']:checked"
      );

      // チェックされている数が全てのチェックボックスの数と一致したらボタンを活性化
      if (checkboxList.length === checkboxCount) {
        // 確定ボタンの活性化
        setIsWarningChecked(true);
      } else {
        // 確定ボタンの非活性化
        setIsWarningChecked(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  // 登録内容確認ポップアップ承認申請ボタン押下時の処理
  const handleApprovalConfirm = () => {
    props.handleApprovalConfirm(
      // 登録変更メモ
      getValues('registrationChangeMemo')
    );
  };

  // 登録内容確認ポップアップ確定ボタン押下時の処理
  const handleRegistConfirm = () => {
    props.handleRegistConfirm(
      // 登録変更メモ
      getValues('registrationChangeMemo')
    );
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Popup open={isOpen}>
              <Popup main>
                {/* エラー発生無の場合は非表示 */}
                {data.errorList.length > 0 ? (
                  <PopSection name='エラー内容' isError>
                    {data.errorList.map(
                      (errorList: errorList, errorIndex: number) => {
                        return (
                          <Typography
                            key={
                              errorList.errorMessage + String(errorIndex + 1)
                            }
                            variant='h6'
                          >
                            {'エラーメッセージ' +
                              Number(errorIndex + 1) +
                              ':' +
                              errorList.errorMessage}
                          </Typography>
                        );
                      }
                    )}
                  </PopSection>
                ) : (
                  <br />
                )}

                {/* ワーニング発生無の場合は非表示 */}
                {data.warningList.length > 0 ? (
                  <PopSection name='ワーニング内容' isWarning>
                    {data.warningList.map(
                      (warningList: warningList, warningIndex: number) => {
                        return (
                          <>
                            {/* エラー発生有の場合は非活性 */}
                            <Checkbox
                              key={
                                warningList.warningMessage +
                                String(warningIndex)
                              }
                              name={'checkbox' + warningIndex + 1}
                              label={
                                'ワーニングメッセージ' +
                                Number(warningIndex + 1) +
                                ':' +
                                warningList.warningMessage
                              }
                              disabled={
                                data.errorList.length > 0 ? true : false
                              }
                            />
                          </>
                        );
                      }
                    )}
                  </PopSection>
                ) : (
                  <br />
                )}
                {data.registrationChangeList.length > 0 ? (
                  <Section name='登録・変更内容' width={maxSectionWidth}>
                    {/* 画面名、タブ名、セクション名、項目名のいずれも設定されていない場合は非表示 */}
                    {isExistColumns ? (
                      <>
                        <DataGrid
                          columns={columns}
                          rows={rowValuesList}
                          apiRef={apiRef}
                        />
                        <br />
                      </>
                    ) : (
                      <>
                        <Typography key={'index'} variant='h6'>
                          {'項目がありません。'}
                        </Typography>
                        <br />
                      </>
                    )}
                    {/* 項目名がなく変更予約有の場合は表示・無の場合は非表示 */}
                    {isExistColumns && data.changeExpectDate !== '' ? (
                      <Box>
                        <Typography variant='h6'>変更予定日</Typography>
                        <Typography variant='body1'>
                          {data.changeExpectDate}
                        </Typography>
                        <br />
                      </Box>
                    ) : (
                      <br />
                    )}
                    {/* "画面名、タブ名、セクション名、項目名のいずれも設定されていない場合は非表示 */}
                    {isExistColumns ? (
                      <Box>
                        <Typography variant='h5'>登録変更メモ</Typography>
                        <Textarea
                          name='registrationChangeMemo'
                          maxRows={30}
                          size='l'
                          // エラー発生有の場合は非活性・エラー発生無の場合は活性
                          disabled={data.errorList.length > 0 ? true : false}
                        ></Textarea>
                      </Box>
                    ) : (
                      ''
                    )}
                  </Section>
                ) : (
                  ''
                )}
              </Popup>
              <Popup bottom>
                <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
                {/* 承認要否で確定ボタンのラベルを変更する。 承認要*/}
                {approvalFlag ? (
                  <ConfirmButton
                    onClick={handleRegistConfirm}
                    // 条件１：エラーが1件以上存在する場合 -> 非活性
                    // 条件２：ワーニングが0件の場合 -> 活性
                    // 条件３：ワーニングが1件以上存在し、全てのチェックボックスを選択済みの場合 -> 活性
                    // 条件４: 画面名、タブ名、セクション名、項目名のいずれも未設定の場合 -> 非活性
                    disable={
                      data.errorList.length >= 1 ||
                      !isExistColumns ||
                      !isWarningChecked
                        ? true
                        : false
                    }
                  >
                    確定
                  </ConfirmButton>
                ) : (
                  // 承認要否で確定ボタンのラベルを変更する。 承認不要
                  <ConfirmButton
                    onClick={handleApprovalConfirm}
                    // 条件１：エラーが1件以上存在する場合 -> 非活性
                    // 条件２：ワーニングが0件の場合 -> 活性
                    // 条件３：ワーニングが1件以上存在し、全てのチェックボックスを選択済みの場合 -> 活性
                    // 条件４: 画面名、タブ名、セクション名、項目名のいずれも未設定の場合 -> 非活性
                    disable={
                      data.errorList.length >= 1 ||
                      !isExistColumns ||
                      !isWarningChecked
                        ? true
                        : false
                    }
                  >
                    承認申請
                  </ConfirmButton>
                )}
              </Popup>
            </Popup>
          </FormProvider>
        </MainLayout>
      </MainLayout>
    </>
  );
};

export default ScrCom0032Popup;
