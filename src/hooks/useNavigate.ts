import { useContext } from 'react';
import { NavigateOptions } from 'react-router-dom';

import { AppContext } from 'providers/AppContextProvider';

/**
 * useNavigate
 */
export const useNavigate = () => {
  // context
  const { navigate: navigateContext } = useContext(AppContext);

  const navigate = (
    to: string | number,
    newTab = false,
    options?: NavigateOptions
  ) => {
    if (newTab && to === 'string') {
      window.open(to, '_blank');
    } else {
      navigateContext(to, options);
    }
  };

  return navigate;
};
