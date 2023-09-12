// React、mui
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import ScrCom0032Popup, {
  errorList,
  registrationChangeList,
  ScrCom0032PopupModel,
  sectionList,
} from 'pages/com/popups/ScrCom0032Popup';

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

// 共通部品
import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { AuthContext } from 'providers/AuthProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Typography } from '@mui/material';
import { GridCellParams, GridColumnGroupingModel } from '@mui/x-data-grid-pro';
import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';
import {
  CDE_COM_0025_LEAVING,
  SCREEN_ID_SCR_MEM_0003,
  SCREEN_ID_SCR_MEM_0003_NAME,
  TAB_ID_SCR_MEM_0003_BRANCH_NUMBER,
  TAB_ID_SCR_MEM_0003_BRANCH_NUMBER_NAME,
} from 'definitions/constants';

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
    [...Array(100)].map<{ value: string; displayValue: string }>((o, i) => {
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
    filterable: false,
  },
  {
    field: 'courseName',
    headerName: 'コース名',
    size: 'l',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'courseEntryKindName',
    headerName: '参加区分',
    size: 'm',
    cellType: 'default',
    editable: false,
    filterable: false,
  },
  {
    field: 'branchNumberCount',
    headerName: '枝番設定数',
    size: 'm',
    cellType: 'default',
    editable: false,
    filterable: false,
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
/** 法人基本情報取得APIリクエストから法人基本情報データモデルへの変換処理 */
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

/** 変更した項目から登録・変更内容データへの変換処理 */
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

/** SCR-MEM-0003：法人情報詳細 拠点枝番紐付けタブ */
const ScrMem0003BranchNumberTab = () => {
  // router
  const { corporationId } = useParams();
  const { user } = useContext(AuthContext);
  const { getMessage } = useContext(MessageContext);
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
  const [isReadOnly, setIsReadOnly] = useState<boolean>(
    user.editPossibleScreenIdList.indexOf('SCR-MEM-0003') === -1
  );

  // 拠点別枝番設定一覧を非表示にするフラグ
  const [isHideBranchNumbers, setIsHideBranchNumbers] =
    useState<boolean>(false);

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

      await setInitData(corporationId, changeHistoryNumber);
    };

    if (corporationId === undefined || corporationId === 'new') {
      return;
    }

    initialize(corporationId);
  }, [corporationId, reset, isReadOnly, location]);

  /**
   * 物流拠点別枝番設定一覧の値取得
   */
  const setInitData = async (
    corporationId: string,
    changeHistoryNumber: string | null
  ) => {
    // 変更履歴管理番号指定の場合は参照表示に設定
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
    // ページ再読み込み時に配列要素重複エラーが発生するため、最初に動的生成する要素を削除する
    branchNumberColumns.splice(2);
    branchNumberColumnGrouping[0].children.splice(0);
    // 契約情報、物流拠点情報がいずれか0件の場合は表を非表示に設定
    if (
      branchNumberInfo.contracts.length === 0 ||
      branchNumberInfo.logisticsBases.length === 0
    ) {
      setIsHideBranchNumbers(true);
    } else {
      for (let i = 0; i < branchNumberInfo.contracts.length; i++) {
        const tmpGridColDef: GridColDef = {
          field: 'branchNumber' + i.toString(),
          headerName: branchNumberInfo.contracts[i].contractId,
          size: 's',
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          cellType:
            isReadOnly ||
            branchNumberInfo.contracts[i].courseEntryKind ===
              CDE_COM_0025_LEAVING
              ? 'default'
              : 'select', // TODO 表上入力オブジェクトの入力不可に対応できていないので、暫定対処
          selectValues: selectValuesInitialValues.branchNumberSelectValues,
          editable:
            branchNumberInfo.contracts[i].courseEntryKind !==
            CDE_COM_0025_LEAVING,
        };
        branchNumberColumns.push(tmpGridColDef);
        // カラムグルーピングの子要素を削除
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
    }
  };

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
    const errorMsgList: errorList[] = [];
    if (registrationChangeList[0].sectionList[0].columnList.length === 0) {
      errorMsgList.push({
        errorCode: 'MSG-FR-ERR-00053',
        errorMessage: getMessage('MSG-FR-ERR-00053'),
      });
    } else {
      // 拠点枝番紐付け情報入力チェックAPI
      const request: ScrMem0003InputCheckBranchNumberInfoRequest = {
        corporationId: initValues.corporationId,
        branchNumbers: branchNumbersReqData,
      };
      const response = await ScrMem0003InputCheckBranchNumberInfo(request);
      const errorMsgListRes: errorList[] = response.errorList.map((o) => {
        return {
          errorCode: o.errorCode,
          errorMessage: o.errorMessage,
        };
      });
      errorMsgListRes.forEach((v) => {
        errorMsgList.push(v);
      });
    }

    setIsOpenPopup(true);
    setScrCom0032PopupData({
      errorList: errorMsgList,
      warningList: [],
      registrationChangeList: registrationChangeList,
      changeExpectDate: '',
    });
  };

  /**
   * キャンセルボタンクリック時のイベントハンドラ
   */
  const handleCancel = () => {
    // 遷移元に戻る
    navigate(-1);
  };

  /**
   * ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handlePopupConfirm = async (registrationChangeMemo: string) => {
    setIsOpenPopup(false);
    // 拠点枝番紐付け情報登録API
    const request: ScrMem0003RegistrationBranchNumberInfoRequest = {
      corporationId: initValues.corporationId,
      branchNumbers: getBranchNumberValues(),
      changeTimestamp: initValues.changeTimestamp,
      registrationChangeMemo: registrationChangeMemo,
    };
    await ScrMem0003RegistrationBranchNumberInfo(request);
    // 自画面リロード
    await setInitData(corporationId ? corporationId : '', null);
  };

  /**
   * ポップアップのキャンセルボタンクリック時のイベントハンドラ
   */
  const handlePopupCancel = () => {
    setIsOpenPopup(false);
  };

  /**
   * 承認申請ボタン押下イベントハンドラ
   */
  const handleApprovalConfirm = () => {
    console.log('[SCR-MEN-0003#BranchNumber]Ignore approval request events.');
    return;
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
                height='100%'
                pagination={true}
                columns={contractBranchNumberSummariesColumns}
                rows={contractBranchNumberSummaries}
              />
            </Section>
            <Section name='物流拠点別枝番設定'>
              {isHideBranchNumbers ? (
                <Typography>
                  契約情報、物流拠点情報が登録されていません。
                </Typography>
              ) : (
                <DataGrid
                  width='auto'
                  disableColumnFilter
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
                      return 'cold';
                    }
                    // 物流拠点代表契約判定
                    if (
                      params.colDef.headerName ===
                      initValues.logisticsBases[params.row['id']]
                        .logisticsBaseRepresentativeContractId
                    ) {
                      return 'hot';
                    }
                    return '';
                  }}
                  sx={{
                    '& .cold': {
                      backgroundColor: '#dddddd',
                    },
                    '& .hot': {
                      backgroundColor: '#eeff9e',
                    },
                  }}
                />
              )}
            </Section>
          </FormProvider>
        </MainLayout>
        {/* bottom */}
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <CancelButton onClick={handleCancel}>キャンセル</CancelButton>
            <ConfirmButton
              disable={isReadOnly || isHideBranchNumbers ? true : false}
              onClick={handleConfirm}
            >
              確定
            </ConfirmButton>
          </Stack>
        </MainLayout>
      </MainLayout>
      {/* 登録内容確認ポップアップ */}
      {isOpenPopup && (
        <ScrCom0032Popup
          isOpen={isOpenPopup}
          data={scrCom0032PopupData}
          handleCancel={handlePopupCancel}
          handleRegistConfirm={handlePopupConfirm}
          handleApprovalConfirm={handleApprovalConfirm}
        />
      )}
    </>
  );
};

export default ScrMem0003BranchNumberTab;

