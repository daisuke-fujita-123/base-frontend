import React, { forwardRef, memo, useCallback } from 'react';

import { TextField } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ja } from 'date-fns/locale';

/**
 * GridInputCellコンポーネントのProps
 */
interface GridInputCellProps {
  id: string | number;
  value: string;
  field: string;
}

/**
 * GridInputCellコンポーネント
 * 入力用のセル
 */
// eslint-disable-next-line react/display-name
export const GridInputCell = memo((props: GridInputCellProps) => {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleValueChange = useCallback(
    (event: any) => {
      const newValue = event.target.value;
      const row = apiRef.current.getRow(id);
      row[field] = newValue;
    },
    [apiRef, field, id]
  );

  return (
    <input
      style={{ width: '60px' }}
      value={value}
      type='text'
      onChange={handleValueChange}
    />
  );
});

/**
 * GridSelectCellPropsコンポーネントのProps
 */
interface GridSelectCellProps {
  id: string | number;
  value: string;
  field: string;
  selectValues: any[];
  readOnly?: boolean;
}

/**
 * GridSelectCellPropsコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridSelectCell = memo((props: GridSelectCellProps) => {
  const { id, value, field, selectValues } = props;

  const apiRef = useGridApiContext();

  const handleValueChange = useCallback(
    (event: any) => {
      const newValue = event.target.value;
      const row = apiRef.current.getRow(id);
      row[field] = newValue;
    },
    [apiRef, field, id]
  );

  return (
    <select
      style={{ width: '60px' }}
      value={value}
      onChange={handleValueChange}
    >
      {selectValues.map((x, i) => (
        <option key={i} value={x.value}>
          {x.displayValue}
        </option>
      ))}
    </select>
  );
});

/**
 * GridRadioCellPropsコンポーネントのProps
 */
interface GridRadioCellProps {
  id: string | number;
  value: boolean | undefined;
  radioValues: any[];
  field: string;
}

/**
 * GridRadioCellPropsコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridRadioCell = memo((props: GridRadioCellProps) => {
  const { id, value, radioValues, field } = props;

  const apiRef = useGridApiContext();

  const handleValueChange = useCallback(
    (event: any) => {
      const newValue = event.target.value;
      const row = apiRef.current.getRow(id);
      row[field] = newValue;
    },
    [apiRef, field, id]
  );

  return (
    <>
      {radioValues.map((x, i) => (
        <div key={i}>
          <input
            type='radio'
            style={{ width: '60px' }}
            value={x.value}
            checked={x.value === value}
            onChange={handleValueChange}
          />
          <label>{x.displayValue}</label>
        </div>
      ))}
    </>
  );
});

/**
 * GridCheckboxCellPropsコンポーネントのProps
 */
interface GridCheckboxCellProps {
  id: string | number;
  value: boolean | undefined;
  field: string;
}

/**
 * GridCheckboxCellコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridCheckboxCell = memo((props: GridCheckboxCellProps) => {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleValueChange = useCallback(
    (event: any) => {
      const row = apiRef.current.getRow(id);
      row[field] = !row[field];
    },
    [apiRef, field, id]
  );

  return (
    <input
      type='checkbox'
      style={{ width: '60px' }}
      checked={value}
      onChange={handleValueChange}
    />
  );
});

/**
 * GridDatepickerCellPropsコンポーネントのProps
 */
interface GridDatepickerCellProps {
  id: string | number;
  value: string;
  field: string;
}

/**
 * GridCheckboxCellコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridDatepickerCell = memo((props: GridDatepickerCellProps) => {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleValueChange = useCallback(
    (value: any) => {
      const date = new Date(String(value));
      const formattedValue = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      // const newValue = event.target.value;
      const row = apiRef.current.getRow(id);
      row[field] = formattedValue;
    },
    [apiRef, field, id]
  );

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={ja}
      dateFormats={{ monthAndYear: 'YYYY年MM月' }}
    >
      <DatePicker
        value={value}
        inputFormat='YYYY/MM/DD'
        renderInput={(params) => <TextField {...params} />}
        onChange={handleValueChange}
      />
    </LocalizationProvider>
  );
});

/**
 * GridCellForTooltipコンポーネント
 * ツールチップ用ののセル
 */
// eslint-disable-next-line react/display-name
export const GridCellForTooltip = forwardRef((props: any, ref: any) => {
  return (
    <div {...props} ref={ref}>
      {props.children}
      {/* <GridCell {...props}>{props.children}</GridCell> */}
    </div>
  );
});
