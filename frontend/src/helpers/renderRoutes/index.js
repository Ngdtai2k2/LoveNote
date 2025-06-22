import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '@routes/protectedRoute/protectedRoute';
import PrivateRoute from '@routes/privateRoute/privateRoute';

export const renderRoutes = (routes, LayoutComponent = React.Fragment, isAuthenticated = false) =>
  routes.map(({ path, element, isPrivate, requiredRole }, index) => {
    let content = <LayoutComponent>{element}</LayoutComponent>;

    if (requiredRole) {
      content = <ProtectedRoute requiredRole={requiredRole} element={content} />;
    } else if (isPrivate) {
      content = <PrivateRoute isAuth={isAuthenticated} element={content} />;
    }

    return <Route key={index} path={path} element={content} />;
  });
