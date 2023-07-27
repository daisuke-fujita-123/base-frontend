import React, { useState } from 'react';

// controls
import { PrimaryButton } from 'controls/Button';
import { Typography } from 'controls/Typography';
// layouts
import { MainLayout } from 'layouts/MainLayout/MainLayout';
import { Stack } from 'layouts/Stack';
// pages
import ScrCom0035Popup from 'pages/com/popups/ScrCom0035Popup';

/**
 * SCR-COM-0035 CSV読込（ポップアップ）
 */
const ScrCom0035PopupTester = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  // 画面ID・タブID
  const screanId = 'SCR-MEM-0001';
  const tabId = undefined;
  // 取込対象選択（一括登録定義）
  const allRegistrationDefinitions = [
    // { id: 'BRG-COM-0001', label: '手数料テーブル詳細' },
    // { id: 'BRG-COM-0002', label: '組織情報' },
    // { id: 'BRG-COM-0003', label: '役職情報' },
    // { id: 'BRG-COM-0004', label: '法人グループマスタ' },
    // { id: 'BRG-COM-0005', label: 'セグメントマスタ' },
    // { id: 'BRG-COM-0006', label: 'メーカーコードマスタ' },
    // { id: 'BRG-COM-0007', label: '登録デポマスタ' },
    // { id: 'BRG-COM-0008', label: '市区郡名称マスタ' },
    // { id: 'BRG-COM-0009', label: '地区コードマスタ' },
    // { id: 'BRG-COM-0010', label: '営業エリアマスタ' },
    // { id: 'BRG-COM-0011', label: '検査員マスタ' },
    // { id: 'BRG-COM-0012', label: '買取店区分マスタ' },
    // { id: 'BRG-COM-0013', label: 'トランスレートテーブル値マスタ' },
    // { id: 'BRG-COM-0014', label: '書類品目マスタ' },
    // { id: 'BRG-COM-0015', label: '表示書類品目マスタ' },
    // { id: 'BRG-COM-0016', label: '備品品目マスタ' },
    // { id: 'BRG-COM-0017', label: '表示備品品目マスタ' },
    // { id: 'BRG-COM-0018', label: '遅延ペナルティ金額マスタ' },
    // { id: 'BRG-COM-0019', label: '陸事コードマスタ' },
    // { id: 'BRG-COM-0020', label: '条件種類マスタ' },
    // { id: 'BRG-COM-0021', label: '承認種類マスタ' },
    // { id: 'BRG-COM-0022', label: '承認条件マスタ' },
    // { id: 'BRG-COM-0023', label: 'バーチャル口座付与ルールマスタ' },
    // { id: 'BRG-COM-0024', label: '都道府県マスタ' },
    // { id: 'BRG-COM-0025', label: '郵便番号マスタ' },
    // { id: 'BRG-COM-0026', label: '消費税マスタ' },
    // { id: 'BRG-COM-0027', label: 'システム状態管理マスタ' },
    // { id: 'BRG-COM-0028', label: 'コード管理マスタ' },
    // { id: 'BRG-COM-0029', label: '二輪検査料マスタ' },
    // { id: 'BRG-COM-0030', label: '一括登録項目定義マスタ' },
    // { id: 'BRG-MEM-0001', label: '休脱会一括登録' },
    // { id: 'BRG-MEM-0002', label: '与信情報一括変更' },
    { id: 'BRG-MEM-0003', label: '会員情報一括登録（会員リスト（基本情報））' },
    { id: 'BRG-MEM-0004', label: '会員情報一括登録（会員リスト（契約情報））' },
    { id: 'BRG-MEM-0005', label: '会員情報一括登録（物流拠点情報）' },
    { id: 'BRG-MEM-0006', label: 'POS番号データアップロード（新規）' },
    { id: 'BRG-MEM-0007', label: 'POS番号データアップロード（おまとめ）' },
    { id: 'BRG-MEM-0008', label: '再開一括登録' },
    { id: 'BRG-MEM-0009', label: '営業・検査員一括登録' },
    // { id: 'BRG-DOC-0001', label: 'ICダウンロードデータ' },
    // { id: 'BRG-TRA-0001', label: '会員売上伝票情報' },
    // { id: 'BRG-TRA-0002', label: '車両伝票情報' },
    // { id: 'BRG-TRA-0003', label: '入金情報（みずほe）' },
    // { id: 'BRG-TRA-0004', label: '入金情報（MUFG）' },
    // { id: 'BRG-TRA-0005', label: '請求リスト' },
    // { id: 'BRG-TRA-0006', label: '請求書情報' },
    // { id: 'BRG-TRA-0019', label: '引落結果情報' },
    // { id: 'BRG-TRA-0007', label: '支払延長手数料マスタ' },
    // { id: 'BRG-TRA-0008', label: 'バーチャル口座マスタ' },
    // { id: 'BRG-TRA-0009', label: '銀行マスタ' },
    // { id: 'BRG-TRA-0010', label: '支店マスタ' },
    // { id: 'BRG-TRA-0011', label: '出金元口座マスタ' },
    // { id: 'BRG-TRA-0012', label: '商品クレームコードマスタ' },
    // { id: 'BRG-TRA-0013', label: '会計データ変換マスタ' },
    // { id: 'BRG-TRA-0014', label: '元帳項目コードマスタ' },
    // { id: 'BRG-TRA-0015', label: '勘定科目コードマスタ' },
    // { id: 'BRG-TRA-0016', label: '部門コードマスタ' },
    // { id: 'BRG-TRA-0017', label: '組織部門紐づけマスタ' },
    // { id: 'BRG-TRA-0018', label: '会計オープン期間マスタ' },
  ];

  const handleAllRegistration = () => {
    setIsOpenPopup(true);
  };

  ////onClick
  return (
    <>
      <MainLayout>
        {/* main */}
        <MainLayout main>
          <h1>SCR-COM-0035 CSV読込ポップアップ動確用クッションページ</h1>
          <Typography>画面ID：{screanId}</Typography>
          <Typography>タブID：{tabId}</Typography>
          <div style={{ whiteSpace: 'break-spaces' }}>
            <Typography>
              取込対象選択：
              {JSON.stringify(allRegistrationDefinitions, null, '\t')}
            </Typography>
          </div>
        </MainLayout>
        <MainLayout bottom>
          <Stack direction='row' alignItems='center'>
            <PrimaryButton onClick={handleAllRegistration}>
              一括登録
            </PrimaryButton>
          </Stack>
        </MainLayout>
      </MainLayout>
      {/* 登録内容確認ポップアップ */}
      <ScrCom0035Popup
        allRegistrationDefinitions={allRegistrationDefinitions}
        screanId={screanId}
        tabId={tabId}
        isOpen={isOpenPopup}
        setIsOpen={setIsOpenPopup}
      />
    </>
  );
};

export default ScrCom0035PopupTester;

