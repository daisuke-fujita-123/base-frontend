import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { TabDef, Tabs } from 'layouts/Tabs';

import { registrationRequest } from 'apis/com/ScrCom0013Api';
import { ScrCom9999GetHistoryInfo } from 'apis/com/ScrCom9999Api';

import ScrCom0013ChangeHistoryTab from './tabs/ScrCom0013ChangeHistoryTab';
import ScrCom0013CommissionDiscountPacksTab from './tabs/ScrCom0013CommissionDiscountPacksTab';
import ScrCom0013CommissionTab from './tabs/ScrCom0013CommissionTab';
import ScrCom0013CourceTab from './tabs/ScrCom0013CourceTab';
import ScrCom0013ServiceTab from './tabs/ScrCom0013ServiceTab';

const goodsBaseInitialValues: registrationRequest = {
  // コースタブ
  // コースID
  courceId: '',
  // コース名
  courceName: '',
  // 連携用対象サービス
  cooperationTargetService: '',
  // 利用フラグ
  courceUtilizationFlg: '',
  // 予約有無
  reservationExistence: '',
  // 反映予定日
  reflectionSchedule: '',
  // サービスタブ
  // サービスID
  serviceId: '',
  // サービス名
  serviceName: '',
  // 担当部門区分
  responsibleCategory: '',
  // 対象サービス区分
  targetServiceDivision: '',
  // 外部連携情報サービスフラグ
  cooperationInfoServiceFlg: false,
  // 複数契約可フラグ
  multiContractPossibleFlg: false,
  // 利用フラグ
  serviceUtilizationFlg: false,
  // 変更前タイムスタンプ
  changeBfrTimestamp: '',
  // 変更予約
  serviceChangeReserve: '',
  // 担当部門
  responsibleCategoryValues: [],
  // 連携用対象サービス
  targetServiceDivisionValues: [],
  // 変更予約情報
  changeReservationInfoSelectValues: [],
  // 手数料タブ
  // 手数料ID
  commissionId: '',
  // 手数料名
  commissionName: '',
  // 手数料種類
  commissionType: '',
  // 計算書種別
  calculationDocType: '',
  // 利用フラグ
  commissionUtilizationFlg: '',
  // 変更予約
  commissionChangeReserve: '',
  // 手数料値引値増タブ-基本値引値増
  // キャンペーンコード
  basicCampaignCd: '',
  // キャンペーン名
  basicCampaignName: '',
  // 会費種別
  basicMembershipFeeType: '',
  // 値引値増金額区分
  basicDiscountDivision: '',
  // 値引値増金額
  basicDiscountAmount: 0,
  // コースID
  basicCourseId: '',
  // １本目除外フラグ
  basicFirstExclusionFlg: false,
  // 契約数量下限
  basicContractQuantityLowLimit: 0,
  // 契約数量上限
  basicContractQuantityHighLimit: 0,
  // 期限開始日
  basicLimitStartDate: '',
  // 期限終了日
  basicLimitEndDate: '',
  // 稟議書ID
  basicApprovalDocumentId: '',
  // 商品クレームコード
  basicCommodityCrameCd: '',
  // 利用フラグ
  basicUtilizationFlg: false,
  // 契約日からの月数
  basicContractAfterMonth: 0,
  // 契約日からの月数の手前のラジオボタン
  basicNumberOfMonthsFromContractDateRadio: '',
  // 会費セクション-オプション値引値増
  // キャンペーンコード
  optionCampaignCd: '',
  // キャンペーン名
  optionCampaignName: '',
  // 会費種別
  optionMembershipFeeType: '',
  // 値引値増金額区分
  optionDiscountDivision: '',
  // 値引値増金額
  optionDiscountAmount: 0,
  // サービスID
  optionServiceId: '',
  // １本目除外フラグ
  optionFirstExclusionFlg: false,
  // 契約数量下限
  optionContractQuantityLowLimit: 0,
  // 契約数量上限
  optionContractQuantityHighLimit: 0,
  // 期限開始日
  optionLimitStartDate: '',
  // 期限終了日
  optionLimitEndDate: '',
  // 契約日からの月数
  optionContractAfterMonth: 0,
  // 稟議書ID
  optionApprovalDocumentId: '',
  // 利用フラグ
  optionUtilizationFlg: false,
  // 商品クレームコード
  optionCommodityCrameCd: '',
  // 手数料セクション
  // 値引値増パックID
  commissionDiscountPackId: '',
  // パック名
  packName: '',
  // 会員サービス識別区分
  memberServiceType: '',
  // 計算書種別
  calcurationDocType: '',
  // 有効期間開始日
  validityStartDate: '',
  // 有効期間終了日
  validityEndDate: '',
  // 利用フラグ
  commissionDiscountPacksCommissionUtilizationFlg: false,
  // 変更予約
  commissionDiscountPacksCommissionChangeReserve: '',
  // 金額(種類)
  priceSelectValues: [],
  // セット対象コース
  setTargetCourseSelectValues: [],
  // サービス名
  serviceNameSelectValues: [],
  // 商品コード
  commodityCrameCdSelectValues: [],
};

/**
 * SCR-COM-0013 商品管理画面
 */
const ScrCom0013Page = () => {
  // router
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // state
  // 全タブのリクエスト情報を統括
  const [goodsBase, setGoodsBase] = useState<registrationRequest>(
    goodsBaseInitialValues
  );
  // 変更履歴管理番号
  const [changeHistoryNumber, setChangeHistoryNumber] = useState<string>('');

  const tabValues: TabDef[] = [
    { title: 'コース', hash: '#basic' },
    { title: 'サービス', hash: '#service' },
    { title: '手数料', hash: '#commission' },
    { title: '値引値増', hash: '#commission-discount-packs' },
    // 履歴表示の場合は変更履歴タブは非活性
    {
      title: '変更履歴',
      hash: '#change-history',
      disabled: changeHistoryNumber === '' ? true : false,
    },
  ];

  useEffect(() => {
    // 履歴表示の初期化処理
    const changeHistoryNumberParam = searchParams.get('change-history-number');

    if (
      changeHistoryNumberParam !== undefined &&
      changeHistoryNumberParam !== null
    ) {
      setChangeHistoryNumber(changeHistoryNumberParam);

      // API-COM-9999-0025: 変更履歴情報取得API
      const response = ScrCom9999GetHistoryInfo({
        changeHistoryNumber: changeHistoryNumber,
      });
      response;
    }
  }, []);

  // 子画面で履歴表示用のデータを更新する処理
  const setGoodsBaseValue = (goodsBase: registrationRequest) => {
    setGoodsBase(goodsBase);
  };

  return (
    <Tabs tabDef={tabValues} defaultValue={location.hash}>
      <ScrCom0013CourceTab
        changeHisoryNumber={changeHistoryNumber}
        setGoodsBaseValue={setGoodsBaseValue}
      />
      <ScrCom0013ServiceTab
        changeHisoryNumber={changeHistoryNumber}
        setGoodsBaseValue={setGoodsBaseValue}
      />
      <ScrCom0013CommissionTab
        changeHisoryNumber={changeHistoryNumber}
        setGoodsBaseValue={setGoodsBaseValue}
      />
      <ScrCom0013CommissionDiscountPacksTab
        changeHisoryNumber={changeHistoryNumber}
        setGoodsBaseValue={setGoodsBaseValue}
      />
      <ScrCom0013ChangeHistoryTab changeHisoryNumber={changeHistoryNumber} />
    </Tabs>
  );
};

export default ScrCom0013Page;
