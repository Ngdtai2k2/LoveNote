import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '@routes/protectedRoute/protectedRoute';

export const renderRoutes = (routes, LayoutComponent = React.Fragment) =>
  routes.map(({ path, element, requiredRole }, index) => (
    <Route
      key={index}
      path={path}
      element={
        <ProtectedRoute
          requiredRole={requiredRole}
          element={<LayoutComponent>{element}</LayoutComponent>}
        />
      }
    />
  ));
