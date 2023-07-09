import React, { forwardRef, memo, useCallback, useState } from 'react';

import { Typography } from 'controls/Typography';

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
  field: string | any[];
  helperText?: string;
}

/**
 * GridInputCellコンポーネント
 * 入力用のセル
 */
// eslint-disable-next-line react/display-name
export const GridInputCell = memo((props: GridInputCellProps) => {
  const { id, value, field, helperText } = props;

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
  value: number;
  field: string | any[];
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

  const [selection, setSelection] = useState(value);

  const handleValueChange = useCallback(
    (event: any) => {
      const newSelection = Number(event.target.value);
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
  value: number | undefined;
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

  const [selection, setSelection] = useState(value);

  const handleValueChange = useCallback(
    (event: any) => {
      const newSelection = Number(event.target.value);
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
}

/**
 * GridRadioCellPropsコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridCustomizableRadiioCell = memo(
  (props: GridCustomizableRadioCellProps) => {
    const { id, value, radioValues, field } = props;

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
            />
            {x === 'fromto' && (
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={ja}
                dateFormats={{ monthAndYear: 'YYYY年MM月' }}
              >
                <DatePicker
                  value={value.values[i][0]}
                  inputFormat='YYYY/MM/DD'
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(value) => handleDateValueChange(value, i, 0)}
                />
                <DatePicker
                  value={value.values[i][1]}
                  inputFormat='YYYY/MM/DD'
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(value) => handleDateValueChange(value, i, 1)}
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
