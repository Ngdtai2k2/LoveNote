import { Routes, Route, Navigate } from 'react-router-dom';

import NotFound from '@pages/NotFound';
import publicRoute from './publicRoute';
import protectedRoutes from './protectedRoute';
import privateRoutes from './privateRoute';
import templateRoutes from './templateRoute';

import LayoutUser from '@components/Layout/User';
import LayoutAdmin from '@components/Layout/Admin';

import ROUTES from '@constants/routes';
import CONSTANTS from '@constants';

import { renderRoutes } from '@helpers/renderRoutes';
import { useCurrentUser } from '@hooks/useCurrentUser';

const AppRoutes = () => {
  const user = useCurrentUser();

  const isAuthenticated = !!user;

  const isAdmin = user?.role === CONSTANTS.ADMIN;

  const adminRoutes = protectedRoutes.filter((route) =>
    route.path.startsWith(CONSTANTS.ADMIN_PREFIX)
  );
  const userRoutes = protectedRoutes.filter(
    (route) => !route.path.startsWith(CONSTANTS.ADMIN_PREFIX)
  );

  return (
    <Routes>
      {renderRoutes(adminRoutes, LayoutAdmin, isAuthenticated)}
      {renderRoutes(userRoutes, LayoutUser, isAuthenticated)}
      {renderRoutes(privateRoutes, LayoutUser, isAuthenticated)}
      {renderRoutes(templateRoutes)}

      {/* Public Routes */}
      {publicRoute.map(({ path, element, hideWhenAuthenticated }, index) => {
        const shouldRedirect = isAuthenticated && hideWhenAuthenticated;
        return (
          <Route
            key={index}
            path={path}
            element={
              shouldRedirect ? (
                <Navigate to={ROUTES.HOME} replace />
              ) : (
                <LayoutUser>{element}</LayoutUser>
              )
            }
          />
        );
      })}

      {/* 404 fallback */}
      <Route path={`${CONSTANTS.ADMIN_PREFIX}/*`} element={<NotFound isAdmin={isAdmin} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
