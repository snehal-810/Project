import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const RoleRestrictedRoute = ({
  component: Component,
  allowedRoles,
  ...rest
}) => {
  const [authState] = useContext(AuthContext);
  console.log("RRR authstate", authState);
  console.log("!authState.status ", !authState.status);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authState.status) {
          // If user is not logged in, redirect to login page
          return <Redirect to="/student/login" />;
        }

        // If user's role is not allowed, redirect to unauthorized access page
        if (!allowedRoles.includes(authState.role)) {
          return <Redirect to="/" />;
        }

        // Render the component associated with the route
        return <Component {...props} />;
      }}
    />
  );
};

export default RoleRestrictedRoute;
