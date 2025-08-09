import Dashboard from '@pages/Admin/Dashboard';
import ROUTES from '@constants/routes';
import CONSTANTS from '@constants';
import UsersManager from '../../pages/Admin/Users';

const protectedRoutes = [
  {
    path: ROUTES.ADMIN.HOME,
    element: <Dashboard />,
    requiredRole: CONSTANTS.ADMIN,
  },
  {
    path: ROUTES.ADMIN.DASHBOARD,
    element: <Dashboard />,
    requiredRole: CONSTANTS.ADMIN,
  },
  {
    path: ROUTES.ADMIN.USERS,
    element: <UsersManager />,
    requiredRole: CONSTANTS.ADMIN,
  },
];

export default protectedRoutes;
