import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  RouteProps,
  Redirect
} from "react-router-dom";

import { setSessionLoaded, setSessionUser } from "./actions";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import ReelSpinner from "./components/ReelSpinner";
import { Path } from "./constants";
import ExplorePage from "./pages/ExplorePage";
import FriendsPage from "./pages/FriendsPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MyMoviesPage from "./pages/MyMoviesPage";
import SignupPage from "./pages/SignupPage";
import WatchPage from "./pages/WatchPage";
import { GlobalState, User } from "./types";

interface AuthenticationRouteProps extends RouteProps {
  sessionUser: User | null;
  children: JSX.Element | Array<JSX.Element>;
}

const AuthenticatedRoute = ({
  children,
  sessionUser,
  ...routeProps
}: AuthenticationRouteProps) => (
  <Route
    {...routeProps}
    render={() =>
      Boolean(sessionUser) ? children : <Redirect to={Path.loginPage} />
    }
  />
);

const UnauthenticatedRoute = ({
  children,
  sessionUser,
  ...routeProps
}: AuthenticationRouteProps) => (
  <Route
    {...routeProps}
    render={() =>
      !sessionUser ? children : <Redirect to={Path.explorePage} />
    }
  />
);

const App = (): JSX.Element => {
  const hasSessionLoaded = useSelector(
    (state: GlobalState) => state.hasSessionLoaded
  );
  const sessionUser = useSelector((state: GlobalState) => state.sessionUser);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/session")
      .then(response => response.json())
      .then((data: { user: User | null }) => {
        dispatch(setSessionLoaded(true));
        dispatch(setSessionUser(data.user));
      })
      .catch(error => alert("Something went wrong, please refresh the page."));
  }, []);

  return (
    <Router>
      <div className="fill-height">
        {hasSessionLoaded ? (
          <div className="fill-height">
            <UnauthenticatedRoute path="/" exact sessionUser={sessionUser}>
              <LandingPage setSessionUser={setSessionUser} />
            </UnauthenticatedRoute>
            <UnauthenticatedRoute
              path={Path.landingPage}
              sessionUser={sessionUser}
            >
              <LandingPage setSessionUser={setSessionUser} />
            </UnauthenticatedRoute>
            <UnauthenticatedRoute
              path={Path.loginPage}
              sessionUser={sessionUser}
            >
              <LoginPage setSessionUser={setSessionUser} />
            </UnauthenticatedRoute>
            <UnauthenticatedRoute
              path={Path.signupPage}
              sessionUser={sessionUser}
            >
              <SignupPage setSessionUser={setSessionUser} />
            </UnauthenticatedRoute>
            <AuthenticatedRoute
              path={Path.explorePage}
              sessionUser={sessionUser}
            >
              <ExplorePage
                sessionUser={sessionUser!}
                setSessionUser={setSessionUser}
              />
            </AuthenticatedRoute>
            <AuthenticatedRoute path={Path.watchPage} sessionUser={sessionUser}>
              <WatchPage
                sessionUser={sessionUser!}
                setSessionUser={setSessionUser}
              />
            </AuthenticatedRoute>
            <AuthenticatedRoute
              path={Path.myMoviesPage}
              sessionUser={sessionUser}
            >
              <MyMoviesPage
                sessionUser={sessionUser!}
                setSessionUser={setSessionUser}
              />
            </AuthenticatedRoute>
            <AuthenticatedRoute
              path={Path.friendsPage}
              sessionUser={sessionUser}
            >
              <FriendsPage
                sessionUser={sessionUser!}
                setSessionUser={setSessionUser}
              />
            </AuthenticatedRoute>
          </div>
        ) : (
          <div className="full-page-spinner">
            <ReelSpinner />
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
