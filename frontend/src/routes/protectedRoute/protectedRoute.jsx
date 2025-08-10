import CONSTANTS from '@constants';
import ROUTES from '@constants/routes';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { useCurrentUser } from '@hooks/useCurrentUser';

const ProtectedRoute = ({ element, requiredRole }) => {
  const user = useCurrentUser();

  try {
    if (requiredRole === CONSTANTS.ADMIN && user?.role !== Boolean(CONSTANTS.ADMIN)) {
      return <Navigate to={ROUTES.NOT_FOUND} replace />;
    }
    return element;
  } catch {
    return <Navigate to={ROUTES.HOME} replace />;
  }
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRole: PropTypes.number,
};

export default ProtectedRoute;
