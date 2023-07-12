import React from 'react';

import { Box } from 'layouts/Box';

import { InfoButton } from 'controls/Button';
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
  useGridSelector,
} from '@mui/x-data-grid';
import {
  DataGridPro as MuiDataGridPro,
  DataGridProProps as MuiDataGridProProps,
  GridColDef as MuiGridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import saveAs from 'file-saver';
import {
  GridCellForTooltip,
  GridCheckboxCell,
  GridCustomizableRadiioCell,
  GridDatepickerCell,
  GridInputCell,
  GridRadioCell,
  GridSelectCell,
} from './DataGridCell';

const StyledDataGrid = styled(MuiDataGridPro)({
  fontSize: 13,
  '& .MuiDataGrid-row': {
    '&.MuiDataGrid-row.Mui-selected': {
      backgroundColor: theme.palette.table.checked,
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.table.background,
    },
    '&:hover': {
      backgroundColor: theme.palette.table.selected,
    },
  },
  '& .MuiDataGrid-cell': {
    justifyContent: 'center',
    display: 'flex',
    padding: 5,
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: theme.palette.table.header,
    borderRight: '1px solid #ffffff',
    padding: 5,
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      fontSize: 13,
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      justifyContent: 'center',
      display: 'flex',
    },
    // フィルターアイコンの色変更
    // '& .MuiDataGrid-iconButtonContainer': {
    //   '& .MuiIconButton-root': {
    //     color: '',
    //   },
    // },
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
});

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
  cellType?:
    | 'default'
    | 'input'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'datepicker'
    | 'link'
    | any[];
  /**
   * tooltip
   */
  tooltip?: boolean;
  /**
   * selectValues
   */
  selectValues?: any[]; // cellType = 'select'
  /**
   * radioValues
   */
  radioValues?: any[]; // cellType = 'radio'

  radioInputTypes?: string[];

  cellHelperText?: string; // cellType = 'input'

  cellHelperButton?: 'info';
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

  onCellHelperButtonClick?: (firld: string, row: number) => void; // add, cellOptionalButton
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
    onCellHelperButtonClick,
    apiRef,
  } = props;

  // ref
  // const apiRef = useGridApiRef();

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

  // heander
  const handleClick = (params: any) => {
    if (onCellHelperButtonClick === undefined) return;
    onCellHelperButtonClick(params.field, params.id);
  };

  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    return newRow;
  };

  const generateInputCell = (params: any) => (
    <>
      <GridInputCell
        id={params.id}
        value={params.value}
        field={params.field}
        helperText={params.colDef.cellHelperText}
      />
      {params.colDef.cellHelperButton === 'info' && (
        <InfoButton onClick={() => handleClick(params)} />
      )}
    </>
  );

  const generateSelectCell = (params: any) => (
    <>
      <GridSelectCell
        id={params.id}
        value={params.value}
        field={params.field}
        selectValues={params.colDef.selectValues}
      />
      {params.colDef.cellHelperButton === 'info' && (
        <InfoButton onClick={() => handleClick(params)} />
      )}
    </>
  );

  const generateRadioCell = (params: any) => (
    <>
      <GridRadioCell
        id={params.id}
        value={params.value}
        field={params.field}
        radioValues={params.colDef.radioValues}
      />
      {params.colDef.cellHelperButton === 'info' && (
        <InfoButton onClick={handleClick} />
      )}
    </>
  );

  const generateCustomizableRadioCell = (params: any) => (
    <>
      <GridCustomizableRadiioCell
        id={params.id}
        value={params.value}
        field={params.field}
        radioValues={params.colDef.radioInputTypes}
      />
      {params.colDef.cellHelperButton === 'info' && (
        <InfoButton onClick={handleClick} />
      )}
    </>
  );

  const generateCheckboxCell = (params: any) => (
    <>
      <GridCheckboxCell
        id={params.id}
        value={params.value}
        field={params.field}
      />
    </>
  );

  const generateDatepickerCell = (params: any) => (
    <>
      <GridDatepickerCell
        id={params.id}
        value={params.value}
        field={params.field}
      />
      {params.colDef.cellOptionalButton === 'info' && (
        <InfoButton onClick={handleClick} />
      )}
    </>
  );

  const generateMultiInputCell = (params: any) => {
    const cellTypes = params.colDef.cellType;

    return (
      <>
        {cellTypes.map((x: any, i: number) => {
          if (x.type === 'input') {
            return (
              <GridInputCell
                key={i}
                id={params.id}
                value={params.value[i]}
                field={[params.field, i]}
                helperText={x.helperText}
              />
            );
          }
          if (x.type === 'select') {
            return (
              <GridSelectCell
                key={i}
                id={params.id}
                value={params.value[i]}
                field={[params.field, i]}
                selectValues={x.selectValues}
              />
            );
          }
          return <>cellType error</>;
        })}
      </>
    );
  };

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
    let width = value.width !== undefined ? value.width : 80;
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
    if (value.cellType === 'radio') {
      if (value.radioValues) {
        renderCell = generateRadioCell;
      }
      if (value.radioInputTypes) {
        renderCell = generateCustomizableRadioCell;
      }
    }
    if (value.cellType === 'checkbox') {
      renderCell = generateCheckboxCell;
    }
    if (value.cellType === 'datepicker') {
      renderCell = generateDatepickerCell;
    }
    if (value.cellType === 'link') {
      renderCell = generateLinkCell;
    }
    if (value.tooltip) {
      renderCell = generateTooltipCell;
    }
    if (Array.isArray(value.cellType)) {
      renderCell = generateMultiInputCell;
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
          // BasePopper: () => <InfoButton />,
        }
      : undefined;

  return (
    <>
      <Box height={492}>
        <StyledDataGrid
          columns={muiColumns}
          columnGroupingModel={columnGroupingModel}
          rows={rows}
          initialState={initialState}
          /** size */
          headerHeight={28}
          rowHeight={30}
          /** sorting */
          /** pagination */
          pagination
          pageSize={pageSize}
          /** selection */
          checkboxSelection={checkboxSelection}
          disableSelectionOnClick={true}
          /** misc */
          showCellRightBorder
          hideFooter={pageSize === undefined}
          components={components}
          processRowUpdate={handleProcessRowUpdate}
          experimentalFeatures={{
            columnGrouping: true,
            newEditingApi: true,
          }}
          apiRef={apiRef}
        />
      </Box>
    </>
  );
};

export const exportCsv = (
  apiRef: React.MutableRefObject<GridApiPro>,
  filename: string
) => {
  const csv = apiRef.current.getDataAsCsv();
  const blob = new Blob([csv]);
  saveAs(blob, filename);
};

