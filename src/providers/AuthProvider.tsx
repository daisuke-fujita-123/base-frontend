import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { useNavigate } from 'hooks/useNavigate';

import { _expApiClient, comApiPath, comBaseUrl } from './ApiClient';

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

  // router
  const navigate = useNavigate();

  // state
  const [authContext, setAuthContext] =
    useState<AuthContextType>(initialValues);
  const [initialized, setInitialized] = useState(false);

  const initialize = async () => {
    // TODO: バックエンドのセキュリティを有効にすると、コード管理マスタ取得APIもアクセス制御がかかるので、対応が必要
    const getCodeManagementMasterRequest = {
      codeId: 'STS-COM-0001',
    };
    const getCodeManagementMasterResponse = await _expApiClient.post(
      `${comApiPath}/scr-com-9999/get-code-management-master`,
      getCodeManagementMasterRequest
    );

    try {
      const getUserInfoResponse = await _expApiClient.post(
        `${comApiPath}/scr-com-9000/get-user-info`
      );
      setAuthContext({ user: getUserInfoResponse.data });
      setInitialized(true);
    } catch (error: any) {
      if (error.response.status === 403) {
        // セッションがない場合はログインする
        if (getCodeManagementMasterResponse.data.list[0].codeValue === '01') {
          // SAMLログインの場合、バックエンドを経由してIdPへリダイレクト
          window.location.href = `${comBaseUrl}${comApiPath}/saml2/login/base`;
        }
        if (getCodeManagementMasterResponse.data.list[0].codeValue === '02') {
          // パスワードログインの場合、ログイン画面に遷移
          setInitialized(true);
          navigate('/com/login');
        }
      }
    }
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
