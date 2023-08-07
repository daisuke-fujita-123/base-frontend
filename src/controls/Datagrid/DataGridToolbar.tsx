import React from 'react';

import { theme } from 'controls/theme';

import PagingAfter from 'icons/paging_after.png';
import PagingBefore from 'icons/paging_befor.png';
import PagingHead from 'icons/paging_head.png';
import PagingLast from 'icons/paging_last.png';

import {
  Pagination as MuiPagination,
  PaginationItem as MuiPaginationItem,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import {
  DataGridPro as MuiDataGridPro,
  gridPageCountSelector,
  gridPaginationModelSelector,
  GridValidRowModel,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';

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
 * GridPaginationコンポーネント
 */
const GridPagination = () => {
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

  const PagingAfterIcon = () => {
    return (
      <div>
        <img src={PagingAfter}></img>
      </div>
    );
  };
  const PagingBeforeIcon = () => {
    return (
      <div>
        <img src={PagingBefore}></img>
      </div>
    );
  };

  const PagingHeadIcon = () => {
    return (
      <div>
        <img src={PagingHead}></img>
      </div>
    );
  };
  const PagingLastIcon = () => {
    return (
      <div>
        <img src={PagingLast}></img>
      </div>
    );
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
        showFirstButton
        showLastButton
        renderItem={(item) => (
          <MuiPaginationItem
            slots={{
              previous: PagingBeforeIcon,
              next: PagingAfterIcon,
              first: PagingHeadIcon,
              last: PagingLastIcon,
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
 * GridToolbarコンポーネントのProps
 */
interface GridToolbarProps {
  pagination?: boolean;
  validationMessages?: string[];
  showHeaderRow?: boolean;
  headerColumns?: any[];
  headerRow?: GridValidRowModel;
  headerCheckboxSelection?: boolean;
  headerApiRef?: React.MutableRefObject<GridApiPro>;
}

/**
 * GridToolbarコンポーネント
 */
export const GridToolbar = (props: GridToolbarProps) => {
  const {
    pagination = false,
    validationMessages,
    showHeaderRow = false,
    headerColumns = [],
    headerRow = undefined,
    headerCheckboxSelection = false,
    headerApiRef,
  } = props;

  const displayRow =
    headerRow !== undefined
      ? { ...headerRow, internalId: -1 }
      : { internalId: -1 };

  return (
    <>
      {pagination && <GridPagination />}
      {validationMessages?.map((x, i) => (
        <div key={i}>{x}</div>
      ))}
      {showHeaderRow && (
        <StyledDataGrid
          columns={headerColumns}
          rows={[displayRow]}
          columnHeaderHeight={0}
          showCellVerticalBorder
          rowHeight={30}
          getRowId={(row) => row.internalId}
          checkboxSelection={headerCheckboxSelection}
          hideFooter
          apiRef={headerApiRef}
        />
      )}
    </>
  );
};
