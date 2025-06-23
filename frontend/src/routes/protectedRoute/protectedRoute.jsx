import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useCurrentUser } from '@hooks/useCurrentUser';
import ROUTES from '@constants/routes';
import CONSTANTS from '@constants';

const ProtectedRoute = ({ element, requiredRole }) => {
  const user = useCurrentUser();

  try {
    if (requiredRole === CONSTANTS.ADMIN && user?.role !== CONSTANTS.ADMIN) {
      return <Navigate to={ROUTES.NOT_FOUND} replace />;
    }
    return element;
  } catch (error) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRole: PropTypes.number,
};

export default ProtectedRoute;
