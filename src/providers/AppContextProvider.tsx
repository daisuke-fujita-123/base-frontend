import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Dialog } from 'controls/Dialog';

import { _expApiClient } from './ApiClient';
import { MessageContext } from './MessageProvider';

const dialogInfos = [
  {
    id: 'SYSTEM_ERROR',
    messageId: 'MSG-0002',
    buttons: ['閉じる'],
  },
  {
    id: 'TRANSITION_CONFIRM',
    messageId: 'MSG-0003',
    buttons: ['キャンセル', 'OK'],
  },
];
/**
 * AppType
 */
type AppType = {
  user: any;
  transitionDestination: string | number;
  needsConfirmTransition: boolean;
  // isLoading: boolean;
  // isError: boolean;
};

/**
 * AppContextType
 */
type AppContextType = {
  appContext: AppType;
  navigate: (to: string | number) => void;
  setNeedsConfirmTransition: (value: boolean) => void;
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
  user: undefined,
  transitionDestination: '',
  needsConfirmTransition: false,
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

  // state
  const [appContext, setAppContext] = useState<AppType>(initialValues);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<any>({});

  // router
  const navigateReact = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    console.log(appContext);
    if (appContext.needsConfirmTransition) {
      showDialog('TRANSITION_CONFIRM', (buttonName: string) => {
        if (buttonName === 'OK') {
          setAppContext((prev) => ({
            ...prev,
            needsConfirmTransition: false,
          }));
        }
      });
    } else {
      if (typeof appContext.transitionDestination === 'string') {
        navigateReact(appContext.transitionDestination);
      }
      if (typeof appContext.transitionDestination === 'number') {
        navigateReact(appContext.transitionDestination);
      }
    }
  }, [appContext]);

  const initialize = async () => {
    const response = await _expApiClient.get('/_exp/user');
    setAppContext((prev) => ({ ...prev, user: response.data }));
  };

  const navigate = (to: string | number) => {
    setAppContext((prev) => ({ ...prev, transitionDestination: to }));
  };

  const setNeedsConfirmTransition = (value: boolean) => {
    // レンダリングが無限ループするので、setAppContextしないで直接更新する
    appContext.needsConfirmTransition = value;
  };

  const showDialog = (
    dialogId: string,
    onClick: (buttonName: string) => void
  ) => {
    const dialogInfo = dialogInfos.find((x) => x.id === dialogId);

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

  if (appContext.user === undefined) {
    return <></>;
  }

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
          setNeedsConfirmTransition,
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
