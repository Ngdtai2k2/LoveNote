import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import NotFound from '@pages/NotFound';
import publicRoute from './publicRoute';
import protectedRoutes from './protectedRoute';
import templateRoutes from './templateRoute';

import LayoutUser from '@components/Layout/User';
import LayoutAdmin from '@components/Layout/Admin';
import ROUTES from '@constants/routes';
import CONSTANTS from '@constants';
import { renderRoutes } from '@helpers/renderRoutes';

const AppRoutes = () => {
  const token = useSelector(state => state.auth?.token);
  const isAuthenticated = !!token;

  const adminRoutes = protectedRoutes.filter(route =>
    route.path.startsWith(CONSTANTS.ADMIN_PREFIX)
  );
  const userRoutes = protectedRoutes.filter(
    route => !route.path.startsWith(CONSTANTS.ADMIN_PREFIX)
  );

  return (
    <Routes>
      {publicRoute.map(({ path, element, hideWhenAuthenticated }, index) => (
        <Route
          key={index}
          path={path}
          element={
            isAuthenticated && hideWhenAuthenticated ? (
              <Navigate to={ROUTES.HOME} replace />
            ) : (
              <LayoutUser>{element}</LayoutUser>
            )
          }
        />
      ))}

      {renderRoutes(adminRoutes, LayoutAdmin)}
      {renderRoutes(userRoutes, LayoutUser)}
      {renderRoutes(templateRoutes)}

      {/* Admin NotFound */}
      <Route
        path={`${CONSTANTS.ADMIN_PREFIX}/*`}
        element={
          <LayoutAdmin>
            <NotFound isAdmin />
          </LayoutAdmin>
        }
      />

      {/* General NotFound */}
      <Route
        path="*"
        element={
          <LayoutUser>
            <NotFound />
          </LayoutUser>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
