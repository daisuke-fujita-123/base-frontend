import React from 'react';

/**
 * 登録内容確認ポップアップデータモデル
 */
export interface ScrCom0032PopupProps {
  isOpen: boolean;
  data: ScrCom0032PopupModel;
  handleCancel: () => void;
  handleConfirm: () => void;
}

export interface ScrCom0032PopupModel {
  errorMessages: errorMessagesModel[];
  warningMessages: warningMessagesModel[];
  contentsList: {
    screenName: string;
    screenId: string;
    tabName: string;
    tabId: string;
    sectionList: SectionListModel[];
  };
  changeExpectDate: Date;
}

export interface errorMessagesModel {
  errorCode: string;
  errorMessage: string;
}

export interface warningMessagesModel {
  warningCode: string;
  warningMessage: string;
}

export interface SectionListModel {
  sectionName: string;
  columnList: ColumnListModel[];
}

export interface ColumnListModel {
  columnName: string;
}

/**
 * 登録内容確認ポップアップ
 * @returns
 */
const ScrCom00032Popup = (props: ScrCom0032PopupProps) => {
  return (
    <>
    </>
  );
};
export default ScrCom00032Popup;