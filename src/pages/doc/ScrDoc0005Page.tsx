import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Popup } from 'layouts/Popup';
import { RowStack, Stack } from 'layouts/Stack';
import { StackSection } from 'layouts/StackSection';
import { TabDef, Tabs } from 'layouts/Tabs';

import {
  CancelButton,
  ConfirmButton,
  MailButton,
  OutputButton,
  PrintButton,
} from 'controls/Button';
import { WarningLabel } from 'controls/Label';
import { theme } from 'controls/theme';

import { AuthContext } from 'providers/AuthProvider';

import { ThemeProvider } from '@mui/material/styles';
import ScrDoc0005BasicTab from './tabs/ScrDoc0005BasicTab';
import ScrDoc0005ChangeHistoryTab from './tabs/ScrDoc0005ChangeHistoryTab';
import ScrDoc0005DetailTab from './tabs/ScrDoc0005DetailTab';

/**
 * SCR-DOC-0005 書類情報詳細画面
 */
const ScrDoc0005Page = () => {
  // 書類情報詳細画面用のレイアウト
  theme.typography.fontSize = 12;
  theme.typography.body1.fontSize = 12;
  theme.components = {
    ...theme.components,
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 23,
          minWidth: 30,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 5,
          marginRight: -4,
        },
      },
    },
  };
  // router
  const location = useLocation();
  const { user } = useContext(AuthContext);
  // TODO hashを実際のハッシュ値に変更する
  const tabDefs: TabDef[] = [
    { title: '基本情報', hash: '1' },
    { title: '詳細情報', hash: '2' },
    { title: '変更履歴', hash: '3' },
  ];
  // 書類基本番号取得
  const documentBasicsNumber = location.pathname.substring(
    location.pathname.lastIndexOf('/') + 1
  );

  // 編集権限がない場合
  const isNotEditable = !user.editPossibleScreenIdList.includes('SCR-DOC-0005');

  const [allReadOnly, setAllReadOnly] = useState<boolean>(isNotEditable);
  const isReadOnly = (readOnly: boolean) => {
    setAllReadOnly(readOnly || isNotEditable);
  };

  // TODO POPopenフラグ設定処理でエラー
  // Warning: Cannot update a component (`ScrDoc0005Page`) while rendering a different component (`ScrDoc0005BasicTab`). To locate the bad setState() call inside `ScrDoc0005BasicTab`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render at ScrDoc0005BasicTab

  // 個別通知関連処理
  const [isDoc0007PopOpen, setIsDoc0007PopOpen] = useState<boolean>(false);
  const [isDoc0007Disable, setIsDoc0007Disable] = useState<boolean>(false);
  const mailClick = () => {
    setIsDoc0007PopOpen(!isDoc0007PopOpen);
  };
  const mailAvailable = (available: boolean) => {
    setIsDoc0007Disable(available || isNotEditable);
  };

  // 個別印刷関連処理
  const [isDoc0006PopOpen, setIsDoc0006opOpen] = useState<boolean>(false);
  const [isDoc0006Disable, setIsDoc0006Disable] = useState<boolean>(false);
  const printClick = () => {
    setIsDoc0006opOpen(!isDoc0006PopOpen);
  };
  const printAvailable = (available: boolean) => {
    setIsDoc0006Disable(available || isNotEditable);
  };

  // 帳票出力関連処理
  const [isCom0011PopOpen, setIsCom0011PopOpen] = useState<boolean>(false);
  const [isCom0011Disable, setIsCom0011Disable] = useState<boolean>(false);
  const outputClick = () => {
    setIsCom0011PopOpen(!isCom0011PopOpen);
  };
  const outputAvailable = (available: boolean) => {
    setIsCom0011Disable(available || isNotEditable);
  };

  const buttons = (
    <RowStack spacing={2}>
      <MailButton header onClick={mailClick} disable={isDoc0007Disable}>
        個別通知
      </MailButton>
      <PrintButton header onClick={printClick} disable={isDoc0006Disable}>
        個別印刷
      </PrintButton>
      <OutputButton header onClick={outputClick} disable={isCom0011Disable}>
        帳票出力
      </OutputButton>
      <WarningLabel text='変更予約あり' header></WarningLabel>
    </RowStack>
  );

  return (
    <>
      {/* Contents */}
      <ThemeProvider theme={theme}>
        <Tabs
          tabDef={tabDefs}
          defaultValue={location.hash}
          buttons={buttons}
          isDocDetail
        >
          <ScrDoc0005BasicTab
            mailAvailable={mailAvailable}
            printAvailable={printAvailable}
            outputAvailable={outputAvailable}
            documentBasicsNumber={Number(documentBasicsNumber)}
            isReadOnly={isReadOnly}
            allReadOnly={allReadOnly}
            isNotEditable={isNotEditable}
          />
          <ScrDoc0005DetailTab
            documentBasicsNumber={Number(documentBasicsNumber)}
            allReadOnly={allReadOnly}
          />
          <ScrDoc0005ChangeHistoryTab
            documentBasicsNumber={Number(documentBasicsNumber)}
            allReadOnly={allReadOnly}
          />
        </Tabs>
        {/* TODO:Popup差し替え */}
        {isDoc0007PopOpen && (
          <Popup open={isDoc0007PopOpen}>
            <Popup main>
              <StackSection titles={[{ name: '個別通知' }]}>
                <Stack>
                  <div>・会計処理日はオープン期間内を設定してください</div>
                  <div>・会計処理日はオープン期間内を設定してください</div>
                </Stack>
              </StackSection>
            </Popup>
            <Popup bottom>
              <CancelButton onClick={mailClick}>キャンセル</CancelButton>
              <ConfirmButton onClick={mailClick}>確定</ConfirmButton>
            </Popup>
          </Popup>
        )}
      </ThemeProvider>
    </>
  );
};

export default ScrDoc0005Page;
