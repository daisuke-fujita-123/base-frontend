import React from 'react';

import { Box } from 'layouts/Box';
import { Popup } from 'layouts/Popup';

// Controls
import { Table, TableColDef, TableRowModel } from 'controls/Table';
import { Typography } from 'controls/Typography';

/**
 * 登録内容確認ポップアップデータモデル
 */
export interface ScrCom0032PopupModel {
    changedSections: TableRowModel[];
    errorMessages: string[];
    warningMessages: string[];
}

/**
 * 登録内容確認ポップアップのProps
 */
interface ScrMem0003PopupProps {
    isOpen: boolean;
    data: ScrCom0032PopupModel;
    handleCancel: () => void;
    handleConfirm: () => void;
}

/**
 * 登録内容確認ポップアップ
 * @returns
 */
const ScrCom00032Popup = (props: ScrMem0003PopupProps) => {
    const { isOpen, handleCancel, handleConfirm, data } = props;

    const buttons = [
        { name: '確定', onClick: handleConfirm },
        { name: 'キャンセル', onClick: handleCancel },
    ];

    const columns: TableColDef[] = [
        { headerName: '変更種類', width: 50 },
        { headerName: 'セクション名', width: 50 },
    ];

    return (
        <>
            <Popup open={isOpen} titles={['登録・変更内容']} buttons={buttons}>
                <Box>
                    <Typography variant='h4'>エラー内容</Typography>
                    {data.errorMessages.map((value: any, index: any) => {
                        return (
                            <Typography key={index} variant='h6'>
                                エラーメッセージ{index + 1}：{value}
                            </Typography>
                        );
                    })}
                </Box>
                <Box>
                    <Typography variant='h4'>ワーニング内容</Typography>
                    {data.warningMessages.map((value: any, index: any) => {
                        return (
                            <Typography key={index} variant='h6'>
                                ワーニングメッセージ{index + 1}：{value}
                            </Typography>
                        );
                    })}
                </Box>
                <Box>
                    <Typography variant='h4'>登録・変更内容</Typography>
                    <Table columns={columns} rows={data.changedSections} />
                </Box>
            </Popup>
        </>
    );
};

export default ScrCom00032Popup;