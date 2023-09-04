import React, { useContext, useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { FromTo } from 'layouts/FromTo';
import { MainLayout } from 'layouts/MainLayout';
import { Section, SectionClose } from 'layouts/Section';
import { ColStack, RowStack } from 'layouts/Stack';

import { AddButton, SearchButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { Dialog } from 'controls/Dialog';
import { Select, SelectValue } from 'controls/Select';
import { SerchLabelText } from 'controls/Typography';

import {
  GetReportOutput,
  ScrCom0009GetReportList,
  ScrCom0009GetReportListRequest,
  ScrCom0009GetReportListResponse,
  ScrCom0009GetReportOutput,
} from 'apis/com/ScrCom0009Api';
import {
  ScrCom9999GetCodeManagementMaster,
  ScrCom9999GetReportmaster,
} from 'apis/com/ScrCom9999Api';
import {
  ScrMem9999SearchconditionRefine,
  ScrMem9999SearchconditionRefineRequest,
} from 'apis/mem/ScrMem9999Api';

import { useForm } from 'hooks/useForm';

import { AppContext } from 'providers/AppContextProvider';
import { MessageContext } from 'providers/MessageProvider';

import { Format } from 'utils/FormatUtil';

import { GridRowSelectionModel } from '@mui/x-data-grid-pro';

/**
 * 検索条件データモデル
 */
interface SearchConditionModel {
  contractId: string;
  corporationId: string;
  corporationIdAndName: string;
  billingId: string;
  systemKindName: string;
  systemKind: string;
  reportCreateDateFrom: string;
  reportCreateDateTo: string;
  reportName: string;
  reportId: string;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  contractIdSelectValues: SelectValue[];
  corporationIdAndNameSelectValues: SelectValue[];
  billingIdSelectValues: SelectValue[];
  systemKindSelectValues: SelectValue[];
  reportNameSelectValues: SelectValue[];
}

/**
 * 検索条件初期データ
 */
const initialValues: SearchConditionModel = {
  contractId: '',
  corporationId: '',
  corporationIdAndName: '',
  billingId: '',
  systemKindName: '',
  systemKind: '',
  reportCreateDateFrom: '',
  reportCreateDateTo: '',
  reportName: '',
  reportId: '',
};

/**
 * プルダウン初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  contractIdSelectValues: [],
  corporationIdAndNameSelectValues: [],
  billingIdSelectValues: [],
  systemKindSelectValues: [],
  reportNameSelectValues: [],
};

/**
 * バリデーションスキーマ
 */
const reportBasicSchama = {
  contractId: yup.string().label('契約ID'),
  corporationIdAndCorporationName: yup.string().label('法人ID/法人名'),
  billingId: yup.string().label('請求先ID'),
  systemKind: yup.string().label('システム種別'),
  reportCreateDateFrom: yup.string().label('帳票作成日（FROM）').max(10),
  reportCreateDateTo: yup.string().label('帳票作成日（TO）').max(10),
  reportName: yup.string().label('帳票名'),
};
/**
 * 検索結果列定義
 */
const searchResultColumns: GridColDef[] = [
  {
    field: 'corporationId',
    headerName: '法人ID',
    size: 's',
  },
  {
    field: 'corporationName',
    headerName: '法人名',
    width: 400,
  },
  {
    field: 'systemKind',
    headerName: 'システム種別',
    size: 's',
  },
  {
    field: 'reportName',
    headerName: '帳票名',
    width: 400,
  },
  {
    field: 'reportCreateTime',
    headerName: '帳票作成日時',
    size: 'm',
  },
  {
    field: 'reportFileName',
    headerName: 'ファイル名',
    width: 600,
  },
];

/**
 * 検索結果行データモデル
 */
interface SearchResultRowModel {
  // internalId
  id: string;
  // 法人ID
  corporationId: string;
  // 法人名
  corporationName: string;
  // システム種別
  systemKind: string;
  // 帳票名
  reportName: string;
  // 帳票作成日時
  reportCreateTime: string;
  // ファイル名
  reportFileName: string;
  // 帳票格納バケット名
  reportHouseBucketName: string;
  // 帳票格納ファイルプレフィックス
  reportHouseFilePrefix: string;
  // 帳票履歴番号
  reportHistoryNumber: string;
}

/**
 * 検索条件モデルから検索条件絞込APIリクエストへの変換
 */
const convertToSearchConditionRefine = (
  searchCondition: SearchConditionModel
): ScrMem9999SearchconditionRefineRequest => {
  return {
    contractId: searchCondition.contractId,
    corporationId: searchCondition.corporationId,
    billingId: searchCondition.billingId,
  };
};

/**
 * 検索条件モデルから帳票一覧取得APIリクエストへの変換
 */
const convertFromSearchConditionModel = (
  searchCondition: SearchConditionModel
): ScrCom0009GetReportListRequest => {
  return {
    contractId: searchCondition.contractId,
    corporationId: searchCondition.corporationId,
    billingId: searchCondition.billingId,
    systemKind: searchCondition.systemKind,
    reportCreateDateFrom:
      searchCondition.reportCreateDateFrom === ''
        ? searchCondition.reportCreateDateTo
        : searchCondition.reportCreateDateFrom,
    reportCreateDateTo:
      searchCondition.reportCreateDateTo === ''
        ? searchCondition.reportCreateDateFrom
        : searchCondition.reportCreateDateTo,
    reportId: searchCondition.reportId,
    limitCount: 15000,
  };
};

/**
 * 帳票一覧取得APIレスポンスから検索結果行データモデルへの変換
 */
const convertToSearchResultRowModel = (
  response: ScrCom0009GetReportListResponse
): SearchResultRowModel[] => {
  return response.reportList.map((x) => {
    return {
      id: x.corporationId,
      corporationId: x.corporationId,
      corporationName: x.corporationName,
      systemKind: x.systemKind,
      reportName: x.reportName,
      reportCreateTime: x.reportCreateTime,
      reportFileName: x.reportFileName,
      reportHouseBucketName: x.reportHouseBucketName,
      reportHouseFilePrefix: x.reportHouseFilePrefix,
      reportHistoryNumber: x.reportHistoryNumber,
    };
  });
};

/**
 * 検索結果行データモデルからファイル出力APIリクエストへの変換
 */
const convertToCreateReportFileParameterInfo = (
  searchResult: SearchResultRowModel[]
): GetReportOutput[] => {
  return searchResult.map((x) => {
    return {
      reportHistoryNumber: x.reportHistoryNumber,
      fileName: x.reportFileName,
      reportHouseBucketName: x.reportHouseBucketName,
      reportHouseFilePrefix: x.reportHouseFilePrefix,
    };
  });
};

type key = keyof SearchConditionModel;
const serchData: { label: string; name: key }[] = [
  { label: '契約ID', name: 'contractId' },
  { label: '法人ID/法人名', name: 'corporationIdAndName' },
  { label: '請求先ID', name: 'billingId' },
  { label: 'システム種別', name: 'systemKind' },
  { label: '帳票作成日（FROM）', name: 'reportCreateDateFrom' },
  { label: '帳票作成日（TO）', name: 'reportCreateDateTo' },
  { label: '帳票名', name: 'reportName' },
];

/**
 * SCR-COM-0009 帳票再出力画面
 */
const ScrCom0009Page = () => {
  // context
  const { loadState } = useContext(AppContext);
  const prevValues = loadState();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [checkList, setCheckList] = useState<SearchResultRowModel[]>([]);

  // form
  const methods = useForm<SearchConditionModel>({
    defaultValues: prevValues === undefined ? initialValues : prevValues,
    resolver: yupResolver(yup.object(reportBasicSchama)),
    context: false,
  });
  const { watch, getValues } = methods;
  // user情報
  const { getMessage } = useContext(MessageContext);

  // Sectionの開閉処理
  const sectionRef = useRef<SectionClose>();

  // 初期表示
  useEffect(() => {
    const initialize = async () => {
      const selectValues: SelectValuesModel = selectValuesInitialValues;

      // 検索条件絞込API
      const conditionRefineRequest = convertToSearchConditionRefine(
        getValues()
      );
      const conditionRefineResponse = await ScrMem9999SearchconditionRefine(
        conditionRefineRequest
      );
      conditionRefineResponse.contractId.map((x) => {
        selectValues.contractIdSelectValues.push({
          value: x,
          displayValue: x,
        });
      });
      conditionRefineResponse.corporationList.map((x) => {
        selectValues.corporationIdAndNameSelectValues.push({
          value: x.corporationId,
          displayValue: x.corporationName,
        });
      });
      conditionRefineResponse.billingId.map((x) => {
        selectValues.billingIdSelectValues.push({
          value: x,
          displayValue: x,
        });
      });

      // 帳票マスタ取得API
      const ScrCom9999GetReportMasterResponse =
        await ScrCom9999GetReportmaster();
      ScrCom9999GetReportMasterResponse.reportMasterInfo.map((x) => {
        selectValues.reportNameSelectValues.push({
          value: x.reportId,
          displayValue: x.reportName,
        });
      });

      // コード管理マスタ情報取得API
      const CodeManagementMasterRequest = {
        codeId: 'CDE-COM-0130',
      };
      const CodeManagementMasterResponse =
        await ScrCom9999GetCodeManagementMaster(CodeManagementMasterRequest);
      CodeManagementMasterResponse.searchGetCodeManagementMasterListbox.map(
        (x) => {
          selectValues.systemKindSelectValues.push({
            value: x.codeValue,
            displayValue: x.codeName,
          });
        }
      );

      setSelectValues({
        contractIdSelectValues: selectValues.contractIdSelectValues,
        corporationIdAndNameSelectValues:
          selectValues.corporationIdAndNameSelectValues,
        billingIdSelectValues: selectValues.billingIdSelectValues,
        reportNameSelectValues: selectValues.reportNameSelectValues,
        systemKindSelectValues: selectValues.systemKindSelectValues,
      });
    };
    initialize();
  }, []);

  /**
   * 検索クリック時のイベントハンドラ
   */
  const handleSearchClick = async () => {
    // 帳票作成日チェック（FROM＞TOでないこと）
    if (
      getValues('reportCreateDateFrom') !== '' &&
      getValues('reportCreateDateTo') !== ''
    ) {
      if (getValues('reportCreateDateFrom') > getValues('reportCreateDateTo')) {
        const messege = getMessage('MSG-FR-ERR-00062');
        // ダイアログを表示
        setTitle(messege);
        setHandleDialog(true);
        return;
      }
    }
    // 関連チェック（帳票IDのシステム種別とシステム種別が一致しているか）
    if (getValues('systemKind') !== '' && getValues('reportName') !== '') {
      if (getValues('systemKind') !== getValues('reportName').slice(4, 7)) {
        // TODO メッセージを確認
        const messege = getMessage('MSG-FR-ERR-');
        // ダイアログを表示
        setTitle(messege);
        setHandleDialog(true);
        return;
      }
    }

    // 検索API
    const request = convertFromSearchConditionModel(getValues());
    const response = await ScrCom0009GetReportList(request);
    const searchResult = convertToSearchResultRowModel(response);
    console.log(request);
    if (searchResult.length != 0) {
      // 制限件数 <  取得件数の場合
      if (response.count < response.acquisitionCount) {
        // メッセージ取得機能へ引数を渡しメッセージを取得する
        const messege = Format(getMessage('MSG-FR-INF-00004'), [
          response.acquisitionCount.toString(),
          response.responseCount.toString(),
        ]);
        // ダイアログを表示
        setTitle(messege);
        setHandleDialog(true);
      }
      // データグリッドにデータを設定
      setSearchResult(searchResult);
      // セクションを閉じる
      if (sectionRef.current && sectionRef.current.closeSection)
        sectionRef.current.closeSection();
    } else {
      const message = getMessage('MSG-FR-INF-00017');
      // ダイアログを表示
      setTitle(message);
      setHandleDialog(true);
    }
  };

  /**
   * ファイル出力ボタン押下時のイベントハンドラ
   */
  const handleConfirm = async () => {
    // チェックボックスで選択したレコードを引数に型変換
    const createReportFile = convertToCreateReportFileParameterInfo(checkList);
    const request = {
      getReportList: createReportFile,
    };
    await ScrCom0009GetReportOutput(request);
  };

  /**
   * Sectionを閉じた際のラベル作成
   */
  const serchLabels = serchData.map((val, index) => {
    let nameVal = getValues(val.name);
    if (val.name === 'corporationIdAndName') {
      const filter = selectValues.corporationIdAndNameSelectValues.filter(
        (x) => {
          return nameVal === x.value;
        }
      );
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }
    if (val.name === 'systemKind') {
      const filter = selectValues.systemKindSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }
    if (val.name === 'reportName') {
      const filter = selectValues.reportNameSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.map((x) => {
        nameVal = x.displayValue;
      });
    }
    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });

  /**
   * 入力項目フォーカスアウト
   */
  useEffect(() => {
    const subscription = watch(async (value, { name }) => {
      if (
        name === 'contractId' ||
        name === 'corporationIdAndName' ||
        name === 'billingId'
      ) {
        const conditionRefineRequest = convertToSearchConditionRefine(
          getValues()
        );
        const conditionRefineResponse = await ScrMem9999SearchconditionRefine(
          conditionRefineRequest
        );
        selectValues.contractIdSelectValues = [];
        selectValues.corporationIdAndNameSelectValues = [];
        selectValues.billingIdSelectValues = [];
        conditionRefineResponse.contractId.map((x) => {
          selectValues.contractIdSelectValues.push({
            value: x,
            displayValue: x,
          });
        });
        conditionRefineResponse.corporationList.map((x) => {
          selectValues.corporationIdAndNameSelectValues.push({
            value: x.corporationId,
            displayValue: x.corporationName,
          });
        });
        conditionRefineResponse.billingId.map((x) => {
          selectValues.billingIdSelectValues.push({
            value: x,
            displayValue: x,
          });
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  /**
   * チェックボックスで選択した値の設定
   */
  const handRowSelectionModelChange = (
    rowSelectionModel: GridRowSelectionModel
  ) => {
    const RowSelections: SearchResultRowModel[] = [];
    rowSelectionModel.map((X) => {
      const a = searchResult.find((e) => e.id === X);
      if (a !== undefined) {
        RowSelections.push(a);
      }
    });
    setCheckList(RowSelections);
  };

  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 検索条件セクション */}
            <Section
              name='検索条件'
              serchLabels={serchLabels}
              isSearch
              ref={sectionRef}
            >
              <RowStack>
                <ColStack>
                  <Select
                    label='契約ID'
                    name='contractId'
                    selectValues={selectValues.contractIdSelectValues}
                    blankOption
                  />
                  <Select
                    label='法人ID/法人名'
                    name='corporationIdAndName'
                    selectValues={selectValues.corporationIdAndNameSelectValues}
                    blankOption
                    size='l'
                  />
                  <Select
                    label='請求先ID'
                    name='billingId'
                    selectValues={selectValues.billingIdSelectValues}
                    blankOption
                  />
                </ColStack>
                <ColStack>
                  <Select
                    label='システム種別'
                    name='systemKind'
                    selectValues={selectValues.systemKindSelectValues}
                    blankOption
                  />
                  <FromTo label='帳票作成日'>
                    <DatePicker name='reportCreateDateFrom' />
                    <DatePicker name='reportCreateDateTo' />
                  </FromTo>
                </ColStack>
                <Select
                  label='帳票名'
                  name='reportName'
                  selectValues={selectValues.reportNameSelectValues}
                  blankOption
                  size='m'
                />
              </RowStack>
              <CenterBox>
                <SearchButton
                  onClick={() => {
                    handleSearchClick();
                  }}
                >
                  検索
                </SearchButton>
              </CenterBox>
            </Section>
            {/* 再出力対象選択セクション */}
            <Section
              name='再出力対象選択'
              fitInside
              decoration={
                <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                  {searchResult.length !== 0 ? (
                    <AddButton onClick={handleConfirm}>ファイル出力</AddButton>
                  ) : (
                    ''
                  )}
                </MarginBox>
              }
            >
              {searchResult.length !== 0 ? (
                <DataGrid
                  columns={searchResultColumns}
                  rows={searchResult}
                  pagination
                  checkboxSelection
                  onRowSelectionModelChange={handRowSelectionModelChange}
                />
              ) : (
                ''
              )}
            </Section>
          </FormProvider>
        </MainLayout>
      </MainLayout>
      {/* ダイアログ */}
      <Dialog
        open={handleDialog}
        title={title}
        buttons={[{ name: 'OK', onClick: () => setHandleDialog(false) }]}
      />
    </>
  );
};

export default ScrCom0009Page;
