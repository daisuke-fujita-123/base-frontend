import React from 'react';
import { FormProvider } from 'react-hook-form';

import { BlankLayout } from 'layouts/InputLayout';
import { MainLayout } from 'layouts/MainLayout';
import { Section } from 'layouts/Section';
import { ControlsStackItem, RowStack } from 'layouts/Stack';

import { Checkbox } from 'controls/Checkbox';
import { DatePicker } from 'controls/DatePicker';
import { Divider } from 'controls/Divider';
import { Radio } from 'controls/Radio';
import { AddbleSelect, Select } from 'controls/Select';
import { Textarea } from 'controls/Textarea';
import { TextField } from 'controls/TextField';
import { Typography } from 'controls/Typography';

import { useForm } from 'hooks/useForm';

import { Box as MuiBox, Stack as MuiStack } from '@mui/material';

/**
 * Layouts
 */
const Layouts = () => {
  const methods = useForm({
    defaultValues: {
      _: '',
    },
  });

  return (
    <MainLayout>
      <MainLayout main>
        <FormProvider {...methods}>
          {/* MUI 垂直スタック 逆N字 */}
          <Section name='MUI 垂直スタック 逆N字'>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='01' name='_' />
                <TextField label='02' name='_' />
                <TextField label='03' name='_' />
                <TextField label='04' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='05' name='_' />
                <TextField label='06' name='_' />
                <TextField label='07' name='_' />
                <TextField label='08' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='09' name='_' />
                <TextField label='10' name='_' />
                <TextField label='11' name='_' />
                <TextField label='12' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='13' name='_' />
                <TextField label='14' name='_' />
                <TextField label='15' name='_' />
                <TextField label='16' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='17' name='_' />
                <TextField label='18' name='_' />
                <TextField label='19' name='_' />
                <TextField label='20' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='21' name='_' />
                <TextField label='22' name='_' />
                <TextField label='23' name='_' />
                <TextField label='24' name='_' />
              </MuiStack>
            </MuiStack>
          </Section>
          {/* MUI 水平スタック Z字 */}
          <Section name='MUI 水平スタック Z字'>
            <MuiStack direction='row' spacing={8}>
              <TextField label='01' name='_' />
              <TextField label='02' name='_' />
              <TextField label='03' name='_' />
              <TextField label='04' name='_' />
              <TextField label='05' name='_' />
              <TextField label='06' name='_' />
            </MuiStack>
            <MuiStack direction='row' spacing={8}>
              <TextField label='07' name='_' />
              <TextField label='08' name='_' />
              <TextField label='09' name='_' />
              <TextField label='10' name='_' />
              <TextField label='11' name='_' />
              <TextField label='12' name='_' />
            </MuiStack>
            <MuiStack direction='row' spacing={8}>
              <TextField label='13' name='_' />
              <TextField label='14' name='_' />
              <TextField label='15' name='_' />
              <TextField label='16' name='_' />
              <TextField label='17' name='_' />
              <TextField label='18' name='_' />
            </MuiStack>
            <MuiStack direction='row' spacing={8}>
              <TextField label='19' name='_' />
              <TextField label='20' name='_' />
              <TextField label='21' name='_' />
              <TextField label='22' name='_' />
              <TextField label='23' name='_' />
              <TextField label='24' name='_' />
            </MuiStack>
          </Section>

          <Divider />

          {/* 法人情報一覧 > 法人情報詳細 */}
          <Typography>法人情報一覧 &gt; 法人情報詳細</Typography>
          {/* 法人情報一覧 > 法人情報詳細 > 基本情報 */}
          <Section name='基本情報'>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='法人ID' name='_' />
                <TextField label='法人名' name='_' />
                <TextField label='法人名カナ' name='_' />
                <AddbleSelect
                  label='法人グループ名'
                  name='_'
                  selectValues={[]}
                />
                <Select label='Gold/Silver会員' name='_' selectValues={[]} />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='郵便番号' name='_' />
                <Select label='都道府県' name='_' selectValues={[]} />
                <TextField label='市区町村' name='_' />
                <TextField label='番地・号・建物名など' name='_' />
                <TextField label='TEL' name='_' />
                <TextField label='FAX' name='_' />
                <TextField label='メールアドレス' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='連絡事業者番号' name='_' />
                <TextField label='税事業者区分' name='_' />
                <TextField label='公安委員会' name='_' />
                <TextField label='古物商許可番号' name='_' />
                <DatePicker label='交付年月日' name='_' />
                <TextField label='古物名義' name='_' />
              </MuiStack>
            </MuiStack>
          </Section>
          {/* 法人情報一覧 > 法人基本詳細 > 会員メモ情報 */}
          <Section name='会員メモ情報'>
            <Textarea name='memo' maxRows={30} />
          </Section>
          {/* 法人情報一覧 > 法人基本詳細 > 代表者情報 */}
          <Section name='代表者情報'>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='代表者名' name='_' />
                <TextField label='代表者名カナ' name='_' />
                <Radio
                  label='性別'
                  name='_'
                  radioValues={[
                    { value: 'male', displayValue: '男' },
                    { value: 'female', displayValue: '女' },
                  ]}
                />
                <DatePicker label='生年月日' name='_' />
                <Select label='所有資産' name='_' selectValues={[]} />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='郵便番号' name='_' />
                <TextField label='都道府県' name='_' />
                <TextField label='市区町村' name='_' />
                <TextField label='番地・号・建物名など' name='_' />
                <TextField label='TEL' name='_' />
                <TextField label='FAX' name='_' />
                <TextField label='携帯番号' name='_' />
              </MuiStack>
            </MuiStack>
          </Section>
          {/* 法人情報一覧 > 法人基本詳細 > 連帯保証人① */}
          <Section name='連帯保証人①'>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='連帯保証人名' name='_' />
                <TextField label='連帯保証人名カナ' name='_' />
                <Radio
                  label='性別'
                  name='_'
                  radioValues={[
                    { value: 'male', displayValue: '男' },
                    { value: 'female', displayValue: '女' },
                  ]}
                />
                <DatePicker label='生年月日' name='_' />
                <Select label='所有資産' name='_' selectValues={[]} />
                <TextField label='代表者との続柄' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='郵便番号' name='_' />
                <TextField label='都道府県' name='_' />
                <TextField label='市区町村' name='_' />
                <TextField label='番地・号・建物名など' name='_' />
                <TextField label='TEL' name='_' />
                <TextField label='FAX' name='_' />
                <TextField label='携帯番号' name='_' />
              </MuiStack>
            </MuiStack>
          </Section>
          {/* 法人情報一覧 > 法人基本詳細 > 連帯保証人① */}
          <Section name='連帯保証人①'>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='連帯保証人名' name='_' />
                <TextField label='連帯保証人名カナ' name='_' />
                <Radio
                  label='性別'
                  name='_'
                  radioValues={[
                    { value: 'male', displayValue: '男' },
                    { value: 'female', displayValue: '女' },
                  ]}
                />
                <DatePicker label='生年月日' name='_' />
                <Select label='所有資産' name='_' selectValues={[]} />
                <TextField label='代表者との続柄' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='郵便番号' name='_' />
                <TextField label='都道府県' name='_' />
                <TextField label='市区町村' name='_' />
                <TextField label='番地・号・建物名など' name='_' />
                <TextField label='TEL' name='_' />
                <TextField label='FAX' name='_' />
                <TextField label='携帯番号' name='_' />
              </MuiStack>
            </MuiStack>
          </Section>

          <Divider />

          {/* 書類情報一覧 > 書類情報詳細 */}
          <Typography>法人情報一覧 &gt; 法人情報詳細</Typography>
          <MuiStack direction='row' spacing={4}>
            <MuiBox>
              {/* 書類情報一覧 > 書類情報詳細 > オークション基本情報 */}
              <Section name='オークション基本情報'>
                <MuiStack direction='row' spacing={6}>
                  <MuiStack spacing={4}>
                    <TextField label='オークション種類' name='_' />
                    <TextField label='オークション回数' name='_' />
                    <TextField label='出品番号' name='_' />
                    <TextField label='会場（おまとめ）' name='_' />
                  </MuiStack>
                  <MuiStack spacing={4}>
                    <TextField label='オークション開催日' name='_' />
                    <BlankLayout />
                    <BlankLayout />
                    <Checkbox name='_' label='キャンセルフラグ1' />
                  </MuiStack>
                </MuiStack>
              </Section>
            </MuiBox>
            <MuiBox>
              {/* 書類情報一覧 > 書類情報詳細 > 車両情報 */}
              <Section name='車両情報'>
                <MuiStack direction='row' spacing={6}>
                  <MuiStack spacing={4}>
                    <TextField label='車名' name='_' />
                    <TextField label='車検日' name='_' />
                    <Select
                      label='おまとめ車両パターン'
                      name='_'
                      selectValues={[]}
                    />
                    <TextField label='色' name='_' />
                  </MuiStack>
                  <MuiStack spacing={4}>
                    <TextField label='検付区分' name='_' />
                    <TextField label='支払延長車両' name='_' />
                    <TextField label='年式' name='_' />
                    <TextField label='排気量' name='_' />
                  </MuiStack>
                  <MuiStack spacing={4}>
                    <TextField label='陸自コード' name='_' />
                    <Select
                      label='車台番号（四輪）/フレームNo（二輪）'
                      name='_'
                      selectValues={[]}
                    />
                    <TextField label='書類有無' name='_' />
                    <TextField label='登録番号' name='_' />
                  </MuiStack>
                  <MuiStack spacing={4}>
                    <TextField label='車歴' name='_' />
                    <TextField label='先取種別' name='_' />
                    <TextField label='8No' name='_' />
                    <TextField label='引取予定日' name='_' />
                  </MuiStack>
                </MuiStack>
              </Section>
            </MuiBox>
          </MuiStack>
          {/* 書類情報一覧 > 書類情報詳細 > 出品店・落札店情報 */}
          <Section name='出品店・落札店情報'>
            <Typography>出品店</Typography>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='出品店契約ID' name='_' />
                <TextField label='出品店地区' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='出品店名' name='_' />
                <TextField label='出品店電話番号' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='支払延長利用有無' name='_' />
                <TextField label='出品店FAX番号' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='参加区分' name='_' />
                <TextField label='出品店クレーム担当' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <DatePicker label='会場書類発送日' name='_' />
                <TextField label='出品点会員メモ有無' name='_' />
              </MuiStack>
            </MuiStack>
            <Divider />
            <Typography>落札店</Typography>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='落札店契約ID' name='_' />
                <TextField label='落札店地区' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='落札店名' name='_' />
                <TextField label='落札店電話番号' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='支払延長利用有無' name='_' />
                <TextField label='落札店FAX番号' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='参加区分' name='_' />
                <TextField label='落札店クレーム担当' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='出品点会員メモ有無' name='_' />
              </MuiStack>
            </MuiStack>
          </Section>
          {/* 書類情報一覧 > 書類情報詳細 > 書類受付情報 */}
          <Section name='書類受付情報'>
            <Typography>必須書類</Typography>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='車検証・抹消謄本・返納証証' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='自賠責' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='リサイクル' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='印鑑証明' />
                <DatePicker label='有効期限' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='委任状' />
                <DatePicker label='有効期限' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='譲渡証' />
              </MuiStack>
            </MuiStack>
            <Divider />
            <Typography>任意書類</Typography>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='車検シール' />
                <Checkbox name='_' label='自賠責承認請求書' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='謄本・抄本・附票' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='住民票' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='所有者承諾書' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='申請依頼書・OCR' />
              </MuiStack>
              <MuiStack spacing={4}>
                <Checkbox name='_' label='納税証明書' />
              </MuiStack>
            </MuiStack>
          </Section>

          <Divider />

          {/* 車両伝票一覧 > 車両伝票詳細 */}
          <Typography>車両伝票一覧 &gt; 車両伝票詳細</Typography>
          {/* 車両伝票一覧 > 車両伝票詳細 > 車両検索 */}
          <Section name='車両検索'>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='開催日' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='会場名' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='開催回数' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='出品番号' name='_' />
              </MuiStack>
            </MuiStack>
          </Section>
          {/* 車両伝票一覧 > 車両伝票詳細 > オークション結果 */}
          <Section name='オークション結果'>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='開催日' name='_' />
                <TextField label='出品店法人ID' name='_' />
                <TextField label='落札店契約ID' name='_' />
                <TextField label='コーナー' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='車名' name='_' />
                <TextField label='出品店法人ID/法人名' name='_' />
                <TextField label='落札店法人ID/法人名' name='_' />
                <TextField label='評価点' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='車台番号' name='_' />
                <TextField label='検査員ID/検査員名' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='入金状況' name='_' />
                <TextField label='出品店請求先ID' name='_' />
                <TextField label='落札店請求先ID' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='イベント' name='_' />
              </MuiStack>
            </MuiStack>
          </Section>
          {/* 車両伝票一覧 > 車両伝票詳細 > 基本情報入力 */}
          <Section name='基本情報入力'>
            <MuiStack direction='row' spacing={8}>
              <MuiStack spacing={4}>
                <TextField label='取引府ループID' name='_' />
                <TextField label='計算書計上種別' name='_' />
                <TextField label='計算書計上日' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='伝票番号' name='_' />
                <TextField label='入力日' name='_' />
                <TextField label='会計処理日' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='訂正伝票番号' name='_' />
                <TextField label='入力者ID/入力者名' name='_' />
                <TextField label='計上依頼者ID/計上依頼者名' name='_' />
              </MuiStack>
              <MuiStack spacing={4}>
                <TextField label='作成区分' name='_' />
                <TextField label='入力部署コード/入力部署名' name='_' />
                <TextField label='計上部署コード/計上部署名' name='_' />
              </MuiStack>
            </MuiStack>
          </Section>

          <Divider />

          {/* 車両伝票一覧 > 車両伝票詳細 > オークション結果 */}
          <Section name='車両伝票一覧 > 車両伝票詳細 > オークション結果'>
            <RowStack>
              <ControlsStackItem>
                <TextField label='開催日' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='社名' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='車台番号' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='入金状況' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='出品店規約ID' name='_' />
              </ControlsStackItem>
            </RowStack>
            <RowStack>
              <ControlsStackItem size='m'>
                <TextField label='出品店法人ID/法人名' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='イベント' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='コーナー' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='評価点' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='検査員ID/検査員名' name='_' />
              </ControlsStackItem>
            </RowStack>
            <RowStack>
              <ControlsStackItem>
                <TextField label='落札店契約ID' name='_' />
              </ControlsStackItem>
              <ControlsStackItem size='m'>
                <TextField label='落札店法人ID/法人名' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='落札店請求先ID' name='_' />
              </ControlsStackItem>
            </RowStack>
            <RowStack>
              <ControlsStackItem>
                <TextField label='落札店契約ID' name='_' />
              </ControlsStackItem>
              <ControlsStackItem size='m'>
                <TextField label='落札店法人ID/法人名' name='_' />
              </ControlsStackItem>
              <ControlsStackItem>
                <TextField label='落札店請求先ID' name='_' />
              </ControlsStackItem>
            </RowStack>
          </Section>
          {/*  */}
        </FormProvider>
      </MainLayout>
    </MainLayout>
  );
};

export default Layouts;
