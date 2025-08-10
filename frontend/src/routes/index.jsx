import CONSTANTS from '@constants';
import ROUTES from '@constants/routes';
import { renderRoutes } from '@helpers/renderRoutes';
import NotFound from '@pages/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useCurrentUser } from '@hooks/useCurrentUser';

import LayoutAdmin from '@components/Layout/Admin';
import LayoutUser from '@components/Layout/User';

import privateRoutes from './privateRoute';
import protectedRoutes from './protectedRoute';
import publicRoute from './publicRoute';
import templateRoutes from './templateRoute';
import UserTemplateRouter from './userTemplateRoute';

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

      {/* Template with configs */}
      <Route path="/:slug" element={<UserTemplateRouter />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
