import SignIn from '@pages/User/Auth/SignIn';
import SignUp from '@pages/User/Auth/SignUp';
import Home from '@pages/Home';
import ROUTES from '@constants/routes';

const publicRoute = [
  {
    path: ROUTES.AUTH.SIGN_IN,
    element: <SignIn />,
    hideWhenAuthenticated: true,
  },
  {
    path: ROUTES.AUTH.SIGN_UP,
    element: <SignUp />,
    hideWhenAuthenticated: true,
  },
  {
    path: ROUTES.HOME,
    element: <Home />,
    hideWhenAuthenticated: false,
  },
];

export default publicRoute;
