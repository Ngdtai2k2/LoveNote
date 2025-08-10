import ROUTES from '@constants/routes';
import About from '@pages/About';
import Contacts from '@pages/Contacts';
import Home from '@pages/Home';
import ForgotPassword from '@pages/User/Auth/Password/forgotPassword';
import ResetPassword from '@pages/User/Auth/Password/resetPassword';
import VerifyCode from '@pages/User/Auth/Password/verifyCode';
import SignIn from '@pages/User/Auth/SignIn';
import SignUp from '@pages/User/Auth/SignUp';

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
    path: ROUTES.AUTH.FORGOT_PASSWORD,
    element: <ForgotPassword />,
    hideWhenAuthenticated: true,
  },
  {
    path: ROUTES.AUTH.VERIFY_CODE,
    element: <VerifyCode />,
    hideWhenAuthenticated: true,
  },
  {
    path: ROUTES.AUTH.RESET_PASSWORD,
    element: <ResetPassword />,
    hideWhenAuthenticated: true,
  },
  {
    path: ROUTES.HOME,
    element: <Home />,
    hideWhenAuthenticated: false,
  },
  {
    path: ROUTES.CONTACTS,
    element: <Contacts />,
    hideWhenAuthenticated: false,
  },
  {
    path: ROUTES.ABOUT,
    element: <About />,
    hideWhenAuthenticated: false,
  },
];

export default publicRoute;
