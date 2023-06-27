import React, { forwardRef, memo, useCallback } from 'react';

import { Box } from 'layouts/Box';

import { Link } from 'controls/Link';
import { theme } from 'controls/theme';

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {
  Pagination as MuiPagination,
  PaginationItem as MuiPaginationItem,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import {
  gridPageCountSelector,
  gridPageSelector,
  GridRowsProp,
  useGridApiContext,
  useGridApiRef,
  useGridSelector,
} from '@mui/x-data-grid';
import {
  DataGridPro as MuiDataGridPro,
  DataGridProProps as MuiDataGridProProps,
  GridColDef as MuiGridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid-pro';

/**
 * GridInputCellコンポーネントのProps
 */
interface GridInputCellProps {
  id: string | number;
  value: string;
  field: string;
  readOnly?: boolean;
}

/**
 * GridInputCellコンポーネント
 * 入力用のセル
 */
// eslint-disable-next-line react/display-name
const GridInputCell = memo((props: GridInputCellProps) => {
  const { id, value, field, readOnly = false } = props;

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
      defaultValue={value}
      // value={value}
      type='text'
      readOnly={readOnly}
      onChange={handleValueChange}
    />
  );
});

/**
 * GridInputCellコンポーネントのProps
 */
interface GridSelectCellProps {
  id: string | number;
  value: string;
  field: string;
  selectValues: any[];
  readOnly?: boolean;
}

/**
 * GridInputCellコンポーネント
 * プルダウン用のセル
 */
// eslint-disable-next-line react/display-name
const GridSelectCell = memo((props: GridSelectCellProps) => {
  const { id, value, field, selectValues, readOnly = false } = props;

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
      defaultValue={value}
      // value={value}
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
 * GridCellForTooltipコンポーネントのProps
 */
interface GridInputCellProps {
  id: string | number;
  value: string;
  field: string;
  readOnly?: boolean;
  onRowChange?: (row: any) => void;
}

/**
 * GridCellForTooltipコンポーネント
 * ツールチップ用ののセル
 */
// eslint-disable-next-line react/display-name
const GridCellForTooltip = forwardRef((props: any, ref: any) => {
  return (
    <div {...props} ref={ref}>
      {props.children}
      {/* <GridCell {...props}>{props.children}</GridCell> */}
    </div>
  );
});

const StyledDataGrid = styled(MuiDataGridPro)(() => ({
  '& .MuiDataGrid-row': {
    '&.MuiDataGrid-row.Mui-selected': {
      backgroundColor: theme.palette.table.checked,
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.table.main,
    },
    '&:hover': {
      backgroundColor: theme.palette.table.selected,
    },
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: theme.palette.table.header,
  },
}));

/**
 * PaginationコンポーネントのProps
 */
interface PaginationProps {
  total: number;
}

/**
 * Paginationコンポーネント
 */
const Pagination = (props: PaginationProps) => {
  const { total } = props;

  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  const pageNumber = (page: number) => {
    if (isNaN(page)) {
      return 0;
    }
    return page;
  };
  const currentPageStart = pageNumber((total / pageCount) * page + 1);
  const cureentPageEnd = pageNumber((total / pageCount) * (page + 1));

  return (
    <Stack
      spacing={2}
      direction='row'
      justifyContent='flex-end'
      alignItems='center'
    >
      <MuiPagination
        size='medium'
        shape='rounded'
        variant='outlined'
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
        renderItem={(item) => (
          <MuiPaginationItem
            slots={{ previous: ArrowLeftIcon, next: ArrowRightIcon }}
            {...item}
          />
        )}
      />
      <Typography>
        {total.toLocaleString()} 件（ {currentPageStart} ～ {cureentPageEnd}{' '}
        件）
      </Typography>
    </Stack>
  );
};

/**
 * DataGridの列モデル定義
 */
export interface GridColDef extends MuiGridColDef {
  /**
   * size
   */
  size?: 'ss' | 's' | 'm' | 'l';
  /**
   * cellType
   */
  cellType?: 'default' | 'input' | 'select' | 'link';
  /**
   * tooltip
   */
  tooltip?: boolean;
  /**
   * selectValues
   */
  selectValues?: any[]; // cellType = 'select'
}

/**
 * DataGridコンポーネントのProps
 */
export interface DataGridProps extends MuiDataGridProProps {
  /**
   * 列の定義情報
   */
  columns: GridColDef[];
  /**
   * 行データ<br>
   */
  rows: GridRowsProp;
  /**
   * refs
   */
  hrefs?: any[]; // add, cellType = 'link'
  /**
   * ツールチップ
   */
  tooltips?: any[]; // add, tooltip = 'true'
  /**
   * onRowChange
   */
  onRowChange?: (row: any) => void; // add, cellType = 'input'
  /**
   * リンククリック時のハンドラ<br>
   * cellTypeがlinkの時のみ指定
   * @param url
   * @returns
   */
  onLinkClick?: (url: string) => void; // add, cellType = 'link'
}

/**
 * DataGridコンポーネント
 * @param props
 * @returns
 */
export const DataGrid = (props: DataGridProps) => {
  const {
    columns,
    columnGroupingModel = undefined,
    rows,
    tooltips,
    hrefs,
    initialState,
    /** sorting */
    /** filtering */
    /** pagination */
    pageSize = undefined,
    /** selection */
    checkboxSelection = false,
    /** misc */
    onRowChange,
    onLinkClick, // cellType = 'link'
  } = props;

  // ref
  const apiRef = useGridApiRef();

  // handler
  const handleRowChange = (row: any) => {
    if (onRowChange === undefined) return;
    onRowChange(row);
  };

  // handler
  const handleLinkClick = (url: string) => {
    if (onLinkClick === undefined) return;
    onLinkClick(url);
  };

  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    return newRow;
  };

  const generateInputCell = (params: GridRenderCellParams<any>) => (
    <GridInputCell
      id={params.id}
      value={params.value}
      field={params.field}
      // onRowChange={handleRowChange}
    />
  );

  const generateSelectCell = (params: any) => (
    <GridSelectCell
      id={params.id}
      value={params.value}
      field={params.field}
      selectValues={params.colDef.selectValues}
      // onRowChange={handleRowChange}
    />
  );

  const generateLinkCell = (params: any) => {
    const href = hrefs?.find((x) => {
      return x.id === params.id && x.field === params.field;
    });
    return (
      <Link href={href.href} onClick={handleLinkClick}>
        {params.value}
      </Link>
    );
  };

  const generateTooltipCell = (params: GridRenderCellParams<any>) => {
    const tooltip = tooltips?.find((x) => {
      return x.id === params.id && x.field === params.field;
    });
    const text = tooltip !== undefined ? tooltip.text : '';
    return (
      <Tooltip title={text} placement='right'>
        <GridCellForTooltip>{params.value}</GridCellForTooltip>
      </Tooltip>
    );
  };

  // 独自のカラム定義からMUI DataGridのカラム定義へ変換
  const muiColumns: MuiGridColDef[] = columns.map((value) => {
    let width = 80;
    if (value.size === 'ss') {
      width = 80;
    }
    if (value.size === 's') {
      width = 100;
    }
    if (value.size === 'm') {
      width = 150;
    }
    if (value.size === 'l') {
      width = 300;
    }

    let renderCell = undefined;
    if (value.cellType === 'input') {
      renderCell = generateInputCell;
    }
    if (value.cellType === 'select') {
      renderCell = generateSelectCell;
    }
    if (value.cellType === 'link') {
      renderCell = generateLinkCell;
    }
    if (value.tooltip) {
      renderCell = generateTooltipCell;
    }

    return {
      ...value,
      width: width,
      renderCell: renderCell,
    };
  });

  const components =
    pageSize !== undefined
      ? {
          Pagination: () => <Pagination total={rows.length} />,
        }
      : undefined;

  return (
    <Box height={492}>
      <StyledDataGrid
        columns={muiColumns}
        columnGroupingModel={columnGroupingModel}
        rows={rows}
        initialState={initialState}
        /** size */
        headerHeight={28}
        rowHeight={50}
        /** sorting */
        /** pagination */
        pagination
        pageSize={pageSize}
        /** selection */
        checkboxSelection={checkboxSelection}
        /** misc */
        showCellRightBorder
        hideFooter={pageSize === undefined}
        components={components}
        processRowUpdate={handleProcessRowUpdate}
        experimentalFeatures={{
          columnGrouping: true,
          newEditingApi: true,
        }}
      />
    </Box>
  );
};

