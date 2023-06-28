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
  businessBaseName: yup.string().label('事業拠点名称').max(40).fullAndHalfWidth().required(),
  businessBaseNameKana: yup.string().label('事業拠点名称カナ').max(40).halfWidthOnly().required(),
  businessBaseZipCode: yup.string().label('郵便番号').max(8).halfWidthOnly().required(),
  businessBasePrefectureCode: yup.string().label('都道府県').max(4).fullAndHalfWidth().required(),
  businessBaseMunicipalities: yup.string().label('市区町村').max(40).fullAndHalfWidth().required(),
  businessBaseAddressBuildingName: yup.string().label('番地・号・建物名など').max(40).fullAndHalfWidth().required(),
  businessBasePhoneNumber: yup.string().label('TEL').max(13).formatTel().required(),
  businessBaseStaffName: yup.string().label('担当者').max(30).fullAndHalfWidth(),
  businessBaseStaffContactPhoneNumber: yup.string().label('担当者連絡先').max(13).formatTel(),
  tvaaSalesStaff: yup.string().label('四輪営業担当').max(48).fullAndHalfWidth(),
  bikeSalesStaff: yup.string().label('二輪営業担当').max(48).fullAndHalfWidth(),

};

export default yup;

