import { Routes, Route, Navigate } from 'react-router-dom';
import publicRoute from './publicRoute';
import NotFound from '@pages/NotFound';

const AppRoutes = isAuthenticated => {
  return (
    <Routes>
      {publicRoute.map(({ path, element, hideWhenAuthenticated }, index) => {
        if (isAuthenticated && hideWhenAuthenticated) {
          return <Route key={index} path={path} element={<Navigate to="/" replace />} />;
        }
        return <Route key={index} path={path} element={element} />;
      })}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
