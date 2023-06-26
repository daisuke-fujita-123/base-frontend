import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Dialog } from 'controls/Dialog';

import {
  _expApiClient,
  comApiClient,
  docApiClient,
  memApiClient,
  traApiClient,
} from 'providers/ApiClient';

import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AppContext } from './AppContextProvider';
import { MessageContext } from './MessageProvider';

/**
 * ApiClientState
 */
type ApiClientState = {
  isLoading: boolean;
  isError: boolean;
};

/**
 * ApiClientContext
 */
type ApiClientContext = {
  apiClientState: ApiClientState;
};

/**
 * ApiClientContext
 */
export const ApiClientContext = createContext<ApiClientContext>(
  {} as ApiClientContext
);

/**
 * ApiClientState
 */
const initialValues: ApiClientState = {
  isLoading: false,
  isError: false,
};

/**
 * ApiClientProviderProps
 */
interface ApiClientProviderProps {
  children: ReactNode;
}

/**
 * ApiClientProvider
 */
const ApiClientProvider = (props: ApiClientProviderProps) => {
  const { children } = props;

  // context
  const { showDialog } = useContext(AppContext);
  const { getMessage } = useContext(MessageContext);

  // state
  const [apiClientState, setApiClientState] =
    useState<ApiClientState>(initialValues);

  const requestInterceptorHandler = (
    request: InternalAxiosRequestConfig<any>
  ) => {
    setApiClientState((prev) => ({
      ...apiClientState,
      isLoading: true,
    }));
    return request;
  };

  const responseInterceptorHandler = (response: AxiosResponse<any, any>) => {
    setApiClientState((prev) => ({
      ...apiClientState,
      isLoading: false,
    }));
    return response;
  };

  const errorInterceptorHandler = (error: any) => {
    setApiClientState((prev) => ({
      ...apiClientState,
      isLoading: false,
      isError: true,
    }));
    showDialog('SYSTEM_ERROR', () => {
      console.log('close dialog');
    });
    return Promise.reject(error);
  };

  useEffect(() => {
    const memRequestInterceptor = memApiClient.interceptors.request.use(
      requestInterceptorHandler
    );
    const memResponseInterceptor = memApiClient.interceptors.response.use(
      responseInterceptorHandler,
      errorInterceptorHandler
    );
    const traRequestInterceptor = comApiClient.interceptors.request.use(
      requestInterceptorHandler
    );
    const traResponseInterceptor = comApiClient.interceptors.response.use(
      responseInterceptorHandler,
      errorInterceptorHandler
    );
    const docRequestInterceptor = comApiClient.interceptors.request.use(
      requestInterceptorHandler
    );
    const docResponseInterceptor = comApiClient.interceptors.response.use(
      responseInterceptorHandler,
      errorInterceptorHandler
    );
    const comRequestInterceptor = comApiClient.interceptors.request.use(
      requestInterceptorHandler
    );
    const comResponseInterceptor = comApiClient.interceptors.response.use(
      responseInterceptorHandler,
      errorInterceptorHandler
    );
    const _expRequestInterceptor = comApiClient.interceptors.request.use(
      requestInterceptorHandler
    );
    const _expResponseInterceptor = comApiClient.interceptors.response.use(
      responseInterceptorHandler,
      errorInterceptorHandler
    );
    return () => {
      memApiClient.interceptors.request.eject(memRequestInterceptor);
      memApiClient.interceptors.response.eject(memResponseInterceptor);
      traApiClient.interceptors.request.eject(traRequestInterceptor);
      traApiClient.interceptors.response.eject(traResponseInterceptor);
      docApiClient.interceptors.request.eject(docRequestInterceptor);
      docApiClient.interceptors.response.eject(docResponseInterceptor);
      comApiClient.interceptors.request.eject(comRequestInterceptor);
      comApiClient.interceptors.response.eject(comResponseInterceptor);
      _expApiClient.interceptors.request.eject(_expRequestInterceptor);
      _expApiClient.interceptors.response.eject(_expResponseInterceptor);
    };
  });

  // const ErrorDialogButtons = [
  //   {
  //     name: 'OK',
  //     onClick: () => {
  //       setApiClientState((prev) => ({ ...prev, isError: false }));
  //     },
  //   },
  // ];

  return (
    <>
      <ApiClientContext.Provider value={{ apiClientState }}>
        {children}
      </ApiClientContext.Provider>

      {/* ダイアログ */}
      <Dialog
        open={apiClientState.isLoading}
        title={getMessage('MSG-0001')}
        buttons={[]}
      />
    </>
  );
};

export default ApiClientProvider;
