import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import NotFound from '@pages/NotFound';
import publicRoute from './publicRoute';
import protectedRoutes from './protectedRoute';
import ProtectedRoute from './protectedRoute/protectedRoute';

import LayoutUser from '@components/Layout/User';
import LayoutAdmin from '@components/Layout/Admin';
import ROUTES from '@constants/routes';
import CONSTANTS from '@constants';

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
      {publicRoute.map(({ path, element, hideWhenAuthenticated }, index) => {
        if (isAuthenticated && hideWhenAuthenticated) {
          return <Route key={index} path={path} element={<Navigate to={ROUTES.HOME} replace />} />;
        }
        return <Route key={index} path={path} element={<LayoutUser>{element}</LayoutUser>} />;
      })}

      {adminRoutes.map(({ path, element, requiredRole }, index) => (
        <Route
          key={index}
          path={path}
          element={
            <ProtectedRoute
              requiredRole={requiredRole}
              element={<LayoutAdmin>{element}</LayoutAdmin>}
            />
          }
        />
      ))}

      <Route
        path={`${CONSTANTS.ADMIN_PREFIX}/*`}
        element={
          <LayoutAdmin>
            <NotFound isAdmin={true} />
          </LayoutAdmin>
        }
      />

      {userRoutes.map(({ path, element, requiredRole }, index) => (
        <Route
          key={index}
          path={path}
          element={
            <ProtectedRoute
              requiredRole={requiredRole}
              element={<LayoutUser>{element}</LayoutUser>}
            />
          }
        />
      ))}

      <Route
        path={`${CONSTANTS.ADMIN_PREFIX}/*`}
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
