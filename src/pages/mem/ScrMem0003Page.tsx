import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { TabDef, Tabs } from 'layouts/Tabs';

import { ScrMem0003RegistrationCorporationInfoRequest } from 'apis/mem/ScrMem0003Api';

import ScrMem0003BaseTab from './tabs/ScrMem0003BaseTab';
import ScrMem0003BasicTab from './tabs/ScrMem0003BasicTab';
import ScrMem0003BranchNumberTab from './tabs/ScrMem0003BranchNumberTab';
import ScrMem0003ChangeHistoryTab from './tabs/ScrMem0003ChangeHistoryTab';
import ScrMem0003ContractTab from './tabs/ScrMem0003ContractTab';
import ScrMem0003CreditLimitTab from './tabs/ScrMem0003CreditLimitTab';
import ScrMem0003CreditTab from './tabs/ScrMem0003CreditTab';
import ScrMem0003DealHistoryTab from './tabs/ScrMem0003DealHistoryTab';

/**
 * 初期データ
 */
const initialValues: ScrMem0003RegistrationCorporationInfoRequest = {
  corporationId: '',
  corporationName: '',
  corporationNameKana: '',
  corporationGroupId: [],
  goldSilverMemberKind: '',
  corporationZipCode: '',
  corporationPrefectureCode: '',
  corporationMunicipalities: '',
  corporationAddressBuildingName: '',
  corporationPhoneNumber: '',
  corporationFaxNumber: '',
  corporationMailAddress: '',
  eligibleBusinessNumber: '',
  taxBusinessKind: '',
  publicSafetyCommittee: '',
  antiqueBusinessLicenseNumber: '',
  issuanceDate: new Date(''),
  antiqueName: '',
  memberMemo: '',
  representativeName: '',
  representativeNameKana: '',
  representativeGenderKind: '',
  representativeBirthDate: new Date(''),
  possessionAssetsKind: '',
  representativeZipCode: '',
  representativePrefectureCode: '',
  representativeMunicipalities: '',
  representativeAddressBuildingName: '',
  representativePhoneNumber: '',
  representativeFaxNumber: '',
  representativeMobilePhoneNumber: '',
  guarantor: [],

  basicsCorporationCreditAmount: 0,
  corporationCreditDealAmount: 0,
  creditAdditionAmount: 0,
  temporaryCorporationCreditAmount: 0,
  temporaryCreditStartDate: '',
  temporaryCreditEndDate: '',
  temporaryCreditSettingDate: '',
  employeeName: '',
  changeEeason: '',
  approvalDocumentId: '',
  paymentExtensionCreditAmount: 0,
  paymentExtensionDealAmount: 0,

  automaticLimitFlag: false,
  limitStatusKind: '',
  limitKind: '',

  tvaaAcquisitionCount: 0,
  tvaaContractInfo: [],
  bikeAcquisitionCount: 0,
  bikeContractInfo: [],
  billingAcquisitionCount: 0,
  billingInfo: [],
  assignmentAcquisitionCount: 0,
  assignmentDocumentDestinationInfo: [],
  applicationEmployeeId: '',
  changeExpectDate: '',
  registrationChangeMemo: '',
  screenId: 'SCR-MEM-0003',
  tabId: '',
};

export interface TabDisabledsModel {
  ScrMem0003BasicTab: boolean;
  ScrMem0003CreditTab: boolean;
  ScrMem0003CreditLimitTab: boolean;
  ScrMem0003ContractTab: boolean;
  ScrMem0003BaseTab: boolean;
  ScrMem0003DealHistoryTab: boolean;
  ScrMem0003BranchNumberTab: boolean;
  ScrMem0003ChangeHistoryTab: boolean;
}

/**
 * SCR-MEM-0003 法人情報詳細画面
 */
const ScrMem0003Page = () => {
  // router
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const readonly = searchParams.get('readonly');

  const [tabDisableds, setTabDisableds] = useState<TabDisabledsModel>({
    ScrMem0003BasicTab: false,
    ScrMem0003CreditTab: false,
    ScrMem0003CreditLimitTab: false,
    ScrMem0003ContractTab: false,
    ScrMem0003BaseTab: false,
    ScrMem0003DealHistoryTab: false,
    ScrMem0003BranchNumberTab: false,
    ScrMem0003ChangeHistoryTab: false,
  });

  const [scrMem0003Data, setScrMem0003Data] =
    useState<ScrMem0003RegistrationCorporationInfoRequest>(initialValues);

  const tabValues: TabDef[] = [
    {
      title: '基本情報',
      hash: '#basic',
      disabled: tabDisableds.ScrMem0003BasicTab,
    },
    {
      title: '与信情報',
      hash: '#credit',
      disabled: tabDisableds.ScrMem0003CreditTab,
    },
    {
      title: '与信制限',
      hash: '#credit-limit',
      disabled: tabDisableds.ScrMem0003CreditLimitTab,
    },
    {
      title: '契約情報',
      hash: '#contract',
      disabled: tabDisableds.ScrMem0003ContractTab,
    },
    {
      title: '拠点情報',
      hash: '#base',
      disabled: tabDisableds.ScrMem0003BaseTab,
    },
    {
      title: '取引履歴',
      hash: '#deal-history',
      disabled: tabDisableds.ScrMem0003DealHistoryTab,
    },
    {
      title: '拠点枝番紐付け',
      hash: '#branch-number',
      disabled: tabDisableds.ScrMem0003BranchNumberTab,
    },
    {
      title: '変更履歴',
      hash: '#change-hisotry',
      disabled: tabDisableds.ScrMem0003ChangeHistoryTab,
    },
  ];

  // 初期表示処理
  useEffect(() => {
    if (applicationId !== null) {
      setTabDisableds({
        ScrMem0003BasicTab: false,
        ScrMem0003CreditTab: false,
        ScrMem0003CreditLimitTab: false,
        ScrMem0003ContractTab: false,
        ScrMem0003BaseTab: true,
        ScrMem0003DealHistoryTab: true,
        ScrMem0003BranchNumberTab: true,
        ScrMem0003ChangeHistoryTab: true,
      });
      return;
    }
    if (readonly !== null) {
      setTabDisableds({
        ScrMem0003BasicTab: true,
        ScrMem0003CreditTab: false,
        ScrMem0003CreditLimitTab: true,
        ScrMem0003ContractTab: true,
        ScrMem0003BaseTab: true,
        ScrMem0003DealHistoryTab: true,
        ScrMem0003BranchNumberTab: true,
        ScrMem0003ChangeHistoryTab: true,
      });
      return;
    }
    return;
  }, []);

  const chengeTabDisableds = (tabDisableds: TabDisabledsModel) => {
    setTabDisableds(tabDisableds);
  };

  const chengeScrMem0003Data = (
    scrMem0003Data: ScrMem0003RegistrationCorporationInfoRequest
  ) => {
    setScrMem0003Data(scrMem0003Data);
  };

  return (
    <Tabs tabDef={tabValues} defaultValue={location.hash}>
      <ScrMem0003BasicTab
        chengeTabDisableds={chengeTabDisableds}
        chengeScrMem0003Data={chengeScrMem0003Data}
        scrMem0003Data={scrMem0003Data}
      />
      <ScrMem0003CreditTab
        chengeTabDisableds={chengeTabDisableds}
        chengeScrMem0003Data={chengeScrMem0003Data}
        scrMem0003Data={scrMem0003Data}
      />
      <ScrMem0003CreditLimitTab
        chengeScrMem0003Data={chengeScrMem0003Data}
        scrMem0003Data={scrMem0003Data}
      />
      <ScrMem0003ContractTab
        chengeScrMem0003Data={chengeScrMem0003Data}
        scrMem0003Data={scrMem0003Data}
      />
      <ScrMem0003BaseTab />
      <ScrMem0003DealHistoryTab />
      <ScrMem0003BranchNumberTab />
      <ScrMem0003ChangeHistoryTab />
    </Tabs>
  );
};

export default ScrMem0003Page;

