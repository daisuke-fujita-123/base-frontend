import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { _expApiClient } from './ApiClient';

/**
 * User
 */
type User = {
  employeeId: string;
  employeeName: string;
  organizationId: string;
  organizationName: string;
  taskDate: string;
  editPossibleScreenIdList: string[];
};

/**
 * AuthContext
 */
type AuthContextType = {
  user: User;
};

/**
 * AppContext
 */
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

/**
 * ApiClientState
 */
const initialValues: AuthContextType = {
  user: {
    employeeId: '',
    employeeName: '',
    organizationId: '',
    organizationName: '',
    taskDate: '',
    editPossibleScreenIdList: [],
  },
};

/**
 * AuthProviderProps
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider
 */
const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;

  // state
  const [authContext, setAuthContext] =
    useState<AuthContextType>(initialValues);
  const [initialized, setInitialized] = useState(false);

  const initialize = async () => {
    const response = await _expApiClient.post(
      '/_exp/scr-com-9999/get-user-info'
    );
    setAuthContext({ user: response.data });
    setInitialized(true);
  };

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized) return <div>Loading....</div>;

  return (
    <>
      <AuthContext.Provider value={authContext}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
