import ROUTES from '@constants/routes';
import Profile from '@pages/User/Profile';

const privateRoutes = [
  {
    path: ROUTES.USER.ME,
    element: <Profile />,
    isPrivate: true,
  },
];

export default privateRoutes;
