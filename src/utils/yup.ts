import * as yup from 'yup';

const locale: yup.LocaleObject = {
  mixed: {
    required: '${label}は必須入力です',
  },
  string: {
    max: '${label}は${max}桁以下です',
    email: 'メールアドレス形式です',
  },
  number: {
    max: '${label}は${max}桁以下です',
    positive: '${label}はプラスです',
  },
  date: {},
  boolean: {},
  object: {},
  array: {},
};

yup.setLocale(locale);

declare module 'yup' {
  interface StringSchema {
    // 数字（カンマ無）
    number(this: StringSchema): StringSchema;
    // 数字（カンマ有）
    numberWithComma(this: StringSchema): StringSchema;
    // 数字（半角のみ）
    half(this: StringSchema): StringSchema;
    // 数字（日付）
    date(this: StringSchema): StringSchema;
    // 数字（時刻）
    time(this: StringSchema): StringSchema;
    // 数字（日付/時刻）
    datetime(this: StringSchema): StringSchema;
    // 千円単位表示
    unitOf1000Yen(this: StringSchema): StringSchema;
    // マイナス
    positive(this: StringSchema): StringSchema;
    // ０入力
    notZero(this: StringSchema): StringSchema;
    // 電話番号、FAX
    phone(this: StringSchema): StringSchema;
    // アドレス
    address(this: StringSchema): StringSchema;
  }
  interface NumberSchema {
    // 千円単位表示
    unitOf1000Yen(this: NumberSchema): NumberSchema;
    // ０入力
    notZero(this: NumberSchema): NumberSchema;
  }
}

yup.addMethod(yup.StringSchema, 'number', function () {
  return this.matches(/^[0-9]*$/, {
    message: ({ label }) => `${label}は半角数字です`,
  });
});

yup.addMethod(yup.StringSchema, 'numberWithComma', function () {
  return this.matches(/^[0-9,]*$/, {
    message: ({ label }) => `${label}は半角数字カンマです`,
  });
});

yup.addMethod(yup.StringSchema, 'half', function () {
  return this.matches(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/, {
    message: ({ label }) => `${label}は半角英数字カナ記号です`,
  });
});

yup.addMethod(yup.StringSchema, 'date', function () {
  return this.matches(/^[0-9]*$/, {
    message: ({ label }) => `${label}は日付形式です`,
  });
});

yup.addMethod(yup.StringSchema, 'time', function () {
  return this.matches(/^[0-9]*$/, {
    message: ({ label }) => `${label}は時刻形式です`,
  });
});

yup.addMethod(yup.StringSchema, 'datetime', function () {
  return this.matches(/^[0-9]*$/, {
    message: ({ label }) => `${label}は日付時刻形式です`,
  });
});

yup.addMethod(yup.StringSchema, 'unitOf1000Yen', function () {
  return this.test(
    'unitOf1000Yen',
    ({ label }) => `${label}は千円単位です`,
    (value) => {
      if (!value) return false;
      if (Number(value) < 1000) return false;
      return value.slice(-3) === '000';
    }
  );
});

yup.addMethod(yup.StringSchema, 'positive', function () {
  return this.test(
    'positive',
    ({ label }) => `${label}はプラスです`,
    (value) => {
      if (!value) return false;
      return Number(value) >= 0;
    }
  );
});

yup.addMethod(yup.StringSchema, 'notZero', function () {
  return this.test(
    'notZero',
    ({ label }) => `${label}は０以外です`,
    (value) => {
      if (!value) return false;
      return Number(value) !== 0;
    }
  );
});

yup.addMethod(yup.StringSchema, 'phone', function () {
  return this.matches(/^\d{2,5}-\d{1,4}-\d{4}$/, {
    message: '電話番号形式です',
  });
});

yup.addMethod(yup.NumberSchema, 'unitOf1000Yen', function () {
  return this.test(
    'unitOf1000Yen',
    ({ label }) => `${label}は千円単位です`,
    (value) => {
      if (!value) return false;
      if (value < 1000) return false;
      return String(value).slice(-3) === '000';
    }
  );
});

yup.addMethod(yup.NumberSchema, 'notZero', function () {
  return this.test(
    'notZero',
    ({ label }) => `${label}は０以外です`,
    (value) => {
      if (!value) return false;
      return value !== 0;
    }
  );
});

yup.addMethod(yup.StringSchema, 'address', function () {
  return this.matches(
    /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/,
    {
      message: 'メールアドレス形式で入力してください。',
    }
  );
});

export default yup;

