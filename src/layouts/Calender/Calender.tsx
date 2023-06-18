import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Stack } from 'layouts/Stack';

import { Select, SelectValue } from 'controls/Select/Select';
import { CalenderTable } from 'controls/Table/Table';
import { TextField } from 'controls/TextField';

// 実装の流れ
// 1. バックエンドから取得したAPIの情報(apiData)をテーブル表示用に変換する。データ作成ロジック。
//  1-1. transpose関数の引数にapiDataを渡す。
//  1-2. transpose関数内で、週ごとにapiDataをテーブルで表示するためのデータに変換する。個の変換関数は、weeklyCalenderCreaterが行っている。
//  1-3. 1か月分のデータを週ごとにテーブル表示用のデータに変換した値を返り値として返す。
// 2. 作成されたデータをUI上で表現する。UIロジック。テーブルの行ごとに違う形式のデータを表示させないといけないため、条件分岐を行いながら表示をしている。

// 画面幅に対してselectの横幅を変更する必要あり。特にフルHDの画面幅に対しては、違和感ないがPCのサイズの横幅だとこのママの実装だと良くない。
// テーブルの横幅の大きさを調節する必要がある。

export interface CalendarMasterDate {
  date: Date;
  aucRestFlag: boolean;
  bankRestFlag: boolean;
  fourWheelAuctionHoldingFlag: boolean;
  fourWheelAuctionTimes: number;
  twoWheelAuctionHoldingFlag: boolean;
  twoWheelAuctionTimes: number;
  automaticServiceCompleteFlag: boolean;
}

interface createDataProps {
  name: string;
  sunday: string | number;
  monday: string | number;
  tuesday: string | number;
  wednesday: string | number;
  thursday: string | number;
  friday: string | number;
  saturday: string | number;
  [key: string]: string | number;
}
const createData = (
  name: string,
  sunday: string | number,
  monday: string | number,
  tuesday: string | number,
  wednesday: string | number,
  thursday: string | number,
  friday: string | number,
  saturday: string | number
): createDataProps => {
  return {
    name,
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
  };
};

const weekOfDayStr = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const tableCols = [' ', '日', '月', '火', '水', '木', '金', '土'];
const weeklyCalenderCreater = (
  data: CalendarMasterDate[],
  weeksOrder: number
) => {
  // 1週間分のデータをテーブル表示用に変換する。エクセルで言う行と列を入れ替えるような操作を行っている。
  const weeklyDataObj: { [x: string]: CalendarMasterDate } = {};
  data.map((value) => {
    const weekOfDay = weekOfDayStr[value.date.getDay()];
    weeklyDataObj[weekOfDay] = value;
  });
  return [
    createData(
      `第${weeksOrder}週`,
      weeklyDataObj.sunday?.date.getDate(),
      weeklyDataObj.monday?.date.getDate(),
      weeklyDataObj.tuesday?.date.getDate(),
      weeklyDataObj.wednesday?.date.getDate(),
      weeklyDataObj.thursday?.date.getDate(),
      weeklyDataObj.friday?.date.getDate(),
      weeklyDataObj.saturday?.date.getDate()
    ),
    createData(
      'AUC休 / 銀行休',
      `selectRestFlags${weeklyDataObj.sunday?.aucRestFlag}+${weeklyDataObj.sunday?.bankRestFlag} `,
      `selectRestFlags${weeklyDataObj.monday?.aucRestFlag}+${weeklyDataObj.monday?.bankRestFlag} `,
      `selectRestFlags${weeklyDataObj.tuesday?.aucRestFlag}+${weeklyDataObj.tuesday?.bankRestFlag} `,
      `selectRestFlags${weeklyDataObj.wednesday?.aucRestFlag}+${weeklyDataObj.wednesday?.bankRestFlag} `,
      `selectRestFlags${weeklyDataObj.thursday?.aucRestFlag}+${weeklyDataObj.thursday?.bankRestFlag} `,
      `selectRestFlags${weeklyDataObj.friday?.aucRestFlag}+${weeklyDataObj.friday?.bankRestFlag}`,
      `selectRestFlags${weeklyDataObj.saturday?.aucRestFlag}+${weeklyDataObj.saturday?.bankRestFlag} `
    ),
    createData(
      '四輪オークション開催有無',
      `selectFourWeelAucHolding${weeklyDataObj.sunday?.fourWheelAuctionHoldingFlag}`,
      `selectFourWeelAucHolding${weeklyDataObj.monday?.fourWheelAuctionHoldingFlag}`,
      `selectFourWeelAucHolding${weeklyDataObj.tuesday?.fourWheelAuctionHoldingFlag}`,
      `selectFourWeelAucHolding${weeklyDataObj.wednesday?.fourWheelAuctionHoldingFlag}`,
      `selectFourWeelAucHolding${weeklyDataObj.thursday?.fourWheelAuctionHoldingFlag}`,
      `selectFourWeelAucHolding${weeklyDataObj.friday?.fourWheelAuctionHoldingFlag}`,
      `selectFourWeelAucHolding${weeklyDataObj.saturday?.fourWheelAuctionHoldingFlag}`
    ),
    createData(
      '四輪オークション回数',
      `textFourWheelAuctionTimes${weeklyDataObj.sunday?.fourWheelAuctionTimes}`,
      `textFourWheelAuctionTimes${weeklyDataObj.monday?.fourWheelAuctionTimes}`,
      `textFourWheelAuctionTimes${weeklyDataObj.tuesday?.fourWheelAuctionTimes}`,
      `textFourWheelAuctionTimes${weeklyDataObj.wednesday?.fourWheelAuctionTimes}`,
      `textFourWheelAuctionTimes${weeklyDataObj.thursday?.fourWheelAuctionTimes}`,
      `textFourWheelAuctionTimes${weeklyDataObj.friday?.fourWheelAuctionTimes}`,
      `textFourWheelAuctionTimes${weeklyDataObj.saturday?.fourWheelAuctionTimes}`
    ),
    createData(
      '二輪オークション開催有無',
      `selectTwoWeelAucHolding${weeklyDataObj.sunday?.twoWheelAuctionHoldingFlag}`,
      `selectTwoWeelAucHolding${weeklyDataObj.monday?.twoWheelAuctionHoldingFlag}`,
      `selectTwoWeelAucHolding${weeklyDataObj.tuesday?.twoWheelAuctionHoldingFlag}`,
      `selectTwoWeelAucHolding${weeklyDataObj.wednesday?.twoWheelAuctionHoldingFlag}`,
      `selectTwoWeelAucHolding${weeklyDataObj.thursday?.twoWheelAuctionHoldingFlag}`,
      `selectTwoWeelAucHolding${weeklyDataObj.friday?.twoWheelAuctionHoldingFlag}`,
      `selectTwoWeelAucHolding${weeklyDataObj.saturday?.twoWheelAuctionHoldingFlag}`
    ),
    createData(
      '二輪オークション回数',
      `textTwoWheelAuctionTimes${weeklyDataObj.sunday?.twoWheelAuctionTimes}`,
      `textTwoWheelAuctionTimes${weeklyDataObj.monday?.twoWheelAuctionTimes}`,
      `textTwoWheelAuctionTimes${weeklyDataObj.tuesday?.twoWheelAuctionTimes}`,
      `textTwoWheelAuctionTimes${weeklyDataObj.wednesday?.twoWheelAuctionTimes}`,
      `textTwoWheelAuctionTimes${weeklyDataObj.thursday?.twoWheelAuctionTimes}`,
      `textTwoWheelAuctionTimes${weeklyDataObj.friday?.twoWheelAuctionTimes}`,
      `textTwoWheelAuctionTimes${weeklyDataObj.saturday?.twoWheelAuctionTimes}`
    ),
    createData(
      '自動業務完了',
      `selectAutomaticServiceCompleteFlag${weeklyDataObj.sunday?.automaticServiceCompleteFlag}`,
      `selectAutomaticServiceCompleteFlag${weeklyDataObj.monday?.automaticServiceCompleteFlag}`,
      `selectAutomaticServiceCompleteFlag${weeklyDataObj.tuesday?.automaticServiceCompleteFlag}`,
      `selectAutomaticServiceCompleteFlag${weeklyDataObj.wednesday?.automaticServiceCompleteFlag}`,
      `selectAutomaticServiceCompleteFlag${weeklyDataObj.thursday?.automaticServiceCompleteFlag}`,
      `selectAutomaticServiceCompleteFlag${weeklyDataObj.friday?.automaticServiceCompleteFlag}`,
      `selectAutomaticServiceCompleteFlag${weeklyDataObj.saturday?.automaticServiceCompleteFlag}`
    ),
  ];
};

const transpose = (apiData: CalendarMasterDate[]) => {
  const weeklyData: CalendarMasterDate[] = [];
  const transposedMonthlyData = [];
  let weeksOrder = 1;
  apiData.map((value) => {
    weeklyData.push(value);
    // 日曜日の場合
    if (value.date.getDay() === 6) {
      const transposedWeeklyData = weeklyCalenderCreater(
        weeklyData,
        weeksOrder
      );
      transposedMonthlyData.push(transposedWeeklyData);
      weeksOrder++;
      weeklyData.splice(0);
      return;
    }
  });
  // 最終週
  transposedMonthlyData.push(weeklyCalenderCreater(weeklyData, weeksOrder));
  return transposedMonthlyData;
};

const restSelectValues: SelectValue[] = [
  { displayValue: '　', value: 'false' },
  { displayValue: '休', value: 'true' },
];

// 設計書に休催とブランクが両方選択肢に含まれているが、
const auctionHoldingFlagSelectValues: SelectValue[] = [
  { displayValue: '　', value: 'falsetwo' },
  { displayValue: '休催', value: 'false' },
  { displayValue: '開催', value: 'true' },
];

// 画面設計書に記載→「ブランク、手動」から選択可能（オークションが開催の場合、手動がデフォルトになります）
// 自動業務完了を行うかどうかを表すフラグ。
// true：自動業務完了を行う、false：自動業務完了を行わない
// この2つが整合性とれているのか?
const automaticServiceCompleteFlagSelectValues: SelectValue[] = [
  { displayValue: '手動', value: 'true' },
  { displayValue: '', value: 'false' },
];

const findTrueKey = (element: any) => {
  // オブジェクトがわたってくる。
  const fourWheelAuctionHoldingTimespattern = 'fourWheelAuctionTimes';
  const twoWheelAuctionHoldingTimespattern = 'twoWheelAuctionTimes';
  if (element === null || typeof element !== 'object') return null;

  const trueKey = Object.keys(element).find((key) => {
    const isFourWheel = fourWheelAuctionHoldingTimespattern === key;
    const isTwoWheel = twoWheelAuctionHoldingTimespattern === key;
    console.log(key, 'keyの中身');
    if (isFourWheel || isTwoWheel) {
      console.log('Found key:', key);
      return true;
    }

    return false;
  });
  return trueKey;
};

// 全角数値を半角数値に変換
const convertToHalfWidth = (val: string): number => {
  const format = new Intl.NumberFormat('ja-JP', { style: 'decimal' });
  const halfNum = format.format(Number(val));
  return Number(halfNum);
};

export interface CalenderProps {
  apiData: CalendarMasterDate[];
}

export const Calender = ({ apiData }: CalenderProps) => {
  const {
    getValues,
    watch,
    reset,
    formState: { isValidating, dirtyFields },
  } = useFormContext();
  const [prevData, setPrevData] = useState(getValues());

  // 四輪オークション開催有無を変更した時のイベント。
  const watchFourWheelAuctionHoldingFlagSelect = useCallback(
    (changedValue: boolean, dayNumber: number) => {
      // オークション開催有無を"休載"から"開催"に変更した場合
      // 変更にした日の自動業務完了を手動にする。
      // 翌日以降の四輪オークション回数を1カウントアップする。]
      const currentData = getValues('data');
      if (changedValue === true) {
        currentData[dayNumber]['fourWheelAuctionHoldingFlag'] = true;
        currentData[dayNumber]['automaticServiceCompleteFlag'] = true;
        for (
          let startDay = dayNumber + 1;
          startDay < apiData.length;
          startDay++
        ) {
          const currentFourWeelAuctionTimes = Number(
            getValues(`data.${startDay}.fourWheelAuctionTimes`)
          );
          currentData[startDay]['fourWheelAuctionTimes'] =
            currentFourWeelAuctionTimes + 1;
        }
        setPrevData({ data: currentData });
        reset({ data: currentData });
        // 下記をコメントインすると無限ループが発生する。
        // setValue('data', currentData);
        // setValue(`data.${dayNumber}.automaticServiceCompleteFlag`, true);
      } else if (changedValue === false) {
        // オークション開催有無を"開催"から"休載"に変更する場合 →ブランクの選択肢はどうするのか。自動化業務は？とりあえず、falseにする設定にする。要件は書いていない。
        currentData[dayNumber]['fourWheelAuctionHoldingFlag'] = false;
        if (currentData[dayNumber]['twoWheelAuctionHoldingFlag'] === false) {
          currentData[dayNumber]['automaticServiceCompleteFlag'] = false;
        }
        // 翌日以降の四輪オークション回数を1カウントダウンする。
        for (
          let startDay = dayNumber + 1;
          startDay < apiData.length;
          startDay++
        ) {
          const currentFourWeelAuctionTimes = Number(
            getValues(`data.${startDay}.fourWheelAuctionTimes`)
          );
          currentData[startDay]['fourWheelAuctionTimes'] =
            currentFourWeelAuctionTimes - 1;
        }
        setPrevData({ data: currentData });
        reset({ data: currentData });
      }
    },
    [apiData.length, getValues, reset]
  );

  // 二輪オークション開催有無を変更した時のイベント。
  const watchTwoWheelAuctionHoldingFlagSelect = useCallback(
    (changedValue: boolean, dayNumber: number) => {
      // オークション開催有無を"休載"から"開催"に変更した場合
      // 変更にした日の自動業務完了を手動にする。
      // 翌日以降の二輪オークション回数を1カウントアップする。
      const currentData = getValues('data');
      if (changedValue === true) {
        currentData[dayNumber]['twoWheelAuctionHoldingFlag'] = true;
        currentData[dayNumber]['automaticServiceCompleteFlag'] = true;
        for (
          let startDay = dayNumber + 1;
          startDay < apiData.length;
          startDay++
        ) {
          const currentTwoWeelAuctionTimes = Number(
            getValues(`data.${dayNumber}.twoWheelAuctionTimes`)
          );
          currentData[startDay]['twoWheelAuctionTimes'] =
            currentTwoWeelAuctionTimes + 1;
        }
        setPrevData({ data: currentData });
        reset({ data: currentData });
      } else if (changedValue === false) {
        currentData[dayNumber]['twoWheelAuctionHoldingFlag'] = false;
        // オークション開催有無を"開催"から"休載"に変更する場合 →ブランクの選択肢はどうするのか。自動化業務は？とりあえず、falseにする設定にする。要件は書いていない。
        if (currentData[dayNumber]['fourWheelAuctionHoldingFlag'] === false) {
          currentData[dayNumber]['automaticServiceCompleteFlag'] = false;
        }
        // 翌日以降の二輪オークション回数を1カウントダウンする。
        for (
          let startDay = dayNumber + 1;
          startDay < apiData.length;
          startDay++
        ) {
          const currentTwoWeelAuctionTimes = Number(
            getValues(`data.${startDay}.twoWheelAuctionTimes`)
          );
          currentData[startDay]['twoWheelAuctionTimes'] =
            currentTwoWeelAuctionTimes - 1;
        }
        setPrevData({ data: currentData });
        reset({ data: currentData });
      }
    },
    [apiData.length, getValues, reset]
  );
  // 四輪オークション開催回数を変更した時のイベント。
  const watchFourWheelAuctionTimesText = useCallback(
    (currentValue: number, dayNumber: number) => {
      // 入力された四輪オークション回数をもとに、翌日以降の四輪開催オークション回数を1カウントアップする。
      // 以前の値との差分を取得する。
      const currentData = getValues('data');
      const previousValue = prevData.data[dayNumber].fourWheelAuctionTimes;
      const diffBetweenPreviousValueAndCurrentValue =
        currentValue - previousValue;
      console.log('違いです。', diffBetweenPreviousValueAndCurrentValue);
      if (diffBetweenPreviousValueAndCurrentValue >= 0) {
        for (
          let startDay = dayNumber + 1;
          startDay < apiData.length;
          startDay++
        ) {
          const currentFourWeelAuctionTimes = Number(
            getValues(`data.${startDay}.fourWheelAuctionTimes`)
          );
          currentData[startDay]['fourWheelAuctionTimes'] =
            currentFourWeelAuctionTimes +
            diffBetweenPreviousValueAndCurrentValue;
        }
      } else {
        // 変更した日より後の日付の減算処理
        for (
          let startDay = dayNumber + 1;
          startDay < apiData.length;
          startDay++
        ) {
          const currentFourWeelAuctionTimes = Number(
            getValues(`data.${startDay}.fourWheelAuctionTimes`)
          );
          currentData[startDay]['fourWheelAuctionTimes'] =
            currentFourWeelAuctionTimes +
            diffBetweenPreviousValueAndCurrentValue;
        }
        // 変更した日より前の日付の減算処理
        for (let startDay = dayNumber - 1; startDay >= 0; startDay--) {
          const currentFourWeelAuctionTimes = Number(
            getValues(`data.${startDay}.fourWheelAuctionTimes`)
          );
          currentData[startDay]['fourWheelAuctionTimes'] =
            currentFourWeelAuctionTimes +
            diffBetweenPreviousValueAndCurrentValue;
        }
      }
      setPrevData({ data: currentData });
      reset({ data: currentData });
    },
    [apiData.length, getValues, prevData.data, reset]
  );
  // 二輪オークション開催回数を変更した時のイベント。
  const watchTwoWheelAuctionTimesText = useCallback(
    (currentValue: number, dayNumber: number) => {
      // 入力された二輪オークション回数をもとに、翌日以降の二輪開催オークション回数を1カウントアップする。
      // 以前の値との差分を取得する。
      const currentData = getValues('data');
      const previousValue = prevData.data[dayNumber].twoWheelAuctionTimes;
      const diffBetweenPreviousValueAndCurrentValue =
        currentValue - previousValue;
      console.log('違いです。', diffBetweenPreviousValueAndCurrentValue);
      if (diffBetweenPreviousValueAndCurrentValue >= 0) {
        for (
          let startDay = dayNumber + 1;
          startDay < apiData.length;
          startDay++
        ) {
          const currentFourWeelAuctionTimes = Number(
            getValues(`data.${startDay}.twoWheelAuctionTimes`)
          );
          currentData[startDay]['twoWheelAuctionTimes'] =
            currentFourWeelAuctionTimes +
            diffBetweenPreviousValueAndCurrentValue;
        }
      } else {
        // 変更した日より後の日付の減算処理
        for (
          let startDay = dayNumber + 1;
          startDay < apiData.length;
          startDay++
        ) {
          const currentFourWeelAuctionTimes = Number(
            getValues(`data.${startDay}.twoWheelAuctionTimes`)
          );
          currentData[startDay]['twoWheelAuctionTimes'] =
            currentFourWeelAuctionTimes +
            diffBetweenPreviousValueAndCurrentValue;
        }
        // 変更した日より前の日付の減算処理
        for (let startDay = dayNumber - 1; startDay >= 0; startDay--) {
          const currentFourWeelAuctionTimes = Number(
            getValues(`data.${startDay}.twoWheelAuctionTimes`)
          );
          currentData[startDay]['twoWheelAuctionTimes'] =
            currentFourWeelAuctionTimes +
            diffBetweenPreviousValueAndCurrentValue;
        }
      }
      setPrevData({ data: currentData });
      reset({ data: currentData });
    },
    [apiData.length, getValues, prevData.data, reset]
  );

  useEffect(() => {
    const watchAll: { unsubscribe: () => void } = watch(({ name }) => {
      const fourWheelAuctionHoldingFlagpattern =
        /^data\.\d+\.fourWheelAuctionHoldingFlag$/;
      const twoWheelAuctionHoldingFlagpattern =
        /^data\.\d+\.twoWheelAuctionHoldingFlag$/;

      if (!name) {
        return;
      }
      // 四輪オークション開催有無を変更した時のイベント。
      if (fourWheelAuctionHoldingFlagpattern.test(name)) {
        const [_, index] = name.split('.');
        watchFourWheelAuctionHoldingFlagSelect(getValues(name), Number(index));
        return;
      } else if (twoWheelAuctionHoldingFlagpattern.test(name)) {
        // 二輪オークション開催有無を変更した時のイベント。
        const [_, index] = name.split('.');
        watchTwoWheelAuctionHoldingFlagSelect(getValues(name), Number(index));
        return;
      }
    });
    return () => {
      watchAll.unsubscribe();
    };
  }, [
    getValues,
    watch,
    watchFourWheelAuctionHoldingFlagSelect,
    watchTwoWheelAuctionHoldingFlagSelect,
  ]);

  useEffect(() => {
    if (!dirtyFields || !dirtyFields.data) {
      console.log('True value not found');
      return;
    }
    // dirtyFielsでどこの値が変更されたかを確認する。
    // isValidatingが発火するためには、reacthookformがvalidationRuleを知ってる必要がある。
    console.log(dirtyFields, 'dirtyFIelds');
    const changedFieldNameObject = { ...dirtyFields };
    let outputKey: string | null = null;

    for (let index = 0; index < changedFieldNameObject.data.length; index++) {
      const trueKey = findTrueKey(changedFieldNameObject.data[index]);

      if (trueKey !== null && trueKey !== undefined) {
        outputKey = `data.${index}.${trueKey}`;
        break;
      }
    }
    console.log(outputKey, 'outputKey');
    if (outputKey !== null) {
      console.log(outputKey, 'outputKey');
      const fourWheelAuctionHoldingTimespattern =
        /^data\.\d+\.fourWheelAuctionTimes$/;
      const twoWheelAuctionHoldingTimespattern =
        /^data\.\d+\.twoWheelAuctionTimes$/;
      const auctionTimes = convertToHalfWidth(getValues(outputKey));
      if (fourWheelAuctionHoldingTimespattern.test(outputKey)) {
        console.log('四輪オークション開催回数の変更');
        const [_, index] = outputKey.split('.');
        watchFourWheelAuctionTimesText(auctionTimes, Number(index));
      } else if (twoWheelAuctionHoldingTimespattern.test(outputKey)) {
        console.log('二輪オークション開催回数の変更');
        const [_, index] = outputKey.split('.');
        console.log(getValues(outputKey));
        const auctionTimes = convertToHalfWidth(getValues(outputKey));
        watchTwoWheelAuctionTimesText(auctionTimes, Number(index));
      }
    } else {
      console.log('True value not found');
    }
  }, [
    dirtyFields,
    getValues,
    isValidating,
    watchFourWheelAuctionTimesText,
    watchTwoWheelAuctionTimesText,
  ]);

  const renderAutomaticServiceCompleteFlagSelect = (day: number) => {
    return (
      <Select
        name={`data.${day - 1}.automaticServiceCompleteFlag`}
        selectValues={automaticServiceCompleteFlagSelectValues}
      />
    );
  };
  const renderTwoWheelAuctionHoldingFlagSelect = (day: number) => {
    return (
      <Select
        name={`data.${day - 1}.twoWheelAuctionHoldingFlag`}
        selectValues={auctionHoldingFlagSelectValues}
      />
    );
  };
  // 休みの日を管理する列のrender行の定義
  const renderFourWheelAuctionHoldingFlagSelect = (day: number) => {
    return (
      <Select
        name={`data.${day - 1}.fourWheelAuctionHoldingFlag`}
        selectValues={auctionHoldingFlagSelectValues}
      />
    );
  };
  const renderSelectTwo = (day: number) => {
    // selectの横幅を指定するために取得している。あまり良くない実装だが、保留
    const screenWidth = window.innerWidth;
    return (
      <Stack direction='row' spacing={2}>
        <Select
          name={`data.${day - 1}.aucRestFlag`}
          selectValues={restSelectValues}
          minWidth={screenWidth < 2000 ? 50 : 100}
        />
        <Select
          name={`data.${day - 1}.bankRestFlag`}
          selectValues={restSelectValues}
          minWidth={screenWidth < 2000 ? 50 : 100}
        />
      </Stack>
    );
  };
  const renderFourWheelAuctionTimesText = (day: number) => {
    return (
      <TextField name={`data.${day - 1}.fourWheelAuctionTimes`} fullWidth />
    );
  };
  const renderTwoWheelAuctionTimesText = (day: number) => {
    return (
      <TextField name={`data.${day - 1}.twoWheelAuctionTimes`} fullWidth />
    );
  };

  const sampleData = transpose(apiData);

  // カレンダーの曜日部分の作成
  const cols = tableCols.map((val) => {
    return { headerName: val, width: '12.5%' };
  });

  const createCalenderTableRow = (
    createDataVal: createDataProps,
    indexWeek: number
  ) => {
    // return値
    const rowArray: (string | number | JSX.Element)[][] = [];

    // 曜日の場合は条件に応じた値を返却
    const keyVal = Object.keys(createDataVal);
    keyVal.map((val: keyof createDataProps) => {
      const row: (string | number | JSX.Element)[] = [];
      const retuenVal = createDataVal[val];
      if (weekOfDayStr.some((value) => value === val)) {
        if (typeof retuenVal === 'number') {
          row.push(retuenVal);
        }
        if (typeof retuenVal === 'string') {
          if (retuenVal.match('selectRestFlags')) {
            row.push(renderSelectTwo(Number(sampleData[indexWeek][0][val])));
          } else if (retuenVal.match('selectFourWeelAucHolding')) {
            row.push(
              renderFourWheelAuctionHoldingFlagSelect(
                Number(sampleData[indexWeek][0][val])
              )
            );
          } else if (retuenVal.match('selectTwoWeelAucHolding')) {
            row.push(
              renderTwoWheelAuctionHoldingFlagSelect(
                Number(sampleData[indexWeek][0][val])
              )
            );
          } else if (retuenVal.match('selectAutomaticServiceCompleteFlag')) {
            row.push(
              renderAutomaticServiceCompleteFlagSelect(
                Number(sampleData[indexWeek][0][val])
              )
            );
          } else if (retuenVal.match('textFourWheelAuctionTimes')) {
            row.push(
              renderFourWheelAuctionTimesText(
                Number(sampleData[indexWeek][0][val])
              )
            );
          } else if (retuenVal.match('textTwoWheelAuctionTimes')) {
            row.push(
              renderTwoWheelAuctionTimesText(
                Number(sampleData[indexWeek][0][val])
              )
            );
          }
        }
      } else {
        row.push(retuenVal);
      }
      rowArray.push(row);
    });
    return rowArray;
  };

  const rows = sampleData.map((value: createDataProps[], indexWeek: number) =>
    value.map((row) => {
      const rowVal = createCalenderTableRow(row, indexWeek);
      return rowVal;
    })
  );
  return <CalenderTable calenderTableCol={cols} calenderTableRow={rows} />;
};

