import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { theme } from 'controls/theme';

import ApiClientProvider from 'providers/ApiClientProvider';
import AppContextProvider from 'providers/AppContextProvider';
import MessageProvider from 'providers/MessageProvider';

import { ThemeProvider } from '@mui/material/styles';
import { LicenseInfo } from '@mui/x-license-pro';
import AppRoute from 'routes/AppRoute';

LicenseInfo.setLicenseKey(
  '9e8f3ae5776c28cc3be840ba1f975c3fTz02MjIyMyxFPTE3MTA2NDA5NzA3NzEsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
);

/**
 * Appコンポーネント
 */
const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MessageProvider>
          <AppContextProvider>
            <ApiClientProvider>
              <AppRoute />
            </ApiClientProvider>
          </AppContextProvider>
        </MessageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

