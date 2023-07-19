import React, { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";
import SetAuth from "../routes/SetAuth";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      <div className="whole-main">
        {isLoggedIn && <Navigation userObj={userObj} />}
        <Switch>
          {isLoggedIn ? (
            <>
              <Route exact path="/">
                <Home userObj={userObj} />
              </Route>
              <Route exact path="/profile">
                <Profile userObj={userObj} refreshUser={refreshUser} />
              </Route>
            </>
          ) : (
            <>
              <Route exact path="/">
                <Auth />
              </Route>
              <Route exact path="/setAuth">
                <SetAuth refreshUser={refreshUser} />
              </Route>
              <Redirect from="*" to="/" />
            </>
          )}
        </Switch>
      </div>
    </Router>
  );
};
export default AppRouter;
