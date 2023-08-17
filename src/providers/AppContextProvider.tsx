import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom';

import { Dialog } from 'controls/Dialog';

import { DIALOGS } from 'definitions/dialogs';
import { MessageContext } from './MessageProvider';

/**
 * AppType
 */
type AppType = {
  navigateTo: string | number;
  navigateOptions?: NavigateOptions;
  needsConfirmNavigate: boolean;
};

/**
 * AppContextType
 */
type AppContextType = {
  appContext: AppType;
  navigate: (to: string | number, options?: NavigateOptions) => void;
  setNeedsConfirmNavigate: (value: boolean) => void;
  showDialog: (
    messageId: string,
    onClick: (buttonName: string) => void
  ) => void;
  saveState: (state: object) => void;
  loadState: () => object;
};

/**
 * AppContext
 */
export const AppContext = createContext<AppContextType>({} as AppContextType);

/**
 * AppType
 */
const initialValues: AppType = {
  navigateTo: '',
  navigateOptions: undefined,
  needsConfirmNavigate: false,
};

/**
 * AppContextProvicerProps
 */
interface AppContextProvicerProps {
  children: ReactNode;
}

const globalState: { [key: string]: any } = {};

/**
 * AppContextProvider
 */
const AppContextProvider = (props: AppContextProvicerProps) => {
  const { children } = props;

  // context
  const { getMessage } = useContext(MessageContext);

  // router
  const navigateReact = useNavigate();
  const location = useLocation();
  let to = location.pathname;
  if (location.search !== '') {
    to += location.search;
  }
  if (location.hash !== '') {
    to += location.hash;
  }

  // state
  const [appContext, setAppContext] = useState<AppType>({
    ...initialValues,
    navigateTo: to,
  });
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<any>({});

  useEffect(() => {
    if (appContext.needsConfirmNavigate) {
      showDialog('NAVIGATE_CONFIRM', (buttonName: string) => {
        if (buttonName === 'OK') {
          setAppContext((prev) => ({
            ...prev,
            needsConfirmNavigate: false,
          }));
        }
      });
    } else {
      if (typeof appContext.navigateTo === 'string') {
        navigateReact(appContext.navigateTo, appContext.navigateOptions);
      }
      if (typeof appContext.navigateTo === 'number') {
        navigateReact(appContext.navigateTo);
      }
    }
  }, [appContext]);

  const navigate = (to: string | number, options?: NavigateOptions) => {
    setAppContext((prev) => ({
      ...prev,
      navigateTo: to,
      navigateOptions: options,
    }));
  };

  const setNeedsConfirmNavigate = (value: boolean) => {
    // レンダリングが無限ループするので、setAppContextしないで直接更新する
    appContext.needsConfirmNavigate = value;
  };

  const showDialog = (
    dialogId: string,
    onClick: (buttonName: string) => void
  ) => {
    const dialogInfo = DIALOGS.find((x) => x.id === dialogId);

    setDialogInfo({
      title: getMessage(dialogInfo!.messageId),
      buttons: dialogInfo?.buttons.map((x: any) => {
        return {
          name: x,
          onClick: () => {
            setIsOpenDialog(false);
            onClick(x);
          },
        };
      }),
    });
    setIsOpenDialog(true);
  };

  const saveState = (state: object) => {
    globalState[location.pathname] = state;
  };

  const loadState = (): object => {
    const state = globalState[location.pathname];
    // delete globalState[location.pathname];
    return state;
  };

  return (
    <>
      <AppContext.Provider
        value={{
          appContext,
          navigate,
          setNeedsConfirmNavigate: setNeedsConfirmNavigate,
          showDialog,
          saveState,
          loadState,
        }}
      >
        {children}
      </AppContext.Provider>

      {/* ダイアログ */}
      {isOpenDialog && (
        <Dialog
          open={isOpenDialog}
          title={dialogInfo.title}
          buttons={dialogInfo.buttons}
        />
      )}
    </>
  );
};

export default AppContextProvider;
