import React from 'react';

import { CenterBox, MarginBox } from 'layouts/Box';
import { Stack } from 'layouts/Stack';

import { Typography } from 'controls/Typography';

/**
 * Logout
 */
const Logout = () => {
  return (
    <CenterBox>
      <MarginBox mt={5}>
        <Stack>
          <Typography variant='h5'>ログアウトしました。</Typography>
          <Typography variant='h5'>
            ブラウザウィンドウを閉じてください。
          </Typography>
        </Stack>
      </MarginBox>
    </CenterBox>
  );
};

export default Logout;
