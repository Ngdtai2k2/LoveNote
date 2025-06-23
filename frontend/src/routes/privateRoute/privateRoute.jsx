import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import ROUTES from '@constants/routes';

const PrivateRoutes = ({ element, isAuth }) => {
  if (isAuth) return element;
  return <Navigate to={ROUTES.AUTH.SIGN_IN} replace />;
};

PrivateRoutes.propTypes = {
  element: PropTypes.element.isRequired,
  isAuth: PropTypes.bool,
};

export default PrivateRoutes;
