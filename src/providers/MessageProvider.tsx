import React, { createContext, ReactNode } from 'react';

import { messages } from 'providers/Message';

/**
 * MessageContextType
 */
type MessageContextType = {
  getMessage: (messageId: string) => string;
};

/**
 * MessageContext
 */
export const MessageContext = createContext<MessageContextType>(
  {} as MessageContextType
);

/**
 * MessageProviderProps
 */
interface MessageProviderProps {
  children: ReactNode;
}

/**
 * MessageProvider
 */
const MessageProvider = (props: MessageProviderProps) => {
  const { children } = props;

  const getMessage = (messageId: string): string => {
    const message = messages.find((x) => x.id === messageId);
    return message !== undefined ? message.message : 'undefined';
  };

  return (
    <>
      <MessageContext.Provider value={{ getMessage }}>
        {children}
      </MessageContext.Provider>
    </>
  );
};

export default MessageProvider;
