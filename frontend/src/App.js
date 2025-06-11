import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-fox-toast';
import { useTranslation } from 'react-i18next';

import './App.css';
import NavBar from '@components/NavBar';
import LayoutUser from '@components/Layout/User';
import AppRoutes from './routes';
import { useAxios } from '@hooks/useAxiosJWT';
import { getCurrentUser } from '@api/user';

function App() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { axiosJWT } = useAxios(i18n.language);

  useEffect(() => {
    getCurrentUser(dispatch, axiosJWT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LayoutUser>
      <ToastContainer />
      <NavBar />
      <AppRoutes />
    </LayoutUser>
  );
}

export default App;
