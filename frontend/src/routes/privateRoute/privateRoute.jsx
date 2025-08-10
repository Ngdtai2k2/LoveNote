import ROUTES from '@constants/routes';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ element, isAuth }) => {
  if (isAuth) return element;
  return <Navigate to={ROUTES.AUTH.SIGN_IN} replace />;
};

PrivateRoutes.propTypes = {
  element: PropTypes.element.isRequired,
  isAuth: PropTypes.bool,
};

export default PrivateRoutes;
