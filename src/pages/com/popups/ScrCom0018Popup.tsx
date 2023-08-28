import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Popup } from 'layouts/Popup';
import { PopSection } from 'layouts/Section';
import { ControlsStackItem, RowStack } from 'layouts/Stack';

import { CancelButton, ConfirmButton, SearchButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { Dialog } from 'controls/Dialog';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';

import {
  getServiceList,
  ScrCom0018GetServiceListRequest,
  ScrCom0018GetServiceListResponse,
} from 'apis/com/ScrCom0018Api';
import {
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetCodeManagementMasterRequest,
  ScrCom9999GetCodeManagementMasterResponse,
} from 'apis/com/ScrCom9999Api';

import { useForm } from 'hooks/useForm';

import { AuthContext } from 'providers/AuthProvider';

import { GridRowId } from '@mui/x-data-grid-pro';

/**
 * 検索結果行データモデル
 */
interface ServiceInfoModel {
  // DataGrid内id
  id: string;
  // サービスID
  serviceId: string;
  // サービス名
  serviceName: string;
  // 変更予約
  changeReservation: string;
  // 対象サービス区分
  targetedServiceKindName: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  // 担当部門
  staffDepartmentSelectValues: SelectValue[];
}

/**
 * 検索条件(プルダウン)初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  // 担当部門
  staffDepartmentSelectValues: [],
};

/**
 * 選択結果行データモデル
 */
export interface SelectServiceInfoModel {
  // サービスID
  serviceId: string;
  // サービス名
  serviceName: string;
  // 対象サービス区分
  targetedServiceKindName: string;
}

/**
 * 検索条件列定義
 */
const columns: GridColDef[] = [
  {
    field: 'serviceId',
    headerName: 'サービスID',
    size: 's',
  },
  {
    field: 'serviceName',
    headerName: 'サービス名',
    width: 400,
  },
  {
    field: 'changeReservation',
    headerName: '変更予約',
    size: 's',
  },
];

// API-COM-0018-0001: サービス一覧取得 レスポンス データ変換処理
const convertToServiceModel = (
  service: ScrCom0018GetServiceListResponse
): ServiceInfoModel[] => {
  return service.serviceList.map((x) => {
    return {
      id: x.serviceId,
      serviceId: x.serviceId,
      serviceName: x.serviceName,
      changeReservation: x.changeReservation,
      targetedServiceKindName: x.targetedServiceKindName,
    };
  });
};

/**
 * コード管理マスタリストボックス情報取得APIレスポンスからへの変換
 */
const CodeManagementSelectValuesModel = (
  response: ScrCom9999GetCodeManagementMasterResponse
): SelectValue[] => {
  return response.searchGetCodeManagementMasterListbox.map((x) => {
    return {
      value: x.codeValue,
      displayValue: x.codeName,
    };
  });
};

/**
 * サービス検索スキーマ
 */
const serviceSchama = {
  seviceId: yup.string().label('サービスID').max(6).half(),
  serviceName: yup.string().label('サービス名').max(30),
};

/**
 * サービス一覧（ポップアップ）プロパティ
 */
interface ScrCom0018PopupProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectServiceInfo: (info: SelectServiceInfoModel[]) => void;
}

/**
 * SCR-COM-0018 サービス一覧（ポップアップ）
 */
const ScrCom0018Popup = (props: ScrCom0018PopupProps) => {
  // props
  const { isOpen, setIsOpen, selectServiceInfo } = props;

  // state
  const [serviceResult, setServiceResult] = useState<ServiceInfoModel[]>([]);
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // チェックボックス選択行
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowId[]>([]);
  // メッセージポップアップ(ダイアログ)
  const [handleDialog, setHandleDialog] = useState<boolean>(false);

  // user
  const { user } = useContext(AuthContext);

  // コンポーネントを読み取り専用に変更するフラグ
  const isReadOnly = useState<boolean>(false);

  // form
  const methods = useForm({
    defaultValues: {
      serviceId: '',
      serviceName: '',
      staffDepartmentKind: '',
      useFlag: undefined,
    },
    resolver: yupResolver(yup.object(serviceSchama)),
    context: isReadOnly,
  });
  const { getValues } = methods;

  // select
  const useFlagSelect: SelectValue[] = [
    { displayValue: '可', value: 0 },
    { displayValue: '不可', value: 1 },
  ];

  // dialog
  const dialogButtons = [{ name: 'OK', onClick: () => setHandleDialog(false) }];
  const [title, setTitle] = useState<string>('');

  // サービス検索ポップアップ表示時の処理
  useEffect(() => {
    // 初期表示
    const initialize = async (businessDate: string) => {
      // API-COM-0018-0001: サービス一覧取得
      const serviceRequest: ScrCom0018GetServiceListRequest = {
        // 業務日付
        businessDate: businessDate,
      };
      const serviceResponse = await getServiceList(serviceRequest);
      const serviceResult = convertToServiceModel(serviceResponse);

      // SCR-COM-9999-0010: コード管理マスタリストボックス情報取得API
      const staffDepartmentRequest: ScrCom9999GetCodeManagementMasterRequest = {
        // 担当部門
        codeId: 'CDE-COM-0001',
      };
      const staffDepartmentResponse = await ScrCom9999GetCodeManagementMaster(
        staffDepartmentRequest
      );

      // プルダウンにデータを設定
      setSelectValues({
        staffDepartmentSelectValues: CodeManagementSelectValuesModel(
          staffDepartmentResponse
        ),
      });

      // データグリッドにデータを設定
      setServiceResult(serviceResult);
    };

    initialize(user.taskDate);
  }, [isOpen, user.taskDate]);

  // イベントハンドル：検索
  const handleSearchClick = async () => {
    // バリデーション
    await methods.trigger();
    const errCount = Object.keys(methods.formState.errors).length;
    if (errCount > 0) {
      return;
    }

    // API-COM-0018-0001: サービス一覧取得
    const serviceRequest: ScrCom0018GetServiceListRequest = {
      serviceId: getValues('serviceId'),
      serviceName: getValues('serviceName'),
      staffDepartmentKind: getValues('staffDepartmentKind'),
      useFlag:
        getValues('useFlag') === 0
          ? true
          : getValues('useFlag') === 1
          ? false
          : undefined,
      businessDate: user.taskDate,
    };
    const serviceResponse = await getServiceList(serviceRequest);
    const serviceResult = convertToServiceModel(serviceResponse);

    // データグリッドにデータを設定
    setServiceResult(serviceResult);
  };

  // イベントハンドル：選択
  const handleOpenPopupClick = () => {
    // 選択行チェック
    if (rowSelectionModel.length < 1) {
      // ダイアログ表示
      setTitle('対象が選択されていません。');
      setHandleDialog(true);
      return;
    }

    // 選択したサービス一覧情報をpropsに格納
    const selectServiceList: SelectServiceInfoModel[] = [];
    rowSelectionModel.forEach((d) => {
      serviceResult.forEach((f) => {
        if (f.serviceId.includes(d.toString())) {
          selectServiceList.push({
            serviceId: f.serviceId,
            serviceName: f.serviceName,
            targetedServiceKindName: f.targetedServiceKindName,
          });
        }
      });
    });
    selectServiceInfo(selectServiceList);
    setIsOpen(false);
  };

  // イベントハンドル：キャンセル
  const handleClosePopupClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Popup open={isOpen}>
              <Popup main>
                <PopSection name='サービス検索'>
                  <RowStack mb>
                    <TextField label='サービスID' name='seviceId' size='m' />
                  </RowStack>
                  <RowStack mb>
                    <TextField label='サービス名' name='serviceName' size='m' />
                  </RowStack>
                  <RowStack mb>
                    <Select
                      label='担当部門'
                      name='staffDepartmentKind'
                      selectValues={selectValues.staffDepartmentSelectValues}
                      blankOption
                      size='m'
                    />
                  </RowStack>
                  <RowStack mb>
                    <Select
                      label='利用フラグ'
                      name='useFlag'
                      selectValues={useFlagSelect}
                      blankOption
                      size='m'
                    />
                  </RowStack>
                  <RowStack>
                    <MarginBox ml={145}>
                      <SearchButton onClick={handleSearchClick}>
                        検索
                      </SearchButton>
                    </MarginBox>
                  </RowStack>
                  <br />
                  <PopSection> </PopSection>
                  <ControlsStackItem size='m'>
                    <DataGrid
                      columns={columns}
                      rows={serviceResult}
                      checkboxSelection
                      onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                      }}
                      rowSelectionModel={rowSelectionModel}
                    />
                  </ControlsStackItem>
                </PopSection>
              </Popup>
              <Popup bottom>
                <CancelButton onClick={handleClosePopupClick}>
                  キャンセル
                </CancelButton>
                <MarginBox mr={6}>
                  <ConfirmButton onClick={handleOpenPopupClick}>
                    選択
                  </ConfirmButton>
                </MarginBox>
              </Popup>
            </Popup>
          </FormProvider>
        </MainLayout>
      </MainLayout>

      {/* ダイアログ */}
      <Dialog open={handleDialog} title={title} buttons={dialogButtons} />
    </>
  );
};

export default ScrCom0018Popup;
