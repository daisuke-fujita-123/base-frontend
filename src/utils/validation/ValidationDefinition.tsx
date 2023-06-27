import * as yup from 'yup';

const locale = {
    mixed: {
        required: '必須で入力してください',
    },
    string: {
        max: '${max}桁以内で入力してください。',
        email: '${path}はメールアドレス形式である必要があります',
    },
    /*
    mixed: {
      default: '${path}は無効です',
      required: '${path}は必須フィールドです',
      oneOf: '${path}は次の値のいずれかでなければなりません:${values}',
      notOneOf: '${path}は次の値のいずれかであってはなりません:${values}',
      notType: '形式が違います',
    },
    string: {
      length: '${path}は正確に${length}文字でなければなりません',
      min: '${path}は少なくとも${min}文字でなければなりません',
      max: '${path}は最大${max}文字でなければなりません',
      matches: '${path}は次と一致する必要があります: "${regex}"',
      email: '${path}はメールアドレス形式である必要があります',
      url: '${path}は有効なURLでなければなりません',
      trim: '${path}はトリミングされた文字列でなければなりません',
      lowercase: '${path}は小文字の文字列でなければなりません',
      uppercase: '${path}は大文字の文字列でなければなりません',
    },
    number: {
      min: '${path}は${min}以上である必要があります',
      max: '${path}は${max}以下でなければなりません',
      lessThan: '${path}は${less}より小さくなければなりません',
      moreThan: '${path}は${more}より大きくなければなりません',
      notEqual: '${path}は${notEqual}と等しくない必要があります',
      positive: '${path}は正の数でなければなりません',
      negative: '${path}は負の数でなければなりません',
      integer: '${path}は整数でなければなりません',
    },
    date: {
      min: '${path}フィールドは${min}より後でなければなりません',
      max: '${path}フィールドは${max}より前でなければなりません',
    },
    object: {
      noUnknown: '${path}フィールドには,オブジェクトシェイプで指定されていないキーを含めることはできません',
    },
    array: {
      min: '${path}フィールドには少なくとも${min}の項目が必要です',
      max: '${path}フィールドには${max}以下の項目が必要です',
    },
  */
};

declare module 'yup' {
    interface StringSchema {
        // 全角＆半角
        fullAndHalfWidth(this: StringSchema): StringSchema;
        // 半角のみ
        halfWidthOnly(this: StringSchema): StringSchema;
        // 半角数字のみ
        numberOnly(this: StringSchema): StringSchema;
        // 金額形式のみ
        formatMoney(this: StringSchema): StringSchema;
        // 電話番号フォーマット
        formatTel(this: StringSchema): StringSchema;
        // 日付フォーマット：YYYY/MM/DD形式
        formatYmd(this: StringSchema): StringSchema;
        // アドレス
        formatAddress(this: StringSchema): StringSchema
        // 正の整数のみ
        plusNumberOnly(this: StringSchema): StringSchema
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
yup.addMethod(yup.StringSchema, 'formatMoney', function () {
    return this.matches(/^((([1-9]\d*)(,\d{3})*)|0)$/, {
        message: '数字で入力してください。',
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
yup.addMethod(yup.StringSchema, 'formatAddress', function () {
    return this.matches(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/, {
        message: 'メールアドレス形式で入力してください。',
    });
});
yup.setLocale(locale);

export interface Definition {
    [prop: string]: any;
}


export const fieldValidationDefinition: Definition = {
    placeCd: yup.string().label('会場コード').max(2).halfWidthOnly(),
    placeName: yup.string().label('会場名').max(15).fullAndHalfWidth(),
    statementDisplayPlaceName: yup
        .string()
        .label('計算書表示会場名')
        .max(8)
        .fullAndHalfWidth(),
    partnerStartDate: yup
        .string()
        .label('提携開始日（FROM）')
        .formatYmd(),
    sessionWeekKind: yup.array().label('開催曜日'),
    contractId: yup.string().label('契約ID').max(7).halfWidthOnly(),
    corporationId: yup.string().label('法人ID').max(8).halfWidthOnly(),
    corporationName: yup.string().label('法人名').max(30).fullAndHalfWidth(),
    billingId: yup.string().label('請求先ID').max(4).halfWidthOnly(),
    telephoneNumber: yup.string().label('TEL').max(13).halfWidthOnly().formatTel(),
    placeGroupCode: yup.array().label('会場グループ'),
    paymentDestinationPlaceName: yup.array().label('支払先会場名'),
    posPutTogetherPlaceCode: yup.array().label('POSまとめ会場'),
    guaranteeDeposit: yup.string().label('保証金').max(6).numberOnly(),
    documentShippingStaff: yup.string().label('担当者').max(30).fullAndHalfWidth(),
    documentShippingMailAddress: yup.string().label('メールアドレス').max(254).halfWidthOnly().formatAddress(),
    documentShippingFaxNumber: yup.string().label('FAX').max(13).halfWidthOnly(),
    paymentDueDate: yup.string().label('出金期日').max(2).numberOnly(),
    bankName: yup.string().label('銀行名').max(30).fullAndHalfWidth(),
    branchName: yup.string().label('支店名').max(30).fullAndHalfWidth(),
    accountKind: yup.string().label('種別').max(2).fullAndHalfWidth(),
    accountNumber: yup.string().label('口座番号').max(7).halfWidthOnly(),
    accountNameKana: yup.string().label('口座名義').max(40).fullAndHalfWidth(),
    virtualAccountGiveRuleCode: yup.array().label('バーチャル口座付与ルール'),
    paymentNoticeStaff: yup.string().label('担当者').max(30).fullAndHalfWidth(),
    paymentNoticeMailAddress: yup.string().label('メールアドレス').max(254).halfWidthOnly().formatAddress(),
    paymentNoticeFaxNumber: yup.string().label('FAX').max(13).halfWidthOnly().formatTel(),
    receiptSourceBankName: yup.array().label('銀行名'),
    receiptSourceBranchName: yup.array().label('支店名'),
    receiptSourceAccountNameKana: yup.string().label('口座名義').max(40).fullAndHalfWidth(),
    placeMemberManagementStaffMailAddress: yup.string().label('会場会員管理担当メールアドレス').max(254).halfWidthOnly().formatAddress(),
    omatomePlaceContactImpossibleTargetedKind: yup.array().label('おまとめ会場連絡不可対象')
};

export default yup;
