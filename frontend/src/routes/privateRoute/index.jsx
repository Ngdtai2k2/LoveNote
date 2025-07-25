import ROUTES from '@constants/routes';

import Profile from '@pages/User/Profile';
import ChangePassword from '@pages/User/Auth/Password/ChangePassword';
import VerifyTokenTask from '@pages/Tasks/verifyToken';
import Tasks from '@pages/Tasks';
import Reward from '@pages/Reward';

// payment
import Success from '@pages/Payment/Success';
import Cancel from '@pages/Payment/Cancel';

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
