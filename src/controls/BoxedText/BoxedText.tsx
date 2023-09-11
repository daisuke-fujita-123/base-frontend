import React from 'react';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

export interface BoxedTextLabel {
  label?: string;
  field?: string;
}

export interface BoxedTextValue {
  [key: string]: string;
}

export interface BoxedTextProps {
  labels: BoxedTextLabel[];
  values: BoxedTextValue;
  backgroundColor?: string;
  getValueColor?: (field: string, value: string) => string | undefined;
  getFieldBackgroundColor?: (
    field: string,
    value: string
  ) => string | undefined;
}

export const BoxedText = (props: BoxedTextProps) => {
  const {
    labels,
    values,
    backgroundColor,
    getValueColor,
    getFieldBackgroundColor,
  } = props;

  return (
    <>
      <TableContainer
        component={Box}
        sx={{ width: 225, background: backgroundColor }}
      >
        <Table>
          <TableBody>
            {labels.map((x, i) => (
              <TableRow
                key={i}
                sx={{
                  background:
                    x.field &&
                    getFieldBackgroundColor &&
                    getFieldBackgroundColor(x.field, values[x.field]),
                }}
              >
                <TableCell
                  sx={{
                    padding: x.field ? 0 : 2,
                    border: x.field ? 'solid' : undefined,
                    borderWidth: x.field ? 1 : 0,
                    fontWeight: 'bold',
                  }}
                >
                  {x.label}
                </TableCell>
                <TableCell
                  sx={{
                    padding: x.field ? 0 : 2,
                    border: x.field ? 'solid' : undefined,
                    borderWidth: x.field ? 1 : 0,
                  }}
                >
                  <span
                    style={{
                      color:
                        x.field &&
                        getValueColor &&
                        getValueColor(x.field, values[x.field]),
                    }}
                  >
                    {x.field && values[x.field]}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
