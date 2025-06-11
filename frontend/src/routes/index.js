import { Routes, Route } from 'react-router-dom';
import publicRoute from './publicRoute';

const AppRoutes = () => (
  <Routes>
    {publicRoute.map(({ path, element }, index) => (
      <Route key={index} path={path} element={element} />
    ))}
  </Routes>
);

export default AppRoutes;
