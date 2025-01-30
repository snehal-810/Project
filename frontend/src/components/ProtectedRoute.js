import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({
  component: Component,
  allowedRoles,
  authState,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (authState.status && allowedRoles.includes(authState.role)) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/" />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
