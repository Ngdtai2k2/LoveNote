import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-fox-toast';
import { useTranslation } from 'react-i18next';

import AppRoutes from './routes';
import { useAxios } from '@hooks/useAxiosJWT';
import { userAPI } from '@api/user';

function App() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { axiosJWT } = useAxios(i18n.language);

  useEffect(() => {
    userAPI.getCurrentUser(dispatch, axiosJWT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="absolute z-[9999999]">
        <ToastContainer />
      </div>
      <AppRoutes />
    </>
  );
}

export default App;
