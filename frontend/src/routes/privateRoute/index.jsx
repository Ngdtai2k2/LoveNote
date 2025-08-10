import ROUTES from '@constants/routes';
import Cancel from '@pages/Payment/Cancel';
// payment
import Success from '@pages/Payment/Success';
import Reward from '@pages/Reward';
import Tasks from '@pages/Tasks';
import VerifyTokenTask from '@pages/Tasks/verifyToken';
import ChangePassword from '@pages/User/Auth/Password/ChangePassword';
import Profile from '@pages/User/Profile';

const privateRoutes = [
  {
    path: ROUTES.USER.ME,
    element: <Profile />,
    isPrivate: true,
  },
  {
    path: ROUTES.AUTH.CHANGE_PASSWORD,
    element: <ChangePassword />,
    isPrivate: true,
  },
  {
    path: ROUTES.TASKS,
    element: <Tasks />,
    isPrivate: true,
  },
  {
    path: ROUTES.VERIFY_TOKEN_TASK,
    element: <VerifyTokenTask />,
    isPrivate: true,
    hideLayout: true,
  },
  {
    path: ROUTES.REWARD,
    element: <Reward />,
    isPrivate: true,
  },
  {
    path: ROUTES.PAYMENT.SUCCESS,
    element: <Success />,
    isPrivate: true,
  },
  {
    path: ROUTES.PAYMENT.CANCEL,
    element: <Cancel />,
    isPrivate: true,
  },
];

export default privateRoutes;
