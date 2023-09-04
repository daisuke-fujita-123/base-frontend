import React, {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useState,
} from 'react';

import {
  convertFromDateToDisplay,
  isInvalidDate,
} from 'controls/DatePicker/DatePickerHelper';
import { StyledTextFiled } from 'controls/TextField';
import { theme } from 'controls/theme';
import { Typography } from 'controls/Typography';

import { AppContext } from 'providers/AppContextProvider';

import Calendar from 'icons/button_calendar.png';

import { Box, IconButton, Stack, styled } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';
import {
  BaseSingleInputFieldProps,
  DatePicker,
  DateValidationError,
  FieldSection,
  LocalizationProvider,
  UseDateFieldProps,
} from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';

import { ja } from 'date-fns/locale';

/**
 * DatePickerFieldPropsコンポーネントのProps
 */
interface DatePickerFieldProps
  extends UseDateFieldProps<Date>,
    BaseSingleInputFieldProps<
      Date | null,
      Date,
      FieldSection,
      DateValidationError
    > {
  displayValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * DatePickerFieldPropsコンポーネント
 */
const DatePickerField = (props: DatePickerFieldProps) => {
  const {
    displayValue,
    disabled,
    readOnly,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    onValueChange,
  } = props;

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value;
    onValueChange && onValueChange(newValue);
  };

  const handleOnBlur: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const newValue = event.target.value;
  };

  return (
    <Box ref={containerRef}>
      {startAdornment}
      <StyledTextFiled
        value={displayValue}
        sx={{ width: 188, height: 16 }}
        disabled={disabled}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        InputProps={{
          endAdornment: endAdornment,
          readOnly: readOnly,
        }}
        fullWidth
      />
    </Box>
  );
};

/**
 * GridInputCellコンポーネントのProps
 */
interface GridInputCellProps {
  id: string | number;
  value: string;
  field: string | any[];
  controlled: boolean;
  width: number;
  helperText?: string;
  disabled?: boolean;
  onRowValueChange?: (row: any) => void;
}

/**
 * GridInputCellコンポーネント
 * 入力用のセル
 */
// eslint-disable-next-line react/display-name
export const GridInputCell = memo((props: GridInputCellProps) => {
  const {
    id,
    value,
    field,
    controlled,
    width,
    helperText,
    disabled = false,
    onRowValueChange,
  } = props;

  const { setNeedsConfirmNavigate } = useContext(AppContext);
  const apiRef = useGridApiContext();

  const [text, setText] = useState(value);

  const handleValueChange = useCallback(
    (event: any) => {
      const newValue = event.target.value;
      const row = apiRef.current.getRow(id);
      if (Array.isArray(field)) {
        row[field[0]][field[1]] = newValue;
      } else {
        row[field] = newValue;
      }
      !controlled && setText(newValue);
      setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
      onRowValueChange && onRowValueChange(row);
    },
    [apiRef, field, id]
  );

  return (
    <>
      <input
        style={{ width }}
        value={controlled ? text : value}
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
  controlled: boolean;
  width: number;
  disabled?: boolean;
  onRowValueChange?: (row: any) => void;
  onCellBlur?: (row: any) => void;
}

/**
 * GridSelectCellPropsコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridSelectCell = memo((props: GridSelectCellProps) => {
  const {
    id,
    value,
    field,
    selectValues,
    controlled,
    width,
    disabled = false,
    onRowValueChange,
    onCellBlur,
  } = props;

  const { setNeedsConfirmNavigate } = useContext(AppContext);
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
      !controlled && setSelection(newSelection);
      setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
      onRowValueChange && onRowValueChange(row);
    },
    [apiRef, field, id]
  );

  const handleOnBlur: FocusEventHandler<HTMLSelectElement> = () => {
    const row = apiRef.current.getRow(id);
    onCellBlur && onCellBlur(row);
  };

  return (
    <select
      style={{ width }}
      value={controlled ? selection : value}
      onChange={handleValueChange}
      onBlur={handleOnBlur}
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
  controlled: boolean;
  width: number;
  disabled?: boolean;
  onRowValueChange?: (row: any) => void;
}

/**
 * GridRadioCellPropsコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridRadioCell = memo((props: GridRadioCellProps) => {
  const {
    id,
    value,
    radioValues,
    field,
    controlled,
    width,
    disabled = false,
    onRowValueChange,
  } = props;

  const { setNeedsConfirmNavigate } = useContext(AppContext);
  const apiRef = useGridApiContext();

  const [selection, setSelection] = useState(value);

  const handleValueChange = useCallback(
    (event: any) => {
      const value = event.target.value;
      const newSelection =
        typeof selection === 'number' ? Number(value) : value;
      const row = apiRef.current.getRow(id);
      row[field] = newSelection;
      !controlled && setSelection(newSelection);
      setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
      onRowValueChange && onRowValueChange(row);
    },
    [apiRef, field, id]
  );

  return (
    <>
      <Stack
        style={{ width, height: 16 }}
        direction='row'
        justifyContent='space-evenly'
        // divider={<Divider orientation='vertical' flexItem />}
      >
        {radioValues.map((x, i) => (
          <Stack key={i} direction='row'>
            <input
              value={x.value}
              type='radio'
              checked={x.value === (controlled ? selection : value)}
              onChange={handleValueChange}
              disabled={disabled}
            />
            <label>{x.displayValue}</label>
          </Stack>
        ))}
      </Stack>
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
  onRowValueChange?: (row: any) => void;
}

/**
 * GridRadioCellPropsコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridCustomizableRadiioCell = memo(
  (props: GridCustomizableRadioCellProps) => {
    const {
      id,
      value,
      radioValues,
      field,
      disabled = false,
      onRowValueChange,
    } = props;

    const { setNeedsConfirmNavigate } = useContext(AppContext);
    const apiRef = useGridApiContext();

    const [selection, setSelection] = useState(value.selection);

    const handleRadioSelectionChange = useCallback(
      (index: number) => {
        const row = apiRef.current.getRow(id);
        row[field].selection = index;
        setSelection(index);
        setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
        onRowValueChange && onRowValueChange(row);
      },
      [apiRef, field, id]
    );

    const handleValueChange = useCallback(
      (event: any, index: number) => {
        const newValue = event.target.value;
        const row = apiRef.current.getRow(id);
        row[field].values[index] = newValue;
        setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
        onRowValueChange && onRowValueChange(row);
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
        setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
        onRowValueChange && onRowValueChange(row);
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
  controlled: boolean;
  disabled?: boolean;
  onRowValueChange?: (row: any) => void;
}

/**
 * GridCheckboxCellコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridCheckboxCell = memo((props: GridCheckboxCellProps) => {
  const {
    id,
    value,
    field,
    controlled,
    disabled = false,
    onRowValueChange,
  } = props;

  const { setNeedsConfirmNavigate } = useContext(AppContext);
  const apiRef = useGridApiContext();

  const [selection, setSelection] = useState(value);

  const handleValueChange = useCallback(
    (event: any) => {
      const row = apiRef.current.getRow(id);
      const newSelection = !row[field];
      row[field] = newSelection;
      !controlled && setSelection(newSelection);
      setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
      onRowValueChange && onRowValueChange(row);
    },
    [apiRef, field, id]
  );

  return (
    <input
      type='checkbox'
      style={{ width: '60px' }}
      checked={controlled ? selection : value}
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
  controlled: boolean;
  disabled?: boolean;
  onRowValueChange?: (row: any) => void;
}

/**
 * GridCheckboxCellコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridDatepickerCell = memo((props: GridDatepickerCellProps) => {
  const {
    id,
    value,
    field,
    controlled,
    disabled = false,
    onRowValueChange,
  } = props;

  const { setNeedsConfirmNavigate } = useContext(AppContext);
  const apiRef = useGridApiContext();

  const [date, setDate] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);

  const handleOnAccept = (value: Date | null) => {
    if (value === null) return;
    if (isInvalidDate(value)) return;
    const displayValue = convertFromDateToDisplay(value);

    if (displayValue === undefined) return;
    const row = apiRef.current.getRow(id);
    row[field] = displayValue;
    setDisplayValue(displayValue);
    setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
    onRowValueChange && onRowValueChange(row);
  };

  const handleValueChange = (value: string) => {
    const row = apiRef.current.getRow(id);
    row[field] = value;
    setDisplayValue(value);
    !controlled && setDate(value);
    setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
    onRowValueChange && onRowValueChange(row);
  };

  return (
    <LocalizationProvider
      // dateAdapter={AdapterDayjs}
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
    >
      <DatePicker
        value={new Date(controlled ? date : value)}
        onAccept={handleOnAccept}
        slots={{
          field: DatePickerField,
          openPickerIcon: CalenderIcon,
        }}
        slotProps={{
          field: {
            displayValue: controlled ? displayValue : value,
            onValueChange: handleValueChange,
          } as any,
          layout: {
            sx: {
              '& .MuiPickersCalendarHeader-labelContainer': {
                fontWeight: 'bold',
              },
              '& .MuiButtonBase-root.MuiPickersDay-root': {
                '&.Mui-selected': {
                  border: '3px solid #f37246',
                  backgroundColor: '#fde8d4',
                  color: '#000000',
                },
              },
            },
          },
        }}
        format='yyyy/mm/dd'
        disabled={disabled}
      />
    </LocalizationProvider>
  );
});

const StyledButton = styled(IconButton)({
  ...theme.palette.calender,
  borderRadius: 0,
  width: 18,
  height: 18,
  marginRight: theme.spacing(-2),
});

const CalenderIcon = () => {
  return (
    <StyledButton>
      <img src={Calendar}></img>
    </StyledButton>
  );
};

/**
 * GridDatepickerCellPropsコンポーネントのProps
 */
interface GridFromtoCellProps {
  id: string | number;
  value: string[];
  field: string;
  width: number;
  disabled?: boolean;
  onRowValueChange?: (row: any) => void;
}

/**
 * GridCheckboxCellコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
export const GridFromtoCell = memo((props: GridFromtoCellProps) => {
  const { id, value, field, width, disabled = false, onRowValueChange } = props;

  const { setNeedsConfirmNavigate } = useContext(AppContext);
  const apiRef = useGridApiContext();
  const [displayValue, setDisplayValue] = useState(value);

  const handleOnAccept = (value: Date | null, index: number) => {
    if (value === null) return;
    if (isInvalidDate(value)) return;
    const displayValue = convertFromDateToDisplay(value);

    if (displayValue === undefined) return;
    const row = apiRef.current.getRow(id);
    row[field][index] = displayValue;
    setDisplayValue([...row[field]]);
    setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
    onRowValueChange && onRowValueChange(row);
  };

  const handleValueChange = (value: string, index: number) => {
    const row = apiRef.current.getRow(id);
    row[field][index] = value;
    setDisplayValue([...row[field]]);
    setNeedsConfirmNavigate && setNeedsConfirmNavigate(true);
    onRowValueChange && onRowValueChange(row);
  };

  return (
    <LocalizationProvider
      // dateAdapter={AdapterDayjs}
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
    >
      <Stack
        style={{ width, height: 16 }}
        direction='row'
        justifyContent='space-evenly'
        // divider={<Divider orientation='vertical' flexItem />}
      >
        <DatePicker
          value={new Date(value[0])}
          onAccept={(value) => handleOnAccept(value, 0)}
          slots={{
            field: DatePickerField,
            openPickerIcon: CalenderIcon,
          }}
          slotProps={{
            field: {
              displayValue: displayValue[0],
              onValueChange: (value: string) => handleValueChange(value, 0),
            } as any,
            layout: {
              sx: {
                '& .MuiPickersCalendarHeader-labelContainer': {
                  fontWeight: 'bold',
                },
                '& .MuiButtonBase-root.MuiPickersDay-root': {
                  '&.Mui-selected': {
                    border: '3px solid #f37246',
                    backgroundColor: '#fde8d4',
                    color: '#000000',
                  },
                },
              },
            },
          }}
          format='yyyy/mm/dd'
          disabled={disabled}
        />
        <Typography>~</Typography>
        <DatePicker
          value={new Date(value[1])}
          onAccept={(value) => handleOnAccept(value, 1)}
          slots={{
            field: DatePickerField,
            openPickerIcon: CalenderIcon,
          }}
          slotProps={{
            field: {
              displayValue: displayValue[1],
              onValueChange: (value: string) => handleValueChange(value, 1),
            } as any,
            layout: {
              sx: {
                '& .MuiPickersCalendarHeader-labelContainer': {
                  fontWeight: 'bold',
                },
                '& .MuiButtonBase-root.MuiPickersDay-root': {
                  '&.Mui-selected': {
                    border: '3px solid #f37246',
                    backgroundColor: '#fde8d4',
                    color: '#000000',
                  },
                },
              },
            },
          }}
          format='yyyy/mm/dd'
          disabled={disabled}
        />
      </Stack>
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
