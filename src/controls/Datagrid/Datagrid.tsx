import React, { useState } from 'react';

import { ObjectSchema, ValidationError } from 'yup';

import { InfoButton } from 'controls/Button';
import {
  GridCellForTooltip,
  GridCheckboxCell,
  GridCustomizableRadiioCell,
  GridDatepickerCell,
  GridFromtoCell,
  GridInputCell,
  GridRadioCell,
  GridSelectCell,
} from 'controls/Datagrid/DataGridCell';
import { GridToolbar } from 'controls/Datagrid/DataGridToolbar';
import {
  appendErrorToInvalids,
  convertFromInvalidToMessage,
  convertFromResolverToInvalids,
  convertFromSizeToWidth,
  InvalidModel,
  removeIdFromInvalids,
  resolveGridWidth,
} from 'controls/Datagrid/DataGridUtil';
import { Link } from 'controls/Link';
import { theme } from 'controls/theme';

import SortAsc from 'icons/content_sort_ascend.png';
import SortDesc from 'icons/content_sort_descend.png';

import { Box, Stack, styled, Tooltip } from '@mui/material';
import {
  DataGridPro as MuiDataGridPro,
  DataGridProProps,
  GridColDef as MuiGridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import Encoding from 'encoding-japanese';
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
   * required
   */
  required?: boolean;
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
    | 'fromto'
    | 'link'
    | 'button'
    | any[];
  /**
   * tooltip
   */
  tooltip?: boolean;
  /**
   * tooltip
   */
  validator?: any;
  /**
   * selectValues
   */
  selectValues?: any[]; // cellType = 'select'
  /**
   * radioValues
   */
  radioValues?: any[]; // cellType = 'radio'
  /**
   * radioInputTypes
   */
  radioInputTypes?: string[];
  /**
   * cellHelperText
   */
  cellHelperText?: string; // cellType = 'input'
  /**
   * cellHelperButton
   */
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
  /**
   * resolver
   */
  resolver?: ObjectSchema<any>;
  /**
   * controlled
   */
  controlled?: boolean;
  /**
   * disabled
   */
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
  /**
   * showHeaderRow
   */
  showHeaderRow?: boolean;
  /**
   * headerRow
   */
  headerRow?: GridValidRowModel;
  /**
   * headerApiRef
   */
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
  /**
   * onCellHelperButtonClick
   */
  onCellHelperButtonClick?: (firld: string, row: number) => void; // add, cellOptionalButton
  /**
   * getCellDisabled
   */
  getCellDisabled?: (params: any) => boolean;
  /**
   * getSelectValues
   */
  getSelectValues?: (params: any) => any[];
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
    controlled = true,
    resolver,
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
    getSelectValues,
    apiRef,
  } = props;

  const defaultInvalids: InvalidModel[] =
    resolver === undefined ? [] : convertFromResolverToInvalids(resolver);

  // state
  const [invalids, setInvalids] = useState<InvalidModel[]>(defaultInvalids);

  // handler
  const handleRowValueChange = async (row: any) => {
    if (resolver !== undefined) {
      // 一旦、変更行のバリデーションエラーを解除
      removeIdFromInvalids(invalids, row.id);
      try {
        await resolver.validate(row, { abortEarly: false });
      } catch (err) {
        if (err instanceof ValidationError) {
          // ハリデーションエラーがない場合は列のIDを追加
          appendErrorToInvalids(invalids, err.inner, row.id);
        }
      }
      setInvalids([...invalids]);
    }

    onRowValueChange && onRowValueChange(row);
  };

  // handler
  const handleLinkClick = (url: string) => {
    onLinkClick && onLinkClick(url);
  };

  // heander
  const handleClick = (params: any) => {
    onCellHelperButtonClick && onCellHelperButtonClick(params.field, params.id);
  };

  // heander
  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    return newRow;
  };

  const generateInputCell = (params: any) => {
    if (params.value === undefined) return <></>;

    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridInputCell
          id={params.id}
          value={params.value}
          field={params.field}
          width={params.colDef.width - 10}
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
    if (params.value === undefined) return <></>;

    const selectValues = getSelectValues
      ? getSelectValues(params)
      : params.colDef.selectValues;
    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridSelectCell
          id={params.id}
          value={params.value}
          field={params.field}
          selectValues={selectValues}
          controlled={controlled}
          width={params.colDef.width - 10}
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
    if (params.value === undefined) return <></>;

    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridRadioCell
          id={params.id}
          value={params.value}
          field={params.field}
          radioValues={params.colDef.radioValues}
          controlled={controlled}
          width={params.colDef.width - 10}
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
    if (params.value === undefined) return <></>;

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
    if (params.value === undefined) return <></>;

    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridCheckboxCell
          id={params.id}
          value={params.value}
          field={params.field}
          controlled={controlled}
          disabled={disabled || cellDisabled}
          onRowValueChange={handleRowValueChange}
        />
      </>
    );
  };

  const generateDatepickerCell = (params: any) => {
    if (params.value === undefined) return <></>;

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

  const generateFromtoCell = (params: any) => {
    if (params.value === undefined) return <></>;

    const cellDisabled = getCellDisabled ? getCellDisabled(params) : false;

    return (
      <>
        <GridFromtoCell
          id={params.id}
          value={params.value}
          field={params.field}
          width={params.colDef.width - 10}
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
    if (params.value === undefined) return <></>;

    const cellTypes = params.colDef.cellType;
    const stackWidth = params.colDef.width - 10;
    const elementWidth =
      (stackWidth - 20 * (cellTypes.length - 1)) / cellTypes.length;

    return (
      <>
        <Stack
          style={{ width: stackWidth, height: 16 }}
          direction='row'
          justifyContent='space-evenly'
          // divider={<Divider orientation='vertical' flexItem />}
        >
          {cellTypes.map((x: any, i: number) => {
            if (x.type === 'input') {
              return (
                <GridInputCell
                  key={i}
                  id={params.id}
                  value={params.value[i]}
                  field={[params.field, i]}
                  width={
                    x.helperText === undefined
                      ? elementWidth
                      : elementWidth - 40
                  }
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
                  controlled={controlled}
                  width={elementWidth}
                  onRowValueChange={handleRowValueChange}
                />
              );
            }
            return <>invalid cellType</>;
          })}
        </Stack>
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
    const width =
      value.width !== undefined
        ? value.width
        : convertFromSizeToWidth(value.size);

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
    if (value.cellType === 'fromto') {
      renderCell = generateFromtoCell;
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

    let renderHeader = value.renderHeader;
    if (value.required) {
      renderHeader = (params: GridColumnHeaderParams) => (
        <strong>
          {params.colDef.headerName}
          <span style={{ color: '#ff0000' }}> *</span>
        </strong>
      );
    }

    return {
      ...value,
      width: width,
      renderCell: renderCell,
      renderHeader: renderHeader,
    };
  });

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
          height: height ? height : '100%',
          width: width ? width : resolveGridWidth(muiColumns),
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
          columnHeaderHeight={35}
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
              validationMessages: convertFromInvalidToMessage(invalids),
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

export const exportCsv = (
  filename: string,
  apiRef: React.MutableRefObject<GridApiPro>
) => {
  const colDef = apiRef.current.getAllColumns();
  const rowIds = apiRef.current.getAllRowIds();

  // DataGridのid列の除外、囲み文字の追加
  const data = rowIds.map((x) => {
    const row = apiRef.current.getRow(x);
    delete row.id;
    Object.keys(row).forEach((key) => {
      const value = row[key];
      row[key] = `"${value}"`;
    });
    return row;
  });

  // CSVの文字列を生成
  const header =
    colDef
      .map((x) => {
        return `"${x.headerName}"`;
      })
      .join(',') + '\r\n';
  const rows = Papa.unparse(data, {
    delimiter: ',',
    newline: '\r\n',
    quoteChar: '',
    escapeChar: '',
    header: false,
  });

  // 文字コードをUnicodeからShift-JISに変換
  const unicode = Encoding.stringToCode(header + rows);
  const sjis = Encoding.convert(unicode, { from: 'UNICODE', to: 'SJIS' });

  // ダウンロード処理
  const u8a = new Uint8Array(sjis);
  const blob = new Blob([u8a]);
  saveAs(blob, filename);
};

