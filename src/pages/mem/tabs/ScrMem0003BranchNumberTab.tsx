// React、mui
import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import ScrCom0032Popup, {
  registrationChangeList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032';

// レイアウト
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ColStack, RowStack, Stack } from 'layouts/Stack';

// UI
import { CancelButton, ConfirmButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { SelectValue } from 'controls/Select/Select';
import { TextField } from 'controls/TextField/TextField';

// API
import {
  ScrMem0003GetBranchNumberInfo,
  ScrMem0003GetBranchNumberInfoRequest,
  ScrMem0003GetBranchNumberInfoResponse,
  ScrMem0003InputCheckBranchNumberInfo,
  ScrMem0003InputCheckBranchNumberInfoRequest,
  ScrMem0003RegistrationBranchNumberInfo,
  ScrMem0003RegistrationBranchNumberInfoRequest,
} from 'apis/mem/ScrMem0003Api';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { GridCellParams, GridColumnGroupingModel } from '@mui/x-data-grid-pro';
import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';

/** CSS定義 (TODO アーキにてDataGridの背景色の設定方法検討中、検討結果が出てから修正予定) */
const dataGridStyle = {
  grid: {
    '.representativeContract': {
      background: 'yellow',
    },
    '.leaving': {
      background: 'darkgray',
    },
  },
};

/** 定数定義 */
const CDE_COM_0025_LEAVING = '4';
const SCREEN_ID_SCR_MEM_0003 = 'SCR-MEM-0003';
const SCREEN_ID_SCR_MEM_0003_NAME = '法人情報詳細';
const TAB_ID_SCR_MEM_0003_BRANCH_NUMBER = '8';
const TAB_ID_SCR_MEM_0003_BRANCH_NUMBER_NAME = '拠点枝番紐付け';

/** モデル定義 */
/** 枝番プルダウンデータモデル */
interface SelectValuesModel {
  // 枝番入力選択肢
  branchNumberSelectValues: SelectValue[];
}
/** 拠点枝番紐付け情報データモデル */
interface BranchNumberInfoModel {
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // 物流拠点情報一覧
  contracts: ContractsRowModel[];
  // 物流拠点情報一覧
  logisticsBases: LogisticsBasesRowModel[];
  // 契約ID別枝番設定状況一覧
  contractBranchNumberSummaries: ContractBranchNumberSummariesRowModel[];
  // 枝番設定一覧
  branchNumbers: BranchNumbersRowModel[];
  // 変更タイムスタンプ
  changeTimestamp: string;
}
/** 契約情報データモデル */
interface ContractsRowModel {
  // 契約ID
  contractId: string;
  // コース参加区分
  courseEntryKind: string;
}
/** 物流拠点情報データモデル */
interface LogisticsBasesRowModel {
  // 物流拠点ID
  logisticsBaseId: string;
  // 物流拠点名称
  logisticsBaseName: string;
  // 物流拠点代表契約ID
  logisticsBaseRepresentativeContractId: string;
}
/** 契約ID別枝番設定状況データモデル */
interface ContractBranchNumberSummariesRowModel {
  // ID
  id: number;
  // 契約ID
  contractId: string;
  // コース名
  courseName: string;
  // コース参加区分
  courseEntryKind: string;
  // コース参加区分名称
  courseEntryKindName: string;
  // 枝番設定数
  branchNumberCount: number;
}
/** 枝番情報データモデル */
interface BranchNumbersRowModel {
  // 物流拠点ID
  logisticsBaseId: string;
  // 契約ID
  contractId: string;
  // 枝番
  branchNumber: string;
}

/** 変数定義 */
/** プルダウン初期データ */
const selectValuesInitialValues: SelectValuesModel = {
  /** 枝番選択肢(空文字、00～99までの選択肢) */
  branchNumberSelectValues: [{ value: '', displayValue: '' }].concat(
    [...Array(100)].map<SelectValue>((o, i) => {
      const val = i.toString().padStart(2, '0');
      return { value: val, displayValue: val };
    })
  ),
};
/** 契約ID別枝番設定状況一覧 カラム定義 */
const contractBranchNumberSummariesColumns: GridColDef[] = [
  {
    field: 'contractId',
    headerName: '契約ID',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'courseName',
    headerName: 'コース名',
    size: 'l',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'courseEntryKindName',
    headerName: '参加区分',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
  {
    field: 'branchNumberCount',
    headerName: '枝番設定数',
    size: 'm',
    cellType: 'default',
    editable: false,
  },
];
/** 枝番設定一覧 カラム定義 */
const branchNumberColumns: GridColDef[] = [
  {
    field: 'logisticsBaseId',
    headerName: '物流拠点ID',
    size: 'm',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'logisticsBaseName',
    headerName: '物流拠点名',
    size: 'l',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'logisticsBaseRepresentativeContractId',
    headerName: '物流拠点代表契約ID',
    size: 'ss',
    cellType: 'default',
    hideable: false,
    hide: true,
    disableColumnMenu: true,
  },
];
/** 枝番設定一覧 カラムグルーピング定義 */
const branchNumberColumnGrouping: GridColumnGroupingModel = [
  {
    groupId: 'contractId',
    headerName: '契約枝番紐付け',
    children: [],
  },
];
/** 枝番設定一覧 initialState定義 */
const branchNumberInitialState: GridInitialStatePro = {
  pinnedColumns: {
    left: ['logisticsBaseId', 'logisticsBaseName'],
  },
};

/** 登録内容確認ポップアップ初期データ */
const scrCom0032PopupInitialValues: ScrCom0032PopupModel = {
  errorList: [],
  warningList: [],
  registrationChangeList: [],
  changeExpectDate: '',
};
/**
 * 法人基本情報取得APIリクエストから法人基本情報データモデルへの変換
 */
const convertToBranchNumberInfoModel = (
  response: ScrMem0003GetBranchNumberInfoResponse
): BranchNumberInfoModel => {
  return {
    corporationId: response.corporationId,
    corporationName: response.corporationName,
    contracts: response.contracts,
    logisticsBases: response.logisticsBases,
    contractBranchNumberSummaries: response.contractBranchNumberSummaries.map(
      (o, i) => {
        return {
          id: i,
          contractId: o.contractId,
          courseName: o.courseName,
          courseEntryKind: o.courseEntryKind,
          courseEntryKindName: o.courseEntryKindName,
          branchNumberCount: o.branchNumberCount,
        };
      },
      []
    ),
    branchNumbers: response.branchNumbers,
    changeTimestamp: response.changeTimestamp,
  };
};

/**
 * 変更した項目から登録・変更内容データへの変換
 */
const convertToChangedSections = (
  bf: BranchNumbersRowModel[],
  af: BranchNumbersRowModel[]
): registrationChangeList[] => {
  // 変更リスト
  const changeListChange: BranchNumbersRowModel[] = af.filter((oaf) => {
    const o = bf.find(
      (obf) =>
        oaf.contractId === obf.contractId &&
        oaf.logisticsBaseId === obf.logisticsBaseId
    );
    // 見つからない場合は「新規」、枝番に差がある場合は「更新」
    if (o === undefined || o.branchNumber !== oaf.branchNumber) {
      return true;
    }
    return false;
  });
  // 削除リスト
  const changeListDel: BranchNumbersRowModel[] = bf.filter((obf) => {
    const o = af.find(
      (oaf) =>
        obf.contractId === oaf.contractId &&
        obf.logisticsBaseId === oaf.logisticsBaseId
    );
    // 見つからない場合は「削除」
    if (o === undefined) {
      return true;
    }
    return false;
  });
  const changeList = changeListChange.concat(changeListDel);

  const sectionList: sectionList = {
    sectionName: '物流拠点別枝番設定',
    columnList: changeList.map((o) => {
      return {
        columnName:
          '枝番(物流拠点ID：' +
          o.logisticsBaseId +
          ', 契約ID：' +
          o.contractId +
          ')',
      };
    }),
  };
  return [
    {
      screenId: SCREEN_ID_SCR_MEM_0003,
      screenName: SCREEN_ID_SCR_MEM_0003_NAME,
      tabId: TAB_ID_SCR_MEM_0003_BRANCH_NUMBER,
      tabName: TAB_ID_SCR_MEM_0003_BRANCH_NUMBER_NAME,
      sectionList: [sectionList],
    },
  ];
};

const ScrMem0003BranchNumberTab = () => {
  // router
  const { corporationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // state
  // 初期表示値
  const [initValues, setInitValues] = useState<BranchNumberInfoModel>({
    corporationId: '',
    corporationName: '',
    contracts: [],
    logisticsBases: [],
    contractBranchNumberSummaries: [],
    branchNumbers: [],
    changeTimestamp: '',
  });
  // DataGrid：契約ID別枝番設定状況
  const [contractBranchNumberSummaries, setContractBranchNumberSummaries] =
    useState<ContractBranchNumberSummariesRowModel[]>([]);
  // DataGrid：拠点別枝番設定
  const [branchNumbers, setBranchNumbers] = useState<
    { [key: string]: string }[]
  >([]);
  // ポップアップ表示状態
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  // 登録内容確認ポップアップデータ
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(scrCom0032PopupInitialValues);
  // コンポーネントを読み取り専用に変更するフラグ
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  // form
  const methods = useForm<BranchNumberInfoModel>({
    context: isReadOnly,
  });
  const { reset } = methods;

  // 初期表示処理
  useEffect(() => {
    const initialize = async (corporationId: string) => {
      const search = location.search;
      const qs = new URLSearchParams(search);
      const changeHistoryNumber = qs.get('changeHistoryNumber');
      if (changeHistoryNumber !== null) {
        setIsReadOnly(true);
      }

      // 拠点枝番紐付け情報取得API呼出
      const request: ScrMem0003GetBranchNumberInfoRequest = {
        corporationId: corporationId,
        changeHistoryNumber: changeHistoryNumber,
      };
      const response = await ScrMem0003GetBranchNumberInfo(request);

      // レスポンスを変換、画面にデータを設定
      const branchNumberInfo = convertToBranchNumberInfoModel(response);
      reset(branchNumberInfo);

      // 初期処理レスポンスを格納
      setInitValues(branchNumberInfo);

      // 契約ID別枝番設定状況
      setContractBranchNumberSummaries(
        branchNumberInfo.contractBranchNumberSummaries
      );

      // 物流拠点別枝番設定
      // 列定義を設定
      branchNumberColumns.splice(2);
      for (let i = 0; i < branchNumberInfo.contracts.length; i++) {
        const tmpGridColDef: GridColDef = {
          field: 'branchNumber' + i.toString(),
          headerName: branchNumberInfo.contracts[i].contractId,
          size: 's',
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          cellType: isReadOnly ? 'default' : 'select', // TODO 表上入力オブジェクトの入力不可に対応できていないので、暫定対処
          selectValues: selectValuesInitialValues.branchNumberSelectValues,
          editable:
            branchNumberInfo.contracts[i].courseEntryKind !==
            CDE_COM_0025_LEAVING,
        };
        branchNumberColumns.push(tmpGridColDef);
        branchNumberColumnGrouping[0].children.push({
          field: 'branchNumber' + i.toString(),
        });
      }
      // セル内データを設定
      const branchNumbersData = [];
      for (let i = 0; i < branchNumberInfo.logisticsBases.length; i++) {
        const tmp: { [key: string]: string } = {};
        tmp['id'] = i.toString();
        tmp['logisticsBaseId'] =
          branchNumberInfo.logisticsBases[i].logisticsBaseId;
        tmp['logisticsBaseName'] =
          branchNumberInfo.logisticsBases[i].logisticsBaseName;
        tmp['logisticsBaseRepresentativeContractId'] =
          branchNumberInfo.logisticsBases[
            i
          ].logisticsBaseRepresentativeContractId;

        for (let j = 0; j < branchNumberInfo.contracts.length; j++) {
          const val = branchNumberInfo.branchNumbers.filter(
            (o: { logisticsBaseId: string; contractId: string }) =>
              o.logisticsBaseId ===
                branchNumberInfo.logisticsBases[i].logisticsBaseId &&
              o.contractId === branchNumberInfo.contracts[j].contractId
          );
          if (val.length > 0) {
            tmp['branchNumber' + j.toString()] = val[0].branchNumber;
          } else {
            tmp['branchNumber' + j.toString()] = '';
          }
        }
        branchNumbersData.push(tmp);
      }
      setBranchNumbers(branchNumbersData);
    };

    if (corporationId === undefined || corporationId === 'new') {
      return;
    }

    initialize(corporationId);
  }, [corporationId, reset, isReadOnly, location]);

  /**
   * 物流拠点別枝番設定一覧の値取得
   */
  const getBranchNumberValues = () => {
    const branchNumberValues: BranchNumbersRowModel[] = [];
    for (let i = 0; i < initValues.logisticsBases.length; i++) {
      for (let j = 0; j < initValues.contracts.length; j++) {
        const val = branchNumbers[i]['branchNumber' + j.toString()];
        if (val !== '') {
          branchNumberValues.push({
            logisticsBaseId: initValues.logisticsBases[i].logisticsBaseId,
            contractId: initValues.contracts[j].contractId,
            branchNumber: val,
          });
        }
      }
    }
    return branchNumberValues;
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirm = async () => {
    const branchNumbersReqData: BranchNumbersRowModel[] =
      getBranchNumberValues();
    const registrationChangeList: registrationChangeList[] =
      convertToChangedSections(initValues.branchNumbers, branchNumbersReqData);

    // 変更箇所なしの場合、エラー
    if (registrationChangeList.length === 0) {
      // TODO エラーメッセージを表示する MSG-FR-ERR-00053:画面入力内容が編集されていません
    }

    // 拠点枝番紐付け情報入力チェックAPI
    const request: ScrMem0003InputCheckBranchNumberInfoRequest = {
      corporationId: initValues.corporationId,
      branchNumbers: branchNumbersReqData,
    };
    const response = await ScrMem0003InputCheckBranchNumberInfo(request);

    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: response.errorList.map((o) => {
        return {
          errorCode: o.errorCode,
          errorMessages: [o.errorMessage],
        };
      }),
      warningList: [],
      registrationChangeList: convertToChangedSections(
        initValues.branchNumbers,
        branchNumbersReqData
      ),
      changeExpectDate: '',
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    navigate('/mem/corporations');
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async () => {
    setIsOpenPopup(false);

    // 拠点枝番紐付け情報登録API
    const request: ScrMem0003RegistrationBranchNumberInfoRequest = {
      corporationId: initValues.corporationId,
      branchNumbers: getBranchNumberValues(),
      changeTimestamp: initValues.changeTimestamp,
    };
    const response = await ScrMem0003RegistrationBranchNumberInfo(request);
    console.log(response);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  return (
    <>
      <MainLayout>
        <MainLayout main>
          <FormProvider {...methods}>
            <Section name='法人情報'>
              <RowStack>
                <ColStack>
                  <TextField label='法人ID' name='corporationId' readonly />
                </ColStack>
                <ColStack>
                  <TextField
                    label='法人名'
                    name='corporationName'
                    size='m'
                    readonly
                  />
                </ColStack>
              </RowStack>
            </Section>
            <Section name='契約ID別枝番設定状況'>
              <DataGrid
                pageSize={100}
                columns={contractBranchNumberSummariesColumns}
                rows={contractBranchNumberSummaries}
              />
            </Section>
            <Section name='物流拠点別枝番設定'>
              {/* TODO getCellClassNameを利用するかどうかはアーキ確認中 */}
              <DataGrid
                disableColumnFilter
                sx={dataGridStyle.grid}
                columns={branchNumberColumns}
                rows={branchNumbers}
                columnGroupingModel={branchNumberColumnGrouping}
                initialState={branchNumberInitialState}
                getCellClassName={(
                  params: GridCellParams<any, any, number>
                ) => {
                  // 脱会している契約判定
                  if (
                    initValues.contracts.filter(
                      (o: { contractId: string; courseEntryKind: string }) =>
                        o.contractId === params.colDef.headerName &&
                        o.courseEntryKind === CDE_COM_0025_LEAVING
                    ).length > 0
                  ) {
                    return 'leaving';
                  }
                  // 物流拠点代表契約判定
                  if (
                    params.colDef.headerName ===
                    initValues.logisticsBases[params.row['id']]
                      .logisticsBaseRepresentativeContractId
                  ) {
                    return 'representativeContract';
                  }
                  return '';
                }}
              />
            </Section>
          </FormProvider>
        </MainLayout>
        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton
              disable={isReadOnly ? true : false}
              onClick={handleConfirm}
            >
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>
      {/* 登録内容確認ポップアップ */}
      <ScrCom0032Popup
        isOpen={isOpenPopup}
        data={scrCom0032PopupData}
        handleConfirm={handlePopupConfirm}
        handleCancel={handlePopupCancel}
      />
    </>
  );
};

export default ScrMem0003BranchNumberTab;
