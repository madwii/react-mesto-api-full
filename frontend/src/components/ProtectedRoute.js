import React from 'react';
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props }) => {
// если пропс loggedIn = true, то даем доступ к компоненту в пропсе component
// если он равен false, то редиректим пользователя на страницу логина
  return (
    <Route>
      {
        () => props.loggedIn === true ? <Component {...props} /> : <Redirect to="./sign-in" />
      }
    </Route>
  )
}

export default ProtectedRoute;