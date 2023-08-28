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
  label: string | undefined;
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
}

export const BoxedText = (props: BoxedTextProps) => {
  const { labels, values, backgroundColor, getValueColor } = props;

  return (
    <>
      <TableContainer
        component={Box}
        sx={{ width: 225, background: backgroundColor }}
      >
        <Table>
          <TableBody>
            {labels.map((x, i) => (
              <TableRow key={i}>
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
                {x.field && (
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
                          getValueColor &&
                          getValueColor(x.field, values[x.field]),
                      }}
                    >
                      {values[x.field]}
                    </span>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
