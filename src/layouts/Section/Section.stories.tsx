import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CenterBox } from 'layouts/Box';
import { Section, SectionClose } from 'layouts/Section';
import { RowStack } from 'layouts/Stack';

import { SearchButton } from 'controls/Button';
import { DataGrid, GridColDef } from 'controls/Datagrid';
import { ContentsDivider } from 'controls/Divider';
import { Icon } from 'controls/Icon';
import { TextField } from 'controls/TextField';
import { theme } from 'controls/theme';

import { ThemeProvider } from '@mui/material';
import { GridRowsProp, useGridApiRef } from '@mui/x-data-grid-pro';

export default {
  component: Section,
  parameters: { controls: { expanded: true } },
  argTypes: {
    name: {
      description:
        'Accordionのタイトル名。名前なしで渡すと、アコーディオンなしで背景をグレーにする。',
    },
    children: {
      description: 'Accordion内で表示する要素',
    },
    decoration: {
      description:
        'アコーディオンの右端で要素を表示したい場合に指定する。(例：共通管理>商品管理>コース詳細画面の基本情報タブのサービス一覧のアコーディオン',
    },
    ref: {
      description:
        '検索ボタン押下時にSectionが閉じる動作が必要なパーツに使用※useRefと併せて使用',
    },
    width: {
      description:
        'DataGridなど、Section幅が規定より大きくなる場合に使用※useGridApiRefと併せて使用',
    },
    openable: {
      description: '開閉可能なSectionを実装する際に使用※デフォルトでtrue',
    },
    isSearch: {
      description: '背景色を検索用に設定',
    },
    isTransparent: {
      description: '背景色を透明に設定',
    },
  },
} as ComponentMeta<typeof Section>;
const exampleOnClickFunction = (event: React.MouseEvent<HTMLElement>) => {
  console.log(event);
};
const decoration = (
  <>
    <Icon iconName='削除' iconType='delete' onClick={exampleOnClickFunction} />
    <Icon iconName='追加' iconType='add' onClick={exampleOnClickFunction} />
  </>
);
export const Index: ComponentStoryObj<typeof Section> = {
  args: {
    name: '取引会計一覧',
    children: <h1>こんにちは</h1>,
    decoration: decoration,
  },
};
export const Example = () => {
  const decoration = (
    <>
      <Icon
        iconName='削除'
        iconType='delete'
        onClick={exampleOnClickFunction}
      />
      <Icon iconName='追加' iconType='add' onClick={exampleOnClickFunction} />
    </>
  );
  // DataGrid
  const columns: GridColDef[] = [
    {
      field: 'corporationId',
      headerName: '法人ID',
    },
    {
      field: 'corporationName',
      headerName: '法人名',
    },
    {
      field: 'corporationGroupName',
      headerName: '法人グループ名',
      size: 'm',
    },
    {
      field: 'representativeName',
      headerName: '代表者名',
      size: 'm',
    },
    {
      field: 'input1',
      cellType: 'input',
      headerName: 'Input 1',
      required: true,
    },
    {
      field: 'input2',
      cellType: 'input',
      headerName: 'Input 2',
    },
    {
      field: 'select',
      cellType: 'select',
      headerName: 'Select',
      selectValues: [
        { value: '1', displayValue: 'one' },
        { value: '2', displayValue: 'two' },
        { value: '3', displayValue: 'three' },
      ],
    },
    {
      field: 'radio',
      cellType: 'radio',
      headerName: 'Radio',
      radioValues: [
        { value: '1', displayValue: 'one' },
        { value: '2', displayValue: 'two' },
        { value: '3', displayValue: 'three' },
      ],
      size: 'l',
    },
    {
      field: 'checkbox',
      cellType: 'checkbox',
      headerName: 'Checkbox',
    },
    {
      field: 'datepicker',
      cellType: 'datepicker',
      headerName: 'DatePicker',
      size: 'l',
    },

    {
      field: 'fromto',
      cellType: 'fromto',
      headerName: 'FromTo',
      width: 500,
    },
  ];
  const rows: GridRowsProp = [
    {
      id: 0,
      corporationId: '0001',
      corporationName: '法人1',
      corporationGroupName: '法人グループ1',
      representativeName: '代表者1',
      input1: 'Input 1',
      input2: 'Input 2',
      select: '1',
      radio: '1',
      checkbox: true,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
    {
      id: 1,
      corporationId: '0002',
      corporationName: '法人2',
      corporationGroupName: '法人グループ2',
      representativeName: '代表者2',
      input1: undefined,
      input2: 'Input 2',
      select: '1',
      radio: '1',
      checkbox: true,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
    {
      id: 2,
      corporationId: '0003',
      corporationName: '法人3',
      corporationGroupName: '法人グループ3',
      representativeName: '代表者3',
      input1: 'Input 1',
      input2: 'Input 2',
      select: undefined,
      radio: '1',
      checkbox: true,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
    {
      id: 3,
      corporationId: '0004',
      corporationName: '法人4',
      corporationGroupName: '法人グループ4',
      representativeName: '代表者4',
      input1: 'Input 1',
      input2: 'Input 2',
      select: '1',
      radio: undefined,
      checkbox: true,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
    {
      id: 4,
      corporationId: '0005',
      corporationName: '法人5',
      corporationGroupName: '法人グループ5',
      representativeName: '代表者5',
      input1: 'Input 1',
      input2: 'Input 2',
      select: '1',
      radio: '1',
      checkbox: undefined,
      datepicker: '2020/01/01',
      fromto: ['2020/01/02', '2020/01/03'],
    },
  ];

  const methods = useForm({
    defaultValues: { _: '' },
    context: false,
  });

  // Sectionの開閉処理
  const sectionRef = useRef<SectionClose>();
  const handleSeachClick = () => {
    if (sectionRef.current && sectionRef.current.closeSection)
      sectionRef.current.closeSection();
  };

  const apiRef = useGridApiRef();
  // ページ内で使用する際は、以下の変数でも動きます。
  // const maxSectionWidth =
  //   Number(
  //     apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
  //   ) + 40;

  const [maxSectionWidth, setMaxSectionWidth] = useState<number>(0);

  useEffect(() => {
    setMaxSectionWidth(
      Number(
        apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
      ) + 40
    );
  }, [apiRef, apiRef.current.rootElementRef]);

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <Section name='取引会計一覧' decoration={decoration}>
          <ul>
            <li>マスタ一覧</li>
            <li>ワークリスト</li>
            <li>帳票管理</li>
          </ul>
        </Section>
        <Section name='検索条件' isSearch ref={sectionRef}>
          <RowStack>
            <TextField label='A' name='_' required />
            <TextField label='B' name='_' required />
            <TextField label='C' name='_' />
          </RowStack>
          <ContentsDivider />
          <CenterBox>
            <SearchButton onClick={handleSeachClick}>検索</SearchButton>
          </CenterBox>
        </Section>
        <Section name='検索結果' width={maxSectionWidth}>
          <DataGrid columns={columns} rows={rows} apiRef={apiRef} />
        </Section>
      </FormProvider>
    </ThemeProvider>
  );
};

