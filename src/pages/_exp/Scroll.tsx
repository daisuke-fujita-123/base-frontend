import React, { useContext, useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { MainLayout } from 'layouts/MainLayout';
import { Section, SectionClose } from 'layouts/Section';
import { ColStack, RightElementStack, RowStack, Stack } from 'layouts/Stack';

import {
  AddButton,
  Button,
  PrimaryButton,
  SearchButton,
} from 'controls/Button';
import { DataGrid, GridColDef, GridTooltipsModel } from 'controls/Datagrid';
import { DatePicker } from 'controls/DatePicker';
import { ContentsDivider } from 'controls/Divider';
import { CaptionLabel, WarningLabel } from 'controls/Label';
import { Select, SelectValue } from 'controls/Select';
import { TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import { useForm } from 'hooks/useForm';
import { useNavigate } from 'hooks/useNavigate';

import { _expApiClient } from 'providers/ApiClient';
import { AppContext } from 'providers/AppContextProvider';

import { useGridApiRef } from '@mui/x-data-grid-pro';

/**
 * 検索条件データモデル
 */
interface SearchConditionModel {
  country: string;
  state: string;
  city: string;
  street: string;

  string1: string;
  string2: string;
  string3: string;
  string4: string;
  string5: string;
  string6: string;
  string7: string;
  string8: string;
  string9: string;
  string10: string;
  string11: string;

  number1: number;
  number2: number;
  number3: number;

  date1: string;
  date2: string;
  date3: string;
  radio1: string;
  radio2: number;
  select1?: string;
  select2?: number;
  check1: boolean;
  check2: boolean;
  file?: File;
}

/**
 * プルダウンデータモデル
 */
interface SelectValuesModel {
  countries: SelectValue[];
  states: SelectValue[];
  cities: SelectValue[];
  streets: SelectValue[];
}

/**
 * 検索条件初期データ
 */
const searchConditionInitialValues: SearchConditionModel = {
  country: '',
  state: '',
  city: '',
  street: '',

  string1: '',
  string2: '123456',
  string3: '1234,',
  string4: '1234.',
  string5: '2020/01/01',
  string6: '12:34:56',
  string7: '2020/01/01 12:34:56',
  string8: '1234',
  string9: '-1',
  string10: '0',
  string11: '1234-12346789',

  number1: 1234,
  number2: -1,
  number3: 0,

  date1: '',
  date2: '2020/01/01',
  date3: '2020/01/01',
  radio1: '1',
  radio2: 1,
  select1: '1',
  select2: 1,
  check1: false,
  check2: false,
  file: undefined,
};

/**
 * 検索条件バリデーションスキーマ
 */
const searchConditionSchema = {
  country: yup.string().label('国'),
  state: yup.string().label('都道府県'),
  city: yup.string().label('市町村区'),
  street: yup.string().label('番地'),

  string1: yup.string().required().label('ストリング1'),
  string2: yup.string().max(5).label('ストリング2'),
  string3: yup.string().number().label('ストリング3'),
  string4: yup.string().numberWithComma().label('ストリング4'),
  string5: yup.string().date().label('ストリング5'),
  string6: yup.string().time().label('ストリング6'),
  string7: yup.string().datetime().label('ストリング7'),
  string8: yup.string().unitOf1000Yen().label('ストリング8'),
  string9: yup.string().positive().label('ストリング9'),
  string10: yup.string().notZero().label('ストリング10'),
  string11: yup.string().phone().label('ストリング11'),

  number1: yup.number().unitOf1000Yen().label('ナンバー1'),
  number2: yup.number().positive().label('ナンバー2'),
  number3: yup.number().notZero().label('ナンバー3'),

  select1: yup.string().required(),
  select2: yup.number().required(),
  file: yup.mixed().required().label('ファイル'),
};

/**
 * 検索条件初期データ
 */
const selectValuesInitialValues: SelectValuesModel = {
  countries: [],
  states: [],
  cities: [],
  streets: [],
};

/**
 * 検索結果列モデル定義
 */
const searchResultColDef: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    cellType: 'link',
  },
  {
    field: 'firstname',
    headerName: 'First Name',
    tooltip: true,
    size: 'm',
  },
  {
    field: 'lastname',
    headerName: 'Last Name',
    size: 'm',
  },
  {
    field: 'input',
    headerName: 'Input',
    cellType: 'input',
    size: 'm',
  },
  {
    field: 'select',
    headerName: 'Select',
    cellType: 'select',
    selectValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
    size: 'm',
  },
  {
    field: 'radio',
    headerName: 'Radio',
    cellType: 'radio',
    radioValues: [
      { value: '1', displayValue: 'one' },
      { value: '2', displayValue: 'two' },
      { value: '3', displayValue: 'three' },
    ],
    size: 'l',
  },
  {
    field: 'checkbox',
    headerName: 'Checkbox',
    cellType: 'checkbox',
    size: 'm',
  },
  {
    field: 'datepicker',
    headerName: 'DatePicker',
    cellType: 'datepicker',
    size: 'l',
  },
];
// [...Array(100)].forEach((_, x) => {
//   searchResultColDef.push({
//     field: 'word' + x,
//     cellType: 'input',
//   });
// });
searchResultColDef.push({
  field: 'last',
  headerName: 'Last',
  tooltip: true,
});

/**
 * ツールチップ定義
 */
const tooltips: GridTooltipsModel[] = [
  {
    field: 'firstname',
    tooltips: [
      { id: '0', text: 'firstname 0' },
      { id: '1', text: 'firstname 1' },
    ],
  },
  {
    field: 'lastname',
    tooltips: [
      { id: '2', text: 'lastname 2' },
      { id: '3', text: 'lastname 3' },
    ],
  },
  {
    field: 'last',
    tooltips: [
      { id: '4', text: 'word10 4' },
      { id: '5', text: 'word10 5' },
    ],
  },
];

/**
 * レスポンスからSelectValues[]への変換
 */
const convertToSelectValues = (response: any[]): SelectValue[] => {
  return response.map((x) => {
    return { value: x.code, displayValue: x.value };
  });
};

/**
 * Scroll
 */
const Scroll = () => {
  // context
  const { showDialog, saveState, loadState } = useContext(AppContext);

  // router
  const navigate = useNavigate();
  const location = useLocation();

  // state
  const [selectValues, setSelectValues] = useState<SelectValuesModel>(
    selectValuesInitialValues
  );
  const [datalist, setDatalist] = useState<any[]>([]);
  const [hrefs, setHrefs] = useState<any[]>([]);

  // form
  const methods = useForm<SearchConditionModel>({
    defaultValues: searchConditionInitialValues,
    context: false,
    resolver: yupResolver(yup.object(searchConditionSchema)),
  });

  // ref
  const apiRef = useGridApiRef();
  const maxSectionWidth =
    Number(
      apiRef.current.rootElementRef?.current?.getBoundingClientRect().width
    ) + 40;

  useEffect(() => {
    const fetch = async () => {
      try {
        const countries = await _expApiClient.get('/_exp/countries');
        const states = await _expApiClient.get('/_exp/states');
        const cities = await _expApiClient.get('/_exp/cities');
        const streets = await _expApiClient.get('/_exp/streets');
        const data = await _expApiClient.get('/_exp/data');
        setSelectValues({
          countries: convertToSelectValues(countries.data),
          states: convertToSelectValues(states.data),
          cities: convertToSelectValues(cities.data),
          streets: convertToSelectValues(streets.data),
        });
        methods.reset({
          ...methods.getValues(),
          ...data.data,
          radio1: '2',
          radio2: 2,
          select1: '2',
          select2: 2,
          check1: true,
          check2: true,
        });
      } catch (error) {
        console.debug(error);
      }
    };
    fetch();
  }, [methods]);

  // Sectionの開閉処理
  const sectionRef = useRef<SectionClose>();

  const handleSeachClick = async () => {
    try {
      const response = await _expApiClient.get('/_exp/datalist');
      const href = response.data.map((x: any) => {
        return {
          id: x.id,
          href: '/mem/corporations/' + x.id,
        };
      });
      const hrefs = [
        {
          field: 'id',
          hrefs: href,
        },
      ];
      setDatalist(response.data);
      setHrefs(hrefs);
    } catch (error) {
      console.error(error);
    }
    if (sectionRef.current && sectionRef.current.closeSection)
      sectionRef.current.closeSection();
  };

  const handleUpdateClick = async () => {
    // apiRef.current.updateRows([{ id: 1 }, { id: 9999 }]);
    await methods.trigger();
    console.log(methods.getValues());
    console.log(datalist);
    if (methods.formState.isValid) {
      console.log('input is valied');
    } else {
      console.log('input is invalied');
    }
  };

  const handleDownloadPdfClick = async () => {
    const response = await _expApiClient.get('/_exp/hello.pdf', {
      responseType: 'blob',
    });
    const downloadUrl = window.URL.createObjectURL(response.data);
    window.open(downloadUrl, '__blank');
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleRowValueChange = (row: any) => {
    console.log(row);
  };

  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  const handleOnBlur = (name: string) => {
    console.log(`handleOnBlur: ${name}`);
  };

  return (
    <MainLayout>
      <MainLayout main>
        <FormProvider {...methods}>
          <Section name='検索条件' isSearch ref={sectionRef}>
            <Typography>search condition</Typography>
            <RowStack>
              <ColStack>
                <TextField label='法人ID' name='corporationId' readonly />
                <TextField
                  label='法人名'
                  name='corporationName'
                  required
                  size='m'
                />
                <TextField
                  label='法人名カナ'
                  name='corporationNameKana'
                  required
                  size='m'
                />
              </ColStack>
              <ColStack>
                <TextField
                  label='市区町村'
                  name='corporationMunicipalities'
                  required
                />
                <TextField
                  label='番地・号・建物名など'
                  name='corporationAddressBuildingName'
                  required
                  size='m'
                />
                <TextField label='TEL' name='corporationPhoneNumber' required />
                <TextField label='FAX' name='corporationFaxNumber' />
                <TextField
                  label='メールアドレス'
                  name='corporationMailAddress'
                  size='m'
                />
              </ColStack>
              <ColStack>
                <TextField
                  label='適格事業者番号'
                  name='eligibleBusinessNumber'
                  readonly
                />
                <TextField
                  label='税事業者区分'
                  name='taxBusinessKind'
                  readonly
                />
                <TextField
                  label='公安委員会'
                  name='publicSafetyCommittee'
                  required
                />
                <TextField
                  label='古物商許可番号'
                  name='antiqueBusinessLicenseNumber'
                  required
                />
                <DatePicker label='交付年月日' name='issuanceDate' withWareki />
                <TextField label='古物名義' name='antiqueName' />
              </ColStack>
            </RowStack>
            <ContentsDivider />
            <CenterBox>
              <SearchButton onClick={handleSeachClick}>検索</SearchButton>
              <Button onClick={handleUpdateClick}>更新</Button>
            </CenterBox>
          </Section>
        </FormProvider>
        <Section
          name='検索結果'
          width={maxSectionWidth}
          decoration={
            <>
              <AddButton
                onClick={() => {
                  console.log('');
                }}
              >
                追加
              </AddButton>
              <AddButton
                onClick={() => {
                  console.log('');
                }}
              >
                一括登録
              </AddButton>
              <AddButton
                onClick={() => {
                  console.log('');
                }}
              >
                帳票出力
              </AddButton>
              <AddButton
                onClick={() => {
                  console.log('');
                }}
              >
                CSV出力
              </AddButton>
            </>
          }
        >
          <Typography>search result</Typography>
          <DataGrid
            columns={searchResultColDef}
            rows={datalist}
            hrefs={hrefs}
            tooltips={tooltips}
            headerRow={datalist.slice(0, 1)[0]}
            // height={1000}
            // width={'100%'}
            pagination
            // initialState={{
            //   pinnedColumns: {
            //     left: ['id'],
            //   },
            // }}
            // checkboxSelection
            onRowValueChange={handleRowValueChange}
            onLinkClick={handleLinkClick}
            // onRowSelectionModelChange={(rowSelectionModel, details) => {
            //   console.log(rowSelectionModel);
            //   console.log(details);
            // }}
            // getRowClassName={(params) => {
            //   return 'hot';
            // }}
            // getCellClassName={(params) => {
            //   return 'cold';
            // }}
            getCellDisabled={(params) => {
              if (params.field === 'input' && params.id === 0) return true;
              if (params.field === 'select' && params.id === 1) return true;
              if (params.field === 'radio' && params.id === 2) return true;
              if (params.field === 'checkbox' && params.id === 3) return true;
              if (params.field === 'datepicker' && params.id === 4) return true;
              return false;
            }}
            apiRef={apiRef}
          />
        </Section>
        <Section name='その他'>
          <Button onClick={handleDownloadPdfClick} variant='text'>
            Download PDF
          </Button>
        </Section>
      </MainLayout>
      {/* right */}
      <MainLayout right>
        <FormProvider {...methods}>
          <RowStack>
            <ColStack>
              <RightElementStack>
                <Stack spacing={1}>
                  <CaptionLabel text='変更予約情報' />
                  <WarningLabel text='変更予約あり' />
                  <Select
                    label={'　'}
                    name='changeHistoryNumber'
                    selectValues={[]}
                    blankOption
                  />
                  <PrimaryButton
                    onClick={() => {
                      console.log();
                    }}
                  >
                    表示切替
                  </PrimaryButton>
                </Stack>
                <MarginBox mb={6} mt={4}>
                  <DatePicker label='変更予定日' name='changeHistoryDate' />
                </MarginBox>
              </RightElementStack>
            </ColStack>
          </RowStack>
        </FormProvider>
      </MainLayout>
    </MainLayout>
  );
};

export default Scroll;
