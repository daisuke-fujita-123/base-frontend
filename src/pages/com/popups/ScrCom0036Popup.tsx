import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { Box } from 'layouts/Box';
import { BlankLayout } from 'layouts/InputLayout';
import { Popup } from 'layouts/Popup';
import { Stack } from 'layouts/Stack';
import { StackSection } from 'layouts/StackSection';

import { CancelButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { Typography } from 'controls/Typography';

import { useForm } from 'hooks/useForm';

/**
 * 一括登録エラー確認ポップアップデータモデル
 */
export interface ScrCom0036PopupModel {
  // エラー内容リスト配列
  errors?: {
    columnName: string;
    columnValue: string;
    message: string;
  }[];
  // ワーニング内容リスト配列
  warnings?: {
    columnName: string;
    columnValue: string;
    message: string;
  }[];
}

/** エラー一覧 カラム定義 */
const errorsColumns: GridColDef[] = [
  {
    field: 'no',
    headerName: 'No.',
    size: 'ss',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'columnName',
    headerName: '項目',
    size: 'm',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'columnValue',
    headerName: '値',
    size: 'm',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'message',
    headerName: 'エラー内容',
    size: 'l',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
];

/** ワーニング一覧 カラム定義 */
const warningsColumns: GridColDef[] = [
  {
    field: 'no',
    headerName: 'No.',
    size: 'ss',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'columnName',
    headerName: '項目',
    size: 'm',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'columnValue',
    headerName: '値',
    size: 'm',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'message',
    headerName: 'ワーニング内容',
    size: 'l',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
];

/**
 * 一括登録エラー確認ポップアップのProps
 */
interface ScrCom0036PopupProps {
  isOpen: boolean;
  contents: ScrCom0036PopupModel;
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * SCR-COM-0036 一括登録エラー確認（ポップアップ）
 */
const ScrCom0036Popup = (props: ScrCom0036PopupProps) => {
  // props
  const { isOpen, setIsOpen, contents } = props;

  // DataGrid：エラー一覧
  const [errorsData, setErrorsData] = useState<
    { [key: string]: string | number }[]
  >([]);
  // DataGrid：ワーニング一覧
  const [warningsData, setWarningsData] = useState<
    { [key: string]: string | number }[]
  >([]);

  // form
  const methods = useForm<ScrCom0036PopupModel>({});

  // 一括登録エラー確認ポップアップ表示時の処理
  useEffect(() => {
    const initialize = (contents: ScrCom0036PopupModel) => {
      // エラーリストの設定
      setErrorsData([]);
      if (contents.errors) {
        const errors = contents.errors.map<{
          [key: string]: string | number;
        }>((o, i) => {
          const tmp: { [key: string]: string | number } = {};
          tmp['id'] = i.toString();
          tmp['no'] = i + 1;
          for (const [key, value] of Object.entries(o)) {
            tmp[key] = value;
          }
          return tmp;
        });
        setErrorsData(errors);
      }

      // ワーニングリストの設定
      setWarningsData([]);
      if (contents.warnings) {
        const warnings = contents.warnings.map<{
          [key: string]: string | number;
        }>((o, i) => {
          const tmp: { [key: string]: string | number } = {};
          tmp['id'] = i.toString();
          tmp['no'] = i + 1;
          for (const [key, value] of Object.entries(o)) {
            tmp[key] = value;
          }
          return tmp;
        });
        setWarningsData(warnings);
      }
    };
    initialize(contents);
  }, [contents, isOpen]);

  // イベントハンドル：キャンセル
  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Popup open={isOpen}>
        <Popup main>
          <StackSection titles={[{ name: 'エラー・ワーニング確認' }]}>
            <Box>
              <FormProvider {...methods}>
                {errorsData.length !== 0 ? (
                  <Stack>
                    <Typography color={'#FF0000'}>
                      下記項目が入力エラーとなっています。エラー内容を確認してください。
                    </Typography>
                    <DataGrid columns={errorsColumns} rows={errorsData} />
                  </Stack>
                ) : (
                  <></>
                )}
                {errorsData.length !== 0 && warningsData.length !== 0 ? (
                  <BlankLayout />
                ) : (
                  <></>
                )}
                {warningsData.length !== 0 ? (
                  <Stack>
                    <Typography>
                      下記項目が警告となっています。ワーニング内容を確認してください。
                    </Typography>
                    <DataGrid columns={warningsColumns} rows={warningsData} />
                  </Stack>
                ) : (
                  <></>
                )}
              </FormProvider>
            </Box>
          </StackSection>
        </Popup>
        <Popup bottom>
          <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
        </Popup>
      </Popup>
    </>
  );
};

export default ScrCom0036Popup;
