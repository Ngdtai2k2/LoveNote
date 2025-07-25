import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '@routes/protectedRoute/protectedRoute';
import PrivateRoute from '@routes/privateRoute/privateRoute';

export const renderRoutes = (routes, LayoutComponent = React.Fragment, isAuthenticated = false) =>
  routes.map(({ path, element, isPrivate, requiredRole, hideLayout }, index) => {
    const Wrapper = hideLayout ? React.Fragment : LayoutComponent;

    let content = <Wrapper>{element}</Wrapper>;

    if (requiredRole) {
      content = <ProtectedRoute requiredRole={requiredRole} element={content} />;
    } else if (isPrivate) {
      content = <PrivateRoute isAuth={isAuthenticated} element={content} />;
    }

    return <Route key={index} path={path} element={content} />;
  });
