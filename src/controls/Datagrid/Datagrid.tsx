import React from 'react';

import { InfoButton } from 'controls/Button';
import {
  GridCellForTooltip,
  GridCheckboxCell,
  GridCustomizableRadiioCell,
  GridDatepickerCell,
  GridInputCell,
  GridRadioCell,
  GridSelectCell,
} from 'controls/Datagrid/DataGridCell';
import { GridToolbar } from 'controls/Datagrid/DataGridToolbar';
import { convertFromSizeToWidth } from 'controls/Datagrid/DataGridUtil';
import { Link } from 'controls/Link';
import { theme } from 'controls/theme';

import SortAsc from 'icons/content_sort_ascend.png';
import SortDesc from 'icons/content_sort_descend.png';

import { Box, styled, Tooltip } from '@mui/material';
import {
  DataGridPro as MuiDataGridPro,
  DataGridProProps,
  GridColDef as MuiGridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import saveAs from 'file-saver';
import Papa from 'papaparse';

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
    | 'button'
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

  /**
   * 行データ
   */
  rows: GridRowsProp;
  disabled?: boolean;
  /**
   * height
   */
  height?: string | number;
  /**
   * width
   */
  width?: string | number;
  /**
   * refs
   */
  hrefs?: GridHrefsModel[]; // add, cellType = 'link'
  /**
   * ツールチップ
   */
  tooltips?: GridTooltipsModel[]; // add, tooltip = 'true'
  showHeaderRow?: boolean;
  /**
   * headerRow
   */
  headerRow?: GridValidRowModel;
  headerApiRef?: React.MutableRefObject<GridApiPro>;
  /**
   * onRowChange
   */
  onRowValueChange?: (row: any) => void; // add, cellType = 'input'
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
    disabled = false,
    tooltips,
    hrefs,
    showHeaderRow = false,
    headerRow,
    headerApiRef,
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
    onRowValueChange,
    onLinkClick, // cellType = 'link'
    onCellHelperButtonClick,
    getCellDisabled,
    apiRef,
  } = props;

  // ref
  // const apiRef = useGridApiRef();

  // handler
  const handleRowValueChange = (row: any) => {
    if (onRowValueChange === undefined) return;
    onRowValueChange(row);
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
    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridInputCell
          id={params.id}
          value={params.value}
          field={params.field}
          helperText={params.colDef.cellHelperText}
          disabled={disabled || cellDisabled}
          onRowValueChange={handleRowValueChange}
        />
        {params.colDef.cellHelperButton === 'info' && (
          <InfoButton onClick={() => handleClick(params)} />
        )}
      </>
    );
  };

  const generateSelectCell = (params: any) => {
    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridSelectCell
          id={params.id}
          value={params.value}
          field={params.field}
          selectValues={params.colDef.selectValues}
          disabled={disabled || cellDisabled}
          onRowValueChange={handleRowValueChange}
        />
        {params.colDef.cellHelperButton === 'info' && (
          <InfoButton onClick={() => handleClick(params)} />
        )}
      </>
    );
  };

  const generateRadioCell = (params: any) => {
    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridRadioCell
          id={params.id}
          value={params.value}
          field={params.field}
          radioValues={params.colDef.radioValues}
          disabled={disabled || cellDisabled}
          onRowValueChange={handleRowValueChange}
        />
        {params.colDef.cellHelperButton === 'info' && (
          <InfoButton onClick={handleClick} />
        )}
      </>
    );
  };

  const generateCustomizableRadioCell = (params: any) => {
    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridCustomizableRadiioCell
          id={params.id}
          value={params.value}
          field={params.field}
          radioValues={params.colDef.radioInputTypes}
          disabled={disabled || cellDisabled}
          onRowValueChange={handleRowValueChange}
        />
        {params.colDef.cellHelperButton === 'info' && (
          <InfoButton onClick={handleClick} />
        )}
      </>
    );
  };

  const generateCheckboxCell = (params: any) => {
    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridCheckboxCell
          id={params.id}
          value={params.value}
          field={params.field}
          disabled={disabled || cellDisabled}
          onRowValueChange={handleRowValueChange}
        />
      </>
    );
  };

  const generateDatepickerCell = (params: any) => {
    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridDatepickerCell
          id={params.id}
          value={params.value}
          field={params.field}
          disabled={disabled || cellDisabled}
          onRowValueChange={handleRowValueChange}
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
                onRowValueChange={handleRowValueChange}
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
                onRowValueChange={handleRowValueChange}
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
    const width = convertFromSizeToWidth(value.size);

    let renderCell = value.renderCell;
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
    : muiColumns.reduce((acc, val) => acc + (val.width ? val.width : 0), 4);

  const SortedAscIcon = () => {
    return (
      <div>
        <img src={SortAsc}></img>
      </div>
    );
  };
  const SortedDescIcon = () => {
    return (
      <div>
        <img src={SortDesc}></img>
      </div>
    );
  };

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
            toolbar: GridToolbar,
            columnSortedAscendingIcon: SortedAscIcon,
            columnSortedDescendingIcon: SortedDescIcon,
          }}
          slotProps={{
            toolbar: {
              pagination: pagination,
              showHeaderRow: showHeaderRow,
              headerColumns: muiColumns,
              headerRow: headerRow,
              headerApiRef: headerApiRef,
            },
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

