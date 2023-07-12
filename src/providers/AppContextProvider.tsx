import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

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
  needsConfitmTransition: boolean;
  // isLoading: boolean;
  // isError: boolean;
};

/**
 * AppContextType
 */
type AppContextType = {
  appContext: AppType;
  navigate: (to: string | number) => void;
  setNeedsConfitmTransition: (value: boolean) => void;
  showDialog: (
    messageId: string,
    onClick: (buttonName: string) => void
  ) => void;
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
  needsConfitmTransition: false,
};

/**
 * AppContextProvicerProps
 */
interface AppContextProvicerProps {
  children: ReactNode;
}

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

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const response = await _expApiClient.get('/_exp/user');
    setAppContext((prev) => ({ ...prev, user: response.data }));
  };

  const navigate = (to: string | number) => {
    if (appContext.needsConfitmTransition) {
      setAppContext((prev) => ({ ...prev, transitionDestination: to }));
      showDialog('TRANSITION_CONFIRM', (buttonName: string) => {
        if (buttonName === 'OK') {
          setAppContext((prev) => ({
            ...prev,
            needsConfitmTransition: false,
            transitionDestination: '',
          }));
          if (typeof appContext.transitionDestination === 'string') {
            navigateReact(appContext.transitionDestination);
          }
          if (typeof appContext.transitionDestination === 'number') {
            navigateReact(appContext.transitionDestination);
          }
        }
      });
      return;
    }
    if (typeof to === 'string') {
      navigateReact(to);
    }
    if (typeof to === 'number') {
      navigateReact(to);
    }
  };

  const setNeedsConfitmTransition = (value: boolean) => {
    // レンダリングが無限ループするので、setAppContextしないで直接更新する
    appContext.needsConfitmTransition = value;
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

  return (
    <>
      <AppContext.Provider
        value={{
          appContext,
          navigate,
          setNeedsConfitmTransition,
          showDialog,
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
