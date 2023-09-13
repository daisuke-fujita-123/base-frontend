import * as yup from 'yup';

const locale = {
  mixed: {
    required: '必須で入力してください',
  },
  string: {
    max: '${max}桁以内で入力してください。',
    email: '${path}はメールアドレス形式である必要があります',
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
    // 日付フォーマット：YYYY/MM/DD形式
    formatYmd(this: StringSchema): StringSchema;
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
yup.addMethod(yup.StringSchema, 'formatYmd', function () {
  return this.test(
    '日付項目',
    '正しい日付（YYYY/MM/DD形式）を入力してください。',
    function (value) {
      const date = new Date(value as string);
      return !Number.isNaN(date.getTime());
    }
  );
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

export const fieldValidationDefinition: Definition = {};

export default yup;

