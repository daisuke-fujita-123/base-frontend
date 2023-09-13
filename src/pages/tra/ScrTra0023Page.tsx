import React from 'react';

/**
 * SCR-TRA-0023 出金一覧画面
 */
const ScrTra0023Page = () => {
  const [scrCom0032PopupData, setScrCom0032PopupData] =
    useState<ScrCom0032PopupModel>(ScrCom0032PopupModelInitialValues);

  const [registrationChangeMemo, setRegistrationChangeMemo] =
    useState<string>('');
  //Gridcsv出力用
  const apiRef = useGridApiRef();
  const { getMessage } = useContext(MessageContext);
  //ユーザー情報
  const { user } = useContext(AuthContext);
  // TODO:遷移元画面の判定のところだけ仕様書に記載無しなので単体試験時に調整
  const [dispType, setdispFlg] = useState<string>('');
  //元帳一覧
  const LedgerList = 'SCR-TRA-0034';
  //ワークリスト
  const workList = 'SCR-COM-0003';
  //出金一覧
  const details = 'details';
  //検索アコーディオン制御用
  const sectionRef = useRef<SectionClose>();
  let userEditPermission = false;
  //ユーザーの画面編集権限確認
  if (-1 !== user.editPossibleScreenIdList.indexOf('SCR-TRA-0023')) {
    userEditPermission = true;
  }

  // context
  const { saveState, loadState } = useContext(AppContext);

  //遷移元がワークフローかどうか
  //
  let readOnlyFlg = false;
  if (workList === dispType) {
    readOnlyFlg = true;
  }
  // form
  const methods = useForm<SearchConditionModel>({
    defaultValues: initialValues,
    resolver: yupResolver(yup.object(searchConditionSchema)),
    context: { readonly: readOnlyFlg },
  });

  const { getValues, setValue, reset, trigger } = methods;

  // state
  const [searchResult, setSearchResult] = useState<SearchResultRowModel[]>([]);
  const [hrefs, setHrefs] = useState<GridHrefsModel[]>([]);

  const [warningResult, setWarningResult] = useState<warningList[]>([]);
  const [errorResult, setErrorResult] = useState<ErrorList[]>([]);

  //帳票出力ポップアップオープン用
  const [scrCom0011PopupIsOpen, setScrCom0011PopupIsOpen] =
    useState<boolean>(false);
  //登録内容確認ポップアップオープン用
  const [scrCom0032PopupIsOpen, setScrCom0032PopupIsOpen] =
    useState<boolean>(false);

  //登録内容確認ポップアップオープン用
  const [scrCom0033PopupIsOpen, setScrCom0033PopupIsOpen] =
    useState<boolean>(false);

  //ハンドルダイアログ用
  const [handleDialog, setHandleDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  // セレクトボックス
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  // 検索ボタン非活性設定
  const [searchButtonDisableFlg, setSearchButtonDisableFlg] =
    useState<boolean>(true);
  // CSV出力ボタン非活性設定
  const [csvOutputButtonDisableFlg, setCsvOutputButtonDisableFlg] =
    useState<boolean>(true);
  // Report出力ボタン非活性設定
  const [reportOutputButtonDisableFlg, setReportOutputButtonDisableFlg] =
    useState<boolean>(true);
  // 確定ボタン非活性設定
  const [confirmButtonDisableFlg, setConfirmButtonDisableFlg] =
    useState<boolean>(true);
  //チェックボックス非活性設定
  const [gridCheckboxDisableFlg, setGridCheckboxDisableflg] =
    useState<boolean>(true);
  // チェックボックス選択行
  const [rowSelectionModel, setRowSelectionModel] = useState<
    SearchResultRowModel[]
  >([]);

  // router
  const navigate = useNavigate();

  // 債務金額
  const [tableRows, setTableValues] = useState<TableRowModel[]>([]);

  //selectフォーム表示値の取得
  useEffect(() => {
    const initialize = async () => {
      /** SELECT BOX 値取得 */
      // リスト取得(初期化)
      const selectValues: SelectValuesModel = selectValuesInitialValues;

      // コード管理マスタ情報取得API（複数取得）
      const getCodeManagementMasterMultipleRequest = {
        codeIdList: [
          { codeId: 'CDE-COM-0062' },
          { codeId: 'CDE-COM-0118' },
          { codeId: 'CDE-COM-0133' },
        ],
      };

      const getCodeManagementMasterMultipleResponse =
        await ScrCom9999getCodeManagementMasterMultiple(
          getCodeManagementMasterMultipleRequest
        );

      // 請求種別

      getCodeManagementMasterMultipleResponse.resultList.forEach((x) => {
        if (x.codeId === 'CDE-COM-0062') {
          x.codeValueList.forEach((f) => {
            selectValues.claimClassificationSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 出金種別
      getCodeManagementMasterMultipleResponse.resultList.forEach((x) => {
        if (x.codeId === 'CDE-COM-0118') {
          x.codeValueList.forEach((f) => {
            selectValues.paymentKindSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // 承認ステータス
      getCodeManagementMasterMultipleResponse.resultList.forEach((x) => {
        if (x.codeId === 'CDE-COM-0133') {
          x.codeValueList.forEach((f) => {
            selectValues.approvalStatusSelectValues.push({
              value: f.codeValue,
              displayValue: f.codeName,
            });
          });
        }
      });

      // API-MEM-9999-0023 : 検索条件絞込API : 契約ID, 法人ID/法人名, 請求先ID
      const codeMasterRequestMem0023: ScrMem9999SearchconditionRefineRequest = {
        // 契約ID
        contractId: '',
        // 法人ID
        corporationId: '',
        // 請求先ID
        billingId: '',
      };
      const searchconditionRefine = await ScrMem9999SearchconditionRefine(
        codeMasterRequestMem0023
      );

      // 契約ID
      searchconditionRefine.contractId.forEach((x) => {
        selectValues.contractIdSelectValues.push({
          value: x,
          displayValue: x,
        });
      });

      //法人リスト
      searchconditionRefine.corporationList.forEach((x) => {
        selectValues.corporationIdSelectValues.push({
          value: x.corporationId,
          displayValue: x.corporationName,
        });
      });

      //請求先ID
      searchconditionRefine.billingId.forEach((x) => {
        selectValues.billingIdSelectValues.push({
          value: x,
          displayValue: x,
        });
      });

      // セレクトボックス設定
      setSelectValues({
        // 請求種別
        claimClassificationSelectValues:
          selectValues.claimClassificationSelectValues,
        // 出金種別
        paymentKindSelectValues: selectValues.paymentKindSelectValues,
        // 承認ステータス
        approvalStatusSelectValues: selectValues.approvalStatusSelectValues,
        // 契約ID
        contractIdSelectValues: selectValues.contractIdSelectValues,
        // 法人ID
        corporationIdSelectValues: selectValues.corporationIdSelectValues,
        // 請求先ID
        billingIdSelectValues: selectValues.billingIdSelectValues,
      });

      if (LedgerList === dispType) {
        // 元帳一覧からの遷移
        //実行パラメータ取得
        // 会計処理日(From)
        const sessionStorageAccountingDateFrom =
          sessionStorage.getItem('accountingDateFrom');
        // 会計処理日(To)
        const sessionStorageAccountingDateTo =
          sessionStorage.getItem('accountingDateTo');
        // 法人ID
        const sessionStorageCorporationId =
          sessionStorage.getItem('corporationId');
        // 請求先ID
        const sessionStorageBillingId = sessionStorage.getItem('billingId');
        // 請求種別
        const sessionStorageclaimClassifications = sessionStorage.getItem(
          'claimClassification'
        );

        //元帳一覧画面で設定されたパラメータを検索セクションに設定
        setValue('corporationId', sessionStorageCorporationId || '');
        setValue('billingId', sessionStorageBillingId || '');
        setValue(
          'claimClassification',
          sessionStorageclaimClassifications || ''
        );
        setValue('accountingDateFrom', sessionStorageAccountingDateFrom || '');
        setValue('accountingDateTo', sessionStorageAccountingDateTo || '');

        //検索アコーディオンクローズ
        if (sectionRef.current) sectionRef.current.closeSection();

        //チェックボックス非活性
        setGridCheckboxDisableflg(true);
        //確定ボタン非活性
        setConfirmButtonDisableFlg(true);

        //検索イベント発生
        handleSearchClick();
      } else if (workList === dispType) {
        // ワークリストからの遷移
        //実行パラメータ取得
        const sessionStorageChangeHistoryNumber = sessionStorage.getItem(
          'changeHistoryNumber'
        );
        //ワークリスト画面で設定されたパラメータを検索セクションに設定
        // 変更履歴番号
        setValue(
          'changeHistoryNumber',
          sessionStorageChangeHistoryNumber || ''
        );
        //検索アコーディオンクローズ
        if (sectionRef.current) sectionRef.current.closeSection();
        //チェックボックス非活性
        setGridCheckboxDisableflg(true);
        //確定ボタン非活性
        setConfirmButtonDisableFlg(true);
        //検索イベント発生
        handleSearchClick();
        //CSVボタン,帳票出力ボタン,検索ボタン非活性
        setCsvOutputButtonDisableFlg(true);
        setReportOutputButtonDisableFlg(true);
        setSearchButtonDisableFlg(true);
      } else if (details === dispType) {
        // 出金詳細からの遷移
        // 検索条件復元
        //reset(loadState());TODO:フォームに反映されないので保留

        setValue(
          'accountingDateFrom',
          sessionStorage.getItem('history_accountingDateFrom') || ''
        );
        setValue(
          'accountingDateTo',
          sessionStorage.getItem('history_accountingDateTo') || ''
        );
        setValue(
          'paymentKind',
          sessionStorage.getItem('history_paymentKind') || ''
        );
        setValue(
          'claimClassification',
          sessionStorage.getItem('history_claimClassification') || ''
        );
        //承認ステータスはJson型で保存していた値を配列に変換
        setValue(
          'approvalStatus',
          JSON.parse(sessionStorage.getItem('history_approvalStatus') || '')
        );
        setValue(
          'debtNumber',
          sessionStorage.getItem('history_debtNumber') || ''
        );
        setValue(
          'contractId',
          sessionStorage.getItem('history_contractId') || ''
        );
        setValue(
          'corporationId',
          sessionStorage.getItem('history_corporationId') || ''
        );
        setValue(
          'billingId',
          sessionStorage.getItem('history_billingId') || ''
        );

        // チェックボックス活性
        setGridCheckboxDisableflg(false);
        // 検索ボタン活性化
        setSearchButtonDisableFlg(false);
      } else {
        // それ以外からの遷移(メニューからの遷移)
        // 会計処理日（FROM）、会計処理日（TO）項目に業務日付をセット
        // 現在時刻でDateの作成
        const now = new Date();
        const today = `${now.getFullYear()}/${String(
          now.getMonth() + 1
        ).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
        setValue('accountingDateFrom', today);
        setValue('accountingDateTo', today);
        // チェックボックス活性
        setGridCheckboxDisableflg(false);
        // 検索ボタン活性化
        setSearchButtonDisableFlg(false);
      }
    };
    initialize();
  }, []);

  /**
   * 検索ボタンクリック時のイベントハンドラ
   */
  const handleSearchClick = async () => {
    //TODO:saveStateフォームに反映されないので保留

    //単項目チェック日付FROM～TO
    //saveState(getValues());
    if (
      getValues('accountingDateFrom') !== '' &&
      getValues('accountingDateTo') !== ''
    ) {
      if (getValues('accountingDateFrom') > getValues('accountingDateTo')) {
        setTitle('期間が正しくありません。');
        setHandleDialog(true);
        return;
      }
    }
    //単項目入力チェックでOKまたワークリスト、元帳からの遷移の場合はOK
    await trigger();
    if (
      methods.formState.isValid ||
      LedgerList === dispType ||
      workList === dispType
    ) {
      const request = convertFromSearchConditionModel(getValues());
      const response = await ScrTra0023GetPayment(request);
      const searchResult = convertToSearchResultRowModel(response);
      setSearchResult(searchResult);

      const href = searchResult.map((x) => {
        return {
          field: 'debtNumber',
          id: x.debtNumber,
          href: '/tra/payments/' + x.debtNumber,
        };
      });
      const hrefs = [
        {
          field: 'debtNumber',
          hrefs: href,
        },
      ];

      //検索結果をモデルに展開
      const tableResult = convertToSearchResultTableModel(response);
      //件数チェック：制限件数 < 取得件数の場合メッセージ表示
      if (tableResult.limitCount < tableResult.acquisitionCount) {
        const messege = Format(getMessage('MSG-FR-INF-00004'), [
          tableResult.acquisitionCount,
          tableResult.responseCount,
        ]);
        // ダイアログを表示
        setTitle(messege);
        setHandleDialog(true);
      }

      //テーブルに値設定
      const tableRows: TableRowModel[] = [
        {
          acquisitionCount: tableResult.acquisitionCount,
          limitCount: tableResult.limitCount,
          responseCount: tableResult.responseCount,
          debtAmount: numberFormat(tableResult.debtAmount),
          bankTransfer: numberFormat(tableResult.bankTransfer),
          offsettingAmount: numberFormat(tableResult.offsettingAmount),
          paymentPending: numberFormat(tableResult.paymentPending),
          drawerPayment: numberFormat(tableResult.drawerPayment),
          cachToPass: numberFormat(tableResult.cachToPass),
          paymentStopOffsetting: numberFormat(
            tableResult.paymentStopOffsetting
          ),
          ownCompanyDeal: numberFormat(tableResult.ownCompanyDeal),
          amortization: numberFormat(tableResult.amortization),
        },
      ];
      setTableValues(tableRows);

      //ワークフローの時は債務番号のリンクを無効にする。
      if (workList !== dispType) {
        setHrefs(hrefs);
      }

      // 検索結果が1件以上存在する場合は各種ボタンを有効化する
      if (1 <= tableResult.acquisitionCount) {
        if (LedgerList !== dispType && workList !== dispType) {
          // CSV出力ボタン活性化
          setCsvOutputButtonDisableFlg(false);
          // 帳票出力ボタン活性化
          setReportOutputButtonDisableFlg(false);
          // チェックボックス活性
          setGridCheckboxDisableflg(false);
          // 確定ボタン活性
          if (userEditPermission === true) {
            setConfirmButtonDisableFlg(false);
          }
        } else {
          // チェックボックス非活性
          setGridCheckboxDisableflg(true);
        }
      }
      //検索アコーディオンクローズ
      if (sectionRef.current && sectionRef.current.closeSection)
        sectionRef.current.closeSection();

      //検索条件をセッションストレージに保存
      //会計処理日（FROM）
      sessionStorage.setItem(
        'history_accountingDateFrom',
        getValues('accountingDateFrom')
      );
      //会計処理日（TO）
      sessionStorage.setItem(
        'history_accountingDateTo',
        getValues('accountingDateTo')
      );
      //請求種別(選択値)
      sessionStorage.setItem(
        'history_claimClassification',
        getValues('claimClassification')
      );
      //出金種別(選択値)
      sessionStorage.setItem('history_paymentKind', getValues('paymentKind'));
      //承認ステータス(選択値)
      // JSON形式で保存
      sessionStorage.setItem(
        'history_approvalStatus',
        JSON.stringify(getValues('approvalStatus'))
      );
      //債務番号
      sessionStorage.setItem('history_debtNumber', getValues('debtNumber'));
      //契約ID(選択値)
      sessionStorage.setItem('history_contractId', getValues('contractId'));
      //法人ID/法人名(選択値)
      sessionStorage.setItem(
        'history_corporationId',
        getValues('corporationId')
      );
      //請求先ID(選択値)
      sessionStorage.setItem('history_billingId', getValues('billingId'));

      //ワーニングに値設定
      const WarnResult = convertToSearchResultWarnModel(response);
      //仕様変更でワーニングメッセージがある場合メッセージ表示だったが未使用になった。
    } else {
      //バリデーションエラーありの場合は検索ボタンの動作は無効とする
      return;
    }
  };

  /**
   * リンククリック時のイベントハンドラ
   */
  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  /**
   * CSV出力アイコンクリック時のイベントハンドラ
   */
  const handleIconOutputCsvClick = () => {
    saveState(getValues());
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const fileName =
      '出金一覧_' +
      user.employeeId +
      '_' +
      year +
      String(Number(month) + 1) +
      day +
      hours +
      minutes +
      '.csv';
    exportCsv(fileName, apiRef);
  };

  //テーブル定義1
  const tableColumns: TableColDef[] = [
    { field: 'debtAmount', headerName: '債務金額', width: 150 },
  ];

  //テーブル定義2
  const table2_columns: TableColDef[] = [
    { field: 'bankTransfer', headerName: '銀行振込', width: 150 },
    { field: 'offsettingAmount', headerName: '相殺金額', width: 150 },
    { field: 'paymentPending', headerName: '出金保留', width: 150 },
    { field: 'drawerPayment', headerName: '手振出金', width: 150 },
    { field: 'cachToPass', headerName: '現金手渡', width: 150 },
    { field: 'paymentStopOffsetting', headerName: '出金止相殺', width: 150 },
    { field: 'ownCompanyDeal', headerName: '自社取引', width: 150 },
    { field: 'amortization', headerName: '償却', width: 150 },
  ];

  /**
   * 帳票出力アイコンクリック時のイベントハンドラ（ダイアログオープン）
   */
  const handleIconOutputReportClick = () => {
    setScrCom0011PopupIsOpen(true);
  };

  /**
   * 帳票選択ポップアップ、出力ボタンクリック時のイベントハンドラ
   */
  const handleReportConfirm = async (
    // 帳票ID
    reportId: string,
    // 帳票名
    reportName: string,
    // コメント行数可変を戻り値にしたい
    reportComment: string,
    // 初期値
    defaultValue: string
  ) => {
    //Response用配列定義
    const request: string[] = [];
    //明細入力件数チェック
    const detailsCount = Object.keys(rowSelectionModel).length;
    //選択行が0件の場合は、検索行すべてが出力対象
    //検索結果行の債務番号のリストをrequestパラメータにセット
    if (detailsCount === 0) {
      searchResult.forEach((selectedRows) =>
        request.push(selectedRows.debtNumber)
      );
    } else {
      //チェックボックス選択行の債務番号のリストをrequestパラメータにセット
      rowSelectionModel.forEach((selectedRows) =>
        request.push(selectedRows.debtNumber)
      );
    }
    //帳票選択ポップアップクローズ
    setScrCom0011PopupIsOpen(false);
    await ScrTra0023OutputJournalReport({ debtNumber: request });
  };

  /**
   * Sectionを閉じた際のラベル作成
   */
  const serchLabels = serchData.map((val, index) => {
    let nameVal = getValues(val.name);

    // 請求種別
    if (val.name === 'claimClassification') {
      const filter = selectValues.claimClassificationSelectValues.filter(
        (x) => {
          return nameVal === x.value;
        }
      );
      filter.forEach((x) => {
        nameVal = x.displayValue;
      });
    }

    // 出金種別
    if (val.name === 'paymentKind') {
      const filter = selectValues.paymentKindSelectValues.filter((x) => {
        return nameVal === x.value;
      });
      filter.forEach((x) => {
        nameVal = x.displayValue;
      });
    }

    // 承認ステータス
    if (val.name === 'approvalStatus') {
      const nameValues: string[] = [];
      selectValues.approvalStatusSelectValues.filter((x) => {
        if (typeof nameVal !== 'string') {
          nameVal.forEach((f) => {
            if (x.value === f) {
              nameValues.push(x.displayValue);
            }
          });
        }
      });
      nameVal = nameValues.join(',\n');
    }
    return (
      nameVal && <SerchLabelText key={index} label={val.label} name={nameVal} />
    );
  });

  /**
   * 登録内容確認（ポップアップ）承認申請ボタン押下時のイベントハンドラ
   */
  const handleApprovalConfirm = (registrationChangeMemo: string) => {
    setRegistrationChangeMemo(registrationChangeMemo);
  };

  /**
   * 登録内容確認ポップアップの確定ボタンクリック時のイベントハンドラ
   */
  const handleRegistConfirm = (registrationChangeMemo: string) => {
    setRegistrationChangeMemo(registrationChangeMemo);
    setScrCom0032PopupIsOpen(false);
    setScrCom0033PopupIsOpen(true);
  };

  /**
   * 登録内容確認ポップアップ確定クリック時のイベントハンドラ
   */

  const scrCom0033handleConfirm = async (
    employeeId1: string,
    employeeId2: string,
    employeeId3: string,
    employeeId4: string,
    applicationComment: string
  ) => {
    // request項目設定
    //セッションストレージから出金番号、変更タイムスタンプリスト取得
    //出金番号リストはJson型で保存していた値を配列に変換
    const request: ScrTra0023registrationPaymentRequest = {
      // 出金番号リスト配列
      list: JSON.parse(
        sessionStorage.getItem('history_CheckPaymentRequest') || ''
      ),
      // 従業員ID1
      employeeId1: employeeId1,
      // 従業員ID2
      employeeId2: employeeId2,
      // 従業員ID3
      employeeId3: employeeId3,
      // 従業員ID4
      employeeId4: employeeId4,
      // 申請コメント
      applicationComment: applicationComment,
      // マスタID
      masterId: null,
      // 変更予定日
      changeExpectDate: today,
      // 画面ID
      screenId: 'SCR-TRA-0023',
      // タブID
      tabId: null,
      // 変更履歴番号
      changeHistoryNumber: sessionStorage.getItem('changeHistoryNumber'),
      // 登録変更メモ
      registrationChangeMemo: registrationChangeMemo,
    };
    //登録内容申請ポップアップクローズ
    setScrCom0033PopupIsOpen(false);
    //出金申請登録API呼び出し
    await ScrTra0023registrationpayment(request);
  };

  /**
   * 確定ボタンクリック時のイベントハンドラ
   */
  const handleConfirmClick = async () => {
    //明細入力件数チェック
    const detailsCount = Object.keys(rowSelectionModel).length;
    const request: ScrTra0023CheckPaymentRequest[] = rowSelectionModel.map(
      (selectedRows) => ({
        paymentNumber: selectedRows.paymentNumber,
        changeTimestamp: selectedRows.changeTimestamp,
      })
    );
    //チェックボックス0件の場合は、ダイアログでエラーメッセージを表示
    if (0 === detailsCount) {
      const messege = Format(getMessage('MSG-FR-ERR-00046'), []);
      // ダイアログを表示
      setTitle(messege);
      setHandleDialog(true);
    } else {
      //セッションストレージにrequest内容保存（出金番号リスト配列）
      // JSON形式で保存
      sessionStorage.setItem(
        'history_CheckPaymentRequest',
        JSON.stringify(request)
      );

      //出金伝票詳細入力チェック
      const response = await ScrTra0023CheckPayment(request);
      //出金一覧検索APIレスポンスからワーニングリストモデルへの変換
      const convertToWarningResult = (response: WarnList[]): warningList[] => {
        return response.map((x) => {
          return {
            warningCode: x.warnCode,
            warningMessage: x.warnMessage,
          };
        });
      };

      //登録内容確認ポップアップ呼び出し前の準備
      const convertWarn = convertToWarningResult(response.warnList);
      setWarningResult(convertWarn);
      setErrorResult(response.errorList);

      setScrCom0032PopupData({
        errorList: errorResult,
        warningList: warningResult,
        changeExpectDate: today,
        registrationChangeList: [
          {
            screenId: 'SCR-TRA-0023',
            // 画面名
            screenName: '出金一覧',
            // タブID
            tabId: 0,
            // タブ名
            tabName: '',
            // セクションリスト
            sectionList: [
              {
                // セクション名
                sectionName: '',
                // 項目名リスト
                columnList: [
                  {
                    columnName: '',
                  },
                ],
              },
            ],
          },
        ],
      });

      // 登録内容確認ポップアップ起動
      setScrCom0032PopupIsOpen(true);
    }
  };

  /**
   * 出金一覧画面描画処理
   */
  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <FormProvider {...methods}>
            {/* 出金一覧検索セクション */}
            <Section
              name='出金一覧検索'
              isSearch
              serchLabels={serchLabels}
              ref={sectionRef}
            >
              <Grid container width={1690}>
                <Grid item xs={4}>
                  <FromTo label='利用開始日'>
                    <DatePicker name='accountingDateFrom' />
                    <DatePicker name='accountingDateTo' />
                  </FromTo>
                  <Grid item xs={2}>
                    <TextField label='債務番号' name='debtNumber' />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    label='請求種別'
                    name='claimClassification'
                    selectValues={selectValues.claimClassificationSelectValues}
                    blankOption
                  />

                  <Grid item xs={2}>
                    <Select
                      label='契約ID'
                      name='contractId'
                      selectValues={selectValues.contractIdSelectValues}
                      blankOption
                    />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    label='出金種別'
                    name='paymentKind'
                    selectValues={selectValues.paymentKindSelectValues}
                    blankOption
                  />
                  <Grid item xs={2}>
                    <Select
                      label='法人ID/法人名'
                      name='corporationId'
                      selectValues={selectValues.corporationIdSelectValues}
                      blankOption
                    />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    label='承認ステータス'
                    name='approvalStatus'
                    selectValues={selectValues.approvalStatusSelectValues}
                    blankOption
                    multiple
                  />
                  <Grid item xs={2}>
                    <Select
                      label='請求先ID'
                      name='billingId'
                      selectValues={selectValues.billingIdSelectValues}
                      blankOption
                    />
                  </Grid>
                </Grid>
              </Grid>

              <ContentsDivider />
              <CenterBox>
                <SearchButton
                  disable={searchButtonDisableFlg}
                  onClick={() => {
                    handleSearchClick();
                  }}
                >
                  検索
                </SearchButton>
              </CenterBox>
            </Section>
          </FormProvider>

          {/* 出金一覧セクション */}
          <Section
            name='出金一覧'
            decoration={
              <MarginBox mt={2} mb={2} ml={2} mr={2} gap={2}>
                <AddButton
                  onClick={handleIconOutputCsvClick}
                  disable={csvOutputButtonDisableFlg}
                >
                  CSV出力
                </AddButton>
                <AddButton
                  onClick={handleIconOutputReportClick}
                  disable={reportOutputButtonDisableFlg}
                >
                  帳票出力
                </AddButton>
              </MarginBox>
            }
          >
            {/* 債務金額テーブル */}
            <Grid container width={240}>
              <FormProvider {...methods}>
                <Section>
                  <Table columns={tableColumns} rows={tableRows} />
                </Section>
              </FormProvider>
            </Grid>
            {/* 銀行振込～テーブル */}
            <Grid container width={1200}>
              <FormProvider {...methods}>
                <Section>
                  <Table columns={table2_columns} rows={tableRows} />
                </Section>
              </FormProvider>
            </Grid>
            {/* 債務一覧テーブル */}
            <Grid>
              <DataGrid
                columns={searchResultColumns}
                rows={searchResult}
                hrefs={hrefs}
                apiRef={apiRef}
                pagination
                onLinkClick={handleLinkClick}
                checkboxSelection={true}
                isRowSelectable={(params: GridRowParams) =>
                  (Number(params.row.bankTransfer.replace(/,/g, '')) !== 0 &&
                    params.row.approvalStatus === '却下') ||
                  params.row.approvalStatus === '取下げ' ||
                  params.row.approvalStatus === '一部承認済' ||
                  params.row.approvalStatus === '未提出'
                }
                // チェックボックス選択済みリスト取得
                onRowSelectionModelChange={(RowId) => {
                  // 選択された行を特定するための処理
                  const selectedRowId = new Set(RowId);
                  const selectedRows = searchResult.filter((dataGridRow) =>
                    selectedRowId.has(dataGridRow.id)
                  );
                  setRowSelectionModel(selectedRows);
                }}
              />
            </Grid>
          </Section>
        </MainLayout>
        {/* bottom */}
        <MainLayout bottom>
          <ConfirmButton
            onClick={handleConfirmClick}
            disable={confirmButtonDisableFlg}
          >
            確定
          </ConfirmButton>
        </MainLayout>
      </MainLayout>
      {/* 帳票選択（ポップアップ） */}
      {scrCom0011PopupIsOpen ? (
        <ScrCom0011Popup
          isOpen={scrCom0011PopupIsOpen}
          data={{ screenId: 'SCR-TRA-0023' }}
          handleCancel={() => setScrCom0011PopupIsOpen(false)}
          handleConfirm={handleReportConfirm}
        />
      ) : (
        ''
      )}
      {/* 登録内容確認（ポップアップ） */}
      {scrCom0032PopupIsOpen ? (
        <ScrCom0032Popup
          isOpen={scrCom0032PopupIsOpen}
          data={scrCom0032PopupData}
          handleCancel={() => setScrCom0032PopupIsOpen(false)}
          handleRegistConfirm={handleRegistConfirm}
          handleApprovalConfirm={handleApprovalConfirm}
        />
      ) : (
        ''
      )}
      {/* 【登録内容確認ポップアップ】確定ボタンの処理 */}
      {scrCom0033PopupIsOpen ? (
        <ScrCom0033Popup
          isOpen={scrCom0033PopupIsOpen}
          data={{ screenId: 'SCR-TRA-0023', tabId: 0, applicationMoney: 0 }}
          handleCancel={() => setScrCom0033PopupIsOpen(false)}
          handleConfirm={scrCom0033handleConfirm}
        />
      ) : (
        ''
      )}
      {/* ダイアログ */}
      {handleDialog ? (
        <Dialog
          open={handleDialog}
          title={title}
          buttons={[{ name: 'OK', onClick: () => setHandleDialog(false) }]}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ScrTra0023Page;
