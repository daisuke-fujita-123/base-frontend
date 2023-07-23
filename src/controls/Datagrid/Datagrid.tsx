import React from 'react';

import { InfoButton } from 'controls/Button';
import { Link } from 'controls/Link';
import { theme } from 'controls/theme';

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {
  Box,
  Pagination as MuiPagination,
  PaginationItem as MuiPaginationItem,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGridPro as MuiDataGridPro,
  DataGridProProps,
  GridColDef as MuiGridColDef,
  gridPageCountSelector,
  gridPaginationModelSelector,
  GridRenderCellParams,
  GridRowsProp,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import saveAs from 'file-saver';
import Papa from 'papaparse';
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
 * Paginationコンポーネント
 */
const Pagination = () => {
  // const { total } = props;

  const apiRef = useGridApiContext();
  const totalRowCount = apiRef.current.state.rows.totalRowCount;
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  const pageNumber = (page: number) => {
    if (isNaN(page)) {
      return 0;
    }
    return page;
  };
  const currentPageStart = pageNumber(
    paginationModel.pageSize * paginationModel.page + 1
  );
  const cureentPageEnd = pageNumber(
    paginationModel.pageSize * (paginationModel.page + 1)
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    apiRef.current.setPage(page - 1);
  };

  return (
    <Stack
      spacing={2}
      direction='row'
      // justifyContent='flex-end'
      alignItems='center'
    >
      <MuiPagination
        size='medium'
        shape='rounded'
        variant='outlined'
        count={pageCount}
        page={paginationModel.page + 1}
        onChange={handlePageChange}
        renderItem={(item) => (
          <MuiPaginationItem
            slots={{
              previous: ArrowLeftIcon,
              next: ArrowRightIcon,
            }}
            {...item}
          />
        )}
      />
      <Typography>
        {totalRowCount.toLocaleString()} 件 （ {currentPageStart}～
        {cureentPageEnd} 件）
      </Typography>
    </Stack>
  );
};

/**
 * DataGridの列モデル定義
 */
export type GridColDef = MuiGridColDef & {
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
};

/**
 * DataGridコンポーネントのProps
 */
export interface DataGridProps extends DataGridProProps {
  /**
   * 列の定義情報
   */
  columns: GridColDef[];
  disabledRows?: any[];
  disabledCells?: any[];
  /**
   * 行データ
   */
  rows: GridRowsProp;
  /**
   * height
   */
  height?: number;
  /**
   * width
   */
  width?: number;
  /**
   * refs
   */
  hrefs?: GridHrefsModel[]; // add, cellType = 'link'
  /**
   * ツールチップ
   */
  tooltips?: GridTooltipsModel[]; // add, tooltip = 'true'
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

  getCellDisabled?: (params: any) => boolean;
}

/**
 * hrefリンクデータモデル
 */
export interface GridHrefsModel {
  field: string;
  hrefs: {
    id: string | number;
    href: string;
  }[];
}

/**
 * ツールチップデータモデル
 */
export interface GridTooltipsModel {
  field: string;
  tooltips: {
    id: string | number;
    text: string;
  }[];
}

/**
 * DataGridコンポーネント
 * @param props
 * @returns
 */
export const DataGrid = (props: DataGridProps) => {
  const {
    columns,
    rows,
    disabledRows,
    disabledCells,
    tooltips,
    hrefs,
    initialState,
    /** size */
    height,
    width,
    /** sorting */
    /** sorting */
    /** filtering */
    /** pagination */
    pagination = false,
    /** selection */
    checkboxSelection = false,
    /** misc */
    onRowChange,
    onLinkClick, // cellType = 'link'
    onCellHelperButtonClick,
    getCellDisabled,
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

  const generateInputCell = (params: any) => {
    const disabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridInputCell
          id={params.id}
          value={params.value}
          field={params.field}
          helperText={params.colDef.cellHelperText}
          disabled={disabled}
        />
        {params.colDef.cellHelperButton === 'info' && (
          <InfoButton onClick={() => handleClick(params)} />
        )}
      </>
    );
  };

  const generateSelectCell = (params: any) => {
    const disabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridSelectCell
          id={params.id}
          value={params.value}
          field={params.field}
          selectValues={params.colDef.selectValues}
          disabled={disabled}
        />
        {params.colDef.cellHelperButton === 'info' && (
          <InfoButton onClick={() => handleClick(params)} />
        )}
      </>
    );
  };

  const generateRadioCell = (params: any) => {
    const disabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridRadioCell
          id={params.id}
          value={params.value}
          field={params.field}
          radioValues={params.colDef.radioValues}
          disabled={disabled}
        />
        {params.colDef.cellHelperButton === 'info' && (
          <InfoButton onClick={handleClick} />
        )}
      </>
    );
  };

  const generateCustomizableRadioCell = (params: any) => {
    const disabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridCustomizableRadiioCell
          id={params.id}
          value={params.value}
          field={params.field}
          radioValues={params.colDef.radioInputTypes}
          disabled={disabled}
        />
        {params.colDef.cellHelperButton === 'info' && (
          <InfoButton onClick={handleClick} />
        )}
      </>
    );
  };

  const generateCheckboxCell = (params: any) => {
    const disabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridCheckboxCell
          id={params.id}
          value={params.value}
          field={params.field}
          disabled={disabled}
        />
      </>
    );
  };

  const generateDatepickerCell = (params: any) => {
    const disabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridDatepickerCell
          id={params.id}
          value={params.value}
          field={params.field}
          disabled={disabled}
        />
        {params.colDef.cellOptionalButton === 'info' && (
          <InfoButton onClick={handleClick} />
        )}
      </>
    );
  };

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
    const map = hrefs?.find((x) => x.field === params.field);
    const href = map?.hrefs.find((x: any) => x.id === params.id);

    if (href === undefined) return <div>{params.value}</div>;
    return (
      <Link href={href.href} onClick={handleLinkClick}>
        {params.value}
      </Link>
    );
  };

  const generateTooltipCell = (params: GridRenderCellParams<any>) => {
    const map = tooltips?.find((x) => x.field === params.field);
    const tooltip = map?.tooltips.find((x: any) => x.id === params.id);

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

  const gridHeight = height ? height : '100%';
  const gridWidth = width
    ? width
    : muiColumns.reduce((acc, val) => acc + (val.width ? val.width : 0), 3);

  return (
    <>
      <Box
        sx={{
          height: gridHeight,
          width: gridWidth,
          '& .cold': {
            backgroundColor: '#b9d5ff91',
          },
          '& .hot': {
            backgroundColor: '#ff943975',
          },
          '& .disabled': {
            backgroundColor: '#D8D8D8',
          },
        }}
      >
        <StyledDataGrid
          {...props}
          columns={muiColumns}
          rows={rows}
          initialState={{
            ...initialState,
            pagination: {
              paginationModel: {
                pageSize: pagination ? 100 : undefined,
              },
            },
          }}
          /** size */
          columnHeaderHeight={28}
          rowHeight={30}
          autoHeight={height === undefined}
          /** sorting */
          /** pagination */
          pagination={pagination}
          /** selection */
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          /** misc */
          showCellVerticalBorder
          showColumnVerticalBorder
          hideFooter
          processRowUpdate={handleProcessRowUpdate}
          slots={{
            toolbar: pagination ? Pagination : undefined,
          }}
          experimentalFeatures={{
            columnGrouping: true,
          }}
          apiRef={apiRef}
        />
      </Box>
    </>
  );
};

export const exportCsv = (data: any[], filename: string) => {
  // DataGridのid列の除外、囲み文字の追加
  const transformed = data.map((line) => {
    delete line.id;
    Object.keys(line).forEach((key) => {
      const value = line[key];
      line[key] = `"${value}"`;
    });
    return line;
  });

  const csv = Papa.unparse(transformed, {
    delimiter: ',',
    newline: '\r\n',
    quoteChar: '',
    escapeChar: '',
    header: true,
  });

  const blob = new Blob([csv]);
  saveAs(blob, filename);
};

