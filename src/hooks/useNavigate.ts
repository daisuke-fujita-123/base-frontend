import { useContext } from 'react';

import { AppContext } from 'providers/AppContextProvider';

/**
 * useNavigate
 */
export const useNavigate = () => {
  // context
  const { navigate: navigateContext } = useContext(AppContext);

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  const navigate = (to: string | number, newTab: boolean = false) => {
    if (newTab && to === 'string') {
      window.open(to, '_blank');
    } else {
      navigateContext(to);
    }
  };

  return navigate;
};
