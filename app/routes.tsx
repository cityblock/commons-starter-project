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

const Homepage: React.StatelessComponent = props => <p>homepage</p>;

export default (
  <MainContainer>
    <Switch>
      <Route exact path="/" component={Homepage} />
    </Switch>
  </MainContainer>
);
