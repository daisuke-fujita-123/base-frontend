import * as yup from 'yup';

const locale = {
  mixed: {
    required: '必須で入力してください',
  },
  string: {
    max: '${max}桁以内で入力してください。',
  },
};

declare module 'yup' {
  interface StringSchema {
    // 全角＆半角
    fullAndHalfWidth(this: StringSchema): StringSchema;
    // 半角のみ
    halfWidthOnly(this: StringSchema): StringSchema;
    // 半角数字のみ
    numberOnly(this: StringSchema): StringSchema;
    // 金額フォーマット
    formatPrice(this: StringSchema): StringSchema;
    // 電話番号フォーマット
    formatTel(this: StringSchema): StringSchema;
  }
}

yup.addMethod(yup.StringSchema, 'fullAndHalfWidth', function () {
  // 必要な場合は、検査実装
  return this;
});
yup.addMethod(yup.StringSchema, 'halfWidthOnly', function () {
  return this.matches(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/, {
    message: '半角で入力してください。',
  });
});
yup.addMethod(yup.StringSchema, 'numberOnly', function () {
  return this.matches(/^[0-9]*$/, {
    message: '数字で入力してください。',
  });
});
yup.addMethod(yup.StringSchema, 'formatPrice', function () {
  // TODO 電話番号フォーマット要確認
  return this.matches(/^[0-9,]*$/, {
    message: '半角数字・カンマのみで入力してください。',
  });
});
yup.addMethod(yup.StringSchema, 'formatTel', function () {
  // TODO 電話番号フォーマット要確認
  return this.matches(/^[0-9-]*$/, {
    message: '半角数字・ハイフンのみで入力してください。',
  });
});
yup.addMethod(yup.ArraySchema, 'required', function () {
  return this.test('選択項目', '必須で選択してください。', function (value) {
    if (value === null) {
      return false;
    }
    const values: string[] = Object.values(value);
    return values.length > 0;
  });
});
yup.setLocale(locale);

export interface Definition {
  [prop: string]: any;
}

export const fieldValidationDefinition: Definition = {
  basicsCorporationCreditAmount:yup.string().label('基本法人与信額').max(11).formatPrice(),
  corporationCreditRemainingAmount:yup.string().label('法人与信残額').max(11).formatPrice(),
  paymentExtensionCreditAmount:yup.string().label('支払延長与信額').max(11).formatPrice(),
  
  automaticLimitFlag:yup.string().label('自動制限可否'),
  limitStatusKind:yup.string().label('制限状況'),

  logisticsBaseId:yup.string().label('物流拠点ID').max(4).halfWidthOnly(),
  logisticsBaseName: yup.string().label('物流拠点名').max(40).fullAndHalfWidth(),
  logisticsBaseNameKana: yup.string().label('物流拠点名カナ').max(10).halfWidthOnly(),
  usePurpose: yup.array().label('利用目的'),
  logisticsBaseTvaaSalesStaffId:yup.string().label('四輪営業担当'),
  logisticsBaseBikeSalesStaffId:yup.string().label('二輪営業担当'),
  logisticsBasePrefectureCode:yup.string().label('住所（都道府県）'),
  logisticsBaseMunicipalities:yup.string().label('住所（市区町村以降）').max(80).fullAndHalfWidth(),
  regionCode:yup.string().label('地区コード/地区名'),
  logisticsBaseRepresentativeContractId:yup.string().label('物流拠点代表契約ID'),

  businessBaseId:yup.string().label('物流拠点ID').max(4).halfWidthOnly(),
  businessBaseName: yup.string().label('物流拠点名').max(40).fullAndHalfWidth(),
  businessBaseNameKana: yup.string().label('物流拠点名カナ').max(40).halfWidthOnly(),
  businessBaseTvaaSalesStaffId:yup.string().label('四輪営業担当'),
  businessBaseBikeSalesStaffId:yup.string().label('二輪営業担当'),
  businessBasePrefectureCode:yup.string().label('住所（都道府県）'),
  businessBaseMunicipalities:yup.string().label('住所（市区町村以降）').max(80).fullAndHalfWidth(),
  contractId:yup.string().label('契約ID'),
};

export default yup;
