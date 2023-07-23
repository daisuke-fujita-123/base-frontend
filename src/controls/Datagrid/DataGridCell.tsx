import React, { forwardRef, memo, useCallback, useState } from 'react';

import { Typography } from 'controls/Typography';

import { useGridApiContext } from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { ja } from 'date-fns/locale';
import dayjs from 'dayjs';

/**
 * GridInputCellコンポーネントのProps
 */
interface GridInputCellProps {
  id: string | number;
  value: string;
  field: string | any[];
  helperText?: string;
  disabled?: boolean;
}

/**
 * GridInputCellコンポーネント
 * 入力用のセル
 */
// eslint-disable-next-line react/display-name
export const GridInputCell = memo((props: GridInputCellProps) => {
  const { id, value, field, helperText, disabled = false } = props;

  const apiRef = useGridApiContext();

  const handleValueChange = useCallback(
    (event: any) => {
      const newValue = event.target.value;
      const row = apiRef.current.getRow(id);
      if (Array.isArray(field)) {
        row[field[0]][field[1]] = newValue;
      } else {
        row[field] = newValue;
      }
    },
    [apiRef, field, id]
  );

  return (
    <>
      <input
        style={{ width: '60px' }}
        defaultValue={value}
        type='text'
        onChange={handleValueChange}
        disabled={disabled}
      />
      {helperText && <Typography>{helperText}</Typography>}
    </>
  );
});

/**
 * GridSelectCellPropsコンポーネントのProps
 */
interface GridSelectCellProps {
  id: string | number;
  value: string | number;
  field: string | any[];
  selectValues: any[];
  disabled?: boolean;
}

/**
 * GridSelectCellPropsコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridSelectCell = memo((props: GridSelectCellProps) => {
  const { id, value, field, selectValues, disabled = false } = props;

  const apiRef = useGridApiContext();

  const [selection, setSelection] = useState(value);

  const handleValueChange = useCallback(
    (event: any) => {
      const value = event.target.value;
      const newSelection =
        typeof selection === 'number' ? Number(value) : value;
      const row = apiRef.current.getRow(id);
      if (Array.isArray(field)) {
        row[field[0]][field[1]] = newSelection;
      } else {
        row[field] = newSelection;
      }
      setSelection(newSelection);
    },
    [apiRef, field, id]
  );

  return (
    <select
      style={{ width: '100px' }}
      value={selection}
      onChange={handleValueChange}
      disabled={disabled}
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
  value: string | number;
  radioValues: any[];
  field: string;
  disabled?: boolean;
}

/**
 * GridRadioCellPropsコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridRadioCell = memo((props: GridRadioCellProps) => {
  const { id, value, radioValues, field, disabled = false } = props;

  const apiRef = useGridApiContext();

  const [selection, setSelection] = useState(value);

  const handleValueChange = useCallback(
    (event: any) => {
      const value = event.target.value;
      const newSelection =
        typeof selection === 'number' ? Number(value) : value;
      const row = apiRef.current.getRow(id);
      row[field] = newSelection;
      setSelection(newSelection);
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
            checked={x.value === selection}
            onChange={handleValueChange}
            disabled={disabled}
          />
          <label>{x.displayValue}</label>
        </div>
      ))}
    </>
  );
});

/**
 * GridRadioCellPropsコンポーネントのProps
 */
interface GridCustomizableRadioCellProps {
  id: string | number;
  value: any;
  radioValues: any[];
  field: string;
  disabled?: boolean;
}

/**
 * GridRadioCellPropsコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridCustomizableRadiioCell = memo(
  (props: GridCustomizableRadioCellProps) => {
    const { id, value, radioValues, field, disabled = false } = props;

    const apiRef = useGridApiContext();

    const [selection, setSelection] = useState(value.selection);

    const handleRadioSelectionChange = useCallback(
      (index: number) => {
        const row = apiRef.current.getRow(id);
        row[field].selection = index;
        setSelection(index);
      },
      [apiRef, field, id]
    );

    const handleValueChange = useCallback(
      (event: any, index: number) => {
        const newValue = event.target.value;
        const row = apiRef.current.getRow(id);
        row[field].values[index] = newValue;
      },
      [apiRef, field, id]
    );

    const handleDateValueChange = useCallback(
      (value: any, index: number, fromto: number) => {
        const date = new Date(String(value));
        const formattedValue = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const row = apiRef.current.getRow(id);
        row[field].values[index][fromto] = formattedValue;
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
              checked={selection === i}
              onChange={() => handleRadioSelectionChange(i)}
              disabled={disabled}
            />
            {x === 'fromto' && (
              <LocalizationProvider
                // dateAdapter={AdapterDayjs}
                dateAdapter={AdapterDateFns}
              >
                <DatePicker
                  value={new Date(value.values[i][1])}
                  onChange={(value) => handleDateValueChange(value, i, 0)}
                  disabled={disabled}
                />
                <DatePicker
                  value={new Date(value.values[i][1])}
                  onChange={(value) => handleDateValueChange(value, i, 1)}
                  disabled={disabled}
                />
              </LocalizationProvider>
            )}
            {x === 'input' && (
              <input
                id={String(i)}
                type='input'
                style={{ width: '60px' }}
                defaultValue={value.values[i]}
                onChange={(event) => handleValueChange(event, i)}
                disabled={disabled}
              />
            )}
          </div>
        ))}
      </>
    );
  }
);

/**
 * GridCheckboxCellPropsコンポーネントのProps
 */
interface GridCheckboxCellProps {
  id: string | number;
  value: boolean | undefined;
  field: string;
  disabled?: boolean;
}

/**
 * GridCheckboxCellコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridCheckboxCell = memo((props: GridCheckboxCellProps) => {
  const { id, value, field, disabled = false } = props;

  const apiRef = useGridApiContext();

  const [selection, setSelection] = useState(value);

  const handleValueChange = useCallback(
    (event: any) => {
      const row = apiRef.current.getRow(id);
      const newSelection = !row[field];
      row[field] = newSelection;
      setSelection(newSelection);
    },
    [apiRef, field, id]
  );

  return (
    <input
      type='checkbox'
      style={{ width: '60px' }}
      checked={selection}
      onChange={handleValueChange}
      disabled={disabled}
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
  disabled?: boolean;
}

/**
 * GridCheckboxCellコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridDatepickerCell = memo((props: GridDatepickerCellProps) => {
  const { id, value, field, disabled = false } = props;

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
      // dateAdapter={AdapterDayjs}
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
    >
      <DatePicker
        value={new Date(value)}
        onChange={handleValueChange}
        disabled={disabled}
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
