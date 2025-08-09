import Dashboard from '@pages/Admin/Dashboard';
import ROUTES from '@constants/routes';
import CONSTANTS from '@constants';

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
];

export default protectedRoutes;
