import CONSTANTS from '@constants';
import ROUTES from '@constants/routes';
import Dashboard from '@pages/Admin/Dashboard';
import LogViewer from '@pages/Admin/LogViewer';
import ShortenerProviderManager from '@pages/Admin/ShortenerProvider';
import UsersManager from '@pages/Admin/Users';
import VoucherManager from '@pages/Admin/Voucher';

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
    path: ROUTES.ADMIN.SHORTENER_PROVIDER,
    element: <ShortenerProviderManager />,
    requiredRole: CONSTANTS.ADMIN,
  },
  {
    path: ROUTES.ADMIN.LOGS,
    element: <LogViewer />,
    requiredRole: CONSTANTS.ADMIN,
  },
  {
    path: ROUTES.ADMIN.VOUCHER,
    element: <VoucherManager />,
    requiredRole: CONSTANTS.ADMIN,
  },
];

export default protectedRoutes;
