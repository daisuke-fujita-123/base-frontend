import React, { useEffect, useState } from 'react';

import { Box } from 'layouts/Box';
import { Popup } from 'layouts/Popup';
import { StyledTextArea } from 'controls/Textarea';
import { Textarea } from 'controls/Textarea';


// Controls
import { Table, TableColDef, TableRowModel } from 'controls/Table';
import { Typography } from 'controls/Typography';
import { MainLayout } from 'layouts/MainLayout';
import { CancelButton, ConfirmButton } from 'controls/Button';
import { Stack } from 'layouts/Stack';
import { width } from '@mui/system';
import { Checkbox } from 'controls/Checkbox';
import { ScrCom0032GetApproval, ScrCom0032GetApprovalRequest } from 'apis/com/SrcCom0032Api';
import { FormProvider, useForm } from 'react-hook-form';
import { Section } from 'layouts/Section';

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
    // 確定ボタンの活性・非活性 判定するフラグ
    const [approvalFlag, setApprovalFlag] = useState(false);
    // 項目名のパラメータが渡されたかどうかを判定するフラグ
    const [hasColumnNameParamFlag, setHasColumnNameParamFlag] = useState(true);
    // 登録・変更内容確認のテーブルモデル リスト
    const [rowValuesList, setRowValuesList] = useState([]);


    // form
    const methods = useForm({
        defaultValues: {
            checkbox: false,
            text: '',
        },
        context: false
    });

    const { setValue, watch } = methods;


    /**
    * TODO: ポップアップモデルをテーブル表示用データに変換
    */
    const convertToSearchResultRowModel = (
        response: ScrCom0032PopupModel
    ): rowList[] => {

        //　変換用のセクション名と項目名のリスト
        const rowSectionNameList: string[] = [];
        const rowColumnNameList: string[] = [];

        return response.registrationChangeList.map((x) => {
            return {
                screenName: x.screenName,
                tabName: x.tabName,
                sectionName: rowSectionNameList,
                columnName: rowColumnNameList,
            };
        });
        // setRowValuesList();
    };


    // 初期表示時の処理
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
        initialize();

        // 項目名が呼び出し画面から一つもない場合エラーメッセージを出力するフラグを設定
        for (let i = 0; i < data.registrationChangeList.length; i++) {
            console.log(data.registrationChangeList[i].sectionList);
            for (let j = 0; j < data.registrationChangeList[i].sectionList.length; j++) {
                for (let k = 0; k < data.registrationChangeList[i].sectionList[j].columnList.length; k++) {
                    if (data.registrationChangeList[i].sectionList[j].columnList[k].columnName === '') {
                        setHasColumnNameParamFlag(false);
                        break;
                    }
                }
            }
        }

    }, [])

    // TODO: チェックボックス処理
    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            // textの変更も監視対象のため、setValueでtextを変更した場合を無視しないと無弁ループする
            if (name !== 'checkbox') return;
            // 全てのワーニングのチェックボックス選択したら確定ボタンが活性化する
            const check = value.checkbox ? 'on' : 'off';
            setValue('text', 'set value by checkbox change: checkbox = ' + check);
            if (value.checkbox === undefined) return;
            setShowButton(value.checkbox);
        });
        return () => subscription.unsubscribe();
    }, [setValue, watch]);


    return (
        <>
            <MainLayout>
                <MainLayout main>
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
                        {/* ワーニング発生無の場合/パラメータの内 項目名が一つもない場合は非表示 */}
                        {
                            data.warningList.length > 0 ?
                                // 項目名が一つも渡されていない場合は非表示
                                hasColumnNameParamFlag ?
                                    <Section name='ワーニング'>
                                        {data.warningList.map((value: any, index: any) => {
                                            return (
                                                <>
                                                    <FormProvider {...methods}>
                                                        <Checkbox
                                                            name='checkbox'
                                                            label={'ワーニングメッセージ' + index + 1 + ":" + value.warningMessages}
                                                        />
                                                    </FormProvider>

                                                </>
                                            );
                                        })}
                                    </Section>
                                    :
                                    ""
                                : <br />
                        }
                        <Section name='登録・変更内容'>
                            <Table columns={columns} rows={rowValuesList} />
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
                                <StyledTextArea
                                    name='registrationChange'
                                    minRows={5}
                                    disabled={data.errorList.length > 0 ? true : false}
                                />
                            </Box>
                        </Section>
                    </Popup >
                </MainLayout >
            </MainLayout >
        </>
    );
};

export default ScrCom00032Popup;