import ROUTES from '@constants/routes';
import Profile from '@pages/User/Profile';
import ChangePassword from '@pages/User/Auth/ChangePassword';

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
];

export default privateRoutes;
