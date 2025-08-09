import Dashboard from '@pages/Admin/Dashboard';
import UsersManager from '@pages/Admin/Users';
import LogViewer from '@pages/Admin/LogViewer';

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
  {
    path: ROUTES.ADMIN.USERS,
    element: <UsersManager />,
    requiredRole: CONSTANTS.ADMIN,
  },
  {
    path: ROUTES.ADMIN.LOGS,
    element: <LogViewer />,
    requiredRole: CONSTANTS.ADMIN,
  },
];

export default protectedRoutes;
