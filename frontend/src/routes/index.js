import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import NotFound from '@pages/NotFound';
import publicRoute from './publicRoute';
import protectedRoutes from './protectedRoute';
import ProtectedRoute from './protectedRoute/protectedRoute';
import ROUTES from '@constants/routes';
import CONSTANTS from '@constants';

import LayoutUser from '@components/Layout/User';
import LayoutAdmin from '@components/Layout/Admin';

const AppRoutes = () => {
  const token = useSelector(state => state.auth?.token);
  const isAuthenticated = !!token;

  return (
    <Routes>
      {/* Public routes */}
      {publicRoute.map(({ path, element, hideWhenAuthenticated }, index) => {
        if (isAuthenticated && hideWhenAuthenticated) {
          return <Route key={index} path={path} element={<Navigate to={ROUTES.HOME} replace />} />;
        }
        return <Route key={index} path={path} element={<LayoutUser>{element}</LayoutUser>} />;
      })}

      {/* Private routes */}
      {protectedRoutes.map(({ path, element, requiredRole }, index) => {
        const Layout = requiredRole === CONSTANTS.ADMIN ? LayoutAdmin : LayoutUser;

        return (
          <Route
            key={index}
            path={path}
            element={
              <ProtectedRoute requiredRole={requiredRole} element={<Layout>{element}</Layout>} />
            }
          />
        );
      })}

      <Route path="*" element={<NotFound />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
