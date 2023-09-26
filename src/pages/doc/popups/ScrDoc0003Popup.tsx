import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { LeftBox, MarginBox } from 'layouts/Box';
import { Grid } from 'layouts/Grid';
import { InputLayout } from 'layouts/InputLayout';
import { MainLayout } from 'layouts/MainLayout';
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';
import { RowStack, Stack } from 'layouts/Stack';

import { CancelButton, ConfirmButton } from 'controls/Button';
import { Checkbox } from 'controls/Checkbox';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { Dialog } from 'controls/Dialog';
import { CaptionLabel } from 'controls/Label';
import { Radio } from 'controls/Radio';
import { Select, SelectValue } from 'controls/Select';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import {
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetCodeManagementMasterResponse,
} from 'apis/com/ScrCom9999Api';
import {
  ScrDoc0003SlipPrinted,
  ScrDoc0003SlipPrintedCntSearch,
  ScrDoc0003SlipPrintedCntSearchResponse,
  ScrDoc0003SlipPrintedRequest,
} from 'apis/doc/ScrDoc0003Api';

import { useForm } from 'hooks/useForm';

import { MessageContext } from 'providers/MessageProvider';

/**
 *  伝票印刷列定義
 */
const slipPrintedColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'No',
    size: 's',
  },
  {
    field: 'placeName',
    headerName: '会場名',
    size: 'm',
  },
  {
    field: 'auctionCount',
    headerName: '開催回数',
    size: 'm',
  },
  {
    field: 'exhibitNumber',
    headerName: '出品番号',
    size: 'm',
  },
];
/**
 *  伝票印刷データモデル
 */
interface slipPrintedRowModel {
  id: string;
  placeName: string;
  auctionCount: number;
  exhibitNumber: string;
}

/**
 * 検索条件データモデル
 */
interface ScrDoc0003PopupModel {
  isOpen: boolean;
  handleCancel: () => void;
}
/**
 * 配送伝票一括印刷ポップアップ
 */
const ScrDoc0003Popup = (props: ScrDoc0003PopupModel) => {
  // props
  const { isOpen, handleCancel } = props;
  /**
   * バリデーションスキーマ
   */
  const validationSchama = {
    placeKind: yup.string().label('会場種別').required(),
    slipTypeSagawaNomal: yup.lazy((_, schema) => {
      if (
        schema.parent.placeKind === '1' &&
        schema.parent.slipTypeForceChange === '' &&
        !(
          schema.parent.slipTypeSagawaAir ||
          schema.parent.slipTypeYamatoNomal ||
          schema.parent.slipTypeYamatoTime
        )
      ) {
        return yup
          .boolean()
          .default(false)
          .label('伝票種類（佐川-通常）')
          .oneOf([true], getMessage('MSG-FR-ERR-00145'));
      } else if (schema.parent.slipTypeForceChange !== '') {
        return yup
          .boolean()
          .default(false)
          .label('伝票種類（佐川-通常）')
          .oneOf([false], getMessage('MSG-FR-ERR-00146'));
      }
      return yup.boolean().label('伝票種類（佐川-通常）');
    }),
    slipTypeSagawaAir: yup.lazy((_, schema) => {
      if (
        schema.parent.placeKind === '1' &&
        schema.parent.slipTypeForceChange === '' &&
        !(
          schema.parent.slipTypeSagawaNomal ||
          schema.parent.slipTypeYamatoNomal ||
          schema.parent.slipTypeYamatoTime
        )
      ) {
        return yup
          .boolean()
          .default(false)
          .label('伝票種類（佐川-航空）')
          .oneOf([true], getMessage('MSG-FR-ERR-00145'));
      } else if (schema.parent.slipTypeForceChange !== '') {
        return yup
          .boolean()
          .default(false)
          .label('伝票種類（佐川-航空）')
          .oneOf([false], getMessage('MSG-FR-ERR-00146'));
      }
      return yup.boolean().label('伝票種類（佐川-航空）');
    }),
    slipTypeYamatoNomal: yup.lazy((_, schema) => {
      if (
        schema.parent.placeKind === '1' &&
        schema.parent.slipTypeForceChange === '' &&
        !(
          schema.parent.slipTypeSagawaNomal ||
          schema.parent.slipTypeSagawaAir ||
          schema.parent.slipTypeYamatoTime
        )
      ) {
        return yup
          .boolean()
          .default(false)
          .label('伝票種類（ヤマト-通常）')
          .oneOf([true], getMessage('MSG-FR-ERR-00145'));
      } else if (schema.parent.slipTypeForceChange !== '') {
        return yup
          .boolean()
          .default(false)
          .label('伝票種類（ヤマト-通常）')
          .oneOf([false], getMessage('MSG-FR-ERR-00146'));
      }
      return yup.boolean().label('伝票種類（ヤマト-通常）');
    }),
    slipTypeYamatoTime: yup.lazy((_, schema) => {
      if (
        schema.parent.placeKind === '1' &&
        schema.parent.slipTypeForceChange === '' &&
        !(
          schema.parent.slipTypeSagawaNomal ||
          schema.parent.slipTypeSagawaAir ||
          schema.parent.slipTypeYamatoNomal
        )
      ) {
        return yup
          .boolean()
          .default(false)
          .label('伝票種類（ヤマト-タイム）')
          .oneOf([true], getMessage('MSG-FR-ERR-00145'));
      } else if (schema.parent.slipTypeForceChange !== '') {
        return yup
          .boolean()
          .default(false)
          .label('伝票種類（ヤマト-タイム）')
          .oneOf([false], getMessage('MSG-FR-ERR-00146'));
      }
      return yup.boolean().label('伝票種類（ヤマト-タイム）');
    }),
    slipTypeForceChange: yup.string().label('伝票種類強制変更'),
  };

  // form
  const methods = useForm<ScrDoc0003SlipPrintedRequest>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      placeKind: '1',
      slipTypeSagawaNomal: false,
      slipTypeSagawaAir: false,
      slipTypeYamatoNomal: false,
      slipTypeYamatoTime: false,
      slipTypeForceChange: '',
    },
    resolver: yupResolver(yup.object(validationSchama)),
    context: true,
  });
  const {
    getValues,
    trigger,
    watch,
    formState: { errors, dirtyFields },
  } = methods;

  // message
  const { getMessage } = useContext(MessageContext);
  // 変数
  const [selectValues, setSelectValues] = useState<SelectValue[]>([]);
  const [radioValues, setRadioValues] = useState<SelectValue[]>([]);
  const [isCheckable, setIsCheckable] = useState<boolean>(false);
  const [printInstructed, setPrintInstructed] = useState<boolean>(false);
  const [slipPrintedRow, setSlipPrintedRow] = useState<slipPrintedRowModel[]>(
    []
  );
  const [slipPrinted, setSlipPrinted] =
    useState<ScrDoc0003SlipPrintedCntSearchResponse>({
      outputDate: '',
      outputTime: '',
      outputResultSagawaNomal: 0,
      outputResultSagawaAir: 0,
      outputResultYamatoNomal: 0,
      outputResultYamatoTime: 0,
      list: [],
    });

  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    const initialize = async () => {
      const selectRes: ScrCom9999GetCodeManagementMasterResponse =
        await ScrCom9999GetCodeManagementMaster({ codeId: 'CDE-DOC-2011' });
      const setSelectVal = selectRes.list.map((val) => {
        return { value: val.codeValue, displayValue: val.codeName };
      });
      setSelectValues(setSelectVal);

      const radioRes: ScrCom9999GetCodeManagementMasterResponse =
        await ScrCom9999GetCodeManagementMaster({ codeId: 'CDE-DOC-2012' });
      const setRadioVal = radioRes.list.map((val) => {
        return { value: val.codeValue, displayValue: val.codeName };
      });
      setRadioValues(setRadioVal);
    };
    initialize();
  }, []);

  // チェックボックスの活性・非活性
  useEffect(() => {
    const checkable = watch('placeKind') !== '1';
    setIsCheckable(checkable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('placeKind')]);

  // メッセージ出力
  useEffect(() => {
    const isForceChange = watch('slipTypeForceChange');
    if (isForceChange) {
      setTitle(getMessage('MSG-FR-INF-00018'));
      setHandleDialog(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('slipTypeForceChange')]);

  // 出力可能件数が1件以上あるかどうか
  const isPrintable =
    slipPrinted.outputResultSagawaAir ||
    slipPrinted.outputResultSagawaNomal ||
    slipPrinted.outputResultYamatoNomal ||
    slipPrinted.outputResultYamatoTime;

  const handlePrintInstructed = async () => {
    await trigger();
    const val: ScrDoc0003SlipPrintedRequest = getValues();
    if (methods.formState.isValid) {
      const res = await ScrDoc0003SlipPrintedCntSearch(val);
      setSlipPrinted(res);
      setSlipPrintedRow(convertToSlipPrintedListRow(res.list));
      setPrintInstructed(true);
    } else {
      return;
    }

    if (isPrintable) {
      await ScrDoc0003SlipPrinted(val);
    }
  };

  const handleConfirm = () => {
    handleCancel();
  };

  /**
   * ライブ情報取得APIレスポンスから会場情報リストモデルへの変換
   */
  const convertToSlipPrintedListRow = (
    response: ScrDoc0003SlipPrintedCntSearchResponse['list']
  ): slipPrintedRowModel[] => {
    return response.map((val, idx) => {
      return {
        id: (idx + 1).toString(),
        placeName: val.placeName,
        auctionCount: val.auctionCount,
        exhibitNumber: val.exhibitNumber,
      };
    });
  };
  // 伝票種類バリデーションメッセージ
  const isSlipError =
    errors['slipTypeSagawaNomal'] ||
    errors['slipTypeSagawaAir'] ||
    errors['slipTypeYamatoNomal'] ||
    errors['slipTypeYamatoTime'];
  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Popup open={isOpen}>
              <Popup main>
                <PopSection name='配送伝票一括印刷'>
                  <Stack spacing={4}>
                    <Radio
                      name='placeKind'
                      label='会場種別'
                      radioValues={radioValues}
                      required
                      disabled={printInstructed}
                    ></Radio>
                    <InputLayout label='伝票種類' size='l'>
                      <MarginBox justifyContent='start' mt={2} mb={-3}>
                        <Typography bold>佐川</Typography>
                      </MarginBox>
                      <RowStack justifyContent='flex-start' spacing={0}>
                        <Checkbox
                          name='slipTypeSagawaNomal'
                          label='通常'
                          disabled={isCheckable || printInstructed}
                        ></Checkbox>
                        <Checkbox
                          name='slipTypeSagawaAir'
                          label='航空'
                          disabled={isCheckable || printInstructed}
                        ></Checkbox>
                      </RowStack>

                      <MarginBox justifyContent='start' mt={2} mb={-3}>
                        <Typography bold>ヤマト</Typography>
                      </MarginBox>
                      <RowStack justifyContent='flex-start' spacing={0}>
                        <Checkbox
                          name='slipTypeYamatoNomal'
                          label='通常'
                          disabled={isCheckable || printInstructed}
                        ></Checkbox>
                        <Checkbox
                          name='slipTypeYamatoTime'
                          label='タイム'
                          disabled={isCheckable || printInstructed}
                        ></Checkbox>
                      </RowStack>
                    </InputLayout>
                    <Typography color={theme.palette.error.main}>
                      {isSlipError?.message}
                    </Typography>
                    <Select
                      label='伝票種類強制変更'
                      name='slipTypeForceChange'
                      selectValues={selectValues}
                      disabled={printInstructed}
                      blankOption
                    />
                    {printInstructed && isPrintable ? (
                      <Stack>
                        <RowStack>
                          <Stack>
                            <Typography bold>出力日</Typography>
                            <Typography>{slipPrinted.outputDate}</Typography>
                          </Stack>
                          <Stack>
                            <Typography bold>出力時間</Typography>
                            <Typography>{slipPrinted.outputTime}</Typography>
                          </Stack>
                        </RowStack>
                        <CaptionLabel text='出力結果' />
                        {(getValues('slipTypeSagawaNomal') ||
                          getValues('slipTypeForceChange') === '1') && (
                          <Grid container>
                            <Grid item xs={2}>
                              <Typography>佐川（通常）:</Typography>
                            </Grid>
                            <Grid item flexDirection='row'>
                              <LeftBox display='flex'>
                                <Typography>
                                  {slipPrinted.outputResultSagawaNomal}
                                </Typography>
                                <Typography>件</Typography>
                              </LeftBox>
                            </Grid>
                          </Grid>
                        )}
                        {getValues('slipTypeSagawaAir') && (
                          <Grid container>
                            <Grid item xs={2}>
                              <Typography>佐川（航空）:</Typography>
                            </Grid>
                            <Grid item>
                              <LeftBox display='flex'>
                                <Typography>
                                  {slipPrinted.outputResultSagawaAir}
                                </Typography>
                                <Typography>件</Typography>
                              </LeftBox>
                            </Grid>
                          </Grid>
                        )}
                        {(getValues('slipTypeYamatoNomal') ||
                          getValues('slipTypeForceChange') === '3') && (
                          <Grid container>
                            <Grid item xs={2}>
                              <Typography>ヤマト（通常）:</Typography>
                            </Grid>
                            <Grid item>
                              <LeftBox display='flex'>
                                <Typography>
                                  {slipPrinted.outputResultYamatoNomal}
                                </Typography>
                                <Typography>件</Typography>
                              </LeftBox>
                            </Grid>
                          </Grid>
                        )}
                        {getValues('slipTypeYamatoTime') && (
                          <Grid container>
                            <Grid item xs={2}>
                              <Typography>ヤマト（タイム）:</Typography>
                            </Grid>
                            <Grid item>
                              <LeftBox display='flex'>
                                <Typography>
                                  {slipPrinted.outputResultYamatoTime}
                                </Typography>
                                <Typography>件</Typography>
                              </LeftBox>
                            </Grid>
                          </Grid>
                        )}
                        <DataGrid
                          columns={slipPrintedColumns}
                          rows={slipPrintedRow}
                        />
                      </Stack>
                    ) : (
                      printInstructed && (
                        <Typography>
                          {getMessage('MSG-FR-ERR-00147')}
                        </Typography>
                      )
                    )}
                  </Stack>
                </PopSection>
                {handleDialog && (
                  <Dialog
                    open={handleDialog}
                    title={title}
                    buttons={[
                      { name: 'OK', onClick: () => setHandleDialog(false) },
                    ]}
                  />
                )}
              </Popup>
              <Popup bottom>
                {printInstructed ? (
                  <ConfirmButton onClick={handleConfirm}>確認</ConfirmButton>
                ) : (
                  <>
                    <CancelButton
                      onClick={() => {
                        dirtyFields ? setHandleDialog(true) : handleCancel();
                      }}
                    >
                      キャンセル
                    </CancelButton>
                    <ConfirmButton onClick={handlePrintInstructed}>
                      印刷指示
                    </ConfirmButton>
                  </>
                )}
              </Popup>
            </Popup>
          </FormProvider>
        </MainLayout>
      </MainLayout>
      {/* ダイアログ */}
      {handleDialog && (
        <Dialog
          open={handleDialog}
          title={getMessage('MSG-FR-WRN-00007')}
          buttons={[
            { name: 'NO', onClick: () => setHandleDialog(false) },
            { name: 'YES', onClick: () => handleCancel() },
          ]}
        />
      )}
    </>
  );
};
export default ScrDoc0003Popup;
