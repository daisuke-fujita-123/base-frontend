/**
 * セルタイプ行データ
 */
export const CELL_TYPE_DATASET = [
  {
    id: 0,
    input: 'input 1',
    select: '1',
    radio: '1',
    checkbox: true,
    datepicker: '2020/01/01',
  },
  {
    id: 1,
    input: 'input 2',
    select: '1',
    radio: '1',
    checkbox: false,
    datepicker: '2020/01/02',
  },
  {
    id: 2,
    input: 'input 3',
    select: '2',
    radio: '2',
    checkbox: false,
    datepicker: '2020/01/03',
  },
  {
    id: 3,
    input: 'input 4',
    select: '3',
    radio: '3',
    checkbox: true,
    datepicker: '2020/01/04',
  },
];

/**
 * 帳票一覧行データ
 */
export const CHOHYO_DATASEAT = [
  {
    id: 0,
    chohyoId: 'REP-TRA-0010',
    chohyoMei: 'おまとめ支払延長サービス明細書',
    shutsuryokuKeishiki: 'PDF',
    commentHenshuKahi: '可',
    henkoYoyaku: '',
    shutsuryokuMotoKino: 'バッチ出力',
  },
  {
    id: 1,
    chohyoId: 'REP-TRA-0011',
    chohyoMei: '会員請求対象リスト',
    shutsuryokuKeishiki: 'CSV',
    commentHenshuKahi: '',
    henkoYoyaku: '',
    shutsuryokuMotoKino: '会費請求一覧画面,バッチ出力',
  },
  {
    id: 2,
    chohyoId: 'REP-TRA-0012',
    chohyoMei: '代行請求慮',
    shutsuryokuKeishiki: 'PDF',
    commentHenshuKahi: '可',
    henkoYoyaku: '',
    shutsuryokuMotoKino: '請求書詳細画面,バッチ出力',
  },
  {
    id: 3,
    chohyoId: 'REP-TRA-0013',
    chohyoMei: '請求書',
    shutsuryokuKeishiki: 'PDF',
    commentHenshuKahi: '可',
    henkoYoyaku: '',
    shutsuryokuMotoKino: 'バッチ出力',
  },
  {
    id: 4,
    chohyoId: 'REP-TRA-0014',
    chohyoMei: '集金代行引落結果',
    shutsuryokuKeishiki: 'CSV',
    commentHenshuKahi: '',
    henkoYoyaku: '',
    shutsuryokuMotoKino: '会費請求一覧画面',
  },
  {
    id: 5,
    chohyoId: 'REP-TRA-0015',
    chohyoMei: 'さきどり成約明細書',
    shutsuryokuKeishiki: 'PDF',
    commentHenshuKahi: '可',
    henkoYoyaku: '',
    shutsuryokuMotoKino: 'バッチ出力',
  },
  {
    id: 6,
    chohyoId: 'REP-TRA-0016',
    chohyoMei: '日計表',
    shutsuryokuKeishiki: 'CSV',
    commentHenshuKahi: '',
    henkoYoyaku: '',
    shutsuryokuMotoKino: '仕訳一覧画面',
  },
  {
    id: 7,
    chohyoId: 'REP-TRA-0017',
    chohyoMei: '入金督促状',
    shutsuryokuKeishiki: 'PDF',
    commentHenshuKahi: '可',
    henkoYoyaku: '',
    shutsuryokuMotoKino: 'バッチ出力',
  },
  {
    id: 8,
    chohyoId: 'REP-TRA-0018',
    chohyoMei: '債権リスト',
    shutsuryokuKeishiki: 'CSV',
    commentHenshuKahi: '',
    henkoYoyaku: '',
    shutsuryokuMotoKino: '債権一覧画面,バッチ出力',
  },
  {
    id: 9,
    chohyoId: 'REP-TRA-0019',
    chohyoMei: '入金相殺履歴リスト',
    shutsuryokuKeishiki: 'CSV',
    commentHenshuKahi: '',
    henkoYoyaku: '',
    shutsuryokuMotoKino: '債権・預り金処理画面,元帳一覧画面',
  },
];

/**
 * 帳票一覧href定義データ
 */
export const CHOHYO_HREFS = [
  {
    field: 'chohyoId',
    hrefs: [
      {
        id: 2,
        href: '/tra/report/rep-tra-0012',
      },
      {
        id: 3,
        href: '/tra/report/rep-tra-0013',
      },
      {
        id: 5,
        href: '/tra/report/rep-tra-0015',
      },
      {
        id: 7,
        href: '/tra/report/rep-tra-0017',
      },
    ],
  },
];

/**
 * 基本値引値増行データ
 */
export const KIHON_NEBIKI_NEMASHI_DATASET = [
  {
    id: 0,
    campaignCode: 'XXXXX',
    campaignName: 'XXXXXXXX',
    kaiinShubetsu: 0,
    kingaku: [0, 1500],
    serviceName: '1',
    ipponmeJogai: true,
    keiyakuHonsu: [5, 10],
    kikanFromToKeiyakuBiKaranoGessu: {
      selection: 0,
      values: [['2022-07-01', '2022-09-30'], ''],
    },
  },
  {
    id: 1,
    campaignCode: 'XXXXX',
    campaignName: 'XXXXXXXX',
    kaiinShubetsu: 1,
    kingaku: [1, 1500],
    serviceName: '1',
    ipponmeJogai: false,
    keiyakuHonsu: [0, 0],
    kikanFromToKeiyakuBiKaranoGessu: {
      selection: 1,
      values: [['', ''], '10'],
    },
  },
  {
    id: 2,
    campaignCode: 'XXXXX',
    campaignName: 'XXXXXXXX',
    kaiinShubetsu: 0,
    kingaku: [0, 1500],
    serviceName: '1',
    ipponmeJogai: false,
    keiyakuHonsu: [20, 20],
    kikanFromToKeiyakuBiKaranoGessu: {
      selection: 0,
      values: [['2022-07-01', '2022-09-30'], ''],
    },
  },
  {
    id: 3,
    campaignCode: '',
    campaignName: '',
    kaiinShubetsu: 0,
    kingaku: [0, 1500],
    serviceName: '1',
    ipponmeJogai: false,
    keiyakuHonsu: [5, 10],
    kikanFromToKeiyakuBiKaranoGessu: {
      selection: 0,
      values: [['', ''], ''],
    },
  },
];

/**
 * 役職情報一覧行データ
 */
export const YAKUSHOKU_DATASET = [
  {
    id: 0,
    yakushokuId: 'XXX',
    yakushokuMei: '営業事業部_管理者',
    shozokuSoshiki: 'eighoJigyoBu',
    gamenKengen: 1,
    masterKengen: 1,
    shoninKengen: 1,
    tekiyoKaishiBi: '2022-10-10',
    tekiyoShuryoBi: '',
  },
  {
    id: 1,
    yakushokuId: 'XXX',
    yakushokuMei: '営業事業部_管理者',
    shozokuSoshiki: 'eighoXxxxBu',
    gamenKengen: 2,
    masterKengen: 2,
    shoninKengen: 2,
    tekiyoKaishiBi: '2022-10-10',
    tekiyoShuryoBi: '2022-12-10',
  },
  {
    id: 2,
    yakushokuId: 'XXX',
    yakushokuMei: '営業事業部_管理者',
    shozokuSoshiki: 'eighoYyyyyoKa',
    gamenKengen: 3,
    masterKengen: 3,
    shoninKengen: 3,
    tekiyoKaishiBi: '2022-10-10',
    tekiyoShuryoBi: '',
  },
  {
    id: 3,
    yakushokuId: 'XXX',
    yakushokuMei: '営業事業部_管理者',
    shozokuSoshiki: 'eighoYyyyyoKa',
    gamenKengen: 1,
    masterKengen: 1,
    shoninKengen: 1,
    tekiyoKaishiBi: '2022-10-10',
    tekiyoShuryoBi: '',
  },
];
