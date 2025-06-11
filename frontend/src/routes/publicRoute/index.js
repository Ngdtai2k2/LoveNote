import SignIn from '@pages/User/Auth/SignIn';
import SignUp from '@pages/User/Auth/SignUp';
import Home from '@pages/Home';

const publicRoute = [
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/',
    element: <Home />,
  },
];

export default publicRoute;
