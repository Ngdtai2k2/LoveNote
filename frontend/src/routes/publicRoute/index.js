import SignIn from '@pages/User/Auth/SignIn';
import SignUp from '@pages/User/Auth/SignUp';
import Home from '@pages/Home';

const publicRoute = [
  {
    path: '/sign-in',
    element: <SignIn />,
    hideWhenAuthenticated: true,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
    hideWhenAuthenticated: true,
  },
  {
    path: '/',
    element: <Home />,
    hideWhenAuthenticated: false,
  },
];

export default publicRoute;
