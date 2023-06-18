import { useContext } from 'react';

import { AppContext } from 'providers/AppContextProvider';

/**
 * useNavigate
 */
export const useNavigate = () => {
  // context
  const { navigateTo } = useContext(AppContext);

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  const navigate = (to: string, newTab: boolean = false) => {
    if (newTab) {
      window.open(to, '_blank');
    } else {
      navigateTo(to);
    }
  };

  return navigate;
};
