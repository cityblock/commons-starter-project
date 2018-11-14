import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainContainer from './main-container/main-container';

/**
 * What is <Switch>?
 * <Switch> makes the router behave like a normal router and render the first matched route
 * instead of all matched routes.
 *
 * NOTE: We async load infrequently used and admin routes
 */

export default (
  <MainContainer>
    <Switch>
      <Route exact path="/" render={props => <h3>hey hey</h3>} />
    </Switch>
  </MainContainer>
);
