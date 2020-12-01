import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import * as authActions from "./redux/auth/authActions";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));

const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    Yükleniyor...
  </div>
);

const UnauthenticatedRoutes = () => (
  <Switch>
    <Route path='/auth/login' exact component={Login} />
    <Redirect from='/' to='/auth/login' />
  </Switch>
);

const AuthenticatedRoute = ({ children, ...rest }) => {
  const dispatch = useDispatch();
  dispatch(authActions.isAuthenticated());

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Route
      {...rest}
      render={() => (isAuthenticated ? children : <Redirect to='/' />)}
    ></Route>
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <AuthenticatedRoute path='/dashboard'>
          <Dashboard />
        </AuthenticatedRoute>

        <UnauthenticatedRoutes />
      </Switch>
    </Suspense>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.checkAuthState());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
